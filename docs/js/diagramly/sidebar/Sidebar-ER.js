(function()
{
	// Adds ER shapes
	Sidebar.prototype.addErPalette = function()
	{
		// Avoids having to bind all functions to "this"
		var sb = this;

		// Reusable cells
		var row = new mxCell('Row', new mxGeometry(0, 0, 40, 26), 'text;html=1;strokeColor=none;fillColor=none;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
		row.vertex = true;

		// Predefined dimensions
		var w = 100;
		var h = 100;
		
		// Default tags
		var dt = 'er entity relation ';
		
		var fns = [
	   		this.addEntry(dt + 'table', function()
			{
				var cell = new mxCell('Table', new mxGeometry(0, 0, 160, 110),
			    	'swimlane;html=1;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#e0e0e0;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
				cell.vertex = true;
				cell.insert(sb.cloneCell(row, 'Row 1'));
				cell.insert(sb.cloneCell(row, 'Row 2'));
				cell.insert(sb.cloneCell(row, 'Row 3'));
		
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Table');
			}),
	   	 	this.addEntry(dt + 'table section subsection', function()
	   		{
				var cell = new mxCell('Section', new mxGeometry(0, 0, 140, 110),
		    		'swimlane;html=1;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=22;fillColor=none;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
				cell.vertex = true;

				cell.insert(sb.cloneCell(row, 'Row 1'));
				cell.insert(sb.cloneCell(row, 'Row 2'));
				cell.insert(sb.cloneCell(row, 'Row 3'));
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Section'); 
	   		}),
	   	 	this.addEntry(dt + 'table section subsection', function()
	   		{
				var cell = new mxCell('Table', new mxGeometry(0, 0, 160, 144),
			    	'swimlane;html=1;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#e0e0e0;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
				cell.vertex = true;
				
	   			var cell1 = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 30), 'shape=partialRectangle;top=0;left=0;right=0;bottom=1;html=1;align=left;verticalAlign=middle;fillColor=none;spacingLeft=34;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontStyle=5;');
	   			cell1.vertex = true;

	   			var cell11 = sb.cloneCell(row, 'PK');
	   			cell11.connectable = false;
	   			cell11.style = 'shape=partialRectangle;top=0;left=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell11.geometry.width = 30;
	   			cell11.geometry.height = 30;
	   			cell1.insert(cell11);
	   			cell.insert(cell1);
	   			
	   			var cell2 = new mxCell('row 1', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;html=1;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell2.vertex = true;

	   			var cell21 = sb.cloneCell(row, '');
	   			cell21.connectable = false;
	   			cell21.style = 'shape=partialRectangle;top=0;left=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell21.geometry.width = 30;
	   			cell2.insert(cell21);
	   			cell.insert(cell2);
	   			
	   			cell2 = sb.graph.cloneCells([cell2])[0];
	   			cell2.value = 'row 2';
	   			cell.insert(cell2);
	   			
	   			cell2 = sb.graph.cloneCells([cell2])[0];
	   			cell2.value = 'row 3';
	   			cell.insert(cell2);
	   			
	   			cell2 = sb.graph.cloneCells([cell2])[0];
	   			cell2.value = '';
	   			cell2.children[0].geometry.height = 10;
	   			cell2.geometry.height = 10;
	   			cell.insert(cell2);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'ER Table 1'); 
	   		}),
	   	 	this.addEntry(dt + 'table section subsection', function()
	   		{
				var cell = new mxCell('Table', new mxGeometry(0, 0, 160, 112),
			    	'swimlane;html=1;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#e0e0e0;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
				cell.vertex = true;
				
	   			var cell1 = new mxCell('row 1', new mxGeometry(0, 0, 90, 30), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;html=1;align=left;verticalAlign=middle;fillColor=none;spacingLeft=60;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontStyle=5;');
	   			cell1.vertex = true;

	   			var cell11 = sb.cloneCell(row, 'PK,FK1');
	   			cell11.connectable = false;
	   			cell11.style = 'shape=partialRectangle;fontStyle=1;top=0;left=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell11.geometry.width = 56;
	   			cell11.geometry.height = 30;
	   			cell1.insert(cell11);
	   			cell.insert(cell1);
	   			
	   			var cell1 = new mxCell('row 2', new mxGeometry(0, 0, 90, 30), 'shape=partialRectangle;top=0;left=0;right=0;bottom=1;html=1;align=left;verticalAlign=middle;fillColor=none;spacingLeft=60;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontStyle=5;');
	   			cell1.vertex = true;

	   			var cell11 = sb.cloneCell(row, 'PK,FK2');
	   			cell11.connectable = false;
	   			cell11.style = 'shape=partialRectangle;fontStyle=1;top=0;left=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell11.geometry.width = 56;
	   			cell11.geometry.height = 30;
	   			cell1.insert(cell11);
	   			cell.insert(cell1);
	   			
	   			var cell2 = new mxCell('row 1', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;html=1;align=left;verticalAlign=top;fillColor=none;spacingLeft=60;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell2.vertex = true;

	   			var cell21 = sb.cloneCell(row, '');
	   			cell21.connectable = false;
	   			cell21.style = 'shape=partialRectangle;top=0;left=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell21.geometry.width = 56;
	   			cell2.insert(cell21);
	   			cell.insert(cell2);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'ER Table 2'); 
	   		}),
			this.addEntry(dt + 'table row', function()
			{
				return sb.createVertexTemplateFromCells([row.clone()], row.geometry.width, row.geometry.height, 'Row 1');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, 'PK');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;right=0;html=1;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 2');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=1;html=1;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, 'PK');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 3');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('row', new mxGeometry(0, 0, 120, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;html=1;align=left;verticalAlign=top;fillColor=none;spacingLeft=60;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, '');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;fontStyle=1;top=0;left=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 56;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 4');
			}),
			this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;html=1;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, 'PK');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 5');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;html=1;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, '');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;html=1;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 6');
			}),
			this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;html=1;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, '');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;right=0;html=1;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 7');
			}),
			this.addEntry(dt + 'table row divider hline line separator', function()
			{
				var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;html=1;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
				divider.vertex = true;
				
				return sb.createVertexTemplateFromCells([divider], divider.geometry.width, divider.geometry.height, 'Divider');
			}),
			this.addEntry(dt + 'table row spacer space gap separator', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 20, 14), 'text;html=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=4;spacingRight=4;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
				cell.vertex = true;
				
				return sb.createVertexTemplateFromCells([cell.clone()], cell.geometry.width, cell.geometry.height, 'Spacer');
			}),
			this.createVertexTemplateEntry('text;html=1;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;strokeColor=#000000;fillColor=#e0e0e0;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;',
				80, 26, 'Title', 'Title', null, null, 'er entity relation table title label'),
	   		this.addEntry(dt + 'table', function()
			{
	   			var cell = new mxCell('Entity', new mxGeometry(0, 0, 160, 120),
	   		    	'swimlane;html=1;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;fillColor=#008cff;fontColor=#FFFFFF;rounded=1;fontSize=17;fontStyle=0;strokeWidth=2;resizeParent=0;resizeLast=1;shadow=0;dashed=0;align=center;');
	   			cell.vertex = true;
	   			
	   			var cell1 = new mxCell('+Attribute1\n+Attribute2\n+Attribute3', new mxGeometry(0, 30, 160, 90), 'whiteSpace=wrap;html=1;align=left;strokeColor=none;fillColor=none;spacingLeft=4;fontSize=17;verticalAlign=top;resizable=0;rotatable=0;part=1;');
	   			cell1.vertex = true;

				cell.insert(cell1);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Entity 2');
			}),
			this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;margin=10;strokeWidth=2;fontSize=17;whiteSpace=wrap;html=1;align=center;', w, h, 'Attribute', 'Attribute', null, null, dt + 'attribute'),
			this.createVertexTemplateEntry('ellipse;shape=cloud;strokeWidth=2;fontSize=17;whiteSpace=wrap;html=1;align=center;', w, h, 'Cloud', 'Cloud', null, null, dt + 'cloud'),
			this.createVertexTemplateEntry('strokeWidth=2;rounded=1;arcSize=10;whiteSpace=wrap;html=1;align=center;', w, h, 'Entity', 'Entity 3', null, null, dt),
			this.createVertexTemplateEntry('strokeWidth=2;whiteSpace=wrap;html=1;align=center;', w, h, 'Entity', 'Entity 4', null, null, dt),
			this.createVertexTemplateEntry('shape=ext;strokeWidth=2;margin=10;double=1;whiteSpace=wrap;html=1;align=center;', w, h, 'Entity', 'Entity 5', null, null, dt),
			this.createVertexTemplateEntry('shape=rhombus;strokeWidth=2;fontSize=17;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;align=center;', w, h, 'Has', 'Has', null, null, dt + 'has'),
			this.createVertexTemplateEntry('shape=rhombus;double=1;strokeWidth=2;fontSize=17;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;align=center;', w, h, 'Has', 'Has', null, null, dt + 'has'),
	   	 	this.addEntry(dt + 'hierarchy', function()
	   		{
			   	var cell = new mxCell('', new mxGeometry(0, 0, 100, 100), 'html=1;strokeWidth=2;shape=mxgraph.er.rrect;rSize=5;');
			   	cell.vertex = true;
			   	
			   	var cell1 = new mxCell('main', new mxGeometry(0, 0, 50, 100), 'html=1;strokeWidth=2;shape=mxgraph.er.anchor;fontSize=17;whiteSpace=wrap;');
			   	cell1.vertex = true;
			   	cell.insert(cell1);
			   	
			   	var cell2 = new mxCell('sub', new mxGeometry(50, 5, 45, 90), 'html=1;strokeWidth=2;shape=mxgraph.er.rrect;rSize=5;fontSize=17;whiteSpace=wrap;points=[];');
			   	cell2.vertex = true;
			   	cell.insert(cell2);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Hierarchy'); 
	   		}),
			this.createVertexTemplateEntry('shape=note;strokeWidth=2;fontSize=17;size=20;whiteSpace=wrap;html=1;', w, h, 'Note', 'Note', null, null, dt + 'note'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERzeroToMany;endFill=1;', w, h, '', '0 to Many Optional', null, dt + 'zero many optional'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERoneToMany;', w, h, '', '1 to Many', null, dt + 'one many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERmandOne;', w, h, '', '1 Mandatory', null, dt + 'one mandatory'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERmandOne;startArrow=ERmandOne;', w, h, '', '1 to 1', null, dt + 'one'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERone;endFill=1;', w, h, '', '1', null, dt + 'one'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERzeroToOne;endFill=1;', w, h, '', '0 to 1', null, dt + 'zero one'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERmany;', w, h, '', 'Many', null, dt + 'many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERmany;startArrow=ERmany;', w, h, '', 'Many to Many', null, dt + 'many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERzeroToMany;startArrow=ERzeroToOne;', w, h, '', '1 Optional to Many Optional', null, dt + 'one optional many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERzeroToMany;startArrow=ERmandOne;', w, h, '', '1 Mandatory to Many Optional', null, dt + 'one mandatory many optional'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERzeroToOne;startArrow=ERmandOne;', w, h, '', '1 Mandatory to 1 Optional', null, dt + 'one mandatory optional'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERoneToMany;startArrow=ERmandOne;', w, h, '', '1 Mandatory to Many Mandatory', null, dt + 'one mandatory many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERoneToMany;startArrow=ERzeroToOne;', w, h, '', '1 Optional to Many Mandatory', null, dt + 'one optional mandatory many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERoneToMany;startArrow=ERoneToMany;', w, h, '', 'Many Mandatory to Many Mandatory', null, dt + 'mandatory many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERoneToMany;startArrow=ERzeroToMany;', w, h, '', 'Many Optional to Many Mandatory', null, dt + 'mandatory many optional'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;html=1;endArrow=ERzeroToMany;endFill=1;startArrow=ERzeroToMany;', w, h, '', 'Many Optional to Many Optional', null, dt + 'many optional')
	 	];

		this.addPaletteFunctions('er', mxResources.get('entityRelation'), false, fns);
	};

})();
