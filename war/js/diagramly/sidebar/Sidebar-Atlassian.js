(function()
{
	// Adds Bootstrap shapes
	Sidebar.prototype.addAtlassianPalette = function()
	{
		var s = 'html=1;shadow=0;dashed=0;shape=mxgraph.atlassian.';
		var s2 = 'html=1;shadow=0;dashed=0;fillColor=none;strokeColor=none;shape=mxgraph.bootstrap.rect;';
		var s3 = mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var gn = 'mxgraph.atlassian';
		var dt = 'atlassian ';
		var sb = this;
		
		var fns = [
			 this.createVertexTemplateEntry('dashed=0;html=1;shape=mxgraph.webicons.atlassian;fillColor=#FFFFFF;gradientColor=#DFDEDE',
					 100, 100, '', 'Atlassian', null, null, this.getTagsForStencil(gn, 'atlassian', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;shape=mxgraph.webicons.bitbucket;fillColor=#FFFFFF;gradientColor=#DFDEDE',
					 100, 100, '', 'Bitbucket', null, null, this.getTagsForStencil(gn, 'bitbucket', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;shape=mxgraph.webicons.confluence;fillColor=#FFFFFF;gradientColor=#DFDEDE',
					 100, 100, '', 'Confluence', null, null, this.getTagsForStencil(gn, 'confluence', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;shape=mxgraph.weblogos.atlassian;fillColor=#59AFE1;strokeColor=none',
					 60, 55, '', 'Atlassian', null, null, this.getTagsForStencil(gn, 'atlassian', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;shape=mxgraph.weblogos.bitbucket;fillColor=#205081;strokeColor=none',
					 65, 75, '', 'Bitbucket', null, null, this.getTagsForStencil(gn, 'bitbucket', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;shape=mxgraph.weblogos.confluence;fillColor=#1F5081;strokeColor=none',
					 78, 67, '', 'Confluence', null, null, this.getTagsForStencil(gn, 'confluence', dt).join(' ')),
			this.createVertexTemplateEntry('shape=ellipse;fillColor=#6554C0;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=46;fontStyle=1;html=1', 
					96, 96, 'MM', 'Avatar (Large)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'avatar').join(' ')),
			this.createVertexTemplateEntry('shape=ellipse;fillColor=#0065FF;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=25;fontStyle=1;html=1', 
					48, 48, 'MM', 'Avatar (Main)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'avatar').join(' ')),
			this.createVertexTemplateEntry('shape=ellipse;fillColor=#36B37E;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=17;fontStyle=1;html=1', 
					32, 32, 'MM', 'Avatar (Normal)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'avatar').join(' ')),
			this.createVertexTemplateEntry('shape=ellipse;fillColor=#FFAB00;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=12;fontStyle=1;html=1', 
					24, 24, 'MM', 'Avatar (Small)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'avatar').join(' ')),
			this.createVertexTemplateEntry('shape=ellipse;fillColor=#FF5630;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=10;fontStyle=1;html=1', 
					16, 16, 'M', 'Avatar (Tiny)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'avatar').join(' ')),
					
			this.addEntry(dt + 'avatar available', function()
	   		{
			   	var bg = new mxCell('MM', new mxGeometry(0, 0, 32, 32), 'shape=ellipse;fillColor=#6554C0;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=17;fontStyle=1;html=1');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 1, 10, 10), 'shape=ellipse;fillColor=#36B37E;strokeColor=#ffffff;strokeWidth=2;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-10, -10);
			   	button1.vertex = true;
			   	bg.insert(button1);
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Avatar (Available)');
			}),
			this.addEntry(dt + 'avatar away', function()
	   		{
			   	var bg = new mxCell('MM', new mxGeometry(0, 0, 32, 32), 'shape=ellipse;fillColor=#FFAB00;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=17;fontStyle=1;html=1');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 1, 10, 10), s + 'away;fillColor=#7A869A;strokeColor=#ffffff;strokeWidth=2;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-10, -10);
			   	button1.vertex = true;
			   	bg.insert(button1);
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Avatar (Away)');
			}),
			this.addEntry(dt + 'avatar do not disturb unavailable', function()
	   		{
			   	var bg = new mxCell('MM', new mxGeometry(0, 0, 32, 32), 'shape=ellipse;fillColor=#0065FF;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=17;fontStyle=1;html=1');
			   	bg.vertex = true;
			   	var button1 = new mxCell('', new mxGeometry(1, 1, 10, 10), s + 'do_not_disturb;fillColor=#FF5630;strokeColor=#ffffff;strokeWidth=2;');
			   	button1.geometry.relative = true;
			   	button1.geometry.offset = new mxPoint(-10, -10);
			   	button1.vertex = true;
			   	bg.insert(button1);
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Avatar (Do not disturb)');
			}),

			this.createVertexTemplateEntry('shape=rect;rounded=1;arcSize=5;fillColor=#0065FF;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=14;fontStyle=1;html=1', 
					40, 40, '&lt;/&gt;', 'Container Avatar (Large)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'container avatar large').join(' ')),
			this.createVertexTemplateEntry('shape=rect;rounded=1;arcSize=5;fillColor=#0065FF;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=12;fontStyle=1;html=1', 
					32, 32, '&lt;/&gt;', 'Container Avatar (Medium)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'container avatar medium').join(' ')),
			this.createVertexTemplateEntry('shape=rect;rounded=1;arcSize=5;fillColor=#0065FF;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=10;fontStyle=1;html=1', 
					24, 24, '&lt;/&gt;', 'Container Avatar (Small)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'container avatar small').join(' ')),
					
			this.createVertexTemplateEntry('shape=ellipse;fillColor=#0065FF;strokeColor=none;html=1', 
					10, 10, '', 'Dot Badge', null, null, this.getTagsForStencil(gn, '', dt + 'dot badge').join(' ')),
			this.createVertexTemplateEntry('shape=rect;rounded=1;fillColor=#0065FF;strokeColor=none;html=1;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=18;fontStyle=1;arcSize=50', 
					40, 25, '13', 'Bold Badge', null, null, this.getTagsForStencil(gn, '', dt + 'bold badge').join(' ')),
			this.createVertexTemplateEntry('shape=rect;rounded=1;fillColor=#E3FCEF;strokeColor=none;html=1;fontColor=#016745;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=18;fontStyle=0;arcSize=50', 
					40, 25, '+1', 'Subtle Badge', null, null, this.getTagsForStencil(gn, '', dt + 'subtle badge').join(' ')),

			this.addEntry(dt + 'banner', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 625, 50), 'shape=rect;rounded=0;fillColor=#FFAB00;strokeColor=none;html=1');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('<b>More information?</b> See the <u>recovery process documentation</u>.', 
			   			new mxGeometry(0.15, 0.5, 20, 20), 'shape=mxgraph.azure.azure_alert;fillColor=#172B4C;strokeColor=none;fontColor=#172B4C;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;html=1;spacingLeft=5');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(0, -10);
			   	icon1.vertex = true;
			   	bg.insert(icon1);
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Banner');
			}),
			this.addEntry(dt + 'banner', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 625, 50), 'shape=rect;rounded=0;fillColor=#DE350A;strokeColor=none;html=1');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('A database error has occurred. Please reload the page.', 
			   			new mxGeometry(0.15, 0.5, 20, 20), 'shape=mxgraph.azure.azure_alert;fillColor=#ffffff;strokeColor=none;fontColor=#ffffff;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;html=1;spacingLeft=5');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(0, -10);
			   	icon1.vertex = true;
			   	bg.insert(icon1);
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Banner');
			}),
			this.createVertexTemplateEntry('fillColor=none;strokeColor=none;html=1;fontColor=#596780;align=left;verticalAlign=middle;whiteSpace=wrap;fontSize=12;fontStyle=0', 
					360, 25, 'Atlassian / Atlassian Connect / atlassian-connect-js-extra', 'Breadcrumb', null, null, this.getTagsForStencil(gn, '', dt + 'breadcrumb').join(' ')),
					
			this.addEntry(dt + 'button primary', function()
	   		{
			   	var bg = new mxCell('Pay now', new mxGeometry(25, 0, 86, 33), 'shape=rect;rounded=1;fillColor=#0057D8;align=center;strokeColor=none;html=1;fontColor=#ffffff;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'checkbox;fillColor=#008465;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 111, 33, 'Button (Primary)');
			}),
			this.addEntry(dt + 'button standard', function()
	   		{
			   	var bg = new mxCell('Create Group', new mxGeometry(25, 0, 115, 33), 'shape=rect;rounded=1;align=center;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'checkbox;fillColor=#008465;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 140, 33, 'Button (Standard)');
			}),
			this.addEntry(dt + 'button link', function()
	   		{
			   	var bg = new mxCell('Visit documentation', new mxGeometry(25, 0, 125, 33), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontColor=#0057D8;align=left;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'checkbox;fillColor=#008465;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 150, 33, 'Button (Link)');
			}),
			this.addEntry(dt + 'button primary', function()
	   		{
			   	var bg = new mxCell('Submit', new mxGeometry(25, 0, 80, 33), 'shape=rect;rounded=1;fillColor=#0057D8;align=center;strokeColor=none;html=1;fontColor=#ffffff;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'close;fillColor=#BA3200;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 105, 33, 'Button (Primary)');
			}),
			this.addEntry(dt + 'button standard', function()
	   		{
			   	var bg = new mxCell('Done', new mxGeometry(25, 0, 55, 33), 'shape=rect;rounded=1;align=center;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'close;fillColor=#BA3200;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 80, 33, 'Button (Standard)');
			}),
			this.addEntry(dt + 'button link', function()
	   		{
			   	var bg = new mxCell('Click here', new mxGeometry(25, 0, 75, 33), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontColor=#0057D8;align=left;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'close;fillColor=#BA3200;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 100, 33, 'Button (Link)');
			}),
					
			this.createVertexTemplateEntry('shape=rect;rounded=1;fillColor=#0057D8;strokeColor=none;html=1;fontColor=#ffffff;align=center;verticalAlign=middle;fontStyle=0;fontSize=12', 
					86, 33, 'Primary', 'Button (Primary)', null, null, this.getTagsForStencil(gn, '', dt + 'button primary').join(' ')),
			this.createVertexTemplateEntry('shape=rect;rounded=1;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;align=center;verticalAlign=middle;fontStyle=0;fontSize=12', 
					86, 33, 'Standard', 'Button (Standard)', null, null, this.getTagsForStencil(gn, '', dt + 'button standard').join(' ')),
			this.createVertexTemplateEntry('fillColor=none;strokeColor=none;html=1;fontColor=#0057D8;align=center;verticalAlign=middle;fontStyle=0;fontSize=12', 
					86, 33, 'Link button', 'Button (Link)', null, null, this.getTagsForStencil(gn, '', dt + 'button link').join(' ')),
			this.addEntry(dt + 'dropdown button', function()
	   		{
			   	var bg = new mxCell('Dropdown button', new mxGeometry(0, 0, 140, 33), 'shape=rect;rounded=1;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;align=left;fontSize=12;spacingLeft=10');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 12, 6), 'shape=triangle;direction=south;fillColor=#596780;strokeColor=none;html=1');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-20, -3);
			   	icon1.vertex = true;
			   	bg.insert(icon1);
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button (dropdown)');
			}),
			this.addEntry(dt + 'button label only', function()
	   		{
			   	var bg = new mxCell('Label only', new mxGeometry(0, 0, 80, 33), 'shape=rect;rounded=1;align=center;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg], 80, 33, 'Button (label only)');
			}),
			this.addEntry(dt + 'button icon and label', function()
	   		{
			   	var bg = new mxCell('Icon and label', new mxGeometry(0, 0, 120, 33), 'shape=rect;rounded=1;align=left;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12;spacingLeft=26;');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', 
			   			new mxGeometry(0, 0.5, 12, 12), 'shape=mxgraph.mscae.intune.subscription_portal;fillColor=#596780;strokeColor=none;fontColor=#ffffff;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;html=1;spacingLeft=5');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(10, -6);
			   	icon1.vertex = true;
			   	bg.insert(icon1);
		   		return sb.createVertexTemplateFromCells([bg], 120, 33, 'Button (icon and label)');
			}),
			this.addEntry(dt + 'button icon only', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 32, 33), 'shape=rect;rounded=1;align=left;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12;spacingLeft=26;');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', 
			   			new mxGeometry(0, 0.5, 12, 12), 'shape=mxgraph.mscae.intune.subscription_portal;fillColor=#596780;strokeColor=none;fontColor=#ffffff;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;html=1;spacingLeft=5');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(10, -6);
			   	icon1.vertex = true;
			   	bg.insert(icon1);
		   		return sb.createVertexTemplateFromCells([bg], 32, 33, 'Button (icon only)');
			}),
			this.addEntry(dt + 'button subtle', function()
	   		{
			   	var bg = new mxCell('Subtle', new mxGeometry(0, 0, 80, 33), 'shape=rect;rounded=1;align=left;fillColor=none;strokeColor=none;html=1;fontColor=#596780;fontSize=12;spacingLeft=26;');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', 
			   			new mxGeometry(0, 0.5, 12, 12), 'shape=mxgraph.mscae.intune.subscription_portal;fillColor=#596780;strokeColor=none;fontColor=#ffffff;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;html=1;spacingLeft=5');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(10, -6);
			   	icon1.vertex = true;
			   	bg.insert(icon1);
		   		return sb.createVertexTemplateFromCells([bg], 80, 33, 'Button (subtle)');
			}),
			this.addEntry(dt + 'button disabled', function()
	   		{
			   	var bg = new mxCell('Disabled button', new mxGeometry(0, 0, 110, 33), 'shape=rect;rounded=1;align=center;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#A5ADBA;fontSize=12');
			   	bg.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg], 110, 33, 'Button (disabled)');
			}),
			this.addEntry(dt + 'split button', function()
	   		{
			   	var bg = new mxCell('Split', new mxGeometry(0, 0, 80, 33), 'shape=rect;rounded=1;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;align=left;fontSize=12;spacingLeft=10');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 12, 6), 'shape=triangle;direction=south;fillColor=#596780;strokeColor=none;html=1');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-20, -3);
			   	icon1.vertex = true;
			   	bg.insert(icon1);
			   	var icon2 = new mxCell('', new mxGeometry(1, 0, 12, 33), 'shape=line;direction=south;strokeColor=#ffffff;html=1;strokeWidth=2');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(-35, 0);
			   	icon2.vertex = true;
			   	bg.insert(icon2);
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button (split)');
			}),
			this.addEntry(dt + 'button grouped', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 33), s3 + 'rrect;rSize=10;fillColor=#F1F2F4;strokeColor=#ffffff;strokeWidth=2');
			   	bg.vertex = true;
			   	var button2 = new mxCell('Button 2', new mxGeometry(0, 0, 80, 33), s3 + 'rrect;rSize=0;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(80, 0);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Button 3', new mxGeometry(0, 0, 80, 33), s3 + 'rrect;rSize=0;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(160, 0);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Button 4', new mxGeometry(1, 0, 80, 33), s3 + 'rightButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(-80, 0);
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button1 = new mxCell('Button 1', new mxGeometry(0, 0, 80, 33), s3 + 'leftButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button (grouped)');
			}),
			this.addEntry(dt + 'button compact', function()
	   		{
			   	var bg = new mxCell('Compact', new mxGeometry(0, 0, 86, 33), 'shape=rect;rounded=1;fillColor=#F1F2F4;align=center;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(107, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon1.vertex = true;
			   	var icon2 = new mxCell('', new mxGeometry(117, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon2.vertex = true;
			   	var icon3 = new mxCell('', new mxGeometry(127, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon3.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1, icon2, icon3], 133, 33, 'Button (compact)');
			}),
			this.addEntry(dt + 'button grouped group', function()
	   		{
			   	var bg1 = new mxCell('Edit', new mxGeometry(0, 0, 50, 33), 'shape=rect;rounded=1;fillColor=#0065FF;align=center;strokeColor=none;html=1;fontColor=#ffffff;fontSize=12');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Comment', new mxGeometry(55, 0, 80, 33), 'shape=rect;rounded=1;fillColor=#F1F2F4;align=center;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg2.vertex = true;
			   	var bg3 = new mxCell('Assign', new mxGeometry(140, 0, 70, 33), 'shape=rect;rounded=1;fillColor=#F1F2F4;align=center;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg3.vertex = true;
			   	
			   	var bg4 = new mxCell('', new mxGeometry(215, 0, 240, 33), s3 + 'rrect;rSize=10;fillColor=#F1F2F4;strokeColor=#ffffff;strokeWidth=2');
			   	bg4.vertex = true;
			   	var button2 = new mxCell('In Progress', new mxGeometry(0, 0, 90, 33), s3 + 'rrect;rSize=0;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(60, 0);
			   	button2.vertex = true;
			   	bg4.insert(button2);
			   	var button3 = new mxCell('Workflow', new mxGeometry(1, 0, 90, 33), mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=left;html=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.mockup.rightButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;spacingLeft=10;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(-90, 0);
			   	button3.vertex = true;
			   	bg4.insert(button3);
			   	var button1 = new mxCell('Later', new mxGeometry(0, 0, 60, 33), s3 + 'leftButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg4.insert(button1);
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 12, 6), 'shape=triangle;direction=south;fillColor=#596780;strokeColor=none;html=1');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-20, -3);
			   	icon1.vertex = true;
			   	button3.insert(icon1);
			   	
			   	var bg5 = new mxCell('', new mxGeometry(500, 0, 56, 33), 'shape=rect;rounded=1;fillColor=#F1F2F4;align=center;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg5.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(15, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon1.vertex = true;
			   	bg5.insert(icon1);
			   	var icon2 = new mxCell('', new mxGeometry(25, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon2.vertex = true;
			   	bg5.insert(icon2);
			   	var icon3 = new mxCell('', new mxGeometry(35, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon3.vertex = true;
			   	bg5.insert(icon3);
		   		return sb.createVertexTemplateFromCells([bg1, bg2, bg3, bg4, bg5], 556, 33, 'Button (grouped)');
			}),
			this.addEntry(dt + 'button grouped group responsive', function()
	   		{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 230, 33), s3 + 'rrect;rSize=10;fillColor=#F1F2F4;strokeColor=#ffffff;strokeWidth=2');
			   	bg1.vertex = true;
			   	var button1 = new mxCell('Assign', new mxGeometry(0, 0, 60, 33), s3 + 'leftButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg1.insert(button1);
			   	var button2 = new mxCell('Assign to me', new mxGeometry(0, 0, 90, 33), s3 + 'rrect;rSize=0;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(60, 0);
			   	button2.vertex = true;
			   	bg1.insert(button2);
			   	var button3 = new mxCell('Comment', new mxGeometry(1, 0, 80, 33), s3 + 'rightButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(-80, 0);
			   	button3.vertex = true;
			   	bg1.insert(button3);
			   	var bg2 = new mxCell('', new mxGeometry(250, 0, 116, 33), s3 + 'rrect;rSize=10;fillColor=#F1F2F4;strokeColor=#ffffff;strokeWidth=2');
			   	bg2.vertex = true;
			   	var button4 = new mxCell('Assign', new mxGeometry(0, 0, 60, 33), s3 + 'leftButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button4.geometry.relative = true;
			   	button4.vertex = true;
			   	bg2.insert(button4);
			   	var button5 = new mxCell('', new mxGeometry(1, 0, 56, 33), s3 + 'rightButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button5.geometry.relative = true;
			   	button5.geometry.offset = new mxPoint(-56, 0);
			   	button5.vertex = true;
			   	bg2.insert(button5);
			   	var icon1 = new mxCell('', new mxGeometry(15, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon1.vertex = true;
			   	button5.insert(icon1);
			   	var icon2 = new mxCell('', new mxGeometry(25, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon2.vertex = true;
			   	button5.insert(icon2);
			   	var icon3 = new mxCell('', new mxGeometry(35, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon3.vertex = true;
			   	button5.insert(icon3);
			   	var bg3 = new mxCell('', new mxGeometry(386, 0, 116, 33), s3 + 'rrect;rSize=10;fillColor=#F1F2F4;strokeColor=#ffffff;strokeWidth=2');
			   	bg3.vertex = true;
			   	var button4 = new mxCell('Assign', new mxGeometry(0, 0, 60, 33), s3 + 'leftButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=none;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button4.geometry.relative = true;
			   	button4.vertex = true;
			   	bg3.insert(button4);
			   	var button5 = new mxCell('', new mxGeometry(1, 0, 56, 33), s3 + 'rightButton;rSize=10;fontSize=12;fontColor=#596780;fontStyle=0;fillColor=#42526E;strokeColor=#ffffff;strokeWidth=2;resizeHeight=1;');
			   	button5.geometry.relative = true;
			   	button5.geometry.offset = new mxPoint(-56, 0);
			   	button5.vertex = true;
			   	bg3.insert(button5);
			   	var icon1 = new mxCell('', new mxGeometry(15, 13, 6, 6), 'shape=ellipse;fillColor=#ffffff;strokeColor=none;html=1');
			   	icon1.vertex = true;
			   	button5.insert(icon1);
			   	var icon2 = new mxCell('', new mxGeometry(25, 13, 6, 6), 'shape=ellipse;fillColor=#ffffff;strokeColor=none;html=1');
			   	icon2.vertex = true;
			   	button5.insert(icon2);
			   	var icon3 = new mxCell('', new mxGeometry(35, 13, 6, 6), 'shape=ellipse;fillColor=#ffffff;strokeColor=none;html=1');
			   	icon3.vertex = true;
			   	button5.insert(icon3);
			   	var bg4 = new mxCell('Edit issue\n\nComment', new mxGeometry(446, 38, 105, 66), s3 + 'rrect;rSize=10;fillColor=#42526E;strokeColor=#ffffff;strokeWidth=2;fontSize=12;fontColor=#ffffff;fontStyle=0');
			   	bg4.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg1, bg2, bg3, bg4], 551, 104, 'Button (grouped, responsive)');
			}),
					
			this.createVertexTemplateEntry(s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10', 
					12, 12, 'Text', 'Checkbox (on)', null, null, this.getTagsForStencil(gn, '', dt + 'checkbox on').join(' ')),
			this.createVertexTemplateEntry('shape=rect;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0', 
					12, 12, 'Text', 'Checkbox (off)', null, null, this.getTagsForStencil(gn, '', dt + 'checkbox on').join(' ')),
					
			this.addEntry(dt + 'checkbox group', function()
	   		{
			   	var item1 = new mxCell('Selected coffees', new mxGeometry(0, 0, 150, 20), 'shape=rect;fillColor=none;strokeColor=none;fontSize=11;fontStyle=1;align=left;fontColor=#596780');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Espresso', new mxGeometry(10, 30, 12, 12), 'shape=rect;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item2.vertex = true;
			   	var item3 = new mxCell('Cappuccino', new mxGeometry(10, 55, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item3.vertex = true;
			   	var item4 = new mxCell('Flat white', new mxGeometry(10, 80, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item4.vertex = true;
			   	var item5 = new mxCell('Long black', new mxGeometry(10, 105, 12, 12), 'shape=rect;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item5.vertex = true;
			   	var item6 = new mxCell('Add', new mxGeometry(0, 140, 60, 33), 'shape=rect;rounded=1;fillColor=#0057D8;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;fontStyle=0;fontSize=14;html=1;shadow=0;dashed=0');
			   	item6.vertex = true;
			   	var item7 = new mxCell('Cancel', new mxGeometry(70, 140, 60, 33), 'shape=rect;fillColor=none;strokeColor=none;fontColor=#596780;align=center;verticalAlign=middle;fontStyle=0;fontSize=14;html=1;shadow=0;dashed=0');
			   	item7.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2, item3, item4, item5, item6, item7], 150, 173, 'Checkbox group');
			}),
					
			this.addEntry(dt + 'dropdown button', function()
	   		{
			   	var item1 = new mxCell('Status', new mxGeometry(0, 0, 100, 20), 'shape=rect;rounded=1;fillColor=none;strokeColor=none;html=1;fontColor=#596780;align=left;fontSize=11;spacingLeft=10;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Workflow', new mxGeometry(0, 20, 100, 33), 'shape=rect;rounded=1;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;align=left;fontSize=12;spacingLeft=10');
			   	item2.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 12, 6), 'shape=triangle;direction=south;fillColor=#596780;strokeColor=none;html=1');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-20, -3);
			   	icon1.vertex = true;
			   	item2.insert(icon1);
		   		return sb.createVertexTemplateFromCells([item1, item2], 100, 53, 'Button (dropdown)');
			}),
					
			this.addEntry(dt + 'dropdown button open', function()
	   		{
			   	var item1 = new mxCell('Status', new mxGeometry(0, 0, 100, 20), 'shape=rect;rounded=1;fillColor=none;strokeColor=none;html=1;fontColor=#596780;align=left;fontSize=11;spacingLeft=10;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Workflow', new mxGeometry(0, 20, 100, 33), 'shape=rect;rounded=1;fillColor=#253858;strokeColor=none;html=1;fontColor=#ffffff;align=left;fontSize=12;spacingLeft=10');
			   	item2.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 12, 6), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;html=1');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-20, -3);
			   	icon1.vertex = true;
			   	item2.insert(icon1);
			   	var item3 = new mxCell('', new mxGeometry(0, 56, 110, 144), 'shape=rect;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;shadow=1;html=1;arcSize=4');
			   	item3.vertex = true;
			   	var item4 = new mxCell('Closed', new mxGeometry(0, 0, 110, 33), 'shape=rect;rounded=0;fillColor=#F4F5F7;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;spacingLeft=10;fontColor=#253858;resizeWidth=1');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(0, 6);
			   	item4.vertex = true;
			   	item3.insert(item4);
			   	var item5 = new mxCell('Reviewed', new mxGeometry(0, 0, 110, 33), 'shape=rect;rounded=0;fillColor=none;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;spacingLeft=10;fontColor=#253858;resizeWidth=1');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(0, 39);
			   	item5.vertex = true;
			   	item3.insert(item5);
			   	var item6 = new mxCell('Abandoned', new mxGeometry(0, 0, 110, 33), 'shape=rect;rounded=0;fillColor=none;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;spacingLeft=10;fontColor=#253858;resizeWidth=1');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(0, 72);
			   	item6.vertex = true;
			   	item3.insert(item6);
			   	var item7 = new mxCell('Workflow', new mxGeometry(0, 0, 110, 33), 'shape=rect;rounded=0;fillColor=none;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;spacingLeft=10;fontColor=#253858;resizeWidth=1');
			   	item7.geometry.relative = true;
			   	item7.geometry.offset = new mxPoint(0, 105);
			   	item7.vertex = true;
			   	item3.insert(item7);
		   		return sb.createVertexTemplateFromCells([item1, item2, item3], 110, 200, 'Button (dropdown, open)');
			}),
			this.addEntry(dt + 'dropdown avatar', function()
	   		{
			   	var item1 = new mxCell('Choose a designer', new mxGeometry(0, 0, 120, 20), 'shape=rect;rounded=1;fillColor=none;strokeColor=none;html=1;fontColor=#596780;align=left;fontSize=11;spacingLeft=10;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('', new mxGeometry(0, 20, 150, 33), 'shape=rect;rounded=1;fillColor=#253858;strokeColor=none;html=1;');
			   	item2.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 12, 6), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;html=1');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-20, -3);
			   	icon1.vertex = true;
			   	item2.insert(icon1);
			   	var icon2 = new mxCell('Paige Turner', new mxGeometry(0, 0.5, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#ffffff;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(10, -12);
			   	icon2.vertex = true;
			   	item2.insert(icon2);
			   	var item3 = new mxCell('', new mxGeometry(0, 56, 160, 111), 'shape=rect;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;shadow=1;html=1;arcSize=4');
			   	item3.vertex = true;
			   	var item4 = new mxCell('', new mxGeometry(0, 0, 160, 33), 'shape=rect;rounded=0;fillColor=#F4F5F7;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;spacingLeft=10;fontColor=#253858;resizeWidth=1');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(0, 6);
			   	item4.vertex = true;
			   	item3.insert(item4);
			   	var icon3 = new mxCell('Paige Turner', new mxGeometry(0, 0.5, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(10, -12);
			   	icon3.vertex = true;
			   	item4.insert(icon3);
			   	var item5 = new mxCell('', new mxGeometry(0, 0, 160, 33), 'shape=rect;rounded=0;fillColor=none;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;spacingLeft=10;fontColor=#253858;resizeWidth=1');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(0, 39);
			   	item5.vertex = true;
			   	item3.insert(item5);
			   	var icon3 = new mxCell('Sam Samuels', new mxGeometry(0, 0.5, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(10, -12);
			   	icon3.vertex = true;
			   	item5.insert(icon3);
			   	var item6 = new mxCell('', new mxGeometry(0, 0, 160, 33), 'shape=rect;rounded=0;fillColor=none;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;spacingLeft=10;fontColor=#253858;resizeWidth=1');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(0, 72);
			   	item6.vertex = true;
			   	item3.insert(item6);
			   	var icon3 = new mxCell('Casey Chambers', new mxGeometry(0, 0.5, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(10, -12);
			   	icon3.vertex = true;
			   	item6.insert(icon3);
			   	
		   		return sb.createVertexTemplateFromCells([item1, item2, item3], 160, 167, 'Button (avatar)');
			}),
			this.addEntry(dt + 'flag message', function()
	   		{
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 333, 90), 'shape=rect;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;shadow=1;html=1;arcSize=4');
			   	item1.vertex = true;
			   	var icon1 = new mxCell('START-85 has been created', new mxGeometry(0, 0, 14, 14), s + 'checkbox;fillColor=#36B37E;strokeColor=none;html=1;fontSize=14;fontStyle=0;labelPosition=right;align=left;spacingLeft=20');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(25, 25);
			   	icon1.vertex = true;
			   	item1.insert(icon1);
			   	var icon2 = new mxCell('View issue  &#8226;  Add to next sprint', new mxGeometry(0, 0, 260, 20), s + 'checkbox;fillColor=none;strokeColor=none;html=1;fontSize=14;fontStyle=0;fontColor=#0049B0;align=left;');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(60, 50);
			   	icon2.vertex = true;
			   	item1.insert(icon2);
			   	var icon3 = new mxCell('', new mxGeometry(1, 0, 14, 14), s + 'x;strokeColor=#B3B3B3;strokeWidth=2');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(-39, 25);
			   	icon3.vertex = true;
			   	item1.insert(icon3);
		   		return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Flag message');
			}),
			this.addEntry(dt + 'multiple flag message', function()
	   		{
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 333, 150), 'shape=rect;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;shadow=1;html=1;arcSize=4');
			   	item1.vertex = true;
			   	var icon1 = new mxCell('Nifty concise title', new mxGeometry(0, 0, 14, 14), 'shape=mxgraph.azure.azure_alert;fillColor=#FF5630;strokeColor=none;html=1;fontSize=14;fontStyle=0;labelPosition=right;align=left;spacingLeft=20');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(25, 25);
			   	icon1.vertex = true;
			   	item1.insert(icon1);
			   	var icon2 = new mxCell("It's best if the title is in sentence case and this description text is super informative and awesome.", new mxGeometry(0, 0, 230, 60), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontSize=14;fontStyle=0;fontColor=#000000;align=left;whiteSpace=wrap');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(60, 50);
			   	icon2.vertex = true;
			   	item1.insert(icon2);
			   	var icon3 = new mxCell('', new mxGeometry(1, 0, 14, 14), s + 'x;strokeColor=#B3B3B3;strokeWidth=2');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(-39, 25);
			   	icon3.vertex = true;
			   	item1.insert(icon3);
			   	var icon4 = new mxCell('Link to more info  &#8226;  Link to action', new mxGeometry(0, 0, 230, 20), s + 'checkbox;fillColor=none;strokeColor=none;html=1;fontSize=14;fontStyle=0;fontColor=#0049B0;align=left;');
			   	icon4.geometry.relative = true;
			   	icon4.geometry.offset = new mxPoint(60, 112);
			   	icon4.vertex = true;
			   	item1.insert(icon4);
		   		return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Multiple flag message');
			}),
			this.addEntry(dt + 'flag message', function()
	   		{
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 333, 120), 'shape=rect;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;shadow=1;html=1;arcSize=4');
			   	item1.vertex = true;
			   	var icon1 = new mxCell('You are now connected', new mxGeometry(0, 0, 14, 14), s + 'checkbox;fillColor=#36B37E;strokeColor=none;html=1;fontSize=14;fontStyle=0;labelPosition=right;align=left;spacingLeft=20');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(25, 25);
			   	icon1.vertex = true;
			   	item1.insert(icon1);
			   	var icon2 = new mxCell('You have been added to the group "Find the Haiku on this site."', new mxGeometry(0, 0, 230, 60), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontSize=14;fontStyle=0;fontColor=#000000;align=left;whiteSpace=wrap');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(60, 50);
			   	icon2.vertex = true;
			   	item1.insert(icon2);
			   	var icon3 = new mxCell('', new mxGeometry(1, 0, 14, 14), s + 'x;strokeColor=#B3B3B3;strokeWidth=2');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(-39, 25);
			   	icon3.vertex = true;
			   	item1.insert(icon3);
		   		return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Flag message');
			}),
			this.addEntry(dt + 'inline dialog', function()
	   		{
			   	var item1 = new mxCell('', new mxGeometry(0, 0, 292, 190), 'shape=rect;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;shadow=1;html=1;arcSize=4');
			   	item1.vertex = true;
			   	var icon1 = new mxCell('Use the HipChat app', new mxGeometry(0, 0, 240, 20), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontSize=14;fontStyle=1;align=left');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(25, 21);
			   	icon1.vertex = true;
			   	item1.insert(icon1);
			   	var icon2 = new mxCell('Would you rather open links in the HipChat application instead of your browser?', new mxGeometry(0, 0, 240, 60), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontSize=14;fontStyle=0;fontColor=#000000;align=left;whiteSpace=wrap');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(25, 50);
			   	icon2.vertex = true;
			   	item1.insert(icon2);
			   	var icon3 = new mxCell('Open in the HipChat app?', new mxGeometry(0, 0, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(30, 120);
			   	icon3.vertex = true;
			   	item1.insert(icon3);
			   	var icon4 = new mxCell('Don&apos;t have the app? <font color="#0057d8">Get it!</font>', new mxGeometry(0, 0, 240, 20), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontSize=14;fontStyle=0;fontColor=#000000;align=left;whiteSpace=wrap');
			   	icon4.geometry.relative = true;
			   	icon4.geometry.offset = new mxPoint(25, 152);
			   	icon4.vertex = true;
			   	item1.insert(icon4);
			   	var item2 = new mxCell('', new mxGeometry(242, 195, 50, 33), 'shape=rect;rounded=1;fillColor=#42526E;strokeColor=none;shadow=0;html=1;arcSize=12');
			   	item2.vertex = true;
			   	var icon5 = new mxCell('', new mxGeometry(0.5, 0.5, 20, 20), 'shape=mxgraph.mscae.enterprise.settings;fillColor=#ffffff;strokeColor=none');
			   	icon5.geometry.relative = true;
			   	icon5.geometry.offset = new mxPoint(-10, -10);
			   	icon5.vertex = true;
			   	item2.insert(icon5);
		   		return sb.createVertexTemplateFromCells([item1, item2], 292, 228, 'Inline dialog');
			}),
			this.addEntry(dt + 'inline dialog', function()
	   		{
			   	var bg1 = new mxCell('20', new mxGeometry(0, 0, 40, 20), 'shape=rect;rounded=1;fillColor=#DEE1E6;strokeColor=none;shadow=0;html=1;arcSize=50;fontSize=12;align=center;verticalAlign=middle');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Start watching this issue', new mxGeometry(40, 0, 200, 20), 'shape=rect;rounded=1;fillColor=none;strokeColor=none;shadow=0;html=1;arcSize=50;fontSize=12;align=left;verticalAlign=middle;spacingLeft=10');
			   	bg2.vertex = true;
			   	var bg3 = new mxCell('', new mxGeometry(0, 30, 340, 420), 'shape=rect;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;shadow=1;html=1;arcSize=1;fontFamily=Verdana;fontSize=14;fontColor=#000000;align=left;');
			   	bg3.vertex = true;
			   	var item1 = new mxCell('Add watchers', new mxGeometry(0, 0, 240, 20), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left');
			   	item1.geometry.relative = true;
			   	item1.geometry.offset = new mxPoint(25, 25);
			   	item1.vertex = true;
			   	bg3.insert(item1);
			   	var item2 = new mxCell('', new mxGeometry(0, 0, 290, 35), 'shape=rect;rounded=1;arcSize=9;fillColor=none;strokeColor=#4C9AFF;html=1;strokeWidth=2');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(25, 50);
			   	item2.vertex = true;
			   	bg3.insert(item2);
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 15, 15), 'shape=mxgraph.ios7.icons.looking_glass;fillColor=none;strokeColor=#243759;html=1;strokeWidth=2');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-30, -7.5);
			   	icon1.vertex = true;
			   	item2.insert(icon1);
			   	var icon2 = new mxCell('Paige Turner', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(25, 100);
			   	icon2.vertex = true;
			   	bg3.insert(icon2);
			   	var icon3 = new mxCell('Sam Samuels', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(25, 132);
			   	icon3.vertex = true;
			   	bg3.insert(icon3);
			   	var icon4 = new mxCell('Leana Stevens', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon4.geometry.relative = true;
			   	icon4.geometry.offset = new mxPoint(25, 164);
			   	icon4.vertex = true;
			   	bg3.insert(icon4);
			   	var icon5 = new mxCell('Casey Chambers', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon5.geometry.relative = true;
			   	icon5.geometry.offset = new mxPoint(25, 196);
			   	icon5.vertex = true;
			   	bg3.insert(icon5);
			   	var icon6 = new mxCell('Lisa Simpson', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon6.geometry.relative = true;
			   	icon6.geometry.offset = new mxPoint(25, 228);
			   	icon6.vertex = true;
			   	bg3.insert(icon6);
			   	var icon7 = new mxCell('Tammy McDonald', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon7.geometry.relative = true;
			   	icon7.geometry.offset = new mxPoint(25, 260);
			   	icon7.vertex = true;
			   	bg3.insert(icon7);
			   	var icon8 = new mxCell('Amy Turner', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon8.geometry.relative = true;
			   	icon8.geometry.offset = new mxPoint(25, 292);
			   	icon8.vertex = true;
			   	bg3.insert(icon8);
			   	var icon9 = new mxCell('Cristopher Bunnings', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon9.geometry.relative = true;
			   	icon9.geometry.offset = new mxPoint(25, 324);
			   	icon9.vertex = true;
			   	bg3.insert(icon9);
			   	var icon10 = new mxCell('Tyler Smith', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon10.geometry.relative = true;
			   	icon10.geometry.offset = new mxPoint(25, 356);
			   	icon10.vertex = true;
			   	bg3.insert(icon10);
			   	var icon11 = new mxCell('Cindy Hobbs', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=#ffffff;strokeColor=#253858;html=1;fontColor=#253858;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon11.geometry.relative = true;
			   	icon11.geometry.offset = new mxPoint(25, 388);
			   	icon11.vertex = true;
			   	bg3.insert(icon11);
		   		return sb.createVertexTemplateFromCells([bg1, bg2, bg3], 340, 450, 'Inline dialog');
			}),
			this.addEntry(dt + 'inline edit', function()
	   		{
			   	var item1 = new mxCell('Sprint', new mxGeometry(0, 0, 240, 20), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Android - 8 - Publish comments', new mxGeometry(0, 25, 290, 35), 'shape=rect;rounded=1;arcSize=9;fillColor=#ffffff;strokeColor=#4C9AFF;html=1;strokeWidth=2;spacingLeft=5');
			   	item2.vertex = true;
			   	var item3 = new mxCell('', new mxGeometry(0, 0, 240, 20), 'shape=rect;fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left');
			   	item3.vertex = true;
			   	var item4 = new mxCell('', new mxGeometry(300, 28, 29, 29), 'shape=rect;rounded=1;arcSize=12;fillColor=#F0F2F5;strokeColor=none;html=1');
			   	item4.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0.5, 0.5, 10, 8), s + 'check;strokeColor=#42526E;strokeWidth=2');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-5, -4);
			   	icon1.vertex = true;
			   	item4.insert(icon1);
			   	var icon2 = new mxCell('', new mxGeometry(340, 37, 10, 10), s + 'x;strokeColor=#42526E;strokeWidth=2');
			   	icon2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2, item3, item4, icon2], 350, 55, 'Inline edit');
			}),
			this.addEntry(dt + 'inline edit', function()
	   		{
			   	var item1 = new mxCell('Priority', new mxGeometry(0, 0, 130, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780');
			   	item1.vertex = true;
			   	var item2 = new mxCell('High', new mxGeometry(0, 25, 130, 35), 'rounded=1;arcSize=9;fillColor=#253858;strokeColor=none;html=1;strokeWidth=2;spacingLeft=30;fontColor=#ffffff;align=left');
			   	item2.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 0.5, 10, 14), 'shape=mxgraph.arrows2.sharpArrow2;dy1=0.82;dx1=4.02;dx2=5.92;dy3=0.26;dx3=7.37;notch=0;strokeColor=none;fillColor=#FF0000;direction=north;');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(10, -7);
			   	icon1.vertex = true;
			   	item2.insert(icon1);
			   	var icon2 = new mxCell('', new mxGeometry(1, 0.5, 10, 7), 'shape=step;whiteSpace=wrap;html=1;rounded=0;strokeColor=none;strokeWidth=2;fillColor=#FFFFFF;gradientColor=none;fontFamily=Verdana;fontSize=14;fontColor=#000000;align=left;direction=south;size=0.65;');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(-24, -3);
			   	icon2.vertex = true;
			   	item2.insert(icon2);
			   	var item3 = new mxCell('', new mxGeometry(0, 70, 130, 152), 'rounded=1;arcSize=3;fillColor=#ffffff;strokeColor=#DFE1E5;strokeWidth=1;shadow=1');
			   	item3.vertex = true;
			   	var item4 = new mxCell('Major', new mxGeometry(0, 0, 130, 33), 'align=left;spacingLeft=30;rounded=0;fillColor=#F4F5F7;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;fontColor=#253858;resizeWidth=1');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(0, 6);
			   	item4.vertex = true;
			   	item3.insert(item4);
			   	var icon3 = new mxCell('', new mxGeometry(0, 0.5, 10, 7), 'shape=step;whiteSpace=wrap;html=1;rounded=0;strokeColor=none;strokeWidth=2;fillColor=#ff0000;gradientColor=none;fontFamily=Verdana;fontSize=14;fontColor=#000000;align=left;direction=north;size=0.65;');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(10, -7);
			   	icon3.vertex = true;
			   	item4.insert(icon3);
			   	var icon4 = new mxCell('', new mxGeometry(0, 0.5, 10, 7), 'shape=step;whiteSpace=wrap;html=1;rounded=0;strokeColor=none;strokeWidth=2;fillColor=#ff0000;gradientColor=none;fontFamily=Verdana;fontSize=14;fontColor=#000000;align=left;direction=north;size=0.65;');
			   	icon4.geometry.relative = true;
			   	icon4.geometry.offset = new mxPoint(10, 0);
			   	icon4.vertex = true;
			   	item4.insert(icon4);
			   	var item5 = new mxCell('Medium', new mxGeometry(0, 0, 130, 33), 'spacingLeft=30;fillColor=none;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;fontColor=#253858;resizeWidth=1');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(0, 39);
			   	item5.vertex = true;
			   	item3.insert(item5);
			   	var icon3 = new mxCell('', new mxGeometry(0, 0.5, 10, 10), 'shape=line;strokeColor=#FFAB00;strokeWidth=2');
			   	icon3.geometry.relative = true;
			   	icon3.geometry.offset = new mxPoint(10, -5);
			   	icon3.vertex = true;
			   	item5.insert(icon3);
			   	var item6 = new mxCell('Low', new mxGeometry(0, 0, 130, 33), 'spacingLeft=30;fillColor=none;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;fontColor=#253858;resizeWidth=1');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(0, 72);
			   	item6.vertex = true;
			   	item3.insert(item6);
			   	var icon4 = new mxCell('', new mxGeometry(0, 0.5, 10, 14), 'shape=mxgraph.arrows2.sharpArrow2;dy1=0.82;dx1=4.02;dx2=5.92;dy3=0.26;dx3=7.37;notch=0;strokeColor=none;fillColor=#2DB07C;direction=south;');
			   	icon4.geometry.relative = true;
			   	icon4.geometry.offset = new mxPoint(10, -7);
			   	icon4.vertex = true;
			   	item6.insert(icon4);
			   	var item7 = new mxCell('Minor', new mxGeometry(0, 0, 130, 33), 'align=left;spacingLeft=30;rounded=0;fillColor=none;strokeColor=none;shadow=0;html=1;align=left;fontSize=12;fontColor=#253858;resizeWidth=1');
			   	item7.geometry.relative = true;
			   	item7.geometry.offset = new mxPoint(0, 105);
			   	item7.vertex = true;
			   	item3.insert(item7);
			   	var icon5 = new mxCell('', new mxGeometry(0, 0.5, 10, 7), 'shape=step;whiteSpace=wrap;html=1;rounded=0;strokeColor=none;strokeWidth=2;fillColor=#2DB07C;gradientColor=none;fontFamily=Verdana;fontSize=14;fontColor=#000000;align=left;direction=south;size=0.65;');
			   	icon5.geometry.relative = true;
			   	icon5.geometry.offset = new mxPoint(10, -7);
			   	icon5.vertex = true;
			   	item7.insert(icon5);
			   	var icon6 = new mxCell('', new mxGeometry(0, 0.5, 10, 7), 'shape=step;whiteSpace=wrap;html=1;rounded=0;strokeColor=none;strokeWidth=2;fillColor=#2DB07C;gradientColor=none;fontFamily=Verdana;fontSize=14;fontColor=#000000;align=left;direction=south;size=0.65;');
			   	icon6.geometry.relative = true;
			   	icon6.geometry.offset = new mxPoint(10, 0);
			   	icon6.vertex = true;
			   	item7.insert(icon6);
		   		return sb.createVertexTemplateFromCells([item1, item2, item3], 130, 222, 'Inline edit');
			}),
			this.addEntry(dt + 'inline edit', function()
	   		{
			   	var item1 = new mxCell('Priority', new mxGeometry(0, 0, 170, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Low', new mxGeometry(0, 25, 170, 35), 'rounded=1;arcSize=9;fillColor=#ffffff;strokeColor=#4C9AFF;html=1;strokeWidth=2;spacingLeft=30;fontColor=#000000;align=left');
			   	item2.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 0.5, 10, 14), 'shape=mxgraph.arrows2.sharpArrow2;dy1=0.82;dx1=4.02;dx2=5.92;dy3=0.26;dx3=7.37;notch=0;strokeColor=none;fillColor=#2DB07C;direction=south;');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(10, -7);
			   	icon1.vertex = true;
			   	item2.insert(icon1);
			   	var icon2 = new mxCell('', new mxGeometry(1, 0.5, 10, 7), 'shape=step;whiteSpace=wrap;html=1;rounded=0;strokeColor=none;strokeWidth=2;fillColor=#42526E;gradientColor=none;fontFamily=Verdana;fontSize=14;fontColor=#000000;align=left;direction=south;size=0.65;');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(-24, -3);
			   	icon2.vertex = true;
			   	item2.insert(icon2);
			   	var icon3 = new mxCell('', new mxGeometry(190, 38, 10, 8), s + 'check;strokeColor=#42526E;strokeWidth=2');
			   	icon3.vertex = true;
			   	var icon4 = new mxCell('', new mxGeometry(220, 37, 10, 10), s + 'x;strokeColor=#42526E;strokeWidth=2');
			   	icon4.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2, icon3, icon4], 230, 60, 'Inline edit');
			}),
					
			this.addEntry(dt + 'inline message', function()
	   		{
			   	var item1 = new mxCell('Access level applications', new mxGeometry(0, 30, 150, 20), 'shape=rect;fillColor=none;strokeColor=none;fontSize=11;fontStyle=1;align=left;fontColor=#596780');
			   	item1.vertex = true;
			   	var item2 = new mxCell('JIRA', new mxGeometry(10, 60, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item2.vertex = true;
			   	var item3 = new mxCell('Confluence', new mxGeometry(10, 85, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item3.vertex = true;
			   	var item4 = new mxCell('Bamboo', new mxGeometry(10, 110, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item4.vertex = true;
			   	var item5 = new mxCell('Bitbucket accounts', new mxGeometry(0, 135, 150, 20), 'shape=rect;fillColor=none;strokeColor=none;fontSize=11;fontStyle=1;align=left;fontColor=#596780');
			   	item5.vertex = true;
			   	var item6 = new mxCell('New users will be sent a request to join.', new mxGeometry(0, 160, 220, 20), 'shape=rect;fillColor=none;strokeColor=none;fontSize=12;fontStyle=0;align=left;fontColor=#000000');
			   	item6.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(230, 160, 20, 20), 'shape=mxgraph.azure.azure_alert;fillColor=#FF8B00;strokeColor=none;fontColor=#172B4C;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;html=1;spacingLeft=5');
			   	icon1.vertex = true;
			   	var item7 = new mxCell(
			   			'<b>Multiple accounts</b>\n\n' +
			   			'We will automatically invite any new users to Bitbucket, depending on your account settings.\n\n' +
			   			'<font color="#0057d8">Update your setting</font> or <font color="#0057d8">read more</font>'
			   				, new mxGeometry(220, 0, 240, 152), 'rounded=1;arcSize=3;fillColor=#ffffff;strokeColor=#DFE1E5;strokeWidth=1;shadow=1;align=left;html=1;whiteSpace=wrap;spacingLeft=20;spacingRight=20;');
			   	item7.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2, item3, item4, item5, item6, icon1, item7], 150, 180, 'Inline message');
			}),

			this.addEntry(dt + 'inline message subtitle', function()
	   		{
			   	var icon1 = new mxCell('i', new mxGeometry(0, 0, 20, 20), 'shape=ellipse;fillColor=#403294;strokeColor=none;fontSize=14;fontStyle=1;align=center;fontColor=#ffffff');
			   	icon1.vertex = true;
			   	var item1 = new mxCell('<font color="#0057d8">Log in</font> to learn about Confluence', new mxGeometry(0, 30, 230, 33), 'rounded=1;arcSize=3;fillColor=#ffffff;strokeColor=#DFE1E5;strokeWidth=1;shadow=1;align=left;html=1;whiteSpace=wrap;spacingLeft=20;spacingRight=20;fontSize=12;');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Want more information?', new mxGeometry(30, 0, 200, 20), 'fillColor=none;strokeColor=none;align=left;html=1;whiteSpace=wrap;fontSize=11;fontColor=#596780');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([icon1, item1, item2], 230, 63, 'Inline message with subtitle');
			}),
					
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#FFFFFF;strokeColor=#DFE1E6;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#42526E',
					 70, 20, 'DEFAULT', 'Lozenge (state, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#DFE1E6;strokeColor=#DFE1E6;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#42526E',
					 70, 20, 'DEFAULT', 'Lozenge (state, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#FFFFFF;strokeColor=#008364;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#008364',
					 70, 20, 'SUCCESS', 'Lozenge (success, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#008364;strokeColor=#008364;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#ffffff',
					 70, 20, 'SUCCESS', 'Lozenge (success, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#FFFFFF;strokeColor=#BA3200;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#BA3200',
					 70, 20, 'REMOVED', 'Lozenge (problem, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#BA3200;strokeColor=#BA3200;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#ffffff',
					 70, 20, 'REMOVED', 'Lozenge (problem, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#FFFFFF;strokeColor=#0057D8;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#0057D8',
					 100, 20, 'IN PROGRESS', 'Lozenge (current, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#0057D8;strokeColor=#0057D8;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#ffffff',
					 100, 20, 'IN PROGRESS', 'Lozenge (current, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#FFFFFF;strokeColor=#6554C0;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#6554C0',
					 50, 20, 'NEW', 'Lozenge (new, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#6554C0;strokeColor=#6554C0;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#ffffff',
					 50, 20, 'NEW', 'Lozenge (new, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#FFFFFF;strokeColor=#FFAB00;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#42526E',
					 60, 20, 'MOVED', 'Lozenge (moved, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			 this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#FFAB00;strokeColor=#FFAB00;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#42526E',
					 60, 20, 'MOVED', 'Lozenge (moved, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),

			this.addEntry(dt + 'inline message subtitle', function()
	   		{
			   	var item1 = new mxCell('Yeah, progress!', new mxGeometry(0, 0, 120, 20), 'dashed=0;html=1;rounded=1;fillColor=#172B4D;strokeColor=#172B4D;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#ffffff');
			   	item1.vertex = true;
			   	var item2 = new mxCell('IN PROGRESS', new mxGeometry(10, 30, 100, 20), 'dashed=0;html=1;rounded=1;fillColor=#FFFFFF;strokeColor=#0057D8;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#0057D8');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 120, 50, 'Lozenge (tooltip)');
			}),
			this.addEntry(dt + 'inline message subtitle', function()
	   		{
			   	var item1 = new mxCell('SUCCESS', new mxGeometry(25, 0, 70, 20), 'dashed=0;html=1;rounded=1;fillColor=#FFFFFF;strokeColor=#008364;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#008364');
			   	item1.vertex = true;
			   	var item2 = new mxCell("Don't stop believin'", new mxGeometry(0, 30, 120, 20), 'dashed=0;html=1;rounded=1;fillColor=#172B4D;strokeColor=#172B4D;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#ffffff');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 120, 50, 'Lozenge (tooltip)');
			}),

			this.addEntry(dt + 'modal dialog', function()
	   		{
			   	var item1 = new mxCell(
			   			'<b><font style="font-size: 14px">Your dashboard</font></b><div></div><div>\nYour dashboard is the first thing you see when you log in. The JIRA Software dashboard is like your car&apos;s dashboard. But instead of' +
			   			' showing your speed and fuel level, it shows important information about your work - like your projects, your activities and your issues.</div>', 
			   				new mxGeometry(0, 0, 330, 210), 'html=1;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;fontSize=12;align=left;fontColor=#000000;shadow=1;arcSize=1;whiteSpace=wrap;spacing=20;verticalAlign=top');
			   	item1.vertex = true;
			   	var item2 = new mxCell("Add", new mxGeometry(0, 0, 50, 33), 'dashed=0;html=1;rounded=1;fillColor=#0057D8;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#ffffff');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(200, 150);
			   	item2.vertex = true;
			   	item1.insert(item2);
			   	var item3 = new mxCell("Cancel", new mxGeometry(0, 0, 50, 33), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#596780');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(260, 150);
			   	item3.vertex = true;
			   	item1.insert(item3);
		   		return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Modal dialog');
			}),
			this.addEntry(dt + 'detailed modal dialog', function()
	   		{
			   	var item1 = new mxCell(
			   			'<b><font style="font-size: 14px">Your dashboard</font></b><div></div><div>\nYour dashboard is the first thing you see when you log in. The JIRA Software dashboard is like your car&apos;s dashboard. But instead of' +
			   			' showing your speed and fuel level, it shows important information about your work - like your projects, your activities and your issues.</div>', 
			   				new mxGeometry(0, 0, 330, 210), 'html=1;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;fontSize=12;align=left;fontColor=#000000;shadow=1;arcSize=1;whiteSpace=wrap;spacing=20;verticalAlign=top');
			   	item1.vertex = true;
			   	var item2 = new mxCell("Add", new mxGeometry(1, 1, 50, 33), 'dashed=0;html=1;rounded=1;fillColor=#0057D8;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#ffffff');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-130, -60);
			   	item2.vertex = true;
			   	item1.insert(item2);
			   	var item3 = new mxCell("Cancel", new mxGeometry(1, 1, 50, 33), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#596780');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(-70, -60);
			   	item3.vertex = true;
			   	item1.insert(item3);
			   	var item4 = new mxCell("Link", new mxGeometry(1, 0, 50, 20), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=12;align=center;fontStyle=0;fontColor=#0057D8');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(-170, 24);
			   	item4.vertex = true;
			   	item1.insert(item4);
			   	var item5 = new mxCell('', new mxGeometry(1, 0, 100, 33), 'dashed=0;html=1;rounded=1;fillColor=#F7F8F9;strokeColor=#E0E2E7;arcSize=7');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(-120, 16);
			   	item5.vertex = true;
			   	item1.insert(item5);
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 12, 12), 'shape=mxgraph.ios7.icons.looking_glass;fillColor=none;strokeColor=#243759;html=1;strokeWidth=2');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-24, -6);
			   	icon1.vertex = true;
			   	item5.insert(icon1);
			   	var item6 = new mxCell("Hint text", new mxGeometry(0, 1, 50, 20), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=11;align=center;fontStyle=0;fontColor=#596780');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(20, -50);
			   	item6.vertex = true;
			   	item1.insert(item6);
		   		return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Modal dialog (detailed)');
			}),
			this.addEntry(dt + 'small modal dialog', function()
	   		{
			   	var item1 = new mxCell('Add a branch permission', 
			   				new mxGeometry(0, 0, 410, 410), 'html=1;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;fontSize=20;align=left;fontColor=#000000;shadow=1;arcSize=1;whiteSpace=wrap;spacing=20;verticalAlign=top;fontStyle=1');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Branch name', new mxGeometry(0, 0, 100, 20), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontStyle=1;strokeWidth=2;fontColor=#596780');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(20, 60);
			   	item2.vertex = true;
			   	item1.insert(item2);
			   	var item3 = new mxCell('eg. Orange', new mxGeometry(0, 0, 370, 33), 'dashed=0;html=1;rounded=1;fillColor=#F7F8F9;strokeColor=#E0E2E7;arcSize=7;align=left;spacingLeft=10;fontColor=#596780');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(20, 80);
			   	item3.vertex = true;
			   	item1.insert(item3);
			   	var item4 = new mxCell('Select the branch you want to restrict access to', new mxGeometry(0, 0, 100, 20), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontStyle=0;strokeWidth=2;fontColor=#596780');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(20, 113);
			   	item4.vertex = true;
			   	item1.insert(item4);
			   	var item5 = new mxCell('Write access', new mxGeometry(0, 0, 100, 20), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontStyle=1;strokeWidth=2;fontColor=#596780');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(20, 150);
			   	item5.vertex = true;
			   	item1.insert(item5);
			   	var item6 = new mxCell("Type '@' and then their name", new mxGeometry(0, 0, 370, 33), 'dashed=0;html=1;rounded=1;fillColor=#F7F8F9;strokeColor=#E0E2E7;arcSize=7;align=left;spacingLeft=10;fontColor=#596780');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(20, 170);
			   	item6.vertex = true;
			   	item1.insert(item6);
			   	var item7 = new mxCell('Select users who can write to this branch without approvals', new mxGeometry(0, 0, 100, 20), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontStyle=0;strokeWidth=2;fontColor=#596780');
			   	item7.geometry.relative = true;
			   	item7.geometry.offset = new mxPoint(20, 203);
			   	item7.vertex = true;
			   	item1.insert(item7);
			   	var item8 = new mxCell('Other requests', new mxGeometry(0, 0, 100, 20), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontStyle=1;strokeWidth=2;fontColor=#596780');
			   	item8.geometry.relative = true;
			   	item8.geometry.offset = new mxPoint(20, 240);
			   	item8.vertex = true;
			   	item1.insert(item8);
			   	var item9 = new mxCell('Rewriting history', new mxGeometry(0, 0, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item9.geometry.relative = true;
			   	item9.geometry.offset = new mxPoint(20, 270);
			   	item9.vertex = true;
			   	item1.insert(item9);
			   	var item10 = new mxCell('Branch deletion', new mxGeometry(0, 0, 12, 12), 'shape=rect;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item10.geometry.relative = true;
			   	item10.geometry.offset = new mxPoint(20, 306);
			   	item10.vertex = true;
			   	item1.insert(item10);
			   	var item11 = new mxCell("Merge", new mxGeometry(1, 1, 60, 33), 'dashed=0;html=1;rounded=1;fillColor=#0057D8;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#ffffff');
			   	item11.geometry.relative = true;
			   	item11.geometry.offset = new mxPoint(-140, -60);
			   	item11.vertex = true;
			   	item1.insert(item11);
			   	var item12 = new mxCell("Cancel", new mxGeometry(1, 1, 50, 33), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#596780');
			   	item12.geometry.relative = true;
			   	item12.geometry.offset = new mxPoint(-70, -60);
			   	item12.vertex = true;
			   	item1.insert(item12);
		   		return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Modal dialog (small)');
			}),
			this.addEntry(dt + 'medium modal dialog', function()
	   		{
			   	var item1 = new mxCell('', 
			   				new mxGeometry(0, 0, 616, 420), 'html=1;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;fontSize=20;align=left;fontColor=#000000;shadow=1;arcSize=1;whiteSpace=wrap;spacing=20;verticalAlign=top;fontStyle=1');
			   	item1.vertex = true;
			   	var item2 = new mxCell(
			   			'<font style="font-size: 17px">Settings</font><div>\n</div><div>General</div>\n<div></div><div><font color="#0057d8">Appearance</font></div>\n<div><font color="#0057d8"></font></div><div><font color="#0057d8">Notifications</font></div>', 
			   			new mxGeometry(0, 0, 110, 360), 'html=1;fillColor=none;strokeColor=none;fontSize=12;align=left;fontStyle=1;strokeWidth=2;fontColor=000000;verticalAlign=top');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(20, 20);
			   	item2.vertex = true;
			   	item1.insert(item2);
			   	var item3 = new mxCell('', new mxGeometry(0, 0, 10, 330), 'shape=line;direction=south;strokeColor=#E0E1E6;strokeWidth=1');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(130, 60);
			   	item3.vertex = true;
			   	item1.insert(item3);
			   	var item4 = new mxCell('General', new mxGeometry(0, 0, 300, 20), 'html=1;fillColor=none;strokeColor=none;fontSize=12;align=left;fontStyle=1;fontColor=000000');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(170, 60);
			   	item4.vertex = true;
			   	item1.insert(item4);
			   	var item5 = new mxCell('Show joined/left room messages', new mxGeometry(0, 0, 12, 12), 'shape=rect;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(170, 90);
			   	item5.vertex = true;
			   	item1.insert(item5);
			   	var item6 = new mxCell('Display time in 24-hour format', new mxGeometry(0, 0, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(170, 120);
			   	item6.vertex = true;
			   	item1.insert(item6);
			   	var item7 = new mxCell('Hide inline previews by default', new mxGeometry(0, 0, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item7.geometry.relative = true;
			   	item7.geometry.offset = new mxPoint(170, 150);
			   	item7.vertex = true;
			   	item1.insert(item7);
			   	var item8 = new mxCell('Hide gifs by default', new mxGeometry(0, 0, 12, 12), s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item8.geometry.relative = true;
			   	item8.geometry.offset = new mxPoint(170, 180);
			   	item8.vertex = true;
			   	item1.insert(item8);
			   	var item9 = new mxCell('Turned text emoticons into images', new mxGeometry(0, 0, 12, 12), 'shape=rect;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item9.geometry.relative = true;
			   	item9.geometry.offset = new mxPoint(170, 210);
			   	item9.vertex = true;
			   	item1.insert(item9);
			   	var item10 = new mxCell('Idle', new mxGeometry(0, 0, 12, 12), 'shape=rect;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item10.geometry.relative = true;
			   	item10.geometry.offset = new mxPoint(170, 240);
			   	item10.vertex = true;
			   	item1.insert(item10);
			   	var item11 = new mxCell('15', new mxGeometry(0, 0, 55, 33), 'dashed=0;html=1;rounded=1;fillColor=#F7F8F9;strokeColor=#E0E2E7;arcSize=7;align=left;spacingLeft=5;fontColor=#596780');
			   	item11.geometry.relative = true;
			   	item11.geometry.offset = new mxPoint(220, 230);
			   	item11.vertex = true;
			   	item1.insert(item11);
			   	var item12 = new mxCell('minutes', new mxGeometry(0, 0, 100, 20), 'fillColor=none;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;html=1');
			   	item12.geometry.relative = true;
			   	item12.geometry.offset = new mxPoint(280, 236);
			   	item12.vertex = true;
			   	item1.insert(item12);
			   	var item13 = new mxCell('Log additional chat data', new mxGeometry(0, 0, 12, 12), 'fillColor=none;strokeColor=none;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1');
			   	item13.geometry.relative = true;
			   	item13.geometry.offset = new mxPoint(170, 270);
			   	item13.vertex = true;
			   	item1.insert(item13);
			   	var item14 = new mxCell('Enable spell check', new mxGeometry(0, 0, 12, 12), 'shape=rect;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item14.geometry.relative = true;
			   	item14.geometry.offset = new mxPoint(170, 300);
			   	item14.vertex = true;
			   	item1.insert(item14);
			   	var item15 = new mxCell('Correct spelling automatically', new mxGeometry(0, 0, 12, 12), 'shape=rect;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item15.geometry.relative = true;
			   	item15.geometry.offset = new mxPoint(170, 330);
			   	item15.vertex = true;
			   	item1.insert(item15);
		   		return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Modal dialog (medium)');
			}),
					 
			this.addEntry(dt + 'error modal dialog', function()
	   		{
			   	var item1 = new mxCell("You are about to delete the job 'Newtown'. If you proceed with this action Bamboo will permanently delete all configuration settings, logs and results for this job.", 
			   				new mxGeometry(0, 0, 470, 190), 'html=1;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;fontSize=12;align=left;fontColor=#000000;shadow=1;arcSize=1;whiteSpace=wrap;spacing=20;verticalAlign=top;spacingTop=30;');
			   	item1.vertex = true;
			   	var item2 = new mxCell("Delete", new mxGeometry(1, 1, 60, 33), 'dashed=0;html=1;rounded=1;fillColor=#DE350A;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#ffffff');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-140, -60);
			   	item2.vertex = true;
			   	item1.insert(item2);
			   	var item3 = new mxCell("Cancel", new mxGeometry(1, 1, 50, 33), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#596780');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(-70, -60);
			   	item3.vertex = true;
			   	item1.insert(item3);
			   	var item4 = new mxCell("!", new mxGeometry(0, 0, 20, 20), 'shape=rhombus;rounded=1;strokeColor=none;fillColor=#DE350A;fontColor=#ffffff;fontSize=12;shadow=0;align=center;arcSize=3');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(20, 20);
			   	item4.vertex = true;
			   	item1.insert(item4);
			   	var item5 = new mxCell("Delete repository", new mxGeometry(0, 0, 290, 33), 'dashed=0;html=1;fillColor=none;strokeColor=none;fontSize=18;align=left;fontStyle=1;fontColor=#000000');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(50, 13);
			   	item5.vertex = true;
			   	item1.insert(item5);
		   		return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Modal dialog (error)');
			}),
			this.addEntry(dt + 'warning modal dialog', function()
	   		{
			   	var item1 = new mxCell("Moving a job between stages may break artifact dependencies. Select a stage and any resulting conflicts will be displayed here.", 
			   				new mxGeometry(0, 0, 470, 220), 'html=1;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;fontSize=12;align=left;fontColor=#000000;shadow=1;arcSize=1;whiteSpace=wrap;spacing=20;verticalAlign=top;spacingTop=30;');
			   	item1.vertex = true;
			   	var item2 = new mxCell("Move", new mxGeometry(1, 1, 60, 33), 'dashed=0;html=1;rounded=1;fillColor=#FFAB00;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#ffffff');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-140, -60);
			   	item2.vertex = true;
			   	item1.insert(item2);
			   	var item3 = new mxCell("Cancel", new mxGeometry(1, 1, 50, 33), 'dashed=0;html=1;rounded=1;fillColor=none;strokeColor=none;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#596780');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(-70, -60);
			   	item3.vertex = true;
			   	item1.insert(item3);
			   	var item4 = new mxCell("Move job", new mxGeometry(0, 0, 20, 20), 'shape=mxgraph.azure.azure_alert;fillColor=#FFAB00;strokeColor=none;fontColor=#172B4C;fontSize=18;fontStyle=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;html=1;spacingLeft=5');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(20, 20);
			   	item4.vertex = true;
			   	item1.insert(item4);
			   	var item5 = new mxCell("Select stage", new mxGeometry(0, 0, 290, 33), 'dashed=0;html=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontStyle=1;fontColor=#596780');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(20, 85);
			   	item5.vertex = true;
			   	item1.insert(item5);
			   	var item6 = new mxCell('Progress and research', new mxGeometry(0, 0, 200, 33), 'rounded=1;arcSize=9;fillColor=#ECEDF1;strokeColor=none;html=1;strokeWidth=2;spacingLeft=10;fontColor=#000000;align=left');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(20, 112);
			   	item6.vertex = true;
			   	item1.insert(item6);
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 10, 7), 'shape=step;whiteSpace=wrap;html=1;rounded=0;strokeColor=none;strokeWidth=2;fillColor=#0A1E43;gradientColor=none;fontFamily=Verdana;fontSize=14;fontColor=#000000;align=left;direction=south;size=0.65;');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-24, -3);
			   	icon1.vertex = true;
			   	item6.insert(icon1);
		   		return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Modal dialog (error)');
			}),
			this.addEntry(dt + 'multi select', function()
	   		{
			   	var item1 = new mxCell("Selecting time zones", new mxGeometry(0, 0, 150, 20), 'html=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontColor=#596780;whiteSpace=wrap;');
			   	item1.vertex = true;
			   	var item2 = new mxCell('', new mxGeometry(0, 25, 270, 33), 'rounded=1;arcSize=9;fillColor=#ffffff;strokeColor=#4C9AFF;html=1;strokeWidth=2;spacingLeft=30;fontColor=#000000;align=left');
			   	item2.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 10, 7), 'shape=step;whiteSpace=wrap;html=1;rounded=0;strokeColor=none;strokeWidth=2;fillColor=#0A1E43;gradientColor=none;fontFamily=Verdana;fontSize=14;fontColor=#000000;align=left;direction=south;size=0.65;');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-24, -3);
			   	icon1.vertex = true;
			   	item2.insert(icon1);
			   	var item3 = new mxCell('Alaska', new mxGeometry(0, 0.5, 70, 20), 'rounded=1;arcSize=9;fillColor=#ECEDF1;strokeColor=none;html=1;strokeWidth=2;spacingLeft=4;fontColor=#000000;align=left;fontSize=11');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(5, -10);
			   	item3.vertex = true;
			   	item2.insert(item3);
			   	var icon2 = new mxCell('', new mxGeometry(1, 0.5, 7, 7), s + 'x;strokeColor=#58667F;strokeWidth=2');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(-14, -3);
			   	icon2.vertex = true;
			   	item3.insert(icon2);
			   	var item4 = new mxCell(
			   			'<b><font color="#596780">PACIFIC TIME ZONE</font></b><div>\n<div>California</div>\n<div>Nevada</div>\n<div>Oregon</div>\n<div></div><div>Washington</div>\n\n<div></div><div><b>' +
			   			'<font color="#596780">MOUNTAIN TIME ZONE</font></b></div><div>\n</div><div>Arizona</div><div>\n</div><div>Colorado</div><div>\n</div><div>Idaho</div><div>\n</div><div>Montana</div><div>\n\n</div><div>Nebraska</div><div>\n' +
			   			'</div><div>Nevada</div></div>', 
			   			new mxGeometry(0, 60, 270, 390), 'html=1;rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;fontSize=12;align=left;fontColor=#000000;shadow=1;arcSize=1;whiteSpace=wrap;spacing=2;verticalAlign=top;fontStyle=0;spacingLeft=20;spacingTop=15;');
			   	item4.vertex = true;
			   	var item5 = new mxCell('', new mxGeometry(0, 0, 270, 33), 'rounded=0;fillColor=#000000;strokeColor=none;html=1;opacity=10;resizeWidth=1');
			   	item5.geometry.relative = true;
			   	item5.geometry.offset = new mxPoint(0, 41);
			   	item5.vertex = true;
			   	item4.insert(item5);
		   		return sb.createVertexTemplateFromCells([item1, item2, item4], 270, 390, 'Multi-select');
			}),
			this.addEntry(dt + 'multi select avatar', function()
	   		{
			   	var item1 = new mxCell("Assignee", new mxGeometry(0, 0, 150, 20), 'html=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontColor=#596780;whiteSpace=wrap;');
			   	item1.vertex = true;
			   	var item2 = new mxCell('', new mxGeometry(0, 25, 340, 33), 'rounded=1;arcSize=9;fillColor=#ffffff;strokeColor=#4C9AFF;html=1;strokeWidth=2;spacingLeft=30;fontColor=#000000;align=left');
			   	item2.vertex = true;
			   	var item3 = new mxCell('Maryanne', new mxGeometry(0, 0.5, 95, 20), 'rounded=1;arcSize=50;fillColor=#ECEDF1;strokeColor=none;html=1;strokeWidth=2;spacingLeft=23;fontColor=#000000;align=left;fontSize=11');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(5, -10);
			   	item3.vertex = true;
			   	item2.insert(item3);
			   	var icon2 = new mxCell('', new mxGeometry(1, 0.5, 7, 7), s + 'x;strokeColor=#58667F;strokeWidth=2');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(-14, -3);
			   	icon2.vertex = true;
			   	item3.insert(icon2);
			   	var icon4 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=mxgraph.ios7.icons.user;fillColor=none;strokeColor=#253858;html=1;fontColor=#ffffff;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon4.geometry.relative = true;
			   	icon4.geometry.offset = new mxPoint(0, -10);
			   	icon4.vertex = true;
			   	item3.insert(icon4);
			   	var item4 = new mxCell('Lisa Hill', new mxGeometry(0, 0.5, 95, 20), 'rounded=1;arcSize=50;fillColor=#ECEDF1;strokeColor=none;html=1;strokeWidth=2;spacingLeft=23;fontColor=#000000;align=left;fontSize=11');
			   	item4.geometry.relative = true;
			   	item4.geometry.offset = new mxPoint(105, -10);
			   	item4.vertex = true;
			   	item2.insert(item4);
			   	var icon5 = new mxCell('', new mxGeometry(1, 0.5, 7, 7), s + 'x;strokeColor=#58667F;strokeWidth=2');
			   	icon5.geometry.relative = true;
			   	icon5.geometry.offset = new mxPoint(-14, -3);
			   	icon5.vertex = true;
			   	item4.insert(icon5);
			   	var icon6 = new mxCell('', new mxGeometry(0, 0.5, 20, 20), 'shape=mxgraph.ios7.icons.user;fillColor=none;strokeColor=#253858;html=1;fontColor=#ffffff;align=left;fontSize=12;spacingLeft=10;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon6.geometry.relative = true;
			   	icon6.geometry.offset = new mxPoint(0, -10);
			   	icon6.vertex = true;
			   	item4.insert(icon6);
			   	var item5 = new mxCell('', new mxGeometry(0, 60, 340, 260), 'rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;shadow=1;arcSize=1');
			   	item5.vertex = true;
			   	var item6 = new mxCell('SUGGESTIONS', new mxGeometry(0, 0, 270, 33), 'fillColor=none;strokeColor=none;html=1;resizeWidth=1;align=left;spacingLeft=20;fontSize=11;fontStyle=1;fontColor=#596780');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(0, 10);
			   	item6.vertex = true;
			   	item5.insert(item6);
			   	var item7 = new mxCell('', new mxGeometry(0, 0, 340, 33), 'rounded=0;fillColor=#000000;strokeColor=none;html=1;opacity=10;resizeWidth=1');
			   	item7.geometry.relative = true;
			   	item7.geometry.offset = new mxPoint(0, 41);
			   	item7.vertex = true;
			   	item5.insert(item7);
			   	var icon7 = new mxCell('Justin Case <font color="#596780">jscase@atlassian.com</font>', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=none;strokeColor=#253858;html=1;;align=left;fontSize=12;spacingLeft=5;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon7.geometry.relative = true;
			   	icon7.geometry.offset = new mxPoint(20, 45);
			   	icon7.vertex = true;
			   	item5.insert(icon7);
			   	var item8 = new mxCell('ALL USERS', new mxGeometry(0, 0, 270, 33), 'fillColor=none;strokeColor=none;html=1;resizeWidth=1;align=left;spacingLeft=20;fontSize=11;fontStyle=1;fontColor=#596780');
			   	item8.geometry.relative = true;
			   	item8.geometry.offset = new mxPoint(0, 85);
			   	item8.vertex = true;
			   	item5.insert(item8);
			   	var icon8 = new mxCell('Sam Samuels <font color="#596780">ssamuels@atlassian.com</font>', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=none;strokeColor=#253858;html=1;;align=left;fontSize=12;spacingLeft=5;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon8.geometry.relative = true;
			   	icon8.geometry.offset = new mxPoint(20, 118);
			   	icon8.vertex = true;
			   	item5.insert(icon8);
			   	var icon9 = new mxCell('Leana Stevens <font color="#596780">lstevens@atlassian.com</font>', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=none;strokeColor=#253858;html=1;;align=left;fontSize=12;spacingLeft=5;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon9.geometry.relative = true;
			   	icon9.geometry.offset = new mxPoint(20, 151);
			   	icon9.vertex = true;
			   	item5.insert(icon9);
			   	var icon10 = new mxCell('Casey Chambers <font color="#596780">cchambers@atlassian.com</font>', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=none;strokeColor=#253858;html=1;;align=left;fontSize=12;spacingLeft=5;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon10.geometry.relative = true;
			   	icon10.geometry.offset = new mxPoint(20, 184);
			   	icon10.vertex = true;
			   	item5.insert(icon10);
			   	var icon11 = new mxCell('Paige Turner <font color="#596780">pturner@atlassian.com</font>', new mxGeometry(0, 0, 24, 24), 'shape=mxgraph.ios7.icons.user;fillColor=none;strokeColor=#253858;html=1;;align=left;fontSize=12;spacingLeft=5;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
			   	icon11.geometry.relative = true;
			   	icon11.geometry.offset = new mxPoint(20, 217);
			   	icon11.vertex = true;
			   	item5.insert(icon11);
		   		return sb.createVertexTemplateFromCells([item1, item2, item5], 340, 320, 'Multi-select with avatars');
			}),
			this.addEntry(dt + 'error message', function()
	   		{
			   	var item1 = new mxCell("Issue", new mxGeometry(0, 0, 150, 20), 'html=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontColor=#596780;whiteSpace=wrap;');
			   	item1.vertex = true;
			   	var item2 = new mxCell('IR-83', new mxGeometry(0, 25, 340, 33), 'rounded=1;arcSize=9;fillColor=#ffffff;strokeColor=#4C9AFF;html=1;strokeWidth=2;spacingLeft=5;fontColor=#000000;align=left');
			   	item2.vertex = true;
			   	var icon2 = new mxCell('', new mxGeometry(1, 0.5, 14, 14), 'html=1;shadow=0;dashed=0;shape=mxgraph.atlassian.close;fillColor=#97A0AF;strokeColor=none');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(-28, -7);
			   	icon2.vertex = true;
			   	item2.insert(icon2);
			   	var item5 = new mxCell('The server did not respond', new mxGeometry(0, 60, 340, 90), 'rounded=1;fillColor=#ffffff;strokeColor=#DFE1E5;shadow=1;arcSize=1;fontSize=12;fontColor=#596780;align=center;html=1;verticalAlign=top;spacingTop=5;');
			   	item5.vertex = true;
			   	var item6 = new mxCell('Retry', new mxGeometry(0, 0, 50, 33), 'align=center;strokeColor=none;fillColor=#F1F2F4;rounded=1;arcSize=9');
			   	item6.geometry.relative = true;
			   	item6.geometry.offset = new mxPoint(150, 40);
			   	item6.vertex = true;
			   	item5.insert(item6);
		   		return sb.createVertexTemplateFromCells([item1, item2, item5], 340, 320, 'Error message');
			}),
			this.addEntry(dt + 'progress tracker', function()
	   		{
			   	var item1 = new mxCell('', new mxGeometry(20, 0, 300, 10), 'fillColor=#0065FF;strokeColor=none;shadow=0;rounded=1;arcSize=50');
			   	item1.vertex = true;
			   	var item2 = new mxCell("Welcome", new mxGeometry(0, 10, 60, 20), 'html=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontColor=#596780;whiteSpace=wrap;');
			   	item2.vertex = true;
			   	var item3 = new mxCell("Create a space", new mxGeometry(120, 10, 90, 20), 'html=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontColor=#000000;whiteSpace=wrap;');
			   	item3.vertex = true;
			   	var item4 = new mxCell("Upload photo", new mxGeometry(280, 10, 70, 20), 'html=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontColor=#0065FF;whiteSpace=wrap;');
			   	item4.vertex = true;
			   	var item5 = new mxCell("Your details", new mxGeometry(400, 10, 70, 20), 'html=1;fillColor=none;strokeColor=none;fontSize=11;align=left;fontColor=#596780;whiteSpace=wrap;');
			   	item5.vertex = true;
			   	var item6 = new mxCell('', new mxGeometry(425, 0, 10, 10), 'shape=ellipse;fillColor=#A5ADBA;strokeColor=none;shadow=0');
			   	item6.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2, item3, item4, item5, item6], 340, 30, 'Progress tracker');
			}),
			this.addEntry(dt + 'radio button group', function()
	   		{
			   	var item1 = new mxCell('Permissions', new mxGeometry(0, 0, 150, 20), 'shape=rect;fillColor=none;strokeColor=none;fontSize=11;fontStyle=1;align=left;fontColor=#596780');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Read only', new mxGeometry(10, 30, 12, 12), 'shape=ellipse;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item2.vertex = true;
			   	var item3 = new mxCell('Write', new mxGeometry(11, 56, 10, 10), 'shape=ellipse;fillColor=#ffffff;strokeColor=#0057D8;strokeWidth=4;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10');
			   	item3.vertex = true;
			   	var item4 = new mxCell('Restricted', new mxGeometry(10, 80, 12, 12), 'shape=ellipse;rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;fontColor=#000000;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0');
			   	item4.vertex = true;
			   	var item5 = new mxCell('Add', new mxGeometry(0, 115, 60, 33), 'shape=rect;rounded=1;fillColor=#0057D8;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;fontStyle=0;fontSize=14;html=1;shadow=0;dashed=0');
			   	item5.vertex = true;
			   	var item6 = new mxCell('Cancel', new mxGeometry(70, 115, 60, 33), 'shape=rect;fillColor=none;strokeColor=none;fontColor=#596780;align=center;verticalAlign=middle;fontStyle=0;fontSize=14;html=1;shadow=0;dashed=0');
			   	item6.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2, item3, item4, item5, item6], 150, 173, 'Radio button group');
			}),
					 
							
					 
					
		];
			   	
   		this.addPalette('atlassian', 'Atlassian', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
