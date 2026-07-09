/**
 * ElkLayout — draw.io editor bindings for the bundled drawio-elk bridge.
 *
 * The actual ElkLayout class (constructor, execute/prepare, Adapter,
 * Applier, lazy ELK loading, mermaid policy, DEFAULTS) now lives inside
 * `js/elk/drawio-elk.min.js` and is shared with drawio-mcp. This file
 * adds only the draw.io editor-specific UI statics on top:
 *
 *   ElkLayout.run(editorUi, algorithm, options, runOptions)
 *     — spinner + executeLayout(morph) integration for the Layout menu.
 *
 *   ElkLayout.runWithDialog(editorUi, algorithm, baseOptions, title)
 *     — per-algorithm config dialog (nodeSpacing, layeringStrategy,
 *       edgeRouting, edgeStyle, corners, resizeNodes, selection-as-root
 *       toggle), backed by localStorage so the user's last values
 *       survive page reloads.
 *
 *   ElkLayout.DIALOG_FIELDS, MAX_ROOTS, SETTINGS{,_KEY},
 *   _loadSettings / _saveSettings — supporting data + helpers.
 *
 * IMPORTANT: drawio-elk.min.js MUST load before this file (see
 * Devel.js / App.js / etc.). The bundle's footer assigns
 * `var ElkLayout = ELK.ElkLayout`; once that's run, the statics below
 * attach to the bundled class.
 *
 * For the full layout pipeline (mxGraph → ELK JSON → layout →
 * mxGraph mutations), see https://github.com/jgraph/drawio-elk —
 * specifically src/mxgraph-bridge/{ElkLayout,ElkAdapter,ElkApplier}.js.
 */
// ─── Static: menu integration ────────────────────────────────────

// The bundled ElkLayout class (js/elk/drawio-elk.min.js) MUST be defined before
// these editor statics can attach to it. In dev mode WITHOUT ?dev=1, mxscript
// injects dynamic <script defer> tags — defer is a no-op on injected scripts,
// so they execute in download-completion order. This tiny file beats the
// ~840 KB bundle in that race, so a bare `ElkLayout.run = ...` would throw on
// an undefined ElkLayout and NONE of the statics would attach (surfacing later
// as "ElkLayout.runWithDialog is not a function" from Arrange > Layout). Stage
// the statics on a local object and copy them onto ElkLayout the moment the
// class exists — immediate when concatenated in production or loaded via
// ?dev=1's ordered document.write, otherwise after a short poll (see footer).
var elkLayoutLoaded = (typeof ElkLayout !== 'undefined' && ElkLayout != null);
var ElkLayoutBindings = elkLayoutLoaded ? ElkLayout : {};

/**
 * Convenience method for menu items. Shows spinner, runs layout,
 * hides spinner, animates result.
 *
 * @param {EditorUi} editorUi
 * @param {string} algorithm - 'layered', 'mrtree', 'force', 'radial'
 * @param {Object} [options] - Additional ELK layout options
 * @param {Object} [runOptions] - Bridge run options (e.g. edge routing)
 * @param {Function} [done] - Optional callback invoked after the layout is applied
 */
ElkLayoutBindings.run = function(editorUi, algorithm, options, runOptions, done)
{
	var graph = editorUi.editor.graph;

	// Determine layout parent: selected group or default parent
	var parent = graph.getDefaultParent();
	var sel = graph.getSelectionCell();

	if (sel != null && graph.model.getChildCount(sel) > 1 &&
		graph.model.isVertex(sel))
	{
		parent = sel;
	}

	var layout = new ElkLayout(graph, algorithm, options, runOptions);
	var spinner = editorUi.spinner;

	// Records the run for Arrange > Layout > Run Last Layout as a
	// custom-layout entry, so a re-run replays the same options through
	// the shared layout-spec pipeline (see EditorUi.executeLayoutSpec).
	var specName = Graph.elkLayoutNameForAlgorithm(algorithm);

	if (specName != null)
	{
		editorUi.lastLayoutSpec = [{layout: specName,
			config: Graph.elkOptionsToConfig(options, runOptions)}];

		// A single selected layout container takes the run as its new
		// childLayout instead of a one-shot layout — the style write
		// re-runs the layout (setContainerChildLayout strips the dialog's
		// selection-as-root ids and pins the container defaults).
		var container = editorUi.getSelectedLayoutContainer();

		if (container != null)
		{
			editorUi.setContainerChildLayout(container, editorUi.lastLayoutSpec);

			if (done != null)
			{
				done();
			}

			return;
		}
	}

	if (spinner != null && spinner.spin != null)
	{
		spinner.spin(document.body, mxResources.get('loading'));
	}

	// prepare() runs ELK async and returns a sync apply() closure that bakes
	// in the whole layout — including the preserveOrigin shift when runOptions
	// enables it (the bridge owns that now; see drawio-elk's ElkLayout). We
	// hand apply() to executeLayout so the morph animates between the pre- and
	// post-layout cell positions, same as the other Arrange > Layout entries.
	layout.prepare(parent, function(err, apply)
	{
		if (spinner != null && spinner.stop != null)
		{
			spinner.stop();
		}

		if (err != null)
		{
			editorUi.handleError(err);
			return;
		}

		editorUi.executeLayout(apply, true, done);
	});
};

// ═══════════════════════════════════════════════════════════════════
// ElkLayout — config dialogs (per algorithm)
// ═══════════════════════════════════════════════════════════════════

// Per-algorithm dialog settings, persisted to localStorage so the user's
// last-used values for each layout survive page reloads. Keyed by algorithm
// name (layered / mrtree / radial / force / stress).
ElkLayoutBindings.SETTINGS_KEY = '.drawio-elk-layout-settings';
ElkLayoutBindings.SETTINGS = {};
ElkLayoutBindings._settingsLoaded = false;

ElkLayoutBindings._loadSettings = function()
{
	if (ElkLayout._settingsLoaded) return;
	ElkLayout._settingsLoaded = true;

	if (!isLocalStorage) return;

	try
	{
		var raw = localStorage.getItem(ElkLayout.SETTINGS_KEY);

		if (raw != null)
		{
			var parsed = JSON.parse(raw);

			if (parsed != null && typeof parsed === 'object')
			{
				ElkLayout.SETTINGS = parsed;
			}
		}
	}
	catch (e) { /* corrupt or unavailable storage — fall back to defaults */ }
};

ElkLayoutBindings._saveSettings = function()
{
	if (!isLocalStorage) return;

	try
	{
		localStorage.setItem(ElkLayout.SETTINGS_KEY,
			JSON.stringify(ElkLayout.SETTINGS));
	}
	catch (e) { /* quota / private mode — silently ignore */ }
};

// End-user help for the layout dialogs — the docs site has one page per
// layout type, selected via the per-algorithm path suffix below.
ElkLayoutBindings.HELP_URL = 'https://www.drawio.com/docs/manual/layouts/';
ElkLayoutBindings.HELP_ANCHORS = {layered: 'flow-layouts/', mrtree: 'tree-layouts/',
	radial: 'radial-tree-layout/', force: 'organic-layout/', stress: 'organic-layout/'};

// Maximum number of selected cells that an algorithm can use as roots.
// Layered and mrtree both naturally support multiple topology roots (any
// node with no incoming edges sits in the first layer / becomes a tree root).
// Radial picks a single root, so extra selections are dropped. Force/stress
// have no root concept and are absent from the map.
ElkLayoutBindings.MAX_ROOTS = {layered: Infinity, mrtree: Infinity, radial: 1};

// Field descriptors per algorithm. Each entry produces one row in the dialog.
// `key` is the ELK option name; values are coerced to strings before being
// merged with the menu's baseOptions.
ElkLayoutBindings.DIALOG_FIELDS = {
	layered: [
		{key: 'elk.spacing.nodeNode', type: 'number', label: 'nodeSpacing', def: 30},
		{key: 'elk.layered.spacing.nodeNodeBetweenLayers', type: 'number', label: 'rankSpacing', def: 30},
		{key: 'elk.layered.layering.strategy', type: 'select', label: 'layeringStrategy', def: 'NETWORK_SIMPLEX', choices: [
			{value: 'NETWORK_SIMPLEX', label: 'networkSimplex'},
			{value: 'LONGEST_PATH', label: 'longestPath'},
			{value: 'COFFMAN_GRAHAM', label: 'coffmanGraham'}
		]}
		// elk.edgeRouting + edgeStyle collapsed into the Connector dropdown
		// (see CONNECTOR_PRESETS below) — the orthogonal/polyline routing and
		// the mxGraph render style move together, so exposing them as two
		// separate dropdowns produced nonsensical pairs (e.g. POLYLINE +
		// orthogonalEdgeStyle force right-angles on top of ELK's diagonals).
	],
	mrtree: [
		{key: 'elk.spacing.nodeNode', type: 'number', label: 'nodeSpacing', def: 20},
		{key: 'elk.mrtree.weighting', type: 'select', label: 'weighting', def: 'MODEL_ORDER', choices: [
			{value: 'MODEL_ORDER', label: 'modelOrder'},
			{value: 'DESCENDANTS', label: 'descendants'},
			{value: 'CONSTRAINT', label: 'constraint'},
			{value: 'FAN', label: 'fan'}
		]}
	],
	radial: [
		{key: 'elk.spacing.nodeNode', type: 'number', label: 'nodeSpacing', def: 20},
		{key: 'elk.radial.optimizationCriteria', type: 'select', label: 'optimization', def: 'NONE', choices: [
			{value: 'NONE', label: 'none'},
			{value: 'EDGE_LENGTH', label: 'edgeLength'},
			{value: 'EDGE_LENGTH_BY_POSITION', label: 'edgeLengthByPosition'},
			{value: 'CROSSING_MINIMIZATION_BY_POSITION', label: 'crossingMinimization'}
		]}
	],
	force: [
		{key: 'elk.spacing.nodeNode', type: 'number', label: 'nodeSpacing', def: 10},
		{key: 'elk.force.iterations', type: 'number', label: 'iterations', def: 300},
		{key: 'elk.force.repulsivePower', type: 'number', label: 'repulsivePower', def: 0}
	],
	stress: [
		{key: 'elk.spacing.nodeNode', type: 'number', label: 'nodeSpacing', def: 80},
		{key: 'elk.stress.desiredEdgeLength', type: 'number', label: 'edgeLength', def: 100},
		// omitIfNegative: ELK has no "unlimited" sentinel — its loop stops
		// once count >= limit, so passing -1 would end stress majorization
		// after a single pass. Leaving the option out instead picks up the
		// engine default (refine until the convergence test stops it),
		// which is what -1 is meant to say here.
		{key: 'elk.stress.iterationLimit', type: 'number', label: 'iterations', def: -1, omitIfNegative: true}
	]
};

// Group padding — the space each laid-out container keeps between its border
// (or title bar) and its children. Every algorithm lays out containers, so
// every dialog gets the row. Not an ELK option: `runOption: true` routes the
// value into runOptions.groupPadding (→ the bridge's adapter) instead of
// layoutOptions. Blank means "automatic" (the bridge's 20/10/10/10 defaults;
// a cell's own groupPadding style always wins — see ElkAdapter).
(function()
{
	for (var algorithm in ElkLayoutBindings.DIALOG_FIELDS)
	{
		ElkLayoutBindings.DIALOG_FIELDS[algorithm].push({key: 'groupPadding',
			type: 'number', label: 'groupPadding', def: '', runOption: true});
	}
})();

/**
 * Opens a config dialog for the given algorithm. By default, Apply runs the
 * layout via ElkLayout.run; passing `onApply` swaps that behavior so callers
 * can receive the built (layoutOptions, runOptions) pair instead — used by
 * the custom layout dialog's Add dropdown, which writes the config into a
 * JSON array rather than running it immediately. `onCancel` fires when the
 * user dismisses the dialog and is similarly used by the custom layout
 * dialog to re-open itself with the unchanged JSON.
 *
 * Reads previous values from session settings; writes them back on Apply.
 * baseOptions are merged in last so the menu's direction preset can't be
 * overridden through the dialog.
 */
ElkLayoutBindings.runWithDialog = function(editorUi, algorithm, baseOptions, dialogTitle, onApply, onCancel)
{
	ElkLayout._loadSettings();
	var fields = ElkLayout.DIALOG_FIELDS[algorithm] || [];
	var saved = ElkLayout.SETTINGS[algorithm] || {};
	var graph = editorUi.editor.graph;

	// Selection-as-root(s): collect every selected vertex up to the algorithm's
	// max-roots cap. Radial accepts exactly 1; layered/mrtree accept any number.
	// Skipped when Apply will divert to a childLayout rewrite (single layout
	// container selected, default run mode): the divert strips rootCellIds,
	// so the checkbox would be dead UI. The custom layout dialog's Add flow
	// (onApply set) keeps it — its JSON runs later under another selection.
	var sel = graph.getSelectionCells();
	var maxRoots = ElkLayout.MAX_ROOTS[algorithm] || 0;
	var rootCandidates = [];
	var layoutContainer = (typeof onApply === 'function') ?
		null : editorUi.getSelectedLayoutContainer();

	if (maxRoots > 0 && (typeof onApply === 'function' || layoutContainer == null))
	{
		for (var ci = 0; ci < sel.length && rootCandidates.length < maxRoots; ci++)
		{
			if (graph.model.isVertex(sel[ci]))
			{
				rootCandidates.push(sel[ci]);
			}
		}
	}

	var div = document.createElement('div');

	var hd = document.createElement('h3');
	mxUtils.write(hd, dialogTitle || mxResources.get('layout'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
	div.appendChild(hd);

	// Three sections: layout-shape fields / edge fields / checkboxes.
	var shapeSection = document.createElement('div');
	shapeSection.className = 'geDialogSection';

	var edgeSection = document.createElement('div');
	edgeSection.className = 'geDialogSection';

	var toggleSection = document.createElement('div');
	toggleSection.className = 'geDialogSection';

	// Force-directed (Fruchterman-Reingold) and stress majorization are both
	// "Organic" layouts that produce similarly-shaped results from different
	// objective functions. Rather than expose them as two separate menu items
	// (the difference is subtle for everyday diagrams), surface stress via a
	// Method dropdown inside the Organic dialog. Switching the method tears
	// down and reopens the dialog with the new algorithm so each algo's
	// per-key DIALOG_FIELDS render correctly and saved settings stay separate.
	if (algorithm === 'force' || algorithm === 'stress')
	{
		var methodRow = document.createElement('div');
		methodRow.className = 'geDialogFormRow';

		var methodLbl = document.createElement('span');
		methodLbl.className = 'geDialogFormLabel';
		methodLbl.style.minWidth = '140px';
		methodLbl.style.marginRight = '8px';
		mxUtils.write(methodLbl, mxResources.get('method') + ':');
		methodRow.appendChild(methodLbl);

		var methodSelect = document.createElement('select');
		methodSelect.style.marginLeft = '0';

		var forceOpt = document.createElement('option');
		forceOpt.value = 'force';
		mxUtils.write(forceOpt, mxResources.get('forceDirected'));
		if (algorithm === 'force') forceOpt.selected = true;
		methodSelect.appendChild(forceOpt);

		var stressOpt = document.createElement('option');
		stressOpt.value = 'stress';
		mxUtils.write(stressOpt, mxResources.get('stress'));
		if (algorithm === 'stress') stressOpt.selected = true;
		methodSelect.appendChild(stressOpt);

		methodRow.appendChild(methodSelect);
		shapeSection.appendChild(methodRow);

		mxEvent.addListener(methodSelect, 'change', function()
		{
			var newAlgo = methodSelect.value;
			if (newAlgo === algorithm) return;

			editorUi.hideDialog();
			ElkLayout.runWithDialog(editorUi, newAlgo, baseOptions,
				dialogTitle, onApply, onCancel);
		});
	}

	var inputs = {};

	for (var i = 0; i < fields.length; i++)
	{
		var f = fields[i];
		var row = document.createElement('div');
		row.className = 'geDialogFormRow';

		var lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		// Fixed-floor label column so short labels line up; long labels
		// (German "Kreuzungsminimierung", "Kantenlänge nach Position", …)
		// grow past the floor without truncation. margin-right guarantees
		// at least 8 px between every label and its input.
		lbl.style.minWidth = '140px';
		lbl.style.marginRight = '8px';
		mxUtils.write(lbl, mxResources.get(f.label) + ':');
		row.appendChild(lbl);

		var current = saved[f.key] != null ? saved[f.key] : f.def;

		// When Apply will divert to a selected layout container, seed the
		// Group Padding field from the container's own style — that is the
		// value the container actually uses (style wins over the run option,
		// and a transparentBounds container renders its box from it), so the
		// field shows and edits the effective padding instead of a stale
		// remembered value.
		if (f.key === 'groupPadding' && layoutContainer != null)
		{
			var stylePadding = graph.getCellStyle(layoutContainer)['groupPadding'];

			if (stylePadding != null)
			{
				try
				{
					stylePadding = decodeURIComponent(String(stylePadding));
				}
				catch (e)
				{
					// keep as-is
				}

				current = stylePadding;
			}
		}

		var input;

		if (f.type === 'select')
		{
			input = document.createElement('select');

			for (var j = 0; j < f.choices.length; j++)
			{
				var ch = f.choices[j];
				var opt = document.createElement('option');
				opt.value = ch.value;
				mxUtils.write(opt, mxResources.get(ch.label));
				if (String(current) === String(ch.value)) opt.selected = true;
				input.appendChild(opt);
			}

			input.style.marginLeft = '0';
		}
		else
		{
			input = document.createElement('input');
			input.setAttribute('type', 'text');
			input.value = String(current);
		}

		row.appendChild(input);
		shapeSection.appendChild(row);
		inputs[f.key] = {input: input, type: f.type,
			omitIfNegative: f.omitIfNegative === true,
			runOption: f.runOption === true};
	}

	// Edge style selector — controls routing/segments. 'auto' picks
	// orthogonal vs straight to match the routing ELK produced; 'keep'
	// preserves existing styles and skips ELK's bend points entirely.
	// Corner treatment (sharp/rounded/curved) is a separate selector —
	// the two are independent mxGraph style flags.
	var addSelect = function(targetSection, labelKey, choices, savedValue, defaultValue)
	{
		var row = document.createElement('div');
		row.className = 'geDialogFormRow';

		var lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		lbl.style.minWidth = '140px';
		lbl.style.marginRight = '8px';
		mxUtils.write(lbl, mxResources.get(labelKey) + ':');
		row.appendChild(lbl);

		var sel = document.createElement('select');
		sel.style.marginLeft = '0';
		var resolved = savedValue || defaultValue;

		for (var k = 0; k < choices.length; k++)
		{
			var opt = document.createElement('option');
			opt.value = choices[k].value;
			mxUtils.write(opt, mxResources.get(choices[k].label));
			if (choices[k].value === resolved) opt.selected = true;
			sel.appendChild(opt);
		}

		row.appendChild(sel);
		targetSection.appendChild(row);
		return sel;
	};

	// For the layered (flow) algorithm the ELK edge-routing choice and the
	// mxGraph render-style choice move together — only ~3 combinations
	// produce a sensible render and the rest are noise. Collapse them into
	// one "Connector" dropdown whose presets pin both at the same time.
	// Other algorithms (force / stress / radial / mrtree) have no
	// edgeRouting concept, so they keep the legacy edgeStyle dropdown.
	var isLayered = algorithm === 'layered';
	var connectorSelect = null;
	var edgeStyleSelect = null;

	if (isLayered)
	{
		// A saved 'orthogonalStrict' predates the connector unification:
		// 'orthogonal' now emits the strict (canonical) mode, so the legacy
		// value folds onto it.
		var savedConnector = (saved.__connector === 'orthogonalStrict') ?
			'orthogonal' : saved.__connector;

		connectorSelect = addSelect(edgeSection, 'connector', [
			{value: 'orthogonal', label: 'orthogonal'},
			{value: 'polyline', label: 'polyline'}
		], savedConnector, 'orthogonal');
	}
	else
	{
		edgeStyleSelect = addSelect(edgeSection, 'edgeStyle', [
			{value: 'auto', label: 'automatic'},
			{value: 'keep', label: 'keepStyle'},
			{value: 'orthogonal', label: 'orthogonal'},
			{value: 'straight', label: 'straight'}
		], saved.__edgeStyle, 'auto');
	}

	var cornersSelect = addSelect(edgeSection, 'corners', [
		{value: 'keep', label: 'keepStyle'},
		{value: 'straight', label: 'straight'},
		{value: 'rounded', label: 'rounded'},
		{value: 'curved', label: 'curved'}
	], saved.__corners, isLayered ? ((ElkLayout.CANONICAL_EDGE || {}).corners || 'rounded') : 'keep');

	// Resize-nodes opt-in (default off — ELK can grow nodes that have node
	// labels even when the user just wants positions reflowed).
	var savedResize = saved.__resize === true;
	var resizeRow = document.createElement('div');
	resizeRow.className = 'geDialogCheckRow';

	var resizeCb = document.createElement('input');
	resizeCb.setAttribute('type', 'checkbox');
	resizeCb.id = 'geElkResize';
	if (savedResize) resizeCb.checked = true;
	resizeRow.appendChild(resizeCb);

	var resizeLbl = document.createElement('label');
	resizeLbl.setAttribute('for', resizeCb.id);
	mxUtils.write(resizeLbl, mxResources.get('resizeNodes'));
	resizeRow.appendChild(resizeLbl);
	toggleSection.appendChild(resizeRow);

	// Preserve-origin opt-in. ELK packs its output near (0,0); enabling
	// this translates the result so the top-left of the laid-out cluster
	// matches the top-left of the source cluster.
	var preserveOriginRow = document.createElement('div');
	preserveOriginRow.className = 'geDialogCheckRow';

	var preserveOriginCb = document.createElement('input');
	preserveOriginCb.setAttribute('type', 'checkbox');
	preserveOriginCb.id = 'geElkPreserveOrigin';
	if (saved.__preserveOrigin !== false) preserveOriginCb.checked = true;
	preserveOriginRow.appendChild(preserveOriginCb);

	var preserveOriginLbl = document.createElement('label');
	preserveOriginLbl.setAttribute('for', preserveOriginCb.id);
	mxUtils.write(preserveOriginLbl, mxResources.get('preserveOrigin'));
	preserveOriginRow.appendChild(preserveOriginLbl);
	toggleSection.appendChild(preserveOriginRow);

	// Shared-stem opt-out (mrtree only). Default on: a parent's outgoing
	// edges leave through one shared segment at the side's center — the
	// legacy compact-tree look. Unchecked keeps ELK's spread exit points,
	// one per child edge (the bridge's sharedStems:false).
	var sharedStemsCb = null;

	if (algorithm === 'mrtree')
	{
		var sharedStemsRow = document.createElement('div');
		sharedStemsRow.className = 'geDialogCheckRow';

		sharedStemsCb = document.createElement('input');
		sharedStemsCb.setAttribute('type', 'checkbox');
		sharedStemsCb.id = 'geElkSharedStems';
		if (saved.__sharedStems !== false) sharedStemsCb.checked = true;
		sharedStemsRow.appendChild(sharedStemsCb);

		var sharedStemsLbl = document.createElement('label');
		sharedStemsLbl.setAttribute('for', sharedStemsCb.id);
		mxUtils.write(sharedStemsLbl, mxResources.get('sharedStems'));
		sharedStemsRow.appendChild(sharedStemsLbl);
		toggleSection.appendChild(sharedStemsRow);
	}

	// Use-selection-as-root(s) opt-in (only when applicable)
	var rootCb = null;

	if (rootCandidates.length > 0)
	{
		var rootRow = document.createElement('div');
		rootRow.className = 'geDialogCheckRow';

		rootCb = document.createElement('input');
		rootCb.setAttribute('type', 'checkbox');
		rootCb.id = 'geElkRoot';

		// Default on when a selected vertex has connected edges
		var hasConnectedEdges = false;

		for (var ri = 0; ri < rootCandidates.length; ri++)
		{
			if (graph.model.getEdgeCount(rootCandidates[ri]) > 0)
			{
				hasConnectedEdges = true;
				break;
			}
		}

		if (hasConnectedEdges || saved.__root === true) rootCb.checked = true;
		rootRow.appendChild(rootCb);

		var rootLbl = document.createElement('label');
		rootLbl.setAttribute('for', rootCb.id);
		var rootKey = rootCandidates.length === 1 ?
			'useSelectionAsRoot' : 'useSelectionAsRoots';
		mxUtils.write(rootLbl, mxResources.get(rootKey));
		rootRow.appendChild(rootLbl);
		toggleSection.appendChild(rootRow);
	}

	if (shapeSection.childNodes.length > 0) div.appendChild(shapeSection);
	div.appendChild(edgeSection);
	div.appendChild(toggleSection);

	var applyFn = function()
	{
		var layoutOptions = {};
		var runOptionValues = {};
		var newSaved = {};

		for (var key in inputs)
		{
			var entry = inputs[key];
			var val = entry.input.value;

			// Bridge options (e.g. groupPadding) go into runOptions below,
			// not into the ELK layoutOptions map — before the number
			// coercion: groupPadding accepts a single number OR a CSS-style
			// 'top right bottom left' string (e.g. seeded from a container's
			// style), which parseFloat would truncate to its first value.
			if (entry.runOption)
			{
				val = String(val).trim();
				if (val === '') continue;

				var asNum = parseFloat(val);
				runOptionValues[key] = (String(asNum) === val) ? asNum : val;
				newSaved[key] = val;
				continue;
			}

			if (entry.type === 'number')
			{
				var num = parseFloat(val);
				if (isNaN(num)) continue;
				val = String(num);

				// Negative means "not set" for omitIfNegative fields: keep
				// the value for the next dialog open, but leave the option
				// out so the ELK default applies (see DIALOG_FIELDS).
				if (entry.omitIfNegative && num < 0)
				{
					newSaved[key] = val;
					continue;
				}
			}

			layoutOptions[key] = val;
			newSaved[key] = val;
		}

		// baseOptions (set by menu, e.g. direction) win over dialog values
		if (baseOptions != null)
		{
			for (var k in baseOptions) layoutOptions[k] = baseOptions[k];
		}

		newSaved.__resize = !!resizeCb.checked;
		newSaved.__root = rootCb != null && rootCb.checked;
		newSaved.__corners = cornersSelect.value;
		newSaved.__preserveOrigin = !!preserveOriginCb.checked;

		if (sharedStemsCb != null)
		{
			newSaved.__sharedStems = !!sharedStemsCb.checked;
		}

		// Connector preset → (elk.edgeRouting, edgeStyleMode) pair. Only the
		// sensible combinations are exposed; mixing orthogonal-routing with
		// straight-render (or vice versa) produced visually broken edges and
		// is no longer reachable from the dialog.
		var edgeStyleMode;

		if (isLayered)
		{
			var connector = connectorSelect.value;
			newSaved.__connector = connector;

			if (connector === 'polyline')
			{
				layoutOptions['elk.edgeRouting'] = 'POLYLINE';
				edgeStyleMode = 'straight';
			}
			else
			{
				// 'orthogonal' (default) — ELK orthogonal routing rendered in
				// the canonical strict mode: every edge becomes a live
				// orthogonalEdgeStyle SegmentConnector reproducing ELK's exact
				// route. Reading CANONICAL_EDGE keeps the dialog, the MCP
				// create_diagram postLayout and the mermaid-edit post-pass
				// producing the same edges by construction. (The former
				// 'orthogonalStrict' entry folded into this one when the
				// perpendicular-perimeter pins made the conservative and
				// strict renders identical; the conservative modes remain
				// reachable via JSON childLayout specs.)
				layoutOptions['elk.edgeRouting'] = 'ORTHOGONAL';
				edgeStyleMode = (ElkLayout.CANONICAL_EDGE || {}).edgeStyleMode ||
					'orthogonalEdgeStyle';
			}
		}
		else
		{
			edgeStyleMode = edgeStyleSelect.value;
			newSaved.__edgeStyle = edgeStyleMode;
		}

		ElkLayout.SETTINGS[algorithm] = newSaved;
		ElkLayout._saveSettings();

		var runOptions = {
			applierOptions: {resizeParent: !!resizeCb.checked},
			edgeStyleMode: edgeStyleMode,
			corners: cornersSelect.value,
			preserveOrigin: !!preserveOriginCb.checked
		};

		for (var roKey in runOptionValues)
		{
			runOptions[roKey] = runOptionValues[roKey];
		}

		if (rootCb != null && rootCb.checked && rootCandidates.length > 0)
		{
			runOptions.rootCellIds = rootCandidates.map(function(c) { return c.id; });
		}

		// Default true — only the opt-out needs passing (and persisting via
		// elkOptionsToConfig when the custom layout dialog captures this).
		if (sharedStemsCb != null && !sharedStemsCb.checked)
		{
			runOptions.sharedStems = false;
		}

		if (typeof onApply === 'function')
		{
			onApply(layoutOptions, runOptions);
		}
		else
		{
			ElkLayout.run(editorUi, algorithm, layoutOptions, runOptions);
		}
	};

	// Reset clears the saved settings for this algorithm and re-opens the
	// dialog so every field shows its default. Only meaningful when the
	// settings actually persist — without localStorage, the dialog already
	// starts at defaults each time, so the button would be a no-op.
	var resetBtn = null;

	if (isLocalStorage)
	{
		resetBtn = mxUtils.button(mxResources.get('reset'), function()
		{
			delete ElkLayout.SETTINGS[algorithm];
			ElkLayout._saveSettings();
			editorUi.hideDialog();
			// Re-arm the same onApply/onCancel — without this, a Reset from
			// the custom layout dialog's Add flow would drop back into the
			// default "run immediately" mode and skip the JSON append step.
			ElkLayout.runWithDialog(editorUi, algorithm, baseOptions, dialogTitle,
				onApply, onCancel);
		});
		resetBtn.className = 'geBtn';
	}

	var dlg = new CustomDialog(editorUi, div, applyFn, onCancel || null,
		mxResources.get('apply'), ElkLayout.HELP_URL +
		(ElkLayout.HELP_ANCHORS[algorithm] || ''), resetBtn);
	editorUi.showDialog(dlg.container, 360, null, true, true);
};

// ─── Editor hook: release libavoid auto-routing on routed edges ─────

// A run that stamps its own edge routing takes ownership of the edges: turn
// libavoid auto-routing OFF on them (libavoidRouting=0 where enabled, via
// LibavoidRouting.releaseEdges) — otherwise the next gesture re-routes the
// just-laid-out edges per-edge through libavoid, destroying the layout's
// routing (ELK's stamped exit/entry pins force fanned detours). An explicit
// edgeStyleMode 'keep' leaves edge routing, and therefore the flag, alone
// ('auto' resolves to a stamping mode, so it releases too). Runs inside the
// layout's own model edit and honors the run's scope (cellFilter /
// selection-as-root components), so one undo reverts layout + flags and a
// scoped run doesn't touch other components' flags. Covers every ELK entry
// point through the shared _applyResult: dialog, layout-spec/CSV runs, Run
// Last Layout replays and childLayout containers (converged container
// re-runs stay empty edits — the flag is only written while it is '1').
var installElkLibavoidRelease = function(cls)
{
	var elkApplyResult = cls.prototype._applyResult;

	cls.prototype._applyResult = function(parent, ctx, result)
	{
		elkApplyResult.apply(this, arguments);

		if (this.edgeStyleMode !== 'keep' &&
			typeof LibavoidRouting !== 'undefined' &&
			LibavoidRouting.releaseEdges != null)
		{
			LibavoidRouting.releaseEdges(this.graph, parent,
				this._effectiveCellFilter);
		}
	};
};

if (elkLayoutLoaded)
{
	installElkLibavoidRelease(ElkLayout);
}

// If the statics were staged (the bundle hadn't defined ElkLayout when this
// file ran), copy them onto ElkLayout as soon as it appears. Capped poll so a
// genuinely missing bundle logs once instead of spinning forever.
if (!elkLayoutLoaded)
{
	var elkAttachTries = 0;
	var elkAttachPoll = setInterval(function()
	{
		if (typeof ElkLayout !== 'undefined' && ElkLayout != null)
		{
			clearInterval(elkAttachPoll);

			for (var elkKey in ElkLayoutBindings)
			{
				ElkLayout[elkKey] = ElkLayoutBindings[elkKey];
			}

			installElkLibavoidRelease(ElkLayout);
		}
		else if (++elkAttachTries > 600)
		{
			clearInterval(elkAttachPoll);

			if (window.console != null)
			{
				console.error('drawio-elk.min.js (ElkLayout) failed to load; ' +
					'Arrange > Layout ELK menu items are disabled.');
			}
		}
	}, 30);
}
