(function()
{
	Sidebar.prototype.addBasicPalette = function()
	{
		var w = 100;
		var h = 100;
		var s = 'strokeWidth=2;whiteSpace=wrap;html=1;shape=mxgraph.basic.';
		var s2 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;strokeWidth=2;shape=mxgraph.basic.';
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;strokeWidth=2;shape=';
		var gn = 'mxgraph.basic';
		var dt = '';
		
		this.addPaletteFunctions('basic', mxResources.get('basic'), false,
		[
			this.createVertexTemplateEntry('whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Square', null, null, 'square'),
			this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Circle', null, null, 'circle'),
			this.createVertexTemplateEntry('shape=ext;double=1;whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Double Square', null, null, 'double square'),
			this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;aspect=fixed;', 80, 80, '', 'Double Circle', null, null, 'double circle'),
			this.createVertexTemplateEntry(s2 + '4_point_star', w, h, '', '4 Point Star', null, null, this.getTagsForStencil(gn, '4_point_star', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + '6_point_star', w, h * 0.9, '', '6 Point Star', null, null, this.getTagsForStencil(gn, '6_point_star', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + '8_point_star', w, h, '', '8 Point Star', null, null, this.getTagsForStencil(gn, '8_point_star', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'banner', w, h * 0.5, '', 'Banner', null, null, this.getTagsForStencil(gn, 'banner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud_callout', w * 0.9, h * 0.6, '', 'Cloud Callout', null, null, this.getTagsForStencil(gn, 'cloud_callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cone', w, h, '', 'Cone', null, null, this.getTagsForStencil(gn, 'cone', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cross2;dx=15;', w, h, '', 'Cross', null, null, this.getTagsForStencil(gn, 'cross', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'document', w, h, '', 'Document', null, null, this.getTagsForStencil(gn, 'document', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'flash', w * 0.6, h, '', 'Flash', null, null, this.getTagsForStencil(gn, 'flash', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'half_circle', w, h * 0.5, '', 'Half Circle', null, null, this.getTagsForStencil(gn, 'half_circle', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'heart', w, h, '', 'Heart', null, null, this.getTagsForStencil(gn, 'heart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'loud_callout', w, h * 0.6, '', 'Loud Callout', null, null, this.getTagsForStencil(gn, 'loud_callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'moon', w * 0.75, h, '', 'Moon', null, null, this.getTagsForStencil(gn, 'moon', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'no_symbol', w, h, '', 'No Symbol', null, null, this.getTagsForStencil(gn, 'no_symbol', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'octagon', w, h, '', 'Octagon', null, null, this.getTagsForStencil(gn, 'octagon', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'orthogonal_triangle', w, h, '', 'Orthogonal Triangle', null, null, this.getTagsForStencil(gn, 'orthogonal_triangle', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'oval_callout', w, h * 0.6, '', 'Oval Callout', null, null, this.getTagsForStencil(gn, 'oval_callout', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'parallelogram;whiteSpace=wrap;align=center;size=0.24;', w, h * 0.6, '', 'Parallelepiped', null, null, this.getTagsForStencil(gn, 'parallelepiped', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pentagon', w, h * 0.9, '', 'Pentagon', null, null, this.getTagsForStencil(gn, 'pentagon', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rectCallout;dx=30;dy=15;', w, h * 0.6, '', 'Rectangular Callout', null, null, this.getTagsForStencil(gn, 'rectangular_callout', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'roundRectCallout;dx=30;dy=15;size=5;', w, h * 0.6, '', 'Rounded Rectangular Callout', null, null, this.getTagsForStencil(gn, 'rectangular_callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'smiley', w, h, '', 'Smiley', null, null, this.getTagsForStencil(gn, 'smiley', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'star', w, h * 0.95, '', 'Star', null, null, this.getTagsForStencil(gn, 'star', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sun', w, h, '', 'Sun', null, null, this.getTagsForStencil(gn, 'sun', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'tick', w * 0.85, h, '', 'Tick', null, null, this.getTagsForStencil(gn, 'tick', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'trapezoid;size=0.24;', w, h, '', 'Trapezoid', null, null, this.getTagsForStencil(gn, 'trapezoid', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'wave2;dy=0.3;', w, h * 0.6, '', 'Wave', null, null, this.getTagsForStencil(gn, 'wave', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'x', w, h, '', 'X', null, null, this.getTagsForStencil(gn, 'x', dt).join(' '))
			
		]);
	};

})();
