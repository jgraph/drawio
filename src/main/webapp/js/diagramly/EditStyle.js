/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Edit Style on the Code template in every look (Fusion ideas in Simple and
 * Classic): the style of the selected cell in a code field with line numbers,
 * its keys, separators and values in their colours and its colors with
 * swatches, a live preview of the shape that follows typing, the option one
 * property per line (stored for the user, styleLines of mxSettings) and Copy
 * Style. The dialog is the TextareaDialog of the action editStyle... (the
 * Edit menu, the context menu, Ctrl+E and Edit of the Format panel): its text
 * area and its buttons move into the new layout, and the lines are joined
 * before its Apply runs, so the style is applied as before.
 *
 * The layout (EditorUi.createEditStyleLayout) takes a skin: the Classic skin
 * (EditStyle.skins.classic, docs/dialog-style-guide.md, its CSS in
 * grapheditor.css under .geEditStyle, which takes the colors, the font and
 * the corners of the other dialogs of the theme) for Classic, Simple,
 * Sketch, Minimal and Atlas behind the feature editStyleDialog of
 * Editor.featureDefaults (Editor.isEditStyleDialogEnabled), or the skin of
 * Fusion, which SimpleForms.js adds (EditStyle.skins.fusion), so the code
 * exists once.
 * Where the feature is off the dialog of before is shown.
 */
var EditStyle = {};

/**
 * Size of the content of the dialog in the Classic skin (the frame adds 48),
 * the size of the Code template of Fusion, limited to the window
 * (EditorUi.layoutEditStyleDialog).
 */
EditStyle.size = {width: 672, height: 452};

/**
 * Smallest size of the content of the dialog in the Classic skin, which can
 * be resized.
 */
EditStyle.minSize = {width: 480, height: 320};

/**
 * Space between the frame of the dialog and the window in the Classic skin.
 */
EditStyle.windowMargin = 32;

/**
 * Key of the size of the dialog in the Classic skin that the user has
 * resized (mxSettings.getWindowState): not the one of the dialog of before,
 * whose smaller size would shrink the new layout.
 */
EditStyle.windowKey = 'editStyleCode';

/**
 * Delay of the preview after typing (ms).
 */
EditStyle.previewDelay = 200;

/**
 * Longest code that is coloured (characters); longer code is plain text.
 */
EditStyle.colorMax = 100000;

/**
 * Keys of styles whose values are colors besides the keys that end with
 * Color (see EditStyle.isColor).
 */
EditStyle.colorKeys = ['imageBackground', 'imageBorder'];

/**
 * The start of a line that starts a property: a key and = or the name of a
 * style (eg. ellipse) on its own (see EditStyle.nextSeparator).
 */
EditStyle.propertyStart = /^[ \t\r]*[A-Za-z_][\w.\-]*[ \t\r]*(=|;|\n|$)/;

/**
 * Returns the index of the next separator of the properties of the given
 * style from the given index on, or -1 if there is none: a semicolon, or a
 * line break where the next line starts a property (EditStyle.propertyStart).
 * Other lines continue the value before them, so a value on several lines
 * (eg. a points array of JSON, which the dialog of before kept) stays one
 * property.
 */
EditStyle.nextSeparator = function(style, from)
{
	var separator = /[;\n]/g;
	separator.lastIndex = from;
	var match = separator.exec(style);

	// Keys and names of styles are short: the start of the next line is enough
	while (match != null && match[0] == '\n' && !EditStyle.propertyStart.test(
		style.substring(match.index + 1, match.index + 129)))
	{
		match = separator.exec(style);
	}

	return (match != null) ? match.index : -1;
};

/**
 * Returns the given style with one property per line or in one line.
 */
EditStyle.formatStyle = function(style, lines)
{
	// Semicolons and lines that start a property separate the properties
	// (EditStyle.nextSeparator), a leading semicolon (no default style, see
	// mxStylesheet.getCellStyle) is kept
	var leading = mxUtils.trim(style).charAt(0) == ';';
	var result = [];
	var start = 0;

	while (start <= style.length)
	{
		var end = EditStyle.nextSeparator(style, start);
		end = (end < 0) ? style.length : end;
		var part = mxUtils.trim(style.substring(start, end));

		if (part.length > 0)
		{
			result.push(part + ';');
		}

		start = end + 1;
	}

	return ((leading) ? ';' + ((lines) ? '\n' : '') : '') + result.join((lines) ? '\n' : '');
};

/**
 * Returns true if the given value of the given key of a style is a color
 * that has a swatch in Edit Style: keys that end with Color and
 * EditStyle.colorKeys, values that are CSS colors other than none,
 * default, inherit and transparent.
 */
EditStyle.isColor = function(key, value)
{
	return (/color$/i.test(key) || mxUtils.indexOf(EditStyle.colorKeys, key) >= 0) &&
		!/^(none|default|inherit|transparent)$/i.test(value) && typeof CSS !== 'undefined' &&
		typeof CSS.supports === 'function' && CSS.supports('color', value);
};

/**
 * Fills the given layer of the code of Edit Style (see EditStyle.addCodeColors)
 * with the given style: the keys, the separators = and ; and the values
 * in their colours (the classes key, mark, color and swatch of the given
 * skin), colors with swatches at the end of their line (one property per
 * line, lines is true) or underlined in their color. The text is written as
 * text. Each swatch has the color it shows as codeColor: its key, its value
 * and where the value is in the given style ({key, value, start, end}), so
 * a click can replace it (see EditStyle.addCodeColors).
 */
EditStyle.fillCode = function(layer, style, lines, skin)
{
	var classes = skin.classes;
	var colors = [];

	var write = function(text, className)
	{
		if (text.length > 0)
		{
			var node = document.createTextNode(text);

			if (className != null)
			{
				var span = document.createElement('span');
				span.className = className;
				span.appendChild(node);
				node = span;
			}

			layer.appendChild(node);

			return node;
		}

		return null;
	};

	// The swatches of a line after its text (no text follows them)
	var swatches = function()
	{
		for (var i = 0; i < colors.length; i++)
		{
			var anchor = document.createElement('span');
			anchor.className = classes.swatch;
			var swatch = document.createElement('span');
			swatch.style.left = (8 + 16 * i) + 'px';

			// Only CSS colors (see isColor) as a property
			swatch.style.backgroundColor = colors[i].value;
			swatch.codeColor = colors[i];
			anchor.appendChild(swatch);
			layer.appendChild(anchor);
		}

		colors = [];
	};

	// The properties as formatStyle separates them (a value on several lines
	// is one property)
	var start = 0;

	while (true)
	{
		var end = EditStyle.nextSeparator(style, start);
		var match = (end >= 0) ? style.charAt(end) : null;
		end = (end >= 0) ? end : style.length;
		var part = style.substring(start, end);
		var eq = part.indexOf('=');
		var lead = /^\s*/.exec(part)[0];
		write(lead);

		if (eq < 0)
		{
			// A name of a style (eg. ellipse)
			write(part.substring(lead.length), classes.key);
		}
		else
		{
			var key = part.substring(lead.length, eq);
			var value = part.substring(eq + 1);
			var color = mxUtils.trim(value);
			write(key, classes.key);
			write('=', classes.mark);

			if (value.length > 0 && EditStyle.isColor(mxUtils.trim(key), color))
			{
				if (lines)
				{
					// The value without the spaces around it
					var at = start + eq + 1 + value.length - mxUtils.ltrim(value).length;
					write(value);
					colors.push({key: mxUtils.trim(key), value: color, start: at, end: at + color.length});
				}
				else
				{
					write(value, classes.color).style.textDecorationColor = color;
				}
			}
			else
			{
				write(value);
			}
		}

		if (match == null || match == '\n')
		{
			swatches();
		}

		if (match == null)
		{
			break;
		}

		write(match, (match == ';') ? classes.mark : null);
		start = end + 1;
	}
};

/**
 * Colours the code of the given text area: a layer over the text area
 * (without pointer events, hidden from screen readers, the class layer of the
 * given skin) shows its text as the given function fills it (it gets the
 * layer and the text), and the text of the text area is transparent while its
 * parent has the class colored of the skin, so its caret, selection and
 * scrolling stay. The layer follows typing, scrolling, the size and the
 * wrapping of the text area; values set by code call the returned function.
 * Code longer than the colorMax of the skin (EditStyle.colorMax if it has
 * none) is plain text. With the optional function pick the swatches of the
 * layer are buttons (see EditStyle.addSwatchButtons).
 */
EditStyle.addCodeColors = function(text, fill, skin, pick)
{
	var classes = skin.classes;
	var parent = text.parentNode;
	var layer = document.createElement('div');
	layer.className = classes.layer;
	layer.setAttribute('aria-hidden', 'true');

	// The text of the text area once more: inert keeps it out of the
	// browser's Find (only the text area is found, once per match)
	layer.setAttribute('inert', '');
	parent.insertBefore(layer, text.nextSibling);

	// The text of the layer is laid out like the text of the text area
	var props = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontFamily',
		'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'wordSpacing',
		'tabSize', 'textIndent', 'whiteSpace', 'wordBreak', 'overflowWrap'];

	var buttons = (typeof pick === 'function' && classes.swatches != null) ?
		EditStyle.addSwatchButtons(text, layer, skin, pick) : null;

	var scroll = function()
	{
		layer.scrollTop = text.scrollTop;
		layer.scrollLeft = text.scrollLeft;

		if (buttons != null)
		{
			buttons.scroll();
		}
	};

	var place = function()
	{
		if (parent.classList.contains(classes.colored))
		{
			var css = window.getComputedStyle(text);

			for (var i = 0; i < props.length; i++)
			{
				layer.style[props[i]] = css[props[i]];
			}

			// Without the scroll bars of the text area, which take the width
			// that the text wraps in
			layer.style.left = text.offsetLeft + 'px';
			layer.style.top = text.offsetTop + 'px';
			layer.style.width = text.clientWidth + 'px';
			layer.style.height = text.clientHeight + 'px';
			scroll();

			if (buttons != null)
			{
				buttons.update();
			}
		}
	};

	var update = function()
	{
		var max = (typeof skin.getColorMax === 'function') ? skin.getColorMax() : EditStyle.colorMax;
		var on = text.value.length <= max;
		parent.classList.toggle(classes.colored, on);
		layer.textContent = '';

		if (on)
		{
			fill(layer, text.value);

			// A last empty line of the text area has a height
			layer.appendChild(document.createTextNode('\n'));
			place();
		}
		else if (buttons != null)
		{
			buttons.update();
		}
	};

	mxEvent.addListener(text, 'input', update);
	mxEvent.addListener(text, 'scroll', scroll);

	if (typeof ResizeObserver !== 'undefined')
	{
		new ResizeObserver(place).observe(text);
	}

	update();

	return update;
};

/**
 * Room around a swatch button that stays in view when the button gets the
 * focus (the ring of the focus).
 */
EditStyle.swatchMargin = 4;

/**
 * Scrolls the given text area as little as it takes to show the given box of
 * its content ({x, y, w, h}, the codeBox of a swatch button, see
 * EditStyle.addSwatchButtons) with EditStyle.swatchMargin around it.
 */
EditStyle.scrollToBox = function(text, b)
{
	var m = EditStyle.swatchMargin;

	if (b.y - m < text.scrollTop)
	{
		text.scrollTop = Math.max(0, b.y - m);
	}
	else if (b.y + b.h + m > text.scrollTop + text.clientHeight)
	{
		text.scrollTop = b.y + b.h + m - text.clientHeight;
	}

	if (b.x - m < text.scrollLeft)
	{
		text.scrollLeft = Math.max(0, b.x - m);
	}
	else if (b.x + b.w + m > text.scrollLeft + text.clientWidth)
	{
		text.scrollLeft = b.x + b.w + m - text.clientWidth;
	}
};

/**
 * Makes the swatches of the given layer of the code of the given text area
 * (EditStyle.addCodeColors, EditStyle.fillCode) buttons: a click, a tap,
 * Enter or Space call the given function with the color of the swatch
 * ({key, value, start, end}), the button and how it was used ('keyboard',
 * 'mouse', 'pen' or 'touch'). The layer is inert and lets the pointer
 * through, so the buttons are in a layer of their own under it, over the
 * text area (the class swatches of the given skin): transparent boxes of the
 * height of a line around the swatches, whose hover and focus show around
 * the swatch of the layer, after the text of their line (a tap on a button
 * neither focuses the text area nor selects text). They are clipped to the
 * text area and follow its scrolling; buttons out of view are hidden, so
 * Tab never scrolls to them. The buttons are one stop of Tab, a toolbar
 * with a roving tabindex (the arrow keys, Home and End move between them
 * and scroll the text area to the button). Returns the functions that put
 * the buttons on the swatches of the layer (update) and that scroll them
 * with the layer (scroll).
 */
EditStyle.addSwatchButtons = function(text, layer, skin, pick)
{
	var parent = text.parentNode;
	var div = document.createElement('div');
	div.className = skin.classes.swatches;
	div.setAttribute('role', 'toolbar');
	div.setAttribute('aria-orientation', 'vertical');
	div.setAttribute('aria-label', mxResources.get('swatches'));
	var inner = document.createElement('div');
	div.appendChild(inner);

	// Under the layer, which paints its swatches over the states of the buttons
	parent.insertBefore(div, layer);
	var buttons = inner.children;
	var current = 0;

	var isFocused = function()
	{
		return document.activeElement != null && document.activeElement.parentNode == inner;
	};

	// Buttons out of view are hidden (not after the focus, which they keep),
	// and the stop of Tab is a button in view
	var scroll = function()
	{
		var x = layer.scrollLeft;
		var y = layer.scrollTop;
		var w = layer.clientWidth;
		var h = layer.clientHeight;
		inner.style.transform = 'translate(' + (-x) + 'px,' + (-y) + 'px)';
		var first = -1;

		var isWhole = function(box)
		{
			return box.x >= x && box.y >= y && box.x + box.w <= x + w && box.y + box.h <= y + h;
		};

		for (var i = 0; i < buttons.length; i++)
		{
			var box = buttons[i].codeBox;
			var out = box.x + box.w <= x || box.y + box.h <= y || box.x >= x + w || box.y >= y + h;
			buttons[i].style.visibility = (out && document.activeElement != buttons[i]) ? 'hidden' : '';

			if (first < 0 && isWhole(box))
			{
				first = i;
			}
		}

		if (!isFocused() && first >= 0 && (current >= buttons.length || !isWhole(buttons[current].codeBox)))
		{
			setCurrent(first);
		}
	};

	var setCurrent = function(index)
	{
		current = Math.max(0, Math.min(index, buttons.length - 1));

		for (var i = 0; i < buttons.length; i++)
		{
			buttons[i].setAttribute('tabindex', (i == current) ? '0' : '-1');
		}
	};

	// Scrolls the text area to the given button (the layers follow it)
	var reveal = function(btn)
	{
		EditStyle.scrollToBox(text, btn.codeBox);
		layer.scrollTop = text.scrollTop;
		layer.scrollLeft = text.scrollLeft;
		btn.style.visibility = '';
		scroll();
	};

	var click = function(evt)
	{
		var btn = evt.currentTarget;

		// A click of Enter or Space has no detail
		var how = (evt.detail == 0) ? 'keyboard' : (btn.codePointer || 'mouse');
		btn.codePointer = null;

		if (btn.codeColor != null)
		{
			pick(btn.codeColor, btn, how);
		}
	};

	var pointer = function(evt)
	{
		evt.currentTarget.codePointer = evt.pointerType;
	};

	var update = function()
	{
		var spans = (parent.classList.contains(skin.classes.colored) && layer.offsetParent != null) ?
			layer.querySelectorAll('.' + skin.classes.swatch + '>span') : [];
		var lr = layer.getBoundingClientRect();
		var count = 0;

		// The rectangles are in the window, so a transform of the dialog
		// scales them (the pop-in of Fusion, which does not resize the text
		// area): the places of the buttons are in the layer without it
		var sx = (layer.offsetWidth > 0 && lr.width > 0) ? lr.width / layer.offsetWidth : 1;
		var sy = (layer.offsetHeight > 0 && lr.height > 0) ? lr.height / layer.offsetHeight : 1;

		for (var i = 0; i < spans.length; i++)
		{
			var color = spans[i].codeColor;

			if (color != null)
			{
				var btn = buttons[count];

				if (btn == null)
				{
					btn = document.createElement('button');
					btn.setAttribute('type', 'button');
					btn.setAttribute('title', mxResources.get('colorPicker'));
					btn.setAttribute('aria-haspopup', 'dialog');
					mxEvent.addListener(btn, 'pointerdown', pointer);
					mxEvent.addListener(btn, 'click', click);
					inner.appendChild(btn);
				}

				// The place of the swatch in the content of the layer (its
				// padding is the one of the text area): the button is the
				// height of the line (the anchor of the swatch) and 4 more
				// than the swatch on its sides
				var anchor = spans[i].parentNode;
				var sr = spans[i].getBoundingClientRect();
				var ar = anchor.getBoundingClientRect();
				var box = {x: (sr.left - lr.left) / sx + layer.scrollLeft - 4,
					y: (ar.top - lr.top) / sy + layer.scrollTop,
					w: sr.width / sx + 8, h: ar.height / sy};
				btn.codeColor = color;
				btn.codeBox = box;

				// A swatch after another one on its line (code with several
				// colors on a line): its wider target of a coarse pointer
				// starts at the button, not over the end of the swatch before
				var prev = anchor.previousSibling;

				if (prev != null && prev.nodeType == mxConstants.NODETYPE_ELEMENT &&
					prev.classList.contains(skin.classes.swatch))
				{
					btn.setAttribute('data-after-swatch', '1');
				}
				else
				{
					btn.removeAttribute('data-after-swatch');
				}

				btn.style.left = box.x + 'px';
				btn.style.top = box.y + 'px';
				btn.style.width = box.w + 'px';
				btn.style.height = box.h + 'px';

				// The key and the value as the code has them
				btn.setAttribute('aria-label', color.key + '=' + color.value);
				count++;
			}
		}

		while (buttons.length > count)
		{
			inner.removeChild(buttons[buttons.length - 1]);
		}

		div.style.left = layer.style.left;
		div.style.top = layer.style.top;
		div.style.width = layer.style.width;
		div.style.height = layer.style.height;
		setCurrent(current);
		scroll();
	};

	mxEvent.addListener(div, 'focusin', function(evt)
	{
		var index = Array.prototype.indexOf.call(buttons, evt.target);

		if (index >= 0)
		{
			setCurrent(index);

			// Not after a click, which a scroll under the pointer would lose
			try
			{
				if (evt.target.matches(':focus-visible'))
				{
					reveal(buttons[index]);
				}
			}
			catch (e)
			{
				// ignores unsupported :focus-visible
			}
		}

		// The field of the code does not scroll (the browser scrolls
		// what clips the focus)
		parent.scrollTop = 0;
		parent.scrollLeft = 0;
		div.scrollTop = 0;
		div.scrollLeft = 0;
	});

	mxEvent.addListener(div, 'keydown', function(evt)
	{
		var index = Array.prototype.indexOf.call(buttons, document.activeElement);

		if (index >= 0 && !mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) &&
			!mxEvent.isAltDown(evt) && !mxEvent.isShiftDown(evt))
		{
			var next = null;

			if (evt.key == 'ArrowDown' || evt.key == 'ArrowRight')
			{
				next = Math.min(index + 1, buttons.length - 1);
			}
			else if (evt.key == 'ArrowUp' || evt.key == 'ArrowLeft')
			{
				next = Math.max(index - 1, 0);
			}
			else if (evt.key == 'Home')
			{
				next = 0;
			}
			else if (evt.key == 'End')
			{
				next = buttons.length - 1;
			}

			if (next != null)
			{
				setCurrent(next);
				reveal(buttons[next]);
				buttons[next].focus({preventScroll: true});
				mxEvent.consume(evt);
			}
		}
	});

	return {update: update, scroll: scroll, elt: div};
};

/**
 * Returns true if the given colors of a style are the same color: the same
 * text in any case, or a color that the color dialog gives as hex for a
 * name or a short hex (red and #FF0000).
 */
EditStyle.isSameColor = function(a, b)
{
	a = mxUtils.trim(String(a));
	b = mxUtils.trim(String(b));

	return a.toLowerCase() == b.toLowerCase() || (mxUtils.isHexColor(b) &&
		!mxUtils.isLightDarkColor(a) && !mxUtils.isVarOrSystemColor(a) &&
		mxUtils.color2hex(a, '').toLowerCase() == b.toLowerCase());
};

/**
 * Opens the color dialog of the Format panel for the given color of the code
 * of the given text area ({key, value, start, end} of EditStyle.fillCode,
 * which the dialog shows; EditorUi.pickColor stacks it over Edit Style as the
 * modal color dialog) with the key as its headline. The chosen color
 * replaces the value (EditStyle.replaceColor), Cancel changes nothing.
 * After a tap the text area does not keep the focus (it would show the
 * keyboard of a phone) and the optional button of the swatch that was
 * tapped stays in view.
 */
EditStyle.pickColor = function(ui, text, color, how, btn)
{
	ui.pickColor(color.value, function(value)
	{
		EditStyle.replaceColor(text, color, value, how != 'touch', btn);
	}, null, null, null, color.key);
};

/**
 * Replaces the given color of the code of the given text area ({value,
 * start, end}, see EditStyle.fillCode) with the given value and keeps the
 * rest of the code. Nothing changes if the code has changed there or the
 * value is the same color (EditStyle.isSameColor). The change is typed into
 * the text area (insertText), so Undo of the text area takes it back and
 * then what was typed before it. If focus is true the text area keeps the
 * focus with the caret after the new value; else (after a tap) it has the
 * focus only while the value is typed, without a keyboard (inputmode none,
 * which a phone would show), the focus goes back and the text area keeps
 * its scrolling as far as the optional button of the swatch of the color
 * (EditStyle.addSwatchButtons) stays in view: a value of another length
 * moves the swatch with the end of its line. The value is set if
 * the browser cannot type into the text area. Either way the text area gets
 * an input event (the colours, the line numbers and the preview follow).
 * Returns true if the code changed.
 */
EditStyle.replaceColor = function(text, color, value, focus, btn)
{
	var code = text.value;

	if (typeof value !== 'string' || value.length == 0 ||
		code.substring(color.start, color.end) != color.value ||
		EditStyle.isSameColor(color.value, value))
	{
		return false;
	}

	var active = document.activeElement;
	var restore = !focus && active != text;
	var mode = text.getAttribute('inputmode');
	var scrollTop = text.scrollTop;
	var scrollLeft = text.scrollLeft;

	if (active != text)
	{
		if (restore)
		{
			text.setAttribute('inputmode', 'none');
		}

		text.focus({preventScroll: true});
	}

	if (document.activeElement == text)
	{
		text.setSelectionRange(color.start, color.end);

		try
		{
			document.execCommand('insertText', false, value);
		}
		catch (e)
		{
			// ignore
		}
	}

	// Without insertText (the browser cannot type into the text area or it
	// did not get the focus)
	if (text.value == code)
	{
		text.value = code.substring(0, color.start) + value + code.substring(color.end);

		if (document.activeElement == text)
		{
			text.setSelectionRange(color.start + value.length, color.start + value.length);
		}

		text.dispatchEvent(new Event('input', {bubbles: true}));
	}

	if (restore)
	{
		if (mode != null)
		{
			text.setAttribute('inputmode', mode);
		}
		else
		{
			text.removeAttribute('inputmode');
		}

		if (document.activeElement == text && active != null &&
			active != document.body && typeof active.focus === 'function')
		{
			active.focus({preventScroll: true});
		}

		// The element before cannot take the focus (it is gone)
		if (document.activeElement == text)
		{
			text.blur();
		}

		// Firefox and Safari scroll the text area to the caret of insertText
		// (Firefox on the next frame), which can be far from the tapped
		// swatch after its line (a long line scrolled to its end): the text
		// area keeps its scrolling, so the swatch stays in view
		var keepScroll = function()
		{
			text.scrollTop = scrollTop;
			text.scrollLeft = scrollLeft;

			// A shorter or longer value moves the swatch after its line (the
			// input event has put its button there): the text area scrolls
			// only as far as it takes to keep it in view
			if (btn != null && btn.codeBox != null && btn.codeColor != null &&
				btn.codeColor.key == color.key && btn.codeColor.start == color.start)
			{
				EditStyle.scrollToBox(text, btn.codeBox);
			}
		};

		keepScroll();

		if (typeof window.requestAnimationFrame === 'function')
		{
			window.requestAnimationFrame(keepScroll);
		}
	}

	return text.value != code;
};

/**
 * Returns the given name with the given detail as the dialogs of Classic
 * show them: "Take payment (Rectangle)".
 */
EditStyle.nameWithDetail = function(name, detail)
{
	return name + ' (' + detail + ')';
};

/**
 * The skins of the layout. A skin has the classes of the parts (dialog, the
 * classes of the content of the dialog, separated by spaces) and the builders
 * of its parts: getTitle, getSubtitle, createOption (the option one property
 * per line, returns {elt, input}), createCopyButton and optionally decorate
 * (runs on the content of the dialog first) and getColorMax (see
 * EditStyle.skins.classic). The skin of Fusion is added by SimpleForms.js.
 */
EditStyle.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Classic and Simple:
 * the colors of their dialogs light and dark, the plain headline of the
 * dialogs with a hint below, the option as a checkbox row and Copy Style as
 * a button on the left of the footer. The CSS is in grapheditor.css under
 * .geEditStyle (below 640 px the preview is below the code).
 */
EditStyle.skins.classic = {
	name: 'classic',
	classes: {dialog: 'geEditStyle', head: 'geEditStyleHead', subtitle: 'geDialogHint geEditStyleSubtitle',
		body: 'geEditStyleBody', editor: 'geEditStyleEditor', gutter: 'geEditStyleGutter',
		lines: 'geEditStyleLines', side: 'geEditStyleSide', preview: 'geEditStylePreview',
		caption: 'geDialogHint geEditStyleCaption', layer: 'geEditStyleLayer',
		colored: 'geEditStyleColored', key: 'geEditStyleKey', mark: 'geEditStyleMark',
		color: 'geEditStyleColor', swatch: 'geEditStyleSwatch', swatches: 'geEditStyleSwatches'},
	/**
	 * Returns the headline of the dialog.
	 */
	getTitle: function()
	{
		return mxResources.get('editStyle');
	},
	/**
	 * Returns what the dialog acts on: the label and the type of one cell, or
	 * the numbers of shapes and connectors.
	 */
	getSubtitle: function(ui, graph, cells)
	{
		return EditStyle.getCellsText(graph, cells, EditStyle.nameWithDetail, ', ');
	},
	/**
	 * Returns the option with the given label: a checkbox row (a yes or no
	 * option is a checkbox in these themes).
	 */
	createOption: function(label)
	{
		var row = document.createElement('div');
		row.className = 'geDialogCheckRow geEditStyleOption';
		var input = document.createElement('input');
		input.setAttribute('type', 'checkbox');
		input.id = 'geCheckbox-' + Editor.guid();
		row.appendChild(input);
		var lbl = document.createElement('label');
		lbl.setAttribute('for', input.id);
		mxUtils.write(lbl, label);
		row.appendChild(lbl);

		return {elt: row, input: input};
	},
	/**
	 * Returns Copy Style, a button of the dialogs on the left of the footer.
	 */
	createCopyButton: function(label, fn)
	{
		var btn = mxUtils.button(label, fn);
		btn.className = 'geBtn geEditStyleCopy';

		return btn;
	}
};

/**
 * Returns the text of the given cells: the label and the type of one cell
 * joined with the given function, or the numbers of shapes and connectors
 * joined with the given separator ("2 shapes, 1 connector").
 */
EditStyle.getCellsText = function(graph, cells, nameWithDetail, separator)
{
	if (cells.length > 1)
	{
		var edges = 0;

		for (var i = 0; i < cells.length; i++)
		{
			edges += (graph.model.isEdge(cells[i])) ? 1 : 0;
		}

		var shapes = cells.length - edges;
		var parts = [];

		if (shapes > 0)
		{
			parts.push((shapes == 1) ? mxResources.get('toastOneShape', null, '1 shape') :
				mxResources.get('toastShapes', [shapes], '{1} shapes'));
		}

		if (edges > 0)
		{
			parts.push((edges == 1) ? mxResources.get('toastOneConnector', null, '1 connector') :
				mxResources.get('toastConnectors', [edges], '{1} connectors'));
		}

		return parts.join(separator);
	}
	else
	{
		var label = mxUtils.trim(graph.getPlainLabel(cells[0], 40) || '');
		var type = graph.getCellTypeName(cells[0]);

		return (label.length > 0 && label != type) ? nameWithDetail(label, type) : type;
	}
};

/**
 * Returns the skin of the layout for the current theme: the skin of Fusion in
 * Fusion (if its scripts are loaded), else the Classic skin.
 */
EditStyle.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		EditStyle.skins.fusion != null) ? EditStyle.skins.fusion : EditStyle.skins.classic;
};

/**
 * Returns true if Edit Style shows the Code template: the feature
 * editStyleDialog of Editor.featureDefaults (editStyleDialog in the
 * configuration and the URL), on in Classic, Simple, Sketch, Minimal and
 * Atlas in the web app (the desktop app, Confluence, Jira and the embed mode
 * keep the dialog of before unless it is switched on). The theme Fusion
 * always has it.
 */
Editor.isEditStyleDialogEnabled = function()
{
	return Editor.isFeatureEnabled('editStyleDialog');
};

/**
 * Lays out the given Edit Style dialog on the Code template in the Classic
 * skin where the feature is on (Fusion lays it out in SimpleForms.js, when its
 * TextareaDialog is made) and returns its size: EditStyle.size limited to the
 * window, the smallest size and the key of its size. Else the size of the
 * dialog of before.
 */
(function()
{
	var editorUiLayoutEditStyleDialog = EditorUi.prototype.layoutEditStyleDialog;

	EditorUi.prototype.layoutEditStyleDialog = function(dlg, cells)
	{
		var result = editorUiLayoutEditStyleDialog.apply(this, arguments);

		if (!this.editor.isChromelessView() && Editor.isEditStyleDialogEnabled() &&
			EditStyle.getSkin() == EditStyle.skins.classic)
		{
			try
			{
				if (this.createEditStyleLayout(dlg, EditStyle.skins.classic) != null)
				{
					var ww = window.innerWidth || document.documentElement.clientWidth;
					var wh = window.innerHeight || document.documentElement.clientHeight;
					var margin = 48 + ((ww < 640) ? 0 : EditStyle.windowMargin);
					var width = Math.max(Math.min(EditStyle.size.width, ww - margin), 240);
					var height = Math.max(Math.min(EditStyle.size.height, wh - margin), 240);

					result = {width: width, height: height, minSize: new mxRectangle(0, 0,
						Math.min(EditStyle.minSize.width, width), Math.min(EditStyle.minSize.height, height)),
						key: EditStyle.windowKey};
				}
			}
			catch (e)
			{
				EditorUi.debug('EditorUi.layoutEditStyleDialog', [this], 'error', [e]);
			}
		}

		return result;
	};
})();

/**
 * Replaces the layout of the given Edit Style dialog (the TextareaDialog of
 * the action editStyle...) with the Code template in the given skin: the
 * headline and what it acts on, the code field with line numbers and the
 * colours of the code, the preview of the shape, the option one property per
 * line and Copy Style. Returns the layout ({skin, head, body, editor, side,
 * preview, lines}) and puts it on the dialog (editStyleLayout), or returns
 * null if the dialog keeps its layout (it has changed or no cell is
 * selected).
 */
EditorUi.prototype.createEditStyleLayout = function(dlg, skin)
{
	var ui = this;
	var graph = this.editor.graph;
	var classes = skin.classes;
	var elt = dlg.container;
	var text = dlg.textarea;
	var top = elt.firstChild;
	var buttons = elt.lastChild;
	var title = (top != null) ? top.querySelector('h3') : null;
	var primary = (buttons != null) ? buttons.querySelector('.gePrimaryBtn') : null;
	var cells = graph.getEditableCells(graph.getSelectionCells());

	// Keeps the previous layout if the dialog has changed
	if (text == null || title == null || primary == null || text.parentNode != elt || cells.length == 0)
	{
		return null;
	}

	var cell = cells[0];
	elt.classList.add.apply(elt.classList, classes.dialog.split(' '));

	if (typeof skin.decorate === 'function')
	{
		skin.decorate(elt);
	}

	// The headline and the shape
	var head = document.createElement('div');
	head.className = classes.head;
	var h3 = document.createElement('h3');
	mxUtils.write(h3, skin.getTitle());
	head.appendChild(h3);
	var sub = document.createElement('div');
	sub.className = classes.subtitle;
	var label = mxUtils.trim(graph.getPlainLabel(cell, 40) || '');
	mxUtils.write(sub, skin.getSubtitle(this, graph, cells));
	head.appendChild(sub);
	elt.replaceChild(head, top);

	// The code field: line numbers and the text area
	var body = document.createElement('div');
	body.className = classes.body;
	elt.insertBefore(body, buttons);
	var editor = document.createElement('div');
	editor.className = classes.editor;
	var gutter = document.createElement('div');
	gutter.className = classes.gutter;
	gutter.setAttribute('aria-hidden', 'true');
	editor.appendChild(gutter);
	editor.appendChild(text);
	body.appendChild(editor);
	text.style.flex = '';
	text.style.wordBreak = '';

	// The preview of the shape and the format
	var side = document.createElement('div');
	side.className = classes.side;
	body.appendChild(side);
	var pane = document.createElement('div');
	pane.className = classes.preview;
	pane.setAttribute('aria-hidden', 'true');
	var img = document.createElement('img');
	img.setAttribute('alt', '');
	pane.appendChild(img);
	side.appendChild(pane);
	var caption = document.createElement('div');
	caption.className = classes.caption;
	mxUtils.write(caption, mxResources.get('preview'));
	side.appendChild(caption);

	var option = skin.createOption(mxResources.get('onePropertyPerLine'));
	var lines = option.input;
	side.appendChild(option.elt);

	var updateGutter = function()
	{
		var count = (lines.checked) ? text.value.split('\n').length : 1;
		var numbers = [];

		for (var i = 1; i <= count; i++)
		{
			numbers.push(i);
		}

		// A last line (with a space: the browser drops a line break at the end)
		// lets the numbers scroll as far as the text area with the horizontal
		// scroll bar of a long property
		gutter.textContent = numbers.join('\n') + '\n ';
		gutter.scrollTop = text.scrollTop;
	};

	// Keys, values and colors in their colours
	var colors = null;

	var setLines = function(value)
	{
		lines.checked = value;
		text.value = EditStyle.formatStyle(text.value, value);
		text.setAttribute('wrap', (value) ? 'off' : 'soft');
		editor.classList.toggle(classes.lines, value);
		updateGutter();

		if (colors != null)
		{
			colors();
		}
	};

	// The preview: the shape with the style in a graph of its own (labels
	// as text, the SVG in an image)
	var previewThread = null;

	var updatePreview = function()
	{
		var style = EditStyle.formatStyle(text.value, false);
		var g = Graph.createOffscreenGraph(graph.getStylesheet());
		var container = g.container;

		// The fonts of the draft stay out of the document, where they would
		// replace those of the diagram also after Cancel, and its images are
		// not loaded, as the preview is an SVG in an image (LayoutCode.js)
		EditorUi.isolateSimplePreview(g);
		document.body.appendChild(container);

		try
		{
			var parent = g.getDefaultParent();

			// HTML labels get the plain text of the label escaped
			var value = (/(^|;)\s*html\s*=\s*1/.test(style)) ? mxUtils.htmlEntities(label) : label;

			if (graph.model.isEdge(cell))
			{
				var edge = g.insertEdge(parent, null, '', null, null, style);
				edge.geometry.setTerminalPoint(new mxPoint(0, 40), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 40), false);
				g.view.validate();
			}
			else
			{
				var geo = graph.getCellGeometry(cell);
				var w = (geo != null && geo.width > 0) ? geo.width : 120;
				var h = (geo != null && geo.height > 0) ? geo.height : 60;
				var s = Math.min(1, 160 / w, 80 / h);
				g.insertVertex(parent, null, value, 0, 0, Math.max(1, w * s), Math.max(1, h * s), style);
			}

			var svg = g.getSvg(null, 1, 4, false, null, true, null, null, null, false, null,
				(Editor.isDarkMode()) ? 'dark' : 'light');
			img.setAttribute('src', Editor.createSvgDataUri(mxUtils.getXml(svg)));
		}
		catch (e)
		{
			img.removeAttribute('src');
		}
		finally
		{
			g.destroy();

			if (container.parentNode != null)
			{
				container.parentNode.removeChild(container);
			}
		}
	};

	mxEvent.addListener(text, 'input', function()
	{
		updateGutter();
		window.clearTimeout(previewThread);
		previewThread = window.setTimeout(updatePreview, EditStyle.previewDelay);
	});

	mxEvent.addListener(text, 'scroll', function()
	{
		gutter.scrollTop = text.scrollTop;
	});

	var settings = (typeof mxSettings !== 'undefined') ? mxSettings.settings : null;

	mxEvent.addListener(lines, 'change', function()
	{
		setLines(lines.checked);

		if (settings != null)
		{
			settings.styleLines = lines.checked;
			mxSettings.save();
		}
	});

	// Joins the lines before the dialog applies the style (capture runs
	// before the listener of the button, also for Ctrl+Enter, which
	// clicks it)
	var original = text.value;

	primary.addEventListener('click', function()
	{
		var joined = EditStyle.formatStyle(text.value, false);

		// An unchanged style is applied as it was (eg. without a last semicolon)
		text.value = (joined == EditStyle.formatStyle(original, false)) ? original : joined;
	}, true);

	// A click or a tap on a swatch opens the color dialog for its value
	colors = EditStyle.addCodeColors(text, function(layer, value)
	{
		EditStyle.fillCode(layer, value, lines.checked, skin);
	}, skin, function(color, btn, how)
	{
		EditStyle.pickColor(ui, text, color, how, btn);
	});

	setLines(settings == null || settings.styleLines !== false);
	updatePreview();

	// Copy Style copies the style as one line
	if (navigator.clipboard != null && typeof navigator.clipboard.writeText === 'function')
	{
		var copy = skin.createCopyButton(mxResources.get('copyStyle'), function()
		{
			navigator.clipboard.writeText(EditStyle.formatStyle(text.value, false)).then(function()
			{
				ui.announce(mxResources.get('copiedToClipboard'));
			}, function()
			{
				// ignore
			});
		});
		buttons.insertBefore(copy, buttons.firstChild);
	}

	var layout = {skin: skin, head: head, body: body, editor: editor, side: side, preview: pane, lines: lines};
	dlg.editStyleLayout = layout;

	return layout;
};
