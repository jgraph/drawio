/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
var mxEvent =
{

	/**
	 * Class: mxEvent
	 * 
	 * Cross-browser DOM event support. For internal event handling,
	 * <mxEventSource> and the graph event dispatch loop in <mxGraph> are used.
	 * 
	 * Memory Leaks:
	 * 
	 * Use this class for adding and removing listeners to/from DOM nodes. The
	 * <removeAllListeners> function is provided to remove all listeners that
	 * have been added using <addListener>. The function should be invoked when
	 * the last reference is removed in the JavaScript code, typically when the
	 * referenced DOM node is removed from the DOM.
	 *
	 * Function: addListener
	 * 
	 * Binds the function to the specified event on the given element. Use
	 * <mxUtils.bind> in order to bind the "this" keyword inside the function
	 * to a given execution scope.
	 */
	addListener: function()
	{
		var updateListenerList = function(element, eventName, funct)
		{
			if (element.mxListenerList == null)
			{
				element.mxListenerList = [];
			}
			
			var entry = {name: eventName, f: funct};
			element.mxListenerList.push(entry);
		};
		
		if (window.addEventListener)
		{
			// Checks if passive event listeners are supported
			// see https://github.com/Modernizr/Modernizr/issues/1894
			var supportsPassive = false;
			
			try
			{
				document.addEventListener('test', function() {}, Object.defineProperty &&
					Object.defineProperty({}, 'passive', {get: function()
					{supportsPassive = true;}}));
			}
			catch (e)
			{
				// ignore
			}
			
			return function(element, eventName, funct)
			{
				element.addEventListener(eventName, funct,
					(supportsPassive) ?
					{passive: false} : false);
				updateListenerList(element, eventName, funct);
			};
		}
		else
		{
			return function(element, eventName, funct)
			{
				element.attachEvent('on' + eventName, funct);
				updateListenerList(element, eventName, funct);				
			};
		}
	}(),

	/**
	 * Function: removeListener
	 *
	 * Removes the specified listener from the given element.
	 */
	removeListener: function()
	{
		var updateListener = function(element, eventName, funct)
		{
			if (element.mxListenerList != null)
			{
				var listenerCount = element.mxListenerList.length;
				
				for (var i = 0; i < listenerCount; i++)
				{
					var entry = element.mxListenerList[i];
					
					if (entry.f == funct)
					{
						element.mxListenerList.splice(i, 1);
						break;
					}
				}
				
				if (element.mxListenerList.length == 0)
				{
					element.mxListenerList = null;
				}
			}
		};
		
		if (window.removeEventListener)
		{
			return function(element, eventName, funct)
			{
				element.removeEventListener(eventName, funct, false);
				updateListener(element, eventName, funct);
			};
		}
		else
		{
			return function(element, eventName, funct)
			{
				element.detachEvent('on' + eventName, funct);
				updateListener(element, eventName, funct);
			};
		}
	}(),

	/**
	 * Function: removeAllListeners
	 * 
	 * Removes all listeners from the given element.
	 */
	removeAllListeners: function(element)
	{
		var list = element.mxListenerList;

		if (list != null)
		{
			while (list.length > 0)
			{
				var entry = list[0];
				mxEvent.removeListener(element, entry.name, entry.f);
			}
		}
	},
	
	/**
	 * Function: addGestureListeners
	 * 
	 * Adds the given listeners for touch, mouse and/or pointer events. If
	 * <mxClient.IS_POINTER> is true then pointer events will be registered,
	 * else the respective mouse events will be registered. If <mxClient.IS_POINTER>
	 * is false and <mxClient.IS_TOUCH> is true then the respective touch events
	 * will be registered as well as the mouse events.
	 */
	addGestureListeners: function(node, startListener, moveListener, endListener)
	{
		if (startListener != null)
		{
			mxEvent.addListener(node, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', startListener);
		}
		
		if (moveListener != null)
		{
			mxEvent.addListener(node, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', moveListener);
		}
		
		if (endListener != null)
		{
			mxEvent.addListener(node, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', endListener);
		}
		
		if (!mxClient.IS_POINTER && mxClient.IS_TOUCH)
		{
			if (startListener != null)
			{
				mxEvent.addListener(node, 'touchstart', startListener);
			}
			
			if (moveListener != null)
			{
				mxEvent.addListener(node, 'touchmove', moveListener);
			}
			
			if (endListener != null)
			{
				mxEvent.addListener(node, 'touchend', endListener);
			}
		}
	},
	
	/**
	 * Function: removeGestureListeners
	 * 
	 * Removes the given listeners from mousedown, mousemove, mouseup and the
	 * respective touch events if <mxClient.IS_TOUCH> is true.
	 */
	removeGestureListeners: function(node, startListener, moveListener, endListener)
	{
		if (startListener != null)
		{
			mxEvent.removeListener(node, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', startListener);
		}
		
		if (moveListener != null)
		{
			mxEvent.removeListener(node, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', moveListener);
		}
		
		if (endListener != null)
		{
			mxEvent.removeListener(node, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', endListener);
		}
		
		if (!mxClient.IS_POINTER && mxClient.IS_TOUCH)
		{
			if (startListener != null)
			{
				mxEvent.removeListener(node, 'touchstart', startListener);
			}
			
			if (moveListener != null)
			{
				mxEvent.removeListener(node, 'touchmove', moveListener);
			}
			
			if (endListener != null)
			{
				mxEvent.removeListener(node, 'touchend', endListener);
			}
		}
	},
	
	/**
	 * Function: redirectMouseEvents
	 *
	 * Redirects the mouse events from the given DOM node to the graph dispatch
	 * loop using the event and given state as event arguments. State can
	 * either be an instance of <mxCellState> or a function that returns an
	 * <mxCellState>. The down, move, up and dblClick arguments are optional
	 * functions that take the trigger event as arguments and replace the
	 * default behaviour.
	 */
	redirectMouseEvents: function(node, graph, state, down, move, up, dblClick)
	{
		var getState = function(evt)
		{
			return (typeof(state) == 'function') ? state(evt) : state;
		};
		
		mxEvent.addGestureListeners(node, function (evt)
		{
			if (down != null)
			{
				down(evt);
			}
			else if (!mxEvent.isConsumed(evt))
			{
				graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, getState(evt)));
			}
		},
		function (evt)
		{
			if (move != null)
			{
				move(evt);
			}
			else if (!mxEvent.isConsumed(evt))
			{
				graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, getState(evt)));
			}
		},
		function (evt)
		{
			if (up != null)
			{
				up(evt);
			}
			else if (!mxEvent.isConsumed(evt))
			{
				graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, getState(evt)));
			}
		});

		mxEvent.addListener(node, 'dblclick', function (evt)
		{
			if (dblClick != null)
			{
				dblClick(evt);
			}
			else if (!mxEvent.isConsumed(evt))
			{
				var tmp = getState(evt);
				graph.dblClick(evt, (tmp != null) ? tmp.cell : null);
			}
		});
	},

	/**
	 * Function: release
	 * 
	 * Removes the known listeners from the given DOM node and its descendants.
	 * 
	 * Parameters:
	 * 
	 * element - DOM node to remove the listeners from.
	 */
	release: function(element)
	{
		try
		{
			if (element != null)
			{
				mxEvent.removeAllListeners(element);
				
				var children = element.childNodes;
				
				if (children != null)
				{
			        var childCount = children.length;
			        
			        for (var i = 0; i < childCount; i += 1)
			        {
			        	mxEvent.release(children[i]);
			        }
			    }
			}
		}
		catch (e)
		{
			// ignores errors as this is typically called in cleanup code
		}
	},

	/**
	 * Function: addMouseWheelListener
	 * 
	 * Installs the given function as a handler for mouse wheel events. The
	 * function has two arguments: the mouse event and a boolean that specifies
	 * if the wheel was moved up or down.
	 * 
	 * This has been tested with IE 6 and 7, Firefox (all versions), Opera and
	 * Safari. It does currently not work on Safari for Mac.
	 * 
	 * Example:
	 * 
	 * (code)
	 * mxEvent.addMouseWheelListener(function (evt, up, pinch)
	 * {
	 *   mxLog.show();
	 *   mxLog.debug('mouseWheel: up='+up);
	 * });
	 *(end)
	 * 
	 * Parameters:
	 * 
	 * funct - Handler function that takes the event argument, a boolean argument
	 * for the mousewheel direction and a boolean to specify if the underlying
	 * event was a pinch gesture on a touch device.
	 * target - Target for installing the listener in Google Chrome. See 
	 * https://www.chromestatus.com/features/6662647093133312.
	 */
	addMouseWheelListener: function(funct, target)
	{
		if (funct != null)
		{
			var wheelHandler = function(evt)
			{
				// IE does not give an event object but the
				// global event object is the mousewheel event
				// at this point in time.
				if (evt == null)
				{
					evt = window.event;
				}
			
				//To prevent window zoom on trackpad pinch
				if (evt.ctrlKey) 
				{
					evt.preventDefault();
				}

				// Handles the event using the given function
				if (Math.abs(evt.deltaX) > 0.5 || Math.abs(evt.deltaY) > 0.5)
				{
					funct(evt, (evt.deltaY == 0) ?  -evt.deltaX > 0 : -evt.deltaY > 0);
				}
			};
	
			target = target != null ? target : window;
					
			if (mxClient.IS_SF && !mxClient.IS_TOUCH)
			{
				var scale = 1;
				
				mxEvent.addListener(target, 'gesturestart', function(evt)
				{
					mxEvent.consume(evt);
					scale = 1;
				});
				
				mxEvent.addListener(target, 'gesturechange', function(evt)
				{
					mxEvent.consume(evt);
					var diff = scale - evt.scale;
					
					if (Math.abs(diff) > 0.2)
					{
						funct(evt, diff < 0, true);
						scale = evt.scale;
					}
				});

				mxEvent.addListener(target, 'gestureend', function(evt)
				{
					mxEvent.consume(evt);
				});
			}
			else
			{
				var evtCache = [];
				var dx0 = 0;
				var dy0 = 0;
				
				// Adds basic listeners for graph event dispatching
				mxEvent.addGestureListeners(target, mxUtils.bind(this, function(evt)
				{
					if (!mxEvent.isMouseEvent(evt) && evt.pointerId != null)
					{
						evtCache.push(evt);
					}
				}),
				mxUtils.bind(this, function(evt)
				{
					if (!mxEvent.isMouseEvent(evt) && evtCache.length == 2)
					{
						// Find this event in the cache and update its record with this event
						for (var i = 0; i < evtCache.length; i++)
						{
							if (evt.pointerId == evtCache[i].pointerId)
							{
								evtCache[i] = evt;
								break;
							}
						}
						
					   	// Calculate the distance between the two pointers
						var dx = Math.abs(evtCache[0].clientX - evtCache[1].clientX);
						var dy = Math.abs(evtCache[0].clientY - evtCache[1].clientY);
						var tx = Math.abs(dx - dx0);
						var ty = Math.abs(dy - dy0);
					
						if (tx > mxEvent.PINCH_THRESHOLD || ty > mxEvent.PINCH_THRESHOLD)
						{
							var cx = evtCache[0].clientX + (evtCache[1].clientX - evtCache[0].clientX) / 2;
							var cy = evtCache[0].clientY + (evtCache[1].clientY - evtCache[0].clientY) / 2;
							
							funct(evtCache[0], (tx > ty) ? dx > dx0 : dy > dy0, true, cx, cy);
						
						   	// Cache the distance for the next move event 
							dx0 = dx;
							dy0 = dy;
						}
					}
				}),
				mxUtils.bind(this, function(evt)
				{
					evtCache = [];
					dx0 = 0;
					dy0 = 0;
				}));
			}
			
			mxEvent.addListener(target, 'wheel', wheelHandler);
		}
	},
	
	/**
	 * Function: disableContextMenu
	 *
	 * Disables the context menu for the given element.
	 */
	disableContextMenu: function(element)
	{
		mxEvent.addListener(element, 'contextmenu', function(evt)
		{
			if (evt.preventDefault)
			{
				evt.preventDefault();
			}
			
			return false;
		});
	},
	
	/**
	 * Function: getSource
	 * 
	 * Returns the event's target or srcElement depending on the browser.
	 */
	getSource: function(evt)
	{
		return (evt.srcElement != null) ? evt.srcElement : evt.target;
	},

	/**
	 * Function: isConsumed
	 * 
	 * Returns true if the event has been consumed using <consume>.
	 */
	isConsumed: function(evt)
	{
		return evt.isConsumed != null && evt.isConsumed;
	},

	/**
	 * Function: isTouchEvent
	 * 
	 * Returns true if the event was generated using a touch device (not a pen or mouse).
	 */
	isTouchEvent: function(evt)
	{
		return (evt.pointerType != null) ? (evt.pointerType == 'touch' || evt.pointerType ===
			evt.MSPOINTER_TYPE_TOUCH) : ((evt.mozInputSource != null) ?
					evt.mozInputSource == 5 : evt.type.indexOf('touch') == 0);
	},

	/**
	 * Function: isPenEvent
	 * 
	 * Returns true if the event was generated using a pen (not a touch device or mouse).
	 */
	isPenEvent: function(evt)
	{
		return (evt.pointerType != null) ? (evt.pointerType == 'pen' || evt.pointerType ===
			evt.MSPOINTER_TYPE_PEN) : ((evt.mozInputSource != null) ?
					evt.mozInputSource == 2 : evt.type.indexOf('pen') == 0);
	},

	/**
	 * Function: isMultiTouchEvent
	 * 
	 * Returns true if the event was generated using a touch device (not a pen or mouse).
	 */
	isMultiTouchEvent: function(evt)
	{
		return (evt.type != null && evt.type.indexOf('touch') == 0 && evt.touches != null && evt.touches.length > 1);
	},

	/**
	 * Function: isMouseEvent
	 * 
	 * Returns true if the event was generated using a mouse (not a pen or touch device).
	 */
	isMouseEvent: function(evt)
	{
		// Workaround for mixed event types during one gesture in Chrome on Linux
		if (!mxClient.IS_ANDROID && mxClient.IS_LINUX && mxClient.IS_GC)
		{
			return true;
		}
		else
		{
			return (evt.pointerType != null) ? (evt.pointerType == 'mouse' || evt.pointerType ===
				evt.MSPOINTER_TYPE_MOUSE) : ((evt.mozInputSource != null) ?
					evt.mozInputSource == 1 : evt.type.indexOf('mouse') == 0);
		}
	},
	
	/**
	 * Function: isLeftMouseButton
	 * 
	 * Returns true if the left mouse button is pressed for the given event.
	 * To check if a button is pressed during a mouseMove you should use the
	 * <mxGraph.isMouseDown> property. Note that this returns true in Firefox
	 * for control+left-click on the Mac.
	 */
	isLeftMouseButton: function(evt)
	{
		// Special case for mousemove and mousedown we check the buttons
		// if it exists because which is 0 even if no button is pressed
		if ('buttons' in evt && (evt.type == 'mousedown' || evt.type == 'mousemove'))
		{
			return evt.buttons == 1;
		}
		else if ('which' in evt)
		{
	        return evt.which === 1;
	    }
		else
		{
	        return evt.button === 1;
	    }
	},
	
	/**
	 * Function: isMiddleMouseButton
	 * 
	 * Returns true if the middle mouse button is pressed for the given event.
	 * To check if a button is pressed during a mouseMove you should use the
	 * <mxGraph.isMouseDown> property.
	 */
	isMiddleMouseButton: function(evt)
	{
		if ('which' in evt)
		{
	        return evt.which === 2;
	    }
		else
		{
	        return evt.button === 4;
	    }
	},
	
	/**
	 * Function: isRightMouseButton
	 * 
	 * Returns true if the right mouse button was pressed. Note that this
	 * button might not be available on some systems. For handling a popup
	 * trigger <isPopupTrigger> should be used.
	 */
	isRightMouseButton: function(evt)
	{
		if ('which' in evt)
		{
	        return evt.which === 3;
	    }
		else
		{
	        return evt.button === 2;
	    }
	},

	/**
	 * Function: isPopupTrigger
	 * 
	 * Returns true if the event is a popup trigger. This implementation
	 * returns true if the right button or the left button and control was
	 * pressed on a Mac.
	 */
	isPopupTrigger: function(evt)
	{
		return mxEvent.isRightMouseButton(evt) || (mxClient.IS_MAC && mxEvent.isControlDown(evt) &&
			!mxEvent.isShiftDown(evt) && !mxEvent.isMetaDown(evt) && !mxEvent.isAltDown(evt));
	},

	/**
	 * Function: isShiftDown
	 * 
	 * Returns true if the shift key is pressed for the given event.
	 */
	isShiftDown: function(evt)
	{
		return (evt != null) ? evt.shiftKey : false;
	},

	/**
	 * Function: isAltDown
	 * 
	 * Returns true if the alt key is pressed for the given event.
	 */
	isAltDown: function(evt)
	{
		return (evt != null) ? evt.altKey : false;
	},

	/**
	 * Function: isControlDown
	 * 
	 * Returns true if the control key is pressed for the given event.
	 */
	isControlDown: function(evt)
	{
		return (evt != null) ? evt.ctrlKey : false;
	},

	/**
	 * Function: isMetaDown
	 * 
	 * Returns true if the meta key is pressed for the given event.
	 */
	isMetaDown: function(evt)
	{
		return (evt != null) ? evt.metaKey : false;
	},

	/**
	 * Function: getMainEvent
	 * 
	 * Returns the touch or mouse event that contains the mouse coordinates.
	 */
	getMainEvent: function(e)
	{
		if ((e.type == 'touchstart' || e.type == 'touchmove') && e.touches != null && e.touches[0] != null)
		{
			e = e.touches[0];
		}
		else if (e.type == 'touchend' && e.changedTouches != null && e.changedTouches[0] != null)
		{
			e = e.changedTouches[0];
		}
		
		return e;
	},
	
	/**
	 * Function: getClientX
	 * 
	 * Returns true if the meta key is pressed for the given event.
	 */
	getClientX: function(e)
	{
		return mxEvent.getMainEvent(e).clientX;
	},

	/**
	 * Function: getClientY
	 * 
	 * Returns true if the meta key is pressed for the given event.
	 */
	getClientY: function(e)
	{
		return mxEvent.getMainEvent(e).clientY;
	},

	/**
	 * Function: consume
	 * 
	 * Consumes the given event.
	 * 
	 * Parameters:
	 * 
	 * evt - Native event to be consumed.
	 * preventDefault - Optional boolean to prevent the default for the event.
	 * Default is true.
	 * stopPropagation - Option boolean to stop event propagation. Default is
	 * true.
	 */
	consume: function(evt, preventDefault, stopPropagation)
	{
		preventDefault = (preventDefault != null) ? preventDefault : true;
		stopPropagation = (stopPropagation != null) ? stopPropagation : true;
		
		if (preventDefault)
		{
			if (evt.preventDefault)
			{
				if (stopPropagation)
				{
					evt.stopPropagation();
				}
				
				evt.preventDefault();
			}
			else if (stopPropagation)
			{
				evt.cancelBubble = true;
			}
		}

		// Opera
		evt.isConsumed = true;

		// Other browsers
		if (!evt.preventDefault)
		{
			evt.returnValue = false;
		}
	},
	
	//
	// Special handles in mouse events
	//
	
	/**
	 * Variable: LABEL_HANDLE
	 * 
	 * Index for the label handle in an mxMouseEvent. This should be a negative
	 * value that does not interfere with any possible handle indices. Default
	 * is -1.
	 */
	LABEL_HANDLE: -1,
	
	/**
	 * Variable: ROTATION_HANDLE
	 * 
	 * Index for the rotation handle in an mxMouseEvent. This should be a
	 * negative value that does not interfere with any possible handle indices.
	 * Default is -2.
	 */
	ROTATION_HANDLE: -2,
	
	/**
	 * Variable: CUSTOM_HANDLE
	 * 
	 * Start index for the custom handles in an mxMouseEvent. This should be a
	 * negative value and is the start index which is decremented for each
	 * custom handle. Default is -100.
	 */
	CUSTOM_HANDLE: -100,
	
	/**
	 * Variable: VIRTUAL_HANDLE
	 * 
	 * Start index for the virtual handles in an mxMouseEvent. This should be a
	 * negative value and is the start index which is decremented for each
	 * virtual handle. Default is -100000. This assumes that there are no more
	 * than VIRTUAL_HANDLE - CUSTOM_HANDLE custom handles.
	 * 
	 */
	VIRTUAL_HANDLE: -100000,
	
	//
	// Event names
	//
	
	/**
	 * Variable: MOUSE_DOWN
	 *
	 * Specifies the event name for mouseDown.
	 */
	MOUSE_DOWN: 'mouseDown',
	
	/**
	 * Variable: MOUSE_MOVE
	 *
	 * Specifies the event name for mouseMove. 
	 */
	MOUSE_MOVE: 'mouseMove',
	
	/**
	 * Variable: MOUSE_UP
	 *
	 * Specifies the event name for mouseUp. 
	 */
	MOUSE_UP: 'mouseUp',

	/**
	 * Variable: ACTIVATE
	 *
	 * Specifies the event name for activate.
	 */
	ACTIVATE: 'activate',

	/**
	 * Variable: RESIZE_START
	 *
	 * Specifies the event name for resizeStart.
	 */
	RESIZE_START: 'resizeStart',

	/**
	 * Variable: RESIZE
	 *
	 * Specifies the event name for resize.
	 */
	RESIZE: 'resize',

	/**
	 * Variable: RESIZE_END
	 *
	 * Specifies the event name for resizeEnd.
	 */
	RESIZE_END: 'resizeEnd',

	/**
	 * Variable: MOVE_START
	 *
	 * Specifies the event name for moveStart.
	 */
	MOVE_START: 'moveStart',

	/**
	 * Variable: MOVE
	 *
	 * Specifies the event name for move.
	 */
	MOVE: 'move',

	/**
	 * Variable: MOVE_END
	 *
	 * Specifies the event name for moveEnd.
	 */
	MOVE_END: 'moveEnd',

	/**
	 * Variable: PAN_START
	 *
	 * Specifies the event name for panStart.
	 */
	PAN_START: 'panStart',

	/**
	 * Variable: PAN
	 *
	 * Specifies the event name for pan.
	 */
	PAN: 'pan',

	/**
	 * Variable: PAN_END
	 *
	 * Specifies the event name for panEnd.
	 */
	PAN_END: 'panEnd',

	/**
	 * Variable: MINIMIZE
	 *
	 * Specifies the event name for minimize.
	 */
	MINIMIZE: 'minimize',

	/**
	 * Variable: NORMALIZE
	 *
	 * Specifies the event name for normalize.
	 */
	NORMALIZE: 'normalize',

	/**
	 * Variable: MAXIMIZE
	 *
	 * Specifies the event name for maximize.
	 */
	MAXIMIZE: 'maximize',

	/**
	 * Variable: HIDE
	 *
	 * Specifies the event name for hide.
	 */
	HIDE: 'hide',

	/**
	 * Variable: SHOW
	 *
	 * Specifies the event name for show.
	 */
	SHOW: 'show',

	/**
	 * Variable: CLOSE
	 *
	 * Specifies the event name for close.
	 */
	CLOSE: 'close',

	/**
	 * Variable: DESTROY
	 *
	 * Specifies the event name for destroy.
	 */
	DESTROY: 'destroy',

	/**
	 * Variable: REFRESH
	 *
	 * Specifies the event name for refresh.
	 */
	REFRESH: 'refresh',

	/**
	 * Variable: SIZE
	 *
	 * Specifies the event name for size.
	 */
	SIZE: 'size',
	
	/**
	 * Variable: SELECT
	 *
	 * Specifies the event name for select.
	 */
	SELECT: 'select',

	/**
	 * Variable: FIRED
	 *
	 * Specifies the event name for fired.
	 */
	FIRED: 'fired',

	/**
	 * Variable: FIRE_MOUSE_EVENT
	 *
	 * Specifies the event name for fireMouseEvent.
	 */
	FIRE_MOUSE_EVENT: 'fireMouseEvent',

	/**
	 * Variable: CONSUME_MOUSE_EVENT
	 *
	 * Specifies the event name for consumeMouseEvent.
	 */
	CONSUME_MOUSE_EVENT: 'consumeMouseEvent',

	/**
	 * Variable: GESTURE
	 *
	 * Specifies the event name for gesture.
	 */
	GESTURE: 'gesture',

	/**
	 * Variable: TAP_AND_HOLD
	 *
	 * Specifies the event name for tapAndHold.
	 */
	TAP_AND_HOLD: 'tapAndHold',

	/**
	 * Variable: GET
	 *
	 * Specifies the event name for get.
	 */
	GET: 'get',

	/**
	 * Variable: RECEIVE
	 *
	 * Specifies the event name for receive.
	 */
	RECEIVE: 'receive',

	/**
	 * Variable: CONNECT
	 *
	 * Specifies the event name for connect.
	 */
	CONNECT: 'connect',

	/**
	 * Variable: DISCONNECT
	 *
	 * Specifies the event name for disconnect.
	 */
	DISCONNECT: 'disconnect',

	/**
	 * Variable: SUSPEND
	 *
	 * Specifies the event name for suspend.
	 */
	SUSPEND: 'suspend',

	/**
	 * Variable: RESUME
	 *
	 * Specifies the event name for suspend.
	 */
	RESUME: 'resume',

	/**
	 * Variable: MARK
	 *
	 * Specifies the event name for mark.
	 */
	MARK: 'mark',

	/**
	 * Variable: ROOT
	 *
	 * Specifies the event name for root.
	 */
	ROOT: 'root',

	/**
	 * Variable: POST
	 *
	 * Specifies the event name for post.
	 */
	POST: 'post',

	/**
	 * Variable: OPEN
	 *
	 * Specifies the event name for open.
	 */
	OPEN: 'open',

	/**
	 * Variable: SAVE
	 *
	 * Specifies the event name for open.
	 */
	SAVE: 'save',

	/**
	 * Variable: BEFORE_ADD_VERTEX
	 *
	 * Specifies the event name for beforeAddVertex.
	 */
	BEFORE_ADD_VERTEX: 'beforeAddVertex',

	/**
	 * Variable: ADD_VERTEX
	 *
	 * Specifies the event name for addVertex.
	 */
	ADD_VERTEX: 'addVertex',

	/**
	 * Variable: AFTER_ADD_VERTEX
	 *
	 * Specifies the event name for afterAddVertex.
	 */
	AFTER_ADD_VERTEX: 'afterAddVertex',

	/**
	 * Variable: DONE
	 *
	 * Specifies the event name for done.
	 */
	DONE: 'done',

	/**
	 * Variable: EXECUTE
	 *
	 * Specifies the event name for execute.
	 */
	EXECUTE: 'execute',

	/**
	 * Variable: EXECUTED
	 *
	 * Specifies the event name for executed.
	 */
	EXECUTED: 'executed',

	/**
	 * Variable: BEGIN_UPDATE
	 *
	 * Specifies the event name for beginUpdate.
	 */
	BEGIN_UPDATE: 'beginUpdate',

	/**
	 * Variable: START_EDIT
	 *
	 * Specifies the event name for startEdit.
	 */
	START_EDIT: 'startEdit',

	/**
	 * Variable: END_UPDATE
	 *
	 * Specifies the event name for endUpdate.
	 */
	END_UPDATE: 'endUpdate',

	/**
	 * Variable: END_EDIT
	 *
	 * Specifies the event name for endEdit.
	 */
	END_EDIT: 'endEdit',

	/**
	 * Variable: BEFORE_UNDO
	 *
	 * Specifies the event name for beforeUndo.
	 */
	BEFORE_UNDO: 'beforeUndo',

	/**
	 * Variable: UNDO
	 *
	 * Specifies the event name for undo.
	 */
	UNDO: 'undo',

	/**
	 * Variable: REDO
	 *
	 * Specifies the event name for redo.
	 */
	REDO: 'redo',

	/**
	 * Variable: CHANGE
	 *
	 * Specifies the event name for change.
	 */
	CHANGE: 'change',

	/**
	 * Variable: NOTIFY
	 *
	 * Specifies the event name for notify.
	 */
	NOTIFY: 'notify',

	/**
	 * Variable: LAYOUT_CELLS
	 *
	 * Specifies the event name for layoutCells.
	 */
	LAYOUT_CELLS: 'layoutCells',

	/**
	 * Variable: CLICK
	 *
	 * Specifies the event name for click.
	 */
	CLICK: 'click',

	/**
	 * Variable: SCALE
	 *
	 * Specifies the event name for scale.
	 */
	SCALE: 'scale',

	/**
	 * Variable: TRANSLATE
	 *
	 * Specifies the event name for translate.
	 */
	TRANSLATE: 'translate',

	/**
	 * Variable: SCALE_AND_TRANSLATE
	 *
	 * Specifies the event name for scaleAndTranslate.
	 */
	SCALE_AND_TRANSLATE: 'scaleAndTranslate',

	/**
	 * Variable: UP
	 *
	 * Specifies the event name for up.
	 */
	UP: 'up',

	/**
	 * Variable: DOWN
	 *
	 * Specifies the event name for down.
	 */
	DOWN: 'down',

	/**
	 * Variable: ADD
	 *
	 * Specifies the event name for add.
	 */
	ADD: 'add',

	/**
	 * Variable: REMOVE
	 *
	 * Specifies the event name for remove.
	 */
	REMOVE: 'remove',
	
	/**
	 * Variable: CLEAR
	 *
	 * Specifies the event name for clear.
	 */
	CLEAR: 'clear',

	/**
	 * Variable: ADD_CELLS
	 *
	 * Specifies the event name for addCells.
	 */
	ADD_CELLS: 'addCells',

	/**
	 * Variable: CELLS_ADDED
	 *
	 * Specifies the event name for cellsAdded.
	 */
	CELLS_ADDED: 'cellsAdded',

	/**
	 * Variable: MOVE_CELLS
	 *
	 * Specifies the event name for moveCells.
	 */
	MOVE_CELLS: 'moveCells',

	/**
	 * Variable: CELLS_MOVED
	 *
	 * Specifies the event name for cellsMoved.
	 */
	CELLS_MOVED: 'cellsMoved',

	/**
	 * Variable: RESIZE_CELLS
	 *
	 * Specifies the event name for resizeCells.
	 */
	RESIZE_CELLS: 'resizeCells',

	/**
	 * Variable: CELLS_RESIZED
	 *
	 * Specifies the event name for cellsResized.
	 */
	CELLS_RESIZED: 'cellsResized',

	/**
	 * Variable: TOGGLE_CELLS
	 *
	 * Specifies the event name for toggleCells.
	 */
	TOGGLE_CELLS: 'toggleCells',

	/**
	 * Variable: CELLS_TOGGLED
	 *
	 * Specifies the event name for cellsToggled.
	 */
	CELLS_TOGGLED: 'cellsToggled',

	/**
	 * Variable: ORDER_CELLS
	 *
	 * Specifies the event name for orderCells.
	 */
	ORDER_CELLS: 'orderCells',

	/**
	 * Variable: CELLS_ORDERED
	 *
	 * Specifies the event name for cellsOrdered.
	 */
	CELLS_ORDERED: 'cellsOrdered',

	/**
	 * Variable: REMOVE_CELLS
	 *
	 * Specifies the event name for removeCells.
	 */
	REMOVE_CELLS: 'removeCells',

	/**
	 * Variable: CELLS_REMOVED
	 *
	 * Specifies the event name for cellsRemoved.
	 */
	CELLS_REMOVED: 'cellsRemoved',

	/**
	 * Variable: GROUP_CELLS
	 *
	 * Specifies the event name for groupCells.
	 */
	GROUP_CELLS: 'groupCells',

	/**
	 * Variable: UNGROUP_CELLS
	 *
	 * Specifies the event name for ungroupCells.
	 */
	UNGROUP_CELLS: 'ungroupCells',

	/**
	 * Variable: REMOVE_CELLS_FROM_PARENT
	 *
	 * Specifies the event name for removeCellsFromParent.
	 */
	REMOVE_CELLS_FROM_PARENT: 'removeCellsFromParent',

	/**
	 * Variable: FOLD_CELLS
	 *
	 * Specifies the event name for foldCells.
	 */
	FOLD_CELLS: 'foldCells',

	/**
	 * Variable: CELLS_FOLDED
	 *
	 * Specifies the event name for cellsFolded.
	 */
	CELLS_FOLDED: 'cellsFolded',

	/**
	 * Variable: ALIGN_CELLS
	 *
	 * Specifies the event name for alignCells.
	 */
	ALIGN_CELLS: 'alignCells',

	/**
	 * Variable: LABEL_CHANGED
	 *
	 * Specifies the event name for labelChanged.
	 */
	LABEL_CHANGED: 'labelChanged',

	/**
	 * Variable: CONNECT_CELL
	 *
	 * Specifies the event name for connectCell.
	 */
	CONNECT_CELL: 'connectCell',

	/**
	 * Variable: CELL_CONNECTED
	 *
	 * Specifies the event name for cellConnected.
	 */
	CELL_CONNECTED: 'cellConnected',

	/**
	 * Variable: SPLIT_EDGE
	 *
	 * Specifies the event name for splitEdge.
	 */
	SPLIT_EDGE: 'splitEdge',

	/**
	 * Variable: FLIP_EDGE
	 *
	 * Specifies the event name for flipEdge.
	 */
	FLIP_EDGE: 'flipEdge',

	/**
	 * Variable: START_EDITING
	 *
	 * Specifies the event name for startEditing.
	 */
	START_EDITING: 'startEditing',

	/**
	 * Variable: EDITING_STARTED
	 *
	 * Specifies the event name for editingStarted.
	 */
	EDITING_STARTED: 'editingStarted',

	/**
	 * Variable: EDITING_STOPPED
	 *
	 * Specifies the event name for editingStopped.
	 */
	EDITING_STOPPED: 'editingStopped',

	/**
	 * Variable: ADD_OVERLAY
	 *
	 * Specifies the event name for addOverlay.
	 */
	ADD_OVERLAY: 'addOverlay',

	/**
	 * Variable: REMOVE_OVERLAY
	 *
	 * Specifies the event name for removeOverlay.
	 */
	REMOVE_OVERLAY: 'removeOverlay',

	/**
	 * Variable: UPDATE_CELL_SIZE
	 *
	 * Specifies the event name for updateCellSize.
	 */
	UPDATE_CELL_SIZE: 'updateCellSize',

	/**
	 * Variable: ESCAPE
	 *
	 * Specifies the event name for escape.
	 */
	ESCAPE: 'escape',

	/**
	 * Variable: DOUBLE_CLICK
	 *
	 * Specifies the event name for doubleClick.
	 */
	DOUBLE_CLICK: 'doubleClick',

	/**
	 * Variable: START
	 *
	 * Specifies the event name for start.
	 */
	START: 'start',

	/**
	 * Variable: RESET
	 *
	 * Specifies the event name for reset.
	 */
	RESET: 'reset',

	/**
	 * Variable: PINCH_THRESHOLD
	 *
	 * Threshold for pinch gestures to fire a mouse wheel event.
	 * Default value is 10.
	 */
	PINCH_THRESHOLD: 10

};
