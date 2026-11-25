/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Touch in Simple as Fusion has it (batch 20 of the plan of 13 November 2026
 * for Classic and Simple, on the panel host of batch 14; the driver, 20
 * November 2026), behind the row touchSupport of Editor.featureDefaults: on in
 * Simple in the web app, off in Classic, Sketch, Minimal and Atlas unless the
 * URL or the configuration switches it on, off and fixed in Fusion, whose own
 * code (installMenuTouches, stopTapThrough and installShapesTouches in
 * SimpleModern.js, SimpleUi.installSheetDrag) does the same for its look.
 *
 * - Menus: a touch that starts on an item of a menu scrolls the menu when the
 *   finger moves, and only a tap runs the item or opens its submenu. The rows
 *   of mxPopupMenu open their submenu when the finger touches them and run
 *   when it lifts, also after a move, and on iOS, where mxClient.IS_POINTER
 *   is false, their touchstart stopped the scroll of the menu (a swipe over
 *   the … menu of an iPhone opened Page Setup).
 * - The tap that closes a menu: the click that the browser dispatches after
 *   it goes to what was under the row (Android) and is stopped.
 * - Shapes: a swipe over the shapes of the Shapes panel scrolls them, a press
 *   and hold or a move across the scroll direction drags a shape, a tap adds
 *   it as before. The drag source of a shape took the press (iOS) and the
 *   palettes had touch-action: none (Android), so every swipe dragged.
 * - The sheet of the panels on phones (PanelHost.js) has a grabber and
 *   follows the finger on the grabber and the head: the release snaps it to
 *   half or full height or closes it, by its place and the speed of the
 *   release; a tap on the grabber toggles the full height.
 * - With a coarse pointer the buttons of the top bar and of the head of the
 *   panels reach the full height of their bar, the head of the panels and
 *   the divider of the right panel are wider to touch (grapheditor.css,
 *   .geTouchSupport, the drawn sizes and the places of the buttons stay).
 *
 * Mouse and pen keep their behaviour everywhere.
 */
(function()
{
	/**
	 * The distance in px that a finger moves before it is no tap (the
	 * tolerance of Fusion).
	 */
	EditorUi.touchSlop = 8;

	/**
	 * The time in ms of a press and hold that drags a shape.
	 */
	EditorUi.touchHoldDelay = 400;

	/**
	 * A touch within this time in ms after a scroll stops a fling and taps
	 * nothing.
	 */
	EditorUi.touchScrollDelay = 150;

	/**
	 * The speed in px per ms of a release that moves the sheet of the panels
	 * to its next height in the direction of the move.
	 */
	EditorUi.touchFlingVelocity = 0.5;

	/**
	 * The time in ms of the snap of the sheet of the panels (the transition
	 * in grapheditor.css, none with reduced motion).
	 */
	EditorUi.sidePanelSnapDuration = 200;

	/**
	 * Returns true if the touch support of this file is on (the row
	 * touchSupport of Editor.featureDefaults, read at call time as the theme
	 * can change; never in Fusion, whose row is fixed).
	 */
	Editor.isTouchSupportOn = function()
	{
		return Editor.isFeatureEnabled('touchSupport');
	};

	/**
	 * Returns the point of the given mouse, pointer or touch event.
	 */
	var getPoint = function(evt)
	{
		var t = (evt.touches != null && evt.touches.length > 0) ? evt.touches[0] :
			((evt.changedTouches != null && evt.changedTouches.length > 0) ?
			evt.changedTouches[0] : evt);

		return {x: t.clientX, y: t.clientY};
	};

	/**
	 * Returns true if the given event is of a finger: a pointer event of type
	 * touch or a touch event (pointer events come with touch events).
	 */
	var isTouch = function(evt)
	{
		return (evt.pointerType != null) ? evt.pointerType == 'touch' : evt.touches != null;
	};

	/**
	 * Returns true if the given element is in the document.
	 */
	var isConnected = function(elt)
	{
		return elt != null && elt.ownerDocument != null &&
			elt.ownerDocument.documentElement.contains(elt);
	};

	/**
	 * The last lift of a finger (see stopTapThrough): its point, its time and
	 * if its click was dispatched.
	 */
	var lastTouchUp = null;

	EditorUi.installTouchUps = function()
	{
		if (!EditorUi.touchUpsInstalled)
		{
			EditorUi.touchUpsInstalled = true;

			window.addEventListener('pointerup', function(evt)
			{
				lastTouchUp = (evt.pointerType == 'touch' && Editor.isTouchSupportOn()) ?
					{x: evt.clientX, y: evt.clientY, time: Date.now(), clicked: false} : null;
			}, true);

			window.addEventListener('click', function()
			{
				if (lastTouchUp != null)
				{
					lastTouchUp.clicked = true;
				}
			}, true);
		}
	};

	/**
	 * A tap on an item closes the menu when the finger lifts, and the click of
	 * the tap that the browser dispatches after it went to what was under the
	 * item (the canvas, the page tabs or a button of the top bar). One click
	 * within 400 ms near the point of the tap is stopped, with the mouse
	 * events of the tap. The next press of a finger, the mouse or a pen
	 * starts a gesture of its own and ends the guard (eg. after a tap whose
	 * touchend was cancelled, which has no click).
	 */
	EditorUi.stopTapThrough = function()
	{
		var touch = lastTouchUp;
		lastTouchUp = null;

		if (touch != null && !touch.clicked && Date.now() - touch.time < 100)
		{
			var thread = null;

			var handler = function(evt)
			{
				if (Math.abs(evt.clientX - touch.x) < 24 && Math.abs(evt.clientY - touch.y) < 24)
				{
					evt.preventDefault();
					evt.stopPropagation();

					if (evt.type == 'click')
					{
						remove();
					}
				}
			};

			var remove = function()
			{
				window.clearTimeout(thread);
				window.removeEventListener('mousedown', handler, true);
				window.removeEventListener('mouseup', handler, true);
				window.removeEventListener('click', handler, true);
				window.removeEventListener('pointerdown', remove, true);
				window.removeEventListener('touchstart', remove, true);
			};

			window.addEventListener('mousedown', handler, true);
			window.addEventListener('mouseup', handler, true);
			window.addEventListener('click', handler, true);
			window.addEventListener('pointerdown', remove, true);
			window.addEventListener('touchstart', remove, {capture: true, passive: true});
			thread = window.setTimeout(remove, 400);
		}
	};

	/**
	 * Items of menus keep their menu, the menu or item they are in and their
	 * function for taps (see installMenuTouches) while touch is on.
	 */
	var mxPopupMenuAddItem = mxPopupMenu.prototype.addItem;

	mxPopupMenu.prototype.addItem = function(title, image, funct, parent)
	{
		var tr = mxPopupMenuAddItem.apply(this, arguments);

		if (tr != null && Editor.isTouchSupportOn())
		{
			tr.touchMenuTap = {menu: this, parent: parent || this, funct: funct};
		}

		return tr;
	};

	/**
	 * The listeners of the menus are added with the first menu while touch is
	 * on.
	 */
	var mxPopupMenuPopup = mxPopupMenu.prototype.popup;

	mxPopupMenu.prototype.popup = function()
	{
		if (Editor.isTouchSupportOn())
		{
			EditorUi.installTouchUps();
			EditorUi.installMenuTouches();
		}

		mxPopupMenuPopup.apply(this, arguments);
	};

	/**
	 * A menu that closes with a tap keeps the click of the tap.
	 */
	var mxPopupMenuHideMenu = mxPopupMenu.prototype.hideMenu;

	mxPopupMenu.prototype.hideMenu = function()
	{
		if (this.div != null && this.div.parentNode != null && Editor.isTouchSupportOn())
		{
			EditorUi.stopTapThrough();
		}

		mxPopupMenuHideMenu.apply(this, arguments);
	};

	/**
	 * Runs the item of a menu that was tapped as mxPopupMenu does for a press
	 * and release on it: an item with a submenu opens it, other items close
	 * the menu and run.
	 */
	var tapMenuItem = function(tr, evt)
	{
		var tap = tr.touchMenuTap;
		var menu = tap.menu;
		var parent = tap.parent;

		if (tr.div != null)
		{
			if (parent.activeRow != tr && parent.activeRow != parent)
			{
				if (parent.activeRow != null && parent.activeRow.div != null &&
					parent.activeRow.div.parentNode != null)
				{
					menu.hideSubmenu(parent);
				}

				menu.showSubmenu(parent, tr);
				parent.activeRow = tr;
			}

			if (tap.funct != null)
			{
				tap.funct(evt);
			}
		}
		else
		{
			tr.activate(evt);
		}
	};

	/**
	 * The touch on an item of a menu (see installMenuTouches) and the time of
	 * the last scroll of a menu.
	 */
	var menuTouch = null;
	var menuScrollTime = 0;

	/**
	 * A touch that starts on an item of a menu scrolls the menu if the finger
	 * moves; only a tap runs the item or opens its submenu. The window gets
	 * the touch first (capture), so the listeners of the item do not run for
	 * it. A move of more than touchSlop, a scroll of the menu during the touch
	 * or in the touchScrollDelay before it (a tap that stops a fling) and a
	 * second finger are no tap. Controls in items (buttons, fields), mouse and
	 * pen keep their behaviour. Once per window.
	 */
	EditorUi.installMenuTouches = function()
	{
		if (EditorUi.menuTouchesInstalled)
		{
			return;
		}

		EditorUi.menuTouchesInstalled = true;
		var pointer = mxClient.IS_POINTER;

		var isEventTouch = function(evt)
		{
			return (pointer) ? evt.pointerType == 'touch' : evt.touches != null;
		};

		// The div of the menu that scrolls (the table of its rows has the
		// class too)
		var getMenu = function(elt)
		{
			return (elt != null && elt.closest != null) ? elt.closest('div.mxPopupMenu') : null;
		};

		var start = function(evt)
		{
			// A second finger on a menu is no tap and no item for either: the
			// first touch becomes a moved one and the event is claimed
			if (Editor.isTouchSupportOn() && isEventTouch(evt) && getMenu(evt.target) != null &&
				((evt.touches != null && evt.touches.length > 1) ||
				(pointer && menuTouch != null && menuTouch.pointerId != evt.pointerId)))
			{
				if (menuTouch != null)
				{
					menuTouch.moved = true;
				}

				evt.stopPropagation();

				return;
			}

			menuTouch = null;

			if (!Editor.isTouchSupportOn() || !isEventTouch(evt) ||
				evt.target == null || evt.target.closest == null)
			{
				return;
			}

			var tr = evt.target.closest('tr');
			var scroller = (tr != null) ? getMenu(tr) : null;
			var control = evt.target.closest('button, input, select, textarea, a[href], [contenteditable]');

			if (tr != null && tr.touchMenuTap != null && tr.activate != null &&
				scroller != null && (control == null || !tr.contains(control)))
			{
				var pt = getPoint(evt);
				menuTouch = {row: tr, x: pt.x, y: pt.y, scroller: scroller,
					scrollTop: scroller.scrollTop, pointerId: evt.pointerId,
					moved: Date.now() - menuScrollTime < EditorUi.touchScrollDelay};
				evt.stopPropagation();

				// No mouse events after the touch, as for the item before
				// (preventDefault on touchstart would stop the scroll)
				if (pointer)
				{
					evt.preventDefault();
				}
			}
		};

		var move = function(evt)
		{
			if (menuTouch != null && isEventTouch(evt))
			{
				var pt = getPoint(evt);

				if (Math.abs(pt.x - menuTouch.x) > EditorUi.touchSlop ||
					Math.abs(pt.y - menuTouch.y) > EditorUi.touchSlop ||
					(evt.touches != null && evt.touches.length > 1))
				{
					menuTouch.moved = true;
				}

				evt.stopPropagation();
			}
		};

		var end = function(evt)
		{
			// Only the release of the first pointer ends its touch
			if (pointer && menuTouch != null && evt.pointerId != menuTouch.pointerId)
			{
				if (isEventTouch(evt))
				{
					evt.stopPropagation();
				}

				return;
			}

			var touch = menuTouch;
			menuTouch = null;

			if (touch != null && isEventTouch(evt))
			{
				evt.stopPropagation();

				// No mouse events and no click of the tap
				if (evt.cancelable)
				{
					evt.preventDefault();
				}

				// A menu that scrolled or closed during the touch runs nothing
				if (!touch.moved && touch.scroller.scrollTop == touch.scrollTop &&
					isConnected(touch.row) && isConnected(touch.scroller))
				{
					tapMenuItem(touch.row, evt);
				}
			}
		};

		var cancel = function()
		{
			menuTouch = null;
		};

		window.addEventListener((pointer) ? 'pointerdown' : 'touchstart', start,
			(pointer) ? true : {capture: true, passive: true});
		window.addEventListener((pointer) ? 'pointermove' : 'touchmove', move,
			(pointer) ? true : {capture: true, passive: true});
		window.addEventListener((pointer) ? 'pointerup' : 'touchend', end, true);
		window.addEventListener((pointer) ? 'pointercancel' : 'touchcancel', cancel, true);

		// Scroll events do not bubble but pass the window in the capture phase
		window.addEventListener('scroll', function(evt)
		{
			var elt = evt.target;

			if (elt != null && elt.classList != null && elt.classList.contains('mxPopupMenu'))
			{
				menuScrollTime = Date.now();

				if (menuTouch != null && menuTouch.scroller == elt)
				{
					menuTouch.moved = true;
				}
			}
		}, true);
	};

	/**
	 * Shapes keep their drag source for their touches (see
	 * installShapesTouches).
	 */
	var sidebarCreateDragSource = Sidebar.prototype.createDragSource;

	Sidebar.prototype.createDragSource = function(elt)
	{
		var ds = sidebarCreateDragSource.apply(this, arguments);

		if (elt != null && ds != null)
		{
			elt.touchDragSource = ds;
		}

		return ds;
	};

	/**
	 * A swipe over the shapes of the Shapes panel scrolls them on touch; only
	 * a press and hold (touchHoldDelay) or a move across the scroll direction
	 * (towards the diagram) starts the drag of a shape, and a tap adds the
	 * shape as before. The container gets the touch first (capture), so the
	 * drag source sees none of it until the drag starts, and the palettes let
	 * the browser scroll them (touch-action: pan-y, grapheditor.css). A move
	 * of more than touchSlop along the scroll direction, a scroll of the
	 * shapes and a second finger leave the touch to the scroll. Mouse and pen
	 * keep the drag on the press. Once per container of the sidebar.
	 */
	EditorUi.prototype.installShapesTouches = function()
	{
		var ui = this;
		var container = this.sidebarContainer;

		if (container == null || container.touchShapesInstalled)
		{
			return;
		}

		container.touchShapesInstalled = true;
		var pointer = mxClient.IS_POINTER;
		var touch = null;

		// The nearest ancestor of the given shape that scrolls
		var getScroller = function(elt)
		{
			while (elt != null && elt != container.parentNode)
			{
				if (elt.scrollHeight > elt.clientHeight + 1 &&
					/(auto|scroll)/.test(mxUtils.getCurrentStyle(elt).overflowY))
				{
					return elt;
				}

				elt = elt.parentNode;
			}

			return null;
		};

		var reset = function()
		{
			if (touch != null && touch.timer != null)
			{
				window.clearTimeout(touch.timer);
			}

			touch = null;
		};

		// Starts the drag of the shape with the press of the touch: the drag
		// source listens to the moves and the end from now on
		var startDrag = function(evt, held)
		{
			var t = touch;
			window.clearTimeout(t.timer);
			t.timer = null;
			t.dragging = true;

			try
			{
				t.ds.mouseDown(t.start);

				// After a hold the preview shows at once under the finger
				if (held && t.ds.dragElement != null)
				{
					t.ds.dragElement.style.display = '';
					t.ds.mouseMove(t.start);
				}
			}
			catch (e)
			{
				reset();
				t.ds.reset();
			}
		};

		// A touch within touchScrollDelay of a scroll stops a fling and taps
		// nothing
		var lastScroll = 0;

		var scrollListener = function(evt)
		{
			if (evt.target != null && evt.target.nodeType == 1 && container.contains(evt.target))
			{
				lastScroll = Date.now();

				if (touch != null)
				{
					touch.moved = true;
				}
			}
		};

		window.addEventListener('scroll', scrollListener, true);

		// The pointer events of another finger than the one of the touch
		var isOther = function(evt)
		{
			return touch != null && evt.pointerId != null && evt.pointerId != touch.pointerId;
		};

		var start = function(evt)
		{
			// A second finger is no tap and no drag for either finger, and the
			// shape under it does not get the press (its drag source would add
			// it with the release); pointer events have no list of the
			// touches. A drag that runs goes on.
			if (Editor.isTouchSupportOn() && isTouch(evt) && ((pointer && isOther(evt)) ||
				(evt.touches != null && evt.touches.length > 1)))
			{
				if (touch != null && !touch.dragging)
				{
					reset();
				}

				var item = (evt.target != null && evt.target.closest != null) ?
					evt.target.closest('a') : null;

				if (item != null && item.touchDragSource != null && container.contains(item))
				{
					evt.stopPropagation();
				}

				return;
			}

			reset();

			if (!Editor.isTouchSupportOn() || !isTouch(evt) ||
				evt.target == null || evt.target.closest == null)
			{
				return;
			}

			var elt = evt.target.closest('a');

			if (elt != null && elt.touchDragSource != null && container.contains(elt) &&
				elt.touchDragSource.mouseMoveHandler == null)
			{
				var pt = getPoint(evt);
				var scroller = getScroller(elt);
				touch = {elt: elt, ds: elt.touchDragSource, start: evt, x: pt.x, y: pt.y,
					pointerId: evt.pointerId, scroller: scroller,
					scrollTop: (scroller != null) ? scroller.scrollTop : 0,
					moved: Date.now() - lastScroll < EditorUi.touchScrollDelay};
				evt.stopPropagation();

				// No mouse events after the touch (preventDefault on touchstart
				// would stop the scroll)
				if (pointer)
				{
					evt.preventDefault();
				}

				touch.timer = window.setTimeout(function()
				{
					if (touch != null && !touch.dragging && !touch.moved && touch.elt.parentNode != null &&
						(touch.scroller == null || touch.scroller.scrollTop == touch.scrollTop))
					{
						startDrag(null, true);
					}
				}, EditorUi.touchHoldDelay);
			}
		};

		var move = function(evt)
		{
			if (touch == null || !isTouch(evt) || isOther(evt))
			{
				return;
			}

			if (touch.dragging)
			{
				// The drag source takes the moves of pointer events, the touch
				// events of Chrome must not scroll (the pan would cancel them)
				if (evt.type == 'touchmove' && evt.cancelable)
				{
					evt.preventDefault();
				}
			}
			else if (evt.touches != null && evt.touches.length > 1)
			{
				reset();
			}
			else if (!pointer || evt.type == 'pointermove')
			{
				var pt = getPoint(evt);
				var dx = Math.abs(pt.x - touch.x);
				var dy = Math.abs(pt.y - touch.y);

				if (dx > EditorUi.touchSlop || dy > EditorUi.touchSlop)
				{
					// Across the scroll direction, before the shapes scrolled
					if (dx > dy && (touch.scroller == null ||
						touch.scroller.scrollTop == touch.scrollTop))
					{
						startDrag(evt, false);

						if (evt.cancelable)
						{
							evt.preventDefault();
						}
					}
					else
					{
						reset();
					}
				}
			}
		};

		var end = function(evt)
		{
			var t = touch;

			if (t == null || !isTouch(evt) || isOther(evt) ||
				(evt.touches != null && evt.touches.length > 0))
			{
				return;
			}

			reset();

			if (!t.dragging)
			{
				evt.stopPropagation();

				// No mouse events and no click of the tap
				if (evt.cancelable)
				{
					evt.preventDefault();
				}

				// A tap adds the shape as the press and release on it did
				if (t.elt.parentNode != null && !t.moved && (t.scroller == null ||
					t.scroller.scrollTop == t.scrollTop))
				{
					try
					{
						t.ds.mouseDown(t.start);
						t.ds.mouseUp(evt);
					}
					catch (e)
					{
						t.ds.reset();
					}
				}
			}
		};

		var cancel = function(evt)
		{
			if (isOther(evt))
			{
				return;
			}
			else if (touch != null && !touch.dragging)
			{
				reset();
			}
			else if (touch != null && evt.type == 'pointercancel')
			{
				touch = null;
			}
		};

		container.addEventListener((pointer) ? 'pointerdown' : 'touchstart', start,
			(pointer) ? true : {capture: true, passive: true});
		container.addEventListener((pointer) ? 'pointermove' : 'touchmove', move,
			(pointer) ? true : {capture: true, passive: false});
		container.addEventListener((pointer) ? 'pointerup' : 'touchend', end, true);
		container.addEventListener((pointer) ? 'pointercancel' : 'touchcancel', cancel, true);

		// Chrome sends touch events with pointer events: a touchmove that is not
		// cancelled scrolls the shapes during a drag and cancels its pointers
		if (pointer)
		{
			container.addEventListener('touchmove', move, {capture: true, passive: false});
			container.addEventListener('touchend', function()
			{
				if (touch != null && touch.dragging)
				{
					touch = null;
				}
			}, true);
		}

		// No context menu of the browser for a long press on a shape
		container.addEventListener('contextmenu', function(evt)
		{
			if (touch != null && Editor.isTouchSupportOn())
			{
				evt.preventDefault();
			}
		}, true);

		this.touchShapesScrollListener = scrollListener;
	};

	/**
	 * Shows the sheet of the panels at full height or at half height.
	 */
	EditorUi.prototype.setSidePanelFull = function(panel, full)
	{
		panel.full = full;
		panel.container.classList.toggle('geSidePanelFull', full);

		if (panel.grabber != null)
		{
			panel.grabber.setAttribute('aria-label', mxResources.get((full) ? 'collapse' : 'expand'));
			panel.grabber.setAttribute('title', mxResources.get((full) ? 'collapse' : 'expand'));
			panel.grabber.setAttribute('aria-expanded', (full) ? 'true' : 'false');
		}
	};

	/**
	 * Adds the grabber and the drag of the sheet to the open panel while it is
	 * a sheet and touch is on, and removes them otherwise.
	 */
	EditorUi.prototype.updateSidePanelGrabber = function()
	{
		var panel = this.sidePanel;

		if (panel != null)
		{
			var on = Editor.isTouchSupportOn() &&
				panel.container.classList.contains('geSidePanelSheet');

			if (on && panel.grabber == null)
			{
				var ui = this;
				var grabber = document.createElement('button');
				grabber.setAttribute('type', 'button');
				grabber.className = 'geSidePanelGrabber';
				panel.grabber = grabber;
				panel.container.insertBefore(grabber, panel.container.firstChild);
				this.setSidePanelFull(panel, panel.full == true);

				// The click of a drag is stopped (see installSidePanelDrag)
				mxEvent.addListener(grabber, 'click', function(evt)
				{
					ui.setSidePanelFull(panel, !panel.full);
					mxEvent.consume(evt);
				});

				// Once per panel: a panel that is a sheet again keeps them
				if (panel.finishSnap == null)
				{
					this.installSidePanelDrag(panel);
				}
			}
			else if (!on && panel.grabber != null)
			{
				// A drag of the sheet ends where it is, without a snap
				if (panel.cancelDrag != null)
				{
					panel.cancelDrag();
				}

				if (panel.finishSnap != null)
				{
					panel.finishSnap();
				}

				mxEvent.release(panel.grabber);

				if (panel.grabber.parentNode != null)
				{
					panel.grabber.parentNode.removeChild(panel.grabber);
				}

				panel.grabber = null;
				this.setSidePanelFull(panel, false);
			}

			panel.container.classList.toggle('geSidePanelDraggable', on);
		}
	};

	/**
	 * The sheet of the panels follows a finger, the mouse or a pen on its
	 * grabber and its head (touch-action: none there), and the release snaps
	 * it to the nearest of closed, half and full height or, after a fling
	 * (touchFlingVelocity), to the next of them in the direction of the
	 * fling. A drag that is cancelled returns the sheet, a drag of a panel
	 * that is no longer a sheet (eg. docked after a resize) ends without a
	 * snap. Taps on the grabber and the buttons of the head keep their
	 * function; the click after a drag is stopped in the capture phase. The
	 * listeners go with the container of the panel (mxEvent.release and
	 * dragClick in removeSidePanel) and are added once per panel.
	 */
	EditorUi.prototype.installSidePanelDrag = function(panel)
	{
		var ui = this;
		var container = panel.container;
		var drag = null;
		var lastDrag = 0;

		// The heights of the sheet at half and full height (grapheditor.css)
		var measure = function()
		{
			var full = container.classList.contains('geSidePanelFull');
			var height = container.style.height;
			container.style.height = '';
			container.classList.remove('geSidePanelFull');
			var half = container.offsetHeight;
			container.classList.add('geSidePanelFull');
			var max = container.offsetHeight;
			container.classList.toggle('geSidePanelFull', full);
			container.style.height = height;

			return {half: half, full: Math.max(half, max), current: (full) ? max : half};
		};

		var close = function()
		{
			var back = panel.back;
			ui.hideSidePanel(true);

			if (back)
			{
				ui.toggleFormatPanel(false);
			}
		};

		// Ends the snap of a release at once: the sheet takes its height
		var finishSnap = function()
		{
			if (panel.snap != null)
			{
				var snap = panel.snap;
				panel.snap = null;
				window.clearTimeout(snap.timer);
				container.classList.remove('geSidePanelDragging');
				container.style.height = '';

				if (snap.height <= 0)
				{
					if (ui.sidePanel == panel)
					{
						close();
					}
				}
				else
				{
					ui.setSidePanelFull(panel, snap.full);
				}
			}
		};

		panel.finishSnap = finishSnap;

		// Ends a drag without a snap: the sheet keeps its height of before
		var cancelDrag = function()
		{
			if (drag != null)
			{
				var d = drag;
				drag = null;

				if (d.active)
				{
					lastDrag = Date.now();
					container.classList.remove('geSidePanelDragging');
					container.style.height = '';

					try
					{
						container.releasePointerCapture(d.id);
					}
					catch (e)
					{
						// ignore
					}
				}
			}
		};

		panel.cancelDrag = cancelDrag;

		var isSheet = function()
		{
			return ui.sidePanel == panel && Editor.isTouchSupportOn() &&
				container.classList.contains('geSidePanelSheet');
		};

		var settle = function(height, heights)
		{
			var reduced = window.matchMedia != null &&
				window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			panel.snap = {height: height, full: height >= heights.full};

			if (reduced)
			{
				finishSnap();
			}
			else
			{
				// The transition of the height runs from the place of the release
				// (a call, as Closure removes a bare read of offsetHeight)
				container.classList.remove('geSidePanelDragging');
				container.getBoundingClientRect();
				container.style.height = height + 'px';
				panel.snap.timer = window.setTimeout(finishSnap, EditorUi.sidePanelSnapDuration);
			}
		};

		// The height that the release snaps to
		var getTarget = function(height, velocity, heights)
		{
			var detents = [0, heights.half, heights.full];

			if (Math.abs(velocity) >= EditorUi.touchFlingVelocity)
			{
				// The next height in the direction of the fling (down is positive)
				for (var i = 0; i < detents.length; i++)
				{
					var d = detents[(velocity > 0) ? detents.length - 1 - i : i];

					if ((velocity > 0 && d < height) || (velocity < 0 && d > height))
					{
						return d;
					}
				}

				return (velocity > 0) ? 0 : heights.full;
			}

			var result = detents[0];

			for (var i = 1; i < detents.length; i++)
			{
				if (Math.abs(detents[i] - height) < Math.abs(result - height))
				{
					result = detents[i];
				}
			}

			return result;
		};

		mxEvent.addListener(container, 'pointerdown', function(evt)
		{
			var handle = (evt.target != null && evt.target.closest != null) ?
				evt.target.closest('.geSidePanelGrabber, .geSidePanelHeader') : null;

			// A press that did not start a drag (eg. of the mouse, released
			// outside of the sheet) gives way to the next one
			if ((drag == null || !drag.active) && handle != null && container.contains(handle) &&
				isSheet() && evt.isPrimary !== false &&
				(evt.pointerType != 'mouse' || evt.button == 0))
			{
				finishSnap();
				drag = {id: evt.pointerId, y: evt.clientY, active: false,
					moves: [{y: evt.clientY, t: evt.timeStamp}]};
			}
		});

		mxEvent.addListener(container, 'pointermove', function(evt)
		{
			if (drag != null && evt.pointerId == drag.id && (!isSheet() ||
				(!drag.active && evt.buttons === 0)))
			{
				// The panel is no longer a sheet, or the press ended where the
				// sheet did not hear it (no capture before the drag starts)
				cancelDrag();
			}
			else if (drag != null && evt.pointerId == drag.id)
			{
				var dy = evt.clientY - drag.y;

				if (!drag.active && Math.abs(dy) > EditorUi.touchSlop)
				{
					drag.active = true;
					container.classList.add('geSidePanelDragging');
					drag.heights = measure();
					drag.start = drag.heights.current;

					try
					{
						container.setPointerCapture(evt.pointerId);
					}
					catch (e)
					{
						// ignore
					}
				}

				if (drag.active)
				{
					container.style.height = Math.max(0, Math.min(drag.heights.full,
						drag.start - dy)) + 'px';
					drag.moves.push({y: evt.clientY, t: evt.timeStamp});

					if (drag.moves.length > 6)
					{
						drag.moves.shift();
					}

					evt.preventDefault();
				}
			}
		});

		var end = function(evt)
		{
			if (drag != null && evt.pointerId == drag.id && !isSheet())
			{
				cancelDrag();
			}
			else if (drag != null && evt.pointerId == drag.id)
			{
				var d = drag;
				drag = null;

				if (d.active)
				{
					lastDrag = Date.now();
					var height = Math.max(0, Math.min(d.heights.full,
						d.start - (evt.clientY - d.y)));

					if (evt.type == 'pointercancel')
					{
						settle(d.heights.current, d.heights);
					}
					else
					{
						// The speed of the last moves within 100 ms of the release;
						// none if the finger rested longer (no fling)
						var first = null;

						for (var i = d.moves.length - 1; i >= 0; i--)
						{
							if (evt.timeStamp - d.moves[i].t <= 100)
							{
								first = d.moves[i];
							}
						}

						var dt = (first != null) ? evt.timeStamp - first.t : 0;
						var velocity = (dt > 0) ? (evt.clientY - first.y) / dt : 0;
						settle(getTarget(height, velocity, d.heights), d.heights);
					}
				}
			}
		};

		mxEvent.addListener(container, 'pointerup', end);
		mxEvent.addListener(container, 'pointercancel', end);

		// No click after a drag (eg. on the grabber or Close): in the capture
		// phase, before the grabber and the buttons of the head consume it
		// (mxEvent.addListener has no capture), removed in removeSidePanel
		panel.dragClick = function(evt)
		{
			if (Date.now() - lastDrag < 400)
			{
				lastDrag = 0;
				mxEvent.consume(evt);
			}
		};

		container.addEventListener('click', panel.dragClick, true);
	};

	/**
	 * The open panel gets the grabber and the drag of the sheet when it
	 * becomes a sheet (PanelHost.js).
	 */
	var editorUiUpdateSidePanelSheet = EditorUi.prototype.updateSidePanelSheet;

	if (editorUiUpdateSidePanelSheet != null)
	{
		EditorUi.prototype.updateSidePanelSheet = function()
		{
			editorUiUpdateSidePanelSheet.apply(this, arguments);
			this.updateSidePanelGrabber();
		};
	}

	/**
	 * A panel that is removed ends the snap of its sheet and loses the
	 * listener of the click after a drag (the others go with mxEvent.release).
	 */
	var editorUiRemoveSidePanel = EditorUi.prototype.removeSidePanel;

	if (editorUiRemoveSidePanel != null)
	{
		EditorUi.prototype.removeSidePanel = function()
		{
			var panel = this.sidePanel;

			if (panel != null && panel.snap != null)
			{
				window.clearTimeout(panel.snap.timer);
				panel.snap = null;
			}

			if (panel != null && panel.dragClick != null)
			{
				panel.container.removeEventListener('click', panel.dragClick, true);
				panel.dragClick = null;
			}

			return editorUiRemoveSidePanel.apply(this, arguments);
		};
	}

	/**
	 * Marks the editor while touch is on (.geTouchSupport, for the hit areas
	 * of grapheditor.css) and adds the listeners of the shapes.
	 */
	EditorUi.prototype.updateTouchSupport = function()
	{
		if (this.container != null)
		{
			var on = Editor.isTouchSupportOn() && !this.editor.isChromelessView();
			this.container.classList.toggle('geTouchSupport', on);

			if (on)
			{
				this.installShapesTouches();
			}

			if (this.updateSidePanelGrabber != null)
			{
				this.updateSidePanelGrabber();
			}
		}
	};

	var editorUiInit = EditorUi.prototype.init;

	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);

		if (!this.editor.isChromelessView())
		{
			this.touchSupportListener = mxUtils.bind(this, this.updateTouchSupport);
			this.addListener('currentThemeChanged', this.touchSupportListener);
			this.updateTouchSupport();
		}
	};

	var editorUiDestroy = EditorUi.prototype.destroy;

	EditorUi.prototype.destroy = function()
	{
		if (this.touchShapesScrollListener != null)
		{
			window.removeEventListener('scroll', this.touchShapesScrollListener, true);
			this.touchShapesScrollListener = null;
		}

		editorUiDestroy.apply(this, arguments);
	};
})();
