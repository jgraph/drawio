(function()
{
	// Adds Salesforce stencils
	Sidebar.prototype.addSalesforcePalette = function()
	{
		var w = 60;
		var h = 60;

		this.setCurrentSearchEntryLibrary('salesforce', 'salesforceComponents');
		this.addSalesforceComponentsPalette(w, h);
		this.setCurrentSearchEntryLibrary('salesforce', 'salesforceProduct');
		this.addSalesforceProductPalette(w, h);
		this.setCurrentSearchEntryLibrary('salesforce', 'salesforcePlatform');
		this.addSalesforcePlatformPalette(w, h);
		this.setCurrentSearchEntryLibrary('salesforce', 'salesforceIndustry');
		this.addSalesforceIndustryPalette(w, h);
		this.setCurrentSearchEntryLibrary();
	};
	
	
	Sidebar.prototype.addSalesforceComponentsPalette = function(w, h)
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;html=1;shape=mxgraph.salesforce.';
		var gn = 'mxgraph.salesforce';
		var dt = 'salesforce components ';
		
		this.addPaletteFunctions('salesforceComponents', 'Salesforce / Components', false,
		[
		   	this.addEntry(dt + 'header', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 930, 160), 
					'strokeColor=none;fillColor=#d9d9d9;');
			   	bg.vertex = true;
			   	
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 350, 160), 
					'shape=delay;whiteSpace=wrap;html=1;strokeColor=none;resizeHeight=1;part=1;');
			   	item1.geometry.relative = true;
			   	item1.vertex = true;
			   	bg.insert(item1);
			    
			   	var item2 = new mxCell('Your Logo Here', new mxGeometry(0, 0, 90, 20), 
					'rounded=0;whiteSpace=wrap;html=1;fillColor=#fd7298;strokeColor=none;align=left;spacingLeft=5;fontSize=10;part=1;');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(20, 10);
			   	item2.vertex = true;
			   	item1.insert(item2);
			    
			   	var item3 = new mxCell('<h3><font style="font-weight: normal; font-size: 14px;">Diagram Title Goes Here</font></h3><p><font style="font-size: 9px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac semper velit. Quisque eget elit eros. Donec ullamcorper, sem viverra convallis cursus, ex eros aliquam ante, nec bibendum lacus augue non tellus.</font></p>', 
					new mxGeometry(0, 0, 310, 100), 
					'text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;rounded=0;part=1;');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(20, 40);
			   	item3.vertex = true;
			   	item1.insert(item3);
			    
			   	var item4 = new mxCell('Key', 
					new mxGeometry(1, 0, 270, 120), 
					'rounded=1;whiteSpace=wrap;html=1;strokeColor=none;verticalAlign=top;align=left;spacingLeft=10;fontSize=11;part=1;');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(-290, 20);
			   	item4.vertex = true;
			   	bg.insert(item4);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Header');
			}),

		   	this.addEntry(dt + 'header', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 930, 160), 
					'strokeColor=none;fillColor=#d9d9d9;');
			   	bg.vertex = true;
			   	
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 480, 160), 
					'shape=delay;whiteSpace=wrap;html=1;strokeColor=none;resizeHeight=1;part=1;');
			   	item1.geometry.relative = true;
			   	item1.vertex = true;
			   	bg.insert(item1);
			    
			   	var item2 = new mxCell('Your Logo Here', new mxGeometry(0, 0, 90, 20), 
					'rounded=0;whiteSpace=wrap;html=1;fillColor=#fd7298;strokeColor=none;align=left;spacingLeft=5;fontSize=10;part=1;');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(20, 10);
			   	item2.vertex = true;
			   	item1.insert(item2);
			    
			   	var item3 = new mxCell('<h3><font style="font-weight: normal; font-size: 14px;">A Very, Very, Long Diagram Title Should Go Right Here</font></h3><p><font style="font-size: 9px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac semper velit. Quisque eget elit eros. Donec ullamcorper, sem viverra convallis cursus, ex eros aliquam ante, nec bibendum lacus augue non tellus.</font></p>', 
					new mxGeometry(0, 0, 440, 100), 
					'text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;rounded=0;part=1;');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(20, 40);
			   	item3.vertex = true;
			   	item1.insert(item3);
			    
			   	var item4 = new mxCell('Larger Key', 
					new mxGeometry(1, 0, 410, 120), 
					'rounded=1;whiteSpace=wrap;html=1;strokeColor=none;verticalAlign=top;align=left;spacingLeft=10;fontSize=11;part=1;');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(-430, 20);
			   	item4.vertex = true;
			   	bg.insert(item4);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Header');
			}),

		   	this.addEntry(dt + 'card', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 200, 240), 
					'rounded=1;whiteSpace=wrap;html=1;strokeColor=#B3B3B3;arcSize=20;absoluteArcSize=1;');
			   	bg.vertex = true;
			   	
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 46, 46), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item1.geometry.relative = true;
			   	item1.geometry.offset = new mxPoint(15, 10);
			   	item1.vertex = true;
			   	bg.insert(item1);
			    
			   	var item2 = new mxCell('', new mxGeometry(0.5, 0.5, 19, 19), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-9.5, -9.5);
			   	item2.vertex = true;
			   	item1.insert(item2);
			    
			   	var item3 = new mxCell('Card Title', 
					new mxGeometry(1, 0, 130, 30), 
					'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;right=0;fontStyle=1;align=left;strokeColor=#B3B3B3;part=1;');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(-130, 20);
			   	item3.vertex = true;
			   	bg.insert(item3);
			    
			   	var item4 = new mxCell('Attribute One', 
					new mxGeometry(1, 0, 130, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;part=1;');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(-130, 54);
			   	item4.vertex = true;
			   	bg.insert(item4);
			    
			   	var item5 = new mxCell('Attribute 02', 
					new mxGeometry(1, 0, 130, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;part=1;');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(-130, 78);
			   	item5.vertex = true;
			   	bg.insert(item5);
			    
			   	var item6 = new mxCell('Attribute Three 03', 
					new mxGeometry(1, 0, 130, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;part=1;');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(-130, 102);
			   	item6.vertex = true;
			   	bg.insert(item6);
			    
			   	var item7 = new mxCell('A long footer title can go here and wraps text', 
					new mxGeometry(0, 0, 200, 48), 
					'text;html=1;strokeColor=none;fillColor=#e5e5e5;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=11;spacingLeft=5;resizeWidth=1;part=1;');
			   	item7.geometry.relative = true;
			   	item7.geometry.offset = new mxPoint(0, 126);
			   	item7.vertex = true;
			   	bg.insert(item7);
			    
			   	var item8 = new mxCell('', new mxGeometry(0.5, 1, 40, 40), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item8.geometry.relative = true;
			   	item8.geometry.offset = new mxPoint(-50, -55);
			   	item8.vertex = true;
			   	bg.insert(item8);
			    
			   	var item9 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item9.geometry.relative = true;
			   	item9.geometry.offset = new mxPoint(-8, -8);
			   	item9.vertex = true;
			   	item8.insert(item9);
			    
			   	var item10 = new mxCell('', new mxGeometry(0.5, 1, 40, 40), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item10.geometry.relative = true;
			   	item10.geometry.offset = new mxPoint(10, -55);
			   	item10.vertex = true;
			   	bg.insert(item10);
			    
			   	var item11 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item11.geometry.relative = true;
			   	item11.geometry.offset = new mxPoint(-8, -8);
			   	item11.vertex = true;
			   	item10.insert(item11);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Card');
			}),

		   	this.addEntry(dt + 'card', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 200, 220), 
					'rounded=1;whiteSpace=wrap;html=1;strokeColor=#B3B3B3;arcSize=20;absoluteArcSize=1;');
			   	bg.vertex = true;
			   	
			   	var item3 = new mxCell('Card Title', 
					new mxGeometry(0, 0, 200, 30), 
					'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;right=0;fontStyle=1;align=left;strokeColor=#B3B3B3;spacingLeft=15;part=1;resizeWidth=1;');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(0, 20);
			   	item3.vertex = true;
			   	bg.insert(item3);
			    
			   	var item4 = new mxCell('Attribute One', 
					new mxGeometry(0, 0, 200, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;spacingLeft=15;part=1;resizeWidth=1;');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(0, 54);
			   	item4.vertex = true;
			   	bg.insert(item4);
			    
			   	var item5 = new mxCell('Attribute 02', 
					new mxGeometry(0, 0, 200, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;spacingLeft=15;part=1;resizeWidth=1;');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(0, 78);
			   	item5.vertex = true;
			   	bg.insert(item5);
			    
			   	var item6 = new mxCell('Attribute Three 03', 
					new mxGeometry(0, 0, 200, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;spacingLeft=15;part=1;resizeWidth=1;');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(0, 102);
			   	item6.vertex = true;
			   	bg.insert(item6);
			    
			   	var item7 = new mxCell('Footer Title', 
					new mxGeometry(0, 0, 200, 24), 
					'text;html=1;strokeColor=none;fillColor=#e5e5e5;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=11;spacingLeft=5;resizeWidth=1;part=1;');
			   	item7.geometry.relative = true;
			   	item7.geometry.offset = new mxPoint(0, 126);
			   	item7.vertex = true;
			   	bg.insert(item7);
			    
			   	var item8 = new mxCell('', new mxGeometry(0.5, 1, 36, 36), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item8.geometry.relative = true;
			   	item8.geometry.offset = new mxPoint(-86, -55);
			   	item8.vertex = true;
			   	bg.insert(item8);
			    
			   	var item9 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item9.geometry.relative = true;
			   	item9.geometry.offset = new mxPoint(-8, -8);
			   	item9.vertex = true;
			   	item8.insert(item9);
			    
			   	var item10 = new mxCell('', new mxGeometry(0.5, 1, 36, 36), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item10.geometry.relative = true;
			   	item10.geometry.offset = new mxPoint(-41, -55);
			   	item10.vertex = true;
			   	bg.insert(item10);
			    
			   	var item11 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item11.geometry.relative = true;
			   	item11.geometry.offset = new mxPoint(-8, -8);
			   	item11.vertex = true;
			   	item10.insert(item11);
			    
			   	var item12 = new mxCell('', new mxGeometry(0.5, 1, 36, 36), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item12.geometry.relative = true;
			   	item12.geometry.offset = new mxPoint(5, -55);
			   	item12.vertex = true;
			   	bg.insert(item12);
			    
			   	var item13 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item13.geometry.relative = true;
			   	item13.geometry.offset = new mxPoint(-8, -8);
			   	item13.vertex = true;
			   	item12.insert(item13);
			    
			   	var item14 = new mxCell('', new mxGeometry(0.5, 1, 36, 36), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item14.geometry.relative = true;
			   	item14.geometry.offset = new mxPoint(50, -55);
			   	item14.vertex = true;
			   	bg.insert(item14);
			    
			   	var item15 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item15.geometry.relative = true;
			   	item15.geometry.offset = new mxPoint(-8, -8);
			   	item15.vertex = true;
			   	item14.insert(item15);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Card');
			}),

		   	this.addEntry(dt + 'card', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 200, 170), 
					'rounded=1;whiteSpace=wrap;html=1;strokeColor=#B3B3B3;arcSize=20;absoluteArcSize=1;');
			   	bg.vertex = true;
			   	
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 46, 46), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item1.geometry.relative = true;
			   	item1.geometry.offset = new mxPoint(15, 10);
			   	item1.vertex = true;
			   	bg.insert(item1);
			    
			   	var item2 = new mxCell('', new mxGeometry(0.5, 0.5, 19, 19), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-9.5, -9.5);
			   	item2.vertex = true;
			   	item1.insert(item2);
			    
			   	var item3 = new mxCell('Card Title', 
					new mxGeometry(1, 0, 130, 30), 
					'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;right=0;fontStyle=1;align=left;strokeColor=#B3B3B3;part=1;');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(-130, 20);
			   	item3.vertex = true;
			   	bg.insert(item3);
			    
			   	var item4 = new mxCell('Attribute One', 
					new mxGeometry(1, 0, 130, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;part=1;');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(-130, 54);
			   	item4.vertex = true;
			   	bg.insert(item4);
			    
			   	var item5 = new mxCell('Attribute 02', 
					new mxGeometry(1, 0, 130, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;part=1;');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(-130, 78);
			   	item5.vertex = true;
			   	bg.insert(item5);
			    
			   	var item8 = new mxCell('', new mxGeometry(0.5, 1, 36, 36), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item8.geometry.relative = true;
			   	item8.geometry.offset = new mxPoint(-86, -55);
			   	item8.vertex = true;
			   	bg.insert(item8);
			    
			   	var item9 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item9.geometry.relative = true;
			   	item9.geometry.offset = new mxPoint(-8, -8);
			   	item9.vertex = true;
			   	item8.insert(item9);
			    
			   	var item10 = new mxCell('', new mxGeometry(0.5, 1, 36, 36), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item10.geometry.relative = true;
			   	item10.geometry.offset = new mxPoint(-41, -55);
			   	item10.vertex = true;
			   	bg.insert(item10);
			    
			   	var item11 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item11.geometry.relative = true;
			   	item11.geometry.offset = new mxPoint(-8, -8);
			   	item11.vertex = true;
			   	item10.insert(item11);
			    
			   	var item12 = new mxCell('', new mxGeometry(0.5, 1, 36, 36), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item12.geometry.relative = true;
			   	item12.geometry.offset = new mxPoint(5, -55);
			   	item12.vertex = true;
			   	bg.insert(item12);
			    
			   	var item13 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item13.geometry.relative = true;
			   	item13.geometry.offset = new mxPoint(-8, -8);
			   	item13.vertex = true;
			   	item12.insert(item13);
			    
			   	var item14 = new mxCell('', new mxGeometry(0.5, 1, 36, 36), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item14.geometry.relative = true;
			   	item14.geometry.offset = new mxPoint(50, -55);
			   	item14.vertex = true;
			   	bg.insert(item14);
			    
			   	var item15 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item15.geometry.relative = true;
			   	item15.geometry.offset = new mxPoint(-8, -8);
			   	item15.vertex = true;
			   	item14.insert(item15);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Card');
			}),

		   	this.addEntry(dt + 'card', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 200, 190), 
					'rounded=1;whiteSpace=wrap;html=1;strokeColor=#B3B3B3;arcSize=20;absoluteArcSize=1;');
			   	bg.vertex = true;
			   	
			   	var item3 = new mxCell('Card Title', 
					new mxGeometry(0, 0, 200, 30), 
					'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;right=0;fontStyle=1;align=left;strokeColor=#B3B3B3;spacingLeft=15;part=1;resizeWidth=1;');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(0, 20);
			   	item3.vertex = true;
			   	bg.insert(item3);
			    
			   	var item4 = new mxCell('Attribute One', 
					new mxGeometry(0, 0, 200, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;spacingLeft=15;part=1;resizeWidth=1;');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(0, 54);
			   	item4.vertex = true;
			   	bg.insert(item4);
			    
			   	var item5 = new mxCell('Attribute 02', 
					new mxGeometry(0, 0, 200, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;spacingLeft=15;part=1;resizeWidth=1;');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(0, 78);
			   	item5.vertex = true;
			   	bg.insert(item5);
			    
			   	var item6 = new mxCell('Attribute Three 03', 
					new mxGeometry(0, 0, 200, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;spacingLeft=15;part=1;resizeWidth=1;');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(0, 102);
			   	item6.vertex = true;
			   	bg.insert(item6);
			    
			   	var item7 = new mxCell('Attribute 04', 
					new mxGeometry(0, 0, 200, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;spacingLeft=15;part=1;resizeWidth=1;');
			   	item7.geometry.relative = true;
			   	item7.geometry.offset = new mxPoint(0, 126);
			   	item7.vertex = true;
			   	bg.insert(item7);
			    
			   	var item8 = new mxCell('Attribute 05', 
					new mxGeometry(0, 0, 200, 24), 
					'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;spacingLeft=15;part=1;resizeWidth=1;');
			   	item8.geometry.relative = true;
			   	item8.geometry.offset = new mxPoint(0, 150);
			   	item8.vertex = true;
			   	bg.insert(item8);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Card');
			}),

		   	this.addEntry(dt + 'card', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 200, 70), 
					'rounded=1;whiteSpace=wrap;html=1;strokeColor=#B3B3B3;arcSize=20;absoluteArcSize=1;');
			   	bg.vertex = true;
			   	
			   	var item3 = new mxCell('Card Title', 
					new mxGeometry(0, 0, 200, 30), 
					'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;right=0;fontStyle=1;align=left;strokeColor=#B3B3B3;spacingLeft=15;part=1;resizeWidth=1;');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(0, 20);
			   	item3.vertex = true;
			   	bg.insert(item3);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Card');
			}),

		   	this.addEntry(dt + 'card', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 200, 70), 
					'rounded=1;whiteSpace=wrap;html=1;strokeColor=#B3B3B3;arcSize=20;absoluteArcSize=1;');
			   	bg.vertex = true;
			   	
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 46, 46), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item1.geometry.relative = true;
			   	item1.geometry.offset = new mxPoint(15, 10);
			   	item1.vertex = true;
			   	bg.insert(item1);
			    
			   	var item2 = new mxCell('', new mxGeometry(0.5, 0.5, 19, 19), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-9.5, -9.5);
			   	item2.vertex = true;
			   	item1.insert(item2);
			    
			   	var item3 = new mxCell('Card Title', 
					new mxGeometry(1, 0, 130, 30), 
					'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;right=0;fontStyle=1;align=left;strokeColor=#B3B3B3;part=1;');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(-130, 20);
			   	item3.vertex = true;
			   	bg.insert(item3);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Card');
			}),

		   	this.addEntry(dt + 'card', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 220, 160), 
					'rounded=1;whiteSpace=wrap;html=1;strokeColor=#B3B3B3;arcSize=20;absoluteArcSize=1;collapsible=0;recursiveResize=1;');
			   	bg.vertex = true;
			   	
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 46, 46), 
					'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=none;fillColor=#e5e5e5;part=1;');
			   	item1.geometry.relative = true;
			   	item1.geometry.offset = new mxPoint(15, 10);
			   	item1.vertex = true;
			   	bg.insert(item1);
			    
			   	var item2 = new mxCell('', new mxGeometry(0.5, 0.5, 19, 19), 
					'html=1;strokeColor=none;fillColor=#fd7298;part=1;');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-9.5, -9.5);
			   	item2.vertex = true;
			   	item1.insert(item2);
			    
			   	var item3 = new mxCell('Card Title', 
					new mxGeometry(1, 0, 130, 30), 
					'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;right=0;fontStyle=1;align=left;strokeColor=#B3B3B3;part=1;');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(-130, 20);
			   	item3.vertex = true;
			   	bg.insert(item3);
			    
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 200, 70), 
					'shape=rect;rounded=1;whiteSpace=wrap;html=1;strokeColor=#B3B3B3;arcSize=20;absoluteArcSize=1;part=1;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(10, 70);
			   	bg2.vertex = true;
			   	bg.insert(bg2);

			   	var item4 = new mxCell('Card Title', 
					new mxGeometry(0, 0, 200, 30), 
					'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;right=0;fontStyle=1;align=left;strokeColor=#B3B3B3;spacingLeft=15;part=1;resizeWidth=1;');
			   	item4.geometry.relative = true;
			   	item4.vertex = true;
			   	bg2.insert(item4);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Card');
			}),

			this.addEntry('relationship', function()
			{
		    	var cell1 = new mxCell('Relationship', new mxGeometry(50, 0, 80, 30), 'html=1;rounded=1;absoluteArcSize=1;arcSize=80;whiteSpace=wrap;fontSize=11;');
		    	cell1.vertex = true;

				var edge1 = new mxCell('', new mxGeometry(0, 0, 50, 0), 'edgeStyle=entityRelationEdgeStyle;html=1;startArrow=manyOptional;startFill=1;endArrow=none;rounded=0;endFill=0;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 15), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				
				var edge2 = new mxCell('', new mxGeometry(0, 0, 180, 0), 'edgeStyle=entityRelationEdgeStyle;html=1;endArrow=manyOptional;endFill=1;startArrow=none;rounded=0;startFill=0;');
				edge2.geometry.setTerminalPoint(new mxPoint(180, 15), false);
				edge2.geometry.relative = true;
				edge2.edge = true;
				cell1.insertEdge(edge2, true);

				return sb.createEdgeTemplateFromCells([edge1, cell1, edge2], 130, 30, 'Relationship');
			}),

			this.addEntry('relationship', function()
			{
		    	var cell1 = new mxCell('Relationship', new mxGeometry(50, 0, 80, 30), 'html=1;rounded=1;absoluteArcSize=1;arcSize=80;whiteSpace=wrap;fontSize=11;');
		    	cell1.vertex = true;

				var edge1 = new mxCell('', new mxGeometry(0, 0, 50, 0), 'edgeStyle=entityRelationEdgeStyle;html=1;startArrow=manyOptional;startFill=0;endArrow=none;rounded=0;endFill=0;dashed=1;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 15), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				
				var edge2 = new mxCell('', new mxGeometry(0, 0, 180, 0), 'edgeStyle=entityRelationEdgeStyle;html=1;endArrow=manyOptional;endFill=0;startArrow=none;rounded=0;startFill=0;dashed=1;');
				edge2.geometry.setTerminalPoint(new mxPoint(180, 15), false);
				edge2.geometry.relative = true;
				edge2.edge = true;
				cell1.insertEdge(edge2, true);

				return sb.createEdgeTemplateFromCells([edge1, cell1, edge2], 130, 30, 'Relationship');
			}),

			this.addEntry('integration', function()
			{
		    	var cell1 = new mxCell('Relationship', new mxGeometry(50, 0, 80, 30), 'html=1;rounded=1;absoluteArcSize=1;arcSize=80;whiteSpace=wrap;fontSize=11;');
		    	cell1.vertex = true;

				var edge1 = new mxCell('', new mxGeometry(0, 0, 50, 0), 'edgeStyle=entityRelationEdgeStyle;html=1;startArrow=blockThin;startFill=1;endArrow=none;rounded=0;endFill=0;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 15), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				
				var edge2 = new mxCell('', new mxGeometry(0, 0, 180, 0), 'edgeStyle=entityRelationEdgeStyle;html=1;endArrow=blockThin;endFill=1;startArrow=none;rounded=0;startFill=0;');
				edge2.geometry.setTerminalPoint(new mxPoint(180, 15), false);
				edge2.geometry.relative = true;
				edge2.edge = true;
				cell1.insertEdge(edge2, true);

				return sb.createEdgeTemplateFromCells([edge1, cell1, edge2], 130, 30, 'Integration');
			}),

			this.addEntry('integration', function()
			{
		    	var cell1 = new mxCell('Relationship', new mxGeometry(50, 0, 80, 30), 'html=1;rounded=1;absoluteArcSize=1;arcSize=80;whiteSpace=wrap;fontSize=11;');
		    	cell1.vertex = true;

				var edge1 = new mxCell('', new mxGeometry(0, 0, 50, 0), 'edgeStyle=entityRelationEdgeStyle;html=1;startArrow=blockThin;startFill=1;endArrow=none;rounded=0;endFill=0;dashed=1;');
				edge1.geometry.setTerminalPoint(new mxPoint(0, 15), true);
				edge1.geometry.relative = true;
				edge1.edge = true;
				cell1.insertEdge(edge1, false);
				
				var edge2 = new mxCell('', new mxGeometry(0, 0, 180, 0), 'edgeStyle=entityRelationEdgeStyle;html=1;endArrow=blockThin;endFill=1;startArrow=none;rounded=0;startFill=0;dashed=1;');
				edge2.geometry.setTerminalPoint(new mxPoint(180, 15), false);
				edge2.geometry.relative = true;
				edge2.edge = true;
				cell1.insertEdge(edge2, true);

				return sb.createEdgeTemplateFromCells([edge1, cell1, edge2], 130, 30, 'Integration');
			}),

		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=manyOptional;endFill=1;startArrow=none;rounded=0;startFill=0;', w, h, '', 'Default Relationship Connector', null, dt + 'default relationship connector'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=manyOptional;endFill=0;startArrow=none;rounded=0;startFill=0;dashed=1;', w, h, '', 'Default Relationship Connector', null, dt + 'default relationship connector'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=blockThin;endFill=1;startArrow=none;rounded=0;startFill=0;', w, h, '', 'Default Relationship Connector', null, dt + 'default relationship connector'),
		 	this.createEdgeTemplateEntry('edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=blockThin;endFill=1;startArrow=none;rounded=0;startFill=0;dashed=1;', w, h, '', 'Default Relationship Connector', null, dt + 'default relationship connector')
		]);
	};

	Sidebar.prototype.addSalesforceProductPalette = function(w, h)
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;aspect=fixed;html=1;shape=mxgraph.salesforce.';
		var gn = 'mxgraph.salesforce';
		var dt = 'salesforce product ';
		this.addPaletteFunctions('salesforceProduct', 'Salesforce / Product', false,
		[
			this.createVertexTemplateEntry(s + 'sales;', w, h, '', 'Sales', null, null, this.getTagsForStencil(gn, 'sales', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service;', w, h * 0.82, '', 'Service', null, null, this.getTagsForStencil(gn, 'service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'marketing;', w, h, '', 'Marketing', null, null, this.getTagsForStencil(gn, 'marketing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'commerce;', w, h * 0.88, '', 'Commerce', null, null, this.getTagsForStencil(gn, 'commerce', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'platform;', w * 0.65, h, '', 'Platform', null, null, this.getTagsForStencil(gn, 'platform', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'analytics;', w, h * 0.98, '', 'Analytics', null, null, this.getTagsForStencil(gn, 'salesforce', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'integration;', w, h, '', 'Integration', null, null, this.getTagsForStencil(gn, 'integration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'employees;', w * 0.97, h, '', 'Employees', null, null, this.getTagsForStencil(gn, 'employees', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'learning;', w, h, '', 'Learning', null, null, this.getTagsForStencil(gn, 'learning', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'industries;', w * 0.89, h, '', 'Industries', null, null, this.getTagsForStencil(gn, 'industries', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'partners;', w, h, '', 'Partners', null, null, this.getTagsForStencil(gn, 'partners', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'success;', w * 0.68, h, '', 'Success', null, null, this.getTagsForStencil(gn, 'success', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'inbox;', w, h * 0.75, '', 'Inbox', null, null, this.getTagsForStencil(gn, 'inbox', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'field_service;', w * 0.75, h, '', 'Field Service', null, null, this.getTagsForStencil(gn, 'field service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'iot;', w, h, '', 'IoT', null, null, this.getTagsForStencil(gn, 'iot', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'social_studio;', w, h, '', 'Social Studio', null, null, this.getTagsForStencil(gn, 'social studio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'customer_360;', w, h * 0.91, '', 'Customer 360', null, null, this.getTagsForStencil(gn, 'customer 360', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'heroku;', w, h, '', 'Heroku', null, null, this.getTagsForStencil(gn, 'heroku', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'work_com;', w, h * 0.98, '', 'Work.com', null, null, this.getTagsForStencil(gn, 'work com', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'loyalty;', w, h * 0.68, '', 'Loyalty', null, null, this.getTagsForStencil(gn, 'loyalty', dt).join(' ')),

			this.createVertexTemplateEntry(s + 'sales2;', w, h, '', 'Sales', null, null, this.getTagsForStencil(gn, 'sales', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service2;', w, h, '', 'Service', null, null, this.getTagsForStencil(gn, 'service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'marketing2;', w, h, '', 'Marketing', null, null, this.getTagsForStencil(gn, 'marketing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'commerce2;', w, h, '', 'Commerce', null, null, this.getTagsForStencil(gn, 'commerce', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'platform2;', w, h, '', 'Platform', null, null, this.getTagsForStencil(gn, 'platform', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'analytics2;', w, h, '', 'Analytics', null, null, this.getTagsForStencil(gn, 'salesforce', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'integration2;', w, h, '', 'Integration', null, null, this.getTagsForStencil(gn, 'integration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'employees2;', w, h, '', 'Employees', null, null, this.getTagsForStencil(gn, 'employees', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'learning2;', w, h, '', 'Learning', null, null, this.getTagsForStencil(gn, 'learning', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'industries2;', w, h, '', 'Industries', null, null, this.getTagsForStencil(gn, 'industries', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'partners2;', w, h, '', 'Partners', null, null, this.getTagsForStencil(gn, 'partners', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'success2;', w, h, '', 'Success', null, null, this.getTagsForStencil(gn, 'success', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'inbox2;', w, h, '', 'Inbox', null, null, this.getTagsForStencil(gn, 'inbox', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'field_service2;', w, h, '', 'Field Service', null, null, this.getTagsForStencil(gn, 'field service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'iot2;', w, h, '', 'IoT', null, null, this.getTagsForStencil(gn, 'iot', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'social_studio2;', w, h, '', 'Social Studio', null, null, this.getTagsForStencil(gn, 'social studio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'customer_3602;', w, h, '', 'Customer 360', null, null, this.getTagsForStencil(gn, 'customer 360', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'heroku2;', w, h, '', 'Heroku', null, null, this.getTagsForStencil(gn, 'heroku', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'work_com2;', w, h, '', 'Work.com', null, null, this.getTagsForStencil(gn, 'work com', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'loyalty2;', w, h, '', 'Loyalty', null, null, this.getTagsForStencil(gn, 'loyalty', dt).join(' '))
		]);
	};

	Sidebar.prototype.addSalesforcePlatformPalette = function(w, h)
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;aspect=fixed;html=1;shape=mxgraph.salesforce.';
		var gn = 'mxgraph.salesforce';
		var dt = 'salesforce platform ';
		this.addPaletteFunctions('salesforcePlatform', 'Salesforce / Platform', false,
		[
			this.createVertexTemplateEntry(s + 'apps;', w * 0.57, h, '', 'Apps', null, null, this.getTagsForStencil(gn, 'apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web;', w, h * 0.79, '', 'Web', null, null, this.getTagsForStencil(gn, 'web', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'channels;', w, h, '', 'Channels', null, null, this.getTagsForStencil(gn, 'channels', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bots;', w, h * 0.95, '', 'Bots', null, null, this.getTagsForStencil(gn, 'bots', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'automation;', w, h * 0.97, '', 'Automation', null, null, this.getTagsForStencil(gn, 'automation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'workflow;', w, h, '', 'Workflow', null, null, this.getTagsForStencil(gn, 'workflow', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'personalization;', w, h * 0.75, '', 'Personalization', null, null, this.getTagsForStencil(gn, 'personalization', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'builders;', w * 0.92, h, '', 'Builders', null, null, this.getTagsForStencil(gn, 'builders', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'data;', w * 0.81, h, '', 'Data', null, null, this.getTagsForStencil(gn, 'data', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stream;', w, h, '', 'Stream', null, null, this.getTagsForStencil(gn, 'stream', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'segments;', w, h, '', 'Segments', null, null, this.getTagsForStencil(gn, 'segments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'privacy;', w * 0.77, h, '', 'Privacy', null, null, this.getTagsForStencil(gn, 'privacy', dt).join(' ')),

			this.createVertexTemplateEntry(s + 'apps2;', w, h, '', 'Apps', null, null, this.getTagsForStencil(gn, 'apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web2;', w, h, '', 'Web', null, null, this.getTagsForStencil(gn, 'web', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'channels2;', w, h, '', 'Channels', null, null, this.getTagsForStencil(gn, 'channels', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bots2;', w, h, '', 'Bots', null, null, this.getTagsForStencil(gn, 'bots', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'automation2;', w, h, '', 'Automation', null, null, this.getTagsForStencil(gn, 'automation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'workflow2;', w, h, '', 'Workflow', null, null, this.getTagsForStencil(gn, 'workflow', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'personalization2;', w, h, '', 'Personalization', null, null, this.getTagsForStencil(gn, 'personalization', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'builders2;', w, h, '', 'Builders', null, null, this.getTagsForStencil(gn, 'builders', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'data2;', w, h, '', 'Data', null, null, this.getTagsForStencil(gn, 'data', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stream2;', w, h, '', 'Stream', null, null, this.getTagsForStencil(gn, 'stream', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'segments2;', w, h, '', 'Segments', null, null, this.getTagsForStencil(gn, 'segments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'privacy2;', w, h, '', 'Privacy', null, null, this.getTagsForStencil(gn, 'privacy', dt).join(' '))
		]);
	};

	Sidebar.prototype.addSalesforceIndustryPalette = function(w, h)
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;aspect=fixed;html=1;shape=mxgraph.salesforce.';
		var gn = 'mxgraph.salesforce';
		var dt = 'salesforce industry';
		this.addPaletteFunctions('salesforceIndustry', 'Salesforce / Industry', false,
		[
			this.createVertexTemplateEntry(s + 'government;', w * 0.86, h, '', 'Government', null, null, this.getTagsForStencil(gn, 'government', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'media;', w, h, '', 'Media', null, null, this.getTagsForStencil(gn, 'media', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'consumer_goods;', w * 0.9, h, '', 'Consumer Goods', null, null, this.getTagsForStencil(gn, 'consumer goods', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'transportation_and_technology;', w, h, '', 'Transportation and Technology', null, null, this.getTagsForStencil(gn, 'transportation and technology', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'financial_services;', w * 0.96, h, '', 'Financial Services', null, null, this.getTagsForStencil(gn, 'financial services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'automotive;', w, h, '', 'Automotive', null, null, this.getTagsForStencil(gn, 'automotive', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'energy;', w * 0.75, h, '', 'Energy', null, null, this.getTagsForStencil(gn, 'energy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'smb;', w, h * 0.82, '', 'SMB', null, null, this.getTagsForStencil(gn, 'smb', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'communications;', w * 0.79, h, '', 'Communications', null, null, this.getTagsForStencil(gn, 'communications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'retail;', w * 0.75, h, '', 'Retail', null, null, this.getTagsForStencil(gn, 'retail', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'manufacturing;', w, h, '', 'Manufacturing', null, null, this.getTagsForStencil(gn, 'manufacturing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'health;', w, h * 0.84, '', 'Health', null, null, this.getTagsForStencil(gn, 'health', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'philantrophy;', w * 0.83, h, '', 'Philantrophy', null, null, this.getTagsForStencil(gn, 'philantrophy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'non_profit;', w, h * 0.93, '', 'Non-profit', null, null, this.getTagsForStencil(gn, 'non profit', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'education;', w, h * 0.67, '', 'Education', null, null, this.getTagsForStencil(gn, 'education', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sustainability;', w, h, '', 'Sustainability', null, null, this.getTagsForStencil(gn, 'sustainability', dt).join(' ')),

			this.createVertexTemplateEntry(s + 'government2;', w, h, '', 'Government', null, null, this.getTagsForStencil(gn, 'government', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'media2;', w, h, '', 'Media', null, null, this.getTagsForStencil(gn, 'media', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'consumer_goods2;', w, h, '', 'Consumer Goods', null, null, this.getTagsForStencil(gn, 'consumer goods', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'transportation_and_technology2;', w, h, '', 'Transportation and Technology', null, null, this.getTagsForStencil(gn, 'transportation and technology', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'financial_services2;', w, h, '', 'Financial Services', null, null, this.getTagsForStencil(gn, 'financial services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'automotive2;', w, h, '', 'Automotive', null, null, this.getTagsForStencil(gn, 'automotive', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'energy2;', w, h, '', 'Energy', null, null, this.getTagsForStencil(gn, 'energy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'smb2;', w, h, '', 'SMB', null, null, this.getTagsForStencil(gn, 'smb', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'communications2;', w, h, '', 'Communications', null, null, this.getTagsForStencil(gn, 'communications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'retail2;', w, h, '', 'Retail', null, null, this.getTagsForStencil(gn, 'retail', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'manufacturing2;', w, h, '', 'Manufacturing', null, null, this.getTagsForStencil(gn, 'manufacturing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'health2;', w, h, '', 'Health', null, null, this.getTagsForStencil(gn, 'health', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'philantrophy2;', w, h, '', 'Philantrophy', null, null, this.getTagsForStencil(gn, 'philantrophy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'non_profit2;', w, h, '', 'Non-profit', null, null, this.getTagsForStencil(gn, 'non profit', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'education2;', w, h, '', 'Education', null, null, this.getTagsForStencil(gn, 'education', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sustainability2;', w, h, '', 'Sustainability', null, null, this.getTagsForStencil(gn, 'sustainability', dt).join(' '))
		]);
	};
})();
