/**
 * Exports the step animation of the current page (the `animation` attribute
 * of the model root, see Editor.parseAnimationData) as an animated GIF or an
 * MP4 video with a fixed frame size.
 *
 * The live engine (Graph.executeCustomActions) runs on timers and CSS
 * transitions, which cannot be sampled at exact times. The export therefore
 * replays the steps batch by batch on an offscreen copy of the page with a
 * virtual clock (AnimationExport.Player): discrete changes use the same
 * transient helpers as the engine on the copy, and timed effects (fades,
 * wipes, pops, highlights, flow, smooth viewport changes) are evaluated at
 * each frame time. Each frame is the SVG export of the copy with the current
 * opacity, flow and viewport applied, rasterized onto a canvas. The copy is
 * only rendered again (a new "segment") when the steps changed the copy's
 * shapes. The user's graph and model are never touched.
 *
 * The timing below mirrors executeCustomActions and must be kept in sync
 * with it (see docs/claude/animations.md).
 *
 * Usage:
 *   var exp = new AnimationExport(editorUi, {format: 'gif', fps: 15});
 *   exp.doExport(function(blob) { ... }, function(e) { ... }, onProgress);
 */
function AnimationExport(editorUi, options)
{
	this.editorUi = editorUi;
	this.options = options || {};
	this.width = this.options.width || AnimationExport.width;
	this.height = this.options.height || AnimationExport.height;
	this.fps = this.options.fps || 15;
	this.cancelled = false;
};

/**
 * Size of the exported frames.
 */
AnimationExport.width = 1280;
AnimationExport.height = 720;

/**
 * Longest animation in milliseconds that is offered for GIF export. Longer
 * animations should use MP4 as GIF files grow too large.
 */
AnimationExport.maxGifDuration = 30000;

/**
 * Longest export in milliseconds. Longer animations are cut off so that a
 * diagram with a huge wait cannot make the export run out of memory.
 */
AnimationExport.maxDuration = 600000;

/**
 * Border around the diagram for the initial view (see
 * EditorUi.lightboxFit) and the largest initial zoom.
 */
AnimationExport.initialBorder = 60;
AnimationExport.initialMaxScale = 2;

/**
 * Duration of smooth scroll and viewbox steps (see Graph.smoothFitWindow).
 */
AnimationExport.smoothDuration = 600;

/**
 * Duration of the highlight fade out (see Graph.highlightCell).
 */
AnimationExport.highlightFadeDuration = 1200;

/**
 * Period and dash offset of the flow step (see Editor.installAnimationStyles).
 */
AnimationExport.flowPeriod = 500;
AnimationExport.flowOffset = -16;

/**
 * Shortest export if a flow animation is running at the end.
 */
AnimationExport.minFlowDuration = 1000;

/**
 * Number of frames that are sampled for the GIF palette.
 */
AnimationExport.paletteSamples = 12;

/**
 * Returns the parsed step animation of the given graph's current page or
 * null if the page has no steps.
 */
AnimationExport.getAnimationData = function(graph)
{
	var root = graph.getModel().getRoot();
	var raw = (root != null && root.value != null && typeof root.value == 'object') ?
		root.value.getAttribute('animation') : null;

	if (raw != null && raw != '')
	{
		try
		{
			var data = Editor.parseAnimationData(raw);

			if (data.steps != null && data.steps.length > 0)
			{
				return data;
			}
		}
		catch (e)
		{
			// Malformed animation is ignored
		}
	}

	return null;
};

/**
 * Returns the batches of actions that run in parallel. Mirrors the batching
 * of Editor.AnimationPlayer.play (steps with immediate: true join the
 * previous step) and of executeCustomActions on the flattened actions.
 */
AnimationExport.getBatches = function(steps)
{
	var batches = [];
	var idx = 0;

	while (idx < steps.length)
	{
		var end = idx + 1;

		while (end < steps.length && steps[end] != null &&
			steps[end].immediate === true)
		{
			end++;
		}

		var actions = Graph.flattenAnimationActions(steps.slice(idx, end));
		var batch = null;

		for (var i = 0; i < actions.length; i++)
		{
			if (actions[i] != null && typeof actions[i] == 'object')
			{
				if (batch == null || actions[i].immediate !== true)
				{
					batch = [];
					batches.push(batch);
				}

				batch.push(actions[i]);
			}
		}

		idx = end;
	}

	return batches;
};

/**
 * Returns a function for the CSS timing function cubic-bezier(x1, y1, x2, y2).
 */
AnimationExport.cubicBezier = function(x1, y1, x2, y2)
{
	var bezier = function(u, p1, p2)
	{
		var v = 1 - u;

		return 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u;
	};

	return function(t)
	{
		if (t <= 0 || t >= 1)
		{
			return Math.max(0, Math.min(1, t));
		}

		// Bisection on x(u) = t, x is monotonic for 0 <= x1, x2 <= 1
		var lo = 0, hi = 1, u = t;

		for (var i = 0; i < 30; i++)
		{
			u = (lo + hi) / 2;

			if (bezier(u, x1, x2) < t)
			{
				lo = u;
			}
			else
			{
				hi = u;
			}
		}

		return bezier(u, y1, y2);
	};
};

/**
 * CSS ease-in-out of the fade transitions.
 */
AnimationExport.easeInOut = AnimationExport.cubicBezier(0.42, 0, 0.58, 1);

/**
 * Cubic ease-out of the smooth scroll (see Graph.smoothScrollContainer).
 */
AnimationExport.easeOut = function(t)
{
	return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
};

/**
 * Parses a duration in milliseconds as the timers of the engine do.
 */
AnimationExport.parseTime = function(value, defaultValue)
{
	if (value == null)
	{
		return defaultValue;
	}

	var result = parseFloat(value);

	return (isNaN(result)) ? 0 : Math.max(0, result);
};

/**
 * Returns the numeric opacity of the given DOM node (empty means 1).
 */
AnimationExport.getNodeOpacity = function(node)
{
	var value = parseFloat(node.style.opacity);

	return (isNaN(value)) ? 1 : value;
};

/**
 * Creates an offscreen copy of the current page of the given UI. The caller
 * must call AnimationExport.destroyGraph with the result.
 */
AnimationExport.createGraph = function(editorUi)
{
	var source = editorUi.editor.graph;
	var graph = editorUi.createTemporaryGraph(source.getStylesheet());
	document.body.appendChild(graph.container);

	graph.background = source.background;
	graph.backgroundImage = source.backgroundImage;
	graph.shadowVisible = source.shadowVisible;
	graph.mathEnabled = source.mathEnabled;
	graph.adaptiveColors = source.adaptiveColors;
	graph.enableFlowAnimation = source.enableFlowAnimation;
	graph.shapeBackgroundColor = source.shapeBackgroundColor;
	graph.shapeForegroundColor = source.shapeForegroundColor;

	// Resolves placeholders like the current page
	graph.getGlobalVariable = function()
	{
		return source.getGlobalVariable.apply(source, arguments);
	};

	// The node must be in the document to resolve references to cells that
	// come later in the document, eg. edges before their terminals
	var doc = mxUtils.createXmlDocument();
	var node = new mxCodec(doc).encode(source.getModel());
	doc.appendChild(node);
	new mxCodec(doc).decode(node, graph.getModel());

	// State coordinates are model coordinates in the export
	graph.view.scaleAndTranslate(1, 0, 0);
	graph.view.validate();

	return graph;
};

/**
 * Removes the given offscreen graph.
 */
AnimationExport.destroyGraph = function(graph)
{
	if (graph != null)
	{
		if (graph.container != null && graph.container.parentNode != null)
		{
			graph.container.parentNode.removeChild(graph.container);
		}

		graph.destroy();
	}
};

/**
 * Returns the duration of the given animation data in milliseconds, or 0 if
 * the page has no animation. With trailing, highlights that are still fading
 * out after the last step are included.
 */
AnimationExport.getDuration = function(editorUi, data, trailing)
{
	data = (data != null) ? data : AnimationExport.getAnimationData(editorUi.editor.graph);
	var result = 0;

	if (data != null)
	{
		var graph = AnimationExport.createGraph(editorUi);

		try
		{
			var player = new AnimationExport.Player(graph, data,
				AnimationExport.width, AnimationExport.height);
			result = player.getDuration(trailing);
		}
		finally
		{
			AnimationExport.destroyGraph(graph);
		}
	}

	return result;
};

/**
 * Replays animation steps on the given (offscreen) graph with a virtual
 * clock. Call advanceTo with increasing times and read the state of the
 * graph (DOM opacity, flow classes, shapes) and the camera.
 */
AnimationExport.Player = function(graph, data, width, height)
{
	this.graph = graph;
	this.data = data;
	this.width = width;
	this.height = height;
	this.batches = AnimationExport.getBatches(data.steps || []);
	this.batchIndex = 0;
	this.nextStart = 0;
	this.endTime = null;
	this.tweens = [];
	this.effects = [];
	this.highlights = [];
	this.flowStart = new Map();
	this.cameraTween = null;
	this.dirty = true;
	this.camera = this.getInitialCamera();
};

/**
 * Returns the initial viewport like the lightbox fit (EditorUi.lightboxFit).
 */
AnimationExport.Player.prototype.getInitialCamera = function()
{
	var bounds = this.graph.getGraphBounds();
	var border = AnimationExport.initialBorder;
	var scale = 1;

	if (bounds.width > 0 && bounds.height > 0)
	{
		scale = Math.min(AnimationExport.initialMaxScale,
			Math.max(0.01, (this.width - 2 * border) / bounds.width),
			Math.max(0.01, (this.height - 2 * border) / bounds.height));
	}

	return {x: bounds.x + bounds.width / 2 - this.width / (2 * scale),
		y: bounds.y + bounds.height / 2 - this.height / (2 * scale),
		scale: scale};
};

/**
 * Keeps the viewport inside the diagram like the scroll extents in the
 * lightbox. Axes where the diagram is smaller than the viewport are
 * centered.
 */
AnimationExport.Player.prototype.clampCamera = function(camera)
{
	var gb = this.graph.getGraphBounds();
	var vw = this.width / camera.scale;
	var vh = this.height / camera.scale;

	var clamp = function(value, start, size, view)
	{
		return (size <= view) ? start + (size - view) / 2 :
			Math.max(start, Math.min(value, start + size - view));
	};

	return {x: clamp(camera.x, gb.x, gb.width, vw),
		y: clamp(camera.y, gb.y, gb.height, vh),
		scale: camera.scale};
};

/**
 * Returns the viewport for a viewbox action (see
 * Graph.fitBoundsCssTransform, which the lightbox uses).
 */
AnimationExport.Player.prototype.getFitCamera = function(bounds, border)
{
	var b = (border != null) ? border : 10;
	var gb = this.graph.getGraphBounds();
	var left = Math.max(gb.x, bounds.x);
	var top = Math.max(gb.y, bounds.y);
	var w = Math.max(1, Math.min(gb.x + gb.width, bounds.x + bounds.width) - left);
	var h = Math.max(1, Math.min(gb.y + gb.height, bounds.y + bounds.height) - top);
	var fit = Math.min((this.width - b) / w, (this.height - b) / h);
	var scale = Math.floor(20 * fit) / 20;

	if (!(scale > 0))
	{
		scale = Math.max(0.01, fit);
	}

	return this.clampCamera({x: left + w / 2 - this.width / (2 * scale),
		y: top + h / 2 - this.height / (2 * scale), scale: scale});
};

/**
 * Returns the viewport for scrolling the given cell into view at the
 * current zoom (see Graph.scrollCellToVisibleCssTransform).
 */
AnimationExport.Player.prototype.getScrollCamera = function(cell, border)
{
	var state = this.graph.view.getState(cell);

	if (state == null)
	{
		return null;
	}

	var s = this.camera.scale;
	var vw = this.width / s;
	var vh = this.height / s;
	var x = this.camera.x;
	var y = this.camera.y;

	if (border != null)
	{
		var b = border / s;

		if (state.x - b < x)
		{
			x = state.x - b;
		}
		else if (state.x + state.width + b > x + vw)
		{
			x = state.x + state.width + b - vw;
		}

		if (state.y - b < y)
		{
			y = state.y - b;
		}
		else if (state.y + state.height + b > y + vh)
		{
			y = state.y + state.height + b - vh;
		}
	}
	else
	{
		x = state.x + state.width / 2 - vw / 2;
		y = state.y + state.height / 2 - vh / 2;
	}

	return this.clampCamera({x: x, y: y, scale: s});
};

/**
 * Moves the camera to the given viewport, optionally with a transition that
 * starts at the given time.
 */
AnimationExport.Player.prototype.moveCamera = function(camera, time, smooth)
{
	if (smooth)
	{
		this.cameraTween = {from: this.camera, to: camera, t0: time,
			t1: time + AnimationExport.smoothDuration};
	}
	else
	{
		this.cameraTween = null;
		this.camera = camera;
	}
};

/**
 * Returns the duration of the animation in milliseconds. Replays all steps
 * so the graph must not be used for rendering afterwards. With trailing,
 * highlights that are still fading out after the last step are included.
 */
AnimationExport.Player.prototype.getDuration = function(trailing)
{
	this.advanceTo(Infinity);
	var duration = this.endTime;

	if (this.flowActiveAtEnd)
	{
		duration = Math.max(duration, AnimationExport.minFlowDuration);
	}

	if (trailing && this.highlightEnd != null)
	{
		duration = Math.max(duration, this.highlightEnd);
	}

	return duration;
};

/**
 * Processes all batches that start at or before the given time and applies
 * the timed effects at that time.
 */
AnimationExport.Player.prototype.advanceTo = function(time)
{
	while (this.endTime == null && this.nextStart <= time)
	{
		var start = this.nextStart;
		this.finish(start);

		if (this.batchIndex < this.batches.length)
		{
			this.nextStart = start + this.executeBatch(
				this.batches[this.batchIndex++], start);
		}
		else
		{
			this.endTime = start;
			this.flowActiveAtEnd = this.isFlowActive();
		}
	}

	this.finish(time);
	this.update(time);
};

/**
 * Returns true if a flow step is running on any edge.
 */
AnimationExport.Player.prototype.isFlowActive = function()
{
	var result = false;

	this.graph.view.states.visit(function(id, state)
	{
		if (!result && state.shape != null &&
			state.shape.getFlowAnimationPath != null &&
			state.view.graph.model.isEdge(state.cell))
		{
			var path = state.shape.getFlowAnimationPath();
			result = path != null && path.getAttribute('class') == 'mxEdgeFlow';
		}
	});

	return result;
};

/**
 * Ends all timed effects that are finished at the given time.
 */
AnimationExport.Player.prototype.finish = function(time)
{
	for (var i = this.tweens.length - 1; i >= 0; i--)
	{
		var tween = this.tweens[i];

		if (tween.t1 <= time)
		{
			tween.node.style.opacity = tween.to;
			this.tweens.splice(i, 1);
		}
	}

	for (var i = this.effects.length - 1; i >= 0; i--)
	{
		var effect = this.effects[i];

		if (effect.t1 <= time)
		{
			for (var j = 0; j < effect.animations.length; j++)
			{
				effect.animations[j].stop();
			}

			this.effects.splice(i, 1);
			this.dirty = true;
		}
	}

	for (var i = this.highlights.length - 1; i >= 0; i--)
	{
		if (this.highlights[i].t2 <= time)
		{
			this.highlights[i].highlight.destroy();
			this.highlights.splice(i, 1);
			this.dirty = true;
		}
	}

	if (this.cameraTween != null && this.cameraTween.t1 <= time)
	{
		this.camera = this.cameraTween.to;
		this.cameraTween = null;
	}
};

/**
 * Applies the running timed effects at the given time.
 */
AnimationExport.Player.prototype.update = function(time)
{
	for (var i = 0; i < this.tweens.length; i++)
	{
		var tween = this.tweens[i];
		var f = AnimationExport.easeInOut((time - tween.t0) /
			Math.max(1, tween.t1 - tween.t0));
		tween.node.style.opacity = tween.from + (tween.to - tween.from) * f;
	}

	// Wipe and pop animations change the shapes of the cells
	for (var i = 0; i < this.effects.length; i++)
	{
		var effect = this.effects[i];
		var step = Math.round(1000 * Math.max(0, Math.min(1, (time - effect.t0) /
			Math.max(1, effect.t1 - effect.t0))));

		for (var j = 0; j < effect.animations.length; j++)
		{
			effect.animations[j].execute(step, 1000);
		}

		this.dirty = true;
	}

	if (this.cameraTween != null)
	{
		var tw = this.cameraTween;
		var f = AnimationExport.easeOut((time - tw.t0) / Math.max(1, tw.t1 - tw.t0));
		var s0 = tw.from.scale, s1 = tw.to.scale;
		var scale = s0 + (s1 - s0) * f;
		var cx0 = tw.from.x + this.width / (2 * s0);
		var cy0 = tw.from.y + this.height / (2 * s0);
		var cx = cx0 + (tw.to.x + this.width / (2 * s1) - cx0) * f;
		var cy = cy0 + (tw.to.y + this.height / (2 * s1) - cy0) * f;

		this.camera = {x: cx - this.width / (2 * scale),
			y: cy - this.height / (2 * scale), scale: scale};
	}
};

/**
 * Returns the opacity of the given highlight at the given time.
 */
AnimationExport.Player.prototype.getHighlightOpacity = function(entry, time)
{
	return (time < entry.t1) ? 1 : 1 - AnimationExport.easeInOut(
		(time - entry.t1) / Math.max(1, entry.t2 - entry.t1));
};

/**
 * Returns the time at which the flow step started on the given path.
 */
AnimationExport.Player.prototype.getFlowStart = function(path)
{
	var start = this.flowStart.get(path);

	return (start != null) ? start : 0;
};

/**
 * Adds opacity transitions for the given nodes.
 */
AnimationExport.Player.prototype.addTweens = function(nodes, from, to, time, duration)
{
	for (var i = 0; i < nodes.length; i++)
	{
		var start = (from != null) ? from :
			AnimationExport.getNodeOpacity(nodes[i]);
		nodes[i].style.opacity = start;

		if (duration > 0)
		{
			this.tweens.push({node: nodes[i], from: start, to: to,
				t0: time, t1: time + duration});
		}
		else
		{
			nodes[i].style.opacity = to;
		}
	}
};

/**
 * Runs a model change in a transaction and marks the rendering as dirty.
 */
AnimationExport.Player.prototype.updateModel = function(fn)
{
	this.graph.model.beginUpdate();

	try
	{
		fn();
	}
	finally
	{
		this.graph.model.endUpdate();
	}

	this.dirty = true;
};

/**
 * Executes the given batch of actions at the given time and returns the
 * time until the next batch starts, ie. the longest blocking effect in the
 * batch. Mirrors one iteration of the dispatcher in executeCustomActions.
 * Animation steps are transient by default, `transient: false` uses the
 * model path, which is fine on the offscreen copy. Page links (`open`) and
 * the selection are ignored as they have no visible result in the export.
 */
AnimationExport.Player.prototype.executeBatch = function(batch, time)
{
	var graph = this.graph;
	var duration = 0;

	var isTransient = function(params)
	{
		return params.transient !== false;
	};

	var block = function(ms)
	{
		duration = Math.max(duration, ms);
	};

	for (var i = 0; i < batch.length; i++)
	{
		var action = batch[i];
		var animations = [];

		if (action.wait != null)
		{
			// Same expression as the engine (a wait of 0 waits 1000 ms)
			block(AnimationExport.parseTime((action.wait != '') ?
				parseInt(action.wait) : 1000, 1000));
		}

		if (action.opacity != null && action.opacity.value != null)
		{
			var nodes = graph.getNodesForCells(graph.getCellsForAction(
				action.opacity, true));
			this.removeTweens(nodes);
			Graph.setOpacityForNodes(nodes, action.opacity.value);
		}

		if (action.fadeIn != null)
		{
			var delay = AnimationExport.parseTime(action.fadeIn.delay, 1000);
			var nodes = graph.getNodesForCells(graph.getCellsForAction(
				action.fadeIn, true));
			this.removeTweens(nodes);
			this.addTweens(nodes, 0, 1, time, delay);
			block(delay);
		}

		if (action.fadeOut != null)
		{
			var delay = AnimationExport.parseTime(action.fadeOut.delay, 1000);
			var nodes = graph.getNodesForCells(graph.getCellsForAction(
				action.fadeOut, true));
			this.removeTweens(nodes);
			this.addTweens(nodes, 1, 0, time, delay);
			block(delay);
		}

		if (action.fadeTo != null && action.fadeTo.value != null)
		{
			var delay = AnimationExport.parseTime(action.fadeTo.delay, 1000);
			var nodes = graph.getNodesForCells(graph.getCellsForAction(
				action.fadeTo, true));
			var value = parseFloat(action.fadeTo.value);
			this.removeTweens(nodes);
			this.addTweens(nodes, null, (isNaN(value)) ? 1 : value, time, delay);
			block(delay);
		}

		if (action.flow != null)
		{
			var flowCells = graph.getCellsForAction(action.flow, true);
			var before = this.getFlowPaths(flowCells);

			Editor.toggleFlowAnimation(graph, flowCells,
				action.flow.start === false ? 'stop' :
				action.flow.start === true ? 'start' : 'toggle');

			for (var j = 0; j < before.length; j++)
			{
				if (before[j].getAttribute('class') == 'mxEdgeFlow')
				{
					if (!before[j].flowActive)
					{
						this.flowStart.set(before[j], time);
					}
				}
				else
				{
					this.flowStart['delete'](before[j]);
				}

				delete before[j].flowActive;
			}
		}

		if (action.wipeIn != null)
		{
			animations = animations.concat(graph.createWipeAnimations(
				graph.getCellsForAction(action.wipeIn, true), true));
		}

		if (action.wipeOut != null)
		{
			animations = animations.concat(graph.createWipeAnimations(
				graph.getCellsForAction(action.wipeOut, true), false));
		}

		if (action.popIn != null)
		{
			animations = animations.concat(graph.createPopAnimations(
				graph.getCellsForAction(action.popIn, true), true));
		}

		if (action.popOut != null)
		{
			animations = animations.concat(graph.createPopAnimations(
				graph.getCellsForAction(action.popOut, true), false));
		}

		if (action.toggle != null)
		{
			if (!isTransient(action.toggle))
			{
				this.updateModel(function()
				{
					graph.toggleCells(graph.getCellsForAction(
						action.toggle, true, true));
				});
			}
			else
			{
				var toggleCells = graph.getCellsForAction(action.toggle, true);
				this.removeTweens(graph.getNodesForCells(toggleCells));
				graph.toggleCellsTransient(toggleCells);
				graph.updateTransientTerminalEdges(toggleCells);
			}
		}

		if (action.show != null)
		{
			var temp = graph.getCellsForAction(action.show, true);
			var nodes = graph.getNodesForCells(temp);
			this.removeTweens(nodes);
			Graph.setOpacityForNodes(nodes, 1);

			if (isTransient(action.show))
			{
				graph.updateTransientTerminalEdges(temp);
			}
			else
			{
				this.updateModel(function()
				{
					graph.setCellsVisible(graph.getCellsForAction(
						action.show, true, true), true);
				});
			}
		}

		if (action.hide != null)
		{
			var temp = graph.getCellsForAction(action.hide, true);
			var nodes = graph.getNodesForCells(temp);
			this.removeTweens(nodes);
			Graph.setOpacityForNodes(nodes, 0);

			if (isTransient(action.hide))
			{
				graph.updateTransientTerminalEdges(temp);
			}
			else
			{
				this.updateModel(function()
				{
					graph.setCellsVisible(graph.getCellsForAction(
						action.hide, true, true), false);
				});
			}
		}

		if (action.toggleStyle != null && action.toggleStyle.key != null)
		{
			var toggleStyleCells = graph.getCellsForAction(action.toggleStyle, true);
			var toggleValue = action.toggleStyle.value;
			var defValue = (action.toggleStyle.defaultValue !== '') ?
				action.toggleStyle.defaultValue : null;

			if (!isTransient(action.toggleStyle))
			{
				this.updateModel(function()
				{
					graph.toggleCellStyleValues(action.toggleStyle.key,
						toggleValue, defValue, toggleStyleCells);
				});
			}
			else
			{
				graph.toggleCellStylesTransient(action.toggleStyle.key,
					defValue, toggleStyleCells, toggleValue);
				this.dirty = true;
			}
		}

		if (action.style != null && action.style.key != null)
		{
			var styleCells = graph.getCellsForAction(action.style, true);

			if (!isTransient(action.style))
			{
				this.updateModel(function()
				{
					graph.setCellStyles(action.style.key,
						action.style.value, styleCells);
				});
			}
			else
			{
				graph.setCellStylesTransient(action.style.key,
					action.style.value, styleCells);
				this.dirty = true;
			}
		}

		// Highlight and scroll resolve the cell that is scrolled into view
		// below (the engine skips select in the disabled lightbox graph)
		var cells = [];

		if (action.highlight != null)
		{
			cells = graph.getCellsForAction(action.highlight);
			this.addHighlights(cells, action.highlight, time);
		}

		if (action.scroll != null)
		{
			cells = graph.getCellsForAction(action.scroll);
		}

		if (action.viewbox != null)
		{
			var vb = action.viewbox;
			var target = null;

			if (vb.cells != null || vb.tags != null || vb.layers != null)
			{
				// Dynamic viewbox: bounds of the cells with the border
				// per side (see executeCustomActions)
				var vbBounds = graph.getBoundingBox(graph.getCellsForAction(vb));

				if (vbBounds != null)
				{
					var vbBorder = (vb.border != null && vb.border !== '' &&
						!isNaN(parseFloat(vb.border))) ?
						2 * parseFloat(vb.border) : null;
					target = this.getFitCamera(vbBounds, vbBorder);
				}
			}
			else
			{
				var rect = new mxRectangle(parseFloat(vb.x), parseFloat(vb.y),
					parseFloat(vb.width), parseFloat(vb.height));

				if (!isNaN(rect.x) && !isNaN(rect.y) && rect.width > 0 && rect.height > 0)
				{
					// Static viewboxes pass the border as is (weak semantics)
					target = this.getFitCamera(rect, (vb.border != null) ?
						(parseFloat(vb.border) || 0) : null);
				}
			}

			if (target != null)
			{
				this.moveCamera(target, time, vb.smooth === true);

				if (vb.smooth === true)
				{
					block(AnimationExport.smoothDuration);
				}
			}
		}

		if (cells.length > 0)
		{
			var scrollBorder = (action.scroll != null &&
				action.scroll.border != null && action.scroll.border !== '' &&
				!isNaN(parseFloat(action.scroll.border))) ?
				parseFloat(action.scroll.border) : null;
			var target = this.getScrollCamera(cells[0], scrollBorder);

			if (target != null)
			{
				var smooth = action.scroll != null && action.scroll.smooth === true;
				this.moveCamera(target, time, smooth);

				if (smooth)
				{
					block(AnimationExport.smoothDuration);
				}
			}
		}

		if (action.tags != null)
		{
			if (action.tags.toggle != null)
			{
				var tags = action.tags.toggle;

				if (tags.length == 0)
				{
					tags = graph.getAllTags();
				}

				for (var j = 0; j < tags.length; j++)
				{
					graph.toggleHiddenTag(tags[j]);
				}
			}

			var hidden = null;

			if (action.tags.hidden != null)
			{
				hidden = [].concat(action.tags.hidden);
			}

			if (action.tags.visible != null)
			{
				hidden = (hidden != null) ? hidden : [];
				var all = graph.getAllTags();

				for (var j = 0; j < all.length; j++)
				{
					if (mxUtils.indexOf(action.tags.visible, all[j]) < 0 &&
						mxUtils.indexOf(hidden, all[j]) < 0)
					{
						hidden.push(all[j]);
					}
				}
			}

			if (hidden != null)
			{
				graph.setHiddenTags(hidden);
			}

			// Recreates all shapes, which resets the transient changes
			// like in the engine
			this.tweens = [];
			graph.refresh();
			this.dirty = true;
		}

		if (animations.length > 0)
		{
			// Total duration is frames * interval with the per-effect
			// duration in the delay of the effect key (see
			// executeCustomActions and Graph.executeAnimations)
			var animFrames = (action.steps != null) ? action.steps : 30;
			var animInterval = (action.delay != null) ? action.delay : 30;
			var animKeys = ['wipeIn', 'wipeOut', 'popIn', 'popOut'];
			var animDurMs = null;

			for (var ak = 0; ak < animKeys.length; ak++)
			{
				var av = action[animKeys[ak]];

				if (av != null && av.delay != null)
				{
					animDurMs = (animDurMs == null) ? av.delay :
						Math.max(animDurMs, av.delay);
				}
			}

			var animDuration = (animDurMs != null) ?
				AnimationExport.parseTime(animDurMs, 0) :
				AnimationExport.parseTime(animFrames, 30) *
				AnimationExport.parseTime(animInterval, 30);

			for (var j = 0; j < animations.length; j++)
			{
				animations[j].execute(0, 1000);
			}

			this.effects.push({animations: animations, t0: time,
				t1: time + animDuration});
			this.dirty = true;
			block(animDuration);
		}
	}

	return duration;
};

/**
 * Removes the opacity transitions of the given nodes.
 */
AnimationExport.Player.prototype.removeTweens = function(nodes)
{
	if (this.tweens.length > 0 && nodes.length > 0)
	{
		var lookup = new Set(nodes);

		this.tweens = this.tweens.filter(function(tween)
		{
			return !lookup.has(tween.node);
		});
	}
};

/**
 * Returns the flow paths of the given edges and marks the paths that are
 * flowing.
 */
AnimationExport.Player.prototype.getFlowPaths = function(cells)
{
	var paths = [];

	for (var i = 0; i < cells.length; i++)
	{
		var state = this.graph.view.getState(cells[i]);

		if (state != null && state.shape != null &&
			state.shape.getFlowAnimationPath != null &&
			this.graph.model.isEdge(state.cell))
		{
			var path = state.shape.getFlowAnimationPath();

			if (path != null)
			{
				path.flowActive = path.getAttribute('class') == 'mxEdgeFlow';
				paths.push(path);
			}
		}
	}

	return paths;
};

/**
 * Adds highlights for the given cells (see Graph.highlightCell).
 */
AnimationExport.Player.prototype.addHighlights = function(cells, params, time)
{
	var color = (params.color != null) ? params.color :
		mxConstants.DEFAULT_VALID_COLOR;
	var duration = AnimationExport.parseTime(params.duration, 1000);

	for (var i = 0; i < cells.length; i++)
	{
		var state = this.graph.view.getState(cells[i]);

		if (state != null)
		{
			var sw = Math.max(5, mxUtils.getValue(state.style,
				mxConstants.STYLE_STROKEWIDTH, 1) + 4);
			var hl = new mxCellHighlight(this.graph, color, sw, false);

			if (params.opacity != null)
			{
				hl.opacity = params.opacity;
			}

			hl.highlight(state);
			var entry = {highlight: hl, t0: time, t1: time + duration,
				t2: time + duration + AnimationExport.highlightFadeDuration};
			this.highlightEnd = Math.max(this.highlightEnd || 0, entry.t2);
			this.highlights.push(entry);
			this.dirty = true;
		}
	}
};

/**
 * Renders the current state of the player's graph as an SVG segment. The
 * result keeps references from the exported shape nodes to the shapes of
 * the graph so that per-frame changes (opacity, flow) can be copied.
 */
AnimationExport.prototype.createSegment = function(player, callback, error)
{
	var graph = player.graph;
	var editor = this.editorUi.editor;
	var parts = [];
	var highlights = new Map();
	var svgCanvas = null;

	for (var i = 0; i < player.highlights.length; i++)
	{
		if (player.highlights[i].highlight.shape != null)
		{
			highlights.set(player.highlights[i].highlight.shape, player.highlights[i]);
		}
	}

	var exp = graph.createSvgImageExport();
	var doDrawShape = exp.doDrawShape;

	// Maps the exported shape nodes to the shapes of the graph
	exp.doDrawShape = function(shape, canvas)
	{
		var parent = canvas.root;
		var last = (parent != null) ? parent.lastChild : null;
		doDrawShape.apply(this, arguments);

		if (shape != null && parent != null && parent.lastChild != null &&
			parent.lastChild != last)
		{
			parts.push({node: parent.lastChild, shape: shape,
				highlight: highlights.get(shape)});
		}
	};

	// Highlights are painted on top of all cells like in the overlay pane
	var drawState = exp.drawState;

	exp.drawState = function(state, canvas)
	{
		drawState.apply(this, arguments);

		highlights.forEach(function(entry, shape)
		{
			exp.doDrawShape(shape, canvas);
		});
	};

	// Captures the canvas for the offset of the output coordinates
	var graphCreateSvgCanvas = graph.createSvgCanvas;

	graph.createSvgCanvas = function()
	{
		svgCanvas = graphCreateSvgCanvas.apply(this, arguments);

		return svgCanvas;
	};

	var svgRoot = null;

	try
	{
		svgRoot = graph.getSvg(null, 1, 0, true, null, true, null, exp, null,
			graph.shadowVisible, null, this.options.theme, null, null, null, true);
	}
	finally
	{
		graph.createSvgCanvas = graphCreateSvgCanvas;
	}

	player.dirty = false;

	var segment = {svgRoot: svgRoot, parts: parts,
		dx: (svgCanvas != null) ? svgCanvas.state.dx : 0,
		dy: (svgCanvas != null) ? svgCanvas.state.dy : 0};

	// Persistent flow animations (flowAnimation=1) of the diagram
	segment.flows = AnimatedGifExport.findAnimatedPaths(svgRoot);
	AnimatedGifExport.removeAnimationCss(svgRoot, segment.flows);

	// Flow paths of the exported edges for flow steps
	for (var i = 0; i < parts.length; i++)
	{
		var shape = parts[i].shape;

		if (parts[i].highlight == null && shape.state != null &&
			shape == shape.state.shape && shape.getFlowAnimationPath != null &&
			graph.model.isEdge(shape.state.cell))
		{
			var node = shape.node;

			try
			{
				shape.node = parts[i].node;
				parts[i].flowPath = shape.getFlowAnimationPath();
			}
			finally
			{
				shape.node = node;
			}

			if (parts[i].flowPath != null)
			{
				parts[i].dashArray = parts[i].flowPath.getAttribute('stroke-dasharray');
				parts[i].dashOffset = parts[i].flowPath.getAttribute('stroke-dashoffset');
			}
		}
	}

	if (graph.shadowVisible)
	{
		graph.addSvgShadow(svgRoot, null, null, false);
	}

	if (graph.mathEnabled)
	{
		editor.addMathCss(svgRoot);
	}

	svgRoot.style.setProperty('-webkit-font-smoothing', 'antialiased');
	svgRoot.style.setProperty('-moz-osx-font-smoothing', 'grayscale');

	editor.convertImages(svgRoot, mxUtils.bind(this, function()
	{
		try
		{
			if (this.fontCss != null)
			{
				editor.addFontCss(svgRoot, this.fontCss);
			}

			if (editor.resolvedFontCss != null)
			{
				editor.addFontCss(svgRoot, editor.resolvedFontCss);
			}

			callback(segment);
		}
		catch (e)
		{
			error(e);
		}
	}), this.imageCache, this.imageConverter);
};

/**
 * Applies the state of the player at the given time to the segment and
 * returns a key that identifies the resulting image.
 */
AnimationExport.prototype.updateSegment = function(segment, player, time)
{
	var key = [segment.id];

	for (var i = 0; i < segment.parts.length; i++)
	{
		var part = segment.parts[i];
		var opacity = '';

		if (part.highlight != null)
		{
			opacity = player.getHighlightOpacity(part.highlight, time);
		}
		else if (part.shape.node != null)
		{
			opacity = part.shape.node.style.opacity;
		}

		if (opacity === '' || opacity == null || parseFloat(opacity) >= 1)
		{
			part.node.removeAttribute('opacity');
			key.push('');
		}
		else
		{
			opacity = Math.max(0, Math.round(parseFloat(opacity) * 1000) / 1000);
			part.node.setAttribute('opacity', opacity);
			key.push(opacity);
		}

		if (part.flowPath != null)
		{
			var livePath = (part.shape.node != null) ?
				part.shape.getFlowAnimationPath() : null;

			if (livePath != null && livePath.getAttribute('class') == 'mxEdgeFlow')
			{
				var phase = mxUtils.mod(time - player.getFlowStart(livePath),
					AnimationExport.flowPeriod) / AnimationExport.flowPeriod;
				var offset = Math.round(AnimationExport.flowOffset * phase * 100) / 100;
				var dash = livePath.getAttribute('stroke-dasharray');

				if (dash != null)
				{
					part.flowPath.setAttribute('stroke-dasharray', dash);
				}

				part.flowPath.setAttribute('stroke-dashoffset', offset);
				key.push(offset);
			}
			else
			{
				this.restoreAttribute(part.flowPath, 'stroke-dasharray', part.dashArray);
				this.restoreAttribute(part.flowPath, 'stroke-dashoffset', part.dashOffset);
			}
		}
	}

	// Persistent flow animations use the math of the flow GIF export
	for (var i = 0; i < segment.flows.length; i++)
	{
		var info = segment.flows[i];
		var t = mxUtils.mod(time, info.duration) / info.duration;
		var offset;

		if (info.direction === 'alternate' || info.direction === 'alternate-reverse')
		{
			var halfT = (t < 0.5) ? t * 2 : (1 - t) * 2;
			offset = info.dashSum * ((info.direction === 'alternate') ? 1 - halfT : halfT);
		}
		else if (info.direction === 'reverse')
		{
			offset = info.dashSum * t;
		}
		else
		{
			offset = info.dashSum * (1 - t);
		}

		offset = Math.round(offset * 100) / 100;
		info.node.style.strokeDashoffset = offset;
		key.push(offset);
	}

	var cam = player.camera;
	var viewBox = [cam.x + segment.dx, cam.y + segment.dy, this.width / cam.scale,
		this.height / cam.scale].map(function(value)
	{
		return Math.round(value * 1000) / 1000;
	}).join(' ');

	segment.svgRoot.setAttribute('viewBox', viewBox);
	segment.svgRoot.setAttribute('width', this.width + 'px');
	segment.svgRoot.setAttribute('height', this.height + 'px');
	segment.svgRoot.setAttribute('preserveAspectRatio', 'none');
	key.push(viewBox);

	return key.join(',');
};

/**
 * Sets or removes the given attribute.
 */
AnimationExport.prototype.restoreAttribute = function(node, name, value)
{
	if (value != null)
	{
		node.setAttribute(name, value);
	}
	else
	{
		node.removeAttribute(name);
	}
};

/**
 * Returns the fill style for the background of the frames.
 */
AnimationExport.prototype.getFillStyle = function()
{
	var graph = this.editorUi.editor.graph;
	var bg = this.options.background;

	if (bg == null || bg == mxConstants.NONE)
	{
		bg = Editor.getDefaultPageBackgroundColor();
	}

	// Resolves light-dark() as canvas fillStyle ignores the color-scheme
	var cssBg = mxUtils.getLightDarkColor(bg);

	return (this.options.theme == 'dark' && graph.getAdaptiveColors() != 'none') ?
		cssBg.dark : cssBg.light;
};

/**
 * Rasterizes the given segment into the given canvas.
 */
AnimationExport.prototype.drawSegment = function(segment, canvas, callback, error)
{
	var img = new Image();
	var fillStyle = this.fillStyle;
	var w = this.width;
	var h = this.height;

	var draw = function()
	{
		try
		{
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = fillStyle;
			ctx.fillRect(0, 0, w, h);
			ctx.drawImage(img, 0, 0, w, h);
			callback();
		}
		catch (e)
		{
			error(e);
		}
	};

	img.onload = function()
	{
		// Workaround for broken data URI images in Safari (see
		// Editor.exportToCanvas)
		if (mxClient.IS_SF)
		{
			window.setTimeout(draw, 0);
		}
		else
		{
			draw();
		}
	};

	img.onerror = function()
	{
		error(new Error('Failed to render SVG frame'));
	};

	img.src = Editor.createSvgDataUri(mxUtils.getXml(segment.svgRoot));
};

/**
 * Renders the frames at the given times. onFrame is invoked with the canvas,
 * the index of the time, whether the image differs from the previous frame,
 * a function to continue with the next frame and a function to stop with an
 * error. Exceptions in onFrame also stop with an error, exceptions in done
 * are passed to error.
 */
AnimationExport.prototype.renderFrames = function(times, onFrame, done, error)
{
	var graph = null;
	var finished = false;

	var cleanup = function()
	{
		finished = true;
		AnimationExport.destroyGraph(graph);
		graph = null;
	};

	var fail = mxUtils.bind(this, function(e)
	{
		if (!finished)
		{
			cleanup();
			error(e);
		}
	});

	try
	{
		graph = AnimationExport.createGraph(this.editorUi);
		var player = new AnimationExport.Player(graph, this.data,
			this.width, this.height);
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		var segment = null;
		var segmentId = 0;
		var lastKey = null;
		var index = -1;

		var render = mxUtils.bind(this, function()
		{
			try
			{
				var key = this.updateSegment(segment, player, times[index]);

				if (key == lastKey)
				{
					onFrame(canvas, index, false, next, fail);
				}
				else
				{
					lastKey = key;

					this.drawSegment(segment, canvas, function()
					{
						onFrame(canvas, index, true, next, fail);
					}, fail);
				}
			}
			catch (e)
			{
				fail(e);
			}
		});

		var renderNext = mxUtils.bind(this, function()
		{
			try
			{
				if (this.cancelled)
				{
					cleanup();
				}
				else
				{
					player.advanceTo(times[index]);

					if (segment == null || player.dirty)
					{
						this.createSegment(player, function(result)
						{
							segment = result;
							segment.id = segmentId++;
							render();
						}, fail);
					}
					else
					{
						render();
					}
				}
			}
			catch (e)
			{
				fail(e);
			}
		});

		var next = mxUtils.bind(this, function()
		{
			index++;

			if (this.cancelled)
			{
				cleanup();
			}
			else if (index < times.length)
			{
				// Keeps the UI responsive
				window.setTimeout(renderNext, 0);
			}
			else
			{
				cleanup();

				// Reports errors of the next step here since fail
				// ignores all errors after the cleanup
				try
				{
					done();
				}
				catch (e)
				{
					error(e);
				}
			}
		});

		next();
	}
	catch (e)
	{
		fail(e);
	}
};

/**
 * Loads the fonts for the export.
 */
AnimationExport.prototype.prepare = function(callback, error)
{
	var editor = this.editorUi.editor;
	this.imageCache = {};
	this.imageConverter = editor.createImageUrlConverter();
	this.fillStyle = this.getFillStyle();

	editor.embedExtFonts(mxUtils.bind(this, function(css)
	{
		try
		{
			this.fontCss = css;
			editor.loadFonts(callback);
		}
		catch (e)
		{
			error(e);
		}
	}));
};

/**
 * Exports the animation of the current page. Callback receives the Blob,
 * onProgress a number between 0 and 1. Nothing is called after cancel.
 */
AnimationExport.prototype.doExport = function(callback, error, onProgress)
{
	try
	{
		this.data = AnimationExport.getAnimationData(this.editorUi.editor.graph);

		if (this.data == null)
		{
			error(new Error(mxResources.get('noAnimationsInDiagram')));

			return;
		}

		// A GIF that does not loop keeps its last frame, so trailing
		// highlights are included
		var duration = Math.min(AnimationExport.maxDuration,
			AnimationExport.getDuration(this.editorUi,
			this.data, !this.options.loop));
		var frameTime = 1000 / this.fps;

		// The last frame shows the state at the end of the animation
		var count = Math.ceil(duration / frameTime - 1e-6) + 1;
		var times = [];

		for (var i = 0; i < count; i++)
		{
			times.push(Math.min(duration, i * frameTime));
		}

		var progress = function(value)
		{
			if (onProgress != null)
			{
				onProgress(Math.max(0, Math.min(1, value)));
			}
		};

		this.prepare(mxUtils.bind(this, function()
		{
			// Cancelled while the fonts were loading
			if (this.cancelled)
			{
				return;
			}

			if (this.options.format == 'mp4')
			{
				this.exportMp4(times, callback, error, progress);
			}
			else
			{
				this.exportGif(times, callback, error, progress);
			}
		}), error);
	}
	catch (e)
	{
		error(e);
	}
};

/**
 * Stops the export.
 */
AnimationExport.prototype.cancel = function()
{
	this.cancelled = true;

	if (this.mp4Encoder != null)
	{
		this.mp4Encoder.cancel();
	}
};

/**
 * Renders a few sampled frames for the palette, then all frames.
 */
AnimationExport.prototype.exportGif = function(times, callback, error, progress)
{
	var samples = [];
	var sampleCount = Math.min(times.length, AnimationExport.paletteSamples);

	for (var i = 0; i < sampleCount; i++)
	{
		samples.push(times[Math.round(i * (times.length - 1) /
			Math.max(1, sampleCount - 1))]);
	}

	var pixels = [];

	this.renderFrames(samples, mxUtils.bind(this, function(canvas, index, changed, next)
	{
		if (changed || pixels.length == 0)
		{
			pixels.push(canvas.getContext('2d').getImageData(
				0, 0, this.width, this.height).data);
		}

		progress(0.1 * (index + 1) / samples.length);
		next();
	}), mxUtils.bind(this, function()
	{
		var encoder = new GifEncoder(this.width, this.height);
		encoder.setRepeat((this.options.loop) ? 0 : -1);
		encoder.setPalette(GifEncoder.createPalette(pixels, 256));
		pixels = null;

		var frameTime = 1000 / this.fps;

		this.renderFrames(times, mxUtils.bind(this, function(canvas, index, changed, next)
		{
			var delay = (index + 1 < times.length) ?
				times[index + 1] - times[index] : frameTime;

			if (changed || encoder.pending == null)
			{
				encoder.addFrame(canvas, delay);
			}
			else
			{
				encoder.pending.delay += delay;
			}

			progress(0.1 + 0.9 * (index + 1) / times.length);
			next();
		}), function()
		{
			callback(encoder.finish());
		}, error);
	}), error);
};

/**
 * Renders all frames into an MP4 video.
 */
AnimationExport.prototype.exportMp4 = function(times, callback, error, progress)
{
	var encoder = new Mp4Encoder(this.width, this.height, this.fps);
	this.mp4Encoder = encoder;
	var failed = false;

	var fail = function(e)
	{
		if (!failed)
		{
			failed = true;
			encoder.cancel();
			error(e);
		}
	};

	encoder.init(mxUtils.bind(this, function()
	{
		// Cancelled while the codec was being configured, when
		// cancel found no VideoEncoder to close yet
		if (this.cancelled)
		{
			encoder.cancel();

			return;
		}

		this.renderFrames(times, function(canvas, index, changed, next, stop)
		{
			encoder.addFrame(canvas, function()
			{
				progress((index + 1) / times.length);
				next();
			}, function(e)
			{
				// Removes the offscreen graph
				stop(e);
			});
		}, mxUtils.bind(this, function()
		{
			if (!this.cancelled)
			{
				encoder.finish(callback, fail);
			}
		}), fail);
	}), fail);
};
