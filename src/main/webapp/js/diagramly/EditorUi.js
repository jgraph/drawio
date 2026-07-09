/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
(function()
{
	/**
	 * Version
	 */
	EditorUi.VERSION = '@DRAWIO-VERSION@';

	/**
	 * Maps CSV `# layout: <name>` shorthands to a {layout, config} entry that
	 * createLayouts() instantiates as an ElkLayout. Used by importCsv; also
	 * referenced in the default CSV comment text.
	 *
	 * verticalflow / horizontalflow used to dispatch to mxHierarchicalLayout
	 * and were retired here to consolidate hierarchical routing on ELK.
	 * Four tunings make ELK's output match the legacy
	 * mxHierarchicalLayout look on the default CSV:
	 *
	 *   - `elk.layered.layering.strategy: LONGEST_PATH` — ELK's default
	 *     for layered is NETWORK_SIMPLEX, which packs as many nodes as
	 *     possible into the same rank to minimize layer count. The
	 *     legacy layout's longest-path layering instead lets nodes drop
	 *     to the bottom of their longest reachability chain, which is
	 *     what spreads Alison into her own rank (because she has
	 *     outgoing edges to Edward + Evan) and reproduces the 3-rank
	 *     orgchart shape.
	 *   - `elk.layered.nodePlacement.bk.fixedAlignment: BALANCED` —
	 *     BRANDES_KOEPF placement is already the default, but its
	 *     default sub-alignment is `NONE` (ELK picks one of LEFTUP /
	 *     RIGHTUP / LEFTDOWN / RIGHTDOWN by heuristic). `BALANCED`
	 *     averages all four, which centers each node over its children
	 *     — Tessa and Alison end up vertically aligned, Edward and
	 *     Evan symmetric around the same spine. Matches the legacy
	 *     layout's centered-around-the-spine look.
	 *   - `elk.edgeRouting: POLYLINE` — produces exactly the same
	 *     waypoint count as the target XML (4 for Tessa→Edward/Evan,
	 *     2 for Tessa→Alison and Alison→Edward/Evan), with a vertical
	 *     channel at x≈74 (target was x≈89) outside Alison's bbox. With
	 *     the CSV's `curved=1` rendering this smooths into the same
	 *     diagonal-vertical-diagonal shape as the target. Verified via
	 *     the elk-test.html harness against the dev-branch
	 *     mxHierarchicalLayout output. ORTHOGONAL produced visible
	 *     stairsteps with extra horizontal jogs; SPLINES output a
	 *     near-identical shape but with ~13 collinear waypoints per
	 *     cross-rank edge instead of 4. The earlier "wavy" reports
	 *     came from `edgeStyle: 'auto'` upgrading edges to
	 *     `orthogonalEdgeStyle` (SegmentConnector); we avoid that here
	 *     via `edgeStyle: 'elkCompat'` (next bullet).
	 *   - `edgeStyle: 'elkCompat'` — sets `noEdgeStyle=1` (so the edge
	 *     uses ELK's waypoints directly), preserves `curved=1` from the
	 *     CSV connect style, and skips the SegmentConnector upgrade.
	 *   - `includeEdgeLabels: false` — tells the bridge not to emit
	 *     mxGraph edge labels as ELK label objects. The bridge's default
	 *     +14px padding (to prevent label-label overlap on parallel
	 *     edges) ends up tripling the inter-rank spacing for orgcharts
	 *     with short labels like "manages"; mxGraph places the labels
	 *     at edge midpoints afterward, independently of the layout, so
	 *     ELK doesn't need to know about them. With this off the
	 *     resulting Tessa→Alison rank gap matches the legacy
	 *     mxHierarchicalLayout output to within a few pixels.
	 *   - `portSpread: true` — runs a post-layout port-spread pass that
	 *     pushes parallel exit/entry ports further from each node's
	 *     center. ELK's BRANDES_KOEPF places ports at evenly-spaced
	 *     positions (25/50/75 for three, 33/67 for two) regardless of
	 *     where the targets sit; mxHierarchicalLayout shifts them toward
	 *     the half of the node closest to each target. The spread pass
	 *     multiplies each port's offset-from-center by ~1.3, which lands
	 *     within ~2pp of the reference layout. See
	 *     ElkApplier._spreadPorts for the rationale.
	 *   - `resizeNodes: false` — keep the autosized widths/heights from
	 *     `getPreferredSizeForCell` instead of letting the applier
	 *     overwrite them with ELK's `child.width` / `child.height`.
	 *     ELK pads its node boxes for routing channels, so the default
	 *     `resizeParent: true` widened Edward from 198 (autosize → minus
	 *     padding) to 215. CSV imports never contain compound parents
	 *     that genuinely need ELK to resize them — turning the resize
	 *     off pins cells at their measured sizes.
	 *
	 * Spacing options (`elk.spacing.nodeNode`, the
	 * between-layers / between-edges variants) are *not* set here —
	 * doImportCsv layers them on top at dispatch time using the CSV's
	 * own `# nodespacing` / `# levelspacing` / `# edgespacing` knobs,
	 * matching what mxHierarchicalLayout did via
	 * intraCellSpacing / interRankCellSpacing / parallelEdgeSpacing.
	 *
	 * The two tree keys (verticaltree / horizontaltree) still live in
	 * doImportCsv on mxCompactTreeLayout — ELK's mrtree output didn't
	 * match the legacy look closely enough.
	 */
	EditorUi.CSV_ELK_LAYOUTS = {
		'verticalflow':   {layout: 'elkLayered', config: {
			'elk.direction': 'DOWN',
			'elk.layered.layering.strategy': 'LONGEST_PATH',
			'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
			'elk.edgeRouting': 'POLYLINE',
			edgeStyle: 'elkCompat',
			includeEdgeLabels: false,
			includeVertexLabels: false,
			portSpread: true,
			resizeNodes: false
		}},
		'horizontalflow': {layout: 'elkLayered', config: {
			'elk.direction': 'RIGHT',
			'elk.layered.layering.strategy': 'LONGEST_PATH',
			'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
			'elk.edgeRouting': 'POLYLINE',
			edgeStyle: 'elkCompat',
			includeEdgeLabels: false,
			includeVertexLabels: false,
			portSpread: true,
			resizeNodes: false
		}},
		'elkRadial':  {layout: 'elkRadial',  config: {edgeStyle: 'elkCompat'}},
		'elkOrganic': {layout: 'elkOrganic', config: {edgeStyle: 'elkCompat'}},
		'elkStress':  {layout: 'elkStress',  config: {edgeStyle: 'elkCompat'}}
	};

	/**
	 * Overrides compact UI setting.
	 */
	EditorUi.compactUi = Editor.currentTheme != 'atlas' || window.DRAWIO_PUBLIC_BUILD;

	/**
	 * Overrides default grid color for dark mode
	 */
	if (Editor.isDarkMode())
	{
		mxGraphView.prototype.gridColor = mxGraphView.prototype.defaultDarkGridColor;
	}
	
	/**
	 * Switch to disable logging for mode and search terms.
	 */
	EditorUi.enableLogging = urlParams['stealth'] != '1' && urlParams['lockdown'] != '1' &&
		(/.*\.draw\.io$/.test(window.location.hostname) ||
		/.*\.diagrams\.net$/.test(window.location.hostname) ||
		/.*\.cdn\.prod\.atlassian-dev\.net$/.test(window.location.hostname)) && // Forge app
		window.location.hostname != 'https://preprod.diagrams.net/' &&
		window.location.hostname != 'support.draw.io' &&
		window.location.hostname != 'test.draw.io';
	
	/**
	 * Protocol and hostname to use for embedded files.
	 */
	EditorUi.drawHost = window.DRAWIO_BASE_URL;
	
	/**
	 * Protocol and hostname to use for embedded files.
	 */
	EditorUi.lightboxHost = window.DRAWIO_LIGHTBOX_URL;
	
	/**
	 * Switch to disable logging for mode and search terms.
	 */
	EditorUi.lastErrorMessage = null;

	/**
	 * Switch to disable logging for mode and search terms.
	 */
	EditorUi.ignoredAnonymizedChars = '\n\t`~!@#$%^&*()_+{}|:"<>?-=[]\;\'.\/,\n\t';

	/**
	 * Specifies the URL for the templates index file.
	 */
	EditorUi.templateFile = TEMPLATE_PATH + '/index.xml';

	/**
	 * Specifies the URL for the diffsync cache.
	 */
	EditorUi.cacheUrl = window.REALTIME_URL;

	/**
	 * Disables sync if no diffsync cache is defined.
	 */
	if (EditorUi.cacheUrl == null && typeof DrawioFile !== 'undefined')
	{
		DrawioFile.SYNC = 'none'; // Disables real-time sync
	}
	
	/**
	 * Cache timeout is 10 seconds.
	 */
	Editor.cacheTimeout = 10000;

	/**
	 * https://github.com/electron/electron/issues/2288
	 */
	EditorUi.isElectronApp = window != null && window.process != null &&
		window.process.versions != null && window.process.versions['electron'] != null;
	
	/**
	 * Shortcut for capability check.
	 */
	EditorUi.nativeFileSupport = !mxClient.IS_OP && !EditorUi.isElectronApp &&
		urlParams['extAuth'] != '1' && 'showSaveFilePicker' in window &&
		'showOpenFilePicker' in window;

	/**
	 * Specifies if drafts should be saved in IndexedDB.
	 */
	EditorUi.enableDrafts = !mxClient.IS_CHROMEAPP &&
		isLocalStorage && urlParams['drafts'] != '0';
	
	/**
	 * Link for scratchpad help.
	 */
	EditorUi.scratchpadHelpLink = 'https://www.drawio.com/doc/faq/scratchpad';

	/**
	 * Specifies if the edit option should be shown in the HTML export dialog.
	 */
	EditorUi.enableHtmlEditOption = true;
 
	/**
	 * Returns true when Mermaid support is usable. This is the central
	 * feature gate for all Mermaid entry points (insert dialog and menu,
	 * AI generation, embed descriptors, double-click edit, headless
	 * export): the browser must support structuredClone (isMermaidEnabled,
	 * see Init.js) and the native parser must be loaded with its parseText
	 * API. Checking parseText (not just mxMermaidToDrawio) matters: stale
	 * extensions.min.js artifacts built before the native-parser switch
	 * define a legacy mxMermaidToDrawio bridge without it, so a bare
	 * typeof check advertises features that fail on use.
	 */
	EditorUi.isMermaidSupported = function()
	{
		return window.isMermaidEnabled &&
			typeof mxMermaidToDrawio !== 'undefined' &&
			typeof mxMermaidToDrawio.parseText === 'function';
	};

	/**
	 * Returns true if the native PlantUML converter (drawio-plantuml) is
	 * loaded with its parseText API. Gates all PlantUML outputs (the
	 * editable "Diagram" group and the client-rendered "Image") — parsing
	 * happens locally, so no PlantUML server or network access is needed.
	 */
	EditorUi.isNativePlantUmlSupported = function()
	{
		return typeof mxPlantUmlToDrawio !== 'undefined' &&
			typeof mxPlantUmlToDrawio.parseText === 'function';
	};

	/**
	 * Default Mermaid config without using foreign objects in flowcharts.
	 */
	EditorUi.defaultMermaidConfig = {};

	/**
	 * Config for mermaid images (from previous versions).
	 */
	EditorUi.legacyMermaidConfig = {
		theme:'neutral',
		arrowMarkerAbsolute:false,
	    sequence:
	    {
	    	diagramMarginX:50,
	    	diagramMarginY:10,
	    	actorMargin:50,
	    	width:150,
	    	height:65,
	    	boxMargin:10,
	    	boxTextMargin:5,
	    	noteMargin:10,
	    	messageMargin:35,
	    	mirrorActors:true,
	    	bottomMarginAdj:1,
	    	useMaxWidth:true,
	    	rightAngles:false,
	    	showSequenceNumbers:false
	    },
	    gantt:{
			useWidth:1000,
			useMaxWidth:true,
	    	titleTopMargin:25,
	    	barHeight:20,
	    	barGap:4,
	    	topPadding:50,
	    	leftPadding:75,
	    	gridLineStartPadding:35,
	    	fontSize:11,
	    	fontFamily:'"Open-Sans", "sans-serif"',
	    	numberSectionStyles:4,
	    	axisFormat:'%Y-%m-%d'
	    }
	};

	/**
	 * Default padding (px) drawn around mermaid image cells, matching the small
	 * margin the legacy upstream-rendered images had (their content sat ~8px
	 * from each edge). Overridable per cell via the mermaidData `border` field.
	 */
	EditorUi.mermaidImageBorder = 8;

	/**
	 * Updates action states depending on the selection.
	 */
	EditorUi.logError = function(message, url, linenumber, colno, err, severity, quiet)
	{
		if (message != null)
		{
			err = (err != null) ? err : new Error(message);
			err.stack = (err.stack != null) ? err.stack : '';
			severity = (severity != null) ? severity : ((message.indexOf('NetworkError') < 0 &&
				message.indexOf('SecurityError') < 0 && message.indexOf('NS_ERROR_FAILURE') < 0 &&
				message.indexOf('out of memory') < 0) ? 'SEVERE' : 'CONFIG');
			
			try
			{
				if (EditorUi.enableLogging && urlParams['dev'] != '1' &&
					message != EditorUi.lastErrorMessage && message.indexOf('extension:') < 0 &&
					message.indexOf('ResizeObserver loop completed with undelivered notifications') < 0 &&
					err.stack.indexOf('extension:') < 0 && err.stack.indexOf('<anonymous>:') < 0 &&
					err.stack.indexOf('/math4/es5/') < 0 && err.stack.indexOf('blob:') < 0 &&
					(message.indexOf('strict mode') < 0 || err.stack.indexOf('extensions.min.js') < 0))
				{
					EditorUi.lastErrorMessage = message;

					var img = new Image();
					var logDomain = window.DRAWIO_LOG_URL != null ?
						window.DRAWIO_LOG_URL : '';
					img.src = logDomain + '/log?severity=' + severity +
						'&v=' + encodeURIComponent(EditorUi.VERSION) +
						'&msg=clientError:' + encodeURIComponent(message) +
						':url:' + encodeURIComponent(window.location.href) +
						':lnum:' + encodeURIComponent(linenumber) +
						((colno != null) ?
							':colno:' + encodeURIComponent(colno) : '') +
						((err.stack != '') ?
							'&stack=' + encodeURIComponent(err.stack) : '');
				}
			}
			catch (e)
			{
				// ignore
			}
			
			try
			{
				if (!quiet && window.console != null)
				{
					console.error(severity, message, url, linenumber, colno, err);
				}
			}
			catch (e)
			{
				// ignore
			}
		}
	};
	
	/**
	 * Updates action states depending on the selection.
	 */
	EditorUi.logEvent = function(data)
	{
		if (urlParams['dev'] == '1')
		{
			EditorUi.debug('logEvent', data);
		}
		else if (EditorUi.enableLogging)
		{
			try
			{
				var logDomain = window.DRAWIO_LOG_URL != null ? window.DRAWIO_LOG_URL : '';
				var img = new Image();
				img.src = logDomain + '/images/1x1.png?' +
						'v=' + encodeURIComponent(EditorUi.VERSION) +
						((data != null) ? '&data=' + encodeURIComponent(JSON.stringify(data)) : '');
	    	}
			catch (e)
			{
	    			// ignore
			}
		}
	};

	/**
	 * Sending error reports.
	 */
	EditorUi.sendReport = function(data, maxLength)
	{
		if (urlParams['dev'] == '1')
		{
			EditorUi.debug('sendReport', data);
		}
		else if (EditorUi.enableLogging)
		{
			try
			{
				maxLength = (maxLength != null) ? maxLength : 50000;

				if (data.length > maxLength)
				{
					data = data.substring(0, maxLength) + '\n...[SHORTENED]'
				}
				
				mxUtils.post('/email', 'version=' + encodeURIComponent(EditorUi.VERSION) +
					'&url=' + encodeURIComponent(window.location.href) +
					'&data=' + encodeURIComponent(data));
			}
			catch (e)
			{
				// ignore
			}
		}
	};

	/**
	 * Adds the listener for automatically saving the diagram for local changes.
	 */
	EditorUi.debug = function()
	{
		try
		{
			if (window.console != null && urlParams['test'] == '1')
			{
				var args = [new Date().toISOString()];
				
				for (var i = 0; i < arguments.length; i++)
			    {
					args.push(arguments[i]);
			    }
			    
				if (mxClient.IS_IOS)
				{
					mxLog.show();
					mxLog.debug(args.join(' '));
				}
				else
				{
					console.log.apply(console, args);
				}
			}
		}
		catch (e)
		{
			// ignore
		}
	};

	/**
	 * Removes any values, styles and geometries from the given XML node.
	 */
	EditorUi.removeChildNodes = function(node)
	{
		while (node.firstChild != null)
		{
			node.removeChild(node.firstChild);
		}
	};
	
	/**
	 * Replaces SVG data URIs in images with the actual SVG for
	 * the images to be supported in apps like Powerpoint.
	 */
	EditorUi.embedSvgImages = function(root)
	{
		var temp = root.getElementsByTagName('image');

		// Clones array
		var imgs = [];

		for (var i = 0; i < temp.length; i++)
		{
			imgs.push(temp[i]);
		}

		// Replaces images
		for (var i = 0; i < imgs.length; i++)
		{
			EditorUi.replaceSvgImage(imgs[i]);
		}
	};
	
	/**
	 * Replaces the given SVG image with an SVG subtree.
	 */
	EditorUi.replaceSvgImage = function(node)
	{
		try
		{
			var href = null;

			// Workaround for missing namespace support
			if (node.getAttributeNS == null)
			{
				href = node.getAttribute('xlink:href');
			}
			else
			{
				href = node.getAttributeNS(mxConstants.NS_XLINK, 'href');
			}

			var svg = EditorUi.getSvgSubtree(href);

			// Checks nodeName as parsers can get foreignObjects
			// content to go before the SVG element
			if (svg != null && svg.nodeName == 'svg')
			{
				var w = svg.getAttribute('width');
				var h = svg.getAttribute('height');
				svg.setAttribute('x', node.getAttribute('x'));
				svg.setAttribute('y', node.getAttribute('y'));
				svg.setAttribute('width', node.getAttribute('width'));
				svg.setAttribute('height', node.getAttribute('height'));
				svg.style.fontFamily = 'initial';

				// Handles existing width and height
				if (w > 0 && h > 0 && svg.getAttribute('viewBox') == null)
				{
					svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
				}

				// Adds group with optional transform attribute
				var group = mxUtils.createElementNs(svg.ownerDocument,
					mxConstants.NS_SVG, 'g');
				group.appendChild(svg);

				if (node.hasAttribute('transform'))
				{
					group.setAttribute('transform', node.getAttribute('transform'));
				}
				
				node.parentNode.replaceChild(group, node);
			}
		}
		catch (e)
		{
			// ignore
		}
	};
	
	/**
	 * Returns SVG with modified CSS rules that limit scope to subtree.
	 */
	EditorUi.getSvgSubtree = function(href)
	{
		var data = Graph.getSvgFromDataUri(href);
		var svg = null;

		if (data != null)
		{
			svg = Graph.sanitizeNode(mxUtils.parseXml(data).documentElement);

			// Limits CSS rules to subtree
			var styles = svg.getElementsByTagName('style');

			if (styles.length > 0)
			{
				var id = 'svg-image-' + Editor.guid();
				svg.setAttribute('id', id);
				
				// Adds ID selector for all CSS rules to limit scope
				var doc = document.implementation.createHTMLDocument(''),
				styleElement = document.createElement('style');

				for (var j = 0; j < styles.length; j++)
				{
					styleElement.textContent = styles[j].textContent;
					doc.body.appendChild(styleElement);
					var modifiedCss = '';

					for (var k = 0; k < styleElement.sheet.cssRules.length; k++)
					{
						var rule = styleElement.sheet.cssRules[k];

						if (rule.selectorText != null)
						{
							var tokens = rule.selectorText.split(',');

							for (var l = 0; l < tokens.length; l++)
							{
								tokens[l] = '#' + id + ' ' + tokens[l];
							}

							rule.selectorText = tokens.join(',');
						}

						modifiedCss += rule.cssText + '\n';
					}
					
					styles[j].textContent = modifiedCss;
				}
			}
			
			// Removes system color scheme to make it adapt to current scheme
			if (svg.style != null && svg.style.getPropertyValue('color-scheme') == 'light dark')
			{
				svg.style.removeProperty('color-scheme');
			}

			// Removes data-cell-id attribute from all elements
			var elements = svg.getElementsByTagName('*');

			for (var i = 0; i < elements.length; i++)
			{
				elements[i].removeAttribute('data-cell-id');
			}
		}

		return svg;
	};
	
	/**
	 * Contains the default XML for an empty diagram.
	 */
	EditorUi.prototype.emptyDiagramXml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>';

	/**
	 *
	 */
	EditorUi.prototype.emptyLibraryXml = '<mxlibrary>[]</mxlibrary>';

	/**
	 * Returns true if the given file data contains no user-added cells —
	 * i.e. every page has just the root cell (id=0) and the default layer
	 * (id=1) with no children. Used to suppress storing empty drafts.
	 */
	EditorUi.prototype.isDiagramDataEmpty = function(data)
	{
		if (data == null || data.length == 0 || data == this.emptyDiagramXml)
		{
			return true;
		}

		try
		{
			var doc = mxUtils.parseXml(data);
			var root = doc.documentElement;

			var checkModel = function(modelNode)
			{
				return modelNode == null ||
					modelNode.getElementsByTagName('mxCell').length <= 2;
			};

			if (root.nodeName == 'mxGraphModel')
			{
				return checkModel(root);
			}

			if (root.nodeName == 'mxfile')
			{
				var diagrams = root.getElementsByTagName('diagram');

				if (diagrams.length == 0)
				{
					return true;
				}

				for (var i = 0; i < diagrams.length; i++)
				{
					var models = diagrams[i].getElementsByTagName('mxGraphModel');

					if (models.length > 0)
					{
						if (!checkModel(models[0])) return false;
					}
					else
					{
						// Compressed diagram payload — decompress and re-check
						var text = mxUtils.getNodeValue(diagrams[i]);

						if (text != null && text.length > 0)
						{
							var decompressed = Graph.decompress(text);

							if (decompressed != null && decompressed.length > 0)
							{
								var modelDoc = mxUtils.parseXml(decompressed);

								if (!checkModel(modelDoc.documentElement)) return false;
							}
						}
					}
				}

				return true;
			}
		}
		catch (e)
		{
			// Unparseable data — treat as non-empty so we don't drop a
			// draft the user might still recover by hand.
		}

		return false;
	};

	/**
	 * Sets the delay for autosave in milliseconds. Default is 2000.
	 */
	EditorUi.prototype.mode = null;

	/**
	 * General timeout is 25 seconds.
	 * LATER: Move to Editor
	 */
	EditorUi.prototype.timeout = Editor.prototype.timeout;

	/**
	 * Specifies the default custom shape style.
	 */
	EditorUi.prototype.defaultCustomShapeStyle = 'shape=stencil(tZRtTsQgEEBPw1+DJR7AoN6DbWftpAgE0Ortd/jYRGq72R+YNE2YgTePloEJGWblgA18ZuKFDcMj5/Sm8boZq+BgjCX4pTyqk6ZlKROitwusOMXKQDODx5iy4pXxZ5qTHiFHawxB0JrQZH7lCabQ0Fr+XWC1/E8zcsT/gAi+Subo2/3Mh6d/oJb5nU1b5tW7r2knautaa3T+U32o7f7vZwpJkaNDLORJjcu7t59m2jXxqX9un+tt022acsfmoKaQZ+vhhswZtS6Ne/ThQGt0IV0N3Yyv6P3CeT9/tHO0XFI5cAE=);whiteSpace=wrap;html=1;';

	/**
	 * Defines the maximum size for images.
	 */
	EditorUi.prototype.maxBackgroundSize = 1600;

	/**
	 * Defines the maximum size for images in px. Default is 1200.
	 */
	EditorUi.prototype.maxImageSize = 1200;
	
	/**
	 * Defines the maximum width for pasted text.
	 * Use 0 to disable check.
	 */
	EditorUi.prototype.maxTextWidth = 520;

	/**
	 * Images above 100K should be resampled.
	 */
	EditorUi.prototype.resampleThreshold = 100000;

	/**
	 * Defines the maximum size for images in bytes. Default is 2 MB.
	 */
	EditorUi.prototype.maxImageBytes = 2000000;

	/**
	 * Maximum size for background images is 2.5 MB.
	 */
	EditorUi.prototype.maxBackgroundBytes = 2500000;

	/**
	 * Maximum size for text files in labels is 0.5 MB.
	 */
	EditorUi.prototype.maxTextBytes = 500000;

	/**
	 * Holds the current file.
	 */
	EditorUi.prototype.currentFile = null;

	/**
	 * Specifies if PDF export should be done via print dialog. Default is
	 * false which uses the PhantomJS backend to create the PDF.
	 */
	EditorUi.prototype.printPdfExport = false;
	
	/**
	 * Specifies if PDF export with pages is enabled.
	 */
	EditorUi.prototype.pdfPageExport = true;

	/**
	 * Restores app defaults for UI
	 */
	EditorUi.prototype.formatEnabled = urlParams['format'] != '0';

	/**
	 * Restores app defaults for UI
	 */
	EditorUi.prototype.sidebarEnabled = urlParams['sidebar'] != '0';

	/**
	 * Whether template action should be shown in insert menu.
	 */
	EditorUi.prototype.insertTemplateEnabled = true;
	
	/**
	 * Restores app defaults for UI
	 */
	EditorUi.prototype.closableScratchpad = true;
	
	/**
	 * Optional custom message source for embed mode. If set, messages
	 * from this source are accepted in addition to window.opener/parent.
	 * Embedders can set this before calling App.main() to avoid needing
	 * to fake window.opener or re-dispatch messages.
	 */
	EditorUi.prototype.embedMessageSource = null;

	/**
	 * Default value for compact mode in file data output.
	 * Can be set via Editor.configure({compact: true}).
	 */
	EditorUi.prototype.defaultCompact = false;

	/**
	 * Whether to suppress auto-focusing the editor window.
	 * Can be set via Editor.configure({noAutoFocus: true}).
	 */
	EditorUi.prototype.noAutoFocus = false;

	/**
	 * Restores app defaults for UI
	 */
	EditorUi.prototype.embedExportBorder = 8;
	
	/**
	 * Restores app defaults for UI
	 */
	EditorUi.prototype.embedExportTheme = 'auto';
	
	/**
	 * Restores app defaults for UI
	 */
	EditorUi.prototype.embedExportBackground = null;
	
	/**
	 * Restores app defaults for UI
	 */
	EditorUi.prototype.shareCursorPosition = true;

	/**
	 * Restores app defaults for UI
	 */
	EditorUi.prototype.showRemoteCursors = true;
	
	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.createButtonContainer = function()
	{
		var div = document.createElement('div');
		div.className = 'geButtonContainer';
		
		return div;
	};

	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.openLink = function(url, target, allowOpener)
	{
		// LATER: Replace this with direct calls to graph
		return this.editor.graph.openLink(url, target, allowOpener);
	};

	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.showSplash = function(force) { };

	/**
	 * Abstraction for local storage access.
	 */
	EditorUi.prototype.getLocalData = function(key, fn)
	{
		fn(localStorage.getItem(key));
	};
	
	/**
	 * Abstraction for local storage access.
	 */
	EditorUi.prototype.setLocalData = function(key, data, fn)
	{
		localStorage.setItem(key, data);
		
		if (fn != null)
		{
			fn();
		}
	};
	
	/**
	 * Abstraction for local storage access.
	 */
	EditorUi.prototype.isLocked = function()
	{
		var file = this.getCurrentFile();

		return file != null && file.isLocked()
	};
	
	/**
	 * Abstraction for local storage access.
	 */
	EditorUi.prototype.removeLocalData = function(key, fn)
	{
		localStorage.removeItem(key)
		fn();
	};

	/**
	 * Returns true if offline app, which isn't a defined thing
	 */
	EditorUi.prototype.setShareCursorPosition = function(value)
	{
		this.shareCursorPosition = value;

		this.fireEvent(new mxEventObject('shareCursorPositionChanged'));
	};

	/**
	 * Returns true if offline app, which isn't a defined thing
	 */
	EditorUi.prototype.isShareCursorPosition = function()
	{
		return this.shareCursorPosition;
	};

	 /**
	  * Returns true if offline app, which isn't a defined thing
	  */
	EditorUi.prototype.setShowRemoteCursors = function(value)
	{
		this.showRemoteCursors = value;

		this.fireEvent(new mxEventObject('showRemoteCursorsChanged'));
	};
 
	/**
	 * Returns true if offline app, which isn't a defined thing
	 */
	EditorUi.prototype.isShowRemoteCursors = function()
	{
		return this.showRemoteCursors;
	};
 
	/**
	 * Returns true if offline app, which isn't a defined thing
	 */
	EditorUi.prototype.setMathEnabled = function(value)
	{
		var graph = this.editor.graph;
		graph.mathEnabled = value;

		// Forces refresh of background image
		if (graph.view.backgroundImage != null)
		{
			graph.view.backgroundImage.destroy();
			graph.view.backgroundImage = null;
		}

		this.editor.updateGraphComponents();
		graph.refresh();
		graph.defaultMathEnabled = value;
		
		this.fireEvent(new mxEventObject('mathEnabledChanged'));
	};

	/**
	 * Returns true if offline app, which isn't a defined thing
	 */
	EditorUi.prototype.isMathEnabled = function(value)
	{
		return this.editor.graph.mathEnabled;
	};

	/**
	 * Returns true if offline app, which isn't a defined thing
	 */
	EditorUi.prototype.setAdaptiveColors = function(value)
	{
		this.editor.graph.setAdaptiveColors(value);
		
		// Invalidate is not enough as changed colors are not detected
		// in redrawShape since they are converted later in the canvas.
		this.editor.graph.view.clear();
		this.fireEvent(new mxEventObject('adaptiveColorsChanged'));
	};

	/**
	 * Returns true if offline app, which isn't a defined thing
	 */
	EditorUi.prototype.isStandaloneApp = function()
	{
		return mxClient.IS_CHROMEAPP || EditorUi.isElectronApp || this.isOfflineApp();
	};

	/**
	 * Returns true if offline app, which isn't a defined thing
	 */
	EditorUi.prototype.isOfflineApp = function()
	{
		return urlParams['offline'] == '1';
	};

	/**
	 * Deprecated. Poorly defined, to be replaced with isExternalDataComms and other more granular flags.
	 * Original idea was it returns true if no external comms allowed or possible
	 */
	EditorUi.prototype.isOffline = function(ignoreStealth)
	{
		return this.isOfflineApp() || !navigator.onLine || (!ignoreStealth && (urlParams['stealth'] == '1' || urlParams['lockdown'] == '1'));
	};

	/**
	 * Returns true if diagram data transmission other than save/load is allowed or possible..
	 */
	EditorUi.prototype.isExternalDataComms = function()
	{
		return urlParams['offline'] != '1' && !this.isOffline() && !this.isOfflineApp();
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createSpinner = function(x, y, size)
	{
		var autoPosition = (x == null || y == null);
		size = (size != null) ? size : 24;

		var spinner = new Spinner({
			lines: 12, // The number of lines to draw
			length: size, // The length of each line
			width: Math.round(size / 3), // The line thickness
			radius: Math.round(size / 2), // The radius of the inner circle
			rotate: 0, // The rotation offset
			color: 'light-dark(#000000, #C0C0C0)',
			speed: 1.5, // Rounds per second
			trail: 60, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: false, // Whether to use hardware acceleration
			zIndex: 2e9 // The z-index (defaults to 2000000000)
		});

		// Extends spin method to include an optional label
		var defaultTimeout = this.timeout;
		var oldSpin = spinner.spin;
		var thread = null;
		var retry = null;

		var resume = mxUtils.bind(this, function(fn)
		{
			if (fn != null)
			{
				fn();
			}
		});
		
		var ui = this;

		spinner.spin = function(container, label, error, timeout)
		{
			timeout = (timeout != null) ? timeout : defaultTimeout;
			var result = false;
			
			if (!this.active)
			{
				var start = Date.now();

				if (error != null)
				{
					thread = window.setTimeout(function()
					{
						spinner.stop();
						thread = null;
						error({code: App.ERROR_TIMEOUT,
							message: mxResources.get('timeout'),
							retry: retry});
					}, timeout);
				}

				if (autoPosition)
				{
					y = Math.max(document.body.clientHeight || 0, document.documentElement.clientHeight || 0) / 2;
					x = document.body.clientWidth / 2 - 2;
				}

				if (container == document.body &&
					urlParams['embedInline'] == '1')
				{
					container = ui.diagramContainer;
					x = container.scrollLeft + container.clientWidth / 2;
					y = container.scrollTop + container.clientHeight / 2;
				}
				
				oldSpin.call(this, container);

				if (urlParams['embedInline'] == '1')
				{
					if (spinner.el != null)
					{
						spinner.el.style.marginTop = container.scrollTop + 'px';
						spinner.el.style.marginLeft = container.scrollLeft + 'px';
					}
				}

				this.active = true;
				
				if (label != null)
				{
					var status = document.createElement('div');
					status.className = 'geSpinnerStatus';
					status.setAttribute('title', label);

					if (container == document.body)
					{
						status.style.left = Math.max(0, x) + 'px';
						status.style.top = Math.max(0, y + 66) + 'px';
					}
					else
					{
						status.style.left = '50%';
						status.style.top = '50%';
						status.style.marginTop = '70px';
					}
					
					if (label.substring(label.length - 3, label.length) != '...' &&
						label.charAt(label.length - 1) != '!')
					{
						label = label + '...';
					}
					
					status.innerText = label;
					container.appendChild(status);
					spinner.status = status;
				}
				
				// Pause returns a function to resume the spinner
				this.pause = mxUtils.bind(this, function()
				{
					var fn = resume;
					
					if (this.active)
					{
						// Reduces timeout by used time
						timeout = Math.max(0, timeout - (Date.now() - start));

						fn = mxUtils.bind(this, function(continueFn)
						{
							this.spin(container, label, error, timeout);

							// Continue is called after spinner was paused and is
							// used as the new retry function from here on
							if (continueFn != null)
							{
								try
								{
									continueFn();

									retry = mxUtils.bind(this, function()
									{
										this.spin(container, label, error, timeout);

										try
										{
											continueFn();
										}
										catch (e)
										{
											if (error != null)
											{
												error(e);
											}
										}
									});
								}
								catch (e)
								{
									if (error != null)
									{
										error(e);
									}
								}
							}
						});
					}
					
					this.stop();
					
					return fn;
				});
				
				result = true;
			}
				
			return result;
		};
		
		// Extends stop method to remove the optional label
		var oldStop = spinner.stop;
		
		spinner.stop = function()
		{
			oldStop.call(this);
			
			if (this.active)
			{
				this.active = false;

				if (thread != null)
				{
					window.clearTimeout(thread);
					thread = null;
				}
				
				if (spinner.status != null && spinner.status.parentNode != null)
				{
					spinner.status.parentNode.removeChild(spinner.status);
				}

				spinner.status = null;
			}
		};
		
		spinner.pause = function()
		{
			return resume;
		};
		
		return spinner;
	};

	/**
	 * Returns true if the given string contains a compatible graph model.
	 */
	EditorUi.prototype.isCompatibleString = function(data)
	{
		try
		{
			data = mxUtils.trim(data);

			if (data.charAt(0) == '<')
			{
				var doc = mxUtils.parseXml(data);
				var node = this.editor.extractGraphModel(doc.documentElement, true);
				
				return node != null && node.getElementsByTagName('parsererror').length == 0;
			}
		}
		catch (e)
		{
			// ignore
		}
		
		return false;
	};

	/**
	 * Returns true if the given binary data is a Visio file.
	 */
	EditorUi.isVisioFilename = function(filename)
	{
		return (/(\.v(dx|sdx?))($|\?)/i.test(filename) ||
			/(\.vs(x|sx?))($|\?)/i.test(filename));
	};

	/**
	 * Returns true if the given binary data is a Visio file.
	 */
	EditorUi.prototype.isVisioData = function(data)
	{
		return data.length > 8 && ((data.charCodeAt(0) == 0xD0 && data.charCodeAt(1) == 0xCF &&
			data.charCodeAt(2) == 0x11 && data.charCodeAt(3) == 0xE0 && data.charCodeAt(4) == 0xA1 && data.charCodeAt(5) == 0xB1 &&
			data.charCodeAt(6) == 0x1A && data.charCodeAt(7) == 0xE1) || (data.charCodeAt(0) == 0x50 && data.charCodeAt(1) == 0x4B &&
			data.charCodeAt(2) == 0x03 && data.charCodeAt(3) == 0x04) || (data.charCodeAt(0) == 0x50 && data.charCodeAt(1) == 0x4B &&
			data.charCodeAt(2) == 0x03 && data.charCodeAt(3) == 0x06));
	};

	/**
	 * Returns true if the given binary data is a Visio file that requires remote conversion.
	 * This code returns true for vss, vsd and vdx files.
	 */
	EditorUi.prototype.isRemoteVisioData = function(data)
	{
		return data.length > 8 && ((data.charCodeAt(0) == 0xD0 && data.charCodeAt(1) == 0xCF &&
			data.charCodeAt(2) == 0x11 && data.charCodeAt(3) == 0xE0 && data.charCodeAt(4) == 0xA1 && data.charCodeAt(5) == 0xB1 &&
			data.charCodeAt(6) == 0x1A && data.charCodeAt(7) == 0xE1) || (data.charCodeAt(0) == 0x3C && data.charCodeAt(1) == 0x3F &&
			data.charCodeAt(2) == 0x78 && data.charCodeAt(3) == 0x6D && data.charCodeAt(3) == 0x6C));
	};

	/**
	 * Adds keyboard shortcuts for page handling.
	 */
    var editorUiCreateKeyHandler = EditorUi.prototype.createKeyHandler;
    EditorUi.prototype.createKeyHandler = function(editor)
    {
    	var keyHandler = editorUiCreateKeyHandler.apply(this, arguments);
    	
    	if (!this.editor.chromeless || this.editor.editable)
		{
	    	var keyHandlerGetFunction = keyHandler.getFunction;
	    	var graph = this.editor.graph;
	    	var ui = this;
	    	
	    	keyHandler.getFunction = function(evt)
	    	{
	    		if (graph.isSelectionEmpty() && ui.pages != null && ui.pages.length > 0)
	    		{
	    			var idx = ui.getSelectedPageIndex();

	    			if (mxEvent.isShiftDown(evt))
	    			{
		    			if (evt.keyCode == 37)
		    			{
	    					return function()
	    					{
			    				if (idx > 0)
			    				{
		    						ui.movePage(idx, idx - 1);
		    					}
		    				};
		    			}
		    			else if (evt.keyCode == 38)
		    			{
	    					return function()
	    					{
			    				if (idx > 0)
			    				{
		    						ui.movePage(idx, 0);
		    					}
		    				};
		    			}
		    			else if (evt.keyCode == 39)
		    			{
	    					return function()
	    					{
			    				if (idx < ui.pages.length - 1)
			    				{
		    						ui.movePage(idx, idx + 1);
		    					}
		    				};
		    			}
		    			else if (evt.keyCode == 40)
		    			{
	    					return function()
	    					{
			    				if (idx < ui.pages.length - 1)
			    				{
		    						ui.movePage(idx, ui.pages.length - 1);
		    					}
		    				};
		    			}
	    			}
	    			else if (mxEvent.isControlDown(evt) || (mxClient.IS_MAC && mxEvent.isMetaDown(evt)))
					{
	    				if (evt.keyCode == 37)
		    			{
	    					return function()
	    					{
			    				if (idx > 0)
			    				{
		    						ui.selectNextPage(false);
		    					}
		    				};
		    			}
		    			else if (evt.keyCode == 38)
		    			{
	    					return function()
	    					{
			    				if (idx > 0)
			    				{
			    					ui.selectPage(ui.pages[0]);
		    					}
		    				};
		    			}
		    			else if (evt.keyCode == 39)
		    			{
	    					return function()
	    					{
			    				if (idx < ui.pages.length - 1)
			    				{
			    					ui.selectNextPage(true);
		    					}
		    				};
		    			}
		    			else if (evt.keyCode == 40)
		    			{
	    					return function()
	    					{
			    				if (idx < ui.pages.length - 1)
			    				{
			    					ui.selectPage(ui.pages[ui.pages.length - 1]);
		    					}
		    				};
		    			}
					}
	    		}

				// Ignores normal keystrokes as shortcuts if cells are selected (eg. A/S/D/F)
				if (evt.keyCode >= 65 && evt.keyCode <= 90 && !graph.isSelectionEmpty() &&
					!mxEvent.isAltDown(evt) && !mxEvent.isShiftDown(evt) &&
					!mxEvent.isControlDown(evt) && !(mxClient.IS_MAC && mxEvent.isMetaDown(evt)))
				{
					return null;
				}
	    		else
				{
	    			return keyHandlerGetFunction.apply(this, arguments);
				}
	    	};
		}
    	
    	return keyHandler;
    };

	/**
	 * Extracts the mxfile from the given HTML data from a data transfer event.
	 */
	var editorUiExtractGraphModelFromHtml = EditorUi.prototype.extractGraphModelFromHtml;
	EditorUi.prototype.extractGraphModelFromHtml = function(data)
	{
		var result = editorUiExtractGraphModelFromHtml.apply(this, arguments);
		
		if (result == null)
		{
			try
			{
		    	var idx = data.indexOf('&lt;mxfile ');
		    	
		    	if (idx >= 0)
		    	{
		    		var idx2 = data.lastIndexOf('&lt;/mxfile&gt;');
		    		
		    		if (idx2 > idx)
		    		{
		    			result = data.substring(idx, idx2 + 15).replace(/&gt;/g, '>').
		    				replace(/&lt;/g, '<').replace(/\\&quot;/g, '"').replace(/\n/g, '');
		    		}
		    	}
		    	else
		    	{
		    		// Gets compressed data from mxgraph element in HTML document
					var doc = mxUtils.parseXml(data);
					var node = this.editor.extractGraphModel(doc.documentElement, this.pages != null ||
						this.diagramContainer.style.visibility == 'hidden');
					result = (node != null) ? mxUtils.getXml(node) : '';
		    	}
			}
			catch (e)
			{
				// ignore
			}
		}
		
		return result;
	};
		
	/**
	 * Workaround for malformed xhtml meta element bug 07.08.16. The trailing slash was missing causing
	 * reopen to fail trying to parse. Used in replaceFileData, setFileData and importFile.
	 */
	EditorUi.prototype.validateFileData = function(data)
	{
		if (data != null && data.length > 0)
		{
			var index = data.indexOf('<meta charset="utf-8">');
			
			if (index >= 0)
			{
				var replaceString = '<meta charset="utf-8"/>';
				var replaceStrLen = replaceString.length;
				data = data.slice(0, index) + replaceString + data.slice(index + replaceStrLen - 1, data.length);
			}
			
			data = Graph.zapGremlins(data);
		}

		return data;
	};

	/**
	 * Best-effort repair of corrupt file data. Applies conservative, unambiguous
	 * fixes only, then returns the repaired string (or null if nothing changed):
	 *
	 * 1. Missing ">" on a closing tag that is immediately followed by another
	 *    tag (eg. "</mxGraphModel\n</diagram>"). Closing tags have no attributes,
	 *    so the insertion point is unambiguous. Opening tags are deliberately not
	 *    touched - guessing where a ">" goes among attributes risks producing
	 *    well-formed but semantically wrong XML.
	 * 2. Truncation (the common crash/sync-mid-write case): drop a trailing
	 *    incomplete tag fragment, then append a closing tag for every element
	 *    still open at the end of the document (eg. a missing </diagram></mxfile>).
	 *
	 * Every candidate is re-validated by the caller via isFileDataLoadable, so a
	 * fix that does not actually yield a loadable file is never offered.
	 */
	EditorUi.prototype.repairFileData = function(data)
	{
		var original = mxUtils.trim(data || '');

		if (original.length == 0)
		{
			return null;
		}

		// Fix 1: missing ">" on closing tags followed by another tag
		var repaired = original.replace(/<\/([A-Za-z_][\w.\-]*)(\s*)(?=<)/g, '</$1>$2');

		// Fix 2: drop a trailing incomplete tag fragment (file cut mid-tag)
		var lastGt = repaired.lastIndexOf('>');
		var lastLt = repaired.lastIndexOf('<');

		if (lastLt > lastGt)
		{
			repaired = mxUtils.trim(repaired.substring(0, lastGt + 1));
		}

		// Fix 3: append a closing tag for every element still open at EOF, by
		// walking the (complete) tags and tracking the open-element stack
		if (repaired.substring(repaired.length - 9) != '</mxfile>')
		{
			var stack = [];
			var tagRe = /<(\/?)([A-Za-z_][\w.\-]*)[^>]*?(\/?)>/g;
			var match;

			while ((match = tagRe.exec(repaired)) != null)
			{
				if (match[1] == '/')
				{
					// Closing tag - pop if it matches the open element
					if (stack.length > 0 && stack[stack.length - 1] == match[2])
					{
						stack.pop();
					}
				}
				else if (match[3] != '/')
				{
					// Opening (non-self-closing) tag
					stack.push(match[2]);
				}
			}

			for (var i = stack.length - 1; i >= 0; i--)
			{
				repaired += '</' + stack[i] + '>';
			}
		}

		return (repaired != original) ? repaired : null;
	};

	/**
	 * Returns true if the given file data would load, ie. parses without a
	 * parser error and yields a graph model node. Mirrors the front of
	 * setFileData so it accepts exactly what setFileData would accept. Used to
	 * validate recovery candidates so a recovery action never re-shows the same
	 * load error.
	 */
	EditorUi.prototype.isFileDataLoadable = function(data)
	{
		try
		{
			data = this.validateFileData(data);
			var node = (data != null && data.length > 0) ?
				mxUtils.parseXml(data).documentElement : null;

			if (node == null || Editor.extractParserError(node) != null)
			{
				return false;
			}

			var tmp = this.editor.extractGraphModel(node, true);

			return ((tmp != null) ? tmp : node) != null;
		}
		catch (e)
		{
			return false;
		}
	};

	/**
	 * Probes for best-effort recovery candidates for a file that failed to load
	 * and invokes callback with an ordered array of candidates (may be empty).
	 * Each candidate is {type, label, description, data, lossy, date?}. Order is
	 * lossless-first: a prior known-good version (file.getRecoveryVersion - the
	 * desktop .bkp backup or a cloud revision) comes before the lossy in-memory
	 * repair. Asynchronous (callback-based) because the version source may read
	 * from disk or a remote provider.
	 */
	EditorUi.prototype.getRecoveryData = function(file, data, error, callback)
	{
		// Sync in-memory repair candidate (lossy)
		var repair = null;

		try
		{
			var repaired = this.repairFileData(data);

			if (repaired != null && repaired != data && this.isFileDataLoadable(repaired))
			{
				repair = {type: 'repair', label: mxResources.get('openRepairedCopy'),
					description: mxResources.get('recoveryRepairedDesc'), data: repaired, lossy: true};
			}
		}
		catch (e)
		{
			// ignore, no repair candidate
		}

		var done = mxUtils.bind(this, function(version)
		{
			var candidates = [];

			// Lossless prior-good version first, lossy repair last
			if (version != null && version.data != null)
			{
				candidates.push(version);
			}

			if (repair != null)
			{
				candidates.push(repair);
			}

			callback(candidates);
		});

		// Asks the file for a prior known-good version (backup / cloud revision)
		if (file != null && typeof file.getRecoveryVersion === 'function')
		{
			file.getRecoveryVersion(mxUtils.bind(this, function(version)
			{
				done(version);
			}), mxUtils.bind(this, function()
			{
				done(null);
			}));
		}
		else
		{
			done(null);
		}
	};

	/**
	 * Opens a recovery candidate as a new unsaved copy and marks it modified so
	 * the unsaved status prompts the user to save it. The original file is never
	 * overwritten (the copy is a temp LocalFile with no fileObject/handle).
	 */
	EditorUi.prototype.openRecoveredCopy = function(candidate, title)
	{
		var tempFile = new LocalFile(this, candidate.data,
			mxResources.get('copyOf', [title || this.defaultFilename]), true);

		if (this.fileLoaded(tempFile))
		{
			tempFile.fileChanged();
		}
	};

	/**
	 * Shows the recovery chooser for the given candidates (2 or more). Selecting
	 * a candidate opens it as an unsaved copy via openRecoveredCopy.
	 */
	EditorUi.prototype.showRecoveryDialog = function(candidates, title)
	{
		var dlg = new RecoveryDialog(this, candidates, mxUtils.bind(this, function(candidate)
		{
			this.hideDialog();
			this.openRecoveredCopy(candidate, title);
		}), mxUtils.bind(this, function()
		{
			this.hideDialog();
		}));

		this.showDialog(dlg.container, 380, null, true, true);
	};

	/**
	 * Formats a revision timestamp for a recovery label, or returns null if the
	 * timestamp is invalid (workaround for negative timestamps in Dropbox).
	 */
	EditorUi.prototype.formatRecoveryDate = function(modifiedDate)
	{
		var ts = new Date(modifiedDate);

		return (!isNaN(ts.getTime()) && ts.getTime() >= 0) ? ts.toLocaleString() : null;
	};

	/**
	 *
	 */
	EditorUi.prototype.replaceFileData = function(data, patches)
	{
		EditorUi.debug('EditorUi.replaceFileData', [this],
			'data', [data], 'patches', patches);
		
		data = this.validateFileData(data);
		var node = (data != null && data.length > 0) ? mxUtils.parseXml(data).documentElement : null;

		// Some nodes must be extracted here to find the mxfile node
		// LATER: Remove duplicate call to extractGraphModel in overridden setGraphXml
		var tmp = (node != null) ? this.editor.extractGraphModel(node, true) : null;
		
		if (tmp != null)
		{
			node = tmp;
		}

		if (node != null)
		{
			var graph = this.editor.graph;
			
			graph.model.beginUpdate();
			try
			{
				var oldPages = (this.pages != null) ? this.pages.slice() : null;
				var nodes = node.getElementsByTagName('diagram');

				if (nodes.length > 1 || (nodes.length == 1 && nodes[0].hasAttribute('name')))
				{
					this.fileNode = node;
					graph.defaultExportLinkTarget = node.getAttribute('linkTarget');
					this.pages = (this.pages != null) ? this.pages : [];
					
					// Wraps page nodes
					for (var i = nodes.length - 1; i >= 0; i--)
					{
						var page = this.updatePageRoot(new DiagramPage(nodes[i]));
						
						// Checks for invalid page names
						if (page.getName() == null)
						{
							page.setName(mxResources.get('pageWithNumber', [i + 1]));
						}

						graph.model.execute(new ChangePage(this, page, (i == 0) ? page : null, 0));
					}
				}
				else
				{
					// Creates tabbed file structure if enforced by URL
					if (this.fileNode == null)
					{
						this.fileNode = node.ownerDocument.createElement('mxfile');
						this.currentPage = new DiagramPage(node.ownerDocument.createElement('diagram'));
						this.currentPage.setName(mxResources.get('pageWithNumber', [1]));
						graph.model.execute(new ChangePage(this, this.currentPage, this.currentPage, 0));
					}
					
					// Avoids scroll offset when switching page
					this.editor.setGraphXml(node);
					
					// Avoids duplicate parsing of the XML stored in the node
					if (this.currentPage != null)
					{
						this.currentPage.root = this.editor.graph.model.root;
						graph.model.execute(new ChangePage(this, this.currentPage, this.currentPage, 0));
					}
				}
				
				// Removes old pages
				if (oldPages != null)
				{
					for (var i = 0; i < oldPages.length; i++)
					{
						graph.model.execute(new ChangePage(this, oldPages[i], null));
					}
				}
				
				// Updates internal sync state for current file
				var file = this.getCurrentFile();

				if (file != null)
				{
					file.fileReplaced(patches);
				}
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createFileData = function(node, graph, file, url, forceXml, forceSvg, forceHtml,
		embeddedCallback, ignoreSelection, compact, uncompressed, scale, border)
	{
		graph = (graph != null) ? graph : this.editor.graph;
		forceXml = (forceXml != null) ? forceXml : false;
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		compact = (compact != null) ? compact : this.defaultCompact;
		uncompressed = (uncompressed != null) ? uncompressed : !Editor.defaultCompressed;
		
		var editLink = null;
		var redirect = null;
		
		if (file == null || file.getMode() == App.MODE_DEVICE || file.getMode() == App.MODE_BROWSER)
		{
			editLink = '_blank';
		}
		else
		{
			editLink = url;
			redirect = editLink;
		}

		if (node == null)
		{
			return '';
		}
		else
		{
			var fileNode = node;
	
			// Ignores case for possible HTML or XML nodes
			if (fileNode.nodeName.toLowerCase() != 'mxfile')
			{
				if (uncompressed)
				{
					var diagramNode = node.ownerDocument.createElement('diagram');
					diagramNode.setAttribute('name', mxResources.get('pageWithNumber', [1]));
					diagramNode.setAttribute('id', Editor.guid());
					diagramNode.appendChild(node);
					
					fileNode = node.ownerDocument.createElement('mxfile');
					fileNode.appendChild(diagramNode);
				}
				else
				{
					// Removes control chars in input for correct roundtrip check
					var text = Graph.zapGremlins(mxUtils.getXml(node));
					var data = Graph.compress(text);
					
					// Fallback to plain XML for invalid compression
					// TODO: Remove this fallback with active pages
					if (Graph.decompress(data) != text)
					{
						return text;
					}
					else
					{
						var diagramNode = node.ownerDocument.createElement('diagram');
						diagramNode.setAttribute('name', mxResources.get('pageWithNumber', [1]));
						diagramNode.setAttribute('id', Editor.guid());
						mxUtils.setTextContent(diagramNode, data);
						
						fileNode = node.ownerDocument.createElement('mxfile');
						fileNode.appendChild(diagramNode);
					}
				}
			}
			
			if (!compact)
			{
				// Removes old metadata
				fileNode.removeAttribute('userAgent');
				fileNode.removeAttribute('modified');
				fileNode.removeAttribute('version');
				fileNode.removeAttribute('editor');
				fileNode.removeAttribute('pages');
				fileNode.removeAttribute('type');
				fileNode.removeAttribute('etag');
				
				if (mxClient.IS_CHROMEAPP)
				{
					fileNode.setAttribute('host', 'Chrome');
				}
				else if (EditorUi.isElectronApp)
				{
					fileNode.setAttribute('host', 'Electron');
				}
				else
				{
					fileNode.setAttribute('host', window.location.hostname);
				}
				
				if (fileNode.getElementsByTagName('diagram').length > 1 && this.pages != null)
				{
					fileNode.setAttribute('pages', this.pages.length);
				}
			}
			else
			{
				fileNode = fileNode.cloneNode(true);
				fileNode.removeAttribute('modified');
				fileNode.removeAttribute('host');
				fileNode.removeAttribute('agent');
				fileNode.removeAttribute('etag');
				fileNode.removeAttribute('userAgent');
				fileNode.removeAttribute('version');
				fileNode.removeAttribute('editor');
				fileNode.removeAttribute('type');
			}

			if (scale != null)
			{
				fileNode = fileNode.cloneNode(true);
				fileNode.setAttribute('scale', scale);
			}

			if (border != null)
			{
				fileNode = fileNode.cloneNode(true);
				fileNode.setAttribute('border', border);
			}

			var xml = (uncompressed) ? mxUtils.getPrettyXml(fileNode) : mxUtils.getXml(fileNode);
			
			// Writes the file as an embedded HTML file
			if (!forceSvg && !forceXml && (forceHtml || (file != null && /(\.html)$/i.test(file.getTitle()))))
			{
				xml = this.getHtml2(mxUtils.getXml(fileNode), graph, (file != null) ? file.getTitle() : null, editLink, redirect);
			}
			// Maps the XML data to the content attribute in the SVG node 
			else if (forceSvg || (!forceXml && file != null && /(\.svg)$/i.test(file.getTitle())))
			{
				if (file != null && (file.getMode() == App.MODE_DEVICE || file.getMode() == App.MODE_BROWSER))
				{
					url = null;
				}

				var props = this.getSvgFileProperties(fileNode);

				xml = this.getEmbeddedSvg(xml, graph, url, null, embeddedCallback, ignoreSelection,
					redirect, null, null, props.scale, props.border, null, Editor.svgFileTheme);
			}
			
			return xml;
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getXmlFileData = function(ignoreSelection, currentPage, uncompressed, resolveReferences)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		currentPage = (currentPage != null) ? currentPage : false;
		uncompressed = (uncompressed != null) ? uncompressed : !Editor.defaultCompressed;
		
		// Generats graph model XML node for single page export
		var node = this.editor.getGraphXml(ignoreSelection, resolveReferences);
		
		if (ignoreSelection && this.fileNode != null && this.currentPage != null)
		{
			// Updates current page XML if selection is ignored
			EditorUi.removeChildNodes(this.currentPage.node);
			this.currentPage.node.appendChild(node);
			
			// Creates a clone of the file node for processing
			node = this.fileNode.cloneNode(false);

			// Appends the node of the page and applies compression
			function appendPage(pageNode)
			{
				var models = pageNode.getElementsByTagName('mxGraphModel');
				var modelNode = (models.length > 0) ? models[0] : null;
				var clone = pageNode;
				
				if (modelNode == null && uncompressed)
				{
					var text = mxUtils.getNodeValue(pageNode);
					
					if (text.length > 0)
					{
						var tmp = Graph.decompress(text);
						
						if (tmp != null && tmp.length > 0)
						{
							clone = pageNode.cloneNode(false);
							clone.appendChild(mxUtils.parseXml(tmp).documentElement);
						}
					}
				}
				else if (modelNode != null && !uncompressed)
				{
					clone = pageNode.cloneNode(false);
					mxUtils.setTextContent(clone, Graph.compressNode(modelNode));
				}
				else
				{
					clone = pageNode.cloneNode(true);
				}
				
				node.appendChild(clone);
			};

			if (currentPage)
			{
				appendPage(this.currentPage.node);
			}
			else
			{
				// Restores order of pages
				for (var i = 0; i < this.pages.length; i++)
				{
					var page = this.pages[i];
					var currNode = page.node;

					if (page != this.currentPage)
					{
						if (page.needsUpdate)
						{
							var enc = new mxCodec(mxUtils.createXmlDocument());
							var temp = enc.encode(new mxGraphModel(page.root));
							this.editor.graph.saveViewState(page.viewState,
								temp, null, resolveReferences);
							EditorUi.removeChildNodes(currNode);
							currNode.appendChild(temp);

							// Marks the page as up-to-date
							delete page.needsUpdate;
						}
						else if (resolveReferences)
						{
							this.updatePageRoot(page);
							
							// Updates the page node and background page
							if (page.viewState.backgroundImage != null &&
								page.viewState.backgroundImage.originalSrc != null)
							{
								var enc = new mxCodec(mxUtils.createXmlDocument());
								var temp = enc.encode(new mxGraphModel(page.root));
								this.editor.graph.saveViewState(page.viewState,
									temp, null, resolveReferences, page);
								currNode = currNode.cloneNode(false);
								currNode.appendChild(temp);
							}
						}
					}
					
					appendPage(currNode);
				}
			}
		}
		
		return node;
	};
	
	/**
	 * Removes any values, styles and geometries from the given XML node.
	 */
	EditorUi.prototype.anonymizeString = function(text, zeros)
	{
		var result = [];
		
		for (var i = 0; i < text.length; i++)
		{
			var c = text.charAt(i);
			
			if (EditorUi.ignoredAnonymizedChars.indexOf(c) >= 0)
			{
				result.push(c);
			}
			else if (!isNaN(parseInt(c)))
			{
				result.push((zeros) ? '0' : Math.round(Math.random() * 9));
			}
			else if (c.toLowerCase() != c)
			{
				result.push(String.fromCharCode(65 + Math.round(Math.random() * 25)));
			}
			else if (c.toUpperCase() != c)
			{
				result.push(String.fromCharCode(97 + Math.round(Math.random() * 25)));
			}
			else if (/\s/.test(c))
			{
				/* any whitespace */
				result.push(' ');
			}
			else
			{
				result.push('?');
			}
		}
		
		return result.join('');
	};
	
	/**
	 * Returns an anonymized copy of the given diagram XML string. Walks the
	 * parsed DOM and anonymizes cell labels (including HTML labels), user
	 * object attributes and page names via {@link #anonymizeString}.
	 */
	EditorUi.prototype.anonymizeXml = function(xml)
	{
		var ui = this;
		var sanitizer = document.createElement('div');

		function anonymizeAttr(elt, name, htmlAware)
		{
			if (elt.hasAttribute(name))
			{
				var value = elt.getAttribute(name);

				if (value != null && value.length > 0)
				{
					if (htmlAware && value.indexOf('<') >= 0)
					{
						sanitizer.innerHTML = Graph.sanitizeHtml(value);
						anonymizeText(sanitizer);
						value = sanitizer.innerHTML;
					}
					else
					{
						value = ui.anonymizeString(value);
					}

					elt.setAttribute(name, value);
				}
			}
		};

		function anonymizeText(node)
		{
			if (node.nodeValue != null)
			{
				node.nodeValue = ui.anonymizeString(node.nodeValue);
			}

			if (node.nodeType == mxConstants.NODETYPE_ELEMENT)
			{
				var tmp = node.firstChild;

				while (tmp != null)
				{
					anonymizeText(tmp);
					tmp = tmp.nextSibling;
				}
			}
		};

		function anonymizeNode(node)
		{
			if (node.nodeType == mxConstants.NODETYPE_ELEMENT)
			{
				if (node.nodeName == 'mxCell')
				{
					anonymizeAttr(node, 'value', true);
				}
				else if (node.nodeName == 'object' || node.nodeName == 'UserObject')
				{
					for (var i = 0; i < node.attributes.length; i++)
					{
						var attr = node.attributes[i];

						if (attr.name != 'id' && attr.name != 'style' &&
							attr.name != 'placeholders' && attr.name != 'vertex' &&
							attr.name != 'edge' && attr.name != 'parent' &&
							attr.name != 'connectable' && attr.name != 'visible' &&
							attr.name != 'collapsed' && attr.name != 'source' &&
							attr.name != 'target')
						{
							attr.value = ui.anonymizeString(attr.value);
						}
					}
				}
				else if (node.nodeName == 'diagram')
				{
					anonymizeAttr(node, 'name', false);
				}

				var tmp = node.firstChild;

				while (tmp != null)
				{
					anonymizeNode(tmp);
					tmp = tmp.nextSibling;
				}
			}
		};

		var doc = mxUtils.parseXml(xml);
		anonymizeNode(doc.documentElement);

		return mxUtils.getPrettyXml(doc.documentElement);
	};

	/**
	 * Removes any values, styles and geometries from the given XML node.
	 */
	EditorUi.prototype.anonymizePatch = function(patch)
	{
		patch = mxUtils.clone(patch);

		if (patch[EditorUi.DIFF_INSERT] != null)
		{
			for (var i = 0; i < patch[EditorUi.DIFF_INSERT].length; i++)
			{
				try
				{
					var data = patch[EditorUi.DIFF_INSERT][i].data;
					var doc = mxUtils.parseXml(data);
					var clone = doc.documentElement.cloneNode(false);
					
					if (clone.getAttribute('name') != null)
					{
						clone.setAttribute('name', this.anonymizeString(clone.getAttribute('name')));
					}
					
					patch[EditorUi.DIFF_INSERT][i].data = mxUtils.getXml(clone);
				}
				catch (e)
				{
					patch[EditorUi.DIFF_INSERT][i].data = e.message;
				}
			}
		}
		
		if (patch[EditorUi.DIFF_UPDATE] != null)
		{
			for (var pageId in patch[EditorUi.DIFF_UPDATE])
			{
				var diff = patch[EditorUi.DIFF_UPDATE][pageId];
				
				if (diff.name != null)
				{
					diff.name = this.anonymizeString(diff.name);
				}
				
				if (diff.cells != null)
				{
					var anonymizeCellDiffs = mxUtils.bind(this, function(key)
					{
						var cellDiffs = diff.cells[key];
						
						if (cellDiffs != null)
						{
							for (var cellId in cellDiffs)
							{
								if (cellDiffs[cellId].value != null)
								{
									cellDiffs[cellId].value = '[' +
										cellDiffs[cellId].value.length + ']';
								}

								if (cellDiffs[cellId].xmlValue != null)
								{
									cellDiffs[cellId].xmlValue = '[' +
										cellDiffs[cellId].xmlValue.length + ']';
								}
								
								if (cellDiffs[cellId].style != null)
								{
									cellDiffs[cellId].style = '[' +
										cellDiffs[cellId].style.length + ']';
								}
								
								if (mxUtils.isEmptyObject(cellDiffs[cellId]))
								{
									delete cellDiffs[cellId];
								}
							}
							
							if (mxUtils.isEmptyObject(cellDiffs))
							{
								delete diff.cells[key];
							}
						}
					});
					
					anonymizeCellDiffs(EditorUi.DIFF_INSERT);
					anonymizeCellDiffs(EditorUi.DIFF_UPDATE);
					
					if (mxUtils.isEmptyObject(diff.cells))
					{
						delete diff.cells;
					}
				}
	
				if (mxUtils.isEmptyObject(diff))
				{
					delete patch[EditorUi.DIFF_UPDATE][pageId];
				}
			}
			
			if (mxUtils.isEmptyObject(patch[EditorUi.DIFF_UPDATE]))
			{
				delete patch[EditorUi.DIFF_UPDATE];
			}
		}
			
		return patch;
	};

	/**
	 * Removes any values, styles and geometries from the given XML node.
	 */
	EditorUi.prototype.anonymizeAttributes = function(node, zeros)
	{
		if (node.attributes != null)
		{
			for (var i = 0; i < node.attributes.length; i++)
			{
				if (node.attributes[i].name != 'as')
				{
					node.setAttribute(node.attributes[i].name,
						this.anonymizeString(node.attributes[i].value, zeros));
				}
			}
		}
		
		if (node.childNodes != null)
		{
			for (var i = 0; i < node.childNodes.length; i++)
			{
				this.anonymizeAttributes(node.childNodes[i], zeros);
			}
		}
	};
	
	/**
	 * Removes any values, styles and geometries from the given XML node.
	 */
	EditorUi.prototype.anonymizeNode = function(node, zeros)
	{
		var nodes = node.getElementsByTagName('mxCell');
		
		for (var i = 0; i < nodes.length; i++)
		{
			if (nodes[i].getAttribute('value') != null)
			{
				nodes[i].setAttribute('value', '[' + nodes[i].getAttribute('value').length + ']');
			}

			if (nodes[i].getAttribute('xmlValue') != null)
			{
				nodes[i].setAttribute('xmlValue', '[' + nodes[i].getAttribute('xmlValue').length + ']');
			}
			
			if (nodes[i].getAttribute('style') != null)
			{
				nodes[i].setAttribute('style', '[' + nodes[i].getAttribute('style').length + ']');
			}
			
			if (nodes[i].parentNode != null && nodes[i].parentNode.nodeName != 'root' &&
				nodes[i].parentNode.parentNode != null)
			{
				nodes[i].setAttribute('id', nodes[i].parentNode.getAttribute('id'));
				nodes[i].parentNode.parentNode.replaceChild(nodes[i], nodes[i].parentNode);
			}
		}
		
		return node;
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.synchronizeCurrentFile = function(forceReload)
	{
		var currentFile = this.getCurrentFile();
		
		if (currentFile != null)
		{
			if (currentFile.savingFile)
			{
				this.handleError({message: mxResources.get('busy')});
			}
			else if (!forceReload && currentFile.invalidChecksum)
			{
				currentFile.handleFileError(null, true);
			}
			else if (this.spinner.spin(document.body, mxResources.get('updatingDocument')))
			{
				currentFile.clearAutosave();
				this.clearStatus();
				
				if (forceReload)
				{
					currentFile.reloadFile(mxUtils.bind(this, function()
					{
						this.spinner.stop();
						currentFile.handleFileSuccess(DrawioFile.SYNC == 'manual');
					}), mxUtils.bind(this, function(err)
					{
						this.spinner.stop();
						currentFile.handleFileError(err, true);
					}));
				}
				else
				{
					currentFile.synchronizeFile(mxUtils.bind(this, function()
					{
						currentFile.handleFileSuccess(DrawioFile.SYNC == 'manual');
					}), mxUtils.bind(this, function(err)
					{
						currentFile.handleFileError(err, true);
					}));
				}
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getFileData = function(forceXml, forceSvg, forceHtml, embeddedCallback,
		ignoreSelection, currentPage, node, compact, file, uncompressed, resolveReferences,
		scale, border)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		currentPage = (currentPage != null) ? currentPage : false;
		uncompressed = (uncompressed != null) ? uncompressed : !Editor.defaultCompressed;
		var graph = this.editor.graph;
		
		// Forces compression of embedded XML
		if (forceSvg || (!forceXml && file != null && /(\.svg)$/i.test(file.getTitle())))
		{
			// Exports SVG for first page while other page is visible by creating a graph
			// LATER: Add caching for the graph or SVG while not on first page
			// Dark mode requires a refresh that would destroy all handlers
			// LATER: Use dark theme here to bypass refresh
			if (this.pages != null && this.currentPage != this.pages[0])
			{
				var graphGetGlobalVariable = graph.getGlobalVariable;
				graph = this.createTemporaryGraph(graph.getStylesheet());
				graph.setBackgroundImage = this.editor.graph.setBackgroundImage;
				graph.background = this.editor.graph.background;
				var page = (this.pages != null) ? this.pages[0] : null;;

				if (page == null || this.currentPage == page)
				{
					graph.setBackgroundImage(this.editor.graph.backgroundImage);	
				}
				else if (page.viewState != null && page.viewState != null)
				{
					graph.setBackgroundImage(page.viewState.backgroundImage);
				}

				graph.getGlobalVariable = function(name)
				{
					if (name == 'page' && page != null)
					{
						return page.getName();
					}
					else if (name == 'pagenumber')
					{
						return 1;
					}
					
					return graphGetGlobalVariable.apply(this, arguments);
				};
		
				document.body.appendChild(graph.container);

				if (page != null)
				{
					graph.model.setRoot(page.root);
				}
			}
		}

		node = (node != null) ? node : this.getXmlFileData(ignoreSelection,
			currentPage, uncompressed, resolveReferences);
		file = (file != null) ? file : this.getCurrentFile();

		var result = this.createFileData(node, graph, file, window.location.href,
			forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection, compact,
			uncompressed, scale, border);
		
		// Removes temporary graph from DOM
		if (graph != this.editor.graph)
		{
			graph.container.parentNode.removeChild(graph.container);
		}
		
		return result;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.getHtml = function(node, graph, title, editLink, redirect, ignoreSelection)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		var bg = null;
		var js = EditorUi.drawHost + '/js/embed-static.min.js';
	
		// LATER: Merge common code with EmbedDialog
		if (graph != null)
		{
			var bounds = (ignoreSelection) ? graph.getGraphBounds() :
				graph.getBoundingBox(graph.getSelectionCells());
			var scale = graph.view.scale;
			var x0 = Math.floor(bounds.x / scale - graph.view.translate.x);
			var y0 = Math.floor(bounds.y / scale - graph.view.translate.y);
			bg = graph.background;
	
			// Embed script only used if no redirect
			if (redirect == null)
			{
				var s = this.getBasenames().join(';');
	
				if (s.length > 0)
				{
					js = EditorUi.drawHost + '/embed.js?s=' + s;
				}
			}
			
			// Adds embed attributes
			node.setAttribute('x0', x0);
			node.setAttribute('y0', y0);
		}
		
		if (node != null)
		{
			node.setAttribute('pan', '1');
			node.setAttribute('zoom', '1');
			node.setAttribute('resize', '0');
			node.setAttribute('fit', '0');
			node.setAttribute('border', '20');
			
			// Hidden attributes
			node.setAttribute('links', '1');
			
			if (editLink != null)
			{
				node.setAttribute('edit', editLink);
			}
		}
		
		// Makes XHTML compatible
		if (redirect != null)
		{
			redirect = redirect.replace(/&/g, '&amp;');
		}
	
		// Removes control chars in input for correct roundtrip check
		var text = (node != null) ? Graph.zapGremlins(mxUtils.getXml(node)) : '';
		
		// Double compression for mxfile not fixed since it may cause imcompatibilites with
		// embed clients that rely on this format. HTML files and export use getHtml2.
		var data = Graph.compress(text);
		
		// Fallback to URI encoded XML for invalid compression
		if (Graph.decompress(data) != text)
		{
			data = encodeURIComponent(text);
		}
		
		var style = 'position:relative;overflow:auto;width:100%;';
	
		return ((redirect == null) ? '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' : '') +
			'<!DOCTYPE html>\n<html' + ((redirect != null) ? ' xmlns="http://www.w3.org/1999/xhtml">' : '>') +
			'\n<head>\n' + ((redirect == null) ? ((title != null) ? '<title>' + mxUtils.htmlEntities(title) +
				'</title>\n' : '') : '<title>draw.io</title>\n') +
			((redirect != null) ? '<meta http-equiv="refresh" content="0;URL=\'' + redirect + '\'"/>\n' : '') +
			'</head>\n<body' +
			(((redirect == null && bg != null && bg != mxConstants.NONE) ? ' style="background-color:' + bg + ';">' : '>')) +
			'\n<div class="mxgraph" style="' + style + '">\n' +
			'<div style="width:1px;height:1px;overflow:hidden;">' + data + '</div>\n</div>\n' +
			((redirect == null) ? '<script type="text/javascript" src="' + js + '"></script>' :
			'<a style="position:absolute;top:50%;left:50%;margin-top:-128px;margin-left:-64px;" ' +
			'href="' + redirect + '" target="_blank"><img border="0" ' +
			'src="' + EditorUi.drawHost + '/images/drawlogo128.png"/></a>') +
			'\n</body>\n</html>\n';
	};
	
	/**
	 * Same as above but using the new embed code.
	 */
	EditorUi.prototype.getHtml2 = function(xml, graph, title, editLink, redirect)
	{
		var js = window.DRAWIO_VIEWER_URL || EditorUi.drawHost + '/js/viewer-static.min.js';
	
		// Makes XHTML compatible
		if (redirect != null)
		{
			redirect = redirect.replace(/&/g, '&amp;');
		}
		
		var data = {highlight: '#0000ff', nav: this.editor.graph.foldingEnabled, resize: true,
			xml: Graph.zapGremlins(xml), toolbar: 'pages zoom layers lightbox'};
		
		if (this.pages != null && this.currentPage != null)
		{
			data.page = mxUtils.indexOf(this.pages, this.currentPage);
		}
	
		var style = 'max-width:100%;border:1px solid transparent;';
	
		return ((redirect == null) ? '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' : '') +
			'<!DOCTYPE html>\n<html' + ((redirect != null) ? ' xmlns="http://www.w3.org/1999/xhtml">' : '>') +
			'\n<head>\n' + ((redirect == null) ? ((title != null) ? '<title>' + mxUtils.htmlEntities(title) +
				'</title>\n' : '') : '<title>draw.io</title>\n') +
			((redirect != null) ? '<meta http-equiv="refresh" content="0;URL=\'' + redirect + '\'"/>\n' : '') +
			'<meta charset="utf-8"/>\n</head>\n<body>' +
			'\n<div class="mxgraph" style="' + style + '" data-mxgraph="' + mxUtils.htmlEntities(JSON.stringify(data)) + '"></div>\n' +
			((redirect == null) ? '<script type="text/javascript" src="' + js + '"></script>' :
			'<a style="position:absolute;top:50%;left:50%;margin-top:-128px;margin-left:-64px;" ' +
			'href="' + redirect + '" target="_blank"><img border="0" ' +
			'src="' + EditorUi.drawHost + '/images/drawlogo128.png"/></a>') +
			'\n</body>\n</html>\n';
	};

	/**
	 * Parses and caches file-level variables from the fileNode.
	 * Re-parses only when the raw attribute string has changed.
	 */
	EditorUi.prototype.updateFileVars = function()
	{
		var varsStr = (this.fileNode != null) ?
			this.fileNode.getAttribute('vars') : null;

		if (varsStr !== this.fileVarsStr)
		{
			this.fileVarsStr = varsStr;
			this.fileVars = null;

			if (varsStr != null && varsStr.length > 0)
			{
				try
				{
					this.fileVars = JSON.parse(varsStr);
				}
				catch (e)
				{
					// ignore
				}
			}
		}
	};

	/**
	 *
	 */
	EditorUi.prototype.setFileData = function(data, file)
	{
		data = this.validateFileData(data);
		this.currentPage = null;
		this.fileNode = null;
		this.pages = null;

		var node = (data != null && data.length > 0) ? mxUtils.parseXml(data).documentElement : null;
		
		// Checks for parser errors
		var cause = Editor.extractParserError(node, mxResources.get('invalidOrMissingFile'));
		
		if (cause)
		{
			EditorUi.debug('EditorUi.setFileData ParserError', [this],
				'data', [data], 'node', [node], 'cause', [cause]);

			throw new Error(mxResources.get('notADiagramFile') + ' (' + cause + ')');
		}
		else
		{
			// Some nodes must be extracted here to find the mxfile node
			// LATER: Remove duplicate call to extractGraphModel in overridden setGraphXml
			var tmp = (node != null) ? this.editor.extractGraphModel(node, true) : null;
			
			if (tmp != null)
			{
				node = tmp;
			}

			if (node != null && node.nodeName == 'mxfile')
			{
				var nodes = node.getElementsByTagName('diagram');

				// Checks for duplicate page IDs
				var pages = {};

				if (nodes.length > 0)
				{
					var hashObj = this.getHashObject();
					// this.fileStats(file, node);
					var selectedPage = null;
					this.fileNode = node;
					this.editor.graph.defaultExportLinkTarget = node.getAttribute('linkTarget');
					this.pages = [];

					// Wraps page nodes
					for (var i = 0; i < nodes.length; i++)
					{
						// Adds page ID based on page order to match
						// remote IDs given if IDs are missing here
						if (nodes[i].getAttribute('id') == null)
						{
							nodes[i].setAttribute('id', i);
						}
						
						var page = new DiagramPage(nodes[i]);
						
						// Checks for invalid page names
						if (page.getName() == null)
						{
							page.setName(mxResources.get('pageWithNumber', [i + 1]));
						}
						
						this.pages.push(page);
						
						if ((hashObj.pageId == null && urlParams['page-id'] != null &&
								page.getId() == urlParams['page-id']) ||
							(hashObj.pageId != null && page.getId() == hashObj.pageId))
						{
							selectedPage = page;
						}

						if (pages[page.getId()] == null)
						{
							pages[page.getId()] = page;
						}
						else
						{
							throw new Error(page.getId() + ': Duplicate page ID');
						}
					}
					
					this.currentPage = (selectedPage != null) ? selectedPage :
						this.pages[Math.max(0, Math.min(this.pages.length - 1, urlParams['page'] || 0))];
					node = this.currentPage.node;
				}
			}
			
			// Creates tabbed file structure if enforced by URL
			if (this.fileNode == null && node != null)
			{
				this.fileNode = node.ownerDocument.createElement('mxfile');
				this.currentPage = new DiagramPage(node.ownerDocument.createElement('diagram'));
				this.currentPage.setName(mxResources.get('pageWithNumber', [1]));
		 	 	this.pages = [this.currentPage];
			}
			
			// Avoids scroll offset when switching page
			this.editor.setGraphXml(node);
			
			// Avoids duplicate parsing of the XML stored in the node
			if (this.currentPage != null)
			{
				this.currentPage.root = this.editor.graph.model.root;

				// Resets initial modified state
				this.currentPage.setDiagramModified(false);
				
				// Scrolls to current page
				this.scrollToPage();
			}
			
			if (urlParams['layer-ids'] != null)
			{
				try
				{
					var layerIds = decodeURIComponent(urlParams['layer-ids']).split(' ');
					var layerIdsMap = {};
					
					for (var i = 0; i < layerIds.length; i++)
					{
						layerIdsMap[layerIds[i]] = true;
					}
					
					var model = this.editor.graph.getModel();
					var children = model.getChildren(model.root);
					
					// handle layers visibility
					for (var i = 0; i < children.length; i++)
					{
						var child = children[i];
						model.setVisible(child, layerIdsMap[child.id] || false);
					}
				}
				catch(e){} //ignore
			}
		}
	};

	/**
	 * Stats for file size.
	 */
	EditorUi.prototype.fileStats = function(file, node)
	{
		try
		{
			if (file != null && file.getSize() > 500000 && file.getHash() !== '' &&
				this.getServiceName() == 'draw.io')
			{
				var nodes = node.getElementsByTagName('diagram');

				var stats = {};
				stats.modified = file.getLastModifiedDate();
				stats.fileMode = file.getMode();
				stats.fileSize = file.getSize();
				stats.fileHash = file.getHash();
				stats.pages = nodes.length;
				stats.redundantStencils = 0;
				stats.redundantImages = 0;
				stats.redundantSize = 0;
				stats.stencils = 0;
				stats.images = 0;
				stats.cells = 0;
				
				for (var i = 0; i < nodes.length; i++)
				{
					var cells = nodes[i].getElementsByTagName('mxCell');
					stats.cells += cells.length;
					var defsCount = {};

					for (var j = 0; j < cells.length; j++)
					{
						var style = cells[j].getAttribute('style');

						// Parses the style of each mxCell object and count
						// total use of data URIs in images and stencils
						if (style != null)
						{
							var styleEntries = style.split(';');

							for (var k = 0; k < styleEntries.length; k++)
							{
								var entry = styleEntries[k];

								if (entry.startsWith('image=data:') ||
									entry.startsWith('shape=stencil('))
								{
									if (defsCount[entry] == null)
									{
										defsCount[entry] = 1;
									}
									else
									{
										defsCount[entry]++;
									}
								}
							}
						}
					}

					// Statistics on data URI definitions
					for (var key in defsCount)
					{
						var count = defsCount[key];
						
						if (key.startsWith('shape=stencil('))
						{
							stats.stencils += count;
						}
						else
						{
							stats.images += count;
						}

						if (count > 1)
						{
							stats.redundantSize += key.length * (count - 1);

							if (key.startsWith('shape=stencil('))
							{
								stats.redundantStencils += (count - 1);
							}
							else
							{
								stats.redundantImages += (count - 1);
							}
						}
					}
				}
				
				EditorUi.logEvent({category: file.getMode().toUpperCase() +
					'-FILE-STATS-' + file.getHash(), action: 'size_' + file.getSize(),
					label: JSON.stringify(stats)});
			}
		}
		catch (e)
		{
			// ignore
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getBaseFilename = function(ignorePageName)
	{
		var file = this.getCurrentFile();
		var basename = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		
		if (/(\.xml)$/i.test(basename) || /(\.html)$/i.test(basename) ||
			/(\.svg)$/i.test(basename) || /(\.png)$/i.test(basename))
		{
			basename = basename.substring(0, basename.lastIndexOf('.'));
		}
		
		if (/(\.drawio)$/i.test(basename))
		{
			basename = basename.substring(0, basename.lastIndexOf('.'));
		}

		if (!ignorePageName && this.pages != null && this.pages.length > 1 &&
			this.currentPage != null && this.currentPage.node.getAttribute('name') != null &&
			this.currentPage.getName().length > 0)
		{
			basename = basename + '-' + this.currentPage.getName();
		}
		
		return basename;
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.downloadFile = function(format, uncompressed, addShadow, ignoreSelection,
		currentPage, pageVisible, transparent, scale, border, grid, includeXml, pageRange, margin,
		fit, sheetsAcross, sheetsDown, shadows)
	{
		try
		{
			ignoreSelection = (ignoreSelection != null) ? ignoreSelection : this.editor.graph.isSelectionEmpty();
			var basename = this.getBaseFilename(!currentPage);
			var filename = basename + ((format == 'xml' || (format == 'pdf' &&
				includeXml)) ? '.drawio' : '') + '.' + format;
			
			if (format == 'xml')
			{
		    	var data = Graph.xmlDeclaration +'\n' +
		    		this.getFileData(true, null, null, null, ignoreSelection, currentPage,
		    			null, null, null, uncompressed);
		    	
		    	this.saveData(filename, format, data, 'text/xml');
			}
		    else if (format == 'html')
		    {
		    	var data = this.getHtml2(this.getFileData(true), this.editor.graph, basename);
		    	this.saveData(filename, format, data, 'text/html');
		    }
		    else if ((format == 'svg' || format == 'xmlsvg') && this.spinner.spin(document.body, mxResources.get('export')))
		    {
		    	var svg = null;
		    	
		    	var saveSvg = mxUtils.bind(this, function(data)
		    	{
		    		if (data.length <= MAX_REQUEST_SIZE)
		    		{
		    	    	this.saveData(filename, 'svg', data, 'image/svg+xml');
		    		}
		    		else
		    		{
		    			this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'), mxUtils.bind(this, function()
		    			{
		    				mxUtils.popup(svg);
		    			}));
		    		}
		    	});
		    	
		    	if (format == 'svg')
		    	{
		        	var bg = this.editor.graph.background;
		        	
		        	if (transparent || bg == mxConstants.NONE)
		        	{
		        		bg = null;
		        	}
		
		        	// Sets or disables alternate text for foreignObjects. Disabling is needed
		        	// because PhantomJS seems to ignore switch statements and paint all text.
		        	var svgRoot = this.editor.graph.getSvg(bg, null, null, null, null, ignoreSelection);
					
					if (addShadow)
					{
						this.editor.graph.addSvgShadow(svgRoot);
					}
					
					// Embeds the images in the SVG output (async)
					this.editor.convertImages(svgRoot, mxUtils.bind(this, mxUtils.bind(this, function(svgRoot2)
					{
						this.spinner.stop();
						
						saveSvg(Graph.xmlDeclaration + '\n' + Graph.svgDoctype + '\n' + mxUtils.getXml(svgRoot2));
					})));
		    	}
		    	else
		    	{
		    		filename = basename + '.svg';
		    		
		    		svg = this.getFileData(false, true, null, mxUtils.bind(this, function(svg)
		    		{
		    			this.spinner.stop();
		        		saveSvg(svg);
		    		}), ignoreSelection);
		    	}
		    }
			else
			{
				var w, h;

				if (format == 'xmlpng')
				{
					filename = basename + '.png';
				}
				else if (format == 'jpeg')
				{
					filename = basename + '.jpg';
				}
				
				if (urlParams['embed'] == '1' && urlParams['proto'] == 'json' && this.embedExportProtocol)
				{
					var parent = this.embedMessageSource || window.opener || window.parent;

					if (this.spinner.spin(document.body, mxResources.get('exporting')))
					{
						var req = this.createDownloadRequest(filename, format, ignoreSelection, '1',
							transparent, currentPage, scale, border, grid, includeXml, pageRange, w, h,
							!pageVisible, margin, fit, sheetsAcross, sheetsDown, shadows);

						req.send(mxUtils.bind(this, function(req)
						{
							this.spinner.stop();

							if (req.getStatus() >= 200 && req.getStatus() <= 299)
							{
								var msg = this.createLoadMessage('export');
								msg.format = format;
								msg.filename = filename;
								msg.data = 'data:application/pdf;base64,' + req.getText();
								msg.xml = this.getFileData(true);
								parent.postMessage(JSON.stringify(msg), '*');
							}
							else
							{
								this.handleError({message: mxResources.get('errorSavingFile')});
							}
						}), mxUtils.bind(this, function()
						{
							this.spinner.stop();
							this.handleError({message: mxResources.get('errorSavingFile')});
						}));
					}
				}
				else
				{
					this.saveRequest(filename, format, mxUtils.bind(this, function(newTitle, base64)
					{
						try
						{
							var req = this.createDownloadRequest(newTitle, format, ignoreSelection, base64,
								transparent, currentPage, scale, border, grid, includeXml, pageRange, w, h,
								!pageVisible, margin, fit, sheetsAcross, sheetsDown, shadows);

							return req;
						}
						catch (e)
						{
							this.handleError(e);
						}
					}));
				}
			}
		}
		catch (e)
		{
			this.handleError(e);
		}
	};
	
	// Note: Remember to adjust ElectronApp override when this function is modified
	EditorUi.prototype.createDownloadRequest = function(filename, format, ignoreSelection, base64,
		transparent, currentPage, scale, border, grid, includeXml, pageRange, w, h, crop, margin,
		fit, sheetsAcross, sheetsDown, shadows)
	{
		var params = this.downloadRequestBuilder(filename, format, ignoreSelection, base64,
			transparent, currentPage, scale, border, grid, includeXml, pageRange, w, h, crop,
			margin, fit, sheetsAcross, sheetsDown, shadows);
		var paramsStr = '';

		for (var p in params)
		{
			var val = params[p];

			if (val != null)
			{
				paramsStr += p + '=' + encodeURIComponent(val) + '&';
			}
		}

		return new mxXmlRequest(EXPORT_URL, paramsStr);
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.downloadRequestBuilder = function(filename, format, ignoreSelection, base64,
		transparent, currentPage, scale, border, grid, includeXml, pageRange, w, h, crop, margin,
		fit, sheetsAcross, sheetsDown, shadows)
	{
		var graph = this.editor.graph;
		var bounds = graph.getGraphBounds();

		// Exports only current page for images that does not contain file data, but for
		// the other formats with XML included or pdf with all pages, we need to send the complete data and use
		// the from/to URL parameters to specify the page to be exported.
		var data = this.getFileData(true, null, null, null, ignoreSelection,
			currentPage == false ? false : format != 'xmlpng', null, null,
			null, !Editor.defaultCompressed, format == 'pdf');
		var from = null, to = null, allPages = null;

		if (!EditorUi.isElectronApp && (bounds.width * bounds.height > MAX_AREA || data.length > MAX_REQUEST_SIZE))
		{
			throw {message: mxResources.get('drawingTooLarge')};
		}
		
		var embed = (includeXml) ? '1' : '0';
       	
		if (format == 'pdf')
		{
			if (pageRange != null)
			{
				from = pageRange.from;
				to = pageRange.to;
			}
			else if (currentPage == false)
			{
				allPages = '1';
			}
		}
		
       	if (format == 'xmlpng')
       	{
       		embed = '1';
       		format = 'png';
		}
		
		if (format == 'xmlpng' || format == 'svg')
		{
       		// Finds the current page number
       		if (this.pages != null && this.currentPage != null)
       		{
       			for (var i = 0; i < this.pages.length; i++)
       			{
       				if (this.pages[i] == this.currentPage)
       				{
       					from = i;
       					break;
       				}
       			}
       		}
       	}
       	
		var bg = graph.background;
		
		if ((format == 'png' || format == 'pdf' || format == 'svg') && transparent)
		{
			bg = mxConstants.NONE;
		}
		else if (!transparent && (bg == null || bg == mxConstants.NONE))
		{
			bg = '#ffffff';
		}
		
		var extras = {globalVars: graph.getExportVariables()};

		if (pageRange != null && pageRange.from != null)
		{
			extras.globalVars['pagenumber'] = pageRange.from + 1;
		}
		
		if (grid)
		{
			extras.grid = {
				size: graph.gridSize,
				steps: graph.view.gridSteps,
				color: (Editor.isDarkMode() && format == 'pdf') ?
					mxGraphView.prototype.defaultGridColor : graph.view.gridColor
			};
		}
		
		if (Graph.translateDiagram)
		{
			extras.diagramLanguage = Graph.diagramLanguage;
		}

		// Passes hidden tags per page to export backend
		var hiddenTagsMap = this.getHiddenTagsMap();

		if (hiddenTagsMap != null)
		{
			extras.hiddenTags = hiddenTagsMap;
		}

		return {
			format: format,
			from: from,
			to: to,
			allPages: allPages,
			bg: ((bg != null) ? bg : mxConstants.NONE),
			base64: base64,
			embedXml: embed,
			xml: data,
			filename: ((filename != null) ? filename : ''),
			extras: JSON.stringify(extras),
			scale: scale,
			border: border,
			pageMargin: margin,
			w: (w && isFinite(w)? w : null),
			h: (h && isFinite(h)? h : null),
			crop: (crop != null && crop) ? '1' : '0',
			fit: (fit != null && fit) ? '1' : '0',
			shadows: (shadows != null && shadows) ? '1' : '0',
			sheetsAcross: sheetsAcross,
			sheetsDown: sheetsDown
		};
	};
	
	/**
	 * Returns a map of page ID to hidden tags array for all pages
	 * that have hidden tags, or null if no tags are hidden.
	 */
	EditorUi.prototype.getHiddenTagsMap = function()
	{
		var graph = this.editor.graph;
		var result = {};
		var hasHiddenTags = false;

		if (this.pages != null)
		{
			for (var i = 0; i < this.pages.length; i++)
			{
				var page = this.pages[i];
				var tags = (page == this.currentPage) ? graph.hiddenTags :
					(page.viewState != null ? page.viewState.hiddenTags : null);

				if (tags != null && tags.length > 0)
				{
					result[page.getId()] = tags;
					hasHiddenTags = true;
				}
			}
		}
		else if (graph.hiddenTags != null && graph.hiddenTags.length > 0)
		{
			result[0] = graph.hiddenTags;
			hasHiddenTags = true;
		}

		return hasHiddenTags ? result : null;
	};

	/**
	 * Translates this point by the given vector.
	 *
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.setMode = function(mode, remember)
	{
		this.mode = mode;
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getDiagramId = function()
	{
		var id = window.location.hash;
		
		// Strips the hash sign
		if (id != null && id.length > 0)
		{
			id = id.substring(1);
		}

		// Removes additional parameters after trailing hash
		if (id != null && id.length > 1)
		{
			var idx = id.indexOf('#');
			
			if (idx >= 0)
			{
				id = id.substring(0, idx);
			}
		}
		
		return id;
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getHashObject = function()
	{
		var id = window.location.hash;
		var result = {};

		if (id != null && id.length > 0)
		{
			var last = id.lastIndexOf('#');

			if (last > 0)
			{
				var temp = decodeURIComponent(id.substring(last + 1));

				try
				{
					result = JSON.parse(temp);
				}
				catch (e)
				{
					// ignore
				}
			}
		}

		return result;
	};

	/**
	 * Updates the hash object with the current page id.
	 */
	EditorUi.prototype.updateHashObject = function()
	{
		if (this.currentFile != null && this.currentPage != null &&
			this.currentFile.getHash() != '')
		{
			var obj = this.getHashObject();
			obj.pageId = this.currentPage.getId();
			this.setHashObject(obj);
		}
		else
		{
			this.setHashObject(null);
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.setHashObject = function(obj)
	{
		if (Editor.enableHashObjects)
		{
			var id = window.location.hash;

			if (id == null || id == '')
			{
				id = '#';
			}

			var last = id.lastIndexOf('#');

			if (last > 0)
			{
				id = id.substring(0, last);
			}
			
			try
			{
				if (obj != null && !mxUtils.isEmptyObject(obj))
				{
					id = id + '#' + encodeURIComponent(JSON.stringify(obj));
				}
			}
			catch (e)
			{
				// ignore
			}
			
			// Adds to browsing history if hash object changed
			if (last > 0 && id.lastIndexOf('#') > 0)
			{
				window.location.hash = id;
			}
			else
			{
				window.location.replace(id);
			}
		}
	};

	/**
	 * Loads the given file descriptor. The descriptor may define the following properties:
	 * 
	 * - url: The url to load the data from (proxy is used if CORS is not enabled)
	 * - data: The data to be inserted. If both, data and url are defined, then the data
	 * is preprendended to the data returned from the given URL.
	 * - format: Currently, only 'csv' is supported as an optional value. Default is XML.
	 * - update: Optional URL to fetch updates from (POST request with the page XML).
	 * - interval: Optional interval for fetching updates. Default is 60000 (60 seconds).
	 */
	EditorUi.prototype.loadDescriptor = function(desc, success, error)
	{
		var hash = window.location.hash;
		
		var loadData = mxUtils.bind(this, function(data)
		{
			var realData = (desc.data != null) ? desc.data : '';
			
			if (data != null && data.length > 0)
			{
				if (realData.length > 0)
				{
					realData += '\n';
				}
				
				realData += data;
			}

			var xml = (desc.format != 'csv' && realData.length > 0) ? realData : this.emptyDiagramXml;
			var tempFile = new LocalFile(this, xml, (urlParams['title'] != null) ?
					decodeURIComponent(urlParams['title']) : this.defaultFilename, true);
			tempFile.getHash = function()
			{
				return hash;
			};
			this.fileLoaded(tempFile);
			
			if (desc.format == 'csv')
			{
				this.importCsv(realData, mxUtils.bind(this, function(cells)
				{
					this.editor.undoManager.clear();
					this.editor.setModified(false);
					this.clearStatus();
				}));
			}
        	
			// Installs updates
			if (desc.update != null)
			{
				var interval = (desc.interval != null) ? parseInt(desc.interval) : 60000;
				var currentThread = null;
				
				var doUpdate = mxUtils.bind(this, function()
				{
					var page = this.currentPage;
					
					mxUtils.post(desc.update, 'xml=' + encodeURIComponent(
						mxUtils.getXml(this.editor.getGraphXml())),
						mxUtils.bind(this, function(req)
					{
						if (page === this.currentPage)
						{
							if (req.getStatus() >= 200 && req.getStatus() <= 300)
							{
								var doc = this.updateDiagram(req.getText());
								schedule();
							}
							else
							{
								this.handleError({message: mxResources.get('error') + ' ' + req.getStatus()});
							}
						}
					}), mxUtils.bind(this, function(err)
					{
						this.handleError(err);
					}));
				});
				
				var schedule = mxUtils.bind(this, function()
				{
					window.clearTimeout(currentThread);
					currentThread = window.setTimeout(doUpdate, interval);
				});
				
				this.editor.addListener('pageSelected', mxUtils.bind(this, function()
				{
					schedule();
					doUpdate();
				}));
				
				schedule();
				doUpdate();
			}
			
    		if (success != null)
    		{
    			success();
    		}
		});
		
		if (desc.url != null && desc.url.length > 0)
		{
			var url = this.editor.getProxiedUrl(desc.url);
			
            // LATER: Remove cache-control header
            this.editor.loadUrl(url, mxUtils.bind(this, function(data)
            {
            	loadData(data);
            }), mxUtils.bind(this, function(err)
            {
            	if (error != null)
            	{
            		error(err)
            	}
            }));
		}
		else
		{
			loadData('');
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.updateDiagram = function(xml)
	{
		var doc = null;
		var ui = this;
		
		function createOverlay(desc)
		{
			var overlay = new mxCellOverlay(desc.image || graph.warningImage,
				desc.tooltip, desc.align, desc.valign, desc.offset);

			// Installs a handler for clicks on the overlay
			overlay.addListener(mxEvent.CLICK, function(sender, evt)
			{
				ui.alert(desc.tooltip);
			});
			
			return overlay;
		};
		
		if (xml != null && xml.length > 0)
		{
			doc = mxUtils.parseXml(xml);
			var node = (doc != null) ? doc.documentElement : null;
			
			if (node != null && node.nodeName == 'updates')
			{
				var graph = this.editor.graph;
				var model = graph.getModel();
				model.beginUpdate();
				var fit = null;

				try
				{
					node = node.firstChild;
					
					while (node != null)
					{
						if (node.nodeName == 'update')
						{
							// Resolves the cell ID
							var cell = model.getCell(node.getAttribute('id'));
							
							if (cell != null)
							{
								// Changes the value
								try
								{
									var value = node.getAttribute('value');
									
									if (value != null)
									{
										var valueNode = mxUtils.parseXml(value).documentElement;

										if (valueNode != null)
										{
											if (valueNode.getAttribute('replace-value') == '1')
											{
												model.setValue(cell, valueNode);
											}
											else
											{
												var attrs = valueNode.attributes;
												
												for (var j = 0; j < attrs.length; j++)
												{
													graph.setAttributeForCell(cell, attrs[j].nodeName,
														(attrs[j].nodeValue.length > 0) ? attrs[j].nodeValue : null);
												}
											}
										}
									}
								}
								catch (e)
								{
									if (window.console != null)
									{
										console.log('Error in value for ' + cell.id + ': ' + e);
									}
								}
								
								// Changes the style
								try
								{
									var style = node.getAttribute('style');
									
									if (style != null)
									{
										graph.model.setStyle(cell, style);
									}
								}
								catch (e)
								{
									if (window.console != null)
									{
										console.log('Error in style for ' + cell.id + ': ' + e);
									}
								}
								
								// Adds or removes an overlay icon
								try
								{
									var icon = node.getAttribute('icon');
									
									if (icon != null)
									{
										var desc = (icon.length > 0) ? JSON.parse(icon) : null;
										
										if (desc == null || !desc.append)
										{
											graph.removeCellOverlays(cell);
										}

										if (desc != null)
										{
											graph.addCellOverlay(cell, createOverlay(desc));
										}

									}
								}
								catch (e)
								{
									if (window.console != null)
									{
										console.log('Error in icon for ' + cell.id + ': ' + e);
									}
								}
								
								// Replaces the geometry
								try
								{
									var geo = node.getAttribute('geometry');
									
									if (geo != null)
									{
										geo = JSON.parse(geo);
										var curr = graph.getCellGeometry(cell);
										
										if (curr != null)
										{
											curr = curr.clone();
											
											// Partially overwrites geometry
											for (key in geo)
											{
												var val = parseFloat(geo[key]);
												
												if (key == 'dx')
												{
													curr.x += val; 
												}
												else if (key == 'dy')
												{
													curr.y += val;
												}
												else if (key == 'dw')
												{
													curr.width += val;
												}
												else if (key == 'dh')
												{
													curr.height += val;
												}
												else
												{
													curr[key] = parseFloat(geo[key]);
												}
											}
											
											graph.model.setGeometry(cell, curr);
										}
									}
								}
								catch (e)
								{
									if (window.console != null)
									{
										console.log('Error in icon for ' + cell.id + ': ' + e);
									}
								}
							} // if cell != null
						} // if node.nodeName == 'update
						else if (node.nodeName == 'model')
						{
							// Finds first child element
							var dataNode = node.firstChild;
							
							while (dataNode != null && dataNode.nodeType != mxConstants.NODETYPE_ELEMENT)
							{
								dataNode = dataNode.nextSibling;
							}
							
							if (dataNode != null)
							{
								var dec = new mxCodec(node.firstChild);
								dec.decode(dataNode, model);
							}
						}
						else if (node.nodeName == 'view')
						{
							if (node.hasAttribute('scale'))
							{
								graph.view.scale = parseFloat(node.getAttribute('scale'));
							}
							
							if (node.hasAttribute('dx') || node.hasAttribute('dy'))
							{
								graph.view.translate = new mxPoint(parseFloat(node.getAttribute('dx') || 0),
									parseFloat(node.getAttribute('dy') || 0));
							}
						}
						else if (node.nodeName == 'fit')
						{
							if (node.hasAttribute('max-scale'))
							{
								fit = parseFloat(node.getAttribute('max-scale'));
							}
							else
							{
								fit = 1;
							}
						}
						
						node = node.nextSibling;
					} // end of while
				}
				finally
				{
					model.endUpdate();
				}
				
				if (fit != null && this.chromelessResize)
				{
					this.chromelessResize(true, fit);
				}
			}
		}
		
		return doc;
	};
	
	/**
	 * Constructs a filename for a copy of the given file.
	 */
	EditorUi.prototype.getCopyFilename = function(file, timestamp)
	{
		var title = (file != null && file.getTitle() != null) ?
			file.getTitle() : this.defaultFilename;
		
		// Handles extension
		var extension = '';
		var dot = title.lastIndexOf('.');
		
		if (dot >= 0)
		{
			extension = title.substring(dot);
			title = title.substring(0, dot);
		}
		
		if (timestamp)
		{
			function getFormattedTime()
			{
			    var today = new Date();
			    var y = today.getFullYear();
			    // JavaScript months are 0-based.
			    var m = today.getMonth() + 1;
			    var d = today.getDate();
			    var h = today.getHours();
			    var mi = today.getMinutes();
			    var s = today.getSeconds();
			    
			    return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
			}
			
			var ts = new Date();
			title += ' ' + getFormattedTime();
		}
		
		title = mxResources.get('copyOf', [title]) + extension;
		
		return title;
	};
		
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.logIfModified = function(file, discarded)
	{
		try
		{
			if (file != null)
			{
				if (discarded)
				{
					EditorUi.debug('File.closed', [file]);
				}

				// if (file.isModified() && file.constructor == DriveFile &&
				// 	file.desc != null && this.drive != null)
				// {
				// 	var evt = {category: 'WARN-CLOSE-MODIFIED-FILE-' + file.getHash(),
				// 		action: (discarded ? 'DISCARDED' : 'WARNED') + ((file.savingFile) ? 'saving' : '') +
				// 		((file.savingFile && file.savingFileTime != null) ? '_' +
				// 			Math.round((Date.now() - file.savingFileTime.getTime()) / 1000) : '') +
				// 		((file.saveLevel != null) ? ('-sl_' + file.saveLevel) : '') +
				// 		'-age_' + ((file.ageStart != null) ? Math.round((Date.now() - file.ageStart.getTime()) / 1000) : 'x') +
				// 		((this.editor.autosave) ? '' : '-nosave') +
				// 		((file.isAutosave()) ? '' : '-noauto') +
				// 		'-open_' + ((file.opened != null) ? Math.round((Date.now() - file.opened.getTime()) / 1000) : 'x') +
				// 		'-save_' + ((file.lastSaved != null) ? Math.round((Date.now() - file.lastSaved.getTime()) / 1000) : 'x') +
				// 		'-change_' + ((file.lastChanged != null) ? Math.round((Date.now() - file.lastChanged.getTime()) / 1000) : 'x') +
				// 		'-alive_' + Math.round((Date.now() - App.startTime.getTime()) / 1000),
				// 		label: ((file.sync != null) ? ('client_' + file.sync.clientId) : 'nosync') +
				// 			((this.drive.user != null) ? ('-user_' + this.drive.user.id) : '-nouser') + '-rev_' +
				// 			file.desc.headRevisionId + '-mod_' + file.desc.modifiedDate + '-size_' + file.getSize() +
				// 			'-mime_' + file.desc.mimeType};

				// 	EditorUi.logEvent(evt);
				// }
			}
		}
		catch (e)
		{
			// ignore
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.fileLoaded = function(file, noDialogs, success)
	{
		EditorUi.debug('EditorUi.fileLoaded', [this],
			'file', [file], 'noDialogs', [noDialogs]);
		var oldFile = this.getCurrentFile();
		this.fileLoadedError = null;
		this.fileEditable = null;
		this.setCurrentFile(null);
		var result = false;
		this.hideDialog();
		
		if (oldFile != null)
		{
			oldFile.removeListener(this.descriptorChangedListener);
			this.logIfModified(oldFile, true);
			oldFile.close();
		}
		
		this.editor.graph.model.clear();
		this.editor.undoManager.clear();
	
		var noFile = mxUtils.bind(this, function()
		{
			this.setGraphEnabled(false);
			this.setCurrentFile(null);
			
			// Keeps initial title if no file existed before
			if (oldFile != null)
			{
				this.updateDocumentTitle();
			}
			
			// File might have been loaded halfway
			this.editor.graph.model.clear();
			this.editor.undoManager.clear();
			this.setBackgroundImage(null);
					
			// Avoids empty hash with no value
			if (!noDialogs && window.location.hash != null &&
				window.location.hash.length > 0)
			{
				window.location.hash = '';
			}
			
			if (this.fname != null)
			{
				this.fname.innerText = '';
			}

			this.clearStatus();
			this.updateUi();
			
			if (!noDialogs)
			{
				if (urlParams['splash'] != '0')
				{
					this.showSplash();
				}
				else
				{
					try
					{
						this.createFile(this.defaultFilename,
							this.getFileData(), null, null, null,
							null, null, true);
					}
					catch (e)
					{
						this.handleError(e);
					}
				}
			}
		});
		
		if (file != null)
		{
			try
			{
				// Order is significant, current file needed for correct
				// file format for initial save after starting realtime
				this.openingFile = true;
				this.setCurrentFile(file);
				file.addListener('descriptorChanged', this.descriptorChangedListener);
				file.addListener('contentChanged', this.descriptorChangedListener);
				file.open();
				delete this.openingFile;
				
				// DescriptorChanged updates the enabled state of the graph
				this.setGraphEnabled(true);
				this.setMode(file.getMode());
				this.editor.graph.model.prefix = Editor.guid() + '-';
				this.editor.undoManager.clear();
				this.descriptorChanged();
				this.updateUi();
				
				// Realtime files have a valid status message
				if (!file.isEditable())
				{
					this.updateStatus(mxUtils.bind(this, function()
					{
						this.editor.setStatus('<div class="geStatusBox" title="' +
							mxUtils.htmlEntities(mxResources.get('readOnly')) + '">' +
							mxUtils.htmlEntities(mxResources.get('readOnly')) + '</div>');
					}));
				}
				// Handles modified state after error of loading new file
				else if (file.isModified())
				{
					file.addUnsavedStatus();
				}
				else
				{
					this.clearStatus();
				}
	
				if (!this.editor.isChromelessView() || this.editor.editable)
				{
					this.editor.graph.selectUnlockedLayer();
					this.showLayersDialog();

					// Refreshes layers window after file load since
					// graph was disabled during model changes
					if (this.actions.layersWindow != null)
					{
						this.actions.layersWindow.refreshLayers();
					}

					this.restoreLibraries();
					
					// Workaround for no initial focus in FF
					if (window.self !== window.top && !this.noAutoFocus)
					{
						window.focus();
					}
				}
				else if (this.editor.graph.isLightboxView())
				{
					this.lightboxFit();
				}
	
				if (this.chromelessResize)
				{
					this.chromelessResize();
				}

				if (success != null)
				{
					success();
				}
				
				this.editor.fireEvent(new mxEventObject('fileLoaded'));
				result = true;

				if (!this.isOffline() && file.getMode() != null)
				{
					var theme = (urlParams['sketch'] == '1') ? 'sketch' : uiTheme;

					if (theme == null)
					{
						theme = 'default';
					}
					else if (theme == 'sketch' || theme == 'min')
					{
						theme += Editor.isDarkMode() ? '-dark' : '-light';
					}

					EditorUi.logEvent({category: file.getMode().toUpperCase() + '-OPEN-FILE-' + file.getHash(),
						action: 'size_' + file.getSize(), label: 'autosave_' +
						((this.editor.autosave) ? 'on' : 'off') + '_theme_' + theme});
				}
				
				EditorUi.debug('File.opened', [file]);
				
				//Notify users that editing is disabled within mobile apps (mainly for MS Teams)
				if (urlParams['viewerOnlyMsg'] == '1')
				{
					this.showAlert(mxResources.get('viewerOnlyMsg'));
				}
			
				if (this.editor.editable && this.mode == file.getMode() &&
					file.getMode() != App.MODE_DEVICE && file.getMode() != null)
				{
					try
					{
						this.addRecent({id: file.getHash(), title: file.getTitle(), mode: file.getMode()});
					}
					catch (e)
					{
						// ignore
					}
				}
				
				try
				{
					mxSettings.setOpenCounter(mxSettings.getOpenCounter() + 1);
					mxSettings.save();
				}
				catch (e)
				{
					// ignore
				}
			}
			catch (e)
			{
				this.fileLoadedError = e;

				// Captures data and title for best-effort recovery before the file is closed
				var recoveryData = null, recoveryTitle = this.defaultFilename;

				// Disconnects file from UI
				if (file != null)
				{
					try
					{
						recoveryData = file.getData();
						recoveryTitle = file.getTitle() || this.defaultFilename;
					}
					catch (e2)
					{
						// ignore
					}

					try
					{
						file.close();
					}
					catch (e2)
					{
						// ignore
					}
				}
				
				// if (EditorUi.enableLogging && !this.isOffline())
				// {
		        // 	try
		        // 	{
		        // 		EditorUi.logEvent({category: 'ERROR-LOAD-FILE-' +
		        // 			((file != null) ? file.getHash() : 'none'),
		        // 			action: 'message_' + e.message,
		        // 			label: 'stack_' + e.stack});
		        // 	}
		        // 	catch (e)
		        // 	{
		        // 		// ignore
		        // 	}
				// }
				
				// Asynchronous handling of errors
				var fn = mxUtils.bind(this, function()
				{
					// Removes URL parameter and reloads the page
					if (urlParams['url'] != null && this.spinner.spin(document.body, mxResources.get('reconnecting')))
					{
						window.location.search = this.getSearch(['url']);
					}
					else if (oldFile != null)
					{
						if (!this.fileLoaded(oldFile))
						{
							noFile();
						}
					}
					else
					{
						noFile();
					}
				});
				
				if (!noDialogs)
				{
					// Slightly wider than the default 340 to avoid an awkward wrap
					// of the long parser error message on this file-load path
					e.dialogWidth = 350;

					var showErr = mxUtils.bind(this, function()
					{
						this.handleError(e, mxResources.get('errorLoadingFile'), fn, true, null, null, true);
					});

					if (e.fallbackFileData != null)
					{
						e.alternateAction = {
							label: mxResources.get('makeCopy'),
							funct: mxUtils.bind(this, function()
							{
								this.hideDialog();
								var tempFile = new LocalFile(this, e.fallbackFileData, this.defaultFilename, true);
								this.fileLoaded(tempFile);
							})
						};

						showErr();
					}
					else
					{
						// Offers best-effort recovery candidates (cloud version /
						// .bkp backup / in-memory repair) as a copy: 0 -> no button,
						// 1 -> direct (lossy repair confirms), 2+ -> chooser dialog.
						// Probing a version source may hit the network/disk, so show
						// a spinner until the error dialog is ready. (Sync paths
						// resolve before a repaint, so no spinner flashes.)
						var recoverySpinner = this.spinner.spin(document.body, mxResources.get('loading'));

						this.getRecoveryData(file, recoveryData, e, mxUtils.bind(this, function(candidates)
						{
							if (recoverySpinner)
							{
								this.spinner.stop();
							}

							if (candidates != null && candidates.length == 1)
							{
								var candidate = candidates[0];

								e.alternateAction = {
									label: candidate.label,
									funct: mxUtils.bind(this, function()
									{
										this.hideDialog();

										if (candidate.lossy)
										{
											this.confirm(mxResources.get('recoveryWarning'), mxUtils.bind(this, function()
											{
												this.openRecoveredCopy(candidate, recoveryTitle);
											}));
										}
										else
										{
											this.openRecoveredCopy(candidate, recoveryTitle);
										}
									})
								};
							}
							else if (candidates != null && candidates.length > 1)
							{
								e.alternateAction = {
									label: mxResources.get('recover'),
									funct: mxUtils.bind(this, function()
									{
										this.hideDialog();
										this.showRecoveryDialog(candidates, recoveryTitle);
									})
								};
							}

							showErr();
						}));
					}
				}
				else
				{
					fn();
				}
			}
		}
		else
		{
			noFile();
		}
		
		return result;
	};

	/**
	 * Creates a hash value for the current file.
	 */
	EditorUi.prototype.getHashValueForPages = function(pages, details)
	{
		// TODO: Avoid encoding to XML to make it faster
		var hash = 0;
		var model = new mxGraphModel();
		var codec = new mxCodec();

		if (details != null)
		{
			details.byteCount = 0;
			details.attrCount = 0;
			details.eltCount = 0;
			details.nodeCount = 0;
		}
		
		for (var i = 0; i < pages.length; i++)
		{
			// Skips null entries from pages with corrupt data
			if (pages[i] == null)
			{
				continue;
			}

			this.updatePageRoot(pages[i]);

			// Only hashes known diagram attributes to avoid checksum
			// errors from external tools adding extra attributes
			var diagram = pages[i].node.ownerDocument.createElement('diagram');
			diagram.setAttribute('id', pages[i].getId());
			
			// Model is only a holder for the root
			model.root = pages[i].root;
			var xmlNode = codec.encode(model);
			this.editor.graph.saveViewState(pages[i].viewState, xmlNode, true);
			
			// Local defaults may be different in files so ignore
			xmlNode.removeAttribute('pageWidth');
			xmlNode.removeAttribute('pageHeight');
			
			diagram.appendChild(xmlNode);
			
			if (details != null)
			{
				details.eltCount += diagram.getElementsByTagName('*').length;
				details.nodeCount += diagram.getElementsByTagName('mxCell').length;
			}
			
			hash = ((hash << 5) - hash + this.hashValue(diagram, function(obj, key, value, isXml)
			{
				// Ignores JS machine rounding errors in known numeric attributes
				// eg. 412.33333333333326 (Webkit/FF) == 412.33333333333325 (Edge/IE11)
				if (isXml && (obj.nodeName == 'mxGeometry' || obj.nodeName == 'mxPoint') &&
					(key == 'x' || key == 'y' || key == 'width' || key == 'height'))
				{
					return Math.round(value);
				}
				// Workaround for previous in patch written to mxCell in 10.0.23
				else if (isXml && obj.nodeName == 'mxCell' && key == 'previous')
				{
					return null;
				}
				else
				{
					return value;
				}
			}, details)) << 0;
		}
		
		return hash;
	};
	
	/**
	 * Creates a hash value for the given object. Replacer returns the value of the
	 * property or attribute for the given object or XML node.
	 */
	EditorUi.prototype.hashValue = function(obj, replacer, details)
	{
		var hash = 0;
		
		// Checks for XML nodes
		if (obj != null && typeof obj === 'object' && typeof obj.nodeType === 'number' &&
			typeof obj.nodeName === 'string' && typeof obj.getAttribute === 'function')
		{
			if (obj.nodeName != null)
			{
				hash = hash ^ this.hashValue(obj.nodeName, replacer, details);
			}
			
			if (obj.attributes != null)
			{
				if (details != null)
				{
					details.attrCount += obj.attributes.length;
				}
				
				for (var i = 0; i < obj.attributes.length; i++)
				{
					var key = obj.attributes[i].name;
					var value = (replacer != null) ? replacer(obj, key, obj.attributes[i].value, true) : obj.attributes[i].value;
	
					if (value != null)
					{
						hash = hash ^ (this.hashValue(key, replacer, details) +
							this.hashValue(value, replacer, details));
					}
				}
			}
			
			if (obj.childNodes != null)
			{
				for (var i = 0; i < obj.childNodes.length; i++)
				{
					hash = ((hash << 5) - hash + this.hashValue(
						obj.childNodes[i], replacer, details)) << 0;
				}
			}
		}
		else if (obj != null && typeof obj !== 'function')
		{
			var str = String(obj);
			var temp = 0;

			if (details != null)
			{
				details.byteCount += str.length;
			}
			
			for (var i = 0; i < str.length; i++)
			{
		    	temp = ((temp << 5) - temp + str.charCodeAt(i)) << 0;
			}
		    
			hash = hash ^ temp;
		}
		
	    return hash;
	};

	/**
	 * Adds empty implementation
	 */
	EditorUi.prototype.descriptorChanged = function()
	{
		// empty
	};

	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.restoreLibraries = function() { };

	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.saveLibrary = function(name, images, file, mode, noSpin, noReload, fn) { };
	
	/**
	 * 
	 */
	EditorUi.prototype.isScratchpadEnabled = function()
	{
		return isLocalStorage || mxClient.IS_CHROMEAPP;
	};

	/**
	 * Shows or hides the scratchpad library.
	 */
	EditorUi.prototype.toggleScratchpad = function()
	{
		if (this.isScratchpadEnabled())
		{
			if (this.scratchpad == null)
			{
				StorageFile.getFileContent(this, '.scratchpad', mxUtils.bind(this, function(xml)
				{
					if (xml == null || xml.substring(0, 7) == '<mxfile')
					{
						xml = this.emptyLibraryXml;
					}

					this.loadLibrary(new StorageLibrary(this, xml, '.scratchpad'));
				}));
			}
			else
			{
				this.closeLibrary(this.scratchpad);
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createLibraryDataFromImages = function(images)
	{
		// Uncompresses existing entries for saving
		if (!Editor.defaultCompressed)
		{
			for (var i = 0; i < images.length; i++)
			{
				if (images[i].xml != null && images[i].xml.charAt(0) != '<')
				{
					images[i].xml = mxUtils.trim(Graph.decompress(images[i].xml));
				}
			}
		}

		var doc = mxUtils.createXmlDocument();
		var library = doc.createElement('mxlibrary');
		mxUtils.setTextContent(library, JSON.stringify(images, null, 2));
		doc.appendChild(library);
		
		return mxUtils.getXml(doc, '\n');
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.closeLibrary = function(file)
	{
		if (file != null)
		{
			this.removeLibrarySidebar(file.getHash());
			
			if (file.constructor != LocalLibrary)
			{
				mxSettings.removeCustomLibrary(file.getHash());
			}
			
			if (file.title == '.scratchpad')
			{
				this.scratchpad = null;
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.removeLibrarySidebar = function(id)
	{
		var elts = this.sidebar.palettes[id];
		
		if (elts != null)
		{
			for (var i = 0; i < elts.length; i++)
			{
				elts[i].parentNode.removeChild(elts[i]);
			}
			
			delete this.sidebar.palettes[id];
		}
	};
	
	/**
	 * Changes the position of the library in the sidebar.
	 */
	EditorUi.prototype.repositionLibrary = function(nextChild, append) 
	{
	    var c = this.sidebar.getEntryContainer();

		if (!this.sidebar.appendCustomLibraries ||
			nextChild != null || !append)
		{
			if (nextChild == null)
			{
				var elts = this.sidebar.palettes['L.scratchpad'];
				
				if (elts == null)
				{
					elts = this.sidebar.palettes['search'];
				}
				
				if (elts != null)
				{
					nextChild = elts[elts.length - 1].nextSibling;
				}
			}
			
			nextChild = (nextChild != null) ? nextChild : c.firstChild.nextSibling.nextSibling;
			
			var content = c.lastChild;
			var title = content.previousSibling;
			
			c.insertBefore(content, nextChild);
			c.insertBefore(title, content);
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.loadLibrary = function(file, expand)
	{
		var doc = mxUtils.parseXml(file.getData());
		
		if (doc.documentElement.nodeName == 'mxlibrary')
		{
			var images = JSON.parse(mxUtils.getTextContent(doc.documentElement));
			this.libraryLoaded(file, images, doc.documentElement.getAttribute('title'),
				expand, doc.documentElement.getAttribute('tags'));
		}
		else
		{
			throw {message: mxResources.get('notALibraryFile')};
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getLibraryStorageHint = function(file)
	{
		return '';
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.showSidebar = function()
	{
		if (this.sidebarWindow != null)
		{
			this.sidebarWindow.window.setVisible(true);
		}
		else
		{
			this.toggleShapesPanel(true);
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.showSearchWindow = function(findReplace, searchTerms)
	{
		var evtName = (findReplace) ? 'findReplace' : 'find';
		var name = evtName + 'Window';

		if (this[name] == null)
		{
			var modern = (Editor.currentTheme == 'min' ||
				Editor.currentTheme == 'simple' ||
				Editor.currentTheme == 'sketch');
			var saved = mxSettings.getWindowState(evtName);

			var w = (saved != null && saved.w != null) ? saved.w :
				((findReplace) ? ((modern) ? 330 : 300) : 240);
			var h = (saved != null && saved.h != null) ? saved.h :
				((findReplace) ? ((modern) ? 304 : 288) : 180);
			var x = (saved != null && saved.x != null) ? saved.x :
				document.body.offsetWidth - (w + 20);
			var y = (saved != null && saved.y != null) ? saved.y : 100;

			this[name] = new FindWindow(this, x, y, w, h, findReplace);
			this[name].window.addListener('show', function()
			{
				this.fireEvent(new mxEventObject(evtName));
			});
			this[name].window.addListener('hide', function()
			{
				this.fireEvent(new mxEventObject(evtName));
			});

			this.installWindowPersistence(evtName, this[name]);

			if (saved != null && searchTerms == null)
			{
				this.restoreWindowState(evtName, this[name]);
			}

			this[name].window.setVisible(true);
		}
		else if (searchTerms == null)
		{
			this[name].window.setVisible(!this[name].window.isVisible());
		}

		if (searchTerms != null)
		{
			this[name].doSearch(searchTerms);
			this[name].window.setVisible(true);
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.libraryLoaded = function(file, images, optionalTitle, expand, defaultTags)
	{
		if (this.sidebar == null)
		{
			return;
		}

		if (file.constructor != LocalLibrary)
		{
			mxSettings.addCustomLibrary(file.getHash());
		}
		
		var library = null;

		if (file.constructor != StorageLibrary || file.title != '.scratchpad')
		{
			if (this.openLibraries == null)
			{
				this.openLibraries = [];
			}

			// Removes existing entry for this file ID
			for (var i = 0; i < this.openLibraries.length; i++)
			{
				if (this.openLibraries[i].file.getHash() == file.getHash())
				{
					mxUtils.remove(this.openLibraries[i], this.openLibraries);
					break;
				}
			}

			// Adds new entry to the array of open libraries
			library = {file: file, images: images,
				title: optionalTitle,
				expand: expand};
			this.openLibraries.push(library);
		}
		else
		{
			this.scratchpad = file;
		}
		
		var elts = this.sidebar.palettes[file.getHash()];
		var nextSibling = (elts != null) ? elts[elts.length - 1].nextSibling : null;
	
		// Removes existing sidebar entry for this library
		this.removeLibrarySidebar(file.getHash());
		var dropTarget = null;
		
		var addImages = mxUtils.bind(this, function(imgs, content)
		{
			if (imgs.length == 0 && file.isEditable())
			{
				if (dropTarget == null)
				{
					dropTarget = document.createElement('div');
					dropTarget.className = 'geDropTarget';
					var label = mxResources.get('dragElementsHere');
					mxUtils.write(dropTarget, label);
					// Suppress the sidebar container's broader tooltip
					// here — the drop-target has its own self-evident
					// label that doubles as its tooltip.
					dropTarget.setAttribute('title', label);
				}
				
				content.appendChild(dropTarget);
			}
			else
			{
				this.addLibraryEntries(imgs, content);
			}
		});

		// Adds entries to search index
		// KNOWN: Existing entries are not replaced after edit of custom library
		if (this.sidebar != null && images != null)
		{
			this.sidebar.setCurrentSearchEntryLibrary(file.getHash(), file.getHash());
			this.sidebar.addEntries(images, defaultTags);
			this.sidebar.setCurrentSearchEntryLibrary();
		}
		
		// Adds new sidebar entry for this library
		var tmp = optionalTitle;
		
		if (tmp == null)
		{
			tmp = file.getTitle();

			if (tmp != null && /(\.xml)$/i.test(tmp))
			{
				tmp = tmp.substring(0, tmp.lastIndexOf('.'));
			}
		}

		var contentDiv = this.sidebar.addPalette(file.getHash(), tmp,
			(expand != null) ? expand : true, mxUtils.bind(this, function(content)
		{
			addImages(images, content);
	    }));

		if (library != null)
		{
			library.div = contentDiv;
		}
	
		this.repositionLibrary(nextSibling, file.getHash() != 'L.scratchpad');
		
		// Adds tooltip for backend
		var title = contentDiv.parentNode.previousSibling;
	    var tip = title.getAttribute('title');
	    
	    if (tip != null && tip.length > 0 && file.title != '.scratchpad')
	    {
	    	title.setAttribute('title', this.getLibraryStorageHint(file) + '\n' + tip);
	    }
	    
	    var buttons = document.createElement('div');
	    buttons.style.backgroundColor = 'inherit';
	    title.style.position = 'relative';
	    
		var btn = document.createElement('img');
		btn.className = 'geLibraryButton';
		btn.setAttribute('src', Editor.crossImage);
		btn.setAttribute('title', mxResources.get('close'));

		var saveBtn = null;
		
	    if (file.title != '.scratchpad' || this.closableScratchpad)
	    {
			buttons.appendChild(btn);
			
			mxEvent.addListener(btn, 'click', mxUtils.bind(this, function(evt)
			{
				// Workaround for close after any button click in IE8
				if (!mxEvent.isConsumed(evt))
				{
					var fn = mxUtils.bind(this, function()
					{
						if (library != null)
						{
							mxUtils.remove(library, this.openLibraries);
						}

						this.closeLibrary(file);
					});
					
					if (saveBtn != null)
					{
						this.confirm(mxResources.get('allChangesLost'), null, fn,
							mxResources.get('cancel'), mxResources.get('discardChanges'));
					}
					else
					{
						fn();
					}
			
					mxEvent.consume(evt);
				}
			}));
	    }
		
		if (file.isEditable())
		{
			var graph = this.editor.graph;
			var spinBtn = null;
			
			var editLibrary = mxUtils.bind(this, function(evt)
			{
				this.showLibraryDialog(file.getTitle(), contentDiv, images, file, file.getMode());
				mxEvent.consume(evt);
			});
			
			var saveLibrary = mxUtils.bind(this, function(evt)
			{
				file.setModified(true);
				
				if (file.isAutosave())
				{
					if (spinBtn != null && spinBtn.parentNode != null)
					{
						spinBtn.parentNode.removeChild(spinBtn);
					}
					
					spinBtn = btn.cloneNode(false);
					spinBtn.setAttribute('src', Editor.spinImage);
					spinBtn.setAttribute('title', mxResources.get('saving'));
					spinBtn.style.cursor = 'default';
					spinBtn.style.marginRight = '2px';
					spinBtn.style.marginTop = '-2px';
					buttons.insertBefore(spinBtn, buttons.firstChild);
					
					this.saveLibrary(file.getTitle(), images, file, file.getMode(), true, true, function()
					{
						if (spinBtn != null && spinBtn.parentNode != null)
						{
							spinBtn.parentNode.removeChild(spinBtn);
						}
					});
				}
				else if (saveBtn == null)
				{
					saveBtn = btn.cloneNode(false);
					saveBtn.setAttribute('src', Editor.saveImage);
					saveBtn.setAttribute('title', mxResources.get('save'));
					buttons.insertBefore(saveBtn, buttons.firstChild);
					
					mxEvent.addListener(saveBtn, 'click', mxUtils.bind(this, function(evt)
					{
						this.saveLibrary(file.getTitle(), images, file, file.getMode(),
							file.constructor == LocalLibrary, true, function()
							{
								if (saveBtn != null && !file.isModified())
								{
									saveBtn.parentNode.removeChild(saveBtn);
									saveBtn = null;
								}
							});
						
						mxEvent.consume(evt);
					}));
				}
			});
			
			var addCells = mxUtils.bind(this, function(cells, bounds, evt, title)
			{
				cells = graph.cloneCells(mxUtils.sortCells(graph.model.getTopmostCells(cells)));
	
				// Translates cells to origin
				for (var i = 0; i < cells.length; i++)
				{
					var geo = graph.getCellGeometry(cells[i]);
					
					if (geo != null)
					{
						geo.translate(-bounds.x, -bounds.y);
					}
				}

				contentDiv.appendChild(this.sidebar.createVertexTemplateFromCells(
					cells, bounds.width, bounds.height, title || '', true, null, false));
				var xml = mxUtils.getXml(this.editor.graph.encodeCells(cells));

				if (Editor.defaultCompressed)
				{
					xml = Graph.compress(xml);
				}

				var entry = {xml: xml, w: bounds.width, h: bounds.height};
				
				if (title != null)
				{
					entry.title = title;
				}
				
				images.push(entry);
				saveLibrary(evt);
				
				if (dropTarget != null && dropTarget.parentNode != null && images.length > 0)
				{
					dropTarget.parentNode.removeChild(dropTarget);
					dropTarget = null;
				}
			});
		
			var addSelection = mxUtils.bind(this, function(evt)
			{
				if (!graph.isSelectionEmpty())
				{
					var cells = graph.getSelectionCells();
					var bounds = graph.view.getBounds(cells);

					if (bounds != null && bounds.width > 0 && bounds.height > 0)
					{
						var s = graph.view.scale;
						
						bounds.x /= s;
						bounds.y /= s;
						bounds.width /= s;
						bounds.height /= s;
						
						bounds.x -= graph.view.translate.x;
						bounds.y -= graph.view.translate.y;
						
						addCells(cells, bounds);
					}
					else
					{
						this.showError(mxResources.get('error'), mxResources.get('invalidSel'), mxResources.get('ok'));
					}
				}
				else if (graph.getRubberband().isActive())
				{
					graph.getRubberband().execute(evt);
					graph.getRubberband().reset();
				}
				else if (evt != null && mxEvent.getSource(evt) != null && mxEvent.getSource(evt).classList.contains('geLibraryButton'))
				{
					this.showError(mxResources.get('error'), mxResources.get('nothingIsSelected'), mxResources.get('ok'));
				}
				
				mxEvent.consume(evt);
			});
			
			// Adds drop handler from graph
			mxEvent.addGestureListeners(contentDiv, function(){}, mxUtils.bind(this, function(evt)
			{
				if (graph.isMouseDown && graph.panningManager != null && graph.graphHandler.first != null)
				{
					graph.graphHandler.suspend();
					
					if (graph.graphHandler.hint != null)
					{
						graph.graphHandler.hint.style.visibility = 'hidden';	
					}
					
					contentDiv.style.backgroundColor = 'light-dark(#fefefe, #000000)';
					contentDiv.style.cursor = 'copy';
					graph.panningManager.stop();
					graph.autoScroll = false;
					
					mxEvent.consume(evt);
				}
			}), mxUtils.bind(this, function(evt)
			{
				if (graph.isMouseDown && graph.panningManager != null && graph.graphHandler != null)
				{
					contentDiv.style.backgroundColor = '';
					contentDiv.style.cursor = 'default';
					this.sidebar.showTooltips = true;
					graph.panningManager.stop();
					
					graph.graphHandler.reset();
					graph.isMouseDown = false;
					graph.autoScroll = true;
					
					addSelection(evt);
					mxEvent.consume(evt);
				}
			}));
			
			// Handles mouse leaving the library and restoring move
			mxEvent.addListener(contentDiv, 'mouseleave', mxUtils.bind(this, function(evt)
			{
				if (graph.isMouseDown && graph.graphHandler.first != null)
				{
					graph.graphHandler.resume();

					if (graph.graphHandler.hint != null)
					{
						graph.graphHandler.hint.style.visibility = 'visible';	
					}
					
					contentDiv.style.backgroundColor = '';
					contentDiv.style.cursor = '';
					graph.autoScroll = true;
				}
			}));
			
			// Adds drop handler from filesystem
			if (Graph.fileSupport)
			{
				mxEvent.addListener(contentDiv, 'dragover', mxUtils.bind(this, function(evt)
				{
					contentDiv.style.backgroundColor = 'light-dark(#fefefe, #000000)';
					evt.dataTransfer.dropEffect = 'copy';
					contentDiv.style.cursor = 'copy';
					this.sidebar.hideTooltip();
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(contentDiv, 'drop', mxUtils.bind(this, function(evt)
				{
					contentDiv.style.cursor = '';
					contentDiv.style.backgroundColor = '';
					
				    if (evt.dataTransfer.files.length > 0)
				    {	
				    	this.importFiles(evt.dataTransfer.files, 0, 0, this.maxImageSize, mxUtils.bind(this, function(data, mimeType, x, y, w, h, img, doneFn, file)
				    	{
							if (data != null && mimeType.substring(0, 6) == 'image/')
							{
								var style = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;aspect=fixed;image=' +
									this.convertDataUri(data);
								var cells = [new mxCell('', new mxGeometry(0, 0, w, h), style)];
								cells[0].vertex = true;
	
								addCells(cells, new mxRectangle(0, 0, w, h), evt, (mxEvent.isAltDown(evt)) ? null : img.substring(0, img.lastIndexOf('.')).replace(/_/g, ' '));

								if (dropTarget != null && dropTarget.parentNode != null && images.length > 0)
								{
									dropTarget.parentNode.removeChild(dropTarget);
									dropTarget = null;
								}
							}
							else
							{
								var done = false;
								
								var doImport = mxUtils.bind(this, function(theData, theMimeType)
								{
									if (theData != null && theMimeType == 'application/pdf')
									{
										var xml = Editor.extractGraphModelFromPdf(theData);
					
										if (xml != null && xml.length > 0)
										{
											theMimeType = 'text/xml';
											theData = xml;
										}
									}
									
									if (theData != null) //Try to parse the file as xml (can be a library or mxfile). Otherwise, an error will be shown
									{
										var doc = mxUtils.parseXml(theData);
										
										if (doc.documentElement.nodeName == 'mxlibrary')
										{
											try
											{
												var temp = JSON.parse(mxUtils.getTextContent(doc.documentElement));
												addImages(temp, contentDiv);
												images = images.concat(temp);
												saveLibrary(evt);
												this.spinner.stop();
												done = true;
											}
											catch (e)
											{
												// ignore
											}
										}
										else if (doc.documentElement.nodeName == 'mxfile')
										{
											try
											{
												var pages = doc.documentElement.getElementsByTagName('diagram');
												
												for (var i = 0; i < pages.length; i++)
												{
													var cells = this.stringToCells(Editor.getDiagramNodeXml(pages[i]));
													var size = this.editor.graph.getBoundingBoxFromGeometry(cells);

													if (size != null)
													{
														addCells(cells, new mxRectangle(0, 0, size.width, size.height), evt);
													}
												}
												
												done = true;
											}
											catch (e)
											{
												if (window.console != null)
												{
													console.log('error in drop handler:', e);
												}
											}
										}
									}
									
									if (!done)
									{
										this.spinner.stop();
										this.handleError({message: mxResources.get('errorLoadingFile')})
									}

									if (dropTarget != null && dropTarget.parentNode != null && images.length > 0)
									{
										dropTarget.parentNode.removeChild(dropTarget);
										dropTarget = null;
									}
								});
								
								if (file != null && img != null && EditorUi.isVisioFilename(img))
								{
									this.importVisio(file, function(xml)
									{
										doImport(xml, 'text/xml');
									}, null, img);
								}
								else if (new XMLHttpRequest().upload && this.isRemoteFileFormat(data, img) && file != null)
								{
									if (this.isExternalDataComms())
									{
										this.parseFile(file, mxUtils.bind(this, function(xhr)
										{
											if (xhr.readyState == 4)
											{
												this.spinner.stop();
												
												if (xhr.status >= 200 && xhr.status <= 299)
												{
													doImport(xhr.responseText, 'text/xml');
												}
												else
												{
													this.handleError({message: mxResources.get((xhr.status == 413) ?
														'drawingTooLarge' : 'invalidOrMissingFile')},
														mxResources.get('errorLoadingFile'));
												}
											}
										}));
									}
									else
									{
										this.spinner.stop();
										this.showError(mxResources.get('error'), mxResources.get('notInOffline'));
									}
								}
								else
								{
									doImport(data, mimeType);
								}
							}
				    	}));
					}
				    
				    evt.stopPropagation();
				    evt.preventDefault();
				}));
	
				mxEvent.addListener(contentDiv, 'dragleave', function(evt)
				{
					contentDiv.style.cursor = '';
					contentDiv.style.backgroundColor = '';
					evt.stopPropagation();
					evt.preventDefault();
				});
			}
	
			btn = btn.cloneNode(false);
			btn.setAttribute('src', Editor.editImage);
			btn.setAttribute('title', mxResources.get('edit'));
			buttons.insertBefore(btn, buttons.firstChild);
			
			mxEvent.addListener(btn, 'click', editLibrary);

			var btn2 = btn.cloneNode(false);
			btn2.setAttribute('src', Editor.plusImage);
			btn2.setAttribute('title', mxResources.get('add'));
			buttons.insertBefore(btn2, buttons.firstChild);
			mxEvent.addListener(btn2, 'click', addSelection);

			// Hack to add selection via context menu
			if (file.title == '.scratchpad')
			{
				this.addSelectionToScratchpad = addSelection;
			}
			
			if (!this.isOffline() && file.title == '.scratchpad' &&
				EditorUi.scratchpadHelpLink != null)
			{
				var link = this.createHelpIcon(EditorUi.scratchpadHelpLink, true);
				link.className = 'geLibraryButton';
				buttons.insertBefore(link, buttons.firstChild);
			}
		}
		
		title.appendChild(buttons);
		this.editor.fireEvent(new mxEventObject('libraryLoaded'));
	};

	/**
	 * Adds the library entries to the given DOM node.
	 */
	EditorUi.prototype.addLibraryEntries = function(imgs, content)
	{
		for (var i = 0; i < imgs.length; i++)
		{
			try
			{
				var img = imgs[i];
				var data = img.data;

				if (data != null)
				{
					data = (data.substring(0, 5) == 'data:') ? this.convertDataUri(data) : data;
					var s = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;';
					
					if (img.aspect == 'fixed')
					{
						s += 'aspect=fixed;'
					}

					s = s + 'image=' + data + ';';

					if (img.style != null)
					{
						s += img.style;
					}
					
					content.appendChild(this.sidebar.createVertexTemplate(s,
						img.w, img.h, '', img.title || '', false, null, true));
				}
				else if (img.xml != null)
				{
					var cells = this.stringToCells((img.xml.charAt(0) == '<') ?
						img.xml : Graph.decompress(img.xml));
					var title = (cells.length == 0) ? mxResources.get('drawingEmpty') : 
						((img.title != null) ? img.title : '');
					content.appendChild(this.sidebar.createVertexTemplateFromCells(
						cells, img.w, img.h, title, true, null, true));
				}
			}
			catch (e)
			{
				var title = (e.message != null) ? mxResources.get('error') +
					': ' + e.message : String(e);
				var elt = this.sidebar.createVertexTemplateFromCells(null,
					img.w, img.h, title, true, null, true);
				content.appendChild(elt);
			}
		}
	};

	/**
	 * Extracts the resource for the current language from the given multi language
	 * resource object of the form {es: "...", de: "...", main: "..."} where the keys
	 * are country codes and main defines the fallback if no resource for the current
	 * country code exists.
	 */
	EditorUi.prototype.getResource = function(obj)
	{
		return (obj != null) ? (obj[mxLanguage] || obj.main) : null;
	};
	
	/**
	 * EditorUi Overrides
	 */
	if (urlParams['savesidebar'] == '1')
	{
		Sidebar.prototype.thumbWidth = 64;
		Sidebar.prototype.thumbHeight = 64;
	}

	/**
	 * Programmatic settings for theme.
	 */
    EditorUi.initTheme = function()
    {
		// Implements the sketch-min UI
		if (Editor.currentTheme == 'sketch' && !window.DRAWIO_PUBLIC_BUILD)
		{
			Editor.configurationKey = '.sketch-configuration';
			Editor.settingsKey = '.sketch-config';
		}
    };
    
	EditorUi.initTheme();

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
    EditorUi.prototype.showImageDialog = function(title, value, fn, ignoreExisting, convertDataUri, withCrop, initClipPath)
	{
		// KNOWN: IE+FF don't return keyboard focus after image dialog (calling focus doesn't help)
	    var dlg = new ImageDialog(this, title, value, fn, ignoreExisting, convertDataUri, withCrop, initClipPath);
		this.showDialog(dlg.container, (Graph.fileSupport) ? 480 : 360, (Graph.fileSupport) ? 200 : 90, true, true);
		dlg.init();
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
    EditorUi.prototype.showLocalStorageDialog = function(title, key, buttons, elt, helpLink, applyFn)
	{
		var value = localStorage.getItem(key);

		var dlg = new TextareaDialog(this, title, (value != null) ?
			JSON.stringify(JSON.parse(value), null, 2) : '',
			mxUtils.bind(this, function(newValue)
			{
				if (newValue != null)
				{
					try
					{
						if (applyFn != null)
						{
							applyFn(newValue);
						}
						
						if (newValue == value)
						{
							this.hideDialog();
						}
						else
						{
							if (newValue.length > 0)
							{
								var obj = JSON.parse(newValue);
								
								localStorage.setItem(key, JSON.stringify(obj));
							}
							else
							{
								localStorage.removeItem(key);
							}

							this.hideDialog();
							this.alert(mxResources.get('restartForChangeRequired'));
						}
					}
					catch (e)
					{
						this.handleError(e);	
					}
				}
			}), null, mxResources.get('close'), null, null,
			null, true, null, null, helpLink, buttons, elt);
		
		var w = (buttons != null && buttons.length > 2) ? 500 : 440;
		this.showDialog(dlg.container, 660, 480, true, false,
			null, null, null, new mxRectangle(0, 0, w, 280));
		dlg.init();
	};

	/**
	 * Shows a tabbed configuration dialog with visual editor and JSON tabs.
	 */
	EditorUi.prototype.showConfigurationEditorDialog = function(title, key, customButtons, elt, helpLink, applyFn)
	{
		var editorUi = this;
		var value = localStorage.getItem(key);
		var configObj = {};

		try
		{
			if (value != null)
			{
				configObj = JSON.parse(value);
			}
		}
		catch (e) {}

		var latestEditorConfig = configObj;
		var activeTab = 'editor';
		var modified = false;
		var allowClose = false;

		function confirmDiscard(onConfirm)
		{
			if (!modified)
			{
				onConfirm();
			}
			else
			{
				editorUi.confirm(mxResources.get('allChangesLost'), null, onConfirm,
					mxResources.get('cancel'), mxResources.get('discardChanges'));
			}
		}

		function closeDialog()
		{
			allowClose = true;
			editorUi.hideDialog();
		}

		// Main container
		var div = document.createElement('div');
		div.style.position = 'absolute';
		div.style.top = '20px';
		div.style.bottom = '20px';
		div.style.left = '20px';
		div.style.right = '20px';

		// Tab bar
		var tabBar = document.createElement('div');
		tabBar.style.position = 'absolute';
		tabBar.style.left = '0';
		tabBar.style.right = '0';
		tabBar.style.top = '0';
		tabBar.style.height = '28px';
		tabBar.style.display = 'flex';
		tabBar.style.alignItems = 'end';
		tabBar.style.borderBottom = '1px solid #d0d0d0';

		function createTab(label, isActive)
		{
			var tab = document.createElement('div');
			tab.style.padding = '4px 16px';
			tab.style.cursor = 'pointer';
			tab.style.fontSize = '13px';
			tab.style.borderBottom = isActive ? '2px solid #29b6f2' : '2px solid transparent';
			tab.style.fontWeight = isActive ? 'bold' : 'normal';
			tab.style.color = isActive ? '' : '#888';
			tab.style.userSelect = 'none';
			mxUtils.write(tab, label);

			return tab;
		}

		var editorTabBtn = createTab(mxResources.get('editor', null, 'Editor'), true);
		var jsonTabBtn = createTab(mxResources.get('formatJson', null, 'JSON'), false);

		tabBar.appendChild(editorTabBtn);
		tabBar.appendChild(jsonTabBtn);

		if (elt != null)
		{
			var headerWrapper = document.createElement('div');
			headerWrapper.style.marginLeft = 'auto';
			headerWrapper.style.display = 'flex';
			headerWrapper.style.alignItems = 'center';
			headerWrapper.style.paddingRight = '4px';
			headerWrapper.style.paddingBottom = '2px';
			headerWrapper.appendChild(elt);
			tabBar.appendChild(headerWrapper);
		}

		div.appendChild(tabBar);

		// Visual editor content
		var editorContent = document.createElement('div');
		editorContent.style.position = 'absolute';
		editorContent.style.left = '0';
		editorContent.style.right = '0';
		editorContent.style.top = '30px';
		editorContent.style.bottom = '50px';

		var editorContext = {};

		try
		{
			var graph = editorUi.editor.graph;

			if (graph.currentVertexStyle != null)
			{
				editorContext.currentVertexStyle = graph.currentVertexStyle;
			}

			if (graph.currentEdgeStyle != null)
			{
				editorContext.currentEdgeStyle = graph.currentEdgeStyle;
			}
		}
		catch (e)
		{
			// ignore
		}

		var configEditor = DrawioConfigEditor.install(editorContent, {
			initialConfig: configObj,
			editorContext: editorContext,
			darkMode: Editor.isDarkMode != null && Editor.isDarkMode(),
			highContrast: editorUi.isHighContrast(),
			onConfigChanged: function(obj)
			{
				latestEditorConfig = obj;
				modified = true;
			}
		});

		// JSON content (textarea)
		var jsonContent = document.createElement('div');
		jsonContent.style.position = 'absolute';
		jsonContent.style.left = '0';
		jsonContent.style.right = '0';
		jsonContent.style.top = '30px';
		jsonContent.style.bottom = '50px';
		jsonContent.style.display = 'none';

		var textarea = document.createElement('textarea');
		textarea.setAttribute('wrap', 'off');
		textarea.setAttribute('spellcheck', 'false');
		textarea.setAttribute('autocorrect', 'off');
		textarea.setAttribute('autocomplete', 'off');
		textarea.setAttribute('autocapitalize', 'off');
		textarea.style.resize = 'none';
		textarea.style.outline = 'none';
		textarea.style.boxSizing = 'border-box';
		textarea.style.width = '100%';
		textarea.style.height = '100%';

		try
		{
			textarea.value = (value != null) ? JSON.stringify(JSON.parse(value), null, 2) : '';
		}
		catch (e)
		{
			textarea.value = value || '';
		}

		mxEvent.addListener(textarea, 'input', function() { modified = true; });

		jsonContent.appendChild(textarea);

		div.appendChild(editorContent);
		div.appendChild(jsonContent);

		// Tab switching
		function setActiveTab(tab)
		{
			if (tab === activeTab) return;

			if (tab === 'json')
			{
				if (latestEditorConfig != null)
				{
					textarea.value = JSON.stringify(latestEditorConfig, null, 2);
				}

				editorContent.style.display = 'none';
				jsonContent.style.display = '';
				jsonTabBtn.style.borderBottomColor = '#29b6f2';
				jsonTabBtn.style.fontWeight = 'bold';
				jsonTabBtn.style.color = '';
				editorTabBtn.style.borderBottomColor = 'transparent';
				editorTabBtn.style.fontWeight = 'normal';
				editorTabBtn.style.color = '#888';
				textarea.focus();
			}
			else
			{
				try
				{
					var obj = JSON.parse(textarea.value);
					latestEditorConfig = obj;
					configEditor.setConfig(obj);
				}
				catch (e) {}

				editorContent.style.display = '';
				jsonContent.style.display = 'none';
				editorTabBtn.style.borderBottomColor = '#29b6f2';
				editorTabBtn.style.fontWeight = 'bold';
				editorTabBtn.style.color = '';
				jsonTabBtn.style.borderBottomColor = 'transparent';
				jsonTabBtn.style.fontWeight = 'normal';
				jsonTabBtn.style.color = '#888';
			}

			activeTab = tab;
		}

		mxEvent.addListener(editorTabBtn, 'click', function() { setActiveTab('editor'); });
		mxEvent.addListener(jsonTabBtn, 'click', function() { setActiveTab('json'); });

		// Buttons
		var buttons = document.createElement('div');
		buttons.style.position = 'absolute';
		buttons.style.left = '0';
		buttons.style.right = '0';
		buttons.style.bottom = '0';
		buttons.style.height = '46px';
		buttons.style.display = 'flex';
		buttons.style.whiteSpace = 'nowrap';
		buttons.style.alignItems = 'center';
		buttons.style.justifyContent = 'end';
		buttons.style.paddingTop = '10px';
		buttons.style.paddingBottom = '10px';
		buttons.style.boxSizing = 'border-box';

		if (helpLink != null && !editorUi.isOffline())
		{
			buttons.appendChild(editorUi.createHelpIcon(helpLink));
		}

		if (customButtons != null)
		{
			for (var i = 0; i < customButtons.length; i++)
			{
				(function(label, origFn, btnTitle)
				{
					var btn = mxUtils.button(label, function(e)
					{
						// Sync textarea from editor before calling button handler
						if (activeTab === 'editor' && latestEditorConfig != null)
						{
							textarea.value = JSON.stringify(latestEditorConfig, null, 2);
						}

						origFn(e, textarea);
					});

					if (btnTitle != null)
					{
						btn.setAttribute('title', btnTitle);
					}

					btn.className = 'geBtn';
					buttons.appendChild(btn);
				})(customButtons[i][0], customButtons[i][1], customButtons[i][2]);
			}
		}

		var closeBtn = mxUtils.button(mxResources.get('close'), function()
		{
			confirmDiscard(closeDialog);
		});

		closeBtn.setAttribute('title', 'Escape');
		closeBtn.className = 'geBtn';

		var applyBtn = mxUtils.button(mxResources.get('apply'), function()
		{
			var newValue;

			if (activeTab === 'editor')
			{
				newValue = (latestEditorConfig != null && Object.keys(latestEditorConfig).length > 0) ?
					JSON.stringify(latestEditorConfig, null, 2) : '';
			}
			else
			{
				newValue = textarea.value;
			}

			try
			{
				if (applyFn != null)
				{
					applyFn(newValue);
				}

				if (newValue == value)
				{
					modified = false;
					closeDialog();
				}
				else
				{
					if (newValue.length > 0)
					{
						var obj = JSON.parse(newValue);
						localStorage.setItem(key, JSON.stringify(obj));
					}
					else
					{
						localStorage.removeItem(key);
					}

					modified = false;
					closeDialog();
					editorUi.alert(mxResources.get('restartForChangeRequired'));
				}
			}
			catch (e)
			{
				editorUi.handleError(e);
			}
		});

		applyBtn.className = 'geBtn gePrimaryBtn';

		if (editorUi.editor.cancelFirst)
		{
			buttons.appendChild(closeBtn);
			buttons.appendChild(applyBtn);
		}
		else
		{
			buttons.appendChild(applyBtn);
			buttons.appendChild(closeBtn);
		}

		div.appendChild(buttons);

		// Ctrl+Enter to apply
		mxEvent.addListener(div, 'keydown', function(e)
		{
			if (e.keyCode === 13 && mxEvent.isControlDown(e))
			{
				applyBtn.click();
			}
		});

		var w = (customButtons != null && customButtons.length > 2) ? 500 : 440;
		editorUi.showDialog(div, 800, 600, true, false,
			function(cancel, isEsc)
			{
				if (allowClose || !modified)
				{
					return;
				}

				confirmDiscard(closeDialog);
				return false;
			}, null, null, new mxRectangle(0, 0, w, 400));

		textarea.scrollTop = 0;
	};

	/**
	 * Hides the current menu.
	 */
	EditorUi.prototype.showBackgroundImageDialog = function(apply, img, color, showColor)
	{
		apply = (apply != null) ? apply : mxUtils.bind(this, function(image, failed, color, shadowVisible)
		{
			if (!failed)
			{
				var change = new ChangePageSetup(this, (showColor) ? color : null, image);
				change.ignoreColor = !showColor;

				if (shadowVisible != null && showColor)
				{
					change.shadowVisible = shadowVisible;
				}
				
				this.editor.graph.model.execute(change);
			}
		});

		var dlg = new BackgroundImageDialog(this, apply, img, color, showColor);
		this.showDialog(dlg.container, 400, null, true, true);
		dlg.init();
	};

	/**
	 * Hides the current menu.
	 */
	EditorUi.prototype.showLibraryDialog = function(name, sidebar, images, file, mode)
	{
		var dlg = new LibraryDialog(this, name, sidebar, images, file, mode);
		
		this.showDialog(dlg.container, 640, 440, true, false, mxUtils.bind(this, function(cancel)
		{
			if (cancel && this.getCurrentFile() == null && urlParams['embed'] != '1')
			{
				this.showSplash();
			}
		}), false, false, new mxRectangle(0, 0, 480, 320));
		
		dlg.init();
	};

	EditorUi.prototype.getCollapsedSections = function()
	{
		return mxSettings.getCollapsedSections();
	};

	EditorUi.prototype.getLibraryExpanded = function(id, defaultExpanded)
	{
		var state = mxSettings.getCollapsedLibraries();

		return (state[id] != null) ? !state[id] : defaultExpanded;
	};

	EditorUi.prototype.setLibraryExpanded = function(id, expanded)
	{
		if (id != null)
		{
			var state = mxSettings.getCollapsedLibraries();
			state[id] = !expanded;
			mxSettings.setCollapsedLibraries(state);
			mxSettings.save();
		}
	};

	/**
	 * Overridden to update after view state changes.
	 */
	var editorUiCreateFormat = EditorUi.prototype.createFormat;
	
	EditorUi.prototype.createFormat = function(container)
	{
		var format = editorUiCreateFormat.apply(this, arguments);
		
		this.editor.graph.addListener('viewStateChanged', mxUtils.bind(this, function(evt)
		{
			if (this.editor.graph.isSelectionEmpty())
			{
				format.refresh();
			}
		}));
		
		return format;
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.handleError = function(resp, title, fn, invokeFnOnClose, notFoundMessage, fileHash, disableLogging)
	{
		var resume = (this.spinner != null && this.spinner.pause != null) ? this.spinner.pause() : function() {};
		var e = (resp != null && resp.error != null) ? resp.error : resp;

		// Handled errors are shown in the UI and logged to the console
		// but no longer sent to the server log (only uncaught errors are logged)
		if (resp != null && (urlParams['test'] == '1' || resp.stack != null) && resp.message != null)
		{
			try
			{
				//if (!disableLogging)
				//{
				//	EditorUi.logError('Caught: ' +
				//		((resp.message == '' && resp.name != null) ? resp.name : resp.message),
				//		resp.filename, resp.lineNumber, resp.columnNumber, resp, 'INFO');
				//}

				if ((urlParams['test'] == '1' || disableLogging) &&
					window.console != null)
				{
					console.error('EditorUi.handleError:', resp);
				}
			}
			catch (e)
			{
				// ignore
			}
		}
	
		if (e != null || title != null)
		{
			var msg = mxUtils.htmlEntities(mxResources.get('unknownError'), false);
			var btn = mxResources.get('ok');
			var retry = null;
			title = (title != null) ? title : mxResources.get('error');
			
			if (e != null)
			{
				if (e.retry != null)
				{
					btn = mxResources.get('cancel');
					retry = function()
					{
						resume();
						e.retry();
					};
				}
				
				if (e.code == 404 || e.status == 404 || e.code == 403)
				{
					if (e.code == 403)
					{
						if (e.message != null)
						{
							msg = mxUtils.htmlEntities(e.message, false);
						}
						else
						{
							msg = mxUtils.htmlEntities(mxResources.get('accessDenied'), false);
						}
					}
					else
					{
						msg = (notFoundMessage != null) ? notFoundMessage :
							mxUtils.htmlEntities(mxResources.get('fileNotFoundOrDenied') +
							((this.drive != null && this.drive.user != null) ?
								' (' + this.drive.user.email+ ')' : ''), false);
					}
					
					var id = (notFoundMessage != null) ? null : ((fileHash != null) ? fileHash : window.location.hash);
					
					// #U handles case where we tried to fallback to Google File and
					// hash property still shows the public URL we tried to load
					if (id != null && (id.substring(0, 2) == '#G' ||
						id.substring(0, 45) == '#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D') &&
						((resp != null && resp.error != null && ((resp.error.errors != null &&
						resp.error.errors.length > 0 && resp.error.errors[0].reason == 'fileAccess') ||
						(resp.error.data != null && resp.error.data.length > 0 &&
						resp.error.data[0].reason == 'fileAccess'))) ||
						e.code == 404 || e.status == 404))
					{
						id = (id.substring(0, 2) == '#U') ? id.substring(45, id.lastIndexOf('%26ex')) : id.substring(2);
						
						// Special case where the button must have a different label and function
						this.showError(title, msg, mxResources.get('tryOpeningViaThisPage'), mxUtils.bind(this, function()
						{
							this.editor.graph.openLink('https://drive.google.com/open?id=' + id);

							if (invokeFnOnClose != null)
							{
								invokeFnOnClose();
							}
						}), retry, mxResources.get('changeUser'), mxUtils.bind(this, function()
						{
							var driveUsers = this.drive.getUsersList();
							var div = document.createElement('div');

							var title = document.createElement('div');
							title.style.marginBottom = '6px';
							mxUtils.write(title, mxResources.get('changeUser') + ': ');
							div.appendChild(title);
							
							var usersSelect = document.createElement('select');
							usersSelect.style.width = '100%';
							
							//TODO This code is similar to Dialogs.js change user part in SplashDialog
							function fillUsersSelect()
							{
								usersSelect.innerText = '';
								
								for (var i = 0; i < driveUsers.length; i++)
								{
									var option = document.createElement('option');
									mxUtils.write(option, driveUsers[i].displayName);
									option.value = i;
									usersSelect.appendChild(option);
									//More info (email) about the user in a disabled option
									option = document.createElement('option');
									option.innerHTML = '&nbsp;&nbsp;&nbsp;';
									mxUtils.write(option, '<' + driveUsers[i].email + '>');
									option.setAttribute('disabled', 'disabled');
									usersSelect.appendChild(option);
								}
								
								//Add account option
								var option = document.createElement('option');
								mxUtils.write(option, mxResources.get('addAccount'));
								option.value = driveUsers.length;
								usersSelect.appendChild(option);
							}
							
							fillUsersSelect();
							
							mxEvent.addListener(usersSelect, 'change', mxUtils.bind(this, function()
							{
								var userIndex = usersSelect.value;
								var existingAccount = driveUsers.length != userIndex;
								
								if (existingAccount)
								{
									this.drive.setUser(driveUsers[userIndex]);
								}
								
								this.drive.authorize(existingAccount, mxUtils.bind(this, function()
								{
									if (!existingAccount) 
									{
										driveUsers = this.drive.getUsersList();
										fillUsersSelect();
									}
								}), mxUtils.bind(this, function(resp)
								{
									this.handleError(resp);
								}), true);
							}));
							
							div.appendChild(usersSelect);
							
							var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
							{
								this.loadFile(window.location.hash.substr(1), true);
							}));
							this.showDialog(dlg.container, 300, 100, true, true);
						}), mxResources.get('cancel'), mxUtils.bind(this, function()
						{
							this.hideDialog();
							
							if (fn != null)
							{
								fn();
							}
						}), 520, 150);

						return;
					}
				}
				
				if (e.message != null)
				{
					if (e.message == '' && e.name != null)
					{
						msg = mxUtils.htmlEntities(e.name, false);
					}
					else
					{
						msg = mxUtils.htmlEntities(e.message, false);
					}
				}
				else if (e.response != null && e.response.error != null)
				{
					msg = mxUtils.htmlEntities(e.response.error, false);
				}
				else if (typeof window.App !== 'undefined')
				{
					if (e.code == App.ERROR_TIMEOUT)
					{
						msg = mxUtils.htmlEntities(mxResources.get('timeout'), false);
					}
					else if (e.code == App.ERROR_BUSY)
					{
						msg = mxUtils.htmlEntities(mxResources.get('busy'), false);
					}
					else if (typeof e === 'string' && e.length > 0)
					{
						msg = mxUtils.htmlEntities(e, false);
					}
				}
			}
			
			var btn3 = null;
			var fn3 = null;
			
			if (e != null && e.helpLink != null)
			{
				btn3 = mxResources.get('help');
				
				fn3 = mxUtils.bind(this, function()
				{
					return this.editor.graph.openLink(e.helpLink);
				});
			}
			else if (e != null && e.ownerEmail != null)
			{
				btn3 = mxResources.get('contactOwner');
				
				msg += mxUtils.htmlEntities(' (' + btn3 + ': ' + e.ownerEmail + ')', false);
				
				fn3 = mxUtils.bind(this, function()
				{
					return this.openLink('mailto:' + mxUtils.htmlEntities(e.ownerEmail));
				});
			}
			else if (e != null && e.alternateAction != null)
			{
				btn3 = e.alternateAction.label;
				fn3 = e.alternateAction.funct;
			}
	
			// Optional per-error width override (eg. file-load errors widen the
			// dialog slightly to avoid an awkward wrap of the long parser message)
			this.showError(title, msg, btn, fn, retry, null, null, btn3, fn3,
				(e != null) ? e.dialogWidth : null, null, null, (invokeFnOnClose) ? fn : null);
		}
		else if (fn != null)
		{
			fn();
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.alert = function(msg, fn, optionalWidth)
	{
		var dlg = new ErrorDialog(this, null, msg, mxResources.get('ok'), fn);
		this.showDialog(dlg.container, optionalWidth || 340, 100, true, false);
		dlg.init();
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.confirm = function(msg, okFn, cancelFn, okLabel, cancelLabel, closable)
	{
		msg = (msg != null) ? msg : '';
		var resume = (this.spinner != null && this.spinner.pause != null) ? this.spinner.pause() : function() {};
		var height = Math.min(220, Math.ceil(Math.max(1, msg.length) / 50) * 28);
		
		var dlg = new ConfirmDialog(this, msg, function()
		{
			resume();
			
			if (okFn != null)
			{
				okFn();
			}
		}, function()
		{
			resume();
			
			if (cancelFn != null)
			{
				cancelFn();
			}
		}, okLabel, cancelLabel, null, null, null, null, height);
		
		this.showDialog(dlg.container, 340, 46 + height, true, closable);
		dlg.init();
	};
	
	/**
	 * Creates a popup banner.
	 */
	EditorUi.prototype.showBanner = function(id, text, onclick, doNotShowAgainOnClose, small, positionCss, t1, t2, to)
	{
		var result = false;
		
		if (!this.bannerShowing && !this['hideBanner' + id] &&
			(!isLocalStorage || mxSettings.settings == null ||
			mxSettings.settings['close' + id] == null))
		{
			positionCss = (positionCss != null) ? positionCss : 'bottom:10px;left:50%;';
			t1 = (t1 != null) ? t1 : 'translate(-50%,120%)';
			t2 = (t2 != null) ? t2 : 'translate(-50%,0%)';
			var delay = 1000;

			var banner = document.createElement('div');
			banner.className = 'geBtn gePrimaryBtn geBanner' + ((small) ? ' geSmallBanner' : '');
			banner.style.zIndex = mxPopupMenu.prototype.zIndex;
			mxUtils.setPrefixedStyle(banner.style, 'transform', t1);
			mxUtils.setPrefixedStyle(banner.style, 'transition', 'all ' + delay + 'ms ease');
			
			if (to != null)
			{
				mxUtils.setPrefixedStyle(banner.style, 'transform-origin', to);
			}

			var img = img = document.createElement('img');
			img.setAttribute('src', Editor.crossImage);
			img.setAttribute('title', mxResources.get((doNotShowAgainOnClose) ? 'doNotShowAgain' : 'close'));
			img.setAttribute('border', '0');
			
			if (!small)
			{
				var logo = document.createElement('img');
				logo.setAttribute('src', IMAGE_PATH + '/logo.png');
				logo.setAttribute('border', '0');
				logo.setAttribute('align', 'absmiddle');
				logo.style.cssText = 'margin-top:-4px;margin-left:8px;'+
					'margin-right:12px;width:26px;height:26px;';
				banner.appendChild(logo);

				img.style.cssText =  ((small) ? 'right:6px;top:9px;' :
					'right:10px;top:12px;') + 'position:absolute;filter:invert(1);padding:6px;margin:-6px;cursor:default;';
				banner.appendChild(img);
			}

			mxUtils.write(banner, text);
			document.body.appendChild(banner);
			this.bannerShowing = true;
			
			if (small)
			{
				img.className = 'geLibraryButton';
				banner.appendChild(img);
			}

			var div = document.createElement('div');
			div.style.cssText = 'display:flex;align-items:center;justify-content:center;' +
				'padding-top:6px;font-size:11px;text-align:center;font-weight:normal;';
			var chk = document.createElement('input');
			chk.setAttribute('type', 'checkbox');
			chk.setAttribute('id', 'geDoNotShowAgainCheckbox');
			chk.style.marginRight = '6px';
			
			if (!doNotShowAgainOnClose)
			{
				div.appendChild(chk);
				
				var label = document.createElement('label');
				label.setAttribute('for', 'geDoNotShowAgainCheckbox');
				mxUtils.write(label, mxResources.get('doNotShowAgain'));
				div.appendChild(label);
				banner.style.paddingBottom = (small) ? '16px' : '30px';
				banner.appendChild(div);
			}
			
			var onclose = mxUtils.bind(this, function()
			{
				if (banner.parentNode != null)
				{
					banner.parentNode.removeChild(banner);
					this.bannerShowing = false;
					
					if (chk.checked || doNotShowAgainOnClose)
					{
						this['hideBanner' + id] = true;
	
						if (isLocalStorage && mxSettings.settings != null)
						{
							mxSettings.settings['close' + id] = Date.now();
							mxSettings.save();
						}
					}
				}
			});
			
			if (img != null)
			{
				mxEvent.addListener(img, 'click', mxUtils.bind(this, function(e)
				{
					mxEvent.consume(e);
					onclose();
				}));
			}
			
			var hide = mxUtils.bind(this, function()
			{
				mxUtils.setPrefixedStyle(banner.style, 'transform', t1);
				
				window.setTimeout(mxUtils.bind(this, function()
				{
					onclose();
				}), delay);
			});
			
			mxEvent.addListener(banner, 'click', mxUtils.bind(this, function(e)
			{
				var source = mxEvent.getSource(e);
				
				if (source != chk && source != label)
				{
					if (onclick != null)
					{
						onclick();
					}
					
					onclose();
					mxEvent.consume(e);
				}
				else
				{
					hide();
				}
			}));
			
			window.setTimeout(mxUtils.bind(this, function()
			{
				mxUtils.setPrefixedStyle(banner.style, 'transform', t2);
			}), delay / 2);
			
			window.setTimeout(hide, (small) ? 5000 : 30000);
			result = true;
		}
		
		return result;
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.setCurrentFile = function(file)
	{
		if (file != null)
		{
			file.opened = new Date();
		}
		
		this.currentFile = file;
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getCurrentFile = function()
	{
		return this.currentFile;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.createImageDataUri = function(canvas, xml, format, dpi)
	{
		var data = canvas.toDataURL('image/' + format);
		
		// Checks for valid output
		if (data != null && data.length > 6)
		{
			if (xml != null)
			{
				data = Editor.writeGraphModelToPng(data, 'tEXt', 'mxfile', encodeURIComponent(xml));
			}
			
			if (dpi > 0)
			{
				data = Editor.writeGraphModelToPng(data, 'pHYs', 'dpi', dpi);
			}
		}
		else
		{
			throw {message: mxResources.get('unknownError')};
		}
		
		return data;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.saveCanvas = function(canvas, xml, format, ignorePageName, dpi)
	{
		var ext = ((format == 'jpeg') ? 'jpg' : format);
		var filename = this.getBaseFilename(ignorePageName) +
			((xml != null) ? '.drawio' : '') + '.' + ext;
   	    var data = this.createImageDataUri(canvas, xml, format, dpi);

   	    this.saveData(filename, ext, data.substring(data.lastIndexOf(',') + 1), 'image/' + format, true);
	};

	/**
	 * Shows the animated GIF export dialog.
	 */
	EditorUi.prototype.showAnimatedGifExportDialog = function()
	{
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';

		var hd = document.createElement('h3');
		mxUtils.write(hd, mxResources.get('formatAnimatedGif', null, 'Animated GIF'));
		hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
		div.appendChild(hd);

		// --- Settings section ---
		var section = document.createElement('div');
		section.className = 'geDialogSection';

		// Speed (FPS)
		var formRow = document.createElement('div');
		formRow.className = 'geDialogFormRow';
		var lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		mxUtils.write(lbl, mxResources.get('speed', null, 'Speed') + ':');
		formRow.appendChild(lbl);
		var fpsSelect = document.createElement('select');

		var fpsOptions = [
			{label: mxResources.get('slow', null, 'Slow'), value: 8},
			{label: mxResources.get('medium', null, 'Medium'), value: 15},
			{label: mxResources.get('fast', null, 'Fast'), value: 24}
		];

		for (var i = 0; i < fpsOptions.length; i++)
		{
			var opt = document.createElement('option');
			mxUtils.write(opt, fpsOptions[i].label);
			opt.setAttribute('value', fpsOptions[i].value);
			fpsSelect.appendChild(opt);
		}

		fpsSelect.value = (this.lastExportFps != null) ? this.lastExportFps : 15;

		if (fpsSelect.selectedIndex < 0)
		{
			fpsSelect.value = 15;
		}

		formRow.appendChild(fpsSelect);
		section.appendChild(formRow);

		// Zoom
		formRow = document.createElement('div');
		formRow.className = 'geDialogFormRow';
		lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		mxUtils.write(lbl, mxResources.get('zoom') + ':');
		formRow.appendChild(lbl);
		var zoomInput = document.createElement('input');
		zoomInput.setAttribute('type', 'text');
		zoomInput.value = this.lastExportZoom || '100%';
		formRow.appendChild(zoomInput);
		section.appendChild(formRow);

		// Border
		formRow = document.createElement('div');
		formRow.className = 'geDialogFormRow';
		lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		mxUtils.write(lbl, mxResources.get('borderWidth', null, 'Border Width') + ':');
		formRow.appendChild(lbl);
		var borderInput = document.createElement('input');
		borderInput.setAttribute('type', 'text');
		borderInput.value = this.lastExportBorder || '0';
		formRow.appendChild(borderInput);
		section.appendChild(formRow);

		// Loop
		formRow = document.createElement('div');
		formRow.className = 'geDialogFormRow';
		lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		mxUtils.write(lbl, mxResources.get('loops', null, 'Loops') + ':');
		formRow.appendChild(lbl);
		var loopSelect = document.createElement('select');

		var loopOptions = [
			{label: mxResources.get('forever', null, 'Forever'), value: 0},
			{label: '1', value: 1},
			{label: '3', value: 3},
			{label: '5', value: 5}
		];

		for (var i = 0; i < loopOptions.length; i++)
		{
			var opt = document.createElement('option');
			mxUtils.write(opt, loopOptions[i].label);
			opt.setAttribute('value', loopOptions[i].value);
			loopSelect.appendChild(opt);
		}

		loopSelect.value = (this.lastExportLoops != null) ? this.lastExportLoops : 0;

		if (loopSelect.selectedIndex < 0)
		{
			loopSelect.value = 0;
		}

		formRow.appendChild(loopSelect);
		section.appendChild(formRow);

		div.appendChild(section);

		// --- Options section ---
		var optSection = document.createElement('div');
		optSection.className = 'geDialogSection';

		var transparent = this.addCheckbox(optSection, mxResources.get('transparentBackground',
			null, 'Transparent Background'), (this.lastExportTransparent != null) ?
			this.lastExportTransparent : false, null, null, null, null, null, true);

		div.appendChild(optSection);

		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			var zoomVal = parseInt(zoomInput.value);

			if (isNaN(zoomVal) || zoomVal <= 0)
			{
				zoomVal = 100;
			}

			// Keeps manually changed settings for the session
			this.lastExportZoom = zoomVal + '%';
			this.lastExportBorder = borderInput.value;
			this.lastExportFps = (parseInt(fpsSelect.value) != 15) ?
				parseInt(fpsSelect.value) : null;
			this.lastExportLoops = (parseInt(loopSelect.value) != 0) ?
				parseInt(loopSelect.value) : null;
			this.lastExportTransparent = (transparent.checked) ? true : null;

			this.exportAnimatedGif({
				fps: parseInt(fpsSelect.value),
				scale: zoomVal / 100,
				border: parseInt(borderInput.value) || 0,
				repeat: parseInt(loopSelect.value),
				transparent: transparent.checked,
				background: transparent.checked ? null :
					((this.editor.graph.background != null &&
					  this.editor.graph.background != mxConstants.NONE) ?
						this.editor.graph.background : '#ffffff')
			});
		}), null, mxResources.get('export'),
			'https://www.drawio.com/doc/faq/export-diagram');

		this.showDialog(dlg.container, 360, null, true, true, null, null, null, null, true);
	};

	/**
	 * Exports the current diagram as an animated GIF.
	 */
	EditorUi.prototype.exportAnimatedGif = function(options)
	{
		if (this.spinner.spin(document.body, mxResources.get('exporting')))
		{
			try
			{
				var exp = new AnimatedGifExport(this);

				exp.doExport(options, mxUtils.bind(this, function(blob)
				{
					this.spinner.stop();

					if (blob != null)
					{
						var filename = this.getBaseFilename() + '.gif';

						if (typeof navigator.msSaveBlob === 'function')
						{
							navigator.msSaveBlob(blob, filename);
						}
						else
						{
							var a = document.createElement('a');
							a.href = URL.createObjectURL(blob);
							a.download = filename;
							document.body.appendChild(a);
							a.click();

							setTimeout(function()
							{
								document.body.removeChild(a);
								URL.revokeObjectURL(a.href);
							}, 0);
						}
					}
				}), mxUtils.bind(this, function(e)
				{
					this.spinner.stop();
					this.handleError(e);
				}));
			}
			catch (e)
			{
				this.spinner.stop();
				this.handleError(e);
			}
		}
	};

	/**
	 * Returns true if files should be saved using <saveLocalFile>.
	 */
	EditorUi.prototype.isLocalFileSave = function()
	{
		return ((urlParams['save'] != 'remote' &&
			typeof window.Blob !== 'undefined' && typeof window.URL !== 'undefined') ||
			this.isOfflineApp() || mxClient.IS_IOS);
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.showTextDialog = function(title, text)
	{
    	var dlg = new TextareaDialog(this, title, text, null, null, mxResources.get('close'));
		this.showDialog(dlg.container, 620, 460, true, true, null, null, null,
			new mxRectangle(0, 0, 440, 280), true);
		dlg.init();
		document.execCommand('selectall', false, null);
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.doSaveLocalFile = function(data, filename, mimeType, base64Encoded, format, defaultExtension)
	{
		// Appends .drawio extension for XML files with no extension
		// to avoid the browser to automatically append .xml instead
		if (mimeType == 'text/xml' &&
			!/(\.drawio)$/i.test(filename) &&
			!/(\.xml)$/i.test(filename) &&
			!/(\.svg)$/i.test(filename) &&
			!/(\.html)$/i.test(filename))
		{
			defaultExtension = (defaultExtension != null) ? defaultExtension : 'drawio';
			filename = filename + '.' + defaultExtension;
		}
		
		if (mxClient.IS_IOS && this.isOffline())
		{
			// Workaround for "WebKitBlobResource error 1" in mobile Safari
			if (!navigator.standalone && mimeType != null && mimeType.substring(0, 6) == 'image/')
			{
				this.openInNewWindow(data, mimeType, base64Encoded);
			}
			else
			{
				this.showTextDialog(filename + ':', data);
			}
		}
		else
		{
			var a = document.createElement('a');
			
			// Workaround for mxXmlRequest.simulate no longer working in PaleMoon
			// if this is used (ie PNG export broken after XML export in PaleMoon)
			// and for "WebKitBlobResource error 1" for all browsers on iOS.
			var useDownload = (navigator.userAgent == null ||
				navigator.userAgent.indexOf("PaleMoon/") < 0) &&
				typeof a.download !== 'undefined';
			
			// Workaround for Chromium 65 cross-domain anchor download issue
			if (mxClient.IS_GC && navigator.userAgent != null)
			{
				var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
				var vers = raw ? parseInt(raw[2], 10) : false;
				useDownload = vers == 65 ? false : useDownload;
			}
			
			if (useDownload || this.isOffline())
			{
				a.href = URL.createObjectURL((base64Encoded) ?
					this.base64ToBlob(data, mimeType) :
					new Blob([data], {type: mimeType}));
				
				if (useDownload)
				{
					a.download = filename;
				}
				else
				{
					// Workaround for same window in Safari
					a.setAttribute('target', '_blank');
				}

				document.body.appendChild(a);
				
				try
				{
					window.setTimeout(function()
					{
						URL.revokeObjectURL(a.href);
					}, 20000);

					a.click();
					a.parentNode.removeChild(a);
				}
				catch (e)
				{
					// ignore
				}
			}
			else
			{
				var req = this.createEchoRequest(data, filename, mimeType, base64Encoded, format);
				
				req.simulate(document, '_blank');
			}
		}
	};
		
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createEchoRequest = function(data, filename, mimeType, base64Encoded, format, base64Response)
	{
		var param = (typeof(pako) === 'undefined' || true) ? 'xml=' + encodeURIComponent(data) :
			'data=' + encodeURIComponent(Graph.compress(data));
		
		return new mxXmlRequest(SAVE_URL, param +
			((mimeType != null) ? '&mime=' + mimeType : '') +
			((format != null) ? '&format=' + format : '') +
			((base64Response != null) ? '&base64=' + base64Response : '') +
			((filename != null) ? '&filename=' + encodeURIComponent(filename) : '') +
			((base64Encoded) ? '&binary=1' : ''));
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.saveLocalFile = function(data, filename, mimeType, base64Encoded, format, allowBrowser, allowTab, defaultExtension, defaultMode)
	{
		allowBrowser = (allowBrowser != null) ? allowBrowser : false;
		allowTab = (allowTab != null) ? allowTab : (format != 'vsdx') && (!mxClient.IS_IOS || !navigator.standalone);

		var saveFunction = mxUtils.bind(this, function(newTitle, mode, input, folderId)
		{
			try
			{
				// Opens a new window
				if (mode == '_blank')
				{
					if (mimeType != null && mimeType.substring(0, 6) == 'image/')
					{
						this.openInNewWindow(data, mimeType, base64Encoded);
					}
					else if (mimeType != null && mimeType.substring(0, 9) == 'text/html')
					{
						var dlg = new EmbedDialog(this, data);
						this.showDialog(dlg.container, 450, 270, true, true, null,
							false, null, new mxRectangle(0, 0, 400, 250));
						dlg.init();
					}
					else
					{
						var win = window.open('about:blank');
						
						if (win == null)
						{
							mxUtils.popup(data, true);
						}
						else
						{
							win.document.write('<pre>' + mxUtils.htmlEntities(data, false) + '</pre>');
							win.document.close();
						}
					}
				}
				else if (mode == App.MODE_DEVICE || mode == 'download')
				{
					this.doSaveLocalFile(data, newTitle, mimeType, base64Encoded, null, defaultExtension);
				} 
				else if (newTitle != null && newTitle.length > 0)
				{
					var saveFile = mxUtils.bind(this, function(folderId)
					{
						try
						{
							this.exportFile(data, newTitle, mimeType, base64Encoded, mode, folderId);
						}
						catch (e)
						{
							this.handleError(e);
						}
					});

					if (folderId != null)
					{
						saveFile(folderId);
					}
					else
					{
						this.pickFolder(mode, saveFile);
					}
				}
			}
			catch (e)
			{
				this.handleError(e);
			}
		});
		
		var disabled = [];

		if (!allowBrowser)
		{
			disabled.push(App.MODE_BROWSER);
		}

		if (!allowTab)
		{
			disabled.push('_blank');
		}

		var dlg = new SaveDialog(this, filename, mxUtils.bind(this, function(input, mode, folderId)
		{
			saveFunction(input.value, mode, input, folderId);
			this.hideDialog(null, null, dlg.container);
		}), disabled, data, mimeType, base64Encoded, defaultMode);

		this.showDialog(dlg.container, 420, 110, true, false, mxUtils.bind(this, function()
		{
			this.hideDialog();
		}));
		
		dlg.init();
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.openInNewWindow = function(data, mimeType, base64Encoded)
	{
		var win = window.open('about:blank');
		
		if (win == null || win.document == null)
		{
			mxUtils.popup(data, true);
		}
		else
		{
			var bg = 'background: light-dark(rgb(255, 255, 255), rgb(18, 18, 18))';

			// Extracs background color from SVG style
			if (mimeType == 'image/svg+xml')
			{
				var doc = mxUtils.parseXml(data);
				var temp = doc.documentElement.style.backgroundColor;

				if (temp != '')
				{
					bg = 'background: ' + temp + ';';
				}
			}
			
			var prefix = '<html><head><meta charset="UTF-8"></head><body ' +
				'style="color-scheme: light dark; ' + bg + '">';

			if (mimeType == 'image/svg+xml' && !mxClient.IS_SVG)
			{
				win.document.write(prefix + '<pre>' + mxUtils.htmlEntities(data, false) + '</pre></body></html>');
				win.document.close();
			}
			else
			{
				if (mimeType == 'image/svg+xml' && !base64Encoded)
				{
					win.document.write(prefix + data + '</body></html>');
				}
				else
				{
					var temp = (base64Encoded) ? data : btoa(unescape(encodeURIComponent(data)));
				
					win.document.write(prefix + '<img style="max-width:100%;" src="data:' +
						mimeType  + ';base64,' + temp + '"/></body></html>');
				}
				
				win.document.close();
			}
		}
	};
	
	var editoUiAddChromelessToolbarItems = EditorUi.prototype.addChromelessToolbarItems;

	/**
	 * Image export in viewer is only allowed for same domain or hosted environments
	 * but disabled to avoid cross domain image export in canvas which isn't allowed.
	 */
	EditorUi.prototype.isChromelessImageExportEnabled = function()
	{
		return this.getServiceName() != 'draw.io' ||
			/.*\.draw\.io$/.test(window.location.hostname) ||
			/.*\.diagrams\.net$/.test(window.location.hostname);
	};

	/**
	 * Creates a temporary graph instance for rendering off-screen content.
	 */
	EditorUi.prototype.addChromelessToolbarItems = function(addButton)
	{
		if (urlParams['tags'] != null)
		{
			// Applies initial hidden tags from URL parameter
			var tagsParam = null;

			try
			{
				var tagsValue = urlParams['tags'];

				try
				{
					tagsValue = decodeURIComponent(tagsValue);
				}
				catch (e)
				{
					// Already decoded
				}

				tagsParam = JSON.parse(tagsValue);
			}
			catch (e)
			{
				// Ignore parse errors
			}

			if (tagsParam != null)
			{
				var graph = this.editor.graph;

				var applyHiddenTags = mxUtils.bind(this, function()
				{
					var id = (this.currentPage != null) ?
						this.currentPage.getId() : 0;
					var tags = tagsParam[id];
					graph.hiddenTags = (tags != null && tags.length > 0) ? tags : [];
					graph.refresh();
				});

				// Applies after file is loaded and refits since
				// lightboxFit ran before tags were applied
				this.editor.addListener('fileLoaded', mxUtils.bind(this, function()
				{
					applyHiddenTags();

					if (graph.isLightboxView())
					{
						this.lightboxFit();
					}

					if (this.chromelessResize)
					{
						this.chromelessResize();
					}
				}));

				// Updates hidden tags on page switch
				this.editor.addListener('pageSelected', applyHiddenTags);
			}

			this.tagsComponent = null;
			this.tagsDialog = null;
					
			var tagsButton = addButton(mxUtils.bind(this, function(evt)
			{
				if (this.tagsComponent == null)
				{
					this.tagsComponent = this.editor.graph.createTagsDialog(mxUtils.bind(this, function()
					{
						return this.tagsDialog != null;
					}), true);

					this.tagsComponent.div.getElementsByTagName('div')[0].style.position = '';
					mxUtils.setPrefixedStyle(this.tagsComponent.div.style, 'borderRadius', '5px');
					this.tagsComponent.div.style.maxHeight = '160px';
					this.tagsComponent.div.style.maxWidth = '120px';
					this.tagsComponent.div.style.padding = '4px';
					this.tagsComponent.div.style.overflow = 'auto';
					this.tagsComponent.div.style.height = 'auto';
					this.tagsComponent.div.style.position = 'fixed';
					this.tagsComponent.div.style.fontFamily = Editor.defaultHtmlFont;
					this.tagsComponent.div.style.backgroundColor = '#000000';
					this.tagsComponent.div.style.color = '#ffffff';
					mxUtils.setOpacity(this.tagsComponent.div, 80);
				}

				if (this.tagsDialog != null)
				{
					this.tagsDialog.parentNode.removeChild(this.tagsDialog);
					this.tagsDialog = null;
				}
				else
				{
					this.tagsDialog = this.tagsComponent.div;

					mxEvent.addListener(this.tagsDialog, 'mouseleave', mxUtils.bind(this, function()
					{
						if (this.tagsDialog != null)
						{
							this.tagsDialog.parentNode.removeChild(this.tagsDialog);
							this.tagsDialog = null;
						}
					}));
					
					var r = tagsButton.getBoundingClientRect();
					this.tagsDialog.style.left = r.left + 'px';
					this.tagsDialog.style.bottom = parseInt(this.chromelessToolbar.style.bottom) +
						this.chromelessToolbar.offsetHeight + 4 + 'px';
					
					// Puts the dialog on top of the container z-index
					var style = mxUtils.getCurrentStyle(this.editor.graph.container);
					this.tagsDialog.style.zIndex = style.zIndex;
					document.body.appendChild(this.tagsDialog);

					this.tagsComponent.refresh();
					this.editor.fireEvent(new mxEventObject('tagsDialogShown'));
				}
				
				mxEvent.consume(evt);
			}), Editor.tagsImage, mxResources.get('tags'));

			// Shows/hides tags button depending on content
			var model = this.editor.graph.getModel();

			model.addListener(mxEvent.CHANGE, mxUtils.bind(this, function()
			{
				var tags = this.editor.graph.getAllTags();
				tagsButton.style.display = (tags.length > 0) ? '' : 'none';
			}));
		}
	
		editoUiAddChromelessToolbarItems.apply(this, arguments);

		this.editor.addListener('tagsDialogShown', mxUtils.bind(this, function()
		{
			if (this.layersDialog != null)
			{
				this.layersDialog.parentNode.removeChild(this.layersDialog);
				this.layersDialog = null;
			}
		}));

		this.editor.addListener('layersDialogShown', mxUtils.bind(this, function()
		{
			if (this.tagsDialog != null)
			{
				this.tagsDialog.parentNode.removeChild(this.tagsDialog);
				this.tagsDialog = null;
			}
		}));

		this.editor.addListener('pageSelected', mxUtils.bind(this, function()
		{
			if (this.tagsDialog != null)
			{
				this.tagsDialog.parentNode.removeChild(this.tagsDialog);
				this.tagsDialog = null;
			}
			
			if (this.layersDialog != null)
			{
				this.layersDialog.parentNode.removeChild(this.layersDialog);
				this.layersDialog = null;
			}
		}));

		mxEvent.addListener(this.editor.graph.container, 'click', mxUtils.bind(this, function()
		{
			if (this.tagsDialog != null)
			{
				this.tagsDialog.parentNode.removeChild(this.tagsDialog);
				this.tagsDialog = null;
			}
			
			if (this.layersDialog != null)
			{
				this.layersDialog.parentNode.removeChild(this.layersDialog);
				this.layersDialog = null;
			}
		}));

		if (this.editor.isExportToCanvas() && this.isChromelessImageExportEnabled() && urlParams['noExport'] != '1')
		{
			this.exportDialog = null;

			var exportButton = addButton(mxUtils.bind(this, function(evt)
			{
				var clickHandler = mxUtils.bind(this, function()
				{
					mxEvent.removeListener(this.editor.graph.container, 'click', clickHandler);
					
					if (this.exportDialog != null)
					{
						this.exportDialog.parentNode.removeChild(this.exportDialog);
						this.exportDialog = null;
					}
				});
				
				if (this.exportDialog != null)
				{
					clickHandler.apply(this);
				}
				else
				{
					this.exportDialog = document.createElement('div');
					var r = exportButton.getBoundingClientRect();
					
					mxUtils.setPrefixedStyle(this.exportDialog.style, 'borderRadius', '5px');
					this.exportDialog.style.position = 'fixed';
					this.exportDialog.style.textAlign = 'center';
					this.exportDialog.style.fontFamily = Editor.defaultHtmlFont;
					this.exportDialog.style.backgroundColor = '#000000';
					this.exportDialog.style.width = '50px';
					this.exportDialog.style.height = '50px';
					this.exportDialog.style.padding = '4px 2px 4px 2px';
					this.exportDialog.style.color = '#ffffff';
					mxUtils.setOpacity(this.exportDialog, 80);
					this.exportDialog.style.left = r.left + 'px';
					this.exportDialog.style.bottom = parseInt(this.chromelessToolbar.style.bottom) +
						this.chromelessToolbar.offsetHeight + 4 + 'px';
					
					// Puts the dialog on top of the container z-index
					var style = mxUtils.getCurrentStyle(this.editor.graph.container);
					this.exportDialog.style.zIndex = style.zIndex;
					
					var spinner = new Spinner({
						lines: 8, // The number of lines to draw
						length: 6, // The length of each line
						width: 5, // The line thickness
						radius: 6, // The radius of the inner circle
						rotate: 0, // The rotation offset
						color: 'light-dark(#000000, #C0C0C0)', // #rgb or #rrggbb
						speed: 1.5, // Rounds per second
						trail: 60, // Afterglow percentage
						shadow: false, // Whether to render a shadow
						hwaccel: false, // Whether to use hardware acceleration
						top: '28px',
						zIndex: 2e9 // The z-index (defaults to 2000000000)
					});

					spinner.spin(this.exportDialog);
				   	document.body.appendChild(this.exportDialog);
					mxEvent.addListener(this.editor.graph.container, 'click', clickHandler);
					
				   	this.editor.exportToCanvas(mxUtils.bind(this, function(canvas)
				   	{
				   		spinner.stop();
				   		
						this.exportDialog.style.width = 'auto';
						this.exportDialog.style.height = 'auto';
						this.exportDialog.style.padding = '10px';
				   		
			   	   	    var data = this.createImageDataUri(canvas, null, 'png');
			   	   	    var img = document.createElement('img');
			   	   	    
			   	   	    img.style.maxWidth = '140px';
			   	   	    img.style.maxHeight = '140px';
			   	   	    img.style.cursor = 'pointer';
			   	   	    img.style.backgroundColor = 'white';
			   	   	    
			   	   	    img.setAttribute('title', mxResources.get('openInNewWindow'));
			   	   	    img.setAttribute('border', '0');
			   	   	    img.setAttribute('src', data);
			   	   	    
			   	   	    this.exportDialog.appendChild(img);

						mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
						{
							this.openInNewWindow(data.substring(data.indexOf(',') + 1), 'image/png', true);
							clickHandler.apply(this, arguments);
						}));
				   	}), null, this.thumbImageCache, null, mxUtils.bind(this, function(e)
				   	{
				   		spinner.stop();
						
						if (this.exportDialog != null && this.exportDialog.parentNode != null)
						{
							this.exportDialog.parentNode.removeChild(this.exportDialog);
							this.exportDialog = null;
						}

				   		this.handleError(e);
				   	}), null, null, null, null, null, null, null, Editor.defaultBorder);
				}
				
				mxEvent.consume(evt);
			}), Editor.cameraImage, mxResources.get('export'));
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.saveData = function(filename, format, data, mime, base64Encoded, defaultMode)
	{
		if (urlParams['embed'] == '1' && urlParams['proto'] == 'json' && this.embedExportProtocol)
		{
			var parent = this.embedMessageSource || window.opener || window.parent;
			var msg = this.createLoadMessage('export');
			msg.format = format;
			msg.filename = filename;
			msg.data = base64Encoded ? 'data:' + mime + ';base64,' + data : data;
			msg.xml = this.getFileData(true);
			parent.postMessage(JSON.stringify(msg), '*');

			return;
		}

		if (this.isLocalFileSave())
		{
			this.saveLocalFile(data, filename, mime, base64Encoded, format, defaultMode);
		}
		else
		{
			this.saveRequest(filename, format, mxUtils.bind(this, function(newTitle, base64)
			{
				return this.createEchoRequest(data, newTitle, mime, base64Encoded, format, base64);
			}), data, base64Encoded, mime);
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * Last 3 argument are optional and must only be used if the data can be stored as is on the client
	 * side without requiring a server roundtrip.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.saveRequest = function(filename, format, fn, data, base64Encoded, mimeType, allowTab)
	{
		allowTab = (allowTab != null) ? allowTab : !mxClient.IS_IOS || !navigator.standalone;

		var saveFunction = mxUtils.bind(this, function(newTitle, mode, input, folderId)
		{
			if (mode == '_blank' || newTitle != null && newTitle.length > 0)
			{
				var base64 = (mode == App.MODE_DEVICE || mode == 'download' || mode == null || mode == '_blank') ? '0' : '1';
				var xhr = fn((mode == '_blank') ? null : newTitle, base64);
				
				if (xhr != null)
				{
					if (mode == App.MODE_DEVICE || mode == 'download' || mode == '_blank')
					{
						xhr.simulate(document, '_blank');
					}
					else
					{
						var doSave = mxUtils.bind(this, function(folderId)
						{
							mimeType = (mimeType != null) ? mimeType : ((format == 'pdf') ?
								'application/pdf' : 'image/' + format);
							
							// Workaround for no roundtrip required if data is available on client-side
							// TODO: Refactor the saveData/saveRequest call chain for local data
							if (data != null)
							{
								try
								{
									this.exportFile(data, newTitle, mimeType, true, mode, folderId);
								}
								catch (e)
								{
									this.handleError(e);
								}
							}
							else if (this.spinner.spin(document.body, mxResources.get('saving')))
							{
								// LATER: Catch possible mixed content error
								// see http://stackoverflow.com/questions/30646417/catching-mixed-content-error
								xhr.send(mxUtils.bind(this, function()
								{
									this.spinner.stop();
									
									if (xhr.getStatus() >= 200 && xhr.getStatus() <= 299)
									{
										try
										{
											this.exportFile(xhr.getText(), newTitle, mimeType, true, mode, folderId);
										}
										catch (e)
										{
											this.handleError(e);
										}
									}
									else
									{
										this.handleError({message: mxResources.get('errorSavingFile')});
									}
								}), mxUtils.bind(this, function(resp)
								{
									this.spinner.stop();
									this.handleError(resp);
								}));
							}
						});

						if (folderId != null)
						{
							doSave(folderId);
						}
						else
						{
							this.pickFolder(mode, doSave);
						}
					}
				}
			}
		});
		
		var disabled = [App.MODE_BROWSER];

		if (!allowTab)
		{
			disabled.push('_blank');
		}

		var dlg = new SaveDialog(this, filename, mxUtils.bind(this, function(input, mode, folderId)
		{
			saveFunction(input.value, mode, input, folderId);
			this.hideDialog(null, null, dlg.container);
		}), disabled, null, 'application/pdf');

		this.showDialog(dlg.container, 420, 110, true, false, mxUtils.bind(this, function()
		{
			this.hideDialog();
		}));

		dlg.init();
	};

	/**
	 * Returns whether or not any services should be shown in dialogs
	 */
	EditorUi.prototype.isServices = function(count)
	{
		var noServices = 1; //(mxClient.IS_IOS) ? 0 : 1;
		return count != noServices;
	};

	/**
	 * 
	 */
	EditorUi.prototype.getEditBlankXml = function()
	{
		return this.getFileData(true);
	};
		
	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.exportFile = function(data, filename, mimeType, base64Encoded, mode, folderId)
	{
		// do nothing
	};

	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.getServiceForName = function(name)
	{
		return null;
	};
	
	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.getTitleForService = function(name)
	{
		return mxResources.get(name);
	};

	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.pickFolder = function(mode, fn, enabled)
	{
		fn(null);
	};

	/**
	 *
	 */
	EditorUi.prototype.exportSvg = function(scale, transparentBackground, ignoreSelection, addShadow,
		editable, embedImages, border, noCrop, currentPage, linkTarget, theme, exportType,
		embedFonts, saveFn, addSvgData, grid)
	{
		if (this.spinner.spin(document.body, mxResources.get('exporting'), mxUtils.bind(this, function(err)
			{
				Editor.addRetryToError(err, mxUtils.bind(this, function()
				{
					this.exportSvg(scale, transparentBackground, ignoreSelection, addShadow,
						editable, embedImages, border, noCrop, currentPage, linkTarget,
						theme, exportType, embedFonts, saveFn, addSvgData, grid);
				}));
				
				this.handleError(err);
			})))
		{
			try
			{
				var selectionEmpty = this.editor.graph.isSelectionEmpty();
				ignoreSelection = (ignoreSelection != null) ? ignoreSelection : selectionEmpty;
				var bg = (transparentBackground) ? null : this.editor.graph.background;
				
				if (bg == mxConstants.NONE)
				{
					bg = null;
				}
				
				// Handles special case where background is null but transparent is false
				if (bg == null && transparentBackground == false)
				{
					bg = this.editor.graph.shapeBackgroundColor;
				}
				
				// Removes global foreignObject warning if image fallback is added for text
				var graphAddForeignObjectWarning = this.editor.graph.addForeignObjectWarning;

				if (Editor.foreignObjectImages)
				{
					this.editor.graph.addForeignObjectWarning = function() {};
				}

				var prevLightDarkColorSupported = mxUtils.lightDarkColorSupported;
				var prevPreferDarkColor = mxUtils.preferDarkColor;
				
				if (theme == 'light' || theme == 'dark')
				{
					mxUtils.lightDarkColorSupported = false;
					mxUtils.preferDarkColor = theme == 'dark';
				}

				// Uses temporary font lookup for export
				var prevAddFont = Graph.addFont;
				var tempFontLookup = {};

				Graph.addFont = function(name, url, callback, elementLookup)
				{
					prevAddFont.call(this, name, url, callback, tempFontLookup);
				};

				var imgExport = this.editor.graph.createSvgImageExport(editable, addSvgData);

				// Adds font to temporary font lookup
				var prevDrawCellState = imgExport.drawCellState;

				imgExport.drawCellState = function(state, canvas)
				{
					if (state != null)
					{
						Graph.processFontStyle(state.style);
					}

					prevDrawCellState.apply(this, arguments);
				};

				var svgRoot = this.editor.graph.getSvg(bg, scale, border, noCrop, null,
					ignoreSelection, null, imgExport, (linkTarget == 'blank') ? '_blank' :
					((linkTarget == 'self') ? '_top' : null), null, !embedFonts,
					theme, exportType, null, null, null, grid);
				
				mxUtils.lightDarkColorSupported = prevLightDarkColorSupported;
				mxUtils.preferDarkColor = prevPreferDarkColor;
				this.editor.graph.addForeignObjectWarning = graphAddForeignObjectWarning;
				
				if (addShadow)
				{
					this.editor.graph.addSvgShadow(svgRoot);
				}
				
				var filename = this.getBaseFilename() + ((editable) ? '.drawio' : '') + '.svg';

				saveFn = (saveFn != null) ? saveFn : mxUtils.bind(this, function(svg)
				{
		    		if (this.isLocalFileSave() || svg.length <= MAX_REQUEST_SIZE)
		    		{
		    			this.saveData(filename, 'svg', svg, 'image/svg+xml');
		    		}
		    		else
		    		{
		    			this.handleError({message: mxResources.get('drawingTooLarge')},
							mxResources.get('error'), mxUtils.bind(this, function()
						{
							mxUtils.popup(svg);
						}));
					}
				});
	
				var doSave = mxUtils.bind(this, function(svgRoot)
				{
					this.spinner.stop();
					
					if (editable)
					{
						svgRoot.setAttribute('content', this.getFileData(true, null, null,
							null, ignoreSelection, currentPage, null, null, null, null,
							null, scale, border));
					}

					saveFn(Graph.xmlDeclaration + '\n' + ((editable) ?
						Graph.svgFileComment + '\n' : '') +
						Graph.svgDoctype + '\n' +
						mxUtils.getXml(svgRoot));
				});

				// Adds CSS
				if (this.editor.graph.mathEnabled)
				{
					this.editor.addMathCss(svgRoot);
				}
				
				// Replaces alternate content
				var processResult = mxUtils.bind(this, function(svgRoot)
				{
					// Fixes ignored SVG data URIs for Office
					if (Editor.replaceSvgDataUris && embedImages)
					{
						EditorUi.embedSvgImages(svgRoot);
					}

					// Improves foreignObject fallback for Office/Inkscape
					if (Editor.foreignObjectImages && embedFonts)
					{
						this.replaceAlternateContent(svgRoot, theme, doSave);
					}
					else
					{
						doSave(svgRoot);
					}
				});

				// Uses temporary font lookup for export
				var prevCustomFontElements = Graph.customFontElements;
				Graph.customFontElements = tempFontLookup;
				
				var done = mxUtils.bind(this, function(svgRoot)
				{
					// Restores global state
					Graph.customFontElements = prevCustomFontElements
					Graph.addFont = prevAddFont;

					if (embedImages && !this.isOffline() && Editor.canvasSupported)
					{
						// Caches images
						if (this.thumbImageCache == null)
						{
							this.thumbImageCache = new Object();
						}
						
						this.editor.convertImages(svgRoot, processResult, this.thumbImageCache);
					}
					else
					{
						processResult(svgRoot);
					}
				});

				if (embedFonts)
				{
					this.embedFonts(svgRoot, done, true);
				}
				else
				{
					this.editor.addFontCss(svgRoot);
					done(svgRoot);
				}
			}
			catch (e)
			{
				this.handleError(e);
			}
		}
	};
	
	/**
	 * Replaces SVG data URIs in images with the actual SVG for
	 * the images to be supported in apps like Powerpoint.
	 */
	EditorUi.prototype.replaceAlternateContent = function(root, theme, callback)
	{
		// Collects CSS
		var css = '';

		var styles = root.getElementsByTagName('style');

		for (var i = 0; i < styles.length; i++)
		{
			css += styles[i].innerHTML;
		}
		
		// Replaces alternate content with image of text
		var switches = root.getElementsByTagName('switch');
		counter = switches.length;

		var done = mxUtils.bind(this, function()
		{
			counter--;

			if (counter == 0)
			{
				callback(root);
			}
		});

		// Caching for HTML size and images
		var sizeCache = {};
		var imgCache = {};
		var convert = [];

		function replaceElt(switchElt, x, y, size, src)
		{
			var node = mxUtils.createElementNs(root.ownerDocument,
				mxConstants.NS_SVG, 'image');
			
			node.setAttribute('x', x);
			node.setAttribute('y', y + 0.5);
			node.setAttribute('width', size.width);
			node.setAttribute('height', size.height);

			// Workaround for missing namespace support
			if (node.setAttributeNS == null)
			{
				node.setAttribute('xlink:href', src);
			}
			else
			{
				node.setAttributeNS(mxConstants.NS_XLINK, 'xlink:href', src);
			}
			
			switchElt.replaceChild(node, switchElt.lastChild);
			done();
		};

		// Create an image for the given foreignObject
		for (var i = 0; i < switches.length; i++)
		{
			(mxUtils.bind(this, function(switchElt)
			{
				var divs = switchElt.getElementsByTagName('div');

				if (divs.length > 0)
				{
					try
					{
						var temp = divs[0].cloneNode(true);
						var x = parseInt(temp.style.marginLeft);
						var y = parseInt(temp.style.paddingTop);
						var measure = temp.getElementsByTagName('div')[1];

						var rl = false;
						var vertical = false;
						var alignItems = temp.style.alignItems;
						var justifyContent = temp.style.justifyContent;

						if (temp.style.writingMode != null)
						{
							var writingMode = temp.style.writingMode;
							vertical = writingMode.substring(0, 9) == 'vertical-';
							rl = writingMode.substring(writingMode.length - 3) == '-rl';
						}

						var h1 = (!vertical && temp.style.height == '1px') ||
							(vertical && temp.style.width == '1px');
						var w1 = (!vertical && temp.style.width == '1px') ||
							(vertical && temp.style.height == '1px');

						if (h1)
						{
							if (vertical && rl)
							{
								temp.style.alignItems = 'unsafe flex-end';
							}
							else
							{
								temp.style.alignItems = 'unsafe flex-start';
							}
						}

						if (w1)
						{
							temp.style.justifyContent = 'unsafe flex-start';
						}

						temp.style.paddingTop = '';
						temp.style.marginLeft = '';

						var html = temp.outerHTML;
						var size = sizeCache[html];

						if (size == null)
						{
							temp.style.position = 'absolute';
							temp.style.visibility = 'hidden'; 
							document.body.appendChild(temp);

							var w = 1;

							if (temp.style.width == '1px')
							{
								w = measure.offsetWidth;
							}
							else
							{
								w = parseInt(temp.style.width);
							}

							var h = 1;

							if (temp.style.height == '1px')
							{
								h = measure.offsetHeight;
							}
							else
							{
								h = parseInt(temp.style.height);
							}

							document.body.removeChild(temp);
							size = new mxRectangle(x, y, w, h);
							sizeCache[html] = size;
						}
						
						if (temp.style.height == '1px')
						{
							if (alignItems == 'unsafe center')
							{
								y -= size.height / 2;
							}
							else if (alignItems == 'unsafe flex-end')
							{
								y -= size.height;
							}
						}
						
						if (temp.style.width == '1px')
						{
							if ((!vertical && justifyContent == 'unsafe center') ||
								(vertical && alignItems == 'unsafe center'))
							{
								x -= size.width / 2;
							}
							else if ((!vertical && justifyContent == 'unsafe flex-end') ||
								(vertical && ((!rl && alignItems == 'unsafe flex-end') ||
								(rl && alignItems == 'unsafe flex-start'))))
							{
								x -= size.width;
							}
						}

						// Adds padding for font metrics
						size = new mxRectangle(x, y, size.width, size.height +
							(parseInt(measure.style.fontSize) / 4));

						// Sequence of async conversion to images
						convert.push(mxUtils.bind(this, function(next)
						{
							var cachedSrc = imgCache[html];

							if (cachedSrc == null)
							{
								Graph.htmlToPng(html, size.width, size.height, mxUtils.bind(this, function(src)
								{
									replaceElt(switchElt, x, y, size, src);
									imgCache[html] = src;
									next();
								}), css);
							}
							else
							{
								replaceElt(switchElt, x, y, size, cachedSrc);
								next();
							}
						}));
					}
					catch (e)
					{
						done();
					}
				}
				else
				{
					done();
				}
			}))(switches[i]);
		}

		if (counter == 0)
		{
			callback(root);
		}
		
		var i = 0;

		function next()
		{
			if (i < convert.length)
			{
				convert[i++](next);
			}
		};

		next();
	};

	/**
	 * 
	 */
	EditorUi.prototype.addRadiobox = function(div, radioGroupName, label, checked, disabled, disableNewline, visible)
	{
		return this.addCheckbox(div, label, checked, disabled, disableNewline, visible, true, radioGroupName);
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.addCheckbox = function(div, label, checked, disabled, disableNewline, visible, asRadio, radioGroupName, useCheckRow)
	{
		visible = (visible != null) ? visible : true;

		var cb = document.createElement('input');
		cb.style.marginRight = '8px';
		cb.setAttribute('type', asRadio? 'radio' : 'checkbox');
		var id = 'geCheckbox-' + Editor.guid();
		cb.id = id;

		if (radioGroupName != null)
		{
			cb.setAttribute('name', radioGroupName);
		}

		if (checked)
		{
			cb.setAttribute('checked', 'checked');
			cb.defaultChecked = true;
		}

		if (disabled)
		{
			cb.setAttribute('disabled', 'disabled');
		}

		if (visible)
		{
			if (useCheckRow)
			{
				var row = document.createElement('div');
				row.className = 'geDialogCheckRow';
				row.appendChild(cb);

				var lbl = document.createElement('label');
				mxUtils.write(lbl, label);
				lbl.setAttribute('for', id);
				row.appendChild(lbl);

				div.appendChild(row);
				cb.checkRow = row;
			}
			else
			{
				cb.style.marginTop = '16px';
				div.appendChild(cb);

				var lbl = document.createElement('label');
				mxUtils.write(lbl, label);
				lbl.setAttribute('for', id);
				div.appendChild(lbl);

				if (!disableNewline)
				{
					mxUtils.br(div);
				}
			}
		}

		return cb;
	};

	/**
	 * Appends an "Advanced" collapsible section to the given container. Returns the
	 * inner content element to which callers append rows. The dialog grows naturally
	 * when expanded because showDialog is called with null height.
	 */
	EditorUi.prototype.addAdvancedSection = function(parent, labelKey)
	{
		var title = document.createElement('div');
		title.className = 'geCollapsibleTitle';
		mxUtils.write(title, mxResources.get(labelKey || 'advanced'));

		var contentWrapper = document.createElement('div');
		contentWrapper.className = 'geCollapsibleContent geCollapsed';

		var content = document.createElement('div');
		content.className = 'geDialogSection';
		contentWrapper.appendChild(content);

		var setExpanded = function(value)
		{
			if (value === title.classList.contains('geExpanded'))
			{
				return;
			}

			title.classList.toggle('geExpanded');
			contentWrapper.classList.toggle('geCollapsed');

			// Dialog height is measured once at construction from scrollHeight,
			// so re-compute it against the outer wrapper whenever we expand or
			// collapse — otherwise the new rows are clipped by overflow:hidden.
			// Clear the explicit height first so the wrapper can flow to its
			// natural size; the flex layout inside CustomDialog otherwise
			// reports the constrained (shrunk) height back. CSS max-height:100%
			// still caps the visible dialog to the viewport.
			var dlg = title.closest('.geDialog');

			if (dlg != null)
			{
				var wrapper = dlg.firstElementChild;

				if (wrapper != null)
				{
					dlg.style.height = '';
					dlg.style.height = (wrapper.scrollHeight + 48) + 'px';
				}
			}
		};

		mxEvent.addListener(title, 'click', function()
		{
			setExpanded(!title.classList.contains('geExpanded'));
		});

		parent.appendChild(title);
		parent.appendChild(contentWrapper);

		return {
			content: content,
			expand: function()
			{
				setExpanded(true);
			},
			collapse: function()
			{
				setExpanded(false);
			},
			isExpanded: function()
			{
				return title.classList.contains('geExpanded');
			}
		};
	};

	/**
	 *
	 */
	EditorUi.prototype.addEditButton = function(div, lightbox)
	{
		var editRow = document.createElement('div');
		editRow.className = 'geDialogCheckRow';

		var edit = this.addCheckbox(editRow, mxResources.get('edit') + ':', true, null, true);
		edit.style.marginTop = '0px';

		var file = this.getCurrentFile();
		var editUrl = '';

		if (file != null && file.getMode() != App.MODE_DEVICE && file.getMode() != App.MODE_BROWSER)
		{
			editUrl = window.location.href;
		}

		var editSelect = document.createElement('select');
		editSelect.style.maxWidth = '200px';
		editSelect.style.width = 'auto';
		editSelect.style.marginLeft = '8px';
		editSelect.style.marginRight = '10px';
		editSelect.className = 'geBtn';

		var blankOption = document.createElement('option');
		blankOption.setAttribute('value', 'blank');
		mxUtils.write(blankOption, mxResources.get('makeCopy'));
		editSelect.appendChild(blankOption);

		var customOption = document.createElement('option');
		customOption.setAttribute('value', 'custom');
		mxUtils.write(customOption, mxResources.get('custom') + '...');
		editSelect.appendChild(customOption);

		editRow.appendChild(editSelect);
		div.appendChild(editRow);
		
		mxEvent.addListener(editSelect, 'change', mxUtils.bind(this, function()
		{
			if (editSelect.value == 'custom')
			{
				var dlg2 = new FilenameDialog(this, editUrl, mxResources.get('ok'), function(value)
				{
					if (value != null)
					{
						editUrl = value;
						customOption.setAttribute('title', value);
					}
					else
					{
						editSelect.value = 'blank';
						customOption.removeAttribute('title');
					}
				}, mxResources.get('url'), null, null, null, null, function()
				{
					editSelect.value = 'blank';
				});
				this.showDialog(dlg2.container, 300, 80, true, false);
				dlg2.init();
			}
		}));
		
		mxEvent.addListener(edit, 'change', mxUtils.bind(this, function()
		{
			if (edit.checked && (lightbox == null || lightbox.checked))
			{
				editSelect.removeAttribute('disabled');
			}
			else
			{
				editSelect.setAttribute('disabled', 'disabled');
			}
		}));

		return {
			getLink: function()
			{
				return (edit.checked) ? ((editSelect.value === 'blank') ? '_blank' : editUrl) : null;
			},
			getEditInput: function()
			{
				return edit;
			},
			getEditSelect: function()
			{
				return editSelect;
			},
			getEditRow: function()
			{
				return editRow;
			}
		};
	}
	
	/**
	 * 
	 */
	EditorUi.prototype.addLinkSection = function(div, showFrameOption)
	{
		var linkRow = document.createElement('div');
		linkRow.className = 'geDialogFormRow';

		var linkLabel = document.createElement('span');
		linkLabel.className = 'geDialogFormLabel';
		mxUtils.write(linkLabel, mxResources.get('links') + ':');
		linkRow.appendChild(linkLabel);

		var linkSelect = document.createElement('select');
		linkSelect.style.width = '100px';
		linkSelect.style.padding = '0px';
		linkSelect.style.marginRight = '10px';
		linkSelect.className = 'geBtn';

		var autoOption = document.createElement('option');
		autoOption.setAttribute('value', 'auto');
		mxUtils.write(autoOption, mxResources.get('automatic'));
		linkSelect.appendChild(autoOption);

		var blankOption = document.createElement('option');
		blankOption.setAttribute('value', 'blank');
		mxUtils.write(blankOption, mxResources.get('openInNewWindow'));
		linkSelect.appendChild(blankOption);

		var selfOption = document.createElement('option');
		selfOption.setAttribute('value', 'self');
		mxUtils.write(selfOption, mxResources.get('openInThisWindow'));
		linkSelect.appendChild(selfOption);

		if (showFrameOption)
		{
			var frameOption = document.createElement('option');
			frameOption.setAttribute('value', 'frame');
			mxUtils.write(frameOption, mxResources.get('openInThisWindow') +
				' (' + mxResources.get('iframe') + ')');
			linkSelect.appendChild(frameOption);
		}

		linkRow.appendChild(linkSelect);

		var colorLabel = document.createElement('span');
		mxUtils.write(colorLabel, mxResources.get('borderColor') + ':');
		linkRow.appendChild(colorLabel);
		var linkColor = '#0000ff';
		var linkButton = null;
		
		function updateLinkColor()
		{
			var div = document.createElement('div');
			div.style.width = '100%';
			div.style.height = '100%';
			div.style.boxSizing = 'border-box';

			if (linkColor != null && linkColor != mxConstants.NONE)
			{
				div.style.border = '1px solid black';
				div.style.backgroundColor = linkColor;
			}
			else
			{
				div.style.backgroundPosition = 'center center';
				div.style.backgroundRepeat = 'no-repeat';
				div.style.backgroundImage = 'url(\'' + Dialog.prototype.closeImage + '\')';
			}

			linkButton.innerText = '';
			linkButton.appendChild(div);
		};
		
		linkButton = mxUtils.button('', mxUtils.bind(this, function(evt)
		{
			this.pickColor(linkColor || 'none', function(color)
			{
				linkColor = color;
				updateLinkColor();
			});
			
			mxEvent.consume(evt);
		}));

		updateLinkColor();
		linkButton.style.padding = (mxClient.IS_FF) ? '4px 2px 4px 2px' : '4px';
		linkButton.style.marginLeft = '4px';
		linkButton.style.height = '22px';
		linkButton.style.width = '22px';
		linkButton.style.position = 'relative';
		linkButton.style.top = '1px';
		linkButton.className = 'geColorBtn';
		linkRow.appendChild(linkButton);
		div.appendChild(linkRow);
		
		return {
			getColor: function()
			{
				return linkColor;
			},
			getTarget: function()
			{
				return linkSelect.value;
			},
			focus: function()
			{
				linkSelect.focus();
			}
		};
	}

	/**
	 * 
	 */
	EditorUi.prototype.createUrlParameters = function(linkTarget, linkColor, lightbox, editLink, layers, params, linkIcons, tooltipIcons)
	{
		params = (params != null) ? params : [];

		if (lightbox)
		{
			params.push('lightbox=1');

			if (linkTarget != 'auto')
			{
				params.push('target=' + linkTarget);
			}

			if (linkColor != null && linkColor != mxConstants.NONE)
			{
				params.push('highlight=' + ((linkColor.charAt(0) == '#') ?
					linkColor.substring(1) : linkColor));
			}

			if (editLink != null && editLink.length > 0)
			{
				params.push('edit=' + encodeURIComponent(editLink));
			}

			if (layers)
			{
				params.push('layers=1');
			}

			if (linkIcons)
			{
				params.push('link-icons=1');
			}

			if (tooltipIcons)
			{
				params.push('tooltip-icons=1');
			}

			if (this.editor.graph.foldingEnabled)
			{
				params.push('nav=1');
			}
		}

		return params;
	};

	/**
	 *
	 */
	EditorUi.prototype.createLink = function(linkTarget, linkColor, allPages, lightbox, editLink, layers,
		url, ignoreFile, params, useOpenParameter, currentPage, transparent, darkMode, linkIcons, tooltipIcons)
	{
		var file = this.getCurrentFile();
		params = this.createUrlParameters(linkTarget, linkColor,
			lightbox, editLink, layers, params, linkIcons, tooltipIcons);
		var addTitle = true;
		var data = '';

		if (url != null)
		{
			data = '#U' + encodeURIComponent(url);
		}
		else
		{
			// Fallback to non-public URL for Drive files	
			if (!ignoreFile && file != null && file.getHash() != '')
			{
				data = '#' + file.getHash();
				addTitle = false;
			}
			else
			{
				data = '#R' + encodeURIComponent((allPages) ?
					this.getFileData(true, null, null, null, null, null, null, true, null, false) :
					Graph.compress(mxUtils.getXml(this.editor.getGraphXml())))
			}
		}

		if (addTitle && file != null && file.getTitle() != null && file.getTitle() != this.defaultFilename)
		{
			params.push('title=' + encodeURIComponent(file.getTitle()));
		}

		if (useOpenParameter && data.length > 1)
		{
			params.push('open=' + data.substring(1));
			data = '';
		}

		if (currentPage && this.currentPage != null)
		{
			params.push('page-id=' + this.currentPage.getId());
		}

		if (transparent)
		{
			params.push('transparent=1');
		}

		if (darkMode != null)
		{
			params.push('dark=' + darkMode);
		}

		// Uses current host for non-public GitLab and GitHub files
		return ((lightbox && (url != null || (file != null &&
			file.getMode() != App.MODE_GITHUB && file.getMode() != App.MODE_GITLAB))) ?
			EditorUi.lightboxHost : (((mxClient.IS_CHROMEAPP || EditorUi.isElectronApp ||
			!(/.*\.draw\.io$/.test(window.location.hostname))) ?
			EditorUi.drawHost : 'https://' + window.location.host))) + '/' +
			((params.length > 0) ? '?' + params.join('&') : '') + data;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.createHtml = function(publicUrl, zoomEnabled, initialZoom, linkTarget,
		linkColor, fit, allPages, layers, tags, lightbox, editLink, fn, theme, useTagSettings,
		linkIcons, tooltipIcons)
	{
		var s = this.getBasenames();
		var data = {};

		if (linkIcons)
		{
			data['show-link-icons'] = true;
		}

		if (tooltipIcons)
		{
			data['show-tooltip-icons'] = true;
		}
		
		if (linkColor != '' && linkColor != mxConstants.NONE)
		{
			data.highlight = linkColor;
		}
		
		if (linkTarget !== 'auto')
		{
			data.target = linkTarget;
		}
		
		if (!lightbox)
		{
			data.lightbox = false;
		}
		
		data.nav = this.editor.graph.foldingEnabled;
		var zoom = parseInt(initialZoom);
		
		if (!isNaN(zoom) && zoom != 100)
		{
			data.zoom = zoom / 100;
		}
		
		var tb = [];
		
		if (allPages)
		{
			tb.push('pages');
			data.resize = true;
			
			if (this.pages != null && this.currentPage != null)
			{
				data.page = mxUtils.indexOf(this.pages, this.currentPage);
			}
		}
		
		if (zoomEnabled)
		{
			tb.push('zoom');
			data.resize = true;
		}
		
		if (layers)
		{
			tb.push('layers');
		}

		if (tags)
		{
			tb.push('tags');

			if (useTagSettings)
			{
				var hiddenTagsMap = this.getHiddenTagsMap();

				if (hiddenTagsMap != null)
				{
					data.hiddenTags = hiddenTagsMap;
				}
			}
		}

		if (theme != null)
		{
			data['dark-mode'] = theme;
		}
		
		if (tb.length > 0)
		{
			if (lightbox)
			{
				tb.push('lightbox');
			}
			
			data.toolbar = tb.join(' ');
		}

		if (editLink != null && editLink.length > 0)
		{
			data.edit = editLink;
		}
		
		if (publicUrl != null)
		{
			data.url = publicUrl;
		}
		else
		{
			data.xml = this.getFileData(true, null, null, null, null, !allPages);
		}
	
		var value = '<div class="mxgraph" style="' +
			((fit) ? 'max-width:100%;' : '') +
			((tb != '') ? 'border:1px solid transparent;' : '') +
			'" data-mxgraph="' + mxUtils.htmlEntities(JSON.stringify(data)) + '"></div>';
		
		var fetchParam = (publicUrl != null) ? '&fetch=' + encodeURIComponent(publicUrl) : '';
		var s2 = (fetchParam.length > 0) ? (((urlParams['dev'] == '1') ?
			'https://test.draw.io/embed2.js?dev=1' : EditorUi.lightboxHost + '/embed2.js?')) + fetchParam :
			(((urlParams['dev'] == '1') ? 'https://test.draw.io/js/viewer-static.min.js' :
			window.DRAWIO_VIEWER_URL ? window.DRAWIO_VIEWER_URL : EditorUi.lightboxHost + '/js/viewer-static.min.js'));
		var src = '<script type="text/javascript" src="' + s2 + '"></script>';
		
		fn(value, src);
	};

	/**
	 * 
	 */
	EditorUi.prototype.showHtmlDialog = function(btnLabel, helpLink, publicUrl, fn)
	{
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';
		
		var hd = document.createElement('h3');
		mxUtils.write(hd, mxResources.get('html'));
		hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:12px';
		div.appendChild(hd);

		var linkSelect = document.createElement('select');

		linkSelect.className = 'geBtn';
		linkSelect.style.marginBottom = '8px';
		linkSelect.style.marginLeft = '0px';
		linkSelect.style.width = '100%';
		linkSelect.style.boxSizing = 'border-box';

		var makeCopy = document.createElement('option');
		mxUtils.write(makeCopy, mxResources.get('includeCopyOfMyDiagram'));
		makeCopy.setAttribute('value', 'copy');
		linkSelect.appendChild(makeCopy);

		var publicLink = document.createElement('option');
		publicLink.setAttribute('value', 'url');
		linkSelect.appendChild(publicLink);

		if (publicUrl != null)
		{
			mxUtils.write(publicLink, mxResources.get('publicDiagramUrl'));
			publicLink.setAttribute('title', publicUrl);
		}
		else
		{
			mxUtils.write(publicLink, mxResources.get('publicDiagramUrl') +
				' (' + mxResources.get('diagramIsNotPublic') + ')');
			publicLink.setAttribute('disabled', 'disabled');
		}

		div.appendChild(linkSelect);
		mxUtils.br(div);

		var file = this.getCurrentFile();

		if (publicUrl == null && file != null && file.constructor == window.DriveFile)
		{
			var shareRow = document.createElement('div');
			shareRow.style.marginBottom = '8px';

			var testLink = document.createElement('a');
			testLink.style.color = 'gray';
			testLink.style.cursor = 'pointer';
			mxUtils.write(testLink, mxResources.get('share'));
			shareRow.appendChild(testLink);

			mxEvent.addListener(testLink, 'click', mxUtils.bind(this, function()
			{
				this.hideDialog();
				this.drive.showPermissions(file.getId(), file);
			}));

			div.appendChild(shareRow);
		}

		// --- Options section ---
		var optSection = document.createElement('div');
		optSection.className = 'geDialogSection';

		var linkSection = this.addLinkSection(optSection);

		var themeSelect = document.createElement('select');
		themeSelect.style.maxWidth = '260px';

		var lightOption = document.createElement('option');
		lightOption.setAttribute('value', 'light');
		mxUtils.write(lightOption, mxResources.get('light'));
		themeSelect.appendChild(lightOption);

		var darkOption = document.createElement('option');
		darkOption.setAttribute('value', 'dark');
		mxUtils.write(darkOption, mxResources.get('dark'));
		themeSelect.appendChild(darkOption);

		var autoOption = document.createElement('option');
		autoOption.setAttribute('value', 'auto');
		mxUtils.write(autoOption, mxResources.get('automatic'));
		autoOption.setAttribute('selected', 'selected');
		themeSelect.appendChild(autoOption);

		var themeRow = document.createElement('div');
		themeRow.className = 'geDialogFormRow';
		var themeLbl = document.createElement('span');
		themeLbl.className = 'geDialogFormLabel';
		mxUtils.write(themeLbl, mxResources.get('appearance') + ':');
		themeRow.appendChild(themeLbl);
		themeRow.appendChild(themeSelect);
		optSection.appendChild(themeRow);

		var zoomRow = document.createElement('div');
		zoomRow.className = 'geDialogCheckRow';
		var zoom = document.createElement('input');
		zoom.setAttribute('type', 'checkbox');
		zoom.setAttribute('checked', 'checked');
		zoom.defaultChecked = true;
		zoom.style.marginRight = '8px';
		zoomRow.appendChild(zoom);
		var zoomLabel = document.createElement('label');
		mxUtils.write(zoomLabel, mxResources.get('zoom') + ':');
		zoomRow.appendChild(zoomLabel);
		var zoomInput = document.createElement('input');
		zoomInput.setAttribute('type', 'text');
		zoomInput.style.width = '60px';
		zoomInput.style.marginLeft = '4px';
		zoomInput.value = '100%';
		zoomRow.appendChild(zoomInput);
		optSection.appendChild(zoomRow);

		var fit = this.addCheckbox(optSection, mxResources.get('fit'),
			true, null, null, null, null, null, true);
		var hasPages = this.pages != null && this.pages.length > 1;
		var allPages = this.addCheckbox(optSection, mxResources.get('allPages'),
			hasPages, !hasPages, null, null, null, null, true);
		var lightbox = this.addCheckbox(optSection, mxResources.get('lightbox'),
			true, null, null, null, null, null, true);

		div.appendChild(optSection);

		var advanced = this.addAdvancedSection(div);
		var advSection = advanced.content;

		var layers = this.addCheckbox(advSection, mxResources.get('layers'),
			true, null, null, null, null, null, true);
		var tags = this.addCheckbox(advSection, mxResources.get('tags'),
			true, null, null, null, null, null, true);
		var useTagSettings = this.addCheckbox(advSection, mxResources.get('useCurrentSettings'),
			true, null, null, null, null, null, true);
		useTagSettings.checkRow.style.paddingLeft = '24px';

		var linkIcons = this.addCheckbox(advSection, mxResources.get('linkIcons'),
			false, null, null, null, null, null, true);
		var tooltipIcons = this.addCheckbox(advSection, mxResources.get('tooltipIcons'),
			false, null, null, null, null, null, true);

		mxEvent.addListener(tags, 'change', function()
		{
			if (tags.checked)
			{
				useTagSettings.removeAttribute('disabled');
			}
			else
			{
				useTagSettings.setAttribute('disabled', 'disabled');
			}
		});

		mxEvent.addListener(lightbox, 'change', function()
		{
			if (lightbox.checked)
			{
				linkIcons.removeAttribute('disabled');
				tooltipIcons.removeAttribute('disabled');
			}
			else
			{
				linkIcons.setAttribute('disabled', 'disabled');
				tooltipIcons.setAttribute('disabled', 'disabled');
			}
		});

		var editSection = null;

		if (EditorUi.enableHtmlEditOption)
		{
			editSection = this.addEditButton(advSection, lightbox);
			var edit = editSection.getEditInput();

			mxEvent.addListener(lightbox, 'change', function()
			{
				if (lightbox.checked)
				{
					edit.removeAttribute('disabled');
				}
				else
				{
					edit.setAttribute('disabled', 'disabled');
				}

				if (edit.checked && lightbox.checked)
				{
					editSection.getEditSelect().removeAttribute('disabled');
				}
				else
				{
					editSection.getEditSelect().setAttribute('disabled', 'disabled');
				}
			});
		}

		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			fn((linkSelect.value == 'url') ? publicUrl : null, zoom.checked, zoomInput.value, linkSection.getTarget(),
				linkSection.getColor(), fit.checked, allPages.checked, layers.checked, tags.checked,
				lightbox.checked, (editSection != null) ? editSection.getLink() : null,
				(themeSelect != null) ? themeSelect.value : null,
				tags.checked && useTagSettings.checked,
				linkIcons.checked, tooltipIcons.checked);
		}), null, btnLabel, helpLink);
		this.showDialog(dlg.container, 360, null, true, true);
		linkSelect.focus();
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.showPublishLinkDialog = function(title, width, height, showFrameOption,
		helpLink, footer, publicUrl, file, fn, showBackgroundOption, showDarkModeOption,
		showAllPagesOption)
	{
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';
		
		var hd = document.createElement('h3');
		mxUtils.write(hd, title || mxResources.get('publish'));
		hd.style.width = '100%';
		hd.style.textAlign = 'center';
		hd.style.marginTop = '0px';
		hd.style.marginBottom = '10px';
		div.appendChild(hd);
		
		var linkSelect = document.createElement('select');

		linkSelect.className = 'geBtn';
		linkSelect.style.marginBottom = '8px';
		linkSelect.style.marginLeft = '0px';
		linkSelect.style.width = '100%';
		linkSelect.style.boxSizing = 'border-box';

		helpLink = (helpLink != null) ? helpLink :
			'https://www.drawio.com/docs/manual/export/publish-link/';

		var makeCopy = document.createElement('option');
		mxUtils.write(makeCopy, mxResources.get('makeCopy'));
		makeCopy.setAttribute('value', 'copy');
		linkSelect.appendChild(makeCopy);

		var authRequired = document.createElement('option');
		mxUtils.write(authRequired, mxResources.get('authorizationRequired'));
		authRequired.setAttribute('value', 'auth');
		linkSelect.appendChild(authRequired);

		if (file == null || file.getHash() == '')
		{
			authRequired.setAttribute('disabled', 'disabled');
		}
		else
		{
			linkSelect.value = 'auth';
		}

		var publicLink = document.createElement('option');
		publicLink.setAttribute('value', 'public');
		linkSelect.appendChild(publicLink);

		if (publicUrl != null)
		{
			mxUtils.write(publicLink, mxResources.get('publicDiagramUrl'));
			publicLink.setAttribute('title', publicUrl);
			linkSelect.value = 'public';
		}
		else
		{
			mxUtils.write(publicLink, mxResources.get('publicDiagramUrl') +
				' (' + mxResources.get('diagramIsNotPublic') + ')');
			publicLink.setAttribute('disabled', 'disabled');
		}
		
		div.appendChild(linkSelect);
		mxUtils.br(div);
		linkSelect.focus();

		// --- Options section ---
		var optSection = document.createElement('div');
		optSection.className = 'geDialogSection';

		var widthInput = null;
		var heightInput = null;

		if (width != null || height != null)
		{
			var dimRow = document.createElement('div');
			dimRow.className = 'geDialogInlineFields';

			var dimField = document.createElement('div');
			dimField.className = 'geDialogInlineField';
			var wLbl = document.createElement('label');
			mxUtils.write(wLbl, mxResources.get('width') + ':');
			dimField.appendChild(wLbl);
			widthInput = document.createElement('input');
			widthInput.setAttribute('type', 'text');
			widthInput.value = '100%';
			dimField.appendChild(widthInput);
			dimRow.appendChild(dimField);

			dimField = document.createElement('div');
			dimField.className = 'geDialogInlineField';
			var hLbl = document.createElement('label');
			mxUtils.write(hLbl, mxResources.get('height') + ':');
			dimField.appendChild(hLbl);
			heightInput = document.createElement('input');
			heightInput.setAttribute('type', 'text');
			heightInput.value = height + 'px';
			dimField.appendChild(heightInput);
			dimRow.appendChild(dimField);

			optSection.appendChild(dimRow);
		}

		var linkSection = this.addLinkSection(optSection, showFrameOption);

		var transparent = (!showBackgroundOption) ? null :
			this.addCheckbox(optSection, mxResources.get('transparentBackground'),
				false, null, null, null, null, null, true);



		var allPagesSelect = document.createElement('select');
		allPagesSelect.className = 'geBtn';

		var allPagesOption = document.createElement('option');
		mxUtils.write(allPagesOption, mxResources.get('allPages'));
		allPagesOption.setAttribute('value', 'allPages');
		allPagesSelect.appendChild(allPagesOption);

		var currentPageOption = document.createElement('option');
		mxUtils.write(currentPageOption, mxResources.get('currentPage'));
		currentPageOption.setAttribute('value', 'currentPage');
		allPagesSelect.appendChild(currentPageOption);
		
		var currentPage = null;
		
		if (this.pages != null && this.currentPage != null &&
			this.getPageIndex(this.currentPage) > 0)
		{
			var name = (this.currentPage != null) ? this.currentPage.getName() : '';

			if (name.length > 16)
			{
				name = name.substring(0, 16) + '...';
			}

			if (showAllPagesOption)
			{
				var pagesRow = document.createElement('div');
				pagesRow.className = 'geDialogFormRow';
				var pagesLbl = document.createElement('span');
				pagesLbl.className = 'geDialogFormLabel';
				mxUtils.write(pagesLbl, mxResources.get('pages') + ':');
				pagesRow.appendChild(pagesLbl);
				pagesRow.appendChild(allPagesSelect);
				optSection.appendChild(pagesRow);
			}

			currentPage = this.addCheckbox(optSection, mxResources.get('selectedPage') + ': ' + name,
				null, null, null, null, null, null, true);
		}

		var themeSelect = document.createElement('select');
		themeSelect.style.maxWidth = '260px';

		var lightOption = document.createElement('option');
		lightOption.setAttribute('value', '0');
		mxUtils.write(lightOption, mxResources.get('light'));
		themeSelect.appendChild(lightOption);

		var darkOption = document.createElement('option');
		darkOption.setAttribute('value', '1');
		mxUtils.write(darkOption, mxResources.get('dark'));
		themeSelect.appendChild(darkOption);

		var autoOption = document.createElement('option');
		autoOption.setAttribute('value', 'auto');
		mxUtils.write(autoOption, mxResources.get('automatic'));
		autoOption.setAttribute('selected', 'selected');
		themeSelect.appendChild(autoOption);

		if (showDarkModeOption)
		{
			var themeRow = document.createElement('div');
			themeRow.className = 'geDialogFormRow';
			var themeLbl = document.createElement('span');
			themeLbl.className = 'geDialogFormLabel';
			mxUtils.write(themeLbl, mxResources.get('appearance') + ':');
			themeRow.appendChild(themeLbl);
			themeRow.appendChild(themeSelect);
			optSection.appendChild(themeRow);
		}

		var lightbox = this.addCheckbox(optSection, mxResources.get('lightbox'),
			true, null, null, !showFrameOption, null, null, true);

		// Cannot disable lightbox in iframes
		if (showFrameOption && lightbox.checkRow != null)
		{
			lightbox.checkRow.style.display = 'none';
		}

		div.appendChild(optSection);

		var advanced = this.addAdvancedSection(div);
		var advSection = advanced.content;

		var editSection = this.addEditButton(advSection, lightbox);
		var edit = editSection.getEditInput();

		var layers = this.addCheckbox(advSection, mxResources.get('layers'),
			true, null, null, null, null, null, true);

		var tags = this.addCheckbox(advSection, mxResources.get('tags'),
			true, null, null, null, null, null, true);

		var useTagSettings = this.addCheckbox(advSection, mxResources.get('useCurrentSettings'),
			true, null, null, null, null, null, true);
		useTagSettings.checkRow.style.paddingLeft = '24px';

		var linkIcons = this.addCheckbox(advSection, mxResources.get('linkIcons'),
			false, null, null, null, null, null, true);
		var tooltipIcons = this.addCheckbox(advSection, mxResources.get('tooltipIcons'),
			false, null, null, null, null, null, true);

		mxEvent.addListener(tags, 'change', function()
		{
			if (tags.checked)
			{
				useTagSettings.removeAttribute('disabled');
			}
			else
			{
				useTagSettings.setAttribute('disabled', 'disabled');
			}
		});

		mxEvent.addListener(lightbox, 'change', function()
		{
			if (lightbox.checked)
			{
				layers.removeAttribute('disabled');
				edit.removeAttribute('disabled');
				tags.removeAttribute('disabled');
				linkIcons.removeAttribute('disabled');
				tooltipIcons.removeAttribute('disabled');

				if (tags.checked)
				{
					useTagSettings.removeAttribute('disabled');
				}
			}
			else
			{
				layers.setAttribute('disabled', 'disabled');
				edit.setAttribute('disabled', 'disabled');
				tags.setAttribute('disabled', 'disabled');
				useTagSettings.setAttribute('disabled', 'disabled');
				linkIcons.setAttribute('disabled', 'disabled');
				tooltipIcons.setAttribute('disabled', 'disabled');
			}

			if (edit.checked && lightbox.checked)
			{
				editSection.getEditSelect().removeAttribute('disabled');
			}
			else
			{
				editSection.getEditSelect().setAttribute('disabled', 'disabled');
			}
		});

		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			fn(linkSection.getTarget(), linkSection.getColor(),
				(currentPage == null) ? false : currentPage.checked,
				lightbox.checked, editSection.getLink(), layers.checked,
				(widthInput != null) ? widthInput.value : null,
				(heightInput != null) ? heightInput.value : null,
				tags.checked, linkSelect.value, (transparent != null) ?
				transparent.checked : false, themeSelect.value,
				allPagesSelect.value == 'allPages',
				tags.checked && useTagSettings.checked,
				linkIcons.checked, tooltipIcons.checked);
		}), null, mxResources.get('create'), helpLink, footer);
		this.showDialog(dlg.container, 360, null, true, true);
		
		if (widthInput != null)
		{
			widthInput.focus();
			
			if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
			{
				widthInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
		else (linkSelect.parentNode == null)
		{
			linkSection.focus();
		}
	};

	/**
	 * 
	 */
	EditorUi.prototype.showRemoteExportDialog = function(btnLabel, helpLink, callback, hideInclude, showZoomBorder)
	{
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';
		
		var hd = document.createElement('h3');
		mxUtils.write(hd, mxResources.get('image'));
		hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
		div.appendChild(hd);

		if (showZoomBorder)
		{
			var dimSection = document.createElement('div');
			dimSection.className = 'geDialogSection';

			var formRow = document.createElement('div');
			formRow.className = 'geDialogFormRow';
			var zoomLbl = document.createElement('span');
			zoomLbl.className = 'geDialogFormLabel';
			mxUtils.write(zoomLbl, mxResources.get('zoom') + ':');
			formRow.appendChild(zoomLbl);
			var zoomInput = document.createElement('input');
			zoomInput.setAttribute('type', 'text');
			zoomInput.value = this.lastExportZoom || '100%';
			formRow.appendChild(zoomInput);
			dimSection.appendChild(formRow);

			formRow = document.createElement('div');
			formRow.className = 'geDialogFormRow';
			var borderLbl = document.createElement('span');
			borderLbl.className = 'geDialogFormLabel';
			mxUtils.write(borderLbl, mxResources.get('borderWidth') + ':');
			formRow.appendChild(borderLbl);
			var borderInput = document.createElement('input');
			borderInput.setAttribute('type', 'text');
			borderInput.value = this.lastExportBorder || '0';
			formRow.appendChild(borderInput);
			dimSection.appendChild(formRow);

			div.appendChild(dimSection);
		}
		
		var optSection = document.createElement('div');
		optSection.className = 'geDialogSection';

		var selection = this.addCheckbox(optSection, mxResources.get('selectionOnly'),
			this.lastExportSelectionOnly && !this.editor.graph.isSelectionEmpty(),
			this.editor.graph.isSelectionEmpty(), null, null, null, null, true);
		var include = (hideInclude) ? null :
			this.addCheckbox(optSection, mxResources.get('includeCopyOfMyDiagram'),
				Editor.defaultIncludeDiagram, null, null, null, null, null, true);

		var graph = this.editor.graph;
		var defaultTransparent = graph.background == mxConstants.NONE ||
			graph.background == null;
		var transparent = (hideInclude) ? null :
			this.addCheckbox(optSection, mxResources.get('transparentBackground'),
				(this.lastExportTransparent != null) ?
				this.lastExportTransparent : defaultTransparent,
				null, null, null, null, null, true);

		div.appendChild(optSection);

		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			this.lastExportSelectionOnly = selection.checked;

			if (showZoomBorder)
			{
				this.lastExportZoom = zoomInput.value;
				this.lastExportBorder = borderInput.value;
			}

			if (transparent != null)
			{
				// Kept only while it differs from the derived default so an
				// unchanged setting keeps tracking the page background
				this.lastExportTransparent = (transparent.checked == defaultTransparent) ?
					null : transparent.checked;
			}

			var scale = parseInt(zoomInput.value) / 100 || 1;
			var border = parseInt(borderInput.value) || 0;

			callback(!selection.checked, (include != null) ? include.checked : false,
				(transparent != null) ? transparent.checked : false, scale, border);
		}), null, btnLabel, helpLink);
		this.showDialog(dlg.container, 340, null, true, true);
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.showExportDialog = function(title, embedOption, btnLabel, helpLink, callback,
		cropOption, defaultInclude, format, exportOption)
	{
		defaultInclude = (defaultInclude != null) ? defaultInclude : Editor.defaultIncludeDiagram;
		
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';
		var graph = this.editor.graph;

		var hd = document.createElement('h3');
		mxUtils.write(hd, title);
		hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
		div.appendChild(hd);

		// --- Dimensions section ---
		var dimSection = document.createElement('div');
		dimSection.className = 'geDialogSection';

		var formRow = document.createElement('div');
		formRow.className = 'geDialogFormRow';
		var zoomLbl = document.createElement('span');
		zoomLbl.className = 'geDialogFormLabel';
		mxUtils.write(zoomLbl, mxResources.get('zoom') + ':');
		formRow.appendChild(zoomLbl);
		var zoomInput = document.createElement('input');
		zoomInput.setAttribute('type', 'text');
		zoomInput.value = this.lastExportZoom || '100%';
		formRow.appendChild(zoomInput);
		dimSection.appendChild(formRow);

		div.appendChild(dimSection);

		// --- Options section ---
		var optSection = document.createElement('div');
		optSection.className = 'geDialogSection';

		var selection = this.addCheckbox(optSection, mxResources.get('selectionOnly'),
			this.lastExportSelectionOnly && !graph.isSelectionEmpty(),
			graph.isSelectionEmpty(), null, null, null, null, true);

		var cb6 = document.createElement('input');
		cb6.setAttribute('disabled', 'disabled');
		cb6.setAttribute('type', 'checkbox');

		var exportSelect = document.createElement('select');
		exportSelect.style.marginLeft = '8px';

		var sizes = ['selectionOnly', 'diagram', 'page'];
		var sizesOpt = {};

		for (var i = 0; i < sizes.length; i++)
		{
			if (!graph.isSelectionEmpty() || sizes[i] != 'selectionOnly')
			{
				var opt = document.createElement('option');
				mxUtils.write(opt, mxResources.get(sizes[i]));
				opt.setAttribute('value', sizes[i]);
				exportSelect.appendChild(opt);
				sizesOpt[sizes[i]] = opt;
			}
		}

		if (exportOption)
		{
			var sizeRow = document.createElement('div');
			sizeRow.className = 'geDialogFormRow';
			var sizeLbl = document.createElement('span');
			sizeLbl.className = 'geDialogFormLabel';
			mxUtils.write(sizeLbl, mxResources.get('size') + ':');
			sizeRow.appendChild(sizeLbl);
			exportSelect.style.marginLeft = '0';
			sizeRow.appendChild(exportSelect);
			optSection.appendChild(sizeRow);

			mxEvent.addListener(exportSelect, 'change', function()
			{
				if (exportSelect.value == 'selectionOnly')
				{
					selection.checked = true;
				}
			});
		}
		else if (cropOption)
		{
			var cropRow = document.createElement('div');
			cropRow.className = 'geDialogCheckRow';
			cropRow.appendChild(cb6);
			var cropLbl = document.createElement('label');
			mxUtils.write(cropLbl, mxResources.get('crop'));
			cropRow.appendChild(cropLbl);
			optSection.appendChild(cropRow);

			mxEvent.addListener(selection, 'change', function()
			{
				if (selection.checked)
				{
					cb6.removeAttribute('disabled');
				}
				else
				{
					cb6.setAttribute('disabled', 'disabled');
				}
			});
		}

		if (graph.isSelectionEmpty())
		{
			if (exportOption && selection.checkRow != null &&
				selection.checkRow.parentNode != null)
			{
				selection.checkRow.parentNode.removeChild(selection.checkRow);
			}
		}
		else
		{
			exportSelect.value = (this.lastExportSelectionOnly) ? 'selectionOnly' : 'diagram';
			cb6.setAttribute('checked', 'checked');
			cb6.defaultChecked = true;

			mxEvent.addListener(selection, 'change', function()
			{
				if (selection.checked)
				{
					exportSelect.value = 'selectionOnly';
				}
				else
				{
					exportSelect.value = 'diagram';
				}
			});
		}
				
		var defaultExportType = (!graph.isSelectionEmpty() &&
			this.lastExportSelectionOnly) ? 'selectionOnly' : 'diagram';

		if (exportOption && this.lastExportType != null &&
			sizesOpt[this.lastExportType] != null)
		{
			exportSelect.value = this.lastExportType;

			if (this.lastExportType == 'selectionOnly')
			{
				selection.checked = true;
			}
		}

		var defaultTransparent = false; /*graph.background == mxConstants.NONE || graph.background == null*/;
		var transparentVisible = format != 'jpeg' && format != 'webp';
		var transparent = this.addCheckbox(optSection, mxResources.get('transparentBackground'),
			(transparentVisible && this.lastExportTransparent != null) ?
			this.lastExportTransparent : defaultTransparent,
			null, null, transparentVisible, null, null, true);

		div.appendChild(optSection);

		// --- Embed section ---
		var embedSection = document.createElement('div');
		embedSection.className = 'geDialogSection';
		var hasEmbedContent = false;
		
		var pageCount = (this.pages != null) ? this.pages.length : 1;
		var include = this.addCheckbox(embedSection, mxResources.get('includeCopyOfMyDiagram') +
			((pageCount > 1) ? ':' : ''), defaultInclude, null, null,
			format != 'jpeg' && format != 'webp', null, null, true);

		if (format != 'jpeg' && format != 'webp') hasEmbedContent = true;

		var includeSelect = document.createElement('select');
		includeSelect.style.maxWidth = '260px';

		if (format == 'png' || format == 'svg')
		{
			var includeAllPagesOption = document.createElement('option');
			includeAllPagesOption.setAttribute('value', 'allPages');
			mxUtils.write(includeAllPagesOption, mxResources.get('allPages'));
			includeSelect.appendChild(includeAllPagesOption);

			var includeCurrentPageOption = document.createElement('option');
			includeCurrentPageOption.setAttribute('value', 'currentPage');
			mxUtils.write(includeCurrentPageOption, mxResources.get('currentPage'));
			includeSelect.appendChild(includeCurrentPageOption);

			if (pageCount > 1)
			{
				var includeSelectRow = document.createElement('div');
				includeSelectRow.style.paddingLeft = '24px';
				includeSelectRow.appendChild(includeSelect);
				embedSection.appendChild(includeSelectRow);
			}

			if (this.lastEmbedInclude != null)
			{
				includeSelect.value = this.lastEmbedInclude;
			}

			function updateIncludeSelect()
			{
				if (include.checked)
				{
					includeSelect.removeAttribute('disabled');
				}
				else
				{
					includeSelect.setAttribute('disabled', 'disabled');
				}
			};

			mxEvent.addListener(include, 'change', updateIncludeSelect);
			updateIncludeSelect();
		}
		
		var cb5 = document.createElement('input');
		cb5.setAttribute('type', 'checkbox');
		cb5.id = 'geCheckbox-' + Editor.guid();

		var cb7 = document.createElement('input');
		cb7.setAttribute('type', 'checkbox');
		cb7.id = 'geCheckbox-' + Editor.guid();

		var cb8 = document.createElement('input');
		cb8.setAttribute('type', 'checkbox');
		cb8.id = 'geCheckbox-' + Editor.guid();

		var linkSelect = document.createElement('select');
		linkSelect.style.maxWidth = '260px';

		var autoOption = document.createElement('option');
		autoOption.setAttribute('value', 'auto');
		mxUtils.write(autoOption, mxResources.get('automatic'));
		linkSelect.appendChild(autoOption);

		var blankOption = document.createElement('option');
		blankOption.setAttribute('value', 'blank');
		mxUtils.write(blankOption, mxResources.get('openInNewWindow'));
		linkSelect.appendChild(blankOption);

		var selfOption = document.createElement('option');
		selfOption.setAttribute('value', 'self');
		mxUtils.write(selfOption, mxResources.get('openInThisWindow'));
		linkSelect.appendChild(selfOption);

		if (format == 'svg' && this.lastExportLinkTarget != null)
		{
			linkSelect.value = this.lastExportLinkTarget;

			if (linkSelect.selectedIndex < 0)
			{
				linkSelect.value = 'auto';
			}
		}

		//Inkscape doesn't support links from pdf to svg. Related to https://gitlab.com/inkscape/inbox/-/issues/583
		var linkLost = document.createElement('div');
		mxUtils.write(linkLost, mxResources.get('LinksLost'));
		linkLost.style.margin = '7px';
		linkLost.style.display = 'none';

		if (hasEmbedContent)
		{
			div.appendChild(embedSection);
		}

		// --- Advanced section: width/height, DPI (PNG), border, appearance, shadow, grid ---
		var advanced = this.addAdvancedSection(div);
		var advSection = advanced.content;

		// Base (unscaled) export dimensions used to keep zoom <-> width/height in sync.
		var expBounds = graph.getGraphBounds();
		var expScale = graph.view.scale;
		var baseWidth = Math.max(1, Math.ceil(expBounds.width / expScale));
		var baseHeight = Math.max(1, Math.ceil(expBounds.height / expScale));

		// True once the user edits the zoom directly, after which a DPI pick no
		// longer overrides the zoom (mirrors the legacy Advanced export dialog).
		var zoomUserChanged = false;

		function getExportScale()
		{
			return Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
		};

		var sizeRow = document.createElement('div');
		sizeRow.className = 'geDialogInlineFields';

		var widthField = document.createElement('div');
		widthField.className = 'geDialogInlineField';
		var widthLbl = document.createElement('label');
		mxUtils.write(widthLbl, mxResources.get('width') + ':');
		widthField.appendChild(widthLbl);
		var widthInput = document.createElement('input');
		widthInput.setAttribute('type', 'number');
		widthInput.value = Math.floor(baseWidth * getExportScale());
		widthField.appendChild(widthInput);
		sizeRow.appendChild(widthField);

		var heightField = document.createElement('div');
		heightField.className = 'geDialogInlineField';
		var heightLbl = document.createElement('label');
		mxUtils.write(heightLbl, mxResources.get('height') + ':');
		heightField.appendChild(heightLbl);
		var heightInput = document.createElement('input');
		heightInput.setAttribute('type', 'number');
		heightInput.value = Math.floor(baseHeight * getExportScale());
		heightField.appendChild(heightInput);
		sizeRow.appendChild(heightField);
		advSection.appendChild(sizeRow);

		function updateSizeFromZoom()
		{
			var s = getExportScale();
			widthInput.value = Math.floor(baseWidth * s);
			heightInput.value = Math.floor(baseHeight * s);
		};

		mxEvent.addListener(zoomInput, 'change', function()
		{
			zoomUserChanged = true;
			zoomInput.value = parseFloat((getExportScale() * 100).toFixed(2)) + '%';
			updateSizeFromZoom();
		});

		mxEvent.addListener(widthInput, 'change', function()
		{
			var s = parseInt(widthInput.value) / baseWidth;

			if (s > 0)
			{
				zoomInput.value = parseFloat((s * 100).toFixed(2)) + '%';
				heightInput.value = Math.floor(baseHeight * s);
			}
		});

		mxEvent.addListener(heightInput, 'change', function()
		{
			var s = parseInt(heightInput.value) / baseHeight;

			if (s > 0)
			{
				zoomInput.value = parseFloat((s * 100).toFixed(2)) + '%';
				widthInput.value = Math.floor(baseWidth * s);
			}
		});

		// DPI (PNG only): drives the zoom/scale and is written to the PNG pHYs chunk.
		var dpiSelect = document.createElement('select');
		var customDpi = document.createElement('input');

		if (format == 'png')
		{
			var dpiValues = ['100', '200', '300', '400'];

			for (var i = 0; i < dpiValues.length; i++)
			{
				var dpiOption = document.createElement('option');
				dpiOption.setAttribute('value', dpiValues[i]);
				mxUtils.write(dpiOption, dpiValues[i] + 'dpi');
				dpiSelect.appendChild(dpiOption);
			}

			var dpiCustOption = document.createElement('option');
			dpiCustOption.setAttribute('value', 'custom');
			mxUtils.write(dpiCustOption, mxResources.get('custom'));
			dpiSelect.appendChild(dpiCustOption);

			customDpi.setAttribute('type', 'number');
			customDpi.setAttribute('value', '100');
			customDpi.setAttribute('min', '50');
			customDpi.setAttribute('step', '50');
			customDpi.style.display = 'none';

			var dpiRow = document.createElement('div');
			dpiRow.className = 'geDialogFormRow';
			var dpiLbl = document.createElement('span');
			dpiLbl.className = 'geDialogFormLabel';
			mxUtils.write(dpiLbl, mxResources.get('dpi') + ':');
			dpiRow.appendChild(dpiLbl);
			dpiRow.appendChild(dpiSelect);
			dpiRow.appendChild(customDpi);
			advSection.appendChild(dpiRow);

			if (this.lastExportDpi != null)
			{
				customDpi.value = this.lastExportDpi;
				dpiSelect.value = this.lastExportDpi;

				if (dpiSelect.selectedIndex < 0)
				{
					dpiSelect.value = 'custom';
					dpiSelect.style.display = 'none';
					customDpi.style.display = '';
				}
			}

			mxEvent.addListener(dpiSelect, 'change', function()
			{
				if (dpiSelect.value == 'custom')
				{
					dpiSelect.style.display = 'none';
					customDpi.style.display = '';
					customDpi.focus();
				}
				else
				{
					customDpi.value = dpiSelect.value;

					if (!zoomUserChanged)
					{
						zoomInput.value = dpiSelect.value + '%';
						updateSizeFromZoom();
					}
				}
			});

			mxEvent.addListener(customDpi, 'change', function()
			{
				var dpi = parseInt(customDpi.value);

				if (isNaN(dpi) || dpi <= 0)
				{
					customDpi.style.backgroundColor = 'red';
				}
				else
				{
					customDpi.style.backgroundColor = '';

					if (!zoomUserChanged)
					{
						zoomInput.value = dpi + '%';
						updateSizeFromZoom();
					}
				}
			});
		}

		// Border (moved from the main section)
		var borderRow = document.createElement('div');
		borderRow.className = 'geDialogFormRow';
		var borderLbl = document.createElement('span');
		borderLbl.className = 'geDialogFormLabel';
		mxUtils.write(borderLbl, mxResources.get('borderWidth') + ':');
		borderRow.appendChild(borderLbl);
		var borderInput = document.createElement('input');
		borderInput.setAttribute('type', 'text');
		borderInput.value = this.lastExportBorder || '0';
		borderRow.appendChild(borderInput);
		advSection.appendChild(borderRow);

		// Appearance / theme (moved from the main section)
		var themeSelect = document.createElement('select');
		themeSelect.style.maxWidth = '260px';

		var lightOption = document.createElement('option');
		lightOption.setAttribute('value', 'light');
		mxUtils.write(lightOption, mxResources.get('light'));
		themeSelect.appendChild(lightOption);

		var darkOption = document.createElement('option');
		darkOption.setAttribute('value', 'dark');
		mxUtils.write(darkOption, mxResources.get('dark'));
		themeSelect.appendChild(darkOption);

		var defaultTheme = (Editor.isDarkMode()) ? 'dark' : 'light';

		if (format == 'svg' && mxUtils.lightDarkColorSupported)
		{
			var autoThemeOption = document.createElement('option');
			autoThemeOption.setAttribute('value', 'auto');
			mxUtils.write(autoThemeOption, mxResources.get('automatic'));
			themeSelect.appendChild(autoThemeOption);
			defaultTheme = 'auto';
		}

		themeSelect.value = (this.lastExportTheme != null) ?
			this.lastExportTheme : defaultTheme;

		// Stored override may be an option that doesn't exist for this format
		if (themeSelect.selectedIndex < 0)
		{
			themeSelect.value = defaultTheme;
		}

		var themeRow = document.createElement('div');
		themeRow.className = 'geDialogFormRow';
		var themeLbl = document.createElement('span');
		themeLbl.className = 'geDialogFormLabel';
		mxUtils.write(themeLbl, mxResources.get('appearance') + ':');
		themeRow.appendChild(themeLbl);
		themeRow.appendChild(themeSelect);
		advSection.appendChild(themeRow);

		// Links target (SVG only) — sits with the other form rows, above the checkboxes
		if (format == 'svg')
		{
			var linksRow = document.createElement('div');
			linksRow.className = 'geDialogFormRow';
			var linksLbl = document.createElement('span');
			linksLbl.className = 'geDialogFormLabel';
			mxUtils.write(linksLbl, mxResources.get('links') + ':');
			linksRow.appendChild(linksLbl);
			linksRow.appendChild(linkSelect);
			advSection.appendChild(linksRow);
			advSection.appendChild(linkLost);
		}

		// Shadow (moved from the main section)
		var defaultShadow = graph.shadowVisible == true;
		var shadow = this.addCheckbox(advSection, mxResources.get('shadow'),
			(this.lastExportShadow != null) ? this.lastExportShadow : defaultShadow,
			null, null, null, null, null, true);

		// Grid (moved from the main section)
		var grid = null;
		var gridDisabled = format != 'svg' && (this.isOffline() || !Editor.canvasSupported);

		if (format == 'png' || format == 'jpeg' || format == 'webp' || format == 'svg')
		{
			grid = this.addCheckbox(advSection, mxResources.get('grid'),
				(!gridDisabled && this.lastExportGrid != null) ? this.lastExportGrid : false,
				gridDisabled, false, true, null, null, true);
		}

		// Embed images / fonts / cell metadata (SVG only, gated by embedOption)
		if (embedOption)
		{
			cb5.checked = (this.lastEmbedImages != null) ?
				this.lastEmbedImages : true;

			var embedImgRow = document.createElement('div');
			embedImgRow.className = 'geDialogCheckRow';
			embedImgRow.appendChild(cb5);
			var lbl = document.createElement('label');
			mxUtils.write(lbl, mxResources.get('embedImages'));
			lbl.setAttribute('for', cb5.id);
			embedImgRow.appendChild(lbl);
			advSection.appendChild(embedImgRow);

			cb7.checked = (this.lastEmbedFonts != null) ?
				this.lastEmbedFonts : Editor.embedSvgFonts;

			var embedFontRow = document.createElement('div');
			embedFontRow.className = 'geDialogCheckRow';
			embedFontRow.appendChild(cb7);
			var lbl = document.createElement('label');
			mxUtils.write(lbl, mxResources.get('embedFonts'));
			lbl.setAttribute('for', cb7.id);
			embedFontRow.appendChild(lbl);
			advSection.appendChild(embedFontRow);

			cb8.checked = (this.lastEmbedCellMetadata != null) ?
				this.lastEmbedCellMetadata : false;

			var embedMetaRow = document.createElement('div');
			embedMetaRow.className = 'geDialogCheckRow';
			embedMetaRow.appendChild(cb8);
			var lbl = document.createElement('label');
			mxUtils.write(lbl, mxResources.get('embedCellMetadata'));
			lbl.setAttribute('for', cb8.id);
			embedMetaRow.appendChild(lbl);
			advSection.appendChild(embedMetaRow);
		}

		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			this.lastExportSelectionOnly = selection.checked;
			this.lastExportBorder = borderInput.value;
			this.lastExportZoom = zoomInput.value;

			// Settings with derived defaults are kept for the session only
			// while they differ from the default (null resumes tracking it)
			// and are saved only where the control applies, so that eg. a
			// JPEG export cannot clear the transparency chosen for PNG
			if (transparentVisible)
			{
				this.lastExportTransparent = (transparent.checked == defaultTransparent) ?
					null : transparent.checked;
			}

			this.lastExportTheme = (themeSelect.value == defaultTheme) ?
				null : themeSelect.value;
			this.lastExportShadow = (shadow.checked == defaultShadow) ?
				null : shadow.checked;

			if (grid != null && !gridDisabled)
			{
				this.lastExportGrid = (grid.checked) ? true : null;
			}

			if (format == 'svg')
			{
				this.lastExportLinkTarget = (linkSelect.value == 'auto') ?
					null : linkSelect.value;
			}

			if (format == 'png')
			{
				var dpi = parseInt(customDpi.value);
				this.lastExportDpi = (!isNaN(dpi) && dpi > 0 && dpi != 100) ? dpi : null;
			}

			if (exportOption)
			{
				this.lastExportType = (exportSelect.value == defaultExportType) ?
					null : exportSelect.value;
			}

			if (embedOption)
			{
				this.lastEmbedImages = cb5.checked;
				this.lastEmbedFonts = cb7.checked;
				this.lastEmbedCellMetadata = cb8.checked;
			}

			if (format == 'png' || format == 'svg')
			{
				this.lastEmbedInclude = includeSelect.value;
			}

			if (callback != null)
			{
				callback(zoomInput.value, transparent.checked, !selection.checked, shadow.checked,
					include.checked, cb5.checked && embedOption, borderInput.value, cb6.checked,
					(format == 'png' || format == 'svg') && includeSelect.value == 'currentPage',
					linkSelect.value, (grid != null) ? grid.checked : null,
					(themeSelect != null) ? themeSelect.value : null,
					exportSelect.value, cb7.checked, cb8.checked && embedOption,
					(format == 'png' && parseInt(customDpi.value) > 0 &&
						parseInt(customDpi.value) != 100) ? parseInt(customDpi.value) : null);
			}
		}), null, btnLabel, helpLink);
		this.showDialog(dlg.container, 360, null, true, true, null, null, null, null, true);
		zoomInput.focus();
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
		{
			zoomInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.showEmbedImageDialog = function(fn, title, imageLabel, shadowEnabled, helpLink)
	{
		var div = document.createElement('div');
		var graph = this.editor.graph;

		if (title != null)
		{
			var hd = document.createElement('h3');
			mxUtils.write(hd, title);
			hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
			div.appendChild(hd);
		}

		var optSection = document.createElement('div');
		optSection.className = 'geDialogSection';

		var fit = this.addCheckbox(optSection, mxResources.get('fit'), true,
			null, null, null, null, null, true);
		var shadow = this.addCheckbox(optSection, mxResources.get('shadow'),
			graph.shadowVisible && shadowEnabled, !shadowEnabled,
			null, null, null, null, true);
		var image = this.addCheckbox(optSection, imageLabel,
			false, null, null, null, null, null, true);
		var lightbox = this.addCheckbox(optSection, mxResources.get('lightbox'), true,
			null, null, null, null, null, true);

		div.appendChild(optSection);

		var advanced = this.addAdvancedSection(div);
		var advSection = advanced.content;

		var editSection = this.addEditButton(advSection, lightbox);
		var edit = editSection.getEditInput();

		var hasLayers = graph.model.getChildCount(graph.model.getRoot()) > 1;
		var layers = this.addCheckbox(advSection, mxResources.get('layers'), hasLayers, !hasLayers,
			null, null, null, null, true);

		var linkIcons = this.addCheckbox(advSection, mxResources.get('linkIcons'),
			false, null, null, null, null, null, true);
		var tooltipIcons = this.addCheckbox(advSection, mxResources.get('tooltipIcons'),
			false, null, null, null, null, null, true);

		mxEvent.addListener(lightbox, 'change', function()
		{
			if (lightbox.checked)
			{
				if (hasLayers)
				{
					layers.removeAttribute('disabled');
				}

				edit.removeAttribute('disabled');
				linkIcons.removeAttribute('disabled');
				tooltipIcons.removeAttribute('disabled');
			}
			else
			{
				layers.setAttribute('disabled', 'disabled');
				edit.setAttribute('disabled', 'disabled');
				linkIcons.setAttribute('disabled', 'disabled');
				tooltipIcons.setAttribute('disabled', 'disabled');
			}

			if (edit.checked && lightbox.checked)
			{
				editSection.getEditSelect().removeAttribute('disabled');
			}
			else
			{
				editSection.getEditSelect().setAttribute('disabled', 'disabled');
			}
		});

		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			fn(fit.checked, shadow.checked, image.checked, lightbox.checked,
				editSection.getLink(), layers.checked,
				linkIcons.checked, tooltipIcons.checked);
		}), null, mxResources.get('embed'), helpLink);
		this.showDialog(dlg.container, 280, null, true, true);
	};

	/**
	 * 
	 */
	EditorUi.prototype.createEmbedImage = function(fit, shadow, retina, lightbox, edit, layers, linkIcons, tooltipIcons, fn, err)
	{
		var bounds = this.editor.graph.getGraphBounds();
		var page = this.getSelectedPageIndex();

		function doUpdate(dataUri)
		{
   			var onclick = ' ';
   			var css = '';

   			// Adds double click handling
			if (lightbox)
			{
				// KNOWN: Message passing does not seem to work in IE11
				onclick = " onclick=\"(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(" +
					"img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('" + EditorUi.lightboxHost + "/?client=1" +
					((page != null) ? ("&page=" + page) : "") +
					((edit) ? "&edit=_blank" : "") +
					((layers) ? '&layers=1' : '') +
					((linkIcons) ? '&link-icons=1' : '') +
					((tooltipIcons) ? '&tooltip-icons=1' : '') + "');}})(this);\"";
				css += 'cursor:pointer;';
			}
   			
			if (fit)
			{
				css += 'max-width:100%;';
			}
			
			var atts = '';
			
			if (retina)
			{
				atts = ' width="' + Math.round(bounds.width) + '" height="' + Math.round(bounds.height) + '"';
			}
			
			fn('<img src="' + dataUri + '"' + atts + ((css != '') ? ' style="' + css + '"' : '') + onclick + '/>');
		};
		
		if (this.editor.isExportToCanvas())
		{
			this.editor.exportToCanvas(mxUtils.bind(this, function(canvas)
		   	{
	   			var xml = (lightbox) ? this.getFileData(true) : null;
	   			var data = this.createImageDataUri(canvas, xml, 'png');
	   			doUpdate(data);
		   	}), null, null, null, mxUtils.bind(this, function(e)
		   	{
		   		err({message: mxResources.get('unknownError')});
		   	}), null, true, (retina) ? 2 : 1, null, shadow, null, null, Editor.defaultBorder);
		}
		else
		{
			var data = this.getFileData(true);
			
			if (bounds.width * bounds.height <= MAX_AREA && data.length <= MAX_REQUEST_SIZE)
			{
				var size = '';
				
				if (retina)
				{
					size = '&w=' + Math.round(2 * bounds.width) +
						'&h=' + Math.round(2 * bounds.height);
				}
				
				var embed = (lightbox) ? '1' : '0';
				var req = new mxXmlRequest(EXPORT_URL, 'format=png' +
					'&base64=1&embedXml=' + embed + size + '&xml=' +
					encodeURIComponent(data));
				
				// LATER: Updates on each change, add a delay
				req.send(mxUtils.bind(this, function()
				{
					if (req.getStatus() >= 200 && req.getStatus() <= 299)
					{
						// Fixes possible "incorrect function" for select() on
						// DOM node which is no longer in document with IE11
						doUpdate('data:image/png;base64,' + req.getText());
					}
					else
					{
						err({message: mxResources.get('unknownError')});
					}
				}));
			}
			else
			{
				err({message: mxResources.get('drawingTooLarge')});
			}
		}
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.createEmbedSvg = function(fit, shadow, image, lightbox, edit, layers, linkIcons, tooltipIcons, fn)
	{
		var svgRoot = this.editor.graph.getSvg(null, null, null, null,
			null, null, null, null, null, null, !image, 'auto');
		
		// Keeps hashtag links on same page
		var links = svgRoot.getElementsByTagName('a');
		
		if (links != null)
		{
			for (var i = 0; i < links.length; i++)
			{
				var href = links[i].getAttribute('href');
				
				if (href != null && href.charAt(0) == '#' &&
					links[i].getAttribute('target') == '_blank')
				{
					links[i].removeAttribute('target');
				}
			}
		}
		
		if (lightbox)
		{
			svgRoot.setAttribute('content', this.getFileData(true));
		}
		
		// Adds shadow filter
		if (shadow)
		{
			this.editor.graph.addSvgShadow(svgRoot);
		}
		
		// SVG inside image tag
		if (image)
		{
   			var onclick = ' ';
   			var css = '';

   			// Adds double click handling
			if (lightbox)
			{
				// KNOWN: Message passing does not seem to work in IE11
				onclick = "onclick=\"(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(" +
					"img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('" + EditorUi.lightboxHost + "/?client=1" +
					((edit) ? "&edit=_blank" : "") + ((layers) ? '&layers=1' : '') +
					((linkIcons) ? '&link-icons=1' : '') +
					((tooltipIcons) ? '&tooltip-icons=1' : '') + "');}})(this);\"";
				css += 'cursor:pointer;';
			}
   			
			if (fit)
			{
				css += 'max-width:100%;';
			}
   			
   			// Images inside IMG don't seem to work so embed them all
			this.editor.convertImages(svgRoot, mxUtils.bind(this, function(svgRoot)
			{
				fn('<img src="' + Editor.createSvgDataUri(mxUtils.getXml(svgRoot)) + '"' +
					((css != '') ? ' style="' + css + '"' : '') + onclick + '/>');
			}));
		}
		else
		{
			var css = '';
			
			// Adds double click handling
			if (lightbox)
			{
				var page = this.getSelectedPageIndex();

				// KNOWN: Message passing does not seem to work in IE11
				var js = "(function(svg){var src=window.event.target||window.event.srcElement;" +
					// Ignores link events
					"while (src!=null&&src.nodeName.toLowerCase()!='a'){src=src.parentNode;}if(src==null)" +
					// Focus existing lightbox
					"{if(svg.wnd!=null&&!svg.wnd.closed){svg.wnd.focus();}else{var r=function(evt){" +
					// Message handling
					"if(evt.data=='ready'&&evt.source==svg.wnd){svg.wnd.postMessage(decodeURIComponent(" +
					"svg.getAttribute('content')),'*');window.removeEventListener('message',r);}};" +
					"window.addEventListener('message',r);" +
					// Opens lightbox window
					"svg.wnd=window.open('" + EditorUi.lightboxHost + "/?client=1" +
					((page != null) ? ("&page=" + page) : "") +
					((edit) ? "&edit=_blank" : "") + ((layers) ? '&layers=1' : '') +
					((linkIcons) ? '&link-icons=1' : '') +
					((tooltipIcons) ? '&tooltip-icons=1' : '') + "');}}})(this);";
				svgRoot.setAttribute('onclick', js);
				css += 'cursor:pointer;';
			}
			
			// Adds responsive size
			if (fit)
			{
				var w = parseInt(svgRoot.getAttribute('width'));
				var h = parseInt(svgRoot.getAttribute('height'));
				svgRoot.setAttribute('viewBox', '-0.5 -0.5 ' + w + ' ' + h);
				css += 'max-width:100%;max-height:' + h + 'px;';
				svgRoot.removeAttribute('height');
			}
			
			if (css != '')
			{
				svgRoot.setAttribute('style', css);
			}
			
			// Adds CSS
			this.editor.addFontCss(svgRoot);
			
			if (this.editor.graph.mathEnabled)
			{
				this.editor.addMathCss(svgRoot);
			}
			
			fn(mxUtils.getXml(svgRoot));
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.timeSince = function(date)
	{
	    var seconds = Math.floor((new Date() - date) / 1000);
	    var interval = Math.floor(seconds / 31536000);

	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('years');
	    }
	    
	    interval = Math.floor(seconds / 2592000);
	    
	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('months');
	    }
	    
	    interval = Math.floor(seconds / 86400);
	    
	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('days');
	    }
	    
	    interval = Math.floor(seconds / 3600);
	    
	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('hours');
	    }
	    
	    interval = Math.floor(seconds / 60);
	    
	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('minutes');
	    }
	    
	    if (interval == 1)
	    {
	        return interval + ' ' + mxResources.get('minute');
	    }
	    
	    return null;
	};

	/**
	 * 
	 */
	EditorUi.prototype.decodeNodeIntoGraph = function(node, graph)
	{
		if (node != null)
		{
			var diagramNode = null;
			
			if (node.nodeName == 'diagram')
			{
				diagramNode = node;
			}
			else if (node.nodeName == 'mxfile')
			{
				var diagrams = node.getElementsByTagName('diagram');

				if (diagrams.length > 0)
				{
					diagramNode = diagrams[0];
					var graphGetGlobalVariable = graph.getGlobalVariable;
					
					graph.getGlobalVariable = function(name)
					{
						if (name == 'page')
						{
							return diagramNode.getAttribute('name') || mxResources.get('pageWithNumber', [1])
						}
						else if (name == 'pagenumber')
						{
							return 1;
						}
						
						return graphGetGlobalVariable.apply(this, arguments);
					};
				}
			}
			
			if (diagramNode != null)
			{
				node = Editor.parseDiagramNode(diagramNode);
			}
		}
		
		// Hack to decode XML into temp graph via editor
		var prev = this.editor.graph;
		
		try
		{
			this.editor.graph = graph;
			this.editor.setGraphXml(node);	
		}
		catch (e)
		{
			// ignore
		}
		finally
		{
			this.editor.graph = prev;
		}
		
		return node;
	};

	/**
	 * 
	 */
	EditorUi.prototype.getSvgFileProperties = function(node)
	{
		return this.getPngFileProperties(node);
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.getPngFileProperties = function(node)
	{
		var scale = 1;
		var border = 0;
		
		if (node != null)
		{
			if (node.hasAttribute('scale'))
			{
				var temp = parseFloat(node.getAttribute('scale'));
				
				if (!isNaN(temp) && temp > 0)
				{
					scale = temp;
				}
			}
			
			if (node.hasAttribute('border'))
			{
				var temp = parseInt(node.getAttribute('border'));
				
				if (!isNaN(temp) && temp > 0)
				{
					border = temp;
				}
			}
		}
		
		return {scale: scale, border: border};
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.getEmbeddedPng = function(success, error, optionalData, scale, border)
	{
		try
		{
			var graph = this.editor.graph;
			var diagramData = null;
			
			// Exports PNG for given optional data
			if (optionalData != null && optionalData.length > 0)
			{
				graph = this.createTemporaryGraph(graph.getStylesheet());
				document.body.appendChild(graph.container);
				this.decodeNodeIntoGraph(this.editor.extractGraphModel(
					mxUtils.parseXml(optionalData).documentElement, true), graph);
				diagramData = optionalData;
			}
			// Exports PNG for first page while other page is showing
			else if (this.pages != null && this.currentPage != this.pages[0])
			{
				graph = this.createTemporaryGraph(graph.getStylesheet());
				var graphGetGlobalVariable = graph.getGlobalVariable;
				graph.setBackgroundImage = this.editor.graph.setBackgroundImage;
				var page = this.pages[0];

				if (this.currentPage == page)
				{
					graph.setBackgroundImage(this.editor.graph.backgroundImage);	
				}
				else if (page.viewState != null && page.viewState != null)
				{
					graph.setBackgroundImage(page.viewState.backgroundImage);
				}
		
				graph.getGlobalVariable = function(name)
				{
					if (name == 'page')
					{
						return page.getName();
					}
					else if (name == 'pagenumber')
					{
						return 1;
					}
					
					return graphGetGlobalVariable.apply(this, arguments);
				};
		
				document.body.appendChild(graph.container);
				graph.model.setRoot(page.root);
			}
			
		   	this.editor.exportToCanvas(mxUtils.bind(this, function(canvas)
		   	{
		   		try
		   		{
		   			if (diagramData == null)
		   			{
		   				diagramData = this.getFileData(true, null, null, null, null,
		   						null, null, null, null, false);
		   			}
		   			
		   	   	    var data = canvas.toDataURL('image/png');
		   	   	    data = Editor.writeGraphModelToPng(data,
		   	   	    	'tEXt', 'mxfile', encodeURIComponent(diagramData));
	   	   	   		success(data.substring(data.lastIndexOf(',') + 1));
	
					// Removes temporary graph from DOM
	   	   	   		if (graph != this.editor.graph)
					{
						graph.container.parentNode.removeChild(graph.container);
					}
		   		}
		   		catch (e)
		   		{
		   			if (error != null)
		   			{
		   				error(e);
		   			}
		   		}
		   	}), null, null, null, mxUtils.bind(this, function(e)
		   	{
		   		if (error != null)
	   			{
	   				error(e);
	   			}
		   	}), null, null, scale, null, graph.shadowVisible, null,
				graph, border, null, null, null, 'diagram', null);
		}
		catch (e)
		{
			if (error != null)
			{
				error(e);
			}
		}
	}

	/**
	 * Returns the SVG of the diagram with embedded XML. If a callback function is
	 * used, the images are converted to data URIs.
	 */
	EditorUi.prototype.getEmbeddedSvg = function(xml, graph, url, noHeader, callback, ignoreSelection,
		redirect, embedImages, background, scale, border, shadow, theme, addSvgData, embedFonts)
	{
		embedImages = (embedImages != null) ? embedImages : true;
		border = (border != null) ? border : 0;

		var bg = (background != null) ? background : graph.background;

		if (bg == mxConstants.NONE)
		{
			bg = null;
		}

		// Forces white background for non adaptive colors
		if (bg == null && graph.getAdaptiveColors() == 'none')
		{
			bg = '#ffffff';
		}

		// Sets or disables alternate text for foreignObjects. Disabling is needed
		// because PhantomJS seems to ignore switch statements and paint all text.
		var imgExport = this.editor.graph.createSvgImageExport(xml != null, addSvgData);
		var svgRoot = graph.getSvg(bg, scale, border, null, null, ignoreSelection, null,
			imgExport, null, graph.shadowVisible || shadow, null, theme, 'diagram');
		
		if (graph.shadowVisible || shadow)
		{
			graph.addSvgShadow(svgRoot, null, null, border == 0);
		}

		if (xml != null)
		{
			svgRoot.setAttribute('content', xml);
		}
		
		if (url != null)
		{
			svgRoot.setAttribute('resource', url);
		}
		
		// LATER: Click on SVG content to start editing
//		if (redirect != null)
//		{
//			// TODO: Ignore anchor tag source for click event
//			svgRoot.setAttribute('style', 'cursor:pointer;');
//			svgRoot.setAttribute('onclick', 'window.location.href=\'' + redirect + '\';'); 
//		}

		var done = mxUtils.bind(this, function(svgRoot)
		{
			var result = ((!noHeader) ? Graph.xmlDeclaration + '\n' + Graph.svgFileComment +
				'\n' + Graph.svgDoctype + '\n' : '') + mxUtils.getXml(svgRoot);

			if (callback != null)
			{
				callback(result);
			}

			return result;
		});

		// Adds CSS
		if (graph.mathEnabled)
		{
			this.editor.addMathCss(svgRoot);
		}

		if (callback != null)
		{
			this.embedFonts(svgRoot, mxUtils.bind(this, function(svgRoot)
			{
				if (embedImages)
				{
					this.editor.convertImages(svgRoot, mxUtils.bind(this, function(svgRoot)
					{
						done(svgRoot);
					}));
				}
				else
				{
					done(svgRoot);
				}
			}), embedFonts);
		}
		else
		{
			return done(svgRoot);
		}
	};
	
	/**
	 * Embeds font CSS as data URIs into the given svgRoot. If embedFonts is
	 * false, external font references are added instead. Default for
	 * embedFonts is Editor.embedSvgFonts.
	 */
	EditorUi.prototype.embedFonts = function(svgRoot, callback, embedFonts)
	{
		embedFonts = (embedFonts != null) ? embedFonts : Editor.embedSvgFonts;

		if (!embedFonts)
		{
			try
			{
				this.editor.addFontCss(svgRoot);
				var extFontCss = this.editor.graph.getExtFontCss();

				if (extFontCss.length > 0)
				{
					this.editor.addFontCss(svgRoot, extFontCss);
				}
			}
			catch (e)
			{
				// ignore
			}

			callback(svgRoot);
		}
		else
		{
			this.editor.loadFonts(mxUtils.bind(this, function()
			{
				try
				{
					if (this.editor.resolvedFontCss != null)
					{
						this.editor.addFontCss(svgRoot, this.editor.resolvedFontCss);
					}

					this.editor.embedExtFonts(mxUtils.bind(this, function(extFontsEmbeddedCss)
					{
						try
						{
							if (extFontsEmbeddedCss != null)
							{
								this.editor.addFontCss(svgRoot, extFontsEmbeddedCss);
							}

							callback(svgRoot);
						}
						catch (e)
						{
							callback(svgRoot);
						}
					}));
				}
				catch (e)
				{
					callback(svgRoot);
				}
			}));
		}
	};
	
	/**
	 *
	 */
	EditorUi.prototype.exportImage = function(scale, transparentBackground, ignoreSelection, addShadow,
		editable, border, noCrop, currentPage, format, grid, dpi, theme, exportType)
	{
		format = (format != null) ? format : 'png';

		if (this.spinner.spin(document.body, mxResources.get('exporting'), mxUtils.bind(this, function(err)
		{
			Editor.addRetryToError(err, mxUtils.bind(this, function()
			{
				this.exportImage(scale, transparentBackground, ignoreSelection, addShadow,
					editable, border, noCrop, currentPage, format, grid, dpi, theme, exportType);
			}));
			
			this.handleError(err);
		})))
		{
			var selectionEmpty = this.editor.graph.isSelectionEmpty();
			ignoreSelection = (ignoreSelection != null) ? ignoreSelection : selectionEmpty;
			
			// Caches images
			if (this.thumbImageCache == null)
			{
				this.thumbImageCache = new Object();
			}
			
			try
			{
				this.editor.exportToCanvas(mxUtils.bind(this, function(canvas)
				{
					this.spinner.stop();
					
					try
					{
						this.saveCanvas(canvas, (editable) ? this.getFileData(true, null,
							null, null, ignoreSelection, currentPage, null, null, null,
							null, null, scale, border) : null, format,
							(this.pages == null || this.pages.length == 0), dpi);
					}
					catch (e)
					{
						this.handleError(e);
					}
				}), null, this.thumbImageCache, null, mxUtils.bind(this, function(e)
				{
					this.spinner.stop();
					this.handleError(e);
				}), null, ignoreSelection, scale || 1, transparentBackground, addShadow,
					null, null, border, noCrop, grid, theme, exportType);
			}
			catch (e)
			{
				this.spinner.stop();
				this.handleError(e);
			}
		}
	};

	/**
	/**
	 * Returns true if the given URL is known to have CORS headers.
	 */
	EditorUi.prototype.isCorsEnabledForUrl = function(url)
	{
		return this.editor.isCorsEnabledForUrl(url);
	};

	/**
	 * Handling drag and drop and import.
	 */

	/**
	 * Adds the local page IDs to the given mapping.
	 */
	EditorUi.prototype.addLocalPagesToMapping = function(mapping)
	{
		mapping = (mapping != null) ? mapping : {};

		if (this.pages != null)
		{
			for (var i = 0; i < this.pages.length; i++)
			{
				mapping[this.pages[i].getId()] = this.pages[i].getId();
			}
		}

		return mapping;
	};

	/**
	 * Imports the given XML into the existing diagram.
	 */
	EditorUi.prototype.importXml = function(xml, dx, dy, crop, noErrorHandling, addNewPage, applyDefaultStyles)
	{
		EditorUi.debug('EditorUi.importXml', [this], 'xml', [xml], 'dx', [dx], 'dy', [dy],
			'crop', [crop], 'noErrorHandling', [noErrorHandling], 'addNewPage', [addNewPage],
			'applyDefaultStyles', [applyDefaultStyles]);
		
		dx = (dx != null) ? dx : 0;
		dy = (dy != null) ? dy : 0;
		var cells = []
		
		try
		{
			if (xml != null && xml.length > 0)
			{
				var pageCount = this.pages != null ? this.pages.length : 0;
				var pageEmpty = this.isDiagramEmpty();
				var lastPage = this.currentPage;
				var graph = this.editor.graph;

				// Adds pages
				graph.model.beginUpdate();
				try
				{
					var doc = mxUtils.parseXml(xml);
					var mapping = {};
					
					// Checks for mxfile with multiple pages
					var node = this.editor.extractGraphModel(doc.documentElement, this.pages != null);

					if (node != null && node.nodeName == 'mxfile' && this.pages != null)
					{
						var diagrams = node.getElementsByTagName('diagram');

						if (diagrams.length > 0)
						{
							var pages = [];
							var i0 = 0;

							// Imports single page into existing page
							if (diagrams.length == 1 && !addNewPage)
							{
								if (this.currentPage != null)
								{
									mapping[diagrams[0].getAttribute('id')] = this.currentPage.getId();

									if (this.isBlankFile())
									{
										var name = diagrams[0].getAttribute('name');

										if (name != null && name != '')
										{
											this.editor.graph.model.execute(new RenamePage(
												this, this.currentPage, name));
										}
									}
								}

								node = Editor.parseDiagramNode(diagrams[0]);
								crop = false;
								i0 = 1;
							}

							// Assigns new page IDs and updates page links
							for (var i = i0; i < diagrams.length; i++)
							{
								var oldId = diagrams[i].getAttribute('id')
								diagrams[i].removeAttribute('id');
								
								var page = this.updatePageRoot(new DiagramPage(diagrams[i]));
								mapping[oldId] = diagrams[i].getAttribute('id');
								var index = this.pages.length;
								
								// Checks for invalid page names
								if (page.getName() == null)
								{
									page.setName(mxResources.get('pageWithNumber', [index + 1]));
								}

								graph.model.execute(new ChangePage(this,
									page, page, index, i > 0));
								pages.push(page);
							}

							this.updatePageLinks(mapping, pages);
						}
					}
					
					if (node != null && node.nodeName === 'mxGraphModel')
					{
						cells = graph.importGraphModel(node, dx, dy, crop);
						
						if (cells != null)
						{
							this.addLocalPagesToMapping(mapping);

							for (var i = 0; i < cells.length; i++)
							{
								this.updatePageLinksForCell(mapping, cells[i]);
							}
						}

						var bgImg = graph.parseBackgroundImage(node.getAttribute('backgroundImage'));

						if (bgImg != null && bgImg.originalSrc != null)
						{
							if (this.updateBackgroundPageLink(mapping, bgImg))
							{
								var change = new ChangePageSetup(this, null, bgImg);
								change.ignoreColor = true;
								graph.model.execute(change);
							}
						}
					}
					
					if (applyDefaultStyles)
					{
						graph.pasteCellStyles(graph.includeDescendants(cells),
							graph.defaultVertexStyle, graph.defaultEdgeStyle);
					}

					if (!addNewPage && lastPage != this.currentPage && this.pages != null &&
						this.pages.length > 1 && pageEmpty && pageCount == 1)
					{
						this.removePage(lastPage);
					}
				}
				finally
				{
					graph.model.endUpdate();
				}
			}
		}
		catch (e)
		{
			if (!noErrorHandling)
			{
				this.handleError(e);
			}
			else
			{
				throw e;
			}
		}
		
		return cells;
	};
	
	/**
	 * Updates links to pages in shapes and labels.
	 */
	EditorUi.prototype.updatePageLinks = function(mapping, pages)
	{
		for (var i = 0; i < pages.length; i++)
		{
			this.updatePageLinksForCell(mapping, pages[i].root);

			if (pages[i] != this.currentPage)
			{
				pages[i].needsUpdate = true;
			}

			if (pages[i].viewState != null && this.updateBackgroundPageLink(
				mapping, pages[i].viewState.backgroundImage))
			{
				if (pages[i] == this.currentPage)
				{
					this.editor.graph.setViewState(pages[i].viewState, true);
				}

				pages[i].needsUpdate = true;
			}
		}
	};
	
	/**
	 * Updates links to pages in shapes and labels.
	 */
	EditorUi.prototype.updateBackgroundPageLink = function(mapping, obj)
	{
		var result = false;

		try
		{
			if (obj != null && Graph.isPageLink(obj.originalSrc))
			{
				var newId = mapping[obj.originalSrc.substring(obj.originalSrc.indexOf(',') + 1)];

				if (newId != null)
				{
					obj.originalSrc = 'data:page/id,' + newId;
					result = true;
				}
			}
		}
		catch (e)
		{
			// ignore background image
		}

		return result;
	};

	/**
	 * Updates links to pages in shapes and labels.
	 */
	EditorUi.prototype.updatePageLinksForCell = function(mapping, cell)
	{
		var temp = document.createElement('div');
		var graph = this.editor.graph;
		var href = graph.getLinkForCell(cell);

		if (href != null)
		{
			graph.setLinkForCell(cell, this.updatePageLink(mapping, href));
		}
		
		if (graph.isHtmlLabel(cell))
		{
			temp.innerHTML = Graph.sanitizeHtml(graph.getLabel(cell));
			var links = temp.getElementsByTagName('a');
			var changed = false;
			
			for (var i = 0; i < links.length; i++)
			{
				href = links[i].getAttribute('href');
				
				if (href != null)
				{
					links[i].setAttribute('href', this.updatePageLink(mapping, href));
					changed = true;
				}
			}
			
			if (changed)
			{
				graph.labelChanged(cell, temp.innerHTML);
			}
		}
		
		for (var i = 0; i < graph.model.getChildCount(cell); i++)
		{
			this.updatePageLinksForCell(mapping, graph.model.getChildAt(cell, i));
		}
	};

	/**
	 * Updates links to pages in shapes and labels.
	 */
	EditorUi.prototype.updatePageLink = function(mapping, href)
	{
		if (Graph.isPageLink(href))
		{
			var newId = mapping[href.substring(href.indexOf(',') + 1)];
			href = (newId != null) ? 'data:page/id,' + newId : null;
		}
		else if (href.substring(0, 17) == 'data:action/json,')
		{
			try
			{
				var link = JSON.parse(href.substring(17));

				if (link.actions != null)
				{
					for (var i = 0; i < link.actions.length; i++)
					{
						var action = link.actions[i];
						
						if (action.open != null && Graph.isPageLink(action.open))
						{
							var oldId = action.open.substring(action.open.indexOf(',') + 1);
							var newId = mapping[oldId];
							
							if (newId != null)
							{
								action.open = 'data:page/id,' + newId;
							}
							else if (this.getPageById(oldId) == null)
							{
								delete action.open;
							}
						}
					}
					
					href = 'data:action/json,' + JSON.stringify(link);
				}
			}
			catch (e)
			{
				// Ignore
			}
		}
		
		return href;
	};
	
	/**
	 * Returns true for VSD, VDX and VSS, VSX files.
	 */
	EditorUi.prototype.isRemoteVisioFormat = function(filename)
	{
		return (/(\.v(sd|dx))($|\?)/i.test(filename) ||
			/(\.vs(s|x))($|\?)/i.test(filename));
	};
	
	/**
	 * Imports the given Visio file
	 */
	EditorUi.prototype.importVisio = function(file, done, error, filename, customParam)
	{
		var onerror = mxUtils.bind(this, function(e)
		{
			this.loadingExtensions = false;

			if (error != null)
			{
				error(e);
			}
			else
			{
				this.handleError(e);
			}
		});

		//A reduced version of this code is used in conf/jira plugins, review that code whenever this function is changed
		this.createTimeout(null, mxUtils.bind(this, function(timeout)
		{
			filename = (filename != null) ? filename : file.name;

			var handleError = mxUtils.bind(this, function(e)
			{
				if (timeout.clear())
				{
					onerror(e);
				}
			});

			var delayed = mxUtils.bind(this, function()
			{
				this.loadingExtensions = false;

				if (this.doImportVisio)
				{
					var remote = this.isRemoteVisioFormat(filename);
					
					try
					{
						var ext = 'UNKNOWN-VISIO';
						var dot = filename.lastIndexOf('.');
						
						if (dot >= 0 && dot < filename.length)
						{
							ext = filename.substring(dot + 1).toUpperCase();
						}
						else
						{
							var slash = filename.lastIndexOf('/');
							
							if (slash >= 0 && slash < filename.length)
							{
								filename = filename.substring(slash + 1);
							}
						}
						
						// EditorUi.logEvent({category: ext + '-MS-IMPORT-FILE',
						// 	action: 'filename_' + filename,
						// 	label: (remote) ? 'remote' : 'local'});
					}
					catch (e)
					{
						// ignore
					}
					
					if (remote) 
					{
						if (VSS_CONVERT_URL != null && !this.isOffline())
						{
							var formData = new FormData();
							formData.append('file1', file, filename);
		
							var xhr = new XMLHttpRequest();
							xhr.open('POST', VSS_CONVERT_URL + (/(\.vss|\.vsx)$/.test(filename)? '?stencil=1' : ''));
							xhr.responseType = 'blob';
							this.addRemoteServiceSecurityCheck(xhr);
							
							if (customParam != null)
							{
								xhr.setRequestHeader('x-convert-custom', customParam);
							}
							
							xhr.onreadystatechange = mxUtils.bind(this, function()
							{
								if (xhr.readyState == 4 && timeout.clear())
								{
									if (xhr.status >= 200 && xhr.status <= 299)
									{
										try
										{
											var resp = xhr.response;

											if (resp.type == 'text/xml')
											{
												var reader = new FileReader();
												
												reader.onload = mxUtils.bind(this, function(e)
												{
													try
													{
														done(e.target.result);
													}
													catch (e)
													{
														handleError({message: mxResources.get('errorLoadingFile')});
													}
												});
						
												reader.readAsText(resp);
											}
											else
											{
												this.doImportVisio(resp, done, handleError, filename);
											}
										}
										catch (e)
										{
											handleError(e);
										}
									}
									else
									{
										try
										{
											if (xhr.responseType == '' || xhr.responseType == 'text')
											{
												handleError({message: xhr.responseText});
											}
											else
											{
												var reader = new FileReader();

												reader.onload = function() 
												{
													try
													{	
														handleError({message: JSON.parse(reader.result).Message});
													}
													catch (e)
													{
														if (reader.result != null && reader.result.length > 0)
														{	
															handleError({message: reader.result});
														}
														else
														{
															handleError(e);
														}
													}
												}

												reader.readAsText(xhr.response);
											}
										}
										catch(e)
										{
											handleError({});
										}
									}
								}
							});
							
							xhr.send(formData);
						}
						else
						{
							if (/(\.vss|\.vsx)$/i.test(filename))
							{
								handleError({message: mxResources.get('tryVssDraw', ['https://vss.draw.io'])});
							}
							else
							{
								handleError({message: this.getServiceName() != 'draw.io'? mxResources.get('vsdNoConfig') :
									mxResources.get('serviceUnavailableOrBlocked')});
							}
						}
					}
					else if (timeout.clear())
					{
						try
						{
							this.doImportVisio(file, done, handleError, filename);
						}
						catch (e)
						{
							handleError(e);
						}
					}
				}
				else
				{
					handleError({message: mxResources.get('serviceUnavailableOrBlocked')});
				}
			});
			
			if (!this.doImportVisio && !this.loadingExtensions && !this.isOffline(true))
			{
				this.loadingExtensions = true;
				mxscript(window.DRAWIO_SERVER_URL + 'js/extensions.min.js', delayed, null, null, null, handleError);
			}
			else
			{
				delayed();
			}
		}), onerror);
	};

	/**
	 * Imports the given GraphML (yEd) file
	 */
	EditorUi.prototype.importGraphML = function(xmlData, done, error)
	{
		var onerror = mxUtils.bind(this, function(e)
		{
			this.loadingExtensions = false;

			if (error != null)
			{
				error(e);
			}
			else
			{
				this.handleError(e);
			}
		});

		this.createTimeout(null, mxUtils.bind(this, function(timeout)
		{
			var handleError = mxUtils.bind(this, function(e)
			{
				if (timeout.clear())
				{
					onerror(e);
				}
			});

			var delayed = mxUtils.bind(this, function()
			{
				this.loadingExtensions = false;

				if (timeout.clear())
				{
					if (this.doImportGraphML)
					{
						try
						{
							this.doImportGraphML(xmlData, done, onerror);
						}
						catch (e)
						{
							handleError(e);
						}
					}
					else
					{
						handleError({message: mxResources.get('serviceUnavailableOrBlocked')});
					}
				}
			});
			
			if (!this.doImportGraphML && !this.loadingExtensions && !this.isOffline(true))
			{
				this.loadingExtensions = true;
				mxscript(window.DRAWIO_SERVER_URL + 'js/extensions.min.js', delayed, null, null, null, handleError);
			}
			else
			{
				delayed();
			}
		}), onerror);
	};	
	
	/**
	 * Export the diagram to VSDX
	 */
	EditorUi.prototype.exportVisio = function(currentPage)
	{
		if (this.spinner.spin(document.body, mxResources.get('loading')))
		{
			var onerror = mxUtils.bind(this, function(e)
			{
				this.loadingExtensions = false;
				this.handleError(e);
			});

			if (!this.vsdxExportEnabled())
			{
				onerror({message: mxResources.get('serviceUnavailableOrBlocked')});
				return;
			}

			this.createTimeout(null, mxUtils.bind(this, function(timeout)
			{
				var handleError = mxUtils.bind(this, function(e)
				{
					if (timeout.clear())
					{
						onerror(e);
					}
				});

				var delayed = mxUtils.bind(this, function()
				{
					this.loadingExtensions = false;

					if (timeout.clear())
					{
						if (typeof VsdxExport  !== 'undefined')
						{
							try
							{
								this.spinner.stop();
								var expSuccess = new VsdxExport(this).exportCurrentDiagrams(currentPage);
								
								if (!expSuccess)
								{
									handleError({message: mxResources.get('unknownError')});
								}
							}
							catch (e)
							{
								handleError(e);
							}
						}
						else
						{
							handleError({message: mxResources.get('serviceUnavailableOrBlocked')});
						}
					}
				});
				
				if (typeof VsdxExport === 'undefined' && !this.loadingExtensions && !this.isOffline(true))
				{
					this.loadingExtensions = true;
					mxscript(window.DRAWIO_SERVER_URL + 'js/extensions.min.js', delayed, null, null, null, handleError);
				}
				else
				{
					// Async needed for showing spinner for longer exports
					window.setTimeout(delayed, 0);
				}
			}), onerror);
		}
	};
	
	/**
	 * Imports the given Lucidchart data.
	 */
	EditorUi.prototype.convertLucidChart = function(data, success, error)
	{
		var onerror = mxUtils.bind(this, function(e)
		{
			this.loadingExtensions = false;

			if (error != null)
			{
				error(e);
			}
			else
			{
				this.handleError(e);
			}
		});

		this.createTimeout(null, mxUtils.bind(this, function(timeout)
		{
			var handleError = mxUtils.bind(this, function(e)
			{
				if (timeout.clear())
				{
					onerror(e);
				}
			});

			var delayed = mxUtils.bind(this, function()
			{
				this.loadingExtensions = false;
				
				if (timeout.clear())
				{
					// Checks for signature method
					if (typeof window.LucidImporter !== 'undefined')
					{
						try
						{
							var obj = JSON.parse(data);
							success(LucidImporter.importState(obj));

							try
							{
								// EditorUi.logEvent({category: 'LUCIDCHART-IMPORT-FILE',
								// 	action: 'size_' + data.length});

								if (window.console != null && urlParams['test'] == '1')
								{
									var args = [new Date().toISOString(), 'convertLucidChart', obj];

									if (obj.state != null)
									{
										args.push(JSON.parse(obj.state));
									}
			
									if (obj.svgThumbs != null)
									{
										for (var i = 0; i < obj.svgThumbs.length; i++)
										{
											args.push(Editor.createSvgDataUri(obj.svgThumbs[i]));
										}
									}

									if (obj.thumb != null)
									{
										args.push(obj.thumb);
									}

									console.log.apply(console, args);
								}
							}
							catch (e)
							{
								// ignore
							}
						}
						catch (e)
						{
							if (window.console != null)
							{
								console.error(e);
							}
							
							handleError(e);
						}
					}
					else
					{
						handleError({message: mxResources.get('serviceUnavailableOrBlocked')});
					}
				}
			});
			
			if (typeof window.LucidImporter === 'undefined' &&
				!this.loadingExtensions && !this.isOffline(true))
			{
				this.loadingExtensions = true;
				
				if (urlParams['dev'] == '1')
				{
					//Lucid org chart requires orgChart layout, in production, it is part of the extemsions.min.js
					mxscript('js/diagramly/Extensions.js', function()
					{
						mxscript('js/orgchart/bridge.min.js', function()
						{
							mxscript('js/orgchart/bridge.collections.min.js', function()
							{
								mxscript('js/orgchart/OrgChart.Layout.min.js', function()
								{
									mxscript('js/orgchart/mxOrgChartLayout.js',
										delayed, null, null, null, handleError);											
								}, null, null, null, handleError);		
							}, null, null, null, handleError);	
						}, null, null, null, handleError);
					}, null, null, null, handleError);
				}
				else
				{
					mxscript(window.DRAWIO_SERVER_URL + 'js/extensions.min.js', delayed,
						null, null, null, handleError);
				}
			}
			else
			{
				// Async needed for selection
				window.setTimeout(delayed, 0);
			}
		}), onerror);
	};

	/**
	 * Re-parses a Mermaid group's source and replaces its children with the
	 * result. The fresh parse is run through `mxMermaidToDrawio.wrapGroup` (the
	 * same normalization used on insert), and the resulting wrapper's children
	 * and size are adopted into `cell` so the edit keeps the same padding and
	 * geometry as the initial insert. The cell is resized to contain all
	 * children (preserving top-left) and its mermaidData is updated.
	 *
	 * If the parser stamped `mermaidId` / `mermaidBaseStyle` / `mermaidBaseValue`
	 * on its cells (drawio-mermaid does so for every diagram type via
	 * `tagMermaidIdentity`), user customizations to per-child style and label
	 * are preserved across the regeneration. See `mergeMermaidStyleDelta` for
	 * the merge semantics.
	 */
	EditorUi.prototype.replaceLockedGroupChildren = function(cell, xml, text, config, converter)
	{
		// `converter` selects the source-diagram integration: wrapGroup
		// normalizer, the data attribute on the wrapper and the identity
		// attribute prefix. Defaults to the Mermaid integration.
		var wrapFn = (converter != null && converter.wrapGroup != null) ?
			converter.wrapGroup : mxMermaidToDrawio.wrapGroup;
		var dataAttr = (converter != null && converter.dataAttr != null) ?
			converter.dataAttr : 'mermaidData';
		var attrPrefix = (converter != null && converter.attrPrefix != null) ?
			converter.attrPrefix : 'mermaid';
		var graph = this.editor.graph;
		var doc = mxUtils.parseXml(wrapFn(xml, text, config));
		var codec = new mxCodec(doc);
		var tempModel = new mxGraphModel();
		codec.decode(doc.documentElement, tempModel);

		// wrapGroup leaves a single wrapper under the layer carrying
		// mermaidData; its children are the new content (already shifted by
		// the standard padding for flat charts, or laid out natively for
		// parser-wrapped charts).
		var tempRoot = tempModel.getRoot();
		var wrapper = null;

		for (var i = 0; tempRoot != null && i < tempModel.getChildCount(tempRoot) &&
			wrapper == null; i++)
		{
			var layer = tempModel.getChildAt(tempRoot, i);

			for (var j = 0; j < tempModel.getChildCount(layer); j++)
			{
				var c = tempModel.getChildAt(layer, j);
				var v = c.value;

				if (v != null && typeof v === 'object' && v.getAttribute != null &&
					v.getAttribute(dataAttr) != null)
				{
					wrapper = c;
					break;
				}
			}
		}

		if (wrapper == null)
		{
			return;
		}

		var newChildren = [];

		for (var i = 0; i < tempModel.getChildCount(wrapper); i++)
		{
			newChildren.push(tempModel.getChildAt(wrapper, i));
		}

		// A childless wrapper (e.g. the legacy image fallback) is itself the
		// content — adopt it as the single child rather than no-op.
		if (newChildren.length == 0)
		{
			newChildren = [wrapper];
		}

		var wrapperGeo = tempModel.getGeometry(wrapper);

		// Anchor the new content at the old content's top-left. With
		// transparentBounds the wrapper stays pinned at (0,0,0,0) and the
		// diagram's position is carried by the children's coords, so without
		// this shift a re-parse would jump the content back to the parser's
		// native origin. For protected charts (wrapper at native coords) the
		// shift is normally zero or small and harmless.
		var oldMinX = Infinity, oldMinY = Infinity;
		var oldCount = graph.model.getChildCount(cell);

		for (var i = 0; i < oldCount; i++)
		{
			var oc = graph.model.getChildAt(cell, i);

			if (graph.model.isVertex(oc))
			{
				var og = oc.getGeometry();

				if (og != null)
				{
					oldMinX = Math.min(oldMinX, og.x);
					oldMinY = Math.min(oldMinY, og.y);
				}
			}
		}

		var newMinX = Infinity, newMinY = Infinity;

		for (var i = 0; i < newChildren.length; i++)
		{
			if (tempModel.isVertex(newChildren[i]))
			{
				var ng = newChildren[i].getGeometry();

				if (ng != null)
				{
					newMinX = Math.min(newMinX, ng.x);
					newMinY = Math.min(newMinY, ng.y);
				}
			}
		}

		var shiftX = (isFinite(oldMinX) && isFinite(newMinX)) ? oldMinX - newMinX : 0;
		var shiftY = (isFinite(oldMinY) && isFinite(newMinY)) ? oldMinY - newMinY : 0;

		if (shiftX != 0 || shiftY != 0)
		{
			for (var i = 0; i < newChildren.length; i++)
			{
				var nc = newChildren[i];
				var ng = nc.getGeometry();

				if (ng == null)
				{
					continue;
				}

				ng = ng.clone();

				if (tempModel.isVertex(nc))
				{
					ng.x += shiftX;
					ng.y += shiftY;
				}
				else if (tempModel.isEdge(nc))
				{
					if (ng.points != null)
					{
						for (var k = 0; k < ng.points.length; k++)
						{
							if (ng.points[k] != null)
							{
								ng.points[k].x += shiftX;
								ng.points[k].y += shiftY;
							}
						}
					}

					if (ng.sourcePoint != null)
					{
						ng.sourcePoint.x += shiftX;
						ng.sourcePoint.y += shiftY;
					}

					if (ng.targetPoint != null)
					{
						ng.targetPoint.x += shiftX;
						ng.targetPoint.y += shiftY;
					}
				}

				tempModel.setGeometry(nc, ng);
			}
		}

		// Snapshot the user state of every existing child keyed by its
		// mermaidId BEFORE removal, so the merge below has access to
		// (currentStyle, currentLabel, baseStyle, baseValue) for each
		// previously-tagged cell. Cells without a mermaidId (other diagram
		// types, or pre-tagging files) skip the merge silently.
		var oldByMermaidId = this.snapshotMermaidIdentity(cell, attrPrefix);

		// Clone for the live graph (fresh IDs, edges remapped to clones). The
		// children already carry the correct group-relative geometry from
		// wrapGroup + the anchor shift above, so adding them needs no further
		// translation.
		var liveChildren = graph.cloneCells(newChildren, true);

		graph.getModel().beginUpdate();
		try
		{
			// Remove existing children of the group.
			var childCount = graph.model.getChildCount(cell);

			for (var j = childCount - 1; j >= 0; j--)
			{
				graph.model.remove(graph.model.getChildAt(cell, j));
			}

			for (var i = 0; i < liveChildren.length; i++)
			{
				// Reapply user style/label customizations from the previous
				// regeneration onto this fresh parser output (no-op when
				// the cell has no mermaidId or no matching old entry).
				this.applyMermaidUserCustomizations(liveChildren[i], oldByMermaidId, attrPrefix);
				graph.model.add(cell, liveChildren[i]);
			}

			// Resize the group to contain the new children, preserving top-left.
			if (wrapperGeo != null)
			{
				var geo = graph.model.getGeometry(cell);

				if (geo != null)
				{
					geo = geo.clone();
					geo.width = wrapperGeo.width;
					geo.height = wrapperGeo.height;
					graph.model.setGeometry(cell, geo);
				}
			}

			graph.setAttributeForCell(cell, dataAttr,
				JSON.stringify({data: text, config: config}, null, 2));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	};

	/**
	 * Walks the children of `groupCell` and indexes them by `mermaidId`,
	 * capturing each cell's current style + label and the parser's previous
	 * baseline (mermaidBaseStyle / mermaidBaseValue). Used by
	 * `replaceLockedGroupChildren` to compute user customization deltas
	 * before discarding the old cells.
	 */
	EditorUi.prototype.snapshotMermaidIdentity = function(groupCell, attrPrefix)
	{
		var prefix = (attrPrefix != null) ? attrPrefix : 'mermaid';
		var graph = this.editor.graph;
		var byId = {};
		var n = graph.model.getChildCount(groupCell);

		for (var i = 0; i < n; i++)
		{
			var oc = graph.model.getChildAt(groupCell, i);
			var ov = oc.value;

			if (ov == null || typeof ov !== 'object' || ov.getAttribute == null)
			{
				continue;
			}

			var mid = ov.getAttribute(prefix + 'Id');

			if (!mid) continue;

			byId[mid] = {
				currentStyle: oc.style || '',
				currentLabel: ov.getAttribute('label') || '',
				baseStyle: ov.getAttribute(prefix + 'BaseStyle') || '',
				baseValue: ov.getAttribute(prefix + 'BaseValue') || ''
			};
		}

		return byId;
	};

	/**
	 * Reapplies the user's previous style + label customizations onto a
	 * freshly-parsed cell `lc`, looked up by its `mermaidId` in the map
	 * `oldByMermaidId` produced by `snapshotMermaidIdentity`. No-op when
	 * the cell isn't tagged or no prior version exists with the same id.
	 *
	 * Only the cell's `value` (UserObject + label) and `style` are mutated;
	 * geometry comes from the new layout (the regeneration's whole point).
	 */
	EditorUi.prototype.applyMermaidUserCustomizations = function(lc, oldByMermaidId, attrPrefix)
	{
		var prefix = (attrPrefix != null) ? attrPrefix : 'mermaid';
		var nv = lc.value;

		if (nv == null || typeof nv !== 'object' || nv.getAttribute == null)
		{
			return;
		}

		var mid = nv.getAttribute(prefix + 'Id');

		if (!mid) return;

		var old = oldByMermaidId[mid];

		if (old == null) return;

		// Style: take fresh parser output, then re-apply the user's delta
		// (whatever diverges from the previous-round baseline).
		lc.style = this.mergeMermaidStyleDelta(
			old.baseStyle, old.currentStyle, lc.style || '', lc.isEdge());

		// Label: if the user diverged from the previous-round baseline,
		// keep their override. Otherwise let the new parser label stand.
		if (old.currentLabel !== old.baseValue)
		{
			nv.setAttribute('label', old.currentLabel);
		}
	};

	/**
	 * Re-applies a user's style customizations on top of a fresh parser
	 * output. The three inputs:
	 *
	 *   baseStyle    — what the parser emitted on the PREVIOUS regeneration
	 *                  (stamped on the cell as `mermaidBaseStyle` then)
	 *   currentStyle — what the cell looks like NOW: baseStyle + user edits
	 *   newStyle     — what the parser is emitting THIS regeneration
	 *
	 * Approach: parse each into an ordered key/value list, then start from
	 * `newStyle` and apply the user delta:
	 *
	 *   added/changed: any key in `currentStyle` whose value differs from
	 *                  `baseStyle` is treated as a user customization and
	 *                  overwrites whatever `newStyle` has for that key.
	 *   removed:       any key present in `baseStyle` but absent from
	 *                  `currentStyle` is treated as a user-removed key and
	 *                  is dropped from the result even if `newStyle` has it.
	 *
	 * Source-driven style changes (parser emits new key for everyone,
	 * baseStyle didn't have it) propagate freely: they're in `newStyle`
	 * but neither in baseStyle nor in currentStyle's delta, so they
	 * pass through unchanged.
	 *
	 * For edges (`isEdge`), connector-end keys are owned by the diagram
	 * source rather than the user — see `sourceManaged` below.
	 *
	 * Output preserves the order of `newStyle`'s keys, with user-added
	 * keys appended in `currentStyle` order.
	 */
	EditorUi.prototype.mergeMermaidStyleDelta = function(baseStyle, currentStyle, newStyle, isEdge)
	{
		function parseStyle(s)
		{
			var map = {};
			var keys = [];

			if (!s) return { map: map, keys: keys };

			var parts = s.split(';');

			for (var i = 0; i < parts.length; i++)
			{
				var p = parts[i];

				if (!p) continue;

				var eq = p.indexOf('=');

				if (eq > 0)
				{
					var k = p.substring(0, eq);

					if (!(k in map)) keys.push(k);
					map[k] = p.substring(eq + 1);
				}
				else
				{
					// Naked tokens (shape names like 'rounded', 'rhombus')
					// — preserved as key-only entries with value === true.
					if (!(p in map)) keys.push(p);
					map[p] = true;
				}
			}

			return { map: map, keys: keys };
		}

		var base = parseStyle(baseStyle);
		var cur = parseStyle(currentStyle);
		var fresh = parseStyle(newStyle);

		// Edge routing / connection-point keys are owned by whatever layout is
		// active, not by the user. Running an Arrange > Layout (or the mermaid
		// re-parse's own ELK pass) rewrites exitX/Y + entryX/Y and the
		// orthogonal-routing flags on every edge, so currentStyle diverges from
		// baseStyle there even when the user changed nothing. Treating that as a
		// user delta would stamp the PREVIOUS layout's attach sides (e.g. a
		// horizontal flow's exitX=1 / entryX=0) back onto the freshly re-laid-out
		// edges, leaving connection points that fight the new waypoints. Always
		// take these from the fresh parser/layout output (newStyle).
		var layoutManaged = {
			exitX: 1, exitY: 1, exitDx: 1, exitDy: 1,
			entryX: 1, entryY: 1, entryDx: 1, entryDy: 1,
			edgeStyle: 1, noEdgeStyle: 1, orthogonal: 1
		};

		// An edge's connector ends are owned by the diagram source, not the
		// user: the link operator (`-->`, `<-->`, `--o`, ...) defines the
		// arrows, so a manually added/changed/removed arrow head is reverted
		// on re-parse and the fresh output's ends always win. Gated on edges
		// because startSize/endSize mean something else on vertices (swimlane
		// title size), where user changes must survive.
		var sourceManaged = isEdge ? {
			startArrow: 1, endArrow: 1, startFill: 1, endFill: 1,
			startSize: 1, endSize: 1
		} : {};

		var resultMap = {};
		var resultKeys = [];

		// Start from the fresh parser output.
		for (var i = 0; i < fresh.keys.length; i++)
		{
			var k = fresh.keys[i];
			resultMap[k] = fresh.map[k];
			resultKeys.push(k);
		}

		// User-added or user-changed keys (cur diverges from base).
		for (var i = 0; i < cur.keys.length; i++)
		{
			var k = cur.keys[i];

			if (layoutManaged[k] || sourceManaged[k]) continue;

			if (cur.map[k] !== base.map[k])
			{
				if (!(k in resultMap)) resultKeys.push(k);
				resultMap[k] = cur.map[k];
			}
		}

		// User-removed keys (in base but not in cur).
		for (var i = 0; i < base.keys.length; i++)
		{
			var k = base.keys[i];

			if (layoutManaged[k] || sourceManaged[k]) continue;

			if (!(k in cur.map))
			{
				delete resultMap[k];
			}
		}

		var out = [];

		for (var i = 0; i < resultKeys.length; i++)
		{
			var k = resultKeys[i];
			var v = resultMap[k];

			if (v === undefined) continue;
			if (v === true) out.push(k);
			else out.push(k + '=' + v);
		}

		return out.length > 0 ? out.join(';') + ';' : '';
	};

	/**
	 * Renders the given diagram XML to an SVG element via a temporary graph.
	 * An optional border (px, at scale 1) adds uniform padding around the
	 * content — used by the Mermaid image path to match the small padding the
	 * legacy upstream-rendered images had.
	 */
	EditorUi.prototype.getSvgForXml = function(xml, border)
	{
		var result = null;
		var graph = this.createTemporaryGraph(this.editor.graph.getStylesheet());

		try
		{
			document.body.appendChild(graph.container);
			var codec = new mxCodec(mxUtils.parseXml(xml));
			codec.decode(mxUtils.parseXml(xml).documentElement, graph.getModel());
			result = graph.getSvg(null, null, border, null, null, null, null,
				null, null, null, null, null, null, null, true, true);
		}
		finally
		{
			document.body.removeChild(graph.container);
		}

		return result;
	};

	/**
	 * Generates a diagram for the given prompt and returns diagram XML.
	 */
	EditorUi.prototype.generateOpenAiMermaidDiagram = function(prompt, success, error, options)
	{
		var maxRetries = 3;
		var retryCount = 0;

		var fn = mxUtils.bind(this, function()
		{
			this.createTimeout(this.editor.generateTimeout, mxUtils.bind(this, function(timeout)
			{
				// EditorUi.logEvent({category: 'OPENAI-DIAGRAM',
				// 	action: 'generateOpenAiMermaidDiagram',
				// 	label: prompt});
				var driveDomain = '';

				if (this.drive != null && this.drive.getUser() != null)
				{
					var user = this.drive.getUser();

					if (user.email != null && user.email.indexOf('@') > 0)
					{
						driveDomain = user.email.substring(user.email.indexOf('@') + 1);
					}
				}

				var data = {
					prompt: prompt,
					driveDomain: driveDomain,
					options: (options != null) ? options : {}
				};
				var url = 'https://www.draw.io/generate/v3';
				EditorUi.debug('EditorUi.generateOpenAiMermaidDiagram',
					[this], 'data', [data], 'url', [url]);
				var t0 = Date.now();
				var req = new mxXmlRequest(url, JSON.stringify(data), 'POST');
				
				var handleError = mxUtils.bind(this, function(e)
				{
					if (timeout.clear())
					{
						EditorUi.debug('EditorUi.generateOpenAiMermaidDiagram',
							[this], 'data', [data], 'error', [e],
							'time', (Date.now() - t0) + ' ms');		
						error(e);
					}
				});

				var retry = mxUtils.bind(this, function(e)
				{
					if (retryCount++ < maxRetries)
					{
						if (timeout.clear())
						{
							fn();
						}
					}
					else
					{
						handleError(e);
					}
				});
				
				req.send(mxUtils.bind(this, function(req)
				{
					if (timeout.isAlive())
					{
						if (req.getStatus() >= 200 && req.getStatus() <= 299)
						{
							this.tryAndHandle(mxUtils.bind(this, function()
							{
								var response = req.getText();

								try
								{
									response = JSON.parse(response);
									result = response.result;
								}
								catch (e)
								{
									result = response;
									// ignore
								}

								EditorUi.debug('EditorUi.generateOpenAiMermaidDiagram',
									[this], 'data', [data], 'response', [response],
									'time', (Date.now() - t0) + ' ms');
								
								// Prefer an <mxGraphModel> found anywhere in the
								// response. extractGraphModelFromText tolerates a
								// leading newline/BOM, a markdown ```xml fence or a
								// prose preamble around the XML — all of which defeat
								// a bare charAt(0)=='<' check and misroute valid
								// draw.io XML into the mermaid parser (surfacing as a
								// bogus "Unsupported diagram type: <mxfile").
								var parsed = Editor.extractGraphModelFromText(result);

								if (parsed != null && parsed[1] != '')
								{
									if (timeout.clear())
									{
										success(parsed[1]);
									}
								}
								else if (mxUtils.trim(result).charAt(0) == '<')
								{
									// XML-ish but no extractable <mxGraphModel> (e.g.
									// a compressed <mxfile>): still treat it as draw.io
									// XML, not mermaid, so it never hits the parser.
									if (timeout.clear())
									{
										success(result);
									}
								}
								else
								{
									// Route through the shared mermaid classifier (strips a
									// markdown fence and validates the type via the parser),
									// matching the custom-endpoint chat path. Falls back to the
									// raw result so a non-mermaid response still produces a
									// proper "Unsupported diagram type" error rather than being
									// misparsed (e.g. a ```mermaid fence reaching the parser).
									var mermaid = this.extractMermaidDeclaration(result) || result;

									this.parseMermaidDiagram(mermaid, null, mxUtils.bind(this, function(xml)
									{
										this.tryAndHandle(mxUtils.bind(this, function()
										{
											if (timeout.clear())
											{
												// Wrap in an editable mermaid group (carries the
												// source for double-click edit), as the insert dialog does
												success(mxMermaidToDrawio.wrapGroup(
													xml, mermaid, null));
											}
										}), handleError);
									}), handleError, retry);
								}
							}), handleError, true);
						}
						else
						{
							var e = {message: mxResources.get('error') + ' ' + req.getStatus()};

							try
							{
								e = JSON.parse(req.getText());

								if (e.error != null)
								{
									e.message = e.error;
								}
							}
							catch (e)
							{
								// ignore
							}

							handleError(e);
						}
					}
				}), handleError);
			}), error);
		});

		fn();
	};

	/**
	 * Generates a Mermaid image.
	 */
	EditorUi.prototype.extractMermaidDeclaration = function(value)
	{
		value = mxUtils.trim(value);

		// Removes occasional "o" on first line in response
		if (value.substring(0, 3) == 'o\n\n')
		{
			value = value.substring(3);
		}
	
		// Various formats supported
		var tokens = value.split('```');
		tokens = (tokens.length > 1) ? tokens : value.split('<pre>');
		tokens = (tokens.length > 1) ? tokens : value.split('~~~');
		tokens = (tokens.length > 1) ? tokens : value.split('(Begins)');
		
		var text = mxUtils.trim((tokens.length <= 1) ? value : tokens[1]);
		var lines = text.split('\n');
		var startLine = 0;

		while (startLine < lines.length &&
			(lines[startLine] == 'mermaid' ||
			lines[startLine].trim().length == 0 ||
			lines[startLine].substring(0, 2) == '%%'))
		{
			startLine++;
		}

		// Removes classDef and comments and stops at any additional mermaid directive
		var lines2 = [];
		
		for (var i = startLine; i < lines.length; i++)
		{
			var temp = mxUtils.trim(lines[i]);

			if (temp.substring(0, 2) != '%%' &&
				temp.substring(0, 9) != 'classDef ')
			{
				lines2.push(lines[i]);
			}
			else if (temp == 'mermaid')
			{
				break;
			}
		}

		lines = lines2;
		text = mxUtils.trim(lines.join('\n'));

		// Validates that the cleaned text is Mermaid by asking the parser's own
		// type detection (MermaidParser, published by the Mermaid bundle and the
		// single source of truth for recognized types). A null result means the
		// first token isn't a Mermaid keyword, so the input was XML or prose and
		// we return null. When the parser isn't loaded we can't classify, so we
		// also treat the input as non-Mermaid.
		var typeInfo = (typeof MermaidParser !== 'undefined') ?
			MermaidParser.detectType(text) : null;

		EditorUi.debug('EditorUi.extractMermaidDeclaration',
			'value', [value], 'text', [text], 'typeInfo', [typeInfo],
			'startLine', startLine, 'lines', lines,
			'tokens', tokens);

		return (typeInfo != null) ? text : null;
	};

	/**
	 * Extracts the Mermaid diagram type from the given data. Returns the
	 * empty string when there is no type line (empty/comment-only input or
	 * an unclosed frontmatter block) — this is called while building parse
	 * error messages, so it must never throw on degenerate input.
	 */
	EditorUi.prototype.getMermaidDiagramType = function(data)
	{
		var lines = (data != null) ? data.split('\n') : [];
		var k = 0;

		var skipBlankAndComments = function()
		{
			while (k < lines.length && (lines[k].trim().length == 0 ||
				lines[k].substring(0, 2) == '%%'))
			{
				k++;
			}
		};

		skipBlankAndComments();

		if (k < lines.length && lines[k].trim() == '---')
		{
			do
			{
				k++;
			}
			while (k < lines.length && lines[k].trim() != '---');

			k++;
			skipBlankAndComments();
		}

		if (k >= lines.length)
		{
			return '';
		}

		var diagramType = lines[k].trim().toLowerCase();
		var sp = diagramType.indexOf(' ');

		return diagramType.substring(0, sp > 0 ?
			sp : diagramType.length);
	};

	/**
	 * Returns true when a mermaid source selects the `elk` layout for a
	 * flowchart. Two equivalent forms are recognized:
	 *   - the legacy init directive
	 *     `%%{init: {flowchart: {defaultRenderer: "elk"}}}%%`, and
	 *   - the YAML-frontmatter config key `config: { layout: elk }`
	 *     (the form Mermaid recommends since v10.5.0, which deprecated
	 *     directives) — this is what drawio-mcp now round-trips.
	 * Both must produce identical geometry, so both route through the same
	 * post-parse {@link ElkLayout} pass: mermaid's elk renderer differs
	 * structurally from drawio native ELK output, and running our layered
	 * preset on the parsed XML produces a layout that matches the
	 * mermaid-cli reference.
	 */
	EditorUi.prototype.isMermaidElkFlowchart = function(data)
	{
		return data != null &&
			(/defaultRenderer["']?\s*:\s*["']?elk/i.test(data) ||
				/(?:^|\n)\s*layout\s*:\s*["']?elk\b/i.test(data)) &&
			/(?:flowchart|graph)\b/i.test(data);
	};

	/**
	 * Re-runs drawio's layered ElkLayout on parsed mermaid XML so
	 * flowchart-elk diagrams open with the menu's "Layout → Horizontal
	 * Flow" geometry already applied. Decodes the XML into a hidden
	 * offscreen Graph, runs the layout, encodes back. Falls back to the
	 * unlaid-out XML on any error; success is invoked exactly once and
	 * its exceptions propagate to the caller.
	 */
	EditorUi.prototype.applyMermaidElkPostPass = function(xml, data, success)
	{
		if (typeof ElkLayout === 'undefined' || typeof Graph === 'undefined')
		{
			success(xml);
			return;
		}

		var dirMatch = data.match(
			/(?:flowchart|graph)\s+(LR|RL|TB|TD|BT)/i);
		var dirMap = { LR: 'RIGHT', RL: 'LEFT',
			TB: 'DOWN', TD: 'DOWN', BT: 'UP' };
		var direction = dirMatch
			? (dirMap[dirMatch[1].toUpperCase()] || 'DOWN')
			: 'DOWN';

		var container = document.createElement('div');
		container.style.cssText =
			'position:absolute;left:-99999px;top:-99999px;' +
			'width:1200px;height:800px;visibility:hidden;';
		document.body.appendChild(container);

		var graph = null;
		var done = false;

		// Tears down the offscreen graph and delivers the result exactly
		// once. success runs outside the try blocks below so an exception
		// thrown by the caller's callback propagates instead of re-entering
		// the fallback path with a second result.
		var finish = function(result)
		{
			if (!done)
			{
				done = true;

				try
				{
					if (graph != null)
					{
						graph.destroy();
					}
				}
				catch (e)
				{
					// ignore teardown errors
				}

				container.remove();
				success(result);
			}
		};

		try
		{
			graph = new Graph(container);
			graph.foldingEnabled = false;
			graph.setEnabled(false);
			graph.setHtmlLabels(true);

			var doc = mxUtils.parseXml(xml);
			var codec = new mxCodec(doc);
			codec.decode(doc.documentElement, graph.getModel());

			// GREEDY cycle breaking overrides the bridge's DEPTH_FIRST
			// default for mermaid imports only: mermaid's elk loader runs
			// ELK's stock GREEDY, and the two strategies reverse different
			// edges in a cycle (`A -.-> B` / `B -.-> A` renders B-above-A
			// in mermaid-cli under GREEDY, A-above-B under DFS). Menu-
			// driven layout runs keep DFS via ElkLayout.DEFAULTS.
			var layout = new ElkLayout(graph, 'layered',
				{ 'elk.direction': direction,
					'elk.layered.cycleBreaking.strategy': 'GREEDY' },
				Object.assign({ mermaidPolicy: true }, ElkLayout.CANONICAL_EDGE));

			layout.execute(graph.getDefaultParent(), function (err)
			{
				var laidOutXml = null;

				if (!err)
				{
					try
					{
						var enc = new mxCodec();
						laidOutXml = mxUtils.getXml(
							enc.encode(graph.getModel()));
					}
					catch (e2)
					{
						// falls back to the unlaid-out XML below
					}
				}

				finish((laidOutXml != null) ? laidOutXml : xml);
			});
		}
		catch (e)
		{
			// A done result means this came through success (e.g. a layout
			// callback invoked synchronously) — not a layout failure
			if (done)
			{
				throw e;
			}

			finish(xml);
		}
	};

	/**
	 * Parses the given mermaid diagram and returns diagram XML.
	 */
	EditorUi.prototype.parseMermaidDiagram = function(data, config, success, error, parseErrorHandler)
	{
		var onParseError = mxUtils.bind(this, function(e)
		{
			if (parseErrorHandler != null)
			{
				parseErrorHandler(e);
			}
			else if (error != null)
			{
				error(e);
			}
			else
			{
				this.handleError(e);
			}
		});

		if (EditorUi.isMermaidSupported())
		{
			try
			{
				var xml = mxMermaidToDrawio.parseText(data, this.getMermaidConfig(data, config));

				if (xml != null)
				{
					// Flowchart-elk diagrams need an ElkLayout post-pass
					// to match the mermaid-cli reference (the parser's
					// own layout is closer to dagre than to mermaid's
					// elk renderer). Skip when ElkLayout isn't loaded.
					if (this.isMermaidElkFlowchart(data))
					{
						this.applyMermaidElkPostPass(xml, data, success);
					}
					else
					{
						success(xml);
					}
				}
				else
				{
					onParseError(new Error('Unsupported diagram type: ' +
						this.getMermaidDiagramType(data)));
				}
			}
			catch (e)
			{
				onParseError(e);
			}
		}
		else
		{
			onParseError(new Error('Mermaid parser not available'));
		}
	};

	/**
	 * Loads the Mermaid library extension.
	 */
	EditorUi.prototype.loadMermaid = function(success, error)
	{
		var onerror = mxUtils.bind(this, function(e)
		{
			this.loadingMermaid = false;
			error(e);
		});
		
		var onsuccess = mxUtils.bind(this, function()
		{
			try
			{
				this.loadingMermaid = false;
				success();
			}
			catch (e)
			{
				onerror(e);
			}
		});

		if (typeof mxMermaidToDrawio === 'undefined' && !this.loadingMermaid && !this.isOffline(true))
		{
			this.loadingMermaid = true;

			var isDev = (typeof urlParams !== 'undefined' && urlParams['dev'] == '1') ||
				(window.location.search && window.location.search.indexOf('dev=1') >= 0);

			if (isDev)
			{
				// Dev mode: load drawio-elk.min.js first so that window.ELK is
				// available before drawio-mermaid.min.js binds to it
				mxscript('js/elk/drawio-elk.min.js', function()
				{
					mxscript('js/mermaid/drawio-mermaid.min.js', onsuccess,
						null, null, null, onerror);
				}, null, null, null, onerror);
			}
			else
			{
				mxscript(window.DRAWIO_SERVER_URL + 'js/extensions.min.js',
					onsuccess, null, null, null, onerror);
			}
		}
		else
		{
			window.setTimeout(onsuccess, 0);
		}
	};

	/**
	 * Loads the native PlantUML converter extension (mirrors loadMermaid).
	 */
	EditorUi.prototype.loadPlantUml = function(success, error)
	{
		var onerror = mxUtils.bind(this, function(e)
		{
			this.loadingPlantUml = false;
			error(e);
		});

		var onsuccess = mxUtils.bind(this, function()
		{
			try
			{
				this.loadingPlantUml = false;
				success();
			}
			catch (e)
			{
				onerror(e);
			}
		});

		// No offline guard, unlike loadMermaid: the bundle is same-origin
		// (desktop preloads it in bootstrap.js, the PWA precaches it), so
		// the load is attempted regardless and a failure surfaces via
		// onerror instead of a misleading "parser not available"
		if (typeof mxPlantUmlToDrawio === 'undefined' && !this.loadingPlantUml)
		{
			this.loadingPlantUml = true;

			var isDev = (typeof urlParams !== 'undefined' && urlParams['dev'] == '1') ||
				(window.location.search && window.location.search.indexOf('dev=1') >= 0);

			// The PlantUML converter ships as a self-contained vendored
			// bundle and is NOT part of extensions.min.js — loading that
			// here re-executed the Bridge.NET orgchart assembly when it
			// was already present ("Class 'OrgChart.Annotations.
			// CanBeNullAttribute' is already defined") and still didn't
			// define mxPlantUmlToDrawio.
			mxscript((isDev ? '' : window.DRAWIO_SERVER_URL) +
				'js/plantuml/drawio-plantuml.min.js', onsuccess,
				null, null, null, onerror);
		}
		else
		{
			window.setTimeout(onsuccess, 0);
		}
	};

	/**
	 * Parses the given PlantUML source with the native converter and returns
	 * diagram XML via `success`. Loads the converter bundle on demand.
	 */
	EditorUi.prototype.parsePlantUmlDiagram = function(data, config, success, error)
	{
		var onParseError = mxUtils.bind(this, function(e)
		{
			if (error != null)
			{
				error(e);
			}
			else
			{
				this.handleError(e);
			}
		});

		this.loadPlantUml(mxUtils.bind(this, function()
		{
			if (EditorUi.isNativePlantUmlSupported())
			{
				try
				{
					success(mxPlantUmlToDrawio.parseText(data, config));
				}
				catch (e)
				{
					onParseError(e);
				}
			}
			else
			{
				onParseError(new Error('PlantUML parser not available'));
			}
		}), onParseError);
	};

	/**
	 * Parses the given PlantUML source and returns, via success, the XML for
	 * a shape=image cell rendering the result (see createMermaidImageXml,
	 * shared with the Mermaid image path). The image is draw.io's own SVG
	 * render of the natively parsed cells — no PlantUML server is involved.
	 * The source is carried on plantUmlData for re-editing; the stored
	 * config stays null, like the insert path's editable diagram output.
	 */
	EditorUi.prototype.parsePlantUmlImage = function(text, success, error)
	{
		this.parsePlantUmlDiagram(text, null, mxUtils.bind(this, function(xml)
		{
			success(this.createMermaidImageXml(text, null, xml, null, null, 'plantUmlData'));
		}), error);
	};

	/**
	 * Returns the Mermaid configuration for the given diagram.
	 */
	EditorUi.prototype.getMermaidConfig = function(data, config)
	{
		config = (config != null) ? config : mxUtils.clone(EditorUi.defaultMermaidConfig);
		config.securityLevel = 'strict';
		config.startOnLoad = false;
		config.maxTextSize = 900000;

		return config;
	};

	/**
	 * Renders the given parsed Mermaid XML (the output of parseMermaidDiagram)
	 * to an SVG image and returns {data, width, height}, where data is a
	 * semicolon-free data URI ready to be stored in a shape=image cell style.
	 * The upstream Mermaid renderer is gone, so the image is draw.io's own SVG
	 * rendering of the parsed cells (matching what the editable diagram shows).
	 * The optional border (px, the mermaidData `border` field) defaults to
	 * EditorUi.mermaidImageBorder when null/invalid.
	 */
	EditorUi.prototype.getMermaidImageForXml = function(parsedXml, border)
	{
		border = parseFloat(border);
		border = isNaN(border) ? EditorUi.mermaidImageBorder : border;
		var svgRoot = this.getSvgForXml(parsedXml, border);
		var w = parseFloat(svgRoot.getAttribute('width'));
		var h = parseFloat(svgRoot.getAttribute('height'));

		if (isNaN(w) || isNaN(h))
		{
			try
			{
				var viewBox = svgRoot.getAttribute('viewBox').split(/\s+/);
				w = parseFloat(viewBox[2]);
				h = parseFloat(viewBox[3]);
			}
			catch (e)
			{
				// Falls through to the defaults below
			}

			// Any size such that it shows up
			w = w || 100;
			h = h || 100;
		}

		return {
			data: this.convertDataUri(Editor.createSvgDataUri(mxUtils.getXml(svgRoot))),
			width: w,
			height: h
		};
	};

	/**
	 * Builds the XML for a shape=image cell that renders the given parsed
	 * Mermaid XML as a static SVG image and carries the Mermaid source on
	 * mermaidData (so double-click can re-edit it). Mirrors the legacy
	 * image-based Mermaid insert that was removed with mermaid.min.js. The
	 * optional border (px) is the configurable mermaidData `border` field;
	 * when omitted the EditorUi.mermaidImageBorder default applies and no
	 * border is stored (keeping the legacy {data, config} format). The
	 * optional dataAttr selects the source attribute for other converters
	 * (PlantUML passes plantUmlData), like replaceLockedGroupChildren.
	 */
	EditorUi.prototype.createMermaidImageXml = function(mermaidData, config, parsedXml, prompt, border, dataAttr)
	{
		var img = this.getMermaidImageForXml(parsedXml, border);
		var graph = new Graph(document.createElement('div'));
		var cell = graph.insertVertex(null, null, null, 0, 0, img.width, img.height,
			'shape=image;noLabel=1;verticalAlign=top;imageAspect=1;image=' + img.data + ';');
		graph.setAttributeForCell(cell, (dataAttr != null) ? dataAttr : 'mermaidData',
			JSON.stringify({data: mermaidData, config: config, border: border}, null, 2));

		if (prompt != null)
		{
			graph.setAttributeForCell(cell, 'templatePrompt', prompt);
		}

		var codec = new mxCodec();

		return mxUtils.getXml(codec.encode(graph.getModel()));
	};

	/**
	 * Parses the given Mermaid source and returns, via success, the XML for a
	 * shape=image cell rendering the result (see createMermaidImageXml). Parses
	 * with EditorUi.legacyMermaidConfig (the config previous versions used for
	 * Mermaid images) so the image matches the legacy look; the stored config
	 * stays null, matching legacy image cells (the double-click edit path uses
	 * legacyMermaidConfig for image cells regardless of the stored config).
	 */
	EditorUi.prototype.parseMermaidImage = function(text, success, error)
	{
		this.parseMermaidDiagram(text, mxUtils.clone(EditorUi.legacyMermaidConfig),
			mxUtils.bind(this, function(xml)
		{
			success(this.createMermaidImageXml(text, null, xml));
		}), error);
	};

	/**
	 * Re-renders a shape=image Mermaid cell from freshly-parsed Mermaid XML,
	 * keeping it an image (style, size and mermaidData are updated in place).
	 * Used by the double-click edit path so legacy/static image cells stay
	 * images instead of being converted to editable diagrams. The border (px,
	 * the mermaidData `border` field) is preserved across the re-render. The
	 * optional dataAttr selects the source attribute for other converters
	 * (PlantUML passes plantUmlData), like replaceLockedGroupChildren.
	 */
	EditorUi.prototype.updateMermaidImage = function(cell, text, config, parsedXml, border, dataAttr)
	{
		var graph = this.editor.graph;
		var img = this.getMermaidImageForXml(parsedXml, border);
		graph.setCellStyles('image', img.data, [cell]);
		var geo = graph.model.getGeometry(cell);

		if (geo != null)
		{
			geo = geo.clone();
			geo.width = img.width;
			geo.height = img.height;
			graph.cellsResized([cell], [geo], false);
		}

		graph.setAttributeForCell(cell, (dataAttr != null) ? dataAttr : 'mermaidData',
			JSON.stringify({data: text, config: config, border: border}, null, 2));
	};

	/**
	 * Swaps a Mermaid or PlantUML cell for the other representation (editable
	 * diagram group <-> static SVG image) when the output type is changed in
	 * the edit dialog. newXml is the replacement content from the converter's
	 * wrapGroup or createMermaidImageXml; it is imported at the old cell's
	 * visible top-left (parent offsets are accumulated so a nested cell keeps
	 * its on-screen position) and the old cell is removed. Like the insert
	 * paths, the imported content lands in the current layer.
	 */
	EditorUi.prototype.replaceMermaidCell = function(cell, newXml)
	{
		var graph = this.editor.graph;

		// getBoundingBoxFromGeometry, not the stored geometry: the editable
		// diagram wrapper is a transparentBounds group whose geometry is
		// pinned at (0,0,0,0) — its visible position is derived from the
		// children, so reading geo.x/y would plant the replacement image at
		// the parent origin. The override resolves the derived box; plain
		// cells (images, legacy text) yield their geometry box as before.
		var bounds = graph.getBoundingBoxFromGeometry([cell]);
		var dx = (bounds != null) ? bounds.x : 0;
		var dy = (bounds != null) ? bounds.y : 0;
		var parent = graph.model.getParent(cell);

		while (parent != null && graph.model.isVertex(parent))
		{
			var pgeo = graph.model.getGeometry(parent);

			if (pgeo != null)
			{
				dx += pgeo.x;
				dy += pgeo.y;
			}

			parent = graph.model.getParent(parent);
		}

		graph.getModel().beginUpdate();
		try
		{
			// Import before removing so a parse/import failure can't drop the
			// original; crop positions the new cells from their own bounds, so
			// the still-present old cell doesn't affect placement.
			var inserted = this.importXml(newXml, dx, dy, true, null, null, true);
			graph.model.remove(cell);
			graph.setSelectionCells(inserted);
		}
		finally
		{
			graph.getModel().endUpdate();
		}

		graph.scrollCellToVisible(graph.getSelectionCell());
	};

	/**
	 * Inserts the given text as a preformatted HTML text.
	 */
	EditorUi.prototype.insertAsPreText = function(text, x, y)
	{
		var graph = this.editor.graph;
		var cell = null;
		
		graph.getModel().beginUpdate();
		try
		{
			cell = graph.insertVertex(null, null, '<pre>' + text + '</pre>',
				x, y, 1, 1, 'text;html=1;align=left;verticalAlign=top;');
			graph.updateCellSize(cell, true);
		}
		finally
		{
			graph.getModel().endUpdate();
		}

		return cell;
	};

	/**
	 * Imports the given XML into the existing diagram.
	 * TODO: Make this function asynchronous
	 */
	EditorUi.prototype.insertTextAt = function(text, dx, dy, html, asImage, crop, resizeImages, addNewPage)
	{
		crop = (crop != null) ? crop : true;
		resizeImages = (resizeImages != null) ? resizeImages : true;
		
		// Handles special case for Gliffy data which requires async server-side for parsing
		if (text != null)
		{
			if (Graph.fileSupport && new XMLHttpRequest().upload && this.isRemoteFileFormat(text))
			{
				if (this.isOffline())
				{
					this.showError(mxResources.get('error'), mxResources.get('notInOffline'));
				}
				else
				{
					// Fixes possible parsing problems with ASCII 160 (non-breaking space)
					this.parseFileData(text.replace(/\s+/g,' '), mxUtils.bind(this, function(xhr)
					{
						if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299)
						{
							this.editor.graph.setSelectionCells(this.insertTextAt(
								xhr.responseText, dx, dy, true));
						}
					}));
				}

				// Returns empty cells array as it is aysynchronous
				return [];
			}
			// Handles special case of data URI which requires async loading for finding size
			else if (text.substring(0, 5) == 'data:' || (!this.isOffline() &&
				(asImage || (/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(text))))
			{
				var graph = this.editor.graph;
				
				// Checks for embedded XML in PDF
				if (text.substring(0, 28) == 'data:application/pdf;base64,')
	    		{
					var xml = Editor.extractGraphModelFromPdf(text);
					
					if (xml != null && xml.length > 0)
					{
						return this.importXml(xml, dx, dy, crop, true, addNewPage);
					}
	    		}
				
				// Checks for embedded XML in PNG
				if (Editor.isPngDataUrl(text))
				{
					var xml = Editor.extractGraphModelFromPng(text);
					
					if (xml != null && xml.length > 0)
					{
						return this.importXml(xml, dx, dy, crop, true, addNewPage);
					}
				}
				
				// Tries to extract embedded XML from SVG data URI
				if (text.substring(0, 19) == 'data:image/svg+xml;')
				{
					try
					{
						var xml = null;
						
						if (text.substring(0, 26) == 'data:image/svg+xml;base64,')
						{
							xml = text.substring(text.indexOf(',') + 1);
							xml = (window.atob && !mxClient.IS_SF) ? atob(xml) : Base64.decode(xml, true);
						}
						else
						{
							xml = decodeURIComponent(text.substring(text.indexOf(',') + 1));
						}
						
						var result = this.importXml(xml, dx, dy, crop, true, addNewPage); 
	
						if (result.length > 0)
						{
							return result;
						}
					}
					catch (e)
					{
						// Ignore
					}
				}
				
				this.loadImage(text, mxUtils.bind(this, function(img)
				{
					if (text.substring(0, 5) == 'data:')
					{
						this.resizeImage(img, Editor.stripImageMetadata(text, Editor.removeImageMetadata),
							mxUtils.bind(this, function(data2, w2, h2)
							{
								graph.setSelectionCell(graph.insertVertex(null, null, '', graph.snap(dx), graph.snap(dy),
									w2, h2, 'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;' +
									'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + this.convertDataUri(data2) + ';'));
							}), resizeImages, this.maxImageSize);
					}
					else
					{
						var s = Math.min(1, Math.min(this.maxImageSize / img.width, this.maxImageSize / img.height));
						var w = Math.round(img.width * s);
						var h = Math.round(img.height * s);
						
						graph.setSelectionCell(graph.insertVertex(null, null, '', graph.snap(dx), graph.snap(dy),
							w, h, 'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;' +
							'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + text + ';'));
					}
				}), mxUtils.bind(this, function()
				{
					var cell = null;
					
					// Inserts invalid data URIs as text
			    	graph.getModel().beginUpdate();
			    	try
			    	{
						cell = graph.insertVertex(graph.getDefaultParent(), null, text,
								graph.snap(dx), graph.snap(dy), 1, 1, 'text;' +
								((html) ? 'html=1;' : ''));
						graph.updateCellSize(cell);
						graph.fireEvent(new mxEventObject('textInserted', 'cells', [cell]));
			    	}
			    	finally
			    	{
			    		graph.getModel().endUpdate();
			    	}
	
					graph.setSelectionCell(cell);
				}));
				
				return [];
			}
			else
			{
				text = Graph.zapGremlins(mxUtils.trim(text));
			
				if (this.isCompatibleString(text))
				{
					return this.importXml(text, dx, dy, crop, null, addNewPage);
				}
				else if (text.length > 0)
				{
					if (this.isLucidChartData(text))
					{
						this.convertLucidChart(text, mxUtils.bind(this, function(xml)
						{
							this.editor.graph.setSelectionCells(
								this.importXml(xml, dx, dy, crop,
								null, addNewPage));
						}), mxUtils.bind(this, function(e)
						{
							this.handleError(e);
						}));
					}
					else
					{
						var graph = this.editor.graph;
						var cell = null;
						
				    	graph.getModel().beginUpdate();
				    	try
				    	{
				    		// Fires cellsInserted to apply the current style to the inserted text.
				    		// This requires the value to be empty when the event is fired.
				    		cell = graph.insertVertex(graph.getDefaultParent(), null, '',
								graph.snap(dx), graph.snap(dy), 1, 1, 'text;whiteSpace=wrap;' +
								((html) ? 'html=1;' : ''));
				    		graph.fireEvent(new mxEventObject('textInserted', 'cells', [cell]));
							
							if (html)
							{
								text = graph.sanitizeHtml(text);
							}

				    		//TODO Refuse unsupported file types early as at this stage a lot of processing has beed done and time is wasted. 
				    		//		For example, 5 MB PDF files is processed and then only 0.5 MB of meaningless text is added!
				    		//Limit labels to maxTextBytes
				    		if (text.length > this.maxTextBytes)
			    			{
				    			text = text.substring(0, this.maxTextBytes) + '...';
			    			}
				    		
							// Apply value and updates the cell size to fit the text block
							cell.value = text;
							graph.updateCellSize(cell);
							
							// Adds wrapping for large text blocks
							if (this.maxTextWidth > 0 && cell.geometry.width > this.maxTextWidth)
							{
								var size = graph.getPreferredSizeForCell(cell, this.maxTextWidth);
								cell.geometry.width = size.width;
								cell.geometry.height = size.height;
							}
							
							// See https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
							if (Graph.isLink(cell.value))
							{
								graph.setLinkForCell(cell, cell.value);
							}
							
							// Adds spacing
							cell.geometry.width += graph.gridSize;
							cell.geometry.height += graph.gridSize;
				    	}
				    	finally
				    	{
				    		graph.getModel().endUpdate();
				    	}
						
						return [cell];
					}
				}
			}
		}
		
		return [];
	};

	/**
	 * Formats the given file size.
	 */
	EditorUi.prototype.formatFileSize = function(size)
	{
	    var units = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
		var i = -1;
		
	    do
	    {
	    	size = size / 1024;
	        i++;
	    } while (size > 1024);

	    return Math.max(size, 0.1).toFixed(1) + units[i];
	};

	/**
	 * Imports the given XML into the existing diagram.
	 */
	EditorUi.prototype.convertDataUri = function(uri)
	{
		// Handles special case of data URI which needs to be rewritten
		// to be used in a cell style to remove the semicolon
		if (uri.substring(0, 5) == 'data:')
		{
			var semi = uri.indexOf(';');
			
			if (semi > 0)
			{
				uri = uri.substring(0, semi) + uri.substring(uri.indexOf(',', semi + 1));
			}
		}
		
		return uri;
	};
	
	/**
	 * Returns true for Gliffy data.
	 */
	EditorUi.prototype.isRemoteFileFormat = function(data, filename)
	{
		return /(\"contentType\":\s*\"application\/gliffy\+json\")/.test(data);
	};
	
	/**
	 * Returns true for Gliffy
	 */
	EditorUi.prototype.isLucidChartData = function(data)
	{
		return data != null && (data.substring(0, 26) ==
			'{"state":"{\\"Properties\\":' ||
			data.substring(0, 14) == '{"Properties":');
	};

	/**
	 * Imports a local file from the device or local storage.
	 */
	EditorUi.prototype.importLocalFile = function(device, noSplash)
	{
		if (device && Graph.fileSupport)
		{
			if (this.importFileInputElt == null) 
			{
				var input = document.createElement('input');
				input.setAttribute('type', 'file');
				
				mxEvent.addListener(input, 'change', mxUtils.bind(this, function()
				{
					if (input.files != null)
					{
						// Using null for position will disable crop of input file
						this.importFiles(input.files, null, null, this.maxImageSize);
						
			    		// Resets input to force change event for same file (type reset required for IE)
						input.type = '';
						input.type = 'file';
			    		input.value = '';
					}
				}));
				
				input.style.display = 'none';
				document.body.appendChild(input);
				this.importFileInputElt = input;
			}
			
			this.importFileInputElt.click();
		}
		else
		{
			window.openNew = false;
			window.openKey = 'import';
							
			window.listBrowserFiles = mxUtils.bind(this, function(success, error) 
			{
				StorageFile.listFiles(this, 'F', success, error);
			});
			
			window.openBrowserFile = mxUtils.bind(this, function(title, success, error)
			{
				StorageFile.getFileContent(this, title, success, error);
			});
			
			window.deleteBrowserFile = mxUtils.bind(this, function(title, success, error)
			{
				StorageFile.deleteFile(this, title, success, error);
			});

			if (!noSplash)
			{
				var prevValue = Editor.useLocalStorage;
				Editor.useLocalStorage = !device;
			}

			// Closes dialog after open
			window.openFile = new OpenFile(mxUtils.bind(this, function(cancel)
			{
				this.hideDialog(cancel);
			}));
			
			window.openFile.setConsumer(mxUtils.bind(this, function(xml, filename)
			{
				if (filename != null && Graph.fileSupport && /(\.v(dx|sdx?))($|\?)/i.test(filename))
				{
					// "Not a UTF 8 file" when opening VSDX in IE so this is never called
					var file = new Blob([xml], {type: 'application/octet-stream'})
					
					this.importVisio(file, mxUtils.bind(this, function(xml)
					{
						this.importXml(xml, 0, 0, true);
					}), null, filename);
				}
				else
				{				
					this.editor.graph.setSelectionCells(this.importXml(xml, 0, 0, true));
				}
			}));

			// Removes openFile if dialog is closed
			this.showDialog(new OpenDialog(this).container,  (Editor.useLocalStorage) ? 640 : 360,
				(Editor.useLocalStorage) ? 480 : 220, true, true, function()
			{
				window.openFile = null;
			});
			
			// Extends dialog close to show splash screen
			if (!noSplash)
			{
				var dlg = this.dialog;
				var dlgClose = dlg.close;
				
				this.dialog.close = mxUtils.bind(this, function(cancel)
				{
					Editor.useLocalStorage = prevValue;
					dlgClose.apply(dlg, arguments);
					
					if (cancel && this.getCurrentFile() == null && urlParams['embed'] != '1')
					{
						this.showSplash();
					}
				});
			}
		}
	};

	/**
	 * Imports the given zip file.
	 */
	EditorUi.prototype.importZipFile = function(file, success, onerror)
	{
		var ui = this;
		
		var delayed = mxUtils.bind(this, function()
		{
			this.loadingExtensions = false;
			
			if (typeof JSZip  !== 'undefined')
			{
				JSZip.loadAsync(file).then(function(zip) 
		        {
		        	if (mxUtils.isEmptyObject(zip.files))
		        	{
		        		onerror();
		        	}
		        	else
		        	{
		        		var gliffyLatestVer = {version: 0};
		        		var drawioFound = false;
		        		
		                zip.forEach(function (relativePath, zipEntry) 
		                {
		                	var name = zipEntry.name.toLowerCase();
							
		                    if (name == 'diagram/diagram.xml') //draw.io zip format has the latest diagram version at diagram/diagram.xml
		                    {
		                    	drawioFound = true;
		                    	
			                    zipEntry.async("string").then(function(str){
			                    	if (str.indexOf('<mxfile ') == 0)
			                    	{
			                    		success(str);
			                    	}
			                    	else
		                    		{
			                    		onerror();
		                    		}
			                    });
		                    }
		                    else if (name.indexOf('versions/') == 0) //Gliffy zip format has the versions inside versions folder
		                   	{
		                    	var version = parseInt(name.substr(9)); //9 is the length of versions/
		                    	
		                    	if (version > gliffyLatestVer.version)
		                    	{
		                    		gliffyLatestVer = {version: version, zipEntry: zipEntry}
		                    	}
		                   	}
		                });
		                
		                if (gliffyLatestVer.version > 0)
		            	{
		                	gliffyLatestVer.zipEntry.async("string").then(function(data)
		                	{
		                		if (new XMLHttpRequest().upload && ui.isRemoteFileFormat(data, file.name))
		                		{
									if (ui.isOffline())
									{
										ui.showError(mxResources.get('error'), mxResources.get('notInOffline'), null, onerror);
									}
									else
									{
										ui.parseFileData(data, mxUtils.bind(this, function(xhr)
										{
											if (xhr.readyState == 4)
											{
												if (xhr.status >= 200 && xhr.status <= 299)
												{
													success(xhr.responseText);
												}
												else
												{
													onerror();
												}
											}
										}), file.name);
									}
		                		}
		                		else
		            			{
		                			onerror();
		            			}
		                	});
		            	}
		                else if (!drawioFound)
		            	{
		                	onerror();
		            	}
		        	}
		        }, function (e) {
		    		onerror(e);
		        }); 
			}
			else
			{
				onerror();
			}
		});
		
		if (typeof JSZip === 'undefined' && !this.loadingExtensions && !this.isOffline(true))
		{
			this.loadingExtensions = true;
			mxscript(window.DRAWIO_SERVER_URL + 'js/extensions.min.js', delayed,
				null, null, null, onerror);
		}
		else
		{
			delayed();
		}
	};
	
	/**
	 * Imports the given XML into the existing diagram.
	 */
	EditorUi.prototype.importFile = function(data, mimeType, dx, dy, w, h, filename,
		done, file, crop, ignoreEmbeddedXml, evt)
	{
		crop = (crop != null) ? crop : true;
		var async = false;
		var cells = null;

		var handleResult = mxUtils.bind(this, function(xml)
		{
			var importedCells = null;
			
			if (xml != null && xml.substring(0, 10) == '<mxlibrary')
			{
				this.loadLibrary(new LocalLibrary(this, xml, filename));
				this.showSidebar();
			}
			else
			{
				importedCells = this.importXml(xml, dx, dy, crop, null,
					(evt != null) ? mxEvent.isControlDown(evt) : null);
			}
			
			if (done != null)
			{
				done(importedCells);
			}
		});

		if (mimeType.substring(0, 5) == 'image')
		{
			var containsModel = false;

			if (mimeType.substring(0, 9) == 'image/png')
			{
				var xml = (ignoreEmbeddedXml) ? null : this.extractGraphModelFromPng(data);
				
				if (xml != null && xml.length > 0)
				{
					cells = this.importXml(xml, dx, dy, crop, null, (evt != null) ?
						mxEvent.isControlDown(evt) : null);
					containsModel = true;
				}
			}
			
			if (!containsModel)
			{
				var graph = this.editor.graph;
				
				// Strips encoding bit (eg. ;base64,) for cell style
				var semi = data.indexOf(';');
	
				if (semi > 0)
				{
					data = data.substring(0, semi) + data.substring(data.indexOf(',', semi + 1));
				}
				
				if (crop && graph.isGridEnabled())
				{
					dx = graph.snap(dx);
					dy = graph.snap(dy);
				}

				var style = 'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;' +
					'verticalAlign=top;aspect=fixed;imageAspect=0;';
				
				if (mimeType.substring(0, 9) == 'image/svg')
				{
					style += 'editableCssRules=.*;';
				}

				cells = [graph.insertVertex(null, null, '', dx, dy,
					w, h, style + 'image=' + data + ';')];
			}
		}
		else if (/(\.*<graphml )/.test(data)) 
        {
			async = true;

			this.importGraphML(data, handleResult);
        }
		else if (file != null && filename != null && EditorUi.isVisioFilename(filename))
		{
			//  LATER: done and async are a hack before making this asynchronous
			async = true;

			this.importVisio(file, handleResult);
		}
		else if (new XMLHttpRequest().upload && this.isRemoteFileFormat(data, filename))
		{
			if (this.isOffline())
			{
				this.showError(mxResources.get('error'), mxResources.get('notInOffline'));
			}
			else
			{
				//  LATER: done and async are a hack before making this asynchronous
				async = true;

				// Returns empty cells array as it is aysynchronous
				var parseCallback = mxUtils.bind(this, function(xhr)
				{
					if (xhr.readyState == 4)
					{
						if (xhr.status >= 200 && xhr.status <= 299)
						{
							handleResult(xhr.responseText);
						}
						else if (done != null)
						{
							done(null);
							this.showError(mxResources.get('error'),
								xhr.status == 413 ? mxResources.get('diagramTooLarge') :
									mxResources.get('unknownError'));
						}
					}
				});

				if (data != null)
				{
					this.parseFileData(data, parseCallback, filename);
				}
				else
				{
					this.parseFile(file, parseCallback, filename);
				}
			}
		}
		else if (data.indexOf('PK') == 0 && file != null)
		{
			async = true;
			
			this.importZipFile(file, handleResult, mxUtils.bind(this, function()
			{
				//If importing as a zip file failed, just insert as text
				cells = this.insertTextAt(this.validateFileData(data), dx, dy, true, null, crop);
				done(cells);
			}));
		}
		else if (!/(\.v(sd|dx))($|\?)/i.test(filename) && !/(\.vs(s|x))($|\?)/i.test(filename))
		{
			cells = this.insertTextAt(this.validateFileData(data), dx, dy, true,
				null, crop, null, (evt != null) ? mxEvent.isControlDown(evt) : null);
		}

		if (!async && done != null)
		{
			done(cells);
		}
		
		return cells;
	};

	/**
	 * 
	 */
	EditorUi.prototype.importFiles = function(files, x, y, maxSize, fn, resultFn, filterFn, barrierFn,
		resizeDialog, maxBytes, resampleThreshold, ignoreEmbeddedXml, evt)
	{
		maxSize = (maxSize != null) ? maxSize : this.maxImageSize;
		maxBytes = (maxBytes != null) ? maxBytes : this.maxImageBytes;
		
		var crop = x != null && y != null;
		var resizeImages = true;
		x = (x != null) ? x : 0;
		y = (y != null) ? y : 0;
		
		// Checks if large images are imported
		var largeImages = false;
		
		if (!mxClient.IS_CHROMEAPP && files != null)
		{
			var thresh = resampleThreshold || this.resampleThreshold;
			
			for (var i = 0; i < files.length; i++)
			{
				if (files[i].type.substring(0, 9) !== 'image/svg' &&
					files[i].type.substring(0, 6) === 'image/' &&
					files[i].size > thresh)
				{
					largeImages = true;
					
					break;
				}
			}
		}

		EditorUi.debug('EditorUi.importFiles', [this],
			'files', [files], 'x', [x], 'y', [y], 'maxSize', [maxSize],
			'maxBytes', [maxBytes], 'resampleThreshold', [this.resampleThreshold],
			'largeImages', [largeImages], 'crop', [crop], 'resizeImages', [resizeImages],
			'ignoreEmbeddedXml', [ignoreEmbeddedXml], 'evt', [evt]);
		
		var doImportFiles = mxUtils.bind(this, function()
		{
			var graph = this.editor.graph;
			var gs = graph.gridSize;
	
			fn = (fn != null) ? fn : mxUtils.bind(this, function(data, mimeType, x, y, w, h, filename, done, file)
			{
				try
				{
					if (data != null && data.substring(0, 10) == '<mxlibrary')
					{
						this.spinner.stop();
						this.loadLibrary(new LocalLibrary(this, data, filename));
						this.showSidebar();
		    			
		    			return null;
					}
					else
					{
						// Drop on empty file ignores drop location
						if (this.isCompatibleString(data) && files.length == 1 && evt != null &&
							evt.type == 'drop' && this.isBlankFile() && !this.canUndo())
						{
							crop = false;
							x = 0;
							y = 0;
						}

						return this.importFile(data, mimeType, x, y, w, h, filename,
							done, file, crop, ignoreEmbeddedXml, evt);
					}
				}
				catch (e)
				{
					this.handleError(e);
					
					return null;
				}
			});
			
			resultFn = (resultFn != null) ? resultFn : mxUtils.bind(this, function(cells)
			{
				graph.setSelectionCells(cells);
			});
			
			if (this.spinner.spin(document.body, mxResources.get('loading')))
			{
				var lastPage = this.currentPage;
				var count = files.length;
				var remain = count;
				var queue = [];
				
				// Barrier waits for all files to be loaded asynchronously
				var barrier = mxUtils.bind(this, function(index, fnc)
				{
					queue[index] = fnc;
					
					if (--remain == 0)
					{
						this.spinner.stop();
						
						if (barrierFn != null)
						{
							barrierFn(queue);
						}
						else
						{
							var cells = [];
							
							graph.getModel().beginUpdate();
							try
							{
						    	for (var j = 0; j < queue.length; j++)
						    	{
						    		var tmp = queue[j]();
						    		
						    		if (tmp != null)
						    		{
						    			cells = cells.concat(tmp);
						    		}
						    	}
							}
							finally
							{
								graph.getModel().endUpdate();
							}
						}

						// Resets view if current page changed during import
						if (lastPage != this.currentPage)
						{
							window.setTimeout(mxUtils.bind(this, function()
							{
								this.actions.get('resetView').funct();
							}), 0);
						}

						resultFn(cells);
					}
				});
				
				for (var i = 0; i < count; i++)
				{
					(mxUtils.bind(this, function(index)
					{
						var file = files[index];
						
						if (file != null)
						{
							var reader = new FileReader();
							
							reader.onload = mxUtils.bind(this, function(e)
							{
								if (filterFn == null || filterFn(file))
								{
									try
									{
										if (file.type.substring(0, 6) == 'image/')
										{
											if (file.type.substring(0, 9) == 'image/svg')
											{
												// Checks if SVG contains content attribute
												var data = Graph.clipSvgDataUri(e.target.result);
												var comma = data.indexOf(',');
												var svgText = decodeURIComponent(escape(atob(data.substring(comma + 1))));
												var root = mxUtils.parseXml(svgText);
												var svgs = root.getElementsByTagName('svg');
												
												if (svgs.length > 0)
												{
													var svgRoot = svgs[0];
													var cont = (ignoreEmbeddedXml) ? null : svgRoot.getAttribute('content');
			
													if (cont != null && cont.charAt(0) != '<' && cont.charAt(0) != '%')
													{
														cont = unescape((window.atob) ? atob(cont) : Base64.decode(cont, true));
													}
													
													if (cont != null && cont.charAt(0) == '%')
													{
														cont = decodeURIComponent(cont);
													}
			
													if (cont != null && (cont.substring(0, 8) === '<mxfile ' ||
														cont.substring(0, 14) === '<mxGraphModel>' ||
														cont.substring(0, 14) === '<mxGraphModel '))
													{
														barrier(index, mxUtils.bind(this, function()
														{
															return fn(cont, 'text/xml', x + index * gs, y + index * gs, 0, 0, file.name);	
														}));
													}
													else
													{
														// SVG needs special handling to add viewbox if missing and
														// find initial size from SVG attributes (only for IE11)
														barrier(index, mxUtils.bind(this, function()
														{
															try
															{
																// Parses SVG and find width and height
																if (root != null)
																{
																	var svgs = root.getElementsByTagName('svg');
																	
																	if (svgs.length > 0)
																	{
																		var svgRoot = svgs[0];
																		var w = svgRoot.getAttribute('width');
																		var h = svgRoot.getAttribute('height');
																		
																		if (w != null && w.charAt(w.length - 1) != '%')
																		{
																			w = parseFloat(w);
																		}
																		else
																		{
																			w = NaN;
																		}
																		
																		if (h != null && h.charAt(h.length - 1) != '%')
																		{
																			h = parseFloat(h);
																		}
																		else
																		{
																			h = NaN;
																		}
																		
																		// Check if viewBox attribute already exists
																		var vb = svgRoot.getAttribute('viewBox');
																		
																		if (vb == null || vb.length == 0)
																		{
																			svgRoot.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
																		}
																		// Uses width and height from viewbox for
																		// missing width and height attributes
																		else if (isNaN(w) || isNaN(h))
																		{
																			var tokens = vb.split(' ');
																			
																			if (tokens.length > 3)
																			{
																				w = parseFloat(tokens[2]);
																				h = parseFloat(tokens[3]);
																			}
																		}
		
																		data = Editor.createSvgDataUri(mxUtils.getXml(svgRoot));
																		var s = Math.min(1, Math.min(maxSize / Math.max(1, w)), maxSize / Math.max(1, h));
																		var cells = fn(data, file.type, x + index * gs, y + index * gs, Math.max(
																			1, Math.round(w * s)), Math.max(1, Math.round(h * s)), file.name);
																		
																		// Hack to fix width and height asynchronously
																		if (cells != null && (isNaN(w) || isNaN(h)))
																		{
																			var img = new Image();
																			
																			img.onload = mxUtils.bind(this, function()
																			{
																				w = Math.max(1, img.width);
																				h = Math.max(1, img.height);
																				
																				cells[0].geometry.width = w;
																				cells[0].geometry.height = h;
																				
																				svgRoot.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
																				data = Editor.createSvgDataUri(mxUtils.getXml(svgRoot));
																				
																				var semi = data.indexOf(';');
																				
																				if (semi > 0)
																				{
																					data = data.substring(0, semi) + data.substring(data.indexOf(',', semi + 1));
																				}
																				
																				graph.setCellStyles('image', data, [cells[0]]);
																			});
																			
																			img.src = Editor.createSvgDataUri(mxUtils.getXml(svgRoot));
																		}
																		
																		return cells;
																	}
																}
															}
															catch (e)
															{
																// ignores any SVG parsing errors
															}
															
															return null;
														}));
													}
												}
												else
												{
													barrier(index, mxUtils.bind(this, function()
													{
														return null;
													}));
												}
											}
											else
											{
												// Checks if PNG+XML is available to bypass code below
												var containsModel = false;
												
												if (file.type == 'image/png')
												{
													var xml = (ignoreEmbeddedXml) ? null : this.extractGraphModelFromPng(e.target.result);
													
													if (xml != null && xml.length > 0)
													{
														var img = new Image();
														img.src = e.target.result;
														
														barrier(index, mxUtils.bind(this, function()
														{
															return fn(xml, 'text/xml', x + index * gs, y + index * gs,
																img.width, img.height, file.name);	
														}));
														
														containsModel = true;
													}
												}
												
												// Additional asynchronous step for finding image size
												if (!containsModel)
												{
													// Cannot load local files in Chrome App
													if (mxClient.IS_CHROMEAPP)
													{
														this.spinner.stop();
														this.showError(mxResources.get('error'), mxResources.get('dragAndDropNotSupported'),
															mxResources.get('cancel'), mxUtils.bind(this, function()
															{
																// Hides the dialog
															}), null, mxResources.get('ok'), mxUtils.bind(this, function()
															{
																// Redirects to import function
																this.actions.get('import').funct();
															})
														);
													}
													else
													{
														this.loadImage(e.target.result, mxUtils.bind(this, function(img)
														{
															this.resizeImage(img, Editor.stripImageMetadata(e.target.result, Editor.removeImageMetadata),
																mxUtils.bind(this, function(data2, w2, h2)
																{
																	barrier(index, mxUtils.bind(this, function()
																	{
																		// Refuses to insert images above a certain size as they kill the app
																		if (data2 != null && data2.length < maxBytes)
																		{
																			var s = (!resizeImages || !this.isResampleImageSize(
																				file.size, resampleThreshold)) ? 1 :
																				Math.min(1, Math.min(maxSize / w2, maxSize / h2));
																			
																			return fn(data2, file.type, x + index * gs, y + index * gs,
																				Math.round(w2 * s), Math.round(h2 * s), file.name);
																		}
																		else
																		{
																			this.handleError({message: mxResources.get('imageTooBig')});
																			
																			return null;
																		}
																	}));
																}), resizeImages, maxSize, resampleThreshold, file.size);
														}), mxUtils.bind(this, function()
														{
															this.handleError({message: mxResources.get('invalidOrMissingFile')});
														}));
													}
												}
											}
										}
										else
										{
											var data = e.target.result;
											
											fn(data, file.type, x + index * gs, y + index * gs, 240, 160, file.name, function(cells)
											{
												barrier(index, function()
												{
													return cells;
												});
											}, file);
										}
									}
									catch (e)
									{
										// Ignores file parsing error
										barrier(index, mxUtils.bind(this, function()
										{
											return null;
										}));

										if (window.console != null)
										{
											console.error(e, file);
										}
									}
								}
								else
								{
									// Ignores file and decrements counter
									barrier(index, mxUtils.bind(this, function()
									{
										return null;
									}));
								}
							});
							
							// Handles special cases
							if (EditorUi.isVisioFilename(file.name))
							{
								fn(null, file.type, x + index * gs, y + index * gs, 240, 160, file.name, function(cells)
								{
									barrier(index, function()
		    	    				{
		    		    				return cells;
		    	    				});
								}, file);
							}
							else if (file.type.substring(0, 5) == 'image' || file.type == 'application/pdf')
							{
								reader.readAsDataURL(file);
							}
							else
							{
								reader.readAsText(file);
							}
						}
					}))(i);
				}
			}
		});
		
		if (largeImages)
		{
			// Workaround for lost files array in async code
			var tmp = [];
			
			for (var i = 0; i < files.length; i++)
			{
				tmp.push(files[i]);
			}
			
			files = tmp;
			
			this.confirmImageResize(function(doResize)
			{
				resizeImages = doResize;
				doImportFiles();
			}, resizeDialog);
		}
		else
		{
			doImportFiles();
		}
	};

	/**
	 * Returns true if the current file is a blank diagram.
	 */
	EditorUi.prototype.isBlankFile = function()
	{
		return this.pages != null && this.pages.length == 1 &&
			this.isDiagramEmpty() && this.currentPage.getName() ==
			mxResources.get('pageWithNumber', [1]);
	};

	/**
	 * Parses the file using XHR2 via the server. File can be a blob or file object.
	 * Filename is an optional parameter for blobs (that do not have a filename).
	 */
	EditorUi.prototype.confirmImageResize = function(fn, force)
	{
		force = (force != null) ? force : false;
		var resume = (this.spinner != null && this.spinner.pause != null) ? this.spinner.pause() : function() {};
		var resizeImages = (isLocalStorage || mxClient.IS_CHROMEAPP) ? mxSettings.getResizeImages() : null;
		
		var wrapper = function(remember, resize)
		{
			if (remember || force)
			{
				mxSettings.setResizeImages((remember) ? resize : null);
				mxSettings.save();
			}
			
			resume();
			fn(resize);
		};

		if (resizeImages != null && !force)
		{
			wrapper(false, resizeImages);
		}
		else
		{
			this.showDialog(new ConfirmDialog(this, mxResources.get('resizeLargeImages'),
				function(remember)
				{
					wrapper(remember, true);
				},
				function(remember)
				{
					wrapper(remember, false);
				}, mxResources.get('resize'), mxResources.get('actualSize'),
				'<img style="margin-top:8px;" src="' + Editor.loResImage + '"/>',
				'<img style="margin-top:8px;" src="' + Editor.hiResImage + '"/>',
				isLocalStorage || mxClient.IS_CHROMEAPP).container, 340,
				(isLocalStorage || mxClient.IS_CHROMEAPP) ? 226 : 200, true, true);
		}
	};
	
	/**
	 * Parses the file using XHR2 via the server. File can be a blob or file object.
	 * Filename is an optional parameter for blobs (that do not have a filename).
	 */
	EditorUi.prototype.parseFile = function(file, fn, filename)
	{
		filename = (filename != null) ? filename : file.name;

		var reader = new FileReader();

        reader.onload = mxUtils.bind(this, function()
		{
			this.parseFileData(reader.result, fn, filename)
        });

        reader.readAsText(file);
	};

	//TODO Use this version of the function instead of creating a Blob then read it again
	EditorUi.prototype.parseFileData = function(data, fn, filename)
	{

		var xhr = new XMLHttpRequest();
		xhr.open('POST', OPEN_URL);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		xhr.onreadystatechange = function()
		{
			fn(xhr);
		};
		
		xhr.send('format=xml&filename=' + encodeURIComponent(filename) + '&data=' + encodeURIComponent(data));
		
		try
		{
			EditorUi.logEvent({category: 'GLIFFY-IMPORT-FILE',
				action: 'size_' + file.size});
		}
		catch (e)
		{
			// ignore
		}
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.isResampleImageSize = function(size, thresh)
	{
		thresh = (thresh != null) ? thresh : this.resampleThreshold;

		return size > thresh;
	};
	
	/**
	 * Resizes the given image if <maxImageBytes> is not null.
	 */
	EditorUi.prototype.resizeImage = function(img, data, fn, enabled, maxSize, thresh, fileSize)
	{
		maxSize = (maxSize != null) ? maxSize : this.maxImageSize;
		var w = Math.max(1, img.width);
		var h = Math.max(1, img.height);
		var originalData = data;

		if (enabled && this.isResampleImageSize((fileSize != null) ? fileSize : data.length, thresh))
		{
			try
			{
				var factor = Math.max(w / maxSize, h / maxSize);
				
				if (factor > 1)
				{
					var w2 = Math.round(w / factor);
					var h2 = Math.round(h / factor);
					
					var canvas = document.createElement('canvas');
				    canvas.width = w2;
				    canvas.height = h2;
	
				    var ctx = canvas.getContext('2d');
				    ctx.drawImage(img, 0, 0, w2, h2);
				    var tmp = canvas.toDataURL();

				    // Uses new image if smaller
				    if (tmp.length < data.length)
				    {			    
				    	// Checks if the image is empty by comparing
				    	// with an empty image of the same size
				    	var canvas2 = document.createElement('canvas');
						canvas2.width = w2;
					    canvas2.height = h2;
					    var tmp2 = canvas2.toDataURL();
					    
					    if (tmp !== tmp2)
					    {	
					    	data = tmp;
					    	w = w2;
					    	h = h2;
					    }
				    }
				}
			}
			catch (e)
			{
				// ignores image scaling errors
			}
		}

		if (enabled && originalData != data && maxSize > this.maxImageSize / 2 && data.length > this.maxImageBytes)
		{
			this.resizeImage(img, data, fn, enabled, maxSize / 1.5, thresh, fileSize);
		}
		else
		{
			fn(data, w, h);
		}
	};
	
	/**
	 * Extracts the XML from the compressed or non-compressed text chunk.
	 */
	EditorUi.prototype.extractGraphModelFromPng = function(data)
	{
		return Editor.extractGraphModelFromPng(data);
	};

	/**
	 * Loads the image from the given URI.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.loadImage = function(uri, onload, onerror)
	{
		try
		{
			var img = new Image();
			
			img.onload = function()
			{
				img.width = (img.width > 0) ? img.width : 120;
				img.height = (img.height > 0) ? img.height : 120;
				
				onload(img);
			};
			
			if (onerror != null)
			{
				img.onerror = onerror;
			};
			
			img.src = uri;
		}
		catch (e)
		{
			if (onerror != null)
			{
				onerror(e);
			}
			else
			{
				throw e;
			}
		}
	};

	/**
	 * Returns the default value for sketch mode.
	 */
	EditorUi.prototype.getDefaultSketchMode = function()
	{
		var defaultValue = urlParams['sketch'] == '1';
		var roughParam = (urlParams['rough'] != null) ? urlParams['rough'] : defaultValue;
		
		return roughParam != '0';
	};

	/**
	 * Overridden to set sketch mode before UI is created.
	 */
	var editorUiCreateUi = EditorUi.prototype.createUi;
	EditorUi.prototype.createUi = function()
	{
		if (Editor.isSettingsEnabled())
		{
			if (mxSettings.settings.sidebarTitles != null)
			{
				Sidebar.prototype.sidebarTitles = mxSettings.settings.sidebarTitles;
			}

			this.formatWidth = mxSettings.getFormatWidth();

			var sw = mxSettings.getSidebarWidth();

			if (sw != null)
			{
				this.hsplitPosition = parseInt(sw);
			}
		}

		if (!this.formatEnabled)
		{
			this.formatWidth = 0;
		}

		if (!this.sidebarEnabled)
		{
			this.hsplitPosition = 0;
		}

		editorUiCreateUi.apply(this, arguments);

		if (Editor.isSettingsEnabled())
		{
			this.doSetSketchMode((mxSettings.settings.sketchMode != null && urlParams['rough'] == null &&
				urlParams['sketch'] == null) ? mxSettings.settings.sketchMode : this.getDefaultSketchMode());
		}
	};

	/**
	 * Initializes the UI.
	 */
	var editorUiInit = EditorUi.prototype.init;
	EditorUi.prototype.init = function()
	{
		mxStencilRegistry.allowEval = mxStencilRegistry.allowEval && !this.isOfflineApp();

		var ui = this;
		var graph = this.editor.graph;

		// Live obstacle-avoiding routing for edges flagged libavoidRouting=1
		// (re-route on insert / reconnect / connected-shape move). Guarded on the
		// extensions bundle being present (eagerly loaded before this init in the
		// editor); a no-op in viewers where it isn't loaded.
		if (typeof LibavoidRouting !== 'undefined' && LibavoidRouting.installAutoRouting != null)
		{
			LibavoidRouting.installAutoRouting(this);
		}

		// Persist the global current edge style (the toolbar dropdown's choice for new
		// edges when nothing is selected) across sessions. styleChanged fires with
		// force=true only for no-selection picks and "Set as Default Style"
		// (edgeStyleChange with edges.length==0 / setDefaultStyle) — i.e. genuine
		// current-style changes, not per-cell edits or programmatic resets. Restored in
		// updateDefaultStyles; cleared by the "Clear Default Style" action.
		this.addListener('styleChanged', mxUtils.bind(this, function(sender, evt)
		{
			if (evt.getProperty('force') && typeof mxSettings !== 'undefined' &&
				mxSettings.setCurrentEdgeStyle != null && mxSettings.settings != null)
			{
				mxSettings.setCurrentEdgeStyle(mxUtils.clone(this.editor.graph.currentEdgeStyle));
			}
		}));

		// updateDefaultStyles (which restores the persisted edge style) only runs on
		// theme/sketch changes, not on a plain load — so restore here too, on init,
		// after settings are loaded and the graph exists.
		this.restorePersistedEdgeStyle();

		// Auto-play any attached animation script when viewing read-only
		// (chromeless / lightbox / embed mode). Previously this required
		// loading plugins/animation.js via ?p=anim — now it works on any
		// diagram that has an animation script attached.
		//
		// Opt-out via ?animate=0 in the URL — useful for sharing an animated
		// diagram statically (e.g. as a snapshot for review) without it
		// auto-starting on every visitor.
		//
		// Loop behavior comes from the animation data itself (defaults to
		// true — the legacy chromeless animation plugin always looped). Users
		// can opt out via the Loop checkbox in the AnimationDialog.
		if (this.editor.isChromelessView() && urlParams['animate'] != '0')
		{
			// Track the root the player was last started for. Multiple
			// `mxEvent.ROOT` events fire during file loading (initial
			// empty root → file root, plus spurious fires from
			// `mxGraph.processChange`), and `fileLoaded` fires too —
			// each one would otherwise stop+restart the player. If the
			// pending player is stopped mid-fade, `graph.executingCustomActions`
			// stays `true` (because the fade's `setTimeout` hasn't run
			// the reset-on-completion branch yet); the next player's
			// `executeCustomActions` call then hits the
			// "already-executing" abort branch and silently fails. End
			// result: animation never gets past step 0.
			//
			// Comparing roots gives us a stable identity for "did the
			// page actually change?" — initial null → file root counts
			// as a change, but redundant ROOT/fileLoaded for the same
			// root do not.
			var lastAnimRoot = null;

			var startAnimation = function()
			{
				var root = graph.getModel().getRoot();

				// Same root + we already have a player → no-op. The
				// existing playback continues unmolested.
				if (root === lastAnimRoot &&
					ui.chromelessAnimationPlayer != null)
				{
					return true;
				}

				lastAnimRoot = root;

				if (ui.chromelessAnimationPlayer != null)
				{
					ui.chromelessAnimationPlayer.stop();
				}

				ui.chromelessAnimationPlayer = Editor.playAnimationOnGraph(graph);

				return ui.chromelessAnimationPlayer != null;
			};

			startAnimation();
			this.editor.addListener('fileLoaded', startAnimation);
			// Multi-page diagrams: restart on page switch so each page's
			// animation runs when navigated to in the lightbox.
			graph.addListener(mxEvent.ROOT, startAnimation);
		}

		var graphIsEnabled = graph.isEnabled;

		graph.isEnabled = function()
		{
			return graphIsEnabled.apply(this, arguments) && !ui.isLocked();
		};

		// Shows link icons in main graph
		graph.showLinkIcons = Editor.showLinkIcons || urlParams['link-icons'] == '1';
		graph.showTooltipIcons = Editor.showTooltipIcons || urlParams['tooltip-icons'] == '1';

		// Opens the edit tooltip dialog for the given cell
		var editorUi = this;

		graph.editTooltip = function(cell)
		{
			if (cell != null)
			{
				editorUi.actions.get('editTooltip').funct();
			}
		};

		// Resolves page links to page names for link overlay tooltips.
		// Custom-action links (`data:action/json,…`) route through
		// `getLinkTitle`, which delegates to `EditorUi.getCustomLinkTitle`
		// so the overlay tooltip matches what the Edit Link dialog and
		// the link hint display (user `title`, "Effects (N)", or the
		// localized label of the first action key).
		graph.getLinkOverlayTooltip = function(link)
		{
			if (Graph.isPageLink(link) && editorUi.pages != null)
			{
				var id = link.substring(link.indexOf(',') + 1);
				var page = editorUi.getPageById(id);

				if (page != null)
				{
					return page.getName() || mxResources.get('pageWithNumber',
						[mxUtils.indexOf(editorUi.pages, page) + 1]);
				}
			}
			else if (this.isCustomLink(link))
			{
				return this.getLinkTitle(link);
			}

			return link;
		};

		// Stops panning while freehand is active
		if (Graph.touchStyle)
		{
			graph.panningHandler.isPanningTrigger = function(me)
			{
				var evt = me.getEvent();
				
			 	return (me.getState() == null && (!mxEvent.isMouseEvent(evt) &&
					!graph.freehand.isDrawing())) ||
			 		(mxEvent.isPopupTrigger(evt) && (me.getState() == null ||
			 		mxEvent.isControlDown(evt) || mxEvent.isShiftDown(evt)));
			};
		}
		
		// Shows a source-edit textarea dialog whose close paths (Cancel,
		// Escape, close icon) ask for confirmation when unapplied edits
		// would be lost, and whose modal background never closes it.
		var showGuardedTextareaDialog = function(dlg)
		{
			var discarded = false;

			ui.showDialog(dlg.container, 640, 420, true, true,
				function(cancel, isEsc)
				{
					if (!discarded && dlg.shouldConfirmClose())
					{
						ui.confirm(mxResources.get('allChangesLost'), null,
							function()
							{
								discarded = true;
								ui.hideDialog(true);
							}, mxResources.get('cancel'),
							mxResources.get('discardChanges'));

						// vetoes this close; the confirmation above decides
						return false;
					}
				}, null, null, new mxRectangle(0, 0, 320, 280), true);
			dlg.init();
		};

		// Starts editing PlantUML data. Re-parses via the native converter
		// only — the server-rendered outputs are gone. Legacy server-rendered
		// cells (payloads with a `format`: png/svg images or txt <pre> text)
		// are migrated to the chosen native representation on the fly.
		graph.cellEditor.editPlantUmlData = function(cell, trigger, data)
		{
			var obj = JSON.parse(data);
			var style = graph.getCurrentCellStyle(cell);
			var isImage = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, '') ==
				mxConstants.SHAPE_IMAGE;

			// Native editable group wrapper (no `format`, not an image): its
			// children can be replaced in place, preserving user style and
			// label customizations via the plantUml* identity stamps
			// (see replaceLockedGroupChildren).
			var isGroup = obj.format == null && !isImage;

			// Diagram (editable group) vs Image (static SVG) output dropdown,
			// mirroring the Insert > PlantUML dialog and letting the user switch
			// an existing cell between the two on re-edit. Hidden for embedded
			// services (only the default diagram output is offered there), like
			// ParseDialog. The select is always constructed so the apply handler
			// can read its value; it is only added to the dialog when shown.
			var showTypeSelect = ui.getServiceName() == 'draw.io' ||
				ui.getServiceName() == 'atlassian';
			var typeSelect = document.createElement('select');
			typeSelect.className = 'geBtn';

			var diagramOption = document.createElement('option');
			diagramOption.setAttribute('value', 'plantUmlDiagram');
			mxUtils.write(diagramOption, mxResources.get('diagram'));
			typeSelect.appendChild(diagramOption);

			var imageOption = document.createElement('option');
			imageOption.setAttribute('value', 'plantUmlImage');
			mxUtils.write(imageOption, mxResources.get('image'));
			typeSelect.appendChild(imageOption);

			typeSelect.value = isImage ? 'plantUmlImage' : 'plantUmlDiagram';

	    	var dlg = new SimpleTextareaDialog(ui, obj.data, function(text)
			{
	    		if (text == null)
				{
	    			return;
				}

	    		if (!ui.spinner.spin(document.body, mxResources.get('inserting')))
	    		{
	    			return;
				}

	    		var onError = function(e)
	    		{
	    			// Keeps the dialog open on parse failure (e.g. a syntax
	    			// error) so the input isn't lost, like ParseDialog
	    			ui.spinner.stop();
	    			ui.handleError(e);
	    		};

	    		var asImage = typeSelect.value == 'plantUmlImage';

	    		// Only a native group carries a converter config; images and
	    		// legacy server-rendered cells parse with null, like the
	    		// insert paths
	    		var config = isGroup ? obj.config : null;

	    		ui.parsePlantUmlDiagram(text, config, function(xml)
	    		{
	    			ui.spinner.stop();

	    			// Parsing succeeded: close the dialog (applyKeepsOpen
	    			// left it open during the async parse) and apply
	    			dlg.hide();

	    			try
	    			{
	    				graph.getModel().beginUpdate();
	    				try
	    				{
	    					if (isImage && asImage)
	    					{
	    						// Keep image cells as images: re-render the SVG and
	    						// update the cell in place. Legacy server-rendered
	    						// images lose their `format` here (migrated to the
	    						// client-rendered representation). The configurable
	    						// plantUmlData border is preserved.
	    						ui.updateMermaidImage(cell, text, null, xml,
	    							obj.border, 'plantUmlData');
	    					}
	    					else if (isGroup && !asImage)
	    					{
	    						ui.replaceLockedGroupChildren(cell, xml, text, config,
	    						{
	    							wrapGroup: mxPlantUmlToDrawio.wrapGroup,
	    							dataAttr: 'plantUmlData',
	    							attrPrefix: 'plantUml'
	    						});
	    					}
	    					else
	    					{
	    						// Output type changed (or a legacy <pre> text cell is
	    						// migrated): swap the cell for the chosen
	    						// representation, keeping its position
	    						ui.replaceMermaidCell(cell, asImage ?
	    							ui.createMermaidImageXml(text, null, xml, null,
	    								obj.border, 'plantUmlData') :
	    							mxPlantUmlToDrawio.wrapGroup(xml, text, config));
	    					}
	    				}
	    				finally
	    				{
	    					graph.getModel().endUpdate();
	    				}
	    			}
	    			catch (e)
	    			{
	    				ui.handleError(e);
	    			}
	    		}, onError);
			}, null, null, showTypeSelect ? typeSelect : null, true);
			showGuardedTextareaDialog(dlg);
		};
		
		// Starts editing Mermaid data. Re-parses via the native parser and
		// replaces the cell's children with the result. Legacy shape=image
		// mermaid cells are migrated to the editable group wrapper on the fly.
		graph.cellEditor.editMermaidData = function(cell, trigger, data)
		{
			var obj = JSON.parse(data);
			var style = graph.getCurrentCellStyle(cell);
			var isImage = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, '') ==
				mxConstants.SHAPE_IMAGE;

			// Diagram (editable group) vs Image (static SVG) output dropdown,
			// mirroring the Insert > Mermaid dialog and letting the user switch
			// an existing cell between the two on re-edit. Hidden for embedded
			// services (only the default diagram output is offered there), like
			// ParseDialog. The select is always constructed so the apply handler
			// can read its value; it is only added to the dialog when shown.
			var showTypeSelect = ui.getServiceName() == 'draw.io' ||
				ui.getServiceName() == 'atlassian';
			var typeSelect = document.createElement('select');
			typeSelect.className = 'geBtn';

			var diagramOption = document.createElement('option');
			diagramOption.setAttribute('value', 'mermaid');
			mxUtils.write(diagramOption, mxResources.get('diagram'));
			typeSelect.appendChild(diagramOption);

			var imageOption = document.createElement('option');
			imageOption.setAttribute('value', 'mermaidImage');
			mxUtils.write(imageOption, mxResources.get('image'));
			typeSelect.appendChild(imageOption);

			typeSelect.value = isImage ? 'mermaidImage' : 'mermaid';

	    	var dlg = new SimpleTextareaDialog(ui, obj.data, function(text)
			{
	    		if (text == null)
				{
	    			return;
				}

	    		if (!ui.spinner.spin(document.body, mxResources.get('inserting')))
	    		{
	    			return;
				}

	    		var onError = function(e)
	    		{
	    			// Keeps the dialog open on parse failure (e.g. a syntax
	    			// error) so the input isn't lost, like ParseDialog
	    			ui.spinner.stop();
	    			ui.handleError(e);
	    		};

	    		var asImage = typeSelect.value == 'mermaidImage';

	    		// The parse config depends on the TARGET type, not the source:
	    		// images re-parse with EditorUi.legacyMermaidConfig (so they match
	    		// the previous default look), the editable diagram uses the
	    		// diagram's stored config (null for a cell that was an image). The
	    		// config is cloned per parse call so getMermaidConfig's in-place
	    		// edits (securityLevel, startOnLoad, ...) never mutate the shared
	    		// template or get saved.
	    		var config = asImage ? EditorUi.legacyMermaidConfig :
	    			(isImage ? null : obj.config);

	    		ui.parseMermaidDiagram(text, mxUtils.clone(config), function(xml)
	    		{
	    			ui.spinner.stop();

	    			// Parsing succeeded: close the dialog (applyKeepsOpen
	    			// left it open during the async parse) and apply
	    			dlg.hide();

	    			try
	    			{
	    				graph.getModel().beginUpdate();
	    				try
	    				{
	    					if (isImage && asImage)
	    					{
	    						// Keep image cells as images: re-render the SVG and
	    						// update the cell in place. Stored config stays null
	    						// (legacy image-cell format); see parseMermaidImage.
	    						// The configurable mermaidData border is preserved.
	    						ui.updateMermaidImage(cell, text, null, xml, obj.border);
	    					}
	    					else if (!isImage && !asImage)
	    					{
	    						ui.replaceLockedGroupChildren(cell, xml, text, config);
	    					}
	    					else
	    					{
	    						// Output type changed: swap the cell for the other
	    						// representation, keeping its position. The image
	    						// carries the mermaidData border (default for a cell
	    						// that was a diagram); the diagram uses a null config.
	    						ui.replaceMermaidCell(cell, asImage ?
	    							ui.createMermaidImageXml(text, null, xml, null, obj.border) :
	    							mxMermaidToDrawio.wrapGroup(xml, text, config));
	    					}
	    				}
	    				finally
	    				{
	    					graph.getModel().endUpdate();
	    				}
	    			}
	    			catch (e)
	    			{
	    				ui.handleError(e);
	    			}
	    		}, onError);
			}, null, null, showTypeSelect ? typeSelect : null, true);
			showGuardedTextareaDialog(dlg);
		};
		
		// Overrides function to add editing for Plant UML.
		var cellEditorStartEditing = graph.cellEditor.startEditing;
		graph.cellEditor.startEditing = function(cell, trigger, initialText)
		{
			try
			{
				// When the enclosing group is actively locked, double-click
				// on any item in the group (or the group itself) edits the
				// group. Unlocked groups let children be edited individually.
				var lockedAncestor = this.graph.getLockedGroupAncestor(cell);

				if (lockedAncestor != null)
				{
					cell = lockedAncestor;
				}

				var data = this.graph.getAttributeForCell(cell, 'plantUmlData');

				if (data != null)
				{
					this.editPlantUmlData(cell, trigger, data);
				}
				else
				{
					data = this.graph.getAttributeForCell(cell, 'mermaidData');

					if (data != null && EditorUi.isMermaidSupported())
					{
						this.editMermaidData(cell, trigger, data);
					}
					else
					{
						var style = graph.getCellStyle(cell);

						if (mxUtils.getValue(style, 'metaEdit', '0') == '1')
						{
							ui.showDataDialog(cell);
						}
						else
						{
							cellEditorStartEditing.call(this, cell, trigger, initialText);
						}
					}
				}
			}
			catch (e)
			{
				ui.handleError(e);
			}
		};

		// Redirects custom link title via UI for page links
		graph.getLinkTitle = function(href)
		{
			return ui.getLinkTitle(href);
		};
		
		// Redirects custom link via UI for page link handling
		graph.customLinkClicked = function(link, associatedCell)
		{
			var done = false;

			try
			{
				// `view.graphBounds` (raw, unscaled) is the only honest
				// "did the diagram itself change?" signal — the public
				// `getGraphBounds()` override multiplies by
				// `currentScale` in useCssTransforms mode, so a viewbox
				// action that only changes scale would look like an
				// edit and trigger the chromelessResize fallback,
				// which would then undo the viewbox. Snapshot the raw
				// bounds and compare those.
				var rawBefore = this.view.graphBounds;
				var snapshot = (rawBefore != null) ? new mxRectangle(
					rawBefore.x, rawBefore.y,
					rawBefore.width, rawBefore.height) : null;

				ui.handleCustomLink(link, associatedCell);
				done = true;

				var rawAfter = this.view.graphBounds;

				if (ui.chromelessResize && snapshot != null &&
					rawAfter != null && !snapshot.equals(rawAfter))
				{
					ui.chromelessResize();
					this.scrollCellToVisible(associatedCell);
				}
			}
			catch (e)
			{
				ui.handleError(e);
			}

			return done;
		};

		// Parses background page references
		var graphParseBackgroundImage = graph.parseBackgroundImage;
		
		graph.parseBackgroundImage = function(json)
		{
			var result = graphParseBackgroundImage.apply(this, arguments);

			if (result != null && result.src != null && Graph.isPageLink(result.src))
			{
				result = {originalSrc: result.src};
			}

			return result;
		};

		// Updates background page SVG
		var graphSetBackgroundImage = graph.setBackgroundImage;
		
		graph.setBackgroundImage = function(img)
		{
			if (img != null && img.originalSrc != null)
			{
				img = ui.createImageForPageLink(img.originalSrc, ui.currentPage, this);
			}

			graphSetBackgroundImage.apply(this, arguments);
		};

		// Updates background to update placeholders for page title
		this.editor.addListener('pageRenamed', mxUtils.bind(this, function()
		{
			graph.refreshBackgroundImage();
		}));

		// Updates background to update placeholders for page number
		this.editor.addListener('pageMoved', mxUtils.bind(this, function()
		{
			graph.refreshBackgroundImage();
		}));

		// Updates background image after remote changes to the referenced page
		this.editor.addListener('pagesPatched', mxUtils.bind(this, function(sender, evt)
		{
			var ref = (graph.backgroundImage != null) ? graph.backgroundImage.originalSrc : null;

			if (ref != null)
			{
				var comma = ref.indexOf(',');
				
				if (comma > 0)
				{
					var id = ref.substring(comma + 1);
					var patches = evt.getProperty('patches');
					
					for (var i = 0; i < patches.length; i++)
					{
						if ((patches[i][EditorUi.DIFF_UPDATE] != null &&
							patches[i][EditorUi.DIFF_UPDATE][id] != null) ||
							(patches[i][EditorUi.DIFF_REMOVE] != null &&
							mxUtils.indexOf(patches[i][EditorUi.DIFF_REMOVE], id) >= 0))
						{
							graph.refreshBackgroundImage();

							break;
						}
					}
				}
			}
		}));

		// Restores background page reference in output data or
		// replaces dark mode page image with normal mode image
		var graphGetBackgroundImageObject = graph.getBackgroundImageObject;
		
		graph.getBackgroundImageObject = function(obj, resolveReferences, sourcePage)
		{
			var result = graphGetBackgroundImageObject.apply(this, arguments);

			if (result != null && result.originalSrc != null)
			{
				if (!resolveReferences)
				{
					result = {src: result.originalSrc};
				}
				else
				{
					result = ui.createImageForPageLink(result.originalSrc,
						sourcePage, null, true);
				}
			}

			return result;
		};
		
		// Sets help link for placeholders
		if (!this.isOffline() && typeof window.EditDataDialog !== 'undefined')
		{
			EditDataDialog.placeholderHelpLink = 'https://www.drawio.com/doc/faq/predefined-placeholders';
		}
		
		if (/viewer\.diagrams\.net$/.test(window.location.hostname) ||
			/embed\.diagrams\.net$/.test(window.location.hostname))
		{
			this.editor.editBlankUrl = 'https://app.diagrams.net/';
		}
		
		// Passes dev and test mode to new window
		var editorGetEditBlankUrl = ui.editor.getEditBlankUrl;
		
		this.editor.getEditBlankUrl = function(params)
		{
			params = (params != null) ? params : '';

			if (urlParams['dev'] == '1')
			{
				params += ((params.length > 0) ? '&' : '?') + 'dev=1';
			}

			if (urlParams['test'] == '1')
			{
				params += ((params.length > 0) ? '&' : '?') + 'test=1';
			}
			
			return editorGetEditBlankUrl.apply(this, arguments);
		};

		// For chromeless mode and lightbox mode in viewer
		// Must be overridden before supercall to be applied
		// in case of chromeless initialization
		var graphAddClickHandler = graph.addClickHandler;

		graph.addClickHandler = function(highlight, beforeClick, onClick)
		{
			var tmp = beforeClick;

			beforeClick = function(evt, href, cell)
			{
				if (href == null)
				{
					var source = mxEvent.getSource(evt);
				
					if (source.nodeName.toLowerCase() == 'a')
					{
						href = source.getAttribute('href');
					}
				}
				
				if (href != null && graph.isCustomLink(href) &&
					(mxEvent.isTouchEvent(evt) ||
					!mxEvent.isPopupTrigger(evt)) &&
					graph.customLinkClicked(href, cell))
				{
					mxEvent.consume(evt);
				}
				
				if (tmp != null)
				{
					tmp(evt, href, cell);
				}
			};
			
			// For some reason, local argument override is not enough in this case...
			graphAddClickHandler.call(this, highlight, beforeClick, onClick);
		};

		editorUiInit.apply(this, arguments);

		// Deferred browser translation: only initialise the mirror
		// on the main editor graph, and only once the browser has
		// actually started translating the page.
		if (Graph.browserTranslate)
		{
			graph.waitForBrowserTranslate();
		}

		this.editor.graph.addSvgShadow(graph.view.canvas.ownerSVGElement, null, true);
		
		if (this.menus != null)
		{
			var menusAddPopupMenuItems = Menus.prototype.addPopupMenuItems;

			// Inserts zoomIn/zoomOut into popup menu
			this.menus.addPopupMenuItems = function(menu, cell, evt)
			{
				if (graph.isSelectionEmpty() && Editor.currentTheme == 'simple')
				{
					this.addMenuItems(menu, ['zoomIn', 'zoomOut', '-'], null, evt);
				}

				// In passiveScroll mode, store right-click point for insert actions
				// and add the insert submenu to the background context menu
				if (Editor.passiveScroll && evt != null)
				{
					var pt = mxUtils.convertPoint(graph.container,
						mxEvent.getClientX(evt), mxEvent.getClientY(evt));
					graph._contextMenuPoint = new mxPoint(
						graph.snap(pt.x / graph.view.scale - graph.view.translate.x),
						graph.snap(pt.y / graph.view.scale - graph.view.translate.y));
					graph._contextMenuScreenPoint = mxUtils.convertPoint(graph.container,
						mxEvent.getClientX(evt), mxEvent.getClientY(evt));
				}

				if (graph.isSelectionEmpty() && Editor.passiveScroll)
				{
					this.addSubmenu('insert', menu, null);
					menu.addSeparator();
				}

				menusAddPopupMenuItems.apply(this, arguments);

				// Shows add to scratchpad option (hidden in passiveScroll mode)
				if (!graph.isSelectionEmpty() &&
					ui.addSelectionToScratchpad != null &&
					!Editor.passiveScroll)
				{
					this.addMenuItems(menu, ['-', 'addToScratchpad'], null, evt);
				}

				if (graph.isSelectionEmpty() && !this.isShowStyleItems())
				{
					this.addMenuItems(menu, ['-', 'exitGroup', 'home'], null, evt);
				}
			};

			var menusAddPopupMenuEditItems = Menus.prototype.addPopupMenuEditItems;
			
			// Inserts copyAsImage into popup menu
			this.menus.addPopupMenuEditItems = function(menu, cell, evt)
			{
				if (ui.editor.graph.isSelectionEmpty())
				{
					menusAddPopupMenuEditItems.apply(this, arguments);
					ui.menus.addMenuItems(menu, ['copyAsImage', 'copyAsSvg'], null, evt);
				}
				else
				{
					if (this.isShowCellEditItems())
					{
						this.addPopupDeleteItem(menu, cell, evt);
					}
					else
					{
						this.addPopupMenuArrangeItems(menu, cell, evt);
					}
			
					this.addMenuItems(menu, ['-', 'cut', 'copy', 'copyAsImage',
						'copyAsSvg', 'duplicate'], null, evt);

					if (Editor.passiveScroll)
					{
						if (graph.getSelectionCount() == 1)
						{
							this.addMenuItems(menu, ['-', 'copyStyle', 'pasteStyle',
								'copyTextStyle', 'pasteTextStyle'], null, evt);
						}
						else
						{
							this.addMenuItems(menu, ['-', 'pasteStyle', 'pasteTextStyle'], null, evt);
						}
					}

					this.addMenuItems(menu, ['-'], null, evt);

					if (!this.isShowCellEditItems())
					{
						this.addPopupDeleteItem(menu, cell, evt);
					}

					this.addMenuItems(menu, ['lockUnlock', '-'], null, evt);

					if (!this.isShowStyleItems())
					{
						if (graph.getSelectionCount() == 1 && !graph.isCellLocked(cell) &&
							graph.isCellEditable(cell))
						{
							this.addSubmenu('editCell', menu, null, mxResources.get('edit'));
							menu.addSeparator();

							// Shows line submenu for edges
							if (graph.getModel().isEdge(cell))
							{
								this.addSubmenu('line', menu);

								var geo = graph.getModel().getGeometry(cell);

								if (geo != null && geo.points != null && geo.points.length > 0)
								{
									this.addMenuItems(menu, ['clearWaypoints'], null, evt);
								}
							}
						}

						if (graph.getSelectionCount() == 1)
						{
							this.addMenuItems(menu, ['enterGroup'], null, evt);
						}

						// Shows table cell options
						var ss = ui.getSelectionState();

						if (ss.mergeCell != null)
						{
							this.addMenuItem(menu, 'mergeCells');
						}
						else if (ss.style['colspan'] > 1 || ss.style['rowspan'] > 1)
						{
							this.addMenuItem(menu, 'unmergeCells');
						}
					}
				}
			};

			this.menus.isShowStyleItems = function()
			{
				return 	Editor.currentTheme != 'simple' &&
					Editor.currentTheme != 'sketch' &&
					Editor.currentTheme != 'min';
			};

			this.menus.isShowHistoryItems = function()
			{
				return 	Editor.currentTheme != 'simple';
			};
			
			this.menus.isShowArrangeItems = this.menus.isShowStyleItems;
			this.menus.isShowCellEditItems = this.menus.isShowStyleItems;
		}

		// In passiveScroll mode, override insert point to use context menu location.
		// Insert actions pass pt=null when there's no mouse insert point, which
		// falls through to getCenterInsertPoint. We override that to return
		// the stored context menu point instead.
		if (Editor.passiveScroll)
		{
			var graphGetCenterInsertPoint = graph.getCenterInsertPoint;

			graph.getCenterInsertPoint = function(bbox)
			{
				if (this._contextMenuPoint != null)
				{
					var pt = this._contextMenuPoint;
					bbox = (bbox != null) ? bbox : new mxRectangle();

					return new mxPoint(
						graph.snap(pt.x - (bbox.width || 0) / 2),
						graph.snap(pt.y - (bbox.height || 0) / 2));
				}

				return graphGetCenterInsertPoint.apply(this, arguments);
			};

			// Clear the stored point after the popup menu is hidden.
			// Deferred so the action triggered by the menu item can read
			// the point before it is cleared.
			var popupHideMenu = graph.popupMenuHandler.hideMenu;

			graph.popupMenuHandler.hideMenu = function()
			{
				popupHideMenu.apply(this, arguments);

				window.setTimeout(function()
				{
					graph._contextMenuPoint = null;
					graph._contextMenuScreenPoint = null;
				}, 0);
			};
		}

		// Specifies the default filename
		this.dependsOnLanguage(mxUtils.bind(this, function()
		{
			this.defaultFilename = mxResources.get('untitledDiagram');
			this.defaultLibraryName = mxResources.get('untitledLibrary');
		}));

		// Adds export for %page%, %pagenumber% and %pagecount% placeholders
		var graphGetExportVariables = graph.getExportVariables;
		
		graph.getExportVariables = function()
		{
			var vars = graphGetExportVariables.apply(this, arguments);
			var file = ui.getCurrentFile();

			if (file != null)
			{
				vars['filename'] = file.getTitle();
			}

			ui.updateFileVars();

			if (ui.fileVars != null)
			{
				for (var key in ui.fileVars)
				{
					if (vars[key] == null)
					{
						vars[key] = ui.fileVars[key];
					}
				}
			}

			vars['pagecount'] = (ui.pages != null) ? ui.pages.length : 1;
			vars['page'] = (ui.currentPage != null) ? ui.currentPage.getName() : '';
			vars['pagenumber'] = (ui.pages != null && ui.currentPage != null) ?
				mxUtils.indexOf(ui.pages, ui.currentPage) + 1 : 1;

			return vars;
		};

		// Adds %page%, %pagenumber% and %pagecount% placeholders
		var graphGetGlobalVariable = graph.getGlobalVariable;
		
		graph.getGlobalVariable = function(name)
		{
			var file = ui.getCurrentFile();
			
			if (name == 'filename' && file != null)
			{
				return file.getTitle();
			}
			else if (name == 'page' && ui.currentPage != null)
			{
				return ui.currentPage.getName();
			}
			else if (name == 'pagenumber')
			{
				if (ui.currentPage != null && ui.pages != null)
				{
					return mxUtils.indexOf(ui.pages, ui.currentPage) + 1;
				}
				else
				{
					return 1;
				}
			}
			else if (name == 'pagecount')
			{
				return (ui.pages != null) ? ui.pages.length : 1;
			}
			
			var val = graphGetGlobalVariable.apply(this, arguments);

			if (val == null)
			{
				ui.updateFileVars();

				if (ui.fileVars != null)
				{
					val = ui.fileVars[name];
				}
			}

			return val;
		};

		// Forces update of filename placeholder
		var lastFilename = null;
		var lastFile = null;

		this.addListener('fileDescriptorChanged', mxUtils.bind(this, function()
		{
			var file = this.getCurrentFile();
			var filename = (file != null && file.getTitle() != null) ?
				file.getTitle() : this.defaultFilename;
			
			if (lastFilename != filename && file == lastFile)
			{
				graph.invalidateDescendantsWithPlaceholders(
					graph.model.getRoot());
				graph.view.validate();
			}

			lastFilename = filename;
			lastFile = file;
		}));

		var graphLabelLinkClicked = graph.labelLinkClicked;
		
		graph.labelLinkClicked = function(state, elt, evt)
		{
			var href = elt.getAttribute('href');
			
			if (href != null && graph.isCustomLink(href) &&
				(mxEvent.isTouchEvent(evt) ||
				!mxEvent.isPopupTrigger(evt)))
			{
				// Active links are moved to the hint
				if (!graph.isEnabled() || (state != null && graph.isCellLocked(state.cell)))
				{
					graph.customLinkClicked(href);
					
					// Resets rubberband after click on locked cell
					graph.getRubberband().reset();
				}
				
				mxEvent.consume(evt);
			}
			else
			{
				graphLabelLinkClicked.apply(this, arguments);
			}
		};

		// Overrides editor filename
		this.editor.getOrCreateFilename = function()
		{
			var filename = ui.defaultFilename;
			var file = ui.getCurrentFile();
			
			if (file != null)
			{
				filename = (file.getTitle() != null) ? file.getTitle() : filename;
			}
			
			return filename;
		};

		// Disables print action for standalone apps on iOS
		// because there is no way to close the new window
		// LATER: Use iframe for print, disable preview
		var printAction = this.actions.get('print');
		printAction.setEnabled(!mxClient.IS_IOS || !navigator.standalone);
		printAction.visible = printAction.isEnabled();
		
		// Installs additional keyboard shortcuts for editor
		if (!this.editor.chromeless || this.editor.editable)
		{
			// Defines additional hotkeys
			this.keyHandler.bindAction(70, true, 'findReplace'); // Ctrl+F
			this.keyHandler.bindAction(77, true, 'editGeometry', true); // Ctrl+Shift+M
			this.keyHandler.bindAction(75, true, 'tags'); // Ctrl+K
			this.keyHandler.bindAction(65, false, 'insertText'); // A
			this.keyHandler.bindAction(83, false, 'insertNote'); // S
			this.keyHandler.bindAction(68, false, 'insertRectangle'); // D
			this.keyHandler.bindAction(70, false, 'insertEllipse'); // F
			this.keyHandler.bindAction(76, false, 'insertLink'); // L
			this.keyHandler.bindAction(82, false, 'insertRhombus'); // R
			this.keyHandler.bindAction(67, false, 'insertEdge'); // C
			this.keyHandler.bindAction(88, false, 'insertFreehand'); // X
			this.keyHandler.bindAction(75, true, 'toggleShapes', true); // Ctrl+Shift+K
			this.keyHandler.bindAction(54, true, 'adaptiveColors', true); // Ctrl+Shift+6
			this.altShiftActions[81] = 'copyStyle'; // Alt+Shift+Q
			this.altShiftActions[87] = 'pasteStyle'; // Alt+Shift+W
			this.altShiftActions[83] = 'synchronize'; // Alt+Shift+S
			
			if (urlParams['embedInline'] == '1')
			{
				document.body.classList.add('geEmbedInline');

				if (Editor.passiveScroll)
				{
					document.body.classList.add('geInlineNoUi');
				}

				if (!Editor.passiveScroll)
				{
					graph.addListener(mxEvent.ESCAPE, function(sender, evt)
					{
						if (evt != null && graph.isEnabled() && !graph.isEditing() &&
							evt.getProperty('event') != null)
						{
							ui.actions.get('exit').funct();
						}
					});
				}
			}

		    this.installImagePasteHandler();

			if (!this.useInternalClipboard)
			{
		    	this.installNativeClipboardHandler();
			}
		};

		// Creates the spinner
		this.spinner = (this.spinner != null) ? this.spinner :
			this.createSpinner(null, null, 24);
		
		// Installs drag and drop handler for rich text editor
		if (Graph.fileSupport)
		{
			graph.addListener(mxEvent.EDITING_STARTED, mxUtils.bind(this, function(evt)
			{
				// Setup the dnd listeners
				var textElt = graph.cellEditor.text2;
				var dropElt = null;
				
				if (textElt != null)
				{
					mxEvent.addListener(textElt, 'dragleave', function(evt)
					{
						if (dropElt != null)
					    {
					    	dropElt.parentNode.removeChild(dropElt);
					    	dropElt = null;
					    }
					    
						evt.stopPropagation();
						evt.preventDefault();
					});
					
					mxEvent.addListener(textElt, 'dragover', mxUtils.bind(this, function(evt)
					{
						if (dropElt == null)
						{
							dropElt = this.highlightElement(textElt);
						}
						
						evt.stopPropagation();
						evt.preventDefault();
					}));
					
					mxEvent.addListener(textElt, 'drop', mxUtils.bind(this, function(evt)
					{
					    if (dropElt != null)
					    {
					    	dropElt.parentNode.removeChild(dropElt);
					    	dropElt = null;
					    }

					    if (evt.dataTransfer.files.length > 0)
					    {
					    	this.importFiles(evt.dataTransfer.files, 0, 0, this.maxImageSize, function(data, mimeType, x, y, w, h)
					    	{
					    		// Inserts image into current text box
					    		graph.insertImage(data, w, h);
					    	}, function()
					    	{
					    		// No post processing
					    	}, function(file)
					    	{
					    		// Handles only images
					    		return file.type.substring(0, 6) == 'image/';
					    	}, function(queue)
					    	{
					    		// Invokes elements of queue in order
					    		for (var i = 0; i < queue.length; i++)
					    		{
					    			queue[i]();
					    		}
					    	}, mxEvent.isControlDown(evt));
			    		}
					    else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0)
					    {
					    	var uri = evt.dataTransfer.getData('text/uri-list');
					    	
					    	if ((/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(uri))
							{
				    			this.loadImage(decodeURIComponent(uri), mxUtils.bind(this, function(img)
				    			{
				    				var w = Math.max(1, img.width);
			    					var h = Math.max(1, img.height);
			    					var maxSize = this.maxImageSize;

				    				var s = Math.min(1, Math.min(maxSize / Math.max(1, w)), maxSize / Math.max(1, h));
				    				graph.insertImage(decodeURIComponent(uri), w * s, h * s);
				    			}));
							}
							else
							{
								document.execCommand('insertHTML', false, evt.dataTransfer.getData('text/plain'));
							}
					    }
					    else
					    {
					    	if (mxUtils.indexOf(evt.dataTransfer.types, 'text/html') >= 0)
						    {
					    		document.execCommand('insertHTML', false, evt.dataTransfer.getData('text/html'));
						    }
						    else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/plain') >= 0)
						    {
						    	document.execCommand('insertHTML', false, evt.dataTransfer.getData('text/plain'));
						    }
					    }
	
					    evt.stopPropagation();
					    evt.preventDefault();
					}));
				}
			}));
		}
		
		// Adding mxRuler to editor
		if (Editor.isSettingsEnabled())
		{
			var view = this.editor.graph.view;
			var unit = mxSettings.getUnit();
			view.setUnit(unit);
			Editor.pageSizeUnit = unit;

			view.addListener('unitChanged', function(sender, evt)
			{
				var unit = evt.getProperty('unit');
				mxSettings.setUnit(unit);
				mxSettings.save();
				Editor.pageSizeUnit = unit;
			});

			var showRuler = Editor.canvasSupported && document.documentMode != 9 &&
				(urlParams['ruler'] == '1' || mxSettings.isRulerOn()) &&
				(!this.editor.isChromelessView() || this.editor.editable);

			this.ruler = (showRuler) ? new mxDualRuler(this, view.unit) : null;
			this.refresh();
		}

		// Adds an element to edit the style in the footer in test mode
		if (urlParams['styledev'] == '1')
		{
			var footer = document.getElementById('geFooter');

			if (footer != null)
			{
				this.styleInput = document.createElement('input');
				this.styleInput.setAttribute('type', 'text');
				this.styleInput.style.position = 'absolute';
				this.styleInput.style.top = '14px';
				this.styleInput.style.left = '2px';
				// Workaround for ignore right CSS property in FF
				this.styleInput.style.width = '98%';
				this.styleInput.style.visibility = 'hidden';
				this.styleInput.style.opacity = '0.9';

				mxEvent.addListener(this.styleInput, 'change', mxUtils.bind(this, function()
				{
					this.editor.graph.getModel().setStyle(this.editor.graph.getSelectionCell(), this.styleInput.value);
				}));

				footer.appendChild(this.styleInput);

				this.editor.graph.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt)
				{
					if (this.editor.graph.getSelectionCount() > 0)
					{
						var cell = this.editor.graph.getSelectionCell();
						var style = this.editor.graph.getModel().getStyle(cell);

						this.styleInput.value = style || '';
						this.styleInput.style.visibility = 'visible';
					}
					else
					{
						this.styleInput.style.visibility = 'hidden';
					}
				}));
			}

			var isSelectionAllowed = this.isSelectionAllowed;
			this.isSelectionAllowed = function(evt)
			{
				if (mxEvent.getSource(evt) == this.styleInput)
				{
					return true;
				}

				return isSelectionAllowed.apply(this, arguments);
			};
		}

		// Removes info text in page
		var info = document.getElementById('geInfo');

		if (info != null)
		{
			info.parentNode.removeChild(info);
		}

		// Installs drag and drop handler for files
		// Enables dropping files
		if (Graph.fileSupport && (!this.editor.chromeless || this.editor.editable))
		{
			// Setup the dnd listeners
			var dropElt = null;

			mxEvent.addListener(graph.container, 'dragleave', function(evt)
			{
				if (graph.isEnabled())
				{
					if (dropElt != null)
				    {
				    	dropElt.parentNode.removeChild(dropElt);
				    	dropElt = null;
				    }
				    
					evt.stopPropagation();
					evt.preventDefault();
				}
			});
			
			mxEvent.addListener(graph.container, 'dragover', mxUtils.bind(this, function(evt)
			{
				if (dropElt == null)
				{
					dropElt = this.highlightElement(graph.container);
				}
				
				if (this.sidebar != null)
				{
					this.sidebar.hideTooltip();
				}

				evt.stopPropagation();
				evt.preventDefault();
			}));
			
			mxEvent.addListener(graph.container, 'drop', mxUtils.bind(this, function(evt)
			{
			    if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }
			    
				if (graph.isEnabled())
				{
				    var pt = mxUtils.convertPoint(graph.container, mxEvent.getClientX(evt), mxEvent.getClientY(evt));
					var files = evt.dataTransfer.files;
					var tr = graph.view.translate;
					var scale = graph.view.scale;
					var x = pt.x / scale - tr.x;
					var y = pt.y / scale - tr.y;
					
				    if (files.length > 0)
				    {
						var isBlankNoUndo = this.isBlankFile() && !this.canUndo();
						var isDiagramFile = files.length == 1 && (EditorUi.isVisioFilename(files[0].name) ||
							/(\.drawio)$/i.test(files[0].name) || /(\.xml)$/i.test(files[0].name));

						if (urlParams['embed'] != '1' && isBlankNoUndo &&
							(isDiagramFile || mxEvent.isShiftDown(evt)))
						{
							// Opens file in same window when dropped on unmodified file
							// Uses noDialogs to prevent fileLoaded(null) from
							// creating a new blank file asynchronously
							var file = this.getCurrentFile();

							if (file == null || !file.isModified())
							{
								this.fileLoaded(null, true);
							}

							// Marks file as changed after loading to trigger draft save
							this.openFiles(files, true, mxUtils.bind(this, function()
							{
								var file = this.getCurrentFile();

								if (file != null)
								{
									file.fileChanged();
								}
							}));
						}
						else
				    	{
							if (mxEvent.isAltDown(evt))
							{
								x = null;
								y = null;
							}

							this.importFiles(files, x, y, this.maxImageSize, null, null, null,
								null, mxEvent.isControlDown(evt), null, null,
								mxEvent.isShiftDown(evt), evt);
				    	}
		    		}
				    else
				    {
						if (mxEvent.isAltDown(evt))
						{
							x = 0;
							y = 0;
						}
						
				    	var uri = (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0) ?
				    		evt.dataTransfer.getData('text/uri-list') : null;
				    	var data = this.extractGraphModelFromEvent(evt, this.pages != null);
				    	
				    	if (data != null)
				    	{
				    		graph.setSelectionCells(this.importXml(data, x, y, true));
				    	}
				    	else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/html') >= 0)
					    {
				    		var html = evt.dataTransfer.getData('text/html');
				    		var div = document.createElement('div');
				    		div.innerHTML = Graph.sanitizeHtml(html);
				    		
				    		// The default is based on the extension
				    		var asImage = null;
				    		
				    		// Extracts single image
				    		var imgs = div.getElementsByTagName('img');

				    		if (imgs != null && imgs.length == 1)
				    		{
				    			html = imgs[0].getAttribute('src');
				    			
				    			if (html == null)
				    			{
				    				html = imgs[0].getAttribute('srcset');
				    			}
				    			
				    			// Handles special case where the src attribute has no valid extension
				    			// in which case the text would be inserted as text with a link
				    			if (!(/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(html))
				    			{
				    				asImage = true;
				    			}
				    		}
				    		else
				    		{
				    			// Extracts single link
				    			var a = div.getElementsByTagName('a');

				    			if (a != null && a.length == 1)
				    			{
				    				html = a[0].getAttribute('href');
				    			}
					    		else
					    		{
					    			// Extracts preformatted text
					    			var pre = div.getElementsByTagName('pre');
					    			
					    			if (pre != null && pre.length == 1)
					    			{
					    				html = mxUtils.getTextContent(pre[0]);
					    			}
					    		}
				    		}
				    		
				    		var resizeImages = true;
				    		
				    		var doInsert = mxUtils.bind(this, function()
				    		{
				    			graph.setSelectionCells(this.insertTextAt(html, x, y, true,
				    				asImage, null, resizeImages, mxEvent.isControlDown(evt)));
				    		});
				    		
				    		if (asImage && html != null && html.length > this.resampleThreshold)
				    		{
				    			this.confirmImageResize(function(doResize)
		    					{
		    						resizeImages = doResize;
		    						doInsert();
		    					}, mxEvent.isControlDown(evt));
				    		}
				    		else
			    			{
				    			doInsert();
			    			}
					    }
				    	else if (uri != null && (/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(uri))
						{
			    			this.loadImage(decodeURIComponent(uri), mxUtils.bind(this, function(img)
			    			{
			    				var w = Math.max(1, img.width);
		    					var h = Math.max(1, img.height);
		    					var maxSize = this.maxImageSize;

			    				var s = Math.min(1, Math.min(maxSize / Math.max(1, w)), maxSize / Math.max(1, h));

			    				graph.setSelectionCell(graph.insertVertex(null, null, '', x, y, w * s, h * s,
			    					'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;' +
			    					'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + uri + ';'));
			    			}), mxUtils.bind(this, function(img)
			    			{
			    				graph.setSelectionCells(this.insertTextAt(uri, x, y, true));
			    			}));
						}
					    else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/plain') >= 0)
					    {
					    	graph.setSelectionCells(this.insertTextAt(evt.dataTransfer.getData('text/plain'), x, y, true));
					    }
					}
				}

			    evt.stopPropagation();
			    evt.preventDefault();
			}), false);
		}

		this.initPages();

		// Embedded mode
		if (urlParams['embed'] == '1')
		{
			this.initializeEmbedMode();
		}
		
		this.addListener('currentThemeChanged', mxUtils.bind(this, function()
		{
			if (this.sidebar != null)
			{
				this.sidebar.updateEntries();
			}

			this.updateButtonContainer();
			this.updateDocumentTitle();
			this.refresh(true);
		}));

		this.addListener('realtimeStateChanged', mxUtils.bind(this, function()
		{
			this.updateButtonContainer(true);
		}));
		
		this.addListener('darkModeChanged', function()
		{
			if (mxClient.IS_SF)
			{
				// Workaround for ignored parent scheme for grid in Safari
				graph.view.validateBackground();
			}
		});
		
		graph.addListener('enabledChanged', mxUtils.bind(this, function()
		{
			if (!graph.isEnabled())
			{
				this.hideShapePicker();
			}

			this.refresh();
		}));

		// Overrides mxWindow.fit to allow for embedViewport
		var ui = this;

		mxWindow.prototype.fit = function()
		{
			if (!Editor.inlineFullscreen && ui.embedViewport != null)
			{
				var left = parseInt(this.div.offsetLeft);
				var width = parseInt(this.div.offsetWidth);
				var right = ui.embedViewport.x + ui.embedViewport.width;
				var top = parseInt(this.div.offsetTop);
				var height = parseInt(this.div.offsetHeight);
				var bottom = ui.embedViewport.y + ui.embedViewport.height;

				this.div.style.left = Math.max(ui.embedViewport.x, Math.min(left, right - width)) + 'px';
				this.div.style.top = Math.max(ui.embedViewport.y, Math.min(top, bottom - height)) + 'px';
				this.div.style.height = Math.min(ui.embedViewport.height, parseInt(this.div.style.height)) + 'px';
				this.div.style.width = Math.min(ui.embedViewport.width, parseInt(this.div.style.width)) + 'px';
			}
			else
			{
				mxUtils.fit(this.div);
			}
		};

		// Hides current menu when windows are moved or resized
		var mxWindowSetLocation = mxWindow.prototype.setLocation;

		mxWindow.prototype.setLocation = function(x, y)
		{
			mxWindowSetLocation.call(this, x, y);
			ui.hideCurrentMenu();
		};

		var mxWindowSetSize = mxWindow.prototype.setSize;

		mxWindow.prototype.setSize = function(width, height)
		{
			mxWindowSetSize.call(this, width, height);
			ui.hideCurrentMenu();
		};
		
		if (!this.editor.chromeless || this.editor.editable)
		{
			var theme = Editor.currentTheme;
			
			// Activates scheme in UI
			if (theme == 'simple' || theme == 'sketch')
			{
				this.doSetCurrentTheme(theme, true);

				if (urlParams['embedInline'] == '1')
				{
					// Inline embed mode must be initialized after setting current theme
					this.initializeInlineEmbedMode();
				}
				else
				{
					// Initial state of format panel and sidebar
					var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

					if (iw < Editor.smallScreenWidth)
					{
						this.formatWidth = 0;
					}

					if (theme == 'simple' && iw < Editor.smallScreenWidth - 240)
					{
						this.hsplitPosition = 0;
					}

					if (theme == 'simple')
					{
						this.lastWindowWidth = iw;
					}
				}

				this.fireEvent(new mxEventObject('themeInitialized'));
			}

			// Restore windows that were visible in the previous session
			this.restoreVisibleWindows();

			// Initial state of format panel and sidebar for kennedy
			if (theme == 'kennedy')
			{
				var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

				if (iw < Editor.smallScreenWidth)
				{
					this.formatWidth = 0;
				}

				if (iw < Editor.smallScreenWidth - 240)
				{
					this.hsplitPosition = 0;
				}

				this.lastWindowWidth = iw;
			}
		}

		var darkMode = false;

		if (urlParams['dark'] != null)
		{
			darkMode = urlParams['dark'];
		}
		// Lightbox defaults to light mode for backwards compatibility
		else if (!this.editor.chromeless || this.editor.editable)
		{
			darkMode = Editor.currentTheme == 'dark';

			if (Editor.isSettingsEnabled() && urlParams['embed'] != '1' &&
				(!darkMode || mxSettings.settings.darkMode == 'auto'))
			{
				darkMode = mxSettings.settings.darkMode;
			}
		}
		
		if (darkMode == 'auto' && this.isAutoDarkModeSupported())
		{
			darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		this.setDarkMode(typeof darkMode === 'string' ? darkMode == '1' : darkMode);
		
		if (this.isAutoDarkModeSupported())
		{
			try
			{
				// Automatically updates theme when system setting changes
				window.matchMedia('(prefers-color-scheme: dark)')
					.addEventListener('change', mxUtils.bind(this, function (e)
					{
						if (this.isAutoDarkMode())
						{
							this.setDarkMode(e.matches);
						}
					}));
			}
			catch (e)
			{
				// Ignores object doesn't support addEventListener and disables auto dark mode
				this.actions.get('autoMode').setEnabled(false);
			}
		}

		if (urlParams['high-contrast'] == '1')
		{
			this.setHighContrast(true);
		}
		else if (Editor.isSettingsEnabled() && !this.editor.graph.isLightboxView() &&
			mxSettings.settings.highContrast != null)
		{
			this.setHighContrast(mxSettings.settings.highContrast);
		}
		else if (window.matchMedia != null &&
			window.matchMedia('(prefers-contrast: more)').matches)
		{
			this.setHighContrast(true);
		}

		if (Editor.isSettingsEnabled())
		{
			if (mxSettings.settings.pages != null)
			{
				this.setTabContainerVisible(mxSettings.settings.pages);
			}
			
			if (mxSettings.settings.compactMode != null &&
				this.isDefaultTheme(Editor.currentTheme))
			{
				this.setCompactMode(mxSettings.settings.compactMode);
			}
		}

		this.installSettings();

		// Animations
		this.addListener('enableAnimationsChanged', mxUtils.bind(this, function(sender, evt)
		{
			graph.enableFlowAnimation = Editor.enableAnimations;
			graph.refresh();
		}));

		graph.enableFlowAnimation = Editor.enableAnimations;
		
		if (screen.width <= Editor.smallScreenWidth)
		{
			this.formatWidth = 0;
		}
		
		if (urlParams['prefetchFonts'] == '1')
		{
			ui.editor.loadFonts();
		}

		if (Editor.currentTheme == 'atlas')
		{
			document.body.classList.add('geAtlas');
		}
	};

	/**
	 * Adapts the UI elements when the window size changes.
	 */
	var editorUiWindowResized = EditorUi.prototype.windowResized;

	EditorUi.prototype.windowResized = function()
	{
		if (Editor.currentTheme == 'simple' || Editor.currentTheme == 'kennedy')
		{
			var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var formatLimit = Editor.smallScreenWidth;

			if (this.lastWindowWidth != null && this.lastWindowWidth >= formatLimit && iw < formatLimit)
			{
				if (this.isFormatPanelVisible())
				{
					this.toggleFormatPanel(false);
				}
			}
			else if (this.lastWindowWidth != null && this.lastWindowWidth < formatLimit && iw >= formatLimit)
			{
				if (!this.isFormatPanelVisible())
				{
					this.toggleFormatPanel(true);
				}
			}

			var sidebarLimit = Editor.smallScreenWidth - 160;

			if (this.lastWindowWidth != null && this.lastWindowWidth >= sidebarLimit && iw < sidebarLimit)
			{
				if (this.isShapesPanelVisible())
				{
					this.toggleShapesPanel(false, true);

				}
			}
			else if (this.lastWindowWidth != null && this.lastWindowWidth < sidebarLimit && iw >= sidebarLimit)
			{
				if (!this.isShapesPanelVisible() && this.sidebarEnabled)
				{
					this.toggleShapesPanel(true, true);
				}
			}

			this.lastWindowWidth = iw;
		}

		editorUiWindowResized.apply(this, arguments);

		if (this.updateFullscreenState != null)
		{
			this.updateFullscreenState();
		}
	};

	/**
	 * Initializes embed inline mode.
	 */
	EditorUi.prototype.initializeInlineEmbedMode = function()
	{
		var footer = this.sketchFooterMenuElt;
		var toolbar = this.sketchMainMenuElt;
		var picker = this.sketchPickerMenuElt;
		var graph = this.editor.graph;
		picker.style.transform = '';

		mxEvent.addGestureListeners(this.diagramContainer.parentNode, mxUtils.bind(this, function(evt)
		{
			if (mxEvent.getSource(evt) == this.diagramContainer.parentNode)
			{
				this.embedExitPoint = new mxPoint(
					mxEvent.getClientX(evt),
					mxEvent.getClientY(evt));
				this.sendEmbeddedSvgExport();
			}
		}));

		document.body.style.cursor = 'text';

		var div = document.createElement('div');
		div.style.position = 'absolute';
		div.style.width = '10px';
		div.style.height = '10px';
		div.style.borderRadius = '5px';
		div.style.border = '1px solid gray';
		div.style.background = '#ffffff';
		div.style.cursor = 'row-resize';

		this.diagramContainer.parentNode.appendChild(div);
		this.bottomResizer = div;

		var x0 = null;
		var y0 = null;
		var w0 = null;
		var h0 = null;

		mxEvent.addGestureListeners(div, mxUtils.bind(this, function(evt)
		{
			h0 = parseInt(this.diagramContainer.style.height);
			y0 = mxEvent.getClientY(evt);
			graph.popupMenuHandler.hideMenu();
			mxEvent.consume(evt);
		}));

		div = div.cloneNode(false);
		div.style.cursor = 'col-resize';
		this.diagramContainer.parentNode.appendChild(div);
		this.rightResizer = div;

		mxEvent.addGestureListeners(div, mxUtils.bind(this, function(evt)
		{
			w0 = parseInt(this.diagramContainer.style.width);
			x0 = mxEvent.getClientX(evt);
			graph.popupMenuHandler.hideMenu();
			mxEvent.consume(evt);
		}));

		mxEvent.addGestureListeners(document.body, null, mxUtils.bind(this, function(evt)
		{
			var changed = false;

			if (x0 != null)
			{
				this.diagramContainer.style.width = Math.max(20,
					w0 + mxEvent.getClientX(evt) - x0) + 'px';
				changed = true;
			}

			if (y0 != null)
			{
				this.diagramContainer.style.height = Math.max(20,
					h0 + mxEvent.getClientY(evt) - y0) + 'px';
				changed = true;
			}

			if (changed)
			{
				var parent = this.embedMessageSource || window.opener || window.parent;
				parent.postMessage(JSON.stringify({
					event: 'resize',
					fullscreen: Editor.inlineFullscreen,
					rect: this.diagramContainer.getBoundingClientRect()
				}), '*');
				this.inlineSizeChanged();
				this.refresh();
			}
		}), function(evt)
		{
			if (x0 != null || y0 != null)
			{
				mxEvent.consume(evt);
			}

			x0 = null;
			y0 = null;
		});

		document.body.style.backgroundColor = 'transparent';
		this.diagramContainer.style.borderRadius = '4px';
		this.bottomResizer.style.visibility = 'hidden';
		this.rightResizer.style.visibility = 'hidden';
		this.sketchMenubarElt.style.display = 'none';
		toolbar.style.visibility = 'hidden';
		footer.style.visibility = 'hidden';
		picker.style.display = 'none';
		
		this.addListener('editInlineStart', mxUtils.bind(this, function(evt)
		{
			this.inlineSizeChanged();

			if (Editor.passiveScroll)
			{
				this.hideWindows();
			}
			else
			{
				this.fitWindows();
			}
		}));

		this.addListener('editInlineStop', mxUtils.bind(this, function(evt)
		{
			this.diagramContainer.style.width = '10px';
			this.diagramContainer.style.height = '10px';
			this.diagramContainer.style.border = '';
			this.bottomResizer.style.visibility = 'hidden';
			this.rightResizer.style.visibility = 'hidden';
			toolbar.style.visibility = 'hidden';
			footer.style.visibility = 'hidden';
			picker.style.display = 'none';
		}));

		// Overridden to avoid reset of scrollbars
		this.windowResized = mxUtils.bind(this, function()
	   	{
	   		// do nothing
	   	});

		this.inlineSizeChanged();
	};

	/**
	 * Installs the native clipboard support.
	 */
	EditorUi.prototype.installNativeClipboardHandler = function()
	{
		var graph = this.editor.graph;

		// Focused but invisible textarea during control or meta key events
		// LATER: Disable text rendering to avoid delay while keeping focus
		var textInput = document.createElement('div');
		textInput.setAttribute('autocomplete', 'off');
		textInput.setAttribute('autocorrect', 'off');
		textInput.setAttribute('autocapitalize', 'off');
		textInput.setAttribute('spellcheck', 'false');
		textInput.style.textRendering = 'optimizeSpeed';
		textInput.style.fontFamily = 'monospace';
		textInput.style.wordBreak = 'break-all';
		textInput.style.background = 'transparent';
		textInput.style.color = 'transparent';
		textInput.style.position = 'absolute';
		textInput.style.whiteSpace = 'nowrap';
		textInput.style.overflow = 'hidden';
		textInput.style.display = 'block';
		textInput.style.fontSize = '1';
		textInput.style.zIndex = '-1';
		textInput.style.resize = 'none';
		textInput.style.outline = 'none';
		textInput.style.width = '1px';
		textInput.style.height = '1px';
		mxUtils.setOpacity(textInput, 0);
		textInput.contentEditable = true;
		textInput.innerHTML = '&nbsp;';

		// Exposed so the typing shim can detect when Ctrl/Meta is held
		// and avoid stealing focus from this clipboard element.
		this.clipboardElt = textInput;

		var restoreFocus = false;
		
		// Disables built-in cut, copy and paste shortcuts
		this.keyHandler.bindControlKey(88, null);
		this.keyHandler.bindControlKey(67, null);
		this.keyHandler.bindControlKey(86, null);

		// Shows a textare when control/cmd is pressed to handle native clipboard actions
		mxEvent.addListener(document, 'keydown', mxUtils.bind(this, function(evt)
		{
			// No dialog visible
			var source = mxEvent.getSource(evt);
			
			if (graph.container != null && graph.isEnabled() && !graph.isMouseDown && !graph.isEditing() &&
				this.dialog == null && source.nodeName != 'INPUT' &&
				(source.nodeName != 'TEXTAREA' || source === this.typingShim) &&
				source.contentEditable != 'true')
			{
				if (evt.keyCode == 224 /* FF */ || (!mxClient.IS_MAC && evt.keyCode == 17 /* Control */) ||
					(mxClient.IS_MAC && (evt.keyCode == 91 || evt.keyCode == 93) /* Left/Right Meta */))
				{
					// Cannot use parentNode for check in IE
					if (!restoreFocus)
					{
						// Avoid autoscroll but allow handling of all pass-through ctrl shortcuts
						textInput.style.left = (graph.container.scrollLeft + 10) + 'px';
						textInput.style.top = (graph.container.scrollTop + 10) + 'px';
						var x0 = graph.container.scrollLeft;
						var y0 = graph.container.scrollTop;

						graph.container.appendChild(textInput);
						restoreFocus = true;
						
						textInput.focus();
						document.execCommand('selectAll', false, null);

						// Workaround for Safari 16 scroll after CMD key press
						graph.container.scrollLeft = x0;
						graph.container.scrollTop = y0;
					}
				}
			}
		}));

		// Clears input and restores focus and selection
		function clearInput()
		{
			window.setTimeout(function()
			{
				textInput.innerHTML = '&nbsp;';
				textInput.focus();

				// Range instead of execCommand('selectAll') - see showTypingShim: avoids
				// the selectstart that the body/root block cancels (which left no selection).
				try
				{
					var r = document.createRange();
					r.selectNodeContents(textInput);
					var s = window.getSelection();

					if (s != null)
					{
						s.removeAllRanges();
						s.addRange(r);
					}
				}
				catch (e)
				{
					// ignore
				}
			}, 0);
		};
		
		mxEvent.addListener(document, 'keyup', mxUtils.bind(this, function(evt)
		{
			// Workaround for asynchronous event read invalid in IE quirks mode
			var keyCode = evt.keyCode;
			
			// Asynchronous workaround for scroll to origin after paste if the
			// Ctrl-key is not pressed for long enough in FF on Windows
			window.setTimeout(mxUtils.bind(this, function()
			{
				if (restoreFocus && (keyCode == 224 /* FF */ || keyCode == 17 /* Control */ ||
					keyCode == 91 /* MetaLeft */ || keyCode == 93 /* MetaRight */))
				{
					restoreFocus = false;

					// Remove textInput first so the typing shim's
					// clipboardElt check sees it as no longer present
					// and can correctly focus the shim instead.
					textInput.parentNode.removeChild(textInput);

					if (!graph.isEditing() && this.dialog == null && graph.container != null)
					{
						graph.container.focus();
					}

					// Workaround for lost cursor in focused element
					if (this.dialog == null)
					{
						mxUtils.clearSelection();
					}
				}
			}), 0);
		}));
		
		mxEvent.addListener(textInput, 'copy', mxUtils.bind(this, function(evt)
		{
			if (graph.isEnabled())
			{
				try
				{
					mxClipboard.copy(graph);
					this.copyCells(textInput);
					clearInput();
				}
				catch (e)
				{
					this.handleError(e);
				}
			}
		}));
		
		mxEvent.addListener(textInput, 'cut', mxUtils.bind(this, function(evt)
		{
			if (graph.isEnabled())
			{
				try
				{
					mxClipboard.copy(graph);
					this.copyCells(textInput, true);
					clearInput();
				}
				catch (e)
				{
					this.handleError(e);
				}
			}
		}));
		
		mxEvent.addListener(textInput, 'paste', mxUtils.bind(this, function(evt)
		{
			if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
			{
				try
				{
					textInput.innerHTML = '&nbsp;';
					textInput.focus();
					
					if (evt.clipboardData != null)
					{
						Graph.removePasteFormatting(textInput.firstChild);
						this.pasteCells(evt, textInput, true, true);
					}

					if (!mxEvent.isConsumed(evt))
					{
						var x0 = graph.container.scrollLeft;
						var y0 = graph.container.scrollTop;

						window.setTimeout(mxUtils.bind(this, function()
						{
							try
							{
								// Workaround for Safari 16 scroll after paste
								graph.container.scrollLeft = x0;
								graph.container.scrollTop = y0;
								Graph.removePasteFormatting(textInput.firstChild);
								this.pasteCells(evt, textInput, false, true);
							}
							catch (e)
							{
								this.handleError(e);
							}
						}), 0);
					}
				}
				catch (e)
				{
					this.handleError(e);
				}
			}
		}), true);
		
		// Needed for IE11
		var isSelectionAllowed2 = this.isSelectionAllowed;
		this.isSelectionAllowed = function(evt)
		{
			if (mxEvent.getSource(evt) == textInput)
			{
				return true;
			}

			return isSelectionAllowed2.apply(this, arguments);
		};
	};

	/**
	 * Sets the current UI theme.
	 */
	EditorUi.prototype.setCurrentTheme = function(value, quiet)
	{
		mxSettings.setUi(value);
		quiet = this.doSetCurrentTheme(value) || quiet;

		if (!quiet)
		{
			this.alert(mxResources.get('restartForChangeRequired'));
		}
	};

	/**
	 * Changes the current UI theme.
	 */
	EditorUi.prototype.isDefaultTheme = function(theme)
	{
		return theme == '' || theme == 'dark' || theme == 'default' ||
			theme == 'kennedy' || theme == null;
	};
	
	/**
	 * Changes the current UI theme.
	 */
	EditorUi.prototype.doSetCurrentTheme = function(value, force)
	{
		if (value == null || value == '')
		{
			if (App.isSimpleThemePreferred())
			{
				value = 'simple';
			}
			else
			{
				value = 'kennedy';
			}
		}

		var noRestart = (Editor.currentTheme == 'simple' &&
				this.isDefaultTheme(value)) ||
			(this.isDefaultTheme(Editor.currentTheme) &&
				value == 'simple') ||
			value == Editor.currentTheme;
		
		if (noRestart || force)
		{
			var scrollState = this.saveScrollState();
			this.editor.graph.stopEditing(false);
			Editor.currentTheme = value;
					
			this.switchTheme(value);
			this.fireEvent(new mxEventObject('currentThemeChanged'));
			this.editor.fireEvent(new mxEventObject('statusChanged'));
			this.restoreScrollState(scrollState);
		}

		return noRestart;
	};

	/**
	 * Saves scroll position
	 */
	EditorUi.prototype.saveScrollState = function(includeBoundingRect)
	{
		var t = this.editor.graph.view.translate;
		var x = this.diagramContainer.scrollLeft;
		var y = this.diagramContainer.scrollTop;

		if (this.embedViewport != null)
		{
			if (!Editor.inlineFullscreen)
			{
				x += this.embedViewport.x;
				y += this.embedViewport.y;
			}
			else
			{
				x -= this.embedViewport.x;
				y -= this.embedViewport.y;
			}
		}

		var result = {x: x, y: y, tx: t.x, ty: t.y};

		if (includeBoundingRect)
		{
			result.boundingRect = this.diagramContainer.getBoundingClientRect();
		}

		return result;
	};
   
	/**
	 * Dynamic change of dark mode.
	 */
	EditorUi.prototype.restoreScrollState = function(state)
	{
		var s = this.editor.graph.view.scale;
		var t = this.editor.graph.view.translate;

		if (state.boundingRect != null)
		{
			var rect = this.diagramContainer.getBoundingClientRect();
			state.x -= (state.boundingRect.x - rect.x);
			state.y -= (state.boundingRect.y - rect.y);
		}
		
		this.diagramContainer.scrollLeft = state.x + (t.x - state.tx) * s;
		this.diagramContainer.scrollTop = state.y + (t.y - state.ty) * s;
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.installStatusMinimizer = function(parent)
	{
		parent = (parent != null) ? parent : this.statusContainer.parentNode;
		var visible = false;
		
		mxEvent.addListener(parent, 'mouseenter', mxUtils.bind(this, function()
		{
			if (Editor.currentTheme == 'sketch' && this.editor.getStatus() != '')
			{
				this.statusContainer.style.display = '';
			}
		}));
		
		mxEvent.addListener(parent, 'mouseleave', mxUtils.bind(this, function()
		{
			if (Editor.currentTheme == 'sketch' && !visible)
			{
				this.statusContainer.style.display = 'none';
			}
		}));

		var statusChanged = mxUtils.bind(this, function()
		{
			if (Editor.currentTheme == 'sketch')
			{
				var elt = (this.statusContainer.firstChild != null &&
					typeof this.statusContainer.firstChild.getAttribute === 'function') ?
					this.statusContainer.firstChild : null;
				visible = elt != null && elt.getAttribute('class') != null;
				
				if (!visible && elt != null)
				{
					var title = elt.getAttribute('title');
					var file = this.getCurrentFile();
					var key = (file != null) ? file.savingStatusKey :
						DrawioFile.prototype.savingStatusKey;
					
					// Shows animated spinner while saving
					if (title == mxResources.get(key) + '...')
					{
						this.statusContainer.innerHTML = '<div><img title="' + mxUtils.htmlEntities(
							mxResources.get(key)) + '...' + '"src="' + Editor.tailSpin + '"></div>';
						visible = true;
					}
				}

				// Checks size of container without status
				this.statusContainer.style.display = 'none';
				var empty = parent.clientWidth <= 32;

				// Hides container if empty and no status
				parent.style.visibility = (empty && this.editor.getStatus() == '') ?
					'hidden' : '';

				// Shows status if container empty or status relevant
				if (empty || visible)
				{
					this.statusContainer.style.display = '';
					visible = true;
				}
			}
			else if (Editor.currentTheme == 'simple')
			{
				// Required for flex layout gaps to be applied correctly
				this.statusContainer.style.display = '';
				this.statusContainer.style.display = (this.statusContainer.clientWidth == 0)
					? 'none' : '';
			}
			else
			{
				this.statusContainer.style.display = '';
			}
		});
		
		this.editor.addListener('statusChanged', statusChanged);
		statusChanged();
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.switchTheme = function(value)
	{
		this.destroyWindows(true);
		this.updateDefaultStyles();
		this.switchThemeConstants(value);
		this.switchCssForTheme(value);
		this.createMainMenuForTheme(value);
		this.createFooterMenuForTheme(value);
		this.createPickerMenuForTheme(value);
		this.createMenubarForTheme(value);
		
		if (value == 'sketch')
		{
			this.createFormatWindow();
			this.createShapesWindow();
		}
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.getWindows = function()
	{
		var wnd = [this.sidebarWindow, this.formatWindow, this.freehandWindow];

		if (this.actions != null)
		{
			wnd = wnd.concat([this.actions.outlineWindow, this.actions.layersWindow]);
		}

		if (this.menus != null)
		{
			wnd = wnd.concat([this.menus.tagsWindow, this.menus.findWindow,
				this.menus.findReplaceWindow, this.menus.commentsWindow]);
		}

		return wnd;
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.fitWindows = function()
	{
		var wnd = this.getWindows();

		for (var i = 0; i < wnd.length; i++)
		{
			if (wnd[i] != null)
			{
				wnd[i].window.fit();
			}
		}
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.hideWindows = function()
	{
		var wnd = this.getWindows();

		for (var i = 0; i < wnd.length; i++)
		{
			if (wnd[i] != null)
			{
				wnd[i].window.setVisible(false);
			}
		}
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.destroyWindows = function(toolWindowsOnly)
	{
        if (this.sidebarWindow != null && !toolWindowsOnly)
        {
            this.sidebarWindow.destroy();
            this.sidebarWindow = null;
        }
        
        if (this.formatWindow != null && !toolWindowsOnly)
        {
        	this.formatWindow.destroy();
        	this.formatWindow = null;
        }

		if (this.freehandWindow != null)
		{
        	this.freehandWindow.destroy();
        	this.freehandWindow = null;
        }

		if (this.chatWindow != null)
		{
			this.chatWindow.destroy();
			this.chatWindow = null;
		}

        if (this.actions.outlineWindow != null)
        {
        	this.actions.outlineWindow.destroy();
        	this.actions.outlineWindow = null;
        }

        if (this.actions.layersWindow != null)
        {
        	this.actions.layersWindow.destroy();
        	this.actions.layersWindow = null;
        }

		if (this.menus != null)
		{
			if (this.menus.chatWindow != null)
			{
				this.menus.chatWindow.destroy();
				this.menus.chatWindow = null;
			}

			if (this.menus.tagsWindow != null)
			{
				this.menus.tagsWindow.destroy();
				this.menus.tagsWindow = null;
			}

			if (this.menus.findWindow != null)
			{
				this.menus.findWindow.destroy();
				this.menus.findWindow = null;
			}

			if (this.menus.findReplaceWindow != null)
			{
				this.menus.findReplaceWindow.destroy();
				this.menus.findReplaceWindow = null;
			}

			if (this.menus.commentsWindow != null)
			{
				this.menus.commentsWindow.destroy();
				this.menus.commentsWindow = null;
			}
		}

		if (this.dockManager != null)
		{
			this.dockManager.destroy();
			this.dockManager = null;
		}

		if (this._dockResizeListener != null)
		{
			mxEvent.removeListener(window, 'resize', this._dockResizeListener);
			this._dockResizeListener = null;
		}
	};

	/**
	 * Restores windows that were visible when the page was last closed.
	 * Called during initialization after theme setup.
	 */
	EditorUi.prototype.restoreVisibleWindows = function()
	{
		if (!Editor.isSettingsEnabled())
		{
			return;
		}

		// Lazily-created windows: trigger their creation if they were visible
		var windowActions =
		{
			'layers': 'layers',
			'outline': 'outline',
			'tags': 'tags'
		};

		for (var name in windowActions)
		{
			var state = mxSettings.getWindowState(name);

			if (state != null && state.visible)
			{
				var action = this.actions.get(windowActions[name]);

				if (action != null)
				{
					action.funct();
				}
			}
		}
	};

	/**
	 * Saves the current state of the given window to mxSettings.
	 */
	EditorUi.prototype.saveWindowState = function(name, wrapperWindow)
	{
		var wnd = wrapperWindow.window;

		// When minimized, div height reflects the title bar; mxWindow stores
		// the pre-minimize height in wnd.height for use on normalize.
		var h = (wnd.minimized && wnd.height != null) ?
			parseInt(wnd.height) : parseInt(wnd.div.style.height);

		mxSettings.setWindowState(name,
		{
			x: wnd.getX(),
			y: wnd.getY(),
			w: parseInt(wnd.div.style.width),
			h: h,
			visible: wnd.isVisible(),
			minimized: wnd.minimized || false,
			dockState: wnd.dockState || null,
			dockAnchorRight: wnd._dockAnchorRight || null,
			dockAnchorBottom: wnd._dockAnchorBottom || null,
			dockOffsetX: wnd._dockOffsetX || null,
			dockOffsetY: wnd._dockOffsetY || null
		});

		mxSettings.save();
	};

	/**
	 * Restores the saved state of the given window from mxSettings.
	 * Returns the saved state if found, null otherwise.
	 */
	EditorUi.prototype.restoreWindowState = function(name, wrapperWindow)
	{
		var state = mxSettings.getWindowState(name);

		if (state == null)
		{
			return null;
		}

		var wnd = wrapperWindow.window;

		// Restore size first so position clamping uses correct dimensions
		if (state.w != null && state.h != null)
		{
			mxWindow.prototype.setSize.call(wnd, state.w, state.h);
		}

		// Restore position
		if (state.x != null && state.y != null)
		{
			mxWindow.prototype.setLocation.call(wnd, state.x, state.y);
		}

		// Restore dock state
		if (state.dockState != null && this.dockManager != null &&
			Editor.enableWindowDocking)
		{
			wnd._dockAnchorRight = state.dockAnchorRight;
			wnd._dockAnchorBottom = state.dockAnchorBottom;
			wnd._dockOffsetX = state.dockOffsetX;
			wnd._dockOffsetY = state.dockOffsetY;
			wnd.dockState = state.dockState;
			wnd.div.classList.add('mxWindowDocked');
			this.dockManager.windows.push(wnd);
			this.dockManager.pinToEdge(wnd);
		}

		// Ensure visible within current viewport
		wnd.fit();

		// Restore visibility
		if (state.visible != null)
		{
			wnd.setVisible(state.visible);
		}

		// Restore minimized state after sizing so the saved full height
		// is retained as the restore target on un-minimize.
		if (state.minimized && !wnd.minimized)
		{
			wnd.toggleMinimized();
		}

		return state;
	};

	/**
	 * Installs listeners on the given window to persist its state.
	 */
	EditorUi.prototype.installWindowPersistence = function(name, wrapperWindow)
	{
		var ui = this;
		var wnd = wrapperWindow.window;

		var save = function()
		{
			ui.saveWindowState(name, wrapperWindow);
		};

		wnd.addListener(mxEvent.MOVE_END, save);
		wnd.addListener(mxEvent.RESIZE_END, save);
		wnd.addListener(mxEvent.SHOW, save);
		wnd.addListener(mxEvent.HIDE, save);
		wnd.addListener(mxEvent.DOCK, save);
		wnd.addListener(mxEvent.UNDOCK, save);
		wnd.addListener(mxEvent.MAXIMIZE, save);
		wnd.addListener(mxEvent.MINIMIZE, save);
		wnd.addListener(mxEvent.NORMALIZE, save);
	};

	/**
	 * Creates the dock manager for window docking to viewport edges.
	 */
	EditorUi.prototype.createDockManager = function()
	{
		var ui = this;

		this.dockManager =
		{
			// All docked windows
			windows: [],

			// Distance in pixels from edge to trigger docking
			threshold: 16,

			// Preview overlay element
			previewElement: null,

			/**
			 * Returns the dock zone for the given window position.
			 * Zones: 'top-left', 'top-right', 'bottom-left', 'bottom-right',
			 * 'left', 'right', 'top', 'bottom', or null.
			 * Corners take priority when near two edges simultaneously.
			 */
			getDockZone: function(x, y, windowDiv)
			{
				var iw = window.innerWidth || document.documentElement.clientWidth ||
					document.body.clientWidth;
				var ih = window.innerHeight || document.documentElement.clientHeight ||
					document.body.clientHeight;
				var t = this.threshold;
				var w = windowDiv.offsetWidth;
				var h = windowDiv.offsetHeight;

				var nearLeft = x <= t;
				var nearRight = x + w >= iw - t;
				var nearTop = y <= t;
				var nearBottom = y + h >= ih - t;

				// Corners first
				if (nearLeft && nearTop) return 'top-left';
				if (nearRight && nearTop) return 'top-right';
				if (nearLeft && nearBottom) return 'bottom-left';
				if (nearRight && nearBottom) return 'bottom-right';

				// Edges
				if (nearLeft) return 'left';
				if (nearRight) return 'right';
				if (nearTop) return 'top';
				if (nearBottom) return 'bottom';

				return null;
			},

			/**
			 * Docks the given mxWindow to the specified zone.
			 * Stores offsets from the relevant edges so the window
			 * can be repositioned on browser resize.
			 */
			dock: function(wnd, zone)
			{
				var iw = window.innerWidth || document.documentElement.clientWidth ||
					document.body.clientWidth;
				var ih = window.innerHeight || document.documentElement.clientHeight ||
					document.body.clientHeight;
				var w = parseInt(wnd.div.style.width);
				var h = parseInt(wnd.div.style.height);
				var x = wnd.getX();
				var y = wnd.getY();

				wnd.dockState = zone;
				wnd.div.classList.add('mxWindowDocked');

				// Compute position and store anchor offsets.
				// For each axis we store either an offset from the left/top
				// (anchorRight/anchorBottom = false) or from the right/bottom
				// (anchorRight/anchorBottom = true).
				var anchorRight = zone.indexOf('right') >= 0;
				var anchorBottom = zone.indexOf('bottom') >= 0;

				// Pin to edge(s)
				if (zone.indexOf('left') >= 0)
				{
					x = 0;
				}
				else if (zone.indexOf('right') >= 0)
				{
					x = iw - w;
				}

				if (zone.indexOf('top') >= 0)
				{
					y = 0;
				}
				else if (zone.indexOf('bottom') >= 0)
				{
					y = ih - h;
				}

				// For non-corner docks, decide anchor based on position
				if (!anchorRight)
				{
					anchorRight = (x + w / 2) > (iw / 2);
				}

				if (!anchorBottom)
				{
					anchorBottom = (y + h / 2) > (ih / 2);
				}

				// Store anchor mode and offsets from the relevant edges
				wnd._dockAnchorRight = anchorRight;
				wnd._dockAnchorBottom = anchorBottom;
				wnd._dockOffsetX = anchorRight ? (iw - x - w) : x;
				wnd._dockOffsetY = anchorBottom ? (ih - y - h) : y;

				this.windows.push(wnd);
				this.pinToEdge(wnd);

				wnd.fireEvent(new mxEventObject(mxEvent.DOCK, 'side', zone));
			},

			/**
			 * Undocks the given mxWindow.
			 */
			undock: function(wnd)
			{
				var zone = wnd.dockState;

				if (zone == null)
				{
					return;
				}

				for (var i = 0; i < this.windows.length; i++)
				{
					if (this.windows[i] === wnd)
					{
						this.windows.splice(i, 1);
						break;
					}
				}

				wnd.div.classList.remove('mxWindowDocked');
				wnd.dockState = null;
				wnd._dockAnchorRight = null;
				wnd._dockAnchorBottom = null;
				wnd._dockOffsetX = null;
				wnd._dockOffsetY = null;

				wnd.fireEvent(new mxEventObject(mxEvent.UNDOCK, 'side', zone));
			},

			/**
			 * Repositions a docked window based on its dock state and
			 * anchor offsets. Ensures the window stays within viewport.
			 */
			pinToEdge: function(wnd)
			{
				var zone = wnd.dockState;

				if (zone == null)
				{
					return;
				}

				var iw = window.innerWidth || document.documentElement.clientWidth ||
					document.body.clientWidth;
				var ih = window.innerHeight || document.documentElement.clientHeight ||
					document.body.clientHeight;
				var w = parseInt(wnd.div.style.width);
				var h = parseInt(wnd.div.style.height);

				// Compute x from anchor
				var x;

				if (wnd._dockAnchorRight)
				{
					x = iw - w - (wnd._dockOffsetX || 0);
				}
				else
				{
					x = wnd._dockOffsetX || 0;
				}

				// Compute y from anchor
				var y;

				if (wnd._dockAnchorBottom)
				{
					y = ih - h - (wnd._dockOffsetY || 0);
				}
				else
				{
					y = wnd._dockOffsetY || 0;
				}

				// Pin to edge(s) based on dock zone
				if (zone.indexOf('left') >= 0)
				{
					x = 0;
				}
				else if (zone.indexOf('right') >= 0)
				{
					x = iw - w;
				}

				if (zone.indexOf('top') >= 0)
				{
					y = 0;
				}
				else if (zone.indexOf('bottom') >= 0)
				{
					y = ih - h;
				}

				// Clamp to viewport
				x = Math.max(0, Math.min(x, iw - w));
				y = Math.max(0, Math.min(y, ih - h));

				wnd._relayouting = true;
				mxWindow.prototype.setLocation.call(wnd, x, y);
				wnd._relayouting = false;
			},

			/**
			 * Re-pins all docked windows to their edges.
			 */
			layoutAll: function()
			{
				for (var i = 0; i < this.windows.length; i++)
				{
					this.pinToEdge(this.windows[i]);
				}
			},

			/**
			 * Shows the dock preview overlay for the given zone.
			 */
			showPreview: function(zone, wnd)
			{
				if (this.previewElement == null)
				{
					this.previewElement = document.createElement('div');
					this.previewElement.className = 'geDockPreview';
					document.body.appendChild(this.previewElement);
				}

				var iw = window.innerWidth || document.documentElement.clientWidth ||
					document.body.clientWidth;
				var ih = window.innerHeight || document.documentElement.clientHeight ||
					document.body.clientHeight;
				var el = this.previewElement;
				var w = wnd.div.offsetWidth;
				var h = wnd.div.offsetHeight;
				var x = wnd.getX();
				var y = wnd.getY();

				// Pin preview to the target edge(s)
				if (zone.indexOf('left') >= 0)
				{
					x = 0;
				}
				else if (zone.indexOf('right') >= 0)
				{
					x = iw - w;
				}

				if (zone.indexOf('top') >= 0)
				{
					y = 0;
				}
				else if (zone.indexOf('bottom') >= 0)
				{
					y = ih - h;
				}

				// Clamp to viewport
				x = Math.max(0, Math.min(x, iw - w));
				y = Math.max(0, Math.min(y, ih - h));

				el.style.display = 'block';
				el.style.left = x + 'px';
				el.style.top = y + 'px';
				el.style.width = w + 'px';
				el.style.height = h + 'px';
			},

			/**
			 * Hides the dock preview overlay.
			 */
			hidePreview: function()
			{
				if (this.previewElement != null)
				{
					this.previewElement.style.display = 'none';
				}
			},

			/**
			 * Removes a window from dock tracking.
			 */
			removeWindow: function(wnd)
			{
				for (var i = 0; i < this.windows.length; i++)
				{
					if (this.windows[i] === wnd)
					{
						this.windows.splice(i, 1);
						break;
					}
				}
			},

			/**
			 * Destroys the dock manager and cleans up.
			 */
			destroy: function()
			{
				if (this.previewElement != null &&
					this.previewElement.parentNode != null)
				{
					this.previewElement.parentNode.removeChild(this.previewElement);
					this.previewElement = null;
				}
			}
		};

		this._dockResizeListener = mxUtils.bind(this, function()
		{
			if (this.dockManager != null)
			{
				this.dockManager.layoutAll();
			}
		});

		mxEvent.addListener(window, 'resize', this._dockResizeListener);
	};

	/**
	 * Wraps installResizeHandler to add window docking behavior.
	 */
	var originalInstallResizeHandler = EditorUi.prototype.installResizeHandler;

	EditorUi.prototype.installResizeHandler = function(dialog, resizable, destroy)
	{
		originalInstallResizeHandler.apply(this, arguments);

		if (!EditorUi.windowed || !Editor.enableWindowDocking)
		{
			return;
		}

		var ui = this;
		var wnd = dialog.window;

		if (ui.dockManager == null)
		{
			ui.createDockManager();
		}

		var dockManager = ui.dockManager;
		var isDragging = false;
		var candidateDockZone = null;

		// Wrap setLocation to prevent position changes while docked
		var prevSetLocation = wnd.setLocation;

		wnd.setLocation = function(x, y)
		{
			if (this.dockState != null && !this._undocking && !this._relayouting)
			{
				return;
			}

			prevSetLocation.call(this, x, y);
		};

		// Wrap setSize to update dock offsets and re-pin after resize.
		// When docked, bypass prevSetSize (viewport clamping assumes
		// rightward/downward growth) and call mxWindow.prototype.setSize
		// directly; pinToEdge handles positioning.
		var prevSetSize = wnd.setSize;

		wnd.setSize = function(w, h)
		{
			if (this.dockState != null)
			{
				mxWindow.prototype.setSize.call(this, w, h);

				// Update dock offsets to reflect new size so that
				// pinToEdge keeps the correct edges fixed
				var iw = window.innerWidth || document.documentElement.clientWidth ||
					document.body.clientWidth;
				var ih = window.innerHeight || document.documentElement.clientHeight ||
					document.body.clientHeight;
				var newW = parseInt(this.div.style.width);
				var newH = parseInt(this.div.style.height);
				var x = this.getX();
				var y = this.getY();

				this._dockOffsetX = this._dockAnchorRight ? (iw - x - newW) : x;
				this._dockOffsetY = this._dockAnchorBottom ? (ih - y - newH) : y;

				dockManager.pinToEdge(this);
			}
			else
			{
				prevSetSize.call(this, w, h);
			}
		};

		// Dock detection via move events
		wnd.addListener(mxEvent.MOVE_START, function(sender, evt)
		{
			isDragging = true;
			candidateDockZone = null;

			if (wnd.dockState != null)
			{
				wnd._undocking = true;
				dockManager.undock(wnd);
				wnd._undocking = false;
			}
		});

		wnd.addListener(mxEvent.MOVE, function(sender, evt)
		{
			if (!isDragging)
			{
				return;
			}

			var zone = dockManager.getDockZone(wnd.getX(), wnd.getY(), wnd.div);

			if (zone != candidateDockZone)
			{
				candidateDockZone = zone;

				if (zone != null)
				{
					dockManager.showPreview(zone, wnd);
				}
				else
				{
					dockManager.hidePreview();
				}
			}
		});

		wnd.addListener(mxEvent.MOVE_END, function(sender, evt)
		{
			isDragging = false;
			dockManager.hidePreview();

			if (candidateDockZone != null)
			{
				dockManager.dock(wnd, candidateDockZone);
			}

			candidateDockZone = null;
		});

		// Move resize handle to the opposite corner when docked
		wnd.addListener(mxEvent.DOCK, function(sender, evt)
		{
			if (wnd.resize == null)
			{
				return;
			}

			var zone = evt.getProperty('side');
			var flipX = zone.indexOf('right') >= 0;
			var flipY = zone.indexOf('bottom') >= 0;

			if (!flipX && !flipY)
			{
				return;
			}

			// Remove existing resize element and its handlers
			var oldResize = wnd.resize;
			oldResize.parentNode.removeChild(oldResize);
			wnd.resize = null;

			// Create new resize element at the opposite corner
			var resize = document.createElement('img');
			resize.style.position = 'absolute';
			resize.style.zIndex = '2';
			resize.setAttribute('src', mxWindow.prototype.resizeImage);

			if (flipX)
			{
				resize.style.left = '0px';
			}
			else
			{
				resize.style.right = '0px';
			}

			if (flipY)
			{
				resize.style.top = '0px';
			}
			else
			{
				resize.style.bottom = '0px';
			}

			resize.style.cursor = (flipX != flipY) ? 'nesw-resize' : 'nwse-resize';

			var startX = null;
			var startY = null;
			var width = null;
			var height = null;

			var start = function(evt)
			{
				wnd.activate();
				startX = mxEvent.getClientX(evt);
				startY = mxEvent.getClientY(evt);
				width = wnd.div.offsetWidth;
				height = wnd.div.offsetHeight;

				mxEvent.addGestureListeners(document, null, dragHandler, dropHandler);
				wnd.fireEvent(new mxEventObject(mxEvent.RESIZE_START, 'event', evt));
				mxEvent.consume(evt);
			};

			var dragHandler = function(evt)
			{
				if (startX != null && startY != null)
				{
					var dx = mxEvent.getClientX(evt) - startX;
					var dy = mxEvent.getClientY(evt) - startY;

					wnd.setSize(flipX ? (width - dx) : (width + dx),
						flipY ? (height - dy) : (height + dy));

					wnd.fireEvent(new mxEventObject(mxEvent.RESIZE, 'event', evt));
					mxEvent.consume(evt);
				}
			};

			var dropHandler = function(evt)
			{
				if (startX != null && startY != null)
				{
					startX = null;
					startY = null;
					mxEvent.removeGestureListeners(document, null, dragHandler, dropHandler);
					wnd.fireEvent(new mxEventObject(mxEvent.RESIZE_END, 'event', evt));
					mxEvent.consume(evt);
				}
			};

			mxEvent.addGestureListeners(resize, start, dragHandler, dropHandler);
			wnd.div.appendChild(resize);
			wnd.resize = resize;
			wnd._dockResize = true;
		});

		// Restore default resize handle on undock
		wnd.addListener(mxEvent.UNDOCK, function(sender, evt)
		{
			if (wnd._dockResize)
			{
				if (wnd.resize != null)
				{
					wnd.resize.parentNode.removeChild(wnd.resize);
					wnd.resize = null;
				}

				wnd.setResizable(true);
				wnd._dockResize = false;
			}
		});

		// Re-pin after minimize/normalize changes height
		wnd.addListener(mxEvent.NORMALIZE, function(sender, evt)
		{
			if (wnd.dockState != null)
			{
				dockManager.pinToEdge(wnd);
			}
		});

		// Undock before maximizing
		wnd.addListener(mxEvent.MAXIMIZE, function(sender, evt)
		{
			if (wnd.dockState != null)
			{
				wnd._undocking = true;
				dockManager.undock(wnd);
				wnd._undocking = false;
			}
		});

		// Re-pin when shown again if still docked
		wnd.addListener(mxEvent.SHOW, function(sender, evt)
		{
			if (wnd.dockState != null)
			{
				dockManager.pinToEdge(wnd);
			}
		});

		// Clean up dock state on destroy
		var prevDestroy = dialog.destroy;

		dialog.destroy = function()
		{
			dockManager.removeWindow(wnd);
			prevDestroy.apply(this, arguments);
		};
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.switchThemeConstants = function(value)
	{
		var graph = this.editor.graph;
		graph.defaultEdgeLength = Graph.prototype.defaultEdgeLength;
		graph.defaultGridEnabled = Graph.prototype.defaultGridEnabled;
		graph.defaultPageVisible = Graph.prototype.defaultPageVisible;

		if (this.menus != null)
		{
			this.menus.autoPopup = value != 'simple' && value != 'sketch';
		}

		if (value == 'simple' || value == 'sketch')
		{
			Editor.fitWindowBorders = new mxRectangle(60, 30, 30, 30);

			if (Editor.config == null || Editor.config.defaultEdgeLength == null)
			{
				graph.defaultEdgeLength = 120;
			}

			if (urlParams['grid'] == null)
			{
				graph.defaultGridEnabled = false;
			}

			if (urlParams['pv'] == null)
			{
				graph.defaultPageVisible = false;
			}
		}
		else
		{
			Editor.fitWindowBorders = null;
		}
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.isPageMenuVisible = function()
	{
		return this.pages != null && (urlParams['pages'] != '0' ||
			this.pages.length > 1 || Editor.pagesVisible);
	};
	
	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.switchCssForTheme = function(value)
	{
		// Hook for subclassers
	};
	
	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.createMainMenuForTheme = function(value)
	{
		// hook for subclassers
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.createFooterMenuForTheme = function(value)
	{
		// hook for subclassers
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.createPickerMenuForTheme = function(value)
	{
		// hook for subclassers
	};

	/**
	 * 
	 */
	EditorUi.prototype.getNetworkStatus = function()
	{
		var status = null;

		if (this.isOffline(true))
		{
			status = mxResources.get('offline');
		}
		else
		{
			var file = this.getCurrentFile();

			if (file != null)
			{
				if (file.invalidChecksum)
				{
					status = mxResources.get('error') + ': ' +
						mxResources.get('checksum');
				}
				else if (file.sync != null && (!file.sync.enabled ||
					!file.sync.isRealtimeActive()) && this.getServiceName() != 'atlassian') // Atlassian app has pulling sync (no RT)
				{
					status = mxResources.get('realtimeCollaboration') +
						': ' + mxResources.get('disabled');
				}
				else if (file.sync != null && !file.sync.isConnected())
				{
					status = mxResources.get('notConnected');
				}
				else if (file.isRealtimeEnabled() &&
					file.isRealtimeSupported() &&
					file.getRealtimeState() > 1)
				{
					var err = file.getRealtimeError();
					status = mxResources.get('realtimeCollaboration') + ': ' +
						((err != null && err.message != null) ?
						err.message : mxResources.get('error'));
				}
			}
		}

		return status;
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.createMenubarForTheme = function(value)
	{
		if (this.statusContainer != null)
		{
			this.statusContainer.style.flexGrow = '';
			this.statusContainer.style.flexShrink = '';
			this.statusContainer.style.width = '';
			this.statusContainer.style.marginTop = '';
			this.statusContainer.style.justifyContent = '';
			this.statusContainer.style.opacity = '';
		}

		if (this.userElement != null)
		{
			this.menubarContainer.appendChild(this.userElement);
		}

		if (this.buttonContainer != null && this.menubar != null)
		{
			this.buttonContainer.style.display = '';
			this.menubar.container.appendChild(this.buttonContainer);
		}
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.createMenu = function(key, img, className, clickFn)
	{
		className = (className != null) ? className : 'geButton';
		var menu = this.menus.get(key);
		var elt = this.menubar.addMenu(mxResources.get(key), menu.funct, null, clickFn);
		
		elt.className = className;
		elt.setAttribute('title', mxResources.get(key));
		this.menus.menuCreated(menu, elt, className);
		
		if (img != null)
		{
			elt.style.backgroundImage = 'url(' + img + ')';
			elt.innerText = '';
		}

		return elt;
	};

	/**
	 * Create toolbar button.
	 */
	EditorUi.prototype.addButton = function(icon, title, fn, container)
	{
		var elt = this.createToolbarButton(icon, title, fn);
	
		container = (container != null) ? container : this.container;
		container.appendChild(elt);
		
		return elt;
	};

	/**
	 * Create toolbar button.
	 */
	EditorUi.prototype.createToolbarButton = function(icon, title, fn)
	{
		var elt = document.createElement('a');
		elt.className = 'geButton';

		if (icon != null && icon.substring(0, 5) == 'data:')
		{
			elt.style.backgroundImage = 'url(' + icon + ')';
		}

		if (title != null)
		{
			elt.setAttribute('title', title);
		}

		if (fn != null)
		{
			mxEvent.addListener(elt, 'click', function(evt)
			{
				if (elt.getAttribute('disabled') != 'disabled')
				{
					fn(evt);
				}
				
				mxEvent.consume(evt);
			});
		}

		mxEvent.preventDefault(elt);

		return elt;
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.createMenuItem = function(key, img, ignoreState)
	{
		var action = this.actions.get(key);
		var fn = (action != null) ? action.funct : null;
		var btn = this.createToolbarButton(img, mxResources.get(key) +
			((action != null && action.shortcut != null) ? ' (' +
			action.shortcut + ')' : ''), fn);

		if (action != null)
		{
			if (!ignoreState)
			{
				function updateState()
				{
					if (action.isEnabled())
					{
						btn.removeAttribute('disabled');
					}
					else
					{
						btn.setAttribute('disabled', 'disabled');
					}
				};
				
				this.editor.graph.addListener('enabledChanged', updateState);
				action.addListener('stateChanged', updateState);
				updateState();
			}
		}
	   
		return btn;
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.createFormatWindow = function()
	{
		if (this.formatWindow == null)
		{
			var ui = this;
			var saved = mxSettings.getWindowState('format');
			var x = (saved != null && saved.x != null) ? saved.x :
				Math.max(10, this.diagramContainer.parentNode.clientWidth - 256);
			var y = (saved != null && saved.y != null) ? saved.y : 60;
			var w = (saved != null && saved.w != null) ? saved.w : 240;
			var h = (saved != null && saved.h != null) ? saved.h :
				((urlParams['embedInline'] == '1') ? 600 :
				((urlParams['sketch'] == '1') ? 600 : Math.min(600,
					this.editor.graph.container.clientHeight - 10)));

			this.formatWindow = new WrapperWindow(this, mxResources.get('format'), x, y, w, h,
				mxUtils.bind(this, function(container)
			{
				container.appendChild(this.formatContainer);
			}));

			this.formatWindow.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
			{
				if (this.format != null)
				{
					this.format.refresh();
				}

				this.formatWindow.window.fit();
			}));

			var toggleMinimized = this.formatWindow.window.toggleMinimized;
			var mw = w;

			this.formatWindow.window.toggleMinimized = function()
			{
				toggleMinimized.apply(this, arguments);

				if (this.minimized)
				{
					mw = parseInt(this.div.style.width);
					this.div.style.width = '140px';
					this.table.style.width = '140px';
					this.div.style.left = (parseInt(this.div.style.left) + mw - 140) + 'px';
				}
				else
				{
					this.div.style.width = mw + 'px';
					this.table.style.width = this.div.style.width;
					this.div.style.left = (Math.max(0, parseInt(this.div.style.left) - mw + 140)) + 'px';
				}

				ui.format.refresh();
				this.fit();
			};

			mxEvent.addListener(this.formatWindow.window.title, 'dblclick', mxUtils.bind(this, function(evt)
			{
				if (mxEvent.getSource(evt) == this.formatWindow.window.title)
				{
					this.formatWindow.window.toggleMinimized();
				}
			}));

			this.formatWindow.window.minimumSize = new mxRectangle(0, 0, 240, 80);

			this.installWindowPersistence('format', this.formatWindow);

			if (saved != null)
			{
				this.restoreWindowState('format', this.formatWindow);
			}
			// Sets initial state for format window
			else if (Editor.currentTheme == 'sketch' && this.formatEnabled)
			{
				window.setTimeout(mxUtils.bind(this, mxUtils.bind(this, function()
				{
					var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
					var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
					this.formatWindow.window.setVisible(true);

					if (iw < 1000 || ih < 690)
					{
						this.formatWindow.window.toggleMinimized();
					}
				}), 0));
			}
			else
			{
				this.formatWindow.window.setVisible(false);
			}
		}
	};

	/**
	 * 
	 */
	var editorUiToggleFormatPanel = EditorUi.prototype.toggleFormatPanel;

	EditorUi.prototype.toggleFormatPanel = function(visible)
	{
		var wnd = this.formatWindow;
		
		if (wnd != null)
		{
			wnd.window.setVisible((visible != null) ? visible :
				!this.isFormatPanelVisible());
		}
		else
		{
			editorUiToggleFormatPanel.apply(this, arguments);
		}
	};

	/**
	 * 
	 */
	EditorUi.prototype.toggleShapesPanel = function(visible, noScroll)
	{
		if (this.isShapesPanelVisible() != visible)
		{
			var size = EditorUi.prototype.hsplitPosition;

			// On smaller screens this is set to 0
			if (size == 0)
			{
				size = Math.min(this.diagramContainer.clientWidth,
					this.defaultSidebarWidth);
			}
			
			var x = this.hsplitPosition;

			var doRefresh = mxUtils.bind(this, function()
			{
				this.hsplitPosition = tmp;
				this.refresh();

				if (!noScroll)
				{
					this.diagramContainer.scrollLeft -= x - this.hsplitPosition;
				}
			});
			
			var tmp = (visible) ? size : 0;
			var delay = Editor.transitionDelay;

			mxUtils.setPrefixedStyle(this.sidebarContainer.style, 'transform', (tmp == 0) ? 'translateX(0)' : 'translateX(-100%)');

			if (tmp != 0)
			{
				doRefresh();
			}

			window.setTimeout(mxUtils.bind(this, function()
			{
				mxUtils.setPrefixedStyle(this.sidebarContainer.style, 'transform', (tmp == 0) ? 'translateX(-100%)' : 'translateX(0)');
				mxUtils.setPrefixedStyle(this.sidebarContainer.style, 'transition', 'transform ' + delay + 's ease-in-out');
				mxUtils.setPrefixedStyle(this.sidebarContainer.style, 'transform-origin', 'top left');

				window.setTimeout(mxUtils.bind(this, function()
				{
					mxUtils.setPrefixedStyle(this.sidebarContainer.style, 'transition', null);
					mxUtils.setPrefixedStyle(this.sidebarContainer.style, 'transform', null);
					mxUtils.setPrefixedStyle(this.sidebarContainer.style, 'transform-origin', null);

					if (tmp == 0)
					{
						doRefresh();
					}

					this.fireEvent(new mxEventObject('shapesPanelChanged'));
				}), delay * 1000);
			}), 0);
		}
	};

	/**
	 * 
	 */
	EditorUi.prototype.isShapesPanelVisible = function()
	{
		return this.hsplitPosition > 0;
	};

	/**
	 * 
	 */
	var editorUiIsFormatPanelVisible = EditorUi.prototype.isFormatPanelVisible;

	EditorUi.prototype.isFormatPanelVisible = function()
	{
		var wnd = this.formatWindow;
		
		if (wnd != null)
		{
			return wnd.window.isVisible();
		}
		else
		{
			return editorUiIsFormatPanelVisible.apply(this, arguments);
		}
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.createShapesPanel = function(container)
	{
		var css = 'position:absolute;border-style:solid;bottom:0px;' +
			'margin:0;border-radius:0;border-width:1px 0 0 0;';
		
		var addMenu = mxUtils.bind(this, function(id, label)
		{
			var menu = this.menus.get(id);
			
			var elt = this.createMenuElement(label, mxUtils.bind(this, function()
			{
				// Allows extensions of menu.functid
				menu.funct.apply(this, arguments);
			}));
			
			elt.setAttribute('title', label);
			elt.style.cssText = css;
			elt.className = 'geButton';
			container.parentNode.appendChild(elt);
			
			return elt;
		});
		
		if (Editor.enableCustomLibraries && (urlParams['embed'] != '1' ||
			urlParams['libraries'] == '1'))
		{
			// Defined in native apps together with openLibrary
			if (this.actions.get('newLibrary') != null)
			{
				var div = document.createElement('div');
				div.style.cssText = css;
				div.className = 'geButton';
				div.style.left = '0px';
				div.style.right = '50%';
				mxUtils.write(div, mxResources.get('newLibrary'));
				container.appendChild(div);
				
				mxEvent.addListener(div, 'click', this.actions.get('newLibrary').funct);
				
				var div = div.cloneNode(false);
				div.style.left = '50%';
				div.style.right = '0px';
				mxUtils.write(div, mxResources.get('openLibrary'));
				container.appendChild(div);
				
				mxEvent.addListener(div, 'click', this.actions.get('openLibrary').funct);
			}
			else
			{
				var elt1 = addMenu('newLibrary', '');
				elt1.style.left = '0px';
				elt1.style.right = '50%';

				var title1 = document.createElement('span');
				elt1.appendChild(title1);
				
				var elt2 = addMenu('openLibraryFrom', '');
				elt2.style.borderLeftWidth = '1px';
				elt2.style.left = '50%';
				elt2.style.right = '0px';

				var title2 = document.createElement('span');
				elt2.appendChild(title2);

				this.dependsOnLanguage(mxUtils.bind(this, function()
				{
					title1.innerHTML = '';
					mxUtils.write(title1, mxResources.get('newLibrary'));
					elt1.setAttribute('title', mxResources.get('newLibrary'));

					title2.innerHTML = '';
					mxUtils.write(title2, mxResources.get('openLibraryFrom'));
					elt2.setAttribute('title', mxResources.get('openLibraryFrom'));
				}));
			}
		}

		container.appendChild(this.sidebar.container);
		container.style.overflow = 'hidden';
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.createShapesWindow = function()
	{
		if (this.sidebarWindow == null)
		{
			var saved = mxSettings.getWindowState('shapes');
			var w = (saved != null && saved.w != null) ? saved.w :
				Math.min(this.diagramContainer.parentNode.clientWidth - 10, 230) - 6;
			var h = (saved != null && saved.h != null) ? saved.h :
				((urlParams['embedInline'] == '1') ? 650 :
				Math.min(this.diagramContainer.parentNode.clientHeight, 650)) - 6;
			var simpleTheme = Editor.currentTheme == 'simple' ||
				Editor.currentTheme == 'sketch';
			var x = (saved != null && saved.x != null) ? saved.x :
				((simpleTheme && urlParams['embedInline'] != '1') ? 66 : 10);
			var y = (saved != null && saved.y != null) ? saved.y :
				((simpleTheme && urlParams['embedInline'] != '1') ?
				Math.max(30, (this.diagramContainer.parentNode.clientHeight - h) / 2) : 56);

			this.sidebarWindow = new WrapperWindow(this, mxResources.get('shapes'),
				x, y, w, h, mxUtils.bind(this, function(container)
			{
				this.createShapesPanel(container);
			}));

			this.sidebarWindow.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
			{
				this.sidebarWindow.window.fit();
			}));

			this.sidebarWindow.window.minimumSize = new mxRectangle(0, 0, 90, 90);

			this.installWindowPersistence('shapes', this.sidebarWindow);

			if (saved != null)
			{
				this.restoreWindowState('shapes', this.sidebarWindow);
			}
			else
			{
				this.sidebarWindow.window.setVisible(false);
			}
		}
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.setSketchMode = function(value)
	{
		this.doSetSketchMode(value);
		
		// Persist setting
		if (urlParams['rough'] == null)
		{
			mxSettings.settings.sketchMode = value;
			mxSettings.save();
		}
		
		this.fireEvent(new mxEventObject('sketchModeChanged'));
	};

	/**
	 * Sets dark mode and persists the setting.
	 */
	EditorUi.prototype.setAndPersistDarkMode = function(value)
	{
		var actual = value;

		if (value == 'auto')
		{
			actual = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		this.setDarkMode(actual);
		mxSettings.settings.darkMode = value;
		mxSettings.save();
		
		var theme = mxSettings.getUi();

		// Replaces dark UI with kennedy and optional dark mode
		if (urlParams['ui'] == null && theme == 'dark')
		{
			this.setCurrentTheme('kennedy', true);
		}
	};

	/**
	 * Sets dark mode and persists the setting.
	 */
	EditorUi.prototype.setAndPersistLanguage = function(value)
	{
		if (this.spinner.spin(document.body, mxResources.get('working')))
		{
			mxSettings.setLanguage(value);
			mxSettings.save();
			mxClient.language = value;
			mxResources.loadDefaultBundle = false;
			
			mxResources.add(RESOURCE_BASE, null, mxUtils.bind(this, function()
			{
				this.spinner.stop();
				this.fireEvent(new mxEventObject('languageChanged'));
			}));
		}
	};

	/**
	 * 
	 */
	EditorUi.prototype.setElementTitle = function(elt, key)
	{
		this.dependsOnLanguage(mxUtils.bind(this, function()
		{
			elt.setAttribute('title', mxResources.get(key));
		}));
	};

	/**
	 * 
	 */
	EditorUi.prototype.dependsOnLanguage = function(fn)
	{
		fn();
		this.addListener('languageChanged', fn);
	};

	/**
	 * Sets dark mode and persists the setting.
	 */
	EditorUi.prototype.setAndPersistHighContrast = function(value)
	{
		this.setHighContrast(value);

		if (Editor.isSettingsEnabled())
		{
			mxSettings.settings.highContrast = value;
			mxSettings.save();
		}
	};

	/**
	 * Sets dark mode and persists the setting.
	 */
	EditorUi.prototype.isHighContrast = function()
	{
		var highContrastStylesheet = document.getElementById('high-contrast-stylesheet');

		if (highContrastStylesheet != null && window.matchMedia)
		{
			var media = highContrastStylesheet.getAttribute('media');

			return media == 'all' || (media != 'not all' &&
				window.matchMedia('(forced-colors: active)').matches);
		}
		else
		{
			return false;
		}
	};

	/**
	 * Sets dark mode and persists the setting.
	 */
	EditorUi.prototype.setHighContrast = function(value)
	{
		var highContrastStylesheet = document.getElementById('high-contrast-stylesheet');

		if (highContrastStylesheet != null && window.matchMedia)
		{
			var match = window.matchMedia('(forced-colors: active)').matches;
			var media = highContrastStylesheet.getAttribute('media');
			var on = media == 'all' || (media != 'not all' && match);
			
			if (on && !value)
			{
				highContrastStylesheet.setAttribute('media', (match) ?
					'not all' : '(forced-colors: active)');
			}
			else if (!on && value)
			{
				highContrastStylesheet.setAttribute('media', (match) ?
					'(forced-colors: active)' : 'all');
			}
		}
	};

	/**
	 * Dynamic change of dark mode.
	 */
	EditorUi.prototype.isRulerVisible = function()
	{
		return this.ruler != null;
	};
	
	/**
	 * Dynamic change of dark mode.
	 */
	EditorUi.prototype.setRulerVisible = function(visible)
	{
		var before = this.getDiagramContainerOffset();
		mxSettings.setRulerOn(visible);
		mxSettings.save();
		
		if (!visible && this.ruler != null)
		{
			this.ruler.destroy();
			this.ruler = null;
		}
		else if (visible && this.ruler == null)
		{
			this.ruler = new mxDualRuler(this, this.editor.graph.view.unit);
		}

		this.fireEvent(new mxEventObject('rulerVisibleChanged'));
		var after = this.getDiagramContainerOffset();
		this.diagramContainer.scrollLeft += after.x - before.x;
		this.diagramContainer.scrollTop += after.x - before.x;
	};
	
	/**
	 * Returns true if automatic dark mode is supported.
	 */
	EditorUi.prototype.isAutoDarkModeSupported = function()
	{
		return window.matchMedia != null;
	};
	
	/**
	 * Returns the current state of the dark mode.
	 */
	EditorUi.prototype.isAutoDarkMode = function(ignoreUrl)
	{
		return (!ignoreUrl && urlParams['dark'] == 'auto') ||
			(Editor.isSettingsEnabled() &&
			mxSettings.settings.darkMode == 'auto');
	};
	
	/**
	 * Dynamic change of dark mode.
	 */
	EditorUi.prototype.setDarkMode = function(value)
	{
		if (mxUtils.lightDarkColorSupported)
		{
			Editor.darkMode = value;
			var node = (mxUtils.isAncestorNode(document.body, this.container) ||
				this.editor == null) ? this.container : this.editor.graph.container;
			mxConstants.DROP_TARGET_COLOR = Editor.isDarkMode() ? '#00ff00' : '#0000ff';
			
			if (node != null)
			{
				if (Editor.isDarkMode())
				{
					node.classList.add('geDarkMode');
					node.style.colorScheme = 'dark';
				}
				else
				{
					node.classList.remove('geDarkMode');
					node.style.colorScheme = 'light';
				}
			}

			if (this.ruler != null)
			{
				this.ruler.updateStyle();
			}
			
			this.fireEvent(new mxEventObject('darkModeChanged'));
		}
	};

	/**
	 * Changes Editor.pagesVisible.
	 */
	EditorUi.prototype.setPagesVisible = function(value)
	{
		if (Editor.pagesVisible != value)
		{
			Editor.pagesVisible = value;

			// Persist setting
			mxSettings.settings.pagesVisible = value;
			mxSettings.save();

			this.fireEvent(new mxEventObject('pagesVisibleChanged'));
		}
	};
    
	/**
	 * Changes Sidebar.sidebarTitles.
	 */
	EditorUi.prototype.setSidebarTitles = function(value, remember)
	{
		if (this.sidebar.sidebarTitles != value)
		{
			this.sidebar.sidebarTitles = value;

			// Persist setting
			if (Editor.isSettingsEnabled() && remember)
			{
				mxSettings.settings.sidebarTitles = value;
				mxSettings.save();
			}

			this.fireEvent(new mxEventObject('sidebarTitlesChanged'));
		}
	};
    
	/**
	 * Dynamic change of dark mode.
	 */
	EditorUi.prototype.setInlineFullscreen = function(value)
	{
		if (Editor.inlineFullscreen != value)
		{
			this.diagramContainer.setAttribute('data-scrollState',
				JSON.stringify(this.saveScrollState(true)));
			
			// Send request for fullscreen to parent
			var parent = this.embedMessageSource || window.opener || window.parent;
			parent.postMessage(JSON.stringify({
				event: 'resize',
				fullscreen: value,
				rect: this.diagramContainer.getBoundingClientRect()
			}), '*');
		}
	};

	/**
	 * Invokes to update the UI after a size change in inline embed mode.
	 */
	EditorUi.prototype.inlineSizeChanged = function()
	{
		var footer = this.sketchFooterMenuElt;
		var toolbar = this.sketchMainMenuElt;
		var picker = this.sketchPickerMenuElt;
		
		if (Editor.inlineFullscreen)
		{
			toolbar.style.left = '10px';
			toolbar.style.top = '10px';
			
			picker.style.left = '10px';
			picker.style.top = '60px';

			footer.style.top = '10px';
			footer.style.right = '12px';
			footer.style.left = '';

			if (this.diagramContainer.getAttribute('data-bounds') == null)
			{
				this.diagramContainer.setAttribute('data-bounds', this.diagramContainer.style.top + ' ' +
					this.diagramContainer.style.left + ' ' + this.diagramContainer.style.width + ' ' +
					this.diagramContainer.style.height);

				this.diagramContainer.style.top = '0px';
				this.diagramContainer.style.left = '0px';
				this.diagramContainer.style.bottom = '0px';
				this.diagramContainer.style.right = '0px';
				this.diagramContainer.style.width = '';
				this.diagramContainer.style.height = '';
			}
		}
		else
		{
			var bounds = this.diagramContainer.getAttribute('data-bounds');

			if (bounds != null) 
			{
				this.diagramContainer.removeAttribute('data-bounds');
				var tokens = bounds.split(' ');

				var ds = mxUtils.getDocumentSize();
				this.diagramContainer.style.top = tokens[0];
				this.diagramContainer.style.left = tokens[1];

				var w = parseInt(tokens[2]);
				var h = parseInt(tokens[3]);

				w = Math.min((this.minInlineWidth != null) ? Math.max(
					this.minInlineWidth, w) : w, ds.width - 80);
				h = Math.min((this.minInlineHeight != null) ? Math.max(
					this.minInlineHeight, h) : h, ds.height - 80);
				
				this.diagramContainer.style.width = w + 'px';
				this.diagramContainer.style.height = h + 'px';
				this.diagramContainer.style.bottom = '';
				this.diagramContainer.style.right = '';

				var parent = this.embedMessageSource || window.opener || window.parent;
				parent.postMessage(JSON.stringify({
					event: 'resize',
					rect: this.diagramContainer.getBoundingClientRect()
				}), '*');
			}
			
			toolbar.style.left = this.diagramContainer.offsetLeft + 'px';
			toolbar.style.top = (this.diagramContainer.offsetTop -
				toolbar.offsetHeight - 4) + 'px';
			
			picker.style.display = '';
			picker.style.left = (this.diagramContainer.offsetLeft -
				picker.offsetWidth - 4) + 'px';
			picker.style.top = this.diagramContainer.offsetTop + 'px';

			footer.style.left = (this.diagramContainer.offsetLeft +
				this.diagramContainer.offsetWidth -
				footer.offsetWidth) + 'px';
			footer.style.top = toolbar.style.top;
			footer.style.right = '';

			this.bottomResizer.style.left = (this.diagramContainer.offsetLeft +
				(this.diagramContainer.offsetWidth -
				this.bottomResizer.offsetWidth) / 2) + 'px';
			this.bottomResizer.style.top = (this.diagramContainer.offsetTop +
				this.diagramContainer.offsetHeight -
				this.bottomResizer.offsetHeight / 2 - 1) + 'px';

			this.rightResizer.style.left = (this.diagramContainer.offsetLeft +
				this.diagramContainer.offsetWidth -
				this.rightResizer.offsetWidth / 2 - 1) + 'px';
			this.rightResizer.style.top = (this.diagramContainer.offsetTop +
				(this.diagramContainer.offsetHeight -
				this.bottomResizer.offsetHeight) / 2) + 'px';
		}

		this.bottomResizer.style.visibility = (Editor.inlineFullscreen ||
			Editor.noResizers) ? 'hidden' : '';
		this.rightResizer.style.visibility = this.bottomResizer.style.visibility;

		var inlineNoUi = urlParams['embedInline'] == '1' && Editor.passiveScroll;
		toolbar.style.visibility = inlineNoUi ? 'hidden' : '';
		footer.style.visibility = inlineNoUi ? 'hidden' : '';
		picker.style.display = inlineNoUi ? 'none' : '';
	};

	/**
	 * Dynamic change of dark mode.
	 */
	EditorUi.prototype.doSetSketchMode = function(value)
	{
		if (Editor.sketchMode != value)
		{
			Editor.sketchMode = value;
			this.updateDefaultStyles();
		}
	};

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
	EditorUi.prototype.updateDefaultStyles = function()
	{
		function setStyle(style, key, value)
		{
			style[key] = value;
		};
		
		var graph = this.editor.graph;
		graph.defaultVertexStyle = mxUtils.clone(Graph.prototype.defaultVertexStyle);
		graph.defaultEdgeStyle = mxUtils.clone(Graph.prototype.defaultEdgeStyle);
		
		// Skipped if defaultVertexStyle or defaultEdgeStyle configured
		if (Editor.config == null || (Editor.config.defaultVertexStyle == null &&
		 	Editor.config.defaultEdgeStyle == null))
		{
			if (Editor.currentTheme == 'simple' || urlParams['embedInline'] == '1')
			{
					graph.vertexFontSize = 16;
					graph.edgeFontSize = graph.vertexFontSize - 4;
			}
			else if (Editor.currentTheme == 'sketch')
			{
				graph.vertexFontSize = 20;
				graph.edgeFontSize = graph.vertexFontSize - 4;
			}
			else
			{
				graph.vertexFontSize = Graph.prototype.vertexFontSize;
				graph.edgeFontSize = Graph.prototype.edgeFontSize;
			}

			// Font size for edges is applied to all inserted edges
			setStyle(graph.defaultEdgeStyle, 'fontSize', graph.edgeFontSize);
		}

		// Skipped if defaultEdgeStyle configured
		if (Editor.config == null || Editor.config.defaultEdgeStyle == null)
		{
			if (Editor.currentTheme == 'simple' || urlParams['embedInline'] == '1')
			{
				setStyle(graph.defaultEdgeStyle, 'edgeStyle', 'none');
				setStyle(graph.defaultEdgeStyle, 'curved', '1');
				setStyle(graph.defaultEdgeStyle, 'rounded', '0');
				setStyle(graph.defaultEdgeStyle, 'endSize', '8');
				setStyle(graph.defaultEdgeStyle, 'startSize', '8');
			}
			else if (Editor.currentTheme == 'sketch')
			{
				setStyle(graph.defaultEdgeStyle, 'edgeStyle', 'none');
				setStyle(graph.defaultEdgeStyle, 'curved', '1');
				setStyle(graph.defaultEdgeStyle, 'rounded', '0');
				setStyle(graph.defaultEdgeStyle, 'jettySize', 'auto');
				setStyle(graph.defaultEdgeStyle, 'orthogonalLoop', '1');
				setStyle(graph.defaultEdgeStyle, 'endArrow', 'open');
				setStyle(graph.defaultEdgeStyle, 'endSize', '14');
				setStyle(graph.defaultEdgeStyle, 'startSize', '14');
				setStyle(graph.defaultEdgeStyle, 'sourcePerimeterSpacing', '8');
				setStyle(graph.defaultEdgeStyle, 'targetPerimeterSpacing', '8');
			}
		}

		// Skipped if defaultFonts configured
		if (Editor.config == null || Editor.config.defaultFonts == null)
		{
			// Skipped if defaultFonts, defaultVertexStyle or defaultEdgeStyle configured
			if (Editor.config == null || (Editor.config.defaultVertexStyle == null &&
				Editor.config.defaultEdgeStyle == null))
			{
				if ((Editor.currentTheme == 'sketch' && urlParams['embedInline'] != '1') || Editor.sketchMode)
				{
					setStyle(graph.defaultVertexStyle, 'fontFamily', Editor.sketchFontFamily);
					setStyle(graph.defaultVertexStyle, 'fontSource', Editor.sketchFontSource);

					setStyle(graph.defaultEdgeStyle, 'fontFamily', Editor.sketchFontFamily);
					setStyle(graph.defaultEdgeStyle, 'fontSource', Editor.sketchFontSource);
				}

				if (Editor.sketchMode)
				{
					setStyle(graph.defaultVertexStyle, 'sketch', '1');
					setStyle(graph.defaultVertexStyle, 'curveFitting', Editor.sketchDefaultCurveFitting);
					setStyle(graph.defaultVertexStyle, 'jiggle', Editor.sketchDefaultJiggle);
					setStyle(graph.defaultVertexStyle, 'hachureGap', '4');
					
					setStyle(graph.defaultEdgeStyle, 'sketch', '1');
					setStyle(graph.defaultEdgeStyle, 'curveFitting', Editor.sketchDefaultCurveFitting);
					setStyle(graph.defaultEdgeStyle, 'jiggle', Editor.sketchDefaultJiggle);
					setStyle(graph.defaultEdgeStyle, 'hachureGap', '4');
				}
			}

			if (Editor.currentTheme == 'sketch')
			{
				this.menus.defaultFonts = Menus.prototype.defaultFonts.concat(Editor.sketchFonts);
			}
			else
			{
				this.menus.defaultFonts = Menus.prototype.defaultFonts;
			}
		}

		graph.currentVertexStyle = mxUtils.clone(graph.defaultVertexStyle);
		graph.currentEdgeStyle = mxUtils.clone(graph.defaultEdgeStyle);
		this.clearDefaultStyle();

		this.restorePersistedEdgeStyle();
	};

	/**
	 * Applies the persisted global current edge style (the toolbar dropdown choice for
	 * new edges) over the theme default, so it survives reloads and theme changes —
	 * a user who switches new edges to libavoid auto-routing keeps that choice. A theme
	 * whose edges aren't orthogonal (sketch/simple: curved/none) can't carry libavoid
	 * routing, so the flag is dropped there. Called on load (init)
	 * and after every theme rebuild (updateDefaultStyles); clearDefaultStyle (the
	 * method) leaves the persisted value alone — only the explicit "Clear Default
	 * Style" action clears it.
	 */
	EditorUi.prototype.restorePersistedEdgeStyle = function()
	{
		var graph = this.editor.graph;
		var persistedEdgeStyle = (typeof mxSettings !== 'undefined' &&
			mxSettings.getCurrentEdgeStyle != null) ? mxSettings.getCurrentEdgeStyle() : null;

		if (persistedEdgeStyle != null)
		{
			graph.currentEdgeStyle = mxUtils.clone(persistedEdgeStyle);

			if (graph.defaultEdgeStyle['edgeStyle'] != 'orthogonalEdgeStyle')
			{
				delete graph.currentEdgeStyle['libavoidRouting'];
			}

			// Refresh the toolbar/format UI to reflect the restored style (no force,
			// so the styleChanged save-listener does not re-persist it).
			this.fireEvent(new mxEventObject('styleChanged', 'keys', [], 'values', [], 'cells', []));
		}
	};

	/**
	 * 
	 */
	EditorUi.prototype.getLinkTitle = function(href)
	{
		var title = Graph.prototype.getLinkTitle.apply(this, arguments);

		if (Graph.isPageLink(href))
		{
			var comma = href.indexOf(',');
	
			if (comma > 0)
			{
				var page = this.getPageById(href.substring(comma + 1));
	
				if (page != null)
				{
					title = page.getName();
				}
				else
				{
					title = mxResources.get('pageNotFound');
				}
			}
		}
		else if (href.substring(0, 5) == 'data:')
		{
			title = this.getCustomLinkTitle(href);
		}
		
		return title;
	};

	/**
	 * 
	 */
	EditorUi.prototype.getCustomLinkTitle = function(href)
	{
		var result = mxResources.get('action');

		if (href.substring(0, 17) == 'data:action/json,')
		{
			try
			{
				var link = JSON.parse(href.substring(17));

				// Mirrors LinkDialog.updateActionSummary so the link
				// hint, link-icon tooltip, and Edit Link dialog all
				// agree on the visible label. Resolution order:
				//   1. User-supplied `title` on the custom action.
				//   2. "Effects (N)" for animation-wrapper payloads.
				//   3. Localized label of the first action key via
				//      `CustomActionDialog.SCHEMAS[key]`.
				//   4. Fallback to the generic "Action" string.
				if (link != null &&
					typeof link.title == 'string' &&
					link.title.trim() != '')
				{
					result = link.title.trim();
				}
				else if (link != null && Array.isArray(link.actions) &&
					link.actions.length > 0)
				{
					var first = Object.keys(link.actions[0])[0] || '';

					if (first == 'animation' &&
						link.actions[0].animation != null &&
						Array.isArray(link.actions[0].animation.steps))
					{
						var sc = link.actions[0].animation.steps.length;
						result = mxResources.get('effects', null,
							'Effects') + ' (' + sc + ')';
					}
					else if (first != '')
					{
						var schema = (typeof CustomActionDialog !=
							'undefined' && CustomActionDialog != null) ?
							CustomActionDialog.SCHEMAS[first] : null;
						var fallback = (schema != null) ?
							schema.label : first;
						var resKey = (schema != null && schema.labelKey) ?
							schema.labelKey : first;
						result = mxResources.get(resKey, null, fallback);
					}
				}
			}
			catch (e)
			{
				// ignore
			}
		}

		return result;
	};

	/**
	 * 
	 */
	EditorUi.prototype.handleCustomLink = function(href, cell)
	{
		if (Graph.isPageLink(href))
		{
			var comma = href.indexOf(',');
			var page = this.getPageById(href.substring(comma + 1));
			
			if (page)
			{
				this.selectPage(page)
			}
			else
			{
				// Needs fallback for missing resource in case of viewer lightbox
				throw new Error(mxResources.get('pageNotFound') || 'Page not found');
			}
		}
		else
		{
			this.editor.graph.handleCustomLink(href, cell);
		}
	};

	/**
	 * Creates the format panel and adds overrides.
	 */
	EditorUi.prototype.installSettings = function()
	{
		if (Editor.isSettingsEnabled())
		{
			var graph = this.editor.graph;

			// Sets global switch for sketch mode
			Editor.pagesVisible = mxSettings.settings.pagesVisible;

			// Gets recent colors from settings
			ColorDialog.recentColors = mxSettings.getRecentColors();

			// Avoids overridden values for changes in
			// multiple windows and updates shared values 
			if (isLocalStorage)
			{
				try
				{
					window.addEventListener('storage', mxUtils.bind(this, function(evt)
					{
						if (evt.key == mxSettings.key)
						{
							mxSettings.load();
							
							// Updates values
							ColorDialog.recentColors = mxSettings.getRecentColors();
							this.menus.customFonts = mxSettings.getCustomFonts();
						}
					}), false);
				}
				catch (e)
				{
					// ignore
				}
			}

			// Updates UI to reflect current edge style
			this.fireEvent(new mxEventObject('styleChanged', 'keys', [], 'values', [], 'cells', []));
			
			/**
			 * Persists custom fonts.
			 */
			this.menus.customFonts = mxSettings.getCustomFonts();
			
			this.addListener('customFontsChanged', mxUtils.bind(this, function(sender, evt)
			{
				mxSettings.setCustomFonts(this.menus.customFonts);
				mxSettings.save();
			}));
			
			/**
			 * Persists copy on connect switch.
			 */
			graph.connectionHandler.setCreateTarget(mxSettings.isCreateTarget());
			this.fireEvent(new mxEventObject('copyConnectChanged'));
			
			this.addListener('copyConnectChanged', mxUtils.bind(this, function(sender, evt)
			{
				mxSettings.setCreateTarget(graph.connectionHandler.isCreateTarget());
				mxSettings.save();
			}));
			
			/**
			 * Persists default page format.
			 */
			graph.pageFormat = (graph.defaultPageFormat != null) ?
				graph.defaultPageFormat : mxSettings.getPageFormat();

			this.addListener('pageFormatChanged', mxUtils.bind(this, function(sender, evt)
			{
				mxSettings.setPageFormat(graph.pageFormat);
				mxSettings.save();
			}));

			/**
			 * Persists default grid color.
			 */
			graph.view.defaultDarkGridColor = mxSettings.getGridColor(true);
			graph.view.defaultGridColor = mxSettings.getGridColor(false);
			graph.view.gridColor = 'light-dark(' +
				graph.view.defaultGridColor + ', ' +
				graph.view.defaultDarkGridColor + ')';

			this.addListener('gridColorChanged', mxUtils.bind(this, function(sender, evt)
			{
				// Stores both grid colors for none adaptive colors setting light grid in dark mode
				mxSettings.setGridColor(graph.view.defaultGridColor, false);
				mxSettings.setGridColor(graph.view.defaultDarkGridColor, true);
				mxSettings.save();
			}));

			/**
			 * Persists autosave switch in Chrome app.
			 */
			if (mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
			{
				this.editor.addListener('autosaveChanged', mxUtils.bind(this, function(sender, evt)
				{
					mxSettings.setAutosave(this.editor.autosave);
					mxSettings.save();
				}));
				
				this.editor.autosave = mxSettings.getAutosave();
			}

			if (!this.editor.chromeless || this.editor.editable)
			{
				/**
				 * Persists animations switch.
				 */
				if (mxSettings.settings.enableAnimations != null)
				{
					Editor.enableAnimations = mxSettings.settings.enableAnimations;
				}
				
				this.addListener('enableAnimationsChanged', mxUtils.bind(this, function(sender, evt)
				{
					mxSettings.settings.enableAnimations = Editor.enableAnimations;
					mxSettings.save();
				}));
			}
			
			if (this.sidebar != null)
			{
				if (urlParams['search-shapes'] != null && this.sidebar.searchShapes != null)
				{
					this.sidebar.searchShapes(decodeURIComponent(urlParams['search-shapes']));
					this.sidebar.showEntries('search');
				}
				else
				{
					this.sidebar.showPalette('search', mxSettings.settings.search);
					
					/**
					 * Shows scratchpad if never shown.
					 */
					if ((!this.editor.chromeless || this.editor.editable) && (mxSettings.settings.isNew ||
						parseInt(mxSettings.settings.version || 0) <= 8))
					{
						this.toggleScratchpad();
						mxSettings.save();
					}
				}
			}

			// Saves app defaults for UI
			this.addListener('formatWidthChanged', function()
			{
				mxSettings.setFormatWidth(this.formatWidth);
				mxSettings.save();
			});

			this.addListener('sidebarWidthChanged', function()
			{
				mxSettings.setSidebarWidth(this.hsplitPosition);
				mxSettings.save();
			});

			this.addListener('collapsedSectionsChanged', function()
			{
				if (this.format != null)
				{
					mxSettings.setCollapsedSections(this.format.collapsedSections);
					mxSettings.save();
				}
			});
		}
	};

	/**
	 * Copies the given cells and XML to the clipboard as an embedded image.
	 */
	EditorUi.prototype.writeImageToClipboard = function(dataUrl, w, h, type, success, error)
	{
		type = (type != null) ? type : 'image/png';
		var html = (w == null || h == null) ? '<img src="' + dataUrl + '">' :
			'<img src="' + dataUrl + '" width="' + w + '" height="' + h + '">';
		var data = {'text/html': new Blob([html], {type: 'text/html'})};

		// Firefox does not support image/svg+xml in ClipbaordItem
		if (ClipboardItem.supports != null &&
			ClipboardItem.supports(type))
		{
			data[type] = this.base64ToBlob(dataUrl.substring(
				dataUrl.indexOf(',') + 1), type);
		}

		var cbi = new ClipboardItem(data);
		navigator.clipboard.write([cbi]).then(success)['catch'](error);
		EditorUi.debug('EditorUi.writeImageToClipboard', [this],
			'dataUrl', [dataUrl], 'w', w, 'h', h, 'type', type,
			'html', [html], 'data', [data], 'item', [cbi]);
	};

	/**
	 * Copies the given cells and XML to the clipboard as an embedded image.
	 */
	EditorUi.prototype.writeHtmlToClipboard = function(html, error)
	{
		navigator.clipboard.write([new ClipboardItem(
		{
			'text/plain': new Blob([Editor.convertHtmlToText(html)], {type: 'text/plain'}),
			'text/html': new Blob([html], {type: 'text/html'})
		})])['catch'](error);
	};

	/**
	 * Writes the given text to the clipboard.
	 */
	EditorUi.prototype.writeTextToClipboard = function(text, error, done)
	{
		navigator.clipboard.writeText(text)['catch'](error).then(function()
		{
			if (done != null)
			{
				done();
			}
		});
	};

	/**
	 * Copies the given cells to the clipboard as an SVG image.
	 */
	EditorUi.prototype.copySvg = function(cells, xml, scale)
	{
		try
		{
			if (navigator.clipboard != null && typeof window.ClipboardItem === 'function')
			{
				var graph = this.editor.graph;
				var svgRoot = graph.getSvg(null, scale, null, null, null, null,
					null, null, null, null, null, null, null,
					(cells.length > 0) ? cells : null);

				if (xml != null)
				{
					svgRoot.setAttribute('content', xml);
				}

				var dataUrl = Editor.createSvgDataUri(mxUtils.getXml(svgRoot));
				var w = parseInt(svgRoot.getAttribute('width'));
				var h = parseInt(svgRoot.getAttribute('height'));
				
				this.writeImageToClipboard(dataUrl, w, h, 'image/svg+xml', null,
					mxUtils.bind(this, function(e)
					{
						this.handleError(e);
					}));
			}
		}
		catch (e)
		{
			this.handleError(e);
		}
	};

	/**
	 * Copies the given cells to the clipboard as a PNG image.
	 */
	EditorUi.prototype.copyImage = function(cells, xml, scale)
	{
		try
		{
			scale = (scale != null) ? scale : 4;

			if (navigator.clipboard != null && typeof window.ClipboardItem === 'function' &&
				this.spinner.spin(document.body, mxResources.get('exporting')))
			{
				this.editor.exportToCanvas(mxUtils.bind(this, function(canvas, svgRoot)
				{
					try
					{
						this.spinner.stop();
						var dataUrl = this.createImageDataUri(canvas, xml, 'png');
						var w = Math.round(parseInt(svgRoot.getAttribute('width')) / scale);
						var h = Math.round(parseInt(svgRoot.getAttribute('height')) / scale);

						EditorUi.debug('EditorUi.copyImage', [this],
							'cells', [cells], 'xml', [xml],
							'scale', [scale]);

						this.writeImageToClipboard(dataUrl, w, h, 'image/png', null,
							mxUtils.bind(this, function()
							{
								if (this.isLocalFileSave())
								{
									// Fallback to save dialog with sync write to clipboard
									// handles blocked async clipboard write in Safari
									var filename = this.getBaseFilename(false) +
										((xml != null) ? '.drawio' : '') + '.png';
									this.saveLocalFile(dataUrl.substring(dataUrl.lastIndexOf(',') + 1),
										filename, 'image/png', true, 'png', null, null, null, 'copy');
								}
								else
								{
									this.handleError(e);
								}
							}));
					}
					catch (e)
					{
						this.handleError(e);
					}
				}), null, null, null, mxUtils.bind(this, function(e)
				{
					this.spinner.stop();
					this.handleError(e);
				}), null, null, scale, this.editor.graph.background == null ||
					this.editor.graph.background == mxConstants.NONE,
					null, null, null, 10, null, null, false, null,
					(cells.length > 0) ? cells : null);
			}
		}
		catch (e)
		{
			this.handleError(e);
		}
	};

	/**
	 * Creates the format panel and adds overrides.
	 */
	EditorUi.prototype.copyCells = function(elt, removeCells)
	{
		var graph = this.editor.graph;
		
		if (!graph.isSelectionEmpty())
		{
			// Fixes cross-platform clipboard UTF8 issues by encoding as URI
			var cells = mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells()));
			var xml = mxUtils.getXml(graph.encodeCells(cells));
			mxUtils.setTextContent(elt, encodeURIComponent(xml));

			if (removeCells)
			{
				graph.removeCells(cells, false);
				graph.lastPasteXml = null;
			}
			else
			{
				graph.lastPasteXml = xml;
				graph.pasteCounter = 0;
			}

			elt.focus();
			document.execCommand('selectAll', false, null);
		}
		else
		{
			// Disables copy on focused element
			elt.innerText = '';
		}
	};

	/**
	 * Creates the format panel and adds overrides.
	 */
	EditorUi.prototype.copyXml = function()
	{
		var cells = null;
		
		if (Editor.enableNativeClipboard)
		{
			var graph = this.editor.graph;
			
			if (!graph.isSelectionEmpty())
			{
				cells = mxUtils.sortCells(graph.getExportableCells(
					graph.model.getTopmostCells(graph.getSelectionCells())));
				var xml = mxUtils.getXml(graph.encodeCells(cells));
				navigator.clipboard.writeText(xml);
			}
		}
		
		return cells;
	};
	
	/**
	 * Creates the format panel and adds overrides.
	 */
	EditorUi.prototype.pasteXml = function(xml, pasteAsLabel, compat, evt, html, pt)
	{
		EditorUi.debug('EditorUi.pasteXml', [this], 'xml', [xml],
			'pasteAsLabel', [pasteAsLabel], 'compat', [compat],
			'evt', [evt], 'html', [html], 'pt', [pt]);
		
		html = (html != null) ? html : true;
		var graph = this.editor.graph;
		var targetPoint = (pt != null) ? pt : 
			((Editor.pasteAtMousePointer &&
				graph.isMouseInsertPoint()) ?
				graph.getInsertPoint() : null);
		var cells = null;
		
		if (graph.lastPasteXml == xml)
		{
			if (targetPoint == null)
			{
				graph.pasteCounter++;
			}
		}
		else
		{
			graph.lastPasteXml = xml;
			graph.pasteCounter = 0;
		}
	
		var dx = graph.pasteCounter * graph.gridSize;
							
		if (compat || this.isCompatibleString(xml))
		{
			graph.model.beginUpdate();
			try
			{
				cells = this.importXml(xml, dx, dx);
				
				if (targetPoint != null)
				{
					var bb = graph.getBoundingBoxFromGeometry(cells, true);
					
					if (bb != null)
					{
						var x = Math.round(graph.snap(targetPoint.x));
						var y = Math.round(graph.snap(targetPoint.y));
						graph.cellsMoved(cells, x - bb.x, y - bb.y);
					}
				}
			}
			finally
			{
				graph.model.endUpdate();
			}

			graph.setSelectionCells(cells);
		}
		else if (pasteAsLabel && graph.getSelectionCount() == 1)
		{
			var cell = graph.getStartEditingCell(graph.getSelectionCell(), evt);
			
			if ((/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(xml) &&
				graph.getCurrentCellStyle(cell)[mxConstants.STYLE_SHAPE] == 'image')
			{
				graph.setCellStyles(mxConstants.STYLE_IMAGE, xml, [cell]);
			}
			else
			{
				graph.model.beginUpdate();
        		try
        		{
					graph.labelChanged(cell, xml);
		
					if (Graph.isLink(xml))
					{
						graph.setLinkForCell(cell, xml);
					}
				}
        		finally
        		{
        			graph.model.endUpdate();
        		}
			}
			
			graph.setSelectionCell(cell);
		}
		else
		{
			targetPoint = (targetPoint != null) ? targetPoint :
				graph.getInsertPoint();
			
			if (graph.isMouseInsertPoint())
			{
				dx = 0;
				
				// No offset for insert at mouse position
				if (graph.lastPasteXml == xml && graph.pasteCounter > 0)
				{
					graph.pasteCounter--;
				}
			}

			cells = this.insertTextAt(xml, targetPoint.x + dx,
				targetPoint.y + dx, html);
			graph.setSelectionCells(cells);
		}
		
		if (!graph.isSelectionEmpty())
		{
			graph.scrollCellToVisible(graph.getSelectionCell());
		
			if (this.hoverIcons != null)
			{
				this.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
			}
		}
		
		return cells;
	};
	
	/**
	 * Creates the format panel and adds overrides.
	 */
	EditorUi.prototype.pasteCells = function(evt, realElt, useEvent, pasteAsLabel)
	{
		if (!mxEvent.isConsumed(evt))
		{
			var cpData = evt.clipboardData;
			var graph = this.editor.graph;
			var asHtml = false;
			var elt = realElt;

			if (useEvent && cpData != null && cpData.getData)
			{
				// Workaround for paste from IE11 where the page is copied
				// as HTML while the data is only available via text/plain
				var plain = cpData.getData('text/plain');
				var override = false;
				
				if (plain != null && plain.length > 0 && plain.substring(0, 18) == '%3CmxGraphModel%3E')
				{
					try
					{
						var tmp = decodeURIComponent(plain);
						
						if (this.isCompatibleString(tmp))
						{
							override = true;
							plain = tmp;
						}
					}
					catch (e)
					{
						// ignore
					}
				}
			
				var data = (!override) ? cpData.getData('text/html') : null;

				if (data != null && data.length > 0)
				{
					elt = this.parseHtmlData(data);
					asHtml = elt.getAttribute('data-type') != 'text/plain';
				}
				else if (plain != null && plain.length > 0)
				{
					elt = document.createElement('div');
					mxUtils.setTextContent(elt, plain);
				}
			}
			
			var spans = elt.getElementsByTagName('span');
		
			if (spans != null && spans.length > 0 && spans[0].getAttribute('data-lucid-type') ===
				'application/vnd.lucid.chart.objects')
			{
				var content = spans[0].getAttribute('data-lucid-content');
				
				if (content != null && content.length > 0)
				{
					this.convertLucidChart(content, mxUtils.bind(this, function(xml)
					{
						var graph = this.editor.graph;
						
						if (graph.lastPasteXml == xml)
						{
							graph.pasteCounter++;
						}
						else
						{
							graph.lastPasteXml = xml;
							graph.pasteCounter = 0;
						}

						var dx = graph.pasteCounter * graph.gridSize;
						graph.setSelectionCells(this.importXml(xml, dx, dx));
						graph.scrollCellToVisible(graph.getSelectionCell());
					}), mxUtils.bind(this, function(e)
					{
						this.handleError(e);
					}));
			
					mxEvent.consume(evt);
				}
			}
			//Miro is using unkown encoding instead of BASE64 as before
			/*else if (spans != null && spans.length > 0 && spans[0].hasAttribute('data-meta')
				&& spans[0].getAttribute('data-meta').substring(0, 14) == '<--(miro-data)')
			{
				var miroData = spans[0].getAttribute('data-meta');
				miroData = miroData.substring(14, miroData.length - 15);
				console.log(miroData);
			}*/
			else
			{
				// KNOWN: Paste from IE11 to other browsers on Windows
				// seems to paste the contents of index.html
				var compat = false;
				var xml = '';

				if (asHtml)
				{
					// Extracts compatible XML data
					if (elt.textContent != null &&
						(elt.textContent.substring(0, 7) == '<mxfile' &&
						elt.textContent.substring(elt.textContent.length - 9) == '</mxfile>') ||
						(elt.textContent.substring(0, 13) == '<mxGraphModel' &&
						elt.textContent.substring(elt.textContent.length - 15) == '</mxGraphModel>'))
					{
						// Replaces &nbsp; in text content with normal spaces
						xml = elt.textContent.replace(/\u00a0/g, ' ');
					}
					else
					{
						xml = elt.innerHTML;
					}
				}
				else
				{
					xml = mxUtils.trim((elt.innerText == null) ?
						mxUtils.getTextContent(elt) : elt.innerText);
				}

				// Workaround for junk after XML in VM
				try
				{
					var idx = xml.lastIndexOf('%3E');
					
					if (idx >= 0 && idx < xml.length - 3)
					{
						xml = xml.substring(0, idx + 3);
					}
				}
				catch (e)
				{
					// ignore
				}
				
				// Checks for embedded XML content
				try
				{
					var spans = elt.getElementsByTagName('span');
					var tmp = (spans != null && spans.length > 0) ? 
						mxUtils.trim(decodeURIComponent(spans[0].textContent)) :
						decodeURIComponent(xml);
							
					if (tmp && (this.isCompatibleString(tmp) || 
						tmp.substring(0, 20).replace(/\s/g, '').indexOf('{"isProtected":') == 0))
					{
						compat = true;
						xml = tmp;
					}
				}
				catch (e)
				{
					// ignore
				}

				// // Extracts file from clipboard data
				var blob = null;
				
				try
				{
					if (!compat && elt.textContent == '')
					{
						for (var i = 0; i < cpData.items.length; i++)
						{
							var item = cpData.items[i];

							if (item.kind === 'file')
							{
								blob = item.getAsFile();
								break;
							}
						}
					}
				}
				catch (e)
				{
					// ignore
				}
				
				EditorUi.debug('EditorUi.pasteCells', [this], 'evt', [evt],
					'realElt', [realElt.outerHTML], 'elt', [elt.outerHTML],
					'useEvent', useEvent, 'pasteAsLabel', pasteAsLabel, 'xml', [xml],
					'compat', compat, 'asHtml', asHtml, 'data', cpData,
					'items', [cpData.items.length], 'files', [cpData.files.length],
					'types', [JSON.stringify(cpData.types)], 'blob', [blob]);
				
				try
				{
					if (!compat && blob != null)
					{
						var pt = graph.getInsertPoint();
						this.importFiles([blob], pt.x, pt.y, this.maxImageSize);
						mxEvent.consume(evt);
					}
					else if (xml != null && xml.length > 0)
					{
						if (xml.substring(0, 20).replace(/\s/g, '').indexOf('{"isProtected":') == 0)
						{
							var delayed = mxUtils.bind(this, function ()
							{
								try
								{
									var miro = new MiroImporter();
									xml = miro.importMiroJson(JSON.parse(xml));
									this.pasteXml(xml, pasteAsLabel, compat, evt);
								}
								catch(e)
								{
									console.log('Miro import error:', e);
								}
							});

							if (typeof MiroImporter === 'undefined')
							{
								mxscript('js/diagramly/miro/MiroImporter.js', delayed);
							}
							else
							{
								delayed();
							}
						}
						else
						{
							this.pasteXml(xml, pasteAsLabel, compat, evt, asHtml);
						}

						mxEvent.consume(evt);
					}
					else if (!useEvent)
					{
						graph.lastPasteXml = null;
						graph.pasteCounter = 0;
					}
				}
				catch (e)
				{
					this.handleError(e);
				}
			}
		}
		
		realElt.innerHTML = '&nbsp;';
	};
	
	/**
	 * Installs handler for pasting image from clipboard.
	 */
	EditorUi.prototype.pasteFromClipboard = function(pt)
	{
		var graph = this.editor.graph;

		if (pt == null && Editor.pasteAtMousePointer &&
			graph.isMouseInsertPoint())
		{
			pt = graph.getInsertPoint();
		}

		if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
		{
			try
			{
				if (Editor.enableNativeClipboard)
				{
					this.readGraphModelFromClipboard(mxUtils.bind(this, function(xml, svgBlob, pngBlob, img, data)
					{
						if (xml != null)
						{
							graph.getModel().beginUpdate();
							try
							{
								this.pasteXml(xml, true, null,
									null, null, pt);
							}
							finally
							{
								graph.getModel().endUpdate();
							}
						}
						else
						{
							var blob = (svgBlob != null) ? svgBlob :
								(pngBlob != null) ? pngBlob : img;

							if (blob != null)
							{
								pt = (pt != null) ? pt : graph.getInsertPoint();
								this.importFiles([blob], pt.x, pt.y, this.maxImageSize);
							}
							else
							{
								this.pasteFromLocalClipboard(pt);
							}
						}
					}));
				}
				else
				{
					this.pasteFromLocalClipboard(pt);
				}
			}
			catch (e)
			{
				// ignore
			}
		}
	};

	/**
	 * Installs handler for pasting image from clipboard.
	 */
	EditorUi.prototype.pasteFromLocalClipboard = function(pt)
	{
		var graph = this.editor.graph;

		graph.getModel().beginUpdate();
		try
		{
			graph.moveCellsTo(mxClipboard.paste(graph), pt);
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	};

	/**
	 * Installs handler for pasting image from clipboard.
	 */
	EditorUi.prototype.installImagePasteHandler = function()
	{
		var graph = this.editor.graph;

		graph.container.addEventListener('paste', mxUtils.bind(this, function(evt)
		{
			var data = (evt.clipboardData != null) ? evt.clipboardData :
				evt.originalEvent.clipboardData;
			var containsText = false;
			var file = null;
			
			// Workaround for asynchronous paste event processing in textInput
			// is to ignore this event if it contains text/html/rtf (see below).
			// NOTE: Image is not pasted into textInput so can't listen there.
			for (var i = 0; i < data.types.length; i++)
			{	
				if (data.types[i].substring(0, 5) === 'text/')
				{
					containsText = true;
					break;
				}
			}
			
			// Gets file from event before async code runs below
			for (var i = 0; i < data.items.length; i++)
			{
				var item = data.items[i];

				if (item.kind === 'file')
				{
					file = item.getAsFile();
					break;
				}
			}

			EditorUi.debug('EditorUi.imagePasteHandler', [this],
				'evt', [evt], 'data', [data], 'items', [data.items.length],
				'files', [data.files.length], 'types', [JSON.stringify(data.types)],
				'containsText', containsText, 'file', [file], 'editing', graph.isEditing());
			
			var fallback = mxUtils.bind(this, function()
			{
				try
				{
					if (!containsText && file != null)
					{
						if (graph.isEditing())
						{
							this.importFiles([file], 0, 0, this.maxImageSize, function(fileData, mimeType, x, y, w, h)
							{
								// Inserts image into current text box
								graph.insertImage(fileData, w, h);
							}, function()
							{
								// No post processing
							}, function(file)
							{
								// Handles only images
								return file.type.substring(0, 6) == 'image/';
							}, function(queue)
							{
								// Invokes elements of queue in order
								for (var i = 0; i < queue.length; i++)
								{
									queue[i]();
								}
							});
						}
						else
						{
							var pt = this.editor.graph.getInsertPoint();
							this.importFiles([file], pt.x, pt.y, this.maxImageSize);
						}
						
						mxEvent.consume(evt);
					}
				}
				catch (e)
				{
					// ignore
				}
			});
			
			if (!mxEvent.isConsumed(evt) && !containsText)
			{
				if (Editor.enableNativeClipboard)
				{
					// Uses clipboard API to read SVG data for this event
					navigator.clipboard.read().then(mxUtils.bind(this, function(cpData)
					{
						this.readTypeFromClipboardData(cpData, 'image/svg+xml', mxUtils.bind(this, function(svg)
						{
							if (svg != null)
							{
								var file = new Blob([svg], {type: 'image/svg+xml'});
								var pt = this.editor.graph.getInsertPoint();
								this.importFiles([file], pt.x, pt.y, this.maxImageSize);
							}
							else
							{
								fallback();
							}
						}), 'image');
					}))['catch'](fallback);
				}
				else
				{
					fallback();
				}
			}
		}), false);
	};
		
	/**
	 * Opens the given files in the editor.
	 */
	EditorUi.prototype.readGraphModelFromClipboard = function(fn)
	{
		navigator.clipboard.read().then(mxUtils.bind(this, function(data)
		{
			try
			{
				EditorUi.debug('EditorUi.readGraphModelFromClipboard',
					[this], 'data', data, 'types', (data != null && data.length > 0) ?
						[JSON.stringify(data[0].types)] : []);
				
				this.readGraphModelFromHtmlClipboardData(data, mxUtils.bind(this, function(html, img)
				{
					if (html != null)
					{
						fn(html);
					}
					else
					{
						this.readGraphModelFromImageClipboardData(data, mxUtils.bind(this, function(xml, svgBlob, pngBlob)
						{
							if (xml != null)
							{
								fn(xml);
							}
							else
							{
								this.readTypeFromClipboardData(data, 'text/plain', mxUtils.bind(this, function(text)
								{
									fn(text, svgBlob, pngBlob, img, data);
								}));
							}
						}));
					}
				}));
			}
			catch (e)
			{
				fn(null);
			}
		}))['catch'](function()
		{
			fn(null);
		});
	};

	/**
	 * Opens the given files in the editor.
	 */
	EditorUi.prototype.readGraphModelFromHtmlClipboardData = function(data, fn)
	{
		this.readTypeFromClipboardData(data, 'text/html', mxUtils.bind(this, function(value)
		{
			var xml = null;
			var img = null;

			try
			{
				var elt = this.parseHtmlData(value);

				if (elt != null)
				{
					var asHtml = elt.getAttribute('data-type') != 'text/plain';

					// KNOWN: Paste from IE11 to other browsers on Windows
					// seems to paste the contents of index.html
					xml = (asHtml) ? elt.innerHTML :
						mxUtils.trim((elt.innerText == null) ?
						mxUtils.getTextContent(elt) : elt.innerText);

					// Workaround for junk after XML in VM
					try
					{
						var idx = xml.lastIndexOf('%3E');
						
						if (idx >= 0 && idx < xml.length - 3)
						{
							xml = xml.substring(0, idx + 3);
						}
					}
					catch (e)
					{
						// ignore
					}

					// Extracts single images from HTML
					try
					{
						if (xml == null)
						{
							var src = null;

							if (elt.textContent == '' && elt.children.length == 1 &&
								elt.firstChild.nodeName == 'IMG')
							{
								src = elt.firstChild.getAttribute('src');
							}
							
							if (src != null && src.length > 0)
							{
								if (src.substring(0, 22) == 'data:image/png;base64,')
								{
									img = this.base64ToBlob(src.substring(src.indexOf(',') + 1), 'image/png');
								}
								else if (src.substring(0, 26) == 'data:image/svg+xml;base64,')
								{
									img = this.base64ToBlob(src.substring(src.indexOf(',') + 1), 'image/svg+xml');
								}
							}
						}
					}
					catch (e)
					{
						// ignore
					}
					
					// Checks for embedded XML content
					try
					{
						var spans = elt.getElementsByTagName('span');
						var tmp = (spans != null && spans.length > 0) ? 
							mxUtils.trim(decodeURIComponent(spans[0].textContent)) :
							decodeURIComponent(xml);
								
						if (this.isCompatibleString(tmp))
						{
							xml = tmp;
						}
					}
					catch (e)
					{
						// ignore
					}

				}
			}
			catch (e)
			{
				// ignore
			}
			
			fn(this.isCompatibleString(xml) ? xml : null, img);
		}));
	};

	/**
	 * Opens the given files in the editor.
	 */
	EditorUi.prototype.readGraphModelFromImageClipboardData = function(data, fn)
	{
		this.readTypeFromClipboardData(data, 'image/svg+xml', mxUtils.bind(this, function(svgData, svgBlob)
		{
			var xml = null;
			
			try
			{
				if (svgData != null)
				{
					xml = mxUtils.parseXml(svgData).documentElement.getAttribute('content');
				}
			}
			catch (e)
			{
				// ignore
			}

			if (this.isCompatibleString(xml))
			{
				fn(xml);
			}
			else
			{
				this.readTypeFromClipboardData(data, 'image/png', mxUtils.bind(this, function(pngData, pngBlob)
				{
					xml = Editor.extractGraphModelFromPng('data:image/png;base64,' + pngData);

					if (this.isCompatibleString(xml))
					{
						fn(xml);
					}
					else
					{
						fn(null, svgBlob, pngBlob);
					}
				}));
			}
		}));
	};

	/**
	 * Opens the given files in the editor.
	 */
	EditorUi.prototype.readTypeFromClipboardData = function(data, type, fn)
	{
		var done = false;

		if (data != null && data.length > 0)
		{
			for (var i = 0; i < data.length && !done; i++)
			{
				(function(item)
				{
					if (mxUtils.indexOf(item.types, type) >= 0)
					{
						done = true;

						item.getType(type).then(mxUtils.bind(this, function(blob)
						{
							if (type == 'image/png')
							{
								blob.arrayBuffer().then(function(tmp)
								{
									fn(btoa(Graph.arrayBufferToString(tmp)), blob);
								})['catch'](function()
								{
									fn(null);
								});
							}
							else
							{
								blob.text().then(mxUtils.bind(this, function(result)
								{
									EditorUi.debug('EditorUi.readTypeFromClipboardData', [this],
										'data', [data], 'type', [type], 'result', [result]);
									fn(result, blob);
								}))['catch'](function()
								{
									fn(null);
								});
							}
						}))['catch'](function()
						{
							fn(null);
						});
					}
				})(data[i]);
			}
		}
		
		if (!done)
		{
			fn();
		}
	};

	/**
	 * Parses the given HTML data and returns a DIV.
	 */
	EditorUi.prototype.parseHtmlData = function(data)
	{
		var elt = null;
		
		if (data != null && data.length > 0)
		{
			var hasMeta = data.substring(0, 6) == '<meta ';
			elt = document.createElement('div');
			elt.innerHTML = ((hasMeta) ? '<meta charset="utf-8">' : '') +
				Graph.sanitizeHtml(data);
			asHtml = true;

			// Workaround for innerText not ignoring style elements in Chrome
			var styles = elt.getElementsByTagName('style');
			
			if (styles != null)
			{
				while (styles.length > 0)
				{
					styles[0].parentNode.removeChild(styles[0]);
				}
			}
			
			// Special case of link pasting from Chrome
			if (elt.firstChild != null && elt.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT &&
				elt.firstChild.nextSibling != null && elt.firstChild.nextSibling.nodeType == mxConstants.NODETYPE_ELEMENT &&
				elt.firstChild.nodeName == 'META' && elt.firstChild.nextSibling.nodeName == 'A' &&
				elt.firstChild.nextSibling.nextSibling == null)
			{
				var temp = (elt.firstChild.nextSibling.innerText == null) ?
					mxUtils.getTextContent(elt.firstChild.nextSibling) :
					elt.firstChild.nextSibling.innerText;
			
				if (temp == elt.firstChild.nextSibling.getAttribute('href'))
				{
					mxUtils.setTextContent(elt, temp);
					asHtml = false;
				}
			}

			// Extracts data from single image
			if (elt.textContent == '')
			{
				var images = elt.getElementsByTagName('img');

				if (images.length == 1)
				{
					var temp = images[0].getAttribute('src');
					var result = null;
					
					if (temp != null)
					{
						if (Editor.isPngDataUrl(temp))
						{
							var xml = Editor.extractGraphModelFromPng(temp);
							
							if (xml != null && xml.length > 0)
							{
								result = xml;
							}
						}
						else if (temp.substring(0, 26) == 'data:image/svg+xml;base64,')
						{
							img = this.base64ToBlob(temp.substring(temp.indexOf(',') + 1), 'image/svg+xml');
							var svg = Graph.getSvgFromDataUri(temp);

							try
							{
								var content = mxUtils.parseXml(svg).documentElement.getAttribute('content');

								if (this.isCompatibleString(content))
								{
									result = content;
								}
							}
							catch (e)
							{
								// ignore
							}
						}

						if (result != null)
						{
							mxUtils.setTextContent(elt, result);
							asHtml = false;
						}
					}
				}
			}

			if (asHtml)
			{
				Graph.removePasteFormatting(elt);
			}
			else
			{
				elt.setAttribute('data-type', 'text/plain');
			}
		}

		EditorUi.debug('EditorUi.parseHtmlData', [this],
			'data', [data], 'elt', [elt], 'asHtml', asHtml);
		
		return elt;
	};

	/**
	 * 
	 */
	EditorUi.prototype.showPrintDialog = function(title, fn, btnTitle)
	{
		this.showDialog(new PrintDialog(this, title, fn,
			btnTitle).container, 360, null, true, true);
	};

	/**
	 * 
	 */
	EditorUi.prototype.print = function(preview, args)
	{
		var editor = this.editor;
		var graph = editor.graph;
		var printScale = 1;
		var idx = this.getPageIndex(this.currentPage);
		var currentPage = (idx != null) ? idx + 1 : 1;
		
		var printGraph = mxUtils.bind(this, function(thisGraph, pv, forcePageBreaks, pageId)
		{
			// Workaround for CSS transforms affecting the print output
			// is to disable during print output and restore after
			var prev = thisGraph.useCssTransforms;
			var prevTranslate = thisGraph.currentTranslate;
			var prevScale = thisGraph.currentScale;
			var prevViewTranslate = thisGraph.view.translate;
			var prevViewScale = thisGraph.view.scale;

			if (thisGraph.useCssTransforms)
			{
				thisGraph.useCssTransforms = false;
				thisGraph.currentTranslate = new mxPoint(0,0);
				thisGraph.currentScale = 1;
				thisGraph.view.translate = new mxPoint(0,0);
				thisGraph.view.scale = 1;
			}

			// Negative coordinates are cropped or shifted if page visible
			var gb = thisGraph.getGraphBounds();
			var border = 0;
			var x0 = 0;
			var y0 = 0;

			// No rounding of the page size so that the printed page grid stays
			// aligned with the page breaks on the canvas (getPageLayout uses
			// the exact page size, page formats may be fractional)
			var pf = mxRectangle.fromRectangle(thisGraph.pageFormat);
			var autoOrigin = args.fit || args.crop || !thisGraph.pageVisible;
			var temp = args.scale;
			pf.width = pf.width * thisGraph.pageScale;
			pf.height = pf.height * thisGraph.pageScale;
			var scale = 1;

			if (args.fit)
			{
				var h = args.sheetsAcross;
				var v = args.sheetsDown;

				if (!isNaN(temp))
				{
					pf.width = Math.ceil(pf.width * temp);
					pf.height = Math.ceil(pf.height * temp);
				}

				scale = Math.min((pf.height * v) / (gb.height / thisGraph.view.scale),
					(pf.width * h) / (gb.width / thisGraph.view.scale));
			}
			else
			{
				scale = !isNaN(temp) ? temp : 1;
			}

			// Applies print scale
			scale *= printScale;
		
			// Starts at first visible page
			if (!autoOrigin && thisGraph.pageVisible)
			{
				var layout = thisGraph.getPageLayout();
				x0 -= layout.x * pf.width;
				y0 -= layout.y * pf.height;
			}
			else
			{
				autoOrigin = true;
			}

			if (args.crop)
			{
				if (args.selection)
				{
					gb = graph.getBoundingBox(graph.getSelectionCells());
				}
				
				pf.width = (gb.width + 1) * scale / thisGraph.view.scale;
				pf.height = (gb.height + 1) * scale / thisGraph.view.scale;
			}

			pf.width = pf.width * printScale;
			pf.height = pf.height * printScale;
			var anchorId = (pageId != null) ? 'page/id,' + pageId : null;

			if (pv == null)
			{
				pv = PrintDialog.createPrintPreview(thisGraph, scale, null, border, x0, y0, autoOrigin);
				pv.title = this.getBaseFilename(true);
				pv.pageSelector = false;
				pv.mathEnabled = false;
				var pageMargin = args.border;
				
				if (!isNaN(pageMargin))
				{
					pv.pageMargin = pageMargin;
				}

				var writeHead = pv.writeHead;

				// Overridden to add custom fonts
				pv.writeHead = function(doc, css)
				{
					css = (css != null) ? css : '';
					
					if (!args.shadows)
					{
						css += 'g[style*="filter: drop-shadow("] {\n' +
							'  filter: none !important;{\n' +
							'}\n';
					}

					// Fixes bold math when exported to PDF
					if (mxClient.IS_GC)
					{
						css += '@media print {\n' +
							'  .MathJax svg { shape-rendering: crispEdges; }\n' +
							'}\n';
					}
					
					if (editor.fontCss != null)
					{
						css += editor.fontCss;
					}
					
					writeHead.apply(this, arguments);

					var fonts = thisGraph.getCustomFonts();
					
					for (var i = 0; i < fonts.length; i++)
					{
						var fontName = fonts[i].name;
						var fontUrl = fonts[i].url;
						
						if (Graph.isCssFontUrl(fontUrl))
						{
							doc.writeln('<link rel="stylesheet" href="' +
								mxUtils.htmlEntities(Graph.rewriteGoogleFontUrl(fontUrl)) +
								'" charset="UTF-8" type="text/css">');
						}
						else
						{
							doc.writeln('<style type="text/css">');
							doc.writeln('@font-face {\n' +
								'font-family: "' + mxUtils.htmlEntities(fontName) + '";\n' + 
								'src: url("' + mxUtils.htmlEntities(fontUrl) + '");\n}');
							doc.writeln('</style>');
						}
					}
				};

				// Replaces background images with SVG subtrees
				if (Editor.replaceSvgDataUris)
				{
					var printDrawBackgroundImage = pv.drawBackgroundImage;

					pv.drawBackgroundImage = function(img)
					{
						printDrawBackgroundImage.apply(this, arguments);

						if (img.node != null)
						{
							EditorUi.embedSvgImages(img.node);

							graph.disableSvgLinks(img.node, function(link)
							{
								link.setAttribute('href', 'javascript:void(0)');		
							});
						}
					};
				}

				// Renders grid and handles math
				var printPreviewAddGraphFragment = pv.addGraphFragment;

				pv.addGraphFragment = function(dx, dy, scale, pageNumber, div, clip)
				{
					printPreviewAddGraphFragment.apply(this, arguments);

					if (this.graph.mathEnabled)
					{
						this.mathEnabled = this.mathEnabled || true;
					}
					else
					{
						div.classList.add('geDisableMathJax');
					}
					
					// Adds shadow
					if (this.graph.shadowVisible)
					{
						var svgs = div.getElementsByTagName('svg');
						
						for (var i = 0; i < svgs.length; i++)
						{
							thisGraph.addSvgShadow(svgs[i]);
						}
					}
				};
				
				// Generates the print output
				if (args.grid)
				{
					pv.gridSize = thisGraph.gridSize;
					pv.gridSteps = thisGraph.view.gridSteps;
					pv.gridColor = Editor.isDarkMode() ?
						mxGraphView.prototype.defaultGridColor :
						thisGraph.view.gridColor;
				}

				// Filters cells with hidden tags
				if (args.selection)
				{
					pv.isCellVisible = function(cell)
					{
						return thisGraph.isCellSelected(cell) &&
							thisGraph.isCellVisible(cell);
					};
				}
				else
				{
					pv.isCellVisible = function(cell)
					{
						return thisGraph.isCellVisible(cell);
					};
				}

				pv.open(null, null, forcePageBreaks, true, anchorId, pf,
					(args.selection) ? thisGraph.getSelectionCells() : null);
			}
			else
			{
				var bg = thisGraph.background;
				
				if (bg == null || bg == '' || bg == mxConstants.NONE)
				{
					bg = '#ffffff';
				}

				pv.backgroundColor = bg;
				pv.autoOrigin = autoOrigin;
				
				if (args.grid)
				{
					pv.gridSize = thisGraph.gridSize;
					pv.gridSteps = thisGraph.view.gridSteps;
					pv.gridColor = Editor.isDarkMode() ?
						mxGraphView.prototype.defaultGridColor :
						thisGraph.view.gridColor;
				}

				// Filters cells with hidden tags
				if (args.selection)
				{
					pv.isCellVisible = function(cell)
					{
						return thisGraph.isCellSelected(cell) &&
							thisGraph.isCellVisible(cell);
					};
				}
				else
				{
					pv.isCellVisible = function(cell)
					{
						return thisGraph.isCellVisible(cell);
					};
				}

				pv.appendGraph(thisGraph, scale, x0, y0, forcePageBreaks, true, anchorId, pf,
					(args.selection) ? thisGraph.getSelectionCells() : null);
				
				var extFonts = thisGraph.getCustomFonts();
				
				if (pv.wnd != null)
				{
					for (var i = 0; i < extFonts.length; i++)
					{
						var fontName = extFonts[i].name;
						var fontUrl = extFonts[i].url;
						
						if (Graph.isCssFontUrl(fontUrl))
						{
							pv.wnd.document.writeln('<link rel="stylesheet" href="' +
								mxUtils.htmlEntities(fontUrl) +
								'" charset="UTF-8" type="text/css">');
						}
						else
						{
							pv.wnd.document.writeln('<style type="text/css">');
							pv.wnd.document.writeln('@font-face {\n' +
								'font-family: "' + mxUtils.htmlEntities(fontName) + '";\n' + 
								'src: url("' + mxUtils.htmlEntities(fontUrl) + '");\n}');
							pv.wnd.document.writeln('</style>');
						}
					}
				}
			}
			
			// Restores state if css transforms are used
			if (prev)
			{
				thisGraph.useCssTransforms = prev;
				thisGraph.currentTranslate = prevTranslate;
				thisGraph.currentScale = prevScale;
				thisGraph.view.translate = prevViewTranslate;
				thisGraph.view.scale = prevViewScale;
			}
			
			return pv;
		});
		
		var pagesFrom = args.pagesFrom;
		var pagesTo = args.pagesTo;
		var ignorePages = !args.allPages;
		var pv = null;

		if (EditorUi.isElectronApp)
		{
			PrintDialog.electronPrint(this, args);
			
			return;
		}
		
		if (ignorePages)
		{
			ignorePages = args.selection ||
				(pagesFrom == currentPage &&
				pagesTo == currentPage);
		}
		
		if (!ignorePages && this.pages != null && this.pages.length)
		{
			var i0 = 0;
			var imax = this.pages.length - 1;
			
			if (!args.allPages)
			{
				i0 = parseInt(pagesFrom) - 1;
				imax = parseInt(pagesTo) - 1;
			}
			
			for (var i = i0; i <= imax; i++)
			{
				var page = this.pages[i];
				var tempGraph = (page == this.currentPage) ? graph : null;

				if (tempGraph == null)
				{
					tempGraph = this.createTemporaryGraph(graph.stylesheet);
					tempGraph.shapeForegroundColor = graph.shapeForegroundColor;
					tempGraph.shapeBackgroundColor = graph.shapeBackgroundColor;

					// Restores graph settings that are relevant for printing
					var pageVisible = true;
					var mathEnabled = false;
					var shadowVisible = false;
					var bg = null;
					var bgImage = null;
					
					if (page.viewState == null)
					{
						// Workaround to extract view state from XML node
						// This changes the state of the page and parses
						// the XML for the graph model even if not needed.
						if (page.root == null)
						{
							this.updatePageRoot(page);
						}
					}
					
					if (page.viewState != null)
					{
						pageVisible = page.viewState.pageVisible;
						mathEnabled = page.viewState.mathEnabled;
						shadowVisible = page.viewState.shadowVisible;
						bg = page.viewState.background;
						bgImage = page.viewState.backgroundImage;
						tempGraph.pageFormat = page.viewState.pageFormat;
						tempGraph.gridSize = page.viewState.gridSize;
						tempGraph.hiddenTags = page.viewState.hiddenTags || [];
					}

					// Forces update of background page image in offscreen page
					if (bgImage != null && bgImage.originalSrc != null)
					{
						bgImage = this.createImageForPageLink(
							bgImage.originalSrc, page);
					}
					
					tempGraph.background = bg;
					tempGraph.backgroundImage = (bgImage != null) ? new mxImage(
						bgImage.src, bgImage.width, bgImage.height,
						bgImage.x, bgImage.y) : null;
					tempGraph.pageVisible = pageVisible;
					tempGraph.mathEnabled = mathEnabled;
					tempGraph.shadowVisible = shadowVisible;

					// Overrides graph bounds to include background images
					var graphGetGraphBounds = tempGraph.getGraphBounds;

					tempGraph.getGraphBounds = function()
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

					// Redirects placeholders to current page
					var graphGetGlobalVariable = tempGraph.getGlobalVariable;
	
					tempGraph.getGlobalVariable = function(name)
					{
						if (name == 'page')
						{
							return page.getName();
						}
						else if (name == 'pagenumber')
						{
							return i + 1;
						}
						else if (name == 'pagecount')
						{
							return (this.pages != null) ? this.pages.length : 1;
						}
						
						return graphGetGlobalVariable.apply(this, arguments);
					};
					
					document.body.appendChild(tempGraph.container);
					this.updatePageRoot(page);
					tempGraph.model.setRoot(page.root);
				}
				
				pv = printGraph(tempGraph, pv, i != imax, page.getId());

				if (tempGraph != graph)
				{
					tempGraph.container.parentNode.removeChild(tempGraph.container);
				}
			}
		}
		else
		{
			pv = printGraph(graph);
		}
		
		if (pv == null || pv.wnd == null)
		{
			this.handleError({message: mxResources.get('errorUpdatingPreview')});
		}
		else
		{
			if (pv.mathEnabled)
			{
				var doc = pv.wnd.document;
				
				// Adds asynchronous printing when MathJax finishes rendering
				// via global variable that is checked in math-print.js to
				// avoid generating unsafe-inline script or adding SHA to CSP
				if (!preview)
				{
					pv.wnd.IMMEDIATE_PRINT = true;
				}

				doc.writeln('<script type="text/javascript" src="js/math-print.js"></script>');
			}
			
			pv.closeDocument();

			// Expands fill patterns to inline geometry for vector PDF output
			if (Editor.expandPatternsForPrint && pv.wnd != null)
			{
				var svgs = pv.wnd.document.getElementsByTagName('svg');

				for (var i = 0; i < svgs.length; i++)
				{
					Editor.expandSvgPatterns(svgs[i]);
				}
			}

			// Rewrites page links to point to internal anchors
			Graph.rewritePageLinks(pv.wnd.document, true);
			
			if (!pv.mathEnabled && !preview)
			{
				PrintDialog.printPreview(pv);
			}
		}

		return pv;
	};

	/**
	 * Adds a file drop handler for opening local files.
	 */
	EditorUi.prototype.addFileDropHandler = function(elts)
	{
		// Installs drag and drop handler for files
		if (Graph.fileSupport)
		{
			var dropElt = null;
			
			for (var i = 0; i < elts.length; i++)
			{
				// Setup the dnd listeners
				mxEvent.addListener(elts[i], 'dragleave', function(evt)
				{
					if (dropElt != null)
				    {
				    	dropElt.parentNode.removeChild(dropElt);
				    	dropElt = null;
				    }
					
					evt.stopPropagation();
					evt.preventDefault();
				});
		
				mxEvent.addListener(elts[i], 'dragover', mxUtils.bind(this, function(evt)
				{
					if (this.editor.graph.isEnabled() || urlParams['embed'] != '1')
					{
						if (dropElt == null)
						{
							dropElt = this.highlightElement();
						}
					}

					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(elts[i], 'drop', mxUtils.bind(this, function(evt)
				{
					if (dropElt != null)
				    {
					    dropElt.parentNode.removeChild(dropElt);
					    dropElt = null;
				    }
					
					if (this.editor.graph.isEnabled() || urlParams['embed'] != '1')
					{
						if (evt.dataTransfer.files.length > 0)
						{
							this.hideDialog();
							
							// Never open files in embed mode
							if (urlParams['embed'] == '1')
							{
								this.importFiles(evt.dataTransfer.files, 0, 0, this.maxImageSize, null, null,
									null, null, !mxEvent.isControlDown(evt) && !mxEvent.isShiftDown(evt));
							}
							else
							{
								this.openFiles(evt.dataTransfer.files, true);
							}
						}
						else
						{
							// Handles open special files via text drag and drop
							var data = this.extractGraphModelFromEvent(evt);
							
							// Tries additional and async parsing of text content such as HTML, Gliffy data
							if (data == null)
							{
								var provider = (evt.dataTransfer != null) ? evt.dataTransfer : evt.clipboardData;
							
								if (provider != null)
								{
									if (document.documentMode == 10 || document.documentMode == 11)
									{
										data = provider.getData('Text');
									}
									else
									{
								    	var data = null;
								    	
								    	if (mxUtils.indexOf(provider.types, 'text/uri-list') >= 0)
								    	{
								    		data = evt.dataTransfer.getData('text/uri-list');
								    	}
								    	else
								    	{
								    		data = (mxUtils.indexOf(provider.types, 'text/html') >= 0) ? provider.getData('text/html') : null;
								    	}
										
										if (data != null && data.length > 0)
										{
											var div = document.createElement('div');
								    		div.innerHTML = Graph.sanitizeHtml(data);
		
								    		// Extracts single image
								    		var imgs = div.getElementsByTagName('img');
								    		
								    		if (imgs.length > 0)
								    		{
								    			data = imgs[0].getAttribute('src');
								    		}
										}
										else if (mxUtils.indexOf(provider.types, 'text/plain') >= 0)
										{
											data = provider.getData('text/plain');
										}
									}
									
									if (data != null)
									{
										// Checks for embedded XML in PNG
										if (Editor.isPngDataUrl(data))
										{
											var xml = Editor.extractGraphModelFromPng(data);
											
											if (xml != null && xml.length > 0)
											{
												this.openLocalFile(xml, null, true);
											}
										}
										else if (this.isRemoteFileFormat(data))
										{
											if (this.isOffline())
											{
												this.showError(mxResources.get('error'), mxResources.get('notInOffline'));
											}
											else
											{
												new mxXmlRequest(OPEN_URL, 'format=xml&data=' + encodeURIComponent(data)).send(mxUtils.bind(this, function(req)
												{
													if (req.getStatus() >= 200 && req.getStatus() <= 299)
													{
														this.openLocalFile(req.getText(), null, true);
													}
													else
													{
														this.showError(mxResources.get('error'), req.getStatus() == 413? mxResources.get('diagramTooLarge') :
																			mxResources.get('unknownError'));
													}
												}));
											}
										}
										else if (/^https?:\/\//.test(data))
										{
											if (this.getCurrentFile() == null)
											{
												window.location.hash = '#U' + encodeURIComponent(data);
											}
											else
											{
												window.geOpenWindow(((mxClient.IS_CHROMEAPP) ?
													(EditorUi.drawHost + '/') : 'https://' + location.host + '/') +
													window.location.search + '#U' + encodeURIComponent(data));
											}
										}
									}
								}
							}
							else
							{
								this.openLocalFile(data, null, true);
							}
						}
					}

					evt.stopPropagation();
					evt.preventDefault();
				}));
			}
		}
	};
	
	/**
	 * Highlights the given element
	 */
	EditorUi.prototype.highlightElement = function(elt)
	{
		var x = 0;
		var y = 0;
		var w = 0;
		var h = 0;

		if (elt == null)
		{
			var b = document.body;
			var d = document.documentElement;

			if (b == null && d == null)
			{
				return null;
			}

			w = (((b != null) ? b.clientWidth : 0) || d.clientWidth) - 3;
			h = Math.max((b != null) ? b.clientHeight : 0, d.clientHeight) - 3;
		}
		else
		{
			var rect = elt.getBoundingClientRect();
			x = rect.top;
			y = rect.left;
			w = rect.width;
			h = rect.height;
		}

		var hl = document.createElement('div');
		hl.style.zIndex = mxPopupMenu.prototype.zIndex + 2;
		hl.style.border = '3px dotted rgb(254, 137, 12)';
		hl.style.pointerEvents = 'none';
		hl.style.position = 'absolute';
		hl.style.top = x + 'px';
		hl.style.left = y + 'px';
		hl.style.width = Math.max(0, w - 3) + 'px';
		hl.style.height = Math.max(0, h - 3) + 'px';

		if (elt != null && elt.parentNode == this.editor.graph.container)
		{
			this.editor.graph.container.appendChild(hl);
		}
		else if (document.body != null)
		{
			document.body.appendChild(hl);
		}
		else
		{
			return null;
		}

		return hl;
	};
	
	/**
	 * Highlights the given element
	 */
	EditorUi.prototype.stringToCells = function(xml)
	{
		var doc = mxUtils.parseXml(xml);
		var node = this.editor.extractGraphModel(doc.documentElement);
		var cells = [];
		
		if (node != null)
		{
			var codec = new mxCodec(node.ownerDocument);
			var model = new mxGraphModel();
			codec.decode(node, model);
			
			var parent = model.getChildAt(model.getRoot(), 0);
			
			for (var j = 0; j < model.getChildCount(parent); j++)
			{
				cells.push(model.getChildAt(parent, j));
			}
		}
		
		return cells;
	};
	
	/**
	 * Opens the given files in the editor.
	 */
	EditorUi.prototype.openFileHandle = function(data, name, file, temp, fileHandle, editable, done)
	{
		if (name != null && name.length > 0)
		{
			if ((!Editor.useCanvasForExport && /(\.png)$/i.test(name)) ||
				/(\.pdf)$/i.test(name))
			{
				name = name.substring(0, name.length - 4);
				
				if (!/(\.drawio)$/i.test(name))
				{
					name = name + '.drawio';
				}
			}
			
			var handleResult = mxUtils.bind(this, function(xml)
			{
				var dot = name.lastIndexOf('.');
				
				if (dot >= 0)
				{
					name = name.substring(0, name.lastIndexOf('.')) + '.drawio';
				}
				else
				{
					name = name + '.drawio';
				}
				
				if (xml.substring(0, 10) == '<mxlibrary')
				{
					// Creates new temporary file if library is dropped in splash screen
					if (this.getCurrentFile() == null && urlParams['embed'] != '1')
					{
						this.openLocalFile(this.emptyDiagramXml, this.defaultFilename, temp);
					}

    				try
	    			{
    					this.loadLibrary(new LocalLibrary(this, xml, name));
						this.showSidebar();
	    			}
    				catch (e)
	    			{
	    				this.handleError(e, mxResources.get('errorLoadingFile'));
	    			}
				}
				else
				{
					this.openLocalFile(xml, name, temp, null, null, null, done);
				}
			});
			
			if  (EditorUi.isVisioFilename(name))
			{
				this.importVisio(file, mxUtils.bind(this, function(xml)
				{
					this.spinner.stop();
					handleResult(xml);
				}));
			}
			else if (/(\.*<graphml )/.test(data)) 
			{
				this.importGraphML(data, mxUtils.bind(this, function(xml)
				{
					this.spinner.stop();
					handleResult(xml);
				}));
			}
			else if (Graph.fileSupport && new XMLHttpRequest().upload &&
				this.isRemoteFileFormat(data, name))
			{
				if (this.isOffline())
				{
					this.spinner.stop();
					this.showError(mxResources.get('error'), mxResources.get('notInOffline'));
				}
				else
				{
					this.parseFile(file, mxUtils.bind(this, function(xhr)
					{
						if (xhr.readyState == 4)
						{
							this.spinner.stop();
							
							if (xhr.status >= 200 && xhr.status <= 299)
							{
								handleResult(xhr.responseText);
							}
							else
							{
								this.handleError({message: mxResources.get((xhr.status == 413) ?
									'drawingTooLarge' : 'invalidOrMissingFile')},
									mxResources.get('errorLoadingFile'));
							}
						}
					}));
				}
			}
			else if (this.isLucidChartData(data))
			{
				if (/(\.json)$/i.test(name))
				{
					name = name.substring(0, name.length - 5) + '.drawio';
				}

				// LATER: Add import step that produces cells and use callback
				this.convertLucidChart(data, mxUtils.bind(this, function(xml)
				{
					this.spinner.stop();
					this.openLocalFile(xml, name, temp, null, null, null, done);
				}), mxUtils.bind(this, function(e)
				{
					this.spinner.stop();
					this.handleError(e);
				}));
			}
			else if (data.substring(0, 10) == '<mxlibrary')
			{
				this.spinner.stop();
				
				// Creates new temporary file if library is dropped in splash screen
				if (this.getCurrentFile() == null && urlParams['embed'] != '1')
				{
					this.openLocalFile(this.emptyDiagramXml, this.defaultFilename, temp);
				}
				
				try
    			{
    				this.loadLibrary(new LocalLibrary(this, data, file.name));
					this.showSidebar();
    			}
    			catch (e)
    			{
    				this.handleError(e, mxResources.get('errorLoadingFile'));
    			}
			}
			else if (data.indexOf('PK') == 0)
			{
				this.importZipFile(file, mxUtils.bind(this, function(xml)
				{
					this.spinner.stop();
					handleResult(xml);
				}), mxUtils.bind(this, function()
				{
					this.spinner.stop();
					this.openLocalFile(data, name, temp, null, null, null, done);
				}));
			}
			else
			{
				if (file.type.substring(0, 9) == 'image/png')
				{
					data = this.extractGraphModelFromPng(data);
				}
				else if (file.type == 'application/pdf')
	    		{
					var xml = Editor.extractGraphModelFromPdf(data);
					
					if (xml != null)
					{
						fileHandle = null;
						temp = true;
						data = xml;
					}
	    		}
				
				this.spinner.stop();
				this.openLocalFile(data, name, temp, fileHandle,
					(fileHandle != null) ? file : null, editable, done);
			}
		}
	};
	
	/**
	 * Opens the given files in the editor.
	 */
	EditorUi.prototype.openFiles = function(files, temp, done)
	{
		if (this.spinner.spin(document.body, mxResources.get('loading')))
		{
			for (var i = 0; i < files.length; i++)
			{
				(mxUtils.bind(this, function(file)
				{
					var reader = new FileReader();

					reader.onload = mxUtils.bind(this, function(e)
					{
						try
						{
							this.openFileHandle(e.target.result, file.name, file,
								temp, null, null, done);
						}
						catch (e)
						{
							this.handleError(e);
						}
					});

					reader.onerror = mxUtils.bind(this, function(e)
					{
						this.spinner.stop();
						this.handleError(e);
						window.openFile = null;
					});

					if ((file.type.substring(0, 5) === 'image' ||
						file.type === 'application/pdf') &&
						file.type.substring(0, 9) !== 'image/svg')
					{
						reader.readAsDataURL(file);
					}
					else
					{
						reader.readAsText(file);
					}
				}))(files[i]);
			}
		}
	};

	/**
	 * Shows the layers dialog if the graph has more than one layer.
	 */
	EditorUi.prototype.openLocalFile = function(data, name, temp, fileHandle, desc, editable, done)
	{
		var currentFile = this.getCurrentFile();

		var fn = mxUtils.bind(this, function()
		{
			window.openFile = null;

			if (name == null && this.getCurrentFile() != null && this.isDiagramEmpty())
			{
				var doc = mxUtils.parseXml(data);

				if (doc != null)
				{
					this.editor.setGraphXml(doc.documentElement);
					this.editor.graph.selectAll();
				}
			}
			else
			{
				this.fileLoaded(new LocalFile(this, data,
					name || this.defaultFilename, temp,
					fileHandle, desc, editable));
			}

			if (done != null)
			{
				done();
			}
		});

		if (data != null && data.length > 0)
		{
			if (currentFile == null || (!currentFile.isModified() &&
				(mxClient.IS_CHROMEAPP || EditorUi.isElectronApp ||
				fileHandle != null || this.isDiagramEmpty())))
			{
				fn();
			}
			else if ((mxClient.IS_CHROMEAPP || EditorUi.isElectronApp) &&
				currentFile != null && currentFile.isModified())
			{
				this.confirm(mxResources.get('allChangesLost'), null, fn,
					mxResources.get('cancel'), mxResources.get('discardChanges'));
			}
			else
			{
				window.openFile = new OpenFile(function()
				{
					window.openFile = null;
				});

				window.openFile.setData(data, name, temp);

				var fallback = mxUtils.bind(this, function()
				{
					if (currentFile != null && currentFile.isModified())
					{
						this.confirm(mxResources.get('allChangesLost'), null, fn,
							mxResources.get('cancel'), mxResources.get('discardChanges'));
					}
					else
					{
						fn();
					}
				});

				if (urlParams['openInSameWin'] == '1' || navigator.standalone)
				{
					fallback();
				}
				else
				{
					this.showDialog(new PopupDialog(this, this.getUrl(),
						null, fallback).container, 340, 140, true, true);
				}
			}
		}
		else
		{
			throw new Error(mxResources.get('notADiagramFile'));
		}
	};
	
	/**
	 * Returns a list of all shapes used in the current file.
	 */
	EditorUi.prototype.getBasenames = function()
	{
		var basenames = {};

		if (this.pages != null)
		{
			for (var i = 0; i < this.pages.length; i++)
			{
				this.updatePageRoot(this.pages[i]);
				this.addBasenamesForCell(this.pages[i].root, basenames);
			}
		}
		else
		{
			this.addBasenamesForCell(this.editor.graph.model.getRoot(), basenames);
		}
		
		var result = [];
		
		for (var key in basenames)
		{
			result.push(key);
		}
		
		return result;
	};
		
	/**
	 * Returns a list of all shapes used in the current file.
	 */
	EditorUi.prototype.addBasenamesForCell = function(cell, basenames)
	{
		function addName(name)
		{
			if (name != null)
			{
				// LATER: Check if this case exists
				var dot = name.lastIndexOf('.');
				
				if (dot > 0)
				{
					name = name.substring(dot + 1, name.length);
				}
				
				if (basenames[name] == null)
				{
					basenames[name] = true;
				}
			}
		};
		
		var graph = this.editor.graph;
		var style = graph.getCellStyle(cell);
		var shape = style[mxConstants.STYLE_SHAPE];
		addName(mxStencilRegistry.getBasenameForStencil(shape));
		
		// Adds package names for markers in edges
		if (graph.model.isEdge(cell))
		{
			addName(mxMarker.getPackageForType(style[mxConstants.STYLE_STARTARROW]));
			addName(mxMarker.getPackageForType(style[mxConstants.STYLE_ENDARROW]));
		}

		var childCount = graph.model.getChildCount(cell);
		
		for (var i = 0; i < childCount; i++)
		{
			this.addBasenamesForCell(graph.model.getChildAt(cell, i), basenames);
		}
	};
	
	/**
	 * Shows the layers dialog if the graph has more than one layer.
	 */
	EditorUi.prototype.setGraphEnabled = function(enabled)
	{
		this.diagramContainer.style.visibility = (enabled) ? '' : 'hidden';
		this.formatContainer.style.visibility = this.diagramContainer.style.visibility;
		this.sidebarContainer.style.display = (enabled) ? '' : 'none';
		this.hsplit.style.display = this.sidebarContainer.style.display;
		this.editor.graph.setEnabled(enabled);
		
		if (this.tabContainer != null)
		{
			this.tabContainer.style.visibility = this.diagramContainer.style.visibility;
		}
		
		if (!enabled)
		{
			this.hideWindows();
		}

		this.editor.graph.sizeDidChange();
		this.resetScrollbars();
	};
	
	/**
	 * Restores the current page's stored initial view (DiagramPage.getViewBox)
	 * if present, otherwise falls back to the default initialFitDiagram. The
	 * authored zoom is preserved and the view is centred on the captured
	 * region; the scale is only reduced when the region does not fit the
	 * current window (never increased), so the same view reproduces across
	 * window sizes. Used by the fitDiagramOnLoad / fitDiagramOnPage paths.
	 */
	EditorUi.prototype.fitInitialView = function(maxScale)
	{
		var graph = this.editor.graph;
		var page = this.currentPage;
		var vb = (page != null) ? page.getViewBox() : null;
		var container = graph.container;

		// Requires a laid-out container; otherwise the scale math below would
		// divide by a zero client size and zoom to 0.
		if (vb != null && container.clientWidth > 0 && container.clientHeight > 0)
		{
			var cw = container.clientWidth;
			var ch = container.clientHeight;

			// Scale at which the whole captured region fits. The stored scale
			// (authored zoom) is preserved and only clamped down to this when
			// the region is too large for the current window.
			var fitScale = Math.min(cw / vb.width, ch / vb.height);
			var scale = (vb.scale != null) ? Math.min(vb.scale, fitScale) : fitScale;

			graph.zoomTo(scale, null, null, mxUtils.hasScrollbars(container));

			if (mxUtils.hasScrollbars(container))
			{
				// Centres the captured region in the viewport (same math as
				// Graph.fitWindow, but with our preserved scale).
				var t = graph.view.translate;
				var s = graph.view.scale;
				container.scrollLeft = (vb.x + vb.width / 2 + t.x) * s - cw / 2;
				container.scrollTop = (vb.y + vb.height / 2 + t.y) * s - ch / 2;
			}
		}
		else
		{
			this.initialFitDiagram(maxScale);
		}
	};

	/**
	 * Shows the layers dialog if the graph has more than one layer.
	 */
	EditorUi.prototype.initializeEmbedMode = function()
	{
		this.setGraphEnabled(false);
		var parent = this.embedMessageSource || window.opener || window.parent;

		if (parent != window)
		{
			if (urlParams['spin'] != '1' || this.spinner.spin(document.body, mxResources.get('loading')))
			{
				var initialized = false;

				this.installMessageHandler(mxUtils.bind(this, function(xml, evt, modified, convertToSketch)
				{
					if (!initialized)
					{
						initialized = true;
						
						this.spinner.stop();
						this.addEmbedButtons();
						this.setGraphEnabled(true);
					}
					
					if (xml == null || xml.length == 0)
					{
						xml = this.emptyDiagramXml;
					}
					
					// Creates temporary file for diff sync in embed mode
					this.setCurrentFile(new EmbedFile(this, xml, {}));
					this.mode = App.MODE_EMBED;
					this.setFileData(xml);

					// Fits diagram to window
					if (Editor.fitDiagramOnLoad)
					{
						this.fitInitialView();
					}
					
					// TODO: Check if cellsInserted should be fired instead here
					if (convertToSketch)
					{
						try
						{
							//Disable grid and page view
							var graph = this.editor.graph;
							graph.setGridEnabled(false);
							graph.pageVisible = false;
							var cells = graph.model.cells;
							
							//Add sketch style and font to all cells
							for (var id in cells)
							{
								var cell = cells[id];
								
								if (cell != null && cell.style != null)
								{
									cell.style += ';sketch=1;' + (cell.style.indexOf('fontFamily=') == -1 || cell.style.indexOf('fontFamily=Helvetica;') > -1? 
											'fontFamily=Architects Daughter;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DArchitects%2BDaughter;' : '');
								}
							}
						}
						catch(e)
						{
							console.log(e); //Ignore
						}
					}
					
					if (!this.editor.isChromelessView())
					{
						this.showLayersDialog();
					}
					else if (this.editor.graph.isLightboxView())
					{
						this.lightboxFit();
					}
					
					if (this.chromelessResize)
					{
						this.chromelessResize();
					}
	
					this.editor.undoManager.clear();
					this.editor.modified = (modified != null) ? modified : false;
					this.updateUi();
					
					// Workaround for no initial focus in FF
					// (does not work in Conf Cloud with FF)
					if (window.self !== window.top && !this.noAutoFocus)
					{
						window.focus();
					}
					
					if (this.format != null)
					{
						this.format.refresh();
					}
				}));
			}
		}
	};
	
	/**
	 * Shows the layers dialog if the graph has more than one layer.
	 */
	EditorUi.prototype.showLayersDialog = function()
	{
		if (this.editor.graph.getModel().getChildCount(this.editor.graph.getModel().getRoot()) > 1)
		{
			if (this.actions.layersWindow == null)
			{
				this.actions.get('layers').funct();
			}
			else
			{
				this.actions.layersWindow.window.setVisible(true);
			}
		}
	};

	/**
	 * Tries to find a public URL for the given file.
	 */
	EditorUi.prototype.getPublicUrl = function(file, fn)
	{
		if (file != null)
		{
			if (this.spinner.spin(document.body, mxResources.get('loading')))
			{
				file.getPublicUrl(mxUtils.bind(this, function(url)
				{
					this.spinner.stop();
					fn(url);
				}));
			}
		}
		else
		{
			fn(null);
		}
	};

	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.createLoadMessage = function(eventName)
	{
		var graph = this.editor.graph;
		var bounds = graph.getGraphBounds();
		var s = graph.view.scale;
		var t = graph.view.translate;

		return {event: eventName, pageVisible: graph.pageVisible, translate: t,
			bounds: bounds, currentPage: this.getSelectedPageIndex(),
			scale: s, page: graph.view.getBackgroundPageBounds(),
			modelBounds: {
				x: bounds.x / s - t.x,
				y: bounds.y / s - t.y,
				width: bounds.width / s,
				height: bounds.height / s
			},
			containerSize: {width: graph.container.clientWidth, height: graph.container.clientHeight,
				offsetWidth: graph.container.offsetWidth, offsetHeight: graph.container.offsetHeight}};
	};
	
	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.sendEmbeddedSvgExport = function(noExit)
	{
		try
		{
			var graph = this.editor.graph;

			if (graph.isEditing())
			{
				graph.stopEditing(!graph.isInvokesStopCellEditing());
			}

			var parent = this.embedMessageSource || window.opener || window.parent;
			
			if (!this.editor.modified)
			{
				if (!noExit)
				{
					parent.postMessage(JSON.stringify({event: 'exit',
						point: this.embedExitPoint}), '*');
				}
			}
			else
			{
				var bg = graph.background;
			
				if (bg == null || bg == mxConstants.NONE)
				{
					bg = this.embedExportBackground;
				}

				this.getEmbeddedSvg(this.getFileData(true, null, null, null, null,
					null, null, null, null, false), graph, null, true,
					mxUtils.bind(this, function(svg)
				{
					parent.postMessage(JSON.stringify({
						event: 'export', point: this.embedExitPoint,
						exit: (noExit != null) ? !noExit : true,
						data: Editor.createSvgDataUri(svg)
					}), '*');
				}), null, null, true, bg, 1, this.embedExportBorder,
					null, this.embedExportTheme);
			}

			if (!noExit)
			{
				this.diagramContainer.removeAttribute('data-bounds');
				Editor.inlineFullscreen = false;
				graph.model.clear();
				this.editor.undoManager.clear();
				this.setBackgroundImage(null);
				this.editor.modified = false;

				if (urlParams['embed'] != '1')
				{
					this.fireEvent(new mxEventObject('editInlineStop'));
				}
			}
		}
		catch (e)
		{
			if (!noExit)
			{
				this.handleError(e);
			}
		}
	};
	
	/**
	 * Resolves once isReady() returns true. The elk/mermaid bundles load
	 * asynchronously (see App.main / bootstrap.js / Devel.js), so a layout or
	 * mermaid request can arrive before the bundle that handles it is ready.
	 * Calls success() immediately if already ready, otherwise polls briefly
	 * before giving up via the optional error().
	 */
	EditorUi.prototype.whenScriptReady = function(isReady, success, error)
	{
		if (isReady())
		{
			success();
			return;
		}

		var attempts = 0;

		var timer = window.setInterval(function()
		{
			if (isReady())
			{
				window.clearInterval(timer);
				success();
			}
			else if (++attempts >= 100) // ~10s at 100ms
			{
				window.clearInterval(timer);

				if (error != null)
				{
					error();
				}
			}
		}, 100);
	};

	/**
	 * The most recently executed layout as a custom-layout array (as accepted
	 * by Graph.createLayouts). Recorded by executeLayoutSpec, ElkLayout.run,
	 * LibavoidRouting.run and the custom layout dialog; replayed by the
	 * Arrange > Layout > Run Last Layout menu item, which is grayed out
	 * while this is null.
	 */
	EditorUi.prototype.lastLayoutSpec = null;

	/**
	 * Resolves a layout spec into a custom-layout array as accepted by
	 * Graph.createLayouts ([{layout, config}, ...] — the format used by the
	 * Layout dialog; see the JSON layout specification). The spec is either:
	 *
	 *   - a custom-layout array, returned as given,
	 *   - a JSON string starting with '[' (as passed on the command line),
	 *   - the libavoid shorthand ('libavoid', or its technical layout name
	 *     'orthogonalEdge') for orthogonal edge routing,
	 *   - 'parallels' (mxParallelEdgeLayout with the Arrange > Layout >
	 *     Parallels defaults), or
	 *   - an ElkLayout.MENU_PRESETS preset name (verticalFlow, horizontalFlow,
	 *     verticalTree, horizontalTree, radialTree, organic — the Arrange >
	 *     Layout menu presets), resolved with the menu's canonical edge
	 *     treatment. Requires the ELK bundle to be loaded.
	 *
	 * Returns null for unknown specs and throws on invalid JSON. This is the
	 * single resolver behind the desktop --layout CLI flag, the embed "layout"
	 * action, the #create hash / load "layout" option (all via
	 * executeLayoutSpec) and the CSV import's # layout line (via doImportCsv).
	 */
	EditorUi.prototype.resolveLayoutList = function(spec)
	{
		if (typeof spec === 'string')
		{
			spec = mxUtils.trim(spec);

			if (spec.charAt(0) == '[')
			{
				return JSON.parse(spec);
			}
			else if (typeof LibavoidRouting !== 'undefined' &&
				(spec === LibavoidRouting.SHORTHAND ||
				spec === LibavoidRouting.LAYOUT_NAME))
			{
				return [{layout: LibavoidRouting.LAYOUT_NAME}];
			}
			else if (spec === 'parallels')
			{
				return [{layout: 'mxParallelEdgeLayout',
					config: {checkOverlap: true}}];
			}
			else if (typeof ElkLayout !== 'undefined' &&
				ElkLayout.MENU_PRESETS != null &&
				ElkLayout.MENU_PRESETS[spec] != null)
			{
				var preset = ElkLayout.MENU_PRESETS[spec];

				// The canonical edge MODE (strict orthogonalEdgeStyle) is
				// layered-only: mrtree wants mode 'auto' (explicit strict
				// renders badly on tree channels — same choice as the Insert >
				// Layout tree containers) and radial/organic want straight
				// spokes, which the pinned 'orthogonal' mode used to break
				// with an orthogonal=1 stamp. Non-layered presets take only
				// the corners half (no visual effect on straight spokes).
				var edge = (preset.algorithm === 'layered') ?
					ElkLayout.CANONICAL_EDGE :
					{corners: (ElkLayout.CANONICAL_EDGE || {}).corners};

				return [{layout: Graph.elkLayoutNameForAlgorithm(preset.algorithm),
					config: Graph.elkOptionsToConfig(preset.options, edge)}];
			}

			return null;
		}

		return (typeof spec === 'object') ? spec : null;
	};

	/**
	 * Returns the layout container to retarget when the user runs a layout,
	 * or null: the selection must be exactly one vertex whose style carries
	 * a replaceable childLayout (the Insert > Layout and Advanced-sidebar
	 * layout boxes, or the legacy tree/flow/circle/organic containers).
	 * Structural childLayouts (tables, stacks/pools, racks) are never
	 * replaced by a layout run.
	 */
	EditorUi.prototype.getSelectedLayoutContainer = function()
	{
		var graph = this.editor.graph;
		var cell = (graph.getSelectionCount() == 1) ?
			graph.getSelectionCell() : null;

		if (cell != null && graph.model.isVertex(cell))
		{
			var childLayout = graph.getCellStyle(cell)['childLayout'];

			if (childLayout != null && childLayout != 'tableLayout' &&
				childLayout != 'stackLayout' && childLayout != 'rack')
			{
				return cell;
			}
		}

		return null;
	};

	/**
	 * Rewrites the childLayout style of the given layout container to the
	 * given spec — a custom-layout array (see resolveLayoutList) or a raw
	 * childLayout value like 'circleLayout' — so running a layout with a
	 * single layout container selected replaces the container's layout
	 * instead of running once (see the callers: ElkLayout.run,
	 * LibavoidRouting.run, the circle and parallels menu items, the custom
	 * layout dialog and executeLayoutSpec). The style change makes the
	 * layout manager run the new layout in the same undoable edit; writing
	 * an unchanged value produces no model change, so the layout is re-run
	 * explicitly to keep the gesture from being a no-op. Throws for specs
	 * that cannot be written (non-arrays, unknown or container-unsafe
	 * layout names, values that would corrupt the style string).
	 */
	EditorUi.prototype.setContainerChildLayout = function(cell, spec)
	{
		var graph = this.editor.graph;
		var value = spec;
		var groupPadding = null;
		var corners = null;

		if (typeof spec !== 'string')
		{
			// A non-array (or empty) spec would serialize to a childLayout
			// that silently kills the container's live layout.
			if (!Array.isArray(spec) || spec.length == 0)
			{
				throw new Error('Invalid layout list: ' + JSON.stringify(spec));
			}

			var list = [];

			for (var i = 0; i < spec.length; i++)
			{
				var entry = spec[i];

				// Not container-safe: mxRadialTreeLayout ignores the parent
				// frame and crashes on delete-triggered re-runs (the reason
				// radial containers had to wait for ELK), and mxOrgChartLayout
				// only exists after loadOrgChartLayouts, so a persisted
				// reference is dead in the next session. mxFastOrganicLayout
				// seeds coincident cells with Math.random and restarts its
				// force sim from the current positions, so every manager
				// re-run rescrambles the diagram (never converges — use
				// elkOrganic instead). mxCircleLayout as JSON misses the
				// getLayout branch's transparent anchor / moveCircle handling
				// that the raw 'circleLayout' string gets, so it re-plants the
				// ring by a constant offset on every run (unbounded drift) —
				// container circle layouts must go through that string form.
				if (entry != null && (entry.layout == 'mxRadialTreeLayout' ||
					entry.layout == 'mxOrgChartLayout' ||
					entry.layout == 'mxFastOrganicLayout' ||
					entry.layout == 'mxCircleLayout'))
				{
					throw new Error('Not supported as childLayout: ' + entry.layout);
				}

				if (entry != null && Graph.elkLayoutAlgorithms[entry.layout] != null)
				{
					var config = {};

					for (var key in entry.config)
					{
						config[key] = entry.config[key];
					}

					// The container itself is the layout root, so the dialog's
					// selection-as-root cell ids make no sense here (and cell
					// ids don't belong in a persistent style).
					delete config.rootCellIds;

					// Container-critical defaults, matching Menus.layoutContainers
					// (explicit values win): pin node sizes so a manual resize
					// isn't overwritten by the next re-run, keep the frame hugging
					// the content if transparentBounds is toggled off, and keep
					// isolated cells in the layered input — the extracted
					// stack-above placement never converges under the manager.
					if (config.resizeNodes == null)
					{
						config.resizeNodes = false;
					}

					if (config.resizeLayoutRoot == null)
					{
						config.resizeLayoutRoot = true;
					}

					if (entry.layout == 'elkLayered' && config.extractIsolated == null)
					{
						config.extractIsolated = false;
					}

					// The manager's re-runs are deliberately non-enforcing for
					// corners (enforceCorners=false in initLayoutManager — a
					// user's per-edge rounded/curved choice survives ordinary
					// edits), so setting a corners config here would only affect
					// edges without an explicit choice. Remember it for the
					// one-shot re-theme below — this gesture explicitly picks
					// the look, and existing edges must follow it.
					if (config.corners != null)
					{
						corners = config.corners;
					}

					// The bridge's precedence is cell style > run option, and a
					// transparentBounds container derives its rendered box from
					// the style alone — a groupPadding that only lives in the
					// config would be inert for the container itself. Mirror it
					// into the container's style below (kept in the config too:
					// harmless there, and it still covers nested compounds
					// without their own style).
					if (config.groupPadding != null)
					{
						groupPadding = String(config.groupPadding);

						if (/[;=]/.test(groupPadding))
						{
							// Would terminate the key or corrupt the value in the
							// key=value; style string.
							throw new Error('Invalid groupPadding: ' + groupPadding);
						}
					}

					entry = {layout: entry.layout, config: config};
				}

				list.push(entry);
			}

			// Validates the list (throws for unknown layout names) so a spec
			// the layout manager cannot build is never written into the style.
			graph.createLayouts(list);
			value = Graph.encodeChildLayout(list);
		}

		if (value.indexOf(';') >= 0)
		{
			// A ';' would terminate the childLayout key and corrupt the style.
			// Encoded lists can't contain one — this guards the raw string
			// path ('circleLayout' and friends).
			throw new Error('Invalid childLayout: ' + value);
		}

		graph.model.beginUpdate();
		try
		{
			var style = graph.model.getStyle(cell);
			graph.setCellStyles('childLayout', value, [cell]);

			if (groupPadding != null)
			{
				graph.setCellStyles('groupPadding', groupPadding, [cell]);
			}

			// One-shot corners re-theme for this explicit gesture, in the
			// same edit as the spec write (converged edges produce no model
			// change). The applyCorners guard keeps a stale vendored bundle
			// from breaking the gesture — the spec still applies, only the
			// re-theme is skipped.
			if (corners != null && typeof ElkLayout !== 'undefined' &&
				typeof ElkLayout.applyCorners === 'function')
			{
				ElkLayout.applyCorners(graph, cell, corners);
			}

			// The style change triggers the layout manager, which runs the new
			// layout inside this edit (or schedules it if it cannot run sync).
			// An unchanged value produces no change to react to — re-run the
			// container's layout explicitly so the action always takes effect.
			// If that run writes changes (out-of-sync container), the manager
			// re-runs once more at endUpdate; the second run converges to an
			// empty write set, while the common converged case stays a clean
			// no-op (no undo step, no modified flag).
			if (graph.model.getStyle(cell) == style && graph.layoutManager != null)
			{
				graph.layoutManager.executeLayout(cell, false);
			}
		}
		finally
		{
			graph.model.endUpdate();
		}
	};

	/**
	 * Runs a layout given as a single spec — see resolveLayoutList for the
	 * accepted formats. Shared by the desktop --layout CLI flag, the embed
	 * "layout" action and the #create hash / load "layout" option. Waits for
	 * the ELK bundle to load before running, records the layout for Arrange >
	 * Layout > Run Last Layout and invokes the optional done callback once
	 * the layout has been applied. retargetSelection lets a single selected
	 * layout container take the spec as its new childLayout (Run Last
	 * Layout); the programmatic callers omit it — a host-triggered
	 * whole-page run must not be hijacked by a transient user selection.
	 */
	EditorUi.prototype.executeLayoutSpec = function(spec, done, retargetSelection)
	{
		var editorUi = this;

		// The ELK bundle may still be loading when a layout is requested -
		// wait for it before resolving (preset names and elk* layouts both
		// need it).
		this.whenScriptReady(function()
		{
			return typeof ElkLayout !== 'undefined' && ElkLayout.MENU_PRESETS != null;
		}, function()
		{
			try
			{
				var list = editorUi.resolveLayoutList(spec);

				if (list != null)
				{
					editorUi.lastLayoutSpec = list;

					// A single selected layout container takes the spec as its
					// new childLayout instead of a one-shot run (same rule as
					// the Arrange > Layout menu items).
					var container = (retargetSelection) ?
						editorUi.getSelectedLayoutContainer() : null;

					if (container != null && Array.isArray(list) &&
						list.length > 0)
					{
						editorUi.setContainerChildLayout(container, list);

						if (done != null)
						{
							done();
						}
					}
					else
					{
						// Same path as the custom layout dialog's Apply (sequence +
						// options), minus the selection scoping (lay out the whole page).
						editorUi.executeLayouts(editorUi.editor.graph.createLayouts(list), done);
					}
				}
				else
				{
					editorUi.handleError(new Error('Unknown layout: ' + spec));
				}
			}
			catch (e)
			{
				editorUi.handleError(e);
			}
		}, function()
		{
			editorUi.handleError(new Error(mxResources.get('serviceUnavailableOrBlocked')));
		});
	};

	/**
	 * Adds the buttons for embedded mode.
	 */
	/**
	 * Installs a capture-phase keydown listener that forwards the host-configured
	 * pass-through chords (Editor.passThroughKeys) to the embedding app and
	 * suppresses draw.io's own handling of them. Each entry is
	 * {key, ctrl, shift, alt, command}; on a match draw.io posts
	 * {event: 'shortcut', command} to the embed message source. Lets a host
	 * reclaim shortcuts (e.g. Ctrl+P) even across a cross-origin iframe, where it
	 * cannot inject its own key listener.
	 */
	EditorUi.prototype.installPassThroughKeys = function()
	{
		if (Editor.passThroughKeys == null || this.passThroughKeysListener != null)
		{
			return;
		}

		this.passThroughKeysListener = mxUtils.bind(this, function(evt)
		{
			var keys = Editor.passThroughKeys;
			var mod = evt.ctrlKey || evt.metaKey;
			var key = (evt.key != null) ? evt.key.toLowerCase() : '';

			for (var i = 0; i < keys.length; i++)
			{
				var s = keys[i];

				if (key === String(s.key).toLowerCase() && mod === !!s.ctrl &&
					evt.shiftKey === !!s.shift && evt.altKey === !!s.alt)
				{
					evt.preventDefault();
					evt.stopImmediatePropagation();

					if (s.command != null)
					{
						var parent = this.embedMessageSource || window.opener || window.parent;
						parent.postMessage(JSON.stringify({event: 'shortcut',
							command: s.command}), '*');
					}

					return;
				}
			}
		});

		// Capture phase on window so it runs before draw.io's own (bubble-phase)
		// key handlers and can suppress them.
		window.addEventListener('keydown', this.passThroughKeysListener, true);
	};

	EditorUi.prototype.installMessageHandler = function(fn)
	{
		var changeListener = null;
		var ignoreChange = false;
		var autosave = false;
		var lastData = null;
		var embedShadowPages = null;

		// Forward host-claimed keyboard chords (e.g. Ctrl+P) to the embedding app
		// so it can run its own commands. Reads Editor.passThroughKeys, set via
		// the configure config.
		this.installPassThroughKeys();

		var updateStatus = mxUtils.bind(this, function(sender, eventObject)
		{
			if (!this.editor.modified || urlParams['modified'] == '0')
			{
				this.clearStatus();
			}
			else if (urlParams['modified'] != null)
			{
				this.updateStatus(mxUtils.bind(this, function()
				{
					this.editor.setStatus(mxUtils.htmlEntities(
						mxResources.get(urlParams['modified'])));
				}));
			}
		});
		
		this.editor.graph.model.addListener(mxEvent.CHANGE, updateStatus);
		
		// Receives XML message from opener and puts it into the graph
		mxEvent.addListener(window, 'message', mxUtils.bind(this, function(evt)
		{
			var validSource = this.embedMessageSource || window.opener || window.parent;
			
			if (evt.source != validSource)
			{
				return;
			}
			
			var data = evt.data;
			var afterLoad = null;
			var pendingLayout = null;

			var extractDiagramXml = mxUtils.bind(this, function(data)
			{
				if (data != null && typeof data.charAt === 'function' && data.charAt(0) != '<')
				{
					try
					{
						if (Editor.isPngDataUrl(data))
						{
							data = Editor.extractGraphModelFromPng(data);
						}
						else if (data.substring(0, 26) == 'data:image/svg+xml;base64,')
						{
							data = atob(data.substring(26));
						}
						else if (data.substring(0, 24) == 'data:image/svg+xml;utf8,')
						{
							data = data.substring(24);
						}
						
						if (data != null)
						{
							if (data.trim() == '')
							{
								data = null; // nextcloud case
							}
							else if (data.charAt(0) == '%')
							{
								data = decodeURIComponent(data);
							}
							else if (data.charAt(0) != '<')
							{
								data = Graph.decompress(data);
							}
						}
					}
					catch (e)
					{
						// ignore compression errors and use empty data
					}
				}
				
				return data;
			});

			if (urlParams['proto'] == 'json')
			{
				var convertToSketch = false;
				
				try
				{
					data = JSON.parse(data);

					EditorUi.debug('EditorUi.installMessageHandler',
						[this], 'evt', [evt], 'data', [data]);
				}
				catch (e)
				{
					data = null;
				}
				
				try
				{
					var message = data;

					if (data == null)
					{
						// Ignore
						return;
					}
					else if (data.action == 'dialog')
					{
						this.showError((data.titleKey != null) ? mxResources.get(data.titleKey) :
							data.title, (data.messageKey != null) ? mxResources.get(data.messageKey) :
							mxUtils.htmlEntities(data.message), (data.buttonKey != null) ?
							mxResources.get(data.buttonKey) : data.button);
						
						if (data.modified != null)
						{
							this.editor.modified = data.modified;
						}
						
						return;
					}
					else if (data.action == 'layout')
					{
						// Accepts a custom-layout array or any shorthand
						// accepted by resolveLayoutList (preset names,
						// 'libavoid'), same as the load "layout" option.
						this.executeLayoutSpec(data.layouts);

						return;
					}
					else if (data.action == 'prompt')
					{
						this.spinner.stop();
						
						var dlg = new FilenameDialog(this, data.defaultValue || '',
							(data.okKey != null) ? mxResources.get(data.okKey) : data.ok, function(value)
						{
							if (value != null)
							{
								parent.postMessage(JSON.stringify({event: 'prompt', value: value, message: data}), '*');
							}
							else
							{
								parent.postMessage(JSON.stringify({event: 'prompt-cancel', message: data}), '*');
							}
						}, (data.titleKey != null) ? mxResources.get(data.titleKey) : data.title, 
						null, null, null, null, function()
						{
							parent.postMessage(JSON.stringify({event: 'prompt-cancel', message: data}), '*');
						});
						this.showDialog(dlg.container, 300, 80, true, false);
						dlg.init();
						
						return;
					}
					else if (data.action == 'draft')
					{
						var tmp = extractDiagramXml(data.xml);
						this.spinner.stop();
						
						var dlg = new DraftDialog(this, mxResources.get('draftFound',
								[data.name || this.defaultFilename]),
							tmp, mxUtils.bind(this, function()
						{
							this.hideDialog();
							parent.postMessage(JSON.stringify({event: 'draft',
								result: 'edit', message: data}), '*');
						}), mxUtils.bind(this, function()
						{
							this.hideDialog();
							parent.postMessage(JSON.stringify({event: 'draft',
								result: 'discard', message: data}), '*');
						}), (data.editKey) ? mxResources.get(data.editKey) : null,
							(data.discardKey) ? mxResources.get(data.discardKey) : null,
							(data.ignore) ? mxUtils.bind(this, function()
							{
								this.hideDialog();
								parent.postMessage(JSON.stringify({event: 'draft',
									result: 'ignore', message: data}), '*');
							}) : null);
						this.showDialog(dlg.container, 640, 480, true, false, mxUtils.bind(this, function(cancel)
						{
							if (cancel)
							{
								this.actions.get('exit').funct();
							}
						}));
						
						try
						{
							dlg.init();
						}
						catch (e)
						{
							parent.postMessage(JSON.stringify({event: 'draft',
								error: e.toString(), message: data}), '*');
						}
						
						return;
					}
					else if (data.action == 'template')
					{
						this.spinner.stop();
						
						var enableRecentDocs = data.enableRecent == 1;
						var enableSearchDocs = data.enableSearch == 1;
						var enableCustomTemp = data.enableCustomTemp == 1;
						
						var dlg = new NewDialog(this, false, data.templatesOnly? false : data.callback != null,
							mxUtils.bind(this, function(xml, name, url, libs)
						{
							xml = xml || this.emptyDiagramXml;
							
							// LATER: Add autosave option in template message
							if (data.callback != null)
							{
								parent.postMessage(JSON.stringify({event: 'template', xml: xml,
									blank: xml == this.emptyDiagramXml, name: name,
									tempUrl: url, libs: libs, builtIn: true,
									message: data}), '*');
							}
							else
							{
								fn(xml, evt, xml != this.emptyDiagramXml, data.toSketch);
								
								// Workaround for status updated before modified applied
								if (!this.editor.modified)
								{
									this.clearStatus();
								}
							}
						}), null, null, null, null, null, null, null, 
						enableRecentDocs? mxUtils.bind(this, function(recentReadyCallback) 
						{
							this.remoteInvoke('getRecentDiagrams', [null], null, recentReadyCallback, function()
							{
								recentReadyCallback(null, 'Network Error!');
							});
						}) : null, 
						enableSearchDocs?  mxUtils.bind(this, function(searchStr, searchReadyCallback) 
						{
							this.remoteInvoke('searchDiagrams', [searchStr, null], null, searchReadyCallback, function()
							{
								searchReadyCallback(null, 'Network Error!');
							});
						}) : null, 
						mxUtils.bind(this, function(url, info, name) 
						{
							//If binary files are possible, we can get the file content using remote invokation, imported it, and send final mxFile back
							parent.postMessage(JSON.stringify({event: 'template', docUrl: url, info: info,
								name: name}), '*');
						}), null, null,
						enableCustomTemp? mxUtils.bind(this, function(customTempCallback) 
						{
							this.remoteInvoke('getCustomTemplates', null, null, customTempCallback, function()
							{
								customTempCallback({}, 0); //ignore error by sending empty templates
							});
						}) : null, data.withoutType == 1, null, data.templatesOnly);
	
						this.showDialog(dlg.container, 620, 460, true, false, mxUtils.bind(this, function(cancel)
						{
							if (this.sidebar != null)
							{
								this.sidebar.hideTooltip();
							}

							if (cancel && !data.noExitOnCancel)
							{
								this.actions.get('exit').funct();
							}
						}));
						dlg.init();
						
						return;
					}
					else if (data.action == 'textContent')
					{
						//TODO Remove this message and use remote invokation instead
						var allPagesTxt = this.getDiagramTextContent();
						parent.postMessage(JSON.stringify({event: 'textContent',
							data: allPagesTxt, message: data}), '*');
						return;
					}
					else if (data.action == 'status')
					{
						this.updateStatus(mxUtils.bind(this, function()
						{
							if (data.messageKey != null)
							{
								this.editor.setStatus(mxUtils.htmlEntities(
									mxResources.get(data.messageKey)));
							}
							else if (data.message != null)
							{
								this.editor.setStatus(mxUtils.htmlEntities(data.message));
							}
						}));
						
						if (data.modified != null)
						{
							this.editor.modified = data.modified;
						}
						
						return;
					}
					else if (data.action == 'spinner')
					{
						var msg = (data.messageKey != null) ? mxResources.get(data.messageKey) : data.message;
						
						if (data.show != null && !data.show)
						{
							this.spinner.stop();
						}
						else
						{
							this.spinner.spin(document.body, msg)
						}
	
						return;
					}
					else if (data.action == 'exit')
					{
						this.actions.get('exit').funct();

						return;
					}
					else if (data.action == 'viewport')
					{
						if (data.viewport != null)
						{
							var graph = this.editor.graph;
							var tx = graph.view.translate.x;
							var ty = graph.view.translate.y;
							this.embedViewport = data.viewport;
							graph.refresh();
							this.diagramContainer.scrollTop -= (ty - graph.view.translate.y) * graph.view.scale;
							this.diagramContainer.scrollLeft -= (tx - graph.view.translate.x) * graph.view.scale;
							this.fireEvent(new mxEventObject('embedViewportChanged'));
						}

						return;
					}
					else if (data.action == 'invokeAction')
					{
						var action = this.actions.get(data.actionName);

						if (action != null)
						{
							action.funct();
						}

						return;
					}
					else if (data.action == 'resetEditor')
					{
						var graph = this.editor.graph;

						if (graph.isEditing())
						{
							graph.stopEditing(false);
						}

						this.hideCurrentMenu();
						graph.popupMenuHandler.hideMenu();
						graph.clearSelection();

						return;
					}
					else if (data.action == 'fit')
					{
						var graph = this.editor.graph;
						var prev = graph.maxFitScale;
						graph.maxFitScale = (data.maxScale != null) ? data.maxScale : 1;
						graph.fit((data.border != null) ? data.border : 16, null, null, null, null, true);
						graph.maxFitScale = prev;

						var msg = this.createLoadMessage('fit');
						msg.message = data;
						parent.postMessage(JSON.stringify(msg), '*');

						return;
					}
					else if (data.action == 'fullscreenChanged')
					{
						var scrollState = null;

						try
						{
							var temp = this.diagramContainer.getAttribute('data-scrollState');

							if (temp != null) 
							{
								this.diagramContainer.removeAttribute('data-scrollState');
								scrollState = JSON.parse(temp);
							}
						}
						catch (e)
						{
							// ignore
						}

						Editor.inlineFullscreen = data.value;
						this.fireEvent(new mxEventObject('inlineFullscreenChanged'));

						if (scrollState != null)
						{
							this.restoreScrollState(scrollState);
						}

						return;
					}
					else if (data.action == 'snapshot')
					{
						this.sendEmbeddedSvgExport(true);

						return;
					}
					else if (data.action == 'export')
					{
						if (data.format == 'png' || data.format == 'xmlpng')
						{
							if ((data.spin == null && data.spinKey == null) || this.spinner.spin(document.body,
								(data.spinKey != null) ? mxResources.get(data.spinKey) : data.spin))
							{
								var xml = (data.xml != null) ? data.xml : this.getFileData(true);
								this.editor.graph.setEnabled(false);
								var graph = this.editor.graph;
								
								var postDataBack = mxUtils.bind(this, function(uri, svg)
								{
									if (data.withSvg)
									{
										data.withSvg = false;
										this.getEmbeddedSvg(xml, this.editor.graph, null, true, function(svg)
										{
											postDataBack(uri, svg);
										}, null, null, data.embedImages, this.editor.graph.background,
										data.scale, data.border, data.shadow, 'auto', null, data.embedFonts);
										return;
									}

									this.editor.graph.setEnabled(true);
									this.spinner.stop();
									
									var msg = this.createLoadMessage('export');
									msg.format = data.format;
									msg.message = message;
									msg.data = uri;
									msg.svg = svg;
									msg.xml = xml;
									parent.postMessage(JSON.stringify(msg), '*');
								});
								
								var processUri = mxUtils.bind(this, function(uri)
								{
									if (uri == null)
									{
										uri = Editor.blankImage;
									}
									
							   	    if (data.format == 'xmlpng')
							   	    {
							   	    	uri = Editor.writeGraphModelToPng(uri, 'tEXt', 'mxfile',
							   	    		encodeURIComponent(xml));
							   	    }
							   	    	
									// Removes temporary graph from DOM
							   	    if (graph != this.editor.graph)
									{
										graph.container.parentNode.removeChild(graph.container);
									}
					   	   	    	
							   	    postDataBack(uri);
								});
						
								var pageId = data.pageId || (this.pages != null? ((data.currentPage) ?
									this.currentPage.getId() : this.pages[0].getId()) : null);
								
								if (this.editor.isExportToCanvas())
								{
									var graphReady = mxUtils.bind(this, function()
									{
										// Exports PNG for first/specific page while other page is visible by creating a graph
										// LATER: Add caching for the graph or SVG while not on first page
										if (this.pages != null && this.currentPage.getId() != pageId)
										{
											var graphGetGlobalVariable = graph.getGlobalVariable;
											graph = this.createTemporaryGraph(graph.getStylesheet());
											var page;
											
											for (var i = 0; i < this.pages.length; i++)
											{
												if (this.pages[i].getId() == pageId)
												{
													page = this.updatePageRoot(this.pages[i]);
													break;
												}
											}
											
											//If pageId info is incorrect
											if (page == null)
											{
												page = this.currentPage; 
											}
									
											graph.getGlobalVariable = function(name)
											{
												if (name == 'page')
												{
													return page.getName();
												}
												else if (name == 'pagenumber')
												{
													return 1;
												}
												
												return graphGetGlobalVariable.apply(this, arguments);
											};
									
											document.body.appendChild(graph.container);
											graph.model.setRoot(page.root);
										}
		
										// Set visible layers based on message setting
										if (data.layerIds != null)
										{
											var graphModel = graph.model;
											var layers = graphModel.getChildCells(graphModel.getRoot());
											var layerIdsMap = {};
											
											for (var i = 0; i < data.layerIds.length; i++)
											{
												layerIdsMap[data.layerIds[i]] = true;
											}
		
											for (var i = 0; i < layers.length; i++)
											{
												graphModel.setVisible(layers[i], layerIdsMap[layers[i].id] || false);
											}
										}

										var theme = null;

										if (data.keepTheme)
										{
											theme = Editor.isDarkMode() ? 'dark' : 'light';
										}
										
										this.editor.exportToCanvas(mxUtils.bind(this, function(canvas)
										{
											processUri(canvas.toDataURL('image/png'));
										}), data.width, null, data.background, mxUtils.bind(this, function()
										{
											processUri(null);
										}), null, null, data.scale, data.transparent, data.shadow, null,
											graph, data.border, null, data.grid, theme, data.size);
									});

									// Uses optional XML from incoming message
									if (data.xml != null && data.xml.length > 0)
									{
										ignoreChange = true;
										this.setFileData(xml);
										ignoreChange = false;
									}

									graphReady();
								}
								else
								{
									// Data from server is base64 encoded to avoid binary XHR
									// Double encoding for XML arg is needed for UTF8 encoding
							       	var req = new mxXmlRequest(EXPORT_URL, 'format=png&embedXml=' +
							       		((data.format == 'xmlpng') ? '1' : '0') + 
							       		(pageId != null? '&pageId=' + pageId : '') +
							       		(data.layerIds != null && data.layerIds.length > 0?
										'&extras=' + encodeURIComponent(JSON.stringify({layerIds: data.layerIds})) : '') +
							       		(data.scale != null? '&scale=' + data.scale : '') +'&base64=1&xml=' +
							       		encodeURIComponent(xml));
	
									req.send(mxUtils.bind(this, function(req)
									{
										// Temp graph was never created at this point so we can
										// skip processUri since it already contains the XML
										if (req.getStatus() >= 200 && req.getStatus() <= 299)
										{
											postDataBack('data:image/png;base64,' + req.getText());
										}
										else
										{
											processUri(null);
										}
									}), mxUtils.bind(this, function()
									{
										processUri(null);
									}));
								}
							}
						}
						else
						{
							var graphReady = mxUtils.bind(this, function()
							{
								var msg = this.createLoadMessage('export');
								
								// Attaches incoming message
								msg.message = data;
								
								// Forces new HTML format if pages exists
								if (data.format == 'html2' || (data.format == 'html' && (urlParams['pages'] != '0' ||
									(this.pages != null && this.pages.length > 1))))
								{
									var node = this.getXmlFileData();
									msg.xml = mxUtils.getXml(node);
									msg.data = this.getFileData(null, null, true, null, null, null, node);
									msg.format = data.format;
								}
								else if (data.format == 'html')
								{
									var xml = this.editor.getGraphXml();
									msg.data = this.getHtml(xml, this.editor.graph);
									msg.xml = mxUtils.getXml(xml);
									msg.format = data.format;
								}
								else if (data.format == 'xml')
								{
									msg.xml = this.getFileData(true);
									msg.format = data.format;
									parent.postMessage(JSON.stringify(msg), '*');

									return;
								}
								else if (data.format == 'json')
								{
									msg.format = data.format;
									msg.data = this.createJsonForExport(data.allPages != false,
										data.includeData == true, data.compressed == true,
										data.selection == true);
									parent.postMessage(JSON.stringify(msg), '*');

									return;
								}
								else
								{
									// Creates a preview with no alt text for unsupported browsers
									mxSvgCanvas2D.prototype.foAltText = null;
									
									var bg = (data.background != null) ? data.background : this.editor.graph.background;
									
									if (bg == mxConstants.NONE)
									{
										bg = null;
									}
		
									msg.xml = this.getFileData(true, null, null, null, null,
										null, null, null, null, false);
									msg.format = 'svg';
									
									var postResult = mxUtils.bind(this, function(svg)
									{
										this.editor.graph.setEnabled(true);
										this.spinner.stop();
									
										msg.data = data.asText? svg : Editor.createSvgDataUri(svg);
										parent.postMessage(JSON.stringify(msg), '*');
									});

									var theme = 'auto';

									if (data.keepTheme)
									{
										theme = Editor.isDarkMode() ? 'dark' : 'light';
									}

									if (data.theme != null)
									{
										theme = data.theme;
									}
									
									if (data.format == 'xmlsvg')
									{
										if ((data.spin == null && data.spinKey == null) || this.spinner.spin(document.body,
											(data.spinKey != null) ? mxResources.get(data.spinKey) : data.spin))
										{
											var theme = null;

											if (this.isAutoDarkMode() || Editor.isDarkMode())
											{
												theme = 'auto';
											}

											if (data.theme != null)
											{
												theme = data.theme;
											}

											this.getEmbeddedSvg(msg.xml, this.editor.graph, null, true, postResult, null, null,
												data.embedImages, bg, data.scale, data.border, data.shadow, theme,
												data.embedCellMetadata, data.embedFonts);
										}
									}
									else
									{
										if ((data.spin == null && data.spinKey == null) || this.spinner.spin(document.body,
											(data.spinKey != null) ? mxResources.get(data.spinKey) : data.spin))
										{
											this.editor.graph.setEnabled(false);
											var imgExport = data.embedCellMetadata ?
												this.editor.graph.createSvgImageExport(false, true) : null;
											var svgRoot = this.editor.graph.getSvg(bg, data.scale, data.border, null, null,
												null, null, imgExport, null, this.editor.graph.shadowVisible || data.shadow,
												null, theme);
											
											if (this.editor.graph.shadowVisible || data.shadow)
											{
												this.editor.graph.addSvgShadow(svgRoot);
											}

											this.embedFonts(svgRoot, mxUtils.bind(this, function(svgRoot)
											{
												if (data.embedImages || data.embedImages == null)
												{
													this.editor.convertImages(svgRoot, mxUtils.bind(this, function(svgRoot)
													{
														postResult(mxUtils.getXml(svgRoot));
													}));
												}
												else
												{
													postResult(mxUtils.getXml(svgRoot));
												}
											}), data.embedFonts);
										}
									}
									
									return;
								}
		
								parent.postMessage(JSON.stringify(msg), '*');
							});

							// SVG is generated from graph so parse optional XML
							if (data.xml != null && data.xml.length > 0)
							{
								if (this.editor.graph.mathEnabled)
								{
									// Waits for MathJax autoloading and rendering
									var editorOnMathJaxDone = Editor.onMathJaxDone;

									Editor.onMathJaxDone = function()
									{
										editorOnMathJaxDone.apply(this, arguments);
										graphReady();
									};
								}

								ignoreChange = true;
								this.setFileData(data.xml);
								ignoreChange = false;

								if (!this.editor.graph.mathEnabled)
								{
									graphReady();
								}
							}
							else
							{
								graphReady();
							}
						}

						return;
					}
					else if (data.action == 'load')
					{
						convertToSketch = data.toSketch;
						autosave = data.autosave == 1;
						this.embedDiffSync = data.diffSync != null && data.diffSync !== false;
						this.embedDiffSyncPatchOnly = (typeof data.diffSync === 'object' &&
							data.diffSync != null && data.diffSync.patchOnly == true);
						this.embedExportProtocol = data.exportProtocol == true;
						var sourceMetadata = data.sourceMetadata || null;
						// layout: run the requested layout once the diagram is
						// loaded (a preset name or custom-layout JSON, the same
						// format as the standalone "layout" action and the desktop
						// --layout flag). Applied in doLoad before the sync
						// baseline so the laid-out result is the baseline.
						pendingLayout = (data.layout != null) ? data.layout : null;
						this.hideDialog();
						
						if (data.modified != null && urlParams['modified'] == null)
						{
							urlParams['modified'] = data.modified;
						}
						
						if (data.saveAndExit != null && urlParams['saveAndExit'] == null)
						{
							urlParams['saveAndExit'] = data.saveAndExit;
						}
						
						if (urlParams['saveAndExit'] == '1' ||
							urlParams['publishClose'] == '1')
						{
							this.actions.get('save').shortcut = null;

							if (!this.editor.chromeless || this.editor.editable)
							{
								this.keyHandler.bindAction(83, true, 'saveAndExit'); // Ctrl+S

								if (urlParams['noSaveBtn'] != '1')
								{
									this.actions.get('save').shortcut = Editor.ctrlKey + '+' + Editor.shiftKey + '+S';
									this.keyHandler.bindAction(83, true, 'save', true); // Ctrl+Shift+S
								}
							}
						}

						if (data.noSaveBtn != null && urlParams['noSaveBtn'] == null)
						{
							urlParams['noSaveBtn'] = data.noSaveBtn;
						}

						if (data.rough != null)
						{
							var initial = Editor.sketchMode; 
							this.doSetSketchMode(data.rough);

							if (initial != Editor.sketchMode)
							{
								this.fireEvent(new mxEventObject('sketchModeChanged'));
							}
						}

						if (data.dark != null)
						{
							this.setDarkMode(data.dark);
						}
						
						if (data.border != null)
						{
							this.embedExportBorder = data.border;
						}

						if (data.theme != null)
						{
							this.embedExportTheme = data.theme;
						}

						if (data.background != null)
						{
							this.embedExportBackground = data.background;
						}

						if (data.viewport != null)
						{
							this.embedViewport = data.viewport;
						}

						this.embedExitPoint = null;

						if (data.scale != null)
						{
							var customScale = data.scale;
							var scaleBorder = (data.scaleBorder != null) ?
								data.scaleBorder : (this.embedExportBorder || 0);
							var border = (data.border != null) ? data.border : 0;

							afterLoad = mxUtils.bind(this, function()
							{
								var graph = this.editor.graph;
								var bounds = graph.getGraphBounds();

								if (bounds.width > 0 && bounds.height > 0)
								{
									var s = graph.view.scale;
									var x0 = graph.view.translate.x + border -
										bounds.x / s + scaleBorder / customScale;
									var y0 = graph.view.translate.y + border -
										bounds.y / s + scaleBorder / customScale;
									graph.view.scaleAndTranslate(customScale, x0, y0);
								}
							});
						}
						else if (data.fit != null)
						{
							var fitBorder = (data.border != null) ? data.border : 0;
							var fitMaxScale = data.maxFitScale || 1;

							afterLoad = mxUtils.bind(this, function()
							{
								var graph = this.editor.graph;
								var prev = graph.maxFitScale;
								graph.maxFitScale = fitMaxScale;
								graph.fit(fitBorder, null, null, null, null, true);
								graph.maxFitScale = prev;
							});
						}

						if (data.rect != null)
						{
							var border = this.embedExportBorder;
							this.diagramContainer.style.left = Math.max(60, data.rect.left) + 'px';
							this.diagramContainer.style.top = Math.max(40, data.rect.top) + 'px';

							// Inline min width and height
							this.minInlineWidth = data.minWidth;
							this.minInlineHeight = data.minHeight;

							this.diagramContainer.style.border = '2px solid #295fcc';
							this.diagramContainer.style.bottom = '';
							this.diagramContainer.style.right = '';
							
							// Data is extracted diagram in async code
							var maxFitScale = data.maxFitScale;
							var w = data.rect.width + 2 * border;
							var h0 = data.rect.height + 2 * border;

							afterLoad = mxUtils.bind(this, function()
							{
								var ds = mxUtils.getDocumentSize();
								w = Math.min((this.minInlineWidth != null) ? Math.max(
									this.minInlineWidth, w) : w, ds.width - 80);
								var h = Math.min((this.minInlineHeight != null) ? Math.max(
									this.minInlineHeight, h0) : h0, ds.height - 80);
								
								this.diagramContainer.style.width = w + 'px';
								this.diagramContainer.style.height = h + 'px';
								
								var graph = this.editor.graph;
								var prev = graph.maxFitScale;
								graph.maxFitScale = maxFitScale;
								
								graph.fit(2 * border, null, null, null, null, null, h0);
								this.setPageVisible(false);

								if (this.minInlineWidth != null &&
									graph.getGraphBounds().width < this.minInlineWidth)
								{
									var dy = graph.container.scrollTop;
									this.resetScrollbars();
									graph.container.scrollTop = dy;
								}
								
								graph.maxFitScale = prev;
								graph.container.scrollTop -= border;
								graph.container.scrollLeft -= border;

								window.setTimeout(mxUtils.bind(this, function()
								{
									this.fireEvent(new mxEventObject('editInlineStart', 'data', [data]));
									graph.container.focus();
									
									// Moves format window to top of graph
									if (this.formatWindow != null &&
										this.formatWindow.window != null &&
										this.formatWindow.window.isVisible())
									{
										this.formatWindow.window.div.style.top =
											graph.container.style.top;
									}

									// Centers horizontally
									var bounds = graph.getGraphBounds();

									if (graph.container.clientWidth > bounds.width + 2 * border)
									{
										graph.container.scrollLeft = bounds.x + ((bounds.width +
											border) - graph.container.clientWidth) / 2;
									}
								}), 10);
							});
						}
						
						if (data.noExitBtn != null && urlParams['noExitBtn'] == null)
						{
							urlParams['noExitBtn'] = data.noExitBtn;
						}
						
						if (data.title != null && this.buttonContainer != null)
						{
							this.setEmbedTitle(data.title);
						}
						
						try
						{
							if (data.libs)
							{
								this.sidebar.showEntries(data.libs);
							}
						}
						catch(e){}

						if (data.xmlpng != null)
						{
							data = this.extractGraphModelFromPng(data.xmlpng);
						}
						else if (data.descriptor != null)
						{
							data = data.descriptor;

							if (data.format == 'mermaid')
							{
								if (EditorUi.isMermaidSupported())
								{
									// Loads the parsed result (group, raw cells or image)
									// and notifies the parent, regardless of how it was
									// produced below.
									var afterMermaid = mxUtils.bind(this, function(xml)
									{
										fn(xml, evt, null, convertToSketch);

										// Post load event back to parent (doLoad is out of scope here)
										var resp = this.createLoadMessage('load');
										resp.xml = this.getFileData(true, null, null, null,
											null, null, null, null, null, true);
										resp.message = message;
										var parent = this.embedMessageSource || window.opener || window.parent;
										parent.postMessage(JSON.stringify(resp), '*');

										if (sourceMetadata != null && sourceMetadata.key != null &&
											sourceMetadata.value != null)
										{
											var graph = this.editor.graph;
											var root = graph.getModel().getRoot();

											if (root != null)
											{
												graph.getModel().beginUpdate();

												try
												{
													graph.setAttributeForCell(root,
														sourceMetadata.key, sourceMetadata.value);
												}
												finally
												{
													graph.getModel().endUpdate();
												}
											}
										}
									});

									var onMermaidError = mxUtils.bind(this, function(e)
									{
										this.handleError(e);
									});

									if (data.image)
									{
										// Opt in per descriptor with image:true to load the
										// parsed diagram as a static SVG image cell (carrying
										// the mermaid source for re-editing), matching the
										// legacy image insert. Uses the previous mermaid config.
										this.parseMermaidImage(data.data, afterMermaid, onMermaidError);
									}
									else
									{
										this.parseMermaidDiagram(data.data, null, mxUtils.bind(this, function(xml)
										{
											// Opt in per descriptor with wrap:true to wrap the
											// result in the editable mermaid group (a re-openable
											// group carrying the source), matching Insert >
											// Mermaid. Default off for backwards compatibility:
											// existing integrators load the raw parsed cells.
											//
											// normalize:true shifts the wrapped content so the
											// group's padded bounds start at (0,0) — the diagram
											// is loaded as a full file here (not imported at an
											// insert point), so without this the groupPadding
											// spills into negative space off the page origin.
											if (data.wrap)
											{
												xml = mxMermaidToDrawio.wrapGroup(xml, data.data,
													null, {normalize: true});
											}

											afterMermaid(xml);
										}), onMermaidError);
									}
								}
								else
								{
									this.handleError(
										{message: mxResources.get('serviceUnavailableOrBlocked')},
										mxResources.get('errorLoadingFile'));
								}

								return;
							}
						}
						else
						{
							data = data.xml;
						}
					}
					else if (data.action == 'merge')
					{
						var file = this.getCurrentFile();

						if (file != null)
						{
							var tmp = extractDiagramXml(data.xml);

							if (tmp != null && tmp != '')
							{
								file.mergeFile(new LocalFile(this, tmp), mxUtils.bind(this, function()
								{
									// Reset shadow after merge when diff sync is enabled
									if (this.embedDiffSync)
									{
										embedShadowPages = this.clonePages(this.pages);
										lastData = getData();
									}

									parent.postMessage(JSON.stringify({event: 'merge', message: data}), '*');
								}), function(err)
								{
									parent.postMessage(JSON.stringify({event: 'merge', message: data, error: err}), '*');
								});
							}
						}

						return;
					}
					else if (data.action == 'patch')
					{
						var file = this.getCurrentFile();

						if (file != null && data.patch != null)
						{
							try
							{
								ignoreChange = true;
								file.patch([data.patch]);

								// Update shadow to reflect the patched state
								if (this.embedDiffSync && embedShadowPages != null)
								{
									embedShadowPages = this.applyPatches(
										embedShadowPages, [data.patch]);
								}

								lastData = getData();
								ignoreChange = false;

								// Send acknowledgment with checksum
								var resp = {event: 'patch', message: data};
								var currentChecksum = this.getHashValueForPages(this.pages);
								resp.checksum = currentChecksum;

								if (data.checksum != null && data.checksum != currentChecksum)
								{
									resp.checksumMismatch = true;
								}

								parent.postMessage(JSON.stringify(resp), '*');
							}
							catch (e)
							{
								ignoreChange = false;
								parent.postMessage(JSON.stringify({event: 'patch',
									message: data, error: e.message || e.toString()}), '*');
							}
						}

						return;
					}
					else if (data.action == 'getDiff')
					{
						var msg = {event: 'getDiff', message: data};

						if (this.embedDiffSync && embedShadowPages != null)
						{
							var currentPages = this.clonePages(this.pages);
							msg.patch = this.diffPages(embedShadowPages, currentPages);
							msg.checksum = this.getHashValueForPages(currentPages);
						}
						else
						{
							msg.xml = getData();
						}

						parent.postMessage(JSON.stringify(msg), '*');

						return;
					}
					else if (data.action == 'resetDiff')
					{
						if (this.embedDiffSync)
						{
							if (data.xml != null)
							{
								var tmp = extractDiagramXml(data.xml);
								var file = this.getCurrentFile();

								if (tmp != null && tmp != '' && file != null)
								{
									file.mergeFile(new LocalFile(this, tmp), mxUtils.bind(this, function()
									{
										embedShadowPages = this.clonePages(this.pages);
										lastData = getData();
										parent.postMessage(JSON.stringify({event: 'resetDiff',
											message: data, checksum: this.getHashValueForPages(
											this.pages)}), '*');
									}), function(err)
									{
										parent.postMessage(JSON.stringify({event: 'resetDiff',
											message: data, error: err}), '*');
									});
								}
							}
							else
							{
								embedShadowPages = this.clonePages(this.pages);
								lastData = getData();
								parent.postMessage(JSON.stringify({event: 'resetDiff',
									message: data, checksum: this.getHashValueForPages(
									this.pages)}), '*');
							}
						}

						return;
					}
					else if (data.action == 'remoteInvokeReady') 
					{
						this.handleRemoteInvokeReady(parent);
						return;
					}
					else if (data.action == 'remoteInvoke') 
					{
						this.handleRemoteInvoke(data, evt.origin);
						return;
					}
					else if (data.action == 'remoteInvokeResponse')
					{
						this.handleRemoteInvokeResponse(data);
						return;
					}
					else
					{
						// Unknown message must stop execution
						parent.postMessage(JSON.stringify({error: 'unknownMessage', data: JSON.stringify(data)}), '*');
						
						return;
					}
				}
				catch (e)
				{
					// TODO: Block handling of more messages when in error state
					this.handleError(e);
				}
			}
						
			var getData = mxUtils.bind(this, function()
			{
				return (urlParams['pages'] != '0' || (this.pages != null && this.pages.length > 1)) ?
					this.getFileData(true): mxUtils.getXml(this.editor.getGraphXml());
			});
			
			var doLoad = mxUtils.bind(this, function(data, evt)
			{
				ignoreChange = true;
				try
				{
					fn(data, evt, null, convertToSketch);
				}
				catch (e)
				{
					this.handleError(e);
				}
				ignoreChange = false;

				// Assigns a unique cell-ID prefix for this embed editor so cells
				// created here do not collide with cells created in other embed
				// editors of the same file. Without it every embed editor reuses the
				// same incrementing IDs (2, 3, ...) and a merge/diff treats different
				// new cells as the same cell. fileLoaded does this for real files but
				// the embed load path bypasses it.
				this.editor.graph.model.prefix = Editor.guid() + '-';

				// Establishes the sync baseline and sends the load response.
				// Deferred until after the optional layout (below) so the
				// laid-out diagram becomes the baseline (no spurious autosave)
				// and the reported bounds reflect the new positions.
				var afterModel = mxUtils.bind(this, function()
				{
					if (urlParams['modified'] != null)
					{
						this.clearStatus();
					}

					lastData = getData();

					// Initialize shadow pages for diff-based sync
					if (this.embedDiffSync)
					{
						embedShadowPages = this.clonePages(this.pages);
					}

					if (autosave && changeListener == null)
					{
						changeListener = mxUtils.bind(this, function(sender, eventObject)
						{
							var data = getData();

							if (data != lastData && !ignoreChange)
							{
								var msg = this.createLoadMessage('autosave');
								msg.message = message;

								if (this.embedDiffSync && embedShadowPages != null)
								{
									var currentPages = this.clonePages(this.pages);
									var patch = this.diffPages(embedShadowPages, currentPages);

									if (!mxUtils.isEmptyObject(patch))
									{
										msg.patch = patch;
										msg.checksum = this.getHashValueForPages(currentPages);

										if (!this.embedDiffSyncPatchOnly)
										{
											msg.xml = data;
										}
									}
									else
									{
										// No structural changes but data changed
										msg.xml = data;
									}

									embedShadowPages = currentPages;
								}
								else
								{
									msg.xml = data;
								}

								var parent = this.embedMessageSource || window.opener || window.parent;
								parent.postMessage(JSON.stringify(msg), '*');
							}

							lastData = data;
						});

						this.editor.graph.model.addListener(mxEvent.CHANGE, changeListener);

						// Some options trigger autosave
						this.editor.graph.addListener('gridSizeChanged', changeListener);
						this.editor.graph.addListener('shadowVisibleChanged', changeListener);
						this.addListener('pageFormatChanged', changeListener);
						this.addListener('pageScaleChanged', changeListener);
						this.addListener('backgroundColorChanged', changeListener);
						this.addListener('backgroundImageChanged', changeListener);
						this.addListener('foldingEnabledChanged', changeListener);
						this.addListener('mathEnabledChanged', changeListener);
						this.addListener('gridEnabledChanged', changeListener);
						this.addListener('guidesEnabledChanged', changeListener);
						this.addListener('pageViewChanged', changeListener);
					}

					// Runs afterLoad before sending the load response so that
					// the reported scale and bounds reflect any adjustments
					// (e.g. custom scale parameter or layout)
					if (afterLoad != null)
					{
						afterLoad();
					}

					// Sends the bounds of the graph to the host after parsing
					if (urlParams['returnbounds'] == '1' || urlParams['proto'] == 'json')
					{
						var resp = this.createLoadMessage('load');

						// Attaches XML to response (re-read when a layout ran so
						// the host receives the laid-out diagram)
						resp.xml = (pendingLayout != null) ? getData() : data;

						// Include checksum when diff sync is enabled
						if (this.embedDiffSync && this.pages != null)
						{
							resp.checksum = this.getHashValueForPages(this.pages);
						}

						parent.postMessage(JSON.stringify(resp), '*');
					}
				});

				// layout (load option): apply before the baseline so it is
				// absorbed into the loaded state rather than synced as a change.
				if (pendingLayout != null)
				{
					this.executeLayoutSpec(pendingLayout, afterModel);
				}
				else
				{
					afterModel();
				}
			});
			
			if (data != null && typeof data.substring === 'function' && data.substring(0, 34) == 'data:application/vnd.visio;base64,')
			{
				// Checks VND binary magic number in base64
				var filename = (data.substring(34, 45) == '0M8R4KGxGuE') ? 'raw.vsd' : 'raw.vsdx';
				
				this.importVisio(this.base64ToBlob(data.substring(data.indexOf(',') + 1)), function(xml)
				{
					doLoad(xml, evt);
				}, mxUtils.bind(this, function(e)
				{
					this.handleError(e);
				}), filename);
			}
			else if (data != null && typeof data.substring === 'function' && new XMLHttpRequest().upload && this.isRemoteFileFormat(data, ''))
			{
				if (this.isOffline())
				{
					this.showError(mxResources.get('error'), mxResources.get('notInOffline'));
				}
				else
				{
					// Asynchronous parsing via server
					this.parseFileData(data, mxUtils.bind(this, function(xhr)
					{
						if (xhr.readyState == 4)
						{
							if (xhr.status >= 200 && xhr.status <= 299 &&
								xhr.responseText.substring(0, 13) == '<mxGraphModel')
							{
								doLoad(xhr.responseText, evt);
							}
							else
							{
								this.handleError({message: xhr.status == 413? mxResources.get('diagramTooLarge') : 
										mxResources.get('unknownError')});
							}
						}
					}), '');
				}
			}
			else if (data != null && typeof data.substring === 'function' && this.isLucidChartData(data))
			{
				this.convertLucidChart(data, mxUtils.bind(this, function(xml)
				{
					doLoad(xml);
				}), mxUtils.bind(this, function(e)
				{
					this.handleError(e);
				}));
			}
			else if (data != null && typeof data === 'object' && data.format != null && (data.data != null || data.url != null))
			{
				this.loadDescriptor(data, mxUtils.bind(this, function(e)
				{
					doLoad(getData(), evt);
				}), mxUtils.bind(this, function(e)
				{
					this.handleError(e, mxResources.get('errorLoadingFile'));
				}));
			}
			else
			{
				data = extractDiagramXml(data);
				doLoad(data, evt);
			}
		}));
		
		// Requests data from the sender. This is a workaround for not allowing
		// the opener to listen for the onload event if not in the same origin.
		var parent = this.embedMessageSource || window.opener || window.parent;
		var msg = (urlParams['proto'] == 'json') ? JSON.stringify({event: 'init'}) : (urlParams['ready'] || 'ready');
		parent.postMessage(msg, '*');
		
		// Adds JSON event for opening links
		if (urlParams['proto'] == 'json')
		{
			var graphOpenLink = this.editor.graph.openLink;
			
			this.editor.graph.openLink = function(href, target, allowOpener)
			{
				graphOpenLink.apply(this, arguments);
				
				parent.postMessage(JSON.stringify({event: 'openLink', href: href, target: target, allowOpener: allowOpener}), '*');
			};

			// In suppressNewWindows mode, <a target="_blank"> links (e.g. in
			// hover tooltips and HTML labels) are opened directly by the browser
			// via window.open — which a popup-blocking host blocks and which
			// bypasses openLink, so the host is never notified. Intercept such
			// clicks in the capture phase and route them through openLink (which
			// posts the openLink event above) instead.
			if (Editor.suppressNewWindows)
			{
				document.addEventListener('click', mxUtils.bind(this, function(evt)
				{
					var source = mxEvent.getSource(evt);

					while (source != null && source.nodeName != 'A')
					{
						source = source.parentNode;
					}

					if (source != null)
					{
						var href = source.getAttribute('href');

						if (href != null && href.charAt(0) != '#' &&
							href.substring(0, 11) != 'javascript:' &&
							!this.editor.graph.isCustomLink(href))
						{
							evt.preventDefault();
							this.editor.graph.openLink(href, source.getAttribute('target'));
						}
					}
				}), true);
			}
		}
	};
	
	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.createEmbedButton = function(title, fn, shortcut, primary)
	{
		var btn = document.createElement('button');
		btn.className = 'geEmbedBtn geBtn';
		btn.setAttribute('title', title + ((shortcut != null) ?
			' (' + shortcut + ')' : ''));
		mxUtils.write(btn, title);

		if (primary)
		{
			btn.classList.add('gePrimaryBtn');
		}

		mxEvent.addListener(btn, 'click', fn);

		return btn;
	};

	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.setEmbedTitle = function(filename)
	{
		var tmp = this.createStatusDiv(filename);

		if (this.embedFilenameSpan != null)
		{
			this.embedFilenameSpan.parentNode.removeChild(this.embedFilenameSpan);
		}

		if (Editor.currentTheme == 'kennedy' ||
			Editor.currentTheme == 'atlas')
		{
			this.menubarContainer.appendChild(tmp);
		}
		else
		{
			this.buttonContainer.appendChild(tmp);
		}

		this.embedFilenameSpan = tmp;
	};

	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.addEmbedButtons = function()
	{
		this.dependsOnLanguage(mxUtils.bind(this, function()
		{
			var restoreEmbedFilenameSpan = this.embedFilenameSpan != null &&
				this.embedFilenameSpan.parentNode == this.buttonContainer;
			this.buttonContainer.innerText = '';

			if (restoreEmbedFilenameSpan)
			{
				this.buttonContainer.appendChild(this.embedFilenameSpan);
			}

			if (this.commentsSupported() && this.commentButton != null)
			{
				this.buttonContainer.appendChild(this.commentButton);
			}

			if (urlParams['noSaveBtn'] == '1')
			{
				if (urlParams['saveAndExit'] != '0')
				{
					this.buttonContainer.appendChild(this.createEmbedButton(urlParams['publishClose'] == '1' ?
						mxResources.get('publish') : mxResources.get('saveAndExit'),
						this.actions.get('saveAndExit').funct, Editor.ctrlKey + '+S', true));
				}
			}
			else
			{
				this.buttonContainer.appendChild(this.createEmbedButton(mxResources.get('save'), mxUtils.bind(this, function()
				{
					this.actions.get('save').funct(false);
				}), urlParams['saveAndExit'] == '1' ? Editor.ctrlKey + '+' + Editor.shiftKey + '+S' :
					Editor.ctrlKey + '+S', true));
				
				if (urlParams['saveAndExit'] == '1')
				{
					this.buttonContainer.appendChild(this.createEmbedButton(mxResources.get('saveAndExit'),
						this.actions.get('saveAndExit').funct, Editor.ctrlKey + '+S'));
				}
			}

			if (urlParams['noExitBtn'] != '1')
			{
				this.buttonContainer.appendChild(this.createEmbedButton(urlParams['publishClose'] == '1' ?
					mxResources.get('close') : mxResources.get('exit'),
					this.actions.get('exit').funct));
			}
		}));
	};

	/**
	 *
	 */
	EditorUi.prototype.showImportCsvDialog = function()
	{
		if (this.importCsvDialog == null)
		{
			this.importCsvDialog = new SimpleTextareaDialog(this, Editor.defaultCsvValue,
				mxUtils.bind(this, function(newValue)
			{
    			this.importCsv(newValue);
			}), mxResources.get('import'), 'https://www.drawio.com/blog/insert-from-csv');
		}

		this.showDialog(this.importCsvDialog.container, 640, 520, true, true, null,
			null, null, new mxRectangle(0, 0, 320, 280));
		this.importCsvDialog.init();
	};
		
	/**
	 * Loads orgchart layouts and executes the given function.
	 */
	EditorUi.prototype.showCustomLayoutDialog = function(value)
	{
		this.loadOrgChartLayouts(mxUtils.bind(this, function()
		{
			var dlg = new TextareaDialog(this, mxResources.get('layout'),
				value, mxUtils.bind(this, function(newValue)
			{
				if (newValue.length > 0)
				{
					try
					{
						var list = JSON.parse(newValue);

						// A single selected layout container takes the list as
						// its new childLayout instead of a one-shot run (only
						// for arrays — other parsed JSON keeps the legacy
						// one-shot path and its error behavior).
						var container = this.getSelectedLayoutContainer();

						if (container != null && Array.isArray(list) &&
							list.length > 0)
						{
							this.setContainerChildLayout(container, list);
						}
						else
						{
							this.executeLayouts(this.editor.graph.createLayouts(list));
						}

						this.customLayoutConfig = list;
						this.lastLayoutSpec = list;
						this.hideDialog();
					}
					catch (e)
					{
						this.handleError(e);
					}
				}
			}), null, null, null, null, mxUtils.bind(this, function(buttons, input)
			{
				var addSelect = this.createLayoutAddSelect(input);
				buttons.appendChild(addSelect);

				var copyBtn = mxUtils.button(mxResources.get('copy'), mxUtils.bind(this, function()
				{
					try
					{
						var orig = input.value;
						input.value = JSON.stringify(JSON.parse(orig));
						input.focus();

						if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
						{
							input.select();
						}
						else
						{
							document.execCommand('selectAll', false, null);
						}

						document.execCommand('copy');
						this.alert(mxResources.get('copiedToClipboard'));

						input.value = orig;
					}
					catch (e)
					{
						this.handleError(e);
					}
				}));

				copyBtn.setAttribute('title', 'copy');
				copyBtn.className = 'geBtn';
				buttons.appendChild(copyBtn);
			}), true, null, null, EditorUi.APPLY_LAYOUTS_SPEC_URL);

			this.showDialog(dlg.container, 620, 460, true, true, null, null, null, new mxRectangle(0, 0, 440, 280));
			dlg.init();
		}));
	};

	/**
	 * URL of the canonical JSON layout spec — the help-icon target for the
	 * custom layout dialog. Defined once here so a future repoint doesn't
	 * have to touch every callsite.
	 */
	EditorUi.APPLY_LAYOUTS_SPEC_URL = 'https://www.drawio.com/docs/reference/json-layout-specification/';

	/**
	 * Restricts the given layouts to the supplied cell subset. mxGraph
	 * layouts get their `isVertexIgnored` wrapped to OR the existing rule
	 * with "not in subset"; ELK layouts get a `cellFilter` callback set on
	 * the instance (the bridge passes it down to ElkAdapter, which then
	 * drops excluded vertices + their edges from the ELK input), as do
	 * prepare() adapters that advertise scoping support via a null
	 * `cellFilter` property (see LibavoidRouting.createLayout, which then
	 * only routes the subset's edges).
	 *
	 * Used by `importCsv` so a CSV import's layout pass only moves the
	 * cells the import just created, leaving the rest of the page alone.
	 *
	 * The IIFE wrap around the isVertexIgnored swap is required because
	 * `var original = ...` inside the `for` loop has function scope —
	 * without it, every wrapped function would close over the last
	 * iteration's value.
	 */
	EditorUi.prototype.scopeLayoutsToCells = function(layouts, subset)
	{
		var cellSet = {};

		for (var i = 0; i < subset.length; i++)
		{
			if (subset[i] != null) cellSet[subset[i].id] = true;
		}

		var cellFilter = function(cell)
		{
			return cell != null && cellSet[cell.id] === true;
		};

		for (var i = 0; i < layouts.length; i++)
		{
			var layout = layouts[i];

			if ((typeof ElkLayout !== 'undefined' && layout instanceof ElkLayout) ||
				layout.cellFilter !== undefined)
			{
				layout.cellFilter = cellFilter;
			}
			else if (typeof layout.isVertexIgnored === 'function')
			{
				(function(l)
				{
					var original = l.isVertexIgnored;
					l.isVertexIgnored = function(vertex)
					{
						return original.apply(this, arguments) || !cellFilter(vertex);
					};
				})(layout);
			}
		}
	};

	/**
	 * Builds the "Add layout" <select> for the custom layout dialog. Picking
	 * an entry shows that layout's config dialog (for ELK and OrgChart); on
	 * Apply, the resulting {layout, config} entry is appended to the textarea
	 * JSON. The textarea stays freely editable so users can tweak options
	 * that the per-layout config dialogs don't expose.
	 *
	 * Because draw.io only stacks one dialog at a time, picking an entry
	 * tears down the textarea dialog and opens the per-layout one; Cancel
	 * re-opens the textarea with the unchanged content so unsaved edits
	 * survive.
	 */
	EditorUi.prototype.createLayoutAddSelect = function(input)
	{
		var editorUi = this;

		var select = document.createElement('select');
		select.className = 'geBtn';
		select.style.marginRight = '8px';
		select.style.maxWidth = '180px';

		var placeholder = document.createElement('option');
		placeholder.value = '';
		mxUtils.write(placeholder, mxResources.get('add') + '...');
		placeholder.disabled = true;
		placeholder.selected = true;
		select.appendChild(placeholder);

		var entries = [];

		if (typeof ElkLayout !== 'undefined')
		{
			// algo + direction come from ElkLayout.MENU_PRESETS (shared with
			// drawio-mcp); only label + layoutName are editor-specific here.
			var elkEntry = function(name, layoutName)
			{
				var p = ElkLayout.MENU_PRESETS[name];
				return {label: name, kind: 'elk', algo: p.algorithm,
					preset: p.options, layoutName: layoutName};
			};
			entries.push(elkEntry('verticalFlow', 'elkLayered'));
			entries.push(elkEntry('horizontalFlow', 'elkLayered'));
			entries.push(elkEntry('verticalTree', 'elkTree'));
			entries.push(elkEntry('horizontalTree', 'elkTree'));
			entries.push(elkEntry('radialTree', 'elkRadial'));
			entries.push(elkEntry('organic', 'elkOrganic'));
			// elkStress is available via JSON / CSV but intentionally not in
			// this dropdown — it's not in the Arrange > Layout menu.
		}

		entries.push({label: 'orgChart', kind: 'orgchart'});
		entries.push({label: 'circle', kind: 'simple', layoutName: 'mxCircleLayout', config: {}});
		entries.push({label: 'parallels', kind: 'simple', layoutName: 'mxParallelEdgeLayout',
			config: {spacing: 20, checkOverlap: true}});

		if (typeof LibavoidRouting !== 'undefined')
		{
			entries.push({label: 'orthogonalRouting', kind: 'simple',
				layoutName: LibavoidRouting.LAYOUT_NAME, config: {}});
		}

		for (var i = 0; i < entries.length; i++)
		{
			var opt = document.createElement('option');
			opt.value = String(i);
			mxUtils.write(opt, mxResources.get(entries[i].label) +
				(entries[i].kind === 'elk' || entries[i].kind === 'orgchart' ? '...' : ''));
			select.appendChild(opt);
		}

		mxEvent.addListener(select, 'change', mxUtils.bind(this, function()
		{
			var idx = parseInt(select.value);
			select.selectedIndex = 0;

			if (isNaN(idx) || idx < 0 || idx >= entries.length) return;

			var entry = entries[idx];
			var current = input.value;
			var existing;

			if (mxUtils.trim(current).length === 0)
			{
				existing = [];
			}
			else
			{
				try
				{
					existing = JSON.parse(current);
				}
				catch (e)
				{
					// Keep the invalid hand-edit in the textarea instead of
					// silently dropping it. The user can fix the JSON, then
					// pick the layout again.
					editorUi.handleError(e);
					return;
				}

				if (!Array.isArray(existing))
				{
					editorUi.handleError(new Error(
						mxResources.get('error') + ': expected JSON array'));
					return;
				}
			}

			var appendAndReopen = mxUtils.bind(this, function(newEntry)
			{
				existing.push(newEntry);
				editorUi.hideDialog();
				editorUi.showCustomLayoutDialog(JSON.stringify(existing, null, 2));
			});

			var reopenUnchanged = mxUtils.bind(this, function()
			{
				editorUi.hideDialog();
				editorUi.showCustomLayoutDialog(current);
			});

			if (entry.kind === 'elk')
			{
				editorUi.hideDialog();

				ElkLayout.runWithDialog(editorUi, entry.algo, entry.preset,
					mxResources.get(entry.label),
					function(layoutOptions, runOptions)
					{
						// baseOptions (entry.preset, e.g. direction) are merged
						// into layoutOptions inside runWithDialog, so the captured
						// JSON already includes the direction — no need to merge
						// again here.
						var config = Graph.elkOptionsToConfig(layoutOptions, runOptions);
						appendAndReopen({layout: entry.layoutName, config: config});
					},
					reopenUnchanged);
			}
			else if (entry.kind === 'orgchart')
			{
				editorUi.hideDialog();
				editorUi.showOrgChartConfigDialog(appendAndReopen, reopenUnchanged);
			}
			else
			{
				appendAndReopen({layout: entry.layoutName, config: entry.config || {}});
			}
		}));

		return select;
	};

	/**
	 * Opens the same Org Chart type/spacing dialog that Arrange > Layout > Org
	 * Chart uses, but instead of running the layout it hands the resulting
	 * config to onApply as a {layout, config} entry. Mirrors the dialog in
	 * Menus.js to avoid behavior drift between the two entry points.
	 */
	EditorUi.prototype.showOrgChartConfigDialog = function(onApply, onCancel)
	{
		var editorUi = this;
		var branchOptimizer = 2, parentChildSpacingVal = 20, siblingSpacingVal = 20;

		var div = document.createElement('div');

		var addRow = function(labelKey, input)
		{
			var title = document.createElement('div');
			title.style.marginTop = '6px';
			title.style.display = 'inline-block';
			title.style.width = '180px';
			mxUtils.write(title, mxResources.get(labelKey) + ': ');
			div.appendChild(title);
			div.appendChild(input);
		};

		var typeSelect = document.createElement('select');
		typeSelect.style.width = '160px';
		typeSelect.style.boxSizing = 'border-box';

		var typesArr = [mxResources.get('linear'),
			mxResources.get('hanger2'),
			mxResources.get('hanger4'),
			mxResources.get('fishbone1'),
			mxResources.get('fishbone2'),
			mxResources.get('1ColumnLeft'),
			mxResources.get('1ColumnRight'),
			mxResources.get('smart')];

		for (var i = 0; i < typesArr.length; i++)
		{
			var option = document.createElement('option');
			mxUtils.write(option, typesArr[i]);
			option.value = i;
			if (i === 2) option.setAttribute('selected', 'selected');
			typeSelect.appendChild(option);
		}

		mxEvent.addListener(typeSelect, 'change', function()
		{
			branchOptimizer = parseInt(typeSelect.value);
		});

		addRow('orgChartType', typeSelect);

		var parentChildSpacing = document.createElement('input');
		parentChildSpacing.type = 'number';
		parentChildSpacing.value = parentChildSpacingVal;
		parentChildSpacing.style.width = '160px';
		parentChildSpacing.style.boxSizing = 'border-box';
		mxEvent.addListener(parentChildSpacing, 'change', function()
		{
			parentChildSpacingVal = parseInt(parentChildSpacing.value);
		});
		addRow('parentChildSpacing', parentChildSpacing);

		var siblingSpacing = document.createElement('input');
		siblingSpacing.type = 'number';
		siblingSpacing.value = siblingSpacingVal;
		siblingSpacing.style.width = '160px';
		siblingSpacing.style.boxSizing = 'border-box';
		mxEvent.addListener(siblingSpacing, 'change', function()
		{
			siblingSpacingVal = parseInt(siblingSpacing.value);
		});
		addRow('siblingSpacing', siblingSpacing);

		var dlg = new CustomDialog(editorUi, div, function()
		{
			onApply({
				layout: 'mxOrgChartLayout',
				config: {
					branchOptimizer: branchOptimizer,
					parentChildSpacing: parentChildSpacingVal,
					siblingSpacing: siblingSpacingVal
				}
			});
		}, onCancel || null, mxResources.get('apply'),
			'https://www.drawio.com/docs/manual/layouts/org-chart-layout/');

		// null height = size to content (a fixed height clips the third
		// row behind a scrollbar)
		editorUi.showDialog(dlg.container, 355, null, true, true);
	};

	/**
	 * Loads orgchart layouts and executes the given function.
	 */
	EditorUi.prototype.loadOrgChartLayouts = function(fn, noSpinner)
	{
		this.createTimeout(null, mxUtils.bind(this, function(timeout)
		{
			var onload = mxUtils.bind(this, function()
			{
				this.loadingOrgChart = false;

				if (timeout.clear())
				{
					Graph.layoutNames.push('mxOrgChartLayout');
					this.spinner.stop();
					fn();
				}
			});

			var onerror = mxUtils.bind(this, function(e)
			{
				this.loadingOrgChart = false;

				if (timeout.clear())
				{
					this.handleError(e);
				}
			});

			if (typeof mxOrgChartLayout === 'undefined' && !this.loadingOrgChart && !this.isOffline(true))
			{
				if (noSpinner || this.spinner.spin(document.body, mxResources.get('loading')))
				{
					this.loadingOrgChart = true;

					if (urlParams['dev'] == '1')
					{
						mxscript('js/orgchart/bridge.min.js', function()
						{
							mxscript('js/orgchart/bridge.collections.min.js', function()
							{
								mxscript('js/orgchart/OrgChart.Layout.min.js', function()
								{
									mxscript('js/orgchart/mxOrgChartLayout.js',
										onload, null, null, null, onerror);											
								}, null, null, null, onerror);		
							}, null, null, null, onerror);	
						}, null, null, null, onerror);
					}
					else
					{
						mxscript(window.DRAWIO_SERVER_URL + 'js/orgchart.min.js', onload, null, null, null, onerror);
					}
				}
			}
			else
			{
				onload();
			}
		}), onerror);
	};
	
	/**
	 *
	 */
	EditorUi.prototype.importCsv = function(text, done, graph, noSpinner)
	{
		this.loadOrgChartLayouts(mxUtils.bind(this, function()
		{
			this.doImportCsv(text, done, graph);
		}), noSpinner);
	};

	/**
	 *
	 */
	EditorUi.prototype.doImportCsv = function(text, done, graph)
	{
		try
		{
    		var lines = text.split('\n');
    		var allCells = [];
			var parents = [];
    		var cells = [];
    		var dups = {};
    		
    		if (lines.length > 0)
    		{
        		// Internal lookup table
        		var lookups = {};
        		
        		// Default values
        		graph = (graph != null) ? graph : this.editor.graph;
        		var vars = null;
        		var style = null;
        		var styles = null;
        		var stylename = null;
        		var labelname = null;
				var unknownStyle = null;
        		var labels = null;
        		var parentstyle = 'whiteSpace=wrap;html=1;';
        		var identity = null;
        		var parent = null;
        		var namespace = '';
        		var width = 'auto';
        		var height = 'auto';
				var collapsed = false;
        		var left = null;
        		var top = null;
        		var edgespacing = 40;
        		var nodespacing = 40;
        		var levelspacing = 100;
        		var padding = 0;

				// Delayed after optional layout
    			var afterInsert = mxUtils.bind(this, function()
    			{
    				if (done != null)
    				{
    					done(select);
    				}
    				else
    				{
    					graph.setSelectionCells(select);
    					graph.scrollCellToVisible(graph.getSelectionCell());
    				}
					
					if (this.chromelessResize != null)
					{
						window.setTimeout(mxUtils.bind(this, function()
						{
							this.chromelessResize(true);
						}), 0);
					}
    			});
    				
    			// Free-space insertion point, deliberately ignoring the
    			// current mouse position — a CSV import should land in
    			// open canvas below existing content, not under wherever
    			// the cursor happened to be when the dialog opened.
    			var pt = graph.getFreeInsertPoint(true);
				var x0 = pt.x;
				var y0 = pt.y;
				var y = y0;

    			// Default label value depends on column names
        		var label = null;
        		
    			// Default layout to run.
        		var layout = 'auto';
        		
        		// Name of the attribute that contains the parent reference
        		var parent = null;
        		
        		// Name of the attribute that contains the references for creating edges
        		var edges = [];

        		// Name of the column for hyperlinks
        		var link = null;
        		
        		// String array of names to remove from metadata
        		var ignore = null;
        		
        		// Read processing instructions first
        		var index = 0;
        		
        		while (index < lines.length && lines[index].charAt(0) == '#')
        		{
        			var text = lines[index].replace(/\r$/,''); // Remove trailing \r if the file uses \r\n line breaks
        			index++;
        			
        			while (index < lines.length && text.charAt(text.length - 1) == '\\' &&
        				lines[index].charAt(0) == '#')
        			{
        				text = text.substring(0, text.length - 1) + mxUtils.trim(lines[index].substring(1));
        				index++;
        			}
        			
        			if (text.charAt(1) != '#')
        			{
	    				// Processing instruction
	    				var idx = text.indexOf(':');
	    				
	    				if (idx > 0)
	    				{
		    				var key = mxUtils.trim(text.substring(1, idx));
		    				var value = mxUtils.trim(text.substring(idx + 1));
	
		    				if (key == 'label')
		    				{
		    					label = Graph.sanitizeHtml(value);
		    				}
		    				else if (key == 'labelname' && value.length > 0 && value != '-')
		    				{
		    					labelname = value;
		    				}
		    				else if (key == 'labels' && value.length > 0 && value != '-')
		    				{
		    					labels = JSON.parse(value);
		    				}
		    				else if (key == 'style')
		    				{
		    					style = value;
		    				}
		    				else if (key == 'parentstyle')
		    				{
		    					parentstyle = value;
		    				}
							else if (key == 'unknownStyle' && value != '-')
		    				{
		    					unknownStyle = value;
		    				}
		    				else if (key == 'stylename' && value.length > 0 && value != '-')
		    				{
		    					stylename = value;
		    				}
		    				else if (key == 'styles' && value.length > 0 && value != '-')
		    				{
		    					styles = JSON.parse(value);
		    				}
		    				else if (key == 'vars' && value.length > 0 && value != '-')
		    				{
		    					vars = JSON.parse(value);
		    				}
		    				else if (key == 'identity' && value.length > 0 && value != '-')
		    				{
		    					identity = value;
		    				}
		    				else if (key == 'parent' && value.length > 0 && value != '-')
		    				{
		    					parent = value;
		    				}
		    				else if (key == 'namespace' && value.length > 0 && value != '-')
		    				{
		    					namespace = value;
		    				}
		    				else if (key == 'width')
		    				{
		    					width = value;
		    				}
		    				else if (key == 'height')
		    				{
		    					height = value;
		    				}
							else if (key == 'collapsed' && value != '-')
		    				{
		    					collapsed = value == 'true';
		    				}
		    				else if (key == 'left' && value.length > 0)
		    				{
		    					left = value;
		    				}
		    				else if (key == 'top' && value.length > 0)
		    				{
		    					top = value;
		    				}
		    				else if (key == 'ignore')
		    				{
		    					ignore = value.split(',');
		    				}
		    				else if (key == 'connect')
		    				{
		    					edges.push(JSON.parse(value));
		    				}
		    				else if (key == 'link')
		    				{
		    					link = value;
		    				}
		    				else if (key == 'padding')
		    				{
		    					padding = parseFloat(value);
		    				}
		    				else if (key == 'edgespacing')
		    				{
		    					edgespacing = parseFloat(value);
		    				}
		    				else if (key == 'nodespacing')
		    				{
		    					nodespacing = parseFloat(value);
		    				}
		    				else if (key == 'levelspacing')
		    				{
		    					levelspacing = parseFloat(value);
		    				}
		    				else if (key == 'layout')
		    				{
		    					layout = value;
		    				}
	    				}
        			}
        		}
        		
        		if (lines[index] == null)
        		{
        			throw new Error(mxResources.get('invalidOrMissingFile'));
        		}
        		
    			// Converts identity and parent to index and validates XML attribute names
    			var keys = this.editor.csvToArray(lines[index].replace(/\r$/,''));
        		var identityIndex = null;
    			var parentIndex = null;
    			var attribs = [];
    			
				for (var i = 0; i < keys.length; i++)
	    		{
					if (identity == keys[i])
					{
						identityIndex = i;
					}
					
					if (parent == keys[i])
					{
						parentIndex = i;
					}
					
					attribs.push(mxUtils.trim(keys[i]).replace(/[^a-z0-9]+/ig, '_').
						replace(/^\d+/, '').replace(/_+$/, ''));
	    		}
				
    			if (label == null)
    			{
    				label = '%' + attribs[0] + '%';
    			}
    			
    			if (edges != null)
				{
					for (var e = 0; e < edges.length; e++)
					{
						if (lookups[edges[e].to] == null)
						{
							lookups[edges[e].to] = {};
						}
					}
				}
    			
    			// Parse and validate input
    			var arrays = [];
    			
    			for (var i = index + 1; i < lines.length; i++)
	    		{
	    			var values = this.editor.csvToArray(lines[i].replace(/\r$/,''));
	    			
	    			if (values == null)
	    			{
	    				var short = (lines[i].length > 40) ? lines[i].substring(0, 40) + '...' : lines[i];
	    				
	    				throw new Error(short + ' (' + i + '):\n' + mxResources.get('containsValidationErrors'));
	    			}
	    			else if (values.length > 0)
		    		{
	    				arrays.push(values);
	    			}
	    		}
    			
        		graph.model.beginUpdate();
        		try
        		{
	    			for (var i = 0; i < arrays.length; i++)
		    		{
    	    			var values = arrays[i];
    					var cell = null;
    					var id = (identityIndex != null) ? namespace + values[identityIndex] : null;
						var ignoreCell = false;
    					
    					if (id != null)
    					{
    						cell = graph.model.getCell(id);

							// Bypasses update of cells inserted during this run
							ignoreCell = cell == null || mxUtils.indexOf(
								allCells, cell) >= 0;
    					}
						
    					var newCell = new mxCell(label, new mxGeometry(x0, y,
		    				0, 0), style || 'whiteSpace=wrap;html=1;');
						newCell.collapsed = collapsed;
						newCell.vertex = true;
    					newCell.id = id;
						
						if (cell != null && !ignoreCell)
						{
							graph.model.setCollapsed(cell, collapsed);
						}
						
						for (var j = 0; j < values.length; j++)
				    	{
							graph.setAttributeForCell(newCell, attribs[j], values[j]);

							if (cell != null && !ignoreCell)
							{
								graph.setAttributeForCell(cell, attribs[j], values[j]);
							}
				    	}
						
						if (labelname != null && labels != null)
						{
							var tempLabel = labels[newCell.getAttribute(labelname)];
							
							if (tempLabel != null)
							{
								graph.labelChanged(newCell, tempLabel);

								if (cell != null && !ignoreCell)
								{
									graph.cellLabelChanged(cell, tempLabel);
								}
							}
						}

						if (stylename != null && styles != null)
						{
							var tempStyle = styles[newCell.getAttribute(stylename)];
							
							if (tempStyle != null)
							{
								newCell.style = tempStyle;
							}
						}

						graph.setAttributeForCell(newCell, 'placeholders', '1');
						newCell.style = graph.replacePlaceholders(newCell, newCell.style, vars);

						if (cell != null && !ignoreCell)
						{
							graph.model.setStyle(cell, newCell.style);

							if (mxUtils.indexOf(cells, cell) < 0)
							{
								cells.push(cell);
							}

							graph.fireEvent(new mxEventObject('cellsInserted', 'cells', [cell]));
						}
						else
						{
							graph.fireEvent(new mxEventObject('cellsInserted', 'cells', [newCell]));
						}

    					var exists = cell != null;
						cell = newCell;
    					
						if (!exists)
						{
	    					for (var e = 0; e < edges.length; e++)
	    					{
	    						lookups[edges[e].to][cell.getAttribute(edges[e].to)] = cell;
	    					}
						}
						
						if (link != null && link != 'link')
						{
							graph.setLinkForCell(cell, cell.getAttribute(link));
							
							// Removes attribute
							graph.setAttributeForCell(cell, link, null);
						}
						
						// Sets the geometry
						var size = graph.getPreferredSizeForCell(cell);
						var parent = (parentIndex != null) ? graph.model.getCell(
							namespace + values[parentIndex]) : null;

						if (cell.vertex)
						{
							var originX = (parent != null) ? 0 : x0;
							var originY = (parent != null) ? 0 : y0;

							if (left != null && cell.getAttribute(left) != null)
							{
								cell.geometry.x = originX + parseFloat(cell.getAttribute(left));
							}

							if (top != null && cell.getAttribute(top) != null)
							{
								cell.geometry.y = originY + parseFloat(cell.getAttribute(top));
							}

							var widthValue = (width.charAt(0) == '@') ? cell.getAttribute(width.substring(1)) : null;

							if (widthValue != null && widthValue != 'auto')
							{
								cell.geometry.width = parseFloat(cell.getAttribute(width.substring(1)));
							}
							else
							{
								cell.geometry.width = (width == 'auto' || widthValue == 'auto') ?
									size.width + padding : parseFloat(width);
							}

							var heightValue = (height.charAt(0) == '@') ? cell.getAttribute(height.substring(1)) : null;
							
							if (heightValue != null && heightValue != 'auto' && height != 'width')
							{
								cell.geometry.height = parseFloat(heightValue);
							}
							else
							{
								cell.geometry.height = (height == 'auto' || heightValue == 'auto') ?
									size.height + padding : (height == 'width' ?
										cell.geometry.width : parseFloat(height));
							}
							
							y += cell.geometry.height + nodespacing;
						}
						
						if (!exists)
						{
							allCells.push(cell);
	    					
	    					if (parent != null)
	    					{
	    						parent.style = graph.replacePlaceholders(parent, parentstyle, vars);
	    						graph.addCell(cell, parent);
								parents.push(parent);
	    					}
	    					else
	    					{
	    						cells.push(graph.addCell(cell));
	    					}
						}
						else
						{
							if (dups[id] == null)
							{
								dups[id] = [];
							}
							
							dups[id].push(cell);
						}
	    			}

					// Process parents for autosize
					for (var i = 0; i < parents.length; i++)
					{
						var widthValue = (width.charAt(0) == '@') ? parents[i].getAttribute(width.substring(1)) : null;
						var heightValue = (height.charAt(0) == '@') ? parents[i].getAttribute(height.substring(1)) : null;

						if ((width == 'auto' || widthValue == 'auto') &&
							(height == 'auto' || heightValue == 'auto'))
						{
							graph.updateGroupBounds([parents[i]], padding, true);
						}
					}

					var roots = cells.slice();
					var select = cells.slice();
					
					for (var e = 0; e < edges.length; e++)
					{
						var edge = edges[e];
	
						for (var i = 0; i < allCells.length; i++)
	    				{
							var cell = allCells[i];
							
							var insertEdge = mxUtils.bind(this, function(realCell, dataCell, edge)
							{
								var tmp = dataCell.getAttribute(edge.from);
								
		    					if (tmp != null && tmp != '')
		    					{
									var refs = tmp.split(',');
									
									for (var j = 0; j < refs.length; j++)
									{
										var ref = lookups[edge.to][refs[j]];

										if (ref == null && unknownStyle != null)
										{
											ref = new mxCell(refs[j], new mxGeometry(x0, y0, 0, 0), unknownStyle);
											ref.style = graph.replacePlaceholders(dataCell, ref.style, vars);
											var refSize = graph.getPreferredSizeForCell(ref);
											ref.geometry.width = refSize.width + padding;
											ref.geometry.height = refSize.height + padding;
											lookups[edge.to][refs[j]] = ref;
											ref.vertex = true;
											ref.id = refs[j];
											cells.push(graph.addCell(ref));
										}

										if (ref != null)
										{
											var label = edge.label;
											
											if (edge.fromlabel != null)
											{
												label = (dataCell.getAttribute(edge.fromlabel) || '') + (label || '');
											}
											
											if (edge.sourcelabel != null)
											{
												label = graph.replacePlaceholders(dataCell,
													edge.sourcelabel, vars) + (label || '');
											}
						
											if (edge.tolabel != null)
											{
												label = (label || '') + (ref.getAttribute(edge.tolabel) || '');
											}
																							
											if (edge.targetlabel != null)
											{
												label = (label || '') + graph.replacePlaceholders(
													ref, edge.targetlabel, vars);
											}
						
											var placeholders = ((edge.placeholders == 'target') ==
												!edge.invert) ? ref : realCell;
											var edgeStyle = (edge.style != null) ?
												graph.replacePlaceholders(placeholders, edge.style, vars) :
												graph.createCurrentEdgeStyle();

											var edgeCell = graph.insertEdge(null, null, label || '', (edge.invert) ?
												ref : realCell, (edge.invert) ? realCell : ref, edgeStyle);
											
											// Adds additional edge labels
											if (edge.labels != null)
											{
												for (var k = 0; k < edge.labels.length; k++)
												{
													var def = edge.labels[k];
													var elx = (def.x != null) ? def.x : 0;
													var ely = (def.y != null) ? def.y : 0;
													var st = 'resizable=0;html=1;';
													var el = new mxCell(def.label || k,
														new mxGeometry(elx,  ely, 0, 0), st);
													el.vertex = true;
													el.connectable = false;
													el.geometry.relative = true;
								
													if (def.placeholders != null)
													{
														el.value = graph.replacePlaceholders(
															((def.placeholders == 'target') ==
															!edge.invert) ? ref : realCell,
														el.value, vars)
													}
													
													if (def.dx != null || def.dy != null)
													{
														el.geometry.offset = new mxPoint(
															(def.dx != null) ? def.dx : 0,
															(def.dy != null) ? def.dy : 0);
													}
								
													edgeCell.insert(el);
												}
											}

											// Adds edge metadata
											if (edge.data != null)
											{
												for (var key in edge.data)
												{
													graph.setAttributeForCell(edgeCell, key, edge.data[key]);
												}
											}
											
											select.push(edgeCell);
											mxUtils.remove((edge.invert) ? realCell : ref, roots);
										}
									}
		    					}
							});
							
							insertEdge(cell, cell, edge);

    						// Checks more entries
    						if (dups[cell.id] != null)
    						{
    							for (var j = 0; j < dups[cell.id].length; j++)
    		    				{
    								insertEdge(cell, dups[cell.id][j], edge);
    		    				}
    						}
						}
					}
						
					// Removes ignored attributes after processing above
					if (ignore != null)
					{
						for (var i = 0; i < allCells.length; i++)
						{
							var cell = allCells[i];
							
							for (var j = 0; j < ignore.length; j++)
					    	{
								graph.setAttributeForCell(cell, mxUtils.trim(ignore[j]), null);
					    	}
						}
					}
					
					if (cells.length > 0)
					{
						var edgeLayout = new mxParallelEdgeLayout(graph);
						edgeLayout.spacing = edgespacing;
						edgeLayout.checkOverlap = true;
				
						var postProcess = function()
						{
							if (edgeLayout.spacing > 0)
							{
								edgeLayout.execute(graph.getDefaultParent());
							}
							
			    			// Snap the whole laid-out cluster to grid as one unit
							// (single dx/dy applied to every cell) instead of
							// snapping each cell's x/y individually. Per-cell
							// snapping breaks center alignment between cells in
							// the same vertical / horizontal spine when their
							// widths / heights aren't multiples of gridSize —
							// e.g. for the default CSV ELK gives Tessa (w=170)
							// and Alison (w=200) the same center x, but
							// rounding 159 → 160 and 144 → 140 independently
							// shifts the centers 5px apart. Snap once via the
							// bounding box top-left and translate uniformly.
							var snapDx = 0;
							var snapDy = 0;

							if (cells.length > 0)
							{
								var firstGeo = graph.getCellGeometry(cells[0]);
								snapDx = Math.round(graph.snap(firstGeo.x)) - firstGeo.x;
								snapDy = Math.round(graph.snap(firstGeo.y)) - firstGeo.y;
							}

							for (var i = 0; i < cells.length; i++)
		    				{
								var geo = graph.getCellGeometry(cells[i]);
								geo.x = Math.round(geo.x + snapDx);
								geo.y = Math.round(geo.y + snapDy);

								if (width == 'auto')
								{
									geo.width = Math.round(graph.snap(geo.width));
								}

								if (height == 'auto')
								{
									geo.height = Math.round(graph.snap(geo.height));
								}
		    				}
						};
						
						// Resolve `auto` to one of the legacy hierarchical keys so
						// the dispatch below picks the matching branch.
						// Tree-shape (1 root + (n-1) edges) → verticaltree
						// (mxCompactTreeLayout). Otherwise, 1 root →
						// verticalflow (ELK's layered, tuned to mimic the
						// legacy mxHierarchicalLayout output — see
						// CSV_ELK_LAYOUTS for the per-key tuning).
						// Both default to vertical (DOWN / NORTH) for `auto`.
						// The default CSV (orgchart with cross-refs) lands on
						// verticalflow.
						if (layout == 'auto' && roots.length == 1)
						{
							layout = (select.length == 2 * cells.length - 1) ?
								'verticaltree' : 'verticalflow';
						}

						// JSON custom-layout arrays, the libavoid shorthand and
						// the Arrange > Layout preset names all resolve through
						// the shared spec resolver (see resolveLayoutList). The
						// CSV-specific names are handled in the branches below
						// and must not reach the resolver: 'organic' names the
						// legacy mxFastOrganicLayout here (not the ELK menu
						// preset of the same name), and the CSV_ELK_LAYOUTS
						// keys layer the CSV spacing knobs onto their configs.
						var resolvedLayouts = (layout == 'organic' ||
							EditorUi.CSV_ELK_LAYOUTS[layout] != null) ?
							null : this.resolveLayoutList(layout);

						if (resolvedLayouts != null)
						{
			    			// Required for layouts to work with new cells
							var temp = afterInsert;
			    			graph.view.validate();

							var jsonLayouts = graph.createLayouts(resolvedLayouts);
							this.scopeLayoutsToCells(jsonLayouts, select);

							this.executeLayouts(jsonLayouts, function()
							{
								postProcess();
								temp();
							});

							afterInsert = null;
						}
						else if (layout == 'circle')
						{
							var circleLayout = new mxCircleLayout(graph);
							circleLayout.disableEdgeStyle = false;
		    				circleLayout.resetEdges = false;

		    				var circleLayoutIsVertexIgnored = circleLayout.isVertexIgnored;

			    			// Ignore other cells
		    				circleLayout.isVertexIgnored = function(vertex)
		    				{
		    					return circleLayoutIsVertexIgnored.apply(this, arguments) ||
		    						mxUtils.indexOf(cells, vertex) < 0;
		    				};

				    		this.executeLayout(function()
				    		{
				    			circleLayout.execute(graph.getDefaultParent());
				    			postProcess();
				    		}, true, afterInsert);

				    		afterInsert = null;
						}
						else if (layout == 'verticaltree' || layout == 'horizontaltree')
						{
			    			// Required for layouts to work with new cells
			    			graph.view.validate();

		    				var treeLayout = new mxCompactTreeLayout(graph, layout == 'horizontaltree');
		    				treeLayout.levelDistance = nodespacing;
		    				treeLayout.edgeRouting = false;
		    				treeLayout.resetEdges = false;
							treeLayout.sortEdges = true;

		    				var treeLayoutIsVertexIgnored = treeLayout.isVertexIgnored;

			    			// Ignore other cells
		    				treeLayout.isVertexIgnored = function(vertex)
		    				{
		    					return treeLayoutIsVertexIgnored.apply(this, arguments) ||
		    						mxUtils.indexOf(cells, vertex) < 0;
		    				};

		    				this.executeLayout(function()
		    	    		{
		    					treeLayout.execute(graph.getDefaultParent(), (roots.length > 0) ? roots[0] : null);
		    	    		}, true, afterInsert);

		    				afterInsert = null;
						}
						else if (layout == 'orgchart')
						{
			    			// Required for layouts to work with new cells
			    			graph.view.validate();
							
							var orgChartLayout = new mxOrgChartLayout(graph,
								2, levelspacing, nodespacing);
		
		    				var orgChartLayoutIsVertexIgnored = orgChartLayout.isVertexIgnored;
		
			    			// Ignore other cells
		    				orgChartLayout.isVertexIgnored = function(vertex)
		    				{
		    					return orgChartLayoutIsVertexIgnored.apply(this, arguments) ||
		    						mxUtils.indexOf(cells, vertex) < 0;
		    				};
		
		    	    		this.executeLayout(function()
		    	    		{
		    	    			orgChartLayout.execute(graph.getDefaultParent());
				    			postProcess();
		    	    		}, true, afterInsert);
		    	    		
		    	    		afterInsert = null;
						}
		    			else if (layout == 'organic' || (layout == 'auto' &&
		    					select.length > cells.length))
		    			{
			    			// Required for layouts to work with new cells
			    			graph.view.validate();

		    				var organicLayout = new mxFastOrganicLayout(graph);
		    				organicLayout.forceConstant = nodespacing * 3;
		    				organicLayout.disableEdgeStyle = false;
		    				organicLayout.resetEdges = false;

		    				var organicLayoutIsVertexIgnored = organicLayout.isVertexIgnored;

			    			// Ignore other cells
		    				organicLayout.isVertexIgnored = function(vertex)
		    				{
		    					return organicLayoutIsVertexIgnored.apply(this, arguments) ||
		    						mxUtils.indexOf(cells, vertex) < 0;
		    				};

		    	    		this.executeLayout(function()
		    	    		{
		    	    			organicLayout.execute(graph.getDefaultParent());
				    			postProcess();
		    	    		}, true, afterInsert);

		    	    		afterInsert = null;
		    			}
						else if (EditorUi.CSV_ELK_LAYOUTS[layout] != null)
						{
							// Required for layouts to work with new cells
							graph.view.validate();
							var temp = afterInsert;

							// Layer the CSV's `# nodespacing` / `# levelspacing`
							// / `# edgespacing` knobs onto the static ELK config
							// so they map to ELK's spacing options the same way
							// they used to map to mxHierarchicalLayout /
							// mxCompactTreeLayout's intra / inter / parallel
							// edge spacing. Done at dispatch time (not in
							// CSV_ELK_LAYOUTS) because the values come from the
							// per-import CSV header, not from static defaults.
							var elkTemplate = EditorUi.CSV_ELK_LAYOUTS[layout];
							var elkConfig = mxUtils.clone(elkTemplate.config);
							elkConfig['elk.spacing.nodeNode'] = nodespacing;
							elkConfig['elk.layered.spacing.nodeNodeBetweenLayers'] = levelspacing;
							elkConfig['elk.spacing.edgeEdge'] = edgespacing;
							elkConfig['elk.layered.spacing.edgeEdgeBetweenLayers'] = edgespacing;

							var elkLayouts = graph.createLayouts(
								[{layout: elkTemplate.layout, config: elkConfig}]);
							this.scopeLayoutsToCells(elkLayouts, select);

							// ELK runs asynchronously: prepare() returns
							// immediately and the apply pass runs in a later
							// tick. Without an extra beginUpdate the outer
							// transaction commits its insertions before the
							// layout writes its results, splitting insert +
							// layout across two undo steps. Pair this with the
							// matching endUpdate via balanceElk() in every
							// exit path so insert + layout collapse into one
							// step and the model never gets stuck above 0.
							graph.model.beginUpdate();
							var elkBalanced = false;

							var balanceElk = function()
							{
								if (!elkBalanced)
								{
									elkBalanced = true;
									graph.model.endUpdate();
								}
							};

							var self = this;

							try
							{
								elkLayouts[0].prepare(graph.getDefaultParent(),
									function(err, apply)
								{
									if (err != null)
									{
										balanceElk();
										self.handleError(err);
										return;
									}

									self.executeLayout(function()
									{
										apply();

										// ELK packs its output near (0,0);
										// anchor the laid-out cluster's
										// top-left at the free insert point
										// so the import lands on empty canvas
										// like every other CSV layout (flow
										// does the same with a static
										// (x0, y0) moveCells translation).
										var bbox = graph.getBoundingBoxFromGeometry(select);

										if (bbox != null)
										{
											graph.moveCells(select,
												x0 - bbox.x, y0 - bbox.y);
										}

										// Intentionally skipping postProcess
										// here — the legacy mxHierarchicalLayout
										// / mxCompactTreeLayout dispatches don't
										// call it either, and its width / height
										// grid-snap rounds auto-sized cells away
										// from their natural rendered widths
										// (e.g. Edward.w=218 → 220), breaking
										// the visual match with the target.
									}, true, function()
									{
										balanceElk();
										temp();
									});
								});
							}
							catch (e)
							{
								balanceElk();
								throw e;
							}

							afterInsert = null;
						}
					}
	    			
	    			this.hideDialog();
        		}
        		finally
        		{
        			graph.model.endUpdate();
        		}
				
        		if (afterInsert != null)
        		{
        			afterInsert();
        		}
    		}
		}
		catch (e)
		{
			this.handleError(e);
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getSearch = function(exclude)
	{
		var result = '';
		
		if (urlParams['offline'] != '1' && urlParams['demo'] != '1' && exclude != null && window.location.search.length > 0)
		{
			var amp = '?';
			
			for (var key in urlParams)
			{
				if (mxUtils.indexOf(exclude, key) < 0 && urlParams[key] != null)
				{
					result += amp + key + '=' + urlParams[key];
					amp = '&';
				}
			}
		}
		else
		{
			result = window.location.search;
		}
		
		return result;
	};

	/**
	 * Returns the URL for a copy of this editor with no state.
	 */
	EditorUi.prototype.getUrl = function(pathname)
	{
		var href = (pathname != null) ? pathname : window.location.pathname;
		var parms = (href.indexOf('?') > 0) ? 1 : 0;

		if (urlParams['offline'] == '1')
		{
			href += window.location.search;
		}
		else
		{
			var ignored = ['tmp', 'libs', 'clibs', 'state', 'fileId', 'code', 'share', 'notitle',
			               'data', 'url', 'embed', 'client', 'create', 'title', 'splash'];
			
			// Removes template URL parameter for new blank diagram
			for (var key in urlParams)
			{
				if (mxUtils.indexOf(ignored, key) < 0)
				{
					if (parms == 0)
					{
						href += '?';
					}
					else
					{
						href += '&';
					}
					
					if (urlParams[key] != null)
					{
						href += key + '=' + urlParams[key];
						parms++;
					}
				}
			}
		}

		return href;
	};

	/**
	 * Overrides link dialog.
	 */
	EditorUi.prototype.showLinkDialog = function(value, btnLabel, fn, showNewWindowOption, linkTarget)
	{
		var dlg = new LinkDialog(this, value, btnLabel, fn, true, showNewWindowOption, linkTarget);
		this.showDialog(dlg.container, 440, null, true, true);
		dlg.init();
	};
	
	/**
	 * Returns the number of storage options enabled
	 */
	EditorUi.prototype.getServiceCount = function(allowBrowser)
	{
		var serviceCount = 1;
		
		if (this.drive != null || typeof window.DriveClient === 'function')
		{
			serviceCount++
		}
		
		if	(this.dropbox != null || typeof window.DropboxClient === 'function')
		{
			serviceCount++
		}

		if (this.oneDrive != null || typeof window.OneDriveClient === 'function')
		{
			serviceCount++
		}

		if (this.m365 != null)
		{
			serviceCount++
		}

		if (this.gitHub != null)
		{
			serviceCount++
		}
		
		if (this.gitLab != null)
		{
			serviceCount++
		}
		
		if (allowBrowser && isLocalStorage && urlParams['browser'] == '1')
		{
			serviceCount++
		}
		
		return serviceCount;
	}

	/**
	 * Updates action and menu states depending on the file.
	 */
	EditorUi.prototype.updateUi = function()
	{
		this.updateButtonContainer();
		this.updateActionStates();
		
		// Action states that only need update for new files
		var file = this.getCurrentFile();
		var active = file != null || (urlParams['embed'] == '1' &&
			this.editor.graph.isEnabled());
		this.menus.get('viewPanels').setEnabled(active);
		this.menus.get('viewZoom').setEnabled(active);
		
		var restricted = (urlParams['embed'] != '1' || urlParams['embedRT'] == '1' ||
			!this.editor.graph.isEnabled()) &&
			(file == null || file.isRestricted());
		this.actions.get('makeCopy').setEnabled(!restricted);
		this.actions.get('print').setEnabled(!restricted);
		this.menus.get('exportAs').setEnabled(!restricted);
		this.menus.get('embed').setEnabled(!restricted);
		
		// Disables libraries and extras menu in embed mode
		// while waiting for file data
		var libsEnabled = urlParams['embed'] != '1' ||
				this.editor.graph.isEnabled();
		this.menus.get('extras').setEnabled(libsEnabled);
		
		if (Editor.enableCustomLibraries)
		{
			this.menus.get('openLibraryFrom').setEnabled(libsEnabled);
			this.menus.get('newLibrary').setEnabled(libsEnabled);
		}
		
		// Disables actions in the toolbar
		var editable = (urlParams['embed'] == '1' &&
			this.editor.graph.isEnabled()) ||
			(file != null && file.isEditable());
		this.actions.get('image').setEnabled(active);
		this.actions.get('zoomIn').setEnabled(active);
		this.actions.get('zoomOut').setEnabled(active);
		this.actions.get('smartFit').setEnabled(active);
		this.actions.get('resetView').setEnabled(active);
		
		// Disables menus
		this.menus.get('edit').setEnabled(active);
		this.menus.get('view').setEnabled(active);
		this.menus.get('importFrom').setEnabled(editable);
		this.menus.get('arrange').setEnabled(editable);
		this.menus.get('edgeShape').setEnabled(editable);
		this.menus.get('edgeStyle').setEnabled(editable);
		this.menus.get('appearance').setEnabled(mxUtils.lightDarkColorSupported);
	};
	
	/**
	 * Hook for subclassers
	 */
	EditorUi.prototype.updateButtonContainer = function()
	{
		// do nothing
	};
	
	/**
	 * Hook for subclassers
	 */
	EditorUi.prototype.scheduleSanityCheck = function()
	{
		// do nothing
	};
	
	/**
	 * Hook for subclassers
	 */
	EditorUi.prototype.stopSanityCheck = function()
	{
		// do nothing
	};

	/**
	 * Returns true if a diagram is cative and editable.
	 */
	EditorUi.prototype.isDiagramActive = function()
	{
		var file = this.getCurrentFile();
		
		return (file != null && file.isEditable()) || 
			(urlParams['embed'] == '1' && this.editor.graph.isEnabled());
	};

	/**
	 * Extends sidebar construction to add listeners for theme changes.
	 */
	EditorUi.prototype.restoreOpenLibraries = function()
	{
		var temp = this.openLibraries;
		this.openLibraries = null;

		if (temp != null)
		{
			for (var i = 0; i < temp.length; i++)
			{
				this.libraryLoaded(temp[i].file, temp[i].images,
					temp[i].title, (temp[i].div != null) ?
						temp[i].div.style.display != 'none' :
						temp[i].expand);
			}
		}
	};

	/**
	 * Updates action states depending on the selection.
	 */
	var editorUiUpdateActionStates = EditorUi.prototype.updateActionStates;
	EditorUi.prototype.updateActionStates = function()
	{
		editorUiUpdateActionStates.apply(this, arguments);

		var graph = this.editor.graph;
		var file = this.getCurrentFile();
		var ss = this.getSelectionState();
		var active = this.isDiagramActive();
		var editable = (urlParams['embed'] == '1' &&
			this.editor.graph.isEnabled()) ||
			(file != null && file.isEditable());
		this.actions.get('undo').setEnabled(this.canUndo() && editable);
		this.actions.get('redo').setEnabled(this.canRedo() && editable);
		this.actions.get('autosave').setEnabled(file != null && file.isEditable() && file.isAutosaveOptional());
		this.actions.get('guides').setEnabled(active);
		this.actions.get('editData').setEnabled(graph.isEnabled());
		this.actions.get('explore').setEnabled(active && (ss.edges.length == 1 || ss.vertices.length == 1));
		this.actions.get('editConnectionPoints').setEnabled(active && ss.edges.length == 0 && ss.vertices.length == 1);
		this.actions.get('editPolygon').setEnabled(active && ss.vertices.length == 1 &&
			ss.style[mxConstants.STYLE_SHAPE] == 'mxgraph.basic.polygon');
		this.actions.get('editImage').setEnabled(active && ss.image && ss.cells.length > 0);
		this.actions.get('crop').setEnabled(active && ss.image && ss.cells.length > 0);
		this.actions.get('pageSetup').setEnabled(active);
		this.actions.get('shadowVisible').setEnabled(active);
		this.actions.get('connectionArrows').setEnabled(active);
		this.actions.get('connectionPoints').setEnabled(active);
		this.actions.get('copyStyle').setEnabled(active && !graph.isSelectionEmpty());
		this.actions.get('pasteStyle').setEnabled(this.copiedStyle != null && active && ss.cells.length > 0);
		this.actions.get('copyTextStyle').setEnabled(active && !graph.isSelectionEmpty());
		this.actions.get('pasteTextStyle').setEnabled(this.copiedTextStyle != null && active && ss.cells.length > 0);
		this.actions.get('editGeometry').setEnabled(ss.vertices.length > 0 && !ss.transparentBounds);
		this.actions.get('addToScratchpad').setEnabled(ss.cells.length > 0);
		this.actions.get('createShape').setEnabled(active);
		this.actions.get('createRevision').setEnabled(active);
		this.actions.get('moveToFolder').setEnabled(file != null);
		this.actions.get('makeCopy').setEnabled(file != null && !file.isRestricted());
		this.actions.get('editDiagram').setEnabled(active && (file == null || !file.isRestricted()));
		this.actions.get('publishLink').setEnabled(file != null && !file.isRestricted());
		this.actions.get('removeFormat').setEnabled(graph.isEnabled() &&
			!graph.isSelectionEmpty() && !graph.isEditing());
		this.actions.get('tags').setEnabled(this.diagramContainer.style.display != 'none');
		this.actions.get('layers').setEnabled(this.diagramContainer.style.display != 'none');
		this.actions.get('outline').setEnabled(this.diagramContainer.style.display != 'none');
		this.actions.get('rename').setEnabled((file != null && file.isRenamable()) || urlParams['embed'] == '1');
		this.actions.get('close').setEnabled(file != null);
		this.actions.get('properties').setEnabled(file != null);
		this.menus.get('publish').setEnabled(file != null && !file.isRestricted());
		
		var findReplace = this.actions.get('findReplace');
		findReplace.setEnabled(this.diagramContainer.style.display != 'none');
		findReplace.label = mxResources.get('find') + ((graph.isEnabled()) ?
			'/' + mxResources.get('replace') : '');
		
		var state = graph.view.getState(graph.getSelectionCell());
		this.actions.get('editShape').setEnabled(active && state != null &&
			state.shape != null && state.shape.stencil != null);
	};

	/**
	 * Overridden to remove export dialog in chromeless lightbox.
	 */
	var editoUiDestroy = EditorUi.prototype.destroy;

	EditorUi.prototype.destroy = function()
	{
		if (this.exportDialog != null)
		{
			this.exportDialog.parentNode.removeChild(this.exportDialog);
			this.exportDialog = null;
		}
		
		editoUiDestroy.apply(this, arguments);
	};
				
	/**
	 * Overrides export dialog for using ui functions for save and setting global switches.
	 */
	if (window.ExportDialog != null)
	{
		ExportDialog.showXmlOption = false;
		ExportDialog.showGifOption = false;
		
		ExportDialog.exportFile = function(editorUi, name, format, bg, s, b, dpi, grid)
		{
			var graph = editorUi.editor.graph;
			
			if (format == 'xml')
			{
				editorUi.hideDialog();
				editorUi.saveData(name, 'xml', mxUtils.getXml(editorUi.editor.getGraphXml()), 'text/xml');
			}
		    else if (format == 'svg')
			{
		    	editorUi.hideDialog();
				editorUi.saveData(name, 'svg', mxUtils.getXml(graph.getSvg(bg, s, b)), 'image/svg+xml');
			}
		    else
		    {
		    	var data = editorUi.getFileData(true, null, null, null, null, true);
		    	var bounds = graph.getGraphBounds();
				var w = Math.floor(bounds.width * s / graph.view.scale);
				var h = Math.floor(bounds.height * s / graph.view.scale);
				
				if (data.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA)
				{
					editorUi.hideDialog();
					
					if ((format == 'png' || format == 'jpg' || format == 'jpeg') &&
						editorUi.editor.isExportToCanvas())
					{
						if (format == 'png')
						{
							editorUi.exportImage(s, bg == null || bg == 'none', true,
						   		false, false, b, true, false, null, grid, dpi);
						}
						else 
						{
							editorUi.exportImage(s, false, true,
								false, false, b, true, false, 'jpeg', grid);
						}
					}
					else 
					{
						var extras = {globalVars: graph.getExportVariables()};
						
						if (grid)
						{
							extras.grid = {
								size: graph.gridSize,
								steps: graph.view.gridSteps,
								color: graph.view.gridColor
							};
						}
						
						editorUi.saveRequest(name, format,
							function(newTitle, base64)
							{
								return new mxXmlRequest(EXPORT_URL, 'format=' + format + '&base64=' + (base64 || '0') +
									((newTitle != null) ? '&filename=' + encodeURIComponent(newTitle) : '') +
									'&extras=' + encodeURIComponent(JSON.stringify(extras)) +
									(dpi > 0? '&dpi=' + dpi : '') +
									'&bg=' + ((bg != null) ? bg : 'none') + '&w=' + w + '&h=' + h +
									'&border=' + b + '&xml=' + encodeURIComponent(data));
							});
					}
				}
				else
				{
					mxUtils.alert(mxResources.get('drawingTooLarge'));
				}
			}
		};
	}

	EditorUi.prototype.getDiagramTextContent = function()
	{
		this.editor.graph.setEnabled(false);
		var graph = this.editor.graph;
			
		var allPagesTxt = '';
		
		if (this.pages != null)
		{
			for (var i = 0; i < this.pages.length; i++)
			{
				var pageGraph = graph;
				
				if (this.currentPage != this.pages[i])
				{
					pageGraph = this.createTemporaryGraph(graph.getStylesheet());
					this.updatePageRoot(this.pages[i]);
					pageGraph.model.setRoot(this.pages[i].root);								
				}
				allPagesTxt += this.pages[i].getName() + ' ' + pageGraph.getIndexableText() + ' ';
			}
		}
		else
		{
			allPagesTxt = graph.getIndexableText();
		}
		
		this.editor.graph.setEnabled(true);
		return allPagesTxt;
	};

	/**
	 * Writes the label of the given cell to the result object. If the cell uses
	 * HTML labels and the label contains markup, the plain text is written to
	 * "label" and the original markup to "html"; otherwise the raw label is
	 * written to "label". Empty labels are ignored.
	 */
	EditorUi.prototype.writeJsonLabel = function(cell, label, result)
	{
		if (label == null || label == '')
		{
			return;
		}

		if (this.editor.graph.isHtmlLabel(cell))
		{
			var tmp = document.createElement('div');
			tmp.innerHTML = Graph.sanitizeHtml(label);

			if (tmp.getElementsByTagName('*').length > 0)
			{
				result.label = mxUtils.trim(mxUtils.extractTextWithWhitespace([tmp]));
				result.html = label;

				return;
			}
		}

		result.label = label;
	};

	/**
	 * Returns a JSON representation of the given cell containing its structure
	 * (id, type, parent and for edges source/target) plus label and metadata,
	 * but no styles or geometry. Used by the JSON export (createJsonForExport).
	 * Metadata are the custom attributes of object/UserObject cells (all
	 * attributes except label, placeholders and id).
	 */
	EditorUi.prototype.getJsonForExportCell = function(cell, isLayer)
	{
		var result = {id: cell.getId()};

		result.type = isLayer ? 'layer' : (cell.edge ? 'edge' :
			(cell.vertex ? 'node' : 'group'));

		if (!isLayer)
		{
			var parent = cell.getParent();

			if (parent != null)
			{
				result.parent = parent.getId();
			}
		}

		if (cell.edge)
		{
			if (cell.source != null)
			{
				result.source = cell.source.getId();
			}

			if (cell.target != null)
			{
				result.target = cell.target.getId();
			}
		}

		var value = cell.value;

		if (value != null && mxUtils.isNode(value))
		{
			this.writeJsonLabel(cell, value.getAttribute('label'), result);

			var attrs = value.attributes;
			var metadata = {};
			var count = 0;

			for (var i = 0; i < attrs.length; i++)
			{
				var name = attrs[i].nodeName;

				if (name != 'label' && name != 'placeholders' && name != 'id')
				{
					metadata[name] = attrs[i].nodeValue;
					count++;
				}
			}

			if (count > 0)
			{
				result.metadata = metadata;
			}
		}
		else if (typeof value === 'string')
		{
			this.writeJsonLabel(cell, value, result);
		}

		return result;
	};

	/**
	 * Returns a JSON object {id, name, cells} for the given page (or the
	 * current page if page is null). Walks all layers and their descendants
	 * and serializes each cell via getJsonForExportCell.
	 */
	EditorUi.prototype.getJsonForPage = function(page, selectionCells)
	{
		var graph = this.editor.graph;
		var model = graph.getModel();
		var root;

		if (page == null || page == this.currentPage)
		{
			root = model.getRoot();
		}
		else
		{
			root = this.updatePageRoot(page).root;
		}

		var cells = [];

		var addCell = mxUtils.bind(this, function(cell, isLayer)
		{
			cells.push(this.getJsonForExportCell(cell, isLayer));
			var childCount = cell.getChildCount();

			for (var i = 0; i < childCount; i++)
			{
				addCell(cell.getChildAt(i), false);
			}
		});

		if (selectionCells != null)
		{
			// Exports the selected cells and their descendants, skipping cells
			// whose ancestor is also selected to avoid duplicates
			var selected = {};

			for (var i = 0; i < selectionCells.length; i++)
			{
				selected[selectionCells[i].getId()] = true;
			}

			for (var i = 0; i < selectionCells.length; i++)
			{
				var cell = selectionCells[i];
				var ancestor = cell.getParent();
				var nested = false;

				while (ancestor != null)
				{
					if (selected[ancestor.getId()])
					{
						nested = true;
						break;
					}

					ancestor = ancestor.getParent();
				}

				if (!nested)
				{
					addCell(cell, model.isLayer(cell));
				}
			}
		}
		else
		{
			var layerCount = root.getChildCount();

			for (var i = 0; i < layerCount; i++)
			{
				addCell(root.getChildAt(i), true);
			}
		}

		var result = {};

		if (page != null)
		{
			result.id = page.getId();
			result.name = page.getName();
		}

		result.cells = cells;

		return result;
	};

	/**
	 * Returns a JSON object describing the diagram structure and metadata for
	 * export. Contains a version, an optional copy of the (optionally
	 * compressed) diagram XML under "data", and the structural representation
	 * of the current page or all pages under "pages". Styles and geometry are
	 * intentionally omitted so the result is easy to consume by external tools
	 * and LLMs; the optional "data" copy allows lossless re-import.
	 */
	EditorUi.prototype.createJsonForExport = function(allPages, includeData, compressed, selection)
	{
		var result = {version: EditorUi.VERSION};

		if (includeData)
		{
			result.data = mxUtils.getXml(this.getXmlFileData(!selection, !allPages, !compressed));
		}

		var pages = [];

		if (selection)
		{
			pages.push(this.getJsonForPage(this.currentPage,
				this.editor.graph.getSelectionCells()));
		}
		else if (allPages && this.pages != null)
		{
			for (var i = 0; i < this.pages.length; i++)
			{
				pages.push(this.getJsonForPage(this.pages[i]));
			}
		}
		else
		{
			pages.push(this.getJsonForPage(this.currentPage));
		}

		result.pages = pages;

		return result;
	};

	EditorUi.prototype.showRemotelyStoredLibrary = function(title)
	{
		var selectedLibs = {};
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';
		var graph = this.editor.graph;
		
		var hd = document.createElement('h3');
		mxUtils.write(hd, mxUtils.htmlEntities(title));
		hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:12px';
		div.appendChild(hd);

		var libsSection = document.createElement('div');
		libsSection.style.cssText = 'border:1px solid lightGray;overflow: auto;height:300px';

		libsSection.innerHTML = '<div style="text-align:center;padding:8px;"><img src="' + IMAGE_PATH + '/spin.gif"></div>';
		
		var loadedLibs = {};
		
		try
		{
			var custLibs = mxSettings.getCustomLibraries();
			
			for (var j = 0; j < custLibs.length; j++)
			{
				var l = custLibs[j];
				
				if (l.substring(0, 1) == 'R')
				{
					var libDesc = JSON.parse(decodeURIComponent(l.substring(1)));
					loadedLibs[libDesc[0]] = {
						id: libDesc[0], 
               			title: libDesc[1], 
               			downloadUrl: libDesc[2]
					};
				}
			}
		}
		catch(e){}

		this.remoteInvoke('getCustomLibraries', null, null, function(libsList)
		{
			libsSection.innerText = '';
			
			if (libsList.length == 0)
			{
				libsSection.innerHTML = '<div style="text-align:center;padding-top:20px;color:gray;">' +
					mxUtils.htmlEntities(mxResources.get('noLibraries')) + '</div>';
			}
			else
			{
				for (var i = 0; i < libsList.length; i++)
				{
					var lib = libsList[i];
					
					if (loadedLibs[lib.id])
					{
						selectedLibs[lib.id] = lib;
					}
					
					var libCheck = this.addCheckbox(libsSection, lib.title, loadedLibs[lib.id]); 
	
					(function(lib2, check)
					{
						mxEvent.addListener(check, 'change', function()
						{
							if (this.checked)
							{
								selectedLibs[lib2.id] = lib2;
							}
							else
							{
								delete selectedLibs[lib2.id];
							}
						});
					})(lib, libCheck)
				}
			}
		}, mxUtils.bind(this, function(e)
		{
			libsSection.innerText = '';
			var status = document.createElement('div');
			status.style.padding = '8px';
			status.style.textAlign = 'center';
			mxUtils.write(status, mxResources.get('error') + ': ');
			mxUtils.write(status, (e != null && e.message != null) ?
				e.message : mxResources.get('unknownError'));
			libsSection.appendChild(status);
		}));

		div.appendChild(libsSection);
		
		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			this.spinner.spin(document.body, mxResources.get('loading'));
			var pendingLibs = 0;
			
			for (var id in selectedLibs)
			{
				if (loadedLibs[id] != null) continue; //already loaded!
				
				pendingLibs++;
				
				(mxUtils.bind(this, function(lib)
				{
					this.remoteInvoke('getFileContent', [lib.downloadUrl], null, mxUtils.bind(this, function(libContent)
					{
						pendingLibs--;
						
						if (pendingLibs == 0) this.spinner.stop();
						
						try
						{
							this.loadLibrary(new RemoteLibrary(this, libContent, lib));
							this.showSidebar();
						}
						catch (e)
						{
							this.handleError(e, mxResources.get('errorLoadingFile'));
						}
					}), mxUtils.bind(this, function()
					{
						pendingLibs--;
						
						if (pendingLibs == 0) this.spinner.stop();
						
						this.handleError(null, mxResources.get('errorLoadingFile'));
					}));
				}))(selectedLibs[id]);
			}
			
			for (var id in loadedLibs)
			{
				if (!selectedLibs[id]) //Removed
				{
					this.closeLibrary(new RemoteLibrary(this, null, loadedLibs[id])); //create a dummy library such that we can call closeLibrary
				}
			}
			
			if (pendingLibs == 0) this.spinner.stop();
		}), null, null, 'https://www.drawio.com/doc/faq/custom-libraries-confluence-cloud');
		this.showDialog(dlg.container, 340, 390, true, true, null, null, null, null, true);
	};
	
	//Remote invokation, currently limited to functions in EditorUi (and its sub objects) for security reasons
	//White-listed functions and some info about it
	EditorUi.prototype.remoteInvokableFns = {
		getDiagramTextContent: {isAsync: false},
		getLocalStorageFile: {isAsync: false, allowedDomains: ['app.diagrams.net']},
		getLocalStorageFileNames: {isAsync: false, allowedDomains: ['app.diagrams.net']},
		setMigratedFlag: {isAsync: false, allowedDomains: ['app.diagrams.net']}
	};
	
	EditorUi.prototype.remoteInvokeCallbacks = [];
	EditorUi.prototype.remoteInvokeQueue = [];

	EditorUi.prototype.handleRemoteInvokeReady = function(remoteWin)
	{
		this.remoteWin = remoteWin;
		
		for (var i = 0; i < this.remoteInvokeQueue.length; i++)
		{
			remoteWin.postMessage(this.remoteInvokeQueue[i], '*');
		}
		
		this.remoteInvokeQueue = [];
	};
	
	EditorUi.prototype.handleRemoteInvokeResponse = function(msg)
	{
		var msgMarkers = msg.msgMarkers;
		var callback = this.remoteInvokeCallbacks[msgMarkers.callbackId];
		
		if (callback == null)
		{
			throw new Error('No callback for ' + ((msgMarkers != null) ? msgMarkers.callbackId : 'null'));
		}
		else if (msg.error)
		{
			if (callback.error) callback.error(msg.error.errResp);
		}
		else if (callback.callback)
		{
			callback.callback.apply(this, msg.resp);
		}
			
		this.remoteInvokeCallbacks[msgMarkers.callbackId] = null; //set it to null only to keep the index
	};

	EditorUi.prototype.remoteInvoke = function(remoteFn, remoteFnArgs, msgMarkers, callback, error)
	{
		var acceptResponse = true;
		
		var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
		{
			acceptResponse = false;
			error({code: App.ERROR_TIMEOUT, message: mxResources.get('timeout')});
		}), this.timeout);

		var wrapper = mxUtils.bind(this, function()
		{
	    	window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				callback.apply(this, arguments);
			}
		});
		
		var errWrapper = mxUtils.bind(this, function()
		{
	    	window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				error.apply(this, arguments);
			}
		});
		
		msgMarkers = msgMarkers || {};
		msgMarkers.callbackId = this.remoteInvokeCallbacks.length;
		this.remoteInvokeCallbacks.push({callback: wrapper, error: errWrapper});
		var msg = JSON.stringify({event: 'remoteInvoke', funtionName: remoteFn, functionArgs: remoteFnArgs, msgMarkers: msgMarkers});
		
		if (this.remoteWin != null) //remote invoke is ready
		{
			this.remoteWin.postMessage(msg, '*');
		}
		else
		{
			this.remoteInvokeQueue.push(msg);
		}
	};

	EditorUi.prototype.handleRemoteInvoke = function(msg, origin)
	{
		var sendResponse = mxUtils.bind(this, function(resp, error)
		{
			var respMsg = {event: 'remoteInvokeResponse', msgMarkers: msg.msgMarkers};
			
			if (error != null)
			{
				respMsg.error = {errResp: error};
			}
			else if (resp != null) 
			{
				respMsg.resp = resp;
			}
			
			this.remoteWin.postMessage(JSON.stringify(respMsg), '*');
		});
		
		try
		{
			//Remote invoke are allowed to call functions in AC
			var funtionName = msg.funtionName;
			var functionInfo = this.remoteInvokableFns[funtionName];
			
			if (functionInfo != null && typeof this[funtionName] === 'function')
			{
				if (functionInfo.allowedDomains)
				{
					var allowed = false;
					
					for (var i = 0; i < functionInfo.allowedDomains.length; i++)
					{
						if (origin == 'https://' + functionInfo.allowedDomains[i])
						{
							allowed = true;
							break;
						}
					}
					
					if (!allowed)
					{
						sendResponse(null, 'Invalid Call: ' + funtionName + ' is not allowed.');
						return;
					}
				}
				
				var functionArgs = msg.functionArgs;
				
				//Confirm functionArgs are not null and is array, otherwise, discard it
				if (!Array.isArray(functionArgs))
				{
					functionArgs = [];
				}
				
				//for functions with callbacks (async) we assume last two arguments are success, error
				if (functionInfo.isAsync)
				{
					//success
					functionArgs.push(function() 
					{
						sendResponse(Array.prototype.slice.apply(arguments));
					});
					
					//error
					functionArgs.push(function(err) 
					{
						sendResponse(null, err || 'Unkown Error');
					});
					
					this[funtionName].apply(this, functionArgs);
				}
				else
				{
					var resp = this[funtionName].apply(this, functionArgs);
					
					sendResponse([resp]);
				}
			}
			else
			{
				sendResponse(null, 'Invalid Call: ' + funtionName + ' is not found.');
			}
		}
		catch(e)
		{
			sendResponse(null, 'Invalid Call: An error occurred, ' + e.message);
		}
	};
	
	/**
	 * Opens the application keystore.
	 */
	EditorUi.prototype.openDatabase = function(success, error)
	{
		if (this.database == null)
		{
			var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
			
			if (indexedDB != null)
			{
				try
				{
					var req = indexedDB.open('database', 2);
					
					req.onupgradeneeded = function(e)
					{
						try
						{
							var db = req.result;
							
							if (e.oldVersion < 1)
							{
							    // Version 1 is the first version of the database.
								db.createObjectStore('objects', {keyPath: 'key'});
							}
							
							if (e.oldVersion < 2)
							{
								// Version 2 introduces browser file storage.
								db.createObjectStore('files', {keyPath: 'title'});
								db.createObjectStore('filesInfo', {keyPath: 'title'});
								EditorUi.migrateStorageFiles = isLocalStorage;
							}
						}
						catch (e)
						{
							if (error != null)
							{
								error(e);
							}
						}
					}
					
					req.onsuccess = mxUtils.bind(this, function(e)
					{
						try
						{
							var db = req.result;
							this.database = db;

							if (EditorUi.migrateStorageFiles)
							{
								StorageFile.migrate(db);
								EditorUi.migrateStorageFiles = false;
							}

							if (location.host == 'app.diagrams.net' && !this.drawioMigrationStarted)
							{
								this.drawioMigrationStarted = true;
								
								this.getDatabaseItem('.drawioMigrated3', mxUtils.bind(this, function(value)
								{
									if (value && urlParams['forceMigration'] != '1') //Already migrated
									{
										return;
									}
									
									if (urlParams['forceMigration'] == '1')
									{
										var drawioFrame = document.createElement('iframe');
										drawioFrame.style.display = 'none';
										drawioFrame.setAttribute('src', 'https://www.draw.io?embed=1&proto=json&forceMigration=' + urlParams['forceMigration']);
										document.body.appendChild(drawioFrame);
										var collectNames = true, allDone = false;
										var fileNames, index = 0;
										
										var markAsMigrated = mxUtils.bind(this, function()
										{
											allDone = true;
											this.setDatabaseItem('.drawioMigrated3', true);
											drawioFrame.contentWindow.postMessage(JSON.stringify({action: 'remoteInvoke', funtionName: 'setMigratedFlag'}), '*');
										});
										
										var next = mxUtils.bind(this, function()
										{
											index++;
											fetchOneFile();
										});
										
										var fetchOneFile = mxUtils.bind(this, function()
										{
											try
											{
												if (index >= fileNames.length)
												{
													markAsMigrated();
													return;
												}
												
												var fileTitle = fileNames[index];
												
												StorageFile.getFileContent(this, fileTitle, mxUtils.bind(this, function(data)
												{
													if (data == null || (fileTitle == '.scratchpad' && data == this.emptyLibraryXml)) //Don't overwrite
													{
														drawioFrame.contentWindow.postMessage(JSON.stringify({action: 'remoteInvoke', funtionName: 'getLocalStorageFile', functionArgs: [fileTitle]}), '*');
													}
													else
													{
														next();
													}
												}), next);  //Ignore errors
											}
											catch(e)
											{
												//Log error
												console.log(e);
											}
										});
										
										var importOneFile = mxUtils.bind(this, function(file)
										{
											try
											{
												this.setDatabaseItem(null, [{
													title: file.title,
													size: file.data.length,
													lastModified: Date.now(),
													type: file.isLib? 'L' : 'F'
												}, {
													title: file.title,
													data: file.data
												}], next, next /* Ignore errors */, ['filesInfo', 'files']);
											}
											catch(e)
											{
												//Log error
												console.log(e);
											}
										});
												
										var messageListener = mxUtils.bind(this, function(evt)
										{
											try
											{
												//Only accept messages from migration iframe
												if (evt.source != drawioFrame.contentWindow)
												{
													return;
												}
												
												var drawMsg = {};
												
												try
												{
													drawMsg = JSON.parse(evt.data);
												}
												catch(e){} //Ignore
											
												if (drawMsg.event == 'init')
												{
													drawioFrame.contentWindow.postMessage(JSON.stringify({action: 'remoteInvokeReady'}), '*');
													drawioFrame.contentWindow.postMessage(JSON.stringify({action: 'remoteInvoke', funtionName: 'getLocalStorageFileNames'}), '*');
												}
												else if (drawMsg.event == 'remoteInvokeResponse' && !allDone)
												{
													if (collectNames)
													{
														if (drawMsg.resp != null && drawMsg.resp.length > 0 && drawMsg.resp[0] != null)
														{
															fileNames = drawMsg.resp[0];
															collectNames = false;
															fetchOneFile();
														}
														else
														{
															//Nothing in draw.io localStorage
															markAsMigrated();
														}
													}
													else
													{
														//Add the file, then move to the next
														if (drawMsg.resp != null && drawMsg.resp.length > 0 && drawMsg.resp[0] != null)
														{
															importOneFile(drawMsg.resp[0]);
														}
														else
														{
															next();
														}
													}
												}
											}
											catch(e)
											{
												console.log(e);
											}
										});
			
										window.addEventListener('message', messageListener);
									}
								})); //Ignore errors
							}
								
							success(db);
							
							db.onversionchange = function() 
							{
								//TODO Handle DB revision update while code is running
								//		Save open file and request a page reload before closing the DB
								db.close();
							};
						}
						catch (e)
						{
							// Warn if error handler is not set
							if (error != null)
							{
								error(e);
							}
							else if (window.console != null)
							{
								console.warn(e);
							}
						};
					});
					
					req.onerror = error;
					
					req.onblocked = function() 
					{
						//TODO Use this when a new version is introduced
						// there's another open connection to same database
						// and it wasn't closed after db.onversionchange triggered for them
					};
				}
				catch (e)
				{
					// Warn if error handler is not set
					if (error != null)
					{
						error(e);
					}
					else if (window.console != null)
					{
						console.error(e);
					}
				}
			}
			else if (error != null)
			{
				error(new Error('IndexedDB not supported'));
			}
		}
		else
		{
			success(this.database);
		}
	};
	
	/**
	 * Add/Update item(s) in the database. It supports multiple stores transactions by sending an array of data, storeName 
	 * (key is optional, can be an array also if multiple stores are needed)
	 */
	EditorUi.prototype.setDatabaseItem = function(key, data, success, error, storeName)
	{
		this.openDatabase(mxUtils.bind(this, function(db)
		{
			try
			{
				storeName = storeName || 'objects';
				
				if (!Array.isArray(storeName))
				{
					storeName = [storeName];
					key = [key];
					data = [data];
				}
				
				var trx = db.transaction(storeName, 'readwrite');
				trx.oncomplete = success;
				trx.onerror = error;
		        
				for (var i = 0; i < storeName.length; i++)
				{
					trx.objectStore(storeName[i]).put(key != null && key[i] != null? {key: key[i], data: data[i]} : data[i]);
				}
			}
			catch (e)
			{
				if (error != null)
				{
					error(e);
				}
			}
		}), error);
	};

	/**
	 * Removes the item for the given key from the database.
	 */
	EditorUi.prototype.removeDatabaseItem = function(key, success, error, storeName)
	{
		this.openDatabase(mxUtils.bind(this, function(db)
		{
			try
			{
				storeName = storeName || 'objects';
				
				if (!Array.isArray(storeName))
				{
					storeName = [storeName];
					key = [key];
				}
				
				var trx = db.transaction(storeName, 'readwrite');
				trx.oncomplete = success;
				trx.onerror = error;
				
				for (var i = 0; i < storeName.length; i++)
				{
					trx.objectStore(storeName[i]).delete(key[i]);
				}
			}
	        catch (e)
			{
				if (error != null)
				{
					error(e);
				}
			}
		}), error);
	};
	
	/**
	 * Returns one item from the database.
	 */
	EditorUi.prototype.getDatabaseItem = function(key, success, error, storeName)
	{
		this.openDatabase(mxUtils.bind(this, function(db)
		{
			try
			{
				storeName = storeName || 'objects';
				var trx = db.transaction([storeName], 'readonly');
				var req = trx.objectStore(storeName).get(key);
				
				req.onsuccess = function()
				{
					success(req.result);
				};
				
		        req.onerror = error;
			}
	        catch (e)
			{
				if (error != null)
				{
					error(e);
				}
			}
		}), error);
	};
	
	/**
	 * Returns all items from the database.
	 */
	EditorUi.prototype.getDatabaseItems = function(success, error, storeName)
	{
		this.openDatabase(mxUtils.bind(this, function(db)
		{
			try
			{
				storeName = storeName || 'objects';
				var trx = db.transaction([storeName], 'readonly');
				var req = trx.objectStore(storeName).openCursor(
					IDBKeyRange.lowerBound(0));
				var items = [];
				
				req.onsuccess = function(e)
				{
					if (e.target.result == null)
					{
						success(items);
					}
					else
					{
						items.push(e.target.result.value);
						e.target.result.continue();
					}
		        };
		        
		        req.onerror = error;
			}
			catch (e)
			{
				if (error != null)
				{
					error(e);
				}
			}
		}), error);
	};
	
	/**
	 * Returns all item keys from the database.
	 */
	EditorUi.prototype.getDatabaseItemKeys = function(success, error, storeName)
	{
		this.openDatabase(mxUtils.bind(this, function(db)
		{
			try
			{
				storeName = storeName || 'objects';
				var trx = db.transaction([storeName], 'readonly');
				var req = trx.objectStore(storeName).getAllKeys();
				
				req.onsuccess = function()
				{
					success(req.result);
		        };
		        
		        req.onerror = error;
			}
			catch (e)
			{
				if (error != null)
				{
					error(e);
				}
			}
		}), error);
	};
	/**
	 * Comments: We need these functions as wrapper of File functions in order to facilitate
	 * overriding them if comments are needed without having a file (e.g. Confluence Plugin)
	 */
	
	/**
	 * Are comments supported
	 */
	EditorUi.prototype.commentsSupported = function()
	{
		var file = this.getCurrentFile();
		
		return file != null? file.commentsSupported() : false;
	};

	/**
	 * Show refresh button?
	 */
	EditorUi.prototype.commentsRefreshNeeded = function()
	{
		var file = this.getCurrentFile();
		
		return file != null? file.commentsRefreshNeeded() : true;
	};
	
	/**
	 * Show save button?
	 */
	EditorUi.prototype.commentsSaveNeeded = function()
	{
		var file = this.getCurrentFile();

		return file != null? file.commentsSaveNeeded() : false;
	};
	
	/**
	 * Get comments
	 */
	EditorUi.prototype.getComments = function(success, error)
	{
		var file = this.getCurrentFile();
		
		if (file != null)
		{
			file.getComments(success, error);
		}
		else 
		{
			success([]); //placeholder
		}
	};

	/**
	 * Add a comment
	 */
	EditorUi.prototype.addComment = function(comment, success, error)
	{
		var file = this.getCurrentFile();
		
		if (file != null)
		{
			file.addComment(comment, success, error);
		}
		else 
		{
			success(Date.now()); //placeholder
		}
	};

	/**
	 * Can add a reply to a reply
	 */
	EditorUi.prototype.canReplyToReplies = function()
	{
		var file = this.getCurrentFile();
			
		return file != null? file.canReplyToReplies() : true;
	};

	/**
	 * Can add comments (The permission to comment)
	 */
	EditorUi.prototype.canComment = function()
	{
		var file = this.getCurrentFile();
		
		return file != null? file.canComment() : true;
	};

	/**
	 * Get a new comment object
	 */
	EditorUi.prototype.newComment = function(content, user)
	{
		var file = this.getCurrentFile();
		
		if (file != null)
		{
			return file.newComment(content, user)
		}
		else 
		{
			return new DrawioComment(this, null, content, Date.now(), Date.now(), false, user);
		}
	};
	
	//==================================================== End of comments =================================================================
	
	/**
	 * Does revisions history available
	 */
	EditorUi.prototype.isRevisionHistorySupported = function()
	{
		var file = this.getCurrentFile();
		
		return file != null && file.isRevisionHistorySupported();
	};

	/**
	 * Get revisions of current file
	 */
	EditorUi.prototype.getRevisions = function(success, error)
	{
		var file = this.getCurrentFile();
		
		if (file != null && file.getRevisions)
		{
			file.getRevisions(success, error);
		}
		else
		{
			error({message: mxResources.get('unknownError')});
		}
	};
	
	/**
	 * Is revisions history enabled
	 */
	EditorUi.prototype.isRevisionHistoryEnabled = function()
	{
		var file = this.getCurrentFile();
		
		return file != null &&
				((file.constructor == DriveFile && file.isEditable()) ||
				file.constructor == DropboxFile);
	};
	
	//===========Adding methods to find the service running draw.io and allowing calling draw.io remote services
	EditorUi.prototype.getServiceName = function()
	{
		return 'draw.io';
	};
	
	EditorUi.prototype.vsdxExportEnabled = function()
	{
		return this.getServiceName() == 'atlassian';
	};

	EditorUi.prototype.addRemoteServiceSecurityCheck = function(xhr)
	{
		//Using a standard header with specific sequence
		xhr.setRequestHeader('Content-Language', 'da, mi, en, de-DE');
	};
	
	//===========To Be Removed Soon==========
	EditorUi.prototype.loadUrl = function(url, success, error, forceBinary, retry, dataUriPrefix, noBinary, headers)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: loadUrl');
		return this.editor.loadUrl(url, success, error, forceBinary, retry, dataUriPrefix, noBinary, headers);	
	};
	
	EditorUi.prototype.loadFonts = function(then)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: loadFonts');
		return this.editor.loadFonts(then);	
	};
	
	EditorUi.prototype.createSvgDataUri = function(svg)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: createSvgDataUri');
		return Editor.createSvgDataUri(svg);	
	};
	
    EditorUi.prototype.embedCssFonts = function(fontCss, then)
    {
		EditorUi.logEvent('SHOULD NOT BE CALLED: embedCssFonts');
		return this.editor.embedCssFonts(fontCss, then);	
	};
	
    EditorUi.prototype.embedExtFonts = function(callback)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: embedExtFonts');
		return this.editor.embedExtFonts(callback);	
	};
	
	EditorUi.prototype.exportToCanvas = function(callback, width, imageCache, background, error, limitHeight,
			ignoreSelection, scale, transparentBackground, addShadow, converter, graph, border, noCrop, grid, theme)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: exportToCanvas');
		return this.editor.exportToCanvas(callback, width, imageCache, background, error, limitHeight,
			ignoreSelection, scale, transparentBackground, addShadow, converter, graph, border,
			noCrop, grid, theme);	
	};
	
	EditorUi.prototype.createImageUrlConverter = function()
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: createImageUrlConverter');
		return this.editor.createImageUrlConverter();	
	};
	
	EditorUi.prototype.convertImages = function(svgRoot, callback, imageCache, converter)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: convertImages');
		return this.editor.convertImages(svgRoot, callback, imageCache, converter);	
	};
	
	EditorUi.prototype.convertImageToDataUri = function(url, callback)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: convertImageToDataUri');
		return this.editor.convertImageToDataUri(url, callback);	
	};
	
	EditorUi.prototype.base64Encode = function(str)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: base64Encode');
		return Editor.base64Encode(str);	
	};
	
	EditorUi.prototype.updateCRC = function(crc, data, off, len)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: updateCRC');
		return Editor.updateCRC(crc, data, off, len);	
	};
	
	EditorUi.prototype.crc32 = function(str)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: crc32');
		return Editor.crc32(str);	
	};
	
	EditorUi.prototype.writeGraphModelToPng = function(data, type, key, value, error)
	{
		EditorUi.logEvent('SHOULD NOT BE CALLED: writeGraphModelToPng');
		return Editor.writeGraphModelToPng(data, type, key, value, error);
	};
	
	//=======End of To Be Removed Soon==========
	
	EditorUi.prototype.getLocalStorageFileNames = function()
	{
		if (localStorage.getItem('.localStorageMigrated') == '1' && urlParams['forceMigration'] != '1')
		{
			return null;
		}
		
		var files = [];
		
		for (var i = 0; i < localStorage.length; i++)
		{
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			
			if (key.length > 0 && (key == '.scratchpad' || key.charAt(0) != '.') && value.length > 0)
			{
				var isFile = (value.substring(0, 8) === '<mxfile ' ||
							value.substring(0, 5) === '<?xml' || value.substring(0, 12) === '<!--[if IE]>');
				var isLib = (value.substring(0, 11) === '<mxlibrary>');

				if (isFile || isLib)
				{
					files.push(key);
				}	
			}
		}
		
		return files;
	};
	
	EditorUi.prototype.getLocalStorageFile = function(key)
	{
		if (localStorage.getItem('.localStorageMigrated') == '1' && urlParams['forceMigration'] != '1')
		{
			return null;
		}
		
		var value = localStorage.getItem(key);
		return {title: key, data: value, isLib: value.substring(0, 11) === '<mxlibrary>'};
	};
	
	EditorUi.prototype.setMigratedFlag = function()
	{
		localStorage.setItem('.localStorageMigrated', '1');	
	};
})();

/**
 * Comments Window, It is used by both editor and viewer. So, it is here in a common place
 */
var CommentsWindow = function(editorUi, x, y, w, h, saveCallback)
{
	var readOnly = !editorUi.canComment();
	var canReplyToReplies = editorUi.canReplyToReplies();
	var curEdited = null;
		
	var div = document.createElement('div');
	div.className = 'geCommentsWin';
	// div.style.background = 'light-dark(whiteSmoke, ' + Editor.darkColor + ')';

	var tbarHeight = (!EditorUi.compactUi) ? '30px' : '26px';
	
	var listDiv = document.createElement('div');
	listDiv.className = 'geCommentsList';
	// listDiv.style.backgroundColor = 'light-dark(whiteSmoke, ' + Editor.darkColor + ')';
	listDiv.style.bottom = (parseInt(tbarHeight) + 7) + 'px';
	div.appendChild(listDiv);
	
	var noComments = document.createElement('span');
	noComments.style.cssText = 'display:none;padding-top:10px;text-align:center;';
	mxUtils.write(noComments, mxResources.get('noCommentsFound'));
	
	var ldiv = document.createElement('div');
	
	ldiv.className = 'geToolbarContainer geCommentsToolbar';
	ldiv.style.height = tbarHeight;
	ldiv.style.padding = '3px 4px 4px 4px';
	
	var link = document.createElement('a');
	link.className = 'geButton';
	
	function updateNoComments()
	{
		var divs = listDiv.getElementsByTagName('div');
		var visibleCount = 0;
		
		for (var i = 0; i < divs.length; i++)
		{
			if (divs[i].style.display != 'none' && divs[i].parentNode == listDiv)
			{
				visibleCount++;
			}
		}
		
		noComments.style.display = (visibleCount == 0) ? 'block' : 'none';
	};
	
	function editComment(comment, cdiv, saveCallback, deleteOnCancel)
	{
		curEdited = {div: cdiv, comment: comment, saveCallback: saveCallback, deleteOnCancel: deleteOnCancel};
		
		var commentTxt = cdiv.querySelector('.geCommentTxt');
		var actionsDiv = cdiv.querySelector('.geCommentActionsList');
		
		var textArea = document.createElement('textarea');
		textArea.className = 'geCommentEditTxtArea';
		textArea.style.minHeight = commentTxt.offsetHeight + 'px';
		textArea.value = comment.content;
		cdiv.insertBefore(textArea, commentTxt);
		
		var btnDiv = document.createElement('div');
		btnDiv.className = 'geCommentEditBtns';
		
		function reset()
		{
			cdiv.removeChild(textArea);
			cdiv.removeChild(btnDiv);
			actionsDiv.style.display = 'block';
			commentTxt.style.display = 'block';	
		};
		
		var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
		{
			if (deleteOnCancel)
			{
				cdiv.parentNode.removeChild(cdiv);
				updateNoComments();
			}
			else
			{
				reset();
			}
			
			curEdited = null;
		});
		
		cancelBtn.className = 'geCommentEditBtn';
		btnDiv.appendChild(cancelBtn);
		
		var saveBtn = mxUtils.button(mxResources.get('save'), function()
		{
			commentTxt.innerText = '';
			comment.content = textArea.value;
			mxUtils.write(commentTxt, comment.content);
			reset();
			saveCallback(comment);
			curEdited = null;
		});
		
		// Updates modified state and handles placeholder text
		mxEvent.addListener(textArea, 'keydown', mxUtils.bind(this, function(evt)
		{
			if (!mxEvent.isConsumed(evt))
			{
				if ((mxEvent.isControlDown(evt) || (mxClient.IS_MAC &&
					mxEvent.isMetaDown(evt))) && evt.keyCode == 13 /* Ctrl+Enter */)
				{
					saveBtn.click();
					mxEvent.consume(evt);
				}
				else if (evt.keyCode == 27 /* Escape */)
				{
					cancelBtn.click();
					mxEvent.consume(evt);
				}
			}
		}));
		
		// Focused to include in viewport before focusin textbox
		saveBtn.focus();
		saveBtn.className = 'geCommentEditBtn gePrimaryBtn';
		btnDiv.appendChild(saveBtn);

		cdiv.insertBefore(btnDiv, commentTxt);
		actionsDiv.style.display = 'none';
		commentTxt.style.display = 'none';
		textArea.focus();
	};
	
	function writeCommentDate(comment, dateDiv)
	{
		dateDiv.innerText = '';
		var ts = new Date(comment.modifiedDate);
		var str = editorUi.timeSince(ts);
		
		if (str == null)
		{
			str = mxResources.get('lessThanAMinute');
		}
		
		mxUtils.write(dateDiv, mxResources.get('timeAgo', [str], '{1} ago'));
		dateDiv.setAttribute('title', ts.toLocaleDateString() + ' ' +
				ts.toLocaleTimeString());
	};
	
	function showBusy(commentDiv)
	{
		var busyImg = document.createElement('img');
		busyImg.className = 'geCommentBusyImg';
		busyImg.src= IMAGE_PATH + '/spin.gif';
		commentDiv.appendChild(busyImg);
		commentDiv.busyImg = busyImg;
	};
	
	function showError(commentDiv)
	{
		commentDiv.style.border = '1px solid red';

		if (commentDiv.busyImg.parentNode == commentDiv)
		{
			commentDiv.removeChild(commentDiv.busyImg);
		}
	};
	
	function showDone(commentDiv)
	{
		commentDiv.style.border = '';
		
		if (commentDiv.busyImg.parentNode == commentDiv)
		{
			commentDiv.removeChild(commentDiv.busyImg);
		}
	};

	function addComment(comment, parentArr, parent, level, showResolved)
	{
		//Skip resolved comments if showResolved is not set
		if (!showResolved && comment.isResolved)
		{
			return;
		}

		noComments.style.display = 'none';
		
		var cdiv = document.createElement('div');
		cdiv.className = 'geCommentContainer';
		cdiv.setAttribute('data-commentId', comment.id);
		cdiv.style.marginLeft = (level * 20 + 5) + 'px';

		if (comment.isResolved)
		{
			div.style.opacity = '0.7';
		}
		
		var headerDiv = document.createElement('div');
		headerDiv.className = 'geCommentHeader';
		
		var userImg = document.createElement('img');
		userImg.className = 'geCommentUserImg';
		userImg.src = (comment.user != null &&
			comment.user.pictureUrl != null) ?
			comment.user.pictureUrl : Editor.userImage;
		headerDiv.appendChild(userImg);
		
		var headerTxt = document.createElement('div');
		headerTxt.className = 'geCommentHeaderTxt';
		headerDiv.appendChild(headerTxt);
		
		var usernameDiv = document.createElement('div');
		usernameDiv.className = 'geCommentUsername';
		mxUtils.write(usernameDiv, (comment.user != null) ?
			comment.user.displayName : mxResources.get('unknownUser'));
		headerTxt.appendChild(usernameDiv);
		
		var dateDiv = document.createElement('div');
		dateDiv.className = 'geCommentDate';
		dateDiv.setAttribute('data-commentId', comment.id);
		writeCommentDate(comment, dateDiv);
		headerTxt.appendChild(dateDiv);
		cdiv.appendChild(headerDiv);
		
		var commentTxtDiv = document.createElement('div');
		commentTxtDiv.className = 'geCommentTxt';
		mxUtils.write(commentTxtDiv, comment.content || '');
		cdiv.appendChild(commentTxtDiv);
		
		if (comment.isLocked)
		{
			cdiv.style.opacity = '0.5';
		}
		
		var actionsDiv = document.createElement('div');
		actionsDiv.className = 'geCommentActions';
		var actionsList = document.createElement('ul');
		actionsList.className = 'geCommentActionsList';
		actionsDiv.appendChild(actionsList);
		
		function addAction(name, evtHandler, hide)
		{
			var action = document.createElement('li');
			action.className = 'geCommentAction';
			var actionLnk = document.createElement('a');
			actionLnk.className = 'geCommentActionLnk';
			mxUtils.write(actionLnk, name);
			action.appendChild(actionLnk);
			
			mxEvent.addListener(actionLnk, 'click', function(evt)
			{
				evtHandler(evt, comment);
				evt.preventDefault();
				mxEvent.consume(evt);
			});
			
			actionsList.appendChild(action);
			
			if (hide) action.style.display = 'none';
		};
		
		function collectReplies()
		{
			var replies = [];
			var pdiv = cdiv;
			
			function collectReplies(comment) 
			{
				replies.push(pdiv);
				
				if (comment.replies != null)
				{
					for (var i = 0; i < comment.replies.length; i++) 
					{
						pdiv = pdiv.nextSibling;
						collectReplies(comment.replies[i]); 
					}
				}	
			}
			
			collectReplies(comment);
			
			return {pdiv: pdiv, replies: replies};
		};
		
		function addReply(initContent, editIt, saveCallback, doResolve, doReopen)
		{
			var pdiv = collectReplies().pdiv;
			
			var newReply = editorUi.newComment(initContent, editorUi.getCurrentUser());
			newReply.pCommentId = comment.id;
			
			if (comment.replies == null) comment.replies = [];
			
			var replyComment = addComment(newReply, comment.replies, pdiv, level + 1);

			function doAddReply()
			{
				showBusy(replyComment);
				
				comment.addReply(newReply, function(id)
				{
					newReply.id = id;
					comment.replies.push(newReply);
					showDone(replyComment);
					
					if (saveCallback) saveCallback();
					
				}, function(err)
				{
					doEdit();
					showError(replyComment);
					editorUi.handleError(err, null, null, null,
						mxUtils.htmlEntities(mxResources.get('objectNotFound')));
				}, doResolve, doReopen);				
			};
			
			function doEdit()
			{
				editComment(newReply, replyComment, function(newReply)
				{
					doAddReply();
				}, true);
			};

			if (editIt)
			{
				doEdit();
			}
			else
			{
				doAddReply();
			}
		};
		
		if (!readOnly && !comment.isLocked && (level == 0 || canReplyToReplies))
		{
			addAction(mxResources.get('reply'), function()
			{
				addReply('', true);
			}, comment.isResolved);
		}
		
		var user = editorUi.getCurrentUser();
		
		if (user != null && comment.user != null &&
			user.id == comment.user.id &&
			!readOnly && !comment.isLocked)
		{
			addAction(mxResources.get('edit'), function()
			{
				function doEditComment()
				{
					editComment(comment, cdiv, function()
					{
						showBusy(cdiv);
						
						comment.editComment(comment.content, function()
						{
							showDone(cdiv);
						}, function(err)
						{
							showError(cdiv);
							doEditComment();
							editorUi.handleError(err, null, null, null,
								mxUtils.htmlEntities(mxResources.get('objectNotFound')));
						});
					});
				};
				
				doEditComment();
			}, comment.isResolved);
			
			addAction(mxResources.get('delete'), function()
			{
				editorUi.confirm(mxResources.get('areYouSure'), function()
				{
					showBusy(cdiv);
					
					comment.deleteComment(function(markedOnly)
					{
						if (markedOnly === true)
						{
							var commentTxt = cdiv.querySelector('.geCommentTxt');
							commentTxt.innerText = '';
							mxUtils.write(commentTxt, mxResources.get('msgDeleted'));
							
							var actions = cdiv.querySelectorAll('.geCommentAction');
							
							for (var i = 0; i < actions.length; i++)
							{
								actions[i].parentNode.removeChild(actions[i]);
							}
							
							showDone(cdiv);
							cdiv.style.opacity = '0.5';
						}
						else
						{
							var replies = collectReplies(comment).replies;
							
							for (var i = 0; i < replies.length; i++)
							{
								listDiv.removeChild(replies[i]);
							}
							
							for (var i = 0; i < parentArr.length; i++)
							{
								if (parentArr[i] == comment) 
								{
									parentArr.splice(i, 1);
									break;
								}
							}
							
							noComments.style.display = (listDiv.getElementsByTagName('div').length == 0) ? 'block' : 'none';
						}
					}, function(err)
					{
						showError(cdiv);
						editorUi.handleError(err, null, null, null,
							mxUtils.htmlEntities(mxResources.get('objectNotFound')));
					});
				});
			}, comment.isResolved);
		}
		
		if (!readOnly && !comment.isLocked && level == 0) //Resolve is a top-level action only
		{
			function toggleResolve(evt)
			{
				function doToggle()
				{
					var resolveActionLnk = evt.target;
					resolveActionLnk.innerText = '';

					comment.isResolved = !comment.isResolved;
					mxUtils.write(resolveActionLnk, comment.isResolved? mxResources.get('reopen') : mxResources.get('resolve'));
					var actionsDisplay = comment.isResolved? 'none' : '';
					var replies = collectReplies(comment).replies;
					var color = 'light-dark(' +  (comment.isResolved? 'ghostWhite' : 'white') + ', transparent)';
					
					for (var i = 0; i < replies.length; i++)
					{
						replies[i].style.backgroundColor = color;
						
						var forOpenActions = replies[i].querySelectorAll('.geCommentAction');
						
						for (var j = 0; j < forOpenActions.length; j ++) 
						{
							if (forOpenActions[j] == resolveActionLnk.parentNode) continue;
							
							forOpenActions[j].style.display = actionsDisplay;
						}

						if (!resolvedChecked)
						{
							replies[i].style.display = 'none';
						}
					}
					
					updateNoComments();
				};
				
				if (comment.isResolved)
				{
					addReply(mxResources.get('reOpened') + ': ', true, doToggle, false, true);
				}
				else
				{
					addReply(mxResources.get('markedAsResolved'), false, doToggle, true);
				}
			};
			
			addAction(comment.isResolved? mxResources.get('reopen') : mxResources.get('resolve'), toggleResolve);
		}
		
		cdiv.appendChild(actionsDiv);
		
		if (parent != null) 
		{
			listDiv.insertBefore(cdiv, parent.nextSibling);
		}
		else
		{
			listDiv.appendChild(cdiv);
		}
		
		for (var i = 0; comment.replies != null && i < comment.replies.length; i++)
		{
			var reply = comment.replies[i];
			reply.isResolved = comment.isResolved; //copy isResolved to child comments (replies)
			addComment(reply, comment.replies, null, level + 1, showResolved);
		}
		
		if (curEdited != null)
		{
			if (curEdited.comment.id == comment.id)
			{
				var origContent = comment.content;
				comment.content = curEdited.comment.content;
				editComment(comment, cdiv, curEdited.saveCallback, curEdited.deleteOnCancel);
				comment.content = origContent;
			}
			else if (curEdited.comment.id == null && curEdited.comment.pCommentId == comment.id)
			{
				listDiv.appendChild(curEdited.div);
				editComment(curEdited.comment, curEdited.div, curEdited.saveCallback, curEdited.deleteOnCancel);
			}
		}

		return cdiv;
	};

	if (!readOnly)
	{
		var addLink = link.cloneNode();
		addLink.style.backgroundImage = 'url(' + Editor.plusImage + ')';
		addLink.setAttribute('title', mxResources.get('create') + '...');
		
		mxEvent.addListener(addLink, 'click', function(evt)
		{
			var newComment = editorUi.newComment('', editorUi.getCurrentUser());
			var newCommentDiv = addComment(newComment, comments, null, 0);
			
			function doAddComment()
			{
				editComment(newComment, newCommentDiv, function(newComment)
				{
					showBusy(newCommentDiv);
					
					editorUi.addComment(newComment, function(id)
					{
						newComment.id = id;
						comments.push(newComment);
						showDone(newCommentDiv);
					}, function(err)
					{
						showError(newCommentDiv);
						doAddComment();
						editorUi.handleError(err, null, null, null,
							mxUtils.htmlEntities(mxResources.get('objectNotFound')));
					});
				}, true);
			}
			
			doAddComment();
			evt.preventDefault();
			mxEvent.consume(evt);
		});
		
		ldiv.appendChild(addLink);
	}

	var resolvedLink = link.cloneNode();
	resolvedLink.style.backgroundImage = 'url(' + Editor.checkImage + ')';
	resolvedLink.setAttribute('title', mxResources.get('showResolved'));
	var resolvedChecked = false;
	
	mxEvent.addListener(resolvedLink, 'click', function(evt)
	{
		resolvedChecked = !resolvedChecked;

		if (resolvedChecked)
		{
			resolvedLink.classList.add('geActiveItem');
		}
		else
		{
			resolvedLink.classList.remove('geActiveItem');
		}

		refresh();	
		evt.preventDefault();
		mxEvent.consume(evt);
	});
	
	ldiv.appendChild(resolvedLink);
	
	if (editorUi.commentsRefreshNeeded())
	{
		var refreshLink = link.cloneNode();
		refreshLink.style.backgroundImage = 'url(' + Editor.refreshImage + ')';
		refreshLink.setAttribute('title', mxResources.get('refresh'));
		
		mxEvent.addListener(refreshLink, 'click', function(evt)
		{
			refresh();
			
			evt.preventDefault();
			mxEvent.consume(evt);
		});
		
		ldiv.appendChild(refreshLink);
	}
	
	if (editorUi.commentsSaveNeeded())
	{
		var saveLink = link.cloneNode();
		saveLink.innerHTML = '<img src="' + IMAGE_PATH + '/save.png" style="width: 20px; padding: 2px;">';
		saveLink.setAttribute('title', mxResources.get('save'));
		saveLink.className = 'geButton geAdaptiveAsset';
		
		mxEvent.addListener(saveLink, 'click', function(evt)
		{
			saveCallback();
			
			evt.preventDefault();
			mxEvent.consume(evt);
		});
		
		ldiv.appendChild(saveLink);
	}

	div.appendChild(ldiv);	

	var comments = [];

	var refresh = mxUtils.bind(this, function()
	{
		this.hasError = false;
		
		if (curEdited != null)
		{
			try
			{
				curEdited.div = curEdited.div.cloneNode(true);
				var commentEditTxt = curEdited.div.querySelector('.geCommentEditTxtArea');
				var commentEditBtns = curEdited.div.querySelector('.geCommentEditBtns');
				
				curEdited.comment.content = commentEditTxt.value;
				commentEditTxt.parentNode.removeChild(commentEditTxt);
				commentEditBtns.parentNode.removeChild(commentEditBtns);
			}
			catch (e)
			{
				editorUi.handleError(e);
			}
		}
		
		listDiv.innerHTML = '<div style="padding-top:10px;text-align:center;"><img src="' + IMAGE_PATH + '/spin.gif" valign="middle"> ' +
			mxUtils.htmlEntities(mxResources.get('loading')) + '...</div>';
		
		canReplyToReplies = editorUi.canReplyToReplies();
		
		if (editorUi.commentsSupported())
		{
			editorUi.getComments(function(list)
			{
				function sortReplies(replies)
				{
					if (replies != null)
					{
						//Sort replies old to new
						replies.sort(function(r1, r2)
						{
							return new Date(r1.modifiedDate) - new Date(r2.modifiedDate);
						});
						
						for (var i = 0; i < replies.length; i++)
						{
							sortReplies(replies[i].replies);
						}						
					}
				};
				
				//Sort comments old to new
				list.sort(function(c1, c2)
				{
					return new Date(c1.modifiedDate) - new Date(c2.modifiedDate);
				});

				listDiv.innerText = '';
				listDiv.appendChild(noComments);
				noComments.style.display = 'block';
				comments = list;
				
				for (var i = 0; i < comments.length; i++)
				{
					sortReplies(comments[i].replies);
					addComment(comments[i], comments, null, 0, resolvedChecked);
				}
				
				//New comment case
				if (curEdited != null && curEdited.comment.id == null && curEdited.comment.pCommentId == null)
				{
					listDiv.appendChild(curEdited.div);
					editComment(curEdited.comment, curEdited.div, curEdited.saveCallback, curEdited.deleteOnCancel);
				}
				
			}, mxUtils.bind(this, function(err)
			{
				listDiv.innerHTML = mxUtils.htmlEntities(mxResources.get('error') + (err && err.message? ': ' + err.message : ''));
				this.hasError = true;
			}));
		}
		else
		{
			//TODO if comments are not supported, close the dialog
			listDiv.innerHTML = mxUtils.htmlEntities(mxResources.get('error'));
		}
	});

	refresh();
	
	this.refreshComments = refresh;

	//Refresh the modified date of each comment if the window is visible
	var refreshCommentsTime = mxUtils.bind(this, function()
	{
		if (!this.window.isVisible()) return; //only update if it is visible
		
		var modDateDivs = listDiv.querySelectorAll('.geCommentDate');
		var modDateDivsMap = {};
		
		for (var i = 0; i < modDateDivs.length; i++)
		{
			var div = modDateDivs[i];
			modDateDivsMap[div.getAttribute('data-commentId')] = div;
		}
		
		function processComment(comment) 
		{
			var div = modDateDivsMap[comment.id];
			
			if (div == null) return; //resolved comments
			
			writeCommentDate(comment, div);
			
			for (var i = 0; comment.replies != null && i < comment.replies.length; i++)
			{
				processComment(comment.replies[i]);
			}
		};
		
		for (var i = 0; i < comments.length; i++)
		{
			processComment(comments[i]);
		}
	});

	//Periodically refresh time every one minute
	setInterval(refreshCommentsTime, 60000);
	this.refreshCommentsTime = refreshCommentsTime;
	
	this.window = new mxWindow(mxResources.get('comments'), div, x, y, w, h, true, true);
	this.window.minimumSize = new mxRectangle(0, 0, 260, 200);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
	
	this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
	{
		this.window.fit();
	}));
	
	editorUi.installResizeHandler(this, true);
};

/**
 * 
 */
var ConfirmDialog = function(editorUi, message, okFn, cancelFn, okLabel, cancelLabel,
		okImg, cancelImg, showRememberOption, imgSrc, maxHeight)
{
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	maxHeight = (maxHeight != null) ? maxHeight : 44;
	
	var p2 = document.createElement('div');
	p2.style.padding = '6px';
	p2.style.overflow = 'auto';
	p2.style.maxHeight = maxHeight + 'px';
	p2.style.lineHeight = '1.2em';
	
	mxUtils.write(p2, message);
	div.appendChild(p2);
	
	if (imgSrc != null)
	{
		var p3 = document.createElement('div');
		p3.style.padding = '6px 0 6px 0';
		var img = document.createElement('img');
		img.setAttribute('src', imgSrc);
		p3.appendChild(img);
		div.appendChild(p3);
	}
	
	var btns = document.createElement('div');
	btns.style.textAlign = 'center';
	btns.style.whiteSpace = 'nowrap';

	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');

	var cancelBtn = mxUtils.button(cancelLabel || mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn(cb.checked);
		}
	});
	cancelBtn.className = 'geBtn';
	
	if (cancelImg != null)
	{
		cancelBtn.innerHTML = cancelImg + '<br>' + cancelBtn.innerHTML;
		cancelBtn.style.display = 'inline-block';
		cancelBtn.style.paddingBottom = '8px';
		cancelBtn.style.paddingTop = '8px';
		cancelBtn.style.height = 'auto';
		cancelBtn.style.width = '40%';
	}
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	var okBtn = mxUtils.button(okLabel || mxResources.get('ok'), function()
	{
		editorUi.hideDialog();
		
		if (okFn != null)
		{
			okFn(cb.checked);
		}
	});
	btns.appendChild(okBtn);
	
	if (okImg != null)
	{
		okBtn.innerHTML = okImg + '<br>' + okBtn.innerHTML + '<br>';
		okBtn.style.display = 'inline-block';
		okBtn.style.paddingBottom = '8px';
		okBtn.style.paddingTop = '8px';
		okBtn.style.height = 'auto';
		okBtn.className = 'geBtn';
		okBtn.style.width = '40%';
	}
	else
	{
		okBtn.className = 'geBtn gePrimaryBtn';
	}
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);
	
	if (showRememberOption)
	{
		btns.style.marginTop = '10px';
		var p2 = document.createElement('p');
		p2.style.marginTop = '20px';
		p2.style.marginBottom = '0px';
		p2.appendChild(cb);
		var span = document.createElement('span');
		mxUtils.write(span, ' ' + mxResources.get('rememberThisSetting'));
		p2.appendChild(span);
		div.appendChild(p2);
		
		mxEvent.addListener(span, 'click', function(evt)
		{
			cb.checked = !cb.checked;
			mxEvent.consume(evt);
		});
	}
	else
	{
		btns.style.marginTop = '12px';
	}

	this.init = function()
	{
		okBtn.focus();
	};
	
	this.container = div;
};

/**
 * Headless Editor UI class for offscreen editor instances.
 */
var HeadlessEditorUi = function()
{
	EditorUi.call(this, new Editor(true), document.createElement('div'), true);
};

/**
 * Extends EditorUi.
 */
mxUtils.extend(HeadlessEditorUi, EditorUi);

/**
 * Avoid creating UI and event listeners.
 */
HeadlessEditorUi.prototype.createUi = function() {};
HeadlessEditorUi.prototype.addTrees = function() {};
HeadlessEditorUi.prototype.onBeforeUnload = function() {};
HeadlessEditorUi.prototype.updateActionStates = function() {};
