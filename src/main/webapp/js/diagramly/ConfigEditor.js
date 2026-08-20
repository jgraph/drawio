/**
 * Copyright (c) 2006-2026, JGraph Ltd
 *
 * Builds the visual configuration editor directly in the DOM. Replaces the
 * previous iframe-based implementation so the editor works in contexts that
 * forbid iframes (e.g. the Electron desktop app with frame-src 'none').
 *
 * Standalone namespace so it can be reused from both the main app and the
 * Confluence Cloud admin page without requiring EditorUi or any other draw.io
 * classes to be loaded.
 */
var DrawioConfigEditor = {};

/**
 * Installs the config editor stylesheet once per document.
 */
DrawioConfigEditor.installCss = function()
{
	if (document.getElementById('geConfigEditorStyle') != null)
	{
		return;
	}

	var style = document.createElement('style');
	style.id = 'geConfigEditorStyle';
	style.textContent = DrawioConfigEditor.css;
	document.head.appendChild(style);
};

/**
 * Builds a configuration editor in the given container. Returns an API with
 * setConfig, setDarkMode, setHighContrast, getConfig and getInvalidFields
 * methods.
 *
 * options:
 *   initialConfig    - starting configuration object
 *   editorContext    - { currentVertexStyle, currentEdgeStyle } for "Use Current" buttons
 *   darkMode         - apply dark appearance
 *   highContrast     - apply high-contrast appearance
 *   onConfigChanged  - called with the updated config object on every change
 *   isDesktop        - if true, show desktop-only toggles (defaults to Electron UA check)
 */
DrawioConfigEditor.install = function(container, options)
{
	options = options || {};
	DrawioConfigEditor.installCss();

	container.classList.add('geConfigEditor');
	container.innerHTML = DrawioConfigEditor.html;

	var config = {};
	var fontLists = { defaultFonts: [], customFonts: [] };
	var colorLists = { presetColors: [], customPresetColors: [], defaultColors: [] };
	var tagLists = { enabledLibraries: [], defaultCustomLibraries: [], hideMenuItems: [], hideMenus: [], enabledTemplateSections: [], defaultLanguages: [] };
	var schemeData = { defaultColorSchemes: [], customColorSchemes: [] };
	var invalidFields = {};
	var editorContext = options.editorContext || {};
	var isDesktop = (options.isDesktop != null) ? options.isDesktop :
		(navigator.userAgent.indexOf('Electron') >= 0);

	function notifyChange()
	{
		if (typeof options.onConfigChanged === 'function')
		{
			options.onConfigChanged(JSON.parse(JSON.stringify(config)));
		}
	}

	function escapeHtml(str)
	{
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		return div.innerHTML;
	}

	// Text-node serialization leaves quotes intact, so double-quoted
	// attribute values additionally need quote escaping
	function escapeAttr(str)
	{
		return escapeHtml(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}

	function q(selector) { return container.querySelector(selector); }
	function qAll(selector) { return container.querySelectorAll(selector); }

	// Returns the translation for the given resource key, or null to keep
	// the built-in English text. Translations are only ever assigned as
	// text (nodeValue/textContent/attribute values), never concatenated
	// into markup: resource values can be overridden via the "resources"
	// configuration and must not reach innerHTML.
	function translate(key)
	{
		if (typeof mxResources !== 'undefined')
		{
			var value = mxResources.get(key);

			// A missing key is echoed back as the key itself
			if (value != null && value.length > 0 && value != key)
			{
				return value;
			}
		}

		return null;
	}

	// Like translate, but shows the key for a missing translation (which
	// only happens for the dia_i18n preview pseudo-language)
	function resolve(key)
	{
		var value = translate(key);

		return (value != null) ? value : key;
	}

	// Derives the resource key for a config key (version -> cfgVersion)
	function configResourceKey(key)
	{
		return 'cfg' + key.charAt(0).toUpperCase() + key.substring(1);
	}

	// Sets the given text as the element's leading text node, keeping any
	// element children (badges, code tags) in place
	function setTextNode(el, text)
	{
		if (el.firstChild == null || el.firstChild.nodeType != 3)
		{
			el.insertBefore(el.ownerDocument.createTextNode(''), el.firstChild);
		}

		el.firstChild.nodeValue = text;
	}

	// Fills the template texts from the resources: field labels, their
	// help texts, section titles (via their data-i18n key) and the search
	// placeholder. The template ships without English texts - dia.txt is
	// the single source. A field id that collides with a toggle key uses
	// the 'Field' suffix (probed first - it only exists for collisions).
	// A missing translation shows the resource key for labels and titles
	// (only the dia_i18n preview pseudo-language) and hides help texts.
	// See translate() for why this never writes markup.
	function localizeTemplate()
	{
		qAll('label[for^="cfg-"]').forEach(function(label)
		{
			var key = configResourceKey(label.getAttribute('for').substring(4));
			var name = (translate(key + 'Field') != null) ? key + 'Field' : key;
			var text = translate(name);

			// A few labels have no resource key (multi-line template
			// constructs) and keep their built-in English text
			if (text != null)
			{
				label.textContent = text;
			}
			else if (label.textContent === '')
			{
				label.textContent = name;
			}

			var field = label.closest('.field');
			var helpEl = (field != null) ? field.querySelector('.field__help') : null;
			var help = translate(name + 'Help');

			if (helpEl != null && help != null)
			{
				helpEl.textContent = help;
			}
		});

		// Section titles, detached help texts and list-editor labels and
		// buttons carry their resource key explicitly
		qAll('[data-i18n]').forEach(function(el)
		{
			el.textContent = resolve(el.getAttribute('data-i18n'));
		});

		var search = q('#searchInput');
		var placeholder = translate('cfgSearchSettings');

		if (search != null && placeholder != null)
		{
			search.setAttribute('placeholder', placeholder);
		}
	}

	// Applies the toggle texts for the current language from the resources
	// (a missing translation shows the resource key, which only happens for
	// the dia_i18n preview pseudo-language) - text nodes only, see
	// translate(). Callable again after a language switch.
	function localizeToggles()
	{
		Object.keys(toggleGroups).forEach(function(containerId)
		{
			var fields = qAll('#' + containerId + ' .toggle-field');

			toggleGroups[containerId].forEach(function(toggle, i)
			{
				var field = fields[i];

				if (field == null)
				{
					return;
				}

				var key = toggle.i18n || configResourceKey(toggle.key);
				var name = translate(key);
				var help = translate(key + 'Help');

				setTextNode(field.querySelector('.toggle-field__name'),
					(name != null) ? name : key);
				setTextNode(field.querySelector('.toggle-field__help'),
					(help != null) ? help + ' ' : '');

				var badgeEl = field.querySelector('.toggle-field__experimental');

				if (badgeEl != null)
				{
					badgeEl.setAttribute('title', resolve('cfgExperimental'));
				}

				var buttons = field.querySelectorAll('.tri-toggle button');
				var titles = [resolve('cfgNotSet'), resolve('cfgEnabled'),
					resolve('disabled')];

				for (var j = 0; j < buttons.length; j++)
				{
					buttons[j].setAttribute('title', titles[j]);
				}
			});
		});
	}

	localizeTemplate();

	// ============================================
	// TOGGLE DEFINITIONS
	// ============================================
	var toggleGroups = {
		'general-toggles': [
			{ key: 'override' },
			{ key: 'compact' },
			{ key: 'noAutoFocus' },
			{ key: 'showSplashOnStart' },
			{ key: 'updateDefaultStyle' },
			{ key: 'mathOutputSize' },
			{ key: 'browserTranslate' }
		],
		'canvas-toggles': [
			{ key: 'defaultPageVisible' },
			{ key: 'defaultGridEnabled' },
			{ key: 'enablePositionGuides' },
			{ key: 'enableDistanceGuides' },
			{ key: 'enableSizeGuides' },
			{ key: 'defaultConnectable' },
			{ key: 'defaultConnectionArrowsEnabled' },
			{ key: 'copyOnConnect' },
			{ key: 'defaultFoldingEnabled' },
			{ key: 'defaultTransparentGroups' },
			{ key: 'zoomWheel' },
			{ key: 'simpleLabels' },
			{ key: 'optimizeHtmlLabels' },
			{ key: 'stopEditingOnEnter' },
			{ key: 'pasteAtMousePointer' },
			{ key: 'fitDiagramOnLoad' },
			{ key: 'fitDiagramOnPage' },
			{ key: 'selectParentLayer' },
			{ key: 'enableInlineToolbar' },
			{ key: 'enableWindowDocking' },
			{ key: 'showLinkIcons' },
			{ key: 'showTooltipIcons' },
			{ key: 'showNoteIcons' },
			{ key: 'showConnectHandle' },
			{ key: 'intersectionSelect' },
			{ key: 'swimlaneSelectionEnabled' }
		],
		'appearance-toggles': [
			{ key: 'enableCssDarkMode' },
			{ key: 'enableLightDarkColors' },
			{ key: 'enableAnimations' },
			{ key: 'insertAnimations' }
		],
		'sidebar-toggles': [
			{ key: 'sidebarTitles' },
			{ key: 'expandLibraries' }
		],
		'library-toggles': [
			{ key: 'enableCustomLibraries' },
			{ key: 'inlineExtIcons' },
			{ key: 'appendCustomLibraries' }
		],
		'export-toggles': [
			{ key: 'compressXml' },
			{ key: 'compressStyles', experimental: true, helpLink: 'https://www.drawio.com/docs/reference/style-compression/' },
			{ key: 'includeDiagram' },
			{ key: 'enableExportUrl' },
			{ key: 'lockdown' },
			{ key: 'restrictExport' },
			{ key: 'enableNativeClipboard' },
			{ key: 'replaceSvgDataUris' },
			{ key: 'foreignObjectImages' },
			{ key: 'embedSvgFonts' },
			{ key: 'removeImageMetadata' },
			{ key: 'expandPatternsForPrint' }
		],
		'advanced-toggles': [
			{ key: 'shareCursorPosition' },
			{ key: 'showRemoteCursors' },
			{ key: 'oneDriveInlinePicker' },
			{ key: 'enableCustomGitLabUrl' }
		],
		'embedding-toggles': [
			{ key: 'passiveScroll' },
			{ key: 'noResizers' },
			{ key: 'preserveViewState' },
			{ key: 'useInternalClipboard' }
		],
		'ai-toggles': [
			{ key: 'enableAi' }
		],
		'confluence-cloud-toggles': [
			{ key: 'simpleViewer' },
			{ key: 'disableVersioning' },
			{ key: 'hiResPreview' },
			{ key: 'autoCropViewer' },
			{ key: 'enableCssDarkMode', i18n: 'cfgEnableCssDarkMode2' },
			{ key: 'viewerCanExceedPageWidth' },
			{ key: 'inplaceEdits' },
			{ key: 'lockdown' },
			{ key: 'translateDiagrams' },
			{ key: 'generateSVGs' },
			{ key: 'debug' }
		],
		'confluence-toggles': [
			{ key: 'debug' },
			{ key: 'inplaceEdits' },
			{ key: 'forceSimpleViewer' }
		]
	};

	if (isDesktop)
	{
		toggleGroups['font-toggles'] = [
			{ key: 'enableLocalFonts' }
		];
		toggleGroups['desktop-toggles'] = [
			{ key: 'desktopAutoSync' }
		];
	}

	// ============================================
	// RENDER TOGGLES
	// ============================================
	function renderToggles()
	{
		Object.keys(toggleGroups).forEach(function(containerId)
		{
			var el = q('#' + containerId);
			if (!el) return;

			el.classList.add('toggle-list');
			var html = '';
			toggleGroups[containerId].forEach(function(toggle)
			{
				var badge = toggle.experimental ?
					' <span class="toggle-field__experimental" title="Experimental feature">experimental</span>' : '';
				var helpIcon = toggle.helpLink ?
					' <a class="toggle-field__helplink" href="' + toggle.helpLink + '" target="_blank" rel="noopener" title="Learn more">?</a>' : '';

				// Names and help texts come from the resources and are
				// filled in as text nodes by localizeToggles - resource
				// values must never be concatenated into this markup
				html += '<div class="toggle-field">' +
					'<div class="toggle-field__label">' +
						'<span class="toggle-field__name">' + badge + '</span>' +
						'<span class="toggle-field__help"><code>' + toggle.key + '</code>' + helpIcon + '</span>' +
					'</div>' +
					'<div class="tri-toggle" data-key="' + toggle.key + '">' +
						'<button type="button" data-value="unset" class="active--unset" title="Not set (use default)">&#8212;</button>' +
						'<button type="button" data-value="true" title="Enabled">On</button>' +
						'<button type="button" data-value="false" title="Disabled">Off</button>' +
					'</div>' +
				'</div>';
			});
			el.innerHTML = html;
		});

		localizeToggles();

		qAll('.tri-toggle').forEach(function(toggle)
		{
			toggle.querySelectorAll('button').forEach(function(btn)
			{
				btn.addEventListener('click', function()
				{
					var key = toggle.getAttribute('data-key');
					var value = btn.getAttribute('data-value');

					// Update every toggle with this key so duplicates in
					// other sections (e.g. lockdown, debug) stay in sync
					qAll('.tri-toggle[data-key="' + key + '"]').forEach(function(t)
					{
						t.querySelectorAll('button').forEach(function(b) { b.className = ''; });
						t.querySelector('[data-value="' + value + '"]').className = 'active--' + value;
					});

					if (value === 'unset') { delete config[key]; }
					else { config[key] = value === 'true'; }

					notifyChange();
				});
			});
		});
	}

	// ============================================
	// JSON FIELD VALIDATION
	// ============================================
	function fieldLabel(el)
	{
		var field = el.closest('.field');
		var label = (field != null) ? field.querySelector('label') : null;

		return (label != null) ? label.textContent : el.getAttribute('data-key');
	}

	function markFieldInvalid(el)
	{
		invalidFields[el.getAttribute('data-key')] = fieldLabel(el);
		el.classList.add('input--invalid');
		el.setAttribute('aria-invalid', 'true');

		if (el.nextElementSibling == null ||
			!el.nextElementSibling.classList.contains('field__error'))
		{
			var err = document.createElement('p');
			err.className = 'field__error';
			err.textContent = 'Invalid JSON';
			el.insertAdjacentElement('afterend', err);
		}
	}

	function clearFieldInvalid(el)
	{
		delete invalidFields[el.getAttribute('data-key')];
		el.classList.remove('input--invalid');
		el.removeAttribute('aria-invalid');

		var err = el.nextElementSibling;

		if (err != null && err.classList.contains('field__error'))
		{
			err.parentNode.removeChild(err);
		}
	}

	// ============================================
	// TEXT/NUMBER FIELD HANDLERS
	// ============================================
	function setupFieldHandlers()
	{
		qAll('[data-key]').forEach(function(el)
		{
			if (el.classList.contains('tri-toggle') || el.closest('.tri-toggle')) return;

			var key = el.getAttribute('data-key');
			var isJson = el.getAttribute('data-type') === 'json';

			el.addEventListener('input', function()
			{
				var val = el.value.trim();

				if (val === '')
				{
					delete config[key];
					if (isJson) { clearFieldInvalid(el); }
				}
				else if (el.type === 'number')
				{
					var num = parseFloat(val);
					if (!isNaN(num)) { config[key] = num; }
				}
				else if (isJson)
				{
					try { config[key] = JSON.parse(val); clearFieldInvalid(el); }
					catch (e) { markFieldInvalid(el); }
				}
				else { config[key] = val; }

				notifyChange();
			});

			if (el.tagName === 'SELECT')
			{
				el.addEventListener('change', function()
				{
					var val = el.value;
					if (val === '') { delete config[key]; }
					else { config[key] = val; }
					notifyChange();
				});
			}
		});
	}

	// ============================================
	// COLOR PICKER SYNC
	// ============================================
	function setupColorSync()
	{
		var pairs = [
			{ picker: 'cfg-darkColorPicker', text: 'cfg-darkColor' },
			{ picker: 'cfg-shadowColorPicker', text: 'cfg-shadowColor' },
			{ picker: 'cfg-defaultGridColorPicker', text: 'cfg-defaultGridColor' },
			{ picker: 'cfg-defaultDarkGridColorPicker', text: 'cfg-defaultDarkGridColor' },
			{ picker: 'cfg-defaultPageBackgroundColorPicker', text: 'cfg-defaultPageBackgroundColor' },
			{ picker: 'cfg-defaultDarkPageBackgroundColorPicker', text: 'cfg-defaultDarkPageBackgroundColor' }
		];

		pairs.forEach(function(pair)
		{
			var picker = q('#' + pair.picker);
			var text = q('#' + pair.text);

			picker.addEventListener('input', function()
			{
				text.value = picker.value.toUpperCase();
				text.dispatchEvent(new Event('input'));
			});

			text.addEventListener('input', function()
			{
				if (/^#[0-9A-Fa-f]{6}$/.test(text.value)) { picker.value = text.value; }
			});
		});
	}

	// ============================================
	// PAGE FORMAT
	// ============================================
	function setupPageFormat()
	{
		var widthEl = q('#cfg-pageFormatWidth');
		var heightEl = q('#cfg-pageFormatHeight');

		function updatePageFormat()
		{
			var w = parseInt(widthEl.value);
			var h = parseInt(heightEl.value);

			if (!isNaN(w) && !isNaN(h)) { config.pageFormat = { width: w, height: h }; }
			else if (widthEl.value === '' && heightEl.value === '') { delete config.pageFormat; }

			notifyChange();
		}

		widthEl.addEventListener('input', updatePageFormat);
		heightEl.addEventListener('input', updatePageFormat);
	}

	// ============================================
	// TOOLTIP MAX WIDTH
	// ============================================
	function setupTooltipMaxWidth()
	{
		var widthEl = q('#cfg-tooltipMaxWidth');
		var checkEl = q('#cfg-tooltipMaxWidthEnabled');

		function update()
		{
			widthEl.disabled = !checkEl.checked;

			if (!checkEl.checked)
			{
				config.tooltipMaxWidth = 0;
			}
			else
			{
				var val = parseInt(widthEl.value);

				if (!isNaN(val) && val > 0)
				{
					config.tooltipMaxWidth = val;
				}
				else
				{
					delete config.tooltipMaxWidth;
				}
			}

			notifyChange();
		}

		checkEl.addEventListener('change', update);
		widthEl.addEventListener('input', update);
	}

	// ============================================
	// FONT LISTS
	// ============================================
	function renderFontTags(listKey)
	{
		var el = q('#' + listKey + '-tags');
		var html = '';

		// Entries are kept in their original form: plain font names or
		// {fontFamily, fontUrl} objects for web fonts (e.g. Google Fonts)
		fontLists[listKey].forEach(function(font, i)
		{
			var isObj = (font !== null && typeof font === 'object');
			var name = isObj ? String(font.fontFamily || '') : String(font);
			var url = (isObj && font.fontUrl) ? String(font.fontUrl) : null;

			html += '<span class="tag"' + ((url != null) ? ' title="' + escapeAttr(url) + '"' : '') + '>' +
				'<span>' + escapeHtml(name) + '</span>' +
				((url != null) ? '<span class="tag__link">&#8599;</span>' : '') +
				'<button type="button" class="tag__remove" data-list="' + listKey + '" data-index="' + i + '">&times;</button></span>';
		});

		el.innerHTML = html;

		el.querySelectorAll('.tag__remove').forEach(function(btn)
		{
			btn.addEventListener('click', function()
			{
				fontLists[btn.getAttribute('data-list')].splice(parseInt(btn.getAttribute('data-index')), 1);
				syncFontList(btn.getAttribute('data-list'));
				renderFontTags(btn.getAttribute('data-list'));
			});
		});
	}

	function syncFontList(listKey)
	{
		if (fontLists[listKey].length > 0) { config[listKey] = fontLists[listKey].slice(); }
		else { delete config[listKey]; }
		notifyChange();
	}

	function setupFontList(listKey)
	{
		var input = q('#' + listKey + '-input');
		var urlInput = q('#' + listKey + '-url');
		var addBtn = q('#' + listKey + '-add');

		function addFont()
		{
			var name = input.value.trim();
			var url = urlInput.value.trim();

			if (name)
			{
				fontLists[listKey].push((url) ? { fontFamily: name, fontUrl: url } : name);
				input.value = '';
				urlInput.value = '';
				syncFontList(listKey);
				renderFontTags(listKey);
			}
		}

		function onEnter(e) { if (e.key === 'Enter') { e.preventDefault(); addFont(); } }

		addBtn.addEventListener('click', addFont);
		input.addEventListener('keydown', onEnter);
		urlInput.addEventListener('keydown', onEnter);
		renderFontTags(listKey);
	}

	// ============================================
	// COLOR LISTS
	// ============================================
	function renderColorSwatches(listKey)
	{
		var el = q('#' + listKey + '-list');
		el.innerHTML = '';

		colorLists[listKey].forEach(function(color, i)
		{
			var isSpecial = (color === 'none' || color === 'null');
			var swatch = document.createElement('div');
			swatch.className = 'color-swatch';
			swatch.title = isSpecial ? color : '#' + color;

			if (isSpecial)
			{
				swatch.style.cssText = 'background: transparent; background-image: linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%); background-size: 8px 8px; background-position: 0 0, 4px 4px;';
			}
			else
			{
				swatch.style.background = '#' + color;
			}

			if (!isSpecial)
			{
				var picker = document.createElement('input');
				picker.type = 'color';
				picker.className = 'color-swatch__picker';
				picker.value = '#' + (color.length === 3 ? color[0]+color[0]+color[1]+color[1]+color[2]+color[2] : color.padEnd(6, '0'));
				picker.addEventListener('input', (function(idx)
				{
					return function()
					{
						var nc = picker.value.substring(1).toUpperCase();
						colorLists[listKey][idx] = nc;
						swatch.style.background = '#' + nc;
						swatch.title = '#' + nc;
						syncColorList(listKey);
					};
				})(i));
				swatch.appendChild(picker);
			}

			var del = document.createElement('button');
			del.className = 'color-swatch__delete';
			del.textContent = '\u00D7';
			del.addEventListener('click', (function(idx)
			{
				return function(e)
				{
					e.stopPropagation();
					colorLists[listKey].splice(idx, 1);
					syncColorList(listKey);
					renderColorSwatches(listKey);
				};
			})(i));
			swatch.appendChild(del);
			el.appendChild(swatch);
		});
	}

	function syncColorList(listKey)
	{
		if (colorLists[listKey].length > 0) { config[listKey] = colorLists[listKey].slice(); }
		else { delete config[listKey]; }
		notifyChange();
	}

	function setupColorList(listKey)
	{
		var picker = q('#' + listKey + '-picker');
		var input = q('#' + listKey + '-input');
		var addBtn = q('#' + listKey + '-add');

		picker.addEventListener('input', function() { input.value = picker.value.substring(1).toUpperCase(); });

		function addColor()
		{
			var val = input.value.trim().replace(/^#/, '');
			if (val === 'none' || val === 'null')
			{
				colorLists[listKey].push(val); input.value = '';
				syncColorList(listKey); renderColorSwatches(listKey);
			}
			else if (/^[0-9A-Fa-f]{3,8}$/.test(val))
			{
				colorLists[listKey].push(val.toUpperCase()); input.value = '';
				syncColorList(listKey); renderColorSwatches(listKey);
			}
		}

		addBtn.addEventListener('click', addColor);
		input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); addColor(); } });
		renderColorSwatches(listKey);
	}

	// ============================================
	// COLOR SCHEME EDITOR
	// ============================================
	var schemeKeys = ['fill', 'stroke', 'gradient', 'font'];

	function renderSchemeEditor(listKey)
	{
		var el = q('#' + listKey + '-editor');
		el.innerHTML = '';

		schemeData[listKey].forEach(function(row, rowIdx)
		{
			var rowEl = document.createElement('div');
			rowEl.className = 'color-scheme-row';

			var label = document.createElement('span');
			label.className = 'color-scheme-row__label';
			label.textContent = (rowIdx + 1);
			rowEl.appendChild(label);

			row.forEach(function(entry, entryIdx)
			{
				if (entry === null)
				{
					var nullTag = document.createElement('span');
					nullTag.className = 'color-scheme-entry';
					nullTag.innerHTML = '<span style="color: var(--color-text-secondary); font-style: italic;">default</span>';

					var nullRemove = document.createElement('button');
					nullRemove.className = 'color-scheme-entry__remove';
					nullRemove.textContent = '\u00D7';
					nullRemove.addEventListener('click', (function(ri, ei)
					{
						return function() { schemeData[listKey][ri].splice(ei, 1); syncSchemeData(listKey); renderSchemeEditor(listKey); };
					})(rowIdx, entryIdx));
					nullTag.appendChild(nullRemove);
					rowEl.appendChild(nullTag);
					return;
				}

				schemeKeys.forEach(function(key)
				{
					if (!entry[key]) return;
					var tag = document.createElement('span');
					tag.className = 'color-scheme-entry';

					var sw = document.createElement('span');
					sw.className = 'color-scheme-entry__swatch';
					sw.style.background = entry[key];

					var colorInput = document.createElement('input');
					colorInput.type = 'color';
					colorInput.value = entry[key];
					colorInput.addEventListener('input', (function(ri, ei, k)
					{
						return function() { schemeData[listKey][ri][ei][k] = colorInput.value; sw.style.background = colorInput.value; syncSchemeData(listKey); };
					})(rowIdx, entryIdx, key));
					sw.appendChild(colorInput);

					var keyLabel = document.createElement('span');
					keyLabel.className = 'color-scheme-entry__key';
					keyLabel.textContent = key.charAt(0).toUpperCase();
					keyLabel.title = key;

					var remove = document.createElement('button');
					remove.className = 'color-scheme-entry__remove';
					remove.textContent = '\u00D7';
					remove.addEventListener('click', (function(ri, ei, k)
					{
						return function()
						{
							delete schemeData[listKey][ri][ei][k];
							var remaining = Object.keys(schemeData[listKey][ri][ei]).filter(function(k2) { return schemeKeys.indexOf(k2) > -1; });
							if (remaining.length === 0) { schemeData[listKey][ri].splice(ei, 1); }
							syncSchemeData(listKey); renderSchemeEditor(listKey);
						};
					})(rowIdx, entryIdx, key));

					tag.appendChild(sw);
					tag.appendChild(keyLabel);
					tag.appendChild(remove);
					rowEl.appendChild(tag);
				});
			});

			var actions = document.createElement('span');
			actions.className = 'color-scheme-row__actions';

			var addEntry = document.createElement('button');
			addEntry.className = 'color-scheme-row__btn';
			addEntry.textContent = '+';
			addEntry.title = 'Add colour entry';
			addEntry.addEventListener('click', (function(ri)
			{
				return function() { schemeData[listKey][ri].push({ fill: '#dae8fc', stroke: '#6c8ebf' }); syncSchemeData(listKey); renderSchemeEditor(listKey); };
			})(rowIdx));

			var addNull = document.createElement('button');
			addNull.className = 'color-scheme-row__btn';
			addNull.textContent = '\u00F8';
			addNull.title = 'Add default (null) entry';
			addNull.addEventListener('click', (function(ri)
			{
				return function() { schemeData[listKey][ri].unshift(null); syncSchemeData(listKey); renderSchemeEditor(listKey); };
			})(rowIdx));

			var addKey = document.createElement('button');
			addKey.className = 'color-scheme-row__btn';
			addKey.title = 'Add colour key to last entry';
			addKey.textContent = 'key';
			addKey.addEventListener('click', (function(ri)
			{
				return function()
				{
					var row = schemeData[listKey][ri];
					var last = null;
					for (var j = row.length - 1; j >= 0; j--) { if (row[j] !== null) { last = row[j]; break; } }
					if (!last) return;

					var missing = null;
					for (var k = 0; k < schemeKeys.length; k++) { if (!last[schemeKeys[k]]) { missing = schemeKeys[k]; break; } }
					if (!missing) return;

					last[missing] = '#888888';
					syncSchemeData(listKey); renderSchemeEditor(listKey);
				};
			})(rowIdx));

			var removeRow = document.createElement('button');
			removeRow.className = 'color-scheme-row__btn';
			removeRow.textContent = '\u2212';
			removeRow.title = 'Remove row';
			removeRow.addEventListener('click', (function(ri)
			{
				return function() { schemeData[listKey].splice(ri, 1); syncSchemeData(listKey); renderSchemeEditor(listKey); };
			})(rowIdx));

			actions.appendChild(addNull);
			actions.appendChild(addEntry);
			actions.appendChild(addKey);
			actions.appendChild(removeRow);
			rowEl.appendChild(actions);

			el.appendChild(rowEl);
		});
	}

	function syncSchemeData(listKey)
	{
		if (schemeData[listKey].length > 0) { config[listKey] = JSON.parse(JSON.stringify(schemeData[listKey])); }
		else { delete config[listKey]; }
		notifyChange();
	}

	function setupSchemeEditor(listKey)
	{
		q('#' + listKey + '-addRow').addEventListener('click', function()
		{
			schemeData[listKey].push([null, { fill: '#f5f5f5', stroke: '#666666' }]);
			syncSchemeData(listKey); renderSchemeEditor(listKey);
		});
		renderSchemeEditor(listKey);
	}

	// ============================================
	// TAG LISTS
	// ============================================
	function renderTagList(listKey)
	{
		var el = q('#' + listKey + '-tags');
		var html = '';

		tagLists[listKey].forEach(function(item, i)
		{
			html += '<span class="tag"><span>' + escapeHtml(item) + '</span>' +
				'<button type="button" class="tag__remove" data-list="' + listKey + '" data-index="' + i + '">&times;</button></span>';
		});

		el.innerHTML = html;

		el.querySelectorAll('.tag__remove').forEach(function(btn)
		{
			btn.addEventListener('click', function()
			{
				tagLists[btn.getAttribute('data-list')].splice(parseInt(btn.getAttribute('data-index')), 1);
				syncTagList(btn.getAttribute('data-list'));
				renderTagList(btn.getAttribute('data-list'));
			});
		});
	}

	function syncTagList(listKey)
	{
		if (tagLists[listKey].length > 0) { config[listKey] = tagLists[listKey].slice(); }
		else { delete config[listKey]; }
		notifyChange();
	}

	function setupTagList(listKey)
	{
		var input = q('#' + listKey + '-input');
		var addBtn = q('#' + listKey + '-add');

		function addItem()
		{
			var val = input.value.trim();
			if (val) { tagLists[listKey].push(val); input.value = ''; syncTagList(listKey); renderTagList(listKey); }
		}

		addBtn.addEventListener('click', addItem);
		input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); addItem(); } });
		renderTagList(listKey);
	}

	// ============================================
	// DEFAULT MACRO PARAMETERS
	// ============================================
	// A defaultMacroParameters editor appears in both the Confluence Cloud and
	// Server/DC sections, distinguished by id prefix. The two sections expose
	// different parameter sets (e.g. Cloud has zoom/center/hiResPreview, DC has
	// width/border) but both edit the single config.defaultMacroParameters
	// object. Each editor only touches the keys in its own spec and preserves
	// the rest, and edits are mirrored into the other section's UI so the two
	// stay in sync for the keys they share.
	var macroParamSpecs = {
		'cfg-dmp': { selects: ['toolbarStyle', 'links'], numbers: ['width'], booleans: ['border', 'lightbox', 'simpleViewer'] },
		'cfg-cdmp': { selects: ['tbstyle', 'links'], numbers: ['zoom'], booleans: ['lbox', 'simple', 'pCenter', 'hiResPreview'] }
	};
	var macroParamPrefixes = ['cfg-cdmp', 'cfg-dmp'];

	function populateMacroParams(prefix)
	{
		var dmp = config.defaultMacroParameters || {};
		var spec = macroParamSpecs[prefix];

		spec.selects.forEach(function(prop)
		{
			q('#' + prefix + '-' + prop).value = dmp[prop] || '';
		});

		spec.numbers.forEach(function(prop)
		{
			q('#' + prefix + '-' + prop).value = (dmp[prop] !== undefined) ? dmp[prop] : '';
		});

		spec.booleans.forEach(function(prop)
		{
			var cb = q('#' + prefix + '-' + prop);

			if (dmp[prop] !== undefined)
			{
				cb.checked = dmp[prop]; cb.indeterminate = false;
				cb.dataset.cycleState = dmp[prop] ? 'checked' : 'unchecked';
			}
			else
			{
				cb.checked = false; cb.indeterminate = true;
				cb.dataset.cycleState = 'indeterminate';
			}
		});
	}

	function setupMacroParams(prefix)
	{
		var spec = macroParamSpecs[prefix];

		function updateMacroParams()
		{
			// Preserve keys owned by the other section's spec
			var params = config.defaultMacroParameters ?
				JSON.parse(JSON.stringify(config.defaultMacroParameters)) : {};

			spec.selects.forEach(function(prop)
			{
				var el = q('#' + prefix + '-' + prop);
				if (el.value) { params[prop] = el.value; } else { delete params[prop]; }
			});

			spec.numbers.forEach(function(prop)
			{
				var el = q('#' + prefix + '-' + prop);
				if (el.value) { params[prop] = parseInt(el.value); } else { delete params[prop]; }
			});

			spec.booleans.forEach(function(prop)
			{
				var el = q('#' + prefix + '-' + prop);
				if (el.indeterminate === false) { params[prop] = el.checked; } else { delete params[prop]; }
			});

			if (Object.keys(params).length > 0) { config.defaultMacroParameters = params; }
			else { delete config.defaultMacroParameters; }

			macroParamPrefixes.forEach(function(other)
			{
				if (other !== prefix) { populateMacroParams(other); }
			});

			notifyChange();
		}

		spec.booleans.forEach(function(prop)
		{
			var cb = q('#' + prefix + '-' + prop);
			cb.indeterminate = true;
			cb.dataset.cycleState = 'indeterminate';

			cb.addEventListener('click', function()
			{
				if (cb.dataset.cycleState === 'indeterminate')
				{
					cb.checked = true; cb.indeterminate = false; cb.dataset.cycleState = 'checked';
				}
				else if (cb.dataset.cycleState === 'checked')
				{
					cb.checked = false; cb.indeterminate = false; cb.dataset.cycleState = 'unchecked';
				}
				else
				{
					cb.checked = false; cb.indeterminate = true; cb.dataset.cycleState = 'indeterminate';
				}
				updateMacroParams();
			});

			cb.addEventListener('mousedown', function(e) { e.preventDefault(); });
		});

		spec.selects.forEach(function(prop)
		{
			q('#' + prefix + '-' + prop).addEventListener('change', updateMacroParams);
		});

		spec.numbers.forEach(function(prop)
		{
			q('#' + prefix + '-' + prop).addEventListener('input', updateMacroParams);
		});
	}

	// ============================================
	// IMPORT / POPULATE
	// ============================================
	function importConfig(obj)
	{
		obj = obj || {};
		config = {};
		fontLists = { defaultFonts: [], customFonts: [] };
		colorLists = { presetColors: [], customPresetColors: [], defaultColors: [] };
		tagLists = { enabledLibraries: [], defaultCustomLibraries: [], hideMenuItems: [], hideMenus: [], enabledTemplateSections: [], defaultLanguages: [] };
		schemeData = { defaultColorSchemes: [], customColorSchemes: [] };

		Object.keys(obj).forEach(function(key)
		{
			var val = obj[key];

			if (key === 'defaultFonts' || key === 'customFonts')
			{
				if (Array.isArray(val))
				{
					// Keep entries as-is so {fontFamily, fontUrl} objects
					// survive chip editing (names derived in renderFontTags)
					fontLists[key] = val.slice();
					config[key] = val;
				}
				return;
			}

			if (key === 'presetColors' || key === 'customPresetColors' || key === 'defaultColors')
			{
				if (Array.isArray(val)) { colorLists[key] = val.map(function(c) { return c || ''; }); config[key] = val; }
				return;
			}

			if (key === 'defaultColorSchemes' || key === 'customColorSchemes')
			{
				if (Array.isArray(val)) { schemeData[key] = JSON.parse(JSON.stringify(val)); config[key] = val; }
				return;
			}

			if (key === 'enabledLibraries' || key === 'defaultCustomLibraries' || key === 'hideMenuItems' || key === 'hideMenus' || key === 'enabledTemplateSections' || key === 'defaultLanguages')
			{
				if (Array.isArray(val)) { tagLists[key] = val.map(function(v) { return String(v); }); config[key] = val; }
				return;
			}

			config[key] = val;
		});

		populateFields();
	}

	function populateFields()
	{
		qAll('.input--invalid').forEach(clearFieldInvalid);
		invalidFields = {};

		qAll('[data-key]').forEach(function(el)
		{
			if (el.closest('.tri-toggle')) return;

			var key = el.getAttribute('data-key');
			var isJson = el.getAttribute('data-type') === 'json';

			if (config[key] !== undefined)
			{
				el.value = isJson ? JSON.stringify(config[key], null, 2) : config[key];
			}
			else
			{
				el.value = '';
			}
		});

		var tooltipWidthEl = q('#cfg-tooltipMaxWidth');
		var tooltipCheckEl = q('#cfg-tooltipMaxWidthEnabled');

		if (config.tooltipMaxWidth !== undefined)
		{
			var enabled = config.tooltipMaxWidth > 0;
			tooltipCheckEl.checked = enabled;
			tooltipWidthEl.disabled = !enabled;
			tooltipWidthEl.value = enabled ? config.tooltipMaxWidth : '';
		}
		else
		{
			tooltipCheckEl.checked = true;
			tooltipWidthEl.disabled = false;
			tooltipWidthEl.value = '';
		}

		if (config.pageFormat)
		{
			q('#cfg-pageFormatWidth').value = config.pageFormat.width || '';
			q('#cfg-pageFormatHeight').value = config.pageFormat.height || '';
		}
		else
		{
			q('#cfg-pageFormatWidth').value = '';
			q('#cfg-pageFormatHeight').value = '';
		}

		var darkColor = config.darkColor || '';
		if (/^#[0-9A-Fa-f]{6}$/.test(darkColor)) { q('#cfg-darkColorPicker').value = darkColor; }

		var shadowColor = config.shadowColor || '';
		if (/^#[0-9A-Fa-f]{6}$/.test(shadowColor)) { q('#cfg-shadowColorPicker').value = shadowColor; }

		['defaultGridColor', 'defaultDarkGridColor', 'defaultPageBackgroundColor',
			'defaultDarkPageBackgroundColor'].forEach(function(key)
		{
			var color = config[key] || '';
			if (/^#[0-9A-Fa-f]{6}$/.test(color)) { q('#cfg-' + key + 'Picker').value = color; }
		});

		qAll('.tri-toggle').forEach(function(toggle)
		{
			var key = toggle.getAttribute('data-key');
			var value = config[key];

			toggle.querySelectorAll('button').forEach(function(btn) { btn.className = ''; });

			if (value === true) { toggle.querySelector('[data-value="true"]').className = 'active--true'; }
			else if (value === false) { toggle.querySelector('[data-value="false"]').className = 'active--false'; }
			else { toggle.querySelector('[data-value="unset"]').className = 'active--unset'; }
		});

		['defaultFonts', 'customFonts'].forEach(renderFontTags);
		['presetColors', 'customPresetColors', 'defaultColors'].forEach(renderColorSwatches);
		['enabledLibraries', 'defaultCustomLibraries', 'hideMenuItems', 'hideMenus', 'enabledTemplateSections', 'defaultLanguages'].forEach(renderTagList);
		['defaultColorSchemes', 'customColorSchemes'].forEach(renderSchemeEditor);

		macroParamPrefixes.forEach(populateMacroParams);
	}

	// ============================================
	// SEARCH
	// ============================================
	var searchInput = q('#searchInput');
	var searchCount = q('#searchCount');
	var searchIndex = [];

	function buildSearchIndex()
	{
		searchIndex = [];

		qAll('.toggle-field').forEach(function(el)
		{
			var toggle = el.querySelector('.tri-toggle');
			var key = toggle ? toggle.getAttribute('data-key') : '';
			var name = el.querySelector('.toggle-field__name');
			var help = el.querySelector('.toggle-field__help');
			var section = el.closest('.config-section');
			var text = (key + ' ' + (name ? name.textContent : '') + ' ' + (help ? help.textContent : '')).toLowerCase();
			searchIndex.push({ element: el, section: section, keywords: text, type: 'toggle' });
		});

		qAll('.config-section .field').forEach(function(el)
		{
			if (el.parentElement.classList.contains('field-row')) return;
			var section = el.closest('.config-section');
			var text = el.textContent.toLowerCase();
			el.querySelectorAll('[data-key]').forEach(function(inp) { text += ' ' + inp.getAttribute('data-key').toLowerCase(); });
			if (el.hasAttribute('data-search')) { text += ' ' + el.getAttribute('data-search').toLowerCase(); }
			searchIndex.push({ element: el, section: section, keywords: text, type: 'field' });
		});

		qAll('.config-section .field-row').forEach(function(el)
		{
			var section = el.closest('.config-section');
			var text = el.textContent.toLowerCase();
			el.querySelectorAll('[data-key]').forEach(function(inp) { text += ' ' + inp.getAttribute('data-key').toLowerCase(); });
			el.querySelectorAll('input, select, textarea').forEach(function(inp)
			{
				if (inp.id) text += ' ' + inp.id.replace('cfg-', '').replace('cfg-dmp-', '').toLowerCase();
			});
			if (el.hasAttribute('data-search')) { text += ' ' + el.getAttribute('data-search').toLowerCase(); }
			searchIndex.push({ element: el, section: section, keywords: text, type: 'field-row' });
		});

		qAll('.config-section').forEach(function(el)
		{
			var title = el.querySelector('.card__title');
			if (title) { searchIndex.push({ element: el, section: el, keywords: title.textContent.toLowerCase(), type: 'section-title' }); }
		});
	}

	function performSearch(query)
	{
		query = query.trim().toLowerCase();

		if (!query)
		{
			qAll('.config-section, .toggle-field, .field, .field-row').forEach(function(el)
			{
				el.classList.remove('search-hidden');
			});
			searchCount.textContent = '';
			return;
		}

		var terms = query.split(/\s+/);
		var matchedSections = new Set();
		var matchedElements = new Set();
		var matchCount = 0;

		searchIndex.forEach(function(entry)
		{
			var matches = terms.every(function(term) { return entry.keywords.indexOf(term) > -1; });

			if (matches)
			{
				matchedElements.add(entry.element);
				matchedSections.add(entry.section);
				if (entry.type !== 'section-title') { matchCount++; }
			}
		});

		qAll('.config-section').forEach(function(s)
		{
			s.classList.toggle('search-hidden', !matchedSections.has(s));
		});

		searchIndex.forEach(function(entry)
		{
			if (entry.type === 'section-title' || !matchedSections.has(entry.section)) return;

			var sectionMatchedByTitle = false;
			searchIndex.forEach(function(e2)
			{
				if (e2.type === 'section-title' && e2.section === entry.section && matchedElements.has(e2.element))
				{
					sectionMatchedByTitle = true;
				}
			});

			if (sectionMatchedByTitle) { entry.element.classList.remove('search-hidden'); return; }
			entry.element.classList.toggle('search-hidden', !matchedElements.has(entry.element));
		});

		searchCount.textContent = matchCount + ' result' + (matchCount !== 1 ? 's' : '');
	}

	var searchTimeout;
	searchInput.addEventListener('input', function()
	{
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(function() { performSearch(searchInput.value); }, 150);
	});

	searchInput.addEventListener('keydown', function(e)
	{
		if (e.key === 'Escape') { searchInput.value = ''; performSearch(''); searchInput.blur(); }
	});

	// ============================================
	// CURRENT STYLE BUTTONS
	// ============================================
	function setupCurrentStyleButtons()
	{
		var items = [
			{ btnId: 'useCurrentVertexStyle', textareaId: 'cfg-defaultVertexStyle', key: 'currentVertexStyle' },
			{ btnId: 'useCurrentEdgeStyle', textareaId: 'cfg-defaultEdgeStyle', key: 'currentEdgeStyle' }
		];

		items.forEach(function(item)
		{
			var style = editorContext[item.key];

			if (style != null && typeof style === 'object' && Object.keys(style).length > 0)
			{
				var btn = q('#' + item.btnId);
				btn.style.display = '';

				btn.addEventListener('click', function()
				{
					var textarea = q('#' + item.textareaId);
					textarea.value = JSON.stringify(style, null, 2);
					textarea.dispatchEvent(new Event('input'));
				});
			}
		});
	}

	// ============================================
	// INIT
	// ============================================
	renderToggles();
	setupFieldHandlers();
	setupColorSync();
	setupPageFormat();
	setupTooltipMaxWidth();
	setupFontList('defaultFonts');
	setupFontList('customFonts');
	setupColorList('presetColors');
	setupColorList('customPresetColors');
	setupColorList('defaultColors');
	setupTagList('enabledLibraries');
	setupTagList('defaultCustomLibraries');
	setupTagList('hideMenuItems');
	setupTagList('hideMenus');
	setupTagList('enabledTemplateSections');
	setupTagList('defaultLanguages');
	setupSchemeEditor('defaultColorSchemes');
	setupSchemeEditor('customColorSchemes');
	macroParamPrefixes.forEach(setupMacroParams);
	setupCurrentStyleButtons();
	buildSearchIndex();

	importConfig(options.initialConfig || {});

	if (options.darkMode)
	{
		container.classList.add('dark');
	}

	if (options.highContrast)
	{
		container.classList.add('high-contrast');
	}

	return {
		setConfig: function(obj) { importConfig(obj || {}); },
		getConfig: function() { return JSON.parse(JSON.stringify(config)); },
		getInvalidFields: function()
		{
			return Object.keys(invalidFields).map(function(key) { return invalidFields[key]; });
		},
		setDarkMode: function(dark)
		{
			container.classList.toggle('dark', !!dark);
		},
		setHighContrast: function(hc)
		{
			container.classList.toggle('high-contrast', !!hc);
		}
	};
};

// ============================================
// CSS (scoped to .geConfigEditor)
// ============================================
DrawioConfigEditor.css = [
	'.geConfigEditor {',
	'  --drawio-blue: #29b6f2;',
	'  --drawio-blue-hover: #1aa3e0;',
	'  --color-bg: #f0f0f0;',
	'  --color-bg-dark: #2a2a2a;',
	'  --color-bg-secondary: #e4e4e4;',
	'  --color-bg-secondary-dark: #333333;',
	'  --color-bg-tertiary: #dadada;',
	'  --color-bg-tertiary-dark: #3d3d3d;',
	'  --color-input: #ffffff;',
	'  --color-input-dark: #1e2022;',
	'  --color-text: #3F3F3F;',
	'  --color-text-dark: #C0C0C0;',
	'  --color-text-secondary: #6c757d;',
	'  --color-text-secondary-dark: #999999;',
	'  --color-border: #dadada;',
	'  --color-border-dark: #404040;',
	'  --color-border-focus: var(--drawio-blue);',
	'  --color-success: #198754;',
	'  --color-error: #dc3545;',
	'  --color-warning-bg: #fff3cd;',
	'  --color-scrollbar: #e2e2e2;',
	'  --color-scrollbar-dark: #3d3d3d;',
	'  --color-scrollbar-hover: #959798;',
	'  --color-scrollbar-hover-dark: #555555;',
	'  --spacing-xs: 4px;',
	'  --spacing-sm: 8px;',
	'  --spacing-md: 12px;',
	'  --spacing-lg: 16px;',
	'  --radius-sm: 4px;',
	'  --radius-md: 6px;',
	'  --radius-lg: 8px;',
	'  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI Variable", "Segoe UI", system-ui, ui-sans-serif, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";',
	'  --font-family-mono: ui-monospace, SFMono-Regular, Consolas, monospace;',
	'  --font-size-xs: 11px;',
	'  --font-size-sm: 12px;',
	'  --font-size-base: 13px;',
	'  --transition-fast: 150ms ease;',
	'  font-family: var(--font-family);',
	'  font-size: var(--font-size-base);',
	'  background: light-dark(var(--color-bg), var(--color-bg-dark));',
	'  color: light-dark(var(--color-text), var(--color-text-dark));',
	'  line-height: 1.5;',
	'  overflow-y: auto;',
	'  padding: 0 8px;',
	'}',
	'.geConfigEditor { box-sizing: border-box; margin: 0; }',
	'.geConfigEditor *, .geConfigEditor *::before, .geConfigEditor *::after { box-sizing: border-box; margin: 0; padding: 0; }',
	'.geConfigEditor.dark { color-scheme: dark; }',
	'.geConfigEditor::-webkit-scrollbar, .geConfigEditor ::-webkit-scrollbar { width: 10px; height: 10px; }',
	'.geConfigEditor::-webkit-scrollbar-track, .geConfigEditor ::-webkit-scrollbar-track { background-clip: padding-box; border: solid transparent; border-width: 1px; }',
	'.geConfigEditor::-webkit-scrollbar-corner, .geConfigEditor ::-webkit-scrollbar-corner { background-color: transparent; }',
	'.geConfigEditor::-webkit-scrollbar-thumb, .geConfigEditor ::-webkit-scrollbar-thumb { background-color: light-dark(var(--color-scrollbar), var(--color-scrollbar-dark)); background-clip: padding-box; border: solid transparent; border-radius: 4px; }',
	'.geConfigEditor::-webkit-scrollbar-thumb:hover, .geConfigEditor ::-webkit-scrollbar-thumb:hover { background-color: light-dark(var(--color-scrollbar-hover), var(--color-scrollbar-hover-dark)); }',
	'.geConfigEditor input[type="text"], .geConfigEditor input[type="url"], .geConfigEditor input[type="number"], .geConfigEditor textarea, .geConfigEditor select {',
	'  font-family: inherit;',
	'  font-size: var(--font-size-base);',
	'  padding: 5px 8px;',
	'  border: 1px solid light-dark(var(--color-border), var(--color-border-dark));',
	'  border-radius: var(--radius-md);',
	'  background: light-dark(var(--color-input), var(--color-input-dark));',
	'  color: light-dark(var(--color-text), var(--color-text-dark));',
	'  width: 100%;',
	'  transition: border-color var(--transition-fast);',
	'}',
	'.geConfigEditor input:focus, .geConfigEditor textarea:focus, .geConfigEditor select:focus {',
	'  outline: none;',
	'  border-color: var(--color-border-focus);',
	'  box-shadow: 0 0 0 2px rgba(41, 182, 242, 0.15);',
	'}',
	'.geConfigEditor textarea { font-family: var(--font-family-mono); resize: vertical; min-height: 60px; }',
	'.geConfigEditor input.input--invalid, .geConfigEditor textarea.input--invalid { border-color: var(--color-error); }',
	'.geConfigEditor input.input--invalid:focus, .geConfigEditor textarea.input--invalid:focus { border-color: var(--color-error); box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.15); }',
	'.geConfigEditor label { display: block; font-weight: 500; margin-bottom: 2px; font-size: var(--font-size-sm); }',
	'.geConfigEditor .btn {',
	'  display: inline-flex; align-items: center; padding: 4px 8px;',
	'  font-family: inherit; font-size: var(--font-size-xs); font-weight: 500;',
	'  border: none; border-radius: var(--radius-md); cursor: pointer;',
	'}',
	'.geConfigEditor .btn--secondary { background: light-dark(var(--color-bg-tertiary), var(--color-bg-tertiary-dark)); color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark)); }',
	'.geConfigEditor .btn--secondary:hover { background: light-dark(var(--color-border), var(--color-border-dark)); }',
	'.geConfigEditor .btn--sm { padding: 3px 6px; font-size: var(--font-size-xs); }',
	'.geConfigEditor .btn-group { display: flex; flex-wrap: wrap; gap: 4px; }',
	'.geConfigEditor .card {',
	'  background: light-dark(var(--color-bg), var(--color-bg-dark)); border: 1px solid light-dark(var(--color-border), var(--color-border-dark));',
	'  border-radius: var(--radius-lg); overflow: hidden; margin-bottom: var(--spacing-lg);',
	'}',
	'.geConfigEditor .card__header {',
	'  padding: 6px var(--spacing-md); border-bottom: 1px solid light-dark(var(--color-border), var(--color-border-dark));',
	'  background: light-dark(var(--color-bg-secondary), var(--color-bg-secondary-dark));',
	'}',
	'.geConfigEditor .card__title { font-size: var(--font-size-base); font-weight: 600; margin: 0; }',
	'.geConfigEditor .card__body { padding: var(--spacing-md); display: flex; flex-direction: column; gap: var(--spacing-md); }',
	'.geConfigEditor .field { display: flex; flex-direction: column; gap: 2px; }',
	'.geConfigEditor .field__help { font-size: var(--font-size-xs); color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark)); margin: 0; line-height: 1.3; }',
	'.geConfigEditor .field__error { font-size: var(--font-size-xs); color: var(--color-error); margin: 0; line-height: 1.3; font-weight: 500; }',
	'.geConfigEditor .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }',
	'.geConfigEditor .toggle-field {',
	'  display: flex; align-items: center; justify-content: space-between;',
	'  padding: 4px 0; border-bottom: 1px solid light-dark(var(--color-border), var(--color-border-dark));',
	'}',
	'.geConfigEditor .toggle-field:last-child { border-bottom: none; }',
	'.geConfigEditor .card__body > * + .toggle-list { border-top: 1px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'.geConfigEditor .toggle-field__label { display: flex; flex-direction: column; gap: 1px; flex: 1; margin-bottom: 0; }',
	'.geConfigEditor .toggle-field__name { font-weight: 500; font-size: var(--font-size-sm); }',
	'.geConfigEditor .toggle-field__help { font-size: var(--font-size-xs); color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark)); }',
	'.geConfigEditor .toggle-field__experimental {',
	'  display: inline-block; margin-left: 4px; padding: 0 5px; border-radius: 8px; vertical-align: middle;',
	'  font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em;',
	'  color: light-dark(#8a5a00, #f0b429); background: light-dark(#fff3d6, rgba(240, 180, 41, 0.15));',
	'}',
	'.geConfigEditor .toggle-field__helplink {',
	'  display: inline-flex; align-items: center; justify-content: center; width: 13px; height: 13px;',
	'  margin-left: 4px; border-radius: 50%; vertical-align: middle; text-decoration: none;',
	'  font-size: 9px; font-weight: 700; line-height: 1;',
	'  color: light-dark(#fff, #1a1a1a); background: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark));',
	'}',
	'.geConfigEditor .tri-toggle {',
	'  display: inline-flex; border: 1px solid light-dark(var(--color-border), var(--color-border-dark));',
	'  border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;',
	'}',
	'.geConfigEditor .tri-toggle button {',
	'  padding: 3px 8px; font-size: var(--font-size-xs); border: none;',
	'  background: light-dark(var(--color-input), var(--color-input-dark)); color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark));',
	'  cursor: pointer; font-family: inherit; transition: all var(--transition-fast);',
	'}',
	'.geConfigEditor .tri-toggle button + button { border-left: 1px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'.geConfigEditor .tri-toggle button.active--unset { background: light-dark(var(--color-bg-tertiary), var(--color-bg-tertiary-dark)); color: light-dark(var(--color-text), var(--color-text-dark)); font-weight: 500; }',
	'.geConfigEditor .tri-toggle button.active--true { background: var(--color-success); color: #fff; font-weight: 500; }',
	'.geConfigEditor .tri-toggle button.active--false { background: var(--color-error); color: #fff; font-weight: 500; }',
	'.geConfigEditor .color-list { display: flex; flex-wrap: wrap; gap: 3px; padding: 4px 0; min-height: 24px; }',
	'.geConfigEditor .color-swatch {',
	'  width: 22px; height: 22px; border-radius: var(--radius-sm);',
	'  border: 1px solid light-dark(var(--color-border), var(--color-border-dark)); cursor: pointer; position: relative;',
	'  transition: transform var(--transition-fast);',
	'}',
	'.geConfigEditor .color-swatch:hover { transform: scale(1.15); box-shadow: 0 0 0 2px var(--drawio-blue); }',
	'.geConfigEditor .color-swatch__delete {',
	'  position: absolute; top: -5px; right: -5px; width: 12px; height: 12px;',
	'  background: var(--color-error); color: #fff; border: none; border-radius: 50%;',
	'  font-size: 9px; line-height: 12px; text-align: center; cursor: pointer; display: none; padding: 0;',
	'}',
	'.geConfigEditor .color-swatch:hover .color-swatch__delete { display: block; }',
	'.geConfigEditor .color-swatch__picker {',
	'  position: absolute; top: 0; left: 0; width: 100%; height: 100%;',
	'  opacity: 0; cursor: pointer; border: none; padding: 0;',
	'}',
	'.geConfigEditor .color-scheme-editor { display: flex; flex-direction: column; gap: 4px; }',
	'.geConfigEditor .color-scheme-row {',
	'  display: flex; flex-wrap: wrap; gap: 3px; align-items: center;',
	'  padding: 3px 6px; background: light-dark(var(--color-bg-secondary), var(--color-bg-secondary-dark));',
	'  border: 1px solid light-dark(var(--color-border), var(--color-border-dark)); border-radius: var(--radius-sm);',
	'}',
	'.geConfigEditor .color-scheme-row__label { font-size: var(--font-size-xs); color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark)); min-width: 20px; text-align: center; }',
	'.geConfigEditor .color-scheme-entry {',
	'  display: flex; align-items: center; gap: 3px; padding: 1px 4px;',
	'  background: light-dark(var(--color-bg), var(--color-bg-dark)); border: 1px solid light-dark(var(--color-border), var(--color-border-dark));',
	'  border-radius: var(--radius-sm); font-size: var(--font-size-xs);',
	'}',
	'.geConfigEditor .color-scheme-entry__swatch {',
	'  width: 14px; height: 14px; border-radius: 2px;',
	'  border: 1px solid light-dark(var(--color-border), var(--color-border-dark)); position: relative; cursor: pointer; flex-shrink: 0;',
	'}',
	'.geConfigEditor .color-scheme-entry__swatch input[type="color"] {',
	'  position: absolute; top: 0; left: 0; width: 100%; height: 100%;',
	'  opacity: 0; cursor: pointer; border: none; padding: 0;',
	'}',
	'.geConfigEditor .color-scheme-entry__key { color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark)); }',
	'.geConfigEditor .color-scheme-entry__remove {',
	'  background: none; border: none; cursor: pointer;',
	'  color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark)); font-size: 11px; padding: 0 1px; line-height: 1;',
	'}',
	'.geConfigEditor .color-scheme-entry__remove:hover { color: var(--color-error); }',
	'.geConfigEditor .color-scheme-row__actions { display: flex; gap: 2px; margin-left: auto; }',
	'.geConfigEditor .color-scheme-row__btn {',
	'  background: none; border: 1px solid light-dark(var(--color-border), var(--color-border-dark));',
	'  border-radius: var(--radius-sm); cursor: pointer;',
	'  font-size: var(--font-size-xs); padding: 1px 5px; color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark));',
	'}',
	'.geConfigEditor .color-scheme-row__btn:hover { background: light-dark(var(--color-bg-tertiary), var(--color-bg-tertiary-dark)); color: light-dark(var(--color-text), var(--color-text-dark)); }',
	'.geConfigEditor .tag-list { display: flex; flex-wrap: wrap; gap: 3px; }',
	'.geConfigEditor .tag {',
	'  display: inline-flex; align-items: center; gap: 3px;',
	'  padding: 1px 6px; background: light-dark(var(--color-bg-tertiary), var(--color-bg-tertiary-dark));',
	'  border-radius: var(--radius-sm); font-size: var(--font-size-xs);',
	'}',
	'.geConfigEditor .tag__remove {',
	'  background: none; border: none; cursor: pointer;',
	'  color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark)); font-size: 13px; padding: 0 1px; line-height: 1;',
	'}',
	'.geConfigEditor .tag__remove:hover { color: var(--color-error); }',
	'.geConfigEditor .tag__link { color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark)); font-size: 9px; line-height: 1; }',
	'.geConfigEditor .tag-input-wrap { display: flex; gap: 4px; margin-top: 4px; }',
	'.geConfigEditor .tag-input-wrap input { flex: 1; }',
	'.geConfigEditor .search-box { position: sticky; top: 0; z-index: 50; background: light-dark(var(--color-bg), var(--color-bg-dark)); padding: 6px 0 8px; }',
	'.geConfigEditor .search-box input { font-size: var(--font-size-base); padding: 6px 10px; }',
	'.geConfigEditor .search-box__count { font-size: var(--font-size-xs); color: light-dark(var(--color-text-secondary), var(--color-text-secondary-dark)); margin-top: 2px; }',
	'.geConfigEditor .config-section.search-hidden, .geConfigEditor .toggle-field.search-hidden,',
	'.geConfigEditor .field.search-hidden, .geConfigEditor .field-row.search-hidden { display: none; }',
	'.geConfigEditor .mt-sm { margin-top: 4px; }',
	'.geConfigEditor .mb-sm { margin-bottom: 4px; }',
	'.geConfigEditor .checkbox { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }',
	'.geConfigEditor .checkbox input { width: auto; margin: 0; }',
	'@supports (scrollbar-color: auto) {',
	'  .geConfigEditor { scrollbar-color: light-dark(var(--color-scrollbar), var(--color-scrollbar-dark)) transparent; scrollbar-width: thin; }',
	'}',
	'@media (prefers-contrast: more) {',
	'  .geConfigEditor {',
	'    --color-bg: #ffffff;',
	'    --color-bg-dark: #000000;',
	'    --color-bg-secondary: #e0e0e0;',
	'    --color-bg-secondary-dark: #1a1a1a;',
	'    --color-bg-tertiary: #cccccc;',
	'    --color-bg-tertiary-dark: #2a2a2a;',
	'    --color-input: #ffffff;',
	'    --color-input-dark: #111111;',
	'    --color-text: #000000;',
	'    --color-text-dark: #ffffff;',
	'    --color-text-secondary: #333333;',
	'    --color-text-secondary-dark: #cccccc;',
	'    --color-border: #666666;',
	'    --color-border-dark: #999999;',
	'    --color-success: #006633;',
	'    --color-error: #cc0000;',
	'  }',
	'  .geConfigEditor input[type="text"], .geConfigEditor input[type="url"], .geConfigEditor input[type="number"], .geConfigEditor textarea, .geConfigEditor select {',
	'    border: 2px solid light-dark(var(--color-border), var(--color-border-dark));',
	'  }',
	'  .geConfigEditor .tri-toggle { border: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'  .geConfigEditor .tri-toggle button { font-weight: 600; }',
	'  .geConfigEditor .tri-toggle button + button { border-left: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'  .geConfigEditor .card { border: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'  .geConfigEditor .card__header { border-bottom: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'  .geConfigEditor .toggle-field { border-bottom: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'  .geConfigEditor .card__body > * + .toggle-list { border-top: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'}',
	'.geConfigEditor.high-contrast {',
	'  --color-bg: #ffffff;',
	'  --color-bg-dark: #000000;',
	'  --color-bg-secondary: #e0e0e0;',
	'  --color-bg-secondary-dark: #1a1a1a;',
	'  --color-bg-tertiary: #cccccc;',
	'  --color-bg-tertiary-dark: #2a2a2a;',
	'  --color-input: #ffffff;',
	'  --color-input-dark: #111111;',
	'  --color-text: #000000;',
	'  --color-text-dark: #ffffff;',
	'  --color-text-secondary: #333333;',
	'  --color-text-secondary-dark: #cccccc;',
	'  --color-border: #666666;',
	'  --color-border-dark: #999999;',
	'  --color-success: #006633;',
	'  --color-error: #cc0000;',
	'}',
	'.geConfigEditor.high-contrast input[type="text"],',
	'.geConfigEditor.high-contrast input[type="url"],',
	'.geConfigEditor.high-contrast input[type="number"],',
	'.geConfigEditor.high-contrast textarea,',
	'.geConfigEditor.high-contrast select {',
	'  border: 2px solid light-dark(var(--color-border), var(--color-border-dark));',
	'}',
	'.geConfigEditor.high-contrast .tri-toggle { border: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'.geConfigEditor.high-contrast .tri-toggle button { font-weight: 600; }',
	'.geConfigEditor.high-contrast .tri-toggle button + button { border-left: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'.geConfigEditor.high-contrast .card { border: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'.geConfigEditor.high-contrast .card__header { border-bottom: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'.geConfigEditor.high-contrast .toggle-field { border-bottom: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'.geConfigEditor.high-contrast .card__body > * + .toggle-list { border-top: 2px solid light-dark(var(--color-border), var(--color-border-dark)); }',
	'@media (forced-colors: active) {',
	'  .geConfigEditor input[type="text"], .geConfigEditor input[type="url"], .geConfigEditor input[type="number"], .geConfigEditor textarea, .geConfigEditor select {',
	'    border: 2px solid ButtonText;',
	'    background: Field;',
	'    color: FieldText;',
	'  }',
	'  .geConfigEditor .card { border: 2px solid ButtonText; }',
	'  .geConfigEditor .card__header { background: Canvas; border-bottom: 2px solid ButtonText; forced-color-adjust: none; }',
	'  .geConfigEditor .tri-toggle { border: 2px solid ButtonText; }',
	'  .geConfigEditor .tri-toggle button { background: ButtonFace; color: ButtonText; border-color: ButtonText; }',
	'  .geConfigEditor .tri-toggle button.active--true,',
	'  .geConfigEditor .tri-toggle button.active--false { background: Highlight; color: HighlightText; }',
	'  .geConfigEditor .tri-toggle button.active--unset { background: ButtonFace; color: ButtonText; outline: 2px solid Highlight; outline-offset: -2px; }',
	'  .geConfigEditor .btn--secondary { border: 1px solid ButtonText; }',
	'  .geConfigEditor .toggle-field { border-bottom: 1px solid ButtonText; }',
	'  .geConfigEditor .card__body > * + .toggle-list { border-top: 1px solid ButtonText; }',
	'  .geConfigEditor .search-box { background: Canvas; }',
	'  .geConfigEditor { background: Canvas; color: CanvasText; }',
	'}'
].join('\n');

// ============================================
// HTML TEMPLATE
// ============================================
DrawioConfigEditor.html = [
	'<div class="search-box" id="searchBox">',
	'  <input type="text" id="searchInput" placeholder="">',
	'  <div class="search-box__count" id="searchCount"></div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionGeneral"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-version"></label>',
	'          <input type="text" id="cfg-version" data-key="version" placeholder="e.g. 1.0">',
	'          <p class="field__help"></p>',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-settingsName"></label>',
	'          <input type="text" id="cfg-settingsName" data-key="settingsName" placeholder=".drawio-config">',
	'          <p class="field__help"></p>',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-keyboardShortcuts"></label>',
	'        <textarea id="cfg-keyboardShortcuts" data-key="keyboardShortcuts" data-type="json" placeholder=\'[{"keyCode": "T", "control": true, "shift": true, "action": "tags"}]\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-resources"></label>',
	'        <textarea id="cfg-resources" data-key="resources" data-type="json" placeholder=\'{"saveAs": {"main": "Save a Copy", "de": "Kopie speichern"}, "myKey": "My Text"}\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'      <div class="field">',
	'        <label data-i18n="cfgDefaultLanguages"></label>',
	'        <div class="tag-list" id="defaultLanguages-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="defaultLanguages-input" placeholder="e.g. de, fr">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="defaultLanguages-add" data-i18n="add"></button>',
	'        </div>',
	'        <p class="field__help" data-i18n="cfgDefaultLanguagesHelp"></p>',
	'      </div>',
	'      <div id="general-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionCanvasGrid"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-defaultGridSize"></label>',
	'          <input type="number" id="cfg-defaultGridSize" data-key="defaultGridSize" placeholder="10" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-gridSteps"></label>',
	'          <input type="number" id="cfg-gridSteps" data-key="gridSteps" placeholder="e.g. 4" min="1">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-defaultGridColor"></label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="color" id="cfg-defaultGridColorPicker" value="#E6E6E6" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'            <input type="text" id="cfg-defaultGridColor" data-key="defaultGridColor" placeholder="#E6E6E6" style="flex: 1;">',
	'          </div>',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-defaultDarkGridColor"></label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="color" id="cfg-defaultDarkGridColorPicker" value="#424242" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'            <input type="text" id="cfg-defaultDarkGridColor" data-key="defaultDarkGridColor" placeholder="#424242" style="flex: 1;">',
	'          </div>',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-zoomFactor"></label>',
	'          <input type="number" id="cfg-zoomFactor" data-key="zoomFactor" placeholder="1.2" min="1.01" step="0.05">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-defaultEdgeLength"></label>',
	'          <input type="number" id="cfg-defaultEdgeLength" data-key="defaultEdgeLength" placeholder="80" min="1">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-foldingIconSize"></label>',
	'          <input type="number" id="cfg-foldingIconSize" data-key="foldingIconSize" placeholder="9" min="1">',
	'        </div>',
	'        <div class="field"></div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-tooltipFontSize"></label>',
	'          <input type="number" id="cfg-tooltipFontSize" data-key="tooltipFontSize" placeholder="11" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-tooltipMaxWidth"></label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="number" id="cfg-tooltipMaxWidth" placeholder="360" min="1" style="flex: 1;">',
	'            <label class="checkbox" style="white-space: nowrap;"><input type="checkbox" id="cfg-tooltipMaxWidthEnabled"> <span>Limit</span></label>',
	'          </div>',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-pageFormatWidth"></label>',
	'          <input type="number" id="cfg-pageFormatWidth" placeholder="850" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-pageFormatHeight"></label>',
	'          <input type="number" id="cfg-pageFormatHeight" placeholder="1100" min="1">',
	'        </div>',
	'      </div>',
	'      <p class="field__help" data-i18n="cfgPageFormatHeightHelp"></p>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-defaultPageBackgroundColor"></label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="color" id="cfg-defaultPageBackgroundColorPicker" value="#FFFFFF" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'            <input type="text" id="cfg-defaultPageBackgroundColor" data-key="defaultPageBackgroundColor" placeholder="#FFFFFF" style="flex: 1;">',
	'          </div>',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-defaultDarkPageBackgroundColor"></label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="color" id="cfg-defaultDarkPageBackgroundColorPicker" value="#121212" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'            <input type="text" id="cfg-defaultDarkPageBackgroundColor" data-key="defaultDarkPageBackgroundColor" placeholder="#121212" style="flex: 1;">',
	'          </div>',
	'        </div>',
	'      </div>',
	'      <div id="canvas-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionAppearance"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-darkColor"></label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="color" id="cfg-darkColorPicker" value="#2A2A2A" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'            <input type="text" id="cfg-darkColor" data-key="darkColor" placeholder="#2A2A2A" style="flex: 1;">',
	'          </div>',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-defaultAdaptiveColors"></label>',
	'          <select id="cfg-defaultAdaptiveColors" data-key="defaultAdaptiveColors">',
	'            <option value="">- Not set -</option>',
	'            <option value="auto">auto</option>',
	'            <option value="simple">simple</option>',
	'            <option value="none">none</option>',
	'          </select>',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-darkColorVar"></label>',
	'        <input type="text" id="cfg-darkColorVar" data-key="darkColorVar" placeholder="--ge-dark-color">',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-shadowColor"></label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="color" id="cfg-shadowColorPicker" value="#808080" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'            <input type="text" id="cfg-shadowColor" data-key="shadowColor" placeholder="#808080" style="flex: 1;">',
	'          </div>',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-shadowOpacity"></label>',
	'          <input type="number" id="cfg-shadowOpacity" data-key="shadowOpacity" placeholder="1" min="0" max="1" step="0.1">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-shadowOffsetX"></label>',
	'          <input type="number" id="cfg-shadowOffsetX" data-key="shadowOffsetX" placeholder="e.g. 2">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-shadowOffsetY"></label>',
	'          <input type="number" id="cfg-shadowOffsetY" data-key="shadowOffsetY" placeholder="e.g. 3">',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-shadowBlur"></label>',
	'        <input type="number" id="cfg-shadowBlur" data-key="shadowBlur" placeholder="e.g. 6" min="0">',
	'      </div>',
	'      <div id="appearance-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionSidebarPanels"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-thumbWidth"></label>',
	'          <input type="number" id="cfg-thumbWidth" data-key="thumbWidth" placeholder="46" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-thumbHeight"></label>',
	'          <input type="number" id="cfg-thumbHeight" data-key="thumbHeight" placeholder="46" min="1">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-sidebarWidth"></label>',
	'          <input type="number" id="cfg-sidebarWidth" data-key="sidebarWidth" placeholder="e.g. 250" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-sidebarTitleSize"></label>',
	'          <input type="number" id="cfg-sidebarTitleSize" data-key="sidebarTitleSize" placeholder="8" min="1">',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-shapePicker"></label>',
	'        <textarea id="cfg-shapePicker" data-key="shapePicker" data-type="json" placeholder=\'{"shapes": [...]}\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'      <div id="sidebar-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionLibraries"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label for="cfg-defaultLibraries"></label>',
	'        <input type="text" id="cfg-defaultLibraries" data-key="defaultLibraries" placeholder="general;uml;er;bpmn;flowchart;basic;arrows2">',
	'        <p class="field__help"></p>',
	'      </div>',
	'      <div class="field">',
	'        <label>Enabled Libraries</label>',
	'        <div class="tag-list" id="enabledLibraries-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="enabledLibraries-input" placeholder="Add library key (e.g. general, uml)...">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="enabledLibraries-add">Add</button>',
	'        </div>',
	'        <p class="field__help">Libraries available in More Shapes dialog. Leave empty for all.</p>',
	'      </div>',
	'      <div class="field">',
	'        <label>Default Custom Libraries</label>',
	'        <div class="tag-list" id="defaultCustomLibraries-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="defaultCustomLibraries-input" placeholder="Add library ID or URL...">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="defaultCustomLibraries-add">Add</button>',
	'        </div>',
	'        <p class="field__help">IDs or URLs of custom libraries to load on startup</p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-templateFile"></label>',
	'        <input type="url" id="cfg-templateFile" data-key="templateFile" placeholder="https://app.diagrams.net/templates/index.xml">',
	'      </div>',
	'      <div class="field">',
	'        <label>Template Sections</label>',
	'        <div class="tag-list" id="enabledTemplateSections-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="enabledTemplateSections-input" placeholder="Add section (e.g. business, charts)...">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="enabledTemplateSections-add">Add</button>',
	'        </div>',
	'        <p class="field__help" data-i18n="cfgTemplateFileHelp"></p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-customTemplates"></label>',
	'        <textarea id="cfg-customTemplates" data-key="customTemplates" data-type="json" placeholder=\'[{"section": "basic", "url": "https://example.com/template.xml", "title": "My Template", "preview": "https://example.com/template.png"}]\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-libraries"></label>',
	'        <textarea id="cfg-libraries" data-key="libraries" data-type="json" placeholder=\'[{"title": {"main": "Company"}, "entries": [...]}]\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'      <div id="library-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionFonts"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label>Default Fonts</label>',
	'        <div class="tag-list" id="defaultFonts-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="defaultFonts-input" placeholder="Add font name...">',
	'          <input type="text" id="defaultFonts-url" placeholder="Font URL (optional)">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="defaultFonts-add">Add</button>',
	'        </div>',
	'        <p class="field__help">Font names for the format panel font picker; add a URL for web fonts (e.g. a Google Fonts CSS link)</p>',
	'      </div>',
	'      <div class="field">',
	'        <label>Custom Fonts</label>',
	'        <div class="tag-list" id="customFonts-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="customFonts-input" placeholder="Add font name...">',
	'          <input type="text" id="customFonts-url" placeholder="Font URL (optional)">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="customFonts-add">Add</button>',
	'        </div>',
	'        <p class="field__help">Additional fonts added before default fonts; add a URL for web fonts (e.g. a Google Fonts CSS link)</p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-fontCss"></label>',
	'        <textarea id="cfg-fontCss" data-key="fontCss" placeholder="@font-face { font-family: \'MyFont\'; src: url(\'...\'); }" style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div id="font-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionColors"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label>Preset Colors (upper palette)</label>',
	'        <div class="color-list" id="presetColors-list"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="color" id="presetColors-picker" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'          <input type="text" id="presetColors-input" placeholder="Hex without # (e.g. E6D0DE)" style="flex: 1;">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="presetColors-add">Add</button>',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label>Custom Preset Colors</label>',
	'        <div class="color-list" id="customPresetColors-list"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="color" id="customPresetColors-picker" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'          <input type="text" id="customPresetColors-input" placeholder="Hex without # (e.g. FF5733)" style="flex: 1;">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="customPresetColors-add">Add</button>',
	'        </div>',
	'        <p class="field__help" data-i18n="cfgFontCssHelp"></p>',
	'      </div>',
	'      <div class="field">',
	'        <label>Default Colors (lower palette)</label>',
	'        <div class="color-list" id="defaultColors-list"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="color" id="defaultColors-picker" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'          <input type="text" id="defaultColors-input" placeholder="Hex without # or \'none\'" style="flex: 1;">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="defaultColors-add">Add</button>',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-colorNames"></label>',
	'        <textarea id="cfg-colorNames" data-key="colorNames" data-type="json" placeholder=\'{"FFFFFF": "White", "000000": "Black"}\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionColorSchemes"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label>Default Color Schemes</label>',
	'        <div class="color-scheme-editor" id="defaultColorSchemes-editor"></div>',
	'        <div class="btn-group mt-sm">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="defaultColorSchemes-addRow">Add Row</button>',
	'        </div>',
	'        <p class="field__help">Colour schemes for the Style section. Each row is a scheme group.</p>',
	'      </div>',
	'      <div class="field">',
	'        <label>Custom Color Schemes</label>',
	'        <div class="color-scheme-editor" id="customColorSchemes-editor"></div>',
	'        <div class="btn-group mt-sm">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="customColorSchemes-addRow">Add Row</button>',
	'        </div>',
	'        <p class="field__help">Additional colour schemes added before default schemes</p>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionDefaultStyles"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field" data-search="font fontFamily fontSize fontColor">',
	'        <label for="cfg-defaultTextStyle"></label>',
	'        <input type="text" id="cfg-defaultTextStyle" data-key="defaultTextStyle" placeholder="text;html=1;whiteSpace=wrap;...">',
	'      </div>',
	'      <div class="field" data-search="font fontFamily fontSize fontColor fillColor strokeColor rounded shape">',
	'        <div style="display: flex; align-items: center; justify-content: space-between;">',
	'          <label for="cfg-defaultVertexStyle" style="margin-bottom: 0;">Default Vertex Style (JSON)</label>',
	'          <button type="button" class="btn btn--secondary btn--sm" id="useCurrentVertexStyle" style="display: none;">Use Current</button>',
	'        </div>',
	'        <textarea id="cfg-defaultVertexStyle" data-key="defaultVertexStyle" data-type="json" placeholder=\'{"fontFamily": "Arial"}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field" data-search="font fontFamily fontSize fontColor edgeStyle orthogonal endArrow connection">',
	'        <div style="display: flex; align-items: center; justify-content: space-between;">',
	'          <label for="cfg-defaultEdgeStyle" style="margin-bottom: 0;">Default Edge Style (JSON)</label>',
	'          <button type="button" class="btn btn--secondary btn--sm" id="useCurrentEdgeStyle" style="display: none;">Use Current</button>',
	'        </div>',
	'        <textarea id="cfg-defaultEdgeStyle" data-key="defaultEdgeStyle" data-type="json" placeholder=\'{"edgeStyle": "orthogonalEdgeStyle"}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-styles"></label>',
	'        <textarea id="cfg-styles" data-key="styles" data-type="json" placeholder=\'[{}, {"commonStyle": {"fontColor": "#5C5C5C"}}]\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'      <div class="field" data-search="mermaid theme themeVariables flowchart sequence">',
	'        <label for="cfg-mermaid"></label>',
	'        <textarea id="cfg-mermaid" data-key="mermaid" data-type="json" placeholder=\'{"theme": "neutral"}\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionCustomCSS"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label for="cfg-css"></label>',
	'        <textarea id="cfg-css" data-key="css" placeholder=".geMenubarContainer { background-color: #2A2A2A !important; }" style="min-height: 80px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-customCss"></label>',
	'        <textarea id="cfg-customCss" data-key="customCss" placeholder="Additional CSS rules..." style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionEmbedding"></h3></div>',
	'    <div class="card__body">',
	'      <div id="embedding-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionMenuCustomization"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label>Hidden Menu Items</label>',
	'        <div class="tag-list" id="hideMenuItems-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="hideMenuItems-input" placeholder="Add action name (e.g. print, exportPdf)...">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="hideMenuItems-add">Add</button>',
	'        </div>',
	'        <p class="field__help">Action names of menu items to hide</p>',
	'      </div>',
	'      <div class="field">',
	'        <label>Hidden Menus</label>',
	'        <div class="tag-list" id="hideMenus-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="hideMenus-input" placeholder="Add menu name (e.g. extras, help)...">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="hideMenus-add">Add</button>',
	'        </div>',
	'        <p class="field__help">Names of top-level menus to hide</p>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionAIConfiguration"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-gptApiKey"></label>',
	'          <input type="text" id="cfg-gptApiKey" data-key="gptApiKey" placeholder="sk-...">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-gptUrl"></label>',
	'          <input type="url" id="cfg-gptUrl" data-key="gptUrl" placeholder="https://api.openai.com/v1/chat/completions">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-geminiApiKey"></label>',
	'          <input type="text" id="cfg-geminiApiKey" data-key="geminiApiKey" placeholder="AI...">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-claudeApiKey"></label>',
	'          <input type="text" id="cfg-claudeApiKey" data-key="claudeApiKey" placeholder="sk-ant-...">',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-aiActions"></label>',
	'        <textarea id="cfg-aiActions" data-key="aiActions" data-type="json" placeholder=\'{"myAction": {"prompt": "..."}}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-aiGlobals"></label>',
	'        <textarea id="cfg-aiGlobals" data-key="aiGlobals" data-type="json" placeholder=\'{}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-aiConfigs"></label>',
	'        <textarea id="cfg-aiConfigs" data-key="aiConfigs" data-type="json" placeholder=\'{}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-aiModels"></label>',
	'        <textarea id="cfg-aiModels" data-key="aiModels" data-type="json" placeholder=\'{}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div id="ai-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionExportSecurity"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-maxImageBytes"></label>',
	'          <input type="number" id="cfg-maxImageBytes" data-key="maxImageBytes" placeholder="1000000" min="0">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-maxImageSize"></label>',
	'          <input type="number" id="cfg-maxImageSize" data-key="maxImageSize" placeholder="520" min="0">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-autosaveDelay"></label>',
	'          <input type="number" id="cfg-autosaveDelay" data-key="autosaveDelay" placeholder="e.g. 2000" min="0">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-defaultFileType"></label>',
	'          <select id="cfg-defaultFileType" data-key="defaultFileType">',
	'            <option value="">- Not set -</option>',
	'            <option value="drawio">XML (.drawio)</option>',
	'            <option value="png">Editable PNG (.drawio.png)</option>',
	'            <option value="svg">Editable SVG (.drawio.svg)</option>',
	'            <option value="html">HTML (.drawio.html)</option>',
	'          </select>',
	'        </div>',
	'      </div>',
	'      <div id="export-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionCollaborationAdvanced"></h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label for="cfg-globalVars"></label>',
	'        <textarea id="cfg-globalVars" data-key="globalVars" data-type="json" placeholder=\'{"companyName": "Acme Corp"}\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help"></p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-emptyDiagramXml"></label>',
	'        <textarea id="cfg-emptyDiagramXml" data-key="emptyDiagramXml" placeholder="<mxGraphModel>...</mxGraphModel>" style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-emptyLibraryXml"></label>',
	'        <textarea id="cfg-emptyLibraryXml" data-key="emptyLibraryXml" placeholder="<mxlibrary>[]</mxlibrary>" style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div id="advanced-toggles"></div>',
	'      <div id="desktop-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionConfluenceCloud"></h3></div>',
	'    <div class="card__body">',
	'      <p class="field__help mb-sm">These options only apply to <strong>Confluence Cloud</strong>.</p>',
	'      <div class="field">',
	'        <label for="cfg-ui"></label>',
	'        <select id="cfg-ui" data-key="ui">',
	'          <option value="">- Not set -</option>',
	'          <option value="kennedy">Kennedy</option>',
	'          <option value="atlas">Atlas (default)</option>',
	'          <option value="min">Minimal</option>',
	'          <option value="sketch">Sketch</option>',
	'          <option value="simple">Simple</option>',
	'        </select>',
	'      </div>',
	'      <div id="confluence-cloud-toggles"></div>',
	'      <div class="field">',
	'        <label for="cfg-viewerTimeout"></label>',
	'        <input type="number" id="cfg-viewerTimeout" data-key="viewerTimeout" placeholder="e.g. 30000" min="0">',
	'        <p class="field__help">Timeout in milliseconds before the viewer gives up loading <code>viewerTimeout</code></p>',
	'      </div>',
	'      <div class="field">',
	'        <label>Default Macro Parameters</label>',
	'        <div class="field-row">',
	'          <div class="field">',
	'            <label for="cfg-cdmp-tbstyle" style="font-weight: normal;">Toolbar Style</label>',
	'            <select id="cfg-cdmp-tbstyle">',
	'              <option value="">- Not set -</option>',
	'              <option value="top">top</option>',
	'              <option value="inline">inline</option>',
	'              <option value="hidden">hidden</option>',
	'            </select>',
	'          </div>',
	'          <div class="field">',
	'            <label for="cfg-cdmp-links" style="font-weight: normal;">Links</label>',
	'            <select id="cfg-cdmp-links">',
	'              <option value="">- Not set -</option>',
	'              <option value="auto">auto</option>',
	'              <option value="blank">blank</option>',
	'              <option value="self">self</option>',
	'            </select>',
	'          </div>',
	'        </div>',
	'        <div class="field-row">',
	'          <div class="field">',
	'            <label for="cfg-cdmp-zoom" style="font-weight: normal;">Zoom</label>',
	'            <input type="number" id="cfg-cdmp-zoom" placeholder="e.g. 100" min="1">',
	'          </div>',
	'          <div class="field" style="padding-top: 16px;">',
	'            <div id="cdmp-toggles-container"></div>',
	'          </div>',
	'        </div>',
	'        <div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 6px;" id="cdmp-booleans">',
	'          <label class="checkbox"><input type="checkbox" id="cfg-cdmp-lbox" data-tristate="true"> <span>Lightbox</span></label>',
	'          <label class="checkbox"><input type="checkbox" id="cfg-cdmp-simple" data-tristate="true"> <span>Simple Viewer</span></label>',
	'          <label class="checkbox"><input type="checkbox" id="cfg-cdmp-pCenter" data-tristate="true"> <span>Center</span></label>',
	'          <label class="checkbox"><input type="checkbox" id="cfg-cdmp-hiResPreview" data-tristate="true"> <span>High Resolution Preview</span></label>',
	'        </div>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title" data-i18n="cfgSectionConfluenceServerDataCenter"></h3></div>',
	'    <div class="card__body">',
	'      <p class="field__help mb-sm">These options only apply to <strong>Confluence Server / Data Center</strong>.</p>',
	'      <div id="confluence-toggles"></div>',
	'      <div class="field">',
	'        <label>Default Macro Parameters</label>',
	'        <div class="field-row">',
	'          <div class="field">',
	'            <label for="cfg-dmp-toolbarStyle" style="font-weight: normal;">Toolbar Style</label>',
	'            <select id="cfg-dmp-toolbarStyle">',
	'              <option value="">- Not set -</option>',
	'              <option value="top">top</option>',
	'              <option value="inline">inline</option>',
	'              <option value="hidden">hidden</option>',
	'            </select>',
	'          </div>',
	'          <div class="field">',
	'            <label for="cfg-dmp-links" style="font-weight: normal;">Links</label>',
	'            <select id="cfg-dmp-links">',
	'              <option value="">- Not set -</option>',
	'              <option value="auto">auto</option>',
	'              <option value="blank">blank</option>',
	'              <option value="self">self</option>',
	'            </select>',
	'          </div>',
	'        </div>',
	'        <div class="field-row">',
	'          <div class="field">',
	'            <label for="cfg-dmp-width" style="font-weight: normal;">Width</label>',
	'            <input type="number" id="cfg-dmp-width" placeholder="e.g. 800" min="1">',
	'          </div>',
	'          <div class="field" style="padding-top: 16px;">',
	'            <div id="dmp-toggles-container"></div>',
	'          </div>',
	'        </div>',
	'        <div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 6px;" id="dmp-booleans">',
	'          <label class="checkbox"><input type="checkbox" id="cfg-dmp-border" data-tristate="true"> <span>Border</span></label>',
	'          <label class="checkbox"><input type="checkbox" id="cfg-dmp-lightbox" data-tristate="true"> <span>Lightbox</span></label>',
	'          <label class="checkbox"><input type="checkbox" id="cfg-dmp-simpleViewer" data-tristate="true"> <span>Simple Viewer</span></label>',
	'        </div>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>'
].join('\n');
