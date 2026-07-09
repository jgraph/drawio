/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
var mxIsElectron = navigator.userAgent != null &&
	navigator.userAgent.toLowerCase().indexOf(' electron/') > -1 && 
	navigator.userAgent.indexOf(' draw.io/') > -1;
var GOOGLE_APPS_MAX_AREA = 25000000;
var GOOGLE_SHEET_MAX_AREA = 1000000; // The maximum number of pixels is 1 million.
var shadowBlocker = null;

/**
 * Adds shadow blocker style.
 */
function addShadowBlocker()
{
	if (shadowBlocker == null)
	{
		shadowBlocker = document.createElement('style');
		shadowBlocker.setAttribute('type', 'text/css');
		shadowBlocker.innerHTML = '@media print {\n' +
			'    g[style*="filter: drop-shadow("] {\n' +
			'        filter: none !important;\n' +
			'    }\n' +
			'}\n';
		
		var head = document.getElementsByTagName('head')[0];
		
		if (head != null)
		{
			head.appendChild(shadowBlocker);
		}
	}
}

/**
 * Adds meta tag to the page.
 */
function mxmeta(content, httpEquiv)
{
	try
	{
		var s = document.createElement('meta');
		
		s.setAttribute('content', content);
		s.setAttribute('http-equiv', httpEquiv);

		var t = document.getElementsByTagName('meta')[0];
		t.parentNode.insertBefore(s, t);
	}
	catch (e)
	{
		// ignore
	}
};

function mxscript(src, onLoad)
{
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', src);
	
	if (onLoad != null)
	{
		var r = false;
	
		s.onload = s.onreadystatechange = function()
		{
			if (!r && (!this.readyState || this.readyState == 'complete'))
			{
				r = true;
				onLoad();
			}
		};
	}

	var t = document.getElementsByTagName('script')[0];
	
	if (t != null)
	{
		t.parentNode.insertBefore(s, t);
	}
};

if (mxIsElectron)
{
	mxmeta('default-src \'self\'; script-src \'self\'; connect-src \'self\' https://*.draw.io https://*.diagrams.net https://fonts.googleapis.com ' +
		'https://fonts.gstatic.com; img-src * data:; media-src *; font-src * data:; frame-src \'none\'; style-src \'self\' \'unsafe-inline\' ' +
		'https://fonts.googleapis.com; base-uri \'none\';child-src \'self\';object-src \'none\';', 'Content-Security-Policy');
	
	// We can't use eval in Electron because of CSP, so load all shapes and disable eval
	mxscript('js/stencils.min.js', function()
	{
		mxscript('js/shapes-14-6-5.min.js', function()
		{
			if (window.pendingRequest != null)
			{
				render(window.pendingRequest);
			}

			window.shapesLoaded = true;
		});
	});
	
	// Disables eval for JS (uses shapes-14-6-5.min.js)
	mxStencilRegistry.allowEval = false;
}

// TODO Add support for loading math from a local folder
Editor.initMath((remoteMath? 'https://app.diagrams.net/' : '') + 'math4/es5/startup.js');

// Marks individual font and CSS URLs as preloaded
var fontPreload = {};
var cssPreload = {};

// Returns true if any page in the given diagram XML enables MathJax
// typesetting (math="1"), decompressing diagram nodes as needed. Used to
// decide whether the export must wait for MathJax to load. [jgraph/drawio#5564]
function exportUsesMath(xml)
{
	try
	{
		var node = mxUtils.parseXml(xml).documentElement;

		if (node.nodeName == 'mxfile')
		{
			var diagrams = node.getElementsByTagName('diagram');

			for (var i = 0; i < diagrams.length; i++)
			{
				var model = Editor.parseDiagramNode(diagrams[i]);

				if (model != null && model.getAttribute('math') == '1')
				{
					return true;
				}
			}

			return false;
		}

		return node.getAttribute('math') == '1';
	}
	catch (e)
	{
		return false;
	}
};

// Returns the HTML of every cell label in the given diagram XML that contains
// math delimiters, across all pages, as an array of individual label strings.
// Used to warm up MathJax (load the TeX packages and font chunks those formulas
// need) before the crop bounds are measured, so the synchronous typeset in
// renderPage succeeds rather than throwing MathJax's "retry" for a not-yet-
// loaded package. Kept per-label (not concatenated) so each label is sanitized
// and typeset in its own element, mirroring the per-cell render — a bare '<' in
// one label (e.g. the TeX relation in "$x<y$") cannot merge into the next label
// and realign its math delimiters. [jgraph/drawio#5564]
function collectMathLabels(xml)
{
	var labels = [];

	try
	{
		var node = mxUtils.parseXml(xml).documentElement;
		var models = [];

		if (node.nodeName == 'mxfile')
		{
			var diagrams = node.getElementsByTagName('diagram');

			for (var i = 0; i < diagrams.length; i++)
			{
				var model = Editor.parseDiagramNode(diagrams[i]);

				if (model != null)
				{
					models.push(model);
				}
			}
		}
		else
		{
			models.push(node);
		}

		for (var i = 0; i < models.length; i++)
		{
			// Reads both mxCell value and object/UserObject label attributes
			var elts = models[i].getElementsByTagName('*');

			for (var j = 0; j < elts.length; j++)
			{
				var value = (elts[j].getAttribute != null) ? elts[j].getAttribute('value') : null;
				var label = (elts[j].getAttribute != null) ? elts[j].getAttribute('label') : null;

				if (value != null && Editor.containsMath(value))
				{
					labels.push(value);
				}

				if (label != null && Editor.containsMath(label))
				{
					labels.push(label);
				}
			}
		}
	}
	catch (e)
	{
		// Falls back to no warm-up; renderPage's typeset may then miss lazily
		// loaded packages, but the export still proceeds.
	}

	return labels;
};

function render(data)
{
	// Math typesetting must be available AND the TeX packages/font chunks that
	// the diagram's formulas need must be loaded before the diagram is measured
	// below, so the export crop follows the rendered math size rather than the
	// raw formula source. MathJax loads asynchronously (see Editor.initMath) and
	// additionally loads TeX extension packages and font chunks lazily on first
	// use, so the synchronous MathJax.typeset in renderPage throws a "retry" for
	// any formula that needs a not-yet-loaded package (e.g. \boldsymbol,
	// \mathcal, gathered) and the bounds fall back to the wide source size. So
	// when the diagram uses math, wait for MathJax, then warm it up by typesetting
	// the diagram's math labels via the promise-based API (which performs the
	// async loads) and only then render. [jgraph/drawio#5564]
	if (Editor.mathOutputSize && data.xml != null && !data.mathChecked &&
		exportUsesMath(data.xml))
	{
		// Computes exportUsesMath only once, then polls for MathJax readiness.
		data.mathChecked = true;
		var mathWaitStart = Date.now();

		var warmUpMath = function()
		{
			// Typesets the diagram's math labels off-screen so MathJax loads
			// every TeX package and font chunk they need; the synchronous typeset
			// in renderPage then succeeds and the crop reflects the rendered math.
			try
			{
				var labels = collectMathLabels(data.xml);

				if (labels.length == 0)
				{
					render(data);
					return;
				}

				var div = document.createElement('div');
				div.style.cssText = 'position:absolute;visibility:hidden;' +
					'left:-10000px;top:-10000px;';

				// One element per label (sanitized individually, mirroring the
				// per-cell render) so a '<' in one label cannot corrupt the next.
				for (var i = 0; i < labels.length; i++)
				{
					var lbl = document.createElement('div');
					lbl.innerHTML = Graph.sanitizeHtml(labels[i]);
					div.appendChild(lbl);
				}

				document.body.appendChild(div);

				var proceeded = false;

				// Idempotent: guards against being invoked by both the resolve
				// and reject handlers (e.g. if render below throws synchronously),
				// which would otherwise start a second render pass on the same data.
				var done = function()
				{
					if (proceeded)
					{
						return;
					}

					proceeded = true;

					if (div.parentNode != null)
					{
						div.parentNode.removeChild(div);
					}

					render(data);
				};

				MathJax.typesetPromise([div]).then(done)['catch'](function(e)
				{
					if (window.console != null)
					{
						console.log('Error in MathJax export warm-up: ' + e);
					}

					done();
				});
			}
			catch (e)
			{
				// Any failure just proceeds to render without the warm-up.
				render(data);
			}
		};

		var waitForMath = function()
		{
			// Falls back to rendering without waiting after a timeout so a
			// missing or broken MathJax never blocks the export indefinitely.
			if (typeof MathJax !== 'undefined' &&
				typeof MathJax.typeset === 'function' &&
				typeof MathJax.typesetPromise === 'function')
			{
				warmUpMath();
			}
			else if (Date.now() - mathWaitStart > 10000)
			{
				render(data);
			}
			else
			{
				window.setTimeout(waitForMath, 50);
			}
		};

		waitForMath();

		return;
	}

	if (data.shadows == '0')
	{
		addShadowBlocker();
	}
	
	if (data.csv != null)
	{
		// CSV loads orgChart asynchronously and needs mxscript
		window.mxscript = function (src, onLoad, id)
		{
			var s = document.createElement('script');
			s.setAttribute('type', 'text/javascript');
			s.setAttribute('defer', 'true');
			s.setAttribute('src', src);

			if (id != null)
			{
				s.setAttribute('id', id);
			}

			if (onLoad != null)
			{
				var r = false;

				s.onload = s.onreadystatechange = function()
				{
					if (!r && (!this.readyState || this.readyState == 'complete'))
					{
						r = true;
						onLoad();
					}
				};
			}

			var t = document.getElementsByTagName('script')[0];

			if (t != null)
			{
				t.parentNode.insertBefore(s, t);
			}
		};

		var editorUi = new HeadlessEditorUi();

		editorUi.importCsv(data.csv, function()
		{
			data.xml = mxUtils.getXml(editorUi.editor.getGraphXml());
			delete data.csv;
			render(data);
		});

		return;
	}

	if (data.mermaid != null)
	{
		// Parse directly — the Mermaid and ELK bundles are loaded via the
		// export3.html script tags. parseMermaidDiagram runs the ElkLayout
		// post-pass for flowchart-elk diagrams, so CLI export matches what
		// opening the file in the editor produces. Skip if the legacyMermaid
		// flag is set (for reference/comparison testing).
		if (!data.legacyMermaid && EditorUi.isMermaidSupported())
		{
			var editorUi = new HeadlessEditorUi();

			editorUi.parseMermaidDiagram(data.mermaid, null, function(xml)
			{
				data.xml = xml;
				delete data.mermaid;
				render(data);
			}, function(e)
			{
				electron.sendMessage('export-error',
					'Error parsing Mermaid: ' + (e.message || e));
			});

			return;
		}

		// Mermaid needs mxscript for loading extensions
		window.mxscript = function (src, onLoad, id)
		{
			var s = document.createElement('script');
			s.setAttribute('type', 'text/javascript');
			s.setAttribute('src', src);

			if (id != null)
			{
				s.setAttribute('id', id);
			}

			if (onLoad != null)
			{
				var r = false;

				s.onload = s.onreadystatechange = function()
				{
					if (!r && (!this.readyState || this.readyState == 'complete'))
					{
						r = true;
						onLoad();
					}
				};
			}

			var t = document.getElementsByTagName('script')[0];

			if (t != null)
			{
				t.parentNode.insertBefore(s, t);
			}
		};

		var editorUi = new HeadlessEditorUi();

		// Load mermaid extensions and use legacy parser
		editorUi.loadMermaid(function()
		{
			try
			{
				editorUi.parseMermaidDiagram(data.mermaid, null, function(xml)
				{
					data.xml = xml;
					delete data.mermaid;
					render(data);
				}, function(e)
				{
					electron.sendMessage('export-error',
						'Error parsing Mermaid: ' + (e.message || e));
				}, null, true);
			}
			catch (e)
			{
				electron.sendMessage('export-error',
					'Error parsing Mermaid: ' + (e.message || e));
			}
		}, function(e)
		{
			electron.sendMessage('export-error',
				'Error loading Mermaid: ' + (e.message || e));
		});

		return;
	}

	var autoScale = false;
	
	if (data.scale == 'auto')
	{
		autoScale = true;
		data.scale = 1;
	}
	
	document.body.innerText = '';
	var container = document.createElement('div');
	container.id = 'graph';
	container.style.width = '100%';
	container.style.height = '100%';
	document.body.appendChild(container);
	
	var graph = new Graph(container);
	graph.enableFlowAnimation = true;
	
	data.border = parseInt(data.border) || 0;
	data.w = parseFloat(data.w) || 0;
	data.h = parseFloat(data.h) || 0;
	data.scale = parseFloat(data.scale) || 1;
	
	var extras = null;
	
	try
	{
		extras = JSON.parse(data.extras);
	} 
	catch (e)
	{
		try 
		{
			extras = JSON.parse(decodeURIComponent(data.extras));
		}
		catch (e)
		{
			// ignore
		}
	}

	var gridColor = null;

	if (extras != null && extras.grid != null)
	{
		graph.gridSize = extras.grid.size;
		graph.view.gridSteps = extras.grid.steps;
		gridColor = extras.grid.color;
	}
	
	if (extras != null && extras.diagramLanguage != null)
	{
		Graph.diagramLanguage = extras.diagramLanguage;
		Graph.translateDiagram = true;
	}

	if (data.fileTitle != null)
	{
		document.title = data.fileTitle;
	}
	else if (extras != null && extras.globalVars != null &&
		extras.globalVars.filename != null)
	{
		document.title = extras.globalVars.filename;
	}
	
	// Overrides graph bounds to include background images
	var graphGetGraphBounds = graph.getGraphBounds;

	graph.getGraphBounds = function()
	{
		var bounds = graphGetGraphBounds.apply(this, arguments);
		var img = this.backgroundImage;
		
		if (img != null && img.width != null && img.height != null)
		{
			var t = this.view.translate;
			var s = this.view.scale;

			bounds = mxRectangle.fromRectangle(bounds);
			bounds.add(new mxRectangle(
				(t.x + img.x) * s, (t.y + img.y) * s,
				img.width * s, img.height * s));
		}

		return bounds;
	};
	
	// PNG+XML format
	if (data.xml.substring(0, 5) == 'iVBOR' || (extras != null && extras.isPng))
	{
		data.xml = Editor.extractGraphModelFromPng('data:image/png;base64,' + data.xml);
	}

	// PDF+XML format
	if (data.xml.substring(0, 5) == 'JVBER' || (extras != null && extras.isPdf))
	{
		data.xml = Editor.extractGraphModelFromPdf('data:application/pdf;base64,' + data.xml);
	}
	
	// IE11 sends incorrect xml
	if (data.xml.substring(0, 11) == '<#document>')
	{
		data.xml = data.xml.substring(11, data.xml.length - 12);
	}

	// --layout: run a layout on the diagram before rendering, so CLI export
	// (and xml output) reflects the same auto-layout the editor applies on open.
	// data.layout is either a MENU_PRESETS preset name (verticalFlow, ...) or
	// the custom-layout-dialog JSON (an array of {layout, config}, starting with
	// '[') — the latter runs a sequence and carries per-layout options. Lays out
	// the first page (matching the editor's active-page behavior), preserves the
	// remaining pages, then re-enters render() with the laid-out XML. Runs after
	// PNG/PDF extraction so data.xml is real XML; the isPng/isPdf flags are
	// cleared so the re-entry doesn't re-extract.
	if (data.layout != null)
	{
		if (typeof ElkLayout === 'undefined')
		{
			electron.sendMessage('export-error', 'Layout engine not available');
			return graph;
		}

		var layoutIsJson = mxUtils.trim(data.layout).charAt(0) == '[';
		var layoutList = null;
		var elkPreset = null;

		if (layoutIsJson)
		{
			try
			{
				layoutList = JSON.parse(data.layout);
			}
			catch (e)
			{
				electron.sendMessage('export-error', 'Invalid layout JSON: ' + (e.message || e));
				return graph;
			}
		}
		else if (typeof LibavoidRouting !== 'undefined' &&
			mxUtils.trim(data.layout) === LibavoidRouting.LAYOUT_NAME)
		{
			// Bare libavoid shorthand -> JSON list, routed via createLayouts below.
			layoutList = [{layout: LibavoidRouting.LAYOUT_NAME}];
			layoutIsJson = true;
		}
		else
		{
			elkPreset = (ElkLayout.MENU_PRESETS != null) ? ElkLayout.MENU_PRESETS[data.layout] : null;

			if (elkPreset == null)
			{
				electron.sendMessage('export-error', 'Unknown layout: ' + data.layout);
				return graph;
			}
		}

		var srcDoc = mxUtils.parseXml(data.xml);
		var isMxfile = srcDoc.documentElement.nodeName == 'mxfile';
		// allowMxFile must be false here: the layout path decodes modelNode
		// directly via mxCodec, which requires the inner mxGraphModel. Passing
		// true returns the mxfile wrapper, which decodes to an empty model and
		// drops every cell from the laid-out output.
		var modelNode = Editor.extractGraphModel(srcDoc.documentElement, false);

		if (modelNode == null)
		{
			// Nothing to lay out (e.g. empty file); render as-is.
			delete data.layout;
			render(data);
			return graph;
		}

		var layoutContainer = document.createElement('div');
		layoutContainer.style.cssText = 'position:absolute;left:-99999px;top:-99999px;' +
			'width:1200px;height:800px;visibility:hidden;';
		document.body.appendChild(layoutContainer);

		var layoutGraph = new Graph(layoutContainer);
		layoutGraph.foldingEnabled = false;
		layoutGraph.setEnabled(false);

		var layoutCleanup = function()
		{
			try { layoutGraph.destroy(); } catch (e) { /* ignore */ }
			layoutContainer.remove();
		};

		try
		{
			var layoutDec = new mxCodec(modelNode.ownerDocument);
			layoutDec.decode(modelNode, layoutGraph.getModel());
		}
		catch (e)
		{
			layoutCleanup();
			electron.sendMessage('export-error',
				'Error loading diagram for layout: ' + (e.message || e));
			return graph;
		}

		// Build the layout instances bound to the offscreen graph. JSON goes
		// through createLayouts (same path as the dialog); a preset becomes a
		// single ElkLayout with the menu's canonical edge treatment.
		var layouts;

		try
		{
			layouts = layoutIsJson ?
				layoutGraph.createLayouts(layoutList) :
				[new ElkLayout(layoutGraph, elkPreset.algorithm,
					elkPreset.options, ElkLayout.CANONICAL_EDGE)];
		}
		catch (e)
		{
			layoutCleanup();
			electron.sendMessage('export-error', 'Invalid layout: ' + (e.message || e));
			return graph;
		}

		var layoutParent = layoutGraph.getDefaultParent();
		var layoutModel = layoutGraph.getModel();

		var finishLayout = function()
		{
			var laidOutNode = null;

			try
			{
				laidOutNode = new mxCodec().encode(layoutModel);
			}
			catch (e)
			{
				layoutCleanup();
				electron.sendMessage('export-error', 'Layout failed: ' + (e.message || e));
				return;
			}

			layoutCleanup();

			if (laidOutNode == null)
			{
				electron.sendMessage('export-error', 'Layout failed: no output');
				return;
			}

			if (isMxfile)
			{
				// Replace the first page's model in place; keep other pages.
				var diagram = srcDoc.documentElement.getElementsByTagName('diagram')[0];

				while (diagram.firstChild != null)
				{
					diagram.removeChild(diagram.firstChild);
				}

				diagram.removeAttribute('etag');
				diagram.appendChild(srcDoc.importNode(laidOutNode, true));
				data.xml = mxUtils.getXml(srcDoc);
			}
			else
			{
				data.xml = mxUtils.getXml(laidOutNode);
			}

			// Stop the re-entry from re-running PNG/PDF extraction on the
			// now-plain XML.
			if (extras != null && (extras.isPng || extras.isPdf))
			{
				extras.isPng = false;
				extras.isPdf = false;
				data.extras = JSON.stringify(extras);
			}

			delete data.layout;
			render(data);
		};

		// Runs the layouts in sequence. ELK layouts expose prepare() (async);
		// the mxGraph layouts run synchronously via execute(). Mirrors
		// EditorUi.executeLayouts but applies directly (no morph animation).
		var runLayout = function(index)
		{
			if (index >= layouts.length)
			{
				finishLayout();
				return;
			}

			var layout = layouts[index];

			try
			{
				if (typeof layout.prepare === 'function')
				{
					layout.prepare(layoutParent, function(err, apply)
					{
						if (err != null)
						{
							layoutCleanup();
							electron.sendMessage('export-error', 'Layout failed: ' + (err.message || err));
							return;
						}

						layoutModel.beginUpdate();
						try { apply(); } finally { layoutModel.endUpdate(); }
						runLayout(index + 1);
					});
				}
				else
				{
					layoutModel.beginUpdate();
					try { layout.execute(layoutParent); } finally { layoutModel.endUpdate(); }
					runLayout(index + 1);
				}
			}
			catch (e)
			{
				layoutCleanup();
				electron.sendMessage('export-error', 'Layout failed: ' + (e.message || e));
			}
		};

		runLayout(0);

		return graph;
	}

	// Parses XML
	var doc = mxUtils.parseXml(data.xml);
	var node = Editor.extractGraphModel(doc.documentElement, true);

	if (node == null)
	{
		//Electron pdf export
		try 
		{
			electron.sendMessage('render-finished', null);
		}
		catch(e)
		{
			console.log(e);
		}
		
		return graph;
	}
	
	var xmlDoc = node.ownerDocument;
	var origXmlDoc = xmlDoc;
	var diagrams = null;
	var from = 0;

	function getFileXml(uncompressed)
	{
		var xml = mxUtils.getXml(origXmlDoc);
		var editorUi = new HeadlessEditorUi();
		var tmpFile = new LocalFile(editorUi, xml);
		editorUi.setCurrentFile(tmpFile);
		editorUi.setFileData(xml);
		return editorUi.createFileData(editorUi.getXmlFileData(null, null, uncompressed));
	};

	if (mxIsElectron && data.format == 'xml')
	{
		try
		{
			electron.sendMessage('xml-data', getFileXml(data.uncompressed));
		}
		catch(e)
		{
			electron.sendMessage('xml-data-error');
		}
		
		return;
	}

	// Handles mxfile
	if (xmlDoc.documentElement.nodeName == 'mxfile')
	{
		diagrams = xmlDoc.documentElement.getElementsByTagName('diagram');
	}
	
	//Add global variables to graph
	if (extras != null && extras.globalVars != null)
	{
		graph.globalVars = extras.globalVars;
	}

	/**
	 * Disables custom links but allows page links.
	 */
	function isLinkIgnored(graph, link)
	{
		return link == null || (graph.isCustomLink(link) && !Graph.isPageLink(link));
	};

	/**
	 * Disables custom links on shapes.
	 */
	var graphGetLinkForCell = graph.getLinkForCell;
	
	graph.getLinkForCell = function(cell)
	{
		var link = graphGetLinkForCell.apply(this, arguments);

		if (isLinkIgnored(this, link))
		{
			link = null;
		}
		
		return link;
	};
	
	/**
	 * Disables custom links in labels.
	 */
	var cellRendererRedrawLabelShape = graph.cellRenderer.redrawLabelShape;
	
	graph.cellRenderer.redrawLabelShape = function(shape)
	{
		cellRendererRedrawLabelShape.apply(this, arguments);
		
		if (shape.node != null)
		{
			var links = shape.node.getElementsByTagName('a');

			for (var i = 0; i < links.length; i++)
			{
				var href = links[i].getAttribute('href');
				
				if (isLinkIgnored(graph, href))
				{
					links[i].setAttribute('href', '#');
				}
			}	
		}
	};
	
	var preview = null;
	var waitCounter = 1;
	var bounds;
	var pageId;
	var expScale;
	// Waits for all images to finish loading
	var cache = new Object();
	var math = false;
	
	// Decrements waitCounter and invokes callback when finished
	function decrementWaitCounter()
	{
		if (--waitCounter < 1)
		{
			//Note: This code targets Chrome as it is the browser used by export server
			//Ensure that all fonts have been loaded, this promise is never rejected
			document.fonts.ready.then(function() 
			{
				// Rewrite page links
				Graph.rewritePageLinks(document);
				
				var doneDiv = document.createElement("div");
				var pageCount = diagrams != null? diagrams.length : 1;
				doneDiv.id = 'LoadingComplete';
				doneDiv.style.display = 'none';
				doneDiv.setAttribute('bounds', JSON.stringify(bounds));
				doneDiv.setAttribute('page-id', pageId);
				doneDiv.setAttribute('scale', expScale);
				doneDiv.setAttribute('pageCount', pageCount);
				document.body.appendChild(doneDiv);

				//Electron pdf export
				if (mxIsElectron)
				{
					try
					{
						electron.registerMsgListener('get-svg-data', (arg) => 
						{
							graph.mathEnabled = math; //Enable math such that getSvg works as expected
							// Returns the exported SVG for the given graph (see EditorUi.exportSvg).
							// An explicit --transparent (data.bg == 'none') forces a transparent
							// background; otherwise the page background is read from the diagram XML
							// (graph.background is not populated in this headless renderer, as the
							// model is decoded directly without setGraphXml) [jgraph/drawio-desktop#2469]
							var bg = (data.bg == mxConstants.NONE) ? null :
								xmlDoc.documentElement.getAttribute('background');

							if (bg == mxConstants.NONE || bg == '')
							{
								bg = null;
							}

							var theme = 'auto';

							if (data.theme != null)
							{
								theme = data.theme;
							}
							
							var linkTarget = null;

							if (data.linkTarget == 'same-win')
							{
								linkTarget = '_top';
							}
							else if (data.linkTarget == 'new-win')
							{
								linkTarget = '_blank';
							}

							var svgRoot = graph.getSvg(bg, expScale, data.border, false, null,
								true, null, null, linkTarget, null, null, theme);
							
							if (graph.shadowVisible)
							{
								graph.addSvgShadow(svgRoot);
							}
							
							// TODO addFontCss cannot be used as it requires this
							// Adds CSS
							//Editor.prototype.addFontCss(svgRoot);
							
							if (math)
							{
								Editor.prototype.addMathCss(svgRoot);
							}
						
							function doSend() 
							{
								var editable = data.embedXml == '1';

								if (editable)
								{
									svgRoot.setAttribute('content', getFileXml(data.uncompressed));
								}

								electron.sendMessage('svg-data',
									Graph.xmlDeclaration + '\n' +
									((editable) ? Graph.svgFileComment + '\n' : '') +
									Graph.svgDoctype + '\n' + mxUtils.getXml(svgRoot));
							};

							function embedFontsDone()
							{
								if (data.embedImages == '1')
								{
									var tmpEditor = new Editor();
									tmpEditor.convertImages(svgRoot, doSend);
								}
								else
								{
									doSend();
								}
							}

							if (data.embedFonts == '1')
							{
								var extFonts = graph.getCustomFonts();
		
								// Adds external fonts
								// TODO CSP will not allow external fonts!
								if (extFonts.length > 0)
								{
									var svgDoc = svgRoot.ownerDocument;
									var style = (svgDoc.createElementNS != null) ?
										svgDoc.createElementNS(mxConstants.NS_SVG, 'style') : svgDoc.createElement('style');
									(svgDoc.setAttributeNS != null) ? style.setAttributeNS('type', 'text/css') :
										style.setAttribute('type', 'text/css');
									
									var prefix = '';
									var postfix = '';
											
									for (var i = 0; i < extFonts.length; i++)
									{
										var fontName = extFonts[i].name, fontUrl = extFonts[i].url;
										
										if (Graph.isCssFontUrl(fontUrl))
										{
											prefix += '@import url(' + Graph.rewriteGoogleFontUrl(fontUrl) + ');\n';
										}
										else
										{
											postfix += '@font-face {\n' +
												'font-family: "' + fontName + '";\n' + 
												'src: url("' + fontUrl + '");\n}\n';
										}				
									}
									
									style.appendChild(svgDoc.createTextNode(prefix + postfix));
									svgRoot.getElementsByTagName('defs')[0].appendChild(style);
								}

								EditorUi.prototype.replaceAlternateContent(svgRoot, null, embedFontsDone);
							}
							else
							{
								embedFontsDone();
							}
						});
						
						//For some reason, Electron 9 doesn't send this object as is without stringifying. Usually when variable is external to function own scope
						// Include the resolved diagram XML so the main process can embed it
						// in PNG/PDF output (-e). For Mermaid/CSV/layout inputs the source
						// file isn't draw.io XML, so the main process has no (or a pre-layout)
						// args.xml; data.xml here is the real post-conversion model.
						electron.sendMessage('render-finished', {bounds: JSON.stringify(bounds),
							pageCount: pageCount, xml: (data.embedXml == '1') ? data.xml : null});
					}
					catch(e)
					{
						console.log(e);
					}
				}
			});
		}
	};
	
	function waitForImages(tagName, attributeName)
	{
		var imgs = document.body.getElementsByTagName(tagName);
		waitCounter += imgs.length;

		for (var i = 0; i < imgs.length; i++)
		{
			// No load events for image elements in Phantom using indirection instead
			var src = imgs[i].getAttribute(attributeName);
			
			if (src != null && src.length > 0 && cache[src] == null)
			{
				cache[src] = new Image();
				cache[src].onload = decrementWaitCounter;
				cache[src].onerror = decrementWaitCounter;
				cache[src].src = src;
			}
			else
			{
				decrementWaitCounter();
			}
		}
	};
	
	// Waits for MathJax autoloading and rendering
	var editorOnMathJaxDone = Editor.onMathJaxDone;
	
	Editor.onMathJaxDone = function()
	{
		editorOnMathJaxDone.apply(this, arguments);
		decrementWaitCounter();
	};

	// Adds MathJax rendering task
	function renderMath(elt)
	{
		if (Editor.MathJaxRender != null)
		{
			waitCounter++;
			Editor.MathJaxRender(elt);
		}
	};

	// Waits for the given font
	function waitForFont(url)
	{
		try
		{
			if (url != null && fontPreload[url] == null)
			{
				waitCounter++;
				fontPreload[url] = true;
				mxUtils.get(url, decrementWaitCounter,
					decrementWaitCounter, false, 10000,
					decrementWaitCounter);
			}
		}
		catch (e)
		{
			// ignore font
		}
	};

	// Waits for the fonts in the given CSS
	function waitForFonts(fontCss)
	{
		var parts = fontCss.split('url(');
		
		for (var i = 1; i < parts.length; i++)
		{
			try
			{
				var idx = parts[i].indexOf(')');
				var url = Editor.trimCssUrl(parts[i].substring(0, idx));
				waitForFont(url);
			}
			catch (e)
			{
				// ignore font css
			}
		}
	};

	// Loads and processes the fonts in the given Google Font URL
	function processGoogleFontCss(url)
	{
		try
		{
			if (Graph.isGoogleFontUrl(url) && cssPreload[url] == null)
			{			
				cssPreload[url] = true;

				var link = document.createElement('link');
				link.setAttribute('rel', 'preload');
				link.setAttribute('as', 'style');
				link.setAttribute('href', url);
				document.getElementsByTagName('head')[0].appendChild(link);

				// Loads the stylesheet to wait for fonts
				waitCounter++;

				mxUtils.get(url, mxUtils.bind(this, function(req)
				{
					try
					{
						if (req.getStatus() >= 200 && req.getStatus() <= 299)
						{
							waitForFonts(req.getText());
						}

						decrementWaitCounter();
					}
					catch(e)
					{
						decrementWaitCounter();
					}
				}), decrementWaitCounter, false, 10000, decrementWaitCounter);
			}
		}
		catch (e)
		{
			// ignore stylesheet
		}
	};

	// Waits for Google Font CSS imports in the given element
	function waitForGoogleFontImports(elt)
	{
		var style = elt.getElementsByTagName('style');

		for (var i = 0; i < style.length; i++)
		{
			var parts = style[i].innerHTML.split('@import url(');

			for (var i = 1; i < parts.length; i++)
			{
				try
				{
					var idx = parts[i].indexOf(')');
					var url = Editor.trimCssUrl(parts[i].substring(0, idx));
					processGoogleFontCss(url);
				}
				catch (e)
				{
					// ignore import
				}
			}
		}
	};

	// Intercepts loading of Google Fonts CSS
	var origCreateFontElement = Graph.createFontElement;

	Graph.createFontElement = function(name, url)
	{
		var elt = origCreateFontElement.apply(this, arguments);

		try
		{
			if (elt != null && elt.nodeName.toLowerCase() == 'link' &&
				elt.getAttribute('type') == 'text/css' &&
				elt.getAttribute('rel') == 'stylesheet')
			{
				processGoogleFontCss(elt.getAttribute('href'));
			}
		}
		catch (e)
		{
			// ignore stylesheet
		}

		return elt;
	};

	// Adds wait counter for loading fonts
	var origAddFont = Graph.addFont;
	
	Graph.addFont = function(name, url)
	{
		waitCounter++;
		return origAddFont.call(this, name, url, decrementWaitCounter);	
	};
	
	/**
	 * Renders the given page or all pages.
	 */
	function renderPage(currentPageId)
	{
		// Configures math typesetting
		math = xmlDoc.documentElement.getAttribute('math') == '1';
		graph.mathEnabled = math;

		// Sets grid size
		var gs = xmlDoc.documentElement.getAttribute('gridSize');

		if (gs != null)
		{
			graph.gridSize = parseFloat(gs);
		}
		else
		{
			graph.gridSize = mxGraph.prototype.gridSize;
		}

		// Configure graph
		graph.foldingEnabled = false;
		graph.setEnabled(false);
		
		// Sets background image
		var bgImg = xmlDoc.documentElement.getAttribute('backgroundImage');

		if (bgImg != null)
		{
			bgImg = JSON.parse(bgImg);
			graph.setBackgroundImage(new mxImage(bgImg.src, bgImg.width,
				bgImg.height, bgImg.x, bgImg.y));
		}
		else
		{
			graph.setBackgroundImage(null);
		}
		
		// Parses XML into graph
		var codec = new mxCodec(xmlDoc);
		var model = graph.getModel();
		codec.decode(xmlDoc.documentElement, model);

		// Sizes the export crop to the rendered MathJax output rather than the
		// raw formula source. The diagram is decoded synchronously here, but the
		// labels are only typeset later (see renderMath below), so the bounds
		// computed in this function would otherwise reflect the much wider source
		// text and crop the export with excessive margins. render() waits for
		// MathJax to load and warms up the required TeX packages/fonts before
		// reaching this point (see the math gate at the top of render), so this
		// synchronous typeset succeeds; refresh the bounds from it.
		// [jgraph/drawio#5564]
		if (Editor.mathOutputSize && graph.mathEnabled &&
			typeof MathJax !== 'undefined' && typeof MathJax.typeset === 'function')
		{
			try
			{
				MathJax.typeset([graph.container]);
			}
			catch (e)
			{
				// A package/font may still be loading; bounds fall back to source
				// size and renderMath below typesets the final output correctly.
			}

			graph.refreshMathBounds();
		}

		var bg;

		if (data.format == 'pdf')
		{
			if (data.bg == 'none' || bg == '')
			{
				bg = null;
			}
			else
			{
				bg = xmlDoc.documentElement.getAttribute('background');
				
				if (bg == 'none' || !bg)
				{
					bg = '#ffffff';
				}
			}
		}
		else
		{
			// Loads background color
			bg = xmlDoc.documentElement.getAttribute('background');

			// Normalizes values for transparent backgrounds
			if (bg == 'none' || bg == '')
			{
				bg = null;
			}
			
			// Checks if export format supports transparent backgrounds
			if (bg == null && data.format != 'gif' && data.format != 'png' && data.format != 'svg')
			{
				bg = '#ffffff';
			}
			
			// Sets background color on page
			if (bg != null)
			{
				document.body.style.backgroundColor = bg;
			}
		}
		
		//handle layers
		if (extras != null && ((extras.layers != null && extras.layers.length > 0) || 
			(extras.layerIds != null && extras.layerIds.length > 0)))
		{
			var childCount = model.getChildCount(model.root);
			
			// Hides all layers
			for (var i = 0; i < childCount; i++)
			{
				model.setVisible(model.getChildAt(model.root, i), false);
			}

			if (extras.layerIds != null)
			{
				for (var i = 0; i < extras.layerIds.length; i++)
				{
					model.setVisible(model.getCell(extras.layerIds[i]), true);
				}
			}
			else
			{
				for (var i = 0; i < extras.layers.length; i++)
				{
					var layer = model.getChildAt(model.root, extras.layers[i]);
					
					if (layer != null)
					{
						model.setVisible(layer, true);
					}
				}
			}
		}

		// Handle hidden tags
		if (extras != null && extras.hiddenTags != null)
		{
			var pageTags = extras.hiddenTags[currentPageId] ||
				extras.hiddenTags[0];

			if (pageTags != null && pageTags.length > 0)
			{
				graph.hiddenTags = pageTags;
			}
			else
			{
				graph.hiddenTags = [];
			}
		}

		// Sets initial value for PDF page background
		var gb = graph.getGraphBounds();
		graph.pdfPageVisible = false;
		
		// Handles PDF output where the output should match the page format if the page is visible
		if (data.print || data.format == 'pdf')
		{
			var printScale = 1;
			
			var pw = data.pageWidth || xmlDoc.documentElement.getAttribute('pageWidth');
			var ph = data.pageHeight || xmlDoc.documentElement.getAttribute('pageHeight');
			graph.pdfPageVisible = true;
			
			if (pw != null && ph != null)
			{
				graph.pageFormat = new mxRectangle(0, 0, parseFloat(pw), parseFloat(ph));
			}
			
			var ps = data.pageScale || xmlDoc.documentElement.getAttribute('pageScale');
			
			if (ps != null)
			{
				graph.pageScale = ps;
			}

			var pf = graph.pageFormat;
			var temp = data.scale;
			pf.width = Math.ceil(pf.width * graph.pageScale);
			pf.height = Math.ceil(pf.height * graph.pageScale);
			var scale = 1;

			if (data.fit == '1' && data.sheetsAcross != null && data.sheetsDown != null)
			{
				var h = data.sheetsAcross;
				var v = data.sheetsDown;

				if (!isNaN(temp))
				{
					pf.width = Math.ceil(pf.width * temp);
					pf.height = Math.ceil(pf.height * temp);
				}
				
				scale = Math.min((pf.height * v) / (gb.height / graph.view.scale),
					(pf.width * h) / (gb.width / graph.view.scale));
			}
			else
			{
				scale = !isNaN(temp) ? temp : 1;
			}

			// Applies print scale
			data.scale = scale * printScale;

			graph.getPageSize = function()
			{
				return new mxRectangle(0, 0, this.pageFormat.width * this.pageScale,
					this.pageFormat.height * this.pageScale);
			};
			
			graph.getPageLayout = function()
			{
				var size = this.getPageSize();
				var bounds = this.getGraphBounds();

				if (bounds.width == 0 || bounds.height == 0)
				{
					return new mxRectangle(0, 0, 1, 1);
				}
				else
				{
					// Computes untransformed graph bounds
					var x = Math.ceil(bounds.x / this.view.scale - this.view.translate.x);
					var y = Math.ceil(bounds.y / this.view.scale - this.view.translate.y);
					var w = Math.floor(bounds.width / this.view.scale);
					var h = Math.floor(bounds.height / this.view.scale);
					
					var x0 = Math.floor(x / size.width);
					var y0 = Math.floor(y / size.height);
					var w0 = Math.ceil((x + w) / size.width) - x0;
					var h0 = Math.ceil((y + h) / size.height) - y0;
					
					return new mxRectangle(x0, y0, w0, h0);
				}
			};

			// Fits the number of background pages to the graph
			graph.view.getBackgroundPageBounds = function()
			{
				var layout = this.graph.getPageLayout();
				var page = this.graph.getPageSize();
				
				return new mxRectangle(
					this.scale * (this.translate.x + layout.x * page.width),
					this.scale * (this.translate.y + layout.y * page.height),
					this.scale * layout.width * page.width,
					this.scale * layout.height * page.height);
			};
		}

		// Disables page-based layout when width/height is specified
		// to scale diagram to fit the given dimensions
		if (graph.pdfPageVisible && (data.w > 0 || data.h > 0))
		{
			graph.pdfPageVisible = false;
		}

		if (!graph.pdfPageVisible)
		{
			var b = graph.getGraphBounds();
			
			// Floor is needed to keep rendering crisp
			if (data.w > 0 || data.h > 0)
			{
				var s = 1;
				
				if (data.w > 0 && data.h > 0)
				{
					s = Math.min(data.w / b.width, data.h / b.height);
				}
				else if (data.w > 0)
				{
					s = data.w / b.width;
				}
				else
				{
					s = data.h / b.height;
				}
				
				graph.view.scaleAndTranslate(s,
					Math.floor(data.border / s - Math.floor(b.x)),
					Math.floor(data.border / s - Math.floor(b.y)));
			}
			else
			{
				var s = data.scale;
				
				if (autoScale)
				{
					var pageWidth = (extras != null && extras.pageWidth != null) ? extras.pageWidth : 800;
					
					if (b.width < pageWidth & b.height < 1.5 * pageWidth)
					{
						s = 4;
					}
					else if (b.width < 2 * pageWidth & b.height < 3 * pageWidth)
					{
						s = 3;
					}
					else if (b.width < 4 * pageWidth && b.height < 6 * pageWidth)
					{
						s = 2;
					}
					
					if (extras != null && extras.isGoogleSheet != null)
					{
						GOOGLE_APPS_MAX_AREA = GOOGLE_SHEET_MAX_AREA;
					}
					
					//The image cannot exceed 25 MP to be included in Google Apps
					if (b.width * s * b.height * s > GOOGLE_APPS_MAX_AREA)
					{
						//Subtracting 0.01 to prevent any other rounding that can make slightly over 25 MP 
						s = Math.sqrt(GOOGLE_APPS_MAX_AREA / (b.width * b.height)) - 0.01;
					}
				}
				
				graph.view.scaleAndTranslate(s,
					Math.floor(data.border - Math.floor(b.x)),
					Math.floor(data.border - Math.floor(b.y)));
			}
		}
		else
		{
			// Disables border for PDF page export
			data.border = 0;
			
			// Moves to first page in page layout
			var layout = graph.getPageLayout();
			var page = graph.getPageSize();
			var dx = layout.x * page.width;
			var dy = layout.y * page.height;
			
			if (dx != 0 || dy != 0)
			{
				graph.view.setTranslate(Math.floor(-dx), Math.floor(-dy));
			}
		}
		
		// Gets the diagram bounds and sets the document size
		bounds = (graph.pdfPageVisible) ? graph.view.getBackgroundPageBounds() : graph.getGraphBounds();
		bounds.width = Math.ceil(bounds.width + data.border) + 1; //The 1 extra pixels to prevent cutting the cells on the edges when crop is enabled
		bounds.height = Math.ceil(bounds.height + data.border) + 1; //The 1 extra pixels to prevent starting a new page. TODO Not working in every case
		
		// Print to pdf fails for 1x1 pages
		if (bounds.width <= 1 && bounds.height <= 1)
		{
			bounds.width = 2;
			bounds.height = 2;
		}

		expScale = graph.view.scale || 1;
		
		// Converts the graph to a vertical sequence of pages for PDF export
		if (graph.pdfPageVisible)
		{
			var pf = graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
			var scale = (data.print || data.format == 'pdf') ? data.scale : 1 / graph.pageScale;
			var autoOrigin = ((data.print || data.format == 'pdf') && data.fit == '1') ||
				data.crop == '1' || xmlDoc.documentElement.getAttribute('page') != '1';
			var border = 0;

			// Negative coordinates are cropped or shifted if page visible
			var x0 = 0;
			var y0 = 0;
	
			if (data.crop == '1')
			{
				pf.width = (gb.width + 1.5) * scale;
				pf.height = (gb.height + 1.5) * scale;
			}

			// Starts at first visible page
			if (!autoOrigin)
			{
				var layout = graph.getPageLayout();
				x0 -= layout.x * pf.width;
				y0 -= layout.y * pf.height;
			}

			var anchorId = (currentPageId != null) ? 'page/id,' + currentPageId : null;
			
			if (preview == null)
			{
				preview = new mxPrintPreview(graph, scale, pf, border, x0, y0);
				preview.printBackgroundImage = true;
				preview.autoOrigin = autoOrigin;
				preview.backgroundColor = bg;
				preview.pageMargin = (data.pageMargin != null) ?
					parseInt(data.pageMargin) : ((data.crop == '1') ?
						0 : preview.pageMargin);
				
				// Replaces background images with SVG subtrees
				var previewDrawBackgroundImage = preview.drawBackgroundImage;
				
				preview.drawBackgroundImage = function(img)
				{
					previewDrawBackgroundImage.apply(this, arguments);

					if (img.node != null)
					{
						EditorUi.embedSvgImages(img.node);

						graph.disableSvgLinks(img.node, function(link)
						{
							link.setAttribute('href', 'javascript:void(0)');		
						});
					}
				};

				// Renders the grid and configures math
				var previewAddGraphFragment = preview.addGraphFragment;

				preview.addGraphFragment = function(dx, dy, scale, pageNumber, div, clip)
				{
					previewAddGraphFragment.apply(this, arguments);

					// Disables math rendering in graph
					if (!graph.mathEnabled)
					{
						div.classList.add('geDisableMathJax')
					}
					
					// Adds shadow
					if (xmlDoc.documentElement.getAttribute('shadow') == '1')
					{
						var svgs = div.getElementsByTagName('svg');
						
						for (var i = 0; i < svgs.length; i++)
						{
							graph.addSvgShadow(svgs[i]);
						}
					}
					
					waitForGoogleFontImports(div);
				};

				// Renders print output into this document and removes the graph container
				preview.gridColor = gridColor;
				preview.gridSize = graph.gridSize;
				preview.gridSteps = graph.view.gridSteps;
				preview.open(null, window, null, null, anchorId, pf);
			}
			else
			{
				preview.gridColor = gridColor;
				preview.gridSize = graph.gridSize;
				preview.gridSteps = graph.view.gridSteps;
				preview.backgroundColor = bg;
				preview.autoOrigin = autoOrigin; 
				preview.appendGraph(graph, scale, x0, y0, null, null, anchorId, pf);
			}

			bounds = new mxRectangle(0, 0, pf.width, pf.height);
		}
		else
		{
			var bgImg = graph.backgroundImage;

			if (bgImg != null)
			{
				var t = graph.view.translate;
				var s = graph.view.scale;

				bounds.add(new mxRectangle(
					(t.x + bgImg.x) * s, (t.y + bgImg.y) * s,
					bgImg.width * s, bgImg.height * s));

				if (t.x < 0 || t.y < 0)
				{
					graph.view.setTranslate(
						t.x < 0 ? Math.max(-bgImg.x * s, t.x) : t.x,
						t.y < 0 ? Math.max(-bgImg.y * s, t.y) : t.y);
					bounds.x = 0.5;
					bounds.y = 0.5;
				}
			}

			// Adds shadow
			if (xmlDoc.documentElement.getAttribute('shadow') == '1')
			{
				var size = graph.setShadowVisible(true);
				bounds.width += size;
				bounds.height += size;
			}
			
			document.body.style.width = Math.ceil(bounds.x + bounds.width) + 'px';
			document.body.style.height = Math.ceil(bounds.y + bounds.height) + 'px';
		}
	};
	
	if (diagrams != null && diagrams.length > 0)
	{
		var to = diagrams.length - 1;
		
		// Parameters to and all pages should not be sent with formats other than PDF with page view enabled
		if (data.allPages != '1')
		{
			if (data.pageId != null)
			{
				for (var i = 0; i < diagrams.length; i++)
				{
					if (data.pageId == diagrams[i].getAttribute('id'))
					{
						from = i;
						to = i;
						break;
					}
				}
			}
			else
			{
				from = Math.max(0, Math.min(parseInt(data.from) || from, diagrams.length - 1));
				to = parseInt(data.to);
				//If to is not defined, use from (so one page), otherwise, to is restricted to the range from "from" to diagrams.length - 1
				to = isNaN(to)? from : Math.max(from, Math.min(to, diagrams.length - 1));
			}
		}
		
		/**
		 * Implements %page% and %pagenumber% placeholders
		 */
		var graphGetGlobalVariable = graph.getGlobalVariable;
		
		graph.getGlobalVariable = function(name)
		{
			if (name == 'page')
			{
				return (diagrams == null) ? 'Page-1' :
					(diagrams[from].getAttribute('name') || ('Page-' + (from + 1)));
			}
			else if (name == 'pagenumber')
			{
				return from + 1;
			}
			
			return graphGetGlobalVariable.apply(this, arguments);
		};

		waitCounter += to - from + 1;
		
		for (var i = from; i <= to; i++) 
		{
			if (diagrams[i] != null)
			{
				if (pageId == null)
				{
					pageId = diagrams[i].getAttribute('id');
				}
				
				xmlDoc = Editor.parseDiagramNode(diagrams[i]);
				
				if (xmlDoc != null)
				{
					xmlDoc = xmlDoc.ownerDocument;
				}

				graph.getModel().clear();
				from = i;
				renderPage(diagrams[i].getAttribute('id'));
			}

			decrementWaitCounter();
		}
	}
	else
	{
		renderPage();
	}

	if (preview != null)
	{
		// Expands fill patterns to inline geometry for vector PDF output
		if (Editor.expandPatternsForPrint)
		{
			var svgs = document.getElementsByTagName('svg');

			for (var i = 0; i < svgs.length; i++)
			{
				Editor.expandSvgPatterns(svgs[i]);
			}
		}

		preview.addPendingCss(document);
		Graph.rewritePageLinks(document, true);
	}

	if (fallbackFont)
	{
		// Add a fallbackFont font to all labels in case the selected font doesn't support the character
		// Some systems doesn't have a good fallback fomt that supports all languages
		// Use this with a custom font-face in export-fonts.css file
		document.querySelectorAll('foreignObject div').forEach(d => d.style.fontFamily = (d.style.fontFamily || '') + ', ' + fallbackFont);
	}

	if (data.format == 'pdf')
	{
		graph.container.parentNode.removeChild(graph.container);
	}

	// Includes images in SVG and HTML labels
	waitForImages('image', 'xlink:href');
	waitForImages('img', 'src');
	renderMath(document.body);
	
	// Invokes callback
	decrementWaitCounter();
	
	return graph;
};

//Electron pdf export
if (mxIsElectron)
{
	try 
	{
		electron.registerMsgListener('render', (arg) => 
		{
			try
			{
				if (window.shapesLoaded)
				{
					render(arg);
				}
				else
				{
					window.pendingRequest = arg;
				}
			}
			catch(e)
			{
				console.log(e);
				electron.sendMessage('render-finished', null);
			}
		});
	}
	catch(e)
	{
		console.log(e);
	}
}
