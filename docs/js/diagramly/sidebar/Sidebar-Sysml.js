(function()
{
	/**
	 * Adds the sysML palettes to the sidebar.
	 */
	Sidebar.prototype.addSysMLModelElementsPalette = function(expand)
	{
		var gn = '';
		var dt = 'sysml model element ';
		var sb = this;
		var s = 'html=1;shape=mxgraph.sysml.';
		
		var fns = [
		   	this.addEntry(dt + 'comment', function()
	   		{
		    	var cardCell = new mxCell('Comment text', new mxGeometry(0, 40, 150, 40), 'shape=note;size=15;align=left;spacingLeft=10;html=1;whiteSpace=wrap;');
		    	cardCell.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=none;exitX=0.4;exitY=0;dashed=1;html=1;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(20, 0), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.geometry.x = 1;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=none;exitX=0.8;exitY=0;dashed=1;html=1;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(180, 0), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.geometry.x = 1;
		    	assoc2.edge = true;
		    	cardCell.insertEdge(assoc2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, assoc1, assoc2], 180, 80, 'Comment');
			}),
		    
		   	this.addEntry(dt + 'constraint note', function()
	   		{
		    	var cardCell = new mxCell('{C1: {L1} E1.x > E2.y}', new mxGeometry(0, 40, 150, 40), 'shape=note;size=15;align=left;spacingLeft=10;html=1;whiteSpace=wrap;');
		    	cardCell.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=none;exitX=0.4;exitY=0;dashed=1;html=1;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(20, 0), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.geometry.x = 1;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=none;exitX=0.8;exitY=0;dashed=1;html=1;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(180, 0), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.geometry.x = 1;
		    	assoc2.edge = true;
		    	cardCell.insertEdge(assoc2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, assoc1, assoc2], 180, 80, 'Constraint Note');
			}),
	
		   	this.addEntry(dt + 'constraint textual note', function()
	   		{
		    	var cardCell = new mxCell('Element1\n(any graphical node)', new mxGeometry(0, 0, 160, 60), 'shape=rect;strokeWidth=2;fontStyle=1;html=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('{constraint text}', new mxGeometry(160, 30, 0, 0), 'align=left;html=1;verticalAlign=middle;labelPosition=right;verticalLabelPosition=middle;labelBackgroundColor=none;fontSize=10');
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Constraint Textual Note');
			}),
	
		   	this.addEntry(dt + 'constraint textual note', function()
	   		{
				var assoc = new mxCell('{constraint text}', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=none;labelBackgroundColor=none;fontSize=10;strokeWidth=2;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('{any graphical path}', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10;');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Constraint Textual Note');
			}),
				
		    this.createVertexTemplateEntry(s + 'composite;symbol0=folder;fontStyle=1;spacingTop=15;tabWidth=80;tabHeight=20;tabPosition=left;symbol1=triangle;symbol1Width=7;symbol1Height=10;symbol1Align=right;symbol1VerticalAlign=top;symbol1Spacing=8;symbol1VSpacing=25;symbol1Direction=north;strokeWidth=2;whiteSpace=wrap;align=center;', 
		    		160, 90, 'Model', 'Model', null, null, this.getTagsForStencil(gn, '', dt + 'model').join(' ')),

		   	this.addEntry(dt + 'package diagram', function()
		   	{
			    var bg = new mxCell('<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;"><b>pkg</b>   Name</p>', new mxGeometry(0, 0, 300, 120), s + 'package;xSize=90;align=left;spacingLeft=10;overflow=fill;strokeWidth=1;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell('\nSubpackage1', new mxGeometry(15, 60, 100, 50), 'shape=folder;spacingLeft=10;tabWidth=40;tabHeight=14;tabPosition=left;fontSize=10;html=1;whiteSpace=wrap;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    var cardCell3 = new mxCell('\nSubpackage2', new mxGeometry(190, 20, 100, 50), 'shape=folder;spacingLeft=10;tabWidth=40;tabHeight=14;tabPosition=left;fontSize=10;html=1;whiteSpace=wrap;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
		    	var assoc1 = new mxCell('&lt;&lt;import&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=open;dashed=1;verticalAlign=top;labelBackgroundColor=none;endSize=12;html=1;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	cardCell2.insertEdge(assoc1, true);
		    	cardCell3.insertEdge(assoc1, false);
		    	bg.insert(assoc1);
			    
			   	return sb.createVertexTemplateFromCells([bg], 300, 120, 'Package Diagram');
			}),
			    
		   	this.addEntry(dt + 'package tab', function()
		   	{
			    var bg = new mxCell('Package1', new mxGeometry(0, 0, 300, 120), 'shape=folder;xSize=90;align=left;spacingLeft=10;align=left;verticalAlign=top;spacingLeft=5;spacingTop=-4;tabWidth=70;tabHeight=20;tabPosition=left;html=1;strokeWidth=1;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell('\nSubpackage1', new mxGeometry(15, 60, 100, 50), 'shape=folder;spacingLeft=10;tabWidth=40;tabHeight=14;tabPosition=left;fontSize=10;html=1;whiteSpace=wrap;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    var cardCell3 = new mxCell('\nSubpackage2', new mxGeometry(190, 30, 100, 50), 'shape=folder;spacingLeft=10;tabWidth=40;tabHeight=14;tabPosition=left;fontSize=10;html=1;whiteSpace=wrap;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
		    	var assoc1 = new mxCell('&lt;&lt;import&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=open;dashed=1;verticalAlign=top;labelBackgroundColor=none;endSize=12;html=1;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	cardCell2.insertEdge(assoc1, true);
		    	cardCell3.insertEdge(assoc1, false);
		    	bg.insert(assoc1);
			    
			   	return sb.createVertexTemplateFromCells([bg], 300, 120, 'Package (Tab)');
			}),
			    
		    this.createVertexTemplateEntry('shape=folder;tabWidth=80;tabHeight=20;tabPosition=left;strokeWidth=2;html=1;whiteSpace=wrap;align=center;', 
		    		160, 90, 'Package1', 'Package (Name)', null, null, this.getTagsForStencil(gn, '', dt + 'package name').join(' ')),
		    this.createVertexTemplateEntry('shape=note;size=15;align=left;spacingLeft=10;html=1;whiteSpace=wrap;', 
		    		160, 60, '&lt;&lt;problem&gt;&gt;\nDescription', 'Problem', null, null, this.getTagsForStencil(gn, '', dt + 'problem').join(' ')),
		    this.createVertexTemplateEntry('shape=note;size=15;align=left;spacingLeft=10;html=1;whiteSpace=wrap;', 
		    		160, 60, '&lt;&lt;rationale&gt;&gt;\nDescription', 'Rationale', null, null, this.getTagsForStencil(gn, '', dt + 'rationale').join(' ')),
		    this.createVertexTemplateEntry('shape=folder;tabWidth=80;tabHeight=20;tabPosition=left;html=1;whiteSpace=wrap;align=center;', 
		    		160, 80, '\n&lt;&lt;view&gt;&gt;\n{viewpoint = View name}\nName', 'View (Name)', null, null, this.getTagsForStencil(gn, '', dt + 'view name').join(' ')),
		    this.createVertexTemplateEntry('shape=folder;html=1;tabWidth=80;tabHeight=40;tabPosition=left;align=left;verticalAlign=top;spacingLeft=10;whiteSpace=wrap;', 
		    		160, 120, '&lt;&lt;view&gt;&gt;\nName', 'View', null, null, this.getTagsForStencil(gn, '', dt + 'view').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 120, 140, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;viewpoint&gt;&gt;<br/>' +
	    			'<b>Name</b></p><hr/>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">' +
	    			'stakeholders="..."<br/>' +
	    			'purpose="..."<br>' +
	    			'concerns="..."<br>' +
	    			'languages="..."<br>' +
	    			'methods="..."</p>', 
		    		'Viewpoint', null, null, this.getTagsForStencil(gn, '', dt + 'viewpoint').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;dashed=1;verticalAlign=bottom;', 
					160, 0, '&lt;&lt;conform&gt;&gt;', 'Conform', null, this.getTagsForStencil(gn, '', dt + 'conform').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;dashed=1;verticalAlign=bottom;', 
					160, 0, '&lt;&lt;stereotype1&gt;&gt;\ndependency1', 'Dependency', null, this.getTagsForStencil(gn, '', dt + 'dependency').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;dashed=1;verticalAlign=bottom;', 
					160, 0, '&lt;&lt;import&gt;&gt;', 'Public Package Import', null, this.getTagsForStencil(gn, '', dt + 'public package import').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;dashed=1;verticalAlign=bottom;', 
					160, 0, '&lt;&lt;access&gt;&gt;', 'Private Package Import', null, this.getTagsForStencil(gn, '', dt + 'private package import').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;' + mxConstants.STYLE_STARTARROW + '=sysMLPackCont;startSize=12;' + mxConstants.STYLE_ENDARROW + '=none;', 
					160, 0, '', 'Package Containment', null, this.getTagsForStencil(gn, '', dt + 'package containment').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endSize=12;endArrow=block;endFill=0;dashed=1;', 
					160, 0, '', 'Realization', null, this.getTagsForStencil(gn, '', dt + 'realization').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;dashed=1;verticalAlign=bottom;', 
					160, 0, '&lt;&lt;refine&gt;&gt;', 'Refine', null, this.getTagsForStencil(gn, '', dt + 'refine').join(' '))
		];
		
		this.addPalette('sysmlModel Elements', 'SysML / Model Elements', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLBlocksPalette = function(expand)
	{
		var gn = '';
		var dt = 'sysml block ';
		var sb = this;
		var s = 'html=1;strokeWidth=1;shape=mxgraph.sysml.';

		var fns = 
		[
		   	this.addEntry(dt + 'block definition diagram', function()
		   	{
			    var bg = new mxCell('<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;"><b>bdd</b>   Namespace1</p>', new mxGeometry(0, 0, 300, 100), s + 'package;labelX=120;align=left;spacingLeft=10;overflow=fill;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell('Block1', new mxGeometry(15, 30, 100, 50), 'shape=rect;fontStyle=1;html=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    var cardCell3 = new mxCell('Block2', new mxGeometry(190, 30, 100, 50), 'shape=rect;fontStyle=1;html=1;whiteSpace=wrap;align=center;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
				var assoc = new mxCell('part1', new mxGeometry(0, 0, 0, 0), 'align=right;html=1;verticalAlign=bottom;endArrow=none;startArrow=diamondThin;startSize=14;startFill=1;edgeStyle=none;endFill=0;');
				assoc.geometry.relative = true;
				assoc.geometry.x=1;
				assoc.edge = true;
				bg.insert(assoc);
		    	var sourceLabel = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	cardCell2.insertEdge(assoc, true);
		    	cardCell3.insertEdge(assoc, false);
			    
			   	return sb.createVertexTemplateFromCells([bg], 300, 100, 'Block Definition Diagram');
			}),
		    	
		   	this.addEntry(dt + 'relation', function()
		   	{
				var assoc = new mxCell('part1', new mxGeometry(0, 0, 0, 0), 'align=right;html=1;verticalAlign=bottom;endArrow=none;startArrow=diamondThin;startSize=14;startFill=1;edgeStyle=none;');
				assoc.geometry.relative = true;
				assoc.geometry.x=1;
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				assoc.edge = true;
		    	var sourceLabel = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Relation');
			}),
				
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;verticalAlign=top;align=left;whiteSpace=wrap;', 220, 340, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;block&gt;&gt;<br/>' +
	    			'{encapsulated}<br/>' +
	    			'<b>Block1</b></p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>constraints</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">{x &gt; y}</p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>operations</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">operation1 (p1 : Type1) : Type2</p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>parts</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">property1 : Block2</p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>references</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">property2 : Block3 [0..*] {ordered}</p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>values</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">property3 : Integer = 99 {readOnly}<br/>property4 : Real = 10.0</p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>properties</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">property5 : Type1</p>',
		    		'Block', null, null, this.getTagsForStencil(gn, '', dt + 'block').join(' ')),
		    this.createVertexTemplateEntry('shape=umlActor;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;', 
		    		30, 60, 'ActorName', 'Actor', null, null, this.getTagsForStencil(gn, '', dt + 'actor').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;align=center;', 160, 80, 
		    		'<p>&lt;&lt;actor&gt;&gt;<br/><b>ActorName</b></p>', 
		    		'Actor', null, null, this.getTagsForStencil(gn, '', dt + 'actor').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 180, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;valueType&gt;&gt;<br/>' +
	    			'<b>ValueType1</b></p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>operations</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">operation1 (p1 : Type1) : Type2</p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>properties</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">property1 : Type3</p><hr/>' +
					'<p style="margin:0px;margin-left:8px;text-align:center;">&lt;&lt;valueType&gt;&gt;</p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">unit = UnitName</p>',
		    		'ValueType', null, null, this.getTagsForStencil(gn, '', dt + 'value type valuetype').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 80, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;enumeration&gt;&gt;<br/>' +
	    			'<b>Enumeration1</b></p><hr/>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">literalName1<br/>literalName2</p>',
		    		'Enumeration', null, null, this.getTagsForStencil(gn, '', dt + 'enumeration').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;align=center;', 80, 40, 
		    		'<p style="margin:13px;"><b><i>Name</i></b></p>', 
		    		'Abstract Definition', null, null, this.getTagsForStencil(gn, '', dt + 'abstract definition').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;align=center;', 80, 40, 
		    		'<p style="margin:5px;">{abstract}<br/><b><i>Name</i></b></p>', 
		    		'Abstract Definition', null, null, this.getTagsForStencil(gn, '', dt + 'abstract definition').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;align=center;', 80, 40, 
		    		'<p style="margin:5px;"><b><i>Name</i></b><br/>{abstract}</p>', 
		    		'Abstract Definition', null, null, this.getTagsForStencil(gn, '', dt + 'abstract definition').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;align=center;', 200, 80, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;stereotype1&gt;&gt;<br/>' +
	    			'<b>Block1</b></p><hr/>' +
					'<p style="margin:0px;margin-left:8px;text-align:center;">&lt;&lt;stereotype1&gt;&gt;</p>' + 
					'<p style="margin:0px;margin-left:8px;text-align:left;">property1 = value</p>',
		    		'Stereotype Property Compartment', null, null, this.getTagsForStencil(gn, '', dt + 'stereotype property compartment').join(' ')),

		   	this.addEntry(dt + 'namespace compartment', function()
		   	{
			    var bg = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'<b>Block1</b></p><hr/>' +
						'<p style="font-size:10px;margin:0px;text-align:center;"><i>namespace</i></p>',
			    		new mxGeometry(0, 0, 300, 120), 'shape=rect;align=left;html=1;overflow=fill;whiteSpace=wrap;strokeWidth=1;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell('Block2', new mxGeometry(15, 60, 100, 50), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    var cardCell3 = new mxCell('Block3', new mxGeometry(190, 60, 100, 50), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
				var assoc = new mxCell('part1', new mxGeometry(0, 0, 0, 0), 'align=right;verticalAlign=bottom;endArrow=none;startArrow=diamondThin;startSize=14;startFill=1;edgeStyle=none;html=1;');
				assoc.geometry.relative = true;
				assoc.geometry.x=1;
				assoc.edge = true;
				bg.insert(assoc);
		    	var sourceLabel = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	cardCell2.insertEdge(assoc, true);
		    	cardCell3.insertEdge(assoc, false);
			    
			   	return sb.createVertexTemplateFromCells([bg], 300, 100, 'Namespace Compartment');
			}),
			    
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 250, 100, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Block1</b></p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>namespace</i></p>',
		    		'Block', null, null, this.getTagsForStencil(gn, '', dt + 'block').join(' ')),
		    
		   	this.addEntry(dt + 'structure compartment', function()
		   	{
			    var bg = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'<b>Block1</b></p><hr/>' +
						'<p style="font-size:10px;margin:0px;text-align:center;"><i>structure</i></p>',
			    		new mxGeometry(0, 0, 300, 120), 'shape=rect;align=left;html=1;overflow=fill;whiteSpace=wrap;strokeWidth=1;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell('Block2', new mxGeometry(15, 60, 100, 50), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    var cardCell3 = new mxCell('Block3', new mxGeometry(190, 60, 100, 50), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
				var assoc = new mxCell('c1:', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=none;');
				assoc.geometry.relative = true;
				assoc.edge = true;
				bg.insert(assoc);
		    	var targetLabel = new mxCell('e1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	var targetLabel2 = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	targetLabel2.geometry.relative = true;
		    	targetLabel2.setConnectable(false);
		    	targetLabel2.vertex = true;
		    	assoc.insert(targetLabel2);
		    	cardCell2.insertEdge(assoc, true);
		    	cardCell3.insertEdge(assoc, false);
			    
			   	return sb.createVertexTemplateFromCells([bg], 300, 100, 'Structure Compartment');
			}),
			    
		   	this.addEntry(dt + 'relation', function()
		   	{
				var assoc = new mxCell('c1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;startArrow=none;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('e1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Relation');
			}),
	
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 60, 
		    		'<p style="margin:0px;margin-top:10px;text-align:center;">' +
	    			'&lt;&lt;unit&gt;&gt;<br/>' +
					'<p style="margin:0px;margin-left:8px;text-align:center;">{quantityKind = QuantityKind1}<br/>' + 
	    			'<b>Unit1</b></p>',
		    		'Unit', null, null, this.getTagsForStencil(gn, '', dt + 'unit').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 80, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Unit1</b></p><hr/>' + 
	    			'<p style="margin:0px;margin-left:8px;text-align:center;">&lt;&lt;unit&gt;&gt;<br/>' +
					'{quantityKind = QuantityKind1}</p>', 
		    		'Unit', null, null, this.getTagsForStencil(gn, '', dt + 'unit').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 60, 
		    		'<p style="margin:0px;margin-top:10px;text-align:center;">' +
	    			'&lt;&lt;quantityKind&gt;&gt;<br/>' +
					'<p style="margin:0px;margin-left:8px;text-align:center;"><b>QuantityKind1</b></p>',
		    		'Quantity Kind', null, null, this.getTagsForStencil(gn, '', dt + 'quantity kind').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;fontSize=15;whiteSpace=wrap;', 70, 30, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;text-decoration:underline;">' +
	    			'<B>i1: Type1</b><br/>',
		    		'Instance Specification', null, null, this.getTagsForStencil(gn, '', dt + 'instance specification').join(' ')),

		    this.addEntry(dt + 'instance specification', function()
			{
			   	var cardCell = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;text-decoration:underline;">' +
		    			'<B>i1: Type1</b><br/>',
			   			new mxGeometry(0, 0, 80, 30), 'shape=rect;html=1;overflow=fill;fontSize=15;whiteSpace=wrap;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;text-decoration:underline;">' +
		    			'<B>i2: Type2</b><br/>',
			   			new mxGeometry(200, 0, 80, 30), 'shape=rect;html=1;overflow=fill;fontSize=15;whiteSpace=wrap;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;allocate&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'rounded=0;html=1;verticalAlign=top;labelBackgroundColor=none;endArrow=open;dashed=1;endSize=12;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    var assoc = new mxCell('A1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=open;endSize=12;edgeStyle=orthogonalEdgeStyle;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var targetLabel = new mxCell('p3', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	cardCell.insertEdge(assoc, true);
		    	cardCell2.insertEdge(assoc, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, assoc], 280, 30, 'Instance Specification');
			}),
	
		    this.addEntry(dt + 'relation', function()
			{
			    var assoc = new mxCell('A1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=open;endSize=12;edgeStyle=orthogonalEdgeStyle;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var targetLabel = new mxCell('p3', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Relation');
			}),
	
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 120, 60, 
		    		'<p style="margin:0px;margin-top:10px;text-align:center;text-decoration:underline;">' +
	    			'instance1: Type1<br/></p>' +
	    			'<p style="margin:0px;margin-top:4px;text-align:center;">value1</p>',
		    		'Instance Specification', null, null, this.getTagsForStencil(gn, '', dt + 'instance specification').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 160, 80, 
		    		'<p style="margin:0px;margin-top:10px;text-align:center;text-decoration:underline;">' +
	    			'instance1: Type1<br/></p><hr/>' +
	    			'<p style="margin:0px;margin-top:4px;margin-left:4px;text-align:left;">property1 = 10<br/>property2 = "value"</p>',
		    		'Instance Specification', null, null, this.getTagsForStencil(gn, '', dt + 'instance specification').join(' ')),

		    this.addEntry(dt + 'instance specification', function()
			{
			    var bg = new mxCell(
			    		'<p style="margin:0px;margin-top:5px;text-align:center;text-decoration:underline;">' +
		    			': Type1<hr/></p>',
			   			new mxGeometry(0, 0, 200, 180), 'shape=rect;html=1;overflow=fill;whiteSpace=wrap;strokeWidth=1;recursiveResize=0;');
			   	bg.vertex = true;
			   	var cardCell2 = new mxCell(
			    		'<p style="margin:0px;margin-top:5px;text-align:center;text-decoration:underline;">' +
		    			'instance1 / property1: Type2<hr/></p>',
			   			new mxGeometry(10, 30, 180, 140), 'shape=rect;html=1;overflow=fill;whiteSpace=wrap;');
			   	cardCell2.vertex = true;
			   	bg.insert(cardCell2);
			   	var cardCell3 = new mxCell(
			    		'<p style="margin:0px;margin-top:5px;text-align:center;text-decoration:underline;">' +
		    			'instance2 / property2:<br/>Type3<hr/></p>' +
		    			'<p style="margin:0px;margin-top:4px;margin-left:4px;text-align:left;">property1 = 10<br/>property2 = "value"</p>',
			   			new mxGeometry(20, 60, 160, 100), 'shape=rect;html=1;overflow=fill;whiteSpace=wrap;');
			   	cardCell3.vertex = true;
			   	bg.insert(cardCell3);
			    
			   	return sb.createVertexTemplateFromCells([bg], 200, 180, 'Instance Specification');
			}),
	
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 160, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;text-decoration:underline;">' +
	    			': Type1</p><hr/>', 
		    		'Instance Specification', null, null, this.getTagsForStencil(gn, '', dt + 'instance specification').join(' ')),

			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;dashed=1;verticalAlign=bottom;', 
					160, 0, '&lt;&lt;stereotype&gt;&gt;\ndependency1', 'Dependency', null, null, this.getTagsForStencil(gn, '', dt + 'dependency').join(' ')),
			
		    this.addEntry(dt + 'reference association', function()
		    {
				var assoc = new mxCell('association1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=open;endSize=12;edgeStyle=orthogonalEdgeStyle;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(250, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('0..1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('{ordered} 1..*', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	var targetLabel2 = new mxCell('property1', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	targetLabel2.geometry.relative = true;
		    	targetLabel2.setConnectable(false);
		    	targetLabel2.vertex = true;
		    	assoc.insert(targetLabel2);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Reference Association');
			}),
			
		    this.addEntry(dt + 'reference association', function()
		    {
				var assoc = new mxCell('association1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=orthogonalEdgeStyle;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(250, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var sourceLabel2 = new mxCell('property2', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel2.geometry.relative = true;
		    	sourceLabel2.setConnectable(false);
		    	sourceLabel2.vertex = true;
		    	assoc.insert(sourceLabel2);
		    	var targetLabel = new mxCell('{ordered} 0..*', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	var targetLabel2 = new mxCell('property1', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	targetLabel2.geometry.relative = true;
		    	targetLabel2.setConnectable(false);
		    	targetLabel2.vertex = true;
		    	assoc.insert(targetLabel2);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Reference Association');
			}),
			    
		    this.addEntry(dt + 'part association', function()
		    {
				var assoc = new mxCell('association1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=open;endSize=12;edgeStyle=orthogonalEdgeStyle;startFill=1;startSize=12;startArrow=diamondThin;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(250, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('0..1', new mxGeometry(-0.9, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('{ordered} 1..*', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	var targetLabel2 = new mxCell('property1', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	targetLabel2.geometry.relative = true;
		    	targetLabel2.setConnectable(false);
		    	targetLabel2.vertex = true;
		    	assoc.insert(targetLabel2);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Part Association');
			}),
		    
		    this.addEntry(dt + 'part association', function()
		    {
				var assoc = new mxCell('association1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=orthogonalEdgeStyle;startFill=1;startSize=12;startArrow=diamondThin;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(250, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('1', new mxGeometry(-0.9, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var sourceLabel2 = new mxCell('property2', new mxGeometry(-0.9, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel2.geometry.relative = true;
		    	sourceLabel2.setConnectable(false);
		    	sourceLabel2.vertex = true;
		    	assoc.insert(sourceLabel2);
		    	var targetLabel = new mxCell('{ordered} 0..*', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	var targetLabel2 = new mxCell('property1', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	targetLabel2.geometry.relative = true;
		    	targetLabel2.setConnectable(false);
		    	targetLabel2.vertex = true;
		    	assoc.insert(targetLabel2);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Part Association');
			}),
		    
		    this.addEntry(dt + 'shared association', function()
		    {
				var assoc = new mxCell('association1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=open;endSize=12;edgeStyle=orthogonalEdgeStyle;startFill=0;startSize=12;startArrow=diamondThin;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(250, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('0..1', new mxGeometry(-0.9, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('{ordered} 1..*', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	var targetLabel2 = new mxCell('property1', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	targetLabel2.geometry.relative = true;
		    	targetLabel2.setConnectable(false);
		    	targetLabel2.vertex = true;
		    	assoc.insert(targetLabel2);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Shared Association');
			}),
		    
		    this.addEntry(dt + 'shared association', function()
		    {
				var assoc = new mxCell('association1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=orthogonalEdgeStyle;startFill=0;startSize=12;startArrow=diamondThin;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(250, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('1', new mxGeometry(-0.9, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var sourceLabel2 = new mxCell('property2', new mxGeometry(-0.9, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel2.geometry.relative = true;
		    	sourceLabel2.setConnectable(false);
		    	sourceLabel2.vertex = true;
		    	assoc.insert(sourceLabel2);
		    	var targetLabel = new mxCell('{ordered} 0..*', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	var targetLabel2 = new mxCell('property1', new mxGeometry(0.9, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	targetLabel2.geometry.relative = true;
		    	targetLabel2.setConnectable(false);
		    	targetLabel2.vertex = true;
		    	assoc.insert(targetLabel2);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Shared Association');
			}),
				
		    this.addEntry(dt + 'multibranch part association', function()
		    {
			   	var cardCell = new mxCell('association1', new mxGeometry(123, 3, 4, 4), 'verticalAlign=bottom;html=1;ellipse;fillColor=#000000;strokeColor=#000000;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('property1', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;align=right;verticalAlign=bottom;endArrow=none;rounded=0;labelBackgroundColor=none;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(250, 5), false);
			   	edge1.geometry.relative = true;
			   	edge1.geometry.x = 1;
			   	edge1.edge = true;
		    	var edge1Label = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10;labelBackgroundColor=none;');
		    	edge1Label.geometry.relative = true;
		    	edge1Label.setConnectable(false);
		    	edge1Label.vertex = true;
		    	edge1.insert(edge1Label);
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('property2', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;align=right;verticalAlign=bottom;endArrow=none;rounded=0;labelBackgroundColor=none;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(250, 50), false);
			   	edge2.geometry.relative = true;
			   	edge2.geometry.x = 1;
			   	edge2.edge = true;
		    	var edge2Label = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	edge2Label.geometry.relative = true;
		    	edge2Label.setConnectable(false);
		    	edge2Label.vertex = true;
		    	edge2.insert(edge2Label);
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('property3', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;align=left;verticalAlign=bottom;endArrow=diamondThin;rounded=0;endFill=1;endSize=12;labelBackgroundColor=none;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(0, 5), false);
			   	edge3.geometry.relative = true;
			   	edge3.geometry.x = 1;
			   	edge3.edge = true;
		    	var edge3Label = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	edge3Label.geometry.relative = true;
		    	edge3Label.setConnectable(false);
		    	edge3Label.vertex = true;
		    	edge3.insert(edge3Label);
		    	cardCell.insertEdge(edge3, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3], 250, 50, 'Multibranch Part Association');
			}),
			    
		    this.addEntry(dt + 'multibranch shared association', function()
		    {
			   	var cardCell = new mxCell('association1', new mxGeometry(123, 3, 4, 4), 'verticalAlign=bottom;html=1;ellipse;fillColor=#000000;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('property1', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;align=right;verticalAlign=bottom;endArrow=none;rounded=0;labelBackgroundColor=none;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(250, 5), false);
			   	edge1.geometry.relative = true;
			   	edge1.geometry.x = 1;
			   	edge1.edge = true;
		    	var edge1Label = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;align=right;html=1;verticalAlign=top;labelBackgroundColor=none;fontSize=10;labelBackgroundColor=none;');
		    	edge1Label.geometry.relative = true;
		    	edge1Label.setConnectable(false);
		    	edge1Label.vertex = true;
		    	edge1.insert(edge1Label);
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('property2', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;align=right;verticalAlign=bottom;endArrow=none;rounded=0;labelBackgroundColor=none;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(250, 50), false);
			   	edge2.geometry.relative = true;
			   	edge2.geometry.x = 1;
			   	edge2.edge = true;
		    	var edge2Label = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;align=right;html=1;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	edge2Label.geometry.relative = true;
		    	edge2Label.setConnectable(false);
		    	edge2Label.vertex = true;
		    	edge2.insert(edge2Label);
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('property3', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;align=left;verticalAlign=bottom;endArrow=diamondThin;rounded=0;endFill=0;endSize=12;labelBackgroundColor=none;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(0, 5), false);
			   	edge3.geometry.relative = true;
			   	edge3.geometry.x = 1;
			   	edge3.edge = true;
		    	var edge3Label = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'resizable=0;align=left;html=1;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	edge3Label.geometry.relative = true;
		    	edge3Label.setConnectable(false);
		    	edge3Label.vertex = true;
		    	edge3.insert(edge3Label);
		    	cardCell.insertEdge(edge3, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3], 250, 50, 'Multibranch Shared Association');
			}),
			    
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endSize=12;endArrow=block;endFill=0;', 
					160, 0, '', 'Generalization', null, this.getTagsForStencil(gn, '', dt + 'generalization').join(' ')),
			
		    this.addEntry(dt + 'multibranch generalization', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(68, 23, 4, 4), 'verticalAlign=bottom;html=1;ellipse;fillColor=#000000;strokeColor=#000000;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;endSize=12;endArrow=block;endFill=0;elbow=horizontal;rounded=0;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(70, 0), false);
			   	edge1.geometry.relative = true;
			   	edge1.geometry.x = 1;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=none;rounded=0;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(140, 50), false);
			   	edge2.geometry.relative = true;
			   	edge2.geometry.x = 1;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=none;rounded=0;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(0, 50), false);
			   	edge3.geometry.relative = true;
			   	edge3.geometry.x = 1;
			   	edge3.edge = true;
		    	cardCell.insertEdge(edge3, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3], 140, 50, 'Multibranch Generalization');
			}),
	
		    this.addEntry(dt + 'generalization set', function()
		    {
			   	var cardCell = new mxCell('{disjoint}', new mxGeometry(68, 23, 4, 4), 'ellipse;html=1;fillColor=#000000;strokeColor=#000000;labelPosition=right;align=left;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;endSize=12;endArrow=block;endFill=0;elbow=horizontal;rounded=0;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(70, 0), false);
			   	edge1.geometry.relative = true;
			   	edge1.geometry.x = 1;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=none;rounded=0;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(140, 50), false);
			   	edge2.geometry.relative = true;
			   	edge2.geometry.x = 1;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=none;rounded=0;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(0, 50), false);
			   	edge3.geometry.relative = true;
			   	edge3.geometry.x = 1;
			   	edge3.edge = true;
		    	cardCell.insertEdge(edge3, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3], 140, 50, 'Generalization Set');
			}),
	
		    this.addEntry(dt + 'generalization set', function()
		    {
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=block;endFill=0;endSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(10, 0), false);
			   	edge1.geometry.setTerminalPoint(new mxPoint(10, 80), true);
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=block;endFill=0;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(40, 0), false);
			   	edge2.geometry.setTerminalPoint(new mxPoint(40, 80), true);
		    	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=block;endFill=0;endSize=12;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(70, 0), false);
			   	edge3.geometry.setTerminalPoint(new mxPoint(70, 80), true);
		    	edge3.geometry.relative = true;
			   	edge3.edge = true;
			   	var edge4 = new mxCell('{overlapping}', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;dashed=1;labelPosition=right;align=left;');
			   	edge4.geometry.relative = true;
			   	edge4.geometry.x = 1;
			   	edge4.geometry.setTerminalPoint(new mxPoint(0, 40), true);
			   	edge4.geometry.setTerminalPoint(new mxPoint(80, 40), false);
			   	edge4.edge = true;
			    
			   	return sb.createVertexTemplateFromCells([edge1, edge2, edge3, edge4], 150, 80, 'Generalization Set');
			}),

		    this.addEntry(dt + 'block namespace containment', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(68, 38, 4, 4), 'verticalAlign=bottom;html=1;ellipse;fillColor=#000000;strokeColor=#000000;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;endSize=12;endArrow=sysMLPackCont;elbow=horizontal;rounded=0;align=left;verticalAlign=middle');
			   	edge1.geometry.setTerminalPoint(new mxPoint(70, 16), false);
			   	edge1.geometry.relative = true;
			   	edge1.geometry.x = 1;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=none;rounded=0;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(140, 70), false);
			   	edge2.geometry.relative = true;
			   	edge2.geometry.x = 1;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=none;rounded=0;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(0, 70), false);
			   	edge3.geometry.relative = true;
			   	edge3.geometry.x = 1;
			   	edge3.edge = true;
		    	cardCell.insertEdge(edge3, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3], 140, 70, 'Block Namespace Containment');
			}),
			    
		    this.addEntry(dt + 'participant property', function()
		    {
			   	var cardCell = new mxCell('Block2', new mxGeometry(0, 0, 50, 20), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Block1', new mxGeometry(350, 0, 50, 20), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var cardCell3 = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'<b>Assoctiation1</b><hr/></p>' + 
		    			'<p style="margin:0px;margin-left:8px;text-align:center;">&lt;&lt;participant&gt;&gt; {end = property 1} p1 : Block 1<br/>' +
		    			'&lt;&lt;participant&gt;&gt; {end = property 2} p2 : Block 2</p>',
			   			new mxGeometry(50, 60, 300, 80), 'shape=rect;html=1;overflow=fill;whiteSpace=wrap;');
			   	cardCell3.vertex = true;
			   	var edge1 = new mxCell('Association1', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;verticalAlign=bottom;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
		    	cardCell2.insertEdge(edge1, false);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;dashed=1;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(200, 10), false);
		    	edge2.geometry.relative = true;
			   	edge2.edge = true;
		    	cardCell3.insertEdge(edge2, true);
		    	var label1 = new mxCell('property2', new mxGeometry(-1, 0, 0, 0), 'spacingLeft=3;html=1;align=left;verticalAlign=bottom;labelPosition=right;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = true;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	edge1.insert(label1);
		    	var label2 = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'spacingLeft=3;html=1;align=left;verticalAlign=top;labelPosition=right;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = true;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	edge1.insert(label2);
		    	var label3 = new mxCell('property1', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=bottom;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label3.geometry.relative = true;
		    	label3.setConnectable(false);
		    	label3.vertex = true;
		    	edge1.insert(label3);
		    	var label4 = new mxCell('{ordered} 0..*', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=top;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label4.geometry.relative = true;
		    	label4.setConnectable(false);
		    	label4.vertex = true;
		    	edge1.insert(label4);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, cardCell3, edge1, edge2], 400, 140, 'Participant Property');
			}),
			    
		    this.addEntry(dt + 'participant property', function()
		    {
			   	var cardCell = new mxCell('Block2', new mxGeometry(0, 0, 50, 20), 'shape=rect;html=1;strokeWidth=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Block1', new mxGeometry(350, 0, 50, 20), 'shape=rect;html=1;strokeWidth=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var bg = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'<b>Assoctiation1</b></p><hr/>' + 
		    			'<p style="margin:0px;text-align:center;"><i>structure</i></p>',
			   			new mxGeometry(20, 60, 360, 150), 'shape=rect;html=1;strokeWidth=1;overflow=fill;whiteSpace=wrap;recursiveResize=0;');
			   	bg.vertex = true;
			   	var cardCell4 = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'&lt;&lt;participant&gt;&gt;<br/>' +
		    			'{end = property 2}<br/><br/>' +
		    			'<b>p2 : Block 2</b></p>',
			   			new mxGeometry(20, 50, 150, 80), 'shape=rect;html=1;overflow=fill;dashed=1;whiteSpace=wrap;');
			   	cardCell4.vertex = true;
			   	bg.insert(cardCell4);
			   	var cardCell5 = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'&lt;&lt;participant&gt;&gt;<br/>' +
		    			'{end = property 1}<br/><br/>' +
		    			'<b>p1 : Block 1</b></p>',
			   			new mxGeometry(190, 50, 150, 80), 'shape=rect;html=1;overflow=fill;dashed=1;whiteSpace=wrap;');
			   	cardCell5.vertex = true;
			   	bg.insert(cardCell5);
			   	var edge1 = new mxCell('Association1', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;verticalAlign=bottom;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
		    	cardCell2.insertEdge(edge1, false);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;dashed=1;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(200, 10), false);
		    	edge2.geometry.relative = true;
			   	edge2.edge = true;
		    	bg.insertEdge(edge2, true);
		    	var label1 = new mxCell('property2', new mxGeometry(-1, 0, 0, 0), 'spacingLeft=3;html=1;align=left;verticalAlign=bottom;labelPosition=right;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = true;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	edge1.insert(label1);
		    	var label2 = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'spacingLeft=3;html=1;align=left;verticalAlign=top;labelPosition=right;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = true;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	edge1.insert(label2);
		    	var label3 = new mxCell('property1', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=bottom;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label3.geometry.relative = true;
		    	label3.setConnectable(false);
		    	label3.vertex = true;
		    	edge1.insert(label3);
		    	var label4 = new mxCell('{ordered} 0..*', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=top;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label4.geometry.relative = true;
		    	label4.setConnectable(false);
		    	label4.vertex = true;
		    	edge1.insert(label4);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, bg, edge1, edge2], 400, 260, 'Participant Property');
			}),
			    
		    this.addEntry(dt + 'participant property', function()
		    {
			   	var cardCell = new mxCell('Block2', new mxGeometry(0, 0, 50, 20), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Block1', new mxGeometry(350, 0, 50, 20), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var cardCell3 = new mxCell('Association1', new mxGeometry(140, 60, 120, 20), 'shape=rect;html=1;');
			   	cardCell3.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=none;html=1;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
		    	cardCell2.insertEdge(edge1, false);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;dashed=1;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(200, 10), false);
		    	edge2.geometry.relative = true;
			   	edge2.edge = true;
		    	cardCell3.insertEdge(edge2, true);
		    	var label1 = new mxCell('property2', new mxGeometry(-1, 0, 0, 0), 'spacingLeft=3;html=1;align=left;verticalAlign=bottom;labelPosition=right;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = true;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	edge1.insert(label1);
		    	var label2 = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'spacingLeft=3;html=1;align=left;verticalAlign=top;labelPosition=right;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = true;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	edge1.insert(label2);
		    	var label3 = new mxCell('property1', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=bottom;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label3.geometry.relative = true;
		    	label3.setConnectable(false);
		    	label3.vertex = true;
		    	edge1.insert(label3);
		    	var label4 = new mxCell('{ordered} 0..*', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=top;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label4.geometry.relative = true;
		    	label4.setConnectable(false);
		    	label4.vertex = true;
		    	edge1.insert(label4);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, cardCell3, edge1, edge2], 400, 80, 'Participant Property');
			}),
			    
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 300, 80, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Assoctiation1</b></p><hr/>' + 
	    			'<p style="margin:0px;margin-left:8px;text-align:center;">&lt;&lt;participant&gt;&gt; {end = property 1} p1 : Blcok 1<br/>' +
	    			'&lt;&lt;participant&gt;&gt; {end = property 2} p2 : Blcok 2</p>',
		    		'Association', null, null, this.getTagsForStencil(gn, '', dt + 'association').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 300, 80, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Assoctiation1</b></p><hr/>' + 
	    			'<p style="margin:0px;text-align:center;"><i>structure</i></p>',
		    		'Association', null, null, this.getTagsForStencil(gn, '', dt + 'association').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;dashed=1;whiteSpace=wrap;', 150, 80, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;participant&gt;&gt;<br/>' +
	    			'{end = property 1}<br/><br/>' +
	    			'<b>p1 : Block 1</b></p>',
		    		'Participant', null, null, this.getTagsForStencil(gn, '', dt + 'participant').join(' ')),

		    this.addEntry(dt + 'connector property', function()
		    {
			   	var bg = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'<b>Block1</b><hr/></p>' +
			    		'<p style="margin:0px;margin-top:-6px;margin-left:10px;text-align:left;">' +
		    			'&lt;&lt;connector&gt;&gt; c1 : Association1<br/>' +
		    			'&lt;&lt;connector&gt;&gt; c2 : Association2<hr/></p>' +
			    		'<p style="margin:0px;margin-top:-6px;text-align:center;font-size:10px;">' + 
		    			'<i>structure</i></p>',
			   			new mxGeometry(0, 0, 400, 250), 'shape=rect;html=1;overflow=fill;whiteSpace=wrap;strokeWidth=1;recursiveResize=0;');
			   	bg.vertex = true;
			   	var cardCell2 = new mxCell('p1:\nType1', new mxGeometry(20, 100, 80, 40), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	bg.insert(cardCell2);
			   	var cardCell3 = new mxCell('p2:\nType2', new mxGeometry(300, 100, 80, 40), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell3.vertex = true;
			   	bg.insert(cardCell3);
			   	var edge1 = new mxCell('c1: Association1', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;verticalAlign=bottom;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell2.insertEdge(edge1, true);
		    	cardCell3.insertEdge(edge1, false);
		    	bg.insert(edge1);
		    	var label1 = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=bottom;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = true;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	edge1.insert(label1);
		    	var label2 = new mxCell('e1', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=top;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = true;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	edge1.insert(label2);
			   	var cardCell4 = new mxCell('p3:\nType3', new mxGeometry(20, 160, 80, 40), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell4.vertex = true;
			   	bg.insert(cardCell4);
			   	var cardCell5 = new mxCell('p4:\nType4', new mxGeometry(300, 160, 80, 40), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell5.vertex = true;
			   	bg.insert(cardCell5);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;');
		    	edge2.geometry.relative = true;
			   	edge2.edge = true;
		    	cardCell4.insertEdge(edge2, true);
		    	cardCell5.insertEdge(edge2, false);
		    	bg.insert(edge2);
		    	var label3 = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=bottom;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label3.geometry.relative = true;
		    	label3.setConnectable(false);
		    	label3.vertex = true;
		    	edge2.insert(label3);
		    	var label4 = new mxCell('e1', new mxGeometry(1, 0, 0, 0), 'spacingRight=3;html=1;align=right;verticalAlign=top;labelPosition=left;labelBackgroundColor=none;fontSize=10');
		    	label4.geometry.relative = true;
		    	label4.setConnectable(false);
		    	label4.vertex = true;
		    	edge2.insert(label4);
			   	var cardCell6 = new mxCell('c2: Association2', new mxGeometry(140, 210, 120, 20), 'shape=rect;html=1;align=center;');
			   	cardCell6.vertex = true;
			   	bg.insert(cardCell6);
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;dashed=1;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(200, 180), false);
		    	edge3.geometry.relative = true;
			   	edge3.edge = true;
		    	cardCell6.insertEdge(edge3, true);
		    	bg.insert(edge3);
			    
			   	return sb.createVertexTemplateFromCells([bg], 400, 250, 'Connector Property');
			}),
	
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 120, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Block1</b><hr/>' +
	    			'&lt;&lt;connector&gt;&gt; c1 : Association1<br/>' +
	    			'&lt;&lt;connector&gt;&gt; c2 : Association2<hr/></p>',
		    		'Connector Property', null, null, this.getTagsForStencil(gn, '', dt + 'connector property').join(' ')),

		    this.addEntry(dt + 'internal block diagram', function()
		    {
			    var bg = new mxCell('<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;"><b>ibd</b>   Block1</p>', new mxGeometry(0, 0, 300, 100), s + 'package;labelX=100;align=left;spacingLeft=10;html=1;overflow=fill;whiteSpace=wrap;strokeWidth=0;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell('p1:\nType1', new mxGeometry(15, 30, 100, 50), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    var cardCell3 = new mxCell('p2:\nType2', new mxGeometry(190, 30, 100, 50), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
				var assoc = new mxCell('c1:a1', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=none;');
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('p3', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
		    	cardCell2.insertEdge(assoc, true);
		    	cardCell3.insertEdge(assoc, false);
		    	bg.insert(assoc);
			    
			   	return sb.createVertexTemplateFromCells([bg], 300, 100, 'Internal Block Diagram');
			}),
		    	
		    this.addEntry(dt + 'property', function()
		    {
			    var bg = new mxCell('', new mxGeometry(0, 0, 300, 120), 'shape=rect;html=1;strokeWidth=2;whiteSpace=wrap;strokeWidth=1;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;margin-right:4px;text-align:right;font-size:10px;">' +
		    			'0..*</p>' +
			    		'<p style="margin:0px;text-align:center;">' +
		    			'<b>p1 : Type1</b><hr/>' +
		    			'x : Integer = 4</p>',
			    		new mxGeometry(20, 20, 140, 80), 'shape=rect;html=1;overflow=fill;strokeWidth=2;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    var cardCell3 = new mxCell(
			    		'r1: Type2', 
			    		new mxGeometry(180, 30, 100, 50), 'shape=rect;html=1;fontStyle=1;dashed=1;strokeWidth=2;whiteSpace=wrap;align=center;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
			    
			   	return sb.createVertexTemplateFromCells([bg], 300, 120, 'Property');
			}),
		    	
		    this.createVertexTemplateEntry(s + 'package;html=1;overflow=fill;whiteSpace=wrap;', 300, 135, 
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;"><b>idb</b>   Block1</p>', 
		    		'Package', null, null, this.getTagsForStencil(gn, '', dt + 'package').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;align=center;', 100, 80, 
		    		'<p style="margin:0px;margin-top:4px;margin-right:4px;text-align:right;font-size:10px;">' +
	    			'0..*</p>' +
		    		'<p style="margin:0px;text-align:center;">' +
	    			'<b>p1 : Type1</b><hr/>' +
	    			'x : Integer = 4</p>',
		    		'Property', null, null, this.getTagsForStencil(gn, '', dt + 'property').join(' ')),

		    this.addEntry(dt + 'property', function()
		    {
			    var bg = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;margin-right:4px;text-align:right;font-size:10px;">' +
		    			'0..*</p>' +
			    		'<p style="margin:0px;text-align:center;">' +
		    			'p1 : Type1<hr/></p>',
			    		new mxGeometry(0, 0, 250, 160), 'shape=rect;html=1;overflow=fill;whiteSpace=wrap;strokeWidth=1;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'<b>p3 : Type3</b></p><hr/>' +
			    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
		    			'<i>initialValues</i></p>' +
			    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
		    			'x1 = 5.0<br/>x2 = "today"</p>',
			    		new mxGeometry(30, 50, 140, 100), 'shape=rect;html=1;overflow=fill;whiteSpace=wrap;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    
			   	return sb.createVertexTemplateFromCells([bg], 250, 160, 'Property');
			}),
	    	
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 100, 100, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>p3 : Type3</b></p><hr/>' +
		    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>initialValues</i></p>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'x1 = 5.0<br/>x2 = "today"</p>',
		    		'Property', null, null, this.getTagsForStencil(gn, '', dt + 'property').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 300, 70, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>p1 : [Type1]</b></p><hr/>' +
		    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>values</i></p>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'&lt;&lt;normal&gt;&gt; {mean = 2, stdDeviation = 0.1} x : Real</p>',
		    		'Property Specific Type', null, null, this.getTagsForStencil(gn, '', dt + 'property specific type').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 100, 70, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>p2</b></p><hr/>' +
		    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>values</i></p>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'y : Integer = 5</p>',
		    		'Property Specific Type', null, null, this.getTagsForStencil(gn, '', dt + 'property specific type').join(' ')),

			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;dashed=1;verticalAlign=bottom;', 
					160, 0, '&lt;&lt;stereotype1&gt;&gt;\ndependency1', 'Dependency', null, null, this.getTagsForStencil(gn, '', dt + 'dependency').join(' ')),

		    this.addEntry(dt + 'property', function()
		    {
				var assoc = new mxCell('', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=orthogonalEdgeStyle;strokeWidth=2;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Property');
			}),

		    this.addEntry(dt + 'binding connector', function()
		    {
				var assoc = new mxCell('&lt;&lt;equal&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=orthogonalEdgeStyle;strokeWidth=2;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel = new mxCell('1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel.geometry.relative = true;
		    	sourceLabel.setConnectable(false);
		    	sourceLabel.vertex = true;
		    	assoc.insert(sourceLabel);
		    	var targetLabel = new mxCell('1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel.geometry.relative = true;
		    	targetLabel.setConnectable(false);
		    	targetLabel.vertex = true;
		    	assoc.insert(targetLabel);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Binding Connector');
			}),
	
		    this.addEntry(dt + 'bidirectional connector', function()
		    {
				var assoc = new mxCell('c1 : association', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=orthogonalEdgeStyle;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel1 = new mxCell('0..1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel1.geometry.relative = true;
		    	sourceLabel1.setConnectable(false);
		    	sourceLabel1.vertex = true;
		    	assoc.insert(sourceLabel1);
		    	var sourceLabel2 = new mxCell('p1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel2.geometry.relative = true;
		    	sourceLabel2.setConnectable(false);
		    	sourceLabel2.vertex = true;
		    	assoc.insert(sourceLabel2);
		    	var targetLabel1 = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel1.geometry.relative = true;
		    	targetLabel1.setConnectable(false);
		    	targetLabel1.vertex = true;
		    	assoc.insert(targetLabel1);
		    	var targetLabel2 = new mxCell('p2', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	targetLabel2.geometry.relative = true;
		    	targetLabel2.setConnectable(false);
		    	targetLabel2.vertex = true;
		    	assoc.insert(targetLabel2);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Bidirectional Connector');
			}),
	
		    this.addEntry(dt + 'unidirectional connector', function()
		    {
				var assoc = new mxCell('c1 : association', new mxGeometry(0, 0, 0, 0), 'verticalAlign=bottom;html=1;endArrow=none;edgeStyle=orthogonalEdgeStyle;');
				assoc.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				assoc.geometry.setTerminalPoint(new mxPoint(160, 0), false);
		    	assoc.geometry.relative = true;
				assoc.edge = true;
		    	var sourceLabel1 = new mxCell('0..1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	sourceLabel1.geometry.relative = true;
		    	sourceLabel1.setConnectable(false);
		    	sourceLabel1.vertex = true;
		    	assoc.insert(sourceLabel1);
		    	var targetLabel1 = new mxCell('0..*', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;fontSize=10');
		    	targetLabel1.geometry.relative = true;
		    	targetLabel1.setConnectable(false);
		    	targetLabel1.vertex = true;
		    	assoc.insert(targetLabel1);
		    	var targetLabel2 = new mxCell('p1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	targetLabel2.geometry.relative = true;
		    	targetLabel2.setConnectable(false);
		    	targetLabel2.vertex = true;
		    	assoc.insert(targetLabel2);
			    
			   	return sb.createVertexTemplateFromCells([assoc], assoc.geometry.width, assoc.geometry.height, 'Unidirectional Connector');
			})
		];
		
		this.addPalette('sysmlBlocks', 'SysML / Blocks', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLPortsAndFlowsPalette = function(expand)
	{
		var gn = '';
		var dt = 'sysml port flow ';
		var sb = this;
		var s = 'html=1;shape=mxgraph.sysml.';

		var fns = [
		    this.addEntry(dt + 'port', function()
		    {
				var s = 'html=1;shape=mxgraph.sysml.';
		    	var cardCell = new mxCell('Transmission', new mxGeometry(0, 0, 160, 60), s + 'port1;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('p1', new mxGeometry(0, 20, 20, 20), 'shape=rect;html=1;resizable=1;align=right;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('p2', new mxGeometry(140, 20, 20, 20), 'shape=rect;html=1;resizable=1;labelBackgroundColor=none;fontSize=10;');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Port');
			}),
	
		    this.addEntry(dt + 'port conjugated', function()
		    {
		    	var cardCell = new mxCell('Transmission', new mxGeometry(0, 0, 200, 60), s + 'port2;fontStyle=1;spacingRight=20;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('p1 : ~T1', new mxGeometry(0, 20, 20, 20), 'shape=rect;html=1;resizable=1;align=right;verticalAlign=bottom;labelPositin=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('p2 : ~T2', new mxGeometry(140, 20, 60, 20), 'shape=rect;html=1;resizable=1;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Port (Conjugated Ports)');
			}),
	
		    this.addEntry(dt + 'port flow property', function()
		    {
		    	var cardCell = new mxCell('Transmission', new mxGeometry(0, 0, 160, 80), s + 'port3;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('p1', new mxGeometry(0, 10, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label1 = new mxCell('p2', new mxGeometry(0, 50, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('p3', new mxGeometry(160, 30, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Ports with Flow Properties');
			}),
	
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 160, 70, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Transmission</b></p><hr/>' +
		    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>ports</i></p>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'p1 : ITransCmd</p>',
		    		'Port (Compartment Notation)', null, null, this.getTagsForStencil(gn, '', dt + 'port compartment notation').join(' ')),

		    this.addEntry(dt + 'nested port', function()
		    {
		    	var cardCell = new mxCell('Transmission', new mxGeometry(0, 0, 160, 60), s + 'nestedPort;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('p1.1', new mxGeometry(0, 14, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('p1.2', new mxGeometry(0, 30, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
		    	var label3 = new mxCell('p1.3', new mxGeometry(0, 46, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label3.geometry.relative = false;
		    	label3.setConnectable(false);
		    	label3.vertex = true;
		    	cardCell.insert(label3);
		    	var label4 = new mxCell('p1', new mxGeometry(22, 10, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label4.geometry.relative = false;
		    	label4.setConnectable(false);
		    	label4.vertex = true;
		    	cardCell.insert(label4);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Nested Port');
			}),
	
		    this.addEntry(dt + 'proxy port', function()
		    {
		    	var cardCell = new mxCell('Transmission', new mxGeometry(0, 0, 160, 60), s + 'port1;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('&lt;&lt;proxy&gt;&gt;\np1', new mxGeometry(0, 20, 20, 20), 'shape=rect;html=1;resizable=1;align=right;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Proxy Port');
			}),

		    this.addEntry(dt + 'full port', function()
		    {
		    	var cardCell = new mxCell('Transmission', new mxGeometry(0, 0, 160, 60), s + 'port1;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('&lt;&lt;full&gt;&gt;\np1', new mxGeometry(0, 20, 20, 20), 'shape=rect;html=1;resizable=1;align=right;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Full Port');
			}),
	
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 100, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Transmission</b></p><hr/>' +
		    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>flow properties</i></p>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'in gearSelect: Gear<br/>' +
	    			'in engineTorque: Torque<br/>' +
	    			'out wheelsTorque: Torque</p>',
		    		'Flow Property', null, null, this.getTagsForStencil(gn, '', dt + 'flow property').join(' ')),

		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 250, 150, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>Transmission</b></p><hr/>' +
		    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>operations</i></p>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'prov Boolean selectGear(g : Gear)<br/>' +
	    			'reqd Torque getTorque()</p><hr/>' +
		    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>properties</i></p>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'prov temperature : Integer<br/>' +
	    			'reqd geometry : Spline</p>',
		    		'Required and Provided Features', null, null, this.getTagsForStencil(gn, '', dt + 'required provided feature').join(' ')),

		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 80, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;interfaceBlock&gt;&gt;\n' +
	    			'<b>ISpeedObserver</b></p><hr/>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'notifySpeedChange(): void</p>',
		    		'Interface Block', null, null, this.getTagsForStencil(gn, '', dt + 'interface block').join(' ')),

		    this.addEntry(dt + 'item flow', function()
		    {
			    var cardCell = new mxCell('eng: engine\n',	new mxGeometry(20, 0, 80, 60), s + 'itemFlow;fontStyle=1;flowDir=S;flowType=out;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('\ntrns: Transmission', new mxGeometry(0, 120, 120, 60), s + 'itemFlow;fontStyle=1;flowDir=N;flowType=in;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
		    	var assoc1 = new mxCell('Torque', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=right;endArrow=none;exitX=0.5;exitY=1;entryX=0.5;entryY=0;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	var label1 = new mxCell('p', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=10;verticalAlign=top;labelPosition=left;verticalLabelPosition=bottom;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = true;
		    	label1.geometry.x = -1;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	assoc1.insert(label1);
		    	var label2 = new mxCell('p', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=10;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=bottom;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = true;
		    	label2.geometry.x = 1;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	assoc1.insert(label2);
		    	cardCell.insertEdge(assoc1, true);
		    	cardCell2.insertEdge(assoc1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, assoc1], 120, 180, 'Item Flow');
			}),
	
		    this.addEntry(dt + 'item flow property', function()
		    {
			    var cardCell = new mxCell('eng: engine\n',	new mxGeometry(40, 0, 80, 60), s + 'itemFlow;fontStyle=1;flowDir=S;flowType=out;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('\ntrns: Transmission', new mxGeometry(20, 120, 120, 60), s + 'itemFlow;fontStyle=1;flowDir=N;flowType=in;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
		    	var assoc1 = new mxCell('torque: Torque', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=right;endArrow=none;exitX=0.5;exitY=1;entryX=0.5;entryY=0;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	var label1 = new mxCell('p', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=10;verticalAlign=top;labelPosition=left;verticalLabelPosition=bottom;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = true;
		    	label1.geometry.x = -1;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	assoc1.insert(label1);
		    	var label2 = new mxCell('p', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=10;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=bottom;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = true;
		    	label2.geometry.x = 1;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	assoc1.insert(label2);
		    	cardCell.insertEdge(assoc1, true);
		    	cardCell2.insertEdge(assoc1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, assoc1], 140, 180, 'Item Flow (Item Property)');
			}),

		    this.createVertexTemplateEntry(s + 'itemFlow;fontStyle=1;flowDir=N;flowType=in;whiteSpace=wrap;align=center;', 
		    		200, 80, 'eng:Engine', 'Item Flow North In', null, null, this.getTagsForStencil(gn, '', dt + 'item flow north in').join(' ')),
		    this.createVertexTemplateEntry(s + 'itemFlow;fontStyle=1;flowDir=E;flowType=out;whiteSpace=wrap;align=center;', 
		    		200, 80, 'eng:Engine', 'Item Flow East Out', null, null, this.getTagsForStencil(gn, '', dt + 'item flow east out').join(' ')),

		    this.addEntry(dt + 'item flow', function()
		    {
			    var cardCell = new mxCell('eng: engine',	new mxGeometry(40, 0, 100, 60), s + 'itemFlow;fontStyle=1;strokeWidth=1;flowDir=E;flowType=none;spacingRight=20;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('trns: Translation', new mxGeometry(260, 0, 140, 60), s + 'itemFlow;strokeWidth=1;fontStyle=1;flowDir=W;flowType=none;spacingLeft=15;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
		    	var assoc1 = new mxCell('Torque', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=left;verticalAlign=top;endArrow=none;exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	var label1 = new mxCell('ep:EP', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=5;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=bottom;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = true;
		    	label1.geometry.x = -1;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	assoc1.insert(label1);
		    	var label2 = new mxCell('tp:TP', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=right;spacingRight=5;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=bottom;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = true;
		    	label2.geometry.x = 1;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	assoc1.insert(label2);
		    	cardCell.insertEdge(assoc1, true);
		    	cardCell2.insertEdge(assoc1, false);
			    var bg = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
						'<b>c1: Association-1</b></p><hr/>' +
			    		'<p style="margin:0px;margin-left:4px;text-align:left;font-size:0.9em;">' +
						'&lt;&lt;participant&gt;&gt;{end = ep} epInLink : EP[1]<br/>' +
						'&lt;&lt;participant&gt;&gt;{end = tp} etInLink : TP[1]<hr/></p>' +
			    		'<p style="margin:0px;text-align:center;font-size:0.9em;">' +
						'structure</p>',
			    		new mxGeometry(0, 120, 470, 250), 'shape=rect;html=1;overflow=fill;whiteSpace=wrap;strokeWidth=1;recursiveResize=0;');
			   	bg.vertex = true;
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=elbowEdgeStyle;elbow=horizontal;dashed=1;');
		    	assoc2.geometry.relative = true;
				assoc2.geometry.setTerminalPoint(new mxPoint(160, 30), true);
		    	assoc2.edge = true;
		    	bg.insertEdge(assoc2, false);
		    	var cardCell4 = new mxCell('epInLink : EP', new mxGeometry(30, 100, 160, 120), s + 'itemFlowRight;fontStyle=1;spacingRight=40;whiteSpace=wrap;align=center;');
		    	cardCell4.vertex = true;
		    	bg.insert(cardCell4);
		    	var label3 = new mxCell('ep.1', new mxGeometry(160, 30, 0, 0), 'resizable=0;html=1;align=right;spacingRight=22;verticalAlign=middle;labelPosition=right;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label3.geometry.relative = false;
		    	label3.setConnectable(false);
		    	label3.vertex = true;
		    	cardCell4.insert(label3);
		    	var label4 = new mxCell('ep.2', new mxGeometry(160, 60, 0, 0), 'resizable=0;html=1;align=right;spacingRight=22;verticalAlign=middle;labelPosition=right;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label4.geometry.relative = false;
		    	label4.setConnectable(false);
		    	label4.vertex = true;
		    	cardCell4.insert(label4);
		    	var label5 = new mxCell('ep.3', new mxGeometry(160, 90, 0, 0), 'resizable=0;html=1;align=right;spacingRight=22;verticalAlign=middle;labelPosition=right;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label5.geometry.relative = false;
		    	label5.setConnectable(false);
		    	label5.vertex = true;
		    	cardCell4.insert(label5);
		    	var cardCell5 = new mxCell('tpInLink : TP', new mxGeometry(280, 100, 160, 120), s + 'itemFlowLeft;fontStyle=1;spacingLeft=40;whiteSpace=wrap;align=center;');
		    	cardCell5.vertex = true;
		    	bg.insert(cardCell5);
		    	var label6 = new mxCell('tp.1', new mxGeometry(0, 30, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=22;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label6.geometry.relative = false;
		    	label6.setConnectable(false);
		    	label6.vertex = true;
		    	cardCell5.insert(label6);
		    	var label7 = new mxCell('tp.2', new mxGeometry(0, 60, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=22;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label7.geometry.relative = false;
		    	label7.setConnectable(false);
		    	label7.vertex = true;
		    	cardCell5.insert(label7);
		    	var label8 = new mxCell('tp.3', new mxGeometry(0, 90, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=22;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label8.geometry.relative = false;
		    	label8.setConnectable(false);
		    	label8.vertex = true;
		    	cardCell5.insert(label8);
		    	var assoc3 = new mxCell('Vibration', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;verticalAlign=bottom;endArrow=none;exitX=1;exitY=0.25;entryX=0;entryY=0.25;');
		    	assoc3.geometry.relative = true;
		    	assoc3.edge = true;
		    	cardCell4.insertEdge(assoc3, true);
		    	cardCell5.insertEdge(assoc3, false);
		    	bg.insert(assoc3);
		    	var assoc4 = new mxCell('Heat', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;verticalAlign=bottom;endArrow=none;exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
		    	assoc4.geometry.relative = true;
		    	assoc4.edge = true;
		    	cardCell4.insertEdge(assoc4, true);
		    	cardCell5.insertEdge(assoc4, false);
		    	bg.insert(assoc4);
		    	var assoc5 = new mxCell('Current', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;verticalAlign=bottom;endArrow=none;exitX=1;exitY=0.75;entryX=0;entryY=0.75;');
		    	assoc5.geometry.relative = true;
		    	assoc5.edge = true;
		    	cardCell4.insertEdge(assoc5, true);
		    	cardCell5.insertEdge(assoc5, false);
		    	bg.insert(assoc5);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, assoc1, bg, assoc2], 470, 370, 'Item Flow');
			}),
	
		    this.addEntry(dt + 'item flow', function()
		    {
		    	var cardCell = new mxCell('tpInLink : TP', new mxGeometry(0, 0, 200, 120), s + 'itemFlowLeft;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('tp.1', new mxGeometry(0, 30, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=22;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('tp.2', new mxGeometry(0, 60, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=22;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
		    	var label3 = new mxCell('tp.3', new mxGeometry(0, 90, 0, 0), 'resizable=0;html=1;align=left;spacingLeft=22;verticalAlign=middle;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label3.geometry.relative = false;
		    	label3.setConnectable(false);
		    	label3.vertex = true;
		    	cardCell.insert(label3);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Item Flow');
			}),
			    			
		    this.addEntry(dt + 'item flow', function()
		    {
		    	var cardCell = new mxCell('epInLink : EP', new mxGeometry(0, 0, 200, 120), s + 'itemFlowRight;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('ep.1', new mxGeometry(200, 30, 0, 0), 'resizable=0;html=1;align=right;spacingRight=22;verticalAlign=middle;labelPosition=right;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('ep.2', new mxGeometry(200, 60, 0, 0), 'resizable=0;html=1;align=right;spacingRight=22;verticalAlign=middle;labelPosition=right;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
		    	var label3 = new mxCell('ep.3', new mxGeometry(200, 90, 0, 0), 'resizable=0;html=1;align=right;spacingRight=22;verticalAlign=middle;labelPosition=right;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10');
		    	label3.geometry.relative = false;
		    	label3.setConnectable(false);
		    	label3.vertex = true;
		    	cardCell.insert(label3);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Item Flow');
			}),
			    			
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 80, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;interface&gt;&gt;<br/>' +
	    			'<b>ISpeedObserver</b></p><hr/>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:4px;text-align:left;">' +
	    			'notifySpeedChange(): void</p>',
		    		'Interface', null, null, this.getTagsForStencil(gn, '', dt + 'interface').join(' ')),
		    
		    this.addEntry(dt + 'required interface', function()
		    {
		    	var cardCell = new mxCell('Transmission', new mxGeometry(90, 0, 160, 60), s + 'port4;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('p1', new mxGeometry(0, 20, 20, 20), 'shape=rect;html=1;resizable=0;align=left;verticalAlign=bottom;labelPosition=right;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var assoc1 = new mxCell('ITransCmd', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=left;verticalAlign=bottom;endArrow=sysMLReqInt;endSize=8;exitX=0;exitY=0.5;fillColor=#ffffff;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(0, 0), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.geometry.x = 1;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	var assoc2 = new mxCell('ITransData', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=left;verticalAlign=top;endArrow=sysMLProvInt;endSize=12;exitX=0;exitY=0.5;fillColor=#ffffff;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(0, 60), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.geometry.x = 1;
		    	assoc2.edge = true;
		    	cardCell.insertEdge(assoc2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, assoc1, assoc2], 250, 60, 'Required Interface');
			}),
			    
		    this.addEntry(dt + 'provided interface', function()
		    {
		    	var cardCell = new mxCell('Transmission', new mxGeometry(90, 0, 160, 60), s + 'port4;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('p1', new mxGeometry(0, 20, 20, 20), 'shape=rect;html=1;resizable=0;labelBackgroundColor=none;fontSize=10;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var assoc1 = new mxCell('ITransCmd', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=left;verticalAlign=bottom;endArrow=sysMLReqInt;endSize=8;exitX=0;exitY=0.5;fillColor=#ffffff;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(0, 0), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.geometry.x = 1;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	var assoc2 = new mxCell('ITransData', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=left;verticalAlign=top;endArrow=sysMLProvInt;endSize=12;exitX=0;exitY=0.5;fillColor=#ffffff;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(0, 60), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.geometry.x = 1;
		    	assoc2.edge = true;
		    	cardCell.insertEdge(assoc2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, assoc1, assoc2], 250, 60, 'Provided Interface');
			})
	    ];
	    
	    this.addPalette('sysmlPorts and Flows', 'SysML / Ports and Flows', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLConstraintBlocksPalette = function(expand)
	{
		var s = 'html=1;shape=mxgraph.sysml.';
		var gn = '';
		var dt = 'sysml constraint block ';
		var sb = this;

		var fns = [
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 200, 180, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    		'&lt;&lt;constraint&gt;&gt;<br/>' +
		    		'<b>ConstraintBlock1</b></p><hr/>' +
		    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>constraints</i></p>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'{{L1} x > y }<br/>nested: ConstraintBlock2</p><hr/>' +
		    		'<p style="font-size:10px;margin:0px;margin-top:4px;text-align:center;">' +
	    			'<i>parameters</i></p>' +
		    		'<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;">' +
	    			'x: Real<br/>y: Real</p>',
		    		'Constraint Block', null, null, this.getTagsForStencil(gn, '', dt + '').join(' ')),

		    this.addEntry(dt + 'provided interface', function()
		    {
			    var bg = new mxCell('<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;"><b>par</b>   Block1</p>', new mxGeometry(0, 0, 300, 170), s + 'package;labelX=120;align=left;spacingLeft=10;overflow=fill;whiteSpace=wrap;strokeWidth=1;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell('C1: Constraint', new mxGeometry(130, 50, 150, 100), s + 'paramDgm;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
		    	var label1 = new mxCell('x:', new mxGeometry(0, 25, 0, 0), 'html=1;resizable=0;align=left;verticalAlign=middle;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;fontSize=10;spacingLeft=22;fontStyle=1;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell2.insert(label1);
		    	var label2 = new mxCell('y:', new mxGeometry(0, 75, 0, 0), 'html=1;resizable=0;align=left;verticalAlign=middle;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;fontSize=10;spacingLeft=22;fontStyle=1;');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell2.insert(label2);
			    var cardCell3 = new mxCell('length: Real', new mxGeometry(30, 65, 20, 20), 'shape=rect;html=1;fontSize=10;verticalLabelPosition=top;verticalAlign=bottom;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
			    var cardCell4 = new mxCell('width: Real', new mxGeometry(30, 115, 20, 20), 'shape=rect;html=1;fontSize=10;verticalLabelPosition=top;verticalAlign=bottom;');
		    	cardCell4.vertex = true;
		    	bg.insert(cardCell4);
				var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;exitY=0.25;exitX=0;entryY=0.5;entryX=1;');
				assoc1.geometry.relative = true;
				assoc1.geometry.x=1;
				assoc1.edge = true;
		    	cardCell2.insertEdge(assoc1, true);
		    	cardCell3.insertEdge(assoc1, false);
		    	bg.insert(assoc1);
				var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;exitY=0.75;exitX=0;entryY=0.5;entryX=1;');
				assoc2.geometry.relative = true;
				assoc2.geometry.x=1;
				assoc2.edge = true;
		    	cardCell2.insertEdge(assoc2, true);
		    	cardCell4.insertEdge(assoc2, false);
		    	bg.insert(assoc2);
			    
			   	return sb.createVertexTemplateFromCells([bg], 300, 170, 'Parametric Diagram');
			}),
		    	
		    this.addEntry(dt + 'constraint property', function()
		    {
			    var cardCell = new mxCell('C1:Constraint1', new mxGeometry(0, 0, 150, 100), s + 'paramDgm;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('x: Real', new mxGeometry(0, 25, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=middle;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;fontSize=10;spacingLeft=22;fontStyle=1;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('y: Real', new mxGeometry(0, 75, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=middle;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;fontSize=10;spacingLeft=22;fontStyle=1;');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Constraint Property');
			}),
			    
		    this.addEntry(dt + 'constraint property', function()
		    {
		    	var cardCell = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
			    		'&lt;&lt;constraint&gt;&gt;<br/>' +
			    		'<b>C1: Constraint1</b></p><hr/>',
		    			new mxGeometry(0, 0, 150, 120), s + 'consProp;overflow=fill;whiteSpace=wrap;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('x: Real', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=middle;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;spacingLeft=22;spacingTop=120;fontStyle=1;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('y: Real', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=middle;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;spacingLeft=22;spacingTop=180;fontStyle=1;');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Constraint Property');
			})
		];

	    this.addPalette('sysmlConstraint Blocks', 'SysML / Constraint Blocks', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLActivitiesPalette = function(expand)
	{
		var s = 'html=1;shape=mxgraph.sysml.';
		var gn = '';
		var dt = 'sysml activity ';
		var sb = this;
		
		var fns = [
		    this.createVertexTemplateEntry('shape=rect;html=1;rounded=1;whiteSpace=wrap;align=center;', 
		    		160, 80, 'Action', 'Action', null, null, this.getTagsForStencil(gn, '', dt + 'action').join(' ')),
		    this.createVertexTemplateEntry(s + 'callBehAct;whiteSpace=wrap;align=center;', 
		    		160, 80, 'action name:\nbehavior name', 'Call Behavior Action', null, null, this.getTagsForStencil(gn, 'callBehAct', dt + 'call behavior action').join(' ')),
		    this.createVertexTemplateEntry(s + 'accEvent;strokeWidth=2;whiteSpace=wrap;align=center;', 
		    		100, 60, 'Event', 'Accept Event Action', null, null, this.getTagsForStencil(gn, 'accEvent', dt + 'accept event action').join(' ')),
		    this.createVertexTemplateEntry(s + 'timeEvent;strokeWidth=2;verticalLabelPosition=bottom;verticalAlignment=top;', 
		    		35, 40, '', 'Time Event', null, null, this.getTagsForStencil(gn, 'timeEvent', dt + 'time event').join(' ')),
		    this.createVertexTemplateEntry(s + 'sendSigAct;strokeWidth=2;whiteSpace=wrap;align=center;', 
		    		100, 60, 'Signal', 'Send Signal Action', null, null, this.getTagsForStencil(gn, 'sendSigAct', dt + 'send signal action').join(' ')),
		    this.createVertexTemplateEntry(s + 'actFinal;strokeWidth=2;verticalLabelPosition=bottom;verticalAlignment=top;', 
		    		40, 40, '', 'Activity Final', null, null, this.getTagsForStencil(gn, 'actFinal', dt + 'activity final').join(' ')),
		    this.createVertexTemplateEntry(s + 'actParamNode;align=left;spacingLeft=15;verticalAlign=top;spacingTop=-3;', 
		    		300, 135, 'act', 'Activity Parameter Node', null, null, this.getTagsForStencil(gn, 'act', dt + 'activity parameter node').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;rounded=1;html=1;whiteSpace=wrap;align=center;', 
		    		160, 80, '&lt;&lt;controlOperator&gt;&gt;\nCallBehaviorAction', 'Control Operator', null, null, this.getTagsForStencil(gn, '', dt + 'control operator').join(' ')),
		    this.createVertexTemplateEntry(s + 'package;align=left;spacingLeft=5;verticalAlign=top;spacingTop=-3;labelX=135;html=1;overflow=fill;', 
		    		250, 120, '<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;"><b>act</b>   [ControlOperator]</p>', 'Control Operator', 
		    		null, null, this.getTagsForStencil(gn, 'package', dt + 'control operator').join(' ')),

		    this.addEntry(dt + 'decision node', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(80, 40, 40, 40),
	    		'shape=rhombus;html=1;verticalLabelPosition=bottom;verticalAlignment=top;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;align=right;verticalAlign=bottom;endArrow=none;rounded=0;labelBackgroundColor=none;startArrow=open;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(100, 0), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('[guard]', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=open;rounded=0;labelBackgroundColor=none;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(200, 60), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('[else]', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=open;rounded=0;labelBackgroundColor=none;endSize=12;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(0, 60), false);
			   	edge3.geometry.relative = true;
			   	edge3.edge = true;
		    	cardCell.insertEdge(edge3, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3], 200, 80, 'Decision Node');
			}),
			    
		    this.createVertexTemplateEntry(s + 'flowFinal;strokeWidth=2;verticalLabelPosition=bottom;verticalAlignment=top;', 
		    		40, 40, '', 'Flow Final', null, null, this.getTagsForStencil(gn, 'flowFinal', dt + 'flow final').join(' ')),
		    
		    this.addEntry(dt + 'fork node', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(60, 0, 4, 80),'shape=rect;html=1;fillColor=#000000;verticalLabelPosition=bottom;verticalAlignment=top;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;endArrow=none;rounded=0;startArrow=open;strokeWidth=3;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(0, 40), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;strokeWidth=3;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(200, 10), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;strokeWidth=3;endSize=12;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(200, 30), false);
			   	edge3.geometry.relative = true;
			   	edge3.edge = true;
		    	cardCell.insertEdge(edge3, true);
			   	var edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;strokeWidth=3;endSize=12;');
			   	edge4.geometry.setTerminalPoint(new mxPoint(200, 50), false);
			   	edge4.geometry.relative = true;
			   	edge4.edge = true;
		    	cardCell.insertEdge(edge4, true);
			   	var edge5 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;strokeWidth=3;endSize=12;');
			   	edge5.geometry.setTerminalPoint(new mxPoint(200, 70), false);
			   	edge5.geometry.relative = true;
			   	edge5.edge = true;
		    	cardCell.insertEdge(edge5, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3, edge4, edge5], 200, 80, 'Fork Node');
			}),
			    
		    this.createVertexTemplateEntry('shape=ellipse;html=1;illColor=#000000;strokeWidth=2;verticalLabelPosition=bottom;verticalAlignment=top;', 
		    		40, 40, '', 'Initial Node', null, null, this.getTagsForStencil(gn, '', dt + 'initial node').join(' ')),

		    this.addEntry(dt + 'join node', function()
		    {
			    var cardCell = new mxCell('{joinspec=...}', new mxGeometry(136, 0, 4, 80),'shape=rect;html=1;fillColor=#000000;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;rounded=0;endArrow=open;strokeWidth=3;endSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(200, 40), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;startArrow=open;endArrow=none;rounded=0;strokeWidth=3;startSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(0, 10), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;startArrow=open;endArrow=none;rounded=0;strokeWidth=3;startSize=12;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(0, 30), false);
			   	edge3.geometry.relative = true;
			   	edge3.edge = true;
		    	cardCell.insertEdge(edge3, true);
			   	var edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;startArrow=open;endArrow=none;rounded=0;strokeWidth=3;startSize=12;');
			   	edge4.geometry.setTerminalPoint(new mxPoint(0, 50), false);
			   	edge4.geometry.relative = true;
			   	edge4.edge = true;
		    	cardCell.insertEdge(edge4, true);
			   	var edge5 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;startArrow=open;endArrow=none;rounded=0;strokeWidth=3;startSize=12;');
			   	edge5.geometry.setTerminalPoint(new mxPoint(0, 70), false);
			   	edge5.geometry.relative = true;
			   	edge5.edge = true;
		    	cardCell.insertEdge(edge5, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3, edge4, edge5], 200, 80, 'Join Node');
			}),
			    
		    this.addEntry(dt + 'is control', function()
		    {
			   	var cardCell = new mxCell('Action', new mxGeometry(90, 0, 120, 60), s + 'isControl;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('{control}', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;startArrow=open;rounded=0;endArrow=none;verticalAlign=bottom;exitX=0;exitY=0.5;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(0, 30), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('{control}', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;verticalAlign=bottom;entryX=0;entryY=0.5;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(300, 30), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2], 300, 60, 'Is Control');
			}),
	
		    this.addEntry(dt + 'is stream', function()
		    {
			   	var cardCell = new mxCell('Action', new mxGeometry(90, 0, 120, 60), s + 'isControl;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('{stream}', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;startArrow=open;rounded=0;endArrow=none;verticalAlign=bottom;exitX=0;exitY=0.5;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(0, 30), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('{stream}', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;verticalAlign=bottom;entryX=0;entryY=0.5;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(300, 30), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2], 300, 60, 'Is Stream');
			}),
	
		    this.addEntry(dt + 'is stream', function()
		    {
			   	var cardCell = new mxCell('Action', new mxGeometry(90, 0, 120, 60), s + 'isStream;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;startArrow=open;rounded=0;endArrow=none;exitX=0;exitY=0.5;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(0, 30), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;entryX=0;entryY=0.5;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(300, 30), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2], 300, 60, 'Is Stream');
			}),
	
		    this.addEntry(dt + 'is stream', function()
		    {
		    	var cardCell = new mxCell('act', new mxGeometry(0, 0, 200, 100), s + 'isActStream;align=left;spacingLeft=5;verticalAlign=top;spacingTop=-3;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('{stream}', new mxGeometry(200, 50, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;fontSize=10;spacingTop=5;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], 250, 100, 'Is Stream');
			}),
	
		    this.addEntry(dt + 'local pre precondition post postcondition', function()
		    {
			   	var cardCell1 = new mxCell('localPrecondition\nconstraint', new mxGeometry(0, 0, 120, 40), 'shape=note;html=1;size=15;strokeWidth=2;align=left;spacingLeft=5;whiteSpace=wrap;align=center;');
			   	cardCell1.vertex = true;
			   	var cardCell2 = new mxCell('Action', new mxGeometry(10, 65, 100, 50), 'shape=rect;html=1;rounded=1;strokeWidth=2;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var cardCell3 = new mxCell('localPostcondition\nconstraint', new mxGeometry(20, 140, 130, 40), 'shape=note;html=1;size=15;strokeWidth=2;align=left;spacingLeft=5;whiteSpace=wrap;align=center;');
			   	cardCell3.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;rounded=0;endArrow=none;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell1.insertEdge(edge1, true);
		    	cardCell2.insertEdge(edge1, false);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;rounded=0;endArrow=none;');
		    	edge2.geometry.relative = true;
			   	edge2.edge = true;
		    	cardCell2.insertEdge(edge2, true);
		    	cardCell3.insertEdge(edge2, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell1, cardCell2, cardCell3, edge1, edge2], 150, 180, 'Local Pre- and Postconditions');
			}),
			    
		    this.addEntry(dt + 'merge node', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(80, 0, 40, 40), 'shape=rhombus;html=1;verticalLabelPosition=top;verticalAlignment=bottom;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;align=right;verticalAlign=bottom;rounded=0;labelBackgroundColor=none;endArrow=open;endSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(100, 80), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;startArrow=open;endArrow=none;rounded=0;labelBackgroundColor=none;startSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(200, 20), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;startArrow=open;endArrow=none;rounded=0;labelBackgroundColor=none;startSize=12;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(0, 20), false);
			   	edge3.geometry.relative = true;
			   	edge3.edge = true;
		    	cardCell.insertEdge(edge3, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3], 200, 80, 'Merge Node');
			}),
	
		    this.addEntry(dt + 'no buffer', function()
		    {
			   	var cardCell = new mxCell('Action', new mxGeometry(90, 0, 120, 60), s + 'isControl;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;noBuffer&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;startArrow=open;rounded=0;endArrow=none;verticalAlign=bottom;exitX=0;exitY=0.5;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(0, 30), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('&lt;&lt;noBuffer&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;verticalAlign=bottom;entryX=0;entryY=0.5;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(300, 30), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2], 300, 60, 'No Buffer');
			}),
	
		    this.createVertexTemplateEntry('shape=rect;html=1;whiteSpace=wrap;align=center;', 
		    		160, 80, 'object node name:\n type name\n[state, state ...]', 'Object Node', null, null, this.getTagsForStencil(gn, '', dt + 'object node').join(' ')),
	    	
		    this.addEntry(dt + 'object node', function()
		    {
		    	var cardCell = new mxCell('Action', new mxGeometry(0, 0, 120, 60), s + 'isControl;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('pin name: type name\n[state, state ...]', new mxGeometry(0, 30, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=middle;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;spacingRight=5;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Object Node');
			}),
		    	
		    this.addEntry(dt + 'optional', function()
		    {
			   	var cardCell = new mxCell('Action', new mxGeometry(90, 0, 120, 60), s + 'isControl;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;optional&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;startArrow=open;rounded=0;endArrow=none;verticalAlign=bottom;exitX=0;exitY=0.5;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(0, 30), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('&lt;&lt;optional&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;verticalAlign=bottom;entryX=0;entryY=0.5;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(300, 30), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2], 300, 60, 'Optional');
			}),
	
		    this.addEntry(dt + 'optional', function()
		    {
		    	var cardCell = new mxCell('act', new mxGeometry(0, 0, 200, 100), s + 'isActStream;align=left;spacingLeft=5;verticalAlign=top;spacingTop=-3;fontStyle=1;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('&lt;&lt;optional&gt;&gt;', new mxGeometry(200, 50, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;fontSize=10;spacingTop=5;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Optional');
			}),
	
		    this.addEntry(dt + 'overwrite', function()
		    {
			   	var cardCell = new mxCell('Action', new mxGeometry(90, 0, 120, 60), s + 'isControl;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;overwrite&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;startArrow=open;rounded=0;endArrow=none;verticalAlign=bottom;exitX=0;exitY=0.5;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(0, 30), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('&lt;&lt;overwrite&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;verticalAlign=bottom;entryX=0;entryY=0.5;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(300, 30), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2], 300, 60, 'Overwrite');
			}),
	
		    this.createVertexTemplateEntry(s + 'paramSet;whiteSpace=wrap;align=center;', 
		    		160, 100, 'Action', 'Parameter Set', null, null, this.getTagsForStencil(gn, 'paramSet', dt + 'parameter set').join(' ')),
		    this.createVertexTemplateEntry(s + 'paramActSet;align=left;spacingLeft=15;verticalAlign=top;spacingTop=-3;fontStyle=1;', 
		    		250, 120, 'act', 'Parameter Set', null, null, this.getTagsForStencil(gn, 'paramActSet', dt + 'parameter set').join(' ')),

		    this.addEntry(dt + 'probability', function()
		    {
		    	var cardCell = new mxCell('Action', new mxGeometry(0, 0, 120, 160), s + 'probability;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('{ probability =\nvalueSpecification }', new mxGeometry(120, 40, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=bottom;labelBackgroundColor=none;fontSize=10;spacingBottom=25;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('{ probability =\nvalueSpecification }', new mxGeometry(120, 120, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10;spacingTop=25;');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Probability');
			}),
	
		    this.addEntry(dt + 'probability', function()
		    {
		    	var cardCell = new mxCell('act', new mxGeometry(0, 0, 120, 160), s + 'actProb;align=left;spacingLeft=5;verticalAlign=top;spacingTop=-3;fontStyle=1;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('{ probability =\nvalueSpecification }', new mxGeometry(120, 40, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelPosition=left;verticalLabelPosition=bottom;labelBackgroundColor=none;fontSize=10;spacingBottom=25;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
		    	var label2 = new mxCell('{ probability =\nvalueSpecification }', new mxGeometry(120, 120, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;fontSize=10;spacingTop=25;');
		    	label2.geometry.relative = false;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	cardCell.insert(label2);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Probability');
			}),
	
		    this.createVertexTemplateEntry('shape=rect;html=1;whiteSpace=wrap;align=center;', 
		    		120, 60, '&lt;&lt;continuous&gt;&gt;\nObject Node', 'Rate', null, null, this.getTagsForStencil(gn, '', dt + 'rate').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;whiteSpace=wrap;align=center;', 
		    		120, 60, '&lt;&lt;discrete&gt;&gt;\nObject Node', 'Rate', null, null, this.getTagsForStencil(gn, '', dt + 'rate').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;whiteSpace=wrap;align=center;', 
		    		140, 120, '{ rate = constant }\n{ rate = distribution }\n&lt;&lt;continuous&gt;&gt;\n&lt;&lt;discrete&gt;&gt;\nObject Node', 'Rate', 
		    		null, null, this.getTagsForStencil(gn, '', dt + 'rate').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;', 
		    		140, 80, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    		'Object Node</p><hr/>' +
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    		'&lt;&lt;rate&gt;&gt;<br/>' +
		    		'rate = constant<br/>' +
	    			'rate = distribution</p>',
		    		'Rate', null, null, this.getTagsForStencil(gn, '', dt + 'rate').join(' ')),
	    	
		    this.addEntry(dt + 'rate', function()
		    {
		    	var cardCell = new mxCell('act', new mxGeometry(0, 0, 200, 100), s + 'isActStream;align=left;spacingLeft=5;verticalAlign=top;spacingTop=-3;fontStyle=1;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell(
		    			'{ rate = constant }\n{ rate = distributuion}\n&lt;&lt;continuous&gt;&gt;\n&lt;&lt;discrete&gt;&gt;', 
		    			new mxGeometry(200, 50, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelPosition=left;verticalLabelPosition=middle;labelBackgroundColor=none;fontSize=10;spacingTop=5;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Rate');
			}),
	
		    this.addEntry(dt + 'rate', function()
		    {
			   	var cardCell = new mxCell('Action', new mxGeometry(90, 0, 120, 60), s + 'isControl;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('{ rate = constant }\n{ rate = distributuion}\n&lt;&lt;continuous&gt;&gt;\n&lt;&lt;discrete&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;startArrow=open;rounded=0;endArrow=none;verticalAlign=top;exitX=0;exitY=0.5;labelBackgroundColor=none;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(0, 30), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('{ rate = constant }\n{ rate = distributuion}\n&lt;&lt;continuous&gt;&gt;\n&lt;&lt;discrete&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;endArrow=open;rounded=0;verticalAlign=top;entryX=0;entryY=0.5;labelBackgroundColor=none;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(300, 30), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2], 'Rate');
			}),
	
		    this.addEntry(dt + 'control flow', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(0, 0, 60, 40), 'shape=rect;html=1;rounded=1;whiteSpace=wrap;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('', new mxGeometry(100, 0, 60, 40), 'shape=rect;html=1;rounded=1;whiteSpace=wrap;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;endArrow=open;labelBackgroundColor=none;endSize=12;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
		    	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 160, 60, 'control flow');
			}),
	
		    this.addEntry(dt + 'control flow', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(0, 0, 60, 40), 'shape=rect;html=1;rounded=1;whiteSpace=wrap;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('', new mxGeometry(100, 0, 60, 40), 'shape=rect;html=1;rounded=1;whiteSpace=wrap;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;endArrow=open;labelBackgroundColor=none;dashed=1;endSize=12;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
		    	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 160, 60, 'Control Flow');
			}),
	
		    this.addEntry(dt + 'object flow', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(0, 0, 60, 40), 'shape=rect;html=1;rounded=1;strokeWidth=2;whiteSpace=wrap;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('', new mxGeometry(100, 0, 60, 40), 'shape=rect;html=1;strokeWidth=2;whiteSpace=wrap;');
			   	cardCell2.vertex = true;
			   	var cardCell3 = new mxCell('', new mxGeometry(200, 0, 60, 40), 'shape=rect;html=1;rounded=1;strokeWidth=2;whiteSpace=wrap;');
			   	cardCell3.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;endArrow=open;labelBackgroundColor=none;strokeWidth=2;endSize=12;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
		    	cardCell2.insertEdge(edge1, false);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;endArrow=open;labelBackgroundColor=none;strokeWidth=2;endSize=12;');
		    	edge2.geometry.relative = true;
			   	edge2.edge = true;
		    	cardCell2.insertEdge(edge2, true);
		    	cardCell3.insertEdge(edge2, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, cardCell3, edge1, edge2], 260, 60, 'Object Flow');
			}),
	
		    this.addEntry(dt + 'object flow', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(0, 0, 60, 40), s + 'objFlowR;strokeWidth=2;whiteSpace=wrap;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('', new mxGeometry(140, 0, 60, 40), s + 'objFlowL;strokeWidth=2;whiteSpace=wrap;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;endArrow=open;labelBackgroundColor=none;strokeWidth=2;endSize=12;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
		    	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 200, 60, 'Object Flow');
			}),
	
		   	this.createVertexTemplateEntry(s + 'objFlowR;whiteSpace=wrap;', 
		   			120, 60, '', 'Object Flow', null, null, this.getTagsForStencil(gn, 'objFlowR', dt + 'object flow').join(' ')),
		    this.createVertexTemplateEntry(s + 'objFlowL;whiteSpace=wrap;', 
		    		120, 60, '', 'Object Flow', null, null, this.getTagsForStencil(gn, 'objFlowL', dt + 'object flow').join(' ')),

		    this.addEntry(dt + 'probability', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(155, 40, 40, 40), 'shape=rhombus;html=1;whiteSpace=wrap;verticalLabelPosition=bottom;verticalAlignment=top;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;align=right;verticalAlign=bottom;endArrow=none;rounded=0;labelBackgroundColor=none;startArrow=open;startSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(175, 0), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, true);
			   	var edge2 = new mxCell('{ probability = valueSpecification }', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=open;rounded=0;labelBackgroundColor=none;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(350, 60), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('{ probability = valueSpecification }', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;verticalAlign=bottom;endArrow=open;rounded=0;labelBackgroundColor=none;endSize=12;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(0, 60), false);
			   	edge3.geometry.relative = true;
			   	edge3.edge = true;
		    	cardCell.insertEdge(edge3, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3], 350, 80, 'Probability');
			}),
			    
		    this.addEntry(dt + 'probability', function()
		    {
		    	var cardCell = new mxCell('Action', new mxGeometry(0, 0, 160, 60), s + 'objFlowR;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var assoc1 = new mxCell('{ probability = valueSpecification }', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=center;verticalAlign=bottom;endArrow=open;endSize=12;exitX=1;exitY=0.5;fillColor=#ffffff;labelBackgroundColor=none;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(250, 0), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.geometry.x = 1;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	var assoc2 = new mxCell('{ probability = valueSpecification }', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=center;verticalAlign=top;endArrow=open;endSize=12;exitX=1;exitY=0.5;fillColor=#ffffff;labelBackgroundColor=none;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(250, 60), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.geometry.x = 1;
		    	assoc2.edge = true;
		    	cardCell.insertEdge(assoc2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, assoc1, assoc2], 250, 60, 'Probability');
			}),
			    
		    this.addEntry(dt + 'probability', function()
		    {
		    	var cardCell = new mxCell('Object Node', new mxGeometry(0, 0, 160, 60), 'shape=rect;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var assoc1 = new mxCell('{ probability = valueSpecification }', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=center;verticalAlign=bottom;endArrow=open;endSize=12;exitX=1;exitY=0.3;fillColor=#ffffff;labelBackgroundColor=none;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(250, 0), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.geometry.x = 1;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	var assoc2 = new mxCell('{ probability = valueSpecification }', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;align=center;verticalAlign=top;endArrow=open;endSize=12;exitX=1;exitY=0.7;fillColor=#ffffff;labelBackgroundColor=none;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(250, 60), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.geometry.x = 1;
		    	assoc2.edge = true;
		    	cardCell.insertEdge(assoc2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, assoc1, assoc2], 250, 60, 'Probability');
			}),
			    
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;verticalAlign=top;labelBackgroundColor=none;', 160, 0, 
					'{ rate = constant }\n{rate = distribution}\n&lt;&lt;continuous&gt;&gt;\n&lt;&lt;discrete&gt;&gt;', 
					'Rate', null, null, this.getTagsForStencil(gn, '', dt + 'rate').join(' ')),
		    
		    this.addEntry(dt + 'in block definition diagram activity association', function()
		    {
			    var bg = new mxCell('bdd', new mxGeometry(0, 0, 330, 250), s + 'package;labelX=45;align=left;spacingLeft=5;verticalAlign=top;spacingTop=-3;fontStyle=1;strokeWidth=1;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell('&lt;&lt;activity&gt;&gt;\nactivity name', new mxGeometry(30, 40, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    var cardCell3 = new mxCell('&lt;&lt;activity&gt;&gt;\nactivity name', new mxGeometry(30, 160, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
				var assoc1 = new mxCell('action\nname', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;endFill=0;startArrow=diamondThin;startFill=1;startSize=12;align=left;verticalAlign=bottom;');
				assoc1.geometry.relative = true;
				assoc1.geometry.x=1;
				assoc1.edge = true;
		    	cardCell2.insertEdge(assoc1, true);
		    	cardCell3.insertEdge(assoc1, false);
		    	bg.insert(assoc1);
			    var cardCell4 = new mxCell('&lt;&lt;activity&gt;&gt;\nactivity name', new mxGeometry(180, 40, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell4.vertex = true;
		    	bg.insert(cardCell4);
			    var cardCell5 = new mxCell('&lt;&lt;block&gt;&gt;\nblock name', new mxGeometry(180, 160, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell5.vertex = true;
		    	bg.insert(cardCell5);
				var assoc2 = new mxCell('object\nnode\nname', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;endFill=0;startFill=1;startSize=12;align=left;verticalAlign=bottom;');
				assoc2.geometry.relative = true;
				assoc2.geometry.x=1;
				assoc2.edge = true;
		    	cardCell4.insertEdge(assoc2, true);
		    	cardCell5.insertEdge(assoc2, false);
		    	bg.insert(assoc2);
			    
			   	return sb.createVertexTemplateFromCells([bg], 400, 250, 'In Block Definition Diagrams, Activity, Association');
			}),
		    	
			this.createVertexTemplateEntry(s + 'actPart;strokeWidth=3;verticalAlign=top;rotation=-90;whiteSpace=wrap;', 
					100, 100, 'Partition Name', 'Activity Partition', null, null, this.getTagsForStencil(gn, 'actPart', dt + 'activity partition').join(' ')),
			this.createVertexTemplateEntry('shape=rect;html=1;rounded=1;strokeWidth=2;verticalAlign=top;whiteSpace=wrap;align=center;', 
					140, 50, '(Partition Name)\nAction', 'Activity Partition', null, null, this.getTagsForStencil(gn, '', dt + 'activity partition').join(' ')),
		    
		    this.addEntry(dt + 'interruptible activity region', function()
		    {
		    	var cardCell = new mxCell('region name', new mxGeometry(0, 0, 160, 60), 'shape=rect;html=1;rounded=1;verticalAlign=top;dashed=1;strokeWidth=2;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'shape=mxgraph.lean_mapping.electronic_info_flow_edge;html=1;edgeStyle=none;align=center;verticalAlign=bottom;exitX=1;exitY=0.5;fillColor=#ffffff;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(250, 30), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.geometry.x = 1;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, assoc1], 250, 60, 'Interruptible Activity Region');
			}),
			    
		    this.createVertexTemplateEntry('shape=rect;html=1;rounded=1;dashed=1;strokeWidth=2;verticalAlign=top;whiteSpace=wrap;align=center;', 
		    		160, 60, '&lt;&lt;structured&gt;&gt; node name', 'Structured Activity Node', null, null, this.getTagsForStencil(gn, '', dt + 'structured activity node').join(' '))
		];
		
		this.addPalette('sysmlActivities', 'SysML / Activities', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLInteractionsPalette = function(expand)
	{
		var s = 'html=1;shape=mxgraph.sysml.';
		var gn = '';
		var dt = 'sysml interaction ';
		var sb = this;
		
		var fns = [
		    this.createVertexTemplateEntry(s + 'package;overflow=fill;labelX=95;align=left;spacingLeft=5;verticalAlign=top;spacingTop=-3;', 160, 80, 
		    		'<p style="margin:0px;margin-top:4px;margin-left:5px;text-align:left;"><b>sd</b>  Interaction1</p>', 
		    		'Sequence Diagram', null, null, this.getTagsForStencil(gn, 'package', dt + 'sequence diagram').join(' ')),

		    this.addEntry(dt + 'lifeline', function()
		    {
		    	var cardCell = new mxCell('b1:Block1', new mxGeometry(0, 0, 160, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;align=center;verticalAlign=bottom;exitX=0.5;exitY=1;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(80, 150), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.geometry.x = 1;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, assoc1], 160, 150, 'Lifeline');
			}),
			    
		    this.addEntry(dt + 'execution specification', function()
		    {
		    	var cardCell = new mxCell('b1:Block1', new mxGeometry(0, 0, 160, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var cardCell2 = new mxCell('', new mxGeometry(70, 100, 20, 80), 'shape=rect;html=1;fillColor=#eeeeee;');
		    	cardCell2.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	cardCell2.insertEdge(assoc1, false);
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(80, 220), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.geometry.x = 1;
		    	assoc2.edge = true;
		    	cardCell2.insertEdge(assoc2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, assoc1, assoc2], 160, 220, 'Execution Specification');
			}),
			    
		    this.addEntry(dt + 'execution specification', function()
		    {
		    	var cardCell = new mxCell('b1:Block1', new mxGeometry(0, 0, 160, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var cardCell2 = new mxCell('execSpec', new mxGeometry(20, 100, 120, 80), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	cardCell2.insertEdge(assoc1, false);
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(80, 220), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.geometry.x = 1;
		    	assoc2.edge = true;
		    	cardCell2.insertEdge(assoc2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, assoc1, assoc2], 160, 220, 'Execution Specification');
			}),
			    
		    this.addEntry(dt + 'use', function()
		    {
		    	var cardCell = new mxCell('Interaction3', new mxGeometry(0, 0, 160, 60), s + 'package;labelX=40;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('ref', new mxGeometry(0, 0, 0, 0), 'html=1;align=left;verticalAlign=top;labelPosition=left;verticalLabelPosition=top;labelBackgroundColor=none;spacingLeft=5;spacingTop=-2;fontStyle=1;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Interaction Use');
			}),
			    
		    this.addEntry(dt + 'combined fragment', function()
		    {
		    	var bg = new mxCell('<p style="margin:0px;margin-top:4px;margin-left:10px;text-align:left;"><b>sd</b>   Interaction1</p>', new mxGeometry(0, 0, 350, 320), s + 'package;labelX=100;html=1;overflow=fill;strokeWidth=1;recursiveResize=0;');
		    	bg.vertex = true;
			    var cardCell2 = new mxCell('b1: Block1', new mxGeometry(30, 40, 80, 30), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	bg.insert(cardCell2);
			    var cardCell3 = new mxCell('b2: Block2', new mxGeometry(140, 40, 80, 30), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell3.vertex = true;
		    	bg.insert(cardCell3);
			    var cardCell4 = new mxCell('b3: Block3', new mxGeometry(250, 40, 80, 30), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell4.vertex = true;
		    	bg.insert(cardCell4);
			    var cardCell5 = new mxCell('alt', new mxGeometry(20, 90, 200, 160), s + 'package;labelX=35;fontStyle=1;align=left;verticalAlign=top;spacingLeft=5;spacingTop=-3;');
		    	cardCell5.vertex = true;
		    	bg.insert(cardCell5);
				var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;dashed=1;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(70, 300), false);
				assoc1.geometry.relative = true;
				assoc1.edge = true;
		    	cardCell2.insertEdge(assoc1, true);
		    	bg.insert(assoc1);
				var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;dashed=1;');
				assoc2.geometry.setTerminalPoint(new mxPoint(180, 300), false);
				assoc2.geometry.relative = true;
				assoc2.edge = true;
				bg.insert(assoc2);
		    	cardCell3.insertEdge(assoc2, true);
				var assoc3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;dashed=1;');
				assoc3.geometry.setTerminalPoint(new mxPoint(290, 300), false);
				assoc3.geometry.relative = true;
				assoc3.edge = true;
				bg.insert(assoc3);
		    	cardCell4.insertEdge(assoc3, true);
				var assoc4 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;dashed=1;');
				assoc4.geometry.setTerminalPoint(new mxPoint(20, 170), false);
				assoc4.geometry.setTerminalPoint(new mxPoint(220, 170), true);
				assoc4.geometry.relative = true;
				assoc4.edge = true;
				bg.insert(assoc4);
				var assoc5 = new mxCell('[if x < 10]', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;edgeStyle=none;verticalAlign=bottom;labelBackgroundColor=none;endSize=12;');
				assoc5.geometry.setTerminalPoint(new mxPoint(70, 150), true);
				assoc5.geometry.setTerminalPoint(new mxPoint(180, 150), false);
				assoc5.geometry.relative = true;
				assoc5.geometry.x = -1;
				assoc5.edge = true;
				bg.insert(assoc5);
		    	var label1 = new mxCell('msg1', new mxGeometry(1, 0, 0, 0), 'align=right;html=1;verticalAlign=bottom;labelBackgroundColor=none;');
		    	label1.geometry.relative = true;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	assoc5.insert(label1);
		    	var assoc6 = new mxCell('[else]', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;edgeStyle=none;verticalAlign=bottom;labelBackgroundColor=none;align=right;endSize=12;');
				assoc6.geometry.setTerminalPoint(new mxPoint(70, 230), true);
				assoc6.geometry.setTerminalPoint(new mxPoint(180, 230), false);
				assoc6.geometry.relative = true;
				assoc6.geometry.x = -1;
				assoc6.edge = true;
				bg.insert(assoc6);
		    	var label2 = new mxCell('msg2', new mxGeometry(1, 0, 0, 0), 'align=right;html=1;verticalAlign=bottom;labelBackgroundColor=none;');
		    	label2.geometry.relative = true;
		    	label2.setConnectable(false);
		    	label2.vertex = true;
		    	assoc6.insert(label2);
		    	bg.insert(assoc6);
				var assoc7 = new mxCell('msg3', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;edgeStyle=none;verticalAlign=bottom;labelBackgroundColor=none;endSize=12;');
				assoc7.geometry.setTerminalPoint(new mxPoint(70, 290), true);
				assoc7.geometry.setTerminalPoint(new mxPoint(290, 290), false);
		    	assoc7.geometry.relative = true;
				assoc7.edge = true;
				bg.insert(assoc7);
			    
			   	return sb.createVertexTemplateFromCells([bg], 350, 320, 'Combined Fragment');
			}),
		    	
		    this.addEntry(dt + 'state invariant configuration', function()
		    {
		    	var cardCell = new mxCell(':Y', new mxGeometry(0, 0, 120, 50), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var cardCell2 = new mxCell('p==15', new mxGeometry(0, 100, 120, 50), s + 'cont;fontStyle=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	cardCell2.insertEdge(assoc1, false);
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(60, 220), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.geometry.x = 1;
		    	assoc2.edge = true;
		    	cardCell2.insertEdge(assoc2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, assoc1, assoc2], 120, 220, 'State Invariant / Continuations');
			}),
			    
		    this.addEntry(dt + 'coregion', function()
		    {
		    	var cardCell = new mxCell('s[u]:B', new mxGeometry(0, 0, 100, 50), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var cardCell2 = new mxCell('', new mxGeometry(40, 100, 20, 70), s + 'coregion;strokeWidth=3;');
		    	cardCell2.vertex = true;
		    	var knot1 = new mxCell('', new mxGeometry(48, 118, 4, 4), 'shape=ellipse;html=1;fillColor=#000000;');
		    	knot1.vertex = true;
		    	var knot2 = new mxCell('', new mxGeometry(48, 148, 4, 4), 'shape=ellipse;html=1;fillColor=#000000;');
		    	knot2.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	cardCell.insertEdge(assoc1, true);
		    	knot1.insertEdge(assoc1, false);
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc2.geometry.relative = true;
		    	assoc2.edge = true;
		    	knot1.insertEdge(assoc2, true);
		    	knot2.insertEdge(assoc2, false);
		    	var assoc3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc3.geometry.setTerminalPoint(new mxPoint(50, 220), false);
		    	assoc3.geometry.relative = true;
		    	assoc3.edge = true;
		    	knot2.insertEdge(assoc3, true);
		    	var assoc4 = new mxCell('m3', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;startArrow=open;verticalAlign=bottom;startSize=12;');
		    	assoc4.geometry.setTerminalPoint(new mxPoint(250, 120), false);
		    	assoc4.geometry.relative = true;
		    	assoc4.edge = true;
		    	knot1.insertEdge(assoc4, true);
		    	var assoc5 = new mxCell('m2', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;startArrow=open;verticalAlign=bottom;startSize=12;');
		    	assoc5.geometry.setTerminalPoint(new mxPoint(250, 150), false);
		    	assoc5.geometry.relative = true;
		    	assoc5.edge = true;
		    	knot2.insertEdge(assoc5, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, knot1, knot2, assoc1, assoc2, assoc3, assoc4, assoc5], 250, 220, 'Coregion');
			}),
			    
		    this.addEntry(dt + 'creation destruction event', function()
		    {
		    	var cardCell1 = new mxCell('b1:Block1', new mxGeometry(0, 0, 100, 30), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell1.vertex = true;
		    	var cardCell2 = new mxCell('b2:Block2', new mxGeometry(150, 40, 100, 30), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	var cardCell3 = new mxCell('', new mxGeometry(190, 70, 20, 100), 'shape=rect;fillColor=#eeeeee;html=1;');
		    	cardCell3.vertex = true;
		    	var knot1 = new mxCell('', new mxGeometry(48, 53, 4, 4), 'shape=ellipse;fillColor=#000000;html=1;');
		    	knot1.vertex = true;
		    	var knot2 = new mxCell('', new mxGeometry(48, 148, 4, 4), 'shape=ellipse;fillColor=#000000;html=1;');
		    	knot2.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;dashed=1;endArrow=none;html=1;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	cardCell1.insertEdge(assoc1, true);
		    	knot1.insertEdge(assoc1, false);
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;dashed=1;endArrow=none;html=1;');
		    	assoc2.geometry.relative = true;
		    	assoc2.edge = true;
		    	knot1.insertEdge(assoc2, true);
		    	knot2.insertEdge(assoc2, false);
		    	var assoc3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;dashed=1;endArrow=none;html=1;');
		    	assoc3.geometry.setTerminalPoint(new mxPoint(50, 220), false);
		    	assoc3.geometry.relative = true;
		    	assoc3.edge = true;
		    	knot2.insertEdge(assoc3, true);
		    	var assoc4 = new mxCell('create', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=open;verticalAlign=bottom;endSize=12;html=1;');
		    	assoc4.geometry.setTerminalPoint(new mxPoint(250, 120), false);
		    	assoc4.geometry.relative = true;
		    	assoc4.edge = true;
		    	knot1.insertEdge(assoc4, true);
		    	cardCell2.insertEdge(assoc4, false);
		    	var assoc5 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;endArrow=open;elbow=vertical;endSize=12;html=1;');
		    	assoc5.geometry.setTerminalPoint(new mxPoint(250, 150), false);
		    	assoc5.geometry.relative = true;
		    	assoc5.edge = true;
		    	knot2.insertEdge(assoc5, true);
		    	cardCell3.insertEdge(assoc5, false);
		    	var assoc6 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=sysMLx;endSize=22;dashed=1;html=1;');
		    	assoc6.geometry.setTerminalPoint(new mxPoint(200, 200), false);
		    	assoc6.geometry.relative = true;
		    	assoc6.edge = true;
		    	cardCell3.insertEdge(assoc6, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell1, cardCell2, cardCell3, knot1, knot2, assoc1, assoc2, assoc3, assoc4, assoc5, assoc6], 250, 220, 'Creation/Destruction Event');
			}),
			    
		    this.addEntry(dt + 'duration constraint', function()
		    {
		    	var cardCell1 = new mxCell(':User', new mxGeometry(0, 0, 100, 50), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell1.vertex = true;
		    	var cardCell2 = new mxCell('{d..3*d}', new mxGeometry(-20, 100, 100, 40), s + 'dimension;rotation=-90;verticalAlign=top;spacingTop=-5');
		    	cardCell2.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;dashed=1;endArrow=none;html=1;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(50, 250), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	cardCell1.insertEdge(assoc1, true);
		    	var assoc2 = new mxCell('Code d=duration', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=open;verticalAlign=bottom;endSize=12;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(50, 70), true);
		    	assoc2.geometry.setTerminalPoint(new mxPoint(250, 70), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.edge = true;
		    	var assoc3 = new mxCell('CardOut {0..13}', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=open;verticalAlign=bottom;spacingBottom=5;endSize=12;');
		    	assoc3.geometry.setTerminalPoint(new mxPoint(50, 170), false);
		    	assoc3.geometry.setTerminalPoint(new mxPoint(250, 170), true);
		    	assoc3.geometry.relative = true;
		    	assoc3.edge = true;
		    	var assoc4 = new mxCell('OK', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=open;verticalAlign=top;spacingTop=5;endSize=12;');
		    	assoc4.geometry.setTerminalPoint(new mxPoint(50, 200), false);
		    	assoc4.geometry.setTerminalPoint(new mxPoint(250, 140), true);
		    	assoc4.geometry.relative = true;
		    	assoc4.edge = true;
			    
			   	return sb.createVertexTemplateFromCells([cardCell1, cardCell2, assoc1, assoc2, assoc3, assoc4], 250, 250, 'Duration Constraint');
			}),
			    
		    this.addEntry(dt + 'duration constraint', function()
		    {
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(20, 0), true);
		    	assoc1.geometry.setTerminalPoint(new mxPoint(20, 200), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;dashed=1;endArrow=none;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(230, 0), true);
		    	assoc2.geometry.setTerminalPoint(new mxPoint(230, 200), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.edge = true;
		    	var assoc3 = new mxCell('CardOut {0..13}', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=open;verticalAlign=bottom;spacingBottom=5;endSize=12;');
		    	assoc3.geometry.setTerminalPoint(new mxPoint(20, 140), false);
		    	assoc3.geometry.setTerminalPoint(new mxPoint(230, 140), true);
		    	assoc3.geometry.relative = true;
		    	assoc3.edge = true;
		    	var assoc4 = new mxCell('OK', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=open;verticalAlign=top;spacingTop=5;endSize=12;');
		    	assoc4.geometry.setTerminalPoint(new mxPoint(20, 170), false);
		    	assoc4.geometry.setTerminalPoint(new mxPoint(230, 110), true);
		    	assoc4.geometry.relative = true;
		    	assoc4.edge = true;
		    	var assoc5 = new mxCell('{t..t+3}', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;align=right;labelBackgroundColor=none;');
		    	assoc5.geometry.setTerminalPoint(new mxPoint(20, 170), false);
		    	assoc5.geometry.setTerminalPoint(new mxPoint(0, 170), true);
		    	assoc5.geometry.relative = true;
		    	assoc5.geometry.x = -1;
		    	assoc5.edge = true;
		    	var assoc6 = new mxCell('t=now', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;align=left;labelBackgroundColor=none;');
		    	assoc6.geometry.setTerminalPoint(new mxPoint(230, 140), false);
		    	assoc6.geometry.setTerminalPoint(new mxPoint(250, 140), true);
		    	assoc6.geometry.relative = true;
		    	assoc6.geometry.x = -1;
		    	assoc6.edge = true;
			    
			   	return sb.createVertexTemplateFromCells([assoc1, assoc2, assoc3, assoc4, assoc5, assoc6], 250, 200, 'Time Constraint');
			}),
			    
		    this.addEntry(dt + 'message', function()
		    {
		    	var cardCell1 = new mxCell('b1:Block1', new mxGeometry(0, 0, 100, 30), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell1.vertex = true;
		    	var cardCell2 = new mxCell('b2:Block2', new mxGeometry(150, 0, 100, 30), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
		    	cardCell2.vertex = true;
		    	var assoc1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;dashed=1;html=1;endArrow=none;');
		    	assoc1.geometry.setTerminalPoint(new mxPoint(50, 250), false);
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	cardCell1.insertEdge(assoc1, true);
		    	var assoc2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;dashed=1;html=1;endArrow=none;');
		    	assoc2.geometry.setTerminalPoint(new mxPoint(200, 250), false);
		    	assoc2.geometry.relative = true;
		    	assoc2.edge = true;
		    	cardCell2.insertEdge(assoc2, true);
		    	var assoc3 = new mxCell('asyncSignal', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=open;verticalAlign=bottom;endSize=12;');
		    	assoc3.geometry.setTerminalPoint(new mxPoint(50, 70), true);
		    	assoc3.geometry.setTerminalPoint(new mxPoint(200, 70), false);
		    	assoc3.geometry.relative = true;
		    	assoc3.edge = true;
		    	var assoc4 = new mxCell('syncCall(param)', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=block;verticalAlign=bottom;endSize=12;endFill=1;');
		    	assoc4.geometry.setTerminalPoint(new mxPoint(50, 160), true);
		    	assoc4.geometry.setTerminalPoint(new mxPoint(200, 160), false);
		    	assoc4.geometry.relative = true;
		    	assoc4.edge = true;
		    	var assoc5 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=open;verticalAlign=bottom;endSize=12;endFill=1;dashed=1;');
		    	assoc5.geometry.setTerminalPoint(new mxPoint(200, 200), true);
		    	assoc5.geometry.setTerminalPoint(new mxPoint(50, 200), false);
		    	assoc5.geometry.relative = true;
		    	assoc5.edge = true;
			    
			   	return sb.createVertexTemplateFromCells([cardCell1, cardCell2, assoc1, assoc2, assoc3, assoc4, assoc5], 250, 250, 'Message');
			}),
			    
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=sysMLLost;endSize=12;verticalAlign=bottom;', 
					160, 0, 'lost', 'Lost Message', null, this.getTagsForStencil(gn, '', dt + 'lost message').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;verticalAlign=bottom;startArrow=sysMLFound;startSize=12;', 
					160, 0, 'found', 'Found Message', null, this.getTagsForStencil(gn, '', dt + 'found message').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=none;verticalAlign=bottom;dashed=1;strokeWidth=2;', 
					160, 0, '', 'General Ordering', null, this.getTagsForStencil(gn, '', dt + 'general ordering').join(' '))
		];
		
		this.addPalette('sysmlInteractions', 'SysML / Interactions', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLStateMachinesPalette = function(expand)
	{
		var s = 'shape=mxgraph.sysml.';
		var gn = '';
		var dt = 'sysml state machine ';
		var sb = this;
		
		var fns = [
		    this.addEntry(dt + 'choice pseudo state', function()
		    {
			   	var cardCell = new mxCell('', new mxGeometry(0, 20, 40, 40), 'shape=rhombus;html=1;labelPosition=right;align=left;verticalAlign=middle');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=horizontal;align=right;verticalAlign=bottom;rounded=0;labelBackgroundColor=none;endArrow=open;endSize=12;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(20, 0), true);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell.insertEdge(edge1, false);
			   	var edge2 = new mxCell('[Id<=10]', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;align=right;endArrow=open;rounded=0;labelBackgroundColor=none;endSize=12;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(20, 100), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	var edge3 = new mxCell('[Id>10]', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;html=1;elbow=vertical;align=left;endArrow=open;rounded=0;labelBackgroundColor=none;verticalAlign=bottom;endSize=12;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(150, 100), false);
			   	edge3.geometry.relative = true;
			   	edge3.edge = true;
			   	cardCell.insertEdge(edge3, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2, edge3], 150, 100, 'Choice Pseudo State');
			}),
			    
		    this.addEntry(dt + 'composite state', function()
		    {
			   	var bg = new mxCell('CompositeState1', new mxGeometry(0, 0, 220, 190), s + 'compState;align=left;verticalAlign=top;spacingTop=-3;spacingLeft=18;strokeWidth=1;recursiveResize=0;');
			   	bg.vertex = true;
			   	var cardCell2 = new mxCell('', new mxGeometry(20, 50, 20, 20), 'shape=ellipse;html=1;fillColor=#000000;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;');
			   	cardCell2.vertex = true;
			   	bg.insert(cardCell2);
			   	var cardCell3 = new mxCell('State1', new mxGeometry(80, 60, 100, 40), 'shape=rect;html=1;rounded=1;whiteSpace=wrap;align=center;');
			   	cardCell3.vertex = true;
			   	bg.insert(cardCell3);
			   	var cardCell4 = new mxCell('State2', new mxGeometry(80, 130, 100, 40), 'shape=rect;html=1;rounded=1;whiteSpace=wrap;align=center;');
			   	cardCell4.vertex = true;
			   	bg.insert(cardCell4);
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=open;endSize=12;');
		    	edge1.geometry.relative = true;
			   	edge1.edge = true;
		    	cardCell2.insertEdge(edge1, true);
		    	cardCell3.insertEdge(edge1, false);
		    	bg.insert(edge1);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=open;endSize=12;');
		    	edge2.geometry.relative = true;
			   	edge2.edge = true;
		    	cardCell3.insertEdge(edge2, true);
		    	cardCell4.insertEdge(edge2, false);
		    	bg.insert(edge2);
			    
			   	return sb.createVertexTemplateFromCells([bg], 220, 190, 'Composite State');
			}),
			    
		    this.createVertexTemplateEntry(s + 'compState;html=1;align=left;verticalAlign=top;spacingTop=-3;spacingLeft=18;', 
		    		200, 160, 'CompositeState1', 'Composite State', null, null, this.getTagsForStencil(gn, 'compState', dt + 'composite state').join(' ')),
		    this.createVertexTemplateEntry('ellipse;html=1;labelPosition=left;verticalLabelPosition=bottom;spacingBottom=10;align=right;verticalAlign=bottom;resizable=0;', 
		    		20, 20, 'again', 'Entry Point', null, null, this.getTagsForStencil(gn, 'compState', dt + 'entry point').join(' ')),

		    this.addEntry(dt + 'exit point', function()
		    {
			    var cardCell = new mxCell('aborted', new mxGeometry(0, 10, 20, 20), s + 'flowFinal;labelPosition=right;verticalLabelPosition=top;spacingTop=5;spacingLeft=3;align=left;verticalAlign=top;resizable=0;');
		    	cardCell.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Exit Point');
			}),
		    
		    this.createVertexTemplateEntry(s + 'actFinal;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;', 
		    		40, 40, '', 'Final State', null, null, this.getTagsForStencil(gn, 'actFinal', dt + 'final state').join(' ')),
		    this.createVertexTemplateEntry('shape=ellipse;html=1;fontSize=18;align=center;', 
		    		40, 40, 'H*', 'History, Deep Pseudo State', null, null, this.getTagsForStencil(gn, '', dt + 'history deep pseudo state').join(' ')),
		    this.createVertexTemplateEntry('shape=ellipse;html=1;fontSize=18;align=center;', 
		    		40, 40, 'H', 'History, Shallow Pseudo State', null, null, this.getTagsForStencil(gn, '', dt + 'history shallow pseudo state').join(' ')),
		    this.createVertexTemplateEntry('shape=ellipse;html=1;fillColor=#000000;fontSize=18;fontColor=#ffffff;', 
		    		40, 40, '', 'Initial Pseudo State', null, null, this.getTagsForStencil(gn, '', dt + 'initial pseudo state').join(' ')),
		    this.createVertexTemplateEntry('shape=ellipse;html=1;fillColor=#000000;fontSize=18;fontColor=#ffffff;', 
		    		40, 40, '', 'Junction Pseudo State', null, null, this.getTagsForStencil(gn, '', dt + 'junction pseudo state').join(' ')),
		    this.createVertexTemplateEntry(s + 'accEvent;flipH=1;whiteSpace=wrap;align=center;', 
		    		140, 40, 'Req(Id)', 'Receive Signal Action', null, null, this.getTagsForStencil(gn, 'accEvent', dt + 'receive signal action').join(' ')),
		    this.createVertexTemplateEntry(s + 'sendSigAct;whiteSpace=wrap;align=center;', 
		    		140, 40, 'TurnOn', 'Send Signal Action', null, null, this.getTagsForStencil(gn, 'sendSigAct', dt + 'send signal action').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;whiteSpace=wrap;align=center;', 
		    		140, 40, 'MinorReq := Id;', 'Action', null, null, this.getTagsForStencil(gn, '', dt + 'action').join(' ')),
		    this.createVertexTemplateEntry(s + 'region;align=left;verticalAlign=top;spacingTop=-3;spacingLeft=25;', 
		    		200, 160, 'S', 'Region', null, null, this.getTagsForStencil(gn, '', dt + 'region').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;rounded=1;html=1;whiteSpace=wrap;align=center;', 
		    		100, 40, 'State1', 'Simple State', null, null, this.getTagsForStencil(gn, '', dt + 'simple state').join(' ')),

		    this.createVertexTemplateEntry(s + 'simpleState;html=1;overflow=fill;whiteSpace=wrap;align=center;', 200, 100, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'State2<hr/></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">entry / entryActivity<br/>do / doActivity<br/>exit / exitActivity</p>',
		    		'Simple State', null, null, this.getTagsForStencil(gn, 'simpleState', dt + 'simple state').join(' ')),

		    this.createVertexTemplateEntry('shape=rect;rounded=1;html=1;whiteSpace=wrap;align=center;', 
		    		120, 40, 'State1, State2', 'State List', null, null, this.getTagsForStencil(gn, '', dt + 'state list').join(' ')),
		    
		    this.addEntry(dt + 'state machine', function()
		    {
		    	var cardCell = new mxCell('ReadAmountSM', new mxGeometry(0, 0, 160, 120), s + 'stateMachine;verticalAlign=top;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('aborted', new mxGeometry(160, 60, 0, 0), 'resizable=0;html=1;verticalAlign=top;align=left;labelBackgroundColor=none;spacingLeft=5;spacingTop=-2;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'State Machine');
			}),
			    
		    this.createVertexTemplateEntry(s + 'x;', 
		    		40, 40, '', 'Terminate Node', null, null, this.getTagsForStencil(gn, 'x', dt + 'terminate node').join(' ')),
		    
		    this.addEntry(dt + 'submachine state', function()
		    {
		    	var cardCell = new mxCell('ReadAmount :\nReadAmountSM', new mxGeometry(0, 0, 160, 120), s + 'submState;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('aborted', new mxGeometry(160, 60, 0, 0), 'resizable=0;html=1;verticalAlign=bottom;align=left;labelBackgroundColor=none;spacingLeft=5;spacingBottom=2;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Submachine State');
			}),
			    
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;strokeWidth=3;verticalAlign=bottom;', 
					160, 0, 'trigger[guard]/activity', 'Transition', null, this.getTagsForStencil(gn, '', dt + 'transition').join(' '))
		];
		
		this.addPalette('sysmlState Machines', 'SysML / State Machines', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLUseCasesPalette = function(expand)
	{
		var s = 'html=1;shape=mxgraph.sysml.';
		var gn = '';
		var dt = 'sysml use case ';
		var sb = this;
		
		var fns = [
			this.createVertexTemplateEntry('shape=ellipse;html=1;strokeWidth=3;fontStyle=1;whiteSpace=wrap;align=center;', 
					120, 60, 'UseCaseName', 'Use Case', null, null, this.getTagsForStencil(gn, '', dt + 'use case').join(' ')),

			this.addEntry(dt + '', function()
			{
		    	var cardCell = new mxCell('\nextension points\np1, p2', new mxGeometry(0, 0, 160, 80), s + 'useCaseExtPt;whiteSpace=wrap;align=center;');
		    	cardCell.vertex = true;
		    	var label1 = new mxCell('UseCaseName', new mxGeometry(80, 17, 0, 0), 'resizable=0;html=1;verticalAlign=middle;align=center;labelBackgroundColor=none;fontStyle=1;');
		    	label1.geometry.relative = false;
		    	label1.setConnectable(false);
		    	label1.vertex = true;
		    	cardCell.insert(label1);
			    
			   	return sb.createVertexTemplateFromCells([cardCell], cardCell.geometry.width, cardCell.geometry.height, 'Use Case');
			}),
			    
		    this.createVertexTemplateEntry('shape=umlActor;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;', 
		    		30, 60, 'ActorName', 'Actor', null, null, this.getTagsForStencil(gn, 'umlActor', dt + '').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;html=1;whiteSpace=wrap;align=center;', 80, 40, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    		'&lt;&lt;actor&gt;&gt;<br/>' +
	    			'<b>ActorName</b></p>',
		    		'Actor', null, null, this.getTagsForStencil(gn, '', dt + '').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;verticalAlign=top;fontStyle=1;whiteSpace=wrap;align=center;', 
		    		120, 60, 'SubjectName', 'Subject', null, null, this.getTagsForStencil(gn, '', dt + 'subject').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=none;verticalAlign=bottom;', 
					160, 0, '', 'Communication Path', null, this.getTagsForStencil(gn, '', dt + 'communication path').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;verticalAlign=bottom;dashed=1;labelBackgroundColor=none;', 
					160, 0, '&lt;&lt;include&gt;&gt;', 'Include', null, this.getTagsForStencil(gn, '', dt + 'include').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;startArrow=open;endArrow=none;startSize=12;verticalAlign=bottom;dashed=1;labelBackgroundColor=none;', 
					160, 0, '&lt;&lt;extend&gt;&gt;', 'Extend', null, this.getTagsForStencil(gn, '', dt + 'extend').join(' ')),
		    
			this.addEntry(dt + 'extend condition', function()
			{
			   	var cardCell = new mxCell('Condition: {boolean expression}\nextension point: p1, p2', new mxGeometry(20, 0, 230, 40), 'shape=note;size=15;spacingLeft=5;align=left;whiteSpace=wrap;');
			   	cardCell.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;extend&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'align=right;html=1;verticalAlign=bottom;rounded=0;labelBackgroundColor=none;endArrow=open;endSize=12;dashed=1;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(0, 80), false);
			   	edge1.geometry.setTerminalPoint(new mxPoint(160, 80), true);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;html=1;endArrow=none;rounded=0;labelBackgroundColor=none;dashed=1;exitX=0.5;exitY=1;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(100, 80), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, edge1, edge2], 250, 80, 'Extend with Condition');
			}),
			    
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=block;endFill=0;endSize=12;verticalAlign=bottom;', 
					160, 0, '', 'Generalization', null, this.getTagsForStencil(gn, '', dt + 'generalization').join(' '))
		];
		
		this.addPalette('sysmlUse Cases', 'SysML / UseCases', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLAllocationsPalette = function(expand)
	{
		var s = 'html=1;shape=mxgraph.sysml.';
		var gn = '';
		var dt = 'sysml allocation ';
		var sb = this;
		
		var fns = [
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;html=1;whiteSpace=wrap;align=center;', 120, 60, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    		'&lt;&lt;allocated&gt;&gt;<br/>' +
	    			'<b>Named<br/>Element</b></p>',
		    		'Allocated Stereotype', null, null, this.getTagsForStencil(gn, '', dt + 'allocated stereotype').join(' ')),

		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;strokeWidth=2;whiteSpace=wrap;align=center;', 200, 120, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>BlockName</b></p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>allocatedFrom</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">&lt;&lt;elementType&gt;&gt; ElementName</p><hr/>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>allocatedTo</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">&lt;&lt;elementType&gt;&gt; ElementName</p>',
		    		'Allocation derived properties (Block)', null, null, this.getTagsForStencil(gn, '', dt + 'derived property block').join(' ')),
		   	
			this.addEntry(dt + 'derived property comment', function()
			{
			   	var cardCell = new mxCell(
			    		'<p style="margin:0px;margin-top:10px;margin-left:10px;text-align:left;">' +
		    			'<b>allocatedFrom</b><br/>' +
						'&lt;&lt;elementType&gt;&gt; ElementName<br/>' +
		    			'<b>allocatedTo</b><br/>' +
						'&lt;&lt;elementType&gt;&gt; ElementName</p>',
			   			new mxGeometry(40, 0, 230, 80), 'shape=note;html=1;size=15;spacingLeft=5;align=left;html=1;overflow=fill;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('ElementName', new mxGeometry(0, 100, 120, 40), 'shape=rect;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'rounded=0;html=1;labelBackgroundColor=none;endArrow=none;dashed=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 270, 140, 'Allocation derived properties (Comment)');
			}),
		    
			this.addEntry(dt + 'derived property internal block diagram', function()
			{
			   	var bg = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'&lt;&lt;block&gt;&gt;<br/>' +
						'<b>BlockName</b></p><hr/>',
			   			new mxGeometry(0, 0, 250, 160), 'shape=rect;html=1;overflow=fill;strokeWidth=2;whiteSpace=wrap;align=center;verticalAlign=top;strokeWidth=1;recursiveResize=0;');
			   	bg.vertex = true;
			   	var cardCell2 = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'<b>PartName</b><hr/></p>' +
						'<p style="font-size:10px;margin:0px;text-align:center;"><i>allocatedFrom</i></p>' +
						'<p style="margin:0px;margin-left:8px;text-align:left;">&lt;&lt;elementType&gt;&gt; ElementName</p>',
			   			new mxGeometry(20, 60, 210, 80), 'shape=rect;html=1;overflow=fill;strokeWidth=2;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	bg.insert(cardCell2);
			    
			   	return sb.createVertexTemplateFromCells([bg], 250, 160, 'Allocation derived properties (Internal Block Diagram)');
			}),
			    
		    this.createVertexTemplateEntry(s + 'simpleState;html=1;overflow=fill;whiteSpace=wrap;align=center;', 200, 100, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>ActivityName</b><hr/></p>' +
					'<p style="font-size:10px;margin:0px;text-align:center;"><i>allocatedTo</i></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">&lt;&lt;elementType&gt;&gt; ElementName</p>',
		    		'Allocation Derived Properties (Activity Diagram)', null, null, this.getTagsForStencil(gn, '', dt + 'derived property activity diagram').join(' ')),
		   	
			this.addEntry(dt + 'activity partition', function()
			{
			   	var cardCell = new mxCell(
			    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
		    			'&lt;&lt;allocate&gt;&gt;<br/>:ElementName<hr/></p>',
			   			new mxGeometry(0, 0, 250, 160), 'shape=rect;html=1;overflow=fill;whiteSpace=wrap;align=center;verticalAlign=top;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('ActionName', new mxGeometry(65, 70, 120, 60), s + 'cont;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2], 250, 160, 'Allocation Activity Partition');
			}),
			    
			this.addEntry(dt + 'general', function()
			{
			   	var cardCell = new mxCell('Client',	new mxGeometry(0, 0, 100, 60), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Supplier', new mxGeometry(200, 0, 100, 60), 'shape=rect;html=1;fontStyle=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;allocate&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'rounded=0;html=1;verticalAlign=top;labelBackgroundColor=none;endArrow=open;dashed=1;endSize=12;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 300, 60, 'Allocation (General)');
			})
		];
		
		this.addPalette('sysmlAllocations', 'SysML / Allocations', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLRequirementsPalette = function(expand)
	{
		var s = 'html=1;shape=mxgraph.sysml.';
		var gn = '';
		var dt = 'sysml requirement ';
		var sb = this;
		
		var fns = [
			this.createVertexTemplateEntry(s + 'package;overflow=fill;labelX=110;strokeWidth=2;align=center;', 160, 80, 
		    		'<p style="margin:0px;margin-top:4px;margin-left:7px;text-align:left;"><b>req</b>  ReqDiagram</p>', 
		    		'Requirement Diagram', null, null, this.getTagsForStencil(gn, 'package', dt + 'diagram').join(' ')),

		    this.createVertexTemplateEntry('shape=rect;overflow=fill;html=1;whiteSpace=wrap;align=center;', 200, 100, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;requirement&gt;&gt;<br/><b>Requirement Name</b><hr/></p>' +
					'<p style="margin:0px;margin-left:8px;text-align:left;">text="The system shall do"<br/>Id="62j32."</p>',
		    		'Requirement', null, null, this.getTagsForStencil(gn, 'package', dt + '').join(' ')),
		   	
		    this.createVertexTemplateEntry('shape=rect;overflow=fill;html=1;whiteSpace=wrap;align=center;', 200, 100, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'&lt;&lt;testCase&gt;&gt;<br/><b>TestCaseName</b><hr/></p>',
		    		'Test Case', null, null, this.getTagsForStencil(gn, 'package', dt + 'test case').join(' ')),
		   	
			this.addEntry(dt + 'containment relationship', function()
			{
			   	var cardCell = new mxCell('&lt;&lt;requirement&gt;&gt;\nParent',	new mxGeometry(90, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nChild1', new mxGeometry(0, 120, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var cardCell3 = new mxCell('&lt;&lt;requirement&gt;&gt;\nChild2', new mxGeometry(180, 120, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell3.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'rounded=0;html=1;labelBackgroundColor=none;endArrow=none;edgeStyle=elbowEdgeStyle;elbow=vertical;startArrow=sysMLPackCont;startSize=12;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'rounded=0;html=1;labelBackgroundColor=none;endArrow=none;edgeStyle=elbowEdgeStyle;elbow=vertical;startArrow=sysMLPackCont;startSize=12;');
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			   	cardCell3.insertEdge(edge2, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, cardCell3, edge1, edge2], 300, 180, 'Requirement Containment Relationship');
			}),
			    
			this.addEntry(dt + 'copy dependency', function()
			{
			   	var cardCell = new mxCell('&lt;&lt;requirement&gt;&gt;\nSlave',	new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nMaster', new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;copy&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;edgeStyle=none;endSize=12;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Copy Dependency');
			}),
			    
			this.addEntry(dt + 'master callout', function()
			{
			   	var cardCell = new mxCell('Master\n&lt;&lt;requirement&gt;&gt; Master',	new mxGeometry(0, 0, 160, 60), 'shape=note;html=1;size=15;align=left;spacingLeft=5;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt; Slave', new mxGeometry(200, 0, 160, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;dashed=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Master Callout');
			}),
			    
			this.addEntry(dt + 'derive dependency', function()
			{
			   	var cardCell = new mxCell('&lt;&lt;requirement&gt;&gt;\nClient',	new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nSupplier', new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;deriveReq&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;edgeStyle=none;endSize=12;dashed=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Derive Dependency');
			}),
			    
			this.addEntry(dt + 'derive callout', function()
			{
			   	var cardCell = new mxCell('&lt;&lt;requirement&gt;&gt;\nReqA',	new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Derived\n&lt;&lt;requirement&gt;&gt; ReqB', new mxGeometry(200, 0, 160, 60), 'shape=note;html=1;size=15;align=left;spacingLeft=5;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;dashed=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Derive Callout');
			}),
			    
			this.addEntry(dt + 'derive callout', function()
			{
			   	var cardCell = new mxCell('DerivedFrom\n&lt;&lt;requirement&gt;&gt; ReqA', new mxGeometry(0, 0, 160, 60), 'shape=note;html=1;size=15;align=left;spacingLeft=5;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nReqB',	new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=none;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Derive Callout');
			}),
			    
			this.addEntry(dt + 'satisfy dependency', function()
			{
			   	var cardCell = new mxCell('NamedElement', new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nSupplier', new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;satisfy&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;edgeStyle=none;endSize=12;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Satisfy Dependency');
			}),
			    
			this.addEntry(dt + 'satisfy callout', function()
			{
			   	var cardCell = new mxCell('NamedElement',	new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Satisfies\n&lt;&lt;requirement&gt;&gt; ReqA', new mxGeometry(200, 0, 160, 60), 'shape=note;size=15;align=left;spacingLeft=5;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=none;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Satisfy Callout');
			}),
			    
			this.addEntry(dt + 'satisfy callout', function()
			{
			   	var cardCell = new mxCell('SatisfiedBy\nNamedElement', new mxGeometry(0, 0, 160, 60), 'shape=note;size=15;align=left;spacingLeft=5;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nReqA',	new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=none;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Satisfy Callout');
			}),
			    
			this.addEntry(dt + 'verify dependency', function()
			{
			   	var cardCell = new mxCell('NamedElement', new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nSupplier', new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;verify&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;edgeStyle=none;endSize=12;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Verify Dependency');
			}),
			    
			this.addEntry(dt + 'verify callout', function()
			{
			   	var cardCell = new mxCell('NamedElement',	new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Verifies\n&lt;&lt;requirement&gt;&gt; ReqA', new mxGeometry(200, 0, 160, 60), 'shape=note;size=15;align=left;spacingLeft=5;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=none;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Verify Callout');
			}),
			    
			this.addEntry(dt + 'verify callout', function()
			{
			   	var cardCell = new mxCell('VerifiedBy\nNamedElement', new mxGeometry(0, 0, 160, 60), 'shape=note;size=15;align=left;spacingLeft=5;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nReqA',	new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=none;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Verify Callout');
			}),
			    
			this.addEntry(dt + 'refine dependency', function()
			{
			   	var cardCell = new mxCell('NamedElement', new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nClient', new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;refine&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;edgeStyle=none;endSize=12;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Refine Dependency');
			}),
		    
			this.addEntry(dt + 'refine dependency', function()
			{
			   	var cardCell = new mxCell('NamedElement',	new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Refines\n&lt;&lt;requirement&gt;&gt; ReqA', new mxGeometry(200, 0, 160, 60), 'shape=note;size=15;align=left;spacingLeft=5;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=none;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Refine Callout');
			}),
			    
			this.addEntry(dt + 'refine dependency', function()
			{
			   	var cardCell = new mxCell('RefinedBy\nNamedElement', new mxGeometry(0, 0, 160, 60), 'shape=note;size=15;align=left;spacingLeft=5;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nReqA',	new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=none;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Refine Callout');
			}),
		    
			this.addEntry(dt + 'trace dependency', function()
			{
			   	var cardCell = new mxCell('&lt;&lt;requirement&gt;&gt;\nClient', new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nSupplier', new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('&lt;&lt;trace&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;edgeStyle=none;endSize=12;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Trace Dependency');
			}),
			    
			this.addEntry(dt + 'refine callout', function()
			{
			   	var cardCell = new mxCell('NamedElement',	new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('TracedFrom\n&lt;&lt;requirement&gt;&gt; ReqA', new mxGeometry(200, 0, 160, 60), 'shape=note;size=15;align=left;spacingLeft=5;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=none;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Refine Callout');
			}),
			    
			this.addEntry(dt + 'trace callout', function()
			{
			   	var cardCell = new mxCell('TracedTo\nNamedElement', new mxGeometry(0, 0, 160, 60), 'shape=note;size=15;align=left;spacingLeft=5;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;requirement&gt;&gt;\nReqA',	new mxGeometry(240, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;edgeStyle=none;dashed=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 360, 60, 'Trace Callout');
			})
		];
		   	
		this.addPalette('sysmlRequirements', 'SysML / Requirements', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLProfilesPalette = function(expand)
	{
		var s = 'shape=mxgraph.sysml.';
		var gn = '';
		var dt = 'sysml profile ';
		var sb = this;
		
		var fns = [
		    this.createVertexTemplateEntry('shape=rect;html=1;whiteSpace=wrap;align=center;', 
		    		160, 80, '&lt;&lt;stereotype&gt;&gt;\nStereotypeName', 'Stereotype', null, null, this.getTagsForStencil(gn, '', dt + 'stereotype').join(' ')),
		    this.createVertexTemplateEntry('shape=rect;html=1;whiteSpace=wrap;align=center;', 
		    		160, 80, '&lt;&lt;metaclass&gt;&gt;\nMetaClassName', 'Metaclass', null, null, this.getTagsForStencil(gn, '', dt + 'metaclass').join(' ')),
		    this.createVertexTemplateEntry('shape=folder;tabWidth=80;tabHeight=20;tabPosition=left;html=1;whiteSpace=wrap;align=center;', 
		    		160, 100, '&lt;&lt;profile&gt;&gt;\nProfileName', 'Profile', null, null, this.getTagsForStencil(gn, '', dt + 'profile').join(' ')),
		    this.createVertexTemplateEntry('shape=folder;tabWidth=80;tabHeight=20;tabPosition=left;html=1;whiteSpace=wrap;align=center;', 
		    		160, 100, '&lt;&lt;modelLibrary&gt;&gt;\nLibraryName', 'Model Library', null, null, this.getTagsForStencil(gn, '', dt + 'model library').join(' ')),
		   	
			this.addEntry(dt + 'extension', function()
			{
			   	var cardCell = new mxCell('&lt;&lt;metaclass&gt;&gt;\nMetaClassName', new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;stereotype&gt;&gt;\nStereotypeName', new mxGeometry(0, 120, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('{required}', new mxGeometry(0, 0, 0, 0), 'endArrow=block;html=1;endFill=1;edgeStyle=none;endSize=12;labelBackgroundColor=none;align=left;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, false);
			   	cardCell2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 120, 180, 'Extension');
			}),
		    
			this.addEntry(dt + 'generalization', function()
			{
			   	var cardCell = new mxCell('&lt;&lt;stereotype&gt;&gt;\nStereotypeName', new mxGeometry(0, 0, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('&lt;&lt;stereotype&gt;&gt;\nStereotypeName', new mxGeometry(0, 120, 120, 60), 'shape=rect;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=block;html=1;endFill=0;edgeStyle=none;endSize=12;labelBackgroundColor=none;align=left;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, false);
			   	cardCell2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 120, 180, 'Generalization');
			}),
			    
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;dashed=1;verticalAlign=bottom;', 
					160, 0, '&lt;&lt;apply&gt;&gt;{strict}', 'Profile Application', null, this.getTagsForStencil(gn, '', dt + 'profile application').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;dashed=1;verticalAlign=top;', 
					160, 0, '&lt;&lt;reference&gt;&gt;', 'Metamodel Reference', null, this.getTagsForStencil(gn, '', dt + 'metamodel reference').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;endArrow=open;endSize=12;verticalAlign=bottom;', 
					160, 0, 'propertyName', 'Unidirectional Association', null, this.getTagsForStencil(gn, '', dt + 'unidirectional association').join(' '))
		];
		
		this.addPalette('sysmlProfiles', 'SysML / Profiles', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addSysMLStereotypesPalette = function(expand)
	{
		var s = 'html=1;shape=mxgraph.sysml.';
		var gn = '';
		var dt = 'sysml stereotype ';
		var sb = this;
		
		var fns = [
			this.addEntry(dt + 'note', function()
			{
				var cardCell = new mxCell(
			    		'<p style="margin:0px;margin-top:10px;margin-left:10px;text-align:left;">' +
		    			'<b>&lt;&lt;stereotypeName&gt;&gt;<br/>' +
						'PropertyName=ValueString<br/>' +
		    			'MultiPropertyName=ValueString, ValueString<br/>' +
						'BooleanPropertyName</b></p>',
			   			new mxGeometry(40, 0, 280, 80), 'shape=note;size=15;spacingLeft=5;html=1;overflow=fill;whiteSpace=wrap;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Element\nName', new mxGeometry(0, 110, 80, 40), 'shape=rect;fontStyle=1;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var cardCell3 = new mxCell('Element\nName', new mxGeometry(220, 110, 80, 40), 'shape=rect;fontStyle=1;html=1;whiteSpace=wrap;align=center;');
			   	cardCell3.vertex = true;
			   	var edge1 = new mxCell('PathName', new mxGeometry(0, 0, 0, 0), 'rounded=0;labelBackgroundColor=none;verticalAlign=top;endArrow=none;fontStyle=1;html=1;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell2.insertEdge(edge1, true);
			   	cardCell3.insertEdge(edge1, false);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'rounded=0;endArrow=none;dashed=1;html=1;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(150, 130), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	cardCell.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, cardCell3, edge1, edge2], 320, 150, 'Stereotype Note');
			}),
			    
			this.addEntry(dt + 'note', function()
			{
				var cardCell = new mxCell(
			    		'<p style="margin:0px;margin-top:10px;margin-left:10px;text-align:left;">' +
		    			'<b>&lt;&lt;stereotypeName&gt;&gt;<br/>' +
						'PropertyName=ValueString<br/>' +
		    			'MultiPropertyName=ValueString, ValueString<br/>' +
						'BooleanPropertyName</b></p>',
			   			new mxGeometry(40, 0, 280, 80), 'shape=note;size=15;spacingLeft=5;html=1;overflow=fill;whiteSpace=wrap;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Element\nName', new mxGeometry(0, 110, 80, 40), 'shape=rect;fontStyle=1;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'rounded=0;endArrow=none;dashed=1;html=1;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(150, 130), false);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, true);
			   	cardCell2.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 320, 150, 'Stereotype Note');
			}),
			    
		    this.createVertexTemplateEntry('shape=rect;html=1;whiteSpace=wrap;align=center;', 160, 80, 
		    		'&lt;&lt;stereotypeName&gt;&gt;\n{PropertyName=ValueString;\nBooleanPropertyName}\nNodeName', 
		    		'Stereotype (Node)', null, null, this.getTagsForStencil(gn, '', dt + 'node').join(' ')),
		   	
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;align=center;', 400, 100, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>NodeName</b><hr/></p>' + 
		    		'<p style="margin:0px;margin-left:10px;text-align:left;">' +
	    			'&lt;&lt;stereotypeName&gt;&gt;{PropertyName=ValueString}ElementName<br/>' + 
	    			'&lt;&lt;stereotypeName&gt;&gt;{PropertyName=ValueString};<br/>' + 
	    			'BooleanPropertyName<br/>' + 
	    			'ElementName</p>',
		    		'Stereotype (Compartment)', null, null, this.getTagsForStencil(gn, '', dt + 'compartment').join(' ')),
		   	
			this.addEntry(dt + 'edge', function()
			{
			   	var cardCell = new mxCell('Element\nName', new mxGeometry(0, 0, 120, 60), 'shape=rect;fontStyle=1;html=1;whiteSpace=wrap;align=center;');
			   	cardCell.vertex = true;
			   	var cardCell2 = new mxCell('Element\nName', new mxGeometry(0, 120, 120, 60), 'shape=rect;fontStyle=1;html=1;whiteSpace=wrap;align=center;');
			   	cardCell2.vertex = true;
			   	var edge1 = new mxCell(
			   			'&lt;&lt;steretyoeName&gt;&gt;\n{PropertyName=ValueString;\nBooleanPropertyName}PathName', 
			   			new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;edgeStyle=none;labelBackgroundColor=none;align=left;fontStyle=1;fontSize=10;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	cardCell.insertEdge(edge1, false);
			   	cardCell2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([cardCell, cardCell2, edge1], 200, 180, 'Stereotype (Edge)');
			}),
			    
		    this.createVertexTemplateEntry('shape=rect;html=1;overflow=fill;whiteSpace=wrap;align=center;', 300, 120, 
		    		'<p style="margin:0px;margin-top:4px;text-align:center;">' +
	    			'<b>&lt;&lt;stereotypeName&gt;&gt;</br>NodeName</b><hr/></p>' + 
		    		'<p style="margin:0px;margin-left:10px;text-align:left;">' +
	    			'&lt;&lt;stereotypeName&gt;&gt;<br/>PropertyName=ValueString<br/>' + 
	    			'MultiPropertyName=ValueString, ValueString<br/>' + 
	    			'BooleanPropertyName<br/></p>', 
		    		'Stereotype (Compartment)', null, null, this.getTagsForStencil(gn, '', dt + 'compartment').join(' '))
		];
		
		this.addPalette('sysmlStereotypes', 'SysML / Stereotypes', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

})();
