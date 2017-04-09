(function()
{
	// Adds iOS shapes
	Sidebar.prototype.addIosPalette = function()
	{
			// Avoids having to bind all functions to "this"
			sb = this;
			
			//default tags
			var dt = 'ios icon ';
		
			var sizeX = 200; //reference size for iPhone and all other iOS shapes
			
			var sizeY = 2 * sizeX; //change only sizeX, to avoid changing aspect ratio
			
			var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios.';
			var s2 = mxConstants.STYLE_STROKEWIDTH + '=1;html=1;shadow=0;dashed=0;shape=mxgraph.ios.';
			var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;html=1;shadow=0;dashed=0;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;shape=mxgraph.ios.';
			var s4 = 'html=1;shadow=0;dashed=0;shape=mxgraph.ios.';
			var gn = 'mxgraph.ios';
		
		var fns =
		[
			
			this.createVertexTemplateEntry(s + 'iPhone;bgStyle=bgGreen;fillColor=#aaaaaa;', sizeX, sizeY, '', 'iPhone (portrait)', null, null, null),
		 	this.createVertexTemplateEntry(s + 'iPhone;direction=north;bgStyle=bgGreen;fillColor=#aaaaaa;', sizeY, sizeX, '', 'iPhone (landscape)', null, null, null),
			this.createVertexTemplateEntry(s + 'iPad;bgStyle=bgGreen;fillColor=#aaaaaa;', sizeX * 2.425, sizeY * 1.5625, '', 'iPad (portrait)', null, null, null),
			this.createVertexTemplateEntry(s + 'iPad;direction=north;bgStyle=bgGreen;fillColor=#aaaaaa;', sizeY * 1.5625, sizeX * 2.425, '', 'iPad (landscape)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgFlat;strokeColor=#18211b;fillColor=#ffffff;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (white)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgFlat;strokeColor=#18211b;fillColor=#1f2923;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (green)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgFlat;strokeColor=#18211b;fillColor=#dddddd;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (gray)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgStriped;strokeColor=#18211b;fillColor=#5D7585;strokeColor2=#657E8F;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (striped)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgMap;strokeColor=#18211b;fillColor=#ffffff;strokeColor2=#008cff;fillColor2=#96D1FF;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (map)', null, null, null),

			this.addEntry(null, function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 165, 50), s4 + 'rrect;rSize=5;strokeColor=#444444;fillColor=#ffffff;gradientColor=none;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Item 1', new mxGeometry(0, 0, 165, 12.5), s4 + 'topButton;rSize=5;fillColor=none;strokeColor=#c4c4c4;align=left;spacingLeft=10;fontSize=8;fontColor=#666666;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var text1 = new mxCell('>', new mxGeometry(140, 1, 10, 10), s4 + 'anchor;fontColor=#c4c4c4;fontStyle=1;');
			   	text1.vertex = true;
			   	button1.insert(text1);
			   	var button3 = new mxCell('Item 3', new mxGeometry(0, 25, 165, 12.5), s4 + 'rrect;rSize=0;fillColor=none;strokeColor=#c4c4c4;align=left;spacingLeft=10;fontSize=8;fontColor=#666666;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var text3 = new mxCell('>', new mxGeometry(140, 1, 10, 10), s4 + 'anchor;fontColor=#c4c4c4;fontStyle=1;');
			   	text3.vertex = true;
			   	button3.insert(text3);
			   	var button4 = new mxCell('Item 4', new mxGeometry(0, 37.5, 165, 12.5), s4 + 'bottomButton;rSize=5;fillColor=none;strokeColor=#c4c4c4;align=left;spacingLeft=10;fontSize=8;fontColor=#666666;');
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var text4 = new mxCell('>', new mxGeometry(140, 1, 10, 10), s4 + 'anchor;fontColor=#c4c4c4;fontStyle=1;');
			   	text4.vertex = true;
			   	button4.insert(text4);
			   	var button2 = new mxCell('Item 2', new mxGeometry(0, 12.5, 165, 12.5), s4 + 'rrect;rSize=0;fillColor=#5D7585;strokeColor=none;align=left;spacingLeft=10;fontSize=8;fontColor=#ffffff;gradientColor=#008cff;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var text2 = new mxCell('>', new mxGeometry(140, 1, 10, 10), s4 + 'anchor;fontColor=#c4c4c4;fontStyle=1;');
			   	text2.vertex = true;
			   	button2.insert(text2);
			   	var fg = new mxCell('', new mxGeometry(0, 0, 165, 50), s4 + 'rrect;rSize=5;strokeColor=#444444;fillColor=none;');
			   	fg.vertex = true;
			   	bg.insert(fg);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button bar');
			}),

			this.addEntry(null, function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 175, 15), s4 + 'iAppBar;strokeWidth=1;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('CARRIER', new mxGeometry(0, 2, 50, 13), s4 + 'anchor;align=left;fontSize=8;spacingLeft=18;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('11:55PM', new mxGeometry(60, 2, 50, 13), s4 + 'rect;fontSize=8;strokeColor=none;fillColor=none;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'App bar (portrait)');
			}),
		
			this.addEntry(null, function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 280, 15), s4 + 'iAppBar;strokeWidth=1;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('CARRIER', new mxGeometry(0, 2, 50, 13), s4 + 'anchor;align=left;fontSize=8;spacingLeft=18;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('11:55PM', new mxGeometry(115, 2, 50, 13), s4 + 'rect;fontSize=8;strokeColor=none;fillColor=none;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'App bar (landscape)');
			}),
				
			this.addEntry(null, function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 175, 15), s4 + 'iTopBar2;opacity=50;fillColor=#999999;strokeColor=#cccccc;strokeWidth=1;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('CARRIER', new mxGeometry(0, 2, 50, 13), s4 + 'rect;align=left;fontSize=7.5;spacingLeft=18;fontColor=#cccccc;textOpacity=50;strokeColor=none;fillColor=none;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('11:15AM', new mxGeometry(60, 2, 50, 13), s4 + 'rect;fontSize=7.5;fontColor=#cccccc;textOpacity=50;strokeColor=none;fillColor=none;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Top bar');
			}),
			
			this.addEntry(null, function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 175, 15), s4 + 'iTopBarLocked;strokeWidth=1;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('CARRIER', new mxGeometry(0, 2, 50, 13), s4 + 'anchor;align=left;fontSize=7.5;spacingLeft=18;fontColor=#cccccc;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Top bar locked');
			}),
		   	
			this.createVertexTemplateEntry(s2 + 'iButton;strokeColor=#444444;fontColor=#ffffff;buttonText=;fontSize=8;fillColor=#dddddd;fillColor2=#3D5565;whiteSpace=wrap;align=center;', 
					sizeX * 0.2175, sizeY * 0.0375, 'Button', 'Button', null, null, null),
		 	this.createVertexTemplateEntry(s2 + 'iButtonBack;strokeColor=#444444;fontColor=#ffffff;buttonText=;fontSize=8;fillColor=#dddddd;fillColor2=#3D5565;spacingLeft=10;whiteSpace=wrap;align=center;', 
		 			sizeX * 0.2175, sizeY * 0.0375, 'Button', 'Back button', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iButtonFw;strokeColor=#444444;fontColor=#ffffff;buttonText=;fontSize=8;fillColor=#dddddd;fillColor2=#3D5565;spacingRight=10;whiteSpace=wrap;align=center;', 
					sizeX * 0.2175, sizeY * 0.0375, 'Button', 'Forward button', null, null, null),
			this.createVertexTemplateEntry(s + 'iPrevNext;strokeColor=#444444;fillColor=#dddddd;fillColor2=#3D5565;fillColor3=#ffffff;align=center;', 
					sizeX * 0.2175, sizeY * 0.0375, '', 'Prev/next button', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iTextInput;strokeColor=#444444;fontColor=#000000;buttonText=;fontSize=8;fillColor=#ffffff;whiteSpace=wrap;align=left;', 
					sizeX * 0.2175, sizeY * 0.0375, 'Default text', 'Text input', null, null, null),

			this.addEntry(null, function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 165, 50), s4 + 'rrect;rSize=3;strokeColor=#666666;fillColor=#ffffff;gradientColor=none;recursiveResize=0');
			   	bg.vertex = true;
			   	var radio1 = new mxCell('Option 1', new mxGeometry(2.5, 3.5, 5, 5), 
			   			'shape=ellipse;resizable=0;fillColor=#dddddd;align=left;spacingLeft=2;fontSize=8;fontColor=#666666;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;spacingTop=3;');
			   	radio1.vertex = true;
			   	bg.insert(radio1);
			   	var radio2 = new mxCell('Option 2', new mxGeometry(2.5, 16, 5, 5), 
	   					'shape=ellipse;resizable=0;fillColor=#dddddd;align=left;spacingLeft=2;fontSize=8;fontColor=#666666;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;spacingTop=3;');
			   	radio2.vertex = true;
			   	bg.insert(radio2);
			   	var radio3 = new mxCell('Option 3', new mxGeometry(2.5, 28.5, 5, 5), 
						'shape=ellipse;resizable=0;fillColor=#444444;align=left;spacingLeft=2;fontSize=8;fontColor=#666666;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;spacingTop=3;');
			   	radio3.vertex = true;
			   	bg.insert(radio3);
			   	var radio4 = new mxCell('Option 4', new mxGeometry(2.5, 41, 5, 5), 
			   			'shape=ellipse;resizable=0;fillColor=#dddddd;align=left;spacingLeft=2;fontSize=8;fontColor=#666666;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;spacingTop=3;');
			   	radio4.vertex = true;
			   	bg.insert(radio4);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Radio Buttons');
			}),
	
			this.addEntry(null, function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 165, 50), s4 + 'rrect;rSize=3;strokeColor=#666666;fillColor=#ffffff;gradientColor=none;recursiveResize=0;');
			   	bg.vertex = true;
			   	var radio1 = new mxCell('Setting 1', new mxGeometry(2.5, 3.5, 5, 5), 
			   			s4 + 'rrect;rSize=0;fillColor=#dddddd;align=left;spacingLeft=2;fontSize=8;fontColor=#666666;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;spacingTop=3;');
			   	radio1.vertex = true;
			   	bg.insert(radio1);
			   	var radio2 = new mxCell('Setting 2', new mxGeometry(2.5, 16, 5, 5), 
			   			s4 + 'rrect;rSize=0;fillColor=#dddddd;align=left;spacingLeft=2;fontSize=8;fontColor=#666666;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;spacingTop=3;');
			   	radio2.vertex = true;
			   	bg.insert(radio2);
			   	var radio3 = new mxCell('Setting 3', new mxGeometry(2.5, 28.5, 5, 5), 
			   			s4 + 'checkbox;fillColor=#999999;align=left;spacingLeft=2;fontSize=8;fontColor=#666666;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;spacingTop=3;');
			   	radio3.vertex = true;
			   	bg.insert(radio3);
			   	var radio4 = new mxCell('Setting 4', new mxGeometry(2.5, 41, 5, 5), 
			   			s4 + 'rrect;rSize=0;fillColor=#dddddd;align=left;spacingLeft=2;fontSize=8;fontColor=#666666;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;spacingTop=3;');
			   	radio4.vertex = true;
			   	bg.insert(radio4);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Checkboxes');
			}),
			   	
			this.createVertexTemplateEntry(s2 + 'iComboBox;spacingTop=2;spacingLeft=2;align=left;strokeColor=#444444;fontColor=#666666;buttonText=;fontSize=8;fillColor=#dddddd;fillColor2=#3D5565;', 
					sizeX * 0.29, sizeY * 0.0375, 'Option 1', 'Combobox', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iOnOffButton;mainText=;strokeColor=#444444;fontSize=9;fontColor=#ffffff;spacingRight=14;buttonState=on', sizeX * 0.2175, sizeY * 0.0375, 
					'ON', 'On-off button', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iTextInput;strokeColor=#444444;fontColor=#000000;align=left;buttonText=;fontSize=8;fillColor=#ffffff;', sizeX * 0.2175, sizeY * 0.0375, 
					'********', 'Password field', null, null, null),

			this.addEntry(null, function()
			{
			   	var bg = new mxCell(
			   			'Alert description text\ndescription text second line', 
			   			new mxGeometry(0, 0, 150, 100), s4 + 'fancyRRect;rSize=8;strokeColor=#dddddd;fillColor=#497198;gradientColor=#193168;opacity=80;fontColor=#ffffff;fontSize=9;whiteSpace=wrap;align=center;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Something happened', new mxGeometry(0, 0, 150, 25), s4 + 'anchor;fontSize=13;fontColor=#ffffff;whiteSpace=wrap;resizeWidth=1;');
			   	text1.geometry.relative = true;
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var button1 = new mxCell('Button', new mxGeometry(0.5, 1, 80, 20), s4 + 'rrect;rSize=3;fontSize=9;fontColor=#ffffff;strokeColor=#ffffff;fillColor=#497198;gradientColor=#c5cee1;opacity=80;whiteSpace=wrap;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-40, -25);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Alert Box');
			}),

			this.addEntry(null, function()
			{
			   	var bg = new mxCell(
			   			'Dialog question text\nquestion text second line', 
			   			new mxGeometry(0, 0, 150, 100), s4 + 'fancyRRect;rSize=8;strokeColor=#dddddd;fillColor=#497198;gradientColor=#193168;opacity=80;fontColor=#ffffff;fontSize=9;whiteSpace=wrap;align=center;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Something happened', new mxGeometry(0, 0, 150, 25), s4 + 'anchor;fontSize=13;fontColor=#ffffff;whiteSpace=wrap;resizeWidth=1;');
			   	text1.geometry.relative = true;
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var button1 = new mxCell('Cancel', new mxGeometry(0.25, 1, 65, 20), s4 + 'rrect;rSize=3;fontSize=9;fontColor=#ffffff;strokeColor=#ffffff;fillColor=#497198;gradientColor=#c5cee1;opacity=80;whiteSpace=wrap;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-32.5, -25);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('OK', new mxGeometry(0.75, 1, 65, 20), s4 + 'rrect;rSize=3;fontSize=9;fontColor=#ffffff;strokeColor=#ffffff;fillColor=#497198;gradientColor=#c5cee1;opacity=80;whiteSpace=wrap;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(-32.5, -25);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dialog Box');
			}),

			this.createVertexTemplateEntry(s2 + 'iLockButton;fontColor=#cccccc;fontSize=13;mainText=;spacingLeft=50;spacingRight=10;align=center;', sizeX * 0.87, sizeY * 0.125, 'slide to unlock', 'Lock button', null, null, null),
			this.createVertexTemplateEntry(s + 'iArrowIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;', sizeX * 0.075, sizeY * 0.0375, '', 'Arrow', null, null, null),
			this.createVertexTemplateEntry(s + 'iDeleteIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff;', sizeX * 0.075, sizeY * 0.0375, '', 'Delete', null, null, null),
			this.createVertexTemplateEntry(s + 'iAddIcon;fillColor=#7AdF78;fillColor2=#1A9917;strokeColor=#ffffff;', sizeX * 0.075, sizeY * 0.0375, '', 'Add', null, null, null),
			this.createVertexTemplateEntry(s + 'iInfoIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;', sizeX * 0.075, sizeY * 0.0375, '', 'Info', null, null, null),
			this.createVertexTemplateEntry(s + 'iSortFindIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;', sizeX * 0.075, sizeY * 0.0375, '', 'Sort/find', null, null, null),
			this.createVertexTemplateEntry(s + 'iCheckIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff;', sizeX * 0.075, sizeY * 0.0375, '', 'Check', null, null, null),
			this.createVertexTemplateEntry(s + 'iKeybLett;', sizeX * 0.87, sizeY * 0.25, '', 'Keyboard (letters)', null, null, null),
			this.createVertexTemplateEntry(s + 'iKeybNumb;', sizeX * 0.87, sizeY * 0.25, '', 'Keyboard (numbers)', null, null, null),
			this.createVertexTemplateEntry(s + 'iKeybSymb;', sizeX * 0.87, sizeY * 0.25, '', 'Keyboard (symbols)', null, null, null),
			this.createVertexTemplateEntry(s + 'iDeleteApp;fillColor=#cccccc;fillColor2=#000000;strokeColor=#ffffff;', sizeX * 0.075, sizeY * 0.0375, '', 'Delete app', null, null, null),
			this.createVertexTemplateEntry(s + 'iDir;', sizeX * 0.5, sizeY * 0.25, '', 'Direction', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iLocBar;align=left;spacingLeft=4;spacingBottom=4;fontColor=#ffffff;fontSize=10;barPos=80;pointerPos=bottom;buttonText=', sizeX * 0.775, sizeY * 0.08125, '5th Street Music Store', 'Location bar', null, null, null),
			this.createVertexTemplateEntry(s + 'iCallDialog;', sizeX * 0.75, sizeY * 0.3125, '', 'Call Dialog', null, null, null),
			this.createVertexTemplateEntry(s + 'iCallButtons;', sizeX * 0.87, sizeY * 0.575, '', 'Call buttons', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iOption;barPos=80;pointerPos=bottom;buttonText=;fontSize=10;fontColor=#ffffff;spacingBottom=6;', sizeX * 0.375, sizeY * 0.06875, 'Option', 'Option', null, null, null),
			this.createVertexTemplateEntry(s + 'iAlphaList;fontSize=7.5;', sizeX * 0.075, sizeY * 0.5625, '', 'Alphabet list', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iHorButtonBar;strokeColor=#444444;strokeColor2=#c4c4c4;fillColor2=#ffffff;buttonText=,+,,;overflow=width;html=1;fontSize=8;fillColor=#ffffff;fillColor2=#008cff', sizeX * 0.825, sizeY * 0.03125,
					'<table cellpadding="0" cellspacing="0" style="font-size:1em;color:#666666;width:100%;"><tr><td align="center" width="25%">Item 1</td><td align="center" style="color:white;" width="25%">Item 2</td><td align="center" width="25%">Item 3</td><td align="center" width="25%">Item 4</td></tr></table>', 'Horizontal button bar', null, null, null),
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#ccccff;fillColor3=#0000ff;strokeColor=#000066;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#ffff00;fillColor3=#888800;strokeColor=#999900;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#ffa500;fillColor3=#885000;strokeColor=#997000;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s + 'iVideoControls;barPos=20;', sizeX * 0.87, sizeY * 0.125, '', 'Video controls', null, null, null),

			this.addEntry(null, function()
			{
			   	var bg = new mxCell('Page title', new mxGeometry(0, 0, 175, 30), s4 + 'iURLBar;verticalAlign=top;fontSize=8;spacingTop=-5;align=center;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('https://www.draw.io/', new mxGeometry(5, 12, 115, 13), s4 + 'anchor;fontSize=8;spacingLeft=3;align=left;spacingTop=2;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Cancel', new mxGeometry(137, 12, 32, 13), s4 + 'anchor;fontSize=8;fontColor=#ffffff;spacingTop=2;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'URL bar');
			}),

			this.createVertexTemplateEntry(s + 'iSlider;barPos=20;', sizeX * 0.75, sizeY * 0.025, '', 'Slider', null, null, null),
		 	this.createVertexTemplateEntry(s + 'iProgressBar;barPos=40;', sizeX * 0.75, sizeY * 0.025, '', 'Progress bar', null, null, null),
			this.createVertexTemplateEntry(s + 'iCloudProgressBar;barPos=20;', sizeX * 0.75, sizeY * 0.025, '', 'Cloud progress bar', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iDownloadBar;verticalAlign=top;spacingTop=-4;fontSize=8;fontColor=#ffffff;buttonText=' + ';barPos=30;align=center;', sizeX * 0.87, sizeY * 0.075, 'Downloading 2 of 6', 'Download bar', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iScreenNameBar;fillColor2=#000000;fillColor3=#ffffff;buttonText=;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;align=center;', sizeX * 0.87, sizeY * 0.0625, 'Screen Name', 'Screen name bar', null, null, null),
			this.createVertexTemplateEntry(s + 'iIconGrid;fillColor=#ffffff;strokeColor=#000000;gridSize=3,3;', sizeX * 0.75, sizeY * 0.375, '', 'Icon grid', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iCopy;fillColor=#000000;strokeColor=#000000;buttonText=;fontColor=#ffffff;spacingBottom=6;fontSize=9;fillColor2=#000000;fillColor3=#ffffff;align=center;', sizeX * 0.2, sizeY * 0.06875, 'Copy', 'Copy', null, null, null),
			
			this.addEntry(null, function()
			{
			   	var bg = new mxCell('Copy', new mxGeometry(sizeX * 0.05, 0, sizeX * 0.2, sizeY * 0.06875), s4 + 'iCopy;fillColor=#000000;strokeColor=#000000;buttonText=;fontColor=#ffffff;spacingBottom=6;fontSize=9;fillColor2=#000000;fillColor3=#ffffff;align=center;');
			   	bg.vertex = true;
			   	var area1 = new mxCell('', new mxGeometry(0, sizeY * 0.06875, sizeX * 0.3, sizeY * 0.13125), s4 + 'rect;fillColor=#2266ff;strokeColor=none;opacity=30;');
			   	area1.vertex = true;
			   	
				return sb.createVertexTemplateFromCells([bg, area1], sizeX * 0.3, sizeY * 0.2, 'Copy Area');
			}),
			
			this.createVertexTemplateEntry(s + 'iHomePageControl;fillColor=#666666;strokeColor=#cccccc;', sizeX * 0.25, sizeY * 0.0125, '', 'Home page control', null, null, null),
			this.createVertexTemplateEntry(s + 'iPageControl;fillColor=#666666;strokeColor=#cccccc;', sizeX * 0.25, sizeY * 0.0125, '', 'Page control', null, null, null)
			
		];

		this.addPalette('ios', 'iOS6', false, mxUtils.bind(this, function(content)
				{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
