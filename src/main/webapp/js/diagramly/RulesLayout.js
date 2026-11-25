/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Style Rules (StyleRulesDialog) on the Rules template of Fusion in every
 * look that has it (concept "Fusion ideas in Simple and Classic"; the driver,
 * 18 November 2026: all dialogs of Fusion in Simple, one shared layout per
 * dialog with a Fusion and a Classic skin): the rules as readable rows "When
 * property is value then style" with a drag handle, the preview of their
 * style (which opens the style and the tags) and the number of shapes they
 * match, Add Rule and the shapes that all rules match below the rows, Edit as
 * JSON and Insert Legend on the left of the footer, Cancel and Apply on the
 * right. The controls of the dialog stay the controls with their listeners
 * and are only moved and restyled (StyleRulesDialog.controls and its
 * decorateCard), so Apply writes the same rules as the dialog of before.
 *
 * The layout (EditorUi.createStyleRulesLayout) takes a skin: the Classic skin
 * (RulesLayout.skins.classic, docs/dialog-style-guide.md, its CSS in
 * grapheditor.css under .geRules, which takes the colors, the font and the
 * corners of the other dialogs of the theme) for Simple, behind the feature
 * styleRulesDialog of Editor.featureDefaults (Editor.isStyleRulesDialogEnabled),
 * or the skin of Fusion, which SimpleRules.js adds (RulesLayout.skins.fusion),
 * so the code exists once. The dialog of before is shown where the feature is
 * off.
 */
var RulesLayout = {};

/**
 * Size of the content of the dialog in the Classic skin (the frame adds 48),
 * limited to the window (EditorUi.getStyleRulesDialogSize).
 */
RulesLayout.width = 840;

RulesLayout.height = 520;

/**
 * Space between the frame and the window in the Classic skin.
 */
RulesLayout.windowMargin = 32;

/**
 * Readable labels of the operators of rules (the symbols of the dialog of
 * before are kept as their tooltips).
 */
RulesLayout.operators = {'=': 'ruleIs', '!=': 'ruleIsNot', '<': 'ruleLessThan',
	'<=': 'ruleAtMost', '>': 'ruleMoreThan', '>=': 'ruleAtLeast'};

/**
 * The skins of the layout (the skin of Fusion is added by SimpleRules.js).
 */
RulesLayout.skins = {};

/**
 * Returns the skin of the current look: the skin of Fusion in the theme
 * Fusion, else the Classic skin.
 */
RulesLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		RulesLayout.skins.fusion != null) ? RulesLayout.skins.fusion :
		RulesLayout.skins.classic;
};

/**
 * Returns true if Style Rules shows the Rules template: the feature
 * styleRulesDialog of Editor.featureDefaults (styleRulesDialog in the
 * configuration and the URL), on in Simple, off in Classic, Sketch, Minimal
 * and Atlas. The theme Fusion always has it.
 */
Editor.isStyleRulesDialogEnabled = function()
{
	return Editor.isFeatureEnabled('styleRulesDialog');
};

/**
 * Adds the classes of the given list (separated by spaces) to the given
 * element.
 */
RulesLayout.addClasses = function(elt, classes)
{
	var names = classes.split(' ');

	for (var i = 0; i < names.length; i++)
	{
		if (names[i].length > 0)
		{
			elt.classList.add(names[i]);
		}
	}
};

/**
 * Returns a name with a detail, eg. "Color Scale · Fill Color" (see
 * PreviewDialog.joinList).
 */
RulesLayout.nameWithDetail = function(name, detail)
{
	return PreviewDialog.joinList([name, detail]);
};

/**
 * Returns the parts of the color of a style rule for its preview: the CSS
 * of the given color (light and dark) and the color of text on it.
 */
RulesLayout.getRuleColor = function(color)
{
	// The luminance needs six digits (parseColor does not expand #000)
	var hex = (typeof StyleRulesDialog !== 'undefined') ? StyleRulesDialog.toHex(color) : null;
	var ld = mxUtils.getLightDarkColor(color);
	var lum = (hex != null) ? mxUtils.getLightDarkColor(hex) : ld;

	var textOn = function(c)
	{
		var rgb = null;

		try
		{
			rgb = mxUtils.parseColor(c);
		}
		catch (e)
		{
			// Not a color
		}

		var lum = (rgb != null) ? (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255 : 1;

		return (lum < 0.55) ? '#FFFFFF' : '#1B1F24';
	};

	var light = textOn(lum.light);
	var dark = textOn(lum.dark);

	return {css: ld.cssText, text: (light == dark) ? light : 'light-dark(' + light + ', ' + dark + ')'};
};

/**
 * Returns the summary of the style of the given rule of StyleRulesDialog
 * (eg. Fill Color, Line Color, Bold) and applies its colors, line and font to
 * the given element. Only safe CSS colors are applied (Graph.isSafeCssColor)
 * and the summary is written as text.
 */
RulesLayout.updatePreview = function(elt, rule)
{
	var parts = [];
	var fill = null;
	var stroke = null;
	var font = null;
	var css = elt.style;
	css.background = '';
	css.borderColor = '';
	css.borderStyle = '';
	css.color = '';
	css.fontWeight = '';
	css.fontStyle = '';
	css.textDecoration = '';

	if (rule.op == 'scale')
	{
		var stops = [];

		for (var i = 0; i < rule.colors.length; i++)
		{
			if (rule.colors[i] != null && Graph.isSafeCssColor(rule.colors[i]))
			{
				stops.push(rule.colors[i]);
			}
		}

		if (stops.length > 1)
		{
			css.background = 'linear-gradient(to right, ' + stops.join(', ') + ')';
			css.color = RulesLayout.getRuleColor(stops[Math.floor(stops.length / 2)]).text;
		}

		parts.push(RulesLayout.nameWithDetail(StyleRulesDialog.getOperatorLabel('scale'),
			StyleRulesDialog.getKeyLabel(rule.target)));
	}
	else
	{
		for (var i = 0; i < rule.style.length; i++)
		{
			var key = rule.style[i].key;
			var value = rule.style[i].value;
			var type = Graph.dataStyleKeys[key];

			if (key == mxConstants.STYLE_FONTSTYLE)
			{
				var bits = parseInt(value) || 0;
				var names = ['bold', 'italic', 'underline', 'strikethrough'];
				var on = [];

				for (var j = 0; j < names.length; j++)
				{
					if ((bits & (1 << j)) != 0)
					{
						on.push(mxResources.get(names[j]));
					}
				}

				parts.push((on.length > 0) ? on.join(', ') : StyleRulesDialog.getKeyLabel(key));
				css.fontWeight = ((bits & 1) != 0) ? '600' : '';
				css.fontStyle = ((bits & 2) != 0) ? 'italic' : '';
				css.textDecoration = [((bits & 4) != 0) ? 'underline' : '',
					((bits & 8) != 0) ? 'line-through' : ''].join(' ').trim();
			}
			else if (type == 'color')
			{
				parts.push(StyleRulesDialog.getKeyLabel(key));
				var valid = value != null && value != mxConstants.NONE && Graph.isSafeCssColor(value);

				if (key == mxConstants.STYLE_FILLCOLOR && valid)
				{
					fill = value;
				}
				else if (key == mxConstants.STYLE_STROKECOLOR && valid)
				{
					stroke = value;
				}
				else if (key == mxConstants.STYLE_FONTCOLOR && valid)
				{
					font = value;
				}
			}
			else if (type == 'flag')
			{
				parts.push(StyleRulesDialog.getKeyLabel(key) + ((value == '1') ? '' :
					': ' + mxResources.get('off')));

				if (key == mxConstants.STYLE_DASHED && value == '1')
				{
					css.borderStyle = 'dashed';
				}
			}
			else if (type == 'url')
			{
				parts.push(StyleRulesDialog.getKeyLabel(key));
			}
			else
			{
				parts.push(StyleRulesDialog.getKeyLabel(key) + ' ' + value);
			}
		}

		if (fill != null)
		{
			var c = RulesLayout.getRuleColor(fill);
			css.background = c.css;
			css.color = c.text;
		}

		if (stroke != null)
		{
			css.borderColor = RulesLayout.getRuleColor(stroke).css;
		}

		if (font != null)
		{
			css.color = RulesLayout.getRuleColor(font).css;
		}
	}

	elt.textContent = '';
	mxUtils.write(elt, parts.join(', '));
	elt.setAttribute('title', parts.join(', '));

	return parts.join(', ');
};

/**
 * Lays out the given StyleRulesDialog on the Rules template in the Classic
 * skin where the feature is on (Fusion lays it out in SimpleRules.js). Called
 * at the end of the constructor of StyleRulesDialog.
 */
EditorUi.prototype.installStyleRulesLayout = function(dlg)
{
	if (!this.editor.isChromelessView() && Editor.isStyleRulesDialogEnabled() &&
		RulesLayout.getSkin() == RulesLayout.skins.classic)
	{
		try
		{
			this.createStyleRulesLayout(dlg, RulesLayout.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installStyleRulesLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Returns the size of the content and the minimum size of the given
 * StyleRulesDialog: RulesLayout.width × RulesLayout.height limited to the
 * window if the dialog is laid out in the Classic skin, else the size of the
 * dialog of before (760 × 440, at least 560 × 300 when it is resized). Fusion
 * sizes its frame itself.
 */
EditorUi.prototype.getStyleRulesDialogSize = function(dlg)
{
	var width = 760;
	var height = 440;
	var min = new mxRectangle(0, 0, 560, 300);

	if (dlg != null && dlg.rulesLayout != null &&
		dlg.rulesLayout.skin == RulesLayout.skins.classic)
	{
		var ww = window.innerWidth || document.documentElement.clientWidth;
		var wh = window.innerHeight || document.documentElement.clientHeight;
		var margin = 48 + ((ww < 640) ? 16 : RulesLayout.windowMargin);

		width = Math.max(Math.min(RulesLayout.width, ww - margin), 240);
		height = Math.max(Math.min(RulesLayout.height, wh - margin), 240);
		min = new mxRectangle(0, 0, Math.min(560, width), Math.min(300, height));
	}

	return {width: width, height: height, minSize: min};
};

/**
 * Replaces the layout of the given rules dialog with the Rules template in
 * the given skin (RulesLayout.skins): the rules as rows "When property is
 * value then style", the style and the tags behind the preview of the style,
 * Add Rule and the shapes that the rules match, Edit as JSON and Insert
 * Legend in the footer. Sets dlg.rulesLayout ({skin}). Keeps the layout of
 * before if the dialog has changed.
 */
EditorUi.prototype.createStyleRulesLayout = function(dlg, skin)
{
	var ui = this;
	var cls = skin.classes;
	var graph = this.editor.graph;
	var c = dlg.controls;
	var elt = dlg.container;
	var scroll = elt.firstChild;
	var buttons = elt.lastChild;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.list == null || c.render == null || c.ok == null || c.add == null ||
		scroll == null || buttons == null || scroll == buttons || c.ok.parentNode != buttons)
	{
		return;
	}

	var content = c.list.parentNode;
	var rules = c.rules;
	dlg.rulesLayout = {skin: skin};
	skin.prepare(this, elt);

	elt.insertBefore(skin.createHead(this), scroll);
	c.title.classList.add(cls.replaced);
	scroll.classList.add(cls.body);
	c.hint.className = cls.intro;
	c.hint.removeAttribute('style');
	c.list.className = cls.list;
	c.limitHint.className = cls.limit;
	c.limitHint.style.margin = '';

	// Add Rule and the shapes that the rules match
	var addRow = document.createElement('div');
	addRow.className = cls.add;
	content.insertBefore(addRow, c.add);
	addRow.appendChild(c.add);
	c.add.style.marginLeft = '';
	skin.addIcon(c.add, 'plus');
	var summary = document.createElement('span');
	summary.className = cls.summary;
	summary.setAttribute('aria-live', 'polite');
	addRow.appendChild(summary);

	// The rules as JSON (Edit as JSON)
	var jsonBox = document.createElement('div');
	jsonBox.className = cls.json;
	jsonBox.style.display = 'none';
	var text = document.createElement('textarea');
	text.setAttribute('aria-label', mxResources.get('styleRules'));
	var code = skin.createCodeField(this, text);
	jsonBox.appendChild(code.editor);
	var jsonError = document.createElement('div');
	jsonError.className = cls.jsonError;
	jsonError.setAttribute('role', 'alert');
	jsonBox.appendChild(jsonError);
	content.appendChild(jsonBox);

	// Contexts of the cells for counting the matches
	var cells = c.cells || StyleRulesDialog.getCells(graph);
	var contexts = [];

	// Counts the shapes of the rules that the page uses (the written
	// rules up to Graph.maxStyleRules, see getCardRules in the dialog)
	var updateSummary = function()
	{
		var parsed = [];

		for (var i = 0; i < rules.length && parsed.length < Graph.maxStyleRules; i++)
		{
			if (!rules[i].hidden)
			{
				var p = Graph.parseStyleRule(StyleRulesDialog.toObject(rules[i]));

				if (p != null)
				{
					parsed.push(p);
				}
			}
		}

		var count = 0;

		for (var i = 0; i < cells.length && parsed.length > 0; i++)
		{
			contexts[i] = contexts[i] || {};

			for (var j = 0; j < parsed.length; j++)
			{
				if (graph.isStyleRuleMatch(cells[i], parsed[j], contexts[i]))
				{
					count++;
					break;
				}
			}
		}

		var value = (parsed.length == 0) ? '' : ((count == 1) ?
			mxResources.get('oneShapeMatchesOnPage') : mxResources.get('shapesMatchOnPage', [count]));

		// The live region speaks only when the count changes
		if (summary.textContent != value)
		{
			summary.textContent = value;
		}
	};

	// Rules whose style is shown, and the rules that were shown before
	// (added rules are open)
	var open = new WeakSet();
	var seen = new WeakSet();
	var initialized = false;

	// Moves the rule of the card at the given position by the given delta
	var move = function(index, delta)
	{
		var cards = c.list.children;
		var target = index + delta;

		if (target >= 0 && target < cards.length)
		{
			var from = cards[index].simpleIndex;
			var to = cards[target].simpleIndex;
			var rule = rules.splice(from, 1)[0];
			rules.splice(to, 0, rule);
			c.render();
			var handle = c.list.children[target].querySelector('.' + cls.handle);

			if (handle != null)
			{
				handle.focus();
			}

			announcePosition(c.list.children[target]);
		}
	};

	// Reads out the position of the given card (eg. 2 of 5)
	var announcePosition = function(card)
	{
		var index = mxUtils.indexOf(c.list.children, card);

		if (index >= 0 && typeof ui.announce === 'function')
		{
			ui.announce(mxResources.get('nOfM', [index + 1, c.list.children.length]), true);
		}
	};

	c.decorateCard = function(card, p)
	{
		var rule = p.rule;
		card.className = cls.card;
		card.simpleIndex = p.index;
		var row = p.row;
		row.className = cls.row;
		row.removeAttribute('style');

		// The rest of the card: the style or the scale of the rule
		var styleRows = [];

		for (var i = 0; i < card.children.length; i++)
		{
			var child = card.children[i];

			if (child != row && child.nodeName == 'DIV')
			{
				styleRows.push(child);
			}
		}

		// Handle: drag it or use the arrow keys
		var handle = p.handle;
		handle.removeAttribute('style');
		handle.className = cls.handle;
		skin.setHandleIcon(handle);
		handle.setAttribute('role', 'button');
		handle.setAttribute('tabindex', '0');
		handle.setAttribute('aria-label', mxResources.get('reorder'));
		handle.setAttribute('aria-keyshortcuts', 'ArrowUp ArrowDown');

		mxEvent.addListener(handle, 'keydown', function(evt)
		{
			if (evt.key == 'ArrowUp' || evt.key == 'ArrowDown')
			{
				move(mxUtils.indexOf(c.list.children, card), (evt.key == 'ArrowUp') ? -1 : 1);
				mxEvent.consume(evt);
			}
			else if (evt.key == 'Enter' || evt.key == ' ')
			{
				// The button tells where the rule is (the arrow keys move it)
				announcePosition(card);
				mxEvent.consume(evt);
			}
		});

		var word = function(key)
		{
			var span = document.createElement('span');
			span.className = cls.word;
			mxUtils.write(span, mxResources.get(key));

			return span;
		};

		// When property is value then style
		p.property.removeAttribute('style');
		p.property.className = cls.property;
		p.property.setAttribute('aria-label', mxResources.get('property'));
		p.op.removeAttribute('style');
		p.op.className = cls.op;
		p.op.setAttribute('aria-label', mxResources.get('match'));

		for (var i = 0; i < p.op.options.length; i++)
		{
			var option = p.op.options[i];
			var key = RulesLayout.operators[option.value];

			if (key != null && option.getAttribute('title') == null)
			{
				option.setAttribute('title', option.textContent);
				option.textContent = mxResources.get(key);
			}
		}

		p.value.className = cls.value;
		p.value.style.flex = '';
		p.value.style.minWidth = '';
		p.value.setAttribute('aria-label', mxResources.get('value'));

		// The preview of the style opens the style and the tags
		var detailsId = skin.ids.details + Editor.guid();
		var chip = document.createElement('button');
		chip.setAttribute('type', 'button');
		chip.className = cls.chip;
		chip.setAttribute('aria-controls', detailsId);
		var preview = document.createElement('span');
		preview.className = cls.preview;
		chip.appendChild(preview);

		p.count.className = cls.count;
		p.count.removeAttribute('style');
		skin.setIconButton(ui, p.remove, 'trash', cls.remove);
		var group = p.remove.parentNode;

		while (row.firstChild != null)
		{
			row.removeChild(row.firstChild);
		}

		if (group != null && group.parentNode != null)
		{
			group.parentNode.removeChild(group);
		}

		row.appendChild(handle);
		row.appendChild(word('ruleWhen'));
		row.appendChild(p.property);
		row.appendChild(p.op);
		row.appendChild(p.value);
		row.appendChild(word('ruleThen'));
		row.appendChild(chip);
		row.appendChild(p.count);
		row.appendChild(p.remove);

		// The style rows and the tags behind the preview
		var details = document.createElement('div');
		details.className = cls.details;
		details.id = detailsId;

		for (var i = 0; i < styleRows.length; i++)
		{
			var sr = styleRows[i];
			sr.className = cls.styleRow;
			sr.removeAttribute('style');
			details.appendChild(sr);

			// The arrow of the previous look
			if (sr.firstChild != null && sr.firstChild.nodeName == 'SPAN' &&
				sr.firstChild.querySelector('svg') != null)
			{
				sr.firstChild.classList.add(cls.replaced);
			}

			var btns = sr.querySelectorAll('button');

			for (var j = 0; j < btns.length; j++)
			{
				var b = btns[j];

				if (b.classList.contains('geColorBtn'))
				{
					b.classList.add(cls.swatch);
					b.style.flex = '';
					b.style.width = '';
					b.style.height = '';
					b.setAttribute('aria-label', b.getAttribute('title') || '');
				}
				else
				{
					var img = b.querySelector('img');
					var src = (img != null) ? img.getAttribute('src') : null;
					skin.setIconButton(ui, b, (src == Editor.plusImage) ? 'plus' :
						((src == Editor.trashImage) ? 'trash' : 'close'), cls.iconBtn);
				}
			}

			var groups = sr.querySelectorAll('span');

			for (var j = 0; j < groups.length; j++)
			{
				groups[j].style.marginLeft = '';
			}

			// Font styles as chips
			var labels = sr.querySelectorAll('div>label');

			for (var j = 0; j < labels.length; j++)
			{
				labels[j].removeAttribute('style');
				labels[j].className = cls.check;

				if (labels[j].parentNode.className != cls.checks)
				{
					labels[j].parentNode.className = cls.checks;
					labels[j].parentNode.removeAttribute('style');
				}
			}

			var inputs = sr.querySelectorAll('input[type="number"], input[type="url"], select');
			var numbers = sr.querySelectorAll('input[type="number"]');

			for (var j = 0; j < inputs.length; j++)
			{
				inputs[j].style.flex = '';
				inputs[j].style.minWidth = '';

				if (inputs[j].getAttribute('aria-label') == null)
				{
					var name = (rule.op == 'scale') ? StyleRulesDialog.getOperatorLabel('scale') :
						mxResources.get('style');

					// The first and the last number of a scale are its ends
					if (rule.op == 'scale' && numbers.length == 2 &&
						mxUtils.indexOf(numbers, inputs[j]) >= 0)
					{
						name = RulesLayout.nameWithDetail(name, mxResources.get(
							(inputs[j] == numbers[0]) ? 'minimum' : 'maximum'));
					}

					inputs[j].setAttribute('aria-label', inputs[j].getAttribute('title') || name);
				}
			}

			// Flags are switches where the skin has a role for them (Fusion);
			// the Classic skin keeps their checkboxes
			var flags = sr.querySelectorAll(':scope>input[type="checkbox"]');

			for (var j = 0; j < flags.length; j++)
			{
				if (skin.flagRole != null)
				{
					flags[j].setAttribute('role', skin.flagRole);
				}

				flags[j].setAttribute('aria-label', flags[j].getAttribute('title') || '');
			}
		}

		// Only shapes with these tags
		var tagsRow = document.createElement('div');
		tagsRow.className = cls.styleRow + ' ' + cls.tags;
		var tagsLabel = document.createElement('label');
		mxUtils.write(tagsLabel, mxResources.get('tags'));
		p.tags.id = skin.ids.tags + Editor.guid();
		tagsLabel.setAttribute('for', p.tags.id);
		tagsRow.appendChild(tagsLabel);
		p.tags.removeAttribute('style');
		tagsRow.appendChild(p.tags);
		details.appendChild(tagsRow);
		card.appendChild(details);

		// New rules are open
		if (initialized && !seen.has(rule))
		{
			open.add(rule);
		}

		seen.add(rule);

		var setOpen = function(value)
		{
			if (value)
			{
				open.add(rule);
			}
			else
			{
				open['delete'](rule);
			}

			details.style.display = (value) ? '' : 'none';
			chip.setAttribute('aria-expanded', (value) ? 'true' : 'false');
			card.classList.toggle(cls.on, value);
		};

		setOpen(open.has(rule));

		mxEvent.addListener(chip, 'click', function()
		{
			setOpen(!open.has(rule));
		});

		// The preview follows the style (also colors that are picked in the
		// color dialog, which only change the swatch)
		var updatePreview = function()
		{
			var summaryText = RulesLayout.updatePreview(preview, rule);
			chip.setAttribute('aria-label', mxResources.get('ruleThen') + ' ' + summaryText);
		};

		updatePreview();
		mxEvent.addListener(details, 'input', updatePreview);
		mxEvent.addListener(details, 'change', updatePreview);

		if (window.MutationObserver != null)
		{
			new MutationObserver(updatePreview).observe(details,
				{attributes: true, subtree: true, attributeFilter: ['style']});
		}

		// The classes of the fields above replace the marks of the fields
		// that the rule needs (geDialogFieldWarn, 6yh5 S4)
		if (typeof p.updateCount === 'function')
		{
			p.updateCount();
		}
	};

	// Restyles the cards and counts the shapes
	c.render();
	initialized = true;
	updateSummary();

	var renderFn = c.render;

	// Counts after a pause in typing (all rules against all cells), once
	// for the changes of a render
	var summaryThread = null;

	var scheduleSummary = function()
	{
		window.clearTimeout(summaryThread);
		summaryThread = window.setTimeout(function()
		{
			summaryThread = null;
			updateSummary();
		}, 300);
	};

	mxEvent.addListener(c.list, 'input', scheduleSummary);
	mxEvent.addListener(c.list, 'change', scheduleSummary);

	// Counts again after the cards change (add, delete, reorder)
	if (window.MutationObserver != null)
	{
		new MutationObserver(scheduleSummary).observe(c.list, {childList: true});
	}

	// The footer: Edit as JSON and Insert Legend on the left, Apply
	var jsonBtn = document.createElement('button');
	jsonBtn.setAttribute('type', 'button');
	jsonBtn.className = cls.jsonBtn;
	jsonBtn.setAttribute('aria-pressed', 'false');
	skin.addIcon(jsonBtn, 'code');
	mxUtils.write(jsonBtn, mxResources.get('editAsJson'));
	buttons.insertBefore(jsonBtn, buttons.firstChild);

	if (c.legend != null)
	{
		RulesLayout.addClasses(c.legend, cls.legend);
		skin.addIcon(c.legend, 'list');
		buttons.insertBefore(c.legend, jsonBtn.nextSibling);
	}
	else
	{
		RulesLayout.addClasses(jsonBtn, cls.footerStart);
	}

	if (mxUtils.trim(c.ok.textContent) == mxResources.get('ok'))
	{
		c.ok.textContent = mxResources.get('apply');
	}

	var rows = [c.hint, c.list, c.limitHint, addRow];
	var jsonMode = false;

	// Rules without a property, which the JSON does not have, and the
	// rules of the page that this version ignores when the JSON was shown
	var pending = [];
	var ignored = Object.create(null);

	// Returns the rules of the JSON or throws an error
	var parseJson = function()
	{
		var value = mxUtils.trim(text.value);
		var obj = (value.length > 0) ? JSON.parse(value) : [];

		if (!Array.isArray(obj))
		{
			throw new Error(mxResources.get('invalidInput'));
		}

		var result = StyleRulesDialog.parseRules(JSON.stringify(obj));

		// Rules that this version ignores are kept only if the page had
		// them (as often as the page had them), eg. rules of a newer
		// version, as the page would not use a typed rule and its row
		// would be missing. A map of counts, as a crafted page can have
		// many of them
		var left = Object.create(null);

		for (var key in ignored)
		{
			left[key] = ignored[key];
		}

		for (var i = 0; i < result.length; i++)
		{
			if (result[i].hidden)
			{
				var key = JSON.stringify(result[i].raw);

				if (!(left[key] > 0))
				{
					throw new Error(mxResources.get('invalidInput') + ' (' + (i + 1) + ')');
				}

				left[key]--;
			}
		}

		return result;
	};

	// Takes the rules of the JSON, returns false and shows the error if it
	// cannot be parsed
	var takeJson = function()
	{
		try
		{
			var next = parseJson();
			rules.length = 0;

			for (var i = 0; i < next.length; i++)
			{
				rules.push(next[i]);
			}

			// Keeps the rules that the JSON does not have
			for (var i = 0; i < pending.length; i++)
			{
				rules.push(pending[i]);
			}

			// Rules of the JSON are not new rules (closed)
			jsonError.textContent = '';
			initialized = false;
			renderFn();
			initialized = true;
			updateSummary();

			return true;
		}
		catch (e)
		{
			jsonError.textContent = mxResources.get('error') + ': ' +
				((e != null && e.message != null) ? e.message : String(e));
			text.focus();

			return false;
		}
	};

	var setJsonMode = function(value)
	{
		// Rules with a property that would not be written must be fixed
		// first, as the JSON would drop them (see validate)
		var error = (value && c.validate != null) ? c.validate() : null;

		if (error != null)
		{
			ui.showError(mxResources.get('error'), error);

			return;
		}

		jsonMode = value;
		elt.classList.toggle(cls.jsonMode, value);
		jsonBox.style.display = (value) ? '' : 'none';
		c.add.disabled = value || c.add.disabled;

		for (var i = 0; i < rows.length; i++)
		{
			rows[i].classList.toggle(cls.replaced, value);
		}

		jsonBtn.setAttribute('aria-pressed', (value) ? 'true' : 'false');
		jsonBtn.classList.toggle(cls.on, value);

		if (value)
		{
			pending = [];
			ignored = Object.create(null);

			for (var i = 0; i < rules.length; i++)
			{
				if (rules[i].hidden)
				{
					var key = JSON.stringify(rules[i].raw);
					ignored[key] = (ignored[key] || 0) + 1;
				}
				else if (mxUtils.trim(rules[i].property).length == 0)
				{
					pending.push(rules[i]);
				}
			}

			var json = StyleRulesDialog.toJson(rules);
			text.value = JSON.stringify((json != null) ? JSON.parse(json) : [], null, 2);
			jsonError.textContent = '';
			text.focus();
			text.setSelectionRange(0, 0);
			text.scrollTop = 0;
			code.update();
		}
		else
		{
			// Render restores the state of Add Rule
			renderFn();
		}
	};

	mxEvent.addListener(jsonBtn, 'click', function()
	{
		if (!jsonMode)
		{
			setJsonMode(true);
		}
		else if (takeJson())
		{
			setJsonMode(false);
		}
	});

	// Apply and Insert Legend take the rules of the JSON first
	var beforeApply = function(evt)
	{
		if (jsonMode && !takeJson())
		{
			evt.stopImmediatePropagation();
			mxEvent.consume(evt);
		}
	};

	c.ok.addEventListener('click', beforeApply, true);

	if (c.legend != null)
	{
		c.legend.addEventListener('click', beforeApply, true);
	}

	// A page without rules starts with an empty rule (rules without a
	// property are not written), so the focus is in its first field and
	// Enter applies (report 13.1). Not on phones, where the focus would
	// open the keyboard
	var init = dlg.init;

	if (typeof init === 'function')
	{
		dlg.init = function()
		{
			if (c.list.querySelector('input') == null && !skin.isPhone())
			{
				c.add.click();
			}

			return init.apply(this, arguments);
		};
	}

	// Enter in a field applies (Ctrl+Enter in the JSON)
	mxEvent.addListener(elt, 'keydown', function(evt)
	{
		var target = mxEvent.getSource(evt);

		if (evt.key == 'Enter' && !evt.isComposing && target != null &&
			((target.nodeName == 'INPUT' && target.type != 'checkbox' &&
			!target.hasAttribute('list') && !mxEvent.isControlDown(evt)) ||
			(target.nodeName == 'TEXTAREA' &&
			(mxEvent.isControlDown(evt) || mxClient.IS_MAC && evt.metaKey))))
		{
			c.ok.click();
			mxEvent.consume(evt);
		}
	});
};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the colors of
 * its dialogs light and dark, the headline of the dialogs, the icons of the
 * dialog of before, the flags and the font styles as checkboxes, a plain
 * field for the JSON, the buttons without glyphs and the focus rings as
 * outlines inside of the controls. The CSS is in grapheditor.css under
 * .geRules.
 */
RulesLayout.skins.classic = {
	name: 'classic',
	classes: {replaced: 'geRulesReplaced', body: 'geRulesBody', intro: 'geDialogHint geRulesIntro',
		list: 'geRulesList', limit: 'geDialogHint geRulesLimit', add: 'geRulesAdd',
		summary: 'geDialogHint geRulesSummary', json: 'geRulesJson', jsonError: 'geRulesError',
		card: 'geRule', row: 'geRuleRow', handle: 'geRuleHandle', word: 'geRuleWord',
		property: 'geRuleProperty', op: 'geRuleOp', value: 'geRuleValue', chip: 'geRuleStyle',
		preview: 'geRuleStyleText', count: 'geDialogHint geRuleCount', remove: 'geRuleRemove',
		details: 'geRuleDetails', styleRow: 'geRuleStyleRow', swatch: 'geRuleSwatch',
		iconBtn: 'geRuleIconBtn', checks: 'geRuleChecks', check: 'geRuleCheck', tags: 'geRuleTags',
		on: 'geRulesOn', jsonMode: 'geRulesJsonMode', jsonBtn: 'geBtn geRulesJsonBtn',
		legend: 'geRulesFooterStart', footerStart: 'geRulesFooterStart'},
	ids: {details: 'geRuleDetails-', tags: 'geRuleTags-'},
	// The flags stay checkboxes
	flagRole: null,
	/**
	 * Lays out the given content of the dialog (it fills the dialog, which
	 * can be resized) and its footer.
	 */
	prepare: function(ui, elt)
	{
		elt.classList.add('geRules');

		// The footer has its own spacing
		if (elt.lastChild != null)
		{
			elt.lastChild.classList.add('geRulesFooter');
			elt.lastChild.style.marginTop = '';
			elt.lastChild.style.textAlign = '';
		}
	},
	/**
	 * Returns the headline of the dialog, which stays above the rules.
	 */
	createHead: function(ui)
	{
		var head = document.createElement('div');
		head.className = 'geRulesHead';
		var h3 = document.createElement('h3');
		mxUtils.write(h3, mxResources.get('styleRules', null, 'Style Rules'));
		head.appendChild(h3);

		return head;
	},
	/**
	 * The buttons have no glyphs.
	 */
	addIcon: function(btn, name)
	{
		// No glyph
	},
	/**
	 * Returns the field of the JSON: the given text area in a frame.
	 */
	createCodeField: function(ui, text)
	{
		var editor = document.createElement('div');
		editor.className = 'geRulesCode';
		text.setAttribute('wrap', 'off');
		text.setAttribute('spellcheck', 'false');
		editor.appendChild(text);

		return {editor: editor, update: function() {}};
	},
	/**
	 * The handle keeps the icon of the dialog of before.
	 */
	setHandleIcon: function(handle)
	{
		// Keeps the icon
	},
	/**
	 * Makes the given button of the dialog of before (an image of Editor) an
	 * icon button of 28 with its name; its image and its listeners stay.
	 */
	setIconButton: function(ui, btn, name, className)
	{
		if (btn != null)
		{
			var title = btn.getAttribute('title') || '';
			btn.removeAttribute('style');
			btn.className = 'geBtn ' + className;
			btn.setAttribute('type', 'button');
			btn.setAttribute('aria-label', title);
			var img = btn.querySelector('img');

			// The button has the name
			if (img != null)
			{
				img.setAttribute('alt', '');
			}
		}

		return btn;
	},
	/**
	 * Returns true on phones, where a new empty rule would open the keyboard.
	 */
	isPhone: function()
	{
		return window.matchMedia != null && window.matchMedia('(max-width: 639px)').matches;
	}
};
