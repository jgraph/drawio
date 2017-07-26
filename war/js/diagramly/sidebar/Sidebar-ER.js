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
			    	'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#e0e0e0;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
				cell.vertex = true;
				cell.insert(sb.cloneCell(row, 'Row 1'));
				cell.insert(sb.cloneCell(row, 'Row 2'));
				cell.insert(sb.cloneCell(row, 'Row 3'));
		
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Table');
			}),
	   	 	this.addEntry(dt + 'table section subsection', function()
	   		{
				var cell = new mxCell('Section', new mxGeometry(0, 0, 140, 110),
		    		'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=22;fillColor=none;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
				cell.vertex = true;

				cell.insert(sb.cloneCell(row, 'Row 1'));
				cell.insert(sb.cloneCell(row, 'Row 2'));
				cell.insert(sb.cloneCell(row, 'Row 3'));
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Section'); 
	   		}),
			this.addDataEntry(dt + 'table section subsection', 160, 144, 'ER Table 1',
				'7VjrjqIwFH4a/m5aKs76c2EumaybTMZ5gQIVmi0tW+qq8/R7CsVL0GhGjDsTFJOee3u+84VYj0TF6knTMv+lUiY88uCRSCtlmlWxipgQno946pF7z/cR/Dz/8YgV11ZUUs2kOSfAbwL+UrFgjeaNxoI12sqshdNWS14IKkEK50qambMgkJOci3RK12phK1aGJr9bKcyV5u/gT+Fg9xgUYNZmxt9tsD+22bgQkRJK13UIQ/a7FzmzGV0tzSqIfWmPhzeqKa1Mux8lBC0rHtc7tC4F1RmXoTJGFc6pPc/jfvl5/QE7FTyToEugEANj6PrEtGGro72uVa7RT0wVzOg1uCx5anLnMW7wQDnjWd6GjUaNklaNItvEbqGDhUPvMJKkg+RC8j8L9px2wcxpaZewdcOpeGWJoTKz1tCo0nVIsHnbUe22atdx20W806XGN7Td4QkVP5y64GlaZ90FWap6iqqSJlxm06YKGW1Vr66aVSlIORdqCWIOyZi0u1GGGhpv5q9UXJq6cUEID/Q3Qt8CL4CTRiDjrQyPddcmUrIymvIaNwajs2R2fMJUq/INhoW1p92d9eDcKfBPTsHkwBAQdPkMjDoz8PLzYvTjXd4cQPLcIdhHvDfAT2Fqj+nG9Sh6iZLStiFue4S6qJKTqJIroRp0UNXQIB/h6xAbnca0TvZ5WX1FFsM77WK8xx28b83hBu9PTuDgQwTuA9C7IwS+HNeBwP8jgb8PBL4Gge9uRuDJEQKTgcBfksAYDQy+BoMnN2Mwxv0jOnC3b+7iHv4t4e6V1sDdHriLT19uHSLvByAFcXsBWtv27kf/AQ=='),
			this.addDataEntry(dt + 'table section subsection', 160, 112, 'ER Table 2',
				'7VfbbuIwEP2avK5yIenu4yYsfSiVqtIfGBKTWHU8keMu0K/fseNwEUTQUrStVAiSPRePZ845QvGirF7dKmiqeyyY8KI/XpQpRN2t6lXGhPBCnxdeNPbC0KefF04GvIH1+g0oJvU5CWGX8BfEC+ssTzAXrLO2ei2ctV3yWoCkXbpAqWfO49M+r7goprDGF1Ox1ZA/97u0QsVfKR6osXFABnIrPeOvJjlMzGlciAwFKlsnYr757mXOzImulmIt5T707QUb0xRa3d8HhYCm5XN7QxNSgyq5TFFrrF1Q389kv/zCfsgPgpeSbDkVYuRM3ZyY0mw1OGtrcoO+ZVgzrdYUsuSFrlxE0uHhV4yXVZ8WOBig7QzlJncLHS0ceseRjA6QVLgkQ3CIZQWNWdLNNQfxyHINsjTeVGPjBiTYoh+ocjc16/nuEPshdbGpGQ7PQfx25poXhT11F2OJlkRtAzmX5bSrkvhb06OrNiIT0pELQW1E44oOY9LcBjVomG/o1yCX2s4tTumh8Wb+j9iLqdOM9sF2T48JVzpD2WoF3MLGiDlLZtiTFgqbJ+IK67vdpXp8LgnCkyT4dYQDkX85BUYHFHi4o/Ynd2/iwG7TwRAn9nhwBN9zqbHPg9FH0eAU0qZt194gpjlKacYy72fmH2IdncQ6Tq6DdTwg9/A6cg++5f7p5J4Myf1NHPiW+/lyj/+b3G8+3b+7Pezrav2K2u6FeQnePw/wvhjoCzXc4f3FBXzzLgG/A1Dabl/irG/vHe8f'),
				
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
