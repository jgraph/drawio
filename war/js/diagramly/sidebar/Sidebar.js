(function()
{
	/**
	 * Download from following URL as TSV and convert using https://jgraph.github.io/drawio-tools/tools/convert.html:
	 * https://docs.google.com/spreadsheets/d/1sAL1zn-UtmJtKPH4cLApGjRX-TRSJa5dYdfZ9NKYfRs
	 * Maps package and stencil names to additional tags.
	 */
	Sidebar.prototype.tagIndex = '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';

	/**
	 * See etc/build/README on how to update this file
	 */
	Sidebar.prototype.searchFileUrl = 'search.xml';

	/**
	 * Overrides gear image URL.
	 */
	Sidebar.prototype.gearImage = GRAPH_IMAGE_PATH + '/clipart/Gear_128x128.png';
	
	/**
	 * 
	 */
	Sidebar.prototype.defaultEntries = 'general;images;uml;er;bpmn;flowchart;basic;arrows2';
	
	/**
	 * 
	 */
	Sidebar.prototype.signs = ['Animals', 'Food', 'Healthcare', 'Nature', 'People', 'Safety', 'Science', 'Sports', 'Tech', 'Transportation', 'Travel'];

	/**
	 *
	 */
	Sidebar.prototype.rack = ['General', 'APC', 'Cisco', 'Dell', 'F5', 'HP', 'IBM', 'Oracle'];

	/**
	 *
	 */
	Sidebar.prototype.pids = ['Agitators', 'Apparatus Elements', 'Centrifuges', 'Compressors', 'Compressors ISO', 'Crushers Grinding', 
                              'Driers', 'Engines', 'Feeders', 'Filters', 'Fittings', 'Flow Sensors', 'Heat Exchangers', 'Instruments', 'Misc',
                              'Mixers', 'Piping', 'Pumps', 'Pumps DIN', 'Pumps ISO', 'Separators', 'Shaping Machines', 'Valves', 'Vessels'];

	/**
	 *
	 */
	Sidebar.prototype.cisco = ['Buildings', 'Computers and Peripherals', 'Controllers and Modules', 'Directors', 'Hubs and Gateways', 'Misc',
	                           'Modems and Phones', 'People', 'Routers', 'Security', 'Servers', 'Storage', 'Switches', 'Wireless'];
	
	/**
	 *
	 */
	Sidebar.prototype.sysml = ['Model Elements', 'Blocks', 'Ports and Flows', 'Constraint Blocks', 'Activities', 'Interactions', 'State Machines', 
	                           'Use Cases', 'Allocations', 'Requirements', 'Profiles', 'Stereotypes'];

	/**
	 *
	 */
	Sidebar.prototype.eip = ['Message Construction', 'Message Routing', 'Message Transformation', 'Messaging Channels', 'Messaging Endpoints', 
	                         'Messaging Systems', 'System Management'];

	/**
	 *
	 */
	Sidebar.prototype.gmdl = ['Bottom Navigation', 'Bottom Sheets', 'Buttons', 'Cards', 'Chips', 'Dialogs', 'Dividers', 'Grid Lists', 'Icons', 'Lists', 'Menus', 'Misc', 'Pickers', 
	                          'Selection Controls', 'Sliders', 'Steppers', 'Tabs', 'Text Fields'];

	/**
	 *
	 */
	Sidebar.prototype.aws2 = ['Analytics', 'Application Services', 'Compute', 'Database', 'Developer Tools', 'Enterprise Applications', 'Game Development', 'General', 'Internet of Things',  
	                          'Management Tools', 'Mobile Services', 'Networking', 'On-Demand Workforce', 'SDKs', 'Security and Identity', 'Storage and Content Delivery', 'Groups'];

	/**
	 * 
	 */
	Sidebar.prototype.office = ['Clouds', 'Communications', 'Concepts', 'Databases', 'Devices', 'Security', 'Servers', 'Services', 'Sites', 'Users'];

	/**
	 * 
	 */
	Sidebar.prototype.veeam = ['2D', '3D'];

	/**
	 * 
	 */
	Sidebar.prototype.archimate3 = ['Application', 'Business', 'Composite', 'Implementation and Migration', 'Motivation', 'Physical', 'Relationships', 'Strategy', 'Technology'];

	/**
	 * 
	 */
	Sidebar.prototype.electrical = ['LogicGates', 'Resistors', 'Capacitors', 'Inductors', 'SwitchesRelays', 'Diodes', 'Sources', 'Transistors', 'Misc', 'Audio', 'PlcLadder', 'Abstract', 'Optical', 'VacuumTubes', 'Waveforms', 'Instruments', 'RotMech', 'Transmission'];

	/**
	 *
	 */
	Sidebar.prototype.configuration = [{id: 'general', libs: ['general', 'misc', 'advanced']}, {id: 'uml'}, {id: 'search'}, {id: 'er'},
	                                   {id: 'ios', prefix: 'ios', libs: [''/*prefix is library*/, '7icons', '7ui']}, 
	                                   {id: 'android', prefix: 'android', libs: [''/*prefix is library*/]}, {id: 'aws3d'},
	                                   {id: 'flowchart'}, {id: 'basic'}, {id: 'arrows'}, {id: 'arrows2'}, {id: 'lean_mapping'}, {id: 'citrix'}, {id: 'azure'}, {id: 'network'},
	                                   
	                                   {id: 'mscae', prefix: 'mscae', libs: ['Cloud', 'Enterprise', 'General', 'Intune', 'Other', 'System Center', 'Deprecated']},
	                                   
	                                   {id: 'bpmn', prefix: 'bpmn', libs: [''/*prefix is library*/, 'Gateways', 'Events']},
	                                   {id: 'clipart', prefix: null, libs: ['computer', 'finance', 'clipart', 'networking', 'people', 'telco']},
	                                   {id: 'eip', prefix: 'eip', libs: Sidebar.prototype.eip},
	                                   {id: 'mockups', prefix: 'mockup', libs: ['Buttons', 'Containers', 'Forms', 'Graphics', 'Markup', 'Misc', 'Navigation', 'Text']},
	                                   {id: 'pid2', prefix: 'pid2', libs: ['Agitators', 'Apparatus Elements', 'Centrifuges', 'Compressors', 'Compressors ISO', 'Crushers Grinding', 
	                                          	                          'Driers', 'Engines', 'Feeders', 'Filters', 'Fittings', 'Flow Sensors', 'Heat Exchangers', 'Instruments', 'Misc',
	                                        	                          'Mixers', 'Piping', 'Pumps', 'Pumps DIN', 'Pumps ISO', 'Separators', 'Shaping Machines', 'Valves', 'Vessels']},
           	                           {id: 'signs', prefix: 'signs', libs: Sidebar.prototype.signs},
           	                           {id: 'rack', prefix: 'rack', libs: Sidebar.prototype.rack},
           	                           {id: 'electrical', prefix: 'electrical', libs: Sidebar.prototype.electrical},
           	                           {id: 'aws2', prefix: 'aws2', libs: Sidebar.prototype.aws2},
           	                           {id: 'pid', prefix: 'pid', libs: Sidebar.prototype.pids},
           	                           {id: 'cisco', prefix: 'cisco', libs: Sidebar.prototype.cisco},
           	                           {id: 'office', prefix: 'office', libs: Sidebar.prototype.office},
           	                           {id: 'veeam', prefix: 'veeam', libs: Sidebar.prototype.veeam},
           	                           {id: 'cabinets', libs: ['cabinets']},
           	                           {id: 'floorplan', libs: ['floorplan']},
           	                           {id: 'bootstrap', libs: ['bootstrap']},
	                                   {id: 'gmdl', prefix: 'gmdl', libs: Sidebar.prototype.gmdl},
           	                           {id: 'archimate3', prefix: 'archimate3', libs: Sidebar.prototype.archimate3},
           	                           {id: 'archimate', libs: ['archimate']},
           	                           {id: 'sysml', prefix: 'sysml', libs: Sidebar.prototype.sysml}];
	
	/**
	 * Adds hint for quick tutorial video for certain search terms.
	 */
	var siderbarInsertSearchHint = Sidebar.prototype.insertSearchHint;
	
	Sidebar.prototype.insertSearchHint = function(div, searchTerm, count, page, results, len, more, terms)
	{
		if (terms != null && page == 1)
		{
			var hintText = null;
			
			// Adds hint for text inserts
			if (mxUtils.indexOf(terms, 'text') >= 0)
			{
				hintText = 'Double click anywhere in the diagram to insert text.';
			}
			else
			{
				// Checks if any of the following keywords are in the search terms
				var words = ['line', 'lines', 'arrow', 'arrows', 'connect', 'connection', 'connections',
				             'connector', 'connectors', 'curve', 'curves', 'link', 'links'];
				
				for (var i = 0; i < words.length; i++)
				{
					if (mxUtils.indexOf(terms, words[i]) >= 0)
					{
						hintText = 'Need help with connections?';
						break;
					}
				}
			}
			
			if (hintText != null)
			{
				var link = document.createElement('a');
				link.setAttribute('href', 'https://www.youtube.com/watch?v=8OaMWa4R1SE&t=1');
				link.setAttribute('target', '_blank');
				link.className = 'geTitle';
				link.style.cssText = 'background-color:#ffd350;border-radius:6px;color:black;' +
					'border:1px solid black !important;text-align:center;white-space:normal;' +
					'padding:6px 0px 6px 0px !important;margin:4px 4px 8px 2px;';
				
				mxUtils.write(link, hintText);
				div.appendChild(link);
			}
		}
		
		siderbarInsertSearchHint.apply(this, arguments);
	};

	/**
	 * Toggle palette.
	 */
	Sidebar.prototype.togglePalettes = function(prefix, ids)
	{
		this.showPalettes(prefix, ids);
	};

	/**
	 * Toggle palette.
	 */
	Sidebar.prototype.togglePalette = function(id)
	{
		this.showPalette(id);
	};
	
	/**
	 * Shows or hides palettes.
	 */
	Sidebar.prototype.showPalettes = function(prefix, ids, visible)
	{
		for (var i = 0; i < ids.length; i++)
		{
			this.showPalette(prefix + ids[i], visible);
		}
	};

	
	/**
	 * Shows or hides a palette.
	 */
	Sidebar.prototype.showPalette = function(id, visible)
	{
		var elts = this.palettes[id];
		
		if (elts != null)
		{
			var vis = (visible != null) ? ((visible) ? 'block' : 'none') : (elts[0].style.display == 'none') ? 'block' : 'none';
			
			for (var i = 0; i < elts.length; i++)
			{
				elts[i].style.display = vis;
			}
		}
	};
	
	/**
	 * 
	 */
	Sidebar.prototype.isEntryVisible = function(key)
	{
		for (var i = 0; i < this.configuration.length; i++)
		{
			if (this.configuration[i].id == key)
			{
				var id = (this.configuration[i].libs != null) ? ((this.configuration[i].prefix || '') + this.configuration[i].libs[0]) : key;
				var elts = this.palettes[id];

				if (elts != null)
				{
					return elts[0].style.display != 'none';
				}
			}
		}
		
		return false;
	};
	
	/**
	 * 
	 */
	Sidebar.prototype.showEntries = function(stc, remember, force)
	{
		this.libs = (stc != null && (force || stc.length > 0)) ? stc : ((urlParams['libs'] != null &&
			urlParams['libs'].length > 0) ? decodeURIComponent(urlParams['libs']) : mxSettings.getLibraries());
		var tmp = this.libs.split(';');
		
		for (var i = 0; i < this.configuration.length; i++)
		{
			// Search has separate switch in Extras menu
			if (this.configuration[i].id != 'search')
			{
				this.showPalettes(this.configuration[i].prefix || '', this.configuration[i].libs || [this.configuration[i].id], mxUtils.indexOf(tmp, this.configuration[i].id) >= 0);
			}
		}
		
		if (remember)
		{
			mxSettings.setLibraries(stc);
			mxSettings.save();
		}
	};

	/**
	 * Overrides the sidebar init.
	 */
	Sidebar.prototype.init = function()
	{
		// Defines all entries for the sidebar. This is used in the MoreShapes dialog. Create screenshots using the savesidebar URL parameter and
		// http://www.alderg.com/merge.html for creating a vertical stack of PNG images if multiple sidebars are part of an entry.
		this.entries = [{title: mxResources.get('standard'),
            			entries: [{title: mxResources.get('general'), id: 'general', image: IMAGE_PATH + '/sidebar-general.png'},
            			          {title: mxResources.get('arrows'), id: 'arrows2', image: IMAGE_PATH + '/sidebar-arrows2.png'},
            			          {title: mxResources.get('basic'), id: 'basic', image: IMAGE_PATH + '/sidebar-basic.png'},
            			          {title: mxResources.get('clipart'), id: 'clipart', image: IMAGE_PATH + '/sidebar-clipart.jpg'},
            			          {title: mxResources.get('flowchart'), id: 'flowchart', image: IMAGE_PATH + '/sidebar-flowchart.png'}]},
            			{title: mxResources.get('software'),
            			entries: [{title: mxResources.get('android'), id: 'android', image: IMAGE_PATH + '/sidebar-android.png'},
            			          {title: mxResources.get('bootstrap'), id: 'bootstrap', image: IMAGE_PATH + '/sidebar-bootstrap.png'},
            			          {title: mxResources.get('entityRelation'), id: 'er', image: IMAGE_PATH + '/sidebar-er.png'},
            			          {title: mxResources.get('ios'), id: 'ios', image: IMAGE_PATH + '/sidebar-ios.png'},
            			          {title: mxResources.get('mockups'), id: 'mockups', image: IMAGE_PATH + '/sidebar-mockups.png'},
            			          {title: mxResources.get('uml'), id: 'uml', image: IMAGE_PATH + '/sidebar-uml.png'}]},
            			{title: mxResources.get('networking'),
            			entries: [{title: mxResources.get('aws'), id: 'aws2', image: IMAGE_PATH + '/sidebar-aws.png'},
            			// TODO: Add isometric containers  		                          
            			{title: mxResources.get('aws3d'), id: 'aws3d', image: IMAGE_PATH + '/sidebar-aws3d.png'},
            			          {title: mxResources.get('azure'), id: 'azure', image: IMAGE_PATH + '/sidebar-azure.png'},
            			          {title: 'Cloud & Enterprise', id: 'mscae', image: IMAGE_PATH + '/sidebar-mscae.png'},
            			          {title: mxResources.get('cisco'), id: 'cisco', image: IMAGE_PATH + '/sidebar-cisco.png'},
            			          {title: 'Citrix', id: 'citrix', image: IMAGE_PATH + '/sidebar-citrix.png'},
            			          {title: 'Network', id: 'network', image: IMAGE_PATH + '/sidebar-network.png'},
            			          {title: 'Office', id: 'office', image: IMAGE_PATH + '/sidebar-office.png'},
            			          {title: mxResources.get('rack'), id: 'rack', image: IMAGE_PATH + '/sidebar-rack.png'},
            			          {title: 'Veeam', id: 'veeam', image: IMAGE_PATH + '/sidebar-veeam.png'}]},
            			{title: mxResources.get('business'),
            			entries: [{title: 'ArchiMate 3.0', id: 'archimate3', image: IMAGE_PATH + '/sidebar-archimate3.png'},
            			          {title: mxResources.get('archiMate21'), id: 'archimate', image: IMAGE_PATH + '/sidebar-archimate.png'},
            			          {title: mxResources.get('bpmn'), id: 'bpmn', image: IMAGE_PATH + '/sidebar-bpmn.png'},
            			          {title: mxResources.get('leanMapping'), id: 'lean_mapping', image: IMAGE_PATH + '/sidebar-leanmapping.png'},
            			          {title: mxResources.get('sysml'), id: 'sysml', image: IMAGE_PATH + '/sidebar-sysml.png'}]},
            			{title: mxResources.get('other'),
            			entries: [{title: mxResources.get('cabinets'), id: 'cabinets', image: IMAGE_PATH + '/sidebar-cabinets.png'},
            			          {title: mxResources.get('eip'), id: 'eip', image: IMAGE_PATH + '/sidebar-eip.png'},
            			          {title: mxResources.get('electrical'), id: 'electrical', image: IMAGE_PATH + '/sidebar-electrical.png'},
            			          {title: mxResources.get('floorplans'), id: 'floorplan', image: IMAGE_PATH + '/sidebar-floorplans.png'},
            			          {title: mxResources.get('gmdl'), id: 'gmdl', image: IMAGE_PATH + '/sidebar-gmdl.png'},
            			          {title: mxResources.get('procEng'), id: 'pid', image: IMAGE_PATH + '/sidebar-pid.png'},
            			          {title: mxResources.get('signs'), id: 'signs', image: IMAGE_PATH + '/sidebar-signs.png'}]}];

		// Uses server-side stencil search if online
		this.addStencilsToIndex = this.editorUi.isOffline();
		
		// Contains additional tags for shapes
		this.shapetags = {};
		
		// Adds tags from compressed text file for improved searches.
		if (this.tagIndex != null)
		{
			var text = this.editorUi.editor.graph.decompress(this.tagIndex);
			var lines = text.split('\n');
			
			for (var i = 0; i < lines.length; i++)
			{
				if (lines[i] != null)
				{
					var tags = lines[i].split('\t');
					
					if (tags.length > 1)
					{
						var key = tags[0].toLowerCase().replace(' ', '_');
						var value = mxUtils.trim(tags.slice(1, tags.length).join(' ').toLowerCase());
						
						if (value.length > 0)
						{
							this.shapetags[key] = value;
						}
					}
				}
			}
		}

		this.initPalettes();
		
		// Loads search index to avoid having to pre-parse the stencil files
		// before they are used for stencils that are not programmatically added
		if (!this.editorUi.isOffline())
		{
			mxUtils.get(this.searchFileUrl, mxUtils.bind(this, function(req)
			{
				var node = req.getDocumentElement();
				
				if (node != null)
				{
					var shapes = node.getElementsByTagName('shape');
					
					for (var i = 0; i < shapes.length; i++)
					{
						var style = shapes[i].getAttribute('style');
						var shapeStyle = this.extractShapeStyle(style);
						
						if (style != null && shapeStyle != null)
						{
							var lastDot = shapeStyle.lastIndexOf('.');
							
							if (lastDot > 0)
							{
								var pkg = shapeStyle.substring(0, lastDot);
								var stc = shapeStyle.substring(lastDot + 1, shapeStyle.length);
								var tags = this.getTagsForStencil(pkg, stc, shapes[i].getAttribute('tags'));
								
								// TODO: Use shapetags for programmatic stencils
								if (tags != null)
								{
									// Converts stencil name to lowercase
									var semi = style.indexOf(';');
									style = 'shape=' + pkg + '.' + stc.toLowerCase() + ';' +
										((semi < 0) ? '' : style.substring(semi + 1));
									
									this.createVertexTemplateEntry(style, parseInt(shapes[i].getAttribute('w')),
											parseInt(shapes[i].getAttribute('h')), '', stc.replace(/_/g, ' '),
											null, null, this.filterTags(tags.join(' ')));
								}
							}
						}
					}
				}
			}));
		}
	}
	
	/**
	 * Overridden to add image export via servlet
	 */
	if (urlParams['savesidebar'] == '1')
	{
		Sidebar.prototype.addFoldingHandler = function(title, content, funct)
		{
			var initialized = false;
	
			// Avoids mixed content warning in IE6-8
			if (!mxClient.IS_IE || document.documentMode >= 8)
			{
				title.style.backgroundImage = (content.style.display == 'none') ?
					'url(\'' + this.collapsedImage + '\')' : 'url(\'' + this.expandedImage + '\')';
			}
			
			title.style.backgroundRepeat = 'no-repeat';
			title.style.backgroundPosition = '0% 50%';
	
			var btn = document.createElement('button');
			btn.style.marginLeft = '4px';
			mxUtils.write(btn, 'Save');
			
			mxEvent.addListener(title, 'click', mxUtils.bind(this, function(evt)
			{
				if (mxEvent.getSource(evt).nodeName == 'BUTTON')
				{
					var title2 = title.cloneNode(true);
					title2.style.backgroundImage = '';
					title2.style.textDecoration = 'none';
					title2.style.fontWeight = 'bold';
					title2.style.fontSize = '14px';
					title2.style.color = 'rgb(80, 80, 80)';
					title2.style.width = '456px';
					title2.style.backgroundColor = '#ffffff';
					title2.style.paddingLeft = '6px';
					
					var btn2 = title2.getElementsByTagName('button')[0];
					btn2.parentNode.removeChild(btn2);
					
					var clone = content.cloneNode(true);
					clone.style.backgroundColor = '#ffffff';
					clone.style.borderColor = 'transparent';
					clone.style.width = '456px';
	
					var html = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="https://www.draw.io/styles/grapheditor.css">' +
						'</head><body style="background:#ffffff;font-family:Helvetica,Arial;">' +
						title2.outerHTML + clone.outerHTML + '</body></html>';
	
					clone.style.position = 'absolute';
					window.document.body.appendChild(clone);
					var h = clone.clientHeight + 18;
					clone.parentNode.removeChild(clone);
					
		    		new mxXmlRequest(EXPORT_URL, 'w=456&h=' + h + '&html=' + encodeURIComponent(
		    			this.editorUi.editor.graph.compress(html))).simulate(document, '_blank');
	
					return;
				}
				
				if (content.style.display == 'none')
				{
					if (!initialized)
					{
						initialized = true;
						
						if (funct != null)
						{
							if (btn.parentNode != null)
							{
								btn.parentNode.removeChild(btn);
							}
							
							// Wait cursor does not show up on Mac
							title.style.cursor = 'wait';
							var prev = title.innerHTML;
							title.innerHTML = mxResources.get('loading') + '...';
							
							window.setTimeout(function()
							{
								funct(content);
								title.style.cursor = '';
								title.innerHTML = prev;
								title.appendChild(btn);
							}, 0);
						}
						else
						{
							title.appendChild(btn);
						}
					}
					else
					{
						title.appendChild(btn);
					}
					
					title.style.backgroundImage = 'url(\'' + this.expandedImage + '\')';
					content.style.display = 'block';
				}
				else
				{
					title.style.backgroundImage = 'url(\'' + this.collapsedImage + '\')';
					content.style.display = 'none';
					
					if (btn.parentNode != null)
					{
						btn.parentNode.removeChild(btn);
					}
				}
				
				mxEvent.consume(evt);
			}));
		};
	}
	
	/**
	 * Overridden to use shapetags to improve search results.
	 */
	Sidebar.prototype.extractShapeStyle = function(style)
	{
		if (style != null && style.substring(0, 6) == 'shape=')
		{
			var semi = style.indexOf(';');
			
			if (semi < 0)
			{
				semi = style.length;
			}
			
			return style.substring(6, semi);
		}
		
		return null;
	};
	
	/**
	 * Overridden to use shapetags to improve search results.
	 */
	var sidebarGetTagsForStencil = Sidebar.prototype.getTagsForStencil;
	
	Sidebar.prototype.getTagsForStencil = function(pkg, stc, moreTags)
	{
		var tags = sidebarGetTagsForStencil.apply(this, arguments);
		
		// Adds tags from tags file
		if (this.shapetags != null)
		{
			pkg = pkg.toLowerCase();
			stc = stc.toLowerCase();
			
			if (this.shapetags[pkg] != null)
			{
				tags.push(this.shapetags[pkg]);
			}
			
			stc = pkg + '.' + stc;
			
			if (this.shapetags[stc] != null)
			{
				tags.push(this.shapetags[stc]);
			}
		}

		return tags;
	};
	
	/**
	 * Overrides the sidebar init.
	 */
	Sidebar.prototype.initPalettes = function()
	{
		var imgDir = GRAPH_IMAGE_PATH;
		var dir = STENCIL_PATH;
		var signs = this.signs;
		var rack = this.rack;
		var pids = this.pids;
		var cisco = this.cisco;
		var sysml = this.sysml;
		var eip = this.eip;
		var gmdl = this.gmdl;
		var office = this.office;
		var veeam = this.veeam;
		var archimate3 = this.archimate3;
		var electrical = this.electrical;
		
		if (urlParams['createindex'] == '1')
		{
			mxLog.show();
			mxLog.textarea.value = '';
		}

		this.addSearchPalette(true);
		this.addGeneralPalette(true);
		this.addMiscPalette(false);
		this.addAdvancedPalette(false);
		this.addUmlPalette(false);
		this.addErPalette();
		this.addBasicPalette();
		this.addFlowchartPalette();
		this.addNetworkPalette();
		this.addAzurePalette();
		this.addCitrixPalette();
		this.addMSCAEPalette();
		this.addBpmnPalette(dir, false);
		this.addAWSPalette();
		this.addAWS3DPalette();
		this.addLeanMappingPalette();
		this.addIos7Palette();
		this.addIosPalette();
		this.addAndroidPalette();
		this.addMockupPalette();
		this.addElectricalPalette();
		this.addOfficePalette();
		this.addVeeamPalette();

		this.addStencilPalette('arrows', mxResources.get('arrows'), dir + '/arrows.xml',
				';html=1;' + mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;' + mxConstants.STYLE_STROKEWIDTH + '=2;strokeColor=#000000;');
		
		this.addArrows2Palette();
				
		this.addImagePalette('computer', 'Clipart / Computer', imgDir
				+ '/lib/clip_art/computers/', '_128x128.png', ['Antivirus',
				'Data_Filtering', 'Database', 'Database_Add', 'Database_Minus',
				'Database_Move_Stack', 'Database_Remove', 'Fujitsu_Tablet',
				'Harddrive', 'IBM_Tablet', 'iMac', 'iPad', 'Laptop', 'MacBook',
				'Mainframe', 'Monitor', 'Monitor_Tower',
				'Monitor_Tower_Behind', 'Netbook', 'Network', 'Network_2',
				'Printer', 'Printer_Commercial', 'Secure_System', 'Server',
				'Server_Rack', 'Server_Rack_Empty', 'Server_Rack_Partial',
				'Server_Tower', 'Software', 'Stylus', 'Touch', 'USB_Hub',
				'Virtual_Application', 'Virtual_Machine', 'Virus',
				'Workstation' ], [ 'Antivirus', 'Data Filtering', 'Database',
	            'Database Add', 'Database Minus', 'Database Move Stack',
	            'Database Remove', 'Fujitsu Tablet', 'Harddrive', 'IBMTablet',
	            'iMac', 'iPad', 'Laptop', 'MacBook', 'Mainframe', 'Monitor',
	            'Monitor Tower', 'Monitor Tower Behind', 'Netbook', 'Network',
	            'Network 2', 'Printer', 'Printer Commercial', 'Secure System',
	            'Server', 'Server Rack', 'Server Rack Empty', 'Server Rack Partial',
	            'Server Tower', 'Software', 'Stylus', 'Touch', 'USB Hub',
	            'Virtual Application', 'Virtual Machine', 'Virus', 'Workstation']);
		this.addImagePalette('finance', 'Clipart / Finance', imgDir
				+ '/lib/clip_art/finance/', '_128x128.png', [ 'Arrow_Down',
				'Arrow_Up', 'Coins', 'Credit_Card', 'Dollar', 'Graph',
				'Pie_Chart', 'Piggy_Bank', 'Safe', 'Shopping_Cart',
				'Stock_Down', 'Stock_Up'], ['Arrow_Down', 'Arrow Up',
	            'Coins', 'Credit Card', 'Dollar', 'Graph', 'Pie Chart',
	            'Piggy Bank', 'Safe', 'Shopping Basket', 'Stock Down', 'Stock Up']);
		this.addImagePalette('clipart', 'Clipart / Various', imgDir
				+ '/lib/clip_art/general/', '_128x128.png', [ 'Battery_0',
				'Battery_100', 'Battery_50', 'Battery_75', 'Battery_allstates',
				'Bluetooth', 'Earth_globe', 'Empty_Folder', 'Full_Folder',
				'Gear', 'Keys', 'Lock', 'Mouse_Pointer', 'Plug', 'Ships_Wheel',
				'Star', 'Tire' ], [ 'Battery 0%', 'Battery 100%', 'Battery 50%',
	            'Battery 75%', 'Battery', 'Bluetooth', 'Globe',
	            'Empty Folder', 'Full Folder', 'Gear', 'Keys', 'Lock', 'Mousepointer',
	            'Plug', 'Ships Wheel', 'Star', 'Tire']);
		this.addImagePalette('networking', 'Clipart / Networking', imgDir
				+ '/lib/clip_art/networking/', '_128x128.png', ['Bridge',
				'Certificate', 'Certificate_Off', 'Cloud', 'Cloud_Computer',
				'Cloud_Computer_Private', 'Cloud_Rack', 'Cloud_Rack_Private',
				'Cloud_Server', 'Cloud_Server_Private', 'Cloud_Storage',
				'Concentrator', 'Email', 'Firewall_02', 'Firewall',
				'Firewall-page1', 'Ip_Camera', 'Modem',
				'power_distribution_unit', 'Print_Server',
				'Print_Server_Wireless', 'Repeater', 'Router', 'Router_Icon',
				'Switch', 'UPS', 'Wireless_Router', 'Wireless_Router_N'],
				['Bridge', 'Certificate', 'Certificate Off', 'Cloud', 'Cloud Computer',
				'Cloud Computer Private', 'Cloud Rack', 'Cloud Rack Private',
				'Cloud Server', 'Cloud Server Private', 'Cloud Storage',
				'Concentrator', 'Email', 'Firewall 1', 'Firewall 2',
				'Firewall', 'Camera', 'Modem',
				'Power Distribution Unit', 'Print Server',
				'Print Server Wireless', 'Repeater', 'Router', 'Router Icon',
				'Switch', 'UPS', 'Wireless Router', 'Wireless Router N'],
				 {'Wireless_Router': 'wireless router switch wap wifi access point wlan',
				  'Wireless_Router_N': 'wireless router switch wap wifi access point wlan',
				  'Router': 'router switch',
				  'Router_Icon': 'router switch'});
		this.addImagePalette('people', 'Clipart / People', imgDir
				+ '/lib/clip_art/people/', '_128x128.png', ['Suit_Man',
				'Suit_Man_Black', 'Suit_Man_Blue', 'Suit_Man_Green',
				'Suit_Man_Green_Black', 'Suit_Woman', 'Suit_Woman_Black',
				'Suit_Woman_Blue', 'Suit_Woman_Green',
				'Suit_Woman_Green_Black', 'Construction_Worker_Man',
				'Construction_Worker_Man_Black', 'Construction_Worker_Woman',
				'Construction_Worker_Woman_Black', 'Doctor_Man',
				'Doctor_Man_Black', 'Doctor_Woman', 'Doctor_Woman_Black',
				'Farmer_Man', 'Farmer_Man_Black', 'Farmer_Woman',
				'Farmer_Woman_Black', 'Nurse_Man', 'Nurse_Man_Black',
				'Nurse_Man_Green', 'Nurse_Man_Red', 'Nurse_Woman',
				'Nurse_Woman_Black', 'Nurse_Woman_Green', 'Nurse_Woman_Red',
				'Military_Officer', 'Military_Officer_Black',
				'Military_Officer_Woman', 'Military_Officer_Woman_Black',
				'Pilot_Man', 'Pilot_Man_Black', 'Pilot_Woman',
				'Pilot_Woman_Black', 'Scientist_Man', 'Scientist_Man_Black',
				'Scientist_Woman', 'Scientist_Woman_Black', 'Security_Man',
				'Security_Man_Black', 'Security_Woman', 'Security_Woman_Black',
				'Soldier', 'Soldier_Black', 'Tech_Man', 'Tech_Man_Black',
				'Telesales_Man', 'Telesales_Man_Black', 'Telesales_Woman',
				'Telesales_Woman_Black', 'Waiter', 'Waiter_Black',
				'Waiter_Woman', 'Waiter_Woman_Black', 'Worker_Black',
				'Worker_Man', 'Worker_Woman', 'Worker_Woman_Black']);
		this.addImagePalette('telco', 'Clipart / Telecommunication', imgDir
				+ '/lib/clip_art/telecommunication/', '_128x128.png', [
				'BlackBerry', 'Cellphone', 'HTC_smartphone', 'iPhone',
				'Palm_Treo', 'Signal_tower_off', 'Signal_tower_on' ],
				['BlackBerry', 'Cellphone', 'HTC smartphone', 'iPhone',
				  'Palm Treo', 'Signaltower off', 'Signaltower on']);

		for (var i = 0; i < signs.length; i++)
		{
			this.addStencilPalette('signs' + signs[i], 'Signs / ' + signs[i],
				dir + '/signs/' + signs[i].toLowerCase() + '.xml',
				';html=1;fillColor=#000000;strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;');
		}
		
		for (var i = 0; i < rack.length; i++)
		{
			if (rack[i].toLowerCase() === 'general')
			{
				this.addRackGeneralPalette();
			}
			else if (rack[i].toLowerCase() === 'f5')
			{
				this.addRackF5Palette();
			}
			else
			{
				this.addStencilPalette('rack' + rack[i], 'Rack / ' + rack[i],
					dir + '/rack/' + rack[i].toLowerCase() + '.xml',
					';html=1;labelPosition=right;align=left;spacingLeft=15;dashed=0;shadow=0;fillColor=#ffffff;');
			}
		}

		for (var i = 0; i < pids.length; i++)
		{
			if (pids[i] == 'Instruments')
			{
				this.addPidInstrumentsPalette();
			}
			else if (pids[i] == 'Misc')
			{
				this.addPidMiscPalette();
			}
			else if (pids[i] == 'Valves')
			{
				this.addPidValvesPalette();
			}
			else if (pids[i] == 'Compressors')
			{
				this.addPidCompressorsPalette();
			}
			else if (pids[i] == 'Engines')
			{
				this.addPidEnginesPalette();
			}
			else if (pids[i] == 'Filters')
			{
				this.addPidFiltersPalette();
			}
			else if (pids[i] == 'Flow Sensors')
			{
				this.addPidFlowSensorsPalette();
			}
			else if (pids[i] == 'Piping')
			{
				this.addPidPipingPalette();
			}
			else
			{
				this.addStencilPalette('pid' + pids[i], 'Proc. Eng. / ' + pids[i],
					dir + '/pid/' + pids[i].toLowerCase().replace(' ', '_') + '.xml',
					';html=1;align=center;' + mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;dashed=0;');
			}
		}
		
		for (var i = 0; i < sysml.length; i++)
		{
			if (sysml[i] == 'Model Elements')
			{
				this.addSysMLModelElementsPalette();
			}
			else if (sysml[i] == 'Blocks')
			{
				this.addSysMLBlocksPalette();
			}
			else if (sysml[i] == 'Ports and Flows')
			{
				this.addSysMLPortsAndFlowsPalette();
			}
			else if (sysml[i] == 'Constraint Blocks')
			{
				this.addSysMLConstraintBlocksPalette();
			}
			else if (sysml[i] == 'Activities')
			{
				this.addSysMLActivitiesPalette();
			}
			else if (sysml[i] == 'Interactions')
			{
				this.addSysMLInteractionsPalette();
			}
			else if (sysml[i] == 'State Machines')
			{
				this.addSysMLStateMachinesPalette();
			}
			else if (sysml[i] == 'Use Cases')
			{
				this.addSysMLUseCasesPalette();
			}
			else if (sysml[i] == 'Allocations')
			{
				this.addSysMLAllocationsPalette();
			}
			else if (sysml[i] == 'Requirements')
			{
				this.addSysMLRequirementsPalette();
			}
			else if (sysml[i] == 'Profiles')
			{
				this.addSysMLProfilesPalette();
			}
			else if (sysml[i] == 'Stereotypes')
			{
				this.addSysMLStereotypesPalette();
			}
		}

		for (var i = 0; i < eip.length; i++)
		{
			if (eip[i] == 'Message Construction')
			{
				this.addEipMessageConstructionPalette();
			}
			else if (eip[i] == 'Message Routing')
			{
				this.addEipMessageRoutingPalette();
			}
			else if (eip[i] == 'Message Transformation')
			{
				this.addEipMessageTransformationPalette();
			}
			else if (eip[i] == 'Messaging Channels')
			{
				this.addEipMessagingChannelsPalette();
			}
			else if (eip[i] == 'Messaging Endpoints')
			{
				this.addEipMessagingEndpointsPalette();
			}
			else if (eip[i] == 'Messaging Systems')
			{
				this.addEipMessagingSystemsPalette();
			}
			else if (eip[i] == 'System Management')
			{
				this.addEipSystemManagementPalette();
			}
		}
		
		for (var i = 0; i < cisco.length; i++)
		{
			this.addStencilPalette('cisco' + cisco[i], 'Cisco / ' + cisco[i],
				dir + '/cisco/' + cisco[i].toLowerCase().replace(/ /g, '_') + '.xml',
				';html=1;dashed=0;fillColor=#036897;strokeColor=#ffffff;strokeWidth=2;verticalLabelPosition=bottom;verticalAlign=top', null, null, 1.6);
		}

		this.addFloorplanPalette();
		this.addBootstrapPalette();

		for (var i = 0; i < gmdl.length; i++)
		{
			if (gmdl[i] == 'Bottom Navigation')
			{
				this.addGMDLBottomNavigationPalette();
			}
			else if (gmdl[i] == 'Bottom Sheets')
			{
				this.addGMDLBottomSheetsPalette();
			}
			else if (gmdl[i] == 'Buttons')
			{
				this.addGMDLButtonsPalette();
			}
			else if (gmdl[i] == 'Cards')
			{
				this.addGMDLCardsPalette();
			}
			else if (gmdl[i] == 'Chips')
			{
				this.addGMDLChipsPalette();
			}
			else if (gmdl[i] == 'Dialogs')
			{
				this.addGMDLDialogsPalette();
			}
			else if (gmdl[i] == 'Dividers')
			{
				this.addGMDLDividersPalette();
			}
			else if (gmdl[i] == 'Grid Lists')
			{
				this.addGMDLGridListsPalette();
			}
			else if (gmdl[i] == 'Icons')
			{
				this.addGMDLIconsPalette();
			}
			else if (gmdl[i] == 'Lists')
			{
				this.addGMDLListsPalette();
			}
			else if (gmdl[i] == 'Menus')
			{
				this.addGMDLMenusPalette();
			}
			else if (gmdl[i] == 'Misc')
			{
				this.addGMDLMiscPalette();
			}
			else if (gmdl[i] == 'Pickers')
			{
				this.addGMDLPickersPalette();
			}
			else if (gmdl[i] == 'Selection Controls')
			{
				this.addGMDLSelectionControlsPalette();
			}
			else if (gmdl[i] == 'Sliders')
			{
				this.addGMDLSlidersPalette();
			}
			else if (gmdl[i] == 'Steppers')
			{
				this.addGMDLSteppersPalette();
			}
			else if (gmdl[i] == 'Tabs')
			{
				this.addGMDLTabsPalette();
			}
			else if (gmdl[i] == 'Text Fields')
			{
				this.addGMDLTextFieldsPalette();
			}
		}

		this.addCabinetsPalette();
		this.addArchimate3Palette();
		this.addArchiMatePalette();
		
		// LATER: Check if conflicts with restore libs after loading file
		this.showEntries();
	};
	
	/**
	 * Overridden to manually create search index for stencil files which are not pre-loaded
	 * and no entries are created programmatically.
	 */
	if (urlParams['createindex'] == '1')
	{
		var sidebarAddStencilPalette = Sidebar.prototype.addStencilPalette;
		
		Sidebar.prototype.addStencilPalette = function(id, title, stencilFile, style, ignore, onInit, scale, tags)
		{
			sidebarAddStencilPalette.apply(this, arguments);
			scale = (scale != null) ? scale : 1;
	
			// Used for creating index
			mxStencilRegistry.loadStencilSet(stencilFile, mxUtils.bind(this, function(packageName, stencilName, displayName, w, h)
			{
				if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0)
				{
					var tmpTags = (tags != null) ? tags[stencilName] : null;
	
					mxLog.debug('<shape style="shape=' + packageName + stencilName + style + '" ' +
						'w="' + Math.round(w * scale) + '" h="' + Math.round(h * scale) + '"' +
						((tmpTags != null) ? ' tags="' + tmpTags + '"' : '') + '/>');
				}
			}), true);
		};
	}
	
	/**
	 * Adds server icon results to local search results
	 */
	var sidebarSearchEntries = Sidebar.prototype.searchEntries;
	
	Sidebar.prototype.searchEntries = function(searchTerms, count, page, success, error)
	{
		var succ = success;
		
		// Logs search terms for improving search results
		if (this.editorUi.enableLogging && !this.editorUi.isOffline() && page == 0)
		{
			var img = new Image();
			var logDomain = window.DRAWIO_LOG_URL != null ? window.DRAWIO_LOG_URL : '';
			img.src = logDomain + '/log?severity=CONFIG&msg=shapesearch:' + encodeURIComponent(searchTerms) + '&v=' + encodeURIComponent(EditorUi.VERSION);
		}
		
		success = mxUtils.bind(this, function(results, len, more, terms)
		{
			if (!this.editorUi.isOffline() && results.length <= count / 4)
			{
				var pg = page - Math.ceil((len - count / 4) / count);

				mxUtils.get(ICONSEARCH_PATH + '?v=2&q=' + encodeURIComponent(searchTerms) +
					'&p=' + pg + '&c=' + count, mxUtils.bind(this, function(req)
				{
					try
					{
						if (req.getStatus() >= 200 && req.getStatus() <= 299)
						{
							var res = JSON.parse(req.getText());
							
							for (var i = 0; i < res.icons.length; i++)
							{
								var sizes = res.icons[i].raster_sizes;
								var index = sizes.length - 1;
								
								while (index > 0 && sizes[index].size > 128)
								{
									index--;
								}
		
								var size = sizes[index].size;
								var url = sizes[index].formats[0].preview_url;
		
								if (size != null && url != null)
								{
									(mxUtils.bind(this, function(s, u)
									{
										results.push(mxUtils.bind(this, function()
										{
											return this.createVertexTemplate('shape=image;html=1;verticalAlign=top;' +
												'verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;imageAspect=0;' +
												'aspect=fixed;image=' + u, s, s, '');
										}));
									}))(size, url);
								}
							}
		
							succ(results, (page - 1) * count + results.length, res.icons.length == count, terms);
						}
						else
						{
							succ(results, len, false, terms);
							this.editorUi.handleError({message: mxResources.get('unknownError')});
						}
					}
					catch (e)
					{
						succ(results, len, false, terms);
						this.editorUi.handleError(e);
					}
				},
				function()
				{
					succ(results, len, false, terms);
				}));
			}
			else
			{
				succ(results, len, more || !this.editorUi.isOffline(), terms);
			}
		});
		
		sidebarSearchEntries.apply(this, arguments);
	};

	/**
	 * Adds a click handler for inserting the cell as target for dangling edge.
	 */
	var sidebarItemClicked = Sidebar.prototype.itemClicked;
	
	Sidebar.prototype.itemClicked = function(cells, ds, evt)
	{
		var graph = this.editorUi.editor.graph;
		var handled = false;
		
		if (cells != null && graph.getSelectionCount() == 1 && graph.getModel().isVertex(cells[0]))
		{
			var target = graph.cloneCells(cells)[0];
			
			// Inserts cell as target of selected edge if not connected
			if (graph.getModel().isEdge(graph.getSelectionCell()) && graph.getModel().getTerminal(graph.getSelectionCell(), false) == null &&
				graph.getModel().isVertex(target))
			{
				graph.getModel().beginUpdate();
				try
				{
					var edgeState = graph.view.getState(graph.getSelectionCell());
					
					if (edgeState != null)
					{
						var tr = graph.view.translate;
						var s = graph.view.scale;
						var pt = edgeState.absolutePoints[edgeState.absolutePoints.length - 1];

						target.geometry.x = pt.x / s - tr.x - target.geometry.width / 2;
						target.geometry.y = pt.y / s - tr.y - target.geometry.height / 2;
					}
					
					graph.addCell(target);
					graph.getModel().setTerminal(graph.getSelectionCell(), target, false);
				}
				finally
				{
					graph.getModel().endUpdate();
				}
				
				graph.scrollCellToVisible(target);
				graph.setSelectionCell(target);
				handled = true;
			}
		}
		
		if (!handled)
		{
			sidebarItemClicked.apply(this, arguments);
		}
	};
})();
