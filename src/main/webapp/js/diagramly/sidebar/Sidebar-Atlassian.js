(function()
{
	// Adds Atlassian shapes
	Sidebar.prototype.addAtlassianPalette = function()
	{
		var s = 'html=1;shadow=0;dashed=0;shape=mxgraph.atlassian.';
		var s2 = 'html=1;shadow=0;dashed=0;fillColor=none;strokeColor=none;shape=mxgraph.bootstrap.rect;';
		var s3 = mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var gn = 'mxgraph.atlassian';
		var dt = 'atlassian ';
		var sb = this;
		this.setCurrentSearchEntryLibrary('atlassian');
		
		var fns = [
			this.addEntry(dt + 'issue ticket bug jira task feature request', function()
	   		{
			   	var bg = new mxCell('Task description', new mxGeometry(0, 0, 200, 50), s + 'issue;issueType=story;issuePriority=blocker;issueStatus=inProgress;verticalAlign=top;align=left;whiteSpace=wrap;overflow=hidden;spacingTop=25;strokeColor=#A8ADB0;fillColor=#EEEEEE;fontSize=12;backgroundOutline=1;');
			   	bg.vertex = true;
			   	var label1 = new mxCell('ID', new mxGeometry(0, 0, 60, 20), 'strokeColor=none;fillColor=none;part=1;resizable=0;align=left;autosize=1;points=[];deletable=0;connectable=0;');
			   	label1.geometry.relative = true;
			   	label1.geometry.offset = new mxPoint(20, 0);
			   	label1.vertex = true;
			   	bg.insert(label1);
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Issue');
			}),
					 
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Atlassian_Logo.svg;',
					 66, 66, '', 'Atlassian', null, null, this.getTagsForStencil(gn, 'atlassian logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Bamboo_Logo.svg;',
					 64, 74, '', 'Bamboo', null, null, this.getTagsForStencil(gn, 'bamboo logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Bitbucket_Logo.svg;',
					 57, 50, '', 'Bitbucket', null, null, this.getTagsForStencil(gn, 'bitbucket logo atlassian', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Clover_Logo.svg;',
					 71, 71, '', 'Clover', null, null, this.getTagsForStencil(gn, 'clover logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Confluence_Logo.svg;',
					 63, 57, '', 'Confluence', null, null, this.getTagsForStencil(gn, 'confluence logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Crowd_Logo.svg;',
					 66, 65, '', 'Crowd', null, null, this.getTagsForStencil(gn, 'crowd logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Crucible_Logo.svg;',
					 61, 61, '', 'Crucible', null, null, this.getTagsForStencil(gn, 'crucible logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Fisheye_Logo.svg;',
					 71, 59, '', 'Fisheye', null, null, this.getTagsForStencil(gn, 'fisheye logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Hipchat_Logo.svg;',
					 66, 62, '', 'Hipchat', null, null, this.getTagsForStencil(gn, 'hipchat logo atlassian', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Jira_Logo.svg;',
					 72, 72, '', 'Jira', null, null, this.getTagsForStencil(gn, 'jira logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Jira_Core_Logo.svg;',
					 55, 66, '', 'Jira Core', null, null, this.getTagsForStencil(gn, 'jira core logo atlassian', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Jira_Service_Desk_Logo.svg;',
					 59, 76, '', 'Jira Service Desk', null, null, this.getTagsForStencil(gn, 'jira service desk logo atlassian', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Jira_Software_Logo.svg;',
					 74, 76, '', 'Jira Software', null, null, this.getTagsForStencil(gn, 'jira software logo atlassian', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Sourcetree_Logo.svg;',
					 57, 71, '', 'Sourcetree', null, null, this.getTagsForStencil(gn, 'sourcetree logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Statuspage_Logo.svg;',
					 75, 52, '', 'Statuspage', null, null, this.getTagsForStencil(gn, 'statuspage logo', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Stride_Logo.svg;',
					 69, 57, '', 'Stride', null, null, this.getTagsForStencil(gn, 'stride logo atlassian', dt).join(' ')),
			 this.createVertexTemplateEntry('image;image=img/lib/atlassian/Trello_Logo.svg;',
					 70, 70, '', 'Trello', null, null, this.getTagsForStencil(gn, 'trello logo', dt).join(' ')),
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
			this.createVertexTemplateEntry('rounded=1;arcSize=5;fillColor=#0065FF;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=14;fontStyle=1;html=1', 
					40, 40, '&lt;/&gt;', 'Container Avatar (Large)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'container avatar large').join(' ')),
			this.createVertexTemplateEntry('rounded=1;arcSize=5;fillColor=#0065FF;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=12;fontStyle=1;html=1', 
					32, 32, '&lt;/&gt;', 'Container Avatar (Medium)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'container avatar medium').join(' ')),
			this.createVertexTemplateEntry('rounded=1;arcSize=5;fillColor=#0065FF;strokeColor=none;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=10;fontStyle=1;html=1', 
					24, 24, '&lt;/&gt;', 'Container Avatar (Small)', null, null, this.getTagsForStencil(gn, 'avatar', dt + 'container avatar small').join(' ')),
			this.createVertexTemplateEntry('shape=ellipse;fillColor=#0065FF;strokeColor=none;html=1', 
					10, 10, '', 'Dot Badge', null, null, this.getTagsForStencil(gn, '', dt + 'dot badge').join(' ')),
			this.createVertexTemplateEntry('rounded=1;fillColor=#0065FF;strokeColor=none;html=1;fontColor=#ffffff;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=18;fontStyle=1;arcSize=50', 
					40, 25, '13', 'Bold Badge', null, null, this.getTagsForStencil(gn, '', dt + 'bold badge').join(' ')),
			this.createVertexTemplateEntry('rounded=1;fillColor=#E3FCEF;strokeColor=none;html=1;fontColor=#016745;align=center;verticalAlign=middle;whiteSpace=wrap;fontSize=18;fontStyle=0;arcSize=50', 
					40, 25, '+1', 'Subtle Badge', null, null, this.getTagsForStencil(gn, '', dt + 'subtle badge').join(' ')),
			this.addEntry(dt + 'banner', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 625, 50), 'rounded=0;fillColor=#FFAB00;strokeColor=none;html=1');
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
			   	var bg = new mxCell('', new mxGeometry(0, 0, 625, 50), 'rounded=0;fillColor=#DE350A;strokeColor=none;html=1');
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
			   	var bg = new mxCell('Pay now', new mxGeometry(25, 0, 86, 33), 'rounded=1;fillColor=#0057D8;align=center;strokeColor=none;html=1;fontColor=#ffffff;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'checkbox;fillColor=#008465;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 111, 33, 'Button (Primary)');
			}),
			this.addEntry(dt + 'button standard', function()
	   		{
			   	var bg = new mxCell('Create Group', new mxGeometry(25, 0, 115, 33), 'rounded=1;align=center;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'checkbox;fillColor=#008465;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 140, 33, 'Button (Standard)');
			}),
			this.addEntry(dt + 'button link', function()
	   		{
			   	var bg = new mxCell('Visit documentation', new mxGeometry(25, 0, 125, 33), 'fillColor=none;strokeColor=none;html=1;fontColor=#0057D8;align=left;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'checkbox;fillColor=#008465;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 150, 33, 'Button (Link)');
			}),
			this.addEntry(dt + 'button primary', function()
	   		{
			   	var bg = new mxCell('Submit', new mxGeometry(25, 0, 80, 33), 'rounded=1;fillColor=#0057D8;align=center;strokeColor=none;html=1;fontColor=#ffffff;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'close;fillColor=#BA3200;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 105, 33, 'Button (Primary)');
			}),
			this.addEntry(dt + 'button standard', function()
	   		{
			   	var bg = new mxCell('Done', new mxGeometry(25, 0, 55, 33), 'rounded=1;align=center;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'close;fillColor=#BA3200;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 80, 33, 'Button (Standard)');
			}),
			this.addEntry(dt + 'button link', function()
	   		{
			   	var bg = new mxCell('Click here', new mxGeometry(25, 0, 75, 33), 'fillColor=none;strokeColor=none;html=1;fontColor=#0057D8;align=left;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 9, 14, 14), s + 'close;fillColor=#BA3200;strokeColor=none;html=1');
			   	icon1.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1], 100, 33, 'Button (Link)');
			}),
			this.createVertexTemplateEntry('rounded=1;fillColor=#0057D8;strokeColor=none;html=1;fontColor=#ffffff;align=center;verticalAlign=middle;fontStyle=0;fontSize=12', 
					86, 33, 'Primary', 'Button (Primary)', null, null, this.getTagsForStencil(gn, '', dt + 'button primary').join(' ')),
			this.createVertexTemplateEntry('rounded=1;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;align=center;verticalAlign=middle;fontStyle=0;fontSize=12', 
					86, 33, 'Standard', 'Button (Standard)', null, null, this.getTagsForStencil(gn, '', dt + 'button standard').join(' ')),
			this.createVertexTemplateEntry('fillColor=none;strokeColor=none;html=1;fontColor=#0057D8;align=center;verticalAlign=middle;fontStyle=0;fontSize=12', 
					86, 33, 'Link button', 'Button (Link)', null, null, this.getTagsForStencil(gn, '', dt + 'button link').join(' ')),
			this.addEntry(dt + 'dropdown button', function()
	   		{
			   	var bg = new mxCell('Dropdown button', new mxGeometry(0, 0, 140, 33), 'rounded=1;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;align=left;fontSize=12;spacingLeft=10');
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
			   	var bg = new mxCell('Label only', new mxGeometry(0, 0, 80, 33), 'rounded=1;align=center;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg], 80, 33, 'Button (label only)');
			}),
			this.addEntry(dt + 'button icon and label', function()
	   		{
			   	var bg = new mxCell('Icon and label', new mxGeometry(0, 0, 120, 33), 'rounded=1;align=left;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12;spacingLeft=26;');
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
			   	var bg = new mxCell('', new mxGeometry(0, 0, 32, 33), 'rounded=1;align=left;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#596780;fontSize=12;spacingLeft=26;');
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
			   	var bg = new mxCell('Subtle', new mxGeometry(0, 0, 80, 33), 'rounded=1;align=left;fillColor=none;strokeColor=none;html=1;fontColor=#596780;fontSize=12;spacingLeft=26;');
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
			   	var bg = new mxCell('Disabled button', new mxGeometry(0, 0, 110, 33), 'rounded=1;align=center;fillColor=#F1F2F4;strokeColor=none;html=1;fontColor=#A5ADBA;fontSize=12');
			   	bg.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg], 110, 33, 'Button (disabled)');
			}),
			this.addDataEntry(dt + 'split button', 80, 33, 'Button (split)',
				'rZRfb4IwFMU/TR9doFXnXsXhy5Ys8WHPjVygWWlJuTrdp1+hBUV0kjgTk/bce/rndxoIi4rD2vAyf9cJSMJeCYuM1uhGxSECKQkNRELYilAa2D+h8Y1q2FSDkhtQOMZAnWHP5Q6csimlQKdWeJReNXqnEqhNIWHLVEgZaalNU2RxGNN4avUKjf6CtqK0su5ljoVsfVrhmW/2Mn9eBFbnUmTKahJS9G0b8VNvHdJ62ZJvhcremuoqDPyZwSAcbt67kfyl16ALQHO0Ld8iwdx1LPxCOYgs9y7GnMYrN8865wmiHXiO15myAdMBzirnZT1EI7jKanWZCANbFLrmUOldfchLzh2vvzmPoUOv0+kbjv4FPc3c/IxdSIfs5k4yIDmKPfSWusbTb/+hhT1Vt/fEv9h298lFIjpNK8BBHt0lRkU0HR+RFOpWPP0YbEBp8+u/edf06dHR/0vnThrtS340DjZ7nL+dnj5prv38i/cL'),
			this.addDataEntry(dt + 'button grouped', 320, 33, 'Button (grouped)',
				'7ZZNb4JAEIZ/zR5rYFetvUqLvTRp0kPPGxlg48KSZVHsr+8AC37S0kQ9mJqY7MwwHzzviBDmJeVC8yx+UwFIwl4I87RSpjklpQdSEuqIgLBnQqmDX0L9nqhbR52Ma0jNkATaJKy5LKDxNI7cbKV15EarFXyKwMTocAmb5zEP1AYNB42A5zEE1uBSRCmel9geNDpik8hdVlaVTMqout1RoparIhtpDUscda4/xFcVdqs6oZDSU1LpegTmuz71x1WNepa9SFh/ukg7ZXtboA2UvWhql+WyAJWA0Vu8ZGOLYJRZfE4MIoptGmONj+eNHXWpO9B4sKzPc2cn3OeFMSpF36kCWhVp0DEOVWpaVtTae0QmT9PHWXedLXLMNFUp/Akn6gM5Nn1tOVSKDoJMf4U8+4GxBsmNWMNB+XPgbYd3JbAxdcrD0m2GCsMczIlQ3VyDtBv3a8f+tbuYdu70GuJN+sUb3/zRVzGz7Y8fgHexKIcJt1mbh6v85qf9a+Peem0khHe9NZfek57/ZDR371nNSuy/hn0D'),
			
			this.addEntry(dt + 'button compact', function()
	   		{
			   	var bg = new mxCell('Compact', new mxGeometry(0, 0, 86, 33), 'rounded=1;fillColor=#F1F2F4;align=center;strokeColor=none;html=1;fontColor=#596780;fontSize=12');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(107, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon1.vertex = true;
			   	var icon2 = new mxCell('', new mxGeometry(117, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon2.vertex = true;
			   	var icon3 = new mxCell('', new mxGeometry(127, 13, 6, 6), 'shape=ellipse;fillColor=#596780;strokeColor=none;html=1');
			   	icon3.vertex = true;
		   		return sb.createVertexTemplateFromCells([bg, icon1, icon2, icon3], 133, 33, 'Button (compact)');
			}),
			this.addDataEntry(dt + 'button grouped group', 556, 33, 'Button (grouped)',
				'3Zhdb5swFIZ/DZeNDA4kuRxp003qpEq76LUVDFgxGNlOm+zXz8YmhTofVIM0W6RI+MCxj5/3+NjgwWWxe+Soyn+yBFMPPnhwyRmT5qrYLTGlXgBI4sF7LwiA+nvB6sRdv74LKsRxKfs4BMbhFdEtNpaHhEhjFHJPrZGzbZlg7eN7ME4JpUtGGa9vQgCicKUGiBElWalsazU4VjdjITnb4ObRkpWquziXBW06YqVsdZTWP2v/RX7rwf0mQswl3p2cZW2yU3zErMCS79UjbySRuXkiNCBAjkmWWy8IjQ0J084Onu/I1IWldpwgdAguWVHowD4FceWvgtV0AIjhIprNwZAQrUMYGo8W0/lITKcO029CaCz/GVJ/Chyms5GYhg5Th6bB8mJj0SBEjhL2php69gkSec0aHGPawqe8Kt1lsct0YZsUbL3ZVhPO8VpNKOYNQnBGs65E7eLQjXIIGQLfTe1gOpIOkaPDD5XX4JmzjGMhvloUN80vLAcb6Uct7aLqL6MKAQs16PeGtw66l7jhxdq/OKMlxxRJ8oo73R8T2I7wzIiu7U3uRKDrwdJUYOkkxCGuXjkyc3LkhfFNSpXqQ6QHxanslxwaV7yVkpXOur2ZHBEVWpMye6onZYL7m7TpOlwnie4WY2TRvEfFt7pLTlCZaWucEF0RiFb8XrCtnv3HIn0Q9/w+2keEWR8R9qYFJm6ZbrbhtijRMJrYk3Mz+h0cQaKFI9ET0pX7ypuALgi3vswH2gqiIVZx373eB5eX4D9+hA2Be4QNo3GOTr5/GWeT4cqTVAKPWryMvKerV9gpID50QB3hFA2AyX2pv2VMwVdhct/cbxkTvA4m1Xz/+mR2tPbHqT8='),
			this.addDataEntry(dt + 'button grouped group responsive', 551, 104, 'Button (grouped, responsive)',
				'7Vnfj6IwEP5reLwNbYXFx9PTvZdLLrmHeyYySrOFmrbu6v3110JB2S4urj9wjSaYzpRph+9rZ4bikXG2fhLxMv3FE2AemXhkLDhXZStbj4ExD/s08cgPD2NfXx6etvSiotdfxgJy1cUAlwYvMVtBqSkVUm2YVUgl+DP8pYlKtQJ5ZCTTOOGvWvC1kMQyhcQKMaOLXLdnenoQWpGqjG2tlmbIbL0wj/uQ8dnzavkgBMy0qyPxh/4z3ciMM6eMjTnjonCBTNEUTwdmjMKXnZ558at7Ki+rxwKhYN0KTaGyuDwBz0CJjb7l1Q5i4CElfH4KdJFaM0JKXSxLeVGbboHWDYv1+7gTB/fvUhrsLow+g7karZTiuUMBz1UlYyvvAB8Mw8eovs/6+5a6nOdwEGvaB5B60p8V3Mb1TlziD7kM91ApgMWKvkBj+GP4HbTy6yuu/zJwmBZ8lSc1lzcH//AU8NsZfnOqJ8b+uslsZcHncwnKoav2qxODgcPgmGeZeeBLB0iD1y3v0abBzpKJzrdkvkXnWDPhPZu2sYsD3+EXofA82fXxnl1Pu3PD68quUf/77GaCcgu1rUE52LNnjw3K1dgnDcrDDovFkqwN6VKCGzJr0pqMWJrq5dIF72g/3rbs2FiROPi/A3/YDnTXHYX8r4QS7gsl9JVQIn2hdD9UaOckCi9XBqH7KcOJkyW6smMG5J4z3FglpO8b4ACHk54Zvp16CLknG4cnsTfIH5PEyjV8fRVRl5f564Gpt5LIfde+Zph6q4ncV9ZJQs1ep1JqjZmDFEFzp9nXgWOH4ulTMfmDfFBbNvPB8UXXYBA2WCeRW4P5wTu8H068Frcf78rgvPtt7z8='),
			
			this.createVertexTemplateEntry(s + 'checkbox_2;fillColor=#0057D8;strokeColor=none;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10', 
					12, 12, 'Text', 'Checkbox (on)', null, null, this.getTagsForStencil(gn, '', dt + 'checkbox on').join(' ')),
			this.createVertexTemplateEntry('rounded=1;fillColor=#F0F2F5;strokeColor=#D8DCE3;align=left;verticalAlign=middle;fontStyle=0;fontSize=12;labelPosition=right;verticalLabelPosition=middle;spacingLeft=10;html=1;shadow=0;dashed=0', 
					12, 12, 'Text', 'Checkbox (off)', null, null, this.getTagsForStencil(gn, '', dt + 'checkbox on').join(' ')),
			this.addDataEntry(dt + 'checkbox group', 150, 173, 'Checkbox group',
				'7VfdbpswFH4abisDIWGXLYTepNKkPsDk2AewYmxkOy3Z08+ASTOcTu2yRqtUJCSfX3O+7/iHIM6a7l7htn6QFHgQr4M4U1KacdR0GXAeRIjRIM6DKEL2DaLiFWs4WFGLFQjzloBoDHjCfA+j5hE4EAPUaoksSwA9umhz4M6lZJxnkktlRSGF1d5po+QOZspSCvPIfvZRYTjJLk0vY84qYcccSuPMU4YgipNvy1WK3PeBMtC9WuOgcgXeg2zAqIN1eWbU1M4jcZlqYFXtwhw2COtRro6hL4jZgQPtPICxB+Batwq0lh5sSu4FBeqKPwXRVlugIioSD0lrydM8W8c+Pmh4fBh7rBjB/NapG0Yphxn8aEaPhe+O4y3w71Izw2QfqEakjgk3M/sxsW4xYaLaDPPnYZ+7Ng13heoaU/ns5qRY1wMEFxE7BbgkB0eFE09pj3zWJ90lrC881jPctntiYfB5fwMWg6Xt/Zuu6jeDG2w41pphcUNqILut7H5EftcglKzy9E/r73M0zD/vhSS5Wi8kXi8UHJt+7poZ+OqG/6Ab0uvtDEuvGzZSVFaz5Zjsvs6EK58JIbreRrDyqL+l9H2Mv2sFl8NzQjaxGIH6W7oXH07RxMnCX47LM9ezOL6ck/TMQS2IvWdfcqf1L6mfhwMXsJotk4+jxIovvzOD7be/nV8='),
			this.addDataEntry(dt + 'dropdown button', 100, 53, 'Button (dropdown)',
				'tZRNb8IwDIZ/TY5MaQJsu1JWLps0icPOEU3biDSuUpeP/fqlJJRBy8aEdqjkvPYbu4+lEB6Xu4UVVfEGqdSEvxAeWwD0UbmLpdaEUZUSPieMUfcRllzJRocsrYSVBm8xMG/YCN1IryxRYFN7uca9DrKFxqSydUWEzzKldQwarDsbMK5mVqOFtbwQCyz10QIGj1nC+OR5+vhEnS60yo3TtMwwlC3VZ9s1am11JVbK5K+H7DyivRI/v7Qod1cZHKQAYCGhlGj3rmSrUixCBfWcaCFVXgRbYEdF7c95Zz0RdUGAOgyY9wB/gF1nGrZ/QOx4JVHCkvH/cGZDnO/guj/H9xtmzu/HPO5h7uGtC1G1IVolTN6qs1RZuUIFLZcamnbKS+4dv5+530KLD9M6NwR29GHSh8f67KZeslILVBt5dtUQz9D+HZSbqus9Oq4qdB9dbASyrJbY20f3E0MrcsfTM+bLv79yXw=='),
			this.addDataEntry(dt + 'dropdown button open', 110, 200, 'Button (dropdown, open)',
				'7ZfLbuIwFIafJsuOHDvmshwC6WYqVdNF1x7iJFZNjGxzm6cfB5u04CSEZtiBhGSfCzbff86BBChe7Z8lWRcvIqU8QIsAxVIIbVerfUw5DyBgaYDmAYTAvAOYtHjDoxesiaSl7pMAbcKW8A21ljdN9EZZs9IH7sxSbMqUVllhgGYZ4zwWXEizL0VpYmZKS/FBL4yFXvFTiij1yRtAhKej8QQYO+EsL42N00y7sDf2tzo1rNLUmixZmf86euch8ELs/anUdN/K4GhyAJ6pWFEtDyZkx1JduAhgOYGCsrxwaY4dIMru8zr1k6hZOKjNgJEH+F3Ij4yL3Q2IDS+I0QRPbuecHV/dnGET5wFcD+f4rmFGaDjmyMPs4VUFWVdLLRkp88o6S5mkS81ExUWJTXXLS+41v27ufWihZlrnCY4d+IF9eNBnN7ImSTnRbEvPPqqJpzv+VTBzq/rsp5NU7vSnC0VElimqPT3qL9FLInxdos4OaFHCeObJIlzgylOQ1DSWTf/SE0QuXa1HvZTqrms88qUJG+o6jKLhhT3yqMVcKMOonR3w2SVRgpNxWxXX2MAFthtHhjd86qElqTKJ7w5Yv3bB14d2E/XTNPluSxzOuP/XDhh7Wv6mW0Z3N6nZ9XP7ENIXEk3voOTEU/LnH1KmRoWHlPeTcgzvIOXUk7LHH7SHksOUDAEeLqXZfj4o2fCvz1H/AA=='),
			this.addDataEntry(dt + 'dropdown avatar', 160, 167, 'Button (avatar)',
				'7ZjRcqIwFIafhss6QAT0ckXtTXfGme7MXqdyhMwG4iSh1T79JhKoAiJWu9NudQYHTs4h8p0/P4iFwnRzz/E6+ckioBaaWSjkjMliL92EQKnl2iSy0NRyXVttljs/MursRu015pDJPgVuUfCMaQ5FJEwYE6BiWG0RCBJnwIssIbfUZHGWZxHokzgWmqwIpSGjjKvjjGUqZyIkZ3+gFkxkSssSlsly1HKRN/aDka3imKoJVYzCSpq0R/KqZ3V0mVjjJcnih93o1LEbKcXlAJewOYpkFzI87oGlIPlWpbyQSCYmw2CzEyBxYsrKGBbFcVyVvgFWO4ZxO2/U4H0GWsXJ9dDIG/XgewmI7eH17nPxWrggdDmX4WkuIsFrvSs5wVmso5OIcFhKwrRgBMv1r6wDW+0+J4H1oYXaaR0WGHb2wGvCc5vs/CLEgWJJnuHgVG08zfQLRtSvqua+K1tlZr+rdYStVgJkox/VRfRqkddo0QKTWDvFr5y3eUTZsHQTa38bECaCAVmyTAxyofL79mpf9scdpCrucBC33UEofgK6YIIYKfGiPxOtB7LE9KE2npIo2umvTPhhpqwGLtFTh4LKZXLgSsOrSMipKagU61Ul5F/ofscFMp3PnJmnRxIcsRdTvqcWzJdGBcNezem2Rs9vrm6/xRodp6MRfb0xOIea3aQ2H869eXDMAitgdg3Y2cuotiCrNcvVQ8Qr/Dao+nmtf/oW3ca7vBW9dzFsD3R6Ve2PPrd9Vilfxj6Db2ef40uMoOu5/OYBTQ9A4w/oYCmTvRY+4lQF1HcOVNxM4EwTGH87E6j+495c4B+4QPAhLWx564IF6MsKE5w+Ab8ZwblG4HQ/sP8HTqAO394LFun7rw3/Ag=='),
			this.addDataEntry(dt + 'flag message', 333, 90, 'Flag message',
				'vVXbTuMwEP2aPIIcO+nSR9IWXnYltCB4dpNJYuHYkW1oul+/vqW0pKhIBXr1mYtnfOYkSciiG24V7ds/sgKekFVCFkpKE1bdsADOE4xYlZBlgjGy3wTffOBNvRf1VIEwn0nAIeGV8hcIlmDQZsujQckXUYGLTxNS1IzzheRSeSep/cvatVHyGfY8y5tVusqdp6WV3MT01nQ8Lqkq79k/VySLTYAyMHx4EG+Kp7gF2YFRWxuyYZVpQwQhJKS1wJo2ps0DAYjqgJtd6hstdhGZOc4SmbB0/3D99+HiKnfF7M4YrQGE/SsVUGPJek/i3rl3fCALKqpbzy0Knt7Fd0PjBHFJDadaMyouyxbK57UcpgMgs4L8Wk0GIKSAQ7prKUzkO81GHBt0xTldA7+TmhkmhbWpQGFBOWsc5lA7qHtaMtH89mgZ1XVqdPjk6NJsOrnRpoBTw17hYPtj44wV7iSzhTGK/eA8ZGwP4biBrGsNZqKGXZufEkg2Ecgjg40L0NpaHE32M6Ndbym0U7vCeOZXznFdWb0gI+2PgMF1rnvlj/AjIopSOVc/Du/pEqFsXqCpfr5IL3iGpoIZ1XimYMato2By9A2CyU/fd8+c9nDsplz4987zFAnF50zlMOFnrukLMv/yi9rCt+duCN9/LP8H'),
			this.addDataEntry(dt + 'multiple flag message', 333, 150, 'Multiple flag message',
				'vVZdb9owFP010Z6GnBjQ+spXNambKvVhj5NJboiFY0e2KaG/ftcfoaGhohKwAJF9r48dn3OuSULndfuoWVP9UgWIhC4TOtdK2dCq2zkIkWSEFwldJFlG8Jdkq0+yqc+ShmmQ9iuALABemdhBiISAsQdxDBCtdrIAB0kTOiu5EHMllPZ5WvoL48ZqtYVeZrFapsuJy1SsUPsIr2wtYpPp/IW/uXXG8TlAW2g/3YsPxY08gqrB6gMO2fPCVmEEpTTAKuCbqoNNAgmEmRDYHLHv1GAjsnOeKTpg6jcvrVs+VzLnBrBluUXWPhKIu29cs243TucRe9tpCPe/TOCOh5yuVpMpJQNOpZJwymCppI0UpuOuH5d2eMHWIJ6V4ZYriTEdWJkxwTeuL6B0XdOwnMvNk+8tomcuqZFdVCMdnxEjxjQIZvkrnEx/TqC4wrPiuHBG4vNkk4A4nHa7CVRZGrADfY+P+SXJxwPJf9pvBiNrMO5ReOk0r3rKE+7SXDoDIE8gcxfMmXcHk4Uf78cUYHLNGy8LBqG1HdrsGtB+llLpOnDUgdkeDO5gNPBY3z/RJddax/V7liT+GlpnX3ELL+gfh9ujwW/kHVxxaJ4puYl5ummieT4eDzcxz+TyydoT43hCOoYLZip/2pKQOT09rGDGcCZH7bkzd+Y/x8yfSGh2jSqngP9T39/pw/0LfDrQ6InLratHhbdaaYh1mLgjEb9TVjfILfL8w6FdyyX6KJaHmr6t1nkF+Xat2g9/Ffcq9fHD7Eyp37Oys7tUdppm19sGu+8vZGF4/33tHw=='),
			this.addDataEntry(dt + 'multiple flag message', 333, 120, 'Flag message',
				'vVXLjtowFP2aLIscG6i6DY/pYkYaaRZVlya5iS0cO7UNhH597dgJ0IAYCdogIt+3fe65TkIWdfuiacPeVAEiIauELLRSNqzqdgFCJBjxIiHLBGPk/gle37CmnRU1VIO0nwnAIWBPxQ6CJiiMPYqo0GonC/D+aUKykguxUELpzkjK7nF6Y7XawplluV6lq5m3MFqoQwxnthZxSXX+wX/7ItO4CdAW2psH6VTxFC+garD66FwOvLAseBBCQhgDXrE+LCKAqAmKaog94eIWEZrrMJERTD/VzufU4N7SHQ+jXEkJuXVI/Y3g2aEHMJATCmpYBywKlsb7123l2TChVlBjOJWTnEG+3ah2jD6ZZ+TraoS+VBIusS6VtBHsdNrLcYO+uKAbEO/KcMuVdDod8Muo4JWXBZReNA3NuaxeO2nZA3unb/hu39LplbZFnQZBLd/DRfprrYwV3hV3hTGK+8GzEHG8FPsEqiwN2BEThm1+ihzTG+RgdO/ZsQGQvmThhwgjq/yLeUvlRqtJPIzzXzs/8dmay2Iwf6d86/Mo2am48aziFiYn/xHVzgkSafAoN7x8xjnUPWNuHJjb2ocjiI87OAo/iRyu4pgdc/QUdvRpIjtm6B+wY3b/hn3wfmivXb9Z9xssPyKg+JGuXAb8nwH+Qr49fYKdePrCBvfzD/Af'),
			this.addDataEntry(dt + 'inline dialog', 292, 228, 'Inline dialog',
				'5VdNc5swEP0tPXCsR0iGJMf6I+khnWYm0+mxo8BiNBESleTY6a+vhATBBieeJpzKjI20K61W7z0WEZFltb9RtC6/yRx4RNYRWSopjW9V+yVwHmHE8oisIoyR/UX4+oQ3bryopgqEOWcC9hOeKN+Ct3iDNs88GJTcihzc+Dgii4JxvpRcqsZJiuaydm2UfISeZ3W9jteJ85Q0l7swvTQVD02qsnv2xy0yD0mAMrA/uZHGFHZxA7ICo57tkB3LTRk2cxWyL4FtynbalUcAUe0Nm27uCy62EaAZh4kMYPqhwRpM6f6/snpZUuPWqOsBfn3EhBQwACsYe9AUUpiATTxv+yFiAx1nG2HbHApzFnb4bezmaIhdEA9SwKlhT3AQfwzPsMSdZMLBERLCiZ/xHLpHAWRRaDADOro8z2JoPmDop9zy3K0qt24L1HKlbEPWIOyNM/Go3XwxTiNnmd2yFM0QbYC6ULLw8VycByV32kYk11MzjkK/93Ch5jpWAlnsSmbgvqaZm7ezVWVKdaSTqCNBE6gjGajju5fBKfrHaO3R1dU0x0FOddnUR+Q9tRtf7TeuqM+o4VRrRsUsKyF7fJD7X3hYRhFKLlaXp3RyJvmOZata/iWYK5bnHE6IqRWbS4bTB+B3UrNG8GSlPMddwNsjfxdYW6Uxsblt1l/F6IPUFo+VcfwhYiPoQGwxnkJt6UBtK1dIUlrVjrVa2sUWLqmSPr28RVrV2YxSbgJNtpt1zKe/t+5csAiCyS/7pnTj7jcuecTMpzaIzdXH8f7/tVZN8yaLEzyBfC7eeSab4wSn61NEHpSu0eNY+6j923msRWqOD6G6CtD1mEpGiCLk/ae1y7cBPC7Tlc4ozOzeQNWKaZhZGo0tbfrsI28D7zm4XbyKG5odSqzr9xU+ncA/x4cFsuu/R+G2+/JF44f3P3j+Ag=='),
			this.addDataEntry(dt + 'inline dialog', 340, 450, 'Inline dialog',
				'7VnbbuIwEP2aPBblyuURAnQfqFSJavdxZYghVh0b2YbCfv2OE3N1aEGQh0hBAmU8thOfc2Y8OE4QZ9tXgVbpG08wdYKRE8SCc1VcZdsYU+r4LkmcYOj4vgtfxx9f8Xq5110hgZm6ZYBfDNggusampRjgSrWjpknwNUuwHuE5wWBBKI055SJ3BsPRyBu1oV0qwT/x3sM4w7oxRQn/AtsFI1UZNZMgMZ+Sf3r+SHsWnClje752U7JkYMxhGRimG2ywUGSOaN84MpIk8HjFw4MPb68CkDeZ1b9inmEldtDliyQqLXqEZskpJstUncOAZGEvDyOPaMKFAbQc3MACd6qQUPrmSM1TwpZwqVIi9Rgp1/gO5Pf4VgA6xQt1HXKYfoXm8OyTvNvQcx9hYXvOwAkpvlsRK6HFyn2CX+QfC3sdCmMIheiUAO8aAZ7Bf4wyQnfQ8BuLBDF0QUto7JObuPnHpusRFnZGrzYLQVlshM+gIbJo6CfJPjSwkBYpt6r/BO9TKA+2mdGC8Bb8wh9zybfJRGCKFNngs/nLQDS3eOeEqWOU7DHbnZv7CfhiIbGyODg85020tO+NjqOme7ekKFBwGPf64/E5U0WnPwZH/1lk9ErICKIqyIjcCsjo/EwGpJqVvsy2S11EtAiXnRaZcyZblPNPyNN/lxRJeSM3fhh0ot7j3LS/TffeGXRuK7LyjhfZxHnPIe5ln+bM7V86rSoCqWtx947IErZ492MtGBQ1dzC5lnkRdPNG5EdBN+raubCsy8U2clkUWJt9MKBohuk7l0QRrkeKgqJDwTC58B8Kh6sVxdNyb0nqDauIds+tItx7lmSmKIMG+F1jau+IjWJqpJjAr0Axh+L7KJkJ1mUkiEbhDWaNaGotmnZYhWg8SzQxklivMk5RNisrvhvV1Eg1vXYVqrGPiiZE5pmGZCsJYDaaqa9mDvXqczVjn4B9oCzTq3ybDzlDNGlUU2fVtKsogz37hK6fa6b541R/xfQqKYPtw8RYEKn4KtV6cQdrxoCLpqyps3QCv5Ji2D7w/AB5aNVMMwKrbCRTY8lElVTC9rFsTFiiV/mLz2ZNlqm1ZLpPKITBPL7CL7qfvuH/Dw=='),
			this.addDataEntry(dt + 'inline edit', 350, 55, 'Inline edit',
				'7ZbNbqMwEICfhmMiY0PSHLuk9NJKlXro2QWDrRgb2U5K9unXwDSFhTRZZfe2kVDmx2Mz38wAAUmq5tHQmj/rnMmAPAQkMVq7XqqahEkZYCTygGwDjJG/Apye8YadF9XUMOWuCcB9wIHKPestr7URPrYzW3eUYC6ElImW2nhVaeWtP6wzesd+M3JX+SS2oRcLrdyr+NluEJ502BF5nUpRKi9LVsB5B2Yca86m0pkgj0emK+bM0S/5ELnjkE7Up4s4EyWHMECAqO318hT6BcYLwGaeE5lwule50d6N0cJfd/D/sn+XwnIvZbqq/J3bCUmj9ypnOUCiJgNGmxbRgHKASdH9Jqi9J0o292k65t0vegMauLXUNBOqfGoBk218C+QjsIRNhsw3M8xJfDvzaML8f1eOCcWXCZ3rthBP2y1FKU7jiwxvgAIBBEHyn111N9NVM8g2tyNbXUY2HClOc/0BnZFTyzuSqPfU7fqqKduH95I6Sa0VVC0zzrLd7MziGK8eZgb1GqDxt0DRMh4BPekDouFMEwJ3wyR14sBGp89Rhht40d0r4vP0xfjwRTTeQBeFZW5SpFMWV9Vt/c/r1vz1ml0Ygmg8BGR9VcnCP39uePXri6JnP/zg+AU='),
			this.addDataEntry(dt + 'inline edit', 130, 222, 'Inline edit',
				'7VnbbpswGH4aLouMHUJy2RzoLlqpUqXt2gomeAMcGadJ9vSzwSQBQ8sKqdItSK38+wT+Dr/BsdA82T9wvImeWEBiCy0tNOeMiaKU7Ockji0IaGChhQUhkH8W9FtanbwVbDAnqegyABYDXnG8JUXNM6eMU3EoGjJxiHVDSON4zmLGZZiyVNbOMsHZL1KrjEQil7FwZDFkqXihv9UEzjHWMwIZ45iuU1mOSSh0czmZBZE7HXsToB+QcEH2rYvMq/QKHwhLiOByAWBHAxHpHkjPFBG6jvQwDQ7AWRGvj0NPkMmCRq0ZQWQg+E3ewECPs20akEADg/lK4zJV6z5DVq4bumjiTjrAW7T/0IuEqmaDVzRdP+Z4LhAwQQ3zq459D4wPGkq3GPEe5MjtD/nIgNyAO4vwRhWT/Vp5y8acs10GbVnPN/cqUHAFB0cp0Z7kwV4FIxsUgfy/cO1p0Q3l3eA4b1GBZyNPBikTq0iLuZGtGrW+D+SlZqGcrARlad6VK8hmnVhAb7IA7AYaGlhwNIScxFjQV1K5XRM1+o7PjMoHgWBfnVrf/c6rTsDCMCPCYPb42J3IdruTnQmykTjuIirIi3SCqttJ+quuOTmxlTXTWAaP6pL1Ul0BJSeHlbRL0/k4obFC5jvhAU5xLR+OTG8CoNVRy4vnYsnYNhdLVkwD7LHbUzrVAX8pJG8QHd2Vli6FhC4gpPH7QmpL0shUwDGPVgUkWxb+0lm6horyhB3hgO3yoH/G9UC3jOu4sH/K9QzwnvBPueI6gjXlNuxHVfvVfTXyXd9rtWUJH6g6uuE1onQZNF123F45USY68dOFkvHHXjQQ6ueTQ0XCg9pico35NQx1Jvz0/Fpuxh/Ir94gW/MwGfUzdubpTTn/sHIGlUo56fn+QQK6TUzFNHzBdPzw/O+3BzS9BHWOQV2rzWPawE7+unw/A6DBvp3egsAg7ijrBk6s7iUgN09lHqWwb1YZzioevARv5llQq1Wu7GACLmbAm7d8a3azKRzGpl/nZMIxz6GeaDrwR9HNxW+42AEXSb9XeeR0dOhXOnIqLHJlb7YXzQkdTplu2vm62ukjFhmeftgrup//7vcH'),
			this.addDataEntry(dt + 'inline edit', 230, 60, 'Inline edit',
				'vVZNb+MgEP01PtYiEMfJsXE2vXSlSpV2z8gmMSo2FpDG2V+/g8FJ/JHWVbZrKREzMAO892ZEQJKiflK0yn/KjImA/AhIoqQ0blTUCRMiwIhnAdkEGCP4BXh7Y3bWzKKKKlaaKQHYBbxTcWDO86K4VNyc3IQ2J+EndlyIRAqpwCxlCd61Nkq+sZ4zNwVcYzOD4U6W5pX/sQlmZ9tnRGBTwfcljAXbGT/dJgswiVaLeIn8AZkyrL55ycblb/jEZMGMggugI89M7lfEPlPO+D73YR4cRLWz9+fQC2Qw8KiNI0gGCD7L4wA8JQ9lxjKPC1Wph2Vlr30FLFx713wDdGFmnqwet9suxG7Rb39RbD0VTXm5f24w3RA0BBY1Xx//O3A+eTgjF/EZ7CS6H/b5APYB5jqnlR0W9d7WV0iVkkeNQ/Cr6tEaFq7sNLNqDJeNUVtjHiJnwP8mClduGWmW4UUzY404JDEYpTRp7gU9WhA9fvFmjeLEZuGKpYZLy4CWBwvZehIL5EMWUDhCwwgLMw+hYoIa/s46241R43d8kRwOglHdTe13f4i7CeRup5kZMHs+9iSyo+lka8MqwPGYc8NeoRKs7wj0d6vmUo43WRsWVo/HOY7wAo67BnVlnF0qrKUdim5LCy4sMr+YymhJez1xPrU2x8WiXRoULqI7pdMN+KKQ4n+io4e2pFshkW8Q0uJzIV331pxm0MudSDKq84ti+q3FCKo1p2WY5ix9G23erVz6wrqj77YBq24NkuUk3pb3d+H42/Gs/zOW5zdBi2U8rZl+/SUB5uWd57R8/Qz8Cw=='),
			this.addDataEntry(dt + 'inline message', 150, 180, 'Inline message',
				'7VfbTuMwEP2avFa5kLY80paiXcFqBVrxiNxk2nhx7GA7tPD1O3bc9OKAQC2IlaiUynPx2D5zZpwEybhcXUhSFVciBxYk50EylkLoZlSuxsBYEIc0D5JJEMchPkE8fcEaWWtYEQlcv2VC3Ex4JKyGRnOWZaAU6hg8gnElVcVoRjQVXDXeSj8x5z2njI0FExJFLjhqR0pLcQ97yrng+oY+m1lRtJZdGCMTRhccxwzm2pnXEYI4SU/7g2HotgpSw+rF41qVO+sFiBK0fEKXp8aauCBLmuvCTUidrgC6KFwUh1pIVCMv2kgbLHHg4OyGNvGg/fnj+sxDsNAlcyCoguRiiUKIQk5UAbkT0FIZ/3K1MFTpEc2IUpTwXlZAdj8Tq7vYwLaVDYQtDNPBZPhaSnaczc9PhcEb08/OnLqkec5gL4XhXorNZhiZAfstFDXMQaVs4G0DXu7Z28CqIhnli0u7/iQ6KO/rCS6Io0G/gwaxz4K17hAWnHgsGAs+R4Fn8M2FL8CFYfppXEg9LoxIORPimwdfgAdR9HlNoe8TgepZnd2DNpGzTNRc//eXbZR0lNZH3bYDD9JfsERFrUAquwfrPgMDqTkALoePhIcalJE0lmH4V1DeOwrucUc1vI67K7Yj4N5xvbUYHxv3oYe7B5/XqJ5rCc3/HWF4Ur9LTafDkW08b+lS0SAenYwP6S5vbW/bfXmnIaWHpM1NaF9OX0vjB2XxtCOLfWawmOFgYQZXNdO0YrDToBofjN66Baa5JVG4O7yFTQmSWouSWICZOT7lj1TbsNyIfKdsbVVuNUc8SZhDBTxH8HGMeUTARC0327IFrjXaVa97N+t9Gx6hd9ZSqf9Qi+YQ9p7Mh9uq5nx/qpzY3bpF3VJbUDRR12iEwngdsqIEkuOcUkh4cZW9ipOIQ25fFGy7l5nrSolfaXP78yoNLZPpeXSetpZbx8Kdl5KO22SrRpYFJvYGC8WsvcTa9+omDjeqa0fp2H9xOEJxxR3FdNJRTVH6/vsdxc0Xu7XtfND/Aw=='),
		
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
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;strokeColor=#DFE1E6;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#42526E',
				 70, 20, 'DEFAULT', 'Lozenge (state, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#DFE1E6;strokeColor=#DFE1E6;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#42526E',
				 70, 20, 'DEFAULT', 'Lozenge (state, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;strokeColor=#008364;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#008364',
				 70, 20, 'SUCCESS', 'Lozenge (success, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#008364;strokeColor=#008364;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#ffffff',
				 70, 20, 'SUCCESS', 'Lozenge (success, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;strokeColor=#BA3200;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#BA3200',
				 70, 20, 'REMOVED', 'Lozenge (problem, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#BA3200;strokeColor=#BA3200;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#ffffff',
				 70, 20, 'REMOVED', 'Lozenge (problem, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;strokeColor=#0057D8;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#0057D8',
				 100, 20, 'IN PROGRESS', 'Lozenge (current, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#0057D8;strokeColor=#0057D8;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#ffffff',
				 100, 20, 'IN PROGRESS', 'Lozenge (current, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;strokeColor=#6554C0;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#6554C0',
				 50, 20, 'NEW', 'Lozenge (new, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#6554C0;strokeColor=#6554C0;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#ffffff',
				 50, 20, 'NEW', 'Lozenge (new, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;strokeColor=#FFAB00;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#42526E',
				 60, 20, 'MOVED', 'Lozenge (moved, subtle)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;rounded=1;fillColor=#FFAB00;strokeColor=#FFAB00;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#42526E',
				 60, 20, 'MOVED', 'Lozenge (moved, bold)', null, null, this.getTagsForStencil(gn, 'lozenge', dt).join(' ')),
			this.addEntry(dt + 'inline message subtitle', function()
	   		{
			   	var item1 = new mxCell('Yeah, progress!', new mxGeometry(0, 0, 120, 20), 'dashed=0;html=1;rounded=1;fillColor=#172B4D;strokeColor=#172B4D;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#ffffff');
			   	item1.vertex = true;
			   	var item2 = new mxCell('IN PROGRESS', new mxGeometry(10, 30, 100, 20), 'dashed=0;html=1;rounded=1;strokeColor=#0057D8;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#0057D8');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 120, 50, 'Lozenge (tooltip)');
			}),
			this.addEntry(dt + 'inline message subtitle', function()
	   		{
			   	var item1 = new mxCell('SUCCESS', new mxGeometry(25, 0, 70, 20), 'dashed=0;html=1;rounded=1;strokeColor=#008364;fontSize=12;align=center;fontStyle=1;strokeWidth=2;fontColor=#008364');
			   	item1.vertex = true;
			   	var item2 = new mxCell("Don't stop believin'", new mxGeometry(0, 30, 120, 20), 'dashed=0;html=1;rounded=1;fillColor=#172B4D;strokeColor=#172B4D;fontSize=12;align=center;fontStyle=0;strokeWidth=2;fontColor=#ffffff');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 120, 50, 'Lozenge (tooltip)');
			}),
			this.addDataEntry(dt + 'modal dialog', 330, 210, 'Modal dialog',
				'1VZtb5swEP41fGxlTJN2H9ukrTZp0rROmvbRhSN4NRyzTUj263cHhiSDbpGmTRoSfrmXx+d77hBRsip3j1bVxXvMwETJfZSsLKLvV+VuBcZEUugsStaRlILeSD68oo07raiVhcqf4yB7h60yDfSSSC4Nud4902LDi0GQI0FK4fze9KbLbw0Oigunv5P0lgziq3p3UA4oX7CxpMyUK55R2WxApdB64NPDSDwJINPbGbMZ6akokkksZiMQ2tHgC6Ax19b5bqerDc17bPiywLq2gGoUGWS1ri5p/NS5vnv7ke/9hLlvKfFzZxj9Aj0Ch5AqGpeqrCkqVaOjyR17MfRd47tjnAfFMJhzOAW2Y3iM5GoA1qqKx7wB5tbAlucV+/vgxfi6rNF6VfXAOdpSeY18M/WM3XEBtUX7QtPFJPDa4ldIvevBg1ClXm+11+DGQIJGO9eAu3yNLHlSTbLwJZX/OiadxabKIAu7XBuzQoO2s0vy7uGceYsvcKRZP9zH94tQkU9dQa5jyUk2elPRxkA+FOyRm+geBixUhm04Vdl0gKBdW2gPT7VKWdBSu7I5bZmNZC3ZewvW61SZ23CYx3q8Jutg92qPdqLQoI+AJXi7Zx505oveIkn6PhYF6E0R3GQchMr1gs3oe2h5WoSun/8CJJMvwG2WTcjh2uwI4Zuey5QQi+v1zYSpCiv4BUkppQXsYBBCECPK55AUOSUyVMY5GZe/zfhiJuFJSJYFQ62zhRP4ORLCCR9Qd10X4pEiYO8DwOInHjHPHfgJi2OgZxF7NSF2paqUvwx/zG1g8B/RunizvL4R/wGty79AK20PfwO9+fHPwg8='),
			this.addDataEntry(dt + 'detailed modal dialog', 330, 210, 'Modal dialog (detailed)',
				'1Zdfb5swEMA/DY+JwBRIH7v86TZt0rROmvY0uWCCF8Mx2yTpPv3OYNIQ6JouSbVFCth3vvPZP98Bjj/Nt7eSltlHSJhw/LnjTyWAblr5dsqEcIjLE8efOYS4+HfI4gmtV2vdkkpW6GMMSGOwpqJijcQhoUDTN/fYWJpGK0gBXRJX6QfRDA1/VtAqRor/QukNDvCuyu2jsvXyDSqJyoSq7B6oTFqvGFrjuDsZinsBJHw9MGxA2hU5xPfcwQhcrvCiM4bXlEul6x4vlnh/gMoslhndJmPFTiTAqHkxxuuX2vT9u89m3XeQ6g1u/NAcgq9Y48GEEFO8hjQvMSpagsKb2rcyrt9Uup5GaUaNG0hNOBlsduEZT6pkzGhpYa5pxQxbwdbmPjX22loZ/zwvQWpaNI5TkDnVHMzK6D3U01mvG5ArvI16gZcSfrBYq8a5FdJY8zXXnKldIFbDlaqYGj8Fi3ROE8l0jsd/5qFOQlUkLLG9lAsxBQGyHuen9c/smZawYnua2WLuzQN7Iu/qAznziNlkwZcFdgRL2wO7Z+bWP+Mwowls7KxUxq0L7G0yrtldSWMj2GC6muHYNTT8GTHWayY1j6m4sZNpKG1yoYJtn0zQWmSz85ZBzrR8MBB4orNmhO83SexmjC8za0Y8K6SqESx3to/5jg2b8sPp7/fS/yZJemTMwaxpmGUei8l1g2g26WEqoGB/IBTjtjDZDrAhuDsvX+2mkD5FeyyO2XEyvONdg4dOb49GMADDtxspmcCcWrOO7RAgO/sn4HU62qlHXkvazj4KDyBDmiqme4h3qziK+lWP+pQWsakZJ4O3eF+JeXAdRhP3P2cevQbyoIf8Ay9W/xrwXmGuS8jZ8D4D1L4qnZ7EB0TbfDsr0HDgxe0cZXsRLSaL66Gn69ydk3nUeTJGF2HjuZessKQLxwsvACd6Hg6+a5SmmW+X5uV/zEFFYx5DocYCYIXvFd+Xgip1TLohHHLlR8F1l/Nh+TyGVfiCMumOgz470kfXyk5F1+bRrlBegNykR+5tEwRumn7Fcun9Rbk8/Wn4ouffmcrlQT6OgjM8/rD7+AndDN//wv4N'),
			this.addDataEntry(dt + 'small modal dialog', 410, 410, 'Modal dialog (small)',
				'7Zndb9owEMD/mmhPrewECH1s+ehLq1brpD5ObnIQq06cOabA/vqdE0MTHFq0kolWQ4rA9vns3O/u/IEXjNLVtWJ5citjEF4w8YKRklJXv9LVCITwfMJjLxh7vk/w8fzpnlZatpKcKcj0IR38qsMLEwuoai7jGCsYPk+KZVFi1IFKeVFwmVXShV4LK53oFOc8pl5wpeQiiyG2pRkXYiSFVKVcMCs/WF9oJZ+h1jKeTuikb3rITD/w30YxTjq4YoLPMywImGnbXOtGyo9RmLBYLu2oTEVWhSktE67hIWeRqViijY04Fnk23wzyAkrziIlLO5iW+WYq9iWtSY0grPZauayyJr4GmYJWaxRZ8lgnlUSPViRIAnye6J1KVlQV823fV2j4w3JrZxg4DK825DKWgsMsZkVScjIGOAhgJjNw2NnKGjZK27G9mnKj49HaxXfB9i8G4ZAcZHT/XaNT0mJ0GxJEgWCav0BDfxsIO8S95DiyT1ZNNeuqONghKWezArTDcTvPg9D2HLQwP8eKOwQ8PwZZNPg0nA6nF22hOSETfxI2wip0CduIuilLY0o6RhqELUiDoAukwy6Q9h2kDyAgMrPQCdTT7louzKuzcoZalq+HjHgpy6IIisI2nEqAk68c4JQGHbjDwHGHR4WrVo3wqcD90tmb9ruI9dCB+2OdG7bfvB4+OFoWV3GfVV9cHW/R/p/a3+IddsF7uD+3LwpQJl0vE5PII2aAL22kl7ldJ7yoZ/8l14lclKk+z5VEnSeUC750ovdJF4n+wvGNOwx4Vc7+1wIX9hPC+6VTvd/rIvQ3B7ka3+9gAtwcNvG1eKGlPdbtOT9vD7KGdgM9tuRGPl3NzUXBOdOC4XGcZedRAtHzk1z99N3kT0g/HA/f8oa24/SOV+yej1MexwJaskHdu8xkBHsCcS8LNIA0HVWFdavwZqd9q9hZc47kYL7rX5u6I/tXJ0sLpY5/bU/5MS4yuu125u3NAZn6037rlcxwPJoEn8pJGvlxXyR9Nk8KyKALT3Lv/G5BHes24f2sU3eAjSNFaH9cC/9ik2EvFj+Attlh3SjVsA+625ue0V4T/Fknl0nUvSgcYQYB8Q83HseB/vGtx4HQ+x1CDztgjsXX/w4q8fpfC38A'),
			this.addDataEntry(dt + 'medium modal dialog', 616, 420, 'Modal dialog (medium)',
				'7Vptb5s6FP41+biJlwLpxy4J3aTualIn3Y9XLhjwncHMmCS9v37HxhCCSZpNMN12idSCj185z+PHh5Ms3FW+v+eozD6zGNOFu1m4K86YaO7y/QpTunAsEi/c9cJxLPhbOOGJWlvVWiXiuBCXdHCaDltEa9xYGkMlnqk2ZCKHZa3thfuBs7qIcaxLCaF0xSjjqp2bqA/YK8HZN9yrWYcbe+PJHqwQj+Q/OTCsy/2AKEkLKFCcCF3d62apjxwwQzHb6VkRj/QQsrTLiMCPJYqkYQdulM2hSIq0nWSLuSARond6MsHKdin6IbXXZEO8P+lIZdJevMcsx4I/Q5MdiUXWtPBtv+mWYZJmutuNRsBCVWNIu74HXOBGQzMOkzsCk09bnx3h5X+vWVvxrlKeuoMGdlDuD5Vwl8rrIxYCXFW1o8E6mgGb6tYck23PBNDYVq8WOh03GPa5xwXmiJ5sPxxwZLQX5xj4I+podHhkIJQXxEvTC3dliRFHBZDovB9+ZeW/sqCfXcaUc//FBElgvwjCipd4MVzIaeXoa0XBCmzIhDb2FMJ2xhXisGvbMf7WW9AZaEgnIGMScMmWd17c8rZtmVve9bWRYwp+3OKjCcZ0QM/xhREFmF5RqxzPx8V2AJYkFRaGjHQLvUhZbl4+AEB+S3lLiYIoJhxHkh1gqlgtPWFK/sYCyfcNhC5T2gvcPuZ1dxqv2+6x2/053O4Zbu9E8rdvopEtMw1KrjUCkzMRSsFvQMk3UHrMIBBxrH9hMRAHOaFyKTwMYzlcclxVKMWVAeLZwCm0Qif0RgOn5Xq1cc9ERgNkhzqXkzimeAC5NcIQip4w/cIqovc1b/DqBnwY1HcD61jrQc2/Vmdhj7Bd4CbtMaoy5YKp6GU7Jrta28Tsup2DXYHBrjWpSorkYwqSY9m0gH/OzbuM1RzuEsZzJM5JxCmPqxql4vk+lW8b75GgqKoIKt5HGY6+PbH9P47JTRklrJfnhOZ10PLVMc6e5bRfGpT7SOKGaOp0B4dwvCV4BxJmPcmnj3GCanrl3B/BOW8Ozt2e4lxKkivN/kSaLeegWeeJA8++1lxFaRa4Rq4H5/BuG6nXWhA8weQlv8ZrbzBe69gwLcVsg2KfpFuv7Hlj7LmZhT1mrt32DO4cHWyXpt7DIFyGtyfyMM4mWPTT5oHJpGNcPZOC3q0fLKdC0vNMJF13EiSNlJk7C5JmOj4nRS1GDpKfSdnMueU7Jk2Vf5svs+Mshxj6c2BoJj4fWCpniWOlezIVZ0WZfN22YiTQ/xbaWdT89Wl2MMtON/O0mwI9yTPfqsqmrXrHuMYAbywG6HLX0/LJzCivGJffp7SEkl9cw6S1YDlSQNDnK7feGremiEqgePiZSNO8/yuSHw=='),
			this.addDataEntry(dt + 'error modal dialog', 470, 190, 'Modal dialog (error)',
				'vZbdb5swEMD/lj2gPrXiIyTNYwtptYdNkzpp2qMDBrwZHzImJPvrdzZOAoVU0bIEKY7vfB+2f2eDE0Tl9lWSqvgCKeVOsHKCSAKorlduI8q547ssdYLY8X0Xf47/cmLUM6NuRSQV6hwHv3PYEN7QTvMTGlRgAN2uoVH4rwAbnB1VWqsK3f6CNbZ3X2mroBV3Dyh8zrDZGf9KQkJpir2WqcI4sVpHTBQDgZ1nUq4BzLiZUEVlSQTOmu/6uYgZTEBkLG8ksc41VYqJHANGKHHITWih00laN1xpOQN5zIuzfeiWWqsdt0stVIkbHntO8CyhESlNrZThnCLgGEDbBZl5UF8rCb9pbyR+WXmrUHuAUG/sjw7s+SgTznKBAqeZssM9N9c8OmBBUmhtViKTfQiU2oIp+laRRCtaLBBtjiKuGxW+9t5QqVhC+JNNpqBn9F0LcaDtLGO0ptuTdWJUtkheKZRUyZ3BkyI/YzFbdLXkFpTlxd5taZWk7hT5wfdYdtixlTddhcGoCmNbAO+IpaQuDCW9rHPxxasgdJ9G+AQI+gG5BHeGyr2BnYJ7iPLD7os/pmvL5ZxN96c3feiwG0g9IPMJHoHdS0k5npYNHfhOMbLZvwET6pj63pu5g+z383ecIcvwGI4oH1ZxFvjZCHxERILX4OXgLd4bMQ+X88WjewPm4RWZL26BPBwh/zSijddipbuygHLd1CPO01BPnPrp0zkugsNd7E5VxPFyDi6h3CPpT5Dc6y4k6Q9B+tfgOD95Z+PsK6iZAvsSOOcc/8vJfZx+z+7PrXfyvfuf+C2vdxTDIUAvuBwgisfPys68/9X5Fw=='),
			this.addDataEntry(dt + 'warning modal dialog', 470, 220, 'Modal dialog (warning)',
				'vVfbbuIwEP2aPBblQgh9LAH60kqVutp9XJl4IN46cWSb2379jhMDuVGxLYBE5LFnbGfOmUucIM52z5IU6augwJ1g5gSxFEJXo2wXA+eO7zLqBFPH9138O/78zKpXrroFkZDrSwz8ymBD+BqqmVexYfkK5wj+/4gFPhegtwA5jpQmK1A4yMjeLEggH0ZVarYkicYhhQJyCnnCQA1QfgcO5QI5mJtxTsun2UOCWnNdHZmIfMlZos0JW1ZedGH0KVMFJ3swVilIGFS3VnrP7a1TnaHvpp4TTKRY4wWolZa4TSy4kKVesCx/OK+0FB9QW5nOZ94sNBYi1+/sr9nY81EmnK1yFDgstV2umbnlz2yYEiq29lQik8MWKG1TpuG9IImZ2CLWRh1F89LB1DfWG0AXJoQ/2cO0qCn9MMI0MHoWLtSG3VnIyymL9zOIDLTclx6lOq00hlFFC/QmW6XW7MAVl6hqYnW0PTEIB5ZE/YQK+ggFHbwoUWmJkXmpS8Gbz58mla8b4OUih09wS9AvIA8K9gqnXX5Zr/hdbC1ZLnG53+/ypsG+IdXgGPWgEVhPSuBEsw00bPsQsqe/CZbr09EP3tBtnP4waqEslksFuoPx8S0ugn3YgT0meYL57PvAW3jvhHn4OIrG7h0wD2+IeXQPyMMzkV4VjRbsmB0LM8x2K1PrBuTvGtN4+fxNOPr5K9FeU/YifzKMW4wYtwhgmMXJAvibUEwzYZgiK+8fE/BLaz1jlBrjdhloJ+yjXo3TNn2/lBbT8DukqhHH70vd7lWI4zd5064HV6HNqEObY4tg24MLM8ZXcoTXX8/rBLl6PqhD93i7oG9hNw5vgF3Uwe5NihV2cOrY1KEA2P2kHRibCf7UID12I38Wz6Zz7xye9QDrZPNmyHnuJw1bgwfXCs274et5/g0AHncAPpvJlYbiTG/bW9bPZvKektykg/vkzYYBzmPpoAxOaNYCfE4yxo1rfoKkJCetuB9eyoNgQpnEbFQlfyXW5lITVW3jDkbhpT149B/NgTsIO+2B18Ok6DrdwaFZO3QHwfeJhOLpm7VSr3/S/gM='),
			this.addDataEntry(dt + 'multi select', 270, 390, 'Multi-select',
				'vVjbbuIwEP2aPBY5CQnlEUKokBZaqd1dad9cYhKrJmYdc2m/fsfYQMilhNsiIeLJjMc+Z2Y8xnKD+eZJ4EUy5hFhlhtabiA4l/ppvgkIY5aDaGS5A8txEHwtZ1jz1t6+RQssSCqbGDjaYIXZkmjJK2FkKmkag1jSOYGfL56STCtm8pMZxUTOYbkD23L7M8pYwBkXME5BGUSZFPyDFIQznspX+qUmsJUdZjROYcDITJrXOwvLcb2u33lEIF8nVJLXBZ4qwzVgBTKzbiIk2dTufSsyG38ifE6k+ASVNY1kYjQ8jQ9KCI0TY2YwQzjT43hvekASHgyY1cC6JWBLAAq+TCMSGQyxmBpougVEAYrZ9lOCFd60g25vCGvq5+jQSr/NLh0lAfCA0h9bnAcuKoONtp8iJ1eA/Gmw9LRFDnOnU4G5616Pefs05lmCF+oxk2RRE1k5IA8MobqQLmNdoA717LDtgjwWOKLkAHouJ4Z4TpkC7BcREU5xIVXaTely+xEVKnu5EmV8qRbVz/Q0qOV7TRPHreb02MAwjFpliu0KhjtaJAjDkq7I0VRVrBv3L5zCqva+H3YsG+8Phbjhs1lGZClq9ptoFEheKZB6DGcf+JoUDoNwMLTrwuiM7D0jGo7r7RXEf0N1VTLvCuiVXHvHTNvoDlT7p2tGnpsER3xt6kGEs+RQHExhmW9idZi3sISIyShOW5uqsu09+n5nWMF2E5K8K7Ozc7fktP9DcnYqGPOZCvd3eIjltsZpgYp/UJ3ucff/LrlW2HUXOZG2fekFo+EIVoHeRuMQfv48T8LdhLA2PeexHxCXfEd0lROBQxtVvw0gaWdcpBTnpmtsPSErHF1k+SxIDOfEBZa1NkXF35AhULhkMze38HjTUBg//5y89UaTq2OhybKLuz9p0xMUGvN66m/hY1uxoOTd1ckowsl9PYyBJ3wxVGe7m5B3oduFO+7pROJXSusPtuNGpvHtYzAM7dArdBpOdSNS1a/sz9Pj9kmNqlpz0wiZtkidknSKWc/4knyxW4nZI7KKzZOTE70p/YHduCn+/qLjo4YXne4NbpeP59wuUZnRAwEnmlGuoJJqi9voFERdJnbdSrOWslMNW9ML4aUtiaGlXbC4pAWB4eEfGa2e/8PmHw=='),
			this.addDataEntry(dt + 'multi select avatar', 340, 320, 'Multi-select with avatars',
				'7VpZc9owGPw1fgwjXxyPYI62Q9pMSabPii2wWmFRSwTor6+EZQOWcZwap1MKMxw6Le3utzoGw/aW20kMV+E9DRAx7JFhezGlPPm13HqIEMMCODDsoWFZQLwNa3ym1NyXghWMUcSrNLCSBi+QrFGS02cMLyKEkgLGd0QVhHwphjc0DXswx4R4lNBYpCMaiQoDxmP6A+Uy5zTiM/xLdmDKdpCIrkWCoDlXxWkLw7LdXrvTBSJ/E2KOZivoy4YbgY3IU+NEMUfbs3PdZ6mJThBdIh7vRJUNDnioargJHiBEeBGqZgojAFmSXmRND8iJHwq8YiBtDUgNwJiuowAFCkMY+wqaXg5RAcV8/9JgFSWO1+uPxZgGR3Qklb6pWVoyR4CHo8V0j/PQBjrYYP/Kc1ID5J3C0k1aHGFuOwWY23Z9zB0N83sY72AU6eI9h70LdPBH3mg4Ns9p+g24C1FUxD0fKlV4sEt5AC2diJ57XvsxIpDjF3TyuCJy1BMfKBYDsYAan+pZPfzOzEUUnc8Z4hq32bAr0e2+HmLH5IQwoBuRkGAHkIV79kFSspL1l9uF9N0W5AQK04NRa1sUcW633e6MC+iuQpJTTNJpgxLKOjpjnYsQdmc6p5TZDTDWfp2xPBmYsk4L+zRirTVDcZXFRnBkuXbX7Z5GZy7wMkstCTw9hE0pGAKfEXmgDHNMZcs4IWMgucc+JNNc+RIHgZxfVqGvHpkV1NFOiVqsksXtT/XSaEh3NIFMMYMi5wOW9W4m/q4mboL3sPHuP2jjnf/axns3G69h42e0c002nnZa/fRT+bwzHI/MkXtsBKfeX81my88sbaBRUHhmySrWObRkC8MBq9nTZDKaPX788nmmwVb1qH0UMTFiApvU4ArO3bkFDmgrl0qrURREoTqqV4IeFGN/rPdOyQGxpuCb0bt+bVKi94LdSbaBeI1LKqniu9TC8tReiIDSE3pNAhyzCQL065ZPa8ZxJPI8yMT5X0yoTdKFQST9DPz2z7W8XRscyfiQ1V7I7+/Ml5044LCn8Oky7VEMLuk0qfyOa+Fblz337616VcLeKbBY5yLbonS1TDXoNqFB/fqpP52KjKfZ6OvNyC/tI91GONTvlGZQBDoQn2tEWE0fYUx1c3OSK3ES0+w2IUP9omyKYCQvQmYcvaCorhAJU93chHgtQnQb2VfpF3JyOyVn6YVw+Yziukr0/bSfmxSvRYpdpwkp6veEDxAv5Nb+cR1Hgul6QlzxpJebDK9Ehpl51ZGhSB7+fJFUP/5vxm8='),
			this.addDataEntry(dt + 'error message', 340, 150, 'Error message',
				'rZZtj6MgEMc/jS/bIGhbX/bJzSV3yWV3k3tNFJUcFQPstr1Pf6NSq8Xumu2amDDDDMLvz4Ae2R5OT4pWxS+ZMuGRvUe2SkrTtg6nLRPCw4inHtl5GCN4PRzf6fWbXlRRxUozJQG3Ce9UvLHW80NraDZebc7CegtzgLntfI9sMi7EVgqpwC5lCQEbbZT8y26cmSzNC/9XD+DXeVTwvARDsMzY7kuGh0kYLZYrBP5jwQ17qWhSJx4BDPjsJJky7HR3oY3LrvKJyQMz6gwhR56awkaELQxUMJ4XNs0CQlS3dt6lXrFBw5Ibp0hcis+zFXEoKvlWpiy1IKlKLJ/oBivwyJrHYQs9wTZaxzCxTU+TNuiPXSquPUCQl/nPBvYudIGj5rnV5QHQZ8szbDN63Ekwwp2Qx7kHDvePNq4uaCqPYNSrTqkuGiVQ21PV8YdTXlfinBpBtea0nCdCauaqEy3XaB2P7/wpCMk4wmGCBYrmLlE/cIFefIoJavg7G4w1Rtl+/7fkMK3u4zO8Gnx+thyOILNMM+Oo1K1iknChI9xrwWrhmAJy0EghEqNSmmZBupJl+kk1Ta6fXbz392F/PwyL0b85u/AHh9WldhJQFuY9qMl6C/CEirWNMbK61uVrbTRl+Q0lt0DTSi76hqNu4Sj33A3RF8chM35HDEWL/RjHAfjvH5RTaIWf3gRjF8HlQHqwfrpLxooT3ED/Sv2Aef0laMP7fwz/AQ=='),
			this.addDataEntry(dt + 'progress tracker', 470, 30, 'Progress tracker',
				'3dZRb4IwEADgX8N7AUF9VJw+7cksyx4bOW2zwpFSh+7X7wpl6tBoMpnJTEh6V+9ovyjFC5Nst9C8EM+YgvLCJy9MNKJpRtkuAaW8gMnUC2deEDC6vGB+YdavZ1nBNeTmloKgKfjgagtNpkmUZq9cYi2VSlChrsOQsTiaU7tpaTS+QzuTYw42KXiKFcWMAo3bPAV7J58irldL+WmbRszdFbSB3cWV1ym37AVgBkbv6SuuwG2MVTI1oknR2pqcALkRbReX42UTb747HVho4GTOK4UdpVdQK+rTwRImU26/x26tzjmyNebGwfi1k5KbnAIFa+Omj/ijcTwcWdxKSAPLgq9sYUU/IMr9hnV/ynXEGp9RDe6gOuioJhq4AdvWqtZ7+3NgVn96AG4LWrrL4OOewKMO+EuhkKd2/QINPgLbPUx6wg5GV7GHPWHHHew33GrKpGC4VOU/enS4ggF7GPbw+jFGJ1Nhh1QoixJ+KBPPJJrMppMbDrY7SLV/xSMa/z5nF4WHt4d67uTl4gs='),
			this.addDataEntry(dt + 'radio button group', 150, 173, 'Radio button group',
				'7VbNbqMwEH4a7gZCkh5baHrpSlV76NmLJ8FaYyPb3YY+/Q4wpA2mq2rTblWpSEieGWbA30/iKM3r/ZXlTfXDCFBRehmluTXGD6t6n4NSUcKkiNIiShKGd5RsXqnGfZU13IL2b2lIhobfXD3AkLkBW0vnpNFuqDnfKqptpVK5UcZiqI3G7IXz1vyCSXJrtL+TT11XHI8xjeliruRO41rB1lN5nBAlaXa2XK0ZfRhYD/tXN9enaGdXYGrwtsVHHqXwFT2R0aQK5K6iNgKFcTfEu0PrM1S4ILTmkUsD5G6BC8wYrdoAOVfxplviDNm4DiNrHrQAQYi8RBYh2LBNsskCeLFSrIv8Mg1BY/0VYtsBKEuuzildSyEUTDhhE84Q0wvFf4K6MU56lAIm7QDfYeD1pH4Y7BpeSr277t9fxN3syteKNopACPNI7xTcVT0EJ7E9NtCQlvih8KUWklAKY+4UKSwCKdxb6eENIpjQvu2vOdoZy1bF+lC5p00tvpQQ3oHj+IjjbBlyPGP3+B3sns3YHbmQpUcBf7v9s92+/n9uXwZKOBehBP5K+MTNM/+ecz8KI9clQgT2X9lefDhD7ejVLOBkOePOND2dk1XASc51icepU04w4ZHk63BADatjl3wgJRg+n1r72tGh9g8='),
			this.addDataEntry(dt + 'single select', 340, 320, 'Single select',
				'1Zdtb9owEIB/TaTtQ5GTEFo+pryJinbVwrbPHjGJVxOzxBS6X7/zS0JCAs2glVakqvh8Z989dzZnyx2sdpMUr+N7HhJmuSPLHaScC/1ttRsQxiwH0dByh5bjIPiznPGRWVvNojVOSSLaGDja4BmzDdGSYJ1SsFXiTLwwI47FCpwb2pZ7u6SMDTjjKYwTnoDCbSZS/kQOhEueiID+kQvY0g4zGiUwYGQpzHRuYTmu1+9d3yCQb2MqSLDGC2m4BTIgM16SVJDd0UiVyIQ5IXxFRPoCKlsaithoeJoGigmNYmNmCCGc6XFUmO65wReDrhmjW8MIvtYYpnyThCQ0GHG6MHT6B1CBxlJ9amRhpjvo+2Nw67aUEa30wwTqSAnwo0k0U6iHXh03Up/DrFyA+cXQ9LRFibrbbaDuupdT79aonyrbLMYh38JARh3iLFaZQHpmLfVXu0gexA4WDGcZxUlnwXhG6tnpX/vIHzfXfRuEbjPCqoEBijp1ona3DjSXpYRhQZ9JZa0mymb/R66Oe775lXNT2f7quroCXy4zImpZKqJolTivIXE9Ji+Fn/AlEurEa4EsW1BdFPB7vzdcK+RXRkmkbYNvk8komE+/PAT5MuCRXqm6OohrO4b0uSSCbWx0dLbq83d55usLCxpxCOGOrix515wf16fxRmxSIitcXdKfX4/uvYKZ8Yhn8N++NCR/oYr17JBOp+ww4Dbmb1eH/mwGJsHj1+nD/JxK/Mdg29mMNxnlSSltLTMeSIs3zbW8EKQj2qM3zvyZ6T7NYDCVIHLnu+/E44Emv7D5EaGdTucDgLmb3ksy/jsRGWJGnj5CgeTXovO/gziheCg93lFV+9nWHexwPLJHeUuaPxBk03r6gVB0rEUjV+2i5ajp7WBaYdMYq0O1wMw3ewm+zj0xMSLrsH12SqK51B/aXoHmom65h9p1y4XiJe1y7/V2eZ9RVM/oPgFNr71SXXCJSsgQ1WFLSQYZyl8ndits3qtvuZOvinOb4Dwt/cubXhjun/FavfzK/ws='),
			this.addDataEntry(dt + 'avatar single select', 340, 470, 'Avatar single select',
				'7Zpdc6IwFIZ/DZd1AgHFS7/q7I7tOmt39nInhQjZBuKS0Nb99ZtIsGqopYvcODjTlnydJO95chJSLThJXucZ2sR3LMTUgjMLTjLGRPGUvE4wpZYDSGjBqeU4QP5Yzu07pfauFGxQhlNRp4FTNHhGNMdFzohzEqUYFwVcbKkuiEUihze1LTheE0onjLJMplOWygpjLjL2hE8y1ywVK/JXGbBVO0SlaZmgeC10cdnCcqA37A98IPNfYiLwaoMC1fBFaiPz9DhxJvDru3PdZemJzjFLsMi2ssoLCUWsa3iFHiDGJIp1M60RQLxIR/umb8rJBy1etZDQENIQMGN5GuJQa4iyQEszPFFUSrHefQxZZYk7GY5u5ZjGB+4oKv3Us3RUjhSPpNFip/MUAlNssPuc+qSByFutpVe0ONAcuhWaQ9hcc/djzXmMNuoxeY3UGusRxgc9ErCU9yhjT1KjXxFFnNeBWqrmuHDgDc+rX0dDWK3hcQOtKOiZktqeqWiZl2GKBHnGR7aqZNb9LxmRw9p3fgPBUfc3g7L/0gZbrzkWhqP286jlO++z66X2CpnezuyZp0piFLIXY7nZF6C8D+pR7toXCC19Q6rVj/l8tnr48u1+ZahWNzYfEJxhLqUpCa4I1MfhxAEVoX2X1qOw343tdZT3PgzizuBMQPlf/LVnTx12EdgHn4EdmLDvg/VHnmTKUUJNxQYVjr2M/GfjeUP5XbsF+X1D/juUEZRK9RxwH+VbnFrqDNCn5alEJoO9/P0/uTqOjQ8wfsvqR+pvkhZWXICE2k6k8V7AktKkHGBhtaj9mV0q5ziruzl50Pf8YyCqD13lwjWPCipuUvSI6ZJxIghTDbPCy2MFDgkQXZyUJyQM1Uz2FUa6x33Bpda9W3F2cy+y6znHm57bxpY3NDAcLRYy48dq9r2L4xcOJH4bHiw3h8OtGMlVDuTvHFPeMIpwrs10YeQ6woht+21QaBsULjBKkeJQ4GecNuWQcm2m4/BKOPTaOFbZ5uXRBHGsZjmJUfKIs6YgBkFppyPxSkj03TZING/flohE6nj/kGepdHQzDjeisNJReB0UOvagDQrN+8juPbMD8SyIXhvXTbZ5udptzB2J50n0YRskVtxd40fEhcRFZi9jQslGYUlZHjZ9e94EOysdkddBJCzhuSyR5l189/LccXiOQ3fYBofmPyW+5jIuqrCoNuuGFP4OlI0OwStB0HeaIyiTb98rKqoffu3oHw=='),
			this.addDataEntry(dt + 'grouped single select', 360, 260, 'Single select (grouped)',
				'7Vltb5swEP41SN2HRAby+jGvbaXuRUm3aR9dMMGrwRm4TbJfPxsbApimSIFuWhMpin32Gft57s7HxbBnwf46glv/I3URMeyFYc8iSplsBfsZIsSwAHYNe25YFuBfw1q+MGomo2ALIxSyOgqWVHiG5AlJyW0c82YijdmBKKnPAr63uWnYUw8TMqOERrwf0pBPmMYsoo+oJPRoyNb4t1jAFHqQ4E3IOwR5TA2nGoZl98eD4Qhw+c7HDK230BGKOw6M2iGKGNq/eMpEpI54jWiAWHTgU3bYZb6a0ZdIAB/hja/UFDoAxrK/yVSPmPGGgq0aQluHcNUZ2RqEEX0KXeQqFGHkKHDGJUw5GF7y0YDlI73ZeLLkG5vmCJGTvqujWkLC4cPh5i5Bet7X0QbJp0zKGUAfFJ59qZHD3R5U4G7b5+Pe03A/ZbWxD1264x1xahfGfsIEkCNbMT/Yb4QbdiEjMI4xDLsOoTHS2RkPJ2CyrDb7OhDa1RAWFRSgoKsjavZ0QFNZhAhk+BkV1qpCWT3/C8V8W9nDO9ao8PjOsLgC9bwYMY2l7BS1iOu/TlzRV2p7x3y5MBf9PNtFVzNLYck6EYdSz3A4bygqepwgGDuQTNQcRrdHr7sXncTpGnCo1HlecygLNBDJBhoxN7fr+8+rH1y4XkxWs5t/6l5QS6nNmLXQ7r9+T/RO3BNnule6zCG9klrwrqFG4tXapztumFzKdwyopxoBZI4v5Vhc+vGHpum1mqMXNERv5igt0GsO3oDfUUX0HBAB7QNvbERD5R9SytfLBrjeLY9m/J5jmIZi0fAncsQJYkRkA8v0D3gRDfiPQyPRe6AwcrvdrmYg6eXJ94i3VZclAJORDMkNGkvRMOwpgQ+IfKExTo5lzyNJbRan70rjAXZdoawF8mwgnzmUkqmm7PCtokyvDSsct558EepIK617/6cmxQ3xm3pubgu1aBudzMyyXOxEbjaqSM2aYbXTK2ZmbbCabjVH6+zrarX4dH/JAFrxzTFog0VTY/GSAvylFKAdgvWqzSUHuOQAp940yoWuZuxQL339D1mAdK/3nAbUKK2llBGcuwfyNUitQKnXaZrxosp6yLloZ29wrfhNVQWsFL9TgQhzSQxOwRv8eqJyQlrFzYmqY79co7hu6Uq4WiRVrmPsf0SH95ALvGW1Z9iALfHu8c8hOT3/39Ef'),
			this.addDataEntry(dt + 'single select', 360, 380, 'Single select',
				'7Zlbb9owFMc/TaTtgcqOCZRH7qrUbpXY2mc3cYiFiZFjbv30sxOHEhwuEniaJpAQ8eU48f/n40OOPdSfb8YCL5IXHhHmoaGH+oJzWVzNN33CmOcDGnlo4Pk+UF/PHx1phXkrWGBBUnmJgV8YrDBbkqJmuKChqmE0nRVtmdwy05bIuXrCAfRQL6aM9TnjQpVTnqoOvUwKPiMHlTFP5YR+6gGgtsOMTlNVYCSWprm08HwUdFrtR6Dq1wmVZLLAoTZcK3nMcxIhyeboXPMqM9Ex4XMixVZ1WdNIJqZHUOgBEkKniTEzGgGcFeXpzvRLOXVhxKsXEllCvqlnpVPsoa6qf6FZaMkp+DKNSGQUxSI0QnUO9FXCxPnHElm1NPud7kg9ZG8PTtHp3Uzb1zVKSppOn3PVB4GtPMg/h4CuEH1rtA0Kiz0GqFXDAKHrGTQtBqdWcJbgiK9VQc86wlmSkwBFy0L3n2+m2jEfsGQ4yyhOH0LGM2LT6bS7oDuqd4FLJET1ElYNjKDgwVYUNm1ByzpBGJZ0RSpj1als7v/KqXqs3c0b/mPl9o12dQQexxmRFqXdLC4CF5wHV/WVi71jMBrCYbBPu+pq8GCL8k/sSaVnhIobEVWP04BpiFnX9JF88eV1v3Qhd7obOFTpPGcd6ha7WssCM/k9Hg8nv55+/pj8U+HBDGUeBl4kdHA+XDRPhIsrPascZltGJgeO1bb4wUbIaDjTfdKVElFLkuBM/6oZgG+T9wYCCH2/NVz/dnDBjeAi9NfgNoEDuI8W3O7gTVU01HcYUYk/mMYaEYkpy6e0omR9h+wKcsuFB3csyL3lNKYbfZ800nPFQuBUbu9cXXHtuHBeCGrAUqaJSpLJYhKk2JjvXN1EXCchF8IasCJdqjdYECZYyDtQZ0CdhFlo50gGJNMa69j6cefpjqeTiArtVM0wndKUEKHe1fKJYaZme8fqCqubgGpnf0YEy6XQETRmWJPNiFjR8B5SnaF18xYL7fzQUxrpWap/vrPCae9A3QB1E1LtvJKFrUzCMrrHaT+lbeW769J+QkXqz53ZVWmhbcXgXPoNXomjTLcGTvS380KThK8LT9KLC/A4v2qq108wxzJMijayoGH2v3rYUcA7mO79rYGaLnjbqSLNW/+BzY8ojnA9mXMfgZE/Cmqd73HQH6JLj5js3PmcRhEjFll70TD8Qdgrz6ikXBuKgs5uwOeD9t3A1dMwCA52kyMHQ1csrdqTHHuhla8alY3Ev8k6a0B0uNJusLOo4tdZddF9/yj7Dw=='),
			this.addDataEntry(dt + 'table', 400, 230, 'Table',
				'7Zpbj+IgFMc/TR810IvWx/E2ySabbHYe9nHCtGjJYDGAM7qffqmlHS043mrV2TExESgVfuf0zzlQxxvMlo8czZOfLMbU8UaON+CMyfzXbDnAlDouILHjDR3XBerruOMdrXDdCuaI41Qe0sHNO7whusB5zW88Z4JIxld5k5ArqpsSOVMDHELH608IpQNGGVfllKXqgr6QnL3iSuWEpfKJ/M1uALN+iJJpqgoUT6RuLno4rhf0Ot0QqPr3hEj8NEdR1vFd0dHDxFzi5c6prqv0PB8xm2GZTQK8k1gm+oogxwESTKaJ7qYRASTy8rTs+gFO/dDs7Bw9g6OaFkUvjCOFUnwVlLqDBzSyTbTgQmh9A61BUyRonv2kZAPfHz02NY/+Bu5ttorUcDyCo0C1cCwU3qIbPIfTanv6G5h8z4IJ1oApsGDqoNlcTYxm/pHdqKiY5hUVipwt0hjHmhPikfa2oOKka+96GA7Hn3nqxsWT9WfDYyOFD6vGfgaXRIg+6IYZieNsNBan3fZ/tyjr0cNNG59vN9+0m+eaZivqzjFbxzCbx+NnSl44ql+B3b2yAdafzyxQEq9BRrp5j4J6x6BeWqJuUekeLiqz5TRbntuEiW6bRCwV7YVYu2/loSj93JAYN/DCIKyDWDH3AplvQWYh5p9PLLxTYuBqxHoWYv3OObI7BmN3HBwou2UEUJ/sgooIgJpkt7BVULGVRRAupAfFCnyMe7PJhES4LXC04ESu2pRFr89zziSOZGZPY9EcdQahb7fe+fD8qqP3DHjQFnrU4OgQ7od3hJePHvxsaf2qwUUYNBZcQDO92+vVQtESbRERnCrnThcRxYg/VyOO3eJ9uDt/7s+gHWz5c1neowZQrxocUyTJG976fxtMPYJfjKiRlX/fgtuPU6u3fQf18AssDWOU8zjMPmbaiCBctWIkkheGeGxY60sHgD1oWZsvJfhHpJU3Fc/4234ZmjJ/qXgG2lLMe0DmXg+Zmd7dBzJwPWQnpGa3HYn1zJTjYpGYmaX9eDLwHZNxwOHQO3Sjp1w77iYWg15zOz3QzAcRiloCRf/XKg+9Bvd53BPyupsQ4MoyD73m9i3cA9K5m2TmXpHZCZnWTTADV2RmZj/fRxYnr2Td5rYVLEdy/+2hBQwbTFqth3z3oDJVZe42l09YTtjug1lVmZtkZsvBvo8ujji6sMrCpVThhKO5286YYdhcymw9pttB7+beL7ngCyaq+PEaWr63vfmW2j8='),
			this.addDataEntry(dt + 'table', 620, 230, 'Table',
				'7Vtbb6M6EP41eWwEOATyGJJmV0e72lV7tOdx5YKTWAXMcmnS/fVnhksaMLRpCjRpUymVr2B/4xnPNzYDMvO2X0IarL8Lh7kDcj0gs1CIOEt52xlz3YGmcGdA5gNNU+A30BYNtWpaqwQ0ZH58SAct6/BA3YRlJT+TtEHI/iQsiqOsPoof3bx+HXswyrk6INaSu+5MuCKEvC98aGBFcSjuWaVwKfz4lv/FB6jYj7p85UPGZcs4ry56DDSiT8aGqUD5Zs1jdhtQGztuAKJ8rCyM2bZxvmlRPtkvTHgsDh+hyYY78TpvoWeYKGvGV+u8W46TQqMsv9p1fUIPEjmA9WASCcwb9sDZhoUfBsa8w2iSw7UPq9IRrCMJVivhrvPRMNVrMCUdQapLkEpgRmsaYNLle+j9lw8NpmHtoV2GFoCaL67Vax1qQhYBukU39S0wPZanv4fSWKuBSW0BpvHhMHnbFRrxIReRMeS28KNhErGwshQBmmX6VweaphNTN1uAaDSSICqUqLSQRm9HyJB18/b65teVMQb8yRSqfvguDm3JQ5ZuK7geQHUV9gCzwQRfYs5lHuSHw+EAUSfY24Kki1oYBdQvoT7+k4hCPa82+ZTwZb4IPeo+NYDUKt57EnaAZvYO9KeGhXLvFTW9MUoNBr5PVYOt/LbvNLQ5jvj2r/2XweCjew65qwGuU2IqE1A/QFZxaYSjSQKHxszBx8HP434SpwjRlUB48EE3LMD01JoVMwHBZJMpTxCKM7SK4nZNpPaiiVTSv1oTmT8qH8ybbEHegeTLr1j3qmxAxzWmgbRgGkxp4b9oGmgYik2kDaE8DKaYQTidRxDGXBmaaWaLmdFQyTLwf64PJ1kzkjYD7cAazBhDmD+xfBHbOFulUYBlAzRTZ0ba2AGVtGMuUJgMl2KxXt4mkwLdZmOkjrsx1xNJJlFMV9xfSaIJReI7zMk1AdQ1X+C6DNdCW5CF/pxy1DkIhZLYgFq6CyCm3KbuNK/wuOPgaJr1ZE/lynqzt/W2IC5dL4mLTCRxdeUuFyIv6ZA1btQj6M2DqGZFLxQQ0juKSKmISGlXRDopi6jH7V1Va0R0yh5QAZn6fpDJlPosIBtN3g8ymTiDA0O9IHPMTC3d9A4teq31UBTdmJsHWo+dIM7GeoyVyn5sHrYfj1uQq8zcT1sVcohMeQ/sbOnLTHzBaJwgWVqkVGp+/etKBT5kYi8vEOEHIUnfEhsht2hKcJ64kdbEjfQmcmTx+C6x71mc8stARDwWKIULUWoiSuZYWuCdESX1iCDK52BK2qi849aYna6YkirHbZY1ZkdLTU2DsBASjPBdqFQhT6O805o1zLcQeetcSo5HTF5UszsacXsooM9vgNMVSSzLbCeGo2SWm75ufCNiufSOuT/R4Ge6GWag7t73rVKfv7cFZ3lUFvWEHKa6eguSlqMcp+1UNbDYHp0srS7QcA6Qqe8H2ZkS/yqL7ROyOuL/YVjsEt77NTe7J8ZoDzW+LTDamiP+01aLHCKV9BfNqTuv3yOyupqxwjmP6B1uxkq8Zin7y7WAAoNL93YgenG1FBqmB4cDPFF0Yc2m0f2zJ8ML5nIoVr5S5jN3nw+PzQY+jBJtPiy8cOCXODAsRUklOiPBr7lw8blIMBlpFbH0d15Yc7/jcmD4osDGZQ9L1WQXq6sTw5rrJhcXqw8XSyX9nRocc7XiJHwso0euIQcB6o8NwDdO3Q5beB5HB8J9yG734r3Ung4SjvSJ/hFrHMevdDRzEKqmfBNi3zfCyVl1vhHCo/ywsRCePnrWMXpfD+iZG6Xde0BGj8cA5IgYzCfxgCoXpursSFceEJHDPH17QFN9OremZ+UBVa5MqYbssnb2iYEcZHpZjw6J8+/EcInzPxPnV83+Av2kLtZkNUv7cj2ufz+MyLGu0/ZVG04WesXsiFjIKWBWPVroFbNXXKJotAMNJv4JvTbWVSWaYxgSRhMZokkLCNWFBpq9eQDLEZvcGDk0WqeejZLVlJ3QGOhFxKk/tNfMvr8T2zdunud/hfDgXbCFaACRowH/rjlGvH/e4OsoJu8YQ37nsXCF/O94z1U1NGs0fz9BVj3XtrfKshx3FKIkx64811fcWzi5bw41OfzV1keHkH363DutK30N/j8='),
			this.addDataEntry(dt + 'table', 630, 230, 'Table',
				'7Zprj5s4FIZ/DdpPi3wJBD42yUylbltVrbT7mQkmeGswNZ4m6a/fw62TxE6namK6IhNpJvENwfPar88R9uiy2L1WSZW/kykTHr3z6FJJqbtfxW7JhPAI4qlHVx4hCP48cn+mFbetqEoUK/XPDCDdgK+JeGRdzfukYF1lrfeir8x1Abe2wh5dZFyIpRRSQbmUJXRY1FrJz+ykMpOl/sS/NRfAzbhE8E0JBcEy3TcPIzxCgzicRwjqtznX7FOVrJuBW+DS3yBTmu3OPmRb1T/hayYLptUeumx5qvO+R9CBQDnjm7wf1sNBSd2VN9+HPiGDHz01O0FqEGyfeiIE+wEU9aQOiMaOgM4MoG+TWkPNWhYF1y7JrgEHU2OzDU22c0dsA4PtsoeKUlavFa80l+XEJu/MAhi7IhwahA2adZ5UzU/BD/D9098bPMfiAPcxWyC1ur/DdwG0KFYD3mEYvoTT/vjxDzCF1IIJXwHT3MCURwUqQ5KdxVXsNs026css42vmr2W5ZpWu/UyKlKn6ZG4CKjqbBSH90QS1dT6duG25v5tmhorkgYkPsubtSqEr1YE5neCHGsJ05uXmbduwCq6gFI3NCR1ZhAovFyr6+fk8CJQoJbc18aFeVa+aQjOp0z1uCPpRW9g1hZmPugJpuPhx14223WAhNS1NYe7TORRKqdd5L4Jd0WP5l3g5bzunXLF1rxZrthK6uIKrRP0q6CWZEVOS0M3aiQ1JfBjytH6QFywweiBZQmYpiWMvWF3b0cmzjo7aj9XRT9fU5VpgdCwGnVvEcGT4g6IHchAEEqGFuVCem7Vn9s5zm+WgwGBB30W9nOjp9LYQdRVQY2wBCuU3CQQmiKBhWU0xBDxP21W8gs0MkJewtyVilIj7d4aDPzALZ7TNbLFmWkN0UP9i3HNLYU84XtiDzSwUx/OpuXo4oqubqScC7dA9e+hcHU/e1S20nfmMmYbemKtbYLtzdTOb1ayoRKLZi60/b+vxiLZuprMTDNbjEW3dTEZvLVi30HZlNMTMNW/M1i2wndk6MRNRMHT9YunPWzom43k6MTNYinyI39Ffk3J1TMazdctbzUYq9ObxZmzdhtuZ05jZ5o35uo22O2M3c9GUPTxu/Gp/1ttLqU+tAhhl7cf2nu7Irn+PjUNNd/2LHH1YHsdyBRZ/J4783cxliY+mZ+/BiPZuJqyItvYu9jfj7xbezgzHTDs/skJ+ZVD3SoukrnlS/gGBJSqrAv4XXCmpfN+fuutbNHDn+maqCk/3Odkw/9/acujlxfmtzh+N5/zUTHcn6fzReM5PLS9Xg1tzfgtvV6ZDzeTUI6EYjLcN7wcK4ZdH2R1OoQgF8zQ6rAo3zfdisVzd/f0nQbNguAzcQXelrgdcUVaaF+0ZVJQJuW1YMWWeq5rYVmIR1dlWQs30+Oz28b875YdNUNc65gfFp6PrbdvRyfb/AA=='),
			this.addDataEntry(dt + 'table action', 630, 189, 'Table with action',
				'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'),
			this.addDataEntry(dt + 'table action', 350, 30, 'Table with action',
				'3dbPb4IwFAfwv6b30oo/roJ42snDzs180GYPSko3dX/9iq2Kq0uWbbhkB5P2vX6h/YQghGf1fm1EKx/0FpDwFeGZ0dr6Ub3PAJEwqraE54Qx6n6EFZ90k2OXtsJAY78SYD7wKvAFfCUHKxR2vt7ZA4a6tLXbXZ4QviwVYqZRGzdvdOMWLDtr9DN8KJa6sRv11l8g6XMCVdW4CUJpQ/uUIIxzPp8UxSkWbtzHdlJZ2LTiqS/sHFXYMxgL+0/PfSyFQ69B12DNwS3Zqa2VfkXqaagEVcmQClxUdH5enZMXRDcIjrdNeWyqyvL+oOliOpvTsUFDYBbgBr6TkXwnkW+m61rZP3hm70qc8Nh4OpJxGhtLgQhNBf+dmdGYeTES8zRijnA7Kdp+iGqg+Ri25o6xHOhfUzu4vFglq9R1DHRO+xRLfsJ0uD7+QInfeqMmv8A0G5np/NdzF6Zb78VvKLnp5Tvh2Lv6jHgH'),

			this.createVertexTemplateEntry('dashed=0;html=1;fillColor=#F0F2F5;strokeColor=none;align=center;rounded=1;arcSize=10;fontColor=#596780;fontStyle=1;fontSize=11;shadow=0',
				 60, 20, 'Tag text', 'Tag', null, null, this.getTagsForStencil(gn, 'tag', dt).join(' ')),
			this.createVertexTemplateEntry('dashed=0;html=1;fillColor=#F0F2F5;strokeColor=none;align=center;rounded=1;arcSize=10;fontColor=#3384FF;fontStyle=1;fontSize=11;shadow=0',
				 60, 20, 'Tag link', 'Tag link', null, null, this.getTagsForStencil(gn, 'tag', dt).join(' ')),
			this.addEntry(dt + 'tag removable', function()
	   		{
			   	var item1 = new mxCell('Removable tag', new mxGeometry(0, 0, 100, 20), 'dashed=0;html=1;fillColor=#F0F2F5;strokeColor=none;align=left;rounded=1;arcSize=10;fontColor=#596780;fontStyle=1;fontSize=11;shadow=0;spacingLeft=3');
			   	item1.vertex = true;
			   	var item2 = new mxCell('', new mxGeometry(1, 0.5, 6, 6), s + 'x;strokeColor=#596780;strokeWidth=2');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-11, -3);
			   	item2.vertex = true;
			   	item1.insert(item2);
			   	return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Removable tag');
			}),
			this.addEntry(dt + 'tag removable link', function()
	   		{
			   	var item1 = new mxCell('Removable tag link', new mxGeometry(0, 0, 130, 20), 'dashed=0;html=1;fillColor=#F0F2F5;strokeColor=none;align=left;rounded=1;arcSize=10;fontColor=#3384FF;fontStyle=1;fontSize=11;shadow=0;spacingLeft=3');
			   	item1.vertex = true;
			   	var item2 = new mxCell('', new mxGeometry(1, 0.5, 6, 6), s + 'x;strokeColor=#596780;strokeWidth=2');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-11, -3);
			   	item2.vertex = true;
			   	item1.insert(item2);
			   	return sb.createVertexTemplateFromCells([item1], item1.geometry.width, item1.geometry.height, 'Removable tag link');
			}),
			this.addEntry(dt + 'text field', function()
	   		{
			   	var item1 = new mxCell('Name<sup><font color="#ff0000">*</font></sup>', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Messina Cake', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;align=left;spacingLeft=5;strokeColor=#4C9AFF;html=1;strokeWidth=2;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Text field');
			}),
			this.addEntry(dt + 'password field', function()
	   		{
			   	var item1 = new mxCell('Password<sup><font color="#ff0000">*</font></sup>', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;align=left;spacingLeft=5;strokeColor=#4C9AFF;html=1;strokeWidth=2;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Password field');
			}),
			this.addEntry(dt + 'text field', function()
	   		{
			   	var item1 = new mxCell('Project name', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Watermelon Squad', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;fillColor=#F7F8F9;align=left;spacingLeft=5;strokeColor=#DEE1E6;html=1;strokeWidth=2;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Compact text field');
			}),
			this.addEntry(dt + 'text field', function()
	   		{
			   	var item1 = new mxCell('Project name', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Watermelon Squad', new mxGeometry(0, 25, 290, 40), 'rounded=1;arcSize=9;fillColor=#F7F8F9;align=left;spacingLeft=5;strokeColor=#DEE1E6;html=1;strokeWidth=2;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 65, 'Text field');
			}),
			this.addEntry(dt + 'text field', function()
	   		{
			   	var item1 = new mxCell('Location', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;align=left;spacingLeft=5;strokeColor=#4C9AFF;html=1;strokeWidth=2;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Compact text field');
			}),
			this.addEntry(dt + 'text field', function()
	   		{
			   	var item1 = new mxCell('Location', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('', new mxGeometry(0, 25, 290, 40), 'rounded=1;arcSize=9;align=left;spacingLeft=5;strokeColor=#4C9AFF;html=1;strokeWidth=2;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 65, 'Text field');
			}),
			this.addEntry(dt + 'text field', function()
	   		{
			   	var item1 = new mxCell('Details', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('eg. ATP, VOSS etc', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;fillColor=#F7F8F9;align=left;spacingLeft=5;strokeColor=#DEE1E6;html=1;strokeWidth=2;fontColor=#596780;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Compact text field');
			}),
			this.addEntry(dt + 'text field', function()
	   		{
			   	var item1 = new mxCell('Details', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('eg. ATP, VOSS etc', new mxGeometry(0, 25, 290, 40), 'rounded=1;arcSize=9;fillColor=#F7F8F9;align=left;spacingLeft=5;strokeColor=#DEE1E6;html=1;strokeWidth=2;fontColor=#596780;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 65, 'Text field');
			}),
			this.addEntry(dt + 'text field help', function()
	   		{
			   	var item1 = new mxCell('Form label', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Banana bread', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;fillColor=#F7F8F9;align=left;spacingLeft=5;strokeColor=#DEE1E6;html=1;strokeWidth=2;fontColor=#596780;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Text field with placeholder text');
			}),
			this.addEntry(dt + 'text field tooltip', function()
	   		{
			   	var item1 = new mxCell('Selected help', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;fillColor=#ffffff;align=left;spacingLeft=5;strokeColor=#4C9AFF;html=1;strokeWidth=2;fontSize=12');
			   	item2.vertex = true;
			   	var item3 = new mxCell('<b>Not great</b><div>The best password is hard to guess. Try again.</div>', new mxGeometry(300, 0, 180, 80), 
			   			'html=1;rounded=1;strokeColor=#DFE1E5;fontSize=12;align=left;shadow=1;arcSize=1;whiteSpace=wrap;verticalAlign=top;spacingLeft=15;spacingRight=15;spacingTop=10');
			   	item3.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2, item3], 480, 80, 'Text field with tooltip');
			}),
			this.addDataEntry(dt + 'text field tooltip', 480, 80, 'Text field with tooltip',
				'pVXbjpswEP0aHndlINDlcZckm0qtVDWV+uyCAauOTW2TS7++Y+wQiEmbKkghnsFnzJwzMwRxvju+S9w2n0VJWBCvgjiXQmi72h1zwlgQIVoG8TKIIgS/IFrfeBr2T1GLJeH6HkBkAXvMOmI9G7EnElwfC8Hhb0NYa/cofWJuT0UZywUTEkwuOHjflJbiJ7lyNnoHGS1DWFaC6y39bQKExsaM1hwMRirtHp/BQRQnWfrhBZ1h7mA/jH13IjU53sy/d7nk34nYES1PsOVAS904DhaWI9QQWjcO5nhDWFm7HqAXNmHhCJ0nN/bI3WLGzOkbzJWh94pXKTpektLlimXhUs1M5iPOgaGqv3wiVYsLyutPvbVMPGUAusiz1/V6Ko/d9N2REvmKoP66UiB6RIGTIzqxiLEg2Ywgcfy4IAtPEOppoBrcmiUgaatulvaVHGmSLHLk0zbI9LdCvo/GeJ7GKcCRip59VsMXn9SzTxKGNd2TSaw5pt35XwSF1xoOf4oXk+OfsmkEUVWKaE+pIYu7xEv8bgK42aBUR5Q5ThqTC/NmeI8pwz+Y8ZSduWthbo1ZBlHKzlMHzGLQK/3Vmcn7ZrqkyDAoN3KldY+hhJU9iFe07iTwJvjzOSIkYYPazV51jVpu2uy32tvr3uV6Fa4Sr4L+NVGH/oX6LsXBGzHGOjRUky0MEOM4wDcJfKYoaYHZq4uuRetNmTC5uL664hr7vhnMMkSPTAsHgDz8cYFmxkX6//MbzMuH1xbo+Lv8Bw=='),
			this.addDataEntry(dt + 'toggle subtle', 30, 16, 'Subtle toggle',
				'rVRrb8IgFP01fNRQsO673fTTkiX7BcTeCpGWBlDrfv0o4KOvaTKbNOHcJ/ccANGsbDaa1fxT5SAR/UA000rZsCqbDKREBIsc0XdECHY/IusJb+K9uGYaKvtMAgkJRyYPECzBYOxZRkMhpMyUVNpDSpcr+uZqrYzVag8XT6UqF7/S6lDl0BZPHGJ6+y1+2jopjo1AW2gmN+tNcacbUCVYfXYhJ5FbHiJoLMRB7PglaxlszAS8u2beJneLOPw4EfQxEYazul26RFEbmKKgx1fhv6emJ+PTdxPOUdZ5GvAdNwkZ4SbaNEhmxRE6tcYIi/2/lHDbujafJYtO+1mPclUUBuyA8OsUT2mweKwBt6WMh8vJkauTA9iBnBnujx0OHi9U2ezaizVnVjJjBKvmWw7b/UC4l6j0hy7LoSzpS1TpaUL/r4mDt8cnhN+/Tb8='),
			this.addDataEntry(dt + 'toggle bold', 40, 20, 'Bold toggle',
				'rVRdb8IgFP01PGooWOez3ebTkiV72DOxt0KkpQHUul8/WrC1aztNtEkTzv3kngMgmuTVRrOSf6gUJKJviCZaKetXeZWAlIhgkSL6igjB7kfkfcIbNV5cMg2FvSeB+IQjkwfwFm8w9iyDIRNSJkoq3UBKl2v64mqtjdVqDxdPoQoXv9bqUKRQF48cYnr7JX7qOjEOjUBbqCY325jCTjegcrD67EJOIrXcRyxCIQ5ix0NWmBEz4/Guzewmd4sw/DgR9DYRhrOyXrpEURqYouAPX1nz3TU9GZ++n3AOss5jj6+4iZZDbi42DZJZcYRerTHCQv9PJdy22uazaNVrP1v1K6gsM2AHhLdT3KXB4rYG3OYyHC4nR6pODmAHUmZ4c+yw9zRC5dWuvlhzZiUzRrBivuWw3Q+E61S6eL4DqeQR3f5TauQUr54i1LIvU/y4TA5275EPv36ufgE='),
			this.addDataEntry(dt + 'toggle bold tooltip', 280, 112, 'Bold toggle with tooltip',
				'7ZdNk6IwEIZ/DcexQhBljqPoXGarpnYPe47QQGoCcZM46v76DSSoGBitUrf2sFRp5as75HnpbvCCebl7FWRdfOMpMC9YeMFccK5Mq9zNgTEPI5p6QexhjPTPw8uBWb+ZRWsioFLXGGBj8EnYBszIC2N8W/vYNAsF/NqAVNKsk2rP7LqMMjbnjAvdrXilR2dSCf4BZ4OFKvWpYl83M16pH/R37cCv+4TRvNIdBpmy062xh4PweTKNUGtmN3bdmPsHoWA3yKAZsgBegZegxF4v2dJUFZbD2HBCBdC8sGaWHSLS9POD6ZGoblio/YADB/CXJPW5g8ksmC6GcAq+qVJILQoiEksiRLeQ2NsDh8biBMyjuIwvc5EFWddNbUjXcvABO8OXNddVMIJ+GF0DiwaNXDb+xGXTjglgRNFP6PjqA2b3f+dU39Zh8yc/6mz/FHU98CyToBzgh1NcpUF4WYOT6NVypDozBHEdkymRRfMUIjPTCFXu8jqRjYhiREpKqlFSQPLhCHdUqZ35aaHiW3T7Sqmepzi6i1CTrkzhA2SaODLFVJKVluhylh5KFz5yI8ef4tk4viGPJ1ohEG4mP4h9msnRPTO5NRiHHTV60pnvh4/JZ9PBQspVoaFgtJEgtEBIcf1Xgshr/VRB67GVIFVS1PaUOKr+I6X3roJZhdqqdVqJowdVnMhR6DtsBVW0yuvdqFTcOhwOoLOIWaIlXoZ9+S2O4vkicMmi5nIFqCnShLAXO1zSNGVwQQENdsbICtg7l/ocvDYUBtrB4dvZ/MGxXJNEH/2t2d/kgyuS/e0x2g3RaU+I4p6qim/X/9nRf9ZGnX7xhobPf/X/qvo+cuP/TvLr7vEryhTd04+sPw=='),
			this.addDataEntry(dt + 'toggle bold disabled', 280, 112, 'Bold toggle disabled',
				'tZVNj4IwEIZ/DUdNAfHjuKDraZNNPOy5wgCNhZK2Ku6v30KLwgKria6JSWem87YzT1ssN8jKLcdF+sEioJa7sdyAMyb1KCsDoNRyEIksd205DlJ/y3kfidp1FBWYQy4fSXB0wgnTI2iPdgh5ocYRE0oDRhmvTded++5CaflCcnaAJpKzXM33OTvmEVTitrIwD3fku9LxkFkIuIRydLO1y+x0CywDyS9qyplEMtUzZkYoBZKkJsvUiLDQdnLNvFWuBqb44Ua49xshUlxUQ5VICgFjLfjVr9XbeuVvHqreGa6+m3AxWKeetlu9sef93jQ+DhRLcoKO1lDDzPqfjKhtXRef2MvO8pNlV4HFsQDZa/i1iocYzO4zSGVGzeFSOCJ2VgZSRoRFWh87pCM1qKxMqos1xZJiIQjOp2EK4aEH7kapiXyZpjrPcPuL1MApXr4E1LyLyfsHTF4P0+64FyEne0XgN7CxB8FG/atiLxx/th67Vy30Mctlo1PLUpLkyggVEuBmQks4rn9Notkc6gk98UKZhFkf9cJ7yYOlzNtXQUNrfzR+AA=='),
			this.addDataEntry(dt + 'toggle bold disabled', 280, 112, 'Bold toggle disabled',
				'tVVdb4MgFP01PLZB0HXPtbNPS5bsYc+kopIhGKCt3a8fCrZadW3SrkkT7se53HsOIMBxWW8VqYp3mVIO8BvAsZLSuFVZx5RzgCBLAd4AhKD9A5TMRIM2CiuiqDD3AJADHAjfU+dxDm1O3DsyxnksuVStiZMgQUkI8FobJb9pFxFS2Py1knuR0qZ4YC2idp/sp6kTQb8RVYbWs822Lt/plsqSGnWyKUeWmsJlhL5QQVleeJSfERLt7PyMvExuF374aSLwbSJ0QapmaYGs0nSOgiu+YhSvNvdNj6anP3khl5GD9NgIXsZsdD5FOTHsQAfbTVHkd/yQzDaCYD04GX7zxesQL7NMUzMi+Nz1XZyHtzkvTMn9YbL0p/JoDWiNlOiiPWbQRVphyjpvLtKSGE60ZkQs65FIF0W6yJenEz2i0RDwh2ITgj1Hr0VwpRj+B8WikWIxETubY7W4lm7uKQjg+JIEK7QON3M3qncIMilMV6cty1kurLGzAlHlE3qFs/bXAX1zcFTogbfJA8IJqaOnPFXWvHwPnGb9z8Uv'),
			this.addDataEntry(dt + 'bold subtle disabled', 280, 112, 'Bold subtle disabled',
				'tZXfboIwFMafhktNoaLxcqjzaskSn6DCARoLJW1V3NOv0PqPwnSZMyHpOe35evx+tHh4UdRrQar8gyfAPLzy8EJwrsyoqBfAmBcgmnh46QUB0o8XvA/M+u0sqoiAUj1TEJiCA2F7MBmTkOrEbCKljC0446INMZ5GeKa1IqkE38F5puSlXh8Jvi8TaMR9HRERb+hXoxMiuxEIBfVgs23KdroGXoASJ73kdNfskSYqNxlsZXOgWX7WmJockSbOLjpXH/TAWtFvC35si8xJ1Qx1Ia0kDBnScW/+tpxHq6e8CPq9uC+wzqBx6HjjBz3e2JwARhQ9wJ1Wn2F2/09OdVuXzUf+5G77UcdynqYSlGP45V88xWDymEGuCmZfNY0j4UcdIB0kRObtS4jMTAuqqLPmmI2JYkRKSspxnEO8c8C9hNIPXKYulvAlVDpM8D8wCR0mm/1WxoJutd1dOkN3gY/cc+HPgmiyHDpEN5xTXqqzTivLaFbqINZEQNgFN8Jp+zsX2uaQI/SHy8kWYJf0LHRR2/v4N7eTDq8fBAPt9nvxDQ=='),
			this.addDataEntry(dt + 'bold subtle disabled', 280, 112, 'Bold subtle disabled',
				'tZXRboMgFIafhss2CNre1669WrJkT0AqKhmCAdraPf1QsK1F2y7rTEw4B87PyfcLApxWzVaRunyXGeUAvwGcKimNG1VNSjkHCLIM4DVACNoXoM3EbNTNwpooKswzBcgVHAjfU5dxCW1O3CdyxnkquVRdiDfRBm1igFfaKPlF+xkhhV2/UnIvMtqKRzYiavfJvludBPqNqDK0mWy2S/lOt1RW1KiTXXIaNHtkmSldBnvZkrKi7DUWLke0i4uzzoWDHXgU41jwYyy6JHU7tIWs1nQKyA29FKXL9XMs0F0WcJ4ENCI0QsPnFOXEsAMdbDeGyO/4IZltBMFmgN5vPrtBLPNcUxMAPnf9FPP4MfPSVNx/WhZ/Jo82gDbIiC67jw66mc6YqinaYzUnhhOtGRHzJjDpJY4MC+74k4T2JC9xZxbBoT/4H/xJAn9SInZ2jSV/a9TUNRDB8EhES7SK11Pn58ryXArT63SynBXCBjtrEFV+wZVw3j19oW8OBkJ/uJd8QRxavRjx2l/Fv7mYbHj5FzjPrn8VPw=='),

			this.createVertexTemplateEntry('rounded=1;arcSize=10;fillColor=#172B4D;strokeColor=none;html=1;fontSize=11;align=center;fontColor=#ffffff;fontStyle=0;fontSize=11',
				 65, 20, 'Tooltip', 'Tooltip', null, null, this.getTagsForStencil(gn, 'tag', dt).join(' ')),
			this.addDataEntry(dt + 'comment', 470, 125, 'Comment',
				'3Vddb9owFP01kbaHonwDj0BLt2pbpX489NFNLomFY2exM2C/fteOSUNdqkkt27RIIfb19fXJOffaxIsW1fayIXX5VeTAvOjCixaNEKprVdsFMOaFPs296NwLQx9vL1weGQ3MqF+TBrj6nQlhN+EHYS10ls4g1Y5ZgyxJrZvVttAwR1TI8YhmgstRK6HxovmKMrYQTDRmQrQyF9qlasQaBiNhEk2SiV0SGgXbo7CNyWK+BFGBanbosqG5KjuPyEItgRalOrQR2fWLfuYTB9iwNLxMSeRQckUrNMxbzikvpENQqSqMdR48Y4ILDg4J1rgSXN3SnzpAgK85J4wWHDsMVsoOD2jzzYX2TUkV3NYk0xM3qMZbqLQT4i5BhsxOfZdZm0dvYjZ2mJ3d3326vnEYbUTLc8gtqaTJLFeJm2zLcBktk9d4Hjgn03Q88Qd8Z0iSSWFNIc0Im9mBiua5RvMC5Yfq+fu+Ra8B9wnxdnWCMHHkSZLTyJM48kQYFaf5s7ZopcJG6Afpn8//XrZT5H8wdQsgCE5UAalD8V1J+Br3FH+Fbxv6qgQNpcH3PGvr0X+61+wOGR0w37u8N/Njh/kH0XphSipd0aQW0uwC6FLhy1CkLu/laIBIPO56kTLUrMCjoHfgpIKROSJ0kWxKYh7QwNEQpWB5FwHpF70bWm04Lbu2M4Fe0RJbn02YCqpH0BEQO9vrpzH1EqbfW/3vYY5ixtmU4Ek8MA1yaW98JNm6MDvumQ0y0ysVjx/CODYL6S0gjJNBe/xxGDQtzDP2r0BKjXyOazR7gKhMh9G6IYa2KECq5wzumdUNDUqrx/HnivCWmDTCrgF3A93zAe97vL9d409rll4IvkKJOabtv1Q77gmjxAkqKnZPizh6oaLSd6ioiVNRN1CzXZeaXVkhJxO96RnVL3Kqjg6eAwMFR4e/0PVf0POk584z5QLfle69NkPsPn1RmLGDD45f'),
			this.addDataEntry(dt + 'linear discussion', 470, 125, 'Linear discussion',
				'7VZtb5swEP41SNuHIseQpP2YkrWb1EqVWmmfDRiwamxmGxL263d+oSFVUrXSqn1ZJOLzHXe+l+exiJKs3d8q0jX3sqQ8Sr5FSaakNF5q9xnlPMKIlVGyjTBG8ET45ox14ayoI4oK8x4H7B0GwnvqNRFecXC9riREwKiQXCpnWf3qbVbXEU6WV6v1JZqrVnVYnW8+Ke6JMkxAmAfSjZMVsskPHgivI5zBuukUs6ktVmAkbQdWketuFhYcfVbHp5VsmKkgvQU6bf3OIPwjaf15P+BpyEBhkaqkipYgjbJXsAi6s5ml8xJRKwUzUsUg/myorYrZDhGl2ED1IeiOuRYLaVg1+phvVHSc/euUiSinCKggwg2ktSl7A0yH08JMqVRKQnHI0Mam8gR/JQUsmBbQEL995mutRYU2Iw+o0A3prNjua4vVmEm9jlkhhY57TZXFC1SdvYAlqdwP9Noo+UxnFrxMLpeXAWGP7LcNu8C2Vs5qARtOqwmAMzfkfqDnJKf8QWpmmLSvK1Y39v3GtNyGAnGgALuC8E2IaKRtuu5IwUT9ZDfbCweSoLpzJ26XgQzgTfdnCeVUgU23FKZh1OimXpomkCr1Xg31qc11RPt9/eJ5YCcIgaCnyZp8LlkdM9Ad2UGtBf3nbN0oi/MddUD0lOqUHFgNAztLTujuTaChaWRv2x9iSMHHKUTpuM5JB8DQjqq7OI4/wkvPxcBLKSqmWnsvvGceaXFFgBnz5A9Em5Q5KZ5rJXtRXoQgG3hP1fkXnKbuoMz1YDmT119PDDlF0x18ZirIdez/1fCJV8PoresQ5O/fFLA9fDI429EXxR8='),
			this.addDataEntry(dt + 'nested discussion', 450, 160, 'Nested discussion',
				'7Vfdb5swEP9rkLaHRMSQpH3MR9M9NOvUdtqzgQt4NZgZk6T763dnk4Z0ZGmkbtKmIRHO98V92L8LXjDLt9eal9lSJSC94MoLZlop46h8OwMpPeaLxAvmHmM+3h5bHJEOrNQvuYbCvMaAOYM1lzU4jsdGEk2nJbIr8yQde/StppCmUhTQy0CkGa4mqBKi/+FejlTaPK2XlcI4mB8rqfSBI48Fw8vR+MI/bhvtGHf8K/q4z3i2E2FC0V7dH2DUM3x+VGvII9BIInPU0nZxHPpHdvmS9zZZJ2J9TiHC+JKvVm1WRwwRjx9Treoi6TVOKBCdRu9YGHrUZqoAC4ctevy+I8bQX3JjMtigypf6aI3IQ8wL/N0AvQh6uqaVyUSFD1XExI41cIPEAhJB+TlZbawiKSSKQl20XtNRnD/aie4QzmzZsb17B6V8og5cMQ/lEzpcV640bdYcJFDZDpg34hFOb9mT5WMHhWNVxksi821KKNMXqhr3RayKql9XeFQwTyHl7DnJYGUv5FdGq0doSdgwuBheNJW5F9/JLR69YMqlSAtcSFjtCtcy8+1FzeMRyE+qEkYoUteujdPM5JJcIbkGbUTM5aTxaFRJkZQ8FkX6QIt5b+DvWTf2jfNhA2NoDdujUGhZDQ5eg8rBaOrVRiQmcxpBg4e7Hdbm8cqt02fLPa4i0UBrN8wGfwPMHoGFNtCe2J5NGD/nQ4JeZXcMZTPwy+0vA/qN+Df5/PDh9q47v9ckd2aN/UHwhrPptFILHu5rDTv4dkieKIvL3PSpycTP+JoenEpe5zm3B0JDqTTlCnigiJFjhBnZPDjwpx/MILAn0eG85JWxY6Fp8VJFQpJgAZBQ72iCx0pDzHWCdA/v29iozop0YNyrkj+3Qv/uSDhRif8z4swZ0RiE7t+0/+SW48Zna4LQPn45QXa8MyYILvcfAVZ28I3wAw=='),
			this.addDataEntry(dt + 'comment', 320, 213, 'Comment',
				'7Zldj5s4FIZ/DZcTYRwIuWy+KlVdabWtVPXSDU6wBjCynUlmf32PwTAhdhKmIdPdaiKNBhvb4Od9feyTeHieHz4KUqZ/8YRmHl56eC44V/VVfpjTLPMCnyUeXnhB4MOfF6zO3EXVXb8kghaqT4eg7vBEsh2ta+Y8z3Xnql6q58zUpyqHt1sgD882LMvmPOMCygUvoMFMKsEf6UnlhhfqC/tXD4BCKJOMbQsoZHSjzO2mhxdgv/pA/T5lin4pyVp33AMa845UKHo4O8+qykzyI+U5VeIZmuxZotK6xbRG4aeUbVPTy+DxiazL27bnCzS4MNzcDLHF0IInU1Lqy4w5aMHcw2k0ifXcW8o3TPm5O7UjAjhwIEADIBj3R5AfttrtI8blZMTWvJCjnaTixFbAZFN9XLSCEMdhfAuiQxeRITZ2EbOBNXW3AAstYJ9YDhWzXVGwYiuHXn7Bb1p+pkN0FfS9FmdkgcYwKnTzP+y2Owlxzg98FL0973bJ34M3Cq8CR+hOxCcW8a8pKR7B0v4GJh/4KqX6VQRM+2FXjv5sq0c2+VaNocnHFvnvfOcFEclLzaTkMPbsScPXOzwDdEkrh6BEQixuRVqDZluIRG2DguR0VEUovWb2Kan+UUHPDpHyLKlHAPy8bQa1Zjgtu67POLTCq/+UETQoodiaZB/MEIrfwR5xaNsjctgjDG+3x9Syxz+0zPS7tR4BJrGOmfrK/8we6W/YiO4aGE/wI0dgvNvybALu//yUhOK3OyYhZCH7+lzWgQMGS6vwcoJQ8F2R0MR4lIi1sd70ArwTR0owHQz9uSotQhfdxXKJltHxib1p9M1gCS5Yu7sihre1QyJnWMF4AI3sHPJS0ACHJ3wPBc0hITKtpPLrOx3v/yCSrUdrwaXULJND0+5Ui3EQBtHSltfU98J75TzVweuP7KiNxjbdpk7QjCj2RDtjuZCb5//NmU7Am4c/NBu7efzDpDsC32wkVZZk7Sz6qdgjiz23siADPsfeuSMMEJLiruEbQkeCOKP4eAC7vyLXhZ6slLR31Db75eu+BMAXSbVeveBdh3UHci7qyvRwsiUM41w7l34X5GwoeQM97JT7XY8zekRvIIedj18J7L1PmIsVnIHC4z0ddQ9EL1vEuJ9UF5VC05PUGllCIeyI+pN4gKhv59bLhNnfkr+Q9G2Sq/EqXE3OmbpzMDqGaGdLx8lU96yKfPvUaRIBPBNUQsfmfNpz9UzcmlyD3pwsf3WBNBrfY0XYiTAEIqroK9S8lO6+C+kQEk9vVxKKL7+M1c2Pfzj7CQ=='),
			this.addDataEntry(dt + 'date picker', 150, 53, 'Date picker',
				'pZRdb4IwFIZ/DZea0orC5QbqzZYs2cWyy0YO0Ky0pFSH+/UrtqKsmJl4QXI++p5ynjcQkLTutoo21avMgQdkHZBUSaltVHcpcB5gxPKAZAHGyDwB3tzohqcuaqgCoe8RYCs4UL4HW8lMgFFONdhWq4/ctQrGeSq5VCYVUpjqc6uV/II/xUrXZpEsNGEhhX5nP/2AcMjdRGRyylkpTMyh0K59HhZgEiXLVYz+yPyxdgVQGrqbGE4lx2ALsgatjubIN8t15VAsLCpUASsrJ3P4EG1tXg7SC1QTOK7TjInH+FPulakIWvuQldyLHHK3KFU7t2fSr31lgMGzWW3iTeJTbBu6Y6J8OWVZ5NlkpNl6Ha6XY6/soQ9HBP9nh8OPH8F/dJQjq7hyI4wm3CDkcTcWnhueBW1Fmz6su7L/MOdlnfP5jnIQOVW+DdHTMo7D6Y/hHjZkms1Y4Eih+QSq2Cd1ringVLMDjGZN4XP3v0lmXmu4fIaT0fWzZDxBFkUL2sM/bDHliEkv/zd7/Pr39ws='),
			this.addDataEntry(dt + 'date picker', 320, 415, 'Date picker',
				'1Zxdb9owFIZ/DZdFthOH5HIl0E1au2lt1euMGIiaYBTSFvbrZ0igkGMqtvorSJXyUSfk8bHzvj5H9Lxhsb4pk+X8lqcs73mjnjcsOa/qrWI9ZHneIyhLe17cIwSJvx4ZnzmLd2fRMinZorqkAakbvCb5C6uPxGKDoDSpWH1qVW3y5tQ0y/Mhz3kpdhd8IY5er6qSP7PWwXlViAeJsdic8kV1n/3ZXgAf9psrIrGf5NlsIbZzNq2a0/uL9YhHo2AQolYzeNn6EVhZsfVZDLtDDYMbxgtWlRvxL29ZWs0bFH6NCs1ZNps3zRp8KFnV+7ND03eoYqPhKmfsAcYPPE02AG/JXxYpS5tHTMpJ84TR9oGP0Asw090H8lstk0m2mH3f7cUUdJBoihAdxOFpL9X/9NSwILAjCPVCGrbAk8+A3zR8ad3iqB8wlfSD532+H3zQD6ALVvNkud0s1rPtkOzPijTvT5KcLdKkhN1wwCIZBpew8eRsThs0pFBfgiqEpPbHSpYnVfbKTq4lw9fc/yfPxNc63PyKRCe3v4pOr8Cn0xWrAP7DU1zUI/Tfe6Tgk+eXZX/Ky2LVL0s22YZ92YSkNODj8QiP6AdjSNwi5W+7ofD5gA5gL3lEFtBUwcwSAH53/JUVv1kpjhKEKcQpm68l8/ol4z8AE/Ml+OiHMR+gk6jDAaBJkISmrwDmQBKMQb4NL60UI8nrTQHIPbnzIGXTrAqOoYzjrKscCfVtgYwAyPvHO1UMo90HvNHVj2hyOqIp5CfTXSr4YQQA3v7oHsDAHkAMAD48jjoHECN7BKG/ehrF3SPo2yMocU9fH7tHMLRHEPqe8a9vnSNo80UCfcr9l4fuEbT4JoFOxcNaAQYqgJ3yigzygmZEGS60+2jAFdjDBT2HZCXBMVxtWWKSF7QWnvu8fGu8CHQSvvu8Qnu8oHFQthSljZfF6X4/Wx3xCtznZW++l6RUBu7zai1tegZ5QQsQOs+rvRRskhcU/JHzvNp6wigwqO/3q28qiDUZy4+SD74Kgr5FghLF/x+SX+AaDUfxGF0ceN71ubzzYf1UpQoxyhTagv2CnMPj2OqLAhoD7L4zsPmq8KA1wO57g3aIDQwCg95AXZ7amBgxCQyaA+y+OwBqxCQxaA+w+/4AqA+TxKBBwO47BKAtTBKDFgG77xGsTvzQI+y/jcvEbM780BN0IA3QCjFZxYw2YJI8gPuCP7AIDOp9dZkAbXm5trYwScyHer8LuQDfIjEo+DuQDWhrC6PEoOLvQj7A4sTvQ8XfhYyAxZnfh4q/AzmBdogZLGHxoeDvQFKgHWEmgUlqftzX+0BbmCSmsepHnxhrSwuTwDTW/egD1lYWJoFpLPzRV4ZncdanUO4rU/v6gFmc9anG0h9ThZ4mS1ko1PrKpL42Xu34MslLY+mPuQULk8A01v6YExUmgWks/jEnKkwC01n8Y05VmCSmptjHtqzQR0zsvv8GSv3DAsc/kfIX'),

			this.addEntry(dt + 'text field', function()
	   		{
			   	var item1 = new mxCell('Your name', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Sally Lu', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;fillColor=#F7F8F9;align=left;spacingLeft=5;strokeColor=#DEE1E6;html=1;strokeWidth=2;fontColor=#596780;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Text field');
			}),
			this.addEntry(dt + 'text field required', function()
	   		{
			   	var item1 = new mxCell('Requirements<sup><font color="#ff0000">*</font></sup>', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Design, eating, drinking', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;fillColor=#F7F8F9;align=left;spacingLeft=5;strokeColor=#DEE1E6;html=1;strokeWidth=2;fontColor=#596780;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Text field with required fields');
			}),
			this.addEntry(dt + 'disabled text field', function()
	   		{
			   	var item1 = new mxCell('Guests', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#B3BAC5;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('Kris Wesley', new mxGeometry(0, 25, 290, 33), 'rounded=1;arcSize=9;fillColor=#F7F8F9;align=left;spacingLeft=5;strokeColor=#DEE1E6;html=1;strokeWidth=2;fontColor=#B3BAC5;fontSize=12');
			   	item2.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Disabled text field');
			}),
			this.addDataEntry(dt + 'text field disabled', 370, 543, 'Disabled text field',
				'7Vlbc5s4FP41vOxDBxC+PcbY9KHdncymnT4rcGzUCokVch3vr68EggakOG6MnXZazxh0Owfzfecm2UNx8fBW4DL/m2dAPbT2UCw4l02reIiBUi/0SeahlReGvvp6YfLEbFDP+iUWwOQpAmEj8BXTHTQjsQAsQY1hrUjwz5DKZlElD9Qs2hBKY065UF3GmRpdVlLwLzAYzGWhXmkVqOaGM3lH/tcKgq5vNPqqjynZMtWmsJFmulXmhSiYhcsoHogN1c7Ny4CQ8PAkIPWQQeMt8AKkOKgle5LJ3IASNaD5OZBtbsQMkD6umv62E/0Or2oYhN1oIwvt2wbgSisWGvV9DvX9wHdC3QSUvCKSCwJ6DSVf4Y26f8jh0ImkCgJMGIiqkdNDmKnrVvBdqYkjBaHYoY7oVRuuZ+5BShC1tkwr5WKLGamwJJxVb04xgAGBTnsYsOrXnwGLYd9u9jmRcFfiVE/ulaOoMc0wSTG9MY+UvDyH+oNheNJIPLIENHNYQjQ53xKipyxBDTJcKAamtEZREzjd6mY7pLGqeWphnP63480CtNnUgD4aamT/aoXV72rk+zrVcO9Jr+3uk8V0NvefcfdgBM5bfq/h/ROL80/qdxZAObMQV57LMsjMW2ORmpdeaAwesVFzrj8OB1Q+Q9j2fd1bTSzOlGgUL26SpE9cs+iTwSM82WnP52Jh+1+4cPnfCFxMLS7e6Yj6x+mu4XRB5GD6Ul43s5herj/cHEVbYRHHa7/2jB+FvIU4VViofGqB3LnccZDRsh8BzkH9oU1vBs0jLFyKhLlFwp3EVX5O2EtmyTxZvCjsrdbrYD39wbDX944Rw17gykGXinsLi4gVVKkgpa7zfqMQ1Fn1NUJQ4NuZP8c6n5C6Ci9KLiSuE0xTjJfAS6qrcMnV5Qvjew8lJztL9NM6y8Uqd0coQ1MHm0EwQu3eGaCreC9BFKSq9K7p9d3ppF1zNAIBaH5Nd7IPLT5W9d4VpylUPyvul8gdkX9N3O3ji38BZ1or09e9IPrgaAB+leNSN5UuUlZwZP9ihR7fn8xWcyveREf2JANehuGmIFlG4Vli0JLie6C3+qxE50W0Eg2UncL3g/lOcT+idpH/nMKtjTct58jmPHDFujEot88pDOWc0cMJXPdz1DAr+UmYuJPOfBWv0S/Fcz9B5jjTSbt+ZqYq3RqCUYyhX8RHE4cxhA5jCEcwBvsA4x8dOP9YwatbgWMLcTErsI9Obnf3lDy7mxvQPgjuxw+KrTOubnv9Is6ji/NkiJkENjGuuhShEYixTzpizFKgL66HnirqfxUSjMCs7ywX5ER1v/91V8/1/tn7Bg=='),

			this.addEntry(dt + 'error message field', function()
	   		{
			   	var item1 = new mxCell('Email', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('shrugg#atlassian.com', new mxGeometry(0, 25, 300, 40), 'rounded=1;arcSize=9;align=left;spacingLeft=5;strokeColor=#FFAB00;html=1;strokeWidth=2;fontSize=12');
			   	item2.vertex = true;
			   	var item3 = new mxCell('', new mxGeometry(1, 0.5, 20, 20), 'shape=mxgraph.azure.azure_alert;fillColor=#FFAB00;strokeColor=none;html=1');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(-30, -10);
			   	item3.vertex = true;
			   	item2.insert(item3);
		   		return sb.createVertexTemplateFromCells([item1, item2], 290, 58, 'Error message field');
			}),
			this.addEntry(dt + 'error message field', function()
	   		{
			   	var item1 = new mxCell('Email', new mxGeometry(0, 0, 240, 20), 'fillColor=none;strokeColor=none;html=1;fontSize=11;fontStyle=0;align=left;fontColor=#596780;fontStyle=1;fontSize=11');
			   	item1.vertex = true;
			   	var item2 = new mxCell('shrugg#atlassian.com', new mxGeometry(0, 25, 300, 40), 'rounded=1;arcSize=9;align=left;spacingLeft=5;strokeColor=#4C9AFF;html=1;strokeWidth=2;fontSize=12');
			   	item2.vertex = true;
			   	var item3 = new mxCell('', new mxGeometry(1, 0.5, 20, 20), 'shape=mxgraph.azure.azure_alert;fillColor=#FFAB00;strokeColor=none;html=1');
			   	item3.geometry.relative = true;
			   	item3.geometry.offset = new mxPoint(-30, -10);
			   	item3.vertex = true;
			   	item2.insert(item3);
			   	var item4 = new mxCell('Please enter a valid address.', new mxGeometry(310, 22, 200, 46), 'rounded=1;arcSize=9;align=center;strokeColor=#DFE1E5;html=1;strokeWidth=1;fontSize=12;shadow=1');
			   	item4.vertex = true;
		   		return sb.createVertexTemplateFromCells([item1, item2, item4], 290, 58, 'Error message field');
			})
		];
			   	
   		this.addPalette('atlassian', 'Atlassian', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
   		
		this.setCurrentSearchEntryLibrary();
	};
})();
