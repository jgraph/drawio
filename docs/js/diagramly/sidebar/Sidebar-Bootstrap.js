(function()
{
	// Adds Bootstrap shapes
	Sidebar.prototype.addBootstrapPalette = function()
	{
		var s = 'html=1;shadow=0;dashed=0;shape=mxgraph.bootstrap.';
		var s2 = 'html=1;shadow=0;dashed=0;fillColor=none;strokeColor=none;shape=mxgraph.bootstrap.rect;';
		var gn = 'mxgraph.bootstrap';
		var dt = 'bootstrap ';
		var sb = this;
		
		var fns = [
		   	this.addEntry(dt + 'button bar dark', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'rect;fillColor=#222222;strokeColor=none;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Company', new mxGeometry(0, 0, 80, 40), s2 + 'fontColor=#999999;fontSize=14;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('People', new mxGeometry(80, 0, 90, 40), s + 'rect;fillColor=#000000;strokeColor=none;fontColor=#ffffff;spacingRight=30;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var notif1 = new mxCell('84', new mxGeometry(1, 0.5, 25, 16), s + 'rrect;rSize=8;fillColor=#ff0000;strokeColor=none;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(-30, -8);
			   	notif1.vertex = true;
			   	button2.insert(notif1);
			   	var button3 = new mxCell('Violations', new mxGeometry(170, 0, 110, 40), s2 + 'fontColor=#999999;spacingRight=30;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var notif2 = new mxCell('42', new mxGeometry(1, 0.5, 25, 16), s + 'rrect;rSize=8;fillColor=#ff0000;strokeColor=none;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(-30, -8);
			   	notif2.vertex = true;
			   	button3.insert(notif2);
			   	var button4 = new mxCell('Statistics', new mxGeometry(280, 0, 80, 40), s2 + 'fontColor=#999999;whiteSpace=wrap;');
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button5 = new mxCell('Settings', new mxGeometry(360, 0, 70, 40), s2 + 'fontColor=#999999;whiteSpace=wrap;');
			   	button5.vertex = true;
			   	bg.insert(button5);
			   	var button6 = new mxCell('Profile', new mxGeometry(660, 0, 70, 40), s2 + 'fontColor=#999999;whiteSpace=wrap;');
			   	button6.vertex = true;
			   	bg.insert(button6);
			   	var button7 = new mxCell('Log Out', new mxGeometry(730, 0, 70, 40), s2 + 'fontColor=#999999;whiteSpace=wrap;');
			   	button7.vertex = true;
			   	bg.insert(button7);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button Bar (Dark)');
			}),
		    
		   	this.addEntry(dt + 'button bar bright', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'rect;fillColor=#f6f6f6;strokeColor=none;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Company', new mxGeometry(0, 0, 80, 40), s2 + 'fontColor=#dddddd;fontSize=14;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('People', new mxGeometry(80, 0, 90, 40), s + 'rect;fillColor=#f0f0f0;strokeColor=none;fontColor=#999999;spacingRight=30;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var notif1 = new mxCell('84', new mxGeometry(1, 0.5, 25, 16), s + 'rrect;rSize=8;fillColor=#ff0000;strokeColor=none;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(-30, -8);
			   	notif1.vertex = true;
			   	button2.insert(notif1);
			   	var button3 = new mxCell('Violations', new mxGeometry(170, 0, 110, 40), s2 + 'fontColor=#dddddd;spacingRight=30;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var notif2 = new mxCell('42', new mxGeometry(1, 0.5, 25, 16), s + 'rrect;rSize=8;fillColor=#ff0000;strokeColor=none;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(-30, -8);
			   	notif2.vertex = true;
			   	button3.insert(notif2);
			   	var button4 = new mxCell('Statistics', new mxGeometry(280, 0, 80, 40), s2 + 'fontColor=#dddddd;whiteSpace=wrap;');
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button5 = new mxCell('Settings', new mxGeometry(360, 0, 70, 40), s2 + 'fontColor=#dddddd;whiteSpace=wrap;');
			   	button5.vertex = true;
			   	bg.insert(button5);
			   	var button6 = new mxCell('Search...', new mxGeometry(650, 5, 130, 30), s + 'rrect;rSize=5;fillColor=#ffffff;strokeColor=#dddddd;fontColor=#dddddd;align=left;spacingLeft=10;whiteSpace=wrap;');
			   	button6.vertex = true;
			   	bg.insert(button6);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button Bar (Bright)');
			}),
		    
		   	this.addEntry(dt + 'button group vertical', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 100, 150), s + 'rrect;rSize=5;strokeColor=#dddddd;html=1;whiteSpace=wrap;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Edit', new mxGeometry(0, 0, 100, 30), s + 'topButton;rSize=5;fillColor=none;strokeColor=#dddddd;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Create', new mxGeometry(0, 0, 100, 30), s + 'rect;fillColor=none;strokeColor=#dddddd;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(0, 30);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Delete', new mxGeometry(0, 0, 100, 30), s + 'rect;fillColor=none;strokeColor=#dddddd;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(0, 60);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Append', new mxGeometry(0, 0, 100, 30), s + 'rect;fillColor=none;strokeColor=#dddddd;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(0, 90);
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button5 = new mxCell('Prepend', new mxGeometry(0, 1, 100, 30), s + 'bottomButton;rSize=5;fillColor=none;strokeColor=#dddddd;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	button5.geometry.relative = true;
			   	button5.geometry.offset = new mxPoint(0, -30);
			   	button5.vertex = true;
			   	bg.insert(button5);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-15, -2.5);
			   	marker1.vertex = true;
			   	button2.insert(marker1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button Group (Vertical)');
			}),
		    
		   	this.addEntry(dt + 'button group vertical', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 160, 160), s + 'rrect;rSize=5;strokeColor=#dddddd;html=1;whiteSpace=wrap;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var button2 = new mxCell('Verified', new mxGeometry(0, 0, 160, 40), s + 'rect;fillColor=none;strokeColor=#dddddd;spacingLeft=10;align=left;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(0, 40);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Banned', new mxGeometry(0, 0, 160, 40), s + 'rect;fillColor=none;strokeColor=#dddddd;spacingLeft=10;align=left;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(0, 80);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Deleted', new mxGeometry(0, 1, 160, 40), s + 'bottomButton;rSize=5;fillColor=none;strokeColor=#dddddd;spacingLeft=10;align=left;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(0, -40);
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button1 = new mxCell('All Users', new mxGeometry(0, 0, 160, 40), s + 'topButton;rSize=5;fillColor=#3D8BCD;strokeColor=#3D8BCD;fontColor=#ffffff;spacingLeft=10;align=left;whiteSpace=wrap;resizeWidth=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button Group (Vertical)');
			}),
		    
			this.createVertexTemplateEntry(s + 'topButton;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;fontColor=#ffffff;spacingLeft=10;align=left;whiteSpace=wrap;', 
					160, 40, 'All Users', 'Top Button', null, null, this.getTagsForStencil(gn, 'topButton', dt + 'top button').join(' ')),
			this.createVertexTemplateEntry(s + 'bottomButton;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;fontColor=#ffffff;spacingLeft=10;align=left;whiteSpace=wrap;', 
					160, 40, 'All Users', 'Bottom Button', null, null, this.getTagsForStencil(gn, 'bottomButton', dt + 'bottom button').join(' ')),
			this.createVertexTemplateEntry(s + 'rightButton;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;fontColor=#ffffff;spacingLeft=10;align=left;whiteSpace=wrap;', 
					160, 40, 'All Users', 'Right Button', null, null, this.getTagsForStencil(gn, 'rightButton', dt + 'right button').join(' ')),
			this.createVertexTemplateEntry(s + 'leftButton;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;fontColor=#ffffff;spacingLeft=10;align=left;whiteSpace=wrap;', 
					160, 40, 'All Users', 'Left Button', null, null, this.getTagsForStencil(gn, 'leftButton', dt + 'left button').join(' ')),

		   	this.addEntry(dt + 'dropdown large', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 140, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=16;whiteSpace=wrap;fillColor=#ffffff;align=center;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Large)');
			}),
		    
		   	this.addEntry(dt + 'dropdown normal', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 120, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=14;whiteSpace=wrap;fillColor=#ffffff;align=center;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Normal)');
			}),
		    
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 100, 22), s + 'rrect;fontSize=12;rSize=5;strokeColor=#dddddd;spacingRight=10;perimeter=none;whiteSpace=wrap;fillColor=#ffffff;align=center;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown tiny', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 90, 20), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=10;whiteSpace=wrap;fillColor=#ffffff;align=center;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Tiny)');
			}),
		   	
		   	this.addEntry(dt + 'button group justified large', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 240, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Left', new mxGeometry(0, 0, 80, 40), s + 'rect;fillColor=none;strokeColor=none;perimeter=none;fontSize=16;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Middle', new mxGeometry(80, 0, 80, 40), s + 'rect;fillColor=none;strokeColor=#dddddd;perimeter=none;fontSize=16;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Right', new mxGeometry(160, 0, 80, 40), s + 'rect;fillColor=none;strokeColor=none;perimeter=none;fontSize=16;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg.insert(button3);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button Group (Justified, Large)');
			}),
		    
		   	this.addEntry(dt + 'button group justified normal', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 180, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Left', new mxGeometry(0, 0, 60, 30), s + 'rect;fillColor=none;strokeColor=none;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Middle', new mxGeometry(60, 0, 60, 30), s + 'rect;fillColor=none;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Right', new mxGeometry(120, 0, 60, 30), s + 'rect;fillColor=none;strokeColor=none;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg.insert(button3);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button Group (Justified, Normal)');
			}),
		    
		   	this.addEntry(dt + 'button group justified small', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 150, 22), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Left', new mxGeometry(0, 0, 50, 22), s + 'rect;fillColor=none;strokeColor=none;perimeter=none;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Middle', new mxGeometry(50, 0, 50, 22), s + 'rect;fillColor=none;strokeColor=#dddddd;perimeter=none;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Right', new mxGeometry(100, 0, 50, 22), s + 'rect;fillColor=none;strokeColor=none;perimeter=none;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg.insert(button3);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button Group (Justified, Small)');
			}),
		    
		   	this.addEntry(dt + 'button group justified tiny', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 120, 20), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Left', new mxGeometry(0, 0, 40, 20), s + 'rect;fillColor=none;strokeColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Middle', new mxGeometry(40, 0, 40, 20), s + 'rect;fillColor=none;strokeColor=#dddddd;perimeter=none;fontSize=10;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Right', new mxGeometry(80, 0, 40, 20), s + 'rect;fillColor=none;strokeColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg.insert(button3);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button Group (Justified, Tiny)');
			}),
		    
		   	this.addEntry(dt + 'button toolbar', function()
	   		{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 120, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;');
			   	bg1.vertex = true;
			   	var button1 = new mxCell('1', new mxGeometry(0, 0, 30, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg1.insert(button1);
			   	var button2 = new mxCell('2', new mxGeometry(30, 0, 30, 30), s + 'rect;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg1.insert(button2);
			   	var button3 = new mxCell('3', new mxGeometry(60, 0, 30, 30), s + 'rect;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg1.insert(button3);
			   	var button4 = new mxCell('4', new mxGeometry(90, 0, 30, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button4.vertex = true;
			   	bg1.insert(button4);
			   	var bg2 = new mxCell('', new mxGeometry(130, 0, 90, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;');
			   	bg2.vertex = true;
			   	var button1 = new mxCell('5', new mxGeometry(0, 0, 30, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg2.insert(button1);
			   	var button2 = new mxCell('6', new mxGeometry(30, 0, 30, 30), s + 'rect;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg2.insert(button2);
			   	var button4 = new mxCell('7', new mxGeometry(60, 0, 30, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button4.vertex = true;
			   	bg2.insert(button4);
			   	var bg3 = new mxCell('8', new mxGeometry(230, 0, 30, 30), s + 'rrect;fontSize=12;align=center;rSize=5;strokeColor=#dddddd;whiteSpace=wrap;fillColor=#ffffff;');
			   	bg3.vertex = true;

			   	return sb.createVertexTemplateFromCells([bg1, bg2, bg3], 260, 30, 'Button Toolbar');
			}),
		    
		   	this.addEntry(dt + 'button group nested', function()
	   		{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 160, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;');
			   	bg1.vertex = true;
			   	var button1 = new mxCell('1', new mxGeometry(0, 0, 30, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg1.insert(button1);
			   	var button2 = new mxCell('2', new mxGeometry(30, 0, 30, 30), s + 'rect;strokeColor=#dddddd;perimeter=none;fontSize=14;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg1.insert(button2);
			   	var button3 = new mxCell('Dropdown', new mxGeometry(60, 0, 100, 30), s + 'rect;strokeColor=#dddddd;perimeter=none;fontSize=14;spacingRight=10;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg1.insert(button3);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-15, -2.5);
			   	marker1.vertex = true;
			   	button3.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Button Group (Nested)');
			}),

		   	this.createVertexTemplateEntry(s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=center;fontSize=16;whiteSpace=wrap;', 
		   			80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=center;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=center;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=center;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
		   	
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#3D8BCD;align=center;strokeColor=#3D8BCD;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#3D8BCD;align=center;strokeColor=#3D8BCD;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#3D8BCD;align=center;strokeColor=#3D8BCD;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#3D8BCD;align=center;strokeColor=#3D8BCD;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#58B957;align=center;strokeColor=#58B957;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#58B957;align=center;strokeColor=#58B957;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#58B957;align=center;strokeColor=#58B957;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#58B957;align=center;strokeColor=#58B957;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#55BFE0;align=center;strokeColor=#55BFE0;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#55BFE0;align=center;strokeColor=#55BFE0;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#55BFE0;align=center;strokeColor=#55BFE0;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#55BFE0;align=center;strokeColor=#55BFE0;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#EFAC43;align=center;strokeColor=#EFAC43;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#EFAC43;align=center;strokeColor=#EFAC43;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#EFAC43;align=center;strokeColor=#EFAC43;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#EFAC43;align=center;strokeColor=#EFAC43;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#DB524C;align=center;strokeColor=#DB524C;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#DB524C;align=center;strokeColor=#DB524C;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#DB524C;align=center;strokeColor=#DB524C;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#DB524C;align=center;strokeColor=#DB524C;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Primary', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#3D8BCD;strokeColor=#3D8BCD;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Success', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#58B957;strokeColor=#58B957;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Info', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#55BFE0;strokeColor=#55BFE0;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;whiteSpace=wrap;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Warning', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#EFAC43;strokeColor=#EFAC43;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;whiteSpace=wrap;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Danger', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#DB524C;strokeColor=#DB524C;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown split', function()
	   		{
			   	var bg = new mxCell('Default', new mxGeometry(0, 0, 120, 30), s + 'rrect;fillColor=#ffffff;align=center;rSize=5;strokeColor=#dddddd;spacingRight=20;fontSize=14;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 0, 30, 30), s + 'rightButton;rSize=5;fillColor=none;strokeColor=#dddddd;perimeter=none;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-30, 0);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	button1.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Split)');
			}),

		   	this.addEntry(dt + 'dropdown split', function()
	   		{
			   	var bg = new mxCell('Primary', new mxGeometry(0, 0, 120, 30), s + 'rrect;align=center;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;spacingRight=20;fontSize=14;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 0, 30, 30), s + 'rightButton;rSize=5;fillColor=none;strokeColor=#0D5B9D;perimeter=none;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-30, 0);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	button1.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Split)');
			}),
		    
		   	this.addEntry(dt + 'dropdown split', function()
	   		{
			   	var bg = new mxCell('Success', new mxGeometry(0, 0, 120, 30), s + 'rrect;align=center;rSize=5;fillColor=#58B957;strokeColor=#288927;spacingRight=20;fontSize=14;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 0, 30, 30), s + 'rightButton;rSize=5;fillColor=none;strokeColor=#288927;perimeter=none;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-30, 0);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	button1.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Split)');
			}),
		    
		   	this.addEntry(dt + 'dropdown split', function()
	   		{
			   	var bg = new mxCell('Info', new mxGeometry(0, 0, 120, 30), s + 'rrect;align=center;rSize=5;fillColor=#55BFE0;strokeColor=#258FB0;spacingRight=20;fontSize=14;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 0, 30, 30), s + 'rightButton;rSize=5;fillColor=none;strokeColor=#258FB0;perimeter=none;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-30, 0);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	button1.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Split)');
			}),
		    
		   	this.addEntry(dt + 'dropdown split', function()
	   		{
			   	var bg = new mxCell('Warning', new mxGeometry(0, 0, 120, 30), s + 'rrect;align=center;rSize=5;fillColor=#EFAC43;strokeColor=#BF7C13;spacingRight=20;fontSize=14;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 0, 30, 30), s + 'rightButton;rSize=5;fillColor=none;strokeColor=#BF7C13;perimeter=none;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-30, 0);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	button1.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Split)');
			}),
		    
		   	this.addEntry(dt + 'dropdown split', function()
	   		{
			   	var bg = new mxCell('Danger', new mxGeometry(0, 0, 120, 30), s + 'rrect;align=center;rSize=5;fillColor=#DB524C;strokeColor=#AB221C;spacingRight=20;fontSize=14;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 0, 30, 30), s + 'rightButton;rSize=5;fillColor=none;strokeColor=#AB221C;perimeter=none;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-30, 0);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	button1.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Split)');
			}),
		    
		   	this.addEntry(dt + 'dropup split', function()
	   		{
			   	var bg = new mxCell('Dropup', new mxGeometry(0, 0, 120, 30), s + 'rrect;fillColor=#ffffff;align=center;rSize=5;strokeColor=#dddddd;spacingRight=20;fontSize=14;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 0, 30, 30), s + 'rightButton;rSize=5;fillColor=none;strokeColor=#dddddd;perimeter=none;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-30, 0);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=north;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	button1.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropup (Split)');
			}),

		   	this.addEntry(dt + 'dropup split', function()
	   		{
			   	var bg = new mxCell('Right dropup', new mxGeometry(0, 0, 140, 30), s + 'rrect;align=center;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;spacingRight=20;fontSize=14;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 0, 30, 30), s + 'rightButton;rSize=5;fillColor=none;strokeColor=#0D5B9D;perimeter=none;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-30, 0);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=north;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	button1.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropup (Split)');
			}),
		    
		   	this.addEntry(dt + 'dropdown menu', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 140, 40), s + 'rrect;align=center;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=16;gradientColor=#e4e4e4;gradientDirection=north;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
			   	var bg1 = new mxCell('Action\nAnother Action', new mxGeometry(0, 42, 160, 48), s + 'rect;fillColor=#ffffff;fontSize=12;fontColor=#000000;fontFamily=Helvetica;fontStyle=0;strokeColor=#dddddd;spacingLeft=10;shadow=1;align=left;verticalAlign=top;spacingTop=3;');
			   	bg1.vertex = true;

			   	return sb.createVertexTemplateFromCells([bg, bg1], 160, 90, 'Dropdown (Menu)');
			}),

		   	this.addEntry(dt + 'dropdown menu header', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 110, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=16;fillColor=#FFFFFF;align=left;spacingLeft=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
			   	var bg1 = new mxCell('', new mxGeometry(0, 42, 160, 108), s + 'rect;fillColor=#ffffff;strokeColor=#dddddd;shadow=1;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Action', new mxGeometry(0, 0, 160, 20), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(0, 8);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('Another action', new mxGeometry(0, 0, 160, 20), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(0, 28);
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			   	var bg4 = new mxCell('Disabled link', new mxGeometry(0, 0, 160, 20), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;fontColor=#dddddd;whiteSpace=wrap;resizeWidth=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(0, 48);
			   	bg4.vertex = true;
			   	bg1.insert(bg4);
			   	var bg5 = new mxCell('', new mxGeometry(0, 0, 160, 20), 'shape=line;strokeColor=#dddddd;perimeter=none;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 68);
			   	bg5.vertex = true;
			   	bg1.insert(bg5);
			   	var bg7 = new mxCell('Separated link', new mxGeometry(0, 0, 160, 20), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(0, 88);
			   	bg7.vertex = true;
			   	bg1.insert(bg7);

			   	return sb.createVertexTemplateFromCells([bg, bg1], 160, 150, 'Dropdown (Menu, Headers)');
			}),

		   	this.addEntry(dt + 'dropdown menu', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 110, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=16;fillColor=#FFFFFF;align=left;spacingLeft=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
			   	var bg1 = new mxCell('', new mxGeometry(0, 42, 160, 158), s + 'rect;fillColor=#ffffff;strokeColor=#dddddd;shadow=1;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Dropdown header', new mxGeometry(0, 0, 160, 16), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;perimeter=none;fontColor=#dddddd;fontSize=11;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(0, 8);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('Action', new mxGeometry(0, 0, 160, 20), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(0, 28);
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			   	var bg4 = new mxCell('Another action', new mxGeometry(0, 0, 160, 20), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(0, 48);
			   	bg4.vertex = true;
			   	bg1.insert(bg4);
			   	var bg5 = new mxCell('Disabled link', new mxGeometry(0, 0, 160, 20), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;fontColor=#dddddd;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 68);
			   	bg5.vertex = true;
			   	bg1.insert(bg5);
			   	var bg6 = new mxCell('', new mxGeometry(0, 0, 160, 20), 'shape=line;strokeColor=#dddddd;perimeter=none;resizeWidth=1;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(0, 88);
			   	bg6.vertex = true;
			   	bg1.insert(bg6);
			   	var bg7 = new mxCell('Dropdown header', new mxGeometry(0, 0, 160, 16), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;perimeter=none;fontColor=#dddddd;fontSize=11;whiteSpace=wrap;resizeWidth=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(0, 108);
			   	bg7.vertex = true;
			   	bg1.insert(bg7);
			   	var bg8 = new mxCell('Separated link', new mxGeometry(0, 0, 160, 20), s + 'rect;strokeColor=none;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 128);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);

			   	return sb.createVertexTemplateFromCells([bg, bg1], 160, 200, 'Dropdown (Menu)');
			}),
	
		   	this.addEntry(dt + 'input group', function()
	   		{
			   	var bg = new mxCell('Username', new mxGeometry(0, 0, 250, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=50;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('@', new mxGeometry(0, 0, 40, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg.insert(bg2);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Input Group');
			}),
	
		   	this.addEntry(dt + 'input group', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 250, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=10;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('.00', new mxGeometry(1, 0, 40, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-40, 0);
			   	bg2.vertex = true;
			   	bg.insert(bg2);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Input Group');
			}),
	
		   	this.addEntry(dt + 'input group', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 250, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=50;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('$', new mxGeometry(0, 0, 40, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			   	var bg3 = new mxCell('.00', new mxGeometry(1, 0, 40, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(-40, 0);
			   	bg3.vertex = true;
			   	bg.insert(bg3);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Input Group');
			}),
	
		   	this.addEntry(dt + 'input group', function()
	   		{
			   	var bg = new mxCell('Username', new mxGeometry(0, 0, 250, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=50;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 40, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var marker1 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), s + 'checkbox;rSize=3;strokeColor=#666666;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-8, -8);
			   	marker1.vertex = true;
			   	bg2.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Input Group');
			}),
	
		   	this.addEntry(dt + 'input group', function()
	   		{
			   	var bg = new mxCell('Username', new mxGeometry(0, 0, 250, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=50;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 40, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var marker1 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), s + 'radioButton;rSize=3;strokeColor=#666666;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-8, -8);
			   	marker1.vertex = true;
			   	bg2.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Input Group');
			}),
	
		   	this.addEntry(dt + 'username large', function()
	   		{
			   	var bg = new mxCell('Username', new mxGeometry(0, 0, 250, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=60;fontSize=16;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 50, 40), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var marker1 = new mxCell('', new mxGeometry(0.5, 0.5, 20, 20), s + 'user;rSize=5;strokeColor=none;fillColor=#000000;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-10, -10);
			   	marker1.vertex = true;
			   	bg2.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Username (Large)');
			}),
			    
		   	this.addEntry(dt + 'username normal', function()
	   		{
			   	var bg = new mxCell('Username', new mxGeometry(0, 0, 250, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=50;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 40, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var marker1 = new mxCell('', new mxGeometry(0.5, 0.5, 15, 15), s + 'user;rSize=5;strokeColor=none;fillColor=#000000;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-7.5, -7.5);
			   	marker1.vertex = true;
			   	bg2.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Username (Normal)');
			}),
			    
		   	this.addEntry(dt + 'username tiny', function()
	   		{
			   	var bg = new mxCell('Username', new mxGeometry(0, 0, 250, 20), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=40;fontSize=10;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 30, 20), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var marker1 = new mxCell('', new mxGeometry(0.5, 0.5, 10, 10), s + 'user;rSize=5;strokeColor=none;fillColor=#000000;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-5, -5);
			   	marker1.vertex = true;
			   	bg2.insert(marker1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Username (Tiny)');
			}),
			
		   	this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#ffffff;strokeColor=#dddddd;fontSize=16;align=left;spacingLeft=10;whiteSpace=wrap;', 
		   			250, 40, 'Johnny Boo', 'Full Name (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'full name large').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#ffffff;strokeColor=#dddddd;fontSize=14;align=left;spacingLeft=8;whiteSpace=wrap;', 
		   			250, 30, 'Johnny Boo', 'Full Name (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'full name normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#ffffff;strokeColor=#dddddd;fontSize=10;align=left;spacingLeft=6;whiteSpace=wrap;', 
		   			250, 20, 'Johnny Boo', 'Full Name (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'full name tiny').join(' ')),
			
		   	this.addEntry(dt + 'final price large', function()
	   		{
			   	var bg = new mxCell('Amount', new mxGeometry(0, 0, 200, 40), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;spacingLeft=10;fontSize=16;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('UAH', new mxGeometry(1, 0, 50, 40), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;fontSize=16;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-50, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Final Price (Large)');
			}),
			    
		   	this.addEntry(dt + 'final price normal', function()
	   		{
			   	var bg = new mxCell('Amount', new mxGeometry(0, 0, 200, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;spacingLeft=8;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('UAH', new mxGeometry(1, 0, 40, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-40, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Final Price (Normal)');
			}),
		    
		   	this.addEntry(dt + 'final price tiny', function()
	   		{
			   	var bg = new mxCell('Amount', new mxGeometry(0, 0, 200, 20), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;spacingLeft=6;fontSize=10;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('UAH', new mxGeometry(1, 0, 30, 20), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;fontSize=10;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-30, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Final Price (Tiny)');
			}),
			    
		   	this.addEntry(dt + 'segmented button large', function()
	   		{
			   	var bg = new mxCell('Search...', new mxGeometry(0, 0, 400, 40), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;fontSize=16;fontColor=#dddddd;align=left;spacingLeft=90;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Users', new mxGeometry(0, 0, 80, 40), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=16;align=left;spacingLeft=10;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg1.insert(marker1);
			   	var bg2 = new mxCell('Go!', new mxGeometry(1, 0, 50, 40), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=16;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-50, 0);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Segmented Button (Large)');
			}),
	
		   	this.addEntry(dt + 'segmented button normal', function()
	   		{
			   	var bg = new mxCell('Search...', new mxGeometry(0, 0, 400, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;fontSize=14;fontColor=#dddddd;align=left;spacingLeft=80;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Users', new mxGeometry(0, 0, 70, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=14;align=left;spacingLeft=6;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg1.insert(marker1);
			   	var bg2 = new mxCell('Go!', new mxGeometry(1, 0, 40, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-40, 0);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Segmented Button (Normal)');
			}),
	
		   	this.addEntry(dt + 'segmented button tiny', function()
	   		{
			   	var bg = new mxCell('Search...', new mxGeometry(0, 0, 400, 20), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;fontSize=10;fontColor=#dddddd;align=left;spacingLeft=70;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Users', new mxGeometry(0, 0, 60, 20), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=10;align=left;spacingLeft=3;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg1.insert(marker1);
			   	var bg2 = new mxCell('Go!', new mxGeometry(1, 0, 30, 20), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=10;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-30, 0);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Segmented Button (Tiny)');
			}),
	
		   	this.addEntry(dt + 'search button large', function()
	   		{
			   	var bg = new mxCell('Search...', new mxGeometry(0, 0, 200, 40), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;align=left;spacingLeft=10;fontSize=16;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Go!', new mxGeometry(1, 0, 50, 40), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=16;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-50, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Search Button (Large)');
			}),
	
		   	this.addEntry(dt + 'search button normal', function()
	   		{
			   	var bg = new mxCell('Search...', new mxGeometry(0, 0, 200, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;align=left;spacingLeft=6;fontSize=14;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Go!', new mxGeometry(1, 0, 40, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-40, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Search Button (Normal)');
			}),
	
		   	this.addEntry(dt + 'search button tiny', function()
	   		{
			   	var bg = new mxCell('Search...', new mxGeometry(0, 0, 200, 20), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;align=left;spacingLeft=3;fontSize=10;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Go!', new mxGeometry(1, 0, 30, 20), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=10;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-30, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Search Button (Tiny)');
			}),
	
		   	this.addEntry(dt + 'dropdown menu', function()
	   		{
			   	var bg = new mxCell('Dubai, UAE', new mxGeometry(0, 0, 300, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=16;gradientColor=#e4e4e4;gradientDirection=north;spacingLeft=10;align=left;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-15, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
			   	var bg1 = new mxCell('', new mxGeometry(0, 42, 300, 258), s + 'rect;fillColor=#ffffff;strokeColor=#dddddd;spacingLeft=10;shadow=1;align=left;verticalAlign=top;spacingTop=3;perimeter=none;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Search...', new mxGeometry(0, 0, 280, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingLeft=10;align=left;fontColor=#dddddd;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(10, 9);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('Beijing, China', new mxGeometry(0, 0, 300, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(0, 48);
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			   	var bg4 = new mxCell('Dubai, UAE', new mxGeometry(0, 0, 300, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fontStyle=1;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(0, 78);
			   	bg4.vertex = true;
			   	bg1.insert(bg4);
			   	var marker2 = new mxCell('', new mxGeometry(1, 0.5, 10, 8), s + 'check;strokeWidth=3;strokeColor=#666666;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(-15, -4);
			   	marker2.vertex = true;
			   	bg4.insert(marker2);
			   	var bg5 = new mxCell('Kiev, Ukraine', new mxGeometry(0, 0, 300, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 108);
			   	bg5.vertex = true;
			   	bg1.insert(bg5);
			   	var bg6 = new mxCell('London, UK', new mxGeometry(0, 0, 300, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(0, 138);
			   	bg6.vertex = true;
			   	bg1.insert(bg6);
			   	var bg7 = new mxCell('Moscow, Russia', new mxGeometry(0, 0, 300, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(0, 168);
			   	bg7.vertex = true;
			   	bg1.insert(bg7);
			   	var bg8 = new mxCell('New York, USA', new mxGeometry(0, 0, 300, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 198);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var bg9 = new mxCell('Tokyo, Japan', new mxGeometry(0, 0, 300, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(0, 228);
			   	bg9.vertex = true;
			   	bg1.insert(bg9);
			    
			   	return sb.createVertexTemplateFromCells([bg, bg1], 300, 300, 'Dropdown (Menu)');
			}),
			    
		   	this.addEntry(dt + 'dropdown menu', function()
	   		{
			   	var bg = new mxCell('Dubai, UAE', new mxGeometry(0, 0, 200, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=16;gradientColor=#e4e4e4;gradientDirection=north;spacingLeft=10;align=left;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-15, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
			   	var bg1 = new mxCell('', new mxGeometry(0, 42, 200, 210), s + 'rect;fillColor=#ffffff;strokeColor=#dddddd;spacingLeft=10;shadow=1;align=left;verticalAlign=top;spacingTop=3;perimeter=none;');
			   	bg1.vertex = true;
			   	var bg3 = new mxCell('Beijing, China', new mxGeometry(0, 0, 200, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg3.geometry.relative = true;
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			   	var bg4 = new mxCell('Dubai, UAE', new mxGeometry(0, 0, 200, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fontStyle=1;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(0, 30);
			   	bg4.vertex = true;
			   	bg1.insert(bg4);
			   	var marker2 = new mxCell('', new mxGeometry(1, 0.5, 10, 8), s + 'check;strokeWidth=3;strokeColor=#666666;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(-15, -4);
			   	marker2.vertex = true;
			   	bg4.insert(marker2);
			   	var bg5 = new mxCell('Kiev, Ukraine', new mxGeometry(0, 0, 200, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 60);
			   	bg5.vertex = true;
			   	bg1.insert(bg5);
			   	var bg6 = new mxCell('London, UK', new mxGeometry(0, 0, 200, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(0, 90);
			   	bg6.vertex = true;
			   	bg1.insert(bg6);
			   	var bg7 = new mxCell('Moscow, Russia', new mxGeometry(0, 0, 200, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(0, 120);
			   	bg7.vertex = true;
			   	bg1.insert(bg7);
			   	var bg8 = new mxCell('New York, USA', new mxGeometry(0, 0, 200, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 150);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var bg9 = new mxCell('Tokyo, Japan', new mxGeometry(0, 0, 200, 30), s + 'rect;strokeColor=#dddddd;spacingLeft=10;align=left;fillColor=none;perimeter=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(0, 180);
			   	bg9.vertex = true;
			   	bg1.insert(bg9);
			    
			   	return sb.createVertexTemplateFromCells([bg, bg1], 200, 252, 'Dropdown (Menu)');
			}),
	
		   	this.addEntry(dt + 'context menu', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 140, 128), s + 'rect;fillColor=#ffffff;strokeColor=#dddddd;shadow=1;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Dropdown header', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontColor=#dddddd;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(0, 8);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			   	var bg2 = new mxCell('Action', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(0, 24);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var bg3 = new mxCell('Another action', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(0, 40);
			   	bg3.vertex = true;
			   	bg.insert(bg3);
			   	var bg4 = new mxCell('Something else here', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(0, 56);
			   	bg4.vertex = true;
			   	bg.insert(bg4);
			   	var bg5 = new mxCell('', new mxGeometry(0, 0, 140, 16), 'shape=line;strokeColor=#dddddd;perimeter=none;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 72);
			   	bg5.vertex = true;
			   	bg.insert(bg5);
			   	var bg6 = new mxCell('Dropdown header', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontColor=#dddddd;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(0, 88);
			   	bg6.vertex = true;
			   	bg.insert(bg6);
			   	var bg7 = new mxCell('Separated link', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(0, 104);
			   	bg7.vertex = true;
			   	bg.insert(bg7);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Context Menu');
			}),
	
		   	this.addEntry(dt + 'context menu', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 140, 96), s + 'rect;fillColor=#ffffff;strokeColor=#dddddd;shadow=1;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('Action', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(0, 8);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var bg3 = new mxCell('Another action', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(0, 24);
			   	bg3.vertex = true;
			   	bg.insert(bg3);
			   	var bg4 = new mxCell('Something else here', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(0, 40);
			   	bg4.vertex = true;
			   	bg.insert(bg4);
			   	var bg5 = new mxCell('', new mxGeometry(0, 0, 140, 16), 'shape=line;strokeColor=#dddddd;perimeter=none;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 56);
			   	bg5.vertex = true;
			   	bg.insert(bg5);
			   	var bg7 = new mxCell('Separated link', new mxGeometry(0, 0, 140, 16), s + 'rect;strokeColor=none;spacingLeft=6;align=left;fillColor=none;perimeter=none;fontSize=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(0, 72);
			   	bg7.vertex = true;
			   	bg.insert(bg7);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Context Menu');
			}),
	
		   	this.addEntry(dt + 'pagination', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 330, 30), s + 'rrect;fillColor=#ffffff;strokeColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('<<', new mxGeometry(0, 0, 30, 30), s + 'leftButton;strokeColor=none;fillColor=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var bg3 = new mxCell('1', new mxGeometry(30, 0, 30, 30), s + 'rect;strokeColor=#dddddd;fillColor=none;perimeter=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	bg.insert(bg3);
			   	var bg5 = new mxCell('3', new mxGeometry(90, 0, 30, 30), s + 'rect;strokeColor=#dddddd;fillColor=none;perimeter=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg5.vertex = true;
			   	bg.insert(bg5);
			   	var bg6 = new mxCell('4', new mxGeometry(120, 0, 30, 30), s + 'rect;strokeColor=#dddddd;fillColor=none;perimeter=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg6.vertex = true;
			   	bg.insert(bg6);
			   	var bg7 = new mxCell('5', new mxGeometry(150, 0, 30, 30), s + 'rect;strokeColor=#dddddd;fillColor=none;perimeter=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg7.vertex = true;
			   	bg.insert(bg7);
			   	var bg8 = new mxCell('6', new mxGeometry(180, 0, 30, 30), s + 'rect;strokeColor=#dddddd;fillColor=none;perimeter=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg8.vertex = true;
			   	bg.insert(bg8);
			   	var bg9 = new mxCell('7', new mxGeometry(210, 0, 30, 30), s + 'rect;strokeColor=#dddddd;fillColor=none;perimeter=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg9.vertex = true;
			   	bg.insert(bg9);
			   	var bg10 = new mxCell('8', new mxGeometry(240, 0, 30, 30), s + 'rect;strokeColor=#dddddd;fillColor=none;perimeter=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg10.vertex = true;
			   	bg.insert(bg10);
			   	var bg11 = new mxCell('9', new mxGeometry(270, 0, 30, 30), s + 'rect;strokeColor=#dddddd;fillColor=none;perimeter=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg11.vertex = true;
			   	bg.insert(bg11);
			   	var bg12 = new mxCell('>>', new mxGeometry(300, 0, 30, 30), s + 'rightButton;strokeColor=#dddddd;fillColor=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	bg12.vertex = true;
			   	bg.insert(bg12);
			   	var bg4 = new mxCell('2', new mxGeometry(60, 0, 30, 30), s + 'rect;strokeColor=#3D8BCD;fillColor=#3D8BCD;perimeter=none;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg4.vertex = true;
			   	bg.insert(bg4);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Pagination');
			}),
	
		   	this.createVertexTemplateEntry(s + 'roundedButton;fillColor=#ffffff;align=center;strokeColor=#dddddd;fontColor=#3D8BCD;whiteSpace=wrap;', 
		   			100, 30, 'Previous', 'Button (Previous)', null, null, this.getTagsForStencil(gn, '', dt + '').join(' ')),
		   	this.createVertexTemplateEntry(s + 'roundedButton;fillColor=#ffffff;align=center;strokeColor=#dddddd;fontColor=#3D8BCD;whiteSpace=wrap;', 
		   			60, 30, 'Next', 'Button (Next)', null, null, this.getTagsForStencil(gn, '', dt + '').join(' ')),

		   	this.addEntry(dt + 'button older', function()
	   		{
			   	var bg = new mxCell('Older', new mxGeometry(0, 0, 100, 30), s + 'roundedButton;fillColor=#ffffff;align=center;strokeColor=#dddddd;fontColor=#dddddd;spacingLeft=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0.5, 16, 4), s + 'arrow;strokeColor=#dddddd;flipH=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(12, -2);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button (Older)');
			}),
	
		   	this.addEntry(dt + 'button newer', function()
	   		{
			   	var bg = new mxCell('Newer', new mxGeometry(0, 0, 100, 30), s + 'roundedButton;fillColor=#ffffff;align=center;strokeColor=#dddddd;fontColor=#3D8BCD;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 16, 4), s + 'arrow;strokeColor=#3D8BCD;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-28, -2);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button (Newer)');
			}),
	
		   	this.addEntry(dt + 'tabs', function()
	   		{
			   	var bg = new mxCell('Home', new mxGeometry(0, 0, 58, 40), s + 'tabTop;fillColor=#ffffff;align=center;fontColor=#000000;strokeColor=#dddddd;rSize=5;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(58, 35, 402, 10), 'shape=line;strokeColor=#dddddd;');
			   	bg2.vertex = true;
			   	var bg3 = new mxCell('Disabled Link', new mxGeometry(62, 0, 100, 40), s + 'topButton;fillColor=#ffffff;strokeColor=none;rSize=5;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	var bg4 = new mxCell('Messages', new mxGeometry(166, 0, 116, 40), s + 'topButton;align=center;fillColor=#ffffff;strokeColor=none;rSize=5;fontColor=#3D8BCD;spacingRight=30;whiteSpace=wrap;');
			   	bg4.vertex = true;
			   	var notif1 = new mxCell('24', new mxGeometry(1, 0.5, 25, 16), s + 'rrect;rSize=8;fillColor=#999999;strokeColor=none;fontColor=#ffffff;perimeter=none;whiteSpace=wrap;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(-36, -8);
			   	notif1.vertex = true;
			   	bg4.insert(notif1);
			   	var bg5 = new mxCell('Action Logs', new mxGeometry(286, 0, 106, 40), s + 'topButton;fillColor=#ffffff;strokeColor=none;rSize=5;fontColor=#3D8BCD;spacingRight=20;whiteSpace=wrap;');
			   	bg5.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#3D8BCD;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-21, -2.5);
			   	marker1.vertex = true;
			   	bg5.insert(marker1);
			    
			   	return sb.createVertexTemplateFromCells([bg, bg3, bg4, bg5, bg2], 460, 45, 'Tabs');
			}),

		   	this.addEntry(dt + 'pills', function()
	   		{
			   	var bg = new mxCell('Home', new mxGeometry(0, 0, 58, 40), s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#3D8BCD;fontColor=#ffffff;rSize=5;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg3 = new mxCell('Disabled Link', new mxGeometry(62, 0, 100, 40), s + 'rrect;fillColor=#ffffff;align=center;rSize=5;;strokeColor=none;rSize=5;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	var bg4 = new mxCell('Messages', new mxGeometry(166, 0, 116, 40), s + 'rrect;rSize=5;fillColor=#ffffff;align=center;strokeColor=none;rSize=5;fontColor=#3D8BCD;spacingRight=30;whiteSpace=wrap;');
			   	bg4.vertex = true;
			   	var notif1 = new mxCell('24', new mxGeometry(1, 0.5, 25, 16), s + 'rrect;rSize=8;fillColor=#999999;strokeColor=none;fontColor=#ffffff;perimeter=none;whiteSpace=wrap;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(-36, -8);
			   	notif1.vertex = true;
			   	bg4.insert(notif1);
			   	var bg5 = new mxCell('Action Logs', new mxGeometry(286, 0, 106, 40), s + 'rrect;rSize=5;fillColor=#ffffff;align=center;strokeColor=none;rSize=5;fontColor=#3D8BCD;spacingRight=20;whiteSpace=wrap;');
			   	bg5.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#3D8BCD;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-21, -2.5);
			   	marker1.vertex = true;
			   	bg5.insert(marker1);
			    
			   	return sb.createVertexTemplateFromCells([bg, bg3, bg4, bg5], 392, 45, 'Pills');
			}),
	
		   	this.addEntry(dt + 'breadcrumb', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 460, 30), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Home', new mxGeometry(0, 0, 50, 30), s + 'rect;perimeter=none;strokeColor=none;fillColor=none;fontColor=#3D8BCD;spacingLeft=10;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			   	var bg2 = new mxCell('/', new mxGeometry(0, 0, 20, 30), s + 'rect;perimeter=none;strokeColor=none;fillColor=none;fontColor=#dddddd;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(50, 0);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var bg3 = new mxCell('Library', new mxGeometry(0, 0, 50, 30), s + 'rect;perimeter=none;strokeColor=none;fillColor=none;fontColor=#3D8BCD;whiteSpace=wrap;resizeHeight=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(70, 0);
			   	bg3.vertex = true;
			   	bg.insert(bg3);
			   	var bg4 = new mxCell('/', new mxGeometry(0, 0, 20, 30), s + 'rect;perimeter=none;strokeColor=none;fillColor=none;fontColor=#dddddd;whiteSpace=wrap;resizeHeight=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(120, 0);
			   	bg4.vertex = true;
			   	bg.insert(bg4);
			   	var bg5 = new mxCell('Data', new mxGeometry(0, 0, 50, 30), s + 'rect;perimeter=none;strokeColor=none;fillColor=none;fontColor=#dddddd;whiteSpace=wrap;resizeHeight=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(140, 0);
			   	bg5.vertex = true;
			   	bg.insert(bg5);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Breadcrumb');
			}),
	
		   	this.addEntry(dt + 'pills vertical', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 200, 158), s + 'rrect;rSize5=;strokeColor=none;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Home', new mxGeometry(0, 0, 200, 30), s + 'rrect;rSize=5;strokeColor=none;fillColor=#3D8BCD;fontColor=#ffffff;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg1.geometry.relative = true;
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			   	var notif1 = new mxCell('42', new mxGeometry(1, 0.5, 25, 16), s + 'rrect;rSize=8;fillColor=#ffffff;strokeColor=none;fontColor=#3D8BCD;whiteSpace=wrap;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(-33, -8);
			   	notif1.vertex = true;
			   	bg1.insert(notif1);
			   	var bg2 = new mxCell('Profile', new mxGeometry(0, 0, 200, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=none;fontColor=#3D8BCD;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(0, 32);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			   	var bg3 = new mxCell('Messages', new mxGeometry(0, 0, 200, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=none;fontColor=#3D8BCD;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(0, 64);
			   	bg3.vertex = true;
			   	bg.insert(bg3);
			   	var notif2 = new mxCell('24', new mxGeometry(1, 0.5, 25, 16), s + 'rrect;rSize=8;fillColor=#999999;strokeColor=none;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(-33, -8);
			   	notif2.vertex = true;
			   	bg3.insert(notif2);
			   	var bg4 = new mxCell('Disabled Link', new mxGeometry(0, 0, 200, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=none;fontColor=#dddddd;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(0, 96);
			   	bg4.vertex = true;
			   	bg.insert(bg4);
			   	var bg5 = new mxCell('System Settings', new mxGeometry(0, 0, 200, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=none;fontColor=#3D8BCD;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 128);
			   	bg5.vertex = true;
			   	bg.insert(bg5);
			   	var notif3 = new mxCell('1', new mxGeometry(1, 0.5, 25, 16), s + 'rrect;rSize=8;fillColor=#999999;strokeColor=none;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif3.geometry.relative = true;
			   	notif3.geometry.offset = new mxPoint(-33, -8);
			   	notif3.vertex = true;
			   	bg5.insert(notif3);
			    
			   	return sb.createVertexTemplateFromCells([bg], 200, 158, 'Pills (Vertical)');
			}),
	
		   	this.addEntry(dt + 'navbar', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 720, 100), s + 'rrect;rSize=5;fillColor=#f6f6f6;strokeColor=#dddddd;recursiveResize=0;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Brand', new mxGeometry(0, 0, 80, 40), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;fontSize=14;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Link', new mxGeometry(80, 0, 60, 40), s + 'rect;fillColor=#dddddd;strokeColor=none;fontColor=#999999;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Link', new mxGeometry(140, 0, 60, 40), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Dropdown', new mxGeometry(200, 0, 100, 40), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;spacingRight=10;whiteSpace=wrap;');
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var notif1 = new mxCell('', new mxGeometry(1, 0.5, 8, 5), 'shape=triangle;fillColor=#999999;strokeColor=none;direction=south;perimeter=none;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(-19, -3);
			   	notif1.vertex = true;
			   	button4.insert(notif1);
			   	var button6 = new mxCell('Search...', new mxGeometry(305, 5, 200, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fontColor=#dddddd;align=left;spacingLeft=10;whiteSpace=wrap;');
			   	button6.vertex = true;
			   	bg.insert(button6);
			   	var button7 = new mxCell('Submit', new mxGeometry(510, 5, 80, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;whiteSpace=wrap;');
			   	button7.vertex = true;
			   	bg.insert(button7);
			   	var button8 = new mxCell('Link', new mxGeometry(1, 1, 60, 40), s + 'anchor;fontColor=#999999;whiteSpace=wrap;');
			   	button8.geometry.relative = true;
			   	button8.geometry.offset = new mxPoint(-180, -40);
			   	button8.vertex = true;
			   	bg.insert(button8);
			   	var button9 = new mxCell('Dropdown', new mxGeometry(1, 1, 100, 40), s + 'anchor;fontColor=#999999;spacingRight=10;whiteSpace=wrap;');
			   	button9.geometry.relative = true;
			   	button9.geometry.offset = new mxPoint(-120, -40);
			   	button9.vertex = true;
			   	bg.insert(button9);
			   	var notif2 = new mxCell('', new mxGeometry(1, 0.5, 8, 5), 'shape=triangle;fillColor=#999999;strokeColor=none;direction=south;perimeter=none;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(-19, -3);
			   	notif2.vertex = true;
			   	button9.insert(notif2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Navbar');
			}),
			    
		   	this.addEntry(dt + 'navbar form', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 720, 40), s + 'rrect;rSize=5;fillColor=#f6f6f6;strokeColor=#dddddd;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Brand', new mxGeometry(0, 0, 80, 40), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Search...', new mxGeometry(0, 0, 200, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fontColor=#dddddd;align=left;spacingLeft=10;whiteSpace=wrap;resizeHeight=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(85, 5);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Submit', new mxGeometry(0, 0, 80, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;whiteSpace=wrap;resizeHeight=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(290, 5);
			   	button3.vertex = true;
			   	bg.insert(button3);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Navbar Form');
			}),
			    
		   	this.addEntry(dt + 'navbar button', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 720, 40), s + 'rrect;rSize=5;fillColor=#f6f6f6;strokeColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Brand', new mxGeometry(0, 0, 80, 40), s + 'anchor;fontColor=#999999;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Sign in', new mxGeometry(0, 0, 60, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;whiteSpace=wrap;resizeHeight=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(80, 5);
			   	button2.vertex = true;
			   	bg.insert(button2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Navbar Button');
			}),
			    
		   	this.addEntry(dt + 'navbar text', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 720, 40), s + 'rrect;rSize=5;fillColor=#f6f6f6;strokeColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Brand', new mxGeometry(0, 0, 80, 40), s + 'anchor;fontColor=#999999;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Signed in as Mark Otto', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=10;whiteSpace=wrap;resizeHeight=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(80, 0);
			   	button2.vertex = true;
			   	bg.insert(button2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Navbar Text');
			}),
			    
		   	this.addEntry(dt + 'non nav link', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 720, 40), s + 'rrect;rSize=5;fillColor=#f6f6f6;strokeColor=#dddddd;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Brand', new mxGeometry(0, 0, 80, 40), s + 'anchor;fontColor=#999999;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Signed in as Mark Otto', new mxGeometry(1, 0, 160, 40), s + 'anchor;fontColor=#999999;align=right;spacingRight=20;whiteSpace=wrap;resizeHeight=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(-160, 0);
			   	button2.vertex = true;
			   	bg.insert(button2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Non-nav Link');
			}),
			    
		   	this.addEntry(dt + 'navbar', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 720, 40), s + 'rrect;strokeColor=none;rSize=5;fillColor=#222222;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Brand', new mxGeometry(0, 0, 80, 40), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Home', new mxGeometry(0, 0, 60, 40), s + 'rect;fillColor=#000000;strokeColor=none;fontColor=#ffffff;whiteSpace=wrap;resizeHeight=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(80, 0);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Link', new mxGeometry(0, 0, 60, 40), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;whiteSpace=wrap;resizeHeight=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(140, 0);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Link', new mxGeometry(0, 0, 60, 40), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;whiteSpace=wrap;resizeHeight=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(200, 0);
			   	button4.vertex = true;
			   	bg.insert(button4);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Navbar');
			}),
	
		   	this.addEntry(dt + 'jumbotron', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 800, 500), s + 'rrect;rSize=5;fillColor=#f0f0f0;strokeColor=none;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Hello, world!', new mxGeometry(60, 80, 680, 80), s + 'anchor;fontSize=80;align=left;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell(
			   			'This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.', 
			   			new mxGeometry(60, 180, 660, 100), s + 'anchor;fontSize=24;whiteSpace=wrap;align=left;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Learn more', new mxGeometry(0.075, 0.6, 180, 60), s + 'rrect;fontColor=#FFFFFF;fillColor=#3D8BCD;strokeColor=none;fontSize=24;whiteSpace=wrap;');
			   	button3.geometry.relative = true;
			   	button3.vertex = true;
			   	bg.insert(button3);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Jumbotron');
			}),
			    
		   	this.addEntry(dt + 'page header', function()
		   	{
			   	var button1 = new mxCell('Example page header', new mxGeometry(0, 0, 360, 50), s + 'anchor;fontSize=35;align=left;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	var button2 = new mxCell('Subtext for header', new mxGeometry(360, 10, 300, 40), s + 'anchor;fontSize=24;align=left;fontColor=#999999;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	var button3 = new mxCell('', new mxGeometry(0, 50, 750, 10), 'shape=line;strokeColor=#dddddd;');
			   	button3.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([button1, button2, button3], 700, 80, 'Page header');
			}),
			    
		   	this.addEntry(dt + 'thumbnail custom content', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 330, 400), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('320x200', new mxGeometry(5, 5, 320, 200), 'shape=rect;fontSize=24;fillColor=#f0f0f0;strokeColor=none;fontColor=#999999;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Thumbnail label', new mxGeometry(15, 220, 300, 40), s + 'anchor;fontSize=26;align=left;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell(
			   			'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh' +
			   			' ultricies vehicula ut id elit.', 
			   			new mxGeometry(15, 260, 300, 80), s + 'anchor;strokeColor=#dddddd;whiteSpace=wrap;align=left;verticalAlign=top;fontSize=14;whiteSpace=wrap;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Button', new mxGeometry(0, 1, 80, 40), s + 'rrect;rSize=5;fontSize=16;fillColor=#3D8BCD;strokeColor=none;fontColor=#ffffff;whiteSpace=wrap;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(15, -60);
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button5 = new mxCell('Button', new mxGeometry(0, 1, 80, 40), s + 'rrect;rSize=5;fontSize=16;strokeColor=#dddddd;whiteSpace=wrap;');
			   	button5.geometry.relative = true;
			   	button5.geometry.offset = new mxPoint(100, -60);
			   	button5.vertex = true;
			   	bg.insert(button5);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Thumbnail with custom content');
			}),
			   	
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#999999;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#0D5B9D;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#58B957;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#55BFE0;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#EFAC43;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#DB524C;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#999999;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#0D5B9D;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#58B957;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#55BFE0;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#EFAC43;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#DB524C;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),

		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=30;align=left;spacingLeft=10;', 
		   			250, 40, 'Header Text', 'Header Text (30)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=25;align=left;spacingLeft=10;', 
		   			250, 35, 'Header Text', 'Header Text (25)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=20;align=left;spacingLeft=10;', 
		   			250, 30, 'Header Text', 'Header Text (20)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=16;align=left;spacingLeft=10;', 
		   			250, 26, 'Header Text', 'Header Text (16)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=12;align=left;spacingLeft=10;', 
		   			250, 22, 'Header Text', 'Header Text (12)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=10;align=left;spacingLeft=10;', 
		   			250, 20, 'Header Text', 'Header Text (10)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	
		   	this.createVertexTemplateEntry(s + 'image;align=center;rSize=5;strokeColor=#f6f6f6;fillColor=#f6f6f6;fontColor=#999999;strokeWidth=2;whiteSpace=wrap;', 
		   			150, 150, 'Image', 'Image', null, null, this.getTagsForStencil(gn, 'image', dt + '').join(' ')),

		   	this.addEntry(dt + 'image', function()
		   	{
			   	var bg1 = new mxCell('Image', new mxGeometry(0, 0, 150, 70), s + 'image;align=center;rSize=5;strokeColor=#f6f6f6;fillColor=#f6f6f6;fontColor=#999999;strokeWidth=2;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Image', new mxGeometry(0, 80, 70, 70), s + 'image;align=center;rSize=5;strokeColor=#f6f6f6;fillColor=#f6f6f6;fontColor=#999999;strokeWidth=2;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	var bg3 = new mxCell('Image', new mxGeometry(80, 80, 70, 70), s + 'image;align=center;rSize=5;strokeColor=#f6f6f6;fillColor=#f6f6f6;fontColor=#999999;strokeWidth=2;whiteSpace=wrap;');
			   	bg3.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg2, bg3], 150, 150, 'Images');
			}),
	
		   	this.addEntry(dt + 'dismissible alert', function()
		   	{
			   	var bg1 = new mxCell(
			   			'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;margin-left:14px;"><tbody><tr><td align="left" valign="middle" width="50%"><b>Well done!</b> You successfully read <u>this important alert message.</u></td></tr></tbody></table>', 
			   			new mxGeometry(0, 0, 800, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#E0F0D6;fontColor=#59B958;overflow=fill;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 10, 10), s + 'x;strokeColor=#59B958;strokeWidth=2;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-25, -5);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Dismissible Alert');
			}),
	
		   	this.addEntry(dt + 'dismissible alert', function()
		   	{
			   	var bg1 = new mxCell(
			   			'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;margin-left:14px;"><tbody><tr><td align="left" valign="middle" width="50%"><b>Heads up!</b> This <u>alert needs you attention</u>, but it\'s not super important.</td></tr></tbody></table>', 
			   			new mxGeometry(0, 0, 800, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#D9EDF8;fontColor=#55C0E0;overflow=fill;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 10, 10), s + 'x;strokeColor=#55C0E0;strokeWidth=2;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-25, -5);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Dismissible Alert');
			}),
	
		   	this.addEntry(dt + 'dismissible alert', function()
		   	{
			   	var bg1 = new mxCell(
			   			'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;margin-left:14px;"><tbody><tr><td align="left" valign="middle" width="50%"><b>Warning!</b> Better check yourself, <u>you\'re not looking too good.</u></td></tr></tbody></table>', 
			   			new mxGeometry(0, 0, 800, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#FDF8E4;fontColor=#F2AE43;overflow=fill;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 10, 10), s + 'x;strokeColor=#F2AE43;strokeWidth=2;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-25, -5);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Dismissible Alert');
			}),
	
		   	this.addEntry(dt + 'dismissible alert', function()
		   	{
			   	var bg1 = new mxCell(
			   			'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;margin-left:14px;"><tbody><tr><td align="left" valign="middle" width="50%"><b>Oh snap!</b> <u>Change a few things up</u> and try submitting again.</td></tr></tbody></table>', 
			   			new mxGeometry(0, 0, 800, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#F2DEDF;fontColor=#DB524C;overflow=fill;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 10, 10), s + 'x;strokeColor=#DB524C;strokeWidth=2;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-25, -5);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Dismissible Alert');
			}),
	
		   	this.addEntry(dt + 'progress bar', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#59B958;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar');
			}),
	
		   	this.addEntry(dt + 'progress bar', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#55C0E0;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar');
			}),
	
		   	this.addEntry(dt + 'progress bar', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#F2AE43;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar');
			}),
	
		   	this.addEntry(dt + 'progress bar', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#DB524C;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar');
			}),
	
		   	this.addEntry(dt + 'progress bar low percentage', function()
		   	{
			   	var bg1 = new mxCell('0%', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;fontColor=#000000;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg1.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Low percentage)');
			}),
	
		   	this.addEntry(dt + 'progress bar low percentage', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('2%', new mxGeometry(0, 0, 30, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#55C0E0;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Low percentage)');
			}),
	
		   	this.addEntry(dt + 'progress bar striped', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButtonStriped;fillColor=#59B958;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Striped)');
			}),
	
		   	this.addEntry(dt + 'progress bar striped', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButtonStriped;fillColor=#55BFE0;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Striped)');
			}),
	
		   	this.addEntry(dt + 'progress bar striped', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButtonStriped;fillColor=#EFAC43;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Striped)');
			}),
	
		   	this.addEntry(dt + 'progress bar striped', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButtonStriped;fillColor=#DB524C;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Striped)');
			}),
	
		   	this.addEntry(dt + 'progress bar', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 150, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#DB524C;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('', new mxGeometry(150, 0, 200, 20), 'rect;strokeColor=none;fillColor=#F2AE43;html=1;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			   	var bg4 = new mxCell('', new mxGeometry(350, 0, 50, 20), 'rect;strokeColor=none;fillColor=#59B958;html=1;whiteSpace=wrap;');
			   	bg4.vertex = true;
			   	bg1.insert(bg4);
			   	var bg5 = new mxCell('', new mxGeometry(400, 0, 150, 20), 'rect;strokeColor=none;fillColor=#55C0E0;html=1;whiteSpace=wrap;');
			   	bg5.vertex = true;
			   	bg1.insert(bg5);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar');
			}),
	
		   	this.addEntry(dt + 'default media', function()
		   	{
			   	var bg1 = new mxCell('64x64', new mxGeometry(0, 0, 64, 64), s + 'rect;align=center;strokeColor=none;fillColor=#f6f6f6;fontColor=#999999;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Media heading', new mxGeometry(70, 0, 200, 30), s + 'anchor;fontSize=24;align=left;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	var bg3 = new mxCell(
			   			'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in ' +
			   			'vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.', 
			   			new mxGeometry(70, 30, 630, 60), s + 'anchor;align=left;verticalAlign=top;whiteSpace=wrap;fontSize=14;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	var bg4 = new mxCell('64x64', new mxGeometry(0, 100, 64, 64), s + 'rect;align=center;strokeColor=none;fillColor=#f6f6f6;fontColor=#999999;whiteSpace=wrap;');
			   	bg4.vertex = true;
			   	var bg5 = new mxCell('Media heading', new mxGeometry(70, 100, 200, 30), s + 'anchor;fontSize=24;align=left;whiteSpace=wrap;');
			   	bg5.vertex = true;
			   	var bg6 = new mxCell(
			   			'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in ' +
			   			'vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.', 
			   			new mxGeometry(70, 130, 630, 60), s + 'anchor;align=left;verticalAlign=top;whiteSpace=wrap;fontSize=14;whiteSpace=wrap;');
			   	bg6.vertex = true;
			   	var bg7 = new mxCell('64x64', new mxGeometry(70, 200, 64, 64), s + 'rect;align=center;strokeColor=none;fillColor=#f6f6f6;fontColor=#999999;whiteSpace=wrap;');
			   	bg7.vertex = true;
			   	var bg8 = new mxCell('Nested media heading', new mxGeometry(140, 200, 300, 30), s + 'anchor;fontSize=24;align=left;whiteSpace=wrap;');
			   	bg8.vertex = true;
			   	var bg9 = new mxCell(
			   			'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in ' +
			   			'vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.', 
			   			new mxGeometry(140, 230, 560, 60), s + 'anchor;align=left;verticalAlign=top;whiteSpace=wrap;fontSize=14;whiteSpace=wrap;');
			   	bg9.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9], 700, 290, 'Default Media');
			}),
	
		   	this.addEntry(dt + 'media list', function()
		   	{
			   	var bg1 = new mxCell('64x64', new mxGeometry(0, 0, 64, 64), s + 'rect;align=center;strokeColor=none;fillColor=#f6f6f6;fontColor=#999999;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Media heading', new mxGeometry(70, 0, 200, 30), s + 'anchor;fontSize=24;align=left;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	var bg3 = new mxCell(
			   			'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in ' +
			   			'vulputate at, tempus viverra turpis.', 
			   			new mxGeometry(70, 30, 630, 60), s + 'anchor;align=left;verticalAlign=top;whiteSpace=wrap;fontSize=14;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	var bg4 = new mxCell('64x64', new mxGeometry(70, 90, 64, 64), s + 'rect;align=center;strokeColor=none;fillColor=#f6f6f6;fontColor=#999999;whiteSpace=wrap;');
			   	bg4.vertex = true;
			   	var bg5 = new mxCell('Nested Media heading', new mxGeometry(140, 90, 300, 30), s + 'anchor;fontSize=24;align=left;whiteSpace=wrap;');
			   	bg5.vertex = true;
			   	var bg6 = new mxCell(
			   			'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in ' +
			   			'vulputate at, tempus viverra turpis.', 
			   			new mxGeometry(140, 120, 560, 60), s + 'anchor;align=left;verticalAlign=top;whiteSpace=wrap;fontSize=14;whiteSpace=wrap;');
			   	bg6.vertex = true;
			   	var bg7 = new mxCell('64x64', new mxGeometry(140, 180, 64, 64), s + 'rect;align=center;strokeColor=none;fillColor=#f6f6f6;fontColor=#999999;whiteSpace=wrap;');
			   	bg7.vertex = true;
			   	var bg8 = new mxCell('Nested media heading', new mxGeometry(210, 180, 300, 30), s + 'anchor;fontSize=24;align=left;whiteSpace=wrap;');
			   	bg8.vertex = true;
			   	var bg9 = new mxCell(
			   			'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in ' +
			   			'vulputate at, tempus viverra turpis.', 
			   			new mxGeometry(210, 210, 490, 60), s + 'anchor;align=left;verticalAlign=top;whiteSpace=wrap;fontSize=14;whiteSpace=wrap;');
			   	bg9.vertex = true;
			   	var bg10 = new mxCell('64x64', new mxGeometry(70, 280, 64, 64), s + 'rect;align=center;strokeColor=none;fillColor=#f6f6f6;fontColor=#999999;whiteSpace=wrap;');
			   	bg10.vertex = true;
			   	var bg11 = new mxCell('Nested Media heading', new mxGeometry(140, 280, 300, 30), s + 'anchor;fontSize=24;align=left;whiteSpace=wrap;');
			   	bg11.vertex = true;
			   	var bg12 = new mxCell(
			   			'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in ' +
			   			'vulputate at, tempus viverra turpis.', 
			   			new mxGeometry(140, 310, 560, 60), s + 'anchor;align=left;verticalAlign=top;whiteSpace=wrap;fontSize=14;whiteSpace=wrap;');
			   	bg12.vertex = true;
			   	var bg13 = new mxCell('64x64', new mxGeometry(636, 370, 64, 64), s + 'rect;align=center;strokeColor=none;fillColor=#f6f6f6;fontColor=#999999;whiteSpace=wrap;');
			   	bg13.vertex = true;
			   	var bg14 = new mxCell('Media heading', new mxGeometry(0, 370, 200, 30), s + 'anchor;fontSize=24;align=left;whiteSpace=wrap;');
			   	bg14.vertex = true;
			   	var bg15 = new mxCell(
			   			'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in ' +
			   			'vulputate at, tempus viverra turpis.', 
			   			new mxGeometry(0, 400, 630, 60), s + 'anchor;align=left;verticalAlign=top;whiteSpace=wrap;fontSize=14;whiteSpace=wrap;');
			   	bg15.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15], 700, 460, 'Media List');
			}),
	
		   	this.addEntry(dt + 'linked item custom content', function()
		   	{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 400, 240), s + 'rrect;rSize=5;fillColor=#ffffff;strokeColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var button2 = new mxCell('Donec id elit non mi porta gravida at eget metus.\nMaecenas sed diam eget risus varius blandit.', new mxGeometry(0, 0, 400, 80), 
			   			s + 'rect;fillColor=none;strokeColor=#dddddd;perimeter=none;spacingLeft=10;align=left;fontSize=14;whiteSpace=wrap;verticalAlign=bottom;spacingBottom=10;resizeWidth=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(0, 80);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var heading2 = new mxCell('List group item heading', new mxGeometry(0, 0, 400, 40), s + 'anchor;spacingLeft=10;align=left;fontSize=18;whiteSpace=wrap;resizeWidth=1;');
			   	heading2.geometry.relative = true;
			   	heading2.vertex = true;
			   	button2.insert(heading2);
			   	var button3 = new mxCell('Donec id elit non mi porta gravida at eget metus.\nMaecenas sed diam eget risus varius blandit.', new mxGeometry(0, 1, 400, 80),
			   			s + 'bottomButton;rSize=5;fillColor=none;strokeColor=#dddddd;spacingLeft=10;align=left;fontSize=14;perimeter=none;whiteSpace=wrap;verticalAlign=bottom;spacingBottom=13;resizeWidth=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(0, -80);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var heading3 = new mxCell('List group item heading', new mxGeometry(0, 0, 400, 40), s + 'anchor;spacingLeft=10;align=left;fontSize=18;whiteSpace=wrap;resizeWidth=1;');
			   	heading3.geometry.relative = true;
			   	heading3.vertex = true;
			   	button3.insert(heading3);
			   	var button1 = new mxCell('Donec id elit non mi porta gravida at eget metus.\nMaecenas sed diam eget risus varius blandit.', new mxGeometry(0, 0, 400, 80), 
			   			s + 'topButton;rSize=5;fillColor=#3D8BCD;strokeColor=#3D8BCD;fontColor=#ffffff;spacingLeft=10;align=left;fontSize=14;perimeter=none;whiteSpace=wrap;verticalAlign=bottom;spacingBottom=13;resizeWidth=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var heading1 = new mxCell('List group item heading', new mxGeometry(0, 0, 400, 40), s + 'anchor;fontColor=#ffffff;spacingLeft=10;align=left;fontSize=18;whiteSpace=wrap;resizeWidth=1;');
			   	heading1.geometry.relative = true;
			   	heading1.vertex = true;
			   	button1.insert(heading1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Linked Items (Custom Content)');
			}),
			    
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#E0F0D6;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#E0F0D6;fontColor=#59B958;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
	
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#D9EDF8;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#D9EDF8;fontColor=#55C0E0;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
	
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#FDF8E4;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#FDF8E4;fontColor=#F2AE43;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
	
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#F2DEDF;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#F2DEDF;fontColor=#DB524C;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
			   	
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#3D8BCD;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#3D8BCD;fontColor=#ffffff;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
			
		   	this.addEntry(dt + 'panel footer', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#E0F0D6;fillColor=#ffffff;fontColor=#f0f0f0;spacingBottom=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 1, 150, 30), s + 'bottomButton;rSize=5;strokeColor=none;fillColor=#E0F0D6;fontColor=#59B958;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(0, -30);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel (Footer)');
			}),
	
		   	this.addEntry(dt + 'table', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 280), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 800, 40), s + 'topButton;rSize=5;strokeColor=#dddddd;fillColor=#fdfdfd;fontColor=#999999;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg2a = new mxCell(
			   			'Some default panel content here. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. ' + 
			   			'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula. ', 
			   			new mxGeometry(0, 0, 800, 80), s + 'rect;strokeColor=#dddddd;fillColor=none;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2a.geometry.relative = true;
			   	bg2a.geometry.offset = new mxPoint(0, 40);
			   	bg2a.vertex = true;
			   	bg1.insert(bg2a);
			   	var bg3 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'rect;strokeColor=#dddddd;fillColor=#fdfdfd;whiteSpace=wrap;resizeWidth=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint (0, 120);
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			   	var bg4 = new mxCell('#', new mxGeometry(0, 0, 50, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;whiteSpace=wrap;resizeHeight=1;');
			   	bg4.geometry.relative = true;
			   	bg4.vertex = true;
			   	bg3.insert(bg4);
			   	var bg5 = new mxCell('First Name', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(80, 0);
			   	bg5.vertex = true;
			   	bg3.insert(bg5);
			   	var bg6 = new mxCell('Last Name', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(230, 0);
			   	bg6.vertex = true;
			   	bg3.insert(bg6);
			   	var bg7 = new mxCell('Username', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(380, 0);
			   	bg7.vertex = true;
			   	bg3.insert(bg7);
			   	var bg8 = new mxCell('Active', new mxGeometry(0, 0, 100, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(560, 0);
			   	bg8.vertex = true;
			   	bg3.insert(bg8);
			   	var bg9 = new mxCell('Boss', new mxGeometry(0, 0, 100, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(700, 0);
			   	bg9.vertex = true;
			   	bg3.insert(bg9);
			   	var bg10 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'rect;strokeColor=#dddddd;fillColor=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg10.geometry.relative = true;
			   	bg10.geometry.offset = new mxPoint(0, 160);
			   	bg10.vertex = true;
			   	bg1.insert(bg10);
			   	var bg11 = new mxCell('1', new mxGeometry(0, 0, 50, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg11.geometry.relative = true;
			   	bg11.vertex = true;
			   	bg10.insert(bg11);
			   	var bg12 = new mxCell('John', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg12.geometry.relative = true;
			   	bg12.geometry.offset = new mxPoint(80, 0);
			   	bg12.vertex = true;
			   	bg10.insert(bg12);
			   	var bg13 = new mxCell('Boo', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg13.geometry.relative = true;
			   	bg13.geometry.offset = new mxPoint(230, 0);
			   	bg13.vertex = true;
			   	bg10.insert(bg13);
			   	var bg14 = new mxCell('johnny81', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg14.geometry.relative = true;
			   	bg14.geometry.offset = new mxPoint(380, 0);
			   	bg14.vertex = true;
			   	bg10.insert(bg14);
			   	var notif1 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), s + 'checkbox;strokeColor=#666666;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(560, -10);
			   	notif1.vertex = true;
			   	bg10.insert(notif1);
			   	var notif2 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=#666666;html=1;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(700, -10);
			   	notif2.vertex = true;
			   	bg10.insert(notif2);
			   	var bg17 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'rect;strokeColor=#dddddd;fillColor=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg17.geometry.relative = true;
			   	bg17.geometry.offset = new mxPoint(0, 200);
			   	bg17.vertex = true;
			   	bg1.insert(bg17);
			   	var bg18 = new mxCell('2', new mxGeometry(0, 0, 50, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg18.geometry.relative = true;
			   	bg18.vertex = true;
			   	bg17.insert(bg18);
			   	var bg19 = new mxCell('Mary', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg19.geometry.relative = true;
			   	bg19.geometry.offset = new mxPoint(80, 0);
			   	bg19.vertex = true;
			   	bg17.insert(bg19);
			   	var bg20 = new mxCell('Brown', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg20.geometry.relative = true;
			   	bg20.geometry.offset = new mxPoint(230, 0);
			   	bg20.vertex = true;
			   	bg17.insert(bg20);
			   	var bg21 = new mxCell('missmary', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg21.geometry.relative = true;
			   	bg21.geometry.offset = new mxPoint(380, 0);
			   	bg21.vertex = true;
			   	bg17.insert(bg21);
			   	var notif3 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), s + 'checkbox;strokeColor=#666666;');
			   	notif3.geometry.relative = true;
			   	notif3.geometry.offset = new mxPoint(560, -10);
			   	notif3.vertex = true;
			   	bg17.insert(notif3);
			   	var notif4 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), s + 'radioButton;strokeColor=#666666;');
			   	notif4.geometry.relative = true;
			   	notif4.geometry.offset = new mxPoint(700, -10);
			   	notif4.vertex = true;
			   	bg17.insert(notif4);
			   	var bg24 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'bottomButton;rSize=5;strokeColor=#dddddd;fillColor=none;whiteSpace=wrap;resizeWidth=1;');
			   	bg24.geometry.relative = true;
			   	bg24.geometry.offset = new mxPoint(0, 240);
			   	bg24.vertex = true;
			   	bg1.insert(bg24);
			   	var bg25 = new mxCell('3', new mxGeometry(0, 0, 50, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg25.geometry.relative = true;
			   	bg25.vertex = true;
			   	bg24.insert(bg25);
			   	var bg26 = new mxCell('James', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg26.geometry.relative = true;
			   	bg26.geometry.offset = new mxPoint(80, 0);
			   	bg26.vertex = true;
			   	bg24.insert(bg26);
			   	var bg27 = new mxCell('Mooray', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg27.geometry.relative = true;
			   	bg27.geometry.offset = new mxPoint(230, 0);
			   	bg27.vertex = true;
			   	bg24.insert(bg27);
			   	var bg28 = new mxCell('jijames', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg28.geometry.relative = true;
			   	bg28.geometry.offset = new mxPoint(380, 0);
			   	bg28.vertex = true;
			   	bg24.insert(bg28);
			   	var notif5 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), s + 'rrect;rSize=3;strokeColor=#666666;');
			   	notif5.geometry.relative = true;
			   	notif5.geometry.offset = new mxPoint(560, -10);
			   	notif5.vertex = true;
			   	bg24.insert(notif5);
			   	var notif6 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=#666666;html=1;');
			   	notif6.geometry.relative = true;
			   	notif6.geometry.offset = new mxPoint(700, -10);
			   	notif6.vertex = true;
			   	bg24.insert(notif6);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Table');
			}),
	
		   	this.addEntry(dt + 'panel list group', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 600, 320), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 600, 40), s + 'topButton;rSize=5;strokeColor=#dddddd;fillColor=#fdfdfd;fontColor=#999999;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell(
			   			'Some default panel content here. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. ' + 
			   			'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula. ', 
			   			new mxGeometry(0, 0, 600, 80), s + 'rect;strokeColor=#dddddd;fillColor=none;align=left;spacingLeft=10;whiteSpace=wrap;fontSize=14;whiteSpace=wrap;resizeWidth=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(0, 40);
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			   	var bg4 = new mxCell('Cras justo odio', new mxGeometry(0, 0, 600, 40), s + 'rect;strokeColor=#dddddd;fillColor=none;spacingLeft=10;fontSize=14;align=left;whiteSpace=wrap;resizeWidth=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(0, 120);
			   	bg4.vertex = true;
			   	bg1.insert(bg4);
			   	var bg5 = new mxCell('Dapibus ac facilisis in', new mxGeometry(0, 0, 600, 40), s + 'rect;strokeColor=#dddddd;fillColor=none;spacingLeft=10;fontSize=14;align=left;whiteSpace=wrap;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 160);
			   	bg5.vertex = true;
			   	bg1.insert(bg5);
			   	var bg6 = new mxCell('Morbi leo risus', new mxGeometry(0, 0, 600, 40), s + 'rect;strokeColor=#dddddd;fillColor=none;spacingLeft=10;fontSize=14;align=left;whiteSpace=wrap;resizeWidth=1;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(0, 200);
			   	bg6.vertex = true;
			   	bg1.insert(bg6);
			   	var bg7 = new mxCell('Porta ac consectetur ac', new mxGeometry(0, 0, 600, 40), s + 'rect;strokeColor=#dddddd;fillColor=none;spacingLeft=10;fontSize=14;align=left;whiteSpace=wrap;resizeWidth=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(0, 240);
			   	bg7.vertex = true;
			   	bg1.insert(bg7);
			   	var bg8 = new mxCell('Vestibulum at eros', new mxGeometry(0, 1, 600, 40), s + 'bottomButton;rSize=5;strokeColor=#dddddd;fillColor=none;spacingLeft=10;fontSize=14;align=left;whiteSpace=wrap;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, -40);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel (List Group)');
			}),
	
		   	this.addEntry(dt + 'table', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 160), s + 'rect;strokeColor=none;fillColor=#ffffff;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=#fdfdfd;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('#', new mxGeometry(0, 0, 50, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;whiteSpace=wrap;resizeHeight=1;');
			   	bg3.geometry.relative = true;
			   	bg3.vertex = true;
			   	bg2.insert(bg3);
			   	var bg4 = new mxCell('First Name', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(80, 0);
			   	bg4.vertex = true;
			   	bg2.insert(bg4);
			   	var bg5 = new mxCell('Last Name', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(230, 0);
			   	bg5.vertex = true;
			   	bg2.insert(bg5);
			   	var bg6 = new mxCell('Username', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(380, 0);
			   	bg6.vertex = true;
			   	bg2.insert(bg6);
			   	var bg7 = new mxCell('Active', new mxGeometry(0, 0, 100, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(560, 0);
			   	bg7.vertex = true;
			   	bg2.insert(bg7);
			   	var bg8 = new mxCell('Boss', new mxGeometry(0, 0, 100, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(700, 0);
			   	bg8.vertex = true;
			   	bg2.insert(bg8);
			   	var bg9 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(0, 40);
			   	bg9.vertex = true;
			   	bg1.insert(bg9);
			   	var bg10 = new mxCell('1', new mxGeometry(0, 0, 50, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg10.geometry.relative = true;
			   	bg10.vertex = true;
			   	bg9.insert(bg10);
			   	var bg11 = new mxCell('John', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg11.geometry.relative = true;
			   	bg11.geometry.offset = new mxPoint(80, 0);
			   	bg11.vertex = true;
			   	bg9.insert(bg11);
			   	var bg12 = new mxCell('Boo', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg12.geometry.relative = true;
			   	bg12.geometry.offset = new mxPoint(230, 0);
			   	bg12.vertex = true;
			   	bg9.insert(bg12);
			   	var bg13 = new mxCell('johnny81', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg13.geometry.relative = true;
			   	bg13.geometry.offset = new mxPoint(380, 0);
			   	bg13.vertex = true;
			   	bg9.insert(bg13);
			   	var notif1 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), s + 'checkbox;strokeColor=#666666;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(560, -10);
			   	notif1.vertex = true;
			   	bg9.insert(notif1);
			   	var notif2 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=#666666;html=1;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(700, -10);
			   	notif2.vertex = true;
			   	bg9.insert(notif2);
			   	var bg16 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg16.geometry.relative = true;
			   	bg16.geometry.offset = new mxPoint(0, 80);
			   	bg16.vertex = true;
			   	bg1.insert(bg16);
			   	var bg17 = new mxCell('2', new mxGeometry(0, 0, 50, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg17.geometry.relative = true;
			   	bg17.vertex = true;
			   	bg16.insert(bg17);
			   	var bg18 = new mxCell('Mary', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg18.geometry.relative = true;
			   	bg18.geometry.offset = new mxPoint(80, 0);
			   	bg18.vertex = true;
			   	bg16.insert(bg18);
			   	var bg19 = new mxCell('Brown', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg19.geometry.relative = true;
			   	bg19.geometry.offset = new mxPoint(230, 0);
			   	bg19.vertex = true;
			   	bg16.insert(bg19);
			   	var bg20 = new mxCell('missmary', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg20.geometry.relative = true;
			   	bg20.geometry.offset = new mxPoint(380, 0);
			   	bg20.vertex = true;
			   	bg16.insert(bg20);
			   	var notif3 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), s + 'checkbox;strokeColor=#666666;');
			   	notif3.geometry.relative = true;
			   	notif3.geometry.offset = new mxPoint(560, -10);
			   	notif3.vertex = true;
			   	bg16.insert(notif3);
			   	var notif4 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), s + 'radioButton;strokeColor=#666666;');
			   	notif4.geometry.relative = true;
			   	notif4.geometry.offset = new mxPoint(700, -10);
			   	notif4.vertex = true;
			   	bg16.insert(notif4);
			   	var bg23 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg23.geometry.relative = true;
			   	bg23.geometry.offset = new mxPoint(0, 120);
			   	bg23.vertex = true;
			   	bg1.insert(bg23);
			   	var bg24 = new mxCell('3', new mxGeometry(0, 0, 50, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg24.geometry.relative = true;
			   	bg24.vertex = true;
			   	bg23.insert(bg24);
			   	var bg25 = new mxCell('James', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg25.geometry.relative = true;
			   	bg25.geometry.offset = new mxPoint(80, 0);
			   	bg25.vertex = true;
			   	bg23.insert(bg25);
			   	var bg26 = new mxCell('Mooray', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg26.geometry.relative = true;
			   	bg26.geometry.offset = new mxPoint(230, 0);
			   	bg26.vertex = true;
			   	bg23.insert(bg26);
			   	var bg27 = new mxCell('jijames', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg27.geometry.relative = true;
			   	bg27.geometry.offset = new mxPoint(380, 0);
			   	bg27.vertex = true;
			   	bg23.insert(bg27);
			   	var notif5 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), s + 'rrect;rSize=3;strokeColor=#666666;');
			   	notif5.geometry.relative = true;
			   	notif5.geometry.offset = new mxPoint(560, -10);
			   	notif5.vertex = true;
			   	bg23.insert(notif5);
			   	var notif6 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=#666666;html=1;');
			   	notif6.geometry.relative = true;
			   	notif6.geometry.offset = new mxPoint(700, -10);
			   	notif6.vertex = true;
			   	bg23.insert(notif6);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Table');
			}),
	
		   	this.addEntry(dt + 'table', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 360), s + 'rect;strokeColor=none;fillColor=#ffffff;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=#fdfdfd;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('Name', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(50, 0);
			   	bg3.vertex = true;
			   	bg2.insert(bg3);
			   	var bg4 = new mxCell('Double-Line\nHeader', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(250, 0);
			   	bg4.vertex = true;
			   	bg2.insert(bg4);
			   	var bg5 = new mxCell('Rating', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(450, 0);
			   	bg5.vertex = true;
			   	bg2.insert(bg5);
			   	var bg6 = new mxCell('Signed Up', new mxGeometry(0, 0, 100, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(620, 0);
			   	bg6.vertex = true;
			   	bg2.insert(bg6);
			   	var notif1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;strokeColor=none;fillColor=#000000;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(-25, -2.5);
			   	notif1.vertex = true;
			   	bg6.insert(notif1);
			   	var bg8 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 40);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var notif2 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(15, -10);
			   	notif2.vertex = true;
			   	bg8.insert(notif2);
			   	var notif3 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif3.geometry.relative = true;
			   	notif3.geometry.offset = new mxPoint(-7, -6);
			   	notif3.vertex = true;
			   	notif2.insert(notif3);
			   	var bg11 = new mxCell('John Boo', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg11.geometry.relative = true;
			   	bg11.geometry.offset = new mxPoint(50, 0);
			   	bg11.vertex = true;
			   	bg8.insert(bg11);
			   	var notif4 = new mxCell('ok', new mxGeometry(0, 0.5, 30, 20), s + 'rrect;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif4.geometry.relative = true;
			   	notif4.geometry.offset = new mxPoint(250, -10);
			   	notif4.vertex = true;
			   	bg8.insert(notif4);
			   	var notif5 = new mxCell('', new mxGeometry(0, 0.5, 150, 14), s + 'rating;strokeColor=none;fillColor=#EFAC43;emptyFillColor=#dddddd;grade=3;ratingScale=5;ratingStyle=star;');
			   	notif5.geometry.relative = true;
			   	notif5.geometry.offset = new mxPoint(450, -7);
			   	notif5.vertex = true;
			   	bg8.insert(notif5);
			   	var bg14 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 8:56 AM <font color="#dddddd">(2013)</font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg14.geometry.relative = true;
			   	bg14.geometry.offset = new mxPoint(620, 0);
			   	bg14.vertex = true;
			   	bg8.insert(bg14);
			   	var bg15 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg15.geometry.relative = true;
			   	bg15.geometry.offset = new mxPoint(0, 80);
			   	bg15.vertex = true;
			   	bg1.insert(bg15);
			   	var notif6 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif6.geometry.relative = true;
			   	notif6.geometry.offset = new mxPoint(15, -10);
			   	notif6.vertex = true;
			   	bg15.insert(notif6);
			   	var notif7 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif7.geometry.relative = true;
			   	notif7.geometry.offset = new mxPoint(-7, -6);
			   	notif7.vertex = true;
			   	notif6.insert(notif7);
			   	var bg18 = new mxCell('Michael Robinson', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg18.geometry.relative = true;
			   	bg18.geometry.offset = new mxPoint(50, 0);
			   	bg18.vertex = true;
			   	bg15.insert(bg18);
			   	var notif8 = new mxCell('ok', new mxGeometry(0, 0.5, 30, 20), s + 'rrect;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif8.geometry.relative = true;
			   	notif8.geometry.offset = new mxPoint(250, -10);
			   	notif8.vertex = true;
			   	bg15.insert(notif8);
			   	var notif9 = new mxCell('', new mxGeometry(0, 0.5, 150, 14), s + 'rating;strokeColor=none;fillColor=#EFAC43;emptyFillColor=#dddddd;grade=5;ratingScale=5;ratingStyle=star;');
			   	notif9.geometry.relative = true;
			   	notif9.geometry.offset = new mxPoint(450, -7);
			   	notif9.vertex = true;
			   	bg15.insert(notif9);
			   	var bg21 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 7:12 AM <font color="#dddddd">(2013)</font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg21.geometry.relative = true;
			   	bg21.geometry.offset = new mxPoint(620, 0);
			   	bg21.vertex = true;
			   	bg15.insert(bg21);
			   	var bg22 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg22.geometry.relative = true;
			   	bg22.geometry.offset = new mxPoint(0, 120);
			   	bg22.vertex = true;
			   	bg1.insert(bg22);
			   	var notif10 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif10.geometry.relative = true;
			   	notif10.geometry.offset = new mxPoint(15, -10);
			   	notif10.vertex = true;
			   	bg22.insert(notif10);
			   	var notif11 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif11.geometry.relative = true;
			   	notif11.geometry.offset = new mxPoint(-7, -6);
			   	notif11.vertex = true;
			   	notif10.insert(notif11);
			   	var bg25 = new mxCell('Alexander Robson', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg25.geometry.relative = true;
			   	bg25.geometry.offset = new mxPoint(50, 0);
			   	bg25.vertex = true;
			   	bg22.insert(bg25);
			   	var notif12 = new mxCell('Blocked', new mxGeometry(0, 0.5, 70, 20), s + 'rrect;rSize=3;strokeColor=none;fillColor=#999999;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif12.geometry.relative = true;
			   	notif12.geometry.offset = new mxPoint(250, -10);
			   	notif12.vertex = true;
			   	bg22.insert(notif12);
			   	var bg27 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 4:32 AM <font color="#dddddd">(2013)</font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg27.geometry.relative = true;
			   	bg27.geometry.offset = new mxPoint(620, 0);
			   	bg27.vertex = true;
			   	bg22.insert(bg27);
			   	var bg28 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg28.geometry.relative = true;
			   	bg28.geometry.offset = new mxPoint(0, 160);
			   	bg28.vertex = true;
			   	bg1.insert(bg28);
			   	var notif13 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif13.geometry.relative = true;
			   	notif13.geometry.offset = new mxPoint(15, -10);
			   	notif13.vertex = true;
			   	bg28.insert(notif13);
			   	var notif14 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif14.geometry.relative = true;
			   	notif14.geometry.offset = new mxPoint(-7, -6);
			   	notif14.vertex = true;
			   	notif13.insert(notif14);
			   	var bg31 = new mxCell('Jennifer Pinsker', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg31.geometry.relative = true;
			   	bg31.geometry.offset = new mxPoint(50, 0);
			   	bg31.vertex = true;
			   	bg28.insert(bg31);
			   	var notif15 = new mxCell('Blocked 24h', new mxGeometry(0, 0.5, 90, 20), s + 'rrect;rSize=3;strokeColor=none;fillColor=#999999;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif15.geometry.relative = true;
			   	notif15.geometry.offset = new mxPoint(250, -10);
			   	notif15.vertex = true;
			   	bg28.insert(notif15);
			   	var bg33 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 2:08 AM <font color="#dddddd">(2013)</font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg33.geometry.relative = true;
			   	bg33.geometry.offset = new mxPoint(620, 0);
			   	bg33.vertex = true;
			   	bg28.insert(bg33);
			   	var bg34 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg34.geometry.relative = true;
			   	bg34.geometry.offset = new mxPoint(0, 200);
			   	bg34.vertex = true;
			   	bg1.insert(bg34);
			   	var notif16 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif16.geometry.relative = true;
			   	notif16.geometry.offset = new mxPoint(15, -10);
			   	notif16.vertex = true;
			   	bg34.insert(notif16);
			   	var notif17 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif17.geometry.relative = true;
			   	notif17.geometry.offset = new mxPoint(-7, -6);
			   	notif17.vertex = true;
			   	notif16.insert(notif17);
			   	var bg37 = new mxCell('Bob Robson', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg37.geometry.relative = true;
			   	bg37.geometry.offset = new mxPoint(50, 0);
			   	bg37.vertex = true;
			   	bg34.insert(bg37);
			   	var notif18 = new mxCell('ok', new mxGeometry(0, 0.5, 30, 20), s + 'rrect;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif18.geometry.relative = true;
			   	notif18.geometry.offset = new mxPoint(250, -10);
			   	notif18.vertex = true;
			   	bg34.insert(notif18);
			   	var notif20 = new mxCell('', new mxGeometry(0, 0.5, 150, 14), s + 'rating;strokeColor=none;fillColor=#EFAC43;emptyFillColor=#dddddd;grade=1;ratingScale=5;ratingStyle=star;');
			   	notif20.geometry.relative = true;
			   	notif20.geometry.offset = new mxPoint(450, -7);
			   	notif20.vertex = true;
			   	bg34.insert(notif20);
			   	var bg40 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 8:56 AM <font color="#dddddd">(2013)</font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg40.geometry.relative = true;
			   	bg40.geometry.offset = new mxPoint(620, 0);
			   	bg40.vertex = true;
			   	bg34.insert(bg40);
			   	var bg41 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg41.geometry.relative = true;
			   	bg41.geometry.offset = new mxPoint(0, 240);
			   	bg41.vertex = true;
			   	bg1.insert(bg41);
			   	var notif21 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif21.geometry.relative = true;
			   	notif21.geometry.offset = new mxPoint(15, -10);
			   	notif21.vertex = true;
			   	bg41.insert(notif21);
			   	var notif22 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif22.geometry.relative = true;
			   	notif22.geometry.offset = new mxPoint(-7, -6);
			   	notif22.vertex = true;
			   	notif21.insert(notif22);
			   	var bg44 = new mxCell('Michael Robinson', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg44.geometry.relative = true;
			   	bg44.geometry.offset = new mxPoint(50, 0);
			   	bg44.vertex = true;
			   	bg41.insert(bg44);
			   	var notif23 = new mxCell('Suspect', new mxGeometry(0, 0.5, 70, 20), s + 'rrect;rSize=3;strokeColor=none;fillColor=#55BFE0;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif23.geometry.relative = true;
			   	notif23.geometry.offset = new mxPoint(250, -10);
			   	notif23.vertex = true;
			   	bg41.insert(notif23);
			   	var notif24 = new mxCell('', new mxGeometry(0, 0.5, 150, 14), s + 'rating;strokeColor=none;fillColor=#EFAC43;emptyFillColor=#dddddd;grade=4;ratingScale=5;ratingStyle=star;');
			   	notif24.geometry.relative = true;
			   	notif24.geometry.offset = new mxPoint(450, -7);
			   	notif24.vertex = true;
			   	bg41.insert(notif24);
			   	var bg47 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 7:12 AM <font color="#dddddd">(2013)</font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg47.geometry.relative = true;
			   	bg47.geometry.offset = new mxPoint(620, 0);
			   	bg47.vertex = true;
			   	bg41.insert(bg47);
			   	var bg48 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg48.geometry.relative = true;
			   	bg48.geometry.offset = new mxPoint(0, 280);
			   	bg48.vertex = true;
			   	bg1.insert(bg48);
			   	var notif25 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif25.geometry.relative = true;
			   	notif25.geometry.offset = new mxPoint(15, -10);
			   	notif25.vertex = true;
			   	bg48.insert(notif25);
			   	var notif26 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif26.geometry.relative = true;
			   	notif26.geometry.offset = new mxPoint(-7, -6);
			   	notif26.vertex = true;
			   	notif25.insert(notif26);
			   	var bg51 = new mxCell('Jennifer Pinsker', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg51.geometry.relative = true;
			   	bg51.geometry.offset = new mxPoint(50, 0);
			   	bg51.vertex = true;
			   	bg48.insert(bg51);
			   	var notif27 = new mxCell('ok', new mxGeometry(0, 0.5, 30, 20), s + 'rrect;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif27.geometry.relative = true;
			   	notif27.geometry.offset = new mxPoint(250, -10);
			   	notif27.vertex = true;
			   	bg48.insert(notif27);
			   	var bg53 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 4:34 AM <font color="#dddddd">(2013)</font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg53.geometry.relative = true;
			   	bg53.geometry.offset = new mxPoint(620, 0);
			   	bg53.vertex = true;
			   	bg48.insert(bg53);
			   	var bg54 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg54.geometry.relative = true;
			   	bg54.geometry.offset = new mxPoint(0, 320);
			   	bg54.vertex = true;
			   	bg1.insert(bg54);
			   	var notif28 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif28.geometry.relative = true;
			   	notif28.geometry.offset = new mxPoint(15, -10);
			   	notif28.vertex = true;
			   	bg54.insert(notif28);
			   	var notif29 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif29.geometry.relative = true;
			   	notif29.geometry.offset = new mxPoint(-7, -6);
			   	notif29.vertex = true;
			   	notif28.insert(notif29);
			   	var bg57 = new mxCell('John Boo', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg57.geometry.relative = true;
			   	bg57.geometry.offset = new mxPoint(50, 0);
			   	bg57.vertex = true;
			   	bg54.insert(bg57);
			   	var notif30 = new mxCell('Violation', new mxGeometry(0, 0.5, 70, 20), s + 'rrect;rSize=3;strokeColor=none;fillColor=#DB524C;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	notif30.geometry.relative = true;
			   	notif30.geometry.offset = new mxPoint(250, -10);
			   	notif30.vertex = true;
			   	bg54.insert(notif30);
			   	var notif31 = new mxCell('', new mxGeometry(0, 0.5, 150, 14), s + 'rating;strokeColor=none;fillColor=#EFAC43;emptyFillColor=#dddddd;grade=2;ratingScale=5;ratingStyle=star;');
			   	notif31.geometry.relative = true;
			   	notif31.geometry.offset = new mxPoint(450, -7);
			   	notif31.vertex = true;
			   	bg54.insert(notif31);
			   	var bg60 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 2:08 AM <font color="#dddddd">(2013)</font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg60.geometry.relative = true;
			   	bg60.geometry.offset = new mxPoint(620, 0);
			   	bg60.vertex = true;
			   	bg54.insert(bg60);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Table');
			}),
	
		   	this.addEntry(dt + 'table', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 340), s + 'rect;strokeColor=none;fillColor=#ffffff;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=#fdfdfd;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('Admin Name', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(10, 0);
			   	bg3.vertex = true;
			   	bg2.insert(bg3);
			   	var bg4 = new mxCell('Object', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(200, 0);
			   	bg4.vertex = true;
			   	bg2.insert(bg4);
			   	var bg5 = new mxCell('Action', new mxGeometry(0, 0, 150, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(400, 0);
			   	bg5.vertex = true;
			   	bg2.insert(bg5);
			   	var bg6 = new mxCell('Date', new mxGeometry(0, 0, 100, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(620, 0);
			   	bg6.vertex = true;
			   	bg2.insert(bg6);
			   	var notif1 = new mxCell('', new mxGeometry(0, 0.5, 10, 5), 'shape=triangle;direction=south;strokeColor=none;fillColor=#000000;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(665, -2.5);
			   	notif1.vertex = true;
			   	bg2.insert(notif1);
			   	var bg8 = new mxCell('', new mxGeometry(0, 0, 800, 50), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 40);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var bg9 = new mxCell('Jennifer Pinsker\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(10, 0);
			   	bg9.vertex = true;
			   	bg8.insert(bg9);
			   	var notif2 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(200, -15);
			   	notif2.vertex = true;
			   	bg8.insert(notif2);
			   	var notif3 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif3.geometry.relative = true;
			   	notif3.geometry.offset = new mxPoint(-7, -6);
			   	notif3.vertex = true;
			   	notif2.insert(notif3);
			   	var bg12 = new mxCell('John Boo\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg12.geometry.relative = true;
			   	bg12.geometry.offset = new mxPoint(230, 0);
			   	bg12.vertex = true;
			   	bg8.insert(bg12);
			   	var bg13 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="left" valign="middle" width="50%">Profile Updated<br/><font color="#dddddd">First Name is set to Bobby</font></td></tr></table>',
			   			new mxGeometry(0, 0, 210, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg13.geometry.relative = true;
			   	bg13.geometry.offset = new mxPoint(400, 0);
			   	bg13.vertex = true;
			   	bg8.insert(bg13);
			   	var bg14 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 8:56 AM <font color="#dddddd">(2013)<br><br></font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg14.geometry.relative = true;
			   	bg14.geometry.offset = new mxPoint(620, 0);
			   	bg14.vertex = true;
			   	bg8.insert(bg14);
			   	var bg15 = new mxCell('', new mxGeometry(0, 0, 800, 50), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg15.geometry.relative = true;
			   	bg15.geometry.offset = new mxPoint(0, 90);
			   	bg15.vertex = true;
			   	bg1.insert(bg15);
			   	var bg16 = new mxCell('Bob Robson\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg16.geometry.relative = true;
			   	bg16.geometry.offset = new mxPoint(10, 0);
			   	bg16.vertex = true;
			   	bg15.insert(bg16);
			   	var notif4 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif4.geometry.relative = true;
			   	notif4.geometry.offset = new mxPoint(200, -15);
			   	notif4.vertex = true;
			   	bg15.insert(notif4);
			   	var notif5 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif5.geometry.relative = true;
			   	notif5.geometry.offset = new mxPoint(-7, -6);
			   	notif5.vertex = true;
			   	notif4.insert(notif5);
			   	var bg19 = new mxCell('Michael Robinson\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg19.geometry.relative = true;
			   	bg19.geometry.offset = new mxPoint(230, 0);
			   	bg19.vertex = true;
			   	bg15.insert(bg19);
			   	var bg20 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="left" valign="middle" width="50%">Violation Resolved<br/><font color="#dddddd">Fake Person Violation resolved</font></td></tr></table>',
			   			new mxGeometry(0, 0, 210, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg20.geometry.relative = true;
			   	bg20.geometry.offset = new mxPoint(400, 0);
			   	bg20.vertex = true;
			   	bg15.insert(bg20);
			   	var bg21 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 7:12 AM <font color="#dddddd">(2013)<br><br></font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg21.geometry.relative = true;
			   	bg21.geometry.offset = new mxPoint(620, 0);
			   	bg21.vertex = true;
			   	bg15.insert(bg21);
			   	var bg8 = new mxCell('', new mxGeometry(0, 0, 800, 50), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 140);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var bg9 = new mxCell('Michael Robinson\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(10, 0);
			   	bg9.vertex = true;
			   	bg8.insert(bg9);
			   	var notif6 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif6.geometry.relative = true;
			   	notif6.geometry.offset = new mxPoint(200, -15);
			   	notif6.vertex = true;
			   	bg8.insert(notif6);
			   	var notif7 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif7.geometry.relative = true;
			   	notif7.geometry.offset = new mxPoint(-7, -6);
			   	notif7.vertex = true;
			   	notif6.insert(notif7);
			   	var bg12 = new mxCell('Alexander Robson\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1');
			   	bg12.geometry.relative = true;
			   	bg12.geometry.offset = new mxPoint(230, 0);
			   	bg12.vertex = true;
			   	bg8.insert(bg12);
			   	var bg13 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="left" valign="middle" width="50%">Suspect Resolved<br/><font color="#dddddd">Mass Friending Suspect resolved</font></td></tr></table>',
			   			new mxGeometry(0, 0, 210, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeWidth=1;');
			   	bg13.geometry.relative = true;
			   	bg13.geometry.offset = new mxPoint(400, 0);
			   	bg13.vertex = true;
			   	bg8.insert(bg13);
			   	var bg14 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 4:34 AM <font color="#dddddd">(2013)<br><br></font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg14.geometry.relative = true;
			   	bg14.geometry.offset = new mxPoint(620, 0);
			   	bg14.vertex = true;
			   	bg8.insert(bg14);
			   	var bg8 = new mxCell('', new mxGeometry(0, 0, 800, 50), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 190);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var bg9 = new mxCell('Jennifer Pinsker\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(10, 0);
			   	bg9.vertex = true;
			   	bg8.insert(bg9);
			   	var notif8 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif8.geometry.relative = true;
			   	notif8.geometry.offset = new mxPoint(200, -15);
			   	notif8.vertex = true;
			   	bg8.insert(notif8);
			   	var notif9 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif9.geometry.relative = true;
			   	notif9.geometry.offset = new mxPoint(-7, -6);
			   	notif9.vertex = true;
			   	notif8.insert(notif9);
			   	var bg12 = new mxCell('Jennifer Pinsker\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg12.geometry.relative = true;
			   	bg12.geometry.offset = new mxPoint(230, 0);
			   	bg12.vertex = true;
			   	bg8.insert(bg12);
			   	var bg13 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="left" valign="middle" width="50%">Profile Violation Detected<br/><font color="#dddddd">First Name is marked as Violation</font></td></tr></table>',
			   			new mxGeometry(0, 0, 210, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg13.geometry.relative = true;
			   	bg13.geometry.offset = new mxPoint(400, 0);
			   	bg13.vertex = true;
			   	bg8.insert(bg13);
			   	var bg14 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 2:08 AM <font color="#dddddd">(2013)<br><br></font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg14.geometry.relative = true;
			   	bg14.geometry.offset = new mxPoint(620, 0);
			   	bg14.vertex = true;
			   	bg8.insert(bg14);
			   	var bg8 = new mxCell('', new mxGeometry(0, 0, 800, 50), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 240);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var bg9 = new mxCell('John Boo\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(10, 0);
			   	bg9.vertex = true;
			   	bg8.insert(bg9);
			   	var notif10 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif10.geometry.relative = true;
			   	notif10.geometry.offset = new mxPoint(200, -15);
			   	notif10.vertex = true;
			   	bg8.insert(notif10);
			   	var notif11 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif11.geometry.relative = true;
			   	notif11.geometry.offset = new mxPoint(-7, -6);
			   	notif11.vertex = true;
			   	notif10.insert(notif11);
			   	var bg12 = new mxCell('Bob Robson\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg12.geometry.relative = true;
			   	bg12.geometry.offset = new mxPoint(230, 0);
			   	bg12.vertex = true;
			   	bg8.insert(bg12);
			   	var bg13 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="left" valign="middle" width="50%">Profile Updated<br/><font color="#dddddd">First Name is set to Bobby</font></td></tr></table>',
			   			new mxGeometry(0, 0, 210, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg13.geometry.relative = true;
			   	bg13.geometry.offset = new mxPoint(400, 0);
			   	bg13.vertex = true;
			   	bg8.insert(bg13);
			   	var bg14 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 8:56 AM <font color="#dddddd">(2013)<br><br></font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg14.geometry.relative = true;
			   	bg14.geometry.offset = new mxPoint(620, 0);
			   	bg14.vertex = true;
			   	bg8.insert(bg14);
			   	var bg8 = new mxCell('', new mxGeometry(0, 0, 800, 50), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 290);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var bg9 = new mxCell('Michael Robinson\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(10, 0);
			   	bg9.vertex = true;
			   	bg8.insert(bg9);
			   	var notif12 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=ellipse;strokeColor=none;fillColor=#dddddd;html=1;');
			   	notif12.geometry.relative = true;
			   	notif12.geometry.offset = new mxPoint(200, -15);
			   	notif12.vertex = true;
			   	bg8.insert(notif12);
			   	var notif13 = new mxCell('', new mxGeometry(0.5, 0.5, 14, 12), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif13.geometry.relative = true;
			   	notif13.geometry.offset = new mxPoint(-7, -6);
			   	notif13.vertex = true;
			   	notif12.insert(notif13);
			   	var bg12 = new mxCell('Michael Robinson\n', new mxGeometry(0, 0, 150, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;whiteSpace=wrap;resizeHeight=1;');
			   	bg12.geometry.relative = true;
			   	bg12.geometry.offset = new mxPoint(230, 0);
			   	bg12.vertex = true;
			   	bg8.insert(bg12);
			   	var bg13 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="left" valign="middle" width="50%">User Blocked<br/><font color="#dddddd">Blocked for 24 hours</font></td></tr></table>',
			   			new mxGeometry(0, 0, 210, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg13.geometry.relative = true;
			   	bg13.geometry.offset = new mxPoint(400, 0);
			   	bg13.vertex = true;
			   	bg8.insert(bg13);
			   	var bg14 = new mxCell(
						'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">15 Sep, 7:12 AM <font color="#dddddd">(2013)<br><br></font></td></tr></table>',
			   			new mxGeometry(0, 0, 160, 50), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;align=left;overflow=fill;whiteSpace=wrap;resizeHeight=1;');
			   	bg14.geometry.relative = true;
			   	bg14.geometry.offset = new mxPoint(620, 0);
			   	bg14.vertex = true;
			   	bg8.insert(bg14);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Table');
			}),
	
		   	this.addEntry(dt + 'table', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 430), s + 'rect;strokeColor=none;fillColor=#ffffff;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 800, 40), s + 'horLines;strokeColor=#dddddd;fillColor=#fdfdfd;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('Template Name', new mxGeometry(0, 0, 200, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeHeight=1;');
			   	bg3.geometry.relative = true;
			   	bg3.vertex = true;
			   	bg2.insert(bg3);
			   	var bg4 = new mxCell('Message', new mxGeometry(0, 0, 200, 40), s + 'rect;strokeColor=none;fillColor=none;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;resizeHeight=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(200, 0);
			   	bg4.vertex = true;
			   	bg2.insert(bg4);
			   	var bg5 = new mxCell('', new mxGeometry(0, 0, 800, 130), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 40);
			   	bg5.vertex = true;
			   	bg1.insert(bg5);
			   	var bg6 = new mxCell('Uncompleted Profile', new mxGeometry(0, 0, 200, 40), s + 'rect;strokeColor=none;fillColor=none;align=left;spacingLeft=10;whiteSpace=wrap;');
			   	bg6.geometry.relative = true;
			   	bg6.vertex = true;
			   	bg5.insert(bg6);
			   	var bg7 = new mxCell(
			   			'Hello! At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium deleniti atque corrupti quos dolores' + 
			   			'et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est' + 
			   			'laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Name libero tempore, cum soluta nobis est eligendi' + 
			   			'optio cumque nihil impedit quo.', 
			   			new mxGeometry(0, 0, 400, 130), s + 'rect;strokeColor=none;fillColor=none;align=left;valign=top;spacingLeft=10;verticalAlign=top;spacingTop=6;whiteSpace=wrap;resizeWidth=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(200, 0);
			   	bg7.vertex = true;
			   	bg5.insert(bg7);
			   	var notif1 = new mxCell('Edit', new mxGeometry(1, 0, 50, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;whiteSpace=wrap;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(-140, 15);
			   	notif1.vertex = true;
			   	bg5.insert(notif1);
			   	var notif2 = new mxCell('Delete', new mxGeometry(1, 0, 60, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;whiteSpace=wrap;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(-80, 15);
			   	notif2.vertex = true;
			   	bg5.insert(notif2);
			   	var bg8 = new mxCell('', new mxGeometry(0, 0, 800, 100), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(0, 170);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var bg9 = new mxCell('Spam Suspect', new mxGeometry(0, 0, 200, 40), s + 'rect;strokeColor=none;fillColor=none;align=left;spacingLeft=10;whiteSpace=wrap;');
			   	bg9.geometry.relative = true;
			   	bg9.vertex = true;
			   	bg8.insert(bg9);
			   	var bg10 = new mxCell(
			   			'Hello, deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui' + 
			   			'officia deserunt mollitia animi, id est fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam nobis est eligendi optio cumque' + 
			   			'nihil impedit quo minus id quod maxime placeat.', 
			   			new mxGeometry(0, 0, 400, 100), s + 'rect;strokeColor=none;fillColor=none;align=left;valign=top;spacingLeft=10;verticalAlign=top;spacingTop=6;whiteSpace=wrap;resizeWidth=1;');
			   	bg10.geometry.relative = true;
			   	bg10.geometry.offset = new mxPoint(200, 0);
			   	bg10.vertex = true;
			   	bg8.insert(bg10);
			   	var notif3 = new mxCell('Edit', new mxGeometry(1, 0, 50, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;whiteSpace=wrap;');
			   	notif3.geometry.relative = true;
			   	notif3.geometry.offset = new mxPoint(-140, 15);
			   	notif3.vertex = true;
			   	bg8.insert(notif3);
			   	var notif4 = new mxCell('Delete', new mxGeometry(1, 0, 60, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;whiteSpace=wrap;');
			   	notif4.geometry.relative = true;
			   	notif4.geometry.offset = new mxPoint(-80, 15);
			   	notif4.vertex = true;
			   	bg8.insert(notif4);
			   	
			   	var bg11 = new mxCell('', new mxGeometry(0, 0, 800, 160), s + 'horLines;strokeColor=#dddddd;fillColor=none;resizeWidth=1;');
			   	bg11.geometry.relative = true;
			   	bg11.geometry.offset = new mxPoint(0, 270);
			   	bg11.vertex = true;
			   	bg1.insert(bg11);
			   	var bg12 = new mxCell('Profile Blocked', new mxGeometry(0, 0, 200, 40), s + 'rect;strokeColor=none;fillColor=none;align=left;spacingLeft=10;whiteSpace=wrap;');
			   	bg12.vertex = true;
			   	bg11.insert(bg12);
			   	var bg13 = new mxCell(
			   			'Hello! Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa' + 
			   			'quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit' + 
			   			'aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,' + 
			   			'qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore' + 
			   			'magnam aliquam quaerat voluptarem.', 
			   			new mxGeometry(0, 0, 400, 160), s + 'rect;strokeColor=none;fillColor=none;align=left;valign=top;spacingLeft=10;verticalAlign=top;spacingTop=6;whiteSpace=wrap;resizeWidth=1;');
			   	bg13.geometry.relative = true;
			   	bg13.geometry.offset = new mxPoint(200, 0);
			   	bg13.vertex = true;
			   	bg11.insert(bg13);
			   	var notif1 = new mxCell('Edit', new mxGeometry(1, 0, 50, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;whiteSpace=wrap;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(-140, 15);
			   	notif1.vertex = true;
			   	bg11.insert(notif1);
			   	var notif2 = new mxCell('Delete', new mxGeometry(1, 0, 60, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;whiteSpace=wrap;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(-80, 15);
			   	notif2.vertex = true;
			   	bg11.insert(notif2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Table');
			}),
	
		   	this.addEntry(dt + 'table', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 80), s + 'horLines;strokeColor=#dddddd;fillColor=#fdfdfd;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Group Name', new mxGeometry(20, 20, 500, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=left;spacingLeft=10;fontSize=18;fontColor=#999999;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('Create Templates Group', new mxGeometry(540, 20, 240, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#3D8BCD;fontSize=18;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Table');
			}),
	
		   	this.addEntry(dt + 'edit template', function()
		   	{
			   	var bg1 = new mxCell('Template name', new mxGeometry(0, 0, 200, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Uncompleted Profile', new mxGeometry(0, 20, 800, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;;fillColor=#ffffff;align=left;spacingLeft=10;fontSize=16;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	var bg3 = new mxCell('Subject', new mxGeometry(0, 80, 200, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	var bg4 = new mxCell('Hello, %USER_FULL_NAME%', new mxGeometry(0, 100, 800, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;;fillColor=#ffffff;align=left;spacingLeft=10;fontSize=16;whiteSpace=wrap;');
			   	bg4.vertex = true;
			   	var bg5 = new mxCell('Insert System Variable', new mxGeometry(650, 80, 120, 20), s + 'rect;strokeColor=none;fillColor=none;align=right;fontSize=10;whiteSpace=wrap;');
			   	bg5.vertex = true;
			   	var bg6 = new mxCell('', new mxGeometry(772, 87, 8, 4), 'shape=triangle;strokeColor=none;fillColor=#000000;direction=south;');
			   	bg6.vertex = true;
			   	var bg7 = new mxCell('Message', new mxGeometry(0, 160, 200, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg7.vertex = true;
			   	var bg8 = new mxCell(
			   			'Hello %USER_FULL_NAME%!\n\n' + 
			   			'At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos' + 
			   			'dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia' +
			   			'animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta' +
			   			'nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda' +
			   			'est, omnis dolor repellendus.',
			   			new mxGeometry(0, 180, 800, 240), s + 'rrect;rSize=5;fontSize=12;strokeColor=#dddddd;;fillColor=#ffffff;align=left;spacing=10;verticalAlign=top;whiteSpace=wrap;');
			   	bg8.vertex = true;
			   	var bg9 = new mxCell('Insert System Variable', new mxGeometry(650, 160, 120, 20), s + 'rect;strokeColor=none;fillColor=none;align=right;fontSize=10;whiteSpace=wrap;');
			   	bg9.vertex = true;
			   	var bg10 = new mxCell('', new mxGeometry(772, 167, 8, 4), 'shape=triangle;strokeColor=none;fillColor=#000000;direction=south;');
			   	bg10.vertex = true;
			   	var bg11 = new mxCell(
			   			'%USER_FULL_NAME%\n' +
			   			'%USER_EMAIL%\n' +
			   			'%USER_PROFILE_COMPLETENESS%\n' +
			   			'%USER_NUM_SUCCESS_TRADES%\n' +
			   			'%USER_FULL_NAME%\n' +
			   			'%USER_EMAIL%\n' +
			   			'%USER_PROFILE_COMPLETENESS%\n' +
			   			'%USER_NUM_SUCCESS_SELLS%',
			   			new mxGeometry(550, 175, 240, 140), s + 'rrect;fontSize=12;rSize=2;strokeColor=#dddddd;fillColor=#ffffff;align=left;verticalAlign=top;spacing=10;shadow=1;whiteSpace=wrap;');
			   	bg11.vertex = true;
			   	var bg12 = new mxCell('Message Type', new mxGeometry(0, 440, 200, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg12.vertex = true;
			   	var bg13 = new mxCell('Email + Push', new mxGeometry(0, 460, 390, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;;fillColor=#ffffff;align=left;spacingLeft=10;fontSize=16;whiteSpace=wrap;');
			   	bg13.vertex = true;
			   	var bg14 = new mxCell('', new mxGeometry(370, 477, 10, 5), 'shape=triangle;strokeColor=none;fillColor=#000000;direction=south;');
			   	bg14.vertex = true;
			   	var bg15 = new mxCell('Tap target', new mxGeometry(410, 440, 200, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg15.vertex = true;
			   	var bg16 = new mxCell('Profile Screen', new mxGeometry(410, 460, 390, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;;fillColor=#ffffff;align=left;spacingLeft=10;fontSize=16;whiteSpace=wrap;');
			   	bg16.vertex = true;
			   	var bg17 = new mxCell('', new mxGeometry(780, 477, 10, 5), 'shape=triangle;strokeColor=none;fillColor=#000000;direction=south;');
			   	bg17.vertex = true;
			   	var bg18 = new mxCell('Send to Group', new mxGeometry(0, 520, 200, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg18.vertex = true;
			   	var bg19 = new mxCell('Top Management', new mxGeometry(10, 543, 14, 14), s + 'checkbox;fontSize=12;strokeColor=#999999;fillColor=#ffffff;align=left;labelPosition=right;spacingLeft=5;');
			   	bg19.vertex = true;
			   	var bg20 = new mxCell('Marketing Department', new mxGeometry(10, 563, 14, 14), s + 'rrect;fontSize=12;rSize=3;strokeColor=#999999;fillColor=#ffffff;align=left;labelPosition=right;spacingLeft=5;');
			   	bg20.vertex = true;
			   	var bg21 = new mxCell('Design Department', new mxGeometry(10, 583, 14, 14), s + 'checkbox;fontSize=12;strokeColor=#999999;fillColor=#ffffff;align=left;labelPosition=right;spacingLeft=5;');
			   	bg21.vertex = true;
			   	var bg22 = new mxCell('Financial Department', new mxGeometry(10, 603, 14, 14), s + 'rrect;fontSize=12;rSize=3;strokeColor=#999999;fillColor=#ffffff;align=left;labelPosition=right;spacingLeft=5;');
			   	bg22.vertex = true;
			   	var bg23 = new mxCell('Supply Department', new mxGeometry(10, 623, 14, 14), s + 'rrect;fontSize=12;rSize=3;strokeColor=#999999;fillColor=#ffffff;align=left;labelPosition=right;spacingLeft=5;');
			   	bg23.vertex = true;
			   	var bg24 = new mxCell('Set Type', new mxGeometry(410, 520, 200, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg24.vertex = true;
			   	var bg25 = new mxCell('', new mxGeometry(420, 543, 14, 14), 'shape=ellipse;dashed=0;strokeColor=#999999;fillColor=#ffffff;html=1;');
			   	bg25.vertex = true;
			   	var bg26 = new mxCell('News', new mxGeometry(440, 543, 40, 14), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#58B957;fontColor=#ffffff;fontStyle=1;fontSize=10;whiteSpace=wrap;');
			   	bg26.vertex = true;
			   	var bg27 = new mxCell('', new mxGeometry(420, 563, 14, 14), s + 'radioButton;strokeColor=#999999;fillColor=#ffffff;');
			   	bg27.vertex = true;
			   	var bg28 = new mxCell('Reports', new mxGeometry(440, 563, 50, 14), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#55BFE0;fontColor=#ffffff;fontStyle=1;fontSize=10;whiteSpace=wrap;');
			   	bg28.vertex = true;
			   	var bg29 = new mxCell('', new mxGeometry(420, 583, 14, 14), 'shape=ellipse;dashed=0;strokeColor=#999999;fillColor=#ffffff;html=1;');
			   	bg29.vertex = true;
			   	var bg30 = new mxCell('Documents', new mxGeometry(440, 583, 70, 14), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#EFAC43;fontColor=#ffffff;fontStyle=1;fontSize=10;whiteSpace=wrap;');
			   	bg30.vertex = true;
			   	var bg31 = new mxCell('', new mxGeometry(420, 603, 14, 14), 'shape=ellipse;dashed=0;strokeColor=#999999;fillColor=#ffffff;html=1;');
			   	bg31.vertex = true;
			   	var bg32 = new mxCell('Media', new mxGeometry(440, 603, 40, 14), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#3D8BCD;fontColor=#ffffff;fontStyle=1;fontSize=10;whiteSpace=wrap;');
			   	bg32.vertex = true;
			   	var bg33 = new mxCell('', new mxGeometry(420, 623, 14, 14), 'shape=ellipse;dashed=0;strokeColor=#999999;fillColor=#ffffff;html=1;');
			   	bg33.vertex = true;
			   	var bg34 = new mxCell('Text', new mxGeometry(440, 623, 30, 14), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#999999;fontColor=#ffffff;fontStyle=1;fontSize=10;whiteSpace=wrap;');
			   	bg34.vertex = true;
			   	var bg35 = new mxCell('Save Template', new mxGeometry(0, 680, 150, 40), s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#3D8BCD;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;');
			   	bg35.vertex = true;
			   	var bg36 = new mxCell('Cancel', new mxGeometry(170, 680, 100, 40), s + 'rrect;fillColor=#ffffff;align=center;rSize=5;strokeColor=#dddddd;fontSize=16;whiteSpace=wrap;');
			   	bg36.vertex = true;
			   	var bg37 = new mxCell('Delete Template', new mxGeometry(630, 680, 170, 40), s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#DB524C;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;');
			   	bg37.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15, bg16, bg17, bg18, bg19, bg20, bg21, bg22, bg23, bg24, bg25, bg26, bg27, bg28, bg29, bg30, bg31, bg32, bg33, bg34, bg35, bg36, bg37], 800, 720, 'Edit Template');
			}),
	
		   	this.addEntry(dt + 'business contact', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 50), s + 'horLines;strokeColor=#dddddd;fillColor=#fdfdfd;');
			   	bg1.vertex = true;
			   	var notif1 = new mxCell('2 fields selected', new mxGeometry(0, 0.5, 14, 14), s + 'checkbox;strokeColor=#dddddd;fillColor=none;align=left;labelPosition=right;spacingLeft=10;fontStyle=1;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(13, -7);
			   	notif1.vertex = true;
			   	bg1.insert(notif1);
			   	var bg3 = new mxCell('Mark as OK', new mxGeometry(0, 0.5, 90, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;;fillColor=#ffffff;whiteSpace=wrap;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(150, -15);
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			   	var bg4 = new mxCell('Mark as Violation', new mxGeometry(0, 0.5, 120, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;;fillColor=#ffffff;whiteSpace=wrap;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(250, -15);
			   	bg4.vertex = true;
			   	bg1.insert(bg4);
			   	var bg5 = new mxCell('Mark all as OK', new mxGeometry(1, 0.5, 100, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;;fillColor=#ffffff;whiteSpace=wrap;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(-110, -15);
			   	bg5.vertex = true;
			   	bg1.insert(bg5);
			   	var bg6 = new mxCell('Phone', new mxGeometry(40, 70, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg6.vertex = true;
			   	var bg7 = new mxCell('', new mxGeometry(13, 103, 14, 14), s + 'checkbox;strokeColor=#999999;fillColor=#ffffff;');
			   	bg7.vertex = true;
			   	var bg8 = new mxCell('+38 (066) 875 67 97', new mxGeometry(40, 90, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg8.vertex = true;
			   	var bg9 = new mxCell('ok', new mxGeometry(700, 100, 30, 20), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg9.vertex = true;
			   	var bg10 = new mxCell('Business email', new mxGeometry(40, 140, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg10.vertex = true;
			   	var bg11 = new mxCell('', new mxGeometry(13, 173, 14, 14), s + 'checkbox;strokeColor=#999999;fillColor=#ffffff;');
			   	bg11.vertex = true;
			   	var bg12 = new mxCell('seo@apple.com', new mxGeometry(40, 160, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#FDF8E4;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg12.vertex = true;
			   	var bg13 = new mxCell('To Moderate', new mxGeometry(700, 170, 90, 20), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#EFAC43;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg13.vertex = true;
			   	var bg14 = new mxCell('Skype', new mxGeometry(40, 210, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg14.vertex = true;
			   	var bg15 = new mxCell('', new mxGeometry(13, 243, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;');
			   	bg15.vertex = true;
			   	var bg16 = new mxCell('alex.robby', new mxGeometry(40, 230, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg16.vertex = true;
			   	var bg17 = new mxCell('ok', new mxGeometry(700, 240, 30, 20), s + 'rrect;rSize=3;align=center;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg17.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15, bg16, bg17], 800, 270, 'Business Contacts');
			}),

			this.addEntry(dt + 'experience', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 50), s + 'horLines;strokeColor=#dddddd;fillColor=#fdfdfd;');
			   	bg1.vertex = true;
			   	var notif1 = new mxCell('Select fields to update status', new mxGeometry(0, 0.5, 14, 14), s + 'rrect;rSize=3;strokeColor=#dddddd;fillColor=#ffffff;align=left;labelPosition=right;spacingLeft=10;fontStyle=1;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(13, -7);
			   	notif1.vertex = true;
			   	bg1.insert(notif1);
			   	var bg3 = new mxCell('Position', new mxGeometry(40, 70, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	var bg4 = new mxCell('', new mxGeometry(13, 103, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;');
			   	bg4.vertex = true;
			   	var bg5 = new mxCell('Senior Engineer', new mxGeometry(40, 90, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg5.vertex = true;
			   	var bg6 = new mxCell('ok', new mxGeometry(700, 100, 30, 20), s + 'rrect;rSize=3;align=center;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg6.vertex = true;
			   	var bg7 = new mxCell('Company', new mxGeometry(40, 140, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg7.vertex = true;
			   	var bg8 = new mxCell('', new mxGeometry(13, 173, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;whiteSpace=wrap;');
			   	bg8.vertex = true;
			   	var bg9 = new mxCell('Tesla Motors', new mxGeometry(40, 160, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg9.vertex = true;
			   	var bg10 = new mxCell('ok', new mxGeometry(700, 170, 30, 20), s + 'rrect;rSize=3;align=center;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg10.vertex = true;
			   	var bg11 = new mxCell('Working from', new mxGeometry(40, 210, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg11.vertex = true;
			   	var bg12 = new mxCell('', new mxGeometry(13, 243, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;');
			   	bg12.vertex = true;
			   	var bg13 = new mxCell('October', new mxGeometry(40, 230, 130, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg13.vertex = true;
			   	var bg14 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;whiteSpace=wrap;');
			   	bg14.geometry.relative = true;
			   	bg14.geometry.offset = new mxPoint(-30, -3);
			   	bg14.vertex = true;
			   	bg13.insert(bg14);
			   	var bg15 = new mxCell('2011', new mxGeometry(190, 230, 130, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg15.vertex = true;
			   	var bg16 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;whiteSpace=wrap;');
			   	bg16.geometry.relative = true;
			   	bg16.geometry.offset = new mxPoint(-30, -3);
			   	bg16.vertex = true;
			   	bg15.insert(bg16);
			   	var bg17 = new mxCell('Working to', new mxGeometry(400, 210, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#999999;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg17.vertex = true;
			   	var bg18 = new mxCell('Current time', new mxGeometry(580, 210, 100, 20), s + 'rect;strokeColor=none;fillColor=none;align=right;spacingRight=5;fontColor=#55C0E0;whiteSpace=wrap;');
			   	bg18.vertex = true;
			   	var bg19 = new mxCell('', new mxGeometry(340, 240, 40, 20), 'shape=line;strokeWidth=2;shadow=0;dashed=0;');
			   	bg19.vertex = true;
			   	var bg20 = new mxCell('December', new mxGeometry(400, 230, 130, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg20.vertex = true;
			   	var bg21 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	bg21.geometry.relative = true;
			   	bg21.geometry.offset = new mxPoint(-30, -3);
			   	bg21.vertex = true;
			   	bg20.insert(bg21);
			   	var bg22 = new mxCell('2012', new mxGeometry(550, 230, 130, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg22.vertex = true;
			   	var bg23 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	bg23.geometry.relative = true;
			   	bg23.geometry.offset = new mxPoint(-30, -3);
			   	bg23.vertex = true;
			   	bg22.insert(bg23);
			   	var bg24 = new mxCell('ok', new mxGeometry(700, 240, 30, 20), s + 'rrect;rSize=3;align=center;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg24.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg15, bg17, bg18, bg19, bg20, bg22, bg24], 800, 270, 'Experience');
			}),
	
		   	this.addEntry(dt + 'skills', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 50), s + 'horLines;strokeColor=#dddddd;fillColor=#fdfdfd;');
			   	bg1.vertex = true;
			   	var notif1 = new mxCell('Select fields to update status', new mxGeometry(0, 0.5, 14, 14), s + 'rrect;rSize=3;strokeColor=#dddddd;fillColor=#ffffff;align=left;labelPosition=right;spacingLeft=10;fontStyle=1;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(13, -7);
			   	notif1.vertex = true;
			   	bg1.insert(notif1);
			   	var bg3 = new mxCell('Mark all as OK', new mxGeometry(1, 0.5, 100, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#fdfdfd;whiteSpace=wrap;');
			   	bg3.geometry.relative = true;
			   	bg3.geometry.offset = new mxPoint(-120, -15);
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			   	var bg4 = new mxCell('', new mxGeometry(13, 103, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;');
			   	bg4.vertex = true;
			   	var bg5 = new mxCell('Engineering', new mxGeometry(40, 90, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg5.vertex = true;
			   	var bg6 = new mxCell('ok', new mxGeometry(700, 100, 30, 20), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg6.vertex = true;
			   	var bg7 = new mxCell('', new mxGeometry(13, 173, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;');
			   	bg7.vertex = true;
			   	var bg8 = new mxCell('Thinking', new mxGeometry(40, 160, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#FDF8E4;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg8.vertex = true;
			   	var bg9 = new mxCell('To Moderate', new mxGeometry(700, 170, 90, 20), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#EFAC43;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg9.vertex = true;
			   	var bg10 = new mxCell('', new mxGeometry(13, 243, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;');
			   	bg10.vertex = true;
			   	var bg11 = new mxCell('Working', new mxGeometry(40, 230, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg11.vertex = true;
			   	var bg12 = new mxCell('ok', new mxGeometry(700, 240, 30, 20), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg12.vertex = true;
			   	var bg13 = new mxCell('', new mxGeometry(13, 313, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;');
			   	bg13.vertex = true;
			   	var bg14 = new mxCell('Sleeping', new mxGeometry(40, 300, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg14.vertex = true;
			   	var bg15 = new mxCell('ok', new mxGeometry(700, 310, 30, 20), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg15.vertex = true;
			   	var bg16 = new mxCell('', new mxGeometry(13, 383, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;');
			   	bg16.vertex = true;
			   	var bg17 = new mxCell('Eating', new mxGeometry(40, 370, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg17.vertex = true;
			   	var bg18 = new mxCell('ok', new mxGeometry(700, 380, 30, 20), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg18.vertex = true;
			   	var bg19 = new mxCell('', new mxGeometry(13, 453, 14, 14), s + 'rrect;rSize=3;strokeColor=#999999;fillColor=#ffffff;');
			   	bg19.vertex = true;
			   	var bg20 = new mxCell('Walking', new mxGeometry(40, 440, 640, 40), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;align=left;fontSize=16;spacingLeft=10;whiteSpace=wrap;');
			   	bg20.vertex = true;
			   	var bg21 = new mxCell('ok', new mxGeometry(700, 450, 30, 20), s + 'rrect;align=center;rSize=3;strokeColor=none;fillColor=#58B957;fontSize=12;fontStyle=1;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg21.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14, bg15, bg16, bg17, bg18, bg19, bg20, bg21], 800, 480, 'Skills');
			}),
	
		   	this.addEntry(dt + 'chat', function()
		   	{
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 400, 660), s + 'rect;strokeColor=#333333;fillColor=#ffffff;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 400, 50), s + 'rect;strokeColor=#333333;fillColor=#333333;whiteSpace=wrap;resizeWidth=1;');
			   	bg1.geometry.relative = true;
			   	bg1.vertex = true;
			   	bg2.insert(bg1);
			   	var notif1 = new mxCell('John Boo', new mxGeometry(0, 0.5, 30, 30), 'shape=ellipse;strokeColor=none;fillColor=#f0f0f0;labelPosition=right;align=left;spacingLeft=10;fontColor=#f0f0f0;html=1;');
			   	notif1.geometry.relative = true;
			   	notif1.geometry.offset = new mxPoint(15, -15);
			   	notif1.vertex = true;
			   	bg1.insert(notif1);
			   	var notif2 = new mxCell('', new mxGeometry(0.5, 0.5, 20, 20), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif2.geometry.relative = true;
			   	notif2.geometry.offset = new mxPoint(-10, -10);
			   	notif2.vertex = true;
			   	notif1.insert(notif2);
			   	var notif3 = new mxCell('Michael Robinson', new mxGeometry(1, 0.5, 30, 30), 'shape=ellipse;strokeColor=none;fillColor=#f0f0f0;labelPosition=left;align=right;spacingRight=10;fontColor=#f0f0f0;html=1;');
			   	notif3.geometry.relative = true;
			   	notif3.geometry.offset = new mxPoint(-45, -15);
			   	notif3.vertex = true;
			   	bg1.insert(notif3);
			   	var notif4 = new mxCell('', new mxGeometry(0.5, 0.5, 20, 20), s + 'user;strokeColor=none;fillColor=#999999;');
			   	notif4.geometry.relative = true;
			   	notif4.geometry.offset = new mxPoint(-10, -10);
			   	notif4.vertex = true;
			   	notif3.insert(notif4);
			   	var bg7 = new mxCell('15 September 2013', new mxGeometry(0, 0, 400, 30), s + 'rrect;rSize=5;strokeColor=none;fillColor=#fdfdfd;fontColor=#999999;whiteSpace=wrap;resizeWidth=1;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(0, 75);
			   	bg7.vertex = true;
			   	bg2.insert(bg7);
			   	var bg8 = new mxCell('Hi man!', new mxGeometry(0, 0, 80, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#E0F0D6;align=left;spacingLeft=15;whiteSpace=wrap;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(20, 135);
			   	bg8.vertex = true;
			   	bg2.insert(bg8);
			   	var bg9 = new mxCell('8:56:14 AM', new mxGeometry(0, 0, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#dddddd;fontSize=10;align=left;whiteSpace=wrap;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(20, 175);
			   	bg9.vertex = true;
			   	bg2.insert(bg9);
			   	var bg10 = new mxCell('Hello there...', new mxGeometry(1, 0, 100, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#D9EDF8;align=right;spacingRight=15;whiteSpace=wrap;');
			   	bg10.geometry.relative = true;
			   	bg10.geometry.offset = new mxPoint(-120, 195);
			   	bg10.vertex = true;
			   	bg2.insert(bg10);
			   	var bg11 = new mxCell('8:56:14 AM', new mxGeometry(1, 0, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#dddddd;fontSize=10;align=right;whiteSpace=wrap;');
			   	bg11.geometry.relative = true;
			   	bg11.geometry.offset = new mxPoint(-120, 235);
			   	bg11.vertex = true;
			   	bg2.insert(bg11);
			   	var bg12 = new mxCell('Duis aute inure dolor in reprehenderit in voluptate velit esse cilium dolore eu fugiat nulla pariatur.', new mxGeometry(0, 0, 240, 80), 
			   			s + 'rrect;rSize=5;strokeColor=none;fillColor=#E0F0D6;align=left;spacing=15;whiteSpace=wrap;');
			   	bg12.geometry.relative = true;
			   	bg12.geometry.offset = new mxPoint(20, 255);
			   	bg12.vertex = true;
			   	bg2.insert(bg12);
			   	var bg13 = new mxCell('8:56:14 AM', new mxGeometry(0, 0, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#dddddd;fontSize=10;align=left;whiteSpace=wrap;');
			   	bg13.geometry.relative = true;
			   	bg13.geometry.offset = new mxPoint(20, 335);
			   	bg13.vertex = true;
			   	bg2.insert(bg13);
			   	var bg14 = new mxCell('Really?! Can\'t believe that, man!', new mxGeometry(1, 0, 200, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#D9EDF8;align=right;spacing=15;whiteSpace=wrap;');
			   	bg14.geometry.relative = true;
			   	bg14.geometry.offset = new mxPoint(-220, 355);
			   	bg14.vertex = true;
			   	bg2.insert(bg14);
			   	var bg15 = new mxCell('8:56:14 AM', new mxGeometry(1, 0, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#dddddd;fontSize=10;align=right;whiteSpace=wrap;');
			   	bg15.geometry.relative = true;
			   	bg15.geometry.offset = new mxPoint(-120, 395);
			   	bg15.vertex = true;
			   	bg2.insert(bg15);
			   	var bg16 = new mxCell(
			   			'And even nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas' + 
			   			'assumenda est, omnis dolor!', 
			   			new mxGeometry(0, 0, 240, 100), s + 'rrect;rSize=5;strokeColor=none;fillColor=#E0F0D6;align=left;spacing=15;whiteSpace=wrap;');
			   	bg16.geometry.relative = true;
			   	bg16.geometry.offset = new mxPoint(20, 415);
			   	bg16.vertex = true;
			   	bg2.insert(bg16);
			   	var bg17 = new mxCell('8:56:14 AM', new mxGeometry(0, 0, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#dddddd;fontSize=10;align=left;whiteSpace=wrap;');
			   	bg17.geometry.relative = true;
			   	bg17.geometry.offset = new mxPoint(20, 515);
			   	bg17.vertex = true;
			   	bg2.insert(bg17);
			   	var bg18 = new mxCell('Ok. Deal!', new mxGeometry(1, 0, 80, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#D9EDF8;align=right;spacing=15;whiteSpace=wrap;');
			   	bg18.geometry.relative = true;
			   	bg18.geometry.offset = new mxPoint(-100, 535);
			   	bg18.vertex = true;
			   	bg2.insert(bg18);
			   	var bg19 = new mxCell('8:56:14 AM', new mxGeometry(1, 0, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#dddddd;fontSize=10;align=right;whiteSpace=wrap;');
			   	bg19.geometry.relative = true;
			   	bg19.geometry.offset = new mxPoint(-120, 575);
			   	bg19.vertex = true;
			   	bg2.insert(bg19);
			   	var bg20 = new mxCell('Huh..', new mxGeometry(0, 0, 60, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#E0F0D6;align=left;spacing=15;whiteSpace=wrap;whiteSpace=wrap;');
			   	bg20.geometry.relative = true;
			   	bg20.geometry.offset = new mxPoint(20, 595);
			   	bg20.vertex = true;
			   	bg2.insert(bg20);
			   	var bg21 = new mxCell('8:56:14 AM', new mxGeometry(0, 0, 100, 20), s + 'rect;strokeColor=none;fillColor=none;fontColor=#dddddd;fontSize=10;align=left;whiteSpace=wrap;');
			   	bg21.geometry.relative = true;
			   	bg21.geometry.offset = new mxPoint(20, 635);
			   	bg21.vertex = true;
			   	bg2.insert(bg21);
			    
			   	return sb.createVertexTemplateFromCells([bg2], 400, 660, 'Chat');
			}),
			   	
		   	this.addEntry(dt + 'log in', function()
		   	{
			   	var bg1 = new mxCell('Control Panel', new mxGeometry(0, 0, 240, 220), s + 'rrect;fillColor=#ffffff;align=center;rSize=5;strokeColor=#000000;verticalAlign=top;spacingTop=20;fontSize=14;fontStyle=1;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Email', new mxGeometry(0, 0, 190, 30), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;fontSize=14;fontColor=#dddddd;align=left;spacingLeft=40;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(30, 60);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('', new mxGeometry(0, 0, 30, 30), s + 'leftButton;rSize=5;strokeColor=#999999;fillColor=#fdfdfd;resizeHeight=1;');
			   	bg3.geometry.relative = true;
			   	bg3.vertex = true;
			   	bg2.insert(bg3);
			   	var bg4 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 12), s + 'mail;strokeColor=#fdfdfd;fillColor=#999999;strokeWidth=1.3;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(-8, -6);
			   	bg4.vertex = true;
			   	bg3.insert(bg4);
			   	var bg4 = new mxCell('Password', new mxGeometry(0, 0, 190, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#999999;fontSize=14;fontColor=#dddddd;align=left;spacingLeft=40;whiteSpace=wrap;resizeWidth=1;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(30, 100);
			   	bg4.vertex = true;
			   	bg1.insert(bg4);
			   	var bg5 = new mxCell('', new mxGeometry(0, 0, 30, 30), s + 'leftButton;rSize=5;strokeColor=#999999;fillColor=#fdfdfd;resizeHeight=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(0, 0);
			   	bg5.vertex = true;
			   	bg4.insert(bg5);
			   	var bg6 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), s + 'password;strokeColor=#999999;strokeWidth=3;');
			   	bg6.geometry.relative = true;
			   	bg6.geometry.offset = new mxPoint(-8, -8);
			   	bg6.vertex = true;
			   	bg5.insert(bg6);
			   	var bg7 = new mxCell('Remember me', new mxGeometry(0, 0, 14, 14), s + 'checkbox;rSize=3;strokeColor=#666666;fillColor=#ffffff;labelPosition=right;align=left;spacingLeft=5;fontSize=10;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(73, 148);
			   	bg7.vertex = true;
			   	bg1.insert(bg7);
			   	var bg8 = new mxCell('Log In', new mxGeometry(0, 1, 190, 30), s + 'rrect;rSize=5;strokeColor=none;fillColor=#58B957;fontColor=#ffffff;fontSize=14;fontStyle=1;whiteSpace=wrap;resizeWidth=1;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(30, -50);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			    
			   	return sb.createVertexTemplateFromCells([bg1], 240, 220, 'Log in');
			}),
	
		   	this.addEntry(dt + 'log in', function()
		   	{
			   	var bg1 = new mxCell('Control Panel', new mxGeometry(0, 0, 240, 260), s + 'rrect;fillColor=#ffffff;align=center;rSize=5;strokeColor=#000000;verticalAlign=top;spacingTop=20;fontSize=14;fontStyle=1;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg10 = new mxCell(
			   			'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;"><tr><td align="center" valign="middle" width="50%">Incorrect <b>Email</b> or <b>Password</b></td></tr></table>', 
			   			new mxGeometry(0, 0, 190, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#F2DEDF;fontColor=#DB524C;overflow=fill;whiteSpace=wrap;resizeWidth=1;');
			   	bg10.geometry.relative = true;
			   	bg10.geometry.offset = new mxPoint(30, 50);
			   	bg10.vertex = true;
			   	bg1.insert(bg10);
			   	var bg2 = new mxCell('john@gmail.com', new mxGeometry(0, 0, 190, 30), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#fdfdfd;fontSize=14;align=left;spacingLeft=40;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(30, 100);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('', new mxGeometry(0, 0, 30, 30), s + 'leftButton;rSize=5;strokeColor=#999999;fillColor=#ffffff;resizeHeight=1;');
			   	bg3.geometry.relative = true;
			   	bg3.vertex = true;
			   	bg2.insert(bg3);
			   	var bg4 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 12), s + 'mail;strokeColor=#fdfdfd;fillColor=#999999;strokeWidth=1.3;');
			   	bg4.geometry.relative = true;
			   	bg4.geometry.offset = new mxPoint(-8, -6);
			   	bg4.vertex = true;
			   	bg3.insert(bg4);
			   	var bg5 = new mxCell('********', new mxGeometry(0, 0, 190, 30), s + 'rrect;rSize=5;strokeColor=#999999;fillColor=#fdfdfd;fontSize=14;align=left;spacingLeft=40;whiteSpace=wrap;resizeWidth=1;');
			   	bg5.geometry.relative = true;
			   	bg5.geometry.offset = new mxPoint(30, 140);
			   	bg5.vertex = true;
			   	bg1.insert(bg5);
			   	var bg6 = new mxCell('', new mxGeometry(0, 0, 30, 30), s + 'leftButton;rSize=5;strokeColor=#999999;fillColor=#ffffff;resizeHeight=1;');
			   	bg6.geometry.relative = true;
			   	bg6.vertex = true;
			   	bg5.insert(bg6);
			   	var bg7 = new mxCell('', new mxGeometry(0.5, 0.5, 16, 16), s + 'password;strokeColor=#999999;strokeWidth=3;');
			   	bg7.geometry.relative = true;
			   	bg7.geometry.offset = new mxPoint(-8, -8);
			   	bg7.vertex = true;
			   	bg6.insert(bg7);
			   	var bg8 = new mxCell('Remember me', new mxGeometry(0, 1, 14, 14), s + 'checkbox;rSize=3;strokeColor=#666666;fillColor=#ffffff;labelPosition=right;align=left;spacingLeft=5;fontSize=10;');
			   	bg8.geometry.relative = true;
			   	bg8.geometry.offset = new mxPoint(73, -72);
			   	bg8.vertex = true;
			   	bg1.insert(bg8);
			   	var bg9 = new mxCell('Log In', new mxGeometry(0, 1, 190, 30), s + 'rrect;rSize=5;strokeColor=none;fillColor=#58B957;fontColor=#ffffff;fontSize=14;fontStyle=1;whiteSpace=wrap;resizeWidth=1;');
			   	bg9.geometry.relative = true;
			   	bg9.geometry.offset = new mxPoint(30, -50);
			   	bg9.vertex = true;
			   	bg1.insert(bg9);
			    
			   	return sb.createVertexTemplateFromCells([bg1], 240, 260, 'Log in');
			})
		];
			   	
   		this.addPalette('bootstrap', mxResources.get('bootstrap'), false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
