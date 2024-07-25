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
 * Variable: rotateText
 * 
 * Specifies if text editing should allow rotated text. Default is true.
 */
mxCellEditor.prototype.rotateText = true;

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
mxCellEditor.prototype.textNode = null;

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
	var state = this.graph.getView().getState(this.editingCell);

	if (this.textarea != null && state != null)
	{
		var dir = mxUtils.getValue(state.style, mxConstants.STYLE_TEXT_DIRECTION,
			mxConstants.DEFAULT_TEXT_DIRECTION);

		if (dir == null || dir.substring(0, 9) != 'vertical-')
		{
			this.textarea.style.textAlign = align;
		}
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
	result = mxUtils.replaceTrailingNewlines(result, '<div><br></div>');
    
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
			if ((this.textarea.innerHTML.length == 0 || this.textarea.innerHTML == '<br>') &&
				this.textarea.innerHTML != this.getEmptyLabelText())
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
	mxEvent.addListener(elt, 'cut', resizeHandler);
	mxEvent.addListener(elt, 'paste', resizeHandler);
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
		var m = mxUtils.getAlignmentAsPoint((this.align != null) ? this.align :
		   this.textShape.align, this.textShape.valign);
		this.bounds = this.graph.cellRenderer.getLabelBounds(state,
			this.textShape, m, !this.rotateText);
		var deg = (this.rotateText) ? this.textShape.getTextRotation() : 0;
		var scale = this.graph.getView().scale;
		
		// Corrects border offset
		this.bounds.x += (m.x == -0.5) ? 0 : (m.x == 0 ? -scale : scale);
		this.bounds.y += (m.y == -0.5) ? 0 : (m.y == 0 ? -scale : scale);
		
		this.textarea.style.left = Math.max(0, Math.round(this.bounds.x)) + 'px';
		this.textarea.style.top = Math.max(0, Math.round(this.bounds.y)) + 'px';
		
		if (!this.autoSize || (state.style[mxConstants.STYLE_OVERFLOW] == 'fill'))
		{
			this.textarea.style.width = Math.round(this.bounds.width / scale) + 'px';
			this.textarea.style.height = Math.round(this.bounds.height / scale) + 'px';
			
			// Installs native word wrapping and avoids word wrap for empty label placeholder
			if (this.graph.isWrapping(state.cell) && (this.bounds.width >= 2 || this.bounds.height >= 2) &&
				this.textarea.innerHTML != this.getEmptyLabelText())
			{
				this.textarea.style.wordWrap = mxConstants.WORD_WRAP;
				this.textarea.style.whiteSpace = 'normal';
				
				if (state.style[mxConstants.STYLE_OVERFLOW] != 'fill')
				{
					this.textarea.style.width = Math.round(this.bounds.width / scale) + 'px';
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
			// Needed for word wrap inside text blocks with oversize lines to match the final result where
	 		// the width of the longest line is used as the reference for text alignment in the cell
	 		// TODO: Fix word wrapping preview for edge labels in helloworld.html
			if (this.graph.isWrapping(state.cell) && (this.bounds.width >= 2 || this.bounds.height >= 2))
			{
				var dir = mxUtils.getValue(state.style, mxConstants.STYLE_TEXT_DIRECTION,
					mxConstants.DEFAULT_TEXT_DIRECTION);
				var vertical = dir != null && dir.substring(0, 9) == 'vertical-';
				this.textarea.style.wordWrap = mxConstants.WORD_WRAP;
				this.textarea.style.whiteSpace = 'normal';

				if (state.style[mxConstants.STYLE_OVERFLOW] == 'block' ||
					state.style[mxConstants.STYLE_OVERFLOW] == 'width')
				{
					this.bounds.width -= 2 * scale;
				}
				else if (state.view.graph.isHtmlLabel(state.cell))
				{
					this.bounds.width += mxSvgCanvas2D.prototype.foreignObjectPadding * scale;
				}

				if (this.textarea.innerHTML != this.getEmptyLabelText())
				{
					if (state.style[mxConstants.STYLE_OVERFLOW] == 'block' ||
						state.style[mxConstants.STYLE_OVERFLOW] == 'width')
					{
						if (m.y == -0.5 || state.style[mxConstants.STYLE_OVERFLOW] == 'width')
						{
							this.textarea.style.maxHeight = Math.round(this.bounds.height / scale) + 'px';
						}
						
						this.textarea.style.width = Math.round(this.bounds.width / scale) + 'px';
					}
					else if (vertical)
					{
						this.textarea.style.maxHeight = Math.round(this.bounds.height / scale) + 'px';
					}
					else
					{
						this.textarea.style.maxWidth = Math.round(this.bounds.width / scale) + 'px';
					}
				}
				else
				{
					this.textarea.style.maxWidth = Math.round(this.bounds.width / scale) + 'px';
				}
			}
			else
			{
				// KNOWN: Trailing cursor in IE9 quirks mode is not visible
				this.textarea.style.whiteSpace = 'nowrap';
				this.textarea.style.width = '';
			}
	 	}

		mxUtils.setPrefixedStyle(this.textarea.style,
			'transformOrigin', '0px 0px');
		mxUtils.setPrefixedStyle(this.textarea.style, 'transform',
			((deg != 0) ? 'rotate(' + deg + 'deg) ' : '') +
			'scale(' + scale + ',' + scale + ')' +
			' translate(' + (m.x * 100) + '%,' +
			(m.y * 100) + '%)');
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
	var size = mxUtils.getValue(state.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE);
	var family = mxUtils.getValue(state.style, mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILY);
	var color = mxUtils.getValue(state.style, mxConstants.STYLE_FONTCOLOR, 'black');
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
	
	this.textarea.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ?
		Math.round(size * mxConstants.LINE_HEIGHT) + 'px' : mxConstants.LINE_HEIGHT;
	this.textarea.style.backgroundColor = this.getBackgroundColor(state);
	this.textarea.style.textDecoration = txtDecor.join(' ');
	this.textarea.style.fontWeight = (bold) ? 'bold' : 'normal';
	this.textarea.style.fontStyle = (italic) ? 'italic' : '';
	this.textarea.style.fontSize = Math.round(size) + 'px';
	this.textarea.style.zIndex = this.zIndex;
	this.textarea.style.fontFamily = mxUtils.parseCssFontFamily(family);
	this.textarea.style.writingMode = '';
	this.textarea.style.color = color;

	// Border must not be 0 to avoid vertical space collapsing in block element
	var borderColor = this.getBorderColor(state);

	if (borderColor != null)
	{
		this.textarea.style.border = '1px solid ' + borderColor;
	}
	else
	{
		this.textarea.style.border = '1px solid transparent';
	}
			
	var dir = mxUtils.getValue(state.style, mxConstants.STYLE_TEXT_DIRECTION,
		mxConstants.DEFAULT_TEXT_DIRECTION);
	var align = mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN,
		mxConstants.ALIGN_LEFT);
	this.textarea.removeAttribute('dir');
	
	if (dir == mxConstants.TEXT_DIRECTION_AUTO)
	{
		if (state != null && state.text != null &&
			state.text.dialect != mxConstants.DIALECT_STRICTHTML &&
			!mxUtils.isNode(state.text.value))
		{
			dir = state.text.getAutoDirection();
		}
	}

	if (dir == mxConstants.TEXT_DIRECTION_LTR ||
		dir == mxConstants.TEXT_DIRECTION_RTL)
	{
		this.textarea.setAttribute('dir', dir);
	}
	else if (dir == mxConstants.TEXT_DIRECTION_VERTICAL_LR ||
		dir == mxConstants.TEXT_DIRECTION_VERTICAL_RL)
	{
		var valign = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_ALIGN,
			mxConstants.ALIGN_MIDDLE);
		align = (valign == mxConstants.ALIGN_TOP) ? 'left' :
			((valign == mxConstants.ALIGN_BOTTOM) ? 'right' : 'center');
		this.textarea.style.writingMode = dir;
	}

	this.textarea.style.textAlign = align;
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
 * initialText - Optional string that specifies the initial editing value.
 */
mxCellEditor.prototype.startEditing = function(cell, trigger, initialText)
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
		
		// Update this after firing all potential events that could update the cleanOnChange flag
		this.textShape = state.text;
		this.editingCell = cell;
		this.trigger = trigger;

		if (this.textShape == null)
		{
			this.textShape = this.graph.cellRenderer.createTextShape(state, '', this.graph.dialect);
		}

		var fn = mxUtils.bind(this, function()
		{
			if (this.editingCell != null)
			{
				if (this.textShape != null && this.textShape.node != null &&
					this.isHideLabel(state))
				{
					this.textNode = this.textShape.node;
					this.textNode.style.visibility = 'hidden';
				}

				this.resize();
				this.graph.container.appendChild(this.textarea);

				// Moves shape to upper third of screen for possible on-screen keyboard
				if (mxClient.IS_IOS)
				{
					this.graph.container.scrollTop = Math.max(this.graph.container.scrollTop,
						state.y + state.height - this.graph.container.clientHeight / 3);
				}

				this.textarea.scrollIntoView(
					{block: 'nearest', inline: 'nearest'});
				this.textarea.focus();
				
				if (initialText != null)
				{
					this.textarea.innerHTML = initialText;

					// Moves cursor after initial text
					var range = document.createRange();
					range.selectNodeContents(this.textarea);
					range.collapse(false);
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				}
				else if (this.isSelectText() && this.textarea.innerHTML.length > 0 &&
					(this.textarea.innerHTML != this.getEmptyLabelText() ||
					!this.clearOnChange))
				{
					document.execCommand('selectAll', false, null);
				}
			}
		});
		
		// Asynchronous does not show on-screen keyboard on iOS
		if (mxClient.IS_IOS)
		{
			fn();
		}
		else
		{
			window.setTimeout(fn, 0);
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
		this.textShape = null;
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
	
	return new mxRectangle(0, 0, (state.text == null) ?
			30 : state.text.size * scale + 20,
		(this.textarea.style.textAlign == 'left') ? 120 : 40);
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
