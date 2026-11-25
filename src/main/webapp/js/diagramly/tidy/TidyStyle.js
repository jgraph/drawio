/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Style My Diagram: styles the page or the selection by the kind of the
 * diagram (see Tidy.plan) with the palettes of the color schemes of the
 * Style tab and of the diagram themes (Editor.styles), as one undoable
 * edit with the palettes as alternatives (see Tidy.style).
 *
 * - Mind maps: a dark root, a color per branch (strong for the first level,
 *   light pills below), connectors in the color of their branch.
 * - Flowcharts and other graphs: a color per role of the shape (terminal,
 *   process, decision, data, input/output), one size per role, one font,
 *   rounded processes and rounded connectors with label gaps. The role
 *   colors are also style rules of the page (property @role, the role style
 *   key of the shapes), so the Style Rules dialog shows and edits them.
 * - Cloud and network diagrams: one size for the icons and their labels
 *   below, one color and width for the connectors. The colors of the icons
 *   are never changed.
 *
 * Keep my colors (off by default in the panels, an option keepColors that is
 * not given is on) keeps every color the user chose. Without it, the colors
 * the user chose are mapped to the palette (each color to one color of the
 * palette), so shapes that had the same color still have the same color.
 * Style never rearranges the diagram: it removes the overlaps that new sizes
 * cause and routes connectors that cross shapes.
 * Locked cells, cells with tidy=0, containers and the inside of layout
 * containers keep their styles, and their looks if they have a role whose
 * rule changes (see keepFixedRoleColors) until Style styles them again (see
 * restoreKeptRoleValues). Values of the role key that are
 * no roles of Style belong to other writers and are never changed.
 *
 * In Simple Modern the alternatives are the named themes Calm, Bold, Mono and
 * Sketch of Editor.styleThemes (app.min.js; Calm is Editor.calmStyles, the
 * style of new shapes): shapes get the colors of the kind of their role, and
 * nothing is applied before a theme is picked (see getThemes, styleTheme).
 *
 * In extensions.min.js.
 */
/**
 * Default text color of styled shapes and connectors.
 */
Tidy.textColor = '#1A1A1A';
Tidy.edgeColor = '#4D4D4D';

/**
 * Index of the color of each role in a palette.
 */
Tidy.roleSlots = {process: 0, terminal: 1, data: 2, decision: 3, other: 4, io: 5};

/**
 * Name of the style key of the role of a shape and of the property of the
 * style rules that read it (see Graph.getStyleRuleValue).
 */
Tidy.roleKey = 'role';
Tidy.roleProperty = '@role';

/**
 * Key of the style that holds the colors of the role that a cell got (the
 * base of the rule of its role, see Graph.getStyleRuleBase).
 */
Tidy.roleBaseKey = 'roleBase';

/**
 * Key of the style that holds the values that a cell Style must not change
 * kept as its own values when new rules of its role were written (see
 * keepFixedRoleColors), encoded like the base (see
 * Graph.encodeStyleRuleBase). They are values of its role, not values the
 * user chose (see hasRole), and go back to the rules of its role when Style
 * styles the cell again (see restoreKeptRoleValues).
 */
Tidy.roleKeptKey = 'roleKept';

/**
 * Returns the values of the given cell that Style kept (see roleKeptKey) as
 * an object {key: value} without a prototype. Only keys that rules can set
 * (Graph.dataStyleKeys) are returned, and pairs that are not encoded are
 * ignored.
 */
Tidy.getKeptRoleValues = function(graph, cell)
{
	var value = Tidy.getOwnStyle(graph, cell)[Tidy.roleKeptKey];
	var result = Object.create(null);

	if (typeof value === 'string' && Graph.dataStyleKeys != null)
	{
		var tokens = value.split(',');

		for (var i = 0; i < tokens.length; i++)
		{
			var j = tokens[i].indexOf(':');

			if (j > 0)
			{
				try
				{
					var key = decodeURIComponent(tokens[i].substring(0, j));

					if (Object.prototype.hasOwnProperty.call(Graph.dataStyleKeys, key))
					{
						result[key] = decodeURIComponent(tokens[i].substring(j + 1));
					}
				}
				catch (e)
				{
					// Ignores pairs that are not encoded
				}
			}
		}
	}

	return result;
};

/**
 * Returns true if the given value of the role key is a role of Style My
 * Diagram (see roleKinds). Other values belong to other writers, so Style
 * neither changes nor removes them and their shapes have no role.
 */
Tidy.isRole = function(value)
{
	return typeof value === 'string' && Object.prototype.hasOwnProperty.call(Tidy.roleKinds, value);
};

/**
 * Returns the RGB values of the given #rgb or #rrggbb color or null.
 */
Tidy.parseColor = function(color)
{
	var m = (typeof color === 'string') ? /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color) : null;

	if (m == null)
	{
		return null;
	}

	var hex = m[1];

	if (hex.length == 3)
	{
		hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) +
			hex.charAt(2) + hex.charAt(2);
	}

	return [parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16),
		parseInt(hex.substring(4, 6), 16)];
};

/**
 * Returns the given RGB values as #RRGGBB.
 */
Tidy.formatColor = function(rgb)
{
	var hex = '#';

	for (var i = 0; i < 3; i++)
	{
		var v = Math.max(0, Math.min(255, Math.round(rgb[i]))).toString(16).toUpperCase();
		hex += (v.length < 2) ? '0' + v : v;
	}

	return hex;
};

/**
 * Returns the relative luminance of the given RGB values (WCAG).
 */
Tidy.getLuminance = function(rgb)
{
	var c = [];

	for (var i = 0; i < 3; i++)
	{
		var v = rgb[i] / 255;
		c.push((v <= 0.03928) ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
	}

	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

/**
 * Returns the contrast ratio of the given RGB values (WCAG).
 */
Tidy.getContrast = function(a, b)
{
	var la = Tidy.getLuminance(a), lb = Tidy.getLuminance(b);

	return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/**
 * Returns the given color mixed with the given share of white (0..1).
 */
Tidy.mix = function(rgb, white)
{
	return [rgb[0] + (255 - rgb[0]) * white, rgb[1] + (255 - rgb[1]) * white,
		rgb[2] + (255 - rgb[2]) * white];
};

/**
 * Returns the given color darkened until white text on it has a contrast of
 * at least 4.5.
 */
Tidy.getStrongColor = function(rgb)
{
	var white = [255, 255, 255];

	for (var i = 0; i < 20 && Tidy.getContrast(rgb, white) < 4.5; i++)
	{
		rgb = [rgb[0] * 0.9, rgb[1] * 0.9, rgb[2] * 0.9];
	}

	return rgb;
};

/**
 * Returns a palette slot {fill, stroke, font, strong, light} for the given
 * entry of a color scheme {fill, stroke, font} or null if it has no color.
 * Grays are no colors unless gray is true (the Mono theme).
 */
Tidy.createSlot = function(entry, gray)
{
	var fill = Tidy.parseColor(entry.fill);
	var stroke = Tidy.parseColor(entry.stroke);

	if (fill == null)
	{
		return null;
	}

	// Grays are no colors for roles and branches
	var spread = Math.max(fill[0], fill[1], fill[2]) - Math.min(fill[0], fill[1], fill[2]);

	if (spread < 12 && !gray)
	{
		return null;
	}

	var light = Tidy.getLuminance(fill) > 0.45;
	var base = (light && stroke != null) ? stroke : fill;
	var strong = Tidy.getStrongColor(base);
	var font = Tidy.parseColor(entry.font);

	if (font == null)
	{
		font = (light) ? Tidy.parseColor(Tidy.textColor) : [255, 255, 255];
	}

	return {fill: Tidy.formatColor(fill), stroke: Tidy.formatColor((stroke != null) ? stroke : strong),
		font: Tidy.formatColor(font), strong: Tidy.formatColor(strong),
		light: Tidy.formatColor((light) ? fill : Tidy.mix(fill, 0.8))};
};

/**
 * Returns the palettes of Style My Diagram: rows of the color schemes of the
 * Style tab (which can be configured) and a palette of the diagram themes,
 * each {name, slots, root}. Palettes need at least four colors.
 */
Tidy.getPalettes = function()
{
	var palettes = [];
	var schemes = (typeof StyleFormatPanel !== 'undefined' &&
		Array.isArray(StyleFormatPanel.prototype.defaultColorSchemes)) ?
		StyleFormatPanel.prototype.defaultColorSchemes : [];
	var root = Tidy.getRootColors();

	var add = function(name, entries)
	{
		var slots = [];

		for (var i = 0; i < entries.length; i++)
		{
			var slot = (entries[i] != null) ? Tidy.createSlot(entries[i]) : null;

			if (slot != null)
			{
				slots.push(slot);
			}
		}

		if (slots.length >= 4)
		{
			palettes.push({name: name, slots: slots, root: root});
		}
	};

	// Light colors first: they keep text readable in every theme
	var order = [0, 3, 1, 2];

	for (var i = 0; i < order.length && i < 2; i++)
	{
		if (Array.isArray(schemes[order[i]]))
		{
			add('scheme' + order[i], schemes[order[i]]);
		}
	}

	// The light fills of the diagram themes
	if (Array.isArray(Editor.styles))
	{
		var entries = [];

		for (var i = 0; i < Editor.styles.length; i++)
		{
			var theme = Editor.styles[i] || {};
			var vs = theme.vertexStyle || theme.commonStyle;

			if (vs != null && Tidy.parseColor(vs.fillColor) != null &&
				Tidy.getLuminance(Tidy.parseColor(vs.fillColor)) > 0.45)
			{
				var cs = theme.commonStyle || {};
				entries.push({fill: vs.fillColor, stroke: vs.strokeColor || cs.strokeColor,
					font: vs.fontColor || cs.fontColor});
			}
		}

		add('themes', entries);
	}

	for (var i = 2; i < order.length; i++)
	{
		if (Array.isArray(schemes[order[i]]))
		{
			add('scheme' + order[i], schemes[order[i]]);
		}
	}

	if (palettes.length == 0)
	{
		add('default', [{fill: '#dae8fc', stroke: '#6c8ebf'}, {fill: '#d5e8d4', stroke: '#82b366'},
			{fill: '#ffe6cc', stroke: '#d79b00'}, {fill: '#fff2cc', stroke: '#d6b656'},
			{fill: '#f8cecc', stroke: '#b85450'}, {fill: '#e1d5e7', stroke: '#9673a6'}]);
	}

	return palettes.slice(0, 4);
};

/**
 * Returns the colors {fill, font} of the root of mind maps: the darkest fill
 * of the diagram themes (Editor.styles) with white text.
 */
Tidy.getRootColors = function()
{
	var root = {fill: '#182E3E', font: '#FFFFFF'};

	if (Array.isArray(Editor.styles))
	{
		for (var i = 0; i < Editor.styles.length; i++)
		{
			var vs = (Editor.styles[i] != null) ? Editor.styles[i].vertexStyle : null;

			if (vs != null && Tidy.parseColor(vs.fillColor) != null &&
				String(vs.fontColor).toUpperCase() == '#FFFFFF' &&
				Tidy.getLuminance(Tidy.parseColor(vs.fillColor)) < 0.05)
			{
				root = {fill: vs.fillColor, font: '#FFFFFF'};
				break;
			}
		}
	}

	return root;
};

/**
 * Kinds of the themes for the roles of shapes (see getRole; notes are data
 * shapes with a kind of their own, see getThemeRole).
 */
Tidy.roleKinds = {terminal: 'terminator', process: 'process', decision: 'decision', data: 'data',
	io: 'data', note: 'note', other: 'process'};

/**
 * Kinds of the themes in the order of the colors of branches of mind maps
 * and of the swatches of the tiles (the first four).
 */
Tidy.themeKinds = ['process', 'terminator', 'decision', 'data', 'note'];

/**
 * Keys of sketches that the themes set (Sketch) or remove (the others).
 */
Tidy.sketchKeys = ['sketch', 'curveFitting', 'jiggle', 'fillStyle'];

/**
 * Returns the named themes of Style My Diagram (Calm, Bold, Mono, Sketch) in
 * Simple Modern or null. They are Editor.styleThemes of app.min.js (with
 * Calm from Editor.calmStyles), which an older app.min.js does not have: then
 * the palettes are used as before.
 */
Tidy.getThemes = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		Array.isArray(Editor.styleThemes) && Editor.styleThemes.length > 0) ?
		Editor.styleThemes : null;
};

/**
 * Tidy.style takes the option themes (see Tidy.prepareStyle): fusion.min.js
 * checks it, as extensions.min.js may be older than the app.
 */
Tidy.themesOption = true;

/**
 * Returns the palette {name, slots, root, theme} of the given theme: the
 * kinds as slots for the branches of mind maps.
 */
Tidy.createThemePalette = function(theme)
{
	var styles = theme.styles || {};
	var vertex = styles.vertex || {};
	var slots = [];

	for (var i = 0; i < Tidy.themeKinds.length; i++)
	{
		var kind = styles[Tidy.themeKinds[i]];
		var slot = (kind != null) ? Tidy.createSlot({fill: kind.fillColor, stroke: kind.strokeColor,
			font: kind.fontColor || vertex.fontColor}, true) : null;

		if (slot != null)
		{
			slots.push(slot);
		}
	}

	return {name: theme.id, slots: slots, root: Tidy.getRootColors(), theme: theme};
};

/**
 * Returns the themes whose colors are no colors of the user: the themes of
 * Tidy.getThemes and in Fusion the other themes by kind of the Diagram tab
 * and of the configuration (Editor.getAllStyleThemes, which an older
 * app.min.js does not have), so that Keep my colors restyles a page that one
 * of them gave its colors.
 */
Tidy.getKnownThemes = function()
{
	var themes = Tidy.getThemes();

	return (themes != null && typeof Editor.getAllStyleThemes === 'function') ?
		Editor.getAllStyleThemes() : (themes || []);
};

/**
 * Returns the colors of the given theme or of all known themes
 * (Tidy.getKnownThemes) as an object with the colors in upper case (fills,
 * strokes and fonts of the kinds and of the connectors), or only the fills if
 * fills is true.
 */
Tidy.getThemeColors = function(theme, fills)
{
	var themes = (theme != null) ? [theme] : Tidy.getKnownThemes();
	var result = Object.create(null);

	var add = function(color)
	{
		if (typeof color === 'string')
		{
			result[color.toUpperCase()] = true;
		}
	};

	for (var i = 0; i < themes.length; i++)
	{
		var styles = themes[i].styles || {};

		for (var key in styles)
		{
			if (styles[key] != null && (!fills || key != 'edge'))
			{
				add(styles[key].fillColor);

				if (!fills)
				{
					add(styles[key].strokeColor);
					add(styles[key].fontColor);
				}
			}
		}

		if (Array.isArray(themes[i].fills))
		{
			for (var j = 0; j < themes[i].fills.length; j++)
			{
				add(themes[i].fills[j]);
			}
		}
	}

	if (!fills)
	{
		add(Tidy.edgeColor);
	}

	return result;
};

/**
 * Returns true if the given color is one the user chose and not a color of
 * a theme (which an earlier Style My Diagram or new shapes wrote).
 */
Tidy.isUserThemeColor = function(color, themeColors)
{
	return Tidy.isUserColor(color) && !themeColors[String(color).toUpperCase()];
};

/**
 * Returns the ID of the theme of the given shapes or null: the theme with the
 * most shapes with its fills if they are at least half of the shapes (a page
 * whose shapes have Calm fills is Calm).
 */
Tidy.getCurrentTheme = function(graph, cells, themes)
{
	var best = null;
	var max = 0;

	for (var i = 0; i < themes.length; i++)
	{
		var fills = Tidy.getThemeColors(themes[i], true);
		var count = 0;

		for (var j = 0; j < cells.length; j++)
		{
			var fill = Tidy.getOwnStyle(graph, cells[j])[mxConstants.STYLE_FILLCOLOR];

			if (Tidy.isUserColor(fill) && fills[String(fill).toUpperCase()])
			{
				count++;
			}
		}

		if (count > max)
		{
			max = count;
			best = themes[i].id;
		}
	}

	return (max > 0 && max * 2 >= cells.length) ? best : null;
};

/**
 * Returns the colors of the swatch of the given theme: [{fill, stroke}] of
 * the first four kinds.
 */
Tidy.getThemeSwatch = function(theme)
{
	var styles = theme.styles || {};
	var result = [];

	for (var i = 0; i < 4; i++)
	{
		var kind = styles[Tidy.themeKinds[i]] || {};
		result.push({fill: kind.fillColor, stroke: kind.strokeColor});
	}

	return result;
};

/**
 * Returns the role of the given shape for a theme: notes have their own.
 */
Tidy.getThemeRole = function(graph, cell)
{
	var role = Tidy.getRole(graph, cell);

	return (role == 'data' && graph.getCellStyle(cell)['shape'] == 'note') ? 'note' : role;
};

/**
 * Returns the keys of the given theme for shapes of the given kind: the
 * colors of the kind, the line width and the keys of sketches (removed by
 * the themes without them).
 */
Tidy.getThemeKeys = function(theme, kind)
{
	var styles = theme.styles || {};
	var vertex = styles.vertex || {};
	var entry = styles[kind] || styles.process || {};
	var keys = {fillColor: entry.fillColor, strokeColor: entry.strokeColor,
		fontColor: entry.fontColor || vertex.fontColor || Tidy.textColor, gradientColor: null};

	if (vertex.strokeWidth != null)
	{
		keys[mxConstants.STYLE_STROKEWIDTH] = vertex.strokeWidth;
	}

	for (var i = 0; i < Tidy.sketchKeys.length; i++)
	{
		keys[Tidy.sketchKeys[i]] = (vertex[Tidy.sketchKeys[i]] != null) ? vertex[Tidy.sketchKeys[i]] : null;
	}

	return keys;
};

/**
 * Returns true if the given theme makes labels bold.
 */
Tidy.isBoldTheme = function(theme)
{
	var vertex = (theme != null && theme.styles != null) ? theme.styles.vertex : null;

	return vertex != null && (parseInt(vertex.fontStyle) & mxConstants.FONT_BOLD) != 0;
};

/**
 * Returns the role of the given shape in a flowchart: terminal, process,
 * decision, data, io or other.
 */
Tidy.getRole = function(graph, cell)
{
	var style = graph.getCellStyle(cell);
	var shape = String(style['shape'] || '');
	var raw = graph.model.getStyle(cell) || '';
	var fc = /^mxgraph\.flowchart\.(.*)$/.exec(shape);

	if (fc != null)
	{
		var n = fc[1];

		if (n == 'decision')
		{
			return 'decision';
		}
		else if (/terminator|start|on-page_reference|off-page_reference/.test(n))
		{
			return 'terminal';
		}
		else if (/document|database|stored_data|direct_data|merge_or_storage|extract_or_measurement|sequential_data|multi-document/.test(n))
		{
			return 'data';
		}
		else if (/data|manual_input|paper_tape|card|display/.test(n))
		{
			return 'io';
		}

		return 'process';
	}
	else if (shape == 'rhombus' || /^rhombus(;|$)/.test(raw))
	{
		return 'decision';
	}
	else if (shape == 'ellipse' || shape == 'doubleEllipse' || shape == 'terminator' ||
		/^ellipse(;|$)/.test(raw) || (style['rounded'] == '1' && parseFloat(style['arcSize']) >= 40))
	{
		return 'terminal';
	}
	else if (shape == 'parallelogram' || shape == 'manualInput')
	{
		return 'io';
	}
	else if (shape == 'document' || shape == 'cylinder' || shape == 'cylinder3' ||
		shape == 'datastore' || shape == 'tape' || shape == 'note')
	{
		return 'data';
	}
	else if (shape == '' || shape == 'rect' || shape == 'rectangle' || shape == 'label' ||
		shape == 'process' || shape == 'mxgraph.basic.rect' || shape == 'step' ||
		shape == 'card' || shape == 'hexagon')
	{
		return 'process';
	}

	return 'other';
};

/**
 * Returns true if the given color is one the user chose (not empty, none,
 * default, white or black).
 */
Tidy.isUserColor = function(color)
{
	var c = (color != null) ? String(color).toLowerCase() : '';

	return c != '' && c != 'none' && c != 'default' && c != 'inherit' &&
		c != '#ffffff' && c != '#fff' && c != 'white' && c != '#000000' &&
		c != '#000' && c != 'black' && c != 'transparent';
};

/**
 * Returns the keys of the style string of the given cell (not resolved, so
 * default colors of the theme are not colors of the user).
 */
Tidy.getOwnStyle = function(graph, cell)
{
	return TidyFeatures.parseStyle(graph.model.getStyle(cell));
};

/**
 * Returns true if the colors of the given cell are the colors of its role
 * from an earlier Style My Diagram: it has the role key and still the fill
 * of its role or the fill that Style kept when the rule of its role changed
 * (see keepFixedRoleColors). A fill set later, by any client, is a color the
 * user chose (see setRole). Cells without the colors of their role count as
 * styled. A role key of another writer (see isRole) is no role.
 */
Tidy.hasRole = function(graph, cell)
{
	var own = Tidy.getOwnStyle(graph, cell);
	var role = Tidy.isRole(own[Tidy.roleKey]);
	var base = (role && typeof graph.getStyleRuleBase === 'function') ?
		graph.getStyleRuleBase(cell, Tidy.roleProperty) : null;
	var fill = own[mxConstants.STYLE_FILLCOLOR];
	var kept = (role && base != null && own[Tidy.roleKeptKey] != null) ?
		Tidy.getKeptRoleValues(graph, cell)[mxConstants.STYLE_FILLCOLOR] : null;

	return role && (base == null || base[mxConstants.STYLE_FILLCOLOR] == null ||
		fill == base[mxConstants.STYLE_FILLCOLOR] || (kept != null && fill == kept));
};

/**
 * Gives the given cells the given role, or none if role is null, and records
 * the given colors {key: value} that they got for it (roleBaseKey). The rule
 * of the role sets a color only while a cell still has that color, so a
 * color set later on a cell, by any part of the app or by a release without
 * the rules, wins over the rule (Graph.getStyleRuleBase, applyStyleRules).
 * Cells with a role key of another writer (see isRole) keep it and their
 * base, so they get the colors but no role.
 */
Tidy.setRole = function(graph, cells, role, colors)
{
	var target = [];

	for (var i = 0; i < cells.length; i++)
	{
		var current = Tidy.getOwnStyle(graph, cells[i])[Tidy.roleKey];

		if (current == null || Tidy.isRole(current))
		{
			target.push(cells[i]);
		}
	}

	if (target.length > 0)
	{
		graph.setCellStyles(Tidy.roleKey, role, target);
		graph.setCellStyles(Tidy.roleBaseKey, (role != null && colors != null &&
			typeof Graph.encodeStyleRuleBase === 'function') ?
			Graph.encodeStyleRuleBase(colors) : null, target);
	}
};

/**
 * Returns the cells of the page with a role (see isRole) that are not in
 * the given styled cells, with the values that the rules of the page set
 * for them: [{cell, values}]. These are the cells that Style must not
 * change (locked cells, cells with tidy=0, the inside of groups, containers
 * and layout containers, shapes behind others and the cells of other
 * layers), which the new rules of their roles would recolor (see
 * keepFixedRoleColors).
 */
Tidy.getFixedRoleCells = function(graph, styled)
{
	var model = graph.model;
	var skip = Object.create(null);
	var result = [];

	if (typeof graph.applyStyleRules !== 'function' || typeof graph.getStyleRuleBase !== 'function' ||
		typeof Graph.encodeStyleRuleBase !== 'function')
	{
		return result;
	}

	for (var i = 0; i < styled.length; i++)
	{
		skip[styled[i].id] = true;
	}

	for (var id in model.cells)
	{
		var cell = model.cells[id];
		var style = model.getStyle(cell);

		if (!skip[id] && model.isVertex(cell) && typeof style === 'string' &&
			style.indexOf(Tidy.roleKey + '=') >= 0 &&
			Tidy.isRole(Graph.getOwnStyleValue(style, Tidy.roleKey)))
		{
			result.push({cell: cell, values: Tidy.getRuleValues(graph, cell)});
		}
	}

	return result;
};

/**
 * Returns the values that the rules of the page, or only those of the given
 * property, set for the given cell as an object {key: value} (see
 * Graph.getStyleRuleKeys).
 */
Tidy.getRuleValues = function(graph, cell, property)
{
	var style = Object.create(null);
	var rules = graph.getStyleRules();

	if (property != null)
	{
		rules = rules.filter(function(rule)
		{
			return rule.property == property;
		});
	}

	if (rules.length > 0 && graph.getCurrentCellStyle(cell)['styleRules'] != '0')
	{
		graph.applyStyleRules(cell, style, rules);
	}

	return style;
};

/**
 * Keeps the looks of the given cells that Style must not change (see
 * getFixedRoleCells) after new rules of their roles were written, for each
 * key that the rules now set to another value or no longer set:
 * - If a rule of a role sets it now, the value of that rule becomes its
 *   base, so the rule does not set it (see Graph.applyStyleRules), and the
 *   value that a rule set before, if any, its own value.
 * - If no rule sets it now (the old rule of the role set more keys than the
 *   new one), the value that the old rule set becomes its own value, and the
 *   value it had before, if any, its base (none removes the key from the base).
 * - If a rule of another property sets it now (setRoleRules puts the rules
 *   of roles last, so the rules of the user win), nothing is written.
 * So the cell looks as before and keeps its role, and its base holds only
 * values of rules of roles and the values the cell had for keys that no rule
 * sets now. The values that a rule set before are recorded as kept values
 * (see roleKeptKey), so they are no colors of the user, and their base is
 * what the cell gets back when Style styles it again (see
 * restoreKeptRoleValues).
 */
Tidy.keepFixedRoleColors = function(graph, fixed)
{
	for (var i = 0; i < fixed.length; i++)
	{
		var cell = fixed[i].cell;
		var before = fixed[i].values;
		var after = Tidy.getRuleValues(graph, cell);
		var roles = Tidy.getRuleValues(graph, cell, Tidy.roleProperty);
		var keys = Object.keys(before).concat(Object.keys(after));
		var own = Tidy.getOwnStyle(graph, cell);
		var seen = Object.create(null);
		var base = null;
		var kept = null;

		for (var j = 0; j < keys.length; j++)
		{
			var key = keys[j];

			if (!seen[key] && after[key] !== before[key])
			{
				var role = after[key] != null && after[key] === roles[key];
				seen[key] = true;

				if (role)
				{
					base = base || graph.getStyleRuleBase(cell, Tidy.roleProperty) || Object.create(null);
					base[key] = after[key];
				}

				if ((role || after[key] == null) && before[key] != null && (role || own[key] !== before[key]))
				{
					kept = kept || Tidy.getKeptRoleValues(graph, cell);
					kept[key] = before[key];

					// A key that no rule sets now gets back the value the cell had
					if (!role)
					{
						base = base || graph.getStyleRuleBase(cell, Tidy.roleProperty) || Object.create(null);

						if (own[key] != null)
						{
							base[key] = own[key];
						}
						else
						{
							delete base[key];
						}
					}

					if (own[key] !== before[key])
					{
						graph.setCellStyles(key, before[key], [cell]);
					}
				}
			}
		}

		if (base != null)
		{
			var encoded = Graph.encodeStyleRuleBase(base);
			graph.setCellStyles(Tidy.roleBaseKey, (encoded.length > 0) ? encoded : null, [cell]);
		}

		if (kept != null)
		{
			graph.setCellStyles(Tidy.roleKeptKey, Graph.encodeStyleRuleBase(kept), [cell]);
		}
	}
};

/**
 * Gives the values that Style kept on the given cells (see
 * keepFixedRoleColors) back to the rules of their roles, as Style now
 * styles these cells: a key whose own value is still the kept value gets
 * the value of its base again, or none if the base has none, so the rule of
 * its role sets it (see Graph.applyStyleRules) and the cell looks like the
 * other cells of its role (see hasRole). Values set after Style kept them
 * are values of the user and stay, and the record of the kept values is
 * removed. Does nothing without the style rules (an older app.min.js).
 */
Tidy.restoreKeptRoleValues = function(graph, cells)
{
	if (typeof graph.getStyleRuleBase !== 'function' || typeof Graph.getDataStyleValue !== 'function')
	{
		return;
	}

	for (var i = 0; i < cells.length; i++)
	{
		var own = Tidy.getOwnStyle(graph, cells[i]);

		if (own[Tidy.roleKeptKey] != null)
		{
			var kept = Tidy.getKeptRoleValues(graph, cells[i]);
			var role = Tidy.isRole(own[Tidy.roleKey]);
			var base = (role) ? graph.getStyleRuleBase(cells[i], Tidy.roleProperty) : null;

			for (var key in kept)
			{
				if (role && own[key] === kept[key])
				{
					var value = (base != null && base[key] != null) ? base[key] : null;

					// Only valid values of rules, as the base is not checked when it is
					// decoded and a value with a semicolon would add keys to the style
					if (value == null || Graph.getDataStyleValue(key, value) === value)
					{
						graph.setCellStyles(key, value, [cells[i]]);
					}
				}
			}

			graph.setCellStyles(Tidy.roleKeptKey, null, [cells[i]]);
		}
	}
};

/**
 * Returns the colors the user chose for the fills of the given cells as a
 * map from the color to the cells, ordered by the number of cells. The
 * colors of roles are no colors the user chose.
 */
Tidy.getColorClusters = function(graph, cells)
{
	var clusters = Object.create(null);
	var order = [];

	for (var i = 0; i < cells.length; i++)
	{
		var own = Tidy.getOwnStyle(graph, cells[i]);
		var fill = own[mxConstants.STYLE_FILLCOLOR];

		if (!Tidy.hasRole(graph, cells[i]) && Tidy.isUserColor(fill))
		{
			var key = String(fill).toLowerCase();

			if (!Object.prototype.hasOwnProperty.call(clusters, key))
			{
				clusters[key] = [];
				order.push(key);
			}

			clusters[key].push(cells[i]);
		}
	}

	order.sort(function(a, b)
	{
		return clusters[b].length - clusters[a].length;
	});

	return {map: clusters, order: order};
};

/**
 * Sets the given styles (key: value, null removes) on the given cells.
 */
Tidy.setStyles = function(graph, cells, styles)
{
	if (cells.length > 0)
	{
		for (var key in styles)
		{
			graph.setCellStyles(key, styles[key], cells);
		}
	}
};

/**
 * Resizes the given shape to the given size around its center.
 */
Tidy.resize = function(graph, cell, w, h)
{
	var geo = graph.model.getGeometry(cell);

	if (geo != null && !geo.relative && (Math.abs(geo.width - w) >= 1 ||
		Math.abs(geo.height - h) >= 1))
	{
		geo = geo.clone();
		geo.x = Math.round(geo.x + (geo.width - w) / 2);
		geo.y = Math.round(geo.y + (geo.height - h) / 2);
		geo.width = w;
		geo.height = h;
		graph.model.setGeometry(cell, geo);
	}
};

/**
 * Returns the median of the given numbers.
 */
Tidy.median = function(values)
{
	if (values.length == 0)
	{
		return 0;
	}

	var v = values.slice().sort(function(a, b) { return a - b; });

	return v[Math.floor(v.length / 2)];
};

/**
 * Returns the most frequent value of the given key in the styles of the given
 * cells or the given default value.
 */
Tidy.getCommonValue = function(graph, cells, key, value)
{
	var counts = Object.create(null);
	var best = null;

	for (var i = 0; i < cells.length; i++)
	{
		var v = graph.getCellStyle(cells[i])[key];

		if (v != null && v !== '')
		{
			v = String(v);
			counts[v] = (Object.prototype.hasOwnProperty.call(counts, v)) ? counts[v] + 1 : 1;

			if (best == null || counts[v] > counts[best])
			{
				best = v;
			}
		}
	}

	return (best != null) ? best : value;
};

/**
 * Colors the given cells with the given slot unless they keep their colors.
 */
Tidy.colorCells = function(graph, cells, slot, mode, keep)
{
	var target = [];

	for (var i = 0; i < cells.length; i++)
	{
		if (keep == null || !keep[cells[i].id])
		{
			target.push(cells[i]);
		}
	}

	if (mode == 'strong')
	{
		Tidy.setStyles(graph, target, {fillColor: slot.strong, strokeColor: 'none',
			fontColor: '#FFFFFF', gradientColor: null});
	}
	else if (mode == 'pill')
	{
		Tidy.setStyles(graph, target, {fillColor: slot.light, strokeColor: slot.strong,
			fontColor: Tidy.textColor, gradientColor: null});
	}
	else
	{
		Tidy.setStyles(graph, target, {fillColor: slot.fill, strokeColor: slot.stroke,
			fontColor: slot.font, gradientColor: null});
	}

	return target;
};

/**
 * Returns the IDs of the cells that keep their colors: with keepColors all
 * cells with a fill the user chose and the cells with the colors of a role
 * (which a rule of the page may have changed), else none. Without
 * keepColors the colors the user chose are mapped to the given palette and
 * the returned map has the cells whose colors were mapped (see
 * getColorClusters), and cells of roles get the colors of their role again.
 */
Tidy.mapUserColors = function(graph, cells, palette, keepColors)
{
	var clusters = Tidy.getColorClusters(graph, cells);
	var keep = Object.create(null);

	if (keepColors)
	{
		for (var i = 0; i < cells.length; i++)
		{
			if (Tidy.hasRole(graph, cells[i]))
			{
				keep[cells[i].id] = true;
			}
		}
	}

	for (var i = 0; i < clusters.order.length; i++)
	{
		var list = clusters.map[clusters.order[i]];

		for (var j = 0; j < list.length; j++)
		{
			keep[list[j].id] = true;
		}

		// Two or more colors carry a meaning: each color gets one color of the palette
		if (!keepColors && clusters.order.length >= 2)
		{
			Tidy.colorCells(graph, list, palette.slots[i % palette.slots.length]);
		}
	}

	// A single color is no grouping, the role colors replace it
	if (!keepColors && clusters.order.length < 2)
	{
		keep = Object.create(null);
	}

	return keep;
};

/**
 * Styles a mind map: the root of the largest tree, a color per branch.
 */
Tidy.styleMindmap = function(graph, col, palette, keepColors)
{
	var model = graph.model;
	var st = Tidy.getStructure(graph, col);
	var root = null;

	for (var i = 0; i < st.roots.length; i++)
	{
		if (root == null || st.deg[st.roots[i]] > st.deg[root])
		{
			root = st.roots[i];
		}
	}

	root = (root != null) ? model.getCell(root) : null;

	if (root == null || !col.movable[root.id])
	{
		return 0;
	}

	var keep = Tidy.mapUserColors(graph, col.vertices, palette, keepColors);
	var count = 1;

	var children = function(v)
	{
		var result = [];
		var edges = model.getEdges(v);

		for (var i = 0; i < edges.length; i++)
		{
			if (model.getTerminal(edges[i], true) == v && model.getTerminal(edges[i], false) != null)
			{
				result.push({edge: edges[i], node: model.getTerminal(edges[i], false)});
			}
		}

		return result;
	};

	if (!keep[root.id])
	{
		Tidy.setStyles(graph, [root], {fillColor: palette.root.fill, strokeColor: 'none',
			fontColor: palette.root.font, gradientColor: null});
	}

	Tidy.setStyles(graph, [root], {rounded: '1', arcSize: '40', whiteSpace: 'wrap',
		fontSize: '18', fontStyle: '1', shadow: null});
	var rg = model.getGeometry(root);
	Tidy.resize(graph, root, Math.max(160, Math.round(rg.width / 10) * 10),
		Math.max(60, Math.round(rg.height / 10) * 10));

	var branches = children(root);
	var seen = Object.create(null);
	var vertices = Object.create(null);
	seen[root.id] = true;

	for (var i = 0; i < col.vertices.length; i++)
	{
		vertices[col.vertices[i].id] = true;
	}

	for (var i = 0; i < branches.length; i++)
	{
		var slot = palette.slots[i % palette.slots.length];
		var queue = [{link: branches[i], depth: 1}];

		for (var q = 0; q < queue.length; q++)
		{
			var item = queue[q];
			var node = item.link.node;

			if (node == null || seen[node.id])
			{
				continue;
			}

			seen[node.id] = true;

			if (col.movable[node.id] && vertices[node.id] === true)
			{
				var geo = model.getGeometry(node);
				count++;

				if (item.depth == 1)
				{
					Tidy.colorCells(graph, [node], slot, 'strong', keep);
					Tidy.setStyles(graph, [node], {rounded: '1', arcSize: '40', whiteSpace: 'wrap',
						fontSize: '14', fontStyle: '1', shadow: null});
					Tidy.resize(graph, node, Math.max(120, Math.min(180, Math.round(geo.width / 10) * 10)), 40);
				}
				else
				{
					Tidy.colorCells(graph, [node], slot, 'pill', keep);
					Tidy.setStyles(graph, [node], {rounded: '1', arcSize: '50', whiteSpace: 'wrap',
						fontSize: '12', fontStyle: '0', strokeWidth: '1', shadow: null});
					Tidy.resize(graph, node, Math.max(90, Math.min(160, Math.round(geo.width / 10) * 10)), 30);
				}
			}

			if (col.editable[item.link.edge.id])
			{
				var edgeStyle = {strokeWidth: String(Math.max(1.5, 4 - (item.depth - 1) * 1.25))};

				// Keep my colors keeps the colors of connectors too
				if (!keepColors || !Tidy.isUserColor(Tidy.getOwnStyle(graph,
					item.link.edge)[mxConstants.STYLE_STROKECOLOR]))
				{
					edgeStyle[mxConstants.STYLE_STROKECOLOR] = slot.strong;
				}

				Tidy.setStyles(graph, [item.link.edge], edgeStyle);
			}

			var next = children(node);

			for (var j = 0; j < next.length; j++)
			{
				queue.push({link: next[j], depth: item.depth + 1});
			}
		}
	}

	return count;
};

/**
 * Returns the given cells without the shapes that lie behind others of the
 * given cells (zones and panels: they contain all of a smaller shape of the
 * same parent). Such shapes keep their size and colors, as they are no step
 * of the diagram. Shapes that maxGridChecks leaves unchecked may be backdrops,
 * so they are left out too.
 */
Tidy.withoutBackdrops = function(graph, cells, others)
{
	var model = graph.model;
	var grid = new Tidy.Grid(100);
	var result = [];

	for (var i = 0; i < others.length; i++)
	{
		var geo = model.getGeometry(others[i]);

		if (geo != null)
		{
			grid.add({cell: others[i], geo: geo}, geo.x, geo.y, geo.x + geo.width, geo.y + geo.height);
		}
	}

	for (var i = 0; i < cells.length; i++)
	{
		var geo = model.getGeometry(cells[i]);
		var backdrop = false;
		var cut = false;

		if (geo != null)
		{
			cut = grid.query(geo.x, geo.y, geo.x + geo.width, geo.y + geo.height, function(item)
			{
				var g = item.geo;
				backdrop = item.cell != cells[i] && model.getParent(item.cell) == model.getParent(cells[i]) &&
					geo.width * geo.height >= 1.5 * g.width * g.height && g.x >= geo.x && g.y >= geo.y &&
					g.x + g.width <= geo.x + geo.width && g.y + g.height <= geo.y + geo.height;

				return backdrop;
			}, {});
		}

		if (!backdrop && !cut)
		{
			result.push(cells[i]);
		}
	}

	return result;
};

/**
 * Returns the colors of the rules of the roles of the page as a map from the
 * role to a slot {fill, stroke, font}, with the colors of the given slot for
 * keys the rule does not set (or sets to a color that is no #hex color).
 */
Tidy.getRoleRules = function(graph, fallback)
{
	var result = Object.create(null);
	var json = Tidy.getStyleRulesJson(graph);
	var parsed = null;

	try
	{
		parsed = (json != null) ? JSON.parse(json) : null;
	}
	catch (e)
	{
		// No rules
	}

	var get = function(style, key, value)
	{
		var color = (style != null && typeof style === 'object' &&
			Object.prototype.hasOwnProperty.call(style, key)) ? style[key] : null;

		return (Tidy.parseColor(color) != null) ? color : value;
	};

	if (Array.isArray(parsed))
	{
		for (var i = 0; i < parsed.length; i++)
		{
			var rule = parsed[i];

			if (rule != null && typeof rule === 'object' && rule.property == Tidy.roleProperty &&
				rule.op == '=' && typeof rule.value === 'string' && result[rule.value] == null)
			{
				result[rule.value] = {fill: get(rule.style, mxConstants.STYLE_FILLCOLOR, fallback.fill),
					stroke: get(rule.style, mxConstants.STYLE_STROKECOLOR, fallback.stroke),
					font: get(rule.style, mxConstants.STYLE_FONTCOLOR, fallback.font)};
			}
		}
	}

	return result;
};

/**
 * Styles a flowchart or another graph: role colors, one size per role, one
 * font, rounded processes and connectors. Returns the style rules of the
 * roles (see roleProperty) for the cells that got the color of their role.
 * With keepColors, roles that have a rule keep it and their new cells get
 * its colors. Without writeRules (a selection, whose colors are not those
 * of the rules of the page) the cells get no role and keep their own colors.
 */
Tidy.styleFlowchart = function(graph, col, palette, keepColors, writeRules)
{
	var cells = Tidy.withoutBackdrops(graph, col.vertices, col.vertices.concat(col.texts));
	Tidy.restoreKeptRoleValues(graph, cells);
	var fixed = (writeRules) ? Tidy.getFixedRoleCells(graph, cells) : null;
	var keep = Tidy.mapUserColors(graph, cells, palette, keepColors);
	var byRole = Object.create(null);
	var rules = [];

	for (var i = 0; i < cells.length; i++)
	{
		var role = Tidy.getRole(graph, cells[i]);

		if (byRole[role] == null)
		{
			byRole[role] = [];
		}

		byRole[role].push(cells[i]);
	}

	for (var role in byRole)
	{
		var list = byRole[role];
		var slot = palette.slots[Tidy.roleSlots[role] % palette.slots.length];
		var existing = (keepColors && writeRules) ? Tidy.getRoleRules(graph, slot)[role] : null;
		var colors = (existing != null) ? existing : slot;
		var colored = Tidy.colorCells(graph, list, colors, null, keep);
		var base = {};
		base[mxConstants.STYLE_FILLCOLOR] = colors.fill;
		base[mxConstants.STYLE_STROKECOLOR] = colors.stroke;
		base[mxConstants.STYLE_FONTCOLOR] = colors.font;
		Tidy.setRole(graph, colored, (writeRules) ? role : null, base);

		if (colored.length > 0 && writeRules && existing == null)
		{
			rules.push(Tidy.createRoleRule(role, slot.fill, slot.stroke, slot.font));
		}

		Tidy.resizeRole(graph, role, list);
	}

	Tidy.keepRoleColors(graph, cells, keep, rules);
	Tidy.roundProcesses(graph, byRole.process, '12');
	Tidy.setCommonFont(graph, cells, col.texts);
	Tidy.styleEdges(graph, col, keepColors, true);
	Tidy.writeRoleRules(graph, rules, fixed);

	return rules;
};

/**
 * Keeps the colors of the given cells that keep their colors (keep) under
 * the given new rules of roles: a kept cell with the role key of a new rule
 * whose own fill, stroke or font differs from that rule gets the color of
 * the rule as the base of that key (see setRole), so the rule does not set
 * it (Graph.applyStyleRules sets a key only while the cell still has the
 * value of its base). This covers a role key without a base (written by
 * another app) and the colors of an earlier palette whose rule is gone.
 * Keys without an own value follow the rule, and rules that were on the
 * page before apply as they did.
 */
Tidy.keepRoleColors = function(graph, cells, keep, rules)
{
	if (rules.length == 0 || typeof graph.getStyleRuleBase !== 'function' ||
		typeof Graph.encodeStyleRuleBase !== 'function')
	{
		return;
	}

	var byRole = Object.create(null);
	var keys = [mxConstants.STYLE_FILLCOLOR, mxConstants.STYLE_STROKECOLOR,
		mxConstants.STYLE_FONTCOLOR];

	for (var i = 0; i < rules.length; i++)
	{
		byRole[rules[i].value] = rules[i].style;
	}

	for (var i = 0; i < cells.length; i++)
	{
		var own = (keep[cells[i].id]) ? Tidy.getOwnStyle(graph, cells[i]) : null;
		var rule = (own != null && own[Tidy.roleKey] != null) ? byRole[own[Tidy.roleKey]] : null;

		if (rule != null)
		{
			var base = graph.getStyleRuleBase(cells[i], Tidy.roleProperty) || Object.create(null);
			var changed = false;

			for (var j = 0; j < keys.length; j++)
			{
				var value = own[keys[j]];

				if (value != null && rule[keys[j]] != null && value != rule[keys[j]] &&
					(base[keys[j]] == null || base[keys[j]] == value))
				{
					base[keys[j]] = rule[keys[j]];
					changed = true;
				}
			}

			if (changed)
			{
				graph.setCellStyles(Tidy.roleBaseKey, Graph.encodeStyleRuleBase(base), [cells[i]]);
			}
		}
	}
};

/**
 * Returns the style rule of the given role with the given colors.
 */
Tidy.createRoleRule = function(role, fill, stroke, font)
{
	var style = {};
	style[mxConstants.STYLE_FILLCOLOR] = fill;
	style[mxConstants.STYLE_STROKECOLOR] = stroke;
	style[mxConstants.STYLE_FONTCOLOR] = font;

	return {property: Tidy.roleProperty, op: '=', value: role, style: style};
};

/**
 * Gives the given shapes of the given role one size on the grid (the
 * median), decisions large enough for text. Shapes with a fixed aspect and
 * other shapes keep their size.
 */
Tidy.resizeRole = function(graph, role, list)
{
	if (role != 'other' && list.length > 0)
	{
		var model = graph.model;
		var widths = [], heights = [];

		for (var j = 0; j < list.length; j++)
		{
			var geo = model.getGeometry(list[j]);
			widths.push(geo.width);
			heights.push(geo.height);
		}

		var gs = Math.max(1, graph.gridSize);
		var w = Math.max(80, Math.round(Tidy.median(widths) / gs) * gs);
		var h = Math.max(40, Math.round(Tidy.median(heights) / gs) * gs);

		if (role == 'decision')
		{
			w = Math.max(w, 100);
			h = Math.max(h, 80);
		}

		for (var j = 0; j < list.length; j++)
		{
			var style = graph.getCellStyle(list[j]);

			// Shapes with a fixed aspect keep it
			if (style['aspect'] != 'fixed')
			{
				Tidy.resize(graph, list[j], w, h);
			}
		}
	}
};

/**
 * Rounds the plain rectangles of the given processes with the given arc size.
 */
Tidy.roundProcesses = function(graph, list, arcSize)
{
	if (list != null)
	{
		var plain = [];

		for (var i = 0; i < list.length; i++)
		{
			var shape = graph.getCellStyle(list[i])['shape'];

			if (shape == null || shape == 'rect' || shape == 'rectangle' || shape == 'label' ||
				shape == 'mxgraph.flowchart.process')
			{
				plain.push(list[i]);
			}
		}

		Tidy.setStyles(graph, plain, {rounded: '1', arcSize: arcSize});
	}
};

/**
 * Gives the given shapes the most common font and font size of the shapes
 * and texts, wrapped labels and no shadow.
 */
Tidy.setCommonFont = function(graph, cells, texts)
{
	var all = cells.concat(texts);
	var font = Tidy.getCommonValue(graph, all, mxConstants.STYLE_FONTFAMILY, null);
	var size = Tidy.getCommonValue(graph, cells, mxConstants.STYLE_FONTSIZE, null);
	var styles = {whiteSpace: 'wrap', shadow: null};

	if (font != null)
	{
		styles[mxConstants.STYLE_FONTFAMILY] = font;
	}

	if (size != null)
	{
		styles[mxConstants.STYLE_FONTSIZE] = size;
	}

	Tidy.setStyles(graph, cells, styles);
};

/**
 * Styles a flowchart or another graph with a theme of Simple Modern (see
 * getThemes): the shapes get the colors of the kind of their role (and are
 * colored by role, the colors the user chose are kept with keepColors), the
 * line width of the theme, bold labels in Bold and the keys of sketches in
 * Sketch, one size per role, one font and the connectors of the theme.
 * Shapes colored by an earlier theme (they have a role) get the new one.
 * Returns the style rules of the roles, which replace those of the earlier
 * theme. Without writeRules (a selection) the cells get no role.
 */
Tidy.styleTheme = function(graph, col, palette, keepColors, writeRules)
{
	var theme = palette.theme;
	var cells = Tidy.withoutBackdrops(graph, col.vertices, col.vertices.concat(col.texts));
	Tidy.restoreKeptRoleValues(graph, cells);
	var fixed = (writeRules) ? Tidy.getFixedRoleCells(graph, cells) : null;
	var themeColors = Tidy.getThemeColors();
	var keep = Object.create(null);
	var byRole = Object.create(null);
	var rules = [];

	if (keepColors)
	{
		for (var i = 0; i < cells.length; i++)
		{
			var own = Tidy.getOwnStyle(graph, cells[i]);

			if (!Tidy.hasRole(graph, cells[i]) && Tidy.isUserThemeColor(own[mxConstants.STYLE_FILLCOLOR], themeColors))
			{
				keep[cells[i].id] = true;
			}
		}
	}

	for (var i = 0; i < cells.length; i++)
	{
		var role = Tidy.getThemeRole(graph, cells[i]);

		if (byRole[role] == null)
		{
			byRole[role] = [];
		}

		byRole[role].push(cells[i]);
	}

	// Labels that the previous theme made bold are plain in the others
	var bold = Tidy.isBoldTheme(theme);
	var wasBold = !bold && Tidy.isBoldTheme(palette.current);

	for (var role in byRole)
	{
		var list = byRole[role];
		var keys = Tidy.getThemeKeys(theme, Tidy.roleKinds[role] || 'process');
		var colored = [];

		for (var i = 0; i < list.length; i++)
		{
			if (!keep[list[i].id])
			{
				colored.push(list[i]);
			}
		}

		if (colored.length > 0)
		{
			var previous = [];

			for (var i = 0; i < colored.length && wasBold; i++)
			{
				if (Tidy.hasRole(graph, colored[i]))
				{
					previous.push(colored[i]);
				}
			}

			Tidy.setStyles(graph, colored, keys);
			var base = {};
			base[mxConstants.STYLE_FILLCOLOR] = keys.fillColor;
			base[mxConstants.STYLE_STROKECOLOR] = keys.strokeColor;
			base[mxConstants.STYLE_FONTCOLOR] = keys.fontColor;
			Tidy.setRole(graph, colored, (writeRules) ? role : null, base);

			if (bold)
			{
				graph.setCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD, true, colored);
			}
			else if (previous.length > 0)
			{
				graph.setCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD, false, previous);
			}

			if (writeRules)
			{
				rules.push(Tidy.createRoleRule(role, keys.fillColor, keys.strokeColor, keys.fontColor));
			}
		}

		Tidy.resizeRole(graph, role, list);
	}

	Tidy.roundProcesses(graph, byRole.process, theme.arcSize || '12');
	Tidy.setCommonFont(graph, cells, col.texts);
	Tidy.styleEdges(graph, col, keepColors, true, theme);
	Tidy.writeRoleRules(graph, rules, fixed);

	return rules;
};

/**
 * Sets or removes the keys of sketches of the given theme on the given cells
 * (shapes and connectors of mind maps, whose colors are by branch).
 */
Tidy.setThemeSketch = function(graph, cells, theme)
{
	var vertex = (theme.styles != null && theme.styles.vertex != null) ? theme.styles.vertex : {};
	var keys = {};

	for (var i = 0; i < Tidy.sketchKeys.length; i++)
	{
		keys[Tidy.sketchKeys[i]] = (vertex[Tidy.sketchKeys[i]] != null) ? vertex[Tidy.sketchKeys[i]] : null;
	}

	Tidy.setStyles(graph, cells, keys);
};

/**
 * Gives the editable connectors one color, width and font and rounded
 * corners. Orthogonal makes straight connectors orthogonal (flowcharts). With
 * a theme the connectors get its color, width, label color, the keys of its
 * sketches and its arrow where they have the default arrow (Calm: blockThin).
 */
Tidy.styleEdges = function(graph, col, keepColors, orthogonal, theme)
{
	var edges = [];
	var colors = Object.create(null);
	var themeColors = (theme != null) ? Tidy.getThemeColors() : null;

	for (var i = 0; i < col.edges.length; i++)
	{
		var style = graph.getCellStyle(col.edges[i]);

		// Shapes of connectors (arrows, pipes) keep their look
		if (style['shape'] == null || style['shape'] == 'connector')
		{
			edges.push(col.edges[i]);
			var stroke = Tidy.getOwnStyle(graph, col.edges[i])[mxConstants.STYLE_STROKECOLOR];

			if (keepColors && ((theme != null) ? Tidy.isUserThemeColor(stroke, themeColors) :
				Tidy.isUserColor(stroke)))
			{
				colors[col.edges[i].id] = true;
			}
		}
	}

	var plain = [];

	for (var i = 0; i < edges.length; i++)
	{
		if (colors[edges[i].id] !== true)
		{
			plain.push(edges[i]);
		}
	}

	if (theme != null)
	{
		var es = (theme.styles != null && theme.styles.edge != null) ? theme.styles.edge : {};
		var keys = {strokeWidth: es.strokeWidth || '1', rounded: '1'};
		var arrows = [];

		for (var i = 0; i < Tidy.sketchKeys.length; i++)
		{
			keys[Tidy.sketchKeys[i]] = (es[Tidy.sketchKeys[i]] != null) ? es[Tidy.sketchKeys[i]] : null;
		}

		Tidy.setStyles(graph, plain, {strokeColor: es.strokeColor || Tidy.edgeColor,
			fontColor: es.fontColor || null});
		Tidy.setStyles(graph, edges, keys);

		// Only the default arrow becomes the arrow of the theme
		for (var i = 0; i < edges.length && es.endArrow != null; i++)
		{
			var arrow = Tidy.getOwnStyle(graph, edges[i])[mxConstants.STYLE_ENDARROW];

			if (arrow == null || arrow == mxConstants.ARROW_CLASSIC)
			{
				arrows.push(edges[i]);
			}
		}

		Tidy.setStyles(graph, arrows, {endArrow: es.endArrow, endFill: es.endFill || null,
			endSize: es.endSize || null});
	}
	else
	{
		var width = Tidy.getCommonValue(graph, edges, mxConstants.STYLE_STROKEWIDTH, '1');
		Tidy.setStyles(graph, plain, {strokeColor: Tidy.edgeColor});
		Tidy.setStyles(graph, edges, {strokeWidth: (parseFloat(width) > 0 && parseFloat(width) <= 4) ?
			width : '1', rounded: '1'});
	}

	if (orthogonal)
	{
		var straight = [];

		for (var i = 0; i < edges.length; i++)
		{
			var style = graph.getCellStyle(edges[i]);

			if (style[mxConstants.STYLE_EDGE] == null && style[mxConstants.STYLE_CURVED] != '1')
			{
				straight.push(edges[i]);
			}
		}

		Tidy.setStyles(graph, straight, {edgeStyle: 'orthogonalEdgeStyle'});
	}

	return edges.length;
};

/**
 * Styles a cloud or network diagram: one size for the square icons, labels
 * below, one font size, and the connectors (of the given theme, optional).
 * Icons keep their colors.
 */
Tidy.styleCloud = function(graph, col, theme)
{
	var model = graph.model;
	var icons = [];
	var sizes = [];

	for (var i = 0; i < col.icons.length; i++)
	{
		if (col.movable[col.icons[i].id])
		{
			var geo = model.getGeometry(col.icons[i]);
			icons.push(col.icons[i]);

			if (Math.abs(geo.width - geo.height) < 2)
			{
				sizes.push(geo.width);
			}
		}
	}

	var size = Math.round(Tidy.median(sizes) / 2) * 2;

	for (var i = 0; i < icons.length && size > 0; i++)
	{
		var geo = model.getGeometry(icons[i]);

		if (Math.abs(geo.width - geo.height) < 2)
		{
			Tidy.resize(graph, icons[i], size, size);
		}
	}

	var fontSize = Tidy.getCommonValue(graph, icons, mxConstants.STYLE_FONTSIZE, '12');
	Tidy.setStyles(graph, icons, {labelPosition: 'center', verticalLabelPosition: 'bottom',
		align: 'center', verticalAlign: 'top', fontSize: fontSize});
	Tidy.styleEdges(graph, col, true, false, theme);

	return icons.length;
};

/**
 * Applies Style My Diagram with the given palette in a trial and returns
 * the number of styled cells.
 */
Tidy.applyStyle = function(trial, plan, palette, options)
{
	var graph = trial.graph;
	var col = Tidy.collect(graph, trial.cells);
	var keepColors = options.keepColors !== false;
	var theme = palette.theme || null;
	var count = 0;

	var edit1 = trial.execute(function()
	{
		if (plan.kind == 'mindmap')
		{
			count = Tidy.styleMindmap(graph, col, palette, keepColors);

			if (theme != null)
			{
				Tidy.setThemeSketch(graph, col.vertices.concat(col.edges), theme);
			}
		}
		else if (plan.kind == 'cloud' || plan.kind == 'network')
		{
			count = Tidy.styleCloud(graph, col, theme);
		}
		else if (plan.kind == 'sequence' || plan.kind == 'er' || plan.kind == 'swimlanes')
		{
			count = Tidy.styleEdges(graph, col, keepColors, false, theme);
		}
		else if (theme != null)
		{
			Tidy.styleTheme(graph, col, palette, keepColors, !trial.scoped);
			count = col.vertices.length;
		}
		else
		{
			Tidy.styleFlowchart(graph, col, palette, keepColors, !trial.scoped);
			count = col.vertices.length;
		}

		Tidy.ops.removeOverlaps(graph, col, 20);
		Tidy.ops.labelGaps(graph, col);
	});

	// Routes the connectors that now cross shapes
	var edit2 = trial.execute(function()
	{
		var after = Tidy.collect(graph, trial.cells);
		var edges = Tidy.getEdgesThroughShapes(graph, after);

		if (edges != null && edges.length > 0 && edges.length <= Tidy.maxRoutedEdges && plan.routing)
		{
			Tidy.ops.route(graph, {edges: edges});
		}
	});

	return {count: count, edits: [edit1, edit2]};
};

/**
 * Writes the given rules of roles to the page (see setRoleRules) and keeps
 * the colors of the given cells that Style must not change (see
 * getFixedRoleCells), or does nothing if fixed is null (a selection).
 */
Tidy.writeRoleRules = function(graph, rules, fixed)
{
	if (fixed != null && rules.length > 0)
	{
		Tidy.setRoleRules(graph, rules);
		Tidy.keepFixedRoleColors(graph, fixed);
	}
};

/**
 * Replaces the rules of the roles of the given rules in the rules of the
 * page. Rules of other roles stay, also those of roles that this run did
 * not color (Keep my colors keeps colors set through rules), and the other
 * rules come first, so they win. Rules that are no valid JSON stay as they
 * are and no rules are added.
 */
Tidy.setRoleRules = function(graph, rules)
{
	// Rules need a release with style rules
	if (rules.length == 0 || typeof Graph.styleRulesAttribute !== 'string' ||
		typeof graph.getStyleRulesJson !== 'function')
	{
		return;
	}

	var root = graph.model.getRoot();
	var json = Tidy.getStyleRulesJson(graph);
	var roles = Object.create(null);
	var list = [];

	for (var i = 0; i < rules.length; i++)
	{
		roles[rules[i].value] = true;
	}

	if (json != null)
	{
		var parsed = null;

		try
		{
			parsed = JSON.parse(json);
		}
		catch (e)
		{
			return;
		}

		if (!Array.isArray(parsed))
		{
			return;
		}

		for (var i = 0; i < parsed.length; i++)
		{
			var rule = parsed[i];

			if (rule == null || typeof rule !== 'object' || rule.property != Tidy.roleProperty ||
				typeof rule.value !== 'string' || roles[rule.value] !== true)
			{
				list.push(rule);
			}
		}
	}

	list = list.concat(rules);
	graph.setAttributeForCell(root, Graph.styleRulesAttribute, JSON.stringify(list));
};

/**
 * Tries the palettes on the page or the given cells of the given editor UI
 * and returns {kind, before, plan, results} like Tidy.analyze, with one
 * result per palette (the first is the default). In Simple Modern the
 * results are the named themes (see getThemes) with their swatches instead
 * of pictures, themes is true and current is the ID of the theme of the
 * shapes (or null). Options: keepColors, and themes, an array of themes by
 * kind that replaces the named themes (Style my diagram automatically of the
 * Diagram tab tries only the theme of the page, see Tidy.themesOption).
 */
Tidy.style = function(ui, cells, options)
{
	return new Tidy.Analysis(ui, cells, options || {}, true).complete();
};

/**
 * Returns the number of shapes of the given collection (see collect) whose
 * style or geometry the given changes of a result change: the shapes that
 * the result styles, not all the shapes it looked at, so a palette that the
 * page has already (or that Keep my colors keeps from every shape) styles
 * none and its tile does not contradict the status (Nothing to style).
 */
Tidy.countStyledShapes = function(col, changes)
{
	return Tidy.countChangedCells(col.vertices.concat(col.texts), changes, true);
};

/**
 * Returns the number of connectors of the given collection (see collect)
 * whose style the given changes of a result change, eg. of a sequence, ER
 * or swimlane diagram, whose Style changes only the connectors (see
 * applyStyle). A connector that only moves with its shapes is not styled.
 */
Tidy.countStyledConnectors = function(col, changes)
{
	return Tidy.countChangedCells(col.edges, changes, false);
};

/**
 * Returns the number of the given cells whose style, or also their
 * geometry if geometry is true, the given changes (see
 * Tidy.Trial.getChanges) change. Each cell counts once.
 */
Tidy.countChangedCells = function(cells, changes, geometry)
{
	var ids = Object.create(null);
	var count = 0;

	for (var i = 0; i < cells.length; i++)
	{
		ids[cells[i].id] = true;
	}

	for (var i = 0; i < changes.length; i++)
	{
		if (ids[changes[i].id] === true && (changes[i].style !== undefined ||
			(geometry && changes[i].geometry !== undefined)))
		{
			ids[changes[i].id] = false;
			count++;
		}
	}

	return count;
};

/**
 * Plans the palettes of Style My Diagram for the given analysis (see
 * Tidy.style and Tidy.Analysis): the results are the entries of the
 * palettes from the start (id, name, index, theme, swatch), and the step of
 * each palette adds its metrics, changes, stats (styled: the shapes it
 * changes, see countStyledShapes, styledEdges: the connectors whose style
 * it changes, see countStyledConnectors), thumbnail, darkThumbnail and
 * score.
 */
Tidy.prepareStyle = function(analysis, cells)
{
	var trial = analysis.trial;
	var options = analysis.options;
	var graph = trial.graph;
	trial.scoped = cells != null && cells.length > 0;
	var col = Tidy.collect(graph, trial.cells);
	var plan = Tidy.plan(graph, col, {keep: true});
	var before = Tidy.measure(graph, col);
	var themes = Tidy.getThemes();
	var known = themes;
	var current = null;
	var palettes = null;
	var results = [];

	// The given themes instead of the named ones, the current theme among all
	// known themes (the page may have Tonal, which is no named theme)
	if (themes != null && Array.isArray(options.themes) && options.themes.length > 0)
	{
		themes = options.themes;
		known = Tidy.getKnownThemes().concat(themes);
	}

	if (themes != null)
	{
		current = Tidy.getCurrentTheme(graph, Tidy.withoutBackdrops(graph,
			col.vertices, col.vertices.concat(col.texts)), known);
		palettes = [];

		for (var i = 0; i < themes.length; i++)
		{
			palettes.push(Tidy.createThemePalette(themes[i]));
			palettes[i].current = null;

			for (var j = 0; j < known.length && palettes[i].current == null; j++)
			{
				if (known[j].id == current)
				{
					palettes[i].current = known[j];
				}
			}
		}
	}
	else
	{
		palettes = Tidy.getPalettes();
	}

	// Icons of cloud diagrams keep their colors: one result
	if (plan.kind == 'cloud' || plan.kind == 'network')
	{
		palettes = palettes.slice(0, 1);
	}

	analysis.result = {kind: plan.kind, before: before, plan: plan, results: results,
		cells: cells, options: options, scope: trial.scoped, style: true,
		themes: themes != null, current: current};

	var addStep = function(palette, i)
	{
		var theme = palette.theme;
		var result = {id: (theme != null) ? theme.id : 'palette' + i,
			name: (theme != null) ? theme.name : 'palette', index: (theme != null) ? null : i + 1,
			theme: (theme != null) ? theme.id : null,
			swatch: (theme != null) ? Tidy.getThemeSwatch(theme) : null};
		results.push(result);

		analysis.steps.push(function()
		{
			var applied = Tidy.applyStyle(trial, plan, palette, options);
			var after = Tidy.collect(graph, trial.cells);
			result.metrics = Tidy.measure(graph, after);
			result.changes = trial.getChanges();
			result.stats = {styled: Tidy.countStyledShapes(col, result.changes),
				styledEdges: Tidy.countStyledConnectors(col, result.changes)};
			Tidy.setThumbnails(result, (options.thumbnails !== false && theme == null) ?
				trial.getThumbnails() : null);
			result.score = Tidy.score(result.metrics, 1);

			for (var j = applied.edits.length - 1; j >= 0; j--)
			{
				if (applied.edits[j] != null)
				{
					applied.edits[j].undo();
				}
			}
		});
	};

	for (var i = 0; i < palettes.length; i++)
	{
		addStep(palettes[i], i);
	}
};
