(function()
{
	// Adds ER shapes
	Sidebar.prototype.addErPalette = function()
	{
		// Avoids having to bind all functions to "this"
		var sb = this;

		// Reusable cells
		var row = new mxCell('Item', new mxGeometry(0, 0, 40, 30), 'text;strokeColor=none;fillColor=none;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;');
		row.vertex = true;

		// Predefined dimensions
		var w = 100;
		var h = 100;
		
		// Default tags
		var dt = 'db database schema er entity relation table ';
		
		function createEdge(style, m, n)
		{
			var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), style);
			edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
			edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
			edge.geometry.relative = true;
			edge.edge = true;
			
			if (m != null)
			{
		    	var cell1 = new mxCell(m, new mxGeometry(-1, 0, 0, 0), 'resizable=0;html=1;align=left;verticalAlign=bottom;');
		    	cell1.geometry.relative = true;
		    	cell1.setConnectable(false);
		    	cell1.vertex = true;
		    	edge.insert(cell1);
			}
			
			if (n != null)
			{
		    	var cell2 = new mxCell(n, new mxGeometry(1, 0, 0, 0), 'resizable=0;html=1;align=right;verticalAlign=bottom;');
		    	cell2.geometry.relative = true;
		    	cell2.setConnectable(false);
		    	cell2.vertex = true;
		    	edge.insert(cell2);
			}
			
			return edge;
		};
		
		this.setCurrentSearchEntryLibrary('er');
		
		var fns = [
	   		this.addDataEntry(dt, 180, 160, 'Table 1', '7Zhvb5swEMY/DW8nwCNr3kL/aGomTW33AdxwAUuOTW2nkH36ncEkaihqooSQVZWI5DufL/bvCY8CHkmW1Z2iRf5LpsA9cuORRElpmtGySoBzL/RZ6pFrLwx9/Hjhbc9sUM/6BVUgzD4LwmbBK+UraDJP9JlDk9VmzV1W57SwQ1PPklgbqswj+2tzxMfEXApDmQCFiaCOOaeFZnV5k8kZT2d0LVembdRG8YJVkD7IUrtaJcsZNrOhbb7A5o9uM3aacpYJHM/xlPYbYwUa9zKj2rgKdyxQBqpeNHXKcbkDuQSj1lhSstTkruKqwefnwLK8XTZxSaqbRLZZuyWNAwf7ffCkA76XOW7ZMMofYG6oyGr8b+laRKmSxRNVGRiXKCSzcG5e8bgbjozzRHJpRRJS2E5GFm6Sw6Jd+yyNkctWC3fyTdP61FGMF3JI/G+RF+F2E4yDbYyXLVcmkUIbhT8N2wNQoRKsSvspFL6v0NoxdDp8JBg5gV7fO3r9vj9MMSFsuFXsYDH8HTF27wqJMBdclhjmLE1B7EuZfHgfkIGoRh2qfwR7WcHP65HZtg7T1Ma6oHMmslmzcrIDPxoAftX/E48GEmPyX1jSrlKXZUmTM1rSjyP1OvlNAylr+x3lR5PR/OiqgxT/lGAiuHQ7OjXrEexn+mU/R9vP9Iz2E/if1X+mo/lPEPQY0NhohzOgHtgjGFDQfRj+cqBDHSgIz2lBxz5FX6wFBT2Uz+FB3UfdxoPIp/WgPtrDmxCG25d99dybd4H/AA=='),
	   		this.addDataEntry(dt, 180, 160, 'Table 2', '7ZjRbpswFIafhtsJ48KaW1jbi2bS1PYF3OCAJcdGtlvInn7H2CRLE9RECYFOk4jkc3x8Yn9/+BUIcLZqHhSpyp8ypzzAdwHOlJTGjVZNRjkPopDlAf4RRFEInyC675lF7WxYEUWFOWZB5Ba8E/5GXeaFvHLqstqsuc/qklR2aNpZnGpDlHlmv20Oh5BYSGEIE1RBArUx56TSrC13mZLxfE7W8s10jbooXbKG5k+y1r5WyXoOzWxomy+h+bPfjJ0mnBUCxgs4pf3GVFENe5kTbXyFPxZVhja9aNqU5/JA5YoatYaSmuWm9BW3Dl9YUlaU3bLEJ4l2iWKzdksaBh72YfB4D3wvc9iyYYQ/0YUhomjx79K1iHIlqxeiCmp8opLMwrl7h+NuODLOM8mlFUlIYTsZWflJTpfd2ldpjFz5QPmTb5q2p45TuIBDFn6Lgxi2m0GMtjFctlyZTAptFPw0bA8KCtXUqnScQtFhhdaeodfhM8HwBfS62dPr1yOc9v4RnaabEDbc6na2JB/vDQlIl1zWEJYsz6k4ljX+9G5IBmIb77EFK4DE2Gg7m3G1qa7Igoli7lYmH9jHA7Bvdrn//TuPBtIi+RK+hCbtS4f0GsqXvvf50om6TdeXktF86bbHl8ZGez1f6mE/gi/NvoQvTfv/0uyKvoTCMwW7+F1Dc9b1O8uPZqP5EUI9hoSnbkiXhj2CAaH9R+X/DnSqA23UuYoFnfuMPVkLQj2Ur+FB+w/CzoNu/lkP6qM9vAlBuH0V2M7tvCn8Aw=='),
	   		this.addDataEntry(dt, 180, 30, 'Table Row 1', 'xVXbboMwDP0aXicKY9oz7PLSvbT7gYy4EC2NUeIWuq+fQ0JZd9EqbdMkkHJObGOfAyHJq+1wb0XXPqAEneS3SV5ZRAqr7VCB1kmWKpnkN0mWpXwn2d0Xu4txN+2EBUPnJGQhYS/0DgITCEcHHQnXis4vSTx5qnQkLK3Vi+dSxjUaEsqAZbwYsdaic2qMDkyrtFyKA+5oqjOhcqMGkCvsXYy12C+5mIvFN1x8HXvxWGjVGF7XPJ9/YmnBcStL4SgWcGTxGSrU6BsyaGB8itbvqDg4WILhS/FGKip3D7gFsgcO6ZWkNkZcB4HTFlTTxrQ8csIF3BxTZyt4Ed343Jn8fGe4Y1JCr6AmYZrRpFMTvHLSYvcobAMUiQ6V1/B2z9Me5f6oE2EXNzVsptwnJMJtBDYOfiw6Tl2UfLEOVXpRJAW3WzFezJgvH26pQsOe8RvkawAb2YM38zyDsv8z6PKHBhnj4WzQj7UHqaZ6/kNAlm6jsWfYKinBnKtp/q2m+R9JWnyQlE+Gf1Z1OnFCbOk6USvTLEPm1R/oPJzq+fZVLn5Hd4bzH2bcO/kBvQI='),
	   		this.addDataEntry(dt + ' fk pk foreign key primary', 180, 30, 'Table Row 2', 'xVXbTsMwDP2avqKupYjnljEhxguDDwir10ZkcUm8tePrcZpsYxsTQ9ykVMo5sV37nF6itJh3IyOa+g5LUFE6jNLCIJLfzbsClIqSWJZRehUlScxXlFwfOR30p3EjDGg6JSHxCUuhFuAZT1haqUDYWjRuS+LJUbklYWgiXx0XM56iJiE1GMaDHislGiv7aM/UUpVjscIFreusUT6THZT32NoQa7AdczEbis+4+CT04rBQstK8n/J87o65AcutjIWlUMCSwWcoUKFrSKOG/i5K7VFhcDAE3VHxeiooNwKcA5kVh7SypDpEXHqB4xpkVYe0NHDCelxtUrdW8Ca48bEz6enOcMckhbqHKQld9SbtmuCUKw02D8JUQIFoUDoNh0uediP3oU6ETThUMFvnPiERzgMwYfBN0X7qLOfFOhTxWRZl3G7BeLDFvFy4oQI1e8ZPkKsBbGQLzszTDEr+z6DzA4Oub79mkdYObi36tvr7bwuyejOFLcNaliXoU2VNP5U1/SVVswNVH7V8WcDN1T9ru/7y+NjcNmIqdTX2mRd/IH63K/L7Rzz7GTMYbv88/dnOj+kN'),
	   		this.addDataEntry(dt + ' fk pk foreign key primary', 180, 30, 'Table Row 3', 'xVXbTsMwDP2avqKupYjnloEQQ0IMPiCsXhuRxSXxaMfX4zTpriCGxISUSjkntmuf00uUFovuxoimvscSVJSOo7QwiOR3i64ApaIklmWUXkVJEvMVJdffnI7607gRBjQdk5D4hHehluAZT1haqUDYWjRuS+LFUbklYWgqPxwXM56hJiE1GMajHislGiv7aM/UUpUTscIlDXUGlM9lB+UjtjbEGmwnXMyG4nMuPg29OCyUrDTvZzyfu2NuwHIrE2EpFLBk8BUKVOga0qihv4tSe1QYHAxB9614PRWUuwFcAJkVh7SypDpEXHqB4xpkVYe0NHDCelytUzdW8Ca48bUz6fHOcMckhXqEGQld9SbtmuCUKw02T8JUQIFoUDoNx+887VruQ50Im3CoYD7kviARLgbLwuDrov3UWc6LdSjisyzKuN2C8WiDeblwQwVq9oyfIFcD2MgWnJnHGZT8n0HnBwY93P3OIq0d3Fj0a/XjPfW33xbnDLJ6c4Utw1qWJehjZU1/lDU9karZgarPWr4t4fbqn7Udvjw+NreNmEldTXzmxZ742QnE73ZF3n7Es78xg+Hmz9Of7fyYPgE='),
	   		this.addEntry(dt + ' list', function()
			{
				var cell = new mxCell('List', new mxGeometry(0, 0, 160, 110),
			    	'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;align=center;fontSize=14;');
				cell.vertex = true;
				cell.insert(sb.cloneCell(row, 'Item 1'));
				cell.insert(sb.cloneCell(row, 'Item 2'));
				cell.insert(sb.cloneCell(row, 'Item 3'));
		
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'List');
			}),
			this.addEntry(dt + ' list', function()	
			{	
				return sb.createVertexTemplateFromCells([row.clone()], row.geometry.width, row.geometry.height, 'List Item 1');	
			}),
			this.addEntry(dt + 'table row', function()	
			{	
	   			var cell = new mxCell(row.value, new mxGeometry(0, 0, 90, row.geometry.height), 'shape=partialRectangle;fillColor=none;align=left;verticalAlign=middle;strokeColor=none;spacingLeft=34;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');	
	   			cell.vertex = true;	

	   			var cell1 = sb.cloneCell(row, '');	
	   			cell1.connectable = false;	
	   			cell1.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;stokeWidth=1;dashed=1;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'	
	   			cell1.geometry.width = 30;	
	   			cell.insert(cell1);	

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'List Item 2');	
			}),
			this.addEntry(dt + 'table row divider hline line separator', function()	
			{	
				var divider = new mxCell('', new mxGeometry(0, 0, 60, 10), 'line;strokeWidth=1;rotatable=0;dashed=0;labelPosition=right;align=left;verticalAlign=middle;spacingTop=0;spacingLeft=6;points=[];portConstraint=eastwest;');	
				divider.vertex = true;	

				return sb.createVertexTemplateFromCells([divider], divider.geometry.width, divider.geometry.height, 'List Item 3');	
			}),
	   		this.addEntry(dt + 'table', function()
			{
	   			var cell = new mxCell('Entity', new mxGeometry(0, 0, 160, 120),
	   		    	'swimlane;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;rounded=1;fontSize=14;fontStyle=0;strokeWidth=2;resizeParent=0;resizeLast=1;shadow=0;dashed=0;align=center;');
	   			cell.vertex = true;
	   			
	   			var cell1 = new mxCell('+Attribute1\n+Attribute2\n+Attribute3', new mxGeometry(0, 30, 160, 90),
	   				'align=left;strokeColor=none;fillColor=none;spacingLeft=4;fontSize=12;verticalAlign=top;resizable=0;rotatable=0;part=1;');
	   			cell1.vertex = true;

				cell.insert(cell1);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Entity');
			}),
			this.createVertexTemplateEntry('whiteSpace=wrap;html=1;align=center;', 100, 40, 'Entity', 'Entity', null, null, dt),
			this.createVertexTemplateEntry('rounded=1;arcSize=10;whiteSpace=wrap;html=1;align=center;', 100, 40, 'Entity', 'Entity (Rounded)', null, null, dt + 'chen'),
			this.createVertexTemplateEntry('shape=ext;margin=3;double=1;whiteSpace=wrap;html=1;align=center;', 100, 40, 'Entity', 'Weak Entity', null, null, dt + 'chen'),
			this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;align=center;',
				100, 40, 'Attribute', 'Attribute', null, null, dt + 'attribute chen'),
			this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;align=center;fontStyle=4;',
				100, 40, 'Attribute', 'Key Attribute', null, null, dt + 'attribute key chen'),
			this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;align=center;',
				100, 40, '<span style="border-bottom: 1px dotted">Attribute</span>', 'Weak Key Attribute', null, null, dt + 'attribute key weak chen'),
			this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;align=center;dashed=1;',
				100, 40, 'Attribute', 'Derived Attribute', null, null, dt + 'attribute derived chen'),
			this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;margin=3;whiteSpace=wrap;html=1;align=center;',
				100, 40, 'Attribute', 'Multivalue Attribute', null, null, dt + 'attribute multivalue chen'),
			this.createVertexTemplateEntry('shape=associativeEntity;whiteSpace=wrap;html=1;align=center;',
				140, 60, 'Associative\nEntity', 'Associative Entity', null, null, dt + 'associative entity chen'),
			this.createVertexTemplateEntry('shape=rhombus;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;align=center;',
				120, 60, 'Relationship', 'Relationship', null, null, dt + 'chen'),
			this.createVertexTemplateEntry('shape=rhombus;double=1;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;align=center;',
				120, 60, 'Relationship', 'Identifying Relationship', null, null, dt + 'chen'),
			this.createVertexTemplateEntry('ellipse;shape=cloud;whiteSpace=wrap;html=1;align=center;', 100, 60, 'Cloud', 'Cloud', null, null, dt + 'cloud'),
	   	 	this.addEntry(dt + 'hierarchy', function()
	   		{
			   	var cell = new mxCell('', new mxGeometry(0, 0, 100, 100), 'rounded=1;absoluteArcSize=1;html=1;arcSize=10;');
			   	cell.vertex = true;
			   	
			   	var cell1 = new mxCell('main', new mxGeometry(0, 0, 50, 100), 'html=1;shape=mxgraph.er.anchor;whiteSpace=wrap;');
			   	cell1.vertex = true;
			   	cell.insert(cell1);
			   	
			   	var cell2 = new mxCell('sub', new mxGeometry(50, 5, 45, 90), 'rounded=1;absoluteArcSize=1;html=1;arcSize=10;whiteSpace=wrap;points=[];strokeColor=inherit;fillColor=inherit;');
			   	cell2.vertex = true;
			   	cell.insert(cell2);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Hierarchy'); 
	   		}),
			this.createVertexTemplateEntry('shape=note;size=20;whiteSpace=wrap;html=1;', w, h, 'Note', 'Note', null, null, dt + 'note'),
			this.addEntry(dt + 'relation chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('endArrow=none;html=1;rounded=0;')],
					160, 0, 'Untitled Relation');
			}),
			this.addEntry(dt + 'mandatory participation chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('endArrow=none;html=1;rounded=0;', null, '1')],
					160, 0, 'Mandatory Participation (0:1)');
			}),
			this.addEntry(dt + 'mandatory participation chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('endArrow=none;html=1;rounded=0;', null, 'N')],
					160, 0, 'Mandatory Participation (0:N)');
			}),
			this.addEntry(dt + 'mandatory participation chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('endArrow=none;html=1;rounded=0;', 'M', 'N')],
					160, 0, 'Mandatory Participation (M:N)');
			}),
			this.addEntry(dt + 'optional participation chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('endArrow=none;html=1;rounded=0;dashed=1;dashPattern=1 2;', null, '1')],
					160, 0, 'Optional Participation (0:1)');
			}),
			this.addEntry(dt + 'optional participation chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('endArrow=none;html=1;rounded=0;dashed=1;dashPattern=1 2;', null, 'N')],
					160, 0, 'Optional Participation (0:N)');
			}),
			this.addEntry(dt + 'optional participation chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('endArrow=none;html=1;rounded=0;dashed=1;dashPattern=1 2;', 'M', 'N')],
					160, 0, 'Optional Participation (M:N)');
			}),
			this.addEntry(dt + 'recursive relationship chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('shape=link;html=1;rounded=0;', null, '1')],
					160, 0, 'Recursive Relationship (0:1)');
			}),
			this.addEntry(dt + 'recursive relationship chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('shape=link;html=1;rounded=0;', null, 'N')],
					160, 0, 'Recursive Relationship (0:N)');
			}),
			this.addEntry(dt + 'recursive relationship chen', function()
			{
				return sb.createEdgeTemplateFromCells(
					[createEdge('shape=link;html=1;rounded=0;', 'M', 'N')],
					160, 0, 'Recursive Relationship (M:N)');
			}),
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
		
		this.setCurrentSearchEntryLibrary();

	};

})();
