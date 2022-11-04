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
	   		this.addDataEntry(dt, 180, 160, 'Table 1', '7Zhhb5swEIZ/DV8nwCNrvkK2blomTW33A9z4ApYcmxlnSfrrd8am2UJYUy1AW0Uiku98vuDnxa8EAclW22tNy+KbYiAC8jEgmVbKuNFqm4EQQRxyFpBZEMch/oL4U8dsVM+GJdUgzSkLYrfgFxVrcJk7ei/AZSuzEz5bFbS0Q1PPkrQyVJtb/mBzJMTEQklDuQSNiaiOhaBlxetylym4YHO6U2vTNGqidMm3wG7UpvK1Wm3m2MyGtvkSm9/6m7HTVPBc4niBu7T/mGqo8F7mtDK+wm8LtIFtJ5o65blcg1qB0Tss2XBmCl9x5fCFBfC8aJYlPkkrl8gf1+5J48DDPg6etMD/mznCwW0VSvMHS1p4Mn/qUMcbvhJUwmeg7CCVKrZreHIhMiWUFUsqCS29bBHTqryjOgfjE6Xi0tRbTlK8EEIWvkuCBO81wzjax3jZcm0yJSuj8bmwPQDl2YCVKDWq9E0FLJv+2iO243tljFo9R8z4uJg7j9tL9pS25AzSvm9J+/1rp7i4BcOpuIGFoTIXTgopbbiX4oheRwk+UjvEeXiAFMJcCvtIzQrOGMhTKZMnjwzpiWrSovpD8p9r+DIbmW1jRq42rUq64DKfu5WTA/hJD/C33Y940pMYk4t7neRe4XncazKge304Xdphzhcw3vT7L+uajGZdVy2k9jzEYfTSnevcrEdwqunFqYZ0qumAThWFb9WqpqNZVRR1eNXYaPvzqg7YI3hV1H4bv5hVj2YVxUO61TPe+F+XW0UdlIewq/a7trMr8mbtqot2/36F4f7DZD3313fL3w=='),
	   		this.addDataEntry(dt, 180, 160, 'Table 2', '7ZjbbqMwEIafhtsVh5JtbqHbVmpWWrV9ATeegCVjI+Nukj79jrFpDoSW1RbYVpGI5BmPJ/j74U/Ai9Jic6NImf+UFLgX/fCiVEmp7ajYpMC5F/qMetGVF4Y+frzwumM2qGf9kigQus+C0C74Tfgz2MwjeeJgs5XecpetclKaoa5no6TSROkH9mJykY+JpRSaMAEKE0Edc07KitXlNpMzThdkK59106iJkhXbAL2X68rVKrleYDMTmuYrbP7gTsZME84ygeMl7tJ8Y6KgwnNZkEq7CrctUBo2nWjqlONyA7IArbZYsmZU567i0uLzc2BZ3iyLXZJUNpG9rt2RxoGDfRp81AL/NnOEg9vKpWIvhjR3ZPZ1qOM1KzgRcAuEHqUSSbcNT8Z5Krk0YgkpoKWXKaJKlo9EZaBdopRM6HrLcYIHQkj9b7EX47mmGAe7GA9TrnQqRaUVXhemB6A8azASJVqWrimHVdNfOcRm/CS1loULeokZnhZz63A7yd7TNvoAaS9a0v66QzbXd0GnxLgRzQi/h6UmIuNWECFMuBPkhGonOR6w24d6fBtJRLri5sK6yhmlIPqyjt69cWYDsY1bbM2NEfpTo20cydYmVUmWTGQLu3J2xD4egP3mkPv+dR4OpMXsbGG9LKz379HbFnZK2qEs7HuXhXVL/MksbDaZhV12WNjUaMezsA72E1jY/GxhY/4Lm49oYYHfX9txbjCgrOn3T9Y1n8y6gqDDu6L/3bs+GvYEXhW0n9XPZjWgWb0KOYpb/cX7gM/lVkEH5THsqv0kbu3q4svaVRft4f0Kw91ry3ru4K3mHw=='),
	   		this.addDataEntry(dt, 180, 30, 'Table Row 1', 'xZXBbqMwEIafhuuKQKn2DN22h/TS7gtM4wlYNR5kTwvp0+8Ym02TTbWp1KoSSJ7f42H8/QaysumnGwdDd0cKTVb+ysrGEXEc9VODxmRFrlVWXmVFkcudFdfvzK7m2XwAh5bPWVDEBS9gnjEqUfC8M0nwHQxhyPAYpNozOH7Qr0HLJd6QZdAWncSrOTYGBq/n7Kh02qg17OiZlzpLVG/1hOqeRp9yHY1rKeZT8a0Uf0i9hBiMbq2MN7K/8MTaoZdW1uA5FfDs6AkbMhQasmRxfooxR9Jhm6F2QoGOcXoX5ywlljdIPbLbScqoFXcp42dEnneo2y4tK5MGPsbt36V7c2SQ/DntVflBr4Sq7Kojp1+DRSZt89g/P+regMVbBHUk1aR2ixHnEFSOht/gWuQkDKQtz1uuarkEQpP/qLJKem0kXu1juUK644asWCgHKtRA8XXE4G3NNKSiBrdLfZcIh/EjMVP/ES+L7/Py4nwvpWPWYO5xw2BbE8lbG8I9+RP2nAR2AOktPVR6qRfeIhJ0WxMO0FWnlUJ7LtPyv0zLL0Ja/YM0vADfS3X5XMXc2g+w0bZdx5WXX8B5OuT59ihXn8Ndwv3vaZ47+Hv9AQ=='),
	   		this.addDataEntry(dt + ' fk pk foreign key primary', 180, 30, 'Table Row 2', 'xZVhb9MwEIZ/Tb6iNCGIz0nZQJQvG/wAr74mFhdfsK8k3a/nHLt07VrRScCkRPK9Pl/Oz+skWdn0061TQ/eFNGBWfsjKxhFxHPVTA4hZkRudlcusKHK5s+Lmwuxins0H5cDyNQuKuOCnwi1EJQqed5gE36khDFk9BKn2rBzfm8eg5RKvybIyFpzEizlGVIM3c3ZUOoN6pXa05X2dfVRvzAT6jkafch2NKynmU/GNFL9PvYRYoWmtjNeyv/DE2oGXVlbKcyrg2dF3aAgpNGTJwvwUxBPpuM1QO6EAxzBdxDlLieUtUA/sdpIyGs1dyngfkecdmLZLy8qkKR/j9vfSgzkySP6c96p8oVdCVXbVkTOPwSJM2zz1z4+mR2XhIyh9ItWkd3sjriGoHQ1flWuBkzCQsTxvuarlEghN/qbKKum1kXhxiOUK6Y4bsmKhHKhQA8TXEYK3NdOQiiJs9vVdIhzGD8RM/Uu8LF7Py7fPvLz5fNFN6ZmNwjtYs7ItRvbWhvDA/oxBZ5EdYXrK7/RVI6G3wXCGlp3RGuy1WMs/Yi3/EdXqGdVv1vzYwqflK7Pdf7Zibu0HtTa2XcWV7/4D/OkY8tMjXv0dMyQ8/LbmuaO/2i8='),
	   		this.addDataEntry(dt + ' fk pk foreign key primary', 180, 30, 'Table Row 3', 'xZVhb5swEIZ/DV8nAmPqZ0jXVsukql1/gBtfwKrxMfsySH/9ztg0DU20TGpVCSTf6/Nxfl4DSV61w5UVXfMTJegkv0zyyiJSGLVDBVonWapkki+TLEv5TrLvJ2YX42zaCQuGzlmQhQV/hN5CUILgaKej4BrR+SGJRy+VjoSle/XstZTjNRoSyoDleDHGWovOqTE7KI3SciV2uKWpzhSVGzWAvMPexVyL/YqLuVh8w8XvYy8+FlrVhsdr3p9/YmnBcSsr4SgWcGTxCSrU6BsyaGB8itYz6bBNXzuiAEswnMQ5SpHlFWALZHec0itJTcy4CMjTBlTdxGV51IQLcf2ydG8OD6I/x73K/9Mrpsq7atCqZ2+Rjtuc++d61Wph4BqEnEklyt1kxDkEpcXul7A1UBQ6VIbGLRclXwyhSr8UScG9Vhwv9jFfPt1ShYYt5APlawD72oP3tiTsYlENm6m+jYT9+BGJsI2n4Cwvs8/z8usbL29/nHSTeyYl9B2sSZhaB/bG+HDP/ohBR5G9YJrze/2qeYTI9Dban6Flo6QEcy7W/J9Y8w+iWryh+mDU7y3cLD+Z7fTZCrml68RamXoVVn6bwS8+AP5wCPn1ES/exwwO97+tce7gr/YX'),
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
