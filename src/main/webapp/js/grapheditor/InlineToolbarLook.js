/**
 * Copyright (c) 2006-2026, JGraph Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * The look of the inline toolbar in every theme, the look of Fusion (formerly
 * only in Fusion, SimpleInlineToolbar.js and the toolbar of
 * SimpleSuggestions.js, until 17 November 2026; the driver: "wir ersetzen die
 * alte Shape Inline Toolbar komplett"): the tool pill with the outline
 * glyphs, the button of the open popover in the accent, the popovers in the
 * frame of More with sections, heads and hairlines, fields, selects,
 * swatches, toggles and grids, the lists below their selects with the frame
 * and the rows of menus, Opacity as a slider, Corners as a toggle group,
 * Clear waypoints as a row and More with the effects as chips, the
 * sections Order and Actions and, outside Fusion, Options (the options of
 * the cells that have no other place, as icons). The controls of
 * InlineToolbar.js are kept (what they do, their titles and their order);
 * only their presentation changes. The names keep the Simple of Fusion,
 * whose tests and hooks use them.
 *
 * The CSS is the block geInlineToolbarUi of grapheditor.css (the tokens of
 * Fusion with their values, so the colors of Fusion in light and dark mode
 * and its font in every theme, on the diagram container, see
 * getThemeClass), and fusion.css in Fusion, which sets no class
 * (SimpleSuggestions.js). Fusion adds Suggested, the Spacing of ties and the
 * Omnibox to More, Bundle and the flow rows (SimpleSuggestions.js) and the
 * sentence case of its labels (SimpleWording.js) through the hooks below.
 */
(function()
{
	if (typeof InlineToolbar === 'undefined')
	{
		return;
	}

	/**
	 * Returns a data URI of an SVG.
	 */
	InlineToolbar.createSvgImage = function(svg)
	{
		return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
	};

	/**
	 * Creates a glyph from an SVG with the given content on a 24 px grid. The
	 * glyphs are masks over the current color, so one asset serves light,
	 * dark, hover, active and disabled (as SimpleUi.createSvgIcon).
	 */
	InlineToolbar.createSvgIcon = function(content)
	{
		return InlineToolbar.createSvgImage('<svg xmlns="http://www.w3.org/2000/svg" ' +
			'viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" ' +
			'stroke-linecap="round" stroke-linejoin="round">' + content + '</svg>');
	};

	/**
	 * The glyphs of the toolbar, its popovers and More (the set of Fusion,
	 * outline, 1.8 px stroke, round caps).
	 */
	InlineToolbar.glyphs = {
		chevronDown: InlineToolbar.createSvgIcon('<path d="M6 9.5l6 6 6-6"/>'),
		chevronUp: InlineToolbar.createSvgIcon('<path d="M6 14.5l6-6 6 6"/>'),
		search: InlineToolbar.createSvgIcon('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>'),
		lineStyle: InlineToolbar.createSvgIcon('<path d="M4 8h16M4 16h3M10.5 16h3M17 16h3"/>'),
		fill: InlineToolbar.createSvgIcon('<path d="M11 4.5l7 7-7.3 7.3a1.6 1.6 0 0 1-2.3 0l-4.7-4.7a1.6 1.6 0 0 1 0-2.3z"/><path d="M6.5 3l4.5 4.5M4 13h12.5"/><path d="M21 18.6a1.75 1.75 0 1 1-3.5 0c0-1.3 1.2-2 1.75-3.6.55 1.6 1.75 2.3 1.75 3.6z"/>'),
		shapes: InlineToolbar.createSvgIcon('<circle cx="9" cy="9" r="5"/><path d="M11 13h8.5v7H11z" />'),
		lineEnds: InlineToolbar.createSvgIcon('<circle cx="5.5" cy="12" r="2"/><path d="M7.5 12H15"/><path d="M15 7.5l5 4.5-5 4.5z"/>'),
		connection: InlineToolbar.createSvgIcon('<path d="M5 20V10.5A4.5 4.5 0 0 1 9.5 6H20"/>'),
		textStyle: InlineToolbar.createSvgIcon('<path d="M5.5 19.5 12 4.5l6.5 15M8.1 13.5h7.8"/>'),
		table: InlineToolbar.createSvgIcon('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10M14.5 9.5v10"/>'),
		align: InlineToolbar.createSvgIcon('<path d="M4 3.5v17"/><rect x="7.5" y="6" width="12" height="4" rx="1"/><rect x="7.5" y="14" width="7" height="4" rx="1"/>'),
		more: InlineToolbar.createSvgImage('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>'),
		waypoints: InlineToolbar.createSvgIcon('<path d="M4 18.5h6v-13h10"/><circle cx="10" cy="18.5" r="1.6"/><circle cx="10" cy="5.5" r="1.6"/>'),
		unlock: InlineToolbar.createSvgIcon('<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8.5 10.5V7a3.5 3.5 0 0 1 6.8-1.2"/>'),
		lock: InlineToolbar.createSvgIcon('<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5"/>'),
		toFront: InlineToolbar.createSvgIcon('<rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M15.5 8.5v-4h-11v11h4"/><path d="M11 12h6M11 15h6" />'),
		bringForward: InlineToolbar.createSvgIcon('<rect x="3.5" y="9.5" width="11" height="11" rx="1.5"/><path d="M18 15.5V4M14.5 7.5L18 4l3.5 3.5"/>'),
		sendBackward: InlineToolbar.createSvgIcon('<rect x="3.5" y="3.5" width="11" height="11" rx="1.5"/><path d="M18 8.5V20M14.5 16.5L18 20l3.5-3.5"/>'),
		toBack: InlineToolbar.createSvgIcon('<rect x="4.5" y="4.5" width="11" height="11" rx="1.5"/><path d="M8.5 15.5v4h11v-11h-4"/><path d="M7.5 8h5M7.5 11h5" />'),
		trash: InlineToolbar.createSvgIcon('<path d="M4.5 7h15M10 7V4.5h4V7M6.5 7l1 12.5h9l1-12.5M10.5 11v5M13.5 11v5"/>'),
		link: InlineToolbar.createSvgIcon('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
		paste: InlineToolbar.createSvgIcon('<path d="M8.5 5H6v15.5h12V5h-2.5"/><rect x="8.5" y="3.5" width="7" height="3" rx="1"/>'),
		duplicate: InlineToolbar.createSvgIcon('<rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M15.5 8.5v-4h-11v11h4"/><path d="M14 11.5v5M11.5 14h5"/>'),
		copyStyle: InlineToolbar.createSvgIcon('<rect x="4" y="3.5" width="13" height="6" rx="1.5"/><path d="M17 6.5h2.5v5.5H11v2.5"/><rect x="9.5" y="14.5" width="3" height="6" rx="1"/>'),
		shadow: InlineToolbar.createSvgIcon('<rect x="4" y="4" width="12" height="12" rx="2"/><path d="M8 20h9a3 3 0 0 0 3-3V8"/>'),
		sketch: InlineToolbar.createSvgIcon('<path d="M3 17c3-6 5-9 7-9s0 8 3 8 3-6 5-6 2 4 3 4"/>'),
		glass: InlineToolbar.createSvgIcon('<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.5"/>'),
		multiple: InlineToolbar.createSvgIcon('<path d="M8.5 6.5V3.5h7l3.5 3.5v10.5h-3"/><path d="M5 7h7.5l3.5 3.5v10h-11z"/>'),
		flowAnimation: InlineToolbar.createSvgIcon('<path d="M3 12h3M9 12h3M15 12h2"/><circle cx="20" cy="12" r="1.8" fill="#000"/>'),
		orthogonal: InlineToolbar.createSvgIcon('<path d="M4 5v7h16v7"/>'),
		followTerminals: InlineToolbar.createSvgIcon('<circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path d="M7 12h10"/>'),
		labelPlacement: InlineToolbar.createSvgIcon('<rect x="4" y="8" width="16" height="8" rx="2"/><path d="M8 12h8"/>'),
		// Ties (the glyphs of Fusion, SimpleUi.icons): connectors with the
		// strap of a tie, cut connectors, the connectors of a tie and a dashed
		// line across connectors (Draw a tie)
		tie: InlineToolbar.createSvgIcon('<path d="M3 7h18M3 12h18M3 17h18"/><rect x="10" y="3.5" width="4" height="17" rx="1.2"/>'),
		untie: InlineToolbar.createSvgIcon('<path d="M3 7h6M15 7h6M3 12h6M15 12h6M3 17h6M15 17h6"/><path d="M10.5 20.5l3-17"/>'),
		tiedEdges: InlineToolbar.createSvgIcon('<path d="M8 7h8M8 17h8"/><rect x="3" y="5" width="4" height="4" rx=".6"/>' +
			'<rect x="17" y="5" width="4" height="4" rx=".6"/><rect x="3" y="15" width="4" height="4" rx=".6"/>' +
			'<rect x="17" y="15" width="4" height="4" rx=".6"/><path d="M12 4v16"/>'),
		drawTie: InlineToolbar.createSvgIcon('<path d="M3 7h18M3 12h18M3 17h18"/><path d="M8 21 16 3" stroke-dasharray="2.5 2"/>'),
		// The sparkle of Suggested (concept 3.9)
		sparkle: InlineToolbar.createSvgIcon('<path d="M10 3.5l1.6 4.4 4.4 1.6-4.4 1.6L10 15.5l-1.6-4.4L4 9.5l4.4-1.6z' +
			'M17.5 13.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>')
	};

	/**
	 * The glyphs of the effects of More by the style key of their option
	 * (as Format.simpleEffectIcons of Fusion); options of other keys (eg. the
	 * primary options of custom shapes) are chips without a glyph.
	 */
	InlineToolbar.effectGlyphs = {shadow: InlineToolbar.glyphs.shadow,
		sketch: InlineToolbar.glyphs.sketch, glass: InlineToolbar.glyphs.glass,
		multiple: InlineToolbar.glyphs.multiple, flowAnimation: InlineToolbar.glyphs.flowAnimation,
		orthogonal: InlineToolbar.glyphs.orthogonal, followTerminals: InlineToolbar.glyphs.followTerminals,
		labelPlacement: InlineToolbar.glyphs.labelPlacement};

	/**
	 * Creates an icon with the given image (a data URI, see createSvgIcon).
	 */
	InlineToolbar.createIcon = function(image, className)
	{
		var icon = document.createElement('span');
		icon.className = 'geSmIcon' + ((className != null) ? ' ' + className : '');
		icon.style.setProperty('--sm-ic', 'url(\'' + image + '\')');
		icon.setAttribute('aria-hidden', 'true');

		return icon;
	};

	/**
	 * Creates an icon button with the given image and title that calls fn.
	 */
	InlineToolbar.createIconButton = function(image, title, fn, className)
	{
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = 'geSmIconBtn' + ((className != null) ? ' ' + className : '');
		btn.setAttribute('title', title);
		btn.setAttribute('aria-label', title);
		btn.appendChild(InlineToolbar.createIcon(image));

		mxEvent.addListener(btn, 'click', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});

		return btn;
	};

	/**
	 * Creates the caption of a section with the given title and optional icon
	 * (a data URI or an element).
	 */
	InlineToolbar.createSectionHead = function(title, image)
	{
		var head = document.createElement('div');
		head.className = 'geSmSectionHead';
		head.setAttribute('role', 'heading');
		head.setAttribute('aria-level', '3');

		if (image != null && image.nodeType == 1)
		{
			head.appendChild(image);
		}
		else if (image != null)
		{
			head.appendChild(InlineToolbar.createIcon(image));
		}

		mxUtils.write(head, title);

		return head;
	};

	/**
	 * Creates a toggle group (segmented control) for the given items, which are
	 * {value, label, title}. It is a radio group: the arrow keys move the
	 * selection, Home and End go to the first and last item. fn is called with
	 * the value and the event of a change.
	 */
	InlineToolbar.createToggleGroup = function(items, value, fn, label)
	{
		var group = document.createElement('div');
		group.className = 'geSmSeg';
		group.setAttribute('role', 'radiogroup');

		if (label != null)
		{
			group.setAttribute('aria-label', label);
		}

		var buttons = [];
		var current = -1;

		var setIndex = function(index)
		{
			current = index;

			for (var i = 0; i < buttons.length; i++)
			{
				var on = i == index;
				buttons[i].classList.toggle('geSmOn', on);
				buttons[i].setAttribute('aria-checked', (on) ? 'true' : 'false');
				buttons[i].setAttribute('tabindex', (on || (index < 0 && i == 0)) ? '0' : '-1');
			}
		};

		var choose = function(index, evt, focus)
		{
			if (index >= 0 && index < buttons.length && !buttons[index].disabled)
			{
				var changed = index != current;
				setIndex(index);

				if (focus)
				{
					buttons[index].focus();
				}

				if (changed)
				{
					fn(items[index].value, evt);
				}
			}
		};

		for (var i = 0; i < items.length; i++)
		{
			(function(index)
			{
				var btn = document.createElement('button');
				btn.setAttribute('type', 'button');
				btn.setAttribute('role', 'radio');
				mxUtils.write(btn, items[index].label);

				if (items[index].title != null && items[index].title != items[index].label)
				{
					btn.setAttribute('title', items[index].title);
				}

				mxEvent.addListener(btn, 'click', function(evt)
				{
					choose(index, evt);
					mxEvent.consume(evt);
				});

				buttons.push(btn);
				group.appendChild(btn);
			})(i);
		}

		// The next enabled button from the given index in the given direction
		// (disabled choices are skipped, as in radio groups), or -1
		var enabled = function(from, step)
		{
			for (var i = 0, j = from; i < buttons.length; i++, j = (j + step + buttons.length) % buttons.length)
			{
				if (!buttons[j].disabled)
				{
					return j;
				}
			}

			return -1;
		};

		mxEvent.addListener(group, 'keydown', function(evt)
		{
			var index = mxUtils.indexOf(buttons, document.activeElement);
			var next = -1;

			if (evt.key == 'ArrowRight' || evt.key == 'ArrowDown')
			{
				next = enabled((index + 1) % buttons.length, 1);
			}
			else if (evt.key == 'ArrowLeft' || evt.key == 'ArrowUp')
			{
				next = enabled((index + buttons.length - 1) % buttons.length, -1);
			}
			else if (evt.key == 'Home')
			{
				next = enabled(0, 1);
			}
			else if (evt.key == 'End')
			{
				next = enabled(buttons.length - 1, -1);
			}

			if (next >= 0 && index >= 0)
			{
				choose(next, evt, true);
				mxEvent.consume(evt);
			}
		});

		group.setValue = function(v)
		{
			var index = -1;

			for (var i = 0; i < items.length; i++)
			{
				if (items[i].value == v)
				{
					index = i;
					break;
				}
			}

			setIndex(index);
		};

		group.setDisabled = function(disabled)
		{
			for (var i = 0; i < buttons.length; i++)
			{
				buttons[i].disabled = disabled;
			}
		};

		group.buttons = buttons;
		group.setValue(value);

		return group;
	};

	/**
	 * Returns the given label in the case of the look (a hook of Fusion,
	 * which writes its labels in sentence case).
	 */
	InlineToolbar.prototype.getSimpleLabel = function(label)
	{
		return label;
	};

	/**
	 * Returns the class that the diagram container has for the look, which
	 * gives the toolbar and its popovers the tokens of the look in the colors
	 * of the theme (geInlineToolbarUi in grapheditor.css), or null (a hook of
	 * Fusion, which has the tokens of its own).
	 */
	InlineToolbar.prototype.getThemeClass = function()
	{
		return 'geInlineToolbarUi';
	};

	/**
	 * Gives the diagram container the class of the look (see getThemeClass).
	 */
	InlineToolbar.prototype.updateThemeClass = function()
	{
		var cls = this.getThemeClass();

		if (this.themeClass != cls)
		{
			if (this.themeClass != null)
			{
				this.graph.container.classList.remove(this.themeClass);
			}

			if (cls != null)
			{
				this.graph.container.classList.add(cls);
			}

			this.themeClass = cls;
		}
	};

	/**
	 * Creates a slider of the look (in the accent, concept 3.7) for the value
	 * that getValue returns in the given graph. apply is called with the new
	 * value once per change (one edit) and onInput with the value while it is
	 * dragged. The slider keeps the focus after a change, as the arrow keys
	 * change it once per step; update reads the value again (not while it is
	 * dragged). Fusion uses it as EditorUi.createSimpleSlider.
	 */
	InlineToolbar.createSlider = function(graph, label, min, max, step, getValue, apply, onInput)
	{
		var input = document.createElement('input');
		input.className = 'geSmSlider';
		input.setAttribute('type', 'range');
		input.setAttribute('min', min);
		input.setAttribute('max', max);
		input.setAttribute('step', step);
		input.setAttribute('aria-label', label);
		var dragging = false;

		var updateFill = function()
		{
			var value = parseFloat(input.value);
			var fill = (isFinite(value) && max > min) ? (value - min) / (max - min) : 0;
			input.style.setProperty('--sm-value', Math.round(fill * 1000) / 10 + '%');
		};

		input.update = function()
		{
			if (!dragging)
			{
				var value = getValue();
				input.value = Math.max(min, Math.min(max, (isFinite(value)) ? value : min));
				updateFill();
			}
		};

		// The popovers of the toolbar consume the mouse down (so the cells
		// stay selected), which would keep the slider from moving: it stops
		// at the slider
		mxEvent.addListener(input, 'mousedown', function(evt)
		{
			evt.stopPropagation();
		});

		mxEvent.addListener(input, 'pointerdown', function()
		{
			dragging = true;
		});

		var endDrag = function()
		{
			dragging = false;
		};

		mxEvent.addListener(input, 'pointerup', endDrag);
		mxEvent.addListener(input, 'pointercancel', endDrag);
		mxEvent.addListener(input, 'blur', endDrag);

		mxEvent.addListener(input, 'input', function()
		{
			updateFill();

			if (onInput != null)
			{
				onInput(parseFloat(input.value));
			}
		});

		mxEvent.addListener(input, 'change', function()
		{
			dragging = false;
			graph.stopEditing(false);
			apply(parseFloat(input.value));
		});

		input.update();

		return input;
	};

	/**
	 * Creates a row of the given label (the column of 72 on the left, concept
	 * 3.11.4) and control (EditorUi.createSimpleControlRow in Fusion).
	 */
	InlineToolbar.createControlRow = function(label, control)
	{
		var row = document.createElement('div');
		row.className = 'geSmToolbarControlRow';

		var text = document.createElement('span');
		text.className = 'geSmToolbarControlLabel';
		mxUtils.write(text, label);
		row.appendChild(text);
		row.appendChild(control);
		row.labelElement = text;

		return row;
	};

	/**
	 * Creates a slider with its value after it (see createSlider). getText
	 * returns the text of a value; update reads the value again
	 * (EditorUi.createSimpleValueSlider in Fusion).
	 */
	InlineToolbar.createValueSlider = function(graph, label, min, max, step, getValue, apply, getText)
	{
		var group = document.createElement('span');
		group.className = 'geSmToolbarSliderGroup';
		var text = document.createElement('span');
		text.className = 'geSmToolbarValue';

		var slider = InlineToolbar.createSlider(graph, label, min, max, step, getValue, apply, function(value)
		{
			text.textContent = getText(value);
		});

		group.appendChild(slider);
		group.appendChild(text);

		group.update = function()
		{
			slider.update();
			text.textContent = getText(getValue());
		};

		group.update();

		return group;
	};

	/**
	 * The effects of More in their order with the resource of their label:
	 * the order and the names of the Effects of the Format panel (Sketch,
	 * Shadow, Flow animation, Glass and Multiple, see
	 * Format.simpleEffectOrder), so an effect has one name and one place in
	 * both (the driver, 10 November 2026: the toolbar said Stack,
	 * in German Stapel, and Flow for Multiple and Flow animation of the
	 * panel). Rounded is not an effect: it is Corners in the Line section of
	 * the panel. Connectors in Fusion also have Orthogonal ends, Follow
	 * terminals and Auto label placement as in the panel (the driver, 17
	 * November 2026: "die Effekte für die Kante noch ausbauen", see getOptions
	 * in SimpleSuggestions.js); the other themes have no such options.
	 */
	InlineToolbar.simpleEffects = [['sketch', 'sketch'], ['shadow', 'shadow'],
		['flowAnimation', 'flowAnimation'], ['glass', 'glass'], ['multiple', 'multiple'],
		['orthogonal', 'orthogonalEnds'], ['followTerminals', 'followTerminals'],
		['labelPlacement', 'autoLabelPlacement']];

	/**
	 * The color of the border of images is Border color as in the Line
	 * section of the panel (Format.js names it so for images), not Line color.
	 */
	var inlineToolbarCreateBorderSwatch = InlineToolbar.prototype.createColorSwatch;

	InlineToolbar.prototype.createColorSwatch = function(title, currentColor, styleKey)
	{
		if (styleKey == mxConstants.STYLE_IMAGE_BORDER)
		{
			var args = Array.prototype.slice.call(arguments);
			args[0] = mxResources.get('borderColor');

			return inlineToolbarCreateBorderSwatch.apply(this, args);
		}

		return inlineToolbarCreateBorderSwatch.apply(this, arguments);
	};

	/**
	 * Returns the buttons of the toolbar with the names of their glyphs in
	 * InlineToolbar.glyphs (the Bundle button has its glyph already, see
	 * createSimpleBundleButton).
	 */
	InlineToolbar.prototype.getSimpleButtonGlyphs = function()
	{
		return [[this.lineStyleBtn, 'lineStyle'], [this.fillBtn, 'fill'], [this.shapeBtn, 'shapes'],
			[this.lineEndBtn, 'lineEnds'], [this.connStyleBtn, 'connection'], [this.textBtn, 'textStyle'],
			[this.tableBtn, 'table'], [this.arrangeBtn, 'align'], [this.moreBtn, 'more']];
	};

	/**
	 * Gives the buttons of the toolbar the glyphs of the tool pill (the
	 * driver, 11 November 2026: "die inline toolbar passt vom design nicht
	 * zum rest"): masks over the color of the text instead of the black
	 * images of InlineToolbar.js, which dark mode inverts (geAdaptiveAsset).
	 */
	InlineToolbar.prototype.updateSimpleButtonGlyphs = function()
	{
		var glyphs = this.getSimpleButtonGlyphs();

		for (var i = 0; i < glyphs.length; i++)
		{
			var btn = glyphs[i][0];
			var image = InlineToolbar.glyphs[glyphs[i][1]];

			if (btn != null && image != null && btn.smGlyph == null)
			{
				btn.style.backgroundImage = 'none';
				btn.classList.remove('geAdaptiveAsset');
				btn.smGlyph = InlineToolbar.createIcon(image);
				btn.appendChild(btn.smGlyph);
			}
		}
	};

	/**
	 * Marks the button whose popover is open (geSmOn: accent soft and the
	 * accent, as the chosen tool of the pill and open menu buttons).
	 */
	InlineToolbar.prototype.updateSimpleOpenButton = function()
	{
		if (this.toolbar != null)
		{
			for (var btn = this.toolbar.firstChild; btn != null; btn = btn.nextSibling)
			{
				if (btn.classList != null)
				{
					btn.classList.toggle('geSmOn', btn == this.currentPopoverAnchor &&
						this.currentPopover != null);
				}
			}
		}
	};

	/**
	 * Every popover of the inline toolbar has the frame of More
	 * (applySimplePopoverFrame): the popovers of InlineToolbar.js (Line,
	 * Fill, Text, Line ends, Connection, Arrange, Table and Shape) get
	 * geSmInlinePanel, which decorateSimplePopover puts in sections.
	 */
	var inlineToolbarCreateFramedPopover = InlineToolbar.prototype.createPopover;

	InlineToolbar.prototype.createPopover = function()
	{
		this.updateThemeClass();
		var result = inlineToolbarCreateFramedPopover.apply(this, arguments);
		this.updateSimpleOpenButton();

		if (result != null)
		{
			this.applySimplePopoverFrame(result, 'geSmInlinePanel');
		}

		return result;
	};

	/**
	 * Gives the given popover the frame of the look (tokens instead of the
	 * colors of InlineToolbar.js) with the given class: the frame of a
	 * menu (geSmToolbarPanel), the arrow in the border and the surface and
	 * the keys that stay in the popover.
	 */
	InlineToolbar.prototype.applySimplePopoverFrame = function(p, className)
	{
		var body = p.body;
		body.className = 'geSmToolbarPanel' + ((className != null) ? ' ' + className : '');

		var props = ['backgroundColor', 'border', 'borderRadius', 'boxShadow', 'padding'];

		for (var i = 0; i < props.length; i++)
		{
			body.style[props[i]] = '';
		}

		// The arrow: a rotated square in the border and one in the surface
		var arrows = [p.popover.firstChild, p.popover.firstChild.nextSibling];
		arrows[0].className = 'geSmToolbarArrow';
		arrows[1].className = 'geSmToolbarArrowFill';

		for (var i = 0; i < arrows.length; i++)
		{
			arrows[i].style.backgroundColor = '';
		}

		// Keys in the popover are not keys of the diagram (Enter on a button
		// would edit the label), except Escape, which closes it
		if (!body.smFrame)
		{
			body.smFrame = true;

			mxEvent.addListener(body, 'keydown', function(evt)
			{
				if (evt.keyCode != 27)
				{
					evt.stopPropagation();
				}
			});
		}
	};

	/**
	 * The bar and the buttons of the tool pill (geSmInlineToolbar and the
	 * glyphs of the set) and the class of the look on the diagram container.
	 */
	var inlineToolbarUpdateButtons = InlineToolbar.prototype.updateButtons;

	InlineToolbar.prototype.updateButtons = function()
	{
		var result = inlineToolbarUpdateButtons.apply(this, arguments);
		this.updateThemeClass();
		this.toolbar.classList.add('geSmInlineToolbar');
		this.updateSimpleButtonGlyphs();
		this.updateSimpleBundleButton();

		return result;
	};

	/**
	 * Returns true if Bundle applies to the given connectors and shapes of
	 * the selection: two or more connectors and no shapes.
	 */
	InlineToolbar.prototype.isSimpleBundleSelection = function(edges, shapes)
	{
		return edges.length > 1 && shapes.length == 0;
	};

	/**
	 * Returns the connectors of the selection that Bundle ties (see
	 * Graph.canBundleEdge) and its shapes, the vertices but for labels, also
	 * the rows and cells of tables, so the button is for connectors only:
	 * {edges, shapes}.
	 */
	InlineToolbar.prototype.getSimpleBundleCells = function()
	{
		var graph = this.graph;
		var cells = (this.currentCells != null) ? this.currentCells : [];
		var result = {edges: [], shapes: []};

		for (var i = 0; i < cells.length; i++)
		{
			if (graph.model.isEdge(cells[i]))
			{
				if (graph.canBundleEdge(cells[i]))
				{
					result.edges.push(cells[i]);
				}
			}
			else if (graph.model.isVertex(cells[i]) && !this.isLabelCell(cells[i]))
			{
				result.shapes.push(cells[i]);
			}
		}

		return result;
	};

	/**
	 * Shows the Bundle button for two or more connectors (see
	 * isSimpleBundleSelection), in every theme as in Fusion (the driver, 19
	 * November 2026: "Im Fusion-Theme hat die Inline Toolbar bei mehreren
	 * markierten Kanten einen Tie-Button … bitte dort ergänzen"; until then
	 * only Fusion had it, in SimpleSuggestions.js), after Text and before
	 * More, unless the configuration hides Bundle (hideMenuItems, see
	 * isActionVisible). The button is created when it is first needed.
	 */
	InlineToolbar.prototype.updateSimpleBundleButton = function()
	{
		var target = this.getSimpleBundleCells();
		var unlocked = this.currentCells.length != 1 ||
			!this.isUnlockable(this.currentCells[0]);
		var bundle = unlocked && this.isActionVisible('bundle') &&
			this.isSimpleBundleSelection(target.edges, target.shapes);

		if (bundle && this.simpleBundleBtn == null)
		{
			this.createSimpleBundleButton();
		}

		if (this.simpleBundleBtn != null)
		{
			this.simpleBundleBtn.style.display = (bundle) ? 'inline-block' : 'none';

			// Spacing to the previous visible button (see updateButtons)
			var first = true;

			for (var btn = this.toolbar.firstChild; btn != null; btn = btn.nextSibling)
			{
				if (btn.style.display != 'none')
				{
					btn.style.marginLeft = (first) ? '' : '4px';
					first = false;
				}
			}
		}
	};

	/**
	 * Creates the Bundle button of the toolbar (before More) with the glyph
	 * of a tie. Its tooltip says what Bundle does and the gesture
	 * (Alt+Shift+drag).
	 */
	InlineToolbar.prototype.createSimpleBundleButton = function()
	{
		var btn = document.createElement('div');
		btn.className = 'geSmToolbarBundleBtn';
		btn.style.width = (this.iconSize - 4) + 'px';
		btn.style.height = (this.iconSize - 4) + 'px';
		btn.style.display = 'none';
		btn.style.verticalAlign = 'top';
		btn.style.cursor = 'pointer';
		btn.setAttribute('role', 'button');
		btn.setAttribute('title', [mxResources.get('bundle'), mxResources.get('bundleHint'),
			mxResources.get('bundleTip', [Editor.altKey + '+' + Editor.shiftKey])].join('\n'));
		btn.setAttribute('aria-label', mxResources.get('bundle'));
		btn.appendChild(InlineToolbar.createIcon(InlineToolbar.glyphs.tie));

		// The press before the click says if a finger or a pen taps the button
		// (the click of some browsers has no pointerType)
		var press = null;

		mxEvent.addGestureListeners(btn, function(evt)
		{
			press = evt;
		});

		mxEvent.addListener(btn, 'click', mxUtils.bind(this, function(evt)
		{
			var touch = this.editorUi.isCoarseEvent(evt) ||
				(press != null && this.editorUi.isCoarseEvent(press));
			press = null;

			if (this.graph.isEnabled())
			{
				if (this.currentPopoverAnchor == btn)
				{
					this.hidePopover();
				}
				else
				{
					this.runSimpleBundle(touch);
				}

				mxEvent.consume(evt);
			}
		}));

		this.toolbar.insertBefore(btn, this.moreBtn);
		this.simpleBundleBtn = btn;
	};

	/**
	 * Bundle of the toolbar (Undo instead of confirm, concept 2.1): ties the
	 * selected connectors at once (the action shows the toast with Undo
	 * where the theme has it, see UndoToast.installBundleAction), or shows
	 * the popover for connectors with ties, for coarse pointers and for a
	 * tap of a finger or a pen (touch is true, eg. on a touchscreen laptop):
	 * Bundle, Draw a tie, Unbundle, Select tied connectors.
	 */
	InlineToolbar.prototype.runSimpleBundle = function(touch)
	{
		var edges = this.getTargetCells('edge');

		// Coarse pointers and taps have no Alt+Shift+drag, so the popover
		// offers Draw a tie
		if (this.graph.hasTies(edges) || touch || this.editorUi.isCoarsePointer())
		{
			this.showSimpleBundleMenu();
		}
		else
		{
			var action = this.editorUi.actions.get('bundle');
			this.hidePopover();

			if (action != null && action.isEnabled() && this.isActionVisible('bundle'))
			{
				action.funct();
			}
		}
	};

	/**
	 * Shows the popover of the Bundle button for connectors with ties and
	 * for coarse pointers: Bundle, Draw a tie, Unbundle and Select tied
	 * connectors, those that apply (Bundle of connectors without ties needs
	 * no popover for fine pointers, which draw ties with Alt+Shift+drag, see
	 * runSimpleBundle).
	 */
	InlineToolbar.prototype.showSimpleBundleMenu = function()
	{
		var ui = this.editorUi;
		var graph = this.graph;
		var edges = this.getTargetCells('edge');

		if (this.currentState == null || edges.length < 2 || this.simpleBundleBtn == null)
		{
			return;
		}

		ui.hideCurrentMenu();
		var p = this.createSimplePopover(this.simpleBundleBtn, {kind: 'edge'}, 'geSmToolbarBundle');
		var rows = this.createSimpleSection(p.body);

		var run = mxUtils.bind(this, function(action)
		{
			return mxUtils.bind(this, function()
			{
				graph.stopEditing(false);
				this.hidePopover();
				action.funct();
			});
		});

		var entries = [['bundle', InlineToolbar.glyphs.tie, 'bundleHint'],
			['drawTie', InlineToolbar.glyphs.drawTie, 'drawTieHint'],
			['unbundle', InlineToolbar.glyphs.untie, 'unbundleHint'],
			['selectTiedEdges', InlineToolbar.glyphs.tiedEdges, 'selectTiedEdgesHint']];

		for (var i = 0; i < entries.length; i++)
		{
			var action = ui.actions.get(entries[i][0]);

			if (action != null && action.isEnabled() && this.isActionVisible(entries[i][0]))
			{
				rows.appendChild(this.createSimpleRow({label: this.getSimpleLabel(mxResources.get(entries[i][0])),
					icon: entries[i][1], description: mxResources.get(entries[i][2])}, run(action)));
			}
		}

		this.installSimpleRowKeys(p.body);
		this.showSimplePopover(p);
	};

	/**
	 * More is the popover of the look (see showSimpleMoreMenu).
	 */
	InlineToolbar.prototype.showMoreMenu = function(evt)
	{
		if (this.currentState != null)
		{
			this.showSimpleMoreMenu();
		}
		else
		{
			this.editorUi.hideCurrentMenu();
		}
	};

	/**
	 * Gives the focus back to the diagram if a popover of the look closes
	 * with the focus inside (eg. Escape in a slider), so typing still edits
	 * the selected cell (see showTypingShim). A popover that is replaced by
	 * another one gives the focus to the new one (see showSimplePopover).
	 */
	var inlineToolbarHidePopover = InlineToolbar.prototype.hidePopover;

	InlineToolbar.prototype.hidePopover = function()
	{
		var popover = this.currentPopover;
		var focused = popover != null && popover.contains(document.activeElement) &&
			popover.querySelector('.geSmToolbarPanel') != null && !this.replacingSimplePopover;
		inlineToolbarHidePopover.apply(this, arguments);
		this.updateSimpleOpenButton();

		if (focused)
		{
			document.activeElement.blur();

			if (typeof this.editorUi.updateTypingShim === 'function')
			{
				this.editorUi.updateTypingShim();
			}
		}
	};

	/**
	 * Creates a popover of the inline toolbar in the frame of the look
	 * (tokens instead of the colors of InlineToolbar.js) with the given
	 * class.
	 */
	InlineToolbar.prototype.createSimplePopover = function(anchor, opts, className)
	{
		// The focus moves into a popover that replaces one with the focus
		var refocus = this.currentPopover != null && this.currentPopover.contains(document.activeElement);
		this.replacingSimplePopover = refocus;
		var p = null;

		try
		{
			p = this.createPopover(anchor, opts);
		}
		finally
		{
			this.replacingSimplePopover = false;
		}

		p.refocus = refocus;
		this.applySimplePopoverFrame(p, className);

		return p;
	};

	/**
	 * Shows the given popover at once (no entrance effect, concept 3.8) and
	 * gives the focus to its first control if it replaced a popover with the
	 * focus (eg. Back of the flow rows, keyboard).
	 */
	InlineToolbar.prototype.showSimplePopover = function(p)
	{
		p.position();
		p.popover.style.transition = 'none';
		p.popover.style.opacity = '1';
		p.popover.style.transform = 'none';

		if (p.refocus)
		{
			var control = p.body.querySelector('button:not([tabindex="-1"]), input');

			if (control != null)
			{
				control.focus({preventScroll: true});
			}
		}
	};

	/**
	 * Creates a section of a popover with the given caption and optional
	 * sign or icon.
	 */
	InlineToolbar.prototype.createSimpleSection = function(body, title, image)
	{
		var section = document.createElement('div');
		section.className = 'geSmToolbarSection';

		if (title != null)
		{
			section.appendChild(InlineToolbar.createSectionHead(title, image));
		}

		body.appendChild(section);

		return section;
	};

	/**
	 * Creates a row of a popover with a glyph, a label and an optional
	 * description below it (two lines, mockup 09) that calls the given
	 * function.
	 */
	InlineToolbar.prototype.createSimpleRow = function(entry, fn)
	{
		var row = document.createElement('button');
		row.setAttribute('type', 'button');
		row.className = 'geSmToolbarRow';

		if (entry.icon != null)
		{
			row.appendChild(InlineToolbar.createIcon(entry.icon, 'geSmToolbarRowIcon'));
		}

		var text = document.createElement('span');
		text.className = 'geSmToolbarRowText';

		var title = document.createElement('span');
		title.className = 'geSmToolbarRowTitle';
		var label = document.createElement('span');
		label.className = 'geSmToolbarRowLabel';
		mxUtils.write(label, entry.label);
		title.appendChild(label);

		text.appendChild(title);

		if (entry.description != null)
		{
			var hint = document.createElement('span');
			hint.className = 'geSmToolbarRowHint';
			mxUtils.write(hint, entry.description);
			text.appendChild(hint);
		}

		row.appendChild(text);

		if (entry.shortcut != null)
		{
			var key = document.createElement('kbd');
			key.className = 'geSmKbd';
			mxUtils.write(key, entry.shortcut);
			row.appendChild(key);
		}

		mxEvent.addListener(row, 'click', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});

		return row;
	};

	/**
	 * The arrow keys move the focus between the rows and the tiles of the
	 * given popover: Up and Down to the nearest row or tile above or below
	 * (the same column of a grid of tiles), Left and Right to the previous
	 * and next tile of a grid, Home and End to the first and the last one.
	 * Disabled ones are skipped.
	 */
	InlineToolbar.prototype.installSimpleRowKeys = function(body)
	{
		mxEvent.addListener(body, 'keydown', function(evt)
		{
			if (evt.keyCode < 35 || evt.keyCode > 40 || mxEvent.isAltDown(evt) ||
				mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt))
			{
				return;
			}

			var items = Array.prototype.filter.call(body.querySelectorAll(
				'.geSmToolbarRow, .geSmToolbarTile'), function(item)
			{
				return !item.disabled && item.offsetWidth > 0;
			});
			var current = document.activeElement;
			var index = mxUtils.indexOf(items, current);

			if (index < 0)
			{
				return;
			}

			var next = null;

			if (evt.keyCode == 36 || evt.keyCode == 35)
			{
				// Home and End
				next = items[(evt.keyCode == 36) ? 0 : items.length - 1];
			}
			else if (evt.keyCode == 37 || evt.keyCode == 39)
			{
				// Left and Right in a grid of tiles
				var sibling = items[index + ((evt.keyCode == 39) ? 1 : -1)];

				if (sibling != null && sibling.parentNode == current.parentNode &&
					current.classList.contains('geSmToolbarTile'))
				{
					next = sibling;
				}
			}
			else
			{
				// Up and Down: the nearest line above or below, then the
				// nearest center in it (the first of two as near, so a row
				// across the width goes to the left column)
				var down = evt.keyCode == 40;
				var b = current.getBoundingClientRect();
				var cx = b.left + b.width / 2;
				var line = null;
				var offset = null;

				for (var i = 0; i < items.length; i++)
				{
					var r = items[i].getBoundingClientRect();
					var dist = (down) ? r.top - b.bottom : b.top - r.bottom;
					var dx = Math.abs(r.left + r.width / 2 - cx);

					// Below or above (not beside), a nearer line or a nearer
					// center in the same line
					if (items[i] != current && dist > -2 && (line == null || dist < line - 1 ||
						(Math.abs(dist - line) <= 1 && dx < offset - 1)))
					{
						line = (line == null || dist < line - 1) ? dist : line;
						offset = dx;
						next = items[i];
					}
				}
			}

			if (next != null)
			{
				next.focus();
			}

			mxEvent.consume(evt);
		});
	};

	/**
	 * Returns the label of the last row of More, which opens the Omnibox with
	 * the settings of the selection first: More for this shape..., More for
	 * these 2 connectors... (concept 6).
	 */
	InlineToolbar.prototype.getSimpleMoreLabel = function(cells)
	{
		var model = this.graph.model;
		var vertices = 0;
		var edges = 0;

		for (var i = 0; i < cells.length; i++)
		{
			if (model.isEdge(cells[i]))
			{
				edges++;
			}
			else if (model.isVertex(cells[i]))
			{
				vertices++;
			}
		}

		if (edges == 0 && vertices > 0)
		{
			return (vertices == 1) ? mxResources.get('moreForThisShape') :
				mxResources.get('moreForTheseShapes', [vertices]);
		}
		else if (vertices == 0 && edges > 0)
		{
			return (edges == 1) ? mxResources.get('moreForThisConnector') :
				mxResources.get('moreForTheseConnectors', [edges]);
		}
		else
		{
			return mxResources.get('moreForSelection');
		}
	};

	/**
	 * Returns the suggestions of More for the given cells (a hook of Fusion,
	 * which has the rules of its Format panel), at most maxSimpleSuggestions:
	 * {label, description, icon, fn, keepOpen}.
	 */
	InlineToolbar.prototype.getSimpleSuggestions = function(cells)
	{
		return this.getSimpleTieSuggestions(cells);
	};

	/**
	 * Maximum number of suggestions in More (two, as in the context menu of
	 * Fusion).
	 */
	InlineToolbar.prototype.maxSimpleSuggestions = 2;

	/**
	 * Returns the suggestions of ties for the given cells, the rules of ties
	 * of Fusion (SimpleSuggestions.js), which More of the other themes shows
	 * as Suggested (the driver, 19 November 2026: Fusion is the reference):
	 * Bundle for two or more connectors without shapes, Select tied
	 * connectors for a tie and Unbundle for ties and connectors with ties, in
	 * this order. Fusion has all of its rules instead.
	 */
	InlineToolbar.prototype.getSimpleTieSuggestions = function(cells)
	{
		var graph = this.graph;
		var actions = this.editorUi.actions;
		var result = [];
		var edges = 0;
		var shapes = 0;
		var tie = false;

		// A locked cell (also a tie locked itself, which the toolbar shows for
		// Unlock) has no suggestions, as in Fusion
		if (graph.isCellLocked(graph.getDefaultParent()) ||
			(cells.length == 1 && graph.isCellLocked(cells[0])))
		{
			return result;
		}

		for (var i = 0; i < cells.length; i++)
		{
			if (graph.model.isEdge(cells[i]))
			{
				edges++;
			}
			else if (graph.isTie(cells[i]))
			{
				tie = true;
			}
			else if (graph.model.isVertex(cells[i]) && !this.isLabelCell(cells[i]))
			{
				shapes++;
			}
		}

		var add = mxUtils.bind(this, function(name, icon, hint)
		{
			var action = actions.get(name);

			if (action != null && action.isEnabled() && this.isActionVisible(name))
			{
				result.push({label: this.getSimpleLabel(mxResources.get(name)), icon: icon,
					description: mxResources.get(hint), fn: function()
					{
						action.funct();
					}});
			}
		});

		if (edges > 1 && shapes == 0 && !tie)
		{
			add('bundle', InlineToolbar.glyphs.tie, 'bundleHint');
		}
		else if (cells.length == 1 && tie)
		{
			add('selectTiedEdges', InlineToolbar.glyphs.tiedEdges, 'selectTiedEdgesHint');
		}

		if (graph.hasTies(cells))
		{
			add('unbundle', InlineToolbar.glyphs.untie, 'unbundleHint');
		}

		return result;
	};

	/**
	 * Returns the icon of the head of Suggested, an element or null: the
	 * sparkle (concept 3.9, the icon of Suggested in Fusion).
	 */
	InlineToolbar.prototype.getSimpleSuggestedIcon = function()
	{
		return InlineToolbar.createIcon(InlineToolbar.glyphs.sparkle, 'geSmSparkle');
	};

	/**
	 * Returns the first section of More for the given cells as {elt, title,
	 * update}, where elt is the row, title the caption of the section and
	 * update optional, or null: the Spacing of a tie (tieSpacing, as in
	 * Fusion, where the hook shows the row of its Format panel).
	 */
	InlineToolbar.prototype.createSimpleMoreHead = function(cells)
	{
		var graph = this.graph;

		if (cells.length == 1 && graph.isTie(cells[0]) && !this.isUnlockable(cells[0]))
		{
			var toolbar = this;
			var tie = cells[0];

			var getSpacing = function()
			{
				var value = parseFloat(mxUtils.getValue(graph.getCurrentCellStyle(tie), 'tieSpacing',
					graph.defaultTieSpacing));

				return (isFinite(value)) ? value : graph.defaultTieSpacing;
			};

			var slider = InlineToolbar.createValueSlider(graph, mxResources.get('spacing'), 0,
				graph.getTieSpacingSliderMax(getSpacing()), 1, getSpacing, function(value)
			{
				toolbar.setCellStyles(['tieSpacing'], [value], [tie]);
			}, function(value)
			{
				return Math.round(value) + ' pt';
			});

			var row = InlineToolbar.createControlRow(mxResources.get('spacing'), slider);

			// The caption goes next to the row, as its title attribute
			// would show as a tooltip over the row
			return {elt: row, title: mxResources.get('tie'), update: slider.update};
		}

		return null;
	};

	/**
	 * Returns the last row of More, the search of the actions with the
	 * settings of the selection first, as {fn, shortcut}, or null if the
	 * search is not available (a hook of Fusion, which opens its Omnibox).
	 */
	InlineToolbar.prototype.getSimpleSearch = function()
	{
		var search = this.editorUi.actions.get('searchActions');

		return (search != null && search.isEnabled() && search.visible) ?
			{fn: function() { search.funct(); }, shortcut: null} : null;
	};

	/**
	 * Returns true if More shows the options of the selection that have no
	 * other place in the toolbar (see getCellOptions) as icons in the section
	 * Options, as they did before 17 November 2026. Fusion shows them through
	 * Suggested and its Omnibox instead (a hook).
	 */
	InlineToolbar.prototype.isSimpleOptionsShown = function()
	{
		return true;
	};

	/**
	 * Shows More (concept 6, mockup 09): Unlock for a locked cell, Suggested
	 * (see getSimpleSuggestions), the effects as labelled chips, the options
	 * of the selection (see isSimpleOptionsShown), Order and Actions and the
	 * search with the settings of the selection first (see getSimpleSearch).
	 */
	InlineToolbar.prototype.showSimpleMoreMenu = function()
	{
		this.editorUi.hideCurrentMenu();

		var ui = this.editorUi;
		var graph = this.graph;
		var cells = this.currentCells;
		var suggestions = [];

		if (!graph.isEditing() && graph.isEnabled())
		{
			try
			{
				suggestions = this.getSimpleSuggestions(cells).slice(0, this.maxSimpleSuggestions);
			}
			catch (e)
			{
				// A failing rule does not break the popover
				if (window.console != null)
				{
					console.error(e);
				}
			}
		}

		var options = this.getOptions();
		var p = this.createSimplePopover(this.moreBtn, {kind: null}, 'geSmToolbarMore');
		var body = p.body;

		var run = mxUtils.bind(this, function(fn, keepOpen)
		{
			return mxUtils.bind(this, function()
			{
				graph.stopEditing(false);

				if (!keepOpen)
				{
					this.hidePopover();
				}

				try
				{
					fn();
				}
				catch (e)
				{
					ui.handleError(e);
				}
			});
		});

		// A tie: the Spacing of the Format panel first (Fusion)
		var head = this.createSimpleMoreHead(cells);

		if (head != null)
		{
			this.createSimpleSection(body, head.title).appendChild(head.elt);

			if (head.update != null)
			{
				this.addPopoverUpdate(head.update);
			}
		}

		// A locked cell: Unlock only (concept 9)
		for (var i = 0; i < options.length; i++)
		{
			if (options[i].action == 'lockUnlock' && cells.length == 1 && this.isUnlockable(cells[0]))
			{
				this.createSimpleSection(body).appendChild(this.createSimpleRow({label: options[i].label,
					icon: InlineToolbar.glyphs.unlock}, run(options[i].fn, options[i].keepOpen)));
			}
		}

		if (suggestions.length > 0)
		{
			var section = this.createSimpleSection(body, mxResources.get('suggested'),
				this.getSimpleSuggestedIcon());
			section.classList.add('geSmToolbarSuggested');

			for (var i = 0; i < suggestions.length; i++)
			{
				section.appendChild(this.createSimpleRow(suggestions[i],
					run(suggestions[i].fn, suggestions[i].keepOpen)));
			}
		}

		// The effects as labelled tiles in their order (concept 6)
		var effects = null;

		for (var i = 0; i < InlineToolbar.simpleEffects.length; i++)
		{
			for (var j = 0; j < options.length; j++)
			{
				if (options[j].group == 'effects' && options[j].styleKey == InlineToolbar.simpleEffects[i][0])
				{
					if (effects == null)
					{
						effects = this.createSimpleTiles(mxResources.get('effects'));
						effects.classList.add('geSmToolbarEffects');
					}

					// In sentence case as in the panel (Flow animation)
					effects.appendChild(this.createSimpleEffect(options[j], this.getSimpleLabel(
						mxResources.get(InlineToolbar.simpleEffects[i][1])), run(options[j].fn, options[j].keepOpen)));
				}
			}
		}

		if (effects != null)
		{
			var section = this.createSimpleSection(body, mxResources.get('effects'));
			section.appendChild(effects);

			// The flow rows under the effects of animated connectors (Fusion)
			if (this.findSimpleEffect(options, 'flowAnimation') != null)
			{
				this.addSimpleFlowRows(section);
			}
		}

		// The options of the selection that have no other place
		var tiles = (this.isSimpleOptionsShown()) ? this.createSimpleOptionTiles(options, run) : null;

		if (tiles != null)
		{
			this.createSimpleSection(body, mxResources.get('options')).appendChild(tiles);
		}

		// The search (the Omnibox in Fusion) with its key
		var search = this.getSimpleSearch();

		if (search != null)
		{
			var footer = this.createSimpleSection(body);
			footer.classList.add('geSmToolbarSearch');
			footer.appendChild(this.createSimpleRow({label: this.getSimpleMoreLabel(cells),
				icon: InlineToolbar.glyphs.search, shortcut: search.shortcut}, run(search.fn)));
		}

		this.installSimpleRowKeys(body);
		this.showSimplePopover(p);
	};

	/**
	 * Returns the effect of the given options with the given style key or null.
	 */
	InlineToolbar.prototype.findSimpleEffect = function(options, key)
	{
		for (var i = 0; i < options.length; i++)
		{
			if (options[i].group == 'effects' && options[i].styleKey == key)
			{
				return options[i];
			}
		}

		return null;
	};

	/**
	 * Adds the fine-tuning rows of the flow animation of the selected
	 * connectors to the given section of More, under their effects, and
	 * returns them or null (a hook of Fusion, which has the flow rows of its
	 * Format panel, see SimpleSuggestions.js).
	 */
	InlineToolbar.prototype.addSimpleFlowRows = function(section)
	{
		return null;
	};

	/**
	 * Creates a labelled tile of More (the driver, 17 November 2026: "kleine
	 * Kacheln, die beschriftet sind wie bei der Effects-Section"): a button
	 * with the given glyph (a data URI, see createSvgIcon, or null) before
	 * the given label that calls fn, the label and the key in the tooltip.
	 */
	InlineToolbar.prototype.createSimpleTile = function(image, label, fn, shortcut, className)
	{
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = 'geSmToolbarTile' + ((className != null) ? ' ' + className : '');
		btn.setAttribute('title', label + ((shortcut != null) ? ' (' + shortcut + ')' : ''));

		if (image != null)
		{
			btn.appendChild(InlineToolbar.createIcon(image));
		}

		var text = document.createElement('span');
		text.className = 'geSmToolbarTileLabel';
		mxUtils.write(text, label);
		btn.appendChild(text);

		mxEvent.addListener(btn, 'click', function(evt)
		{
			if (!btn.disabled)
			{
				fn(evt);
			}

			mxEvent.consume(evt);
		});

		return btn;
	};

	/**
	 * Creates the grid of the tiles of a section of More, a group with the
	 * given name: two columns of the same width (geSmToolbarTiles).
	 */
	InlineToolbar.prototype.createSimpleTiles = function(name)
	{
		var tiles = document.createElement('div');
		tiles.className = 'geSmToolbarTiles';
		tiles.setAttribute('role', 'group');

		if (name != null)
		{
			tiles.setAttribute('aria-label', name);
		}

		return tiles;
	};

	/**
	 * Lets each tile of the groups of tiles in the given element whose name
	 * does not fit two lines of its column take both columns
	 * (geSmToolbarTileWide), as a single tile of a row does, so no name is
	 * cut and no word is broken (the German Automatische
	 * Beschriftungsposition of the effects of connectors; the driver, 18
	 * November 2026: "Long labels" of fusion-style-guide.md). The name of a
	 * tile that can be on (aria-pressed) is measured in the weight of an on
	 * tile, and the tile keeps the height that it has in that weight, so
	 * turning it on or off changes no height. A tile that would be alone in
	 * its row before a wide one and the last tile alone take both columns
	 * too; the groups (geSmToolbarTilesFitted) then no longer use the rule
	 * of the last tile in the CSS.
	 */
	InlineToolbar.prototype.fitSimpleTiles = function(elt)
	{
		var groups = elt.querySelectorAll('.geSmToolbarTiles');

		for (var i = 0; i < groups.length; i++)
		{
			var tiles = Array.prototype.filter.call(groups[i].children, function(child)
			{
				return child.classList.contains('geSmToolbarTile');
			});

			// Measures every name in its column, toggles in the weight of an
			// on tile, with words that do not break, before any change (1 for
			// the rounding of the sizes)
			var labels = [];
			var states = [];
			var toggles = [];
			groups[i].classList.add('geSmToolbarTilesFitted');

			for (var j = 0; j < tiles.length; j++)
			{
				labels.push(tiles[j].querySelector('.geSmToolbarTileLabel'));
				states.push(tiles[j].classList.contains('geSmOn'));
				toggles.push(tiles[j].hasAttribute('aria-pressed'));
				tiles[j].style.minHeight = '';
				tiles[j].classList.remove('geSmToolbarTileWide');
				tiles[j].classList.add('geSmToolbarTileMeasure');

				if (toggles[j])
				{
					tiles[j].classList.add('geSmOn');
				}
			}

			var wide = [];

			for (var j = 0; j < tiles.length; j++)
			{
				var label = labels[j];
				wide.push(label != null && label.clientWidth > 0 &&
					(label.scrollWidth > label.clientWidth + 1 ||
					label.scrollHeight > label.clientHeight + 1));
			}

			// No row with a single tile and an empty column
			var col = 0;

			for (var j = 0; j < tiles.length; j++)
			{
				if (wide[j])
				{
					if (col == 1)
					{
						wide[j - 1] = true;
					}

					col = 0;
				}
				else
				{
					col = (col + 1) % 2;
				}
			}

			if (col == 1)
			{
				wide[tiles.length - 1] = true;
			}

			for (var j = 0; j < tiles.length; j++)
			{
				tiles[j].classList.remove('geSmToolbarTileMeasure');
				tiles[j].classList.toggle('geSmToolbarTileWide', wide[j]);
			}

			// A toggle keeps the height of its name in the weight of an on
			// tile with its padding and border (its name stays in the middle)
			var heights = [];

			for (var j = 0; j < tiles.length; j++)
			{
				var height = 0;

				if (toggles[j] && labels[j] != null)
				{
					var cs = window.getComputedStyle(tiles[j]);
					height = Math.max(parseFloat(cs.minHeight) || 0, Math.ceil(
						labels[j].getBoundingClientRect().height +
						(parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0) +
						(parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0)));
				}

				heights.push(height);
			}

			for (var j = 0; j < tiles.length; j++)
			{
				tiles[j].classList.toggle('geSmOn', states[j]);

				if (heights[j] > 0)
				{
					tiles[j].style.minHeight = heights[j] + 'px';
				}
			}
		}
	};

	/**
	 * Toggles the given tile on (accent-soft and aria-pressed) if
	 * option.isSelected returns true for the style of the cells, now and
	 * after changes of the model.
	 */
	InlineToolbar.prototype.updateSimpleTile = function(btn, option)
	{
		if (option.isSelected != null)
		{
			var update = function(style)
			{
				var selected = option.isSelected(style);
				btn.classList.toggle('geSmOn', selected);
				btn.setAttribute('aria-pressed', (selected) ? 'true' : 'false');
			};

			update(this.getCurrentStyle());
			this.addPopoverUpdate(update);
		}
	};

	/**
	 * Creates the tile of an effect of More: the glyph of the effect with the
	 * given label, on (--sm-accent-soft) if the effect is on for the style of
	 * the cells, disabled where the Format panel disables it (Orthogonal ends
	 * of connectors with fixed ends), with the reason of the panel (the
	 * resource key in option.disabledReason, see addSimpleCellOption of
	 * Fusion) in its tooltip and description. Unlike the controls of the
	 * panel (addFormatDisabledReason) it does not depend on the helper
	 * disabledReasons, which is off in Fusion, as only Fusion gives reasons.
	 */
	InlineToolbar.prototype.createSimpleEffect = function(option, label, fn)
	{
		var btn = this.createSimpleTile((Object.prototype.hasOwnProperty.call(InlineToolbar.effectGlyphs,
			option.styleKey)) ? InlineToolbar.effectGlyphs[option.styleKey] : null, label, fn,
			null, 'geSmToolbarEffect');
		btn.disabled = option.disabled == true;
		btn.smStyleKey = option.styleKey;

		if (btn.disabled && option.disabledReason != null)
		{
			this.editorUi.setDisabledReason(btn, {kind: option.disabledReason,
				text: mxResources.get(option.disabledReason)},
				btn.getAttribute('title'), true);
		}

		this.updateSimpleTile(btn, option);

		return btn;
	};

	/**
	 * Returns the tiles of the given options of More that have no other place
	 * in the toolbar (not the effects, Unlock, Clear waypoints, which is in
	 * Connection, or the actions of Arrange, Edit and Delete) or null: the
	 * image of the option as the glyph and its name, on in the accent if it
	 * is a toggle that is on.
	 */
	InlineToolbar.prototype.createSimpleOptionTiles = function(options, run)
	{
		var others = ['lockUnlock', 'clearWaypoints'].concat(this.orderActions, this.moreActions);
		var tiles = null;

		for (var i = 0; i < options.length; i++)
		{
			var option = options[i];

			if (option.group != 'effects' && option.image != null &&
				mxUtils.indexOf(others, option.action) < 0)
			{
				if (tiles == null)
				{
					tiles = this.createSimpleTiles(mxResources.get('options'));
				}

				var btn = this.createSimpleTile(option.image.src || option.image,
					this.getSimpleLabel(InlineToolbar.getSimpleTileLabel(option.label || option.title)),
					run(option.fn, option.keepOpen), option.shortcut);
				this.updateSimpleTile(btn, option);
				tiles.appendChild(btn);
			}
		}

		return tiles;
	};

	/**
	 * Returns the given label without the dots of a dialog (Edit Link...), the
	 * short text of a tile.
	 */
	InlineToolbar.getSimpleTileLabel = function(label)
	{
		return (label != null) ? String(label).replace(/(\.\.\.|\u2026)$/, '') : '';
	};

	/**
	 * Removes the given inline styles of the given element (the frame of the
	 * previous look), so the classes of the new look apply.
	 */
	var clearStyles = function(elt, names)
	{
		for (var i = 0; i < names.length; i++)
		{
			elt.style[names[i]] = '';
		}
	};

	/**
	 * Returns the children of the given element as an array.
	 */
	var getChildren = function(elt)
	{
		return Array.prototype.slice.call(elt.childNodes);
	};

	/**
	 * Returns true if the given element has a border in the accent of the
	 * previous look, which marks the active item of its grids.
	 */
	var hasActiveBorder = function(elt)
	{
		var border = elt.style.border;

		return border != null && border != '' && border.indexOf('transparent') < 0;
	};

	/**
	 * Makes the given element a button for the keyboard and screen readers
	 * (Enter and Space click it, see installSimpleInlineKeys), named after its
	 * title.
	 */
	InlineToolbar.prototype.setSimpleButtonRole = function(elt, label)
	{
		elt.setAttribute('role', 'button');
		elt.setAttribute('tabindex', '0');

		if (label != null)
		{
			elt.setAttribute('aria-label', label);
		}
	};

	/**
	 * Enter and Space click the focused item of the given popover or list
	 * that is not a button of its own.
	 */
	InlineToolbar.prototype.installSimpleInlineKeys = function(elt)
	{
		mxEvent.addListener(elt, 'keydown', function(evt)
		{
			var source = mxEvent.getSource(evt);

			if ((evt.keyCode == 13 || evt.keyCode == 32) && source != null &&
				source.nodeName != 'BUTTON' && source.nodeName != 'INPUT' &&
				source.getAttribute('role') != null && source.getAttribute('tabindex') != null)
			{
				source.click();
				mxEvent.consume(evt);
			}
		});
	};

	/**
	 * The button of a select: the frame of a secondary button, the value and
	 * the chevron of the look.
	 */
	var inlineToolbarCreateDropdownButton = InlineToolbar.prototype.createDropdownButton;

	InlineToolbar.prototype.createDropdownButton = function(title)
	{
		var dropdown = inlineToolbarCreateDropdownButton.apply(this, arguments);

		this.decorateSimpleSelect(dropdown, title);

		return dropdown;
	};

	/**
	 * Gives the given select of a popover (a value and a chevron) the look of
	 * Fusion.
	 */
	InlineToolbar.prototype.decorateSimpleSelect = function(dropdown, title)
	{
		dropdown.classList.add('geSmInlineSelect');
		clearStyles(dropdown, ['border', 'borderRadius', 'height', 'padding', 'gap', 'backgroundColor']);
		var chevron = dropdown.lastChild;

		if (chevron != null && chevron != dropdown.firstChild && chevron.nodeName == 'SPAN')
		{
			dropdown.replaceChild(InlineToolbar.createIcon(InlineToolbar.glyphs.chevronDown,
				'geSmInlineChevron'), chevron);
		}

		this.setSimpleButtonRole(dropdown, title);
		dropdown.setAttribute('aria-haspopup', 'true');
	};

	/**
	 * The buttons with text (Group, Merge, Use connector style) are secondary
	 * buttons.
	 */
	var inlineToolbarCreateTextButton = InlineToolbar.prototype.createTextButton;

	InlineToolbar.prototype.createTextButton = function(label, title)
	{
		var btn = inlineToolbarCreateTextButton.apply(this, arguments);

		btn.classList.remove('geSmInlineSelect');
		btn.classList.add('geSmInlineButton');
		btn.removeAttribute('aria-haspopup');
		btn.setAttribute('aria-label', label);

		return btn;
	};

	/**
	 * Labels of the rows in the text of the look.
	 */
	var inlineToolbarCreateLabel = InlineToolbar.prototype.createLabel;

	InlineToolbar.prototype.createLabel = function()
	{
		var label = inlineToolbarCreateLabel.apply(this, arguments);

		label.classList.add('geSmInlineLabel');
		clearStyles(label, ['fontSize', 'color']);

		return label;
	};

	/**
	 * A label with its swatch.
	 */
	var inlineToolbarCreateColorGroup = InlineToolbar.prototype.createColorGroup;

	InlineToolbar.prototype.createColorGroup = function()
	{
		var group = inlineToolbarCreateColorGroup.apply(this, arguments);

		group.classList.add('geSmInlineGroup');
		clearStyles(group, ['gap']);

		return group;
	};

	/**
	 * Swatches of colors: 24 with radius 6 and the edge of the swatches of the
	 * Format panel in a target of 32 (40 on touch); no color is the diagonal
	 * of the look (geSmNoColor).
	 */
	var inlineToolbarCreateColorSwatch = InlineToolbar.prototype.createColorSwatch;

	InlineToolbar.prototype.createColorSwatch = function(title)
	{
		var swatch = inlineToolbarCreateColorSwatch.apply(this, arguments);

		swatch.classList.add('geSmInlineSwatch');
		clearStyles(swatch, ['width', 'height', 'borderRadius', 'border']);

		// The title of the swatch (Border color for images)
		this.setSimpleButtonRole(swatch, swatch.getAttribute('title') || title);

		// The previous look paints no color as a red diagonal
		var update = function()
		{
			swatch.classList.toggle('geSmNoColor',
				swatch.style.backgroundImage.indexOf('45%') >= 0);
		};

		update();
		this.addPopoverUpdate(update);

		return swatch;
	};

	/**
	 * Number fields: the field of the look with the chevrons of the steppers.
	 */
	var inlineToolbarCreateNumberInput = InlineToolbar.prototype.createNumberInput;

	InlineToolbar.prototype.createNumberInput = function(title)
	{
		var field = inlineToolbarCreateNumberInput.apply(this, arguments);

		field.classList.add('geSmInlineField');
		clearStyles(field, ['border', 'borderRadius', 'height']);
		var input = field.firstChild;

		if (input != null && input.nodeName == 'INPUT')
		{
			clearStyles(input, ['width', 'fontSize', 'padding']);
			input.setAttribute('aria-label', title);
		}

		// The field steps with the arrow keys (see createNumberInput)
		var stepper = field.lastChild;

		if (stepper != null && stepper != input)
		{
			stepper.className = 'geSmInlineStepper';
			stepper.setAttribute('aria-hidden', 'true');
			clearStyles(stepper, ['borderLeft']);
			var buttons = getChildren(stepper);

			for (var i = 0; i < buttons.length; i++)
			{
				buttons[i].innerHTML = '';
				clearStyles(buttons[i], ['fontSize', 'lineHeight', 'width']);
				buttons[i].appendChild(InlineToolbar.createIcon((i == 0) ?
					InlineToolbar.glyphs.chevronUp : InlineToolbar.glyphs.chevronDown));
			}
		}

		return field;
	};

	/**
	 * Toggles (bold, alignment, the actions of Arrange and Table): icon
	 * buttons of the look with the glyph as a mask, on in the accent.
	 */
	var inlineToolbarCreateToggleButton = InlineToolbar.prototype.createToggleButton;

	InlineToolbar.prototype.createToggleButton = function(title, image, isSelected, fn)
	{
		var btn = null;
		var selected = false;

		var update = function()
		{
			if (btn != null)
			{
				btn.classList.toggle('geSmOn', selected);
				if (!btn._smAction)
				{
					btn.setAttribute('aria-pressed', (selected) ? 'true' : 'false');
				}
			}
		};

		btn = inlineToolbarCreateToggleButton.call(this, title, image, function(style)
		{
			selected = isSelected(style);
			update();

			return selected;
		}, fn);

		btn.classList.add('geSmInlineToggle');
		clearStyles(btn, ['width', 'height', 'borderRadius', 'backgroundColor']);

		if (btn.firstChild != null && btn.firstChild.nodeName == 'IMG')
		{
			btn.replaceChild(InlineToolbar.createIcon(image), btn.firstChild);
		}

		this.setSimpleButtonRole(btn, title);
		update();

		return btn;
	};

	/**
	 * Grids of icons (routing, the shapes of connectors, corners): items of
	 * the size of icon buttons, the glyphs as masks, the active item in the
	 * accent.
	 */
	var inlineToolbarBuildIconGrid = InlineToolbar.prototype.buildIconGrid;

	InlineToolbar.prototype.buildIconGrid = function(body, items, activeIndex)
	{
		var grid = inlineToolbarBuildIconGrid.apply(this, arguments);

		grid.smItems = items;
		this.decorateSimpleGrid(grid, activeIndex);

		return grid;
	};

	/**
	 * The columns of the grids of icons of a popover: six, which is the width
	 * of the popovers of the buttons with gaps of 8 and the insets of 8 (6 ×
	 * 36 + 5 × 8 + 16 = 272, 320 with the targets of 44 on touch).
	 */
	InlineToolbar.prototype.simpleGridColumns = 6;

	/**
	 * Returns the numbers of the items of the given grid between its
	 * separators (the runs that fill rows of their own).
	 */
	var getGridRuns = function(grid)
	{
		var runs = [];
		var count = 0;
		var children = getChildren(grid);

		for (var i = 0; i < children.length; i++)
		{
			if (children[i].nodeType == 1)
			{
				if (children[i].classList.contains('geSmInlineSep'))
				{
					runs.push(count);
					count = 0;
				}
				else
				{
					count++;
				}
			}
		}

		runs.push(count);

		return runs;
	};

	/**
	 * Returns the number of columns of the grids of icons of a popover with
	 * the given numbers of items and targets of the given size: the columns
	 * of simpleGridColumns, fewer where the diagram is narrower than the
	 * popover with gaps of 8 or, for a popover of the given width, where they
	 * do not fit with gaps of 4, and one less if a grid would leave a single
	 * icon in its last row and one less does not (the driver, 12 November
	 * 2026: no lonely last icon where a better column count fits).
	 */
	InlineToolbar.prototype.getSimpleGridColumns = function(counts, size, width)
	{
		// The insets of the popover are 8, it is 4 inside the diagram
		var gap = (width != null) ? 4 : 8;
		var inner = ((width != null) ? width : this.graph.container.clientWidth - 8) - 16;
		var cols = Math.max(1, Math.min(this.simpleGridColumns,
			Math.floor((inner + gap) / (size + gap))));

		var isLonely = function(c)
		{
			for (var i = 0; i < counts.length; i++)
			{
				if (counts[i] > c && counts[i] % c == 1)
				{
					return true;
				}
			}

			return false;
		};

		if (cols > 2 && isLonely(cols) && !isLonely(cols - 1))
		{
			cols--;
		}

		return cols;
	};

	/**
	 * Gives the grids of icons in the given popover or list one number of
	 * columns (--sm-grid-cols, see getSimpleGridColumns), so the columns of
	 * all its sections line up and fill its width (geSmInlineGrid). The
	 * optional width is the width of a list that has the width of its
	 * popover.
	 */
	InlineToolbar.prototype.layoutSimpleGrids = function(elt, width)
	{
		var grids = elt.querySelectorAll('.geSmInlineGrid');

		if (grids.length > 0)
		{
			var counts = [];

			for (var i = 0; i < grids.length; i++)
			{
				counts = counts.concat(getGridRuns(grids[i]));
			}

			var size = parseFloat(mxUtils.getCurrentStyle(elt).getPropertyValue('--sm-hit'));
			var cols = this.getSimpleGridColumns(counts, (isNaN(size) || size <= 0) ? 36 : size, width);
			elt.style.setProperty('--sm-grid-cols', String(cols));
			elt.smGridColumns = cols;
		}
	};

	/**
	 * Gives the given grid of icons the look of Fusion. The item at the given
	 * index (not counting the separators) is active, or the item with the
	 * border of the previous look if the index is null. The columns are those
	 * of its popover (layoutSimpleGrids).
	 */
	InlineToolbar.prototype.decorateSimpleGrid = function(grid, activeIndex)
	{
		grid.classList.add('geSmInlineGrid');
		grid.style.gridTemplateColumns = 'repeat(var(--sm-grid-cols, ' +
			this.simpleGridColumns + '), var(--sm-hit))';
		clearStyles(grid, ['gap']);
		var children = getChildren(grid);
		var index = 0;

		for (var i = 0; i < children.length; i++)
		{
			var item = children[i];
			var img = item.firstChild;

			if (img == null)
			{
				item.className = 'geSmInlineSep';
				clearStyles(item, ['backgroundColor']);
			}
			else
			{
				var active = (activeIndex != null) ? index == activeIndex : hasActiveBorder(item);
				item.classList.add('geSmInlineItem');
				item.classList.toggle('geSmOn', active);
				clearStyles(item, ['width', 'height', 'borderRadius', 'backgroundColor', 'border']);
				this.setSimpleButtonRole(item, item.getAttribute('title'));
				item.setAttribute('aria-pressed', (active) ? 'true' : 'false');

				if (img.nodeName == 'IMG')
				{
					var icon = InlineToolbar.createIcon(img.getAttribute('src'));

					// The markers of the end point the other way
					icon.style.transform = img.style.transform;
					item.replaceChild(icon, img);
				}

				index++;
			}
		}
	};

	/**
	 * The list below a select has the frame and the rows of menus.
	 */
	var inlineToolbarCreateDropdown = InlineToolbar.prototype.createDropdown;

	InlineToolbar.prototype.createDropdown = function()
	{
		var dropdown = inlineToolbarCreateDropdown.apply(this, arguments);

		// Runs after the click of the select, which shows the list
		mxEvent.addListener(dropdown, 'click', mxUtils.bind(this, function()
		{
			var panel = this.currentSubPanel;

			if (panel != null && panel._ownerDropdown === dropdown && !panel.smDecorated)
			{
				this.decorateSimpleList(panel, dropdown);
			}

			dropdown.setAttribute('aria-expanded', (panel != null &&
				panel._ownerDropdown === dropdown) ? 'true' : 'false');
		}));

		return dropdown;
	};

	/**
	 * Gives the given list of a select the frame and the rows of menus: the
	 * chosen row has the checkmark of menus. Arrow Up and Down move between
	 * the rows, Escape closes the list and gives the focus to its select.
	 */
	InlineToolbar.prototype.decorateSimpleList = function(panel, dropdown)
	{
		panel.smDecorated = true;
		panel.classList.add('geSmInlineList');
		clearStyles(panel, ['backgroundColor', 'border', 'borderRadius', 'boxShadow', 'padding']);
		panel.setAttribute('role', 'listbox');

		if (dropdown.getAttribute('aria-label') != null)
		{
			panel.setAttribute('aria-label', dropdown.getAttribute('aria-label'));
		}

		var rows = getChildren(panel);
		var active = null;

		for (var i = 0; i < rows.length; i++)
		{
			var on = rows[i].style.backgroundColor != '';
			rows[i].classList.add('geSmInlineListItem');
			rows[i].classList.toggle('geSmOn', on);
			clearStyles(rows[i], ['padding', 'borderRadius', 'backgroundColor']);
			rows[i].setAttribute('role', 'option');
			rows[i].setAttribute('tabindex', '-1');
			rows[i].setAttribute('aria-selected', (on) ? 'true' : 'false');

			if (on)
			{
				active = rows[i];
			}
		}

		this.installSimpleSubPanelKeys(panel, dropdown, '.geSmInlineListItem');
		this.placeSimpleSubPanel(panel, dropdown);

		// Opened with the keyboard, the chosen row has the focus
		if (document.activeElement == dropdown)
		{
			var row = (active != null) ? active : rows[0];

			if (row != null)
			{
				row.focus();
			}
		}
	};

	/**
	 * The grid of the markers below the line ends has the frame of menus.
	 */
	var inlineToolbarShowMarkerSubPanel = InlineToolbar.prototype.showMarkerSubPanel;

	InlineToolbar.prototype.showMarkerSubPanel = function(dropdown)
	{
		inlineToolbarShowMarkerSubPanel.apply(this, arguments);
		var panel = this.currentSubPanel;

		if (panel != null && panel._ownerDropdown === dropdown)
		{
			panel.classList.add('geSmInlineList', 'geSmInlineGridList');
			clearStyles(panel, ['backgroundColor', 'border', 'borderRadius', 'boxShadow', 'padding']);
			panel.setAttribute('role', 'group');
			dropdown.setAttribute('aria-expanded', 'true');

			// Closed without hideSubPanel (a pick or a second click): reset when removed
			if (window.MutationObserver != null && panel.parentNode != null)
			{
				var observer = new MutationObserver(function()
				{
					if (panel.parentNode == null)
					{
						observer.disconnect();
						dropdown.setAttribute('aria-expanded', 'false');
					}
				});
				observer.observe(panel.parentNode, {childList: true});
			}

			if (dropdown.getAttribute('aria-label') != null)
			{
				panel.setAttribute('aria-label', dropdown.getAttribute('aria-label'));
			}

			if (panel.firstChild != null)
			{
				this.decorateSimpleGrid(panel.firstChild, null);
			}

			// The grid as wide as the popover, below the select at the left
			// edge of the popover (the grid of End would leave it)
			var body = (this.currentPopover != null) ?
				this.currentPopover.querySelector('.geSmToolbarPanel') : null;

			if (body != null && body.offsetWidth > 0)
			{
				panel.style.width = body.offsetWidth + 'px';
			}

			this.layoutSimpleGrids(panel, (body != null && body.offsetWidth > 0) ?
				body.offsetWidth : null);
			this.installSimpleSubPanelKeys(panel, dropdown, '.geSmInlineItem');
			this.placeSimpleSubPanel(panel, dropdown, body);
			var active = panel.querySelector('.geSmInlineItem.geSmOn') ||
				panel.querySelector('.geSmInlineItem');

			if (document.activeElement == dropdown && active != null)
			{
				active.focus();
			}
		}
	};

	/**
	 * The select of a list that is hidden is no longer expanded.
	 */
	var inlineToolbarHideSubPanel = InlineToolbar.prototype.hideSubPanel;

	InlineToolbar.prototype.hideSubPanel = function()
	{
		var panel = this.currentSubPanel;
		inlineToolbarHideSubPanel.apply(this, arguments);

		if (panel != null && panel._ownerDropdown != null &&
			panel._ownerDropdown.hasAttribute('aria-expanded'))
		{
			panel._ownerDropdown.setAttribute('aria-expanded', 'false');
		}
	};

	/**
	 * Keys of the given list or grid below a select: they stay in it (the
	 * diagram would move or edit the selected cells), Enter and Space choose,
	 * Arrow Up and Down (and Left and Right in grids) move between the items
	 * that match the given selector and Escape closes it and gives the focus
	 * back to the select.
	 */
	InlineToolbar.prototype.installSimpleSubPanelKeys = function(panel, dropdown, selector)
	{
		mxEvent.addListener(panel, 'keydown', mxUtils.bind(this, function(evt)
		{
			var source = mxEvent.getSource(evt);

			if ((evt.keyCode == 13 || evt.keyCode == 32) && source != null &&
				source.getAttribute('tabindex') != null)
			{
				source.click();

				// The choice closes the list
				if (panel.parentNode == null)
				{
					dropdown.setAttribute('aria-expanded', 'false');
					dropdown.focus();
				}

				mxEvent.consume(evt);
			}
			else if (evt.keyCode == 27)
			{
				this.hideSubPanel();
				dropdown.setAttribute('aria-expanded', 'false');
				dropdown.focus();
				mxEvent.consume(evt);
			}
			else if (evt.keyCode >= 37 && evt.keyCode <= 40)
			{
				var items = panel.querySelectorAll(selector);
				var index = mxUtils.indexOf(items, document.activeElement);
				var delta = (evt.keyCode == 38 || evt.keyCode == 37) ? -1 : 1;

				if (selector == '.geSmInlineItem' && (evt.keyCode == 38 || evt.keyCode == 40))
				{
					delta *= panel.smGridColumns || this.popoverColumns;
				}

				var next = items[Math.max(0, Math.min(items.length - 1, index + delta))];

				if (next != null)
				{
					next.focus();
				}

				mxEvent.consume(evt);
			}

			evt.stopPropagation();
		}));
	};

	/**
	 * Places the given list below its select after its size changed, as
	 * createDropdown and showMarkerSubPanel do: at the left edge of the
	 * select or of the given element.
	 */
	InlineToolbar.prototype.placeSimpleSubPanel = function(panel, dropdown, alignElt)
	{
		var container = this.graph.container;
		this.limitPanelHeight(panel);
		var ddRect = dropdown.getBoundingClientRect();
		var left = (alignElt != null) ? alignElt.getBoundingClientRect().left : ddRect.left;
		var containerRect = container.getBoundingClientRect();
		var clamped = this.clampToContainer(
			left - containerRect.left + container.scrollLeft,
			ddRect.bottom - containerRect.top + container.scrollTop + 4,
			panel.offsetWidth, panel.offsetHeight);

		panel.style.left = Math.round(clamped.x) + 'px';
		panel.style.top = Math.round(clamped.y) + 'px';
	};

	/**
	 * The popovers of the previous look get their sections when they are
	 * placed the first time, after their controls were added. They are shown
	 * at once: the look fades and scales them in (geSmPopIn, Motion).
	 */
	var inlineToolbarCreatePopover = InlineToolbar.prototype.createPopover;

	InlineToolbar.prototype.createPopover = function(anchor, opts)
	{
		var p = inlineToolbarCreatePopover.apply(this, arguments);

		if (p != null)
		{
			var position = p.position;
			var animateIn = p.animateIn;
			var kind = (opts != null) ? opts.kind : null;
			var decorated = false;

			p.position = mxUtils.bind(this, function()
			{
				if (!decorated && p.body.classList.contains('geSmInlinePanel'))
				{
					decorated = true;

					try
					{
						this.decorateSimplePopover(p, anchor, kind);
					}
					catch (e)
					{
						// The popover keeps its controls without sections
						if (window.console != null)
						{
							console.error(e);
						}
					}
				}

				return position.apply(this, arguments);
			});

			p.animateIn = function()
			{
				if (p.body.classList.contains('geSmToolbarPanel'))
				{
					p.popover.style.transition = 'none';
					p.popover.style.opacity = '1';
					p.popover.style.transform = 'none';
				}
				else
				{
					animateIn.apply(this, arguments);
				}
			};
		}

		return p;
	};

	/**
	 * A part of a popover that scrolls (the shapes of a palette, or the body
	 * if the popover is higher than the diagram) with a scrollbar that takes
	 * up room (Windows, Linux, macOS with a mouse) keeps that room as a
	 * stable gutter, so that the popover widens by the scrollbar and its grid
	 * keeps its columns in every browser (Chrome counts the scrollbar of
	 * overflow auto in the width of the popover, Firefox only that of a
	 * gutter; the padding of the frame is 3 with !important, so the room that
	 * the previous look makes in the padding of the body is not made here).
	 */
	var inlineToolbarUpdatePopoverScrollbars = InlineToolbar.prototype.updatePopoverScrollbars;

	InlineToolbar.prototype.updatePopoverScrollbars = function(body, scrolls)
	{
		inlineToolbarUpdatePopoverScrollbars.apply(this, arguments);

		var elts = [body];

		for (var i = 0; i < scrolls.length; i++)
		{
			elts.push(scrolls[i].elt);
		}

		for (var i = 0; i < elts.length; i++)
		{
			var elt = elts[i];
			var cs = mxUtils.getCurrentStyle(elt);
			var bar = elt.offsetWidth - elt.clientWidth - (parseFloat(cs.borderLeftWidth) || 0) -
				(parseFloat(cs.borderRightWidth) || 0);

			// A gutter that is kept after the content stopped scrolling is
			// removed (it still has the width of a scrollbar)
			elt.style.scrollbarGutter = (elt.style.overflowY == 'auto' && bar > 0 &&
				elt.scrollHeight > elt.clientHeight) ? 'stable' : '';
		}
	};

	/**
	 * Puts the controls of the given popover of the previous look in the
	 * sections of the look and adds the new options.
	 */
	InlineToolbar.prototype.decorateSimplePopover = function(p, anchor, kind)
	{
		var body = p.body;
		var parts = getChildren(body);

		for (var i = 0; i < parts.length; i++)
		{
			body.removeChild(parts[i]);
		}

		if (kind == 'line')
		{
			this.addSimpleLineSections(p, parts);
		}
		else if (kind == 'fill')
		{
			this.addSimpleFillSections(p, parts);
		}
		else if (kind == 'text')
		{
			this.addSimpleTextSections(p, parts);
		}
		else if (kind == 'edge' && anchor == this.lineEndBtn)
		{
			this.addSimpleLineEndSections(p, parts);
		}
		else if (kind == 'edge')
		{
			this.addSimpleConnectionSections(p, parts);
		}
		else if (kind == 'arrange' || kind == 'table')
		{
			this.addSimpleActionSections(p, parts, kind);
		}
		else if (kind == 'shape')
		{
			this.addSimpleShapeSections(p, parts);
		}
		else
		{
			this.addSimpleRows(this.createSimpleSection(body), parts);
		}

		this.layoutSimpleGrids(body);
		this.installSimpleInlineKeys(body);
	};

	/**
	 * Adds the given parts of a popover to the given section as rows.
	 */
	InlineToolbar.prototype.addSimpleRows = function(section, parts)
	{
		for (var i = 0; i < parts.length; i++)
		{
			if (parts[i] != null)
			{
				section.appendChild(this.createSimpleInlineRow([parts[i]]));
			}
		}

		return section;
	};

	/**
	 * Returns a row of a section with the given controls. The row of a part
	 * that is a row of the previous look is that part (not a grid, which is
	 * put in a row).
	 */
	InlineToolbar.prototype.createSimpleInlineRow = function(elts, className)
	{
		var row = null;

		if (elts.length == 1 && elts[0].nodeName == 'DIV' && elts[0].className == '' &&
			elts[0].style.display != 'grid' && elts[0].style.gridTemplateColumns == '')
		{
			row = elts[0];
			clearStyles(row, ['gap', 'marginTop', 'marginBottom']);
		}
		else
		{
			row = document.createElement('div');

			for (var i = 0; i < elts.length; i++)
			{
				clearStyles(elts[i], ['marginTop', 'marginBottom']);
				row.appendChild(elts[i]);
			}
		}

		row.classList.add('geSmInlineRow');

		if (className != null)
		{
			row.classList.add(className);
		}

		// The toggles of a row of icons are a grid in the columns of the
		// popover (the styles and alignments of the text, Align, Table)
		if (className == 'geSmInlineIcons' && row.querySelector('.geSmInlineGrid') == null)
		{
			var children = getChildren(row);
			var toggles = children.filter(function(child)
			{
				return child.nodeType == 1 && child.classList.contains('geSmInlineToggle');
			});

			if (toggles.length > 0 && toggles.length == children.length)
			{
				var grid = document.createElement('div');
				grid.className = 'geSmInlineGrid';

				for (var i = 0; i < toggles.length; i++)
				{
					// Groups are columns of the grid
					clearStyles(toggles[i], ['marginLeft']);
					grid.appendChild(toggles[i]);
				}

				row.appendChild(grid);
			}
		}

		return row;
	};

	/**
	 * Returns the first part that is or contains an element of the given
	 * class.
	 */
	var findPart = function(parts, className)
	{
		for (var i = 0; i < parts.length; i++)
		{
			if (parts[i] != null && (parts[i].classList.contains(className) ||
				parts[i].querySelector('.' + className) != null))
			{
				return parts[i];
			}
		}

		return null;
	};

	/**
	 * Returns the row Opacity of the given kind of popover (see
	 * createSimpleOpacityRow).
	 */
	InlineToolbar.prototype.createOpacityRow = function(kind)
	{
		return this.setPart(this.createSimpleOpacityRow(kind), 'opacity');
	};

	/**
	 * Returns the row Corners or null (see createSimpleCornersRow).
	 */
	InlineToolbar.prototype.createCornersRow = function()
	{
		return this.setPart(this.createSimpleCornersRow(), 'corners');
	};

	/**
	 * Returns Clear waypoints, a row of the look (createSimpleRow) in
	 * Waypoints, for connectors with waypoints or null.
	 */

	InlineToolbar.prototype.createClearWaypointsRow = function()
	{
		var action = this.getClearWaypointsAction();
		var row = null;

		if (action != null)
		{
			row = this.createSimpleRow({label: this.getSimpleLabel(
				mxResources.get('clearWaypoints')), icon: InlineToolbar.glyphs.waypoints},
				mxUtils.bind(this, function()
				{
					this.runAction(action);
				}));

			row.classList.add('geSmInlineAction');
		}

		return this.setPart(row, 'clearWaypoints');
	};

	/**
	 * Creates the row Opacity (0 to 100 %, opacity) of the given cells: a
	 * slider of the look with its value; one edit when it is released (see
	 * InlineToolbar.getOpacity and setOpacity).
	 */
	InlineToolbar.prototype.createSimpleOpacityRow = function(kind)
	{
		var label = mxResources.get('opacity');

		var slider = InlineToolbar.createValueSlider(this.graph, label, 0, 100, 1, mxUtils.bind(this, function()
		{
			return this.getOpacity(kind);
		}), mxUtils.bind(this, function(value)
		{
			this.setOpacity(kind, value);
		}), function(value)
		{
			return Math.round(value) + ' %';
		});

		var row = InlineToolbar.createControlRow(label, slider);
		row.classList.add('geSmInlineControl');
		this.addPopoverUpdate(slider.update);

		return row;
	};

	/**
	 * Creates the row Corners (Sharp, Rounded) for shapes that can have
	 * rounded corners (the option rounded of the toolbar, which More does
	 * not show; Corners in the Line section of the Format panel), see
	 * InlineToolbar.getCornersOption and setRoundedCorners.
	 */
	InlineToolbar.prototype.createSimpleCornersRow = function()
	{
		var option = this.getCornersOption();

		if (option == null)
		{
			return null;
		}

		var getValue = mxUtils.bind(this, function()
		{
			return (this.isRoundedCorners(option)) ? 'rounded' : 'sharp';
		});

		var label = mxResources.get('corners');
		var group = InlineToolbar.createToggleGroup([{value: 'sharp', label: mxResources.get('sharp')},
			{value: 'rounded', label: mxResources.get('rounded')}], getValue(),
			mxUtils.bind(this, function(value)
			{
				this.setRoundedCorners(value == 'rounded');
			}), label);

		this.addPopoverUpdate(function()
		{
			group.setValue(getValue());
		});

		var row = InlineToolbar.createControlRow(label, group);
		row.classList.add('geSmInlineControl');

		return row;
	};

	/**
	 * Line: the pattern, the width and the color, Corners for shapes and
	 * Opacity for connectors; then Fill of connectors that have one.
	 */
	InlineToolbar.prototype.addSimpleLineSections = function(p, parts)
	{
		var body = p.body;
		var section = this.createSimpleSection(body, mxResources.get('line'));
		var pattern = this.findPart(parts, 'pattern');
		var stroke = this.findPart(parts, 'stroke');
		var corners = this.findPart(parts, 'corners');
		var opacity = this.findPart(parts, 'opacity');
		var fill = this.findPart(parts, 'fill');

		if (pattern != null)
		{
			pattern.classList.add('geSmInlineWide');
			section.appendChild(this.createSimpleInlineRow([pattern]));
		}

		if (stroke != null)
		{
			section.appendChild(this.createSimpleInlineRow([stroke]));
		}

		// Corners for shapes and Opacity for connectors (see showLineStyleMenu)
		if (corners != null)
		{
			section.appendChild(corners);
		}

		if (opacity != null)
		{
			section.appendChild(opacity);
		}

		if (fill != null)
		{
			this.createSimpleSection(body, mxResources.get('fill')).
				appendChild(this.createSimpleInlineRow([fill]));
		}
	};

	/**
	 * Fill: the colors, the direction of the gradient and the pattern, and
	 * Opacity.
	 */
	InlineToolbar.prototype.addSimpleFillSections = function(p, parts)
	{
		var section = this.createSimpleSection(p.body, mxResources.get('fill'));
		var opacity = this.findPart(parts, 'opacity');

		for (var i = 0; i < parts.length; i++)
		{
			if (parts[i] == opacity)
			{
				// Last (see showFillMenu)
			}
			else if (parts[i].style.display == 'grid' || parts[i].style.gridTemplateColumns != '')
			{
				// The labels and selects of the direction and the pattern
				parts[i].classList.add('geSmInlineFieldGrid');
				clearStyles(parts[i], ['gap', 'marginTop']);
				section.appendChild(parts[i]);
			}
			else
			{
				section.appendChild(this.createSimpleInlineRow([parts[i]]));
			}
		}

		if (opacity != null)
		{
			section.appendChild(opacity);
		}
	};

	/**
	 * Text: Font (the family, the size and the color, bold, italic, underline
	 * and strikethrough), Alignment (left, center, right and top, middle,
	 * bottom), Background of the labels of connectors and Use connector style.
	 */
	InlineToolbar.prototype.addSimpleTextSections = function(p, parts)
	{
		var body = p.body;
		var font = this.findPart(parts, 'font');
		var fields = this.findPart(parts, 'fields');
		var styles = this.findPart(parts, 'styles');
		var aligns = this.findPart(parts, 'align');
		var background = this.findPart(parts, 'background');
		var match = this.findPart(parts, 'match');
		var section = this.createSimpleSection(body, mxResources.get('font'));

		if (font != null)
		{
			font.classList.add('geSmInlineWide');
			section.appendChild(this.createSimpleInlineRow([font]));
		}

		if (fields != null)
		{
			section.appendChild(this.createSimpleInlineRow([fields]));
		}

		// Bold, italic, underline and strikethrough (see showTextMenu)
		if (styles != null)
		{
			section.appendChild(this.createSimpleInlineRow(getChildren(styles), 'geSmInlineIcons'));
		}

		// Left, center, right and top, middle, bottom
		if (aligns != null)
		{
			var buttons = getChildren(aligns);

			for (var i = 0; i < buttons.length; i++)
			{
				clearStyles(buttons[i], ['marginLeft']);
			}

			this.createSimpleSection(body, mxResources.get('alignment')).
				appendChild(this.createSimpleInlineRow(buttons, 'geSmInlineIcons'));
		}

		// The head names the background of the labels of connectors
		if (background != null)
		{
			var label = background.querySelector('.geSmInlineLabel');

			if (label != null && label.parentNode == background)
			{
				background.removeChild(label);
			}

			this.createSimpleSection(body, mxResources.get('background')).
				appendChild(this.createSimpleInlineRow([background]));
		}

		// Use connector style for the labels of connectors with own text
		// styles, shown and hidden by the toolbar
		if (match != null)
		{
			section.appendChild(this.createSimpleInlineRow([match], 'geSmInlineButtons'));
		}
	};

	/**
	 * Line ends: the selects of the start and the end.
	 */
	InlineToolbar.prototype.addSimpleLineEndSections = function(p, parts)
	{
		var section = this.createSimpleSection(p.body, mxResources.get('lineend'));

		for (var i = 0; i < parts.length; i++)
		{
			// The title of the previous look is the head
			if (parts[i].firstChild != null && parts[i].firstChild.nodeType == 1)
			{
				var dropdowns = getChildren(parts[i]);

				for (var j = 0; j < dropdowns.length; j++)
				{
					this.decorateSimpleSelect(dropdowns[j], mxResources.get((j == 0) ?
						'linestart' : 'lineend'));
				}

				section.appendChild(this.createSimpleInlineRow([parts[i]]));
			}
		}
	};

	/**
	 * Connection: Waypoints (the routing and Clear waypoints if a connector
	 * has some), Connection (the shapes of connectors) and Corners.
	 */
	InlineToolbar.prototype.addSimpleConnectionSections = function(p, parts)
	{
		var body = p.body;
		var waypoints = null;

		for (var i = 0; i < parts.length; i++)
		{
			var grid = parts[i];

			if (grid.classList.contains('geSmInlineGrid'))
			{
				var items = grid.smItems || [];
				var first = (items.length > 0) ? items[0].img : null;
				var title = 'waypoints';

				if (first == Format.connectionImage.src)
				{
					title = 'connection';
				}
				else if (first == Format.sharpBendImage.src)
				{
					title = 'corners';
				}

				var section = this.createSimpleSection(body, mxResources.get(title));
				section.appendChild(this.createSimpleInlineRow([grid], 'geSmInlineIcons'));

				if (title == 'waypoints' && waypoints == null)
				{
					waypoints = section;
				}
			}
		}

		// Clear waypoints for connectors with waypoints (Excalidraw edits the
		// points of lines in place), see createClearWaypointsRow
		var clear = this.findPart(parts, 'clearWaypoints');

		if (clear != null)
		{
			if (waypoints == null)
			{
				waypoints = this.createSimpleSection(body, mxResources.get('waypoints'));
			}

			waypoints.appendChild(clear);
		}
	};

	/**
	 * Arrange (Align and Group) and Table: the rows of icons first, then the
	 * buttons and the colors.
	 */
	InlineToolbar.prototype.addSimpleActionSections = function(p, parts, kind)
	{
		var body = p.body;

		for (var i = 0; i < parts.length; i++)
		{
			var part = parts[i];
			var toggles = part.querySelectorAll('.geSmInlineToggle');
			var icons = toggles.length > 0 && toggles.length == part.childNodes.length;

			for (var j = 0; j < toggles.length; j++)
			{
				// Groups of the previous look are columns of the grid
				clearStyles(toggles[j], ['marginLeft']);

				// Actions are no toggles
				if (icons)
				{
					toggles[j]._smAction = true;
					toggles[j].removeAttribute('aria-pressed');
				}
			}

			var title = (i == 0 && icons) ? mxResources.get((kind == 'table') ? 'table' : 'align') : null;
			var section = this.createSimpleSection(body, title);
			section.appendChild(this.createSimpleInlineRow([part], (icons) ? 'geSmInlineIcons' :
				((part.querySelector('.geSmInlineButton') != null) ? 'geSmInlineButtons' : null)));
		}
	};

	/**
	 * Shape: the search as a field with the glyph of the search, then the
	 * shapes of the palette with its name as the head, the shapes that the
	 * search finds in their place (the head hides with the title of
	 * showShapeMenu, as they are of all libraries), the note if the search
	 * finds none or waits and More Results below the shapes found as a
	 * button across the width of the grid (see showShapeMenu).
	 */
	InlineToolbar.prototype.addSimpleShapeSections = function(p, parts)
	{
		var body = p.body;
		var search = this.findPart(parts, 'search');
		var more = this.findPart(parts, 'more');
		var titlePart = null;
		var title = null;
		var shapes = [];

		for (var i = 0; i < parts.length; i++)
		{
			if (parts[i].classList.contains('geSmInlineLabel'))
			{
				titlePart = parts[i];
				title = parts[i].textContent;
			}
			else if (parts[i] != search && parts[i] != more)
			{
				shapes.push(parts[i]);
			}
		}

		var section = this.createSimpleSection(body, title);
		var head = (title != null) ? section.firstChild : null;

		if (search != null)
		{
			var field = document.createElement('label');
			field.className = 'geSmField geSmInlineSearch';
			field.appendChild(InlineToolbar.createIcon(InlineToolbar.glyphs.search));
			clearStyles(search, ['display', 'boxSizing', 'width', 'marginBottom']);
			field.appendChild(search);
			section.insertBefore(this.createSimpleInlineRow([field],
				'geSmInlineSearchRow'), section.firstChild);
		}

		for (var i = 0; i < shapes.length; i++)
		{
			var empty = this.findPart(getChildren(shapes[i]), 'empty');

			if (empty != null)
			{
				empty.classList.add('geSmInlineEmpty');
				clearStyles(empty, ['padding', 'fontSize']);
			}

			section.appendChild(this.createSimpleInlineRow([shapes[i]], 'geSmInlineShapes'));
		}

		// More Results is a row of its own below the shapes, which hides with
		// the button (geSmInlineMore)
		if (more != null)
		{
			clearStyles(more, ['paddingTop']);
			section.appendChild(this.createSimpleInlineRow([more], 'geSmInlineMore'));
		}

		// The shapes are in a grid or in a grid that scrolls, the shapes found
		// by the search in a grid next to it
		var grids = [];

		for (var i = 0; i < shapes.length; i++)
		{
			var grid = (shapes[i].style.gridTemplateColumns != '') ? shapes[i] : shapes[i].firstChild;
			var found = this.findPart(getChildren(shapes[i]), 'found');

			if (grid != null)
			{
				grids.push(grid);
			}

			if (found != null && found != grid)
			{
				grids.push(found);
			}
		}

		for (var i = 0; i < grids.length; i++)
		{
			// The shapes in the columns of the grids of icons
			grids[i].classList.add('geSmInlineGrid');
			grids[i].style.gridTemplateColumns = 'repeat(var(--sm-grid-cols, ' +
				this.simpleGridColumns + '), var(--sm-hit))';
			clearStyles(grids[i], ['gap']);
		}

		// The shapes of a palette scroll after four and a half rows of the
		// grid (rows of hit and gaps of 8), so the next row shows that they
		// scroll; three and a half on touch devices, where the search above
		// them takes a row of 48 and the popover would scroll as a whole
		// (the search would scroll away)
		var coarse = window.matchMedia != null && window.matchMedia('(pointer: coarse)').matches;

		for (var i = 0; i < p.scrolls.length; i++)
		{
			p.scrolls[i].maxHeight = (coarse) ? 'calc(3.5 * var(--sm-hit) + 24px)' :
				'calc(4.5 * var(--sm-hit) + 32px)';
		}

		// The chosen shape in the accent (see showShapeMenu), also among the
		// shapes that the search adds later; the head hides with the title
		var update = mxUtils.bind(this, function()
		{
			for (var i = 0; i < grids.length; i++)
			{
				var thumbs = getChildren(grids[i]);

				for (var j = 0; j < thumbs.length; j++)
				{
					if (!thumbs[j].classList.contains('geSmInlineThumb'))
					{
						thumbs[j].classList.add('geSmInlineThumb');
						this.setSimpleButtonRole(thumbs[j], thumbs[j].getAttribute('title'));
					}

					var active = hasActiveBorder(thumbs[j]);
					thumbs[j].classList.toggle('geSmOn', active);
					thumbs[j].setAttribute('aria-pressed', (active) ? 'true' : 'false');
				}
			}

			if (head != null && titlePart != null)
			{
				head.style.display = (titlePart.style.display == 'none') ? 'none' : '';
			}
		});

		update();
		this.addPopoverUpdate(update);
	};

	/**
	 * More has the sections Arrange (To front, Bring forward, Send backward,
	 * To back) and Edit (Duplicate, Copy style, Paste style, Edit link, Lock)
	 * as labelled tiles and Delete as a row in the danger color after More
	 * for this shape... (the driver, 17 November 2026: "kleine Kacheln, die
	 * beschriftet sind wie bei der Effects-Section. Sonst weiß man wirklich
	 * überhaupt nicht, was die Symbole bedeuten"), as the overflow of the
	 * toolbars of other diagramming apps; a locked cell keeps Unlock only.
	 */
	var inlineToolbarShowSimpleMoreMenu = InlineToolbar.prototype.showSimpleMoreMenu;

	InlineToolbar.prototype.showSimpleMoreMenu = function()
	{
		inlineToolbarShowSimpleMoreMenu.apply(this, arguments);
		var cells = this.currentCells;
		var body = (this.currentPopover != null) ? this.currentPopover.querySelector('.geSmToolbarMore') : null;

		if (body != null && cells != null && cells.length > 0 &&
			!(cells.length == 1 && this.isUnlockable(cells[0])))
		{
			var footer = body.querySelector('.geSmToolbarSearch');
			var actions = [];

			for (var i = 0; i < this.moreActions.length; i++)
			{
				if (mxUtils.indexOf(this.simpleDangerActions, this.moreActions[i]) < 0)
				{
					actions.push(this.moreActions[i]);
				}
			}

			var add = mxUtils.bind(this, function(title, tiles)
			{
				if (tiles != null)
				{
					var section = this.createSimpleSection(body, title);
					section.appendChild(tiles);

					if (footer != null)
					{
						body.insertBefore(section, footer);
					}
				}
			});

			add(mxResources.get('arrange'), this.createSimpleActionTiles(this.orderActions,
				true, mxResources.get('arrange')));
			add(mxResources.get('edit'), this.createSimpleActionTiles(actions,
				false, mxResources.get('edit')));

			// Delete last, apart from the other actions
			for (var i = 0; i < this.simpleDangerActions.length; i++)
			{
				var entry = this.getActionEntry(this.simpleDangerActions[i]);

				if (entry != null)
				{
					var section = this.createSimpleSection(body);
					section.classList.add('geSmToolbarDanger');
					var row = this.createSimpleRow({label: this.getSimpleLabel(entry.label),
						icon: InlineToolbar.glyphs.trash, shortcut: entry.shortcut},
						mxUtils.bind(this, function(action)
						{
							return mxUtils.bind(this, function()
							{
								this.runAction(action, false);
							});
						})(entry.action));
					row.classList.add('geSmToolbarDelete');
					row.disabled = !entry.enabled;
					section.appendChild(row);
				}
			}

			this.fitSimpleTiles(body);

			if (this.positionPopover != null)
			{
				this.positionPopover();
			}
		}
	};

	/**
	 * The actions of More in the danger color, a row each after the others.
	 */
	InlineToolbar.prototype.simpleDangerActions = ['delete'];

	/**
	 * The glyphs of the actions of More by the key of their entry (see
	 * InlineToolbar.getActionEntry).
	 */
	InlineToolbar.simpleActionGlyphs = {'toFront': 'toFront', 'bringForward': 'bringForward',
		'sendBackward': 'sendBackward', 'toBack': 'toBack', 'duplicate': 'duplicate',
		'copyStyle': 'copyStyle', 'pasteStyle': 'paste', 'editLink': 'link',
		'lock': 'lock', 'unlock': 'unlock', 'delete': 'trash'};

	/**
	 * Tiles of the actions of More for the given action names in a group of
	 * the given name, or null if none is shown: the glyph and the name of
	 * each action, the key in the tooltip (see InlineToolbar.getActionEntry),
	 * disabled ones at 0.45. The arrange actions keep the popover open, the
	 * others close it.
	 */
	InlineToolbar.prototype.createSimpleActionTiles = function(names, keepOpen, name)
	{
		var tiles = null;

		for (var i = 0; i < names.length; i++)
		{
			var entry = this.getActionEntry(names[i]);
			var glyph = (entry != null && Object.prototype.hasOwnProperty.call(
				InlineToolbar.simpleActionGlyphs, entry.key)) ?
				InlineToolbar.glyphs[InlineToolbar.simpleActionGlyphs[entry.key]] : null;

			if (glyph != null)
			{
				if (tiles == null)
				{
					tiles = this.createSimpleTiles(name);
				}

				var btn = this.createSimpleTile(glyph, this.getSimpleLabel(
					InlineToolbar.getSimpleTileLabel(entry.label)),
					mxUtils.bind(this, function(action)
					{
						return mxUtils.bind(this, function()
						{
							this.runAction(action, keepOpen);
						});
					})(entry.action), entry.shortcut);
				btn.disabled = !entry.enabled;
				tiles.appendChild(btn);
			}
		}

		return tiles;
	};

})();
