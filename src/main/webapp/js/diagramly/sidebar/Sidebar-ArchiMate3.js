(function()
{
	// Adds ArchiMate v3.2 shapes
	Sidebar.prototype.addArchimate3Palette = function()
	{
		this.setCurrentSearchEntryLibrary('archimate3', 'archimate3Generic');
		this.addArchimate3GenericPalette();
		this.setCurrentSearchEntryLibrary('archimate3', 'archimate3Relationships');
		this.addArchimate3RelationshipsPalette();
		this.setCurrentSearchEntryLibrary('archimate3', 'archimate3Motivation');
		this.addArchimate3MotivationPalette();
		this.setCurrentSearchEntryLibrary('archimate3', 'archimate3Strategy');
		this.addArchimate3StrategyPalette();
		this.setCurrentSearchEntryLibrary('archimate3', 'archimate3Business');
		this.addArchimate3BusinessPalette();
		this.setCurrentSearchEntryLibrary('archimate3', 'archimate3Application');
		this.addArchimate3ApplicationPalette();
		this.setCurrentSearchEntryLibrary('archimate3', 'archimate3Technology');
		this.addArchimate3TechnologyPalette();
		this.setCurrentSearchEntryLibrary('archimate3', 'archimate3Implementation and Migration');
		this.addArchimate3ImplementationAndMigrationPalette();
	};
	
	Sidebar.prototype.addArchimate3GenericPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#EBEBEB;shape=mxgraph.archimate3.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate3';
		var dt = 'archimate generic ';
		
		var w = 1.0;
		var h = 1.0;
		
		var fns =
		[
			this.createVertexTemplateEntry(am + 'application;appType=generic;archiType=square;', 
					w * 150, h * 75, 'Internal Active Structure Element', 'Internal Active Structure Element', null, null, this.getTagsForStencil(gn, '', dt + 'internal active structure element').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=collab;archiType=square;', 
					w * 150, h * 75, 'Collaboration', 'Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'collaboration;', 
					w * 60, h * 35, '', 'Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=interface;archiType=square;', 
					w * 150, h * 75, 'Interface', 'Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'interface;', 
					w * 70, h * 35, '', 'Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=generic;archiType=rounded;', 
					w * 150, h * 75, 'Internal Behavior Element', 'Internal Behavior Element', null, null, this.getTagsForStencil(gn, '', dt + 'internal behavior element').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=proc;archiType=rounded;', 
					w * 150, h * 75, 'Process', 'Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'process;', 
					w * 60, h * 35, '', 'Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=func;archiType=rounded;', 
					w * 150, h * 75, 'Function', 'Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'function;', 
					w * 45, h * 45, '', 'Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=interaction;archiType=rounded;', 
					w * 150, h * 75, 'Interaction', 'Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'interaction').join(' ')),
			this.createVertexTemplateEntry(am + 'interaction;', 
					w * 45, h * 45, '', 'Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'interaction').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=serv;archiType=rounded', 
					w * 150, h * 75, 'Service', 'Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'service;', 
					w * 60, h * 35, '', 'Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=event;archiType=rounded', 
					w * 150, h * 75, 'Event', 'Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'event;', 
					w * 60, h * 35, '', 'Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=passive;archiType=square', 
					w * 150, h * 75, 'Passive Structure Element', 'Passive Structure Element', null, null, this.getTagsForStencil(gn, '', dt + 'passive structure element').join(' ')),
			this.createVertexTemplateEntry(am + 'passive;', 
					w * 60, h * 35, '', 'Passive Structure Element', null, null, this.getTagsForStencil(gn, '', dt + 'passive structure element').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=generic;archiType=oct;', 
					w * 150, h * 75, 'Motivation Element', 'Motivation Element', null, null, this.getTagsForStencil(gn, '', dt + 'motivation element').join(' ')),
			this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=grouping;archiType=square;dashed=1;fillColor=none;', 
					w * 150, h * 75, 'Grouping', 'Grouping', null, null, this.getTagsForStencil(gn, '', dt + 'grouping').join(' ')),
			this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.grouping;fillColor=none;dashed=1;', 
					w * 60, h * 35, '', 'Grouping', null, null, this.getTagsForStencil(gn, '', dt + 'grouping').join(' ')),
			this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.application;appType=location;archiType=square;fillColor=#efd1e4;', 
					w * 150, h * 75, 'Location', 'Location', null, null, this.getTagsForStencil(gn, '', dt + 'location').join(' ')),
			this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate3.locationIcon;fillColor=#efd1e4;aspect=fixed;', 
					w * 35, h * 50, '', 'Location', null, null, this.getTagsForStencil(gn, '', dt + 'location').join(' '))
		];
			
		this.addPalette('archimate3Generic', 'Archimate 3.2 / Generic', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addArchimate3ApplicationPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#99ffff;shape=mxgraph.archimate3.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate3';
		var dt = 'archimate application layer ';
		
		var w = 1.0;
		var h = 1.0;
		
		var fns =
		[
			this.createVertexTemplateEntry(am + 'application;appType=comp;archiType=square;', 
					w * 150, h * 75, 'Application Component', 'Application Component', null, null, this.getTagsForStencil(gn, '', dt + 'component').join(' ')),
			this.createVertexTemplateEntry(am + 'component;', 
					w * 48, h * 40, '', 'Component', null, null, this.getTagsForStencil(gn, '', dt + 'component').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=collab;archiType=square;', 
					w * 150, h * 75, 'Application Collaboration', 'Application Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'collaboration;', 
					w * 60, h * 35, '', 'Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=interface;archiType=square;', 
					w * 150, h * 75, 'Application Interface', 'Application Interface', null, null, this.getTagsForStencil(gn, '', dt + 'component').join(' ')),
			this.createVertexTemplateEntry(am + 'interface;', 
					w * 70, h * 35, '', 'Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=func;archiType=rounded;', 
					w * 150, h * 75, 'Application Function', 'Application Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'function;', 
					w * 60, h * 40, '', 'Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=interaction;archiType=rounded;', 
					w * 150, h * 75, 'Application Interaction', 'Application Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'interaction').join(' ')),
			this.createVertexTemplateEntry(am + 'interaction;', 
					w * 40, h * 40, '', 'Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'interaction').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=proc;archiType=rounded;', 
					w * 150, h * 75, 'Application Process', 'Application Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'process;', 
					w * 60, h * 30, '', 'Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=event;archiType=rounded', 
					w * 150, h * 75, 'Application Event', 'Application Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'event;', 
					w * 60, h * 35, '', 'Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=serv;archiType=rounded', 
					w * 150, h * 75, 'Application Service', 'Application Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'service;', 
					w * 60, h * 35, '', 'Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=passive;archiType=square;', 
					w * 150, h * 75, 'Data Object', 'Data Object', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'businessObject;overflow=fill;', 
					w * 70, h * 40, '<table cellpadding="0" cellspacing="0" style="font-size:1em;width:100%;height:100%;"><tr style="height:20px;"><td align="center"></td></tr><tr><td align="left" valign="top" style="padding:4px;"></td></tr></table>', 
					'Data Object', null, null, this.getTagsForStencil(gn, '', dt + 'data object').join(' '))
		];
			
		this.addPalette('archimate3Application', 'Archimate 3.2 / Application', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addArchimate3BusinessPalette = function()
	{
		var am2 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#ffff99;shape=mxgraph.archimate3.';
		var am3 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#ffff99;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.archimate3.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate3';
		var dt = 'archimate business layer ';
		
		var w = 1.0;
		var h = 1.0;
		
		var fns =
		[
			this.createVertexTemplateEntry(am2 + 'application;appType=actor;archiType=square;', 
					w * 150, h * 75, 'Business Actor', 'Business Actor', null, null, this.getTagsForStencil(gn, '', dt + 'actor').join(' ')),
			this.createVertexTemplateEntry(am3 + 'actor;', 
					w * 26.5, h * 50, '', 'Actor', null, null, this.getTagsForStencil(gn, '', dt + 'actor').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=role;archiType=square;', 
					w * 150, h * 75, 'Business Role', 'Business Role', null, null, this.getTagsForStencil(gn, '', dt + 'role').join(' ')),
			this.createVertexTemplateEntry(am2 + 'role;', 
					w * 60, h * 35, '', 'Business Role', null, null, this.getTagsForStencil(gn, '', dt + 'role').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=collab;archiType=square;', 
					w * 150, h * 75, 'Business Collaboration', 'Business Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am2 + 'collaboration;', 
					w * 60, h * 35, '', 'Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=interface;archiType=square;', 
					w * 150, h * 75, 'Business Interface', 'Business Interface', null, null, this.getTagsForStencil(gn, '', dt + 'component').join(' ')),
			this.createVertexTemplateEntry(am2 + 'interface;', 
					w * 70, h * 35, '', 'Business Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=proc;archiType=rounded;', 
					w * 150, h * 75, 'Business Process', 'Business Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am2 + 'process;', 
					w * 60, h * 30, '', 'Business Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=func;archiType=rounded;', 
					w * 150, h * 75, 'Business Function', 'Business Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am2 + 'function;', 
					w * 60, h * 40, '', 'Business Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=interaction;archiType=rounded;', 
					w * 150, h * 75, 'Business Interaction', 'Business Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'interaction').join(' ')),
			this.createVertexTemplateEntry(am2 + 'interaction;', 
					w * 40, h * 40, '', 'Business Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'interaction').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=event;archiType=rounded;', 
					w * 150, h * 75, 'Business Event', 'Business Event', null, null, this.getTagsForStencil(gn, '', dt + 'business event').join(' ')),
			this.createVertexTemplateEntry(am2 + 'event;', 
					w * 60, h * 35, '', 'Business Event', null, null, this.getTagsForStencil(gn, '', dt + 'business event').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=serv;archiType=rounded;', 
					w * 150, h * 75, 'Business Service', 'Business Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am2 + 'service;', 
					w * 60, h * 35, '', 'Business Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=passive;archiType=square;', 
					w * 150, h * 75, 'Business Object', 'Business Object', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am2 + 'businessObject;overflow=fill;', 
					w * 70, h * 40, '<table cellpadding="0" cellspacing="0" style="font-size:1em;width:100%;height:100%;"><tr style="height:20px;"><td align="center"></td></tr><tr><td align="left" valign="top" style="padding:4px;"></td></tr></table>', 
					'Business Object', null, null, this.getTagsForStencil(gn, '', dt + 'data object').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=contract;archiType=square;', 
					w * 150, h * 75, 'Contract', 'Contract', null, null, this.getTagsForStencil(gn, '', dt + 'contract').join(' ')),
			this.createVertexTemplateEntry(am2 + 'contract;', 
					w * 70, h * 40, '', 'Contract', null, null, this.getTagsForStencil(gn, '', dt + 'contract').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=representation;archiType=square;', 
					w * 150, h * 75, 'Representation', 'Representation', null, null, this.getTagsForStencil(gn, '', dt + 'contract').join(' ')),
			this.createVertexTemplateEntry(am2 + 'representation;', 
					w * 70, h * 40, '', 'Representation', null, null, this.getTagsForStencil(gn, '', dt + 'representation').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=product;archiType=square;', 
					w * 150, h * 75, 'Product', 'Product', null, null, this.getTagsForStencil(gn, '', dt + 'product').join(' ')),
			this.createVertexTemplateEntry(am2 + 'product;', 
					w * 70, h * 40, '', 'Product', null, null, this.getTagsForStencil(gn, '', dt + 'product').join(' '))
		];
			
		this.addPalette('archimate3Business', 'Archimate 3.2 / Business', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addArchimate3ImplementationAndMigrationPalette = function()
	{
		var am2 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#FFE0E0;shape=mxgraph.archimate3.';
		var am3 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#E0FFE0;shape=mxgraph.archimate3.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate3';
		var dt = 'archimate implementation migration element ';
		
		var w = 1.0;
		var h = 1.0;
		
		var fns =
		[
			this.createVertexTemplateEntry(am2 + 'application;appType=workPackage;archiType=rounded;', 
					w * 150, h * 75, 'Work Package', 'Work Package', null, null, this.getTagsForStencil(gn, '', dt + 'work package').join(' ')),
			this.createVertexTemplateEntry(am2 + 'workPackage;strokeWidth=5;', 
					w * 60, h * 50, '', 'Work Package', null, null, this.getTagsForStencil(gn, '', dt + 'work package').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=deliverable;archiType=rounded;', 
					w * 150, h * 75, 'Deliverable', 'Deliverable', null, null, this.getTagsForStencil(gn, '', dt + 'deliverable').join(' ')),
			this.createVertexTemplateEntry(am2 + 'deliverable;', 
					w * 60, h * 35, '', 'Deliverable', null, null, this.getTagsForStencil(gn, '', dt + 'deliverable').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=event;archiType=rounded;', 
					w * 150, h * 75, 'Implementation Event', 'Implementation Event', null, null, this.getTagsForStencil(gn, '', dt + 'implementation event').join(' ')),
			this.createVertexTemplateEntry(am2 + 'event;', 
					w * 60, h * 35, '', 'Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=plateau;', 
					w * 150, h * 75, 'Plateau', 'Plateau', null, null, this.getTagsForStencil(gn, '', dt + 'plateau').join(' ')),
			this.createVertexTemplateEntry(am2 + 'plateau;', 
					w * 60, h * 40, '', 'Plateau', null, null, this.getTagsForStencil(gn, '', dt + 'plateau').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=gap;', 
					w * 150, h * 75, 'Gap', 'Gap', null, null, this.getTagsForStencil(gn, '', dt + 'gap').join(' ')),
			this.createVertexTemplateEntry(am2 + 'gapIcon;', 
					w * 55, h * 40, '', 'Gap', null, null, this.getTagsForStencil(gn, '', dt + 'gap').join(' '))
		];
			
		this.addPalette('archimate3Implementation and Migration', 'Archimate 3.2 / Implementation and Migration', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addArchimate3MotivationPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#CCCCFF;shape=mxgraph.archimate3.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate3';
		var dt = 'archimate implementation motivation element ';
		
		var w = 1.0;
		var h = 1.0;
		
		var fns =
		[
			this.createVertexTemplateEntry(am + 'application;appType=role;archiType=oct;', 
					w * 150, h * 75, 'Stakeholder', 'Stakeholder', null, null, this.getTagsForStencil(gn, '', dt + 'stakeholder').join(' ')),
			this.createVertexTemplateEntry(am + 'role;', 
					w * 60, h * 35, '', 'Stakeholder', null, null, this.getTagsForStencil(gn, '', dt + 'stakeholder').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=driver;archiType=oct;', 
					w * 150, h * 75, 'Driver', 'Driver', null, null, this.getTagsForStencil(gn, '', dt + 'driver').join(' ')),
			this.createVertexTemplateEntry(am + 'driver;', 
					w * 40, h * 40, '', 'Driver', null, null, this.getTagsForStencil(gn, '', dt + 'driver').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=assess;archiType=oct;', 
					w * 150, h * 75, 'Assessment', 'Assessment', null, null, this.getTagsForStencil(gn, '', dt + 'assessment').join(' ')),
			this.createVertexTemplateEntry(am + 'assess;', 
					w * 40, h * 40, '', 'Assessment', null, null, this.getTagsForStencil(gn, '', dt + 'assessment').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=goal;archiType=oct;', 
					w * 150, h * 75, 'Goal', 'Goal', null, null, this.getTagsForStencil(gn, '', dt + 'goal').join(' ')),
			this.createVertexTemplateEntry(am + 'goal;', 
					w * 40, h * 40, '', 'Goal', null, null, this.getTagsForStencil(gn, '', dt + 'goal').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=outcome;archiType=oct;', 
					w * 150, h * 75, 'Outcome', 'Outcome', null, null, this.getTagsForStencil(gn, '', dt + 'outcome').join(' ')),
			this.createVertexTemplateEntry(am + 'outcome;strokeWidth=2;', 
					w * 60, h * 60, '', 'Outcome', null, null, this.getTagsForStencil(gn, '', dt + 'outcome').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=principle;archiType=oct;', 
					w * 150, h * 75, 'Principle', 'Principle', null, null, this.getTagsForStencil(gn, '', dt + 'principle').join(' ')),
			this.createVertexTemplateEntry(am + 'principle;strokeWidth=2;', 
					w * 40, h * 40, '', 'Principle', null, null, this.getTagsForStencil(gn, '', dt + 'principle').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=requirement;archiType=oct;', 
					w * 150, h * 75, 'Requirement', 'Requirement', null, null, this.getTagsForStencil(gn, '', dt + 'requirement').join(' ')),
			this.createVertexTemplateEntry(am + 'requirement;', 
					w * 70, h * 35, '', 'Requirement', null, null, this.getTagsForStencil(gn, '', dt + 'requirement').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=constraint;archiType=oct;', 
					w * 150, h * 75, 'Constraint', 'Constraint', null, null, this.getTagsForStencil(gn, '', dt + 'constraint').join(' ')),
			this.createVertexTemplateEntry(am + 'constraint;', 
					w * 70, h * 35, '', 'Constraint', null, null, this.getTagsForStencil(gn, '', dt + 'constraint').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=meaning;archiType=oct;', 
					w * 150, h * 75, 'Meaning', 'Meaning', null, null, this.getTagsForStencil(gn, '', dt + 'meaning').join(' ')),
			this.createVertexTemplateEntry('shape=mxgraph.basic.cloud_callout;html=1;whiteSpace=wrap;fillColor=#CCCCFF;', 
					w * 70, h * 45, '', 'Meaning', null, null, this.getTagsForStencil(gn, '', dt + 'meaning').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=amValue;archiType=oct;', 
					w * 150, h * 75, 'Value', 'Value', null, null, this.getTagsForStencil(gn, '', dt + 'value').join(' ')),
			this.createVertexTemplateEntry('shape=ellipse;html=1;whiteSpace=wrap;fillColor=#CCCCFF;', 
					w * 70, h * 35, '', 'Value', null, null, this.getTagsForStencil(gn, '', dt + 'value').join(' '))
		];
			
		this.addPalette('archimate3Motivation', 'Archimate 3.2 / Motivation', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addArchimate3RelationshipsPalette = function()
	{
		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate3';
		var dt = 'archimate relationship ';
		
		var w = 1.0;
		var h = 1.0;
		
		var fns =
		[
			this.createEdgeTemplateEntry('html=1;startArrow=diamondThin;startFill=1;edgeStyle=elbowEdgeStyle;elbow=vertical;startSize=10;endArrow=none;endFill=0;',
					w * 160, 0, '', 'Composition', null, this.getTagsForStencil(gn, '', dt + 'composition').join(' ')),
			this.createEdgeTemplateEntry('html=1;startArrow=diamondThin;startFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical;startSize=10;endArrow=none;endFill=0;',
					w * 160, 0, '', 'Aggregation', null, this.getTagsForStencil(gn, '', dt + 'aggregation').join(' ')),
			this.createEdgeTemplateEntry('endArrow=block;html=1;endFill=1;startArrow=oval;startFill=1;edgeStyle=elbowEdgeStyle;elbow=vertical;',
					w * 160, 0, '', 'Assignment', null, this.getTagsForStencil(gn, '', dt + 'assignment').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=block;elbow=vertical;endFill=0;dashed=1;',
					w * 160, 0, '', 'Realization', null, this.getTagsForStencil(gn, '', dt + 'realization').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=open;elbow=vertical;endFill=1;',
					w * 160, 0, '', 'Serving', null, this.getTagsForStencil(gn, '', dt + 'serving').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=none;elbow=vertical;dashed=1;startFill=0;dashPattern=1 4;',
					w * 160, 0, '', 'Access', null, this.getTagsForStencil(gn, '', dt + 'access').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=open;elbow=vertical;endFill=0;dashed=1;startArrow=open;startFill=0;dashPattern=1 4;',
					w * 160, 0, '', 'Access', null, this.getTagsForStencil(gn, '', dt + 'access').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=open;elbow=vertical;endFill=0;dashed=1;dashPattern=1 4;',
					w * 160, 0, '', 'Access', null, this.getTagsForStencil(gn, '', dt + 'access').join(' ')),
					
			this.addEntry('uml influence', function()
			{
				var edge = new mxCell('+/-', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;endArrow=open;elbow=vertical;endFill=0;dashed=1;dashPattern=6 4;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.geometry.x = 1;
				edge.geometry.y = 10;
				edge.edge = true;
			
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Influence');
			}),
					
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=none;elbow=vertical;',
					w * 160, 0, '', 'Association', null, this.getTagsForStencil(gn, '', dt + 'association').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=openAsync;elbow=vertical;rounded=0;endFill=0;',
					w * 160, 0, '', 'Association', null, this.getTagsForStencil(gn, '', dt + 'association').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=block;dashed=0;elbow=vertical;endFill=1;',
					w * 160, 0, '', 'Triggering', null, this.getTagsForStencil(gn, '', dt + 'triggering').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=block;dashed=1;elbow=vertical;endFill=1;dashPattern=6 4;',
					w * 160, 0, '', 'Flow', null, this.getTagsForStencil(gn, '', dt + 'flow').join(' ')),
			this.createEdgeTemplateEntry('endArrow=block;html=1;endFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical;',
					w * 160, 0, '', 'Specialization', null, this.getTagsForStencil(gn, '', dt + 'specialization').join(' ')),
			this.createVertexTemplateEntry('ellipse;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;fillColor=strokeColor', 
					10, 10, '', 'And Junction', null, this.getTagsForStencil(gn, '', dt + 'junction').join(' ')),
			this.createVertexTemplateEntry('ellipse;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;fillColor=#ffffff', 
					10, 10, '', 'Or Junction', null, this.getTagsForStencil(gn, '', dt + 'junction').join(' '))
		];
			
		this.addPalette('archimate3Relationships', 'Archimate 3.2 / Relationships', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addArchimate3StrategyPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#F5DEAA;shape=mxgraph.archimate3.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate3';
		var dt = 'archimate strategy ';
		
		var w = 1.0;
		var h = 1.0;
		
		var fns =
		[
			this.createVertexTemplateEntry(am + 'application;appType=resource;archiType=square;', 
					w * 150, h * 75, 'Resource', 'Resource', null, null, this.getTagsForStencil(gn, '', dt + 'resource').join(' ')),
			this.createVertexTemplateEntry(am + 'resource;', 
					w * 60, h * 40, '', 'Resource', null, null, this.getTagsForStencil(gn, '', dt + 'resource').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=capability;archiType=rounded;', 
					w * 150, h * 75, 'Capability', 'Capability', null, null, this.getTagsForStencil(gn, '', dt + 'capability').join(' ')),
			this.createVertexTemplateEntry(am + 'capability;', 
					w * 40, h * 40, '', 'Capability', null, null, this.getTagsForStencil(gn, '', dt + 'capability').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=valueStream;archiType=rounded;', 
					w * 150, h * 75, 'Value Stream', 'Value Stream', null, null, this.getTagsForStencil(gn, '', dt + 'value stream').join(' ')),
			this.createVertexTemplateEntry(am + 'valueStream;', 
					w * 70, h * 35, '', 'Value Stream', null, null, this.getTagsForStencil(gn, '', dt + 'value stream').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=course;archiType=rounded;', 
					w * 150, h * 75, 'Course of Action', 'Course of Action', null, null, this.getTagsForStencil(gn, '', dt + 'course action').join(' ')),
			this.createVertexTemplateEntry(am + 'course;', 
					w * 40, h * 40, '', 'Course of Action', null, null, this.getTagsForStencil(gn, '', dt + 'course of action').join(' '))
		];
			
		this.addPalette('archimate3Strategy', 'Archimate 3.2 / Strategy', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addArchimate3TechnologyPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#AFFFAF;shape=mxgraph.archimate3.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate3';
		var dt = 'archimate technology ';
		
		var w = 1.0;
		var h = 1.0;
		
		var fns =
		[
			this.createVertexTemplateEntry(am + 'application;appType=node;archiType=square;', 
					w * 150, h * 75, 'Node', 'Node', null, null, this.getTagsForStencil(gn, '', dt + 'node').join(' ')),
			this.createVertexTemplateEntry(am + 'node;', 
					w * 70, h * 40, '', 'Node', null, null, this.getTagsForStencil(gn, '', dt + 'node').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=device;', 
					w * 150, h * 75, 'Device', 'Device', null, null, this.getTagsForStencil(gn, '', dt + 'device').join(' ')),
			this.createVertexTemplateEntry(am + 'device;', 
					w * 70, h * 35, '', 'Device', null, null, this.getTagsForStencil(gn, '', dt + 'device').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=sysSw;archiType=square;', 
					w * 150, h * 75, 'System Software', 'System Software', null, null, this.getTagsForStencil(gn, '', dt + 'system software').join(' ')),
			this.createVertexTemplateEntry(am + 'sysSw;', 
					w * 40, h * 40, '', 'Device', null, null, this.getTagsForStencil(gn, '', dt + 'device').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=collab;archiType=square;', 
					w * 150, h * 75, 'Technology Collaboration', 'Technology Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'collaboration;', 
					w * 60, h * 35, '', 'Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=interface;archiType=square;', 
					w * 150, h * 75, 'Technology Interface', 'Technology Interface', null, null, this.getTagsForStencil(gn, '', dt + 'component').join(' ')),
			this.createVertexTemplateEntry(am + 'interface;', 
					w * 70, h * 35, '', 'Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=path;archiType=square;', 
					w * 150, h * 75, 'Path', 'Path', null, null, this.getTagsForStencil(gn, '', dt + 'communication network').join(' ')),
			this.createVertexTemplateEntry(am + 'path;strokeWidth=6;', 
					w * 100, h * 30, '', 'Path', null, null, this.getTagsForStencil(gn, '', dt + 'path').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=netw;archiType=square;', 
					w * 150, h * 75, 'Communication Network', 'Communication Network', null, null, this.getTagsForStencil(gn, '', dt + 'communication network').join(' ')),
			this.createVertexTemplateEntry(am + 'network;', 
					w * 65, h * 50, '', 'Communication Network', null, null, this.getTagsForStencil(gn, '', dt + 'communication network').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=proc;archiType=rounded;', 
					w * 150, h * 75, 'Technology Process', 'Technology Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'process;', 
					w * 70, h * 35, '', 'Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=interaction;archiType=rounded;', 
					w * 150, h * 75, 'Technology Interaction', 'Technology Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'interaction').join(' ')),
			this.createVertexTemplateEntry(am + 'interaction;', 
					w * 40, h * 40, '', 'Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'interaction').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=event;archiType=rounded', 
					w * 150, h * 75, 'Technology Event', 'Technology Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'event;', 
					w * 60, h * 35, '', 'Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=serv;archiType=rounded', 
					w * 150, h * 75, 'Technology Service', 'Technology Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'service;', 
					w * 60, h * 35, '', 'Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=artifact;archiType=square;', 
					w * 150, h * 75, 'Artifact', 'Artifact', null, null, this.getTagsForStencil(gn, '', dt + 'artifact').join(' ')),
			this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#AFFFAF;shape=note;size=14;', 
					w * 70, h * 35, '', 'Artifact', null, null, this.getTagsForStencil(gn, '', dt + 'artifact').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=equipment;archiType=square;', 
					w * 150, h * 75, 'Equipment', 'Equipment', null, null, this.getTagsForStencil(gn, '', dt + 'artifact').join(' ')),
			this.createVertexTemplateEntry(am + 'equipment;',
					w * 50, h * 50, '', 'Equipment', null, null, this.getTagsForStencil(gn, '', dt + 'artifact').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=facility;archiType=square;', 
					w * 150, h * 75, 'Facility', 'Facility', null, null, this.getTagsForStencil(gn, '', dt + 'facility').join(' ')),
			this.createVertexTemplateEntry(am + 'facility;',
					w * 60, h * 40, '', 'Facility', null, null, this.getTagsForStencil(gn, '', dt + 'facility').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=distribution;archiType=square;', 
					w * 150, h * 75, 'Distribution Network', 'Distribution Network', null, null, this.getTagsForStencil(gn, '', dt + 'distribution network').join(' ')),
			this.createVertexTemplateEntry(am + 'distribution;strokeWidth=4;',
					w * 70, h * 30, '', 'Distribution Network', null, null, this.getTagsForStencil(gn, '', dt + 'distribution network').join(' ')),
			this.createVertexTemplateEntry(am + 'application;appType=material;archiType=square;', 
					w * 150, h * 75, 'Material', 'Material', null, null, this.getTagsForStencil(gn, '', dt + 'material').join(' ')),
			this.createVertexTemplateEntry(am + 'material;', 
					w * 60, h * 50, '', 'Material', null, null, this.getTagsForStencil(gn, '', dt + 'material').join(' '))
		];
			
		this.addPalette('archimate3Technology', 'Archimate 3.2 / Technology', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
})();
