/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
(function()
{
	// Adds ArchiMate 4 shapes
	Sidebar.prototype.addArchimate4Palette = function()
	{
		this.setCurrentSearchEntryLibrary('archimate4', 'archimate4Common');
		this.addArchimate4CommonPalette();
		this.setCurrentSearchEntryLibrary('archimate4', 'archimate4Relationships and Junctions');
		this.addArchimate4RelationshipsAndJunctionsPalette();
		this.setCurrentSearchEntryLibrary('archimate4', 'archimate4Motivation');
		this.addArchimate4MotivationPalette();
		this.setCurrentSearchEntryLibrary('archimate4', 'archimate4Strategy');
		this.addArchimate4StrategyPalette();
		this.setCurrentSearchEntryLibrary('archimate4', 'archimate4Business');
		this.addArchimate4BusinessPalette();
		this.setCurrentSearchEntryLibrary('archimate4', 'archimate4Application');
		this.addArchimate4ApplicationPalette();
		this.setCurrentSearchEntryLibrary('archimate4', 'archimate4Technology');
		this.addArchimate4TechnologyPalette();
		this.setCurrentSearchEntryLibrary('archimate4', 'archimate4Implementation and Migration');
		this.addArchimate4ImplementationAndMigrationPalette();
		this.setCurrentSearchEntryLibrary();
	};

	Sidebar.prototype.addArchimate4CommonPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#E5DFD3;shape=mxgraph.archimate4.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate4';
		var dt = 'archimate 4 common ';

		var w = 1.0;
		var h = 1.0;

		var fns =
		[
			this.createVertexTemplateEntry(am + 'element;appType=role;archiType=square;archiDomain=common;',
					w * 150, h * 75, 'Role', 'Role', null, null, this.getTagsForStencil(gn, '', dt + 'role').join(' ')),
			this.createVertexTemplateEntry(am + 'role;',
					w * 60, h * 35, '', 'Role', null, null, this.getTagsForStencil(gn, '', dt + 'role').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=collab;archiType=square;archiDomain=common;',
					w * 150, h * 75, 'Collaboration', 'Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'collaboration;',
					w * 60, h * 35, '', 'Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=path;archiType=square;archiDomain=common;',
					w * 150, h * 75, 'Path', 'Path', null, null, this.getTagsForStencil(gn, '', dt + 'path').join(' ')),
			this.createVertexTemplateEntry(am + 'path;strokeWidth=6;',
					w * 100, h * 30, '', 'Path', null, null, this.getTagsForStencil(gn, '', dt + 'path').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=serv;archiType=rounded;archiDomain=common;',
					w * 150, h * 75, 'Service', 'Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'service;',
					w * 60, h * 35, '', 'Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=proc;archiType=rounded;archiDomain=common;',
					w * 150, h * 75, 'Process', 'Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'process;',
					w * 60, h * 35, '', 'Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=func;archiType=rounded;archiDomain=common;',
					w * 150, h * 75, 'Function', 'Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'function;',
					w * 45, h * 45, '', 'Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=event;archiType=rounded;archiDomain=common;',
					w * 150, h * 75, 'Event', 'Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'event;',
					w * 60, h * 35, '', 'Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate4.element;appType=grouping;archiType=square;dashed=1;fillColor=none;archiDomain=common;',
					w * 150, h * 75, 'Grouping', 'Grouping', null, null, this.getTagsForStencil(gn, '', dt + 'grouping').join(' ')),
			this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;shape=mxgraph.archimate4.grouping;fillColor=none;dashed=1;',
					w * 60, h * 35, '', 'Grouping', null, null, this.getTagsForStencil(gn, '', dt + 'grouping').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=location;archiType=square;archiDomain=common;',
					w * 150, h * 75, 'Location', 'Location', null, null, this.getTagsForStencil(gn, '', dt + 'location').join(' ')),
			this.createVertexTemplateEntry(am + 'locationIcon;aspect=fixed;',
					w * 35, h * 50, '', 'Location', null, null, this.getTagsForStencil(gn, '', dt + 'location').join(' '))
		];

		this.addPalette('archimate4Common', 'ArchiMate 4 / Common', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addArchimate4RelationshipsAndJunctionsPalette = function()
	{
		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate4';
		var dt = 'archimate 4 relationship ';

		var w = 1.0;
		var h = 1.0;

		var fns =
		[
			this.createEdgeTemplateEntry('html=1;startArrow=diamondThin;startFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical;startSize=10;endArrow=none;endFill=0;',
					w * 160, 0, '', 'Aggregation', null, this.getTagsForStencil(gn, '', dt + 'aggregation').join(' ')),
			this.createEdgeTemplateEntry('html=1;startArrow=diamondThin;startFill=1;edgeStyle=elbowEdgeStyle;elbow=vertical;startSize=10;endArrow=none;endFill=0;',
					w * 160, 0, '', 'Composition', null, this.getTagsForStencil(gn, '', dt + 'composition').join(' ')),
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

			this.addEntry(dt + 'influence', function()
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
					w * 160, 0, '', 'Association (Directed)', null, this.getTagsForStencil(gn, '', dt + 'association directed').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=block;dashed=0;elbow=vertical;endFill=1;',
					w * 160, 0, '', 'Triggering', null, this.getTagsForStencil(gn, '', dt + 'triggering').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=block;dashed=1;elbow=vertical;endFill=1;dashPattern=6 4;',
					w * 160, 0, '', 'Flow', null, this.getTagsForStencil(gn, '', dt + 'flow').join(' ')),
			this.createEdgeTemplateEntry('endArrow=block;html=1;endFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical;',
					w * 160, 0, '', 'Specialization', null, this.getTagsForStencil(gn, '', dt + 'specialization').join(' ')),

			this.addEntry(dt + 'multiplicity cardinality association', function()
			{
				var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;endArrow=none;elbow=vertical;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;

				var sourceLabel = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'edgeLabel;resizable=0;html=1;align=left;verticalAlign=bottom;');
				sourceLabel.geometry.relative = true;
				sourceLabel.setConnectable(false);
				sourceLabel.vertex = true;
				edge.insert(sourceLabel);

				var targetLabel = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;');
				targetLabel.geometry.relative = true;
				targetLabel.setConnectable(false);
				targetLabel.vertex = true;
				edge.insert(targetLabel);

				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Association with Multiplicity');
			}),

			this.createVertexTemplateEntry('ellipse;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;fillColor=strokeColor',
					10, 10, '', 'And Junction', null, null, this.getTagsForStencil(gn, '', dt + 'and junction').join(' ')),
			this.createVertexTemplateEntry('ellipse;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;fillColor=#ffffff',
					10, 10, '', 'Or Junction', null, null, this.getTagsForStencil(gn, '', dt + 'or junction').join(' '))
		];

		this.addPalette('archimate4Relationships and Junctions', 'ArchiMate 4 / Relationships and Junctions', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addArchimate4MotivationPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#D1BADC;shape=mxgraph.archimate4.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate4';
		var dt = 'archimate 4 motivation ';

		var w = 1.0;
		var h = 1.0;

		var fns =
		[
			this.createVertexTemplateEntry(am + 'element;appType=role;archiType=oct;archiDomain=motivation;',
					w * 150, h * 75, 'Stakeholder', 'Stakeholder', null, null, this.getTagsForStencil(gn, '', dt + 'stakeholder').join(' ')),
			this.createVertexTemplateEntry(am + 'role;',
					w * 60, h * 35, '', 'Stakeholder', null, null, this.getTagsForStencil(gn, '', dt + 'stakeholder').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=driver;archiType=oct;archiDomain=motivation;',
					w * 150, h * 75, 'Driver', 'Driver', null, null, this.getTagsForStencil(gn, '', dt + 'driver').join(' ')),
			this.createVertexTemplateEntry(am + 'driver;',
					w * 40, h * 40, '', 'Driver', null, null, this.getTagsForStencil(gn, '', dt + 'driver').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=assess;archiType=oct;archiDomain=motivation;',
					w * 150, h * 75, 'Assessment', 'Assessment', null, null, this.getTagsForStencil(gn, '', dt + 'assessment').join(' ')),
			this.createVertexTemplateEntry(am + 'assess;',
					w * 40, h * 40, '', 'Assessment', null, null, this.getTagsForStencil(gn, '', dt + 'assessment').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=goal;archiType=oct;archiDomain=motivation;',
					w * 150, h * 75, 'Goal', 'Goal', null, null, this.getTagsForStencil(gn, '', dt + 'goal').join(' ')),
			this.createVertexTemplateEntry(am + 'goal;',
					w * 40, h * 40, '', 'Goal', null, null, this.getTagsForStencil(gn, '', dt + 'goal').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=outcome;archiType=oct;archiDomain=motivation;',
					w * 150, h * 75, 'Outcome', 'Outcome', null, null, this.getTagsForStencil(gn, '', dt + 'outcome').join(' ')),
			this.createVertexTemplateEntry(am + 'outcome;strokeWidth=2;',
					w * 60, h * 60, '', 'Outcome', null, null, this.getTagsForStencil(gn, '', dt + 'outcome').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=principle;archiType=oct;archiDomain=motivation;',
					w * 150, h * 75, 'Principle', 'Principle', null, null, this.getTagsForStencil(gn, '', dt + 'principle').join(' ')),
			this.createVertexTemplateEntry(am + 'principle;strokeWidth=2;',
					w * 40, h * 40, '', 'Principle', null, null, this.getTagsForStencil(gn, '', dt + 'principle').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=requirement;archiType=oct;archiDomain=motivation;',
					w * 150, h * 75, 'Requirement', 'Requirement', null, null, this.getTagsForStencil(gn, '', dt + 'requirement').join(' ')),
			this.createVertexTemplateEntry(am + 'requirement;',
					w * 70, h * 35, '', 'Requirement', null, null, this.getTagsForStencil(gn, '', dt + 'requirement').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=meaning;archiType=oct;archiDomain=motivation;',
					w * 150, h * 75, 'Meaning', 'Meaning', null, null, this.getTagsForStencil(gn, '', dt + 'meaning').join(' ')),
			this.createVertexTemplateEntry('shape=mxgraph.basic.cloud_callout;html=1;whiteSpace=wrap;fillColor=#D1BADC;',
					w * 70, h * 45, '', 'Meaning', null, null, this.getTagsForStencil(gn, '', dt + 'meaning').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=amValue;archiType=oct;archiDomain=motivation;',
					w * 150, h * 75, 'Value', 'Value', null, null, this.getTagsForStencil(gn, '', dt + 'value').join(' ')),
			this.createVertexTemplateEntry('shape=ellipse;html=1;whiteSpace=wrap;fillColor=#D1BADC;',
					w * 70, h * 35, '', 'Value', null, null, this.getTagsForStencil(gn, '', dt + 'value').join(' '))
		];

		this.addPalette('archimate4Motivation', 'ArchiMate 4 / Motivation', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addArchimate4StrategyPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#EFBD5D;shape=mxgraph.archimate4.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate4';
		var dt = 'archimate 4 strategy ';

		var w = 1.0;
		var h = 1.0;

		var fns =
		[
			this.createVertexTemplateEntry(am + 'element;appType=resource;archiType=square;archiDomain=strategy;',
					w * 150, h * 75, 'Resource', 'Resource', null, null, this.getTagsForStencil(gn, '', dt + 'resource').join(' ')),
			this.createVertexTemplateEntry(am + 'resource;',
					w * 60, h * 40, '', 'Resource', null, null, this.getTagsForStencil(gn, '', dt + 'resource').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=capability;archiType=rounded;archiDomain=strategy;',
					w * 150, h * 75, 'Capability', 'Capability', null, null, this.getTagsForStencil(gn, '', dt + 'capability').join(' ')),
			this.createVertexTemplateEntry(am + 'capability;',
					w * 40, h * 40, '', 'Capability', null, null, this.getTagsForStencil(gn, '', dt + 'capability').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=valueStream;archiType=rounded;archiDomain=strategy;',
					w * 150, h * 75, 'Value Stream', 'Value Stream', null, null, this.getTagsForStencil(gn, '', dt + 'value stream').join(' ')),
			this.createVertexTemplateEntry(am + 'valueStream;',
					w * 70, h * 35, '', 'Value Stream', null, null, this.getTagsForStencil(gn, '', dt + 'value stream').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=course;archiType=rounded;archiDomain=strategy;',
					w * 150, h * 75, 'Course of Action', 'Course of Action', null, null, this.getTagsForStencil(gn, '', dt + 'course of action').join(' ')),
			this.createVertexTemplateEntry(am + 'course;',
					w * 40, h * 40, '', 'Course of Action', null, null, this.getTagsForStencil(gn, '', dt + 'course of action').join(' '))
		];

		this.addPalette('archimate4Strategy', 'ArchiMate 4 / Strategy', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addArchimate4BusinessPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#EDD779;shape=mxgraph.archimate4.';
		var am2 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#EDD779;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.archimate4.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate4';
		var dt = 'archimate 4 business ';

		var w = 1.0;
		var h = 1.0;

		var fns =
		[
			this.createVertexTemplateEntry(am + 'element;appType=actor;archiType=square;archiDomain=business;',
					w * 150, h * 75, 'Business Actor', 'Business Actor', null, null, this.getTagsForStencil(gn, '', dt + 'actor').join(' ')),
			this.createVertexTemplateEntry(am2 + 'actor;',
					w * 26.5, h * 50, '', 'Business Actor', null, null, this.getTagsForStencil(gn, '', dt + 'actor').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=role;archiType=square;archiDomain=business;',
					w * 150, h * 75, 'Business Role', 'Business Role', null, null, this.getTagsForStencil(gn, '', dt + 'role').join(' ')),
			this.createVertexTemplateEntry(am + 'role;',
					w * 60, h * 35, '', 'Business Role', null, null, this.getTagsForStencil(gn, '', dt + 'role').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=collab;archiType=square;archiDomain=business;',
					w * 150, h * 75, 'Business Collaboration', 'Business Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'collaboration;',
					w * 60, h * 35, '', 'Business Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=interface;archiType=square;archiDomain=business;',
					w * 150, h * 75, 'Business Interface', 'Business Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'interface;',
					w * 70, h * 35, '', 'Business Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=serv;archiType=rounded;archiDomain=business;',
					w * 150, h * 75, 'Business Service', 'Business Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'service;',
					w * 60, h * 35, '', 'Business Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=proc;archiType=rounded;archiDomain=business;',
					w * 150, h * 75, 'Business Process', 'Business Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'process;',
					w * 60, h * 35, '', 'Business Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=func;archiType=rounded;archiDomain=business;',
					w * 150, h * 75, 'Business Function', 'Business Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'function;',
					w * 45, h * 45, '', 'Business Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=event;archiType=rounded;archiDomain=business;',
					w * 150, h * 75, 'Business Event', 'Business Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'event;',
					w * 60, h * 35, '', 'Business Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=passive;archiType=square;archiDomain=business;',
					w * 150, h * 75, 'Business Object', 'Business Object', null, null, this.getTagsForStencil(gn, '', dt + 'business object').join(' ')),
			this.createVertexTemplateEntry(am + 'businessObject;overflow=fill;',
					w * 70, h * 40, '<table cellpadding="0" cellspacing="0" style="font-size:1em;width:100%;height:100%;"><tr style="height:20px;"><td align="center"></td></tr><tr><td align="left" valign="top" style="padding:4px;"></td></tr></table>',
					'Business Object', null, null, this.getTagsForStencil(gn, '', dt + 'business object').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=product;archiType=square;archiDomain=business;',
					w * 150, h * 75, 'Product', 'Product', null, null, this.getTagsForStencil(gn, '', dt + 'product').join(' ')),
			this.createVertexTemplateEntry(am + 'product;',
					w * 70, h * 40, '', 'Product', null, null, this.getTagsForStencil(gn, '', dt + 'product').join(' '))
		];

		this.addPalette('archimate4Business', 'ArchiMate 4 / Business', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addArchimate4ApplicationPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#B0D0D9;shape=mxgraph.archimate4.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate4';
		var dt = 'archimate 4 application ';

		var w = 1.0;
		var h = 1.0;

		var fns =
		[
			this.createVertexTemplateEntry(am + 'element;appType=comp;archiType=square;archiDomain=application;',
					w * 150, h * 75, 'Application Component', 'Application Component', null, null, this.getTagsForStencil(gn, '', dt + 'component').join(' ')),
			this.createVertexTemplateEntry(am + 'component;',
					w * 48, h * 40, '', 'Application Component', null, null, this.getTagsForStencil(gn, '', dt + 'component').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=collab;archiType=square;archiDomain=application;',
					w * 150, h * 75, 'Application Collaboration', 'Application Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'collaboration;',
					w * 60, h * 35, '', 'Application Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=interface;archiType=square;archiDomain=application;',
					w * 150, h * 75, 'Application Interface', 'Application Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'interface;',
					w * 70, h * 35, '', 'Application Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=serv;archiType=rounded;archiDomain=application;',
					w * 150, h * 75, 'Application Service', 'Application Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'service;',
					w * 60, h * 35, '', 'Application Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=proc;archiType=rounded;archiDomain=application;',
					w * 150, h * 75, 'Application Process', 'Application Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'process;',
					w * 60, h * 35, '', 'Application Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=func;archiType=rounded;archiDomain=application;',
					w * 150, h * 75, 'Application Function', 'Application Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'function;',
					w * 45, h * 45, '', 'Application Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=event;archiType=rounded;archiDomain=application;',
					w * 150, h * 75, 'Application Event', 'Application Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'event;',
					w * 60, h * 35, '', 'Application Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=passive;archiType=square;archiDomain=application;',
					w * 150, h * 75, 'Data Object', 'Data Object', null, null, this.getTagsForStencil(gn, '', dt + 'data object').join(' ')),
			this.createVertexTemplateEntry(am + 'businessObject;overflow=fill;',
					w * 70, h * 40, '<table cellpadding="0" cellspacing="0" style="font-size:1em;width:100%;height:100%;"><tr style="height:20px;"><td align="center"></td></tr><tr><td align="left" valign="top" style="padding:4px;"></td></tr></table>',
					'Data Object', null, null, this.getTagsForStencil(gn, '', dt + 'data object').join(' '))
		];

		this.addPalette('archimate4Application', 'ArchiMate 4 / Application', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addArchimate4TechnologyPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#BCD9AE;shape=mxgraph.archimate4.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate4';
		var dt = 'archimate 4 technology ';

		var w = 1.0;
		var h = 1.0;

		var fns =
		[
			this.createVertexTemplateEntry(am + 'element;appType=node;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Node', 'Node', null, null, this.getTagsForStencil(gn, '', dt + 'node').join(' ')),
			this.createVertexTemplateEntry(am + 'node;',
					w * 70, h * 40, '', 'Node', null, null, this.getTagsForStencil(gn, '', dt + 'node').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=interface;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Technology Interface', 'Technology Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'interface;',
					w * 70, h * 35, '', 'Technology Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=device;archiDomain=technology;',
					w * 150, h * 75, 'Device', 'Device', null, null, this.getTagsForStencil(gn, '', dt + 'device').join(' ')),
			this.createVertexTemplateEntry(am + 'device;',
					w * 60, h * 40, '', 'Device', null, null, this.getTagsForStencil(gn, '', dt + 'device').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=sysSw;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'System Software', 'System Software', null, null, this.getTagsForStencil(gn, '', dt + 'system software').join(' ')),
			this.createVertexTemplateEntry(am + 'sysSw;',
					w * 40, h * 40, '', 'System Software', null, null, this.getTagsForStencil(gn, '', dt + 'system software').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=collab;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Technology Collaboration', 'Technology Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'collaboration;',
					w * 60, h * 35, '', 'Technology Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=path;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Path', 'Path', null, null, this.getTagsForStencil(gn, '', dt + 'path').join(' ')),
			this.createVertexTemplateEntry(am + 'path;strokeWidth=6;',
					w * 100, h * 30, '', 'Path', null, null, this.getTagsForStencil(gn, '', dt + 'path').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=serv;archiType=rounded;archiDomain=technology;',
					w * 150, h * 75, 'Technology Service', 'Technology Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'service;',
					w * 60, h * 35, '', 'Technology Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=proc;archiType=rounded;archiDomain=technology;',
					w * 150, h * 75, 'Technology Process', 'Technology Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'process;',
					w * 60, h * 35, '', 'Technology Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=func;archiType=rounded;archiDomain=technology;',
					w * 150, h * 75, 'Technology Function', 'Technology Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'function;',
					w * 45, h * 45, '', 'Technology Function', null, null, this.getTagsForStencil(gn, '', dt + 'function').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=event;archiType=rounded;archiDomain=technology;',
					w * 150, h * 75, 'Technology Event', 'Technology Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'event;',
					w * 60, h * 35, '', 'Technology Event', null, null, this.getTagsForStencil(gn, '', dt + 'event').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=equipment;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Equipment', 'Equipment', null, null, this.getTagsForStencil(gn, '', dt + 'equipment').join(' ')),
			this.createVertexTemplateEntry(am + 'equipment;',
					w * 50, h * 50, '', 'Equipment', null, null, this.getTagsForStencil(gn, '', dt + 'equipment').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=facility;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Facility', 'Facility', null, null, this.getTagsForStencil(gn, '', dt + 'facility').join(' ')),
			this.createVertexTemplateEntry(am + 'facility;',
					w * 60, h * 40, '', 'Facility', null, null, this.getTagsForStencil(gn, '', dt + 'facility').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=netw;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Communication Network', 'Communication Network', null, null, this.getTagsForStencil(gn, '', dt + 'communication network').join(' ')),
			this.createVertexTemplateEntry(am + 'network;',
					w * 65, h * 50, '', 'Communication Network', null, null, this.getTagsForStencil(gn, '', dt + 'communication network').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=distribution;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Distribution Network', 'Distribution Network', null, null, this.getTagsForStencil(gn, '', dt + 'distribution network').join(' ')),
			this.createVertexTemplateEntry(am + 'distribution;strokeWidth=4;',
					w * 70, h * 30, '', 'Distribution Network', null, null, this.getTagsForStencil(gn, '', dt + 'distribution network').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=artifact;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Artifact', 'Artifact', null, null, this.getTagsForStencil(gn, '', dt + 'artifact').join(' ')),
			this.createVertexTemplateEntry('html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#BCD9AE;shape=note;size=14;',
					w * 70, h * 35, '', 'Artifact', null, null, this.getTagsForStencil(gn, '', dt + 'artifact').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=material;archiType=square;archiDomain=technology;',
					w * 150, h * 75, 'Material', 'Material', null, null, this.getTagsForStencil(gn, '', dt + 'material').join(' ')),
			this.createVertexTemplateEntry(am + 'material;',
					w * 60, h * 50, '', 'Material', null, null, this.getTagsForStencil(gn, '', dt + 'material').join(' '))
		];

		this.addPalette('archimate4Technology', 'ArchiMate 4 / Technology', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addArchimate4ImplementationAndMigrationPalette = function()
	{
		var am = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#F1BBB7;shape=mxgraph.archimate4.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.archimate4';
		var dt = 'archimate 4 implementation migration ';

		var w = 1.0;
		var h = 1.0;

		var fns =
		[
			this.createVertexTemplateEntry(am + 'element;appType=workPackage;archiType=rounded;archiDomain=implementation;',
					w * 150, h * 75, 'Work Package', 'Work Package', null, null, this.getTagsForStencil(gn, '', dt + 'work package').join(' ')),
			this.createVertexTemplateEntry(am + 'workPackage;strokeWidth=5;',
					w * 60, h * 50, '', 'Work Package', null, null, this.getTagsForStencil(gn, '', dt + 'work package').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=deliverable;archiDomain=implementation;',
					w * 150, h * 75, 'Deliverable', 'Deliverable', null, null, this.getTagsForStencil(gn, '', dt + 'deliverable').join(' ')),
			this.createVertexTemplateEntry(am + 'deliverable;',
					w * 60, h * 35, '', 'Deliverable', null, null, this.getTagsForStencil(gn, '', dt + 'deliverable').join(' ')),
			this.createVertexTemplateEntry(am + 'element;appType=plateau;archiDomain=implementation;',
					w * 150, h * 75, 'Plateau', 'Plateau', null, null, this.getTagsForStencil(gn, '', dt + 'plateau').join(' ')),
			this.createVertexTemplateEntry(am + 'plateau;',
					w * 60, h * 40, '', 'Plateau', null, null, this.getTagsForStencil(gn, '', dt + 'plateau').join(' '))
		];

		this.addPalette('archimate4Implementation and Migration', 'ArchiMate 4 / Implementation and Migration', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
})();
