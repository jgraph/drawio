(function()
{
	/**
	 * Download from following URL as TSV and convert using https://jgraph.github.io/drawio-tools/tools/convert.html:
	 * https://docs.google.com/spreadsheets/d/1sAL1zn-UtmJtKPH4cLApGjRX-TRSJa5dYdfZ9NKYfRs
	 * Maps package and stencil names to additional tags.
	 */
	Sidebar.prototype.tagIndex = '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';

	/**
	 * To update this, go to https://test.draw.io/?dev=1&test=1&drawdev=1&demo=1&createindex=1 and convert
	 * the contents of mxLog (<shapes>...</shapes>) using https://jgraph.github.io/drawio-tools/tools/convert.html
	 */
	Sidebar.prototype.searchFileData = '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';

	/**
	 * Overrides gear image URL.
	 */
	Sidebar.prototype.gearImage = GRAPH_IMAGE_PATH + '/clipart/Gear_128x128.png';
	
	/**
	 * Aliases for IDs in the libs parameter.
	 */
	Sidebar.prototype.libAliases = {'aws2': 'aws3', 'gcp' : 'gcp2'};
	
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
	Sidebar.prototype.allied_telesis = ['Buildings', 'Computer and Terminals', 'Media Converters', 'Security', 'Storage', 'Switch', 'Wireless'];

	/**
	 * 
	 */
	Sidebar.prototype.gcp = ['Cards', 'Big Data', 'Compute', 'Developer Tools', 'Extras', 'Identity and Security', 'Machine Learning', 'Management Tools', 'Networking', 'Storage Databases'];
	
	/**
	 * 
	 */
	Sidebar.prototype.gcp2 = ['Paths', 'Zones', 'Service Cards', 'Compute', 'API Platform and Ecosystems', 'Identity and Security', 'Big Data', 'Data Transfer', 'Cloud AI', 'Internet of Things', 'Storage and Databases', 'Management Tools', 'Networking', 'Developer Tools', 'Expanded Product Cards', 'User Device Cards', 'Product Cards'];
	
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
	Sidebar.prototype.cisco_safe = ['Architecture', 'Capability', 'Design', 'Threat'];
	
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
	Sidebar.prototype.veeam = ['Data Center', 'Misc', 'Software', 'Storage', 'UsersStatus', 'VASComponents', 'Backup Replication', 'Products', 'VMs and Tape', '2D', '3D'];

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
	                                   {id: 'flowchart'}, {id: 'basic'}, {id: 'infographic'}, {id: 'arrows'}, {id: 'arrows2'}, {id: 'lean_mapping'}, {id: 'citrix'}, {id: 'azure'}, {id: 'network'}, {id: 'sitemap'}, 
	                                   
	                                   {id: 'mscae', prefix: 'mscae', libs: ['Cloud', 'Enterprise', 'General', 'General Symbols', 'Intune', 'OMS', 'OpsManager', 'Other', 'System Center', 'Virtual Machine', 'Deprecated', 'Cloud Color', 'Deprecated Color']},
	                                   
	                                   {id: 'bpmn', prefix: 'bpmn', libs: [''/*prefix is library*/, 'Gateways', 'Events']},
	                                   {id: 'clipart', prefix: null, libs: ['computer', 'finance', 'clipart', 'networking', 'people', 'telco']},
	                                   {id: 'ibm', prefix: 'ibm', libs: Sidebar.prototype.ibm},
	                                   {id: 'allied_telesis', prefix: 'allied_telesis', libs: Sidebar.prototype.allied_telesis},
	                                   {id: 'eip', prefix: 'eip', libs: Sidebar.prototype.eip},
	                                   {id: 'mockups', prefix: 'mockup', libs: ['Buttons', 'Containers', 'Forms', 'Graphics', 'Markup', 'Misc', 'Navigation', 'Text']},
	                                   {id: 'pid2', prefix: 'pid2', libs: ['Agitators', 'Apparatus Elements', 'Centrifuges', 'Compressors', 'Compressors ISO', 'Crushers Grinding', 
	                                          	                          'Driers', 'Engines', 'Feeders', 'Filters', 'Fittings', 'Flow Sensors', 'Heat Exchangers', 'Instruments', 'Misc',
	                                        	                          'Mixers', 'Piping', 'Pumps', 'Pumps DIN', 'Pumps ISO', 'Separators', 'Shaping Machines', 'Valves', 'Vessels']},
           	                           {id: 'signs', prefix: 'signs', libs: Sidebar.prototype.signs},
           	                           {id: 'gcp', prefix: 'gcp', libs: Sidebar.prototype.gcp},
           	                           {id: 'gcp2', prefix: 'gcp2', libs: Sidebar.prototype.gcp2},
           	                           {id: 'rack', prefix: 'rack', libs: Sidebar.prototype.rack},
           	                           {id: 'electrical', prefix: 'electrical', libs: Sidebar.prototype.electrical},
           	                           {id: 'aws2', prefix: 'aws2', libs: Sidebar.prototype.aws2},
           	                           {id: 'aws3', prefix: 'aws3', libs: Sidebar.prototype.aws3},
           	                           {id: 'pid', prefix: 'pid', libs: Sidebar.prototype.pids},
           	                           {id: 'cisco', prefix: 'cisco', libs: Sidebar.prototype.cisco},
           	                           {id: 'cisco_safe', prefix: 'cisco_safe', libs: Sidebar.prototype.cisco_safe},
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
            			          {title: 'Sitemap', id: 'sitemap', image: IMAGE_PATH + '/sidebar-sitemap.png'},
            			          {title: mxResources.get('uml'), id: 'uml', image: IMAGE_PATH + '/sidebar-uml.png'}]},
            			{title: mxResources.get('networking'),
            			entries: [{title: mxResources.get('aws'), id: 'aws3', image: IMAGE_PATH + '/sidebar-aws3.png'},
            			// TODO: Add isometric containers  		                          
            					  {title: 'Allied Telesis', id: 'allied_telesis', image: IMAGE_PATH + '/sidebar-allied_telesis.png'},
            			          {title: mxResources.get('aws3d'), id: 'aws3d', image: IMAGE_PATH + '/sidebar-aws3d.png'},
            			          {title: mxResources.get('azure'), id: 'azure', image: IMAGE_PATH + '/sidebar-azure.png'},
            			          {title: 'Cloud & Enterprise', id: 'mscae', image: IMAGE_PATH + '/sidebar-mscae.png'},
            			          {title: mxResources.get('cisco'), id: 'cisco', image: IMAGE_PATH + '/sidebar-cisco.png'},
            			          {title: 'Cisco Safe', id: 'cisco_safe', image: IMAGE_PATH + '/sidebar-cisco_safe.png'},
            			          {title: 'Citrix', id: 'citrix', image: IMAGE_PATH + '/sidebar-citrix.png'},
            			          {title: 'Google Cloud Platform', id: 'gcp2', image: IMAGE_PATH + '/sidebar-gcp2.png'},
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
            					  {title: 'Infographic', id: 'infographic', image: IMAGE_PATH + '/sidebar-infographic.png'},
            			          {title: mxResources.get('eip'), id: 'eip', image: IMAGE_PATH + '/sidebar-eip.png'},
            			          {title: mxResources.get('electrical'), id: 'electrical', image: IMAGE_PATH + '/sidebar-electrical.png'},
            			          {title: mxResources.get('floorplans'), id: 'floorplan', image: IMAGE_PATH + '/sidebar-floorplans.png'},
            			          {title: mxResources.get('gmdl'), id: 'gmdl', image: IMAGE_PATH + '/sidebar-gmdl.png'},
            			          {title: mxResources.get('procEng'), id: 'pid', image: IMAGE_PATH + '/sidebar-pid.png'},
            			          // TODO add to mxResources
            			          {title: 'Web Icons', id: 'webicons', image: IMAGE_PATH + '/sidebar-webIcons.png'},
            			          {title: mxResources.get('signs'), id: 'signs', image: IMAGE_PATH + '/sidebar-signs.png'}]}];

		// Uses search.xml index file instead (faster load times)
		this.addStencilsToIndex = false;
		
		// Contains additional tags for shapes
		this.shapetags = {};

		// Adds tags from compressed text file for improved searches
		if (this.tagIndex != null)
		{
			this.addTagIndex(this.editorUi.editor.graph.decompress(this.tagIndex));
			this.tagIndex = null;
		}
		
		this.initPalettes();
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
	
					var parser = new DOMParser();
					var doc = parser.parseFromString('<body style="background:#ffffff;font-family:Helvetica,Arial;">' +
							title2.outerHTML + clone.outerHTML + '</body>', 'text/html');
					
					this.editorUi.convertImages(doc.documentElement, mxUtils.bind(this, function(body)
					{
						var html = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" ' +
							'href="https://www.draw.io/styles/grapheditor.css"></head>' +
							mxUtils.getXml(body) + '</html>';
		
						clone.style.position = 'absolute';
						window.document.body.appendChild(clone);
						var h = clone.clientHeight + 18;
						clone.parentNode.removeChild(clone);
						
						this.editorUi.confirm('Image data created', mxUtils.bind(this, function()
						{
				    		new mxXmlRequest(EXPORT_URL, 'w=456&h=' + h + '&html=' + encodeURIComponent(
					    			this.editorUi.editor.graph.compress(html))).simulate(document, '_blank');
						}), null, mxResources.get('save'), mxResources.get('cancel'));
					}));
					
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
	Sidebar.prototype.addTagIndex = function(text)
	{
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
	};
	
	/**
	 * Overrides the sidebar init.
	 */
	Sidebar.prototype.addSearchFileData = function(node)
	{
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
		var cisco_safe = this.cisco_safe;
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
		this.addInfographicPalette();
		this.addAndroidPalette();
		this.addMockupPalette();
		this.addElectricalPalette();
		this.addOfficePalette();
		this.addVeeamPalette();
		this.addIBMPalette();
		this.addAlliedTelesisPalette();
		this.addSitemapPalette();
		this.addGCP2Palette();

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
				';html=1;dashed=0;fillColor=#036897;strokeColor=#ffffff;strokeWidth=2;verticalLabelPosition=bottom;verticalAlign=top;align=center;outlineConnect=0;', null, null, 1.6);
		}

		this.addCiscoSafePalette();
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
		
		// Lazy-load indices
		if (this.searchFileData != null)
		{
			this.addSearchFileData(mxUtils.parseXml(this.editorUi.editor.graph.decompress(this.searchFileData)).documentElement);
			
			this.searchFileData = null;
		}
		
		// Logs search terms for improving search results
		if (!this.editorUi.isOffline() && page == 0)
		{
			this.editorUi.logEvent({category: 'Sidebar', action: 'search', label: searchTerms});
		}
		
		if (ICONSEARCH_PATH != null)
		{
			success = mxUtils.bind(this, function(results, len, more, terms)
			{
				if (!this.editorUi.isOffline() && results.length <= count / 4)
				{
					var pg = page - Math.ceil((len - count / 4) / count);
	
					mxUtils.get(ICONSEARCH_PATH + '?q=' + encodeURIComponent(searchTerms) +
						'&p=' + pg + '&c=' + count, mxUtils.bind(this, function(req)
					{
						try
						{
							if (req.getStatus() >= 200 && req.getStatus() <= 299)
							{
								// Ignore without error if no response
								if (req.getText() != null && req.getText().length > 0)
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
		}
		
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
