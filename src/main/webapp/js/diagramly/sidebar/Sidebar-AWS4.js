(function()
{
	// Adds mockup shapes
	Sidebar.prototype.addAWS4Palette = function()
	{
		var pts = 'points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];';
		var n = pts + 'outlineConnect=0;fontColor=#232F3E;strokeColor=#ffffff;dashed=0;verticalLabelPosition=middle;verticalAlign=bottom;align=center;html=1;whiteSpace=wrap;fontSize=10;fontStyle=1;spacing=3;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#232F3E;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n3 = 'outlineConnect=0;gradientColor=none;fontColor=#545B64;strokeColor=none;fillColor=#879196;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n4 = pts + 'outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=0;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n5 = 'gradientDirection=north;outlineConnect=0;fontColor=#232F3E;gradientColor=#505863;fillColor=#1E262E;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var gn = 'mxgraph.aws4';
		var sb = this;

		var s = 1;
		var w = s * 100;
		var h = s * 100;
		var w2 = s * 78;
		
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Arrows');
		this.addAWS4ArrowsPalette(s, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4General Resources');
		this.addAWS4GeneralResourcesPalette(s, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Illustrations');
		this.addAWS4IllustrationsPalette(s, n3, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Groups');
		this.addAWS4GroupsPalette(s, gn, sb, pts);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Analytics');
		this.addAWS4AnalyticsPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Application Integration');
		this.addAWS4ApplicationIntegrationPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4AR VR');
		this.addAWS4ARVRPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Cost Management');
		this.addAWS4CostManagementPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Blockchain');
		this.addAWS4BlockchainPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Business Applications');
		this.addAWS4BusinessApplicationsPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4EC2 Instance Types');
		this.addAWS4EC2InstanceTypePalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Compute');
		this.addAWS4ComputePalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Containers');
		this.addAWS4ContainersPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Customer Enablement');
		this.addAWS4CustomerEnablementPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Customer Engagement');
		this.addAWS4CustomerEngagementPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Database');
		this.addAWS4DatabasePalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Developer Tools');
		this.addAWS4DeveloperToolsPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4End User Computing');
		this.addAWS4EndUserComputingPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Game Tech');
		this.addAWS4GameTechPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Internet of Things');
		this.addAWS4InternetOfThingsPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Machine Learning');
		this.addAWS4MachineLearningPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Management Governance');
		this.addAWS4ManagementGovernancePalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Media Services');
		this.addAWS4MediaServicesPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Migration Transfer');
		this.addAWS4MigrationTransferPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Mobile');
		this.addAWS4MobilePalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Network Content Delivery');
		this.addAWS4NetworkContentDeliveryPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Quantum Technologies');
		this.addAWS4QuantumTechnologiesPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Robotics');
		this.addAWS4RoboticsPalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Satellite');
		this.addAWS4SatellitePalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Security Identity Compliance');
		this.addAWS4SecurityIdentityCompliancePalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary('aws4', 'aws4Storage');
		this.addAWS4StoragePalette(s, w, h, w2, gn, sb);
		this.setCurrentSearchEntryLibrary();
	};
	
	Sidebar.prototype.addAWS4ArrowsPalette = function(s, gn, sb)
	{
		var dt = 'aws amazon web service arrows arrow ';
		
		this.addPaletteFunctions('aws4Arrows', 'AWS / Arrows', false,
		[
			this.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;html=1;endArrow=none;elbow=vertical;startArrow=block;startFill=1;strokeColor=#545B64;rounded=0;', 
					s * 100, s * 0, '', 'Default (left)', null, this.getTagsForStencil(gn, '', dt + 'default left').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;html=1;endArrow=block;elbow=vertical;startArrow=none;endFill=1;strokeColor=#545B64;rounded=0;', 
					s * 100, s * 0, '', 'Default (left)', null, this.getTagsForStencil(gn, '', dt + 'default left').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;html=1;endArrow=block;elbow=vertical;startArrow=block;startFill=1;endFill=1;strokeColor=#545B64;rounded=0;', 
					s * 100, s * 0, '', 'Default (double)', null, this.getTagsForStencil(gn, '', dt + 'default double').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;html=1;endArrow=none;elbow=vertical;startArrow=openThin;startFill=0;strokeColor=#545B64;rounded=0;', 
					s * 100, s * 0, '', 'Open (thin, left)', null, this.getTagsForStencil(gn, '', dt + 'open thin left').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;html=1;endArrow=openThin;elbow=vertical;startArrow=none;endFill=0;strokeColor=#545B64;rounded=0;', 
					s * 100, s * 0, '', 'Open (thin, left)', null, this.getTagsForStencil(gn, '', dt + 'open thin left').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;html=1;endArrow=openThin;elbow=vertical;startArrow=openThin;startFill=0;endFill=0;strokeColor=#545B64;rounded=0;', 
					s * 100, s * 0, '', 'Open (thin, double)', null, this.getTagsForStencil(gn, '', dt + 'open thin double').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;html=1;endArrow=none;elbow=vertical;startArrow=open;startFill=0;strokeColor=#545B64;rounded=0;', 
					s * 100, s * 0, '', 'Open (left)', null, this.getTagsForStencil(gn, '', dt + 'open left').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;html=1;endArrow=open;elbow=vertical;startArrow=none;endFill=0;strokeColor=#545B64;rounded=0;', 
					s * 100, s * 0, '', 'Open (left)', null, this.getTagsForStencil(gn, '', dt + 'open left').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;html=1;endArrow=open;elbow=vertical;startArrow=open;startFill=0;endFill=0;strokeColor=#545B64;rounded=0;', 
					s * 100, s * 0, '', 'Open (double)', null, this.getTagsForStencil(gn, '', dt + 'open double').join(' '))
		]);
	};

	Sidebar.prototype.addAWS4GeneralResourcesPalette = function(s, gn, sb)
	{
		var dt = 'aws amazon web service general resources ';
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#232F3E;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#5A6C86;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n3 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];gradientDirection=north;outlineConnect=0;fontColor=#232F3E;gradientColor=#505863;fillColor=#1E262E;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		
		this.addPaletteFunctions('aws4General Resources', 'AWS / General Resources', false,
		[
			 this.createVertexTemplateEntry(n3 + 'resourceIcon;resIcon=' + gn + '.marketplace;',
					 s * 78, s * 78, '', 'Marketplace', null, null, this.getTagsForStencil(gn, 'marketplace', dt).join(' ')),
			 this.createVertexTemplateEntry(n3 + 'resourceIcon;resIcon=' + gn + '.general;',
					 s * 78, s * 78, '', 'General', null, null, this.getTagsForStencil(gn, 'general', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'client;',
					 s * 78, s * 76, '', 'Client', null, null, this.getTagsForStencil(gn, 'client', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'corporate_data_center;',
					 s * 53, s * 78, '', 'Corporate Data Center', null, null, this.getTagsForStencil(gn, 'corporate data center', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'disk;',
					 s * 78, s * 78, '', 'Disk', null, null, this.getTagsForStencil(gn, 'disk', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'email_2;',
					 s * 78, s * 49, '', 'Email', null, null, this.getTagsForStencil(gn, 'email', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'forums;',
					 s * 78, s * 76, '', 'Forums', null, null, this.getTagsForStencil(gn, 'forums', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'generic_database;',
					 s * 59, s * 78, '', 'Generic Database', null, null, this.getTagsForStencil(gn, 'generic database', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'generic_firewall;',
					 s * 78, s * 66, '', 'Generic Firewall', null, null, this.getTagsForStencil(gn, 'generic firewall', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'internet;',
					 s * 78, s * 48, '', 'Internet', null, null, this.getTagsForStencil(gn, 'internet', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'internet_alt1;',
					 s * 78, s * 48, '', 'Internet', null, null, this.getTagsForStencil(gn, 'internet', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'internet_alt2;',
					 s * 78, s * 78, '', 'Internet', null, null, this.getTagsForStencil(gn, 'internet gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'mobile_client;',
					 s * 41, s * 78, '', 'Mobile Client', null, null, this.getTagsForStencil(gn, 'mobile client', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'multimedia;',
					 s * 78, s * 73, '', 'Multimedia', null, null, this.getTagsForStencil(gn, 'multimedia', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'office_building;',
					 s * 50, s * 78, '', 'Office Building', null, null, this.getTagsForStencil(gn, 'office building', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'saml_token;',
					 s * 78, s * 78, '', 'SAML Token', null, null, this.getTagsForStencil(gn, 'saml token', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'ssl_padlock;',
					 s * 78, s * 76, '', 'SSL Padlock', null, null, this.getTagsForStencil(gn, 'ssl padlock', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'tape_storage;',
					 s * 78, s * 38, '', 'Tape Storage', null, null, this.getTagsForStencil(gn, 'tape storage', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'traditional_server;',
					 s * 45, s * 78, '', 'Traditional Server', null, null, this.getTagsForStencil(gn, 'traditional server', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'user;',
					 s * 78, s * 78, '', 'User', null, null, this.getTagsForStencil(gn, 'user', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'users;',
					 s * 78, s * 78, '', 'Users', null, null, this.getTagsForStencil(gn, 'users', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'external_toolkit;',
					 s * 68, s * 78, '', 'Toolkit', null, null, this.getTagsForStencil(gn, 'external toolkit', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'external_sdk;',
					 s * 68, s * 78, '', 'SDK', null, null, this.getTagsForStencil(gn, 'external sdk software development kit', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4IllustrationsPalette = function(s, n3, gn, sb)
	{
		var dt = 'aws amazon web service illustrations ';
		
		this.addPaletteFunctions('aws4Illustrations', 'AWS / Illustrations', false,
		[
			 this.createVertexTemplateEntry(n3 + 'illustration_users;pointerEvents=1',
					 s * 100, s * 100, 'users', null, null, null, this.getTagsForStencil(gn, 'users', dt).join(' ')),
			 this.createVertexTemplateEntry(n3 + 'illustration_notification;pointerEvents=1',
					 s * 100, s * 81, 'notification', null, null, null, this.getTagsForStencil(gn, 'users', dt).join(' ')),
			 this.createVertexTemplateEntry(n3 + 'illustration_devices;pointerEvents=1',
					 s * 100, s * 73, 'devices', null, null, null, this.getTagsForStencil(gn, 'devices', dt).join(' ')),
			 this.createVertexTemplateEntry(n3 + 'illustration_desktop;pointerEvents=1',
					 s * 100, s * 91, 'desktop', null, null, null, this.getTagsForStencil(gn, 'desktop', dt).join(' ')),
			 this.createVertexTemplateEntry(n3 + 'illustration_office_building;pointerEvents=1',
					 s * 100, s * 71, 'office building', null, null, null, this.getTagsForStencil(gn, 'office building', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4GroupsPalette = function(s, gn, sb, pts)
	{
		var n4 = pts + 'outlineConnect=0;gradientColor=none;html=1;whiteSpace=wrap;fontSize=12;fontStyle=0;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service groups group ';
		
		this.addPaletteFunctions('aws4Groups', 'AWS / Groups', false,
		[
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_aws_cloud_alt;strokeColor=#232F3E;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#232F3E;dashed=0;',
					 s * 130, s * 130, 'AWS Cloud', null, null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_aws_cloud;strokeColor=#232F3E;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#232F3E;dashed=0;',
					 s * 130, s * 130, 'AWS Cloud', null, null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_region;strokeColor=#147EBA;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#147EBA;dashed=1;',
					 s * 130, s * 130, 'Region', null, null, null, this.getTagsForStencil(gn, 'region', dt).join(' ')),
			 this.createVertexTemplateEntry('fillColor=none;strokeColor=#147EBA;dashed=1;verticalAlign=top;fontStyle=0;fontColor=#147EBA;',
					 s * 130, s * 130, 'Availability Zone', null, null, null, this.getTagsForStencil(gn, 'availability zone', dt).join(' ')),
			 this.createVertexTemplateEntry('fillColor=none;strokeColor=#DD3522;verticalAlign=top;fontStyle=0;fontColor=#DD3522;',
					 s * 130, s * 130, 'Security group', null, null, null, this.getTagsForStencil(gn, 'security', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'groupCenter;grIcon=' + gn + '.group_auto_scaling_group;grStroke=1;strokeColor=#D86613;fillColor=none;verticalAlign=top;align=center;fontColor=#D86613;dashed=1;spacingTop=25;',
					 s * 130, s * 130, 'Auto Scaling group', null, null, null, this.getTagsForStencil(gn, 'auto scaling', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_vpc;strokeColor=#248814;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#AAB7B8;dashed=0;',
					 s * 130, s * 130, 'VPC', null, null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_security_group;grStroke=0;strokeColor=#147EBA;fillColor=#E6F2F8;verticalAlign=top;align=left;spacingLeft=30;fontColor=#147EBA;dashed=0;',
					 s * 130, s * 130, 'Private subnet', null, null, null, this.getTagsForStencil(gn, 'private subnet', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_security_group;grStroke=0;strokeColor=#248814;fillColor=#E9F3E6;verticalAlign=top;align=left;spacingLeft=30;fontColor=#248814;dashed=0;',
					 s * 130, s * 130, 'Public subnet', null, null, null, this.getTagsForStencil(gn, 'public subnet', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_on_premise;strokeColor=#5A6C86;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#5A6C86;dashed=0;',
					 s * 130, s * 130, 'Server contents', null, null, null, this.getTagsForStencil(gn, 'server contents', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_corporate_data_center;strokeColor=#5A6C86;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#5A6C86;dashed=0;',
					 s * 130, s * 130, 'Corporate data center', null, null, null, this.getTagsForStencil(gn, 'corporate data center', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_elastic_beanstalk;strokeColor=#D86613;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#D86613;dashed=0;',
					 s * 130, s * 130, 'Elastic Beanstalk container', null, null, null, this.getTagsForStencil(gn, 'elastic beanstalk container', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_ec2_instance_contents;strokeColor=#D86613;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#D86613;dashed=0;',
					 s * 130, s * 130, 'EC2 instance contents', null, null, null, this.getTagsForStencil(gn, 'ec2 instance contents', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_spot_fleet;strokeColor=#D86613;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#D86613;dashed=0;',
					 s * 130, s * 130, 'Spot Fleet', null, null, null, this.getTagsForStencil(gn, 'spot fleet', dt).join(' ')),
			 this.createVertexTemplateEntry(n4 + 'group;grIcon=' + gn + '.group_aws_step_functions_workflow;strokeColor=#CD2264;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#CD2264;dashed=0;',
					 s * 130, s * 130, 'AWS Step Functions workflow', null, null, null, this.getTagsForStencil(gn, 'step function', dt).join(' ')),
			 this.createVertexTemplateEntry('fillColor=none;strokeColor=#5A6C86;dashed=1;verticalAlign=top;fontStyle=0;fontColor=#5A6C86;',
					 s * 130, s * 130, 'Generic group', null, null, null, this.getTagsForStencil(gn, 'generic', dt).join(' ')),
			 this.createVertexTemplateEntry('fillColor=#EFF0F3;strokeColor=none;dashed=0;verticalAlign=top;fontStyle=0;fontColor=#232F3D;',
					 s * 130, s * 130, 'Generic group', null, null, null, this.getTagsForStencil(gn, 'generic', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4AnalyticsPalette = function(s, w, h, w2, gn, sb, pts)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#5A30B5;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#945DF2;gradientDirection=north;fillColor=#5A30B5;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service analytics ';
		
		this.addPaletteFunctions('aws4Analytics', 'AWS / Analytics', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.analytics;',
					 w2, w2, '', 'Analytics', null, null, this.getTagsForStencil(gn, 'analytics', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.athena;',
					 w2, w2, '', 'Athena', null, null, this.getTagsForStencil(gn, 'athena', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloudsearch2;',
					 w2, w2, '', 'CloudSearch', null, null, this.getTagsForStencil(gn, 'cloudsearch', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elasticsearch_service;',
					 w2, w2, '', 'ElasticSearch Service', null, null, this.getTagsForStencil(gn, 'elasticsearch service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.emr;',
					 w2, w2, '', 'EMR', null, null, this.getTagsForStencil(gn, 'emr', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.kinesis;',
					 w2, w2, '', 'Kinesis', null, null, this.getTagsForStencil(gn, 'kinesis', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.kinesis_data_analytics;',
					 w2, w2, '', 'Kinesis Data Analytics', null, null, this.getTagsForStencil(gn, 'kinesis data analytics', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.kinesis_data_firehose;',
					 w2, w2, '', 'Kinesis Data Firehose', null, null, this.getTagsForStencil(gn, 'kinesis data firehose', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.kinesis_data_streams;',
					 w2, w2, '', 'Kinesis Data Streams', null, null, this.getTagsForStencil(gn, 'kinesis data streams', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.kinesis_video_streams;',
					 w2, w2, '', 'Kinesis Video Streams', null, null, this.getTagsForStencil(gn, 'kinesis video streams', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.quicksight;',
					 w2, w2, '', 'QuickSight', null, null, this.getTagsForStencil(gn, 'quicksight quick sight', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.redshift;',
					 w2, w2, '', 'Redshift', null, null, this.getTagsForStencil(gn, 'redshift', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.data_pipeline;',
					 w2, w2, '', 'Data Pipeline', null, null, this.getTagsForStencil(gn, 'data pipeline', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.managed_streaming_for_kafka;',
					 w2, w2, '', 'Managed Streaming for Kafka', null, null, this.getTagsForStencil(gn, 'managed streaming for kafka', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.glue;',
					 w2, w2, '', 'Glue', null, null, this.getTagsForStencil(gn, 'glue', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.lake_formation;',
					 w2, w2, '', 'Lake Formation', null, null, this.getTagsForStencil(gn, 'lake formation', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.data_exchange;',
					 w2, w2, '', 'Data Exchange', null, null, this.getTagsForStencil(gn, 'data aexchange', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'search_documents;',
					 s * 68, s * 78, '', 'Search Documents', null, null, this.getTagsForStencil(gn, 'search documents', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'cluster;',
					 s * 78, s * 78, '', 'Cluster', null, null, this.getTagsForStencil(gn, 'hdfs cluster', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'data_lake_resource_icon;',
					 s * 78, s * 78, '', 'Data Lake', null, null, this.getTagsForStencil(gn, 'data lake', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'emr_engine;',
					 s * 78, s * 59, '', 'EMR Engine', null, null, this.getTagsForStencil(gn, 'emr engine', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'emr_engine_mapr_m3;',
					 s * 78, s * 59, '', 'EMR Engine MapR M3', null, null, this.getTagsForStencil(gn, 'emr engine mapr m3', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'emr_engine_mapr_m5;',
					 s * 78, s * 59, '', 'EMR Engine MapR M5', null, null, this.getTagsForStencil(gn, 'emr engine mapr m5', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'emr_engine_mapr_m7;',
					 s * 78, s * 59, '', 'EMR Engine MapR M7', null, null, this.getTagsForStencil(gn, 'emr engine mapr m7', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'hdfs_cluster;',
					 s * 78, s * 78, '', 'HDFS Cluster', null, null, this.getTagsForStencil(gn, 'cluster', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'dense_compute_node;',
					 s * 78, s * 78, '', 'Dense Compute Node', null, null, this.getTagsForStencil(gn, 'dense compute node', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'dense_storage_node;',
					 s * 78, s * 78, '', 'Dense Storage Node', null, null, this.getTagsForStencil(gn, 'dense storage node', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'glue_crawlers;',
					 s * 78, s * 78, '', 'Crawler', null, null, this.getTagsForStencil(gn, 'crawler', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'glue_data_catalog;',
					 s * 72, s * 78, '', 'Glue Data Catalog', null, null, this.getTagsForStencil(gn, 'glue data catalog', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4ApplicationIntegrationPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#BC1356;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F34482;gradientDirection=north;fillColor=#BC1356;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n3 = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#232F3E;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service application integration ';
		
		this.addPaletteFunctions('aws4Application Integration', 'AWS / Application Integration', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.application_integration;',
					 w2, w2, '', 'Application Integration', null, null, this.getTagsForStencil(gn, 'application integration', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.mq;',
					 w2, w2, '', 'MQ', null, null, this.getTagsForStencil(gn, 'mq', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.sns;',
					 w2, w2, '', 'Simple Notification Service', null, null, this.getTagsForStencil(gn, 'sns simple notification service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.sqs;',
					 w2, w2, '', 'Simple Queue Service', null, null, this.getTagsForStencil(gn, 'sqs simple queue service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.appsync;',
					 w2, w2, '', 'AppSync', null, null, this.getTagsForStencil(gn, 'appsync', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.eventbridge;',
					 w2, w2, '', 'EventBridge', null, null, this.getTagsForStencil(gn, 'eventbridge event bridge', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.step_functions;',
					 w2, w2, '', 'Step Functions', null, null, this.getTagsForStencil(gn, 'step functions', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.mobile_application;',
					 w2, w2, '', 'Console Mobile Application', null, null, this.getTagsForStencil(gn, 'console mobile application', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.express_workflow;',
					 w2, w2, '', 'Express Workflows', null, null, this.getTagsForStencil(gn, 'express workflows', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.appflow;',
					 w2, w2, '', 'AppFlow', null, null, this.getTagsForStencil(gn, 'appflow', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'email_notification;',
					 s * 78, s * 78, '', 'Email Notification', null, null, this.getTagsForStencil(gn, 'email notification', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'event;',
					 s * 78, s * 78, '', 'Event', null, null, this.getTagsForStencil(gn, 'event', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'eventbridge_custom_event_bus_resource;',
					 s * 78, s * 69, '', 'Custom Event Bus', null, null, this.getTagsForStencil(gn, 'eventbridge custom event bus resource', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'eventbridge_default_event_bus_resource;',
					 s * 78, s * 53, '', 'Default Event Bus', null, null, this.getTagsForStencil(gn, 'eventbridge default event bus resource', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'eventbridge_saas_partner_event_bus_resource;',
					 s * 78, s * 78, '', 'SaaS Event Bus', null, null, this.getTagsForStencil(gn, 'eventbridge saas partner event bus resource', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'event_resource;',
					 s * 78, s * 78, '', 'Event Resource', null, null, this.getTagsForStencil(gn, 'event resource', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'http_notification;',
					 s * 78, s * 78, '', 'HTTP Notification', null, null, this.getTagsForStencil(gn, 'http notification', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'topic;',
					 s * 78, s * 67, '', 'Topic', null, null, this.getTagsForStencil(gn, 'topic', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'message;',
					 s * 76, s * 78, '', 'Message', null, null, this.getTagsForStencil(gn, 'message', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'queue;',
					 s * 78, s * 47, '', 'Queue', null, null, this.getTagsForStencil(gn, 'queue', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rule_3;',
					 s * 78, s * 68, '', 'Rule', null, null, this.getTagsForStencil(gn, 'rule', dt).join(' '))
					 
		]);
	};

	Sidebar.prototype.addAWS4ARVRPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#BC1356;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F34482;gradientDirection=north;fillColor=#BC1356;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service ar vr augmented virtual reality ';
		
		this.addPaletteFunctions('aws4AR VR', 'AWS / AR \& VR', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.ar_vr;',
					 w2, w2, '', 'AR & VR', null, null, this.getTagsForStencil(gn, 'ar vr augmented virtual reality', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.sumerian;',
					 w2, w2, '', 'Sumerian', null, null, this.getTagsForStencil(gn, 'sumerian', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4CostManagementPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#277116;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#60A337;gradientDirection=north;fillColor=#277116;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service cost management ';
		
		this.addPaletteFunctions('aws4Cost Management', 'AWS / Cost Management', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cost_management;',
					 w2, w2, '', 'Cost Management', null, null, this.getTagsForStencil(gn, 'cost management', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.budgets_2;',
					 w2, w2, '', 'Budgets', null, null, this.getTagsForStencil(gn, 'budgets', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cost_and_usage_report;',
					 w2, w2, '', 'Cost & Usage Report', null, null, this.getTagsForStencil(gn, 'cost and usage report', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cost_explorer;',
					 w2, w2, '', 'Cost Explorer', null, null, this.getTagsForStencil(gn, 'cost explorer', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.reserved_instance_reporting;',
					 w2, w2, '', 'Reserved Instance Reporting', null, null, this.getTagsForStencil(gn, 'reserved instance reporting', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.savings_plans;',
					 w2, w2, '', 'Savings Plans', null, null, this.getTagsForStencil(gn, 'savings plans', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4BlockchainPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#D05C17;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F78E04;gradientDirection=north;fillColor=#D05C17;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service cost management ';
		
		this.addPaletteFunctions('aws4Blockchain', 'AWS / Blockchain', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.blockchain;',
					 w2, w2, '', 'Blockchain', null, null, this.getTagsForStencil(gn, 'blockchain', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.managed_blockchain;',
					 w2, w2, '', 'Managed Blockchain', null, null, this.getTagsForStencil(gn, 'managed blockchain', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.quantum_ledger_database;',
					 w2, w2, '', 'Quantum Ledger Database', null, null, this.getTagsForStencil(gn, 'quantum ledger database', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'blockchain_resource;',
					 s * 78, s * 23, '', 'Blockchain Resource', null, null, this.getTagsForStencil(gn, 'blockchain resource', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4BusinessApplicationsPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#C7131F;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F54749;gradientDirection=north;fillColor=#C7131F;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service business applications ';
		
		this.addPaletteFunctions('aws4Business Applications', 'AWS / Business Applications', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.business_application;',
					 w2, w2, '', 'Business Application', null, null, this.getTagsForStencil(gn, 'business application', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.alexa_for_business;',
					 w2, w2, '', 'Alexa for Business', null, null, this.getTagsForStencil(gn, 'alexa for business', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.chime;',
					 w2, w2, '', 'Chime', null, null, this.getTagsForStencil(gn, 'chime', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.workdocs;',
					 w2, w2, '', 'WorkDocs', null, null, this.getTagsForStencil(gn, 'workdocs', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.workmail;',
					 w2, w2, '', 'WorkMail', null, null, this.getTagsForStencil(gn, 'workmail', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4EC2InstanceTypePalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#D86613;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service ec2 instance type ';
		
		this.addPaletteFunctions('aws4EC2 Instance Types', 'AWS / EC2 Instance Types', false,
		[
			 this.createVertexTemplateEntry(n + 'a1_instance;',
					 s * 48, s * 48, '', 'A1 Instance', null, null, this.getTagsForStencil(gn, 'a1', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'c4_instance;',
					 s * 48, s * 48, '', 'C4 Instance', null, null, this.getTagsForStencil(gn, 'c4', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'c5_instance;',
					 s * 48, s * 48, '', 'C5 Instance', null, null, this.getTagsForStencil(gn, 'c5', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'c6g_instance;',
					 s * 48, s * 48, '', 'C6g Instance', null, null, this.getTagsForStencil(gn, 'c6g', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'c5n_instance;',
					 s * 48, s * 48, '', 'C5n Instance', null, null, this.getTagsForStencil(gn, 'c5n', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'd2_instance;',
					 s * 48, s * 48, '', 'D2 Instance', null, null, this.getTagsForStencil(gn, 'd2', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'db_on_instance2;',
					 s * 48, s * 48, '', 'DB Instance', null, null, this.getTagsForStencil(gn, 'db on database', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'f1_instance;',
					 s * 48, s * 48, '', 'F1 Instance', null, null, this.getTagsForStencil(gn, 'f1', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'g3_instance;',
					 s * 48, s * 48, '', 'G3 Instance', null, null, this.getTagsForStencil(gn, 'g3', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'h1_instance;',
					 s * 48, s * 48, '', 'H1 Instance', null, null, this.getTagsForStencil(gn, 'h1', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'high_memory_instance;',
					 s * 48, s * 48, '', 'High Memory Instance', null, null, this.getTagsForStencil(gn, 'high memory instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'i3_instance;',
					 s * 48, s * 48, '', 'I3 Instance', null, null, this.getTagsForStencil(gn, 'i3', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'inferentia;',
					 s * 78, s * 74, '', 'Inferentia', null, null, this.getTagsForStencil(gn, 'inferentia', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'instance2;',
					 s * 48, s * 48, '', 'Instance', null, null, this.getTagsForStencil(gn, '', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'instances;',
					 s * 48, s * 48, '', 'Instances', null, null, this.getTagsForStencil(gn, '', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'instance_with_cloudwatch2;',
					 s * 48, s * 48, '', 'Instance with CloudWatch', null, null, this.getTagsForStencil(gn, 'instance with cloudwatch', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'm4_instance;',
					 s * 48, s * 48, '', 'M4 Instance', null, null, this.getTagsForStencil(gn, 'm4', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'm5a_instance;',
					 s * 48, s * 48, '', 'M5a Instance', null, null, this.getTagsForStencil(gn, 'm5a', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'm5_instance;',
					 s * 48, s * 48, '', 'M5 Instance', null, null, this.getTagsForStencil(gn, 'm5', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'm5n_instance;',
					 s * 48, s * 48, '', 'M5n Instance', null, null, this.getTagsForStencil(gn, 'm5n', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'm6g_instance;',
					 s * 48, s * 48, '', 'M6g Instance', null, null, this.getTagsForStencil(gn, 'm6g', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'optimized_instance;',
					 s * 48, s * 48, '', 'Optimized Instance', null, null, this.getTagsForStencil(gn, 'optimized instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'p2_instance;',
					 s * 48, s * 48, '', 'P2 Instance', null, null, this.getTagsForStencil(gn, 'p2', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'p3_instance;',
					 s * 48, s * 48, '', 'P3 Instance', null, null, this.getTagsForStencil(gn, 'p3', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'r4_instance;',
					 s * 48, s * 48, '', 'R4 Instance', null, null, this.getTagsForStencil(gn, 'r4', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'r5a_instance;',
					 s * 48, s * 48, '', 'R5a Instance', null, null, this.getTagsForStencil(gn, 'r5a', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'r5_instance;',
					 s * 48, s * 48, '', 'R5 Instance', null, null, this.getTagsForStencil(gn, 'r5', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'r5n_instance;',
					 s * 48, s * 48, '', 'R5n Instance', null, null, this.getTagsForStencil(gn, 'r5n', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'r6g_instance;',
					 s * 48, s * 48, '', 'R6g Instance', null, null, this.getTagsForStencil(gn, 'r6g', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'spot_instance;',
					 s * 48, s * 48, '', 'Spot Instance', null, null, this.getTagsForStencil(gn, 'spot', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 't2_instance;',
					 s * 48, s * 48, '', 'T2 Instance', null, null, this.getTagsForStencil(gn, 't2', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 't3a_instance;',
					 s * 48, s * 48, '', 'T3a Instance', null, null, this.getTagsForStencil(gn, 't3a', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 't3_instance;',
					 s * 48, s * 48, '', 'T3 Instance', null, null, this.getTagsForStencil(gn, 't3', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 't3_instance;',
					 s * 48, s * 48, '', 'T3 Instance', null, null, this.getTagsForStencil(gn, 't3', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'x1e_instance;',
					 s * 48, s * 48, '', 'X1e Instance', null, null, this.getTagsForStencil(gn, 'x1e', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'x1_instance2;',
					 s * 48, s * 48, '', 'X1 Instance', null, null, this.getTagsForStencil(gn, 'x1', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'z1d_instance;',
					 s * 48, s * 48, '', 'z1d Instance', null, null, this.getTagsForStencil(gn, 'z1d', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4ComputePalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#D05C17;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F78E04;gradientDirection=north;fillColor=#D05C17;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service compute ';
		
		this.addPaletteFunctions('aws4Compute', 'AWS / Compute', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.compute;',
					 w2, w2, '', 'Compute', null, null, this.getTagsForStencil(gn, 'compute', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.ec2;',
					 w2, w2, '', 'EC2', null, null, this.getTagsForStencil(gn, 'ec2', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.auto_scaling2;',
					 w2, w2, '', 'EC2 Auto Scaling', null, null, this.getTagsForStencil(gn, 'ec2 auto scaling', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.auto_scaling3;',
					 w2, w2, '', 'Auto Scaling', null, null, this.getTagsForStencil(gn, 'auto scaling', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.bottlerocket;',
					 w2, w2, '', 'Bottlerocket', null, null, this.getTagsForStencil(gn, 'bottlerocket', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.lightsail;',
					 w2, w2, '', 'Lightsail', null, null, this.getTagsForStencil(gn, 'lightsail', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.batch;',
					 w2, w2, '', 'Batch', null, null, this.getTagsForStencil(gn, 'batch', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.compute_optimizer;',
					 w2, w2, '', 'Compute Optimizer', null, null, this.getTagsForStencil(gn, 'compute optimizer', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elastic_beanstalk;',
					 w2, w2, '', 'Elastic Beanstalk', null, null, this.getTagsForStencil(gn, 'elastic beanstalk', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.ec2_image_builder;',
					 w2, w2, '', 'EC2 Image Builder', null, null, this.getTagsForStencil(gn, 'ec2 image builder', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.lambda;',
					 w2, w2, '', 'Lambda', null, null, this.getTagsForStencil(gn, 'lambda', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.local_zones;',
					 w2, w2, '', 'Local Zones', null, null, this.getTagsForStencil(gn, 'local zones', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.nitro_enclaves;',
					 w2, w2, '', 'Nitro Enclaves', null, null, this.getTagsForStencil(gn, 'nitro enclaves', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.outposts;',
					 w2, w2, '', 'Outposts', null, null, this.getTagsForStencil(gn, 'outposts', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.parallel_cluster;',
					 w2, w2, '', 'Parallel Cluster', null, null, this.getTagsForStencil(gn, 'parallel cluster', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.serverless_application_repository;',
					 w2, w2, '', 'Serverless Application Repository', null, null, this.getTagsForStencil(gn, 'serverless application repository', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.thinkbox_deadline;',
					 w2, w2, '', 'Thinkbox Deadline', null, null, this.getTagsForStencil(gn, 'thinkbox deadline', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.thinkbox_draft;',
					 w2, w2, '', 'Thinkbox Draft', null, null, this.getTagsForStencil(gn, 'thinkbox draft', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.thinkbox_frost;',
					 w2, w2, '', 'Thinkbox Frost', null, null, this.getTagsForStencil(gn, 'thinkbox frost', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.thinkbox_krakatoa;',
					 w2, w2, '', 'Thinkbox Krakatoa', null, null, this.getTagsForStencil(gn, 'thinkbox krakatoa', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.thinkbox_sequoia;',
					 w2, w2, '', 'Thinkbox Sequoia', null, null, this.getTagsForStencil(gn, 'thinkbox sequoia', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.thinkbox_stoke;',
					 w2, w2, '', 'Thinkbox Stoke', null, null, this.getTagsForStencil(gn, 'thinkbox stoke', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.thinkbox_xmesh;',
					 w2, w2, '', 'Thinkbox XMesh', null, null, this.getTagsForStencil(gn, 'thinkbox xmesh', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elastic_load_balancing;',
					 w2, w2, '', 'Elastic Load Balancing', null, null, this.getTagsForStencil(gn, 'elastic load balancing', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.vmware_cloud_on_aws;',
					 w2, w2, '', 'VMware Cloud on AWS', null, null, this.getTagsForStencil(gn, 'vmware cloud on aws virtual machine vm', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.wavelength;',
					 w2, w2, '', 'Wavelength', null, null, this.getTagsForStencil(gn, 'wavelength', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'ami;',
					 s * 78, s * 78, '', 'AMI', null, null, this.getTagsForStencil(gn, 'ami', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'auto_scaling2;',
					 s * 78, s * 78, '', 'Auto Scaling', null, null, this.getTagsForStencil(gn, 'autoscaling auto scaling', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'elastic_ip_address;',
					 s * 78, s * 33, '', 'Elastic IP Address', null, null, this.getTagsForStencil(gn, 'elastic ip itnernet protocol address', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rescue;',
					 s * 78, s * 78, '', 'Rescue', null, null, this.getTagsForStencil(gn, 'rescue', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'application;',
					 s * 50, s * 78, '', 'Application', null, null, this.getTagsForStencil(gn, 'elastic beanstalk application', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'deployment;',
					 s * 78, s * 74, '', 'Deployment', null, null, this.getTagsForStencil(gn, 'elastic beanstalk deployment', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'lambda_function;',
					 s * 78, s * 78, '', 'Lambda Function', null, null, this.getTagsForStencil(gn, 'lambda function', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4ContainersPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#D05C17;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F78E04;gradientDirection=north;fillColor=#D05C17;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service container containers ';
		
		this.addPaletteFunctions('aws4Containers', 'AWS / Containers', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.containers;',
					 w2, w2, '', 'Containers', null, null, this.getTagsForStencil(gn, '', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.eks;',
					 w2, w2, '', 'Elastic Container Kubernetes', null, null, this.getTagsForStencil(gn, 'elastic container service eks for kubernetes', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.ecr;',
					 w2, w2, '', 'Elastic Container Registry', null, null, this.getTagsForStencil(gn, 'elastic container registry ecr', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.ecs;',
					 w2, w2, '', 'Elastic Container Service', null, null, this.getTagsForStencil(gn, 'elastic container service ecs', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.fargate;',
					 w2, w2, '', 'Fargate', null, null, this.getTagsForStencil(gn, 'fargate', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'registry;',
					 s * 78, s * 78, '', 'Registry', null, null, this.getTagsForStencil(gn, 'registry', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'container_registry_image;',
					 s * 78, s * 78, '', 'Image', null, null, this.getTagsForStencil(gn, 'image', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'container_1;',
					 s * 78, s * 50, '', 'Container', null, null, this.getTagsForStencil(gn, 'ecs elastic container service', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'container_2;',
					 s * 78, s * 50, '', 'Container', null, null, this.getTagsForStencil(gn, 'ecs elastic container service', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'container_3;',
					 s * 78, s * 50, '', 'Container', null, null, this.getTagsForStencil(gn, 'ecs elastic container service', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'ecs_service;',
					 s * 64, s * 78, '', 'Service', null, null, this.getTagsForStencil(gn, 'ecs elastic container service', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'ecs_task;',
					 s * 59, s * 78, '', 'Task', null, null, this.getTagsForStencil(gn, 'ecs elastic container service task', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4CustomerEnablementPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#3334B9;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#4D72F3;gradientDirection=north;fillColor=#3334B9;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service customer enablement ';
		
		this.addPaletteFunctions('aws4Customer Enablement', 'AWS / Customer Enablement', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.customer_enablement;',
					 w2, w2, '', 'Customer Enablement', null, null, this.getTagsForStencil(gn, 'customer enablement', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iq;',
					 w2, w2, '', 'IQ', null, null, this.getTagsForStencil(gn, 'iq', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.managed_services;',
					 w2, w2, '', 'Managed Services', null, null, this.getTagsForStencil(gn, 'managed services', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.professional_services;',
					 w2, w2, '', 'Professional Services', null, null, this.getTagsForStencil(gn, 'professional services', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.support;',
					 w2, w2, '', 'Support', null, null, this.getTagsForStencil(gn, 'support', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.training_certification;',
					 w2, w2, '', 'Training Certification', null, null, this.getTagsForStencil(gn, 'training certification', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4CustomerEngagementPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#3334B9;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#4D72F3;gradientDirection=north;fillColor=#3334B9;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service customer engagement ';
		
		this.addPaletteFunctions('aws4Customer Engagement', 'AWS / Customer Engagement', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.customer_engagement;',
					 w2, w2, '', 'Customer Engagement', null, null, this.getTagsForStencil(gn, 'customer engagement', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.connect;',
					 w2, w2, '', 'Connect', null, null, this.getTagsForStencil(gn, 'connect', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.pinpoint;',
					 w2, w2, '', 'Pinpoint', null, null, this.getTagsForStencil(gn, 'pinpoint', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.simple_email_service;',
					 w2, w2, '', 'Simple Email Service', null, null, this.getTagsForStencil(gn, 'simple email service', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'email;',
					 s * 78, s * 69, '', 'Email', null, null, this.getTagsForStencil(gn, 'email', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4DatabasePalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#3334B9;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#4D72F3;gradientDirection=north;fillColor=#3334B9;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service db database ';
		
		this.addPaletteFunctions('aws4Database', 'AWS / Database', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.database;',
					 w2, w2, '', 'Database', null, null, this.getTagsForStencil(gn, 'database', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.aurora;',
					 w2, w2, '', 'Aurora', null, null, this.getTagsForStencil(gn, 'aurora', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.documentdb_with_mongodb_compatibility;',
					 w2, w2, '', 'DocumentDB (with MongoDB Compatibility)', null, null, this.getTagsForStencil(gn, 'documentdb with mongodb compatibility', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.dynamodb;',
					 w2, w2, '', 'DynamoDB', null, null, this.getTagsForStencil(gn, 'dynamodb', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elasticache;',
					 w2, w2, '', 'ElastiCache', null, null, this.getTagsForStencil(gn, 'elasticache', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.managed_apache_cassandra_service;',
					 w2, w2, '', 'Managed Apache Cassandra Service', null, null, this.getTagsForStencil(gn, 'managed apache cassandra service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.neptune;',
					 w2, w2, '', 'Neptune', null, null, this.getTagsForStencil(gn, 'neptune', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.quantum_ledger_database;',
					 w2, w2, '', 'Quantum Ledger Database', null, null, this.getTagsForStencil(gn, 'quantum ledger database db', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.rds;',
					 w2, w2, '', 'RDS', null, null, this.getTagsForStencil(gn, 'rds', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.rds_on_vmware;',
					 w2, w2, '', 'RDS on VMware', null, null, this.getTagsForStencil(gn, 'rds on vmware', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.redshift;',
					 w2, w2, '', 'Redshift', null, null, this.getTagsForStencil(gn, 'redshift', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.timestream;',
					 w2, w2, '', 'Timestream', null, null, this.getTagsForStencil(gn, 'timestream', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.database_migration_service;',
					 w2, w2, '', 'Database Migration Service', null, null, this.getTagsForStencil(gn, 'database migration service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.keyspaces;',
					 w2, w2, '', 'Keyspaces', null, null, this.getTagsForStencil(gn, 'keyspaces', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'attribute;',
					 s * 78, s * 78, '', 'Attribute', null, null, this.getTagsForStencil(gn, 'dynamodb dynamo db database attribute', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'attributes;',
					 s * 78, s * 78, '', 'Attributes', null, null, this.getTagsForStencil(gn, 'dynamodb dynamo db database attributes', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'aurora_instance;',
					 s * 78, s * 78, '', 'Aurora Instance', null, null, this.getTagsForStencil(gn, 'aurora instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'aurora_instance_alt;',
					 s * 78, s * 78, '', 'Aurora Instance', null, null, this.getTagsForStencil(gn, 'aurora instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_instance;',
					 s * 78, s * 78, '', 'RDS Instance', null, null, this.getTagsForStencil(gn, 'rds instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_instance_alt;',
					 s * 78, s * 78, '', 'RDS Instance', null, null, this.getTagsForStencil(gn, 'rds instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_mariadb_instance;',
					 s * 78, s * 78, '', 'MariaDB Instance', null, null, this.getTagsForStencil(gn, 'mariadb maria db instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_mariadb_instance_alt;',
					 s * 78, s * 78, '', 'MariaDB Instance', null, null, this.getTagsForStencil(gn, 'mariadb maria db instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_mysql_instance;',
					 s * 78, s * 78, '', 'MySQL Instance', null, null, this.getTagsForStencil(gn, 'mysql instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_mysql_instance_alt;',
					 s * 78, s * 78, '', 'MySQL Instance', null, null, this.getTagsForStencil(gn, 'mysql instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_oracle_instance;',
					 s * 78, s * 78, '', 'Oracle Instance', null, null, this.getTagsForStencil(gn, 'oracle instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_oracle_instance_alt;',
					 s * 78, s * 78, '', 'Oracle Instance', null, null, this.getTagsForStencil(gn, 'oracle instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_piops;',
					 s * 78, s * 78, '', 'PIOPS', null, null, this.getTagsForStencil(gn, 'piop', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_postgresql_instance;',
					 s * 78, s * 78, '', 'Postgre SQL Instance', null, null, this.getTagsForStencil(gn, 'postgre sql instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_postgresql_instance_alt;',
					 s * 78, s * 78, '', 'Postgre SQL Instance', null, null, this.getTagsForStencil(gn, 'postgre sql instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_proxy;',
					 s * 78, s * 78, '', 'RDS Proxy', null, null, this.getTagsForStencil(gn, 'rds proxy', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_proxy_alt;',
					 s * 78, s * 78, '', 'RDS Proxy', null, null, this.getTagsForStencil(gn, 'rds proxy', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_sql_server_instance;',
					 s * 78, s * 78, '', 'SQL Server Instance', null, null, this.getTagsForStencil(gn, 'sql server instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rds_sql_server_instance_alt;',
					 s * 78, s * 78, '', 'SQL Server Instance', null, null, this.getTagsForStencil(gn, 'sql server instance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'dynamodb_dax;',
					 s * 78, s * 72, '', 'DAX', null, null, this.getTagsForStencil(gn, 'dynamodb dynamo db database dax', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'global_secondary_index;',
					 s * 78, s * 78, '', 'Global Secondary Index', null, null, this.getTagsForStencil(gn, 'global secondary index', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'item;',
					 s * 78, s * 78, '', 'Item', null, null, this.getTagsForStencil(gn, 'item', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'items;',
					 s * 78, s * 78, '', 'Items', null, null, this.getTagsForStencil(gn, 'items', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'table;',
					 s * 78, s * 78, '', 'Table', null, null, this.getTagsForStencil(gn, 'table', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'cache_node;',
					 s * 78, s * 78, '', 'Cache Node', null, null, this.getTagsForStencil(gn, 'elasticache elastic cache node', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'elasticache_for_memcached;',
					 s * 78, s * 69, '', 'ElastiCache for Memcached', null, null, this.getTagsForStencil(gn, 'elasticache for memcached', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'elasticache_for_redis;',
					 s * 78, s * 69, '', 'Elasticache for Redis', null, null, this.getTagsForStencil(gn, 'elasticache for redis', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'dense_compute_node;',
					 s * 78, s * 78, '', 'Dense Compute Node', null, null, this.getTagsForStencil(gn, 'dense compute node', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'dense_storage_node;',
					 s * 78, s * 78, '', 'Dense Storage Node', null, null, this.getTagsForStencil(gn, 'dense storage node', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'database_migration_workflow_job;',
					 s * 50, s * 78, '', 'Database Migration Workflow / Job', null, null, this.getTagsForStencil(gn, 'database migration workflow job', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4DeveloperToolsPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#3334B9;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#4D72F3;gradientDirection=north;fillColor=#3334B9;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service dev developer tools ';
		
		this.addPaletteFunctions('aws4Developer Tools', 'AWS / Developer Tools', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.developer_tools;',
					 w2, w2, '', 'Developer Tools', null, null, this.getTagsForStencil(gn, 'developer tools', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloud9;',
					 w2, w2, '', 'Cloud9', null, null, this.getTagsForStencil(gn, 'cloud9', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloud_development_kit;',
					 w2, w2, '', 'Cloud Development Kit', null, null, this.getTagsForStencil(gn, 'cloud development kit', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.codeartifact;',
					 w2, w2, '', 'CodeArtifact', null, null, this.getTagsForStencil(gn, 'codeartifact', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.codebuild;',
					 w2, w2, '', 'CodeBuild', null, null, this.getTagsForStencil(gn, 'codebuild', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.codecommit;',
					 w2, w2, '', 'CodeCommit', null, null, this.getTagsForStencil(gn, 'codecommit', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.codedeploy;',
					 w2, w2, '', 'CodeDeploy', null, null, this.getTagsForStencil(gn, 'codedeploy', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.codepipeline;',
					 w2, w2, '', 'CodePipeline', null, null, this.getTagsForStencil(gn, 'codepipeline', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.codestar;',
					 w2, w2, '', 'CodeStar', null, null, this.getTagsForStencil(gn, 'codestar', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.command_line_interface;',
					 w2, w2, '', 'Command Line Interface', null, null, this.getTagsForStencil(gn, 'command line interface', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.tools_and_sdks;',
					 w2, w2, '', 'Tools and SDKs', null, null, this.getTagsForStencil(gn, 'tools and sdks software development kit', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.xray;',
					 w2, w2, '', 'X-Ray', null, null, this.getTagsForStencil(gn, 'ray xray', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'dynamodb_dax;',
					 s * 78, s * 72, '', 'DAX', null, null, this.getTagsForStencil(gn, 'dynamodb dynamo db database dax', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'cloud9;',
					 s * 78, s * 50, '', 'Cloud9', null, null, this.getTagsForStencil(gn, 'cloud9', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4EndUserComputingPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#116D5B;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#4AB29A;gradientDirection=north;fillColor=#116D5B;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service db database ';
		
		this.addPaletteFunctions('aws4End User Computing', 'AWS / End User Computing', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.desktop_and_app_streaming;',
					 w2, w2, '', 'End User Computing', null, null, this.getTagsForStencil(gn, 'desktop and app streaming', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.appstream_20;',
					 w2, w2, '', 'Appstream 2.0', null, null, this.getTagsForStencil(gn, 'appstream', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.workspaces;',
					 w2, w2, '', 'WorkSpaces', null, null, this.getTagsForStencil(gn, 'workspaces', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.worklink;',
					 w2, w2, '', 'WorkLink', null, null, this.getTagsForStencil(gn, 'worklink', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.workdocs;',
					 w2, w2, '', 'WorkDocs', null, null, this.getTagsForStencil(gn, 'workdocs', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4GameTechPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#5A30B5;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#945DF2;gradientDirection=north;fillColor=#5A30B5;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service game development ';
		
		this.addPaletteFunctions('aws4Game Tech', 'AWS / Game Tech', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.game_tech2;',
					 w2, w2, '', 'Game Tech', null, null, this.getTagsForStencil(gn, 'game tech', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.gamelift;',
					 w2, w2, '', 'GameLift', null, null, this.getTagsForStencil(gn, 'gamelift', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.lumberyard;',
					 w2, w2, '', 'Lumberyard', null, null, this.getTagsForStencil(gn, 'lumberyard', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4InternetOfThingsPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#277116;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#60A337;gradientDirection=north;fillColor=#277116;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service internet of things iot ';
		
		this.addPaletteFunctions('aws4Internet of Things', 'AWS / Internet of Things', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.internet_of_things;',
					 w2, w2, '', 'Internet of Things', null, null, this.getTagsForStencil(gn, '', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.freertos;',
					 w2, w2, '', 'FreeRTOS', null, null, this.getTagsForStencil(gn, 'freertos', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iot_1click;',
					 w2, w2, '', '1Click', null, null, this.getTagsForStencil(gn, '1click', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iot_analytics;',
					 w2, w2, '', 'Analytics', null, null, this.getTagsForStencil(gn, 'analytics', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iot_button;',
					 w2, w2, '', 'Button', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iot_core;',
					 w2, w2, '', 'Core', null, null, this.getTagsForStencil(gn, 'core', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iot_device_defender;',
					 w2, w2, '', 'Device Defender', null, null, this.getTagsForStencil(gn, 'device defender', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iot_device_management;',
					 w2, w2, '', 'Device Management', null, null, this.getTagsForStencil(gn, 'device management', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iot_events;',
					 w2, w2, '', 'Events', null, null, this.getTagsForStencil(gn, 'events', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.greengrass;',
					 w2, w2, '', 'Greengrass', null, null, this.getTagsForStencil(gn, 'greengrass', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iot_sitewise;',
					 w2, w2, '', 'SiteWise', null, null, this.getTagsForStencil(gn, 'sitewise', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.iot_things_graph;',
					 w2, w2, '', 'Graph', null, null, this.getTagsForStencil(gn, 'graph', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'iot_analytics_channel;',
					 s * 65, s * 78, '', 'Channel', null, null, this.getTagsForStencil(gn, 'analytics channel', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'data_set;',
					 s * 63, s * 78, '', 'Data Set', null, null, this.getTagsForStencil(gn, 'data set', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'iot_analytics_data_store;',
					 s * 54, s * 78, '', 'Data Store', null, null, this.getTagsForStencil(gn, 'analytics data store', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'iot_analytics_pipeline;',
					 s * 78, s * 42, '', 'Pipeline', null, null, this.getTagsForStencil(gn, 'analytics pipeline', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'notebook;',
					 s * 68, s * 78, '', 'Notebook', null, null, this.getTagsForStencil(gn, 'notebook', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'connector;',
					 s * 78, s * 29, '', 'Connector', null, null, this.getTagsForStencil(gn, 'notebook', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'action;',
					 s * 78, s * 78, '', 'Action', null, null, this.getTagsForStencil(gn, 'action', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'actuator;',
					 s * 72, s * 78, '', 'Actuator', null, null, this.getTagsForStencil(gn, 'actuator', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'alexa_enabled_device;',
					 s * 72, s * 78, '', 'Alexa Voice Service', null, null, this.getTagsForStencil(gn, 'alexa voice service', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'alexa_skill;',
					 s * 78, s * 78, '', 'Alexa Skill', null, null, this.getTagsForStencil(gn, 'alexa skill', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'alexa_skill;',
					 s * 78, s * 78, '', 'Alexa-Enabled Device', null, null, this.getTagsForStencil(gn, 'alexa enabled device', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'bank;',
					 s * 78, s * 78, '', 'Bank', null, null, this.getTagsForStencil(gn, 'bank', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'bycicle;',
					 s * 78, s * 78, '', 'Bycicle', null, null, this.getTagsForStencil(gn, 'bycicle', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'camera;',
					 s * 78, s * 78, '', 'Camera', null, null, this.getTagsForStencil(gn, 'camera', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'car;',
					 s * 78, s * 78, '', 'Car', null, null, this.getTagsForStencil(gn, 'car', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'cart;',
					 s * 78, s * 78, '', 'Cart', null, null, this.getTagsForStencil(gn, 'cart', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'certificate_manager;',
					 s * 59, s * 78, '', 'Certificate', null, null, this.getTagsForStencil(gn, 'certificate manager', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'coffee_pot;',
					 s * 78, s * 78, '', 'Coffee Pot', null, null, this.getTagsForStencil(gn, 'coffee pot', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'desired_state;',
					 s * 78, s * 78, '', 'Desired State', null, null, this.getTagsForStencil(gn, 'desired state', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'iot_device_gateway;',
					 s * 78, s * 78, '', 'Device Gateway', null, null, this.getTagsForStencil(gn, 'device gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'iot_device_jobs_resource;',
					 s * 64, s * 78, '', 'Device Jobs', null, null, this.getTagsForStencil(gn, 'device jobs', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'door_lock;',
					 s * 78, s * 78, '', 'Door Lock', null, null, this.getTagsForStencil(gn, 'door lock', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'echo;',
					 s * 41, s * 78, '', 'Echo', null, null, this.getTagsForStencil(gn, 'echo', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'factory;',
					 s * 78, s * 78, '', 'Factory', null, null, this.getTagsForStencil(gn, 'factory', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'firetv;',
					 s * 78, s * 55, '', 'Fire TV', null, null, this.getTagsForStencil(gn, 'fire tv', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'firetv_stick;',
					 s * 78, s * 34, '', 'Fire TV Stick', null, null, this.getTagsForStencil(gn, 'fire tv stick', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'generic;',
					 s * 78, s * 78, '', 'Generic', null, null, this.getTagsForStencil(gn, 'generic', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'hardware_board;',
					 s * 78, s * 78, '', 'Hardware Board', null, null, this.getTagsForStencil(gn, 'hardware board', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'house;',
					 s * 78, s * 78, '', 'House', null, null, this.getTagsForStencil(gn, 'house', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'http2_protocol;',
					 s * 78, s * 78, '', 'HTTP2 protocol', null, null, this.getTagsForStencil(gn, 'http2 protocol', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'http_protocol;',
					 s * 78, s * 78, '', 'HTTP protocol', null, null, this.getTagsForStencil(gn, 'http protocol', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'lambda_function;',
					 s * 78, s * 78, '', 'Lambda Function', null, null, this.getTagsForStencil(gn, 'lambda function', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'lightbulb;',
					 s * 78, s * 78, '', 'Lightbulb', null, null, this.getTagsForStencil(gn, 'lightbulb', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'medical_emergency;',
					 s * 78, s * 78, '', 'Medical Emergency', null, null, this.getTagsForStencil(gn, 'medical emergency', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'mqtt_protocol;',
					 s * 78, s * 78, '', 'MQTT Protocol', null, null, this.getTagsForStencil(gn, 'mqtt protocol', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'iot_over_the_air_update;',
					 s * 78, s * 78, '', 'Over-The-Air Update', null, null, this.getTagsForStencil(gn, 'over the air update', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'police_emergency;',
					 s * 78, s * 78, '', 'Police Emergency', null, null, this.getTagsForStencil(gn, 'police emergency', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'policy;',
					 s * 78, s * 67, '', 'Policy', null, null, this.getTagsForStencil(gn, 'policy', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'reported_state;',
					 s * 78, s * 78, '', 'Reported State', null, null, this.getTagsForStencil(gn, 'reported state', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rule;',
					 s * 46, s * 78, '', 'Rule', null, null, this.getTagsForStencil(gn, 'rule', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'sensor;',
					 s * 72, s * 78, '', 'Sensor', null, null, this.getTagsForStencil(gn, 'sensor', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'servo;',
					 s * 78, s * 56, '', 'Servo', null, null, this.getTagsForStencil(gn, 'servo', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'shadow;',
					 s * 78, s * 77, '', 'Shadow', null, null, this.getTagsForStencil(gn, 'shadow', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'simulator;',
					 s * 71, s * 78, '', 'Simulator', null, null, this.getTagsForStencil(gn, 'simulator', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'thermostat;',
					 s * 78, s * 78, '', 'Thermostat', null, null, this.getTagsForStencil(gn, 'thermostat', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'topic_2;',
					 s * 53, s * 78, '', 'Topic', null, null, this.getTagsForStencil(gn, 'topic', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'travel;',
					 s * 78, s * 78, '', 'Travel', null, null, this.getTagsForStencil(gn, 'travel', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'utility;',
					 s * 78, s * 78, '', 'Utility', null, null, this.getTagsForStencil(gn, 'utility', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'windfarm;',
					 s * 78, s * 78, '', 'Windfarm', null, null, this.getTagsForStencil(gn, 'windfarm', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4MachineLearningPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#116D5B;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#4AB29A;gradientDirection=north;fillColor=#116D5B;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service machine learning ';
		
		this.addPaletteFunctions('aws4Machine Learning', 'AWS / Machine Learning', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.machine_learning;',
					 w2, w2, '', 'Machine Learning', null, null, this.getTagsForStencil(gn, 'machine learning', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.augmented_ai;',
					 w2, w2, '', 'Augmented AI', null, null, this.getTagsForStencil(gn, 'augmented ai', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.codeguru_2;',
					 w2, w2, '', 'CodeGuru', null, null, this.getTagsForStencil(gn, 'codeguru', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.comprehend;',
					 w2, w2, '', 'Comprehend', null, null, this.getTagsForStencil(gn, 'comprehend', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.deepcomposer;',
					 w2, w2, '', 'DeepComposer', null, null, this.getTagsForStencil(gn, 'deepcomposer', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elastic_inference_2;',
					 w2, w2, '', 'Elastic Inference', null, null, this.getTagsForStencil(gn, 'elastic inference', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.forecast;',
					 w2, w2, '', 'Forecast', null, null, this.getTagsForStencil(gn, 'forecast', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.fraud_detector;',
					 w2, w2, '', 'Fraud Detector', null, null, this.getTagsForStencil(gn, 'fraud detector', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.kendra;',
					 w2, w2, '', 'Kendra', null, null, this.getTagsForStencil(gn, 'kendra', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.neuron_ml_sdk;',
					 w2, w2, '', 'Neuron ML SDK', null, null, this.getTagsForStencil(gn, 'neuron ml sdk software development kit', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.lex;',
					 w2, w2, '', 'Lex', null, null, this.getTagsForStencil(gn, 'lex', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.personalize;',
					 w2, w2, '', 'Personalize', null, null, this.getTagsForStencil(gn, 'personalize', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.polly;',
					 w2, w2, '', 'Polly', null, null, this.getTagsForStencil(gn, 'polly', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.rekognition_2;',
					 w2, w2, '', 'Rekognition', null, null, this.getTagsForStencil(gn, 'rekognition', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.sagemaker;',
					 w2, w2, '', 'SageMaker', null, null, this.getTagsForStencil(gn, 'sagemaker', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.sagemaker_ground_truth;',
					 w2, w2, '', 'SageMaker Ground Truth', null, null, this.getTagsForStencil(gn, 'sagemaker ground truth', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.textract;',
					 w2, w2, '', 'Textract', null, null, this.getTagsForStencil(gn, 'textract', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.transcribe;',
					 w2, w2, '', 'Transcribe', null, null, this.getTagsForStencil(gn, 'transcribe', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.translate;',
					 w2, w2, '', 'Translate', null, null, this.getTagsForStencil(gn, 'translate', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.apache_mxnet_on_aws;',
					 w2, w2, '', 'Apache MXNet on AWS', null, null, this.getTagsForStencil(gn, 'apache mxnet on aws', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.deep_learning_amis;',
					 w2, w2, '', 'Deep Learning AMIs', null, null, this.getTagsForStencil(gn, 'deep learning amis', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.deeplens;',
					 w2, w2, '', 'DeepLens', null, null, this.getTagsForStencil(gn, 'deeplens', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.deepracer;',
					 w2, w2, '', 'DeepRacer', null, null, this.getTagsForStencil(gn, 'deepracer', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.tensorflow_on_aws;',
					 w2, w2, '', 'TensorFlow on AWS', null, null, this.getTagsForStencil(gn, 'tensorflow on aws', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.torchserve;',
					 w2, w2, '', 'TorchServe', null, null, this.getTagsForStencil(gn, 'torchserve', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.deep_learning_containers;',
					 w2, w2, '', 'Deep Learning Containers', null, null, this.getTagsForStencil(gn, 'deep learning containers', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'rekognition_image;',
					 s * 77, s * 78, '', 'Rekognition image', null, null, this.getTagsForStencil(gn, 'rekognition image', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rekognition_video;',
					 s * 77, s * 78, '', 'Rekognition video', null, null, this.getTagsForStencil(gn, 'rekognition video', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'sagemaker_model;',
					 s * 78, s * 78, '', 'Model', null, null, this.getTagsForStencil(gn, 'sagemaker model', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'sagemaker_notebook;',
					 s * 68, s * 78, '', 'Notebook', null, null, this.getTagsForStencil(gn, 'sagemaker notebook', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'sagemaker_train;',
					 s * 78, s * 65, '', 'Train', null, null, this.getTagsForStencil(gn, 'sagemaker train', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4ManagementGovernancePalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#BC1356;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F34482;gradientDirection=north;fillColor=#BC1356;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service management governance ';
		
		this.addPaletteFunctions('aws4Management Governance', 'AWS / Management & Governance', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.management_and_governance;',
					 w2, w2, '', 'Management & Governance', null, null, this.getTagsForStencil(gn, 'management and governance', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloudwatch_2;',
					 w2, w2, '', 'CloudWatch', null, null, this.getTagsForStencil(gn, 'cloudwatch', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.app_config;',
					 w2, w2, '', 'App Config', null, null, this.getTagsForStencil(gn, 'app config', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.app_wizard;',
					 w2, w2, '', 'App Wizard', null, null, this.getTagsForStencil(gn, 'app wizard', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.application_auto_scaling;',
					 w2, w2, '', 'Application Auto Scaling', null, null, this.getTagsForStencil(gn, 'app application auto scaling', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.autoscaling;',
					 w2, w2, '', 'Auto Scaling', null, null, this.getTagsForStencil(gn, 'auto scaling', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.backint_agent;',
					 w2, w2, '', 'Backint Agent', null, null, this.getTagsForStencil(gn, 'backint agent', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.chatbot;',
					 w2, w2, '', 'Chatbot', null, null, this.getTagsForStencil(gn, 'chatbot', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloudformation;',
					 w2, w2, '', 'CloudFormation', null, null, this.getTagsForStencil(gn, 'cloudformation', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloudtrail;',
					 w2, w2, '', 'CloudTrail', null, null, this.getTagsForStencil(gn, 'cloudtrail', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.codeguru;',
					 w2, w2, '', 'CodeGuru', null, null, this.getTagsForStencil(gn, 'codeguru', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.command_line_interface;',
					 w2, w2, '', 'Command Line Interface', null, null, this.getTagsForStencil(gn, 'command line interface', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.compute_optimizer;',
					 w2, w2, '', 'Compute Optimizer', null, null, this.getTagsForStencil(gn, 'compute optimizer', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.config;',
					 w2, w2, '', 'Config', null, null, this.getTagsForStencil(gn, 'config', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.license_manager;',
					 w2, w2, '', 'License Manager', null, null, this.getTagsForStencil(gn, 'license manager', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.managed_services;',
					 w2, w2, '', 'Managed Services', null, null, this.getTagsForStencil(gn, 'managed services', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.management_console;',
					 w2, w2, '', 'Management Console', null, null, this.getTagsForStencil(gn, 'management console', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.opsworks;',
					 w2, w2, '', 'OpsWorks', null, null, this.getTagsForStencil(gn, 'opsworks', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.organizations;',
					 w2, w2, '', 'Organizations', null, null, this.getTagsForStencil(gn, 'organizations', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.personal_health_dashboard;',
					 w2, w2, '', 'Personal Health Dashboard', null, null, this.getTagsForStencil(gn, 'personal health dashboard', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.service_catalog;',
					 w2, w2, '', 'Service Catalog', null, null, this.getTagsForStencil(gn, 'service catalog', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.systems_manager;',
					 w2, w2, '', 'Systems Manager', null, null, this.getTagsForStencil(gn, 'systems manager', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.trusted_advisor;',
					 w2, w2, '', 'Trusted Advisor', null, null, this.getTagsForStencil(gn, 'trusted advisor', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.well_architect_tool;',
					 w2, w2, '', 'Well-Architected Tool', null, null, this.getTagsForStencil(gn, 'well architected tool', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.control_tower;',
					 w2, w2, '', 'Control Tower', null, null, this.getTagsForStencil(gn, 'control tower', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'alarm;',
					 s * 78, s * 78, '', 'Alarm', null, null, this.getTagsForStencil(gn, 'cloudwatch alarm', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'event_event_based;',
					 s * 78, s * 78, '', 'Event (Event-Based)', null, null, this.getTagsForStencil(gn, 'cloudwatch event based', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'event_time_based;',
					 s * 78, s * 78, '', 'Event (Time-Based)', null, null, this.getTagsForStencil(gn, 'cloudwatch event time based', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'rule_2;',
					 s * 78, s * 76, '', 'Rule', null, null, this.getTagsForStencil(gn, 'cloudwatch rule', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'change_set;',
					 s * 65, s * 78, '', 'Change Set', null, null, this.getTagsForStencil(gn, 'cloudformation change set', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'stack;',
					 s * 78, s * 76, '', 'Stack', null, null, this.getTagsForStencil(gn, 'cloudformation stack', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'template;',
					 s * 65, s * 78, '', 'Template', null, null, this.getTagsForStencil(gn, 'cloudformation template', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'opsworks_apps;',
					 s * 78, s * 78, '', 'Apps', null, null, this.getTagsForStencil(gn, 'opsworks apps applications', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'deployments;',
					 s * 65, s * 78, '', 'Deployments', null, null, this.getTagsForStencil(gn, 'opsworks deployments', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'instances_2;',
					 s * 78, s * 78, '', 'Instances', null, null, this.getTagsForStencil(gn, 'opsworks instances', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'layers;',
					 s * 78, s * 78, '', 'Layers', null, null, this.getTagsForStencil(gn, 'opsworks layers', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'logs;',
					 s * 78, s * 58, '', 'Logs', null, null, this.getTagsForStencil(gn, 'opsworks logs', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'monitoring;',
					 s * 78, s * 58, '', 'Monitoring', null, null, this.getTagsForStencil(gn, 'opsworks monitoring', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'opsworks_permissions;',
					 s * 54, s * 78, '', 'Permissions', null, null, this.getTagsForStencil(gn, 'opsworks permissions', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'resources;',
					 s * 68, s * 78, '', 'Resources', null, null, this.getTagsForStencil(gn, 'opsworks resources', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'stack2;',
					 s * 78, s * 78, '', 'Stack', null, null, this.getTagsForStencil(gn, 'stack', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'organizations_account;',
					 s * 74, s * 78, '', 'Account', null, null, this.getTagsForStencil(gn, 'organizations account', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'organizations_organizational_unit;',
					 s * 78, s * 67, '', 'Organizational Unit', null, null, this.getTagsForStencil(gn, 'organizations organizational unit', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'shield_shield_advanced;',
					 s * 70, s * 78, '', 'Shield Advanced', null, null, this.getTagsForStencil(gn, 'shield advanced', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'automation;',
					 s * 78, s * 78, '', 'Automation', null, null, this.getTagsForStencil(gn, 'systems manager automation', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'documents;',
					 s * 64, s * 78, '', 'Documents', null, null, this.getTagsForStencil(gn, 'systems manager documents', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'inventory;',
					 s * 78, s * 78, '', 'Inventory', null, null, this.getTagsForStencil(gn, 'systems manager inventory', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'maintenance_windows;',
					 s * 78, s * 78, '', 'Maintenance Windows', null, null, this.getTagsForStencil(gn, 'systems manager maintenance windows', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'parameter_store;',
					 s * 75, s * 78, '', 'Parameter Store', null, null, this.getTagsForStencil(gn, 'systems manager parameter store', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'patch_manager;',
					 s * 78, s * 78, '', 'Patch Manager', null, null, this.getTagsForStencil(gn, 'systems manager patch manager', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'run_command;',
					 s * 78, s * 55, '', 'Run Command', null, null, this.getTagsForStencil(gn, 'systems manager run command', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'state_manager;',
					 s * 78, s * 78, '', 'State Manager', null, null, this.getTagsForStencil(gn, 'systems manager state', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'checklist;',
					 s * 66, s * 78, '', 'Checklist', null, null, this.getTagsForStencil(gn, 'trusted advisor checklist', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'checklist_cost;',
					 s * 78, s * 78, '', 'Checklist Cost', null, null, this.getTagsForStencil(gn, 'trusted advisor checklist cost', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'checklist_fault_tolerant;',
					 s * 78, s * 77, '', 'Checklist Fault Tolerant', null, null, this.getTagsForStencil(gn, 'trusted advisor fault tolerant', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'checklist_performance;',
					 s * 78, s * 78, '', 'Checklist Performance', null, null, this.getTagsForStencil(gn, 'trusted advisor checklist performance', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'checklist_security;',
					 s * 78, s * 78, '', 'Checklist Security', null, null, this.getTagsForStencil(gn, 'trusted advisor checklist security', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'systems_manager_opscenter;',
					 s * 78, s * 78, '', 'OpsCenter', null, null, this.getTagsForStencil(gn, 'opscenter', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4MediaServicesPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#D05C17;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F78E04;gradientDirection=north;fillColor=#D05C17;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service media services ';
		
		this.addPaletteFunctions('aws4Media Services', 'AWS / Media Services', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental;',
					 w2, w2, '', 'Appliances & Software', null, null, this.getTagsForStencil(gn, 'appliances software', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.media_services;',
					 w2, w2, '', 'Media Services', null, null, this.getTagsForStencil(gn, 'media services', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elastic_transcoder;',
					 w2, w2, '', 'Elastic Transcoder', null, null, this.getTagsForStencil(gn, 'elastic transcoder', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.kinesis_video_streams;',
					 w2, w2, '', 'Kinesis Video Streams', null, null, this.getTagsForStencil(gn, 'kinesis video streams', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental_mediaconnect;',
					 w2, w2, '', 'Elemental MediaConnect', null, null, this.getTagsForStencil(gn, 'elemental mediaconnect', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental_mediaconvert;',
					 w2, w2, '', 'Elemental MediaConvert', null, null, this.getTagsForStencil(gn, 'elemental mediaconvert', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental_medialive;',
					 w2, w2, '', 'Elemental MediaLive', null, null, this.getTagsForStencil(gn, 'elemental medialive', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental_mediapackage;',
					 w2, w2, '', 'Elemental MediaPackage', null, null, this.getTagsForStencil(gn, 'elemental mediapackage', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental_mediastore;',
					 w2, w2, '', 'Elemental MediaStore', null, null, this.getTagsForStencil(gn, 'elemental mediastore', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental_mediatailor;',
					 w2, w2, '', 'Elemental MediaTailor', null, null, this.getTagsForStencil(gn, 'elemental mediatailor', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental;',
					 w2, w2, '', 'Elemental Conductor', null, null, this.getTagsForStencil(gn, 'elemental conductor', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental;',
					 w2, w2, '', 'Elemental Delta', null, null, this.getTagsForStencil(gn, 'elemental delta', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental;',
					 w2, w2, '', 'Elemental Live', null, null, this.getTagsForStencil(gn, 'elemental live', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental;',
					 w2, w2, '', 'Elemental Server', null, null, this.getTagsForStencil(gn, 'elemental server', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.interactive_video;',
					 w2, w2, '', 'Interactive Video', null, null, this.getTagsForStencil(gn, 'interactive video', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elemental_link;',
					 w2, w2, '', 'Elemental Link', null, null, this.getTagsForStencil(gn, 'elemental link', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4MigrationTransferPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#116D5B;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#4AB29A;gradientDirection=north;fillColor=#116D5B;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service migration transfer ';
		
		this.addPaletteFunctions('aws4Migration Transfer', 'AWS / Migration & Transfer', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.migration_and_transfer;',
					 w2, w2, '', 'Migration & Transfer', null, null, this.getTagsForStencil(gn, 'migration and transfer', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.application_discovery_service;',
					 w2, w2, '', 'Application Discovery Service', null, null, this.getTagsForStencil(gn, 'application discovery service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.database_migration_service;',
					 w2, w2, '', 'Database Migration Service', null, null, this.getTagsForStencil(gn, 'db database migration service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.datasync;',
					 w2, w2, '', 'DataSync', null, null, this.getTagsForStencil(gn, 'datasync', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.migration_hub;',
					 w2, w2, '', 'Migration Hub', null, null, this.getTagsForStencil(gn, 'migration hub', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.server_migration_service;',
					 w2, w2, '', 'Server Migration Service', null, null, this.getTagsForStencil(gn, 'server migration service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.snowball;',
					 w2, w2, '', 'Snowball', null, null, this.getTagsForStencil(gn, 'snowball', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.snowball_edge;',
					 w2, w2, '', 'Snowball Edge', null, null, this.getTagsForStencil(gn, 'snowball edge', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.snowmobile;',
					 w2, w2, '', 'Snowmobile', null, null, this.getTagsForStencil(gn, 'snowmobile', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloudendure_migration;',
					 w2, w2, '', 'CloudEndure Migration', null, null, this.getTagsForStencil(gn, 'cloudendure migration', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.transfer_family;',
					 w2, w2, '', 'Transfer Family', null, null, this.getTagsForStencil(gn, 'transfer family', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.transfer_for_sftp;',
					 w2, w2, '', 'Transfer for SFTP', null, null, this.getTagsForStencil(gn, 'transfer for sftp', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'agent2;',
					 s * 78, s * 78, '', 'Agent', null, null, this.getTagsForStencil(gn, 'agent', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'transfer_for_ftp_resource;',
					 s * 76, s * 78, '', 'FTP', null, null, this.getTagsForStencil(gn, 'transfer for ftp resource', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'transfer_for_ftps_resource;',
					 s * 76, s * 78, '', 'FTPS', null, null, this.getTagsForStencil(gn, 'transfer for ftps resource', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'transfer_for_sftp_resource;',
					 s * 76, s * 78, '', 'SFTP', null, null, this.getTagsForStencil(gn, 'transfer for sftp resource', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4MobilePalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#C7131F;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F54749;gradientDirection=north;fillColor=#C7131F;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service mobile ';
		
		this.addPaletteFunctions('aws4Mobile', 'AWS / Mobile', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.mobile;',
					 w2, w2, '', 'Mobile', null, null, this.getTagsForStencil(gn, 'mobile', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.api_gateway;',
					 w2, w2, '', 'API Gateway', null, null, this.getTagsForStencil(gn, 'api application programming interface gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.pinpoint;',
					 w2, w2, '', 'Pinpoint', null, null, this.getTagsForStencil(gn, 'pinpoint', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.amplify;',
					 w2, w2, '', 'Amplify', null, null, this.getTagsForStencil(gn, 'amplify', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.appsync;',
					 w2, w2, '', 'AppSync', null, null, this.getTagsForStencil(gn, 'appsync', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.device_farm;',
					 w2, w2, '', 'Device Farm', null, null, this.getTagsForStencil(gn, 'device farm', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.pinpoint_journey;',
					 w2, w2, '', 'Pinpoint Journey', null, null, this.getTagsForStencil(gn, 'pinpoint journey', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'endpoint;',
					 s * 78, s * 78, '', 'Endpoint', null, null, this.getTagsForStencil(gn, 'endpoint', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4NetworkContentDeliveryPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#5A30B5;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#945DF2;gradientDirection=north;fillColor=#5A30B5;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service netowrk content delivery ';
		
		this.addPaletteFunctions('aws4Network Content Delivery', 'AWS / Network & Content Delivery', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.networking_and_content_delivery;',
					 w2, w2, '', 'Networking and Content Delivery', null, null, this.getTagsForStencil(gn, 'networking and content delivery', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.api_gateway;',
					 w2, w2, '', 'API Gateway', null, null, this.getTagsForStencil(gn, 'api application programming interface gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloud_directory;',
					 w2, w2, '', 'Cloud Directory', null, null, this.getTagsForStencil(gn, 'cloud directory', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloudfront;',
					 w2, w2, '', 'CloudFront', null, null, this.getTagsForStencil(gn, 'cloudfront', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.route_53;',
					 w2, w2, '', 'Route 53', null, null, this.getTagsForStencil(gn, 'route 53', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.vpc_privatelink;',
					 w2, w2, '', 'PrivateLink', null, null, this.getTagsForStencil(gn, 'privatelink', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.vpc;',
					 w2, w2, '', 'VPC', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.app_mesh;',
					 w2, w2, '', 'App Mesh', null, null, this.getTagsForStencil(gn, 'app application mesh', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.client_vpn;',
					 w2, w2, '', 'Client VPN', null, null, this.getTagsForStencil(gn, 'client vpn virtual private network', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.site_to_site_vpn;',
					 w2, w2, '', 'Site-to-Site VPN', null, null, this.getTagsForStencil(gn, 'site to site s2s vpn virtual private network', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elastic_load_balancing;',
					 w2, w2, '', 'Elastic Load Balancing', null, null, this.getTagsForStencil(gn, 'elastic load balancing', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloud_map;',
					 w2, w2, '', 'Cloud Map', null, null, this.getTagsForStencil(gn, 'cloud map', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.direct_connect;',
					 w2, w2, '', 'Direct Connect', null, null, this.getTagsForStencil(gn, 'direct connect', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.global_accelerator;',
					 w2, w2, '', 'Global Accelerator', null, null, this.getTagsForStencil(gn, 'global accelerator', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.transit_gateway;',
					 w2, w2, '', 'Transit Gateway', null, null, this.getTagsForStencil(gn, 'transit gateway', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'endpoint;',
					 s * 78, s * 78, '', 'Endpoint', null, null, this.getTagsForStencil(gn, 'endpoint', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'download_distribution;',
					 s * 78, s * 78, '', 'Download Distribution', null, null, this.getTagsForStencil(gn, 'download distribution', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'edge_location;',
					 s * 78, s * 78, '', 'Edge Location', null, null, this.getTagsForStencil(gn, 'edge location', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'streaming_distribution;',
					 s * 78, s * 78, '', 'Streaming Distribution', null, null, this.getTagsForStencil(gn, 'streaming distribution', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'hosted_zone;',
					 s * 78, s * 77, '', 'Hosted Zone', null, null, this.getTagsForStencil(gn, 'hosted zone', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'route_table;',
					 s * 78, s * 76, '', 'Route Table', null, null, this.getTagsForStencil(gn, 'route table', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'customer_gateway;',
					 s * 78, s * 78, '', 'Router', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud customer gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'elastic_network_adapter;',
					 s * 78, s * 78, '', 'Elastic Network Adapter', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud elastic network adapter', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'elastic_network_interface;',
					 s * 78, s * 78, '', 'Elastic Network Interface', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud elastic network interface', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'endpoints;',
					 s * 78, s * 78, '', 'Endpoints', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud endpoints', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'flow_logs;',
					 s * 78, s * 78, '', 'Flow Logs', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud flow logs', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'gateway;',
					 s * 76, s * 78, '', 'Gateway', null, null, this.getTagsForStencil(gn, 'gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'internet_gateway;',
					 s * 78, s * 78, '', 'Internet Gateway', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud internet gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'mesh;',
					 s * 78, s * 77, '', 'Mesh', null, null, this.getTagsForStencil(gn, 'mesh', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'nat_gateway;',
					 s * 78, s * 78, '', 'NAT Gateway', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud nat gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'namespace;',
					 s * 78, s * 78, '', 'Namespace', null, null, this.getTagsForStencil(gn, 'namespace', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'network_access_control_list;',
					 s * 78, s * 78, '', 'Network Access Control List', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud network access control list', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'peering;',
					 s * 78, s * 78, '', 'Peering Connection', null, null, this.getTagsForStencil(gn, 'peering connection', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'resource;',
					 s * 76, s * 78, '', 'Resource', null, null, this.getTagsForStencil(gn, 'resource', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'service;',
					 s * 78, s * 76, '', 'Service', null, null, this.getTagsForStencil(gn, 'service', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'application_load_balancer;',
					 s * 78, s * 78, '', 'Application Load Balancer', null, null, this.getTagsForStencil(gn, 'application load balancer', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'classic_load_balancer;',
					 s * 78, s * 78, '', 'Classic Load Balancer', null, null, this.getTagsForStencil(gn, 'classic load balancer', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'network_load_balancer;',
					 s * 78, s * 78, '', 'Network Load Balancer', null, null, this.getTagsForStencil(gn, 'network load balancer', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'router;',
					 s * 78, s * 78, '', 'Router', null, null, this.getTagsForStencil(gn, 'router', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'virtual_gateway;',
					 s * 78, s * 78, '', 'Virtual Gateway', null, null, this.getTagsForStencil(gn, 'virtual gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'virtual_node;',
					 s * 78, s * 78, '', 'Virtual Node', null, null, this.getTagsForStencil(gn, 'virtual node', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'virtual_router;',
					 s * 78, s * 78, '', 'Virtual Router', null, null, this.getTagsForStencil(gn, 'virtual router', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'virtual_service;',
					 s * 78, s * 74, '', 'Virtual Service', null, null, this.getTagsForStencil(gn, 'virtual service', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'vpn_connection;',
					 s * 70, s * 78, '', 'VPN Connection', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud vpn network connection', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'vpn_gateway;',
					 s * 78, s * 78, '', 'VPN Gateway', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud vpn network gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'vpc_traffic_mirroring;',
					 s * 78, s * 78, '', 'Traffic Mirroring', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud traffic mirroring', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4QuantumTechnologiesPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#D05C17;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F78E04;gradientDirection=north;fillColor=#D05C17;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service quantum technologies ';
		
		this.addPaletteFunctions('aws4Quantum Technologies', 'AWS / Quantum Technologies', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.quantum_technologies;',
					 w2, w2, '', 'Quantum Technologies', null, null, this.getTagsForStencil(gn, 'quantum technologies', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.braket;',
					 w2, w2, '', 'Braket', null, null, this.getTagsForStencil(gn, 'braket', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4RoboticsPalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#BE0917;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#FE5151;gradientDirection=north;fillColor=#BE0917;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service robotics ';
		
		this.addPaletteFunctions('aws4Robotics', 'AWS / Robotics', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.robotics;',
					 w2, w2, '', 'Robotics', null, null, this.getTagsForStencil(gn, 'robotics', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.robomaker;',
					 w2, w2, '', 'RoboMaker', null, null, this.getTagsForStencil(gn, 'robomaker', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'simulation;',
					 s * 78, s * 64, '', 'Simulation', null, null, this.getTagsForStencil(gn, 'simulation', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'fleet_management;',
					 s * 78, s * 78, '', 'Fleet Management', null, null, this.getTagsForStencil(gn, 'fleet management', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'development_environment;',
					 s * 78, s * 71, '', 'Development Environment', null, null, this.getTagsForStencil(gn, 'development environment', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'cloud_extension_ros;',
					 s * 78, s * 78, '', 'Cloud Extensions ROS', null, null, this.getTagsForStencil(gn, 'cloud extension ros', dt).join(' '))
		]);
	};
	
	Sidebar.prototype.addAWS4SatellitePalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#2F29AF;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#517DFD;gradientDirection=north;fillColor=#2F29AF;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web satellite ';
		
		this.addPaletteFunctions('aws4Satellite', 'AWS / Satellite', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.satellite;',
					 w2, w2, '', 'Satellite', null, null, this.getTagsForStencil(gn, 'satellite', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.ground_station;',
					 w2, w2, '', 'Ground Station', null, null, this.getTagsForStencil(gn, 'ground station', dt).join(' '))
		]);
	};
	
	Sidebar.prototype.addAWS4SecurityIdentityCompliancePalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#C7131F;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#F54749;gradientDirection=north;fillColor=#C7131F;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service security identity compliance ';
		
		this.addPaletteFunctions('aws4Security Identity Compliance', 'AWS / Security, Identity & Compliance', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.security_identity_and_compliance;',
					 w2, w2, '', 'Security Identity and Compliance', null, null, this.getTagsForStencil(gn, 'security identity and compliance', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloud_directory;',
					 w2, w2, '', 'Cloud Directory', null, null, this.getTagsForStencil(gn, 'cloud directory', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cognito;',
					 w2, w2, '', 'Cognito', null, null, this.getTagsForStencil(gn, 'cognito', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.detective;',
					 w2, w2, '', 'Detective', null, null, this.getTagsForStencil(gn, 'detective', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.guardduty;',
					 w2, w2, '', 'GuardDuty', null, null, this.getTagsForStencil(gn, 'guardduty guard duty', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.inspector;',
					 w2, w2, '', 'Inspector', null, null, this.getTagsForStencil(gn, 'inspector', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.macie;',
					 w2, w2, '', 'Macie', null, null, this.getTagsForStencil(gn, 'macie', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.artifact;',
					 w2, w2, '', 'Artifact', null, null, this.getTagsForStencil(gn, 'artifact', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.certificate_manager_3;',
					 w2, w2, '', 'Certificate Manager', null, null, this.getTagsForStencil(gn, 'certificate manager', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloudhsm;',
					 w2, w2, '', 'CloudHSM', null, null, this.getTagsForStencil(gn, 'cloudhsm cloud hsm', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.directory_service;',
					 w2, w2, '', 'Directory Service', null, null, this.getTagsForStencil(gn, 'directory service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.firewall_manager;',
					 w2, w2, '', 'Firewall Manager', null, null, this.getTagsForStencil(gn, 'firewall manager', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.identity_and_access_management;',
					 w2, w2, '', 'Identity & Access Management', null, null, this.getTagsForStencil(gn, 'identity and access management', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.key_management_service;',
					 w2, w2, '', 'Key Management Service', null, null, this.getTagsForStencil(gn, 'key management service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.resource_access_manager;',
					 w2, w2, '', 'Resource Access Manager', null, null, this.getTagsForStencil(gn, 'resource access manager', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.organizations;',
					 w2, w2, '', 'Organizations', null, null, this.getTagsForStencil(gn, 'organizations', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.secrets_manager;',
					 w2, w2, '', 'Secrets Manager', null, null, this.getTagsForStencil(gn, 'secrets manager', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.security_hub;',
					 w2, w2, '', 'Security Hub', null, null, this.getTagsForStencil(gn, 'security hub', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.shield;',
					 w2, w2, '', 'Shield', null, null, this.getTagsForStencil(gn, 'shield', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.single_sign_on;',
					 w2, w2, '', 'Single Sign-On', null, null, this.getTagsForStencil(gn, 'single sign on', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.waf;',
					 w2, w2, '', 'WAF', null, null, this.getTagsForStencil(gn, 'waf', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'access_analyzer;',
					 s * 78, s * 77, '', 'IAM Access Analyzer', null, null, this.getTagsForStencil(gn, 'access analyzer', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'ad_connector;',
					 s * 78, s * 73, '', 'AD Connector', null, null, this.getTagsForStencil(gn, 'ad connector', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'agent;',
					 s * 78, s * 74, '', 'Agent', null, null, this.getTagsForStencil(gn, 'agent', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'certificate_manager_2;',
					 s * 78, s * 72, '', 'Certificate Authority', null, null, this.getTagsForStencil(gn, 'certificate authority', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'addon;',
					 s * 78, s * 40, '', 'Add-on', null, null, this.getTagsForStencil(gn, 'identity and access management iam addon add on', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'sts;',
					 s * 78, s * 50, '', 'STS', null, null, this.getTagsForStencil(gn, 'identity and access management iam sts', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'sts_alternate;',
					 s * 62, s * 78, '', 'STS', null, null, this.getTagsForStencil(gn, 'identity and access management iam sts', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'data_encryption_key;',
					 s * 62, s * 78, '', 'Data Encryption Key', null, null, this.getTagsForStencil(gn, 'identity and access management iam data encryption key', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'encrypted_data;',
					 s * 62, s * 78, '', 'Encrypted Data', null, null, this.getTagsForStencil(gn, 'identity and access management iam encrypted data', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'long_term_security_credential;',
					 s * 78, s * 69, '', 'Long Term Security Credential', null, null, this.getTagsForStencil(gn, 'identity and access management iam long term security credential', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'mfa_token;',
					 s * 78, s * 78, '', 'MFA Token', null, null, this.getTagsForStencil(gn, 'identity and access management iam mfa token', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'permissions;',
					 s * 62, s * 78, '', 'Permissions', null, null, this.getTagsForStencil(gn, 'identity and access management iam permissions', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'role;',
					 s * 78, s * 44, '', 'Role', null, null, this.getTagsForStencil(gn, 'identity and access management iam role', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'temporary_security_credential;',
					 s * 77, s * 78, '', 'Temporary Security Credential', null, null, this.getTagsForStencil(gn, 'identity and access management iam temporary security credential', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'managed_ms_ad;',
					 s * 78, s * 77, '', 'Managed MS AD', null, null, this.getTagsForStencil(gn, 'managed ms ad', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'organizations_account;',
					 s * 74, s * 78, '', 'Organizations Account', null, null, this.getTagsForStencil(gn, 'organizations account', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'organizations_organizational_unit;',
					 s * 78, s * 67, '', 'Organizations Organizational Unit', null, null, this.getTagsForStencil(gn, 'organizations organizational unit', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'finding;',
					 s * 70, s * 78, '', 'Finding', null, null, this.getTagsForStencil(gn, 'finding', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'shield_shield_advanced;',
					 s * 70, s * 78, '', 'Shield Advanced', null, null, this.getTagsForStencil(gn, 'shield advanced', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'filtering_rule;',
					 s * 78, s * 78, '', 'Filtering Rule', null, null, this.getTagsForStencil(gn, 'filtering rule', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'simple_ad;',
					 s * 78, s * 77, '', 'Simple AD', null, null, this.getTagsForStencil(gn, 'simple ad', dt).join(' '))
		]);
	};

	Sidebar.prototype.addAWS4StoragePalette = function(s, w, h, w2, gn, sb)
	{
		var n = 'outlineConnect=0;fontColor=#232F3E;gradientColor=none;fillColor=#277116;strokeColor=none;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var n2 = 'points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;gradientColor=#60A337;gradientDirection=north;fillColor=#277116;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;' + mxConstants.STYLE_SHAPE + "=mxgraph.aws4.";
		var dt = 'aws amazon web service storage ';
		
		this.addPaletteFunctions('aws4Storage', 'AWS / Storage', false,
		[
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.storage;',
					 w2, w2, '', 'Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elastic_block_store;',
					 w2, w2, '', 'Elastic Block Store', null, null, this.getTagsForStencil(gn, 'elastic block store', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.elastic_file_system;',
					 w2, w2, '', 'Elastic File System', null, null, this.getTagsForStencil(gn, 'elastic file system', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.fsx;',
					 w2, w2, '', 'FSx', null, null, this.getTagsForStencil(gn, 'fsx', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.fsx_for_lustre;',
					 w2, w2, '', 'FSx for Lustre', null, null, this.getTagsForStencil(gn, 'fsx for lustre', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.fsx_for_windows_file_server;',
					 w2, w2, '', 'FSx for Windows File Server', null, null, this.getTagsForStencil(gn, 'fsx for windows file server', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.infrequent_access_storage_class;',
					 w2, w2, '', 'Infrequent Access Storage Class', null, null, this.getTagsForStencil(gn, 'infrequent access storage class', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.glacier;',
					 w2, w2, '', 'S3 Glacier', null, null, this.getTagsForStencil(gn, 's3 simple storage service glacier', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.s3;',
					 w2, w2, '', 'Simple Storage Service (S3)', null, null, this.getTagsForStencil(gn, 's3 simple storage service', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.backup;',
					 w2, w2, '', 'Backup', null, null, this.getTagsForStencil(gn, 'backup', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.snowball;',
					 w2, w2, '', 'Snowball', null, null, this.getTagsForStencil(gn, 'snowball', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.snowball_edge;',
					 w2, w2, '', 'Snowball Edge', null, null, this.getTagsForStencil(gn, 'snowball edge', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.snowmobile;',
					 w2, w2, '', 'Snowmobile', null, null, this.getTagsForStencil(gn, 'snowmobile', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.storage_gateway;',
					 w2, w2, '', 'Storage Gateway', null, null, this.getTagsForStencil(gn, 'storage gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.cloudendure_disaster_recovery;',
					 w2, w2, '', 'CloudEndure Disaster Recovery', null, null, this.getTagsForStencil(gn, 'cloudendure disaster recovery', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.efs_infrequentaccess;',
					 w2, w2, '', 'EFS InfrequentAccess', null, null, this.getTagsForStencil(gn, 'efs infrequent access', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.efs_standard;',
					 w2, w2, '', 'EFS Standard', null, null, this.getTagsForStencil(gn, 'efs standard', dt).join(' ')),
			 this.createVertexTemplateEntry(n2 + 'resourceIcon;resIcon=' + gn + '.snowcone;',
					 w2, w2, '', 'Snowcone', null, null, this.getTagsForStencil(gn, 'snowcone', dt).join(' ')),
					 
			 this.createVertexTemplateEntry(n + 'snapshot;',
					 s * 56, s * 78, '', 'Snapshot', null, null, this.getTagsForStencil(gn, 'snapshot', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'volume;',
					 s * 62, s * 78, '', 'Volume', null, null, this.getTagsForStencil(gn, 'volume', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'file_gateway;',
					 s * 69, s * 78, '', 'File Gateway', null, null, this.getTagsForStencil(gn, 'file gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'file_system;',
					 s * 78, s * 73, '', 'File System', null, null, this.getTagsForStencil(gn, 'file system', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'general_access_points;',
					 s * 65, s * 78, '', 'Access Points', null, null, this.getTagsForStencil(gn, 'access points', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'archive;',
					 s * 63, s * 78, '', 'Vault', null, null, this.getTagsForStencil(gn, 's3 simple storage service glacier archive', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'vault;',
					 s * 62, s * 78, '', 'Archive', null, null, this.getTagsForStencil(gn, 's3 simple storage service glacier vault', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'bucket;',
					 s * 75, s * 78, '', 'Bucket', null, null, this.getTagsForStencil(gn, 's3 simple storage service bucket', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'intelligent_tiering;',
					 s * 75, s * 78, '', 'Intelligent Tiering', null, null, this.getTagsForStencil(gn, 'intelligent tiering', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'standard_ia;',
					 s * 75, s * 78, '', 'Standard IA', null, null, this.getTagsForStencil(gn, 'standard ia', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'one_zone_ia;',
					 s * 75, s * 78, '', 'One Zone IA', null, null, this.getTagsForStencil(gn, 'one zone ia', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'glacier;',
					 s * 75, s * 78, '', 'Glacier', null, null, this.getTagsForStencil(gn, 'glacier', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'glacier_deep_archive;',
					 s * 75, s * 78, '', 'Glacier Deep Archive', null, null, this.getTagsForStencil(gn, 'glacier deep archive', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'bucket_with_objects;',
					 s * 75, s * 78, '', 'Bucket with Objects', null, null, this.getTagsForStencil(gn, 's3 simple storage service bucket with objects', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'replication;',
					 s * 76, s * 78, '', 'Replication', null, null, this.getTagsForStencil(gn, 'replication', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'replication_time_control;',
					 s * 76, s * 78, '', 'Replication Time Control', null, null, this.getTagsForStencil(gn, 'replication time control', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'object;',
					 s * 78, s * 78, '', 'Object', null, null, this.getTagsForStencil(gn, 's3 simple storage service object', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'import_export;',
					 s * 78, s * 61, '', 'Snowball Import Export', null, null, this.getTagsForStencil(gn, 'snowball import export', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'tape_gateway;',
					 s * 74, s * 78, '', 'Tape Gateway', null, null, this.getTagsForStencil(gn, 'tape gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'volume_gateway;',
					 s * 65, s * 78, '', 'Volume Gateway', null, null, this.getTagsForStencil(gn, 'volume gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'cached_volume;',
					 s * 62, s * 78, '', 'Cached Volume', null, null, this.getTagsForStencil(gn, 'storage gateway cached volume', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'non_cached_volume;',
					 s * 62, s * 78, '', 'Non-Cached Volume', null, null, this.getTagsForStencil(gn, 'storage gateway non cached volume', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'virtual_tape_library;',
					 s * 62, s * 78, '', 'Virtual Tape Library', null, null, this.getTagsForStencil(gn, 'storage gateway virtual tape library vtl', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'multiple_volumes_resource;',
					 s * 78, s * 60, '', 'Multiple Volumes', null, null, this.getTagsForStencil(gn, 'multiple volumes', dt).join(' ')),
			 this.createVertexTemplateEntry(n + 'vpc_access_points;',
					 s * 53, s * 78, '', 'VPC Access Points', null, null, this.getTagsForStencil(gn, 'vpc virtual private cloud access points', dt).join(' '))
			]);
	};
})();
