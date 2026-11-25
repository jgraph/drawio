/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The undo toast of every theme (concept H4, "Undo instead of confirm"):
 * after shapes or pages were deleted, which needs no question, a card at the
 * bottom of the canvas says what happened, with Undo, which undoes exactly
 * that change and selects the shapes again. One toast at a time; it closes
 * after 6 s (not while the pointer or the focus is in it), at the next edit,
 * undo or redo, on another page or file and with Escape. Its text is a live
 * region, so screen readers announce it.
 *
 * This file has the toast of Classic, Simple, Sketch and Minimal (UndoToast,
 * a dark card in the look of Classic, see .geToast in grapheditor.css) and
 * the hooks of the delete actions, which show the toast of the theme: the
 * theme Fusion shows its own (SimpleToast in SimpleToast.js, which extends
 * UndoToast), Simple, Sketch and Minimal this one, both unless undoToast is
 * false in the configuration (Undo Notifications), and Classic only if
 * undoToast is true (or undoToast=1 in the URL, which wins; the feature
 * undoToast of Editor.featureDefaults, see Editor.isUndoToastOn,
 * EditorUi.isHelperEnabled and isSimpleUndoToastEnabled). Without the toast
 * the actions run as before.
 * Only the text of the resources and page names as text go into the card
 * (mxUtils.write).
 */
(function()
{
	/**
	 * Milliseconds after which the toast closes.
	 */
	EditorUi.prototype.undoToastDelay = 6000;

	/**
	 * Returns true if the toast of Classic and Simple is shown: not in the
	 * theme Fusion (see isHelperEnabled), not in chromeless views and only
	 * in an enabled editor. Minimal has a chromeless editor that is editable
	 * (App.main), which has the toast (eg. after Bundle and Delete, the
	 * driver, 19 November 2026); chrome=0 and the viewers are not editable.
	 */
	EditorUi.prototype.isUndoToastEnabled = function()
	{
		return this.isHelperEnabled('undoToast') && this.container != null &&
			this.editor != null && (!this.editor.chromeless || this.editor.editable) &&
			this.diagramContainer != null && this.editor.graph.isEnabled();
	};

	/**
	 * Returns true if a toast with Undo is shown after a change: the one of
	 * the theme Fusion (isSimpleUndoToastEnabled) or the one of the other
	 * themes.
	 */
	EditorUi.prototype.canShowUndoToast = function()
	{
		return (typeof this.isSimpleUndoToastEnabled === 'function' && this.isSimpleUndoToastEnabled()) ||
			this.isUndoToastEnabled();
	};

	/**
	 * Shows the toast of the theme with the given text and options (see
	 * UndoToast.prototype.show) and returns it, or null if there is none.
	 */
	EditorUi.prototype.showUndoToast = function(text, options)
	{
		if (typeof this.isSimpleToastEnabled === 'function' && this.isSimpleToastEnabled())
		{
			return this.showSimpleToast(text, options);
		}
		else if (!this.isUndoToastEnabled())
		{
			return null;
		}

		if (this.undoToast == null)
		{
			this.undoToast = new UndoToast(this);
		}

		this.undoToast.show(text, options || {});

		return this.undoToast;
	};

	/**
	 * Hides the toast of Classic and Simple. Immediate removes it without
	 * the animation.
	 */
	EditorUi.prototype.hideUndoToast = function(immediate)
	{
		if (this.undoToast != null)
		{
			this.undoToast.hide(immediate);
		}
	};

	/**
	 * Runs the given function and returns the undoable edits that it added
	 * to the history.
	 */
	EditorUi.prototype.collectUndoableEdits = function(fn)
	{
		var um = this.editor.undoManager;
		var edits = [];

		var listener = function(sender, evt)
		{
			edits.push(evt.getProperty('edit'));
		};

		um.addListener(mxEvent.ADD, listener);

		try
		{
			fn();
		}
		finally
		{
			um.removeListener(listener);
		}

		return edits;
	};

	/**
	 * Runs the given function with the given this and arguments, which may
	 * delete pages, and shows the toast with the name of the deleted page or
	 * the number of deleted pages and Undo. Returns the result of the
	 * function.
	 */
	EditorUi.prototype.runWithPageToast = function(fn, self, args)
	{
		var ui = this;
		var page = this.currentPage;
		var pages = (this.pages != null) ? this.pages.slice() : [];

		if (!this.canShowUndoToast() || page == null)
		{
			return fn.apply(self, args || []);
		}

		var result = null;

		var edits = this.collectUndoableEdits(function()
		{
			result = fn.apply(self, args || []);
		});

		var removed = [];

		for (var j = 0; j < pages.length; j++)
		{
			if (mxUtils.indexOf(ui.pages, pages[j]) < 0)
			{
				removed.push(pages[j]);
			}
		}

		if (edits.length > 0 && removed.length > 0)
		{
			// The name of the tab: short, and Untitled for an empty name
			this.showUndoToast((removed.length == 1) ?
				mxResources.get('toastDeletedPage', [this.getShortPageName(removed[0]) ||
					mxResources.get('untitled')], 'Deleted {1}') :
				mxResources.get('toastDeleted', [mxResources.get('pagesN',
					[removed.length], '{1} pages')], 'Deleted {1}'), {edits: edits});
		}

		return result;
	};

	/**
	 * The toast of an editor UI: one element in the container of the UI that
	 * shows the current toast (see EditorUi.showUndoToast).
	 */
	var UndoToast = function(ui)
	{
		this.ui = ui;
		this.edits = [];
		this.options = {};
		this.visible = false;
		this.comparing = false;
		this.busy = false;
		this.init();
	};

	/**
	 * Milliseconds after which the first toast opens, so that screen readers
	 * know the live region before its text.
	 */
	UndoToast.prototype.liveDelay = 100;

	/**
	 * Class of the element of the toast while it is shown.
	 */
	UndoToast.prototype.openClass = 'geToastOpen';

	/**
	 * Creates the element and its listeners.
	 */
	UndoToast.prototype.init = function()
	{
		this.createElements();
		this.installListeners();
	};

	/**
	 * Creates the element. Without the class of openClass it is an empty live
	 * region of 1 px, so screen readers announce the next text.
	 */
	UndoToast.prototype.createElements = function()
	{
		var elt = document.createElement('div');
		elt.className = 'geToast';
		this.container = elt;

		this.text = document.createElement('span');
		this.text.className = 'geToastText';
		this.text.setAttribute('role', 'status');
		this.text.setAttribute('aria-live', 'polite');
		this.text.setAttribute('aria-atomic', 'true');
		elt.appendChild(this.text);

		this.undoButton = this.createButton(mxResources.get('undo'));
		this.actionButton = this.createButton('', 'geToastAction');
		this.closeButton = this.createButton('\u00d7', 'geToastClose');
		this.closeButton.setAttribute('title', mxResources.get('close'));
		this.closeButton.setAttribute('aria-label', mxResources.get('close'));

		mxEvent.addListener(this.closeButton, 'click', mxUtils.bind(this, function(evt)
		{
			this.dismiss();
			mxEvent.consume(evt);
		}));
	};

	/**
	 * Adds a text button of the toast with the given label.
	 */
	UndoToast.prototype.createButton = function(label, className)
	{
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = 'geToastBtn' + ((className != null) ? ' ' + className : '');
		btn.style.display = 'none';
		mxUtils.write(btn, label);
		this.container.appendChild(btn);

		return btn;
	};

	/**
	 * Adds the listeners of Undo, the action, the time and the history (Close
	 * has its listener from createElements).
	 */
	UndoToast.prototype.installListeners = function()
	{
		var elt = this.container;

		mxEvent.addListener(this.undoButton, 'click', mxUtils.bind(this, function(evt)
		{
			this.undo();
			mxEvent.consume(evt);
		}));

		mxEvent.addListener(this.actionButton, 'click', mxUtils.bind(this, function(evt)
		{
			this.runAction();
			mxEvent.consume(evt);
		}));

		// The time runs only while the pointer and the focus are elsewhere
		mxEvent.addListener(elt, 'pointerenter', mxUtils.bind(this, function(evt)
		{
			if (evt.pointerType == 'mouse')
			{
				this.hovered = true;
				this.updateTimer();
			}
		}));

		mxEvent.addListener(elt, 'pointerleave', mxUtils.bind(this, function(evt)
		{
			if (evt.pointerType == 'mouse')
			{
				this.hovered = false;
				this.updateTimer();
			}
		}));

		mxEvent.addListener(elt, 'focusin', mxUtils.bind(this, function()
		{
			this.focused = true;
			this.updateTimer();
		}));

		mxEvent.addListener(elt, 'focusout', mxUtils.bind(this, function(evt)
		{
			// A window that loses the focus gives it back to the toast when it
			// comes back, so the time does not run while another window has it
			if ((evt.relatedTarget == null && document.hasFocus()) ||
				(evt.relatedTarget != null && !elt.contains(evt.relatedTarget)))
			{
				this.focused = false;
				this.updateTimer();
			}
		}));

		mxEvent.addListener(elt, 'keydown', mxUtils.bind(this, function(evt)
		{
			if (evt.key == 'Escape')
			{
				this.dismiss();
				mxEvent.consume(evt);
			}
		}));

		// The next edit, undo or redo closes the toast (not the ones of the
		// toast). Judged from the history after the event: a remote patch of a
		// realtime file adds an edit and then restores the history and clears
		// (DrawioFile.patch), which leaves the change of the toast current
		this.historyListener = mxUtils.bind(this, function()
		{
			if (!this.busy && !this.comparing && this.historyThread == null)
			{
				this.historyThread = window.setTimeout(mxUtils.bind(this, function()
				{
					this.historyThread = null;

					if (this.visible && !this.comparing && !this.options.persistent &&
						!this.isCurrent())
					{
						this.hide();
					}
				}), 0);
			}
		});

		this.closeListener = mxUtils.bind(this, function()
		{
			if (!this.options.persistent)
			{
				this.hide();
			}
		});
	};

	/**
	 * Shows the given text and options instead of the current toast. Options:
	 * - edits: the undoable edits of the change, in the order they were
	 *   added (or undoableEdit for one edit); Undo is shown only if the edits
	 *   are the last ones of the history.
	 * - selection: the cells to select after Undo (the selection before the
	 *   change).
	 * - action: {label, funct}, a text button that closes the toast and runs
	 *   funct.
	 * - closable: shows Close, which closes the toast like Escape and runs
	 *   the function close of the options.
	 * - delay: the milliseconds after which the toast closes (undoToastDelay
	 *   of the editor UI by default).
	 * - persistent: the next edit, undo, redo, page or file does not close
	 *   the toast (hide, the action, Escape and Close still do).
	 * The toast of the theme Fusion has more (see SimpleToast.js).
	 */
	UndoToast.prototype.show = function(text, options)
	{
		var ui = this.ui;
		var elt = this.container;
		var created = elt.parentNode != ui.container;
		this.hide(true);

		this.edits = (options.edits != null) ? options.edits.slice() :
			((options.undoableEdit != null) ? [options.undoableEdit] : []);
		this.options = options;
		this.visible = true;

		var um = ui.editor.undoManager;
		um.addListener(mxEvent.ADD, this.historyListener);
		um.addListener(mxEvent.UNDO, this.historyListener);
		um.addListener(mxEvent.REDO, this.historyListener);
		um.addListener(mxEvent.CLEAR, this.historyListener);
		ui.editor.addListener('pageSelected', this.closeListener);
		ui.editor.addListener('fileLoaded', this.closeListener);

		var open = mxUtils.bind(this, function()
		{
			this.openThread = null;
			this.update(text, options, this.isCurrent());
		});

		// A new live region is known to screen readers before its first text
		if (created)
		{
			ui.container.appendChild(elt);
			this.openThread = window.setTimeout(open, this.liveDelay);
		}
		else
		{
			open();
		}
	};

	/**
	 * Shows the given text, the buttons of the given options and the element
	 * (see show). Current is true if the edits are the last ones of the
	 * history.
	 */
	UndoToast.prototype.update = function(text, options, current)
	{
		var elt = this.container;
		this.undoButton.style.display = (current) ? '' : 'none';

		if (this.compareButton != null)
		{
			this.compareButton.style.display = (current && options.compare) ? '' : 'none';
		}

		this.undoButton.disabled = false;

		if (this.compareButton != null)
		{
			this.compareButton.disabled = false;
		}

		this.actionButton.textContent = '';

		if (options.action != null)
		{
			mxUtils.write(this.actionButton, options.action.label);
			this.actionButton.style.display = '';
		}

		this.closeButton.style.display = (options.closable) ? '' : 'none';
		this.updateIcon(options);
		this.text.textContent = '';
		mxUtils.write(this.text, text);
		this.text.setAttribute('title', text);
		elt.classList.add(this.openClass);
		this.place();
		this.updateTimer();
	};

	/**
	 * Shows the icon of the given options (only in the theme Fusion).
	 */
	UndoToast.prototype.updateIcon = function(options) { };

	/**
	 * Places the toast at the bottom of the canvas, in the middle, and inside
	 * the editor if the canvas is narrow (phones).
	 */
	UndoToast.prototype.place = function()
	{
		var ui = this.ui;
		var dc = ui.diagramContainer;
		var elt = this.container;

		if (dc != null && dc.offsetParent != null)
		{
			var outer = elt.offsetParent || ui.container;
			var db = dc.getBoundingClientRect();
			var ob = outer.getBoundingClientRect();
			var cw = outer.clientWidth;

			// Above the horizontal scrollbar of the canvas
			var sb = Math.max(0, dc.offsetHeight - dc.clientHeight);
			elt.style.maxWidth = Math.max(Math.min(280, cw - 16), dc.clientWidth - 32) + 'px';
			elt.style.bottom = Math.round(ob.bottom - db.bottom + sb + 24) + 'px';

			var w = elt.offsetWidth / 2;
			var x = db.left - ob.left + dc.clientWidth / 2;
			elt.style.left = Math.round(Math.max(w + 8, Math.min(cw - w - 8, x))) + 'px';
		}
	};

	/**
	 * Returns true if the edits of the toast are the last edits of the
	 * history, so that undo undoes exactly them.
	 */
	UndoToast.prototype.isCurrent = function()
	{
		var um = this.ui.editor.undoManager;
		var n = this.edits.length;

		if (n == 0 || um.indexOfNextAdd < n)
		{
			return false;
		}

		for (var i = 0; i < n; i++)
		{
			if (um.history[um.indexOfNextAdd - n + i] !== this.edits[i])
			{
				return false;
			}
		}

		return true;
	};

	/**
	 * Returns true if the edits of the toast are the next edits to redo.
	 */
	UndoToast.prototype.isUndone = function()
	{
		var um = this.ui.editor.undoManager;
		var n = this.edits.length;

		if (n == 0 || um.indexOfNextAdd + n > um.history.length)
		{
			return false;
		}

		for (var i = 0; i < n; i++)
		{
			if (um.history[um.indexOfNextAdd + i] !== this.edits[i])
			{
				return false;
			}
		}

		return true;
	};

	/**
	 * Runs the given function as an operation of the toast, which the history
	 * listener ignores.
	 */
	UndoToast.prototype.run = function(fn)
	{
		this.busy = true;

		try
		{
			fn();
		}
		finally
		{
			this.busy = false;
		}
	};

	/**
	 * Selects the cells of the given array that are in the model.
	 */
	UndoToast.prototype.select = function(cells)
	{
		var graph = this.ui.editor.graph;
		var result = [];

		for (var i = 0; i < cells.length; i++)
		{
			if (graph.model.contains(cells[i]))
			{
				result.push(cells[i]);
			}
		}

		graph.setSelectionCells(result);
	};

	/**
	 * Disables the actions if the history moved on.
	 */
	UndoToast.prototype.disableActions = function()
	{
		this.undoButton.disabled = true;

		if (this.compareButton != null)
		{
			this.compareButton.disabled = true;
		}
	};

	/**
	 * Ends a comparison (only in the theme Fusion, see SimpleToast.js).
	 */
	UndoToast.prototype.endCompare = function() { };

	/**
	 * Undoes the edits of the toast and closes it. The focus goes to the
	 * diagram if it was in the toast.
	 */
	UndoToast.prototype.undo = function()
	{
		var ui = this.ui;
		var graph = ui.editor.graph;
		var um = ui.editor.undoManager;
		this.endCompare();

		if (graph.isEditing())
		{
			graph.stopEditing(false);
		}

		if (!this.isCurrent())
		{
			this.disableActions();

			return;
		}

		var n = this.edits.length;
		var focused = this.container.contains(document.activeElement);

		this.run(mxUtils.bind(this, function()
		{
			for (var i = 0; i < n && um.indexOfNextAdd > 0; i++)
			{
				ui.undo();
			}
		}));

		if (this.options.selection != null)
		{
			this.select(this.options.selection);
		}

		this.hide(false, focused);
	};

	/**
	 * Closes the toast and runs the action of its options.
	 */
	UndoToast.prototype.runAction = function()
	{
		var action = this.options.action;
		this.hide(false, this.container.contains(document.activeElement));

		if (action != null)
		{
			action.funct();
		}
	};

	/**
	 * Closes the toast with Close or Escape and runs the function close of
	 * its options.
	 */
	UndoToast.prototype.dismiss = function()
	{
		var close = this.options.close;
		this.hide(false, this.container.contains(document.activeElement));

		if (close != null)
		{
			close();
		}
	};

	/**
	 * Starts the time after which the toast closes if it is shown, not
	 * compared and the pointer and the focus are elsewhere.
	 */
	UndoToast.prototype.updateTimer = function()
	{
		window.clearTimeout(this.timer);
		this.timer = null;

		if (this.visible && !this.comparing && !this.hovered && !this.focused)
		{
			this.timer = window.setTimeout(mxUtils.bind(this, function()
			{
				this.timer = null;
				this.hide();
			}), (this.options.delay != null) ? this.options.delay : this.getDelay());
		}
	};

	/**
	 * Returns the milliseconds after which the toast closes by default.
	 */
	UndoToast.prototype.getDelay = function()
	{
		return this.ui.undoToastDelay;
	};

	/**
	 * Lets a copy of the given element of the toast fade out where it was
	 * (only in the theme Fusion, see SimpleToast.js).
	 */
	UndoToast.prototype.fadeOut = function(elt) { };

	/**
	 * Closes the toast. Immediate is true if a new toast replaces it or it is
	 * destroyed. Focus moves the focus to the diagram (it was in the toast).
	 */
	UndoToast.prototype.hide = function(immediate, focus)
	{
		var ui = this.ui;
		var elt = this.container;

		if (this.comparing)
		{
			this.endCompare();
		}

		if (this.visible)
		{
			var focused = focus || elt.contains(document.activeElement);
			this.visible = false;
			this.hovered = false;
			this.focused = false;
			window.clearTimeout(this.timer);
			window.clearTimeout(this.openThread);
			window.clearTimeout(this.historyThread);
			this.timer = null;
			this.openThread = null;
			this.historyThread = null;

			var um = ui.editor.undoManager;
			um.removeListener(this.historyListener);
			ui.editor.removeListener(this.closeListener);
			this.edits = [];
			this.options = {};

			if (focused && ui.editor.graph.container != null)
			{
				ui.editor.graph.container.focus();
			}
		}

		// The copy keeps the text and the buttons while the toast is emptied
		if (!immediate && elt.classList.contains(this.openClass))
		{
			this.fadeOut(elt);
		}

		elt.classList.remove(this.openClass);
		this.text.textContent = '';
		this.text.removeAttribute('title');
		this.undoButton.style.display = 'none';

		if (this.compareButton != null)
		{
			this.compareButton.style.display = 'none';
		}

		this.actionButton.style.display = 'none';
		this.closeButton.style.display = 'none';
	};

	/**
	 * Hides the toast and removes its element.
	 */
	UndoToast.prototype.destroy = function()
	{
		this.hide(true);

		if (this.container.parentNode != null)
		{
			this.container.parentNode.removeChild(this.container);
		}
	};

	/**
	 * Returns the number of shapes and connectors that the given edits
	 * removed (cells removed with their parent are not counted).
	 */
	UndoToast.countRemoved = function(model, edits)
	{
		var result = {shapes: 0, connectors: 0};

		for (var i = 0; i < edits.length; i++)
		{
			var changes = (edits[i] != null) ? edits[i].changes : [];

			for (var j = 0; j < changes.length; j++)
			{
				var change = changes[j];

				// An executed child change keeps the old parent in previous
				if (change instanceof mxChildChange && change.parent == null &&
					change.previous != null && change.child != null)
				{
					if (model.isEdge(change.child))
					{
						result.connectors++;
					}
					else if (model.isVertex(change.child))
					{
						result.shapes++;
					}
				}
			}
		}

		return result;
	};

	/**
	 * Returns the text of the toast after the given shapes and connectors
	 * were deleted, eg. "Deleted 3 shapes" or "Deleted 3 shapes and 2
	 * connectors". The whole sentence comes from the resources (the counts
	 * with their singular and plural, the sentence with its "and"), so it is
	 * in the language of the UI, which is not always that of the browser.
	 */
	UndoToast.getDeletedText = function(shapes, connectors)
	{
		var s = (shapes == 1) ? mxResources.get('toastOneShape', null, '1 shape') :
			mxResources.get('toastShapes', [shapes], '{1} shapes');
		var c = (connectors == 1) ? mxResources.get('toastOneConnector', null, '1 connector') :
			mxResources.get('toastConnectors', [connectors], '{1} connectors');

		if (shapes > 0 && connectors > 0)
		{
			return mxResources.get('toastDeletedShapesConnectors', [s, c], 'Deleted {1} and {2}');
		}

		return mxResources.get('toastDeleted', [(connectors > 0) ? c : s], 'Deleted {1}');
	};

	/**
	 * Deleting shapes shows the toast with Undo: wraps the delete actions of
	 * the given actions (Actions.js; the keys, menus and toolbars use them).
	 */
	UndoToast.installActions = function(actions)
	{
		if (actions.undoToastInstalled)
		{
			return;
		}

		actions.undoToastInstalled = true;

		var ui = actions.editorUi;
		var names = ['delete', 'deleteAll'];

		for (var i = 0; i < names.length; i++)
		{
			(function(action)
			{
				if (action != null)
				{
					var funct = action.funct;

					action.funct = function()
					{
						if (!ui.canShowUndoToast())
						{
							return funct.apply(this, arguments);
						}

						var self = this;
						var args = arguments;
						var graph = ui.editor.graph;
						var selection = graph.getSelectionCells();
						var result = null;

						var edits = ui.collectUndoableEdits(function()
						{
							result = funct.apply(self, args);
						});

						var removed = UndoToast.countRemoved(graph.model, edits);

						if (removed.shapes + removed.connectors > 0)
						{
							ui.showUndoToast(UndoToast.getDeletedText(removed.shapes, removed.connectors),
								{edits: edits, selection: selection});
						}

						return result;
					};
				}
			})(actions.get(names[i]));
		}
	};

	/**
	 * Bundle shows the toast with the number of the connectors of the new tie
	 * and Undo (Undo instead of confirm, concept 2.1, as in Fusion before it
	 * came to every theme, the driver, 19 November 2026): wraps the action of
	 * the given actions where the theme has a toast (Fusion its own, see
	 * showUndoToast). The tie leaves out locked connectors and those without
	 * a route, so the toast counts its members.
	 */
	UndoToast.installBundleAction = function(actions)
	{
		var ui = actions.editorUi;
		var action = actions.get('bundle');

		if (action == null || action.undoToastInstalled)
		{
			return;
		}

		action.undoToastInstalled = true;
		var funct = action.funct;

		action.funct = function()
		{
			if (!ui.canShowUndoToast())
			{
				return funct.apply(this, arguments);
			}

			var self = this;
			var args = arguments;
			var graph = ui.editor.graph;
			var selection = graph.getSelectionCells();
			var result = null;

			var edits = ui.collectUndoableEdits(function()
			{
				result = funct.apply(self, args);
			});

			var tie = graph.getSelectionCell();

			if (edits.length > 0 && tie != null && graph.isTie(tie))
			{
				var count = graph.getTieMembers(tie.id).length;

				ui.showUndoToast(mxResources.get('toastBundled', [mxResources.get('toastConnectors',
					[count], '{1} connectors')], 'Bundled {1}'), {edits: edits, selection: selection});
			}

			return result;
		};
	};

	/**
	 * Deleting the current page (the action of the page menu and of the menu
	 * of a page tab) shows the toast with the name of the page and Undo (the
	 * pages are deleted without a question as before), and Delete All of the
	 * pages (deleteAllPages, added by SimpleMenus.js, and the item of the
	 * menu Pages, see runWithPageToast) the toast with the number of pages.
	 * Not the pages that other code removes, eg. a merge of the file.
	 */
	UndoToast.installPageActions = function(actions)
	{
		var ui = actions.editorUi;
		var names = ['removePage', 'deleteAllPages'];

		for (var i = 0; i < names.length; i++)
		{
			(function(action)
			{
				if (action == null || action.undoToastInstalled)
				{
					return;
				}

				action.undoToastInstalled = true;
				var funct = action.funct;

				action.funct = function()
				{
					return ui.runWithPageToast(funct, this, arguments);
				};
			})(actions.get(names[i]));
		}
	};

	/**
	 * Installs the toast of the page actions that exist, eg. again after
	 * SimpleMenus.js added deleteAllPages.
	 */
	EditorUi.prototype.installUndoToastPageActions = function()
	{
		UndoToast.installPageActions(this.actions);
	};

	/**
	 * Installs the hooks with the actions of each editor UI (before the
	 * toolbars keep the functions of the actions).
	 */
	var actionsInit = Actions.prototype.init;

	Actions.prototype.init = function()
	{
		actionsInit.apply(this, arguments);
		UndoToast.installActions(this);
		UndoToast.installBundleAction(this);
	};

	var menusInit = Menus.prototype.init;

	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);
		UndoToast.installPageActions(this.editorUi.actions);
	};

	/**
	 * Removes the toast with the editor UI.
	 */
	var editorUiDestroy = EditorUi.prototype.destroy;

	EditorUi.prototype.destroy = function()
	{
		if (this.undoToast != null)
		{
			this.undoToast.destroy();
			this.undoToast = null;
		}

		if (this.tieToolToast != null)
		{
			this.tieToolToast.destroy();
			this.tieToolToast = null;
		}

		editorUiDestroy.apply(this, arguments);
	};

	/**
	 * Shows what to do while Draw a tie draws (see EditorUi.startTieTool) in
	 * the card of the toast of Classic, Simple, Sketch and Minimal, a toast of
	 * its own with the hint and Done, as the tie bar of Fusion (the driver, 19
	 * November 2026: Tie in every theme like Fusion). Like the tie bar it
	 * stays while the tool draws, also at an edit (a collaborator's, an undo),
	 * a page or a file, and closes when the tool stops (a tie was drawn, Done,
	 * Escape, another tool); Escape and Close in the card stop the tool, so
	 * the card never closes while the tool keeps drawing. Shown in every
	 * theme but Fusion, which has its tie bar, also where the undo toast is
	 * off.
	 */
	EditorUi.prototype.showTieToolHint = function()
	{
		var tool = this.tieTool;

		// Minimal has a chromeless editor that is editable
		if (tool == null || !tool.isActive() || this.container == null ||
			this.diagramContainer == null || (this.editor.chromeless && !this.editor.editable))
		{
			return;
		}

		if (this.tieToolToast == null)
		{
			this.tieToolToast = new UndoToast(this);

			this.editor.graph.addListener('tieToolStateChanged', mxUtils.bind(this, function()
			{
				if (this.tieToolToast != null && (this.tieTool == null || !this.tieTool.isActive()))
				{
					this.tieToolToast.hide();
				}
			}));
		}

		// One card at a time
		this.hideUndoToast(true);

		this.tieToolToast.show(mxResources.get('drawTieHint'), {delay: 2147483647,
			persistent: true, close: function()
			{
				tool.cancel();
			}, action: {label: mxResources.get('done'), funct: function()
			{
				tool.cancel();
			}}});
	};

	window.UndoToast = UndoToast;
})();
