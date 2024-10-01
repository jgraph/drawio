/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
var mxUtils =
{
	/**
	 * Class: mxUtils
	 * 
	 * A singleton class that provides cross-browser helper methods.
	 * This is a global functionality. To access the functions in this
	 * class, use the global classname appended by the functionname.
	 * You may have to load chrome://global/content/contentAreaUtils.js
	 * to disable certain security restrictions in Mozilla for the <open>,
	 * <save>, <saveAs> and <copy> function.
	 * 
	 * For example, the following code displays an error message:
	 * 
	 * (code)
	 * mxUtils.error('Browser is not supported!', 200, false);
	 * (end)
	 * 
	 * Variable: errorResource
	 * 
	 * Specifies the resource key for the title of the error window. If the
	 * resource for this key does not exist then the value is used as
	 * the title. Default is 'error'.
	 */
	errorResource: (mxClient.language != 'none') ? 'error' : '',
	
	/**
	 * Variable: closeResource
	 * 
	 * Specifies the resource key for the label of the close button. If the
	 * resource for this key does not exist then the value is used as
	 * the label. Default is 'close'.
	 */
	closeResource: (mxClient.language != 'none') ? 'close' : '',

	/**
	 * Variable: errorImage
	 * 
	 * Defines the image used for error dialogs.
	 */
	errorImage: mxClient.imageBasePath + '/error.gif',
	
	/**
	 * Function: removeCursors
	 * 
	 * Removes the cursors from the style of the given DOM node and its
	 * descendants.
	 * 
	 * Parameters:
	 * 
	 * element - DOM node to remove the cursor style from.
	 */
	removeCursors: function(element)
	{
		if (element.style != null)
		{
			element.style.cursor = '';
		}
		
		var children = element.childNodes;
		
		if (children != null)
		{
	        var childCount = children.length;
	        
	        for (var i = 0; i < childCount; i += 1)
	        {
	            mxUtils.removeCursors(children[i]);
	        }
	    }
	},

	/**
	 * Function: getCurrentStyle
	 * 
	 * Returns the current style of the specified element.
	 * 
	 * Parameters:
	 * 
	 * element - DOM node whose current style should be returned.
	 */
	getCurrentStyle: function()
	{
		if (mxClient.IS_IE && (document.documentMode == null || document.documentMode < 9))
		{
			return function(element)
			{
				return (element != null) ? element.currentStyle : null;
			};
		}
		else
		{
			return function(element)
			{
				return (element != null) ?
					window.getComputedStyle(element, '') :
					null;
			};
		}
	}(),
		
	/**
	 * Function: getCssFontFamily
	 * 
	 * Gets the CSS font family or families without quotes.
	 */
	getCssFontFamily: function(fontFamily)
	{
		if (typeof fontFamily === 'string')
		{
			var tokens = fontFamily.split(',');

			for (var i = 0; i < tokens.length; i++)
			{
				tokens[i] = mxUtils.trim(tokens[i]);

				if (tokens[i].charAt(0) == '"' && tokens[i].charAt(tokens[i].length - 1) == '"')
				{
					tokens[i] = tokens[i].substring(1, tokens[i].length - 1);
				}
			}

			fontFamily = tokens.join(', ');
		}

		return fontFamily;
	},

	/**
	 * Function: parseCssFontFamily
	 * 
	 * Parses the given CSS font family or families and returns a properly
	 * quotes and escaped font family definition for use in CSS.
	 */
	parseCssFontFamily: function(fontFamily, htmlEntities)
	{
		if (typeof fontFamily === 'string')
		{
			var tokens = fontFamily.split(',');

			for (var i = 0; i < tokens.length; i++)
			{
				tokens[i] = mxUtils.trim(tokens[i]);

				if (tokens[i].charAt(0) == '"' && tokens[i].charAt(tokens[i].length - 1) == '"')
				{
					tokens[i] = tokens[i].substring(1, tokens[i].length - 1);
				}

				if (htmlEntities)
				{
					tokens[i] = mxUtils.htmlEntities(tokens[i]);
				}

				tokens[i] = '"' + tokens[i] + '"';
			}

			fontFamily = tokens.join(', ');
		}

		return fontFamily;
	},
	
	/**
	 * Function: parseCssNumber
	 * 
	 * Parses the given CSS numeric value adding handling for the values thin,
	 * medium and thick (2, 4 and 6).
	 */
	parseCssNumber: function(value)
	{
		if (value == 'thin')
		{
			value = '2';
		}
		else if (value == 'medium')
		{
			value = '4';
		}
		else if (value == 'thick')
		{
			value = '6';
		}
		
		value = parseFloat(value);
		
		if (isNaN(value))
		{
			value = 0;
		}
		
		return value;
	},

	/**
	 * Function: setPrefixedStyle
	 * 
	 * Adds the given style with the standard name and an optional vendor prefix for the current
	 * browser.
	 * 
	 * (code)
	 * mxUtils.setPrefixedStyle(node.style, 'transformOrigin', '0% 0%');
	 * (end)
	 */
	setPrefixedStyle: function()
	{
		var prefix = null;
		
		if (mxClient.IS_OT)
		{
			prefix = 'O';
		}
		else if (mxClient.IS_SF || mxClient.IS_GC)
		{
			prefix = 'Webkit';
		}
		else if (mxClient.IS_MT)
		{
			prefix = 'Moz';
		}
		else if (mxClient.IS_IE && document.documentMode >= 9 && document.documentMode < 10)
		{
			prefix = 'ms';
		}

		return function(style, name, value)
		{
			style[name] = value;
			
			if (prefix != null && name.length > 0)
			{
				name = prefix + name.substring(0, 1).toUpperCase() + name.substring(1);
				style[name] = value;
			}
		};
	}(),
	
	/**
	 * Function: hasScrollbars
	 * 
	 * Returns true if the overflow CSS property of the given node is either
	 * scroll or auto.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node whose style should be checked for scrollbars.
	 */
	hasScrollbars: function(node)
	{
		var style = mxUtils.getCurrentStyle(node);

		return style != null && (style.overflow == 'scroll' || style.overflow == 'auto');
	},
	
	/**
	 * Function: bind
	 * 
	 * Returns a wrapper function that locks the execution scope of the given
	 * function to the specified scope. Inside funct, the "this" keyword
	 * becomes a reference to that scope.
	 */
	bind: function(scope, funct)
	{
		return function()
		{
			return funct.apply(scope, arguments);
		};
	},
	
	/**
	 * Function: eval
	 * 
	 * Evaluates the given expression using eval and returns the JavaScript
	 * object that represents the expression result. Supports evaluation of
	 * expressions that define functions and returns the function object for
	 * these expressions.
	 * 
	 * Parameters:
	 * 
	 * expr - A string that represents a JavaScript expression.
	 */
	eval: function(expr)
	{
		var result = null;

		if (expr.indexOf('function') >= 0)
		{
			try
			{
				eval('var _mxJavaScriptExpression='+expr);
				result = _mxJavaScriptExpression;
				// TODO: Use delete here?
				_mxJavaScriptExpression = null;
			}
			catch (e)
			{
				mxLog.warn(e.message + ' while evaluating ' + expr);
			}
		}
		else
		{
			try
			{
				result = eval(expr);
			}
			catch (e)
			{
				mxLog.warn(e.message + ' while evaluating ' + expr);
			}
		}
		
		return result;
	},
	
	/**
	 * Function: findNode
	 * 
	 * Returns the first node where attr equals value.
	 * This implementation does not use XPath.
	 */
	findNode: function(node, attr, value)
	{
		if (node.nodeType == mxConstants.NODETYPE_ELEMENT)
		{
			var tmp = node.getAttribute(attr);
	
			if (tmp != null && tmp == value)
			{
				return node;
			}
		}
		
		node = node.firstChild;
		
		while (node != null)
		{
			var result = mxUtils.findNode(node, attr, value);
			
			if (result != null)
			{
				return result;
			}
			
			node = node.nextSibling;
		}
		
		return null;
	},

	/**
	 * Function: getFunctionName
	 * 
	 * Returns the name for the given function.
	 * 
	 * Parameters:
	 * 
	 * f - JavaScript object that represents a function.
	 */
	getFunctionName: function(f)
	{
		var str = null;

		if (f != null)
		{
			if (f.name != null)
			{
				str = f.name;
			}
			else
			{
				str = mxUtils.trim(f.toString());
				
				if (/^function\s/.test(str))
				{
					str = mxUtils.ltrim(str.substring(9));
					var idx2 = str.indexOf('(');
					
					if (idx2 > 0)
					{
						str = str.substring(0, idx2);
					}
				}
			}
		}
		
		return str;
	},

	/**
	 * Function: indexOf
	 * 
	 * Returns the index of obj in array or -1 if the array does not contain
	 * the given object.
	 * 
	 * Parameters:
	 * 
	 * array - Array to check for the given obj.
	 * obj - Object to find in the given array.
	 */
	indexOf: function(array, obj)
	{
		if (array != null && obj != null)
		{
			for (var i = 0; i < array.length; i++)
			{
				if (array[i] == obj)
				{
					return i;
				}
			}
		}
		
		return -1;
	},

	/**
	 * Function: lastIndexOf
	 * 
	 * Returns the last index of obj in array or -1 if the array does not contain
	 * the given object.
	 * 
	 * Parameters:
	 * 
	 * array - Array to check for the given obj.
	 * obj - Object to find in the given array.
	 */
	lastIndexOf: function(array, obj)
	{
		if (array != null && obj != null)
		{
			for (var i = array.length - 1; i >= 0; i--)
			{
				if (array[i] == obj)
				{
					return i;
				}
			}
		}
		
		return -1;
	},

	/**
	 * Function: forEach
	 * 
	 * Calls the given function for each element of the given array and returns
	 * the array.
	 * 
	 * Parameters:
	 * 
	 * array - Array that contains the elements.
	 * fn - Function to be called for each object.
	 */
	forEach: function(array, fn)
	{
		if (array != null && fn != null)
		{
			for (var i = 0; i < array.length; i++)
			{
				fn(array[i]);
			}
		}
		
		return array;
	},

	/**
	 * Function: remove
	 * 
	 * Removes all occurrences of the given object in the given array or
	 * object. If there are multiple occurrences of the object, be they
	 * associative or as an array entry, all occurrences are removed from
	 * the array or deleted from the object. By removing the object from
	 * the array, all elements following the removed element are shifted
	 * by one step towards the beginning of the array.
	 * 
	 * The length of arrays is not modified inside this function.
	 * 
	 * Parameters:
	 * 
	 * obj - Object to find in the given array.
	 * array - Array to check for the given obj.
	 */
	remove: function(obj, array)
	{
		var result = null;
		
		if (typeof(array) == 'object')
		{
			var index = mxUtils.indexOf(array, obj);
			
			while (index >= 0)
			{
				array.splice(index, 1);
				result = obj;
				index = mxUtils.indexOf(array, obj);
			}
		}

		for (var key in array)
		{
			if (array[key] == obj)
			{
				delete array[key];
				result = obj;
			}
		}
		
		return result;
	},
	
	/**
	 * Function: addItems
	 * 
	 * Adds all items from the given array to the given array.
	 * If an item is an array, then its members are added.
	 * 
	 * Parameters:
	 * 
	 * to - Array to add the items to.
	 * from - Array to add the items from.
	 */
	addItems: function(to, from)
	{
		for (var i = 0; i < from.length; i++)
		{
			if (from[i] != null)
			{
				if (from[i].constructor == Array)
				{
					mxUtils.addItems(to, from[i]);
				}
				else if (mxUtils.indexOf(to, from[i]) < 0)
				{
					to.push(from[i]);
				}
			}
		}
		
		return to;
	},
	
	/**
	 * Function: isNode
	 * 
	 * Returns true if the given value is an XML node with the node name
	 * and if the optional attribute has the specified value.
	 * 
	 * This implementation assumes that the given value is a DOM node if the
	 * nodeType property is numeric, that is, if isNaN returns false for
	 * value.nodeType.
	 * 
	 * Parameters:
	 * 
	 * value - Object that should be examined as a node.
	 * nodeName - String that specifies the node name.
	 * attributeName - Optional attribute name to check.
	 * attributeValue - Optional attribute value to check.
	 */
	isNode: function(value, nodeName, attributeName, attributeValue)
	{
		if (value != null && value.constructor === Element && (nodeName == null ||
			value.nodeName.toLowerCase() == nodeName.toLowerCase()))
		{
			return attributeName == null ||
				value.getAttribute(attributeName) == attributeValue;
		}
		
		return false;
	},
	
	/**
	 * Function: isAncestorNode
	 * 
	 * Returns true if the given ancestor is an ancestor of the
	 * given DOM node in the DOM. This also returns true if the
	 * child is the ancestor.
	 * 
	 * Parameters:
	 * 
	 * ancestor - DOM node that represents the ancestor.
	 * child - DOM node that represents the child.
	 */
	isAncestorNode: function(ancestor, child)
	{
		var parent = child;
		
		while (parent != null)
		{
			if (parent == ancestor)
			{
				return true;
			}

			parent = parent.parentNode;
		}
		
		return false;
	},

	/**
	 * Function: visitNodes
	 * 
	 * Calls visitor for each child of the given node, recursively.
	 * 
	 * Parameters:
	 * 
	 * node - Parent DOM node to visit the children of.
	 * visitor - Function to be called for each child node.
	 */
	visitNodes: function(node, visitor)
	{
		if (node.nodeType == mxConstants.NODETYPE_ELEMENT)
		{
			visitor(node);
			node = node.firstChild;
			
			while (node != null)
			{
				mxUtils.visitNodes(node, visitor);
				node = node.nextSibling;
			}
		}
	},

	/**
	 * Function: getChildNodes
	 * 
	 * Returns an array of child nodes that are of the given node type.
	 * 
	 * Parameters:
	 * 
	 * node - Parent DOM node to return the children from.
	 * nodeType - Optional node type to return. Default is
	 * <mxConstants.NODETYPE_ELEMENT>.
	 */
	getChildNodes: function(node, nodeType)
	{
		nodeType = nodeType || mxConstants.NODETYPE_ELEMENT;
		
		var children = [];
		var tmp = node.firstChild;
		
		while (tmp != null)
		{
			if (tmp.nodeType == nodeType)
			{
				children.push(tmp);
			}
			
			tmp = tmp.nextSibling;
		}
		
		return children;
	},

	/**
	 * Function: getChildNodes
	 * 
	 * Removes all child nodes of the given node.
	 * 
	 * Parameters:
	 * 
	 * node - Parent DOM node to remove the children from.
	 */
	removeChildNodes: function(node)
	{
		while (node.lastChild != null)
		{
			node.removeChild(node.lastChild);
		}
	},

	/**
	 * Function: importNode
	 * 
	 * Cross browser implementation for document.importNode. Uses document.importNode
	 * in all browsers but IE, where the node is cloned by creating a new node and
	 * copying all attributes and children into it using importNode, recursively.
	 * 
	 * Parameters:
	 * 
	 * doc - Document to import the node into.
	 * node - Node to be imported.
	 * allChildren - If all children should be imported.
	 */
	importNode: function(doc, node, allChildren)
	{
		if (mxClient.IS_IE && (document.documentMode == null || document.documentMode < 10))
		{
			return mxUtils.importNodeImplementation(doc, node, allChildren);
		}
		else
		{
			return doc.importNode(node, allChildren);
		}
	},

	/**
	 * Function: importNodeImplementation
	 * 
	 * Full DOM API implementation for importNode without using importNode API call.
	 * 
	 * Parameters:
	 * 
	 * doc - Document to import the node into.
	 * node - Node to be imported.
	 * allChildren - If all children should be imported.
	 */
	importNodeImplementation: function(doc, node, allChildren)
	{
		switch (node.nodeType)
		{
			case 1: /* element */
			{
				var newNode = doc.createElement(node.nodeName);
				
				if (node.attributes && node.attributes.length > 0)
				{
					for (var i = 0; i < node.attributes.length; i++)
					{
						newNode.setAttribute(node.attributes[i].nodeName,
							node.getAttribute(node.attributes[i].nodeName));
					}	
				}
				
				if (allChildren && node.childNodes && node.childNodes.length > 0)
				{
					for (var i = 0; i < node.childNodes.length; i++)
					{
						newNode.appendChild(mxUtils.importNodeImplementation(doc, node.childNodes[i], allChildren));
					}
				}
				
				return newNode;
			}
			case 3: /* text */
		    case 4: /* cdata-section */
		    case 8: /* comment */
		    {
		    	return doc.createTextNode((node.nodeValue != null) ? node.nodeValue : node.value);
		    }
		};
	},

	/**
	 * Function: createXmlDocument
	 * 
	 * Returns a new, empty XML document.
	 */
	createXmlDocument: function()
	{
		var doc = null;
		
		if (document.implementation && document.implementation.createDocument)
		{
			doc = document.implementation.createDocument('', '', null);
		}
	 	
	 	return doc;
	},

	/**
	 * Function: parseXml
	 * 
	 * Parses the specified XML string into a new XML document and returns the
	 * new document.
	 * 
	 * Example:
	 * 
	 * (code)
	 * var doc = mxUtils.parseXml(
	 *   '<mxGraphModel><root><MyDiagram id="0"><mxCell/></MyDiagram>'+
	 *   '<MyLayer id="1"><mxCell parent="0" /></MyLayer><MyObject id="2">'+
	 *   '<mxCell style="strokeColor=blue;fillColor=red" parent="1" vertex="1">'+
	 *   '<mxGeometry x="10" y="10" width="80" height="30" as="geometry"/>'+
	 *   '</mxCell></MyObject></root></mxGraphModel>');
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * xml - String that contains the XML data.
	 */
	parseXml: function(xml)
	{
		var parser = new DOMParser();
		
		return parser.parseFromString(xml, 'text/xml');
	},

	/**
	 * Function: getSvgDefs
	 * 
	 * Get or create the defs section in the given SVG element.
	 */
	getSvgDefs: function(svgRoot)
	{
		var doc = svgRoot.ownerDocument;
		var defs = svgRoot.getElementsByTagName('defs');
		var defsElt = null;
		
		if (defs.length == 0 || defs[0].parentNode != svgRoot)
		{
			defsElt = (doc.createElementNS != null) ?
				doc.createElementNS(mxConstants.NS_SVG, 'defs') :
				doc.createElement('defs');
			
			if (svgRoot.firstChild != null)
			{
				svgRoot.insertBefore(defsElt, svgRoot.firstChild);
			}
			else
			{
				svgRoot.appendChild(defsElt);
			}
		}
		else
		{
			defsElt = defs[0];
		}
	
		return defsElt;
	},

	/**
	 * Function: clearSelection
	 * 
	 * Clears the current selection in the page.
	 */
	clearSelection: function()
	{
		if (document.selection)
		{
			return function()
			{
				document.selection.empty();
			};
		}
		else if (window.getSelection)
		{
			return function()
			{
				if (window.getSelection().empty)
				{
					window.getSelection().empty();
				}
				else if (window.getSelection().removeAllRanges)
				{
					window.getSelection().removeAllRanges();
				}
			};
		}
		else
		{
			return function() { };
		}
	}(),

	/**
	 * Function: removeWhitespace
	 * 
	 * Removes the sibling text nodes for the given node that only consists
	 * of tabs, newlines and spaces.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node whose siblings should be removed.
	 * before - Optional boolean that specifies the direction of the traversal.
	 */
	removeWhitespace: function(node, before)
	{
		var tmp = (before) ? node.previousSibling : node.nextSibling;
		
		while (tmp != null && tmp.nodeType == mxConstants.NODETYPE_TEXT)
		{
			var next = (before) ? tmp.previousSibling : tmp.nextSibling;
			var text = mxUtils.getTextContent(tmp);
			
			if (mxUtils.trim(text).length == 0)
			{
				tmp.parentNode.removeChild(tmp);
			}
			
			tmp = next;
		}
	},
	
	/**
	 * Function: htmlEntities
	 * 
	 * Replaces characters (less than, greater than, newlines and quotes) with
	 * their HTML entities in the given string and returns the result.
	 * 
	 * Parameters:
	 * 
	 * s - String that contains the characters to be converted.
	 * newline - If newlines should be replaced. Default is true.
	 * quotes - If single and double quotes should be replaced.
	 * Default is true.
	 * tab - If tabs should be replaced with &#x9;. Default is true.
	 */
	htmlEntities: function(s, newline, quotes, tab)
	{
		s = String((s != null) ? s : '');
		
		s = s.replace(/&/g,'&amp;'); // 38 26
		s = s.replace(/</g,'&lt;'); // 60 3C
		s = s.replace(/>/g,'&gt;'); // 62 3E

		if (quotes == null || quotes)
		{
			s = s.replace(/"/g,'&quot;'); // 34 22
			s = s.replace(/\'/g,'&#39;'); // 39 27
		}

		if (newline == null || newline)
		{
			s = s.replace(/\n/g, '&#xa;');
		}

		if (tab == null || tab)
		{
			s = s.replace(/\t/g, '&#x9;');
		}
		
		return s;
	},
	
	/**
	 * Function: decodeHtml
	 * 
	 * Replaces HTML entities with the corresponding characters in the given html string.
	 * 
	 * Parameters:
	 * html - String that contains the HTML entities to be decoded.
	 */
	decodeHtml: function(html)
	{
		var txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	},

	/**
	 * Function: getXml
	 * 
	 * Returns the XML content of the specified node. For Internet Explorer,
	 * all \r\n\t[\t]* are removed from the XML string and the remaining \r\n
	 * are replaced by \n. All \n are then replaced with linefeed, or &#xa; if
	 * no linefeed is defined.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node to return the XML for.
	 * linefeed - Optional string that linefeeds are converted into. Default is
	 * &#xa;
	 */
	getXml: function(node, linefeed)
	{
		var xml = '';
		
		if (mxClient.IS_IE || mxClient.IS_IE11)
		{
			xml = mxUtils.getPrettyXml(node, '', '', '');
		}
		else if (window.XMLSerializer != null)
		{
			var xmlSerializer = new XMLSerializer();
			xml = xmlSerializer.serializeToString(node);
		}
		else if (node.xml != null)
		{
			xml = node.xml.replace(/\r\n\t[\t]*/g, '').
				replace(/>\r\n/g, '>').
				replace(/\r\n/g, '\n');
		}

		// Replaces linefeeds with HTML Entities.
		linefeed = linefeed || '&#xa;';
		xml = xml.replace(/\n/g, linefeed);
		  
		return xml;
	},
	
	/**
	 * Function: getPrettyXML
	 * 
	 * Returns a pretty printed string that represents the XML tree for the
	 * given node. This method should only be used to print XML for reading,
	 * use <getXml> instead to obtain a string for processing.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node to return the XML for.
	 * tab - Optional string that specifies the indentation for one level.
	 * Default is two spaces.
	 * indent - Optional string that represents the current indentation.
	 * Default is an empty string.
	 * newline - Option string that represents a linefeed. Default is '\n'.
	 */
	getPrettyXml: function(node, tab, indent, newline, ns)
	{
		var result = [];
		
		if (node != null)
		{
			tab = (tab != null) ? tab : '  ';
			indent = (indent != null) ? indent : '';
			newline = (newline != null) ? newline : '\n';
			
			if (node.namespaceURI != null && node.namespaceURI != ns)
			{
				ns = node.namespaceURI;
				
				if (node.getAttribute('xmlns') == null)
				{
					node.setAttribute('xmlns', node.namespaceURI);
				}
			}
			
			if (node.nodeType == mxConstants.NODETYPE_DOCUMENT)
			{
				result.push(mxUtils.getPrettyXml(node.documentElement, tab, indent, newline, ns));
			}
			else if (node.nodeType == mxConstants.NODETYPE_DOCUMENT_FRAGMENT)
			{
				var tmp = node.firstChild;
				
				if (tmp != null)
				{
					while (tmp != null)
					{
						result.push(mxUtils.getPrettyXml(tmp, tab, indent, newline, ns));
						tmp = tmp.nextSibling;
					}
				}
			}
			else if (node.nodeType == mxConstants.NODETYPE_COMMENT)
			{
				var value = mxUtils.getTextContent(node);
				
				if (value.length > 0)
				{
					result.push(indent + '<!--' + value + '-->' + newline);
				}
			}
			else if (node.nodeType == mxConstants.NODETYPE_TEXT)
			{
				var value = mxUtils.trim(mxUtils.getTextContent(node));
				
				if (value.length > 0)
				{
					result.push(indent + mxUtils.htmlEntities(value, false, false) + newline);
				}
			}
			else if (node.nodeType == mxConstants.NODETYPE_CDATA)
			{
				var value = mxUtils.getTextContent(node);
				
				if (value.length > 0)
				{
					result.push(indent + '<![CDATA[' + value + ']]' + newline);
				}
			}
			else
			{
				result.push(indent + '<' + node.nodeName);
				
				// Creates the string with the node attributes
				// and converts all HTML entities in the values
				var attrs = node.attributes;
				
				if (attrs != null)
				{
					for (var i = 0; i < attrs.length; i++)
					{
						var val = mxUtils.htmlEntities(attrs[i].value);
						result.push(' ' + attrs[i].nodeName + '="' + val + '"');
					}
				}

				// Recursively creates the XML string for each child
				// node and appends it here with an indentation
				var tmp = node.firstChild;
				
				if (tmp != null)
				{
					result.push('>' + newline);
					
					while (tmp != null)
					{
						result.push(mxUtils.getPrettyXml(tmp, tab, indent + tab, newline, ns));
						tmp = tmp.nextSibling;
					}
					
					result.push(indent + '</'+ node.nodeName + '>' + newline);
				}
				else
				{
					result.push(' />' + newline);
				}
			}
		}
		
		return result.join('');
	},
	
	/**
	 * Function: extractTextWithWhitespace
	 * 
	 * Returns the text content of the specified node.
	 * 
	 * Parameters:
	 * 
	 * elems - DOM nodes to return the text for.
	 */
	extractTextWithWhitespace: function(elems)
	{
	    // Known block elements for handling linefeeds (list is not complete)
		var blocks = ['BLOCKQUOTE', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'OL', 'P', 'PRE', 'TABLE', 'UL'];
		var ret = [];
		
		function doExtract(elts)
		{
			// Single break should be ignored
			if (elts.length == 1 && (elts[0].nodeName == 'BR' ||
				elts[0].innerHTML == '\n'))
			{
				return;
			}
			
		    for (var i = 0; i < elts.length; i++)
		    {
		        var elem = elts[i];

				// DIV with a br or linefeed forces a linefeed
				if (elem.nodeName == 'BR' || elem.innerHTML == '\n' ||
					((elts.length == 1 || i == 0) && (elem.nodeName == 'DIV' &&
					elem.innerHTML.toLowerCase() == '<br>')))
		    	{
	    			ret.push('\n');
		    	}
				else
				{
			        if (elem.nodeType === 3 || elem.nodeType === 4)
			        {
			        	if (elem.nodeValue.length > 0)
			        	{
			        		ret.push(elem.nodeValue);
			        	}
			        }
			        else if (elem.nodeType !== 8 && elem.childNodes.length > 0)
					{
						doExtract(elem.childNodes);
					}
			        
	        		if (i < elts.length - 1 && mxUtils.indexOf(blocks, elts[i + 1].nodeName) >= 0)
	        		{
	        			ret.push('\n');		
	        		}
				}
		    }
		};
		
		doExtract(elems);
	    
	    return ret.join('');
	},

	/**
	 * Function: replaceTrailingNewlines
	 * 
	 * Replaces each trailing newline with the given pattern.
	 */
	replaceTrailingNewlines: function(str, pattern)
	{
		// LATER: Check is this can be done with a regular expression
		var postfix = '';
		
		while (str.length > 0 && str.charAt(str.length - 1) == '\n')
		{
			str = str.substring(0, str.length - 1);
			postfix += pattern;
		}
		
		return str + postfix;
	},

	/**
	 * Function: getNodeValue
	 * 
	 * Returns the node value of the specified node and its
	 * text and cdata children as a string. The node values
	 * are trimmed and concatenated. Returns null if no value
	 * was found.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node to return the node value for.
	 */
	getNodeValue: function(node)
	{
		node = node.firstChild;
		var result = [];

		while (node != null)
		{
			if ((node.nodeType == mxConstants.NODETYPE_TEXT ||
				node.nodeType == mxConstants.NODETYPE_CDATA) &&
				node.nodeValue != null)
			{
				result.push(mxUtils.trim(node.nodeValue));
			}

			node = node.nextSibling;
		}

		return (result.length > 0) ? result.join('') : '';
	},
	
	/**
	 * Function: getTextContent
	 * 
	 * Returns the text content of the specified node.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node to return the text content for.
	 */
	getTextContent: function(node)
	{
		// Only IE10-
		if (mxClient.IS_IE && node.innerText !== undefined)
		{
			return node.innerText;
		}
		else
		{
			return (node != null) ? node[(node.textContent === undefined) ? 'text' : 'textContent'] : '';
		}
	},
	
	/**
	 * Function: setTextContent
	 * 
	 * Sets the text content of the specified node.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node to set the text content for.
	 * text - String that represents the text content.
	 */
	setTextContent: function(node, text)
	{
		if (node.innerText !== undefined)
		{
			node.innerText = text;
		}
		else
		{
			node[(node.textContent === undefined) ? 'text' : 'textContent'] = text;
		}
	},
	
	/**
	 * Function: getInnerHtml
	 * 
	 * Returns the inner HTML for the given node as a string or an empty string
	 * if no node was specified. The inner HTML is the text representing all
	 * children of the node, but not the node itself.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node to return the inner HTML for.
	 */
	getInnerHtml: function()
	{
		if (mxClient.IS_IE)
		{
			return function(node)
			{
				if (node != null)
				{
					return node.innerHTML;
				}
				
				return '';
			};
		}
		else
		{
			return function(node)
			{
				if (node != null)
				{
					var serializer = new XMLSerializer();
					return serializer.serializeToString(node);
				}
				
				return '';
			};
		}
	}(),

	/**
	 * Function: getOuterHtml
	 * 
	 * Returns the outer HTML for the given node as a string or an empty
	 * string if no node was specified. The outer HTML is the text representing
	 * all children of the node including the node itself.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node to return the outer HTML for.
	 */
	getOuterHtml: function()
	{
		if (mxClient.IS_IE)
		{
			return function(node)
			{
				if (node != null)
				{
					if (node.outerHTML != null)
					{
						return node.outerHTML;
					}
					else
					{
						var tmp = [];
						tmp.push('<'+node.nodeName);
						
						var attrs = node.attributes;
						
						if (attrs != null)
						{
							for (var i = 0; i < attrs.length; i++)
							{
								var value = attrs[i].value;
								
								if (value != null && value.length > 0)
								{
									tmp.push(' ');
									tmp.push(attrs[i].nodeName);
									tmp.push('="');
									tmp.push(value);
									tmp.push('"');
								}
							}
						}
						
						if (node.innerHTML.length == 0)
						{
							tmp.push('/>');
						}
						else
						{
							tmp.push('>');
							tmp.push(node.innerHTML);
							tmp.push('</'+node.nodeName+'>');
						}
						
						return tmp.join('');
					}
				}
				
				return '';
			};
		}
		else
		{
			return function(node)
			{
				if (node != null)
				{
					var serializer = new XMLSerializer();
					return serializer.serializeToString(node);
				}
				
				return '';
			};
		}
	}(),
	
	/**
	 * Function: write
	 * 
	 * Creates a text node for the given string and appends it to the given
	 * parent. Returns the text node.
	 * 
	 * Parameters:
	 * 
	 * parent - DOM node to append the text node to.
	 * text - String representing the text to be added.
	 */
	write: function(parent, text)
	{
		var doc = parent.ownerDocument;
		var node = doc.createTextNode(text);
		
		if (parent != null)
		{
			parent.appendChild(node);
		}
		
		return node;
	},
	
	/**
	 * Function: writeln
	 * 
	 * Creates a text node for the given string and appends it to the given
	 * parent with an additional linefeed. Returns the text node.
	 * 
	 * Parameters:
	 * 
	 * parent - DOM node to append the text node to.
	 * text - String representing the text to be added.
	 */
	writeln: function(parent, text)
	{
		var doc = parent.ownerDocument;
		var node = doc.createTextNode(text);
		
		if (parent != null)
		{
			parent.appendChild(node);
			parent.appendChild(document.createElement('br'));
		}
		
		return node;
	},
	
	/**
	 * Function: br
	 * 
	 * Appends a linebreak to the given parent and returns the linebreak.
	 * 
	 * Parameters:
	 * 
	 * parent - DOM node to append the linebreak to.
	 */
	br: function(parent, count)
	{
		count = count || 1;
		var br = null;
		
		for (var i = 0; i < count; i++)
		{
			if (parent != null)
			{
				br = parent.ownerDocument.createElement('br');
				parent.appendChild(br);
			}
		}
		
		return br;
	},
		
	/**
	 * Function: button
	 * 
	 * Returns a new button with the given level and function as an onclick
	 * event handler.
	 * 
	 * (code)
	 * document.body.appendChild(mxUtils.button('Test', function(evt)
	 * {
	 *   alert('Hello, World!');
	 * }));
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * label - String that represents the label of the button.
	 * funct - Function to be called if the button is pressed.
	 * doc - Optional document to be used for creating the button. Default is the
	 * current document.
	 */
	button: function(label, funct, doc, className)
	{
		doc = (doc != null) ? doc : document;
		
		var button = doc.createElement('button');
		mxUtils.write(button, label);

		mxEvent.addListener(button, 'click', function(evt)
		{
			funct(evt);
		});

		if (className != null)
		{
			button.className = className;
		}
		
		return button;
	},
	
	/**
	 * Function: para
	 * 
	 * Appends a new paragraph with the given text to the specified parent and
	 * returns the paragraph.
	 * 
	 * Parameters:
	 * 
	 * parent - DOM node to append the text node to.
	 * text - String representing the text for the new paragraph.
	 */
	para: function(parent, text)
	{
		var p = document.createElement('p');
		mxUtils.write(p, text);

		if (parent != null)
		{
			parent.appendChild(p);
		}
		
		return p;
	},

	/**
	 * Function: addTransparentBackgroundFilter
	 * 
	 * Adds a transparent background to the filter of the given node. This
	 * background can be used in IE8 standards mode (native IE8 only) to pass
	 * events through the node.
	 */
	addTransparentBackgroundFilter: function(node)
	{
		node.style.filter += 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' +
			mxClient.imageBasePath + '/transparent.gif\', sizingMethod=\'scale\')';
	},

	/**
	 * Function: linkAction
	 * 
	 * Adds a hyperlink to the specified parent that invokes action on the
	 * specified editor.
	 * 
	 * Parameters:
	 * 
	 * parent - DOM node to contain the new link.
	 * text - String that is used as the link label.
	 * editor - <mxEditor> that will execute the action.
	 * action - String that defines the name of the action to be executed.
	 * pad - Optional left-padding for the link. Default is 0.
	 */
	linkAction: function(parent, text, editor, action, pad)
	{
		return mxUtils.link(parent, text, function()
		{
			editor.execute(action);
		}, pad);
	},

	/**
	 * Function: linkInvoke
	 * 
	 * Adds a hyperlink to the specified parent that invokes the specified
	 * function on the editor passing along the specified argument. The
	 * function name is the name of a function of the editor instance,
	 * not an action name.
	 * 
	 * Parameters:
	 * 
	 * parent - DOM node to contain the new link.
	 * text - String that is used as the link label.
	 * editor - <mxEditor> instance to execute the function on.
	 * functName - String that represents the name of the function.
	 * arg - Object that represents the argument to the function.
	 * pad - Optional left-padding for the link. Default is 0.
	 */
	linkInvoke: function(parent, text, editor, functName, arg, pad)
	{
		return mxUtils.link(parent, text, function()
		{
			editor[functName](arg);
		}, pad);
	},
	
	/**
	 * Function: link
	 * 
	 * Adds a hyperlink to the specified parent and invokes the given function
	 * when the link is clicked.
	 * 
	 * Parameters:
	 * 
	 * parent - DOM node to contain the new link.
	 * text - String that is used as the link label.
	 * funct - Function to execute when the link is clicked.
	 * pad - Optional left-padding for the link. Default is 0.
	 */
	link: function(parent, text, funct, pad)
	{
		var a = document.createElement('span');
		
		a.style.color = 'blue';
		a.style.textDecoration = 'underline';
		a.style.cursor = 'pointer';
		
		if (pad != null)
		{
			a.style.paddingLeft = pad+'px';
		}
		
		mxEvent.addListener(a, 'click', funct);
		mxUtils.write(a, text);
		
		if (parent != null)
		{
			parent.appendChild(a);
		}
		
		return a;
	},

	/**
	 * Function: getDocumentSize
	 * 
	 * Returns the client size for the current document as an <mxRectangle>.
	 */
	getDocumentSize: function()
	{
		var b = document.body;
		var d = document.documentElement;
		
		try
		{
			return new mxRectangle(0, 0, b.clientWidth || d.clientWidth, Math.max(b.clientHeight || 0, d.clientHeight));
		}
		catch (e)
		{
			return new mxRectangle();
		}
	},
	
	/**
	 * Function: fit
	 * 
	 * Makes sure the given node is inside the visible area of the window. This
	 * is done by setting the left and top in the style. 
	 */
	fit: function(node, margin)
	{
		margin = margin || 0;
		var ds = mxUtils.getDocumentSize();
		var left = parseInt(node.offsetLeft);
		var width = parseInt(node.offsetWidth);
			
		var offset = mxUtils.getDocumentScrollOrigin(node.ownerDocument);
		var sl = offset.x;
		var st = offset.y;
		var right = sl + ds.width - margin;
		
		if (left + width > right)
		{
			node.style.left = Math.max(sl + margin, right - width) + 'px';
		}
		
		var top = parseInt(node.offsetTop);
		var height = parseInt(node.offsetHeight);
		var bottom = st + ds.height - margin;
		
		if (top + height > bottom)
		{
			node.style.top = Math.max(st + margin, bottom - height) + 'px';
		}
	},

	/**
	 * Function: load
	 * 
	 * Loads the specified URL *synchronously* and returns the <mxXmlRequest>.
	 * Throws an exception if the file cannot be loaded. See <mxUtils.get> for
	 * an asynchronous implementation.
	 *
	 * Example:
	 * 
	 * (code)
	 * try
	 * {
	 *   var req = mxUtils.load(filename);
	 *   var root = req.getDocumentElement();
	 *   // Process XML DOM...
	 * }
	 * catch (ex)
	 * {
	 *   mxUtils.alert('Cannot load '+filename+': '+ex);
	 * }
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * url - URL to get the data from.
	 */
	load: function(url)
	{
		var req = new mxXmlRequest(url, null, 'GET', false);
		req.send();
		
		return req;
	},

	/**
	 * Function: get
	 * 
	 * Loads the specified URL *asynchronously* and invokes the given functions
	 * depending on the request status. Returns the <mxXmlRequest> in use. Both
	 * functions take the <mxXmlRequest> as the only parameter. See
	 * <mxUtils.load> for a synchronous implementation.
	 *
	 * Example:
	 * 
	 * (code)
	 * mxUtils.get(url, function(req)
	 * {
	 *    var node = req.getDocumentElement();
	 *    // Process XML DOM...
	 * });
	 * (end)
	 * 
	 * So for example, to load a diagram into an existing graph model, the
	 * following code is used.
	 * 
	 * (code)
	 * mxUtils.get(url, function(req)
	 * {
	 *   var node = req.getDocumentElement();
	 *   var dec = new mxCodec(node.ownerDocument);
	 *   dec.decode(node, graph.getModel());
	 * });
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * url - URL to get the data from.
	 * onload - Optional function to execute for a successful response.
	 * onerror - Optional function to execute on error.
	 * binary - Optional boolean parameter that specifies if the request is
	 * binary.
	 * timeout - Optional timeout in ms before calling ontimeout.
	 * ontimeout - Optional function to execute on timeout.
	 * headers - Optional with headers, eg. {'Authorization': 'token xyz'}
	 */
	get: function(url, onload, onerror, binary, timeout, ontimeout, headers)
	{
		var req = new mxXmlRequest(url, null, 'GET');
		var setRequestHeaders = req.setRequestHeaders;
		
		if (headers)
		{
			req.setRequestHeaders = function(request, params)
			{
				setRequestHeaders.apply(this, arguments);
				
				for (var key in headers)
				{
					request.setRequestHeader(key, headers[key]);
				}
			};
		}
		
		if (binary != null)
		{
			req.setBinary(binary);
		}
		
		req.send(onload, onerror, timeout, ontimeout);
		
		return req;
	},

	/**
	 * Function: getAll
	 * 
	 * Loads the URLs in the given array *asynchronously* and invokes the given function
	 * if all requests returned with a valid 2xx status. The error handler is invoked
	 * once on the first error or invalid response.
	 *
	 * Parameters:
	 * 
	 * urls - Array of URLs to be loaded.
	 * onload - Callback with array of <mxXmlRequests>.
	 * onerror - Optional function to execute on error.
	 */
	getAll: function(urls, onload, onerror)
	{
		var remain = urls.length;
		var result = [];
		var errors = 0;
		var err = function()
		{
			if (errors == 0 && onerror != null)
			{
				onerror();
			}

			errors++;
		};
		
		for (var i = 0; i < urls.length; i++)
		{
			(function(url, index)
			{
				mxUtils.get(url, function(req)
				{
					var status = req.getStatus();
					
					if (status < 200 || status > 299)
					{
						err();
					}
					else
					{
						result[index] = req;
						remain--;
						
						if (remain == 0)
						{
							onload(result);
						}
					}
				}, err);
			})(urls[i], i);
		}
		
		if (remain == 0)
		{
			onload(result);			
		}
	},
	
	/**
	 * Function: post
	 * 
	 * Posts the specified params to the given URL *asynchronously* and invokes
	 * the given functions depending on the request status. Returns the
	 * <mxXmlRequest> in use. Both functions take the <mxXmlRequest> as the
	 * only parameter. Make sure to use encodeURIComponent for the parameter
	 * values.
	 *
	 * Example:
	 * 
	 * (code)
	 * mxUtils.post(url, 'key=value', function(req)
	 * {
	 * 	mxUtils.alert('Ready: '+req.isReady()+' Status: '+req.getStatus());
	 *  // Process req.getDocumentElement() using DOM API if OK...
	 * });
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * url - URL to get the data from.
	 * params - Parameters for the post request.
	 * onload - Optional function to execute for a successful response.
	 * onerror - Optional function to execute on error.
	 */
	post: function(url, params, onload, onerror)
	{
		return new mxXmlRequest(url, params).send(onload, onerror);
	},
	
	/**
	 * Function: submit
	 * 
	 * Submits the given parameters to the specified URL using
	 * <mxXmlRequest.simulate> and returns the <mxXmlRequest>.
	 * Make sure to use encodeURIComponent for the parameter
	 * values.
	 * 
	 * Parameters:
	 * 
	 * url - URL to get the data from.
	 * params - Parameters for the form.
	 * doc - Document to create the form in.
	 * target - Target to send the form result to.
	 */
	submit: function(url, params, doc, target)
	{
		return new mxXmlRequest(url, params).simulate(doc, target);
	},
	
	/**
	 * Function: loadInto
	 * 
	 * Loads the specified URL *asynchronously* into the specified document,
	 * invoking onload after the document has been loaded. This implementation
	 * does not use <mxXmlRequest>, but the document.load method.
	 * 
	 * Parameters:
	 * 
	 * url - URL to get the data from.
	 * doc - The document to load the URL into.
	 * onload - Function to execute when the URL has been loaded.
	 */
	loadInto: function(url, doc, onload)
	{
		if (mxClient.IS_IE)
		{
			doc.onreadystatechange = function ()
			{
				if (doc.readyState == 4)
				{
					onload();
				}
			};
		}
		else
		{
			doc.addEventListener('load', onload, false);
		}
		
		doc.load(url);
	},
	
	/**
	 * Function: getValue
	 * 
	 * Returns the value for the given key in the given associative array or
	 * the given default value if the value is null.
	 * 
	 * Parameters:
	 * 
	 * array - Associative array that contains the value for the key.
	 * key - Key whose value should be returned.
	 * defaultValue - Value to be returned if the value for the given
	 * key is null.
	 */
	getValue: function(array, key, defaultValue)
	{
		var value = (array != null) ? array[key] : null;

		if (value == null)
		{
			value = defaultValue;			
		}
		
		return value;
	},
	
	/**
	 * Function: getNumber
	 * 
	 * Returns the numeric value for the given key in the given associative
	 * array or the given default value (or 0) if the value is null. The value
	 * is converted to a numeric value using the Number function.
	 * 
	 * Parameters:
	 * 
	 * array - Associative array that contains the value for the key.
	 * key - Key whose value should be returned.
	 * defaultValue - Value to be returned if the value for the given
	 * key is null. Default is 0.
	 */
	getNumber: function(array, key, defaultValue)
	{
		var value = (array != null) ? array[key] : null;

		if (value == null)
		{
			value = defaultValue || 0;			
		}
		
		return Number(value);
	},
	
	/**
	 * Function: getColor
	 * 
	 * Returns the color value for the given key in the given associative
	 * array or the given default value if the value is null. If the value
	 * is <mxConstants.NONE> then null is returned.
	 * 
	 * Parameters:
	 * 
	 * array - Associative array that contains the value for the key.
	 * key - Key whose value should be returned.
	 * defaultValue - Value to be returned if the value for the given
	 * key is null. Default is null.
	 */
	getColor: function(array, key, defaultValue)
	{
		var value = (array != null) ? array[key] : null;

		if (value == null)
		{
			value = defaultValue;
		}
		else if (value == mxConstants.NONE)
		{
			value = null;
		}
		
		return value;
	},

	/**
	 * Function: isEmptyObject
	 * 
	 * Returns true if the given object has no properties.
	 * 
	 * Parameters:
	 * 
	 * obj - Object to be checked.
	 */
	isEmptyObject: function(obj)
	{
		for (var key in obj)
		{
			return false;
		}

		return true;
	},
	
	/**
	 * Function: clone
	 * 
	 * Recursively clones the specified object ignoring all fieldnames in the
	 * given array of transient fields. <mxObjectIdentity.FIELD_NAME> is always
	 * ignored by this function.
	 * 
	 * Parameters:
	 * 
	 * obj - Object to be cloned.
	 * transients - Optional array of strings representing the fieldname to be
	 * ignored.
	 * shallow - Optional boolean argument to specify if a shallow clone should
	 * be created, that is, one where all object references are not cloned or,
	 * in other words, one where only atomic (strings, numbers) values are
	 * cloned. Default is false.
	 */
	clone: function(obj, transients, shallow)
	{
		shallow = (shallow != null) ? shallow : false;
		var clone = null;
		
		if (obj != null && typeof(obj.constructor) == 'function')
		{
			if (obj.constructor === Element)
			{
				clone = obj.cloneNode((shallow != null) ? !shallow : false);
			}
			else
			{
				clone = new obj.constructor();
				
				for (var i in obj)
				{
					if (i != mxObjectIdentity.FIELD_NAME && (transients == null ||
						mxUtils.indexOf(transients, i) < 0))
					{
						if (!shallow && typeof(obj[i]) == 'object')
						{
							clone[i] = mxUtils.clone(obj[i]);
						}
						else
						{
							clone[i] = obj[i];
						}
					}
				}
			}
		}
		
	    return clone;
	},

	/**
	 * Function: equalPoints
	 * 
	 * Compares all mxPoints in the given lists.
	 * 
	 * Parameters:
	 * 
	 * a - Array of <mxPoints> to be compared.
	 * b - Array of <mxPoints> to be compared.
	 */
	equalPoints: function(a, b)
	{
		if ((a == null && b != null) || (a != null && b == null) ||
			(a != null && b != null && a.length != b.length))
		{
			return false;
		}
		else if (a != null && b != null)
		{
			for (var i = 0; i < a.length; i++)
			{
				if ((a[i] != null && b[i] == null) ||
					(a[i] == null && b[i] != null) ||
					(a[i] != null && b[i] != null &&
					(a[i].x != b[i].x || a[i].y != b[i].y)))
				{
					return false;
				}
			}
		}
		
		return true;
	},

	/**
	 * Function: equalEntries
	 * 
	 * Returns true if all properties of the given objects are equal. Values
	 * with NaN are equal to NaN and unequal to any other value.
	 * 
	 * Parameters:
	 * 
	 * a - First object to be compared.
	 * b - Second object to be compared.
	 */
	equalEntries: function(a, b)
	{
		// Counts keys in b to check if all values have been compared
		var count = 0;

		if ((a == null && b != null) || (a != null && b == null) ||
			(a != null && b != null && a.length != b.length))
		{
			return false;
		}
		else if (a != null && b != null)
		{
			for (var key in b)
			{
				count++;
			}
			
			for (var key in a)
			{
				count--
				
				if ((!mxUtils.isNaN(a[key]) || !mxUtils.isNaN(b[key])) && a[key] != b[key])
				{
					return false;
				}
			}
		}
		
		return count == 0;
	},
	
	/**
	 * Function: removeDuplicates
	 * 
	 * Removes all duplicates from the given array.
	 */
	removeDuplicates: function(arr)
	{
		var dict = new mxDictionary();
		var result = [];
		
		for (var i = 0; i < arr.length; i++)
		{
			if (!dict.get(arr[i]))
			{
				result.push(arr[i]);
				dict.put(arr[i], true);
			}
		}

		return result;
	},
	
	/**
	 * Function: isNaN
	 *
	 * Returns true if the given value is of type number and isNaN returns true.
	 */
	isNaN: function(value)
	{
		return typeof(value) == 'number' && isNaN(value);
	},
	
	/**
	 * Function: extend
	 *
	 * Assigns a copy of the superclass prototype to the subclass prototype.
	 * Note that this does not call the constructor of the superclass at this
	 * point, the superclass constructor should be called explicitely in the
	 * subclass constructor. Below is an example.
	 * 
	 * (code)
	 * MyGraph = function(container, model, renderHint, stylesheet)
	 * {
	 *   mxGraph.call(this, container, model, renderHint, stylesheet);
	 * }
	 * 
	 * mxUtils.extend(MyGraph, mxGraph);
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * ctor - Constructor of the subclass.
	 * superCtor - Constructor of the superclass.
	 */
	extend: function(ctor, superCtor)
	{
		var f = function() {};
		f.prototype = superCtor.prototype;
		
		ctor.prototype = new f();
		ctor.prototype.constructor = ctor;
	},

	/**
	 * Function: toString
	 * 
	 * Returns a textual representation of the specified object.
	 * 
	 * Parameters:
	 * 
	 * obj - Object to return the string representation for.
	 */
	toString: function(obj)
	{
	    var output = '';
	    
	    for (var i in obj)
	    {
	    	try
	    	{
			    if (obj[i] == null)
			    {
		            output += i + ' = [null]\n';
			    }
			    else if (typeof(obj[i]) == 'function')
			    {
		            output += i + ' => [Function]\n';
		        }
		        else if (typeof(obj[i]) == 'object')
		        {
		        	var ctor = mxUtils.getFunctionName(obj[i].constructor); 
		            output += i + ' => [' + ctor + ']\n';
		        }
		        else
		        {
		            output += i + ' = ' + obj[i] + '\n';
		        }
	    	}
	    	catch (e)
	    	{
	    		output += i + '=' + e.message;
	    	}
	    }
	    
	    return output;
	},

	/**
	 * Function: toRadians
	 * 
	 * Converts the given degree to radians.
	 */
	toRadians: function(deg)
	{
		return Math.PI * deg / 180;
	},

	/**
	 * Function: toDegree
	 * 
	 * Converts the given radians to degree.
	 */
	toDegree: function(rad)
	{
		return rad * 180 / Math.PI;
	},
	
	/**
	 * Function: arcToCurves
	 * 
	 * Converts the given arc to a series of curves.
	 */
	arcToCurves: function(x0, y0, r1, r2, angle, largeArcFlag, sweepFlag, x, y)
	{
		x -= x0;
		y -= y0;
		
        if (r1 === 0 || r2 === 0) 
        {
        	return result;
        }
        
        var fS = sweepFlag;
        var psai = angle;
        r1 = Math.abs(r1);
        r2 = Math.abs(r2);
        var ctx = -x / 2;
        var cty = -y / 2;
        var cpsi = Math.cos(psai * Math.PI / 180);
        var spsi = Math.sin(psai * Math.PI / 180);
        var rxd = cpsi * ctx + spsi * cty;
        var ryd = -1 * spsi * ctx + cpsi * cty;
        var rxdd = rxd * rxd;
        var rydd = ryd * ryd;
        var r1x = r1 * r1;
        var r2y = r2 * r2;
        var lamda = rxdd / r1x + rydd / r2y;
        var sds;
        
        if (lamda > 1) 
        {
        	r1 = Math.sqrt(lamda) * r1;
        	r2 = Math.sqrt(lamda) * r2;
        	sds = 0;
        }  
        else
        {
        	var seif = 1;
            
        	if (largeArcFlag === fS) 
        	{
        		seif = -1;
        	}
            
        	sds = seif * Math.sqrt((r1x * r2y - r1x * rydd - r2y * rxdd) / (r1x * rydd + r2y * rxdd));
        }
        
        var txd = sds * r1 * ryd / r2;
        var tyd = -1 * sds * r2 * rxd / r1;
        var tx = cpsi * txd - spsi * tyd + x / 2;
        var ty = spsi * txd + cpsi * tyd + y / 2;
        var rad = Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1) - Math.atan2(0, 1);
        var s1 = (rad >= 0) ? rad : 2 * Math.PI + rad;
        rad = Math.atan2((-ryd - tyd) / r2, (-rxd - txd) / r1) - Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1);
        var dr = (rad >= 0) ? rad : 2 * Math.PI + rad;
        
        if (fS == 0 && dr > 0) 
        {
        	dr -= 2 * Math.PI;
        }
        else if (fS != 0 && dr < 0) 
        {
        	dr += 2 * Math.PI;
        }
        
        var sse = dr * 2 / Math.PI;
        var seg = Math.ceil(sse < 0 ? -1 * sse : sse);
        var segr = dr / seg;
        var t = 8/3 * Math.sin(segr / 4) * Math.sin(segr / 4) / Math.sin(segr / 2);
        var cpsir1 = cpsi * r1;
        var cpsir2 = cpsi * r2;
        var spsir1 = spsi * r1;
        var spsir2 = spsi * r2;
        var mc = Math.cos(s1);
        var ms = Math.sin(s1);
        var x2 = -t * (cpsir1 * ms + spsir2 * mc);
        var y2 = -t * (spsir1 * ms - cpsir2 * mc);
        var x3 = 0;
        var y3 = 0;

		var result = [];
        
        for (var n = 0; n < seg; ++n) 
        {
            s1 += segr;
            mc = Math.cos(s1);
            ms = Math.sin(s1);
            
            x3 = cpsir1 * mc - spsir2 * ms + tx;
            y3 = spsir1 * mc + cpsir2 * ms + ty;
            var dx = -t * (cpsir1 * ms + spsir2 * mc);
            var dy = -t * (spsir1 * ms - cpsir2 * mc);
            
            // CurveTo updates x0, y0 so need to restore it
            var index = n * 6;
            result[index] = Number(x2 + x0);
            result[index + 1] = Number(y2 + y0);
            result[index + 2] = Number(x3 - dx + x0);
            result[index + 3] = Number(y3 - dy + y0);
            result[index + 4] = Number(x3 + x0);
            result[index + 5] = Number(y3 + y0);
            
			x2 = x3 + dx;
            y2 = y3 + dy;
        }
        
        return result;
	},

	/**
	 * Function: getBoundingBox
	 * 
	 * Returns the bounding box for the rotated rectangle.
	 * 
	 * Parameters:
	 * 
	 * rect - <mxRectangle> to be rotated.
	 * angle - Number that represents the angle (in degrees).
	 * cx - Optional <mxPoint> that represents the rotation center. If no
	 * rotation center is given then the center of rect is used.
	 */
	getBoundingBox: function(rect, rotation, cx)
	{
        var result = null;

        if (rect != null && rotation != null && rotation != 0)
        {
            var rad = mxUtils.toRadians(rotation);
            var cos = Math.cos(rad);
            var sin = Math.sin(rad);

            cx = (cx != null) ? cx : new mxPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);

            var p1 = new mxPoint(rect.x, rect.y);
            var p2 = new mxPoint(rect.x + rect.width, rect.y);
            var p3 = new mxPoint(p2.x, rect.y + rect.height);
            var p4 = new mxPoint(rect.x, p3.y);

            p1 = mxUtils.getRotatedPoint(p1, cos, sin, cx);
            p2 = mxUtils.getRotatedPoint(p2, cos, sin, cx);
            p3 = mxUtils.getRotatedPoint(p3, cos, sin, cx);
            p4 = mxUtils.getRotatedPoint(p4, cos, sin, cx);

            result = new mxRectangle(p1.x, p1.y, 0, 0);
            result.add(new mxRectangle(p2.x, p2.y, 0, 0));
            result.add(new mxRectangle(p3.x, p3.y, 0, 0));
            result.add(new mxRectangle(p4.x, p4.y, 0, 0));
        }

        return result;
	},

	/**
	 * Function: getRotatedPoint
	 * 
	 * Rotates the given point by the given cos and sin.
	 */
	getRotatedPoint: function(pt, cos, sin, c)
	{
		c = (c != null) ? c : new mxPoint();
		var x = pt.x - c.x;
		var y = pt.y - c.y;

		var x1 = x * cos - y * sin;
		var y1 = y * cos + x * sin;

		return new mxPoint(x1 + c.x, y1 + c.y);
	},
	
	/**
	 * Returns an integer mask of the port constraints of the given map
	 * @param dict the style map to determine the port constraints for
	 * @param defaultValue Default value to return if the key is undefined.
	 * @return the mask of port constraint directions
	 * 
	 * Parameters:
	 * 
	 * terminal - <mxCelState> that represents the terminal.
	 * edge - <mxCellState> that represents the edge.
	 * source - Boolean that specifies if the terminal is the source terminal.
	 * defaultValue - Default value to be returned.
	 */
	getPortConstraints: function(terminal, edge, source, defaultValue)
	{
		var value = mxUtils.getValue(terminal.style, mxConstants.STYLE_PORT_CONSTRAINT,
			mxUtils.getValue(edge.style, (source) ? mxConstants.STYLE_SOURCE_PORT_CONSTRAINT :
				mxConstants.STYLE_TARGET_PORT_CONSTRAINT, null));
		
		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			var directions = value.toString();
			var returnValue = mxConstants.DIRECTION_MASK_NONE;
			var constraintRotationEnabled = mxUtils.getValue(terminal.style, mxConstants.STYLE_PORT_CONSTRAINT_ROTATION, 0);
			var rotation = 0;
			
			if (constraintRotationEnabled == 1)
			{
				rotation = mxUtils.getValue(terminal.style, mxConstants.STYLE_ROTATION, 0);
			}
			
			var quad = 0;

			if (rotation > 45)
			{
				quad = 1;
				
				if (rotation >= 135)
				{
					quad = 2;
				}
			}
			else if (rotation < -45)
			{
				quad = 3;
				
				if (rotation <= -135)
				{
					quad = 2;
				}
			}

			if (directions.indexOf(mxConstants.DIRECTION_NORTH) >= 0)
			{
				switch (quad)
				{
					case 0:
						returnValue |= mxConstants.DIRECTION_MASK_NORTH;
						break;
					case 1:
						returnValue |= mxConstants.DIRECTION_MASK_EAST;
						break;
					case 2:
						returnValue |= mxConstants.DIRECTION_MASK_SOUTH;
						break;
					case 3:
						returnValue |= mxConstants.DIRECTION_MASK_WEST;
						break;
				}
			}
			if (directions.indexOf(mxConstants.DIRECTION_WEST) >= 0)
			{
				switch (quad)
				{
					case 0:
						returnValue |= mxConstants.DIRECTION_MASK_WEST;
						break;
					case 1:
						returnValue |= mxConstants.DIRECTION_MASK_NORTH;
						break;
					case 2:
						returnValue |= mxConstants.DIRECTION_MASK_EAST;
						break;
					case 3:
						returnValue |= mxConstants.DIRECTION_MASK_SOUTH;
						break;
				}
			}
			if (directions.indexOf(mxConstants.DIRECTION_SOUTH) >= 0)
			{
				switch (quad)
				{
					case 0:
						returnValue |= mxConstants.DIRECTION_MASK_SOUTH;
						break;
					case 1:
						returnValue |= mxConstants.DIRECTION_MASK_WEST;
						break;
					case 2:
						returnValue |= mxConstants.DIRECTION_MASK_NORTH;
						break;
					case 3:
						returnValue |= mxConstants.DIRECTION_MASK_EAST;
						break;
				}
			}
			if (directions.indexOf(mxConstants.DIRECTION_EAST) >= 0)
			{
				switch (quad)
				{
					case 0:
						returnValue |= mxConstants.DIRECTION_MASK_EAST;
						break;
					case 1:
						returnValue |= mxConstants.DIRECTION_MASK_SOUTH;
						break;
					case 2:
						returnValue |= mxConstants.DIRECTION_MASK_WEST;
						break;
					case 3:
						returnValue |= mxConstants.DIRECTION_MASK_NORTH;
						break;
				}
			}

			return returnValue;
		}
	},
	
	/**
	 * Function: reversePortConstraints
	 * 
	 * Reverse the port constraint bitmask. For example, north | east
	 * becomes south | west
	 */
	reversePortConstraints: function(constraint)
	{
		var result = 0;
		
		result = (constraint & mxConstants.DIRECTION_MASK_WEST) << 3;
		result |= (constraint & mxConstants.DIRECTION_MASK_NORTH) << 1;
		result |= (constraint & mxConstants.DIRECTION_MASK_SOUTH) >> 1;
		result |= (constraint & mxConstants.DIRECTION_MASK_EAST) >> 3;
		
		return result;
	},
	
	/**
	 * Function: findNearestSegment
	 * 
	 * Finds the index of the nearest segment on the given cell state for
	 * the specified coordinate pair.
	 */
	findNearestSegment: function(state, x, y)
	{
		var index = -1;
		
		if (state.absolutePoints.length > 0)
		{
			var last = state.absolutePoints[0];
			var min = null;
			
			for (var i = 1; i < state.absolutePoints.length; i++)
			{
				var current = state.absolutePoints[i];
				var dist = mxUtils.ptSegDistSq(last.x, last.y,
					current.x, current.y, x, y);
				
				if (min == null || dist < min)
				{
					min = dist;
					index = i - 1;
				}

				last = current;
			}
		}
		
		return index;
	},

	/**
	 * Function: getDirectedBounds
	 * 
	 * Adds the given margins to the given rectangle and rotates and flips the
	 * rectangle according to the respective styles in style.
	 */
	getDirectedBounds: function (rect, m, style, flipH, flipV)
	{
		var d = mxUtils.getValue(style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);
		flipH = (flipH != null) ? flipH : mxUtils.getValue(style, mxConstants.STYLE_FLIPH, false);
		flipV = (flipV != null) ? flipV : mxUtils.getValue(style, mxConstants.STYLE_FLIPV, false);

		m.x = Math.round(Math.max(0, Math.min(rect.width, m.x)));
		m.y = Math.round(Math.max(0, Math.min(rect.height, m.y)));
		m.width = Math.round(Math.max(0, Math.min(rect.width, m.width)));
		m.height = Math.round(Math.max(0, Math.min(rect.height, m.height)));
		
		if ((flipV && (d == mxConstants.DIRECTION_SOUTH || d == mxConstants.DIRECTION_NORTH)) ||
			(flipH && (d == mxConstants.DIRECTION_EAST || d == mxConstants.DIRECTION_WEST)))
		{
			var tmp = m.x;
			m.x = m.width;
			m.width = tmp;
		}
			
		if ((flipH && (d == mxConstants.DIRECTION_SOUTH || d == mxConstants.DIRECTION_NORTH)) ||
			(flipV && (d == mxConstants.DIRECTION_EAST || d == mxConstants.DIRECTION_WEST)))
		{
			var tmp = m.y;
			m.y = m.height;
			m.height = tmp;
		}
		
		var m2 = mxRectangle.fromRectangle(m);
		
		if (d == mxConstants.DIRECTION_SOUTH)
		{
			m2.y = m.x;
			m2.x = m.height;
			m2.width = m.y;
			m2.height = m.width;
		}
		else if (d == mxConstants.DIRECTION_WEST)
		{
			m2.y = m.height;
			m2.x = m.width;
			m2.width = m.x;
			m2.height = m.y;
		}
		else if (d == mxConstants.DIRECTION_NORTH)
		{
			m2.y = m.width;
			m2.x = m.y;
			m2.width = m.height;
			m2.height = m.x;
		}
		
		return new mxRectangle(rect.x + m2.x, rect.y + m2.y, rect.width - m2.width - m2.x, rect.height - m2.height - m2.y);
	},

	/**
	 * Function: getPerimeterPoint
	 * 
	 * Returns the intersection between the polygon defined by the array of
	 * points and the line between center and point.
	 */
	getPerimeterPoint: function (pts, center, point)
	{
		var min = null;
		
		for (var i = 0; i < pts.length - 1; i++)
		{
			var pt = mxUtils.intersection(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y,
				center.x, center.y, point.x, point.y);
			
			if (pt != null)
			{
				var dx = point.x - pt.x;
				var dy = point.y - pt.y;
				var ip = {p: pt, distSq: dy * dy + dx * dx};
				
				if (ip != null && (min == null || min.distSq > ip.distSq))
				{
					min = ip;
				}
			}
		}
		
		return (min != null) ? min.p : null;
	},

	/**
	 * Function: intersectsPoints
	 * 
	 * Returns true if the given rectangle intersects the given points.
	 * 
	 * Parameters:
	 * 
	 * bounds - <mxRectangle> that represents the rectangle.
	 * pts - Array of <mxPoints> that represents the points.
	 */
	intersectsPoints: function(bounds, pts)
	{
		for (var i = 0; i < pts.length - 1; i++)
		{
			if (mxUtils.rectangleIntersectsSegment(bounds, pts[i], pts[i + 1]))
			{
				return true;
			}
		}

		return false;
	},
	
	/**
	 * Function: rectangleIntersectsSegment
	 * 
	 * Returns true if the given rectangle intersects the given segment.
	 * 
	 * Parameters:
	 * 
	 * bounds - <mxRectangle> that represents the rectangle.
	 * p1 - <mxPoint> that represents the first point of the segment.
	 * p2 - <mxPoint> that represents the second point of the segment.
	 */
	rectangleIntersectsSegment: function(bounds, p1, p2)
	{
		var top = bounds.y;
		var left = bounds.x;
		var bottom = top + bounds.height;
		var right = left + bounds.width;
			
		// Find min and max X for the segment
		var minX = p1.x;
		var maxX = p2.x;
		
		if (p1.x > p2.x)
		{
		  minX = p2.x;
		  maxX = p1.x;
		}
		
		// Find the intersection of the segment's and rectangle's x-projections
		if (maxX > right)
		{
		  maxX = right;
		}
		
		if (minX < left)
		{
		  minX = left;
		}
		
		if (minX > maxX) // If their projections do not intersect return false
		{
		  return false;
		}
		
		// Find corresponding min and max Y for min and max X we found before
		var minY = p1.y;
		var maxY = p2.y;
		var dx = p2.x - p1.x;
		
		if (Math.abs(dx) > 0.0000001)
		{
		  var a = (p2.y - p1.y) / dx;
		  var b = p1.y - a * p1.x;
		  minY = a * minX + b;
		  maxY = a * maxX + b;
		}
		
		if (minY > maxY)
		{
		  var tmp = maxY;
		  maxY = minY;
		  minY = tmp;
		}
		
		// Find the intersection of the segment's and rectangle's y-projections
		if (maxY > bottom)
		{
		  maxY = bottom;
		}
		
		if (minY < top)
		{
		  minY = top;
		}
		
		if (minY > maxY) // If Y-projections do not intersect return false
		{
		  return false;
		}
		
		return true;
	},
	
	/**
	 * Function: contains
	 * 
	 * Returns true if the specified point (x, y) is contained in the given rectangle.
	 * 
	 * Parameters:
	 * 
	 * bounds - <mxRectangle> that represents the area.
	 * x - X-coordinate of the point.
	 * y - Y-coordinate of the point.
	 */
	contains: function(bounds, x, y)
	{
		return (bounds.x <= x && bounds.x + bounds.width >= x &&
				bounds.y <= y && bounds.y + bounds.height >= y);
	},

	/**
	 * Function: intersects
	 * 
	 * Returns true if the two rectangles intersect.
	 * 
	 * Parameters:
	 * 
	 * a - <mxRectangle> to be checked for intersection.
	 * b - <mxRectangle> to be checked for intersection.
	 * ignoreSize - Boolean to allow width/height of 0.
	 */
	intersects: function(a, b, ignoreSize)
	{
		var tw = a.width;
		var th = a.height;
		var rw = b.width;
		var rh = b.height;
		
		if (!ignoreSize &&
			(rw <= 0 || rh <= 0 ||
			tw <= 0 || th <= 0))
		{
		    return false;
		}
		
		var tx = a.x;
		var ty = a.y;
		var rx = b.x;
		var ry = b.y;
		
		rw += rx;
		rh += ry;
		tw += tx;
		th += ty;

		return ((rw < rx || rw > tx) &&
			(rh < ry || rh > ty) &&
			(tw < tx || tw > rx) &&
			(th < ty || th > ry));
	},

	/**
	 * Function: intersectsHotspot
	 * 
	 * Returns true if the state and the hotspot intersect.
	 * 
	 * Parameters:
	 * 
	 * state - <mxCellState>
	 * x - X-coordinate.
	 * y - Y-coordinate.
	 * hotspot - Optional size of the hostpot.
	 * min - Optional min size of the hostpot.
	 * max - Optional max size of the hostpot.
	 */
	intersectsHotspot: function(state, x, y, hotspot, min, max)
	{
		hotspot = (hotspot != null) ? hotspot : 1;
		min = (min != null) ? min : 0;
		max = (max != null) ? max : 0;
		
		if (hotspot > 0)
		{
			var cx = state.getCenterX();
			var cy = state.getCenterY();
			var w = state.width;
			var h = state.height;
			
			var start = mxUtils.getValue(state.style, mxConstants.STYLE_STARTSIZE) * state.view.scale;

			if (start > 0)
			{
				if (mxUtils.getValue(state.style, mxConstants.STYLE_HORIZONTAL, true))
				{
					cy = state.y + start / 2;
					h = start;
				}
				else
				{
					cx = state.x + start / 2;
					w = start;
				}
			}

			w = Math.max(min, w * hotspot);
			h = Math.max(min, h * hotspot);
			
			if (max > 0)
			{
				w = Math.min(w, max);
				h = Math.min(h, max);
			}
			
			var rect = new mxRectangle(cx - w / 2, cy - h / 2, w, h);
			var alpha = mxUtils.toRadians(mxUtils.getValue(state.style, mxConstants.STYLE_ROTATION) || 0);
			
			if (alpha != 0)
			{
				var cos = Math.cos(-alpha);
				var sin = Math.sin(-alpha);
				var cx = new mxPoint(state.getCenterX(), state.getCenterY());
				var pt = mxUtils.getRotatedPoint(new mxPoint(x, y), cos, sin, cx);
				x = pt.x;
				y = pt.y;
			}
			
			return mxUtils.contains(rect, x, y);			
		}
		
		return true;
	},

	/**
	 * Function: getOffset
	 * 
	 * Returns the offset for the specified container as an <mxPoint>. The
	 * offset is the distance from the top left corner of the container to the
	 * top left corner of the document.
	 * 
	 * Parameters:
	 * 
	 * container - DOM node to return the offset for.
	 * scollOffset - Optional boolean to add the scroll offset of the document.
	 * Default is false.
	 */
	getOffset: function(container, scrollOffset)
	{
		var offsetLeft = 0;
		var offsetTop = 0;
		
		// Ignores document scroll origin for fixed elements
		var fixed = false;
		var node = container;
		var b = document.body;
		var d = document.documentElement;

		while (node != null && node != b && node != d && !fixed)
		{
			var style = mxUtils.getCurrentStyle(node);
			
			if (style != null)
			{
				fixed = fixed || style.position == 'fixed';
			}
			
			node = node.parentNode;
		}
		
		if (!scrollOffset && !fixed)
		{
			var offset = mxUtils.getDocumentScrollOrigin(container.ownerDocument);
			offsetLeft += offset.x;
			offsetTop += offset.y;
		}
		
		var r = container.getBoundingClientRect();
		
		if (r != null)
		{
			offsetLeft += r.left;
			offsetTop += r.top;
		}
		
		return new mxPoint(offsetLeft, offsetTop);
	},

	/**
	 * Function: getDocumentScrollOrigin
	 * 
	 * Returns the scroll origin of the given document or the current document
	 * if no document is given.
	 */
	getDocumentScrollOrigin: function(doc)
	{
		var wnd = doc.defaultView || doc.parentWindow;
			
		var x = (wnd != null && window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
		var y = (wnd != null && window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		
		return new mxPoint(x, y);
	},
	
	/**
	 * Function: getScrollOrigin
	 * 
	 * Returns the top, left corner of the viewrect as an <mxPoint>.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node whose scroll origin should be returned.
	 * includeAncestors - Whether the scroll origin of the ancestors should be
	 * included. Default is false.
	 * includeDocument - Whether the scroll origin of the document should be
	 * included. Default is true.
	 */
	getScrollOrigin: function(node, includeAncestors, includeDocument)
	{
		includeAncestors = (includeAncestors != null) ? includeAncestors : false;
		includeDocument = (includeDocument != null) ? includeDocument : true;
		
		var doc = (node != null) ? node.ownerDocument : document;
		var b = doc.body;
		var d = doc.documentElement;
		var result = new mxPoint();
		var fixed = false;

		while (node != null && node != b && node != d)
		{
			if (!isNaN(node.scrollLeft) && !isNaN(node.scrollTop))
			{
				result.x += node.scrollLeft;
				result.y += node.scrollTop;
			}
			
			var style = mxUtils.getCurrentStyle(node);
			
			if (style != null)
			{
				fixed = fixed || style.position == 'fixed';
			}

			node = (includeAncestors) ? node.parentNode : null;
		}

		if (!fixed && includeDocument)
		{
			var origin = mxUtils.getDocumentScrollOrigin(doc);

			result.x += origin.x;
			result.y += origin.y;
		}
		
		return result;
	},

	/**
	 * Function: convertPoint
	 * 
	 * Converts the specified point (x, y) using the offset of the specified
	 * container and returns a new <mxPoint> with the result.
	 * 
	 * (code)
	 * var pt = mxUtils.convertPoint(graph.container,
	 *   mxEvent.getClientX(evt), mxEvent.getClientY(evt));
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * container - DOM node to use for the offset.
	 * x - X-coordinate of the point to be converted.
	 * y - Y-coordinate of the point to be converted.
	 */
	convertPoint: function(container, x, y)
	{
		var origin = mxUtils.getScrollOrigin(container, false);
		var offset = mxUtils.getOffset(container);

		offset.x -= origin.x;
		offset.y -= origin.y;
		
		return new mxPoint(x - offset.x, y - offset.y);
	},
	
	/**
	 * Function: removeJavascriptProtocol
	 * 
	 * Removes leading javascript: protocol from the given link.
	 * 
	 * Parameters:
	 * 
	 * link - String that represents the link.
	 */
	removeJavascriptProtocol: function(link)
	{
		link = (link != null) ? mxUtils.zapGremlins(link) : null;

		while (link != null && mxUtils.ltrim(link.toLowerCase()).substring(0, 11) === 'javascript:')
		{
			link = link.substring(link.toLowerCase().indexOf(':') + 1);
		}

		return link;
	},
	
	/**
	 * Function: zapGremlins
	 * 
	 * Removes all illegal control characters with ASCII code <32 except TAB, LF
	 * and CR.
	 * 
	 * Parameters:
	 * 
	 * text - String that represents the text.
	 */
	zapGremlins: function(text)
	{
		var lastIndex = 0;
		var checked = [];
		
		for (var i = 0; i < text.length; i++)
		{
			var code = text.charCodeAt(i);
			
			// Removes all control chars except TAB, LF and CR
			if (!((code >= 32 || code == 9 || code == 10 || code == 13) &&
				code != 0xFFFF && code != 0xFFFE))
			{
				checked.push(text.substring(lastIndex, i));
				lastIndex = i + 1;
			}
		}
		
		if (lastIndex > 0 && lastIndex < text.length)
		{
			checked.push(text.substring(lastIndex));
		}
		
		return (checked.length == 0) ? text : checked.join('');
	},

	/**
	 * Function: ltrim
	 * 
	 * Strips all whitespaces from the beginning of the string. Without the
	 * second parameter, this will trim these characters:
	 * 
	 * - " " (ASCII 32 (0x20)), an ordinary space
	 * - "\t" (ASCII 9 (0x09)), a tab
	 * - "\n" (ASCII 10 (0x0A)), a new line (line feed)
	 * - "\r" (ASCII 13 (0x0D)), a carriage return
	 * - "\0" (ASCII 0 (0x00)), the NUL-byte
	 * - "\x0B" (ASCII 11 (0x0B)), a vertical tab
	 */
	ltrim: function(str, chars)
	{
		chars = chars || "\\s|\\0";
		
		return (str != null) ? str.replace(new RegExp("^[" + chars + "]+", "g"), "") : null;
	},
	
	/**
	 * Function: rtrim
	 * 
	 * Strips all whitespaces from the end of the string. Without the second
	 * parameter, this will trim these characters:
	 * 
	 * - " " (ASCII 32 (0x20)), an ordinary space
	 * - "\t" (ASCII 9 (0x09)), a tab
	 * - "\n" (ASCII 10 (0x0A)), a new line (line feed)
	 * - "\r" (ASCII 13 (0x0D)), a carriage return
	 * - "\0" (ASCII 0 (0x00)), the NUL-byte
	 * - "\x0B" (ASCII 11 (0x0B)), a vertical tab
	 */
	rtrim: function(str, chars)
	{
		chars = chars || "\\s|\\0";
		
		return (str != null) ? str.replace(new RegExp("[" + chars + "]+$", "g"), "") : null;
	},
	
	/**
	 * Function: trim
	 * 
	 * Strips all whitespaces from both end of the string.
	 * Without the second parameter, Javascript function will trim these
	 * characters:
	 * 
	 * - " " (ASCII 32 (0x20)), an ordinary space
	 * - "\t" (ASCII 9 (0x09)), a tab
	 * - "\n" (ASCII 10 (0x0A)), a new line (line feed)
	 * - "\r" (ASCII 13 (0x0D)), a carriage return
	 * - "\0" (ASCII 0 (0x00)), the NUL-byte
	 * - "\x0B" (ASCII 11 (0x0B)), a vertical tab
	 */
	trim: function(str, chars)
	{
		return mxUtils.ltrim(mxUtils.rtrim(str, chars), chars);
	},
	
	/**
	 * Function: isNumeric
	 * 
	 * Returns true if the specified value is numeric, that is, if it is not
	 * null, not an empty string, not a HEX number and isNaN returns false.
	 * 
	 * Parameters:
	 * 
	 * n - String representing the possibly numeric value.
	 */
	isNumeric: function(n)
	{
		return !isNaN(parseFloat(n)) && isFinite(n) && (typeof(n) != 'string' || n.toLowerCase().indexOf('0x') < 0);
	},

	/**
	 * Function: isInteger
	 * 
	 * Returns true if the given value is an valid integer number.
	 * 
	 * Parameters:
	 * 
	 * n - String representing the possibly numeric value.
	 */
	isInteger: function(n)
	{
		return String(parseInt(n)) === String(n);
	},

	/**
	 * Function: mod
	 * 
	 * Returns the remainder of division of n by m. You should use this instead
	 * of the built-in operation as the built-in operation does not properly
	 * handle negative numbers.
	 */
	mod: function(n, m)
	{
		return ((n % m) + m) % m;
	},

	/**
	 * Function: intersection
	 * 
	 * Returns the intersection of two lines as an <mxPoint>.
	 * 
	 * Parameters:
	 * 
	 * x0 - X-coordinate of the first line's startpoint.
	 * y0 - X-coordinate of the first line's startpoint.
	 * x1 - X-coordinate of the first line's endpoint.
	 * y1 - Y-coordinate of the first line's endpoint.
	 * x2 - X-coordinate of the second line's startpoint.
	 * y2 - Y-coordinate of the second line's startpoint.
	 * x3 - X-coordinate of the second line's endpoint.
	 * y3 - Y-coordinate of the second line's endpoint.
	 */
	intersection: function (x0, y0, x1, y1, x2, y2, x3, y3)
	{
		var denom = ((y3 - y2) * (x1 - x0)) - ((x3 - x2) * (y1 - y0));
		var nume_a = ((x3 - x2) * (y0 - y2)) - ((y3 - y2) * (x0 - x2));
		var nume_b = ((x1 - x0) * (y0 - y2)) - ((y1 - y0) * (x0 - x2));

		var ua = nume_a / denom;
		var ub = nume_b / denom;
		
		if(ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0)
		{
			// Get the intersection point
			var x = x0 + ua * (x1 - x0);
			var y = y0 + ua * (y1 - y0);
			
			return new mxPoint(x, y);
		}
		
		// No intersection
		return null;
	},
	
	/**
	 * Function: ptSegDistSq
	 * 
	 * Returns the square distance between a segment and a point. To get the
	 * distance between a point and a line (with infinite length) use
	 * <mxUtils.ptLineDist>.
	 * 
	 * Parameters:
	 * 
	 * x1 - X-coordinate of the startpoint of the segment.
	 * y1 - Y-coordinate of the startpoint of the segment.
	 * x2 - X-coordinate of the endpoint of the segment.
	 * y2 - Y-coordinate of the endpoint of the segment.
	 * px - X-coordinate of the point.
	 * py - Y-coordinate of the point.
	 */
	ptSegDistSq: function(x1, y1, x2, y2, px, py)
    {
		x2 -= x1;
		y2 -= y1;

		px -= x1;
		py -= y1;

		var dotprod = px * x2 + py * y2;
		var projlenSq;

		if (dotprod <= 0.0)
		{
		    projlenSq = 0.0;
		}
		else
		{
		    px = x2 - px;
		    py = y2 - py;
		    dotprod = px * x2 + py * y2;

		    if (dotprod <= 0.0)
		    {
				projlenSq = 0.0;
		    }
		    else
		    {
				projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
		    }
		}

		var lenSq = px * px + py * py - projlenSq;
		
		if (lenSq < 0)
		{
		    lenSq = 0;
		}
		
		return lenSq;
    },
	
	/**
	 * Function: ptLineDist
	 * 
	 * Returns the distance between a line defined by two points and a point.
	 * To get the distance between a point and a segment (with a specific
	 * length) use <mxUtils.ptSegDistSq>.
	 * 
	 * Parameters:
	 * 
	 * x1 - X-coordinate of point 1 of the line.
	 * y1 - Y-coordinate of point 1 of the line.
	 * x2 - X-coordinate of point 1 of the line.
	 * y2 - Y-coordinate of point 1 of the line.
	 * px - X-coordinate of the point.
	 * py - Y-coordinate of the point.
	 */
    ptLineDist: function(x1, y1, x2, y2, px, py)
    {
		return Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) /
			Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
    },
    	
	/**
	 * Function: relativeCcw
	 * 
	 * Returns 1 if the given point on the right side of the segment, 0 if its
	 * on the segment, and -1 if the point is on the left side of the segment.
	 * 
	 * Parameters:
	 * 
	 * x1 - X-coordinate of the startpoint of the segment.
	 * y1 - Y-coordinate of the startpoint of the segment.
	 * x2 - X-coordinate of the endpoint of the segment.
	 * y2 - Y-coordinate of the endpoint of the segment.
	 * px - X-coordinate of the point.
	 * py - Y-coordinate of the point.
	 */
	relativeCcw: function(x1, y1, x2, y2, px, py)
    {
		x2 -= x1;
		y2 -= y1;
		px -= x1;
		py -= y1;
		var ccw = px * y2 - py * x2;
		
		if (ccw == 0.0)
		{
		    ccw = px * x2 + py * y2;
		    
		    if (ccw > 0.0)
		    {
				px -= x2;
				py -= y2;
				ccw = px * x2 + py * y2;
				
				if (ccw < 0.0)
				{
				    ccw = 0.0;
				}
		    }
		}
		
		return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0);
    },
    
	/**
	 * Function: animateChanges
	 * 
	 * See <mxEffects.animateChanges>. This is for backwards compatibility and
	 * will be removed later.
	 */
	animateChanges: function(graph, changes)
	{
		// LATER: Deprecated, remove this function
    	mxEffects.animateChanges.apply(this, arguments);
	},
    
	/**
	 * Function: cascadeOpacity
	 * 
	 * See <mxEffects.cascadeOpacity>. This is for backwards compatibility and
	 * will be removed later.
	 */
    cascadeOpacity: function(graph, cell, opacity)
	{
		mxEffects.cascadeOpacity.apply(this, arguments);
	},

	/**
	 * Function: fadeOut
	 * 
	 * See <mxEffects.fadeOut>. This is for backwards compatibility and
	 * will be removed later.
	 */
	fadeOut: function(node, from, remove, step, delay, isEnabled)
	{
		mxEffects.fadeOut.apply(this, arguments);
	},
	
	/**
	 * Function: setOpacity
	 * 
	 * Sets the opacity of the specified DOM node to the given value in %.
	 * 
	 * Parameters:
	 * 
	 * node - DOM node to set the opacity for.
	 * value - Opacity in %. Possible values are between 0 and 100.
	 */
	setOpacity: function(node, value)
	{
		if (mxClient.IS_IE && (typeof(document.documentMode) === 'undefined' || document.documentMode < 9))
	    {
	    	if (value >= 100)
	    	{
	    		node.style.filter = '';
	    	}
	    	else
	    	{
			    node.style.filter = 'alpha(opacity=' + value + ')';
	    	}
		}
		else
		{
		    node.style.opacity = (value / 100);
		}
	},

	/**
	 * Function: createElementNs
	 * 
	 * Helper function for creating an element in a namespace.
	 * 
	 * Parameters:
	 * 
	 * doc - Owner document of the new element.
	 * ns - Namespace for the element.
	 * tagName - Qualified name of the element.
	 */
	createElementNs: function(doc, ns, tagName)
	{
		if (doc.createElementNS != null)
		{
			return doc.createElementNS(ns, tagName);
		}
		else
		{
			var elt = doc.createElement(tagName);
			
			if (namespace != null)
			{
				elt.setAttribute('xmlns', ns);
			}
			
			return elt;
		}
	},
	
	/**
	 * Function: createImage
	 * 
	 * Creates and returns an image (IMG node).
	 * 
	 * Parameters:
	 * 
	 * src - URL that points to the image to be displayed.
	 */
	createImage: function(src)
	{
        var imageNode = null;
		imageNode = document.createElement('img');
		imageNode.setAttribute('src', src);
		imageNode.setAttribute('border', '0');
		
		return imageNode;
	},

	/**
	 * Function: sortCells
	 * 
	 * Sorts the given cells according to the order in the cell hierarchy.
	 * Ascending is optional and defaults to true.
	 */
	sortCells: function(cells, ascending)
	{
		ascending = (ascending != null) ? ascending : true;
		var lookup = new mxDictionary();
		cells.sort(function(o1, o2)
		{
			var p1 = lookup.get(o1);
			
			if (p1 == null)
			{
				p1 = mxCellPath.create(o1).split(mxCellPath.PATH_SEPARATOR);
				lookup.put(o1, p1);
			}
			
			var p2 = lookup.get(o2);
			
			if (p2 == null)
			{
				p2 = mxCellPath.create(o2).split(mxCellPath.PATH_SEPARATOR);
				lookup.put(o2, p2);
			}
			
			var comp = mxCellPath.compare(p1, p2);
			
			return (comp == 0) ? 0 : (((comp > 0) == ascending) ? 1 : -1);
		});
		
		return cells;
	},

	/**
	 * Function: getStylename
	 * 
	 * Returns the stylename in a style of the form [(stylename|key=value);] or
	 * an empty string if the given style does not contain a stylename.
	 * 
	 * Parameters:
	 * 
	 * style - String of the form [(stylename|key=value);].
	 */
	getStylename: function(style)
	{
		if (style != null)
		{
			var pairs = style.split(';');
			var stylename = pairs[0];
			
			if (stylename.indexOf('=') < 0)
			{
				return stylename;
			}
		}
				
		return '';
	},

	/**
	 * Function: getStylenames
	 * 
	 * Returns the stylenames in a style of the form [(stylename|key=value);]
	 * or an empty array if the given style does not contain any stylenames.
	 * 
	 * Parameters:
	 * 
	 * style - String of the form [(stylename|key=value);].
	 */
	getStylenames: function(style)
	{
		var result = [];
		
		if (style != null)
		{
			var pairs = style.split(';');
			
			for (var i = 0; i < pairs.length; i++)
			{
				if (pairs[i].indexOf('=') < 0)
				{
					result.push(pairs[i]);
				}
			}
		}
				
		return result;
	},

	/**
	 * Function: indexOfStylename
	 * 
	 * Returns the index of the given stylename in the given style. This
	 * returns -1 if the given stylename does not occur (as a stylename) in the
	 * given style, otherwise it returns the index of the first character.
	 */
	indexOfStylename: function(style, stylename)
	{
		if (style != null && stylename != null)
		{
			var tokens = style.split(';');
			var pos = 0;
			
			for (var i = 0; i < tokens.length; i++)
			{
				if (tokens[i] == stylename)
				{
					return pos;
				}
				
				pos += tokens[i].length + 1;
			}
		}

		return -1;
	},
	
	/**
	 * Function: addStylename
	 * 
	 * Adds the specified stylename to the given style if it does not already
	 * contain the stylename.
	 */
	addStylename: function(style, stylename)
	{
		if (mxUtils.indexOfStylename(style, stylename) < 0)
		{
			if (style == null)
			{
				style = '';
			}
			else if (style.length > 0 && style.charAt(style.length - 1) != ';')
			{
				style += ';';
			}
			
			style += stylename;
		}
		
		return style;
	},
	
	/**
	 * Function: removeStylename
	 * 
	 * Removes all occurrences of the specified stylename in the given style
	 * and returns the updated style. Trailing semicolons are not preserved.
	 */
	removeStylename: function(style, stylename)
	{
		var result = [];
		
		if (style != null)
		{
			var tokens = style.split(';');
			
			for (var i = 0; i < tokens.length; i++)
			{
				if (tokens[i] != stylename)
				{
					result.push(tokens[i]);
				}
			}
		}
		
		return result.join(';');
	},
	
	/**
	 * Function: removeAllStylenames
	 * 
	 * Removes all stylenames from the given style and returns the updated
	 * style.
	 */
	removeAllStylenames: function(style)
	{
		var result = [];
		
		if (style != null)
		{
			var tokens = style.split(';');
			
			for (var i = 0; i < tokens.length; i++)
			{
				// Keeps the key, value assignments
				if (tokens[i].indexOf('=') >= 0)
				{
					result.push(tokens[i]);
				}
			}
		}
		
		return result.join(';');
	},

	/**
	 * Function: setCellStyles
	 * 
	 * Assigns the value for the given key in the styles of the given cells, or
	 * removes the key from the styles if the value is null.
	 * 
	 * Parameters:
	 * 
	 * model - <mxGraphModel> to execute the transaction in.
	 * cells - Array of <mxCells> to be updated.
	 * key - Key of the style to be changed.
	 * value - New value for the given key.
	 */
	setCellStyles: function(model, cells, key, value)
	{
		if (cells != null && cells.length > 0)
		{
			model.beginUpdate();
			try
			{
				for (var i = 0; i < cells.length; i++)
				{
					if (cells[i] != null)
					{
						var style = mxUtils.setStyle(model.getStyle(cells[i]), key, value);
						model.setStyle(cells[i], style);
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		}
	},
	
	/**
	 * Function: parseHexColor
	 * 
	 * Returns an object with r, g, b and a properties in the range 0-255.
	 */
	parseHexColor: function(value, alpha)
	{
		var result = null;

		if (value != null && value.length >= 7 && value.charAt(0) == '#')
		{
			var r = parseInt(value.substring(1, 3), 16);
			var g = parseInt(value.substring(3, 5), 16);
			var b = parseInt(value.substring(5, 7), 16);
			var a = (alpha != null) ? alpha : 1;
			
			if (value.length > 7)
			{
				a = parseInt(value.substring(7, 9), 16) / 255;
			}

			result = {r: r, g: g, b: b, a: a};
		}

		return result;
	},
	
	/**
	 * Function: hex2rgb
	 * 
	 * Converts the given hexadecimal color value to an RGB string.
	 */
	hex2rgb: function(value)
	{
		var rgb = mxUtils.parseHexColor(value);

		if (rgb != null)
		{
			value = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
		}

		return value;
	},
	
	/**
	 * Function: hex2rgba
	 * 
	 * Converts the given hexadecimal color value to an RGBA string.
	 */
	hex2rgba: function(value, alpha)
	{
		var rgba = mxUtils.parseHexColor(value, alpha);

		if (rgba != null)
		{
			value = 'rgba(' + rgba.r + ', ' + rgba.g + ', ' +
				rgba.b + ', ' + rgba.a + ')';
		}
		
		return value;
	},
	
	/**
	 * 	Function: rgba2hex
	 * 
	 *  Converts the given RGBA color value to a hexadecimal string (or return the original input if it's not rgb).
	 */
	rgba2hex: function (color)
	{
		rgb = color && color.match? color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i) : color;
		
		return (rgb && rgb.length === 4) ? "#" +
			("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : color;
	},
	
	/**
	 * Function: setStyle
	 * 
	 * Adds or removes the given key, value pair to the style and returns the
	 * new style. If value is null or zero length then the key is removed from
	 * the style. This is for cell styles, not for CSS styles.
	 * 
	 * Parameters:
	 * 
	 * style - String of the form [(stylename|key=value);].
	 * key - Key of the style to be changed.
	 * value - New value for the given key.
	 */
	setStyle: function(style, key, value)
	{
		var isValue = value != null && (typeof(value.length) == 'undefined' || value.length > 0);
		
		if (style == null || style.length == 0)
		{
			if (isValue)
			{
				style = key + '=' + value + ';';
			}
		}
		else
		{
			if (style.substring(0, key.length + 1) == key + '=')
			{
				var next = style.indexOf(';');
				
				if (isValue)
				{
					style = key + '=' + value + ((next < 0) ? ';' : style.substring(next));
				}
				else
				{
					style = (next < 0 || next == style.length - 1) ? '' : style.substring(next + 1);
				}
			}
			else
			{
				var index = style.indexOf(';' + key + '=');
				
				if (index < 0)
				{
					if (isValue)
					{
						var sep = (style.charAt(style.length - 1) == ';') ? '' : ';';
						style = style + sep + key + '=' + value + ';';
					}
				}
				else
				{
					var next = style.indexOf(';', index + 1);
					
					if (isValue)
					{
						style = style.substring(0, index + 1) + key + '=' + value + ((next < 0) ? ';' : style.substring(next));
					}
					else
					{
						style = style.substring(0, index) + ((next < 0) ? ';' : style.substring(next));
					}
				}
			}
		}
		
		return style;
	},

	/**
	 * Function: setCellStyleFlags
	 * 
	 * Sets or toggles the flag bit for the given key in the cell's styles.
	 * If value is null then the flag is toggled.
	 * 
	 * Example:
	 * 
	 * (code)
	 * var cells = graph.getSelectionCells();
	 * mxUtils.setCellStyleFlags(graph.model,
	 * 			cells,
	 * 			mxConstants.STYLE_FONTSTYLE,
	 * 			mxConstants.FONT_BOLD);
	 * (end)
	 * 
	 * Toggles the bold font style.
	 * 
	 * Parameters:
	 * 
	 * model - <mxGraphModel> that contains the cells.
	 * cells - Array of <mxCells> to change the style for.
	 * key - Key of the style to be changed.
	 * flag - Integer for the bit to be changed.
	 * value - Optional boolean value for the flag.
	 */
	setCellStyleFlags: function(model, cells, key, flag, value)
	{
		if (cells != null && cells.length > 0)
		{
			model.beginUpdate();
			try
			{
				for (var i = 0; i < cells.length; i++)
				{
					if (cells[i] != null)
					{
						var style = mxUtils.setStyleFlag(
							model.getStyle(cells[i]),
							key, flag, value);
						model.setStyle(cells[i], style);
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		}
	},
	
	/**
	 * Function: setStyleFlag
	 * 
	 * Sets or removes the given key from the specified style and returns the
	 * new style. If value is null then the flag is toggled.
	 * 
	 * Parameters:
	 * 
	 * style - String of the form [(stylename|key=value);].
	 * key - Key of the style to be changed.
	 * flag - Integer for the bit to be changed.
	 * value - Optional boolean value for the given flag.
	 */
	setStyleFlag: function(style, key, flag, value)
	{
		if (style == null || style.length == 0)
		{
			if (value || value == null)
			{
				style = key+'='+flag;
			}
			else
			{
				style = key+'=0';
			}
		}
		else
		{
			var index = style.indexOf(key+'=');
			
			if (index < 0)
			{
				var sep = (style.charAt(style.length-1) == ';') ? '' : ';';

				if (value || value == null)
				{
					style = style + sep + key + '=' + flag;
				}
				else
				{
					style = style + sep + key + '=0';
				}
			}
			else
			{
				var cont = style.indexOf(';', index);
				var tmp = '';
				
				if (cont < 0)
				{
					tmp  = style.substring(index+key.length+1);
				}
				else
				{
					tmp = style.substring(index+key.length+1, cont);
				}
				
				if (value == null)
				{
					tmp = parseInt(tmp) ^ flag;
				}
				else if (value)
				{
					tmp = parseInt(tmp) | flag;
				}
				else
				{
					tmp = parseInt(tmp) & ~flag;
				}
				
				style = style.substring(0, index) + key + '=' + tmp +
					((cont >= 0) ? style.substring(cont) : '');
			}
		}
		
		return style;
	},
	
	/**
	 * Function: getAlignmentAsPoint
	 * 
	 * Returns an <mxPoint> that represents the horizontal and vertical alignment
	 * for numeric computations. X is -0.5 for center, -1 for right and 0 for
	 * left alignment. Y is -0.5 for middle, -1 for bottom and 0 for top
	 * alignment. Default values for missing arguments is top, left.
	 */
	getAlignmentAsPoint: function(align, valign)
	{
		var dx = -0.5;
		var dy = -0.5;
		
		// Horizontal alignment
		if (align == mxConstants.ALIGN_LEFT)
		{
			dx = 0;
		}
		else if (align == mxConstants.ALIGN_RIGHT)
		{
			dx = -1;
		}

		// Vertical alignment
		if (valign == mxConstants.ALIGN_TOP)
		{
			dy = 0;
		}
		else if (valign == mxConstants.ALIGN_BOTTOM)
		{
			dy = -1;
		}
		
		return new mxPoint(dx, dy);
	},
	
	/**
	 * Function: getSizeForString
	 * 
	 * Returns an <mxRectangle> with the size (width and height in pixels) of
	 * the given string. The string may contain HTML markup. Newlines should be
	 * converted to <br> before calling this method. The caller is responsible
	 * for sanitizing the HTML markup.
	 * 
	 * Example:
	 * 
	 * (code)
	 * var label = graph.getLabel(cell).replace(/\n/g, "<br>");
	 * var size = graph.getSizeForString(label);
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * text - String whose size should be returned.
	 * fontSize - Integer that specifies the font size in pixels. Default is
	 * <mxConstants.DEFAULT_FONTSIZE>.
	 * fontFamily - String that specifies the name of the font family. Default
	 * is <mxConstants.DEFAULT_FONTFAMILY>.
	 * textWidth - Optional width for text wrapping.
	 * fontStyle - Optional font style.
	 */
	getSizeForString: function(text, fontSize, fontFamily, textWidth, fontStyle)
	{
		fontSize = (fontSize != null) ? fontSize : mxConstants.DEFAULT_FONTSIZE;
		fontFamily = (fontFamily != null) ? fontFamily : mxConstants.DEFAULT_FONTFAMILY;
		var div = document.createElement('div');
		
		// Sets the font size and family
		div.style.fontFamily = fontFamily;
		div.style.fontSize = Math.round(fontSize) + 'px';
		div.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ?
			(fontSize * mxConstants.LINE_HEIGHT) + 'px' :
			(mxConstants.LINE_HEIGHT * mxSvgCanvas2D.prototype.lineHeightCorrection);
		
		// Sets the font style
		if (fontStyle != null)
		{
			if ((fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
			{
				div.style.fontWeight = 'bold';
			}
			
			if ((fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
			{
				div.style.fontStyle = 'italic';
			}
			
			var txtDecor = [];
			
			if ((fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
			{
				txtDecor.push('underline');
			}
			
			if ((fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
			{
				txtDecor.push('line-through');
			}
			
			if (txtDecor.length > 0)
			{
				div.style.textDecoration = txtDecor.join(' ');
			}
		}
		
		// Disables block layout and outside wrapping and hides the div
		div.style.position = 'absolute';
		div.style.visibility = 'hidden';
		div.style.display = 'inline-block';
		div.style.zoom = '1';
		
		if (textWidth != null)
		{
			div.style.width = textWidth + 'px';
			div.style.whiteSpace = 'normal';
		}
		else
		{
			div.style.whiteSpace = 'nowrap';
		}
		
		// Adds the text and inserts into DOM for updating of size
		div.innerHTML = text;
		document.body.appendChild(div);
		
		// Gets the size and removes from DOM
		var size = new mxRectangle(0, 0, div.offsetWidth, div.offsetHeight);
		document.body.removeChild(div);
		
		return size;
	},
	
	/**
	 * Function: getViewXml
	 */
	getViewXml: function(graph, scale, cells, x0, y0)
	{
		x0 = (x0 != null) ? x0 : 0;
		y0 = (y0 != null) ? y0 : 0;
		scale = (scale != null) ? scale : 1;

		if (cells == null)
		{
			var model = graph.getModel();
			cells = [model.getRoot()];
		}
		
		var view = graph.getView();
		var result = null;

		// Disables events on the view
		var eventsEnabled = view.isEventsEnabled();
		view.setEventsEnabled(false);

		// Workaround for label bounds not taken into account for image export.
		// Creates a temporary draw pane which is used for rendering the text.
		// Text rendering is required for finding the bounds of the labels.
		var drawPane = view.drawPane;
		var overlayPane = view.overlayPane;

		if (graph.dialect == mxConstants.DIALECT_SVG)
		{
			view.drawPane = document.createElementNS(mxConstants.NS_SVG, 'g');
			view.canvas.appendChild(view.drawPane);

			// Redirects cell overlays into temporary container
			view.overlayPane = document.createElementNS(mxConstants.NS_SVG, 'g');
			view.canvas.appendChild(view.overlayPane);
		}
		else
		{
			view.drawPane = view.drawPane.cloneNode(false);
			view.canvas.appendChild(view.drawPane);
			
			// Redirects cell overlays into temporary container
			view.overlayPane = view.overlayPane.cloneNode(false);
			view.canvas.appendChild(view.overlayPane);
		}

		// Resets the translation
		var translate = view.getTranslate();
		view.translate = new mxPoint(x0, y0);

		// Creates the temporary cell states in the view
		var temp = new mxTemporaryCellStates(graph.getView(), scale, cells);

		try
		{
			var enc = new mxCodec();
			result = enc.encode(graph.getView());
		}
		finally
		{
			temp.destroy();
			view.translate = translate;
			view.canvas.removeChild(view.drawPane);
			view.canvas.removeChild(view.overlayPane);
			view.drawPane = drawPane;
			view.overlayPane = overlayPane;
			view.setEventsEnabled(eventsEnabled);
		}

		return result;
	},
	
	/**
	 * Function: getScaleForPageCount
	 * 
	 * Returns the scale to be used for printing the graph with the given
	 * bounds across the specifies number of pages with the given format. The
	 * scale is always computed such that it given the given amount or fewer
	 * pages in the print output. See <mxPrintPreview> for an example.
	 * 
	 * Parameters:
	 * 
	 * pageCount - Specifies the number of pages in the print output.
	 * graph - <mxGraph> that should be printed.
	 * pageFormat - Optional <mxRectangle> that specifies the page format.
	 * Default is <mxConstants.PAGE_FORMAT_A4_PORTRAIT>.
	 * border - The border along each side of every page.
	 */
	getScaleForPageCount: function(pageCount, graph, pageFormat, border)
	{
		if (pageCount < 1)
		{
			// We can't work with less than 1 page, return no scale
			// change
			return 1;
		}
		
		pageFormat = (pageFormat != null) ? pageFormat : mxConstants.PAGE_FORMAT_A4_PORTRAIT;
		border = (border != null) ? border : 0;
		
		var availablePageWidth = pageFormat.width - (border * 2);
		var availablePageHeight = pageFormat.height - (border * 2);

		// Work out the number of pages required if the
		// graph is not scaled.
		var graphBounds = mxRectangle.fromRectangle(graph.getGraphBounds());
		var sc = graph.getView().getScale();
		graphBounds.width /= sc;
		graphBounds.height /= sc;
		var graphWidth = graphBounds.width;
		var graphHeight = graphBounds.height;
		var scale = 1;
		
		// The ratio of the width/height for each printer page
		var pageFormatAspectRatio = availablePageWidth / availablePageHeight;
		// The ratio of the width/height for the graph to be printer
		var graphAspectRatio = graphWidth / graphHeight;
		
		// The ratio of horizontal pages / vertical pages for this 
		// graph to maintain its aspect ratio on this page format
		var pagesAspectRatio = graphAspectRatio / pageFormatAspectRatio;
		
		// Factor the square root of the page count up and down 
		// by the pages aspect ratio to obtain a horizontal and 
		// vertical page count that adds up to the page count
		// and has the correct aspect ratio
		var pageRoot = Math.sqrt(pageCount);
		var pagesAspectRatioSqrt = Math.sqrt(pagesAspectRatio);
		var numRowPages = pageRoot * pagesAspectRatioSqrt;
		var numColumnPages = pageRoot / pagesAspectRatioSqrt;

		// These value are rarely more than 2 rounding downs away from
		// a total that meets the page count. In cases of one being less 
		// than 1 page, the other value can be too high and take more iterations 
		// In this case, just change that value to be the page count, since 
		// we know the other value is 1
		if (numRowPages < 1 && numColumnPages > pageCount)
		{
			var scaleChange = numColumnPages / pageCount;
			numColumnPages = pageCount;
			numRowPages /= scaleChange;
		}
		
		if (numColumnPages < 1 && numRowPages > pageCount)
		{
			var scaleChange = numRowPages / pageCount;
			numRowPages = pageCount;
			numColumnPages /= scaleChange;
		}		

		var currentTotalPages = Math.ceil(numRowPages) * Math.ceil(numColumnPages);

		var numLoops = 0;
		
		// Iterate through while the rounded up number of pages comes to
		// a total greater than the required number
		while (currentTotalPages > pageCount)
		{
			// Round down the page count (rows or columns) that is
			// closest to its next integer down in percentage terms.
			// i.e. Reduce the page total by reducing the total
			// page area by the least possible amount

			var roundRowDownProportion = Math.floor(numRowPages) / numRowPages;
			var roundColumnDownProportion = Math.floor(numColumnPages) / numColumnPages;
			
			// If the round down proportion is, work out the proportion to
			// round down to 1 page less
			if (roundRowDownProportion == 1)
			{
				roundRowDownProportion = Math.floor(numRowPages-1) / numRowPages;
			}
			if (roundColumnDownProportion == 1)
			{
				roundColumnDownProportion = Math.floor(numColumnPages-1) / numColumnPages;
			}
			
			// Check which rounding down is smaller, but in the case of very small roundings
			// try the other dimension instead
			var scaleChange = 1;
			
			// Use the higher of the two values
			if (roundRowDownProportion > roundColumnDownProportion)
			{
				scaleChange = roundRowDownProportion;
			}
			else
			{
				scaleChange = roundColumnDownProportion;
			}

			numRowPages = numRowPages * scaleChange;
			numColumnPages = numColumnPages * scaleChange;
			currentTotalPages = Math.ceil(numRowPages) * Math.ceil(numColumnPages);
			
			numLoops++;
			
			if (numLoops > 10)
			{
				break;
			}
		}

		// Work out the scale from the number of row pages required
		// The column pages will give the same value
		var posterWidth = availablePageWidth * numRowPages;
		scale = posterWidth / graphWidth;
		
		// Allow for rounding errors
		return scale * 0.99999;
	},
	
	/**
	 * Function: show
	 * 
	 * Copies the styles and the markup from the graph's container into the
	 * given document and removes all cursor styles. The document is returned.
	 * 
	 * This function should be called from within the document with the graph.
	 * If you experience problems with missing stylesheets in IE then try adding
	 * the domain to the trusted sites.
	 * 
	 * Parameters:
	 * 
	 * graph - <mxGraph> to be copied.
	 * doc - Document where the new graph is created.
	 * x0 - X-coordinate of the graph view origin. Default is 0.
	 * y0 - Y-coordinate of the graph view origin. Default is 0.
	 * w - Optional width of the graph view.
	 * h - Optional height of the graph view.
	 */
	show: function(graph, doc, x0, y0, w, h)
	{
		x0 = (x0 != null) ? x0 : 0;
		y0 = (y0 != null) ? y0 : 0;
		
		if (doc == null)
		{
			var wnd = window.open();
			doc = wnd.document;
		}
		else
		{
			doc.open();
		}

		// Workaround for missing print output in IE9 standards
		if (document.documentMode == 9)
		{
			doc.writeln('<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=9"><![endif]-->');
		}
		
		var bounds = graph.getGraphBounds();
		var dx = Math.ceil(x0 - bounds.x);
		var dy = Math.ceil(y0 - bounds.y);
		
		if (w == null)
		{
			w = Math.ceil(bounds.width + x0) + Math.ceil(Math.ceil(bounds.x) - bounds.x);
		}
		
		if (h == null)
		{
			h = Math.ceil(bounds.height + y0) + Math.ceil(Math.ceil(bounds.y) - bounds.y);
		}
		
		// Needs a special way of creating the page so that no click is required
		// to refresh the contents after the external CSS styles have been loaded.
		// To avoid a click or programmatic refresh, the styleSheets[].cssText
		// property is copied over from the original document.
		if (mxClient.IS_IE || document.documentMode == 11)
		{
			var html = '<html><head>';

			var base = document.getElementsByTagName('base');
			
			for (var i = 0; i < base.length; i++)
			{
				html += base[i].outerHTML;
			}

			html += '<style>';

			// Copies the stylesheets without having to load them again
			for (var i = 0; i < document.styleSheets.length; i++)
			{
				try
				{
					html += document.styleSheets[i].cssText;
				}
				catch (e)
				{
					// ignore security exception
				}
			}

			html += '</style></head><body style="margin:0px;">';
			
			// Copies the contents of the graph container
			html += '<div style="position:absolute;overflow:hidden;width:' + w + 'px;height:' + h + 'px;"><div style="position:relative;left:' + dx + 'px;top:' + dy + 'px;">';
			html += graph.container.innerHTML;
			html += '</div></div></body><html>';

			doc.writeln(html);
			doc.close();
		}
		else
		{
			doc.writeln('<html><head>');
			
			var base = document.getElementsByTagName('base');
			
			for (var i = 0; i < base.length; i++)
			{
				doc.writeln(mxUtils.getOuterHtml(base[i]));
			}
			
			var links = document.getElementsByTagName('link');
			
			for (var i = 0; i < links.length; i++)
			{
				doc.writeln(mxUtils.getOuterHtml(links[i]));
			}
	
			var styles = document.getElementsByTagName('style');
			
			for (var i = 0; i < styles.length; i++)
			{
				doc.writeln(mxUtils.getOuterHtml(styles[i]));
			}

			doc.writeln('</head><body style="margin:0px;"></body></html>');
			doc.close();

			var outer = doc.createElement('div');
			outer.position = 'absolute';
			outer.overflow = 'hidden';
			outer.style.width = w + 'px';
			outer.style.height = h + 'px';

			// Required for HTML labels if foreignObjects are disabled
			var div = doc.createElement('div');
			div.style.position = 'absolute';
			div.style.left = dx + 'px';
			div.style.top = dy + 'px';

			var node = graph.container.firstChild;
			var svg = null;
			
			while (node != null)
			{
				var clone = node.cloneNode(true);
				
				if (node == graph.view.drawPane.ownerSVGElement)
				{
					outer.appendChild(clone);
					svg = clone;
				}
				else
				{
					div.appendChild(clone);
				}
				
				node = node.nextSibling;
			}

			doc.body.appendChild(outer);
			
			if (div.firstChild != null)
			{
				doc.body.appendChild(div);
			}
						
			if (svg != null)
			{
				svg.style.minWidth = '';
				svg.style.minHeight = '';
				svg.firstChild.setAttribute('transform', 'translate(' + dx + ',' + dy + ')');
			}
		}
		
		mxUtils.removeCursors(doc.body);
	
		return doc;
	},
	
	/**
	 * Function: printScreen
	 * 
	 * Prints the specified graph using a new window and the built-in print
	 * dialog.
	 * 
	 * This function should be called from within the document with the graph.
	 * 
	 * Parameters:
	 * 
	 * graph - <mxGraph> to be printed.
	 */
	printScreen: function(graph)
	{
		var wnd = window.open();
		mxUtils.show(graph, wnd.document);
		
		var print = function()
		{
			wnd.focus();
			wnd.print();
			wnd.close();
		};
		
		// Workaround for Google Chrome which needs a bit of a
		// delay in order to render the SVG contents
		if (mxClient.IS_GC)
		{
			wnd.setTimeout(print, 500);
		}
		else
		{
			print();
		}
	},
	
	/**
	 * Function: popup
	 * 
	 * Shows the specified text content in a new <mxWindow> or a new browser
	 * window if isInternalWindow is false.
	 * 
	 * Parameters:
	 * 
	 * content - String that specifies the text to be displayed.
	 * isInternalWindow - Optional boolean indicating if an mxWindow should be
	 * used instead of a new browser window. Default is false.
	 */
	popup: function(content, isInternalWindow)
	{
	   	if (isInternalWindow)
	   	{
			var div = document.createElement('div');
			
			div.style.overflow = 'scroll';
			div.style.width = '636px';
			div.style.height = '460px';
			
			var pre = document.createElement('pre');
		    pre.innerHTML = mxUtils.htmlEntities(content, false).
		    	replace(/\n/g,'<br>').replace(/ /g, '&nbsp;');
			
			div.appendChild(pre);
			
			var w = document.body.clientWidth;
			var h = Math.max(document.body.clientHeight || 0, document.documentElement.clientHeight)
			var wnd = new mxWindow('Popup Window', div,
				w/2-320, h/2-240, 640, 480, false, true);

			wnd.setClosable(true);
			wnd.setVisible(true);
		}
		else
		{
			// Wraps up the XML content in a textarea
			if (mxClient.IS_NS)
			{
			    var wnd = window.open();
				wnd.document.writeln('<pre>'+mxUtils.htmlEntities(content)+'</pre');
			   	wnd.document.close();
			}
			else
			{
			    var wnd = window.open();
			    var pre = wnd.document.createElement('pre');
			    pre.innerHTML = mxUtils.htmlEntities(content, false).
			    	replace(/\n/g,'<br>').replace(/ /g, '&nbsp;');
			   	wnd.document.body.appendChild(pre);
			}
	   	}
	},
	
	/**
	 * Function: alert
	 * 
	 * Displayss the given alert in a new dialog. This implementation uses the
	 * built-in alert function. This is used to display validation errors when
	 * connections cannot be changed or created.
	 * 
	 * Parameters:
	 * 
	 * message - String specifying the message to be displayed.
	 */
	alert: function(message)
	{
		alert(message);
	},
	
	/**
	 * Function: prompt
	 * 
	 * Displays the given message in a prompt dialog. This implementation uses
	 * the built-in prompt function.
	 * 
	 * Parameters:
	 * 
	 * message - String specifying the message to be displayed.
	 * defaultValue - Optional string specifying the default value.
	 */
	prompt: function(message, defaultValue)
	{
		return prompt(message, (defaultValue != null) ? defaultValue : '');
	},
	
	/**
	 * Function: confirm
	 * 
	 * Displays the given message in a confirm dialog. This implementation uses
	 * the built-in confirm function.
	 * 
	 * Parameters:
	 * 
	 * message - String specifying the message to be displayed.
	 */
	confirm: function(message)
	{
		return confirm(message);
	},

	/**
	 * Function: error
	 * 
	 * Displays the given error message in a new <mxWindow> of the given width.
	 * If close is true then an additional close button is added to the window.
	 * The optional icon specifies the icon to be used for the window. Default
	 * is <mxUtils.errorImage>.
	 * 
	 * Parameters:
	 * 
	 * message - String specifying the message to be displayed.
	 * width - Integer specifying the width of the window.
	 * close - Optional boolean indicating whether to add a close button.
	 * icon - Optional icon for the window decoration.
	 */
	error: function(message, width, close, icon)
	{
		var div = document.createElement('div');
		div.style.padding = '20px';

		var img = document.createElement('img');
		img.setAttribute('src', icon || mxUtils.errorImage);
		img.setAttribute('valign', 'bottom');
		img.style.verticalAlign = 'middle';
		div.appendChild(img);

		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		div.appendChild(document.createTextNode('\u00a0')); // &nbsp;
		mxUtils.write(div, message);

		var w = document.body.clientWidth;
		var h = (document.body.clientHeight || document.documentElement.clientHeight);
		var warn = new mxWindow(mxResources.get(mxUtils.errorResource) ||
			mxUtils.errorResource, div, (w-width)/2, h/4, width, null,
			false, true);

		if (close)
		{
			mxUtils.br(div);
			
			var tmp = document.createElement('p');
			var button = document.createElement('button');

			if (mxClient.IS_IE)
			{
				button.style.cssText = 'float:right';
			}
			else
			{
				button.setAttribute('style', 'float:right');
			}

			mxEvent.addListener(button, 'click', function(evt)
			{
				warn.destroy();
			});

			mxUtils.write(button, mxResources.get(mxUtils.closeResource) ||
				mxUtils.closeResource);
			
			tmp.appendChild(button);
			div.appendChild(tmp);
			
			mxUtils.br(div);
			
			warn.setClosable(true);
		}
		
		warn.setVisible(true);
		
		return warn;
	},

	/**
	 * Function: makeDraggable
	 * 
	 * Configures the given DOM element to act as a drag source for the
	 * specified graph. Returns a a new <mxDragSource>. If
	 * <mxDragSource.guideEnabled> is enabled then the x and y arguments must
	 * be used in funct to match the preview location.
	 * 
	 * Example:
	 * 
	 * (code)
	 * var funct = function(graph, evt, cell, x, y)
	 * {
	 *   if (graph.canImportCell(cell))
	 *   {
	 *     var parent = graph.getDefaultParent();
	 *     var vertex = null;
	 *     
	 *     graph.getModel().beginUpdate();
	 *     try
	 *     {
	 * 	     vertex = graph.insertVertex(parent, null, 'Hello', x, y, 80, 30);
	 *     }
	 *     finally
	 *     {
	 *       graph.getModel().endUpdate();
	 *     }
	 *
	 *     graph.setSelectionCell(vertex);
	 *   }
	 * }
	 * 
	 * var img = document.createElement('img');
	 * img.setAttribute('src', 'editors/images/rectangle.gif');
	 * img.style.position = 'absolute';
	 * img.style.left = '0px';
	 * img.style.top = '0px';
	 * img.style.width = '16px';
	 * img.style.height = '16px';
	 * 
	 * var dragImage = img.cloneNode(true);
	 * dragImage.style.width = '32px';
	 * dragImage.style.height = '32px';
	 * mxUtils.makeDraggable(img, graph, funct, dragImage);
	 * document.body.appendChild(img);
	 * (end)
	 * 
	 * Parameters:
	 * 
	 * element - DOM element to make draggable.
	 * graphF - <mxGraph> that acts as the drop target or a function that takes a
	 * mouse event and returns the current <mxGraph>.
	 * funct - Function to execute on a successful drop.
	 * dragElement - Optional DOM node to be used for the drag preview.
	 * dx - Optional horizontal offset between the cursor and the drag
	 * preview.
	 * dy - Optional vertical offset between the cursor and the drag
	 * preview.
	 * autoscroll - Optional boolean that specifies if autoscroll should be
	 * used. Default is mxGraph.autoscroll.
	 * scalePreview - Optional boolean that specifies if the preview element
	 * should be scaled according to the graph scale. If this is true, then
	 * the offsets will also be scaled. Default is false.
	 * highlightDropTargets - Optional boolean that specifies if dropTargets
	 * should be highlighted. Default is true.
	 * getDropTarget - Optional function to return the drop target for a given
	 * location (x, y). Default is mxGraph.getCellAt.
	 */
	makeDraggable: function(element, graphF, funct, dragElement, dx, dy, autoscroll,
			scalePreview, highlightDropTargets, getDropTarget)
	{
		var dragSource = new mxDragSource(element, funct);
		dragSource.dragOffset = new mxPoint((dx != null) ? dx : 0,
			(dy != null) ? dy : mxConstants.TOOLTIP_VERTICAL_OFFSET);
		dragSource.autoscroll = autoscroll;
		
		// Cannot enable this by default. This needs to be enabled in the caller
		// if the funct argument uses the new x- and y-arguments.
		dragSource.setGuidesEnabled(false);
		
		if (highlightDropTargets != null)
		{
			dragSource.highlightDropTargets = highlightDropTargets;
		}
		
		// Overrides function to find drop target cell
		if (getDropTarget != null)
		{
			dragSource.getDropTarget = getDropTarget;
		}
		
		// Overrides function to get current graph
		dragSource.getGraphForEvent = function(evt)
		{
			return (typeof(graphF) == 'function') ? graphF(evt) : graphF;
		};
		
		// Translates switches into dragSource customizations
		if (dragElement != null)
		{
			dragSource.createDragElement = function()
			{
				return dragElement.cloneNode(true);
			};
			
			if (scalePreview)
			{
				dragSource.createPreviewElement = function(graph)
				{
					var elt = dragElement.cloneNode(true);

					var w = parseInt(elt.style.width);
					var h = parseInt(elt.style.height);
					elt.style.width = Math.round(w * graph.view.scale) + 'px';
					elt.style.height = Math.round(h * graph.view.scale) + 'px';
					
					return elt;
				};
			}
		}
		
		return dragSource;
	},

	/**
	 * Function: format
	 * 
	 * Rounds all numbers to 2 decimal points.
	 */
	format: function(value)
	{
		return parseFloat(parseFloat(value).toFixed(2));
	}
};
