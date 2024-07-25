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
			this.setCurrentSearchEntryLibrary('ios');
		
		var fns =
		[
			
			this.createVertexTemplateEntry(s + 'iPhone;bgStyle=bgGreen;fillColor=#aaaaaa;sketch=0;', sizeX, sizeY, '', 'iPhone (portrait)', null, null, null),
		 	this.createVertexTemplateEntry(s + 'iPhone;direction=north;bgStyle=bgGreen;fillColor=#aaaaaa;sketch=0;', sizeY, sizeX, '', 'iPhone (landscape)', null, null, null),
			this.createVertexTemplateEntry(s + 'iPad;bgStyle=bgGreen;fillColor=#aaaaaa;sketch=0;', sizeX * 2.425, sizeY * 1.5625, '', 'iPad (portrait)', null, null, null),
			this.createVertexTemplateEntry(s + 'iPad;direction=north;bgStyle=bgGreen;fillColor=#aaaaaa;sketch=0;', sizeY * 1.5625, sizeX * 2.425, '', 'iPad (landscape)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgFlat;strokeColor=#18211b;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (white)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgFlat;strokeColor=#18211b;fillColor=#1f2923;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (green)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgFlat;strokeColor=#18211b;fillColor=#dddddd;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (gray)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgStriped;strokeColor=#18211b;fillColor=#5D7585;strokeColor2=#657E8F;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (striped)', null, null, null),
			this.createVertexTemplateEntry(s + 'iBgMap;strokeColor=#18211b;strokeColor2=#008cff;fillColor2=#96D1FF;', sizeX * 0.875, sizeY * 0.7, '', 'iPad background (map)', null, null, null),
			
			this.addEntry('button bar', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 165, 50),
			    	'swimlane;shape=mxgraph.bootstrap.anchor;strokeColor=#C4C4C4;fillColor=#ffffff;fontColor=#666666;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('Item 1', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=5;fillColor=inherit;fontColor=inherit;fontSize=8;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 6, 5), 'shape=mxgraph.ios7.misc.right;strokeColor=#C4C4C4;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Item 2', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=#5D7585;gradientColor=#008cff;fontColor=#ffffff;fontSize=8;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker2 = new mxCell('', new mxGeometry(1, 0.5, 6, 5), 'shape=mxgraph.ios7.misc.right;strokeColor=#C4C4C4;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(-20, -2.5);
			   	marker2.vertex = true;
			   	field2.insert(marker2);
				var field3 = new mxCell('Item 3', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=inherit;fontColor=inherit;fontSize=8;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker3 = new mxCell('', new mxGeometry(1, 0.5, 6, 5), 'shape=mxgraph.ios7.misc.right;strokeColor=#C4C4C4;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(-20, -2.5);
			   	marker3.vertex = true;
			   	field3.insert(marker3);
				var field4 = new mxCell('Item 4', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.bottomButton;rSize=5;fillColor=inherit;fontColor=inherit;fontSize=8;');
				field4.vertex = true;
				cell.insert(field4);
			   	var marker4 = new mxCell('', new mxGeometry(1, 0.5, 6, 5), 'shape=mxgraph.ios7.misc.right;strokeColor=#C4C4C4;');
			   	marker4.geometry.relative = true;
			   	marker4.geometry.offset = new mxPoint(-20, -2.5);
			   	marker4.vertex = true;
			   	field4.insert(marker4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Button bar');
			}),
		    
			this.addEntry('button bar', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 165, 80),
			    	'swimlane;shape=mxgraph.bootstrap.anchor;strokeColor=#C4C4C4;fillColor=#ffffff;fontColor=#999999;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('Item 1', new mxGeometry(0, 0, 165, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=5;fillColor=inherit;fontColor=inherit;fontSize=12;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 6, 12), 'shape=mxgraph.ios7.misc.right;strokeColor=#C4C4C4;strokeWidth=3;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-25, -6);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Item 2', new mxGeometry(0, 0, 165, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=#5D7585;gradientColor=#008cff;fontColor=#ffffff;fontSize=12;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker2 = new mxCell('', new mxGeometry(1, 0.5, 6, 12), 'shape=mxgraph.ios7.misc.right;strokeColor=#C4C4C4;strokeWidth=3;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(-25, -6);
			   	marker2.vertex = true;
			   	field2.insert(marker2);
				var field3 = new mxCell('Item 3', new mxGeometry(0, 0, 165, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=inherit;fontColor=inherit;fontSize=12;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker3 = new mxCell('', new mxGeometry(1, 0.5, 6, 12), 'shape=mxgraph.ios7.misc.right;strokeColor=#C4C4C4;strokeWidth=3;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(-25, -6);
			   	marker3.vertex = true;
			   	field3.insert(marker3);
				var field4 = new mxCell('Item 4', new mxGeometry(0, 0, 165, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.bottomButton;rSize=5;fillColor=inherit;fontColor=inherit;fontSize=12;');
				field4.vertex = true;
				cell.insert(field4);
			   	var marker4 = new mxCell('', new mxGeometry(1, 0.5, 6, 12), 'shape=mxgraph.ios7.misc.right;strokeColor=#C4C4C4;strokeWidth=3;');
			   	marker4.geometry.relative = true;
			   	marker4.geometry.offset = new mxPoint(-25, -6);
			   	marker4.vertex = true;
			   	field4.insert(marker4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Button bar');
			}),
		    
			this.addEntry(null, function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 175, 15), s4 + 'iAppBar;strokeWidth=1;sketch=0;');
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
			   	var bg = new mxCell('', new mxGeometry(0, 0, 280, 15), s4 + 'iAppBar;strokeWidth=1;sketch=0;');
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
			   	var bg = new mxCell('', new mxGeometry(0, 0, 175, 15), s4 + 'iTopBar2;opacity=50;fillColor=#999999;strokeColor=#cccccc;strokeWidth=1;sketch=0;');
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
			   	var bg = new mxCell('', new mxGeometry(0, 0, 175, 15), s4 + 'iTopBarLocked;strokeWidth=1;sketch=0;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('CARRIER', new mxGeometry(0, 2, 50, 13), s4 + 'anchor;align=left;fontSize=7.5;spacingLeft=18;fontColor=#cccccc;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Top bar locked');
			}),
		   	
			this.createVertexTemplateEntry(s2 + 'iButton;strokeColor=#444444;fontColor=#ffffff;buttonText=;fontSize=8;fillColor=#dddddd;fillColor2=#3D5565;whiteSpace=wrap;align=center;sketch=0;', 
					sizeX * 0.2175, sizeY * 0.0375, 'Button', 'Button', null, null, null),
		 	this.createVertexTemplateEntry(s2 + 'iButtonBack;strokeColor=#444444;fontColor=#ffffff;buttonText=;fontSize=8;fillColor=#dddddd;fillColor2=#3D5565;spacingLeft=10;whiteSpace=wrap;align=center;sketch=0;', 
		 			sizeX * 0.2175, sizeY * 0.0375, 'Button', 'Back button', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iButtonFw;strokeColor=#444444;fontColor=#ffffff;buttonText=;fontSize=8;fillColor=#dddddd;fillColor2=#3D5565;spacingRight=10;whiteSpace=wrap;align=center;sketch=0;', 
					sizeX * 0.2175, sizeY * 0.0375, 'Button', 'Forward button', null, null, null),
			this.createVertexTemplateEntry(s + 'iPrevNext;strokeColor=#444444;fillColor=#dddddd;fillColor2=#3D5565;fillColor3=#ffffff;align=center;sketch=0;', 
					sizeX * 0.2175, sizeY * 0.0375, '', 'Prev/next button', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iTextInput;strokeColor=#444444;buttonText=;fontSize=8;whiteSpace=wrap;align=left;', 
					sizeX * 0.2175, sizeY * 0.0375, 'Default text', 'Text input', null, null, null),

			this.addEntry('radio buttons', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 165, 50),
			    	'swimlane;shape=mxgraph.bootstrap.rrect;rSize=3;strokeColor=#666666;fillColor=#ffffff;fontColor=#666666;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('Option 1', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontColor=inherit;fontSize=8;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('', new mxGeometry(0, 0.5, 5, 5), 'shape=ellipse;resizable=0;fillColor=#dddddd;html=1;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(3, -2.5);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Option 2', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=8;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker2 = new mxCell('', new mxGeometry(0, 0.5, 5, 5), 'shape=ellipse;resizable=0;fillColor=#dddddd;html=1;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(3, -2.5);
			   	marker2.vertex = true;
			   	field2.insert(marker2);
				var field3 = new mxCell('Option 3', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=8;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker3 = new mxCell('', new mxGeometry(0, 0.5, 5, 5), 'shape=ellipse;resizable=0;fillColor=#444444;html=1;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(3, -2.5);
			   	marker3.vertex = true;
			   	field3.insert(marker3);
				var field4 = new mxCell('Option 4', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.bottomButton;rSize=5;fillColor=none;fontColor=inherit;fontSize=8;');
				field4.vertex = true;
				cell.insert(field4);
			   	var marker4 = new mxCell('', new mxGeometry(0, 0.5, 5, 5), 'shape=ellipse;resizable=0;fillColor=#dddddd;html=1;');
			   	marker4.geometry.relative = true;
			   	marker4.geometry.offset = new mxPoint(3, -2.5);
			   	marker4.vertex = true;
			   	field4.insert(marker4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Radio buttons');
			}),
		    
			this.addEntry('checkboxes', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 165, 50),
			    	'swimlane;shape=mxgraph.bootstrap.rrect;rSize=3;strokeColor=#666666;fillColor=#ffffff;fontColor=#666666;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('Setting 1', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontColor=inherit;fontSize=8;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('', new mxGeometry(0, 0.5, 5, 5), 'resizable=0;fillColor=#dddddd;html=1;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(3, -2.5);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Setting 2', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=8;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker2 = new mxCell('', new mxGeometry(0, 0.5, 5, 5), 'resizable=0;fillColor=#dddddd;html=1;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(3, -2.5);
			   	marker2.vertex = true;
			   	field2.insert(marker2);
				var field3 = new mxCell('Setting 3', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=8;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker3 = new mxCell('', new mxGeometry(0, 0.5, 5, 5), 'shape=mxgraph.ios.checkbox;resizable=0;fillColor=#999999;html=1;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(3, -2.5);
			   	marker3.vertex = true;
			   	field3.insert(marker3);
				var field4 = new mxCell('Setting 4', new mxGeometry(0, 0, 165, 12.5),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.bottomButton;rSize=5;fillColor=none;fontColor=inherit;fontSize=8;');
				field4.vertex = true;
				cell.insert(field4);
			   	var marker4 = new mxCell('', new mxGeometry(0, 0.5, 5, 5), 'resizable=0;fillColor=#dddddd;html=1;');
			   	marker4.geometry.relative = true;
			   	marker4.geometry.offset = new mxPoint(3, -2.5);
			   	marker4.vertex = true;
			   	field4.insert(marker4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Checkboxes');
			}),
		    
			this.createVertexTemplateEntry(s2 + 'iComboBox;spacingTop=2;spacingLeft=2;align=left;strokeColor=#444444;fontColor=#666666;buttonText=;fontSize=8;fillColor=#dddddd;fillColor2=#3D5565;sketch=0;whiteSpace=wrap;', 
					sizeX * 0.29, sizeY * 0.0375, 'Option 1', 'Combobox', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iOnOffButton;mainText=;strokeColor=#444444;fontSize=9;fontColor=#ffffff;spacingRight=14;buttonState=on;sketch=0;', sizeX * 0.2175, sizeY * 0.0375, 
					'ON', 'On-off button', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iTextInput;strokeColor=#444444;align=left;buttonText=;fontSize=8;whiteSpace=wrap;', sizeX * 0.2175, sizeY * 0.0375, 
					'********', 'Password field', null, null, null),
			this.addDataEntry(null, 150, 100, 'Alert Box',
				'zVVRb5swEP41PDYyOOmaxyVps5dJU/OwZ8s+sFWDke0ksF+/MzgNCDJ1W6UWCQl/992d7e87kdBt2ewtq+V3I0An9DGhW2uM77/KZgtaJxlRIqG7JMsIvkn2dCOadlFSMwuVf0tC1iecmD5Cj3zVYD1CAhy3qvbKVLjy0CB4n2Q0JQndzAWJA24qgR9aVdDXdb7Vsa70JZ5ul2K2k0yYMy66UsxJEHGBkTrwy6YIV7JQxi1yVvH2+Rk4HmhjD+pXIDwEsrfmBbZGG9u1oKJ7MJIrrQf4cv0lXYcMLCoU3swglq5peh9ipmZc+TbUDjvJzYiWd0/EB3s4S+XhgKkBOOOeEWNaFRUuOXYCGzb6Ap7LeETJuDxa2AfqbolAbVTgPZ6Q7iIpdHlipdJhP99An8ArzjAQ5UKJoLkpeQdFvfdgSvC2RcpZCS8jY9XbgkhQhbykkQgy1wPFa+7VQfgRTTRvKDox1CEUkaoqQjtW11Ch3O/mDjSHDCINhUmzPwg4p5gFh5k/4/2kHyBZ9m+SZases6CZVycY1f8fGZcTGTdH78O0v5dw1o4nmk6H65aEk8G/TufbB5+vOEA6Hfw5f3wSN8QEsoiqt6MCA688zFmF/KVVYv8f4XTX5ndLMmp+d7HgpYTJcwd+4rXXY8zZD5fXX15PH/4RfwM='),
			this.addDataEntry(null, 150, 100, 'Dialog Box',
				'7VZdb5swFP01fmwEdkiX15I2k6ZpU/OwZwsu2KrBzHY+2K/fNTgNiKTKtkqrqiIh2ed+2udcBGFpdVgb3oivOgdF2D1hqdHa9avqkIJShEYyJ2xFKI3wJfThgjXurFHDDdTumgDaB+y42kKPrCRXukTs5xask7rGpYODI3RBKIsjwu4mlshCpuscF0rW0Ke0rlUhpXAVHmwVY6gVPNd73Pg8ObcC8rBBS+P9q0Ppb2MmtZ0VvM7ax0fI8Cx3ZiN/eYdP3tkZ/QSpVtp0JVjePWgppFIDfL68jZc+ApPmEi9lYIuXLF54m254Jl3rc/tOCj1yK7on4IMe9kI62GCoB/bYM2JcybLGbYaVwPhGn8BlIhxR8ExsDay962qOQKOl97vfobsNTr7KA6+k8v18BrUDJzOOhsAUGLzzi2x3UKB6DboCZ1p02cvcieCR9IqIBMhSHMOiAHLbA+Vz7Ek8uAj6Oa8lNtHSxicRsvZyQnobqJHuV1MHikN4kobExPQFAs8xZsBi5I9wP/F/oIz+HWU06TEDiju5g1H+f6FxPqExxZvGT9OrEWfMeKLZdLguUTgZ/NN0Xj/4WZIBxNPBP6ePN6KGEBDNjrS3owwDsSySM1qJ/lAroYHv/nin6jeMzsblb47tHJPoorDgJnJ7PslVCkwmCvz25UN9b0F9t+9Pfbg9/W717sO/sd8='),

			this.createVertexTemplateEntry(s2 + 'iLockButton;fontColor=#cccccc;fontSize=13;mainText=;spacingLeft=50;spacingRight=10;align=center;sketch=0;whiteSpace=wrap;', sizeX * 0.87, sizeY * 0.125, 'slide to unlock', 'Lock button', null, null, null),
			this.createVertexTemplateEntry(s + 'iArrowIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;sketch=0;', sizeX * 0.075, sizeY * 0.0375, '', 'Arrow', null, null, null),
			this.createVertexTemplateEntry(s + 'iDeleteIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff;sketch=0;', sizeX * 0.075, sizeY * 0.0375, '', 'Delete', null, null, null),
			this.createVertexTemplateEntry(s + 'iAddIcon;fillColor=#7AdF78;fillColor2=#1A9917;strokeColor=#ffffff;sketch=0;', sizeX * 0.075, sizeY * 0.0375, '', 'Add', null, null, null),
			this.createVertexTemplateEntry(s + 'iInfoIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;sketch=0;', sizeX * 0.075, sizeY * 0.0375, '', 'Info', null, null, null),
			this.createVertexTemplateEntry(s + 'iSortFindIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;sketch=0;', sizeX * 0.075, sizeY * 0.0375, '', 'Sort/find', null, null, null),
			this.createVertexTemplateEntry(s + 'iCheckIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff;sketch=0;', sizeX * 0.075, sizeY * 0.0375, '', 'Check', null, null, null),
			this.createVertexTemplateEntry(s + 'iKeybLett;sketch=0;', sizeX * 0.87, sizeY * 0.25, '', 'Keyboard (letters)', null, null, null),
			this.createVertexTemplateEntry(s + 'iKeybNumb;sketch=0;', sizeX * 0.87, sizeY * 0.25, '', 'Keyboard (numbers)', null, null, null),
			this.createVertexTemplateEntry(s + 'iKeybSymb;sketch=0;', sizeX * 0.87, sizeY * 0.25, '', 'Keyboard (symbols)', null, null, null),
			this.createVertexTemplateEntry(s + 'iDeleteApp;fillColor=#cccccc;fillColor2=#000000;strokeColor=#ffffff;sketch=0;', sizeX * 0.075, sizeY * 0.0375, '', 'Delete app', null, null, null),
			this.createVertexTemplateEntry(s + 'iDir;', sizeX * 0.5, sizeY * 0.25, '', 'Direction', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iLocBar;align=left;spacingLeft=4;spacingBottom=4;fontColor=#ffffff;fontSize=10;barPos=80;pointerPos=bottom;buttonText=5th Street Music Store', sizeX * 0.775, sizeY * 0.08125, '', 'Location bar', null, null, null),
			this.createVertexTemplateEntry(s + 'iCallDialog;sketch=0;', sizeX * 0.75, sizeY * 0.3125, '', 'Call Dialog', null, null, null),
			this.createVertexTemplateEntry(s + 'iCallButtons;', sizeX * 0.87, sizeY * 0.575, '', 'Call buttons', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iOption;barPos=80;pointerPos=bottom;buttonText=Option;fontSize=10;fontColor=#ffffff;spacingBottom=6;', sizeX * 0.375, sizeY * 0.06875, '', 'Option', null, null, null),
			this.createVertexTemplateEntry(s + 'iAlphaList;fontSize=7.5;', sizeX * 0.075, sizeY * 0.5625, '', 'Alphabet list', null, null, null),

			this.addEntry('button group horizontal', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 165, 12.5),
			    	'swimlane;shape=mxgraph.bootstrap.anchor;strokeColor=#444444;fillColor=#ffffff;fontColor=#999999;fontStyle=0;childLayout=stackLayout;horizontal=0;startSize=0;horizontalStack=1;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('Item 1', new mxGeometry(0, 0, 41.25, 12.5),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.leftButton;rSize=3;fillColor=inherit;fontColor=inherit;fontSize=8;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Item 2', new mxGeometry(0, 0, 41.25, 12.5),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=3;fillColor=#5D7585;gradientColor=#008cff;fontColor=#ffffff;fontSize=8;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Item 3', new mxGeometry(0, 0, 41.25, 30),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=3;fillColor=inherit;fontColor=inherit;fontSize=8;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Item 4', new mxGeometry(0, 0, 41.25, 12.5),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.rightButton;rSize=3;fillColor=inherit;fontColor=inherit;spacing=10;dropTarget=0;fontSize=8;');
				field4.vertex = true;
				cell.insert(field4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Button group, horizontal');
			}),
						    
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#ccccff;fillColor3=#0000ff;strokeColor=#000066;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#ffff00;fillColor3=#888800;strokeColor=#999900;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s3 + 'iPin;fillColor2=#ffa500;fillColor3=#885000;strokeColor=#997000;', sizeX * 0.05, sizeY * 0.0625, '', 'Pin', null, null, null),
			this.createVertexTemplateEntry(s + 'iVideoControls;barPos=20;sketch=0;', sizeX * 0.87, sizeY * 0.125, '', 'Video controls', null, null, null),

			this.addEntry(null, function()
			{
			   	var bg = new mxCell('Page title', new mxGeometry(0, 0, 175, 30), s4 + 'iURLBar;verticalAlign=top;fontSize=8;spacingTop=-5;align=center;sketch=0;whiteSpace=wrap;');
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
			this.createVertexTemplateEntry(s2 + 'iDownloadBar;verticalAlign=top;spacingTop=-4;fontSize=8;fontColor=#ffffff;buttonText=' + ';barPos=30;align=center;sketch=0;whiteSpace=wrap;', sizeX * 0.87, sizeY * 0.075, 'Downloading 2 of 6', 'Download bar', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iScreenNameBar;fillColor2=#000000;fillColor3=#ffffff;buttonText=;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;align=center;sketch=0;', sizeX * 0.87, sizeY * 0.0625, 'Screen Name', 'Screen name bar', null, null, null),
			this.createVertexTemplateEntry(s + 'iIconGrid;gridSize=3,3;', sizeX * 0.75, sizeY * 0.375, '', 'Icon grid', null, null, null),
			this.createVertexTemplateEntry(s2 + 'iCopy;fillColor=#000000;buttonText=;fontColor=#ffffff;spacingBottom=6;fontSize=9;fillColor2=#000000;fillColor3=#ffffff;align=center;sketch=0;whiteSpace=wrap;', sizeX * 0.2, sizeY * 0.06875, 'Copy', 'Copy', null, null, null),
			
			this.addEntry(null, function()
			{
			   	var bg = new mxCell('Copy', new mxGeometry(sizeX * 0.05, 0, sizeX * 0.2, sizeY * 0.06875), s4 + 'iCopy;fillColor=#000000;buttonText=;fontColor=#ffffff;spacingBottom=6;fontSize=9;fillColor2=#000000;fillColor3=#ffffff;align=center;sketch=0;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var area1 = new mxCell('', new mxGeometry(0, sizeY * 0.06875, sizeX * 0.3, sizeY * 0.13125), s4 + 'rect;fillColor=#2266ff;strokeColor=none;opacity=30;sketch=0;');
			   	area1.vertex = true;
			   	
				return sb.createVertexTemplateFromCells([bg, area1], sizeX * 0.3, sizeY * 0.2, 'Copy Area');
			}),
			
			this.createVertexTemplateEntry(s + 'iHomePageControl;fillColor=#666666;strokeColor=#cccccc;sketch=0;', sizeX * 0.25, sizeY * 0.0125, '', 'Home page control', null, null, null),
			this.createVertexTemplateEntry(s + 'iPageControl;fillColor=#666666;strokeColor=#cccccc;sketch=0;', sizeX * 0.25, sizeY * 0.0125, '', 'Page control', null, null, null)
			
		];

		this.addPalette('ios', 'iOS6', false, mxUtils.bind(this, function(content)
				{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
		
		this.setCurrentSearchEntryLibrary();
	};
	
})();
