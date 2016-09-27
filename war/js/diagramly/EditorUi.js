/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
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
	 * 
	 */
	if (urlParams['dev'] == '1')
	{
		Editor.prototype.editBlankUrl = Editor.prototype.editBlankUrl + '&dev=1';
		Editor.prototype.editBlankFallbackUrl = Editor.prototype.editBlankFallbackUrl + '&dev=1';
	}

	/**
	 * Capability check for canvas export
	 */
	(function()
	{
		EditorUi.prototype.useCanvasForExport = false;
		
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

					// LATER: Fix security error caused by foreignObjects in Safari for toDataUri (tainted canvas)
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
	})();
	
	/**
	 * Initializes math typesetting and loads respective code.
	 */
	Editor.initMath = function(src, config)
	{
		src = (src != null) ? src : 'https://cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-MML-AM_HTMLorMML';
		Editor.mathJaxQueue = [];
		
		Editor.doMathJaxRender = function(container)
		{
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, container]);
		}

		// Disables global typesetting and messages on startup, adds queue for
		// asynchronous rendering while MathJax is loading
		window.MathJax =
		{
			skipStartupTypeset: true,
			showMathMenu: false,
			messageStyle: 'none',
			AuthorInit: function ()
			{
				// Specification recommends using SVG over HTML-CSS if browser is known
				// Check if too inconsistent with image export and print output
				MathJax.Hub.Config(config || {
					jax: ['input/TeX', 'input/MathML', 'input/AsciiMath', 'output/HTML-CSS'],
					extensions: ['tex2jax.js', 'mml2jax.js', 'asciimath2jax.js'],
					TeX: {
					  extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
					},
					// Ignores math in in-place editor
					tex2jax: {
						ignoreClass: 'mxCellEditor'
				  	},
				  	asciimath2jax: {
						ignoreClass: 'mxCellEditor'
				  	}
				});
				MathJax.Hub.Register.StartupHook('Begin', function()
				{
					for (var i = 0; i < Editor.mathJaxQueue.length; i++)
					{
						Editor.doMathJaxRender(Editor.mathJaxQueue[i]);
					}
				});
		    }
		};

		// Adds global enqueue method for async rendering
		Editor.MathJaxRender = function(container)
		{
			// Initial rendering when MathJax finished loading
			if (typeof(MathJax) !== 'undefined' && typeof(MathJax.Hub) !== 'undefined')
			{
				Editor.doMathJaxRender(container);
			}
			else
			{
				Editor.mathJaxQueue.push(container);
			}
		};

		// Adds global clear queue method
		Editor.MathJaxClear = function()
		{
			Editor.mathJaxQueue = [];
		};
		
		// Updates typeset after changes
		var editorInit = Editor.prototype.init;
		
		Editor.prototype.init = function()
		{
			this.graph.addListener(mxEvent.SIZE, mxUtils.bind(this, function(sender, evt)
			{
				if (this.graph.mathEnabled)
				{
					Editor.MathJaxRender(this.graph.container);
				}
			}));
		};
		
		var tags = document.getElementsByTagName('script');
		
		if (tags != null && tags.length > 0)
		{
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = src;
			tags[0].parentNode.appendChild(script);
		}
	};

	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.closeImage = (mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAApVBMVEUAAAD////k5OT///8AAAB1dXXMzMz9/f39/f37+/v5+fn+/v7///9iYmJaWlqFhYWnp6ejo6OHh4f////////////////7+/v5+fnx8fH///8AAAD///8bGxv7+/v5+fkoKCghISFDQ0MYGBjh4eHY2Njb29tQUFBvb29HR0c/Pz82NjYrKyu/v78SEhLu7u7s7OzV1dVVVVU7OzsVFRXAv78QEBBzqehMAAAAG3RSTlMAA/7p/vz5xZlrTiPL/v78+/v7+OXd2TYQDs8L70ZbAAABKUlEQVQoz3VS13LCMBBUXHChd8iukDslQChJ/v/TchaG4cXS+OSb1c7trU7V60OpdRz2ZtNZL4zXNlcN8BEtSG6+NxIXkeRPoBuQ1cjvZ31/VJFB10ISli6diYfH8iYO3WUNCcNlB0gTrXOtkxTo0O1aKKiBBMhhv2MNBQKoiA5wxlZo0JDzD3AYKbWacyj3fs01wxey0pyEP+R8pWKWXoqtIZ0DDg5pbki9krEKOa6LVDQsdoXEsi46Zqh69KFz7B1u7Hb2yDV8firXDKBlZ4UFiswKGRhXTS93/ECK7yxnJ3+S3y/ThpO+cfSD017nqa18aasabU0/t7d+tk0/1oMEJ1NaD67iwdF68OabFSLn+eHb0+vjy+uk8br9fdrftH0O2menfd7+AQfYM/lNjoDHAAAAAElFTkSuQmCC' : IMAGE_PATH + '/delete.png';
	
	/**
	 * Adds a shadow filter to the given svg root.
	 */
	Editor.prototype.addSvgShadow = function(svgRoot, group, createOnly)
	{
		createOnly = (createOnly != null) ? createOnly : false;
		
		var svgDoc = svgRoot.ownerDocument;
		
		var filter = (svgDoc.createElementNS != null) ?
			svgDoc.createElementNS(mxConstants.NS_SVG, 'filter') : svgDoc.createElement('filter');
		filter.setAttribute('id', 'dropShadow');

		var blur = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feGaussianBlur') : svgDoc.createElement('feGaussianBlur');
		blur.setAttribute('in', 'SourceAlpha');
		blur.setAttribute('stdDeviation', '1.7');
		blur.setAttribute('result', 'blur');
		filter.appendChild(blur);
		
		var offset = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feOffset') : svgDoc.createElement('feOffset');
		offset.setAttribute('in', 'blur');
		offset.setAttribute('dx', '3');
		offset.setAttribute('dy', '3');
		offset.setAttribute('result', 'offsetBlur');
		filter.appendChild(offset);
		
		var flood = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feFlood') : svgDoc.createElement('feFlood');
		flood.setAttribute('flood-color', '#3D4574');
		flood.setAttribute('flood-opacity', '0.4');
		flood.setAttribute('result', 'offsetColor');
		filter.appendChild(flood);
		
		var composite = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feComposite') : svgDoc.createElement('feComposite');
		composite.setAttribute('in', 'offsetColor');
		composite.setAttribute('in2', 'offsetBlur');
		composite.setAttribute('operator', 'in');
		composite.setAttribute('result', 'offsetBlur');
		filter.appendChild(composite);

		var feBlend = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feBlend') : svgDoc.createElement('feBlend');
		feBlend.setAttribute('in', 'SourceGraphic');
		feBlend.setAttribute('in2', 'offsetBlur');
		filter.appendChild(feBlend);
		
		// Creates defs element if not available
		var defs = svgRoot.getElementsByTagName('defs');
		var defsElt = null;
		
		if (defs.length == 0)
		{
			defsElt = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'defs') : svgDoc.createElement('defs');
			
			if (svgRoot.firstChild != null)
			{
				svgRoot.insertBefore(defsElt, svgRoot.firstChild);
			}
			else
			{
				svgRoot.appendChild(defsElt);
			}
		}
		else
		{
			defsElt = defs[0];
		}
		
		defsElt.appendChild(filter);
		
		if (!createOnly)
		{
			(group || svgRoot.getElementsByTagName('g')[0]).setAttribute('filter', 'url(#dropShadow)');
			
			if (!isNaN(parseInt(svgRoot.getAttribute('width'))))
			{
				svgRoot.setAttribute('width', parseInt(svgRoot.getAttribute('width')) + 6);
				svgRoot.setAttribute('height', parseInt(svgRoot.getAttribute('height')) + 6);
			}
		}
		
		return filter;
	};

	/**
	 * Math support.
	 */
	Editor.prototype.originalNoForeignObject = mxClient.NO_FO;

	var editorUpdateGraphComponents = Editor.prototype.updateGraphComponents;
	Editor.prototype.updateGraphComponents = function()
	{
		editorUpdateGraphComponents.apply(this, arguments);
		mxClient.NO_FO = (this.graph.mathEnabled && Editor.MathJaxRender != null) ? true : this.originalNoForeignObject;
	};
	
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
		fn();
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
	
	// Helper method to move picket to top
	EditorUi.prototype.movePickersToTop = function()
	{
		var divs = document.getElementsByTagName('div');
		
		for (var i = 0; i < divs.length; i++)
		{
			if (divs[i].className == 'picker modal-dialog picker-dialog')
			{
				divs[i].style.zIndex = mxPopupMenu.prototype.zIndex + 1;
			}
		}
	};
	
	// Overrides to call print asynchronously after (disables immediate print here)
	if (window.PrintDialog)
	{
		var printDialogShowPrintPreview = PrintDialog.showPreview;
		PrintDialog.showPreview = function(preview, print)
		{
			if (typeof(MathJax) !== 'undefined' && preview.graph.mathEnabled)
			{
				print = false;
			}
			
			return printDialogShowPrintPreview.apply(this, arguments);
		};
	
		// Adds MathJax to print preview
		var printDialogCreatePrintPreview = PrintDialog.createPrintPreview;
		PrintDialog.createPrintPreview = function(graph, scale, pf, border, x0, y0, autoOrigin, print)
		{
			var preview = printDialogCreatePrintPreview.apply(this, arguments);
			
			if (typeof(MathJax) !== 'undefined' && graph.mathEnabled)
			{
				// Using writePostfix is workaround for blocking of DOM processing
				// in Chrome if using writeHead for injecting async script tag
				var writePostfix = preview.writePostfix;
				preview.writePostfix = function(doc, css)
				{
					writePostfix.apply(this, arguments);
					
					// Disables status message in print output
					doc.writeln('<script type="text/x-mathjax-config">');
					doc.writeln('MathJax.Hub.Config({');
					doc.writeln('messageStyle: "none",');
					doc.writeln('jax: ["input/TeX", "input/MathML", "input/AsciiMath", "output/HTML-CSS"],');
					doc.writeln('extensions: ["tex2jax.js", "mml2jax.js", "asciimath2jax.js"],');
					doc.writeln('TeX: {');
					doc.writeln('	extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]');
					doc.writeln('}');
					doc.writeln('});');
					
					// Adds asynchronous printing when MathJax finished rendering
					if (print)
					{
						doc.writeln('MathJax.Hub.Queue(function () {');
						doc.writeln('window.print();');
						doc.writeln('});');
					}
					
					doc.writeln('</script>');
					doc.writeln('<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/2.6-latest/MathJax.js"></script>');
				};
			}
	
			return preview;
		};
	}

	/**
	 * Global switches for the export dialog.
	 */
	if (window.ExportDialog)
	{
		ExportDialog.showXmlOption = false;
		ExportDialog.showGifOption = false;
		
		ExportDialog.getExportParameter = function(ui, format)
		{
			return function()
			{
				// LATER Fix decoding of HTML file in backend (remove argument in getFileData)
				return 'xml=' + encodeURIComponent(ui.getFileData(true));
			};
		};
	}

	/**
	 * Specifies the app name. Default is document.title.
	 */
	Editor.prototype.appName = 'draw.io';

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.isOfflineApp = function()
	{
		return (urlParams['offline'] == '1');
	};

	/**
	 * Returns true if this offline app is offline.
	 */
	EditorUi.prototype.isOffline = function()
	{
		// In FF navigator.onLine is always true
		return (mxClient.IS_FF && this.isOfflineApp()) || !navigator.onLine || urlParams['stealth'] == '1';
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
			color: '#000', // #rgb or #rrggbb
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
					mxUtils.setPrefixedStyle(status.style, 'boxShadow', '2px 2px 3px 0px #ddd');
					mxUtils.setPrefixedStyle(status.style, 'transform', 'translate(-50%,-50%)');
					
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
	 * Helper function to extract the graph model XML node.
	 */
	Editor.prototype.extractGraphModel = function(node, allowMxFile)
	{
		if (node != null && typeof(pako) !== 'undefined')
		{
			var tmp = node.ownerDocument.getElementsByTagName('div');
			var divs = [];
			
			if (tmp != null && tmp.length > 0)
			{
				for (var i = 0; i < tmp.length; i++)
				{
					if (tmp[i].getAttribute('class') == 'mxgraph')
					{
						divs.push(tmp[i]);
						break;
					}	
				}
			}
			
			if (divs.length > 0)
			{
				var data = divs[0].getAttribute('data-mxgraph');

				if (data != null)
				{
					var config = JSON.parse(data);

					if (config != null && config.xml != null)
					{
						var doc2 = mxUtils.parseXml(config.xml);
						node = doc2.documentElement;
					}
				}
				else
				{
					var divs2 = divs[0].getElementsByTagName('div');
					
					if (divs2.length > 0)
					{
						var data = mxUtils.getTextContent(divs2[0]);
		        		data = this.graph.decompress(data);
		        		
		        		if (data.length > 0)
		        		{
		        			var doc2 = mxUtils.parseXml(data);
		        			node = doc2.documentElement;
		        		}
					}
				}
			}
		}
		
		if (node != null && node.nodeName == 'svg')
		{
			var tmp = node.getAttribute('content');
			
			if (tmp != null && tmp.charAt(0) != '<' && tmp.charAt(0) != '%')
			{
				tmp = unescape((window.atob) ? atob(tmp) : Base64.decode(cont, tmp));
			}
			
			if (tmp != null && tmp.charAt(0) == '%')
			{
				tmp = decodeURIComponent(tmp);
			}
			
			if (tmp != null && tmp.length > 0)
			{
				node = mxUtils.parseXml(tmp).documentElement;
			}
			else
			{
				throw {message: mxResources.get('notADiagramFile')};
			}
		}
		
		if (node != null && !allowMxFile)
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
					diagramNode = diagrams[Math.max(0, Math.min(diagrams.length - 1, urlParams['page'] || 0))];
				}
			}
			
			if (diagramNode != null)
			{
				node = mxUtils.parseXml(this.graph.decompress(mxUtils.getTextContent(diagramNode))).documentElement;
			}
		}
		
		if (node != null && node.nodeName != 'mxGraphModel' && (!allowMxFile || node.nodeName != 'mxfile'))
		{
			node = null;
		}
		
		return node;
	};
	
	/**
	 * Returns true if the given string contains a compatible graph model.
	 */
	EditorUi.prototype.isCompatibleString = function(data)
	{
		try
		{
			var doc = mxUtils.parseXml(data);
			var node = this.editor.extractGraphModel(doc.documentElement);
			
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
					var node = this.editor.extractGraphModel(doc.documentElement);
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
		
				if (nodes.length > 1 || urlParams['pages'] == '1')
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
					if (urlParams['pages'] == '1' && this.fileNode == null)
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
			
			if (nodes.length > 1 || urlParams['pages'] == '1')
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
		if (urlParams['pages'] == '1' && this.fileNode == null)
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
	 * Adds support for old stylesheets and compressed files
	 */
	var editorSetGraphXml = Editor.prototype.setGraphXml;
	Editor.prototype.setGraphXml = function(node)
	{
		node = (node != null && node.nodeName != 'mxlibrary') ? this.extractGraphModel(node) : null;

		if (node != null)
		{
			// Checks input for parser errors
			var errs = node.getElementsByTagName('parsererror');
			
			if (errs != null && errs.length > 0)
			{
				var elt = errs[0];
				var divs = elt.getElementsByTagName('div');
				
				if (divs != null && divs.length > 0)
				{
					elt = divs[0];
				}
				
				throw {message: mxUtils.getTextContent(elt)};
			}
			else if (node.nodeName == 'mxGraphModel')
			{
				var style = node.getAttribute('style') || 'default-style2';
				
				// Decodes the style if required
				if (urlParams['embed'] != '1' && (style == null || style == ''))
				{
					var node2 = (this.graph.themes != null) ?
						this.graph.themes['default-old'] :
						mxUtils.load(STYLE_PATH + '/default-old.xml').getDocumentElement();
				    
				    if (node2 != null)
				    {
				    	var dec2 = new mxCodec(node2.ownerDocument);
				    	dec2.decode(node2, this.graph.getStylesheet());
				    }
				}
				else if (style != this.graph.currentStyle)
				{
				    var node2 = (this.graph.themes != null) ?
						this.graph.themes[style] :
						mxUtils.load(STYLE_PATH + '/' + style + '.xml').getDocumentElement()
				    
				    if (node2 != null)
				    {
				    	var dec2 = new mxCodec(node2.ownerDocument);
				    	dec2.decode(node2, this.graph.getStylesheet());
				    }
				}
	
				this.graph.currentStyle = style;
				this.graph.mathEnabled = (urlParams['math'] == '1' || node.getAttribute('math') == '1');
				
				var bgImg = node.getAttribute('backgroundImage');
				
				if (bgImg != null)
				{
					bgImg = JSON.parse(bgImg);
					this.graph.setBackgroundImage(new mxImage(bgImg.src, bgImg.width, bgImg.height));
				}
				else
				{
					this.graph.setBackgroundImage(null);
				}
				
				mxClient.NO_FO = (this.graph.mathEnabled) ? true : this.originalNoForeignObject;
				this.graph.setShadowVisible(node.getAttribute('shadow') == '1', false);
			}
	
			// Calls updateGraphComponents
			editorSetGraphXml.apply(this, arguments);
		}
		else
		{
			throw { 
			    message: mxResources.get('notADiagramFile') || 'Invalid data',
			    toString: function() { return this.message; }
			};
		}
	};

	/**
	 * Adds persistent style to file
	 */
	var editorGetGraphXml = Editor.prototype.getGraphXml;	
	Editor.prototype.getGraphXml = function(ignoreSelection)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		var node = editorGetGraphXml.apply(this, arguments);
		
		// Adds the current style
		if (this.graph.currentStyle != null && this.graph.currentStyle != 'default-style2')
		{
			node.setAttribute('style', this.graph.currentStyle);
		}
		
		// Adds the background image
		if (this.graph.backgroundImage != null)
		{
			node.setAttribute('backgroundImage', JSON.stringify(this.graph.backgroundImage));
		}
		
		node.setAttribute('math', (this.graph.mathEnabled) ? '1' : '0');
		node.setAttribute('shadow', (this.graph.shadowVisible) ? '1' : '0');
		
		return node;
	};
	
	var editorResetGraph = Editor.prototype.resetGraph;	
	Editor.prototype.resetGraph = function()
	{
		this.graph.mathEnabled = (urlParams['math'] == '1');
		this.graph.view.x0 = null;
		this.graph.view.y0 = null;
		mxClient.NO_FO = (this.graph.mathEnabled) ? true : this.originalNoForeignObject;
		editorResetGraph.apply(this, arguments);
	};

	/**
	 * EditorUi Overrides
	 */
    if (urlParams['offline'] == '1')
    {
		EditorUi.prototype.footerHeight = 4;
    }
    else
    {
    	if (uiTheme == 'atlas')
    	{
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
    	else
    	{
    		if (urlParams['savesidebar'] == '1')
    		{
        		Sidebar.prototype.thumbWidth = 64;
        		Sidebar.prototype.thumbHeight = 64;
    		}
    	}

		EditorUi.prototype.footerHeight = (screen.height <= 740) ? 5 : 46;
		
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
	 * Overrides image dialog to add image search and Google+.
	 */
    EditorUi.prototype.showImageDialog = function(title, value, fn, ignoreExisting, convertDataUri)
	{
		// KNOWN: IE+FF don't return keyboard focus after image dialog (calling focus doesn't help)
    	var dlg = new ImageDialog(this, title, value, fn, ignoreExisting, convertDataUri);
		this.showDialog(dlg.container, (Graph.fileSupport) ? 420 : 340, (Graph.fileSupport) ? 200 : 90, true, true);
		dlg.init();
	};

	/**
	 * Hides the current menu.
	 */
	EditorUi.prototype.showBackgroundImageDialog = function(apply)
	{
		apply = (apply != null) ? apply : mxUtils.bind(this, function(image)
		{
			this.setBackgroundImage(image);
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
		
		this.showDialog(dlg.container, 620, 440, true, true, mxUtils.bind(this, function(cancel)
		{
			if (cancel && this.getCurrentFile() == null)
			{
				this.showSplash();
			}
		}));
		
		dlg.init();
	};

	/**
	 * Allows for two buttons in the sidebar footer.
	 */
	EditorUi.prototype.sidebarFooterHeight = (uiTheme == 'atlas') ? 36 : 36;

	/**
	 * Specifies the default custom shape style.
	 */
	EditorUi.prototype.defaultCustomShapeStyle = 'shape=stencil(tZRtTsQgEEBPw1+DJR7AoN6DbWftpAgE0Ortd/jYRGq72R+YNE2YgTePloEJGWblgA18ZuKFDcMj5/Sm8boZq+BgjCX4pTyqk6ZlKROitwusOMXKQDODx5iy4pXxZ5qTHiFHawxB0JrQZH7lCabQ0Fr+XWC1/E8zcsT/gAi+Subo2/3Mh6d/oJb5nU1b5tW7r2knautaa3T+U32o7f7vZwpJkaNDLORJjcu7t59m2jXxqX9un+tt022acsfmoKaQZ+vhhswZtS6Ne/ThQGt0IV0N3Yyv6P3CeT9/tHO0XFI5cAE=);whiteSpace=wrap;html=1;';
	
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
	 * Setting the current file.
	 */

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
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.isDiagramEmpty = function()
	{
		var model = this.editor.graph.getModel();
		
		return model.getChildCount(model.root) == 1 && model.getChildCount(model.getChildAt(model.root, 0)) == 0;
	};
	
	/**
	 * Handling for canvas export.
	 */

	/**
	 * 
	 */
	EditorUi.prototype.isExportToCanvas = function()
	{
		// LATER: Fix security error caused by foreignObjects in Safari for toDataUri (tainted canvas)
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
	EditorUi.prototype.createPngDataUri = function(canvas, xml)
	{
   	    var data = canvas.toDataURL('image/png');
   	    
   	    // Checks if output is invalid or empty
   	    if (data.length <= 6 || data == canvas.cloneNode(false).toDataURL('image/png'))
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
	EditorUi.prototype.saveCanvas = function(canvas, xml)
	{
   		var file = this.getCurrentFile();
   	    var filename = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
   	    var dot = filename.lastIndexOf('.');
   	    
   	    if (dot > 0)
   	    {
   	    	filename = filename.substring(0, dot);
   	    }
   	    
   	    filename += '.png';
   	    var data = this.createPngDataUri(canvas, xml);
   	    
   	    this.saveLocalFile(data.substring(data.lastIndexOf(',') + 1), filename, 'image/png', true);
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.showRemoteExportDialog = function(btnLabel, helpLink, callback)
	{
		var graph = this.editor.graph;
		var content = document.createElement('div');
		content.style.padding = '6px';
		
		var cb2 = document.createElement('input');
		cb2.style.marginRight = '8px';
		cb2.setAttribute('type', 'checkbox');
		
		if (graph.isSelectionEmpty())
		{
			cb2.setAttribute('disabled', 'disabled');
		}
		
		content.appendChild(cb2);
		mxUtils.write(content, mxResources.get('selectionOnly'));
		mxUtils.br(content);
		
		var cb = document.createElement('input');
		cb.setAttribute('type', 'checkbox');
		cb.setAttribute('checked', 'checked');
		cb.defaultChecked = true;
		cb.style.marginRight = '8px';
		cb.style.marginTop = '16px';
		
		content.appendChild(cb);
		mxUtils.write(content, mxResources.get('includeCopyOfMyDiagram'));
		
		var dlg = new CustomDialog(this, content, mxUtils.bind(this, function()
		{
			callback(!cb2.checked, cb.checked);
		}), null, btnLabel, helpLink);
		this.showDialog(dlg.container, 300, 120, true, true);
	}
	
	/**
	 * 
	 */
	EditorUi.prototype.showExportDialog = function(embedOption, btnLabel, helpLink, callback)
	{
		var graph = this.editor.graph;
		var content = document.createElement('div');
		content.style.paddingTop = '20px';
		content.style.paddingRight = '8px';
		
		var cb = document.createElement('input');
		cb.style.marginRight = '8px';
		cb.setAttribute('type', 'checkbox');
		
		if (graph.background == mxConstants.NONE || graph.background == null)
		{
			cb.setAttribute('checked', 'checked');
			cb.defaultChecked = true;
		}
		
		content.appendChild(cb);
		mxUtils.write(content, mxResources.get('transparentBackground'));
		mxUtils.br(content);
		
		var cb2 = document.createElement('input');
		cb2.style.marginTop = '16px';
		cb2.style.marginRight = '8px';
		cb2.setAttribute('type', 'checkbox');
		
		if (graph.isSelectionEmpty())
		{
			cb2.setAttribute('disabled', 'disabled');
		}
		
		content.appendChild(cb2);
		mxUtils.write(content, mxResources.get('selectionOnly'));
		mxUtils.br(content);
		
		var cb3 = document.createElement('input');
		cb3.style.marginTop = '16px';
		cb3.style.marginRight = '8px';
		cb3.setAttribute('type', 'checkbox');
		
		content.appendChild(cb3);
		mxUtils.write(content, mxResources.get('shadow'));
		mxUtils.br(content);
		
		if (graph.shadowVisible)
		{
			cb3.setAttribute('checked', 'checked');
			cb3.defaultChecked = true;
		}
		
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
			content.appendChild(cb5);
			mxUtils.write(content, mxResources.get('embedImages'));
			mxUtils.br(content);
		}
		
		var cb4 = document.createElement('input');
		cb4.style.marginTop = '16px';
		cb4.style.marginRight = '8px';
		cb4.setAttribute('type', 'checkbox');
		cb4.style.marginBottom = '8px';
		cb4.setAttribute('checked', 'checked');
		cb4.defaultChecked = true;
		
		content.appendChild(cb4);
		mxUtils.write(content, mxResources.get('includeCopyOfMyDiagram'));
		
		var dlg = new FilenameDialog(this, 100, btnLabel, mxUtils.bind(this, function(newValue)
		{
		   	callback(newValue, cb.checked, !cb2.checked, cb3.checked, cb4.checked, cb5.checked);
		}), mxResources.get('zoom') + ' (%)', null, content, (!this.isOffline()) ? helpLink : null);
		
		this.showDialog(dlg.container, 320, (embedOption) ? 266 : 240, true, true);
		dlg.init();
	}
		
	/**
	 * 
	 */
	EditorUi.prototype.uploadToGithub = function(file, base64Data, editable)
	{
		var resume = this.spinner.pause();
		
		var content = document.createElement('div');
		content.style.paddingTop = '20px';
		content.style.paddingRight = '8px';
		
		var table = document.createElement('table');
		var tbody = document.createElement('tbody');
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		
		var uname = document.createElement('input');
		uname.setAttribute('type', 'text');
		mxUtils.write(td, 'Username:');
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(uname);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		var pword = document.createElement('input');
		pword.setAttribute('type', 'password');
		mxUtils.write(td, 'Password:');
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(pword);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		var org = document.createElement('input');
		org.setAttribute('type', 'text');
		mxUtils.write(td, 'Organisation:');
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(org);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		var repo = document.createElement('input');
		repo.setAttribute('type', 'text');
		mxUtils.write(td, 'Repository:');

		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(repo);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);

		var path = document.createElement('input');
		path.setAttribute('type', 'text');
		mxUtils.write(td, 'Path:');
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(path);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		var file = this.getCurrentFile();
		var filename = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		var dot = filename.lastIndexOf('.');
		
		if (dot > 0)
		{
			filename = filename.substring(0, dot);
		}
		
		path.value = filename + '.png';

		var ref = document.createElement('input');
		ref.setAttribute('type', 'text');
		mxUtils.write(td, 'Branch/Tag:');
		ref.value = 'master';
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(ref);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);

		var msg = document.createElement('input');
		msg.setAttribute('type', 'text');
		mxUtils.write(td, 'Message:');
		msg.value = 'Updated ' + filename + '.png';
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(msg);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		table.appendChild(tbody);
		content.appendChild(table);
		
		var dlg = new FilenameDialog(this, null, mxResources.get('publish'), mxUtils.bind(this, function()
		{
			var url = 'https://api.github.com/repos/' + org.value + '/' + repo.value +
				'/contents/' + path.value + '?ref=' + encodeURIComponent(ref.value);
			resume();
			
			mxUtils.get(url, mxUtils.bind(this, function(req)
			{
				if (req.getStatus() == 200 || req.getStatus() == 404)
				{
					var obj = JSON.parse(req.getText());
					var entity =
					{
						path: path.value,
						message: msg.value,
						content: base64Data
					};			
					
					if (obj.sha != null)
					{
						entity.sha = obj.sha;
					}
					
					// Native PUT request
					var req2 = new XMLHttpRequest();
					req2.onreadystatechange = mxUtils.bind(this, function()
					{
						if (req2.readyState == 4)
						{
							if (req2.status >= 200 && req2.status < 300)
							{
								this.spinner.stop();
								this.hideDialog();
								
								url = 'https://github.com/' + org.value + '/' + repo.value + '/blob/' + ref.value + '/' + path.value;
								var dlg = new ErrorDialog(this, mxResources.get('published'),
									mxResources.get('publishedAt', ['<a href="' + url + '" target="_blank">' + url + '</a>']),
									mxResources.get('close'), mxUtils.bind(this, function()
									{
										this.hideDialog();
									}), null,
									mxResources.get('openInNewWindow'), mxUtils.bind(this, function()
									{
										window.open(url);
									}), false);
								this.showDialog(dlg.container, 340, 170, true, false);
								dlg.init();
							}
							else
							{
								resume = this.spinner.pause();
								this.handleError(JSON.parse(req2.responseText));
							}
						}
					});
					
					req2.open('PUT', url, true);
					req2.setRequestHeader('Authorization', 'Basic ' +
						btoa(uname.value + ':' + pword.value));
					req2.send(JSON.stringify(entity));
				}
				else
				{
					this.hideDialog();
					this.spinner.stop();
					this.handleError(JSON.parse(req.getText()));
				}
			}), mxUtils.bind(this, function(req)
			{
				this.hideDialog();
				this.spinner.stop();
				this.handleError({message: mxResources.get('unknownError')});
			}));
		}), null, null, content, null, false);
		
		this.showDialog(dlg.container, 260, 260, true, false);
		dlg.init();
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.uploadToImgur = function(file, base64Data, editable, socialHandler)
	{
		var resume = this.spinner.pause();
		
		// Shows a warning dialog before uploading
		var dlg = new ErrorDialog(this, mxResources.get('warning'),
			'<img style="max-width:300px;max-height:80px;margin-bottom:20px;padding:6px;border:1px solid gray;" ' +
			'src="data:image/png;base64,' + base64Data + '"/><br>' +
			mxResources.get('publishConfirmation'),
			mxResources.get('cancel'), mxUtils.bind(this, function()
			{
				// Do nothing
			}), null,
			mxResources.get('publish'), mxUtils.bind(this, function()
			{
				resume();
				
				var title = (file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		   	    var dot = title.lastIndexOf('.');
		   	    var filename = title;
		   	    
		   	    if (dot > 0)
		   	    {
		   	    	title = filename.substring(0, dot);
		   	    	filename = title;
		   	    }
		   	    
		   	    filename += '.png';
				
				// Indirection via servlet for billing and hiding secrets
				var req = new mxXmlRequest('/imgur', JSON.stringify({type: 'base64', image: base64Data,
					name: filename, title: title, description: 'Made with https://www.draw.io'}), 'POST');
				
				var extractAndHandleError = mxUtils.bind(this, function(req)
				{
					var e = {message: mxResources.get('unknownError')};
					
					try
					{
						var res = JSON.parse(req.getText());
						e = {message: res.message || res.data.error};
					}
					catch (err)
					{
						// ignore
					}
					
					this.handleError(e);
				});
				
				// First request to upload image to Imgur
				req.send(mxUtils.bind(this, function(req)
				{
					if (req.getStatus() == 200)
					{
						try
						{
							var res = JSON.parse(req.getText());

					    	// Logs publishing of diagrams
					    	try
					    	{
								var img = new Image();
								
								// Timestamp is added to bypass client-side cache
								img.src = 'log?severity=CONFIG&msg=imgur-published:' + res.data.id + '&v=' +
									encodeURIComponent(EditorUi.VERSION) + '&ts=' + new Date().getTime();
					    	}
					    	catch (e)
					    	{
					    		// ignore
					    	}
							
							var showResult = mxUtils.bind(this, function()
							{
								this.spinner.stop();
								var url = 'http://i.imgur.com/' + res.data.id + '.png';
								var deleteUrl = 'https://www.draw.io/imgur?delete=' + res.data.deletehash;
								
								var dlg = new ErrorDialog(this, mxResources.get('published'),
									mxResources.get('publishedAt', ['<a href="' + url + '" target="_blank">' + url + '</a>']) +
									'<br>' + mxResources.get('deleteUrl', [deleteUrl]),
									mxResources.get('close'), mxUtils.bind(this, function()
									{
										this.hideDialog();
									}), null, mxResources.get('share'), function()
									{
										socialHandler(res.data.id);
									}, false);
								this.showDialog(dlg.container, 340, 170, true, false);
								dlg.init();
							});
							
							if (!editable)
							{
								showResult();
							}
							else
							{
								// Second request to update the description with the edit link
								// Replacing the .png is workaround for Imgur to handle it as an image
								// Avoiding URL parameter avoids call to getParameter in the servlet
								var url2 = '/imgur?' + res.data.deletehash;
								var req2 = new mxXmlRequest(url2, JSON.stringify({
									title: title, description: 'Edit a copy of this diagram at https://www.draw.io/i/' + res.data.id}), 'POST');
				
								req2.send(mxUtils.bind(this, function()
								{
									if (req2.getStatus() == 200)
									{
										showResult();
									}
									else
									{
										extractAndHandleError(req2);
									}
								}), mxUtils.bind(this, function()
								{
									extractAndHandleError(req2);
								}));
							}
						}
						catch (e)
						{
							this.handleError(e);
						}
					}
					else
					{
						extractAndHandleError(req);
					}
				}), mxUtils.bind(this, function(req)
				{
					extractAndHandleError(req);
				}));
			}));
		this.showDialog(dlg.container, 320, 250, true, false);
		dlg.init();
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.publishImage = function(handler, socialHandler)
	{
	   	var file = this.getCurrentFile();
	   	
	   	if (file != null)
	   	{
			if (this.isExportToCanvas())
			{
				this.showExportDialog(false, mxResources.get('publish'), 'https://support.draw.io/pages/viewpage.action?pageId=12222625', mxUtils.bind(this, function(scale, transparentBackground, ignoreSelection, addShadow, editable)
				{
					var val = parseInt(scale);
					
					if (!isNaN(val) && val > 0)
					{
						var scale = val / 100;
						var selectionEmpty = this.editor.graph.isSelectionEmpty();
						ignoreSelection = (ignoreSelection != null) ? ignoreSelection : selectionEmpty;
		
					   	if (this.spinner.spin(document.body, mxResources.get('publishing')))
						{
							try
							{
							   	this.exportToCanvas(mxUtils.bind(this, function(canvas)
							   	{
							   		try
							   		{
							   			var xml = (editable) ? mxUtils.getXml(this.editor.getGraphXml(ignoreSelection)) : null;
							   			var data = this.createPngDataUri(canvas, xml);
							   	   	    handler(file, data.substring(data.lastIndexOf(',') + 1), editable, socialHandler);
							   		}
							   		catch (e)
							   		{
							   			this.handleError(e);
							   		}
							   	}), null, null, null, mxUtils.bind(this, function(e)
							   	{
							   		this.handleError(e);
							   	}), null, ignoreSelection, scale || 1, transparentBackground, addShadow);
							}
							catch (e)
							{
								this.handleError(e);
							}
						}
					}
				}));
			}
			else
			{
				this.showRemoteExportDialog(mxResources.get('publish'), 'https://support.draw.io/pages/viewpage.action?pageId=12222625', mxUtils.bind(this, function(ignoreSelection, editable)
				{
					if (this.spinner.spin(document.body, mxResources.get('publishing')))
					{
						var bounds = this.editor.graph.getGraphBounds();
						var data = this.getFileData(true, null, null, null, ignoreSelection);
						
						if (bounds.width * bounds.height <= MAX_AREA && data.length <= MAX_REQUEST_SIZE)
						{
							var embed = (editable) ? '1' : '0';
					       	
							try
							{
								var req = new mxXmlRequest(EXPORT_URL, 'format=png' +
									'&base64=1&embedXml=' + embed + '&xml=' +
									encodeURIComponent(data));
								
								req.send(mxUtils.bind(this, function()
								{
									if (req.getStatus() == 200)
									{
										handler(file, req.getText(), editable, socialHandler);
									}
									else
									{
										this.handleError(req);
									}
								}));
							}
							catch (e)
							{
								this.handleError(e);
							}
						}
						else
						{
							this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'));
						}
					}
				}));
			}
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
		// FIXME: Only horizontal dash in output so better no conversion at all
		if (false && graph.mathEnabled && typeof(MathJax) !== 'undefined' && typeof(MathJax.Hub) !== 'undefined')
		{
			// Workaround for lost gradients in Chrome after remove from DOM
			var elts = svgRoot.getElementsByTagName('*');
			
			for (var i = 0; i < elts.length; i++)
			{
				if (elts[i].getAttribute('id') != null)
				{
					elts[i].setAttribute('id', 'mxTemporaryPrefix-' + elts[i].getAttribute('id'));
				}
			}

			// Temporarily attaches to DOM for rendering
			svgRoot.style.visibility = 'hidden';
			document.body.appendChild(svgRoot);
			Editor.MathJaxRender(svgRoot);
			
			MathJax.Hub.Queue(mxUtils.bind(this, function ()
			{
				// Removes from DOM
				svgRoot.parentNode.removeChild(svgRoot);
				svgRoot.style.visibility = '';
				
				// Restores original IDs
				for (var i = 0; i < elts.length; i++)
				{
					if (elts[i].getAttribute('id') != null)
					{
						elts[i].setAttribute('id', elts[i].getAttribute('id').substring('mxTemporaryPrefix-'.length));
					}
				}
				
				// Keeping scale but moving translate only works for image export which
				// is fine since we do not want the SVG export to contain a workaround.
				// See https://github.com/mathjax/MathJax/issues/279
				if (fixPosition && navigator.userAgent.indexOf('AppleWebKit/') >= 0)
				{
					var fo = svgRoot.getElementsByTagName('foreignObject');
					
					for (var i = 0; i < fo.length; i++)
					{
						var tr = fo[i].parentNode.parentNode.getAttribute('transform');
						var translate  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(tr);
					
						fo[i].setAttribute('x', Math.round(translate[1]));
						fo[i].setAttribute('y', Math.round(translate[2]));
						
						// Must use translate for crisp rendering
						fo[i].parentNode.parentNode.setAttribute('transform', 'translate(0.5,0.5)' + tr.substring(tr.indexOf(')') + 1));
					}
				}
				
				callback();
			}));
		}
		else
		{
			callback();
		}
	};
	
	/**
	 * Returns the SVG of the diagram with embedded XML. If a callback function is
	 * used, the images are converted to data URIs.
	 */
	EditorUi.prototype.getEmbeddedSvg = function(xml, graph, url, noHeader, callback, ignoreSelection, redirect)
	{
		var bg = null;
		
		if (graph != null)
		{
			bg = graph.background;
			
			if (bg == mxConstants.NONE)
			{
				bg = null;
			}
		}

		// Sets or disables alternate text for foreignObjects. Disabling is needed
		// because PhantomJS seems to ignore switch statements and paint all text.
		var svgRoot = this.editor.graph.getSvg(bg, null, null, null, null, ignoreSelection);	
		svgRoot.setAttribute('content', encodeURIComponent(xml));
		
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
	EditorUi.prototype.exportToCanvas = function(callback, width, imageCache, background, error, limitHeight,
		ignoreSelection, scale, transparentBackground, addShadow, converter)
	{
		limitHeight = (limitHeight != null) ? limitHeight : true;
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		var bg = (transparentBackground) ? null : this.editor.graph.background;
		
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
			bg = '#ffffff';
		}
		
		this.convertImages(this.editor.graph.getSvg(bg, null, null, null, null, ignoreSelection), mxUtils.bind(this, function(svgRoot)
		{
			var img = new Image();
			
			img.onload = mxUtils.bind(this, function()
			{
				var canvas = document.createElement('canvas');
				var w = parseInt(svgRoot.getAttribute('width'));
				var h = parseInt(svgRoot.getAttribute('height'));
				scale = (scale != null) ? scale : 1;
				
				if (width != null)
				{
					scale = (!limitHeight) ? width / w : Math.min(1, Math.min((width * 3) / (h * 4), width / w));
				}
				
		   		canvas.setAttribute('width', Math.ceil(scale * w));
		   		canvas.setAttribute('height', Math.ceil(scale * h));
		   		var ctx = canvas.getContext('2d');
		   		ctx.scale(scale, scale);
				ctx.drawImage(img, 0, 0);
				callback(canvas);
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
					this.editor.addSvgShadow(svgRoot);
				}
				
				this.convertMath(this.editor.graph, svgRoot, true, mxUtils.bind(this, function()
				{
					img.src = this.createSvgDataUri(mxUtils.getXml(svgRoot));
				}));
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

		// Extends convert to avoid CORS using an image proxy server
		// LATER: Use img.crossOrigin="anonymous" to avoid proxy
		var convert = converter.convert;
		
		converter.convert = function(src)
		{
			if (src != null)
			{
				if ((src.substring(0, 7) == 'http://' || src.substring(0, 8) == 'https://') &&
					src.substring(0, converter.baseUrl.length) != converter.baseUrl)
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
				callback();
			});
		}
		else
		{
		    var img = new Image();
		    
		    img.onload = function()
		    {
		        var canvas = document.createElement('canvas');
		        var ctx = canvas.getContext('2d');
		        canvas.height = img.height;
		        canvas.width = img.width;
		        ctx.drawImage(img, 0, 0);
		        callback(canvas.toDataURL());
		    };
		    
		    img.onerror = function()
		    {
		    	callback();
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
			if (xml != null && xml.length > 0)
			{
				var doc = mxUtils.parseXml(xml);
				var node = this.editor.extractGraphModel(doc.documentElement);
				
				if (node != null)
				{
					var model = new mxGraphModel();
					var codec = new mxCodec(node.ownerDocument);
					codec.decode(node, model);
					
					var graph = this.editor.graph;
					var childCount = model.getChildCount(model.getRoot());
					var targetChildCount = graph.model.getChildCount(graph.model.getRoot());
					
					// Merges into active layer if one layer is pasted
					graph.model.beginUpdate();
					try
					{
						// Mapping for multiple calls to cloneCells with the same set of cells
						var mapping = new Object();
						
						for (var i = 0; i < childCount; i++)
						{
							var parent = model.getChildAt(model.getRoot(), i);
							
							// Adds cells to existing layer if not locked
							if (childCount == 1 && !graph.isCellLocked(graph.getDefaultParent()))
							{
								var children = model.getChildren(parent);
								cells = cells.concat(graph.importCells(children, dx, dy, graph.getDefaultParent(), null, mapping));
							}
							else
							{
								// Delta is non cascading, needs separate move for layers
								parent = graph.importCells([parent], 0, 0, graph.model.getRoot(), null, mapping)[0];
								var children = graph.model.getChildren(parent);
								graph.moveCells(children, dx, dy);
								cells = cells.concat(children);
							}
						}
						
						if (crop)
						{
							if (graph.isGridEnabled())
							{
								dx = graph.snap(dx);
								dy = graph.snap(dy);
							}
							
							var bounds = graph.getBoundingBoxFromGeometry(cells, true);
							
							if (bounds != null)
							{
								graph.moveCells(cells, dx - bounds.x, dy - bounds.y);
							}
						}
					}
					finally
					{
						graph.model.endUpdate();
					}
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
	 * Imports the given XML into the existing diagram.
	 * TODO: Make this function asynchronous
	 */
	EditorUi.prototype.insertTextAt = function(text, dx, dy, html, asImage, crop)
	{
		crop = (crop != null) ? crop : true;
		
		// Handles special case for Gliffy data which requires async server-side for parsing
		if (text != null)
		{
			if (Graph.fileSupport && !this.isOffline() && new XMLHttpRequest().upload && this.isRemoteFileFormat(text))
			{
				// Fixes possible parsing problems with ASCII 160 (non-breaking space)
				this.parseFile(new Blob([text.replace(/\s+/g,' ')], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
				{
					if (xhr.readyState == 4 && xhr.status == 200)
					{
						this.editor.graph.setSelectionCells(this.insertTextAt(xhr.responseText, dx, dy, true));
					}
				}));
				
				// Returns empty cells array as it is aysynchronous
				return [];
			}
			// Handles special case of data URI which requires async loading for finding size
			else if (!this.isOffline() && (asImage || text.substring(0, 5) == 'data:' || (/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(text)))
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
									'verticalAlign=top;aspect=fixed;image=' + this.convertDataUri(data2) + ';'));
	    				}), true, this.maxImageSize);
					}
					else
					{
						var s = Math.min(1, Math.min(this.maxImageSize / img.width, this.maxImageSize / img.height));
						var w = Math.round(img.width * s);
						var h = Math.round(img.height * s);
						
						graph.setSelectionCell(graph.insertVertex(null, null, '', graph.snap(dx), graph.snap(dy),
								w, h, 'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
								'verticalAlign=top;aspect=fixed;image=' + text + ';'));
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
	 * Returns true for Gliffy or GraphML data or .vsdx filenames.
	 */
	EditorUi.prototype.isRemoteFileFormat = function(data, filename)
	{
		return /(\.*<graphml xmlns=\".*)/.test(data) ||
			/(\"contentType\":\s*\"application\/gliffy\+json\")/.test(data) ||
			(filename != null && /(\.vsdx)($|\?)/i.test(filename));
	};
	
	/**
	 * Imports the given XML into the existing diagram.
	 */
	EditorUi.prototype.importFile = function(data, mimeType, dx, dy, w, h, filename, done, file, crop)
	{
		crop = (crop != null) ? crop : true;
		var async = false;
		var cells = null;
		
		if (mimeType.substring(0, 5) == 'image')
		{
			var containsModel = false;

			if (mimeType.substring(0, 9) == 'image/png')
			{
				var xml = this.extractGraphModelFromPng(data);
				
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
					'verticalAlign=top;aspect=fixed;image=' + data + ';')];
			}
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
					var importedCells = null;
					
					if (xhr.status == 200)
					{
						importedCells = this.importXml(xhr.responseText, dx, dy, crop);
					}
					
					if (done != null)
					{
						done(importedCells);
					}
				}
			}), filename);
		}
		else
		{
			if (/(\.vsdx)($|\?)/i.test(filename))
			{
				var vsdxModel = new mxVsdxModel();
				vsdxModel.decode(file);
			}
			else
			{
				cells = this.insertTextAt(this.validateFileData(data), dx, dy, true);
			}
//			else if (String.prototype.trim)
//			{
//				var trimmed = data.trim();
//				
//				if (trimmed.substring(0, 6) == 'strict ' || trimmed.substring(0, 5) == 'graph' || trimmed.substring(0, 7) == 'digraph')
//				{
//					// GraphViz dot format http://www.graphviz.org/content/dot-language
//					//var digraph = graphlibDot.read("digraph { 1; 2; 1 -> 2 [label=\"label\"] }");
//				}
//			}
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
	EditorUi.prototype.importFiles = function(files, x, y, maxSize, fn, resultFn, filterFn, barrierFn, resizeImages, maxBytes, resampleThreshold)
	{
		var crop = x != null && y != null;
		
		x = (x != null) ? x : 0;
		y = (y != null) ? y : 0;
		maxSize = (maxSize != null) ? maxSize : this.maxImageSize;
		maxBytes = (maxBytes != null) ? maxBytes : this.maxImageBytes;
		resizeImages = (resizeImages != null) ? resizeImages : true;
		
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
				return this.importFile(data, mimeType, x, y, w, h, filename, done, file, crop);
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
			    					var svgText = atob(data.substring(comma + 1));
			    					var root = mxUtils.parseXml(svgText);
		    						var svgs = root.getElementsByTagName('svg');
		    						
		    						if (svgs.length > 0)
			    					{
		    							var svgRoot = svgs[0];
				    					var cont = svgRoot.getAttribute('content');

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
	
								    						data = this.createSvgDataUri(mxUtils.getXml(svgs[0]));
								    						
								    						var s = Math.min(1, Math.min(maxSize / Math.max(1, w)), maxSize / Math.max(1, h));
										    				
										    				return fn(data, file.type, x + index * gs, y + index * gs,
										    					Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s)), file.name);
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
				    					var xml = this.extractGraphModelFromPng(e.target.result);
				    					
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
				    					if (window.chrome != null && chrome.app != null && chrome.app.runtime != null)
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
									    					var s = (!resizeImages || !this.isResampleImage(e.target.result)) ? 1 : Math.min(1, Math.min(maxSize / w2, maxSize / h2));
										    				
									    					return fn(data2, file.type, x + index * gs, y + index * gs, Math.round(w2 * s), Math.round(h2 * s), file.name);
								    					}
								    					else
								    					{
								    						this.handleError({message: mxResources.get('imageTooBig')});
								    						
								    						return null;
								    					}
										    		}));
							    				}), resizeImages, maxSize, resampleThreshold);
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
					
					// Handles special case of binary file where the reader should not be used
					if (/(\.vsdx)($|\?)/i.test(file.name))
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

	/**
	 * Initializes CRC table.
	 */
	(function()
	{
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
	})();

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
				
				var crc = 0xffffffff;
				crc = this.updateCRC(crc, type, 0, 4);
				crc = this.updateCRC(crc, value, 0, value.length);
				
				result += writeInt(key.length + value.length + 1 + ((type == 'zTXt') ? 1 : 0)) +
					type + key + String.fromCharCode(0) +
					((type == 'zTXt') ? String.fromCharCode(0) : '') + 
					value + writeInt(crc ^ 0xffffffff);

				result += f.substring(pos - 8, f.length);
				
				break;
			}
			
			result += f.substring(pos - 8, pos - 4 + n);
			value = fread(f,n);
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
		editorUiInit.apply(this, arguments);
		var graph = this.editor.graph;
		var ui = this;
		
		if (mxClient.IS_SVG)
		{
			// LATER: Add shadow for labels in graph.container (eg. math, NO_FO), scaling
			this.editor.addSvgShadow(graph.view.canvas.ownerSVGElement, null, true);
		}
		
		/**
		 * Specifies the default filename.
		 */
		this.defaultFilename = mxResources.get('untitledDiagram');
		
		/**
		 * Adds placeholder for %page% and %pagenumber%
		 */
		var graphGetGlobalVariable = graph.getGlobalVariable;
		
		graph.getGlobalVariable = function(name)
		{
			if (name == 'page' && ui.currentPage != null)
			{
				return ui.currentPage.getName();
			}
			else if (name == 'pagenumber' && ui.currentPage != null && ui.pages != null)
			{
				return mxUtils.indexOf(ui.pages, ui.currentPage) + 1;
			}
			
			return graphGetGlobalVariable.apply(this, arguments);
		};

		/**
		 * Overrides editor filename.
		 */
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
		if (!this.editor.chromeless)
		{
			// Defines additional hotkeys
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
					
					if (!mxEvent.isConsumed(evt) && !graph.isEditing())
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
										// LATER: Fix sanitizeHtml to allow for data URIs as image in labels
//										if (graph.isEditing())
//										{
//									    	this.importFiles([item.getAsFile()], 0, 0, this.maxImageSize, function(data, mimeType, x, y, w, h)
//									    	{
//									    		// Inserts image into current text box
//									    		graph.insertImage(data, w, h);
//									    	}, function()
//									    	{
//									    		// No post processing
//									    	}, function(file)
//									    	{
//									    		// Handles only images
//									    		return file.type.substring(0, 6) == 'image/';
//									    	}, function(queue)
//									    	{
//									    		// Invokes elements of queue in order
//									    		for (var i = 0; i < queue.length; i++)
//									    		{
//									    			queue[i]();
//									    		}
//									    	});
//										}
//										else
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
					    	}, !mxEvent.isControlDown(evt));
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
		
		// Adds an element to edit the style in the footer in test mode
		if (urlParams['test'] == '1')
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
		if (Graph.fileSupport)
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
						this.importFiles(evt.dataTransfer.files, x, y, this.maxImageSize, null, null,
							null, null, !mxEvent.isControlDown(evt) && !mxEvent.isShiftDown(evt));
		    		}
				    else
				    {
				    	var uri = (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0) ?
				    		evt.dataTransfer.getData('text/uri-list') : null;
				    	var data = this.extractGraphModelFromEvent(evt);
				    	
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
				    		
					    	graph.setSelectionCells(this.insertTextAt(html, x, y, true, asImage));
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
			    					'verticalAlign=top;aspect=fixed;image=' + uri + ';'));
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
			var graph = this.editor.graph;
			var xml = mxUtils.trim((mxClient.IS_QUIRKS || document.documentMode == 8) ?
				mxUtils.getTextContent(elt) : elt.textContent);
			var compat = false;

			// Workaround for junk after XML in VM
			try
			{
				var idx = xml.lastIndexOf('%3E');
				
				if (idx < xml.length - 3)
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
	};
	
	/**
	 * Creates the format panel and adds overrides.
	 */
	var editorUiCreateFormat = EditorUi.prototype.createFormat;
	EditorUi.prototype.createFormat = function(container)
	{
		/**
		 * Overrides for Format sidebar.
		 */
		var formatInit = Format.prototype.init;
		
		Format.prototype.init = function()
		{
			formatInit.apply(this, arguments);

			var ui = this.editorUi;
			ui.editor.addListener('fileLoaded', this.update);
		};

		var formatRefresh = Format.prototype.refresh;
		
		Format.prototype.refresh = function()
		{
			var ui = this.editorUi;
			
			if (ui.getCurrentFile() != null || urlParams['embed'] == '1')
			{
				formatRefresh.apply(this, arguments);
			}
			else
			{
				this.clear();
			}
		};
		
		/**
		 * Adds autosave and math typesetting options.
		 */
		var diagramFormatPanelAddOptions = DiagramFormatPanel.prototype.addOptions;
		DiagramFormatPanel.prototype.addOptions = function(div)
		{
			div = diagramFormatPanelAddOptions.apply(this, arguments);
			
			var ui = this.editorUi;
			var editor = ui.editor;
			var graph = editor.graph;
			
			if (graph.isEnabled())
			{
				var file = ui.getCurrentFile();
	
				if (file != null && file.isAutosaveOptional())
				{
					var opt = this.createOption(mxResources.get('autosave'), function()
					{
						return ui.editor.autosave;
					}, function(checked)
					{
						ui.editor.setAutosave(checked);
					},
					{
						install: function(apply)
						{
							this.listener = function()
							{
								apply(ui.editor.autosave);
							};
							
							ui.editor.addListener('autosaveChanged', this.listener);
						},
						destroy: function()
						{
							ui.editor.removeListener(this.listener);
						}
					});
					
					div.appendChild(opt);
				}
			}

			return div;
		};

		/**
		 * Adds predefiend styles.
		 */
		var StyleFormatPanelInit = StyleFormatPanel.prototype.init;
		StyleFormatPanel.prototype.init = function()
		{
			// TODO: Update sstate in Format
			var sstate = this.format.createSelectionState();

			if (sstate.style.shape != 'image')
			{
				this.container.appendChild(this.addStyles(this.createPanel()));
			}
			
			StyleFormatPanelInit.apply(this, arguments);
		};

		/**
		 * Overridden to add copy and paste style.
		 */
		var styleFormatPanelAddStyleOps = StyleFormatPanel.prototype.addStyleOps;
		StyleFormatPanel.prototype.addStyleOps = function(div)
		{
			var btn = mxUtils.button(mxResources.get('copyStyle'), mxUtils.bind(this, function(evt)
			{
				this.editorUi.actions.get('copyStyle').funct();
			}));
			
			btn.setAttribute('title', mxResources.get('copyStyle') + ' (' + this.editorUi.actions.get('copyStyle').shortcut + ')');
			btn.style.marginBottom = '2px';
			btn.style.width = '100px';
			btn.style.marginRight = '2px';
			
			div.appendChild(btn);
			
			var btn = mxUtils.button(mxResources.get('pasteStyle'), mxUtils.bind(this, function(evt)
			{
				this.editorUi.actions.get('pasteStyle').funct();
			}));
			
			btn.setAttribute('title', mxResources.get('pasteStyle') + ' (' + this.editorUi.actions.get('pasteStyle').shortcut + ')');
			btn.style.marginBottom = '2px';
			btn.style.width = '100px';
			
			div.appendChild(btn);
			mxUtils.br(div);
			
			return styleFormatPanelAddStyleOps.apply(this, arguments);
		};

		/**
		 * Creates the buttons for the predefined styles.
		 */
		StyleFormatPanel.prototype.addStyles = function(div)
		{
			var graph = this.editorUi.editor.graph;
			var picker = document.createElement('div');
			picker.style.whiteSpace = 'normal';
			picker.style.paddingLeft = '24px';
			picker.style.paddingRight = '20px';
			div.style.paddingLeft = '16px';
			div.style.paddingBottom = '6px';
			div.style.position = 'relative';
			div.appendChild(picker);

			var stylenames = ['plain-gray', 'plain-blue', 'plain-green', 'plain-orange',
			                  'plain-yellow', 'plain-red', 'plain-purple', null];

			function updateScheme(colorsets)
			{
				function addButton(colorset)
				{
					var btn = mxUtils.button('', function(evt)
					{
						graph.getModel().beginUpdate();
						try
						{
							var cells = graph.getSelectionCells();
							
							for (var i = 0; i < cells.length; i++)
							{
								var style = graph.getModel().getStyle(cells[i]);
				
								for (var j = 0; j < stylenames.length; j++)
								{
									style = mxUtils.removeStylename(style, stylenames[j]);
								}
								
								if (colorset != null)
								{
									style = mxUtils.setStyle(style, mxConstants.STYLE_FILLCOLOR, colorset['fill']);
									style = mxUtils.setStyle(style, mxConstants.STYLE_STROKECOLOR, colorset['stroke']);
									style = mxUtils.setStyle(style, mxConstants.STYLE_GRADIENTCOLOR, colorset['gradient']);
								}
								else
								{
									style = mxUtils.setStyle(style, mxConstants.STYLE_FILLCOLOR, '#ffffff');
									style = mxUtils.setStyle(style, mxConstants.STYLE_STROKECOLOR, '#000000');
									style = mxUtils.setStyle(style, mxConstants.STYLE_GRADIENTCOLOR, null);
								}
								
								graph.getModel().setStyle(cells[i], style);
							}
						}
						finally
						{
							graph.getModel().endUpdate();
						}
					})
	
					btn.style.width = '36px';
					btn.style.height = '30px';
					btn.style.margin = '0px 6px 6px 0px';
					
					if (colorset != null)
					{
						if (colorset['gradient'] != null)
						{
							if (mxClient.IS_IE && (mxClient.IS_QUIRKS || document.documentMode < 10))
							{
						    	btn.style.filter = 'progid:DXImageTransform.Microsoft.Gradient('+
				                	'StartColorStr=\'' + colorset['fill'] +
				                	'\', EndColorStr=\'' + colorset['gradient'] + '\', GradientType=0)';
							}
							else
							{
								btn.style.backgroundImage = 'linear-gradient(' + colorset['fill'] + ' 0px,' +
									colorset['gradient'] + ' 100%)';
							}
						}
						else
						{					
							btn.style.backgroundColor = colorset['fill'];
						}
						
						btn.style.border = '1px solid ' + colorset['stroke'];
					}
					else
					{
						btn.style.backgroundColor = '#ffffff';
						btn.style.border = '1px solid #000000';
					}
					
					picker.appendChild(btn);
				};
				
				picker.innerHTML = '';
				
				for (var i = 0; i < colorsets.length; i++)
				{
					if (i > 0 && mxUtils.mod(i, 4) == 0)
					{
						mxUtils.br(picker);
					}
					
					addButton(colorsets[i]);
				}
			};

			if (this.editorUi.currentScheme == null)
			{
				this.editorUi.currentScheme = 0;
			}

			var schemes = [[null, {fill: '#f5f5f5', stroke: '#666666'},
				{fill: '#dae8fc', stroke: '#6c8ebf'}, {fill: '#d5e8d4', stroke: '#82b366'},
				{fill: '#ffe6cc', stroke: '#d79b00'}, {fill: '#fff2cc', stroke: '#d6b656'},
				{fill: '#f8cecc', stroke: '#b85450'}, {fill: '#e1d5e7', stroke: '#9673a6'}],
			    [null,
				{fill: '#f5f5f5', stroke: '#666666', gradient: '#b3b3b3'},
				{fill: '#dae8fc', stroke: '#6c8ebf', gradient: '#7ea6e0'},
				{fill: '#d5e8d4', stroke: '#82b366', gradient: '#97d077'},
				{fill: '#ffcd28', stroke: '#d79b00', gradient: '#ffa500'},
				{fill: '#fff2cc', stroke: '#d6b656', gradient: '#ffd966'},
				{fill: '#f8cecc', stroke: '#b85450', gradient: '#ea6b66'},
				{fill: '#e6d0de', stroke: '#996185', gradient: '#d5739d'}]];
			
			var left = document.createElement('div');
			left.style.cssText = 'position:absolute;left:10px;top:8px;bottom:8px;width:20px;margin:4px;opacity:0.5;' +
				'background-repeat:no-repeat;background-position:center center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQBAMAAADQT4M0AAAAIVBMVEUAAAB2dnZ4eHh3d3d1dXVxcXF2dnZ2dnZ2dnZxcXF2dnYmb3w1AAAACnRSTlMAfCTkhhvb7cQSPH2JPgAAADRJREFUCNdjwACMAmBKaiGYs2oJmLPKAZ3DabU8AMRTXpUKopislqFyVzCAuUZgikkBZjoAcMYLnp53P/UAAAAASUVORK5CYII=);';
			div.appendChild(left);
			
			mxEvent.addListener(left, 'click', mxUtils.bind(this, function()
			{
				this.editorUi.currentScheme = mxUtils.mod(this.editorUi.currentScheme - 1, schemes.length);
				updateScheme(schemes[this.editorUi.currentScheme]);
			}));
			
			var right = document.createElement('div');
			right.style.cssText = 'position:absolute;left:202px;top:8px;bottom:8px;width:20px;margin:4px;opacity:0.5;' +
				'background-repeat:no-repeat;background-position:center center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQBAMAAADQT4M0AAAAIVBMVEUAAAB2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnYBuwCcAAAACnRSTlMAfCTkhhvb7cQSPH2JPgAAADZJREFUCNdjQAOMAmBKaiGY8loF5rKswsZlrVo8AUiFrTICcbIWK8A5DF1gDoMymMPApIAwHwCS0Qx/U7qCBQAAAABJRU5ErkJggg==);';
			div.appendChild(right);
			
			mxEvent.addListener(right, 'click', mxUtils.bind(this, function()
			{
				this.editorUi.currentScheme = mxUtils.mod(this.editorUi.currentScheme + 1, schemes.length);
				updateScheme(schemes[this.editorUi.currentScheme]);
			}));
			
			// Hover state
			function addHoverState(elt)
			{
				mxEvent.addListener(elt, 'mouseenter', function()
				{
					elt.style.opacity = '1';
				});
				mxEvent.addListener(elt, 'mouseleave', function()
				{
					elt.style.opacity = '0.5';
				});
			};
			
			addHoverState(left);
			addHoverState(right);
			
			updateScheme(schemes[this.editorUi.currentScheme]);
			
			return div;
		};
		
		return editorUiCreateFormat.apply(this, arguments);
	};
	
	// Overridden to add edit shape option
	if (window.StyleFormatPanel != null)
	{
		StyleFormatPanel.prototype.addEditOps = function(div)
		{
			var ss = this.format.getSelectionState();
			var btn = null;
			
			if (this.editorUi.editor.graph.getSelectionCount() == 1)
			{
				btn = mxUtils.button(mxResources.get('editStyle'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('editStyle').funct();
				}));
				
				btn.setAttribute('title', mxResources.get('editStyle') + ' (' + this.editorUi.actions.get('editStyle').shortcut + ')');
				btn.style.width = '202px';
				btn.style.marginBottom = '2px';
				
				div.appendChild(btn);
			}
			
			var graph = this.editorUi.editor.graph;
			var state = graph.view.getState(graph.getSelectionCell());
			
			if (graph.getSelectionCount() == 1 && state != null && state.shape != null && state.shape.stencil != null)
			{
				var btn2 = mxUtils.button(mxResources.get('editShape'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('editShape').funct();
				}));
				
				btn2.setAttribute('title', mxResources.get('editShape'));
				btn2.style.marginBottom = '2px';
				
				if (btn == null)
				{
					btn2.style.width = '202px';
				}
				else
				{
					btn.style.width = '100px';
					btn2.style.width = '100px';
					btn2.style.marginLeft = '2px';
				}
				
				div.appendChild(btn2);
			}
			else if (ss.image)
			{
				var btn2 = mxUtils.button(mxResources.get('editImage'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('image').funct();
				}));
				
				btn2.setAttribute('title', mxResources.get('editImage'));
				btn2.style.marginBottom = '2px';
				
				if (btn == null)
				{
					btn2.style.width = '202px';
				}
				else
				{
					btn.style.width = '100px';
					btn2.style.width = '100px';
					btn2.style.marginLeft = '2px';
				}
				
				div.appendChild(btn2);
			}
			
			return div;
		};
	}
	
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
					// IE 10 does not implement pointer-events so it can't have a drop highlight
					if (dropElt == null && (!mxClient.IS_IE || (document.documentMode > 10 && document.documentMode < 12)))
					{
						dropElt = this.highlightElement();
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
					
					if (evt.dataTransfer.files.length > 0)
					{
						this.hideDialog();
						this.openFiles(evt.dataTransfer.files);
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
											this.openLocalFile(xml);
										}
									}
									if (!this.isOffline() && this.isRemoteFileFormat(data))
									{
							    		new mxXmlRequest(OPEN_URL, 'format=xml&data=' + encodeURIComponent(data)).send(mxUtils.bind(this, function(req)
										{
							    			if (req.getStatus() == 200)
							    			{
							    				this.openLocalFile(req.getText());
							    			}
										}));
									}
									else if (/^https?:\/\//.test(data))
									{
										var url = this.getUrl(window.location.pathname + '?url=' + encodeURIComponent(data));
										
										if (this.getCurrentFile() == null)
										{
											window.location.href = url;
										}
										else
										{
											window.openWindow(url);
										}
									}
								}
							}
						}
						else
						{
							this.openLocalFile(data);
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
	EditorUi.prototype.openFiles = function(files)
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
							if (/(\.png)$/i.test(name))
							{
								name = name.substring(0, name.length - 4) + '.xml';
							}
		
							if (Graph.fileSupport && !this.isOffline() && new XMLHttpRequest().upload &&
								this.isRemoteFileFormat(data, name))
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
								
								this.parseFile(file, mxUtils.bind(this, function(xhr)
								{
									if (xhr.readyState == 4)
									{
										this.spinner.stop();
										
										if (xhr.status == 200)
										{
											this.openLocalFile(xhr.responseText, name);
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
							else if (e.target.result.substring(0, 10) == '<mxlibrary')
			    			{
								this.spinner.stop();
								
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
								this.openLocalFile(data, name);
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
	EditorUi.prototype.openLocalFile = function(data, name)
	{
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
				this.fileLoaded(new LocalFile(this, data, name || this.defaultFilename));
			}
		});
		
		if (data != null && data.length > 0)
		{
			if (this.getCurrentFile() != null && !this.isDiagramEmpty())
			{
				window.openFile = new OpenFile(function()
				{
					window.openFile = null;
				});
				
				window.openFile.setData(data, name);
				window.openWindow(this.getUrl(), null, fn);
			}
			else
			{
				fn();
			}
		}
	};
	
	/**
	 * Shows the layers dialog if the graph has more than one layer.
	 */
	EditorUi.prototype.initializeEmbedMode = function()
	{
		this.diagramContainer.style.visibility = 'hidden';
		this.formatContainer.style.visibility = 'hidden';
		this.editor.graph.setEnabled(false);
		var parent = window.opener || window.parent;

		if (parent != window)
		{
			if (urlParams['spin'] != '1' || this.spinner.spin(document.body, mxResources.get('loading')))
			{
				this.installMessageHandler(mxUtils.bind(this, function(xml, evt, modified)
				{
					this.spinner.stop();
					this.addEmbedButtons();
					this.diagramContainer.style.visibility = '';
					this.formatContainer.style.visibility = '';
					this.editor.graph.setEnabled(true);
					
					if (xml != null && xml.length > 0)
					{
						var doc = mxUtils.parseXml(xml);
						this.editor.setGraphXml(doc.documentElement);
						this.showLayersDialog();
					}
					else
					{
						this.editor.graph.model.clear();
						this.editor.fireEvent(new mxEventObject('resetGraphView'));
					}
	
					this.editor.undoManager.clear();
					this.editor.modified = (modified != null) ? modified : false;
					this.updateUi();
					
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
		var autosave = false;
		
		var updateStatus = mxUtils.bind(this, function(sender, eventObject)
		{
			if (urlParams['modified'] != null)
			{
				if (urlParams['modified'] == '0')
				{
					this.editor.setStatus('');
				}
				else
				{
					this.editor.setStatus(mxResources.get(urlParams['modified']));
				}
			}
		});
		
		this.editor.graph.model.addListener(mxEvent.CHANGE, updateStatus);
		
		// Receives XML message from opener and puts it into the graph
		mxEvent.addListener(window, 'message', mxUtils.bind(this, function(evt)
		{
			var data = evt.data;
			
			if (urlParams['proto'] == 'json')
			{
				data = JSON.parse(data);
				
				if (data.action == 'dialog')
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
				else if (data.action == 'template')
				{
					this.spinner.stop();
					
					var dlg = new NewDialog(this, false, false, mxUtils.bind(this, function(xml)
					{
						// LATER: Add autosave option in template message
						fn(xml || '', evt, xml != null);
					}));

					this.showDialog(dlg.container, 620, 440, true, true, mxUtils.bind(this, function(cancel)
					{
						if (cancel)
						{
							this.actions.get('exit').funct();
						}
					}));
					
					dlg.init();
					
					return;
				}
				else if (data.action == 'status')
				{
					if (data.messageKey != null)
					{
						this.editor.setStatus(mxResources.get(data.messageKey));
					}
					else if (data.message != null)
					{
						this.editor.setStatus(data.message);
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
							
							var postDataBack = mxUtils.bind(this, function(bin)
							{
								var msg = this.createLoadMessage('export');
								msg.format = data.format;
								msg.xml = encodeURIComponent(xml);
								msg.data = 'data:image/png;base64,' + bin;
								parent.postMessage(JSON.stringify(msg), '*');
								this.editor.graph.setEnabled(true);
							});
							
							if (this.isExportToCanvas())
							{
								this.exportToCanvas(mxUtils.bind(this, function(canvas)
							   	{
							   	    var uri = canvas.toDataURL('image/png');
							   	    
							   	    if (data.format == 'xmlpng')
							   	    {
							   	    	uri = this.writeGraphModelToPng(uri, 'zTXt', 'mxGraphModel',
							   	    		atob(this.editor.graph.compress(xml)));	
							   	    }
							   	    
							   	    postDataBack(uri.substring(uri.lastIndexOf(',') + 1));
							   	}));
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
									this.editor.graph.setEnabled(true);
									this.spinner.stop();
									
									if (req.getStatus() == 200)
									{
										postDataBack(req.getText());
									}
								}), mxUtils.bind(this, function()
								{
									this.spinner.stop();
								}));
							}
						}
					}
					else
					{
						// SVG is generated from graph so parse optional XML
						if (data.xml != null && data.xml.length > 0)
						{
							var doc = mxUtils.parseXml(data.xml);
							this.editor.setGraphXml(doc.documentElement);
						}
						
						var msg = this.createLoadMessage('export');
						
						if (data.format == 'html' || data.format == 'html2')
						{
							var xml = this.editor.getGraphXml();
							msg.data = (data.format == 'html2') ? this.getHtml2(xml, this.editor.graph) :
								this.getHtml(xml, this.editor.graph);
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
				        	
							msg.xml = mxUtils.getXml(this.editor.getGraphXml());
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
				        		var svg = (data.format == 'xmlsvg') ? this.getEmbeddedSvg(mxUtils.getXml(this.editor.getGraphXml()),
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
						else
						{
							this.buttonContainer.style.paddingRight = '38px';
							this.buttonContainer.style.paddingTop = '6px';
						}
						
						this.buttonContainer.appendChild(tmp);
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
					// Unknown message
					data  = null;
				}
			}

			if (data != null && data.charAt(0) != '<')
			{
				try
				{	
					if (data.substring(0, 26) == 'data:image/svg+xml;base64,')
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
			
			fn(data, evt);

			if (urlParams['modified'] != null)
			{
				this.editor.setStatus('');
			}
			
			if (autosave)
			{
				var changeListener = mxUtils.bind(this, function(sender, eventObject)
				{
					var data = mxUtils.getXml(this.editor.getGraphXml());
					var msg = this.createLoadMessage('autosave');
					msg.xml = data;
					data = JSON.stringify(msg);
					
					var parent = window.opener || window.parent;
					parent.postMessage(data, '*');
				});
				
				this.editor.graph.model.addListener(mxEvent.CHANGE, changeListener);

				// Some options trigger autosave
				this.addListener('pageFormatChanged', changeListener);
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
			               'url', 'embed', 'client', 'create', 'title', 'splash'];
			
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
	 * Updates action states depending on the selection.
	 */
	var editorUiUpdateActionStates = EditorUi.prototype.updateActionStates;
	EditorUi.prototype.updateActionStates = function()
	{
		editorUiUpdateActionStates.apply(this, arguments);

		var graph = this.editor.graph;
		var file = this.getCurrentFile();
		var active = (file != null && file.isEditable()) || urlParams['embed'] == '1';
		this.actions.get('pageSetup').setEnabled(active);
		this.actions.get('autosave').setEnabled(file != null && file.isEditable() && file.isAutosaveOptional());
		this.actions.get('guides').setEnabled(active);
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
		this.actions.get('editDiagram').setEnabled(urlParams['embed'] == '1' ||
				(file != null && !file.isRestricted()));
		this.actions.get('imgur').setEnabled(file != null && !file.isRestricted());
		this.actions.get('twitter').setEnabled(file != null && !file.isRestricted());
		this.actions.get('facebook').setEnabled(file != null && !file.isRestricted());
		this.actions.get('github').setEnabled(file != null && !file.isRestricted());
		this.actions.get('publishLink').setEnabled(file != null && !file.isRestricted());
		this.menus.get('publish').setEnabled(file != null && !file.isRestricted());
		
		var state = graph.view.getState(graph.getSelectionCell());
		this.actions.get('editShape').setEnabled(active && state != null && state.shape != null && state.shape.stencil != null);
	};

	/**
	 * Changes the default stylename so that it matches the old named style
	 * if one was specified in the XML.
	 */
	Graph.prototype.defaultThemeName = 'default-style2';
	
	/**
	 * Contains the last XML that was pasted.
	 */
	Graph.prototype.lastPasteXml = null;
	
	/**
	 * Contains the number of times the last XML was pasted.
	 */
	Graph.prototype.pasteCounter = 0;
	
	// Experimental edge mode
	Graph.prototype.edgeMode = urlParams['edge'] != 'move';
	
	/**
	 * Sets default style (used in editor.get/setGraphXml below)
	 */
	var graphLoadStylesheet = Graph.prototype.loadStylesheet;
	Graph.prototype.loadStylesheet = function()
	{
		graphLoadStylesheet.apply(this, arguments);
		this.currentStyle = 'default-style2';
	};

	/**
	 * Graph Overrides
	 */
	Graph.prototype.defaultScrollbars = urlParams['sb'] != '0';

	/**
	 * Specifies if the page should be visible for new files. Default is true.
	 */
	Graph.prototype.defaultPageVisible = urlParams['pv'] != '0';

	/**
	 * Loads the stylesheet for this graph.
	 */
	Graph.prototype.setShadowVisible = function(value, fireEvent)
	{
		if (mxClient.IS_SVG)
		{
			fireEvent = (fireEvent != null) ? fireEvent : true;
			this.shadowVisible = value;
			
			if (this.shadowVisible)
			{
				this.view.getDrawPane().setAttribute('filter', 'url(#dropShadow)');
			}
			else
			{
				this.view.getDrawPane().removeAttribute('filter');
			}
			
			if (fireEvent)
			{
				this.fireEvent(new mxEventObject('shadowVisibleChanged'));
			}
		}
	};

	/**
	 * Adds rack child layout style.
	 */
	var graphInit = Graph.prototype.init;
	Graph.prototype.init = function()
	{
		graphInit.apply(this, arguments);

		// Override insert location for current mouse point
		var mouseEvent = null;
		
		function setMouseEvent(evt)
		{
			mouseEvent = evt;
			
			// Workaround for member not found in IE8-
			if (mxClient.IS_QUIRKS || document.documentMode == 7 || document.documentMode == 8)
			{
				mouseEvent = mxUtils.clone(evt);
			}
		};
		
		mxEvent.addListener(this.container, 'mouseenter', setMouseEvent);
		mxEvent.addListener(this.container, 'mousemove', setMouseEvent);
		
		mxEvent.addListener(this.container, 'mouseleave', function(evt)
		{
			mouseEvent = null;
		});
				
		// Extends getInsertPoint to use the current mouse location
		this.isMouseInsertPoint = function()
		{
			return mouseEvent != null;
		};
		
		var getInsertPoint = this.getInsertPoint;
		
		this.getInsertPoint = function()
		{
			if (mouseEvent != null)
			{
				return this.getPointForEvent(mouseEvent);
			}
			
			return getInsertPoint.apply(this, arguments);
		};
		
		var layoutManagerGetLayout = this.layoutManager.getLayout;
		
		this.layoutManager.getLayout = function(cell)
		{
			var state = this.graph.view.getState(cell);
			var style = (state != null) ? state.style : this.graph.getCellStyle(cell);
			
			// mxRackContainer may be undefined as it is dynamically loaded at render time
			if (typeof(mxRackContainer) != 'undefined' && style['childLayout'] == 'rack')
			{
				var rackLayout = new mxStackLayout(this.graph, false);
				
				rackLayout.setChildGeometry = function(child, geo)
				{
					var unitSize = 20;
					geo.height = Math.max(geo.height, unitSize);
					
					if (geo.height / unitSize > 1)
					{
						var mod = geo.height % unitSize;
						geo.height += mod > unitSize / 2 ? (unitSize - mod) : -mod;
					}
			
					this.graph.getModel().setGeometry(child, geo);
				};
			
				rackLayout.fill = true;
				rackLayout.unitSize = mxRackContainer.unitSize | 20;
				rackLayout.marginLeft = style['marginLeft'] || 0;
				rackLayout.marginRight = style['marginRight'] || 0;
				rackLayout.marginTop = style['marginTop'] || 0;
				rackLayout.marginBottom = style['marginBottom'] || 0;
				rackLayout.resizeParent = false;
				
				return rackLayout;
			}
			
			return layoutManagerGetLayout.apply(this, arguments);
		}
	};

	/**
	 * Specifies special libraries that are loaded via dynamic JS.
	 * 
	 *************************************************************
	 * IMPORTANT: Add all special cases in EmbedServlet.java and *
	 * jgraphcms/js/Graph.js lines 102 ff.                       *
	 *************************************************************
	 */
	mxStencilRegistry.libraries['arrows2'] = [SHAPES_PATH + '/mxArrows.js'];
	mxStencilRegistry.libraries['bpmn'] = [SHAPES_PATH + '/bpmn/mxBpmnShape2.js', STENCIL_PATH + '/bpmn.xml'];
	mxStencilRegistry.libraries['er'] = [SHAPES_PATH + '/er/mxER.js'];
	mxStencilRegistry.libraries['ios'] = [SHAPES_PATH + '/mockup/mxMockupiOS.js'];
	mxStencilRegistry.libraries['rackGeneral'] = [SHAPES_PATH + '/rack/mxRack.js', STENCIL_PATH + '/rack/general.xml'];
	mxStencilRegistry.libraries['rackF5'] = [STENCIL_PATH + '/rack/f5.xml'];
	mxStencilRegistry.libraries['lean_mapping'] = [SHAPES_PATH + '/mxLeanMap.js', STENCIL_PATH + '/lean_mapping.xml'];
	mxStencilRegistry.libraries['basic'] = [SHAPES_PATH + '/mxBasic.js', STENCIL_PATH + '/basic.xml'];

	mxStencilRegistry.libraries['ios7icons'] = [STENCIL_PATH + '/ios7/icons.xml'];
	mxStencilRegistry.libraries['ios7ui'] = [SHAPES_PATH + '/ios7/mxIOS7Ui.js', STENCIL_PATH + '/ios7/misc.xml'];

	mxStencilRegistry.libraries['android'] = [SHAPES_PATH + '/mxAndroid.js', STENCIL_PATH + '/android/android.xml'];

	mxStencilRegistry.libraries['eeLogicGates'] = [STENCIL_PATH + '/electrical/logic_gates.xml'];
	mxStencilRegistry.libraries['eeResistors'] = [STENCIL_PATH + '/electrical/resistors.xml'];
	mxStencilRegistry.libraries['eeCapacitors'] = [STENCIL_PATH + '/electrical/capacitors.xml'];
	mxStencilRegistry.libraries['eeInductors'] = [STENCIL_PATH + '/electrical/inductors.xml'];
	mxStencilRegistry.libraries['eeSwitchesRelays'] = [STENCIL_PATH + '/electrical/switchesRelays.xml', STENCIL_PATH + '/electrical/electro-mechanical.xml'];
	mxStencilRegistry.libraries['eeDiodes'] = [STENCIL_PATH + '/electrical/diodes.xml'];
	mxStencilRegistry.libraries['eeSources'] = [STENCIL_PATH + '/electrical/signal_sources.xml'];
	mxStencilRegistry.libraries['eeTransistors'] = [STENCIL_PATH + '/electrical/mosfets1.xml', STENCIL_PATH + '/electrical/mosfets2.xml', STENCIL_PATH + '/electrical/transistors.xml'];
	mxStencilRegistry.libraries['eeMisc'] = [STENCIL_PATH + '/electrical/electro-mechanical.xml', STENCIL_PATH + '/electrical/miscellaneous.xml'];
	mxStencilRegistry.libraries['eeAudio'] = [STENCIL_PATH + '/electrical/radio.xml'];
	mxStencilRegistry.libraries['eePlcLadder'] = [STENCIL_PATH + '/electrical/plc_ladder.xml'];
	mxStencilRegistry.libraries['eeAbstract'] = [STENCIL_PATH + '/electrical/abstract.xml', STENCIL_PATH + '/electrical/logic_gates.xml'];
	mxStencilRegistry.libraries['eeOptical'] = [STENCIL_PATH + '/electrical/opto_electronics.xml'];
	mxStencilRegistry.libraries['eeVacuumTubes'] = [STENCIL_PATH + '/electrical/vacuum_tubes.xml'];
	mxStencilRegistry.libraries['eeWaveforms'] = [STENCIL_PATH + '/electrical/waveforms.xml'];
	mxStencilRegistry.libraries['eeInstruments'] = [STENCIL_PATH + '/electrical/instruments.xml'];

	mxStencilRegistry.libraries['mscae/cloud'] = [STENCIL_PATH + '/mscae/cloud.xml'];

	mxStencilRegistry.libraries['mockup/buttons'] = [SHAPES_PATH + '/mockup/mxMockupButtons.js'];
	mxStencilRegistry.libraries['mockup/containers'] = [SHAPES_PATH + '/mockup/mxMockupContainers.js'];
	mxStencilRegistry.libraries['mockup/forms'] = [SHAPES_PATH + '/mockup/mxMockupForms.js'];
	mxStencilRegistry.libraries['mockup/graphics'] = [SHAPES_PATH + '/mockup/mxMockupGraphics.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/markup'] = [SHAPES_PATH + '/mockup/mxMockupMarkup.js'];
	mxStencilRegistry.libraries['mockup/misc'] = [SHAPES_PATH + '/mockup/mxMockupMisc.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/navigation'] = [SHAPES_PATH + '/mockup/mxMockupNavigation.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/text'] = [SHAPES_PATH + '/mockup/mxMockupText.js'];

	// Required to avoid 404 for mockup.xml since naming of mxgraph.mockup.anchor does not contain
	// buttons even though it is defined in the mxMockupButtons.js file. This could only be fixed
	// with aliases for existing shapes or aliases for basenames, but this is essentially the same.
	mxStencilRegistry.libraries['mockup'] = [SHAPES_PATH + '/mockup/mxMockupButtons.js'];
	
	mxStencilRegistry.libraries['pid2inst'] = [SHAPES_PATH + '/pid2/mxPidInstruments.js'];
	mxStencilRegistry.libraries['pid2misc'] = [SHAPES_PATH + '/pid2/mxPidMisc.js', STENCIL_PATH + '/pid/misc.xml'];
	mxStencilRegistry.libraries['pid2valves'] = [SHAPES_PATH + '/pid2/mxPidValves.js'];
	mxStencilRegistry.libraries['pidFlowSensors'] = [STENCIL_PATH + '/pid/flow_sensors.xml'];
	
	mxStencilRegistry.libraries['floorplan'] = [SHAPES_PATH + '/mxFloorplan.js', STENCIL_PATH + '/floorplan.xml'];

	mxStencilRegistry.libraries['bootstrap'] = [SHAPES_PATH + '/mxBootstrap.js', STENCIL_PATH + '/bootstrap.xml'];

	mxStencilRegistry.libraries['gmdl'] = [SHAPES_PATH + '/mxGmdl.js', STENCIL_PATH + '/gmdl.xml'];

	mxStencilRegistry.libraries['cabinets'] = [SHAPES_PATH + '/mxCabinets.js', STENCIL_PATH + '/cabinets.xml'];

	mxStencilRegistry.libraries['citrix'] = [STENCIL_PATH + '/citrix.xml'];

	mxStencilRegistry.libraries['archimate'] = [SHAPES_PATH + '/mxArchiMate.js'];
	
	mxStencilRegistry.libraries['archimate3'] = [SHAPES_PATH + '/mxArchiMate3.js'];
	
	mxStencilRegistry.libraries['sysml'] = [SHAPES_PATH + '/mxSysML.js'];
	
	mxStencilRegistry.libraries['eip'] = [SHAPES_PATH + '/mxEip.js', STENCIL_PATH + '/eip.xml'];
	
	mxStencilRegistry.libraries['networks'] = [SHAPES_PATH + '/mxNetworks.js', STENCIL_PATH + '/networks.xml'];

	mxStencilRegistry.libraries['aws3d'] = [SHAPES_PATH + '/mxAWS3D.js', STENCIL_PATH + '/aws3d.xml'];
	
	// Triggers dynamic loading for markers
	mxMarker.getPackageForType = function(type)
	{
		var name = null;
		
		if (type != null && type.length > 0)
		{
			if (type.substring(0, 2) == 'ER')
			{
				name = 'mxgraph.er';
			}
			else if (type.substring(0, 5) == 'sysML')
			{
				name = 'mxgraph.sysml';
			}
		}
		
		return name;
	};
	
	var mxMarkerCreateMarker = mxMarker.createMarker;
	
	mxMarker.createMarker = function(canvas, shape, type, pe, unitX, unitY, size, source, sw, filled)
	{
		if (type != null)
		{
			var f = mxMarker.markers[type];
			
			if (f == null)
			{
				var name = this.getPackageForType(type);
				
				if (name != null)
				{
					mxStencilRegistry.getStencil(name);
				}
			}
		}
		
		return mxMarkerCreateMarker.apply(this, arguments);
	};
})();
