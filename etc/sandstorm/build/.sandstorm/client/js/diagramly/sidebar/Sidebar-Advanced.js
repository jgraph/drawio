(function()
{
	// Adds containers
	var sidebarCreateAdvancedShapes = Sidebar.prototype.createAdvancedShapes;
	
	Sidebar.prototype.createAdvancedShapes = function()
	{
		var fns = sidebarCreateAdvancedShapes.apply(this, arguments);
		
		// Avoids having to bind all functions to "this"
		var sb = this;

		// Reusable cells
		var flow = new mxCell('Vertical Flow Layout', new mxGeometry(0, 0, 270, 280),
				'swimlane;html=1;startSize=20;horizontal=1;childLayout=flowLayout;flowOrientation=north;resizable=0;interRankCellSpacing=50;');
		flow.vertex = true;
		
		var flow1 = new mxCell('Start', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
		flow1.vertex = true;
		flow.insert(flow1);
		
		var flow2 = new mxCell('Task', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
		flow2.vertex = true;
		flow.insert(flow2);
		
		var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'html=1;curved=1;');
		edge.geometry.relative = true;
		edge.edge = true;
		flow1.insertEdge(edge, true);
		flow2.insertEdge(edge, false);
		flow.insert(edge);
		
		var flow3 = new mxCell('Task', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
		flow3.vertex = true;
		flow.insert(flow3);
		
		edge = edge.clone();
		flow1.insertEdge(edge, true);
		flow3.insertEdge(edge, false);
		flow.insert(edge);
		
		var flow4 = new mxCell('End', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
		flow4.vertex = true;
		flow.insert(flow4);
		
		edge = edge.clone();
		flow2.insertEdge(edge, true);
		flow4.insertEdge(edge, false);
		flow.insert(edge);
		
		edge = edge.clone();
		flow3.insertEdge(edge, true);
		flow4.insertEdge(edge, false);
		flow.insert(edge);

		return fns.concat(
		[
		 	this.addEntry('container swimlane pool horizontal', function()
		 	{
				var cell = new mxCell('Pool', new mxGeometry(0, 0, 480, 380),
			    	'swimlane;html=1;childLayout=stackLayout;horizontal=1;startSize=20;horizontalStack=0;');
				cell.vertex = true;
				
				var cell1 = new mxCell('Lane 1', new mxGeometry(0, 20, 480, 120), 'swimlane;html=1;startSize=20;horizontal=0;');
				cell1.vertex = true;
				cell.insert(cell1);
				
				var cell2 = new mxCell('Lane 2', new mxGeometry(0, 140, 480, 120), 'swimlane;html=1;startSize=20;horizontal=0;');
				cell2.vertex = true;
				cell.insert(cell2);
				
				var cell3 = new mxCell('Lane 3', new mxGeometry(0, 260, 480, 120), 'swimlane;html=1;startSize=20;horizontal=0;');
				cell3.vertex = true;
				cell.insert(cell3);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Horizontal Pool 1', true);
		 	}),
		 	this.addEntry('container swimlane pool horizontal', function()
			{
				var cell = new mxCell('Pool', new mxGeometry(0, 0, 480, 360),
			    	'swimlane;html=1;childLayout=stackLayout;horizontal=0;startSize=20;horizontalStack=0;');
				cell.vertex = true;
				
				var cell1 = new mxCell('Lane 1', new mxGeometry(20, 0, 460, 120), 'swimlane;html=1;startSize=20;horizontal=0;');
				cell1.vertex = true;
				cell.insert(cell1);
				
				var cell2 = new mxCell('Lane 2', new mxGeometry(20, 120, 460, 120), 'swimlane;html=1;startSize=20;horizontal=0;');
				cell2.vertex = true;
				cell.insert(cell2);
				
				var cell3 = new mxCell('Lane 3', new mxGeometry(20, 240, 460, 120), 'swimlane;html=1;startSize=20;horizontal=0;');
				cell3.vertex = true;
				cell.insert(cell3);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Horizontal Pool 2', true);
		 	}),
		 	this.addEntry('container swimlane pool vertical', function()
			{
				var cell = new mxCell('Pool', new mxGeometry(0, 0, 360, 480),
			    	'swimlane;html=1;childLayout=stackLayout;startSize=20;');
				cell.vertex = true;
				
				var cell1 = new mxCell('Lane 1', new mxGeometry(0, 20, 120, 460), 'swimlane;html=1;startSize=20;');
				cell1.vertex = true;
				cell.insert(cell1);
				
				var cell2 = new mxCell('Lane 2', new mxGeometry(120, 20, 120, 460), 'swimlane;html=1;startSize=20;');
				cell2.vertex = true;
				cell.insert(cell2);
				
				var cell3 = new mxCell('Lane 3', new mxGeometry(240, 20, 120, 460), 'swimlane;html=1;startSize=20;');
				cell3.vertex = true;
				cell.insert(cell3);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Vertical Pool 1', true);
		 	}),
		 	this.addEntry('container swimlane pool vertical', function()
			{
				var cell = new mxCell('Pool', new mxGeometry(0, 0, 380, 480),
			    	'swimlane;html=1;childLayout=stackLayout;startSize=20;horizontal=0;horizontalStack=1;');
				cell.vertex = true;
				
				var cell1 = new mxCell('Lane 1', new mxGeometry(20, 0, 120, 480), 'swimlane;html=1;startSize=20;');
				cell1.vertex = true;
				cell.insert(cell1);
				
				var cell2 = new mxCell('Lane 2', new mxGeometry(140, 0, 120, 480), 'swimlane;html=1;startSize=20;');
				cell2.vertex = true;
				cell.insert(cell2);
				
				var cell3 = new mxCell('Lane 3', new mxGeometry(260, 0, 120, 480), 'swimlane;html=1;startSize=20;');
				cell3.vertex = true;
				cell.insert(cell3);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Vertical Pool 2', true);
		 	}),
		 	this.addEntry('vertical tree layout', function()
			{
				var cell = new mxCell('Vertical Tree Layout', new mxGeometry(0, 0, 280, 190),
						'swimlane;html=1;startSize=20;horizontal=1;childLayout=treeLayout;horizontalTree=0;resizable=0;');
				cell.vertex = true;
				
				var cell1 = new mxCell('Root', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
				cell1.vertex = true;
				cell.insert(cell1);
				
				var cell2 = new mxCell('Child 1', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
				cell2.vertex = true;
				cell.insert(cell2);
				
		    	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=vertical;html=1;rounded=0;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	cell1.insertEdge(edge1, true);
		    	cell2.insertEdge(edge1, false);
		    	cell.insert(edge1);
		    	
				var cell3 = new mxCell('Child 2', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
				cell3.vertex = true;
				cell.insert(cell3);
				
		    	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=vertical;html=1;rounded=0;');
		    	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	cell1.insertEdge(edge2, true);
		    	cell3.insertEdge(edge2, false);
		    	cell.insert(edge2);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Vertical Tree Layout', true);
		 	}),
		 	this.addEntry('horizontal tree layout', function()
			{
				var cell = new mxCell('Horizontal Tree Layout', new mxGeometry(0, 0, 310, 160),
						'swimlane;html=1;startSize=20;horizontal=0;childLayout=treeLayout;horizontalTree=1;resizable=0;');
				cell.vertex = true;
				
				var cell1 = new mxCell('Root', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
				cell1.vertex = true;
				cell.insert(cell1);
				
				var cell2 = new mxCell('Child 1', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
				cell2.vertex = true;
				cell.insert(cell2);
				
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=horizontal;html=1;rounded=0;');
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, true);
				cell2.insertEdge(edge1, false);
				cell.insert(edge1);
				
				var cell3 = new mxCell('Child 2', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
				cell3.vertex = true;
				cell.insert(cell3);
				
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;elbow=horizontal;html=1;rounded=0;');
				edge2.geometry.relative = true;
				edge2.edge = true;
				cell1.insertEdge(edge2, true);
				cell3.insertEdge(edge2, false);
				cell.insert(edge2);

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Horizontal Tree Layout', true);
		 	}),
		 	this.addEntry('vertical flow layout', function()
			{
		 		return sb.createVertexTemplateFromCells([flow], flow.geometry.width, flow.geometry.height, 'Vertical Flow Layout', true);
		 	}),
		 	this.addEntry('horizontal flow layout', function()
			{
				var cell = sb.graph.cloneCells([flow])[0];
				cell.geometry = new mxGeometry(0, 0, 460, 150);
				cell.style = 'swimlane;html=1;startSize=20;horizontal=0;childLayout=flowLayout;flowOrientation=west;resizable=0;interRankCellSpacing=50;';
				cell.value = 'Horizontal Flow Layout';
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Horizontal Flow Layout', true);
			})
		]);
	};
	
})();
