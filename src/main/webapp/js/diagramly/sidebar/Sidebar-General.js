(function()
{
	// Adds general shapes
	Sidebar.prototype.addGeneralPalette = function()
	{
		this.setCurrentSearchEntryLibrary('general', 'generalGeneral');
		this.addGeneralGeneralPalette();
		this.setCurrentSearchEntryLibrary('general', 'generalMisc');
		this.addGeneralMiscPalette();
		this.setCurrentSearchEntryLibrary('general', 'generalAdvanced');
		this.addGeneralAdvancedPalette();
		this.setCurrentSearchEntryLibrary();
	};
	
	Sidebar.prototype.addGeneralGeneralPalette = function()
	{
		var sb = this;
		var gn = 'mxgraph.aws3';
		var dt = 'aws amazon web service analytics';
		
		var lineTags = 'line lines connector connectors connection connections arrow arrows ';
		
		this.addPaletteFunctions('generalGeneral', 'General', true,
		[
		 	this.createVertexTemplateEntry('rounded=0;whiteSpace=wrap;html=1;', 120, 60, '', 'Rectangle', null, null, 'rect rectangle box'),
		 	this.createVertexTemplateEntry('rounded=1;whiteSpace=wrap;html=1;', 120, 60, '', 'Rounded Rectangle', null, null, 'rounded rect rectangle box'),
		 	// Explicit strokecolor/fillcolor=none is a workaround to maintain transparent background regardless of current style
		 	this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
	 			40, 20, 'Text', 'Text', null, null, 'text textbox textarea label'),
		 	this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;rounded=0;', 190, 120,
				'<h1>Heading</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
				'Textbox', null, null, 'text textbox textarea'),
	 		this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;', 120, 80, '', 'Ellipse', null, null, 'oval ellipse state'),
			this.createVertexTemplateEntry('whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Square', null, null, 'square'),
			this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Circle', null, null, 'circle'),
		 	this.createVertexTemplateEntry('shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;', 120, 60, '', 'Process', null, null, 'process task'),
		 	this.createVertexTemplateEntry('rhombus;whiteSpace=wrap;html=1;', 80, 80, '', 'Diamond', null, null, 'diamond rhombus if condition decision conditional question test'),
		 	this.createVertexTemplateEntry('shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;', 120, 60, '', 'Parallelogram'),
		 	this.createVertexTemplateEntry('shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;', 120, 80, '', 'Hexagon', null, null, 'hexagon preparation'),
		 	this.createVertexTemplateEntry('triangle;whiteSpace=wrap;html=1;', 60, 80, '', 'Triangle', null, null, 'triangle logic inverter buffer'),
		 	this.createVertexTemplateEntry('shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;', 60, 80, '', 'Cylinder', null, null, 'cylinder data database'),
		 	this.createVertexTemplateEntry('ellipse;shape=cloud;whiteSpace=wrap;html=1;', 120, 80, '', 'Cloud', null, null, 'cloud network'),
		 	this.createVertexTemplateEntry('shape=document;whiteSpace=wrap;html=1;boundedLbl=1;', 120, 80, '', 'Document'),
		 	this.createVertexTemplateEntry('shape=internalStorage;whiteSpace=wrap;html=1;backgroundOutline=1;', 80, 80, '', 'Internal Storage'),
		 	this.createVertexTemplateEntry('shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;darkOpacity2=0.1;', 120, 80, '', 'Cube'),
		 	this.createVertexTemplateEntry('shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;', 120, 80, '', 'Step'),
		 	this.createVertexTemplateEntry('shape=trapezoid;perimeter=trapezoidPerimeter;whiteSpace=wrap;html=1;fixedSize=1;', 120, 60, '', 'Trapezoid'),
		 	this.createVertexTemplateEntry('shape=tape;whiteSpace=wrap;html=1;', 120, 100, '', 'Tape'),
		 	this.createVertexTemplateEntry('shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;', 80, 100, '', 'Note'),
		    this.createVertexTemplateEntry('shape=card;whiteSpace=wrap;html=1;', 80, 100, '', 'Card'),
		    this.createVertexTemplateEntry('shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;', 120, 80, '', 'Callout', null, null, 'bubble chat thought speech message'),
		 	this.createVertexTemplateEntry('shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;', 30, 60, 'Actor', 'Actor', false, null, 'user person human stickman'),
		 	this.createVertexTemplateEntry('shape=xor;whiteSpace=wrap;html=1;', 60, 80, '', 'Or', null, null, 'logic or'),
		 	this.createVertexTemplateEntry('shape=or;whiteSpace=wrap;html=1;', 60, 80, '', 'And', null, null, 'logic and'),
		 	this.createVertexTemplateEntry('shape=dataStorage;whiteSpace=wrap;html=1;fixedSize=1;', 100, 80, '', 'Data Storage'),    
		 	this.addEntry('curve', mxUtils.bind(this, function()
		 	{
				var cell = new mxCell('', new mxGeometry(0, 0, 50, 50), 'curved=1;endArrow=classic;html=1;');
				cell.geometry.setTerminalPoint(new mxPoint(0, 50), true);
				cell.geometry.setTerminalPoint(new mxPoint(50, 0), false);
				cell.geometry.points = [new mxPoint(50, 50), new mxPoint(0, 0)];
				cell.geometry.relative = true;
				cell.edge = true;
				
			    return this.createEdgeTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Curve');
		 	})),
		 	this.createEdgeTemplateEntry('shape=flexArrow;endArrow=classic;startArrow=classic;html=1;', 50, 50, '', 'Bidirectional Arrow', null, lineTags + 'bidirectional'),
		 	this.createEdgeTemplateEntry('shape=flexArrow;endArrow=classic;html=1;', 50, 50, '', 'Arrow', null, lineTags + 'directional directed'),
		 	this.createEdgeTemplateEntry('endArrow=none;dashed=1;html=1;', 50, 50, '', 'Dashed Line', null, lineTags + 'dashed undirected no'),
		 	this.createEdgeTemplateEntry('endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;', 50, 50, '', 'Dotted Line', null, lineTags + 'dotted undirected no'),
		 	this.createEdgeTemplateEntry('endArrow=none;html=1;', 50, 50, '', 'Line', null, lineTags + 'simple undirected plain blank no'),
		 	this.createEdgeTemplateEntry('endArrow=classic;startArrow=classic;html=1;', 50, 50, '', 'Bidirectional Connector', null, lineTags + 'bidirectional'),
		 	this.createEdgeTemplateEntry('endArrow=classic;html=1;', 50, 50, '', 'Directional Connector', null, lineTags + 'directional directed'),
		 	this.createEdgeTemplateEntry('shape=link;html=1;', 100, 0, '', 'Link', null, lineTags + 'link'),
		 	this.addEntry(lineTags + 'edge title', mxUtils.bind(this, function()
			{
				var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=classic;html=1;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(100, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
				
		    	var cell0 = new mxCell('Label', new mxGeometry(0, 0, 0, 0), 'edgeLabel;resizable=0;html=1;align=center;verticalAlign=middle;');
		    	cell0.geometry.relative = true;
		    	cell0.setConnectable(false);
		    	cell0.vertex = true;
		    	edge.insert(cell0);
				
				return this.createEdgeTemplateFromCells([edge], 100, 0, 'Connector with Label');
			})),
			this.addEntry(lineTags + 'edge title multiplicity', mxUtils.bind(this, function()
			{
				var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=classic;html=1;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;

		    	var cell0 = new mxCell('Label', new mxGeometry(0, 0, 0, 0), 'edgeLabel;resizable=0;html=1;align=center;verticalAlign=middle;');
		    	cell0.geometry.relative = true;
		    	cell0.setConnectable(false);
		    	cell0.vertex = true;
		    	edge.insert(cell0);
		    	
		    	var cell1 = new mxCell('Source', new mxGeometry(-1, 0, 0, 0), 'edgeLabel;resizable=0;html=1;align=left;verticalAlign=bottom;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
				
				return this.createEdgeTemplateFromCells([edge], 160, 0, 'Connector with 2 Labels');
			})),
			this.addEntry(lineTags + 'edge title multiplicity', mxUtils.bind(this, function()
			{
				var edge = new mxCell('Label', new mxGeometry(0, 0, 0, 0), 'endArrow=classic;html=1;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
				
		    	var cell0 = new mxCell('Label', new mxGeometry(0, 0, 0, 0), 'edgeLabel;resizable=0;html=1;align=center;verticalAlign=middle;');
		    	cell0.geometry.relative = true;
		    	cell0.setConnectable(false);
		    	cell0.vertex = true;
		    	edge.insert(cell0);
		    	
		    	var cell1 = new mxCell('Source', new mxGeometry(-1, 0, 0, 0), 'edgeLabel;resizable=0;html=1;align=left;verticalAlign=bottom;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
				
		    	var cell2 = new mxCell('Target', new mxGeometry(1, 0, 0, 0), 'edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;');
		    	cell2.geometry.relative = true;
		    	cell2.setConnectable(false);
		    	cell2.vertex = true;
		    	edge.insert(cell2);
		    	
				return this.createEdgeTemplateFromCells([edge], 160, 0, 'Connector with 3 Labels');
			})),
		 	this.addEntry(lineTags + 'edge shape symbol message mail email', mxUtils.bind(this, function()
			{
				var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=classic;html=1;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(100, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
				
		    	var cell = new mxCell('', new mxGeometry(0, 0, 20, 14), 'shape=message;html=1;outlineConnect=0;');
		    	cell.geometry.relative = true;
		    	cell.vertex = true;
		    	cell.geometry.offset = new mxPoint(-10, -7);
		    	edge.insert(cell);

				return this.createEdgeTemplateFromCells([edge], 100, 0, 'Connector with Symbol');
			}))
		]);
	};
	
	Sidebar.prototype.addGeneralMiscPalette = function()
	{
		var sb = this;
		var gn = 'general misc';
		var dt = '';
		var lineTags = 'line lines connector connectors connection connections arrow arrows '
		
		this.addPaletteFunctions('generalMisc', 'Misc', false,
		[
	   	 	this.createVertexTemplateEntry('text;strokeColor=none;fillColor=none;html=1;fontSize=24;fontStyle=1;verticalAlign=middle;align=center;', 100, 40, 'Title', 'Title', null, null, 'text heading title'),
		 	this.createVertexTemplateEntry('text;strokeColor=none;fillColor=none;html=1;whiteSpace=wrap;verticalAlign=middle;overflow=hidden;', 100, 80,
	 			'<ul><li>Value 1</li><li>Value 2</li><li>Value 3</li></ul>', 'Unordered List'),
		 	this.createVertexTemplateEntry('text;strokeColor=none;fillColor=none;html=1;whiteSpace=wrap;verticalAlign=middle;overflow=hidden;', 100, 80,
	 			'<ol><li>Value 1</li><li>Value 2</li><li>Value 3</li></ol>', 'Ordered List'),
	 		this.addDataEntry('table', 180, 120, 'Table 1', '7ZjJTsMwEIafJleUhZZybVgucAFewDTT2pLjiewpaXl6xolLVQFqWBJArZRKns2xv5H7y4myvFxdW1HJWyxAR9lllOUWkdpRucpB6yiNVRFlF1GaxvyL0qsPokkTjSthwVCXgrQteBJ6Ca2ndTha6+BwUlR+SOLRu6aSSl7mRcLDWiqC+0rMfLzmTbDPkbB0r569K2Z7hoaEMmBDzQy1FpVTzWRthlS6uBFrXNLmNRtrGpYHlmD14RYbV9jfNWAJZNecUquCZMiYtBhiCWohN2WBTSxc61i81m6J8SBAex9g1h0gL5mU0HcwI2EWXVi+ZVVYrB6EXQAFR4XKENjLJ6bhgm+utM5Ro0du0PgXEVYhqGG+qX1EIiyDYQOY10kbKKMpP4wpj09G0Yh3k7OdbG1+fLqlHI0jy432c4BwVIPr3MD0aw08/YH+nfbbP2N89rZ/324NMsq5xppNqYoCTFfG2V7G454Qjw4c8WoX7wDEx0fiO3/wAyA/O+pAbzqw3m3TELIwOZQTdPZrsnB+4IiHl4UkPiIfWheS5CgMfQvDZEBhSD5xY/7fZyjZf63u7dD0fKv++5B/QRwO5ia8h3mP6sDm9tNeE9v58vcC'),
	 		this.addDataEntry('table', 180, 120, 'Table 2', '7ZjBbqMwEIafhmuFISTptbTbS/eyrfbuBie2ZDzITEqyT79jMMlGWVTUBlqVSkTyjGeM+SbDLxPEab67t7yQPyETOojvgji1ANiM8l0qtA6iUGVBfBtEUUi/IPrRMcvq2bDgVhjskxA1CS9cb0XjaRwl7rV3lJIXboj82bluJOa0zVtGw0oqFI8FX7n5ih6CfCVyi4/qj3OFZK/AIFdGWJ+zAq15Uap6sSZCKp098D1ssb1Na7nobW4eKL/00Raqf02/f2FR7DoZ1C4P4F5ALtDuKaRSGUofsWw4hVKojWzTPLyQl41jc8g9IqWBp/p/wnF/wrRlVFz/EivkZtMH9jnMzELxxO1GoHcUoAwKe/dCNFpoa6V1ChpcTQwYdyOEwk9qsW5znwER8ha8B3NYtIaS3NBFmNLwKgkSepqUbHa06XLhFlMwJVr6J7g1BC+xEiX2LWD0tgLOLlC/2Vn9ftfDKGQXLaQxLvpYyHfXCIjpWkNFplRZJkxf2PGrsOcDsU46WV+2aT49690p5xHQzzvRx5NEf3j3j8B+8S0Rg0nE/rRMYyjGsrOVZl+0lRYfphjXnayTabEeXzFY2Ml+Pkn2Y0oGY9+aMbRmLEfUDHZ+EG+bafFFm4m9fiofrHvOD+Ut7eXEaH+AbnSfqK+nCX9A4SDz+DGxnjv51vgX'),
	 		this.addDataEntry('table title', 180, 120, 'Table with Title 1', '7ZhRb6MwDMc/Da8nAmPdvZbu9nJ7WfcFMnAhUohR4o12n34OpKumrmqlDXa6VqJS/Lcdkp8bWSFK82Z9Z2Vb32MJOkpvozS3iDSMmnUOWkdJrMooXURJEvMvSv4c8IreG7fSgqFTEpIh4UXqZxiUR/mkYVAdbXRQXS1bP6Tem85ranitC8HDrlYEy1YW3t/xTlhzJC0t1auX0piFAg1JZcCGpAK1lq1T/WyLPqJWuvwrN/hM2/dsrfmKs5dhMT5balUZHhe8Sz/lPOwCLMH6IIleChjuABsgu+GQTpVUh4ibgVZcg6rqbVoWROkGoXrP3YHlQWD7Oed0j/NBxLxkUlI/QEHSVKfQ3odZWmwfpa2AgtCi8qhuX5iGC9pKaZ2jRl8Tg8a/iLANTg2rbe4TEmETDBvAvE/aQ8nm/DCmPP6VRRnvJmdb7Gx+fLilHI0jy/8EPwdIRx04OrWAyecF3ATEoUzH6nn1DeW8GrecxvjoXTm/XClksiuNHZu1KkswpyJPj56Z65EQZ2eOeP0R7wTEry/E+4RkOuSzS1sYuy3MJmwLN+dygmY/1hZ+nzni6duCiC/Ip+4LQlwaw9iNQYgJO4PYv2j/p4dIHL9mj3ZqRr5l//uQf6A7nM1V+AjzEdsDm7svgr3vwwfDNw=='),
	 		this.addDataEntry('table title', 180, 150, 'Table with Title 2', '7Zhdb5swFIZ/DbcTHyVrbiFdb7Kbptq9Cw5YMj7IPi1kv37HYJK1FDWbQoOmSUSyz4dt3id+L/CitGrvNavL75Bz6UV3XpRqAOxHVZtyKb3QF7kXbbww9Onnhd8mskGX9WumucJzGsK+4YXJZ95HHtmT5H3U4EG6qClZbYfYZaOkxIrOuglo2JQC+a5mmc039CYUM8g07sRPG4p8CmSgkAnFtWvKQEpWG9GttukqSiHzLTvAMw77DLNkL1qeP0BjXLeGZkuLGde6p8V37qw2zaQoFI0zEsHumLiX5Bp5OylUF3Iq3XOoOOoDlTQix9JV3PZi+iUXRTm0xS7ITB8ojr0n3WngpH8fQzTCMEmAjoyCyQeeIVPFOTDGWuca6kemC44uUIOwUt29kBpHVYWUKUiwyBQouxFC7ZKS74feJ0CEaiDjhDku2okSJ/SQTKn/JfZiepuU5sFpTo8t15iCMqjpj2LX4Mxgww2eCzB8H+DBSewwfcQzugDOmxHO4KI8lbLVJ55/jMp/gwpI2r2EhqalyHOuztU8+vDS3MykcTzS+Ec3DP2Faz24U1+bGNpQqGLbd65mgNG+BvH7BZgLzupf8LO34JblZ6tP9LOvI5yX5bkcP1tdzc9uJ/1s4VrP52cTMK7gZ+v/fja3n60/0c8Cf8QzWvYl++s7tL6aoQXBpKMtXOz5HG2CxvyORtPTR4Uu9+qbwy8='),
	 		this.addDataEntry('crossfunctional cross-functional cross functional flowchart swimlane table', 400, 400, 'Cross-Functional Flowchart', '7ZhRb5swEMc/DY+bMCRt97jQpi+tVC2fwINbbMnYyD4C6aefjaHpBrTRlNCoTALJPp9t+P25O5kgTvL6XtOCPaoMRBDfBXGilULfyusEhAiikGdBfBtEUWjvIFqPjJJmNCyoBonHTIj8hB0VJXiL3dyYL+tSpsiVpM55LVSVMqrROxvci9bZMFq4JtKfzrRKGRfZA92rEjtr11tpVT1wCcYOhM5ViTKXry0G7RYb/uwWXDgDw9wCuSW2WTGOsClo6gYri8uvIGhheLN1s4KGtNSG7+AHGL+Os0JdUJm1nUJxiaDvdhZQt/EvJXHTvpTbjAq+lbadgnO1hhYSaIR6FHRjainfg8oB9d66VDxD5j0WoRcjZMC3DP8yUuMN25e5B91so5VuWMa4J+P3FJW2JtLXrOK5oNLJxZTmz/blqXhNp3mO5cpe9smS8OsyWNp5ie2TQ99ezl1joqRBTXmDAajBCgxejprHKBcNK7fvBPIz3hOSRCcQctET8olRA+8JmSopIW2j8GOD6Sji8TDxepT4C9yTE1+OEo/mQ5xcTYn8ahR5PB/k0c2UyK9HC8SbX/mnLBAnqAlD8XK+onDTE+/fw+TiQF9fTin4Nl/O0xYAEs6X9LR5n5Ae6S7xv1lr/yf+4cQ/pN75Ej/pH88/UZyQkRPzR6R+0j9Bz4f0xMm/f8adD+qzZn/bPfw5bMb++LH4Gw=='),
	 		this.createVertexTemplateEntry('text;html=1;strokeColor=#c0c0c0;fillColor=#ffffff;overflow=fill;rounded=0;', 280, 160,
	 			'<table border="1" width="100%" height="100%" cellpadding="4" style="width:100%;height:100%;border-collapse:collapse;">' +
	 			'<tr style="background-color:#A7C942;color:#ffffff;border:1px solid #98bf21;"><th align="left">Title 1</th><th align="left">Title 2</th><th align="left">Title 3</th></tr>' +
	 			'<tr style="border:1px solid #98bf21;"><td>Value 1</td><td>Value 2</td><td>Value 3</td></tr>' +
	 			'<tr style="background-color:#EAF2D3;border:1px solid #98bf21;"><td>Value 4</td><td>Value 5</td><td>Value 6</td></tr>' +
	 			'<tr style="border:1px solid #98bf21;"><td>Value 7</td><td>Value 8</td><td>Value 9</td></tr>' +
	 			'<tr style="background-color:#EAF2D3;border:1px solid #98bf21;"><td>Value 10</td><td>Value 11</td><td>Value 12</td></tr></table>', 'HTML Table 1'),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#c0c0c0;fillColor=none;overflow=fill;', 180, 140,
	 			'<table border="0" width="100%" height="100%" style="width:100%;height:100%;border-collapse:collapse;">' +
	 			'<tr><td align="center">Value 1</td><td align="center">Value 2</td><td align="center">Value 3</td></tr>' +
	 			'<tr><td align="center">Value 4</td><td align="center">Value 5</td><td align="center">Value 6</td></tr>' +
	 			'<tr><td align="center">Value 7</td><td align="center">Value 8</td><td align="center">Value 9</td></tr></table>', 'HTML Table 2'),
		 	this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;overflow=fill;', 180, 140,
	 			'<table border="1" width="100%" height="100%" style="width:100%;height:100%;border-collapse:collapse;">' +
	 			'<tr><td align="center">Value 1</td><td align="center">Value 2</td><td align="center">Value 3</td></tr>' +
	 			'<tr><td align="center">Value 4</td><td align="center">Value 5</td><td align="center">Value 6</td></tr>' +
	 			'<tr><td align="center">Value 7</td><td align="center">Value 8</td><td align="center">Value 9</td></tr></table>', 'HTML Table 3'),
		 	this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;overflow=fill;', 160, 140,
	 			'<table border="1" width="100%" height="100%" cellpadding="4" style="width:100%;height:100%;border-collapse:collapse;">' +
	 			'<tr><th align="center"><b>Title</b></th></tr>' +
	 			'<tr><td align="center">Section 1.1\nSection 1.2\nSection 1.3</td></tr>' +
	 			'<tr><td align="center">Section 2.1\nSection 2.2\nSection 2.3</td></tr></table>', 'HTML Table 4'),
		 	this.addEntry('link hyperlink', mxUtils.bind(this, function()
		 	{
		 		var cell = new mxCell('Link', new mxGeometry(0, 0, 60, 40), 'text;html=1;strokeColor=none;fillColor=none;whiteSpace=wrap;align=center;verticalAlign=middle;fontColor=#0000EE;fontStyle=4;');
		 		cell.vertex = true;
		 		this.graph.setLinkForCell(cell, 'https://www.draw.io');

		 		return this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Link');
		 	})),
		 	this.addEntry('timestamp date time text label', mxUtils.bind(this, function()
		 	{
		 		var cell = new mxCell('%date{ddd mmm dd yyyy HH:MM:ss}%', new mxGeometry(0, 0, 160, 20), 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;');
		 		cell.vertex = true;
		 		this.graph.setAttributeForCell(cell, 'placeholders', '1');

		 		return this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Timestamp');
		 	})),
		 	this.addEntry('variable placeholder metadata hello world text label', mxUtils.bind(this, function()
		 	{
		 		var cell = new mxCell('%name% Text', new mxGeometry(0, 0, 80, 20), 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;');
		 		cell.vertex = true;
		 		this.graph.setAttributeForCell(cell, 'placeholders', '1');
		 		this.graph.setAttributeForCell(cell, 'name', 'Variable');

		 		return this.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Variable');
		 	})),
			this.createVertexTemplateEntry('shape=ext;double=1;rounded=0;whiteSpace=wrap;html=1;', 120, 80, '', 'Double Rectangle', null, null, 'rect rectangle box double'),
		 	this.createVertexTemplateEntry('shape=ext;double=1;rounded=1;whiteSpace=wrap;html=1;', 120, 80, '', 'Double Rounded Rectangle', null, null, 'rounded rect rectangle box double'),
	 		this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;', 100, 60, '', 'Double Ellipse', null, null, 'oval ellipse start end state double'),
			this.createVertexTemplateEntry('shape=ext;double=1;whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Double Square', null, null, 'double square'),
			this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Double Circle', null, null, 'double circle'),
			this.createVertexTemplateEntry('rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;fillWeight=4;hachureGap=8;hachureAngle=45;fillColor=#1ba1e2;sketch=1;', 120, 60, '', 'Rectangle Sketch', true, null, 'rectangle rect box text sketch comic retro'),
			this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;strokeWidth=2;fillWeight=2;hachureGap=8;fillColor=#990000;fillStyle=dots;sketch=1;', 120, 60, '', 'Ellipse Sketch', true, null, 'ellipse oval sketch comic retro'),
			this.createVertexTemplateEntry('rhombus;whiteSpace=wrap;html=1;strokeWidth=2;fillWeight=-1;hachureGap=8;fillStyle=cross-hatch;fillColor=#006600;sketch=1;', 120, 60, '', 'Diamond Sketch', true, null, 'diamond sketch comic retro'),
		 	this.createVertexTemplateEntry('html=1;whiteSpace=wrap;shape=isoCube2;backgroundOutline=1;isoAngle=15;', 90, 100, '', 'Isometric Cube', true, null, 'cube box iso isometric'),
		 	this.createVertexTemplateEntry('html=1;whiteSpace=wrap;aspect=fixed;shape=isoRectangle;', 150, 90, '', 'Isometric Square', true, null, 'rectangle rect box iso isometric'),
		 	this.createEdgeTemplateEntry('edgeStyle=isometricEdgeStyle;endArrow=none;html=1;', 50, 100, '', 'Isometric Edge 1'),
		 	this.createEdgeTemplateEntry('edgeStyle=isometricEdgeStyle;endArrow=none;html=1;elbow=vertical;', 50, 100, '', 'Isometric Edge 2'),
		 	this.createVertexTemplateEntry('shape=curlyBracket;whiteSpace=wrap;html=1;rounded=1;', 20, 120, '', 'Curly Bracket'),
		 	this.createVertexTemplateEntry('line;strokeWidth=2;html=1;', 160, 10, '', 'Horizontal Line'),
		 	this.createVertexTemplateEntry('line;strokeWidth=2;direction=south;html=1;', 10, 160, '', 'Vertical Line'),
		 	this.createVertexTemplateEntry('line;strokeWidth=4;html=1;perimeter=backbonePerimeter;points=[];outlineConnect=0;', 160, 10, '', 'Horizontal Backbone', false, null, 'backbone bus network'),
		 	this.createVertexTemplateEntry('line;strokeWidth=4;direction=south;html=1;perimeter=backbonePerimeter;points=[];outlineConnect=0;', 10, 160, '', 'Vertical Backbone', false, null, 'backbone bus network'),
		 	this.createVertexTemplateEntry('shape=crossbar;whiteSpace=wrap;html=1;rounded=1;', 120, 20, '', 'Crossbar', false, null, 'crossbar distance measure dimension unit'),
		 	this.createVertexTemplateEntry('shape=image;html=1;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=1;aspect=fixed;image=' + this.gearImage, 52, 61, '', 'Image (Fixed Aspect)', false, null, 'fixed image icon symbol'),
		 	this.createVertexTemplateEntry('shape=image;html=1;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;image=' + this.gearImage, 50, 60, '', 'Image (Variable Aspect)', false, null, 'strechted image icon symbol'),
		 	this.createVertexTemplateEntry('icon;html=1;image=' + this.gearImage, 60, 60, 'Icon', 'Icon', false, null, 'icon image symbol'),
		 	this.createVertexTemplateEntry('label;whiteSpace=wrap;html=1;image=' + this.gearImage, 140, 60, 'Label', 'Label 1', null, null, 'label image icon symbol'),
		 	this.createVertexTemplateEntry('label;whiteSpace=wrap;html=1;align=center;verticalAlign=bottom;spacingLeft=0;spacingBottom=4;imageAlign=center;imageVerticalAlign=top;image=' + this.gearImage, 120, 80, 'Label', 'Label 2', null, null, 'label image icon symbol'),
			this.addEntry('shape group container', function()
			{
			    var cell = new mxCell('Label', new mxGeometry(0, 0, 160, 70),
					'html=1;whiteSpace=wrap;container=1;recursiveResize=0;collapsible=0;');
			    cell.vertex = true;
			    
				var symbol = new mxCell('', new mxGeometry(20, 20, 20, 30), 'triangle;html=1;whiteSpace=wrap;');
				symbol.vertex = true;
				cell.insert(symbol);
		    	
	    		return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Shape Group');
			}),
		 	this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;left=0;right=0;fillColor=none;', 120, 60, '', 'Partial Rectangle'),
			this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;bottom=1;right=1;left=1;top=0;fillColor=none;routingCenterX=-0.5;', 120, 60, '', 'Partial Rectangle'),
			this.createEdgeTemplateEntry('edgeStyle=segmentEdgeStyle;endArrow=classic;html=1;', 50, 50, '', 'Manual Line', null, lineTags + 'manual'),
		 	this.createEdgeTemplateEntry('shape=filledEdge;rounded=0;fixDash=1;endArrow=none;strokeWidth=10;fillColor=#ffffff;edgeStyle=orthogonalEdgeStyle;', 60, 40, '', 'Filled Edge'),
		 	this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;elbow=horizontal;endArrow=classic;html=1;', 50, 50, '', 'Horizontal Elbow', null, lineTags + 'elbow horizontal'),
		 	this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;elbow=vertical;endArrow=classic;html=1;', 50, 50, '', 'Vertical Elbow', null, lineTags + 'elbow vertical')
		]);
	};

	Sidebar.prototype.addGeneralAdvancedPalette = function()
	{
		var sb = this;
		var gn = 'general misc';
		var dt = '';
		var lineTags = 'line lines connector connectors connection connections arrow arrows '
		
		// Reusable cells
		var field = new mxCell('List Item', new mxGeometry(0, 0, 60, 26), 'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		field.vertex = true;
		
		this.addPaletteFunctions('generalAdvanced', 'Advanced', false,
		[
		 	this.createVertexTemplateEntry('shape=tapeData;whiteSpace=wrap;html=1;perimeter=ellipsePerimeter;', 80, 80, '', 'Tape Data'),
		 	this.createVertexTemplateEntry('shape=manualInput;whiteSpace=wrap;html=1;', 80, 80, '', 'Manual Input'),
		 	this.createVertexTemplateEntry('shape=loopLimit;whiteSpace=wrap;html=1;', 100, 80, '', 'Loop Limit'),
		 	this.createVertexTemplateEntry('shape=offPageConnector;whiteSpace=wrap;html=1;', 80, 80, '', 'Off Page Connector'),
		 	this.createVertexTemplateEntry('shape=delay;whiteSpace=wrap;html=1;', 80, 40, '', 'Delay'),
		 	this.createVertexTemplateEntry('shape=display;whiteSpace=wrap;html=1;', 80, 40, '', 'Display'),
		 	this.createVertexTemplateEntry('shape=singleArrow;direction=west;whiteSpace=wrap;html=1;', 100, 60, '', 'Arrow Left'),
		 	this.createVertexTemplateEntry('shape=singleArrow;whiteSpace=wrap;html=1;', 100, 60, '', 'Arrow Right'),
		 	this.createVertexTemplateEntry('shape=singleArrow;direction=north;whiteSpace=wrap;html=1;', 60, 100, '', 'Arrow Up'),
		 	this.createVertexTemplateEntry('shape=singleArrow;direction=south;whiteSpace=wrap;html=1;', 60, 100, '', 'Arrow Down'),
		 	this.createVertexTemplateEntry('shape=doubleArrow;whiteSpace=wrap;html=1;', 100, 60, '', 'Double Arrow'),
		 	this.createVertexTemplateEntry('shape=doubleArrow;direction=south;whiteSpace=wrap;html=1;', 60, 100, '', 'Double Arrow Vertical', null, null, 'double arrow'),
		 	this.createVertexTemplateEntry('shape=actor;whiteSpace=wrap;html=1;', 40, 60, '', 'User', null, null, 'user person human'),
		 	this.createVertexTemplateEntry('shape=cross;whiteSpace=wrap;html=1;', 80, 80, '', 'Cross'),
		 	this.createVertexTemplateEntry('shape=corner;whiteSpace=wrap;html=1;', 80, 80, '', 'Corner'),
		 	this.createVertexTemplateEntry('shape=tee;whiteSpace=wrap;html=1;', 80, 80, '', 'Tee'),
		 	this.createVertexTemplateEntry('shape=datastore;whiteSpace=wrap;html=1;', 60, 60, '', 'Data Store', null, null, 'data store cylinder database'),
		 	this.createVertexTemplateEntry('shape=orEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;', 80, 80, '', 'Or', null, null, 'or circle oval ellipse'),
		 	this.createVertexTemplateEntry('shape=sumEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;', 80, 80, '', 'Sum', null, null, 'sum circle oval ellipse'),
		 	this.createVertexTemplateEntry('shape=lineEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;', 80, 80, '', 'Ellipse with horizontal divider', null, null, 'circle oval ellipse'),
		 	this.createVertexTemplateEntry('shape=lineEllipse;line=vertical;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;', 80, 80, '', 'Ellipse with vertical divider', null, null, 'circle oval ellipse'),
		 	this.createVertexTemplateEntry('shape=sortShape;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;', 80, 80, '', 'Sort', null, null, 'sort'),
		 	this.createVertexTemplateEntry('shape=collate;whiteSpace=wrap;html=1;', 80, 80, '', 'Collate', null, null, 'collate'),
		 	this.createVertexTemplateEntry('shape=switch;whiteSpace=wrap;html=1;', 60, 60, '', 'Switch', null, null, 'switch router'),
			this.addEntry('process bar', function()
			{
				return sb.createVertexTemplateFromData('zZXRaoMwFIafJpcDjbNrb2233rRQ8AkyPdPQaCRJV+3T7yTG2rUVBoOtgpDzn/xJzncCIdGyateKNeVW5iBI9EqipZLS9KOqXYIQhAY8J9GKUBrgT+jbRDZ02aBhCmrzEwPtDZ9MHKBXdkpmoDWKCVN9VptO+Kw+8kqwGqMkK7nIN6yTB7uTNizbD1FSSsVPsjYMC1qFKHxwIZZSSIVxLZ1/nJNar5+oQPMT7IYCrqUta1ENzuqGaeOFTArBGs3f3Vmtoo2Se7ja1h00kSoHK4bBIKUNy3hdoPYU0mF91i9mT8EEL2ocZ3gKa00ayWujLZY4IfHKFonVDLsRGgXuQ90zBmWgneyTk3yT1iArMKrDKUeem9L3ajHrbSXwohxsQd/ggOleKM7ese048J2/fwuim1uQGmhQCW8vQMkacP3GCQgBFMftHEsr7cYYe95CnmKTPMFbYD8CQ++DGQy+/M5X4ku5wHYmdIktfvk9tecpavThqS3m/0YtnqIWPTy1cD77K2wYjo+Ay317I74A', 296, 100, 'Process Bar');
			}),
		 	this.createVertexTemplateEntry('swimlane;', 200, 200, 'Container', 'Container', null, null, 'container swimlane lane pool group'),
			this.addEntry('list group erd table', function()
			{
				var cell = new mxCell('List', new mxGeometry(0, 0, 140, 110),
			    	'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;' +
			    	'resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;');
				cell.vertex = true;
				cell.insert(sb.cloneCell(field, 'Item 1'));
				cell.insert(sb.cloneCell(field, 'Item 2'));
				cell.insert(sb.cloneCell(field, 'Item 3'));
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'List');
			}),
			this.addEntry('list item entry value group erd table', function()
			{
				return sb.createVertexTemplateFromCells([sb.cloneCell(field, 'List Item')], field.geometry.width, field.geometry.height, 'List Item');
			})
		]);
	};

})();
