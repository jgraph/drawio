/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The Text Outline of Fusion in every look that has it (the driver, 20
 * November 2026: what Simple lost when the panels of batch 15 were dropped,
 * docs/claude/fusion-panels.md, "Text Outline as a panel"): the ARIA tree of
 * the layers, containers, shapes and connectors of the page with a glyph
 * per kind, what a connector connects, a filter over the whole page from 8
 * items, the label edited in place with a double click or F2 and an empty
 * state. It is the tree of TextOutlineWindow (the same items, names, keys
 * and limits, one tab stop, the arrow keys, Space selects, Enter and Escape
 * go to the diagram, typing goes to the next item that starts with the
 * typed text) with the additions of the panel.
 *
 * The layout (EditorUi.createTextOutlineLayout) takes a skin: the Classic
 * skin (TextOutlineLayout.skins.classic, docs/dialog-style-guide.md, its CSS
 * in grapheditor.css under .geTextOutlineLayout, which keeps the colors of
 * the window of before) for the window of Simple, behind the feature
 * textOutlineWindow of Editor.featureDefaults
 * (Editor.isTextOutlineWindowEnabled), or the skin of Fusion, which
 * SimplePanels.js adds (TextOutlineLayout.skins.fusion, the panel of the
 * right panel), so the code exists once. The window of before is shown as
 * it was where the feature is off.
 */
var TextOutlineLayout = {};

/**
 * The skins of the layout. A skin has the classes of the parts (a value
 * with spaces adds more than one class, null adds none; name and meta are
 * single classes) and the builders of its parts: indent (the padding of a
 * row of the given level), createSearchField (an element with the field as
 * its input), createGlyph, createChevron, createEmptyState, normalize (the
 * text of the filter), getScroller (the element that scrolls the tree) and
 * updateScroller (optional, after a refresh).
 */
TextOutlineLayout.skins = {};

/**
 * Adds the given classes (separated by spaces, null for none) to the given
 * element.
 */
TextOutlineLayout.addClasses = function(elt, classes)
{
	if (elt != null && classes != null && classes.length > 0)
	{
		var names = classes.split(' ');

		for (var i = 0; i < names.length; i++)
		{
			if (names[i].length > 0)
			{
				elt.classList.add(names[i]);
			}
		}
	}
};

/**
 * The glyphs of the kinds of cells (on a 24 grid, stroke 1.8, round caps),
 * the icons of Fusion of the same names (SimpleUi.icons, the test
 * text-outline-fusion of test/classic-simple compares them), and the glyph
 * of the empty state (textOutline).
 */
TextOutlineLayout.glyphs = {
	layers: '<path d="M12 4 3.5 8.5 12 13l8.5-4.5z"/><path d="M3.5 12.5 12 17l8.5-4.5"/>' +
		'<path d="M3.5 16.5 12 21l8.5-4.5"/>',
	connector: '<path d="M4 19 19 5"/><path d="M12 5h7v7"/>',
	rect: '<rect x="4" y="6" width="16" height="12" rx="1.5"/>',
	sheet: '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/>' +
		'<path d="M3.5 9.5h17M3.5 14.5h17M9.5 4.5v15"/>',
	group: '<rect x="3.5" y="3.5" width="17" height="17" rx="2" stroke-dasharray="2.5 2.5"/>' +
		'<rect x="7" y="7" width="5" height="5" rx="1"/><rect x="12" y="12" width="5" height="5" rx="1"/>',
	image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/>' +
		'<circle cx="9" cy="10" r="1.8"/><path d="M20.5 15.5l-5-5L5 19.5"/>',
	text: '<path d="M6 7V5h12v2M12 5v14M9.5 19h5"/>',
	textOutline: '<path d="M4 5.5h6M8.5 12H20M8.5 18.5H20M5.5 5.5v13h3M5.5 12h3"/>'
};

/**
 * Returns the image of the given glyph (TextOutlineLayout.glyphs) as a data
 * URI, drawn as Fusion draws its icons (SimpleUi.createSvgIcon), or null.
 */
TextOutlineLayout.getGlyphImage = function(name)
{
	return (name != null && Object.prototype.hasOwnProperty.call(TextOutlineLayout.glyphs, name)) ?
		Editor.createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" ' +
			'viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" ' +
			'stroke-linecap="round" stroke-linejoin="round">' +
			TextOutlineLayout.glyphs[name] + '</svg>') : null;
};

/**
 * Returns a glyph of the Classic skin: a mask in the color of the text, so
 * that it follows dark mode and the selection.
 */
TextOutlineLayout.createClassicGlyph = function(name, className)
{
	var icon = document.createElement('span');
	icon.className = className;
	icon.style.setProperty('--ge-outline-glyph', 'url(\'' +
		TextOutlineLayout.getGlyphImage(name) + '\')');
	icon.setAttribute('aria-hidden', 'true');

	return icon;
};

/**
 * The Classic skin (docs/dialog-style-guide.md), for the window of Simple:
 * the rows, colors and toggles of the window of before, the glyphs as masks
 * in the color of the text, a search field of the dialogs above the tree
 * that stays at the top while it scrolls and the empty state in the middle.
 * The CSS is in grapheditor.css under .geTextOutline and
 * .geTextOutlineLayout.
 */
TextOutlineLayout.skins.classic = {
	name: 'classic',
	classes: {content: 'geTextOutline geTextOutlineLayout', filter: 'geTextOutlineFilter',
		tree: 'geTextOutlineTree', item: null, layer: 'geTextOutlineLayer',
		context: 'geTextOutlineContext', row: 'geTextOutlineItem', toggle: 'geTextOutlineToggle',
		glyph: 'geTextOutlineGlyph', name: 'geTextOutlineName', meta: 'geTextOutlineMeta',
		more: 'geBtn geTextOutlineMore', note: 'geTextOutlineNote', empty: 'geTextOutlineEmpty',
		field: 'geTextOutlineField'},
	/**
	 * Returns the padding of a row of the given level (the window of before).
	 */
	indent: function(level)
	{
		return 2 + level * 18;
	},
	/**
	 * Returns a search field with the given placeholder as its name: fn is
	 * called with the value on each input, Escape clears it.
	 */
	createSearchField: function(placeholder, fn)
	{
		var field = document.createElement('div');

		var input = document.createElement('input');
		input.setAttribute('type', 'search');
		input.setAttribute('placeholder', placeholder);
		input.setAttribute('aria-label', placeholder);
		input.setAttribute('autocomplete', 'off');
		input.setAttribute('spellcheck', 'false');
		input.className = 'geTextOutlineSearch';
		field.appendChild(input);

		mxEvent.addListener(input, 'input', function()
		{
			fn(input.value);
		});

		mxEvent.addListener(input, 'keydown', function(evt)
		{
			if (evt.key == 'Escape' && input.value != '')
			{
				input.value = '';
				fn('');
				mxEvent.consume(evt);
			}
		});

		field.input = input;

		return field;
	},
	/**
	 * Returns the glyph of the kind of the given cell.
	 */
	createGlyph: function(ui, cell)
	{
		return TextOutlineLayout.createClassicGlyph(ui.getTextOutlineGlyph(cell),
			this.classes.glyph);
	},
	/**
	 * Returns the chevron of the toggle (the window of before).
	 */
	createChevron: function()
	{
		var chevron = document.createElement('img');
		chevron.className = 'geAdaptiveAsset';
		chevron.setAttribute('src', Editor.expandMoreImage);

		return chevron;
	},
	/**
	 * Returns the empty state: the glyph, "No shapes" and one sentence.
	 */
	createEmptyState: function(ui)
	{
		var state = document.createElement('div');
		state.className = 'geTextOutlineEmptyState';
		state.appendChild(TextOutlineLayout.createClassicGlyph('textOutline',
			'geTextOutlineEmptyGlyph'));

		var title = document.createElement('div');
		title.className = 'geTextOutlineEmptyTitle';
		mxUtils.write(title, mxResources.get('noShapes'));
		state.appendChild(title);

		var hint = document.createElement('div');
		hint.className = 'geTextOutlineEmptyHint';
		mxUtils.write(hint, mxResources.get('textOutlineHint'));
		state.appendChild(hint);

		return state;
	},
	/**
	 * Returns the given text lower case without accents (as the search of
	 * Fusion, SimpleUi.normalize).
	 */
	normalize: function(text)
	{
		return MoreShapesDialog.normalize(text);
	},
	/**
	 * The content of the window scrolls.
	 */
	getScroller: function(ui, div)
	{
		return div;
	}
};

/**
 * Returns true if the window of the Text Outline has the layout of Fusion:
 * the feature textOutlineWindow of Editor.featureDefaults
 * (textOutlineWindow in the configuration and the URL), on in Simple (the
 * driver, 20 November 2026), off in Classic, Sketch, Minimal and Atlas. The
 * theme Fusion always has it (its panel, SimplePanels.js).
 */
Editor.isTextOutlineWindowEnabled = function()
{
	return Editor.isFeatureEnabled('textOutlineWindow');
};

/**
 * Returns the skin of the theme: Fusion's (SimplePanels.js) in Fusion, else
 * the Classic skin.
 */
TextOutlineLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		TextOutlineLayout.skins.fusion != null) ? TextOutlineLayout.skins.fusion :
		TextOutlineLayout.skins.classic;
};

/**
 * Returns true if the Text Outline window gets the layout in the Classic
 * skin: the feature is on, the skin is the Classic one (Fusion builds its
 * panel around the window or keeps the window of before where it has no
 * panel) and the view is not chromeless.
 */
EditorUi.prototype.isTextOutlineLayoutInstalled = function()
{
	return !this.editor.isChromelessView() && Editor.isTextOutlineWindowEnabled() &&
		TextOutlineLayout.getSkin() == TextOutlineLayout.skins.classic;
};

/**
 * The number of items of the Text Outline from which it shows a filter.
 */
EditorUi.simpleOutlineFilterMin = 8;

/**
 * The delay of the filter of the Text Outline after a keystroke in
 * milliseconds (it searches the whole tree).
 */
EditorUi.simpleOutlineFilterDelay = 150;

/**
 * Returns the name of the glyph of the kind of the given cell in the Text
 * Outline (TextOutlineLayout.glyphs, the keys of SimpleUi.icons), in the
 * order of Graph.getCellTypeName.
 */
EditorUi.prototype.getTextOutlineGlyph = function(cell)
{
	var graph = this.editor.graph;
	var model = graph.getModel();
	var style = graph.getCurrentCellStyle(cell);
	var shape = style[mxConstants.STYLE_SHAPE];

	if (model.isLayer(cell))
	{
		return 'layers';
	}
	else if (model.isEdge(cell))
	{
		return 'connector';
	}
	else if (graph.isTableCell(cell) || graph.isTableRow(cell))
	{
		return 'rect';
	}
	else if (graph.isTable(cell))
	{
		return 'sheet';
	}
	else if (graph.isSwimlane(cell) || graph.isContainer(cell))
	{
		return 'group';
	}
	else if (shape == 'image')
	{
		return 'image';
	}
	else if (mxUtils.getValue(style, 'text', null) != null ||
		(style[mxConstants.STYLE_FILLCOLOR] == mxConstants.NONE &&
		style[mxConstants.STYLE_STROKECOLOR] == mxConstants.NONE))
	{
		return 'text';
	}

	return 'rect';
};

/**
 * Returns the label of the given cell as the text of a field that edits it
 * in place, or null if the label is more than one line of text (markup,
 * entities or line breaks), which the editor on the canvas edits. HTML
 * labels are written back with the text escaped (see
 * setSimpleOutlineLabel).
 */
EditorUi.prototype.getSimpleOutlineLabel = function(cell)
{
	var graph = this.editor.graph;
	var value = String(graph.convertValueToString(cell) || '');

	if (graph.isHtmlLabel(cell))
	{
		return (mxUtils.getValue(graph.getCurrentCellStyle(cell), 'html', '0') != '0' &&
			!/[<&\n\r]/.test(value)) ? value : null;
	}
	else
	{
		return (!/[\n\r]/.test(value)) ? value : null;
	}
};

/**
 * Writes the given text as the label of the given cell like the editor on
 * the canvas (one undoable edit), escaped in HTML labels.
 */
EditorUi.prototype.setSimpleOutlineLabel = function(cell, text)
{
	var graph = this.editor.graph;
	graph.labelChanged(cell, (graph.isHtmlLabel(cell)) ?
		mxUtils.htmlEntities(text, false, false, false) : text);
};

/**
 * Replaces the given name in a row with a field to rename it in place:
 * Enter and leaving the field call fn with the trimmed value, Escape
 * and a value that was not changed restore the name (fn is called with
 * null, so a value with spaces at its ends is not trimmed by a blur
 * without an edit). The keys stay in the field. className is the class of
 * the field (default geSmInlineField, the field of Fusion).
 */
EditorUi.prototype.startSimpleRename = function(name, value, label, fn, className)
{
	var input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.className = (className != null) ? className : 'geSmInlineField';
	input.setAttribute('aria-label', label);
	input.setAttribute('spellcheck', 'false');
	input.value = value;
	name.style.display = 'none';
	name.parentNode.insertBefore(input, name.nextSibling);
	var done = false;

	var stop = function(apply)
	{
		if (!done)
		{
			done = true;
			var focused = document.activeElement == input;

			if (input.parentNode != null)
			{
				input.parentNode.removeChild(input);
			}

			name.style.display = '';
			fn((apply && input.value != value) ? mxUtils.trim(input.value) : null, focused);
		}
	};

	mxEvent.addListener(input, 'keydown', function(evt)
	{
		if (evt.keyCode == 13 /* Enter */ || evt.keyCode == 27 /* Escape */)
		{
			stop(evt.keyCode == 13);
			mxEvent.consume(evt);
		}
		else
		{
			evt.stopPropagation();
		}
	});

	mxEvent.addListener(input, 'blur', function()
	{
		stop(true);
	});

	// Clicks and drags in the field do not reach the row
	mxEvent.addListener(input, 'click', function(evt)
	{
		evt.stopPropagation();
	});

	mxEvent.addListener(input, 'dblclick', function(evt)
	{
		evt.stopPropagation();
	});

	input.focus();
	input.select();

	return input;
};

/**
 * The Text Outline in the given skin (concept: Text Outline as a panel): the
 * tree of the layers, containers, shapes and connectors as rows like the
 * layers, with the kind of each cell as a glyph, a filter for long trees,
 * and the label edited in place. It is the same ARIA tree as the window of
 * the previous look (TextOutlineWindow): one tab stop, the arrow keys,
 * Space selects, Enter and Escape go to the diagram, typing goes to the
 * next item that starts with the typed text. It listens to the model and
 * refreshes only while it is active. Returns {div, refresh, focus,
 * setActive, destroy}.
 */
EditorUi.prototype.createTextOutlineLayout = function(skin)
{
	var ui = this;
	var graph = this.editor.graph;
	var model = graph.getModel();
	var classes = skin.classes;
	var maxItems = TextOutlineWindow.maxItems;
	var collapsed = Object.create(null);
	var items = Object.create(null);
	var selected = [];
	var active = false;
	var dirty = true;
	var thread = null;
	var entry = null;
	var editing = null;
	var editField = null;
	var filter = '';
	var search = '';
	var searchTime = 0;

	var div = document.createElement('div');
	TextOutlineLayout.addClasses(div, classes.content);

	// The whole tree of the filter with the row and the normalized text
	// of each item, kept between keystrokes until the next change
	// (schedule), and the delay of the filter after a keystroke
	var parsed = null;
	var filterThread = null;

	var applyFilter = function(value)
	{
		window.clearTimeout(filterThread);
		filterThread = null;

		if (filter != value)
		{
			filter = value;
			maxItems = TextOutlineWindow.maxItems;
			refresh();

			// The focus stays in the search, so screen readers hear that
			// nothing was found from the live region (the note is not one)
			if (filter != '' && active && editing == null && tree.firstChild == null)
			{
				ui.announce(mxResources.get('noResultsFor', [filter]));
			}
		}
	};

	var searchField = skin.createSearchField(mxResources.get('search'), function(value)
	{
		window.clearTimeout(filterThread);

		if (value == '')
		{
			applyFilter(value);
		}
		else
		{
			filterThread = window.setTimeout(function()
			{
				applyFilter(value);
			}, EditorUi.simpleOutlineFilterDelay);
		}
	});

	TextOutlineLayout.addClasses(searchField, classes.filter);
	div.appendChild(searchField);

	var tree = document.createElement('ul');
	TextOutlineLayout.addClasses(tree, classes.tree);
	tree.setAttribute('role', 'tree');
	tree.setAttribute('aria-label', mxResources.get('textOutline'));
	tree.setAttribute('aria-multiselectable', 'true');
	tree.setAttribute('tabindex', '-1');
	div.appendChild(tree);

	// Goes on with the first new item
	var moreButton = document.createElement('button');
	moreButton.setAttribute('type', 'button');
	TextOutlineLayout.addClasses(moreButton, classes.more);
	mxUtils.write(moreButton, mxResources.get('showMore'));

	mxEvent.addListener(moreButton, 'click', function(evt)
	{
		var count = getVisibleItems().length;
		maxItems += TextOutlineWindow.maxItems;
		refresh();

		var next = getVisibleItems()[count];

		if (next != null)
		{
			setEntry(next);
			next.focus();
		}

		mxEvent.consume(evt);
	});

	div.appendChild(moreButton);

	var note = document.createElement('div');
	TextOutlineLayout.addClasses(note, classes.note);
	div.appendChild(note);

	var empty = document.createElement('div');
	TextOutlineLayout.addClasses(empty, classes.empty);
	div.appendChild(empty);

	// Returns the item of the given element
	var getItem = function(elt)
	{
		while (elt != null && elt != tree)
		{
			if (elt.nodeType == mxConstants.NODETYPE_ELEMENT &&
				elt.getAttribute('role') == 'treeitem')
			{
				return elt;
			}

			elt = elt.parentNode;
		}

		return null;
	};

	// Returns the items that are not in collapsed groups in their order
	var getVisibleItems = function()
	{
		var result = [];

		var visit = function(ul)
		{
			for (var li = ul.firstChild; li != null; li = li.nextSibling)
			{
				result.push(li);

				if (li.getAttribute('aria-expanded') == 'true')
				{
					visit(li.lastChild);
				}
			}
		};

		visit(tree);

		return result;
	};

	// Returns true if the given item is not in a collapsed group
	var isShown = function(li)
	{
		for (var elt = li.parentNode; elt != null && elt != tree; elt = elt.parentNode)
		{
			if (elt.style.display == 'none')
			{
				return false;
			}
		}

		return elt == tree;
	};

	// Makes the given item the tab stop of the tree
	var setEntry = function(li)
	{
		if (entry != null)
		{
			entry.setAttribute('tabindex', '-1');
		}

		entry = li;

		if (entry != null)
		{
			entry.setAttribute('tabindex', '0');
		}
	};

	// The group of the item is the last child; while the filter has text
	// all groups are open
	var setExpanded = function(li, expanded)
	{
		if (li.getAttribute('aria-expanded') != null)
		{
			li.setAttribute('aria-expanded', (expanded) ? 'true' : 'false');
			li.lastChild.style.display = (expanded) ? '' : 'none';

			if (filter == '')
			{
				collapsed[li.cell.id] = !expanded;
			}
		}
	};

	var toggleExpanded = function(li)
	{
		setExpanded(li, li.getAttribute('aria-expanded') == 'false');
	};

	// Layers have no selection
	var selectItem = function(li, add)
	{
		setEntry(li);
		li.focus();

		if (!model.isLayer(li.cell))
		{
			if (add)
			{
				graph.addSelectionCell(li.cell);
			}
			else
			{
				graph.setSelectionCell(li.cell);
			}

			graph.scrollCellToVisible(li.cell);
		}
	};

	// Edits the label of the item in place, or on the canvas if it is more
	// than one line of text; renames a layer like the Layers panel
	var editItem = function(li)
	{
		var cell = li.cell;

		if (!graph.isEnabled() || editing != null || model.getParent(cell) == null)
		{
			return false;
		}

		var layer = model.isLayer(cell);
		var value = (layer) ? String(graph.convertValueToString(cell) || '') :
			ui.getSimpleOutlineLabel(cell);

		if (!layer && !graph.isCellEditable(cell))
		{
			return false;
		}
		else if (value == null)
		{
			graph.setSelectionCell(cell);
			graph.scrollCellToVisible(cell);
			graph.startEditingAtCell(cell);

			return true;
		}

		var row = li.firstChild;
		var name = row.querySelector('.' + classes.name);
		var meta = row.querySelector('.' + classes.meta);
		editing = cell;
		setEntry(li);

		if (meta != null)
		{
			meta.style.display = 'none';
		}

		// The field is in the row, which is hidden from screen readers
		// as the item has the name
		row.removeAttribute('aria-hidden');

		var input = ui.startSimpleRename(name, value, mxResources.get((layer) ? 'renameIt' : 'editLabelOf',
			[li.getAttribute('aria-label')]), function(text, focused)
		{
			editing = null;
			editField = null;
			row.setAttribute('aria-hidden', 'true');

			if (text != null && model.getParent(cell) != null)
			{
				if (layer)
				{
					if (text != String(graph.convertValueToString(cell) || ''))
					{
						graph.cellLabelChanged(cell, (text.length > 0) ? text :
							mxResources.get('untitledLayer'));
					}
				}
				else if (text != ui.getSimpleOutlineLabel(cell) && graph.isCellEditable(cell))
				{
					ui.setSimpleOutlineLabel(cell, text);
				}
			}

			if (meta != null)
			{
				meta.style.display = '';
			}

			refresh();

			// The focus goes back to the item, or where the item is gone
			// (its new label does not match the filter) to the tab stop of
			// the tree, else to the filter
			var next = items[cell.id];

			if (focused)
			{
				if (next != null)
				{
					setEntry(next);
					next.focus();
				}
				else if (entry != null)
				{
					entry.focus();
				}
				else if (searchField.style.display != 'none')
				{
					searchField.input.focus();
				}
				else
				{
					tree.focus();
				}
			}
		}, classes.field);

		if (editing == cell)
		{
			editField = input;
		}

		return true;
	};

	var addText = function(parent, className, text)
	{
		var span = document.createElement('span');
		span.className = className;
		mxUtils.write(span, text);
		parent.appendChild(span);

		return span;
	};

	// The name and what a connector connects (or the label of a
	// connector under its source) for the row of the given cell
	var getRow = function(cell, source)
	{
		if (model.isLayer(cell))
		{
			return {name: graph.getLayerName(cell), meta: '', type: mxResources.get('layer')};
		}
		else
		{
			var label = graph.getPlainLabel(cell, graph.maxDescriptionLabelLength);
			var type = graph.getCellTypeName(cell);

			if (model.isEdge(cell) && source)
			{
				return {name: graph.getCellName(graph.getTerminalForDescription(cell, false)),
					meta: label, type: type};
			}
			else if (model.isEdge(cell))
			{
				return {name: (label.length > 0) ? label : type,
					meta: mxResources.get('connectorFromTo', [
						graph.getCellName(graph.getTerminalForDescription(cell, true)),
						graph.getCellName(graph.getTerminalForDescription(cell, false))]), type: type};
			}
			else
			{
				return {name: (label.length > 0) ? label : type, meta: '', type: type};
			}
		}
	};

	// The name of the item is the description, the row shows the glyph of
	// the kind, the name and what a connector connects (see getRow)
	var createItem = function(cell, parts, level, context)
	{
		var text = graph.getTextOutlineDescription(cell);
		var li = document.createElement('li');
		li.setAttribute('role', 'treeitem');
		li.setAttribute('tabindex', '-1');
		li.setAttribute('aria-label', text);
		TextOutlineLayout.addClasses(li, classes.item);
		li.cell = cell;

		if (model.isLayer(cell))
		{
			TextOutlineLayout.addClasses(li, classes.layer);
		}
		else
		{
			li.setAttribute('aria-selected', (graph.isCellSelected(cell)) ? 'true' : 'false');
		}

		if (context)
		{
			TextOutlineLayout.addClasses(li, classes.context);
		}

		var row = document.createElement('div');
		TextOutlineLayout.addClasses(row, classes.row);
		row.style.paddingLeft = skin.indent(level) + 'px';
		row.setAttribute('aria-hidden', 'true');
		row.setAttribute('title', text);

		var toggle = document.createElement('span');
		TextOutlineLayout.addClasses(toggle, classes.toggle);
		row.appendChild(toggle);
		row.appendChild(skin.createGlyph(ui, cell));
		addText(row, classes.name, parts.name);

		if (parts.meta.length > 0)
		{
			addText(row, classes.meta, parts.meta);
		}

		li.appendChild(row);
		items[cell.id] = li;

		return li;
	};

	// Returns the given nodes of Graph.getTextOutline with their rows and
	// the normalized text that the filter searches
	var parseNodes = function(nodes)
	{
		var result = [];

		for (var i = 0; i < nodes.length; i++)
		{
			var parts = getRow(nodes[i].cell, nodes[i].source);
			result.push({cell: nodes[i].cell, parts: parts, children: parseNodes(nodes[i].children),
				text: skin.normalize(parts.name + ' ' + parts.meta + ' ' + parts.type)});
		}

		return result;
	};

	// Returns the nodes of the given parsed nodes that match the given
	// normalized term or have descendants that match, with their parts
	// and whether they match
	var filterNodes = function(nodes, term)
	{
		var result = [];

		for (var i = 0; i < nodes.length; i++)
		{
			var children = filterNodes(nodes[i].children, term);
			var match = nodes[i].text.indexOf(term) >= 0;

			if (match || children.length > 0)
			{
				result.push({cell: nodes[i].cell, parts: nodes[i].parts, match: match, children: children});
			}
		}

		return result;
	};

	// Adds the items of the given nodes up to the limit of items (count,
	// shapes and connectors as in Graph.getTextOutline, not the layers);
	// returns false if the limit was reached
	var count = 0;

	var addItems = function(nodes, ul, level)
	{
		for (var i = 0; i < nodes.length; i++)
		{
			if (count >= maxItems)
			{
				return false;
			}

			var node = nodes[i];
			var parts = (node.parts != null) ? node.parts : getRow(node.cell, node.source);
			var li = createItem(node.cell, parts, level, node.match === false);
			ul.appendChild(li);

			if (!model.isLayer(node.cell))
			{
				count++;
			}

			if (node.children.length > 0)
			{
				var group = document.createElement('ul');
				group.setAttribute('role', 'group');
				var done = addItems(node.children, group, level + 1);

				li.firstChild.firstChild.appendChild(skin.createChevron());
				li.appendChild(group);
				li.setAttribute('aria-expanded', 'true');
				setExpanded(li, filter != '' || !collapsed[node.cell.id]);

				if (!done)
				{
					return false;
				}
			}
		}

		return true;
	};

	var refresh = function()
	{
		window.clearTimeout(thread);
		thread = null;

		if (!active || editing != null)
		{
			dirty = true;

			return;
		}

		dirty = false;
		var focused = getItem(document.activeElement);
		var focusedId = (focused != null) ? focused.cell.id : null;
		var scroller = skin.getScroller(ui, div);
		var scrollTop = (scroller != null) ? scroller.scrollTop : 0;
		var more = false;
		var total = 0;

		items = Object.create(null);
		tree.textContent = '';
		entry = null;
		count = 0;

		// Parses each label once, as the items name the cells that they
		// connect to (see Graph.cachePlainLabels)
		graph.cachePlainLabels(function()
		{
			if (filter == '')
			{
				var outline = graph.getTextOutline(maxItems);
				more = !addItems(outline.nodes, tree, 0) || outline.count < outline.total;
				total = outline.total;
			}
			else
			{
				// The filter searches the whole tree and shows the
				// matches with the items that contain them
				if (parsed == null)
				{
					var outline = graph.getTextOutline(Infinity);
					parsed = {nodes: parseNodes(outline.nodes), total: outline.total};
				}

				more = !addItems(filterNodes(parsed.nodes, skin.normalize(filter)), tree, 0);
				total = parsed.total;
			}
		});

		searchField.style.display = (total >= EditorUi.simpleOutlineFilterMin ||
			filter != '') ? '' : 'none';
		moreButton.style.display = (more) ? '' : 'none';
		note.innerText = '';

		if (tree.firstChild == null && filter != '')
		{
			mxUtils.write(note, mxResources.get('noResultsFor', [filter]));
		}

		note.style.display = (note.firstChild != null) ? '' : 'none';
		empty.innerText = '';

		if (tree.firstChild == null && filter == '')
		{
			empty.appendChild(skin.createEmptyState(ui));
		}

		empty.style.display = (empty.firstChild != null) ? '' : 'none';
		selected = graph.getSelectionCells();

		// Keeps the focus on the item of the same cell
		var next = (focusedId != null) ? items[focusedId] : null;
		var first = getFirstSelectedItem();
		setEntry((next != null) ? next : ((first != null) ? first : tree.firstChild));

		if (focused != null && entry != null)
		{
			entry.focus();
		}

		if (scroller != null)
		{
			scroller.scrollTop = scrollTop;

			if (skin.updateScroller != null)
			{
				skin.updateScroller(scroller);
			}
		}
	};

	// Items in collapsed groups cannot have the focus, so they are not the
	// tab stop
	var getFirstSelectedItem = function()
	{
		var cells = graph.getSelectionCells();

		for (var i = 0; i < cells.length; i++)
		{
			var li = items[cells[i].id];

			if (li != null && isShown(li))
			{
				return li;
			}
		}

		return null;
	};

	var schedule = function()
	{
		parsed = null;

		if (!active)
		{
			dirty = true;
		}
		else if (thread == null)
		{
			// Once after all changes of an event
			thread = window.setTimeout(refresh, 0);
		}
	};

	var selectionChanged = function()
	{
		if (!active)
		{
			dirty = true;
		}
		else
		{
			for (var i = 0; i < selected.length; i++)
			{
				var li = items[selected[i].id];

				if (li != null)
				{
					li.setAttribute('aria-selected', 'false');
				}
			}

			selected = graph.getSelectionCells();

			for (var i = 0; i < selected.length; i++)
			{
				var li = items[selected[i].id];

				if (li != null)
				{
					li.setAttribute('aria-selected', 'true');
				}
			}

			// Tab goes to the selection unless the tree has the focus
			var first = getFirstSelectedItem();

			if (first != null && getItem(document.activeElement) == null)
			{
				setEntry(first);
			}
		}
	};

	model.addListener(mxEvent.CHANGE, schedule);
	graph.view.addListener(mxEvent.DOWN, schedule);
	graph.view.addListener(mxEvent.UP, schedule);
	graph.getSelectionModel().addListener(mxEvent.CHANGE, selectionChanged);
	this.addListener('lockedChanged', schedule);

	// Hidden tags change no model, they refresh the graph (refreshHiddenTags)
	graph.addListener(mxEvent.REFRESH, schedule);

	// A press in the tree outside the field of an edit keeps the focus in
	// the field, so its blur does not refresh the tree under the pointer
	// and the click reaches the row (see below)
	mxEvent.addListener(tree, 'mousedown', function(evt)
	{
		if (editField != null && !mxUtils.isAncestorNode(editField, mxEvent.getSource(evt)))
		{
			evt.preventDefault();
		}
	});

	// The toggle in front of the glyph expands and collapses; a click
	// outside the field of an edit ends the edit like a blur first and
	// then goes to the row of the same cell in the refreshed tree
	mxEvent.addListener(tree, 'click', function(evt)
	{
		var source = mxEvent.getSource(evt);
		var li = getItem(source);

		if (editField != null && !mxUtils.isAncestorNode(editField, source))
		{
			var id = (li != null) ? li.cell.id : null;
			var toggle = li != null && mxUtils.isAncestorNode(li.firstChild.firstChild, source);

			if (document.activeElement != editField)
			{
				editField.focus();
			}

			editField.blur();
			li = (id != null && editing == null) ? items[id] : null;

			if (li != null && toggle)
			{
				source = li.firstChild.firstChild;
			}
		}

		if (li != null && editing == null)
		{
			if (mxUtils.isAncestorNode(li.firstChild.firstChild, source))
			{
				setEntry(li);
				li.focus();
				toggleExpanded(li);
			}
			else
			{
				selectItem(li, mxEvent.isShiftDown(evt) ||
					mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt));
			}
		}
	});

	// A double click edits the label, or expands and collapses where it
	// cannot be edited
	mxEvent.addListener(tree, 'dblclick', function(evt)
	{
		var source = mxEvent.getSource(evt);
		var li = getItem(source);

		if (li != null && editing == null && !mxUtils.isAncestorNode(li.firstChild.firstChild, source))
		{
			if (!editItem(li))
			{
				toggleExpanded(li);
			}

			mxEvent.consume(evt);
		}
	});

	mxEvent.addListener(tree, 'keydown', function(evt)
	{
		var li = getItem(mxEvent.getSource(evt));

		// The shortcut of the window is only handled in the diagram
		if (evt.keyCode == 85 /* U */ && mxEvent.isAltDown(evt) && mxEvent.isShiftDown(evt) &&
			!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt))
		{
			ui.actions.get('textOutline').funct();
			mxEvent.consume(evt);
		}
		else if (li != null && editing == null && !mxEvent.isAltDown(evt) &&
			!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt))
		{
			var visibleItems = getVisibleItems();
			var index = mxUtils.indexOf(visibleItems, li);
			var expanded = li.getAttribute('aria-expanded');
			var handled = true;
			var next = null;

			if (evt.keyCode == 40 /* Down */)
			{
				next = visibleItems[index + 1];
			}
			else if (evt.keyCode == 38 /* Up */)
			{
				next = visibleItems[index - 1];
			}
			else if (evt.keyCode == 36 /* Home */)
			{
				next = visibleItems[0];
			}
			else if (evt.keyCode == 35 /* End */)
			{
				next = visibleItems[visibleItems.length - 1];
			}
			else if (evt.keyCode == 39 /* Right */)
			{
				if (expanded == 'false')
				{
					setExpanded(li, true);
				}
				else if (expanded == 'true')
				{
					next = li.lastChild.firstChild;
				}
			}
			else if (evt.keyCode == 37 /* Left */)
			{
				if (expanded == 'true')
				{
					setExpanded(li, false);
				}
				else
				{
					next = getItem(li.parentNode);
				}
			}
			else if (evt.keyCode == 32 /* Space */)
			{
				selectItem(li, mxEvent.isShiftDown(evt));
			}
			else if (evt.keyCode == 113 /* F2 */)
			{
				handled = editItem(li);
			}
			else if (evt.keyCode == 13 /* Enter */ || evt.keyCode == 27 /* Escape */)
			{
				graph.container.focus();
			}
			else if (evt.key != null && evt.key.length == 1 && evt.key != ' ')
			{
				// Goes to the next item that starts with the typed characters
				var now = Date.now();
				search = ((now - searchTime < 1000) ? search : '') + evt.key.toLowerCase();
				searchTime = now;

				for (var i = 1; i <= visibleItems.length && next == null; i++)
				{
					var temp = visibleItems[(index + ((search.length > 1) ? i - 1 : i)) % visibleItems.length];

					if (temp.getAttribute('aria-label').toLowerCase().substring(0, search.length) == search)
					{
						next = temp;
					}
				}
			}
			else
			{
				handled = false;
			}

			if (next != null)
			{
				selectItem(next, mxEvent.isShiftDown(evt));
			}

			if (handled)
			{
				mxEvent.consume(evt);
			}
		}
	});

	// Down in the filter goes to the first item
	mxEvent.addListener(searchField.input, 'keydown', function(evt)
	{
		// The words typed in the delay of the filter apply first
		if (evt.keyCode == 40 /* Down */ && filterThread != null)
		{
			applyFilter(searchField.input.value);
		}

		if (evt.keyCode == 40 /* Down */ && entry != null)
		{
			entry.focus();
			mxEvent.consume(evt);
		}
	});

	return {div: div, refresh: refresh,
		focus: function()
		{
			if (dirty)
			{
				refresh();
			}

			if (entry != null)
			{
				entry.focus();
			}
			else
			{
				tree.focus();
			}
		},
		setActive: function(value)
		{
			if (active != value)
			{
				active = value;

				if (active)
				{
					if (dirty)
					{
						refresh();
					}
				}
				else if (document.activeElement == null || document.activeElement == document.body ||
					mxUtils.isAncestorNode(div, document.activeElement))
				{
					// Keeps the focus of the keyboard if the panel is hidden
					graph.container.focus();
				}
			}
		},
		destroy: function()
		{
			active = false;
			window.clearTimeout(thread);
			window.clearTimeout(filterThread);
			parsed = null;
			model.removeListener(schedule);
			graph.view.removeListener(schedule);
			graph.removeListener(schedule);
			ui.removeListener(schedule);
			graph.getSelectionModel().removeListener(selectionChanged);
		}};
};

/**
 * Builds the given Text Outline window (wnd, a TextOutlineWindow) around the
 * layout in the Classic skin: an mxWindow with the settings of the window of
 * before, which refreshes and listens to the model only while it is shown.
 * The action calls focus when it is shown.
 */
EditorUi.prototype.createTextOutlineWindow = function(wnd, x, y, w, h)
{
	var layout = this.createTextOutlineLayout(TextOutlineLayout.skins.classic);
	wnd.layout = layout;
	wnd.window = new mxWindow(mxResources.get('textOutline'), layout.div, x, y, w, h, true, true);
	wnd.window.minimumSize = new mxRectangle(0, 0, 180, 120);
	wnd.window.destroyOnClose = false;
	wnd.window.setMaximizable(false);
	wnd.window.setResizable(true);
	wnd.window.setClosable(true);

	wnd.window.addListener(mxEvent.SHOW, function()
	{
		layout.setActive(true);
		wnd.window.fit();
	});

	// Keeps the focus of the keyboard if the window is hidden
	wnd.window.addListener(mxEvent.HIDE, function()
	{
		layout.setActive(false);
	});

	this.installResizeHandler(wnd, true, function()
	{
		layout.destroy();
	});

	wnd.focus = layout.focus;
};

/**
 * The window of the Text Outline gets the layout in the Classic skin where
 * it is installed (see isTextOutlineLayoutInstalled), else it is the window
 * of before. The wrapper has the prototype and the statics of the class, so
 * code that reads them (eg. TextOutlineWindow.maxItems) is unchanged.
 */
(function()
{
	var textOutlineWindow = TextOutlineWindow;

	TextOutlineWindow = function(editorUi, x, y, w, h)
	{
		if (editorUi != null && typeof editorUi.isTextOutlineLayoutInstalled === 'function' &&
			editorUi.isTextOutlineLayoutInstalled())
		{
			editorUi.createTextOutlineWindow(this, x, y, w, h);
		}
		else
		{
			textOutlineWindow.apply(this, arguments);
		}
	};

	TextOutlineWindow.prototype = textOutlineWindow.prototype;

	for (var key in textOutlineWindow)
	{
		if (Object.prototype.hasOwnProperty.call(textOutlineWindow, key))
		{
			TextOutlineWindow[key] = textOutlineWindow[key];
		}
	}
})();
