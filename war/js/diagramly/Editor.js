/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
(function()
{
	/**
	 * Specifies the app name. Default is document.title.
	 */
	Editor.prototype.appName = 'draw.io';

	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.closeImage = (mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAApVBMVEUAAAD////k5OT///8AAAB1dXXMzMz9/f39/f37+/v5+fn+/v7///9iYmJaWlqFhYWnp6ejo6OHh4f////////////////7+/v5+fnx8fH///8AAAD///8bGxv7+/v5+fkoKCghISFDQ0MYGBjh4eHY2Njb29tQUFBvb29HR0c/Pz82NjYrKyu/v78SEhLu7u7s7OzV1dVVVVU7OzsVFRXAv78QEBBzqehMAAAAG3RSTlMAA/7p/vz5xZlrTiPL/v78+/v7+OXd2TYQDs8L70ZbAAABKUlEQVQoz3VS13LCMBBUXHChd8iukDslQChJ/v/TchaG4cXS+OSb1c7trU7V60OpdRz2ZtNZL4zXNlcN8BEtSG6+NxIXkeRPoBuQ1cjvZ31/VJFB10ISli6diYfH8iYO3WUNCcNlB0gTrXOtkxTo0O1aKKiBBMhhv2MNBQKoiA5wxlZo0JDzD3AYKbWacyj3fs01wxey0pyEP+R8pWKWXoqtIZ0DDg5pbki9krEKOa6LVDQsdoXEsi46Zqh69KFz7B1u7Hb2yDV8firXDKBlZ4UFiswKGRhXTS93/ECK7yxnJ3+S3y/ThpO+cfSD017nqa18aasabU0/t7d+tk0/1oMEJ1NaD67iwdF68OabFSLn+eHb0+vjy+uk8br9fdrftH0O2menfd7+AQfYM/lNjoDHAAAAAElFTkSuQmCC' : IMAGE_PATH + '/delete.png';
	
	/**
	 * Executes the first step for connecting to Google Drive.
	 */
	Editor.prototype.editButtonLink = (urlParams['edit'] != null) ? decodeURIComponent(urlParams['edit']) : null;

	/**
	 * 
	 */
	if (urlParams['dev'] == '1')
	{
		Editor.prototype.editBlankUrl = Editor.prototype.editBlankUrl + '&dev=1';
		Editor.prototype.editBlankFallbackUrl = Editor.prototype.editBlankFallbackUrl + '&dev=1';
	}

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
				var tmp = this.graph.decompress(mxUtils.getTextContent(diagramNode));
				
				if (tmp != null && tmp.length > 0)
				{
					node = mxUtils.parseXml(tmp).documentElement;
				}
			}
		}
		
		if (node != null && node.nodeName != 'mxGraphModel' && (!allowMxFile || node.nodeName != 'mxfile'))
		{
			node = null;
		}
		
		return node;
	};
	
	/**
	 * Overrides reset graph.
	 */
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
	 * Initializes math typesetting and loads respective code.
	 */
	Editor.initMath = function(src, config)
	{
		src = (src != null) ? src : 'https://cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-MML-AM_HTMLorMML';
		Editor.mathJaxQueue = [];
		
		Editor.doMathJaxRender = function(container)
		{
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, container]);
		};

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
	 * Adds a shadow filter to the given svg root.
	 */
	Editor.prototype.addSvgShadow = function(svgRoot, group, createOnly)
	{
		createOnly = (createOnly != null) ? createOnly : false;
		
		var svgDoc = svgRoot.ownerDocument;
		
		var filter = (svgDoc.createElementNS != null) ?
			svgDoc.createElementNS(mxConstants.NS_SVG, 'filter') : svgDoc.createElement('filter');
		filter.setAttribute('id', this.graph.shadowId);

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
			(group || svgRoot.getElementsByTagName('g')[0]).setAttribute('filter', 'url(#' + this.graph.shadowId + ')');
			
			if (!isNaN(parseInt(svgRoot.getAttribute('width'))))
			{
				svgRoot.setAttribute('width', parseInt(svgRoot.getAttribute('width')) + 6);
				svgRoot.setAttribute('height', parseInt(svgRoot.getAttribute('height')) + 6);
			}
		}
		
		return filter;
	};

	/**
	 * Adds persistence for recent colors
	 */
	if (window.ColorDialog)
	{
		var colorDialogAddRecentColor = ColorDialog.addRecentColor;
		
		ColorDialog.addRecentColor = function(color, max)
		{
			colorDialogAddRecentColor.apply(this, arguments);
			
			mxSettings.setRecentColors(ColorDialog.recentColors);
			mxSettings.save();
		};
		
		var colorDialogResetRecentColors = ColorDialog.resetRecentColors;
		
		ColorDialog.resetRecentColors = function()
		{
			colorDialogResetRecentColors.apply(this, arguments);
			
			mxSettings.setRecentColors(ColorDialog.recentColors);
			mxSettings.save();
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
				return 'xml=' + encodeURIComponent(ui.getFileData(true, null, null, null, null, true));
			};
		};
	}

	// Overridden to add edit shape option
	if (window.StyleFormatPanel != null)
	{
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

			var stylenames = ['plain-gray', 'plain-blue', 'plain-green', 'plain-turquoise',
				'plain-orange', 'plain-yellow', 'plain-red', 'plain-pink', 'plain-purple', 'gray',
				'blue', 'green', 'turquoise', 'orange', 'yellow', 'red', 'pink', 'purple'];

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
				{fill: '#e6d0de', stroke: '#996185', gradient: '#d5739d'}],
				[null, {fill: '#eeeeee', stroke: '#36393d'},
				{fill: '#f9f7ed', stroke: '#36393d'}, {fill: '#ffcc99', stroke: '#36393d'},
				{fill: '#cce5ff', stroke: '#36393d'}, {fill: '#ffff88', stroke: '#36393d'},
				{fill: '#cdeb8b', stroke: '#36393d'}, {fill: '#ffcccc', stroke: '#36393d'}]];
			
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
	
	/**
	 * Graph Overrides
	 */
	Graph.prototype.defaultScrollbars = urlParams['sb'] != '0';

	/**
	 * Specifies if the page should be visible for new files. Default is true.
	 */
	Graph.prototype.defaultPageVisible = urlParams['pv'] != '0';

	/**
	 * Specifies if the page should be visible for new files. Default is true.
	 */
	Graph.prototype.shadowId = 'dropShadow';

	/**
	 * Enables move of bends/segments without selecting.
	 */
	Graph.prototype.edgeMode = urlParams['edge'] != 'move';
		
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
	 * Sets default style (used in editor.get/setGraphXml below)
	 */
	var graphLoadStylesheet = Graph.prototype.loadStylesheet;
	Graph.prototype.loadStylesheet = function()
	{
		graphLoadStylesheet.apply(this, arguments);
		this.currentStyle = 'default-style2';
	};

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
				this.view.getDrawPane().setAttribute('filter', 'url(#' + this.shadowId + ')');
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
	 * Selects first unlocked layer if one exists
	 */
	Graph.prototype.selectUnlockedLayer = function()
	{
		if (this.defaultParent == null)
		{
			var childCount = this.model.getChildCount(this.model.root);
			var cell = null;
			var index = 0;
			
			do
			{
				cell = this.model.getChildAt(this.model.root, index);
			} while (index++ < childCount && mxUtils.getValue(this.getCellStyle(cell), 'locked', '0') == '1')
			
			if (cell != null)
			{
				this.setDefaultParent(cell);
			}
		}
	};

	/**
	 * Specifies special libraries that are loaded via dynamic JS. Add cases
	 * where the filename cannot be worked out from the package name. The
	 * standard scheme for this mapping is stencils/packagename.xml. If there
	 * are multiple XML files, any JS files or any anomalies in the filename or
	 * directory that contains the file, then an entry must be added here and
	 * in EmbedServlet2 for the loading of the shapes to work.
	 */
	// Required to avoid 404 for mockup.xml since naming of mxgraph.mockup.anchor does not contain
	// buttons even though it is defined in the mxMockupButtons.js file. This could only be fixed
	// with aliases for existing shapes or aliases for basenames, but this is essentially the same.
	mxStencilRegistry.libraries['mockup'] = [SHAPES_PATH + '/mockup/mxMockupButtons.js'];
	
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
	mxStencilRegistry.libraries['electrical/transmission'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/transmission.xml'];
	mxStencilRegistry.libraries['mockup/buttons'] = [SHAPES_PATH + '/mockup/mxMockupButtons.js'];
	mxStencilRegistry.libraries['mockup/containers'] = [SHAPES_PATH + '/mockup/mxMockupContainers.js'];
	mxStencilRegistry.libraries['mockup/forms'] = [SHAPES_PATH + '/mockup/mxMockupForms.js'];
	mxStencilRegistry.libraries['mockup/graphics'] = [SHAPES_PATH + '/mockup/mxMockupGraphics.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/markup'] = [SHAPES_PATH + '/mockup/mxMockupMarkup.js'];
	mxStencilRegistry.libraries['mockup/misc'] = [SHAPES_PATH + '/mockup/mxMockupMisc.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/navigation'] = [SHAPES_PATH + '/mockup/mxMockupNavigation.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/text'] = [SHAPES_PATH + '/mockup/mxMockupText.js'];
	mxStencilRegistry.libraries['floorplan'] = [SHAPES_PATH + '/mxFloorplan.js', STENCIL_PATH + '/floorplan.xml'];
	mxStencilRegistry.libraries['bootstrap'] = [SHAPES_PATH + '/mxBootstrap.js', STENCIL_PATH + '/bootstrap.xml'];
	mxStencilRegistry.libraries['gmdl'] = [SHAPES_PATH + '/mxGmdl.js', STENCIL_PATH + '/gmdl.xml'];
	mxStencilRegistry.libraries['cabinets'] = [SHAPES_PATH + '/mxCabinets.js', STENCIL_PATH + '/cabinets.xml'];
	mxStencilRegistry.libraries['archimate'] = [SHAPES_PATH + '/mxArchiMate.js'];
	mxStencilRegistry.libraries['archimate3'] = [SHAPES_PATH + '/mxArchiMate3.js'];
	mxStencilRegistry.libraries['sysml'] = [SHAPES_PATH + '/mxSysML.js'];
	mxStencilRegistry.libraries['eip'] = [SHAPES_PATH + '/mxEip.js', STENCIL_PATH + '/eip.xml'];
	mxStencilRegistry.libraries['networks'] = [SHAPES_PATH + '/mxNetworks.js', STENCIL_PATH + '/networks.xml'];
	mxStencilRegistry.libraries['aws3d'] = [SHAPES_PATH + '/mxAWS3D.js', STENCIL_PATH + '/aws3d.xml'];
	mxStencilRegistry.libraries['pid2inst'] = [SHAPES_PATH + '/pid2/mxPidInstruments.js'];
	mxStencilRegistry.libraries['pid2misc'] = [SHAPES_PATH + '/pid2/mxPidMisc.js', STENCIL_PATH + '/pid/misc.xml'];
	mxStencilRegistry.libraries['pid2valves'] = [SHAPES_PATH + '/pid2/mxPidValves.js'];
	mxStencilRegistry.libraries['pidFlowSensors'] = [STENCIL_PATH + '/pid/flow_sensors.xml'];

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
