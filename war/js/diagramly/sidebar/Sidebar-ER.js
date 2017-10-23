(function()
{
	// Adds ER shapes
	Sidebar.prototype.addErPalette = function()
	{
		// Avoids having to bind all functions to "this"
		var sb = this;

		// Reusable cells
		var row = new mxCell('Row', new mxGeometry(0, 0, 40, 26), 'text;strokeColor=none;fillColor=none;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
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
			    	'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#e0e0e0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
				cell.vertex = true;
				cell.insert(sb.cloneCell(row, 'Row 1'));
				cell.insert(sb.cloneCell(row, 'Row 2'));
				cell.insert(sb.cloneCell(row, 'Row 3'));
		
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Table');
			}),
	   	 	this.addEntry(dt + 'table section subsection', function()
	   		{
				var cell = new mxCell('Section', new mxGeometry(0, 0, 140, 110),
		    		'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=22;fillColor=none;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
				cell.vertex = true;

				cell.insert(sb.cloneCell(row, 'Row 1'));
				cell.insert(sb.cloneCell(row, 'Row 2'));
				cell.insert(sb.cloneCell(row, 'Row 3'));
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Section'); 
	   		}),
			this.addDataEntry(dt + 'table section subsection', 160, 144, 'ER Table 1',
				'7Zhtb9owEMc/Td5OdkzoeLmkazWNSlXpF3ASk1h17MwxA/rpd06cAg0IVIJYq0CQ7DufH+53f0XYI1Gxute0zB9UyoRHfnok0kqZplWsIiaE5yOeeuTW830EP8+/O+DFtReVVDNpTgnwm4C/VCxYY3mmsWCNtTJr4azVkheCSuiFcyXNzHkQ9JOci3RK12phV6wMTV7aXpgrzV9hPIWD3WIwgFubGX+1wf7YzsaFiJRQul6HMGS/O5EzO6NbS7MKYh/b4+F3pge62hk4pZVpd6mEoGXF43rfNrCgOuMyVMaowg1qT3m3u6l5/QE/FTyTYEtgLQbO0GWPacNWBwnUJpf+e6YKZvQahix5anI3YtxQQjnjWd6GjUaNkVaNIXuL3QCFhmO6ny/p8F1I/mfBfqVdxDktbRO2bjgVTywxVGbWGxpVugwJNm8zqt1WbTtus4i3stSMDW12eELFD2cueJrWs26jl6quraqkCZfZtFmFjDamJ7eaNSmYci7UEro5TMak3Y0y1ND4rSpLxaWpExeE8EB+I/Qt8AI4aQR9vOnDY4drEylZGU15zY1B6SyZLZ8w1ap8hmJh7Wm3FRCcWgX+0SqY7CkCgs6vgVGnBh5/n00/3tbNHpKnFsEu8d6AH2Nqj+nK9SC9RElp0xC3OUJdquQoVXIhqkGHqoYE+QhfRtjoONN6ss+r6guqGN50Z/Med3hfW8MN708u4OBDAu4D6M0BAZ/PdRDw/yjg74OALyHgm6sJeHJAwGQQ8JcUMEaDgi+h4MnVFIxx/0QH7fatXdzDvyXcvegatNuDdvHxy6194v0AUuhurkVr386t6T8='),
			this.addDataEntry(dt + 'table section subsection', 160, 112, 'ER Table 2',
				'7VfbbuIwEP2avK5yIXT3cROWPpRKVekPDIlJrDqeyHEL9Ot37DiFLETQUrStVAiSPTd75pwjFC9Kq/W1grq8xZwJL/rjRalC1O2qWqdMCC/0ee5FEy8Mffp54XTAG1ivX4NiUp+SELYJzyCeWGt5gIVgrbXRG+GszYpXAiTtkiVKPXcen/ZZyUU+gw0+mRMbDdljt0tKVPyF4oEamwRkILfSc/5iksOxqcaFSFGgsudEzDffXubcVHRnKdZQ7l3XXvCP6RbWvcAZNLq7JQoBdcMX9t4msQJVcJmg1li5oK7Laf9SS/shPwheSLJldBYjZ+Kmx5Rm60EErMmN/5phxbTaUMiK57p0EeMWJb9kvCi7tMCBA01rKF5zt4DSwmF6GN9oD1+FKzIE+wiXUJsl3VxzEPcs0yAL40001m5Agi27gSp3U7Ne7A6xG1Ibm5jh8AzEb2eueJ7bqrvIS7TUamrIuCxm7Sljf2u6d6eNyIRUcimojWhSUjEmzW1Qg4bFKylr5FLbucUJPTTe1P8RezF1mtI+2O7pMeFKpygbrYBb2BgxZ8UMe5JcYf1AXGFdt7sCiE8lQXiUBL8OcCDyz6fAaI8CdzfU/vTmTRzYbToY4kSPBwfwPZUafR6MPooGx5A2bbv2BjHNUEozlkU3M38f6+go1vH4MljHA3IPLyP34Fvun07u4yG5v4kD33I/Xe7xf5P71af7d7fFvq7WL6jtTpjn4P1zD++zgT5Twy3eX1zAV+8S8DsApe321c76em9+fwE='),
				
			this.addEntry(dt + 'table row', function()
			{
				return sb.createVertexTemplateFromCells([row.clone()], row.geometry.width, row.geometry.height, 'Row 1');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;fillColor=none;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, 'PK');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;right=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 2');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=1;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, 'PK');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 3');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('row', new mxGeometry(0, 0, 120, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;fillColor=none;spacingLeft=60;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, '');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;fontStyle=1;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 56;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 4');
			}),
			this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, 'PK');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 5');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, '');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 6');
			}),
			this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, '');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;right=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 7');
			}),
			this.addEntry(dt + 'table row divider hline line separator', function()
			{
				var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
				divider.vertex = true;
				
				return sb.createVertexTemplateFromCells([divider], divider.geometry.width, divider.geometry.height, 'Divider');
			}),
			this.addEntry(dt + 'table row spacer space gap separator', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 20, 14), 'text;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=4;spacingRight=4;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
				cell.vertex = true;
				
				return sb.createVertexTemplateFromCells([cell.clone()], cell.geometry.width, cell.geometry.height, 'Spacer');
			}),
			this.createVertexTemplateEntry('text;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;strokeColor=#000000;fillColor=#e0e0e0;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;',
				80, 26, 'Title', 'Title', null, null, 'er entity relation table title label'),
	   		this.addEntry(dt + 'table', function()
			{
	   			var cell = new mxCell('Entity', new mxGeometry(0, 0, 160, 120),
	   		    	'swimlane;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;fillColor=#008cff;fontColor=#FFFFFF;rounded=1;fontSize=17;fontStyle=0;strokeWidth=2;resizeParent=0;resizeLast=1;shadow=0;dashed=0;align=center;');
	   			cell.vertex = true;
	   			
	   			var cell1 = new mxCell('+Attribute1\n+Attribute2\n+Attribute3', new mxGeometry(0, 30, 160, 90),
	   				'align=left;strokeColor=none;fillColor=none;spacingLeft=4;fontSize=17;verticalAlign=top;resizable=0;rotatable=0;part=1;');
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
			   	
			   	var cell2 = new mxCell('sub', new mxGeometry(50, 5, 45, 90), 'html=1;strokeWidth=2;shape=mxgraph.er.rrect;rSize=5;fontSize=17;whiteSpace=wrap;points=[];strokeColor=inherit;fillColor=inherit;');
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
