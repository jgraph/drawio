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
 * setConfig, setDarkMode, setHighContrast and getConfig methods.
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
	var tagLists = { enabledLibraries: [], defaultCustomLibraries: [], hideMenuItems: [], hideMenus: [] };
	var schemeData = { defaultColorSchemes: [], customColorSchemes: [] };
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

	function q(selector) { return container.querySelector(selector); }
	function qAll(selector) { return container.querySelectorAll(selector); }

	// ============================================
	// TOGGLE DEFINITIONS
	// ============================================
	var toggleGroups = {
		'general-toggles': [
			{ key: 'override', name: 'Override', help: 'Ignore client-side settings' },
			{ key: 'compact', name: 'Compact UI', help: 'Enable compact user interface mode' },
			{ key: 'noAutoFocus', name: 'No Auto Focus', help: 'Disable auto-focus on startup' },
			{ key: 'updateDefaultStyle', name: 'Update Default Style', help: 'Update defaults when styles change' },
			{ key: 'mathematicalTypesetting', name: 'Math Typesetting', help: 'Enable MathJax for mathematical typesetting' },
			{ key: 'mathOutputSize', name: 'Math Output Size', help: 'Size labels, view bounds and initial fit to the rendered math output instead of the formula source' },
			{ key: 'internationalization', name: 'Internationalization', help: 'Enable UI language translation' },
			{ key: 'browserTranslate', name: 'Browser Translate', help: 'Mirror diagram text for browser translation engines (e.g. Chrome Translate)' }
		],
		'canvas-toggles': [
			{ key: 'defaultPageVisible', name: 'Page Visible', help: 'Show page outline on canvas' },
			{ key: 'defaultGridEnabled', name: 'Grid Enabled', help: 'Show grid on canvas' },
			{ key: 'defaultConnectable', name: 'Default Connectable', help: 'Shapes are connectable by default' },
			{ key: 'defaultConnectionArrowsEnabled', name: 'Connection Arrows', help: 'Show arrows when hovering connections' },
			{ key: 'defaultFoldingEnabled', name: 'Folding Enabled', help: 'Enable shape folding (collapse/expand)' },
			{ key: 'zoomWheel', name: 'Zoom with Mouse Wheel', help: 'Use mouse wheel for zoom without modifiers' },
			{ key: 'simpleLabels', name: 'Simple Labels', help: 'Disable word wrap and HTML for labels' },
			{ key: 'optimizeHtmlLabels', name: 'Optimize HTML Labels', help: 'Remove unnecessary spans from HTML labels when editing stops' },
			{ key: 'pasteAtMousePointer', name: 'Paste at Mouse', help: 'Paste elements at mouse pointer location' },
			{ key: 'fitDiagramOnLoad', name: 'Fit Diagram on Load', help: 'Fit diagram to window on load' },
			{ key: 'fitDiagramOnPage', name: 'Fit Diagram on Page', help: 'Fit diagram to page size' },
			{ key: 'selectParentLayer', name: 'Select Parent Layer', help: 'Selects parent layer for current selection' },
			{ key: 'enableInlineToolbar', name: 'Inline Toolbar', help: 'Enable the inline toolbar on selection' },
			{ key: 'enableWindowDocking', name: 'Window Docking', help: 'Enable window docking' },
			{ key: 'showLinkIcons', name: 'Show Link Icons', help: 'Show link icons on shapes' },
			{ key: 'showTooltipIcons', name: 'Show Tooltip Icons', help: 'Show tooltip icons on shapes' },
			{ key: 'showConnectHandle', name: 'Show Connect Handle', help: 'Show connection handle on hover' },
			{ key: 'intersectionSelect', name: 'Intersection Select', help: 'Select cells by intersection rather than containment' },
			{ key: 'swimlaneSelectionEnabled', name: 'Swimlane Body Selection', help: 'Click an empty swimlane body to select the swimlane (default on)' }
		],
		'appearance-toggles': [
			{ key: 'enableCssDarkMode', name: 'CSS Dark Mode', help: 'Use CSS for dark mode rendering' },
			{ key: 'enableLightDarkColors', name: 'Light/Dark Colors', help: 'Use CSS light-dark() color function' },
			{ key: 'enableAnimations', name: 'Enable Animations', help: 'Enable shape and layout animations' },
			{ key: 'insertAnimations', name: 'Insert Animations', help: 'Show pop animation when inserting shapes from the sidebar' }
		],
		'sidebar-toggles': [
			{ key: 'sidebarTitles', name: 'Sidebar Titles', help: 'Show titles in the sidebar' },
			{ key: 'expandLibraries', name: 'Expand Libraries', help: 'Libraries expanded by default' }
		],
		'library-toggles': [
			{ key: 'enableCustomLibraries', name: 'Enable Custom Libraries', help: 'Allow open and new library functions' },
			{ key: 'appendCustomLibraries', name: 'Append Custom Libraries', help: 'Custom libraries appear after built-in ones' }
		],
		'export-toggles': [
			{ key: 'compressXml', name: 'Compress XML', help: 'Compress XML output in saved files' },
			{ key: 'compressStyles', name: 'Compress Styles', help: 'Deduplicate repeated inline images and stencils into a shared lookup table. Only readable by draw.io 29.3.1 and later.', experimental: true, helpLink: 'https://www.drawio.com/docs/reference/style-compression/' },
			{ key: 'includeDiagram', name: 'Include Diagram in Export', help: 'Include diagram data in export dialogs' },
			{ key: 'enableExportUrl', name: 'Enable Export URL', help: 'Enable the export URL feature' },
			{ key: 'lockdown', name: 'Lockdown', help: 'Disable data transmission apart from storage' },
			{ key: 'restrictExport', name: 'Restrict Export', help: 'Disable exporting diagrams to other formats' },
			{ key: 'enableNativeClipboard', name: 'Native Clipboard', help: 'Use native system clipboard' },
			{ key: 'replaceSvgDataUris', name: 'Replace SVG Data URIs', help: 'Replace data URIs with SVG sub-trees in export' },
			{ key: 'foreignObjectImages', name: 'Foreign Object Images', help: 'Replace foreignObject with images' },
			{ key: 'embedSvgFonts', name: 'Embed SVG Fonts', help: 'Embed fonts as data URIs in SVG export, disable to keep external font references' },
			{ key: 'removeImageMetadata', name: 'Remove Image Metadata', help: 'Strip metadata from images' },
			{ key: 'expandPatternsForPrint', name: 'Expand Patterns for Print', help: 'Expand patterns to visible graphics during print/PDF export' }
		],
		'advanced-toggles': [
			{ key: 'shareCursorPosition', name: 'Share Cursor Position', help: 'Share cursor in real-time collaboration' },
			{ key: 'showRemoteCursors', name: 'Show Remote Cursors', help: 'Display other users\' cursors' },
			{ key: 'oneDriveInlinePicker', name: 'OneDrive Inline Picker', help: 'Use inline picker for OneDrive' },
			{ key: 'enableCustomGitLabUrl', name: 'Enable Custom GitLab URL', help: 'Allow ?gitlab= / ?gitlab-id= URL parameters to override the default GitLab server. Enable only for self-hosted GitLab deployments.' }
		],
		'embedding-toggles': [
			{ key: 'passiveScroll', name: 'Passive Scroll', help: 'Enable passive scroll event listeners' },
			{ key: 'noResizers', name: 'No Resizers', help: 'Hide shape resize handles' },
			{ key: 'preserveViewState', name: 'Preserve View State', help: 'Preserve view state in embed mode' },
			{ key: 'useInternalClipboard', name: 'Use Internal Clipboard', help: 'Use internal clipboard instead of native' }
		],
		'ai-toggles': [
			{ key: 'enableAi', name: 'Enable AI', help: 'Enable AI diagram generation' }
		],
		'confluence-cloud-toggles': [
			{ key: 'simpleViewer', name: 'Simple Viewer', help: 'Use simple viewer for all diagrams' },
			{ key: 'disableVersioning', name: 'Disable Versioning', help: 'Disable diagram versioning' },
			{ key: 'hiResPreview', name: 'Hi-Res Preview', help: 'Generate high-resolution preview images' },
			{ key: 'autoCropViewer', name: 'Auto Crop Viewer', help: 'Auto-crop viewer to fit diagram bounds' },
			{ key: 'enableCssDarkMode', name: 'CSS Dark Mode', help: 'Enable CSS-based dark mode for viewer diagrams' },
			{ key: 'viewerCanExceedPageWidth', name: 'Viewer Can Exceed Page Width', help: 'Allow the viewer to exceed the page width' },
			{ key: 'inplaceEdits', name: 'In-place Edits', help: 'Allow launching the editor from the viewer' },
			{ key: 'lockdown', name: 'Lockdown', help: 'Disable data transmission outside Confluence' },
			{ key: 'translateDiagrams', name: 'Translate Diagrams', help: 'Enable automatic translation of diagram labels' },
			{ key: 'generateSVGs', name: 'Generate SVGs', help: 'Generate SVG previews for diagrams' }
		],
		'confluence-toggles': [
			{ key: 'debug', name: 'Debug', help: 'Enable debug output' },
			{ key: 'inplaceEdits', name: 'In-place Edits', help: 'Allow launching editor from viewer' },
			{ key: 'forceSimpleViewer', name: 'Force Simple Viewer', help: 'Force simple viewer for all diagrams' }
		]
	};

	if (isDesktop)
	{
		toggleGroups['font-toggles'] = [
			{ key: 'enableLocalFonts', name: 'Local Fonts', help: 'Scan and list locally installed fonts in the font picker' }
		];
		toggleGroups['desktop-toggles'] = [
			{ key: 'desktopAutoSync', name: 'Desktop Auto Sync', help: 'Auto-sync when local file changes' }
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

			var html = '';
			toggleGroups[containerId].forEach(function(toggle)
			{
				var badge = toggle.experimental ?
					' <span class="toggle-field__experimental" title="Experimental feature">experimental</span>' : '';
				var helpIcon = toggle.helpLink ?
					' <a class="toggle-field__helplink" href="' + toggle.helpLink + '" target="_blank" rel="noopener" title="Learn more">?</a>' : '';

				html += '<div class="toggle-field">' +
					'<div class="toggle-field__label">' +
						'<span class="toggle-field__name">' + toggle.name + badge + '</span>' +
						'<span class="toggle-field__help">' + toggle.help + ' <code>' + toggle.key + '</code>' + helpIcon + '</span>' +
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

		qAll('.tri-toggle').forEach(function(toggle)
		{
			toggle.querySelectorAll('button').forEach(function(btn)
			{
				btn.addEventListener('click', function()
				{
					var key = toggle.getAttribute('data-key');
					var value = btn.getAttribute('data-value');

					toggle.querySelectorAll('button').forEach(function(b) { b.className = ''; });
					btn.className = 'active--' + value;

					if (value === 'unset') { delete config[key]; }
					else { config[key] = value === 'true'; }

					notifyChange();
				});
			});
		});
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

				if (val === '') { delete config[key]; }
				else if (el.type === 'number')
				{
					var num = parseFloat(val);
					if (!isNaN(num)) { config[key] = num; }
				}
				else if (isJson)
				{
					try { config[key] = JSON.parse(val); }
					catch (e) { /* keep typing */ }
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
			{ picker: 'cfg-shadowColorPicker', text: 'cfg-shadowColor' }
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

		fontLists[listKey].forEach(function(font, i)
		{
			html += '<span class="tag"><span>' + escapeHtml(font) + '</span>' +
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
		var addBtn = q('#' + listKey + '-add');

		function addFont()
		{
			var val = input.value.trim();
			if (val) { fontLists[listKey].push(val); input.value = ''; syncFontList(listKey); renderFontTags(listKey); }
		}

		addBtn.addEventListener('click', addFont);
		input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); addFont(); } });
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
	function setupMacroParams()
	{
		var toolbarStyle = q('#cfg-dmp-toolbarStyle');
		var links = q('#cfg-dmp-links');
		var width = q('#cfg-dmp-width');
		var border = q('#cfg-dmp-border');
		var lightbox = q('#cfg-dmp-lightbox');
		var simpleViewer = q('#cfg-dmp-simpleViewer');

		function updateMacroParams()
		{
			var params = {};
			var hasValue = false;

			if (toolbarStyle.value) { params.toolbarStyle = toolbarStyle.value; hasValue = true; }
			if (links.value) { params.links = links.value; hasValue = true; }
			if (width.value) { params.width = parseInt(width.value); hasValue = true; }
			if (border.indeterminate === false) { params.border = border.checked; hasValue = true; }
			if (lightbox.indeterminate === false) { params.lightbox = lightbox.checked; hasValue = true; }
			if (simpleViewer.indeterminate === false) { params.simpleViewer = simpleViewer.checked; hasValue = true; }

			if (hasValue) { config.defaultMacroParameters = params; }
			else { delete config.defaultMacroParameters; }

			notifyChange();
		}

		[border, lightbox, simpleViewer].forEach(function(cb)
		{
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

		toolbarStyle.addEventListener('change', updateMacroParams);
		links.addEventListener('change', updateMacroParams);
		width.addEventListener('input', updateMacroParams);
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
		tagLists = { enabledLibraries: [], defaultCustomLibraries: [], hideMenuItems: [], hideMenus: [] };
		schemeData = { defaultColorSchemes: [], customColorSchemes: [] };

		Object.keys(obj).forEach(function(key)
		{
			var val = obj[key];

			if (key === 'defaultFonts' || key === 'customFonts')
			{
				if (Array.isArray(val))
				{
					fontLists[key] = val.map(function(f) { return typeof f === 'object' ? f.fontFamily || '' : String(f); });
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

			if (key === 'enabledLibraries' || key === 'defaultCustomLibraries' || key === 'hideMenuItems' || key === 'hideMenus')
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
		['enabledLibraries', 'defaultCustomLibraries', 'hideMenuItems', 'hideMenus'].forEach(renderTagList);
		['defaultColorSchemes', 'customColorSchemes'].forEach(renderSchemeEditor);

		if (config.defaultMacroParameters)
		{
			var dmp = config.defaultMacroParameters;
			if (dmp.toolbarStyle) q('#cfg-dmp-toolbarStyle').value = dmp.toolbarStyle;
			if (dmp.links) q('#cfg-dmp-links').value = dmp.links;
			if (dmp.width) q('#cfg-dmp-width').value = dmp.width;

			['border', 'lightbox', 'simpleViewer'].forEach(function(prop)
			{
				var cb = q('#cfg-dmp-' + prop);
				if (dmp[prop] !== undefined)
				{
					cb.checked = dmp[prop]; cb.indeterminate = false;
					cb.dataset.cycleState = dmp[prop] ? 'checked' : 'unchecked';
				}
				else
				{
					cb.indeterminate = true; cb.dataset.cycleState = 'indeterminate';
				}
			});
		}
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
			el.querySelectorAll('[data-key]').forEach(function(inp) { text += ' ' + inp.getAttribute('data-key'); });
			searchIndex.push({ element: el, section: section, keywords: text, type: 'field' });
		});

		qAll('.config-section .field-row').forEach(function(el)
		{
			var section = el.closest('.config-section');
			var text = el.textContent.toLowerCase();
			el.querySelectorAll('[data-key]').forEach(function(inp) { text += ' ' + inp.getAttribute('data-key'); });
			el.querySelectorAll('input, select, textarea').forEach(function(inp)
			{
				if (inp.id) text += ' ' + inp.id.replace('cfg-', '').replace('cfg-dmp-', '');
			});
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
	setupSchemeEditor('defaultColorSchemes');
	setupSchemeEditor('customColorSchemes');
	setupMacroParams();
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
	'.geConfigEditor .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }',
	'.geConfigEditor .toggle-field {',
	'  display: flex; align-items: center; justify-content: space-between;',
	'  padding: 4px 0; border-bottom: 1px solid light-dark(var(--color-border), var(--color-border-dark));',
	'}',
	'.geConfigEditor .toggle-field:last-child { border-bottom: none; }',
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
	'  .geConfigEditor .search-box { background: Canvas; }',
	'  .geConfigEditor { background: Canvas; color: CanvasText; }',
	'}'
].join('\n');

// ============================================
// HTML TEMPLATE
// ============================================
DrawioConfigEditor.html = [
	'<div class="search-box" id="searchBox">',
	'  <input type="text" id="searchInput" placeholder="Search settings (e.g. grid, font, dark mode, compressXml...)">',
	'  <div class="search-box__count" id="searchCount"></div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">General</h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-version">Version</label>',
	'          <input type="text" id="cfg-version" data-key="version" placeholder="e.g. 1.0">',
	'          <p class="field__help">Configuration version identifier</p>',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-settingsName">Settings Name</label>',
	'          <input type="text" id="cfg-settingsName" data-key="settingsName" placeholder=".drawio-config">',
	'          <p class="field__help">Key for storing user settings in local storage</p>',
	'        </div>',
	'      </div>',
	'      <div id="general-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Canvas &amp; Grid</h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-defaultGridSize">Default Grid Size</label>',
	'          <input type="number" id="cfg-defaultGridSize" data-key="defaultGridSize" placeholder="10" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-gridSteps">Grid Steps</label>',
	'          <input type="number" id="cfg-gridSteps" data-key="gridSteps" placeholder="e.g. 4" min="1">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-zoomFactor">Zoom Factor</label>',
	'          <input type="number" id="cfg-zoomFactor" data-key="zoomFactor" placeholder="1.2" min="1.01" step="0.05">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-defaultEdgeLength">Default Edge Length</label>',
	'          <input type="number" id="cfg-defaultEdgeLength" data-key="defaultEdgeLength" placeholder="80" min="1">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-foldingIconSize">Folding Icon Size</label>',
	'          <input type="number" id="cfg-foldingIconSize" data-key="foldingIconSize" placeholder="9" min="1">',
	'        </div>',
	'        <div class="field"></div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-tooltipFontSize">Tooltip Font Size (px)</label>',
	'          <input type="number" id="cfg-tooltipFontSize" data-key="tooltipFontSize" placeholder="11" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-tooltipMaxWidth">Tooltip Max Width (px)</label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="number" id="cfg-tooltipMaxWidth" placeholder="360" min="1" style="flex: 1;">',
	'            <label class="checkbox" style="white-space: nowrap;"><input type="checkbox" id="cfg-tooltipMaxWidthEnabled"> <span>Limit</span></label>',
	'          </div>',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-pageFormatWidth">Page Width (1/10 inch)</label>',
	'          <input type="number" id="cfg-pageFormatWidth" placeholder="850" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-pageFormatHeight">Page Height (1/10 inch)</label>',
	'          <input type="number" id="cfg-pageFormatHeight" placeholder="1100" min="1">',
	'        </div>',
	'      </div>',
	'      <p class="field__help">Page format: US Letter = 850 x 1100, A4 = 827 x 1169</p>',
	'      <div id="canvas-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Appearance</h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-darkColor">Dark Mode Background</label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="color" id="cfg-darkColorPicker" value="#2A2A2A" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'            <input type="text" id="cfg-darkColor" data-key="darkColor" placeholder="#2A2A2A" style="flex: 1;">',
	'          </div>',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-defaultAdaptiveColors">Adaptive Colors</label>',
	'          <select id="cfg-defaultAdaptiveColors" data-key="defaultAdaptiveColors">',
	'            <option value="">- Not set -</option>',
	'            <option value="auto">auto</option>',
	'            <option value="simple">simple</option>',
	'            <option value="none">none</option>',
	'          </select>',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-darkColorVar">Dark Color CSS Variable</label>',
	'        <input type="text" id="cfg-darkColorVar" data-key="darkColorVar" placeholder="--ge-dark-color">',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-shadowColor">Shadow Color</label>',
	'          <div style="display: flex; gap: 6px; align-items: center;">',
	'            <input type="color" id="cfg-shadowColorPicker" value="#808080" style="width: 36px; height: 28px; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">',
	'            <input type="text" id="cfg-shadowColor" data-key="shadowColor" placeholder="#808080" style="flex: 1;">',
	'          </div>',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-shadowOpacity">Shadow Opacity</label>',
	'          <input type="number" id="cfg-shadowOpacity" data-key="shadowOpacity" placeholder="1" min="0" max="1" step="0.1">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-shadowOffsetX">Shadow Offset X</label>',
	'          <input type="number" id="cfg-shadowOffsetX" data-key="shadowOffsetX" placeholder="e.g. 2">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-shadowOffsetY">Shadow Offset Y</label>',
	'          <input type="number" id="cfg-shadowOffsetY" data-key="shadowOffsetY" placeholder="e.g. 3">',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-shadowBlur">Shadow Blur</label>',
	'        <input type="number" id="cfg-shadowBlur" data-key="shadowBlur" placeholder="e.g. 6" min="0">',
	'      </div>',
	'      <div id="appearance-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Sidebar &amp; Panels</h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-thumbWidth">Thumbnail Width</label>',
	'          <input type="number" id="cfg-thumbWidth" data-key="thumbWidth" placeholder="46" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-thumbHeight">Thumbnail Height</label>',
	'          <input type="number" id="cfg-thumbHeight" data-key="thumbHeight" placeholder="46" min="1">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-sidebarWidth">Sidebar Width</label>',
	'          <input type="number" id="cfg-sidebarWidth" data-key="sidebarWidth" placeholder="e.g. 250" min="1">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-sidebarTitleSize">Title Font Size (pt)</label>',
	'          <input type="number" id="cfg-sidebarTitleSize" data-key="sidebarTitleSize" placeholder="8" min="1">',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-shapePicker">Shape Picker (JSON)</label>',
	'        <textarea id="cfg-shapePicker" data-key="shapePicker" data-type="json" placeholder=\'{"shapes": [...]}\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help">Custom shape picker entries for the sidebar</p>',
	'      </div>',
	'      <div id="sidebar-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Libraries</h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label for="cfg-defaultLibraries">Default Libraries</label>',
	'        <input type="text" id="cfg-defaultLibraries" data-key="defaultLibraries" placeholder="general;uml;er;bpmn;flowchart;basic;arrows2">',
	'        <p class="field__help">Semicolon-separated library keys shown in sidebar on startup</p>',
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
	'        <label for="cfg-templateFile">Template File URL</label>',
	'        <input type="url" id="cfg-templateFile" data-key="templateFile" placeholder="https://app.diagrams.net/templates/index.xml">',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-libraries">Libraries (JSON)</label>',
	'        <textarea id="cfg-libraries" data-key="libraries" data-type="json" placeholder=\'[{"title": {"main": "Company"}, "entries": [...]}]\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help">Custom library sections for the left panel</p>',
	'      </div>',
	'      <div id="library-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Fonts</h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label>Default Fonts</label>',
	'        <div class="tag-list" id="defaultFonts-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="defaultFonts-input" placeholder="Add font name...">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="defaultFonts-add">Add</button>',
	'        </div>',
	'        <p class="field__help">Font names for the format panel font picker</p>',
	'      </div>',
	'      <div class="field">',
	'        <label>Custom Fonts</label>',
	'        <div class="tag-list" id="customFonts-tags"></div>',
	'        <div class="tag-input-wrap">',
	'          <input type="text" id="customFonts-input" placeholder="Add font name...">',
	'          <button type="button" class="btn btn--secondary btn--sm" id="customFonts-add">Add</button>',
	'        </div>',
	'        <p class="field__help">Additional fonts added before default fonts</p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-fontCss">Font CSS (@font-face rules)</label>',
	'        <textarea id="cfg-fontCss" data-key="fontCss" placeholder="@font-face { font-family: \'MyFont\'; src: url(\'...\'); }" style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div id="font-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Colors</h3></div>',
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
	'        <p class="field__help">Added before preset colors in the colour dialog</p>',
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
	'        <label for="cfg-colorNames">Color Names (JSON)</label>',
	'        <textarea id="cfg-colorNames" data-key="colorNames" data-type="json" placeholder=\'{"FFFFFF": "White", "000000": "Black"}\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help">Map of colour codes to display names (tooltips)</p>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Color Schemes</h3></div>',
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
	'    <div class="card__header"><h3 class="card__title">Default Styles</h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label for="cfg-defaultTextStyle">Default Text Style</label>',
	'        <input type="text" id="cfg-defaultTextStyle" data-key="defaultTextStyle" placeholder="text;html=1;whiteSpace=wrap;...">',
	'      </div>',
	'      <div class="field">',
	'        <div style="display: flex; align-items: center; justify-content: space-between;">',
	'          <label for="cfg-defaultVertexStyle" style="margin-bottom: 0;">Default Vertex Style (JSON)</label>',
	'          <button type="button" class="btn btn--secondary btn--sm" id="useCurrentVertexStyle" style="display: none;">Use Current</button>',
	'        </div>',
	'        <textarea id="cfg-defaultVertexStyle" data-key="defaultVertexStyle" data-type="json" placeholder=\'{"fontFamily": "Arial"}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <div style="display: flex; align-items: center; justify-content: space-between;">',
	'          <label for="cfg-defaultEdgeStyle" style="margin-bottom: 0;">Default Edge Style (JSON)</label>',
	'          <button type="button" class="btn btn--secondary btn--sm" id="useCurrentEdgeStyle" style="display: none;">Use Current</button>',
	'        </div>',
	'        <textarea id="cfg-defaultEdgeStyle" data-key="defaultEdgeStyle" data-type="json" placeholder=\'{"edgeStyle": "orthogonalEdgeStyle"}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-styles">Styles (JSON)</label>',
	'        <textarea id="cfg-styles" data-key="styles" data-type="json" placeholder=\'[{}, {"commonStyle": {"fontColor": "#5C5C5C"}}]\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help">Colours for the Style tab. Keys: commonStyle, vertexStyle, edgeStyle, graph.</p>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Custom CSS</h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label for="cfg-css">CSS Rules</label>',
	'        <textarea id="cfg-css" data-key="css" placeholder=".geMenubarContainer { background-color: #2A2A2A !important; }" style="min-height: 80px;"></textarea>',
	'        <p class="field__help">CSS rules to customize the draw.io user interface</p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-customCss">Custom CSS (alternative)</label>',
	'        <textarea id="cfg-customCss" data-key="customCss" placeholder="Additional CSS rules..." style="min-height: 60px;"></textarea>',
	'        <p class="field__help">Injected as a separate style element</p>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Embedding</h3></div>',
	'    <div class="card__body">',
	'      <div id="embedding-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Menu Customization</h3></div>',
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
	'    <div class="card__header"><h3 class="card__title">AI Configuration</h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-gptApiKey">OpenAI API Key</label>',
	'          <input type="text" id="cfg-gptApiKey" data-key="gptApiKey" placeholder="sk-...">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-gptUrl">Custom GPT URL</label>',
	'          <input type="url" id="cfg-gptUrl" data-key="gptUrl" placeholder="https://api.openai.com/v1/chat/completions">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-geminiApiKey">Gemini API Key</label>',
	'          <input type="text" id="cfg-geminiApiKey" data-key="geminiApiKey" placeholder="AI...">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-claudeApiKey">Claude API Key</label>',
	'          <input type="text" id="cfg-claudeApiKey" data-key="claudeApiKey" placeholder="sk-ant-...">',
	'        </div>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-aiActions">AI Actions (JSON)</label>',
	'        <textarea id="cfg-aiActions" data-key="aiActions" data-type="json" placeholder=\'{"myAction": {"prompt": "..."}}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-aiGlobals">AI Globals (JSON)</label>',
	'        <textarea id="cfg-aiGlobals" data-key="aiGlobals" data-type="json" placeholder=\'{}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-aiConfigs">AI Configs (JSON)</label>',
	'        <textarea id="cfg-aiConfigs" data-key="aiConfigs" data-type="json" placeholder=\'{}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-aiModels">AI Models (JSON)</label>',
	'        <textarea id="cfg-aiModels" data-key="aiModels" data-type="json" placeholder=\'{}\' style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div id="ai-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Export &amp; Security</h3></div>',
	'    <div class="card__body">',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-maxImageBytes">Max Image Bytes</label>',
	'          <input type="number" id="cfg-maxImageBytes" data-key="maxImageBytes" placeholder="1000000" min="0">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-maxImageSize">Max Image Size (px)</label>',
	'          <input type="number" id="cfg-maxImageSize" data-key="maxImageSize" placeholder="520" min="0">',
	'        </div>',
	'      </div>',
	'      <div class="field-row">',
	'        <div class="field">',
	'          <label for="cfg-autosaveDelay">Autosave Delay (ms)</label>',
	'          <input type="number" id="cfg-autosaveDelay" data-key="autosaveDelay" placeholder="e.g. 2000" min="0">',
	'        </div>',
	'        <div class="field">',
	'          <label for="cfg-defaultFileType">Default File Type</label>',
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
	'    <div class="card__header"><h3 class="card__title">Collaboration &amp; Advanced</h3></div>',
	'    <div class="card__body">',
	'      <div class="field">',
	'        <label for="cfg-globalVars">Global Variables (JSON)</label>',
	'        <textarea id="cfg-globalVars" data-key="globalVars" data-type="json" placeholder=\'{"companyName": "Acme Corp"}\' style="min-height: 60px;"></textarea>',
	'        <p class="field__help">Global placeholders available in all diagrams</p>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-emptyDiagramXml">Empty Diagram XML</label>',
	'        <textarea id="cfg-emptyDiagramXml" data-key="emptyDiagramXml" placeholder="<mxGraphModel>...</mxGraphModel>" style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div class="field">',
	'        <label for="cfg-emptyLibraryXml">Empty Library XML</label>',
	'        <textarea id="cfg-emptyLibraryXml" data-key="emptyLibraryXml" placeholder="<mxlibrary>[]</mxlibrary>" style="min-height: 60px;"></textarea>',
	'      </div>',
	'      <div id="advanced-toggles"></div>',
	'      <div id="desktop-toggles"></div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Confluence Cloud</h3></div>',
	'    <div class="card__body">',
	'      <p class="field__help mb-sm">These options only apply to <strong>Confluence Cloud</strong>.</p>',
	'      <div class="field">',
	'        <label for="cfg-ui">UI Theme</label>',
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
	'        <label for="cfg-viewerTimeout">Viewer Timeout</label>',
	'        <input type="number" id="cfg-viewerTimeout" data-key="viewerTimeout" placeholder="e.g. 30000" min="0">',
	'        <p class="field__help">Timeout in milliseconds before the viewer gives up loading <code>viewerTimeout</code></p>',
	'      </div>',
	'    </div>',
	'  </div>',
	'</div>',
	'<div class="config-section">',
	'  <div class="card">',
	'    <div class="card__header"><h3 class="card__title">Confluence Server / Data Center</h3></div>',
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
