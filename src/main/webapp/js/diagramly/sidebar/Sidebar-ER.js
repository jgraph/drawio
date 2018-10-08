(function()
{
	// Adds ER shapes
	Sidebar.prototype.addErPalette = function()
	{
		// Avoids having to bind all functions to "this"
		var sb = this;

		// Reusable cells
		var row = new mxCell('Row', new mxGeometry(0, 0, 40, 26), 'text;strokeColor=none;fillColor=none;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;');
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
			    	'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#e0e0e0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;fontSize=14;');
				cell.vertex = true;
				cell.insert(sb.cloneCell(row, 'Row 1'));
				cell.insert(sb.cloneCell(row, 'Row 2'));
				cell.insert(sb.cloneCell(row, 'Row 3'));
		
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Table');
			}),
	   	 	this.addEntry(dt + 'table section subsection', function()
	   		{
				var cell = new mxCell('Section', new mxGeometry(0, 0, 140, 110),
		    		'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=22;fillColor=none;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;fontSize=14;');
				cell.vertex = true;

				cell.insert(sb.cloneCell(row, 'Row 1'));
				cell.insert(sb.cloneCell(row, 'Row 2'));
				cell.insert(sb.cloneCell(row, 'Row 3'));
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Section'); 
	   		}),
			this.addDataEntry(dt + 'table section subsection', 160, 144, 'ER Table 1',
				'7ZjbbqMwEIafhtuVDSHdXBZ60GpTqWr6AgYcsNbYrHE2SZ9+x8a0SUmURCnZdkUOEjMeH2bm44+CF8Tl6l6RqniQGeVecOuhaw9NvCBWUuo327rKVUw593zEMi+48Xwfwdfz7w6FYRuGKqKo0CfN9JuZfwhf0MbzTBJOG2+t19x56yUrORFgRXMp9MyNILDTgvFsStZyYbauNUl/tVZUSMVeIJ5A5jcYHDCs9Iy9mMn+2KzGOI8ll8ruE1Bk3lszZ2ZFt5eiNcx9bPPE71wPZLUVOCW1bk8pOSdVzRJ7bjOxJCpnIpJay9IFtVnebR9qbl8wTjjLBfhS2IuqthZNNngEtqsmVZqu9rbGujb74lpzT2VJtVpD+JJlunDR46aVqKAsL9olRqPGSerGkb/O3dF18LjGH6Ah6NCwEOz3gv7IukAUpDKXkJhmhD/RVBORm9FIy8rVk9N5W3/lDm+uk7bmeKOmTWxkasdSwq+du2RZZlfdBEVIS2JdkZSJfNrsEozeXE9uN+OSsOScyyWYBSxGhTmN1EST5JXhSjKhbSnDCD5Q8Rh9C70QMo3Bxm82fEy40rEUtVaE2a5SAG1JDWxRpmT1DGjRNtvN+yV8x4x/LDP+ScxMdiAToD6IGXWIefx5NivJ5j25o+/HIrPNx4fhcYgAk6aD++hep1IIU5akrRnqMhCcxEBwMQbCDgMKyukj3I9ooMME2MW+uGJcXiHg97gHOsYdOv61PjR0/GfiEJ4tDv20/2qPOJxPwSAOX18cvg/icAlxuPqk4jDZIw7BIA6DOPgYDepwCXWYfFJ1wPjj+z/owiV1AffyfxN3H1oOutCDLuDTHlTuEoZzAbDOjQflLmjrgfpf'),
			this.addDataEntry(dt + 'table section subsection', 160, 112, 'ER Table 2',
				'7ZdRb+IwDIB/TV9Pabuy2+Najj2MSdPYHzBtaKNLkyrNDtivPydNRjtAwLFN22lQpNqxndj+atEgzurVjYKmupMF5UH8KyDXAbkK4kxJqTeyVdWrjHIeRIQVQTwOoojgL4gmh8xCa0YaUFTokzyjzvMP8CfaaR5hzmmnbfWaO227ZDUHgVK6kELP3ApBOa8YL6awlk9m61ZD/ttLaSUVe0Z7wMzHISpwWekZezbO0chEY5xnkktl94kpMd+B58xEdHsp2qLvvc8zfKW6g9XAcAqt9qeUnEPTsrk9t3GsQZVMpFJrWTsjn+VkeKiF/eA6cFYK1OW4F1W+Fl024QXKrppUabra2xqr6vfFteaGyppqtUbzJSt05axHXStJRVlZ+RChaxy0naJ88d3RddS4xh+gId6iQcklKsJtHipozC3mpRnwB5prEKVZTbVsXDk5XfjyK3d2cz/vl9yXtLNNTelYDvzaqWtWFDZqnxMhLYhtAzkT5bTbZUQ2qge3m2mJxJALjmnE4wqDUWFOIzVomL8g3EgmtK1kkuKFBc/IjyRIMNMM5XAj42XMlc6kaLUCZptKkbMlNaylhZLNI5JFfbb9xyV5hUx0LDLRSchc7SAmJu8BzMUWMPe3WKzJ7UnE9EsU7iNoQM0OGo4FaUjNxVtBc4gLk7ZL72gCcimEKdPc15BskxGfREYy+igykj2jJHqfURJ+j5IvPkpG+0bJScR8j5J/HyXJJx0ll5/uX4kN9sXnyMfPDf+Ivy0dP7foOBuLM+dDR8d/Nhwuzx4O57bfKnsvzc5o8HL9Fw=='),
				
			this.addEntry(dt + 'table row', function()
			{
				return sb.createVertexTemplateFromCells([row.clone()], row.geometry.width, row.geometry.height, 'Row 1');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;fillColor=none;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontSize=12;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, 'PK');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;right=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;fontSize=12;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 2');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=1;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontSize=12;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, 'PK');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;fontSize=12;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 3');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('row', new mxGeometry(0, 0, 120, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;fillColor=none;spacingLeft=60;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontSize=12;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, '');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;fontStyle=1;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;fontSize=12;'
	   			cell1.geometry.width = 56;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 4');
			}),
			this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontSize=12;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, 'PK');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;fontSize=12;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 5');
			}),
	   		this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontSize=12;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, '');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;fontSize=12;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 6');
			}),
			this.addEntry(dt + 'table row', function()
			{
	   			var cell = new mxCell('uniqueId', new mxGeometry(0, 0, 90, 26), 'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;fontSize=12;');
	   			cell.vertex = true;

	   			var cell1 = sb.cloneCell(row, '');
	   			cell1.connectable = false;
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;right=0;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;fontSize=12;'
	   			cell1.geometry.width = 30;
	   			cell.insert(cell1);
	   			
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Row 7');
			}),
			this.addEntry(dt + 'table row divider hline line separator', function()
			{
				var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;fontSize=12;');
				divider.vertex = true;
				
				return sb.createVertexTemplateFromCells([divider], divider.geometry.width, divider.geometry.height, 'Divider');
			}),
			this.addEntry(dt + 'table row spacer space gap separator', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 20, 14), 'text;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=4;spacingRight=4;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;fontSize=12;');
				cell.vertex = true;
				
				return sb.createVertexTemplateFromCells([cell.clone()], cell.geometry.width, cell.geometry.height, 'Spacer');
			}),
			this.createVertexTemplateEntry('text;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;strokeColor=#000000;fillColor=#e0e0e0;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=14;',
				80, 26, 'Title', 'Title', null, null, 'er entity relation table title label'),
	   		this.addEntry(dt + 'table', function()
			{
	   			var cell = new mxCell('Entity', new mxGeometry(0, 0, 160, 120),
	   		    	'swimlane;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;fillColor=#008cff;fontColor=#FFFFFF;rounded=1;fontSize=14;fontStyle=0;strokeWidth=2;resizeParent=0;resizeLast=1;shadow=0;dashed=0;align=center;');
	   			cell.vertex = true;
	   			
	   			var cell1 = new mxCell('+Attribute1\n+Attribute2\n+Attribute3', new mxGeometry(0, 30, 160, 90),
	   				'align=left;strokeColor=none;fillColor=none;spacingLeft=4;fontSize=12;verticalAlign=top;resizable=0;rotatable=0;part=1;');
	   			cell1.vertex = true;

				cell.insert(cell1);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Entity 2');
			}),
			this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;margin=10;strokeWidth=2;fontSize=14;whiteSpace=wrap;html=1;align=center;', w, h, 'Attribute', 'Attribute', null, null, dt + 'attribute'),
			this.createVertexTemplateEntry('ellipse;shape=cloud;strokeWidth=2;fontSize=14;whiteSpace=wrap;html=1;align=center;', w, h, 'Cloud', 'Cloud', null, null, dt + 'cloud'),
			this.createVertexTemplateEntry('strokeWidth=2;rounded=1;arcSize=10;whiteSpace=wrap;html=1;align=center;fontSize=14;', w, h, 'Entity', 'Entity 3', null, null, dt),
			this.createVertexTemplateEntry('strokeWidth=2;whiteSpace=wrap;html=1;align=center;fontSize=14;', w, h, 'Entity', 'Entity 4', null, null, dt),
			this.createVertexTemplateEntry('shape=ext;strokeWidth=2;margin=10;double=1;whiteSpace=wrap;html=1;align=center;fontSize=14;', w, h, 'Entity', 'Entity 5', null, null, dt),
			this.createVertexTemplateEntry('shape=rhombus;strokeWidth=2;fontSize=17;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;align=center;fontSize=14;', w, h, 'Has', 'Has', null, null, dt + 'has'),
			this.createVertexTemplateEntry('shape=rhombus;double=1;strokeWidth=2;fontSize=17;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;align=center;fontSize=14;', w, h, 'Has', 'Has', null, null, dt + 'has'),
	   	 	this.addEntry(dt + 'hierarchy', function()
	   		{
			   	var cell = new mxCell('', new mxGeometry(0, 0, 100, 100), 'rounded=1;absoluteArcSize=1;html=1;strokeWidth=2;arcSize=10;fontSize=14;');
			   	cell.vertex = true;
			   	
			   	var cell1 = new mxCell('main', new mxGeometry(0, 0, 50, 100), 'html=1;strokeWidth=2;shape=mxgraph.er.anchor;fontSize=14;whiteSpace=wrap;');
			   	cell1.vertex = true;
			   	cell.insert(cell1);
			   	
			   	var cell2 = new mxCell('sub', new mxGeometry(50, 5, 45, 90), 'rounded=1;absoluteArcSize=1;html=1;strokeWidth=2;arcSize=10;fontSize=14;whiteSpace=wrap;points=[];strokeColor=inherit;fillColor=inherit;');
			   	cell2.vertex = true;
			   	cell.insert(cell2);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Hierarchy'); 
	   		}),
			this.createVertexTemplateEntry('shape=note;strokeWidth=2;fontSize=14;size=20;whiteSpace=wrap;html=1;', w, h, 'Note', 'Note', null, null, dt + 'note'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToMany;endFill=1;', w, h, '', '0 to Many Optional', null, dt + 'zero many optional'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERoneToMany;', w, h, '', '1 to Many', null, dt + 'one many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERmandOne;', w, h, '', '1 Mandatory', null, dt + 'one mandatory'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERmandOne;startArrow=ERmandOne;', w, h, '', '1 to 1', null, dt + 'one'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERone;endFill=1;', w, h, '', '1', null, dt + 'one'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToOne;endFill=1;', w, h, '', '0 to 1', null, dt + 'zero one'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERmany;', w, h, '', 'Many', null, dt + 'many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERmany;startArrow=ERmany;', w, h, '', 'Many to Many', null, dt + 'many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToMany;startArrow=ERzeroToOne;', w, h, '', '1 Optional to Many Optional', null, dt + 'one optional many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToMany;startArrow=ERmandOne;', w, h, '', '1 Mandatory to Many Optional', null, dt + 'one mandatory many optional'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToOne;startArrow=ERmandOne;', w, h, '', '1 Mandatory to 1 Optional', null, dt + 'one mandatory optional'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERoneToMany;startArrow=ERmandOne;', w, h, '', '1 Mandatory to Many Mandatory', null, dt + 'one mandatory many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERoneToMany;startArrow=ERzeroToOne;', w, h, '', '1 Optional to Many Mandatory', null, dt + 'one optional mandatory many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERoneToMany;startArrow=ERoneToMany;', w, h, '', 'Many Mandatory to Many Mandatory', null, dt + 'mandatory many'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERoneToMany;startArrow=ERzeroToMany;', w, h, '', 'Many Optional to Many Mandatory', null, dt + 'mandatory many optional'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToMany;endFill=1;startArrow=ERzeroToMany;', w, h, '', 'Many Optional to Many Optional', null, dt + 'many optional')
	 	];

		this.addPaletteFunctions('er', mxResources.get('entityRelation'), false, fns);
	};

})();
