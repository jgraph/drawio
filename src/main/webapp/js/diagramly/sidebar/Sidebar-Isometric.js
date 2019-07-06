(function()
{
	// Adds Isometric shapes
	Sidebar.prototype.addIsometricPalette = function()
	{
		var w = 100;
		var h = 100;
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;' + mxConstants.STYLE_STROKEWIDTH + '=1;align=center;outlineConnect=0;dashed=0;outlineConnect=0;shape=mxgraph.isometric.';
		var s2 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shape=';
		var gn = 'mxgraph.isometric';
		var dt = 'isometric generic';

		this.addPaletteFunctions('isometric', 'Isometric', false,
		[
			this.createVertexTemplateEntry(s + 'shape;fillColor=#ECECEC;strokeColor=#5E5E5E;aspect=fixed;', 
					w * 1.23, h * 1.06, '', 'Generic Isometric Shape', null, null, this.getTagsForStencil(gn, 'generic isometric shape', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'shape;fillColor=#ECECEC;strokeColor=#5E5E5E;aspect=fixed;isoAngle=45;', 
					w * 1.23, h * 1.6, '', 'Generic Isometric Shape Angle', null, null, this.getTagsForStencil(gn, 'generic isometric shape angle', dt).join(' ')),
			// this.createVertexTemplateEntry(s + 'shape;fillColor=#ECECEC;strokeColor=#5E5E5E;aspect=fixed;container=1;', 
			// 		w * 1.23, h * 1.06, '', 'Generic Isometric Container Shape', null, null, this.getTagsForStencil(gn, 'generic isometric container shape', dt).join(' ')),
			this.addEntry('generic isometric shape group container', function()
			{
				var newW = w * 1.23;
				var newH = h * 1.06;
				var cell = new mxCell('', new mxGeometry(0, 0, newW, newH),
				s + 'shape;fillColor=#ECECEC;strokeColor=#5E5E5E;aspect=fixed;container=1;collapsible=0;');
				cell.vertex = true;

				var symbol = new mxCell('', new mxGeometry(20, -5, 84, 84), s2 + 'mxgraph.basic.6_point_star;fillColor=#5E5E5E;fillColor=#5E5E5E;aspect=fixed;isoAngle=30;gradientColor=none;');

				symbol.vertex = true;
				cell.insert(symbol);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Generic Isometric Shape Group Container');
			}),
			this.addEntry('generic isometric image group container', function()
			{
				var newW = w * 1.23;
				var newH = h * 1.06;
				var cell = new mxCell('', new mxGeometry(0, 0, newW, newH),
				s + 'shape;fillColor=#ECECEC;strokeColor=#5E5E5E;aspect=fixed;container=1;collapsible=0;');
				cell.vertex = true;

				var symbol = new mxCell('', new mxGeometry(25, 0, 74, 74), 'image;fillColor=#ECECEC;strokeColor=#5E5E5E;aspect=fixed;isoAngle=30;image=img/lib/active_directory/active_directory.svg;');
				
				symbol.vertex = true;
				cell.insert(symbol);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Generic Isometric Image Group Container');
			}),
			this.createVertexTemplateEntry(s + 'shape;fillColor=#ECECEC;strokeColor=#5E5E5E;icon=img/lib/active_directory/active_directory.svg;isoAngle=20;', 
					w * 1.23, h * 1.06, '', 'Generic Isometric Shape Image', null, null, this.getTagsForStencil(gn, 'generic isometric shape image', dt).join(' ')),
			// this.createVertexTemplateEntry(s + 'shape;fillColor=#ECECEC;strokeColor=#5E5E5E;icon=mxgraph.basic.6_point_star;isoAngle=20;', 
			// 		w * 1.23, h * 1.06, '', 'Generic Isometric Shape Image', null, null, this.getTagsForStencil(gn, 'generic isometric shape image', dt).join(' ')),
			this.createVertexTemplateEntry('image;fillColor=#ECECEC;strokeColor=#5E5E5E;aspect=fixed;isoAngle=30;image=img/lib/active_directory/active_directory.svg;', 
					w * 1.23, h * 1.06, '', 'Isometric Image', null, null, this.getTagsForStencil(gn, 'isometric image', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'mxgraph.basic.6_point_star;fillColor=#5E5E5E;fillColor=#5E5E5E;aspect=fixed;isoAngle=30;gradientColor=none;',
					w * 1.23, h * 1.06, '', 'Isometric Shape', null, null, this.getTagsForStencil(gn, 'isometric shape', dt).join(' ')),

			this.createVertexTemplateEntry(s + 'arrowNE;fillColor=#000000;aspect=fixed;', 
					w * 0.455, h * 0.26, '', 'Arrow NE', null, null, this.getTagsForStencil(gn, 'arrow ne north east northeast', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'arrowSE;fillColor=#000000;aspect=fixed;', 
					w * 0.455, h * 0.26, '', 'Arrow SE', null, null, this.getTagsForStencil(gn, 'arrow ne north east northeast', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'arrowSW;fillColor=#000000;aspect=fixed;', 
					w * 0.455, h * 0.26, '', 'Arrow SW', null, null, this.getTagsForStencil(gn, 'arrow ne north east northeast', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'arrowNW;fillColor=#000000;aspect=fixed;', 
					w * 0.455, h * 0.26, '', 'Arrow NW', null, null, this.getTagsForStencil(gn, 'arrow ne north east northeast', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'arrowlessNE;fillColor=#000000;aspect=fixed;', 
					w * 0.316, h * 0.18, '', 'Arrowless NE', null, null, this.getTagsForStencil(gn, 'arrow ne north east northeast', dt).join(' ')),
		 	this.createEdgeTemplateEntry('edgeStyle=isometricEdgeStyle;endArrow=none;html=1;', 50, 100, 'isometric edge', 'Isometric Edge 1'),
		 	this.createEdgeTemplateEntry('edgeStyle=isometricEdgeStyle;endArrow=none;html=1;elbow=vertical;', 50, 100, 'isometric edge', 'Isometric Edge 2')
		]);
	};

})();
