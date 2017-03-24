(function()
{
	// Adds GCP (Google Cloud Platform) shapes
	Sidebar.prototype.addGoogleCloudPlatformCardsPalette = function()
	{
		var sb = this;
		var n = 'dashed=0;html=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp.compute.';
		var n1 = 'dashed=0;html=1;strokeColor=#dddddd;fillcolor=#ffffff;gradientColor=none;shadow=1;strokeWidth=1;';
		var gn = 'mxgraph.gcp.product_cards';
		var dt = 'gcp google cloud platform card';
		var s = 0.3; //scale

		var fns =
		[
			this.addEntry(dt + 'product', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 170, 55), n1);
			   	bg.vertex = true;
			   	var icon = new mxCell('', new mxGeometry(0, 0, s * 129, s * 115), n + 'compute_engine;fillColor=#4387FD;gradientColor=#4683EA;strokeColor=none;');
			   	icon.vertex = true;
			   	icon.geometry.relative = true;
			   	icon.geometry.offset = new mxPoint(10, 10);
			   	bg.insert(icon);
			   	var text1 = new mxCell('Compute Engine', new mxGeometry(0, 0.5, 110, 20), 'text;fontSize=13;fontColor=#808080;align=left;verticalAlign=middle;');
			   	text1.vertex = true;
			   	text1.geometry.relative = true;
			   	text1.geometry.offset = new mxPoint(60, -12);
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Product Card');
			}),

			this.addEntry(dt + 'product', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 190, 55), n1);
			   	bg.vertex = true;
			   	var icon = new mxCell('', new mxGeometry(0, 0, s * 129, s * 115), n + 'compute_engine;fillColor=#4387FD;gradientColor=#4683EA;strokeColor=none;');
			   	icon.vertex = true;
			   	icon.geometry.relative = true;
			   	icon.geometry.offset = new mxPoint(10, 10);
			   	bg.insert(icon);
			   	var text1 = new mxCell('Analytics Backend', new mxGeometry(0, 0.5, 130, 20), 'text;fontSize=13;fontColor=#444444;align=left;verticalAlign=middle;');
			   	text1.vertex = true;
			   	text1.geometry.relative = true;
			   	text1.geometry.offset = new mxPoint(60, -20);
			   	bg.insert(text1);
			   	var text2 = new mxCell('Compute Engine', new mxGeometry(0, 0.5, 130, 20), 'text;fontSize=13;fontColor=#808080;align=left;verticalAlign=middle;');
			   	text2.vertex = true;
			   	text2.geometry.relative = true;
			   	text2.geometry.offset = new mxPoint(60, 0);
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Product Card');
			}),

			this.addEntry(dt + 'product', function()
			{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 190, 55), n1);
			   	bg1.vertex = true;
			   	var icon = new mxCell('', new mxGeometry(0, 0, s * 129, s * 115), n + 'compute_engine;fillColor=#4387FD;gradientColor=#4683EA;strokeColor=none;');
			   	icon.vertex = true;
			   	icon.geometry.relative = true;
			   	icon.geometry.offset = new mxPoint(10, 10);
			   	bg1.insert(icon);
			   	var text1 = new mxCell('Analytics Backend', new mxGeometry(0, 0.5, 130, 20), 'text;fontSize=13;fontColor=#444444;align=left;verticalAlign=middle;');
			   	text1.vertex = true;
			   	text1.geometry.relative = true;
			   	text1.geometry.offset = new mxPoint(60, -20);
			   	bg1.insert(text1);
			   	var text2 = new mxCell('Compute Engine', new mxGeometry(0, 0.5, 130, 20), 'text;fontSize=13;fontColor=#808080;align=left;verticalAlign=middle;');
			   	text2.vertex = true;
			   	text2.geometry.relative = true;
			   	text2.geometry.offset = new mxPoint(60, 0);
			   	bg1.insert(text2);

			   	var bg2 = new mxCell('', new mxGeometry(0, 55, 190, 55), n1);
			   	bg2.vertex = true;
			   	var icon = new mxCell('', new mxGeometry(0, 0, s * 129, s * 115), n + 'compute_engine;fillColor=#4387FD;gradientColor=#4683EA;strokeColor=none;');
			   	icon.vertex = true;
			   	icon.geometry.relative = true;
			   	icon.geometry.offset = new mxPoint(10, 10);
			   	bg2.insert(icon);
			   	var text1 = new mxCell('Analytics Backend', new mxGeometry(0, 0.5, 130, 20), 'text;fontSize=13;fontColor=#444444;align=left;verticalAlign=middle;');
			   	text1.vertex = true;
			   	text1.geometry.relative = true;
			   	text1.geometry.offset = new mxPoint(60, -20);
			   	bg2.insert(text1);
			   	var text2 = new mxCell('Compute Engine', new mxGeometry(0, 0.5, 130, 20), 'text;fontSize=13;fontColor=#808080;align=left;verticalAlign=middle;');
			   	text2.vertex = true;
			   	text2.geometry.relative = true;
			   	text2.geometry.offset = new mxPoint(60, 0);
			   	bg2.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg1, bg2], bg1.geometry.width, bg1.geometry.height * 2, 'Product Card');
			}),

			this.addEntry(dt + 'expanded product', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 190, 80), n1);
			   	bg.vertex = true;
			   	var icon = new mxCell('', new mxGeometry(0, 0, s * 129, s * 115), n + 'compute_engine;fillColor=#4387FD;gradientColor=#4683EA;strokeColor=none;');
			   	icon.vertex = true;
			   	icon.geometry.relative = true;
			   	icon.geometry.offset = new mxPoint(10, 10);
			   	bg.insert(icon);
			   	var text1 = new mxCell('Batch Processing', new mxGeometry(0, 0, 130, 20), 'text;fontSize=13;fontColor=#444444;align=left;verticalAlign=middle;');
			   	text1.vertex = true;
			   	text1.geometry.relative = true;
			   	text1.geometry.offset = new mxPoint(60, 8);
			   	bg.insert(text1);
			   	var text2 = new mxCell('Compute Engine', new mxGeometry(0, 0, 130, 20), 'text;fontSize=13;fontColor=#808080;align=left;verticalAlign=middle;');
			   	text2.vertex = true;
			   	text2.geometry.relative = true;
			   	text2.geometry.offset = new mxPoint(60, 28);
			   	bg.insert(text2);
			   	var part = new mxCell('', new mxGeometry(0, 0, 130, 10), 'shape=line;strokeColor=#dddddd;');
			   	part.vertex = true;
			   	part.geometry.relative = true;
			   	part.geometry.offset = new mxPoint(60, 48);
			   	bg.insert(part);
			   	var text3 = new mxCell('Multiple Instances', new mxGeometry(0, 0, 130, 20), 'text;fontSize=12;fontColor=#444444;align=left;verticalAlign=middle;');
			   	text3.vertex = true;
			   	text3.geometry.relative = true;
			   	text3.geometry.offset = new mxPoint(60, 58);
			   	bg.insert(text3);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Expanded Product Card');
			}),
			
			this.addEntry(dt + 'expanded product', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 150, 100), n1);
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 0, s * 65, s * 58), n + 'compute_engine;fillColor=#757575;gradientColor=none;strokeColor=none;');
			   	icon1.vertex = true;
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(10, 10);
			   	bg.insert(icon1);
			   	var text1 = new mxCell('Compute Engine', new mxGeometry(0, 0, 110, 20), 'text;fontSize=13;fontColor=#444444;align=left;verticalAlign=middle;');
			   	text1.vertex = true;
			   	text1.geometry.relative = true;
			   	text1.geometry.offset = new mxPoint(40, 8);
			   	bg.insert(text1);
			   	var part = new mxCell('', new mxGeometry(0, 0, 110, 10), 'shape=line;strokeColor=#dddddd;');
			   	part.vertex = true;
			   	part.geometry.relative = true;
			   	part.geometry.offset = new mxPoint(40, 28);
			   	bg.insert(part);
			   	var text2 = new mxCell('10GB PD', new mxGeometry(0, 0, 110, 20), 'text;fontSize=12;fontColor=#888888;align=left;verticalAlign=middle;');
			   	text2.vertex = true;
			   	text2.geometry.relative = true;
			   	text2.geometry.offset = new mxPoint(40, 38);
			   	bg.insert(text2);
			   	var icon2 = new mxCell('', new mxGeometry(0, 0, 17, 17), 'dashed=0;html=1;shape=mxgraph.gcp.product_cards.standard_machine;fillColor=#757575;gradientColor=none;strokeColor=none;');
			   	icon2.vertex = true;
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(30, 60);
			   	bg.insert(icon2);
			   	var icon3 = new mxCell('', new mxGeometry(0, 0, 17, 17), 'dashed=0;html=1;shape=mxgraph.gcp.product_cards.disk;fillColor=#757575;gradientColor=none;strokeColor=none;');
			   	icon3.vertex = true;
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(70, 60);
			   	bg.insert(icon3);
			   	var icon4 = new mxCell('', new mxGeometry(0, 0, 17, 17), 'dashed=0;html=1;shape=mxgraph.gcp.product_cards.close;fillColor=#757575;gradientColor=none;strokeColor=none;');
			   	icon4.vertex = true;
			   	icon4.geometry.relative = true;
			   	icon4.geometry.offset = new mxPoint(110, 60);
			   	bg.insert(icon4);
			   	var icon5 = new mxCell('4', new mxGeometry(0, 0, 14, 14), 'dashed=0;html=1;ellipse;fillColor=#3979F1;gradientColor=none;strokeColor=none;fontColor=#FFFFFF;fontSize=10;verticalAlign=middle;spacing=0;spacingBottom=1;');
			   	icon5.vertex = true;
			   	icon5.geometry.relative = true;
			   	icon5.geometry.offset = new mxPoint(22, 68);
			   	bg.insert(icon5);
			   	var icon6 = new mxCell('2', new mxGeometry(0, 0, 14, 14), 'dashed=0;html=1;ellipse;fillColor=#3979F1;gradientColor=none;strokeColor=none;fontColor=#FFFFFF;fontSize=10;verticalAlign=middle;spacing=0;spacingBottom=1;');
			   	icon6.vertex = true;
			   	icon6.geometry.relative = true;
			   	icon6.geometry.offset = new mxPoint(42, 68);
			   	bg.insert(icon6);
			   	var icon7 = new mxCell('1', new mxGeometry(0, 0, 14, 14), 'dashed=0;html=1;ellipse;fillColor=#3979F1;gradientColor=none;strokeColor=none;fontColor=#FFFFFF;fontSize=10;verticalAlign=middle;spacing=0;spacingBottom=1;');
			   	icon7.vertex = true;
			   	icon7.geometry.relative = true;
			   	icon7.geometry.offset = new mxPoint(82, 68);
			   	bg.insert(icon7);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Expanded Product Card');
			}),
			
			this.addEntry(dt + 'service', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 110, 50), n1);
			   	bg.vertex = true;
			   	var icon = new mxCell('', new mxGeometry(0, 0, s * 129, s * 115), n + 'compute_engine;fillColor=#757575;gradientColor=none;strokeColor=none;');
			   	icon.vertex = true;
			   	icon.geometry.relative = true;
			   	icon.geometry.offset = new mxPoint(10, 8);
			   	bg.insert(icon);
			   	var text1 = new mxCell('Local\nCompute', new mxGeometry(0, 0, 60, 50), 'text;fontSize=13;fontColor=#808080;align=left;verticalAlign=middle;');
			   	text1.vertex = true;
			   	text1.geometry.relative = true;
			   	text1.geometry.offset = new mxPoint(50, 0);
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Service Card');
			})


		];

		this.addPalette('gcpCards', 'GCP / Cards', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
