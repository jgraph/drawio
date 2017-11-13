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
	Sidebar.prototype.defaultEntries = 'general;uml;er;bpmn;flowchart;basic;arrows2';
	
	/**
	 * 
	 */
	Sidebar.prototype.signs = ['Animals', 'Food', 'Healthcare', 'Nature', 'People', 'Safety', 'Science', 'Sports', 'Tech', 'Transportation', 'Travel'];

	/**
	 * 
	 */
	Sidebar.prototype.ibm = ['Analytics', 'Applications', 'Blockchain', 'Data', 'DevOps', 'Infrastructure', 'Management', 'Miscellaneous', 'Security', 'Social', 'Users'];

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
	Sidebar.prototype.aws3 = ['Analytics', 'Application Services', 'Artificial Intelligence', 'Business Productivity', 'Compute', 'Contact Center', 'Database', 'Desktop and App Streaming', 'Developer Tools', 
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
	                                   {id: 'ibm', prefix: 'ibm', libs: Sidebar.prototype.ibm},
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
           	                           {id: 'atlassian', libs: ['atlassian']},
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
				link.setAttribute('href', 'https://youtu.be/Z0D96ZikMkc');
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
            					  {title: 'Atlassian', id: 'atlassian', image: IMAGE_PATH + '/sidebar-atlassian.png'},
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
            			          {title: 'IBM', id: 'ibm', image: IMAGE_PATH + '/sidebar-ibm.png'},
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
		this.addIBMPalette();

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
		this.addAtlassianPalette();
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
		if (EditorUi.enableLogging && !this.editorUi.isOffline() && page == 0)
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
