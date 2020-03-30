(function()
{
	Sidebar.prototype.addC4Palette = function()
	{
		var w = 100;
		var h = 100;
		var gn = 'mxgraph.c4';
		var dt = 'c4 ';
		var pts = 'points=[[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];';
		
		this.addPaletteFunctions('c4', 'C4', false,
		[
			this.createVertexTemplateEntry(
					'html=1;dashed=0;whitespace=wrap;fillColor=#DAE8FC;strokeColor=#6C8EBF;shape=mxgraph.c4.person;align=center;points=[[0.5,0,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0]];', 
					w * 1.1, h * 1.4, 
					'<b>name</b><div>[Person]</div><br><div>Description</div>', 
					'Person', null, null, this.getTagsForStencil(gn, 'person', dt).join(' ')),
			this.createVertexTemplateEntry('rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#dae8fc;fontColor=#000000;align=center;arcSize=10;strokeColor=#6c8ebf;' + pts, w * 1.6, h * 1.1, 
					'<b>name</b><div>[Software System]</div><br><div>Description</div>', 
					'Software System', null, null, this.getTagsForStencil(gn, 'software system', dt).join(' ')),
			this.createVertexTemplateEntry('rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#dae8fc;fontColor=#000000;align=center;arcSize=10;strokeColor=#6c8ebf;' + pts, w * 1.6, h * 1.1, 
					'<span><b>name</b></span><br><div>[Container:&nbsp;<span>technology</span><span>]</span></div><br><div>Description</div>', 
					'Container', null, null, this.getTagsForStencil(gn, 'container', dt).join(' ')),
			this.createVertexTemplateEntry('rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#ffffff;fontColor=#000000;align=left;arcSize=5;strokeColor=#000000;verticalAlign=bottom;' + pts, w * 2, h * 1.7, 
					'<div style="text-align: left">name</div><div style="text-align: left">[applicationAndVersion]</div>', 
					'Component', null, null, this.getTagsForStencil(gn, 'component', dt).join(' ')),
			this.createVertexTemplateEntry('rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#ffffff;fontColor=#000000;align=left;arcSize=5;strokeColor=#000000;verticalAlign=bottom;' + pts, w * 2.4, h * 2.3, 
					'<div style="text-align: left">hostname</div><div style="text-align: left">[operationSystem]</div><div style="text-align: right">scalingFactor</div>', 
					'Code Element', null, null, this.getTagsForStencil(gn, 'component', dt).join(' ')),
			this.createVertexTemplateEntry(
					'shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;rounded=0;labelBackgroundColor=none;fillColor=#dae8fc;fontSize=12;fontColor=#000000;align=center;strokeColor=#6c8ebf;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];', 
					w * 1.6, h * 1.4, 
					'<span>Database</span><div>[Container:&nbsp;technology]</div><br><div>Description</div>', 
					'Database', null, null, this.getTagsForStencil(gn, 'database', dt).join(' ')),
		 	this.createEdgeTemplateEntry('edgeStyle=none;rounded=0;html=1;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;strokeColor=#A8A8A8;strokeWidth=2;fontColor=#000000;jumpStyle=none;dashed=1;', w * 2, 0, 
		 			'<div style="text-align: left"><div style="text-align: center"><b>Description</b></div><div style="text-align: center">[technology]</div></div>', 
		 			'Relationship', null, dt + 'relationship')
		]);
};
		
})();
