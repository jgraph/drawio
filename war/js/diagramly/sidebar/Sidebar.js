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
	 * Aliases for IDs in the libs parameter.
	 */
	Sidebar.prototype.libAliases = {'aws2': 'aws3'};
	
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
	Sidebar.prototype.gcp = ['Cards', 'Big Data', 'Compute', 'Developer Tools', 'Extras', 'Identity and Security', 'Machine Learning', 'Management Tools', 'Networking', 'Storage Databases'];
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
	Sidebar.prototype.aws3 = ['Analytics', 'Application Services', 'Artificial Intelligence', 'Business Productivity', 'Compute', 'Database', 'Desktop and App Streaming', 'Developer Tools', 
	                          'Game Development', 'General', 'Groups', 'Internet of Things',  
	                          'Management Tools', 'Messaging', 'Migration', 'Mobile Services', 'Networking and Content Delivery', 'On Demand Workforce', 'SDKs', 'Security Identity and Compliance', 'Storage'];
	
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
           	                           {id: 'gcp', prefix: 'gcp', libs: Sidebar.prototype.gcp},
           	                           {id: 'rack', prefix: 'rack', libs: Sidebar.prototype.rack},
           	                           {id: 'electrical', prefix: 'electrical', libs: Sidebar.prototype.electrical},
           	                           {id: 'aws2', prefix: 'aws2', libs: Sidebar.prototype.aws2},
           	                           {id: 'aws3', prefix: 'aws3', libs: Sidebar.prototype.aws3},
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
           	                           {id: 'webicons', libs: ['webicons', 'weblogos']},
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
				             'connector', 'connectors', 'curve', 'curves', 'link', 'links', 'directed',
				             'directional', 'bidirectional'];
				
				for (var i = 0; i < words.length; i++)
				{
					if (mxUtils.indexOf(terms, words[i]) >= 0)
					{
						hintText = 'Need help with connections?';
						break;
					}
				}
			}
			
			if (hintText != null && !this.hideSearchHint)
			{
				var link = document.createElement('a');
				link.setAttribute('href', 'https://www.youtube.com/watch?v=8OaMWa4R1SE&t=1');
				link.setAttribute('target', '_blank');
				link.className = 'geTitle';
				link.style.cssText = 'background-color:#ffd350;border-radius:6px;color:black;' +
					'border:1px solid black !important;text-align:center;white-space:normal;' +
					'padding:6px 0px 6px 0px !important;margin:4px 4px 8px 2px;';
				mxUtils.write(link, hintText);
				
				// Adds close button
				var img = document.createElement('img');
				img.setAttribute('src', Dialog.prototype.closeImage);
				img.setAttribute('title', mxResources.get('hide'));
				img.className = 'geDialogClose';
				img.style.position = 'relative';
				img.style.cursor = 'default';
				img.style.top = '1px';
				img.style.right = '0px';
				
				mxEvent.addListener(img, 'click', mxUtils.bind(this, function(evt)
				{
					link.parentNode.removeChild(link);
					this.hideSearchHint = true;
					mxEvent.consume(evt);
				}));
				
				link.appendChild(img);
				div.appendChild(link);
				
				// Shows hint only once
				this.hideSearchHint = true;
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
		
		// Maps library names via the alias table
		for (var i = 0; i < tmp.length; i++)
		{
			tmp[i] = this.libAliases[tmp[i]] || tmp[i];
		}
		
		for (var i = 0; i < this.configuration.length; i++)
		{
			// Search has separate switch in Extras menu
			if (this.configuration[i].id != 'search')
			{
				this.showPalettes(this.configuration[i].prefix || '',
					this.configuration[i].libs || [this.configuration[i].id],
					mxUtils.indexOf(tmp, this.configuration[i].id) >= 0);
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
            			          {title: mxResources.get('clipart'), id: 'clipart', image: IMAGE_PATH + '/sidebar-clipart.png'},
            			          {title: mxResources.get('flowchart'), id: 'flowchart', image: IMAGE_PATH + '/sidebar-flowchart.png'}]},
            			{title: mxResources.get('software'),
            			entries: [{title: mxResources.get('android'), id: 'android', image: IMAGE_PATH + '/sidebar-android.png'},
            			          {title: mxResources.get('bootstrap'), id: 'bootstrap', image: IMAGE_PATH + '/sidebar-bootstrap.png'},
            			          {title: mxResources.get('entityRelation'), id: 'er', image: IMAGE_PATH + '/sidebar-er.png'},
            			          {title: mxResources.get('ios'), id: 'ios', image: IMAGE_PATH + '/sidebar-ios.png'},
            			          {title: mxResources.get('mockups'), id: 'mockups', image: IMAGE_PATH + '/sidebar-mockups.png'},
            			          {title: mxResources.get('uml'), id: 'uml', image: IMAGE_PATH + '/sidebar-uml.png'}]},
            			{title: mxResources.get('networking'),
            			entries: [{title: mxResources.get('aws'), id: 'aws3', image: IMAGE_PATH + '/sidebar-aws3.png'},
            			// TODO: Add isometric containers  		                          
            			          {title: mxResources.get('aws3d'), id: 'aws3d', image: IMAGE_PATH + '/sidebar-aws3d.png'},
            			          {title: mxResources.get('azure'), id: 'azure', image: IMAGE_PATH + '/sidebar-azure.png'},
            			          {title: 'Cloud & Enterprise', id: 'mscae', image: IMAGE_PATH + '/sidebar-mscae.png'},
            			          {title: mxResources.get('cisco'), id: 'cisco', image: IMAGE_PATH + '/sidebar-cisco.png'},
            			          {title: 'Citrix', id: 'citrix', image: IMAGE_PATH + '/sidebar-citrix.png'},
            			          {title: 'Google Cloud Platform', id: 'gcp', image: IMAGE_PATH + '/sidebar-gcp.png'},
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
            			          // TODO add to mxResources
            			          {title: 'Web Icons', id: 'webicons', image: IMAGE_PATH + '/sidebar-webIcons.png'},
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
		var gcp = this.gcp;
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
		this.addAWS3Palette();
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
				'Nurse_Woman',
				'Nurse_Woman_Black',
				'Military_Officer', 'Military_Officer_Black',
				'Military_Officer_Woman', 'Military_Officer_Woman_Black',
				'Pilot_Man', 'Pilot_Man_Black', 'Pilot_Woman',
				'Pilot_Woman_Black', 'Scientist_Man', 'Scientist_Man_Black',
				'Scientist_Woman', 'Scientist_Woman_Black', 'Security_Man',
				'Security_Man_Black', 'Security_Woman', 'Security_Woman_Black',
				'Tech_Man', 'Tech_Man_Black',
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
		
		for (var i = 0; i < gcp.length; i++)
		{
			if (gcp[i].toLowerCase() === 'cards')
			{
				this.addGoogleCloudPlatformCardsPalette();
			}
			else
			{
				this.addStencilPalette('gcp' + gcp[i], 'GCP / ' + gcp[i],
						dir + '/gcp/' + gcp[i].toLowerCase().replace(/ /g, '_') + '.xml',
						';html=1;fillColor=#4387FD;gradientColor=#4683EA;strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;');
			}
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
		this.addWebIconsPalette();
		this.addWebLogosPalette();
		
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
			try
			{
				var img = new Image();
				var logDomain = window.DRAWIO_LOG_URL != null ? window.DRAWIO_LOG_URL : '';
				img.src = logDomain + '/log?severity=CONFIG&msg=shapesearch:' + encodeURIComponent(searchTerms) + '&v=' + encodeURIComponent(EditorUi.VERSION);
		 	}
	    	catch (e)
	    	{
	    		// ignore
	    	}
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
							try
							{
								var res = JSON.parse(req.getText());
								
								if (res == null || res.icons == null)
								{
									succ(results, len, false, terms);
									this.editorUi.handleError(res);
								}
								else
								{
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
							}
							catch (e)
							{
								succ(results, len, false, terms);
								this.editorUi.handleError(e);
							}
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
