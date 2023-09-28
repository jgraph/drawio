/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxCellEditor
 *
 * In-place editor for the graph. To control this editor, use
 * <mxGraph.invokesStopCellEditing>, <mxGraph.enterStopsCellEditing> and
 * <mxGraph.escapeEnabled>. If <mxGraph.enterStopsCellEditing> is true then
 * ctrl-enter or shift-enter can be used to create a linefeed. The F2 and
 * escape keys can always be used to stop editing.
 * 
 * To customize the location of the textbox in the graph, override
 * <getEditorBounds> as follows:
 * 
 * (code)
 * graph.cellEditor.getEditorBounds = function(state)
 * {
 *   var result = mxCellEditor.prototype.getEditorBounds.apply(this, arguments);
 *   
 *   if (this.graph.getModel().isEdge(state.cell))
 *   {
 *     result.x = state.getCenterX() - result.width / 2;
 *     result.y = state.getCenterY() - result.height / 2;
 *   }
 *   
 *   return result;
 * };
 * (end)
 * 
 * Note that this hook is only called if <autoSize> is false. If <autoSize> is true,
 * then <mxShape.getLabelBounds> is used to compute the current bounds of the textbox.
 * 
 * The textarea uses the mxCellEditor CSS class. You can modify this class in
 * your custom CSS. Note: You should modify the CSS after loading the client
 * in the page.
 *
 * Example:
 * 
 * To only allow numeric input in the in-place editor, use the following code.
 *
 * (code)
 * var text = graph.cellEditor.textarea;
 * 
 * mxEvent.addListener(text, 'keydown', function (evt)
 * {
 *   if (!(evt.keyCode >= 48 && evt.keyCode <= 57) &&
 *       !(evt.keyCode >= 96 && evt.keyCode <= 105))
 *   {
 *     mxEvent.consume(evt);
 *   }
 * }); 
 * (end)
 * 
 * Placeholder:
 * 
 * To implement a placeholder for cells without a label, use the
 * <emptyLabelText> variable.
 * 
 * Resize in Chrome:
 * 
 * Resize of the textarea is disabled by default. If you want to enable
 * this feature extend <init> and set this.textarea.style.resize = ''.
 * 
 * To start editing on a key press event, the container of the graph
 * should have focus or a focusable parent should be used to add the
 * key press handler as follows.
 * 
 * (code)
 * mxEvent.addListener(graph.container, 'keypress', mxUtils.bind(this, function(evt)
 * {
 *   if (!graph.isEditing() && !graph.isSelectionEmpty() && evt.which !== 0 &&
 *       !mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt))
 *   {
 *     graph.startEditing();
 *     
 *     if (mxClient.IS_FF)
 *     {
 *       graph.cellEditor.textarea.value = String.fromCharCode(evt.which);
 *     }
 *   }
 * }));
 * (end)
 * 
 * To allow focus for a DIV, and hence to receive key press events, some browsers
 * require it to have a valid tabindex attribute. In this case the following
 * code may be used to keep the container focused.
 * 
 * (code)
 * var graphFireMouseEvent = graph.fireMouseEvent;
 * graph.fireMouseEvent = function(evtName, me, sender)
 * {
 *   if (evtName == mxEvent.MOUSE_DOWN)
 *   {
 *     this.container.focus();
 *   }
 *   
 *   graphFireMouseEvent.apply(this, arguments);
 * };
 * (end)
 *
 * Constructor: mxCellEditor
 *
 * Constructs a new in-place editor for the specified graph.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 */
function mxCellEditor(graph)
{
	this.graph = graph;
	
	// Stops editing after zoom changes
	this.zoomHandler = mxUtils.bind(this, function()
	{
		if (this.graph.isEditing())
		{
			this.resize();
		}
	});
	
	// Reposition after scrolling
	if (this.graph.container != null)
	{
		mxEvent.addListener(this.graph.container, 'scroll', this.zoomHandler);
	}

	this.graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, this.zoomHandler);
	this.graph.view.addListener(mxEvent.SCALE, this.zoomHandler);

	// Adds handling of deleted cells while editing
	this.changeHandler = mxUtils.bind(this, function(sender)
	{
		if (this.editingCell != null)
		{
			var state = this.graph.getView().getState(this.editingCell);

			if (state == null)
			{
				this.stopEditing(true);
			}
			else
			{
				this.updateTextAreaStyle(state);
			}
		}
	});

	this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler);
};

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxCellEditor.prototype.graph = null;

/**
 * Variable: textarea
 *
 * Holds the DIV that is used for text editing. Note that this may be null before the first
 * edit. Instantiated in <init>.
 */
mxCellEditor.prototype.textarea = null;

/**
 * Variable: editingCell
 * 
 * Reference to the <mxCell> that is currently being edited.
 */
mxCellEditor.prototype.editingCell = null;

/**
 * Variable: trigger
 * 
 * Reference to the event that was used to start editing.
 */
mxCellEditor.prototype.trigger = null;

/**
 * Variable: modified
 * 
 * Specifies if the label has been modified.
 */
mxCellEditor.prototype.modified = false;

/**
 * Variable: autoSize
 * 
 * Specifies if the textarea should be resized while the text is being edited.
 * Default is true.
 */
mxCellEditor.prototype.autoSize = true;

/**
 * Variable: selectText
 * 
 * Specifies if the text should be selected when editing starts. Default is
 * true.
 */
mxCellEditor.prototype.selectText = true;

/**
 * Variable: emptyLabelText
 * 
 * Text to be displayed for empty labels. Default is '' or '<br>' in Firefox as
 * a workaround for the missing cursor bug for empty content editable. This can
 * be set to eg. "[Type Here]" to easier visualize editing of empty labels. The
 * value is only displayed before the first keystroke and is never used as the
 * actual editing value.
 */
mxCellEditor.prototype.emptyLabelText = (mxClient.IS_FF) ? '<br>' : '';

/**
 * Variable: escapeCancelsEditing
 * 
 * If true, pressing the escape key will stop editing and not accept the new
 * value. Change this to false to accept the new value on escape, and cancel
 * editing on Shift+Escape instead. Default is true.
 */
mxCellEditor.prototype.escapeCancelsEditing = true;

/**
 * Variable: textNode
 * 
 * Reference to the label DOM node that has been hidden.
 */
mxCellEditor.prototype.textNode = '';

/**
 * Variable: zIndex
 * 
 * Specifies the zIndex for the textarea. Default is 1.
 */
mxCellEditor.prototype.zIndex = 1;

/**
 * Variable: minResize
 * 
 * Defines the minimum width and height to be used in <resize>. Default is 0x20px.
 */
mxCellEditor.prototype.minResize = new mxRectangle(0, 20);

/**
 * Variable: wordWrapPadding
 * 
 * Correction factor for word wrapping width. Default is 0 in IE
 * 11 and 1 in all other browsers and modes.
 */
mxCellEditor.prototype.wordWrapPadding = 0;

/**
 * Variable: blurEnabled
 *
 * If <focusLost> should be called if <textarea> loses the focus. Default is false.
 */
mxCellEditor.prototype.blurEnabled = false;

/**
 * Variable: initialValue
 * 
 * Holds the initial editing value to check if the current value was modified.
 */
mxCellEditor.prototype.initialValue = null;

/**
 * Variable: align
 * 
 * Holds the current temporary horizontal alignment for the cell style. If this
 * is modified then the current text alignment is changed and the cell style is
 * updated when the value is applied.
 */
mxCellEditor.prototype.align = null;

/**
 * Function: init
 *
 * Creates the <textarea> and installs the event listeners. The key handler
 * updates the <modified> state.
 */
mxCellEditor.prototype.init = function ()
{
	this.textarea = document.createElement('div');
	this.textarea.className = 'mxCellEditor mxPlainTextEditor';
	this.textarea.contentEditable = true;
	
	// Workaround for selection outside of DIV if height is 0
	if (mxClient.IS_GC)
	{
		this.textarea.style.minHeight = '1em';
	}

	this.textarea.style.position = ((this.isLegacyEditor())) ? 'absolute' : 'relative';
	this.installListeners(this.textarea);
};

/**
 * Function: applyValue
 * 
 * Called in <stopEditing> if cancel is false to invoke <mxGraph.labelChanged>.
 */
mxCellEditor.prototype.applyValue = function(state, value)
{
	this.graph.labelChanged(state.cell, value, this.trigger);
};

/**
 * Function: setAlign
 * 
 * Sets the temporary horizontal alignment for the current editing session.
 */
mxCellEditor.prototype.setAlign = function (align)
{
	if (this.textarea != null)
	{
		this.textarea.style.textAlign = align;
	}
	
	this.align = align;
	this.resize();
};

/**
 * Function: getInitialValue
 * 
 * Gets the initial editing value for the given cell.
 */
mxCellEditor.prototype.getInitialValue = function(state, trigger)
{
	var result = mxUtils.htmlEntities(this.graph.getEditingValue(state.cell, trigger), false);
	
    // Workaround for trailing line breaks being ignored in the editor
	if (document.documentMode != 8 && document.documentMode != 9 &&
		document.documentMode != 10)
	{
		result = mxUtils.replaceTrailingNewlines(result, '<div><br></div>');
	}
    
    return result.replace(/\n/g, '<br>');
};

/**
 * Function: getCurrentValue
 * 
 * Returns the current editing value.
 */
mxCellEditor.prototype.getCurrentValue = function(state)
{
	return mxUtils.extractTextWithWhitespace(this.textarea.childNodes);
};

/**
 * Function: isCancelEditingKeyEvent
 * 
 * Returns true if <escapeCancelsEditing> is true and shift, control and meta
 * are not pressed.
 */
mxCellEditor.prototype.isCancelEditingKeyEvent = function(evt)
{
	return this.escapeCancelsEditing || mxEvent.isShiftDown(evt) || mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt);
};

/**
 * Function: installListeners
 * 
 * Installs listeners for focus, change and standard key event handling.
 */
mxCellEditor.prototype.installListeners = function(elt)
{
	// Applies value if text is dragged
	// LATER: Gesture mouse events ignored for starting move
	mxEvent.addListener(elt, 'dragstart', mxUtils.bind(this, function(evt)
	{
		this.graph.stopEditing(false);
		mxEvent.consume(evt);
	}));

	// Applies value if focus is lost
	mxEvent.addListener(elt, 'blur', mxUtils.bind(this, function(evt)
	{
		if (this.blurEnabled)
		{
			this.focusLost(evt);
		}
	}));

	var y0 = this.graph.container.scrollTop;
	var x0 = this.graph.container.scrollLeft;

	// Updates modified state and handles placeholder text
	mxEvent.addListener(elt, 'keydown', mxUtils.bind(this, function(evt)
	{
		y0 = this.graph.container.scrollTop;
		x0 = this.graph.container.scrollLeft;

		if (!mxEvent.isConsumed(evt))
		{
			if (this.isStopEditingEvent(evt))
			{
				this.graph.stopEditing(false);
				mxEvent.consume(evt);
			}
			else if (evt.keyCode == 27 /* Escape */)
			{
				this.graph.stopEditing(this.isCancelEditingKeyEvent(evt));
				mxEvent.consume(evt);
			}
		}
	}));

	// Keypress only fires if printable key was pressed and handles removing the empty placeholder
	var keypressHandler = mxUtils.bind(this, function(evt)
	{
		if (this.editingCell != null)
		{
			// Clears the initial empty label on the first keystroke
			// and workaround for FF which fires keypress for delete and backspace
			if (this.clearOnChange && elt.innerHTML == this.getEmptyLabelText() &&
				(!mxClient.IS_FF || (evt.keyCode != 8 /* Backspace */ && evt.keyCode != 46 /* Delete */)))
			{
				this.clearOnChange = false;
				elt.innerText = '';
			}
		}
	});

	mxEvent.addListener(elt, 'keypress', keypressHandler);
	mxEvent.addListener(elt, 'paste', keypressHandler);
	
	// Handler for updating the empty label text value after a change
	// Keyup event is delayed and input doesn't fire for cursor up so
	// the best solution to avoid scroll to center when caret moves
	// outside of viewport is to keep element in the view.
	var keyupHandler = mxUtils.bind(this, function(evt)
	{
		if (this.editingCell != null)
		{
			this.graph.container.scrollTop = y0;
			this.graph.container.scrollLeft = x0;
			elt.scrollIntoView({block: 'nearest', inline: 'nearest'});

			// Uses an optional text value for sempty labels which is cleared
			// when the first keystroke appears. This makes it easier to see
			// that a label is being edited even if the label is empty.
			// In Safari and FF, an empty text is represented by <BR> which isn't enough to force a valid size
			if (this.textarea.innerHTML.length == 0 || this.textarea.innerHTML == '<br>')
			{
				this.textarea.innerHTML = this.getEmptyLabelText();
				this.clearOnChange = this.textarea.innerHTML.length > 0;
			}
			else
			{
				this.clearOnChange = false;
			}
		}
	});

	mxEvent.addListener(elt, (!mxClient.IS_IE11 && !mxClient.IS_IE) ? 'input' : 'keyup', keyupHandler);
	mxEvent.addListener(elt, 'cut', keyupHandler);
	mxEvent.addListener(elt, 'paste', keyupHandler);

	// Workaround for cell styles stored in pasted text and applied via span
	// is to remove the added span element so the current cell style is used
	mxEvent.addListener(elt, 'paste', mxUtils.bind(this, function(evt)
	{
		var tmp = this.textarea.getElementsByTagName('span');
		var oldSpans = [];

		for (var i = 0; i < tmp.length; i++)
		{
			oldSpans.push(tmp[i]);
		}

		// Finds the new span element
		window.setTimeout(mxUtils.bind(this, function()
		{
			if (this.textarea != null)
			{
				var newSpans = this.textarea.getElementsByTagName('span');

				for (var i = 0; i < newSpans.length; i++)
				{
					if (i >= oldSpans.length || newSpans[i] != oldSpans[i])
					{
						var child = newSpans[i].firstChild;

						while (child != null)
						{
							var temp = child.nextSibling;

							newSpans[i].parentNode.insertBefore(child, newSpans[i]);
							child = temp;
						}

						newSpans[i].parentNode.removeChild(newSpans[i]);

						break;
					}
				}
			}
		}), 0);
	}));

	// Adds automatic resizing of the textbox while typing using input, keyup and/or DOM change events
	var evtName = (!mxClient.IS_IE11 && !mxClient.IS_IE) ? 'input' : 'keydown';
	
	var resizeHandler = mxUtils.bind(this, function(evt)
	{
		if (this.editingCell != null && this.autoSize && !mxEvent.isConsumed(evt))
		{
			// Asynchronous is needed for keydown and shows better results for input events overall
			// (ie non-blocking and cases where the offsetWidth/-Height was wrong at this time)
			if (this.resizeThread != null)
			{
				window.clearTimeout(this.resizeThread);
			}
			
			this.resizeThread = window.setTimeout(mxUtils.bind(this, function()
			{
				this.resizeThread = null;
				this.resize();
			}), 0);
		}
	});
	
	mxEvent.addListener(elt, evtName, resizeHandler);
	mxEvent.addListener(window, 'resize', resizeHandler);

	if (document.documentMode >= 9)
	{
		mxEvent.addListener(elt, 'DOMNodeRemoved', resizeHandler);
		mxEvent.addListener(elt, 'DOMNodeInserted', resizeHandler);
	}
	else
	{
		mxEvent.addListener(elt, 'cut', resizeHandler);
		mxEvent.addListener(elt, 'paste', resizeHandler);
	}
};

/**
 * Function: isStopEditingEvent
 * 
 * Returns true if the given keydown event should stop cell editing. This
 * returns true if F2 is pressed of if <mxGraph.enterStopsCellEditing> is true
 * and enter is pressed without control or shift.
 */
mxCellEditor.prototype.isStopEditingEvent = function(evt)
{
	return evt.keyCode == 113 /* F2 */ || (this.graph.isEnterStopsCellEditing() &&
		evt.keyCode == 13 /* Enter */ && !mxEvent.isControlDown(evt) &&
		!mxEvent.isShiftDown(evt));
};

/**
 * Function: isEventSource
 * 
 * Returns true if this editor is the source for the given native event.
 */
mxCellEditor.prototype.isEventSource = function(evt)
{
	return mxEvent.getSource(evt) == this.textarea;
};

/**
 * Function: resize
 * 
 * Returns <modified>.
 */
mxCellEditor.prototype.resize = function()
{
	var state = this.graph.getView().getState(this.editingCell);
	
	if (state == null)
	{
		this.stopEditing(true);
	}
	else if (this.textarea != null)
	{
		var isEdge = this.graph.getModel().isEdge(state.cell);
 		var scale = this.graph.getView().scale;
 		var m = null;
		
		if (!this.autoSize || (state.style[mxConstants.STYLE_OVERFLOW] == 'fill'))
		{
			// Specifies the bounds of the editor box
			this.bounds = this.getEditorBounds(state);
			this.textarea.style.width = Math.round(this.bounds.width / scale) + 'px';
			this.textarea.style.height = Math.round(this.bounds.height / scale) + 'px';
			
			// FIXME: Offset when scaled
			if (document.documentMode == 8)
			{
				this.textarea.style.left = Math.round(this.bounds.x) + 'px';
				this.textarea.style.top = Math.round(this.bounds.y) + 'px';
			}
			else
			{
				this.textarea.style.left = Math.max(0, Math.round(this.bounds.x + 1)) + 'px';
				this.textarea.style.top = Math.max(0, Math.round(this.bounds.y + 1)) + 'px';
			}
			
			// Installs native word wrapping and avoids word wrap for empty label placeholder
			if (this.graph.isWrapping(state.cell) && (this.bounds.width >= 2 || this.bounds.height >= 2) &&
				this.textarea.innerHTML != this.getEmptyLabelText())
			{
				this.textarea.style.wordWrap = mxConstants.WORD_WRAP;
				this.textarea.style.whiteSpace = 'normal';
				
				if (state.style[mxConstants.STYLE_OVERFLOW] != 'fill')
				{
					this.textarea.style.width = Math.round(this.bounds.width / scale) + this.wordWrapPadding + 'px';
				}
			}
			else
			{
				this.textarea.style.whiteSpace = 'nowrap';
				
				if (state.style[mxConstants.STYLE_OVERFLOW] != 'fill')
				{
					this.textarea.style.width = '';
				}
			}
		}
		else
	 	{
	 		var lw = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_WIDTH, null);
			m = (state.text != null && this.align == null) ? state.text.margin : null;
			
			if (m == null)
			{
				m = mxUtils.getAlignmentAsPoint(this.align || mxUtils.getValue(state.style,
						mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER),
					mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_ALIGN,
						mxConstants.ALIGN_MIDDLE));
			}
			
	 		if (isEdge)
			{
				this.bounds = new mxRectangle(state.absoluteOffset.x, state.absoluteOffset.y, 0, 0);
				
				if (lw != null)
			 	{
					var tmp = (parseFloat(lw) + 2) * scale;
					this.bounds.width = tmp;
					this.bounds.x += m.x * tmp;
			 	}
			}
			else
			{
				var bds = mxRectangle.fromRectangle(state);
				var hpos = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
				var vpos = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);

				bds = (state.shape != null && hpos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_MIDDLE) ? state.shape.getLabelBounds(bds) : bds;
			 	
			 	if (lw != null)
			 	{
			 		bds.width = parseFloat(lw) * scale;
			 	}
			 	
				 if (!state.view.graph.cellRenderer.legacySpacing ||
					(state.style[mxConstants.STYLE_OVERFLOW] != 'width' &&
					state.style[mxConstants.STYLE_OVERFLOW] != 'block'))
			 	{
					var spacing = parseFloat(mxUtils.getValue(state.style, mxConstants.STYLE_SPACING, 2)) * scale;
					var spacingTop = (parseFloat(mxUtils.getValue(state.style, mxConstants.STYLE_SPACING_TOP, 0)) +
						mxText.prototype.baseSpacingTop) * scale + spacing;
					var spacingRight = (parseFloat(mxUtils.getValue(state.style, mxConstants.STYLE_SPACING_RIGHT, 0)) +
						mxText.prototype.baseSpacingRight) * scale + spacing;
					var spacingBottom = (parseFloat(mxUtils.getValue(state.style, mxConstants.STYLE_SPACING_BOTTOM, 0)) +
						mxText.prototype.baseSpacingBottom) * scale + spacing;
					var spacingLeft = (parseFloat(mxUtils.getValue(state.style, mxConstants.STYLE_SPACING_LEFT, 0)) +
						mxText.prototype.baseSpacingLeft) * scale + spacing;
					
					var hpos = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
					var vpos = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);

					bds = new mxRectangle(bds.x + spacingLeft, bds.y + spacingTop,
						bds.width - ((hpos == mxConstants.ALIGN_CENTER && lw == null) ? (spacingLeft + spacingRight) : 0),
						bds.height - ((vpos == mxConstants.ALIGN_MIDDLE) ? (spacingTop + spacingBottom) : 0));
					
					if (this.graph.isHtmlLabel(state.cell))
					{
						bds.x -= mxSvgCanvas2D.prototype.foreignObjectPadding / 2;
						bds.y -= mxSvgCanvas2D.prototype.foreignObjectPadding / 2;
						bds.width += mxSvgCanvas2D.prototype.foreignObjectPadding;
					}
			 	}

				this.bounds = new mxRectangle(bds.x + state.absoluteOffset.x,
					bds.y + state.absoluteOffset.y, bds.width, bds.height);
			}

			// Needed for word wrap inside text blocks with oversize lines to match the final result where
	 		// the width of the longest line is used as the reference for text alignment in the cell
	 		// TODO: Fix word wrapping preview for edge labels in helloworld.html
			if (this.graph.isWrapping(state.cell) && (this.bounds.width >= 2 || this.bounds.height >= 2))
			{
				this.textarea.style.wordWrap = mxConstants.WORD_WRAP;
				this.textarea.style.whiteSpace = 'normal';

				if (this.textarea.innerHTML != this.getEmptyLabelText())
				{				
					// Forces automatic reflow if text is removed from an oversize label and normal word wrap
					var tmp = Math.round(this.bounds.width / ((document.documentMode == 8) ? scale : scale)) + this.wordWrapPadding;

					if (this.textarea.style.position != 'relative')
					{
						this.textarea.style.width = tmp + 'px';
						
						if (this.textarea.scrollWidth > tmp)
						{
							this.textarea.style.width = this.textarea.scrollWidth + 'px';
						}
					}
					else if (state.style[mxConstants.STYLE_OVERFLOW] == 'block' ||
						state.style[mxConstants.STYLE_OVERFLOW] == 'width')
					{
						if (m.y == -0.5 || state.style[mxConstants.STYLE_OVERFLOW] == 'width')
						{
							this.textarea.style.maxHeight = this.bounds.height + 'px';
						}
						
						this.textarea.style.width = tmp + 'px';
					}
					else
					{
						this.textarea.style.maxWidth = tmp + 'px';
					}
				}
				else
				{
					this.textarea.style.maxWidth = tmp + 'px';
				}
			}
			else
			{
				// KNOWN: Trailing cursor in IE9 quirks mode is not visible
				this.textarea.style.whiteSpace = 'nowrap';
				this.textarea.style.width = '';
			}
			
			// LATER: Keep in visible area, add fine tuning for pixel precision
			// Workaround for wrong measuring in IE8 standards
			if (document.documentMode == 8)
			{
				this.textarea.style.zoom = '1';
				this.textarea.style.height = 'auto';
			}
			
			// TODO: Update CSS width and height if smaller than minResize or remove minResize
			//if (this.minResize != null)
			//{
			//	ow = Math.max(ow, this.minResize.width);
			//	oh = Math.max(oh, this.minResize.height);
			//}
			
			// LATER: Keep in visible area, add fine tuning for pixel precision
			if (document.documentMode == 8)
			{
				var ow = this.textarea.scrollWidth;
				var oh = this.textarea.scrollHeight;
				
				// LATER: Scaled wrapping and position is wrong in IE8
				this.textarea.style.left = Math.max(0, Math.ceil((this.bounds.x - m.x * (this.bounds.width -
					(ow + 1) * scale) + ow * (scale - 1) * 0 + (m.x + 0.5) * 2) / scale)) + 'px';
				this.textarea.style.top = Math.max(0, Math.ceil((this.bounds.y - m.y * (this.bounds.height -
					(oh + 0.5) * scale) + oh * (scale - 1) * 0 + Math.abs(m.y + 0.5) * 1) / scale)) + 'px';
				// Workaround for wrong event handling width and height
				this.textarea.style.width = Math.round(ow * scale) + 'px';
				this.textarea.style.height = Math.round(oh * scale) + 'px';
			}
			else
			{
				this.textarea.style.left = Math.max(0, Math.round(this.bounds.x - m.x *
					(this.bounds.width - 2)) + 1) + 'px';
				this.textarea.style.top = Math.max(0, Math.round(this.bounds.y - m.y *
					(this.bounds.height - 4) + ((m.y == -1) ? 3 : 0)) + 1) + 'px';
			}
	 	}

		mxUtils.setPrefixedStyle(this.textarea.style, 'transformOrigin', '0px 0px');
		mxUtils.setPrefixedStyle(this.textarea.style, 'transform',
			'scale(' + scale + ',' + scale + ')' + ((m == null) ? '' :
			' translate(' + (m.x * 100) + '%,' + (m.y * 100) + '%)'));
	}
};

/**
 * Function: focusLost
 *
 * Called if the textarea has lost focus.
 */
mxCellEditor.prototype.focusLost = function()
{
	this.stopEditing(!this.graph.isInvokesStopCellEditing());
};

/**
 * Function: getBackgroundColor
 * 
 * Returns the background color for the in-place editor. This implementation
 * always returns null.
 */
mxCellEditor.prototype.getBackgroundColor = function(state)
{
	return null;
};

/**
 * Function: getBorderColor
 * 
 * Returns the border color for the in-place editor. This implementation
 * always returns null.
 */
 mxCellEditor.prototype.getBorderColor = function(state)
 {
	 return null;
 };
 
/**
 * Function: isLegacyEditor
 * 
 * Returns true if max-width is not supported or if the SVG root element in
 * in the graph does not have CSS position absolute. In these cases the text
 * editor must use CSS position absolute to avoid an offset but it will have
 * a less accurate line wrapping width during the text editing preview. This
 * implementation returns true if the CSS position of the SVG element is not 
 * absolute.
 */
mxCellEditor.prototype.isLegacyEditor = function()
{
	var absoluteRoot = false;
	
	if (mxClient.IS_SVG)
	{
		var root = this.graph.view.getDrawPane().ownerSVGElement;
		
		if (root != null)
		{
			var css = mxUtils.getCurrentStyle(root);
			
			if (css != null)
			{				
				absoluteRoot = css.position == 'absolute';
			}
		}
	}
	
	return !absoluteRoot;
};

/**
 * Function: updateTextAreaStyle
 *
 * Updates the CSS style of the text area based on the given mxCellState.
 * 
 * Parameters:
 * 
 * state - <mxCellState> that contains the editing cell.
 */
mxCellEditor.prototype.updateTextAreaStyle = function(state)
{
	var scale = this.graph.getView().scale;
	var size = mxUtils.getValue(state.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE);
	var family = mxUtils.getValue(state.style, mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILY);
	var color = mxUtils.getValue(state.style, mxConstants.STYLE_FONTCOLOR, 'black');
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
	this.textarea.style.backgroundColor = this.getBackgroundColor(state);
	this.textarea.style.textDecoration = txtDecor.join(' ');
	this.textarea.style.fontWeight = (bold) ? 'bold' : 'normal';
	this.textarea.style.fontStyle = (italic) ? 'italic' : '';
	this.textarea.style.fontSize = Math.round(size) + 'px';
	this.textarea.style.zIndex = this.zIndex;
	this.textarea.style.fontFamily = family;
	this.textarea.style.textAlign = align;
	this.textarea.style.outline = 'none';
	this.textarea.style.color = color;

	var borderColor = this.getBorderColor(state);

	if (borderColor != null)
	{
		this.textarea.style.border = '1px solid ' + borderColor;
	}
	else
	{
		this.textarea.style.border = 'none';
	}
			
	var dir = this.textDirection = mxUtils.getValue(state.style, mxConstants.STYLE_TEXT_DIRECTION, mxConstants.DEFAULT_TEXT_DIRECTION);
	
	if (dir == mxConstants.TEXT_DIRECTION_AUTO)
	{
		if (state != null && state.text != null && state.text.dialect != mxConstants.DIALECT_STRICTHTML &&
			!mxUtils.isNode(state.text.value))
		{
			dir = state.text.getAutoDirection();
		}
	}
	
	if (dir == mxConstants.TEXT_DIRECTION_LTR || dir == mxConstants.TEXT_DIRECTION_RTL)
	{
		this.textarea.setAttribute('dir', dir);
	}
	else
	{
		this.textarea.removeAttribute('dir');
	}
};

/**
 * Function: startEditing
 *
 * Starts the editor for the given cell.
 * 
 * Parameters:
 * 
 * cell - <mxCell> to start editing.
 * trigger - Optional mouse event that triggered the editor.
 */
mxCellEditor.prototype.startEditing = function(cell, trigger)
{
	this.stopEditing(true);
	this.align = null;
	
	// Creates new textarea instance
	if (this.textarea == null)
	{
		this.init();
	}
	
	if (this.graph.tooltipHandler != null)
	{
		this.graph.tooltipHandler.hideTooltip();
	}
	
	var state = this.graph.getView().getState(cell);
	
	if (state != null)
	{
		this.updateTextAreaStyle(state);

		// Sets the initial editing value
		this.textarea.innerHTML = this.getInitialValue(state, trigger) || '';
		this.initialValue = this.textarea.innerHTML;

		// Uses an optional text value for empty labels which is cleared
		// when the first keystroke appears. This makes it easier to see
		// that a label is being edited even if the label is empty.
		if (this.textarea.innerHTML.length == 0 || this.textarea.innerHTML == '<br>')
		{
			this.textarea.innerHTML = this.getEmptyLabelText();
			this.clearOnChange = true;
		}
		else
		{
			this.clearOnChange = this.textarea.innerHTML == this.getEmptyLabelText();
		}

		this.graph.container.appendChild(this.textarea);
		
		// Update this after firing all potential events that could update the cleanOnChange flag
		this.editingCell = cell;
		this.trigger = trigger;
		this.textNode = null;

		if (state.text != null && this.isHideLabel(state))
		{
			this.textNode = state.text.node;
			this.textNode.style.visibility = 'hidden';
		}

		// Workaround for initial offsetHeight not ready for heading in markup
		if (this.autoSize && (this.graph.model.isEdge(state.cell) || state.style[mxConstants.STYLE_OVERFLOW] != 'fill'))
		{
			window.setTimeout(mxUtils.bind(this, function()
			{
				this.resize();
			}), 0);
		}
		
		this.resize();
		
		// Workaround for NS_ERROR_FAILURE in FF
		try
		{
			// Prefers blinking cursor over no selected text if empty
			var y0 = this.graph.container.scrollTop;
			var x0 = this.graph.container.scrollLeft;
			this.textarea.focus();
			this.graph.container.scrollTop = y0;
			this.graph.container.scrollLeft = x0;
			this.textarea.scrollIntoView(
				{block: 'nearest', inline: 'nearest'});
			
			if (this.isSelectText() && this.textarea.innerHTML.length > 0 &&
				(this.textarea.innerHTML != this.getEmptyLabelText() || !this.clearOnChange))
			{
				document.execCommand('selectAll', false, null);
			}
		}
		catch (e)
		{
			// ignore
		}
	}
};

/**
 * Function: isSelectText
 * 
 * Returns <selectText>.
 */
mxCellEditor.prototype.isSelectText = function()
{
	return this.selectText;
};

/**
 * Function: clearSelection
 * 
 * Clears the selection.
 */
mxCellEditor.prototype.clearSelection = function()
{
	var selection = null;
	
	if (window.getSelection)
	{
		selection = window.getSelection();
	}
	else if (document.selection)
	{
		selection = document.selection;
	}
	
	if (selection != null)
	{
		if (selection.empty)
		{
			selection.empty();
		}
		else if (selection.removeAllRanges)
		{
			selection.removeAllRanges();
		}
	}
};

/**
 * Function: stopEditing
 *
 * Stops the editor and applies the value if cancel is false.
 */
mxCellEditor.prototype.stopEditing = function(cancel)
{
	cancel = cancel || false;
	
	if (this.editingCell != null)
	{
		if (this.textNode != null)
		{
			this.textNode.style.visibility = 'visible';
			this.textNode = null;
		}

		var state = (!cancel) ? this.graph.view.getState(this.editingCell) : null;

		var initial = this.initialValue;
		this.initialValue = null;
		this.editingCell = null;
		this.trigger = null;
		this.bounds = null;
		this.textarea.blur();
		this.clearSelection();
		
		if (this.textarea.parentNode != null)
		{
			this.textarea.parentNode.removeChild(this.textarea);
		}
		
		if (this.clearOnChange && this.textarea.innerHTML == this.getEmptyLabelText())
		{
			this.textarea.innerText = '';
			this.clearOnChange = false;
		}

		if (state != null && (this.textarea.innerHTML != initial || this.align != null))
		{
			this.prepareTextarea();
			var value = this.getCurrentValue(state);
			
			this.graph.getModel().beginUpdate();
			try
			{
				if (value != null)
				{
					this.applyValue(state, value);
				}
				
				if (this.align != null)
				{
					this.graph.setCellStyles(mxConstants.STYLE_ALIGN, this.align, [state.cell]);
				}
			}
			finally
			{
				this.graph.getModel().endUpdate();
			}
		}
		
		// Forces new instance on next edit for undo history reset
		mxEvent.release(this.textarea);
		this.textarea = null;
		this.align = null;
	}
};

/**
 * Function: prepareTextarea
 * 
 * Prepares the textarea for getting its value in <stopEditing>.
 * This implementation removes the extra trailing linefeed in Firefox.
 */
mxCellEditor.prototype.prepareTextarea = function()
{
	if (this.textarea.lastChild != null &&
		this.textarea.lastChild.nodeName == 'BR')
	{
		this.textarea.removeChild(this.textarea.lastChild);
	}
};

/**
 * Function: isHideLabel
 * 
 * Returns true if the label should be hidden while the cell is being
 * edited.
 */
mxCellEditor.prototype.isHideLabel = function(state)
{
	return true;
};

/**
 * Function: getMinimumSize
 * 
 * Returns the minimum width and height for editing the given state.
 */
mxCellEditor.prototype.getMinimumSize = function(state)
{
	var scale = this.graph.getView().scale;
	
	return new mxRectangle(0, 0, (state.text == null) ? 30 : state.text.size * scale + 20,
			(this.textarea.style.textAlign == 'left') ? 120 : 40);
};

/**
 * Function: getEditorBounds
 * 
 * Returns the <mxRectangle> that defines the bounds of the editor.
 */
mxCellEditor.prototype.getEditorBounds = function(state)
{
	var isEdge = this.graph.getModel().isEdge(state.cell);
	var scale = this.graph.getView().scale;
	var minSize = this.getMinimumSize(state);
	var minWidth = minSize.width;
 	var minHeight = minSize.height;
 	var result = null;
 	
 	if (!isEdge && state.view.graph.cellRenderer.legacySpacing && state.style[mxConstants.STYLE_OVERFLOW] == 'fill')
 	{
 		result = state.shape.getLabelBounds(mxRectangle.fromRectangle(state));
 	}
 	else
 	{
		var spacing = parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING, 2)) * scale;
		var spacingTop = (parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING_TOP, 0)) +
			mxText.prototype.baseSpacingTop) * scale + spacing;
		var spacingRight = (parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING_RIGHT, 0)) +
			mxText.prototype.baseSpacingRight) * scale + spacing;
		var spacingBottom = (parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING_BOTTOM, 0)) +
			mxText.prototype.baseSpacingBottom) * scale + spacing;
		var spacingLeft = (parseFloat(mxUtils.getValue(style, mxConstants.STYLE_SPACING_LEFT, 0)) +
			mxText.prototype.baseSpacingLeft) * scale + spacing;
	 	result = new mxRectangle(state.x, state.y,
	 		 Math.max(minWidth, state.width - spacingLeft - spacingRight),
	 		 Math.max(minHeight, state.height - spacingTop - spacingBottom));
		var hpos = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION,
			mxConstants.ALIGN_CENTER);
		var vpos = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION,
			mxConstants.ALIGN_MIDDLE);

		if (this.graph.isHtmlLabel(state.cell))
		{
			result.width += mxSvgCanvas2D.prototype.foreignObjectPadding;
		}
		
		result = (state.shape != null && hpos == mxConstants.ALIGN_CENTER &&
			vpos == mxConstants.ALIGN_MIDDLE) ? state.shape.getLabelBounds(result) : result;
	
		if (isEdge)
		{
			result.x = state.absoluteOffset.x;
			result.y = state.absoluteOffset.y;
	
			if (state.text != null && state.text.boundingBox != null)
			{
				// Workaround for label containing just spaces in which case
				// the bounding box location contains negative numbers 
				if (state.text.boundingBox.x > 0)
				{
					result.x = state.text.boundingBox.x;
				}
				
				if (state.text.boundingBox.y > 0)
				{
					result.y = state.text.boundingBox.y;
				}
			}
		}
		else if (state.text != null && state.text.boundingBox != null)
		{
			result.x = Math.min(result.x, state.text.boundingBox.x);
			result.y = Math.min(result.y, state.text.boundingBox.y);
		}
	
		result.x += spacingLeft;
		result.y += spacingTop;
	
		if (state.text != null && state.text.boundingBox != null)
		{
			if (!isEdge)
			{
				result.width = Math.max(result.width, state.text.boundingBox.width);
				result.height = Math.max(result.height, state.text.boundingBox.height);
			}
			else
			{
				result.width = Math.max(minWidth, state.text.boundingBox.width);
				result.height = Math.max(minHeight, state.text.boundingBox.height);
			}
		}
		
		// Applies the horizontal and vertical label positions
		if (this.graph.getModel().isVertex(state.cell))
		{
			var horizontal = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
	
			if (horizontal == mxConstants.ALIGN_LEFT)
			{
				result.x -= state.width;
			}
			else if (horizontal == mxConstants.ALIGN_RIGHT)
			{
				result.x += state.width;
			}
	
			var vertical = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
	
			if (vertical == mxConstants.ALIGN_TOP)
			{
				result.y -= state.height;
			}
			else if (vertical == mxConstants.ALIGN_BOTTOM)
			{
				result.y += state.height;
			}
		}
 	}
 	
 	return new mxRectangle(Math.round(result.x), Math.round(result.y), Math.round(result.width), Math.round(result.height));
};

/**
 * Function: getEmptyLabelText
 *
 * Returns the initial label value to be used of the label of the given
 * cell is empty. This label is displayed and cleared on the first keystroke.
 * This implementation returns <emptyLabelText>.
 * 
 * Parameters:
 * 
 * cell - <mxCell> for which a text for an empty editing box should be
 * returned.
 */
mxCellEditor.prototype.getEmptyLabelText = function (cell)
{
	return this.emptyLabelText;
};

/**
 * Function: getEditingCell
 *
 * Returns the cell that is currently being edited or null if no cell is
 * being edited.
 */
mxCellEditor.prototype.getEditingCell = function ()
{
	return this.editingCell;
};

/**
 * Function: destroy
 *
 * Destroys the editor and removes all associated resources.
 */
mxCellEditor.prototype.destroy = function ()
{
	if (this.textarea != null)
	{
		mxEvent.release(this.textarea);
		
		if (this.textarea.parentNode != null)
		{
			this.textarea.parentNode.removeChild(this.textarea);
		}
		
		this.textarea = null;
	}
	
	if (this.changeHandler != null)
	{
		this.graph.getModel().removeListener(this.changeHandler);
		this.changeHandler = null;
	}

	if (this.zoomHandler)
	{
		if (this.graph.container != null)
		{
			mxEvent.removeListener(this.graph.container, 'scroll', this.zoomHandler);
		}

		this.graph.view.removeListener(this.zoomHandler);
		this.zoomHandler = null;
	}
};
