/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The code field of the code dialogs in every look (Fusion ideas in Classic
 * and Simple): a text area (wrap off) with line numbers in a gutter and its
 * code in colours (XML or Mermaid), as the code of Edit Style. The text area
 * stays the field: typing, the caret, the selection, undo, search, the
 * keyboard, copy and paste are those of the browser. Its text is transparent
 * while a layer over it (no pointer events, hidden from screen readers) shows
 * the code in colours.
 *
 * Built for large code (Edit Diagram shows the XML of a page, which can be
 * many megabytes): the gutter and the layer show only the lines in view and
 * a few around them (EditStyle.addCodeColors, which colours all of the code,
 * stays for the short code of Edit Style). Typing re-colours only these
 * lines, scrolling moves them or colours the lines that come into view, and
 * lines longer than CodeField.longLine are coloured from the columns in view.
 * The lines are found with an index of the starts of the lines, which is
 * built when the code has changed (about 5 ms for 20 MB). Above
 * CodeField.maxLength characters the code is plain text without line numbers,
 * and the note of the field says so (the browser alone then takes most of
 * the time of each key, see docs/claude/code-field.md).
 *
 * The look comes from the skin (CodeField.skins.classic, its CSS in
 * grapheditor.css under .geCodeEditor and .geEditStyleEditor; Fusion adds
 * CodeField.skins.fusion in SimpleCode.js).
 */
var CodeField = {};

/**
 * Most characters of code with line numbers and colours. Longer code is
 * plain text with the note of the field (CodeField.getNote).
 */
CodeField.maxLength = 10 * 1024 * 1024;

/**
 * Most lines whose numbers are all in the gutter, as before; above, the
 * gutter has only the numbers of the lines in view and around them.
 */
CodeField.fullGutterLines = 2000;

/**
 * Lines that are coloured and numbered above and below the lines in view, so
 * that scrolling by a few lines only moves them.
 */
CodeField.overscan = 40;

/**
 * Longest line that is coloured in full; longer lines (eg. an image in a
 * style) are coloured from the columns in view (CodeField.columnOverscan more
 * on both sides).
 */
CodeField.longLine = 2000;

/**
 * Columns that are coloured on both sides of the columns in view of a long
 * line.
 */
CodeField.columnOverscan = 400;

/**
 * Length of code from which a dialog shows its frame before it puts the code
 * into the field (see CodeField.fillLater): the browser then lays the text
 * out while the dialog says that it is loading.
 */
CodeField.fillLaterLength = 1024 * 1024;

/**
 * The skins of the field: the classes of the parts and of the colours (key,
 * tag, value, mark and comment). The skin of Fusion is added by
 * SimpleCode.js.
 */
CodeField.skins = {};

/**
 * The Classic skin, for Classic, Simple, Sketch, Minimal and Atlas
 * (docs/dialog-style-guide.md, "Code dialogs"): the field of Edit Style, with
 * the line of an error of the live preview marked (CodeDialogs.js).
 */
CodeField.skins.classic = {
	name: 'classic',
	classes: {lines: 'geCodeLines', layer: 'geCodeLayer', colored: 'geCodeColored', key: 'geCodeKey',
		tag: 'geCodeTag', value: 'geCodeValue', mark: 'geCodeMark', comment: 'geCodeComment',
		markedLine: 'geCodeErrorBand', markedNumber: 'geCodeErrorNumber'}
};

/**
 * Returns the text of the note of a field with the given code that is too
 * long for line numbers and colours.
 */
CodeField.getNote = function(length)
{
	return mxResources.get('codeFieldPlain', [CodeField.formatSize(CodeField.maxLength)],
		'Colors and line numbers are off above {1}');
};

/**
 * Returns the given number of characters as a size (5 MB, 300 KB).
 */
CodeField.formatSize = function(length)
{
	return (length >= 1024 * 1024) ? Math.round(length / (1024 * 1024) * 10) / 10 + ' MB' :
		Math.max(1, Math.round(length / 1024)) + ' KB';
};

/**
 * Returns the starts of the lines of the given text (an Int32Array, the
 * first is 0).
 */
CodeField.getLineStarts = function(value)
{
	var starts = new Int32Array(Math.max(1024, Math.ceil(value.length / 32)));
	var count = 1;
	var i = value.indexOf('\n');

	while (i >= 0)
	{
		if (count == starts.length)
		{
			var grown = new Int32Array(starts.length * 2);
			grown.set(starts);
			starts = grown;
		}

		starts[count++] = i + 1;
		i = value.indexOf('\n', i + 1);
	}

	return starts.subarray(0, count);
};

/**
 * The characters of the scripts that are written from right to left (Hebrew,
 * Arabic, Syriac, Thaana, N'Ko and their presentation forms, and the high
 * surrogates of those above U+FFFF), the right-to-left mark and the controls
 * of embeddings, overrides and isolates. The browser reverses a run of
 * right-to-left text as a whole, so the layer, whose text is the only one
 * that is visible, must never start or end a long line inside one: it would
 * show the letters of the run in other columns than the text area (see
 * CodeField.getBidiStart and CodeField.getBidiEnd).
 */
CodeField.rtlChars = /[\u0590-\u08ff\u200f\u202a-\u202e\u2066-\u2069\ufb1d-\ufdff\ufe70-\ufeff\ud802\ud803\ud83a\ud83b]/;

/**
 * The controls of embeddings, overrides and isolates, which can change the
 * direction of the rest of a line, Latin letters included.
 */
CodeField.bidiControls = /[\u202a-\u202e\u2066-\u2069]/;

/**
 * Returns true if the given character code is a Latin letter (A to Z, a to
 * z), which is always left to right and ends a run of right-to-left text
 * outside embeddings, overrides and isolates.
 */
CodeField.isLatin = function(c)
{
	c = c | 32;

	return c >= 97 && c <= 122;
};

/**
 * Returns the embeddings, overrides and isolates (CodeField.bidiControls)
 * that are still open after the given text, which starts with the given ones
 * open (a string, e for an embedding or override, i for an isolate, the
 * innermost last). As in the Unicode Bidirectional Algorithm, U+202C closes
 * the innermost embedding or override unless an isolate was opened after it,
 * U+2069 the innermost isolate and what was opened in it, and the others that
 * close nothing are ignored.
 */
CodeField.getOpenBidi = function(value, open)
{
	var re = /[\u202a-\u202e\u2066-\u2069]/g;
	var match = null;
	open = (open != null) ? open : '';

	while ((match = re.exec(value)) != null)
	{
		var c = match[0].charCodeAt(0);

		if (c == 0x202c)
		{
			if (open.charAt(open.length - 1) == 'e')
			{
				open = open.substring(0, open.length - 1);
			}
		}
		else if (c == 0x2069)
		{
			var k = open.lastIndexOf('i');

			if (k >= 0)
			{
				open = open.substring(0, k);
			}
		}
		else
		{
			open += (c >= 0x2066) ? 'i' : 'e';
		}
	}

	return open;
};

/**
 * Returns true if the width of the given character code (not ASCII) cannot be
 * measured alone: tabs and other control characters, the halves of surrogate
 * pairs (emoji, flags), the characters of no width and the controls of the
 * direction of text (U+200B to U+200F, U+202A to U+202E, U+2060 to U+206F
 * with the isolates, U+FEFF) and the letters of the scripts that join
 * (Arabic, Syriac, N'Ko, Mandaic and the other scripts up to U+08FF and the
 * presentation forms of Arabic): their shapes depend on the letters around
 * them and some pairs are one ligature (lam alef), so a run of them is not as
 * wide as its letters one by one.
 */
CodeField.isComplex = function(c)
{
	return c < 0xa0 || (c >= 0xd800 && c <= 0xdfff) || (c >= 0x200b && c <= 0x200f) ||
		(c >= 0x202a && c <= 0x202e) || (c >= 0x2060 && c <= 0x206f) || c == 0xfeff ||
		(c >= 0x600 && c <= 0x8ff) || (c >= 0xfb50 && c <= 0xfdff) || (c >= 0xfe70 && c <= 0xfefc);
};

/**
 * Returns true if the characters of the given text other than printable
 * ASCII are not CodeField.isComplex and the given function returns true for
 * each of them.
 */
CodeField.isEach = function(value, fn)
{
	var re = /[^\x20-\x7e]/g;
	var match = null;

	while ((match = re.exec(value)) != null)
	{
		if (fn == null || CodeField.isComplex(match[0].charCodeAt(0)) || !fn(match[0]))
		{
			return false;
		}
	}

	return true;
};

/**
 * Returns true if the given text has only characters of one column, so that a
 * long line can be coloured from a column on after a spacer as wide as the
 * text before it (see CodeField.longLine): the printable characters of ASCII,
 * and the others (from U+00A0, such as é, ü or the letters of Hebrew) for
 * which the given function returns true (the field measures them in the font
 * of the code). The characters of CodeField.isComplex (tabs, emoji, the
 * characters of no width, the controls of embeddings, overrides and isolates
 * and the letters that join) are never one column. The text must not end
 * inside a run of right-to-left text (see CodeField.getBidiStart): the
 * browser reverses a run as a whole, so only a whole run is as wide as its
 * letters.
 */
CodeField.isNarrow = function(value, isNarrowChar)
{
	return CodeField.isEach(value, isNarrowChar);
};

/**
 * Returns the start of the coloured part of a long line (from the given start)
 * at or before the given position, so that it does not start inside a run of
 * right-to-left text (see CodeField.rtlChars): if there is right-to-left text
 * after the last Latin letter before the position, the part starts at that
 * letter, or at the start of the line if there is none. The text before it
 * then has only whole runs of right-to-left text (or a control of embeddings,
 * overrides or isolates, which CodeField.isNarrow never counts as one column,
 * so that the line is coloured from its start).
 */
CodeField.getBidiStart = function(value, start, from)
{
	var i = from;

	while (i > start && !CodeField.isLatin(value.charCodeAt(i - 1)))
	{
		i--;
	}

	if (CodeField.rtlChars.test(value.substring(i, from)))
	{
		from = Math.max(start, i - 1);
	}

	return from;
};

/**
 * Returns the end of the part of a long line that is laid out (from the
 * given start to the given end) at or after the given position, so that it
 * does not end inside a run of right-to-left text (see CodeField.rtlChars):
 * inside an embedding, override or isolate (CodeField.getOpenBidi) the part
 * goes on to the control that closes it, or to the end of the line if none
 * does, and if there is right-to-left text after the last Latin letter
 * before that, up to the next Latin letter outside embeddings, overrides and
 * isolates (Latin letters are always left to right and end the run there).
 * If a limit is given, the part ends at the first position at or after it
 * where an embedding, override or isolate is open (the end of the coloured
 * part, see paint in CodeField.attach).
 */
CodeField.getBidiEnd = function(value, start, to, end, limit)
{
	if (to < end)
	{
		var open = CodeField.getOpenBidi(value.substring(start, to));
		var i = to;

		while (i > start && !CodeField.isLatin(value.charCodeAt(i - 1)))
		{
			i--;
		}

		if (open.length > 0 || CodeField.rtlChars.test(value.substring(i, to)))
		{
			while (to < end)
			{
				var c = value.charCodeAt(to);

				if ((open.length == 0) ? CodeField.isLatin(c) : (limit != null && to >= limit))
				{
					break;
				}
				else if ((c >= 0x202a && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069))
				{
					open = CodeField.getOpenBidi(value.charAt(to), open);
				}

				to++;
			}
		}
	}

	return to;
};

/**
 * Adds line numbers and colours to the given text area in the given editor
 * (its parent, which also has the given gutter). Options: skin (default
 * CodeField.skins.classic), language (a key of CodeField.languages, or null
 * for no colours), note (an element that shows the note of long code, or
 * null), onChange (called after the code has changed by typing or by a value
 * set by code, eg. a dropped file). Values that are set by code (the property
 * value of the text area) update the field. Returns the field: update()
 * reads the code again without calling onChange, refresh() after a change of
 * the size or the font, isPlain() (the code is too long for line numbers and
 * colours), getLineCount() and getShownLines() (the first and the last line
 * whose numbers and colours are in the page).
 */
CodeField.attach = function(editor, gutter, text, options)
{
	options = options || {};
	var skin = options.skin || CodeField.skins.classic;
	var classes = skin.classes;
	var language = (options.language != null) ? CodeField.languages[options.language] : null;
	var numbers = document.createElement('div');
	gutter.textContent = '';
	gutter.appendChild(numbers);
	var layer = null;
	var lines = null;

	if (language != null)
	{
		layer = document.createElement('div');
		layer.className = classes.layer;
		layer.setAttribute('aria-hidden', 'true');

		// The text of the text area once more: inert keeps it out of the
		// browser's Find (only the text area is found, once per match)
		layer.setAttribute('inert', '');
		lines = document.createElement('div');
		lines.style.position = 'absolute';
		lines.style.top = '0px';
		lines.style.whiteSpace = 'pre';
		layer.appendChild(lines);
		editor.insertBefore(layer, text.nextSibling);
	}

	// The text and the index of its lines, read again after a change, and what
	// the language finds once per text (stateAt)
	var value = null;
	var starts = null;
	var plain = false;
	var stateCache = {};

	// What the gutter and the layer show
	var shown = {first: -1, last: -1, count: -1, full: false, value: null, columns: null, marked: null};
	var metrics = null;

	// The line that is marked (an error, see setMarkedLine) and its band
	var marked = null;
	var band = null;

	// The width of ten of each character other than ASCII in the font of the
	// code, measured once: one column (CodeField.isNarrow), or at least one
	// column (wide such as CJK, see reach)
	var narrowChars = Object.create(null);

	var getWidth = function(ch)
	{
		var width = narrowChars[ch];

		if (width == null)
		{
			var probe = document.createElement('span');
			probe.textContent = new Array(11).join(ch);
			layer.appendChild(probe);
			width = probe.getBoundingClientRect().width;
			layer.removeChild(probe);
			narrowChars[ch] = width;
		}

		return width;
	};

	var isNarrowChar = function(ch)
	{
		return Math.abs(getWidth(ch) - 10 * metrics.charWidth) < 0.05;
	};

	var isWideChar = function(ch)
	{
		return getWidth(ch) > 10 * metrics.charWidth - 0.05;
	};

	// The width of the given text in the font of the code, laid out like the
	// lines of the layer
	var measureText = function(str)
	{
		var probe = document.createElement('span');
		probe.style.whiteSpace = 'pre';
		probe.textContent = str;
		layer.appendChild(probe);
		var width = probe.getBoundingClientRect().width;
		layer.removeChild(probe);

		return width;
	};

	// The offset at which the text of a line from the given offset (up to the
	// given end) is as wide as the given columns: one character per column
	// where each of them takes at least one column (ASCII, é, CJK), else as
	// measured (combining marks, characters of no width, emoji and flags take
	// fewer columns than code units, so a piece of as many code units as
	// columns can end before the columns in view; the text of the text area
	// is transparent)
	var reach = function(base, end, columns)
	{
		var to = Math.min(end, base + columns);

		if (to < end && !CodeField.isEach(value.substring(base, to), isWideChar))
		{
			var target = columns * metrics.charWidth;
			var width = measureText(value.substring(base, to));

			while (width < target && to < end)
			{
				var n = to - base;
				var next = (width > 0) ? Math.ceil(n * target / width * 1.1) + 16 : 4 * n;
				to = Math.min(end, base + Math.max(n + 16, next));
				width = measureText(value.substring(base, to));
			}
		}

		return to;
	};

	// The text of the layer is laid out like the text of the text area
	var props = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing',
		'wordSpacing', 'tabSize', 'fontVariantLigatures', 'fontKerning', 'textRendering'];

	var measure = function()
	{
		var css = window.getComputedStyle(text);
		var lh = parseFloat(css.lineHeight);

		if (isNaN(lh))
		{
			lh = parseFloat(css.fontSize) * 1.2;
		}

		metrics = {lineHeight: Math.max(1, lh), padTop: parseFloat(css.paddingTop) || 0,
			padLeft: parseFloat(css.paddingLeft) || 0, charWidth: 0};
		narrowChars = Object.create(null);

		if (layer != null && !plain)
		{
			for (var i = 0; i < props.length; i++)
			{
				layer.style[props[i]] = css[props[i]];
			}

			// Without the scroll bars of the text area
			layer.style.left = text.offsetLeft + 'px';
			layer.style.top = text.offsetTop + 'px';
			layer.style.width = text.clientWidth + 'px';
			layer.style.height = text.clientHeight + 'px';
			lines.style.left = metrics.padLeft + 'px';

			// The width of a column (the font is monospaced)
			var probe = document.createElement('span');
			probe.textContent = '0000000000';
			layer.appendChild(probe);
			metrics.charWidth = probe.getBoundingClientRect().width / 10;
			layer.removeChild(probe);
		}
	};

	var read = function()
	{
		if (value == null)
		{
			value = text.value;
			starts = null;
			var over = value.length > CodeField.maxLength;

			if (over != plain)
			{
				plain = over;
				editor.classList.toggle(classes.lines, !plain);
				metrics = null;

				if (options.note != null)
				{
					options.note.textContent = (plain) ? CodeField.getNote(value.length) : '';
					options.note.hidden = !plain;
				}
			}

			if (layer != null)
			{
				editor.classList.toggle(classes.colored, !plain);
			}
		}

		if (!plain && starts == null)
		{
			starts = CodeField.getLineStarts(value);
		}
	};

	// The numbers of the given lines (all of them up to fullGutterLines) at the
	// given scroll position of the text area (read before the changes of the
	// page, so that the browser lays it out once in the frame)
	var showNumbers = function(first, last, count, scrollTop)
	{
		var full = count <= CodeField.fullGutterLines;
		var from = (full) ? 0 : first;
		var to = (full) ? count - 1 : last;

		if (full != shown.full || count != shown.count || marked != shown.marked ||
			(!full && (first != shown.first || last != shown.last)))
		{
			var list = [];

			for (var i = from; i <= to; i++)
			{
				list.push(i + 1);
			}

			// An empty last line lets the numbers scroll with the scroll bar
			numbers.textContent = list.join('\n') + '\n';

			// The number of the marked line in its own element
			if (marked != null && marked - 1 >= from && marked - 1 <= to)
			{
				var k = marked - 1 - from;
				numbers.textContent = list.slice(0, k).join('\n') + ((k > 0) ? '\n' : '');
				var num = document.createElement('span');
				num.className = classes.markedNumber;
				num.textContent = String(marked);
				numbers.appendChild(num);
				numbers.appendChild(document.createTextNode('\n' + list.slice(k + 1).join('\n') +
					((k + 1 < list.length) ? '\n' : '')));
			}

			shown.marked = marked;

			// Wider for more than four digits
			var digits = String(count).length;
			gutter.style.width = (digits > 4) ? 'calc(' + digits + 'ch + 16px)' : '';
		}

		numbers.style.transform = (metrics != null) ?
			'translateY(' + (from * metrics.lineHeight - scrollTop) + 'px)' : '';
		shown.full = full;
	};

	// The colours of the given lines
	var showColors = function(first, last, count, c0, c1)
	{
		var frag = document.createDocumentFragment();
		var cls = classes;
		var run = null;
		var runClass = null;

		var flush = function()
		{
			if (run != null)
			{
				var node = document.createTextNode(run);

				if (runClass != null)
				{
					var span = document.createElement('span');
					span.className = runClass;
					span.appendChild(node);
					node = span;
				}

				frag.appendChild(node);
				run = null;
			}
		};

		// Joins the runs of the same colour
		var out = function(str, kind)
		{
			if (str.length > 0)
			{
				var className = (kind != null) ? cls[kind] : null;

				if (run != null && className == runClass)
				{
					run += str;
				}
				else
				{
					flush();
					run = str;
					runClass = className;
				}
			}
		};

		// Colours the part of a long line (from the given start to the given
		// end) from the given position to the given one or after it, outside
		// right-to-left text (CodeField.getBidiEnd). Inside an embedding,
		// override or isolate it colours at most CodeField.longLine characters
		// past that position, so that a control that is not closed in a long
		// line (eg. a label before an image in a style) does not colour the
		// whole line on each key and scroll (second review of #1423). The
		// browser reverses such a block as a whole up to the control that
		// closes it or the end of the line, so the rest of the block follows
		// as one run without colours: the layer lays out the same block as the
		// text area, and each column in view shows the text that the caret
		// edits (third review of #1423)
		var paint = function(start, end, from, to, state)
		{
			var limit = to + CodeField.longLine;
			var cut = CodeField.getBidiEnd(value, start, to, end, limit);
			language.tokenize(value.substring(from, cut), state, out);

			if (cut >= limit && cut < end)
			{
				out(value.substring(cut, CodeField.getBidiEnd(value, start, cut, end)), null);
			}
		};

		var cw = metrics.charWidth;
		var sliced = false;
		var state = language.stateAt(value, starts[first], stateCache);

		for (var i = first; i <= last; i++)
		{
			var start = starts[i];
			var end = (i + 1 < count) ? starts[i + 1] - 1 : value.length;

			if (end - start > CodeField.longLine && cw > 0)
			{
				// The columns in view of a long line, in the state at the first
				// column (after a spacer as wide as the columns before it, if they
				// are all one column wide, such as ASCII, é and the letters of
				// Hebrew in most fonts of code). A wide character (CJK) or a tab
				// takes more than one column, so a line with one before the first
				// column is coloured from its start: it can reach the columns in
				// view with fewer characters than columns (its text is
				// transparent). The part ends where it is as wide as the last
				// column (reach, as measured where its characters are not all one
				// column wide). The browser reverses a run of right-to-left text
				// as a whole (CodeField.rtlChars), so the part starts and ends
				// outside one: at a Latin letter before a run that reaches the
				// first column, and after a run that reaches the last one, or at
				// the end of an embedding or isolate that is open there (paint).
				var from = Math.min(end, start + c0);
				sliced = true;

				if (from > start && from < end)
				{
					from = CodeField.getBidiStart(value, start, from);
				}

				var narrow = from > start && CodeField.isNarrow(value.substring(start, from), isNarrowChar);

				if (narrow && from < end)
				{
					flush();
					var spacer = document.createElement('span');
					spacer.style.display = 'inline-block';
					spacer.style.width = ((from - start) * cw) + 'px';
					frag.appendChild(spacer);
					paint(start, end, from, reach(from, end, c1 - (from - start)),
						language.stateAt(value, from, stateCache));
				}
				// From the start of the line, unless it has one column per
				// character and ends before the first column (nothing of it is in
				// view)
				else if (!narrow || from < end)
				{
					paint(start, end, start, reach(start, end, c1), state);
				}

				state = language.stateAt(value, end + 1, stateCache);
			}
			else
			{
				state = language.tokenize(value.substring(start, end), state, out);
			}

			out('\n', null);
		}

		flush();
		lines.textContent = '';
		lines.appendChild(frag);
		shown.columns = (sliced) ? [c0, c1] : null;
	};

	var place = function(scrollLeft, scrollTop)
	{
		var top = (shown.first >= 0) ? shown.first : 0;

		if (band != null)
		{
			band.style.display = (marked != null && marked <= shown.count) ? '' : 'none';
			band.style.top = (text.offsetTop + metrics.padTop + (marked - 1) * metrics.lineHeight - scrollTop) + 'px';
			band.style.height = metrics.lineHeight + 'px';
		}

		if (layer != null)
		{
			lines.style.transform = 'translate(' + (-scrollLeft) + 'px,' +
				(metrics.padTop + top * metrics.lineHeight - scrollTop) + 'px)';
		}
	};

	// Shows the lines in view: renders them again if the code, the lines or
	// the columns of long lines in view have changed, else moves them. Before
	// the text area is in the page (it has no layout yet) only all numbers of
	// short code are shown, the rest follows once it is laid out (see the
	// ResizeObserver below)
	var render = function(force)
	{
		if (!text.isConnected)
		{
			read();

			if (!plain && starts.length <= CodeField.fullGutterLines)
			{
				showNumbers(0, starts.length - 1, starts.length, 0);
			}

			return;
		}

		read();

		if (plain)
		{
			if (shown.count >= 0 || numbers.firstChild != null)
			{
				numbers.textContent = '';

				if (lines != null)
				{
					lines.textContent = '';
				}

				shown = {first: -1, last: -1, count: -1, full: false, value: null, columns: null, marked: null};
			}

			if (band != null)
			{
				band.style.display = 'none';
			}

			return;
		}

		if (force || metrics == null || (metrics.charWidth == 0 && layer != null))
		{
			measure();
		}

		var count = starts.length;
		var lh = metrics.lineHeight;
		var scrollTop = text.scrollTop;
		var scrollLeft = text.scrollLeft;
		var top = Math.max(0, scrollTop - metrics.padTop);
		var inView = Math.floor(top / lh);
		var lastInView = Math.min(count - 1, Math.ceil((top + text.clientHeight) / lh));
		var cw = metrics.charWidth;
		var column = (cw > 0) ? Math.max(0, Math.floor((scrollLeft - metrics.padLeft) / cw)) : 0;
		var visible = (cw > 0) ? Math.ceil(text.clientWidth / cw) : 0;
		var margin = CodeField.overscan / 4;
		var cmargin = CodeField.columnOverscan / 4;

		// The lines that are shown cover the lines in view with a margin (or
		// reach the first or the last line), and the columns that are shown of
		// long lines the columns in view
		var covered = !force && shown.value === value && shown.count == count && shown.first >= 0 &&
			inView >= shown.first && lastInView <= shown.last &&
			(inView - shown.first >= margin || shown.first == 0) &&
			(shown.last - lastInView >= margin || shown.last == count - 1) &&
			(shown.columns == null || ((column - shown.columns[0] >= cmargin || shown.columns[0] == 0) &&
			shown.columns[1] - (column + visible) >= cmargin));

		var first = shown.first;
		var last = shown.last;

		if (!covered)
		{
			first = Math.max(0, inView - CodeField.overscan);
			last = Math.min(count - 1, lastInView + CodeField.overscan);

			// Nothing is coloured while the layer is hidden (forced colours), where
			// a column has no width and long lines would be coloured in full
			if (layer != null && cw > 0)
			{
				showColors(first, last, count, Math.max(0, column - CodeField.columnOverscan),
					column + visible + CodeField.columnOverscan);
			}
			else if (lines != null && lines.firstChild != null)
			{
				lines.textContent = '';
			}
		}

		showNumbers(first, last, count, scrollTop);
		shown.first = first;
		shown.last = last;
		shown.count = count;
		shown.value = value;
		place(scrollLeft, scrollTop);
	};

	var changed = function()
	{
		value = null;
		render();

		if (options.onChange != null)
		{
			options.onChange();
		}
	};

	// Values set by code (dropped files, a new type, Anonymize) fire no input
	// event
	var desc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');

	if (desc != null && desc.get != null && desc.set != null)
	{
		Object.defineProperty(text, 'value', {configurable: true,
			get: function()
			{
				return desc.get.call(this);
			},
			set: function(newValue)
			{
				desc.set.call(this, newValue);
				changed();
			}});
	}

	mxEvent.addListener(text, 'input', changed);
	mxEvent.addListener(text, 'scroll', function()
	{
		render();
	});

	if (typeof ResizeObserver !== 'undefined')
	{
		new ResizeObserver(function()
		{
			render(true);
		}).observe(text);
	}

	render();

	return {
		editor: editor,
		gutter: gutter,
		layer: layer,
		update: function()
		{
			value = null;
			render();
		},
		refresh: function()
		{
			render(true);
		},
		isPlain: function()
		{
			read();

			return plain;
		},
		getLineCount: function()
		{
			read();

			return (starts != null) ? starts.length : text.value.split('\n').length;
		},
		getShownLines: function()
		{
			return {first: shown.first, last: shown.last};
		},
		/**
		 * Marks the given line (from 1, eg. of an error) with a band behind
		 * it and its number, or no line for null. Only with the classes
		 * markedLine and markedNumber of the skin.
		 */
		setMarkedLine: function(line)
		{
			line = (line != null && classes.markedLine != null && classes.markedNumber != null &&
				line >= 1) ? Math.floor(line) : null;

			if (line != marked)
			{
				marked = line;

				if (marked != null && band == null)
				{
					band = document.createElement('div');
					band.className = classes.markedLine;
					band.setAttribute('aria-hidden', 'true');
					editor.insertBefore(band, editor.firstChild);
				}

				render();

				if (band != null && (marked == null || !text.isConnected))
				{
					band.style.display = 'none';
				}
			}
		},
		getMarkedLine: function()
		{
			return marked;
		}
	};
};

/**
 * The languages of the colours: tokenize(text, state, out) calls out(text,
 * kind) for the parts of the given text of a line (kind is key, tag, value,
 * mark, comment or null), starting in the given state, and returns the state
 * after it; stateAt(value, offset, cache) returns the state at the given
 * offset of the code (from the text before it, so that the lines in view can
 * be coloured without the lines above them; the cache is an object of the
 * field where the language keeps what it finds once per code).
 */
CodeField.languages = {};

/**
 * XML (Edit Diagram): the names of the tags, the names and the values of
 * the attributes, the marks (< / > = and the quotes, entities), comments,
 * CDATA and declarations.
 */
CodeField.languages.xml = (function()
{
	var TEXT = 0, NAME = 1, TAG = 2, DQ = 3, SQ = 4, COMMENT = 5, CDATA = 6, DECL = 7;
	var space = /\s/;

	// Text and values with entities as marks
	var withEntities = function(str, kind, out)
	{
		var re = /&#?[\w.-]+;/g;
		var last = 0;
		var match = re.exec(str);

		while (match != null)
		{
			out(str.substring(last, match.index), kind);
			out(match[0], 'mark');
			last = match.index + match[0].length;
			match = re.exec(str);
		}

		out(str.substring(last), kind);
	};

	var until = function(str, i, end, state, kind, out)
	{
		var e = str.indexOf(end, i);

		if (e < 0)
		{
			out(str.substring(i), kind);

			return {i: str.length, state: state};
		}

		out(str.substring(i, e), kind);
		out(end, (kind == 'comment') ? 'comment' : 'mark');

		return {i: e + end.length, state: TEXT};
	};

	var tokenize = function(str, state, out)
	{
		var i = 0;
		var n = str.length;

		while (i < n)
		{
			if (state == TEXT)
			{
				var lt = str.indexOf('<', i);
				var end = (lt < 0) ? n : lt;
				withEntities(str.substring(i, end), null, out);
				i = end;

				if (lt >= 0)
				{
					if (str.substring(lt, lt + 4) == '<!--')
					{
						out('<!--', 'comment');
						state = COMMENT;
						i = lt + 4;
					}
					else if (str.substring(lt, lt + 9) == '<![CDATA[')
					{
						out('<![CDATA[', 'mark');
						state = CDATA;
						i = lt + 9;
					}
					else if (str.charAt(lt + 1) == '?' || str.charAt(lt + 1) == '!')
					{
						out(str.substring(lt, lt + 2), 'mark');
						state = DECL;
						i = lt + 2;
					}
					else
					{
						var j = (str.charAt(lt + 1) == '/') ? lt + 2 : lt + 1;
						out(str.substring(lt, j), 'mark');
						state = NAME;
						i = j;
					}
				}
			}
			else if (state == NAME || state == TAG)
			{
				var c = str.charAt(i);

				if (space.test(c))
				{
					var k = i + 1;

					while (k < n && space.test(str.charAt(k)))
					{
						k++;
					}

					out(str.substring(i, k), null);
					state = TAG;
					i = k;
				}
				else if (c == '>')
				{
					out('>', 'mark');
					state = TEXT;
					i++;
				}
				else if (c == '/' && str.charAt(i + 1) == '>')
				{
					out('/>', 'mark');
					state = TEXT;
					i += 2;
				}
				else if (c == '=' || c == '/')
				{
					out(c, 'mark');
					i++;
				}
				else if (c == '"' || c == '\'')
				{
					out(c, 'mark');
					state = (c == '"') ? DQ : SQ;
					i++;
				}
				else
				{
					var m = i + 1;

					while (m < n && !/[\s=\/>"']/.test(str.charAt(m)))
					{
						m++;
					}

					out(str.substring(i, m), (state == NAME) ? 'tag' : 'key');
					state = TAG;
					i = m;
				}
			}
			else if (state == DQ || state == SQ)
			{
				var quote = (state == DQ) ? '"' : '\'';
				var q = str.indexOf(quote, i);
				withEntities(str.substring(i, (q < 0) ? n : q), 'value', out);

				if (q < 0)
				{
					i = n;
				}
				else
				{
					out(quote, 'mark');
					state = TAG;
					i = q + 1;
				}
			}
			else if (state == COMMENT)
			{
				var r = until(str, i, '-->', COMMENT, 'comment', out);
				i = r.i;
				state = r.state;
			}
			else if (state == CDATA)
			{
				var s = until(str, i, ']]>', CDATA, null, out);
				i = s.i;
				state = s.state;
			}
			else
			{
				var t = until(str, i, '>', DECL, 'mark', out);
				i = t.i;
				state = t.state;
			}
		}

		return state;
	};

	// The comments and CDATA sections of the given code as [start, end, state,
	// ...] (end after the closing marks, Infinity if there are none), found
	// once per code and kept in the given cache: the lines in view of large
	// code ask for the state of each long line, and searching the code
	// backwards for the marks of comments, which most diagrams do not have,
	// took milliseconds every time
	var getSections = function(value, cache)
	{
		if (cache.value !== value)
		{
			var sections = [];
			var c = value.indexOf('<!--');
			var d = value.indexOf('<![CDATA[');

			while (c >= 0 || d >= 0)
			{
				var comment = d < 0 || (c >= 0 && c < d);
				var start = (comment) ? c : d;
				var e = value.indexOf((comment) ? '-->' : ']]>', start + ((comment) ? 4 : 9));
				var end = (e < 0) ? Infinity : e + 3;
				sections.push(start, end, (comment) ? COMMENT : CDATA);

				if (e < 0)
				{
					break;
				}

				c = (c >= 0 && c < end) ? value.indexOf('<!--', end) : c;
				d = (d >= 0 && d < end) ? value.indexOf('<![CDATA[', end) : d;
			}

			cache.value = value;
			cache.sections = sections;
			cache.firstTag = value.indexOf('<');
			cache.last = null;
		}

		return cache.sections;
	};

	// The state at the given offset from the text before it: in a comment, in
	// CDATA, in a tag (its name, between its attributes or in a value) or in
	// the text. The cache is an object of the field that keeps what is found
	// once per code (see getSections).
	var stateAt = function(value, offset, cache)
	{
		if (offset <= 0)
		{
			return TEXT;
		}

		cache = cache || {};
		var sections = getSections(value, cache);

		// The last section that starts before the offset
		var lo = 0;
		var hi = sections.length / 3 - 1;
		var found = -1;

		while (lo <= hi)
		{
			var mid = (lo + hi) >> 1;

			if (sections[mid * 3] < offset)
			{
				found = mid;
				lo = mid + 1;
			}
			else
			{
				hi = mid - 1;
			}
		}

		if (found >= 0 && offset < sections[found * 3 + 1])
		{
			return sections[found * 3 + 2];
		}

		if (cache.firstTag < 0 || cache.firstTag >= offset)
		{
			return TEXT;
		}

		// The last < before the offset starts the tag (or the declaration) the
		// offset is in, if any. The lines in view ask in the order of the
		// offsets, so the state at the last offset of the same code is where
		// the search goes on (cache.last): a tag over many long lines, such as
		// a large value of an attribute, is searched once per paint and not
		// once per line.
		var last = cache.last;
		var lt = -1;
		var pos = -1;
		var state = TEXT;

		if (last != null && last.offset <= offset)
		{
			lt = value.substring(last.offset, offset).lastIndexOf('<');
			lt = (lt >= 0) ? last.offset + lt : last.lt;

			if (lt == last.lt)
			{
				pos = last.offset;
				state = last.state;
			}
		}
		else
		{
			lt = value.lastIndexOf('<', offset - 1);
		}

		// After the end of a comment or of CDATA that holds the last <
		if (lt < 0 || (found >= 0 && lt < sections[found * 3 + 1]))
		{
			pos = offset;
			state = TEXT;
		}
		else if (pos < 0)
		{
			var next = value.charAt(lt + 1);
			state = (next == '!' || next == '?') ? DECL : NAME;
			pos = Math.min(offset, lt + ((next == '/' || state == DECL) ? 2 : 1));
		}

		cache.last = {offset: offset, lt: lt, state: scanTag(value.substring(pos, offset), state)};

		return cache.last.state;
	};

	// The state after the given text of a tag (or of a declaration) that
	// starts in the given state and has no < in it: in its name, between its
	// attributes or in a value, or TEXT after its end. A > in a value does
	// not end the tag (as in tokenize).
	var scanTag = function(str, state)
	{
		var i = 0;

		if (state == DECL)
		{
			return (str.indexOf('>') < 0) ? DECL : TEXT;
		}
		else if (state == NAME)
		{
			if (!/[\s"'=\/>]/.test(str))
			{
				return NAME;
			}

			state = TAG;
		}

		var marks = /["'>]/g;

		while (state != TEXT)
		{
			if (state == DQ || state == SQ)
			{
				var close = str.indexOf((state == DQ) ? '"' : '\'', i);

				if (close < 0)
				{
					break;
				}

				state = TAG;
				i = close + 1;
			}
			else
			{
				marks.lastIndex = i;
				var match = marks.exec(str);

				if (match == null)
				{
					break;
				}

				state = (match[0] == '>') ? TEXT : ((match[0] == '"') ? DQ : SQ);
				i = match.index + 1;
			}
		}

		return state;
	};

	return {tokenize: tokenize, stateAt: stateAt};
})();

/**
 * Mermaid (Insert › Mermaid): the type of the diagram and its direction, the
 * keywords, strings and labels of links, the arrows and brackets as marks and
 * comments (%%). Each line is coloured on its own.
 */
CodeField.languages.mermaid = (function()
{
	var types = ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'classDiagram-v2', 'stateDiagram',
		'stateDiagram-v2', 'erDiagram', 'journey', 'gantt', 'pie', 'quadrantChart', 'requirementDiagram',
		'gitGraph', 'C4Context', 'C4Container', 'C4Component', 'C4Dynamic', 'C4Deployment', 'mindmap',
		'timeline', 'zenuml', 'sankey-beta', 'xychart-beta', 'block-beta', 'packet-beta', 'kanban',
		'architecture-beta', 'radar-beta', 'treemap-beta', 'TD', 'TB', 'BT', 'LR', 'RL'];
	var keywords = ['subgraph', 'end', 'direction', 'click', 'call', 'href', 'style', 'linkStyle',
		'classDef', 'class', 'participant', 'actor', 'as', 'note', 'Note', 'over', 'left', 'right', 'of',
		'loop', 'alt', 'else', 'opt', 'par', 'and', 'rect', 'critical', 'break', 'activate', 'deactivate',
		'autonumber', 'box', 'title', 'section', 'dateFormat', 'axisFormat', 'tickInterval', 'excludes',
		'includes', 'todayMarker', 'state', 'accTitle', 'accDescr', 'commit', 'branch', 'checkout',
		'merge', 'cherry-pick', 'showData', 'namespace', 'link', 'links', 'create', 'destroy', 'x-axis',
		'y-axis', 'quadrant-1', 'quadrant-2', 'quadrant-3', 'quadrant-4', 'columns', 'block', 'group',
		'service', 'junction'];
	// Without the names of Object.prototype (constructor, toString)
	var isType = Object.create(null);
	var isKeyword = Object.create(null);

	for (var i = 0; i < types.length; i++)
	{
		isType[types[i]] = true;
	}

	for (var j = 0; j < keywords.length; j++)
	{
		isKeyword[keywords[j]] = true;
	}

	// Strings, labels of links, arrows, brackets and words
	var token = /("[^"]*"?)|(\|[^|]*\|?)|((?:<\||[<xo*])?(?:[-=.~]{2,}|-)(?:[->]?>>?|\|>|[xo*)])|(?:<\||[<xo*])?[-=.~]{2,})|([\[\](){}<>;:,&])|([A-Za-z_]\w*(?:-(?![-.>=])\w+)*)|(\s+)|(.)/g;

	var tokenize = function(str, state, out)
	{
		if (/^\s*%%/.test(str))
		{
			out(str, 'comment');

			return null;
		}

		token.lastIndex = 0;
		var first = true;
		var match = token.exec(str);

		while (match != null && match[0].length > 0)
		{
			var text = match[0];

			if (match[1] != null)
			{
				out(text, 'value');
			}
			else if (match[2] != null)
			{
				out('|', 'mark');
				var inner = text.substring(1, (text.length > 1 && text.charAt(text.length - 1) == '|') ?
					text.length - 1 : text.length);
				out(inner, 'value');

				if (text.length > 1 && text.charAt(text.length - 1) == '|')
				{
					out('|', 'mark');
				}
			}
			else if (match[3] != null || match[4] != null)
			{
				out(text, 'mark');
			}
			else if (match[5] != null)
			{
				out(text, (isType[text] && (first || /^(TD|TB|BT|LR|RL)$/.test(text))) ? 'tag' :
					((isKeyword[text]) ? 'key' : null));
			}
			else
			{
				out(text, null);
			}

			if (match[6] == null)
			{
				first = false;
			}

			match = token.exec(str);
		}

		return null;
	};

	var stateAt = function(value, offset, cache)
	{
		return null;
	};

	return {tokenize: tokenize, stateAt: stateAt};
})();

/**
 * Puts the given code into the given text area once the dialog that it is in
 * has been shown, if it is longer than CodeField.fillLaterLength: the dialog
 * shows its frame and the given note says that it is loading, then the
 * browser lays the text out. Until then the given buttons are disabled and
 * the text area is read only. Returns true if the code is put later.
 */
CodeField.fillLater = function(text, code, note, buttons)
{
	if (code.length <= CodeField.fillLaterLength)
	{
		return false;
	}

	var readOnly = text.readOnly;
	text.readOnly = true;
	var disabled = [];

	for (var i = 0; i < buttons.length; i++)
	{
		if (buttons[i] != null && !buttons[i].disabled)
		{
			buttons[i].disabled = true;
			disabled.push(buttons[i]);
		}
	}

	var previous = null;

	if (note != null)
	{
		previous = {text: note.textContent, hidden: note.hidden};
		note.textContent = mxResources.get('loading') + '... (' + CodeField.formatSize(code.length) + ')';
		note.hidden = false;
	}

	// After the frame of the dialog is painted
	window.requestAnimationFrame(function()
	{
		window.setTimeout(function()
		{
			if (note != null && note.textContent.indexOf(mxResources.get('loading')) == 0)
			{
				note.textContent = previous.text;
				note.hidden = previous.hidden;
			}

			text.readOnly = readOnly;
			text.value = code;

			for (var j = 0; j < disabled.length; j++)
			{
				disabled[j].disabled = false;
			}

			// The caret at the end, as for code that is in the field when it is
			// shown (EditDiagramDialog.init)
			if (document.activeElement == null || document.activeElement == document.body ||
				document.activeElement == text)
			{
				text.blur();
				text.focus();
			}
		}, 0);
	});

	return true;
};
