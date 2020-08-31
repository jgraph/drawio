(function()
{
	Sidebar.prototype.addThreatModelingPalette = function()
	{
		var w = 100;
		var h = 100;
		var gn = '';
		var dt = 'threat modeling ';
		this.setCurrentSearchEntryLibrary('threatModeling');
		
		this.addPaletteFunctions('threatModeling', 'Threat Modeling', false,
		[
			this.createVertexTemplateEntry('rounded=0;whiteSpace=wrap;html=1;', w * 1.2, h * 0.6, '', 'External Entity', null, null, this.getTagsForStencil(gn, 'external entity', dt).join(' ')),
			this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;aspect=fixed;', w * 0.8, h * 0.8, '', 'Process', null, null, this.getTagsForStencil(gn, 'process', dt).join(' ')),
			this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;aspect=fixed;', w * 0.8, h * 0.8, '', 'Multi-Process', null, null, this.getTagsForStencil(gn, 'multi process', dt).join(' ')),
			this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;left=0;right=0;fillColor=none;', w * 1.2, h * 0.8, '', 'Data Store', null, null, this.getTagsForStencil(gn, 'data store', dt).join(' ')),
		 	this.createEdgeTemplateEntry('endArrow=classic;html=1;fontColor=#FF3333;', w * 0.5, h * 0.5, '', 'Data Flow', null, dt + 'data flow'),
		 	this.createEdgeTemplateEntry('endArrow=classic;startArrow=classic;html=1;fontColor=#FF3333;', w * 0.5, h * 0.5, '', 'Bidirectional Data Flow', null, dt + 'bidirectional data flow'),
			this.createVertexTemplateEntry('html=1;fontColor=#FF3333;fontStyle=1;align=left;verticalAlign=top;spacing=0;labelBorderColor=none;fillColor=none;dashed=1;strokeWidth=2;strokeColor=#FF3333;spacingLeft=4;spacingTop=-3;', w * 2.9, h * 1.4, 'Trust Boundary', 'Trust Boundary', null, null, this.getTagsForStencil(gn, 'trust boundary', dt).join(' ')),
			this.createVertexTemplateEntry('shape=requiredInterface;html=1;verticalLabelPosition=bottom;dashed=1;strokeColor=#FF3333;strokeWidth=2;fillColor=none;fontColor=#FF3333;align=left;', w * 0.2, h * 3.3, '', 'Trust Boundary', null, null, this.getTagsForStencil(gn, 'trust boundary', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;', w * 0.8, h * 0.2, 'Label', 'Label', null, null, this.getTagsForStencil(gn, 'label', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#d6b656;fillColor=#fff2cc;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;', w * 0.4, h * 0.2, 'A01', 'Asset Label', null, null, this.getTagsForStencil(gn, 'asset label', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#82b366;fillColor=#d5e8d4;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;', w * 0.3, h * 0.2, 'C01', 'Security Control Label', null, null, this.getTagsForStencil(gn, 'security control label', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#b85450;fillColor=#f8cecc;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;', w * 0.4, h * 0.2, 'TA01', 'Threat Actor Label', null, null, this.getTagsForStencil(gn, 'threat actor label', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#c0c0c0;fillColor=#ffffff;overflow=fill;rounded=0;shadow=1;labelBackgroundColor=#ffffff;fontColor=#000000;align=left;', w * 3.9, h * 1.1, 
					'<table border="1" width="100%" style="width: 100% ; height: 100% ; border-collapse: collapse ; border: 1px solid #d6b656"><tbody><tr style="background-color: #fff2cc ; color: #000000 ; border: 1px solid #d6b656"><th align="center" colspan="2">Assets</th></tr><tr style="background-color: #fff2cc ; color: #000000 ; border: 1px solid #d6b656"><th align="left" style="border: 1px solid #d6b656">ID</th><th align="left" style="border: 1px solid #d6b656">Description</th></tr><tr><td style="border: 1px solid #d6b656">A01</td><td style="border: 1px solid #d6b656"></td></tr></tbody></table>', 
					'Asset Table', null, null, this.getTagsForStencil(gn, 'asset table', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#c0c0c0;fillColor=#ffffff;overflow=fill;rounded=0;shadow=1;labelBackgroundColor=#ffffff;fontColor=#000000;align=left;', w * 3.65, h * 0.9, 
					'<table border="1" width="100%" style="width: 100% ; height: 100% ; border-collapse: collapse ; border: 1px solid #b85450"><tbody><tr style="background-color: #f8cecc ; color: #000000 ; border: 1px solid #b85450"><th align="center" colspan="2">Threat Actors</th></tr><tr style="background-color: #f8cecc ; color: #000000 ; border: 1px solid #b85450"><th align="left" style="border: 1px solid #b85450">ID</th><th align="left" style="border: 1px solid #b85450">Description</th></tr><tr><td style="border: 1px solid #b85450">TA01</td><td style="border: 1px solid #b85450"></td></tr></tbody></table>', 
					'Threat Actor Table', null, null, this.getTagsForStencil(gn, 'threat actor table', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#c0c0c0;fillColor=#ffffff;overflow=fill;rounded=0;shadow=1;labelBackgroundColor=#ffffff;fontColor=#000000;align=left;', w * 3.65, h * 0.9, 
					'<table border="1" width="100%" style="width: 100% ; height: 100% ; border-collapse: collapse ; border: 1px solid #82b366"><tbody><tr style="background-color: #d5e8d4 ; color: #000000 ; border: 1px solid #82b366"><th align="center" colspan="2">Security Controls</th></tr><tr style="background-color: #d5e8d4 ; color: #000000 ; border: 1px solid #82b366"><th align="left" style="border: 1px solid #82b366">ID</th><th align="left" style="border: 1px solid #82b366">Description</th></tr><tr><td style="border: 1px solid #82b366">C01</td><td style="border: 1px solid #82b366"></td></tr></tbody></table>', 
					'Security Control Table', null, null, this.getTagsForStencil(gn, 'security control table', dt).join(' ')),
			this.createVertexTemplateEntry('shape=note;strokeWidth=2;fontSize=14;size=20;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontColor=#666600;', w * 1.1, h * 0.8, 'Note', 'Note', null, null, this.getTagsForStencil(gn, 'note', dt).join(' ')),
			this.createVertexTemplateEntry('shape=or;whiteSpace=wrap;html=1;direction=north;fillColor=#dae8fc;strokeColor=#6c8ebf;', w * 1.2, h * 0.8, 'AND', 'AND Gate', null, null, this.getTagsForStencil(gn, 'and gate', dt).join(' ')),
			this.createVertexTemplateEntry('shape=xor;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;direction=north;', w * 1.2, h * 0.8, 'OR', 'OR Gate', null, null, this.getTagsForStencil(gn, 'or gate', dt).join(' ')),
			this.createVertexTemplateEntry('rounded=0;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;', w * 1.2, h * 0.8, 'Leaf', 'Leaf Node', null, null, this.getTagsForStencil(gn, 'leaf node', dt).join(' '))
		]);
		
		this.setCurrentSearchEntryLibrary();
	};
})();
