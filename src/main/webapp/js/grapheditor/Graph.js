/**
 * Copyright (c) 2006-2012, JGraph Holdings Ltd
 */
// Workaround for handling named HTML entities in mxUtils.parseXml
// LATER: How to configure DOMParser to just ignore all entities?
(function()
{
	var entities = [
		['nbsp', '160'],
		['shy', '173']
    ];

	// Converts HTML entites for parsing XML
	var parseXml = mxUtils.parseXml;
	
	mxUtils.parseXml = function(text)
	{
		for (var i = 0; i < entities.length; i++)
	    {
	        text = text.replace(new RegExp(
	        	'&' + entities[i][0] + ';', 'g'),
		        '&#' + entities[i][1] + ';');
	    }

		return parseXml(text);
	};

	// Overrides color inversion if disabled
	// TODO

	// Sanitizes text for HTML string size measure
	var getSizeForString = mxUtils.getSizeForString;

	mxUtils.getSizeForString = function(text, fontSize, fontFamily, textWidth)
	{
		return getSizeForString(Graph.sanitizeHtml(text), fontSize, fontFamily, textWidth);
	}
})();

// Shim for missing toISOString in older versions of IE
// See https://stackoverflow.com/questions/12907862
if (!Date.prototype.toISOString)
{         
    (function()
    {         
        function pad(number)
        {
            var r = String(number);
            
            if (r.length === 1) 
            {
                r = '0' + r;
            }
            
            return r;
        };
        
        Date.prototype.toISOString = function()
        {
            return this.getUTCFullYear()
                + '-' + pad( this.getUTCMonth() + 1 )
                + '-' + pad( this.getUTCDate() )
                + 'T' + pad( this.getUTCHours() )
                + ':' + pad( this.getUTCMinutes() )
                + ':' + pad( this.getUTCSeconds() )
                + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                + 'Z';
        };       
    }());
}

// Shim for Date.now()
if (!Date.now)
{
	Date.now = function()
	{
		return new Date().getTime();
	};
}

// Polyfill for Uint8Array.from in IE11 used in Graph.decompress
// See https://stackoverflow.com/questions/36810940/alternative-or-polyfill-for-array-from-on-the-internet-explorer
if (!Uint8Array.from) {
  Uint8Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

// Overrides global constants
mxConstants.SHADOW_OPACITY = 0.25;
mxConstants.SHADOWCOLOR = '#000000';
mxConstants.VML_SHADOWCOLOR = '#d0d0d0';

mxCodec.allowlist = ['mxStylesheet', 'Array', 'mxGraphModel',
	'mxCell', 'mxGeometry', 'mxRectangle', 'mxPoint',
	'mxChildChange', 'mxRootChange', 'mxTerminalChange',
	'mxValueChange', 'mxStyleChange', 'mxGeometryChange',
	'mxCollapseChange', 'mxVisibleChange', 'mxCellAttributeChange'];
mxGraph.prototype.pageBreakColor = '#c0c0c0';
mxGraph.prototype.pageScale = 1;

// Letter page format is default in US, Canada and Mexico
(function()
{
	try
	{
		if (navigator != null && navigator.language != null)
		{
			var lang = navigator.language.toLowerCase();
			mxGraph.prototype.pageFormat = (lang === 'en-us' || lang === 'en-ca' || lang === 'es-mx') ?
				mxConstants.PAGE_FORMAT_LETTER_PORTRAIT : mxConstants.PAGE_FORMAT_A4_PORTRAIT;
		}
	}
	catch (e)
	{
		// ignore
	}
})();

// Matches label positions of mxGraph 1.x
mxText.prototype.baseSpacingTop = 5;
mxText.prototype.baseSpacingBottom = 1;

// Keeps edges between relative child cells inside parent
mxGraphModel.prototype.ignoreRelativeEdgeParent = false;

// Defines grid properties
mxGraphView.prototype.gridImage = 'data:image/gif;base64,R0lGODlhCgAKAJEAAAAAAP///8zMzP///yH5BAEAAAMALAAAAAAKAAoAAAIJ1I6py+0Po2wFADs=';
mxGraphView.prototype.gridSteps = 4;
mxGraphView.prototype.minGridSize = 4;

// UrlParams is null in embed mode
mxGraphView.prototype.defaultGridColor = '#d0d0d0';
mxGraphView.prototype.defaultDarkGridColor = '#424242';
mxGraphView.prototype.gridColor = mxGraphView.prototype.defaultGridColor;

// Units
mxGraphView.prototype.unit = mxConstants.POINTS;

mxGraphView.prototype.setUnit = function(unit) 
{
	if (this.unit != unit)
	{
	    this.unit = unit;
		// Updates placeholders that use the current unit
	    this.graph.refresh();
	    this.fireEvent(new mxEventObject('unitChanged', 'unit', unit));
	}
};

// Alternative text for unsupported foreignObjects
mxSvgCanvas2D.prototype.foAltText = '[Not supported by viewer]';

// Hook for custom constraints
mxShape.prototype.getConstraints = function(style, w, h)
{
	return null;
};

// Override for clipSvg style
mxImageShape.prototype.getImageDataUri = function()
{
	var src = String(this.image);

	if (src.substring(0, 26) == 'data:image/svg+xml;base64,' && this.style != null &&
		mxUtils.getValue(this.style, 'clipSvg', '0') == '1')
	{
		if (this.clippedSvg == null || this.clippedImage != src)
		{
			this.clippedSvg = Graph.clipSvgDataUri(src);
			this.clippedImage = src;
		}
		
		src = this.clippedSvg;
	}

	return src;
};

// Override for default colors
(function()
{
	var stencilParseColor = mxStencil.prototype.parseColor;

	mxStencil.prototype.parseColor = function(canvas, shape, node, value, graph)
	{
		if (value == 'default' && graph != null)
		{
			if (node.nodeName == 'fillcolor')
			{
				return graph.shapeBackgroundColor;
			}
			else
			{
				return graph.shapeForegroundColor;
			}
		}
		else
		{
			return stencilParseColor.apply(this, arguments);
		}
	};
})();

// Override to use key as fallback
(function()
{
	var mxResourcesGet = mxResources.get;

	mxResources.get = function(key, params, defaultValue)
	{
		if (defaultValue == null)
		{
			defaultValue = key;
		}

		return mxResourcesGet.apply(this, [key, params, defaultValue]);
	};
})();

// Override to add CSS classes
(function()
{
	var mxPopupMenuAddItem = mxPopupMenu.prototype.addItem;

	mxPopupMenu.prototype.addItem = function(title, image, funct, parent, iconCls, enabled, active, noHover)
	{
		var tr = mxPopupMenuAddItem.apply(this, arguments);

		if (image != null)
		{
			var img = tr.getElementsByTagName('img');

			if (img.length > 0)
			{
				img[0].className = 'geButton';
			}
		}

		return tr;
	};
})();

/**
 * Constructs a new graph instance. Note that the constructor does not take a
 * container because the graph instance is needed for creating the UI, which
 * in turn will create the container for the graph. Hence, the container is
 * assigned later in EditorUi.
 */
/**
 * Defines graph class.
 */
Graph = function(container, model, renderHint, stylesheet, themes, standalone)
{
	mxGraph.call(this, container, model, renderHint, stylesheet);
	
	this.themes = themes || this.defaultThemes;
	this.currentEdgeStyle = mxUtils.clone(this.defaultEdgeStyle);
	this.currentVertexStyle = mxUtils.clone(this.defaultVertexStyle);
	this.standalone = (standalone != null) ? standalone : false;

	// Sets the base domain URL and domain path URL for relative links.
	var b = this.baseUrl;
	var p = b.indexOf('//');
	this.domainUrl = '';
	this.domainPathUrl = '';
	
	if (p > 0)
	{
		var d = b.indexOf('/', p + 2);

		if (d > 0)
		{
			this.domainUrl = b.substring(0, d);
		}
		
		d = b.lastIndexOf('/');
		
		if (d > 0)
		{
			this.domainPathUrl = b.substring(0, d + 1);
		}
	}
	
    // Adds support for HTML labels via style. Note: Currently, only the Java
    // backend supports HTML labels but CSS support is limited to the following:
    // http://docs.oracle.com/javase/6/docs/api/index.html?javax/swing/text/html/CSS.html
	// TODO: Wrap should not affect isHtmlLabel output (should be handled later)
	this.isHtmlLabel = function(cell)
	{
		var style = this.getCurrentCellStyle(cell);
		
		return (style != null) ? (style['html'] == '1' || style[mxConstants.STYLE_WHITE_SPACE] == 'wrap') : false;
	};
	
	// Implements a listener for hover and click handling on edges and tables
	if (this.immediateHandling)
	{
		var start = {
			point: null,
			event: null,
			state: null,
			handle: null,
			selected: false
		};
		
		var initialSelected = false;

		// Uses this event to process mouseDown to check the selection state before it is changed
		this.addListener(mxEvent.FIRE_MOUSE_EVENT, mxUtils.bind(this, function(sender, evt)
		{
			if (evt.getProperty('eventName') == 'mouseDown' && this.isEnabled())
			{
				var me = evt.getProperty('event');
		    	var state = me.getState();
				var s = this.view.scale;
				
		    	if (!mxEvent.isAltDown(me.getEvent()) && state != null)
		    	{
					initialSelected = this.isCellSelected(state.cell);

		    		if (!this.panningHandler.isActive() && !mxEvent.isControlDown(me.getEvent()))
		    		{
			   			var handler = this.selectionCellsHandler.getHandler(state.cell);

			   			// Cell handles have precedence over row and col resize
		    			if (handler == null || handler.getHandleForEvent(me) == null)
		    			{
				    		var box = new mxRectangle(me.getGraphX() - 1, me.getGraphY() - 1);
							var tol = mxEvent.isTouchEvent(me.getEvent()) ?
								mxShape.prototype.svgStrokeTolerance - 1 :
								(mxShape.prototype.svgStrokeTolerance + 2) / 2;
							var t1 = tol + 2;
			    			box.grow(tol);

							// Ignores clicks inside cell to avoid delayed selection on
							// merged cells when clicking on invisible part of dividers
			    			if (this.isTableCell(state.cell) && this.isCellMovable(state.cell) &&
								!this.isCellSelected(state.cell) &&
								(!mxUtils.contains(state, me.getGraphX() - t1, me.getGraphY() - t1) ||
								!mxUtils.contains(state, me.getGraphX() - t1, me.getGraphY() + t1) ||
								!mxUtils.contains(state, me.getGraphX() + t1, me.getGraphY() + t1) ||
								!mxUtils.contains(state, me.getGraphX() + t1, me.getGraphY() - t1)))
			    			{
			    				var row = this.model.getParent(state.cell);
			    				var table = this.model.getParent(row);
			    				
			    				if (!this.isCellSelected(table))
			    				{
									var b = tol * s;
									var b2 = 2 * b;
									
									// Ignores events on top line of top row and left line of left column
				    				if ((this.model.getChildAt(table, 0) != row) && mxUtils.intersects(box,
											new mxRectangle(state.x, state.y - b, state.width, b2)) ||
										(this.model.getChildAt(row, 0) != state.cell) && mxUtils.intersects(box,
											new mxRectangle(state.x - b, state.y, b2, state.height)) ||
										mxUtils.intersects(box, new mxRectangle(state.x, state.y + state.height - b, state.width, b2)) ||
										mxUtils.intersects(box, new mxRectangle(state.x + state.width - b, state.y, b2, state.height)))
			    					{
				    					var wasSelected = this.selectionCellsHandler.isHandled(table);
										this.selectCellForEvent(table, me.getEvent());
						    			handler = this.selectionCellsHandler.getHandler(table);
			
						    			if (handler != null)
						    			{
						    				var handle = handler.getHandleForEvent(me);
				    				
						    				if (handle != null)
						    				{
						    					handler.start(me.getGraphX(), me.getGraphY(), handle);
						    					handler.blockDelayedSelection = !wasSelected;
						    					me.consume();
						    				}
						    			}
			    					}
			    				}
		    				}

			    			// Hover for swimlane start sizes inside tables
				    		var current = state;
				    		
				    		while (!me.isConsumed() && current != null && (this.isTableCell(current.cell) ||
				    			this.isTableRow(current.cell) || this.isTable(current.cell)))
				    		{
					    		if (this.isSwimlane(current.cell) && this.isCellMovable(current.cell))
					    		{
					    			var offset = this.getActualStartSize(current.cell);
					    			
		    						if (((offset.x > 0 || offset.width > 0) && mxUtils.intersects(box, new mxRectangle(
		    							current.x + (offset.x - offset.width - 1) * s + ((offset.x == 0) ? current.width : 0),
		    							current.y, 1, current.height))) || ((offset.y > 0 || offset.height > 0) &&
		    							mxUtils.intersects(box, new mxRectangle(current.x, current.y + (offset.y -
		    							offset.height - 1) * s + ((offset.y == 0) ? current.height : 0), current.width, 1))))
		    						{
		    							this.selectCellForEvent(current.cell, me.getEvent());
						    			handler = this.selectionCellsHandler.getHandler(current.cell);
			
						    			if (handler != null && handler.customHandles != null)
						    			{
						    				// Swimlane start size handle is last custom handle
						    				var handle = mxEvent.CUSTOM_HANDLE - handler.customHandles.length + 1;
					    					handler.start(me.getGraphX(), me.getGraphY(), handle);
					    					me.consume();
						    			}
		    						}
					    		}
					    		
					    		current = this.view.getState(this.model.getParent(current.cell));
				    		}
		    			}
		    		}
		    	}
			}
		}));
		
		// Uses this event to process mouseDown to check the selection state before it is changed
		this.addListener(mxEvent.CONSUME_MOUSE_EVENT, mxUtils.bind(this, function(sender, evt)
		{
			if (evt.getProperty('eventName') == 'mouseDown' && this.isEnabled())
			{
				var me = evt.getProperty('event');
				var state = me.getState();
				
				if (!mxEvent.isAltDown(me.getEvent()) && !mxEvent.isControlDown(evt) &&
					!mxEvent.isShiftDown(evt) && !initialSelected &&
					state != null && this.model.isEdge(state.cell))
				{
					start.point = new mxPoint(me.getGraphX(), me.getGraphY());
					start.selected = this.isCellSelected(state.cell);
					start.state = state;
					start.event = me;
					
					if (state.text != null && state.text.boundingBox != null &&
						mxUtils.contains(state.text.boundingBox, me.getGraphX(), me.getGraphY()))
					{
						start.handle = mxEvent.LABEL_HANDLE;
					}
					else
					{
						var handler = this.selectionCellsHandler.getHandler(state.cell);

						if (handler != null && handler.bends != null && handler.bends.length > 0)
						{
							start.handle = handler.getHandleForEvent(me);
						}
					}
				}
			}
		}));

		this.addMouseListener(
		{
			mouseDown: function(sender, me) {},
		    mouseMove: mxUtils.bind(this, function(sender, me)
		    {
		    	// Checks if any other handler is active
		    	var handlerMap = this.selectionCellsHandler.handlers.map;
		    	
		    	for (var key in handlerMap)
		    	{
		    		if (handlerMap[key].index != null)
		    		{
		    			return;
		    		}
		    	}
		    	
		    	if (this.isEnabled() && !this.panningHandler.isActive() && !mxEvent.isAltDown(me.getEvent()))
		    	{
		    		var tol = this.tolerance;
	
			    	if (start.point != null && start.state != null && start.event != null)
			    	{
			    		var state = start.state;
			    		
			    		if (start.handle != null || Math.abs(start.point.x - me.getGraphX()) > tol ||
			    			Math.abs(start.point.y - me.getGraphY()) > tol)
			    		{
			    			var handler = null;

							if (!mxEvent.isShiftDown(me.getEvent()))
							{
								handler = this.selectionCellsHandler.getHandler(state.cell);
							}
			    			
			    			if (handler != null && handler.bends != null && handler.bends.length > 0)
			    			{
								handler.redrawHandles();
			    				var handle = (start.handle != null) ? start.handle :
									handler.getHandleForEvent(start.event);
			    				var edgeStyle = this.view.getEdgeStyle(state);
								var entity = edgeStyle == mxEdgeStyle.EntityRelation;
								var pts = state.absolutePoints;
			    				
			    				// Handles special case where label was clicked on unselected edge in which
			    				// case the label will be moved regardless of the handle that is returned
			    				if (!start.selected)// && start.handle == mxEvent.LABEL_HANDLE)
			    				{
			    					handle = start.handle;
			    				}
			    				
								if (handle != mxEvent.LABEL_HANDLE && pts != null)
								{
									// Does not use handles if they were not initially visible
									handle = start.handle;

									if (handle == null)
									{
										var box = new mxRectangle(start.point.x, start.point.y);
										box.grow(mxEdgeHandler.prototype.handleImage.width / 2);
										
										if (mxUtils.contains(box, pts[0].x, pts[0].y))
										{
											// Moves source terminal handle
											handle = 0;
										}
										else if (mxUtils.contains(box, pts[pts.length - 1].x, pts[pts.length - 1].y))
										{
											// Moves target terminal handle
											handle = handler.bends.length - 1;
										}
										else if (pts != null && ((edgeStyle == null && handle == null) ||
											edgeStyle == mxEdgeStyle.SegmentConnector ||
											edgeStyle == mxEdgeStyle.OrthConnector))
										{
											// Checks if edge has no bends
											var nobends = edgeStyle != null && (pts.length == 2 || (pts.length == 3 &&
												((Math.round(pts[0].x - pts[1].x) == 0 && Math.round(pts[1].x - pts[2].x) == 0) ||
												(Math.round(pts[0].y - pts[1].y) == 0 && Math.round(pts[1].y - pts[2].y) == 0))));
											
											if (nobends)
											{
												// Moves central handle for straight orthogonal edges
												handle = 2;
											}
											else
											{
												// Finds and moves vertical or horizontal segment
												handle = mxUtils.findNearestSegment(state, start.point.x, start.point.y);
												
												// Converts segment to virtual handle index
												if (edgeStyle == null)
												{
													handle = mxEvent.VIRTUAL_HANDLE - handle;
												}
												// Maps segment to handle
												else
												{
													handle += 1;
												}
											}
										}
									}
									
									// Creates a new waypoint and starts moving it
									if (handle == null)
									{
										handle = mxEvent.VIRTUAL_HANDLE;
									}
								}

								var validEdge = !entity && (state.visibleSourceState != null ||
										state.visibleTargetState != null);
								var validHandle = handle == mxEvent.LABEL_HANDLE ||
									handle == 0 || handle == handler.bends.length - 1;

								if (validEdge || validHandle)
								{
									handler.start(me.getGraphX(), me.getGraphX(), handle);
									me.consume();

									// Removes preview rectangle in graph handler
									this.graphHandler.reset();
								}
			    			}
			    			
			    			if (handler != null)
			    			{
				    			// Lazy selection for edges inside groups
			    				if (this.selectionCellsHandler.isHandlerActive(handler))
			    				{
					    			if (!this.isCellSelected(state.cell))
					    			{
					    				this.selectionCellsHandler.handlers.put(state.cell, handler);
					    				this.selectCellForEvent(state.cell, me.getEvent());
					    			}
			    				}
				    			else if (!this.isCellSelected(state.cell))
				    			{
				    				// Destroy temporary handler
				    				handler.destroy();
				    			}
			    			}
			    
			    			// Reset start state
		    				start.selected = false;
		    				start.handle = null;
	    					start.state = null;
		    				start.event = null;
		    				start.point = null;
			    		}
			    	}
			    	else
			    	{
			    		// Updates cursor for unselected edges under the mouse
				    	var state = me.getState();
						
				    	if (state != null && this.isCellEditable(state.cell))
				    	{
							var parent = this.model.getParent(state.cell);
				    		var cursor = null;
				    		
				    		// Checks if state was removed in call to stopEditing above
				    		if (this.model.isEdge(state.cell) &&
								!this.isCellSelected(state.cell) &&
								!mxEvent.isAltDown(me.getEvent()) &&
								!mxEvent.isShiftDown(me.getEvent()) &&

								// Immediate edge handling unavailable
								// in groups and selected ancestors
								!this.isAncestorSelected(state.cell) &&
								(this.isSwimlane(parent) ||
								this.model.isLayer(parent) ||
								this.getCurrentRoot() == parent))
				    		{
				    			var box = new mxRectangle(me.getGraphX(), me.getGraphY());
		    					box.grow(mxEdgeHandler.prototype.handleImage.width / 2);
			    				var pts = state.absolutePoints;
			    				
			    				if (pts != null)
			    				{
			    					if (state.text != null && state.text.boundingBox != null &&
			    						mxUtils.contains(state.text.boundingBox, me.getGraphX(), me.getGraphY()))
			    					{
			    						cursor = 'move';
			    					}
			    					else if (mxUtils.contains(box, pts[0].x, pts[0].y) ||
			    						mxUtils.contains(box, pts[pts.length - 1].x, pts[pts.length - 1].y))
			    					{
			    						cursor = 'pointer';
			    					}
									else
									{
										var edgeStyle = this.view.getEdgeStyle(state);

										if (edgeStyle != mxEdgeStyle.EntityRelation &&
											(state.visibleSourceState != null ||
											state.visibleTargetState != null))
										{
											cursor = 'crosshair';
											
											if (edgeStyle == mxEdgeStyle.SegmentConnector ||
												edgeStyle == mxEdgeStyle.OrthConnector)
											{
												var idx = mxUtils.findNearestSegment(state, me.getGraphX(), me.getGraphY());
												
												if (idx < pts.length - 1 && idx >= 0)
												{
													cursor = (Math.round(pts[idx].x - pts[idx + 1].x) == 0) ?
														'col-resize' : 'row-resize';
												}
											}
										}
									}
			    				}
				    		}
				    		else if (!mxEvent.isControlDown(me.getEvent()))
				    		{
								var tol = mxShape.prototype.svgStrokeTolerance / 2;
				    			var box = new mxRectangle(me.getGraphX(), me.getGraphY());
			    				box.grow(tol);
	
					    		if (this.isTableCell(state.cell) && this.isCellMovable(state.cell))
					    		{
				    				var row = this.model.getParent(state.cell);
			    					var table = this.model.getParent(row);
			    					
			    					if (!this.isCellSelected(table))
			    					{
										if ((mxUtils.intersects(box, new mxRectangle(state.x, state.y - 2, state.width, 4)) &&
											this.model.getChildAt(table, 0) != row) || mxUtils.intersects(box,
											new mxRectangle(state.x, state.y + state.height - 2, state.width, 4)))
										{
											cursor ='row-resize';
										}
				    					else if ((mxUtils.intersects(box, new mxRectangle(state.x - 2, state.y, 4, state.height)) &&
						    				this.model.getChildAt(row, 0) != state.cell) || mxUtils.intersects(box,
						    				new mxRectangle(state.x + state.width - 2, state.y, 4, state.height)))
				    					{
						    				cursor ='col-resize';
				    					}
			    					}
					    		}
					    		
					    		// Hover for swimlane start sizes inside tables
					    		var current = state;
					    		
					    		while (cursor == null && current != null && (this.isTableCell(current.cell) ||
					    			this.isTableRow(current.cell) || this.isTable(current.cell)))
					    		{
						    		if (this.isSwimlane(current.cell) && this.isCellMovable(current.cell))
						    		{
						    			var offset = this.getActualStartSize(current.cell);
						    			var s = this.view.scale;
						    			
			    						if ((offset.x > 0 || offset.width > 0) && mxUtils.intersects(box, new mxRectangle(
			    							current.x + (offset.x - offset.width - 1) * s + ((offset.x == 0) ? current.width * s : 0),
			    							current.y, 1, current.height)))
			    						{
				    						cursor ='col-resize';
			    						}
			    						else if ((offset.y > 0 || offset.height > 0) && mxUtils.intersects(box, new mxRectangle(
			    							current.x, current.y + (offset.y - offset.height - 1) * s + ((offset.y == 0) ? current.height : 0),
			    							current.width, 1)))
			    						{
				    						cursor ='row-resize';
			    						}
						    		}
						    		
						    		current = this.view.getState(this.model.getParent(current.cell));
					    		}
				    		}
				    		
		    				if (cursor != null)
		    				{
		    					state.setCursor(cursor);
		    				}
				    	}
			    	}
		    	}
		    }),
		    mouseUp: mxUtils.bind(this, function(sender, me)
		    {
				start.state = null;
				start.event = null;
				start.point = null;
				start.handle = null;
		    })
		});
	}
	
	this.cellRenderer.minSvgStrokeWidth = 0.1;

	// Element for parsing HTML labels and implementing dark mode colors
	var tempDiv = document.createElement('div');
	
	// HTML entities are displayed as plain text in wrapped plain text labels
	this.cellRenderer.getLabelValue = function(state)
	{
		var result = mxCellRenderer.prototype.getLabelValue.apply(this, arguments);
		
		if (state.view.graph.isHtmlLabel(state.cell))
		{
			if (mxUtils.getValue(state.style, 'html', '0') == '0')
			{
				result = mxUtils.htmlEntities(result, false);
			}
			else
			{
				// Skips sanitizeHtml for unchanged labels
				if (state.lastLabelValue != result)
				{
					state.lastLabelValue = result;
					state.lastSanitizedLabelValue = Graph.sanitizeHtml(result);

					// Replaces simple colors in HTML labels
					tempDiv.innerHTML = state.lastSanitizedLabelValue;

					if (Graph.addLightDarkColors(tempDiv, null,
						state.view.graph.getAdaptiveColors() == 'simple'))
					{
						state.lastSanitizedLabelValue = tempDiv.innerHTML;
					}
				}

				result = state.lastSanitizedLabelValue;
			}
		}
		
		return result;
	};

	// All code below not available and not needed in embed mode
	if (typeof mxVertexHandler !== 'undefined')
	{
		this.setConnectable(true);
		this.setDropEnabled(true);
		this.setPanning(true);
		this.setTooltips(true);
		this.setAllowLoops(true);
		this.allowAutoPanning = true;
		this.resetEdgesOnConnect = false;
		this.constrainChildren = false;
		this.constrainRelativeChildren = true;
		
		// Do not scroll after moving cells
		this.graphHandler.scrollOnMove = false;
		this.graphHandler.scaleGrid = true;

		// Disables cloning of connection sources by default
		this.connectionHandler.setCreateTarget(false);
		this.connectionHandler.insertBeforeSource = true;
		
		// Disables built-in connection starts
		this.connectionHandler.isValidSource = function(cell, me)
		{
			return false;
		};

		// Sets the style to be used when an elbow edge is double clicked
		this.alternateEdgeStyle = 'vertical';

		if (stylesheet == null)
		{
			this.loadStylesheet();
		}

		// Adds page centers to the guides for moving cells
		var graphHandlerGetGuideStates = this.graphHandler.getGuideStates;
		this.graphHandler.getGuideStates = function()
		{
			var result = graphHandlerGetGuideStates.apply(this, arguments);
			
			// Create virtual cell state for page centers
			if (this.graph.pageVisible)
			{
				var guides = [];
				
				var pf = this.graph.pageFormat;
				var ps = this.graph.pageScale;
				var pw = pf.width * ps;
				var ph = pf.height * ps;
				var t = this.graph.view.translate;
				var s = this.graph.view.scale;

				var layout = this.graph.getPageLayout();
				
				for (var i = 0; i < layout.width; i++)
				{
					guides.push(new mxRectangle(((layout.x + i) * pw + t.x) * s,
						(layout.y * ph + t.y) * s, pw * s, ph * s));
				}
				
				for (var j = 1; j < layout.height; j++)
				{
					guides.push(new mxRectangle((layout.x * pw + t.x) * s,
						((layout.y + j) * ph + t.y) * s, pw * s, ph * s));
				}
				
				// Page center guides have precedence over normal guides
				result = guides.concat(result);
			}
			
			return result;
		};

		// Overrides zIndex for dragElement
		mxDragSource.prototype.dragElementZIndex = mxPopupMenu.prototype.zIndex;
		
		// Overrides color for virtual guides for page centers
		mxGuide.prototype.getGuideColor = function(state, horizontal)
		{
			return (state.cell == null) ? '#ffa500' /* orange */ : mxConstants.GUIDE_COLOR;
		};

		// Changes color of move preview for black backgrounds
		this.graphHandler.createPreviewShape = function(bounds)
		{
			this.previewColor = (this.graph.background == '#000000') ? '#ffffff' :
				mxGraphHandler.prototype.previewColor;
			
			return mxGraphHandler.prototype.createPreviewShape.apply(this, arguments);
		};

		// Handles parts of cells by checking if part=1 is in the style and returning the parent
		// if the parent is not already in the list of cells. container style is used to disable
		// step into swimlanes and dropTarget style is used to disable acting as a drop target.
		// LATER: Handle recursive parts
		var graphHandlerGetCells = this.graphHandler.getCells;
		
		this.graphHandler.getCells = function(initialCell)
		{
		    var cells = graphHandlerGetCells.apply(this, arguments);
		    var lookup = new mxDictionary();
		    var newCells = [];

		    for (var i = 0; i < cells.length; i++)
		    {
		    	// Propagates to composite parents or moves selected table rows
		    	var cell = (this.graph.isTableCell(initialCell) &&
		    		this.graph.isTableCell(cells[i]) &&
		    		this.graph.isCellSelected(cells[i])) ?
		    		this.graph.model.getParent(cells[i]) :
		    		((this.graph.isTableRow(initialCell) &&
		    		this.graph.isTableRow(cells[i]) &&
		    		this.graph.isCellSelected(cells[i])) ?
		    		cells[i] : this.graph.getCompositeParent(cells[i]));

		    	if (cell != null && !lookup.get(cell))
		    	{
		    		lookup.put(cell, true);
		            newCells.push(cell);
		        }
		    }

		    return newCells;
		};

		// Handles parts and selected rows in tables of cells for drag and drop
		var graphHandlerStart = this.graphHandler.start;
		
		this.graphHandler.start = function(cell, x, y, cells)
		{
			// Propagates to selected table row to start move
			var ignoreParent = false;
			
		    if (this.graph.isTableCell(cell))
		    {
		    	if (!this.graph.isCellSelected(cell))
		    	{
		    		cell = this.graph.model.getParent(cell);
		    	}
		    	else
		    	{
		    		ignoreParent = true;
		    	}
		    }
		    
		    if (!ignoreParent && (!this.graph.isTableRow(cell) || !this.graph.isCellSelected(cell)))
		    {
		    	cell = this.graph.getCompositeParent(cell);
		    }
		    
			graphHandlerStart.apply(this, arguments);
		};
		
		// Handles parts of cells when cloning the source for new connections
		this.connectionHandler.createTargetVertex = function(evt, source)
		{
			source = this.graph.getCompositeParent(source);
			
			return mxConnectionHandler.prototype.createTargetVertex.apply(this, arguments);
		};

		// Applies newEdgeStyle
		this.connectionHandler.insertEdge = function(parent, id, value, source, target, style)
		{
			var edge = mxConnectionHandler.prototype.insertEdge.apply(this, arguments);

			if (source != null)
			{
				this.graph.applyNewEdgeStyle(source, [edge]);
			}
			
			return edge
		};

		// Creates rubberband selection and associates with graph instance
	    var rubberband = new mxRubberband(this);
	    
	    this.getRubberband = function()
	    {
	    	return rubberband;
	    };
	    
	    // Timer-based activation of outline connect in connection handler
	    var startTime = new Date().getTime();
	    var timeOnTarget = 0;
	    
	    var connectionHandlerMouseMove = this.connectionHandler.mouseMove;
	    
	    this.connectionHandler.mouseMove = function()
	    {
	    	var prev = this.currentState;
	    	connectionHandlerMouseMove.apply(this, arguments);
	    	
	    	if (prev != this.currentState)
	    	{
	    		startTime = new Date().getTime();
	    		timeOnTarget = 0;
	    	}
	    	else
	    	{
		    	timeOnTarget = new Date().getTime() - startTime;
	    	}
	    };

	    // Activates outline connect after 1500ms with touch event or if alt is pressed inside the shape
	    // outlineConnect=0 is a custom style that means do not connect to strokes inside the shape,
	    // or in other words, connect to the shape's perimeter if the highlight is under the mouse
	    // (the name is because the highlight, including all strokes, is called outline in the code)
	    var connectionHandleIsOutlineConnectEvent = this.connectionHandler.isOutlineConnectEvent;
	    
	    this.connectionHandler.isOutlineConnectEvent = function(me)
	    {
			if (mxEvent.isShiftDown(me.getEvent()) && mxEvent.isAltDown(me.getEvent()))
			{
				return false;
			}
			else
			{
		    	return (this.currentState != null && me.getState() == this.currentState && timeOnTarget > 2000) ||
		    		((this.currentState == null || mxUtils.getValue(this.currentState.style, 'outlineConnect', '1') != '0') &&
		    		connectionHandleIsOutlineConnectEvent.apply(this, arguments));
			}
	    };
	    
	    // Adds shift+click to toggle selection state
	    var isToggleEvent = this.isToggleEvent;
	    this.isToggleEvent = function(evt)
	    {
	    	return isToggleEvent.apply(this, arguments) || mxEvent.isShiftDown(evt);
	    };
	    
	    // Shows hand cursor while panning
	    var prevCursor = null;
	    
		this.panningHandler.addListener(mxEvent.PAN_START, mxUtils.bind(this, function()
		{
			if (this.isEnabled())
			{
				prevCursor = this.container.style.cursor;
				this.container.style.cursor = 'move';
			}
		}));
			
		this.panningHandler.addListener(mxEvent.PAN_END, mxUtils.bind(this, function()
		{
			if (this.isEnabled())
			{
				this.container.style.cursor = prevCursor;
			}
		}));

		this.popupMenuHandler.autoExpand = true;
		
		this.popupMenuHandler.isSelectOnPopup = function(me)
		{
			return mxEvent.isMouseEvent(me.getEvent());
		};
	
		// Handles links in read-only graphs
		// and cells in locked layers
		var click = this.click;
		this.click = function(me)
		{
			var locked = me.state == null && me.sourceState != null &&
				this.isCellLocked(this.getLayerForCell(
					me.sourceState.cell));
			
			if ((!this.isEnabled() || locked) && !me.isConsumed())
			{
				var cell = (locked) ? me.sourceState.cell : me.getCell();
				
				if (cell != null)
				{
					var link = this.getClickableLinkForCell(cell);

					if (link != null)
					{
						if (this.isCustomLink(link))
						{
							this.customLinkClicked(link, cell);
						}
						else
						{
							this.openLink(link);
						}
					}
					else if (locked)
					{
						this.clearSelection();
					}
				}
			}
			else
			{
				return click.apply(this, arguments);
			}
		};

		// Redirects tooltips for locked cells
		this.tooltipHandler.getStateForEvent = function(me)
		{
			return me.sourceState;
		};
		
		// Opens links in tooltips in new windows
		var tooltipHandlerShow = this.tooltipHandler.show;
		this.tooltipHandler.show = function()
		{
			tooltipHandlerShow.apply(this, arguments);
			
			if (this.div != null)
			{
				var links = this.div.getElementsByTagName('a');
				
				for (var i = 0; i < links.length; i++)
				{
					if (links[i].getAttribute('href') != null &&
						links[i].getAttribute('target') == null)
					{
						links[i].setAttribute('target', '_blank');
					}
				}
			}
		};
		
		// Redirects tooltips for locked cells
		this.tooltipHandler.getStateForEvent = function(me)
		{
			return me.sourceState;
		};
		
		// Redirects cursor for locked cells
		this.getCursorForMouseEvent = function(me)
		{
			var locked = me.state == null && me.sourceState != null && this.isCellLocked(me.sourceState.cell);
			
			return this.getCursorForCell((locked) ? me.sourceState.cell : me.getCell());
		};
		
		// Shows pointer cursor for clickable cells with links
		// ie. if the graph is disabled and cells cannot be selected
		var getCursorForCell = this.getCursorForCell;
		this.getCursorForCell = function(cell)
		{
			if (!this.isEnabled() || this.isCellLocked(cell))
			{
				var link = this.getClickableLinkForCell(cell);
				
				if (link != null)
				{
					return 'pointer';
				}
				else if (this.isCellLocked(cell))
				{
					return 'default';
				}
			}

			return getCursorForCell.apply(this, arguments);
		};
		
		// Changes rubberband selection ignore locked cells
		this.selectRegion = function(rect, evt)
		{
			var isect = (Graph.intersectionSelect ||
				mxEvent.isAltDown(evt)) ? rect : null;
			var cells = this.getCells(rect.x, rect.y,
				rect.width, rect.height, null, null,
				isect, null, true);

			// Collapses descendants of locked groups into the group itself
			if (cells != null && cells.length > 0)
			{
				var seen = new mxDictionary();
				var filtered = [];

				for (var i = 0; i < cells.length; i++)
				{
					var anc = this.getLockedGroupAncestor(this.model.getParent(cells[i]));
					var eff = (anc != null) ? anc : cells[i];

					if (!seen.get(eff))
					{
						seen.put(eff, true);
						filtered.push(eff);
					}
				}

				cells = filtered;
			}

			if (this.isToggleEvent(evt))
			{
				for (var i = 0; i < cells.length; i++)
				{
					this.selectCellForEvent(cells[i], evt);
				}
			}
			else
			{
				this.selectCellsForEvent(cells, evt);
			}

			return cells;
		};

		// Never removes cells from parents that are being moved
		var graphHandlerShouldRemoveCellsFromParent = this.graphHandler.shouldRemoveCellsFromParent;
		this.graphHandler.shouldRemoveCellsFromParent = function(parent, cells, evt)
		{
			if (this.graph.isCellSelected(parent))
			{
				return false;
			}

			// Drag cannot remove children from a transparentBounds; reparenting
			// is only allowed via explicit menu actions (e.g. Arrange tab).
			if (this.graph.isTransparentBounds(parent))
			{
				return false;
			}

			return graphHandlerShouldRemoveCellsFromParent.apply(this, arguments);
		};

		// Enables rubberband selection on cells in locked layers
		var graphUpdateMouseEvent = this.updateMouseEvent;
		this.updateMouseEvent = function(me)
		{
			me = graphUpdateMouseEvent.apply(this, arguments);

			if (me.state != null && this.isCellLocked(this.getLayerForCell(me.getCell())))
			{
				if (this.getLinkForCell(me.getCell()) == null)
				{
					me.state = this.view.getState(this.getCellAt(me.getGraphX(), me.getGraphY(),
						null, null, null, mxUtils.bind(this, function(state, x, y)
					{
						return me.state == state || (this.isCellLocked(this.getLayerForCell(state.cell)) &&
							this.getLinkForCell(state.cell) == null);
					})));
				}
				else
				{
					me.state = null;
				}
			}

			return me;
		};

		// Cells in locked layers and descendants of locked groups are not selectable
		var graphIsCellSelectable = this.isCellSelectable;
		this.isCellSelectable = function(cell)
		{
			if (cell != null && this.getLockedGroupAncestor(
				this.model.getParent(cell)) != null)
			{
				return false;
			}

			return graphIsCellSelectable.apply(this, arguments) &&
				!this.isCellLocked(this.getLayerForCell(cell));
		};

		// Returns true if the given cell is locked
		this.isCellLocked = function(cell)
		{
			while (cell != null)
			{
				if (mxUtils.getValue(this.getCurrentCellStyle(cell), 'locked', '0') == '1')
				{
					return true;
				}
				
				cell = this.model.getParent(cell);
			}
			
			return false;
		};
		
		var tapAndHoldSelection = null;
		
		// Uses this event to process mouseDown to check the selection state before it is changed
		this.addListener(mxEvent.FIRE_MOUSE_EVENT, mxUtils.bind(this, function(sender, evt)
		{
			if (evt.getProperty('eventName') == 'mouseDown')
			{
				var me = evt.getProperty('event');
				var state = me.getState();
				
				if (state != null && !this.isSelectionEmpty() && !this.isCellSelected(state.cell))
				{
					tapAndHoldSelection = this.getSelectionCells();
				}
				else
				{
					tapAndHoldSelection = null;
				}
			}
		}));
		
		// Tap and hold on background starts rubberband for multiple selected
		// cells the cell associated with the event is deselected
		this.addListener(mxEvent.TAP_AND_HOLD, mxUtils.bind(this, function(sender, evt)
		{
			if (!mxEvent.isMultiTouchEvent(evt))
			{
				var me = evt.getProperty('event');
				var cell = evt.getProperty('cell');
				
				if (cell == null)
				{
					var pt = mxUtils.convertPoint(this.container,
							mxEvent.getClientX(me), mxEvent.getClientY(me));
					rubberband.start(pt.x, pt.y);
				}
				else if (tapAndHoldSelection != null)
				{
					this.addSelectionCells(tapAndHoldSelection);
				}
				else if (this.getSelectionCount() > 1 && this.isCellSelected(cell))
				{
					this.removeSelectionCell(cell);
				}
				
				// Blocks further processing of the event
				tapAndHoldSelection = null;
				evt.consume();
			}
		}));
	
		// On connect the target is selected and we clone the cell of the preview edge for insert
		this.connectionHandler.selectCells = function(edge, target)
		{
			this.graph.setSelectionCell(target || edge);
		};
		
		// Shows connection points only if cell not selected and parent table not handled
		this.connectionHandler.constraintHandler.isStateIgnored = function(state, source)
		{
			var graph = state.view.graph;

			return source && (graph.isCellSelected(state.cell) || (graph.isTableRow(state.cell) &&
				graph.selectionCellsHandler.isHandled(graph.model.getParent(state.cell))));
		};
		
		// Updates constraint handler if the selection changes
		this.selectionModel.addListener(mxEvent.CHANGE, mxUtils.bind(this, function()
		{
			var ch = this.connectionHandler.constraintHandler;
			
			if (ch.currentFocus != null && ch.isStateIgnored(ch.currentFocus, true))
			{
				ch.currentFocus = null;
				ch.constraints = null;
				ch.destroyIcons();
			}
			
			ch.destroyFocusHighlight();
		}));
		
		// Initializes touch interface
		if (Graph.touchStyle)
		{
			this.initTouch();
		}
	}
	
	//Create a unique offset object for each graph instance.
	this.currentTranslate = new mxPoint(0, 0);
};

/**
 * Specifies if the touch UI should be used (cannot detect touch in FF so always on for Windows/Linux)
 */
Graph.touchStyle = mxClient.IS_TOUCH || (mxClient.IS_FF && mxClient.IS_WIN) || navigator.maxTouchPoints > 0 ||
	navigator.msMaxTouchPoints > 0 || window.urlParams == null || urlParams['touch'] == '1';

/**
 * Shortcut for capability check.
 */
Graph.fileSupport = window.File != null && window.FileReader != null && window.FileList != null &&
	(window.urlParams == null || urlParams['filesupport'] != '0');

/**
 * Shortcut for capability check.
 */
Graph.translateDiagram = urlParams['translate-diagram'] == '1';

/**
 * Specifies if foreignObject content should be mirrored to a hidden DOM
 * element so that browser-level translation (e.g. Chrome Translate) can
 * detect and translate the text. A MutationObserver syncs translated
 * content back into the foreignObjects. Default is true.
 */
Graph.browserTranslate = mxClient.IS_GC && urlParams['browser-translate'] != '0';

/**
 * Returns true if the browser translation engine is currently active.
 * Chrome adds "translated-ltr" / "translated-rtl" to <html>.
 */
Graph.isBrowserTranslated = function()
{
	try
	{
		var doc = document;

		try
		{
			if (window.parent != window && window.parent.document != null)
			{
				doc = window.parent.document;
			}
		}
		catch (e)
		{
			// ignore
		}

		var cls = doc.documentElement.className;

		return cls != null && /\btranslated/.test(cls);
	}
	catch (e)
	{
		return false;
	}
};

/**
 * Shortcut for capability check.
 */
Graph.diagramLanguage = (urlParams['diagram-language'] != null) ? urlParams['diagram-language'] : mxClient.language;

/**
 * Default size for line jumps.
 */
Graph.lineJumpsEnabled = true;

/**
 * Default size for line jumps.
 */
Graph.defaultJumpSize = 6;

/**
 * Specifies if the mouse wheel is used for zoom without any modifiers.
 */
Graph.zoomWheel = false;

/**
 * Specifies if the parent layer should be selected when the selection changes.
 * Default is false.
 */
Graph.selectParentLayer = false;

/**
 * Specifies if intersection selection should be used for rubberband. Default is false.
 * When true, cells that intersect the rubberband selection rectangle are selected,
 * rather than requiring cells to be fully contained within the rectangle.
 */
Graph.intersectionSelect = false;

/**
 * Minimum width for table columns.
 */
Graph.minTableColumnWidth = 20;

/**
 * Minimum height for table rows.
 */
Graph.minTableRowHeight = 20;

/**
 * Text for foreign object warning.
 */
Graph.foreignObjectWarningText = 'Text is not SVG - cannot display';

/**
 * Link for foreign object warning.
 */
Graph.foreignObjectWarningLink = 'https://www.drawio.com/doc/faq/svg-export-text-problems';

/**
 * 
 */
Graph.xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';

/**
 * 
 */
Graph.svgDoctype = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
	'"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

/**
 * 
 */
Graph.svgFileComment = '<!-- Do not edit this file with editors other than draw.io -->'

/**
 * Styles that are used for text.
 */
Graph.colorStyles = [mxConstants.STYLE_FONTCOLOR,
	mxConstants.STYLE_FILLCOLOR, mxConstants.STYLE_GRADIENTCOLOR,
	mxConstants.STYLE_STROKECOLOR, mxConstants.STYLE_IMAGE_BORDER,
	mxConstants.STYLE_IMAGE_BACKGROUND, mxConstants.STYLE_LABEL_BORDERCOLOR,
	mxConstants.STYLE_SWIMLANE_FILLCOLOR, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR];

/**
 * Styles that are used for text.
 */
Graph.textStyles = ['fontFamily', 'fontSource', 'fontSize', 'fontColor', 'fontStyle',
	'textOpacity', 'labelBorderColor', 'labelBackgroundColor', 'autosize', 'resizable',
	'horizontal', 'textDirection', 'autosizeText'];

/**
 * Styles that are used for pasting text styles.
 */
Graph.pasteTextStyles = ['fontFamily', 'fontSource', 'fontSize', 'fontColor', 'fontStyle',
	'textOpacity', 'align', 'verticalAlign', 'spacingLeft', 'spacingRight',
	'spacingTop', 'spacingBottom', 'spacing', 'labelBorderColor', 'labelBackgroundColor',
	'horizontal', 'textDirection'];

/**
 * Styles that are used for edges.
 */
Graph.edgeStyles = ['edgeStyle', 'elbow', 'jumpStyle', 'jumpSize', 'startArrow',
	'startFill', 'startSize', 'endArrow', 'endFill', 'endSize', 'flowAnimation',
	'flowAnimationDirection', 'flowAnimationTimingFunction', 'flowAnimationDuration',
	'sourcePerimeterSpacing', 'targetPerimeterSpacing', 'curved', 'linecap', 'linejoin',
	'libavoidRouting'];

/**
 * Styles that are ignored together (if one appears all are ignored).
 */
Graph.cellStyleGroups = [
	['startArrow', 'startFill', 'endArrow', 'endFill'],
	['startSize', 'endSize'],
	['sourcePerimeterSpacing', 'targetPerimeterSpacing'],
	['fillColor', 'gradientColor', 'gradientDirection']];

/**
 * List of all known cell styles.
 */
Graph.cellStyles = mxUtils.addItems(mxUtils.addItems(mxUtils.addItems(
	['rounded', 'shadow', 'glass', 'dashed', 'dashPattern', 'comic', 'sketch', 'fillWeight',
	'hachureGap', 'hachureAngle', 'jiggle', 'disableMultiStroke', 'disableMultiStrokeFill',
	'fillStyle', 'curveFitting', 'simplification', 'sketchStyle', 'pointerEvents', 'opacity',
	'strokeColor', 'strokeWidth', 'align', 'verticalAlign', 'spacingLeft', 'spacingRight',
	'spacingTop', 'spacingBottom', 'spacing', 'arcSize', 'absoluteArcSize', 'comicStyle',
	'swimlaneFillColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowColor',
	'shadowOpacity'], Graph.textStyles), Graph.edgeStyles),
	Graph.cellStyleGroups);

/**
 * Whitelist for known layout names.
 */
Graph.layoutNames = ['mxHierarchicalLayout', 'mxCircleLayout', 'mxCompactTreeLayout',
	'mxEdgeLabelLayout', 'mxFastOrganicLayout', 'mxParallelEdgeLayout',
	'mxPartitionLayout', 'mxRadialTreeLayout', 'mxStackLayout',
	'elkLayered', 'elkTree', 'elkRadial', 'elkOrganic', 'elkStress',
	'elkDisco', 'elkBox'];

/**
 * Maps draw.io ELK layout names to their ELK algorithm. The friendly aliases
 * (elkTree → mrtree, elkOrganic → force) match the Arrange > Layout menu
 * vocabulary rather than the internal ELK names, so users reading the menu
 * and writing JSON see the same words.
 */
Graph.elkLayoutAlgorithms = {
	'elkLayered': 'layered',
	'elkTree': 'mrtree',
	'elkRadial': 'radial',
	'elkOrganic': 'force',
	'elkStress': 'stress',
	'elkDisco': 'disco',
	'elkBox': 'box'
};

/**
 * Returns the draw.io layout name (elkLayered, elkTree, ...) for the given
 * ELK algorithm, ie. the inverse lookup of elkLayoutAlgorithms. Returns
 * null for unknown algorithms.
 */
Graph.elkLayoutNameForAlgorithm = function(algorithm)
{
	for (var name in Graph.elkLayoutAlgorithms)
	{
		if (Graph.elkLayoutAlgorithms[name] === algorithm)
		{
			return name;
		}
	}

	return null;
};

/**
 * Name of the attribute to store original CSS colors in HTML labels.
 */
Graph.backupStyleAttribute = 'data-mx-given-colors';

/**
 * Value to be used to identify new colors. This value is be a valid
 * CSS color that will never be used in practice.
 */
Graph.newColorPlaceholder = 'rgba(0, 0, 0, 0)';

/**
 * Value to be used to identify new background colors. This value is
 * be a valid CSS background that will never be used in practice.
 */
Graph.newBackgroundPlaceholder = 'rgb(0, 0, 0)';

/**
 * Default value for adaptiveColors. Default is 'auto'.
 */
Graph.defaultAdaptiveColors = (urlParams['contrast'] == '0') ? 'simple' : 'auto';

/**
 * Default value for adaptiveColors. Default is 'auto'.
 */
Graph.getDefaultAdaptiveColorsKey = function()
{
	return (Graph.defaultAdaptiveColors == 'auto') ?
		'automatic' : Graph.defaultAdaptiveColors;
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
Graph.createOffscreenGraph = function(stylesheet)
{
	var graph = new Graph(document.createElement('div'));
	graph.stylesheet.styles = mxUtils.clone(stylesheet.styles);
	graph.resetViewOnRootChange = false;
	graph.setConnectable(false);
	graph.gridEnabled = false;
	graph.autoScroll = false;
	graph.setTooltips(false);
	graph.setEnabled(false);

	// Container must be in the DOM for correct HTML rendering
	graph.container.style.visibility = 'hidden';
	graph.container.style.position = 'absolute';
	graph.container.style.overflow = 'hidden';
	graph.container.style.height = '1px';
	graph.container.style.width = '1px';

	return graph;
};

/**
 * Helper function for creating SVG data URI.
 */
Graph.createSvgImage = function(w, h, data, coordWidth, coordHeight)
{
	var tmp = unescape(encodeURIComponent(Graph.svgDoctype +
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + w + 'px" height="' + h + 'px" ' +
        ((coordWidth != null && coordHeight != null) ? 'viewBox="0 0 ' + coordWidth + ' ' + coordHeight + '" ' : '') +
        'version="1.1" style="color-scheme: light dark;">' + data + '</svg>'));

    return new mxImage('data:image/svg+xml;base64,' + ((window.btoa) ? btoa(tmp) : Base64.encode(tmp, true)), w, h)
};

/**
 * 
 */
Graph.getSvgFromDataUri = function(uri)
{
	if (uri != null && uri.substring(0, 14) == 'data:image/svg')
	{
		return Graph.xmlDeclaration + '\n' + Graph.svgDoctype + '\n' +
			decodeURIComponent(escape(atob(uri.substring(
				uri.indexOf(',') + 1))));
	}
	else
	{
		return null;
	}
};

/**
 * Name of the CSS custom property that carries the exported SVG background
 * color so a light-dark() value is only applied where it is supported.
 * See addAdaptiveColors.
 */
Graph.svgBackgroundVar = '--ge-adaptive-bg';

/**
 * Helper function for creating an SVG node.
 */
Graph.createSvgNode = function(x, y, w, h, lightDarkColor)
{
	var svgDoc = mxUtils.createXmlDocument();
	var root = (svgDoc.createElementNS != null) ?
		svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') :
		svgDoc.createElement('svg');

	if (lightDarkColor != null)
	{
		root.setAttribute('style', 'background: ' + lightDarkColor.light +
			'; background-color: ' + lightDarkColor.cssText + ';');
	}

	if (svgDoc.createElementNS == null)
	{
		root.setAttribute('xmlns', mxConstants.NS_SVG);
		root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
	}
	else
	{
		// KNOWN: Ignored in IE9-11, adds namespace for each image element instead. No workaround.
		root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', mxConstants.NS_XLINK);
	}

	root.setAttribute('version', '1.1');
	root.setAttribute('width', w + 'px');
	root.setAttribute('height', h + 'px');
	root.setAttribute('viewBox', x + ' ' + y + ' ' + w + ' ' + h);
	svgDoc.appendChild(root);

	return root;
};

/**
 * Rewrites adaptive (light-dark with var()) colors in the given exported SVG
 * root to reference the Graph.svgBackgroundVar custom property, which is
 * defined only inside an @supports block. A light-dark() value whose dark
 * side is a var() cannot use the usual fallback: the var() keeps the
 * declaration valid at parse time (so it overrides the plain fallback), but
 * it is invalid at computed-value time in browsers without light-dark()
 * (e.g. Firefox ESR 115), which resets the color to inherited/initial and
 * paints the background/shapes black. Routing it through the custom property
 * lets those browsers fall back to the light color instead. Only the default
 * background color (shapeBackgroundColor) carries a var(), so its serialized
 * value is the exact string to replace wherever it occurs (root background,
 * background rect and shape fills). Does nothing when light-dark() support
 * is off (fixed-theme exports force this, see EditorUi.exportSvg): colors
 * are then resolved to a single side, and the dark side is a plain var()
 * with a fallback that is valid in all browsers - rewriting it here would
 * replace that fallback with the light color.
 */
Graph.addAdaptiveColors = function(root, shapeBackgroundColor)
{
	if (!mxUtils.lightDarkColorSupported)
	{
		return;
	}

	var adaptive = mxUtils.getLightDarkColor(shapeBackgroundColor);

	if (adaptive.cssText.indexOf('var(') < 0)
	{
		return;
	}

	var replacement = 'var(' + Graph.svgBackgroundVar + ', ' + adaptive.light + ')';
	var elts = root.getElementsByTagName('*');
	var nodes = [root];
	var modified = false;

	for (var i = 0; i < elts.length; i++)
	{
		nodes.push(elts[i]);
	}

	for (var i = 0; i < nodes.length; i++)
	{
		var st = nodes[i].getAttribute('style');

		if (st != null && st.indexOf(adaptive.cssText) >= 0)
		{
			nodes[i].setAttribute('style',
				st.split(adaptive.cssText).join(replacement));
			modified = true;
		}
	}

	// Defines the custom property (gated on light-dark() support and scoped to
	// a unique id on the root) only when at least one color was rewritten.
	if (modified)
	{
		var svgDoc = root.ownerDocument;
		var id = root.getAttribute('id');

		if (id == null || id == '')
		{
			id = 'ge-svg-' + Editor.guid();
			root.setAttribute('id', id);
		}

		var style = (svgDoc.createElementNS != null) ?
			svgDoc.createElementNS(mxConstants.NS_SVG, 'style') :
			svgDoc.createElement('style');
		style.setAttribute('type', 'text/css');
		style.appendChild(svgDoc.createTextNode(
			'@supports (color: light-dark(#000, #fff)) { #' + id + ' { ' +
			Graph.svgBackgroundVar + ': ' + adaptive.cssText + '; } }'));
		root.insertBefore(style, root.firstChild);
	}
};

/**
 * Helper function for creating an SVG node.
 */
Graph.htmlToPng = function(html, w, h, fn, css, scale)
{
	css = (css != null) ? css : '';
	scale = (scale != null) ? scale : Editor.htmlRasterScale;

	var canvas = document.createElement('canvas');
	canvas.width = w * scale;
	canvas.height = h * scale;

	var img = document.createElement('img');
	img.onload = mxUtils.bind(this, function()
	{
		try
		{
			var ctx = canvas.getContext('2d');
			ctx.scale(scale, scale);
			ctx.drawImage(img, 0, 0)

			fn(canvas.toDataURL());
		}
		catch (e)
		{
			fn(null);
		}
	});

	// Converts HTML to XHTML
	var svgDoc = mxUtils.createXmlDocument();
	var root = (svgDoc.createElementNS != null) ?
		svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');
	var svgCanvas = new mxSvgCanvas2D(root);
	html = svgCanvas.convertHtml(html);

	var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
		((css != '') ? '<defs xmlns="http://www.w3.org/2000/svg"><style type="text/css">' + css + '</style></defs>' : '') +
		'<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">' + html + '</div></foreignObject></svg>';
	
	img.onerror = function(err)
	{
		fn(null);
	};

	img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
};

/**
 * Adds light-dark colors to the colors in the given DOM element
 * and returns true if the element was modified.
 */
Graph.addLightDarkColors = function(node, attrName, useLightColor, visitor)
{
	var elts = node.getElementsByTagName('*');
	var attrValue = null;
	var modified = false;

	function replaceColor(elt, key, value)
	{
		if (visitor != null)
		{
			return visitor(elt, key, value);
		}
		else if (mxUtils.isValidColor(value))
		{
			if (attrValue == null && attrName != null)
			{
				attrValue = {};
			}

			if (attrValue != null)
			{
				attrValue[key] = elt.style.getPropertyValue(key);
			}

			var cssColor = mxUtils.getLightDarkColor(
				value, null, null, useLightColor);
			elt.style.setProperty(key, cssColor.cssText);
			
			return true;
		}
		else
		{
			return false;
		}
	};

	for (var i = 0; i < elts.length; i++)
	{
		if (elts[i] != node && elts[i].style != null)
		{
			attrValue = null;
			
			for (var j = 0; j < elts[i].style.length; j++)
			{
				var item = elts[i].style.item(j);
				var value = elts[i].style.getPropertyValue(item);
				modified = replaceColor(elts[i], item, value) || modified;
			}

			//  Overrides color attribute in font elements
			if (elts[i].nodeName == 'FONT' && elts[i].style.getPropertyValue('color') == '')
			{
				var value = elts[i].getAttribute('color');
				modified = replaceColor(elts[i], 'color', value) || modified;
			}

			if (attrName != null && attrValue != null)
			{
				elts[i].setAttribute(attrName, JSON.stringify(attrValue));
			}
		}
	}

	return modified;
};

/**
 * Restores the original CSS styles and returns true if any
 * styles were restored in the given DOM node.
 */
Graph.removeLightDarkColors = function(node, attrName)
{
	var elts = node.getElementsByTagName('*');
	var modified = false;

	for (var i = 0; i < elts.length; i++)
	{
		try
		{
			var temp = elts[i].getAttribute(attrName);
			
			if (temp != null)
			{
				elts[i].removeAttribute(attrName);
				var styles = JSON.parse(temp);

				for (var key in styles)
				{
					var value = styles[key];

					if (value == '')
					{
						elts[i].style[key] = null;

						if (elts[i].getAttribute('style') == '')
						{
							elts[i].removeAttribute('style');
						}
					}
					else
					{
						elts[i].style[key] = value;
					}

					modified = true;
				}
			}
		}
		catch (e)
		{
			// ignore
		}
	}

	return modified;
};

/**
 * Gets the color assigned by the user to the given elt.
 */
Graph.getGivenColor = function(elt, property)
{
	var color = null;

	if (elt.nodeType == mxConstants.NODETYPE_ELEMENT)
	{
		try
		{
			var temp = elt.getAttribute(Graph.backupStyleAttribute);
			
			if (temp != null)
			{
				var originalStyles = JSON.parse(temp);

				if (originalStyles != null &&
					originalStyles[property] != null)
				{
					if (property == 'color' &&
						elt.nodeName == 'FONT' &&
						originalStyles[property] == '' &&
						elt.getAttribute('color') != null)
					{
						color = elt.getAttribute('color');
					}
					else if (originalStyles[property] != '')
					{
						color = originalStyles[property];
					}
				}
			}
		}
		catch (e)
		{
			// ignore
		}

		if (color == null && elt.style[property] != '')
		{
			color = elt.style[property];
		}
	}

	return color;
};

/**
 * Sets the foreground or background color of the selection text. Since
 * light-dark colors * are not supported in execCommand this inserts a
 * placeholder which is then replaced with the real color in the DOM.
 * It also updates the stored given colors for after editing.
 */
Graph.setTextColor = function(node, color, isForeground)
{
	var placeholder = (isForeground) ?
		Graph.newColorPlaceholder :
		Graph.newBackgroundPlaceholder;
	var property = (isForeground) ?
		'color' : 'background-color';

	// Detects changes in other elements
	var temp = node.getElementsByTagName('*');
	var previous = [];

	for (var i = 0; i < temp.length; i++)
	{
		previous.push({node: temp[i],
			value: temp[i].style[property]});
	}

	// Forces CSS styling for the foreground placeholder so it is applied as an
	// inline style instead of a <font color> attribute. The legacy attribute
	// parser mangles the non-hex placeholder into a visible (red) color, while
	// an inline style keeps it transparent and still detectable below.
	var usingCss = document.queryCommandState('styleWithCSS');

	if (isForeground && !usingCss)
	{
		document.execCommand('styleWithCSS', false, true);
	}

	document.execCommand((isForeground) ?
		'forecolor' : 'backcolor',
		false, placeholder);

	if (isForeground && !usingCss)
	{
		document.execCommand('styleWithCSS', false, false);
	}

	// Finds the element and sets the real color
	var elts = node.getElementsByTagName('*');
	
	for (var i = 0; i < elts.length; i++)
	{
		// Removes color from backup style attribute if removed in style
		// This happens if the color was removed from a parent element
		if (i < previous.length && previous[i].node == elts[i] &&
			previous[i].value != elts[i].style[property] &&
			elts[i].style[property] == '')
		{
			// Updates the backup style to apply the change when editing stops
			try
			{
				var temp = elts[i].getAttribute(Graph.backupStyleAttribute);

				if (temp != null)
				{
					var originalStyles = JSON.parse(temp);
					originalStyles[property] = '';
					elts[i].setAttribute(Graph.backupStyleAttribute,
						JSON.stringify(originalStyles));
				}
			}
			catch (e)
			{
				// ignore
			}
		}

		if ((isForeground && elts[i].getAttribute('color') == placeholder) ||
			elts[i].style[property] == placeholder)
		{
			if (isForeground && elts[i].getAttribute('color') == placeholder)
			{
				elts[i].removeAttribute('color');
			}

			elts[i].style[property] = (color != mxConstants.NONE) ?
				mxUtils.getLightDarkColor(color).cssText : null;

			// Updates the backup style to apply the change when editing stops
			try
			{
				var temp = elts[i].getAttribute(Graph.backupStyleAttribute);
				var originalStyles = (temp != null) ? JSON.parse(temp) : {};
				originalStyles[property] = (color != mxConstants.NONE) ? color : '';
				elts[i].setAttribute(Graph.backupStyleAttribute,
					JSON.stringify(originalStyles));
			}
			catch (e)
			{
				// ignore
			}

			// Workaround for Firefox that adds the new element around
			// anchor elements which ignore inherited colors is to move
			// the font element inside anchor elements
			if (isForeground && mxClient.IS_FF)
			{
				var elt = elts[i];
				var child = elt.firstChild;

				if (child != null &&
					child.nodeName == 'A' &&
					child.nextSibling == null &&
					child.firstChild != null)
				{
					var parent = elt.parentNode;
					parent.insertBefore(child, elt);
					var tmp = child.firstChild;

					while (tmp != null)
					{
						var next = tmp.nextSibling;
						elt.appendChild(tmp);
						tmp = next;
					}

					child.appendChild(elt);
				}

				break;
			}
		}
	}
};

/**
 * Removes all illegal control characters with ASCII code <32 except TAB, LF
 * and CR.
 */
Graph.zapGremlins = function(text)
{
	return mxUtils.zapGremlins(text);
};

/**
 * Turns the given string into an array.
 */
Graph.stringToBytes = function(str)
{
	var arr = new Array(str.length);

    for (var i = 0; i < str.length; i++)
    {
        arr[i] = str.charCodeAt(i);
    }
    
    return arr;
};

/**
 * Turns the given array into a string.
 */
Graph.bytesToString = function(arr)
{
	var result = new Array(arr.length);

    for (var i = 0; i < arr.length; i++)
    {
    	result[i] = String.fromCharCode(arr[i]);
    }
    
    return result.join('');
};

/**
 * Turns the given array into a string.
 */
Graph.base64EncodeUnicode = function(str)
{
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }));
};

/**
 * Turns the given array into a string.
 */
Graph.base64DecodeUnicode = function(str)
{
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''));
};

/**
 * Returns a base64 encoded version of the compressed outer XML of the given node.
 */
Graph.compressNode = function(node, checked)
{
	var xml = mxUtils.getXml(node);
	
	return Graph.compress((checked) ? xml : Graph.zapGremlins(xml));
};

/**
 * Returns a string for the given array buffer.
 */
Graph.arrayBufferToString = function(buffer)
{
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;

    for (var i = 0; i < len; i++)
	{
        binary += String.fromCharCode(bytes[i]);
    }

    return binary;
};

/**
 * Returns an array buffer for the given string.
 */
Graph.stringToArrayBuffer = function(data)
{
	return Uint8Array.from(data, function (c)
	{
	  return c.charCodeAt(0);
	});
};

/**
 * Returns index of a string in an array buffer (UInt8Array)
 */
Graph.arrayBufferIndexOfString = function (uint8Array, str, start)
{
	var c0 = str.charCodeAt(0), j = 1, p = -1;
	
	//Index of first char
	for (var i = start || 0; i < uint8Array.byteLength; i++)
	{
		if (uint8Array[i] == c0)
		{
			p = i;
			break;
		}
	}
	
	for (var i = p + 1; p > -1 && i < uint8Array.byteLength && i < p + str.length - 1; i++)
	{
		if (uint8Array[i] != str.charCodeAt(j))
		{
			return Graph.arrayBufferIndexOfString(uint8Array, str, p + 1);
		}
		
		j++;
	}
	
	return j == str.length - 1? p : -1;
};

/**
 * Returns a base64 encoded version of the compressed string.
 */
Graph.compress = function(data, deflate)
{
	if (data == null || data.length == 0 || typeof(pako) === 'undefined')
	{
		return data;
	}
	else
	{
   		var tmp = (deflate) ? pako.deflate(encodeURIComponent(data)) :
   			pako.deflateRaw(encodeURIComponent(data));
   		
   		return btoa(Graph.arrayBufferToString(new Uint8Array(tmp)));
	}
};

/**
 * Returns a decompressed version of the base64 encoded string.
 */
Graph.decompress = function(data, inflate, checked)
{
   	if (data == null || data.length == 0 || typeof(pako) === 'undefined')
	{
		return data;
	}
	else
	{
		var tmp = Graph.stringToArrayBuffer(atob(data));
		var inflated = decodeURIComponent((inflate) ?
			pako.inflate(tmp, {to: 'string'}) :
			pako.inflateRaw(tmp, {to: 'string'}));

		return (checked) ? inflated : Graph.zapGremlins(inflated);
	}
};

/**
 * Fades the given nodes in or out.
 */
Graph.fadeNodes = function(nodes, start, end, done, delay)
{
	delay = (delay != null) ? delay : 1000;
	Graph.setTransitionForNodes(nodes, null);
	Graph.setOpacityForNodes(nodes, start);

	window.setTimeout(function()
	{
		Graph.setTransitionForNodes(nodes,
			'all ' + delay + 'ms ease-in-out');
		Graph.setOpacityForNodes(nodes, end);

		window.setTimeout(function()
		{
			Graph.setTransitionForNodes(nodes, null);

			if (done != null)
			{
				done();
			}
		}, delay);
	}, 0);
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Graph.exploreFromCell = function(sourceGraph, selectionCell, config)
{
	pageSize = (config != null && config.pageSize != null) ? config.pageSize : 8;
	minSize = (config != null && config.minSize != null) ? config.minSize : 180;

	//
	// Main function
	//
	function exploreFromHere(sourceGraph, selectionCell)
	{
		var container = document.createElement('div');
		container.style.position = 'absolute';
		container.style.display = 'block';
		container.style.overflow = 'auto';
		container.style.width = '100%';
		container.style.height = '100%';
		container.style.left = '0px';
		container.style.top = '0px';
		container.style.zIndex = 2;
		container.style.background =
			(sourceGraph.background == mxConstants.NONE ||
			sourceGraph.background == null) ?
			'light-dark(#ffffff,' + Editor.darkColor + ')' :
				sourceGraph.background;
		
		var deleteImage = document.createElement('img');
		deleteImage.setAttribute('src', Editor.closeBlackImage);
		deleteImage.style.position = 'absolute';
		deleteImage.style.cursor = 'pointer';
		deleteImage.style.right = '10px';
		deleteImage.style.top = '10px';
		container.appendChild(deleteImage);
		
		var closeLabel = document.createElement('div');
		closeLabel.style.position = 'absolute';
		closeLabel.style.cursor = 'pointer';
		closeLabel.style.right = '38px';
		closeLabel.style.top = '14px';
		closeLabel.style.textAlign = 'right';
		closeLabel.style.verticalAlign = 'top';
		mxUtils.write(closeLabel, mxResources.get('close'));
		container.appendChild(closeLabel);
		document.body.appendChild(container);
		
		var keyHandler = function(evt)
		{
			if (evt.keyCode == 27)
			{
				deleteImage.click();
			}
		};
		
		mxEvent.addListener(document, 'keydown', keyHandler);
		
		// Moves all edge labels to the foreground
		function labelsToForeground(graph)
		{
			graph.view.states.visit(function(key, state)
			{
				if (state.shape != null && graph.model.isEdge(graph.model.getParent(state.cell)))
				{
					state.shape.node.parentNode.appendChild(state.shape.node);
				}
				else if (state.text != null && graph.model.isEdge(state.cell))
				{
					state.text.node.parentNode.appendChild(state.text.node);
				}
			});
		};

		function main(container)
		{
			// Creates the graph inside the given container
			var graph = new Graph(container);
			graph.keepEdgesInBackground = true;
			graph.isCellResizable = function()
			{
				return false;
			};

			// Workaround to hide custom handles
			graph.isCellRotatable = function()
			{
				return false;
			};
			
			// Shows hand cursor for all vertices
			graph.getCursorForCell = function(cell)
			{
				if (this.model.isVertex(cell))
				{
					return 'pointer';
				}
				
				return null;
			};
			
			graph.getFoldingImage = function()
			{
				return null;
			};
			
			var closeHandler = function()
			{
				mxEvent.removeListener(document, 'keydown', keyHandler);
				container.parentNode.removeChild(container);
				
				// FIXME: Does not work
				sourceGraph.scrollCellToVisible(selectionCell);
			};
			
			mxEvent.addListener(deleteImage, 'click', closeHandler);
			mxEvent.addListener(closeLabel, 'click', closeHandler);
			
			// Disables all built-in interactions
			graph.setEnabled(false);
			var graphClick = graph.click;

			// Handles clicks on cells
			graph.click = function(me)
			{
				var cell = me.getCell();
				var realCell = (cell != null) ? ((cell.referenceCell != null) ?
					cell.referenceCell : cell) : null;

				if (cell != null && //graph.rootCell != cell &&
					graph.getEdges(realCell).length > 0)
				{
					load(graph, cell);
				}
				else
				{
					graphClick.apply(this, arguments);
				}
			};
			
			var cx = graph.container.offsetWidth / 2;
			var cy = graph.container.offsetHeight / 3;

			graph.model.beginUpdate();
			var cell = graph.importCells([selectionCell])[0];
			cell.sourceCellId = selectionCell.id;
			cell.geometry.x = cx - cell.geometry.width / 2;
			cell.geometry.y = cy - cell.geometry.height / 2;
			graph.model.endUpdate();

			// Animates the changes in the graph model
			var ignored = false;

			graph.getModel().addListener(mxEvent.CHANGE, function(sender, evt)
			{
				if (!ignored)
				{
					var changes = evt.getProperty('edit').changes;
					mxText.prototype.enableBoundingBox = false;
					graph.labelsVisible = false;
					ignored = true;
					
					mxEffects.animateChanges(graph, changes, function()
					{
						// Keeps parallel edges apart
						var layout = new mxParallelEdgeLayout(graph);
						layout.spacing = 60;

						var prevLayout = layout.layout;

						// Dynamic spacing based on number of parallels
						layout.layout = function(parallels)
						{
							layout.spacing = Math.min(60, Math.max(30, 60 - parallels.length * 5));
							prevLayout.apply(this, arguments);
						};
						
						layout.execute(graph.getDefaultParent());

						mxText.prototype.enableBoundingBox = true;
						graph.labelsVisible = true;
						graph.tooltipHandler.hide();
						graph.refresh();

						labelsToForeground(graph);

						ignored = false;
					});
				}
			});

			load(graph, cell);
		};

		// Loads the links for the given cell into the given graph
		// by requesting the respective data in the server-side
		// (implemented for this demo using the server-function)
		function load(graph, cell)
		{
			if (graph.getModel().isVertex(cell))
			{
				var cx = graph.container.offsetWidth / 2;
				var cy = graph.container.offsetHeight / 2;
				
				// Gets the default parent for inserting new cells. This
				// is normally the first child of the root (ie. layer 0).
				// var parent = graph.getDefaultParent();
				graph.rootCell = cell.referenceCell || cell;

				// Adds cells to the model in a single step
				graph.getModel().beginUpdate();
				try
				{
					var cells = rootChanged(graph, cell);

					// Removes all cells except the new root
					for (var key in graph.getModel().cells)
					{
						var tmp = graph.getModel().getCell(key);
						
						if (tmp != graph.rootCell && !graph.getModel().isAncestor(
							graph.rootCell, tmp) && graph.getModel().isVertex(tmp))
						{
							graph.removeCells([tmp]);
						}
					}

					// Merges the response model with the client model
					//graph.getModel().mergeChildren(model.getRoot().getChildAt(0), parent);
					graph.addCells(cells);

					// Moves the given cell to the center
					var geo = graph.getModel().getGeometry(graph.rootCell);

					if (geo != null)
					{
						geo = geo.clone();
						
						geo.x = cx - geo.width / 2;
						geo.y = cy - geo.height / 3;
						graph.getModel().setGeometry(graph.rootCell, geo);
					}
					
					// Creates a list of the new vertices, if there is more
					// than the center vertex which might have existed
					// previously, then this needs to be changed to analyze
					// the target model before calling mergeChildren above
					var vertices = [];
					
					for (var key in graph.getModel().cells)
					{
						var tmp = graph.getModel().getCell(key);
						
						if (tmp != graph.rootCell && graph.getModel().isVertex(tmp) &&
							graph.getModel().getParent(tmp) == graph.getDefaultParent())
						{
							vertices.push(tmp);

							// Changes the initial location "in-place"
							// to get a nice animation effect from the
							// center to the radius of the circle
							var geo = graph.getModel().getGeometry(tmp);

							if (geo != null)
							{
								geo.x = cx - geo.width / 2;
								geo.y = cy - geo.height / 2;
							}
						}
					}
					
					// Arranges the response in a circle
					var cellCount = vertices.length;
					var phi = 2 * Math.PI / cellCount;
					var r = Math.max(minSize, Math.min(graph.container.offsetWidth / 2 - 40,
							graph.container.offsetHeight / 2 - 80));
					
					for (var i = 0; i < cellCount; i++)
					{
						var geo = graph.getModel().getGeometry(vertices[i]);
						
						if (geo != null)
						{
							geo = geo.clone();
							geo.x += r * Math.sin(i * phi);
							geo.y += r * Math.cos(i * phi);

							graph.getModel().setGeometry(vertices[i], geo);
						}
					}
				}
				finally
				{
					// Updates the display
					graph.getModel().endUpdate();
				}
			}
		};
		
		// Gets the edges from the source cell and adds the targets
		function rootChanged(graph, cell)
		{
			pageSize = (config != null && config.pageSize != null) ? config.pageSize :
				8 + Math.max(0, Math.floor(Math.min(graph.container.offsetWidth - 800 / 120,
					graph.container.offsetHeight - 600) / 30));
			
			// TODO: Keep existing cells, probably best via XML to redirect IDs
			var realCell = cell.referenceCell || cell;
			var sourceCell = sourceGraph.model.getCell(realCell.sourceCellId);
			var edges = sourceGraph.getEdges(sourceCell, null, true, true, false, true);

			// Removes edges with no opposite
			var validEdges = [];

			for (var i = 0; i < edges.length; i++)
			{
				if (edges[i].getTerminal(true) != null &&
					edges[i].getTerminal(false) != null &&
					sourceGraph.isCellVisible(edges[i]) &&
					!sourceGraph.isEdgeIgnored(edges[i]) &&
					sourceGraph.isCellVisible(edges[i].getTerminal(true)) &&
					sourceGraph.isCellVisible(edges[i].getTerminal(false)) &&
					sourceGraph.isCellVisible(sourceGraph.getLayerForCell(edges[i]))) 
				{
					validEdges.push(edges[i]);
				}
			}

			edges = validEdges;
			var cells = edges;

			// Paging by selecting a window in the edges array
			if (cell.startIndex != null || (pageSize > 0 && edges.length > pageSize))
			{
				var start = cell.startIndex || 0;
				
				cells = edges.slice(Math.max(0, start), Math.min(edges.length, start + pageSize));
			}
			
			cells = sourceGraph.getOpposites(cells, sourceCell).concat(cells);
			var clones = graph.cloneCells(cells);
			
			var edgeStyle = ';curved=1;noEdgeStyle=1;entryX=none;entryY=none;exitX=none;exitY=none;labelBackgroundColor=#ffffffe0;textOpacity=100;';
			var btnStyle = 'fillColor=green;fontColor=white;strokeColor=green;rounded=1;';
			
			for (var i = 0; i < cells.length; i++)
			{
				clones[i].sourceCellId = cells[i].id;
				
				if (graph.model.isEdge(clones[i]))
				{
					// Removes waypoints, edge styles, constraints
					// and centers the main label
					clones[i].geometry.x = 0;
					clones[i].geometry.y = 0;
					clones[i].geometry.points = null;
					clones[i].setStyle(clones[i].getStyle() + edgeStyle);
					clones[i].setTerminal(realCell, clones[i].getTerminal(true) == null);
		
					// Puts child labels at start/end/center of edge
					for (var j = 0; j < clones[i].getChildCount(); j++)
					{
						var child = clones[i].getChildAt(j);

						if (child.geometry != null)
						{
							if (child.geometry.relative)
							{
								child.setStyle(child.getStyle() + ';labelBackgroundColor=#ffffffe0;textOpacity=100;');
								child.geometry.offset = new mxPoint(0, 0);
								child.geometry.y = 0;
								
								if (child.geometry.x < 0.5)
								{
									child.geometry.x = -0.8;
								}
								else if (child.geometry.x > 0.5)
								{
									child.geometry.x = 0.8;
								}
								else
								{
									child.geometry.x = 0;
								}
							}
						}
					}
				}
			}

			if (cell.startIndex > 0)
			{
				var backCell = graph.createVertex(null, null, mxResources.get('previousPage') + ' (' +
					Math.ceil((cell.startIndex || 0) / pageSize) + '/' +
					Math.ceil(edges.length / pageSize) + ')',
					0, 0, 120, 30, btnStyle);
				backCell.referenceCell = realCell;
				backCell.startIndex = Math.max(0, (cell.startIndex || 0) - pageSize);
				clones.splice(0, 0, backCell);
			}
			
			if (edges.length > (cell.startIndex || 0) + pageSize)
			{
				var moreCell = graph.createVertex(null, null, mxResources.get('nextPage') + ' (' +
					(Math.ceil((cell.startIndex || 0) / pageSize) + 2) + '/' +
					Math.ceil(edges.length / pageSize) + ')', 0, 0, 120, 30, btnStyle);
				moreCell.referenceCell = realCell;
				moreCell.startIndex = (cell.startIndex || 0) + pageSize;
				clones.splice(0, 0, moreCell);
			}
			
			return clones;
		};
		
		main(container);
	};

	exploreFromHere(sourceGraph, selectionCell);
};

/**
 * Removes the elements from the map where the given function returns true.
 */
Graph.removeKeys = function(map, ignoreFn)
{
	for (var key in map)
	{
		if (ignoreFn(key))
		{
			delete map[key];
		}
	}
};

/**
 * Sets the transition for the given nodes.
 */
Graph.setTransitionForNodes = function(nodes, transition)
{
	 for (var i = 0; i < nodes.length; i++)
	 {
		mxUtils.setPrefixedStyle(nodes[i].style, 'transition', transition);
	 }
};

/**
 * Sets the opacity for the given nodes.
 */
Graph.setOpacityForNodes = function(nodes, opacity)
{
	 for (var i = 0; i < nodes.length; i++)
	 {
		nodes[i].style.opacity = opacity;
	 }
};

/**
 * Removes formatting from pasted HTML.
 */
Graph.removePasteFormatting = function(elt, ignoreTabs)
{
	while (elt != null)
	{
		if (elt.firstChild != null)
		{
			Graph.removePasteFormatting(elt.firstChild, true);
		}

		var next = elt.nextSibling;
		
		if (elt.nodeType == mxConstants.NODETYPE_ELEMENT && elt.style != null)
		{
			if (elt.style.color == '#000000')
			{
				elt.style.color = '';
			}

			// Replaces tabs from macOS TextEdit
			if (elt.nodeName == 'SPAN' && elt.className == 'Apple-tab-span')
			{
				var temp = Graph.createTabNode(4);
				elt.parentNode.replaceChild(temp, elt);
				elt = temp;
			}

			// Replaces paragraphs from macOS TextEdit
			if (elt.nodeName == 'P' && elt.className == 'p1')
			{
				while (elt.firstChild != null)
				{
					elt.parentNode.insertBefore(elt.firstChild, elt);
				}
				
				if (next != null && next.nodeName == 'P' &&
					next.className == 'p1')
				{
					elt.parentNode.insertBefore(elt.ownerDocument.
						createElement('br'), elt);
				}

				elt.parentNode.removeChild(elt);
			}

			// Replaces tabs
			if (!ignoreTabs && elt.innerHTML != null &&
				elt.innerHTML.indexOf('\t') >= 0)
			{
				var tabNode = Graph.createTabNode(4);
				elt.innerHTML = elt.innerHTML.replace(/\t/g,
					tabNode.outerHTML);
			}
		}

		elt = next;
	}
};

/**
 * Removes formatting from pasted HTML.
 */
Graph.createTabNode = function(spaces)
{
	var str = '\t';
			
	if (spaces != null)
	{
		str = '';
		
		while (spaces > 0)
		{
			str += '\xa0';
			spaces--;
		}
	}

	// LATER: Fix normalized tab after editing plain text labels
	var tabNode = document.createElement('span');
	tabNode.style.whiteSpace = 'pre';
	tabNode.appendChild(document.createTextNode(str));

	return tabNode;
};

/**
 * Sanitizes the given HTML markup, allowing target attributes and
 * data: protocol links to pages and custom actions.
 */
Graph.sanitizeHtml = function(value, editing)
{
	return Graph.domPurify(value, false);
};

/**
 * Returns true if the two style strings are compatible for merging spans.
 * Ignores no-op values like background-color: initial.
 */
Graph.stylesCompatible = function(style1, style2)
{
	var normalize = function(style)
	{
		if (style == null)
		{
			return '';
		}

		var parts = style.split(';');
		var result = [];

		for (var i = 0; i < parts.length; i++)
		{
			var part = parts[i].trim();

			if (part.length > 0)
			{
				var colonIdx = part.indexOf(':');

				if (colonIdx > 0)
				{
					var prop = part.substring(0, colonIdx).trim().toLowerCase();
					var val = part.substring(colonIdx + 1).trim().toLowerCase();

					// Skip no-op values
					if (val != 'initial' && val != 'inherit' && val != 'unset')
					{
						result.push(prop + ':' + val);
					}
				}
			}
		}

		result.sort();

		return result.join(';');
	};

	return normalize(style1) == normalize(style2);
};

/**
 * Optimizes HTML label markup by merging adjacent spans with compatible
 * styles and unwrapping redundant wrapper spans. This reduces the amount
 * of unnecessary markup generated by contenteditable editing.
 */
Graph.optimizeHtml = function(value)
{
	if (value == null || value.length == 0)
	{
		return value;
	}

	var temp = document.createElement('div');
	temp.innerHTML = value;

	Graph.optimizeNode(temp);

	return temp.innerHTML;
};

/**
 * Recursively optimizes the given DOM node by merging adjacent spans
 * with compatible styles and unwrapping redundant single-child spans.
 */
Graph.optimizeNode = function(node)
{
	if (node == null)
	{
		return;
	}

	// Recursively optimize children first (bottom-up)
	var child = node.firstChild;

	while (child != null)
	{
		var next = child.nextSibling;

		if (child.nodeType == 1) // Element node
		{
			Graph.optimizeNode(child);
		}

		child = next;
	}

	// Remove empty font tags (no attributes that change rendering)
	child = node.firstChild;

	while (child != null)
	{
		var next = child.nextSibling;

		if (child.nodeType == 1 && child.nodeName == 'FONT' &&
			!child.hasAttribute('color') && !child.hasAttribute('face') &&
			!child.hasAttribute('size') && !child.hasAttribute('style'))
		{
			// Unwrap font tag - move children to parent
			while (child.firstChild != null)
			{
				node.insertBefore(child.firstChild, child);
			}

			node.removeChild(child);
		}

		child = next;
	}

	// Merge adjacent spans with compatible styles
	child = node.firstChild;

	while (child != null)
	{
		var next = child.nextSibling;

		if (child.nodeType == 1 && next != null && next.nodeType == 1 &&
			child.nodeName == 'SPAN' && next.nodeName == 'SPAN' &&
			Graph.stylesCompatible(child.getAttribute('style'),
				next.getAttribute('style')))
		{
			// Move all children of next into child
			while (next.firstChild != null)
			{
				child.appendChild(next.firstChild);
			}

			next.parentNode.removeChild(next);

			// Normalize adjacent text nodes after merge
			child.normalize();

			// Don't advance - check for more adjacent compatible spans
		}
		else
		{
			child = next;
		}
	}

	// Unwrap redundant single-child spans that have no style or the
	// same style as their parent
	child = node.firstChild;

	while (child != null)
	{
		var next = child.nextSibling;

		if (child.nodeType == 1 && child.nodeName == 'SPAN')
		{
			var style = child.getAttribute('style');

			if ((style == null || style.trim().length == 0) &&
				child.attributes.length <= 1)
			{
				// No meaningful attributes - unwrap
				while (child.firstChild != null)
				{
					node.insertBefore(child.firstChild, child);
				}

				node.removeChild(child);
			}
			else if (node.nodeName == 'SPAN' &&
				Graph.stylesCompatible(style,
					node.getAttribute('style')) &&
				child.attributes.length == 1)
			{
				// Same style as parent span with only style attr - unwrap
				while (child.firstChild != null)
				{
					node.insertBefore(child.firstChild, child);
				}

				node.removeChild(child);
			}
		}

		child = next;
	}

	// Normalize text nodes after unwrapping
	node.normalize();
};

/**
 * Returns the size of the page format scaled with the page size.
 */
 Graph.sanitizeLink = function(href)
 {
	 if (href == null)
	 {
		 return null;
	 }
	 else
	 {
		 var a = document.createElement('a');
		 a.setAttribute('href', href);
		 Graph.sanitizeNode(a);
		 
		 return a.getAttribute('href');
	 }
 };

/**
 * Sanitizes the given DOM node in-place.
 */
Graph.sanitizeNode = function(value)
{
	return Graph.domPurify(value, true);
};

// Disallows external URLs in style attributes
Graph.isStyleAllowed = function(css)
{
    // Normalize CSS escapes before checking
    // CSS allows \XX hex escapes and \char escapes
    var normalized = css.replace(/\\([0-9a-fA-F]{1,6})\s?/g, function(match, hex) {
        return String.fromCharCode(parseInt(hex, 16));
    }).replace(/\\(.)/g, '$1');
    
    // Match all url(...) occurrences
    var urlRegex = /url\s*\(\s*(['"]?)(.*?)\1\s*\)/gi;
    var match;
    
    while ((match = urlRegex.exec(normalized)) !== null)
    {
        var url = match[2].trim();
        var isRelative = !/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(url);
        var isDataUrl = url.toLowerCase().startsWith('data:');
        
        if (!isRelative && !isDataUrl)
        {
            return false;
        }
    }
    
    // Block @import entirely (check normalized version)
    if (/@import/i.test(normalized))
    {
        return false;
    }
    
    // TODO Consider also blocking:
    // - @font-face (can load external fonts)
    // - -webkit-mask-image, mask-image (can reference URLs)
    // - list-style-image (can reference URLs)
    // - cursor: url(...) (can reference URLs)
    // - content: url(...) (can reference URLs)
    
    return true;
}
// Allows use tag in SVG with local references only
DOMPurify.addHook('afterSanitizeAttributes', function(node)
{
	if (node.nodeName == 'use' && ((node.getAttribute('xlink:href') != null &&
		!node.getAttribute('xlink:href').startsWith('#')) ||
		(node.getAttribute('href') != null && !node.getAttribute('href').startsWith('#'))))
	{
		node.remove();
	}
	else if (node.nodeName.toLowerCase() == 'style')
	{
		if (!Graph.isStyleAllowed(node.textContent))
		{
			node.remove();
		}
	}
});

// Disallows external URLs in style attributes
DOMPurify.addHook('uponSanitizeAttribute', function(node, data)
{
	if (data.attrName == 'style')
	{
		if (!Graph.isStyleAllowed(data.attrValue))
		{
			data.keepAttr = false; // remove entire style attribute
		}
	}
});

/**
 * Sanitizes the given value.
 */
Graph.domPurify = function(value, inPlace)
{
	window.DOM_PURIFY_CONFIG.IN_PLACE = inPlace;
	
	return DOMPurify.sanitize(value, window.DOM_PURIFY_CONFIG);
};

/**
 * Updates the viewbox, width and height in the given SVG data URI
 * and returns the updated data URI with all script tags and event
 * handlers removed.
 */
Graph.clipSvgDataUri = function(dataUri)
{
	if (dataUri != null && dataUri.substring(0, 26) == 'data:image/svg+xml;base64,')
	{
		try
		{
			var div = document.createElement('div');
			div.style.position = 'absolute';
			div.style.visibility = 'hidden';
			
			// Adds the text and inserts into DOM for updating of size
			var data = decodeURIComponent(escape(atob(dataUri.substring(26))));
			var idx = data.indexOf('<svg');
			
			if (idx >= 0)
			{
				// Strips leading XML declaration and doctypes
				div.innerHTML = Graph.sanitizeHtml(data.substring(idx));
				
				// Gets the size and removes from DOM
				var svgs = div.getElementsByTagName('svg');

				if (svgs.length > 0)
				{
					document.body.appendChild(div);
					
					try
					{
						var fx = 1;
						var fy = 1;
						var w = svgs[0].getAttribute('width');
						var h = svgs[0].getAttribute('height');
						
						if (w != null && w.charAt(w.length - 1) != '%')
						{
							w = parseFloat(w);
						}
						else
						{
							w = NaN;
						}
						
						if (h != null && h.charAt(h.length - 1) != '%')
						{
							h = parseFloat(h);
						}
						else
						{
							h = NaN;
						}
						
						var vb = svgs[0].getAttribute('viewBox');
						
						if (vb != null && !isNaN(w) && !isNaN(h))
						{
							var tokens = vb.split(' ');

							if (vb.length >= 4)
							{
								fx = parseFloat(tokens[2]) / w;
								fy = parseFloat(tokens[3]) / h;
							}
						}

						// KNOWN: Ignores stroke-width and transforms
						var bbox = svgs[0].getBBox();
						
						if (bbox.width > 0 && bbox.height > 0)
						{
							// Workaround to add stroke-width
							var maxStrokeWidth = 0;
							var maxStrokeWidths = svgs[0].querySelectorAll('[stroke-width]');

							for (var i = 0; i < maxStrokeWidths.length; i++)
							{
								maxStrokeWidth = Math.max(maxStrokeWidth, parseFloat(
									maxStrokeWidths[i].getAttribute('stroke-width')));
							}

							// Also checks CSS-defined stroke-width
							var visualElts = svgs[0].querySelectorAll(
								'rect,circle,ellipse,line,polyline,polygon,path');

							for (var i = 0; i < visualElts.length; i++)
							{
								try
								{
									var cs = window.getComputedStyle(visualElts[i]);

									if (cs.stroke && cs.stroke !== 'none')
									{
										maxStrokeWidth = Math.max(maxStrokeWidth,
											parseFloat(cs.strokeWidth) || 0);
									}
								}
								catch (e)
								{
									// ignore
								}
							}

							var size = new mxRectangle(bbox.x, bbox.y, bbox.width, bbox.height);
							size.grow(maxStrokeWidth / 2);

							// Uses the original viewBox as a lower bound
							if (vb != null)
							{
								var tokens = vb.split(' ');

								if (tokens.length >= 4)
								{
									var orig = new mxRectangle(parseFloat(tokens[0]),
										parseFloat(tokens[1]), parseFloat(tokens[2]),
										parseFloat(tokens[3]));
									size.add(orig);
								}
							}

							// Clips to the smaller of the given size and the bbox
							if (!isNaN(w) && !isNaN(h) &&
								size.x < 0 && size.y < 0 &&
								size.width > w && size.height > h)
							{
								div.getElementsByTagName('svg')[0].setAttribute('viewBox',
									'0 0 ' + w + ' ' + h);
							}
							else
							{
								div.getElementsByTagName('svg')[0].setAttribute('viewBox', size.x +
									' ' + size.y + ' ' + size.width + ' ' + size.height);
								div.getElementsByTagName('svg')[0].setAttribute('width', size.width / fx);
								div.getElementsByTagName('svg')[0].setAttribute('height', size.height / fy);
							}
						}
					}
					catch (e)
					{
						// ignore
					}
					finally
					{	
						document.body.removeChild(div);
					}
					
					dataUri = Editor.createSvgDataUri(mxUtils.getXml(svgs[0]));
				}
			}
		}
		catch (e)
		{
			// ignore
		}
	}
	
	return dataUri;
};

/**
 * Create remove icon. 
 */
Graph.createRemoveIcon = function(title, onclick)
{
	var removeLink = document.createElement('img');
	removeLink.setAttribute('src', Dialog.prototype.clearImage);
	removeLink.setAttribute('title', title);
	removeLink.setAttribute('width', '13');
	removeLink.setAttribute('height', '10');
	removeLink.style.marginLeft = '4px';
	removeLink.style.marginBottom = '-1px';
	removeLink.style.cursor = 'pointer';

	mxEvent.addListener(removeLink, 'click', onclick);

	return removeLink;
};

/**
 * Returns true if the given string is a page link.
 */
Graph.isPageLink = function(text)
{
	return text != null && text.substring(0, 13) == 'data:page/id,';
};

/**
 * Returns true if the given string is a page link.
 */
Graph.rewritePageLinks = function(doc, removeNamespace)
{
	var links = doc.getElementsByTagName('a');

	function rewriteLink(link, attrib)
	{
		var href = link.getAttribute(attrib);

		if (href != null)
		{
			if (Graph.isPageLink(href))
			{
				href = '#' + href.substring(href.indexOf(':') + 1);
			}

			var newAttrib = attrib;

			if (removeNamespace && attrib == 'xlink:href')
			{
				link.removeAttribute(attrib);
				newAttrib = 'href';
			}

			link.setAttribute(newAttrib, href);
		}
	};

	if (links != null)
	{
		for (var i = 0; i < links.length; i++)
		{
			rewriteLink(links[i], 'href');
			rewriteLink(links[i], 'xlink:href');
		}
	}
};

/**
 * Returns true if the given string is a link.
 * 
 * See https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 */
Graph.isLink = function(text)
{
	return text != null && text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
};

/**
 * Graph inherits from mxGraph.
 */
mxUtils.extend(Graph, mxGraph);

/**
 * Subdivides the given absolute points into a fine polyline that approximates
 * the curve actually drawn for curved/bezier edges, so the tangent is taken
 * from the rendered spline instead of the straight control polygon. Mirrors
 * mxPolyline.paintCurvedLine (quadratic through midpoints) and
 * paintBezierLine (cubic when the points form an [anchor, cp, cp, anchor, ...]
 * sequence, otherwise the same quadratic fallback). Returns the points
 * unchanged when none are curved.
 */
Graph.getCurvePoints = function(pts, bezier)
{
	var n = pts.length;

	if (n < 3 || pts.indexOf(null) >= 0)
	{
		return pts;
	}

	var steps = 16;
	var result = [pts[0]];

	var quad = function(p0, pc, p1)
	{
		for (var t = 1; t <= steps; t++)
		{
			var u = t / steps, iu = 1 - u;
			result.push(new mxPoint(
				iu * iu * p0.x + 2 * iu * u * pc.x + u * u * p1.x,
				iu * iu * p0.y + 2 * iu * u * pc.y + u * u * p1.y));
		}
	};

	if (bezier && (n - 1) % 3 == 0)
	{
		// Points are cubic control points: [anchor, cp1, cp2, anchor, ...]
		for (var i = 1; i + 2 < n; i += 3)
		{
			var p0 = pts[i - 1], c1 = pts[i], c2 = pts[i + 1], p1 = pts[i + 2];

			for (var t = 1; t <= steps; t++)
			{
				var u = t / steps, iu = 1 - u;
				result.push(new mxPoint(
					iu * iu * iu * p0.x + 3 * iu * iu * u * c1.x + 3 * iu * u * u * c2.x + u * u * u * p1.x,
					iu * iu * iu * p0.y + 3 * iu * iu * u * c1.y + 3 * iu * u * u * c2.y + u * u * u * p1.y));
			}
		}
	}
	else
	{
		// Quadratic through the midpoints of consecutive control points
		var prev = pts[0];

		for (var i = 1; i < n - 2; i++)
		{
			var mid = new mxPoint((pts[i].x + pts[i + 1].x) / 2,
				(pts[i].y + pts[i + 1].y) / 2);
			quad(prev, pts[i], mid);
			prev = mid;
		}

		quad(prev, pts[n - 2], pts[n - 1]);
	}

	return result;
};

/**
 * Returns the angle (in degrees) of the edge segment nearest to the absolute
 * point (px, py). Uses the rendered label position rather than the stored
 * geometry.x because dragging an edge label updates geometry.offset, not
 * geometry.x (see mxGraph.translateCell), so a label moved onto a different
 * segment still resolves to the segment it actually sits on. For curved/bezier
 * edges the control polygon is subdivided first so the tangent follows the
 * drawn spline. Returns null if the edge geometry is not yet available.
 */
Graph.getEdgeLabelAngle = function(edgeState, px, py)
{
	var pts = (edgeState != null) ? edgeState.absolutePoints : null;

	if (pts == null || pts.length < 2)
	{
		return null;
	}

	var style = edgeState.style;

	if (style != null && (style[mxConstants.STYLE_CURVED] == 1 ||
		style[mxConstants.STYLE_BEZIER] == 1))
	{
		pts = Graph.getCurvePoints(pts, style[mxConstants.STYLE_BEZIER] == 1);
	}

	var angle = null;
	var bestDist = null;

	for (var i = 1; i < pts.length; i++)
	{
		var p0 = pts[i - 1];
		var pe = pts[i];

		if (p0 == null || pe == null)
		{
			continue;
		}

		// Squared distance from (px, py) to the clamped projection on segment
		var dx = pe.x - p0.x;
		var dy = pe.y - p0.y;
		var len2 = dx * dx + dy * dy;
		var t = (len2 == 0) ? 0 : Math.max(0, Math.min(1,
			((px - p0.x) * dx + (py - p0.y) * dy) / len2));
		var ddx = px - (p0.x + t * dx);
		var ddy = py - (p0.y + t * dy);
		var dist = ddx * ddx + ddy * ddy;

		if (bestDist == null || dist < bestDist)
		{
			bestDist = dist;
			angle = Math.atan2(dy, dx) * 180 / Math.PI;
		}
	}

	return angle;
};

/**
 * Returns the upright tangent angle (in degrees) for the label of the given
 * state when the labelAutoRotate style is set, or null otherwise. Handles the
 * main edge label (state.cell is the edge) and child label cells (parent is
 * the edge). Shared by the label renderer (mxText.getTextRotation) and the
 * selection handles so the dashed border and the text rotate together.
 */
Graph.getLabelAutoRotation = function(state)
{
	if (state == null || mxUtils.getValue(state.style, 'labelAutoRotate', '0') != '1')
	{
		return null;
	}

	var model = state.view.graph.model;
	var edgeState = null;
	var px, py;

	if (model.isEdge(state.cell))
	{
		edgeState = state;
		px = state.absoluteOffset.x;
		py = state.absoluteOffset.y;
	}
	else if (model.isEdge(model.getParent(state.cell)))
	{
		edgeState = state.view.getState(model.getParent(state.cell));
		px = state.getCenterX();
		py = state.getCenterY();
	}

	var angle = (edgeState != null) ? Graph.getEdgeLabelAngle(edgeState, px, py) : null;

	if (angle != null)
	{
		angle = mxUtils.mod(angle, 360);

		// Keeps the label upright instead of rendering it upside-down
		if (angle > 90 && angle < 270)
		{
			angle -= 180;
		}
	}

	return angle;
};

/**
 * Rotates labels tangentially to their edge when the labelAutoRotate style is
 * set. Runs on every view validation, so the angle tracks the connector
 * automatically when it is moved or rerouted. See jgraph/drawio#5365.
 */
var mxTextGetTextRotation = mxText.prototype.getTextRotation;
mxText.prototype.getTextRotation = function()
{
	var angle = (this.state != null) ? Graph.getLabelAutoRotation(this.state) : null;

	return (angle != null) ? angle : mxTextGetTextRotation.apply(this, arguments);
};

/**
 * Allows all values in fit.
 */
Graph.prototype.minFitScale = null;

/**
 * Allows all values in fit.
 */
Graph.prototype.maxFitScale = null;

/**
 * Sets the policy for links. Possible values are "self" to replace any framesets,
 * "blank" to load the URL in <linkTarget> and "auto" (default).
 */
Graph.prototype.linkPolicy = (urlParams['target'] == 'frame') ? 'blank' : (urlParams['target'] || 'auto');

/**
 * Target for links that open in a new window. Default is _blank.
 */
Graph.prototype.linkTarget = (urlParams['target'] == 'frame') ? '_self' : '_blank';

/**
 * Default link target for SVG exports. If set, used as fallback in getSvg
 * when no explicit linkTarget is provided. Read from the mxfile node's
 * linkTarget attribute when loading file data.
 */
Graph.prototype.defaultExportLinkTarget = null;

/**
 * Value to the rel attribute of links. Default is 'nofollow noopener noreferrer'.
 * NOTE: There are security implications when this is changed and if noopener is removed,
 * then <openLink> must be overridden to allow for the opener to be set by default.
 */
Graph.prototype.linkRelation = 'nofollow noopener noreferrer';

/**
 * Scrollbars setting is overriden in the editor, but not in the viewer.
 */
Graph.prototype.defaultScrollbars = true;

/**
 * Specifies if the page should be visible for new files. Default is true.
 */
Graph.prototype.defaultPageVisible = true;

/**
 * Specifies if the page should be visible for new files. Default is true.
 */
Graph.prototype.defaultGridEnabled = urlParams['grid'] != '0';

/**
 * Specifies the default value for connection arrows on hover. Default is true.
 */
Graph.prototype.defaultConnectionArrowsEnabled = true;

/**
 * Specifies the default value for connectable (connection handler). Default is true.
 */
Graph.prototype.defaultConnectable = true;

/**
 * Specifies the default value for folding enabled. Default is true.
 */
Graph.prototype.defaultFoldingEnabled = true;

/**
 * Specifies if the app should run in chromeless mode. Default is false.
 * This default is only used if the contructor argument is null.
 */
Graph.prototype.lightbox = false;

/**
 * 
 */
Graph.prototype.diagramBackgroundColor = '#f0f0f0';

/**
 * Whether to use diagramBackgroundColor for no page views.
 */
Graph.prototype.enableDiagramBackground = false;

/**
 * 
 */
Graph.prototype.defaultPageBackgroundColor = (urlParams['embedInline'] == '1') ?
	'transparent' : 'light-dark(#ffffff, ' + Editor.darkColor + ')';

/**
 * 
 */
Graph.prototype.defaultPageBorderColor = 'light-dark(#ffffff, #000000)';

/**
 * 
 */
Graph.prototype.shapeForegroundColor = 'light-dark(#000000, #ffffff)';

/**
 * Editor.darkColorVar is used to allow override of the dark color in exported SVGs.
 */
Graph.prototype.shapeBackgroundColor = 'light-dark(#ffffff, var(' +
	Editor.darkColorVar + ', ' + Editor.darkColor + '))';

/**
 * Specifies the size of the size for "tiles" to be used for a graph with
 * scrollbars but no visible background page. A good value is large
 * enough to reduce the number of repaints that is caused for auto-
 * translation, which depends on this value, and small enough to give
 * a small empty buffer around the graph. Default is 400x400.
 */
Graph.prototype.scrollTileSize = new mxRectangle(0, 0, 400, 400);

/**
 * Overrides the background color and paints a transparent background.
 */
Graph.prototype.transparentBackground = true;

/**
 * Sets global constants.
 */
Graph.prototype.selectParentAfterDelete = false;

/**
 * Sets the default target for all links in cells.
 */
Graph.prototype.defaultEdgeLength = 80;

/**
 * Enables activation of special handles on unselected cells.
 */
Graph.prototype.immediateHandling = true;

/**
 * Allows all values in fit.
 */
Graph.prototype.connectionArrowsEnabled = true;

/**
 * Specifies the regular expression for matching placeholders.
 */
Graph.prototype.placeholderPattern = new RegExp('%(date\{.*\}|[^%\{\}"\'=;]+)%', 'g');

/**
 * Specifies the regular expression for matching placeholders.
 */
Graph.prototype.absoluteUrlPattern = new RegExp('^(?:[a-z]+:)?//', 'i');

/**
 * Specifies the default name for the theme. Default is 'default'.
 */
Graph.prototype.defaultThemeName = 'default';

/**
 * Specifies the default name for the theme. Default is 'default'.
 */
Graph.prototype.defaultThemes = {};

/**
 * Base URL for relative links.
 */
Graph.prototype.baseUrl = (urlParams['base'] != null) ?
	mxUtils.removeJavascriptProtocol(
		decodeURIComponent(urlParams['base'])) :
	(((window != window.top) ? document.referrer :
	document.location.toString()).split('#')[0]);

/**
 * Specifies if the label should be edited after an insert.
 */
Graph.prototype.editAfterInsert = false;

/**
 * Defines the built-in properties to be ignored in tooltips.
 */
Graph.prototype.builtInProperties = ['label', 'tooltip', 'placeholders', 'placeholder'];

/**
 * Defines if the graph is part of an EditorUi. If this is false the graph can
 * be used in an EditorUi instance but will not have a UI added, functions
 * overridden or event handlers added.
 */
Graph.prototype.standalone = false;

/**
 * Enables move of bends/segments without selecting.
 */
Graph.prototype.enableFlowAnimation = false;

/**
 * Background color for inactive tabs.
 */
Graph.prototype.roundableShapes = ['label', 'rectangle', 'internalStorage', 'corner',
	'parallelogram', 'swimlane', 'triangle', 'trapezoid', 'ext', 'step', 'tee', 'process',
	'link', 'rhombus', 'offPageConnector', 'loopLimit', 'hexagon', 'manualInput', 'card',
	'curlyBracket', 'singleArrow', 'callout', 'doubleArrow', 'flexArrow', 'umlLifeline'];

/**
 * Font size for simple text. Default is null to force the global default.
 */
Graph.prototype.vertexFontSize = null;

/**
 * Font size for edge labels. Default is null to force the global default.
 */
Graph.prototype.edgeFontSize = null;

/**
 * Contains the color mode. Possible values are 'auto', 'simple and 'none'.
 * Default is 'auto'.
 */
Graph.prototype.adaptiveColors = 'auto';

/**
 * Installs child layout styles.
 */
Graph.prototype.init = function(container)
{
	mxGraph.prototype.init.apply(this, arguments);

	// Intercepts links with no target attribute and opens in new window
	this.cellRenderer.initializeLabel = function(state, shape)
	{
		mxCellRenderer.prototype.initializeLabel.apply(this, arguments);
		
		// Checks tolerance for clicks on links
		var tol = state.view.graph.tolerance;
		var handleClick = true;
		var first = null;
		
		var down = mxUtils.bind(this, function(evt)
		{
			handleClick = true;
			first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
		});
		
		var move = mxUtils.bind(this, function(evt)
		{
			handleClick = handleClick && first != null &&
				Math.abs(first.x - mxEvent.getClientX(evt)) < tol &&
				Math.abs(first.y - mxEvent.getClientY(evt)) < tol;
		});
		
		var up = mxUtils.bind(this, function(evt)
		{
			if (handleClick)
			{
				var elt = mxEvent.getSource(evt)
				
				while (elt != null && elt != shape.node)
				{
					if (elt.nodeName.toLowerCase() == 'a')
					{
						state.view.graph.labelLinkClicked(state, elt, evt);
						break;
					}
					
					elt = elt.parentNode;
				}
			}
		});
		
		mxEvent.addGestureListeners(shape.node, down, move, up);
		mxEvent.addListener(shape.node, 'click', function(evt)
		{
			mxEvent.consume(evt);
		});
	};
	
	// Handles custom links in tooltips
	if (this.tooltipHandler != null)
	{
		var tooltipHandlerInit = this.tooltipHandler.init;

		this.tooltipHandler.init = function()
		{
			tooltipHandlerInit.apply(this, arguments);

			if (this.div != null)
			{
				if (Editor.tooltipFontSize != null)
				{
					this.div.style.fontSize = Editor.tooltipFontSize + 'px';
				}

				if (Editor.tooltipMaxWidth > 0)
				{
					this.div.style.maxWidth = Editor.tooltipMaxWidth + 'px';
				}

				mxEvent.addListener(this.div, 'click', mxUtils.bind(this, function(evt)
				{
					var source = mxEvent.getSource(evt);
					
					if (source.nodeName == 'A')
					{
						var href = source.getAttribute('href');
						
						if (href != null && this.graph.isCustomLink(href) &&
							(mxEvent.isTouchEvent(evt) || !mxEvent.isPopupTrigger(evt)) &&
							this.graph.customLinkClicked(href))
						{
							mxEvent.consume(evt);
						}
					}
				}));
			}
		};
	}

	// Both register BEFORE_UNDO listeners on the model, which fire in
	// registration order: the transparentBounds geometry normalization must
	// run before the layout manager, so a layout triggered by the same edit
	// that toggles transparentBounds sees the pinned (0,0,0,0) geometry and
	// translated children instead of the stale frame (the children would be
	// shifted by the old origin twice).
	this.initTransparentBoundsStyleSync();
	this.initLayoutManager();
};

/**
 * Listens for transparentBounds toggling on a vertex and, in the same model
 * edit, keeps the stored geometry consistent with the rendering mode while
 * leaving the children visually in place:
 *
 *   0 -> 1 (enable): pins the geometry at (0,0,0,0) — the visible bounds are
 *     derived from the children from here on — and translates the children by
 *     the old origin so they don't jump.
 *   1 -> 0 (disable): rewrites the geometry to the bounds that were derived
 *     from the children, then translates the children back. Without this,
 *     switching off transparent would snap to the stale stored geometry (often
 *     (0,0,0,0)) or leave the children outside the now-opaque box.
 *
 * Hooking on BEFORE_UNDO means the geometry and children changes land in the
 * same undoable edit as the style change — one undo reverts the whole thing.
 */
Graph.prototype.initTransparentBoundsStyleSync = function()
{
	this.model.addListener(mxEvent.BEFORE_UNDO, mxUtils.bind(this, function(sender, evt)
	{
		var edit = evt.getProperty('edit');

		if (edit == null || edit.changes == null)
		{
			return;
		}

		var stylesheet = this.getStylesheet();

		// Snapshot length so geometry changes added below aren't re-scanned.
		var n = edit.changes.length;

		for (var i = 0; i < n; i++)
		{
			var change = edit.changes[i];

			if (!(change instanceof mxStyleChange) ||
				!this.model.isVertex(change.cell))
			{
				continue;
			}

			var oldStyle = stylesheet.getCellStyle(change.previous);
			var newStyle = stylesheet.getCellStyle(change.style);
			var wasTransparent = oldStyle != null &&
				oldStyle['transparentBounds'] == 1;
			var isTransparent = newStyle != null &&
				newStyle['transparentBounds'] == 1;

			if (wasTransparent == isTransparent)
			{
				continue;
			}

			var oldGeo = this.getCellGeometry(change.cell);

			if (oldGeo == null)
			{
				continue;
			}

			if (isTransparent)
			{
				// Enabling: pin the stored geometry at (0,0,0,0) — the visible
				// bounds are derived from the children from here on — and translate
				// the children by the old origin so they stay in place.
				if (oldGeo.x != 0 || oldGeo.y != 0)
				{
					var count = this.model.getChildCount(change.cell);

					for (var j = 0; j < count; j++)
					{
						this.translateCell(this.model.getChildAt(change.cell, j),
							oldGeo.x, oldGeo.y);
					}
				}

				if (oldGeo.x != 0 || oldGeo.y != 0 ||
					oldGeo.width != 0 || oldGeo.height != 0)
				{
					var newGeo = oldGeo.clone();
					newGeo.x = 0;
					newGeo.y = 0;
					newGeo.width = 0;
					newGeo.height = 0;
					this.model.setGeometry(change.cell, newGeo);
				}
			}
			else
			{
				// Disabling: rewrite the stored geometry to the bounds that were
				// derived from the children, then translate the children back so
				// they stay in place inside the now-opaque box.
				var bounds = this.getTransparentBounds(change.cell);

				if (bounds == null)
				{
					continue;
				}

				var newGeo = oldGeo.clone();
				newGeo.x += bounds.x;
				newGeo.y += bounds.y;
				newGeo.width = bounds.width;
				newGeo.height = bounds.height;
				this.model.setGeometry(change.cell, newGeo);

				if (bounds.x != 0 || bounds.y != 0)
				{
					var count = this.model.getChildCount(change.cell);

					for (var j = 0; j < count; j++)
					{
						this.translateCell(this.model.getChildAt(change.cell, j),
							-bounds.x, -bounds.y);
					}
				}
			}
		}
	}));
};

/**
 * Waits for the browser translation engine to start before initialising
 * the full mirror infrastructure. Observes the <html> element for a
 * "translated-*" class (added by Chrome Translate and similar engines).
 * If already translated, initialises immediately.
 */
Graph.prototype.waitForBrowserTranslate = function()
{
	var graph = this;

	if (Graph.isBrowserTranslated())
	{
		this.initBrowserTranslate();
		this.btActive = true;
		this.activateBrowserTranslate();
		return;
	}

	var callback = function()
	{
		if (graph.btClassObservers != null && Graph.isBrowserTranslated())
		{
			for (var i = 0; i < graph.btClassObservers.length; i++)
			{
				graph.btClassObservers[i].disconnect();
			}

			graph.btClassObservers = null;
			graph.initBrowserTranslate();
			graph.btActive = true;
			graph.activateBrowserTranslate();
		}
	};

	this.btClassObservers = [];
	var opts = { attributes: true, attributeFilter: ['class'] };

	// Always observe the local <html> element
	var localObs = new MutationObserver(callback);
	localObs.observe(document.documentElement, opts);
	this.btClassObservers.push(localObs);

	// In a same-origin iframe also observe the parent <html>
	try
	{
		if (window.parent != window && window.parent.document != null &&
			window.parent.document.documentElement != document.documentElement)
		{
			var parentObs = new MutationObserver(callback);
			parentObs.observe(window.parent.document.documentElement, opts);
			this.btClassObservers.push(parentObs);
		}
	}
	catch (e)
	{
		// Cross-origin or sandboxed iframe
	}
};

/**
 * Initializes the browser translation mirror. Creates a hidden container
 * in the regular DOM (outside SVG) and hooks into the rendering pipeline
 * so that foreignObject HTML content is cloned there. Browser translation
 * engines can then find and translate the mirrored text. A MutationObserver
 * syncs changes back into the original foreignObject elements.
 */
Graph.prototype.initBrowserTranslate = function()
{
	var graph = this;

	// Map from mirror node to the original SVG text node / Text node
	this.btMirrorMap = new Map();

	// Flag to ignore mutations caused by our own mirror rebuilds
	this.btRebuilding = false;

	// Hoist mirror into the top-level document when inside a same-origin
	// iframe so Chrome Translate reliably discovers and translates the
	// text. Falls back to the current document when cross-origin or
	// when any security restriction prevents access.
	var mirrorDoc = document;

	try
	{
		if (window.parent != window && window.parent.document != null)
		{
			mirrorDoc = window.parent.document;
		}
	}
	catch (e)
	{
		// Cross-origin or sandboxed iframe — fall back to local document
	}

	// Hidden container: positioned offscreen but not display:none
	// so browser translation engines can detect the content
	var mirror = mirrorDoc.createElement('div');
	mirror.id = 'bt-mirror';
	mirror.setAttribute('aria-hidden', 'true');
	mirror.style.cssText = 'position:fixed;left:-10000px;' +
		'top:0;width:1px;overflow:hidden;';
	mirrorDoc.body.appendChild(mirror);
	this.btMirrorContainer = mirror;

	// Syncs translated text from a mirror node back to the SVG
	var syncMirrorMutation = function(mutations)
	{
		// Ignore mutations from our own rebuilds
		if (graph.btRebuilding)
		{
			return;
		}

		// On the first real translation mutation, register the
		// expensive per-change event listeners for mirror rebuilds.
		if (!graph.btActive)
		{
			graph.btActive = true;
			graph.activateBrowserTranslate();
		}

		for (var i = 0; i < mutations.length; i++)
		{
			var target = mutations[i].target;

			// Walk up to find the direct child of the mirror container
			var mirrorChild = target;

			while (mirrorChild != null && mirrorChild.parentNode != null &&
				mirrorChild.parentNode != graph.btMirrorContainer)
			{
				mirrorChild = mirrorChild.parentNode;
			}

			if (mirrorChild != null)
			{
				var original = graph.btMirrorMap.get(mirrorChild);

				if (original != null)
				{
					graph.syncTranslationToForeignObject(mirrorChild, original);
				}
			}
		}
	};

	this.btObserver = new MutationObserver(syncMirrorMutation);

	this.btObserver.observe(mirror,
	{
		childList: true,
		subtree: true,
		characterData: true
	});

	// Populate mirror once so Chrome has content to discover
	this.refreshBrowserTranslateMirror();
};

/**
 * Registers per-change event listeners to keep the mirror in sync.
 * Called on first translation mutation to avoid the overhead when
 * the browser never translates.
 */
Graph.prototype.activateBrowserTranslate = function()
{
	// Rebuild mirror after full revalidation
	this.addListener(mxEvent.SIZE, mxUtils.bind(this, function()
	{
		this.refreshBrowserTranslateMirror();
	}));

	// Rebuild mirror after label edit or cell add
	var btRefresh = mxUtils.bind(this, function()
	{
		this.refreshBrowserTranslateMirror();
	});

	this.addListener(mxEvent.LABEL_CHANGED, btRefresh);
	this.addListener(mxEvent.CELLS_ADDED, btRefresh);

	// Refresh after any model change (move, resize, style, etc.)
	// to pick up recreated SVG text nodes. Deferred so the view
	// has revalidated before we query the new SVG nodes.
	this.getModel().addListener(mxEvent.CHANGE, function()
	{
		setTimeout(btRefresh, 0);
	});
};

/**
 * Adds mirror spans for an SVG text element or foreignObject div
 * to the hidden container and stores the references.
 * For foreignObject divs, each leaf text node is mirrored separately
 * so that translation and sync happen per-node.
 */
Graph.prototype.addBrowserTranslateMirror = function(originalNode)
{
	if (this.btMirrorContainer == null)
	{
		return;
	}

	var isForeignObject = originalNode.namespaceURI == 'http://www.w3.org/1999/xhtml';

	if (isForeignObject)
	{
		// Mirror each leaf text node separately
		var walker = document.createTreeWalker(originalNode,
			NodeFilter.SHOW_TEXT, null, false);
		var textNode;

		while ((textNode = walker.nextNode()) != null)
		{
			var text = textNode.data;

			if (text != null && text.trim().length > 0)
			{
				var span = document.createElement('p');
				span.style.cssText = 'margin:0;';
				span.textContent = text;
				span.setAttribute('data-bt-original', text);
				this.btMirrorContainer.appendChild(span);
				// Map directly to the text node, not the div
				this.btMirrorMap.set(span, textNode);
			}
		}
	}
	else
	{
		// SVG text element - single span
		var text = originalNode.textContent;

		if (text != null && text.length > 0)
		{
			var span = document.createElement('p');
			span.style.cssText = 'margin:0;';
			span.textContent = text;
			span.setAttribute('data-bt-original', text);
			this.btMirrorContainer.appendChild(span);
			this.btMirrorMap.set(span, originalNode);
		}
	}
};

/**
 * Copies translated text from a mirror span back into the
 * original SVG text element or foreignObject div.
 */
Graph.prototype.syncTranslationToForeignObject = function(mirrorSpan, originalNode)
{
	var newText = mirrorSpan.textContent;

	// originalNode is either a Text node (foreignObject case)
	// or an SVG text element
	var oldText = (originalNode.nodeType == 3) ?
		originalNode.data : originalNode.textContent;

	if (newText == oldText)
	{
		return;
	}

	if (originalNode.nodeType == 3)
	{
		// Text node (foreignObject) - direct update
		originalNode.data = newText;
	}
	else
	{
		// SVG text element - may have tspan children
		var tspans = originalNode.querySelectorAll('tspan');

		if (tspans.length == 0)
		{
			originalNode.textContent = newText;
		}
		else if (tspans.length == 1)
		{
			tspans[0].textContent = newText;
		}
		else
		{
			// Multiple tspans (multi-line) - put all text in first,
			// clear the rest
			tspans[0].textContent = newText;

			for (var i = 1; i < tspans.length; i++)
			{
				tspans[i].textContent = '';
			}
		}
	}
};

/**
 * Clears and rebuilds the browser translation mirror. Called after
 * graph revalidation when all foreignObjects have been recreated.
 */
Graph.prototype.refreshBrowserTranslateMirror = function()
{


	if (this.btMirrorContainer == null || this.container == null)
	{
		return;
	}

	// Flag to ignore our own mutations during rebuild
	this.btRebuilding = true;

	// Cache existing translations before clearing (original text -> translated text).
	// Starts with any externally seeded cache (e.g. from viewer -> lightbox transfer)
	// so that translations survive page switches even if they weren't in the current mirror.
	var translationCache = {};
	var cacheCount = 0;

	if (this.btTranslationCache != null)
	{
		for (var key in this.btTranslationCache)
		{
			translationCache[key] = this.btTranslationCache[key];
			cacheCount++;
		}
	}

	var spans = this.btMirrorContainer.children;

	for (var i = 0; i < spans.length; i++)
	{
		var origText = spans[i].getAttribute('data-bt-original');
		var curText = spans[i].textContent;

		if (origText != null && curText != origText)
		{
			translationCache[origText] = curText;
			cacheCount++;
		}
	}

	this.btMirrorMap.clear();
	this.btMirrorContainer.innerHTML = '';

	// Find all text-bearing elements: SVG text elements and foreignObject divs
	var svg = this.container.querySelector('svg');
	if (svg != null)
	{
		// SVG text elements (convertToSvg path)
		var textElements = svg.querySelectorAll('text');
		var svgCount = 0;

		for (var i = 0; i < textElements.length; i++)
		{
			// Skip text elements inside foreignObject (they are
			// handled by the foreignObject path below)
			if (textElements[i].closest('foreignObject') == null)
			{
				this.addBrowserTranslateMirror(textElements[i]);
				svgCount++;
			}
		}

		// foreignObject divs (non-convertToSvg path)
		var foElements = svg.querySelectorAll('foreignObject > div');
		var foCount = 0;

		for (var i = 0; i < foElements.length; i++)
		{
			this.addBrowserTranslateMirror(foElements[i]);
			foCount++;
		}

	}

	// Reapply cached translations to new mirror spans and their SVG targets.
	// syncTranslationToForeignObject writes translated text into the SVG,
	// so after a view refresh the SVG (and thus the new mirror spans) may
	// already contain translated text. Build a reverse map to detect this
	// and restore the true original in data-bt-original.
	if (cacheCount > 0)
	{
		var reverseCache = {};

		for (var key in translationCache)
		{
			reverseCache[translationCache[key]] = key;
		}

		var reapplied = 0;
		var entries = this.btMirrorContainer.children;

		for (var i = 0; i < entries.length; i++)
		{
			var origText = entries[i].getAttribute('data-bt-original');

			// If the "original" is actually a cached translation
			// (SVG had translated text), restore the true original
			if (origText != null && reverseCache[origText] != null)
			{
				origText = reverseCache[origText];
				entries[i].setAttribute('data-bt-original', origText);
			}

			var cached = (origText != null) ? translationCache[origText] : null;

			if (cached != null)
			{
				entries[i].textContent = cached;
				var target = this.btMirrorMap.get(entries[i]);

				if (target != null)
				{
					this.syncTranslationToForeignObject(entries[i], target);
				}

				reapplied++;
			}
		}

	}

	// Allow observer to process browser translation mutations again
	this.btRebuilding = false;
};

/**
 * Returns a map of original text to translated text from the current mirror.
 * Returns null if no translations are present.
 */
Graph.prototype.getBrowserTranslationCache = function()
{
	if (this.btMirrorContainer == null)
	{
		return null;
	}

	var cache = {};
	var count = 0;
	var spans = this.btMirrorContainer.children;

	for (var i = 0; i < spans.length; i++)
	{
		var origText = spans[i].getAttribute('data-bt-original');
		var curText = spans[i].textContent;

		if (origText != null && curText != origText)
		{
			cache[origText] = curText;
			count++;
		}
	}

	return (count > 0) ? cache : null;
};

/**
 * Applies a translation cache (original text -> translated text) to
 * the current mirror spans and syncs the translations to the SVG.
 */
Graph.prototype.applyBrowserTranslationCache = function(cache)
{
	if (cache == null || this.btMirrorContainer == null)
	{
		return;
	}

	// Store the cache so refreshBrowserTranslateMirror can
	// reapply it after page switches or model changes
	this.btTranslationCache = cache;

	this.btRebuilding = true;
	var entries = this.btMirrorContainer.children;

	for (var i = 0; i < entries.length; i++)
	{
		var origText = entries[i].getAttribute('data-bt-original');
		var cached = (origText != null) ? cache[origText] : null;

		if (cached != null)
		{
			entries[i].textContent = cached;
			var target = this.btMirrorMap.get(entries[i]);

			if (target != null)
			{
				this.syncTranslationToForeignObject(entries[i], target);
			}
		}
	}

	this.btRebuilding = false;
};

/**
 * Cleans up browser translation resources.
 */
Graph.prototype.destroyBrowserTranslate = function()
{
	if (this.btClassObservers != null)
	{
		for (var i = 0; i < this.btClassObservers.length; i++)
		{
			this.btClassObservers[i].disconnect();
		}

		this.btClassObservers = null;
	}

	if (this.btObserver != null)
	{
		this.btObserver.disconnect();
		this.btObserver = null;
	}

	if (this.btMirrorContainer != null && this.btMirrorContainer.parentNode != null)
	{
		this.btMirrorContainer.parentNode.removeChild(this.btMirrorContainer);
		this.btMirrorContainer = null;
	}

	if (this.btMirrorMap != null)
	{
		this.btMirrorMap.clear();
		this.btMirrorMap = null;
	}
};

/**
 * Overrides destroy to clean up browser translation resources.
 */
var graphDestroy = Graph.prototype.destroy;

Graph.prototype.destroy = function()
{
	this.destroyBrowserTranslate();
	graphDestroy.apply(this, arguments);
};

/**
 * Implements zoom and offset via CSS transforms. This is currently only used
 * in read-only as there are fewer issues with the mxCellState not being scaled
 * and translated.
 * 
 * KNOWN ISSUES TO FIX:
 * - Apply CSS transforms to HTML labels in IE11
 */
(function()
{
	/**
	 * Uses CSS transforms for scale and translate.
	 */
	Graph.prototype.useCssTransforms = false;

	/**
	 * Contains the scale.
	 */
	Graph.prototype.currentScale = 1;

	/**
	 * Contains the offset.
	 */
	Graph.prototype.currentTranslate = new mxPoint(0, 0);

	/**
	 * Contains the offset.
	 */
	Graph.prototype.pasteEdgeStyle = false;

	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isFillState = function(state)
	{
		var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

		return !this.isSpecialColor(state.style[mxConstants.STYLE_FILLCOLOR]) &&
			mxUtils.getValue(state.style, 'lineShape', null) != '1' &&
			shape != 'mxgraph.basic.arc' &&
			(this.model.isVertex(state.cell) ||
			shape == 'arrow' || shape == 'pipe' || shape == 'wire' ||
			shape == 'filledEdge' || shape == 'flexArrow' ||
			shape == 'mermaidSankeyLink' ||
			shape == 'mxgraph.arrows2.wedgeArrow');
	};
	
	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isGradientState = function(state)
	{
		var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
		
		return this.isFillState(state) && shape != 'wire' && shape != 'pipe';
	};
	
	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isStrokeState = function(state)
	{
		return true;
	};
		
	/**
	 * Returns the foreground or background color of given node.
	 */
	Graph.prototype.getTextColor = function(node, isForeground)
	{
		var attr = (isForeground) ? 'color' : 'background-color';
		var temp = (node == this.cellEditor.textarea && isForeground) ?
			'default' : Graph.getGivenColor(node, attr);
		var tempNode = node;
		
		while (temp == null && tempNode != null &&
			tempNode != this.cellEditor.textarea.parentNode)
		{
			temp = (tempNode == this.cellEditor.textarea && isForeground) ?
				'default' : Graph.getGivenColor(tempNode, attr);
			tempNode = tempNode.parentNode;
		}

		if (temp == 'rgba(0, 0, 0, 0)' ||
			temp == 'transparent')
		{
			temp = mxConstants.NONE;
		}

		return temp;
	};

	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isSpecialColor = function(color)
	{
		return mxUtils.indexOf([mxConstants.STYLE_STROKECOLOR,
			mxConstants.STYLE_FILLCOLOR, 'inherit', 'swimlane',
			'indicated'], color) >= 0;
	};
	
	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isGlassState = function(state)
	{
		var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

		return (shape == 'label' || shape == 'rectangle' || shape == 'internalStorage' ||
				shape == 'ext' || shape == 'umlLifeline' || shape == 'swimlane' ||
				shape == 'process' || shape == 'ellipse' || shape == 'rhombus');
	};
	
	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isRoundedState = function(state)
	{
		return (state.shape != null) ? state.shape.isRoundable() :
			mxUtils.indexOf(this.roundableShapes, mxUtils.getValue(state.style,
			mxConstants.STYLE_SHAPE, null)) >= 0;
	};
	
	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isLineJumpState = function(state)
	{
		var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
		var curved = mxUtils.getValue(state.style, mxConstants.STYLE_CURVED, false);
		
		return !curved && (shape == 'connector' || shape == 'filledEdge' || shape == 'wire');
	};
	
	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isAutoSizeState = function(state)
	{
		return mxUtils.getValue(state.style, mxConstants.STYLE_AUTOSIZE, null) == '1';
	};

	/**
	 * Returns true if the given state has autosizeText enabled.
	 */
	Graph.prototype.isAutosizeTextState = function(state)
	{
		return mxUtils.getValue(state.style, 'autosizeText', null) == '1';
	};

	/**
	 * Returns true if the given cell has autosizeText enabled.
	 */
	Graph.prototype.isAutosizeTextCell = function(cell)
	{
		var style = this.getCurrentCellStyle(cell);

		return style != null && style['autosizeText'] == '1';
	};

	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isImageState = function(state)
	{
		return mxUtils.getValue(state.style, mxConstants.STYLE_IMAGE, null) != null;
	};
	
	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.isShadowState = function(state)
	{
		return true;
	};
	
	/**
	 * 
	 */
	Graph.prototype.getVerticesAndEdges = function(vertices, edges)
	{
		vertices = (vertices != null) ? vertices : true;
		edges = (edges != null) ? edges : true;
		var model = this.model;
		
		return model.filterDescendants(function(cell)
		{
			return (vertices && model.isVertex(cell)) || (edges && model.isEdge(cell));
		}, model.getRoot());
	};
	
	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.applyNewEdgeStyle = function(source, edges, dir)
	{
		var style = this.getCellStyle(source);
		var temp = style['newEdgeStyle'];
		
		if (temp != null)
		{
			this.model.beginUpdate();
			try
			{
				var styles = Graph.decodeNewEdgeStyle(temp);

				for (var key in styles)
				{
					this.setCellStyles(key, styles[key], edges);
					
					// Sets elbow direction
					if (key == 'edgeStyle' && styles[key] == 'elbowEdgeStyle' && dir != null)
					{
						this.setCellStyles('elbow', (dir == mxConstants.DIRECTION_SOUTH ||
							dir == mxConstants.DIRECTION_NOTH) ? 'vertical' : 'horizontal',
							edges);
					}
				}
			}
			finally
			{
				this.model.endUpdate();
			}
		}
		
		// New self-loops are created in the converted state so they get one
		// handle per segment (see createEdgeHandler). A self-loop is detected
		// by comparing the edge's own terminals — NOT against the source
		// argument, whose role depends on the caller: Trees.js passes the new
		// child (the edge's TARGET) as the newEdgeStyle carrier, which a
		// target-equals-argument check misdetects as a self-loop, stamping
		// loop routing and waypoints from cloneCells' absolute-frame geometry
		// onto every edge added via the tree tools.
		this.model.beginUpdate();
		try
		{
			for (var i = 0; i < edges.length; i++)
			{
				var src = this.model.getTerminal(edges[i], true);

				if (src != null && src == this.model.getTerminal(edges[i], false))
				{
					this.applyLoopStyle(edges[i], src);
				}
			}
		}
		finally
		{
			this.model.endUpdate();
		}
	};

	/**
	 * Applies the orthogonal loop style with inner waypoints to the given
	 * self-loop edge so it gets one handle per segment (outgoing, middle and
	 * incoming). The default waypoints reproduce the side and size of the
	 * legacy loop routing (a small loop on the source's east side).
	 */
	Graph.prototype.applyLoopStyle = function(edge, source)
	{
		var sgeo = this.getCellGeometry(source);
		var geo = this.getCellGeometry(edge);

		if (sgeo != null && geo != null)
		{
			// Loop is large enough that its 5 handles (two terminals, two arms
			// and the middle) are clearly separated and individually grabbable
			var seg = this.gridSize;
			var cx = sgeo.x + sgeo.width + 4 * seg;
			var cy = sgeo.y + sgeo.height / 2;

			geo = geo.clone();
			geo.points = [new mxPoint(cx, cy - 2 * seg), new mxPoint(cx, cy + 2 * seg)];

			this.model.beginUpdate();
			try
			{
				this.model.setGeometry(edge, geo);
				this.setCellStyles(mxConstants.STYLE_EDGE, 'orthogonalEdgeStyle', [edge]);
				this.setCellStyles('innerLoopWaypoints', '1', [edge]);
			}
			finally
			{
				this.model.endUpdate();
			}
		}
	};

	/**
	 * Returns which axis the source terminal's perimeter pins the connection
	 * point to, or null for a regular boundary perimeter. The perimeter is probed
	 * with a point far on each side of the center: a boundary perimeter moves the
	 * anchor across the full width/height when the direction flips, a fixed-line
	 * perimeter keeps it on a line so it barely moves along that axis. Returns 'x'
	 * when the anchor is pinned to the vertical center line (a lifeline spine - so
	 * the loop sits left/right of it), 'y' when pinned to the horizontal center
	 * line (a horizontal backbone - loop sits above/below), else null. Such loops
	 * may overlap the shape because the anchors stay on the line.
	 */
	Graph.prototype.getLoopFixedAxis = function(state)
	{
		var source = (state != null) ? state.getVisibleTerminalState(true) : null;

		if (source == null || source.width == 0 || source.height == 0)
		{
			return null;
		}

		var view = state.view;

		// A shape with no perimeter function (e.g. perimeter=none) makes
		// view.getPerimeterPoint fall back to the shape center for every probe
		// below, which would look like both axes are pinned to a line. Such a
		// shape is a boundary shape (the loop must stay outside it), not a
		// spine/backbone, so report no fixed anchor line.
		if (view.getPerimeterFunction(source) == null)
		{
			return null;
		}

		var cx = source.getCenterX();
		var cy = source.getCenterY();
		var d = Math.max(source.width, source.height) + 100;
		var pe = view.getPerimeterPoint(source, new mxPoint(cx + d, cy), false);
		var pw = view.getPerimeterPoint(source, new mxPoint(cx - d, cy), false);
		var pn = view.getPerimeterPoint(source, new mxPoint(cx, cy - d), false);
		var ps = view.getPerimeterPoint(source, new mxPoint(cx, cy + d), false);

		var fixedX = pe != null && pw != null &&
			Math.abs(pe.x - pw.x) < source.width / 4;
		var fixedY = pn != null && ps != null &&
			Math.abs(pn.y - ps.y) < source.height / 4;

		return fixedX ? 'x' : (fixedY ? 'y' : null);
	};

	/**
	 * Returns true if the source terminal's perimeter pins the connection point
	 * to a fixed internal line (see getLoopFixedAxis).
	 */
	Graph.prototype.loopHasFixedAnchorLine = function(state)
	{
		return this.getLoopFixedAxis(state) != null;
	};

	/**
	 * Returns the two corner waypoints of a self-loop placed so its far (middle)
	 * segment follows the mouse, moving the whole loop around the shape: the loop
	 * jumps to the side nearest the mouse, the far segment sits at the mouse depth
	 * (just outside the shape) and is centered under the mouse along that edge.
	 * The loop width (distance between the arms) is preserved but capped to the
	 * length of that side so the arms stay attached to the edge. Used by the
	 * middle handle only; returns null if the loop is not a simple two-corner
	 * loop.
	 */
	Graph.prototype.getLoopAroundPoints = function(state, point)
	{
		var source = (state != null) ? state.getVisibleTerminalState(true) : null;
		var geo = (state != null) ? this.getCellGeometry(state.cell) : null;

		if (source == null || point == null || geo == null)
		{
			return null;
		}

		var s = state.view.scale;
		var tr = state.view.translate;
		var o = state.origin;
		var bx = source.x / s - tr.x - o.x;
		var by = source.y / s - tr.y - o.y;
		var bw = source.width / s;
		var bh = source.height / s;
		var mp = new mxPoint(point.x / s - tr.x - o.x, point.y / s - tr.y - o.y);

		// Current corners come from the stored waypoints, or - for a loop that is
		// still routed by the default Loop style (no waypoints yet) - from the
		// routed absolute points. Falls back to a small default loop centred on
		// the shape when neither is available (e.g. a center perimeter whose
		// route collapses), so a valid two-corner loop is always produced.
		var c1, c2;
		var pts = state.absolutePoints;

		if (geo.points != null && geo.points.length >= 2)
		{
			c1 = geo.points[0];
			c2 = geo.points[geo.points.length - 1];
		}
		else if (pts != null && pts.length >= 4)
		{
			c1 = new mxPoint(pts[1].x / s - tr.x - o.x, pts[1].y / s - tr.y - o.y);
			c2 = new mxPoint(pts[pts.length - 2].x / s - tr.x - o.x,
				pts[pts.length - 2].y / s - tr.y - o.y);
		}
		else
		{
			c1 = new mxPoint(bx + bw / 2, by + bh / 2 - this.gridSize);
			c2 = new mxPoint(bx + bw / 2, by + bh / 2 + this.gridSize);
		}

		var spreadIsX = Math.abs(c1.x - c2.x) >= Math.abs(c1.y - c2.y);
		var width = Math.max(this.gridSize,
			(spreadIsX) ? Math.abs(c1.x - c2.x) : Math.abs(c1.y - c2.y));
		var minDepth = this.gridSize;

		// Shapes whose perimeter pins the anchor to a fixed internal line (e.g. a
		// lifeline spine, a backbone or a center perimeter) connect the message to
		// that line, so the loop legitimately overlaps the shape. The far segment
		// is then measured from the anchor line, not the shape edge, so dragging
		// the middle handle towards the shape reduces the loop depth and dragging
		// past the line flips the loop to the other side. Boundary perimeters
		// (rectangle, ellipse, ...) connect on the boundary facing the loop and
		// use the regular side-picking below.
		var fixedAnchor = this.loopHasFixedAnchorLine(state);
		var pts0 = state.absolutePoints;
		var anchor = (pts0 != null && pts0[0] != null) ?
			new mxPoint(pts0[0].x / s - tr.x - o.x, pts0[0].y / s - tr.y - o.y) : null;

		if (fixedAnchor && anchor != null)
		{
			// The far segment follows the mouse along the depth axis and flips to
			// the other side of the anchor line when dragged past it (a small
			// dead zone keeps the loop from collapsing onto the anchor line). The
			// cross axis follows the mouse so the loop can also be moved along the
			// shape.
			if (spreadIsX)
			{
				// Top or bottom loop: depth axis is y
				var fy = (mp.y >= anchor.y) ? Math.max(anchor.y + minDepth, mp.y) :
					Math.min(anchor.y - minDepth, mp.y);

				return [new mxPoint(mp.x - width / 2, fy),
					new mxPoint(mp.x + width / 2, fy)];
			}
			else
			{
				// Left or right loop: depth axis is x
				var fx = (mp.x >= anchor.x) ? Math.max(anchor.x + minDepth, mp.x) :
					Math.min(anchor.x - minDepth, mp.x);

				return [new mxPoint(fx, mp.y - width / 2),
					new mxPoint(fx, mp.y + width / 2)];
			}
		}

		// Boundary perimeter: the loop attaches to the actual perimeter point
		// facing the mouse, so the far segment depth is measured from the real
		// outline (not the bounding box) and the loop hugs non-rectangular shapes
		// instead of floating off their bounding-box corners. The arm bases are
		// also pulled in until they project onto a real perimeter point, avoiding
		// the dead zones where some perimeters (e.g. parallelogram) collapse the
		// terminal to the shape centre.
		var cxc = bx + bw / 2;
		var cyc = by + bh / 2;

		var perim = function(px, py, orth)
		{
			var pp = state.view.getPerimeterPoint(source,
				new mxPoint((px + tr.x + o.x) * s, (py + tr.y + o.y) * s), orth);

			return (pp != null) ?
				new mxPoint(pp.x / s - tr.x - o.x, pp.y / s - tr.y - o.y) : null;
		};

		// True when the two arm bases do not project onto two distinct real
		// perimeter points: either one lands on the centre fallback, or both land
		// on (nearly) the same point - both of which render as a collapsed/lopsided
		// loop (e.g. two arms of a flat loop projecting to the same slanted-edge
		// point). Uses the orthogonal projection to match how the terminal point is
		// computed (getFloatingTerminalPoint), so the dead zones match exactly.
		var loopBad = function(ax, ay, bx2, by2)
		{
			var pa = perim(ax, ay, true);
			var pb = perim(bx2, by2, true);

			if (pa == null || pb == null)
			{
				return true;
			}

			if ((Math.abs(pa.x - cxc) < 2 && Math.abs(pa.y - cyc) < 2) ||
				(Math.abs(pb.x - cxc) < 2 && Math.abs(pb.y - cyc) < 2))
			{
				return true;
			}

			return Math.abs(pa.x - pb.x) < minDepth / 2 &&
				Math.abs(pa.y - pb.y) < minDepth / 2;
		};

		// Perimeter point facing the mouse gives the loop side and the depth
		var ap = perim(mp.x, mp.y, false);

		if (ap == null || (Math.abs(ap.x - cxc) < 1 && Math.abs(ap.y - cyc) < 1))
		{
			ap = new mxPoint(cxc, cyc);
		}

		if (Math.abs(ap.y - cyc) >= Math.abs(ap.x - cxc))
		{
			// Top or bottom: arms spread horizontally (never below the gridSize
			// floor, so the two arms cannot coincide on a thin/zero-width shape)
			width = Math.max(this.gridSize, Math.min(width, bw));
			var fy = (ap.y >= cyc) ? Math.max(ap.y + minDepth, mp.y) :
				Math.min(ap.y - minDepth, mp.y);
			var cx = Math.max(bx + width / 2, Math.min(bx + bw - width / 2, mp.x));

			for (var i = 0; i <= bw / this.gridSize && loopBad(cx - width / 2, fy,
				cx + width / 2, fy); i++)
			{
				cx = (cx < cxc) ? Math.min(cxc, cx + this.gridSize) :
					Math.max(cxc, cx - this.gridSize);
			}

			// Then pushes the segment further out until both arm bases clear the
			// outline (a slanted corner can project the terminal to the centre even
			// at the bounding-box edge, so moving outward escapes that dead band)
			var outY = (ap.y >= cyc) ? this.gridSize : -this.gridSize;

			for (var i = 0; i <= (bw + bh) / this.gridSize && loopBad(cx - width / 2, fy,
				cx + width / 2, fy); i++)
			{
				fy += outY;
			}

			return [new mxPoint(cx - width / 2, fy), new mxPoint(cx + width / 2, fy)];
		}
		else
		{
			// Right or left: arms spread vertically (never below the gridSize
			// floor, so the two arms cannot coincide on a thin/zero-height shape)
			width = Math.max(this.gridSize, Math.min(width, bh));
			var fx = (ap.x >= cxc) ? Math.max(ap.x + minDepth, mp.x) :
				Math.min(ap.x - minDepth, mp.x);
			var cy = Math.max(by + width / 2, Math.min(by + bh - width / 2, mp.y));

			for (var i = 0; i <= bh / this.gridSize && loopBad(fx, cy - width / 2,
				fx, cy + width / 2); i++)
			{
				cy = (cy < cyc) ? Math.min(cyc, cy + this.gridSize) :
					Math.max(cyc, cy - this.gridSize);
			}

			// Then pushes the segment further out until both arm bases clear the
			// outline (a slanted corner can project the terminal to the centre even
			// at the bounding-box edge, so moving outward escapes that dead band)
			var outX = (ap.x >= cxc) ? this.gridSize : -this.gridSize;

			for (var i = 0; i <= (bw + bh) / this.gridSize && loopBad(fx, cy - width / 2,
				fx, cy + width / 2); i++)
			{
				fx += outX;
			}

			return [new mxPoint(fx, cy - width / 2), new mxPoint(fx, cy + width / 2)];
		}
	};

	/**
	 * Keeps the waypoints of a self-loop outside its shape so that the terminal
	 * anchors stay on the shape perimeter (the edge the loop sits against)
	 * instead of collapsing to the shape center when a waypoint is dragged into
	 * the shape. The loop's "home" edge is the one its body extends past the
	 * most; any waypoint inside the shape is pushed out to that edge so the
	 * adjacent terminal exits perpendicular to it.
	 */
	Graph.prototype.keepLoopOutsideShape = function(state, points)
	{
		var source = (state != null) ? state.getVisibleTerminalState(true) : null;

		if (source == null || points == null || points.length == 0)
		{
			return points;
		}

		var s = state.view.scale;
		var tr = state.view.translate;
		var o = state.origin;
		var bx = source.x / s - tr.x - o.x;
		var by = source.y / s - tr.y - o.y;
		var bw = source.width / s;
		var bh = source.height / s;

		// Shapes whose perimeter pins the anchor to a fixed internal line (e.g. a
		// lifeline spine) may overlap, so the waypoints are left as-is (the
		// anchors do not collapse to the center). Other shapes keep the loop out.
		if (this.loopHasFixedAnchorLine(state))
		{
			return points;
		}

		var cxc = bx + bw / 2;
		var cyc = by + bh / 2;
		var m = this.gridSize;
		var result = [];

		for (var i = 0; i < points.length; i++)
		{
			var p = points[i];

			if (p == null)
			{
				result.push(p);
				continue;
			}

			var q = new mxPoint(p.x, p.y);

			// A waypoint counts as inside only when it is closer to the centre
			// than the actual perimeter in its direction, so a point in an empty
			// bounding-box corner (triangle, parallelogram, ...) is left alone and
			// the loop can hug the real outline. Inside points are pushed just past
			// the perimeter along their own ray so the adjacent terminal projects
			// to a real perimeter point instead of collapsing to the centre.
			var pp = state.view.getPerimeterPoint(source,
				new mxPoint((p.x + tr.x + o.x) * s, (p.y + tr.y + o.y) * s), false);

			if (pp != null)
			{
				var ppx = pp.x / s - tr.x - o.x;
				var ppy = pp.y / s - tr.y - o.y;
				var ux = p.x - cxc;
				var uy = p.y - cyc;
				var dp = Math.sqrt(ux * ux + uy * uy);
				var dpp = Math.sqrt((ppx - cxc) * (ppx - cxc) + (ppy - cyc) * (ppy - cyc));

				if (dp < dpp - 0.5)
				{
					// Degenerate centre point: push straight down by default
					if (dp < 1)
					{
						ux = 0;
						uy = 1;
						dp = 1;
					}

					q.x = ppx + (ux / dp) * m;
					q.y = ppy + (uy / dp) * m;
				}
			}

			result.push(q);
		}

		return result;
	};

	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.getCommonStyle = function(cells)
	{
		var style = {};
		
		for (var i = 0; i < cells.length; i++)
		{
			var state = this.view.getState(cells[i]);

			if (state != null)
			{
				this.mergeStyle(state.style, style, i == 0);
			}
		}
		
		return style;
	};
	
	/**
	 * Returns information about the current selection.
	 */
	Graph.prototype.mergeStyle = function(style, into, initial)
	{
		if (style != null)
		{
			var keys = {};
			
			for (var key in style)
			{
				var value = style[key];
				
				if (value != null)
				{
					keys[key] = true;
					
					if (into[key] == null && initial)
					{
						into[key] = value;
					}
					else if (into[key] != value)
					{
						delete into[key];
					}
				}
			}
			
			for (var key in into)
			{
				if (!keys[key])
				{
					delete into[key];
				}
			}
		}
	};

	/**
	 * Returns the cell for editing the given cell.
	 */
	Graph.prototype.getStartEditingCell = function(cell, trigger)
	{
		// Redirect editing for tables
		var style = this.getCellStyle(cell);
		var size = parseInt(mxUtils.getValue(style, mxConstants.STYLE_STARTSIZE, 0));
		
		if (this.isTable(cell) && (!this.isSwimlane(cell) ||
			size == 0) && this.getLabel(cell) == '' &&
			this.model.getChildCount(cell) > 0)
		{
			cell = this.model.getChildAt(cell, 0);
			
			style = this.getCellStyle(cell);
			size = parseInt(mxUtils.getValue(style, mxConstants.STYLE_STARTSIZE, 0));
		}
		
		// Redirect editing for table rows
		if (this.isTableRow(cell) && (!this.isSwimlane(cell) ||
			size == 0) && this.getLabel(cell) == '' &&
			this.model.getChildCount(cell) > 0)
		{
			for (var i = 0; i < this.model.getChildCount(cell); i++)
			{
				var temp = this.model.getChildAt(cell, i);
				
				if (this.isCellEditable(temp))
				{
					cell = temp;
					break;
				}
			}
		}
		
		return cell;
	};

	/**
	 * Returns the style of the given cell as an object.
	 */
	Graph.prototype.copyStyle = function(cell)
	{
		return this.getCellStyle(cell, false);
	};

	/**
	 * Returns true if fast zoom preview should be used.
	 */
	Graph.prototype.pasteStyle = function(style, cells, keys, replaceAll)
	{
		if (style != null)
		{
			if (!replaceAll)
			{
				keys = (keys != null) ? keys : Graph.cellStyles;

				Graph.removeKeys(style, function(key)
				{
					return mxUtils.indexOf(keys, key) < 0;
				});
			}

			this.updateCellStyles(style, cells);
		}
	};

	/**
	 * Copies the style of the given cells to the given vertex and edge style.
	 */
	Graph.prototype.copyCellStyles = function(cells, keys, values, vertexStyle, edgeStyle, vertexStyleIgnored, edgeStyleIgnored, edgeLabel)
	{
		var vertex = false;
		var edge = false;
		
		if (cells.length > 0)
		{
			for (var i = 0; i < cells.length; i++)
			{
				vertex = this.getModel().isVertex(cells[i]) || vertex;
				edge = this.getModel().isEdge(cells[i]) || edge;
				
				if (edge && vertex)
				{
					break;
				}
			}
		}
		else
		{
			vertex = true;
			edge = true;
		}

		vertex = vertex && !vertexStyleIgnored;
		edge = edge && !edgeStyleIgnored;

		for (var i = 0; i < keys.length; i++)
		{
			var common = mxUtils.indexOf(Graph.textStyles, keys[i]) >= 0;

			// Ignores transparent stroke colors
			if (keys[i] != 'strokeColor' || (values[i] != null && values[i] != 'none'))
			{
				if (mxUtils.indexOf(Graph.cellStyles, keys[i]) >= 0 || keys[i] == 'shape')
				{
					// Shared text styles also update the vertex default unless it was
					// pinned via setDefaultStyle; edge labels never touch it
					if (keys[i] != 'shape' && (vertex || (common && !vertexStyleIgnored)) && !edgeLabel)
					{
						if (values[i] == null)
						{
							delete vertexStyle[keys[i]];
						}
						else
						{
							vertexStyle[keys[i]] = values[i];
						}
					}

					// Shared text styles also update the edge default unless it was
					// pinned via setDefaultStyle
					if (edge || (common && !edgeStyleIgnored))
					{
						if (values[i] == null)
						{
							delete edgeStyle[keys[i]];
						}
						else
						{
							edgeStyle[keys[i]] = values[i];
						}
					}
				}
			}
		}
	};

	/**
	 * 
	 */
	Graph.prototype.includeDescendants = function(cells)
	{
		var result = [];

		for (var i = 0; i < cells.length; i++)
		{
			result = result.concat(this.model.getDescendants(cells[i]));
		}

		return result;
	};

	/**
	 * Returns the given cells including all descendants that are constituents
	 * of a composite shape (part=1 in the style), as those cannot be styled
	 * independently of their parent.
	 */
	Graph.prototype.includeDescendantParts = function(cells)
	{
		var result = cells.slice();

		var addParts = mxUtils.bind(this, function(cell)
		{
			for (var i = 0; i < this.model.getChildCount(cell); i++)
			{
				var child = this.model.getChildAt(cell, i);

				if (mxUtils.getValue(this.getCurrentCellStyle(child),
					'part', '0') == '1')
				{
					result.push(child);
					addParts(child);
				}
			}
		});

		for (var i = 0; i < cells.length; i++)
		{
			addParts(cells[i]);
		}

		return result;
	};

	/**
	 * 
	 */
	Graph.prototype.pasteCellStyles = function(cells, vertexStyle, edgeStyle, force, pasteEdgeStyle)
	{
		vertexStyle = (vertexStyle != null) ? vertexStyle : this.currentVertexStyle;
		edgeStyle = (edgeStyle != null) ? edgeStyle : this.currentEdgeStyle;
		pasteEdgeStyle = (pasteEdgeStyle != null) ? pasteEdgeStyle : this.pasteEdgeStyle;

		this.model.beginUpdate();
		try
		{
			for (var i = 0; i < cells.length; i++)
			{
				var cell = cells[i];
				var cellStyle = this.model.getStyle(cell);
				var isText = false;
				var appliedStyles;

				// Applies basic text styles for cells with text class
				if (cell.style != null && typeof cell.style === 'string')
				{
					pairs = cell.style.split(';');
					isText = isText || mxUtils.indexOf(pairs, 'text') >= 0;
				}

				// Edge labels (vertex children of edges) only receive text styles and
				// take them from the edge style so they match the edge's own label
				var isEdgeLabel = this.model.isVertex(cell) &&
					this.model.isEdge(this.model.getParent(cell));

				if (isText || isEdgeLabel)
				{
					// Applies only basic text styles
					appliedStyles = Graph.textStyles;
				}
				else
				{
					appliedStyles = Graph.cellStyles.slice();

					if (!force)
					{
						// Removes styles defined in the cell style from the styles to be applied
						var tokens = (typeof cellStyle === 'string') ? cellStyle.split(';') : [];
						
						for (var j = 0; j < tokens.length; j++)
						{
							var tmp = tokens[j];
							var pos = tmp.indexOf('=');
												
							if (pos >= 0)
							{
								var key = tmp.substring(0, pos);
								var index = mxUtils.indexOf(appliedStyles, key);
								
								if (index >= 0)
								{
									appliedStyles.splice(index, 1);
								}
								
								// Handles special cases where one defined style ignores other styles
								for (var k = 0; k < Graph.cellStyleGroups.length; k++)
								{
									var group = Graph.cellStyleGroups[k];
									
									if (mxUtils.indexOf(group, key) >= 0)
									{
										for (var l = 0; l < group.length; l++)
										{
											var index2 = mxUtils.indexOf(appliedStyles, group[l]);
											
											if (index2 >= 0)
											{
												appliedStyles.splice(index2, 1);
											}
										}
									}
								}
							}
						}
					}
				}
				
				// Applies the current style to the cell
				var edge = this.model.isEdge(cell);
				var current = (edge || isEdgeLabel) ? edgeStyle : vertexStyle;

				for (var j = 0; j < appliedStyles.length; j++)
				{
					var key = appliedStyles[j];
					var styleValue = current[key];

					// Edge style is only applied if user assigned a default style using
					// the UI but not if the edge style is globally configured
					if (key != 'edgeStyle' || pasteEdgeStyle)
					{
						// Edge styles are never assigned to vertices
						if (edge || (!edge && mxUtils.indexOf(Graph.edgeStyles, key) < 0))
						{
							if (styleValue != null)
							{
								cellStyle = mxUtils.setStyle(cellStyle, key, styleValue);

								// Removes fontSource if fontFamily is assigned
								if (key == 'fontFamily' && current['fontSource'] == null)
								{
									cellStyle = mxUtils.setStyle(cellStyle, 'fontSource', null);
								}

								// Removes curved for edges if rounded is assigned
								if (edge && key == 'rounded' && styleValue == '1' && current['curved'] == null)
								{
									cellStyle = mxUtils.setStyle(cellStyle, 'curved', null);
								}
							}
							else if (force)
							{
								cellStyle = mxUtils.setStyle(cellStyle, key, null);
							}
						}
					}
				}

				if (Editor.simpleLabels)
				{
					cellStyle = mxUtils.setStyle(mxUtils.setStyle(
						cellStyle, 'html', null), 'whiteSpace', null);
				}
				
				this.model.setStyle(cell, cellStyle);
			}
		}
		finally
		{
			this.model.endUpdate();
		}

		return cells;
	};

	/**
	 * Pastes text styles to the given cells.
	 */
	Graph.prototype.pasteTextStyles = function(cells, textStyle)
	{
		this.model.beginUpdate();
		try
		{
			for (var i = 0; i < cells.length; i++)
			{
				var cell = cells[i];

				if (this.model.isVertex(cell) || this.model.isEdge(cell))
				{
					var cellStyle = this.model.getStyle(cell);

					for (var j = 0; j < Graph.pasteTextStyles.length; j++)
					{
						var key = Graph.pasteTextStyles[j];
						var styleValue = textStyle[key];

						if (styleValue != null)
						{
							cellStyle = mxUtils.setStyle(cellStyle, key, styleValue);

							// Removes fontSource if fontFamily is assigned
							if (key == 'fontFamily' && textStyle['fontSource'] == null)
							{
								cellStyle = mxUtils.setStyle(cellStyle, 'fontSource', null);
							}
						}
					}

					if (Editor.simpleLabels)
					{
						cellStyle = mxUtils.setStyle(mxUtils.setStyle(
							cellStyle, 'html', null), 'whiteSpace', null);
					}

					this.model.setStyle(cell, cellStyle);
				}
			}
		}
		finally
		{
			this.model.endUpdate();
		}

		return cells;
	};

	/**
	 * Removes implicit styles from cell styles so that dark mode works using the
	 * default values from the stylesheet.
	 */
	Graph.prototype.updateCellStyles = function(style, cells)
	{
		this.model.beginUpdate();
		try
		{
			for (var i = 0; i < cells.length; i++)
			{
				if (this.model.isVertex(cells[i]) || this.model.isEdge(cells[i]))
				{
					var cellStyle = this.getCellStyle(cells[i], false);
					var perimeter = cellStyle[mxConstants.STYLE_PERIMETER];
					var restorePerimeter = false;

					for (var key in style)
					{
						var value = style[key];

						if (cellStyle[key] != value)
						{
							// Handles paste of shape to UML lifeline
							if (key == mxConstants.STYLE_SHAPE &&
								cellStyle[key] == 'umlLifeline' &&
								value != 'umlLifeline')
							{
								restorePerimeter = true;
								key = 'participant';
							}

							this.setCellStyles(key, value, [cells[i]]);
						}
					}

					if (restorePerimeter)
					{
						this.setCellStyles(mxConstants.STYLE_PERIMETER, perimeter, [cells[i]]);
					}
				}
			}
		}
		finally
		{
			this.model.endUpdate();
		}
	};

	/**
	 * Returns true if fast zoom preview should be used.
	 */
	Graph.prototype.isFastZoomEnabled = function()
	{
		return urlParams['zoom'] != 'nocss' && !mxClient.NO_FO && !mxClient.IS_EDGE &&
			!this.useCssTransforms && (this.isCssTransformsSupported() || mxClient.IS_IOS);
	};

	/**
	 * Only foreignObject supported for now (no IE11). Safari disabled as it ignores
	 * overflow visible on foreignObject in negative space (lightbox and viewer).
	 * Check the following test case on page 1 before enabling this in production:
	 * https://devhost.jgraph.com/git/drawio/etc/embed/sf-math-fo-clipping.html?dev=1
	 */
	Graph.prototype.isCssTransformsSupported = function()
	{
		return this.dialect == mxConstants.DIALECT_SVG && !mxClient.NO_FO &&
			(!this.lightbox || !mxClient.IS_SF);
	};

	/**
	 * Function: getCellAt
	 * 
	 * Needs to modify original method for recursive call.
	 */
	Graph.prototype.getCellAt = function(x, y, parent, vertices, edges, ignoreFn)
	{
		if (this.useCssTransforms)
		{
			x = x / this.currentScale - this.currentTranslate.x;
			y = y / this.currentScale - this.currentTranslate.y;
		}
		
		return this.getScaledCellAt.apply(this, arguments);
	};

	/**
	 * Function: getScaledCellAt
	 * 
	 * Overridden for recursion.
	 */
	Graph.prototype.getScaledCellAt = function(x, y, parent, vertices, edges, ignoreFn)
	{
		vertices = (vertices != null) ? vertices : true;
		edges = (edges != null) ? edges : true;

		if (parent == null)
		{
			parent = this.getCurrentRoot();
			
			if (parent == null)
			{
				parent = this.getModel().getRoot();
			}
		}

		if (parent != null)
		{
			var childCount = this.model.getChildCount(parent);
			
			for (var i = childCount - 1; i >= 0; i--)
			{
				var cell = this.model.getChildAt(parent, i);
				var result = this.getScaledCellAt(x, y, cell, vertices, edges, ignoreFn);
				
				if (result != null)
				{
					return result;
				}
				else if (this.isCellVisible(cell) && (edges && this.model.isEdge(cell) ||
					vertices && this.model.isVertex(cell)))
				{
					var state = this.view.getState(cell);

					if (state != null && (ignoreFn == null || !ignoreFn(state, x, y)) &&
						this.intersects(state, x, y))
					{
						return cell;
					}
				}
			}
		}
		
		return null;
	};

	/**
	 * Returns if the child cells of the given vertex cell state should be resized.
	 */
	Graph.prototype.isRecursiveVertexResize = function(state)
	{
		return !this.isSwimlane(state.cell) && this.model.getChildCount(state.cell) > 0 &&
			!this.isCellCollapsed(state.cell) && mxUtils.getValue(state.style, 'recursiveResize', '1') == '1' &&
			mxUtils.getValue(state.style, 'childLayout', null) == null;
	}
	
	/**
	 * Returns the first parent with an absolute or no geometry.
	 */
	Graph.prototype.getAbsoluteParent = function(cell)
	{
		var result = cell;
		var geo = this.getCellGeometry(result);
		
		while (geo != null && geo.relative)
		{
			result = this.getModel().getParent(result);
			geo = this.getCellGeometry(result);
		}
		
		return result;
	};
	
	/**
	 * Returns the first parent that is not a part.
	 */
	Graph.prototype.isPart = function(cell)
	{
		return mxUtils.getValue(this.getCurrentCellStyle(cell), 'part', '0') == '1' ||
			this.isTableCell(cell) || this.isTableRow(cell);
	};
	
	/**
	 * Returns the first parent that is not a part.
	 */
	Graph.prototype.getCompositeParents = function(cells)
	{
		var lookup = new mxDictionary();
		var newCells = [];
	
		for (var i = 0; i < cells.length; i++)
		{
			var cell = this.getCompositeParent(cells[i]);

			if (this.isTableCell(cell))
			{
				cell = this.graph.model.getParent(cell);
			}

			if (this.isTableRow(cell))
			{
				cell = this.graph.model.getParent(cell);
			}

			if (cell != null && !lookup.get(cell))
			{
				lookup.put(cell, true);
				newCells.push(cell);
			}
		}

		return newCells;
	};

	/**
	 * Returns the given terminal that is not relative, an edge or a part.
	 */
	Graph.prototype.getReferenceTerminal = function(terminal)
	{
		if (terminal != null)
		{
			var geo = this.getCellGeometry(terminal);

			if (geo != null && geo.relative)
			{
				terminal = this.model.getParent(terminal);
			}
		}

		if (terminal != null && this.model.isEdge(terminal))
		{
			terminal = this.model.getParent(terminal);
		}

		if (terminal != null)
		{
			terminal = this.getCompositeParent(terminal);
		}

		return terminal;
	};

	/**
	 * Returns the first parent that is not a part.
	 */
	Graph.prototype.getCompositeParent = function(cell)
	{
		while (this.isPart(cell))
		{
			var temp = this.model.getParent(cell);
			
			if (!this.model.isVertex(temp))
			{
				break;
			}
			
			cell = temp;
		}
		
		return cell;
	};
	
	/**
	 * Overridden to change the order of the enclosing table for selected
	 * table cells and rows, whose child order defines their column and row
	 * position rather than the paint order. Cells passed in explicitly are
	 * ordered in-place like before.
	 */
	Graph.prototype.orderCells = function(back, cells, increment)
	{
		if (cells == null)
		{
			cells = mxUtils.sortCells(this.getEditableCells(
				this.getSelectionCells()), true);
			var lookup = new mxDictionary();
			var temp = [];

			for (var i = 0; i < cells.length; i++)
			{
				var cell = cells[i];

				while (this.isTableCell(cell) || this.isTableRow(cell))
				{
					cell = this.model.getParent(cell);
				}

				if (!lookup.get(cell))
				{
					lookup.put(cell, true);
					temp.push(cell);
				}
			}

			cells = temp;
		}

		return mxGraph.prototype.orderCells.call(this, back, cells, increment);
	};
	
	/**
	 * Returns the selection cells where the given function returns false.
	 */
	Graph.prototype.filterSelectionCells = function(ignoreFn)
	{
		var cells = this.getSelectionCells();
		
		if (ignoreFn != null)
		{
			var temp = [];
			
			for (var i = 0; i < cells.length; i++)
			{
				if (!ignoreFn(cells[i]))
				{
					temp.push(cells[i]);
				}
			}
			
			cells = temp;
		}
		
		return cells;
	};

	/**
	 * Overrides scrollRectToVisible to fix ignored transform.
	 */
	var graphScrollRectToVisible = mxGraph.prototype.scrollRectToVisible;
	Graph.prototype.scrollRectToVisible = function(r)
	{
		if (this.useCssTransforms)
		{
			var s = this.currentScale;
			var t = this.currentTranslate;
			r = new mxRectangle((r.x + 2 * t.x) * s - t.x,
				(r.y + 2 * t.y) * s - t.y,
				r.width * s, r.height * s);
		}

		graphScrollRectToVisible.apply(this, arguments);
	};

	/**
	 * Function: repaint
	 * 
	 * Updates the highlight after a change of the model or view.
	 */
	mxCellHighlight.prototype.getStrokeWidth = function(state)
	{
		var s = this.strokeWidth;
		
		if (this.graph.useCssTransforms)
		{
			s /= this.graph.currentScale;
		}

		return s;
	};

	/**
	 * Function: getGraphBounds
	 * 
	 * Overrides getGraphBounds to use bounding box from SVG.
	 */
	mxGraphView.prototype.getGraphBounds = function()
	{
		var b = this.graphBounds;
		
		if (this.graph.useCssTransforms)
		{
			var t = this.graph.currentTranslate;
			var s = this.graph.currentScale;

			b = new mxRectangle(
				(b.x + t.x) * s, (b.y + t.y) * s,
				b.width * s, b.height * s);
		}

		return b;
	};
	
	/**
	 * Overrides to bypass full cell tree validation.
	 * TODO: Check if this improves performance
	 */
	mxGraphView.prototype.viewStateChanged = function()
	{
		if (this.graph.useCssTransforms)
		{
			this.validate();
			this.graph.sizeDidChange();
		}
		else
		{
			this.revalidate();
			this.graph.sizeDidChange();
		}
	};

	/**
	 * Overrides validate to normalize validation view state and pass
	 * current state to CSS transform.
	 */
	var graphViewValidate = mxGraphView.prototype.validate;
	mxGraphView.prototype.validate = function(cell)
	{
		if (this.graph.useCssTransforms)
		{
			this.graph.currentScale = this.scale;
			this.graph.currentTranslate.x = this.translate.x;
			this.graph.currentTranslate.y = this.translate.y;
			
			this.scale = 1;
			this.translate.x = 0;
			this.translate.y = 0;
		}
		
		graphViewValidate.apply(this, arguments);
		
		if (this.graph.useCssTransforms)
		{
			this.graph.updateCssTransform();
			
			this.scale = this.graph.currentScale;
			this.translate.x = this.graph.currentTranslate.x;
			this.translate.y = this.graph.currentTranslate.y;
		}
	};

	/**
	 * Overrides function to exclude table cells and rows from groups.
	 */
	var graphGetCellsForGroup = mxGraph.prototype.getCellsForGroup;
	Graph.prototype.getCellsForGroup = function(cells)
	{
		cells = graphGetCellsForGroup.apply(this, arguments);
		var result = [];
		
		// Filters selection cells with the same parent
		for (var i = 0; i < cells.length; i++)
		{
			if (!this.isTableRow(cells[i]) &&
				!this.isTableCell(cells[i]))
			{
				result.push(cells[i]);
			}
		}
		
		return result;
	};
	
	/**
	 * Overrides function to exclude tables, rows and cells from ungrouping.
	 */
	var graphGetCellsForUngroup = mxGraph.prototype.getCellsForUngroup;
	Graph.prototype.getCellsForUngroup = function(cells)
	{
		cells = graphGetCellsForUngroup.apply(this, arguments);
		var result = [];
		
		// Filters selection cells with the same parent
		for (var i = 0; i < cells.length; i++)
		{
			if (!this.isTable(cells[i]) &&
				!this.isTableRow(cells[i]) &&
				!this.isTableCell(cells[i]))
			{
				result.push(cells[i]);
			}
		}
		
		return result;
	};

	/**
	 * Function: updateCssTransform
	 * 
	 * Zooms out of the graph by <zoomFactor>.
	 */
	Graph.prototype.updateCssTransform = function()
	{
		var temp = this.view.getDrawPane();
		
		if (temp != null)
		{
			var g = temp.parentNode;
			
			if (!this.useCssTransforms)
			{
				g.removeAttribute('transformOrigin');
				g.removeAttribute('transform');
			}
			else
			{
				var prev = g.getAttribute('transform');
				g.setAttribute('transformOrigin', '0 0');
				var s = Math.round(this.currentScale * 100) / 100;
				var dx = Math.round(this.currentTranslate.x * 100) / 100;
				var dy = Math.round(this.currentTranslate.y * 100) / 100;

				// A smooth animation step (viewbox with smooth:true) arms a
				// `transition: transform` on this node and sets
				// armTransformTransition so the change below animates. Every
				// other transform update (toolbar zoom/fit, wheel zoom,
				// programmatic fit) finds the flag unset and strips the
				// transition first, so the viewport snaps instantly instead
				// of inheriting the animation's easing.
				if (this.armTransformTransition)
				{
					this.armTransformTransition = false;
				}
				else if (g.style.transition != '')
				{
					g.style.transition = '';
				}

				g.setAttribute('transform', 'scale(' + s + ',' + s + ')' +
					'translate(' + dx + ',' + dy + ')');

				// Applies workarounds only if translate has changed
				if (prev != g.getAttribute('transform'))
				{
					this.fireEvent(new mxEventObject('cssTransformChanged'),
						'transform', g.getAttribute('transform'));
				}
			}
		}
	};
	
	var graphViewValidateBackgroundPage = mxGraphView.prototype.validateBackgroundPage;
	mxGraphView.prototype.validateBackgroundPage = function()
	{
		var useCssTranforms = this.graph.useCssTransforms, scale = this.scale, 
			translate = this.translate;
		
		if (useCssTranforms)
		{
			this.scale = this.graph.currentScale;
			this.translate = this.graph.currentTranslate;
		}
		
		graphViewValidateBackgroundPage.apply(this, arguments);
		
		if (useCssTranforms)
		{
			this.scale = scale;
			this.translate = translate;
		}
	};

	var graphUpdatePageBreaks = mxGraph.prototype.updatePageBreaks;
	mxGraph.prototype.updatePageBreaks = function(visible, width, height)
	{
		var useCssTranforms = this.useCssTransforms, scale = this.view.scale, 
			translate = this.view.translate;
	
		if (useCssTranforms)
		{
			this.view.scale = 1;
			this.view.translate = new mxPoint(0, 0);
			this.useCssTransforms = false;
		}
		
		graphUpdatePageBreaks.apply(this, arguments);
		
		if (useCssTranforms)
		{
			this.view.scale = scale;
			this.view.translate = translate;
			this.useCssTransforms = true;
		}
	};
})();

/**
 * Sets the XML node for the current diagram.
 */
Graph.prototype.isLightboxView = function()
{
	return this.lightbox;
};

/**
 * Sets the XML node for the current diagram.
 */
Graph.prototype.isViewer = function()
{
	return false;
};

/**
 * Installs automatic layout via styles
 */
Graph.prototype.labelLinkClicked = function(state, elt, evt)
{
	var href = elt.getAttribute('href');
	
	// Blocks and removes unsafe links in labels
	if (href != Graph.sanitizeLink(href))
	{
		Graph.sanitizeNode(elt);
	}
	
	if (href != null && !this.isCustomLink(href) && ((mxEvent.isLeftMouseButton(evt) &&
		!mxEvent.isPopupTrigger(evt)) || mxEvent.isTouchEvent(evt)))
	{
		if (!this.isEnabled() || this.isCellLocked(state.cell))
		{
			var target = this.isBlankLink(href) ? this.linkTarget : '_top';
			this.openLink(this.getAbsoluteUrl(href), target);
		}
		
		mxEvent.consume(evt);
	}
};

/**
 * Returns the size of the page format scaled with the page size.
 */
Graph.prototype.openLink = function(href, target, allowOpener)
{
	var result = window;
	
	try
	{
		href = Graph.sanitizeLink(href);

		if (href != null)
		{
			// Workaround for blocking in same iframe
			if (target == '_self' && window != window.top)
			{
				window.location.href = href;
			}
			else
			{
				// Avoids page reload for anchors (workaround for IE but used everywhere)
				if (href.substring(0, this.baseUrl.length) == this.baseUrl &&
					href.charAt(this.baseUrl.length) == '#' &&
					target == '_top' && window == window.top &&
					!navigator.standalone)
				{
					var hash = href.split('#')[1];
		
					// Forces navigation if on same hash
					if (window.location.hash == '#' + hash)
					{
						window.location.hash = '';
					}
					
					window.location.hash = hash;
				}
				else if (!Editor.suppressNewWindows)
				{
					result = window.open(href, (target != null) ?
						target : '_blank', (!allowOpener) ?
						'noopener,noreferrer' : null);

					if (result != null && !allowOpener)
					{
						result.opener = null;
					}
				}
			}
		}
	}
	catch (e)
	{
		// ignores permission denied
	}
	
	return result;
};

/**
 * Adds support for page links.
 */
Graph.prototype.getLinkTitle = function(href)
{
	return href.substring(href.lastIndexOf('/') + 1);
};

/**
 * Adds support for page links.
 */
Graph.prototype.isCustomLink = function(href)
{
	return href.substring(0, 5) == 'data:';
};

/**
 * Adds support for page links.
 */
Graph.prototype.customLinkClicked = function(link, associatedCell)
{
	return false;
};

/**
 * Returns true if the given href references an external protocol that
 * should never open in a new window. Default returns true for mailto.
 */
Graph.prototype.isExternalProtocol = function(href)
{
	return href.substring(0, 7) === 'mailto:';
};

/**
 * Hook for links to open in same window. Default returns true for anchors,
 * links to same domain or if target == 'self' in the config.
 */
Graph.prototype.isBlankLink = function(href)
{
	return !this.isExternalProtocol(href) &&
		(this.linkPolicy === 'blank' ||
		(this.linkPolicy !== 'self' &&
		!this.isRelativeUrl(href) &&
		href.substring(0, this.domainUrl.length) !== this.domainUrl));
};

/**
 * 
 */
Graph.prototype.isRelativeUrl = function(url)
{
	return url != null && !this.absoluteUrlPattern.test(url) &&
		url.substring(0, 5) !== 'data:' &&
		!this.isExternalProtocol(url);
};

/**
 * 
 */
Graph.prototype.getAbsoluteUrl = function(url)
{
	if (url != null && this.isRelativeUrl(url))
	{
		if (url.charAt(0) == '#')
		{
			url = this.baseUrl + url;
		}
		else if (url.charAt(0) == '/')
		{
			url = this.domainUrl + url;
		}
		else
		{
			url = this.domainPathUrl + url;
		}
	}
	
	return url;
};

/**
 * Installs automatic layout via styles
 */
Graph.prototype.initLayoutManager = function()
{
	this.layoutManager = new mxLayoutManager(this);
	
	this.layoutManager.hasLayout = function(cell)
	{
		return this.graph.getCellStyle(cell)['childLayout'] != null;
	};
	
	this.layoutManager.getLayout = function(cell, eventName)
	{
		var parent = this.graph.model.getParent(cell);
		
		// Executes layouts from top to bottom except for nested layouts where
		// child layouts are executed before and after the parent layout runs
		// in case the layout changes the size of the child cell
		if (!this.graph.isCellCollapsed(cell) && (eventName != mxEvent.BEGIN_UPDATE ||
			this.hasLayout(parent, eventName)))
		{
			var style = this.graph.getCellStyle(cell);

			// transparentBounds parents derive their size from their children and
			// must keep geometry pinned at (0,0,0,0); disable any fill or parent
			// resize below so the layout still positions children but never reads
			// or writes the (0,0,0,0) parent geometry (which would collapse the
			// children and corrupt the pin).
			var transparentParent = this.graph.isTransparentBounds(cell);

			if (style['childLayout'] == 'stackLayout')
			{
				var stackLayout = new mxStackLayout(this.graph, true);
				stackLayout.resizeParentMax = !transparentParent && mxUtils.getValue(style, 'resizeParentMax', '1') == '1';
				stackLayout.horizontal = mxUtils.getValue(style, 'horizontalStack', '1') == '1';
				stackLayout.resizeParent = !transparentParent && mxUtils.getValue(style, 'resizeParent', '1') == '1';
				stackLayout.resizeLast = !transparentParent && mxUtils.getValue(style, 'resizeLast', '0') == '1';
				stackLayout.spacing = style['stackSpacing'] || stackLayout.spacing;
				stackLayout.border = style['stackBorder'] || stackLayout.border;
				stackLayout.marginLeft = style['marginLeft'] || 0;
				stackLayout.marginRight = style['marginRight'] || 0;
				stackLayout.marginTop = style['marginTop'] || 0;
				stackLayout.marginBottom = style['marginBottom'] || 0;
				stackLayout.allowGaps = style['allowGaps'] || 0;
				stackLayout.fill = !transparentParent;
				
				if (stackLayout.allowGaps)
				{
					stackLayout.gridSize = parseFloat(mxUtils.getValue(style, 'stackUnitSize', 20));
				}
				
				return stackLayout;
			}
			else if (style['childLayout'] == 'treeLayout')
			{
				var treeLayout = new mxCompactTreeLayout(this.graph);
				treeLayout.horizontal = mxUtils.getValue(style, 'horizontalTree', '1') == '1';
				treeLayout.resizeParent = !transparentParent && mxUtils.getValue(style, 'resizeParent', '1') == '1';
				treeLayout.sortEdges = mxUtils.getValue(style, 'sortEdges', '0') == '1';
				treeLayout.groupPadding = mxUtils.getValue(style, 'parentPadding', 20);
				treeLayout.levelDistance = mxUtils.getValue(style, 'treeLevelDistance', 30);
				treeLayout.maintainParentLocation = true;
				treeLayout.edgeRouting = false;
				treeLayout.resetEdges = false;
				
				return treeLayout;
			}
			else if (style['childLayout'] == 'flowLayout')
			{
				var flowLayout = new mxHierarchicalLayout(this.graph, mxUtils.getValue(style,
					'flowOrientation', mxConstants.DIRECTION_EAST));
				flowLayout.resizeParent = !transparentParent && mxUtils.getValue(style, 'resizeParent', '1') == '1';
				flowLayout.parentBorder = mxUtils.getValue(style, 'parentPadding', 20);
				flowLayout.maintainParentLocation = true;
				
				// Special undocumented styles for changing the hierarchical
				flowLayout.intraCellSpacing = mxUtils.getValue(style, 'intraCellSpacing',
					mxHierarchicalLayout.prototype.intraCellSpacing);
				flowLayout.interRankCellSpacing = mxUtils.getValue(style, 'interRankCellSpacing',
					mxHierarchicalLayout.prototype.interRankCellSpacing);
				flowLayout.interHierarchySpacing = mxUtils.getValue(style, 'interHierarchySpacing',
					mxHierarchicalLayout.prototype.interHierarchySpacing);
				flowLayout.parallelEdgeSpacing = mxUtils.getValue(style, 'parallelEdgeSpacing',
					mxHierarchicalLayout.prototype.parallelEdgeSpacing);
				
				return flowLayout;
			}
			else if (style['childLayout'] == 'circleLayout')
			{
				var circleLayout = new mxCircleLayout(this.graph);
				circleLayout.resizeParent = !transparentParent &&
					mxUtils.getValue(style, 'resizeParent', '1') == '1';

				// Anchors the circle below the title bar (or right of it for
				// sideways swimlane titles) instead of at the parent origin.
				var startSize = parseFloat(mxUtils.getValue(style,
					mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
				startSize = (isNaN(startSize)) ? mxConstants.DEFAULT_STARTSIZE : startSize;
				var sideTitle = mxUtils.getValue(style,
					mxConstants.STYLE_HORIZONTAL, '1') == '0';
				circleLayout.moveCircle = true;
				circleLayout.x0 = (sideTitle) ? startSize + 20 : 20;
				circleLayout.y0 = (sideTitle) ? 20 : startSize + 20;

				// mxCircleLayout has no parent resize — fit the container to
				// the laid-out circle (position untouched) so the circle can't
				// outgrow it, mirroring the other layout containers. The write
				// is skipped when the size is unchanged so repeated manager
				// passes converge.
				var layoutGraph = this.graph;
				var circleExecute = circleLayout.execute;

				circleLayout.execute = function(parent)
				{
					var model = layoutGraph.getModel();

					// Top-left of the parent's current content. For a
					// transparentBounds parent the children carry the absolute
					// position, so the parent-relative x0/y0 frame above would
					// re-plant the ring near the page origin on every run —
					// anchor the result at the content's pre-run top-left
					// instead, like the ELK bridge does for transparent roots.
					var contentMin = function()
					{
						var min = null;
						var count = model.getChildCount(parent);

						for (var i = 0; i < count; i++)
						{
							var child = model.getChildAt(parent, i);
							var geo = (model.isVertex(child)) ?
								model.getGeometry(child) : null;

							if (geo != null && !geo.relative)
							{
								min = (min == null) ? new mxPoint(geo.x, geo.y) :
									new mxPoint(Math.min(min.x, geo.x),
										Math.min(min.y, geo.y));
							}
						}

						return min;
					};

					var pre = (transparentParent) ? contentMin() : null;

					circleExecute.apply(this, arguments);

					if (pre != null)
					{
						var post = contentMin();

						if (post != null && (pre.x != post.x || pre.y != post.y))
						{
							var count = model.getChildCount(parent);

							for (var i = 0; i < count; i++)
							{
								var child = model.getChildAt(parent, i);
								var geo = (model.isVertex(child)) ?
									model.getGeometry(child) : null;

								if (geo != null && !geo.relative)
								{
									layoutGraph.translateCell(child,
										pre.x - post.x, pre.y - post.y);
								}
							}
						}
					}

					var pgeo = model.getGeometry(parent);

					if (this.resizeParent && pgeo != null)
					{
						var w = 0;
						var h = 0;
						var childCount = model.getChildCount(parent);

						for (var i = 0; i < childCount; i++)
						{
							var geo = model.getGeometry(model.getChildAt(parent, i));

							if (geo != null && !geo.relative)
							{
								w = Math.max(w, geo.x + geo.width);
								h = Math.max(h, geo.y + geo.height);
							}
						}

						if (w > 0 && h > 0 && (pgeo.width != w + 20 ||
							pgeo.height != h + 20))
						{
							pgeo = pgeo.clone();
							pgeo.width = w + 20;
							pgeo.height = h + 20;
							model.setGeometry(parent, pgeo);
						}
					}
				};

				return circleLayout;
			}
			else if (style['childLayout'] == 'organicLayout')
			{
				return new mxFastOrganicLayout(this.graph);
			}
			else if (style['childLayout'] == 'tableLayout')
			{
				return new TableLayout(this.graph);
			}
			else if (style['childLayout'] != null)
			{
				// JSON custom-layout array form, URL-encoded when written
				// (raw '[' JSON from older files still decodes) — see
				// Graph.encodeChildLayout / decodeChildLayout. Unknown
				// plain-string values decode to null and fall through.
				try
				{
					var list = Graph.decodeChildLayout(style['childLayout']);

					if (list != null)
					{
						// Manager re-runs treat the spec's corners as a default
						// for edges that never had an explicit rounded/curved
						// choice — a user's sharp/rounded/curved pick on an edge
						// survives ordinary edits instead of being re-stamped on
						// every change. Explicit gestures re-theme all edges via
						// ElkLayout.applyCorners in setContainerChildLayout.
						return new mxCompositeLayout(this.graph,
							this.graph.createLayouts(list,
								{enforceCorners: false}));
					}
				}
				catch (e)
				{
					if (window.console != null)
					{
						console.error(e);
					}
				}
			}
		}

		return null;
	};

	// Prepare-based layouts (ELK, libavoid) don't fit the manager's
	// synchronous pass as-is. When every such member offers executeSync
	// (ELK on the native port), run it here inside the triggering edit —
	// the manager fires from the model's BEFORE_UNDO hook, so the layout
	// writes fold into the same undoable edit like the legacy layouts
	// (single undo step, exactly one run per outermost transaction, no
	// re-trigger thanks to mxGraphModel's endingUpdate latch). Otherwise
	// (engine without a sync API, libavoid's WASM still loading) queue the
	// layout on the async scheduler; see Graph.prototype.scheduleAsyncLayout
	// for the guards that keep change-triggered re-runs from looping.
	this.layoutManager.executeLayout = function(cell, bubble)
	{
		// A change on a cell that is not (or no longer) in the model must not
		// run its layout: pasteCellStyles records style changes on clones
		// BEFORE they are inserted (e.g. the sidebar tooltip preview), so a
		// childLayout container reaches this as a half-constructed, id-less
		// cell tree (ELK's JSON converter throws on the null ids). The insert
		// that follows re-triggers the layout with the cells in the model —
		// same guard the async path has (scheduleAsyncLayout/runAsyncLayout).
		if (!this.graph.model.contains(cell))
		{
			return;
		}

		var layout = this.getLayout(cell, (bubble) ?
			mxEvent.BEGIN_UPDATE : mxEvent.END_UPDATE);

		if (layout != null)
		{
			if (this.graph.isAsyncLayout(layout))
			{
				if (this.graph.canExecuteLayoutSync(layout))
				{
					this.graph.executeLayoutSync(layout, cell);
				}
				else
				{
					this.graph.scheduleAsyncLayout(cell);
				}
			}
			else
			{
				layout.execute(cell);
			}
		}
	};
};

/**
 * Returns true if every prepare-based member of the given (possibly
 * composite) layout can run synchronously right now via executeSync.
 */
Graph.prototype.canExecuteLayoutSync = function(layout)
{
	var layouts = (layout.constructor === mxCompositeLayout &&
		layout.layouts != null) ? layout.layouts : [layout];

	for (var i = 0; i < layouts.length; i++)
	{
		if (typeof layouts[i].prepare === 'function' &&
			(typeof layouts[i].executeSync !== 'function' ||
			(typeof layouts[i].canExecuteSync === 'function' &&
			!layouts[i].canExecuteSync())))
		{
			return false;
		}
	}

	return true;
};

/**
 * Runs the given (possibly composite) layout synchronously, using
 * executeSync for the prepare-based members. Errors are contained per
 * member: this runs inside the model's BEFORE_UNDO dispatch, where a
 * throwing layout would otherwise abort the user's own edit.
 */
Graph.prototype.executeLayoutSync = function(layout, cell)
{
	var layouts = (layout.constructor === mxCompositeLayout &&
		layout.layouts != null) ? layout.layouts : [layout];

	for (var i = 0; i < layouts.length; i++)
	{
		try
		{
			if (typeof layouts[i].prepare === 'function' &&
				typeof layouts[i].executeSync === 'function')
			{
				layouts[i].executeSync(cell);
			}
			else
			{
				layouts[i].execute(cell);
			}
		}
		catch (e)
		{
			if (window.console != null)
			{
				console.error(e);
			}
		}
	}
};

/**
 * Returns true if the given layout (or any member of a composite layout)
 * runs asynchronously via a prepare(parent, callback) contract instead of
 * a synchronous execute (ELK layouts, the libavoid routing adapter).
 */
Graph.prototype.isAsyncLayout = function(layout)
{
	if (layout == null)
	{
		return false;
	}

	if (typeof layout.prepare === 'function')
	{
		return true;
	}

	if (layout.constructor === mxCompositeLayout && layout.layouts != null)
	{
		for (var i = 0; i < layout.layouts.length; i++)
		{
			if (typeof layout.layouts[i].prepare === 'function')
			{
				return true;
			}
		}
	}

	return false;
};

/**
 * Queues an asynchronous childLayout run for the given container — the
 * fallback path for prepare-based layouts that cannot run synchronously
 * inside the triggering edit (see canExecuteLayoutSync): engines without a
 * sync API and libavoid while its WASM loads. Runs are deduplicated per
 * cell, started on the next tick and chained sequentially, children before
 * parents. While a run is in flight further changes to the container mark
 * it dirty and trigger exactly one follow-up run.
 *
 * Loop protection: the container's own apply writes are ignored via
 * asyncLayoutsApplying, so a run cannot re-trigger itself directly. Indirect
 * cycles (e.g. nested async containers re-triggering each other) terminate
 * because the async layouts skip value-equal writes — an unchanged result
 * produces an empty model edit, which the layout manager never sees.
 */
Graph.prototype.scheduleAsyncLayout = function(cell)
{
	if (cell == null || this.destroyed)
	{
		return;
	}

	if (this.asyncLayoutsApplying != null &&
		this.asyncLayoutsApplying[cell.id])
	{
		return;
	}

	if (this.asyncLayoutsRunning != null &&
		this.asyncLayoutsRunning[cell.id] != null)
	{
		this.asyncLayoutsRunning[cell.id] = 'dirty';

		return;
	}

	this.pendingAsyncLayouts = this.pendingAsyncLayouts || [];

	if (mxUtils.indexOf(this.pendingAsyncLayouts, cell) < 0)
	{
		this.pendingAsyncLayouts.push(cell);
	}

	if (!this.asyncLayoutsScheduled)
	{
		this.asyncLayoutsScheduled = true;

		window.setTimeout(mxUtils.bind(this, function()
		{
			this.asyncLayoutsScheduled = false;
			var pending = this.pendingAsyncLayouts;
			this.pendingAsyncLayouts = [];

			// Children before parents so an outer container's layout sees
			// the final size of the inner containers it lays out.
			var depth = function(cell)
			{
				var d = 0;

				while (cell != null)
				{
					d++;
					cell = cell.parent;
				}

				return d;
			};

			pending.sort(function(a, b)
			{
				return depth(b) - depth(a);
			});

			var idx = 0;

			var next = mxUtils.bind(this, function()
			{
				if (idx < pending.length)
				{
					this.runAsyncLayout(pending[idx++], next);
				}
			});

			next();
		}), 0);
	}
};

/**
 * Runs the async childLayout of the given container and invokes done when
 * finished. Composite layouts run their members sequentially; synchronous
 * members execute inline between the async ones. Skips containers that were
 * removed from the model, collapsed, or whose style no longer resolves to
 * an async layout while queued.
 */
Graph.prototype.runAsyncLayout = function(cell, done)
{
	var model = this.getModel();
	done = (done != null) ? done : function() { };

	if (this.destroyed || this.layoutManager == null ||
		!model.contains(cell) || this.isCellCollapsed(cell))
	{
		done();

		return;
	}

	var layout = this.layoutManager.getLayout(cell, mxEvent.END_UPDATE);

	if (layout == null || !this.isAsyncLayout(layout))
	{
		done();

		return;
	}

	var layouts = (layout.constructor === mxCompositeLayout &&
		layout.layouts != null) ? layout.layouts : [layout];

	this.asyncLayoutsRunning = this.asyncLayoutsRunning || {};
	this.asyncLayoutsRunning[cell.id] = 'running';
	this.asyncLayoutsApplying = this.asyncLayoutsApplying || {};

	var graph = this;
	var i = 0;

	// Marks the container so its own writes don't re-schedule it (the
	// layout manager reacts to the apply transaction like to any other
	// change), then folds the changes into a single undoable edit.
	var applyGuarded = function(fn)
	{
		graph.asyncLayoutsApplying[cell.id] = true;
		model.beginUpdate();
		try
		{
			fn();
		}
		finally
		{
			model.endUpdate();
			delete graph.asyncLayoutsApplying[cell.id];
		}
	};

	var finish = function()
	{
		var rerun = graph.asyncLayoutsRunning[cell.id] == 'dirty';
		delete graph.asyncLayoutsRunning[cell.id];

		if (rerun)
		{
			graph.scheduleAsyncLayout(cell);
		}

		done();
	};

	var next = function()
	{
		if (i >= layouts.length || graph.destroyed || !model.contains(cell))
		{
			finish();

			return;
		}

		var current = layouts[i++];

		try
		{
			if (typeof current.prepare === 'function')
			{
				current.prepare(cell, function(err, apply)
				{
					if (err == null && apply != null &&
						!graph.destroyed && model.contains(cell))
					{
						try
						{
							applyGuarded(apply);
						}
						catch (e)
						{
							if (window.console != null)
							{
								console.error(e);
							}
						}
					}
					else if (err != null && window.console != null)
					{
						console.error(err);
					}

					next();
				});
			}
			else
			{
				applyGuarded(function()
				{
					current.execute(cell);
				});

				next();
			}
		}
		catch (e)
		{
			if (window.console != null)
			{
				console.error(e);
			}

			next();
		}
	};

	next();
};

/**
 * Serializes a custom-layout array (see createLayouts) into the childLayout
 * style value. URL-encoded (like fontSource) so that no ';' or '=' from the
 * JSON can corrupt the key=value; parsing of the cell style — a ';' inside
 * the raw JSON would terminate the childLayout key.
 */
Graph.encodeChildLayout = function(list)
{
	return encodeURIComponent(JSON.stringify(list));
};

/**
 * Returns the custom-layout array for a childLayout style value in the JSON
 * form, or null for the legacy string values (stackLayout, circleLayout, …).
 * Accepts the URL-encoded form written by encodeChildLayout as well as the
 * raw '[' JSON written before the encoding existed (files saved by older
 * versions must keep their live layouts). Throws on malformed input like
 * JSON.parse — callers handle it like any invalid childLayout.
 */
Graph.decodeChildLayout = function(value)
{
	if (value != null)
	{
		value = String(value);

		if (value.charAt(0) == '%')
		{
			value = decodeURIComponent(value);
		}

		if (value.charAt(0) == '[')
		{
			return JSON.parse(value);
		}
	}

	return null;
};

/**
 * Returns the style object for a newEdgeStyle style value, or null for a
 * null value. Accepts the URL-encoded form (like childLayout/fontSource, so
 * that no ';' or '=' from the JSON can corrupt the key=value; parsing of the
 * cell style) as well as the raw '{' JSON. Throws on malformed input like
 * JSON.parse — callers handle it like any invalid newEdgeStyle.
 */
Graph.decodeNewEdgeStyle = function(value)
{
	if (value != null)
	{
		value = String(value);

		if (value.charAt(0) == '%')
		{
			value = decodeURIComponent(value);
		}

		return JSON.parse(value);
	}

	return null;
};

/**
 * Creates an array of graph layouts from the given array of the form [{layout: name, config: obj}, ...]
 * where name is the layout constructor name and config contains the properties of the layout instance.
 *
 * For ELK layouts (elkLayered / elkTree / elkRadial / elkOrganic / elkStress /
 * elkDisco / elkBox) the config is split: keys starting with `elk.` are
 * forwarded as ELK layout options; bare keys (edgeStyle, corners, resizeNodes,
 * preserveOrigin, rootCellIds, useViewStateSizing, respectFixedPosition,
 * mermaidPolicy, sharedStems) are mapped to the ElkLayout constructor's
 * `options` argument. The optional elkOptions argument overrides those
 * options per call site (the layout manager passes enforceCorners=false so
 * childLayout re-runs don't clobber per-edge corner choices) — it never
 * touches non-ELK layouts.
 */
Graph.prototype.createLayouts = function(list, elkOptions)
{
	var layouts = [];

	for (var i = 0; i < list.length; i++)
	{
		var layoutName = list[i].layout;
		var config = list[i].config;

		if (Graph.elkLayoutAlgorithms[layoutName] != null)
		{
			if (typeof ElkLayout === 'undefined')
			{
				throw Error(mxResources.get('invalidCallFnNotFound', [layoutName]));
			}

			var split = Graph.elkConfigToOptions(config);

			if (elkOptions != null)
			{
				for (var key in elkOptions)
				{
					split.options[key] = elkOptions[key];
				}
			}

			layouts.push(new ElkLayout(this,
				Graph.elkLayoutAlgorithms[layoutName],
				split.layoutOptions, split.options));
		}
		else if (typeof LibavoidRouting !== 'undefined' &&
			layoutName === LibavoidRouting.LAYOUT_NAME)
		{
			// libavoid orthogonal edge routing — not an mxGraphLayout; an async
			// prepare() adapter (the WASM router may still be loading), like ELK.
			layouts.push(LibavoidRouting.createLayout(this, config));
		}
		else if (mxUtils.indexOf(Graph.layoutNames, layoutName) >= 0)
		{
			// Handles special case of branch optimizer in orgchart
			var layout = (layoutName == 'mxOrgChartLayout' && config != null) ?
				new window[layoutName](this, config['branchOptimizer']) :
				new window[layoutName](this);

			if (config != null)
			{
				for (var key in config)
				{
					// Never overwrite a layout METHOD (execute, moveCell,
					// resizeCell, …): config values are scalar tuning
					// parameters, so a key whose current value is a function
					// can only be a spec author clobbering the layout — and a
					// broken execute would then throw out of the manager's
					// BEFORE_UNDO dispatch on every edit, silently killing the
					// container's undo history. Also skips the orgchart branch
					// optimizer (handled above).
					if (typeof layout[key] !== 'function' &&
						(layoutName != 'mxOrgChartLayout' ||
						key != 'branchOptimizer'))
					{
						layout[key] = config[key];
					}
				}
			}

			layouts.push(layout);
		}
		else
		{
			throw Error(mxResources.get('invalidCallFnNotFound', [layoutName]));
		}
	}

	return layouts;
};

/**
 * Splits a JSON `config` object for an ELK layout into the two argument
 * shapes the ElkLayout constructor expects:
 *
 *   layoutOptions — every key starting with `elk.` (forwarded verbatim to ELK)
 *   options       — bare keys recognized by the bridge:
 *       edgeStyle    → edgeStyleMode
 *       corners      → corners
 *       resizeNodes  → applierOptions.resizeParent
 *       preserveOrigin / rootCellIds / useViewStateSizing /
 *       respectFixedPosition / mermaidPolicy / sharedStems
 *       (mrtree stem collapse, default true) / groupPadding
 *       (container padding base, number or CSS-style string) → passed through
 *
 * Unknown bare keys are ignored. The function is exported on Graph so the
 * custom layout dialog's Add dropdown can use the inverse mapping when it
 * captures a dialog config and writes it to JSON.
 */
Graph.elkConfigToOptions = function(config)
{
	var layoutOptions = {};
	var options = {};

	if (config != null)
	{
		for (var key in config)
		{
			if (key.indexOf('elk.') === 0)
			{
				layoutOptions[key] = config[key];
			}
			else if (key === 'edgeStyle')
			{
				options.edgeStyleMode = config[key];
			}
			else if (key === 'corners')
			{
				options.corners = config[key];
			}
			else if (key === 'resizeNodes')
			{
				options.applierOptions = options.applierOptions || {};
				options.applierOptions.resizeParent = !!config[key];
			}
			else if (key === 'preserveOrigin' || key === 'useViewStateSizing' ||
				key === 'respectFixedPosition' || key === 'mermaidPolicy' ||
				key === 'includeEdgeLabels' || key === 'includeVertexLabels' ||
				key === 'portSpread' || key === 'resizeLayoutRoot' ||
				key === 'extractIsolated' || key === 'sharedStems' ||
				key === 'groupPadding')
			{
				options[key] = config[key];
			}
			else if (key === 'rootCellIds')
			{
				options.rootCellIds = config[key];
			}
		}
	}

	return {layoutOptions: layoutOptions, options: options};
};

/**
 * Inverse of elkConfigToOptions: takes the (layoutOptions, runOptions) pair
 * built by the ELK config dialog and produces a flat `config` object suitable
 * for the custom-layout JSON. Only fields that actually deviate from defaults
 * are written, so saved JSON stays compact.
 */
Graph.elkOptionsToConfig = function(layoutOptions, runOptions)
{
	var config = {};

	if (layoutOptions != null)
	{
		for (var key in layoutOptions)
		{
			config[key] = layoutOptions[key];
		}
	}

	if (runOptions != null)
	{
		if (runOptions.edgeStyleMode != null && runOptions.edgeStyleMode !== 'auto')
		{
			config.edgeStyle = runOptions.edgeStyleMode;
		}

		if (runOptions.corners != null && runOptions.corners !== 'keep')
		{
			config.corners = runOptions.corners;
		}

		// An explicit resizeParent must be preserved in both states: the
		// applier default (no applierOptions) is resize-ON, so omitting an
		// explicit false would flip the replayed behavior (and with it the
		// includeVertexLabels coupling — see the ElkLayout constructor).
		if (runOptions.applierOptions != null && runOptions.applierOptions.resizeParent != null)
		{
			config.resizeNodes = runOptions.applierOptions.resizeParent === true;
		}

		if (runOptions.preserveOrigin === false)
		{
			config.preserveOrigin = false;
		}

		// Default true (mrtree collapses sibling stems onto the parent's
		// side center) — only the opt-out deviates and needs persisting.
		if (runOptions.sharedStems === false)
		{
			config.sharedStems = false;
		}

		// Container padding base (number or CSS-style 'top right bottom
		// left' string) — null means the bridge's built-in defaults.
		if (runOptions.groupPadding != null)
		{
			config.groupPadding = runOptions.groupPadding;
		}

		if (runOptions.rootCellIds != null && runOptions.rootCellIds.length > 0)
		{
			config.rootCellIds = runOptions.rootCellIds.slice();
		}
	}

	return config;
};

/**
 * Returns the metadata of the given cells as a JSON object. The value with
 * resolved placeholders for the label is included if includeValues is true.
 */
Graph.prototype.getDataForCells = function(cells, includeValues)
{
	var result = [];

	for (var i = 0; i < cells.length; i++)
	{
		var row = {};
		row.id = cells[i].id;
		var attrs = (cells[i].value != null) ? cells[i].value.attributes : null;

		if (this.isReplacePlaceholders(cells[i]) && includeValues)
		{
			row.value = this.getLabel(cells[i]);
		}

		if (attrs != null)
		{
			for (var j = 0; j < attrs.length; j++)
			{
				row[attrs[j].nodeName] = attrs[j].nodeValue;
			}
		}
		else
		{
			row.label = this.convertValueToString(cells[i]);
		}

		result.push(row);
	}

	return result;
};

/**
 * Returns the DOM nodes for the given cells.
 */
Graph.prototype.getNodesForCells = function(cells)
{
	var nodes = [];
	
	for (var i = 0; i < cells.length; i++)
	{
		var state = this.view.getState(cells[i]);
		
		if (state != null)
		{
			var shapes = this.cellRenderer.getShapesForState(state);
			
			for (var j = 0; j < shapes.length; j++)
			{
				if (shapes[j] != null && shapes[j].node != null)
				{
					nodes.push(shapes[j].node);
				}
			}
			
			// Adds folding icon
			if (state.control != null && state.control.node != null)
			{
				nodes.push(state.control.node);
			}
		}
	}
	
	return nodes;
};

/**
 * Creates animations for the given cells.
 */
 Graph.prototype.createWipeAnimations = function(cells, wipeIn)
 {
	var animations = [];
	
	for (var i = 0; i < cells.length; i++)
	{
		var state = this.view.getState(cells[i]);

		if (state != null && state.shape != null)
		{
			// TODO: include descendants
			if (this.model.isEdge(state.cell) &&
				state.absolutePoints != null &&
				state.absolutePoints.length > 1)
			{
				animations.push(this.createEdgeWipeAnimation(state, wipeIn));
			}
			else if (this.model.isVertex(state.cell) &&
				state.shape.bounds != null)
			{
				animations.push(this.createVertexWipeAnimation(state, wipeIn));
			}
		}
	}

	return animations;
};

/**
 * Creates an object to show the given edge cell state.
 */
Graph.prototype.createEdgeWipeAnimation = function(state, wipeIn)
{
	var pts = state.absolutePoints.slice();
	var segs = state.segments;
	var total = state.length;
	var n = pts.length;
 
	return {
		execute: mxUtils.bind(this, function(step, steps)
		{
			if (state.shape != null)
			{
				var pts2 = [pts[0]];
				var f = step / steps;

				if (!wipeIn)
				{
					f = 1 - f;
				}

				var dist = total * f;

				for (var i = 1; i < n; i++)
				{
					if (dist <= segs[i - 1])
					{
						pts2.push(new mxPoint(pts[i - 1].x + (pts[i].x - pts[i - 1].x) * dist / segs[i - 1],
							pts[i - 1].y + (pts[i].y - pts[i - 1].y) * dist / segs[i - 1]));
						 
						break;
					}
					else
					{
						dist -= segs[i - 1];
						pts2.push(pts[i]);
					}
				}
			
				state.shape.points = pts2;
				state.shape.redraw();

				if (step == 0)
				{
					Graph.setOpacityForNodes(this.getNodesForCells([state.cell]), 1);
				}

				if (state.text != null && state.text.node != null)
				{
					state.text.node.style.opacity = f;
				}
			}
		}),
		stop: mxUtils.bind(this, function()
		{
			if (state.shape != null)
			{
				state.shape.points = pts;
				state.shape.redraw();

				if (state.text != null && state.text.node != null)
				{
					state.text.node.style.opacity = ''
				}

				Graph.setOpacityForNodes(this.getNodesForCells([state.cell]), (wipeIn) ? 1 : 0);
			}
		})
	};
};
  
 /**
  * Creates an object to show the given vertex cell state.
  */
Graph.prototype.createVertexWipeAnimation = function(state, wipeIn)
{
	var bds = new mxRectangle.fromRectangle(state.shape.bounds);

	return {
		execute: mxUtils.bind(this, function(step, steps)
		{
			if (state.shape != null)
			{
				var f = step / steps;

				if (!wipeIn)
				{
					f = 1 - f;
				}

				state.shape.bounds = new mxRectangle(bds.x, bds.y, bds.width * f, bds.height);
				state.shape.redraw();

				if (step == 0)
				{
					Graph.setOpacityForNodes(this.getNodesForCells([state.cell]), 1);
				}

				if (state.text != null && state.text.node != null)
				{
					state.text.node.style.opacity = f;
				}
			}
		}),
		stop: mxUtils.bind(this, function()
		{
			if (state.shape != null)
			{
				state.shape.bounds = bds;
				state.shape.redraw();
			
				if (state.text != null && state.text.node != null)
				{
					state.text.node.style.opacity = ''
				}

				Graph.setOpacityForNodes(this.getNodesForCells([state.cell]), (wipeIn) ? 1 : 0);
			}
		})
	};
};

/**
 * Creates a popup animation for the given vertex cell state using a
 * damped spring that overshoots and oscillates around scale 1.0.
 * The popIn parameter controls direction (true = appear, false = disappear).
 */
Graph.prototype.createVertexPopAnimation = function(state, popIn)
{
	var bds = new mxRectangle.fromRectangle(state.shape.bounds);
	var cx = bds.getCenterX();
	var cy = bds.getCenterY();

	return {
		execute: mxUtils.bind(this, function(step, steps)
		{
			if (state.shape != null)
			{
				var t = step / steps;

				if (!popIn)
				{
					t = 1 - t;
				}

				// Damped spring: s = 1 - e^(-5t) * cos(5*PI*t)
				var s = 1 - Math.exp(-5 * t) * Math.cos(5 * Math.PI * t);

				state.shape.bounds = new mxRectangle(
					cx - bds.width * s / 2,
					cy - bds.height * s / 2,
					bds.width * s,
					bds.height * s);
				state.shape.redraw();

				if (step == 0)
				{
					Graph.setOpacityForNodes(
						this.getNodesForCells([state.cell]), 1);
				}

				if (state.text != null && state.text.node != null)
				{
					state.text.node.style.opacity = Math.min(1, t * 3);
				}
			}
		}),
		stop: mxUtils.bind(this, function()
		{
			if (state.shape != null)
			{
				state.shape.bounds = bds;
				state.shape.redraw();

				if (state.text != null && state.text.node != null)
				{
					state.text.node.style.opacity = '';
				}

				Graph.setOpacityForNodes(
					this.getNodesForCells([state.cell]),
					(popIn) ? 1 : 0);
			}
		})
	};
};

/**
 * Creates pop animations for the given cells. Vertices use the elastic
 * pop effect, edges use the existing wipe animation.
 */
Graph.prototype.createPopAnimations = function(cells, popIn)
{
	var animations = [];

	for (var i = 0; i < cells.length; i++)
	{
		var state = this.view.getState(cells[i]);

		if (state != null && state.shape != null)
		{
			if (this.model.isEdge(state.cell) &&
				state.absolutePoints != null &&
				state.absolutePoints.length > 1)
			{
				animations.push(this.createEdgeWipeAnimation(state, popIn));
			}
			else if (this.model.isVertex(state.cell) &&
				state.shape.bounds != null)
			{
				animations.push(this.createVertexPopAnimation(state, popIn));
			}
		}
	}

	return animations;
};

/**
 * Runs the animations for the given cells.
 */
 Graph.prototype.executeAnimations = function(animations, done, steps, delay)
 {
	steps = (steps != null) ? steps : 30;
	delay = (delay != null) ? delay : 30;
	var thread = null;
	var step = 0;
	
	var animate = mxUtils.bind(this, function()
	{
		if (step == steps || this.stoppingCustomActions)
		{
			window.clearInterval(thread);
			
			for (var i = 0; i < animations.length; i++)
			{
				animations[i].stop();
			}

			if (done != null)
			{
				done();
			}
		}
		else
		{
			for (var i = 0; i < animations.length; i++)
			{
				animations[i].execute(step, steps);
			}
		}

		step++;
	});
	
	thread = window.setInterval(animate, delay);
	animate();
};

/**
 * Runs the animations step by step with a callback for each frame,
 * allowing async frame capture (e.g. for animated export).
 */
Graph.prototype.executeAnimationsStepped = function(animations, steps, frameCallback, doneCallback)
{
	steps = (steps != null) ? steps : 30;
	var step = 0;

	var nextFrame = mxUtils.bind(this, function()
	{
		if (step <= steps)
		{
			for (var i = 0; i < animations.length; i++)
			{
				animations[i].execute(step, steps);
			}

			frameCallback(step, steps, function()
			{
				step++;
				nextFrame();
			});
		}
		else
		{
			for (var i = 0; i < animations.length; i++)
			{
				animations[i].stop();
			}

			if (doneCallback != null)
			{
				doneCallback();
			}
		}
	});

	nextFrame();
};

/**
 * Returns the size of the page format scaled with the page size.
 */
Graph.prototype.getPageSize = function()
{
	return (this.pageVisible && this.pageFormat != null) ?
		new mxRectangle(0, 0, this.pageFormat.width * this.pageScale,
			this.pageFormat.height * this.pageScale) : this.scrollTileSize;
};

/**
 * Returns a rectangle describing the position and count of the
 * background pages, where x and y are the position of the top,
 * left page and width and height are the vertical and horizontal
 * page count.
 */
Graph.prototype.getPageLayout = function(bounds, tr, s)
{
	bounds = (bounds != null) ? bounds : this.getGraphBounds();
	tr = (tr != null) ? tr : this.view.translate;
	s = (s != null) ? s : this.view.scale;
	var size = this.getPageSize();

	if (bounds.width == 0 || bounds.height == 0)
	{
		return new mxRectangle(0, 0, 1, 1);
	}
	else
	{
		var x0 = Math.floor(Math.ceil(bounds.x / s - tr.x) / size.width);
		var y0 = Math.floor(Math.ceil(bounds.y / s - tr.y) / size.height);
		var w0 = Math.ceil((Math.floor((bounds.x + bounds.width) /
			s) - tr.x) / size.width) - x0;
		var h0 = Math.ceil((Math.floor((bounds.y + bounds.height) /
			s) - tr.y) / size.height) - y0;

		return new mxRectangle(x0, y0, w0, h0);
	}
};

/**
 * Returns the default view translation for the given page layout.
 */
Graph.prototype.getDefaultTranslate = function(pageLayout)
{
	var pad = this.getPagePadding();
	var size = this.getPageSize();
	
	return new mxPoint(pad.x - pageLayout.x * size.width,
		pad.y - pageLayout.y * size.height);
};

/**
 * Updates the minimum graph size
 */
Graph.prototype.updateMinimumSize = function()
{
	var pageLayout = this.getPageLayout();
	var pad = this.getPagePadding();
	var size = this.getPageSize();
	
	var minw = Math.ceil(2 * pad.x + pageLayout.width * size.width);
	var minh = Math.ceil(2 * pad.y + pageLayout.height * size.height);
	
	if (this.minimumGraphSize == null ||
		this.minimumGraphSize.width != minw ||
		this.minimumGraphSize.height != minh)
	{
		this.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
	}
};

/**
 * Sanitizes the given HTML markup.
 */
Graph.prototype.sanitizeHtml = function(value, editing)
{
	return Graph.sanitizeHtml(value, editing);
};

/**
 * Revalidates all cells with placeholders in the current graph model.
 */
Graph.prototype.updatePlaceholders = function()
{
	var validate = false;
	
	for (var key in this.model.cells)
	{
		var cell = this.model.cells[key];
		
		if (this.isReplacePlaceholders(cell))
		{
			this.view.invalidate(cell, false, false);
			validate = true;
		}
	}
	
	if (validate)
	{
		this.view.validate();
	}
};

/**
 * Adds support for placeholders in labels.
 */
Graph.prototype.isReplacePlaceholders = function(cell)
{
	return cell.value != null && typeof(cell.value) == 'object' &&
		cell.value.getAttribute('placeholders') == '1';
};

/**
 * Returns true if the given mouse wheel event should be used for zooming. This
 * is invoked if no dialogs are showing and returns true with Alt or Control
 * (or cmd in macOS only) is pressed.
 */
Graph.prototype.isZoomWheelEvent = function(evt)
{
	return (Graph.zoomWheel && !mxEvent.isShiftDown(evt) && !mxEvent.isMetaDown(evt) &&
		!mxEvent.isAltDown(evt) && (!mxEvent.isControlDown(evt) || mxClient.IS_MAC)) ||
		(!Graph.zoomWheel && (mxEvent.isAltDown(evt) || mxEvent.isControlDown(evt)));
};

/**
 * Returns true if the given scroll wheel event should be used for scrolling.
 */
Graph.prototype.isScrollWheelEvent = function(evt)
{
	return !this.isZoomWheelEvent(evt);
};

/**
 * Adds Alt+click to select cells behind cells (Shift+Click on Chrome OS).
 */
Graph.prototype.isTransparentClickEvent = function(evt)
{
	return mxEvent.isAltDown(evt) || (mxClient.IS_CHROMEOS && mxEvent.isShiftDown(evt));
};

/**
 * Adds ctrl+shift+connect to disable connections.
 */
Graph.prototype.isIgnoreTerminalEvent = function(evt)
{
	return mxEvent.isAltDown(evt) && !mxEvent.isShiftDown(evt) &&
		!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt);
};

/**
 * Returns true if the given edge should be ignored.
 */
Graph.prototype.isEdgeIgnored = function(cell)
{
	var result = false;
	
	if (cell != null)
	{
		var style = this.getCurrentCellStyle(cell);

		result = mxUtils.getValue(style, 'ignoreEdge', '0') == '1';
	}
	
	return result;
};

/**
 * Adds support for placeholders in labels.
 */
Graph.prototype.isSplitTarget = function(target, cells, evt)
{
	return !this.model.isEdge(cells[0]) &&
		!mxEvent.isAltDown(evt) && !mxEvent.isShiftDown(evt) &&
		!this.isCellLocked(this.getLayerForCell(target)) &&
		mxGraph.prototype.isSplitTarget.apply(this, arguments);
};

/**
 * Adds support for placeholders in labels.
 */
Graph.prototype.getLabel = function(cell)
{
	var result = mxGraph.prototype.getLabel.apply(this, arguments);
	
	if (result != null && this.isReplacePlaceholders(cell) && cell.getAttribute('placeholder') == null)
	{
		result = this.replacePlaceholders(cell, result);
	}
	
	return result;
};

/**
 * Adds labelMovable style.
 */
Graph.prototype.isLabelMovable = function(cell)
{
	var style = this.getCurrentCellStyle(cell);
	
	return !this.isCellLocked(cell) &&
		((this.model.isEdge(cell) && this.edgeLabelsMovable) ||
		(this.model.isVertex(cell) && (this.vertexLabelsMovable ||
		mxUtils.getValue(style, 'labelMovable', '0') == '1')));
};

/**
 * Adds event if grid size is changed.
 */
Graph.prototype.setGridSize = function(value)
{
	this.gridSize = value;
	this.fireEvent(new mxEventObject('gridSizeChanged'));
};

/**
 * Adds event if default parent is changed.
 */
Graph.prototype.setDefaultParent = function(cell)
{
	this.defaultParent = cell;
	this.fireEvent(new mxEventObject('defaultParentChanged'));
};

/**
 * Function: getClickableLinkForCell
 * 
 * Returns the first non-null link for the cell or its ancestors.
 * 
 * Parameters:
 * 
 * cell - <mxCell> whose link should be returned.
 */
Graph.prototype.getClickableLinkForCell = function(cell)
{
	do
	{
		var link = this.getLinkForCell(cell);
		
		if (link != null)
		{
			return link;
		}
		
		cell = this.model.getParent(cell);
	} while (cell != null);
	
	return null;
};

/**
 * Private helper method.
 */
Graph.prototype.getGlobalVariable = function(name)
{
	var val = null;
	
	if (name == 'date')
	{
		val = new Date().toLocaleDateString();
	}
	else if (name == 'time')
	{
		val = new Date().toLocaleTimeString();
	}
	else if (name == 'timestamp')
	{
		val = new Date().toLocaleString();
	}
	else if (name.substring(0, 5) == 'date{')
	{
		var fmt = name.substring(5, name.length - 1);
		val = this.formatDate(new Date(), fmt);
	}

	return val;
};

/**
 * Formats a date, see http://blog.stevenlevithan.com/archives/date-time-format
 */
Graph.prototype.formatDate = function(date, mask, utc)
{
	// LATER: Cache regexs
	if (this.dateFormatCache == null)
	{
		this.dateFormatCache = {
			i18n: {
			    dayNames: [
			        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			    ],
			    monthNames: [
			        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
			        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
			    ]
			},
			
			masks: {
			    "default":      "ddd mmm dd yyyy HH:MM:ss",
			    shortDate:      "m/d/yy",
			    mediumDate:     "mmm d, yyyy",
			    longDate:       "mmmm d, yyyy",
			    fullDate:       "dddd, mmmm d, yyyy",
			    shortTime:      "h:MM TT",
			    mediumTime:     "h:MM:ss TT",
			    longTime:       "h:MM:ss TT Z",
			    isoDate:        "yyyy-mm-dd",
			    isoTime:        "HH:MM:ss",
			    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
			    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
			}
		};
	}
    
    var dF = this.dateFormatCache;
	var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    	timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    	timezoneClip = /[^-+\dA-Z]/g,
    	pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
        mask = date;
        date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
        mask = mask.slice(4);
        utc = true;
    }

    var _ = utc ? "getUTC" : "get",
        d = date[_ + "Date"](),
        D = date[_ + "Day"](),
        m = date[_ + "Month"](),
        y = date[_ + "FullYear"](),
        H = date[_ + "Hours"](),
        M = date[_ + "Minutes"](),
        s = date[_ + "Seconds"](),
        L = date[_ + "Milliseconds"](),
        o = utc ? 0 : date.getTimezoneOffset(),
        flags = {
            d:    d,
            dd:   pad(d),
            ddd:  dF.i18n.dayNames[D],
            dddd: dF.i18n.dayNames[D + 7],
            m:    m + 1,
            mm:   pad(m + 1),
            mmm:  dF.i18n.monthNames[m],
            mmmm: dF.i18n.monthNames[m + 12],
            yy:   String(y).slice(2),
            yyyy: y,
            h:    H % 12 || 12,
            hh:   pad(H % 12 || 12),
            H:    H,
            HH:   pad(H),
            M:    M,
            MM:   pad(M),
            s:    s,
            ss:   pad(s),
            l:    pad(L, 3),
            L:    pad(L > 99 ? Math.round(L / 10) : L),
            t:    H < 12 ? "a"  : "p",
            tt:   H < 12 ? "am" : "pm",
            T:    H < 12 ? "A"  : "P",
            TT:   H < 12 ? "AM" : "PM",
            Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };

    return mask.replace(token, function ($0)
    {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
};

/**
 * 
 */
Graph.prototype.getLayerForCell = function(cell)
{
	while (cell != null && !this.model.isLayer(cell))
	{
		cell = this.model.getParent(cell);
	}

	return cell;
};

/**
 * 
 */
Graph.prototype.getLayerForCells = function(cells)
{
	var result = null;
	
	if (cells.length > 0)
	{
		result = this.getLayerForCell(cells[0]);
		
		for (var i = 1; i < cells.length; i++)
		{
			if (!this.model.isAncestor(result, cells[i]))
			{
				result = null;
				break;
			}
		}
	}
		
	return result;
};

/**
 * 
 */
Graph.prototype.createLayersDialog = function(onchange, inverted)
{
	var div = document.createElement('div');
	div.style.position = 'absolute';
	
	var model = this.getModel();
	var childCount = model.getChildCount(model.root);
	
	for (var i = 0; i < childCount; i++)
	{
		(mxUtils.bind(this, function(layer)
		{
			var title = this.convertValueToString(layer) ||
				(mxResources.get('background') || 'Background');

			var span = document.createElement('div');
			span.style.overflow = 'hidden';
			span.style.textOverflow = 'ellipsis';
			span.style.padding = '2px';
			span.style.whiteSpace = 'nowrap';
			span.style.cursor = 'pointer';
			span.setAttribute('title', mxResources.get(
				model.isVisible(layer) ?
				'hideIt' : 'show', [title]));

			var inp = document.createElement('img');
			inp.setAttribute('draggable', 'false');
			inp.setAttribute('align', 'absmiddle');
			inp.setAttribute('border', '0');
			inp.style.position = 'relative';
			inp.style.width = '16px';
			inp.style.padding = '0px 6px 0 4px';

			if (inverted)
			{
				inp.style.filter = 'invert(100%)';
				inp.style.top = '-2px';
			}

			span.appendChild(inp);
			
			mxUtils.write(span, title);
			div.appendChild(span);

			function update()
			{
				if (model.isVisible(layer))
				{
					inp.setAttribute('src', Editor.visibleImage);
					mxUtils.setOpacity(span, 75);
				}
				else
				{
					inp.setAttribute('src', Editor.hiddenImage);
					mxUtils.setOpacity(span, 25);
				}
			};
			
			mxEvent.addListener(span, 'click', function()
			{
				model.setVisible(layer, !model.isVisible(layer));
				update();

				if (onchange != null)
				{
					onchange(layer);
				}
			});

			update();
		})(model.getChildAt(model.root, i)));
	}
	
	return div;
};

/**
 * Private helper method.
 */
Graph.prototype.replacePlaceholders = function(cell, str, vars, translate)
{
	var result = [];
	
	if (str != null)
	{
		var match = null;
		var last = 0;
		
		while (match = this.placeholderPattern.exec(str))
		{
			var val = match[0];
			
			if (val.length > 2 && val != '%label%' && val != '%tooltip%')
			{
				var tmp = null;
	
				if (match.index > last && str.charAt(match.index - 1) == '%')
				{
					tmp = val.substring(1);
				}
				else
				{
					var name = val.substring(1, val.length - 1);
					var units = {'mm': mxConstants.MILLIMETERS,
						'in': mxConstants.INCHES,
						'm': mxConstants.METERS,
						'current': this.view.unit};
					
					// Workaround for invalid char for getting attribute in older versions of IE
					if (name == 'id')
					{
						tmp = cell.id;
					}
					else if (name.substring(0, 5) === 'width' && this.model.isVertex(cell))
					{
						var geo = this.getCellGeometry(cell);

						if (geo != null)
						{
							tmp = geo.width;

							if (name.length > 5)
							{
								tmp = Editor.toUnit(tmp, units[name.substring(6)]);
							}
						}
					}
					else if (name.substring(0, 6) == 'height' && this.model.isVertex(cell))
					{
						var geo = this.getCellGeometry(cell);

						if (geo != null)
						{
							tmp = geo.height;

							if (name.length > 6)
							{
								tmp = Editor.toUnit(tmp, units[name.substring(7)]);
							}
						}
					}
					else if (name.substring(0, 6) == 'length')
					{
						// Gets ancestor edge
						var edge = cell;

						while (edge != null && !this.model.isEdge(edge))
						{
							edge = this.model.getParent(edge);
						}

						var state = this.view.getState(edge);

						if (state != null)
						{
							tmp = Math.round(state.length / this.view.scale);

							if (name.length > 6)
							{
								tmp = Editor.toUnit(tmp, units[name.substring(7)]);
							}
						}
					}
					else if (name.indexOf('{') < 0)
					{
						var current = cell;
						
						while (tmp == null && current != null)
						{
							if (current.value != null && typeof(current.value) == 'object')
							{
								if (Graph.translateDiagram && Graph.diagramLanguage != null)
								{
									tmp = current.getAttribute(name + '_' + Graph.diagramLanguage);
								}
								
								if (tmp == null)
								{
									tmp = (current.hasAttribute(name)) ? ((current.getAttribute(name) != null) ?
										current.getAttribute(name) : '') : null;
								}
							}
							
							current = this.model.getParent(current);
						}
					}
					
					if (tmp == null)
					{
						if ((name.substring(0, 9) == 'pagecount' && name.length > 9) ||
							name.substring(0, 10) == 'pagenumber' && name.length > 10)
						{
							var matches = name.match(/(pagecount|pagenumber)[\s]*([+-])[\s]*(\d+)/);

							if (matches != null)
							{
								tmp = this.getGlobalVariable(matches[1]);

								if (matches.length > 3)
								{
									var num = parseInt(matches[3]);
									tmp += ((matches[2] == '+') ? num : -num);
								}
							}
						}
						else
						{
							tmp = this.getGlobalVariable(name);
						}
					}
					
					if (tmp == null && vars != null)
					{
						tmp = vars[name];
					}
				}
	
				result.push(str.substring(last, match.index) + ((tmp != null) ? tmp : val));
				last = match.index + val.length;
			}
		}
		
		result.push(str.substring(last));
	}

	return result.join('');
};

/**
 * Resolves the given cells in the model and selects them.
 */
Graph.prototype.restoreSelection = function(cells)
{
	if (cells != null && cells.length > 0)
	{
		var temp = [];

		for (var i = 0; i < cells.length; i++)
		{
			var newCell = this.model.getCell(cells[i].id);

			if (newCell != null)
			{
				temp.push(newCell);
			}
		}

		this.setSelectionCells(temp);
	}
	else
	{
		this.clearSelection();
	}
};

/**
 * Returns true if the given cell has the lockedGroup=1 style (active lock).
 */
Graph.prototype.isLockedGroup = function(cell)
{
	return cell != null && mxUtils.getValue(
		this.getCurrentCellStyle(cell), 'lockedGroup', '0') == '1';
};

/**
 * Returns true if the cell has the lockedGroup style key (either '0' or '1').
 * Used to decide whether double-clicks inside the group should route to the
 * mermaid editor.
 */
Graph.prototype.hasLockedGroupStyle = function(cell)
{
	return cell != null && this.getCurrentCellStyle(cell)['lockedGroup'] != null;
};

/**
 * Returns true if the lock-toggle handle should be rendered for the cell.
 * lockedGroupIcon=0 hides the icon, lockedGroupIcon=1 forces it to show, and
 * undefined falls back to the lockedGroup style being defined.
 */
Graph.prototype.isLockedGroupIconVisible = function(cell)
{
	if (cell == null)
	{
		return false;
	}

	var override = this.getCurrentCellStyle(cell)['lockedGroupIcon'];

	if (override == '0')
	{
		return false;
	}

	if (override == '1')
	{
		return true;
	}

	return this.hasLockedGroupStyle(cell);
};

/**
 * Returns true if the edit-icon handle should be rendered for the cell.
 */
Graph.prototype.isEditIconVisible = function(cell)
{
	return cell != null && mxUtils.getValue(
		this.getCurrentCellStyle(cell), 'editIcon', '0') == '1';
};

/**
 * Returns the nearest ancestor (including cell) with lockedGroup=1, or null.
 */
Graph.prototype.getLockedGroupAncestor = function(cell)
{
	while (cell != null)
	{
		if (this.isLockedGroup(cell))
		{
			return cell;
		}

		cell = this.model.getParent(cell);
	}

	return null;
};

/**
 * Returns the nearest ancestor (including cell) with any lockedGroup style
 * (locked or unlocked), or null.
 */
Graph.prototype.getLockedGroupStyleAncestor = function(cell)
{
	while (cell != null)
	{
		if (this.hasLockedGroupStyle(cell))
		{
			return cell;
		}

		cell = this.model.getParent(cell);
	}

	return null;
};

/**
 * Adds table range selection with Shift+Click. Redirects clicks on descendants
 * of locked groups to the locked ancestor so the group is selected as a unit.
 */
Graph.prototype.selectCellForEvent = function(cell, evt)
{
	var anc = this.getLockedGroupAncestor(this.model.getParent(cell));

	if (anc != null)
	{
		cell = anc;
	}

	// Click cycle through a transparentBounds chain. isPropagateSelectionCell
	// stops the upward walk at a transparentBounds boundary, so for a child in
	// a regular group in a transparentBounds group the cycle is:
	//   1. group (first non-transparentBounds ancestor of the click)
	//   2. child (propagation now stops at child because group is selected)
	//   3. outer transparentBounds parent (propagation walks up past child)
	// The drill-down step (selected is a strict ancestor of cell) keeps cell
	// as-is; the escalate step (cell is at-or-above selected with a
	// transparentBounds parent above it) walks one level out.
	//
	// Edges escalate on this step too, so a single click on an already-selected
	// edge walks out to its transparentBounds parent, consistent with a shape.
	// The escalate also fires on the second click of a double-click, but that no
	// longer drops the edge-label insert (the reason the earlier !isEdge guard
	// existed): selecting the parent is a selection-only change, so the view
	// keeps the edge's cached state and shape node (only handlers are rebuilt,
	// cell states are not). firstClickState/firstClickSource (recorded in
	// Graph.click from the cached hit-test, not the live selection) therefore
	// still match in insertTextForEvent, and addText positions the label from
	// the same cached state, so the label is inserted on the native dblclick.
	if (cell != null &&
		!this.isToggleEvent(evt) && this.getSelectionCount() == 1)
	{
		var selected = this.getSelectionCell();

		if (selected != null &&
			(selected == cell || this.model.isAncestor(cell, selected)))
		{
			var parent = this.model.getParent(cell);

			if (parent != null && this.isTransparentBounds(parent))
			{
				cell = parent;
			}
		}
	}

	if (!mxEvent.isShiftDown(evt) || this.isSelectionEmpty() ||
		!this.selectTableRange(this.getSelectionCell(), cell))
	{
		mxGraph.prototype.selectCellForEvent.apply(this, [cell, evt]);
	}
};

/**
 * Returns true if 
 */
Graph.prototype.selectTableRange = function(startCell, endCell)
{
	var result = false;

	if (this.isTableCell(startCell) && this.isTableCell(endCell))
	{
		var startRow = this.model.getParent(startCell);
		var table = this.model.getParent(startRow);
		var endRow = this.model.getParent(endCell);

		if (table == this.model.getParent(endRow))
		{
			var startCellIndex = startRow.getIndex(startCell);
			var startRowIndex = table.getIndex(startRow);
			var endCellIndex = endRow.getIndex(endCell);
			var endRowIndex = table.getIndex(endRow);

			var fromRow = Math.min(startRowIndex, endRowIndex);
			var toRow = Math.max(startRowIndex, endRowIndex);
			var fromCell = Math.min(startCellIndex, endCellIndex);
			var toCell = Math.max(startCellIndex, endCellIndex);
			
			var cells = [];

			for (var row = fromRow; row <= toRow; row++)
			{
				var currentRow = this.model.getChildAt(table, row);
				
				for (var col = fromCell; col <= toCell; col++)
				{
					cells.push(this.model.getChildAt(currentRow, col));
				}
			}

			if (cells.length > 0 && (cells.length > 1 ||
				this.getSelectionCount() > 1 ||
				!this.isCellSelected(cells[0])))
			{
				this.setSelectionCells(cells);
				result = true;
			}
		}
	}

	return result;
};

/**
 * Returns the cells for the given table range.
 */
Graph.prototype.snapCellsToGrid = function(cells, gridSize)
{
	this.getModel().beginUpdate();
	try
	{
		for (var i = 0; i < cells.length; i++)
		{
			var cell = cells[i];
			var geo = this.getCellGeometry(cell);

			if (geo != null)
			{
				geo = geo.clone();

				if (this.getModel().isVertex(cell))
				{
					geo.x = Math.round(geo.x / gridSize) * gridSize;
					geo.y = Math.round(geo.y / gridSize) * gridSize;
					geo.width = Math.round(geo.width / gridSize) * gridSize;
					geo.height = Math.round(geo.height / gridSize) * gridSize;
				}
				else if (this.getModel().isEdge(cell) && geo.points != null)
				{
					for (var j = 0; j < geo.points.length; j++)
					{
						geo.points[j].x = Math.round(geo.points[j].x / gridSize) * gridSize;
						geo.points[j].y = Math.round(geo.points[j].y / gridSize) * gridSize;
					}
				}

				this.getModel().setGeometry(cell, geo);
			}
		}
	}
	finally
	{
		this.getModel().endUpdate();
	}
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Graph.prototype.removeChildCells = function(cell)
{
	this.model.beginUpdate();
	try
	{
		var childCount = this.model.getChildCount(cell);
		
		for (var j = childCount; j >= 0; j--)
		{
			this.model.remove(this.model.getChildAt(cell, j));
		}
	}
	finally
	{
		this.model.endUpdate();
	}
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Graph.prototype.updateShapes = function(source, targets, replaceStyles)
{
	this.model.beginUpdate();
	try
	{
		var sourceStyle = this.model.getStyle(source);
		var style = (replaceStyles) ? this.stylesheet.getCellStyle(sourceStyle, {}, false) : null;

		// Handles special case of default shape
		if (style != null && style[mxConstants.STYLE_SHAPE] == null)
		{
			if (this.model.isVertex(source))
			{
				style[mxConstants.STYLE_SHAPE] = this.stylesheet.
					getDefaultVertexStyle()[mxConstants.STYLE_SHAPE];

			}
			else if (this.model.isEdge(source))
			{
				style[mxConstants.STYLE_SHAPE] = this.stylesheet.
					getDefaultEdgeStyle()[mxConstants.STYLE_SHAPE];
			}
		}

		// Replaces target styles and removes composite childs
		for (var i = 0; i < targets.length; i++)
		{
			if ((this.model.isVertex(source) && this.model.isVertex(targets[i])) ||
				this.model.isEdge(source) && this.model.isEdge(targets[i]))
			{
				if (replaceStyles)
				{
					// Removes style classes
					var cellStyle = this.model.getStyle(targets[i]);

					if (typeof cellStyle === 'string')
					{
						var tokens = cellStyle.split(';');

						if (tokens.length > 0 && tokens[0].indexOf('=') < 0)
						{
							tokens = tokens.slice(1);
						}

						this.model.setStyle(targets[i], tokens.join(';'));
					}

					// Removes perimeter and points styles
					this.setCellStyles(mxConstants.STYLE_PERIMETER, null, [targets[i]]);
					this.setCellStyles('points', null, [targets[i]]);
					this.pasteStyle(style, [targets[i]], null, true);
				}
				else
				{
					style = this.copyStyle(targets[i]);
					this.model.setStyle(targets[i], sourceStyle);
					this.pasteStyle(style, [targets[i]]);
				}
			}
			
			if (mxUtils.getValue(this.getCellStyle(targets[i],
				false), 'composite', '0') == '1')
			{
				this.removeChildCells(targets[i]);
			}
		}
	}
	finally
	{
		this.model.endUpdate();
	}
};

/**
 * Selects cells for connect vertex return value.
 */
Graph.prototype.selectCellsForConnectVertex = function(cells, evt, hoverIcons)
{
	// Selects only target vertex if one exists
	if (cells.length == 2 && this.model.isVertex(cells[1]))
	{
		this.setSelectionCell(cells[1]);
		this.scrollCellToVisible(cells[1]);
		
		if (hoverIcons != null)
		{
			// Adds hover icons for cloned vertex or hides icons
			if (mxEvent.isTouchEvent(evt))
			{
				hoverIcons.update(hoverIcons.getState(this.view.getState(cells[1])));
			}
			else
			{
				hoverIcons.reset();
			}
		}
	}
	else
	{
		this.setSelectionCells(cells);
	}
};

/**
 * Never connects children in stack layouts or tables.
 */
Graph.prototype.isCloneConnectSource = function(source)
{
	var layout = null;

	if (this.layoutManager != null)
	{
		layout = this.layoutManager.getLayout(this.model.getParent(source));
	}
	
	return this.isTableRow(source) || this.isTableCell(source) ||
		(layout != null && layout.constructor == mxStackLayout);
};

/**
 * Inserts the given edge before the given cell.
 */
Graph.prototype.insertEdgeBeforeCell = function(edge, cell)
{
	var index = null;
	var tmp = cell;
	
	while (tmp.parent != null && tmp.geometry != null &&
		tmp.geometry.relative && tmp.parent != edge.parent)
	{
		tmp = this.model.getParent(tmp);
	}

	if (tmp != null && tmp.parent != null && tmp.parent == edge.parent)
	{
		var index = tmp.parent.getIndex(tmp);
		this.model.add(tmp.parent, edge, index);
	}
};

/**
 * Adds a connection to the given vertex or clones the vertex in special layout
 * containers without creating a connection.
 */
Graph.prototype.connectVertex = function(source, direction, length, evt, forceClone, ignoreCellAt, createTarget, done)
{	
	ignoreCellAt = (ignoreCellAt) ? ignoreCellAt : false;
	
	// Ignores relative edge labels
	if (source.geometry.relative && this.model.isEdge(source.parent))
	{
		return [];
	}
	
	// Uses parent for relative child cells
	while (source.geometry.relative && this.model.isVertex(source.parent))
	{
		source = source.parent;
	}
	
	// Handles clone connect sources
	var cloneSource = this.isCloneConnectSource(source);
	var composite = (cloneSource) ? source : this.getCompositeParent(source);
	
	var pt = (source.geometry.relative && source.parent.geometry != null) ?
		new mxPoint(source.parent.geometry.width * source.geometry.x,
			source.parent.geometry.height * source.geometry.y) :
		new mxPoint(composite.geometry.x, composite.geometry.y);
		
	if (direction == mxConstants.DIRECTION_NORTH)
	{
		pt.x += composite.geometry.width / 2;
		pt.y -= length ;
	}
	else if (direction == mxConstants.DIRECTION_SOUTH)
	{
		pt.x += composite.geometry.width / 2;
		pt.y += composite.geometry.height + length;
	}
	else if (direction == mxConstants.DIRECTION_WEST)
	{
		pt.x -= length;
		pt.y += composite.geometry.height / 2;
	}
	else
	{
		pt.x += composite.geometry.width + length;
		pt.y += composite.geometry.height / 2;
	}

	var parentState = this.view.getState(this.model.getParent(source));
	var s = this.view.scale;
	var t = this.view.translate;
	var dx = t.x * s;
	var dy = t.y * s;
	
	if (parentState != null && this.model.isVertex(parentState.cell))
	{
		dx = parentState.x;
		dy = parentState.y;
	}

	// Workaround for relative child cells
	if (this.model.isVertex(source.parent) && source.geometry.relative)
	{
		pt.x += source.parent.geometry.x;
		pt.y += source.parent.geometry.y;
	}
	
	// Checks end point for target cell and container
	var rect = (!ignoreCellAt) ? new mxRectangle(dx + pt.x * s, dy + pt.y * s).grow(40 * s) : null;
	var tempCells = (rect != null) ? this.getCells(0, 0, 0, 0, null, null, rect, null, true) : null;
	var sourceState = this.view.getState(source);
	var container = null;
	var target = null;
	
	if (tempCells != null)
	{
		tempCells = tempCells.reverse();
		
		for (var i = 0; i < tempCells.length; i++)
		{
			if (!this.isCellLocked(tempCells[i]) && !this.model.isEdge(tempCells[i]) && tempCells[i] != source)
			{
				// Direct parent overrides all possible containers
				if (!this.model.isAncestor(source, tempCells[i]) && this.isContainer(tempCells[i]) &&
					(container == null || tempCells[i] == this.model.getParent(source)))
				{
					container = tempCells[i];
				}
				// Containers are used as target cells but swimlanes are used as parents
				else if (target == null && this.isCellConnectable(tempCells[i]) &&
					!this.model.isAncestor(tempCells[i], source) &&
					!this.isSwimlane(tempCells[i]))
				{
					var targetState = this.view.getState(tempCells[i]);
					
					if (sourceState != null && targetState != null && !mxUtils.intersects(sourceState, targetState))
					{
						target = tempCells[i];
					}
				}
			}
		}
	}

	var duplicate = (!mxEvent.isShiftDown(evt) || mxEvent.isControlDown(evt)) || forceClone;
	
	if (duplicate && (urlParams['sketch'] != '1' || forceClone))
	{
		if (direction == mxConstants.DIRECTION_NORTH)
		{
			pt.y -= source.geometry.height / 2;
		}
		else if (direction == mxConstants.DIRECTION_SOUTH)
		{
			pt.y += source.geometry.height / 2;
		}
		else if (direction == mxConstants.DIRECTION_WEST)
		{
			pt.x -= source.geometry.width / 2;
		}
		else
		{
			pt.x += source.geometry.width / 2;
		}
	}

	var result = [];
	var realTarget = target;
	target = container;
	
	var execute = mxUtils.bind(this, function(targetCell)
	{
		if (createTarget == null || targetCell != null || (target == null && cloneSource))
		{
			this.model.beginUpdate();
			try
			{
				if (realTarget == null && duplicate)
				{
					// Handles relative and composite cells
					var cellToClone = this.getAbsoluteParent((targetCell != null) ? targetCell : source);
					cellToClone =  (cloneSource) ? source : this.getCompositeParent(cellToClone);
					realTarget = (targetCell != null) ? targetCell : this.duplicateCells([cellToClone], false)[0];
					
					if (targetCell != null)
					{
						this.addCells([realTarget], this.model.getParent(source), null, null, null, true);
					}
					
					var geo = this.getCellGeometry(realTarget);
	
					if (geo != null)
					{
						if (targetCell != null && urlParams['sketch'] == '1')
						{
							if (direction == mxConstants.DIRECTION_NORTH)
							{
								pt.y -= geo.height / 2;
							}
							else if (direction == mxConstants.DIRECTION_SOUTH)
							{
								pt.y += geo.height / 2;
							}
							else if (direction == mxConstants.DIRECTION_WEST)
							{
								pt.x -= geo.width / 2;
							}
							else
							{
								pt.x += geo.width / 2;
							}
						}
		
						geo.x = pt.x - geo.width / 2;
						geo.y = pt.y - geo.height / 2;
					}
					
					if (container != null)
					{
						this.addCells([realTarget], container, null, null, null, true);
						target = null;
					}
					else if (duplicate && !cloneSource)
					{
						this.addCells([realTarget], this.getDefaultParent(), null, null, null, true);
					}
				}
				
				var edge = ((mxEvent.isControlDown(evt) && mxEvent.isShiftDown(evt) && duplicate) ||
					(target == null && cloneSource)) ? null : this.insertEdge(this.model.getParent(source),
						null, '', source, realTarget, this.createCurrentEdgeStyle());
		
				if (edge != null)
				{
					result.push(edge);
					this.applyNewEdgeStyle(source, [edge], direction);
					
					if (this.connectionHandler.insertBeforeSource)
					{
						this.insertEdgeBeforeCell(edge, source);
					}
				}
				
				// Special case: Click on west icon puts clone before cell
				if (target == null && realTarget != null && source.parent != null &&
					cloneSource && direction == mxConstants.DIRECTION_WEST)
				{
					var index = source.parent.getIndex(source);
					this.model.add(source.parent, realTarget, index);
				}
				
				if (target == null && realTarget != null)
				{
					result.push(realTarget);
				}
				
				if (realTarget == null && edge != null)
				{
					edge.geometry.setTerminalPoint(pt, false);
				}
				
				if (edge != null)
				{
					this.fireEvent(new mxEventObject('cellsInserted', 'cells', [edge]));
				}
			}
			finally
			{
				this.model.endUpdate();
			}
		}
			
		if (done != null)
		{
			done(result);
		}
		else
		{
			return result;
		}
	});
	
	if (createTarget != null && realTarget == null && duplicate &&
		(target != null || !cloneSource))
	{
		createTarget(dx + pt.x * s, dy + pt.y * s, execute);
	}
	else
	{
		return execute(realTarget);
	}
};

/**
 * Returns all labels in the diagram as a string.
 */
Graph.prototype.getIndexableText = function(cells)
{
	cells = (cells != null) ? cells : this.model.
		getDescendants(this.model.root);
	var tmp = document.createElement('div');
	var labels = [];
	var label = '';
	
	for (var i = 0; i < cells.length; i++)
	{
		var cell = cells[i];
		
		if (this.model.isVertex(cell) || this.model.isEdge(cell))
		{
			if (this.isHtmlLabel(cell))
			{
				tmp.innerHTML = Graph.sanitizeHtml(this.getLabel(cell));
				label = mxUtils.extractTextWithWhitespace([tmp]);
			}
			else
			{
				label = this.getLabel(cell);
			}

			label = mxUtils.trim(label.replace(/[\x00-\x1F\x7F-\x9F]|\s+/g, ' '));
			
			if (label.length > 0)
			{
				labels.push(label);
			}
		}
	}
	
	return labels.join(' ');
};

/**
 * Returns the label for the given cell.
 */
Graph.prototype.convertValueToString = function(cell)
{
	var value = this.model.getValue(cell);
	
	if (value != null && typeof(value) == 'object')
	{
		var result = null;
		
		if (this.isReplacePlaceholders(cell) && cell.getAttribute('placeholder') != null)
		{
			var name = cell.getAttribute('placeholder');
			var current = cell;
					
			while (result == null && current != null)
			{
				if (current.value != null && typeof(current.value) == 'object')
				{
					result = (current.hasAttribute(name)) ?
						((current.getAttribute(name) != null) ?
							current.getAttribute(name) : '') : null;
				}
				
				current = this.model.getParent(current);
			}
		}
		else
		{
			var result = null;
			
			if (Graph.translateDiagram && Graph.diagramLanguage != null)
			{
				result = value.getAttribute('label_' + Graph.diagramLanguage);
			}
			
			if (result == null)
			{
				result = value.getAttribute('label') || '';
			}
		}

		return result || '';
	}
	
	return mxGraph.prototype.convertValueToString.apply(this, arguments);
};

/**
 * Returns the link for the given cell.
 */
Graph.prototype.getLinksForState = function(state)
{
	if (state != null && state.text != null && state.text.node != null)
	{
		return state.text.node.getElementsByTagName('a');
	}
	else
	{
		return null;
	}
};

/**
 * Returns the link for the given cell.
 */
Graph.prototype.getLinkForCell = function(cell, allowUnsafe)
{
	if (cell.value != null && typeof(cell.value) == 'object')
	{
		var link = cell.value.getAttribute('link');

		if (!allowUnsafe)
		{
			link = mxUtils.removeJavascriptProtocol(link);
		}

		return link;
	}
	else
	{
		return null;
	}
};

/**
 * Returns the link target for the given cell.
 */
Graph.prototype.getLinkTargetForCell = function(cell)
{
	if (cell.value != null && typeof(cell.value) == 'object')
	{
		return cell.value.getAttribute('linkTarget');
	}
	else
	{
		return null;
	}
};

/**
 * Adds style post processing steps.
 */
Graph.prototype.postProcessCellStyle = function(cell, style)
{
	return this.updateHorizontalStyle(cell,this.replaceDefaultColors(cell,
		mxGraph.prototype.postProcessCellStyle.apply(this, arguments)));
};

/**
 * Overrides label orientation for collapsed swimlanes inside stack and
 * for partial rectangles inside tables.
 */
Graph.prototype.updateHorizontalStyle = function(cell, style)
{
	if (cell != null && style != null && this.layoutManager != null)
	{
		var parent = this.model.getParent(cell);
		
		if (this.model.isVertex(parent) && this.isCellCollapsed(cell))
		{
			var layout = this.layoutManager.getLayout(parent);
			
			if (layout != null && layout.constructor == mxStackLayout)
			{
				style[mxConstants.STYLE_HORIZONTAL] = !layout.horizontal;
			}
		}
	}
	
	return style;
};

/**
 * Replaces default colors. 
 */
Graph.prototype.replaceDefaultColors = function(cell, style)
{
	if (style != null &&
		this.shapeBackgroundColor != null &&
		this.shapeForegroundColor != null)
	{
		var bg = this.shapeBackgroundColor;
		var fg = this.shapeForegroundColor;

		this.replaceDefaultColor(style, mxConstants.STYLE_FONTCOLOR, fg);
		this.replaceDefaultColor(style, mxConstants.STYLE_FILLCOLOR, bg);
		this.replaceDefaultColor(style, mxConstants.STYLE_GRADIENTCOLOR, fg);
		this.replaceDefaultColor(style, mxConstants.STYLE_STROKECOLOR, fg);
		this.replaceDefaultColor(style, mxConstants.STYLE_IMAGE_BORDER, fg);
		this.replaceDefaultColor(style, mxConstants.STYLE_IMAGE_BACKGROUND, bg);
		this.replaceDefaultColor(style, mxConstants.STYLE_LABEL_BORDERCOLOR, fg);
		this.replaceDefaultColor(style, mxConstants.STYLE_SWIMLANE_FILLCOLOR, bg);
		this.replaceDefaultColor(style, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, bg);
	}
	
	return style;
};

/**
 * Replaces the colors for the given key.
 */
Graph.prototype.replaceDefaultColor = function(style, key, value)
{
	if (style != null && value != null && value != 'none' &&
		value != '' && style[key] == 'default')
	{
		style[key] = this.getDefaultColor(style, key, value);
	}
};

/**
 * Replaces the colors for the given key.
 */
Graph.prototype.getDefaultColor = function(style, key, defaultValue)
{
	var temp = 'default' + key.charAt(0).toUpperCase() + key.substring(1);

	if (style[temp] == 'invert')
	{
		var color = mxUtils.getLightDarkColor(defaultValue);
		defaultValue = 'light-dark(' + color.dark + ', ' + color.light + ')';
	}

	return defaultValue;
};

/**
 * Sets adaptiveColors and updates the CSS color scheme.
 */
Graph.prototype.setAdaptiveColors = function(value)
{
	this.adaptiveColors = (value == 'default') ? null : value;

	if (urlParams['embedInline'] == '1')
	{
		if (this.container != null)
		{
			this.container.style.colorScheme = (this.getAdaptiveColors() == 'none') ? 'light' : '';
		}
	}
	else
	{
		var root = this.view.getDrawPane().ownerSVGElement;

		if (root != null)
		{
			root.style.colorScheme = (this.getAdaptiveColors() == 'none') ? 'light' : '';
		}
	}
};

/**
 * Sets adaptiveColors and updates the CSS color scheme.
 */
Graph.prototype.getAdaptiveColors = function()
{
	return (this.adaptiveColors != null) ? this.adaptiveColors : Graph.defaultAdaptiveColors;
};

/**
 * Disables alternate width persistence for stack layout parents
 */
Graph.prototype.updateAlternateBounds = function(cell, geo, willCollapse)
{
	if (cell != null && geo != null && this.layoutManager != null && geo.alternateBounds != null)
	{
		var layout = this.layoutManager.getLayout(this.model.getParent(cell));
		
		if (layout != null && layout.constructor == mxStackLayout)
		{
			if (layout.horizontal)
			{
				geo.alternateBounds.height = 0;
			}
			else
			{
				geo.alternateBounds.width = 0;
			}
		}
	}
	
	mxGraph.prototype.updateAlternateBounds.apply(this, arguments);
};

/**
 * Moves the given cells to the given point.
 */
Graph.prototype.moveCellsTo = function(cells, pt)
{
	if (cells != null && pt != null)
	{
		var includeEdges = true;
		
		for (var i = 0; i < cells.length && includeEdges; i++)
		{
			includeEdges = includeEdges && this.model.isEdge(cells[i]);
		}
		
		var bb = null;
		
		if (cells.length == 1 && includeEdges)
		{
			var geo = this.getCellGeometry(cells[0]);
			
			if (geo != null)
			{
				bb = geo.getTerminalPoint(true);
			}
		}
		
		bb = (bb != null) ? bb : this.getBoundingBoxFromGeometry(cells, includeEdges);
		
		if (bb != null)
		{
			var x = Math.round(this.snap(pt.x));
			var y = Math.round(this.snap(pt.y));
			this.cellsMoved(cells, x - bb.x, y - bb.y);
		}
	}
};

/**
 * Adds Shift+collapse/expand and size management for folding inside stack
 */
Graph.prototype.isMoveCellsEvent = function(evt, state)
{
	return mxEvent.isShiftDown(evt) || mxUtils.getValue(state.style, 'moveCells', '0') == '1';
};

/**
 * Adds Shift+collapse/expand and size management for folding inside stack
 */
Graph.prototype.foldCells = function(collapse, recurse, cells, checkFoldable, evt)
{
	recurse = (recurse != null) ? recurse : false;
	
	if (cells == null)
	{
		cells = this.getFoldableCells(this.getSelectionCells(), collapse);
	}
	
	if (cells != null)
	{
		this.model.beginUpdate();
		
		try
		{
			mxGraph.prototype.foldCells.apply(this, arguments);

			for (var i = 0; i < cells.length; i++)
			{
				var state = this.view.getState(cells[i]);
				var geo = this.getCellGeometry(cells[i]);
				
				if (state != null && geo != null)
				{
					// Brings folded containers to front
					if (mxUtils.getValue(state.style, 'expandToFront', '0') == '1' &&
						!this.isCellCollapsed(cells[i]))
					{
						this.orderCells(false, [cells[i]]);
					}

					// Resizes all parent stacks if alt is not pressed
					if (this.layoutManager != null)
					{
						var dx = 0;
						var dy = 0;

						if (geo.alternateBounds)
						{
							dx = geo.width - geo.alternateBounds.width;
							dy = geo.height - geo.alternateBounds.height;
						}
						else
						{
							var s = (this.useCssTransforms) ? 1 : this.view.scale;
							dx = Math.round(geo.width - state.width / s);
							dy = Math.round(geo.height - state.height / s);
						}
						
						if (dy != 0 || dx != 0)
						{
							var parent = this.model.getParent(cells[i]);
							var layout = this.layoutManager.getLayout(parent);
							
							if (layout == null)
							{
								// Moves cells to the right and down after collapse/expand
								if (evt != null && this.isMoveCellsEvent(evt, state))
								{
									this.moveSiblings(state, parent, dx, dy);
								}
							}
							else if ((evt == null || !mxEvent.isAltDown(evt)) &&
								layout.constructor == mxStackLayout && !layout.resizeLast)
							{
								this.resizeParentStacks(parent, layout, dx, dy);
							}
						}
					}
				}
			}
		}
		finally
		{
			this.model.endUpdate();
		}
		
		// Selects cells after folding
		if (this.isEnabled())
		{
			this.setSelectionCells(cells);
		}
	}
};

/**
 * Overrides label orientation for collapsed swimlanes inside stack.
 */
Graph.prototype.moveSiblings = function(state, parent, dx, dy)
{
	this.model.beginUpdate();
	try
	{
		var cells = this.getCellsBeyond(state.x, state.y, parent, true, true);
		
		for (var i = 0; i < cells.length; i++)
		{
			if (cells[i] != state.cell)
			{
				var tmp = this.view.getState(cells[i]);
				var geo = this.getCellGeometry(cells[i]);
				
				if (tmp != null && geo != null)
				{
					geo = geo.clone();
					geo.translate(Math.round(dx * Math.max(0, Math.min(1, (tmp.x - state.x) / state.width))),
						Math.round(dy * Math.max(0, Math.min(1, (tmp.y - state.y) / state.height))));
					this.model.setGeometry(cells[i], geo);
				}
			}
		}
	}
	finally
	{
		this.model.endUpdate();
	}
};

/**
 * Overrides label orientation for collapsed swimlanes inside stack.
 */
Graph.prototype.resizeParentStacks = function(parent, layout, dx, dy)
{
	if (this.layoutManager != null && layout != null && layout.constructor == mxStackLayout && !layout.resizeLast)
	{
		this.model.beginUpdate();
		try
		{
			var dir = layout.horizontal;
			
			// Bubble resize up for all parent stack layouts with same orientation
			while (parent != null && layout != null && layout.constructor == mxStackLayout &&
				layout.horizontal == dir && !layout.resizeLast)
			{
				var pgeo = this.getCellGeometry(parent);
				var pstate = this.view.getState(parent);
				
				if (pstate != null && pgeo != null)
				{
					pgeo = pgeo.clone();
					
					if (layout.horizontal)
					{
						pgeo.width += dx + Math.min(0, pstate.width / this.view.scale - pgeo.width);									
					}
					else
					{
						pgeo.height += dy + Math.min(0, pstate.height / this.view.scale - pgeo.height);
					}
		
					this.model.setGeometry(parent, pgeo);
				}
				
				parent = this.model.getParent(parent);
				layout = this.layoutManager.getLayout(parent);
			}
		}
		finally
		{
			this.model.endUpdate();
		}
	}
};

/**
 * Disables drill-down for non-swimlanes.
 */
Graph.prototype.isContainer = function(cell)
{
	var style = this.getCurrentCellStyle(cell);

	if (this.isSwimlane(cell))
	{
		return style['container'] != '0';
	}
	else
	{
		return style['container'] == '1';
	}
};

/**
 * Width in pixels of the band along a container's border in which
 * connections are targeted at the container even if a child overlaps
 * the border. 0 disables the border band.
 */
Graph.prototype.borderBandSize = 8;

/**
 * Returns the nearest connectable container ancestor of the given cell if
 * the given point (in view coordinates) is within <borderBandSize> pixels
 * of that container's border, so that connections can be made to a
 * container where children overlap its border. Small children (up to three
 * times the band size, eg. ports) keep priority at borders, as do children
 * in the interior of an ancestor. Tables, rows and cells are ignored as
 * their children are flush with their borders by construction.
 */
Graph.prototype.getBorderContainer = function(cell, x, y)
{
	var band = this.borderBandSize;
	var result = null;

	if (band > 0 && cell != null && this.model.isVertex(cell))
	{
		// Small children at borders (eg. ports) keep priority
		var geo = this.getCellGeometry(cell);

		if (geo == null || Math.min(geo.width, geo.height) > 3 * band)
		{
			var parent = this.model.getParent(cell);

			while (result == null && this.model.isVertex(parent))
			{
				var state = this.view.getState(parent);

				if (state != null)
				{
					var pt = new mxPoint(x, y);
					var rot = mxUtils.getValue(state.style,
						mxConstants.STYLE_ROTATION, 0);

					if (rot != 0)
					{
						var rad = mxUtils.toRadians(-rot);
						pt = mxUtils.getRotatedPoint(pt, Math.cos(rad),
							Math.sin(rad), new mxPoint(state.getCenterX(),
								state.getCenterY()));
					}

					// Children in the interior of an ancestor keep priority
					if (pt.x >= state.x + band && pt.x <= state.x + state.width - band &&
						pt.y >= state.y + band && pt.y <= state.y + state.height - band)
					{
						break;
					}

					if (pt.x >= state.x - band && pt.x <= state.x + state.width + band &&
						pt.y >= state.y - band && pt.y <= state.y + state.height + band &&
						this.isContainer(parent) && !this.isTable(parent) &&
						!this.isTableRow(parent) && !this.isTableCell(parent) &&
						!this.isCellLocked(parent) && this.isCellConnectable(parent))
					{
						result = parent;
					}
				}

				parent = this.model.getParent(parent);
			}
		}
	}

	return result;
};

/**
 * Returns true for cells with transparentBounds=1. A transparentBounds has its
 * stored geometry pinned at (0,0,0,0); its visible bounds are derived from
 * the union of its children, and dragging the group translates the children
 * rather than the group itself.
 */
Graph.prototype.isTransparentBounds = function(cell)
{
	var style = this.getCurrentCellStyle(cell);

	return style['transparentBounds'] == '1';
};

/**
 * Returns true when the cell should show a draggable move handle icon at the
 * top-left of its bounds. Controlled by the moveIcon style key; defaults to
 * true for transparentBounds cells, false otherwise.
 */
Graph.prototype.isMoveIconVisible = function(cell)
{
	var style = this.getCurrentCellStyle(cell);
	var value = style['moveIcon'];

	if (value != null)
	{
		return value == '1';
	}

	return this.isTransparentBounds(cell);
};

/**
 * Returns the cells to be dragged when a drag is started on the move icon
 * of the given cell (see isMoveIconVisible), or null to let mxGraphHandler
 * derive the drag set from the cell itself. Overridden in Trees.js to drag
 * the whole subtree of a tree cell.
 */
Graph.prototype.getMoveIconDragCells = function(cell)
{
	return null;
};

/**
 * Returns the diagonal offset (in screen pixels) to push a corner icon
 * outward by, so it doesn't overlap the corresponding corner icon of a
 * descendant cell (in the active handler set) that shares this cell's
 * corner. cornerX, cornerY identify which corner of the cell is being
 * decorated (in screen coordinates). predicate(cell) is called on each
 * candidate descendant and must return true only when that descendant
 * actually renders the same icon type — so a cell with no overlapping
 * icon below doesn't get shifted needlessly.
 *
 * The outermost cell (with the most matching descendants) gets the
 * largest offset; the innermost gets zero so its icon sits at the
 * corner closest to the content. The caller adds the returned value in
 * its corner's outward direction.
 *
 * The handler set is derived from the current selection rather than
 * read out of selectionCellsHandler.handlers, because the dict is
 * populated incrementally during refresh — when an existing parent
 * handler is reused and redraws itself, the new child handler may not
 * be in the dict yet.
 */
Graph.prototype.getNestedCornerIconOffset = function(cell, cornerX, cornerY, predicate)
{
	var model = this.model;
	var view = this.view;
	var selCells = this.getSelectionCells();
	var seen = new mxDictionary();
	var count = 0;

	for (var i = 0; i < selCells.length; i++)
	{
		var sel = selCells[i];

		if (sel == cell)
		{
			continue;
		}

		// Walk from sel up toward cell, collecting path cells. If cell
		// is never reached, sel is not a descendant of cell.
		var pathCells = [sel];
		var p = model.getParent(sel);

		while (p != null && p != cell)
		{
			pathCells.push(p);
			p = model.getParent(p);
		}

		if (p != cell)
		{
			continue;
		}

		for (var j = 0; j < pathCells.length; j++)
		{
			var pc = pathCells[j];

			if (seen.get(pc) != null)
			{
				continue;
			}

			seen.put(pc, true);

			// Cells with a vertex handler in this view:
			//   - the selected cell (sel), always
			//   - transparentBounds ancestors of selected cells (added
			//     by the getHandledSelectionCells override above)
			if (pc != sel && !this.isTransparentBounds(pc))
			{
				continue;
			}

			if (!predicate(pc))
			{
				continue;
			}

			var dState = view.getState(pc);

			if (dState == null)
			{
				continue;
			}

			var corners = [
				[dState.x, dState.y],
				[dState.x + dState.width, dState.y],
				[dState.x, dState.y + dState.height],
				[dState.x + dState.width, dState.y + dState.height]
			];

			for (var k = 0; k < corners.length; k++)
			{
				if (Math.abs(corners[k][0] - cornerX) < 16 &&
					Math.abs(corners[k][1] - cornerY) < 16)
				{
					count++;
					break;
				}
			}
		}
	}

	// 16 px per level matches the icon size, so adjacent levels' icons
	// touch corner-to-corner without overlap and without a wasted gap.
	return count * 16;
};

/**
 * Returns the number of transparentBounds cells nested anywhere below
 * cell in the model tree. Used to scale outward selection-border padding
 * for transparentBounds groups: the outermost group has the most nested
 * descendants, so it gets the widest border wrapping the inner cells'
 * borders.
 *
 * Returns 0 for cells that aren't transparentBounds — only
 * transparentBounds=1 groups participate. The count is a static property
 * of the model tree, not the current selection, so the outward padding
 * remains stable regardless of which descendant happens to be selected.
 */
Graph.prototype.getNestedTransparentBoundsCount = function(cell)
{
	if (!this.isTransparentBounds(cell))
	{
		return 0;
	}

	var model = this.model;
	var graph = this;
	var count = 0;

	var visit = function(c)
	{
		var n = model.getChildCount(c);

		for (var i = 0; i < n; i++)
		{
			var child = model.getChildAt(c, i);

			if (graph.isTransparentBounds(child))
			{
				count++;
			}

			visit(child);
		}
	};

	visit(cell);

	return count;
};

/**
 * Returns true when the cell should show the connect handle (the arrow that
 * starts a new edge). The connectIcon style overrides the global default
 * Editor.showConnectHandle on a per-cell basis.
 */
Graph.prototype.isConnectIconVisible = function(cell)
{
	var style = this.getCurrentCellStyle(cell);
	var value = style['connectIcon'];

	if (value != null)
	{
		return value == '1';
	}

	return Editor.showConnectHandle;
};

/**
 * Returns true for a transparentBounds cell that should be selected before
 * its children on click (the standard transparentBounds behaviour selects
 * children directly and escalates to the group on a repeated click).
 * Controlled by selectParentFirst=1 in the style; defaults to false.
 */
Graph.prototype.isSelectParentFirst = function(cell)
{
	var style = this.getCurrentCellStyle(cell);

	return style['selectParentFirst'] == '1';
};

/**
 * Parses a CSS-style padding string into {n, e, s, w}.
 * - 1 value: all four sides
 * - 2 values: vertical, horizontal
 * - 3 values: top, horizontal, bottom
 * - 4 values: top, right, bottom, left (CSS TRBL order, clockwise)
 */
Graph.prototype.parsePadding = function(value)
{
	var str = (value != null) ? String(value) : '';

	// Style values are URI-encoded when written from the properties panel,
	// which turns the space separators into %20. Decode so the split below
	// recognises them.
	try
	{
		str = decodeURIComponent(str);
	}
	catch (e)
	{
		// keep str as-is
	}

	var parts = str.trim().split(/\s+/);
	var nums = parts.map(function(p)
	{
		var n = parseFloat(p);
		return isNaN(n) ? 0 : n;
	});

	if (nums.length === 1)
	{
		return {n: nums[0], e: nums[0], s: nums[0], w: nums[0]};
	}

	if (nums.length === 2)
	{
		return {n: nums[0], e: nums[1], s: nums[0], w: nums[1]};
	}

	if (nums.length === 3)
	{
		return {n: nums[0], e: nums[1], s: nums[2], w: nums[1]};
	}

	return {n: nums[0], e: nums[1], s: nums[2], w: nums[3]};
};

/**
 * Returns the per-side padding (in graph units) between a transparentBounds
 * cell and the union of its children as {n, e, s, w}. Reads the standard
 * groupPadding style key (CSS-style 1/2/3/4 values, space-separated) with a
 * default of 0 (used only in the transparentBounds branch of updateCellState).
 */
Graph.prototype.getTransparentBoundsPadding = function(cell)
{
	var style = this.getCurrentCellStyle(cell);

	return this.parsePadding(mxUtils.getValue(style,
		mxConstants.STYLE_GROUP_PADDING, 0));
};

/**
 * Invalidates the cached state of every transparentBounds ancestor of the
 * given cell so the next view validation re-derives the group bounds from
 * the current child geometries. When includeSelf is true the search starts
 * at the cell itself rather than at its parent (used for the previous
 * parent of a mxChildChange, which may itself be the transparentBounds that
 * just lost a child).
 */
Graph.prototype.invalidateTransparentBoundsAncestors = function(cell, includeSelf)
{
	var c = (includeSelf && cell != null) ? cell :
		(cell != null) ? this.model.getParent(cell) : null;

	while (c != null)
	{
		if (this.isTransparentBounds(c))
		{
			// includeEdges=true: the group's own model geometry never changes
			// (only its child-derived state does), so the base change handling
			// never invalidates edges connected to the group. Without this they
			// keep their stale terminal points and visibly detach from the group
			// until an unrelated re-validate (zoom/resize/refresh). This runs from
			// processChange (model-commit time), not during the live drag preview,
			// so it does not reintroduce the mid-drag churn noted on processChange.
			this.view.invalidate(c, false, true);
		}

		c = this.model.getParent(c);
	}
};

/**
 * Hooks model changes so transparentBounds ancestors are invalidated on
 * geometry/parent changes only. The previous approach overrode view.invalidate
 * unconditionally, which also fired during mxVertexHandler.updateLivePreview
 * (called to re-route connected edges) and caused the resized child's live
 * preview to shift as the group was repeatedly re-validated mid-drag.
 */
var graphProcessChange = Graph.prototype.processChange;
Graph.prototype.processChange = function(change)
{
	graphProcessChange.apply(this, arguments);

	if (change instanceof mxChildChange)
	{
		this.invalidateTransparentBoundsAncestors(change.child);
		this.invalidateTransparentBoundsAncestors(change.previous, true);
	}
	else if (change instanceof mxGeometryChange ||
		change instanceof mxTerminalChange)
	{
		this.invalidateTransparentBoundsAncestors(change.cell);
	}
};

/**
 * Returns the bounding box of the children of a transparentBounds in the
 * cell's own local coordinate space, or null if the group has no children
 * with geometry. Nested transparentBoundss contribute their own padded
 * bounds via getTransparentBounds (which is itself in the nested cell's
 * local space) translated by the nested cell's geo.x/y into this cell's
 * local space, so each level's padding accumulates outward and non-zero
 * nested geometry is handled correctly.
 */
Graph.prototype.getTransparentChildBounds = function(cell)
{
	var result = null;
	var count = this.model.getChildCount(cell);

	for (var i = 0; i < count; i++)
	{
		var child = this.model.getChildAt(cell, i);
		var rect = null;

		if (this.model.isVertex(child))
		{
			var geo = this.getCellGeometry(child);

			if (geo != null && !geo.relative)
			{
				if (this.isTransparentBounds(child))
				{
					var local = this.getTransparentBounds(child);

					if (local != null)
					{
						rect = new mxRectangle(geo.x + local.x,
							geo.y + local.y, local.width, local.height);
					}
				}
				else
				{
					rect = new mxRectangle(geo.x, geo.y,
						geo.width, geo.height);
				}
			}
		}
		else if (this.model.isEdge(child))
		{
			// Edge children contribute their waypoints and any disconnected
			// terminal points (stored relative to the group — the same local
			// space as vertex geometry) so an edge that bows outside the vertex
			// union, or a group whose only children are edges, still expands the
			// derived bounds instead of being ignored.
			var geo = this.getCellGeometry(child);

			if (geo != null)
			{
				var pts = [];

				if (this.model.getTerminal(child, true) == null &&
					geo.getTerminalPoint(true) != null)
				{
					pts.push(geo.getTerminalPoint(true));
				}

				if (this.model.getTerminal(child, false) == null &&
					geo.getTerminalPoint(false) != null)
				{
					pts.push(geo.getTerminalPoint(false));
				}

				if (geo.points != null)
				{
					pts = pts.concat(geo.points);
				}

				for (var j = 0; j < pts.length; j++)
				{
					if (pts[j] != null)
					{
						if (rect == null)
						{
							rect = new mxRectangle(pts[j].x, pts[j].y, 0, 0);
						}
						else
						{
							rect.add(new mxRectangle(pts[j].x, pts[j].y, 0, 0));
						}
					}
				}
			}
		}

		if (rect != null)
		{
			if (result == null)
			{
				result = mxRectangle.fromRectangle(rect);
			}
			else
			{
				result.add(rect);
			}
		}
	}

	return result;
};

/**
 * Returns the bounding box of a transparentBounds cell — the union of its
 * children expanded by the group's padding, (for swimlanes) the title-
 * bar start size and the footer region (opposite the title for swimlanes,
 * at the bottom otherwise) — in the cell's own local coordinate space
 * (child geometries are read directly without the cell's geo.x/y offset).
 * Returns null when the group has no children with geometry.
 */
Graph.prototype.getTransparentBounds = function(cell)
{
	var bounds = this.getTransparentChildBounds(cell);

	if (bounds == null)
	{
		return null;
	}

	var pad = this.getTransparentBoundsPadding(cell);
	var start = this.isSwimlane(cell) ?
		this.getActualStartSize(cell) : new mxRectangle();
	var footer = this.getActualFooterSize(cell);

	return new mxRectangle(
		bounds.x - pad.w - start.x - footer.x,
		bounds.y - pad.n - start.y - footer.y,
		bounds.width + pad.w + pad.e + start.x + start.width + footer.x + footer.width,
		bounds.height + pad.n + pad.s + start.y + start.height + footer.y + footer.height);
};

/**
 * Overrides the group-bounds computation so transparentBounds children
 * contribute their actual visible bounds (derived from their own children)
 * rather than their stored geometry. Without this, grouping two
 * transparentBounds cells whose stored geometry doesn't track their visible
 * content would size the outer group to the union of the stored boxes
 * (typically just one of the children's visible regions) instead of the
 * true bounding box of all rendered content.
 */
Graph.prototype.getBoundsForGroup = function(group, children, border)
{
	var result = null;

	if (children != null)
	{
		for (var i = 0; i < children.length; i++)
		{
			var rect = null;

			if (this.model.isEdge(children[i]))
			{
				// Edges contribute their terminal points and waypoints (as in the
				// base mxGraph.getBoundsForGroup) so a group of only edges is sized
				// correctly instead of yielding no bounds (and thus no group).
				rect = this.getBoundingBoxFromGeometry([children[i]], true);
			}
			else if (this.model.isVertex(children[i]))
			{
				var geo = this.getCellGeometry(children[i]);

				if (geo == null || geo.relative)
				{
					continue;
				}

				if (this.isTransparentBounds(children[i]))
				{
					var local = this.getTransparentBounds(children[i]);

					if (local != null)
					{
						rect = new mxRectangle(geo.x + local.x, geo.y + local.y,
							local.width, local.height);
					}
				}
				else
				{
					rect = new mxRectangle(geo.x, geo.y, geo.width, geo.height);
				}
			}

			if (rect != null)
			{
				if (result == null)
				{
					result = rect;
				}
				else
				{
					result.add(rect);
				}
			}
		}
	}

	if (result != null)
	{
		if (this.isSwimlane(group))
		{
			var size = this.getStartSize(group);

			result.x -= size.width;
			result.y -= size.height;
			result.width += size.width;
			result.height += size.height;
		}

		if (border != null)
		{
			result.x -= border;
			result.y -= border;
			result.width += 2 * border;
			result.height += 2 * border;
		}
	}

	return result;
};

/**
 * Skips transparentBounds groups when recomputing group bounds. Their visible
 * box is already derived from their children at render time and their stored
 * geometry must stay pinned at (0,0,0,0). The base implementation writes a
 * non-zero geometry onto the group and shifts its children to match — double-
 * counting the bounds offset so the group no longer hugs its content, and
 * persisting the corrupted geometry to file. Reached from Edit > Autosize, the
 * Arrange > Layout menu actions, and the tree/flow childLayout resizeParent
 * path. Non-transparentBounds cells fall through to the base unchanged.
 */
Graph.prototype.updateGroupBounds = function(cells, border, moveGroup, topBorder, rightBorder, bottomBorder, leftBorder)
{
	if (cells != null)
	{
		var filtered = [];

		for (var i = 0; i < cells.length; i++)
		{
			if (!this.isTransparentBounds(cells[i]))
			{
				filtered.push(cells[i]);
			}
		}

		if (filtered.length < cells.length)
		{
			mxGraph.prototype.updateGroupBounds.call(this, filtered, border, moveGroup,
				topBorder, rightBorder, bottomBorder, leftBorder);

			// Preserve the base contract of returning the originally passed cells.
			return cells;
		}
	}

	return mxGraph.prototype.updateGroupBounds.apply(this, arguments);
};

/**
 * Substitutes the visible (child-derived) bounds for transparentBounds cells,
 * whose stored geometry is pinned at (0,0,0,0). The base implementation reads
 * each cell's stored geometry directly with no child recursion, so without this
 * a transparentBounds group contributes a zero-size box at its parent origin —
 * breaking every positioning path that derives an offset from this method
 * (paste-at-point, crop on import, getCenterInsertPoint, initial page translate).
 *
 * transparentBounds cells are pulled out and replaced by their getTransparentBounds
 * box (translated by the cell's geo.x/y into parent coords, which is a no-op while
 * the geometry is pinned but stays correct if that ever changes); everything else
 * falls through to the base. The original cells array is passed as `ancestors` so
 * the base still resolves parent offsets for edge/relative children whose parent
 * is one of the extracted transparentBounds cells.
 */
Graph.prototype.getBoundingBoxFromGeometry = function(cells, includeEdges, ancestors, includeStrokeWidth)
{
	var result = null;
	var rest = null;

	if (cells != null)
	{
		rest = [];

		for (var i = 0; i < cells.length; i++)
		{
			var geo = (this.model.isVertex(cells[i])) ?
				this.getCellGeometry(cells[i]) : null;

			if (geo != null && !geo.relative && this.isTransparentBounds(cells[i]))
			{
				var local = this.getTransparentBounds(cells[i]);

				if (local != null)
				{
					var bbox = new mxRectangle(geo.x + local.x, geo.y + local.y,
						local.width, local.height);

					if (result == null)
					{
						result = bbox;
					}
					else
					{
						result.add(bbox);
					}
				}
			}
			else
			{
				rest.push(cells[i]);
			}
		}
	}

	var base = mxGraph.prototype.getBoundingBoxFromGeometry.call(this, rest,
		includeEdges, (ancestors != null) ? ancestors : cells, includeStrokeWidth);

	if (base != null)
	{
		if (result == null)
		{
			result = base;
		}
		else
		{
			result.add(base);
		}
	}

	return result;
};

/**
 * Adds a connectable style.
 */
Graph.prototype.isCellConnectable = function(cell)
{
	var style = this.getCurrentCellStyle(cell);

	return !this.isCellLocked(this.getLayerForCell(cell)) &&
		((style['connectable'] != null) ? style['connectable'] != '0' :
		mxGraph.prototype.isCellConnectable.apply(this, arguments));
};

/**
 * Adds labelMovable style.
 */
Graph.prototype.isLabelMovable = function(cell)
{
	var style = this.getCurrentCellStyle(cell);
	
	return (style['movableLabel'] != null) ? style['movableLabel'] != '0' :
		mxGraph.prototype.isLabelMovable.apply(this, arguments);
};

/**
 * Function: selectAll
 * 
 * Selects all children of the given parent cell or the children of the
 * default parent if no parent is specified. To select leaf vertices and/or
 * edges use <selectCells>.
 * 
 * Parameters:
 * 
 * parent - Optional <mxCell> whose children should be selected.
 * Default is <defaultParent>.
 */
Graph.prototype.selectAll = function(parent)
{
	parent = parent || this.getDefaultParent();

	if (!this.isCellLocked(parent))
	{
		mxGraph.prototype.selectAll.apply(this, arguments);
	}
};

/**
 * Function: selectCells
 * 
 * Selects all vertices and/or edges depending on the given boolean
 * arguments recursively, starting at the given parent or the default
 * parent if no parent is specified. Use <selectAll> to select all cells.
 * For vertices, only cells with no children are selected.
 * 
 * Parameters:
 * 
 * vertices - Boolean indicating if vertices should be selected.
 * edges - Boolean indicating if edges should be selected.
 * parent - Optional <mxCell> that acts as the root of the recursion.
 * Default is <defaultParent>.
 */
Graph.prototype.selectCells = function(vertices, edges, parent)
{
	parent = parent || this.getDefaultParent();

	if (!this.isCellLocked(parent))
	{
		mxGraph.prototype.selectCells.apply(this, arguments);
	}
};

/**
 * Function: getSwimlaneAt
 * 
 * Returns the bottom-most swimlane that intersects the given point (x, y)
 * in the cell hierarchy that starts at the given parent.
 * 
 * Parameters:
 * 
 * x - X-coordinate of the location to be checked.
 * y - Y-coordinate of the location to be checked.
 * parent - <mxCell> that should be used as the root of the recursion.
 * Default is <defaultParent>.
 */
Graph.prototype.getSwimlaneAt = function (x, y, parent)
{
	var result = mxGraph.prototype.getSwimlaneAt.apply(this, arguments);
	
	if (this.isCellLocked(result))
	{
		result = null;
	}
	
	return result;
};

/**
 * Disables folding for non-swimlanes.
 */
Graph.prototype.isCellFoldable = function(cell)
{
	var style = this.getCurrentCellStyle(cell);
	
	// transparentBounds groups have geometry pinned at (0,0,0,0) with their box
	// derived from children. Collapsing swaps geometry with the preferred-size
	// alternateBounds (mxGraph.swapBounds), writing a non-zero geometry onto the
	// group, corrupting the pin and rendering an empty box. They are not
	// foldable until proper collapse support exists for derived bounds.
	return this.foldingEnabled && !this.isTransparentBounds(cell) &&
		mxUtils.getValue(style,
		mxConstants.STYLE_RESIZABLE, '1') != '0' &&
		(style['treeFolding'] == '1' ||
		(!this.isCellLocked(cell) &&
		((this.isContainer(cell) && style['collapsible'] != '0') ||
		(!this.isContainer(cell) && style['collapsible'] == '1'))));
};

/**
 * Stops all interactions and clears the selection.
 */
Graph.prototype.reset = function()
{
	if (this.isEditing())
	{
		this.stopEditing(true);
	}
	
	this.escape();
					
	if (!this.isSelectionEmpty())
	{
		this.clearSelection();
	}
};

/**
 * Overridden to limit zoom to 1% - 16.000%.
 */
Graph.prototype.zoom = function(factor, center)
{
	factor = Math.max(0.01, Math.min(this.view.scale * factor, 160)) / this.view.scale;
	
	mxGraph.prototype.zoom.apply(this, arguments);
};

/**
 * Function: zoomIn
 * 
 * Zooms into the graph by <zoomFactor>.
 */
Graph.prototype.zoomIn = function()
{
	// Switches to 1% zoom steps below 15%
	if (this.view.scale < 0.15)
	{
		this.zoom((this.view.scale + 0.01) / this.view.scale);
	}
	else
	{
		// Uses to 5% zoom steps for better grid rendering in webkit
		// and to avoid rounding errors for zoom steps
		this.zoom((Math.round(this.view.scale * this.zoomFactor * 20) / 20) / this.view.scale);
	}
};

/**
 * Function: zoomOut
 * 
 * Zooms out of the graph by <zoomFactor>.
 */
Graph.prototype.zoomOut = function()
{
	// Switches to 1% zoom steps below 15%
	if (this.view.scale <= 0.15)
	{
		this.zoom((this.view.scale - 0.01) / this.view.scale);
	}
	else
	{
		// Uses to 5% zoom steps for better grid rendering in webkit
		// and to avoid rounding errors for zoom steps
		this.zoom((Math.round(this.view.scale * (1 / this.zoomFactor) * 20) / 20) / this.view.scale);
	}
};

/**
 * Function: fitPages
 * 
 * Fits the given number of pages to the current view horizontally.
 * If pageCount is null then all pages will be used. This should not
 * be called if pages are not visible.
 */
Graph.prototype.fitPages = function(pageCount, ignoreHeight)
{
	var vcount = 1;

	if (pageCount == null)
	{
		var layout = this.getPageLayout();
		pageCount = layout.width;
		vcount = layout.height;
	}

	var ps = this.pageScale;
	var fmt = this.pageFormat;
	var cw = this.container.clientWidth - 10;
	var ch = this.container.clientHeight - 10;
	var sx = cw / (pageCount * fmt.width) / ps;

	var scale = Math.floor(20 * ((ignoreHeight) ? sx :
		Math.min(sx, ch / (vcount * fmt.height) / ps))) / 20;

	this.zoomTo(scale);
	
	if (mxUtils.hasScrollbars(this.container))
	{
		var pad = this.getPagePadding();
		this.container.scrollLeft = Math.min(pad.x * this.view.scale,
			(this.container.scrollWidth - this.container.clientWidth) / 2);
		
		if (!ignoreHeight)
		{
			this.container.scrollTop = Math.min(pad.y * this.view.scale,
				(this.container.scrollHeight -
				this.container.clientHeight) / 2);
		}
	}
};

/**
 * Function: fitWindow
 * 
 * Sets the current visible rectangle of the window in graph coordinates.
 */
Graph.prototype.fitWindow = function(bounds, border, maxScale, zoomOutOnly, centerPage)
{
	border = (border != null) ? border : 10;

	var cw = this.container.clientWidth - border;
	var ch = this.container.clientHeight - border;
	var scale = Math.floor(20 * Math.min(cw / bounds.width, ch / bounds.height)) / 20;

	if (maxScale != null)
	{
		scale = Math.min(scale, maxScale);
	}

	if (!zoomOutOnly || scale < maxScale)
	{
		this.zoomTo(scale, null, null, mxUtils.hasScrollbars(this.container));

		if (mxUtils.hasScrollbars(this.container))
		{
			var t = this.view.translate;
			this.container.scrollLeft = (bounds.x + t.x) * this.view.scale -
				Math.max((cw - bounds.width * this.view.scale) / 2 + border / 2, 0);
			this.container.scrollTop = (bounds.y + t.y) * this.view.scale -
				Math.max((ch - bounds.height * this.view.scale) / 2 + border / 2, 0);

			// Centers on page for axes where page fits within viewport
			if (centerPage && this.pageVisible)
			{
				var pageBounds = this.view.getBackgroundPageBounds();
				var fullCw = this.container.clientWidth;
				var fullCh = this.container.clientHeight;

				if (pageBounds.width <= fullCw)
				{
					this.container.scrollLeft = pageBounds.x +
						pageBounds.width / 2 - fullCw / 2;
				}

				if (pageBounds.height <= fullCh)
				{
					this.container.scrollTop = pageBounds.y +
						pageBounds.height / 2 - fullCh / 2;
				}
			}
		}
	}
};

/**
 * Function: getCurrentViewBox
 *
 * Returns the visible canvas window in graph coordinates plus the current
 * scale as {x, y, width, height, scale}. Used to snapshot a page's initial
 * view (see PageSetupDialog) and restored via EditorUi.fitInitialView. The
 * scale is kept so the authored zoom can be reproduced independently of the
 * window size at restore time.
 */
Graph.prototype.getCurrentViewBox = function()
{
	var view = this.view;
	var container = this.container;
	var scale = view.scale;
	var t = view.translate;

	return {
		x: Math.round(container.scrollLeft / scale - t.x),
		y: Math.round(container.scrollTop / scale - t.y),
		width: Math.round(container.clientWidth / scale),
		height: Math.round(container.clientHeight / scale),
		scale: Math.round(scale * 1e4) / 1e4
	};
};

/**
 * Overrides tooltips to show custom tooltip or metadata.
 */
Graph.prototype.convertValueToTooltip = function(cell)
{
	var tmp = null;

	if (mxUtils.isNode(cell.value))
	{
		if (Graph.translateDiagram && Graph.diagramLanguage != null)
		{
			tmp = cell.value.getAttribute('tooltip_' + Graph.diagramLanguage);
		}
		
		if (tmp == null)
		{
			tmp = cell.value.getAttribute('tooltip');
		}
		
		if (tmp != null)
		{
			if (tmp != null && this.isReplacePlaceholders(cell))
			{
				tmp = this.replacePlaceholders(cell, tmp);
			}
			
			tmp = Graph.sanitizeHtml(tmp);
		}
	}

	return tmp;
};

/**
 * Overrides tooltips to show custom tooltip or metadata. Descendants of a
 * locked group inherit the group's tooltip.
 */
Graph.prototype.getTooltipForCell = function(cell)
{
	// Suppress cell tooltips entirely when disabled via the tooltips=0 URL param
	// (embed/inline/viewer hosts that don't want the link/property hint). Gated
	// at the content level so it holds regardless of the tooltip handler state.
	if (window.urlParams != null && urlParams['tooltips'] == '0')
	{
		return null;
	}

	var lockedAncestor = this.getLockedGroupAncestor(cell);

	if (lockedAncestor != null)
	{
		cell = lockedAncestor;
	}

	var tip = '';
	
	if (mxUtils.isNode(cell.value))
	{
		tip = this.convertValueToTooltip(cell);

		if (tip == null)
		{
			var ignored = this.builtInProperties;
			var attrs = cell.value.attributes;
			var temp = [];
			tip = '';

			// Hides links in edit mode
			if (this.isEnabled())
			{
				ignored.push('linkTarget');
				ignored.push('link');
			}
			
			for (var i = 0; i < attrs.length; i++)
			{
				if (((Graph.translateDiagram && attrs[i].nodeName == 'label') ||
					mxUtils.indexOf(ignored, attrs[i].nodeName) < 0) &&
					attrs[i].nodeValue.length > 0)
				{
					temp.push({name: attrs[i].nodeName, value: attrs[i].nodeValue});
				}
			}
			
			// Sorts by name
			temp.sort(function(a, b)
			{
				if (a.name < b.name)
				{
					return -1;
				}
				else if (a.name > b.name)
				{
					return 1;
				}
				else
				{
					return 0;
				}
			});

			for (var i = 0; i < temp.length; i++)
			{
				if (temp[i].name != 'link' || !this.isCustomLink(temp[i].value))
				{
					tip += ((temp[i].name != 'link') ? '<b>' + mxUtils.htmlEntities(temp[i].name) +
						':</b> ' : '') + mxUtils.htmlEntities(temp[i].value) + '\n';
				}
			}
			
			if (tip.length > 0)
			{
				tip = tip.substring(0, tip.length - 1);
				
				if (mxClient.IS_SVG)
				{
					tip = '<div style="max-width:360px;text-overflow:ellipsis;overflow:hidden;">' +
						tip + '</div>';
				}
			}
		}
	}
	
	return tip;
};

/**
 * 
 */
Graph.prototype.addFlowAnimationToNode = function(node, style, scale, id)
{
	if (node != null && id != null)
	{
		var dashArray = node.getAttribute('stroke-dasharray');
		var tokens = [];

		if (dashArray == '' || dashArray == null)
		{
			tokens = String(mxUtils.getValue(style, mxConstants.STYLE_DASH_PATTERN, '8')).split(' ');
			var sw = (mxUtils.getValue(style, mxConstants.STYLE_FIX_DASH, false) == 1 ||
				style['dashPattern'] == null) ? 1 : mxUtils.getNumber(style,
					mxConstants.STYLE_STROKEWIDTH, 1);

			if (tokens.length > 0)
			{
				for (var i = 0; i < tokens.length; i++)
				{
					tokens[i] = Math.round(Number(tokens[i]) * scale * sw * 100) / 100;
				}
			}

			node.setAttribute('stroke-dasharray', tokens.join(' '));
		}
		else
		{
			tokens = dashArray.split(' ');
		}

		if (tokens.length > 0)
		{
			var sum = 0;

			for (var i = 0; i < tokens.length; i++)
			{
				var temp = parseFloat(tokens[i]);

				if (!isNaN(temp))
				{
					sum += parseFloat(tokens[i]);
				}
			}
			
			// If an odd number of values is provided, then the list of
			// values is repeated to yield an even number of values
			if (tokens.length % 2 != 0)
			{
				sum *= 2;
			}

			var d = Math.round((sum / scale / 16) * parseInt(mxUtils.getValue(
				style, 'flowAnimationDuration', 500)));
			var tf = mxUtils.getValue(style, 'flowAnimationTimingFunction', 'linear');
			var ad = mxUtils.getValue(style, 'flowAnimationDirection', 'normal');
			node.style.animation = id + ' ' + d + 'ms ' + mxUtils.htmlEntities(tf) +
				' infinite ' + mxUtils.htmlEntities(ad);
			node.style.strokeDashoffset = sum;
		}
	}
};

/**
 * Adds rack child layout style.
 */
Graph.prototype.addFlowAnimationStyle = function()
{
	var head = document.getElementsByTagName('head')[0];
	
	if (head != null && this.flowAnimationId == null)
	{
		this.flowAnimationId = 'ge-flow-animation-' + Editor.guid();
		var style = document.createElement('style');
		style.innerHTML = this.createFlowAnimationCss(
			this.flowAnimationId);
		head.appendChild(style);
	}

	return this.flowAnimationId;
};

/**
 * Adds rack child layout style.
 */
Graph.prototype.createFlowAnimationCss = function(id)
{
	return '@keyframes ' + id + ' {\n' +
	'  to {\n' +
	'    stroke-dashoffset: 0;\n' +
	'  }\n' +
	'}';
};

/**
 * Turns the given string into an array.
 */
Graph.prototype.stringToBytes = function(str)
{
	return Graph.stringToBytes(str);
};

/**
 * Turns the given array into a string.
 */
Graph.prototype.bytesToString = function(arr)
{
	return Graph.bytesToString(arr);
};

/**
 * Returns a base64 encoded version of the compressed outer XML of the given node.
 */
Graph.prototype.compressNode = function(node)
{
	return Graph.compressNode(node);
};

/**
 * Returns a base64 encoded version of the compressed string.
 */
Graph.prototype.compress = function(data, deflate)
{
	return Graph.compress(data, deflate);
};

/**
 * Returns a decompressed version of the base64 encoded string.
 */
Graph.prototype.decompress = function(data, inflate)
{
	return Graph.decompress(data, inflate);
};

/**
 * Redirects to Graph.zapGremlins.
 */
Graph.prototype.zapGremlins = function(text)
{
	return Graph.zapGremlins(text);
};

/**
 * Hover icons are used for hover, vertex handler and drag from sidebar.
 */
HoverIcons = function(graph)
{
	mxEventSource.call(this);
	this.graph = graph;
	this.init();
};

// Extends mxEventSource
mxUtils.extend(HoverIcons, mxEventSource);

/**
 * Up arrow.
 */
HoverIcons.prototype.arrowSpacing = 2;

/**
 * Delay to switch to another state for overlapping bbox. Default is 500ms.
 */
HoverIcons.prototype.updateDelay = 500;

/**
 * Delay to switch between states. Default is 140ms.
 */
HoverIcons.prototype.activationDelay = 140;

/**
 * Up arrow.
 */
HoverIcons.prototype.currentState = null;

/**
 * Up arrow.
 */
HoverIcons.prototype.activeArrow = null;

/**
 * Up arrow.
 */
HoverIcons.prototype.inactiveOpacity = 15;

/**
 * Up arrow.
 */
HoverIcons.prototype.cssCursor = 'copy';

/**
 * Whether to hide arrows that collide with vertices.
 * LATER: Add keyboard override, touch support.
 */
HoverIcons.prototype.checkCollisions = true;

/**
 * Up arrow.
 */
HoverIcons.prototype.arrowFill = '#29b6f2';

/**
 * Up arrow.
 */
HoverIcons.prototype.triangleUp = Graph.createSvgImage(18, 28, '<path d="m 6 26 L 12 26 L 12 12 L 18 12 L 9 1 L 1 12 L 6 12 z" ' +
	'stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '"/>');

/**
 * Right arrow.
 */
HoverIcons.prototype.triangleRight = Graph.createSvgImage(26, 18, '<path d="m 1 6 L 14 6 L 14 1 L 26 9 L 14 18 L 14 12 L 1 12 z" ' +
	'stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '"/>');

/**
 * Down arrow.
 */
HoverIcons.prototype.triangleDown = Graph.createSvgImage(18, 26, '<path d="m 6 1 L 6 14 L 1 14 L 9 26 L 18 14 L 12 14 L 12 1 z" ' +
	'stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '"/>');

/**
 * Left arrow.
 */
HoverIcons.prototype.triangleLeft = Graph.createSvgImage(28, 18, '<path d="m 1 9 L 12 1 L 12 6 L 26 6 L 26 12 L 12 12 L 12 18 z" ' +
	'stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '"/>');

/**
 * Round target.
 */
HoverIcons.prototype.roundDrop = Graph.createSvgImage(26, 26, '<circle cx="13" cy="13" r="12" ' +
	'stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '"/>');

/**
 * Refresh target.
 */
HoverIcons.prototype.refreshTarget = new mxImage('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzZweCI+PGVsbGlwc2UgZmlsbD0iIzI5YjZmMiIgY3g9IjEyIiBjeT0iMTIiIHJ4PSIxMiIgcnk9IjEyIi8+PHBhdGggdHJhbnNmb3JtPSJzY2FsZSgwLjgpIHRyYW5zbGF0ZSgyLjQsIDIuNCkiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iI2ZmZiIgZD0iTTEyIDZ2M2w0LTQtNC00djNjLTQuNDIgMC04IDMuNTgtOCA4IDAgMS41Ny40NiAzLjAzIDEuMjQgNC4yNkw2LjcgMTQuOGMtLjQ1LS44My0uNy0xLjc5LS43LTIuOCAwLTMuMzEgMi42OS02IDYtNnptNi43NiAxLjc0TDE3LjMgOS4yYy40NC44NC43IDEuNzkuNyAyLjggMCAzLjMxLTIuNjkgNi02IDZ2LTNsLTQgNCA0IDR2LTNjNC40MiAwIDgtMy41OCA4LTggMC0xLjU3LS40Ni0zLjAzLTEuMjQtNC4yNnoiLz48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+Cg==', 38, 38);

/**
 * Tolerance for hover icon clicks.
 */
HoverIcons.prototype.tolerance = (mxClient.IS_TOUCH) ? 6 : 0;

/**
 * 
 */
HoverIcons.prototype.init = function()
{
	this.arrowUp = this.createArrow(this.triangleUp, mxResources.get('plusTooltip'), mxConstants.DIRECTION_NORTH);
	this.arrowRight = this.createArrow(this.triangleRight, mxResources.get('plusTooltip'), mxConstants.DIRECTION_EAST);
	this.arrowDown = this.createArrow(this.triangleDown, mxResources.get('plusTooltip'), mxConstants.DIRECTION_SOUTH);
	this.arrowLeft = this.createArrow(this.triangleLeft, mxResources.get('plusTooltip'), mxConstants.DIRECTION_WEST);

	this.elts = [this.arrowUp, this.arrowRight, this.arrowDown, this.arrowLeft];

	this.resetHandler = mxUtils.bind(this, function()
	{
		this.reset();
	});
	
	this.repaintHandler = mxUtils.bind(this, function()
	{
		this.repaint();
	});

	this.graph.selectionModel.addListener(mxEvent.CHANGE, this.resetHandler);
	this.graph.model.addListener(mxEvent.CHANGE, this.repaintHandler);
	this.graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, this.repaintHandler);
	this.graph.view.addListener(mxEvent.TRANSLATE, this.repaintHandler);
	this.graph.view.addListener(mxEvent.SCALE, this.repaintHandler);
	this.graph.view.addListener(mxEvent.DOWN, this.repaintHandler);
	this.graph.view.addListener(mxEvent.UP, this.repaintHandler);
	this.graph.addListener(mxEvent.ROOT, this.repaintHandler);
	this.graph.addListener(mxEvent.ESCAPE, this.resetHandler);
	mxEvent.addListener(this.graph.container, 'scroll', this.resetHandler);
	
	// Resets the mouse point on escape
	this.graph.addListener(mxEvent.ESCAPE, mxUtils.bind(this, function()
	{
		this.mouseDownPoint = null;
	}));

	// Removes hover icons if mouse leaves the container
	mxEvent.addListener(this.graph.container, 'mouseleave',  mxUtils.bind(this, function(evt)
	{
		// Workaround for IE11 firing mouseleave for touch in diagram
		if (evt.relatedTarget != null && mxEvent.getSource(evt) == this.graph.container)
		{
			this.setDisplay('none');
		}
	}));
	
	// Resets current state when in-place editor starts
	this.graph.addListener(mxEvent.START_EDITING, mxUtils.bind(this, function(evt)
	{
		this.reset();
	}));
	
	// Resets current state after update of selection state for touch events
	var graphClick = this.graph.click;
	this.graph.click = mxUtils.bind(this, function(me)
	{
		graphClick.apply(this.graph, arguments);
		
		if (this.currentState != null && !this.graph.isCellSelected(this.currentState.cell) &&
			mxEvent.isTouchEvent(me.getEvent()) && !this.graph.model.isVertex(me.getCell()))
		{
			this.reset();
		}
	});
	
	// Checks if connection handler was active in mouse move
	// as workaround for possible double connection inserted
	var connectionHandlerActive = false;
	
	// Implements a listener for hover and click handling
	this.graph.addMouseListener(
	{
	    mouseDown: mxUtils.bind(this, function(sender, me)
	    {
	    	connectionHandlerActive = false;
	    	var evt = me.getEvent();
	    	
	    	if (this.isResetEvent(evt))
	    	{
	    		this.reset();
	    	}
	    	else if (!this.isActive())
	    	{
	    		var state = this.getState(me.getState(),
	    			me.getGraphX(), me.getGraphY());

	    		if (state != null || !mxEvent.isTouchEvent(evt))
	    		{
	    			this.update(state);
	    		}
	    	}
	    	
	    	this.setDisplay('none');
	    }),
	    mouseMove: mxUtils.bind(this, function(sender, me)
	    {
	    	var evt = me.getEvent();
	    	
	    	if (this.isResetEvent(evt))
	    	{
	    		this.reset();
	    	}
	    	else if (!this.graph.isMouseDown && !mxEvent.isTouchEvent(evt))
	    	{
	    		this.update(this.getState(me.getState(),
	    			me.getGraphX(), me.getGraphY()),
	    			me.getGraphX(), me.getGraphY());
	    	}
	    	
	    	if (this.graph.connectionHandler != null &&
	    		this.graph.connectionHandler.shape != null)
	    	{
	    		connectionHandlerActive = true;
	    	}
	    }),
	    mouseUp: mxUtils.bind(this, function(sender, me)
	    {
	    	var evt = me.getEvent();
	    	var pt = mxUtils.convertPoint(this.graph.container,
				mxEvent.getClientX(evt), mxEvent.getClientY(evt))
	    	
	    	if (this.isResetEvent(evt))
	    	{
	    		this.reset();
	    	}
	    	else if (this.isActive() && !connectionHandlerActive &&
	    		this.mouseDownPoint != null)
	    	{
    			this.click(this.currentState, this.getDirection(), me);
	    	}
	    	else if (this.isActive())
	    	{
	    		// Selects target vertex after drag and clone if not only new edge was inserted
	    		if (this.graph.getSelectionCount() != 1 || !this.graph.model.isEdge(
	    			this.graph.getSelectionCell()))
	    		{
	    			this.update(this.getState(this.graph.view.getState(
	    				this.graph.getCellAt(me.getGraphX(), me.getGraphY())),
	    				me.getGraphX(), me.getGraphY()));
	    		}
	    		else
	    		{
	    			this.reset();
	    		}
	    	}
	    	else if (mxEvent.isTouchEvent(evt) || (this.bbox != null &&
	    		mxUtils.contains(this.bbox, me.getGraphX(), me.getGraphY())))
	    	{
	    		// Shows existing hover icons if inside bounding box
	    		this.setDisplay('');
	    		this.repaint();
	    	}
	    	else if (!mxEvent.isTouchEvent(evt))
	    	{
	    		this.reset();
	    	}
	    	
	    	connectionHandlerActive = false;
	    	this.resetActiveArrow();
	    })
	});
};

/**
 * 
 */
HoverIcons.prototype.isResetEvent = function(evt, allowShift)
{
	return mxEvent.isAltDown(evt) || (this.activeArrow == null && mxEvent.isShiftDown(evt)) ||
		(mxEvent.isPopupTrigger(evt) && !this.graph.isCloneEvent(evt));
};

/**
 * 
 */
HoverIcons.prototype.createArrow = function(img, tooltip, direction)
{
	var arrow = null;
	arrow = mxUtils.createImage(img.src);
	arrow.style.width = img.width + 'px';
	arrow.style.height = img.height + 'px';
	arrow.style.padding = this.tolerance + 'px';
	
	if (tooltip != null)
	{
		arrow.setAttribute('title', tooltip);
	}
	
	arrow.style.position = 'absolute';
	arrow.style.cursor = this.cssCursor;

	mxEvent.addGestureListeners(arrow, mxUtils.bind(this, function(evt)
	{
		if (this.currentState != null && !this.isResetEvent(evt))
		{
			this.mouseDownPoint = mxUtils.convertPoint(this.graph.container,
					mxEvent.getClientX(evt), mxEvent.getClientY(evt));
			this.drag(evt, this.mouseDownPoint.x, this.mouseDownPoint.y);
			this.activeArrow = arrow;
			this.setDisplay('none');
			mxEvent.consume(evt);
		}
	}));
	
	// Captures mouse events as events on graph
	mxEvent.redirectMouseEvents(arrow, this.graph, this.currentState);
	
	mxEvent.addListener(arrow, 'mouseenter', mxUtils.bind(this, function(evt)
	{
		// Workaround for Firefox firing mouseenter on touchend
		if (mxEvent.isMouseEvent(evt))
		{
	    	if (this.activeArrow != null && this.activeArrow != arrow)
	    	{
	    		mxUtils.setOpacity(this.activeArrow, this.inactiveOpacity);
	    	}

			this.graph.connectionHandler.constraintHandler.reset();
			mxUtils.setOpacity(arrow, 100);
			this.activeArrow = arrow;

			this.fireEvent(new mxEventObject('focus', 'arrow', arrow,
				'direction', direction, 'event', evt));
		}
	}));
	
	mxEvent.addListener(arrow, 'mouseleave', mxUtils.bind(this, function(evt)
	{
		if (mxEvent.isMouseEvent(evt))
		{
			this.fireEvent(new mxEventObject('blur', 'arrow', arrow,
				'direction', direction, 'event', evt));
		}

		// Workaround for IE11 firing this event on touch
		if (!this.graph.isMouseDown)
		{
			this.resetActiveArrow();
		}
	}));
	
	return arrow;
};

/**
 * 
 */
HoverIcons.prototype.resetActiveArrow = function()
{
	if (this.activeArrow != null)
	{
		mxUtils.setOpacity(this.activeArrow, this.inactiveOpacity);
		this.activeArrow = null;
	}
};

/**
 * 
 */
HoverIcons.prototype.getDirection = function()
{
	var dir = mxConstants.DIRECTION_EAST;

	if (this.activeArrow == this.arrowUp)
	{
		dir = mxConstants.DIRECTION_NORTH;
	}
	else if (this.activeArrow == this.arrowDown)
	{
		dir = mxConstants.DIRECTION_SOUTH;
	}
	else if (this.activeArrow == this.arrowLeft)
	{
		dir = mxConstants.DIRECTION_WEST;
	}
		
	return dir;
};

/**
 * 
 */
HoverIcons.prototype.visitNodes = function(visitor)
{
	for (var i = 0; i < this.elts.length; i++)
	{
		if (this.elts[i] != null)
		{
			visitor(this.elts[i]);
		}
	}
};

/**
 * 
 */
HoverIcons.prototype.removeNodes = function()
{
	this.visitNodes(function(elt)
	{
		if (elt.parentNode != null)
		{
			elt.parentNode.removeChild(elt);
		}
	});
};

/**
 *
 */
HoverIcons.prototype.setDisplay = function(display)
{
	this.visitNodes(function(elt)
	{
		elt.style.display = display;
	});
};

/**
 *
 */
HoverIcons.prototype.isActive = function()
{
	return this.activeArrow != null && this.currentState != null;
};

/**
 *
 */
HoverIcons.prototype.drag = function(evt, x, y)
{
	this.graph.popupMenuHandler.hideMenu();
	this.graph.stopEditing(false);

	// Checks if state was removed in call to stopEditing above
	if (this.currentState != null)
	{
		this.graph.connectionHandler.start(this.currentState, x, y);
		this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
		this.graph.isMouseDown = true;
		
		// Hides handles for selection cell
		var handler = this.graph.selectionCellsHandler.getHandler(this.currentState.cell);
		
		if (handler != null)
		{
			handler.setHandlesVisible(false);
		}
		
		// Ctrl+shift drag sets source constraint
		var es = this.graph.connectionHandler.edgeState;

		if (evt != null && mxEvent.isShiftDown(evt) && mxEvent.isControlDown(evt) && es != null &&
			mxUtils.getValue(es.style, mxConstants.STYLE_EDGE, null) === 'orthogonalEdgeStyle')
		{
			var direction = this.getDirection();
			es.cell.style = mxUtils.setStyle(es.cell.style, 'sourcePortConstraint', direction);
			es.style['sourcePortConstraint'] = direction;
		}
	}
};

/**
 *
 */
HoverIcons.prototype.getStateAt = function(state, x, y)
{
	return this.graph.view.getState(this.graph.getCellAt(x, y));
};

/**
 *
 */
HoverIcons.prototype.click = function(state, dir, me)
{
	var evt = me.getEvent();
	var x = me.getGraphX();
	var y = me.getGraphY();
	
	var tmp = this.getStateAt(state, x, y);

	if (tmp != null && this.graph.model.isEdge(tmp.cell) && !this.graph.isCloneEvent(evt) &&
		(tmp.getVisibleTerminalState(true) == state || tmp.getVisibleTerminalState(false) == state))
	{
		this.graph.setSelectionCell(tmp.cell);
		this.reset();
	}
	else if (state != null)
	{
		this.execute(state, dir, me);
	}
	
	me.consume();
};

/**
 *
 */
HoverIcons.prototype.execute = function(state, dir, me)
{
	var evt = me.getEvent();

	this.graph.selectCellsForConnectVertex(this.graph.connectVertex(
		state.cell, dir, this.graph.defaultEdgeLength, evt, this.graph.isCloneEvent(evt),
		this.graph.isCloneEvent(evt)), evt, this);
};

/**
 * 
 */
HoverIcons.prototype.reset = function(clearTimeout)
{
	clearTimeout = (clearTimeout == null) ? true : clearTimeout;
	
	if (clearTimeout && this.updateThread != null)
	{
		window.clearTimeout(this.updateThread);
	}

	this.mouseDownPoint = null;
	this.currentState = null;
	this.activeArrow = null;
	this.removeNodes();
	this.bbox = null;

	this.fireEvent(new mxEventObject('reset'));
};

/**
 * 
 */
HoverIcons.prototype.repaint = function()
{
	this.bbox = null;
	
	if (this.currentState != null)
	{
		// Checks if cell was deleted
		this.currentState = this.getState(this.currentState);
		
		// Cell was deleted	
		if (this.currentState != null &&
			this.graph.model.isVertex(this.currentState.cell) &&
			this.graph.isCellConnectable(this.currentState.cell))
		{
			var bds = mxRectangle.fromRectangle(this.currentState);
			
			// Uses outer bounding box to take rotation into account
			if (this.currentState.shape != null && this.currentState.shape.boundingBox != null)
			{
				bds = mxRectangle.fromRectangle(this.currentState.shape.boundingBox);
			}

			bds.grow(this.graph.tolerance);
			bds.grow(this.arrowSpacing);
			
			var handler = this.graph.selectionCellsHandler.getHandler(this.currentState.cell);
			
			if (this.graph.isTableRow(this.currentState.cell))
			{
				handler = this.graph.selectionCellsHandler.getHandler(
					this.graph.model.getParent(this.currentState.cell));
			}
			
			var rotationBbox = null;
			
			if (handler != null)
			{
				bds.x -= handler.horizontalOffset / 2;
				bds.y -= handler.verticalOffset / 2;
				bds.width += handler.horizontalOffset;
				bds.height += handler.verticalOffset;
				
				// Adds bounding box of rotation handle to avoid overlap
				if (handler.rotationShape != null && handler.rotationShape.node != null &&
					handler.rotationShape.node.style.visibility != 'hidden' &&
					handler.rotationShape.node.style.display != 'none' &&
					handler.rotationShape.boundingBox != null)
				{
					rotationBbox = handler.rotationShape.boundingBox;
				}
			}
			
			// Positions arrows avoid collisions with rotation handle
			var positionArrow = mxUtils.bind(this, function(arrow, x, y)
			{
				if (rotationBbox != null)
				{
					var bbox = new mxRectangle(x, y, arrow.clientWidth, arrow.clientHeight);
					
					if (mxUtils.intersects(bbox, rotationBbox))
					{
						if (arrow == this.arrowUp)
						{
							y -= bbox.y + bbox.height - rotationBbox.y;
						}
						else if (arrow == this.arrowRight)
						{
							x += rotationBbox.x + rotationBbox.width - bbox.x;
						}
						else if (arrow == this.arrowDown)
						{
							y += rotationBbox.y + rotationBbox.height - bbox.y;
						}
						else if (arrow == this.arrowLeft)
						{
							x -= bbox.x + bbox.width - rotationBbox.x;
						}
					}
				}
					
				arrow.style.left = x + 'px';
				arrow.style.top = y + 'px';
				mxUtils.setOpacity(arrow, this.inactiveOpacity);
			});
			
			positionArrow(this.arrowUp,
				Math.round(this.currentState.getCenterX() - this.triangleUp.width / 2 - this.tolerance),
				Math.round(bds.y - this.triangleUp.height - this.tolerance));
			
			positionArrow(this.arrowRight, Math.round(bds.x + bds.width - this.tolerance),
				Math.round(this.currentState.getCenterY() - this.triangleRight.height / 2 - this.tolerance));
			
			positionArrow(this.arrowDown, parseInt(this.arrowUp.style.left),
				Math.round(bds.y + bds.height - this.tolerance));
			
			positionArrow(this.arrowLeft, Math.round(bds.x - this.triangleLeft.width - this.tolerance),
				parseInt(this.arrowRight.style.top));
			
			if (this.checkCollisions)
			{
				var right = this.graph.getCellAt(bds.x + bds.width +
						this.triangleRight.width / 2, this.currentState.getCenterY());
				var left = this.graph.getCellAt(bds.x - this.triangleLeft.width / 2, this.currentState.getCenterY()); 
				var top = this.graph.getCellAt(this.currentState.getCenterX(), bds.y - this.triangleUp.height / 2); 
				var bottom = this.graph.getCellAt(this.currentState.getCenterX(), bds.y + bds.height + this.triangleDown.height / 2); 

				// Shows hover icons large cell is behind all directions of current cell
				if (right != null && right == left && left == top && top == bottom)
				{
					right = null;
					left = null;
					top = null;
					bottom = null;
				}

				var currentGeo = this.graph.getCellGeometry(this.currentState.cell);
				
				var checkCollision = mxUtils.bind(this, function(cell, arrow)
				{
					var geo = this.graph.model.isVertex(cell) && this.graph.getCellGeometry(cell);
					
					// Ignores collision if vertex is more than 3 times the size of this vertex
					if (cell != null && !this.graph.model.isAncestor(cell, this.currentState.cell) &&
						!this.graph.isSwimlane(cell) && (geo == null || currentGeo == null ||
						(geo.height < 3 * currentGeo.height && geo.width < 3 * currentGeo.width)))
					{
						arrow.style.visibility = 'hidden';
					}
					else
					{
						arrow.style.visibility = 'visible';
					}
				});
				
				checkCollision(right, this.arrowRight);
				checkCollision(left, this.arrowLeft);
				checkCollision(top, this.arrowUp);
				checkCollision(bottom, this.arrowDown);
			}
			else
			{
				this.arrowLeft.style.visibility = 'visible';
				this.arrowRight.style.visibility = 'visible';
				this.arrowUp.style.visibility = 'visible';
				this.arrowDown.style.visibility = 'visible';
			}
			
			if (this.graph.tooltipHandler.isEnabled())
			{
				this.arrowLeft.setAttribute('title', mxResources.get('plusTooltip'));
				this.arrowRight.setAttribute('title', mxResources.get('plusTooltip'));
				this.arrowUp.setAttribute('title', mxResources.get('plusTooltip'));
				this.arrowDown.setAttribute('title', mxResources.get('plusTooltip'));
			}
			else
			{
				this.arrowLeft.removeAttribute('title');
				this.arrowRight.removeAttribute('title');
				this.arrowUp.removeAttribute('title');
				this.arrowDown.removeAttribute('title');
			}
		}
		else
		{
			this.reset();
		}
		
		// Updates bounding box
		if (this.currentState != null)
		{
			this.bbox = this.computeBoundingBox();
			
			// Adds tolerance for hover
			if (this.bbox != null)
			{
				this.bbox.grow(10);
			}
		}
	}
};

/**
 * 
 */
HoverIcons.prototype.computeBoundingBox = function()
{
	var bbox = (!this.graph.model.isEdge(this.currentState.cell)) ? mxRectangle.fromRectangle(this.currentState) : null;
	
	this.visitNodes(function(elt)
	{
		if (elt.parentNode != null)
		{
			var tmp = new mxRectangle(elt.offsetLeft, elt.offsetTop, elt.offsetWidth, elt.offsetHeight);
			
			if (bbox == null)
			{
				bbox = tmp;
			}
			else
			{
				bbox.add(tmp);
			}
		}
	});
	
	return bbox;
};

/**
 * 
 */
HoverIcons.prototype.getState = function(state, x, y)
{
	if (state != null)
	{
		var cell = state.cell;

		if (!this.graph.getModel().contains(cell))
		{
			state = null;
		}
		else
		{
			// Uses connectable parent vertex if child is not connectable
			if (this.graph.getModel().isVertex(cell) && !this.graph.isCellConnectable(cell))
			{
				var parent = this.graph.getModel().getParent(cell);

				if (this.graph.getModel().isVertex(parent) && this.graph.isCellConnectable(parent))
				{
					cell = parent;
				}
			}

			// Uses container if the event is on its border band, unless the
			// cell already has the hover focus, so that its own connection
			// points on a shared border stay reachable from inside
			if (x != null && y != null && (this.currentState == null ||
				this.currentState.cell != cell))
			{
				var container = this.graph.getBorderContainer(cell, x, y);

				if (container != null)
				{
					cell = container;
				}
			}

			// Ignores locked cells and edges
			if (this.graph.isCellLocked(cell) || this.graph.model.isEdge(cell))
			{
				cell = null;
			}
			
			state = this.graph.view.getState(cell);
			
			if (state != null && state.style == null)
			{
				state = null;
			}
		}
	}
	
	return state;
};

/**
 * 
 */
HoverIcons.prototype.update = function(state, x, y)
{
	if (!this.graph.connectionArrowsEnabled ||
		(this.graph.freehand != null && this.graph.freehand.isDrawing()) ||
		(state != null && mxUtils.getValue(state.style, 'allowArrows', '1') == '0'))
	{
		this.reset();
	}
	else
	{
		if (state != null && state.cell.geometry != null && state.cell.geometry.relative &&
			this.graph.model.isEdge(state.cell.parent))
		{
			state = null;
		}
		
		var timeOnTarget = null;
		
		// Time on target
		if (this.prev != state || this.isActive())
		{
			this.startTime = new Date().getTime();
			this.prev = state;
			timeOnTarget = 0;
	
			if (this.updateThread != null)
			{
				window.clearTimeout(this.updateThread);
			}
			
			if (state != null)
			{
				// Starts timer to update current state with no mouse events
				this.updateThread = window.setTimeout(mxUtils.bind(this, function()
				{
					if (!this.isActive() && !this.graph.isMouseDown &&
						!this.graph.panningHandler.isActive())
					{
						this.prev = state;
						this.update(state, x, y);
					}
				}), this.updateDelay + 10);
			}
		}
		else if (this.startTime != null)
		{
			timeOnTarget = new Date().getTime() - this.startTime;
		}
		
		this.setDisplay('');
		
		if (this.currentState != null && this.currentState != state && timeOnTarget < this.activationDelay &&
			this.bbox != null && !mxUtils.contains(this.bbox, x, y))
		{
			this.reset(false);
		}
		else if (this.currentState != null || timeOnTarget > this.activationDelay)
		{
			if (this.currentState != state && ((timeOnTarget > this.updateDelay && state != null) ||
				this.bbox == null || x == null || y == null || !mxUtils.contains(this.bbox, x, y)))
			{
				if (state != null && this.graph.isEnabled())
				{
					this.removeNodes();
					this.setCurrentState(state);
					this.repaint();
					
					// Resets connection points on other focused cells
					if (this.graph.connectionHandler.constraintHandler.currentFocus != state)
					{
						this.graph.connectionHandler.constraintHandler.reset();
					}
				}
				else
				{
					this.reset();
				}
			}
		}
	}
};

/**
 * 
 */
HoverIcons.prototype.setCurrentState = function(state)
{
	if (state.style['portConstraint'] != 'eastwest')
	{
		if (this.arrowUp != null)
		{
			this.graph.container.appendChild(this.arrowUp);
		}

		if (this.arrowDown != null)
		{
			this.graph.container.appendChild(this.arrowDown);
		}
	}

	if (this.arrowRight != null)
	{
		this.graph.container.appendChild(this.arrowRight);
	}

	if (this.arrowLeft != null)
	{
		this.graph.container.appendChild(this.arrowLeft);
	}

	this.currentState = state;
};

/**
 * Returns true if the given cell is a table.
 */
Graph.prototype.removeTextStyleForCell = function(cell, removeCellStyles)
{
	var style = this.getCurrentCellStyle(cell);
	var result = false;

	this.getModel().beginUpdate();
	try
	{
		if (mxUtils.getValue(style, 'html', '0') == '1')
		{
			var label = this.convertValueToString(cell);
							
			if (mxUtils.getValue(style, 'nl2Br', '1') != '0')
			{
				// Removes newlines from HTML and converts breaks to newlines
				// to match the HTML output in plain text
				label = label.replace(/\n/g, '').replace(/<br\s*.?>/g, '\n');
			}
			
			label = Editor.convertHtmlToText(label);
			this.cellLabelChanged(cell, label);
			result = true;
		}

		if (removeCellStyles)
		{
			this.setCellStyles('fontSource', null, [cell]);
			this.setCellStyles(mxConstants.STYLE_FONTFAMILY, null, [cell]);
			this.setCellStyles(mxConstants.STYLE_FONTSIZE, null, [cell]);
			this.setCellStyles(mxConstants.STYLE_FONTSTYLE, null, [cell]);
			this.setCellStyles(mxConstants.STYLE_FONTCOLOR, null, [cell]);
			this.setCellStyles(mxConstants.STYLE_LABEL_BORDERCOLOR, null, [cell]);
			this.setCellStyles(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, null, [cell]);
		}
	}
	finally
	{
		this.getModel().endUpdate();
	}

	return result;
};

/**
 * Returns true if the given cell is a table.
 */
Graph.prototype.createParent = function(parent, child, childCount, dx, dy)
{
	parent = this.cloneCell(parent);
	
	for (var i = 0; i < childCount; i++)
    {
		var clone = this.cloneCell(child);
		var geo = this.getCellGeometry(clone)
		
		if (geo != null)
		{
			geo.x += i * dx;
			geo.y += i * dy;
		}
		
		parent.insert(clone);
    }
	
	return parent;
};

/**
 * Returns true if the given cell is a table.
 */
Graph.prototype.createTable = function(rowCount, colCount, w, h, title, startSize, tableStyle, rowStyle, cellStyle)
{
	w = (w != null) ? w : 60;
	h = (h != null) ? h : 40;
	startSize = (startSize != null) ? startSize : 30;
	tableStyle = (tableStyle != null) ? tableStyle : 'shape=table;startSize=' +
		((title != null) ? startSize : '0') + ';container=1;collapsible=0;childLayout=tableLayout;fixedHeader=1;';
	rowStyle = (rowStyle != null) ? rowStyle : 'shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;strokeColor=inherit;' +
    	'top=0;left=0;bottom=0;right=0;collapsible=0;dropTarget=0;fillColor=none;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fixedHeader=1;';
	cellStyle = (cellStyle != null) ? cellStyle : 'shape=partialRectangle;html=1;whiteSpace=wrap;connectable=0;strokeColor=inherit;' +
		'overflow=hidden;fillColor=none;top=0;left=0;bottom=0;right=0;pointerEvents=1;';
	
	return this.createParent(this.createVertex(null, null, (title != null) ? title : '',
		0, 0, colCount * w, rowCount * h + ((title != null) ? startSize : 0), tableStyle),
		this.createParent(this.createVertex(null, null, '', 0, 0, colCount * w, h, rowStyle),
			this.createVertex(null, null, '', 0, 0, w, h, cellStyle),
				colCount, w, 0), rowCount, 0, h);
};

/**
 * Sets the values for the cells and rows in the given table and returns the table.
 */
Graph.prototype.setTableValues = function(table, values, rowValues)
{
	var rows = this.model.getChildCells(table, true);
	
	for (var i = 0; i < rows.length; i++)
	{
		if (rowValues != null)
		{
			rows[i].value = rowValues[i];
		}	
		
		if (values != null)
		{
			var cells = this.model.getChildCells(rows[i], true);
			
			for (var j = 0; j < cells.length; j++)
			{
				if (values[i][j] != null)
				{
					cells[j].value = values[i][j];
				}
			}
		}
	}
	
	return table;
};

/**
 * 
 */
Graph.prototype.createCrossFunctionalSwimlane = function(rowCount, colCount, w, h, title, tableStyle, rowStyle, firstCellStyle, cellStyle)
{
	w = (w != null) ? w : 120;
	h = (h != null) ? h : 120;
	
	var s = 'collapsible=0;recursiveResize=0;expand=0;';
	tableStyle = (tableStyle != null) ? tableStyle : 'shape=table;childLayout=tableLayout;fixedHeader=1;' +
		((title == null) ? 'startSize=0;fillColor=none;' : 'startSize=40;') + s;
	rowStyle = (rowStyle != null) ? rowStyle : 'shape=tableRow;horizontal=0;swimlaneHead=0;swimlaneBody=0;top=0;left=0;strokeColor=inherit;' +
		'bottom=0;right=0;dropTarget=0;fontStyle=0;fillColor=none;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;startSize=40;fixedHeader=1;' + s;
	firstCellStyle = (firstCellStyle != null) ? firstCellStyle : 'swimlane;swimlaneHead=0;swimlaneBody=0;fontStyle=0;strokeColor=inherit;' +
		'connectable=0;fillColor=none;startSize=40;' + s;
	cellStyle = (cellStyle != null) ? cellStyle : 'swimlane;swimlaneHead=0;swimlaneBody=0;fontStyle=0;connectable=0;strokeColor=inherit;' +
		'fillColor=none;startSize=0;' + s;
	
	var table = this.createVertex(null, null, (title != null) ? title : '', 0, 0,
		colCount * w, rowCount * h, tableStyle);
	var t = mxUtils.getValue(this.getCellStyle(table), mxConstants.STYLE_STARTSIZE,
		mxConstants.DEFAULT_STARTSIZE);
	table.geometry.width += t;
	table.geometry.height += t;
	
	var row = this.createVertex(null, null, '', 0, t, colCount * w + t, h, rowStyle);
	table.insert(this.createParent(row, this.createVertex(null, null,
		'', t, 0, w, h, firstCellStyle), colCount, w, 0));
	
	if (rowCount > 1)
	{
		row.geometry.y = h + t;
		
		return this.createParent(table, this.createParent(row,
			this.createVertex(null, null,  '', t, 0, w, h, cellStyle),
			colCount, w, 0), rowCount - 1, 0, h);
	}
	else
	{
		return table;
	}
};

/**
 * Returns the row and column lines for the given table.
 */
Graph.prototype.visitTableCells = function(cell, visitor)
{
	var lastRow = null;
	var rows = this.model.getChildCells(cell, true);
	var start = this.getActualStartSize(cell, true);

	for (var i = 0; i < rows.length; i++)
	{
		var rowStart = this.getActualStartSize(rows[i], true);
		var cols = this.model.getChildCells(rows[i], true);
		var rowStyle = this.getCellStyle(rows[i], true);
		var lastCol = null;
		var row = [];

		for (var j = 0; j < cols.length; j++)
		{
			var geo = this.getCellGeometry(cols[j]);

			// Skips cells with no geometry (consistent with TableLayout.layoutRow).
			// Pushes null to keep lastRow[j] indexing aligned with the cols array.
			if (geo == null)
			{
				row.push(null);
				continue;
			}

			var col = {cell: cols[j], rospan: 1, colspan: 1, row: i, col: j, geo: geo};
			geo = (geo.alternateBounds != null) ? geo.alternateBounds : geo;
			col.point = new mxPoint(geo.width + (lastCol != null ? lastCol.point.x : start.x + rowStart.x),
				geo.height + (lastRow != null && lastRow[0] != null ? lastRow[0].point.y : start.y + rowStart.y));
			col.actual = col;

			if (lastRow != null && lastRow[j] != null && lastRow[j].rowspan > 1)
			{
				col.rowspan = lastRow[j].rowspan - 1;
				col.colspan = lastRow[j].colspan;
				col.actual = lastRow[j].actual;
			}
			else
			{
				if (lastCol != null && lastCol.colspan > 1)
				{
					col.rowspan = lastCol.rowspan;
					col.colspan = lastCol.colspan - 1;
					col.actual = lastCol.actual;
				}
				else
				{
					var style = this.getCurrentCellStyle(cols[j], true);

					if (style != null)
					{
						col.rowspan = parseInt(style['rowspan'] || 1);
						col.colspan = parseInt(style['colspan'] || 1);
					}
				}
			}

			var head = mxUtils.getValue(rowStyle, mxConstants.STYLE_SWIMLANE_HEAD, 1) == 1 &&
				mxUtils.getValue(rowStyle, mxConstants.STYLE_STROKECOLOR,
					mxConstants.NONE) != mxConstants.NONE;
				
			visitor(col, cols.length, rows.length,
				start.x + ((head) ? rowStart.x : 0),
				start.y + ((head) ? rowStart.y : 0));
			row.push(col);
			lastCol = col;
		}

		lastRow = row;
	}

};

/**
 * Returns the row and column lines for the given table.
 */
Graph.prototype.getTableLines = function(cell, horizontal, vertical)
{
	var hl = [];
	var vl = [];

	if (horizontal || vertical)
	{
		this.visitTableCells(cell, mxUtils.bind(this, function(iter, colCount, rowCount, x0, y0)
		{
			// Constructs horizontal lines
			if (horizontal && iter.row < rowCount - 1)
			{
				if (hl[iter.row] == null)
				{
					hl[iter.row] = [new mxPoint(x0, iter.point.y)];
				}

				if (iter.rowspan > 1)
				{
					hl[iter.row].push(null);
				}
				
				hl[iter.row].push(iter.point);
			}

			// Constructs vertical lines
			if (vertical && iter.col < colCount - 1)
			{
				if (vl[iter.col] == null)
				{
					vl[iter.col] = [new mxPoint(iter.point.x, y0)];
				}

				if (iter.colspan > 1)
				{
					vl[iter.col].push(null);
				}
				
				vl[iter.col].push(iter.point);
			}
		}));
	}

	return hl.concat(vl);
};

/**
 * Re-strokes the internal table grid lines that run along the edges of the
 * given table cell or row, on top of the cell's own fill. The grid lines are
 * drawn once by the parent table shape (see getTableLines), centered on the
 * cell boundaries and below the child cells in z-order, so a filled cell's
 * fill paints over its half of those lines: the line looks thin next to an
 * unfilled neighbour and disappears between two filled cells. The table shape
 * cannot paint above its own children (in the editor or in any re-rendered
 * export), so each filled cell repaints the bordering lines here, after its
 * fill. Which edges carry a line is derived from the cell's row/column index
 * the same way getTableLines decides, so rowspan/colspan and the rowLines /
 * columnLines styles stay consistent. No-op for non-table cells.
 */
Graph.prototype.paintTableCellLines = function(c, cell, x, y, w, h, stroke, strokeWidth)
{
	if (stroke == null || stroke == mxConstants.NONE)
	{
		return;
	}

	var model = this.model;
	var top = false, bottom = false, left = false, right = false;

	if (this.isTableRow(cell))
	{
		var rows = model.getChildCells(model.getParent(cell), true);
		var index = mxUtils.indexOf(rows, cell);
		var rowLines = mxUtils.getValue(this.getCurrentCellStyle(
			model.getParent(cell)), 'rowLines', '1') != '0';

		top = rowLines && index > 0;
		bottom = rowLines && index < rows.length - 1;
	}
	else if (this.isTableCell(cell))
	{
		var row = model.getParent(cell);
		var table = model.getParent(row);
		var rows = model.getChildCells(table, true);
		var cols = model.getChildCells(row, true);
		var style = this.getCurrentCellStyle(table);
		var rowLines = mxUtils.getValue(style, 'rowLines', '1') != '0';
		var columnLines = mxUtils.getValue(style, 'columnLines', '1') != '0';
		var rowIndex = mxUtils.indexOf(rows, row);
		var colIndex = mxUtils.indexOf(cols, cell);

		top = rowLines && rowIndex > 0;
		bottom = rowLines && rowIndex < rows.length - 1;
		left = columnLines && colIndex > 0;
		right = columnLines && colIndex < cols.length - 1;
	}
	else
	{
		return;
	}

	if (top || bottom || left || right)
	{
		c.setStrokeColor(stroke);
		c.setStrokeWidth(strokeWidth);
		c.setDashed(false);
		c.setShadow(false);

		if (top)
		{
			c.begin();
			c.moveTo(x, y);
			c.lineTo(x + w, y);
			c.stroke();
		}

		if (bottom)
		{
			c.begin();
			c.moveTo(x, y + h);
			c.lineTo(x + w, y + h);
			c.stroke();
		}

		if (left)
		{
			c.begin();
			c.moveTo(x, y);
			c.lineTo(x, y + h);
			c.stroke();
		}

		if (right)
		{
			c.begin();
			c.moveTo(x + w, y);
			c.lineTo(x + w, y + h);
			c.stroke();
		}
	}
};

/**
 * Returns true if the given cell is a table cell.
 */
Graph.prototype.isTableCell = function(cell)
{
	return this.model.isVertex(cell) && this.isTableRow(this.model.getParent(cell));
};

/**
 * Returns true if the given cell is a table row.
 */
Graph.prototype.isTableRow = function(cell)
{
	return this.model.isVertex(cell) && this.isTable(this.model.getParent(cell));
};

/**
 * Returns true if the given cell is a table.
 */
Graph.prototype.isTable = function(cell)
{
	var style = this.getCellStyle(cell);
	
	return style != null && style['childLayout'] == 'tableLayout';
};

/**
 * Returns true if the given cell is a table.
 */
Graph.prototype.isStack = function(cell)
{
	var style = this.getCellStyle(cell);
	 
	return style != null && style['childLayout'] == 'stackLayout';
};

/**
 * Returns true if the given cell is a table row.
 */
Graph.prototype.isStackChild = function(cell)
{
	return this.model.isVertex(cell) && this.isStack(this.model.getParent(cell));
};

/**
 * Updates the row and table heights.
 */
Graph.prototype.setTableRowHeight = function(row, dy, extend)
{
	extend = (extend != null) ? extend : true;
	var model = this.getModel();
	
	model.beginUpdate();
	try
	{
		var rgeo = this.getCellGeometry(row);
	
		// Sets height of row
		if (rgeo != null)
		{
			rgeo = rgeo.clone();
			rgeo.height += dy;
			model.setGeometry(row, rgeo);
			
			var table = model.getParent(row);
			var rows = model.getChildCells(table, true);
			
			// Shifts and resizes neighbor row
			if (!extend)
			{
				var index = mxUtils.indexOf(rows, row);
	
				if (index < rows.length - 1)
				{
					var nextRow = rows[index + 1];
					var geo = this.getCellGeometry(nextRow);
				
					if (geo != null)
					{
						geo = geo.clone();
						geo.y += dy;
						geo.height -= dy;
						
						model.setGeometry(nextRow, geo);
					}
				}
			}
			
			// Updates height of table
			var tgeo = this.getCellGeometry(table);
			
			if (tgeo != null)
			{
				// Always extends for last row
				if (!extend)
				{
					extend = row == rows[rows.length - 1];
				}
				
				if (extend)
				{
					tgeo = tgeo.clone();
					tgeo.height += dy;
					model.setGeometry(table, tgeo);
				}
			}
		}
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Updates column width and row height.
 */
Graph.prototype.setTableColumnWidth = function(col, dx, extend)
{
	extend = (extend != null) ? extend : false;
	
	var model = this.getModel();
	var row = model.getParent(col);
	var table = model.getParent(row);
	var cells = model.getChildCells(row, true);
	var index = mxUtils.indexOf(cells, col);
	var lastColumn = index == cells.length - 1;
	
	model.beginUpdate();
	try
	{
		// Sets width of child cell
		var rows = model.getChildCells(table, true);
		
		for (var i = 0; i < rows.length; i++)
		{
			row = rows[i];
			cells = model.getChildCells(row, true);
			var cell = cells[index];
			var geo = this.getCellGeometry(cell);
		
			if (geo != null)
			{
				geo = geo.clone();
				geo.width += dx;

				if (geo.alternateBounds != null)
				{
					geo.alternateBounds.width += dx;
				}
				
				model.setGeometry(cell, geo);
			}
			
			// Shifts and resizes neighbor column
			if (index < cells.length - 1)
			{
				cell = cells[index + 1];
				var geo = this.getCellGeometry(cell);
			
				if (geo != null)
				{
					geo = geo.clone();
					geo.x += dx;
					
					if (!extend)
					{
						geo.width -= dx;

						if (geo.alternateBounds != null)
						{
							geo.alternateBounds.width -= dx;
						}
					}
					
					model.setGeometry(cell, geo);
				}
			}
		}

		if (lastColumn || extend)
		{
			// Updates width of table
			var tgeo = this.getCellGeometry(table);
			
			if (tgeo != null)
			{
				tgeo = tgeo.clone();
				tgeo.width += dx;
				model.setGeometry(table, tgeo);
			}
		}

		if (this.layoutManager != null)
		{
			this.layoutManager.executeLayout(table);
		}
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Resizes all rows in the table by dy, extending the table.
 */
Graph.prototype.resizeAllTableRows = function(table, dy)
{
	var model = this.getModel();
	var rows = model.getChildCells(table, true);

	if (rows.length == 0)
	{
		return;
	}

	model.beginUpdate();
	try
	{
		for (var i = 0; i < rows.length; i++)
		{
			var rgeo = this.getCellGeometry(rows[i]);

			if (rgeo != null)
			{
				rgeo = rgeo.clone();
				rgeo.y += dy * i;
				rgeo.height = Math.max(Graph.minTableRowHeight,
					rgeo.height + dy);
				model.setGeometry(rows[i], rgeo);
			}
		}

		var tgeo = this.getCellGeometry(table);

		if (tgeo != null)
		{
			tgeo = tgeo.clone();
			tgeo.height += dy * rows.length;
			model.setGeometry(table, tgeo);
		}

		if (this.layoutManager != null)
		{
			this.layoutManager.executeLayout(table);
		}
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Resizes all columns in the table by dx, extending the table.
 */
Graph.prototype.resizeAllTableColumns = function(table, dx)
{
	var model = this.getModel();
	var rows = model.getChildCells(table, true);

	if (rows.length == 0)
	{
		return;
	}

	model.beginUpdate();
	try
	{
		for (var i = 0; i < rows.length; i++)
		{
			var cells = model.getChildCells(rows[i], true);

			for (var j = 0; j < cells.length; j++)
			{
				var geo = this.getCellGeometry(cells[j]);

				if (geo != null)
				{
					geo = geo.clone();
					geo.x += dx * j;
					geo.width = Math.max(Graph.minTableColumnWidth,
						geo.width + dx);

					if (geo.alternateBounds != null)
					{
						geo.alternateBounds.width = Math.max(
							Graph.minTableColumnWidth,
							geo.alternateBounds.width + dx);
					}

					model.setGeometry(cells[j], geo);
				}
			}
		}

		var tgeo = this.getCellGeometry(table);

		if (tgeo != null)
		{
			var numCols = model.getChildCells(rows[0], true).length;
			tgeo = tgeo.clone();
			tgeo.width += dx * numCols;
			model.setGeometry(table, tgeo);
		}

		if (this.layoutManager != null)
		{
			this.layoutManager.executeLayout(table);
		}
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Sets all rows in the table to equal height without changing the table size.
 */
Graph.prototype.distributeRows = function(table)
{
	var model = this.getModel();
	var rows = model.getChildCells(table, true);

	if (rows.length < 2)
	{
		return;
	}

	model.beginUpdate();
	try
	{
		var totalHeight = 0;

		for (var i = 0; i < rows.length; i++)
		{
			var rgeo = this.getCellGeometry(rows[i]);

			if (rgeo != null)
			{
				totalHeight += rgeo.height;
			}
		}

		var newHeight = totalHeight / rows.length;
		var y = 0;

		for (var i = 0; i < rows.length; i++)
		{
			var rgeo = this.getCellGeometry(rows[i]);

			if (rgeo != null)
			{
				rgeo = rgeo.clone();

				if (i == 0)
				{
					y = rgeo.y;
				}

				rgeo.y = y;
				rgeo.height = newHeight;
				model.setGeometry(rows[i], rgeo);
				y += newHeight;
			}
		}

		if (this.layoutManager != null)
		{
			this.layoutManager.executeLayout(table);
		}
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Sets all columns in the table to equal width without changing the table size.
 */
Graph.prototype.distributeColumns = function(table)
{
	var model = this.getModel();
	var rows = model.getChildCells(table, true);

	if (rows.length == 0)
	{
		return;
	}

	var firstRowCells = model.getChildCells(rows[0], true);

	if (firstRowCells.length < 2)
	{
		return;
	}

	model.beginUpdate();
	try
	{
		var totalWidth = 0;

		for (var i = 0; i < firstRowCells.length; i++)
		{
			var geo = this.getCellGeometry(firstRowCells[i]);

			if (geo != null)
			{
				var g = (geo.alternateBounds != null) ? geo.alternateBounds : geo;
				totalWidth += g.width;
			}
		}

		var newWidth = totalWidth / firstRowCells.length;

		for (var i = 0; i < rows.length; i++)
		{
			var cells = model.getChildCells(rows[i], true);
			var x = 0;

			for (var j = 0; j < cells.length; j++)
			{
				var geo = this.getCellGeometry(cells[j]);

				if (geo != null)
				{
					geo = geo.clone();

					if (j == 0)
					{
						x = geo.x;
					}

					geo.x = x;
					geo.width = newWidth;

					if (geo.alternateBounds != null)
					{
						geo.alternateBounds.width = newWidth;
					}

					model.setGeometry(cells[j], geo);
					x += newWidth;
				}
			}
		}

		if (this.layoutManager != null)
		{
			this.layoutManager.executeLayout(table);
		}
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Special Layout for tables.
 */
function TableLayout(graph)
{
	mxGraphLayout.call(this, graph);
};

/**
 * Extends mxGraphLayout.
 */
TableLayout.prototype = new mxStackLayout();
TableLayout.prototype.constructor = TableLayout;

/**
 * Function: isHorizontal
 * 
 * Overrides stack layout to handle row reorder.
 */
TableLayout.prototype.isHorizontal = function()	
{	
	return false;	
};

/**
 * Function: isVertexIgnored
 * 
 * Overrides to allow for table rows and cells.
 */
TableLayout.prototype.isVertexIgnored = function(vertex)
{
	return !this.graph.getModel().isVertex(vertex) ||
		!this.graph.isCellVisible(vertex);
};

/**
 * Function: getSize
 * 
 * Returns the total vertical or horizontal size of the given cells.
 */
TableLayout.prototype.getSize = function(cells, horizontal)
{
	var total = 0;
	
	for (var i = 0; i < cells.length; i++)
	{
		if (!this.isVertexIgnored(cells[i]))
		{
			var geo = this.graph.getCellGeometry(cells[i]);
			
			if (geo != null)
			{
				total += (horizontal) ? geo.width : geo.height;
			}
		}
	}
	
	return total;
};

/**
 * Function: getRowLayout
 * 
 * Returns the column positions for the given row and table width.
 */
TableLayout.prototype.getRowLayout = function(row, width)
{
	var cells = this.graph.model.getChildCells(row, true);
	var off = this.graph.getActualStartSize(row, true);
	var sw = this.getSize(cells, true);
	var rw = width - off.x - off.width;
	var result = [];
	var x = off.x;
	
	for (var i = 0; i < cells.length; i++)
	{
		var geo = this.graph.getCellGeometry(cells[i]);
		
		if (geo != null)
		{
			x += (geo.alternateBounds != null ?
				geo.alternateBounds.width :
				geo.width) * rw / sw;
			result.push(Math.round(x));
		}
	}
	
	return result;
};

/**
 * Function: layoutRow
 * 
 * Places the cells at the given positions in the given row.
 */
TableLayout.prototype.layoutRow = function(row, positions, height, tw)
{
	var model = this.graph.getModel();
	var cells = model.getChildCells(row, true);
	var off = this.graph.getActualStartSize(row, true);
	var x = off.x;
	var sw = 0;
	
	if (positions != null)
	{
		positions = positions.slice();
		positions.splice(0, 0, off.x);
	}

	for (var i = 0; i < cells.length; i++)
	{
		var geo = this.graph.getCellGeometry(cells[i]);
		
		if (geo != null)
		{
			geo = geo.clone();
			
			geo.y = off.y;
			geo.height = height - off.y - off.height;
			
			if (positions != null)
			{
				geo.x = positions[i];
				geo.width = positions[i + 1] - geo.x;

				// Fills with last geo if not enough cells
				if (i == cells.length - 1 && i < positions.length - 2)
				{
					geo.width = tw - geo.x - off.x - off.width;
				}
			}
			else
			{
				geo.x = x;
				x += geo.width;
				
				if (i == cells.length - 1)
				{
					geo.width = tw - off.x - off.width - sw;
				}
				else
				{	
					sw += geo.width;
				}
			}
		
			geo.alternateBounds = new mxRectangle(0, 0, geo.width, geo.height);
			model.setGeometry(cells[i], geo);
		}
	}
	
	return sw;
};

/**
 * Function: execute
 * 
 * Implements <mxGraphLayout.execute>.
 */
TableLayout.prototype.execute = function(parent)
{
	var table = (parent != null) ? this.graph.getCellGeometry(parent) : null;

	if (table != null)
	{
		var offset = this.graph.getActualStartSize(parent, true);
		var style = this.graph.getCellStyle(parent);
		var resizeLastRow = mxUtils.getValue(style,
			'resizeLastRow', '0') == '1';
		var resizeLast = mxUtils.getValue(style,
			'resizeLast', '0') == '1';
		var fixedRows = mxUtils.getValue(style,
			'fixedRows', '0') == '1';
		var model = this.graph.getModel();
		var sw = 0;

		model.beginUpdate();
		try
		{
			var th = table.height - offset.y - offset.height;
			var tw = table.width - offset.x - offset.width;
			var rows = model.getChildCells(parent, true);

			// Updates row visibilities
			for (var i = 0; i < rows.length; i++)
			{
				model.setVisible(rows[i], true);
			}
			
			var sh = this.getSize(rows, false);
			
			if (th > 0 && tw > 0 && rows.length > 0 && sh > 0)
			{
				if (resizeLastRow)
				{
					var row = this.graph.getCellGeometry(rows[rows.length - 1]);
					
					if (row != null)
					{
						row = row.clone();
						row.height = th - sh + row.height;
						model.setGeometry(rows[rows.length - 1], row);
					}
				}

				var pos = (resizeLast) ? null : this.getRowLayout(rows[0], tw);
				var lastCells = [];
				var y = offset.y;
			
				// Updates row geometries
				for (var i = 0; i < rows.length; i++)
				{
					var row = this.graph.getCellGeometry(rows[i]);
					
					if (row != null)
					{
						row = row.clone();
						row.x = offset.x;
						row.width = tw;
						row.y = Math.round(y);
						
						if (resizeLastRow || fixedRows)
						{
							y += row.height;
						}
						else
						{
							y += (row.height / sh) * th;
						}
						
						row.height = Math.round(y) - row.y;
						model.setGeometry(rows[i], row);

						// Updates cell geometries
						sw = Math.max(sw, this.layoutRow(rows[i], pos, row.height, tw, lastCells));
					}
				}
				
				if (fixedRows && th < sh)
				{
					table = table.clone();
					table.height = y + offset.height;
					model.setGeometry(parent, table);
				}
				
				if (resizeLast && tw < sw + Graph.minTableColumnWidth)
				{
					table = table.clone();
					table.width = sw + offset.width + offset.x + Graph.minTableColumnWidth;
					model.setGeometry(parent, table);
				}

				// All geometries cloned at this point so can change in-place below
				this.graph.visitTableCells(parent, mxUtils.bind(this, function(iter)
				{
					model.setVisible(iter.cell, iter.actual.cell == iter.cell);

					if (iter.actual.cell != iter.cell)
					{
						if (iter.actual.row == iter.row)
						{
							var g = (iter.geo.alternateBounds != null) ?
								iter.geo.alternateBounds : iter.geo;
							iter.actual.geo.width += g.width;
						}

						if (iter.actual.col == iter.col)
						{
							var g = (iter.geo.alternateBounds != null) ?
								iter.geo.alternateBounds : iter.geo;
							iter.actual.geo.height += g.height;
						}
					}
				}));
			}
			else
			{
				// Updates row visibilities
				for (var i = 0; i < rows.length; i++)
				{
					model.setVisible(rows[i], false);
				}
			}
		}
		finally
		{
			model.endUpdate();
		}
	}
};

(function()
{
	/**
	 * Reset the list of processed edges.
	 */
	var mxGraphViewResetValidationState = mxGraphView.prototype.resetValidationState;
	mxGraphView.prototype.resetValidationState = function()
	{
		mxGraphViewResetValidationState.apply(this, arguments);
		
		this.validEdges = [];
	};
	
	/**
	 * Updates jumps for valid edges and repaints if needed.
	 */
	var mxGraphViewValidateCellState = mxGraphView.prototype.validateCellState;
	mxGraphView.prototype.validateCellState = function(cell, recurse)
	{
		recurse = (recurse != null) ? recurse : true;
		var state = this.getState(cell);

		// Forces repaint if jumps change on a valid edge
		if (state != null && recurse && this.graph.model.isEdge(state.cell) &&
			state.style != null && state.style[mxConstants.STYLE_CURVED] != 1 &&
			!state.invalid && this.updateLineJumps(state))
		{
			this.graph.cellRenderer.redraw(state, false, this.isRendering());
		}

		// Updates link and tooltip overlays before redraw in base call
		if (state != null && state.invalid)
		{
			if (this.graph.showLinkIcons)
			{
				var link = this.graph.getLinkForCell(cell);
				var hasLink = link != null && link.length > 0;
				var hasOverlay = false;

				if (cell.overlays != null)
				{
					for (var i = 0; i < cell.overlays.length; i++)
					{
						if (cell.overlays[i].isLinkOverlay)
						{
							hasOverlay = true;
							break;
						}
					}
				}

				if (hasLink && !hasOverlay)
				{
					var overlay = this.graph.createLinkOverlay(cell);

					if (overlay != null)
					{
						if (cell.overlays == null)
						{
							cell.overlays = [];
						}

						cell.overlays.push(overlay);
					}
				}
				else if (!hasLink && hasOverlay)
				{
					for (var i = cell.overlays.length - 1; i >= 0; i--)
					{
						if (cell.overlays[i].isLinkOverlay)
						{
							cell.overlays.splice(i, 1);
						}
					}

					if (cell.overlays.length == 0)
					{
						cell.overlays = null;
					}
				}
			}
			else if (cell.overlays != null)
			{
				for (var i = cell.overlays.length - 1; i >= 0; i--)
				{
					if (cell.overlays[i].isLinkOverlay)
					{
						cell.overlays.splice(i, 1);
					}
				}

				if (cell.overlays.length == 0)
				{
					cell.overlays = null;
				}
			}

			if (this.graph.showTooltipIcons)
			{
				var tooltip = this.graph.convertValueToTooltip(cell);
				var hasTooltip = tooltip != null && tooltip.length > 0;
				var hasTooltipOverlay = false;

				if (cell.overlays != null)
				{
					for (var i = 0; i < cell.overlays.length; i++)
					{
						if (cell.overlays[i].isTooltipOverlay)
						{
							hasTooltipOverlay = true;
							break;
						}
					}
				}

				if (hasTooltip && !hasTooltipOverlay)
				{
					var overlay = this.graph.createTooltipOverlay(cell);

					if (overlay != null)
					{
						if (cell.overlays == null)
						{
							cell.overlays = [];
						}

						cell.overlays.push(overlay);
					}
				}
				else if (!hasTooltip && hasTooltipOverlay)
				{
					for (var i = cell.overlays.length - 1; i >= 0; i--)
					{
						if (cell.overlays[i].isTooltipOverlay)
						{
							cell.overlays.splice(i, 1);
						}
					}

					if (cell.overlays.length == 0)
					{
						cell.overlays = null;
					}
				}
			}
			else if (cell.overlays != null)
			{
				for (var i = cell.overlays.length - 1; i >= 0; i--)
				{
					if (cell.overlays[i].isTooltipOverlay)
					{
						cell.overlays.splice(i, 1);
					}
				}

				if (cell.overlays.length == 0)
				{
					cell.overlays = null;
				}
			}
		}

		state = mxGraphViewValidateCellState.apply(this, arguments);

		// Adds to the list of edges that may intersect with later edges
		if (state != null && recurse && this.graph.model.isEdge(state.cell) &&
			state.style != null && state.style[mxConstants.STYLE_CURVED] != 1)
		{
			// LATER: Reuse jumps for valid edges
			this.validEdges.push(state);
		}

		return state;
	};

	mxShape.prototype.isFlowAnimationEnabled = function()
	{
		return this.state != null && this.state.view.graph.enableFlowAnimation &&
			this.state.view.graph.model.isEdge(this.state.cell) &&
			mxUtils.getValue(this.state.style, 'flowAnimation', '0') == '1';
	};

	mxShape.prototype.getFlowAnimationPath = function(index)
	{
		var paths = (this.node != null) ? this.node.
			getElementsByTagName('path') : null;

		if (paths != null)
		{
			var d = null;
			var matched = false;

			// Returns the first (or index-th) visible line stroke
			for (var i = 0; i < paths.length; i++)
			{
				var path = paths[i];

				if (path.getAttribute('visibility') == 'hidden')
				{
					// Tracks the hit tolerance clone that precedes each
					// stroked path: for sketch=1 the rough.js stroke only
					// matches its own clone's d, never the plain hit path's.
					// Frozen once a counted match locked the line geometry,
					// so a marker's clone cannot re-seed an indexed walk
					// (PipeShape uses index=2 to reach the inner stroke).
					if (!matched)
					{
						d = path.getAttribute('d');
					}
				}
				else if (path.getAttribute('stroke') == 'none')
				{
					// Event-only path: the sketch=1 double paint emits the
					// plain geometry as an invisible hit path (no visibility
					// attribute) before the rough.js paths. It consumes its
					// own tolerance clone, so the next stroked path is
					// accepted even without a clone of its own (the sketch
					// paint bypasses addTolerance for filled shapes).
					if (!matched && d == path.getAttribute('d'))
					{
						d = null;
					}
				}
				else if (path.getAttribute('data-rough-fill') == null &&
					(d == null || d == path.getAttribute('d')))
				{
					// Skips rough.js hachure fill paths (data-rough-fill),
					// which are stroked in the fill color.
					if (index == null || --index == 0)
					{
						return path;
					}

					// Locks the line geometry for indexed walks
					d = path.getAttribute('d');
					matched = true;
				}
			}
		}

		return null;
	};

	mxShape.prototype.addFlowAnimationToShape = function()
	{
		if (this.state != null)
		{
			this.state.view.graph.addFlowAnimationToNode(
				this.getFlowAnimationPath(), this.state.style, this.state.view.scale,
				this.state.view.graph.addFlowAnimationStyle());
		}
	};
	
	/**
	 * Overrides paint to add flowAnimation style.
	 */
	var mxShapePaint = mxShape.prototype.paint;
	
	mxShape.prototype.paint = function(canvas)
	{
		mxShapePaint.apply(this, arguments);

		if (this.isFlowAnimationEnabled())
		{
			this.addFlowAnimationToShape();
		}
	};
	
	/**
	 * Overrides createSvgCanvas to add adaptiveColors.
	 */
	var mxShapeCreateSvgCanvas = mxShape.prototype.createSvgCanvas;
	
	mxShape.prototype.createSvgCanvas = function(canvas)
	{
		var canvas = mxShapeCreateSvgCanvas.apply(this, arguments);

		if (this.state != null)
		{
			canvas.adaptiveColors = this.state.view.graph.getAdaptiveColors();
		}
		
		return canvas;
	};

	/**
	 * Forces repaint if routed points have changed.
	 */
	var mxCellRendererIsShapeInvalid = mxCellRenderer.prototype.isShapeInvalid;
	mxCellRenderer.prototype.isShapeInvalid = function(state, shape)
	{
		return mxCellRendererIsShapeInvalid.apply(this, arguments) ||
			(state.routedPoints != null && shape.routedPoints != null &&
			!mxUtils.equalPoints(shape.routedPoints, state.routedPoints))
	};

	/**
	 * Updates jumps for invalid edges.
	 */
	var mxGraphViewUpdateCellState = mxGraphView.prototype.updateCellState;
	mxGraphView.prototype.updateCellState = function(state)
	{
		mxGraphViewUpdateCellState.apply(this, arguments);

		// Derives the visible bounds of a transparentBounds cell from
		// getTransparentBounds (children union expanded by padding and, for
		// swimlanes, the title-bar start size — encoded so it lands on the
		// correct edge: x for left, y for top, width for right, height for
		// bottom). The stored geometry stays at (0,0,0,0), so state.origin
		// still points at the group's parent origin and is left untouched
		// (children compute their state.x from it).
		if (this.graph.model.isVertex(state.cell) &&
			this.graph.isTransparentBounds(state.cell))
		{
			var bounds = this.graph.getTransparentBounds(state.cell);

			if (bounds != null)
			{
				state.x = this.scale * (this.translate.x + state.origin.x +
					bounds.x);
				state.y = this.scale * (this.translate.y + state.origin.y +
					bounds.y);
				state.width = this.scale * bounds.width;
				state.height = this.scale * bounds.height;
				state.unscaledWidth = bounds.width;
				state.unscaledHeight = bounds.height;
			}
			else
			{
				state.width = 0;
				state.height = 0;
				state.unscaledWidth = 0;
				state.unscaledHeight = 0;
			}
		}

		// Updates jumps on invalid edge before repaint
		if (this.graph.model.isEdge(state.cell) &&
			state.style[mxConstants.STYLE_CURVED] != 1)
		{
			this.updateLineJumps(state);
		}
	};

	/**
	 * mxMorphing animates each cell from its pre-update visual position to its
	 * post-update model position by computing delta = origin - state.x where
	 * `origin` comes from getOriginForCell (geometry-only) and `state.x` is
	 * the rendered position. For a transparentBounds cell, the updateCellState
	 * override above adds the child-derived `bounds.x` to state.x so the
	 * visible box hugs the children — but origin doesn't include that offset,
	 * so the morph reads a constant non-zero delta even when nothing changed
	 * and animates the group outward; the preview offset isn't fully unwound
	 * when the animation ends, leaving the group visually displaced until the
	 * next re-validate (e.g. window resize).
	 *
	 * Forcing delta = 0 for transparentBounds cells fixes this without side
	 * effects: the group's stored geometry is pinned (drags translate the
	 * children, not the group itself), so its model-position never actually
	 * moves and there is nothing to animate. Children of the group still get
	 * their own delta computed normally — if a layout moves a child, that
	 * child still animates from pre to post position.
	 */
	var mxMorphingGetDelta = mxMorphing.prototype.getDelta;
	mxMorphing.prototype.getDelta = function(state)
	{
		if (state != null && state.cell != null &&
			this.graph.isTransparentBounds != null &&
			this.graph.isTransparentBounds(state.cell))
		{
			return new mxPoint(0, 0);
		}

		return mxMorphingGetDelta.apply(this, arguments);
	};

	/**
	 * Updates the jumps between given state and processed edges.
	 */
	mxGraphView.prototype.updateLineJumps = function(state)
	{
		var pts = state.absolutePoints;
		
		if (Graph.lineJumpsEnabled)
		{
			var changed = state.routedPoints != null;
			var actual = null;
			
			if (pts != null && this.validEdges != null &&
				mxUtils.getValue(state.style, 'jumpStyle', 'none') !== 'none')
			{
				var thresh = 0.5 * this.scale;
				changed = false;
				actual = [];
				
				// Type 0 means normal waypoint, 1 means jump
				function addPoint(type, x, y)
				{
					var rpt = new mxPoint(x, y);
					rpt.type = type;
					
					actual.push(rpt);
					var curr = (state.routedPoints != null) ? state.routedPoints[actual.length - 1] : null;
					
					return curr == null || curr.type != type || curr.x != x || curr.y != y;
				};

				for (var i = 0; i < pts.length - 1; i++)
				{
					var p1 = pts[i + 1];
					var p0 = pts[i];
					var list = [];
					
					// Ignores waypoints on straight segments
					var pn = pts[i + 2];
					
					while (i < pts.length - 2 &&
						mxUtils.ptSegDistSq(p0.x, p0.y, pn.x, pn.y,
						p1.x, p1.y) < 1 * this.scale * this.scale)
					{
						p1 = pn;
						i++;
						pn = pts[i + 2];
					}
					
					changed = addPoint(0, p0.x, p0.y) || changed;
					
					// Processes all previous edges
					for (var e = 0; e < this.validEdges.length; e++)
					{
						var state2 = this.validEdges[e];
						var pts2 = state2.absolutePoints;

						if (pts2 != null && mxUtils.intersects(state, state2) && state2.style['noJump'] != '1')
						{
							var pl = null;
							
							// Compares each segment of the edge with the current segment
							for (var j = 0; j < pts2.length - 1; j++)
							{
								var p3 = pts2[j + 1];
								var p2 = pts2[j];
								
								// Ignores waypoints on straight segments
								pn = pts2[j + 2];
								
								while (j < pts2.length - 2 &&
									mxUtils.ptSegDistSq(p2.x, p2.y, pn.x, pn.y,
									p3.x, p3.y) < 1 * this.scale * this.scale)
								{
									p3 = pn;
									j++;
									pn = pts2[j + 2];
								}
								
								var pt = mxUtils.intersection(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

								// Handles intersection between two segments
								if (pt != null && (Math.abs(pt.x - p0.x) > thresh ||
									Math.abs(pt.y - p0.y) > thresh) &&
									(Math.abs(pt.x - p1.x) > thresh ||
									Math.abs(pt.y - p1.y) > thresh) &&
									// Removes jumps on overlapping incoming segments
									(pl == null || mxUtils.ptLineDist(p0.x, p0.y, p1.x, p1.y, pl.x, pl.y) > thresh ||
									mxUtils.ptLineDist(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y) > thresh) &&
									// Removes jumps on overlapping outgoing segments
									(pn == null || mxUtils.ptLineDist(p0.x, p0.y, p1.x, p1.y, pn.x, pn.y) > thresh ||
									mxUtils.ptLineDist(p0.x, p0.y, p1.x, p1.y, p3.x, p3.y) > thresh))
								{
									var dx = pt.x - p0.x;
									var dy = pt.y - p0.y;
									var temp = {distSq: dx * dx + dy * dy, x: pt.x, y: pt.y};
								
									// Intersections must be ordered by distance from start of segment
									for (var t = 0; t < list.length; t++)
									{
										if (list[t].distSq > temp.distSq)
										{
											list.splice(t, 0, temp);
											temp = null;
											
											break;
										}
									}
									
									// Ignores multiple intersections at segment joint
									if (temp != null && (list.length == 0 ||
										list[list.length - 1].x !== temp.x ||
										list[list.length - 1].y !== temp.y))
									{
										list.push(temp);
									}
								}

								pl = p2;
							}
						}
					}
					
					// Adds ordered intersections to routed points
					for (var j = 0; j < list.length; j++)
					{
						changed = addPoint(1, list[j].x, list[j].y) || changed;
					}
				}
	
				var pt = pts[pts.length - 1];
				changed = addPoint(0, pt.x, pt.y) || changed;
			}
			
			state.routedPoints = actual;
			
			return changed;
		}
		else
		{
			return false;
		}
	};
	
	/**
	 * Overrides painting the actual shape for taking into account jump style.
	 */
	var mxConnectorPaintLine = mxConnector.prototype.paintLine;

	mxConnector.prototype.paintLine = function (c, absPts, rounded)
	{
		// Required for checking dirty state
		this.routedPoints = (this.state != null) ? this.state.routedPoints : null;
		
		if (this.outline || this.state == null || this.style == null ||
			this.state.routedPoints == null || this.state.routedPoints.length == 0)
		{
			mxConnectorPaintLine.apply(this, arguments);
		}
		else
		{
			var arcSize = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE,
				mxConstants.LINE_ARCSIZE) / 2;
			var size = (parseInt(mxUtils.getValue(this.style, 'jumpSize',
				Graph.defaultJumpSize)) - 2) / 2 + this.strokewidth;
			var style = mxUtils.getValue(this.style, 'jumpStyle', 'none');
			var moveTo = true;
			var last = null;
			var len = null;
			var pts = [];
			var n = null;
			c.begin();
			
			for (var i = 0; i < this.state.routedPoints.length; i++)
			{
				var rpt = this.state.routedPoints[i];
				var pt = new mxPoint(rpt.x / this.scale, rpt.y / this.scale);
				
				// Takes first and last point from passed-in array
				if (i == 0)
				{
					pt = absPts[0];
				}
				else if (i == this.state.routedPoints.length - 1)
				{
					pt = absPts[absPts.length - 1];
				}
				
				var done = false;

				// Type 1 is an intersection
				if (last != null && rpt.type == 1)
				{
					// Checks if next/previous points are too close
					var next = this.state.routedPoints[i + 1];
					var dx = next.x / this.scale - pt.x;
					var dy = next.y / this.scale - pt.y;
					var dist = dx * dx + dy * dy;

					if (n == null)
					{
						n = new mxPoint(pt.x - last.x, pt.y - last.y);
						len = Math.sqrt(n.x * n.x + n.y * n.y);
						
						if (len > 0)
						{
							n.x = n.x * size / len;
							n.y = n.y * size / len;
						}
						else
						{
							n = null;
						}
					}
					
					if (dist > size * size && len > 0)
					{
						var dx = last.x - pt.x;
						var dy = last.y - pt.y;
						var dist = dx * dx + dy * dy;
						
						if (dist > size * size)
						{
							var p0 = new mxPoint(pt.x - n.x, pt.y - n.y);
							var p1 = new mxPoint(pt.x + n.x, pt.y + n.y);
							pts.push(p0);
							
							this.addPoints(c, pts, rounded, arcSize, false, null, moveTo);
							
							var f = (Math.round(n.x) < 0 || (Math.round(n.x) == 0
									&& Math.round(n.y) <= 0)) ? 1 : -1;
							moveTo = false;

							if (style == 'sharp')
							{
								c.lineTo(p0.x - n.y * f, p0.y + n.x * f);
								c.lineTo(p1.x - n.y * f, p1.y + n.x * f);
								c.lineTo(p1.x, p1.y);
							}
							else if (style == 'line')
							{
								c.moveTo(p0.x + n.y * f, p0.y - n.x * f);
								c.lineTo(p0.x - n.y * f, p0.y + n.x * f);
								c.moveTo(p1.x - n.y * f, p1.y + n.x * f);
								c.lineTo(p1.x + n.y * f, p1.y - n.x * f);
								c.moveTo(p1.x, p1.y);
							}
							else if (style == 'arc')
							{
								f *= 1.3;
								c.curveTo(p0.x - n.y * f, p0.y + n.x * f,
									p1.x - n.y * f, p1.y + n.x * f,
									p1.x, p1.y);
							}
							else
							{
								c.moveTo(p1.x, p1.y);
								moveTo = true;
							}
	
							pts = [p1];
							done = true;
						}
					}
				}
				else
				{
					n = null;
				}
				
				if (!done)
				{
					pts.push(pt);
					last = pt;
				}
			}
			
			this.addPoints(c, pts, rounded, arcSize, false, null, moveTo);
			c.stroke();
		}
	};
	
	/**
	 * Adds support for centerPerimeter which is a special case of a fixed point perimeter.
	 */
	var mxGraphViewGetFixedTerminalPoint = mxGraphView.prototype.getFixedTerminalPoint;
	
	mxGraphView.prototype.getFixedTerminalPoint = function(edge, terminal, source, constraint)
	{
		if (terminal != null && terminal.style[mxConstants.STYLE_PERIMETER] == 'centerPerimeter')
		{
			return new mxPoint(terminal.getCenterX(), terminal.getCenterY());
		}
		else
		{
			return mxGraphViewGetFixedTerminalPoint.apply(this, arguments);
		}
	};

	/**
	 * Adds support for snapToPoint style.
	 */
	var mxGraphViewUpdateFloatingTerminalPoint = mxGraphView.prototype.updateFloatingTerminalPoint;
	
	mxGraphView.prototype.updateFloatingTerminalPoint = function(edge, start, end, source)
	{
		if (start != null && edge != null &&
			(start.style['snapToPoint'] == '1' ||
			edge.style['snapToPoint'] == '1'))
		{
		    start = this.getTerminalPort(edge, start, source);
		    var next = this.getNextPoint(edge, end, source);
		    
		    var orth = this.graph.isOrthogonal(edge);
		    var alpha = mxUtils.toRadians(Number(start.style[mxConstants.STYLE_ROTATION] || '0'));
		    var center = new mxPoint(start.getCenterX(), start.getCenterY());
		    
		    if (alpha != 0)
		    {
		        var cos = Math.cos(-alpha);
		        var sin = Math.sin(-alpha);
		        next = mxUtils.getRotatedPoint(next, cos, sin, center);
		    }
		    
		    var border = parseFloat(edge.style[mxConstants.STYLE_PERIMETER_SPACING] || 0);
		    border += parseFloat(edge.style[(source) ?
		        mxConstants.STYLE_SOURCE_PERIMETER_SPACING :
		        mxConstants.STYLE_TARGET_PERIMETER_SPACING] || 0);
		    var pt = this.getPerimeterPoint(start, next, alpha == 0 && orth, border);
		
		    if (alpha != 0)
		    {
		        var cos = Math.cos(alpha);
		        var sin = Math.sin(alpha);
		        pt = mxUtils.getRotatedPoint(pt, cos, sin, center);
		    }
		    
		    edge.setAbsoluteTerminalPoint(this.snapToAnchorPoint(edge, start, end, source, pt), source);
		}
		else
		{
			mxGraphViewUpdateFloatingTerminalPoint.apply(this, arguments);
		}
	};

	mxGraphView.prototype.snapToAnchorPoint = function(edge, start, end, source, pt)
	{
		if (start != null && edge != null)
		{
	        var constraints = this.graph.getAllConnectionConstraints(start)
	        var nearest = null;
	        var dist = null;
	    
	        if (constraints != null)
	        {
		        for (var i = 0; i < constraints.length; i++)
		        {
		            var cp = this.graph.getConnectionPoint(start, constraints[i]);
		            
		            if (cp != null)
		            {
		                var tmp = (cp.x - pt.x) * (cp.x - pt.x) + (cp.y - pt.y) * (cp.y - pt.y);
		            
		                if (dist == null || tmp < dist)
		                {
		                    nearest = cp;
		                    dist = tmp;
		                }
		            }
		        }
	        }
	        
	        if (nearest != null)
	        {
	            pt = nearest;
	        }
		}
		
		return pt;
	};
		
	/**
	 * Adds support for placeholders in text elements of shapes.
	 */
	var mxStencilEvaluateTextAttribute = mxStencil.prototype.evaluateTextAttribute;
	
	mxStencil.prototype.evaluateTextAttribute = function(node, attribute, shape)
	{
		var result = mxStencilEvaluateTextAttribute.apply(this, arguments);
		var placeholders = node.getAttribute('placeholders');
		
		if (placeholders == '1' && shape.state != null)
		{
			result = shape.state.view.graph.replacePlaceholders(shape.state.cell, result);
		}
		
		return result;
	};
		
	/**
	 * Adds custom stencils defined via shape=stencil(value) style. The value is a base64 encoded, compressed and
	 * URL encoded XML definition of the shape according to the stencil definition language of mxGraph.
	 * 
	 * Needs to be in this file to make sure its part of the embed client code. Also the check for ZLib is
	 * different than for the Editor code.
	 */
	var mxCellRendererCreateShape = mxCellRenderer.prototype.createShape;
	mxCellRenderer.prototype.createShape = function(state)
	{
		if (state.style != null && typeof(pako) !== 'undefined')
		{
	    	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	    	// Extracts and decodes stencil XML if shape has the form shape=stencil(value)
	    	if (shape != null && typeof shape === 'string' && shape.substring(0, 8) == 'stencil(')
	    	{
	    		try
	    		{
	    			var stencil = shape.substring(8, shape.length - 1);
	    			var doc = mxUtils.parseXml(Graph.decompress(stencil));
	    			
	    			return new mxShape(new mxStencil(doc.documentElement));
	    		}
	    		catch (e)
	    		{
	    			if (window.console != null)
	    			{
	    				console.log('Error in shape: ' + e);
	    			}
	    		}
	    	}
		}
		
		return mxCellRendererCreateShape.apply(this, arguments);
	};
})();

/**
 * Overrides stencil registry for dynamic loading of stencils.
 */
/**
 * Maps from library names to an array of Javascript filenames,
 * which are synchronously loaded. Currently only stencil files
 * (.xml) and JS files (.js) are supported.
 * IMPORTANT: For embedded diagrams to work entries must also
 * be added in EmbedServlet.java.
 */
mxStencilRegistry.libraries = {};

/**
 * Global switch to disable dynamic loading.
 */
mxStencilRegistry.dynamicLoading = true;

/**
 * Global switch to disable eval for JS (preload all JS instead).
 */
mxStencilRegistry.allowEval = true;

/**
 * Stores all package names that have been dynamically loaded.
 * Each package is only loaded once.
 */
mxStencilRegistry.packages = [];

/**
 * Stores all package names that have been dynamically loaded.
 * Each package is only loaded once.
 */
mxStencilRegistry.filesLoaded = {};

/**
 * Returns true if the given file has been loaded.
 */
mxStencilRegistry.isFileLoaded = function(name)
{
	// Workaround for asynchronous loading of stencils in Firefox
	// even if the XML request was marked as being synchronous
	return !mxClient.IS_FF && mxStencilRegistry.filesLoaded[name];
};

/**
 * Marks the given file as loaded.
 */
mxStencilRegistry.setFileLoaded = function(name)
{
	mxStencilRegistry.filesLoaded[name] = true;
};

// Extends the default stencil registry to add dynamic loading
mxStencilRegistry.getStencil = function(name)
{
	var result = mxStencilRegistry.stencils[name];
	
	if (result == null && mxCellRenderer.defaultShapes[name] == null && mxStencilRegistry.dynamicLoading)
	{
		var basename = mxStencilRegistry.getBasenameForStencil(name);
		
		// Loads stencil files and tries again
		if (basename != null)
		{
			var libs = mxStencilRegistry.libraries[basename];

			if (libs != null)
			{
				if (mxStencilRegistry.packages[basename] == null)
				{
					for (var i = 0; i < libs.length; i++)
					{
						var fname = libs[i];
						
						if (!mxStencilRegistry.isFileLoaded(fname))
						{
							mxStencilRegistry.setFileLoaded(fname);

							if (fname.toLowerCase().substring(fname.length - 4, fname.length) == '.xml')
							{
								mxStencilRegistry.loadStencilSet(fname, null);
							}
							else if (fname.toLowerCase().substring(fname.length - 3, fname.length) == '.js')
							{
								try
								{
									if (mxStencilRegistry.allowEval)
									{
										var req = mxUtils.load(fname);
										
										if (req != null && req.getStatus() >= 200 && req.getStatus() <= 299)
										{
											eval.call(window, req.getText());
										}
									}
								}
								catch (e)
								{
									if (window.console != null)
									{
										console.log('error in getStencil:', name, basename, libs, fname, e);
									}
								}
							}
							else
							{
								// FIXME: This does not yet work as the loading is triggered after
								// the shape was used in the graph, at which point the keys have
								// typically been translated in the calling method.
								//mxResources.add(fname);
							}
						}
					}

					mxStencilRegistry.packages[basename] = 1;
				}
			}
			else
			{
				// Replaces '_-_' with '_'
				basename = basename.replace('_-_', '_');
				mxStencilRegistry.loadStencilSet(STENCIL_PATH + '/' + basename + '.xml', null);
			}
			
			result = mxStencilRegistry.stencils[name];
		}
	}
	
	return result;
};

// Returns the basename for the given stencil or null if no file must be
// loaded to render the given stencil.
mxStencilRegistry.getBasenameForStencil = function(name)
{
	var tmp = null;
	
	if (name != null && typeof name === 'string')
	{
		var parts = name.split('.');
		
		if (parts.length > 0 && parts[0] == 'mxgraph')
		{
			tmp = parts[1];
			
			for (var i = 2; i < parts.length - 1; i++)
			{
				tmp += '/' + parts[i];
			}
		}
	}

	return tmp;
};

// Loads the given stencil set
mxStencilRegistry.loadStencilSet = function(stencilFile, postStencilLoad, force, async)
{
	force = (force != null) ? force : false;
	
	// Uses additional cache for detecting previous load attempts
	var xmlDoc = mxStencilRegistry.packages[stencilFile];
	
	if (force || xmlDoc == null)
	{
		var install = false;
		
		if (xmlDoc == null)
		{
			try
			{
				if (async)
				{
					mxStencilRegistry.loadStencil(stencilFile, mxUtils.bind(this, function(xmlDoc2)
					{
						if (xmlDoc2 != null && xmlDoc2.documentElement != null)
						{
							mxStencilRegistry.packages[stencilFile] = xmlDoc2;
							install = true;
							mxStencilRegistry.parseStencilSet(xmlDoc2.documentElement, postStencilLoad, install);
						}
					}));
				
					return;
				}
				else
				{
					xmlDoc = mxStencilRegistry.loadStencil(stencilFile);
					mxStencilRegistry.packages[stencilFile] = xmlDoc;
					install = true;
				}
			}
			catch (e)
			{
				if (window.console != null)
				{
					console.log('error in loadStencilSet:', stencilFile, e);
				}
			}
		}
	
		if (xmlDoc != null && xmlDoc.documentElement != null)
		{
			mxStencilRegistry.parseStencilSet(xmlDoc.documentElement, postStencilLoad, install);
		}
	}
};

// Loads the given stencil XML file.
mxStencilRegistry.loadStencil = function(filename, fn)
{
	if (fn != null)
	{
		var req = mxUtils.get(filename, mxUtils.bind(this, function(req)
		{
			fn((req.getStatus() >= 200 && req.getStatus() <= 299) ? req.getXml() : null);
		}), mxUtils.bind(this, function(req)
		{
			fn(null);	
		}));
	}
	else
	{
		return mxUtils.load(filename).getXml();
	}
};

// Takes array of strings
mxStencilRegistry.parseStencilSets = function(stencils)
{
	for (var i = 0; i < stencils.length; i++)
	{
		mxStencilRegistry.parseStencilSet(mxUtils.parseXml(stencils[i]).documentElement);
	}
};

// Parses the given stencil set
mxStencilRegistry.parseStencilSet = function(root, postStencilLoad, install)
{
	if (root.nodeName == 'stencils')
	{
		var shapes = root.firstChild;
		
		while (shapes != null)
		{
			if (shapes.nodeName == 'shapes')
			{
				mxStencilRegistry.parseStencilSet(shapes, postStencilLoad, install);
			}
			
			shapes = shapes.nextSibling;
		}
	}
	else
	{
		install = (install != null) ? install : true;
		var shape = root.firstChild;
		var packageName = '';
		var name = root.getAttribute('name');
		
		if (name != null)
		{
			packageName = name + '.';
		}
		
		while (shape != null)
		{
			if (shape.nodeType == mxConstants.NODETYPE_ELEMENT)
			{
				name = shape.getAttribute('name');
				
				if (name != null)
				{
					packageName = packageName.toLowerCase();
					var stencilName = name.replace(/ /g,"_");
						
					if (install)
					{
						mxStencilRegistry.addStencil(packageName + stencilName.toLowerCase(), new mxStencil(shape));
					}
	
					if (postStencilLoad != null)
					{
						var w = shape.getAttribute('w');
						var h = shape.getAttribute('h');
						
						w = (w == null) ? 80 : parseInt(w, 10);
						h = (h == null) ? 80 : parseInt(h, 10);
	
						postStencilLoad(packageName, stencilName, name, w, h);
					}
				}
			}
			
			shape = shape.nextSibling;
		}
	}
};

/**
 * These overrides are only added if mxVertexHandler is defined (ie. not in embedded graph)
 */
if (typeof mxVertexHandler !== 'undefined')
{
	(function()
	{
		// Sets colors for handles
		mxConstants.HANDLE_FILLCOLOR = '#29b6f2';
		mxConstants.HANDLE_STROKECOLOR = '#0088cf';
		mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';
		mxConstants.OUTLINE_COLOR = '#00a8ff';
		mxConstants.OUTLINE_HANDLE_FILLCOLOR = '#99ccff';
		mxConstants.OUTLINE_HANDLE_STROKECOLOR = '#00a8ff';
		mxConstants.CONNECT_HANDLE_FILLCOLOR = '#cee7ff';
		mxConstants.EDGE_SELECTION_COLOR = '#00a8ff';
		mxConstants.DEFAULT_VALID_COLOR = '#00a8ff';
		mxConstants.LABEL_HANDLE_FILLCOLOR = '#cee7ff';
		mxConstants.GUIDE_COLOR = '#0088cf';
		mxConstants.HIGHLIGHT_STROKEWIDTH = 5;
		mxConstants.HIGHLIGHT_OPACITY = 50;
	    mxConstants.HIGHLIGHT_SIZE = 5;

		// Sets window decoration icons
		mxWindow.prototype.closeImage = Graph.createSvgImage(18, 10,
			'<path d="M 5 1 L 13 9 M 13 1 L 5 9" stroke="#707070" stroke-width="2"/>').src;
		mxWindow.prototype.minimizeImage = Graph.createSvgImage(14, 10,
			'<path d="M 3 7 L 7 3 L 11 7" stroke="#707070" stroke-width="2" fill="none"/>').src;
		mxWindow.prototype.normalizeImage = Graph.createSvgImage(14, 10,
			'<path d="M 3 3 L 7 7 L 11 3" stroke="#707070" stroke-width="2" fill="none"/>').src;
		mxWindow.prototype.resizeImage = Graph.createSvgImage(10, 10,
			'<path d="Z" stroke="#C0C0C0" stroke-width="1" fill="none"/>').src;
		
		// Enables snapping to off-grid terminals for edge waypoints
		mxEdgeHandler.prototype.snapToTerminals = true;
	
		// Enables guides
		mxGraphHandler.prototype.guidesEnabled = true;
		
		// Removes parents where all child cells are moved out
		mxGraphHandler.prototype.removeEmptyParents = true;
	
		// Enables fading of rubberband
		mxRubberband.prototype.fadeOut = true;
		
		// Alt-move disables guides
		mxGuide.prototype.isEnabledForEvent = function(evt)
		{
			return !mxEvent.isAltDown(evt) || mxEvent.isShiftDown(evt);
		};
		
		// Ignores all table cells in layouts
		var graphLayoutIsVertexIgnored = mxGraphLayout.prototype.isVertexIgnored; 
		mxGraphLayout.prototype.isVertexIgnored = function(vertex)
		{
			return graphLayoutIsVertexIgnored.apply(this, arguments) ||
				this.graph.isTableRow(vertex) || this.graph.isTableCell(vertex);
		};
			
		// Adds support for ignoreEdge style
		var graphLayoutIsEdgeIgnored = mxGraphLayout.prototype.isEdgeIgnored; 
		mxGraphLayout.prototype.isEdgeIgnored = function(edge)
		{
			return graphLayoutIsEdgeIgnored.apply(this, arguments) ||
				this.graph.isEdgeIgnored(edge);
		};

		// Extends connection handler to enable ctrl+drag for cloning source cell
		// since copyOnConnect is now disabled by default
		var mxConnectionHandlerCreateTarget = mxConnectionHandler.prototype.isCreateTarget;
		mxConnectionHandler.prototype.isCreateTarget = function(evt)
		{
			return this.graph.isCloneEvent(evt) != mxConnectionHandlerCreateTarget.apply(this, arguments);
		};

		// Overrides highlight shape for connection points
		mxConstraintHandler.prototype.createHighlightShape = function()
		{
			var hl = new mxEllipse(null, this.highlightColor, this.highlightColor, 0);
			hl.opacity = mxConstants.HIGHLIGHT_OPACITY;
			
			return hl;
		};
		
		// Overrides edge preview to use current edge shape and default style
		mxConnectionHandler.prototype.livePreview = true;
		mxConnectionHandler.prototype.cursor = 'crosshair';
		
		// Uses current edge style for connect preview
		mxConnectionHandler.prototype.createEdgeState = function(me)
		{
			var style = this.graph.createCurrentEdgeStyle();
			var edge = this.graph.createEdge(null, null, null, null, null, style);
			var state = new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
			
			for (var key in this.graph.currentEdgeStyle)
			{
				state.style[key] = this.graph.currentEdgeStyle[key];
			}
			
			// Applies newEdgeStyle for preview
			if (this.previous != null)
			{
				var temp = this.previous.style['newEdgeStyle'];
				
				if (temp != null)
				{
					try
					{
						var styles = Graph.decodeNewEdgeStyle(temp);

						for (var key in styles)
						{
							state.style[key] = styles[key];
						}
					}
					catch (e)
					{
						// ignore
					}
				}
			}

			state.style = this.graph.postProcessCellStyle(state.cell, state.style);
			
			return state;
		};

		// Overrides dashed state with current edge style
		var connectionHandlerCreateShape = mxConnectionHandler.prototype.createShape;
		mxConnectionHandler.prototype.createShape = function()
		{
			var shape = connectionHandlerCreateShape.apply(this, arguments);
			
			shape.isDashed = this.graph.currentEdgeStyle[mxConstants.STYLE_DASHED] == '1';
			
			return shape;
		}
		
		// Overrides live preview to keep current style
		mxConnectionHandler.prototype.updatePreview = function(valid)
		{
			// do not change color of preview
		};
		
		// Overrides connection handler to ignore edges instead of not allowing connections
		var mxConnectionHandlerCreateMarker = mxConnectionHandler.prototype.createMarker;
		mxConnectionHandler.prototype.createMarker = function()
		{
			var marker = mxConnectionHandlerCreateMarker.apply(this, arguments);
		
			var markerGetCell = marker.getCell;
			marker.getCell = mxUtils.bind(this, function(me)
			{
				var result = markerGetCell.apply(this, arguments);
			
				this.error = null;
				
				return result;
			});
			
			return marker;
		};

		/**
		 * 
		 */
		Graph.prototype.defaultVertexStyle = {};

		/**
		 * Contains the default style for edges.
		 */
		Graph.prototype.defaultEdgeStyle = {'edgeStyle': 'orthogonalEdgeStyle', 'rounded': '0',
			'jettySize': 'auto', 'orthogonalLoop': '1'};

		/**
		 * Returns the current edge style as a string.
		 */
		Graph.prototype.createCurrentEdgeStyle = function()
		{
			var style = 'edgeStyle=' + (this.currentEdgeStyle['edgeStyle'] || 'none') + ';';
			var keys = ['shape', 'curved', 'rounded', 'comic', 'sketch', 'fillWeight', 'hachureGap',
				'hachureAngle', 'jiggle', 'disableMultiStroke', 'disableMultiStrokeFill', 'fillStyle',
				'curveFitting', 'simplification', 'comicStyle', 'jumpStyle', 'jumpSize', 'libavoidRouting'];
			
			for (var i = 0; i < keys.length; i++)
			{
				if (this.currentEdgeStyle[keys[i]] != null)
				{
					style += keys[i] + '=' + this.currentEdgeStyle[keys[i]] + ';';
				}
			}
			
			// Overrides the global default to match the default edge style
			if (this.currentEdgeStyle['orthogonalLoop'] != null)
			{
				style += 'orthogonalLoop=' + this.currentEdgeStyle['orthogonalLoop'] + ';';
			}
			else if (Graph.prototype.defaultEdgeStyle['orthogonalLoop'] != null)
			{
				style += 'orthogonalLoop=' + Graph.prototype.defaultEdgeStyle['orthogonalLoop'] + ';';
			}

			// Overrides the global default to match the default edge style
			if (this.currentEdgeStyle['jettySize'] != null)
			{
				style += 'jettySize=' + this.currentEdgeStyle['jettySize'] + ';';
			}
			else if (Graph.prototype.defaultEdgeStyle['jettySize'] != null)
			{
				style += 'jettySize=' + Graph.prototype.defaultEdgeStyle['jettySize'] + ';';
			}
			
			// Special logic for custom property of elbowEdgeStyle
			if (this.currentEdgeStyle['edgeStyle'] == 'elbowEdgeStyle' && this.currentEdgeStyle['elbow'] != null)
			{
				style += 'elbow=' + this.currentEdgeStyle['elbow'] + ';';
			}
			
			if (this.currentEdgeStyle['html'] != null)
			{
				style += 'html=' + this.currentEdgeStyle['html'] + ';';
			}
			else
			{
				style += 'html=1;';
			}
			
			return style;
		};

		/**
		 * Hook for subclassers.
		 */
		Graph.prototype.getPagePadding = function()
		{
			return new mxPoint(0, 0);
		};
		
		/**
		 * Loads the stylesheet for this graph.
		 */
		Graph.prototype.loadStylesheet = function()
		{
			var node = (this.themes != null) ? this.themes[this.defaultThemeName] :
				(!mxStyleRegistry.dynamicLoading) ? null :
				mxUtils.load(STYLE_PATH + '/default.xml').getDocumentElement();
			
			if (node != null)
			{
				var dec = new mxCodec(node.ownerDocument);
				dec.decode(node, this.getStylesheet());
			}
		};

		/**
		 * Creates lookup from object IDs to cell IDs.
		 */
		Graph.prototype.createCellLookup = function(cells, lookup)
		{
			lookup = (lookup != null) ? lookup : new Object();
			
			for (var i = 0; i < cells.length; i++)
			{
				var cell = cells[i];
				lookup[mxObjectIdentity.get(cell)] = cell.getId();
				var childCount = this.model.getChildCount(cell);
				
				for (var j = 0; j < childCount; j++)
				{
					this.createCellLookup([this.model.getChildAt(cell, j)], lookup);
				}
			}
			
			return lookup;
		};

		/**
		 * Creates lookup from original to cloned cell IDs where mapping is
		 * the mapping used in cloneCells and lookup is a mapping from
		 * object IDs to cell IDs.
		 */
		Graph.prototype.createCellMapping = function(mapping, lookup, cellMapping)
		{
			cellMapping = (cellMapping != null) ? cellMapping : new Object();
			
			for (var objectId in mapping)
			{
				var cellId = lookup[objectId];
				
				if (cellMapping[cellId] == null)
				{
					// Uses empty string if clone ID was null which means
					// the cell was cloned but not inserted into the model.
					cellMapping[cellId] = mapping[objectId].getId() || '';
				}
			}
			
			return cellMapping;
		};
		
		/**
		 * 
		 */
		Graph.prototype.importGraphModel = function(node, dx, dy, crop)
		{
			dx = (dx != null) ? dx : 0;
			dy = (dy != null) ? dy : 0;
			
			var codec = new mxCodec(node.ownerDocument);
			var tempModel = new mxGraphModel();
			codec.decode(node, tempModel);
			var cells = []
			
			// Clones cells to remove invalid edges
			var cloneMap = new Object();
			var cellMapping = new Object();
			var layers = tempModel.getChildren(this.cloneCell(tempModel.root,
				this.isCloneInvalidEdges(), cloneMap));
			
			if (layers != null)
			{
				// Creates lookup from object IDs to cell IDs
				var lookup = this.createCellLookup([tempModel.root]);
				
				// Uses copy as layers are removed from array inside loop
				layers = layers.slice();
	
				this.model.beginUpdate();
				try
				{
					// Merges into unlocked current layer if one layer is pasted
					if (layers.length == 1 && !this.isCellLocked(this.getDefaultParent()))
					{
						var children = tempModel.getChildren(layers[0]);
						
						if (children != null)
						{
							cells = this.moveCells(children,
								dx, dy, false, this.getDefaultParent());
							
							// Imported default parent maps to local default parent
							cellMapping[tempModel.getChildAt(tempModel.root, 0).getId()] =
								this.getDefaultParent().getId();
						}
					}
					else
					{
						for (var i = 0; i < layers.length; i++)
						{
							var children = this.model.getChildren(this.moveCells(
								[layers[i]], dx, dy, false, this.model.getRoot())[0]);
							
							if (children != null)
							{
								cells = cells.concat(children);
							}
						}
					}
					
					if (cells != null)
					{
						// Adds mapping for all cloned entries from imported to local cell ID
						this.createCellMapping(cloneMap, lookup, cellMapping);
						this.updateCustomLinks(cellMapping, cells);
						
						if (crop)
						{
							if (this.isGridEnabled())
							{
								dx = this.snap(dx);
								dy = this.snap(dy);
							}
							
							var bounds = this.getBoundingBoxFromGeometry(cells, true);
							
							if (bounds != null)
							{
								this.moveCells(cells, dx - bounds.x, dy - bounds.y);
							}
						}
					}
				}
				finally
				{
					this.model.endUpdate();
				}
			}
			
			return cells;
		};
		
		/**
		 * Translates this point by the given vector.
		 * 
		 * @param {number} dx X-coordinate of the translation.
		 * @param {number} dy Y-coordinate of the translation.
		 */
		Graph.prototype.encodeCells = function(cells)
		{
			var cloneMap = new Object();
			var clones = this.cloneCells(cells, null, cloneMap);
			
			// Creates a dictionary for fast lookups
			var dict = new mxDictionary();
			
			for (var i = 0; i < cells.length; i++)
			{
				dict.put(cells[i], true);
			}
			
			var codec = new mxCodec();
			var model = new mxGraphModel();
			var parent = model.getChildAt(model.getRoot(), 0);
			
			for (var i = 0; i < clones.length; i++)
			{
				model.add(parent, clones[i]);
			
				// Checks for orphaned relative children and makes absolute
				var state = this.view.getState(cells[i]);
				
				if (state != null)
				{
					var geo = this.getCellGeometry(clones[i]);
					
					if (geo != null && geo.relative && !this.model.isEdge(cells[i]) &&
						dict.get(this.model.getParent(cells[i])) == null)
					{
						geo.offset = null;
						geo.relative = false;
						geo.x = state.x / state.view.scale - state.view.translate.x;
						geo.y = state.y / state.view.scale - state.view.translate.y;
					}
				}
			}

			this.updateCustomLinks(this.createCellMapping(cloneMap,
				this.createCellLookup(cells)), clones);

			return codec.encode(model);
		};

		/**
		 * Overridden to use table cell instead of table as parent.
		 */
		Graph.prototype.isSwimlane = function(cell, ignoreState)
		{
			var shape = null;

			if (cell != null && !this.model.isEdge(cell) &&
				this.model.getParent(cell) !=
					this.model.getRoot())
			{
				var style = this.getCurrentCellStyle(cell, ignoreState)
				shape = style[mxConstants.STYLE_SHAPE];
			}
			
			return shape == mxConstants.SHAPE_SWIMLANE ||
				shape == 'table' || shape == 'tableRow';
		};
		
		/**
		 * Overridden to check table cells and rows.
		 */
		var graphIsCellEditable = Graph.prototype.isCellEditable;
		Graph.prototype.isCellEditable = function(cell)
		{
			if (cell == null || !graphIsCellEditable.apply(this, arguments))
			{
				return false;
			}
			else if (this.isTableCell(cell) || this.isTableRow(cell))
			{
				return this.isCellEditable(this.model.getParent(cell));
			}
			else
			{
				return true;
			}
		};
		
		/**
		 * Overridden to check table cells and rows.
		 */
		var graphIsCellMovable = Graph.prototype.isCellMovable;
		Graph.prototype.isCellMovable = function(cell)
		{
			if (cell == null || !graphIsCellMovable.apply(this, arguments))
			{
				return false;
			}
			else if (this.isTableCell(cell) || this.isTableRow(cell))
			{
				return this.isCellMovable(this.model.getParent(cell));
			}
			else
			{
				return true;
			}
		};
		
		/**
		 * Overridden to add expand style.
		 */
		var graphIsExtendParent = Graph.prototype.isExtendParent;
		Graph.prototype.isExtendParent = function(cell)
		{
			var parent = this.model.getParent(cell);

			if (parent != null)
			{
				var style = this.getCurrentCellStyle(parent);

				if (style['expand'] != null)
				{
					return style['expand'] != '0';
				}
			}

			return graphIsExtendParent.apply(this, arguments) &&
				(parent == null || !this.isTable(parent));
		};

		/**
		 * Overridden to add contract style.
		 */
		var graphIsContractParent = Graph.prototype.isContractParent;
		Graph.prototype.isContractParent = function(cell)
		{
			var parent = this.model.getParent(cell);

			if (parent != null)
			{
				var style = this.getCurrentCellStyle(parent);

				if (style['contract'] != null)
				{
					return style['contract'] != '0';
				}
			}

			return graphIsContractParent.apply(this, arguments) &&
				(parent == null || !this.isTable(parent));
		};

		/**
		 * Overridden to use table cell instead of table as parent.
		 */
		var graphSplitEdge = Graph.prototype.splitEdge;
		Graph.prototype.splitEdge = function(edge, cells, newEdge, dx, dy, x, y, parent)
		{
			if (parent == null)
			{
				parent = this.model.getParent(edge);
				
				if (this.isTable(parent) || this.isTableRow(parent))
				{
					parent = this.getCellAt(x, y, null, true, false);
				}
			}
			
			var newEdge = null;
				
			this.model.beginUpdate();
			try
			{
				var geo = this.getCellGeometry(edge);

				// Removes waypoints intersecting inserted cell
				if (geo != null && geo.points != null && geo.points.length > 0 &&
					cells.length == 1 && this.model.isVertex(cells[0]))
				{
					var temp = this.getCellGeometry(cells[0]);

					if (temp != null && !temp.relative)
					{
						var bbox = new mxRectangle(temp.x + dx,
							temp.y + dy, temp.width, temp.height);
						var points = geo.points;
						var newPoints = [];

						for (var i = 0; i < points.length; i++)
						{
							if (!bbox.intersectsPoint(points[i].x, points[i].y))
							{
								newPoints.push(points[i]);
							}
						}

						if (newPoints.length < points.length)
						{
							geo = geo.clone();
							geo.points = newPoints;
							this.model.setGeometry(edge, geo);
						}
					}
				}
				
				var newEdge = graphSplitEdge.apply(this, [edge, cells, newEdge, dx, dy, x, y, parent]);
				
				// Removes cloned value on first segment
				this.model.setValue(newEdge, '');
				
				// Removes child labels on first or second segment depending on coordinate
				// LATER: Split and reposition labels based on x and y
				var sourceLabels = this.getChildCells(newEdge, true);
				
				for (var i = 0; i < sourceLabels.length; i++)
				{
					var geo = this.getCellGeometry(sourceLabels[i]);
					
					if (geo != null && geo.relative && geo.x > 0)
					{
						this.model.remove(sourceLabels[i]);
					}
				}
				
				var targetLabels = this.getChildCells(edge, true);
				
				for (var i = 0; i < targetLabels.length; i++)
				{
					var geo = this.getCellGeometry(targetLabels[i]);
					
					if (geo != null && geo.relative && geo.x <= 0)
					{
						this.model.remove(targetLabels[i]);
					}
				}
				
				// Removes entryX/Y and exitX/Y if snapToPoint is used
				var target = this.model.getTerminal(newEdge, false);
				
				if (target != null)
				{
					var style = this.getCurrentCellStyle(target);
					
					if (style != null && style['snapToPoint'] == '1')
					{
						this.setCellStyles(mxConstants.STYLE_EXIT_X, null, [edge]);
						this.setCellStyles(mxConstants.STYLE_EXIT_Y, null, [edge]);
						this.setCellStyles(mxConstants.STYLE_ENTRY_X, null, [newEdge]);
						this.setCellStyles(mxConstants.STYLE_ENTRY_Y, null, [newEdge]);
					}
				}
				
			}
			finally
			{
				this.model.endUpdate();
			}
					
			return newEdge;
		};
		
		/**
		 * Overridden to flatten cell hierarchy for selecting next and previous.
		 */
		var graphSelectCell = Graph.prototype.selectCell;
		Graph.prototype.selectCell = function(isNext, isParent, isChild)
		{
			if (isParent || isChild)
			{
				graphSelectCell.apply(this, arguments);
			}
			else
			{
				var cell = this.getSelectionCell();
				var index = null;
				var cells = [];
				
				// LATER: Reverse traverse order for !isNext
				var flatten = mxUtils.bind(this, function(temp)
				{
					if (this.view.getState(temp) != null &&
						(this.model.isVertex(temp) ||
						this.model.isEdge(temp)))
					{
						cells.push(temp);
						
						if (temp == cell)
						{
							index = cells.length - 1;
						}
						else if ((isNext && cell == null && cells.length > 0) ||
							(index != null && ((isNext && cells.length > index)) ||
							(!isNext && index > 0)))
						{
							return;
						}
					}
		
					for (var i = 0; i < this.model.getChildCount(temp); i++)
					{
						flatten(this.model.getChildAt(temp, i));
					}
				});
				
				flatten(this.model.root);
				
				if (cells.length > 0)
				{
					if (index != null)
					{
						index = mxUtils.mod(index + ((isNext) ? 1 : -1), cells.length)
					}
					else
					{
						index = 0;
					}
					
					this.setSelectionCell(cells[index]);
				}
			}
		};

		/**
		 * Swaps the given shapes.
		 */
		Graph.prototype.swapShapes = function(source, target)
		{
			if (this.model.isVertex(source) && this.model.isVertex(target) &&
				this.getMovableCells([source, target]).length == 2)
			{
				var geo1 = this.getCellGeometry(source);
				var geo2 = this.getCellGeometry(target);

				if (geo1 != null && geo2 != null)
				{
					var g1 = geo1.clone();
					var g2 = geo2.clone();

					this.model.beginUpdate();
					try
					{
						g1.x = geo2.getCenterX() - geo1.width / 2;
						g1.y = geo2.getCenterY() - geo1.height / 2;
						g2.x = geo1.getCenterX() - geo2.width / 2;
						g2.y = geo1.getCenterY() - geo2.height / 2;

						this.model.setGeometry(source, g1);
						this.model.setGeometry(target, g2);
					}
					finally
					{
						this.model.endUpdate();
					}
				}
			}
		};

		/**
		 * Overrides cloning cells in moveCells.
		 */
		var graphMoveCells = Graph.prototype.moveCells;
		Graph.prototype.moveCells = function(cells, dx, dy, clone, target, evt, mapping)
		{
			mapping = (mapping != null) ? mapping : new Object();
			
			// Replaces source tables with rows
			if (this.isTable(target))
			{
				var newCells = [];
				
				for (var i = 0; i < cells.length; i++)
				{
					if (this.isTable(cells[i]))
					{
						newCells = newCells.concat(this.model.getChildCells(cells[i], true).reverse());
					}
					else
					{
						newCells.push(cells[i]);
					}
				}
				
				cells = newCells;
			}
			
			this.model.beginUpdate();
			try
			{
				// Updates source and target table heights and matches
				// column count for moving rows between tables
				var sourceTables = [];
				
				for (var i = 0; i < cells.length; i++)
				{
					if (target != null && this.isTableRow(cells[i]))
					{
						var parent = this.model.getParent(cells[i]);
						var row = this.getCellGeometry(cells[i]);
						
						if (this.isTable(parent))
						{
							sourceTables.push(parent);
						}
						
						if (parent != null && row != null &&
							this.isTable(parent) &&
							this.isTable(target) &&
							(clone || parent != target))
						{
							if (!clone)
							{
								var table = this.getCellGeometry(parent);
						
								if (table != null)
								{
									table = table.clone();
									table.height -= row.height;
									this.model.setGeometry(parent, table);
								}
							}
	
							var table = this.getCellGeometry(target);
					
							if (table != null)
							{
								table = table.clone();
								table.height += row.height;
								this.model.setGeometry(target, table);
							}
							
							// Matches column count
							var rows = this.model.getChildCells(target, true);
							
							if (rows.length > 0)
							{
								cells[i] = (clone) ? this.cloneCell(cells[i]) : cells[i];
								var sourceCols = this.model.getChildCells(cells[i], true);
								var cols = this.model.getChildCells(rows[0], true);
								var count = cols.length - sourceCols.length;
								
								if (count > 0)
								{
									for (var j = 0; j < count; j++)
									{
										var col = this.cloneCell(sourceCols[sourceCols.length - 1]);
										
										if (col != null)
										{
											col.value = '';
											
											this.model.add(cells[i], col);
										}
									}
								}
								else if (count < 0)
								{
									for (var j = 0; j > count; j--)
									{
										this.model.remove(sourceCols[sourceCols.length + j - 1]);
									}
								}
								
								// Updates column widths
								sourceCols = this.model.getChildCells(cells[i], true);
								
								for (var j = 0; j < cols.length; j++)
								{
									var geo = this.getCellGeometry(cols[j]);
									var geo2 = this.getCellGeometry(sourceCols[j]);
									
									if (geo != null && geo2 != null)
									{
										geo2 = geo2.clone();
										geo2.width = geo.width;
										
										this.model.setGeometry(sourceCols[j], geo2);
									}
								}
							}
						}
					}
				}
				
				var result = graphMoveCells.apply(this, arguments);
				
				// Removes empty tables
				for (var i = 0; i < sourceTables.length; i++)
				{
					if (!clone && this.model.contains(sourceTables[i]) &&
						this.model.getChildCount(sourceTables[i]) == 0)
					{
						this.model.remove(sourceTables[i]);	
					}
				}
				
				if (clone)
				{
					this.updateCustomLinks(this.createCellMapping(mapping,
						this.createCellLookup(cells)), result);
				}
			}
			finally
			{
				this.model.endUpdate();
			}
			
			return result;
		};
				
		/**
		 * Overriddes to delete label for table cells.
		 */
		var graphRemoveCells = Graph.prototype.removeCells;
		Graph.prototype.removeCells = function(cells, includeEdges)
		{
			var result = [];
			
			this.model.beginUpdate();
			try
			{
				// Clears labels on table cells
				for (var i = 0; i < cells.length; i++)
				{
					if (this.isTableCell(cells[i]))
					{
						var row = this.model.getParent(cells[i]);
						var table = this.model.getParent(row);
						
						// Removes table if one cell in one row left
						if (this.model.getChildCount(row) == 1 &&
							this.model.getChildCount(table) == 1)
						{
							if (mxUtils.indexOf(cells, table) < 0 &&
								mxUtils.indexOf(result, table) < 0)
							{
								result.push(table);
							}
						}
						else
						{
							this.labelChanged(cells[i], '');
						}
					}
					else
					{
						// Deletes table if all rows are removed
						if (this.isTableRow(cells[i]))
						{
							var table = this.model.getParent(cells[i]);
							
							if (mxUtils.indexOf(cells, table) < 0 &&
								mxUtils.indexOf(result, table) < 0)
							{
								var rows = this.model.getChildCells(table, true);
								var deleteCount = 0;
								
								for (var j = 0; j < rows.length; j++)
								{
									if (mxUtils.indexOf(cells, rows[j]) >= 0)
									{
										deleteCount++;
									}
								}
								
								if (deleteCount == rows.length)
								{
									result.push(table);
								}
							}
						}
						
						result.push(cells[i]);
					}
				}
				
				result = graphRemoveCells.apply(this, [result, includeEdges]);
			}
			finally
			{
				this.model.endUpdate();
			}

			return result;
		};
		
		/**
		 * Updates cells IDs for custom links in the given cells using an
		 * optional graph to avoid changing the undo history.
		 */
		Graph.prototype.updateCustomLinks = function(mapping, cells, graph)
		{
			graph = (graph != null) ? graph : new Graph();

			for (var i = 0; i < cells.length; i++)
			{
				if (cells[i] != null)
				{
					graph.updateCustomLinksForCell(mapping, cells[i], graph);
				}
			}
		};
		
		/**
		 * Updates cell IDs in custom links on the given cell and its label.
		 */
		Graph.prototype.updateCustomLinksForCell = function(mapping, cell)
		{
			this.doUpdateCustomLinksForCell(mapping, cell);
			var childCount = this.model.getChildCount(cell);
				
			for (var i = 0; i < childCount; i++)
			{
				this.updateCustomLinksForCell(mapping,
					this.model.getChildAt(cell, i));
			}
		};
				
		/**
		 * Updates cell IDs in custom links on the given cell and its label.
		 */
		 Graph.prototype.doUpdateCustomLinksForCell = function(mapping, cell)
		 {
			 // Hook for subclassers
		 };
		 
		/**
		 * Overrides method to provide connection constraints for shapes.
		 */
		Graph.prototype.getAllConnectionConstraints = function(terminal, source)
		{
			if (terminal != null)
			{
				var constraints = mxUtils.getValue(terminal.style, 'points', null);
				
				if (constraints != null)
				{
					// Requires an array of arrays with x, y (0..1), an optional
					// [perimeter (0 or 1), dx, and dy] eg. points=[[0,0,1,-10,10],[0,1,0],[1,1]]
					var result = [];
					
					try
					{
						var c = JSON.parse(constraints);
						
						for (var i = 0; i < c.length; i++)
						{
							var tmp = c[i];
							result.push(new mxConnectionConstraint(new mxPoint(tmp[0], tmp[1]), (tmp.length > 2) ? tmp[2] != '0' : true,
									null, (tmp.length > 3) ? tmp[3] : 0, (tmp.length > 4) ? tmp[4] : 0));
						}
					}
					catch (e)
					{
						// ignore
					}
					
					return result;
				}
				else if (terminal.shape != null && terminal.shape.bounds != null)
				{
					var dir = terminal.shape.direction;
					var bounds = terminal.shape.bounds;
					var scale = terminal.shape.scale;
					var w = bounds.width / scale;
					var h = bounds.height / scale;
					
					if (dir == mxConstants.DIRECTION_NORTH || dir == mxConstants.DIRECTION_SOUTH)
					{
						var tmp = w;
						w = h;
						h = tmp;
					}
					
					constraints = terminal.shape.getConstraints(terminal.style, w, h);
					
					if (constraints != null)
					{
						return constraints;
					}
					else if (terminal.shape.stencil != null && terminal.shape.stencil.constraints != null)
					{
						return terminal.shape.stencil.constraints;
					}
					else if (terminal.shape.constraints != null)
					{
						return terminal.shape.constraints;
					}
				}
			}
		
			return null;
		};
		
		/**
		 * Inverts the elbow edge style without removing existing styles.
		 */
		Graph.prototype.flipEdge = function(edge)
		{
			if (edge != null)
			{
				var style = this.getCurrentCellStyle(edge);
				var elbow = mxUtils.getValue(style, mxConstants.STYLE_ELBOW,
					mxConstants.ELBOW_HORIZONTAL);
				var value = (elbow == mxConstants.ELBOW_HORIZONTAL) ?
					mxConstants.ELBOW_VERTICAL : mxConstants.ELBOW_HORIZONTAL;
				this.setCellStyles(mxConstants.STYLE_ELBOW, value, [edge]);
			}
		};

		/**
		 * Overrides resetEdge to also clear innerLoopWaypoints style.
		 */
		var graphResetEdge = Graph.prototype.resetEdge;

		Graph.prototype.resetEdge = function(edge)
		{
			if (edge != null)
			{
				this.setCellStyles('innerLoopWaypoints', null, [edge]);
			}

			return graphResetEdge.apply(this, arguments);
		};

		/**
		 * Uses the segment handler for self-loops so they always get one handle
		 * per segment (outgoing, middle/distance and incoming). This works even
		 * for legacy loops that are still routed via mxEdgeStyle.Loop (no stored
		 * waypoints), because the segment handler derives its handles from the
		 * absolute points. Dragging a segment handle converts the loop to an
		 * orthogonal routing with inner waypoints so it keeps its 3-segment
		 * shape; existing loops are not modified until edited.
		 */
		var graphCreateEdgeHandler = Graph.prototype.createEdgeHandler;

		Graph.prototype.createEdgeHandler = function(state, edgeStyle)
		{
			if (state != null)
			{
				var source = state.getVisibleTerminalState(true);
				var target = state.getVisibleTerminalState(false);

				if (source != null && source == target)
				{
					var handler = this.createEdgeSegmentHandler(state);
					var changePoints = handler.changePoints;
					var getPreviewPoints = handler.getPreviewPoints;
					var updatePreviewState = handler.updatePreviewState;
					var clonePreviewState = handler.clonePreviewState;

					// Keeps the dragged handle under the mouse and the loop the
					// simplest two-corner loop so a segment drag (e.g. across the
					// shape) cannot collapse it into a zero-size spike
					handler.getPreviewPoints = function(point)
					{
						if (!this.isSource && !this.isTarget)
						{
							// The dashed preview is routed with the same style that
							// changePoints commits (orthogonalEdgeStyle + inner
							// waypoints) so it matches the final result and dragging a
							// segment past the shape adds new segments instead of
							// collapsing the loop. That style is applied to the preview
							// clone in clonePreviewState below, NOT to the live edge
							// state, so an aborted (Escape) drag cannot leave a legacy
							// loop's cached style dirty. The segment dragging itself is
							// the standard orthogonal behaviour (each segment moves on
							// one axis, new segments are added as needed).

							// The middle handle of a simple loop (3 segments => 4 current
							// points) moves the whole loop around the shape; the arms
							// use the standard per-axis segment dragging. Works even
							// before any waypoint is committed (the loop is still
							// routed by the default Loop style with faded handles).
							var cur = this.getCurrentPoints();

							if (cur != null && cur.length == 4 &&
								this.index > 1 && this.index < cur.length - 1)
							{
								var loop = this.graph.getLoopAroundPoints(this.state, point);

								if (loop != null)
								{
									return this.graph.keepLoopOutsideShape(this.state, loop);
								}
							}

							// Keeps the loop outside the shape so the terminals stay
							// on the perimeter (lower edge) instead of collapsing to
							// the shape center when a segment is dragged inside
							return this.graph.keepLoopOutsideShape(this.state,
								getPreviewPoints.apply(this, arguments));
						}

						return getPreviewPoints.apply(this, arguments);
					};

					// Routes the dashed preview orthogonally with inner waypoints by
					// applying the converted style to the throwaway preview clone
					// (created per mouse-move) rather than mutating the live edge
					// state. This keeps the preview matching the committed result
					// while leaving the real loop's cached style untouched if the drag
					// is aborted (mxEdgeHandler.mouseMove clones before routing it).
					handler.clonePreviewState = function(point, terminal)
					{
						var clone = clonePreviewState.apply(this, arguments);

						if (!this.isSource && !this.isTarget &&
							clone != null && clone.style != null)
						{
							clone.style[mxConstants.STYLE_EDGE] = 'orthogonalEdgeStyle';
							clone.style['innerLoopWaypoints'] = '1';
						}

						return clone;
					};

					handler.changePoints = function(edge, points, clone)
					{
						points = this.graph.keepLoopOutsideShape(this.state, points);

						var model = this.graph.getModel();

						model.beginUpdate();
						try
						{
							edge = changePoints.call(this, edge, points, clone);

							// Persists the orthogonal routing and keeps the inner
							// waypoints so the converted loop retains its shape
							if (edge != null && points != null && points.length >= 2)
							{
								this.graph.setCellStyles(mxConstants.STYLE_EDGE,
									'orthogonalEdgeStyle', [edge]);
								this.graph.setCellStyles('innerLoopWaypoints', '1', [edge]);
							}
						}
						finally
						{
							model.endUpdate();
						}

						return edge;
					};

					// Resets the last-known-good loop at the start of each drag so the
					// spike fallback can revert to the loop's pre-drag shape.
					var handlerStart = handler.start;

					handler.start = function(x, y, index)
					{
						this.validLoopPoints = null;
						handlerStart.apply(this, arguments);
					};

					// Re-routes the preview clone from this.points (used after a
					// fallback replaces them).
					handler.rerouteLoopPreview = function(edge)
					{
						var source = this.state.getVisibleTerminalState(true);
						var target = this.state.getVisibleTerminalState(false);

						edge.view.updateFixedTerminalPoints(edge, source, target);
						edge.view.updatePoints(edge, this.points, source, target);
						edge.view.updateFloatingTerminalPoints(edge, source, target);
					};

					// The current committed loop's inner waypoints in model space (from
					// the stored points, or derived from the routed loop), used as the
					// fallback when a drag would otherwise spike.
					handler.getCommittedLoopPoints = function()
					{
						var geo = this.graph.getCellGeometry(this.state.cell);

						if (geo != null && geo.points != null && geo.points.length >= 2)
						{
							return geo.points.map(function(p)
							{
								return new mxPoint(p.x, p.y);
							});
						}

						var pts = this.state.absolutePoints;

						if (pts != null && pts.length >= 4)
						{
							var s = this.state.view.scale;
							var tr = this.state.view.translate;
							var o = this.state.origin;
							var res = [];

							for (var i = 1; i < pts.length - 1; i++)
							{
								if (pts[i] != null)
								{
									res.push(new mxPoint(pts[i].x / s - tr.x - o.x,
										pts[i].y / s - tr.y - o.y));
								}
							}

							if (res.length >= 2)
							{
								return res;
							}
						}

						return null;
					};

					// True when the routed loop's two terminal points have collapsed
					// onto (nearly) the same perimeter point.
					handler.isLoopSpike = function(edge)
					{
						var pts = edge.absolutePoints;

						if (pts == null || pts.length < 2 || pts[0] == null ||
							pts[pts.length - 1] == null)
						{
							return true;
						}

						var thr = this.graph.gridSize * this.state.view.scale / 2;

						return Math.abs(pts[0].x - pts[pts.length - 1].x) < thr &&
							Math.abs(pts[0].y - pts[pts.length - 1].y) < thr;
					};

					// The inherited segment handler has a "this is really a straight
					// line" special case that replaces the whole edge with two
					// identical points at the cursor when the merged preview is empty
					// and the two terminals share an axis. A self-loop is never a
					// straight line, but its source and target always share an axis
					// (and for a fixed-anchor perimeter, e.g. a lifeline spine, the
					// same x), so dragging an arm handle far enough to flatten the
					// loop trips that case and collapses it to a single point. Rebuild
					// a valid minimum-size loop under the cursor instead of letting it
					// collapse (the middle handle already avoids this via
					// getLoopAroundPoints; this covers the arm handles).
					handler.updatePreviewState = function(edge, point, terminalState, me, outline)
					{
						if (!this.isSource && !this.isTarget && this.validLoopPoints == null)
						{
							this.validLoopPoints = this.getCommittedLoopPoints();
						}

						updatePreviewState.apply(this, arguments);

						if (!this.isSource && !this.isTarget)
						{
							if (this.points != null && this.points.length == 2 &&
								Math.round(this.points[0].x - this.points[1].x) == 0 &&
								Math.round(this.points[0].y - this.points[1].y) == 0)
							{
								var loop = this.graph.getLoopAroundPoints(this.state, point);

								if (loop != null)
								{
									this.points = this.graph.keepLoopOutsideShape(this.state, loop);
									this.rerouteLoopPreview(edge);
								}
							}

							// Post-route spike guard: placement guesses the terminal with
							// a perimeter probe, but the router (getFloatingTerminalPoint)
							// can still collapse both arms onto one point on a slanted or
							// concave edge. Detect that from the actually-routed terminals
							// and fall back to the last valid loop, so the handle stops at
							// the edge of the valid region instead of spiking.
							if (this.isLoopSpike(edge))
							{
								if (this.validLoopPoints != null)
								{
									this.points = this.validLoopPoints.map(function(p)
									{
										return new mxPoint(p.x, p.y);
									});
									this.rerouteLoopPreview(edge);
								}
							}
							else if (this.points != null && this.points.length >= 2)
							{
								this.validLoopPoints = this.points.map(function(p)
								{
									return new mxPoint(p.x, p.y);
								});
							}
						}
					};

					return handler;
				}
			}

			return graphCreateEdgeHandler.apply(this, arguments);
		};

		/**
		 * Disables drill-down for non-swimlanes.
		 */
		Graph.prototype.isValidRoot = function(cell)
		{
			// Counts non-relative children
			var childCount = this.model.getChildCount(cell);
			var realChildCount = 0;
			
			for (var i = 0; i < childCount; i++)
			{
				var child = this.model.getChildAt(cell, i);
				
				if (this.model.isVertex(child))
				{
					var geometry = this.getCellGeometry(child);
					
					if (geometry != null && !geometry.relative)
					{
						realChildCount++;
					}
				}
			}
			
			return realChildCount > 0 || this.isContainer(cell);
		};
		
		/**
		 * Disables drill-down for non-swimlanes.
		 */
		Graph.prototype.isValidDropTarget = function(cell, cells, evt)
		{
			var style = this.getCurrentCellStyle(cell);
			var tables = true;
			var rows = true;

			for (var i = 0; i < cells.length && rows; i++)
			{
				tables = tables && this.isTable(cells[i]);
				rows = rows && this.isTableRow(cells[i]);
			}

			return !this.isCellLocked(cell) &&
				this.getLockedGroupAncestor(cell) == null &&
				(this.isTargetShape(cell, cells, evt) ||
				((mxUtils.getValue(style, 'part', '0') != '1' || this.isContainer(cell)) &&
				mxUtils.getValue(style, 'dropTarget', '1') != '0' && (mxGraph.prototype.
				isValidDropTarget.apply(this, arguments) || this.isContainer(cell)) &&
				!this.isTableRow(cell) && (!this.isTable(cell) || rows || tables)));
		};
	
		/**
		 * Overrides createGroupCell to set the group style for new groups to 'group'.
		 */
		Graph.prototype.createGroupCell = function()
		{
			var group = mxGraph.prototype.createGroupCell.apply(this, arguments);
			group.setStyle('group');

			return group;
		};

		/**
		 * Dragging a transparentBounds translates its children instead of moving
		 * the group itself. The group's stored geometry stays pinned at (0,0,0,0)
		 * and its visible bounds are derived from the new child positions.
		 */
		var graphTranslateCell = Graph.prototype.translateCell;
		Graph.prototype.translateCell = function(cell, dx, dy)
		{
			if (this.isTransparentBounds(cell))
			{
				var count = this.model.getChildCount(cell);

				for (var i = 0; i < count; i++)
				{
					this.translateCell(this.model.getChildAt(cell, i), dx, dy);
				}
			}
			else
			{
				graphTranslateCell.apply(this, arguments);
			}
		};

		/**
		 * Creates a transparentBounds with stored geometry pinned at (0,0,0,0) so
		 * its bounds derive from its children. The standard groupCells path resizes
		 * the group to the children bounding box and translates children to be
		 * relative to that origin; both steps are skipped here.
		 */
		var graphGroupCells = Graph.prototype.groupCells;
		Graph.prototype.groupCells = function(group, border, cells)
		{
			if (group != null && this.isTransparentBounds(group))
			{
				if (cells == null)
				{
					cells = mxUtils.sortCells(this.getSelectionCells(), true);
				}

				cells = this.getCellsForGroup(cells);

				if (cells.length > 0)
				{
					var parent = this.model.getParent(group);

					if (parent == null)
					{
						parent = this.model.getParent(cells[0]);
					}

					this.model.beginUpdate();
					try
					{
						this.model.setGeometry(group,
							new mxGeometry(0, 0, 0, 0));

						var index = this.model.getChildCount(parent);
						this.cellsAdded([group], parent, index, null, null,
							false, false, false);

						index = this.model.getChildCount(group);
						this.cellsAdded(cells, group, index, null, null,
							false, false, false);

						this.fireEvent(new mxEventObject(mxEvent.GROUP_CELLS,
							'group', group, 'border', border, 'cells', cells));
					}
					finally
					{
						this.model.endUpdate();
					}
				}

				return group;
			}

			return graphGroupCells.apply(this, arguments);
		};
		
		/**
		 * Disables extending parents with stack layouts on add
		 */
		Graph.prototype.isExtendParentsOnAdd = function(cell)
		{
			var result = mxGraph.prototype.isExtendParentsOnAdd.apply(this, arguments);
			
			if (result && cell != null && this.layoutManager != null)
			{
				var parent = this.model.getParent(cell);
				
				if (parent != null)
				{
					var layout = this.layoutManager.getLayout(parent);
					
					if (layout != null && layout.constructor == mxStackLayout)
					{
						result = false;
					}
				}
			}
			
			return result;
		};

		/**
		 * Overrides autosize to add a border.
		 */
		Graph.prototype.getPreferredSizeForCell = function(cell, w, gridEnabled)
		{
			gridEnabled = (gridEnabled != null) ? gridEnabled : this.gridEnabled;
			var result = mxGraph.prototype.getPreferredSizeForCell.apply(this, arguments);
			
			// Adds buffer
			if (result != null)
			{
				result.width += 10;
				result.height += 4;
				
				if (gridEnabled)
				{
					result.width = this.snap(result.width);
					result.height = this.snap(result.height);
				}
			}
			
			return result;
		}

		/**
		 * Computes available space for an autosizeText label given style,
		 * explicit width/height and optional state (for folding image).
		 * Returns {availW, availH} or null if non-positive.
		 */
		Graph.prototype.getAutosizeTextAvailableSpace = function(style, w, h, state)
		{
			var dx = 0;
			var dy = 0;

			if ((state != null && this.getImage(state) != null) ||
				style[mxConstants.STYLE_IMAGE] != null)
			{
				if (style[mxConstants.STYLE_SHAPE] == mxConstants.SHAPE_LABEL)
				{
					if (style[mxConstants.STYLE_VERTICAL_ALIGN] == mxConstants.ALIGN_MIDDLE)
					{
						dx += parseFloat(mxUtils.getValue(style, mxConstants.STYLE_IMAGE_WIDTH,
							mxLabel.prototype.imageSize));
					}

					if (style[mxConstants.STYLE_ALIGN] != mxConstants.ALIGN_CENTER)
					{
						dy += parseFloat(mxUtils.getValue(style, mxConstants.STYLE_IMAGE_HEIGHT,
							mxLabel.prototype.imageSize));
					}
				}
			}

			dx += 2 * parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING, 2));
			dx += parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING_LEFT, 2));
			dx += parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING_RIGHT, 2));

			dy += 2 * parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING, 2));
			dy += parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING_TOP, 2));
			dy += parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING_BOTTOM, 2));

			if (state != null)
			{
				var image = this.getFoldingImage(state);

				if (image != null)
				{
					dx += image.width + 8;
				}
			}

			var isHorizontal = mxUtils.getValue(style, mxConstants.STYLE_HORIZONTAL, true);
			var availW = (isHorizontal ? w : h) - dx;
			var availH = (isHorizontal ? h : w) - dy;

			if (availW <= 0 || availH <= 0)
			{
				return null;
			}

			return {availW: availW, availH: availH};
		};

		/**
		 * Binary search for the largest font size (6..84) such that the
		 * given HTML value string fits within availW x availH.
		 */
		Graph.prototype.computeAutosizeTextFontSize = function(value, availW, availH, fontFamily, fontStyle, wrap)
		{
			var lo = 1;
			var hi = 84;
			var textW = wrap ? availW : null;

			// For wrapped text, prepare each word on its own line to measure
			// the widest unbreakable word (handles single-line text without spaces)
			var wordsValue = null;

			if (wrap)
			{
				var plainText = value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
				var words = plainText.split(/[\s\n]+/);
				var filtered = [];

				for (var i = 0; i < words.length; i++)
				{
					if (words[i].length > 0)
					{
						filtered.push(mxUtils.htmlEntities(words[i], false));
					}
				}

				if (filtered.length > 0)
				{
					wordsValue = filtered.join('<br>');
				}
			}

			while (lo < hi)
			{
				var mid = Math.ceil((lo + hi) / 2);
				var size = mxUtils.getSizeForString(value, mid, fontFamily, textW, fontStyle);

				var fits = wrap ? (size.height <= availH) :
					(size.width <= availW && size.height <= availH);

				// For wrapped text, also ensure the widest word fits within the width
				if (fits && wrap && wordsValue != null)
				{
					var wordsSize = mxUtils.getSizeForString(wordsValue, mid, fontFamily, null, fontStyle);

					if (wordsSize.width > availW)
					{
						fits = false;
					}
				}

				if (fits)
				{
					lo = mid;
				}
				else
				{
					hi = mid - 1;
				}
			}

			return Math.max(6, lo);
		};

		/**
		 * Updates the font size of the given cell so that its label fits within
		 * the cell bounds. Uses binary search over font sizes 1..999.
		 */
		Graph.prototype.updateAutosizeTextFontSize = function(cell, style)
		{
			var state = this.view.getState(cell);

			if (state == null)
			{
				state = this.view.createState(cell);
			}

			style = style || state.style;
			var geo = this.getCellGeometry(cell);

			if (geo == null || this.model.isEdge(cell))
			{
				return;
			}

			var value = this.cellRenderer.getLabelValue(state);

			if (value == null || value.length == 0)
			{
				return;
			}

			var space = this.getAutosizeTextAvailableSpace(style, geo.width, geo.height, state);

			if (space == null)
			{
				return;
			}

			// Prepare label value for measurement
			if (!this.isHtmlLabel(cell))
			{
				value = mxUtils.htmlEntities(value, false);
			}

			value = value.replace(/\n/g, '<br>');

			var fontFamily = style[mxConstants.STYLE_FONTFAMILY] || mxConstants.DEFAULT_FONTFAMILY;
			var fontStyle = style[mxConstants.STYLE_FONTSTYLE];
			var wrap = style[mxConstants.STYLE_WHITE_SPACE] == 'wrap';

			var fontSize = this.computeAutosizeTextFontSize(value, space.availW, space.availH,
				fontFamily, fontStyle, wrap);

			this.setCellStyles(mxConstants.STYLE_FONTSIZE, fontSize, [cell]);
		};

		/**
		 * Overrides cellsResized to update font size for cells with autosizeText enabled.
		 */
		Graph.prototype.cellsResized = function(cells, bounds, recurse)
		{
			var result = mxGraph.prototype.cellsResized.apply(this, arguments);

			if (cells != null)
			{
				for (var i = 0; i < cells.length; i++)
				{
					if (this.model.isVertex(cells[i]) && this.isAutosizeTextCell(cells[i]))
					{
						this.updateAutosizeTextFontSize(cells[i]);
					}
				}
			}

			return result;
		};

		/**
		 * Rotates the given cell and its non-relative children by the given angle
		 * (in degrees) about the cell's center, baking the rotation into the child
		 * geometries so a group rotates as a rigid body. This mirrors the algorithm
		 * mxVertexHandler.rotateCell uses for the rotation handle, exposed on the
		 * graph so the angle field, single-click rotate and the 90 degree turn can
		 * produce the same result for groups. The angle is a signed delta.
		 */
		Graph.prototype.rotateCell = function(cell, angle, parent)
		{
			if (angle != 0)
			{
				var model = this.getModel();

				if (model.isVertex(cell) || model.isEdge(cell))
				{
					if (!model.isEdge(cell))
					{
						var total = (this.getCurrentCellStyle(cell)[mxConstants.STYLE_ROTATION] || 0) + angle;
						this.setCellStyles(mxConstants.STYLE_ROTATION, total, [cell]);
					}

					var geo = this.getCellGeometry(cell);

					if (geo != null)
					{
						var pgeo = this.getCellGeometry(parent);

						if (pgeo != null && !model.isEdge(parent))
						{
							geo = geo.clone();
							geo.rotate(angle, new mxPoint(pgeo.width / 2, pgeo.height / 2));
							model.setGeometry(cell, geo);
						}

						if ((model.isVertex(cell) && !geo.relative) || model.isEdge(cell))
						{
							var childCount = model.getChildCount(cell);

							for (var i = 0; i < childCount; i++)
							{
								this.rotateCell(model.getChildAt(cell, i), angle, cell);
							}
						}
					}
				}
			}
		};

		/**
		 * Turns the given cells and returns the changed cells.
		 */
		Graph.prototype.turnShapes = function(cells, backwards)
		{
			var model = this.getModel();
			var select = [];
			
			model.beginUpdate();
			try
			{
				for (var i = 0; i < cells.length; i++)
				{
					var cell = cells[i];
					
					if (model.isEdge(cell))
					{
						var src = model.getTerminal(cell, true);
						var trg = model.getTerminal(cell, false);

						// A self-loop routed by the direction-based loop style has no
						// stored waypoints or fixed connection points to reverse. To
						// invert it, materialize its current routing as inner loop
						// waypoints (keeping its position and matching the loop handle's
						// orthogonal form); the waypoint reversal below then flips the
						// loop direction. Already-edited loops keep their waypoints.
						if (src != null && src == trg)
						{
							var loopState = this.view.getState(cell);
							var loopGeo = model.getGeometry(cell);

							if (loopState != null && loopGeo != null &&
								loopState.absolutePoints != null &&
								loopState.absolutePoints.length >= 4 &&
								(loopGeo.points == null || loopGeo.points.length < 2) &&
								loopState.style[mxConstants.STYLE_EXIT_X] == null &&
								loopState.style[mxConstants.STYLE_ENTRY_X] == null)
							{
								var lscale = this.view.scale;
								var ltrans = this.view.translate;
								var lorigin = loopState.origin;
								var abs = loopState.absolutePoints;
								var wp = [];

								for (var j = 1; j < abs.length - 1; j++)
								{
									if (abs[j] != null)
									{
										wp.push(new mxPoint(abs[j].x / lscale - ltrans.x - lorigin.x,
											abs[j].y / lscale - ltrans.y - lorigin.y));
									}
								}

								if (wp.length >= 2)
								{
									loopGeo = loopGeo.clone();
									loopGeo.points = wp;
									model.setGeometry(cell, loopGeo);
									this.setCellStyles(mxConstants.STYLE_EDGE, 'orthogonalEdgeStyle', [cell]);
									this.setCellStyles('innerLoopWaypoints', '1', [cell]);
								}
							}
						}

						model.setTerminal(cell, trg, true);
						model.setTerminal(cell, src, false);
						
						var geo = model.getGeometry(cell);
						
						if (geo != null)
						{
							geo = geo.clone();
							
							if (geo.points != null)
							{
								geo.points.reverse();
							}
							
							var sp = geo.getTerminalPoint(true);
							var tp = geo.getTerminalPoint(false)
							
							geo.setTerminalPoint(sp, false);
							geo.setTerminalPoint(tp, true);
							model.setGeometry(cell, geo);
							
							// Inverts constraints
							var edgeState = this.view.getState(cell);
							var sourceState = this.view.getState(src);
							var targetState = this.view.getState(trg);
							
							if (edgeState != null)
							{
								var sc = (sourceState != null) ? this.getConnectionConstraint(edgeState, sourceState, true) : null;
								var tc = (targetState != null) ? this.getConnectionConstraint(edgeState, targetState, false) : null;
								
								this.setConnectionConstraint(cell, src, true, tc);
								this.setConnectionConstraint(cell, trg, false, sc);
								
								// Inverts perimeter spacings
								var temp = mxUtils.getValue(edgeState.style, mxConstants.STYLE_SOURCE_PERIMETER_SPACING);
								this.setCellStyles(mxConstants.STYLE_SOURCE_PERIMETER_SPACING, mxUtils.getValue(
									edgeState.style, mxConstants.STYLE_TARGET_PERIMETER_SPACING), [cell]);
								this.setCellStyles(mxConstants.STYLE_TARGET_PERIMETER_SPACING, temp, [cell]);
							}
		
							select.push(cell);
						}
					}
					else if (model.isVertex(cell))
					{
						// Groups rotate as a rigid body (children baked) like the rotation
						// handle, instead of the leaf-shape size/direction swap below
						if (model.getChildCount(cell) > 0 && !this.isTable(cell) &&
							!this.isTableRow(cell) && !this.isTableCell(cell) && !this.isSwimlane(cell))
						{
							this.rotateCell(cell, (backwards) ? -90 : 90);
							select.push(cell);

							continue;
						}

						var geo = this.getCellGeometry(cell);
			
						if (geo != null)
						{
							// Rotates the size and position in the geometry
							if (!this.isTable(cell) && !this.isTableRow(cell) &&
								!this.isTableCell(cell) && !this.isSwimlane(cell))
							{
								geo = geo.clone();
								geo.x += geo.width / 2 - geo.height / 2;
								geo.y += geo.height / 2 - geo.width / 2;
								var tmp = geo.width;
								geo.width = geo.height;
								geo.height = tmp;
								model.setGeometry(cell, geo);
							}
							
							// Reads the current direction and advances by 90 degrees
							var state = this.view.getState(cell);
							
							if (state != null)
							{
								var dirs = [mxConstants.DIRECTION_EAST, mxConstants.DIRECTION_SOUTH,
									mxConstants.DIRECTION_WEST, mxConstants.DIRECTION_NORTH];
								var dir = mxUtils.getValue(state.style, mxConstants.STYLE_DIRECTION,
									mxConstants.DIRECTION_EAST);
								this.setCellStyles(mxConstants.STYLE_DIRECTION,
									dirs[mxUtils.mod(mxUtils.indexOf(dirs, dir) +
									((backwards) ? -1 : 1), dirs.length)], [cell]);
							}
		
							select.push(cell);
						}
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
			
			return select;
		};
		
		/**
		 * Rotates the given fully unconnected edges by 90 degrees around their
		 * center. Edges with at least one connected terminal are ignored as their
		 * endpoints are fixed to the connected cell (see issue #5076).
		 */
		Graph.prototype.rotateEdges = function(cells, backwards)
		{
			var model = this.getModel();
			var select = [];

			model.beginUpdate();
			try
			{
				for (var i = 0; i < cells.length; i++)
				{
					var cell = cells[i];

					if (model.isEdge(cell) && !this.isCellLocked(cell) &&
						model.getTerminal(cell, true) == null &&
						model.getTerminal(cell, false) == null)
					{
						var geo = model.getGeometry(cell);

						if (geo != null && geo.getTerminalPoint(true) != null &&
							geo.getTerminalPoint(false) != null)
						{
							geo = geo.clone();
							var pts = [geo.getTerminalPoint(true), geo.getTerminalPoint(false)];

							if (geo.points != null)
							{
								pts = pts.concat(geo.points);
							}

							var minX = pts[0].x, minY = pts[0].y, maxX = pts[0].x, maxY = pts[0].y;

							for (var j = 1; j < pts.length; j++)
							{
								minX = Math.min(minX, pts[j].x);
								minY = Math.min(minY, pts[j].y);
								maxX = Math.max(maxX, pts[j].x);
								maxY = Math.max(maxY, pts[j].y);
							}

							var cx = (minX + maxX) / 2;
							var cy = (minY + maxY) / 2;

							for (var j = 0; j < pts.length; j++)
							{
								var dx = pts[j].x - cx;
								var dy = pts[j].y - cy;

								// Rotates clockwise, or counter-clockwise if backwards
								pts[j].x = (backwards) ? cx + dy : cx - dy;
								pts[j].y = (backwards) ? cy - dx : cy + dx;
							}

							model.setGeometry(cell, geo);
							select.push(cell);
						}
					}
				}
			}
			finally
			{
				model.endUpdate();
			}

			return select;
		};
		
		/**
		 * Returns true if the given stencil contains any placeholder text.
		 */
		Graph.prototype.stencilHasPlaceholders = function(stencil)
		{
			if (stencil != null && stencil.fgNode != null)
			{
				var node = stencil.fgNode.firstChild;
				
				while (node != null)
				{
					if (node.nodeName == 'text' && node.getAttribute('placeholders') == '1')
					{
						return true;
					}
					
					node = node.nextSibling;
				}
			}
			
			return false;
		};
		
		/**
		 * Updates the child cells with placeholders if metadata of a
		 * cell has changed and propagates geometry changes in tables.
		 */
		var graphProcessChange = Graph.prototype.processChange;
		Graph.prototype.processChange = function(change)
		{
			if (change instanceof mxGeometryChange &&
				(this.isTableCell(change.cell) || this.isTableRow(change.cell)) &&
				((change.previous == null && change.geometry != null) ||
				(change.previous != null && (change.previous.equals == null ||
				!change.previous.equals(change.geometry)))))
			{
				var cell = change.cell;
				
				if (this.isTableCell(cell))
				{
					cell = this.model.getParent(cell);
				}
				
				if (this.isTableRow(cell))
				{
					cell = this.model.getParent(cell);
				}
				
				// Forces repaint of table with unchanged style and geometry
				var state = this.view.getState(cell);
				
				if (state != null && state.shape != null)
				{
					this.view.invalidate(cell);
					state.shape.bounds = null;
				}
			}
			
			graphProcessChange.apply(this, arguments);
			
			if (change instanceof mxValueChange && change.cell != null &&
				change.cell.value != null && typeof(change.cell.value) == 'object')
			{
				this.invalidateDescendantsWithPlaceholders(change.cell);
			}
		};
		
		/**
		 * Replaces the given element with a span.
		 */
		Graph.prototype.invalidateDescendantsWithPlaceholders = function(cell)
		{
			// Invalidates all descendants with placeholders
			var desc = this.model.getDescendants(cell);
			
			// LATER: Check if only label or tooltip have changed
			if (desc.length > 0)
			{
				for (var i = 0; i < desc.length; i++)
				{
					var state = this.view.getState(desc[i]);
					
					if (state != null && state.shape != null && state.shape.stencil != null &&
						this.stencilHasPlaceholders(state.shape.stencil))
					{
						this.removeStateForCell(desc[i]);
					}
					else if (this.isReplacePlaceholders(desc[i]))
					{
						this.view.invalidate(desc[i], false, false);
					}
				}
			}
		};
		
		/**
		 * Replaces the given element with a span.
		 */
		Graph.prototype.replaceElement = function(elt, tagName)
		{
			var span = elt.ownerDocument.createElement((tagName != null) ? tagName : 'span');
			var attributes = Array.prototype.slice.call(elt.attributes);
			
			while (attr = attributes.pop())
			{
				span.setAttribute(attr.nodeName, attr.nodeValue);
			}
			
			span.innerHTML = elt.innerHTML;
			elt.parentNode.replaceChild(span, elt);
		};

		/**
		 * 
		 */
		Graph.prototype.processElements = function(elt, fn)
		{
			if (elt != null)
			{
				var elts = elt.getElementsByTagName('*');
				
				for (var i = 0; i < elts.length; i++)
				{
					if (elts[i] != null)
					{
						fn(elts[i]);
					}
				}
			}
		};
		
		/**
		 * Handles label changes for XML user objects.
		 */
		Graph.prototype.updateLabelElements = function(cells, fn, tagName)
		{
			cells = (cells != null) ? cells : this.getSelectionCells();
			var div = document.createElement('div');
			
			for (var i = 0; i < cells.length; i++)
			{
				// Changes font tags inside HTML labels
				var style = this.getCurrentCellStyle(cells[i]);

				if (style != null && style['html'] == '1')
				{
					var label = this.convertValueToString(cells[i]);
					
					if (label != null && label.length > 0)
					{
						div.innerHTML = Graph.sanitizeHtml(label);
						var elts = div.getElementsByTagName((tagName != null) ? tagName : '*');
						
						for (var j = 0; j < elts.length; j++)
						{
							fn(elts[j]);
						}
						
						if (div.innerHTML != label)
						{
							this.cellLabelChanged(cells[i], div.innerHTML);
						}
					}
				}
			}
		};
		
		/**
		 * Handles label changes for XML user objects.
		 */
		Graph.prototype.cellLabelChanged = function(cell, value, autoSize)
		{
			// Removes all illegal control characters in user input
			value = Graph.zapGremlins(value);

			this.model.beginUpdate();
			try
			{			
				if (cell.value != null && typeof cell.value == 'object')
				{
					if (this.isReplacePlaceholders(cell) &&
						cell.getAttribute('placeholder') != null)
					{
						// LATER: Handle delete, name change
						var name = cell.getAttribute('placeholder');
						var current = cell;
								
						while (current != null)
						{
							if (current == this.model.getRoot() || (current.value != null &&
								typeof(current.value) == 'object' && current.hasAttribute(name)))
							{
								this.setAttributeForCell(current, name, value);
								
								break;
							}
							
							current = this.model.getParent(current);
						}
					}
					
					var tmp = cell.value.cloneNode(true);
					
					if (Graph.translateDiagram && Graph.diagramLanguage != null &&
						tmp.hasAttribute('label_' + Graph.diagramLanguage))
					{
						tmp.setAttribute('label_' + Graph.diagramLanguage, value);
					}
					else
					{
						tmp.setAttribute('label', value);
					}
					
					value = tmp;
				}

				mxGraph.prototype.cellLabelChanged.apply(this, arguments);

				if (this.isAutosizeTextCell(cell))
				{
					this.updateAutosizeTextFontSize(cell);
				}
			}
			finally
			{
				this.model.endUpdate();
			}
		};

		/**
		 * Removes transparent empty groups if all children are removed.
		 * Also collapses a transparentBounds parent whose remaining child
		 * is a single transparentBounds wrapper.
		 */
		Graph.prototype.cellsRemoved = function(cells)
		{
			if (cells != null)
			{
				var dict = new mxDictionary();

				for (var i = 0; i < cells.length; i++)
				{
					dict.put(cells[i], true);
				}

				// LATER: Recurse up the cell hierarchy
				var parents = [];

				for (var i = 0; i < cells.length; i++)
				{
					var parent = this.model.getParent(cells[i]);

					if (parent != null && !dict.get(parent))
					{
						dict.put(parent, true);
						parents.push(parent);
					}
				}

				for (var i = 0; i < parents.length; i++)
				{
					var state = this.view.getState(parents[i]);

					if (state != null && (this.model.isEdge(state.cell) ||
						this.model.isVertex(state.cell)) &&
						this.isCellDeletable(state.cell) &&
						(this.isTransparentState(state) ||
							this.isTransparentBounds(state.cell)))
					{
						var allChildren = true;

						for (var j = 0; j < this.model.getChildCount(state.cell) && allChildren; j++)
						{
							if (!dict.get(this.model.getChildAt(state.cell, j)))
							{
								allChildren = false;
							}
						}

						if (allChildren)
						{
							cells.push(state.cell);
						}
					}
				}

				// Collapses redundant nested transparentBounds: if removal
				// leaves a transparentBounds parent with a single remaining
				// child that is itself transparentBounds, the inner wrapper
				// adds no visible structure — lift its children up and drop
				// the wrapper. Loops per parent so a chain of single-tb-child
				// wrappers collapses in one pass.
				//
				// Uses a fresh removedDict instead of dict because dict is
				// overloaded to also mark parent cells (for dedup in the
				// parent-collection loop above), and those parents are NOT
				// being removed unless the all-children loop added them.
				var removedDict = new mxDictionary();

				for (var i = 0; i < cells.length; i++)
				{
					removedDict.put(cells[i], true);
				}

				for (var i = 0; i < parents.length; i++)
				{
					var parent = parents[i];

					while (!removedDict.get(parent) && this.isTransparentBounds(parent))
					{
						var remaining = null;
						var multiple = false;
						var count = this.model.getChildCount(parent);

						for (var j = 0; j < count; j++)
						{
							var child = this.model.getChildAt(parent, j);

							if (!removedDict.get(child))
							{
								if (remaining != null)
								{
									multiple = true;
									break;
								}

								remaining = child;
							}
						}

						if (multiple || remaining == null ||
							!this.isTransparentBounds(remaining) ||
							!this.isCellDeletable(remaining))
						{
							break;
						}

						var grandchildren = this.model.getChildren(remaining);

						if (grandchildren != null && grandchildren.length > 0)
						{
							// absolute=true so cellsAdded translates each
							// grandchild's local geometry by (remainingOrigin -
							// parentOrigin), keeping them at the same visual
							// position after the reparent.
							this.cellsAdded(grandchildren.slice(), parent,
								this.model.getChildCount(parent), null, null, true);
						}

						removedDict.put(remaining, true);
						cells.push(remaining);
					}
				}
			}

			mxGraph.prototype.cellsRemoved.apply(this, arguments);
		};
		
		/**
		 * Overrides ungroup to check if group should be removed.
		 */
		Graph.prototype.removeCellsAfterUngroup = function(cells)
		{
			var cellsToRemove = [];
			
			for (var i = 0; i < cells.length; i++)
			{
				if (this.isCellDeletable(cells[i]) &&
					this.isTransparentState(
						this.view.getState(cells[i])))
				{
					cellsToRemove.push(cells[i]);
				}
			}
			
			cells = cellsToRemove;
			
			mxGraph.prototype.removeCellsAfterUngroup.apply(this, arguments);
		};

		/**
		 * Sets the link for the given cell.
		 */
		Graph.prototype.setLinkForCell = function(cell, link)
		{
			this.setAttributeForCell(cell, 'link', link);
		};

		/**
		 * Creates a link overlay for the given cell.
		 */
		Graph.prototype.createLinkOverlay = function(cell)
		{
			var link = this.getLinkForCell(cell);

			if (link != null && link.length > 0)
			{
				var tip = this.getLinkOverlayTooltip(link);
				var overlay = new mxCellOverlay(
					new mxImage(Editor.lightDarkLinkImage, 16, 16), tip,
					mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP,
					new mxPoint(8, -8));
				overlay.isLinkOverlay = true;

				var graph = this;
				overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt)
				{
					if (graph.isEnabled())
					{
						graph.setSelectionCell(evt.getProperty('cell'));
					}
					else if (this.isCustomLink(link))
					{
						this.customLinkClicked(link, cell);
					}
					else
					{
						var target = this.getLinkTargetForCell(cell);
						this.openLink(this.getAbsoluteUrl(link), target);
					}
				}));

				return overlay;
			}

			return null;
		};

		/**
		 * Returns the tooltip text for a link overlay. Can be overridden
		 * to resolve page links to page names.
		 */
		Graph.prototype.getLinkOverlayTooltip = function(link)
		{
			return link;
		};

		/**
		 * Creates a tooltip overlay for the given cell.
		 */
		Graph.prototype.createTooltipOverlay = function(cell)
		{
			var tooltip = this.convertValueToTooltip(cell);

			if (tooltip != null && tooltip.length > 0)
			{
				var overlay = new mxCellOverlay(
					new mxImage(Editor.lightDarkTooltipImage, 16, 16), tooltip,
					mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP,
					new mxPoint(-8, -8));
				overlay.isTooltipOverlay = true;

				var graph = this;
				overlay.addListener(mxEvent.CLICK, function(sender, evt)
				{
					var cell = evt.getProperty('cell');

					if (graph.isEnabled() && graph.isCellEditable(cell))
					{
						graph.setSelectionCell(cell);
						graph.editTooltip(cell);
					}
					else
					{
						var mouseEvt = evt.getProperty('event');
						var tip = graph.getTooltipForCell(cell);

						if (tip != null && tip.length > 0)
						{
							graph.tooltipHandler.show(tip, mouseEvt.clientX, mouseEvt.clientY);
						}
					}
				});

				return overlay;
			}

			return null;
		};

		/**
		 * Opens the edit tooltip dialog for the given cell. This is a
		 * hook that is implemented in EditorUi where the actions are
		 * available.
		 */
		Graph.prototype.editTooltip = function(cell)
		{
			// empty - implemented in EditorUi
		};

		/**
		 * Sets the link for the given cell.
		 */
		Graph.prototype.setTooltipForCell = function(cell, link)
		{
			var key = 'tooltip';
			
			if (Graph.translateDiagram && Graph.diagramLanguage != null &&
				mxUtils.isNode(cell.value) && cell.value.hasAttribute('tooltip_' + Graph.diagramLanguage))
			{
				key = 'tooltip_' + Graph.diagramLanguage;
			}
			
			this.setAttributeForCell(cell, key, link);
		};
		
		/**
		 * Returns the cells in the model (or given array) that have all of the
		 * given tags in their tags property.
		 */
		Graph.prototype.getAttributeForCell = function(cell, attributeName, defaultValue)
		{
			var value = (cell.value != null && typeof cell.value === 'object') ?
				cell.value.getAttribute(attributeName) : null;
			
			return (value != null) ? value : defaultValue;
		};

		/**
		 * Sets the link for the given cell.
		 */
		Graph.prototype.setAttributeForCell = function(cell, attributeName, attributeValue)
		{
			var value = null;
			
			if (cell.value != null && typeof(cell.value) == 'object')
			{
				value = cell.value.cloneNode(true);
			}
			else
			{
				var doc = mxUtils.createXmlDocument();
				
				value = doc.createElement('UserObject');
				value.setAttribute('label', cell.value || '');
			}
			
			if (attributeValue != null)
			{
				value.setAttribute(attributeName, attributeValue);
			}
			else
			{
				value.removeAttribute(attributeName);
			}
			
			this.model.setValue(cell, value);
		};

		/**
		 * 
		 */
		Graph.prototype.isTargetShape = function(target, cells, evt)
		{
			var shape = mxUtils.getValue(
				this.getCurrentCellStyle(target),
				mxConstants.STYLE_SHAPE, '');

			for (var i = 0; i < cells.length; i++)
			{
				var shapes = mxUtils.getValue(
					this.getCurrentCellStyle(cells[i]),
					'targetShapes', '').split(',');
				
				if (mxUtils.indexOf(shapes, shape) >= 0)
				{
					return true;
				}
			}

			return false;
		};
		
		/**
		 * Overridden to stop moving edge labels between cells.
		 */
		var graphGetDropTarget = Graph.prototype.getDropTarget;
		Graph.prototype.getDropTarget = function(cells, evt, cell, clone)
		{
			// Disables drop into group if alt is pressed
			if (mxEvent.isAltDown(evt))
			{
				return null;
			}
			
			// Disables dragging edge labels out of edges
			for (var i = 0; i < cells.length; i++)
			{
				var parent = this.model.getParent(cells[i]);
				
				if (this.model.isEdge(parent) && mxUtils.indexOf(cells, parent) < 0)
				{
					return null;
				}
			}
			
			var target = graphGetDropTarget.apply(this, arguments);
			
			// Always drops rows to tables
			var rows = true;
			
			for (var i = 0; i < cells.length && rows; i++)
			{
				rows = rows && this.isTableRow(cells[i]);
			}
			
			if (rows)
			{
				if (this.isTableCell(target))
				{
					target = this.model.getParent(target);
				}
				
				if (this.isTableRow(target))
				{
					target = this.model.getParent(target);
				}
				
				if (!this.isTable(target))
				{
					target = null;
				}
			}
			
			return target;
		};
	
		/**
		 * Overrides double click handling to avoid accidental inserts of new labels in dblClick below.
		 */
		Graph.prototype.click = function(me)
		{
			mxGraph.prototype.click.call(this, me);
			
			// Stores state and source for checking in dblClick
			this.firstClickState = me.getState();
			this.firstClickSource = me.getSource();
		};
		
		/**
		 * Overrides double click handling to add the tolerance and inserting text.
		 */
		Graph.prototype.dblClick = function(evt, cell)
		{
			if (this.isEnabled())
			{
				cell = this.insertTextForEvent(evt, cell);
				mxGraph.prototype.dblClick.call(this, evt, cell);
			}
		};

		/**
		 * Overrides double click handling to add the tolerance and inserting text.
		 */
		Graph.prototype.insertTextForEvent = function(evt, cell)
		{
			var pt = mxUtils.convertPoint(this.container, mxEvent.getClientX(evt), mxEvent.getClientY(evt));
	
			// Automatically adds new child cells to edges on double click
			if (evt != null && !this.model.isVertex(cell))
			{
				var state = (this.model.isEdge(cell)) ? this.view.getState(cell) : null;
				var src = mxEvent.getSource(evt);
				
				if ((this.firstClickState == state && this.firstClickSource == src) &&
					(state == null || (state.text == null || state.text.node == null ||
					state.text.boundingBox == null || (!mxUtils.contains(state.text.boundingBox,
					pt.x, pt.y) && !mxUtils.isAncestorNode(state.text.node, mxEvent.getSource(evt))))) &&
					((state == null && !this.isCellLocked(this.getDefaultParent())) ||
					(state != null && !this.isCellLocked(state.cell) &&
					this.getLockedGroupAncestor(this.model.getParent(state.cell)) == null)) &&
					(state != null ||
					(mxClient.IS_SVG && src == this.view.getCanvas().ownerSVGElement)))
				{
					if (state == null)
					{
						state = this.view.getState(this.getCellAt(pt.x, pt.y));
					}
					
					cell = this.addText(pt.x, pt.y, state);
				}
			}
			
			return cell;
		};
		
		/**
		 * Returns a point that specifies the location for inserting cells.
		 */
		Graph.prototype.getInsertPoint = function(ignoreMouseEvent)
		{
			var gs = this.getGridSize();
			var dx = this.container.scrollLeft / this.view.scale - this.view.translate.x;
			var dy = this.container.scrollTop / this.view.scale - this.view.translate.y;
			
			if (this.pageVisible)
			{
				var layout = this.getPageLayout();
				var page = this.getPageSize();
				dx = Math.max(dx, layout.x * page.width);
				dy = Math.max(dy, layout.y * page.height);
			}
			
			return new mxPoint(this.snap(dx + gs), this.snap(dy + gs));
		};
		
		/**
		 * 
		 */
		Graph.prototype.getFreeInsertPoint = function(ignoreMouseEvent)
		{
			var view = this.view;
			var bds = this.getGraphBounds();
			var pt = this.getInsertPoint(ignoreMouseEvent);
			
			// Places at same x-coord and 2 grid sizes below existing graph
			var x = this.snap(Math.round(Math.max(pt.x, bds.x / view.scale - view.translate.x +
				((bds.width == 0) ? 2 * this.gridSize : 0))));
			var y = this.snap(Math.round(Math.max(pt.y, (bds.y + bds.height) / view.scale - view.translate.y +
				2 * this.gridSize)));
			
			return new mxPoint(x, y);
		};
				
		/**
		 * 
		 */
		Graph.prototype.getCenterInsertPoint = function(bbox)
		{
			bbox = (bbox != null) ? bbox : new mxRectangle();
			
			if (mxUtils.hasScrollbars(this.container))
			{
				return new mxPoint(
					this.snap(Math.round((this.container.scrollLeft + this.container.clientWidth / 2) /
						this.view.scale - this.view.translate.x - bbox.width / 2)),
					this.snap(Math.round((this.container.scrollTop + this.container.clientHeight / 2) /
						this.view.scale - this.view.translate.y - bbox.height / 2)));
			}
			else
			{
				return new mxPoint(
					this.snap(Math.round(this.container.clientWidth / 2 / this.view.scale -
						this.view.translate.x - bbox.width / 2)),
					this.snap(Math.round(this.container.clientHeight / 2 / this.view.scale -
						this.view.translate.y - bbox.height / 2)));
			}
		};
		
		/**
		 * Hook for subclassers to return true if the current insert point was defined
		 * using a mouse hover event.
		 */
		Graph.prototype.isMouseInsertPoint = function()
		{			
			return false;
		};
			
		/**
		 * Appends the given font size to the given style.
		 */
		Graph.prototype.appendFontSize = function(style, fontSize)
		{
			style = (style != null) ? style : '';

			if (fontSize != null)
			{
				if (style.length > 0 && style.charAt(style.length - 1) != ';')
				{
					style += ';';
				}

				style += 'fontSize=' + fontSize + ';';
			}

			return style;
		};

		/**
		 * Adds a new label at the given position and returns the new cell. State is
		 * an optional edge state to be used as the parent for the label. Vertices
		 * are not allowed currently as states.
		 */
		Graph.prototype.addText = function(x, y, state)
		{
			// Creates a new edge label with a predefined text
			var label = new mxCell();
			label.value = 'Text';
			label.geometry = new mxGeometry(0, 0, 0, 0);
			label.vertex = true;
			var style = 'html=1;align=center;verticalAlign=middle;resizable=0;points=[];';

			if (state != null && this.model.isEdge(state.cell))
			{
				label.style = 'edgeLabel;' + this.appendFontSize(style, this.edgeFontSize);
				label.geometry.relative = true;
				label.connectable = false;
		    
				// Resets the relative location stored inside the geometry
				var pt2 = this.view.getRelativePoint(state, x, y);
				label.geometry.x = Math.round(pt2.x * 10000) / 10000;
				label.geometry.y = Math.round(pt2.y);
		    
		    	// Resets the offset inside the geometry to find the offset from the resulting point
				label.geometry.offset = new mxPoint(0, 0);
				pt2 = this.view.getPoint(state, label.geometry);
		  
				var scale = this.view.scale;
				label.geometry.offset = new mxPoint(Math.round((x - pt2.x) / scale), Math.round((y - pt2.y) / scale));
			}
			else
			{
				var tr = this.view.translate;
				label.style = 'text;' + this.appendFontSize(style, this.vertexFontSize);
				label.geometry.width = 40;
				label.geometry.height = 20;
				label.geometry.x = Math.round(x / this.view.scale) -
					tr.x - ((state != null) ? state.origin.x : 0);
				label.geometry.y = Math.round(y / this.view.scale) -
					tr.y - ((state != null) ? state.origin.y : 0);
				label.style += 'autosize=1;'
			}

			this.getModel().beginUpdate();
			try
			{
				this.addCells([label], (state != null) ? state.cell : null);
				this.fireEvent(new mxEventObject('textInserted', 'cells', [label]));
				
		    	// Updates size of text after possible change of style via event
				this.autoSizeCell(label);
			}
			finally
			{
				this.getModel().endUpdate();
			}

			return label;
		};

		/**
		 * Adds a handler for clicking on shapes with links. This replaces all links in labels.
		 */
		Graph.prototype.addClickHandler = function(highlight, beforeClick, onClick)
		{
			// Replaces links in labels for consistent right-clicks
			var checkLinks = mxUtils.bind(this, function()
			{
				var links = this.container.getElementsByTagName('a');
				
				if (links != null)
				{
					for (var i = 0; i < links.length; i++)
					{
						var href = this.getAbsoluteUrl(links[i].getAttribute('href'));
						
						if (href != null)
						{
							links[i].setAttribute('rel', this.linkRelation);
							links[i].setAttribute('href', href);
							
							if (beforeClick != null)
			    			{
								mxEvent.addGestureListeners(links[i], null, null, beforeClick);
			    			}
						}
					}
				}
			});
			
			this.model.addListener(mxEvent.CHANGE, checkLinks);
			checkLinks();
			
			var cursor = this.container.style.cursor;
			var tol = this.getTolerance();
			var graph = this;

			var mouseListener =
			{
			    currentState: null,
			    currentLink: null,
				currentTarget: null,
			    highlight: (highlight != null && highlight != '' && highlight != mxConstants.NONE) ?
			    	new mxCellHighlight(graph, highlight, 4) : null,
			    startX: 0,
			    startY: 0,
			    scrollLeft: 0,
			    scrollTop: 0,
			    updateCurrentState: function(me)
			    {
			    	var tmp = me.sourceState;
			    	
			    	// Gets first intersecting ancestor with link
			    	if (tmp == null || graph.getLinkForCell(tmp.cell) == null)
			    	{
			    		var cell = graph.getCellAt(me.getGraphX(), me.getGraphY(), null, null, null, function(state, x, y)
	    				{
			    			return graph.getLinkForCell(state.cell) == null;
	    				});
			    		
			    		tmp = (tmp != null && !graph.model.isAncestor(cell, tmp.cell)) ? null : graph.view.getState(cell);
			    	}

			      	if (tmp != this.currentState)
			      	{
			        	if (this.currentState != null)
			        	{
				          	this.clear();
			        	}
				        
			        	this.currentState = tmp;
				        
			        	if (this.currentState != null)
			        	{
				          	this.activate(this.currentState);
			        	}
			      	}
			    },
			    mouseDown: function(sender, me)
			    {
			    	this.startX = me.getGraphX();
			    	this.startY = me.getGraphY();
				    this.scrollLeft = graph.container.scrollLeft;
				    this.scrollTop = graph.container.scrollTop;
				    
		    		if (this.currentLink == null && graph.container.style.overflow == 'auto')
		    		{
		    			graph.container.style.cursor = 'move';
		    		}
		    		
		    		this.updateCurrentState(me);
			    },
			    mouseMove: function(sender, me)
			    {
			    	if (graph.isMouseDown)
			    	{
			    		if (this.currentLink != null)
			    		{
					    	var dx = Math.abs(this.startX - me.getGraphX());
					    	var dy = Math.abs(this.startY - me.getGraphY());
					    	
					    	if (dx > tol || dy > tol)
					    	{
					    		this.clear();
					    	}
			    		}
			    	}
			    	else
			    	{
				    	// Checks for parent link
				    	var linkNode = me.getSource();
				    	
				    	while (linkNode != null && linkNode.nodeName.toLowerCase() != 'a')
				    	{
				    		linkNode = linkNode.parentNode;
				    	}
				    	
			    		if (linkNode != null)
			    		{
			    			this.clear();
			    		}
			    		else
			    		{
				    		if (graph.tooltipHandler != null && this.currentLink != null && this.currentState != null)
				    		{
				    			graph.tooltipHandler.reset(me, true, this.currentState);
				    		}
				    		
					    	if (this.currentState != null && (me.getState() == this.currentState || me.sourceState == null) &&
					    		graph.intersects(this.currentState, me.getGraphX(), me.getGraphY()))
					    	{
				    			return;
					    	}
					    	
					    	this.updateCurrentState(me);
			    		}
			    	}
			    },
			    mouseUp: function(sender, me)
			    {
			    	var source = me.getSource();
			    	var evt = me.getEvent();
			    	
			    	// Checks for parent link
			    	var linkNode = source;
			    	
			    	while (linkNode != null && linkNode.nodeName.toLowerCase() != 'a')
			    	{
			    		linkNode = linkNode.parentNode;
			    	}

			    	// Ignores clicks on links and collapse/expand icon
			    	if (linkNode == null &&
			    		(((Math.abs(this.scrollLeft - graph.container.scrollLeft) < tol &&
			        	Math.abs(this.scrollTop - graph.container.scrollTop) < tol) &&
			    		(me.sourceState == null || !me.isSource(me.sourceState.control))) &&
			    		(((mxEvent.isLeftMouseButton(evt) || mxEvent.isMiddleMouseButton(evt)) &&
			    		!mxEvent.isPopupTrigger(evt)) || mxEvent.isTouchEvent(evt))))
			    	{
				    	if (this.currentLink != null)
				    	{
				    		var blank = graph.isBlankLink(this.currentLink);
				    		
				    		if ((this.currentLink.substring(0, 5) === 'data:' ||
				    			!blank) && beforeClick != null)
				    		{
			    				beforeClick(evt, this.currentLink, (this.currentState != null) ?
									this.currentState.cell : null);
				    		}
				    		
				    		if (!mxEvent.isConsumed(evt))
				    		{
					    		var target = (this.currentTarget != null) ?
									this.currentTarget : ((mxEvent.isMiddleMouseButton(evt)) ? '_blank' :
					    			((blank) ? graph.linkTarget : '_top'));

					    		graph.openLink(this.currentLink, target);
					    		me.consume();
				    		}
				    	}
				    	else if (onClick != null && !me.isConsumed() &&
			    			(Math.abs(this.scrollLeft - graph.container.scrollLeft) < tol &&
			        		Math.abs(this.scrollTop - graph.container.scrollTop) < tol) &&
			        		(Math.abs(this.startX - me.getGraphX()) < tol &&
			        		Math.abs(this.startY - me.getGraphY()) < tol))
			        	{
				    		onClick(me.getEvent());
			    		}
			    	}
			    	
			    	this.clear();
			    },
			    activate: function(state)
			    {
			    	this.currentLink = graph.getAbsoluteUrl(graph.getLinkForCell(state.cell));

			    	if (this.currentLink != null)
			    	{
						this.currentTarget = graph.getLinkTargetForCell(state.cell)
			    		graph.container.style.cursor = 'pointer';

			    		if (this.highlight != null)
			    		{
			    			this.highlight.highlight(state);
			    		}
				    }
			    },
			    clear: function()
			    {
			    	if (graph.container != null)
			    	{
			    		graph.container.style.cursor = cursor;
			    	}
			    	
					this.currentTarget = null;
			    	this.currentState = null;
			    	this.currentLink = null;
			    	
			    	if (this.highlight != null)
			    	{
			    		this.highlight.hide();
			    	}
			    	
			    	if (graph.tooltipHandler != null)
		    		{
		    			graph.tooltipHandler.hide();
		    		}
			    }
			};

			// Ignores built-in click handling
			graph.click = function(me) {};
			graph.addMouseListener(mouseListener);
			
			mxEvent.addListener(document, 'mouseleave', function(evt)
			{
				mouseListener.clear();
			});
		};
		
		/**
		 * Duplicates the given cells and returns the duplicates.
		 */
		Graph.prototype.duplicateCells = function(cells, append)
		{
			cells = (cells != null) ? cells : this.getSelectionCells();
			append = (append != null) ? append : true;
			
			// Duplicates rows for table cells
			for (var i = 0; i < cells.length; i++)
			{
				if (this.isTableCell(cells[i]))
				{
					cells[i] = this.model.getParent(cells[i]);
				}
			}
			
			cells = this.model.getTopmostCells(cells);
			
			var model = this.getModel();
			var s = this.gridSize;
			var select = [];
			
			model.beginUpdate();
			try
			{
				var cloneMap = new Object();
				var lookup = this.createCellLookup(cells);
				var clones = this.cloneCells(cells, false, cloneMap, true);
				
				for (var i = 0; i < cells.length; i++)
				{
					var parent = model.getParent(cells[i]);

					if (parent != null)
					{
						var child = this.moveCells([clones[i]], s, s, false)[0];
						select.push(child);
						
						if (append)
						{
							model.add(parent, clones[i]);
						}
						else
						{
							// Maintains child index by inserting after clone in parent
							var index = parent.getIndex(cells[i]);
							model.add(parent, clones[i], index + 1);
						}
						
						// Extends tables	
						if (this.isTable(parent))
						{
							var row = this.getCellGeometry(clones[i]);
							var table = this.getCellGeometry(parent);
							
							if (row != null && table != null)
							{
								table = table.clone();
								table.height += row.height;
								model.setGeometry(parent, table);
							}
						}
					}
					else
					{
						select.push(clones[i]);
					}
				}

				// Updates custom links after inserting into the model for cells to have new IDs
				this.updateCustomLinks(this.createCellMapping(cloneMap, lookup), clones, this);
				this.fireEvent(new mxEventObject(mxEvent.CELLS_ADDED, 'cells', clones));
			}
			finally
			{
				model.endUpdate();
			}
			
			return select;
		};
		
		/**
		 * Inserts the given image at the cursor in a content editable text box using
		 * the insertimage command on the document instance.
		 */
		Graph.prototype.insertImage = function(newValue, w, h)
		{
			// To find the new image, we create a list of all existing links first
			if (newValue != null && this.cellEditor.textarea != null)
			{
				var tmp = this.cellEditor.textarea.getElementsByTagName('img');
				var oldImages = [];
				
				for (var i = 0; i < tmp.length; i++)
				{
					oldImages.push(tmp[i]);
				}
				
				// LATER: Fix inserting link/image in IE8/quirks after focus lost
				document.execCommand('insertimage', false, newValue);
				
				// Sets size of new image
				var newImages = this.cellEditor.textarea.getElementsByTagName('img');
				
				if (newImages.length == oldImages.length + 1)
				{
					// Inverse order in favor of appended images
					for (var i = newImages.length - 1; i >= 0; i--)
					{
						if (i == 0 || newImages[i] != oldImages[i - 1])
						{
							// Workaround for lost styles during undo and redo is using attributes
							newImages[i].setAttribute('width', w);
							newImages[i].setAttribute('height', h);
							
							break;
						}
					}
				}
			}
		};
				
		/**
		 * Inserts the given image at the cursor in a content editable text box using
		 * the insertimage command on the document instance.
		 */
		Graph.prototype.insertLink = function(value)
		{
			if (this.cellEditor.textarea != null)
			{
				if (value.length == 0)
				{
					document.execCommand('unlink', false);
				}
				else if (mxClient.IS_FF)
				{
					// Workaround for Firefox that adds a new link and removes
					// the href from the inner link if its parent is a span is
					// to remove all inner links inside the new outer link
					var tmp = this.cellEditor.textarea.getElementsByTagName('a');
					var oldLinks = [];
					
					for (var i = 0; i < tmp.length; i++)
					{
						oldLinks.push(tmp[i]);
					}
					
					document.execCommand('createlink', false, mxUtils.trim(value));
					
					// Finds the new link element
					var newLinks = this.cellEditor.textarea.getElementsByTagName('a');
					
					if (newLinks.length == oldLinks.length + 1)
					{
						// Inverse order in favor of appended links
						for (var i = newLinks.length - 1; i >= 0; i--)
						{
							if (newLinks[i] != oldLinks[i - 1])
							{
								// Removes all inner links from the new link and
								// moves the children to the inner link parent
								var tmp = newLinks[i].getElementsByTagName('a');
								
								while (tmp.length > 0)
								{
									var parent = tmp[0].parentNode;
									
									while (tmp[0].firstChild != null)
									{
										parent.insertBefore(tmp[0].firstChild, tmp[0]);
									}
									
									parent.removeChild(tmp[0]);
								}
								
								break;
							}
						}
					}
				}
				else
				{
					// LATER: Fix inserting link/image in IE8/quirks after focus lost
					document.execCommand('createlink', false, mxUtils.trim(value));
				}
			}
		};
		
		/**
		 * 
		 * @param cell
		 * @returns {Boolean}
		 */
		/**
		 * Includes cells that isCellResizable rejects (so they show no sizers)
		 * but the turn action can still rotate by advancing the direction style:
		 * transparentBounds swimlanes, and swimlane-shaped table cells (the lanes
		 * of a cross-functional flowchart, which isCellResizable filters out as
		 * table cells). Plain table rows/cells stay excluded as they are not
		 * swimlane shapes.
		 */
		var graphGetResizableCells = Graph.prototype.getResizableCells;
		Graph.prototype.getResizableCells = function(cells)
		{
			var result = graphGetResizableCells.apply(this, arguments);

			if (cells != null)
			{
				for (var i = 0; i < cells.length; i++)
				{
					if ((this.isTransparentBounds(cells[i]) ||
						this.getCurrentCellStyle(cells[i])[mxConstants.STYLE_SHAPE] ==
						mxConstants.SHAPE_SWIMLANE) &&
						mxUtils.indexOf(result, cells[i]) < 0)
					{
						result.push(cells[i]);
					}
				}
			}

			return result;
		};

		Graph.prototype.isCellResizable = function(cell)
		{
			if (this.isTransparentBounds(cell))
			{
				return false;
			}

			var result = mxGraph.prototype.isCellResizable.apply(this, arguments);
			var style = this.getCurrentCellStyle(cell);

			return !this.isTableCell(cell) && !this.isTableRow(cell) && (result ||
				(mxUtils.getValue(style, mxConstants.STYLE_RESIZABLE, '1') != '0' &&
				style[mxConstants.STYLE_WHITE_SPACE] == 'wrap'));
		};

		/**
		 * Aligns a selection that includes one or more transparentBounds groups.
		 * The base reads each cell's stored geometry and writes it via resizeCell,
		 * but a transparentBounds group's geometry is pinned at (0,0,0,0) and its
		 * visible box is derived from its children — so the base aligns to (and
		 * "moves") a zero-size box at the group's parent origin, leaving the group
		 * visually unmoved while corrupting the pinned geometry. With no
		 * transparentBounds cell in the selection this delegates verbatim to the
		 * base. Otherwise the alignment coordinate is taken from each cell's visible
		 * bounds, transparentBounds groups are moved with translateCell (which
		 * translates their children) and every other cell is moved exactly as the
		 * base does (identical resulting geometry).
		 */
		Graph.prototype.alignCells = function(align, cells, param)
		{
			if (cells == null)
			{
				cells = this.getMovableCells(this.getSelectionCells());
			}

			var hasTransparent = false;

			if (cells != null)
			{
				for (var i = 0; i < cells.length; i++)
				{
					if (this.isTransparentBounds(cells[i]))
					{
						hasTransparent = true;
						break;
					}
				}
			}

			if (!hasTransparent)
			{
				return mxGraph.prototype.alignCells.apply(this, arguments);
			}

			var graph = this;

			// Visible model-space bounds of a cell (excluding the view translate):
			// the child-derived box for a transparentBounds group, the stored
			// geometry otherwise. Returns null for edges and relative cells, which
			// the base alignment also skips.
			var boundsOf = function(cell)
			{
				if (graph.model.isEdge(cell))
				{
					return null;
				}

				var geo = graph.getCellGeometry(cell);

				if (geo == null || geo.relative)
				{
					return null;
				}

				var origin = graph.getOriginForCell(cell);

				if (graph.isTransparentBounds(cell))
				{
					var local = graph.getTransparentBounds(cell);

					if (local == null)
					{
						return null;
					}

					return new mxRectangle(origin.x + geo.x + local.x,
						origin.y + geo.y + local.y, local.width, local.height);
				}

				return new mxRectangle(origin.x + geo.x, origin.y + geo.y,
					geo.width, geo.height);
			};

			if (cells != null && cells.length > 1)
			{
				if (param == null)
				{
					for (var i = 0; i < cells.length; i++)
					{
						var b = boundsOf(cells[i]);

						if (b == null)
						{
							continue;
						}

						if (param == null)
						{
							if (align == mxConstants.ALIGN_CENTER)
							{
								param = b.x + b.width / 2;
								break;
							}
							else if (align == mxConstants.ALIGN_RIGHT)
							{
								param = b.x + b.width;
							}
							else if (align == mxConstants.ALIGN_TOP)
							{
								param = b.y;
							}
							else if (align == mxConstants.ALIGN_MIDDLE)
							{
								param = b.y + b.height / 2;
								break;
							}
							else if (align == mxConstants.ALIGN_BOTTOM)
							{
								param = b.y + b.height;
							}
							else
							{
								param = b.x;
							}
						}
						else
						{
							if (align == mxConstants.ALIGN_RIGHT)
							{
								param = Math.max(param, b.x + b.width);
							}
							else if (align == mxConstants.ALIGN_TOP)
							{
								param = Math.min(param, b.y);
							}
							else if (align == mxConstants.ALIGN_BOTTOM)
							{
								param = Math.max(param, b.y + b.height);
							}
							else
							{
								param = Math.min(param, b.x);
							}
						}
					}
				}

				if (param != null)
				{
					// Processes from parent to child
					cells = mxUtils.sortCells(cells);

					this.model.beginUpdate();
					try
					{
						for (var i = 0; i < cells.length; i++)
						{
							var b = boundsOf(cells[i]);

							if (b == null)
							{
								continue;
							}

							var dx = 0;
							var dy = 0;

							if (align == mxConstants.ALIGN_CENTER)
							{
								dx = param - (b.x + b.width / 2);
							}
							else if (align == mxConstants.ALIGN_RIGHT)
							{
								dx = param - (b.x + b.width);
							}
							else if (align == mxConstants.ALIGN_TOP)
							{
								dy = param - b.y;
							}
							else if (align == mxConstants.ALIGN_MIDDLE)
							{
								dy = param - (b.y + b.height / 2);
							}
							else if (align == mxConstants.ALIGN_BOTTOM)
							{
								dy = param - (b.y + b.height);
							}
							else
							{
								dx = param - b.x;
							}

							if (dx != 0 || dy != 0)
							{
								if (this.isTransparentBounds(cells[i]))
								{
									this.translateCell(cells[i], dx, dy);
								}
								else
								{
									var geo = this.getCellGeometry(cells[i]).clone();
									geo.x += dx;
									geo.y += dy;
									this.resizeCell(cells[i], geo);
								}
							}
						}

						this.fireEvent(new mxEventObject(mxEvent.ALIGN_CELLS,
							'align', align, 'cells', cells));
					}
					finally
					{
						this.model.endUpdate();
					}
				}
			}

			return cells;
		};
		
		/**
		 * Function: distributeCells
		 * 
		 * Distribuets the centers of the given cells equally along the available
		 * horizontal or vertical space.
		 * 
		 * Parameters:
		 * 
		 * horizontal - Boolean that specifies the direction of the distribution.
		 * cells - Optional array of <mxCells> to be distributed. Edges are ignored.
		 */
		Graph.prototype.distributeCells = function(horizontal, cells, spacing)
		{
			if (cells == null)
			{
				cells = this.getSelectionCells();
			}
			
			if (cells != null && cells.length > 1)
			{
				var vertices = [];
				var max = null;
				var min = null;
				var cellsSize = 0;
				
				for (var i = 0; i < cells.length; i++)
				{
					if (this.getModel().isVertex(cells[i]))
					{
						var state = this.view.getState(cells[i]);
						
						if (state != null)
						{
							var tmp = (horizontal) ? state.getCenterX() : state.getCenterY();
							max = (max != null) ? Math.max(max, tmp) : tmp;
							min = (min != null) ? Math.min(min, tmp) : tmp;
							
							if (spacing)
							{
								cellsSize += (horizontal) ? state.width : state.height;
							}

							vertices.push(state);
						}
					}
				}
				
				if (vertices.length > 2)
				{
					vertices.sort(function(a, b)
					{
						return (horizontal) ? a.x - b.x : a.y - b.y;
					});
		
					if (spacing)
					{
						cellsSize -= (horizontal? (vertices[0].width / 2 + vertices[vertices.length - 1].width / 2) :
									(vertices[0].height / 2 + vertices[vertices.length - 1].height / 2))
					}

					var t = this.view.translate;
					var s = this.view.scale;
					
					min = min / s - ((horizontal) ? t.x : t.y);
					max = max / s - ((horizontal) ? t.x : t.y);
					
					this.getModel().beginUpdate();
					try
					{
						var dt = (max - min - cellsSize) / (vertices.length - 1);
						var t0 = min + (spacing? (horizontal? vertices[0].width / 2 : vertices[0].height / 2) : 0);
						
						for (var i = 1; i < vertices.length - 1; i++)
						{
							var pstate = this.view.getState(this.model.getParent(vertices[i].cell));
							var geo = this.getCellGeometry(vertices[i].cell);
							t0 += dt;
							
							if (geo != null && pstate != null)
							{
								if (this.isTransparentBounds(vertices[i].cell))
								{
									// Geometry is pinned at (0,0,0,0) and ignored by
									// rendering, so writing it leaves the group in place.
									// Move the group (its children) by the delta from its
									// current visible position to the distributed target.
									var cur = (horizontal) ?
										((spacing) ? vertices[i].x / s - t.x :
											vertices[i].getCenterX() / s - t.x) :
										((spacing) ? vertices[i].y / s - t.y :
											vertices[i].getCenterY() / s - t.y);

									if (horizontal)
									{
										this.translateCell(vertices[i].cell, t0 - cur, 0);
									}
									else
									{
										this.translateCell(vertices[i].cell, 0, t0 - cur);
									}
								}
								else
								{
									geo = geo.clone();

									if (horizontal)
									{
										geo.x = Math.round(t0 - (spacing? 0 : geo.width / 2)) - pstate.origin.x;
									}
									else
									{
										geo.y = Math.round(t0 - (spacing? 0 : geo.height / 2)) - pstate.origin.y;
									}

									this.getModel().setGeometry(vertices[i].cell, geo);
								}
							}

							if (spacing)
							{
								t0 += horizontal? vertices[i].width : vertices[i].height;
							}
						}
					}
					finally
					{
						this.getModel().endUpdate();
					}
				}
			}
			
			return cells;
		};
		
		/**
		 * Adds meta-drag an Mac.
		 * @param evt
		 * @returns
		 */
		Graph.prototype.isCloneEvent = function(evt)
		{
			return (mxClient.IS_MAC && mxEvent.isMetaDown(evt)) || mxEvent.isControlDown(evt);
		};

		/**
		 * Translates this point by the given vector.
		 * 
		 * @param {number} dx X-coordinate of the translation.
		 * @param {number} dy Y-coordinate of the translation.
		 */
		Graph.prototype.createSvgImageExport = function(includeCellId, addSvgData)
		{
			var exp = new mxImageExport();

			// Adds cell IDs and cell heirarchy
			exp.addCellData = function(cell, group, includeValue)
			{
				group.setAttribute('data-cell-id', cell.id);

				if (includeValue)
				{
					if (mxUtils.isNode(cell.value))
					{
						for (var i = 0; i < cell.value.attributes.length; i++)
						{
							var attrib = cell.value.attributes[i];
							group.setAttribute('data-cell-' + attrib.name, attrib.value);
						}
					}
					else if (typeof cell.value === 'object')
					{
						for (var key in cell.value)
						{
							group.setAttribute('data-cell-' + key, cell.value[key]);
						}
					}
					else if (cell.value != null)
					{
						group.setAttribute('data-cell-value', cell.value);
					}
				}

				// Mirrors the cell value's XML attributes as data-meta-{attr} on the
				// wrapper group. The data-meta- prefix is reserved for user-defined
				// metadata so it cannot collide with internal attributes such as
				// data-cell-id even when a property is literally named "cell-id".
				if (addSvgData && mxUtils.isNode(cell.value))
				{
					for (var i = 0; i < cell.value.attributes.length; i++)
					{
						var attrib = cell.value.attributes[i];
						group.setAttribute('data-meta-' + attrib.name, attrib.value);
					}
				}

				return group;
			};

			// Maps cell hierarchy to SVG group structure
			var visitStatesRecursive = exp.visitStatesRecursive;
			exp.visitStatesRecursive = function(state, canvas, visitor)
			{
				if (state != null)
				{
					var root = canvas.root;
					var svgDoc = canvas.root.ownerDocument;
					canvas.root = this.addCellData(state.cell,
						(svgDoc.createElementNS != null) ?
							svgDoc.createElementNS(mxConstants.NS_SVG, 'g') :
							svgDoc.createElement('g'), Editor.addSvgMetadata);
					root.appendChild(canvas.root);
					visitStatesRecursive.apply(this, arguments);
					canvas.root = root;
				}
			};

			// Adds hyperlinks (experimental)
			exp.getLinkForCellState = mxUtils.bind(this, function(state, canvas)
			{
				return this.getLinkForCell(state.cell);
			});

			// Adds tooltips (experimental)
			exp.getTitleForCellState = mxUtils.bind(this, function(state, canvas)
			{
				return Editor.convertHtmlToText(this.convertValueToTooltip(state.cell));
			});

			return exp;
		};
		
		/**
		 * Parses the given background image.
		 */
		Graph.prototype.parseBackgroundImage = function(json)
		{
			var result = null;

			if (json != null && json.length > 0)
			{
				var obj = JSON.parse(json);
				result = new mxImage(obj.src, obj.width, obj.height)
			}

			return result;
		};
		
		/**
		 * Parses the given background image.
		 */
		Graph.prototype.getBackgroundImageObject = function(obj)
		{
			return obj;
		};

		/**
		 * Translates this point by the given vector.
		 * 
		 * @param {number} dx X-coordinate of the translation.
		 * @param {number} dy Y-coordinate of the translation.
		 */
		Graph.prototype.getSvg = function(background, scale, border, nocrop, crisp,
			ignoreSelection, showText, imgExport, linkTarget, hasShadow, incExtFonts,
			theme, exportType, cells, noCssClass, disableLinks, grid)
		{
			var lookup = null;
			
			if (cells != null)
			{
				lookup = new mxDictionary();
				
				for (var i = 0; i < cells.length; i++)
		    	{
		    		lookup.put(cells[i], true);
		        }
			}
			
			// Disables CSS Transforms
			var origUseCssTrans = this.useCssTransforms;
			var origEnabledFlowAnimation = this.enableFlowAnimation;
			this.enableFlowAnimation = false;
			
			if (origUseCssTrans) 
			{
				this.useCssTransforms = false;
				this.view.revalidate();
				this.sizeDidChange();
			}

			try 
			{
				scale = (scale != null) ? scale : 1;
				border = (border != null) ? border : 0;
				crisp = (crisp != null) ? crisp : true;
				ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
				showText = (showText != null) ? showText : true;
				hasShadow = (hasShadow != null) ? hasShadow : false;
				linkTarget = (linkTarget != null) ? linkTarget : this.defaultExportLinkTarget;
	
				var bounds = (exportType == 'page') ? this.view.getBackgroundPageBounds() :
					(((ignoreSelection && lookup == null) || nocrop ||
					exportType == 'diagram') ? this.getGraphBounds() :
					this.getBoundingBox(this.getSelectionCells()));
				var bgImg = this.backgroundImage;
				var tr = this.view.translate;
				var vs = this.view.scale;

				if (exportType == 'diagram' && bgImg != null &&
					bgImg.width != null && bgImg.height != null)
				{
					bounds = mxRectangle.fromRectangle(bounds);
					bounds.add(new mxRectangle((tr.x + bgImg.x) * vs,
						(tr.y + bgImg.y) * vs, bgImg.width * vs,
					 	bgImg.height * vs));
				}
	
				if (bounds == null)
				{
					throw Error(mxResources.get('drawingEmpty'));
				}

				// Prepares SVG document that holds the output
				var s = scale / vs;
				var w = Math.max(1, Math.ceil(bounds.width * s) + 2 * border) +
					((hasShadow && border == 0) ? 5 : 0);
				var h = Math.max(1, Math.ceil(bounds.height * s) + 2 * border) +
					((hasShadow && border == 0) ? 5 : 0);
				
				// Converts CSS background color as it is excluded from the filter
				var cssBackground = mxUtils.getLightDarkColor(background);
				var root = Graph.createSvgNode(0, 0, w, h, cssBackground);
				var svgDoc = root.ownerDocument;

				// Adds background as an additional rectangle for
				// compatiblity with MS Office and event handling
				if (background != null)
				{
					var rect = mxUtils.createElementNs(
						svgDoc, mxConstants.NS_SVG, 'rect');
					rect.setAttribute('fill', cssBackground.light);
					rect.style.fill = cssBackground.cssText;
					rect.setAttribute('width', '100%');
					rect.setAttribute('height', '100%');
					rect.setAttribute('x', '0');
					rect.setAttribute('y', '0');
					root.appendChild(rect);
				}

			    // Renders graph. Offset will be multiplied with state's scale when painting state.
				// TextOffset only seems to affect FF output but used everywhere for consistency.
				var group = mxUtils.createElementNs(
					svgDoc, mxConstants.NS_SVG, 'g');
			    root.appendChild(group);

				var svgCanvas = this.createSvgCanvas(group);
				var dx = Math.floor(border / scale - bounds.x / vs);
				var dy = Math.floor(border / scale - bounds.y / vs);
				svgCanvas.translate(dx, dy);
				svgCanvas.idPrefix = 'drawio-svg-' + Editor.guid();

				// Paints the grid as a pattern between the background color and the
				// cells, aligned to the diagram origin. Model coordinates map to
				// (value + translate + dx) * scale in the output as the shapes
				// rescale the canvas by the view scale when painting.
				if (grid)
				{
					var minorDist = this.gridSize * scale;
					var phase = this.view.gridSteps * minorDist;
					var d = [];

					for (var i = 1; i < this.view.gridSteps; i++)
					{
						var pos = i * minorDist;
						d.push('M 0 ' + pos + ' L ' + phase + ' ' + pos +
							' M ' + pos + ' 0 L ' + pos + ' ' + phase);
					}

					var gridColor = mxUtils.getLightDarkColor(this.view.gridColor);
					var pattern = mxUtils.createElementNs(
						svgDoc, mxConstants.NS_SVG, 'pattern');
					pattern.setAttribute('id', svgCanvas.idPrefix + '-grid');
					pattern.setAttribute('patternUnits', 'userSpaceOnUse');
					pattern.setAttribute('width', phase);
					pattern.setAttribute('height', phase);
					pattern.setAttribute('x', mxUtils.mod((tr.x + dx) * scale, phase));
					pattern.setAttribute('y', mxUtils.mod((tr.y + dy) * scale, phase));

					if (d.length > 0)
					{
						var minorPath = mxUtils.createElementNs(
							svgDoc, mxConstants.NS_SVG, 'path');
						minorPath.setAttribute('d', d.join(' '));
						minorPath.setAttribute('fill', 'none');
						minorPath.setAttribute('stroke', gridColor.light);
						minorPath.style.stroke = gridColor.cssText;
						minorPath.setAttribute('opacity', '0.2');
						minorPath.setAttribute('stroke-width', scale);
						pattern.appendChild(minorPath);
					}

					var majorPath = mxUtils.createElementNs(
						svgDoc, mxConstants.NS_SVG, 'path');
					majorPath.setAttribute('d', 'M ' + phase + ' 0 L 0 0 0 ' + phase);
					majorPath.setAttribute('fill', 'none');
					majorPath.setAttribute('stroke', gridColor.light);
					majorPath.style.stroke = gridColor.cssText;
					majorPath.setAttribute('stroke-width', scale);
					pattern.appendChild(majorPath);
					svgCanvas.defs.appendChild(pattern);

					var gridRect = mxUtils.createElementNs(
						svgDoc, mxConstants.NS_SVG, 'rect');
					gridRect.setAttribute('width', '100%');
					gridRect.setAttribute('height', '100%');
					gridRect.setAttribute('fill', 'url(#' +
						pattern.getAttribute('id') + ')');
					root.insertBefore(gridRect, group);
				}
				
				// Convert HTML entities
				var htmlConverter = document.createElement('div');
				
				// Adds simple text fallback for viewers with no support for foreignObjects
				var getAlternateText = svgCanvas.getAlternateText;
				svgCanvas.getAlternateText = function(fo, x, y, w, h, str,
					align, valign, wrap, format, overflow, clip, rotation)
				{
					// Assumes a max character width of 0.5em
					if (str != null && this.state.fontSize > 0)
					{
						try
						{
							if (mxUtils.isNode(str))
							{
								str = str.innerText;
							}
							else
							{
								htmlConverter.innerHTML = str;
								str = mxUtils.extractTextWithWhitespace(htmlConverter.childNodes);
							}
							
							// Workaround for substring breaking double byte UTF
							var exp = Math.ceil(2 * w / this.state.fontSize);
							var result = [];
							var length = 0;
							var index = 0;
							
							while ((exp == 0 || length < exp) && index < str.length)
							{
								var char = str.charCodeAt(index);
								
								if (char == 10 || char == 13)
								{
									if (length > 0)
									{
										break;
									}
								}
								else
								{
									result.push(str.charAt(index));

									if (char < 255)
									{
										length++;
									}
								}
								
								index++;
							}
							
							// Uses result and adds ellipsis if more than 1 char remains
							if (result.length < str.length && str.length - result.length > 1)
							{
								str = mxUtils.trim(result.join('')) + '...';
							}
							
							return str;
						}
						catch (e)
						{
							return getAlternateText.apply(this, arguments);
						}
					}
					else
					{
						return getAlternateText.apply(this, arguments);
					}
				};
				
				// Paints background image
				if (bgImg != null && bgImg.width != null && bgImg.height != null)
				{
					var s2 = vs / scale;
					var tmp = new mxRectangle((bgImg.x + tr.x) * s2,
						(bgImg.y + tr.y) * s2, bgImg.width * s2,
						bgImg.height * s2);
					
					// Checks if visible
					if (mxUtils.intersects(bounds, tmp))
					{
						svgCanvas.image(bgImg.x + tr.x, bgImg.y + tr.y,
							bgImg.width, bgImg.height, bgImg.src, true);
					}
				}
				
				svgCanvas.scale(s);
				svgCanvas.textEnabled = showText;
				
				imgExport = (imgExport != null) ? imgExport : this.createSvgImageExport();

				// Ignores custom links
				var imgExportGetLinkForCellState = imgExport.getLinkForCellState;
				
				imgExport.getLinkForCellState = function(state, canvas)
				{
					var result = state.view.graph.getAbsoluteUrl(imgExportGetLinkForCellState.apply(this, arguments));
					
					return (result != null && !state.view.graph.isCustomLink(result)) ? result : null;
				};
				
				imgExport.getLinkTargetForCellState = function(state, canvas)
				{
					return state.view.graph.getLinkTargetForCell(state.cell);
				};

				// Implements ignoreSelection flag and flow animation
				var imgExportDrawCellState = imgExport.drawCellState;
				var flowAnimationId = null;

				var addFlowAnimationStyle = mxUtils.bind(this, function()
				{
					if (flowAnimationId == null)
					{
						flowAnimationId  = 'ge-flow-animation-' + Editor.guid();
						var style = (svgDoc.createElementNS != null) ?
							svgDoc.createElementNS(mxConstants.NS_SVG, 'style') :
							svgDoc.createElement('style');
						style.innerHTML = this.createFlowAnimationCss(flowAnimationId);
						svgDoc.getElementsByTagName('defs')[0].appendChild(style);
					}

					return flowAnimationId;
				});

				imgExport.drawCellState = function(state, canvas)
				{
					var graph = state.view.graph;
					var selected = (lookup != null) ? lookup.get(state.cell) :
						graph.isCellSelected(state.cell);
					var parent = graph.model.getParent(state.cell);
					
					// Checks if parent cell is selected
					while ((!ignoreSelection || lookup != null) &&
						!selected && parent != null)
					{
						selected = (lookup != null) ? lookup.get(parent) :
							graph.isCellSelected(parent);
						parent = graph.model.getParent(parent);
					}

					// Adds flow animation
					if (state.shape != null)
					{
						try
						{
							var isFlowAnimationEnabled = state.shape.isFlowAnimationEnabled;
							var addFlowAnimationToShape = state.shape.addFlowAnimationToShape;

							state.shape.isFlowAnimationEnabled = function()
							{
								return origEnabledFlowAnimation && graph.model.isEdge(state.cell) &&
									mxUtils.getValue(state.style, 'flowAnimation', '0') == '1';
							};
							
							state.shape.addFlowAnimationToShape = function()
							{
								graph.addFlowAnimationToNode(this.getFlowAnimationPath(),
									state.style, scale, addFlowAnimationStyle());
							};

							if ((ignoreSelection && lookup == null) || selected)
							{
								graph.view.redrawEnumerationState(state);
								imgExportDrawCellState.apply(this, arguments);
								this.doDrawShape(state.secondLabel, canvas);
							}
						}
						finally
						{
							state.shape.isFlowAnimationEnabled = isFlowAnimationEnabled;
							state.shape.addFlowAnimationToShape = addFlowAnimationToShape;
						}
					}
				};
				
				var viewRoot = (this.view.currentRoot != null) ?
					this.view.currentRoot : this.model.root;
				imgExport.drawState(this.getView().getState(viewRoot), svgCanvas);
				this.addForeignObjectWarning(svgCanvas, root);

				// Routes light-dark() colors that contain a var() through a
				// custom property so they degrade to the light color in browsers
				// without light-dark() support (e.g. Firefox ESR 115).
				Graph.addAdaptiveColors(root, this.shapeBackgroundColor);

				// Disables links
				if (disableLinks)
				{
					this.disableSvgLinks(root);
				}
				else
				{
					this.updateSvgLinks(root, linkTarget, true);
				}
				
				return root;
			}
			finally
			{
				this.enableFlowAnimation = origEnabledFlowAnimation;

				if (origUseCssTrans) 
				{
					this.useCssTransforms = true;
					this.view.revalidate();
					this.sizeDidChange();
				}
			}
		};
		
		/**
		 * Adds warning for truncated labels in older viewers.
		 */
		Graph.prototype.addForeignObjectWarning = function(canvas, root)
		{
			if (urlParams['svg-warning'] != '0' && root.getElementsByTagName('foreignObject').length > 0)
			{
				var sw = canvas.createElement('switch');
				var g1 = canvas.createElement('g');
				g1.setAttribute('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility');
				var a = canvas.createElement('a');
				a.setAttribute('transform', 'translate(0,-5)');
				
				// Workaround for implicit namespace handling in HTML5 export, IE adds NS1 namespace so use code below
				// in all IE versions except quirks mode. KNOWN: Adds xlink namespace to each image tag in output.
				if (a.setAttributeNS == null || (root.ownerDocument != document && document.documentMode == null))
				{
					a.setAttribute('xlink:href', Graph.foreignObjectWarningLink);
					a.setAttribute('target', '_blank');
				}
				else
				{
					a.setAttributeNS(mxConstants.NS_XLINK, 'xlink:href', Graph.foreignObjectWarningLink);
					a.setAttributeNS(mxConstants.NS_XLINK, 'target', '_blank');
				}
				
				var text = canvas.createElement('text');
				text.setAttribute('text-anchor', 'middle');
				text.setAttribute('font-size', '10px');
				text.setAttribute('x', '50%');
				text.setAttribute('y', '100%');
				mxUtils.write(text, Graph.foreignObjectWarningText);
				
				sw.appendChild(g1);
				a.appendChild(text);
				sw.appendChild(a);
				root.appendChild(sw);
			}
		};
			
		/**
		 * Hook for creating the canvas used in getSvg.
		 */
		Graph.prototype.disableSvgLinks = function(node, visit)
		{
			var links = node.getElementsByTagName('a');
			
			for (var i = 0; i < links.length; i++)
			{
				var href = links[i].getAttribute('href');
				
				if (href == null)
				{
					href = links[i].getAttribute('xlink:href');
				}
				
				if (href != null)
				{
					links[i].style.pointerEvents = 'none';
					links[i].setAttribute('href', '');
				}

				if (visit)
				{
					visit(links[i]);
				}
			}
		};
		
		/**
		 * Hook for creating the canvas used in getSvg.
		 */
		Graph.prototype.updateSvgLinks = function(node, target, removeCustom)
		{
			var links = node.getElementsByTagName('a');
			
			for (var i = 0; i < links.length; i++)
			{
				if (links[i].getAttribute('target') == null)
				{
					var href = links[i].getAttribute('href');
					
					if (href == null)
					{
						href = links[i].getAttribute('xlink:href');
					}
					
					if (href != null)
					{
						if (target != null && /^https?:\/\//.test(href))
						{
							links[i].setAttribute('target', target);
						}
						else if (removeCustom && this.isCustomLink(href))
						{
							links[i].setAttribute('href', 'javascript:void(0);');
						}
					}
				}
			}
		};
		
		/**
		 * Hook for creating the canvas used in getSvg.
		 */
		Graph.prototype.createSvgCanvas = function(node)
		{
			var canvas = new mxSvgCanvas2D(node);
			canvas.minStrokeWidth = this.cellRenderer.minSvgStrokeWidth;
			canvas.adaptiveColors = this.getAdaptiveColors();
			canvas.pointerEvents = true;
			
			return canvas;
		};
		
		/**
		 * Returns the first ancestor of the current selection with the given name.
		 */
		Graph.prototype.getSelectedElement = function()
		{
			var node = null;
			
			if (window.getSelection)
			{
				var sel = window.getSelection();
				
			    if (sel.getRangeAt && sel.rangeCount)
			    {
			        var range = sel.getRangeAt(0);
			        node = range.commonAncestorContainer;
			    }
			}
			else if (document.selection)
			{
				node = document.selection.createRange().parentElement();
			}
			
			return node;
		};
			
		/**
		 * Returns the text editing element.
		 */
		Graph.prototype.getSelectedEditingElement = function()
		{
			var node = null;
			
			if (this.cellEditor.textarea != null)
			{
				node = this.getSelectedElement();

				while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT)
				{
					node = node.parentNode;
				}
			}
			
			return node;
		};
		
		/**
		 * Returns the first ancestor of the current selection with the given name.
		 */
		Graph.prototype.getParentByName = function(node, name, stopAt)
		{
			while (node != null)
			{
				if (node.nodeName == name)
				{
					return node;
				}
		
				if (node == stopAt)
				{
					return null;
				}
				
				node = node.parentNode;
			}
			
			return node;
		};
		
		/**
		 * Returns the first ancestor of the current selection with the given name.
		 */
		Graph.prototype.getParentByNames = function(node, names, stopAt)
		{
			while (node != null)
			{
				if (mxUtils.indexOf(names, node.nodeName) >= 0)
				{
					return node;
				}
		
				if (node == stopAt)
				{
					return null;
				}
				
				node = node.parentNode;
			}
			
			return node;
		};
		
		/**
		 * Selects the given node.
		 */
		Graph.prototype.selectNode = function(node)
		{
			var sel = null;
			
		    // IE9 and non-IE
			if (window.getSelection)
		    {
		    	sel = window.getSelection();
		    	
		        if (sel.getRangeAt && sel.rangeCount)
		        {
		        	var range = document.createRange();
		            range.selectNode(node);
		            sel.removeAllRanges();
		            sel.addRange(range);
		        }
		    }
		    // IE < 9
			else if ((sel = document.selection) && sel.type != 'Control')
		    {
		        var originalRange = sel.createRange();
		        originalRange.collapse(true);
		        var range = sel.createRange();
		        range.setEndPoint('StartToStart', originalRange);
		        range.select();
		    }
		};
		
		/**
		 * Flips the given cells horizontally or vertically.
		 */
		Graph.prototype.flipEdgePoints = function(cell, horizontal, c)
		{
			var geo = this.getCellGeometry(cell);

			if (geo != null)
			{
				geo = geo.clone();

				if (geo.points != null)
				{
					for (var i = 0; i < geo.points.length; i++)
					{
						if (horizontal)
						{
							geo.points[i].x = c + (c - geo.points[i].x);
						}
						else
						{
							geo.points[i].y = c + (c - geo.points[i].y);
						}
					}
				}

				var flipTerminalPoint = function(pt)
				{
					if (pt != null)
					{
						if (horizontal)
						{
							pt.x = c + (c - pt.x);
						}
						else
						{
							pt.y = c + (c - pt.y);
						}
					}
				};

				flipTerminalPoint(geo.getTerminalPoint(true));
				flipTerminalPoint(geo.getTerminalPoint(false));

				this.model.setGeometry(cell, geo);
			}
		};
		
		/**
		 * Flips the given cells horizontally or vertically.
		 */
		Graph.prototype.flipChildren = function(cell, horizontal, c)
		{
			this.model.beginUpdate();
			try
			{
				var childCount = this.model.getChildCount(cell);

				for (var i = 0; i < childCount; i++)
				{
					var child = this.model.getChildAt(cell, i);

					if (this.model.isEdge(child))
					{
						this.flipEdgePoints(child, horizontal, c);
					}
					else
					{
						var geo = this.getCellGeometry(child);

						if (geo != null)
						{
							geo = geo.clone();

							if (horizontal)
							{
								geo.x = c + (c - geo.x - geo.width);
							}
							else
							{
								geo.y = c + (c - geo.y - geo.height);
							}

							this.model.setGeometry(child, geo);
						}	
					}
				}
			}
			finally
			{
				this.model.endUpdate();
			}
		};
				
		/**
		 * Function: getConnectionPoint
		 *
		 * Overrides the mxGraph method to add legacy support for anchor points.
		 * 
		 * Parameters:
		 * 
		 * vertex - <mxCellState> that represents the vertex.
		 * constraint - <mxConnectionConstraint> that represents the connection point
		 * constraint as returned by <getConnectionConstraint>.
		 */
		Graph.prototype.getConnectionPoint = function(vertex, constraint, round)
		{
			var point = null;

			// Legacy support for anchor points where the order of rotation and flipping
			// is different from the way shapes are drawn (this is the default)
			if (vertex != null && mxUtils.getValue(vertex.style, 'legacyAnchorPoints', 1) == 1)
			{
				point = this.getLegacyConnectionPoint(vertex, constraint, round);
			}
			else
			{
				point = mxGraph.prototype.getConnectionPoint.apply(this, arguments);
			}

			return point;
		};

		/**
		 * Function: getLegacyConnectionPoint
		 *
		 * Returns the connection point using the legacy method.
		 * 
		 * Parameters:
		 * 
		 * vertex - <mxCellState> that represents the vertex.
		 * constraint - <mxConnectionConstraint> that represents the connection point
		 * constraint as returned by <getConnectionConstraint>.
		 */
		Graph.prototype.getLegacyConnectionPoint = function(vertex, constraint, round)
		{
			round = (round != null) ? round : true;
			var point = null;
			
			if (vertex != null && constraint.point != null)
			{
				var bounds = this.view.getPerimeterBounds(vertex);
				var cx = new mxPoint(bounds.getCenterX(), bounds.getCenterY());
				var direction = vertex.style[mxConstants.STYLE_DIRECTION];
				var r1 = 0;
				
				// Bounds need to be rotated by 90 degrees for further computation
				if (direction != null && mxUtils.getValue(vertex.style,
					mxConstants.STYLE_ANCHOR_POINT_DIRECTION, 1) == 1)
				{
					if (direction == mxConstants.DIRECTION_NORTH)
					{
						r1 += 270;
					}
					else if (direction == mxConstants.DIRECTION_WEST)
					{
						r1 += 180;
					}
					else if (direction == mxConstants.DIRECTION_SOUTH)
					{
						r1 += 90;
					}

					// Bounds need to be rotated by 90 degrees for further computation
					if (direction == mxConstants.DIRECTION_NORTH ||
						direction == mxConstants.DIRECTION_SOUTH)
					{
						bounds.rotate90();
					}
				}

				var scale = this.view.scale;
				point = new mxPoint(bounds.x + constraint.point.x * bounds.width + constraint.dx * scale,
						bounds.y + constraint.point.y * bounds.height + constraint.dy * scale);
				
				// Rotation for direction before projection on perimeter
				var r2 = vertex.style[mxConstants.STYLE_ROTATION] || 0;
				
				if (constraint.perimeter)
				{
					if (r1 != 0)
					{
						// Only 90 degrees steps possible here so no trig needed
						var cos = 0;
						var sin = 0;
						
						if (r1 == 90)
						{
							sin = 1;
						}
						else if (r1 == 180)
						{
							cos = -1;
						}
						else if (r1 == 270)
						{
							sin = -1;
						}
						
						point = mxUtils.getRotatedPoint(point, cos, sin, cx);
					}
			
					point = this.view.getPerimeterPoint(vertex, point, false);
				}
				else
				{
					r2 += r1;
					
					if (this.getModel().isVertex(vertex.cell))
					{
						var flipH = vertex.style[mxConstants.STYLE_FLIPH] == 1;
						var flipV = vertex.style[mxConstants.STYLE_FLIPV] == 1;
						
						// Legacy support for stencilFlipH/V
						if (vertex.shape != null && vertex.shape.stencil != null)
						{
							flipH = (mxUtils.getValue(vertex.style, 'stencilFlipH', 0) == 1) || flipH;
							flipV = (mxUtils.getValue(vertex.style, 'stencilFlipV', 0) == 1) || flipV;
						}
						
						if (direction == mxConstants.DIRECTION_NORTH ||
							direction == mxConstants.DIRECTION_SOUTH)
						{
							var temp = flipH;
							flipH = flipV
							flipV = temp;
						}
						
						if (flipH)
						{
							point.x = 2 * bounds.getCenterX() - point.x;
						}
						
						if (flipV)
						{
							point.y = 2 * bounds.getCenterY() - point.y;
						}
					}
				}

				// Generic rotation after projection on perimeter
				if (r2 != 0 && point != null)
				{
					var rad = mxUtils.toRadians(r2);
					var cos = Math.cos(rad);
					var sin = Math.sin(rad);
					
					point = mxUtils.getRotatedPoint(point, cos, sin, cx);
				}
			}
			
			if (round && point != null)
			{
				point.x = Math.round(point.x);
				point.y = Math.round(point.y);
			}

			return point;
		};

		/**
		 * Flips the given cells horizontally or vertically.
		 */
		Graph.prototype.flipCells = function(cells, horizontal)
		{
			this.model.beginUpdate();
			try
			{
				cells = this.model.getTopmostCells(cells);
				var vertices = [];
				
				for (var i = 0; i < cells.length; i++)
				{
					if (this.model.isEdge(cells[i]))
					{
						var state = this.view.getState(cells[i]);

						if (state != null)
						{
							this.flipEdgePoints(cells[i], horizontal, ((horizontal ? state.getCenterX() :
								state.getCenterY()) / this.view.scale) - ((horizontal) ?
								state.origin.x : state.origin.y) - ((horizontal) ?
								this.view.translate.x : this.view.translate.y));
						}
					}
					else
					{
						var geo = this.getCellGeometry(cells[i]);

						if (geo != null)
						{
							this.flipChildren(cells[i], horizontal, horizontal ?
								geo.getCenterX() - geo.x :
								geo.getCenterY() - geo.y);
						}

						vertices.push(cells[i]);
					}
				}

				this.toggleCellStyles(horizontal ? mxConstants.STYLE_FLIPH :
					mxConstants.STYLE_FLIPV, false, vertices);
				
				// Disables legacy anchor points for flipped cells
				this.setCellStyles('legacyAnchorPoints', '0', vertices);
			}
			finally
			{
				this.model.endUpdate();
			}
		};
	
		/**
		 * Deletes the given cells  and returns the cells to be selected.
		 */
		Graph.prototype.deleteCells = function(cells, includeEdges)
		{
			var select = null;

			if (cells != null && cells.length > 0)
			{
				this.model.beginUpdate();
				try
				{
					// Shrinks tables	
					for (var i = 0; i < cells.length; i++)
					{
						var parent = this.model.getParent(cells[i]);
						
						if (this.isTable(parent))
						{
							var row = this.getCellGeometry(cells[i]);
							var table = this.getCellGeometry(parent);
							
							if (row != null && table != null)
							{
								table = table.clone();
								table.height -= row.height;
								this.model.setGeometry(parent, table);
							}
						}
					}
					
					var parents = (this.selectParentAfterDelete) ? this.model.getParents(cells) : null;
					this.removeCells(cells, includeEdges);
				}
				finally
				{
					this.model.endUpdate();
				}
	
				// Selects parents for easier editing of groups
				if (parents != null)
				{
					select = [];
					
					for (var i = 0; i < parents.length; i++)
					{
						if (this.model.contains(parents[i]) &&
							(this.model.isVertex(parents[i]) ||
							this.model.isEdge(parents[i])))
						{
							select.push(parents[i]);
						}
					}
				}
			}
			
			return select;
		};
		
		/**
		 * Inserts a column in the table for the given cell.
		 */
		Graph.prototype.insertTableColumn = function(cell, before)
		{
			var model = this.getModel();
			model.beginUpdate();
			
			try
			{
				var table = cell;
				var index = 0;
				
				if (this.isTableCell(cell))
				{
					var row = model.getParent(cell);
					table = model.getParent(row);
					index = mxUtils.indexOf(model.getChildCells(row, true), cell);
				}
				else
				{
					if (this.isTableRow(cell))
					{
						table = model.getParent(cell);
					}
					else
					{
						cell = model.getChildCells(table, true)[0];
					}
					
					if (!before)
					{
						index = model.getChildCells(cell, true).length - 1;
					}
				}
				
				var rows = model.getChildCells(table, true);
				var dw = Graph.minTableColumnWidth;
				
				for (var i = 0; i < rows.length; i++)
				{
					var child = model.getChildCells(rows[i], true)[index];
					var clone = model.cloneCell(child, false);

					// Handles possible missing child in row
					if (clone == null)
					{
						clone = this.createVertex();
					}

					var geo = this.getCellGeometry(clone);

					// Removes value, col/rowspan and alternate bounds
					clone.value = null;
					clone.style = mxUtils.setStyle(mxUtils.setStyle(
						clone.style, 'rowspan', null), 'colspan', null);

					if (geo != null)
					{
						if (geo.alternateBounds != null)
						{
							geo.width = geo.alternateBounds.width;
							geo.height = geo.alternateBounds.height;
							geo.alternateBounds = null;
						}

						dw = geo.width;
						var rowGeo = this.getCellGeometry(rows[i]);
						
						if (rowGeo != null)
						{
							geo.height = rowGeo.height;
						}
					}

					model.add(rows[i], clone, index + ((before) ? 0 : 1));
				}
				
				var tableGeo = this.getCellGeometry(table);
				
				if (tableGeo != null)
				{
					tableGeo = tableGeo.clone();
					tableGeo.width += dw;
					
					model.setGeometry(table, tableGeo);
				}
			}
			finally
			{
				model.endUpdate();
			}
		};

		/**
		 * Inserts a row in the table for the given cell.
		 */
		Graph.prototype.deleteLane = function(cell)
		{
			var model = this.getModel();
			model.beginUpdate();
			
			try
			{
				var pool = null;
				var lane = cell;
				var style = this.getCurrentCellStyle(lane);

				if (style['childLayout'] == 'stackLayout')
				{
					pool = lane;
				}
				else
				{
					pool = model.getParent(lane);
				}

				var lanes = model.getChildCells(pool, true);

				if (lanes.length == 0)
				{
					model.remove(pool);
				}
				else
				{
					if (pool == lane)
					{
						lane = lanes[lanes.length - 1];
					}

					model.remove(lane);
				}
			}
			finally
			{
				model.endUpdate();
			}
		};

		/**
		 * Inserts a row in the table for the given cell.
		 */
		Graph.prototype.insertLane = function(cell, before)
		{
			var model = this.getModel();
			model.beginUpdate();
			
			try
			{
				var pool = null;
				var lane = cell;
				var style = this.getCurrentCellStyle(lane);

				if (style['childLayout'] == 'stackLayout')
				{
					pool = lane;
					var lanes = model.getChildCells(pool, true);
					lane = lanes[(before) ? 0 : lanes.length - 1];
				}
				else
				{
					pool = model.getParent(lane);
				}

				var index = pool.getIndex(lane);
				lane = model.cloneCell(lane, false);
				lane.value = null;
				model.add(pool, lane, index + ((before) ? 0 : 1));
			}
			finally
			{
				model.endUpdate();
			}
		};
		
		/**
		 * Inserts a row in the table for the given cell.
		 */
		Graph.prototype.insertTableRow = function(cell, before)
		{
			var model = this.getModel();
			model.beginUpdate();
			
			try
			{
				var table = cell;
				var row = cell;
				
				if (this.isTableCell(cell))
				{
					row = model.getParent(cell);
					table = model.getParent(row);
				}
				else if (this.isTableRow(cell))
				{
					table = model.getParent(cell);
				}
				else
				{
					var rows = model.getChildCells(table, true);
					row = rows[(before) ? 0 : rows.length - 1];
				}

				if (row != null)
				{
					var cells = model.getChildCells(row, true);
					var index = table.getIndex(row);
					row = model.cloneCell(row, false);
					row.value = null;

					var rowGeo = this.getCellGeometry(row);

					if (rowGeo != null)
					{
						for (var i = 0; i < cells.length; i++)
						{
							var cell = model.cloneCell(cells[i], false);

							// Removes value, col/rowspan and alternate bounds
							cell.value = null;
							cell.style = mxUtils.setStyle(mxUtils.setStyle(
								cell.style, 'rowspan', null), 'colspan', null);

							var geo = this.getCellGeometry(cell);

							if (geo != null)
							{
								if (geo.alternateBounds != null)
								{
									geo.width = geo.alternateBounds.width;
									geo.height = geo.alternateBounds.height;
									geo.alternateBounds = null;
								}

								geo.height = rowGeo.height;
							}

							row.insert(cell);
						}

						model.add(table, row, index + ((before) ? 0 : 1));

						var tableGeo = this.getCellGeometry(table);

						if (tableGeo != null)
						{
							tableGeo = tableGeo.clone();
							tableGeo.height += rowGeo.height;

							model.setGeometry(table, tableGeo);
						}
					}
				}
				else
				{
					// Empty table: insert initial row with a single column
					var tableGeo = this.getCellGeometry(table);

					if (tableGeo != null)
					{
						var rowHeight = 40;
						var rowWidth = tableGeo.width;

						var rowStyle = 'shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;strokeColor=inherit;' +
							'top=0;left=0;bottom=0;right=0;collapsible=0;dropTarget=0;fillColor=none;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fixedHeader=1;';
						var cellStyle = 'shape=partialRectangle;html=1;whiteSpace=wrap;connectable=0;strokeColor=inherit;' +
							'overflow=hidden;fillColor=none;top=0;left=0;bottom=0;right=0;pointerEvents=1;';

						row = this.createVertex(null, null, '', 0, 0, rowWidth, rowHeight, rowStyle);
						row.insert(this.createVertex(null, null, '', 0, 0, rowWidth, rowHeight, cellStyle));

						model.add(table, row);

						tableGeo = tableGeo.clone();
						tableGeo.height += rowHeight;
						model.setGeometry(table, tableGeo);
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		};

		/**
		 *
		 */
		Graph.prototype.deleteTableColumn = function(cell)
		{
			var model = this.getModel();
			model.beginUpdate();
			
			try
			{
				var table = cell;
				var row = cell;
				
				if (this.isTableCell(cell))
				{
					row = model.getParent(cell);
				}
				
				if (this.isTableRow(row))
				{
					table = model.getParent(row);
				}
				
				var rows = model.getChildCells(table, true);
				
				if (rows.length == 0)
				{
					model.remove(table);
				}
				else
				{
					if (!this.isTableRow(row))
					{
						row = rows[0];
					}
					
					var cells = model.getChildCells(row, true);
					
					if (cells.length <= 1)
					{
						model.remove(table);
					}
					else
					{
						var index = cells.length - 1;
						
						if (this.isTableCell(cell))
						{
							index = mxUtils.indexOf(cells, cell);
						}

						var width = 0;
		
						for (var i = 0; i < rows.length; i++)
						{
							var child = model.getChildCells(rows[i], true)[index];
							model.remove(child);
							
							var geo = this.getCellGeometry(child);
							
							if (geo != null)
							{
								width = Math.max(width, geo.width);
							}
						}
						
						var tableGeo = this.getCellGeometry(table);
						
						if (tableGeo != null)
						{
							tableGeo = tableGeo.clone();
							tableGeo.width -= width;
							
							model.setGeometry(table, tableGeo);
						}
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		};
		
		/**
		 * 
		 */
		Graph.prototype.deleteTableRow = function(cell)
		{
			var model = this.getModel();
			model.beginUpdate();
			
			try
			{
				var table = cell;
				var row = cell;
				
				if (this.isTableCell(cell))
				{
					row = model.getParent(cell);
					cell = row;
				}
				
				if (this.isTableRow(cell))
				{
					table = model.getParent(row);
				}
				
				var rows = model.getChildCells(table, true);
				
				if (rows.length <= 1)
				{
					model.remove(table);
				}
				else
				{
					if (!this.isTableRow(row))
					{
						row = rows[rows.length - 1];
					}	
					
					model.remove(row);
					var height = 0;
					
					var geo = this.getCellGeometry(row);
					
					if (geo != null)
					{
						height = geo.height;
					}
					
					var tableGeo = this.getCellGeometry(table);
					
					if (tableGeo != null)
					{
						tableGeo = tableGeo.clone();
						tableGeo.height -= height;
						
						model.setGeometry(table, tableGeo);
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		};

		/**
		 * Inserts a new row into the given table.
		 */
		Graph.prototype.insertRow = function(table, index)
		{
			var bd = table.tBodies[0];
			var cells = bd.rows[0].cells;
			var cols = 0;
			
			// Counts columns including colspans
			for (var i = 0; i < cells.length; i++)
			{
				var colspan = cells[i].getAttribute('colspan');
				cols += (colspan != null) ? parseInt(colspan) : 1;
			}
			
			var row = bd.insertRow(index);
			
			for (var i = 0; i < cols; i++)
			{
				mxUtils.br(row.insertCell(-1));
			}
			
			return row.cells[0];
		};
		
		/**
		 * Deletes the given column.
		 */
		Graph.prototype.deleteRow = function(table, index)
		{
			table.tBodies[0].deleteRow(index);
		};
		
		/**
		 * Deletes the given column.
		 */
		Graph.prototype.insertColumn = function(table, index)
		{
			var hd = table.tHead;
			
			if (hd != null)
			{
				// TODO: use colIndex
				for (var h = 0; h < hd.rows.length; h++)
				{
					var th = document.createElement('th');
					hd.rows[h].appendChild(th);
					mxUtils.br(th);
				}
			}
		
			var bd = table.tBodies[0];
			
			for (var i = 0; i < bd.rows.length; i++)
			{
				var cell = bd.rows[i].insertCell(index);
				mxUtils.br(cell);
			}
			
			return bd.rows[0].cells[(index >= 0) ? index : bd.rows[0].cells.length - 1];
		};
		
		/**
		 * Deletes the given column.
		 */
		Graph.prototype.deleteColumn = function(table, index)
		{
			if (index >= 0)
			{
				var bd = table.tBodies[0];
				var rows = bd.rows;
				
				for (var i = 0; i < rows.length; i++)
				{
					if (rows[i].cells.length > index)
					{
						rows[i].deleteCell(index);
					}
				}
			}
		};
		
		/**
		 * Inserts the given HTML at the caret position (no undo).
		 */
		Graph.prototype.pasteHtmlAtCaret = function(html)
		{
		    var sel, range;
		
			// IE9 and non-IE
		    if (window.getSelection)
		    {
		        sel = window.getSelection();
		        
		        if (sel.getRangeAt && sel.rangeCount)
		        {
		            range = sel.getRangeAt(0);
		            range.deleteContents();
		
		            // Range.createContextualFragment() would be useful here but is
		            // only relatively recently standardized and is not supported in
		            // some browsers (IE9, for one)
		            var el = document.createElement("div");
		            el.innerHTML = html;
		            var frag = document.createDocumentFragment(), node;
		            
		            while ((node = el.firstChild))
		            {
		                lastNode = frag.appendChild(node);
		            }
		            
		            range.insertNode(frag);
		        }
		    }
		    // IE < 9
		    else if ((sel = document.selection) && sel.type != "Control")
		    {
		    	// FIXME: Does not work if selection is empty
		        sel.createRange().pasteHTML(html);
		    }
		};
	
		/**
		 * Creates an anchor elements for handling the given link in the
		 * hint that is shown when the cell is selected.
		 */
		Graph.prototype.createLinkForHint = function(link, label, associatedCell)
		{
			link = (link != null) ? link : 'javascript:void(0);';

			if (label == null || label.length == 0)
			{
				if (this.isCustomLink(link))
				{
					label = this.getLinkTitle(link);
				}
				else
				{
					label = link;
				}
			}

			// Helper function to shorten strings
			function short(str, max)
			{
				if (str.length > max)
				{
					str = str.substring(0, Math.round(max / 2)) + '...' +
						str.substring(str.length - Math.round(max / 4));
				}
				
				return str;
			};
			
			var a = document.createElement('a');
			a.setAttribute('rel', this.linkRelation);
			a.setAttribute('href', this.getAbsoluteUrl(link));
			a.setAttribute('title', short((this.isCustomLink(link)) ?
				this.getLinkTitle(link) : link, 80));
			
			if (this.linkTarget != null)
			{
				a.setAttribute('target', this.linkTarget);
			}
			
			// Adds shortened label to link
			mxUtils.write(a, short(label, 40));
			
			// Handles custom links
			if (this.isCustomLink(link))
			{
				mxEvent.addListener(a, 'click', mxUtils.bind(this, function(evt)
				{
					this.customLinkClicked(link, associatedCell);
					mxEvent.consume(evt);
				}));
			}
			
			return a;
		};
		
		/**
		 * Customized graph for touch devices.
		 */
		Graph.prototype.initTouch = function()
		{
			// Disables new connections via "hotspot"
			this.connectionHandler.marker.isEnabled = function()
			{
				return this.graph.connectionHandler.first != null;
			};
		
			// Hides menu when editing starts
			this.addListener(mxEvent.START_EDITING, function(sender, evt)
			{
				this.popupMenuHandler.hideMenu();
			});
		
			// Adds custom hit detection if native hit detection found no cell
			var graphUpdateMouseEvent = this.updateMouseEvent;
			this.updateMouseEvent = function(me)
			{
				me = graphUpdateMouseEvent.apply(this, arguments);
	
				if (mxEvent.isTouchEvent(me.getEvent()) && me.getState() == null)
				{
					var cell = this.getCellAt(me.graphX, me.graphY);
		
					if (cell != null && this.isSwimlane(cell) && this.hitsSwimlaneContent(cell, me.graphX, me.graphY))
					{
						cell = null;
					}
					else
					{
						me.state = this.view.getState(cell);
						
						if (me.state != null && me.state.shape != null)
						{
							this.container.style.cursor = me.state.shape.node.style.cursor;
						}
					}
				}
				
				if (me.getState() == null && this.isEnabled())
				{
					this.container.style.cursor = 'default';
				}
				
				return me;
			};
		
			// Context menu trigger implementation depending on current selection state
			// combined with support for normal popup trigger.
			var cellSelected = false;
			var selectionEmpty = false;
			var menuShowing = false;
			
			var oldFireMouseEvent = this.fireMouseEvent;
			
			this.fireMouseEvent = function(evtName, me, sender)
			{
				if (evtName == mxEvent.MOUSE_DOWN)
				{
					// For hit detection on edges
					me = this.updateMouseEvent(me);
					
					cellSelected = this.isCellSelected(me.getCell());
					selectionEmpty = this.isSelectionEmpty();
					menuShowing = this.popupMenuHandler.isMenuShowing();
				}
				
				oldFireMouseEvent.apply(this, arguments);
			};

			// Shows popup menu if cell was selected or selection was empty and background was clicked
			// FIXME: Conflicts with mxPopupMenuHandler.prototype.getCellForPopupEvent in Editor.js by
			// selecting parent for selected children in groups before this check can be made.
			this.popupMenuHandler.mouseUp = mxUtils.bind(this, function(sender, me)
			{
				if (this.freehand != null && (!this.freehand.isDrawing()))
				{
					var isMouseEvent = mxEvent.isMouseEvent(me.getEvent());
					this.popupMenuHandler.popupTrigger = !this.isEditing() && this.isEnabled() &&
						(me.getState() == null || !me.isSource(me.getState().control)) &&
						(this.popupMenuHandler.popupTrigger || (!menuShowing && !isMouseEvent &&
						((selectionEmpty && me.getCell() == null && this.isSelectionEmpty()) ||
						(cellSelected && this.isCellSelected(me.getCell())))));

					// Delays popup menu to allow for double tap to start editing
					var popup = (!cellSelected || isMouseEvent) ? null : mxUtils.bind(this, function(cell)
					{
						window.setTimeout(mxUtils.bind(this, function()
						{
							if (!this.isEditing() && this.isTouchPopupMenuEnabled())
							{
								var origin = mxUtils.getScrollOrigin();
								this.popupMenuHandler.popup(me.getX() + origin.x + 1,
									me.getY() + origin.y + 1, cell, me.getEvent());
							}
						}), 300);
					});

					mxPopupMenuHandler.prototype.mouseUp.apply(this.popupMenuHandler, [sender, me, popup]);
				}
			});
		};
		
		/**
		 * Hook for blocking delayed popup menu on touch devices.
		 */
		Graph.prototype.isTouchPopupMenuEnabled = function()
		{
			return true;
		};
		
		/**
		 * HTML in-place editor
		 */
		mxCellEditor.prototype.isContentEditing = function()
		{
			var state = this.graph.view.getState(this.editingCell);
			
			return state != null && state.style['html'] == 1;
		};

		/**
		 * Returns true if all selected text is inside a table element.
		 */
		mxCellEditor.prototype.isTableSelected = function()
		{
			return this.graph.getParentByName(
				this.graph.getSelectedElement(),
				'TABLE', this.textarea) != null;
		};
		
		/**
		 * Returns true if text is selected.
		 */
		mxCellEditor.prototype.isTextSelected = function()
		{
		    var txt = '';

		    if (window.getSelection)
			{
		        txt = window.getSelection();
		    } 
			else if (document.getSelection)
			{
		        txt = document.getSelection();
		    }
			else if (document.selection)
			{
		        txt = document.selection.createRange().text;
		    }

			return txt != '';
		};

		/**
		 * Inserts a tab at the cursor position.
		 */
		mxCellEditor.prototype.insertTab = function(spaces)
		{
			var editor = this.textarea;
	        var doc = editor.ownerDocument.defaultView;
	        var sel = doc.getSelection();
	        var range = sel.getRangeAt(0);
			var tabNode = Graph.createTabNode(spaces);
			range.insertNode(tabNode);
	        range.setStartAfter(tabNode);
	        range.setEndAfter(tabNode); 
	        sel.removeAllRanges();
	        sel.addRange(range);
		};
		
		/**
		 * Sets the alignment of the current selected cell. This sets the
		 * alignment in the cell style, removes all alignment within the
		 * text and invokes the built-in alignment function.
		 * 
		 * Only the built-in function is invoked if shift is pressed or
		 * if table cells are selected and shift is not pressed.
		 */
		mxCellEditor.prototype.alignText = function(align, evt)
		{
			var state = this.graph.getView().getState(this.editingCell);

			if (state != null)
			{
				var dir = mxUtils.getValue(state.style, mxConstants.STYLE_TEXT_DIRECTION,
					mxConstants.DEFAULT_TEXT_DIRECTION);
				var vertical = dir != null && dir.substring(0, 9) == 'vertical-';
				var shiftPressed = evt != null && mxEvent.isShiftDown(evt);
				
				if (shiftPressed || (window.getSelection != null &&
					window.getSelection().containsNode != null))
				{
					var allSelected = true;
					
					this.graph.processElements(this.textarea, function(node)
					{
						if (shiftPressed || vertical ||
							window.getSelection().containsNode(node, true))
						{
							node.removeAttribute('align');
							node.style.textAlign = null;
						}
						else
						{
							allSelected = false;
						}
					});
					
					if (allSelected || vertical)
					{
						this.graph.cellEditor.setAlign(align);
					}
				}
				
				if (!vertical)
				{
					document.execCommand('justify' + align.toLowerCase(), false, null);
				}
			}
		};
		
		/**
		 * Creates the keyboard event handler for the current graph and history.
		 */
		mxCellEditor.prototype.saveSelection = function()
		{
		    if (window.getSelection)
		    {
		        var sel = window.getSelection();
		        
		        if (sel.getRangeAt && sel.rangeCount)
		        {
		            var ranges = [];
		            
		            for (var i = 0, len = sel.rangeCount; i < len; ++i)
		            {
		                ranges.push(sel.getRangeAt(i));
		            }
		            
		            return ranges;
		        }
		    }
		    else if (document.selection && document.selection.createRange)
		    {
		        return document.selection.createRange();
		    }
		    
		    return null;
		};
	
		/**
		 * Creates the keyboard event handler for the current graph and history.
		 */
		mxCellEditor.prototype.restoreSelection = function(savedSel)
		{
			try
			{
				if (savedSel)
				{
					if (window.getSelection)
					{
						sel = window.getSelection();
						sel.removeAllRanges();
		
						for (var i = 0, len = savedSel.length; i < len; ++i)
						{
							sel.addRange(savedSel[i]);
						}
					}
					else if (document.selection && savedSel.select)
					{
						savedSel.select();
					}
				}
			}
			catch (e)
			{
				// ignore
			}
		};

		/**
		 * Handling of special nl2Br style for not converting newlines to breaks in HTML labels.
		 * NOTE: Since it's easier to set this when the label is created we assume that it does
		 * not change during the lifetime of the mxText instance.
		 */
		var mxCellRendererInitializeLabel = mxCellRenderer.prototype.initializeLabel;
		mxCellRenderer.prototype.initializeLabel = function(state)
		{
			if (state.text != null)
			{
				state.text.replaceLinefeeds = mxUtils.getValue(state.style, 'nl2Br', '1') != '0';
			}
			
			mxCellRendererInitializeLabel.apply(this, arguments);
		};
	
		var mxConstraintHandlerUpdate = mxConstraintHandler.prototype.update;
		mxConstraintHandler.prototype.update = function(me, source)
		{
			if (this.isKeepFocusEvent(me) || !mxEvent.isAltDown(me.getEvent()))
			{
				mxConstraintHandlerUpdate.apply(this, arguments);
			}
			else
			{
				this.reset();
			}
		};
	
		/**
		 * No dashed shapes.
		 */
		mxGuide.prototype.createGuideShape = function(horizontal)
		{
			var guide = new mxPolyline([], mxConstants.GUIDE_COLOR, mxConstants.GUIDE_STROKEWIDTH);
			
			return guide;
		};
		
		/**
		 * HTML in-place editor
		 */
		mxCellEditor.prototype.escapeCancelsEditing = false;

		/**
		 * Overridden to set CSS classes.
		 */
		var mxCellEditorStartEditing = mxCellEditor.prototype.startEditing;
		mxCellEditor.prototype.startEditing = function(cell, trigger)
		{
			cell = this.graph.getStartEditingCell(cell, trigger);

			mxCellEditorStartEditing.apply(this, arguments);

			// Overrides class in case of HTML content to add
			// dashed borders for divs and table cells
			var state = this.graph.view.getState(cell);

			if (state != null && state.style['html'] == 1)
			{
				this.textarea.className = 'mxCellEditor geContentEditable';
			}
			else
			{
				this.textarea.className = 'mxCellEditor mxPlainTextEditor';
			}

			// Prevents browser translation from modifying editor content
			if (Graph.browserTranslate)
			{
				this.textarea.classList.add('notranslate');
				this.textarea.setAttribute('translate', 'no');
			}

			// Sets colorScheme for current adaptiveColors
			this.textarea.style.colorScheme =
				(this.graph.getAdaptiveColors() == 'none') ?
					'light' : '';
			
			// Toggles markup vs wysiwyg mode
			this.codeViewMode = false;
			
			// Stores current selection range when switching between markup and code
			this.switchSelectionState = null;
			
			// Selects editing cell
			this.graph.setSelectionCell(cell);

			// Re-compute font size after initialText may have been set
			// (e.g. typing shim sets innerHTML which doesn't fire input events)
			if (this.editingCell != null && this.textarea != null &&
				this.textarea.parentNode != null && state != null &&
				this.graph.isAutosizeTextState(state))
			{
				this.resize();
			}
		}
		
		mxCellEditor.prototype.toggleViewMode = function()
		{
			var state = this.graph.view.getState(this.editingCell);
			
			if (state != null)
			{
				var nl2Br = state != null && mxUtils.getValue(state.style, 'nl2Br', '1') != '0';
				var tmp = this.saveSelection();
				
				if (!this.codeViewMode)
				{
					// Clears the initial empty label on the first keystroke
					if (this.clearOnChange && this.textarea.innerHTML == this.getEmptyLabelText())
					{
						this.clearOnChange = false;
						this.textarea.innerText = '';
					}
					
					// Removes newlines from HTML and converts breaks to newlines
					// to match the HTML output in plain text
					Graph.removeLightDarkColors(this.textarea, Graph.backupStyleAttribute);
					var content = mxUtils.htmlEntities(this.textarea.innerHTML);
		
				    // Workaround for trailing line breaks being ignored in the editor
					if (document.documentMode != 8)
					{
						content = mxUtils.replaceTrailingNewlines(content, '<div><br></div>');
					}
					
				    content = Graph.sanitizeHtml((nl2Br) ? content.replace(/\n/g, '').
						replace(/&lt;br\s*.?&gt;/g, '<br>') : content, true);
					this.textarea.className = 'mxCellEditor mxPlainTextEditor';
					
					var size = mxConstants.DEFAULT_FONTSIZE;
					
					this.textarea.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ?
						Math.round(size * mxConstants.LINE_HEIGHT) + 'px' : mxConstants.LINE_HEIGHT;
					this.textarea.style.fontSize = Math.round(size) + 'px';
					this.textarea.style.textDecoration = '';
					this.textarea.style.fontWeight = 'normal';
					this.textarea.style.fontStyle = '';
					this.textarea.style.fontFamily = mxConstants.DEFAULT_FONTFAMILY;
					this.textarea.style.textAlign = 'left';
					this.textarea.style.width = '';
					
					// Adds padding to make cursor visible with borders
					this.textarea.style.padding = '2px';
					
					if (this.textarea.innerHTML != content)
					{
						this.textarea.innerHTML = content;
					}
		
					this.codeViewMode = true;
				}
				else
				{
					Graph.removeLightDarkColors(this.textarea, Graph.backupStyleAttribute);
					var content = mxUtils.extractTextWithWhitespace(this.textarea.childNodes);
				    
					// Strips trailing line break
				    if (content.length > 0 && content.charAt(content.length - 1) == '\n')
				    {
				    	content = content.substring(0, content.length - 1);
				    }
				    
					content = Graph.sanitizeHtml((nl2Br) ? content.replace(/\n/g, '<br/>') : content, true)
					this.textarea.className = 'mxCellEditor geContentEditable';
					
					var size = mxUtils.getValue(state.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE);
					var family = mxUtils.getValue(state.style, mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILY);
					var align = mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
					var bold = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
							mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD;
					var italic = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
							mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC;
					var txtDecor = [];
					
					if ((mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
							mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
					{
						txtDecor.push('underline');
					}
					
					if ((mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
							mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
					{
						txtDecor.push('line-through');
					}
					
					this.textarea.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? Math.round(size * mxConstants.LINE_HEIGHT) + 'px' : mxConstants.LINE_HEIGHT;
					this.textarea.style.fontSize = Math.round(size) + 'px';
					this.textarea.style.textDecoration = txtDecor.join(' ');
					this.textarea.style.fontWeight = (bold) ? 'bold' : 'normal';
					this.textarea.style.fontStyle = (italic) ? 'italic' : '';
					this.textarea.style.fontFamily = family;
					this.textarea.style.textAlign = align;
					this.textarea.style.padding = '0px';
					
					if (this.textarea.innerHTML != content)
					{
						this.textarea.innerHTML = content;
						
						if (this.textarea.innerHTML.length == 0)
						{
							this.textarea.innerHTML = this.getEmptyLabelText();
							this.clearOnChange = this.textarea.innerHTML.length > 0;
						}
					}
		
					Graph.addLightDarkColors(this.textarea, Graph.backupStyleAttribute,
						this.graph.getAdaptiveColors() == 'simple')
					this.codeViewMode = false;
				}
				
				this.textarea.focus();
			
				if (this.switchSelectionState != null)
				{
					this.restoreSelection(this.switchSelectionState);
				}
				
				this.switchSelectionState = tmp;
				this.resize();
			}
		};
		
		var mxCellEditorResize = mxCellEditor.prototype.resize;
		mxCellEditor.prototype.resize = function(state, trigger)
		{
			if (this.textarea != null)
			{
				var state = this.graph.getView().getState(this.editingCell);
				
				if (this.codeViewMode && state != null)
				{
					var scale = state.view.scale;
					this.bounds = mxRectangle.fromRectangle(state);
					
					// General placement of code editor if cell has no size
					// LATER: Fix HTML editor bounds for edge labels
					if (this.bounds.width == 0 && this.bounds.height == 0)
					{
						this.bounds.width = 160 * scale;
						this.bounds.height = 60 * scale;
						
						var m = (state.text != null) ? state.text.margin : null;
						
						if (m == null)
						{
							m = mxUtils.getAlignmentAsPoint(mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER),
									mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE));
						}
						
						this.bounds.x += m.x * this.bounds.width;
						this.bounds.y += m.y * this.bounds.height;
					}
		
					this.textarea.style.width = Math.round((this.bounds.width - 4) / scale) + 'px';
					this.textarea.style.height = Math.round((this.bounds.height - 4) / scale) + 'px';
					this.textarea.style.overflow = 'auto';
		
					// Adds scrollbar offset if visible
					if (this.textarea.clientHeight < this.textarea.offsetHeight)
					{
						this.textarea.style.height = Math.round((this.bounds.height / scale)) + (this.textarea.offsetHeight - this.textarea.clientHeight) + 'px';
						this.bounds.height = parseInt(this.textarea.style.height) * scale;
					}
					
					if (this.textarea.clientWidth < this.textarea.offsetWidth)
					{
						this.textarea.style.width = Math.round((this.bounds.width / scale)) + (this.textarea.offsetWidth - this.textarea.clientWidth) + 'px';
						this.bounds.width = parseInt(this.textarea.style.width) * scale;
					}
									
					this.textarea.style.left = Math.round(this.bounds.x) + 'px';
					this.textarea.style.top = Math.round(this.bounds.y) + 'px';
		
					mxUtils.setPrefixedStyle(this.textarea.style, 'transform', 'scale(' + scale + ',' + scale + ')');	
				}
				else if (state != null && this.graph.isAutosizeTextState(state))
				{
					// autosizeText: position textarea at cell origin with
					// flex layout for vertical alignment and padding for
					// spacing to match the rendered text layout exactly
					var scale = state.view.scale;
					var sty = state.style;
					var geo = this.graph.getCellGeometry(this.editingCell);

					if (geo != null)
					{
						this.bounds = mxRectangle.fromRectangle(state);

						// Position textarea at cell origin
						this.textarea.style.left = Math.round(state.x) + 'px';
						this.textarea.style.top = Math.round(state.y) + 'px';

						// Transform: scale and rotation only, no alignment
						// translate (vertical alignment handled via flex)
						var deg = (this.rotateText && this.textShape != null) ?
							this.textShape.getTextRotation() : 0;
						mxUtils.setPrefixedStyle(this.textarea.style, 'transformOrigin', '0px 0px');
						mxUtils.setPrefixedStyle(this.textarea.style, 'transform',
							((deg != 0) ? 'rotate(' + deg + 'deg) ' : '') +
							'scale(' + scale + ',' + scale + ')');

						// Remove transparent border set by updateTextAreaStyle so
						// content area matches the measurement width exactly
						this.textarea.style.borderWidth = '0';

						// Add foreignObjectPadding to width to match the rendered
						// flex container width in mxSvgCanvas2D.createCss
						var fop = mxSvgCanvas2D.prototype.foreignObjectPadding;
						this.textarea.style.width = Math.round(geo.width + fop) + 'px';
						this.textarea.style.height = Math.round(geo.height) + 'px';
						this.textarea.style.overflow = 'hidden';
						this.textarea.style.boxSizing = 'border-box';

						if (sty[mxConstants.STYLE_WHITE_SPACE] == 'wrap')
						{
							this.textarea.style.wordWrap = mxConstants.WORD_WRAP;
							this.textarea.style.whiteSpace = 'normal';
						}

						// Compute spacing matching mxText defaults: STYLE_SPACING
						// defaults to 2, directional spacings default to 0 (not 2)
						var spacing = parseInt(mxUtils.getValue(sty, mxConstants.STYLE_SPACING, 2));
						var spTop = spacing + parseInt(mxUtils.getValue(sty, mxConstants.STYLE_SPACING_TOP, 0));
						var spBottom = spacing + parseInt(mxUtils.getValue(sty, mxConstants.STYLE_SPACING_BOTTOM, 0));
						var spLeft = spacing + parseInt(mxUtils.getValue(sty, mxConstants.STYLE_SPACING_LEFT, 0));
						var spRight = spacing + parseInt(mxUtils.getValue(sty, mxConstants.STYLE_SPACING_RIGHT, 0));

						this.textarea.style.paddingLeft = Math.round(spLeft) + 'px';
						this.textarea.style.paddingRight = Math.round(spRight) + 'px';
						this.textarea.style.paddingTop = Math.round(spTop) + 'px';
						this.textarea.style.paddingBottom = Math.round(spBottom) + 'px';

						// Use table-cell layout for vertical alignment.
						// flex layout causes different word wrapping than the
						// rendered text (which uses inline-block inside a flex
						// container), so table-cell + vertical-align is used
						// instead to match the rendered text wrapping exactly.
						this.textarea.style.display = 'table-cell';
						this.textarea.style.flexDirection = '';
						this.textarea.style.justifyContent = '';

						var valign = mxUtils.getValue(sty, mxConstants.STYLE_VERTICAL_ALIGN,
							mxConstants.ALIGN_MIDDLE);

						if (valign == mxConstants.ALIGN_MIDDLE)
						{
							this.textarea.style.verticalAlign = 'middle';
						}
						else if (valign == mxConstants.ALIGN_BOTTOM)
						{
							this.textarea.style.verticalAlign = 'bottom';
						}
						else
						{
							this.textarea.style.verticalAlign = 'top';
						}

						// Recompute font size for current text content
						// (innerText works on subsequent resizes after DOM append;
						// on initial resize the stored style font-size from
						// updateTextAreaStyle is used)
						var text = this.textarea.innerText;

						if (text != null && text.length > 0)
						{
							var space = this.graph.getAutosizeTextAvailableSpace(
								sty, geo.width, geo.height, state);

							if (space != null)
							{
								var value = mxUtils.htmlEntities(text, false).replace(/\n/g, '<br>');
								var fontFamily = sty[mxConstants.STYLE_FONTFAMILY] ||
									mxConstants.DEFAULT_FONTFAMILY;
								var fontStyle = sty[mxConstants.STYLE_FONTSTYLE];
								var wrap = sty[mxConstants.STYLE_WHITE_SPACE] == 'wrap';

								var fontSize = this.graph.computeAutosizeTextFontSize(value,
									space.availW, space.availH, fontFamily, fontStyle, wrap);

								this.textarea.style.fontSize = fontSize + 'px';

								// Use unrounded lineHeight to match mxText rendering
								this.textarea.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ?
									(fontSize * mxConstants.LINE_HEIGHT) + 'px' :
									mxConstants.LINE_HEIGHT;
							}
						}
					}
				}
				else
				{
					this.textarea.style.width = '';
					this.textarea.style.height = '';
					this.textarea.style.overflow = '';
					this.textarea.style.boxSizing = '';
					this.textarea.style.borderWidth = '';
					this.textarea.style.paddingTop = '';
					this.textarea.style.paddingBottom = '';
					this.textarea.style.paddingLeft = '';
					this.textarea.style.paddingRight = '';
					this.textarea.style.display = '';
					this.textarea.style.flexDirection = '';
					this.textarea.style.justifyContent = '';
					this.textarea.style.verticalAlign = '';
					mxCellEditorResize.apply(this, arguments);
				}
			}
		};

		mxCellEditorGetInitialValue = mxCellEditor.prototype.getInitialValue;
		mxCellEditor.prototype.getInitialValue = function(state, trigger)
		{
			if (mxUtils.getValue(state.style, 'html', '0') == '0')
			{
				return mxCellEditorGetInitialValue.apply(this, arguments);
			}
			else
			{
				var result = this.graph.getEditingValue(state.cell, trigger)
			
				if (mxUtils.getValue(state.style, 'nl2Br', '1') == '1')
				{
					result = result.replace(/\n/g, '<br/>');
				}
				
				return Graph.sanitizeHtml(result, true);
			}
		};

		mxCellEditorSetEditingValue = mxCellEditor.prototype.setEditingValue;
		mxCellEditor.prototype.setEditingValue = function(state, value)
		{
			mxCellEditorSetEditingValue.apply(this, arguments);

			if (mxUtils.getValue(state.style, 'html', '0') == '1')
			{
				Graph.addLightDarkColors(this.textarea, Graph.backupStyleAttribute,
					this.graph.getAdaptiveColors() == 'simple')
			}
		};
		
		mxCellEditorGetCurrentValue = mxCellEditor.prototype.getCurrentValue;
		mxCellEditor.prototype.getCurrentValue = function(state)
		{
			if (mxUtils.getValue(state.style, 'html', '0') == '0')
			{
				return mxCellEditorGetCurrentValue.apply(this, arguments);
			}
			else
			{
				Graph.removeLightDarkColors(this.textarea, Graph.backupStyleAttribute);
				var result = Graph.sanitizeHtml(this.textarea.innerHTML, true);

				if (Editor.optimizeHtmlLabels)
				{
					result = Graph.optimizeHtml(result);
				}

				if (mxUtils.getValue(state.style, 'nl2Br', '1') == '1')
				{
					result = result.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');

					// Workaround for trailing line breaks being ignored in the output
					if (result.length > 0 && (result.substring(result.length - 5) == '<br/>' ||
						result.substring(result.length - 4) == '<br>'))
					{
						result = result.substring(0, result.lastIndexOf('<br')) + '<div><br/></div>';
					}
				}
				else
				{
					result = result.replace(/\r\n/g, '').replace(/\n/g, '');
				}
				
				return result;
			}
		};
	
		var mxCellEditorStopEditing = mxCellEditor.prototype.stopEditing;
		mxCellEditor.prototype.stopEditing = function(cancel)
		{
			// Restores default view mode before applying value
			if (this.codeViewMode)
			{
				this.toggleViewMode();
			}
			
			mxCellEditorStopEditing.apply(this, arguments);
			
			// Tries to move focus back to container after editing if possible
			this.focusContainer();
		};
		
		mxCellEditor.prototype.focusContainer = function()
		{
			try
			{
				this.graph.container.focus();
			}
			catch (e)
			{
				// ignore
			}
		};
	
		var mxCellEditorApplyValue = mxCellEditor.prototype.applyValue;
		mxCellEditor.prototype.applyValue = function(state, value)
		{
			// Removes empty relative child labels in edges
			this.graph.getModel().beginUpdate();
			
			try
			{
				mxCellEditorApplyValue.apply(this, arguments);
				
				if (value == '' && this.graph.isCellDeletable(state.cell) &&
					this.graph.model.getChildCount(state.cell) == 0 &&
					this.graph.isTransparentState(state))
				{
					this.graph.removeCells([state.cell], false);
				}
			}
			finally
			{
				this.graph.getModel().endUpdate();
			}
		};
		
		/**
		 * Returns the background color to be used for the editing box. This returns
		 * the label background for edge labels and null for all other cases.
		 */
		mxCellEditor.prototype.getBackgroundColor = function(state)
		{
			var color = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, null);

			if (color == mxConstants.NONE)
			{
				color = null;
			}
			
			return color;
		};
				
		/**
		 * Returns the border color to be used for the editing box. This returns
		 * the label border for edge labels and null for all other cases.
		 */
		mxCellEditor.prototype.getBorderColor = function(state)
		{
			var color = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_BORDERCOLOR, null);

			if (color == mxConstants.NONE)
			{
				color = null;
			}
			
			return color;
		};
		
		/**
		 * Returns the minimum editing size.
		 */
		mxCellEditor.prototype.getMinimumSize = function(state)
		{
			var scale = this.graph.getView().scale;
			
			return new mxRectangle(0, 0, (state.text == null) ? 30 :  state.text.size * scale + 20, 30);
		};
		
		/**
		 * Hold Alt to ignore drop target.
		 */
		mxGraphHandlerIsValidDropTarget = mxGraphHandler.prototype.isValidDropTarget;
		mxGraphHandler.prototype.isValidDropTarget = function(target, me)
		{
			return mxGraphHandlerIsValidDropTarget.apply(this, arguments) &&
				!mxEvent.isAltDown(me.getEvent);
		};

		/**
		 * Redirects the initial cell for click-and-drag to the locked group
		 * ancestor so descendants of a locked group cannot be dragged out.
		 */
		var mxGraphHandlerGetInitialCellForEvent = mxGraphHandler.prototype.getInitialCellForEvent;
		mxGraphHandler.prototype.getInitialCellForEvent = function(me)
		{
			var cell = mxGraphHandlerGetInitialCellForEvent.apply(this, arguments);

			if (cell != null)
			{
				var anc = this.graph.getLockedGroupAncestor(
					this.graph.model.getParent(cell));

				if (anc != null)
				{
					cell = anc;
				}
			}

			return cell;
		};

		/**
		 * Selection propagation rules for groups and swimlanes:
		 *   - selectParentFirst=1 on the parent: walk up unless the parent is
		 *     already selected, then stop on the child. Produces a parent ↔
		 *     child click cycle starting at parent. Works on any vertex parent
		 *     (groups, swimlanes, transparentBounds).
		 *   - transparentBounds=1 (without selectParentFirst): stop at the
		 *     group boundary so children are selectable directly, like
		 *     children of a swimlane.
		 *   - Otherwise: fall through to base propagation (groups propagate
		 *     up to parent first; swimlanes stop on the clicked child).
		 */
		var mxGraphHandlerIsPropagateSelectionCell = mxGraphHandler.prototype.isPropagateSelectionCell;
		mxGraphHandler.prototype.isPropagateSelectionCell = function(cell, immediate, me)
		{
			var parent = this.graph.model.getParent(cell);

			if (parent != null)
			{
				if (this.graph.isSelectParentFirst(parent))
				{
					// Walk up to the parent unless it (or a sibling of the
					// clicked child) is already selected — keeping a sibling
					// selection live in the same group means the user wants
					// to switch between children rather than escalate.
					return !this.graph.isCellSelected(parent) &&
						!this.graph.isSiblingSelected(cell);
				}

				if (this.graph.isTransparentBounds(parent))
				{
					return false;
				}
			}

			return mxGraphHandlerIsPropagateSelectionCell.apply(this, arguments);
		};

		/**
		 * Shows the connection points of a container instead of an overlapping
		 * child if the event is on the container's border band. A cell that
		 * already has the focus keeps it, so that its own connection points
		 * on a shared border stay reachable when approached from inside.
		 */
		var mxConstraintHandlerGetCellForEvent = mxConstraintHandler.prototype.getCellForEvent;
		mxConstraintHandler.prototype.getCellForEvent = function(me, point)
		{
			var cell = mxConstraintHandlerGetCellForEvent.apply(this, arguments);

			if (cell != null && (this.currentFocus == null ||
				this.currentFocus.cell != cell))
			{
				var container = this.graph.getBorderContainer(cell,
					(point != null) ? point.x : me.getGraphX(),
					(point != null) ? point.y : me.getGraphY());

				if (container != null)
				{
					cell = container;
				}
			}

			return cell;
		};

		/**
		 * Includes transparentBounds ancestors of selected cells in the handler
		 * list so that the group's own vertex handler is created (drawing the
		 * dashed bounds and the move handle) even when only descendants are
		 * formally selected. These ancestor cells do not enter the selection,
		 * so delete/copy/format-panel still operate on the user's actual choice.
		 */
		var mxSelectionCellsHandlerGetHandledSelectionCells = mxSelectionCellsHandler.prototype.getHandledSelectionCells;
		mxSelectionCellsHandler.prototype.getHandledSelectionCells = function()
		{
			var cells = mxSelectionCellsHandlerGetHandledSelectionCells.apply(this, arguments);
			var graph = this.graph;
			var dict = new mxDictionary();
			var result = [];

			for (var i = 0; i < cells.length; i++)
			{
				if (dict.get(cells[i]) == null)
				{
					dict.put(cells[i], true);
					result.push(cells[i]);
				}
			}

			for (var i = 0; i < cells.length; i++)
			{
				var parent = graph.model.getParent(cells[i]);

				while (parent != null && graph.isTransparentBounds(parent))
				{
					if (dict.get(parent) == null)
					{
						dict.put(parent, true);
						result.push(parent);
					}

					parent = graph.model.getParent(parent);
				}
			}

			return result;
		};

		/**
		 * Hints on handlers
		 */
		function createHint()
		{
			var hint = document.createElement('div');
			hint.className = 'geHint';
			hint.style.whiteSpace = 'nowrap';
			hint.style.position = 'absolute';
			
			return hint;
		};
		
		/**
		 * Format pixels in the given unit
		 */
		function formatHintText(pixels, unit) 
		{
		    switch(unit) 
		    {
		        case mxConstants.POINTS:
		            return pixels;
		        case mxConstants.MILLIMETERS:
		            // Up to 3 decimals without trailing zeros
		            return Math.round(pixels * 1000 / mxConstants.PIXELS_PER_MM) / 1000;
				case mxConstants.METERS:
            		return (pixels / (mxConstants.PIXELS_PER_MM * 1000)).toFixed(4);
		        case mxConstants.INCHES:
		            return (pixels / mxConstants.PIXELS_PER_INCH).toFixed(3);
		    }
		};
		
		/**
		 * Format pixels in the given unit
		 */
		mxGraphView.prototype.formatUnitText = function(pixels) 
		{
			return pixels? formatHintText(pixels, this.unit) : pixels;
		};
		
		/**
		 * Updates the hint for the current operation.
		 */
		mxGraphHandler.prototype.updateHint = function(me)
		{
			if (this.pBounds != null && (this.shape != null || this.livePreviewActive))
			{
				if (this.hint == null)
				{
					this.hint = createHint();
					this.graph.container.appendChild(this.hint);
				}
	
				var t = this.graph.view.translate;
				var s = this.graph.view.scale;
				var x = this.roundLength((this.bounds.x + this.currentDx) / s - t.x);
				var y = this.roundLength((this.bounds.y + this.currentDy) / s - t.y);
				var unit = this.graph.view.unit;
				
				this.hint.innerHTML = formatHintText(x, unit) + ', ' + formatHintText(y, unit);
				
				this.hint.style.left = (this.pBounds.x + this.currentDx +
					Math.round((this.pBounds.width - this.hint.clientWidth) / 2)) + 'px';
				this.hint.style.top = (this.pBounds.y + this.currentDy +
					this.pBounds.height + Editor.hintOffset) + 'px';
			}
		};
	
		/**
		 * Updates the hint for the current operation.
		 */
		mxGraphHandler.prototype.removeHint = function()
		{
			if (this.hint != null)
			{
				if (this.hint.parentNode != null)
				{
					this.hint.parentNode.removeChild(this.hint);
				}

				this.hint = null;
			}
		};
		
		/**
		 * Overridden to allow for shrinking pools when lanes are resized.
		 */
		var stackLayoutResizeCell = mxStackLayout.prototype.resizeCell;
		mxStackLayout.prototype.resizeCell = function(cell, bounds)
		{
			stackLayoutResizeCell.apply(this, arguments);
			var style = this.graph.getCellStyle(cell);
				
			if (style['childLayout'] == null)
			{
				var parent = this.graph.model.getParent(cell);
				var geo = (parent != null) ? this.graph.getCellGeometry(parent) : null;
			
				if (geo != null)
				{
					style = this.graph.getCellStyle(parent);
					
					if (style['childLayout'] == 'stackLayout')
					{
						var border = parseFloat(mxUtils.getValue(style, 'stackBorder', mxStackLayout.prototype.border));
						var horizontal = mxUtils.getValue(style, 'horizontalStack', '1') == '1';
						var start = this.graph.getActualStartSize(parent);
						geo = geo.clone();
						
						if (horizontal)
						{
							geo.height = bounds.height + start.y + start.height + 2 * border;
						}
						else
						{
							geo.width = bounds.width + start.x + start.width + 2 * border;
						}
						
						this.graph.model.setGeometry(parent, geo);			
					}
				}
			}
		};

		/**
		 * Shows handle for table instead of rows and cells.
		 */
		var selectionCellsHandlerGetHandledSelectionCells = mxSelectionCellsHandler.prototype.getHandledSelectionCells;
		mxSelectionCellsHandler.prototype.getHandledSelectionCells = function()
		{
			var cells = selectionCellsHandlerGetHandledSelectionCells.apply(this, arguments);
			var dict = new mxDictionary();
			var model = this.graph.model;
			var result = [];
			
			function addCell(cell)
			{
				if (!dict.get(cell))
				{
					dict.put(cell, true);
					result.push(cell);
				}
			};
			
			for (var i = 0; i < cells.length; i++)
			{
				var cell = cells[i];
				
				if (this.graph.isTableCell(cell))
				{
					addCell(model.getParent(model.getParent(cell)));
				}
				else if (this.graph.isTableRow(cell))
				{
					addCell(model.getParent(cell));
				}
				
				addCell(cell);
			}
			
			return result;
		};

		/**
		 * Disables starting new connections if control is pressed.
		 */
		var connectionHandlerIsStartEvent = mxConnectionHandler.prototype.isStartEvent;
		mxConnectionHandler.prototype.isStartEvent = function(me)
		{
			return connectionHandlerIsStartEvent.apply(this, arguments) &&
				!mxEvent.isControlDown(me.getEvent()) &&
				!mxEvent.isShiftDown(me.getEvent());
		};
		
		/**
		 * Forces preview for title size in tables, table rows, table cells and swimlanes.
		 */
		var vertexHandlerIsGhostPreview = mxVertexHandler.prototype.isGhostPreview;
		mxVertexHandler.prototype.isGhostPreview = function()
		{
			return vertexHandlerIsGhostPreview.apply(this, arguments) && !this.graph.isTable(this.state.cell) &&
				!this.graph.isTableRow(this.state.cell) && !this.graph.isTableCell(this.state.cell) &&
				!this.graph.isSwimlane(this.state.cell);
		};

		/**
		 * Creates the shape used to draw the selection border.
		 */
		var vertexHandlerCreateParentHighlightShape = mxVertexHandler.prototype.createParentHighlightShape;
		mxVertexHandler.prototype.createParentHighlightShape = function(bounds)
		{
			var shape = vertexHandlerCreateParentHighlightShape.apply(this, arguments);

			shape.stroke = '#C0C0C0';
			shape.strokewidth = 1;

			// Dashed outline for transparentBounds ancestors so the group bounds
			// are visually distinguishable from the standard parent highlight.
			var parent = this.graph.model.getParent(this.state.cell);

			if (parent != null && this.graph.isTransparentBounds(parent))
			{
				shape.isDashed = true;
			}

			return shape;
		};

		/**
		 * The transparentBounds's own selection border is drawn dashed so the
		 * derived-bounds outline keeps the same visual language whether the
		 * group or a descendant is selected.
		 */
		var vertexHandlerIsSelectionDashed = mxVertexHandler.prototype.isSelectionDashed;
		mxVertexHandler.prototype.isSelectionDashed = function()
		{
			if (this.graph.isTransparentBounds(this.state.cell))
			{
				return true;
			}

			return vertexHandlerIsSelectionDashed.apply(this, arguments);
		};

		/**
		 * A transparentBounds vertex handler can be present for two reasons:
		 * the user selected the group itself (draw the standard blue
		 * selection border) or only a descendant is selected and the group
		 * is shown via the ancestor-injection in getHandledSelectionCells
		 * (draw a gray border that matches the parent-highlight color).
		 */
		var vertexHandlerGetSelectionColor = mxVertexHandler.prototype.getSelectionColor;
		mxVertexHandler.prototype.getSelectionColor = function()
		{
			if (this.graph.isTransparentBounds(this.state.cell) &&
				!this.graph.isCellSelected(this.state.cell))
			{
				return '#C0C0C0';
			}

			return vertexHandlerGetSelectionColor.apply(this, arguments);
		};

		/**
		 * The selection-cells handler reuses an existing vertex handler when
		 * the same cell stays in the handled set across a selection change,
		 * which is exactly the transition between ancestor-only and directly
		 * selected for a transparentBounds group. Reuse only calls redraw(),
		 * not refresh(), so the selectionBorder stroke is never re-read.
		 * Pull the current color through updateParentHighlight, which IS
		 * called on every reused handler at the end of refresh.
		 */
		var vertexHandlerUpdateParentHighlight = mxVertexHandler.prototype.updateParentHighlight;
		mxVertexHandler.prototype.updateParentHighlight = function()
		{
			vertexHandlerUpdateParentHighlight.apply(this, arguments);

			if (this.selectionBorder != null &&
				this.graph.isTransparentBounds(this.state.cell))
			{
				this.selectionBorder.stroke = this.getSelectionColor();
				this.selectionBorder.redraw();
			}
		};
		
		/**
		 * Creates the shape used to draw the selection border.
		 */
		var edgeHandlerCreateParentHighlightShape = mxEdgeHandler.prototype.createParentHighlightShape;
		mxEdgeHandler.prototype.createParentHighlightShape = function(bounds)
		{
			var shape = edgeHandlerCreateParentHighlightShape.apply(this, arguments);
			
			shape.stroke = '#C0C0C0';
			shape.strokewidth = 1;
			
			return shape;
		};

		/**
		 * Moves rotation handle to top, right corner.
		 */
		mxVertexHandler.prototype.rotationHandleVSpacing = -12;
		mxVertexHandler.prototype.getRotationHandlePosition = function()
		{
			var padding = this.getHandlePadding();
			
			return new mxPoint(this.bounds.x + this.bounds.width - this.rotationHandleVSpacing + padding.x / 2,
				this.bounds.y + this.rotationHandleVSpacing - padding.y / 2)
		};
	
		/**
		 * Enables recursive resize for groups.
		 */
		mxVertexHandler.prototype.isRecursiveResize = function(state, me)
		{
			return this.graph.isRecursiveVertexResize(state) &&
				!mxEvent.isAltDown(me.getEvent());
		};
		
		/**
		 * Enables centered resize events.
		 */
		mxVertexHandler.prototype.isCenteredEvent = function(state, me)
		{
			return mxEvent.isControlDown(me.getEvent()) ||
				mxEvent.isMetaDown(me.getEvent());
		};

		/**
		 * Hides rotation handle for table cells and rows.
		 */
		var vertexHandlerIsRotationHandleVisible = mxVertexHandler.prototype.isRotationHandleVisible;
		mxVertexHandler.prototype.isRotationHandleVisible = function()
		{
			return vertexHandlerIsRotationHandleVisible.apply(this, arguments)  &&
				!this.graph.isTableCell(this.state.cell) &&
				!this.graph.isTableRow(this.state.cell) &&
				!this.graph.isTable(this.state.cell) &&
				!this.graph.isTransparentBounds(this.state.cell) &&
				// Manual rotation is overridden by labelAutoRotate
				mxUtils.getValue(this.state.style, 'labelAutoRotate', '0') != '1';
		};

		/**
		 * Returns true if the connect handle should be showing.
		 */
		mxVertexHandler.prototype.isConnectHandleVisible = function()
		{
			return this.graph.isConnectIconVisible(this.state.cell) &&
				this.graph.isEnabled() &&
				this.graph.isCellConnectable(this.state.cell) &&
				!this.graph.isTableCell(this.state.cell) &&
				!this.graph.isTableRow(this.state.cell) &&
				!this.graph.isTable(this.state.cell);
		};

		/**
		 * Returns the position of the connect handle.
		 */
		mxVertexHandler.prototype.connectHandleVSpacing = -12;
		mxVertexHandler.prototype.getConnectHandlePosition = function()
		{
			var padding = this.getHandlePadding();
			var graph = this.graph;
			var offset = graph.getNestedCornerIconOffset(this.state.cell,
				this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height,
				function(c)
				{
					// Mirrors mxVertexHandler.isConnectHandleVisible so a
					// descendant only contributes if it would actually render
					// the connect handle.
					return graph.isConnectIconVisible(c) &&
						graph.isEnabled() &&
						graph.isCellConnectable(c) &&
						!graph.isTableCell(c) &&
						!graph.isTableRow(c) &&
						!graph.isTable(c);
				});

			return new mxPoint(this.bounds.x + this.bounds.width - this.connectHandleVSpacing + padding.x / 2 + offset,
				this.bounds.y + this.bounds.height - this.connectHandleVSpacing + padding.y / 2 + offset);
		};

		/**
		 * Hides rotation handle for table cells and rows.
		 */
		mxVertexHandler.prototype.getSizerBounds = function()
		{
			if (this.graph.isTableCell(this.state.cell))
			{
				return this.graph.view.getState(this.graph.model.getParent(this.graph.model.getParent(this.state.cell)));
			}
			else
			{
				return this.bounds;
			}
		};

		/**
		 * Hides rotation handle for table cells and rows.
		 */
		var vertexHandlerIsParentHighlightVisible = mxVertexHandler.prototype.isParentHighlightVisible;
		mxVertexHandler.prototype.isParentHighlightVisible = function()
		{
			var parent = this.graph.model.getParent(this.state.cell);

			// transparentBounds ancestors get their own vertex handler via
			// getHandledSelectionCells, which already draws the dashed bounds.
			// Suppress the parent highlight here to avoid a duplicate outline.
			if (parent != null && this.graph.isTransparentBounds(parent))
			{
				return false;
			}

			return vertexHandlerIsParentHighlightVisible.apply(this, arguments) &&
				!this.graph.isTableCell(this.state.cell) &&
				!this.graph.isTableRow(this.state.cell);
		};
		
		/**
		 * Hides rotation handle for table cells and rows.
		 */
		var vertexHandlerIsCustomHandleVisible = mxVertexHandler.prototype.isCustomHandleVisible;
		mxVertexHandler.prototype.isCustomHandleVisible = function(handle)
		{
			return handle.tableHandle || handle.lockHandle || handle.editIconHandle ||
				handle.moveGroupHandle ||
				(vertexHandlerIsCustomHandleVisible.apply(this, arguments) &&
				(!this.graph.isTable(this.state.cell) ||
				this.graph.isCellSelected(this.state.cell)));
		};
				
		/**
		 * Adds selection border inset for table cells and rows.
		 */
		mxVertexHandler.prototype.getSelectionBorderInset = function()
		{
			var result = 0;

			// Negative inset = outward pad via .grow(-inset). The outermost
			// transparentBounds in a nested chain has the most nested
			// transparentBounds descendants in the handler set, so its
			// border (and corner handles) sit furthest from the shared
			// corner, wrapping the inner cells' borders.
			if (this.graph.isTransparentBounds(this.state.cell))
			{
				result = -this.graph.getNestedTransparentBoundsCount(this.state.cell);
			}
			else if (this.graph.isTableRow(this.state.cell))
			{
				result = 1;
			}
			else if (this.graph.isTableCell(this.state.cell))
			{
				result = 2;
			}
			
			return result;
		};
		
		/**
		 * Adds custom handles for table cells.
		 */
		var vertexHandlerGetSelectionBorderBounds = mxVertexHandler.prototype.getSelectionBorderBounds;
		mxVertexHandler.prototype.getSelectionBorderBounds = function()
		{
			return vertexHandlerGetSelectionBorderBounds.apply(this, arguments).grow(
					-this.getSelectionBorderInset());
		};
		
		var TableLineShape = null;

		/**
		 * Adds custom handles for table cells.
		 */
		var vertexHandlerCreateCustomHandles = mxVertexHandler.prototype.createCustomHandles;
		mxVertexHandler.prototype.createCustomHandles = function()
		{
			// Lazy lookup for shape constructor
			if (TableLineShape == null)
			{
				TableLineShape = mxCellRenderer.defaultShapes['tableLine'];
			}

			var handles = vertexHandlerCreateCustomHandles.apply(this, arguments);
			
			if (this.graph.isTable(this.state.cell) && this.graph.isCellMovable(this.state.cell))
			{
				var self = this;
				var graph = this.graph;
				var model = graph.model;
				var s = graph.view.scale;
				var tableState = this.state;
				var sel = this.selectionBorder;
				var x0 = this.state.origin.x + graph.view.translate.x;
				var y0 = this.state.origin.y + graph.view.translate.y;
				
				if (handles == null)
				{
					handles = [];
				}

				function moveLine(line, dx, dy)
				{
					var result = [];

					for (var i = 0; i < line.length; i++)
					{
						var pt = line[i];
						result.push((pt == null) ? null : new mxPoint(
							(x0 + pt.x + dx) * s, (y0 + pt.y + dy) * s));
					}

					return result;
				};
				
				// Adds handles for rows and columns
				var rows = graph.view.getCellStates(model.getChildCells(this.state.cell, true));

				if (rows.length > 0)
				{
					var cols = model.getChildCells(rows[0].cell, true);
					var colLines = graph.getTableLines(this.state.cell, false, true);
					var rowLines = graph.getTableLines(this.state.cell, true, false);
					
					// Adds row height handles
					for (var i = 0; i < rows.length; i++)
					{
						(mxUtils.bind(this, function(index)
						{
							var rowState = rows[index];
							var handle = null;

							if (graph.isCellMovable(rowState.cell))
							{
								var nextRow = (index < rows.length - 1) ? rows[index + 1] : null;
								var ngeo = (nextRow != null) ? graph.getCellGeometry(nextRow.cell) : null;
								var ng = (ngeo != null && ngeo.alternateBounds != null) ? ngeo.alternateBounds : ngeo;
								
								var shape = (rowLines[index] != null) ?
									new TableLineShape(rowLines[index], mxConstants.NONE, 1) :
									new mxLine(new mxRectangle(), mxConstants.NONE, 1, false);
								shape.isDashed = sel.isDashed;
								shape.svgStrokeTolerance++;

								handle = new mxHandle(rowState, 'row-resize', null, shape);
								handle.tableHandle = true;
								var dy = 0;
		
								handle.shape.node.parentNode.insertBefore(handle.shape.node,
									handle.shape.node.parentNode.firstChild);
								
								handle.redraw = function()
								{
									if (this.shape != null)
									{
										this.shape.stroke = (dy == 0) ? mxConstants.NONE : sel.stroke;

										if (this.shape.constructor == TableLineShape)
										{
											this.shape.line = moveLine(rowLines[index], 0, dy);
											this.shape.updateBoundsFromLine();
										}
										else
										{
											var start = graph.getActualStartSize(tableState.cell, true);
											this.shape.bounds.height = 1;
											this.shape.bounds.y = this.state.y + this.state.height + dy * s;
											this.shape.bounds.x = tableState.x + ((index == rows.length - 1) ?
												0 : start.x * s);
											this.shape.bounds.width = tableState.width - ((index == rows.length - 1) ?
												0 : (start.width + start.x) + s);
										}

										this.shape.redraw();
									}
								};
								
								handle.setPosition = function(bounds, pt, me)
								{
									dy = Math.max(Graph.minTableRowHeight - bounds.height,
										pt.y - bounds.y - bounds.height);

									if (ng != null && mxEvent.isShiftDown(me.getEvent()))
									{
										dy = Math.min(dy, ng.height - Graph.minTableRowHeight);
									}
								};

								handle.execute = function(me)
								{
									if (dy != 0)
									{
										var shiftPressed = mxEvent.isShiftDown(me.getEvent());
										var ctrlPressed = mxEvent.isControlDown(me.getEvent()) ||
											mxEvent.isMetaDown(me.getEvent());

										if (ctrlPressed && shiftPressed)
										{
											graph.distributeRows(tableState.cell);
										}
										else if (ctrlPressed)
										{
											graph.resizeAllTableRows(tableState.cell, dy);
										}
										else
										{
											graph.setTableRowHeight(this.state.cell,
												dy, !shiftPressed);
										}
									}
									else if (!self.blockDelayedSelection)
									{
										var temp = graph.getCellAt(me.getGraphX(),
											me.getGraphY()) || tableState.cell;
										graph.graphHandler.selectCellForEvent(temp, me);
									}

									dy = 0;
								};
								
								handle.reset = function()
								{
									dy = 0;
								};
							}
							
							handles.push(handle);
						}))(i);
					}

					// Adds column width handles
					for (var i = 0; i < cols.length; i++)
					{
						(mxUtils.bind(this, function(index)
						{
							var colState = graph.view.getState(cols[index]);
							var geo = graph.getCellGeometry(cols[index]);
							var g = (geo.alternateBounds != null) ? geo.alternateBounds : geo;

							if (colState == null)
							{
								colState = new mxCellState(graph.view, cols[index],
									graph.getCellStyle(cols[index]));
								colState.x = tableState.x + geo.x * s;
								colState.y = tableState.y + geo.y * s;
								colState.width = g.width * s;
								colState.height = g.height * s;
								colState.updateCachedBounds();
							}

							var nextCol = (index < cols.length - 1) ? cols[index + 1] : null;
							var ngeo = (nextCol != null) ? graph.getCellGeometry(nextCol) : null;
							var ng = (ngeo != null && ngeo.alternateBounds != null) ? ngeo.alternateBounds : ngeo;
							
							var shape = (colLines[index] != null) ?
								new TableLineShape(colLines[index], mxConstants.NONE, 1) :
								new mxLine(new mxRectangle(), mxConstants.NONE, 1, true);
							shape.isDashed = sel.isDashed;

							// Workaround for event handling on overlapping cells with tolerance
							shape.svgStrokeTolerance++;
							var handle = new mxHandle(colState, 'col-resize', null, shape);
							handle.tableHandle = true;
							var dx = 0;
							
							handle.shape.node.parentNode.insertBefore(handle.shape.node,
								handle.shape.node.parentNode.firstChild);

							handle.redraw = function()
							{
								if (this.shape != null)
								{
									this.shape.stroke = (dx == 0) ? mxConstants.NONE : sel.stroke;

									if (this.shape.constructor == TableLineShape)
									{
										this.shape.line = moveLine(colLines[index], dx, 0);
										this.shape.updateBoundsFromLine();
									}
									else
									{
										var start = graph.getActualStartSize(tableState.cell, true);
										this.shape.bounds.width = 1;
										this.shape.bounds.x = this.state.x + (g.width + dx) * s;
										this.shape.bounds.y = tableState.y + ((index == cols.length - 1) ?
											0 : start.y * s);
										this.shape.bounds.height = tableState.height - ((index == cols.length - 1) ?
											0 : (start.height + start.y) * s);
									}
									
									this.shape.redraw();
								}
							};
							
							handle.setPosition = function(bounds, pt, me)
							{
								dx = Math.max(Graph.minTableColumnWidth - g.width,
									pt.x - bounds.x - g.width);

								if (ng != null && mxEvent.isShiftDown(me.getEvent()))
								{
									dx = Math.min(dx, ng.width - Graph.minTableColumnWidth);
								}
							};

							handle.execute = function(me)
							{
								if (dx != 0)
								{
									var shiftPressed = mxEvent.isShiftDown(me.getEvent());
									var ctrlPressed = mxEvent.isControlDown(me.getEvent()) ||
										mxEvent.isMetaDown(me.getEvent());

									if (ctrlPressed && shiftPressed)
									{
										graph.distributeColumns(tableState.cell);
									}
									else if (ctrlPressed)
									{
										graph.resizeAllTableColumns(tableState.cell, dx);
									}
									else
									{
										graph.setTableColumnWidth(this.state.cell,
											dx, !shiftPressed);
									}
								}
								else if (!self.blockDelayedSelection)
								{
									var temp = graph.getCellAt(me.getGraphX(),
										me.getGraphY()) || tableState.cell;
									graph.graphHandler.selectCellForEvent(temp, me);
								}

								dx = 0;
							};

							// Stops repaint of text label via vertex handler
							handle.positionChanged = function()
							{
								// do nothing
							};
							
							handle.reset = function()
							{
								dx = 0;
							};
							
							handles.push(handle);
						}))(i);
					}
				}
			}
			
			// Adds lock-toggle handle when the lockedGroupIcon visibility
			// rule says so (renders a lock icon when locked, unlock when not).
			if (this.graph.isLockedGroupIconVisible(this.state.cell) &&
				this.graph.isCellMovable(this.state.cell))
			{
				if (handles == null)
				{
					handles = [];
				}

				var self = this;
				var graph = this.graph;
				var cell = this.state.cell;
				var size = 16;
				var isLocked = this.graph.isLockedGroup(cell);

				var shape = new mxImageShape(new mxRectangle(0, 0, size, size),
					(isLocked ? HoverIcons.prototype.lockHandle :
						HoverIcons.prototype.unlockHandle).src);
				shape.preserveImageAspect = false;

				var handle = new mxHandle(this.state, 'pointer', null, shape);
				handle.lockHandle = true;

				// Non-draggable: position directly, ignore drag events
				handle.setPosition = function() {};
				handle.positionChanged = function() {};
				handle.reset = function() {};

				handle.redraw = function()
				{
					if (this.shape != null)
					{
						// Top-left corner. Mirrors the rotate handle: pads outward
						// for small bounds via getHandlePadding so the icon stays
						// clear of the resize sizers. Rotated around the cell center
						// so the icon tracks the rotated corner. Nested cells
						// sharing this corner stack diagonally up-and-left via
						// getNestedCornerIconOffset.
						var padding = self.getHandlePadding();
						var offset = graph.getNestedCornerIconOffset(cell,
							self.bounds.x, self.bounds.y, function(c)
							{
								return graph.isLockedGroupIconVisible(c) &&
									graph.isCellMovable(c);
							});
						var pt = new mxPoint(
							self.bounds.x - 12 - padding.x / 2 - offset,
							self.bounds.y - 12 - padding.y / 2 - offset);
						var deg = Number((self.currentAlpha != null) ? self.currentAlpha :
							(self.state.style[mxConstants.STYLE_ROTATION] || '0'));
						var alpha = mxUtils.toRadians(deg);

						if (alpha != 0)
						{
							var ct = new mxPoint(self.state.getCenterX(),
								self.state.getCenterY());
							pt = mxUtils.getRotatedPoint(pt,
								Math.cos(alpha), Math.sin(alpha), ct);
						}

						this.shape.bounds.width = size;
						this.shape.bounds.height = size;
						this.shape.bounds.x = pt.x - size / 2;
						this.shape.bounds.y = pt.y - size / 2;
						this.shape.rotation = deg;
						this.shape.redraw();
					}
				};

				handle.execute = function(me)
				{
					graph.getModel().beginUpdate();
					try
					{
						graph.setCellStyles('lockedGroup', isLocked ? '0' : '1', [cell]);
					}
					finally
					{
						graph.getModel().endUpdate();
					}

					// Locking makes the children unselectable — drop any
					// currently selected descendants from the selection.
					// If that empties the selection, select the group
					// itself so the user keeps a selection anchor.
					if (!isLocked)
					{
						var sel = graph.getSelectionCells();
						var keep = [];

						for (var i = 0; i < sel.length; i++)
						{
							if (sel[i] == cell ||
								!graph.model.isAncestor(cell, sel[i]))
							{
								keep.push(sel[i]);
							}
						}

						if (keep.length != sel.length)
						{
							graph.setSelectionCells(
								keep.length > 0 ? keep : [cell]);
						}
					}
				};

				handles.push(handle);
			}

			// Adds edit-icon handle when editIcon=1 (pen icon at the top-left,
			// to the right of the lock and/or move icon when present).
			// Clicking it triggers editing on the cell.
			if (this.graph.isEditIconVisible(this.state.cell))
			{
				if (handles == null)
				{
					handles = [];
				}

				var self = this;
				var graph = this.graph;
				var cell = this.state.cell;
				var size = 16;

				var shape = new mxImageShape(new mxRectangle(0, 0, size, size),
					HoverIcons.prototype.editHandle.src);
				shape.preserveImageAspect = false;

				var handle = new mxHandle(this.state, 'pointer', null, shape);
				handle.editIconHandle = true;

				handle.setPosition = function() {};
				handle.positionChanged = function() {};
				handle.reset = function() {};

				handle.redraw = function()
				{
					if (this.shape != null)
					{
						// Top-left corner. Nested cells sharing this corner
						// stack diagonally up-and-left via
						// getNestedCornerIconOffset.
						var padding = self.getHandlePadding();
						var offset = graph.getNestedCornerIconOffset(cell,
							self.bounds.x, self.bounds.y,
							function(c)
							{
								return graph.isEditIconVisible(c);
							});
						var pt = new mxPoint(
							self.bounds.x - 12 - padding.x / 2 - offset,
							self.bounds.y - 12 - padding.y / 2 - offset);

						// Shifts right along the top edge when the lock and/or
						// move icon occupies the corner (lock above move), so
						// the icons form an L: corner column plus this one.
						if (graph.isCellMovable(cell) &&
							(graph.isLockedGroupIconVisible(cell) ||
							graph.isMoveIconVisible(cell)))
						{
							pt.x += 24;
						}

						var deg = Number((self.currentAlpha != null) ? self.currentAlpha :
							(self.state.style[mxConstants.STYLE_ROTATION] || '0'));
						var alpha = mxUtils.toRadians(deg);

						if (alpha != 0)
						{
							var ct = new mxPoint(self.state.getCenterX(),
								self.state.getCenterY());
							pt = mxUtils.getRotatedPoint(pt,
								Math.cos(alpha), Math.sin(alpha), ct);
						}

						this.shape.bounds.width = size;
						this.shape.bounds.height = size;
						this.shape.bounds.x = pt.x - size / 2;
						this.shape.bounds.y = pt.y - size / 2;
						this.shape.rotation = deg;
						this.shape.redraw();
					}
				};

				handle.execute = function(me)
				{
					graph.startEditingAtCell(cell);
				};

				handles.push(handle);
			}

			// Visual move-handle icon at the top-left of the cell's bounds.
			// The icon's DOM listeners forward mousedown to graph.fireMouseEvent
			// with the cell's state; the mxVertexHandler.mouseDown wrapper
			// skips start() for moveGroupHandle hits, so mxGraphHandler picks
			// up the drag with the cell as the target — identical behaviour
			// (live preview, grid snap, dashed preview shape) to grabbing the
			// cell's body or dashed border directly. When getMoveIconDragCells
			// returns a custom drag set (eg. a tree cell's subtree), the
			// wrapper starts mxGraphHandler with that set instead.
			if (this.graph.isMoveIconVisible(this.state.cell) &&
				this.graph.isCellMovable(this.state.cell))
			{
				if (handles == null)
				{
					handles = [];
				}

				var self = this;
				var graph = this.graph;
				var cell = this.state.cell;
				var size = 16;

				var shape = new mxImageShape(new mxRectangle(0, 0, size, size),
					HoverIcons.prototype.moveHandle.src);
				shape.preserveImageAspect = false;

				var handle = new mxHandle(this.state, 'move', null, shape);
				handle.moveGroupHandle = true;

				// No-op drag callbacks: the actual move runs through
				// mxGraphHandler, so this handle is a visual hit-target only.
				handle.setPosition = function() {};
				handle.positionChanged = function() {};
				handle.execute = function() {};
				handle.reset = function() {};

				handle.redraw = function()
				{
					if (this.shape != null)
					{
						var padding = self.getHandlePadding();
						var offset = graph.getNestedCornerIconOffset(cell,
							self.bounds.x, self.bounds.y, function(c)
							{
								return graph.isMoveIconVisible(c) &&
									graph.isCellMovable(c);
							});
						var x = self.bounds.x - 12 - padding.x / 2 - offset;
						var y = self.bounds.y - 12 - padding.y / 2 - offset;

						// Shifts below the lock icon when both are present so
						// the top-left corner can host them stacked vertically.
						if (graph.isLockedGroupIconVisible(cell))
						{
							y += 24;
						}

						this.shape.bounds.width = size;
						this.shape.bounds.height = size;
						this.shape.bounds.x = x - size / 2;
						this.shape.bounds.y = y - size / 2;
						this.shape.redraw();
					}
				};

				handles.push(handle);
			}

			// Reserve gives point handles precedence over line handles
			return (handles != null) ? handles.reverse() : null;
		};

		/**
		 * Hides additional handles
		 */
		var vertexHandlerSetHandlesVisible = mxVertexHandler.prototype.setHandlesVisible;

		/**
		 * Hides the dashed selection borders of every transparentBounds ancestor
		 * for the duration of a child resize/rotate. mxGraphHandler already
		 * toggles visibility via setHandlesVisibleForCells during a move drag;
		 * the resize path goes through mxVertexHandler.start instead, so the
		 * ancestor outlines need a separate hook here.
		 *
		 * Also restores this.parentState.x/y to the origin-only screen position
		 * for a transparentBounds parent. The updateCellState override shifts
		 * the group's state.x/y to its derived bounds for rendering, but
		 * resizeVertex computes bounds.x = parentState.x + unscaledBounds.x *
		 * scale assuming parentState.x equals scale*(translate + origin), so
		 * the bounds offset would otherwise be applied twice.
		 */
		var vertexHandlerStart = mxVertexHandler.prototype.start;
		mxVertexHandler.prototype.start = function(x, y, index)
		{
			vertexHandlerStart.apply(this, arguments);

			var graph = this.graph;

			if (this.parentState != null &&
				graph.isTransparentBounds(this.parentState.cell))
			{
				var scale = graph.view.scale;
				var tr = graph.view.translate;
				var orig = this.parentState;
				this.parentState = orig.clone();
				this.parentState.x = scale * (tr.x + orig.origin.x);
				this.parentState.y = scale * (tr.y + orig.origin.y);
			}

			var parent = graph.model.getParent(this.state.cell);

			while (parent != null)
			{
				if (graph.isTransparentBounds(parent))
				{
					var h = graph.selectionCellsHandler.getHandler(parent);

					if (h != null && h.selectionBorder != null)
					{
						h.selectionBorder.node.style.visibility = 'hidden';
					}
				}

				parent = graph.model.getParent(parent);
			}

			// For cells with children (groups, containers, tables) the base
			// handler disables live preview, which also leaves every resize
			// handle visible during the gesture. Hide the inactive handles
			// here so only the dragged handle stays, matching leaf shapes
			// (mxVertexHandler.start does this in its live preview block).
			if (!this.livePreviewActive && this.ghostPreview == null && this.index != null &&
				this.index != mxEvent.LABEL_HANDLE && this.sizers != null)
			{
				for (var i = 0; i < this.sizers.length; i++)
				{
					if (this.sizers[i] != null && i != this.index)
					{
						this.sizers[i].node.style.display = 'none';
					}
				}

				if (this.rotationShape != null && this.index != mxEvent.ROTATION_HANDLE)
				{
					this.rotationShape.node.style.visibility = 'hidden';
				}

				this.resizeHandlesHidden = true;
			}
		};

		var vertexHandlerReset = mxVertexHandler.prototype.reset;
		mxVertexHandler.prototype.reset = function()
		{
			// Restores the handles hidden in start for a non-live-preview
			// resize/rotate (cells with children). The base reset re-runs
			// redrawHandles afterwards to re-apply the correct visibility.
			if (this.resizeHandlesHidden)
			{
				if (this.sizers != null)
				{
					for (var i = 0; i < this.sizers.length; i++)
					{
						if (this.sizers[i] != null)
						{
							this.sizers[i].node.style.display = '';
						}
					}
				}

				if (this.rotationShape != null)
				{
					this.rotationShape.node.style.visibility = '';
				}

				this.resizeHandlesHidden = null;
			}

			var graph = this.graph;
			var parent = (this.state != null) ?
				graph.model.getParent(this.state.cell) : null;

			while (parent != null)
			{
				if (graph.isTransparentBounds(parent))
				{
					var h = graph.selectionCellsHandler.getHandler(parent);

					if (h != null && h.selectionBorder != null)
					{
						h.selectionBorder.node.style.visibility = '';
					}
				}

				parent = graph.model.getParent(parent);
			}

			vertexHandlerReset.apply(this, arguments);
		};

		mxVertexHandler.prototype.setHandlesVisible = function(visible)
		{
			vertexHandlerSetHandlesVisible.apply(this, arguments);

			if (this.moveHandles != null)
			{
				for (var i = 0; i < this.moveHandles.length; i++)
				{
					if (this.moveHandles[i] != null)
					{
						this.moveHandles[i].node.style.visibility = (visible) ? '' : 'hidden';
					}
				}
			}

			if (this.cornerHandles != null)
			{
				for (var i = 0; i < this.cornerHandles.length; i++)
				{
					this.cornerHandles[i].node.style.visibility = (visible) ? '' : 'hidden';
				}
			}

			// Toggles the dashed selection border for a transparentBounds so the
			// outline disappears while a child is dragged (mxGraphHandler calls
			// setHandlesVisibleForCells(false) on every handled cell at drag
			// start and (true) on release).
			if (this.graph.isTransparentBounds(this.state.cell) &&
				this.selectionBorder != null)
			{
				this.selectionBorder.node.style.visibility = (visible) ? '' : 'hidden';
			}
		};

		/**
		 * Function: isMoveHandlesVisible
		 * 
		 * Initializes the shapes required for this vertex handler.
		 */
		mxVertexHandler.prototype.isMoveHandlesVisible = function()
		{
			return this.graph.isTable(this.state.cell) &&
				this.graph.isCellMovable(this.state.cell);
		};

		/**
		 * Creates or updates special handles for moving rows.
		 */
		mxVertexHandler.prototype.refreshMoveHandles = function()
		{
			var showMoveHandles = this.isMoveHandlesVisible();

			if (showMoveHandles && this.moveHandles == null)
			{
				this.moveHandles = this.createMoveHandles();
			}
			else if (!showMoveHandles && this.moveHandles != null)
			{
				this.destroyMoveHandles();
			}

			// Destroys existing handles
			if (showMoveHandles && this.moveHandles == null)
			{
				for (var i = 0; i < this.moveHandles.length; i++)
				{
					if (this.moveHandles[i] != null)
					{
						this.moveHandles[i].parentNode.removeChild(this.moveHandles[i]);
					}
				}
				
				this.moveHandles = null;
			}

		};
		
		/**
		 * Creates or updates special handles for moving rows.
		 */
		mxVertexHandler.prototype.createMoveHandles = function()
		{
			var graph = this.graph;
			var model = graph.model;
			var handles = [];
			
			for (var i = 0; i < model.getChildCount(this.state.cell); i++)
			{
				(mxUtils.bind(this, function(rowState)
				{
					if (rowState != null && model.isVertex(rowState.cell) &&
						graph.isCellMovable(rowState.cell))
					{
						var bounds = new mxRectangle(0, 0, this.rowHandleImage.width, this.rowHandleImage.height);
						var moveHandle = new mxImageShape(bounds, this.rowHandleImage.src);
						moveHandle.rowState = rowState;
						moveHandle.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ?
							mxConstants.DIALECT_MIXEDHTML : mxConstants.DIALECT_SVG;
						moveHandle.init(this.graph.getView().getOverlayPane());
						moveHandle.node.style.cursor = 'move';

						mxEvent.addGestureListeners(moveHandle.node, mxUtils.bind(this, function(evt)
						{
							this.graph.popupMenuHandler.hideMenu();
							this.graph.stopEditing(false);
							
							if (this.graph.isToggleEvent(evt) ||
								!this.graph.isCellSelected(rowState.cell))
							{
								this.graph.selectCellForEvent(rowState.cell, evt);
							}
							
							if (!mxEvent.isPopupTrigger(evt))
							{
								this.graph.graphHandler.start(this.state.cell,
									mxEvent.getClientX(evt), mxEvent.getClientY(evt),
									this.graph.getSelectionCells());
								this.graph.graphHandler.cellWasClicked = true;
								this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
								this.graph.isMouseDown = true;
							}
							
							mxEvent.consume(evt);
						}), null, mxUtils.bind(this, function(evt)
						{
							if (mxEvent.isPopupTrigger(evt))
							{
								this.graph.popupMenuHandler.popup(mxEvent.getClientX(evt),
									mxEvent.getClientY(evt), rowState.cell, evt);
								mxEvent.consume(evt);
							}
						}));
						
						handles.push(moveHandle);
					}
					else
					{
						handles.push(null);
					}
				}))(this.graph.view.getState(model.getChildAt(this.state.cell, i)));
			}

			return handles;
		};

		/**
		 * Function: destroyMoveHandles
		 * 
		 * Destroys the handler and all its resources and DOM nodes.
		 */
		mxVertexHandler.prototype.destroyMoveHandles = function()
		{
			if (this.moveHandles != null)
			{
				for (var i = 0; i < this.moveHandles.length; i++)
				{
					if (this.moveHandles[i] != null)
					{
						this.moveHandles[i].destroy();
					}
				}
				
				this.moveHandles = null;
			}
		};

		/**
		 * Function: destroyCornerHandles
		 * 
		 * Destroys the handler and all its resources and DOM nodes.
		 */
		mxVertexHandler.prototype.destroyCornerHandles = function()
		{
			if (this.cornerHandles != null)
			{
				for (var i = 0; i < this.cornerHandles.length; i++)
				{
					if (this.cornerHandles[i] != null && this.cornerHandles[i].node != null &&
						this.cornerHandles[i].node.parentNode != null)
					{
						this.cornerHandles[i].node.parentNode.removeChild(this.cornerHandles[i].node);
					}
				}
				
				this.cornerHandles = null;
			}
		};

		/**
		 * Adds handle padding for editing cells and exceptions.
		 */
		var vertexHandlerRefresh = mxVertexHandler.prototype.refresh;
		mxVertexHandler.prototype.refresh = function()
		{
			vertexHandlerRefresh.apply(this, arguments);

			this.destroyMoveHandles();
			this.destroyCornerHandles();

			if (this.graph.isTable(this.state.cell) &&
				this.graph.isCellMovable(this.state.cell))
			{
				this.refreshMoveHandles();
			}
			// Draws corner rectangles for single-selected table cells,
			// table rows, and transparentBounds groups. For transparent
			// groups the rectangles are created up-front on every cell
			// in the handler set (including auto-handled ancestors), but
			// only displayed for the actually-selected cell via the
			// visibility gate in redrawHandles. Creating up-front is
			// necessary because mxSelectionCellsHandler reuses existing
			// handlers without calling refresh, so a cell that wasn't
			// selected initially wouldn't otherwise get rectangles when
			// the user later cycles selection onto it.
			//
			// The transparentBounds branch must NOT gate creation on
			// getSelectionCount() == 1: refresh() can run while the count is
			// transiently != 1 and the rectangles would then never be created
			// for the group, because the handler is afterwards reused with only
			// redraw() (never refresh()). This happens on undo/redo (the
			// model-change refresh fires before undoHandler restores the
			// selection to the group) and when a multi-selection is narrowed
			// down to the group. The table cell/row branches keep the count
			// gate; they have no ancestor-only (reused) handler state.
			else if (this.graph.isCellMovable(this.state.cell) &&
				(this.graph.isTransparentBounds(this.state.cell) ||
				(this.graph.getSelectionCount() == 1 &&
				(this.graph.isTableCell(this.state.cell) ||
				this.graph.isTableRow(this.state.cell)))))
			{
				this.cornerHandles = []; 

				for (var i = 0; i < 4; i++)
				{
					var shape = new mxRectangleShape(new mxRectangle(0, 0, 6, 6),
						'#ffffff', mxConstants.HANDLE_STROKECOLOR);
					shape.dialect =  mxConstants.DIALECT_SVG;
					shape.init(this.graph.view.getOverlayPane());
					this.cornerHandles.push(shape);
				}
			}

			if (this.graph.isTable(this.state.cell) &&
				this.graph.isCellMovable(this.state.cell))
			{
				this.refreshMoveHandles();
			}
			
			var link = this.graph.getLinkForCell(this.state.cell);
			var links = this.graph.getLinksForState(this.state);
			this.updateLinkHint(link, links);
		};

		/**
		 * Adds handle padding for editing cells and exceptions.
		 */
		var vertexHandlerGetHandlePadding = mxVertexHandler.prototype.getHandlePadding;
		mxVertexHandler.prototype.getHandlePadding = function()
		{
			var result = new mxPoint(0, 0);
			var tol = this.tolerance;
			var name = this.state.style['shape'];

			if (mxCellRenderer.defaultShapes[name] == null &&
				mxStencilRegistry.getStencil(name) == null)
			{
				name = mxConstants.SHAPE_RECTANGLE;
			}
			
			// Checks if custom handles are overlapping with the shape border
			var handlePadding = this.graph.isTable(this.state.cell) ||
				this.graph.cellEditor.getEditingCell() == this.state.cell;
			
			if (!handlePadding)
			{
				if (this.customHandles != null)
				{
					for (var i = 0; i < this.customHandles.length; i++)
					{
						// Skip lock, edit and move icon handles: they position
						// themselves using the result of this function, so they
						// would cause oscillating overlap detection.
						if (this.customHandles[i] != null &&
							!this.customHandles[i].lockHandle &&
							!this.customHandles[i].editIconHandle &&
							!this.customHandles[i].moveGroupHandle &&
							this.customHandles[i].shape != null &&
							this.customHandles[i].shape.bounds != null)
						{
							var b = this.customHandles[i].shape.bounds;
							var px = b.getCenterX();
							var py = b.getCenterY();
							
							if ((Math.abs(this.state.x - px) < b.width / 2) ||
								(Math.abs(this.state.y - py) < b.height / 2) ||
								(Math.abs(this.state.x + this.state.width - px) < b.width / 2) ||
								(Math.abs(this.state.y + this.state.height - py) < b.height / 2))
							{
								handlePadding = true;
								break;
							}
						}
					}
				}
			}
			
			if (handlePadding && this.sizers != null &&
				this.sizers.length > 0 && this.sizers[0] != null)
			{
				tol /= 2;
				
				// Makes room for row move handle
				if (this.graph.isTable(this.state.cell))
				{
					tol += 7;
				}
				
				result.x = this.sizers[0].bounds.width + tol;
				result.y = this.sizers[0].bounds.height + tol;
			}
			else
			{
				result = vertexHandlerGetHandlePadding.apply(this, arguments);
			}
			
			return result;
		};

		/**
		 * Updates the hint for the current operation.
		 */
		mxVertexHandler.prototype.updateHint = function(me)
		{
			if (this.index != mxEvent.LABEL_HANDLE)
			{
				if (this.hint == null)
				{
					this.hint = createHint();
					this.state.view.graph.container.appendChild(this.hint);
				}
	
				if (this.index == mxEvent.ROTATION_HANDLE)
				{
					this.hint.innerHTML = this.currentAlpha + '&deg;';
				}
				else
				{
					var s = this.state.view.scale;
					var unit = this.state.view.unit;
					this.hint.innerHTML = formatHintText(this.roundLength(this.bounds.width / s), unit) + ' x ' + 
						formatHintText(this.roundLength(this.bounds.height / s), unit);
				}
				
				var rot = (this.currentAlpha != null) ? this.currentAlpha : this.state.style[mxConstants.STYLE_ROTATION] || '0';
				var bb = mxUtils.getBoundingBox(this.bounds, rot);
				
				if (bb == null)
				{
					bb = this.bounds;
				}
				
				this.hint.style.left = bb.x + Math.round((bb.width - this.hint.clientWidth) / 2) + 'px';
				this.hint.style.top = (bb.y + bb.height + Editor.hintOffset) + 'px';
				
				if (this.linkHint != null)
				{
					this.linkHint.style.display = 'none';
				}
			}
		};
	
		/**
		 * Updates the hint for the current operation.
		 */
		mxVertexHandler.prototype.removeHint = function()
		{
			mxGraphHandler.prototype.removeHint.apply(this, arguments);
			
			if (this.linkHint != null)
			{
				this.linkHint.style.display = '';
			}
		};

		/**
		 * Adds handle padding for editing cells and exceptions.
		 */
		var edgeHandlerRefresh = mxEdgeHandler.prototype.refresh;
		mxEdgeHandler.prototype.refresh = function()
		{
			edgeHandlerRefresh.apply(this, arguments);

			var link = this.graph.getLinkForCell(this.state.cell);
			var links = this.graph.getLinksForState(this.state);
			this.updateLinkHint(link, links);
		};

		/**
		 * Hides link hint while moving cells.
		 */
		var edgeHandlerMouseMove = mxEdgeHandler.prototype.mouseMove;
		mxEdgeHandler.prototype.mouseMove = function(sender, me)
		{
			edgeHandlerMouseMove.apply(this, arguments);
			
			if (this.linkHint != null && this.linkHint.style.display != 'none' &&
				this.graph.graphHandler != null && this.graph.graphHandler.first != null)
			{
				this.linkHint.style.display = 'none';
			}
		}
		
		/**
		 * Hides link hint while moving cells.
		 */
		var edgeHandlerMouseUp = mxEdgeHandler.prototype.mouseUp;
		mxEdgeHandler.prototype.mouseUp = function(sender, me)
		{
			edgeHandlerMouseUp.apply(this, arguments);
			
			if (this.linkHint != null && this.linkHint.style.display == 'none' &&
				this.graph.getSelectionCount() == 1)
			{
				this.linkHint.style.display = '';
			}
		}
	
		/**
		 * Updates the hint for the current operation.
		 */
		mxEdgeHandler.prototype.updateHint = function(me, point, edge)
		{
			if (this.hint == null)
			{
				this.hint = createHint();
				this.state.view.graph.container.appendChild(this.hint);
			}
	
			var t = this.graph.view.translate;
			var s = this.graph.view.scale;
			var x = this.roundLength(point.x / s - t.x);
			var y = this.roundLength(point.y / s - t.y);
			var unit = this.graph.view.unit;

			this.hint.innerHTML = formatHintText(x, unit) + ', ' + formatHintText(y, unit);
			this.hint.style.visibility = 'visible';

			if (edge != null)
			{
				edge.view.updateEdgeBounds(edge);
				this.hint.innerHTML += ' (' + ((unit == mxConstants.POINTS) ?
					Math.round(edge.length / s) : formatHintText(
						edge.length / s, unit)) + ')';
			}			

			if (this.isSource || this.isTarget)
			{
				if (this.constraintHandler != null &&
					this.constraintHandler.currentConstraint != null &&
					this.constraintHandler.currentFocus != null)
				{
					var pt = this.constraintHandler.currentConstraint.point;
					this.hint.innerHTML = '[' + Math.round(pt.x * 100) + '%, '+ Math.round(pt.y * 100) + '%]';
				}
				else if (this.marker.hasValidState())
				{
					this.hint.style.visibility = 'hidden';
				}
			}
			
			this.hint.style.left = Math.round(me.getGraphX() - this.hint.clientWidth / 2) + 'px';
			this.hint.style.top = (Math.max(me.getGraphY(), point.y) + Editor.hintOffset) + 'px';
			
			if (this.linkHint != null)
			{
				this.linkHint.style.display = 'none';
			}
		};

		/**
		 * Replaces folding icons with SVG.
		 */
		Graph.updateFoldingImages = function(s)
		{
			Graph.prototype.expandedImage = Graph.createSvgImage(s, s, '<defs><linearGradient id="grad1" x1="50%" y1="0%" x2="50%" y2="100%">' +
				'<stop offset="30%" style="stop-color:#f0f0f0;" /><stop offset="100%" style="stop-color:#AFB0B6;" /></linearGradient></defs>' +
				'<rect x="0" y="0" width="9" height="9" stroke="#8A94A5" fill="url(#grad1)" stroke-width="2"/>' +
				'<path d="M 2 4.5 L 7 4.5 z" stroke="#000"/>', 9, 9);
			Graph.prototype.collapsedImage = Graph.createSvgImage(s, s, '<defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">' +
				'<stop offset="30%" style="stop-color:#f0f0f0;" /><stop offset="100%" style="stop-color:#AFB0B6;" /></linearGradient></defs>' +
				'<rect x="0" y="0" width="9" height="9" stroke="#8A94A5" fill="url(#grad1)" stroke-width="2"/>' +
				'<path d="M 4.5 2 L 4.5 7 M 2 4.5 L 7 4.5 z" stroke="#000"/>', 9, 9);
		};

		Graph.updateFoldingImages(9);

		/**
		 * Updates the hint for the current operation.
		 */
		mxEdgeHandler.prototype.removeHint = mxVertexHandler.prototype.removeHint;
	
		/**
		 * Defines the handles for the UI. Uses data-URIs to speed-up loading time where supported.
		 */
		HoverIcons.prototype.mainHandle = Graph.createSvgImage(18, 18, '<circle cx="9" cy="9" r="5" stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '"/>');
		HoverIcons.prototype.endMainHandle = Graph.createSvgImage(18, 18, '<circle cx="9" cy="9" r="6" stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '"/>');
		HoverIcons.prototype.secondaryHandle = Graph.createSvgImage(16, 16, '<path d="m 8 3 L 13 8 L 8 13 L 3 8 z" stroke="#fff" fill="#fca000"/>');
		HoverIcons.prototype.fixedHandle = Graph.createSvgImage(22, 22,
			'<circle cx="11" cy="11" r="6" stroke="#fff" fill="#01bd22"/>' +
			'<path d="m 8 8 L 14 14M 8 14 L 14 8" stroke="#fff"/>');
		HoverIcons.prototype.endFixedHandle = Graph.createSvgImage(22, 22,
			'<circle cx="11" cy="11" r="7" stroke="#fff" fill="#01bd22"/>' +
			'<path d="m 8 8 L 14 14M 8 14 L 14 8" stroke="#fff"/>');
		HoverIcons.prototype.terminalHandle = Graph.createSvgImage(22, 22,
			'<circle cx="11" cy="11" r="6" stroke="#fff" fill="' + HoverIcons.prototype.arrowFill +
			'"/><circle cx="11" cy="11" r="3" stroke="#fff" fill="transparent"/>');
		HoverIcons.prototype.endTerminalHandle = Graph.createSvgImage(22, 22,
			'<circle cx="11" cy="11" r="7" stroke="#fff" fill="' + HoverIcons.prototype.arrowFill +
			'"/><circle cx="11" cy="11" r="3" stroke="#fff" fill="transparent"/>');
		HoverIcons.prototype.rotationHandle = Graph.createSvgImage(16, 16,
			'<path stroke="' + HoverIcons.prototype.arrowFill + '" fill="' + HoverIcons.prototype.arrowFill +
				'" d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>',
				24, 24);
		HoverIcons.prototype.connectHandle = Graph.createSvgImage(16, 16,
			'<circle cx="12" cy="12" r="10" stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '"/>' +
				'<path transform="translate(5,5) scale(0.583)" d="M6 18v-3h7.6L4 5.4 5.4 4 15 13.6V6h3v12z" fill="#fff"/>',
				24, 24);
		HoverIcons.prototype.lockHandle = Graph.createSvgImage(16, 16,
			'<path stroke="' + HoverIcons.prototype.arrowFill + '" stroke-width="0.7" fill="' + HoverIcons.prototype.arrowFill +
				'" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>',
				24, 24);
		HoverIcons.prototype.unlockHandle = Graph.createSvgImage(16, 16,
			'<path stroke="' + HoverIcons.prototype.arrowFill + '" stroke-width="0.7" fill="' + HoverIcons.prototype.arrowFill +
				'" d="M18 8h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 .54-4.84 2.75-.14.54.18 1.08.72 1.22.53.14 1.08-.18 1.22-.72C9.44 3.93 10.63 3 12 3c1.65 0 3 1.35 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>',
				24, 24);
		HoverIcons.prototype.editHandle = Graph.createSvgImage(16, 16,
			'<path stroke="' + HoverIcons.prototype.arrowFill + '" stroke-width="0.7" fill="' + HoverIcons.prototype.arrowFill +
				'" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
				24, 24);
		HoverIcons.prototype.moveHandle = Graph.createSvgImage(16, 16,
			'<path stroke="' + HoverIcons.prototype.arrowFill + '" stroke-width="0.7" fill="' + HoverIcons.prototype.arrowFill +
				'" d="M12 2 L9 5 L11 5 L11 11 L5 11 L5 9 L2 12 L5 15 L5 13 L11 13 L11 19 L9 19 L12 22 L15 19 L13 19 L13 13 L19 13 L19 15 L22 12 L19 9 L19 11 L13 11 L13 5 L15 5 Z"/>',
				24, 24);
	
		mxConstraintHandler.prototype.pointImage = Graph.createSvgImage(5, 5,
			'<path d="m 0 0 L 5 5 M 0 5 L 5 0" stroke-width="2" style="stroke-opacity:0.4" stroke="#ffffff"/>' +
			'<path d="m 0 0 L 5 5 M 0 5 L 5 0" stroke="' + HoverIcons.prototype.arrowFill + '"/>');

		mxVertexHandler.TABLE_HANDLE_COLOR = '#fca000';
		mxVertexHandler.prototype.handleImage = HoverIcons.prototype.mainHandle;
		mxVertexHandler.prototype.secondaryHandleImage = HoverIcons.prototype.secondaryHandle;
		mxVertexHandler.prototype.rowHandleImage = Graph.createSvgImage(14, 12,
			'<rect x="2" y="2" width="10" height="3" stroke-width="1" stroke="#ffffff" fill="' + HoverIcons.prototype.arrowFill + '"/>' +
			'<rect x="2" y="7" width="10" height="3" stroke-width="1" stroke="#ffffff" fill="' + HoverIcons.prototype.arrowFill + '"/>');
		
		mxEdgeHandler.prototype.handleImage = HoverIcons.prototype.mainHandle;
		mxEdgeHandler.prototype.endHandleImage = HoverIcons.prototype.endMainHandle;
		mxEdgeHandler.prototype.terminalHandleImage = HoverIcons.prototype.terminalHandle;
		mxEdgeHandler.prototype.endTerminalHandleImage = HoverIcons.prototype.endTerminalHandle;
		mxEdgeHandler.prototype.fixedHandleImage = HoverIcons.prototype.fixedHandle;

		mxEdgeHandler.prototype.endFixedHandleImage = HoverIcons.prototype.endFixedHandle;
		mxEdgeHandler.prototype.labelHandleImage = HoverIcons.prototype.secondaryHandle;
		mxOutline.prototype.sizerImage = HoverIcons.prototype.mainHandle;
		
		if (window.Sidebar != null)
		{
			Sidebar.prototype.triangleUp = HoverIcons.prototype.triangleUp;
			Sidebar.prototype.triangleRight = HoverIcons.prototype.triangleRight;
			Sidebar.prototype.triangleDown = HoverIcons.prototype.triangleDown;
			Sidebar.prototype.triangleLeft = HoverIcons.prototype.triangleLeft;
			Sidebar.prototype.refreshTarget = HoverIcons.prototype.refreshTarget;
			Sidebar.prototype.roundDrop = HoverIcons.prototype.roundDrop;
		}

		// Adds rotation handle and live preview
		mxVertexHandler.prototype.rotationEnabled = true;
		mxVertexHandler.prototype.manageSizers = true;
		mxVertexHandler.prototype.livePreview = true;
		mxGraphHandler.prototype.maxLivePreview = 32;
		mxGraphHandler.prototype.previewColor = 'light-dark(#000000, #cccccc)';
		
		// Increases default rubberband opacity (default is 20)
		mxRubberband.prototype.defaultOpacity = 30;
		
		// Enables connections along the outline, virtual waypoints, parent highlight etc
		mxConnectionHandler.prototype.outlineConnect = true;
		mxCellHighlight.prototype.keepOnTop = true;
		mxVertexHandler.prototype.parentHighlightEnabled = true;
		
		mxEdgeHandler.prototype.parentHighlightEnabled = true;
		mxEdgeHandler.prototype.dblClickRemoveEnabled = true;
		mxEdgeHandler.prototype.straightRemoveEnabled = true;
		mxEdgeHandler.prototype.virtualBendsEnabled = true;
		mxEdgeHandler.prototype.mergeRemoveEnabled = true;
		mxEdgeHandler.prototype.manageLabelHandle = true;
		mxEdgeHandler.prototype.outlineConnect = true;

		// Double click on an unconnected straight-edge terminal handle fires an
		// event so the shape picker can be shown (handled in EditorUi) instead of
		// removing a point (a no-op for terminals). removePoint is only reached via
		// the double click handler here because removeEnabled is false.
		var edgeHandlerRemovePoint = mxEdgeHandler.prototype.removePoint;
		mxEdgeHandler.prototype.removePoint = function(state, index)
		{
			var source = (index == 0);

			if ((source || (this.abspoints != null && index == this.abspoints.length - 1)) &&
				this.abspoints != null && this.abspoints[index] != null &&
				this.graph.getModel().getTerminal(state.cell, source) == null)
			{
				this.graph.fireEvent(new mxEventObject('doubleClickEdgeTerminal',
					'cell', state.cell, 'source', source,
					'point', this.abspoints[index].clone()));
			}
			else
			{
				edgeHandlerRemovePoint.apply(this, arguments);
			}
		};
		
		// A manual waypoint edit takes the edge off libavoid auto-routing so the
		// user's points are respected from then on (LibavoidRouting re-routes only
		// flagged edges; clearing the flag makes the next move/reconnect leave the
		// edge alone). Only triggers when points are actually being set, not when
		// the handler resets to no waypoints.
		var edgeHandlerChangePoints = mxEdgeHandler.prototype.changePoints;

		mxEdgeHandler.prototype.changePoints = function(edge, points, clone)
		{
			if (edge != null && points != null && points.length > 0 &&
				mxUtils.getValue(this.graph.getCellStyle(edge), 'libavoidRouting', null) == '1')
			{
				this.graph.setCellStyles('libavoidRouting', null, [edge]);
			}

			return edgeHandlerChangePoints.apply(this, arguments);
		};

		// Live obstacle-avoiding preview while dragging an edge endpoint. Orthogonal
		// edges use mxEdgeSegmentHandler, whose getPreviewPoints delegates to the
		// base only for endpoint drags (isSource/isTarget) — inject libavoid bends
		// there for flagged edges, else fall back (null => default preview).
		var segmentHandlerGetPreviewPoints = mxEdgeSegmentHandler.prototype.getPreviewPoints;

		mxEdgeSegmentHandler.prototype.getPreviewPoints = function(point)
		{
			if ((this.isSource || this.isTarget) && typeof LibavoidRouting !== 'undefined' &&
				LibavoidRouting.previewEndpointDrag != null)
			{
				// A per-frame WASM hiccup must never abort the drag — fall back to the
				// default preview (the commit-time route stays authoritative).
				var pts = null;

				try
				{
					pts = LibavoidRouting.previewEndpointDrag(this, point);
				}
				catch (e)
				{
					// ignore
				}

				if (pts != null)
				{
					return pts;
				}
			}

			return segmentHandlerGetPreviewPoints.apply(this, arguments);
		};

		// Frees the per-drag libavoid preview Router when an edge drag ends or is
		// cancelled (segment/elbow handlers inherit this reset). NOTE: a UNIQUE
		// capture-var name is required — another mxEdgeHandler.prototype.reset
		// override later in this same scope also captures into a var, and a shared
		// `var` name would alias the two bindings and recurse infinitely.
		var libavoidEdgeHandlerReset = mxEdgeHandler.prototype.reset;

		mxEdgeHandler.prototype.reset = function()
		{
			if (typeof LibavoidRouting !== 'undefined' && LibavoidRouting.endPreview != null)
			{
				LibavoidRouting.endPreview(this);
			}

			return libavoidEdgeHandlerReset.apply(this, arguments);
		};

		// Dim the inner (waypoint/segment) handles of a libavoid auto-routed edge so
		// they read as auto-managed, not manual — like the loop-handle's faded
		// handles. The base only dims these when the edge has NO waypoints; libavoid
		// bakes waypoints in, so dim them regardless when the flag is set. Dragging
		// one still clears the flag (changePoints) and restores full opacity.
		var libavoidSetInnerBendsOpacity = mxEdgeHandler.prototype.setInnerBendsOpacity;

		mxEdgeHandler.prototype.setInnerBendsOpacity = function(bends, start, end)
		{
			if (this.state != null && bends != null &&
				mxUtils.getValue(this.state.style, 'libavoidRouting', null) == '1')
			{
				for (var i = start; i < end; i++)
				{
					if (bends[i] != null && bends[i].node != null)
					{
						mxUtils.setOpacity(bends[i].node, this.virtualBendOpacity);
					}
				}

				return;
			}

			return libavoidSetInnerBendsOpacity.apply(this, arguments);
		};

		// Route the connection-handler NEW-EDGE preview (dragging from the hover-icon
		// blue arrows) around obstacles when the preview edge carries
		// libavoidRouting=1 (i.e. libavoid is the current edge style). The committed
		// edge is then routed by the CELLS_ADDED listener. Unique capture-var names
		// to avoid aliasing other prototype-override vars in this scope.
		var libavoidConnUpdateEdgeState = mxConnectionHandler.prototype.updateEdgeState;

		mxConnectionHandler.prototype.updateEdgeState = function(current, constraint)
		{
			// For a flagged new edge, feed the libavoid bends in as this.waypoints
			// BEFORE the base routes/renders: the handler then routes the preview
			// through them (orthogonal endpoints) and connect() bakes them into the
			// committed edge. Only touch waypoints for flagged edges so a non-libavoid
			// edge's user-added waypoints are left alone.
			if (this.edgeState != null && typeof LibavoidRouting !== 'undefined' &&
				LibavoidRouting.connectionWaypoints != null &&
				mxUtils.getValue(this.edgeState.style, 'libavoidRouting', null) == '1')
			{
				// A per-frame WASM hiccup must never abort the new-edge drag — fall back
				// to the default preview (the commit-time route stays authoritative).
				try
				{
					this.waypoints = LibavoidRouting.connectionWaypoints(this);
				}
				catch (e)
				{
					this.waypoints = null;
				}
			}

			libavoidConnUpdateEdgeState.apply(this, arguments);
		};

		// Frees the connection-handler preview Router when the new-edge drag ends.
		var libavoidConnReset = mxConnectionHandler.prototype.reset;

		mxConnectionHandler.prototype.reset = function()
		{
			if (typeof LibavoidRouting !== 'undefined' && LibavoidRouting.endPreview != null)
			{
				LibavoidRouting.endPreview(this);

				// Discard any libavoid-injected preview waypoints (the commit, if any,
				// already consumed them) so they can't leak into the next drag — the
				// hover-icon path enters via start(), which doesn't reset them.
				this.waypoints = null;
			}

			return libavoidConnReset.apply(this, arguments);
		};

		// Live-route connected libavoidRouting=1 edges while a shape is dragged: the
		// base moves the cell states and re-renders connected edges (un-routed), then
		// we re-route them transiently around obstacles at the shape's preview
		// position. The model is untouched (reverts on cancel); CELLS_MOVED commits
		// the final route on drop.
		var libavoidUpdateLivePreview = mxGraphHandler.prototype.updateLivePreview;

		mxGraphHandler.prototype.updateLivePreview = function(dx, dy)
		{
			libavoidUpdateLivePreview.apply(this, arguments);

			if (typeof LibavoidRouting !== 'undefined' && LibavoidRouting.livePreviewMove != null)
			{
				// Never let a per-frame preview re-route break the actual drag — the
				// commit-time CELLS_MOVED route is authoritative regardless.
				try
				{
					LibavoidRouting.livePreviewMove(this, dx, dy);
				}
				catch (e)
				{
					// ignore
				}
			}
		};

		// End-of-drag cleanup for the transient libavoid re-routes: restore every
		// edge state livePreviewMove touched. reset runs on both drop (mouseUp,
		// AFTER moveCells committed) and cancel/escape — without it, an edge the
		// drag crossed and left keeps the preview route on screen with nothing in
		// the model (a ghost that undo cannot revert).
		var libavoidGraphHandlerReset = mxGraphHandler.prototype.reset;

		mxGraphHandler.prototype.reset = function()
		{
			libavoidGraphHandlerReset.apply(this, arguments);

			if (typeof LibavoidRouting !== 'undefined' && LibavoidRouting.endMovePreview != null)
			{
				LibavoidRouting.endMovePreview(this);
			}
		};

		// Disables adding waypoints if shift is pressed
		mxEdgeHandler.prototype.isAddVirtualBendEvent = function(me)
		{
			return !mxEvent.isShiftDown(me.getEvent());
		};
	
		// Disables custom handles if shift is pressed
		mxEdgeHandler.prototype.isCustomHandleEvent = function(me)
		{
			return !mxEvent.isShiftDown(me.getEvent());
		};
		
		/**
		 * Implements touch style
		 */
		if (Graph.touchStyle)
		{
			// Larger tolerance for real touch devices
			if (mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)
			{
				mxShape.prototype.svgStrokeTolerance = 18;
				mxVertexHandler.prototype.tolerance = 12;
				mxEdgeHandler.prototype.tolerance = 12;
				Graph.prototype.tolerance = 12;
				
				mxVertexHandler.prototype.rotationHandleVSpacing = -16;
				
				// Implements a smaller tolerance for mouse events and a larger tolerance for touch
				// events on touch devices. The default tolerance (4px) is used for mouse events.
				mxConstraintHandler.prototype.getTolerance = function(me)
				{
					return (mxEvent.isMouseEvent(me.getEvent())) ? 4 : this.graph.getTolerance();
				};
			}
				
			// One finger pans (no rubberband selection) must start regardless of mouse button
			mxPanningHandler.prototype.isPanningTrigger = function(me)
			{
				var evt = me.getEvent();
				
			 	return (me.getState() == null && !mxEvent.isMouseEvent(evt)) ||
			 		(mxEvent.isPopupTrigger(evt) && (me.getState() == null ||
			 		mxEvent.isControlDown(evt) || mxEvent.isShiftDown(evt)));
			};
		}
		else
		{
			// Removes ctrl+shift as panning trigger for space splitting
			mxPanningHandler.prototype.isPanningTrigger = function(me)
			{
				var evt = me.getEvent();
				
				return (mxEvent.isLeftMouseButton(evt) && ((this.useLeftButtonForPanning &&
						me.getState() == null) || (mxEvent.isControlDown(evt) &&
						!mxEvent.isShiftDown(evt)))) || (this.usePopupTrigger &&
						mxEvent.isPopupTrigger(evt));
			};
		}

		// Overrides/extends rubberband for space handling with Ctrl+Shift(+Alt) drag ("scissors tool")
		mxRubberband.prototype.isSpaceEvent = function(me)
		{
			return this.graph.isEnabled() && !this.graph.isCellLocked(this.graph.getDefaultParent()) &&
				(mxEvent.isControlDown(me.getEvent()) || mxEvent.isMetaDown(me.getEvent())) &&
				mxEvent.isShiftDown(me.getEvent()) && mxEvent.isAltDown(me.getEvent());
		};

		// Cancelled state
		mxRubberband.prototype.cancelled = false;

		// Cancels ongoing rubberband selection but consumed event to avoid reset of selection
		mxRubberband.prototype.cancel = function()
		{
			if (this.isActive())
			{
				this.cancelled = true;
				this.reset();
			}
		};

		// Handles moving of cells in both half panes
		mxRubberband.prototype.mouseUp = function(sender, me)
		{
			if (this.cancelled)
			{
				this.cancelled = false;
				me.consume();
			}
			else
			{
				var execute = this.div != null && this.div.style.display != 'none';
	
				var x0 = null;
				var y0 = null;
				var dx = null;
				var dy = null;
	
				if (this.first != null && this.currentX != null && this.currentY != null)
				{
					x0 = this.first.x;
					y0 = this.first.y;
					dx = (this.currentX - x0) / this.graph.view.scale;
					dy = (this.currentY - y0) / this.graph.view.scale;
	
					if (!mxEvent.isAltDown(me.getEvent()))
					{
						dx = this.graph.snap(dx);
						dy = this.graph.snap(dy);
						
						if (!this.graph.isGridEnabled())
						{
							if (Math.abs(dx) < this.graph.tolerance)
							{
								dx = 0;
							}
							
							if (Math.abs(dy) < this.graph.tolerance)
							{
								dy = 0;
							}
						}
					}
				}
				
				this.reset();
				
				if (execute)
				{
					if (this.isSpaceEvent(me))
					{
						this.graph.model.beginUpdate();
						try
						{
							var cells = this.graph.getCellsBeyond(x0, y0, this.graph.getDefaultParent(), true, true);
	
							for (var i = 0; i < cells.length; i++)
							{
								if (this.graph.isCellMovable(cells[i]))
								{
									var tmp = this.graph.view.getState(cells[i]);
									var geo = this.graph.getCellGeometry(cells[i]);
									
									if (tmp != null && geo != null)
									{
										geo = geo.clone();
										geo.translate(dx, dy);
										this.graph.model.setGeometry(cells[i], geo);
									}
								}
							}
						}
						finally
						{
							this.graph.model.endUpdate();
						}
					}
					else
					{
						var rect = new mxRectangle(this.x, this.y, this.width, this.height);
						this.graph.selectRegion(rect, me.getEvent());
					}
					
					me.consume();
				}
			}
		};
		
		// Handles preview for creating/removing space in diagram
		mxRubberband.prototype.mouseMove = function(sender, me)
		{
			if (!me.isConsumed() && this.first != null)
			{
				var origin = mxUtils.getScrollOrigin(this.graph.container);
				var offset = mxUtils.getOffset(this.graph.container);
				origin.x -= offset.x;
				origin.y -= offset.y;
				var x = me.getX() + origin.x;
				var y = me.getY() + origin.y;
				var dx = this.first.x - x;
				var dy = this.first.y - y;
				var tol = this.graph.tolerance;
				
				if (this.div != null || Math.abs(dx) > tol ||  Math.abs(dy) > tol)
				{
					if (this.div == null)
					{
						this.div = this.createShape();
					}
					
					// Clears selection while rubberbanding. This is required because
					// the event is not consumed in mouseDown.
					mxUtils.clearSelection();
					this.update(x, y);
					
					if (this.isSpaceEvent(me))
					{
						var right = this.x + this.width;
						var bottom = this.y + this.height;
						var scale = this.graph.view.scale;
						
						if (!mxEvent.isAltDown(me.getEvent()))
						{
							this.width = this.graph.snap(this.width / scale) * scale;
							this.height = this.graph.snap(this.height / scale) * scale;
							
							if (!this.graph.isGridEnabled())
							{
								if (this.width < this.graph.tolerance)
								{
									this.width = 0;
								}
								
								if (this.height < this.graph.tolerance)
								{
									this.height = 0;
								}
							}
							
							if (this.x < this.first.x)
							{
								this.x = right - this.width;
							}
							
							if (this.y < this.first.y)
							{
								this.y = bottom - this.height;
							}
						}
						
						this.div.style.borderStyle = 'dashed';
						this.div.style.backgroundColor = 'white';
						this.div.style.left = this.x + 'px';
						this.div.style.top = this.y + 'px';
						this.div.style.width = Math.max(0, this.width) + 'px';
						this.div.style.height = this.graph.container.clientHeight + 'px';
						this.div.style.borderWidth = (this.width <= 0) ? '0px 1px 0px 0px' : '0px 1px 0px 1px';
						
						if (this.secondDiv == null)
						{
							this.secondDiv = this.div.cloneNode(true);
							this.div.parentNode.appendChild(this.secondDiv);
						}
						
						this.secondDiv.style.left = this.x + 'px';
						this.secondDiv.style.top = this.y + 'px';
						this.secondDiv.style.width = this.graph.container.clientWidth + 'px';
						this.secondDiv.style.height = Math.max(0, this.height) + 'px';
						this.secondDiv.style.borderWidth = (this.height <= 0) ? '1px 0px 0px 0px' : '1px 0px 1px 0px';
					}
					else
					{
						// Hides second div and restores style
						this.div.style.backgroundColor = '';
						this.div.style.borderWidth = '';
						this.div.style.borderStyle = '';
						
						if (this.secondDiv != null)
						{
							this.secondDiv.parentNode.removeChild(this.secondDiv);
							this.secondDiv = null;
						}
					}

					me.consume();
				}
			}
		};
		
		// Removes preview
		var mxRubberbandReset = mxRubberband.prototype.reset;
		mxRubberband.prototype.reset = function()
		{
			if (this.secondDiv != null)
			{
				this.secondDiv.parentNode.removeChild(this.secondDiv);
				this.secondDiv = null;
			}
			
			mxRubberbandReset.apply(this, arguments);
		};
		
	    // Timer-based activation of outline connect in connection handler
	    var startTime = new Date().getTime();
	    var timeOnTarget = 0;
	    
		var mxEdgeHandlerUpdatePreviewState = mxEdgeHandler.prototype.updatePreviewState;
		
		mxEdgeHandler.prototype.updatePreviewState = function(edge, point, terminalState, me)
		{
			mxEdgeHandlerUpdatePreviewState.apply(this, arguments);
			
	    	if (terminalState != this.currentTerminalState)
	    	{
	    		startTime = new Date().getTime();
	    		timeOnTarget = 0;
	    	}
	    	else
	    	{
		    	timeOnTarget = new Date().getTime() - startTime;
	    	}
			
			this.currentTerminalState = terminalState;
		};
	
		// Timer-based outline connect
		var mxEdgeHandlerIsOutlineConnectEvent = mxEdgeHandler.prototype.isOutlineConnectEvent;
		
		mxEdgeHandler.prototype.isOutlineConnectEvent = function(me)
		{
			if (mxEvent.isShiftDown(me.getEvent()) && mxEvent.isAltDown(me.getEvent()))
			{
				return false;
			}
			else
			{
				return (this.currentTerminalState != null && me.getState() == this.currentTerminalState && timeOnTarget > 2000) ||
					((this.currentTerminalState == null || mxUtils.getValue(this.currentTerminalState.style, 'outlineConnect', '1') != '0') &&
					mxEdgeHandlerIsOutlineConnectEvent.apply(this, arguments));
			}
		};
		
		// Shows secondary handle for fixed connection points
		mxEdgeHandler.prototype.createHandleShape = function(index, virtual, target)
		{
			var source = index != null && index == 0;
			var terminalState = this.state.getVisibleTerminalState(source);
			var c = (index != null && this.state.absolutePoints != null &&
				(index == 0 || index >= this.state.absolutePoints.length - 1 ||
				(this.constructor == mxElbowEdgeHandler && index == 2))) ?
				this.graph.getConnectionConstraint(this.state, terminalState, source) : null;
			var pt = (c != null) ? this.graph.getConnectionPoint(this.state.getVisibleTerminalState(source), c) : null;
			var img = (pt != null) ? (!target ? this.fixedHandleImage : this.endFixedHandleImage) :
				((c != null && terminalState != null) ? (!target ? this.terminalHandleImage : this.endTerminalHandleImage) :
					(!target ? this.handleImage : this.endHandleImage));
			
			if (img != null)
			{
				var shape = new mxImageShape(new mxRectangle(0, 0, img.width, img.height), img.src);
				
				// Allows HTML rendering of the images
				shape.preserveImageAspect = false;
	
				return shape;
			}
			else
			{
				var s = mxConstants.HANDLE_SIZE;
				
				if (this.preferHtml)
				{
					s -= 1;
				}
				
				return new mxRectangleShape(new mxRectangle(0, 0, s, s), mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
			}
		};
	
		var vertexHandlerCreateSizerShape = mxVertexHandler.prototype.createSizerShape;
		mxVertexHandler.prototype.createSizerShape = function(bounds, index, fillColor, image)
		{
			image = (index == mxEvent.ROTATION_HANDLE) ? HoverIcons.prototype.rotationHandle :
				(index == mxEvent.CONNECT_HANDLE) ? HoverIcons.prototype.connectHandle :
				(index == mxEvent.LABEL_HANDLE) ? this.secondaryHandleImage : image;

			return vertexHandlerCreateSizerShape.apply(this, arguments);
		};
		
		// Adds the connect handle to the sizers
		var vertexHandlerCreateSizers = mxVertexHandler.prototype.createSizers;
		mxVertexHandler.prototype.createSizers = function()
		{
			var sizers = vertexHandlerCreateSizers.apply(this, arguments);

			if (this.connectShape == null && this.isConnectHandleVisible())
			{
				this.connectShape = this.createSizer('copy', mxEvent.CONNECT_HANDLE,
					mxConstants.HANDLE_SIZE + 3, mxConstants.HANDLE_FILLCOLOR);
				sizers.push(this.connectShape);
			}

			return sizers;
		};

		// Nullifies connectShape when sizers are destroyed
		var vertexHandlerDestroySizers = mxVertexHandler.prototype.destroySizers;
		mxVertexHandler.prototype.destroySizers = function()
		{
			vertexHandlerDestroySizers.apply(this, arguments);
			this.connectShape = null;
		};

		// Override getHandleForEvent to detect connect handle before other handles
		var vertexHandlerGetHandleForEvent = mxVertexHandler.prototype.getHandleForEvent;
		mxVertexHandler.prototype.getHandleForEvent = function(me)
		{
			if (this.connectShape != null && this.connectShape.node != null &&
				this.connectShape.node.style.visibility != 'hidden')
			{
				var tol = (!mxEvent.isMouseEvent(me.getEvent())) ? this.tolerance : 1;
				var hit = (this.allowHandleBoundsCheck && tol > 0) ?
					new mxRectangle(me.getGraphX() - tol, me.getGraphY() - tol, 2 * tol, 2 * tol) : null;

				if (me.isSource(this.connectShape) ||
					(hit != null && this.connectShape.intersectsRectangle(hit)))
				{
					return mxEvent.CONNECT_HANDLE;
				}
			}

			return vertexHandlerGetHandleForEvent.apply(this, arguments);
		};

		// Override mouseDown to intercept connect handle and start connection
		var mxVertexHandlerMouseDown2 = mxVertexHandler.prototype.mouseDown;
		mxVertexHandler.prototype.mouseDown = function(sender, me)
		{
			if (!me.isConsumed() && this.graph.isEnabled() && this.connectShape != null)
			{
				var handle = this.getHandleForEvent(me);

				if (handle == mxEvent.CONNECT_HANDLE)
				{
					var x = me.getGraphX();
					var y = me.getGraphY();

					this.graph.popupMenuHandler.hideMenu();
					this.graph.stopEditing(false);
					this.graph.connectHandleClickState = this.state;
					this.graph.connectionHandler.start(this.state, x, y);
					this.graph.isMouseTrigger = mxEvent.isMouseEvent(me.getEvent());
					this.graph.isMouseDown = true;

					// Hides handles for selection cell during connection drag
					var handler = this.graph.selectionCellsHandler.getHandler(this.state.cell);

					if (handler != null)
					{
						handler.setHandlesVisible(false);
					}

					me.consume();

					return;
				}
			}

			mxVertexHandlerMouseDown2.apply(this, arguments);
		};

		// Special case for single edge label handle moving in which case the text bounding box is used
		var mxGraphHandlerGetBoundingBox = mxGraphHandler.prototype.getBoundingBox;
		mxGraphHandler.prototype.getBoundingBox = function(cells)
		{
			if (cells != null && cells.length == 1)
			{
				var model = this.graph.getModel();
				var parent = model.getParent(cells[0]);
				var geo = this.graph.getCellGeometry(cells[0]);
				
				if (model.isEdge(parent) && geo != null && geo.relative)
				{
					var state = this.graph.view.getState(cells[0]);
					
					if (state != null && state.width < 2 && state.height < 2 && state.text != null &&
						state.text.boundingBox != null)
					{
						return mxRectangle.fromRectangle(state.text.boundingBox);
					}
				}
			}
			
			return mxGraphHandlerGetBoundingBox.apply(this, arguments);
		};

		// Ignores child cells with part style as guides
		var mxGraphHandlerGetGuideStates = mxGraphHandler.prototype.getGuideStates;
		
		mxGraphHandler.prototype.getGuideStates = function()
		{
			var states = mxGraphHandlerGetGuideStates.apply(this, arguments);
			var result = [];
			
			// NOTE: Could do via isStateIgnored hook
			for (var i = 0; i < states.length; i++)
			{
				if (mxUtils.getValue(states[i].style, 'part', '0') != '1')
				{
					result.push(states[i]);
				}
			}
			
			return result;
		};

		// Uses text bounding box for edge labels
		var mxVertexHandlerGetSelectionBounds = mxVertexHandler.prototype.getSelectionBounds;
		mxVertexHandler.prototype.getSelectionBounds = function(state)
		{
			var model = this.graph.getModel();
			var parent = model.getParent(state.cell);
			var geo = this.graph.getCellGeometry(state.cell);
			
			if (model.isEdge(parent) && geo != null && geo.relative && state.width < 2 && state.height < 2 && state.text != null && state.text.boundingBox != null)
			{
				var bbox = state.text.unrotatedBoundingBox || state.text.boundingBox;
				
				return new mxRectangle(Math.round(bbox.x), Math.round(bbox.y), Math.round(bbox.width), Math.round(bbox.height));
			}
			else
			{
				return mxVertexHandlerGetSelectionBounds.apply(this, arguments);
			}
		};
	
		// Redirects moving of edge labels to mxGraphHandler by not starting here.
		// Also redirects clicks on the move-group handle icon so the drag uses
		// mxGraphHandler's live preview (with grid snap during drag) instead of
		// our custom mxHandle path. The icon's DOM redirects events with the
		// group's state, so mxGraphHandler picks the group as the drag target.
		var mxVertexHandlerMouseDown = mxVertexHandler.prototype.mouseDown;
		mxVertexHandler.prototype.mouseDown = function(sender, me)
		{
			var model = this.graph.getModel();
			var parent = model.getParent(this.state.cell);
			var geo = this.graph.getCellGeometry(this.state.cell);

			// Lets rotation and connect events through
			var handle = this.getHandleForEvent(me);

			// Skip start() for the move-group handle so mxGraphHandler.mouseDown
			// can take over and run its own drag (including grid snap and the
			// dashed preview shape, matching a click on the group's border).
			if (handle != null && handle <= mxEvent.CUSTOM_HANDLE &&
				this.customHandles != null)
			{
				var ch = this.customHandles[mxEvent.CUSTOM_HANDLE - handle];

				if (ch != null && ch.moveGroupHandle)
				{
					// A custom drag set (eg. a tree cell's subtree) must be
					// started explicitly, as the mxGraphHandler fall-through
					// derives the drag set from the cell itself.
					var cells = this.graph.getMoveIconDragCells(this.state.cell);

					if (cells != null)
					{
						this.graph.graphHandler.start(this.state.cell,
							mxEvent.getClientX(me.getEvent()),
							mxEvent.getClientY(me.getEvent()), cells);
						this.graph.graphHandler.cellWasClicked = true;
						this.graph.isMouseTrigger = mxEvent.isMouseEvent(me.getEvent());
						this.graph.isMouseDown = true;
						me.consume();
					}

					return;
				}
			}

			if (handle == mxEvent.ROTATION_HANDLE || handle == mxEvent.CONNECT_HANDLE ||
				!model.isEdge(parent) || geo == null || !geo.relative ||
				this.state == null || this.state.width >= 2 || this.state.height >= 2)
			{
				mxVertexHandlerMouseDown.apply(this, arguments);
			}
		};

		// Invokes turn on single click on rotation handle
		mxVertexHandler.prototype.rotateClick = function()
		{
			var stroke = mxUtils.getValue(this.state.style, mxConstants.STYLE_STROKECOLOR, mxConstants.NONE);
			var fill = mxUtils.getValue(this.state.style, mxConstants.STYLE_FILLCOLOR, mxConstants.NONE);
			
			if (this.state.view.graph.model.isVertex(this.state.cell) &&
				stroke == mxConstants.NONE && fill == mxConstants.NONE)
			{
				var graph = this.state.view.graph;

				// Groups rotate as a rigid body (children baked) like the rotation handle
				if (graph.model.getChildCount(this.state.cell) > 0 && !graph.isTable(this.state.cell) &&
					!graph.isTableRow(this.state.cell) && !graph.isTableCell(this.state.cell) &&
					!graph.isSwimlane(this.state.cell))
				{
					graph.rotateCell(this.state.cell, 90);
				}
				else
				{
					var angle = mxUtils.mod(mxUtils.getValue(this.state.style, mxConstants.STYLE_ROTATION, 0) + 90, 360);
					graph.setCellStyles(mxConstants.STYLE_ROTATION, angle, [this.state.cell]);
				}
			}
			else
			{
				this.state.view.graph.turnShapes([this.state.cell]);
			}
		};

		// Updates font size in live preview for autosizeText cells
		var mxVertexHandlerUpdateLivePreview = mxVertexHandler.prototype.updateLivePreview;

		mxVertexHandler.prototype.updateLivePreview = function(me)
		{
			if (this.state != null && this.graph.isAutosizeTextState(this.state))
			{
				var scale = this.graph.view.scale;
				var style = this.state.style;
				var w = this.roundLength(this.bounds.width / scale);
				var h = this.roundLength(this.bounds.height / scale);
				var value = this.graph.cellRenderer.getLabelValue(this.state);

				if (value != null && value.length > 0)
				{
					var space = this.graph.getAutosizeTextAvailableSpace(style, w, h, this.state);

					if (space != null)
					{
						if (!this.graph.isHtmlLabel(this.state.cell))
						{
							value = mxUtils.htmlEntities(value, false);
						}

						value = value.replace(/\n/g, '<br>');

						var fontFamily = style[mxConstants.STYLE_FONTFAMILY] ||
							mxConstants.DEFAULT_FONTFAMILY;
						var fontStyle = style[mxConstants.STYLE_FONTSTYLE];
						var wrap = style[mxConstants.STYLE_WHITE_SPACE] == 'wrap';

						var fontSize = this.graph.computeAutosizeTextFontSize(value,
							space.availW, space.availH, fontFamily, fontStyle, wrap);

						var origFontSize = style[mxConstants.STYLE_FONTSIZE];
						style[mxConstants.STYLE_FONTSIZE] = fontSize;
						mxVertexHandlerUpdateLivePreview.apply(this, arguments);

						// After setState, this.state.style points to the clone's
						// style object, so restore font size on the current reference
						this.state.style[mxConstants.STYLE_FONTSIZE] = origFontSize;

						return;
					}
				}
			}

			mxVertexHandlerUpdateLivePreview.apply(this, arguments);
		};

		var vertexHandlerMouseMove = mxVertexHandler.prototype.mouseMove;

		// Workaround for "isConsumed not defined" in MS Edge is to use arguments
		mxVertexHandler.prototype.mouseMove = function(sender, me)
		{
			vertexHandlerMouseMove.apply(this, arguments);

			// Keeps the visible (active) handle aligned with the live bounds
			// during a non-live-preview resize/rotate so it tracks the cursor
			// like the handles on leaf shapes. The base handler only repositions
			// handles via redrawHandles when live preview is active (childless
			// cells); cells with children take the static preview path instead.
			if (this.resizeHandlesHidden && this.index != null && !this.inTolerance)
			{
				this.redrawHandles();
			}

			if (this.graph.graphHandler.first != null)
			{
				if (this.rotationShape != null && this.rotationShape.node != null)
				{
					this.rotationShape.node.style.display = 'none';
				}

				if (this.connectShape != null && this.connectShape.node != null)
				{
					this.connectShape.node.style.display = 'none';
				}

				if (this.linkHint != null && this.linkHint.style.display != 'none')
				{
					this.linkHint.style.display = 'none';
				}
			}
		};

		var vertexHandlerMouseUp = mxVertexHandler.prototype.mouseUp;

		mxVertexHandler.prototype.mouseUp = function(sender, me)
		{
			vertexHandlerMouseUp.apply(this, arguments);

			// Shows rotation handle only if one vertex is selected
			if (this.rotationShape != null && this.rotationShape.node != null)
			{
				this.rotationShape.node.style.display = (this.graph.getSelectionCount() == 1) ? '' : 'none';
			}

			// Shows connect handle only if one vertex is selected
			if (this.connectShape != null && this.connectShape.node != null)
			{
				this.connectShape.node.style.display = (this.graph.getSelectionCount() == 1) ? '' : 'none';
			}

			if (this.linkHint != null && this.linkHint.style.display == 'none' &&
				this.graph.getSelectionCount() == 1)
			{
				this.linkHint.style.display = '';
			}

			// Resets state after gesture
			this.blockDelayedSelection = null;
		};
		
		mxVertexHandler.prototype.updateLinkHint = function(link, links)
		{
			try
			{
				if (link == null && (links == null || links.length == 0))
				{
					if (this.linkHint != null)
					{
						this.linkHint.parentNode.removeChild(this.linkHint);
						this.linkHint = null;
					}
				}
				else if (link != null || (links != null && links.length > 0))
				{
					var img = document.createElement('img');
					img.className = 'geAdaptiveAsset';
					img.setAttribute('src', Editor.editImage);
					img.setAttribute('title', mxResources.get('editLink'));
					img.setAttribute('width', '14');
					img.setAttribute('height', '14');
					img.style.paddingLeft = '8px';
					img.style.marginLeft = 'auto';
					img.style.marginBottom = '-1px';
					img.style.cursor = 'pointer';

					var trash = img.cloneNode(true);
					trash.setAttribute('src', Editor.trashImage);
					trash.setAttribute('title', mxResources.get('removeIt',
						[mxResources.get('link')]));
					trash.style.paddingLeft = '4px';
					trash.style.marginLeft = '0';

					if (this.linkHint == null)
					{
						this.linkHint = createHint();

						mxUtils.setPrefixedStyle(this.linkHint.style, 'transform', 'translate(-50%,0)');
						this.linkHint.style.padding = '6px 8px 6px 8px';
						this.linkHint.style.opacity = '1';
						this.linkHint.style.filter = '';
						
						this.graph.container.appendChild(this.linkHint);

						mxEvent.addListener(this.linkHint, 'mouseenter', mxUtils.bind(this, function()
						{
							this.graph.tooltipHandler.hide();
						}));
					}
	
					this.linkHint.innerText = '';
					
					if (link != null)
					{
						var wrapper = document.createElement('div');
						wrapper.style.display = 'flex';
						wrapper.style.alignItems = 'center';
						wrapper.appendChild(this.graph.createLinkForHint(link, null, this.state.cell));

						this.linkHint.appendChild(wrapper);
						
						if (this.graph.isEnabled() && typeof this.graph.editLink === 'function' &&
							!this.graph.isCellLocked(this.state.cell))
						{
							var changeLink = img.cloneNode(true);
							wrapper.appendChild(changeLink);
							
							mxEvent.addListener(changeLink, 'click', mxUtils.bind(this, function(evt)
							{
								this.graph.setSelectionCell(this.state.cell);
								this.graph.editLink();
								mxEvent.consume(evt);
							}));

							var trashLink = trash.cloneNode(true);
							wrapper.appendChild(trashLink);

							mxEvent.addListener(trashLink, 'click', mxUtils.bind(this, function(evt)
							{
								this.graph.setLinkForCell(this.state.cell, null);
								mxEvent.consume(evt);
							}));
						}
					}
	
					if (links != null)
					{
						for (var i = 0; i < links.length; i++)
						{
							(mxUtils.bind(this, function(currentLink, index)
							{
								var div = document.createElement('div');
								div.style.display = 'flex';
								div.style.alignItems = 'center';
								div.style.marginTop = (link != null || index > 0) ? '6px' : '0px';
								div.appendChild(this.graph.createLinkForHint(
									currentLink.getAttribute('href'),
									mxUtils.getTextContent(currentLink),
									this.state.cell));
								
								var changeLink = img.cloneNode(true);
								div.appendChild(changeLink);
								
								var updateLink = mxUtils.bind(this, function(value)
								{
									var tmp = document.createElement('div');
									tmp.innerHTML = Graph.sanitizeHtml(this.graph.getLabel(this.state.cell));
									var anchor = tmp.getElementsByTagName('a')[index];

									if (anchor != null)
									{
										if (value == null || value == '')
										{
											var child = anchor.cloneNode(true).firstChild;

											while (child != null)
											{
												anchor.parentNode.insertBefore(child.cloneNode(true), anchor);
												child = child.nextSibling;
											}
		
											anchor.parentNode.removeChild(anchor);
										}
										else
										{
											anchor.setAttribute('href', value);
										}

										this.graph.labelChanged(this.state.cell, tmp.innerHTML);
									}
								});
								
								mxEvent.addListener(changeLink, 'click', mxUtils.bind(this, function(evt)
								{
									this.graph.showLinkDialog(currentLink.getAttribute('href') || '',
										mxResources.get('ok'), updateLink);
									mxEvent.consume(evt);
								}));
								
								var trashLink = trash.cloneNode(true);
								div.appendChild(trashLink);

								mxEvent.addListener(trashLink, 'click', mxUtils.bind(this, function(evt)
								{
									updateLink();
									mxEvent.consume(evt);
								}));
								
								this.linkHint.appendChild(div);
							}))(links[i], i);
						}
					}
				}

				if (this.linkHint != null)
				{
					Graph.sanitizeNode(this.linkHint);
				}
			}
			catch (e)
			{
				// ignore
			}
		};

		mxEdgeHandler.prototype.updateLinkHint = mxVertexHandler.prototype.updateLinkHint;

		// Extends constraint handler
		var edgeHandlerCreateConstraintHandler = mxEdgeHandler.prototype.createConstraintHandler;
		mxEdgeHandler.prototype.createConstraintHandler = function()
		{
			var handler = edgeHandlerCreateConstraintHandler.apply(this, arguments);

			// Disables connection points
			handler.isEnabled = mxUtils.bind(this, function()
			{
				return this.state.view.graph.connectionHandler.isEnabled();
			});
			
			return handler;
		};
	
		// Disables connection points
		var connectionHandlerInit = mxConnectionHandler.prototype.init;
		mxConnectionHandler.prototype.init = function()
		{
			connectionHandlerInit.apply(this, arguments);
			
			this.constraintHandler.isEnabled = mxUtils.bind(this, function()
			{
				return this.graph.connectionHandler.isEnabled();
			});
		};
	
		// Updates special handles
		var vertexHandlerRedrawHandles = mxVertexHandler.prototype.redrawHandles;
		mxVertexHandler.prototype.redrawHandles = function()
		{
			if (this.moveHandles != null)
			{
				for (var i = 0; i < this.moveHandles.length; i++)
				{
					if (this.moveHandles[i] != null)
					{
						this.moveHandles[i].bounds.x = Math.round(this.moveHandles[i].rowState.x +
							this.moveHandles[i].rowState.width - this.moveHandles[i].bounds.width / 2);
						this.moveHandles[i].bounds.y = Math.round(this.moveHandles[i].rowState.y +
							(this.moveHandles[i].rowState.height - this.moveHandles[i].bounds.height) / 2);
						this.moveHandles[i].redraw();
					}
				}
			}
			
			if (this.cornerHandles != null)
			{
				var inset = this.getSelectionBorderInset();
				var ch = this.cornerHandles;
				var w = ch[0].bounds.width / 2;
				var h = ch[0].bounds.height / 2;
				
				ch[0].bounds.x = this.state.x - w + inset;
				ch[0].bounds.y = this.state.y - h + inset;
				ch[0].redraw();
				ch[1].bounds.x = ch[0].bounds.x + this.state.width - 2 * inset;
				ch[1].bounds.y = ch[0].bounds.y;
				ch[1].redraw();
				ch[2].bounds.x = ch[0].bounds.x;
				ch[2].bounds.y = this.state.y + this.state.height - 2 * inset;
				ch[2].redraw();
				ch[3].bounds.x = ch[1].bounds.x;
				ch[3].bounds.y = ch[2].bounds.y;
				ch[3].redraw();
				
				// For transparentBounds groups the rectangles exist on every
				// cell in the handler set (including auto-handled ancestors)
				// so they're ready to show on cycle, but only the actually-
				// selected cell displays them.
				var visible = this.graph.getSelectionCount() == 1 &&
					(!this.graph.isTransparentBounds(this.state.cell) ||
						this.graph.isCellSelected(this.state.cell));

				for (var i = 0; i < this.cornerHandles.length; i++)
				{
					this.cornerHandles[i].node.style.display = visible ? '' : 'none';
				}
			}
			
			// Shows rotation handle only if one vertex is selected
			if (this.rotationShape != null && this.rotationShape.node != null)
			{
				this.rotationShape.node.setAttribute('title', mxResources.get('rotateTooltip'));
				this.rotationShape.node.style.display = (this.moveHandles == null &&
					(this.graph.getSelectionCount() == 1 && (this.index == null ||
					this.index == mxEvent.ROTATION_HANDLE))) ? '' : 'none';
			}

			vertexHandlerRedrawHandles.apply(this);

			// Repositions the lock and edit icon handles after the base redraw
			// so they pick up the final handle padding. They depend on the
			// start-size custom handle for overlap detection in getHandlePadding,
			// but that handle is only refreshed during the base redraw and (for
			// hover hit-testing) must stay last in the custom handle array, so it
			// is redrawn after them. Mirrors the rotation and connect handles,
			// which are also positioned after the base call.
			if (this.customHandles != null)
			{
				for (var i = 0; i < this.customHandles.length; i++)
				{
					if (this.customHandles[i] != null &&
						(this.customHandles[i].lockHandle ||
						this.customHandles[i].editIconHandle ||
						this.customHandles[i].moveGroupHandle))
					{
						this.customHandles[i].redraw();
					}
				}
			}

			// Rotates the rotation handle image itself so it visually matches
			// the cell's orientation (base mxVertexHandler only translates it
			// to the rotated corner, keeping the icon axis-aligned).
			if (this.rotationShape != null && this.rotationShape.node != null)
			{
				var deg = Number((this.currentAlpha != null) ? this.currentAlpha :
					(this.state.style[mxConstants.STYLE_ROTATION] || '0'));

				if (this.rotationShape.rotation !== deg)
				{
					// mxShape.redraw resets node visibility to 'visible', which
					// would undo the hidden state the base redraw set from
					// isRotationHandleVisible (e.g. labelAutoRotate or table
					// cells that are also rotated), so preserve it across redraw.
					var vis = this.rotationShape.node.style.visibility;
					this.rotationShape.rotation = deg;
					this.rotationShape.redraw();
					this.rotationShape.node.style.visibility = vis;
				}
			}

			// Shows connect handle only if one vertex is selected
			// Must be after base redrawHandles to override sizer visibility
			if (this.connectShape != null && this.connectShape.node != null)
			{
				this.connectShape.node.setAttribute('title', mxResources.get('plusTooltip'));

				var showConnect = this.moveHandles == null &&
					this.graph.getSelectionCount() == 1 &&
					(this.index == null || this.index == mxEvent.CONNECT_HANDLE) &&
					!this.graph.isEditing() && this.handlesVisible &&
					this.isHandlesVisible() && this.isConnectHandleVisible();
				this.connectShape.node.style.display = showConnect ? '' : 'none';
				this.connectShape.node.style.visibility = showConnect ? '' : 'hidden';

				if (showConnect)
				{
					var alpha = mxUtils.toRadians((this.currentAlpha != null) ?
						this.currentAlpha : this.state.style[mxConstants.STYLE_ROTATION] || '0');
					var cos = Math.cos(alpha);
					var sin = Math.sin(alpha);
					var ct = new mxPoint(this.state.getCenterX(), this.state.getCenterY());
					var pt = mxUtils.getRotatedPoint(this.getConnectHandlePosition(), cos, sin, ct);
					this.moveSizerTo(this.connectShape, pt.x, pt.y);
				}
			}

			if (this.state != null && this.linkHint != null)
			{
				var c = new mxPoint(this.state.getCenterX(), this.state.getCenterY());
				var tmp = new mxRectangle(this.state.x, this.state.y - 22, this.state.width + 24, this.state.height + 22);
				var bb = mxUtils.getBoundingBox(tmp, this.state.style[mxConstants.STYLE_ROTATION] || '0', c);
				var rs = (bb != null) ? mxUtils.getBoundingBox(this.state,
					this.state.style[mxConstants.STYLE_ROTATION] || '0') : this.state;
				var tb = (this.state.text != null) ? this.state.text.boundingBox : null;
				
				if (bb == null)
				{
					bb = this.state;
				}
				
				var b = bb.y + bb.height;
				
				if (tb != null)
				{
					b = Math.max(b, tb.y + tb.height);
				}
				
				this.linkHint.style.left = (rs.x + rs.width / 2) + 'px';
				this.linkHint.style.top = Math.round(b + this.verticalOffset / 2 + Editor.hintOffset) + 'px';
				this.linkHint.style.display = (this.graph.getSelectionCount() > 1) ? 'none' : '';
			}
		};
		
		// Rotates the dashed selection border to follow auto-rotated labels.
		// drawPreview repaints the border on both the normal redraw and the
		// live-preview drag (where redrawHandles is skipped via redraw(true)),
		// so setting the rotation here keeps the outline aligned with the
		// label as it is dragged along the edge. Falls back to the static
		// rotation style when auto rotation is off so the border snaps back.
		var vertexHandlerDrawPreview = mxVertexHandler.prototype.drawPreview;
		mxVertexHandler.prototype.drawPreview = function()
		{
			if (this.selectionBorder != null)
			{
				var autoRotation = Graph.getLabelAutoRotation(this.state);
				this.selectionBorder.rotation = (autoRotation != null) ? autoRotation :
					Number(this.state.style[mxConstants.STYLE_ROTATION] || '0');
			}

			vertexHandlerDrawPreview.apply(this, arguments);
		};

		// Destroys special handles
		var vertexHandlerDestroy = mxVertexHandler.prototype.destroy;
		mxVertexHandler.prototype.destroy = function()
		{
			vertexHandlerDestroy.apply(this, arguments);

			this.destroyMoveHandles();
			this.destroyCornerHandles();
			
			if (this.linkHint != null)
			{
				if (this.linkHint.parentNode != null)
				{
					this.linkHint.parentNode.removeChild(this.linkHint);
				}
				
				this.linkHint = null;
			}

			if  (this.changeHandler != null)
			{
				this.graph.getSelectionModel().removeListener(this.changeHandler);
				this.graph.getModel().removeListener(this.changeHandler);
				this.changeHandler = null;
			}
			
			if  (this.editingHandler != null)
			{
				this.graph.removeListener(this.editingHandler);
				this.editingHandler = null;
			}
		};
		
		var edgeHandlerRedrawHandles = mxEdgeHandler.prototype.redrawHandles;
		mxEdgeHandler.prototype.redrawHandles = function()
		{
			// Workaround for special case where handler
			// is reset before this which leads to a NPE
			if (this.marker != null)
			{
				edgeHandlerRedrawHandles.apply(this);
		
				if (this.state != null && this.linkHint != null)
				{
					var b = this.state;
					
					if (this.state.text != null && this.state.text.bounds != null)
					{
						b = new mxRectangle(b.x, b.y, b.width, b.height);
						b.add(this.state.text.bounds);
					}
					
					this.linkHint.style.left = (b.x + b.width / 2) + 'px';
					this.linkHint.style.top = Math.round(b.y + b.height + Editor.hintOffset) + 'px';
					this.linkHint.style.display = (this.graph.getSelectionCount() > 1) ? 'none' : '';
				}
			}
		};
	
		var edgeHandlerReset = mxEdgeHandler.prototype.reset;
		mxEdgeHandler.prototype.reset = function()
		{
			edgeHandlerReset.apply(this, arguments);
			
			if (this.linkHint != null)
			{
				this.linkHint.style.visibility = '';
			}
		};
		
		var edgeHandlerDestroy = mxEdgeHandler.prototype.destroy;
		mxEdgeHandler.prototype.destroy = function()
		{
			edgeHandlerDestroy.apply(this, arguments);
			
			if (this.linkHint != null)
			{
				this.linkHint.parentNode.removeChild(this.linkHint);
				this.linkHint = null;
			}
	
			if  (this.changeHandler != null)
			{
				this.graph.getModel().removeListener(this.changeHandler);
				this.graph.getSelectionModel().removeListener(this.changeHandler);
				this.changeHandler = null;
			}
		};
	})();
}
