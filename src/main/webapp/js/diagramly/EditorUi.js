/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
(function()
{
	/**
	 * Version
	 */
	EditorUi.VERSION = '@DRAWIO-VERSION@';
	
	/**
	 * Overrides compact UI setting.
	 */
	EditorUi.compactUi = uiTheme != 'atlas';
	
	/**
	 * Switch to disable logging for mode and search terms.
	 */
	EditorUi.enableLogging = /.*\.draw\.io$/.test(window.location.hostname) &&
		window.location.hostname != 'support.draw.io';

	/**
	 * Switch to enable PlantUML in the insert from text dialog.
	 * NOTE: This must also be enabled on the server-side.
	 */
	EditorUi.enablePlantUml = EditorUi.enableLogging;

	/**
	 * https://github.com/electron/electron/issues/2288
	 */
	EditorUi.isElectronApp = window != null && window.process != null &&
		window.process.versions != null && window.process.versions['electron'] != null;

	/**
	 * Link for scratchpad help.
	 */
	EditorUi.scratchpadHelpLink = 'https://desk.draw.io/support/solutions/articles/16000042367';
	
	/**
	 * Contains the default XML for an empty diagram.
	 */
	EditorUi.prototype.emptyDiagramXml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>';

	/**
	 * 
	 */
	EditorUi.prototype.emptyLibraryXml = '<mxlibrary>[]</mxlibrary>';

	/**
	 * Sets the delay for autosave in milliseconds. Default is 2000.
	 */
	EditorUi.prototype.mode = null;

	/**
	 * Allows for two buttons in the sidebar footer.
	 */
	EditorUi.prototype.sidebarFooterHeight = 36;

	/**
	 * Specifies the default custom shape style.
	 */
	EditorUi.prototype.defaultCustomShapeStyle = 'shape=stencil(tZRtTsQgEEBPw1+DJR7AoN6DbWftpAgE0Ortd/jYRGq72R+YNE2YgTePloEJGWblgA18ZuKFDcMj5/Sm8boZq+BgjCX4pTyqk6ZlKROitwusOMXKQDODx5iy4pXxZ5qTHiFHawxB0JrQZH7lCabQ0Fr+XWC1/E8zcsT/gAi+Subo2/3Mh6d/oJb5nU1b5tW7r2knautaa3T+U32o7f7vZwpJkaNDLORJjcu7t59m2jXxqX9un+tt022acsfmoKaQZ+vhhswZtS6Ne/ThQGt0IV0N3Yyv6P3CeT9/tHO0XFI5cAE=);whiteSpace=wrap;html=1;';

	/**
	 * Broken image symbol for offline SVG.
	 */
	EditorUi.prototype.svgBrokenImage = Graph.createSvgImage(10, 10, '<rect x="0" y="0" width="10" height="10" stroke="#000" fill="transparent"/><path d="m 0 0 L 10 10 L 0 10 L 10 0" stroke="#000" fill="transparent"/>');

	/**
	 * Specifies if img.crossOrigin is supported. This is true for all browsers except IE10 and earlier.
	 */
	EditorUi.prototype.crossOriginImages = !mxClient.IS_IE;
	
	/**
	 * Defines the maximum size for images.
	 */
	EditorUi.prototype.maxBackgroundSize = 1600;

	/**
	 * Defines the maximum size for images.
	 */
	EditorUi.prototype.maxImageSize = 520;

	/**
	 * Images above 100K should be resampled.
	 */
	EditorUi.prototype.resampleThreshold = 100000;

	/**
	 * Maximum allowed size for images is 1 MB.
	 */
	EditorUi.prototype.maxImageBytes = 1000000;

	/**
	 * Maximum size for background images is 2.5 MB.
	 */
	EditorUi.prototype.maxBackgroundBytes = 2500000;

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
	EditorUi.prototype.closableScratchpad = true;

	/**
	 * Specifies if current edge style should be persisted. Default is false.
	 */
	EditorUi.prototype.persistCurrentEdgeStyle = false;

	/**
	 * Specifies if current vertex style should be persisted. Default is false.
	 */
	EditorUi.prototype.persistCurrentVertexStyle = false;
	
	/**
	 * Capability check for canvas export
	 */
	(function()
	{
		EditorUi.prototype.useCanvasForExport = false;
		EditorUi.prototype.jpgSupported = false;
		
		// Checks if canvas is supported
		try
		{
			var cnv = document.createElement('canvas');
			EditorUi.prototype.canvasSupported = !!(cnv.getContext && cnv.getContext('2d'));
		}
		catch (e)
		{
			// ignore
		}
		
		try
		{
			var canvas = document.createElement('canvas');
			var img = new Image();
			
			// LATER: Capability check should not be async
			img.onload = function()
			{
				try
				{
			   		var ctx = canvas.getContext('2d');
			   		ctx.drawImage(img, 0, 0);

			   		// Works in Chrome, Firefox, Edge, Safari and Opera
					var result = canvas.toDataURL('image/png');
					EditorUi.prototype.useCanvasForExport = result != null && result.length > 6;
				}
				catch (e)
				{
					// ignore
				}
			};

			// Checks if SVG with foreignObject can be exported
			var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1px" height="1px" version="1.1"><foreignObject pointer-events="all" width="1" height="1"><div xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject></svg>';
			img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
		}
		catch (e)
		{
			// ignore
		}
		
		// Checks for client-side JPG support
		try
		{
		    var canvas = document.createElement('canvas');
		    canvas.width = canvas.height = 1;
		    var uri = canvas.toDataURL('image/jpeg');
		    
		    EditorUi.prototype.jpgSupported = (uri.match('image/jpeg') !== null);
		}
		catch (e)
		{
			// ignore
		}
	})();

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
	EditorUi.prototype.removeLocalData = function(key, fn)
	{
		localStorage.removeItem(key)
		fn();
	};

	EditorUi.prototype.setMathEnabled = function(value)
	{
		this.editor.graph.mathEnabled = value;
		this.editor.updateGraphComponents();
		this.editor.graph.refresh();
		
		this.fireEvent(new mxEventObject('mathEnabledChanged'));
	};

	EditorUi.prototype.isMathEnabled = function(value)
	{
		return this.editor.graph.mathEnabled;
	};
	
	/**
	 * Returns true if using application cache
	 */
	EditorUi.prototype.isAppCache = function()
	{
		return (urlParams['appcache'] == '1' || this.isOfflineApp());
	};
	
	/**
	 * Returns true if offline app, which isn't a defined thing
	 */
	EditorUi.prototype.isOfflineApp = function()
	{
		return (urlParams['offline'] == '1');
	};

	/**
	 * Returns true if no external comms allowed or possible
	 */
	EditorUi.prototype.isOffline = function()
	{
		return this.isOfflineApp() || !navigator.onLine || urlParams['stealth'] == '1';
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createSpinner = function(x, y, size)
	{
		size = (size != null) ? size : 24;

		var spinner = new Spinner({
			lines: 12, // The number of lines to draw
			length: size, // The length of each line
			width: Math.round(size / 3), // The line thickness
			radius: Math.round(size / 2), // The radius of the inner circle
			rotate: 0, // The rotation offset
			color: (uiTheme == 'dark') ? '#c0c0c0' : '#000', // #rgb or #rrggbb
			speed: 1.5, // Rounds per second
			trail: 60, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: false, // Whether to use hardware acceleration
			zIndex: 2e9 // The z-index (defaults to 2000000000)
		});

		// Extends spin method to include an optional label
		var oldSpin = spinner.spin;
		
		spinner.spin = function(container, label)
		{
			var result = false;
			
			if (!this.active)
			{
				oldSpin.call(this, container);
				this.active = true;
				
				if (label != null)
				{
					var status = document.createElement('div');
					status.style.position = 'absolute';
					status.style.whiteSpace = 'nowrap';
					status.style.background = '#4B4243';
					status.style.color = 'white';
					status.style.fontFamily = 'Helvetica, Arial';
					status.style.fontSize = '9pt';
					status.style.padding = '6px';
					status.style.paddingLeft = '10px';
					status.style.paddingRight = '10px';
					status.style.zIndex = 2e9;
					status.style.left = Math.max(0, x) + 'px';
					status.style.top = Math.max(0, y + 70) + 'px';
					
					mxUtils.setPrefixedStyle(status.style, 'borderRadius', '6px');
					mxUtils.setPrefixedStyle(status.style, 'transform', 'translate(-50%,-50%)');

					if (uiTheme != 'dark')
					{
						mxUtils.setPrefixedStyle(status.style, 'boxShadow', '2px 2px 3px 0px #ddd');
					}
					
					status.innerHTML = label + '...';
					container.appendChild(status);
					spinner.status = status;
					
					// Centers the label in older IE versions
					if (mxClient.IS_VML && (document.documentMode == null || document.documentMode <= 8))
					{
						status.style.left = Math.round(Math.max(0, x - status.offsetWidth / 2)) + 'px';
						status.style.top = Math.round(Math.max(0, y + 70 - status.offsetHeight / 2)) + 'px';
					}
				}
				
				// Pause returns a function to resume the spinner
				this.pause = mxUtils.bind(this, function()
				{
					var fn = function() { };
					
					if (this.active)
					{
						fn = mxUtils.bind(this, function()
						{
							this.spin(container, label);
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
			this.active = false;
			
			if (spinner.status != null)
			{
				spinner.status.parentNode.removeChild(spinner.status);
				spinner.status = null;
			}
		};
		
		spinner.pause = function()
		{
			return function() {};
		};
		
		return spinner;
	};

	/**
	 * Static method for pasing PNG files.
	 */
	EditorUi.parsePng = function(f, fn, error)
	{
		var pos = 0;
		
		function fread(d, count)
		{
			var start = pos;
			pos += count;
			
			return d.substring(start, pos);
		};
		
		// Reads unsigned long 32 bit big endian
		function _freadint(d)
		{
			var bytes = fread(d, 4);
			
			return bytes.charCodeAt(3) + (bytes.charCodeAt(2) << 8) +
				(bytes.charCodeAt(1) << 16) + (bytes.charCodeAt(0) << 24);
		};
		
		// Checks signature
		if (fread(f,8) != String.fromCharCode(137) + 'PNG' + String.fromCharCode(13, 10, 26, 10))
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		// Reads header chunk
		fread(f,4);
		
		if (fread(f,4) != 'IHDR')
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		fread(f, 17);
		
		do
		{
			var n = _freadint(f);
			var type = fread(f,4);
			
			if (fn != null)
			{
				if (fn(pos - 8, type, n))
				{
					break;
				}
			}
			
			value = fread(f,n);
			fread(f,4);
			
			if (type == 'IEND')
			{
				break;
			}
		}
		while (n);
	};

	/**
	 * Returns true if the given string contains a compatible graph model.
	 */
	EditorUi.prototype.isCompatibleString = function(data)
	{
		try
		{
			var doc = mxUtils.parseXml(data);
			var node = this.editor.extractGraphModel(doc.documentElement, true);
			
			return node != null && node.getElementsByTagName('parsererror').length == 0;
		}
		catch (e)
		{
			// ignore
		}
		
		return false;
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
		}
		
		return data;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.replaceFileData = function(data)
	{
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

				if (urlParams['pages'] != '0' || nodes.length > 1 ||
					(nodes.length == 1 && nodes[0].hasAttribute('name')))
				{
					this.fileNode = node;
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
					if (urlParams['pages'] != '0' && this.fileNode == null)
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
					}
				}
				
				if (oldPages != null)
				{
					for (var i = 0; i < oldPages.length; i++)
					{
						graph.model.execute(new ChangePage(this, oldPages[i], null));
					}
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
	EditorUi.prototype.createFileData = function(node, graph, file, url, forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection, compact)
	{
		graph = (graph != null) ? graph : this.editor.graph;
		forceXml = (forceXml != null) ? forceXml : false;
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		
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
				// Removes control chars in input for correct roundtrip check
				var text = graph.zapGremlins(mxUtils.getXml(node));
				var data = graph.compress(text);
				
				// Fallback to plain XML for invalid compression
				// TODO: Remove this fallback with active pages
				if (graph.decompress(data) != text)
				{
					return text;
				}
				else
				{
					var diagramNode = node.ownerDocument.createElement('diagram');
					mxUtils.setTextContent(diagramNode, data);
					
					fileNode = node.ownerDocument.createElement('mxfile');
					fileNode.appendChild(diagramNode);
				}
			}
			
			if (!compact)
			{
				fileNode.setAttribute('userAgent', navigator.userAgent);
				fileNode.setAttribute('version', EditorUi.VERSION);
				fileNode.setAttribute('editor', 'www.draw.io');
		
				var md = (file != null) ? file.getMode() : this.mode;
				
				if (md != null)
				{
					fileNode.setAttribute('type', md);
				}
			}
			else
			{
				fileNode = fileNode.cloneNode(true);
				fileNode.removeAttribute('userAgent');
				fileNode.removeAttribute('version');
				fileNode.removeAttribute('editor');
				fileNode.removeAttribute('type');
			}

			var xml = mxUtils.getXml(fileNode);
			
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
				
				xml = this.getEmbeddedSvg(xml, graph, url, null, embeddedCallback, ignoreSelection, redirect);
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
	EditorUi.prototype.getXmlFileData = function(ignoreSelection, currentPage)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		currentPage = (currentPage != null) ? currentPage : false;
		
		var node = this.editor.getGraphXml(ignoreSelection);
			
		if (ignoreSelection && this.fileNode != null && this.currentPage != null)
		{
			var data = this.editor.graph.compress(this.editor.graph.zapGremlins(mxUtils.getXml(node)));
			mxUtils.setTextContent(this.currentPage.node, data);
			node = this.fileNode.cloneNode(false);
			
			if (currentPage)
			{
				node.appendChild(this.currentPage.node);
			}
			else
			{
				// Restores order of pages
				for (var i = 0; i < this.pages.length; i++)
				{
					var mapping = this.pages[i].mapping;
					
					// Updates XML of all pages for realtime
					if (this.currentPage != this.pages[i] && mapping != null && mapping.needsUpdate)
					{
						var enc = new mxCodec(mxUtils.createXmlDocument());
						var temp = enc.encode(mapping.graphModel);
					
						// Uses the graph state from the realtime model
						mapping.writeRealtimeToNode(temp);					
		
						var data = this.editor.graph.compress(this.editor.graph.zapGremlins(mxUtils.getXml(temp)));
						mxUtils.setTextContent(this.pages[i].node, data);
						
						// Marks the page as up-to-date
						mapping.needsUpdate = false;
					}
					
					node.appendChild(this.pages[i].node);
				}
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
	EditorUi.prototype.getFileData = function(forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection, currentPage, node, compact, file)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		currentPage = (currentPage != null) ? currentPage : false;
		
		node = (node != null) ? node : this.getXmlFileData(ignoreSelection, currentPage);
		file = (file != null) ? file : this.getCurrentFile();
		var graph = this.editor.graph;
		
		// Exports SVG for first page while other page is visible by creating a graph
		// LATER: Add caching for the graph or SVG while not on first page
		if (this.pages != null && this.currentPage != this.pages[0] && (forceSvg ||
			(!forceXml && file != null && /(\.svg)$/i.test(file.getTitle()))))
		{
			graph = this.createTemporaryGraph(graph.getStylesheet());
			var graphGetGlobalVariable = graph.getGlobalVariable;
			var page = this.pages[0];
	
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
		
		var result = this.createFileData(node, graph, file, window.location.href,
			forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection, compact);
		
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
		var js = 'https://www.draw.io/js/embed-static.min.js';
	
		// LATER: Merge common code with EmbedDialog
		if (graph != null)
		{
			var bounds = (ignoreSelection) ? graph.getGraphBounds() : graph.getBoundingBox(graph.getSelectionCells());
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
					js = 'https://www.draw.io/embed.js?s=' + s;
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
		var text = (node != null) ? this.editor.graph.zapGremlins(mxUtils.getXml(node)) : '';
		
		// Double compression for mxfile not fixed since it may cause imcompatibilites with
		// embed clients that rely on this format. HTML files and export use getHtml2.
		var data = this.editor.graph.compress(text);
		
		// Fallback to URI encoded XML for invalid compression
		if (this.editor.graph.decompress(data) != text)
		{
			data = encodeURIComponent(text);
		}
		
		var style = 'position:relative;overflow:auto;width:100%;';
	
		return ((redirect == null) ? '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' : '') +
			'<!DOCTYPE html>\n<html' + ((redirect != null) ? ' xmlns="http://www.w3.org/1999/xhtml">' : '>') +
			'\n<head>\n' + ((redirect == null) ? ((title != null) ? '<title>' + mxUtils.htmlEntities(title) +
				'</title>\n' : '') : '<title>Draw.io Diagram</title>\n') +
			((redirect != null) ? '<meta http-equiv="refresh" content="0;URL=\'' + redirect + '\'"/>\n' : '') +
			'</head>\n<body' +
			(((redirect == null && bg != null && bg != mxConstants.NONE) ? ' style="background-color:' + bg + ';">' : '>')) +
			'\n<div class="mxgraph" style="' + style + '">\n' +
			'<div style="width:1px;height:1px;overflow:hidden;">' + data + '</div>\n</div>\n' +
			((redirect == null) ? '<script type="text/javascript" src="' + js + '"></script>' :
			'<a style="position:absolute;top:50%;left:50%;margin-top:-128px;margin-left:-64px;" ' +
			'href="' + redirect + '" target="_blank"><img border="0" ' +
			'src="https://www.draw.io/images/drawlogo128.png"/></a>') +
			'\n</body>\n</html>\n';
	};
	
	/**
	 * Same as above but using the new embed code.
	 */
	EditorUi.prototype.getHtml2 = function(xml, graph, title, editLink, redirect)
	{
		var bg = null;
		var js = 'https://www.draw.io/js/viewer.min.js';
		var s = '';
	
		// Makes XHTML compatible
		if (redirect != null)
		{
			redirect = redirect.replace(/&/g, '&amp;');
		}
		
		var data = {highlight: '#0000ff', nav: this.editor.graph.foldingEnabled, resize: true,
			xml: this.editor.graph.zapGremlins(xml), toolbar: 'pages zoom layers lightbox'};
		
		if (this.pages != null && this.currentPage != null)
		{
			data.page = mxUtils.indexOf(this.pages, this.currentPage);
		}
	
		var style = 'max-width:100%;border:1px solid transparent;';
	
		return ((redirect == null) ? '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' : '') +
			'<!DOCTYPE html>\n<html' + ((redirect != null) ? ' xmlns="http://www.w3.org/1999/xhtml">' : '>') +
			'\n<head>\n' + ((redirect == null) ? ((title != null) ? '<title>' + mxUtils.htmlEntities(title) +
				'</title>\n' : '') : '<title>Draw.io Diagram</title>\n') +
			((redirect != null) ? '<meta http-equiv="refresh" content="0;URL=\'' + redirect + '\'"/>\n' : '') +
			'<meta charset="utf-8"/>\n</head>\n<body>' +
			'\n<div class="mxgraph" style="' + style + '" data-mxgraph="' + mxUtils.htmlEntities(JSON.stringify(data)) + '"></div>\n' +
			((redirect == null) ? '<script type="text/javascript" src="' + js + '"></script>' :
			'<a style="position:absolute;top:50%;left:50%;margin-top:-128px;margin-left:-64px;" ' +
			'href="' + redirect + '" target="_blank"><img border="0" ' +
			'src="https://www.draw.io/images/drawlogo128.png"/></a>') +
			'\n</body>\n</html>\n';
	};

	/**
	 * 
	 */
	EditorUi.prototype.setFileData = function(data)
	{
		data = this.validateFileData(data);
		this.currentPage = null;
		this.fileNode = null;
		this.pages = null;

		var node = (data != null && data.length > 0) ? mxUtils.parseXml(data).documentElement : null;

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

			if (urlParams['pages'] != '0' || nodes.length > 1 ||
				(nodes.length == 1 && nodes[0].hasAttribute('name')))
			{
				this.fileNode = node;
				this.pages = [];
				
				// Wraps page nodes
				for (var i = 0; i < nodes.length; i++)
				{
					var page = new DiagramPage(nodes[i]);
					
					// Checks for invalid page names
					if (page.getName() == null)
					{
						page.setName(mxResources.get('pageWithNumber', [i + 1]));
					}
					
					this.pages.push(page);
				}
				
				this.currentPage = this.pages[Math.max(0, Math.min(this.pages.length - 1, urlParams['page'] || 0))];
				node = this.currentPage.node;
			}
		}
		
		// Creates tabbed file structure if enforced by URL
		if (urlParams['pages'] != '0' && this.fileNode == null && node != null)
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
	EditorUi.prototype.downloadFile = function(format, nonCompressed, addShadow, ignoreSelection, currentPage, pageVisible, transparent)
	{
		try
		{
			ignoreSelection = (ignoreSelection != null) ? ignoreSelection : this.editor.graph.isSelectionEmpty();
			var basename = this.getBaseFilename(!currentPage);
			var filename = basename + '.' + format;
			
			if (format == 'xml')
			{
		    	var data = '<?xml version="1.0" encoding="UTF-8"?>\n' +
		    		((nonCompressed) ? mxUtils.getXml(this.editor.getGraphXml(ignoreSelection)) :
		    			this.getFileData(true, null, null, null, ignoreSelection, currentPage));
		    	
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
					this.convertImages(svgRoot, mxUtils.bind(this, mxUtils.bind(this, function(svgRoot2)
					{
						this.spinner.stop();
						
						saveSvg('<?xml version="1.0" encoding="UTF-8"?>\n' +
							'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
							mxUtils.getXml(svgRoot2));
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
				if (format == 'xmlpng')
				{
					filename = basename + '.png';
				}
				else if (format == 'jpeg')
				{
					filename = basename + '.jpg';
				}
				
				this.saveRequest(filename, format, mxUtils.bind(this, function(newTitle, base64)
				{
					try
					{
						var prev = this.editor.graph.pageVisible;
						
						if (pageVisible != null)
						{
							this.editor.graph.pageVisible = pageVisible;
						}
						
						var req = this.createDownloadRequest(newTitle, format, ignoreSelection, base64, transparent);
						this.editor.graph.pageVisible = prev;
						
						return req;
					}
					catch (e)
					{
						this.handleError(e);
					}
				}));
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
	EditorUi.prototype.createDownloadRequest = function(filename, format, ignoreSelection, base64, transparent)
	{
		var bounds = this.editor.graph.getGraphBounds();
		
		// Exports only current page for PDF since it does not contain file data, but for
		// the other formats with XML included we need to send the complete data and use
		// the from/to URL parameters to specify the page to be exported.
		var data = this.getFileData(true, null, null, null, ignoreSelection, format != 'xmlpng');
		var range = '';
		
		if (bounds.width * bounds.height > MAX_AREA || data.length > MAX_REQUEST_SIZE)
		{
			throw {message: mxResources.get('drawingTooLarge')};
		}
		
		var embed = '0';
       	
       	if (format == 'xmlpng')
       	{
       		embed = '1';
       		format = 'png';
       		
       		// Finds the current page number
       		if (this.pages != null && this.currentPage != null)
       		{
       			for (var i = 0; i < this.pages.length; i++)
       			{
       				if (this.pages[i] == this.currentPage)
       				{
       					range = '&from=' + i;
       					break;
       				}
       			}
       		}
       	}
       	
		var bg = this.editor.graph.background;
		
		if (format == 'png' && transparent)
		{
			bg = mxConstants.NONE;
		}
       	
		return new mxXmlRequest(EXPORT_URL, 'format=' + format + range +
			'&bg=' + ((bg != null) ? bg : mxConstants.NONE) +
			'&base64=' + base64 + '&embedXml=' + embed + '&xml=' +
			encodeURIComponent(data) + ((filename != null) ?
			'&filename=' + encodeURIComponent(filename) : ''));
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
					this.editor.setStatus('');
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
            var realUrl = desc.url;
            
            if ((/^https?:\/\//.test(realUrl)) && !this.isCorsEnabledForUrl(realUrl))
            {
                realUrl = PROXY_URL + '?url=' + encodeURIComponent(desc.url);
            }

            // LATER: Remove cache-control header
            this.loadUrl(realUrl, mxUtils.bind(this, function(data)
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
		
		function createOverlay(desc)
		{
			var overlay = new mxCellOverlay(desc.image || graph.warningImage,
				desc.tooltip, desc.align, desc.valign, desc.offset);

			// Installs a handler for clicks on the overlay
			overlay.addListener(mxEvent.CLICK, function(sender, evt)
			{
				editorUi.alert(desc.tooltip);
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
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.fileLoaded = function(file)
	{
		var result = false;
		this.hideDialog();
		var oldFile = this.getCurrentFile();
		this.setCurrentFile(null);
	
		if (oldFile != null)
		{
			oldFile.removeListener(this.descriptorChangedListener);
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
			if (window.location.hash != null && window.location.hash.length > 0)
			{
				window.location.hash = '';
			}
			
			if (this.fname != null)
			{
				this.fnameWrapper.style.display = 'none';
				this.fname.innerHTML = '';
				this.fname.setAttribute('title', mxResources.get('rename'));
			}

			this.editor.setStatus('');
			this.updateUi();
			this.showSplash();
		});
	
		if (file != null)
		{
			try
			{
				// Order is significant, current file needed for correct
				// file format for initial save after starting realtime
				this.setCurrentFile(file);
				file.addListener('descriptorChanged', this.descriptorChangedListener);
				file.addListener('contentChanged', this.descriptorChangedListener);
				file.open();
				
				// DescriptorChanged updates the enabled state of the graph
				this.setGraphEnabled(true);
				this.setMode(file.getMode());
				this.editor.undoManager.clear();
				this.descriptorChanged();
				this.updateUi();
				
				// Realtime files have a valid status message
				if (file.realtime == null)
				{
					if (!file.isEditable())
					{
						this.editor.setStatus('<span class="geStatusAlert" style="margin-left:8px;">' +
							mxUtils.htmlEntities(mxResources.get('readOnly')) + '</span>');
					}
					else
					{
						this.editor.setStatus('');
					}
				}
	
				if (!this.editor.isChromelessView() || this.editor.editable)
				{
					this.editor.graph.selectUnlockedLayer();
					this.showLayersDialog();
					this.restoreLibraries();
					
					// Workaround for no initial focus in FF
					if (window.self !== window.top)
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
				
				this.editor.fireEvent(new mxEventObject('fileLoaded'));
				result = true;

				if (!this.isOffline() && file.getMode() != null)
				{
					this.logEvent({category: 'File', action: 'open', label: file.getMode()})
				}
				
				if (this.mode == file.getMode() && file.getMode() != App.MODE_DEVICE && file.getMode() != null)
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
				// Makes sure the file does not save the invalid UI model and overwrites anything important
				if (window.console != null)
				{
					console.log('error in fileLoaded:', file, e);
				}
				
				if (EditorUi.enableLogging && !this.isOffline())
				{
			        	try
			        	{
						var img = new Image();
						var logDomain = window.DRAWIO_LOG_URL != null ? window.DRAWIO_LOG_URL : '';
				    		img.src = logDomain + '/log?v=' + encodeURIComponent(EditorUi.VERSION) +
				    			'&msg=errorInFileLoaded:url:' + encodeURIComponent(window.location.href) +
			    				((e != null && e.message != null) ? ':err:' + encodeURIComponent(e.message) : '') +
			    				((e != null && e.stack != null) ? '&stack=' + encodeURIComponent(e.stack) : '');
			        	}
			        	catch (e)
			        	{
			        		// ignore
			        	}
				}
				
				// Asynchronous handling of errors
				this.handleError(e, mxResources.get('errorLoadingFile'), mxUtils.bind(this, function()
				{
					// Removes URL parameter and reloads the page
					if (urlParams['url'] != null && this.spinner.spin(document.body, mxResources.get('reconnecting')))
					{
						window.location.search = this.getSearch(['url']);
					}
					else if (oldFile != null)
					{
						// Workaround for close realtime model is to reload the file from scratch
						if (oldFile.constructor == DriveFile)
						{
							this.loadFile(oldFile.getHash());
						}
						else
						{
							this.fileLoaded(oldFile);
						}
					}
					else
					{
						noFile();
					}
				}));
			}
		}
		else
		{
			noFile();
		}
		
		return result;
	};
	
	/**
	 * Adds empty implementation
	 */
	EditorUi.prototype.descriptorChanged = function()
	{
		// empty
	};
	
	/**
	 * Updates action states depending on the selection.
	 */
	EditorUi.prototype.logEvent = function(data)
	{
		if (EditorUi.enableLogging)
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
	 * Updates action states depending on the selection.
	 */
	EditorUi.prototype.restoreLibraries = function()
	{
		// hook for subclassers
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.saveLibrary = function(name, images, file, mode, noSpin, noReload, fn)
	{
		// hook for subclassers
	};
	
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
				this.getLocalData('.scratchpad', mxUtils.bind(this, function(xml)
				{
					if (xml == null)
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
		var doc = mxUtils.createXmlDocument();
		var library = doc.createElement('mxlibrary');
		mxUtils.setTextContent(library, JSON.stringify(images));
		doc.appendChild(library);
		
		return mxUtils.getXml(doc);
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
	 * Changes the position of the library in the sidebar 
	 */
	EditorUi.prototype.repositionLibrary = function(nextChild) 
	{
	    var c = this.sidebar.container;
	    
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
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.loadLibrary = function(file)
	{
		var doc = mxUtils.parseXml(file.getData());
		
		if (doc.documentElement.nodeName == 'mxlibrary')
		{
			var images = JSON.parse(mxUtils.getTextContent(doc.documentElement));
			this.libraryLoaded(file, images, doc.documentElement.getAttribute('title'));
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
	EditorUi.prototype.libraryLoaded = function(file, images, optionalTitle)
	{
		if (this.sidebar == null)
		{
			return;
		}
		
		if (file.constructor != LocalLibrary)
		{
			mxSettings.addCustomLibrary(file.getHash());
		}
	
		if (file.title == '.scratchpad')
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
					mxUtils.setPrefixedStyle(dropTarget.style, 'borderRadius', '6px');
					dropTarget.style.border = '3px dotted lightGray';
					dropTarget.style.textAlign = 'center';
					dropTarget.style.padding = '8px';
					dropTarget.style.color = '#B3B3B3';
					mxUtils.write(dropTarget, mxResources.get('dragElementsHere'));
				}
				
				content.appendChild(dropTarget);
			}
			else
			{
				for (var i = 0; i < imgs.length; i++)
				{
					var img = imgs[i];
					var data = img.data;
		
					if (data != null)
					{
						data = this.convertDataUri(data);
						var s = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;';
						
						if (img.aspect == 'fixed')
						{
							s += 'aspect=fixed;'
						}
						
						content.appendChild(this.sidebar.createVertexTemplate(s + 'image=' +
							data, img.w, img.h, '', img.title || '', false, false, true));
					}
					else if (img.xml != null)
					{
						var cells = this.stringToCells(this.editor.graph.decompress(img.xml));
						
						if (cells.length > 0)
						{
							content.appendChild(this.sidebar.createVertexTemplateFromCells(
								cells, img.w, img.h, img.title || '', true, false, true));
						}
					}
				}
			}
		});

		// Adds entries to search index
		// KNOWN: Existing entries are not replaced after edit of custom library
		if (this.sidebar != null && images != null)
		{
			for (var i = 0; i < images.length; i++)
			{
				(mxUtils.bind(this, function(img)
				{
					var data = img.data;
					
					if (data != null && img.title != null)
					{
						this.sidebar.addEntry(img.title, mxUtils.bind(this, function()
						{
							data = this.convertDataUri(data);
							var s = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;';
							
							if (img.aspect == 'fixed')
							{
								s += 'aspect=fixed;'
							}
							
							return this.sidebar.createVertexTemplate(s + 'image=' +
								data, img.w, img.h, '', img.title || '', false, false, true)
						}));
					}
					else if (img.xml != null && img.title != null)
					{
						this.sidebar.addEntry(img.title, mxUtils.bind(this, function()
						{
							var cells = this.stringToCells(this.editor.graph.decompress(img.xml));
	
							return this.sidebar.createVertexTemplateFromCells(
								cells, img.w, img.h, img.title || '', true, false, true);
						}));
					}
				}))(images[i]);
			}
		}
		
		// Adds new sidebar entry for this library
		var tmp = (optionalTitle != null && optionalTitle.length > 0) ? optionalTitle : file.getTitle();
		var contentDiv = this.sidebar.addPalette(file.getHash(), tmp, true, mxUtils.bind(this, function(content)
		{
			addImages(images, content);
	    }));
	
		this.repositionLibrary(nextSibling);
		
		// Adds tooltip for backend
		var title = contentDiv.parentNode.previousSibling;
	    var tip = title.getAttribute('title');
	    
	    if (tip != null && tip.length > 0 && file.title != '.scratchpad')
	    {
	    	title.setAttribute('title', this.getLibraryStorageHint(file) + '\n' + tip);
	    }
	    
	    var buttons = document.createElement('div');
	    buttons.style.position = 'absolute';
	    buttons.style.right = '0px';
	    buttons.style.top = '0px';
	    buttons.style.padding = '8px'
	    
	    // Workaround for CSS error in IE8 (standards and quirks)
	    if (!mxClient.IS_QUIRKS && document.documentMode != 8)
	    {
	    		buttons.style.backgroundColor = 'inherit';
	    }
	    
	    title.style.position = 'relative';
	    
	    var btnWidth = 18;
		var btn = document.createElement('img');
		btn.setAttribute('src', Dialog.prototype.closeImage);
		btn.setAttribute('title', mxResources.get('close'));
		btn.setAttribute('valign', 'absmiddle');
		btn.setAttribute('border', '0');
		btn.style.margin = '0 3px';
		
		var saveBtn = null;
		
	    if (file.title != '.scratchpad' || this.closableScratchpad)
	    {
			buttons.appendChild(btn);
			
			mxEvent.addListener(btn, 'click', mxUtils.bind(this, function(evt)
			{
				// Workaround for close after any button click in IE8/quirks
				if (!mxEvent.isConsumed(evt))
				{
					var fn = mxUtils.bind(this, function()
					{
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
					title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
					
					this.saveLibrary(file.getTitle(), images, file, file.getMode(), true, true, function()
					{
						if (spinBtn != null && spinBtn.parentNode != null)
						{
							spinBtn.parentNode.removeChild(spinBtn);
							title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
						}
					});
				}
				else if (saveBtn == null)
				{
					saveBtn = btn.cloneNode(false);
					saveBtn.setAttribute('src', IMAGE_PATH + '/download.png');
					saveBtn.setAttribute('title', mxResources.get('save'));
					buttons.insertBefore(saveBtn, buttons.firstChild);
					
					mxEvent.addListener(saveBtn, 'click', mxUtils.bind(this, function(evt)
					{
						this.saveLibrary(file.getTitle(), images, file, file.getMode(),
							file.constructor == LocalLibrary, true, function()
							{
								if (saveBtn != null && !file.isModified())
								{
									title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
									saveBtn.parentNode.removeChild(saveBtn);
									saveBtn = null;
								}
							});
						
						mxEvent.consume(evt);
					}));
					
					title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
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
					cells, bounds.width, bounds.height, title || '', true, false, false));
	
				var xml = this.editor.graph.compress(mxUtils.getXml(this.editor.graph.encodeCells(cells)));
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
					
					var s = graph.view.scale;
					
					bounds.x /= s;
					bounds.y /= s;
					bounds.width /= s;
					bounds.height /= s;
					
					bounds.x -= graph.view.translate.x;
					bounds.y -= graph.view.translate.y;
					
					addCells(cells, bounds);
				}
				else if (graph.getRubberband().isActive())
				{
					graph.getRubberband().execute(evt);
					graph.getRubberband().reset();
				}
				else
				{
					this.showError(mxResources.get('error'), mxResources.get('nothingIsSelected'), mxResources.get('ok'));
				}
				
				mxEvent.consume(evt);
			});
			
			// Defines inactive border state
			contentDiv.style.border = '3px solid transparent';
			
			// Adds drop handler from graph
			mxEvent.addGestureListeners(contentDiv, function(){}, mxUtils.bind(this, function(evt)
			{
				if (graph.isMouseDown && graph.panningManager != null && graph.graphHandler.shape != null)
				{
					graph.graphHandler.shape.node.style.visibility = 'hidden';
					
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted rgb(254, 137, 12)';
					}
					else
					{
						contentDiv.style.border = '3px dotted rgb(254, 137, 12)';
					}
					
					contentDiv.style.cursor = 'copy';
					graph.panningManager.stop();
					graph.autoScroll = false;
					
					if (graph.graphHandler.guide != null)
					{
						graph.graphHandler.guide.setVisible(false);
					}
					
					if (graph.graphHandler.hint != null)
					{
						graph.graphHandler.hint.style.visibility = 'hidden';	
					}
					
					mxEvent.consume(evt);
				}
			}), mxUtils.bind(this, function(evt)
			{
				if (graph.isMouseDown && graph.panningManager != null && graph.graphHandler != null)
				{
					contentDiv.style.border = '3px solid transparent';
					
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted lightGray';
					}
					
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
				if (graph.isMouseDown && graph.graphHandler.shape != null)
				{
					graph.graphHandler.shape.node.style.visibility = 'visible';
					contentDiv.style.border = '3px solid transparent';
					contentDiv.style.cursor = '';
					graph.autoScroll = true;
					
					if (graph.graphHandler.guide != null)
					{
						graph.graphHandler.guide.setVisible(true);
					}
					
					if (graph.graphHandler.hint != null)
					{
						graph.graphHandler.hint.style.visibility = 'visible';	
					}
					
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted lightGray';
					}
				}
			}));
			
			// Adds drop handler from filesystem
			if (Graph.fileSupport)
			{
				mxEvent.addListener(contentDiv, 'dragover', mxUtils.bind(this, function(evt)
				{
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted rgb(254, 137, 12)';
					}
					else
					{
						contentDiv.style.border = '3px dotted rgb(254, 137, 12)';
					}
					
					evt.dataTransfer.dropEffect = 'copy';
					contentDiv.style.cursor = 'copy';
					this.sidebar.hideTooltip();
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(contentDiv, 'drop', mxUtils.bind(this, function(evt)
				{
					contentDiv.style.border = '3px solid transparent';
					contentDiv.style.cursor = '';
					
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted lightGray';
					}
					
				    if (evt.dataTransfer.files.length > 0)
				    {	
				    	this.importFiles(evt.dataTransfer.files, 0, 0, this.maxImageSize, mxUtils.bind(this, function(data, mimeType, x, y, w, h, img, doneFn, file)
				    	{
							if (data != null && mimeType.substring(0, 6) == 'image/')
							{
								var style = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;image=' +
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
									if (theData != null && theMimeType == 'text/xml')
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
													var temp = mxUtils.getTextContent(pages[i]);
													var cells = this.stringToCells(this.editor.graph.decompress(temp));
													var size = this.editor.graph.getBoundingBoxFromGeometry(cells);
													addCells(cells, new mxRectangle(0, 0, size.width, size.height), evt);
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
								
								if (file != null && img != null && ((/(\.vsdx?)($|\?)/i.test(img)) || /(\.vssx?)($|\?)/i.test(img)))
								{
									this.importVisio(file, function(xml)
									{
										doImport(xml, 'text/xml');
									}, null, img);
								}
								else if (!this.isOffline() && new XMLHttpRequest().upload && this.isRemoteFileFormat(data, img) && file != null)
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
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted lightGray';
					}
					else
					{
						contentDiv.style.border = '3px solid transparent';
						contentDiv.style.cursor = '';
					}
	
					evt.stopPropagation();
					evt.preventDefault();
				});
			}
	
			btn = btn.cloneNode(false);
			btn.setAttribute('src', Editor.editImage);
			btn.setAttribute('title', mxResources.get('edit'));
			buttons.insertBefore(btn, buttons.firstChild);
			
			mxEvent.addListener(btn, 'click', editLibrary);
			mxEvent.addListener(contentDiv, 'dblclick', function(evt)
			{
				if (mxEvent.getSource(evt) == contentDiv)
				{
					editLibrary(evt);
				}
			});
			
			var btn2 = btn.cloneNode(false);
			btn2.setAttribute('src', Editor.plusImage);
			btn2.setAttribute('title', mxResources.get('add'));
			buttons.insertBefore(btn2, buttons.firstChild);
			mxEvent.addListener(btn2, 'click', addSelection);
			
			if (!this.isOffline() && file.title == '.scratchpad' && EditorUi.scratchpadHelpLink != null)
			{
				var link = document.createElement('span');
				link.setAttribute('title', mxResources.get('help'));
				link.style.cssText = 'color:#a3a3a3;text-decoration:none;margin-right:2px;';
				mxUtils.write(link, '?');
				
				mxEvent.addGestureListeners(link, mxUtils.bind(this, function(evt)
				{
					this.openLink(EditorUi.scratchpadHelpLink);
					mxEvent.consume(evt);
				}));
				
				buttons.insertBefore(link, buttons.firstChild);
			}
		}
		
		title.appendChild(buttons);
		title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
	};

	/**
	 * EditorUi Overrides
	 */
    if (urlParams['offline'] == '1' || EditorUi.isElectronApp)
    {
		EditorUi.prototype.footerHeight = 4;
    }
    else
    {
		if (urlParams['savesidebar'] == '1')
		{
    		Sidebar.prototype.thumbWidth = 64;
    		Sidebar.prototype.thumbHeight = 64;
		}

		EditorUi.prototype.footerHeight = (screen.width >= 760 && screen.height >= 240) ? 46 : 0;
		
		// Fetches footer from page
		EditorUi.prototype.createFooter = function()
		{
			var footer = document.getElementById('geFooter');
			
			if (footer != null)
			{
				footer.style.visibility = 'visible';
				
				// Adds button to hide the footer
				var img = document.createElement('img');
				img.setAttribute('border', '0');
				img.setAttribute('src', Dialog.prototype.closeImage);
				img.setAttribute('title', mxResources.get('hide'));
				footer.appendChild(img)

				if (mxClient.IS_QUIRKS)
				{
					img.style.position = 'relative';
					img.style.styleFloat = 'right';
					img.style.top = '-30px';
					img.style.left = '164px';
					img.style.cursor = 'pointer';
				}
				
				mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
				{
					this.hideFooter();
				}));
			}

			return footer;
		};
    }
    
    EditorUi.initTheme = function()
    {
    	if (uiTheme == 'atlas')
    	{
    		mxClient.link('stylesheet', STYLE_PATH + '/atlas.css');

    		if (typeof Toolbar !== 'undefined')
    		{
    			Toolbar.prototype.unselectedBackground = (mxClient.IS_QUIRKS) ? 'none' : 'linear-gradient(rgb(255, 255, 255) 0px, rgb(242, 242, 242) 100%)';
    			Toolbar.prototype.selectedBackground = 'rgb(242, 242, 242)';
    		}
    		
    		Editor.prototype.initialTopSpacing = 3;
    		EditorUi.prototype.menubarHeight = 41;
    		EditorUi.prototype.toolbarHeight = 38;
    		EditorUi.prototype.hsplitPosition = 188;
    		Sidebar.prototype.thumbWidth = 46;
    		Sidebar.prototype.thumbHeight = 46;
    		Sidebar.prototype.thumbPadding = (document.documentMode >= 5) ? 0 : 1;
    		Sidebar.prototype.thumbBorder = 2;
    	}
    	else if (uiTheme == 'dark')
    	{
    		mxClient.link('stylesheet', STYLE_PATH + '/dark.css');

			Dialog.backdropColor = '#2a2a2a';
	    		Graph.prototype.defaultThemeName = 'darkTheme';
			Graph.prototype.defaultPageBackgroundColor = '#2a2a2a';
			Graph.prototype.defaultGraphBackground = null;
			Graph.prototype.defaultPageBorderColor = '#505759';
		    Graph.prototype.svgShadowColor = '#e0e0e0';
		    Graph.prototype.svgShadowOpacity = '0.6';
		    Graph.prototype.svgShadowSize = '0.8';
		    Graph.prototype.svgShadowBlur = '1.4';
			Format.prototype.inactiveTabBackgroundColor = 'black';
			BaseFormatPanel.prototype.buttonBackgroundColor = '#2a2a2a';
			Sidebar.prototype.dragPreviewBorder = '1px dashed #cccccc';
			mxGraphHandler.prototype.previewColor = '#cccccc';
			StyleFormatPanel.prototype.defaultStrokeColor = '#cccccc';
			
			if (mxClient.IS_SVG)
			{
				Editor.helpImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAP1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////9Du/pqAAAAFXRSTlMAT30qCJRBboyDZyCgRzUUdF46MJlgXETgAAAAeklEQVQY022O2w4DIQhEQUURda/9/28tUO2+7CQS5sgQ4F1RapX78YUwRqQjTU8ILqQfKerTKTvACJ4nLX3krt+8aS82oI8aQC4KavRgtvEW/mDvsICgA03PSGRr79MqX1YPNIxzjyqtw8ZnnRo4t5a5undtJYRywau+ds4Cyza3E6YAAAAASUVORK5CYII=';
				Editor.checkmarkImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAARVBMVEUAAACZmZkICAgEBASNjY2Dg4MYGBiTk5N5eXl1dXVmZmZQUFBCQkI3NzceHh4MDAykpKSJiYl+fn5sbGxaWlo/Pz8SEhK96uPlAAAAAXRSTlMAQObYZgAAAE5JREFUGNPFzTcSgDAQQ1HJGUfy/Y9K7V1qeOUfzQifCQZai1XHaz11LFysbDbzgDSSWMZiETz3+b8yNUc/MMsktxuC8XQBSncdLwz+8gCCggGXzBcozAAAAABJRU5ErkJggg==';
			}
    	}
    };
    
    EditorUi.initTheme();
    
    /**
     * Hides the footer.
     */
    EditorUi.prototype.hideFooter = function()
    {
	    	var footer = document.getElementById('geFooter');
		    	
	    	if (footer != null)
	    	{
	    		this.footerHeight = 0;
	    		footer.style.display = 'none';
	    		this.refresh();
	    	}
    };

    /**
     * Shows the footer.
     */
    EditorUi.prototype.showFooter = function(height)
    {
    	var footer = document.getElementById('geFooter');
	    	
    	if (footer != null)
    	{
    		this.footerHeight = height;
    		footer.style.display = 'inline';
    		this.refresh();
    	}
    };
    
	/**
	 * Overrides image dialog to add image search and Google+.
	 */
    EditorUi.prototype.showImageDialog = function(title, value, fn, ignoreExisting, convertDataUri)
	{
		// KNOWN: IE+FF don't return keyboard focus after image dialog (calling focus doesn't help)
	    	var dlg = new ImageDialog(this, title, value, fn, ignoreExisting, convertDataUri);
		this.showDialog(dlg.container, (Graph.fileSupport) ? 440 : 360, (Graph.fileSupport) ? 200 : 90, true, true);
		dlg.init();
	};

	/**
	 * Hides the current menu.
	 */
	EditorUi.prototype.showBackgroundImageDialog = function(apply)
	{
		apply = (apply != null) ? apply : mxUtils.bind(this, function(image)
		{
			var change = new ChangePageSetup(this, null, image);
			change.ignoreColor = true;
			
			this.editor.graph.model.execute(change);
		});
		var dlg = new BackgroundImageDialog(this, mxUtils.bind(this, function(image)
		{
			apply(image);
		}));
		this.showDialog(dlg.container, 360, 200, true, true);
		dlg.init();
	};

	/**
	 * Hides the current menu.
	 */
	EditorUi.prototype.showLibraryDialog = function(name, sidebar, images, file, mode)
	{
		var dlg = new LibraryDialog(this, name, sidebar, images, file, mode);
		
		this.showDialog(dlg.container, 620, 440, true, false, mxUtils.bind(this, function(cancel)
		{
			if (cancel && this.getCurrentFile() == null && urlParams['embed'] != '1')
			{
				this.showSplash();
			}
		}));
		
		dlg.init();
	};

	/**
	 * Hook for sidebar footer container.
	 */
	EditorUi.prototype.createSidebarFooterContainer = function()
	{
		var div =  this.createDiv('geSidebarContainer');
		div.style.position = 'absolute';
		div.style.overflow = 'hidden';
		div.style.borderWidth = '3px';

		var elt2 = document.createElement('a');
		elt2.setAttribute('href', 'javascript:void(0);');
		elt2.className = 'geTitle';
		elt2.style.height = '100%';
		elt2.style.paddingTop = '9px';

		mxUtils.write(elt2, mxResources.get('moreShapes') + '...');

		mxEvent.addListener(elt2, 'click', mxUtils.bind(this, function(evt)
		{
			this.actions.get('shapes').funct();
			mxEvent.consume(evt);
		}));
		
		div.appendChild(elt2);
		
		return div;
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.handleError = function(resp, title, fn)
	{
		var resume = (this.spinner != null && this.spinner.pause != null) ? this.spinner.pause() : function() {};
		var e = (resp != null && resp.error != null) ? resp.error : resp;
	
		if (e != null || title != null)
		{
			var msg = mxUtils.htmlEntities(mxResources.get('unknownError'));
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
				
				if (typeof(gapi) != 'undefined' && typeof(gapi.drive) != 'undefined' && typeof(gapi.drive.realtime) != 'undefined' &&
					e.type == gapi.drive.realtime.ErrorType.FORBIDDEN)
				{
					msg = mxUtils.htmlEntities(mxResources.get('forbidden'));
				}
				else if (e.code == 404 || e.status == 404 || (typeof(gapi) != 'undefined' && typeof(gapi.drive) != 'undefined' &&
						typeof(gapi.drive.realtime) != 'undefined' && e.type == gapi.drive.realtime.ErrorType.NOT_FOUND))
				{
					msg = mxUtils.htmlEntities(mxResources.get('fileNotFoundOrDenied'));
					var id = window.location.hash;
					
					if (id != null && id.substring(0, 2) == '#G')
					{
						id = id.substring(2);
						msg += ' <a href="https://drive.google.com/open?id=' + id + '" target="_blank">' +
							mxUtils.htmlEntities(mxResources.get('tryOpeningViaThisPage')) + '</a>';
					}
				}
				else if (e.message != null)
				{
					msg = mxUtils.htmlEntities(e.message);
				}
				else if (e.response != null && e.response.error != null)
				{
					msg = mxUtils.htmlEntities(e.response.error);
				}
				else if (window.App !== 'undefined')
				{
					if (e.code == App.ERROR_TIMEOUT)
					{
						msg = mxUtils.htmlEntities(mxResources.get('timeout'));
					}
					else if (e.code == App.ERROR_BUSY)
					{
						msg = mxUtils.htmlEntities(mxResources.get('busy'));
					}
				}
			}
	
			this.showError(title, msg, btn, fn, retry);
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
	EditorUi.prototype.showError = function(title, msg, btn, fn, retry, btn2, fn2, btn3, fn3, w, h, hide)
	{
		var dlg = new ErrorDialog(this, title, msg, btn || mxResources.get('ok'), fn, retry, btn2, fn2, hide, btn3, fn3);
		this.showDialog(dlg.container, w || 340, h || 150, true, false);
		dlg.init();
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.alert = function(msg, fn)
	{
		var dlg = new ErrorDialog(this, null, msg, mxResources.get('ok'), fn);
		this.showDialog(dlg.container, 340, 100, true, false);
		dlg.init();
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.confirm = function(msg, okFn, cancelFn, okLabel, cancelLabel)
	{
		var resume = (this.spinner != null && this.spinner.pause != null) ? this.spinner.pause() : function() {};
		
		this.showDialog(new ConfirmDialog(this, msg, function()
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
		}, okLabel, cancelLabel).container, 340, 90, true, false);	
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.setCurrentFile = function(file)
	{
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
	 * Handling for canvas export.
	 */

	/**
	 * See fixme in convertMath for client-side image generation with math.
	 */
	EditorUi.prototype.isExportToCanvas = function()
	{
		return mxClient.IS_CHROMEAPP || (!this.editor.graph.mathEnabled && this.useCanvasForExport);
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createSvgDataUri = function(svg)
	{
		return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
	};

	/**
	 * 
	 */
	EditorUi.prototype.createImageDataUri = function(canvas, xml, format)
	{
   	    var data = canvas.toDataURL('image/' + format);
   	    
   	    // Checks if output is invalid or empty
   	    if (data.length <= 6 || data == canvas.cloneNode(false).toDataURL('image/' + format))
   	    {
   	    		throw {message: 'Invalid image'};
   	    }
   	    
   	    if (xml != null)
   	    {
   	   		data = this.writeGraphModelToPng(data, 'zTXt', 'mxGraphModel', atob(this.editor.graph.compress(xml)));
   	    }
   	    
   	    return data;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.saveCanvas = function(canvas, xml, format)
	{
		var ext = ((format == 'jpeg') ? 'jpg' : format);
		var filename = this.getBaseFilename() + '.' + ext;
   	    var data = this.createImageDataUri(canvas, xml, format);
   	    this.saveData(filename, ext, data.substring(data.lastIndexOf(',') + 1), 'image/' + format, true);
	};
	
	/**
	 * Returns true if files should be saved using <saveLocalFile>.
	 */
	EditorUi.prototype.isLocalFileSave = function()
	{
		return ((urlParams['save'] != 'remote' && (mxClient.IS_IE ||
			(typeof window.Blob !== 'undefined' && typeof window.URL !== 'undefined')) &&
			document.documentMode != 9 && document.documentMode != 8 &&
			document.documentMode != 7 && !mxClient.IS_QUIRKS) ||
			this.isOfflineApp() || mxClient.IS_IOS);
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.doSaveLocalFile = function(data, filename, mimeType, base64Encoded, format)
	{
		// Newer versions of IE
		if (window.Blob && navigator.msSaveOrOpenBlob)
		{
			var blob = (base64Encoded) ?
					this.base64ToBlob(data, mimeType) :
					new Blob([data], {type: mimeType})
			navigator.msSaveOrOpenBlob(blob, filename);
		}
		// Older versions of IE (binary not supported)
		else if (mxClient.IS_IE)
		{
			var win = window.open('about:blank', '_blank');
			
			if (win == null)
			{
				mxUtils.popup(data, true);
			}
			else
			{
				win.document.write(data);
				win.document.close();
				win.document.execCommand('SaveAs', true, filename);
				win.close();
			}
		}
		else if (mxClient.IS_IOS)
		{
			// Poor man's saveAs in iOS via context menu of selected output
		    	var dlg = new TextareaDialog(this, filename + ':', data, null, null, mxResources.get('close'));
		    	dlg.textarea.style.width = '600px';
		    	dlg.textarea.style.height = '380px';
				this.showDialog(dlg.container, 620, 460, true, true);
				dlg.init();
				document.execCommand('selectall', false, null);
		}
		else
		{
			var a = document.createElement('a');
			
			// Workaround for mxXmlRequest.simulate no longer working in Safari/PaleMoon
			// if this is used (ie PNG export broken after XML export in Safari/PaleMoon).
			var useDownload = !mxClient.IS_SF && navigator.userAgent.indexOf("PaleMoon/") < 0 &&
				typeof a.download !== 'undefined';
			
			// Workaround for Chromium 65 cross-domain anchor download issue
			if (mxClient.IS_GC)
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
					}, 0);

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
			'data=' + encodeURIComponent(this.editor.graph.compress(data));
		
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
	EditorUi.prototype.base64ToBlob = function(base64Data, contentType)
	{
	    contentType = contentType || '';
	    var sliceSize = 1024;
	    var byteCharacters = atob(base64Data);
	    var bytesLength = byteCharacters.length;
	    var slicesCount = Math.ceil(bytesLength / sliceSize);
	    var byteArrays = new Array(slicesCount);
	
	    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex)
	    {
	        var begin = sliceIndex * sliceSize;
	        var end = Math.min(begin + sliceSize, bytesLength);
	
	        var bytes = new Array(end - begin);
	        
	        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset)
	        {
	            bytes[i] = byteCharacters[offset].charCodeAt(0);
	        }
	        
	        byteArrays[sliceIndex] = new Uint8Array(bytes);
	    }
	
	    return new Blob(byteArrays, {type: contentType});
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.saveLocalFile = function(data, filename, mimeType, base64Encoded, format, allowBrowser, allowTab)
	{
		allowBrowser = (allowBrowser != null) ? allowBrowser : false;
		allowTab = (allowTab != null) ? allowTab : (format != 'vsdx') && (!mxClient.IS_IOS || !navigator.standalone);
		var count = this.getServiceCount(allowBrowser);
		
		var dlg = new CreateDialog(this, filename, mxUtils.bind(this, function(newTitle, mode)
		{
			try
			{
				// Opens a new window
				if (mode == '_blank')
				{
					if (mimeType != null && mimeType.substring(0, 6) == 'image/' &&
						(mimeType.substring(0, 9) != 'image/svg' || mxClient.IS_SVG))
					{
						this.openInNewWindow(data, mimeType, base64Encoded);
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
							win.document.write(mxUtils.htmlEntities(data, false));
							win.document.close();
						}
					}
				}
				else if (mode == App.MODE_DEVICE || mode == 'download')
				{
					this.doSaveLocalFile(data, newTitle, mimeType, base64Encoded);
				} 
				else if (newTitle != null && newTitle.length > 0)
				{
					this.pickFolder(mode, mxUtils.bind(this, function(folderId)
					{
						try
						{
							this.exportFile(data, newTitle, mimeType, base64Encoded, mode, folderId);
						}
						catch (e)
						{
							this.handleError(e);
						}
					}));
				}
			}
			catch (e)
			{
				this.handleError(e);
			}
		}), mxUtils.bind(this, function()
		{
			this.hideDialog();
		}), mxResources.get('saveAs'), mxResources.get('download'), false, allowBrowser, allowTab,
			null, count > 1, (count > 4 && (!allowBrowser || count < 6)) ? 3 : 4, data, mimeType, base64Encoded);
		var noServices = (mxClient.IS_IOS) ? 0 : 1;
		var height = (count == noServices) ? 160 : ((count > 4) ? 390 : 270);
		this.showDialog(dlg.container, 420, height, true, true);
		dlg.init();
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.openInNewWindow = function(data, mimeType, base64Encoded)
	{
		// In Google Chrome 60 the code from below produces a blank window
		if (mxClient.IS_GC || mxClient.IS_EDGE || document.documentMode == 11 || document.documentMode == 10)
		{
			var win = window.open('about:blank');
			
			if (win == null)
			{
				mxUtils.popup(data, true);
			}
			else
			{
				// Workaround for broken images in SVG output in Chrome
				if (mimeType == 'image/svg+xml')
				{
					win.document.write('<html>' + data + '</html>');
				}
				else
				{
					win.document.write('<html><img src="data:' +
						mimeType + ((base64Encoded) ? ';base64,' +
						data : ';charset=utf8,' + encodeURIComponent(data)) +
						'"/></html>');
				}
				
				win.document.close();
			}
		}
		else
		{
			// win.open is workaround for cleared contents in Chrome after delay
			// when using location.replace
			var win = window.open('data:' + mimeType + ((base64Encoded) ? ';base64,' +
					data : ';charset=utf8,' + encodeURIComponent(data)));
			
			if (win == null)
			{
				mxUtils.popup(data, true);
			}
		}
	};
	
	var editoUiAddChromelessToolbarItems = EditorUi.prototype.addChromelessToolbarItems;

	/**
	 * Creates a temporary graph instance for rendering off-screen content.
	 */
	EditorUi.prototype.addChromelessToolbarItems = function(addButton)
	{
		if (this.isExportToCanvas())
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
					this.exportDialog.style.fontFamily = 'Helvetica,Arial';
					this.exportDialog.style.backgroundColor = '#000000';
					this.exportDialog.style.width = '50px';
					this.exportDialog.style.height = '50px';
					this.exportDialog.style.padding = '4px 2px 4px 2px';
					this.exportDialog.style.color = '#ffffff';
					mxUtils.setOpacity(this.exportDialog, 70);
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
						color: '#fff', // #rgb or #rrggbb
						speed: 1.5, // Rounds per second
						trail: 60, // Afterglow percentage
						shadow: false, // Whether to render a shadow
						hwaccel: false, // Whether to use hardware acceleration
						top: '28px',
						zIndex: 2e9 // The z-index (defaults to 2000000000)
					});
					spinner.spin(this.exportDialog);
					
				   	this.exportToCanvas(mxUtils.bind(this, function(canvas)
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
				   		this.spinner.stop();
				   		this.handleError(e);
				   	}));
					
					mxEvent.addListener(this.editor.graph.container, 'click', clickHandler);
				   	document.body.appendChild(this.exportDialog);
				}
				
				mxEvent.consume(evt);
			}), Editor.cameraLargeImage, mxResources.get('export'));
		}

		editoUiAddChromelessToolbarItems.apply(this, arguments);
	};


	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.saveData = function(filename, format, data, mime, base64Encoded)
	{
		if (this.isLocalFileSave())
		{
			this.saveLocalFile(data, filename, mime, base64Encoded, format);
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
		var count = this.getServiceCount(false);
		
		var dlg = new CreateDialog(this, filename, mxUtils.bind(this, function(newTitle, mode)
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
						this.pickFolder(mode, mxUtils.bind(this, function(folderId)
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
								}), function(resp)
								{
									this.spinner.stop();
									this.handleError(resp);
								});
							}
						}));
					}
				}
			}
		}), mxUtils.bind(this, function()
		{
			this.hideDialog();
		}), mxResources.get('saveAs'), mxResources.get('download'), false, false, allowTab,
			null, count > 1, (count > 4) ? 3 : 4, data, mimeType, base64Encoded);
		var noServices = (mxClient.IS_IOS) ? 0 : 1;
		var height = (count == noServices) ? 160 : ((count > 4) ? 390 : 270);
		this.showDialog(dlg.container, 380, height, true, true);
		dlg.init();
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
	EditorUi.prototype.pickFolder = function(mode, fn, enabled)
	{
		fn(null);
	};

	/**
	 *
	 */
	EditorUi.prototype.exportSvg = function(scale, transparentBackground, ignoreSelection, addShadow, editable, embedImages, border, noCrop, currentPage)
	{
		if (this.spinner.spin(document.body, mxResources.get('export')))
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
				bg = '#ffffff';
			}
			
			// Sets or disables alternate text for foreignObjects. Disabling is needed
			// because PhantomJS seems to ignore switch statements and paint all text.
			var svgRoot = this.editor.graph.getSvg(bg, scale, border, noCrop, null, ignoreSelection);
			
			if (addShadow)
			{
				this.editor.graph.addSvgShadow(svgRoot);
			}
			
			var filename = this.getBaseFilename() + '.svg';

			var doSave = mxUtils.bind(this, function(svgRoot)
			{
				this.spinner.stop();
				
				if (editable)
				{
					svgRoot.setAttribute('content', this.getFileData(true, null, null, null, ignoreSelection, currentPage));
				}
				
				if (this.editor.fontCss != null)
				{
					var svgDoc = svgRoot.ownerDocument;
					var style = (svgDoc.createElementNS != null) ?
							svgDoc.createElementNS(mxConstants.NS_SVG, 'style') : svgDoc.createElement('style');
					style.setAttribute('type', 'text/css');
					mxUtils.setTextContent(style, this.editor.fontCss);
					svgRoot.getElementsByTagName('defs')[0].appendChild(style);
				}
				
				var svg = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
					mxUtils.getXml(svgRoot);
				
		    		if (this.isLocalFileSave() || svg.length <= MAX_REQUEST_SIZE)
		    		{
		    			this.saveData(filename, 'svg', svg, 'image/svg+xml');
		    		}
		    		else
		    		{
		    			this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'), mxUtils.bind(this, function()
		    			{
		    				mxUtils.popup(svg);
		    			}));
		    		}
			});
			
			this.convertMath(this.editor.graph, svgRoot, false, mxUtils.bind(this, function()
			{
				if (embedImages)
				{
					// Caches images
					if (this.thumbImageCache == null)
					{
						this.thumbImageCache = new Object();
					}
					
					this.convertImages(svgRoot, doSave, this.thumbImageCache);
				}
				else
				{
					doSave(svgRoot);
				}
			}));
		}
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.addCheckbox = function(div, label, checked, disabled, disableNewline, visible)
	{
		visible = (visible != null) ? visible : true;
		
		var cb = document.createElement('input');
		cb.style.marginRight = '8px';
		cb.style.marginTop = '16px';
		cb.setAttribute('type', 'checkbox');
		
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
			div.appendChild(cb);
			
			var span = document.createElement('span');
			mxUtils.write(span, label);
			div.appendChild(span);

			if (!disableNewline)
			{
				mxUtils.br(div);
			}
			
			mxEvent.addListener(span, 'click', mxUtils.bind(this, function(evt)
			{
				if (cb.getAttribute('disabled') != 'disabled')
				{
					cb.checked = !cb.checked;
					mxEvent.consume(evt);
				}
			}));
		}
		
		return cb;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.addEditButton = function(div, lightbox)
	{
		var edit = this.addCheckbox(div, mxResources.get('edit') + ':', true, null, true);
		edit.style.marginLeft = '24px';
		
		var file = this.getCurrentFile();
		var editUrl = '';
		
		if (file != null && file.getMode() != App.MODE_DEVICE && file.getMode() != App.MODE_BROWSER)
		{
			editUrl = window.location.href;
		}
		
		var editSelect = document.createElement('select');
		editSelect.style.width = '120px';
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
		
		div.appendChild(editSelect);
		
		mxEvent.addListener(editSelect, 'change', mxUtils.bind(this, function()
		{
			if (editSelect.value == 'custom')
			{
				var dlg2 = new FilenameDialog(this, editUrl, mxResources.get('ok'), function(value)
				{
					if (value != null)
					{
						editUrl = value;
					}
					else
					{
						editSelect.value = 'blank';
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

		mxUtils.br(div);
		
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
			}
		};
	}
	
	/**
	 * 
	 */
	EditorUi.prototype.addLinkSection = function(div, showFrameOption)
	{
		mxUtils.write(div, mxResources.get('links') + ':');

		var linkSelect = document.createElement('select');
		linkSelect.style.width = '100px';
		linkSelect.style.marginLeft = '8px';
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
		
		div.appendChild(linkSelect);
		
		mxUtils.write(div, mxResources.get('borderColor') + ':');
		var linkColor = '#0000ff';
		var linkButton = null;
		
		function updateLinkColor()
		{
			linkButton.innerHTML = '<div style="width:100%;height:100%;box-sizing:border-box;' +
				((linkColor != null && linkColor != mxConstants.NONE) ?
				'border:1px solid black;background-color:' + linkColor :
				'background-position:center center;background-repeat:no-repeat;' +
				'background-image:url(\'' + Dialog.prototype.closeImage + '\')') + ';"></div>';
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
		linkButton.style.top = (mxClient.IS_IE || mxClient.IS_IE11 || mxClient.IS_EDGE) ? '6px' : '1px';
		linkButton.className = 'geColorBtn';
		div.appendChild(linkButton);
		mxUtils.br(div);
		
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
	EditorUi.prototype.createLink = function(linkTarget, linkColor, allPages, lightbox, editLink, layers, url, ignoreFile)
	{
		var file = this.getCurrentFile();
		var params = [];
		
		if (lightbox)
		{
			params.push('lightbox=1');

			if (linkTarget != 'auto')
			{
				params.push('target=' + linkTarget);
			}
			
			if (linkColor != null && linkColor != mxConstants.NONE)
			{
				params.push('highlight=' + ((linkColor.charAt(0) == '#') ? linkColor.substring(1) : linkColor));
			}
			
			if (editLink != null && editLink.length > 0)
			{
				params.push('edit=' + encodeURIComponent(editLink));
			}
			
			if (layers)
			{
				params.push('layers=1');
			}
			
			if (this.editor.graph.foldingEnabled)
			{
				params.push('nav=1');
			}
		}
		
		if (allPages && this.pages != null && this.currentPage != null)
		{
			for (var i = 0; i < this.pages.length; i++)
			{
				if (this.pages[i] == this.currentPage)
				{
					if (i > 0)
					{
						params.push('page=' + i);
					}
					
					break;
				}
			}
		}
		
		var data = '';
		var addTitle = true;
		
		if (url != null)
		{
			data = '#U' + encodeURIComponent(url);
		}
		else
		{
			var file = this.getCurrentFile();

			// Fallback to non-public URL for Drive files	
			if (!ignoreFile && file != null && file.constructor == window.DriveFile)
			{
				data = '#' + file.getHash();
				addTitle = false;
			}
			else
			{
				data = '#R' + encodeURIComponent((allPages) ?
					this.getFileData(true, null, null, null, null, null, null, true) :
					this.editor.graph.compress(mxUtils.getXml(this.editor.getGraphXml())))
			}
		}

		if (addTitle && file != null && file.getTitle() != null && file.getTitle() != this.defaultFilename)
		{
			params.push('title=' + encodeURIComponent(file.getTitle()));
		}

		return ((mxClient.IS_CHROMEAPP || EditorUi.isElectronApp || !(/.*\.draw\.io$/.test(window.location.hostname))) ?
			'https://www.draw.io/' : 'https://' + window.location.host + '/') +
			((params.length > 0) ? '?' + params.join('&') : '') + data;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.createHtml = function(publicUrl, zoomEnabled, initialZoom, linkTarget,
		linkColor, fit, allPages, layers, lightbox, editLink, fn)
	{
		var s = this.getBasenames();
		var data = {};
		
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
		var s2 = (fetchParam.length > 0) ?
			(((urlParams['dev'] == '1') ?
			'https://test.draw.io/embed2.js?dev=1' :
			'https://www.draw.io/embed2.js?')) + fetchParam :
			(((urlParams['dev'] == '1') ?
			'https://test.draw.io/js/viewer.min.js' :
			'https://www.draw.io/js/viewer.min.js'));
		var scr = '<script type="text/javascript" src="' + s2 + '"></script>';
		
		fn(value, scr);
	};

	/**
	 * 
	 */
	EditorUi.prototype.showHtmlDialog = function(btnLabel, helpLink, publicUrl, fn)
	{
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';
		var graph = this.editor.graph;
		
		var hd = document.createElement('h3');
		mxUtils.write(hd, mxResources.get('html'));
		hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:12px';
		div.appendChild(hd);

		var radioSection = document.createElement('div');
		radioSection.style.cssText = 'border-bottom:1px solid lightGray;padding-bottom:8px;margin-bottom:12px;';

		var publicUrlRadio = document.createElement('input');
		publicUrlRadio.style.cssText = 'margin-right:8px;margin-top:8px;margin-bottom:8px;';
		publicUrlRadio.setAttribute('value', 'url');
		publicUrlRadio.setAttribute('type', 'radio');
		publicUrlRadio.setAttribute('name', 'type-embedhtmldialog');

		var copyRadio = publicUrlRadio.cloneNode(true);
		copyRadio.setAttribute('value', 'copy');
		radioSection.appendChild(copyRadio);
		
		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('includeCopyOfMyDiagram'));
		radioSection.appendChild(span);
		
		mxUtils.br(radioSection);
		radioSection.appendChild(publicUrlRadio);

		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('publicDiagramUrl'));
		radioSection.appendChild(span);

		var file = this.getCurrentFile();
		
		if (publicUrl == null && file != null && file.constructor == window.DriveFile)
		{
			var testLink = document.createElement('a');
			testLink.style.paddingLeft = '12px';
			testLink.style.color = 'gray';
			testLink.setAttribute('href', 'javascript:void(0);');
			mxUtils.write(testLink, mxResources.get('share'));
			radioSection.appendChild(testLink);
			
			mxEvent.addListener(testLink, 'click', mxUtils.bind(this, function()
			{
				this.hideDialog();
				this.drive.showPermissions(file.getId());
			}));
		}

		copyRadio.setAttribute('checked', 'checked');
		
		if (publicUrl == null)
		{
			publicUrlRadio.setAttribute('disabled', 'disabled');
		}

		div.appendChild(radioSection);

		var linkSection = this.addLinkSection(div);
		var zoom = this.addCheckbox(div, mxResources.get('zoom'), true, null, true);
		mxUtils.write(div, ':');
		
		var zoomInput = document.createElement('input');
		zoomInput.setAttribute('type', 'text');
		zoomInput.style.marginRight = '16px';
		zoomInput.style.width = '60px';
		zoomInput.style.marginLeft = '4px';
		zoomInput.style.marginRight = '12px';
		zoomInput.value = '100%';
		
		div.appendChild(zoomInput);

		var fit = this.addCheckbox(div, mxResources.get('fit'), true);
		var hasPages = this.pages != null && this.pages.length > 1;
		var allPages = allPages = this.addCheckbox(div, mxResources.get('allPages'), hasPages, !hasPages);
		var layers = this.addCheckbox(div, mxResources.get('layers'), true);
		var lightbox = this.addCheckbox(div, mxResources.get('lightbox'), true);
		
		var editSection = this.addEditButton(div, lightbox);
		var edit = editSection.getEditInput();
		edit.style.marginBottom = '16px';
		
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
		
		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			fn((publicUrlRadio.checked) ? publicUrl : null, zoom.checked, zoomInput.value, linkSection.getTarget(),
				linkSection.getColor(), fit.checked, allPages.checked, layers.checked, lightbox.checked,
				editSection.getLink());
		}), null, btnLabel, helpLink);
		this.showDialog(dlg.container, 340, 384, true, true);
		copyRadio.focus();
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.showPublishLinkDialog = function(title, hideShare, width, height, fn, showFrameOption)
	{
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';
		var graph = this.editor.graph;
		
		var hd = document.createElement('h3');
		mxUtils.write(hd, title || mxResources.get('link'));
		hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:12px';
		div.appendChild(hd);
		
		var file = this.getCurrentFile();
		var helpLink = 'https://desk.draw.io/support/solutions/articles/16000051941';
		var dy = 0;
		
		if (file != null && file.constructor == window.DriveFile && !hideShare)
		{
			dy = 80;
			helpLink = 'https://desk.draw.io/support/solutions/articles/16000039384';
			var hintSection = document.createElement('div');
			hintSection.style.cssText = 'border-bottom:1px solid lightGray;padding-bottom:14px;padding-top:6px;margin-bottom:14px;text-align:center;';
			
			var text = document.createElement('div');
			text.style.whiteSpace = 'normal';
			mxUtils.write(text, mxResources.get('linkAccountRequired'));
			hintSection.appendChild(text);
			
			var shareBtn = mxUtils.button(mxResources.get('share'), mxUtils.bind(this, function()
			{
				this.drive.showPermissions(file.getId());
			}));
			shareBtn.style.marginTop = '12px';
			shareBtn.className = 'geBtn';
			hintSection.appendChild(shareBtn);
			div.appendChild(hintSection);
			
			var testLink = document.createElement('a');
			testLink.style.paddingLeft = '12px';
			testLink.style.color = 'gray';
			testLink.style.fontSize = '11px';
			testLink.setAttribute('href', 'javascript:void(0);');
			mxUtils.write(testLink, mxResources.get('check'));
			hintSection.appendChild(testLink);
			
			mxEvent.addListener(testLink, 'click', mxUtils.bind(this, function()
			{
				if (this.spinner.spin(document.body, mxResources.get('loading')))
				{
					this.getPublicUrl(this.getCurrentFile(), mxUtils.bind(this, function(url)
					{
						this.spinner.stop();
						
						var dlg = new ErrorDialog(this, null, mxResources.get((url != null) ?
							'diagramIsPublic' : 'diagramIsNotPublic'), mxResources.get('ok'));
						this.showDialog(dlg.container, 300, 80, true, false);
						dlg.init();
					}));
				}
			}));
		}
		
		var widthInput = null;
		var heightInput = null;
		
		if (width != null || height != null)
		{
			dy += 30;
			mxUtils.write(div, mxResources.get('width') + ':');

			widthInput = document.createElement('input');
			widthInput.setAttribute('type', 'text');
			widthInput.style.marginRight = '16px';
			widthInput.style.width = '50px';
			widthInput.style.marginLeft = '6px';
			widthInput.style.marginRight = '16px';
			widthInput.style.marginBottom = '10px';
			widthInput.value = '100%';
			
			div.appendChild(widthInput);

			mxUtils.write(div, mxResources.get('height') + ':');
			
			heightInput = document.createElement('input');
			heightInput.setAttribute('type', 'text');
			heightInput.style.width = '50px';
			heightInput.style.marginLeft = '6px';
			heightInput.style.marginBottom = '10px';
			heightInput.value = height + 'px';
			
			div.appendChild(heightInput);
			mxUtils.br(div);
		}
		
		var linkSection = this.addLinkSection(div, showFrameOption);
		var hasPages = this.pages != null && this.pages.length > 1;
		var allPages = null;
		
		if (file == null || file.constructor != window.DriveFile || hideShare)
		{
			allPages = this.addCheckbox(div, mxResources.get('allPages'), hasPages, !hasPages);
		}
		
		var lightbox = this.addCheckbox(div, mxResources.get('lightbox'), true);
		var editSection = this.addEditButton(div, lightbox);
		var edit = editSection.getEditInput();

		var layers = this.addCheckbox(div, mxResources.get('layers'), true);
		layers.style.marginLeft = edit.style.marginLeft;
		layers.style.marginBottom = '16px';
		layers.style.marginTop = '8px';
		
		mxEvent.addListener(lightbox, 'change', function()
		{
			if (lightbox.checked)
			{
				layers.removeAttribute('disabled');
				edit.removeAttribute('disabled');
			}
			else
			{
				layers.setAttribute('disabled', 'disabled');
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
		
		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			fn(linkSection.getTarget(), linkSection.getColor(),
				(allPages == null) ? true : allPages.checked,
				lightbox.checked, editSection.getLink(),
				layers.checked, (widthInput != null) ? widthInput.value : null,
				(heightInput != null) ? heightInput.value : null);
		}), null, mxResources.get('create'), helpLink);
		this.showDialog(dlg.container, 340, 254 + dy, true, true);
		
		if (widthInput != null)
		{
			widthInput.focus();
			
			if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
			{
				widthInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
		else
		{
			linkSection.focus();
		}
	};

	/**
	 * 
	 */
	EditorUi.prototype.showRemoteExportDialog = function(btnLabel, helpLink, callback, hideInclude)
	{
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';
		
		var hd = document.createElement('h3');
		mxUtils.write(hd, mxResources.get('image'));
		hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:4px';
		div.appendChild(hd);

		var selection = this.addCheckbox(div, mxResources.get('selectionOnly'), false,
			this.editor.graph.isSelectionEmpty());
		var include = (hideInclude) ? null : this.addCheckbox(div, mxResources.get('includeCopyOfMyDiagram'), true);
		
		var graph = this.editor.graph;
		var transparent = (hideInclude) ? null : this.addCheckbox(div, mxResources.get('transparentBackground'),
				graph.background == mxConstants.NONE || graph.background == null);

		if (transparent != null)
		{
			transparent.style.marginBottom = '16px';
		}
		
		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			callback(!selection.checked, (include != null) ? include.checked : false,
				(transparent != null) ? transparent.checked : false);
		}), null, btnLabel, helpLink);
		this.showDialog(dlg.container, 300, (hideInclude) ? 100 : 186, true, true);
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.showExportDialog = function(title, embedOption, btnLabel, helpLink, callback,
		cropOption, defaultInclude, format)
	{
		defaultInclude = (defaultInclude != null) ? defaultInclude : true;
		
		var div = document.createElement('div');
		div.style.whiteSpace = 'nowrap';
		var graph = this.editor.graph;
		var height = (format == 'jpeg') ? 196 : 300;
		
		var hd = document.createElement('h3');
		mxUtils.write(hd, title);
		hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px';
		div.appendChild(hd);
		
		mxUtils.write(div, mxResources.get('zoom') + ':');
		var zoomInput = document.createElement('input');
		zoomInput.setAttribute('type', 'text');
		zoomInput.style.marginRight = '16px';
		zoomInput.style.width = '60px';
		zoomInput.style.marginLeft = '4px';
		zoomInput.style.marginRight = '12px';
		zoomInput.value = this.lastExportZoom || '100%';
		div.appendChild(zoomInput);
		
		mxUtils.write(div, mxResources.get('borderWidth') + ':');
		var borderInput = document.createElement('input');
		borderInput.setAttribute('type', 'text');
		borderInput.style.marginRight = '16px';
		borderInput.style.width = '60px';
		borderInput.style.marginLeft = '4px';
		borderInput.value = this.lastExportBorder || '0';
		div.appendChild(borderInput);
		mxUtils.br(div);
		
		var transparent = this.addCheckbox(div, mxResources.get('transparentBackground'),
			graph.background == mxConstants.NONE || graph.background == null, null, null, format != 'jpeg');
		var selection = this.addCheckbox(div, mxResources.get('selectionOnly'),
			false, graph.isSelectionEmpty());

		var cb6 = document.createElement('input');
		cb6.style.marginTop = '16px';
		cb6.style.marginRight = '8px';
		cb6.style.marginLeft = '24px';
		cb6.setAttribute('disabled', 'disabled');
		cb6.setAttribute('type', 'checkbox');

		if (cropOption)
		{
			div.appendChild(cb6);
			mxUtils.write(div, mxResources.get('crop'));
			mxUtils.br(div);
			
			height += 26;
			
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
		
		if (!graph.isSelectionEmpty())
		{
			cb6.setAttribute('checked', 'checked');
			cb6.defaultChecked = true;
		}
		
		var shadow = this.addCheckbox(div, mxResources.get('shadow'), graph.shadowVisible);
		
		var cb5 = document.createElement('input');
		cb5.style.marginTop = '16px';
		cb5.style.marginRight = '8px';
		cb5.setAttribute('type', 'checkbox');
		
		if (this.isOffline() || !this.canvasSupported)
		{
			cb5.setAttribute('disabled', 'disabled');
		}
		
		if (embedOption)
		{
			div.appendChild(cb5);
			mxUtils.write(div, mxResources.get('embedImages'));
			mxUtils.br(div);
			
			height += 26;
		}
		
		var include = this.addCheckbox(div, mxResources.get('includeCopyOfMyDiagram'), defaultInclude, null, null, format != 'jpeg');
		var hasPages = this.pages != null && this.pages.length > 1;
		var allPages = this.addCheckbox(div, (hasPages) ? mxResources.get('allPages') : '', hasPages, !hasPages, null, format != 'jpeg');
		allPages.style.marginLeft = '24px';
		allPages.style.marginBottom = '16px';
		
		if (!hasPages)
		{
			allPages.style.visibility = 'hidden';
		}
	
		mxEvent.addListener(include, 'change', function()
		{
			if (include.checked && hasPages)
			{
				allPages.removeAttribute('disabled');
			}
			else
			{
				allPages.setAttribute('disabled', 'disabled');
			}
		});
		
		if (!defaultInclude || !hasPages)
		{
			allPages.setAttribute('disabled', 'disabled');
		}
		
		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			this.lastExportBorder = borderInput.value;
			this.lastExportZoom = zoomInput.value;
			
			callback(zoomInput.value, transparent.checked, !selection.checked, shadow.checked,
				include.checked, cb5.checked, borderInput.value, cb6.checked, !allPages.checked);
		}), null, btnLabel, helpLink);
		this.showDialog(dlg.container, 340, height, true, true);
		zoomInput.focus();
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
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
		div.style.whiteSpace = 'nowrap';
		var graph = this.editor.graph;
		
		if (title != null)
		{
			var hd = document.createElement('h3');
			mxUtils.write(hd, title);
			hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:4px';
			div.appendChild(hd);
		}
		
		var fit = this.addCheckbox(div, mxResources.get('fit'), true);
		var shadow = this.addCheckbox(div, mxResources.get('shadow'),
			graph.shadowVisible && shadowEnabled, !shadowEnabled);
		var image = this.addCheckbox(div, imageLabel);
		var lightbox = this.addCheckbox(div, mxResources.get('lightbox'), true);
		var editSection = this.addEditButton(div, lightbox);
		var edit = editSection.getEditInput();
		
		var hasLayers = graph.model.getChildCount(graph.model.getRoot()) > 1;
		var layers = this.addCheckbox(div, mxResources.get('layers'), hasLayers, !hasLayers);
		layers.style.marginLeft = edit.style.marginLeft;
		layers.style.marginBottom = '12px';
		layers.style.marginTop = '8px';
		
		mxEvent.addListener(lightbox, 'change', function()
		{
			if (lightbox.checked)
			{
				if (hasLayers)
				{
					layers.removeAttribute('disabled');
				}
				
				edit.removeAttribute('disabled');
			}
			else
			{
				layers.setAttribute('disabled', 'disabled');
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
		
		var dlg = new CustomDialog(this, div, mxUtils.bind(this, function()
		{
			fn(fit.checked, shadow.checked, image.checked, lightbox.checked,
				editSection.getLink(), layers.checked);
		}), null, mxResources.get('embed'), helpLink);
		this.showDialog(dlg.container, 280, 280, true, true);
	};

	/**
	 * 
	 */
	EditorUi.prototype.createEmbedImage = function(fit, shadow, retina, lightbox, edit, layers, fn, err)
	{
		var bounds = this.editor.graph.getGraphBounds();
		
		function doUpdate(dataUri)
		{
   			var onclick = ' ';
   			var css = '';
   			
   			// Adds double click handling
			if (lightbox)
			{
				// KNOWN: Message passing does not seem to work in IE11
				onclick = " onclick=\"(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(" +
					"img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://www.draw.io/?client=1&lightbox=1" +
					((edit) ? "&edit=_blank" : "") +
					((layers) ? '&layers=1' : '') + "');}})(this);\"";
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
		
		if (this.isExportToCanvas())
		{
			var scale = 1;
			var ignoreSelection = true;

			this.exportToCanvas(mxUtils.bind(this, function(canvas)
		   	{
	   			var xml = (lightbox) ? this.getFileData(true) : null;
	   			var data = this.createImageDataUri(canvas, xml, 'png');
	   			doUpdate(data);
		   	}), null, null, null, mxUtils.bind(this, function(e)
		   	{
		   		err({message: mxResources.get('unknownError')});
		   	}), null, true, (retina) ? 2 : 1, null, shadow);
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
	EditorUi.prototype.createEmbedSvg = function(fit, shadow, image, lightbox, edit, layers, fn)
	{
		var svgRoot = this.editor.graph.getSvg();
		
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
					"img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://www.draw.io/?client=1&lightbox=1" +
					((edit) ? "&edit=_blank" : "") + ((layers) ? '&layers=1' : '') + "');}})(this);\"";
				css += 'cursor:pointer;';
			}
   			
			if (fit)
			{
				css += 'max-width:100%;';
			}
   			
   			// Images inside IMG don't seem to work so embed them all
			this.convertImages(svgRoot, mxUtils.bind(this, function(svgRoot)
			{
				fn('<img src="' + this.createSvgDataUri(mxUtils.getXml(svgRoot)) + '"' +
					((css != '') ? ' style="' + css + '"' : '') + onclick + '/>');
			}));
		}
		else
		{
			var css = '';
			
			// Adds double click handling
			if (lightbox)
			{
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
					"svg.wnd=window.open('https://www.draw.io/?client=1&lightbox=1" +
					((edit) ? "&edit=_blank" : "") + ((layers) ? '&layers=1' : '') + "');}}})(this);";
				svgRoot.setAttribute('onclick', js);
				css += 'cursor:pointer;';
			}
			
			// Adds responsive size
			if (fit)
			{
				var w = parseInt(svgRoot.getAttribute('width'));
				var h = parseInt(svgRoot.getAttribute('height'));
				svgRoot.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
				css += 'max-width:100%;max-height:' + h + 'px;';
				svgRoot.removeAttribute('height');
			}
			
			if (css != '')
			{
				svgRoot.setAttribute('style', css);
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
	 * Converts math in the given SVG
	 */
	EditorUi.prototype.convertMath = function(graph, svgRoot, fixPosition, callback)
	{
		if (graph.mathEnabled && typeof(MathJax) !== 'undefined' && typeof(MathJax.Hub) !== 'undefined')
		{
	      	// Temporarily attaches to DOM for rendering
			// FIXME: If adding svgRoot to body, the text
			// value of the math is appended, if not
			// added to DOM then LaTeX does not work.
			// This must be fixed to enable client-side export
			// if math is enabled.
//			document.body.appendChild(svgRoot);
			Editor.MathJaxRender(svgRoot);
	      
			window.setTimeout(mxUtils.bind(this, function()
			{
				MathJax.Hub.Queue(mxUtils.bind(this, function ()
				{
					// Removes from DOM
//					svgRoot.parentNode.removeChild(svgRoot);
					
					callback();
				}));
			}), 0);
		}
		else
		{
			callback();
		}
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
				var tmp = graph.decompress(mxUtils.getTextContent(diagramNode));
				
				if (tmp != null && tmp.length > 0)
				{
					node = mxUtils.parseXml(tmp).documentElement;
				}
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
	EditorUi.prototype.getEmbeddedPng = function(success, error, optionalData)
	{
		var graph = this.editor.graph;
		var diagramData = null;
		
		// Exports PNG for given optional data
		if (optionalData != null && optionalData.length > 0)
		{
			graph = this.createTemporaryGraph(this.editor.graph.getStylesheet());
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
			var page = this.pages[0];
	
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
	
	   	this.exportToCanvas(mxUtils.bind(this, function(canvas)
	   	{
	   		try
	   		{
	   			if (diagramData == null)
	   			{
	   				diagramData = this.getFileData(true);
	   			}
	   			
	   	   	    var data = canvas.toDataURL('image/png');
   	   	   		data = this.writeGraphModelToPng(data, 'zTXt', 'mxGraphModel',
   	   	   			atob(this.editor.graph.compress(diagramData)));
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
	   	}), null, null, null, null, graph.shadowVisible, null, graph);
	}
	
	/**
	 * Returns the SVG of the diagram with embedded XML. If a callback function is
	 * used, the images are converted to data URIs.
	 */
	EditorUi.prototype.getEmbeddedSvg = function(xml, graph, url, noHeader, callback, ignoreSelection, redirect)
	{
		var bg = graph.background;
		
		if (bg == mxConstants.NONE)
		{
			bg = null;
		}

		// Sets or disables alternate text for foreignObjects. Disabling is needed
		// because PhantomJS seems to ignore switch statements and paint all text.
		var svgRoot = graph.getSvg(bg, null, null, null, null, ignoreSelection);

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

		if (callback != null)
		{
			this.convertImages(svgRoot, mxUtils.bind(this, function(svgRoot)
			{
				callback(((!noHeader) ? '<?xml version="1.0" encoding="UTF-8"?>\n' +
					'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' : '') +
					mxUtils.getXml(svgRoot));
			}));
		}
		else
		{
			return ((!noHeader) ? '<?xml version="1.0" encoding="UTF-8"?>\n' +
				'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' : '') +
				mxUtils.getXml(svgRoot);
		}
	};
	
	/**
	 *
	 */
	EditorUi.prototype.exportImage = function(scale, transparentBackground, ignoreSelection, addShadow, editable, border, noCrop, currentPage, format)
	{
		format = (format != null) ? format : 'png';
		
		if (this.spinner.spin(document.body, mxResources.get('exporting')))
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
			   	this.exportToCanvas(mxUtils.bind(this, function(canvas)
			   	{
			   		this.spinner.stop();
			   		
			   		try
			   		{
			   			this.saveCanvas(canvas, (editable) ? this.getFileData(true, null,
			   				null, null, ignoreSelection, currentPage) : null, format);
			   		}
			   		catch (e)
			   		{
			   			// Fallback to server-side image export
			   			if (e.message == 'Invalid image')
			   			{
			   				this.downloadFile(format);
			   			}
			   			else
			   			{
				   			this.handleError(e);
			   			}
			   		}
			   	}), null, this.thumbImageCache, null, mxUtils.bind(this, function(e)
			   	{
			   		this.spinner.stop();
			   		this.handleError(e);
			   	}), null, ignoreSelection, scale || 1, transparentBackground,
			   		addShadow, null, null, border, noCrop);
			}
			catch (e)
			{
				this.spinner.stop();
				this.handleError(e);
			}
		}
	};

	/**
	 * For the fontCSS to be applied when rendering images on canvas, the actual
	 * font data must be made available via a data URI encoding of the file.
	 */
    EditorUi.prototype.loadFonts = function(then)
    {
        if (this.editor.fontCss != null && this.editor.resolvedFontCss == null)
        {
            var parts = this.editor.fontCss.split('url(');
            var waiting = 0;
            var fonts = {};

            // Strips leading and trailing quotes and spaces
            function trimString(str)
            {
                return str.replace(new RegExp("^[\\s\"']+", "g"), "").replace(new RegExp("[\\s\"']+$", "g"), "");
            };
            
            var finish = mxUtils.bind(this, function()
            {
                if (waiting == 0)
                {
                    // Constructs string
                    var result = [parts[0]];
                    
                    for (var j = 1; j < parts.length; j++)
                    {
                        var idx = parts[j].indexOf(')');
                        result.push('url("');
                        result.push(fonts[trimString(parts[j].substring(0, idx))]);
                        result.push('"' + parts[j].substring(idx));
                    }
                    
                    this.editor.resolvedFontCss = result.join('');
                    then();
                }
            });
            
            if (parts.length > 0)
            {
                for (var i = 1; i < parts.length; i++)
                {
                    var idx = parts[i].indexOf(')');
                    var format = null;
                    
                    // Checks if there is a format directive
                    var fmtIdx = parts[i].indexOf('format(', idx);
                    
                    if (fmtIdx > 0)
                    {
                        format = trimString(parts[i].substring(fmtIdx + 7, parts[i].indexOf(')', fmtIdx)));
                    }
    
                    (mxUtils.bind(this, function(url)
                    {
                        if (fonts[url] == null)
                        {
                            // Mark font es being fetched and fetch it
                            fonts[url] = url;
                            waiting++;
                            
                            var mime = 'application/x-font-ttf';
                            
                            // See https://stackoverflow.com/questions/2871655/proper-mime-type-for-fonts
                            if (format == 'svg' || /(\.svg)($|\?)/i.test(url))
                            {
                                mime = 'image/svg+xml';
                            }
                            else if (format == 'otf' || format == 'embedded-opentype' || /(\.otf)($|\?)/i.test(url))
                            {
                                mime = 'application/x-font-opentype';
                            }
                            else if (format == 'woff' || /(\.woff)($|\?)/i.test(url))
                            {
                                mime = 'application/font-woff';
                            }
                            else if (format == 'woff2' || /(\.woff2)($|\?)/i.test(url))
                            {
                                mime = 'application/font-woff2';
                            }
                            else if (format == 'eot' || /(\.eot)($|\?)/i.test(url))
                            {
                                mime = 'application/vnd.ms-fontobject';
                            }
                            else if (format == 'sfnt' || /(\.sfnt)($|\?)/i.test(url))
                            {
                                mime = 'application/font-sfnt';
                            }
                            
                            var realUrl = url;
                            
                            if ((/^https?:\/\//.test(realUrl)) && !this.isCorsEnabledForUrl(realUrl))
                            {
                                realUrl = PROXY_URL + '?url=' + encodeURIComponent(url);
                            }

                            // LATER: Remove cache-control header
                            this.loadUrl(realUrl, mxUtils.bind(this, function(uri)
                            {
                                fonts[url] = uri;
                                waiting--;
                                finish();
                            }), mxUtils.bind(this, function(err)
                            {
                                // LATER: handle error
                                waiting--;
                                finish();
                            }), true, null, 'data:' + mime + ';charset=utf-8;base64,');
                        }
                    }))(trimString(parts[i].substring(0, idx)), format);
                }
            }
        }
        else
        {
            then();
        }
    };
	
	/**
	 *
	 */
	EditorUi.prototype.exportToCanvas = function(callback, width, imageCache, background, error, limitHeight,
		ignoreSelection, scale, transparentBackground, addShadow, converter, graph, border, noCrop)
	{
		limitHeight = (limitHeight != null) ? limitHeight : true;
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		graph = (graph != null) ? graph : this.editor.graph;
		border = (border != null) ? border : 0;
		
		var bg = (transparentBackground) ? null : graph.background;
		
		if (bg == mxConstants.NONE)
		{
			bg = null;
		}
		
		if (bg == null)
		{
			bg = background;
		}
		
		// Handles special case where background is null but transparent is false
		if (bg == null && transparentBackground == false)
		{
			bg = this.editor.graph.defaultPageBackgroundColor;
		}
		
		this.convertImages(graph.getSvg(bg, null, null, noCrop, null, ignoreSelection), mxUtils.bind(this, function(svgRoot)
		{
			var img = new Image();
			
			img.onload = mxUtils.bind(this, function()
			{
		   		try
		   		{
		   			var canvas = document.createElement('canvas');
					var w = parseInt(svgRoot.getAttribute('width'));
					var h = parseInt(svgRoot.getAttribute('height'));
					scale = (scale != null) ? scale : 1;
					
					if (width != null)
					{
						scale = (!limitHeight) ? width / w : Math.min(1, Math.min((width * 3) / (h * 4), width / w));
					}
					
					w = Math.ceil(scale * w) + 2 * border;
					h = Math.ceil(scale * h) + 2 * border;
					
					canvas.setAttribute('width', w);
			   		canvas.setAttribute('height', h);
			   		var ctx = canvas.getContext('2d');
			   		
			   		if (bg != null)
			   		{
			   			ctx.beginPath();
						ctx.rect(0, 0, w, h);
						ctx.fillStyle = bg;
						ctx.fill();
			   		}

			   		ctx.scale(scale, scale);
			   		
			   		// Workaround for broken data URI images in Safari on first export
			   		if (mxClient.IS_SF)
			   		{			   		
						window.setTimeout(function()
						{
							ctx.drawImage(img, border / scale, border / scale);
							callback(canvas);
						}, 0);
			   		}
			   		else
			   		{
			   			ctx.drawImage(img, border / scale, border / scale);
			   			callback(canvas);
			   		}
		   		}
		   		catch (e)
		   		{
		   			if (error != null)
					{
						error(e);
					}
		   		}
			});
			
			img.onerror = function(e)
			{
				//console.log('img', e, img.src);
				
				if (error != null)
				{
					error(e);
				}
			};

			try
			{
				if (addShadow)
				{
					this.editor.graph.addSvgShadow(svgRoot);
				}
				
				var done = mxUtils.bind(this, function()
				{
					if (this.editor.resolvedFontCss != null)
					{
						var st = document.createElement('style');
						st.setAttribute('type', 'text/css');
						st.innerHTML = this.editor.resolvedFontCss;
						
						// Must be in defs section for FF to work
						var defs = svgRoot.getElementsByTagName('defs');
						defs[0].appendChild(st);
					}
					
					this.convertMath(graph, svgRoot, true, mxUtils.bind(this, function()
					{
						img.src = this.createSvgDataUri(mxUtils.getXml(svgRoot));
					}));
				});
				
				this.loadFonts(done);
			}
			catch (e)
			{
				//console.log('src', e, img.src);
				
				if (error != null)
				{
					error(e);
				}
			}
		}), imageCache, converter);
	};

	/**
	 * Converts all images in the SVG output to data URIs for immediate rendering
	 */
	EditorUi.prototype.createImageUrlConverter = function()
	{
		var converter = new mxUrlConverter();
		converter.updateBaseUrl();

		// Extends convert to avoid CORS using an image proxy server where needed
		var convert = converter.convert;
		var self = this;
		
		converter.convert = function(src)
		{
			if (src != null)
			{
				var remote = src.substring(0, 7) == 'http://' || src.substring(0, 8) == 'https://';
				
				if (remote && !navigator.onLine)
				{
					src = self.svgBrokenImage.src;
				}
				else if (remote && src.substring(0, converter.baseUrl.length) != converter.baseUrl &&
						(!self.crossOriginImages || !self.isCorsEnabledForUrl(src)))
				{
					src = PROXY_URL + '?url=' + encodeURIComponent(src);
				}
				else if (src.substring(0, 19) != 'chrome-extension://')
				{
					src = convert.apply(this, arguments);
				}
			}
			
			return src;
		};
		
		return converter;
	};
	
	/**
	 * Converts all images in the SVG output to data URIs for immediate rendering
	 */
	EditorUi.prototype.convertImages = function(svgRoot, callback, imageCache, converter)
	{
		// Converts images to data URLs for immediate painting
		if (converter == null)
		{
			converter = this.createImageUrlConverter();
		}
		
		// Barrier for asynchronous image loading
		var counter = 0;
		
		function inc()
		{
			counter++;
		};
		
		function dec()
		{
			counter--;
			
			if (counter == 0)
			{
				callback(svgRoot);
			}
		};

		var cache = imageCache || new Object();
		
		var convertImages = mxUtils.bind(this, function(tagName, srcAttr)
		{
			var images = svgRoot.getElementsByTagName(tagName);
			
			for (var i = 0; i < images.length; i++)
			{
				(mxUtils.bind(this, function(img)
				{
					var src = converter.convert(img.getAttribute(srcAttr));
		        	
					// Data URIs are pass-through
					if (src != null && src.substring(0, 5) != 'data:')
					{
						var tmp = cache[src];
						
						if (tmp == null)
						{
							inc();
							
							this.convertImageToDataUri(src, function(uri)
							{
								if (uri != null)
								{
									cache[src] = uri;
									img.setAttribute(srcAttr, uri);
								}
								
								dec();
							});
						}
						else
						{
							img.setAttribute(srcAttr, tmp);
						}
					}
					else if (src != null)
					{
						img.setAttribute(srcAttr, src);
					}
				}))(images[i]);
			}
		});
		
		// Converts all known image tags in output
		// LATER: Add support for images in CSS
		convertImages('image', 'xlink:href');
		convertImages('img', 'src');
		
		// All from cache or no images
		if (counter == 0)
		{
			callback(svgRoot);
		}
	};

	/**
	 * Checks if the client is authorized and calls the next step.
	 */
	EditorUi.prototype.loadUrl = function(url, success, error, forceBinary, retry, dataUriPrefix)
	{
		try
		{
			var binary = forceBinary || /(\.png)($|\?)/i.test(url) ||
				/(\.jpe?g)($|\?)/i.test(url) || /(\.gif)($|\?)/i.test(url);
			retry = (retry != null) ? retry : true;
			
			var fn = mxUtils.bind(this, function()
			{
				mxUtils.get(url, mxUtils.bind(this, function(req)
				{
					if (req.getStatus() >= 200 && req.getStatus() <= 299)
					{
				    	if (success != null)
				    	{
					    	var data = req.getText();
					    	
				    		// Returns PNG as base64 encoded data URI
							if (binary)
							{
								// NOTE: This requires BinaryToArray VB script in the page
								if ((document.documentMode == 9 || document.documentMode == 10) &&
									typeof window.mxUtilsBinaryToArray !== 'undefined')
								{
									var bin = mxUtilsBinaryToArray(req.request.responseBody).toArray();
									var tmp = new Array(bin.length);
									
									for (var i = 0; i < bin.length; i++)
									{
										tmp[i] = String.fromCharCode(bin[i]);
									}
									
									data = tmp.join('');
								}
								
								// LATER: Could be JPG but modern browsers
								// ignore the mime type in the data URI
								dataUriPrefix = (dataUriPrefix != null) ? dataUriPrefix : 'data:image/png;base64,';
								data = dataUriPrefix + this.base64Encode(data);
							}
				    		
				    		success(data);
				    	}
					}
					else if (error != null)
			    	{
			    		error({code: App.ERROR_UNKNOWN}, req);
			    	}
				}), function()
				{
			    	if (error != null)
			    	{
			    		error({code: App.ERROR_UNKNOWN});
			    	}
				}, binary, this.timeout, function()
			    {
				    if (retry && error != null)
					{
						error({code: App.ERROR_TIMEOUT, retry: fn});
					}
			    });
			});
			
			fn();
		}
		catch (e)
		{
			if (error != null)
			{
				error(e);
			}
		}
	};

	/**
	 * Returns true if the given URL is known to have CORS headers.
	 */
	EditorUi.prototype.isCorsEnabledForUrl = function(url)
	{
		if (urlParams['cors'] != null && this.corsRegExp == null)
		{
			this.corsRegExp = new RegExp(decodeURIComponent(urlParams['cors']));
		}
		
		return (this.corsRegExp != null && this.corsRegExp.test(url)) ||
			url.substring(0, 34) === 'https://raw.githubusercontent.com/' ||
			url.substring(0, 23) === 'https://cdn.rawgit.com/' ||
			url.substring(0, 19) === 'https://rawgit.com/' ||
			/^https?:\/\/[^\/]*\.iconfinder.com\//.test(url) ||
			/^https?:\/\/[^\/]*\.draw\.io\/proxy/.test(url) ||
			/^https?:\/\/[^\/]*\.github\.io\//.test(url);
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.convertImageToDataUri = function(url, callback)
	{
		if (/(\.svg)$/i.test(url))
		{
			mxUtils.get(url, mxUtils.bind(this, function(req)
			{
				callback(this.createSvgDataUri(req.getText()));
			}),
			function()
			{
				callback(this.svgBrokenImage.src);
			});
		}
		else
		{
		    var img = new Image();
		    var self = this;
		    
		    if (this.crossOriginImages)
	    	{
			    img.crossOrigin = 'anonymous';
		    }
		    
		    img.onload = function()
		    {
		        var canvas = document.createElement('canvas');
		        var ctx = canvas.getContext('2d');
		        canvas.height = img.height;
		        canvas.width = img.width;
		        ctx.drawImage(img, 0, 0);
		        
		        try
		        {
	        		callback(canvas.toDataURL());
		        }
		        catch (e)
		        {
	        		callback(self.svgBrokenImage.src);
		        }
		    };
		    
		    img.onerror = function()
		    {
	    		callback(self.svgBrokenImage.src);
		    };
		    
		    img.src = url;
		}
	};
	
	/**
	 * Handling drag and drop and import.
	 */

	/**
	 * Imports the given XML into the existing diagram.
	 */
	EditorUi.prototype.importXml = function(xml, dx, dy, crop, noErrorHandling)
	{
		dx = (dx != null) ? dx : 0;
		dy = (dy != null) ? dy : 0;
		var cells = []
		
		try
		{
			var graph = this.editor.graph;
	
			if (xml != null && xml.length > 0)
			{
				var doc = mxUtils.parseXml(xml);
				
				// Checks for mxfile with multiple pages
				var node = this.editor.extractGraphModel(doc.documentElement, this.pages != null);
				
				if (node != null && node.nodeName == 'mxfile' && this.pages != null)
				{
					var diagrams = node.getElementsByTagName('diagram');

					if (diagrams.length == 1)
					{
						node = mxUtils.parseXml(graph.decompress(mxUtils.getTextContent(diagrams[0]))).documentElement;
					}
					else if (diagrams.length > 1)
					{
						// Adds pages
						graph.model.beginUpdate();
						try
						{
							for (var i = 0; i < diagrams.length; i++)
							{
								// Imported pages must obtain a new ID
								diagrams[i].removeAttribute('id');
								
								var page = this.updatePageRoot(new DiagramPage(diagrams[i]));
								var index = this.pages.length;
								
								// Checks for invalid page names
								if (page.getName() == null)
								{
									page.setName(mxResources.get('pageWithNumber', [index + 1]));
								}
								
								graph.model.execute(new ChangePage(this, page, page, index));
							}
						}
						finally
						{
							graph.model.endUpdate();
						}
					}
				}
				
				if (node != null && node.nodeName === 'mxGraphModel')
				{
					cells = graph.importGraphModel(node, dx, dy, crop);
				}
			}
		}
		catch (e)
		{
			if (!noErrorHandling)
			{
				this.handleError(e, mxResources.get('invalidOrMissingFile'));
			}
			
			throw e;
		}
		
		return cells;
	};
	
	/**
	 * Returns true for VSD and VSS files.
	 */
	EditorUi.prototype.isRemoteVisioFormat = function(filename)
	{
		return /(\.vsd)($|\?)/i.test(filename) || /(\.vss)($|\?)/i.test(filename);
	};
	
	/**
	 * Imports the given Visio file
	 */
	EditorUi.prototype.importVisio = function(file, done, onerror, filename)
	{
		filename = (filename != null) ? filename : file.name; 

		onerror = (onerror != null) ? onerror : mxUtils.bind(this, function(e)
		{
			this.handleError(e);
		});
		
		var delayed = mxUtils.bind(this, function()
		{
			this.loadingExtensions = false;
			
			if (this.doImportVisio)
			{
				if (this.isRemoteVisioFormat(filename) && VSD_CONVERT_URL != null) 
				{
					var formData = new FormData();
					formData.append('file1', file, filename);

					var xhr = new XMLHttpRequest();
					xhr.open('POST', VSD_CONVERT_URL);
					xhr.responseType = 'blob';
					
					xhr.onreadystatechange = mxUtils.bind(this, function()
					{
						if (xhr.readyState == 4)
						{	
							if (xhr.status >= 200 && xhr.status <= 299)
							{
								try
								{
									//add back the file name
									xhr.response.name = filename;
									this.doImportVisio(xhr.response, done, onerror);
								}
								catch (e)
								{
									onerror(e);
								}
							}
							else
							{
								onerror({});
							}
						}
					});
					
					xhr.send(formData);
				}
				else
				{
					try
					{
						this.doImportVisio(file, done, onerror);
					}
					catch (e)
					{
						onerror(e);
					}
				}
			}
		});
		
		if (!this.doImportVisio && !this.loadingExtensions && !this.isOffline())
		{
			this.loadingExtensions = true;
			mxscript('js/extensions.min.js', delayed);
		}
		else
		{
			delayed();
		}
	};

	/**
	 * Export the diagram to VSDX
	 */
	EditorUi.prototype.exportVisio = function()
	{
		var delayed = mxUtils.bind(this, function()
		{
			this.loadingExtensions = false;
			
			if (typeof VsdxExport  !== 'undefined')
			{
				try
				{
					new VsdxExport(this).exportCurrentDiagrams();
				}
				catch (e)
				{
					this.handleError(e);
				}
			}
		});
		
		if (typeof VsdxExport === 'undefined' && !this.loadingExtensions && !this.isOffline())
		{
			this.loadingExtensions = true;
			mxscript('js/extensions.min.js', delayed);
		}
		else
		{
			delayed();
		}
	};
	
	/**
	 * Imports the given Lucidchart data.
	 */
	EditorUi.prototype.convertLucidChart = function(data, success, error)
	{
		var delayed = mxUtils.bind(this, function()
		{
			this.loadingExtensions = false;
			
			// Checks for signature method
			if (typeof window.LucidImporter !== 'undefined')
			{
				try
				{
					success(LucidImporter.importState(JSON.parse(data)));
				}
				catch (e)
				{
					error(e);
				}
			}
			else
			{
				error({message: mxResources.get('serviceUnavailableOrBlocked')});
			}
		});
		
		if (typeof window.LucidImporter === 'undefined' &&
			!this.loadingExtensions && !this.isOffline())
		{
			this.loadingExtensions = true;
			
			if (urlParams['dev'] == '1')
			{
				mxscript('js/diagramly/Extensions.js', delayed);
			}
			else
			{
				mxscript('js/extensions.min.js', delayed);
			}
		}
		else
		{
			// Async needed for selection
			window.setTimeout(delayed, 0);
		}
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
				x, y, 1, 1, 'text;html=1;align=center;verticalAlign=middle;');
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
	EditorUi.prototype.insertTextAt = function(text, dx, dy, html, asImage, crop, resizeImages)
	{
		crop = (crop != null) ? crop : true;
		resizeImages = (resizeImages != null) ? resizeImages : true;
		
		// Handles special case for Gliffy data which requires async server-side for parsing
		if (text != null)
		{
			if (Graph.fileSupport && !this.isOffline() && new XMLHttpRequest().upload && this.isRemoteFileFormat(text))
			{
				// Fixes possible parsing problems with ASCII 160 (non-breaking space)
				this.parseFile(new Blob([text.replace(/\s+/g,' ')], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
				{
					if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299)
					{
						this.editor.graph.setSelectionCells(this.insertTextAt(
							xhr.responseText, dx, dy, true));
					}
				}));
				
				// Returns empty cells array as it is aysynchronous
				return [];
			}
			// Handles special case of data URI which requires async loading for finding size
			else if (text.substring(0, 5) == 'data:' || (!this.isOffline() &&
				(asImage || (/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(text))))
			{
				var graph = this.editor.graph;
				
				// Checks for embedded XML in PNG
				if (text.substring(0, 22) == 'data:image/png;base64,')
				{
					var xml = this.extractGraphModelFromPng(text);
					var result = this.importXml(xml, dx, dy, crop, true); 
					
					if (result.length > 0)
					{
						return result;
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
						
						var result = this.importXml(xml, dx, dy, crop, true); 
	
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
						this.resizeImage(img, text, mxUtils.bind(this, function(data2, w2, h2)
	    				{
							graph.setSelectionCell(graph.insertVertex(null, null, '', graph.snap(dx), graph.snap(dy),
									w2, h2, 'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
									'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + this.convertDataUri(data2) + ';'));
	    				}), resizeImages, this.maxImageSize);
					}
					else
					{
						var s = Math.min(1, Math.min(this.maxImageSize / img.width, this.maxImageSize / img.height));
						var w = Math.round(img.width * s);
						var h = Math.round(img.height * s);
						
						graph.setSelectionCell(graph.insertVertex(null, null, '', graph.snap(dx), graph.snap(dy),
								w, h, 'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
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
								graph.snap(dx), graph.snap(dy), 1, 1, 'text;' + ((html) ? 'html=1;' : ''));
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
				text = this.editor.graph.zapGremlins(mxUtils.trim(text));
			
				if (this.isCompatibleString(text))
				{
					return this.importXml(text, dx, dy, crop);
				}
				else if (text.length > 0)
				{
					if (this.isLucidChartData(text))
					{
						this.convertLucidChart(text, mxUtils.bind(this, function(xml)
						{
							this.editor.graph.setSelectionCells(
								this.importXml(xml, dx, dy, crop));
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
								graph.snap(dx), graph.snap(dy), 1, 1, 'text;' + ((html) ? 'html=1;' : ''));
				    		graph.fireEvent(new mxEventObject('textInserted', 'cells', [cell]));
						
				    		// Single tag is converted
				    		if (text.charAt(0) == '<' && text.indexOf('>') == text.length - 1)
				    		{
				    			text = mxUtils.htmlEntities(text);
				    		}
				    		
							// Apply value and updates the cell size to fit the text block
							cell.value = text;
							graph.updateCellSize(cell);
							
							// See http://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript
							var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
							
							if (regexp.test(cell.value))
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
	 * Returns true for Gliffy or GraphML data or .vsdx filenames.
	 */
	EditorUi.prototype.isLucidChartData = function(data)
	{
		return data != null && data.substring(0, 26) == '{"state":"{\\"Properties\\":';
	};

	/**
	 * Imports a local file from the device or local storage.
	 */
	EditorUi.prototype.importLocalFile = function(device, noSplash)
	{
		// input.click does not work in IE on Windows 7
		if (device && Graph.fileSupport && ((!mxClient.IS_IE && !mxClient.IS_IE11) ||
			navigator.appVersion.indexOf('Windows NT 6.1') < 0))
		{
			var input = document.createElement('input');
			input.setAttribute('type', 'file');
			
			mxEvent.addListener(input, 'change', mxUtils.bind(this, function()
			{
				if (input.files != null)
				{
					// Using null for position will disable crop of input file
					this.importFiles(input.files, null, null, this.maxImageSize);
				}
			}));

			input.click();
		}
		else
		{
			window.openNew = false;
			window.openKey = 'import';
			
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
				if (filename != null && Graph.fileSupport && /(\.vsdx?)($|\?)/i.test(filename))
				{
					// "Not a UTF 8 file" when opening VSDX in IE so this is never called
					var file = new Blob([xml], {type: 'application/octet-stream'})
					
					this.importVisio(file, mxUtils.bind(this, function(xml)
					{
						this.importXml(xml);
					}), null, filename);
				}
				else
				{				
					this.editor.graph.setSelectionCells(this.importXml(xml));
				}
			}));

			// Removes openFile if dialog is closed
			this.showDialog(new OpenDialog(this).container, 360, 220, true, true, function()
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
	 * Imports the given XML into the existing diagram.
	 */
	EditorUi.prototype.importFile = function(data, mimeType, dx, dy, w, h, filename, done, file, crop, ignoreEmbeddedXml)
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
			}
			else
			{
				importedCells = this.importXml(xml, dx, dy, crop);
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
					cells = this.importXml(xml, dx, dy, crop);
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

				cells = [graph.insertVertex(null, null, '', dx, dy, w, h,
					'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
					'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + data + ';')];
			}
		}
		else if (/(\.*<graphml )/.test(data) && typeof window.mxGraphMlCodec !== 'undefined') 
        {
            new mxGraphMlCodec().decode(data, mxUtils.bind(this, function(xml)
            {
                var importedCells = this.importXml(xml, dx, dy, crop);
                
                if (done != null)
                {
                    done(importedCells);
                }
            }));
        }
		else if (file != null && filename != null && ((/(\.vsdx?)($|\?)/i.test(filename)) || /(\.vssx?)($|\?)/i.test(filename)))
		{
			//  LATER: done and async are a hack before making this asynchronous
			async = true;

			this.importVisio(file, handleResult);
		}
		else if (!this.isOffline() && new XMLHttpRequest().upload && this.isRemoteFileFormat(data, filename))
		{
			//  LATER: done and async are a hack before making this asynchronous
			async = true;

			// Returns empty cells array as it is aysynchronous
			this.parseFile((file != null) ? file : new Blob([data], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
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
					}
				}
			}), filename);
		}
		else if (!/(\.vsd)($|\?)/i.test(filename) && !/(\.vss)($|\?)/i.test(filename))
		{
			cells = this.insertTextAt(this.validateFileData(data), dx, dy, true, null, crop);
		}
		
		if (!async && done != null)
		{
			done(cells);
		}
		
		return cells;
	};
	
	/**
	 * Base64 encodes the given string. This method seems to be more
	 * robust for encoding PNG from binary AJAX responses.
	 */
	EditorUi.prototype.base64Encode = function(str)
	{
	    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	    var out = "", i = 0, len = str.length, c1, c2, c3;
	    
	    while (i < len)
	    {
	        c1 = str.charCodeAt(i++) & 0xff;
	        
	        if (i == len)
	        {
	            out += CHARS.charAt(c1 >> 2);
	            out += CHARS.charAt((c1 & 0x3) << 4);
	            out += "==";
	            break;
	        }
	        
	        c2 = str.charCodeAt(i++);
	        
	        if (i == len)
	        {
	            out += CHARS.charAt(c1 >> 2);
	            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	            out += CHARS.charAt((c2 & 0xF) << 2);
	            out += "=";
	            break;
	        }
	        
	        c3 = str.charCodeAt(i++);
	        out += CHARS.charAt(c1 >> 2);
	        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	        out += CHARS.charAt(c3 & 0x3F);
	    }
	    
	    return out;
	};

	/**
	 * 
	 */
	EditorUi.prototype.importFiles = function(files, x, y, maxSize, fn, resultFn, filterFn, barrierFn, resizeDialog, maxBytes, resampleThreshold, ignoreEmbeddedXml)
	{
		x = (x != null) ? x : 0;
		y = (y != null) ? y : 0;
		maxSize = (maxSize != null) ? maxSize : this.maxImageSize;
		maxBytes = (maxBytes != null) ? maxBytes : this.maxImageBytes;
		
		var crop = x != null && y != null;
		var resizeImages = true;
		
		// Checks if large images are imported
		var largeImages = false;
		
		if (!mxClient.IS_CHROMEAPP && files != null)
		{
			var thresh = resampleThreshold || this.resampleThreshold;
			
			for (var i = 0; i < files.length; i++)
			{
				if (files[i].type.substring(0, 6) == 'image/' && files[i].size > thresh)
				{
					largeImages = true;
					
					break;
				}
			}
		}

		var doImportFiles = mxUtils.bind(this, function()
		{
			var graph = this.editor.graph;
			var gs = graph.gridSize;
	
			fn = (fn != null) ? fn : mxUtils.bind(this, function(data, mimeType, x, y, w, h, filename, done, file)
			{
				if (data != null && data.substring(0, 10) == '<mxlibrary')
				{
					this.spinner.stop();
					this.loadLibrary(new LocalLibrary(this, data, filename));
	    			
	    			return null;
				}
				else
				{
					return this.importFile(data, mimeType, x, y, w, h, filename, done, file, crop, ignoreEmbeddedXml);
				}
			});
			
			resultFn = (resultFn != null) ? resultFn : mxUtils.bind(this, function(cells)
			{
				graph.setSelectionCells(cells);
			});
	
			if (this.spinner.spin(document.body, mxResources.get('loading')))
			{
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
						
						resultFn(cells);
					}
				});
				
				for (var i = 0; i < count; i++)
				{
					(mxUtils.bind(this, function(index)
					{
						var file = files[index];
						var reader = new FileReader();
						
						reader.onload = mxUtils.bind(this, function(e)
						{
							if (filterFn == null || filterFn(file))
							{
						    		if (file.type.substring(0, 6) == 'image/')
						    		{
						    			if (file.type.substring(0, 9) == 'image/svg')
						    			{
						    				// Checks if SVG contains content attribute
					    					var data = e.target.result;
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
									    					var prefix = data.substring(0, comma + 1);
									    					
									    					// Parses SVG and find width and height
									    					if (root != null)
									    					{
									    						var svgs = root.getElementsByTagName('svg');
									    						
									    						if (svgs.length > 0)
										    					{
									    							var svgRoot = svgs[0];
										    						var w = parseFloat(svgRoot.getAttribute('width'));
										    						var h = parseFloat(svgRoot.getAttribute('height'));
										    						
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
	
										    						data = this.createSvgDataUri(mxUtils.getXml(svgRoot));
										    						var s = Math.min(1, Math.min(maxSize / Math.max(1, w)), maxSize / Math.max(1, h));
										    						var cells = fn(data, file.type, x + index * gs, y + index * gs, Math.max(
										    							1, Math.round(w * s)), Math.max(1, Math.round(h * s)), file.name);
										    						
										    						// Hack to fix width and height asynchronously
										    						if (isNaN(w) || isNaN(h))
										    						{
										    							var img = new Image();
										    							
										    							img.onload = mxUtils.bind(this, function()
										    							{
										    								w = Math.max(1, img.width);
										    								h = Math.max(1, img.height);
										    								
										    								cells[0].geometry.width = w;
										    								cells[0].geometry.height = h;
										    								
										    								svgRoot.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
										    								data = this.createSvgDataUri(mxUtils.getXml(svgRoot));
										    								
										    								var semi = data.indexOf(';');
										    								
										    								if (semi > 0)
										    								{
										    									data = data.substring(0, semi) + data.substring(data.indexOf(',', semi + 1));
										    								}
										    								
										    								graph.setCellStyles('image', data, [cells[0]]);
										    							});
										    							
										    							img.src = this.createSvgDataUri(mxUtils.getXml(svgRoot));
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
									    				this.resizeImage(img, e.target.result, mxUtils.bind(this, function(data2, w2, h2)
									    				{
										    				barrier(index, mxUtils.bind(this, function()
												    		{
										    					// Refuses to insert images above a certain size as they kill the app
										    					if (data2 != null && data2.length < maxBytes)
										    					{
											    					var s = (!resizeImages || !this.isResampleImage(e.target.result, resampleThreshold)) ? 1 : Math.min(1, Math.min(maxSize / w2, maxSize / h2));
												    				
											    					return fn(data2, file.type, x + index * gs, y + index * gs, Math.round(w2 * s), Math.round(h2 * s), file.name);
										    					}
										    					else
										    					{
										    						this.handleError({message: mxResources.get('imageTooBig')});
										    						
										    						return null;
										    					}
												    		}));
									    				}), resizeImages, maxSize, resampleThreshold);
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
										fn(e.target.result, file.type, x + index * gs, y + index * gs, 240, 160, file.name, function(cells)
										{
											barrier(index, function()
				    	    				{
				    		    				return cells;
				    	    				});
										});
						    		}
							}
						});
						
						// Handles special cases
						if (/(\.vsdx?)($|\?)/i.test(file.name) || /(\.vssx?)($|\?)/i.test(file.name))
						{
							fn(null, file.type, x + index * gs, y + index * gs, 240, 160, file.name, function(cells)
							{
								barrier(index, function()
	    	    				{
	    		    				return cells;
	    	    				});
							}, file);
						}
						else if (file.type.substring(0, 5) == 'image')
						{
							reader.readAsDataURL(file);
						}
						else
						{
							reader.readAsText(file);
						}
					}))(i);
				}
			}
		});
		
		if (largeImages)
		{
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
			(isLocalStorage || mxClient.IS_CHROMEAPP) ? 220 : 200, true, true);
		}
	};
	
	/**
	 * Parses the file using XHR2 via the server. File can be a blob or file object.
	 * Filename is an optional parameter for blobs (that do not have a filename).
	 */
	EditorUi.prototype.parseFile = function(file, fn, filename)
	{
		filename = (filename != null) ? filename : file.name;
		
		var formData = new FormData();
		formData.append('format', 'xml');
		formData.append('upfile', file, filename);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', OPEN_URL);
		
		xhr.onreadystatechange = function()
		{
			fn(xhr);
		};
		
		xhr.send(formData);
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.isResampleImage = function(data, thresh)
	{
		thresh = (thresh != null) ? thresh : this.resampleThreshold;

		return data.length > thresh;
	};
	
	/**
	 * Resizes the given image if <maxImageBytes> is not null.
	 */
	EditorUi.prototype.resizeImage = function(img, data, fn, enabled, maxSize, thresh)
	{
		maxSize = (maxSize != null) ? maxSize : this.maxImageSize;
		var w = Math.max(1, img.width);
		var h = Math.max(1, img.height);
		
		if (enabled && this.isResampleImage(data, thresh))
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

		fn(data, w, h);
	};
	
	EditorUi.prototype.crcTable = [];
	
	for (var n = 0; n < 256; n++)
	{
		var c = n;
		
		for (var k = 0; k < 8; k++)
		{
			if ((c & 1) == 1)
			{
				c = 0xedb88320 ^ (c >>> 1);
			}
			else
			{
				c >>>= 1;
			}

			EditorUi.prototype.crcTable[n] = c;
		}
	}
	
	EditorUi.prototype.updateCRC = function(crc, data, off, len)
	{
		var c = crc;
	
		for (var n = 0; n < len; n++)
		{
			c = EditorUi.prototype.crcTable[(c ^ data[off + n]) & 0xff] ^ (c >>> 8);
		}
	
		return c;
	};

	EditorUi.prototype.crc32 = function(str)
	{
		this.crcTable = this.crcTable || this.createCrcTable();
	    var crc = 0 ^ (-1);

	    for (var i = 0; i < str.length; i++ )
	    {
	        crc = (crc >>> 8) ^ this.crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
	    }

	    return (crc ^ (-1)) >>> 0;
	};

	/**
	 * Adds the given text to the compressed or non-compressed text chunk.
	 */
	EditorUi.prototype.writeGraphModelToPng = function(data, type, key, value, error)
	{
		var base64 = data.substring(data.indexOf(',') + 1);
		var f = (window.atob) ? atob(base64) : Base64.decode(base64, true);
		var pos = 0;
		
		function fread(d, count)
		{
			var start = pos;
			pos += count;
			
			return d.substring(start, pos);
		};
		
		// Reads unsigned long 32 bit big endian
		function _freadint(d)
		{
			var bytes = fread(d, 4);
			
			return bytes.charCodeAt(3) + (bytes.charCodeAt(2) << 8) +
				(bytes.charCodeAt(1) << 16) + (bytes.charCodeAt(0) << 24);
		};
		
		function writeInt(num)
		{
			return String.fromCharCode((num >> 24) & 0x000000ff, (num >> 16) & 0x000000ff,
				(num >> 8) & 0x000000ff, num & 0x000000ff);
		};
		
		// Checks signature
		if (fread(f,8) != String.fromCharCode(137) + 'PNG' + String.fromCharCode(13, 10, 26, 10))
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		// Reads header chunk
		fread(f,4);
		
		if (fread(f,4) != 'IHDR')
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		fread(f, 17);
		var result = f.substring(0, pos);
		
		do
		{
			var n = _freadint(f);
			var chunk = fread(f,4);
			
			if (chunk == 'IDAT')
			{
				result = f.substring(0, pos - 8);
				
				var chunkData = key + String.fromCharCode(0) +
					((type == 'zTXt') ? String.fromCharCode(0) : '') + 
					value;
				
				// FIXME: Wrong crc
				var crc = 0xffffffff;
				crc = this.updateCRC(crc, type, 0, 4);
				crc = this.updateCRC(crc, chunkData, 0, chunkData.length);
				
				result += writeInt(chunkData.length) + type + chunkData + writeInt(crc ^ 0xffffffff);
				result += f.substring(pos - 8, f.length);
				
				break;
			}
			
			result += f.substring(pos - 8, pos - 4 + n);
			fread(f,n);
			fread(f,4);
		}
		while (n);
		
		return 'data:image/png;base64,' + ((window.btoa) ? btoa(result) : Base64.encode(result, true));
	}
	
	/**
	 * Extracts the XML from the compressed or non-compressed text chunk.
	 */
	EditorUi.prototype.extractGraphModelFromPng = function(data)
	{
		var result = null;
		
		try
		{
			var base64 = data.substring(data.indexOf(',') + 1);

			// Workaround for invalid character error in Safari
			var binary = (window.atob && !mxClient.IS_SF) ? atob(base64) : Base64.decode(base64, true);
			
			EditorUi.parsePng(binary, mxUtils.bind(this, function(pos, type, length)
			{
				var value = binary.substring(pos + 8, pos + 8 + length);
				
				if (type == 'zTXt')
				{
					var idx = value.indexOf(String.fromCharCode(0));
					
					if (value.substring(0, idx) == 'mxGraphModel')
					{
						// Workaround for Java URL Encoder using + for spaces, which isn't compatible with JS
						var xmlData = this.editor.graph.bytesToString(pako.inflateRaw(
							value.substring(idx + 2))).replace(/\+/g,' ');
						
						if (xmlData != null && xmlData.length > 0)
						{
							result = xmlData;
						}
					}
				}
				// Uncompressed section is normally not used
				else if (type == 'tEXt')
				{
					var vals = value.split(String.fromCharCode(0));
					
					if (vals.length > 1 && vals[0] == 'mxGraphModel')
					{
						result = vals[1];
					}
				}
				
				if (result != null || type == 'IDAT')
				{
					// Stops processing the file as our text chunks
					// are always placed before the data section
					return true;
				}
			}));
		}
		catch (e)
		{
			// ignores decoding errors
		}
		
		if (result != null && result.charAt(0) == '%')
		{
			result = decodeURIComponent(result);
		}
		
		// Workaround for double encoded content
		if (result != null && result.charAt(0) == '%')
		{
			result = decodeURIComponent(result);
		}
		
		return result;
	};

	/**
	 * Loads the image from the given URI.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.loadImage = function(uri, onload, onerror)
	{
		var img = new Image();
		
		img.onload = function()
		{
			onload(img);
		}
		
		if (onerror != null)
		{
			img.onerror = onerror;
		}
		
		img.src = uri;
	};

	// Initializes the user interface
	var editorUiInit = EditorUi.prototype.init;
	EditorUi.prototype.init = function()
	{
		mxStencilRegistry.allowEval = mxStencilRegistry.allowEval && !this.isOfflineApp();
		
		// Must be set before UI is created in superclass
		if (typeof window.mxSettings !== 'undefined')
		{
			this.formatWidth = mxSettings.getFormatWidth();
		}
		
		var ui = this;
		var graph = this.editor.graph;
		
		// Redirects custom link title via UI for page links
		graph.getLinkTitle = function(href)
		{
			return ui.getLinkTitle(href);
		};
		
		// Redirects custom link via UI for page link handling
		graph.customLinkClicked = function(link)
		{
			var done = false;
			
			try
			{
				ui.handleCustomLink(link);
				done = true;
			}
			catch (e)
			{
				ui.handleError(e);
			}
			
			return done;
		};
		
		// Extends clear default style to clear persisted settings
		var clearDefaultStyle = this.clearDefaultStyle;
		
		this.clearDefaultStyle = function()
		{
			clearDefaultStyle.apply(this, arguments);
			
			if (!this.persistCurrentEdgeStyle)
			{
				mxSettings.setCurrentEdgeStyle(this.editor.graph.currentEdgeStyle);
				mxSettings.save();
			}
			
			if (!this.persistCurrentVertexStyle)
			{
				mxSettings.setCurrentVertexStyle(this.editor.graph.currentVertexStyle);
				mxSettings.save();
			}
		};
		
		// Sets help link for placeholders
		if (!this.isOffline() && typeof window.EditDataDialog !== 'undefined')
		{
			EditDataDialog.placeholderHelpLink = 'https://desk.draw.io/support/solutions/articles/16000051979';
		}
		
		// Passes current page to editor window
		var editorGetEditBlankUrl = ui.editor.getEditBlankUrl;
		
		this.editor.getEditBlankUrl = function(params)
		{
			params = (params != null) ? params : '';
			
			if (ui.pages != null && ui.currentPage != null)
			{
				for (var i = 0; i < ui.pages.length; i++)
				{
					if (ui.pages[i] == ui.currentPage)
					{
						if (i > 0)
						{
							params += ((params.length > 0) ? '&' : '?') + 'page=' + i;
						}
						
						break;
					}
				}
			}
			
			if (urlParams['dev'] == '1')
			{
				params += ((params.length > 0) ? '&' : '?') + 'dev=1&drawdev=1';
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

			beforeClick = function(evt, href)
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
					graph.customLinkClicked(href))
				{
					mxEvent.consume(evt);
				}
				
				if (tmp != null)
				{
					tmp(evt, href);
				}
			};
			
			// For some reason, local argument override is not enough in this case...
			graphAddClickHandler.call(this, highlight, beforeClick, onClick);
		};

		editorUiInit.apply(this, arguments);
		
		if (mxClient.IS_SVG)
		{
			// LATER: Add shadow for labels in graph.container (eg. math, NO_FO), scaling
			this.editor.graph.addSvgShadow(graph.view.canvas.ownerSVGElement, null, true);
		}

		// Overrides print dialog size
		ui.actions.get('print').funct = function()
		{
			ui.showDialog(new PrintDialog(ui).container, 360,
				(ui.pages != null && ui.pages.length > 1) ?
				420 : 360, true, true);
		};

		// Specifies the default filename
		this.defaultFilename = mxResources.get('untitledDiagram');
		
		// Adds placeholder for %page% and %pagenumber%
		var graphGetGlobalVariable = graph.getGlobalVariable;
		
		graph.getGlobalVariable = function(name)
		{
			if (name == 'page' && ui.currentPage != null)
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
			
			return graphGetGlobalVariable.apply(this, arguments);
		};

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
		
		// Scales pages/graph to fit available size
		if (!this.editor.chromeless || this.editor.editable)
		{
			// Defines additional hotkeys
			this.keyHandler.bindAction(70, true, 'find'); // Ctrl+F
		    this.keyHandler.bindAction(67, true, 'copyStyle', true); // Ctrl+Shift+C
		    this.keyHandler.bindAction(86, true, 'pasteStyle', true); // Ctrl+Shift+V
		    this.keyHandler.bindAction(77, true, 'editGeometry', true); // Ctrl+Shift+M
		    this.keyHandler.bindAction(88, true, 'insertText', true); // Ctrl+Shift+X
		    this.keyHandler.bindAction(75, true, 'insertRectangle'); // Ctrl+K
		    this.keyHandler.bindAction(75, true, 'insertEllipse', true); // Ctrl+Shift+K
			
			// Handles copy paste of images from clipboard
			if (!mxClient.IS_IE)
			{
				graph.container.addEventListener('paste', mxUtils.bind(this, function(evt)
				{
					var graph = this.editor.graph;
					
					if (!mxEvent.isConsumed(evt))
					{
						try
						{
							var data = (evt.clipboardData || evt.originalEvent.clipboardData);
							var containsText = false;
							
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
							
							if (!containsText)
							{
								var items = data.items;
								
								for (index in items)
								{
									var item = items[index];
									
									if (item.kind === 'file')
									{
										if (graph.isEditing())
										{
										    	this.importFiles([item.getAsFile()], 0, 0, this.maxImageSize, function(data, mimeType, x, y, w, h)
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
										    	});
										}
										else
										{
											var pt = this.editor.graph.getInsertPoint();
											this.importFiles([item.getAsFile()], pt.x, pt.y, this.maxImageSize);
											mxEvent.consume(evt);
										}
										
										break;
									}
								}
							}
						}
						catch (e)
						{
							// ignore
						}
					}
				}), false);
			}

			// Focused but invisible textarea during control or meta key events
			var textInput = document.createElement('div');
			textInput.style.position = 'absolute';
			textInput.style.whiteSpace = 'nowrap';
			textInput.style.overflow = 'hidden';
			textInput.style.display = 'block';
			textInput.contentEditable = true;
			mxUtils.setOpacity(textInput, 0);
			textInput.style.width = '1px';
			textInput.style.height = '1px';
			textInput.innerHTML = '&nbsp;';

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
					this.dialog == null && source.nodeName != 'INPUT' && source.nodeName != 'TEXTAREA')
				{
					if (evt.keyCode == 224 /* FF */ || (!mxClient.IS_MAC && evt.keyCode == 17 /* Control */) ||
						(mxClient.IS_MAC && evt.keyCode == 91 /* Meta */))
					{
						// Cannot use parentNode for check in IE
						if (!restoreFocus)
						{
							// Avoid autoscroll but allow handling of all pass-through ctrl shortcuts
							textInput.style.left = (graph.container.scrollLeft + 10) + 'px';
							textInput.style.top = (graph.container.scrollTop + 10) + 'px';
							
							graph.container.appendChild(textInput);
							restoreFocus = true;
							
							// Workaround for selected document content in quirks mode
							if (mxClient.IS_QUIRKS)
							{
								window.setTimeout(function()
								{
									textInput.focus();
									document.execCommand('selectAll', false, null);
								}, 0);
							}
							else
							{
								textInput.focus();
								document.execCommand('selectAll', false, null);
							}
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
					document.execCommand('selectAll', false, null);
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
						keyCode == 91 /* Meta */))
					{
						restoreFocus = false;
						
						if (!graph.isEditing() && this.dialog == null && graph.container != null)
						{
							graph.container.focus();
						}
						
						textInput.parentNode.removeChild(textInput);
						
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
					mxClipboard.copy(graph);
					this.copyCells(textInput);
					clearInput();
				}
			}));
			
			mxEvent.addListener(textInput, 'cut', mxUtils.bind(this, function(evt)
			{
				if (graph.isEnabled())
				{
					mxClipboard.copy(graph);
					this.copyCells(textInput, true);
					clearInput();
				}
			}));
			
			mxEvent.addListener(textInput, 'paste', mxUtils.bind(this, function(evt)
			{
				if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
				{
					textInput.innerHTML = '&nbsp;';
					textInput.focus();
					
					window.setTimeout(mxUtils.bind(this, function()
					{
						this.pasteCells(evt, textInput);
						textInput.innerHTML = '&nbsp;';
					}), 0);
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

		var y = Math.max(document.body.clientHeight || 0, document.documentElement.clientHeight || 0) / 2;
		var x = document.body.clientWidth / 2 - 2;
	
		// Holds the x-coordinate of the point
		this.spinner = this.createSpinner(x, y, 24);
		
		// Installs drag and drop handler for rich text editor
		if (Graph.fileSupport)
		{
			this.editor.graph.addListener(mxEvent.EDITING_STARTED, mxUtils.bind(this, function(evt)
			{
				// Setup the dnd listeners
				var graph = this.editor.graph;
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
						// IE 10 does not implement pointer-events so it can't have a drop highlight
						if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
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
		
		//Add ruler in test mode only
		//TODO add the ruler containers correctly and make the vertical one dynamic as the side panel size can change
		if (urlParams['ruler'] == '1' && typeof mxRuler !== 'undefined')
		{
			var hRulerDiv = document.createElement('div');
			hRulerDiv.style.position = 'absolute';
			hRulerDiv.style.top = '95px';
			hRulerDiv.style.left = '250px';
			hRulerDiv.style.width = '2000px';
			hRulerDiv.style.height = '30px';
			hRulerDiv.style.background = 'whiteSmoke';
			document.body.appendChild(hRulerDiv);
			
			var vRulerDiv = document.createElement('div');
			vRulerDiv.style.position = 'absolute';
			vRulerDiv.style.top = '125px';
			vRulerDiv.style.left = '220px';
			vRulerDiv.style.width = '30px';
			vRulerDiv.style.height = '1000px';
			vRulerDiv.style.background = 'whiteSmoke';
			document.body.appendChild(vRulerDiv);

			var square = document.createElement('div');
			square.style.position = 'absolute';
			square.style.top = '95px';
			square.style.left = '220px';
			square.style.width = '30px';
			square.style.height = '30px';
			square.style.background = 'whiteSmoke';
			document.body.appendChild(square);

			this.vRuler = new mxRuler(this.editor.graph, vRulerDiv, true);
			this.hRuler = new mxRuler(this.editor.graph, hRulerDiv, false);
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
					} else
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
				// IE 10 does not implement pointer-events so it can't have a drop highlight
				if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
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
					var tr = graph.view.translate;
					var scale = graph.view.scale;
					var x = pt.x / scale - tr.x;
					var y = pt.y / scale - tr.y;
					
					if (mxEvent.isAltDown(evt))
					{
						x = 0;
						y = 0;
					}
					
				    if (evt.dataTransfer.files.length > 0)
				    {
						this.importFiles(evt.dataTransfer.files, x, y, this.maxImageSize, null, null, null, null,
							mxEvent.isControlDown(evt), null, null, mxEvent.isShiftDown(evt));
		    		}
				    else
				    {
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
				    		div.innerHTML = html;
				    		
				    		// The default is based on the extension
				    		var asImage = null;
				    		
				    		// Extracts single image
				    		var imgs = div.getElementsByTagName('img');

				    		if (imgs != null && imgs.length == 1)
				    		{
				    			html = imgs[0].getAttribute('src');
				    			
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
				    		}
				    		
				    		var resizeImages = true;
				    		
				    		var doInsert = mxUtils.bind(this, function()
				    		{
				    			graph.setSelectionCells(this.insertTextAt(html, x, y, true, asImage, null, resizeImages));
				    		});
				    		
				    		if (asImage && html.length > this.resampleThreshold)
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
			    					'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
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
		
		this.installSettings();
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.getLinkTitle = function(href)
	{
		var title = Graph.prototype.getLinkTitle.apply(this, arguments);

		if (href.substring(0, 13) == 'data:page/id,')
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
			title = mxResources.get('action');
		}
		
		return title;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.handleCustomLink = function(href)
	{
		if (href.substring(0, 13) == 'data:page/id,')
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
			this.editor.graph.handleCustomLink(href);
		}
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.isSettingsEnabled = function()
	{
		return typeof window.mxSettings !== 'undefined' && (isLocalStorage || mxClient.IS_CHROMEAPP);
	};

	/**
	 * Creates the format panel and adds overrides.
	 */
	EditorUi.prototype.installSettings = function()
	{
		if (this.isSettingsEnabled())
		{
			// Gets recent colors from settings
			ColorDialog.recentColors = mxSettings.getRecentColors();

			/**
			 * Persists current edge style.
			 */
			this.editor.graph.currentEdgeStyle = mxSettings.getCurrentEdgeStyle();
			this.editor.graph.currentVertexStyle = mxSettings.getCurrentVertexStyle();
			
			// Updates UI to reflect current edge style
			this.fireEvent(new mxEventObject('styleChanged', 'keys', [], 'values', [], 'cells', []));
			
			this.addListener('styleChanged', mxUtils.bind(this, function(sender, evt)
			{
				if (this.persistCurrentEdgeStyle)
				{
					mxSettings.setCurrentEdgeStyle(this.editor.graph.currentEdgeStyle);
					mxSettings.save();
				}
				
				if (this.persistCurrentVertexStyle)
				{
					mxSettings.setCurrentVertexStyle(this.editor.graph.currentVertexStyle);
					mxSettings.save();
				}
			}));

			/**
			 * Persists copy on connect switch.
			 */
			this.editor.graph.connectionHandler.setCreateTarget(mxSettings.isCreateTarget());
			this.fireEvent(new mxEventObject('copyConnectChanged'));
			
			this.addListener('copyConnectChanged', mxUtils.bind(this, function(sender, evt)
			{
				mxSettings.setCreateTarget(this.editor.graph.connectionHandler.isCreateTarget());
				mxSettings.save();
			}));
			
			/**
			 * Persists default page format.
			 */
			this.editor.graph.pageFormat = mxSettings.getPageFormat();
			
			this.addListener('pageFormatChanged', mxUtils.bind(this, function(sender, evt)
			{
				mxSettings.setPageFormat(this.editor.graph.pageFormat);
				mxSettings.save();
			}));
			
			/**
			 * Persists default grid color.
			 */
			this.editor.graph.view.gridColor = mxSettings.getGridColor();
			
			this.addListener('gridColorChanged', mxUtils.bind(this, function(sender, evt)
			{
				mxSettings.setGridColor(this.editor.graph.view.gridColor);
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
			
			/**
			 * 
			 */
			if (this.sidebar != null)
			{
				this.sidebar.showPalette('search', mxSettings.settings.search);
			}
			
			/**
			 * Shows scratchpad if never shown.
			 */
			if ((!this.editor.chromeless || this.editor.editable) &&
				this.sidebar != null && (mxSettings.settings.isNew ||
				parseInt(mxSettings.settings.version || 0) <= 8))
			{
				this.toggleScratchpad();
				mxSettings.save();
			}

			// Saves app defaults for UI
			this.addListener('formatWidthChanged', function()
			{
				mxSettings.setFormatWidth(this.formatWidth);
				mxSettings.save();
			});
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
			var cells = mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells()));
			
			// LATER: Add span with XML in data attribute
			// var span = document.createElement('span');
			// span.setAttribute('data-jgraph-type', 'application/vnd.jgraph.xml');
			// span.setAttribute('data-jgraph-content', mxUtils.getXml(graph.encodeCells(clones)));
			
			// Fixes cross-platform clipboard UTF8 issues by encoding as URI
			var xml = mxUtils.getXml(this.editor.graph.encodeCells(cells));
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
			elt.innerHTML = '';
		}
	};
	
	/**
	 * Creates the format panel and adds overrides.
	 */
	EditorUi.prototype.pasteCells = function(evt, elt)
	{
		if (!mxEvent.isConsumed(evt))
		{
			var spans = elt.getElementsByTagName('span');
		
			if (spans != null && spans.length > 0 && spans[0].getAttribute('data-lucid-type') ===
				'application/vnd.lucid.chart.objects')
			{
				var content = spans[0].getAttribute('data-lucid-content');
				
				if (content != null && content.length > 0)
				{
					this.convertLucidChart(content, mxUtils.bind(this, function(xml)
					{
						this.editor.graph.setSelectionCells(this.importXml(xml, 0, 0));
					}), mxUtils.bind(this, function(e)
					{
						this.handleError(e);
					}));
			
					mxEvent.consume(evt);
				}
			}
			else
			{
				var graph = this.editor.graph;
				var xml = mxUtils.trim((mxClient.IS_QUIRKS || document.documentMode == 8) ?
					mxUtils.getTextContent(elt) : elt.textContent);
				var compat = false;
	
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
							
					if (this.isCompatibleString(tmp))
					{
						compat = true;
						xml = tmp;
					}
				}
				catch (e)
				{
					// ignore
				}
				
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
				
				if (xml != null && xml.length > 0)
				{
					if (compat || this.isCompatibleString(xml))
					{
						graph.setSelectionCells(this.importXml(xml, dx, dx));
					}
					else
					{
						var pt = graph.getInsertPoint();
						
						if (graph.isMouseInsertPoint())
						{
							dx = 0;
							
							// No offset for insert at mouse position
							if (graph.lastPasteXml == xml && graph.pasteCounter > 0)
							{
								graph.pasteCounter--;
							}
						}
						
						graph.setSelectionCells(this.insertTextAt(xml, pt.x + dx, pt.y + dx, true));
					}
					
					if (!graph.isSelectionEmpty())
					{
						graph.scrollCellToVisible(graph.getSelectionCell());
					
						if (this.hoverIcons != null)
						{
							this.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
						}
						
						try
						{
							mxEvent.consume(evt);
						}
						catch (e)
						{
							// ignore event no longer exists in async handler in IE8-
						}
					}
				}
			}
		}
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
						// IE 10 does not implement pointer-events so it can't have a drop highlight
						if (dropElt == null && (!mxClient.IS_IE || (document.documentMode > 10 && document.documentMode < 12)))
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
								    		var data = evt.dataTransfer.getData('text/uri-list');
								    	}
								    	else
								    	{
								    		data = (mxUtils.indexOf(provider.types, 'text/html') >= 0) ? provider.getData('text/html') : null;
								    	}
										
										if (data != null && data.length > 0)
										{
											var div = document.createElement('div');
								    		div.innerHTML = data;
		
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
										if (data.substring(0, 22) == 'data:image/png;base64,')
										{
											var xml = this.extractGraphModelFromPng(data);
											
											if (xml != null && xml.length > 0)
											{
												this.openLocalFile(xml, null, true);
											}
										}
										else if (!this.isOffline() && this.isRemoteFileFormat(data))
										{
								    		new mxXmlRequest(OPEN_URL, 'format=xml&data=' + encodeURIComponent(data)).send(mxUtils.bind(this, function(req)
											{
								    			if (req.getStatus() >= 200 && req.getStatus() <= 299)
								    			{
								    				this.openLocalFile(req.getText(), null, true);
								    			}
											}));
										}
										else if (/^https?:\/\//.test(data))
										{
											if (this.getCurrentFile() == null)
											{
												window.location.hash = '#U' + encodeURIComponent(data);
											}
											else
											{
												window.openWindow(((mxClient.IS_CHROMEAPP) ?
													'https://www.draw.io/' : 'https://' + location.host + '/') +
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
		
			w = (b.clientWidth || d.clientWidth) - 3;
			h = Math.max(b.clientHeight || 0, d.clientHeight) - 3;
		}
		else
		{
			x = elt.offsetTop;
			y = elt.offsetLeft;
			w = elt.clientWidth;
			h = elt.clientHeight;
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
		else
		{
			document.body.appendChild(hl);
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
	EditorUi.prototype.openFiles = function(files, temp)
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
						var data = e.target.result;
						var name = file.name;
						
						if (name != null && name.length > 0)
						{
							if (!this.useCanvasForExport && /(\.png)$/i.test(name))
							{
								name = name.substring(0, name.length - 4) + '.xml';
							}
							
							var handleResult = mxUtils.bind(this, function(xml)
							{
								var dot = name.lastIndexOf('.');
								
								if (dot >= 0)
								{
									name = name.substring(0, name.lastIndexOf('.')) + '.xml';
								}
								else
								{
									name = name + '.xml';
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
					    			}
				    				catch (e)
					    			{
					    				this.handleError(e, mxResources.get('errorLoadingFile'));
					    			}
								}
								else
								{
									this.openLocalFile(xml, name, temp);
								}
							});
							
							if  (/(\.vsdx?)($|\?)/i.test(name) || /(\.vssx?)($|\?)/i.test(name))
							{
								this.importVisio(file, mxUtils.bind(this, function(xml)
								{
									this.spinner.stop();
									handleResult(xml);
								}));
							}
							else if (Graph.fileSupport && !this.isOffline() && new XMLHttpRequest().upload &&
								this.isRemoteFileFormat(data, name))
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
							else if (this.isLucidChartData(data))
							{
								if (/(\.json)$/i.test(name))
								{
									name = name.substring(0, name.length - 5) + '.xml';
								}

								// LATER: Add import step that produces cells and use callback
								this.convertLucidChart(data, mxUtils.bind(this, function(xml)
								{
									this.spinner.stop();
									this.openLocalFile(xml, name, temp);
								}), mxUtils.bind(this, function(e)
								{
									this.spinner.stop();
									this.handleError(e);
								}));
							}
							else if (e.target.result.substring(0, 10) == '<mxlibrary')
			    			{
								this.spinner.stop();
								
								// Creates new temporary file if library is dropped in splash screen
								if (this.getCurrentFile() == null && urlParams['embed'] != '1')
								{
									this.openLocalFile(this.emptyDiagramXml, this.defaultFilename, temp);
								}
								
			    				try
				    			{
				    				this.loadLibrary(new LocalLibrary(this, e.target.result, file.name));
				    			}
				    			catch (e)
				    			{
				    				this.handleError(e, mxResources.get('errorLoadingFile'));
				    			}
			    			}
							else
							{
								if (file.type.substring(0, 9) == 'image/png')
								{
									data = this.extractGraphModelFromPng(data);
								}
								
								this.spinner.stop();
								this.openLocalFile(data, name, temp);
							}
						}
					});
					
					reader.onerror = mxUtils.bind(this, function(e)
					{
						this.spinner.stop();
						this.handleError(e);
						window.openFile = null;
					});
					
					if (file.type.substring(0, 5) === 'image' && file.type.substring(0, 9) !== 'image/svg')
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
	EditorUi.prototype.openLocalFile = function(data, name, temp)
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
				this.fileLoaded(new LocalFile(this, data, name || this.defaultFilename, temp));
			}
		});

		if (data != null && data.length > 0)
		{
			if (currentFile == null || (!currentFile.isModified() &&
				(mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)))
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
				
				window.openFile.setData(data, name);
				window.openWindow(this.getUrl(), null, mxUtils.bind(this, function()
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
				}));
			}
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
		this.formatContainer.style.visibility = (enabled) ? '' : 'hidden';
		this.sidebarFooterContainer.style.display = (enabled) ? '' : 'none';
		this.sidebarContainer.style.display = (enabled) ? '' : 'none';
		this.hsplit.style.display = (enabled) ? '' : 'none';
		this.editor.graph.setEnabled(enabled);
		
		if (this.tabContainer != null)
		{
			this.tabContainer.style.visibility = (enabled) ? '' : 'hidden';	
		}
		
		if (!enabled)
		{
            if (this.actions.outlineWindow != null)
            {
            	this.actions.outlineWindow.window.setVisible(false);
            }

            if (this.actions.layersWindow != null)
            {
            	this.actions.layersWindow.window.setVisible(false);
            }

            if (this.menus.tagsWindow != null)
            {
            	this.menus.tagsWindow.window.setVisible(false);
            }

            if (this.menus.findWindow != null)
            {
            	this.menus.findWindow.window.setVisible(false);
            }
		}
	};
	
	/**
	 * Shows the layers dialog if the graph has more than one layer.
	 */
	EditorUi.prototype.initializeEmbedMode = function()
	{
		this.setGraphEnabled(false);
		var parent = window.opener || window.parent;

		if (parent != window)
		{
			if (urlParams['spin'] != '1' || this.spinner.spin(document.body, mxResources.get('loading')))
			{
				this.installMessageHandler(mxUtils.bind(this, function(xml, evt, modified)
				{
					this.spinner.stop();
					this.addEmbedButtons();
					this.setGraphEnabled(true);
					
					if (xml != null && xml.length > 0)
					{
						this.setFileData(xml);
						
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
					}
					else
					{
						this.editor.graph.model.clear();
						this.editor.fireEvent(new mxEventObject('resetGraphView'));
					}
	
					this.editor.undoManager.clear();
					this.editor.modified = (modified != null) ? modified : false;
					this.updateUi();
					
					// Workaround for no initial focus in FF
					// (does not work in Conf Cloud with FF)
					if (window.self !== window.top)
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
			file.getPublicUrl(fn);
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
		
		return {event: eventName, pageVisible: graph.pageVisible, translate: graph.view.translate,
			scale: graph.view.scale, page: graph.view.getBackgroundPageBounds(), bounds: graph.getGraphBounds()};
	};
	
	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.installMessageHandler = function(fn)
	{
		var changeListener = null;
		var ignoreChange = false;
		var autosave = false;
		var lastData = null;
		
		var updateStatus = mxUtils.bind(this, function(sender, eventObject)
		{
			if (!this.editor.modified || urlParams['modified'] == '0')
			{
				this.editor.setStatus('');
			}
			else if (urlParams['modified'] != null)
			{
				this.editor.setStatus(mxUtils.htmlEntities(mxResources.get(urlParams['modified'])));
			}
		});
		
		this.editor.graph.model.addListener(mxEvent.CHANGE, updateStatus);
		
		// Receives XML message from opener and puts it into the graph
		mxEvent.addListener(window, 'message', mxUtils.bind(this, function(evt)
		{
			var validSource = window.opener || window.parent;
			
			if (evt.source != validSource)
			{
				return;
			}
			
			var data = evt.data;
			
			var extractDiagramXml = mxUtils.bind(this, function(data)
			{
				if (data != null && typeof data.charAt === 'function' && data.charAt(0) != '<')
				{
					try
					{
						if (data.substring(0, 22) == 'data:image/png;base64,')
						{
							data = this.extractGraphModelFromPng(data);
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
							if (data.charAt(0) == '%')
							{
								data = decodeURIComponent(data);
							}
							else if (data.charAt(0) != '<')
							{
								data = this.editor.graph.decompress(data);
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
				try
				{
					data = JSON.parse(data);
				}
				catch (e)
				{
					data = null;
				}
				
				if (data == null)
				{
					// Ignore
					return;
				}
				else if (data.action == 'dialog')
				{
					this.showError((data.titleKey != null) ? mxResources.get(data.titleKey) : data.title,
						(data.messageKey != null) ? mxResources.get(data.messageKey) : data.message,
						(data.buttonKey != null) ? mxResources.get(data.buttonKey) : data.button);
					
					if (data.modified != null)
					{
						this.editor.modified = data.modified;
					}
					
					return;
				}
				else if (data.action == 'prompt')
				{
					this.spinner.stop();
					
					var dlg = new FilenameDialog(this, data.defaultValue || '',
						(data.okKey != null) ? mxResources.get(data.okKey) : null, function(value)
					{
						if (value != null)
						{
							parent.postMessage(JSON.stringify({event: 'prompt', value: value, message: data}), '*');
						}
					}, (data.titleKey != null) ? mxResources.get(data.titleKey) : data.title);
					this.showDialog(dlg.container, 300, 80, true, false);
					dlg.init();
					
					return;
				}
				else if (data.action == 'draft')
				{
					var tmp = extractDiagramXml(data.xml);
					this.spinner.stop();
					
					var dlg = new DraftDialog(this, mxResources.get('draftFound', [data.name || this.defaultFilename]),
						tmp, mxUtils.bind(this, function()
					{
						this.hideDialog();
						parent.postMessage(JSON.stringify({event: 'draft', result: 'edit', message: data}), '*');
					}), mxUtils.bind(this, function()
					{
						this.hideDialog();
						parent.postMessage(JSON.stringify({event: 'draft', result: 'discard', message: data}), '*');
					}), (data.editKey) ? mxResources.get(data.editKey) : null,
						(data.discardKey) ? mxResources.get(data.discardKey) : null,
						(data.ignore) ? mxUtils.bind(this, function()
						{
							this.hideDialog();
							parent.postMessage(JSON.stringify({event: 'draft', result: 'ignore', message: data}), '*');
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
						parent.postMessage(JSON.stringify({event: 'draft', error: e.toString(), message: data}), '*');
					}
					
					return;
				}
				else if (data.action == 'template')
				{
					this.spinner.stop();
					
					var enableRecentDocs = data.enableRecent == 1;
					var enableSearchDocs = data.enableSearch == 1;
					
					var dlg = new NewDialog(this, false, data.callback != null, mxUtils.bind(this, function(xml, name)
					{
						xml = xml || this.emptyDiagramXml;
						
						// LATER: Add autosave option in template message
						if (data.callback != null)
						{
							parent.postMessage(JSON.stringify({event: 'template', xml: xml,
								blank: xml == this.emptyDiagramXml, name: name}), '*');
						}
						else
						{
							fn(xml, evt, xml != this.emptyDiagramXml);
							
							// Workaround for status updated before modified applied
							if (!this.editor.modified)
							{
								this.editor.setStatus('');
							}
						}
					}), null, null, null, null, null, null, null, 
					enableRecentDocs? mxUtils.bind(this, function(recentReadyCallback) 
					{
						this.recentReadyCallback = recentReadyCallback;
						
						parent.postMessage(JSON.stringify({event: 'recentDocs'}), '*');
					}) : null, 
					enableSearchDocs?  mxUtils.bind(this, function(searchStr, searchReadyCallback) 
					{
						this.searchReadyCallback = searchReadyCallback;
						
						parent.postMessage(JSON.stringify({event: 'searchDocs', searchStr: searchStr}), '*');
					}) : null, 
					function(url, info, name) 
					{
						parent.postMessage(JSON.stringify({event: 'template', docUrl: url, info: info,
							name: name}), '*');
					});

					this.showDialog(dlg.container, 620, 440, true, false, mxUtils.bind(this, function(cancel)
					{
						if (cancel)
						{
							this.actions.get('exit').funct();
						}
					}));
					dlg.init();
					
					return;
				}
				else if (data.action == 'searchDocsList')
				{
					this.searchReadyCallback(data.list, data.errorMsg);
				}
				else if (data.action == 'recentDocsList')
				{
					this.recentReadyCallback(data.list, data.errorMsg);
				}
				else if (data.action == 'textContent')
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
					parent.postMessage(JSON.stringify({event: 'textContent', data: allPagesTxt, message: data}), '*');
					return;
				}
				else if (data.action == 'status')
				{
					if (data.messageKey != null)
					{
						this.editor.setStatus(mxUtils.htmlEntities(mxResources.get(data.messageKey)));
					}
					else if (data.message != null)
					{
						this.editor.setStatus(mxUtils.htmlEntities(data.message));
					}
					
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
							
							var postDataBack = mxUtils.bind(this, function(uri)
							{
								this.editor.graph.setEnabled(true);
								this.spinner.stop();
								
								var msg = this.createLoadMessage('export');
								msg.format = data.format;
								msg.message = data;
								msg.data = uri;
								msg.xml = encodeURIComponent(xml);
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
						   	    		uri = this.writeGraphModelToPng(uri, 'zTXt', 'mxGraphModel',
						   	    				atob(this.editor.graph.compress(xml)));	
						   	    }
						   	    	
								// Removes temporary graph from DOM
						   	    if (graph != this.editor.graph)
								{
									graph.container.parentNode.removeChild(graph.container);
								}
				   	   	    	
						   	    postDataBack(uri);
							});
					
							// LATER: Uses external export if current page (not first page) has mathEnabled
							if (this.isExportToCanvas())
							{
								// Exports PNG for first page while other page is visible by creating a graph
								// LATER: Add caching for the graph or SVG while not on first page
								if (this.pages != null && this.currentPage != this.pages[0])
								{
									graph = this.createTemporaryGraph(graph.getStylesheet());
									var graphGetGlobalVariable = graph.getGlobalVariable;
									var page = this.pages[0];
							
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

								this.exportToCanvas(mxUtils.bind(this, function(canvas)
							   	{
									processUri(canvas.toDataURL('image/png'));
							   	}), null, null, null, mxUtils.bind(this, function()
								{
							   		processUri(null);
								}), null, null, null, null, null, null, graph);
							}
							else
							{
								// Data from server is base64 encoded to avoid binary XHR
								// Double encoding for XML arg is needed for UTF8 encoding
						       	var req = new mxXmlRequest(EXPORT_URL, 'format=png&embedXml=' +
						       		((data.format == 'xmlpng') ? '1' : '0') + '&base64=1&xml=' +
						       		encodeURIComponent(encodeURIComponent(xml)));

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
						// SVG is generated from graph so parse optional XML
						if (data.xml != null && data.xml.length > 0)
						{
							this.setFileData(data.xml);
						}
						
						var msg = this.createLoadMessage('export');
						
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
						else
						{
							// Creates a preview with no alt text for unsupported browsers
				        	mxSvgCanvas2D.prototype.foAltText = null;
				        	
				        	var bg = this.editor.graph.background;
				        	
				        	if (bg == mxConstants.NONE)
				        	{
				        		bg = null;
				        	}
					        	
							msg.xml = this.getFileData(true);
							msg.format = 'svg';
					        	
				        	if (data.embedImages || data.embedImages == null)
				        	{
								if ((data.spin == null && data.spinKey == null) || this.spinner.spin(document.body,
									(data.spinKey != null) ? mxResources.get(data.spinKey) : data.spin))
								{
									this.editor.graph.setEnabled(false);
									
					        		if (data.format == 'xmlsvg')
					        		{
						        		this.getEmbeddedSvg(msg.xml, this.editor.graph, null, true, mxUtils.bind(this, function(svg)
					        			{
										this.editor.graph.setEnabled(true);
										this.spinner.stop();
										
										msg.data = this.createSvgDataUri(svg);
										parent.postMessage(JSON.stringify(msg), '*');
					        			}));
					        		}
					        		else
					        		{
					        			this.convertImages(this.editor.graph.getSvg(bg), mxUtils.bind(this, function(svgRoot)
					        			{
										this.editor.graph.setEnabled(true);
										this.spinner.stop();
										
										msg.data = this.createSvgDataUri(mxUtils.getXml(svgRoot));
										parent.postMessage(JSON.stringify(msg), '*');
					        			}));
					        		}
								}
					        		
				        		return;
				        	}
				        	else
				        	{
				        		var svg = (data.format == 'xmlsvg') ? this.getEmbeddedSvg(this.getFileData(true),
				        		this.editor.graph, null, true) : mxUtils.getXml(this.editor.graph.getSvg(bg));
				        		msg.data = this.createSvgDataUri(svg);
					        }
						}

						parent.postMessage(JSON.stringify(msg), '*');
					}
					
					return;
				}
				else if (data.action == 'load')
				{
					autosave = data.autosave == 1;
					this.hideDialog();
					
					if (data.modified != null && urlParams['modified'] == null)
					{
						urlParams['modified'] = data.modified;
					}
					
					if (data.saveAndExit != null && urlParams['saveAndExit'] == null)
					{
						urlParams['saveAndExit'] = data.saveAndExit;
					}
					
					if (data.title != null && this.buttonContainer != null)
					{
						var tmp = document.createElement('span');
						mxUtils.write(tmp, data.title);
						
						if (uiTheme == 'atlas')
						{
							this.buttonContainer.style.paddingRight = '12px';
							this.buttonContainer.style.paddingTop = '12px';
						}
						else if (uiTheme != 'min')
						{
							this.buttonContainer.style.paddingRight = '38px';
							this.buttonContainer.style.paddingTop = '6px';
						}

						if (this.embedFilenameSpan != null)
						{
							this.embedFilenameSpan.parentNode.removeChild(this.embedFilenameSpan);
						}

						this.buttonContainer.appendChild(tmp);
						this.embedFilenameSpan = tmp;
					}
					
					if (data.xmlpng != null)
					{
						data = this.extractGraphModelFromPng(data.xmlpng);
					}
					else
					{
						data = data.xml;
					}
				}
				else
				{
					// Unknown message must stop execution
					parent.postMessage(JSON.stringify({error: 'unknownMessage', data: JSON.stringify(data)}), '*');
					
					return;
				}
			}
			
			var doLoad = mxUtils.bind(this, function(data, evt)
			{
				ignoreChange = true;
				try
				{
					fn(data, evt);
				}
				catch (e)
				{
					this.handleError(e);
				}
				ignoreChange = false;
				
				if (urlParams['modified'] != null)
				{
					this.editor.setStatus('');
				}
				
				var getData = mxUtils.bind(this, function()
				{
					return (urlParams['pages'] != '0' || (this.pages != null && this.pages.length > 1)) ?
						this.getFileData(true): mxUtils.getXml(this.editor.getGraphXml());
				});;
				
				lastData = getData();

				if (autosave && changeListener == null)
				{
					changeListener = mxUtils.bind(this, function(sender, eventObject)
					{
						var data = getData();

						if (data != lastData && !ignoreChange)
						{
							var msg = this.createLoadMessage('autosave');
							msg.xml = data;
							data = JSON.stringify(msg);
							
							var parent = window.opener || window.parent;
							parent.postMessage(data, '*');
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
				
				// Sends the bounds of the graph to the host after parsing
				if (urlParams['returnbounds'] == '1' || urlParams['proto'] == 'json')
				{
					parent.postMessage(JSON.stringify(this.createLoadMessage('load')), '*');
				}
			});
			
			if (data != null && data.substring(0, 34) == 'data:application/vnd.visio;base64,')
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
			else if (data != null && !this.isOffline() && new XMLHttpRequest().upload && this.isRemoteFileFormat(data, ''))
			{
				// Asynchronous parsing via server
				this.parseFile(new Blob([data], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
				{
					if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299 &&
						xhr.responseText.substring(0, 13) == '<mxGraphModel')
					{
						doLoad(xhr.responseText, evt);
					}
				}), '');
			}
			else if (data != null && this.isLucidChartData(data))
			{
				this.convertLucidChart(data, mxUtils.bind(this, function(xml)
				{
					doLoad(xml);
				}), mxUtils.bind(this, function(e)
				{
					this.handleError(e);
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
		var parent = window.opener || window.parent;
		var msg = (urlParams['proto'] == 'json') ? JSON.stringify({event: 'init'}) : (urlParams['ready'] || 'ready');
		parent.postMessage(msg, '*');
	};
	
	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.addEmbedButtons = function()
	{
		if (this.menubar != null)
		{
			var div = document.createElement('div');
			div.style.display = 'inline-block';
			div.style.position = 'absolute';
			div.style.paddingTop = (uiTheme == 'atlas') ? '2px' : '3px';
			div.style.paddingLeft = '8px';
			div.style.paddingBottom = '2px';

			var button = document.createElement('button');
			mxUtils.write(button, mxResources.get('save'));
			button.setAttribute('title', mxResources.get('save') + ' (' + Editor.ctrlKey + '+S)');
			button.className = 'geBigButton';
			button.style.fontSize = '12px';
			button.style.padding = '4px 6px 4px 6px';
			button.style.borderRadius = '3px';
			
			mxEvent.addListener(button, 'click', mxUtils.bind(this, function()
			{
				this.actions.get('save').funct();
			}));
			
			div.appendChild(button);
			
			if (urlParams['saveAndExit'] == '1')
			{
				button = document.createElement('a');
				mxUtils.write(button, mxResources.get('saveAndExit'));
				button.setAttribute('title', mxResources.get('saveAndExit'));
				button.style.fontSize = '12px';
				button.style.marginLeft = '6px';
				button.style.padding = '4px';
				button.style.cursor = 'pointer';
				
				mxEvent.addListener(button, 'click', mxUtils.bind(this, function()
				{
					this.actions.get('saveAndExit').funct();
				}));
				
				div.appendChild(button);
			}

			button = document.createElement('a');
			mxUtils.write(button, mxResources.get('exit'));
			button.setAttribute('title', mxResources.get('exit'));
			button.style.fontSize = '12px';
			button.style.marginLeft = '6px';
			button.style.marginRight = '20px';
			button.style.padding = '4px';
			button.style.cursor = 'pointer';
			
			mxEvent.addListener(button, 'click', mxUtils.bind(this, function()
			{
				this.actions.get('exit').funct();
			}));
			
			div.appendChild(button);
			
			this.toolbar.container.appendChild(div);
			this.toolbar.staticElements.push(div);
			div.style.right = (uiTheme != 'atlas') ? '52px' : '42px';
		}
	};

	/**
	 * 
	 */
	EditorUi.prototype.showImportCsvDialog = function()
	{
		if (this.importCsvDialog == null)
		{
			this.importCsvDialog = new TextareaDialog(this, mxResources.get('csv') + ':',
    			Editor.defaultCsvValue, mxUtils.bind(this, function(newValue)
			{
    			this.importCsv(newValue);
			}), null, null, 620, 430, null, true, true, mxResources.get('import'));
		}
		
		this.showDialog(this.importCsvDialog.container, 640, 520, true, true);
		this.importCsvDialog.init();
	};

	/**
	 * TODO: Move to Editor
	 */
	EditorUi.prototype.importCsv = function(text, done)
	{
		try
		{
    		var lines = text.split('\n');
    		var cells = [];
    		
    		if (lines.length > 0)
    		{
        		// Internal lookup table
        		var lookups = {};
        		
        		// Default values
        		var style = null;
        		var parentstyle = null;
        		var identity = null;
        		var parent = null;
        		var namespace = '';
        		var width = 'auto';
        		var height = 'auto';
        		var left = null;
        		var top = null;
        		var edgespacing = 40;
        		var nodespacing = 40;
        		var padding = 0;
        		
        		var graph = this.editor.graph;
				var view = graph.view;
				var bds = graph.getGraphBounds();

				// Delayed after optional layout
    			var afterInsert = function()
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
    			};
    				
    			// Computes unscaled, untranslated graph bounds
    			var pt = graph.getFreeInsertPoint();
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
        			var text = lines[index];
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
		    					label = graph.sanitizeHtml(value);
		    				}
		    				else if (key == 'style')
		    				{
		    					style = value;
		    				}
		    				else if (key == 'parentstyle')
		    				{
		    					parentstyle = value;
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
		    				else if (key == 'layout')
		    				{
		    					layout = value;
		    				}
	    				}
        			}
        		}
        		
    			var keys = this.editor.csvToArray(lines[index]);
    			
    			// Converts name of identity and parent to indexes of column
    			var identityIndex = null;
    			var parentIndex = null;
    			
    			if (identity != null || parent != null)
    			{
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
		    		}
    			}
    			
    			if (label == null)
    			{
    				label = '%' + keys[0] + '%';
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
    			
        		graph.model.beginUpdate();
        		try
        		{
	    			for (var i = index + 1; i < lines.length; i++)
		    		{
    	    			var values = this.editor.csvToArray(lines[i]);
    	    			
	    				if (values.length == keys.length)
		    			{
	    					var cell = null;
	    					var id = (identityIndex != null) ? namespace + values[identityIndex] : null;
	    					
	    					if (id != null)
	    					{
	    						cell = graph.model.getCell(id);
	    					}

	    					if (cell == null)
	    					{
				    			var cell = new mxCell(label, new mxGeometry(x0, y,
				    				0, 0), style || 'whiteSpace=wrap;html=1;');
								cell.vertex = true;
								cell.id = id;
	    					}
	    					
							for (var j = 0; j < values.length; j++)
					    	{
								graph.setAttributeForCell(cell, keys[j], values[j]);
					    	}
							
							graph.setAttributeForCell(cell, 'placeholders', '1');
							cell.style = graph.replacePlaceholders(cell, cell.style);
								
	    					for (var e = 0; e < edges.length; e++)
	    					{
	    						lookups[edges[e].to][cell.getAttribute(edges[e].to)] = cell;
	    					}
							
							if (link != null && link != 'link')
							{
								graph.setLinkForCell(cell, cell.getAttribute(link));
								
								// Removes attribute
								graph.setAttributeForCell(cell, link, null);
							}
	
							// Sets the size
							graph.fireEvent(new mxEventObject('cellsInserted', 'cells', [cell]));
							var size = this.editor.graph.getPreferredSizeForCell(cell);
							
							if (cell.vertex)
							{
								if (left != null && cell.getAttribute(left) != null)
								{
									cell.geometry.x = x0 + parseFloat(cell.getAttribute(left));
								}
	
								if (top != null && cell.getAttribute(top) != null)
								{
									cell.geometry.y = y0 + parseFloat(cell.getAttribute(top));
								}
								
								if (width.charAt(0) == '@' && cell.getAttribute(width.substring(1)) != null)
								{
									cell.geometry.width = parseFloat(cell.getAttribute(width.substring(1)));
								}
								else
								{
									cell.geometry.width = (width == 'auto') ? size.width + padding : parseFloat(width);
								}

								if (height.charAt(0) == '@' && cell.getAttribute(height.substring(1)) != null)
								{
									cell.geometry.height = parseFloat(cell.getAttribute(height.substring(1)));
								}
								else
								{
									cell.geometry.height = (height == 'auto') ? size.height + padding : parseFloat(height);
								}
								
								y += cell.geometry.height + nodespacing;
							}
							
	    					var parent = (parentIndex != null) ? graph.model.getCell(
	    						namespace + values[parentIndex]) : null;
	    					
	    					if (parent != null)
	    					{
	    						parent.style = graph.replacePlaceholders(parent, parentstyle);
	    						graph.addCell(cell, parent);
	    					}
	    					else
	    					{
	    						cells.push(graph.addCell(cell));
	    					}
		    			}
		    		}
	    			
					var roots = cells.slice();
					var select = cells.slice();
	
					for (var e = 0; e < edges.length; e++)
					{
						var edge = edges[e];
	
						for (var i = 0; i < cells.length; i++)
	    				{
							var cell = cells[i];
	
	    					var tmp = cell.getAttribute(edge.from);
	    					
	    					if (tmp != null)
	    					{
	    						// Removes attribute
		    					graph.setAttributeForCell(cell, edge.from, null);
	    						var refs = tmp.split(',');
		    					
		    					for (var j = 0; j < refs.length; j++)
		        				{
		    						var ref = lookups[edge.to][refs[j]];
		    						
		    						if (ref != null)
		    						{
		    							var label = edge.label;
		    							
		    							if (edge.fromlabel != null)
		    							{
		    								label = (cell.getAttribute(edge.fromlabel) || '') + (label || '');
		    							}
		    							
		    							if (edge.tolabel != null)
		    							{
		    								label = (label || '') + (ref.getAttribute(edge.tolabel) || '');
		    							}
		    							
		    							select.push(graph.insertEdge(null, null, label || '',
			    							(edge.invert) ? ref : cell, (edge.invert) ? cell : ref,
							    			edge.style || graph.createCurrentEdgeStyle()));
		    							mxUtils.remove((edge.invert) ? cell : ref, roots);
		    						}
		        				}
	    					}
						}
					}
						
					// Removes ignored attributes after processing above
					if (ignore != null)
					{
						for (var i = 0; i < cells.length; i++)
						{
							var cell = cells[i];
							
							for (var j = 0; j < ignore.length; j++)
					    	{
								graph.setAttributeForCell(cell, mxUtils.trim(ignore[j]), null);
					    	}
						}
					}
					
					var edgeLayout = new mxParallelEdgeLayout(graph);
					edgeLayout.spacing = edgespacing;
			
					var postProcess = function()
					{
						edgeLayout.execute(graph.getDefaultParent());
						
    	    			// Aligns cells to grid and/or rounds positions
						for (var i = 0; i < cells.length; i++)
	    				{
							var geo = graph.getCellGeometry(cells[i]);
							geo.x = Math.round(graph.snap(geo.x));
							geo.y = Math.round(graph.snap(geo.y));
							
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
					
					if (layout == 'circle')
					{
						var circleLayout = new mxCircleLayout(graph);
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
					else if (layout == 'horizontaltree' || layout == 'verticaltree' ||
							(layout == 'auto' && select.length == 2 * cells.length - 1 && roots.length == 1))
	    			{
		    			// Required for layouts to work with new cells
		    			graph.view.validate();
		    			
	    				var treeLayout = new mxCompactTreeLayout(graph, layout == 'horizontaltree');
	    				treeLayout.levelDistance = nodespacing;
	    				treeLayout.edgeRouting = false;
	    				treeLayout.resetEdges = false;
	    				
	    				this.executeLayout(function()
	    	    		{
	    					treeLayout.execute(graph.getDefaultParent(), (roots.length > 0) ? roots[0] : null);
	    	    		}, true, afterInsert);
	    				
	    				afterInsert = null;
	    			}
	    			else if (layout == 'horizontalflow' || layout == 'verticalflow' ||
	    					(layout == 'auto' && roots.length == 1))
	    			{
		    			// Required for layouts to work with new cells
		    			graph.view.validate();
		    			
		    			var flowLayout = new mxHierarchicalLayout(graph,
		    				(layout == 'horizontalflow') ? mxConstants.DIRECTION_WEST : mxConstants.DIRECTION_NORTH);
		    			flowLayout.intraCellSpacing = nodespacing;
		    			flowLayout.disableEdgeStyle = false;
		    			
		        		this.executeLayout(function()
		        		{
		        			flowLayout.execute(graph.getDefaultParent(), select);
		        			
		        			// Workaround for flow layout moving cells to origin
		        			graph.moveCells(select, x0, y0);
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
	    				organicLayout.resetEdges = false;

	    				var organicLayoutIsVertexIgnored = organicLayout.isVertexIgnored;

    	    				// Ignore other cells
	    				organicLayout.isVertexIgnored = function(vertex)
	    				{
	    					return organicLayoutIsVertexIgnored.apply(this, arguments) ||
	    						mxUtils.indexOf(cells, vertex) < 0;
	    				};

	    				var edgeLayout = new mxParallelEdgeLayout(graph);
	    				edgeLayout.spacing = edgespacing;
	    				
	    	    		this.executeLayout(function()
	    	    		{
	    	    			organicLayout.execute(graph.getDefaultParent());
			    			postProcess();
	    	    		}, true, afterInsert);
	    	    		
	    	    		afterInsert = null;
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
	EditorUi.prototype.showLinkDialog = function(value, btnLabel, fn)
	{
		var dlg = new LinkDialog(this, value, btnLabel, fn, true);
		this.showDialog(dlg.container, 480, 130, true, true);
		dlg.init();
	};

	/**
	 * Overrides createOutline
	 */
	var editorUiCreateOutline = EditorUi.prototype.createOutline;

	EditorUi.prototype.createOutline = function(wnd)
	{
		var outline = editorUiCreateOutline.apply(this, arguments);
		var graph = this.editor.graph;

		var outlineGetSourceGraphBounds = outline.getSourceGraphBounds;
		outline.getSourceGraphBounds = function()
		{
			if (mxUtils.hasScrollbars(graph.container) && graph.pageVisible && this.source.minimumGraphSize != null)
			{
				var pb = this.source.getPagePadding();
				var s = this.source.view.scale;
				
				var result = new mxRectangle(0, 0, Math.ceil(this.source.minimumGraphSize.width - 2 * pb.x / s),
						Math.ceil(this.source.minimumGraphSize.height - 2 * pb.y / s));
				
				return result;
			}
			
			return outlineGetSourceGraphBounds.apply(this, arguments);
		};
		
		var outlineGetSourceContainerSize = outline.getSourceContainerSize;
		outline.getSourceContainerSize = function()
		{
			if (mxUtils.hasScrollbars(graph.container) && this.source.minimumGraphSize != null)
			{
				var pad = this.source.getPagePadding();
				var s = this.source.view.scale;
				
				return new mxRectangle(0, 0, Math.ceil(this.source.minimumGraphSize.width * s - 2 * pad.x),
						Math.ceil(this.source.minimumGraphSize.height * s - 2 * pad.y));
			}

			return outlineGetSourceContainerSize.apply(this, arguments);
		};

		outline.getOutlineOffset = function(scale)
		{
			if (mxUtils.hasScrollbars(graph.container) && this.source.minimumGraphSize != null)
			{
				var pb = this.source.getPagePadding();

				var dx = Math.max(0, (outline.outline.container.clientWidth / scale - (this.source.minimumGraphSize.width - 2 * pb.x)) / 2);
				var dy = Math.max(0, (outline.outline.container.clientHeight / scale - (this.source.minimumGraphSize.height - 2 * pb.y)) / 2);

				// Why is vertical offset negative relative to dy
				return new mxPoint(Math.round(dx - pb.x), Math.round(dy - pb.y - 5 / scale));
			}
			
			return new mxPoint(8 / scale, 8 / scale);
		};
		
		var outlineInit = outline.init;
		outline.init = function()
		{
			outlineInit.apply(this, arguments);
			
			// Problem: Need to override a function in the view but the view is created
			// with the graph so a refresh of the page is needed to see this change.
			outline.outline.view.getBackgroundPageBounds = function()
			{
				var layout = graph.getPageLayout();
				var page = graph.getPageSize();
				
				return new mxRectangle(this.scale * (this.translate.x + layout.x * page.width),
						this.scale * (this.translate.y + layout.y * page.height),
						this.scale * layout.width * page.width,
						this.scale * layout.height * page.height);
			};
			
			outline.outline.view.validateBackgroundPage();
		};
		
		this.editor.addListener('pageSelected', function(sender, evt)
		{
			var change = evt.getProperty('change');
			
			var graph = outline.source;
			var g = outline.outline;
			
			g.pageScale = graph.pageScale;
			g.pageFormat = graph.pageFormat;
			g.background = graph.background;
			g.pageVisible = graph.pageVisible;
			g.background = graph.background;
			
			var current = mxUtils.getCurrentStyle(graph.container);
			g.container.style.backgroundColor = current.backgroundColor;
			
			if (graph.view.backgroundPageShape != null && g.view.backgroundPageShape != null)
			{
				g.view.backgroundPageShape.fill = graph.view.backgroundPageShape.fill;
			}

			outline.outline.view.clear(change.previousPage.root, true);
			outline.outline.view.validate();
		});

		return outline;
	};
	
	/**
	 * Returns the number of storage options enabled
	 */
	EditorUi.prototype.getServiceCount = function(allowBrowser, splash)
	{
		var serviceCount = 0;
		
		if (this.drive != null || typeof window.DriveClient === 'function')
		{
			serviceCount++
		}
		
		if (!splash && (this.dropbox != null || typeof window.DropboxClient === 'function'))
		{
			serviceCount++
		}

		if (this.oneDrive != null || typeof window.OneDriveClient === 'function')
		{
			serviceCount++
		}
		
		if (!splash && (this.gitHub != null))
		{
			serviceCount++
		}
		
		if (!splash && (this.trello != null || typeof window.TrelloClient === 'function'))
		{
			serviceCount++
		}
		
		if (allowBrowser && isLocalStorage && (urlParams['browser'] == '1' || mxClient.IS_IOS))
		{
			serviceCount++
		}
		
		if (!mxClient.IS_IOS)
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
		
		var restricted = (urlParams['embed'] != '1' ||
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
		this.actions.get('resetView').setEnabled(active);
	
		// Disables menus
		this.menus.get('edit').setEnabled(active);
		this.menus.get('view').setEnabled(active);
		this.menus.get('importFrom').setEnabled(editable);
		this.menus.get('arrange').setEnabled(editable);
		
		// Disables connection drop downs in toolbar
		if (this.toolbar != null)
		{
			if (this.toolbar.edgeShapeMenu != null)
			{
				this.toolbar.edgeShapeMenu.setEnabled(editable);
			}
			
			if (this.toolbar.edgeStyleMenu != null)
			{
				this.toolbar.edgeStyleMenu.setEnabled(editable);
			}
		}
		
		if (this.isAppCache())
		{
			var appCache = applicationCache;
			
			// NOTE: HTML5 Cache is deprecated
			if (appCache != null && this.offlineStatus == null)
			{
				this.offlineStatus = document.createElement('div');
				this.offlineStatus.className = 'geItem';
				this.offlineStatus.style.position = 'absolute';
				this.offlineStatus.style.fontSize = '8pt';
				this.offlineStatus.style.top = '2px';
				this.offlineStatus.style.right = '12px';
				this.offlineStatus.style.color = '#666';
				this.offlineStatus.style.margin = '4px';
				this.offlineStatus.style.padding = '2px';
				this.offlineStatus.style.verticalAlign = 'middle';
				this.offlineStatus.innerHTML = '';
				
				this.menubarContainer.appendChild(this.offlineStatus);
				
				mxEvent.addListener(this.offlineStatus, 'click', mxUtils.bind(this, function()
				{
					var img = this.offlineStatus.getElementsByTagName('img');
					
					if (img != null && img.length > 0)
					{
						this.alert(img[0].getAttribute('title'));
					}
				}));
				
				var appCache = window.applicationCache;
				var lastStatus = null;
				
				var updateStatus = mxUtils.bind(this, function()
				{
					var newStatus = appCache.status;
					var html = '';
					
					if (newStatus == appCache.CHECKING)
					{
						newStatus = appCache.DOWNLOADING;
					}
					
					switch (newStatus)
					{
						case appCache.UNCACHED: // UNCACHED == 0
							html = '';
							break;
						case appCache.IDLE: // IDLE == 1
							html = (uiTheme == 'min') ? '' : '<img title="draw.io is up to date." border="0" src="' + IMAGE_PATH + '/checkmark.gif"/>';
							break;
						case appCache.DOWNLOADING: // DOWNLOADING == 3
							html = '<img title="Downloading new version..." border="0" src="' + IMAGE_PATH + '/spin.gif"/>';
							break;
						case appCache.UPDATEREADY:  // UPDATEREADY == 4
							html = '<img title="' + mxUtils.htmlEntities(mxResources.get('restartForChangeRequired')) +
					    		'" border="0" src="' + IMAGE_PATH + '/download.png"/>';
							break;
						case appCache.OBSOLETE: // OBSOLETE == 5
							html = '<img title="Obsolete" border="0" src="' + IMAGE_PATH + '/clear.gif"/>';
							break;
						default:
							html = '<img title="Unknown" border="0" src="' + IMAGE_PATH + '/clear.gif"/>';
							break;
					}
					
					if (newStatus != lastStatus)
					{
						this.offlineStatus.innerHTML = html;
						lastStatus = newStatus;
					}
				});

				mxEvent.addListener(appCache, 'checking', updateStatus);
				mxEvent.addListener(appCache, 'noupdate', updateStatus);
				mxEvent.addListener(appCache, 'downloading', updateStatus);
				mxEvent.addListener(appCache, 'progress', updateStatus);
				mxEvent.addListener(appCache, 'cached', updateStatus);
				mxEvent.addListener(appCache, 'updateready', updateStatus);
				mxEvent.addListener(appCache, 'obsolete', updateStatus);
				mxEvent.addListener(appCache, 'error', updateStatus);
				
				updateStatus();
			}
		}
		else
		{
			this.updateUserElement();
		}
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
	EditorUi.prototype.updateUserElement = function()
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
	 * Updates action states depending on the selection.
	 */
	var editorUiUpdateActionStates = EditorUi.prototype.updateActionStates;
	EditorUi.prototype.updateActionStates = function()
	{
		editorUiUpdateActionStates.apply(this, arguments);

		var graph = this.editor.graph;
		var active = this.isDiagramActive();
		var file = this.getCurrentFile();
		var enabled = file != null || urlParams['embed'] == '1';
		this.actions.get('pageSetup').setEnabled(active);
		this.actions.get('autosave').setEnabled(file != null && file.isEditable() && file.isAutosaveOptional());
		this.actions.get('guides').setEnabled(active);
		this.actions.get('editData').setEnabled(active);
		this.actions.get('shadowVisible').setEnabled(active);
		this.actions.get('connectionArrows').setEnabled(active);
		this.actions.get('connectionPoints').setEnabled(active);
		this.actions.get('copyStyle').setEnabled(active && !graph.isSelectionEmpty());
		this.actions.get('pasteStyle').setEnabled(active && !graph.isSelectionEmpty());
		this.actions.get('editGeometry').setEnabled(graph.getModel().isVertex(graph.getSelectionCell()));
		this.actions.get('createShape').setEnabled(active);
		this.actions.get('createRevision').setEnabled(active);
		this.actions.get('moveToFolder').setEnabled(file != null);
		this.actions.get('makeCopy').setEnabled(file != null && !file.isRestricted());
		this.actions.get('editDiagram').setEnabled(active && (file == null || !file.isRestricted()));
		this.actions.get('publishLink').setEnabled(file != null && !file.isRestricted());
		this.actions.get('tags').setEnabled(this.diagramContainer.style.visibility != 'hidden');
		this.actions.get('find').setEnabled(this.diagramContainer.style.visibility != 'hidden');
		this.actions.get('layers').setEnabled(this.diagramContainer.style.visibility != 'hidden');
		this.actions.get('outline').setEnabled(this.diagramContainer.style.visibility != 'hidden');
		this.actions.get('rename').setEnabled((file != null && file.isRenamable()) || urlParams['embed'] == '1');
		this.actions.get('close').setEnabled(file != null);
		this.menus.get('publish').setEnabled(file != null && !file.isRestricted());
		
		var state = graph.view.getState(graph.getSelectionCell());
		this.actions.get('editShape').setEnabled(active && state != null && state.shape != null && state.shape.stencil != null);
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
		
		ExportDialog.exportFile = function(editorUi, name, format, bg, s, b)
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
					editorUi.saveRequest(name, format,
						function(newTitle, base64)
						{
							return new mxXmlRequest(EXPORT_URL, 'format=' + format + '&base64=' + (base64 || '0') +
								((newTitle != null) ? '&filename=' + encodeURIComponent(newTitle) : '') +
								'&bg=' + ((bg != null) ? bg : 'none') + '&w=' + w + '&h=' + h +
								'&border=' + b + '&xml=' + encodeURIComponent(data));
						});
				}
				else
				{
					mxUtils.alert(mxResources.get('drawingTooLarge'));
				}
			}
		};
	}

})();
