(function()
{
	// Adds Android shapes
	Sidebar.prototype.addAndroidPalette = function()
	{
		var sizeX = 211; //reference size for iPhone and all other iOS shapes
		
		var sizeY = 2 * sizeX; //change only sizeX, to avoid changing aspect ratio

		var sb = this;
		var s = 'strokeWidth=1;html=1;shadow=0;dashed=0;shape=mxgraph.android.';
		var sm = 'strokeWidth=2;shadow=0;dashed=0;html=1;shape=mxgraph.android.';
		var s2 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.android.';
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shadow=0;dashed=0;strokeWidth=1;strokeColor=none;shape=';
		var s4 = 'rounded=1;html=1;shadow=0;dashed=0;whiteSpace=wrap;fontSize=10;fillColor=#';
		var s5 = 'whiteSpace=wrap;html=1;shadow=0;dashed=0;fontSize=10;align=left;fillColor=#';
		var s6 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shadow=0;dashed=0;strokeWidth=2;shape=mxgraph.android.';
		
		//default tags
		var dt = 'android ';

		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'phone2;fillColor=#ffffff;strokeColor=#c0c0c0;', 
					200, 390, '', 'Phone', null, null, dt + 'phone mobile portrait'),
			this.createVertexTemplateEntry(s2 + 'phone2;fillColor=#ffffff;strokeColor=#c0c0c0;direction=south;', 
					390, 200, '', 'Phone (landscape)', null, null, dt + 'phone mobile landscape'),
			this.createVertexTemplateEntry(s2 + 'tab2;fillColor=#ffffff;strokeColor=#c0c0c0;', 
					472, 686, '', 'Tab', null, null, dt + 'tab tablet portrait'),
			this.createVertexTemplateEntry(s2 + 'tab2;fillColor=#ffffff;strokeColor=#c0c0c0;direction=north;', 
					686, 472, '', 'Tab (landscape)', null, null, dt + 'tab tablet landscape'),
			this.createVertexTemplateEntry(s + 'action_bar;fillColor=#1A1A1A;strokeColor=#c0c0c0;strokeWidth=2;fontColor=#FFFFFF;', 
					185, 30, '', 'Action Bar', null, null, dt + 'action bar dark portrait'),
			this.createVertexTemplateEntry(s + 'action_bar;fillColor=#E6E6E6;strokeColor=#c0c0c0;strokeWidth=2;', 
					185, 30, '', 'Action Bar (Bright)', null, null, dt + 'action bar bright portrait'),
			this.createVertexTemplateEntry(s + 'action_bar_landscape;fillColor=#1A1A1A;strokeColor=#c0c0c0;strokeWidth=2;fontColor=#FFFFFF;', 
					320, 30, '', 'Action Bar Landscape', null, null, dt + 'action bar landscape dark'),
			this.createVertexTemplateEntry(s + 'action_bar_landscape;fillColor=#E6E6E6;strokeColor=#c0c0c0;strokeWidth=2;', 
					320, 30, '', 'Action Bar Landscape (Bright)', null, null, dt + 'action bar bright landscape'),
			this.createVertexTemplateEntry(s4 + '666666;align=center;strokeColor=#4D4D4D;fontColor=#ffffff;', 
					sizeX * 0.5, sizeY * 0.04, 'Normal', 'Button (Normal)', null, null, dt + 'button normal'),
			this.createVertexTemplateEntry(s4 + '666666;align=center;strokeColor=#999999;fontColor=#ffffff;', 
					sizeX * 0.5, sizeY * 0.04, 'Focused', 'Button (Focused)', null, null, dt + 'button focused'),
			this.createVertexTemplateEntry(s4 + '999999;align=center;strokeColor=#666666;fontColor=#ffffff;strokeWidth=2;', 
					sizeX * 0.5, sizeY * 0.04, 'Pressed', 'Button (Pressed)', null, null, dt + 'button pressed'),
			this.createVertexTemplateEntry(s4 + '333333;align=center;strokeColor=#4D4D4D;fontColor=#666666;', 
					sizeX * 0.5, sizeY * 0.04, 'Focused disabled', 'Button (Focused, Disabled)', null, null, dt + 'button focused disabled'),
			this.createVertexTemplateEntry(s4 + '333333;align=center;strokeColor=#333333;fontColor=#666666;', 
					sizeX * 0.5, sizeY * 0.04, 'Disabled', 'Button (Disabled)', null, null, dt + 'button disabled'),
			this.createVertexTemplateEntry(s4 + 'E6E6E6;align=center;strokeColor=#E6E6E6;fontColor=#333333;', 
					sizeX * 0.5, sizeY * 0.04, 'Normal', 'Button (Normal, Bright)', null, null, dt + 'button normal bright'),
			this.createVertexTemplateEntry(s4 + 'E6E6E6;align=center;strokeColor=#B3B3B3;fontColor=#333333;', 
					sizeX * 0.5, sizeY * 0.04, 'Focused', 'Button (Focused, Bright)', null, null, dt + 'button focused bright'),
			this.createVertexTemplateEntry(s4 + 'B3B3B3;align=center;strokeColor=#E6E6E6;fontColor=#333333;strokeWidth=2;', 
					sizeX * 0.5, sizeY * 0.04, 'Pressed', 'Button (Pressed, Bright)', null, null, dt + 'button pressed bright'),
			this.createVertexTemplateEntry(s4 + 'F4F4F4;align=center;strokeColor=#E6E6E6;fontColor=#CCCCCC;', 
					sizeX * 0.5, sizeY * 0.04, 'Focused disabled', 'Button (Focused, Disabled, Bright)', null, null, dt + 'button focused disabled bright'),
			this.createVertexTemplateEntry(s4 + 'F4F4F4;align=center;strokeColor=#F4F4F4;fontColor=#CCCCCC;', 
					sizeX * 0.5, sizeY * 0.04, 'Disabled', 'Button (Disabled, Bright)', null, null, dt + 'button disabled bright'),

			this.addEntry(dt + 'checkboxes checkbox', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 165, 50), s + 'anchor;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Setting 1', new mxGeometry(0, 0, 165, 12.5), s + 'anchor;align=left;spacingLeft=10;fontSize=8;fontColor=#33b5e5;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var anchor1 = new mxCell('', new mxGeometry(0, 6, 0, 0), s + 'anchor;');
			   	anchor1.vertex = true;
			   	button1.insert(anchor1);
			   	var radio1 = new mxCell('', new mxGeometry(2.5, -2.5, 5, 5), s + 'rrect;rSize=0;resizable=0;strokeColor=#33b5e5;');
			   	radio1.vertex = true;
			   	anchor1.insert(radio1);
			   	var button2 = new mxCell('Setting 2', new mxGeometry(0, 12.5, 165, 12.5), s + 'anchor;align=left;spacingLeft=10;fontSize=8;fontColor=#33b5e5;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var anchor2 = new mxCell('', new mxGeometry(0, 6, 0, 0), s + 'anchor;');
			   	anchor2.vertex = true;
			   	button2.insert(anchor2);
			   	var radio2 = new mxCell('', new mxGeometry(2.5, -2.5, 5, 5), s + 'rrect;rSize=0;resizable=0;strokeColor=#33b5e5;');
			   	radio2.vertex = true;
			   	anchor2.insert(radio2);
			   	var button3 = new mxCell('Setting 3', new mxGeometry(0, 25, 165, 12.5), s + 'anchor;align=left;spacingLeft=10;fontSize=8;fontColor=#33b5e5;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var anchor3 = new mxCell('', new mxGeometry(0, 6, 0, 0), s + 'anchor;');
			   	anchor3.vertex = true;
			   	button3.insert(anchor3);
			   	var radio3 = new mxCell('', new mxGeometry(2.5, -2.5, 5, 5), s + 'checkbox;rSize=0;resizable=0;strokeColor=#33b5e5;');
			   	radio3.vertex = true;
			   	anchor3.insert(radio3);
			   	var button4 = new mxCell('Setting 4', new mxGeometry(0, 37.5, 165, 12.5), s + 'anchor;align=left;spacingLeft=10;fontSize=8;fontColor=#33b5e5;');
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var anchor4 = new mxCell('', new mxGeometry(0, 6, 0, 0), s + 'anchor;');
			   	anchor4.vertex = true;
			   	button4.insert(anchor4);
			   	var radio4 = new mxCell('', new mxGeometry(2.5, -2.5, 5, 5), s + 'rrect;rSize=0;resizable=0;strokeColor=#33b5e5;');
			   	radio4.vertex = true;
			   	anchor4.insert(radio4);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Checkboxes');
			}),

			this.addEntry(dt + 'radiobuttons radiobutton', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 165, 50), s + 'anchor;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Option 1', new mxGeometry(0, 0, 165, 12.5), s + 'anchor;align=left;spacingLeft=10;fontSize=8;fontColor=#33b5e5;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var anchor1 = new mxCell('', new mxGeometry(0, 6, 0, 0), s + 'anchor;');
			   	anchor1.vertex = true;
			   	button1.insert(anchor1);
			   	var radio1 = new mxCell('', new mxGeometry(2.5, -2.5, 5, 5), 'shape=ellipse;resizable=0;strokeColor=#33b5e5;html=1;');
			   	radio1.vertex = true;
			   	anchor1.insert(radio1);
			   	var button2 = new mxCell('Option 2', new mxGeometry(0, 12.5, 165, 12.5), s + 'anchor;align=left;spacingLeft=10;fontSize=8;fontColor=#33b5e5;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var anchor2 = new mxCell('', new mxGeometry(0, 6, 0, 0), s + 'anchor;');
			   	anchor2.vertex = true;
			   	button2.insert(anchor2);
			   	var radio2 = new mxCell('', new mxGeometry(2.5, -2.5, 5, 5), 'shape=ellipse;resizable=0;strokeColor=#33b5e5;html=1;');
			   	radio2.vertex = true;
			   	anchor2.insert(radio2);
			   	var button3 = new mxCell('Option 3', new mxGeometry(0, 25, 165, 12.5), s + 'anchor;align=left;spacingLeft=10;fontSize=8;fontColor=#33b5e5;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var anchor3 = new mxCell('', new mxGeometry(0, 6, 0, 0), s + 'anchor;');
			   	anchor3.vertex = true;
			   	button3.insert(anchor3);
			   	var radio3 = new mxCell('', new mxGeometry(2.5, -2.5, 5, 5), 'shape=ellipse;resizable=0;strokeColor=#33b5e5;fillColor=#33b5e5;html=1;');
			   	radio3.vertex = true;
			   	anchor3.insert(radio3);
			   	var button4 = new mxCell('Option 4', new mxGeometry(0, 37.5, 165, 12.5), s + 'anchor;align=left;spacingLeft=10;fontSize=8;fontColor=#33b5e5;');
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var anchor4 = new mxCell('', new mxGeometry(0, 6, 0, 0), s + 'anchor;');
			   	anchor4.vertex = true;
			   	button4.insert(anchor4);
			   	var radio4 = new mxCell('', new mxGeometry(2.5, -2.5, 5, 5), 'shape=ellipse;resizable=0;strokeColor=#33b5e5;html=1;');
			   	radio4.vertex = true;
			   	anchor4.insert(radio4);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Radiobuttons');
			}),

			this.createVertexTemplateEntry(s2 + 'contact_badge_focused;', 40, 40, '', 'Contact Badge Focused', null, null, dt + 'contact badge focused'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_focused;', 60, 60, '', 'Contact Badge Focused', null, null, dt + 'contact badge focused'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_normal;', 40, 40, '', 'Contact Badge Normal', null, null, dt + 'contact badge normal'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_normal;', 60, 60, '', 'Contact Badge Normal', null, null, dt + 'contact badge normal'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_pressed;', 40, 40, '', 'Contact Badge Pressed', null, null, dt + 'contact badge pressed'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_pressed;', 60, 60, '', 'Contact Badge Pressed', null, null, dt + 'contact badge pressed'),

			this.addEntry(dt + 'contextual action bar dark portrait', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 30), s + 'contextual_action_bar;fillColor=#002E3E;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Action', new mxGeometry(40, 0, 100, 30), s + 'anchor;align=left;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);

		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Action Bar');
			}),
					
			this.addEntry(dt + 'contextual action bar bright portrait', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 30), s + 'contextual_action_bar_white;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Action', new mxGeometry(40, 0, 100, 30), s + 'anchor;align=left;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Action Bar (Bright)');
			}),

			this.addEntry(dt + 'contextual action bar landscape dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 30), s + 'contextual_action_bar_landscape;fillColor=#002E3E;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Action', new mxGeometry(40, 0, 100, 30), s + 'anchor;align=left;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Action Bar Landscape');
			}),

			this.addEntry(dt + 'contextual action bar landscape bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 30), s + 'contextual_action_bar_landscape_white;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Action', new mxGeometry(40, 0, 100, 30), s + 'anchor;align=left;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Action Bar Landscape (Bright)');
			}),

			this.addEntry(dt + 'contextual split action bar dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 70), s + 'contextual_split_action_bar;fillColor=#002E3E;fontColor=#FFFFFF;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Contextual', new mxGeometry(0, 0, 185, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 185, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Split Action Bar');
			}),

			this.addEntry(dt + 'contextual split action bar bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 70), s + 'contextual_split_action_bar_white;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Contextual', new mxGeometry(0, 0, 185, 30), s + 'anchor;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 185, 30), s + 'anchor;fontStyle=1;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Split Action Bar (Bright)');
			}),

			this.addEntry(dt + 'contextual split action bar landscape dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 70), s + 'contextual_split_action_bar_landscape;fillColor=#002E3E;fontColor=#FFFFFF;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Contextual', new mxGeometry(0, 0, 320, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 320, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Split Action Bar Landscape');
			}),

			this.addEntry(dt + 'contextual split action bar landscape bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 70), s + 'contextual_split_action_bar_landscape_white;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Contextual', new mxGeometry(0, 0, 320, 30), s + 'anchor;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 320, 30), s + 'anchor;fontStyle=1;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Split Action Bar Landscape (Bright)');
			}),

			this.createVertexTemplateEntry(s2 + 'indeterminate_progress_bar;strokeColor=#33B5E5;', 
					149, 5, '', 'Indeterminate Progress Bar', null, null, dt + 'indeterminate progress bar'),
			this.createVertexTemplateEntry(s2 + 'indeterminateSpinner;', 
					50, 50, '', 'Indeterminate Spinner', null, null, dt + 'indeterminate spinner'),
			this.createVertexTemplateEntry(s2 + 'keyboard;', 
					185, 100, '', 'Keyboard', null, null, dt + 'keyboard'),

			this.addEntry(dt + 'menu bar', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 50), s + 'rrect;rSize=0;strokeColor=#888888;fillColor=#444444;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Menu Item 1', new mxGeometry(0, 0, 185, 12.5), s + 'rrect;rSize=0;fillColor=none;strokeColor=#888888;align=left;spacingLeft=10;fontSize=8;fontColor=#ffffff;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Menu Item 2', new mxGeometry(0, 12.5, 185, 12.5), s + 'rrect;rSize=0;fillColor=none;strokeColor=#888888;align=left;spacingLeft=10;fontSize=8;fontColor=#ffffff;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Menu Item 3', new mxGeometry(0, 25, 185, 12.5), s + 'rrect;rSize=0;fillColor=none;strokeColor=#888888;align=left;spacingLeft=10;fontSize=8;fontColor=#ffffff;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Menu Item 4', new mxGeometry(0, 37.5, 185, 12.5), s + 'rrect;rSize=0;fillColor=none;strokeColor=#888888;align=left;spacingLeft=10;fontSize=8;fontColor=#ffffff;');
			   	button4.vertex = true;
			   	bg.insert(button4);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Menu bar');
			}),

			this.addEntry(dt + 'menu bar', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 50), s + 'rrect;rSize=0;strokeColor=#eeeeee;fillColor=#ffffff;gradientColor=none;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Menu Item 1', new mxGeometry(0, 0, 185, 12.5), s + 'rrect;rSize=0;fillColor=none;strokeColor=#eeeeee;align=left;spacingLeft=10;fontSize=8;fontColor=#333333;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Menu Item 2', new mxGeometry(0, 12.5, 185, 12.5), s + 'rrect;rSize=0;fillColor=none;strokeColor=#eeeeee;align=left;spacingLeft=10;fontSize=8;fontColor=#333333;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Menu Item 3', new mxGeometry(0, 25, 185, 12.5), s + 'rrect;rSize=0;fillColor=none;strokeColor=#eeeeee;align=left;spacingLeft=10;fontSize=8;fontColor=#333333;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Menu Item 4', new mxGeometry(0, 37.5, 185, 12.5), s + 'rrect;rSize=0;fillColor=none;strokeColor=#eeeeee;align=left;spacingLeft=10;fontSize=8;fontColor=#333333;');
			   	button4.vertex = true;
			   	bg.insert(button4);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Menu bar');
			}),

			this.createVertexTemplateEntry(s6 + 'navigation_bar_1;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar portrait horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_1_landscape;fillColor=#1A1A1A;strokeColor=#999999;', 
					320, 30, '', 'Navigation Bar Landscape', null, null, dt + 'navigation bar landscape horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_1_vertical;fillColor=#1A1A1A;strokeColor=#999999;', 
					30, 320, '', 'Navigation Bar Vertical', null, null, dt + 'navigation bar vertical'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_2;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_3;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar portrait horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_3_landscape;fillColor=#1A1A1A;strokeColor=#999999;', 
					320, 30, '', 'Navigation Bar Landscape', null, null, dt + 'navigation bar landscape horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_4;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_5;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_5_vertical;fillColor=#1A1A1A;strokeColor=#999999;', 
					30, 320, '', 'Navigation Bar Vertical', null, null, dt + 'navigation bar vertical'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_6;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar horizontal'),
			this.createVertexTemplateEntry(s2 + 'progressBar;strokeColor=#33b5e5;dx1=0.8;dx2=0.6;strokeWidth=2;', 
					185, 5, '', 'Progress Bar', null, null, dt + 'progress bar'),
			this.createVertexTemplateEntry(s2 + 'progressScrubberDisabled;dx=0.3;fillColor=#33b5e5;', 
					185, 16, '', 'Progress Scrubber Disabled', null, null, dt + 'progress scrubber disabled'),
			this.createVertexTemplateEntry(s2 + 'progressScrubberFocused;dx=0.3;fillColor=#33b5e5;', 
					185, 16, '', 'Progress Scrubber Focused', null, null, dt + 'progress scrubber focused'),
			this.createVertexTemplateEntry(s2 + 'progressScrubberPressed;dx=0.3;fillColor=#33b5e5;', 
					185, 16, '', 'Progress Scrubber Pressed', null, null, dt + 'progress scrubber pressed'),
			this.createVertexTemplateEntry(s2 + 'quickscroll2;dy=0.5;fillColor=#33b5e5;strokeColor=#66D5F5;', 
					58, 320, '', 'Quickscroll', null, null, dt + 'quickscroll quick scroll'),

			this.createVertexTemplateEntry(s2 + 'quickscroll3;dy=0.5;fillColor=#33b5e5;strokeColor=#66D5F5;', 
					6, 320, '', 'Quickscroll', null, null, dt + 'quickscroll quick scroll'),
					
			this.addEntry(dt + 'quick contact', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 150, 165), s + 'quick_contact;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Name', new mxGeometry(0, 65, 150, 18), s + 'anchor;rSize=0;fontStyle=1;fontColor=#FFFFFF;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Item 1', new mxGeometry(0, 108, 120, 28), s + 'anchor;rSize=0;align=left;spacingLeft=10;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var text3 = new mxCell('Item 2', new mxGeometry(0, 136, 120, 28), s + 'anchor;rSize=0;align=left;spacingLeft=10;');
			   	text3.vertex = true;
			   	bg.insert(text3);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Quick Contact');
			}),

			this.addEntry(dt + 'scrollable tab scroll', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 15), s + 'rrect;rSize=0;fillColor=#444444;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('One', new mxGeometry(0, 0, 46.25, 15), s + 'anchor;align=left;fontColor=#FFFFFF;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Tab Two', new mxGeometry(46.25, 0, 92.5, 15), s + 'anchor;fontColor=#FFFFFF;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var text3 = new mxCell('Tab', new mxGeometry(138.75, 0, 46.25, 15), s + 'anchor;align=right;fontColor=#FFFFFF;');
			   	text3.vertex = true;
			   	bg.insert(text3);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Scrollable Tab');
			}),

		   	this.createVertexTemplateEntry(s + 'scrollbars2;fillColor=#999999;strokeColor=none;', 
		   			56, 56, '', 'Scrollbars', null, null, dt + 'scrollbar scroll bar'),
			this.createVertexTemplateEntry(s5 + '1A1A1A;strokeColor=#1A1A1A;fontColor=#FFFFFF;', 
					sizeX * 0.8, sizeY * 0.04, 'Normal', 'Section Header (Normal)', null, null, dt + 'section header normal dark'),
			this.createVertexTemplateEntry(s5 + '4D4D4D;strokeColor=#4D4D4D;fontColor=#FFFFFF;', 
					sizeX * 0.8, sizeY * 0.04, 'Pressed', 'Section Header (Pressed)', null, null, dt + 'section header pressed dark'),
			this.createVertexTemplateEntry(s5 + '33b5e5;strokeColor=#33B5E5;fontColor=#FFFFFF;', 
					sizeX * 0.8, sizeY * 0.04, 'Activated', 'Section Header (Activated)', null, null, dt + 'section header activated dark'),
			this.createVertexTemplateEntry(s5 + '006699;strokeColor=#33B5E5;fontColor=#FFFFFF;', 
					sizeX * 0.8, sizeY * 0.04, 'Focused', 'Section Header (Focused)', null, null, dt + 'section header focused dark'),
			this.createVertexTemplateEntry(s5 + '006699;strokeColor=#33B5E5;fontColor=#B3B3B3;', 
					sizeX * 0.8, sizeY * 0.04, 'Disabled focused', 'Section Header (Disabled focused)', null, null, dt + 'section header disabled focused dark'),
			this.createVertexTemplateEntry(s5 + '1A1A1A;strokeColor=#1A1A1A;fontColor=#B3B3B3;', 
					sizeX * 0.8, sizeY * 0.04, 'Disabled', 'Section Header (Disabled)', null, null, dt + 'section header disabled dark'),
			this.createVertexTemplateEntry(s5 + 'FFFFFF;strokeColor=#FFFFFF;fontColor=#4D4D4D;', 
					sizeX * 0.8, sizeY * 0.04, 'Normal', 'Section Header (Normal, Bright)', null, null, dt + 'section header normal bright'),
			this.createVertexTemplateEntry(s5 + 'f6f6f6;strokeColor=#f6f6f6;fontColor=#4D4D4D;', 
					sizeX * 0.8, sizeY * 0.04, 'Pressed', 'Section Header (Pressed, Bright)', null, null, dt + 'section header pressed bright'),
			this.createVertexTemplateEntry(s5 + '33b5e5;strokeColor=#33B5E5;fontColor=#4D4D4D;', 
					sizeX * 0.8, sizeY * 0.04, 'Activated', 'Section Header (Activated, Bright)', null, null, dt + 'section header activated bright'),
			this.createVertexTemplateEntry(s5 + '99e5ff;strokeColor=#33B5E5;fontColor=#4D4D4D;', 
					sizeX * 0.8, sizeY * 0.04, 'Focused', 'Section Header (Focused, Bright)', null, null, dt + 'section header focused bright'),
			this.createVertexTemplateEntry(s5 + '99e5ff;strokeColor=#33B5E5;fontColor=#B3B3B3;', 
					sizeX * 0.8, sizeY * 0.04, 'Disabled focused', 'Section Header (Disabled focused, Bright)', null, null, dt + 'section header disabled focused bright'),
			this.createVertexTemplateEntry(s5 + 'FFFFFF;strokeColor=#FFFFFF;fontColor=#B3B3B3;', 
					sizeX * 0.8, sizeY * 0.04, 'Disabled', 'Section Header (Disabled, Bright)', null, null, dt + 'section header disabled bright'),
			this.createVertexTemplateEntry(s + 'spinner2;align=center;fillColor=#999999;strokeColor=#999999;verticalAlign=bottom', 
					110, 10, 'Item', 'Spinner Normal', null, null, dt + 'spinner normal'),
			this.createVertexTemplateEntry(s + 'spinner2;align=center;fillColor=#33b5e5;strokeColor=#33b5e5;verticalAlign=bottom', 
					110, 10, 'Item', 'Spinner Focused', null, null, dt + 'spinner focused'),
					
			this.addEntry(dt + 'spinner disabled focused', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 117, 28), s + 'rect;rounded=1;fillColor=#207585;strokeColor=#33b5e5;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Item', new mxGeometry(3, 4, 110, 20), s + 'spinner2;fontStyle=1;fontColor=#ffffff;align=center;verticalAlign=middle;strokeColor=#999999;fillColor=#999999;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Spinner Disabled Focused');
			}),
					
			this.addEntry(dt + 'spinner disabled focused light bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 117, 28), s + 'rect;rounded=1;fillColor=#ccf2ff;strokeColor=#88c5f5;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Item', new mxGeometry(3, 4, 110, 20), s + 'spinner2;fontStyle=0;fontColor=#666666;align=center;verticalAlign=middle;strokeColor=#cccccc;fillColor=#cccccc;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Spinner Disabled Focused Bright');
			}),

			this.addEntry(dt + 'spinner pressed', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 117, 28), s + 'rect;rounded=1;fillColor=#33b5e5;strokeColor=#33b5e5;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Item', new mxGeometry(3, 4, 110, 20), s + 'spinner2;fontStyle=0;fontColor=#ffffff;align=center;verticalAlign=middle;strokeColor=#aaeeff;fillColor=#aaeeff;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Spinner Pressed');
			}),

			this.addEntry(dt + 'spinner pressed light bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 117, 28), s + 'rect;rounded=1;fillColor=#33b5e5;strokeColor=#33b5e5;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Item', new mxGeometry(3, 4, 110, 20), s + 'spinner2;fontStyle=0;fontColor=#ffffff;align=center;verticalAlign=middle;strokeColor=#666666;fillColor=#666666;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Spinner Pressed Bright');
			}),
			
			this.addEntry(dt + 'split action bar dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 70), s + 'split_action_bar;fillColor=#1A1A1A;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Split', new mxGeometry(0, 0, 185, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 185, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Split Action Bar');
			}),

			this.addEntry(dt + 'split action bar bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 70), s + 'split_action_bar;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Split', new mxGeometry(0, 0, 185, 30), s + 'anchor;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 185, 30), s + 'anchor;fontStyle=1;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Split Action Bar (Bright)');
			}),

			this.addEntry(dt + 'split action bar landscape dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 70), s + 'split_action_bar_landscape;fillColor=#1A1A1A;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Split', new mxGeometry(0, 0, 320, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 320, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Split Action Bar Landscape');
			}),

			this.addEntry(dt + 'split action bar landscape bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 70), s + 'split_action_bar_landscape;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Split', new mxGeometry(0, 0, 320, 30), s + 'anchor;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 320, 30), s + 'anchor;fontStyle=1;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Split Action Bar Landscape (Bright)');
			}),

			this.createVertexTemplateEntry(s + 'statusBar;align=center;fillColor=#000000;strokeColor=#ffffff;fontColor=#ffffff;fontSize=10;', 
					sizeX * 0.87, sizeY * 0.0375, '', 'Status bar (portrait)', null, null, dt + 'status bar portrait'),
			this.createVertexTemplateEntry(s + 'statusBar;align=center;fillColor=#000000;strokeColor=#ffffff;fontColor=#ffffff;fontSize=10;', 
					sizeX * 1.517, sizeY * 0.0375, '', 'Status bar (landscape)', null, null, dt + 'status bar landscape'),
			this.createVertexTemplateEntry(s2 + 'switch_off;fillColor=#666666;', 
					80, 20, '', 'Switch Off', null, null, dt + 'switch off'),
			this.createVertexTemplateEntry(s2 + 'switch_off;fillColor=#E6E6E6;', 
					80, 20, '', 'Switch Off', null, null, dt + 'switch off'),
			this.createVertexTemplateEntry(s2 + 'switch_on;fillColor=#666666;', 
					80, 20, '', 'Switch On', null, null, dt + 'switch on'),
			this.createVertexTemplateEntry(s2 + 'switch_on;fillColor=#E6E6E6;', 
					80, 20, '', 'Switch On', null, null, dt + 'switch on'),

			this.addEntry(dt + 'tab tabulator bar dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 30), s + 'rrect;rSize=0;fillColor=#444444;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Tab 1', new mxGeometry(0, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Tab 2', new mxGeometry(46.25, 0, 46.25, 30), s + 'rrect;rSize=0;fontStyle=1;fillColor=#0099cc;strokeColor=none;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var button1 = new mxCell('', new mxGeometry(0, 27, 46.25, 3), s + 'rrect;rSize=0;fillColor=#33b5e5;strokeColor=none;');
			   	button1.vertex = true;
			   	text2.insert(button1);
			   	var text3 = new mxCell('Tab 3', new mxGeometry(92.5, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text3.vertex = true;
			   	bg.insert(text3);
			   	var text4 = new mxCell('Tab 4', new mxGeometry(138.75, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text4.vertex = true;
			   	bg.insert(text4);
			   	var line1 = new mxCell('', new mxGeometry(131.5, 5, 10, 20), 'shape=line;strokeColor=#ffffff;direction=south;');
			   	line1.vertex = true;
			   	bg.insert(line1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Tab Bar Dark');
			}),

			this.addEntry(dt + 'tab tabulator bar dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 30), s + 'rrect;rSize=0;fillColor=#444444;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Tab 1', new mxGeometry(0, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Tab 2', new mxGeometry(46.25, 0, 46.25, 30), s + 'rrect;rSize=0;fontStyle=1;fillColor=none;strokeColor=none;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var button1 = new mxCell('', new mxGeometry(0, 27, 46.25, 3), s + 'rrect;rSize=0;fillColor=#33b5e5;strokeColor=none;');
			   	button1.vertex = true;
			   	text2.insert(button1);
			   	var text3 = new mxCell('Tab 3', new mxGeometry(92.5, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text3.vertex = true;
			   	bg.insert(text3);
			   	var text4 = new mxCell('Tab 4', new mxGeometry(138.75, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text4.vertex = true;
			   	bg.insert(text4);
			   	var line1 = new mxCell('', new mxGeometry(131.5, 5, 10, 20), 'shape=line;strokeColor=#ffffff;direction=south;');
			   	line1.vertex = true;
			   	bg.insert(line1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Tab Bar Dark');
			}),

			this.addEntry(dt + 'tab tabulator bar bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 30), s + 'rrect;rSize=0;fillColor=#eeeeee;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Tab 1', new mxGeometry(0, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#666666;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Tab 2', new mxGeometry(46.25, 0, 46.25, 30), s + 'rrect;rSize=0;fontStyle=1;fillColor=#44c5f5;strokeColor=none;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var button1 = new mxCell('', new mxGeometry(0, 27, 46.25, 3), s + 'rrect;rSize=0;fillColor=#33b5e5;strokeColor=none;');
			   	button1.vertex = true;
			   	text2.insert(button1);
			   	var text3 = new mxCell('Tab 3', new mxGeometry(92.5, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#666666;');
			   	text3.vertex = true;
			   	bg.insert(text3);
			   	var text4 = new mxCell('Tab 4', new mxGeometry(138.75, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#666666;');
			   	text4.vertex = true;
			   	bg.insert(text4);
			   	var line1 = new mxCell('', new mxGeometry(131.5, 5, 10, 20), 'shape=line;strokeColor=#666666;direction=south;');
			   	line1.vertex = true;
			   	bg.insert(line1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Tab Bar Bright');
			}),

			this.addEntry(dt + 'tab tabulator bar bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 30), s + 'rrect;rSize=0;fillColor=#eeeeee;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Tab 1', new mxGeometry(0, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#666666;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Tab 2', new mxGeometry(46.25, 0, 46.25, 30), s + 'rrect;rSize=0;fontStyle=1;fillColor=none;strokeColor=none;fontColor=#666666;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var button1 = new mxCell('', new mxGeometry(0, 27, 46.25, 3), s + 'rrect;rSize=0;fillColor=#33b5e5;strokeColor=none;');
			   	button1.vertex = true;
			   	text2.insert(button1);
			   	var text3 = new mxCell('Tab 3', new mxGeometry(92.5, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#666666;');
			   	text3.vertex = true;
			   	bg.insert(text3);
			   	var text4 = new mxCell('Tab 4', new mxGeometry(138.75, 0, 46.25, 30), s + 'anchor;fontStyle=1;fontColor=#666666;');
			   	text4.vertex = true;
			   	bg.insert(text4);
			   	var line1 = new mxCell('', new mxGeometry(131.5, 5, 10, 20), 'shape=line;strokeColor=#666666;direction=south;');
			   	line1.vertex = true;
			   	bg.insert(line1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Tab Bar Bright');
			}),

		   	this.createVertexTemplateEntry(s + 'textfield;align=center;strokeColor=#4D4D4D;', 
		   			174, 30, '', 'Textfield Disabled', null, null, dt + 'textfield disabled'),
			this.createVertexTemplateEntry(s + 'textfield;align=center;strokeColor=#999999;', 
					174, 30, '', 'Textfield Normal', null, null, dt + 'textfield normal'),
			this.createVertexTemplateEntry(s + 'textfield;align=center;strokeColor=#33b5e5;', 
					174, 30, '', 'Textfield Activated', null, null, dt + 'textfield activated'),
			this.createVertexTemplateEntry(s2 + 'text_insertion_point;', 
					20, 30, '', 'Text Insertion Point', null, null, dt + 'textfield insertion point'),
			this.createVertexTemplateEntry(s2 + 'textSelHandles;fillColor=#33b5e5;strokeColor=#0099cc;', 
					sizeX * 0.8, sizeY * 0.1, '', 'Text Selection Handles', null, null, dt + 'text selection handle'),
			this.createVertexTemplateEntry(s2 + 'time_picker;', 
					150, 230, '', 'Time Picker (Bright)', null, null, dt + 'time picker bright'),
			this.createVertexTemplateEntry(s2 + 'time_picker_dark;', 
					150, 230, '', 'Time Picker (Dark)', null, null, dt + 'time picker dark'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#33b5e5;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#0099cc;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#aa66cc;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#9933cc;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#99cc00;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#669900;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#ffbb33;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#ff8800;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#ff4444;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#cc0000;', 
					50, 50, '', 'Color', null, null, dt + 'color')
		];

		this.addPalette('android', mxResources.get('android'), false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
