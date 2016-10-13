(function()
{
	// Adds mockup shapes
	Sidebar.prototype.addMockupPalette = function()
	{
		this.addMockupButtonsPalette();
		this.addMockupContainersPalette();
		this.addMockupFormsPalette();
		this.addMockupGraphicsPalette();
		this.addMockupMarkupPalette();
		this.addMockupMiscPalette();
		this.addMockupNavigationPalette();
		this.addMockupTextPalette();
	};
	
	Sidebar.prototype.addMockupButtonsPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 = mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
		var gn = 'mxgraph.mockup.buttons';
		var dt = 'mockup button ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'buttons.button;' + skcl6 + 'fontColor=#ffffff;mainText=;buttonStyle=round;fontSize=17;fontStyle=1;fillColor=#008cff;whiteSpace=wrap;',
										150, 50, 'Button Text', 'Button', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),

			this.addEntry(dt + 'formatted multibutton multi', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 150, 50), s2 + 'buttons.multiButton;fillColor=#008cff;strokeColor=#666666;mainText=;subText=;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Main Text', new mxGeometry(0, 8, 150, 20), s2 + 'anchor;fontSize=16;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Sub Text', new mxGeometry(0, 30, 150, 10), s2 + 'anchor;fontSize=12;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Formatted Button');
			}),
			
			this.addEntry(dt + 'horizontal bar', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 500, 50), s2 + 'rrect;rSize=10;fillColor=#ffffff;strokeColor=#666666;');
			   	bg.vertex = true;
			   	var button2 = new mxCell('Button 2', new mxGeometry(0, 0, 125, 50), s2 + 'rrect;rSize=0;fontSize=17;fontColor=#666666;fontStyle=1;fillColor=none;strokeColor=#666666;resizeHeight=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(125, 0);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Button 3', new mxGeometry(0, 0, 125, 50), s2 + 'rrect;rSize=0;fontSize=17;fontColor=#666666;fontStyle=1;fillColor=none;strokeColor=#666666;resizeHeight=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(250, 0);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Button 4', new mxGeometry(1, 0, 125, 50), s2 + 'rightButton;rSize=10;fontSize=17;fontColor=#666666;fontStyle=1;fillColor=none;strokeColor=#666666;resizeHeight=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(-125, 0);
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button1 = new mxCell('Button 1', new mxGeometry(0, 0, 125, 50), s2 + 'leftButton;rSize=10;fontSize=17;fontColor=#ffffff;fontStyle=1;fillColor=#008cff;strokeColor=none;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Horizontal Button Bar');
			}),
			
			this.addEntry(dt + 'vertical bar', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 120, 200), s2 + 'rrect;rSize=10;fillColor=#ffffff;strokeColor=#666666;');
			   	bg.vertex = true;
			   	var button2 = new mxCell('Button 2', new mxGeometry(0, 0, 120, 50), s2 + 'rrect;rSize=0;fontSize=17;fontColor=#666666;fontStyle=1;fillColor=none;strokeColor=#666666;resizeWidth=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(0, 50);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Button 3', new mxGeometry(0, 0, 120, 50), s2 + 'rrect;rSize=0;fontSize=17;fontColor=#666666;fontStyle=1;fillColor=none;strokeColor=#666666;resizeWidth=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(0, 100);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Button 4', new mxGeometry(0, 1, 120, 50), s2 + 'bottomButton;rSize=10;fontSize=17;fontColor=#666666;fontStyle=1;fillColor=none;strokeColor=#666666;resizeWidth=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(0, -50);
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button1 = new mxCell('Button 1', new mxGeometry(0, 0, 120, 50), s2 + 'topButton;rSize=10;fontSize=17;fontColor=#ffffff;fontStyle=1;fillColor=#008cff;strokeColor=none;resizeWidth=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Vertical Button Bar');
			}),

			this.createVertexTemplateEntry(s2 + 'buttons.onOffButton;fillColor=#ffffff;gradientColor=none;' + skcl9 + 'buttonState=on;fillColor2=#008cff;fontColor=#ffffff;fontSize=17;mainText=;spacingRight=40;fontStyle=1;',
					150, 50, 'ON', 'On-off button', null, null, this.getTagsForStencil(gn, 'onOffButton', dt + 'on off').join(' '))
		];
			
		this.addPalette('mockupButtons', 'Mockup Buttons', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMockupContainersPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
		
		var gn = 'mxgraph.mockup.containers';
		var dt = 'mockup container ';

		var fns =
		[
			this.createVertexTemplateEntry(s + 'containers.videoPlayer;' + skcl6 + 'strokeColor2=#008cff;strokeColor3=#c4c4c4;textColor=#666666;' + flclf + 'fillColor2=#008cff;barHeight=30;barPos=20;',
										300, 200, '', 'Video Player', null, null, this.getTagsForStencil(gn, 'videoPlayer', dt).join(' ')),
			
			this.addEntry(dt + 'accordion', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 100, 220), s2 + 'containers.rrect;rSize=0;fillColor=#ffffff;strokeColor=#666666;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Group 1', new mxGeometry(0, 0, 100, 26), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#666666;fontStyle=1;fillColor=none;strokeColor=none;resizeWidth=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Group 2', new mxGeometry(0, 0, 100, 26), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#666666;fontStyle=1;fillColor=none;strokeColor=#666666;resizeWidth=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(0, 26);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Group 3', new mxGeometry(0, 0, 100, 26), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#ffffff;fontStyle=1;fillColor=#008cff;strokeColor=#008cff;resizeWidth=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(0, 52);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Group 4', new mxGeometry(0, 1, 100, 26), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#666666;fontStyle=1;fillColor=none;strokeColor=#666666;resizeWidth=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(0, -26);
			   	button4.vertex = true;
			   	bg.insert(button4);

		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Accordion');
			}),

			this.addEntry(dt + 'browser window', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 550, 380), s2 + 'containers.browserWindow;rSize=0;fillColor=#ffffff;strokeColor=#666666;mainText=,;recursiveResize=0;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Page 1', new mxGeometry(60, 12, 110, 26), s2 + 'containers.anchor;fontSize=17;fontColor=#666666;align=left;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('https:\\\\draw.io', new mxGeometry(130, 60, 250, 26), s2 + 'containers.anchor;rSize=0;fontSize=17;fontColor=#666666;align=left;');
			   	button2.vertex = true;
			   	bg.insert(button2);

		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Browser Window');
			}),

		   	this.createVertexTemplateEntry(s + 'containers.userMale;' + skcl6 + 'strokeColor2=#008cff;' + flclf,
										100, 100, '', 'User, Male', null, null, this.getTagsForStencil(gn, 'userMale', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'containers.userFemale;' + skcl6 + 'strokeColor2=#008cff;' + flclf,
										100, 100, '', 'User, Female', null, null, this.getTagsForStencil(gn, 'userFemale', dt).join(' ')),
					
			this.addEntry(dt + 'group', function()
			{
				var area1 = new mxCell('', new mxGeometry(0, 0, 150, 200), 'shape=mxgraph.mockup.containers.marginRect;rectMarginTop=10;strokeColor=#666666;fillColor=#ffffff;strokeWidth=1;dashed=0;rounded=1;arcSize=5;recursiveResize=0;');
				area1.vertex = true;
				var button1 = new mxCell('Group', new mxGeometry(5, 0, 90, 30), 'shape=rect;strokeColor=none;fillColor=#008cff;strokeWidth=1;dashed=0;rounded=1;arcSize=20;fontColor=#ffffff;fontSize=17;spacing=2;spacingTop=-2;align=left;autosize=1;spacingLeft=4;resizeWidth=0;resizeHeight=0;perimeter=none;');
				button1.vertex = true;
				area1.insert(button1);
				
				return sb.createVertexTemplateFromCells([area1], 150, 200, 'Group');
			}),
			
			this.createVertexTemplateEntry(s2 + 'containers.window;align=left;verticalAlign=top;spacingLeft=8;strokeColor2=#008cff;strokeColor3=#c4c4c4;fontColor=#666666;' + flclf + 'mainText=;fontSize=17;labelBackgroundColor=none;',
										550, 380, 'Window Title', 'Window', null, null, this.getTagsForStencil(gn, 'window', dt).join(' ')),

			this.addEntry(dt + 'horizontal tab bar', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 400, 200), s2 + 'containers.marginRect2;rectMarginTop=32;strokeColor=#666666;fillColor=#ffffff;gradientColor=none;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Tab 1', new mxGeometry(0, 0, 60, 25), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#666666;fillColor=#ffffff;gradientColor=none;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(10, 0);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Tab 2', new mxGeometry(0, 0, 60, 25), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#ffffff;strokeColor=#008cff;fillColor=#008cff;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(75, 0);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Tab 3', new mxGeometry(0, 0, 60, 25), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#666666;fillColor=#ffffff;gradientColor=none;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(140, 0);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 400, 7), s2 + 'containers.topButton;rSize=5;strokeColor=#008cff;fillColor=#008cff;gradientColor=none;resizeWidth=1;movable=0;deletable=1;');
			   	bg2.vertex = true;
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(0, 25);
			   	bg.insert(bg2);
	
		   		return sb.createVertexTemplateFromCells([bg], 400, 200, 'Horizontal Tab Bar');
			}),

			this.addEntry(dt + 'vertical tab bar', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 400, 200), s2 + 'containers.marginRect2;rectMarginLeft=67;strokeColor=#666666;fillColor=#ffffff;gradientColor=none;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Tab 1', new mxGeometry(0, 0, 60, 25), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#666666;fillColor=#ffffff;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(0, 10);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Tab 2', new mxGeometry(0, 0, 60, 25), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#ffffff;strokeColor=#008cff;fillColor=#008cff;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(0, 40);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Tab 3', new mxGeometry(0, 0, 60, 25), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#666666;fillColor=#ffffff;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(0, 70);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var bg2 = new mxCell('', new mxGeometry(0, 0, 7, 200), s2 + 'containers.leftButton;rSize=5;strokeColor=#008cff;fillColor=#008cff;resizeHeight=1;movable=0;deletable=0;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(60, 0);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
				
		   		return sb.createVertexTemplateFromCells([bg], 400, 200, 'Vertical Tab Bar');
			}),

			this.addEntry(dt + 'dialog box', function()
			{
			   	var bg = new mxCell(
			   			'Some default\ndialog\ntext.', 
			   			new mxGeometry(0, 0, 250, 140), s2 + 'containers.rrect;rSize=0;strokeColor=#666666;fontColor=#666666;fontSize=17;verticalAlign=top;whiteSpace=wrap;fillColor=#ffffff;spacingTop=32;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Dialog Title', new mxGeometry(0, 0, 250, 30), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#666666;align=left;spacingLeft=8;fillColor=none;resizeWidth=1;');
			   	text1.geometry.relative = true;
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var button1 = new mxCell('', new mxGeometry(1, 0.5, 20, 20), 'shape=ellipse;strokeColor=#008cff;resizable=0;fillColor=none;html=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-25, -10);
			   	button1.vertex = true;
			   	text1.insert(button1);
			   	var button2 = new mxCell('Cancel', new mxGeometry(0.25, 1, 90, 25), s2 + 'containers.rrect;rSize=0;fontSize=16;fontColor=#666666;strokeColor=#c4c4c4;whiteSpace=wrap;fillColor=none;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(-45, -33);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('OK', new mxGeometry(0.75, 1, 90, 25), s2 + 'containers.rrect;rSize=0;fontSize=16;fontColor=#666666;strokeColor=#c4c4c4;whiteSpace=wrap;fillColor=none;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(-45, -33);
			   	button3.vertex = true;
			   	bg.insert(button3);
			
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dialog Box');
			}),

			this.addEntry(dt + 'dialog box', function()
			{
			   	var bg = new mxCell(
			   			'Some default\nmessage\ntext.', 
			   			new mxGeometry(0, 0, 250, 160), s2 + 'containers.rrect;rSize=0;strokeColor=#666666;fontColor=#666666;fontSize=17;verticalAlign=top;whiteSpace=wrap;fillColor=#ffffff;spacingTop=32;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Message Title', new mxGeometry(0, 0, 250, 30), s2 + 'containers.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#666666;align=left;spacingLeft=8;fillColor=#ffffff;resizeWidth=1;');
			   	text1.geometry.relative = true;
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var button1 = new mxCell('', new mxGeometry(1, 0.5, 20, 20), 'shape=ellipse;strokeColor=#008cff;resizable=0;fillColor=none;html=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-25, -10);
			   	button1.vertex = true;
			   	text1.insert(button1);
			   	var button2 = new mxCell('OK', new mxGeometry(0.5, 1, 120, 25), s2 + 'containers.rrect;rSize=0;fontSize=16;fontColor=#666666;strokeColor=#c4c4c4;resizable=0;whiteSpace=wrap;fillColor=#ffffff;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(-60, -33);
			   	button2.vertex = true;
			   	bg.insert(button2);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dialog Box');
			})
		];
	
		this.addPalette('mockupContainers', 'Mockup Containers', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMockupFormsPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
		
		var gn = 'mxgraph.mockup.forms';
		var dt = 'mockup form ';

		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'forms.rrect;rSize=0;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;', 15, 15, 
					'Option 1', 'Checkbox', null, null, this.getTagsForStencil(gn, 'checkbox', dt).join(' ')),

			this.addEntry(dt + 'checkbox checkboxes', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 150, 120), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fillColor=#ffffff;recursiveResize=0;');
			   	bg.vertex = true;
			   	var radio1 = new mxCell('Option 1', new mxGeometry(8, 7.5, 15, 15), s2 + 'forms.rrect;rSize=0;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;');
			   	radio1.vertex = true;
			   	bg.insert(radio1);
			   	var radio2 = new mxCell('Option 2', new mxGeometry(8, 37.5, 15, 15), s2 + 'forms.rrect;rSize=0;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;');
			   	radio2.vertex = true;
			   	bg.insert(radio2);
			   	var radio3 = new mxCell('Option 3', new mxGeometry(8, 67.5, 15, 15), s2 + 'forms.checkbox;rSize=0;resizable=0;fillColor=#aaaaaa;strokeColor=#444444;gradientColor=#666666;align=left;spacingLeft=4;fontSize=17;fontColor=#008cff;labelPosition=right;');
			   	radio3.vertex = true;
			   	bg.insert(radio3);
			   	var radio4 = new mxCell('Option 4', new mxGeometry(8, 97.5, 15, 15), s2 + 'forms.rrect;rSize=0;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;');
			   	radio4.vertex = true;
			   	bg.insert(radio4);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Checkboxes');
			}),
			
			this.createVertexTemplateEntry('shape=ellipse;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;html=1;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;shadow=0;', 15, 15, 
					'Setting 1', 'Radiobutton', null, null, this.getTagsForStencil(gn, 'radiobutton radio button', dt).join(' ')),
					
			this.addEntry(dt + 'radiobutton radio button group', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 150, 120), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fillColor=#ffffff;recursiveResize=0;');
			   	bg.vertex = true;
			   	var radio1 = new mxCell('Setting 1', new mxGeometry(8, 7.5, 15, 15), 'shape=ellipse;rSize=0;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;html=1;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;');
			   	radio1.vertex = true;
			   	bg.insert(radio1);
			   	var radio2 = new mxCell('Setting 2', new mxGeometry(8, 37.5, 15, 15), 'shape=ellipse;rSize=0;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;html=1;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;');
			   	radio2.vertex = true;
			   	bg.insert(radio2);
			   	var radio3 = new mxCell('Setting 3', new mxGeometry(8, 67.5, 15, 15), 'shape=ellipse;rSize=0;fillColor=#aaaaaa;strokeColor=#444444;gradientColor=#666666;html=1;align=left;spacingLeft=4;fontSize=17;fontColor=#008cff;labelPosition=right;');
			   	radio3.vertex = true;
			   	bg.insert(radio3);
			   	var radio3a = new mxCell('', new mxGeometry(3, 3, 9, 9), 'shape=ellipse;fillColor=#444444;strokeColor=none;html=1;');
			   	radio3a.vertex = true;
			   	radio3.insert(radio3a);
			   	var radio4 = new mxCell('Setting 4', new mxGeometry(8, 97.5, 15, 15), 'shape=ellipse;rSize=0;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;html=1;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;');
			   	radio4.vertex = true;
			   	bg.insert(radio4);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Radiobutton Group');
			}),
			
			this.createVertexTemplateEntry(s + 'forms.colorPicker;chosenColor=#aaddff;fillColor=#ffffff;', 40, 40, '', 'Color Picker', null, null, this.getTagsForStencil(gn, 'colorPicker', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'forms.comboBox;' + skcl9 + mxConstants.STYLE_FILLCOLOR + '=#ddeeff;align=left;fillColor2=#aaddff;mainText=;fontColor=#666666;fontSize=17;spacingLeft=3;',
										150, 30, 'Option 1', 'Combo Box', null, null, this.getTagsForStencil(gn, 'comboBox', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'forms.spinner;' + skcl9 + 'spinLayout=right;spinStyle=normal;adjStyle=triangle;fillColor=#aaddff;fontSize=17;fontColor=#666666;mainText=;html=1;overflow=fill;',
										150, 60, 
										'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;">' +
										'<tr>' +
										'<td style="width:85%">100</td>' +
										'<td style="width:15%"></td>' +
										'</tr>' +
										'</table>', 
										'Spinner', null, null, this.getTagsForStencil(gn, 'spinner', dt).join(' ')),

			this.addEntry(dt + 'menu bar', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 498, 30), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('File', new mxGeometry(0, 0, 83, 30), s2 + 'forms.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#999999;fillColor=none;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Edit', new mxGeometry(83, 0, 83, 30), s2 + 'forms.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#999999;fillColor=none;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Options', new mxGeometry(166, 0, 83, 30), s2 + 'forms.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#999999;fillColor=none;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Tools', new mxGeometry(249, 0, 83, 30), s2 + 'forms.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#999999;fillColor=none;');
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button5 = new mxCell('Window', new mxGeometry(332, 0, 83, 30), s2 + 'forms.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#999999;fillColor=none;');
			   	button5.vertex = true;
			   	bg.insert(button5);
			   	var button6 = new mxCell('Help', new mxGeometry(415, 0, 83, 30), s2 + 'forms.rrect;rSize=0;fontSize=17;fontColor=#666666;strokeColor=#999999;fillColor=none;');
			   	button6.vertex = true;
			   	bg.insert(button6);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Menu Bar');
			}),
			
			this.createVertexTemplateEntry(s + 'forms.horSlider;' + skcl9 + flclf + 'sliderStyle=basic;sliderPos=20;handleStyle=circle;fillColor2=#ddeeff;',
										150, 30, '', 'Horizontal Slider', null, null, this.getTagsForStencil(gn, 'horSlider', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s + 'forms.horSlider;' + skcl9 + flclf + 'sliderStyle=basic;sliderPos=20;handleStyle=circle;fillColor2=#ddeeff;direction=north;',
										30, 150, '', 'Vertical Slider', null, null, this.getTagsForStencil(gn, 'horSlider', dt + 'vertical').join(' ')),

			this.addEntry(dt + 'list box', function()
			{
			   	var bg2 = new mxCell('', new mxGeometry(0, 00, 150, 200), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fillColor=#ffffff;');
			   	bg2.vertex = true;
			   	var bg = new mxCell('Title', new mxGeometry(0, 0, 150, 30), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#008cff;fontSize=17;fillColor=#ffffff;resizeWidth=1;');
			   	bg.geometry.relative = true;
			   	bg.vertex = true;
			   	bg2.insert(bg);
			   	var button1 = new mxCell('Item 1', new mxGeometry(0, 0, 150, 20), s2 + 'forms.anchor;fontSize=17;fontColor=#666666;align=left;spacingLeft=5;resizeWidth=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(0, 30);
			   	button1.vertex = true;
			   	bg2.insert(button1);
			   	var button2 = new mxCell('Item 2', new mxGeometry(0, 0, 150, 20), s2 + 'forms.anchor;fontSize=17;fontColor=#666666;align=left;spacingLeft=5;resizeWidth=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(0, 50);
			   	button2.vertex = true;
			   	bg2.insert(button2);
			   	var button3 = new mxCell('Item 3', new mxGeometry(0, 0, 150, 20), s2 + 'forms.rrect;rSize=0;fontSize=17;fontColor=#666666;align=left;spacingLeft=5;fillColor=#ddeeff;strokeColor=none;resizeWidth=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(0, 70);
			   	button3.vertex = true;
			   	bg2.insert(button3);
			   	var button4 = new mxCell('Item 4', new mxGeometry(0, 0, 150, 20), s2 + 'forms.anchor;fontSize=17;fontColor=#666666;align=left;spacingLeft=5;resizeWidth=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(0, 90);
			   	button4.vertex = true;
			   	bg2.insert(button4);
				
		   		return sb.createVertexTemplateFromCells([bg2], 150, 200, 'List Box');
			}),
			
			this.createVertexTemplateEntry(s2 + 'forms.pwField;' + skcl9 + 'mainText=;align=left;fillColor=#ffffff;fontColor=#666666;fontSize=17;spacingLeft=3;', 150, 30, '********', 'Password Field', null, null, this.getTagsForStencil(gn, 'pwField', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'forms.splitter;fillColor=#ffffff;' + skcl9, 350, 10, '', 'Horizontal Splitter', null, null, this.getTagsForStencil(gn, 'splitter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'forms.splitter;fillColor=#ffffff;' + skcl9 + mxConstants.STYLE_DIRECTION + '=' + mxConstants.DIRECTION_NORTH + ';', 10, 350, '', 'Vertical Splitter', null, null, this.getTagsForStencil(gn, 'splitter', dt).join(' ')),

			this.addEntry(dt + 'wedge bar', function()
			{
			   	var button1 = new mxCell('Tab 1', new mxGeometry(10, 0, 70, 30), s2 + 'forms.uRect;fontSize=17;fontColor=#666666;align=left;spacingLeft=5;strokeColor=#666666;fillColor=#ffffff;');
			   	button1.vertex = true;
			   	var button2 = new mxCell('Tab 2', new mxGeometry(85, 0, 70, 30), s2 + 'forms.uRect;fontSize=17;fontColor=#ffffff;align=left;spacingLeft=5;strokeColor=#008cff;fillColor=#008cff;');
			   	button2.vertex = true;
			   	var button3 = new mxCell('Tab 3', new mxGeometry(160, 0, 70, 30), s2 + 'forms.uRect;fontSize=17;fontColor=#666666;align=left;spacingLeft=5;strokeColor=#666666;fillColor=#ffffff;');
			   	button3.vertex = true;
				
		   		return sb.createVertexTemplateFromCells([button1, button2, button3], 230, 30, 'Wedge Bar');
			}),
			
			this.createVertexTemplateEntry(s + 'menus_and_buttons.font_style_selector_1;', 136, 31, '', 'Formatting Toolbar 1', null, null, this.getTagsForStencil('mxgraph.mockup.menus_and_buttons', 'font_style_selector_1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'menus_and_buttons.font_style_selector_2;', 235, 31, '', 'Formatting Toolbar 2', null, null, this.getTagsForStencil('mxgraph.mockup.menus_and_buttons', 'font_style_selector_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'menus_and_buttons.font_style_selector_3;', 176, 38, '', 'Formatting Toolbar 3', null, null, this.getTagsForStencil('mxgraph.mockup.menus_and_buttons', 'font_style_selector_3', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'forms.searchBox;' + skcl9 + 'mainText=;fillColor=#ffffff;strokeColor2=#008cff;fontColor=#666666;fontSize=17;align=left;spacingLeft=3;',
										150, 30, 'Search', 'Search Box', null, null, this.getTagsForStencil(gn, 'searchBox', dt).join(' ')),

			this.addEntry(dt + 'sign in', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 200, 300), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Sign In', new mxGeometry(0, 0, 100, 20), s2 + 'forms.anchor;fontSize=12;fontColor=#666666;align=left;resizeWidth=1;spacingLeft=0;');
			   	text1.geometry.relative = true;
			   	text1.geometry.offset = new mxPoint(10, 10);
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var button1 = new mxCell('', new mxGeometry(0, 0, 180, 10), 'shape=line;strokeColor=#ddeeff;strokeWidth=2;html=1;resizeWidth=1;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(10, 30);
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var text2 = new mxCell('User Name:', new mxGeometry(0, 0, 100, 20), s2 + 'forms.anchor;fontSize=12;fontColor=#666666;align=left;resizeWidth=1;spacingLeft=0;');
			   	text2.geometry.relative = true;
			   	text2.geometry.offset = new mxPoint(10, 40);
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var button2 = new mxCell('johndoe', new mxGeometry(0, 0, 150, 25), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;align=left;spacingLeft=5;resizeWidth=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(10, 60);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var text3 = new mxCell('Password:', new mxGeometry(0, 0, 100, 20), s2 + 'forms.anchor;fontSize=12;fontColor=#666666;align=left;resizeWidth=1;spacingLeft=0;');
			   	text3.geometry.relative = true;
			   	text3.geometry.offset = new mxPoint(10, 95);
			   	text3.vertex = true;
			   	bg.insert(text3);
			   	var button3 = new mxCell('********', new mxGeometry(0, 0, 150, 25), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;align=left;spacingLeft=5;resizeWidth=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(10, 115);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('SIGN IN', new mxGeometry(0, 1, 80, 30), s2 + 'forms.rrect;rSize=5;strokeColor=none;fontColor=#ffffff;fillColor=#66bbff;fontSize=16;fontStyle=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(20, -150);
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var text4 = new mxCell('Forgot Password?', new mxGeometry(0, 1, 150, 20), s2 + 'forms.anchor;fontSize=12;fontColor=#9999ff;align=left;spacingLeft=0;fontStyle=4;resizeWidth=1;');
			   	text4.geometry.relative = true;
			   	text4.geometry.offset = new mxPoint(10, -110);
			   	text4.vertex = true;
			   	bg.insert(text4);
			   	var button5 = new mxCell('', new mxGeometry(0, 1, 180, 10), 'shape=line;strokeColor=#ddeeff;strokeWidth=2;html=1;resizeWidth=1;');
			   	button5.geometry.relative = true;
			   	button5.geometry.offset = new mxPoint(10, -90);
			   	button5.vertex = true;
			   	bg.insert(button5);
			   	var text5 = new mxCell('New User', new mxGeometry(0, 1, 150, 20), s2 + 'forms.anchor;fontSize=12;fontColor=#666666;align=left;spacingLeft=0;resizeWidth=1;');
			   	text5.geometry.relative = true;
			   	text5.geometry.offset = new mxPoint(10, -70);
			   	text5.vertex = true;
			   	bg.insert(text5);
			   	var button6 = new mxCell('SIGN UP', new mxGeometry(0, 1, 80, 30), s2 + 'forms.rrect;rSize=5;strokeColor=none;fontColor=#ffffff;fillColor=#66bbff;fontSize=16;fontStyle=1;');
			   	button6.geometry.relative = true;
			   	button6.geometry.offset = new mxPoint(20, -50);
			   	button6.vertex = true;
			   	bg.insert(button6);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Sign In');
			}),
			
			this.addEntry(dt + 'calendar date', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 160, 175), s2 + 'forms.rrect;rSize=5;strokeColor=#999999;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('October 2014', new mxGeometry(30, 8, 100, 20), s2 + 'forms.anchor;fontColor=#999999;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var button1 = new mxCell('<', new mxGeometry(8, 8, 25, 20), s2 + 'forms.rrect;rSize=4;strokeColor=#999999;fontColor=#008cff;fontSize=19;fontStyle=1;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('>', new mxGeometry(127, 8, 25, 20), s2 + 'forms.rrect;rSize=4;strokeColor=#999999;fontColor=#008cff;fontSize=19;fontStyle=1;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var text2 = new mxCell('Mo', new mxGeometry(10, 28, 20, 20), s2 + 'forms.anchor;fontColor=#999999;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var text3 = new mxCell('Tu', new mxGeometry(30, 28, 20, 20), s2 + 'forms.anchor;fontColor=#999999;');
			   	text3.vertex = true;
			   	bg.insert(text3);
			   	var text4 = new mxCell('We', new mxGeometry(50, 28, 20, 20), s2 + 'forms.anchor;fontColor=#999999;');
			   	text4.vertex = true;
			   	bg.insert(text4);
			   	var text5 = new mxCell('Th', new mxGeometry(70, 28, 20, 20), s2 + 'forms.anchor;fontColor=#999999;');
			   	text5.vertex = true;
			   	bg.insert(text5);
			   	var text6 = new mxCell('Fr', new mxGeometry(90, 28, 20, 20), s2 + 'forms.anchor;fontColor=#999999;');
			   	text6.vertex = true;
			   	bg.insert(text6);
			   	var text7 = new mxCell('Sa', new mxGeometry(110, 28, 20, 20), s2 + 'forms.anchor;fontColor=#999999;');
			   	text7.vertex = true;
			   	bg.insert(text7);
			   	var text8 = new mxCell('Su', new mxGeometry(130, 28, 20, 20), s2 + 'forms.anchor;fontColor=#999999;');
			   	text8.vertex = true;
			   	bg.insert(text8);
			   	var button3 = new mxCell('1', new mxGeometry(10, 48, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('2', new mxGeometry(30, 48, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button5 = new mxCell('3', new mxGeometry(50, 48, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button5.vertex = true;
			   	bg.insert(button5);
			   	var button6 = new mxCell('4', new mxGeometry(70, 48, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button6.vertex = true;
			   	bg.insert(button6);
			   	var button7 = new mxCell('5', new mxGeometry(90, 48, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button7.vertex = true;
			   	bg.insert(button7);
			   	var button8 = new mxCell('6', new mxGeometry(110, 48, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button8.vertex = true;
			   	bg.insert(button8);
			   	var button9 = new mxCell('7', new mxGeometry(130, 48, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button9.vertex = true;
			   	bg.insert(button9);
			   	var button10 = new mxCell('8', new mxGeometry(10, 68, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button10.vertex = true;
			   	bg.insert(button10);
			   	var button11 = new mxCell('9', new mxGeometry(30, 68, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button11.vertex = true;
			   	bg.insert(button11);
			   	var button12 = new mxCell('10', new mxGeometry(50, 68, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button12.vertex = true;
			   	bg.insert(button12);
			   	var button13 = new mxCell('11', new mxGeometry(70, 68, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button13.vertex = true;
			   	bg.insert(button13);
			   	var button14 = new mxCell('12', new mxGeometry(90, 68, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button14.vertex = true;
			   	bg.insert(button14);
			   	var button15 = new mxCell('13', new mxGeometry(110, 68, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button15.vertex = true;
			   	bg.insert(button15);
			   	var button16 = new mxCell('14', new mxGeometry(130, 68, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button16.vertex = true;
			   	bg.insert(button16);
			   	var button17 = new mxCell('15', new mxGeometry(10, 88, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button17.vertex = true;
			   	bg.insert(button17);
			   	var button18 = new mxCell('16', new mxGeometry(30, 88, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button18.vertex = true;
			   	bg.insert(button18);
			   	var button19 = new mxCell('17', new mxGeometry(50, 88, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button19.vertex = true;
			   	bg.insert(button19);
			   	var button20 = new mxCell('18', new mxGeometry(70, 88, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button20.vertex = true;
			   	bg.insert(button20);
			   	var button21 = new mxCell('19', new mxGeometry(90, 88, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button21.vertex = true;
			   	bg.insert(button21);
			   	var button22 = new mxCell('20', new mxGeometry(110, 88, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button22.vertex = true;
			   	bg.insert(button22);
			   	var button23 = new mxCell('21', new mxGeometry(130, 88, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button23.vertex = true;
			   	bg.insert(button23);
			   	var button24 = new mxCell('22', new mxGeometry(10, 108, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button24.vertex = true;
			   	bg.insert(button24);
			   	var button25 = new mxCell('23', new mxGeometry(30, 108, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button25.vertex = true;
			   	bg.insert(button25);
			   	var button27 = new mxCell('25', new mxGeometry(70, 108, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button27.vertex = true;
			   	bg.insert(button27);
			   	var button28 = new mxCell('26', new mxGeometry(90, 108, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button28.vertex = true;
			   	bg.insert(button28);
			   	var button29 = new mxCell('27', new mxGeometry(110, 108, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button29.vertex = true;
			   	bg.insert(button29);
			   	var button30 = new mxCell('28', new mxGeometry(130, 108, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button30.vertex = true;
			   	bg.insert(button30);
			   	var button31 = new mxCell('29', new mxGeometry(10, 128, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button31.vertex = true;
			   	bg.insert(button31);
			   	var button32 = new mxCell('30', new mxGeometry(30, 128, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button32.vertex = true;
			   	bg.insert(button32);
			   	var button33 = new mxCell('31', new mxGeometry(50, 128, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;');
			   	button33.vertex = true;
			   	bg.insert(button33);
			   	var button34 = new mxCell('1', new mxGeometry(70, 128, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button34.vertex = true;
			   	bg.insert(button34);
			   	var button35 = new mxCell('2', new mxGeometry(90, 128, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button35.vertex = true;
			   	bg.insert(button35);
			   	var button36 = new mxCell('3', new mxGeometry(110, 128, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button36.vertex = true;
			   	bg.insert(button36);
			   	var button37 = new mxCell('4', new mxGeometry(130, 128, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button37.vertex = true;
			   	bg.insert(button37);
			   	var button38 = new mxCell('5', new mxGeometry(10, 148, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button38.vertex = true;
			   	bg.insert(button38);
			   	var button39 = new mxCell('6', new mxGeometry(30, 148, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button39.vertex = true;
			   	bg.insert(button39);
			   	var button40 = new mxCell('7', new mxGeometry(50, 148, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button40.vertex = true;
			   	bg.insert(button40);
			   	var button41 = new mxCell('8', new mxGeometry(70, 148, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button41.vertex = true;
			   	bg.insert(button41);
			   	var button42 = new mxCell('9', new mxGeometry(90, 148, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button42.vertex = true;
			   	bg.insert(button42);
			   	var button43 = new mxCell('10', new mxGeometry(110, 148, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button43.vertex = true;
			   	bg.insert(button43);
			   	var button44 = new mxCell('11', new mxGeometry(130, 148, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#999999;fontColor=#999999;fillColor=#ddeeff;');
			   	button44.vertex = true;
			   	bg.insert(button44);
			   	var button26 = new mxCell('24', new mxGeometry(50, 108, 20, 20), s2 + 'forms.rrect;rSize=0;strokeColor=#ff0000;fontColor=#ffffff;strokeWidth=2;fillColor=#008cff;');
			   	button26.vertex = true;
			   	bg.insert(button26);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Calendar');
			}),
			
			this.addEntry(dt + 'email', function()
			{
			   	var text1 = new mxCell('From', new mxGeometry(0, 0, 50, 18), s2 + 'forms.anchor;align=right;spacingRight=2;fontColor=#666666;');
			   	text1.vertex = true;
			   	var button1 = new mxCell('john@jgraph.com', new mxGeometry(50, 0, 350, 18), s2 + 'forms.rrect;fillColor=#ffffff;rSize=0;fontColor=#666666;align=left;spacingLeft=3;strokeColor=#999999;');
			   	button1.vertex = true;
			   	var text2 = new mxCell('Subject', new mxGeometry(0, 35, 50, 18), s2 + 'forms.anchor;align=right;spacingRight=2;fontColor=#666666;');
			   	text2.vertex = true;
			   	var button2 = new mxCell('Greeting', new mxGeometry(50, 35, 350, 18), s2 + 'forms.rrect;fillColor=#ffffff;rSize=0;fontColor=#666666;align=left;spacingLeft=3;strokeColor=#999999;');
			   	button2.vertex = true;
			   	var text3 = new mxCell('To', new mxGeometry(0, 70, 50, 18), s2 + 'forms.anchor;align=right;spacingRight=2;fontColor=#666666;');
			   	text3.vertex = true;
			   	var button3 = new mxCell('fred@jgraph.com', new mxGeometry(50, 70, 350, 18), s2 + 'forms.rrect;fillColor=#ffffff;rSize=0;fontColor=#666666;align=left;spacingLeft=3;strokeColor=#999999;');
			   	button3.vertex = true;
			   	var text4 = new mxCell('CC', new mxGeometry(0, 105, 50, 18), s2 + 'forms.anchor;align=right;spacingRight=2;fontColor=#666666;');
			   	text4.vertex = true;
			   	var button4 = new mxCell('', new mxGeometry(50, 105, 350, 18), s2 + 'forms.rrect;fillColor=#ffffff;rSize=0;fontColor=#666666;align=left;spacingLeft=3;strokeColor=#999999;');
			   	button4.vertex = true;
			   	var text5 = new mxCell('BCC', new mxGeometry(0, 140, 50, 18), s2 + 'forms.anchor;align=right;spacingRight=2;fontColor=#666666;');
			   	text5.vertex = true;
			   	var button5 = new mxCell('', new mxGeometry(50, 140, 350, 18), s2 + 'forms.rrect;fillColor=#ffffff;rSize=0;fontColor=#666666;align=left;spacingLeft=3;strokeColor=#999999;');
			   	button5.vertex = true;
			   	var button6 = new mxCell(
			   			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco ' + 
			   			'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat ' + 
			   			'non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			   			new mxGeometry(0, 175, 400, 125), s2 + 'forms.rrect;fillColor=#ffffff;rSize=0;fontColor=#666666;align=left;spacingLeft=3;strokeColor=#999999;verticalAlign=top;whiteSpace=wrap;');
			   	button6.vertex = true;
				
		   		return sb.createVertexTemplateFromCells([text1, button1, text2, button2, text3, button3, text4, button4, text5, button5, button6], 400, 300, 'Email');
			})
		];			
		
		this.addPalette('mockupForms', 'Mockup Forms', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addMockupGraphicsPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.graphics';
		var dt = 'mockup graphics ';

		var fns =
		[
			this.createVertexTemplateEntry(s + 'graphics.barChart;' + flclf +  skclN + 'strokeColor2=none;strokeColor3=#666666;fillColor2=#008cff;fillColor3=#dddddd;',
					400, 200, '', 'Bar Chart', null, null, this.getTagsForStencil(gn, 'barChart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'graphics.columnChart;' + flclf +  skclN + 'strokeColor2=none;strokeColor3=#666666;fillColor2=#008cff;fillColor3=#dddddd;',
					400, 200, '', 'Column Chart', null, null, this.getTagsForStencil(gn, 'columnChart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'graphics.lineChart;' + flclf +  skclN + 'strokeColor2=#666666;strokeColor3=#008cff;strokeColor4=#dddddd;',
					400, 200, '', 'Line Chart', null, null, this.getTagsForStencil(gn, 'lineChart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'graphics.pieChart;' +  mxConstants.STYLE_STROKECOLOR + '=#008cff;parts=10,20,35;partColors=#e0e0e0,#d0d0d0,#c0c0c0,#b0b0b0,#a0a0a0;strokeWidth=2;',
					200, 200, '', 'Pie Chart', null, null, this.getTagsForStencil(gn, 'pieChart', dt).join(' ')),
			
			this.createVertexTemplateEntry(s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;', 
					50, 50, '', 'Icon Placeholder', null, null, this.getTagsForStencil(gn, 'simpleIcon', dt + 'icon placeholder').join(' ')),
			
			this.addEntry(dt + 'icon grid placeholder', function()
			{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 50, 50), s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(75, 0, 50, 50), s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;');
			   	bg2.vertex = true;
			   	var bg3 = new mxCell('', new mxGeometry(150, 0, 50, 50), s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;');
			   	bg3.vertex = true;
			   	var bg4 = new mxCell('', new mxGeometry(0, 75, 50, 50), s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;');
			   	bg4.vertex = true;
			   	var bg5 = new mxCell('', new mxGeometry(75, 75, 50, 50), s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;');
			   	bg5.vertex = true;
			   	var bg6 = new mxCell('', new mxGeometry(150, 75, 50, 50), s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;');
			   	bg6.vertex = true;
			   	var bg7 = new mxCell('', new mxGeometry(0, 150, 50, 50), s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;');
			   	bg7.vertex = true;
			   	var bg8 = new mxCell('', new mxGeometry(75, 150, 50, 50), s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;');
			   	bg8.vertex = true;
			   	var bg9 = new mxCell('', new mxGeometry(150, 150, 50, 50), s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;');
			   	bg9.vertex = true;
			
		   		return sb.createVertexTemplateFromCells([bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9], 200, 200, 'Icon Grid');
			}),
	
			this.createVertexTemplateEntry(s + 'graphics.bubbleChart;' + flclf +  skclN + 'strokeColor2=none;strokeColor3=#666666;fillColor2=#008cff;fillColor3=#dddddd;',
										400, 200, '', 'Bubble Chart', null, null, this.getTagsForStencil(gn, 'bubbleChart', dt + 'bubble chart').join(' ')),
	
			this.addEntry(dt + 'gauge', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 100, 100), s + 'graphics.gauge;fillColor=#ffffff;strokeColor=#999999;gaugePos=25;scaleColors=#bbddff,#ddeeff,#99ccff;gaugeLabels=,,;needleColor=#008cff;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('CPU[%]', new mxGeometry(25, 20, 50, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('0', new mxGeometry(20, 75, 50, 20), s2 + 'graphics.anchor;align=left;fontColor=#666666;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var text3 = new mxCell('100', new mxGeometry(30, 75, 50, 20), s2 + 'graphics.anchor;align=right;fontColor=#666666;');
			   	text3.vertex = true;
			   	bg.insert(text3);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Gauge');
			}),
			
			this.createVertexTemplateEntry(s + 'graphics.plotChart;' + flclf +  mxConstants.STYLE_STROKECOLOR + '=none;strokeColor2=#aaaaaa;strokeColor3=#666666;fillColor2=#99aaff,#0022ff,#008cff;',
										400, 200, '', 'Plot Chart', null, null, this.getTagsForStencil(gn, 'plotChart', dt + 'plot chart').join(' ')),
			
			this.addEntry(dt + 'gantt chart', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 600, 300), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;');
			   	bg.vertex = true;
			   	var cell1 = new mxCell('#', new mxGeometry(0, 0, 20, 40), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell1.vertex = true;
			   	bg.insert(cell1);
			   	var cell2 = new mxCell('Task', new mxGeometry(20, 0, 40, 40), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell2.vertex = true;
			   	bg.insert(cell2);
			   	var cell3 = new mxCell('Start', new mxGeometry(60, 0, 130, 40), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell3.vertex = true;
			   	bg.insert(cell3);
			   	var cell4 = new mxCell('Effort', new mxGeometry(190, 0, 50, 40), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell4.vertex = true;
			   	bg.insert(cell4);
			   	var cell5 = new mxCell('20//10//2014', new mxGeometry(240, 0, 210, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell5.vertex = true;
			   	bg.insert(cell5);
			   	var cell6 = new mxCell('27//10//2014', new mxGeometry(450, 0, 150, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell6.vertex = true;
			   	bg.insert(cell6);
			   	var cell7 = new mxCell('M', new mxGeometry(240, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell7.vertex = true;
			   	bg.insert(cell7);
			   	var cell8 = new mxCell('T', new mxGeometry(270, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell8.vertex = true;
			   	bg.insert(cell8);
			   	var cell9 = new mxCell('W', new mxGeometry(300, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell9.vertex = true;
			   	bg.insert(cell9);
			   	var cell10 = new mxCell('T', new mxGeometry(330, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell10.vertex = true;
			   	bg.insert(cell10);
			   	var cell11 = new mxCell('F', new mxGeometry(360, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell11.vertex = true;
			   	bg.insert(cell11);
			   	var cell12 = new mxCell('S', new mxGeometry(390, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell12.vertex = true;
			   	bg.insert(cell12);
			   	var cell13 = new mxCell('S', new mxGeometry(420, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell13.vertex = true;
			   	bg.insert(cell13);
			   	var cell14 = new mxCell('M', new mxGeometry(450, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell14.vertex = true;
			   	bg.insert(cell14);
			   	var cell15 = new mxCell('T', new mxGeometry(480, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell15.vertex = true;
			   	bg.insert(cell15);
			   	var cell16 = new mxCell('W', new mxGeometry(510, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell16.vertex = true;
			   	bg.insert(cell16);
			   	var cell17 = new mxCell('T', new mxGeometry(540, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell17.vertex = true;
			   	bg.insert(cell17);
			   	var cell18 = new mxCell('F', new mxGeometry(570, 20, 30, 20), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell18.vertex = true;
			   	bg.insert(cell18);
			   	var cell19 = new mxCell('', new mxGeometry(0, 40, 240, 260), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell19.vertex = true;
			   	bg.insert(cell19);
			   	var cell20 = new mxCell('', new mxGeometry(240, 40, 60, 260), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell20.vertex = true;
			   	bg.insert(cell20);
			   	var cell21 = new mxCell('', new mxGeometry(300, 40, 60, 260), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell21.vertex = true;
			   	bg.insert(cell21);
			   	var cell22 = new mxCell('', new mxGeometry(360, 40, 60, 260), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell22.vertex = true;
			   	bg.insert(cell22);
			   	var cell23 = new mxCell('', new mxGeometry(420, 40, 60, 260), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell23.vertex = true;
			   	bg.insert(cell23);
			   	var cell24 = new mxCell('', new mxGeometry(480, 40, 60, 260), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell24.vertex = true;
			   	bg.insert(cell24);
			   	var cell25 = new mxCell('', new mxGeometry(540, 40, 60, 260), s2 + 'graphics.rrect;rSize=0;strokeColor=#999999;fontColor=#666666;');
			   	cell25.vertex = true;
			   	bg.insert(cell25);
			   	var cell26 = new mxCell('1', new mxGeometry(0, 40, 20, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell26.vertex = true;
			   	bg.insert(cell26);
			   	var cell27 = new mxCell('Task 1', new mxGeometry(20, 40, 40, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell27.vertex = true;
			   	bg.insert(cell27);
			   	var cell28 = new mxCell('20//10//2014 8:00 AM', new mxGeometry(60, 40, 130, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell28.vertex = true;
			   	bg.insert(cell28);
			   	var cell29 = new mxCell('40h', new mxGeometry(190, 40, 50, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell29.vertex = true;
			   	bg.insert(cell29);
			   	var cell30 = new mxCell('2', new mxGeometry(0, 60, 20, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell30.vertex = true;
			   	bg.insert(cell30);
			   	var cell32 = new mxCell('Task 2', new mxGeometry(20, 60, 40, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell32.vertex = true;
			   	bg.insert(cell32);
			   	var cell33 = new mxCell('20//10//2014 8:00 AM', new mxGeometry(60, 60, 130, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell33.vertex = true;
			   	bg.insert(cell33);
			   	var cell34 = new mxCell('40h', new mxGeometry(190, 60, 50, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell34.vertex = true;
			   	bg.insert(cell34);
			   	var cell35 = new mxCell('3', new mxGeometry(0, 80, 20, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell35.vertex = true;
			   	bg.insert(cell35);
			   	var cell36 = new mxCell('Task 3', new mxGeometry(20, 80, 40, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell36.vertex = true;
			   	bg.insert(cell36);
			   	var cell37 = new mxCell('20//10//2014 8:00 AM', new mxGeometry(60, 80, 130, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell37.vertex = true;
			   	bg.insert(cell37);
			   	var cell38 = new mxCell('40h', new mxGeometry(190, 80, 50, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell38.vertex = true;
			   	bg.insert(cell38);
			   	var cell39 = new mxCell('4', new mxGeometry(0, 100, 20, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell39.vertex = true;
			   	bg.insert(cell39);
			   	var cell40 = new mxCell('Task 4', new mxGeometry(20, 100, 40, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell40.vertex = true;
			   	bg.insert(cell40);
			   	var cell41 = new mxCell('20//10//2014 8:00 AM', new mxGeometry(60, 100, 130, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell41.vertex = true;
			   	bg.insert(cell41);
			   	var cell42 = new mxCell('40h', new mxGeometry(190, 100, 50, 20), s2 + 'graphics.anchor;fontColor=#666666;');
			   	cell42.vertex = true;
			   	bg.insert(cell42);
			   	var cell43 = new mxCell('', new mxGeometry(250, 45, 130, 10), s2 + 'graphics.rrect;rSize=0;strokeColor=none;fillColor=#aaddff;');
			   	cell43.vertex = true;
			   	bg.insert(cell43);
			   	var cell44 = new mxCell('', new mxGeometry(250, 65, 40, 10), s2 + 'graphics.rrect;rSize=0;strokeColor=none;fillColor=#aaddff;');
			   	cell44.vertex = true;
			   	bg.insert(cell44);
			   	var cell46 = new mxCell('', new mxGeometry(280, 85, 100, 10), s2 + 'graphics.rrect;rSize=0;strokeColor=none;fillColor=#aaddff;');
			   	cell46.vertex = true;
			   	bg.insert(cell46);
			   	var cell47 = new mxCell('', new mxGeometry(340, 105, 70, 10), s2 + 'graphics.rrect;rSize=0;strokeColor=none;fillColor=#aaddff;');
			   	cell47.vertex = true;
			   	bg.insert(cell47);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Gantt Chart');
			}),
			
			this.createVertexTemplateEntry(s + 'misc.map;', 250, 250, '', 'Map', null, null, this.getTagsForStencil(gn, 'map', dt).join(' '))
		];
		
		this.addPalette('mockupGraphics', 'Mockup Graphics', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addMockupMarkupPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.markup';
		var dt = '';
		
		this.addPaletteFunctions('mockupMarkup', 'Mockup Markup', false,
		[
			this.createVertexTemplateEntry(s + 'markup.curlyBrace;' + skcl9, 
					100, 20, '', 'Horizontal Curly Brace', null, null, this.getTagsForStencil(gn, 'curlyBrace', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_LABEL_POSITION + '=right;' + mxConstants.STYLE_ALIGN + '=left;strokeWidth=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.mockup.markup.curlyBrace;html=1;shadow=0;dashed=0;' + skcl9 + mxConstants.STYLE_DIRECTION + '=' + mxConstants.DIRECTION_NORTH + ';', 
					20, 100, '', 'Vertical Curly Brace', null, null, this.getTagsForStencil(gn, 'curlyBrace', dt + 'vertical').join(' ')),
			this.createVertexTemplateEntry(s + 'markup.line;' + skcl9, 
					100, 20, '', 'Horizontal Line', null, null, this.getTagsForStencil(gn, 'line', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s + 'markup.line;' + skcl9 + mxConstants.STYLE_DIRECTION + '=' + mxConstants.DIRECTION_NORTH + ';', 
					20, 100, '', 'Vertical Line', null, null, this.getTagsForStencil(gn, 'line', dt + 'vertical').join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_SHAPE + '=mxgraph.mockup.markup.scratchOut;shadow=0;dashed=0;html=1;' + skcl9 + 'strokeWidth=4;',
					200, 100, '', 'Scratch Out', null, null, this.getTagsForStencil(gn, 'scratchOut', dt + 'scratch out').join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_SHAPE + '=mxgraph.mockup.markup.redX;fillColor=#ff0000;html=1;shadow=0;' + skclN, 
					200, 100, '', 'Red X', null, null, this.getTagsForStencil(gn, 'redX', dt + 'red').join(' '))
		]);
	};
	
	Sidebar.prototype.addMockupMiscPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.misc';
		var dt = 'mockup ';
		var miscCommon = skcl9 + mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;fillColor=#ffffff;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=2;html=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.mockup.';

		var fns =
		[
			this.createVertexTemplateEntry(s + 'misc.help_icon;', 
					32, 32, '', 'Help Icon', null, null, this.getTagsForStencil(gn, 'help_icon', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.playbackControls;fillColor=#ffffff;' + skcl9 + 'fillColor2=#99ddff;strokeColor2=none;fillColor3=#ffffff;strokeColor3=none;',
					250, 30, '', 'Playback Controls', null, null, this.getTagsForStencil(gn, 'playbackControls', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.progressBar;fillColor=#cccccc;' + skclN + 'fillColor2=#99ddff;barPos=80;', 200, 20, '', 'Progress Bar', null, null, this.getTagsForStencil(gn, 'progress bar', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.shoppingCart;' + skcl9, 
					50, 50, '', 'Shopping Cart', null, null, this.getTagsForStencil(gn, 'shopping cart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.rating;' + skcl9 + mxConstants.STYLE_FILLCOLOR + '=#ffff00;emptyFillColor=#ffffff;grade=4;ratingScale=5;ratingStyle=star;',
					225, 30, '', 'Rating', null, null, this.getTagsForStencil(gn, 'rating', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.mail2;fillColor=#ffffff;' + skcl9, 100, 60, '', 'Mail', null, null, this.getTagsForStencil(gn, 'mail', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.volumeSlider;barPos=80;fillColor=#cccccc;' + skcl9 + 'fillColor2=#ddeeff;', 
					250, 30, '', 'Volume Slider', null, null, this.getTagsForStencil(gn, 'volume slider', dt).join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.editIcon;', 
					50, 50, '', 'Edit Icon', null, null, this.getTagsForStencil(gn, 'editIcon', dt + 'edit icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.printIcon;', 
					50, 50, '', 'Print Icon', null, null, this.getTagsForStencil(gn, 'printIcon', dt + 'print icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.shareIcon;', 
					50, 50, '', 'Share Icon', null, null, this.getTagsForStencil(gn, 'shareIcon', dt + 'share icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.trashcanIcon;', 
					50, 50, '', 'Trashcan Icon', null, null, this.getTagsForStencil(gn, 'trashcanIcon', dt + 'trashcan icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.copyrightIcon;', 
					25, 25, '', 'Copyright', null, null, this.getTagsForStencil(gn, 'copyrightIcon', dt + 'copyright icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.registeredIcon;', 
					25, 25, '', 'Registered', null, null, this.getTagsForStencil(gn, 'registeredIcon', dt + 'registered icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.volumeIcon;', 
					25, 25, '', 'Volume', null, null, this.getTagsForStencil(gn, 'volumeIcon', dt + 'volume icon').join(' ')),
			this.createVertexTemplateEntry(s2 + 'misc.ruler2;dx=100;rulerOrient=down;unitSize=10;fillColor=#ffffff;fontColor=#999999;spacingLeft=96;align=left;verticalAlign=middle;spacingBottom=10;spacingTop=0;spacingRight=0;spacing=0;' + skcl9, 
					350, 30, '1', 'Horizontal Ruler', null, null, this.getTagsForStencil(gn, 'ruler', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s2 + 'misc.ruler2;dx=100;rulerOrient=up;unitSize=10;fillColor=#ffffff;fontColor=#999999;spacingLeft=96;align=left;verticalAlign=middle;spacingBottom=0;spacingTop=10;spacingRight=0;spacing=0;' + skcl9, 
					350, 30, '1', 'Horizontal Ruler', null, null, this.getTagsForStencil(gn, 'ruler', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s2 + 'misc.ruler2;dx=100;rulerOrient=down;unitSize=10;fillColor=#ffffff;fontColor=#999999;spacingLeft=96;align=left;verticalAlign=middle;spacingBottom=10;spacingTop=0;spacingRight=0;rotation=-90;spacing=0;' + skcl9, 
					350, 30, '1', 'Vertical Ruler', null, null, this.getTagsForStencil(gn, 'ruler', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s2 + 'misc.ruler2;dx=100;rulerOrient=up;unitSize=10;fillColor=#ffffff;fontColor=#999999;spacingLeft=96;align=left;verticalAlign=middle;spacingBottom=0;spacingTop=10;spacingRight=0;rotation=-90;spacing=0;' + skcl9, 
					350, 30, '1', 'Vertical Ruler', null, null, this.getTagsForStencil(gn, 'ruler', dt + 'horizontal').join(' ')),

			this.addEntry(dt + 'revision table', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 400, 75), s2 + 'misc.rrect;rSize=0;strokeColor=#666666;');
			   	bg.vertex = true;
			   	var cell1 = new mxCell('REVISION HISTORY', new mxGeometry(0, 0, 400, 25), s2 + 'misc.rrect;rSize=0;strokeColor=#666666;fontSize=17;fontColor=#999999;');
			   	cell1.vertex = true;
			   	bg.insert(cell1);
			   	var cell2 = new mxCell('REV', new mxGeometry(0, 25, 50, 25), s2 + 'misc.rrect;rSize=0;strokeColor=#666666;fontSize=17;fontColor=#999999;');
			   	cell2.vertex = true;
			   	bg.insert(cell2);
			   	var cell3 = new mxCell('DATE', new mxGeometry(50, 25, 150, 25), s2 + 'misc.rrect;rSize=0;strokeColor=#666666;fontSize=17;fontColor=#999999;');
			   	cell3.vertex = true;
			   	bg.insert(cell3);
			   	var cell4 = new mxCell('DESCRIPTION', new mxGeometry(200, 25, 200, 25), s2 + 'misc.rrect;rSize=0;strokeColor=#666666;fontSize=17;fontColor=#999999;');
			   	cell4.vertex = true;
			   	bg.insert(cell4);
			   	var cell6 = new mxCell('A', new mxGeometry(0, 50, 50, 25), s2 + 'misc.rrect;rSize=0;strokeColor=#666666;fontSize=17;fontColor=#999999;');
			   	cell6.vertex = true;
			   	bg.insert(cell6);
			   	var cell7 = new mxCell('10/23/2014', new mxGeometry(50, 50, 150, 25), s2 + 'misc.rrect;rSize=0;strokeColor=#666666;fontSize=17;fontColor=#999999;');
			   	cell7.vertex = true;
			   	bg.insert(cell7);
			   	var cell8 = new mxCell('Design modified', new mxGeometry(200, 50, 200, 25), s2 + 'misc.rrect;rSize=0;strokeColor=#666666;fontSize=17;fontColor=#999999;');
			   	cell8.vertex = true;
			   	bg.insert(cell8);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Revision Table');
			}),

			this.addEntry(dt + 'status bar', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 500, 30), s2 + 'misc.rrect;rSize=0;strokeColor=#999999;fillColor=#ffffff;');
			   	bg.vertex = true;
			   	var cell1 = new mxCell('Status text', new mxGeometry(5, 5, 195, 20), s2 + 'misc.rrect;rSize=5;strokeColor=none;fontSize=15;fontColor=#999999;fillColor=#ddeeff;align=left;spacingLeft=5;');
			   	cell1.vertex = true;
			   	bg.insert(cell1);
			   	var cell2 = new mxCell('Text 2', new mxGeometry(205, 5, 100, 20), s2 + 'misc.rrect;rSize=5;strokeColor=none;fontSize=15;fontColor=#999999;fillColor=#ddeeff;align=left;spacingLeft=5;');
			   	cell2.vertex = true;
			   	bg.insert(cell2);
			   	var cell3 = new mxCell('Text 3', new mxGeometry(310, 5, 115, 20), s2 + 'misc.rrect;rSize=5;strokeColor=none;fontSize=15;fontColor=#999999;fillColor=#ddeeff;align=left;spacingLeft=5;');
			   	cell3.vertex = true;
			   	bg.insert(cell3);
			   	var anchor1 = new mxCell('', new mxGeometry(495, 15, 0, 0), s2 + 'misc.anchor;');
			   	anchor1.vertex = true;
			   	bg.insert(anchor1);
			   	var button1 = new mxCell('', new mxGeometry(-20, -10, 20, 20), 'shape=ellipse;fillColor=none;strokeColor=#008cff;resizable=0;html=1;');
			   	button1.vertex = true;
			   	anchor1.insert(button1);
			   	var anchor2 = new mxCell('', new mxGeometry(465, 15, 0, 0), s2 + 'misc.anchor;');
			   	anchor2.vertex = true;
			   	bg.insert(anchor2);
			   	var button2 = new mxCell('', new mxGeometry(-20, 5, 20, 10), 'shape=line;strokeColor=#008cff;resizable=0;');
			   	button2.vertex = true;
			   	anchor2.insert(button2);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Status Bar');
			}),

			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#ccccff;fillColor3=#0000ff;strokeColor=#000066;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#ffff00;fillColor3=#888800;strokeColor=#999900;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#ffa500;fillColor3=#885000;strokeColor=#997000;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' '))
		];
		
		this.addPalette('mockupMisc', 'Mockup Misc', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addMockupNavigationPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.navigation';
		var dt = 'mockup navigation ';
		var miscCommon = skcl9 + mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;fillColor=#ffffff;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=2;html=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.mockup.';

		var fns =
		[
			this.addEntry(dt + 'status bar', function()
			{
				var text1 = new mxCell('Layer 1', new mxGeometry(0, 0, 60, 30), s2 + 'navigation.anchor;fontSize=17;fontColor=#666666;fontStyle=1;');
			   	text1.vertex = true;
			   	var text2 = new mxCell('>', new mxGeometry(60, 0, 20, 30), s2 + 'navigation.anchor;fontSize=24;fontColor=#aaaaaa;fontStyle=1;');
			   	text2.vertex = true;
			   	var text3 = new mxCell('Layer 2', new mxGeometry(80, 0, 60, 30), s2 + 'navigation.anchor;fontSize=17;fontColor=#666666;fontStyle=1;');
			   	text3.vertex = true;
			   	var text4 = new mxCell('>', new mxGeometry(140, 0, 20, 30), s2 + 'navigation.anchor;fontSize=24;fontColor=#aaaaaa;fontStyle=1;');
			   	text4.vertex = true;
			   	var text5 = new mxCell('Layer 3', new mxGeometry(160, 0, 60, 30), s2 + 'navigation.anchor;fontSize=17;fontColor=#666666;fontStyle=1;');
			   	text5.vertex = true;
			   	var text6 = new mxCell('>', new mxGeometry(220, 0, 20, 30), s2 + 'navigation.anchor;fontSize=24;fontColor=#aaaaaa;fontStyle=1;');
			   	text6.vertex = true;
			   	var text7 = new mxCell('Layer 4', new mxGeometry(240, 0, 60, 30), s2 + 'navigation.anchor;fontSize=17;fontColor=#008cff;fontStyle=1;');
			   	text7.vertex = true;
				
		   		return sb.createVertexTemplateFromCells([text1, text2, text3, text4, text5, text6, text7], 300, 30, 'Status Bar');
			}),
			
			this.createVertexTemplateEntry(s2 + 'navigation.stepBar;strokeColor=#c4c4c4;textColor=#666666;textColor2=#008cff;mainText=,,+,;textSize=17;fillColor=#666666;overflow=fill;fontSize=17;fontColor=#666666;', 300, 50, 
				'<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" style="font-size:1em;">' +
				'<tr height="0%"><td width="25%">Layer 1</td><td width="25%">Layer 2</td><td width="25%" style="color:#008cff;">Layer 3</td><td width="25%">Layer 4</td></tr><tr height="100%"><td/></tr></table>', 
				'Step Bar', null, null, this.getTagsForStencil(gn, 'stepBar', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.coverFlow;strokeColor=#999999;fillColor=#ffffff;',
				400, 200, '', 'Cover Flow', null, null, this.getTagsForStencil(gn, 'coverFlow', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.scrollBar;fillColor=#ffffff;' + skcl9 + 'barPos=20;fillColor2=#99ddff;strokeColor2=none;',
				200, 20, '', 'Horizontal Scroll Bar', null, null, this.getTagsForStencil(gn, 'scrollBar', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.scrollBar;fillColor=#ffffff;' + skcl9 + 'barPos=20;fillColor2=#99ddff;strokeColor2=none;direction=north;',
				20, 200, '', 'Vertical Scroll Bar', null, null, this.getTagsForStencil(gn, 'scrollBar', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'navigation.pagination;linkText=;fontSize=17;fontColor=#0000ff;fontStyle=4;',
				350, 30, '<< Prev 1 2 3 4 5 6 7 8 9 10 Next >>', 'Pagination', null, null, this.getTagsForStencil(gn, 'pagination', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.pageControl;fillColor=#999999;strokeColor=#ddeeff;',
				100, 30, '', 'Page Control', null, null, this.getTagsForStencil(gn, 'pageControl', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.mapNavigator;fillColor=#ffffff;fillColor2=#99ddff;strokeColor2=none;strokeColor3=#ffffff;' + skcl9,
				60, 100, '', 'Map Navigator', null, null, this.getTagsForStencil(gn, 'mapNavigator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.loading_circle_1;', 90, 90, '', 'Wheel Throbber 1', null, null, this.getTagsForStencil(gn, 'loading_circle_1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.loading_circle_2;', 90, 90, '', 'Wheel Throbber 2', null, null, this.getTagsForStencil(gn, 'loading_circle_2', dt).join(' '))
		];	
			
		this.addPalette('mockupNavigation', 'Mockup Navigation', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addMockupTextPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.text';
		var dt = 'mockup text ';
		var miscCommon = skcl9 + mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;fillColor=#ffffff;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=2;html=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.mockup.';
		var loremText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?';

		var fns =
		[
			this.createVertexTemplateEntry('shape=rectangle;strokeColor=none;fillColor=none;linkText=;fontSize=17;fontColor=#0000ff;fontStyle=4;html=1;align=center;', 
					150, 30, 'Link', 'Link', null, null, this.getTagsForStencil(gn, 'link', dt).join(' ')),

			this.addEntry(dt + 'horizontal button bar', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 500, 25), s2 + 'text.rrect;rSize=0;fillColor=#ffffff;strokeColor=#666666;');
			   	bg.vertex = true;
			   	var button2 = new mxCell('Button 2', new mxGeometry(125, 0, 125, 25), s2 + 'text.rrect;rSize=0;fontSize=17;fontColor=#0000ff;fillColor=none;strokeColor=#666666;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Button 3', new mxGeometry(250, 0, 125, 25), s2 + 'text.rrect;rSize=0;fontSize=17;fontColor=#0000ff;fillColor=none;strokeColor=#666666;');
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Button 4', new mxGeometry(375, 0, 125, 25), s2 + 'text.rrect;rSize=0;fontSize=17;fontColor=#0000ff;fillColor=none;strokeColor=#666666;');
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button1 = new mxCell('Button 1', new mxGeometry(0, 0, 125, 25), s2 + 'text.rrect;rSize=0;fontSize=17;fontColor=#ffffff;fillColor=#008cff;strokeColor=none;');
			   	button1.vertex = true;
			   	bg.insert(button1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Horizontal Button Bar');
			}),
			
			this.createVertexTemplateEntry(s2 + 'text.callout;linkText=;textSize=17;textColor=#666666;callDir=NW;callStyle=line;fontSize=17;fontColor=#666666;align=left;verticalAlign=top;' + skcl6,
					200, 100, 'Callout', 'Callout', null, null, this.getTagsForStencil(gn, 'callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.callout;linkText=;textSize=17;textColor=#666666;callDir=NE;callStyle=line;fontSize=17;fontColor=#666666;align=right;verticalAlign=top;' + skcl6,
					200, 100, 'Callout', 'Callout', null, null, this.getTagsForStencil(gn, 'callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.callout;linkText=;textSize=17;textColor=#666666;callDir=SW;callStyle=line;fontSize=17;fontColor=#666666;align=left;verticalAlign=bottom;' + skcl6,
					200, 100, 'Callout', 'Callout', null, null, this.getTagsForStencil(gn, 'callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.callout;linkText=;textSize=17;textColor=#666666;callDir=SE;callStyle=line;fontSize=17;fontColor=#666666;align=right;verticalAlign=bottom;' + skcl6,
					200, 100, 'Callout', 'Callout', null, null, this.getTagsForStencil(gn, 'callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.stickyNote;fontColor=#666666;mainText=;fontSize=17;whiteSpace=wrap;',
					200, 200, 'Note Line 1\nNote Line 2\nNote Line 3', 'Sticky Note', null, null, this.getTagsForStencil(gn, 'stickyNote', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.bulletedList;textColor=#666666;mainText=,,,,;textSize=17;bulletStyle=none;' + skclN + mxConstants.STYLE_FILLCOLOR + '=none;align=left;verticalAlign=top;fontSize=17;fontColor=#666666;',
					150, 135, '-Line 1\n-Line 2\n-Line 3\n-Line 4', 'Bulleted List', null, null, this.getTagsForStencil(gn, 'bulletedList', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.textBox;fillColor=#ffffff;fontColor=#666666;align=left;fontSize=17;spacingLeft=4;spacingTop=-3;' + skcl6 + 'mainText=',
					150, 30, 'Line 1', 'Text Box', null, null, this.getTagsForStencil(gn, 'textBox', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.captcha;fillColor=#ffffff;fontColor=#666666;fontSize=25;' + skcl6 + 'mainText=',
					150, 50, 'fG2yQ23', 'Captcha', null, null, this.getTagsForStencil(gn, 'captcha', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.alphanumeric;linkText=;html=1;fontStyle=4;fontSize=17;fontColor=#0000ff;',
					450, 50, '0-9 A B C D E F G H I J K L M N O P Q R S T U V X Y Z', 'Alphanumeric', null, null, this.getTagsForStencil(gn, 'alphanumeric', dt).join(' ')),
			this.createVertexTemplateEntry('text;spacingTop=-5;fillColor=#ffffff;whiteSpace=wrap;html=1;align=left;fontSize=12;fontFamily=Helvetica;fillColor=none;strokeColor=none;', 
					250, 470, loremText, 'Paragraph of Text', null, null, this.getTagsForStencil(gn, 'peragraph of text', dt).join(' ')),
			
			this.addEntry(dt + 'table', function()
			{
			    var classCell = new mxCell('<table cellpadding="4" cellspacing="0" border="1" style="font-size:1em;width:100%;height:100%;"><tr><th>Header 1</th><th>Header 2</th></tr>' +
			    		'<tr><td>row 1, cell 1</td><td>row 1, cell 2</td></tr><tr><td>row 2, cell 1</td>' + 
			    		'<td>row 2, cell 2</td></tr></table> ', new mxGeometry(0, 0, 180, 80),
						'verticalAlign=top;align=left;overflow=fill;fillColor=#ffffff;fontSize=12;fontFamily=Helvetica;html=1');
		    	classCell.vertex = true;
				
		   		return sb.createVertexTemplateFromCells([classCell], classCell.geometry.width, classCell.geometry.height, 'Table');
			})
		];
		   	
	    this.addPalette('mockupText', 'Mockup Text', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
