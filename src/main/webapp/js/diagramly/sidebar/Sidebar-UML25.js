(function()
{
	// Adds Arrow shapes with control points
	Sidebar.prototype.addUml25Palette = function()
	{
		// Avoids having to bind all functions to "this"
		var sb = this;

		// Reusable cells
		var field = new mxCell('+ field: type', new mxGeometry(0, 0, 100, 26), 'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		field.vertex = true;

		var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
		divider.vertex = true;
		
		// Default tags
		var dt = 'uml ';
		this.setCurrentSearchEntryLibrary('uml25');
		
		var fns = [
			this.createVertexTemplateEntry('shape=umlFrame;whiteSpace=wrap;html=1;width=120;height=30;boundedLbl=1;verticalAlign=middle;align=left;spacingLeft=5;', 340, 180, 'Diagram1 heading', 'Diagram', null, null, 'diagram'),
			this.createVertexTemplateEntry('shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=center;', 120, 60, 'Comment1 body', 'Comment', null, null, 'uml comment note'),
			this.createVertexTemplateEntry('shape=partialRectangle;html=1;top=1;align=left;dashed=1;', 200, 20, 'Template1 signature', 'Template signature', null, null, 'template signature'),
			this.createVertexTemplateEntry('shape=partialRectangle;html=1;top=1;align=left;dashed=1;', 200, 50, 'Template parameter 1\nTemplate parameter 2', 'Template signature', null, null, 'template signature'),
			this.addEntry('constraint', function()
			{
		    	var cell = new mxCell('Constraint1 specification', new mxGeometry(0, 0, 160, 60), 'shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=center;');
		    	cell.vertex = true;
		    	var label = new mxCell('<<keyword>>', new mxGeometry(0, 0, cell.geometry.width, 25), 'resizeWidth=1;part=1;strokeColor=none;fillColor=none;align=left;spacingLeft=5;');
		    	label.geometry.relative = true;
		    	label.vertex = true;
		    	cell.insert(label);
		
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Constraint');
			}),
		 	this.addEntry(dt + 'classifier', function()
			{
		 		var cell1 = new mxCell('&lt;&lt;keyword&gt;&gt;<br><b>Classifier1</b><br>{abstract}', new mxGeometry(0, 0, 140, 183),
		 			'swimlane;fontStyle=0;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=55;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('attributes', 
		 				new mxGeometry(0, 0, 140, 20), 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var field2 = new mxCell('attribute1', 
		 				new mxGeometry(0, 0, 140, 20), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field2.vertex = true;
		 		cell1.insert(field2);
		 		var field3 = new mxCell('inherited attribute2', 
		 				new mxGeometry(0, 0, 140, 20), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontColor=#808080;');
		 		field3.vertex = true;
		 		cell1.insert(field3);
		 		var field4 = new mxCell('...', 
		 				new mxGeometry(0, 0, 140, 20), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field4.vertex = true;
		 		cell1.insert(field4);
				cell1.insert(divider.clone());
		 		var field5 = new mxCell('operations', 
		 				new mxGeometry(0, 0, 140, 20), 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field5.vertex = true;
		 		cell1.insert(field5);
		 		var field6 = new mxCell('operation1', 
		 				new mxGeometry(0, 0, 140, 20), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field6.vertex = true;
		 		cell1.insert(field6);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Classifier'); 
			}),
			this.createVertexTemplateEntry('shape=process2;fixedSize=1;size=5;fontStyle=1;', 140, 40, 'Classifier1', 'Classifier', null, null, 'classifier'),
		 	this.addEntry(dt + 'classifier', function()
			{
		 		var cell1 = new mxCell('Classifier1', new mxGeometry(0, 0, 140, 183),
		 			'swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('internal structure', 
		 				new mxGeometry(0, 0, 140, 30), 'html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;rotatable=0;points=[[0,0.5],[1,0.5]];resizeWidth=1;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var cell2 = new mxCell('', new mxGeometry(0, 0, 140, 140),
		 			'swimlane;fontStyle=1;align=center;verticalAlign=top;horizontal=1;startSize=0;collapsible=0;marginBottom=0;html=1;strokeColor=none;fillColor=none;');
				cell2.vertex = true;
		 		cell1.insert(cell2);
		 		var field2 = new mxCell('property1', 
		 				new mxGeometry(0, 0, 100, 30), 'html=1;align=center;verticalAlign=middle;rotatable=0;');
		 		field2.geometry.relative = true;
		 		field2.geometry.offset = new mxPoint(20, 20);
		 		field2.vertex = true;
		 		cell2.insert(field2);
		 		var field3 = new mxCell('property2', 
		 				new mxGeometry(0, 0, 100, 30), 'html=1;align=center;verticalAlign=middle;rotatable=0;');
		 		field3.geometry.relative = true;
		 		field3.geometry.offset = new mxPoint(20, 90);
		 		field3.vertex = true;
		 		cell2.insert(field3);
		    	var assoc1 = new mxCell('connector1', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=none;verticalAlign=middle;labelBackgroundColor=none;endSize=12;html=1;align=left;endFill=0;exitX=0.15;exitY=1;entryX=0.15;entryY=0;spacingLeft=4;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	field2.insertEdge(assoc1, true);
		    	field3.insertEdge(assoc1, false);
		    	cell2.insert(assoc1);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Classifier'); 
			}),
			this.createVertexTemplateEntry('fontStyle=1;', 140, 30, 'Association1', 'Association', null, null, 'association'),
		 	this.addEntry(dt + 'classifier', function()
			{
		 		var cell1 = new mxCell('Instance1', new mxGeometry(0, 0, 140, 138),
		 			'swimlane;fontStyle=4;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('slot1', 
		 				new mxGeometry(0, 0, 140, 30), 'html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;rotatable=0;points=[[0,0.5],[1,0.5]];resizeWidth=1;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
				cell1.insert(divider.clone());
		 		var field2 = new mxCell('internal structure', 
		 				new mxGeometry(0, 0, 140, 20), 'html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;rotatable=0;points=[[0,0.5],[1,0.5]];resizeWidth=1;');
		 		field2.vertex = true;
		 		cell1.insert(field2);
		 		var cell2 = new mxCell('', new mxGeometry(0, 0, 140, 50),
		 			'swimlane;fontStyle=1;align=center;verticalAlign=top;horizontal=1;startSize=0;collapsible=0;marginBottom=0;html=1;strokeColor=none;fillColor=none;');
				cell2.vertex = true;
		 		cell1.insert(cell2);
		 		var field3 = new mxCell('instance2', 
		 				new mxGeometry(0, 0, 80, 30), 'html=1;align=center;verticalAlign=middle;rotatable=0;');
		 		field3.geometry.relative = true;
		 		field3.geometry.offset = new mxPoint(30, 10);
		 		field3.vertex = true;
		 		cell2.insert(field3);
		 		
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Classifier'); 
			}),
			this.createVertexTemplateEntry('fontStyle=0;', 120, 40, 'Instance1 value', 'Instance', null, null, 'instance'),
		 	this.addEntry(dt + 'classifier', function()
			{
		 		var cell1 = new mxCell('&lt;&lt;enumeration&gt;&gt;<br><b>Enum1</b>', new mxGeometry(0, 0, 140, 70),
		 			'swimlane;fontStyle=0;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=40;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('literal1', 
		 				new mxGeometry(0, 0, 140, 30), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field1.vertex = true;
		 		cell1.insert(field1);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Classifier'); 
			}),
			this.addEntry(dt + 'interface generalization', function()
			{
				var edge = new mxCell('Interface1, Interface2...', new mxGeometry(-1, 0, 0, 0), 'html=1;verticalAlign=bottom;labelBackgroundColor=none;startArrow=oval;startFill=0;startSize=8;endArrow=none;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.geometry.x = -1;
				edge.geometry.y = 3;
				edge.edge = true;
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Interface Generalization');
			}),
			this.addEntry(dt + 'required interface', function()
			{
				var edge = new mxCell('Interface1', new mxGeometry(-1, 0, 0, 0), 'html=1;verticalAlign=bottom;labelBackgroundColor=none;startArrow=halfCircle;startFill=0;startSize=2;endArrow=none;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.geometry.x = -1;
				edge.geometry.y = 3;
				edge.edge = true;
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Required Interface');
			}),
		 	this.addEntry(dt + 'property', function()
			{
		 		var cell1 = new mxCell('0..1', new mxGeometry(0, 0, 120, 50),
		 			'align=right;verticalAlign=top;spacingRight=2;');
				cell1.vertex = true;
		 		var field1 = new mxCell('Property1', 
		 				new mxGeometry(0, 1, 120, 30), 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;resizeWidth=1;');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(0, -30);
		 		field1.vertex = true;
		 		
		 		cell1.insert(field1);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Property'); 
			}),
			this.createVertexTemplateEntry('fontStyle=0;dashed=1;', 140, 30, 'Property1', 'Property', null, null, 'property'),
			this.createVertexTemplateEntry('fontStyle=0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=2;', 30, 30, 'port1', 'Port', null, null, 'port'),
			this.addEntry(dt + 'port provided interface lollipop notation', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(0, 0, 30, 30), 'html=1;rounded=0;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=2;');
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, true);
			   	var cell2 = new mxCell('', new mxGeometry(52, 11, 8, 8), 'ellipse;html=1;fontSize=11;align=center;fillColor=none;points=[];aspect=fixed;resizable=0;verticalAlign=bottom;labelPosition=center;verticalLabelPosition=top;flipH=1;');
		    	cell2.vertex = true;
				cell2.insertEdge(edge1, false);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1, cell2], 60, 30, 'Port with provided interface');
			}),
			this.addEntry(dt + 'port required interface lollipop notation', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(0, 0, 30, 30), 'html=1;rounded=0;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=2;');
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, true);
			   	var cell2 = new mxCell('', new mxGeometry(55, 10, 5, 10), 'shape=requiredInterface;html=1;fontSize=11;align=center;fillColor=none;points=[];aspect=fixed;resizable=0;verticalAlign=bottom;labelPosition=center;verticalLabelPosition=top;flipH=1;');
		    	cell2.vertex = true;
				cell2.insertEdge(edge1, false);
				return sb.createEdgeTemplateFromCells([cell1, edge1, cell2], 60, 30, 'Port with required interface');
			}),
			this.addEntry(dt + 'component', function()
			{
			    var cell1 = new mxCell('', new mxGeometry(0, 0, 140, 200), 'fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;marginBottom=0;');
			    cell1.vertex = true;
			    var cell2 = new mxCell('Component', new mxGeometry(0, 0, 140, 40), 'html=1;align=left;spacingLeft=4;verticalAlign=top;strokeColor=none;fillColor=none;');
			    cell2.vertex = true;
			    cell1.insert(cell2);
				var symbol = new mxCell('', new mxGeometry(1, 0, 16, 20), 'shape=module;jettyWidth=10;jettyHeight=4;');
				symbol.vertex = true;
				symbol.geometry.relative = true;
				symbol.geometry.offset = new mxPoint(-25, 9);
				cell2.insert(symbol);
				cell1.insert(divider.clone());
			    var cell3 = new mxCell('provided interfaces', new mxGeometry(0, 0, 140, 25), 'html=1;align=center;spacingLeft=4;verticalAlign=top;strokeColor=none;fillColor=none;');
			    cell3.vertex = true;
			    cell1.insert(cell3);
			    var cell4 = new mxCell('Interface1', new mxGeometry(0, 0, 140, 25), 'html=1;align=left;spacingLeft=4;verticalAlign=top;strokeColor=none;fillColor=none;');
			    cell4.vertex = true;
			    cell1.insert(cell4);
				cell1.insert(divider.clone());
			    var cell5 = new mxCell('required interfaces', new mxGeometry(0, 0, 140, 25), 'html=1;align=center;spacingLeft=4;verticalAlign=top;strokeColor=none;fillColor=none;');
			    cell5.vertex = true;
			    cell1.insert(cell5);
			    var cell6 = new mxCell('Interface2', new mxGeometry(0, 0, 140, 30), 'html=1;align=left;spacingLeft=4;verticalAlign=top;strokeColor=none;fillColor=none;');
			    cell6.vertex = true;
			    cell1.insert(cell6);

			    return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Component');
			}),
		 	this.addEntry(dt + 'classifier', function()
			{
		 		var cell1 = new mxCell('', new mxGeometry(0, 0, 270, 230),
		 			'shape=ellipse;container=1;horizontal=1;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;html=1;dashed=1;collapsible=0;');
				cell1.vertex = true;
		 		var field1 = new mxCell('Collaboration1', 
		 				new mxGeometry(0, 0, 270, 30), 'html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;rotatable=0;points=[[0,0.5],[1,0.5]];resizeWidth=1;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var divider1 = new mxCell('', new mxGeometry(39, 30, 192, 8), 'line;strokeWidth=1;fillColor=none;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;dashed=1;resizeWidth=1;');
		 		divider1.vertex = true;
		 		cell1.insert(divider1);
		 		var field2 = new mxCell('Classifier1', 
		 				new mxGeometry(0, 0, 100, 30), 'html=1;align=center;verticalAlign=middle;rotatable=0;');
		 		field2.geometry.relative = true;
		 		field2.geometry.offset = new mxPoint(85, 50);
		 		field2.vertex = true;
		 		cell1.insert(field2);
		 		var field3 = new mxCell('Collaboration use 1', 
		 				new mxGeometry(0, 0, 140, 30), 'shape=ellipse;html=1;align=center;verticalAlign=middle;rotatable=0;dashed=1;');
		 		field3.geometry.relative = true;
		 		field3.geometry.offset = new mxPoint(65, 110);
		 		field3.vertex = true;
		 		cell1.insert(field3);
		    	var assoc1 = new mxCell('property1', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=none;verticalAlign=middle;labelBackgroundColor=none;endSize=12;html=1;align=left;endFill=0;spacingLeft=4;');
		    	assoc1.geometry.relative = true;
		    	assoc1.edge = true;
		    	field2.insertEdge(assoc1, true);
		    	field3.insertEdge(assoc1, false);
		    	cell1.insert(assoc1);
		 		var field4 = new mxCell('Classifier2', 
		 				new mxGeometry(0, 0, 100, 30), 'html=1;align=center;verticalAlign=middle;rotatable=0;');
		 		field4.geometry.relative = true;
		 		field4.geometry.offset = new mxPoint(85, 170);
		 		field4.vertex = true;
		 		cell1.insert(field4);
		    	var assoc2 = new mxCell('property1', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;endArrow=none;verticalAlign=middle;labelBackgroundColor=none;endSize=12;html=1;align=left;endFill=0;spacingLeft=4;');
		    	assoc2.geometry.relative = true;
		    	assoc2.edge = true;
		    	field3.insertEdge(assoc2, true);
		    	field4.insertEdge(assoc2, false);
		    	cell1.insert(assoc2);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Classifier'); 
			}),
			this.createVertexTemplateEntry('shape=folder;fontStyle=1;tabWidth=80;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;', 150, 80,
				   	'Package1', 'Package', null, null, dt + 'package'),
		 	this.addEntry(dt + 'package', function()
			{
		 		var cell1 = new mxCell('Package1', new mxGeometry(0, 0, 150, 100),
		 			'shape=folder;fontStyle=1;tabWidth=110;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;container=1;collapsible=0;recursiveResize=0;');
				cell1.vertex = true;
		 		var field1 = new mxCell('Packaged element1', 
		 				new mxGeometry(0, 0, 110, 30), 'html=1;');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(20, 50);
		 		field1.vertex = true;
		 		cell1.insert(field1);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Package'); 
			}),
		 	this.addEntry(dt + 'package', function()
			{
		 		var cell1 = new mxCell('Package', new mxGeometry(0, 0, 150, 100),
		 			'shape=folder;fontStyle=1;tabWidth=110;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;container=1;collapsible=0;');
				cell1.vertex = true;
		 		var field1 = new mxCell('Text', 
		 				new mxGeometry(0, 0, 150, 70), 'html=1;strokeColor=none;resizeWidth=1;resizeHeight=1;fillColor=none;part=1;connectable=0;allowArrows=0;deletable=0;');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(0, 30);
		 		field1.vertex = true;
		 		cell1.insert(field1);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Package'); 
			}),
		 	this.addEntry(dt + 'model', function()
			{
		 		var cell1 = new mxCell('Model1', new mxGeometry(0, 0, 150, 80),
		 			'shape=folder;fontStyle=1;tabWidth=110;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;folderSymbol=triangle;');
				cell1.vertex = true;

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Model'); 
			}),
		 	this.addEntry(dt + 'stereotype', function()
			{
		 		var cell1 = new mxCell('', new mxGeometry(0, 0, 160, 75),
		 			'shape=note2;size=25;childLayout=stackLayout;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;container=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('&lt;&lt;stereotype1&gt;&gt;', 
		 				new mxGeometry(0, 0, 160, 25), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var field2 = new mxCell('stereotype property 1', 
		 				new mxGeometry(0, 0, 160, 25), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field2.vertex = true;
		 		cell1.insert(field2);
		 		var field3 = new mxCell('stereotype property 2', 
		 				new mxGeometry(0, 0, 160, 25), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field3.vertex = true;
		 		cell1.insert(field3);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Stereotype'); 
			}),
		 	this.addEntry(dt + 'class', function()
			{
		 		var cell1 = new mxCell('Class1', new mxGeometry(0, 0, 140, 79),
		 			'swimlane;fontStyle=1;align=center;verticalAlign=middle;childLayout=stackLayout;horizontal=1;startSize=29;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('&lt;&lt;stereotype1&gt;&gt;', 
		 				new mxGeometry(0, 0, 140, 25), 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var field2 = new mxCell('stereotype property 1', 
		 				new mxGeometry(0, 0, 140, 25), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		 		field2.vertex = true;
		 		cell1.insert(field2);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Class'); 
			}),
			this.createVertexTemplateEntry('text;html=1;align=center;', 200, 25,
				   	'&lt;&lt;stereotype1, stereotype2...&gt;&gt;', 'Stereotype Label', null, null, dt + 'stereotype label'),
			this.createVertexTemplateEntry('ellipse;', 50, 25,
				   	'icon', 'Icon', null, null, dt + 'icon'),
		 	this.addEntry(dt + 'region', function()
			{
		 		var cell1 = new mxCell('', new mxGeometry(60, 0, 10, 100),
		 			'line;strokeWidth=1;direction=south;html=1;dashed=1;dashPattern=20 20;');
				cell1.vertex = true;

		 		var cell2 = new mxCell('Region 1', new mxGeometry(0, 40, 60, 20),
	 				'text;align=right;');
		 		cell2.vertex = true;

		 		var cell3 = new mxCell('Region 2', new mxGeometry(70, 40, 60, 20),
					'text;align=left;');
		 		cell3.vertex = true;
		 		
				return sb.createVertexTemplateFromCells([cell1, cell2, cell3], 130, cell1.geometry.height, 'Region'); 
			}),
		 	this.addEntry(dt + 'state', function()
			{
		 		var cell1 = new mxCell('State1<br>[invariant1]<br>&lt;&lt;extended/final&gt;&gt;', new mxGeometry(0, 0, 140, 176),
		 			'swimlane;fontStyle=4;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=60;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;rounded=1;absoluteArcSize=1;arcSize=50;');
				cell1.vertex = true;
		 		var field1 = new mxCell('', 
		 				new mxGeometry(0, 0, 140, 50), 'fillColor=none;strokeColor=none;container=1;collapsible=0;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var field2 = new mxCell('State2', 
		 				new mxGeometry(30, 10, 80, 30), 'html=1;align=center;verticalAlign=middle;rounded=1;absoluteArcSize=1;arcSize=10;');
		 		field2.vertex = true;
		 		field1.insert(field2);
				cell1.insert(divider.clone());
		 		var field3 = new mxCell('behavior1', 
		 				new mxGeometry(0, 0, 140, 25), 'fillColor=none;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=5;');
		 		field3.vertex = true;
		 		cell1.insert(field3);
				cell1.insert(divider.clone());
		 		var field4 = new mxCell('transition1', 
		 				new mxGeometry(0, 0, 140, 25), 'fillColor=none;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=5;');
		 		field4.vertex = true;
		 		cell1.insert(field4);
		 		
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'State'); 
			}),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=top;rounded=1;absoluteArcSize=1;arcSize=10;dashed=1;', 140, 40,
				   	'State1', 'State', null, null, dt + 'state'),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=top;rounded=1;absoluteArcSize=1;arcSize=10;dashed=0;', 140, 40,
				   	'State', 'State', null, null, dt + 'state'),
			this.createVertexTemplateEntry('shape=folder;align=center;verticalAlign=middle;fontStyle=0;tabWidth=100;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;rounded=1;absoluteArcSize=1;arcSize=10;', 140, 90,
				   	'State1', 'State', null, null, dt + 'state'),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=top;rounded=1;absoluteArcSize=1;arcSize=10;dashed=0;', 140, 40,
				   	'State1, State2, ...', 'State', null, null, dt + 'state'),
			this.createVertexTemplateEntry('shape=umlState;rounded=1;verticalAlign=top;spacingTop=5;umlStateSymbol=collapseState;absoluteArcSize=1;arcSize=10;', 140, 60,
				   	'State1', 'State', null, null, dt + 'state'),
		 	this.addEntry(dt + 'state entry point', function()
			{
		 		var cell1 = new mxCell('State1', new mxGeometry(0, 0, 140, 50),
		 			'shape=umlState;rounded=1;verticalAlign=middle;align=center;absoluteArcSize=1;arcSize=10;umlStateConnection=connPointRefEntry;boundedLbl=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('Entry1', 
		 				new mxGeometry(-40, 40, 50, 20), 'text;verticalAlign=middle;align=center;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
				return sb.createVertexTemplateFromCells([cell1], 140, 60, 'State with entry point'); 
			}),
		 	this.addEntry(dt + 'state exit point', function()
			{
		 		var cell1 = new mxCell('State1', new mxGeometry(0, 0, 140, 50),
		 			'shape=umlState;rounded=1;verticalAlign=middle;spacingTop=0;absoluteArcSize=1;arcSize=10;umlStateConnection=connPointRefExit;boundedLbl=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('Exit1', 
		 				new mxGeometry(-40, 40, 50, 20), 'text;verticalAlign=middle;align=center;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		
				return sb.createVertexTemplateFromCells([cell1], 140, 60, 'State with exit point'); 
			}),
			this.createVertexTemplateEntry('ellipse;fillColor=strokeColor;', 30, 30,
				   	'', 'Initial preudostate / node', null, null, dt + 'initial pseudostate'),
			this.createVertexTemplateEntry('ellipse;html=1;shape=endState;fillColor=strokeColor;', 30, 30,
				   	'', 'Final state / node', null, null, dt + 'final state'),
			this.createVertexTemplateEntry('ellipse;', 30, 30,
				   	'H', 'Shallow History', null, null, dt + 'shallow history pseudostate'),
			this.createVertexTemplateEntry('ellipse;', 30, 30,
				   	'H*', 'Deep History', null, null, dt + 'deep history pseudostate'),
			this.createVertexTemplateEntry('ellipse;', 30, 30,
				   	'', 'Entry Point', null, null, dt + 'entry point pseudostate'),
			this.createVertexTemplateEntry('shape=sumEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;', 30, 30,
				   	'', 'Exit Point / Flow Final Node', null, null, dt + 'exit point pseudostate'),
			this.createVertexTemplateEntry('ellipse;fillColor=strokeColor;', 20, 20,
				   	'', 'Junction', null, null, dt + 'junction pseudostate'),
			this.createVertexTemplateEntry('rhombus;', 30, 30,
				   	'', 'Choice / Merge Node / Decision Node', null, null, dt + 'choice pseudostate merge decision node'),
			this.createVertexTemplateEntry('shape=umlDestroy;', 30, 30,
				   	'', 'Terminate', null, null, dt + 'terminate pseudostate'),
			this.createVertexTemplateEntry('html=1;points=[];perimeter=orthogonalPerimeter;fillColor=strokeColor;', 5, 80,
				   	'', 'Join/Fork Node', null, null, dt + 'join fork pseudostate'),
			this.createVertexTemplateEntry('text;align=center;verticalAlign=middle;dashed=0;', 140, 40,
				   	'OpaqueAction1 spec.', 'Opaque Action', null, null, dt + 'opaque action'),
			this.createVertexTemplateEntry('html=1;shape=mxgraph.infographic.ribbonSimple;notch1=20;notch2=0;align=center;verticalAlign=middle;fontSize=14;fontStyle=0;flipH=1;fillColor=#FFFFFF;', 160, 40,
				   	'Trigger1 spec.', 'Trigger', null, null, dt + 'trigger'),
			this.createVertexTemplateEntry('html=1;shape=mxgraph.infographic.ribbonSimple;notch1=0;notch2=20;align=center;verticalAlign=middle;fontSize=14;fontStyle=0;fillColor=#FFFFFF;', 160, 40,
				   	'SendSignalAction1', 'Send Signal Action', null, null, dt + 'send signal action'),
			this.createVertexTemplateEntry('html=1;align=right;verticalAlign=top;rounded=1;absoluteArcSize=1;arcSize=50;dashed=0;spacingTop=10;spacingRight=30;', 300, 160,
				   	'&lt;&lt;singleExecution&gt;&gt;', 'Single Execution', null, null, dt + 'single execution'),
		 	this.addEntry(dt + 'parameter', function()
			{
		 		var cell1 = new mxCell('', new mxGeometry(0, 10, 30, 30),
		 			'');
				cell1.vertex = true;
		 		var field1 = new mxCell('Parameter1 spec.', 
		 				new mxGeometry(40, 0, 100, 20), 'text;verticalAlign=middle;align=center;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var field2 = new mxCell('', 
		 				new mxGeometry(50, 25, 30, 15), 'triangle;whiteSpace=wrap;html=1;direction=north;');
		 		field2.vertex = true;
		 		cell1.insert(field2);
		 		
				return sb.createVertexTemplateFromCells([cell1, field1, field2], 140, 40, 'Parameter'); 
			}),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=top;rounded=1;absoluteArcSize=1;arcSize=10;dashed=0;', 140, 40,
				   	'Action1', 'Action', null, null, dt + 'action'),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=middle;rounded=1;absoluteArcSize=1;arcSize=10;dashed=0;', 140, 70,
				   	'&lt;&lt;external&gt;&gt;<br>Action1<br>(partition1)', 'Activity Partition', null, null, dt + 'activity partition'),
		 	this.addEntry(dt + 'object node', function()
			{
		 		var cell1 = new mxCell('ObjectNode1<br><br>[State1, State2...]', new mxGeometry(0, 0, 140, 60),
		 			'html=1;align=center;verticalAlign=middle;rounded=0;absoluteArcSize=1;arcSize=10;dashed=0;');
				cell1.vertex = true;
		 		var field1 = new mxCell('{annotation1}', 
		 				new mxGeometry(0, 60, 140, 30), 'text;verticalAlign=middle;align=center;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		
				return sb.createVertexTemplateFromCells([cell1, field1], 140, 90, 'Object Node'); 
			}),
		 	this.addEntry(dt + 'activity parameter node', function()
			{
		 		var cell1 = new mxCell('Parameter1 spec.', new mxGeometry(0, 0, 140, 60),
		 			'html=1;align=center;verticalAlign=middle;rounded=0;absoluteArcSize=1;arcSize=10;dashed=0;');
				cell1.vertex = true;
		 		var field1 = new mxCell('{stream}', 
		 				new mxGeometry(0, 60, 140, 30), 'text;verticalAlign=middle;align=center;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		
				return sb.createVertexTemplateFromCells([cell1, field1], 140, 90, 'Activity Parameter Node'); 
			}),
			this.createVertexTemplateEntry('html=1;shape=mxgraph.infographic.ribbonSimple;notch1=20;notch2=20;align=center;verticalAlign=middle;fontSize=14;fontStyle=0;fillColor=#FFFFFF;', 160, 40,
				   	'ObjectNode1', 'Object Node', null, null, dt + 'object node'),
			this.addEntry('behavior selection transformation decision input', function()
			{
		    	var cell = new mxCell('Behavior1 spec.', new mxGeometry(0, 0, 160, 60), 'shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=left;spacingLeft=5;');
		    	cell.vertex = true;
		    	var label = new mxCell('<<keyword>>', new mxGeometry(0, 0, cell.geometry.width, 25), 'resizeWidth=1;part=1;strokeColor=none;fillColor=none;align=left;spacingLeft=5;');
		    	label.geometry.relative = true;
		    	label.vertex = true;
		    	cell.insert(label);
		
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Behavior');
			}),
			this.createVertexTemplateEntry('html=1;points=[];perimeter=orthogonalPerimeter;fillColor=strokeColor;align=left;verticalAlign=top;spacingLeft=10;', 5, 80,
				   	'{joinSpec = join spec}', 'Join Node', null, null, dt + 'join node'),
		    this.addDataEntry('activity partition', 180, 200, 'Activity Partition', '7ZjRbtowFIafJrdTnMBobwltbzZpWvcCLjkQa45P5Jw20KefnRjCBikBnKlURUGyj30c5/vt/JggTvLVg+ZF9h1TkEF8F8SJRqSmlK8SkDKIQpEG8SyIotB8g+i+o5XVrWHBNSjqkxA1CS9cPkMTSUUOqhSo3FglraVrKjNe2CLxJxuaZpSbCc+YKVaZIHgs+Ny2V+ZxTKwkrulRvNqQmUY8naMiLhRolzRHKXlRinq0Wd0jEzL9xtf4TJv7bGrThZAyQYk2W6GyEygrkUuu4H6nKYjiRf2pZ6DxN/yT5J4YNMGqk1odcsgeAHMgvTZdKpFS5nrcNGTDDMQyc2lR6IK8bALLbW4rgik4HQ5rEu9p0qmEmTIJLn/CnLha9hFln3mqsfjF9RLIBQoUikDfvRgapYsdgE9YuEYJi03uExJh7iragdkOWkMZT81lMCXhl3EwNk+TmDpr6+ay3TUlqIyAZsHYMYCXVEFJF6kaHVZ1vRGvyTgu8uUaj4bVWCnbu9W4Uz7Wysd25WM78tkyGrILiZWpZiJNQV2kQ3x0d0UDcR/vcf9h8dKb77t3q8AlsFedi36oNf+1m/0Vrn4P7Fn4/+BPrslU+uri0VQ8+Meop39MPMh5072X4uvbSxlq8Wp/HEp3l15qTM5yER/0bz+Ae1+C+DTv8EGchZ/IT7EML8zZp2cM7RmM9TSNWx+C7p/2t64xur7tdJ5rsONH+0O24YX/wCf79/MS64J8mnF4Yf4RTto+mPd1jjOgm2r7j2Xd9tcfmn8A'),		    
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=top;rounded=1;absoluteArcSize=1;arcSize=20;dashed=1;', 200, 100,
				   	'', 'Interruptible Activity Region', null, null, dt + 'interruptible activity region'),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=middle;rounded=1;absoluteArcSize=1;arcSize=10;dashed=1;', 140, 40,
				   	'State1', 'State', null, null, dt + 'state'),
			this.addEntry('constraint precondition postcondition selection transformation decision input', function()
			{
		    	var cell = new mxCell('Constraint1 spec.', new mxGeometry(0, 0, 160, 60), 'shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=left;spacingLeft=5;');
		    	cell.vertex = true;
		    	var label = new mxCell('<<keyword>>', new mxGeometry(0, 0, cell.geometry.width, 25), 'resizeWidth=1;part=1;strokeColor=none;fillColor=none;align=left;spacingLeft=5;');
		    	label.geometry.relative = true;
		    	label.vertex = true;
		    	cell.insert(label);
		
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Constraint / Precondition / Postcondition');
			}),
			this.createVertexTemplateEntry('fontStyle=0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=2;html=1;', 30, 30, 
					'Pin1<br>[State1]<br>{control}<br>Parameter1 spec.', 
					'Port', null, null, 'port'),
			this.addEntry('object flow', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(50, 0, 30, 30), 'html=1;rounded=0;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 15), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;');
				edge2.geometry.setTerminalPoint(new mxPoint(130, 15), false);
				edge2.geometry.relative = true;
				edge2.edge = true;
				cell1.insertEdge(edge2, true);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1, edge2], 160, 30, 'Object Flow');
			}),
			this.createVertexTemplateEntry('fontStyle=0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=2;html=1;points=[[0,0.5],[1,0.5]];fillColor=strokeColor;', 30, 30, '', 'Pin ', null, null, 'pin'),
			this.createVertexTemplateEntry('shape=mxgraph.uml25.inputPin;html=1;points=[[0,0.5],[1,0.5]];', 30, 30, '', 'Input Pin', null, null, 'input pin'),
			this.createVertexTemplateEntry('shape=mxgraph.uml25.inputPin;html=1;points=[[0,0.5],[1,0.5]];strokeColor=#ffffff;fillColor=#000000;', 30, 30, '', 'Input Pin', null, null, 'input pin'),
			this.createVertexTemplateEntry('shape=mxgraph.uml25.inputPin;html=1;points=[[0,0.5],[1,0.5]];flipH=1;', 30, 30, '', 'Output Pin', null, null, 'output pin'),
			this.createVertexTemplateEntry('shape=mxgraph.uml25.inputPin;html=1;points=[[0,0.5],[1,0.5]];strokeColor=#ffffff;fillColor=#000000;flipH=1;', 30, 30, '', 'Output Pin', null, null, 'output pin'),
			this.createVertexTemplateEntry('shape=mxgraph.uml25.behaviorAction;html=1;rounded=1;absoluteArcSize=1;arcSize=10;align=left;spacingLeft=5;', 190, 60, 'CallBehaviorAction1', 'Behavior Action', null, null, 'behavior action'),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=top;rounded=1;absoluteArcSize=1;arcSize=10;dashed=0;', 140, 40,
				   	'Action1<br>(Operation1)', 'Call Operation Action', null, null, dt + 'call operation action'),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=middle;rounded=1;absoluteArcSize=1;arcSize=10;dashed=0;', 140, 40,
				   	'ValueSpecAction1 spec.', 'Value Specification Action', null, null, dt + 'value specification action'),
		 	this.addEntry(dt + 'action with output', function()
			{
		 		var cell1 = new mxCell('Action1', new mxGeometry(0, 20, 110, 40),
		 			'shape=mxgraph.uml25.action;html=1;align=center;verticalAlign=middle;absoluteArcSize=1;arcSize=10;dashed=0;spacingRight=10;');
				cell1.vertex = true;
		 		var field1 = new mxCell('variable1', 
		 				new mxGeometry(110, 0, 60, 30), 'text;verticalAlign=middle;align=left;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		
				return sb.createVertexTemplateFromCells([cell1, field1], 170, 60, 'Action with output'); 
			}),
		 	this.addEntry(dt + 'action with input', function()
			{
		 		var cell1 = new mxCell('Action1', new mxGeometry(60, 0, 110, 40),
		 			'shape=mxgraph.uml25.action;html=1;align=center;verticalAlign=middle;absoluteArcSize=1;arcSize=10;dashed=0;spacingLeft=10;flipH=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('variable1', 
		 				new mxGeometry(0, 0, 60, 40), 'text;verticalAlign=middle;align=right;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		
				return sb.createVertexTemplateFromCells([cell1, field1], 170, 40, 'Action with input'); 
			}),
		 	this.addEntry(dt + 'read self object action', function()
			{
		 		var cell1 = new mxCell('Action1', new mxGeometry(60, 0, 110, 40),
		 			'shape=mxgraph.uml25.action;html=1;align=center;verticalAlign=middle;absoluteArcSize=1;arcSize=10;dashed=0;spacingLeft=10;flipH=1;');
				cell1.vertex = true;
				
		 		var field1 = new mxCell('self', 
		 				new mxGeometry(0, 0, 60, 40), 'text;verticalAlign=middle;align=right;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		
				return sb.createVertexTemplateFromCells([cell1, field1], 170, 40, 'Read self object action'); 
			}),
		 	this.addEntry(dt + 'value specification action', function()
			{
		 		var cell1 = new mxCell('Action1', new mxGeometry(60, 0, 110, 40),
		 			'shape=mxgraph.uml25.action;html=1;align=center;verticalAlign=middle;absoluteArcSize=1;arcSize=10;dashed=0;spacingLeft=10;flipH=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('value1', 
		 				new mxGeometry(0, 0, 60, 40), 'text;verticalAlign=middle;align=right;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		
				return sb.createVertexTemplateFromCells([cell1, field1], 170, 40, 'Value specification action'); 
			}),
			this.createVertexTemplateEntry('html=1;shape=mxgraph.infographic.ribbonSimple;notch1=0;notch2=20;align=center;verticalAlign=middle;fontSize=14;fontStyle=0;fillColor=#FFFFFF;', 160, 40,
				   	'SendObjectAction1', 'Send Object Action', null, null, dt + 'send object action'),
			this.createVertexTemplateEntry('html=1;shape=mxgraph.infographic.ribbonSimple;notch1=20;notch2=0;align=center;verticalAlign=middle;fontSize=14;fontStyle=0;fillColor=#FFFFFF;flipH=0;spacingRight=0;spacingLeft=14;', 170, 40,
				   	'AcceptEventAction1', 'Accept Event Action', null, null, dt + 'acceppt event action'),
			this.createVertexTemplateEntry('shape=collate;whiteSpace=wrap;html=1;', 40, 40,
				   	'', 'Time Event Trigger', null, null, dt + 'time event trigger'),
			this.createVertexTemplateEntry('shape=mxgraph.uml25.actionParams;html=1;align=center;verticalAlign=top;absoluteArcSize=1;arcSize=10;dashed=0;spacingLeft=10;spacingTop=5;', 150, 50,
				   	'Action1', 'Action with Parameters', null, null, dt + 'action with parameters'),
			this.createVertexTemplateEntry('dashed=1;rounded=1;absoluteArcSize=1;arcSize=20;html=1;verticalAlign=top;align=left;spacingTop=5;spacingLeft=10;', 200, 100,
				   	'&lt;&lt;structured&gt;&gt;', 'Structured Activity Node', null, null, dt + 'structured activity node'),
			this.addDataEntry(dt + 'expansion', 300, 300, 'Expansion', '7ZtRr5owFMc/DY93oa0693j1bncPW7JkS/bcXSqQVTFQvbJPv2ILDi8Glnha2pBo4jmlpf218e8/RwKy3p6ec7pPvmYR4wH5GJB1nmVCfdqe1ozzAIdpFJCnAONQvgP86UYrOreGe5qznRjSAasOR8oPTGUCvKDbfUBWXA6wake/Wfma5VGTjFuX6KgarxAl1+MlYitX9YRkW0SLhEU6yLPDLmoi+qvI+EGwx/zle/qH1dkmkssgqyPLRfpC+SNP451Miqy6LdURZ5tqAsWevqS7+EfVprrpzJdzu0rpVcvx2OkmuXNKY3tm2ZaJvJSXvKaRSNQVJFR0w4SlcSKukrRQibjpe9kI+UHvRfe+kI59uQIbS4LV+nNWSEY/9azCJvO5ntPgBePeBS871qtPWJgzTkV6ZK3huxjoO3zLUnljHJ5qbKpHqcIHdEUx22wKJt4wbOY5COusH+sgnPtq7ueJzVfyJae6DoO57L6uonfzVozqSL4G7gTp3QkMsBN3RT2fUPcfegxxyBcT+X7yMwjy7yfy/eQXEOSXI9LLdgcz6vmAkAn9/ODIAV+6r5/1/k2sjQsoQhN6SwqKugzphN6EhKIxec7SgoYacaAI0IKiqwOOWgcc/d8BRx54UARoQn2ADSqigDbUI/YwKgpoRD1iDyOj47WiNkTVkDFFgM70vifeA2taT2aCbV5WMaA39Yg9iKzWqCf25mV1rBXRLo7Le0lnWzkJCFdXSqI+1ESdKYpagl1CCqcrZVG77GGE05XCqF32MMI5Jj9604EalNGLI70vZ1dqoz4UR+ufQhNs80JKXKmO2mUPIqQE0IF6xB5ESMmYHOjN/xi57keJK36UeOBHiSt+1BJsUBl1xY/aZQ8jo674UbvsYWR0TH50YH3UfXdKXHGnxAN3Wn9nTbDNy+rMFXdqlz2IrM5ccad22d9DVmV4eUhYXf7vM8R/AQ=='),
		 	this.addEntry(dt + 'execution region', function()
			{
		 		var cell1 = new mxCell('Action', new mxGeometry(0, 0, 160, 50),
		 			'html=1;dashed=0;rounded=1;absoluteArcSize=1;arcSize=20;verticalAlign=middle;align=center;');
				cell1.vertex = true;
		 		var label1 = new mxCell('*', 
		 				new mxGeometry(1, 0.5, 20, 20), 'text;resizeWidth=0;resizeHeight=0;points=[];part=1;verticalAlign=middle;align=center;');
		 		label1.vertex = true;
		 		label1.geometry.relative = true;
		 		label1.geometry.offset = new mxPoint(-20, -10);
		 		cell1.insert(label1);
		 		
				return sb.createVertexTemplateFromCells([cell1], 160, 50, 'Execution region'); 
			}),
			this.addDataEntry(dt + 'execution node action', 210, 60, 'Execution node with action', '7ZhNb4MwDIZ/TY6bklC67tjSrbtMmrTDzhm4ECk0KKRdu18/UwJdvwSTyr6EBBJ24uT1E0sWIV6QrmdGZMmjjkAR7454gdHall/pOgClCKcyIt6UcE7xJfz+zCjbjtJMGFjYNgG8DFgJtYTSMw6t1Au3UG43yvkTm6K6KSPeJBJ5AsUCFA2jl4toaxVD4jXXamlhbMJn+Q6Vt7Z4EbICY2Uo1FjJeIHOVEZRsc1EOEeI6sGgw6nD+bA+m+HW5dKbgU7Bmg1OeZORTVyWrKRAE5Bx4sKGzify0o7r0B0v/HDITuPzjvAdcYsRUFZwghwRvDhRtPY8VJJo23x5Y76jE+m6QqAGlLByBXvLn2LgdnjSEjfm1Onx3DKb0rxiBxT1fJ6DPWJY62yFddCMtRXOrNC+FeZP8EGpASU+hgeFde3v2ayy8Gl5El5z5XVwEhdF7feom4ued1Hkw558M/lBF+RvevLN5A/b40XIj35Rv9zsBfyj7nnbXXmzg/Jme+XNvlbeo7/fPavz61l/e/tkrEf/Q/2THf819ug7aaBo7u4Cyumfrwo+AA=='),
		 	this.addEntry(dt + 'interaction', function()
			{
		 		var cell1 = new mxCell('Interaction1 heading', new mxGeometry(0, 0, 290, 160),
		 			'shape=umlFrame;tabWidth=110;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;width=140;height=30;recursiveResize=0;');
				cell1.vertex = true;
		 		var field1 = new mxCell('Property1', 
		 				new mxGeometry(0, 0, 100, 20), 'text');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(20, 40);
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var field2 = new mxCell('Property2', 
		 				new mxGeometry(0, 0, 150, 60), 'shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=left;spacingLeft=10;');
		 		field2.geometry.relative = true;
		 		field2.geometry.offset = new mxPoint(120, 80);
		 		field2.vertex = true;
		 		cell1.insert(field2);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Interaction'); 
			}),
			this.addDataEntry(dt + 'lifeline sequence participant', 220, 300, 'Lifelines', '1ZPBbsMgDIafhjuFN2iy9bJJ0/oELPEKEgQETpPu6ecEaDRpkXbYDjsgmc/+4/gHmGzcfIoq6Gffg2Xygckmeo85cnMD1jLBTc9ky4TgtJh43Mke1iwPKsKAPxGILLgqO0ImT+YdrBmgfCrhzZZM0ios4ehsLWLyGCAaBwiRMrbgl40dJ20QzkF1i3SiQYlpdDRpe6Cw8wMqksT73loVknlbu3IiEboxJnOFV0jmo1I/4tKp8cMAHRZYhoGIMO8asqLixgk8/We8UclketSlgmfTuAZz0UUmK1Qpg8tdu/lLQbH4e7vlrt3iH9pd+7cqaeh/4QyqoFzaPzkT2m7Pa819eX2f'),
			this.addDataEntry(dt + 'lifeline execution', 220, 300, 'Lifelines', '5ZTbasMwDIafxvdu3MB223TrzQZjewIvVWuDYhlH6WFPPydx2m5pR2FsDEYISL8syfoQFqqodougvXmkJaBQd0IVgYh7q9oVgCgyaZdCzUWWyfiL7P5CdNJFpdcBHF+TkPUJG40N9MqDXQFaBylS8x5TpDbat2ZT4XBIqJmHYCtgCDGCSX46arOtsQwvXpdt6jYOGjXDVZx0PolmSY51TAkHH1H72r52XWVUApRNqO0GnqG2b4NKDbedCnIOSk5iGgYCw+4ikE5KNBZA8Z5hH48MCQmY3Nolm6TJpBmwa5PKqEHUdS+sD7WOvKORkJ/Hr0b4R9RPWHmyjrtu+Uzk80/wKbChNTmNp/hXFrEgpNBVUzey/a5FlX2Japr3GfvevT0HbsztAPg73KYX13byz9b2V9Y0//E1vQrB9I+sY3SPL3QX+/CAvwM='),
			this.addDataEntry(dt + 'destruction occurence specification', 100, 300, 'Destruction Occurence Specification', 'lZJBboMwEEVP471jZ9F1oM2mlaL2BC5MY0sGW/YQoKfvgE1oVVI1C6SZP/Nt/pOZLJrhGJTXL64Gy+Qjk0VwDlPVDAVYywQ3NZMlE4LTx8TTjelunnKvArT4H4NIhouyHSTl2XyANS3koyKONk+iVn4qu8YuS0wePATTAEKgic3yadUOvTYIb15Vk7WnoKRpbChpuaOyci0qsoRrb63y0bzPt3JSAlRdiOYCrxDN56K6DqebCte2UGEWcxgICMNNILOUaRzB0X+GkVZ6U6POGzxB4xrMWWebXEQVk3C+ele+VGTE27jlL9x/US4hYnAjBatV1FDfk1JspxyWMMkx5uWH3H+DsN9gsL8fAbXra55nPx77Fw=='),
		 	this.addEntry(dt + 'interaction', function()
			{
		 		var cell1 = new mxCell('Interaction1 heading', new mxGeometry(0, 0, 290, 250),
		 			'shape=umlFrame;tabWidth=110;tabHeight=30;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;width=140;height=30;');
				cell1.vertex = true;
		 		var field1 = new mxCell('[constraint1]', 
		 				new mxGeometry(0, 0, 100, 20), 'text');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(20, 40);
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var field2 = new mxCell('[constraint2]', 
		 				new mxGeometry(0, 125, 290, 10), 'line;strokeWidth=1;dashed=1;labelPosition=center;verticalLabelPosition=bottom;align=left;verticalAlign=top;spacingLeft=20;spacingTop=15;');
		 		field2.geometry.relative = false;
		 		field2.vertex = true;
		 		cell1.insert(field2);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Interaction'); 
			}),
		 	this.addEntry(dt + 'lifeline continuation', function()
			{
		 		var cell1 = new mxCell('Continuation1', new mxGeometry(30, 60, 160, 30),
		 			'rounded=1;dashed=0;');
				cell1.vertex = true;
		 		var cell2 = new mxCell('Lifeline1', new mxGeometry(0, 0, 100, 200),
		 			'shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;');
				cell2.vertex = true;
		 		var cell3 = new mxCell('Lifeline2', new mxGeometry(120, 0, 100, 200),
		 			'shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;');
				cell3.vertex = true;
				
				return sb.createVertexTemplateFromCells([cell1, cell2, cell3], 220, 200, 'Lifeline Continuation'); 
			}),
		 	this.addEntry(dt + 'lifeline state invariant', function()
			{
		 		var cell1 = new mxCell('Lifeline1', new mxGeometry(0, 0, 100, 200),
		 			'shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;');
				cell1.vertex = true;
				var cell2 = new mxCell('State1 inv.', new mxGeometry(10, 50, 80, 30),
		 			'rounded=1;dashed=0;point=[];connectable=0;');
				cell2.vertex = true;
				cell1.insert(cell2);
		 		var cell3 = new mxCell('{State2 inv.}', new mxGeometry(0, 140, 100, 30),
		 			'text;align=center;point=[];connectable=0;');
				cell3.vertex = true;
				cell1.insert(cell3);

				return sb.createVertexTemplateFromCells([cell1], 100, 200, 'Lifeline State Invariant'); 
			}),
		 	this.addEntry(dt + 'interaction use', function()
			{
		 		var cell1 = new mxCell('ref', new mxGeometry(0, 0, 260, 120),
		 			'shape=umlFrame;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;width=50;height=30;');
				cell1.vertex = true;
		 		var field1 = new mxCell('Interaction1', 
		 				new mxGeometry(0, 0, 100, 20), 'text;align=center;');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(60, 50);
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Interaction'); 
			}),
		 	this.addEntry(dt + 'lifeline state invariant', function()
			{
		 		var cell1 = new mxCell('Lifeline1', new mxGeometry(0, 0, 100, 200),
		 			'shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;');
				cell1.vertex = true;
		 		var cell2 = new mxCell('', new mxGeometry(30, 70, 40, 20),
		 			'shape=partialRectangle;whiteSpace=wrap;html=1;bottom=0;fillColor=none;point=[];connectable=0;');
				cell2.vertex = true;
				cell1.insert(cell2);
		 		var cell3 = new mxCell('', new mxGeometry(30, 150, 40, 20),
		 			'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;fillColor=none;point=[];connectable=0;');
				cell3.vertex = true;
				cell1.insert(cell3);

				return sb.createVertexTemplateFromCells([cell1], 100, 200, 'Lifeline'); 
			}),
		 	this.addEntry(dt + 'use case', function()
			{
		 		var cell1 = new mxCell('Class1', new mxGeometry(0, 0, 180, 140),
		 			'swimlane;fontStyle=1;align=center;horizontal=1;startSize=30;collapsible=0;html=1;');
				cell1.vertex = true;
		 		var field1 = new mxCell('heading1', 
		 				new mxGeometry(0, 0, 140, 70), 'shape=umlFrame;tabPosition=left;html=1;boundedLbl=1;labelInHeader=1;width=80;height=30;swimlaneFillColor=#ffffff;align=left;spacingLeft=5;');
		 		field1.geometry.relative = true;
		 		field1.geometry.offset = new mxPoint(20, 50);
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var field2 = new mxCell('Interaction1', 
		 				new mxGeometry(0, 0, 100, 20), 'text;align=left;');
		 		field2.geometry.relative = true;
		 		field2.geometry.offset = new mxPoint(10, 40);
		 		field2.vertex = true;
		 		field1.insert(field2);
		 		
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Use Case'); 
			}),
			this.addEntry('observation', function()
			{
				var edge = new mxCell('observation', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;endSize=12;startArrow=none;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;align=center;verticalAlign=bottom;endFill=0;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.geometry.x = 0;
				edge.geometry.y = 3;
				edge.edge = true;
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Observation');
			}),
			this.addEntry('time constraint', function()
			{
				var edge = new mxCell('{Time constraint 1}', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;endSize=12;startArrow=none;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;align=center;verticalAlign=bottom;endFill=0;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.geometry.x = 0;
				edge.geometry.y = 3;
				edge.edge = true;
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Time constraint');
			}),
			this.addEntry('duration constraint', function()
			{
				var edge = new mxCell('{Duration constraint 1}', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;endSize=12;startArrow=open;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;align=center;verticalAlign=bottom;endFill=0;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.geometry.x = 0;
				edge.geometry.y = 3;
				edge.edge = true;
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Duration constraint');
			}),
		 	this.addEntry(dt + 'classifier', function()
			{
		 		var cell1 = new mxCell('', new mxGeometry(0, 0, 180, 120),
		 			'shape=ellipse;container=1;horizontal=1;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;html=1;dashed=0;collapsible=0;');
				cell1.vertex = true;
		 		var field1 = new mxCell('UseCase1', 
		 				new mxGeometry(0, 0, 180, 30), 'html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rotatable=0;');
		 		field1.vertex = true;
		 		cell1.insert(field1);
		 		var divider1 = new mxCell('', new mxGeometry(9, 30, 162, 10), 'line;strokeWidth=1;fillColor=none;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;dashed=0;resizeWidth=1;');
		 		divider1.vertex = true;
		 		cell1.insert(divider1);
		 		var field2 = new mxCell('extension points', 
		 				new mxGeometry(0, 40, 180, 30), 'text;html=1;align=center;verticalAlign=middle;rotatable=0;fillColor=none;strokeColor=none;');
		 		field2.vertex = true;
		 		cell1.insert(field2);
		 		var field3 = new mxCell('Extension point 1', 
		 				new mxGeometry(0, 70, 180, 30), 'text;html=1;align=left;verticalAlign=middle;rotatable=0;spacingLeft=25;fillColor=none;strokeColor=none;');
		 		field3.vertex = true;
		 		cell1.insert(field3);

				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Classifier'); 
			}),
			this.addEntry(dt + 'extension point classifier', function()
			{
			    var cell1 = new mxCell('', new mxGeometry(0, 0, 160, 88), 'fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;marginBottom=0;');
			    cell1.vertex = true;
			    var cell2 = new mxCell('UseCase1', new mxGeometry(0, 0, 160, 30), 'html=1;align=left;spacingLeft=4;verticalAlign=middle;strokeColor=none;fillColor=none;fontStyle=1');
			    cell2.vertex = true;
			    cell1.insert(cell2);
				var symbol = new mxCell('', new mxGeometry(1, 0, 20, 16), 'shape=ellipse;');
				symbol.vertex = true;
				symbol.geometry.relative = true;
				symbol.geometry.offset = new mxPoint(-25, 7);
				cell2.insert(symbol);
				cell1.insert(divider.clone());
			    var cell3 = new mxCell('extension points', new mxGeometry(0, 0, 160, 25), 'html=1;align=center;spacingLeft=4;verticalAlign=top;strokeColor=none;fillColor=none;');
			    cell3.vertex = true;
			    cell1.insert(cell3);
			    var cell4 = new mxCell('Extension point 1', new mxGeometry(0, 0, 160, 25), 'html=1;align=left;spacingLeft=4;verticalAlign=top;strokeColor=none;fillColor=none;');
			    cell4.vertex = true;
			    cell1.insert(cell4);

			    return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Extension Point Classifier');
			}),
			this.createVertexTemplateEntry('shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;', 30, 60, 'Actor', 'Actor', false, null, 'uml actor'),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=middle;dashed=0;', 160, 70,
				   	'&lt;&lt;actor&gt;&gt;<br><br><b>Actor1</b>', 
				   	'Actor', null, null, dt + 'actor'),

			this.addEntry('extension point extend', function()
			{
		    	var cell = new mxCell('Extension point 1', new mxGeometry(0, 0, 140, 60), 'shape=note2;boundedLbl=1;whiteSpace=wrap;html=1;size=25;verticalAlign=top;align=left;spacingLeft=5;');
		    	cell.vertex = true;
		    	var label = new mxCell('Extend condition 1', new mxGeometry(0, 0, cell.geometry.width, 25), 'resizeWidth=1;part=1;strokeColor=none;fillColor=none;align=left;spacingLeft=5;');
		    	label.geometry.relative = true;
		    	label.vertex = true;
		    	cell.insert(label);
		
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Extension');
			}),
			this.addEntry('deployment target diagram', function()
			{
		    	var cell1 = new mxCell('DeploymentTarget1', new mxGeometry(0, 0, 130, 140), 'verticalAlign=top;align=left;shape=cube;size=10;direction=south;fontStyle=0;html=1;boundedLbl=1;spacingLeft=5;');
		    	cell1.vertex = true;
		    	var cell2 = new mxCell('Node1', new mxGeometry(0, 0, 100, 80), 'verticalAlign=top;align=center;shape=cube;size=10;direction=south;html=1;boundedLbl=1;spacingLeft=5;');
		    	cell2.geometry.relative = true;
		    	cell2.geometry.offset = new mxPoint(10, 50);
		    	cell2.vertex = true;
		    	cell1.insert(cell2);
		
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Deployment');
			}),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=middle;dashed=0;', 180, 60,
				   	'&lt;&lt;deployment spec&gt;&gt;<br><br><b>Deployment1</b>', 
				   	'Deployment Specification', null, null, dt + 'deployment specification'),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=middle;dashed=0;', 180, 60,
				   	'&lt;&lt;artifact&gt;&gt;<br><br><b>Artifact1</b>', 
				   	'Artifact', null, null, dt + 'artifact'),
			this.addEntry('information item', function()
			{
		    	var cell1 = new mxCell('InformationItem1', new mxGeometry(0, 0, 200, 50), 'align=left;spacingLeft=10;html=1;dashed=0;');
		    	cell1.vertex = true;
		    	var cell2 = new mxCell('', new mxGeometry(1, 0.5, 30, 20), 'shape=triangle;fillColor=strokeColor;');
		    	cell2.geometry.relative = true;
		    	cell2.geometry.offset = new mxPoint(-45, -10);
		    	cell2.vertex = true;
		    	cell1.insert(cell2);
		
				return sb.createVertexTemplateFromCells([cell1], cell1.geometry.width, cell1.geometry.height, 'Information item');
			}),
			this.addEntry('template binding', function()
			{
				var edge = new mxCell('&lt;&lt;bind&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=bottom;dashed=1;endFill=0;labelBackgroundColor=none;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
		    	var cell1 = new mxCell('Binding1 information', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=center;verticalAlign=top;labelBackgroundColor=none;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Template Binding');
			}),
		 	this.createEdgeTemplateEntry('endArrow=circlePlus;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;labelBackgroundColor=none;', 160, 0, '', 'Inner class', null, 'inner class'),
		 	this.createEdgeTemplateEntry('endArrow=open;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;dashed=1;labelBackgroundColor=none;', 160, 0, '&lt;&lt;keyword&gt;&gt;', 'Element / Package Merge / Package Import, Substitution', null, 'element package import substitution merge'),
		 	this.createEdgeTemplateEntry('endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;dashed=1;labelBackgroundColor=none;dashPattern=10 10;', 160, 0, '{constraint spec.}', 'Constraint', null, 'constraint'),
			this.addEntry('dependency', function()
			{
				var edge = new mxCell('&lt;&lt;keyword&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=bottom;dashed=1;endFill=0;labelBackgroundColor=none;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
		    	var cell1 = new mxCell('Dependency1', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=center;verticalAlign=top;labelBackgroundColor=none;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Dependency');
			}),
			this.addEntry('dependency', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(68, 38, 4, 4), 'ellipse;resizable=0;aspect=fixed;fillColor=strokeColor;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('&lt;&lt;keyword&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=bottom;dashed=1;endFill=0;labelBackgroundColor=none;spacingBottom=35;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				var edge2 = new mxCell('&lt;&lt;keyword&gt;&gt;', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;dashed=1;endFill=0;labelBackgroundColor=none;spacingTop=35;');
				edge2.geometry.setTerminalPoint(new mxPoint(0, 80), true);
				edge2.geometry.relative = true;
				edge2.edge = true;
				cell1.insertEdge(edge2, false);
				var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=bottom;dashed=1;endFill=0;labelBackgroundColor=none;spacingBottom=35;');
				edge3.geometry.setTerminalPoint(new mxPoint(140, 0), false);
				edge3.geometry.relative = true;
				edge3.edge = true;
				cell1.insertEdge(edge3, true);
				var edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;dashed=1;endFill=0;labelBackgroundColor=none;spacingTop=35;');
				edge4.geometry.setTerminalPoint(new mxPoint(140, 80), false);
				edge4.geometry.relative = true;
				edge4.edge = true;
				cell1.insertEdge(edge4, true);

				return sb.createEdgeTemplateFromCells([cell1, edge1, edge2, edge3, edge4], 140, 80, 'Dependency');
			}),
		 	this.createEdgeTemplateEntry('endArrow=block;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;dashed=1;labelBackgroundColor=none;', 160, 0, '', 'Realization', null, 'realization'),
			this.addEntry('generalization set', function()
			{
				var edge = new mxCell('GeneralizationSet1', new mxGeometry(0, 0, 0, 0), 'endArrow=block;html=1;rounded=0;align=center;verticalAlign=bottom;endFill=0;labelBackgroundColor=none;endSize=8;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
		    	var cell1 = new mxCell(':powertype {constraint1}', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=center;verticalAlign=top;labelBackgroundColor=none;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Generalization Set');
			}),
		 	this.createEdgeTemplateEntry('endArrow=none;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=3;', 160, 0, '', 'Association / Connector / Instance Specification / Property / Connector End', null, 'association connector instance specification property connector end'),
		 	this.createEdgeTemplateEntry('endArrow=open;startArrow=none;endFill=0;startFill=0;endSize=8;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=1;', 160, 0, '', 'Association / Connector / Instance Specification / Property / Connector End / Navigability notation', null, 'association connector instance specification property connector end navigability notation'),
		 	this.addEntry('association connector instance specification property connector end', function()
			{
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;startArrow=oval;startFill=1;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge1.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge1.geometry.relative = true;
				edge1.edge = true;
				
				return sb.createEdgeTemplateFromCells([edge1], 160, 0, 'Association / Connector / Instance Specification / Property / Connector End');
			}),
		 	this.createEdgeTemplateEntry('endArrow=none;startArrow=sysMLx;endFill=0;startFill=0;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=1;startSize=8;', 160, 0, '', 'Association / Connector / Instance Specification / Property / Connector End / Non-Navigability notation', null, 'association connector instance specification property connector end non navigability notation'),
		 	this.createEdgeTemplateEntry('endArrow=none;startArrow=diamondThin;endFill=0;startFill=0;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=1;startSize=8;endSize=8;', 160, 0, '', 'Association / Connector / Instance Specification / Property / Connector End / Shared Association', null, 'association connector instance specification property connector end shared'),
		 	this.createEdgeTemplateEntry('endArrow=none;startArrow=diamondThin;endFill=0;startFill=1;html=1;verticalAlign=bottom;labelBackgroundColor=none;strokeWidth=1;startSize=8;endSize=8;', 160, 0, '', 'Association / Connector / Instance Specification / Property / Connector End / Composite Association', null, 'association connector instance specification property connector end composite'),
			this.addEntry('association instance specification connector', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(60, 0, 20, 20), 'rhombus;aspect=fixed;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=bottom;labelBackgroundColor=none;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 10), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=bottom;labelBackgroundColor=none;');
				edge2.geometry.setTerminalPoint(new mxPoint(140, 10), false);
				edge2.geometry.relative = true;
				edge2.edge = true;
				cell1.insertEdge(edge2, true);

				return sb.createEdgeTemplateFromCells([cell1, edge1, edge2], 140, 20, 'Association / Instance Secification');
			}),
			this.addEntry('association instance specification connector', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(65, 0, 6, 12), 'triangle;aspect=fixed;fillColor=strokeColor;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=bottom;labelBackgroundColor=none;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 22), true);
				edge1.geometry.setTerminalPoint(new mxPoint(140, 22), false);
				edge1.geometry.relative = true;
				edge1.edge = true;
				
				return sb.createVertexTemplateFromCells([cell1, edge1], 140, 22, 'Association / Instance Secification');
			}),
			this.addEntry('Redefine', function()
			{
				var edge = new mxCell('{redefines}', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(200, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
		    	var cell1 = new mxCell('end1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=none;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
		    	var cell2 = new mxCell('0..1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;');
		    	cell2.geometry.relative = true;
		    	cell2.setConnectable(false);
		    	cell2.vertex = true;
		    	edge.insert(cell2);
		    	var cell3 = new mxCell('Association1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;');
		    	cell3.geometry.relative = true;
		    	cell3.setConnectable(false);
		    	cell3.vertex = true;
		    	edge.insert(cell3);
		    	var cell4 = new mxCell('{modifier1}', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=none;');
		    	cell4.geometry.relative = true;
		    	cell4.setConnectable(false);
		    	cell4.vertex = true;
		    	edge.insert(cell4);
				
				return sb.createEdgeTemplateFromCells([edge], 200, 0, 'Redefine');
			}),
			this.createVertexTemplateEntry('html=1;align=center;verticalAlign=middle;dashed=0;', 60, 30,
				   	'qualifier1', 
				   	'Qualifier', null, null, dt + 'qualifier'),
			this.addEntry('connector', function()
			{
				var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
		    	var cell1 = new mxCell('end1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=none;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
		    	var cell2 = new mxCell('0..1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=none;');
		    	cell2.geometry.relative = true;
		    	cell2.setConnectable(false);
		    	cell2.vertex = true;
		    	edge.insert(cell2);
		    	var cell3 = new mxCell('Connector1', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;');
		    	cell3.geometry.relative = true;
		    	cell3.setConnectable(false);
		    	cell3.vertex = true;
		    	edge.insert(cell3);
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Connector');
			}),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=oval;endFill=0;endSize=8;', 160, 0, '', 'Provided Interface', null, 'provided interface'),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=halfCircle;endFill=0;endSize=2;', 160, 0, '', 'Required Interface', null, 'required interface'),
		 	this.addEntry('structural feature', function()
			{
				var edge = new mxCell('feature1', new mxGeometry(-1, 0, 0, 0), 'html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=none;endFill=0;endSize=6;align=left;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Structural Feature');
			}),
			this.addEntry('usage', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(0, 0, 60, 30), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=none;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=halfCircle;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=2;');
				edge1.geometry.setTerminalPoint(new mxPoint(120, 15), false);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, true);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1], 120, 30, 'Usage');
			}),
			this.addEntry('collaboration', function()
			{
		    	var cell1 = new mxCell('Collaboration1', new mxGeometry(0, 0, 100, 30), 'ellipse;html=1;dashed=1;dashPattern=10 10;');
		    	cell1.vertex = true;
		    	var cell2 = new mxCell('Classifier1', new mxGeometry(10, 70, 80, 30), 'html=1;');
		    	cell2.vertex = true;
				var edge1 = new mxCell('ConnectableElement', new mxGeometry(0, 0, 0, 0), 'html=1;rounded=0;labelBackgroundColor=none;align=left;spacingLeft=5;endArrow=none;endFill=0;');
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, true);
				cell2.insertEdge(edge1, false);
				
				return sb.createEdgeTemplateFromCells([cell1, cell2, edge1], 100, 100, 'Collaboration');
			}),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;', 160, 0, '&lt;&lt;occurence&gt;&gt;', 'Collaboration Use', null, 'collaboration use'),
		 	this.addEntry('Extension', function()
			{
				var edge = new mxCell('{required}', new mxGeometry(-1, 0, 0, 0), 'html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=block;endFill=1;endSize=6;align=left;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Extension');
			}),
			this.addEntry('transition', function()
			{
				var edge = new mxCell('Transition1 spec.', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=bottom;endFill=0;labelBackgroundColor=none;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
		    	var cell1 = new mxCell('(via connectionPoint1)', new mxGeometry(0, 0, 0, 0), 'resizable=0;html=1;align=center;verticalAlign=top;labelBackgroundColor=none;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Transition');
			}),
			this.addEntry('activity', function()
			{
				var edge = new mxCell('{annotation1}', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
				edge.geometry.relative = true;
				edge.edge = true;
		    	var cell1 = new mxCell('Edge1', new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=none;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
		    	var cell2 = new mxCell('[guard]', new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=none;');
		    	cell2.geometry.relative = true;
		    	cell2.setConnectable(false);
		    	cell2.vertex = true;
		    	edge.insert(cell2);
				
				return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Activity');
			}),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=top;labelBackgroundColor=none;endArrow=open;endFill=0;', 160, 0, '&lt;&lt;multicast/multireceive&gt;&gt;', 'Control Flow', null, 'control flow'),
			this.addEntry('action', function()
			{
		    	var cell1 = new mxCell('Action1', new mxGeometry(0, 5, 100, 30), 'html=1;rounded=1;absoluteArcSize=1;arcSize=10;');
		    	cell1.vertex = true;
		    	var cell2 = new mxCell('Action2', new mxGeometry(180, 5, 100, 30), 'html=1;rounded=1;absoluteArcSize=1;arcSize=10;');
		    	cell2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'html=1;rounded=0;labelBackgroundColor=none;align=left;spacingLeft=5;endArrow=open;endFill=0;');
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, true);
				cell2.insertEdge(edge1, false);
		    	var cell3 = new mxCell('', new mxGeometry(132, 0, 16, 16), 'html=1;');
		    	cell3.vertex = true;
				
				return sb.createEdgeTemplateFromCells([cell1, cell2, cell3, edge1], 300, 35, 'Action');
			}),
			this.addEntry('object node', function()
			{
		    	var cell1 = new mxCell('ObjectNode1', new mxGeometry(40, 0, 80, 30), 'html=1;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=block;html=1;rounded=0;align=center;verticalAlign=top;endFill=1;labelBackgroundColor=none;endSize=6;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 15), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1], 120, 30, 'Object Node');
			}),
			this.addEntry('activity', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(40, 0, 30, 30), 'ellipse;html=1;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 15), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1], 70, 30, 'Activity');
			}),
			this.addEntry('activity', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(0, 0, 30, 30), 'ellipse;html=1;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;');
				edge1.geometry.setTerminalPoint(new mxPoint(70, 15), false);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, true);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1], 70, 30, 'Activity');
			}),
		 	this.createEdgeTemplateEntry('shape=mxgraph.lean_mapping.electronic_info_flow_edge;html=1;', 160, 0, '', 'Activity', null, 'activity'),
			this.addEntry('activity', function()
			{
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 40), true);
				edge1.geometry.setTerminalPoint(new mxPoint(160, 40), false);
				edge1.geometry.relative = true;
				edge1.edge = true;
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'shape=mxgraph.lean_mapping.electronic_info_flow_edge;html=1;');
				edge2.geometry.setTerminalPoint(new mxPoint(60, 0), true);
				edge2.geometry.setTerminalPoint(new mxPoint(100, 20), false);
				edge2.geometry.relative = true;
				edge2.edge = true;
				
				return sb.createEdgeTemplateFromCells([edge1, edge2], 70, 30, 'Activity');
			}),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;', 160, 0, 'Message1 label', 'Message', null, 'message async asynchronous signal call'),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=block;endFill=1;', 160, 0, '', 'Message, synchronous call', null, 'message sync synchronous call'),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=block;endFill=1;dashed=1;', 160, 0, '', 'Message, reply', null, 'message reply'),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;', 160, 0, '', 'Message, create', null, 'message create'),
			this.addEntry('message lost', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(160, 0, 4, 4), 'ellipse;html=1;fillColor=strokeColor;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 2), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1], 164, 4, 'Message lost');
			}),
			this.addEntry('message found', function()
			{
		    	var cell1 = new mxCell('', new mxGeometry(0, 0, 4, 4), 'ellipse;html=1;fillColor=strokeColor;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;');
				edge1.geometry.setTerminalPoint(new mxPoint(164, 2), false);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, true);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1], 164, 4, 'Message found');
			}),
		 	this.addEntry(dt + 'lifeline execution', function()
			{
		 		var cell1 = new mxCell('', new mxGeometry(0, 0, 160, 160),
		 			'rounded=0;dashed=0;container=0;collapsible=0;recursiveResize=0;');
				cell1.vertex = true;
		 		var cell2 = new mxCell('LifeLine1', new mxGeometry(30, 10, 100, 30),
		 			'rounded=0;dashed=0;');
				cell2.vertex = true;
				cell1.insert(cell2);
		 		var cell3 = new mxCell('', new mxGeometry(75, 60, 10, 60),
		 			'rounded=0;dashed=0;');
				cell3.vertex = true;
				cell1.insert(cell3);
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;startArrow=none;endArrow=none;dashed=1;');
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell2.insertEdge(edge1, false);
				cell3.insertEdge(edge1, true);
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;startArrow=none;endArrow=none;dashed=1;');
				edge2.geometry.setTerminalPoint(new mxPoint(80, 150), true);
				edge2.geometry.relative = true;
				edge2.edge = true;
				cell3.insertEdge(edge2, false);
				var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'html=1;verticalAlign=bottom;startArrow=none;endArrow=open;endFill=0;');
				edge3.geometry.setTerminalPoint(new mxPoint(0, 60), true);
				edge3.geometry.setTerminalPoint(new mxPoint(75, 60), false);
				edge3.geometry.relative = true;
				edge3.edge = true;
				cell1.insert(edge1);
				cell1.insert(edge2);
				cell1.insert(edge3);
				
				return sb.createVertexTemplateFromCells([cell1], 160, 160, 'Lifeline'); 
			}),
			this.addEntry('message', function()
			{
		    	var cell1 = new mxCell('Message1', new mxGeometry(40, 0, 80, 30), 'html=1;rounded=1;absoluteArcSize=1;arcSize=10;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 15), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1], 120, 30, 'Message');
			}),
			this.addEntry('message', function()
			{
		    	var cell1 = new mxCell('Message1', new mxGeometry(0, 0, 80, 30), 'html=1;rounded=1;absoluteArcSize=1;arcSize=10;');
		    	cell1.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=open;html=1;rounded=0;align=center;verticalAlign=top;endFill=0;labelBackgroundColor=none;endSize=6;');
				edge1.geometry.setTerminalPoint(new mxPoint(120, 15), false);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, true);
				
				return sb.createEdgeTemplateFromCells([cell1, edge1], 120, 30, 'Message');
			}),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;', 160, 0, '&lt;&lt;extend&gt;&gt;', 'Extend', null, 'extend'),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;', 160, 0, '&lt;&lt;include&gt;&gt;', 'Include', null, 'include'),
		 	this.createEdgeTemplateEntry('html=1;verticalAlign=bottom;labelBackgroundColor=none;endArrow=open;endFill=0;dashed=1;', 160, 0, '&lt;&lt;deploy&gt;&gt;', 'Deploy', null, 'deploy')
		];
		
   		this.addPalette('uml25', mxResources.get('uml') + ' 2.5', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
   		
		this.setCurrentSearchEntryLibrary();
	};
	
})();
