(function()
{
	Sidebar.prototype.addGCP2Palette = function()
	{
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Paths');
		this.addGCP2PathsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Zones');
		this.addGCP2ZonesPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Service Cards');
		this.addGCP2ServiceCardsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2User Device Cards');
		this.addGCP2UserDeviceCardsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Compute');
		this.addGCP2ComputePalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2API Management');
		this.addGCP2APIManagementPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Security');
		this.addGCP2SecurityPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Data Analytics');
		this.addGCP2DataAnalyticsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Data Transfer');
		this.addGCP2DataTransferPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Cloud AI');
		this.addGCP2CloudAIPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Internet of Things');
		this.addGCP2InternetOfThingsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Databases');
		this.addGCP2DatabasesPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Storage');
		this.addGCP2StoragePalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Management Tools');
		this.addGCP2ManagementToolsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Networking');
		this.addGCP2NetworkingPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Developer Tools');
		this.addGCP2DeveloperToolsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Expanded Product Cards');
		this.addGCP2ExpandedProductCardsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Product Cards');
		this.addGCP2ProductCardsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2General Icons');
		this.addGCP2GeneralIconsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons AI and Machine Learning');
		this.addGCP2IconsAIAndMachineLearningPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Compute');
		this.addGCP2IconsComputePalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Data Analytics');
		this.addGCP2IconsDataAnalyticsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Management Tools');
		this.addGCP2IconsManagementToolsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Networking');
		this.addGCP2IconsNetworkingPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Developer Tools');
		this.addGCP2IconsDeveloperToolsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons API Management');
		this.addGCP2IconsAPIManagementPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Internet of Things');
		this.addGCP2IconsInternetOfThingsPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Databases');
		this.addGCP2IconsDatabasesPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Storage');
		this.addGCP2IconsStoragePalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Security');
		this.addGCP2IconsSecurityPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Migration');
		this.addGCP2IconsMigrationPalette();
		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Hybrid and Multi Cloud');
		this.addGCP2IconsHybridAndMultiCloudPalette();
//		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Data Transfer');
//		this.addGCP2IconsDataTransferPalette();
//		this.setCurrentSearchEntryLibrary('gcp2', 'gcp2Icons Cloud AI');
//		this.addGCP2IconsCloudAIPalette();
		this.setCurrentSearchEntryLibrary();
	};
	
	Sidebar.prototype.addGCP2PathsPalette = function()
	{
		var s = 'edgeStyle=orthogonalEdgeStyle;fontSize=12;html=1;endArrow=blockThin;endFill=1;rounded=0;strokeWidth=2;endSize=4;startSize=4;';
		var dt = 'gcp google cloud platform path ';
		var fns = [];
		
		var fns = [
			this.createEdgeTemplateEntry(s + 'dashed=0;strokeColor=#4284F3;', 100, 0, '', 'Primary Path', null, dt + 'primary'),
			this.createEdgeTemplateEntry(s + 'dashed=1;dashPattern=1 3;strokeColor=#4284F3;', 100, 0, '', 'Optional Primary Path', null, dt + 'optional primary'),
			this.createEdgeTemplateEntry(s + 'dashed=0;strokeColor=#9E9E9E;', 100, 0, '', 'Secondary Path', null, dt + 'secondary'),
			this.createEdgeTemplateEntry(s + 'dashed=1;dashPattern=1 3;strokeColor=#9E9E9E;', 100, 0, '', 'Optional Secondary Path', null, dt + 'optional secondary'),
			this.createEdgeTemplateEntry(s + 'strokeColor=#34A853;dashed=0;', 100, 0, '', 'Success Status', null, dt + 'success status'),
			this.createEdgeTemplateEntry(s + 'strokeColor=#EA4335;dashed=0;', 100, 0, '', 'Failure Status', null, dt + 'failure status')
	 	];
		
		this.addPalette('gcp2Paths', 'GCP / Paths', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2ZonesPalette = function()
	{
		var sb = this;
		var s = 'sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[1,1,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];rounded=1;absoluteArcSize=1;arcSize=2;html=1;strokeColor=none;gradientColor=none;shadow=0;dashed=0;fontSize=12;fontColor=#9E9E9E;align=left;verticalAlign=top;spacing=10;spacingTop=-4;';
		var dt = 'gcp google cloud platform zone ';
		var gn = 'mxgraph.gcp2.zones';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(s + '', 
		    		120, 70, 'User 1', 'User 1 (Default)', null, null, this.getTagsForStencil(gn, '', dt + 'user').join(' ')),
		    this.createVertexTemplateEntry(s + 'fillColor=#F3E5F5;', 
		    		120, 150, 'Infrastructure\nSystem', 'Infrastructure System', null, null, this.getTagsForStencil(gn, '', dt + 'infrastructure system').join(' ')),
		    this.createVertexTemplateEntry(s + 'fillColor=#EFEBE9;', 
		    		120, 200, 'colo / dc /\non-premises', 'colo / dc / on-premises', null, null, this.getTagsForStencil(gn, '', dt + 'colo dc on premises').join(' ')),
		    this.createVertexTemplateEntry(s + 'fillColor=#F1F8E9;', 
		    		120, 70, 'System 1', 'System 1', null, null, this.getTagsForStencil(gn, '', dt + 'system').join(' ')),
		    this.createVertexTemplateEntry(s + 'fillColor=#FFEBEE;', 
		    		120, 70, 'External SaaS\nProviders', 'External SaaS Providers', null, null, this.getTagsForStencil(gn, '', dt + 'external saas providers').join(' ')),
		    this.createVertexTemplateEntry(s + 'fillColor=#FFF8E1;', 
		    		120, 70, 'External Data\nSources', 'External Data Sources', null, null, this.getTagsForStencil(gn, '', dt + 'external data sources').join(' ')),
		    this.createVertexTemplateEntry(s + 'fillColor=#E0F2F1;', 
		    		120, 75, 'External\nInfrastructure\n3<sup>rd</sup> Party', 'External Infrastructure 3rd party', null, null, this.getTagsForStencil(gn, '', dt + 'external infrastructure 3rd party').join(' ')),
		    this.createVertexTemplateEntry(s + 'fillColor=#E1F5FE;', 
		    		120, 75, 'External\nInfrastructure\n1<sup>st</sup> Party', 'External Infrastructure 1st party', null, null, this.getTagsForStencil(gn, '', dt + 'external infrastructure 1st party').join(' ')),
		    		
			this.addEntry(dt + 'project cloud service provider', function()
		   	{
			    var bg = new mxCell('Project Zone / Cloud Service Provider', new mxGeometry(0, 0, 530, 490), s + 'fillColor=#F6F6F6;');
		    	bg.vertex = true;
		    	
			    var zone1Cell = new mxCell('Logical Grouping of Services / Instances', 
			    		new mxGeometry(0, 0, 250, 180), s + 'fillColor=#E3F2FD;');
			    zone1Cell.geometry.relative = true;
			    zone1Cell.geometry.offset = new mxPoint(10, 50);
			    zone1Cell.vertex = true;
		    	bg.insert(zone1Cell);
			    
			    var zone2Cell = new mxCell('Zone', 
			    		new mxGeometry(0, 0, 230, 120), s + 'fillColor=#FFF3E0;');
			    zone2Cell.geometry.relative = true;
			    zone2Cell.geometry.offset = new mxPoint(10, 50);
			    zone2Cell.vertex = true;
			    zone1Cell.insert(zone2Cell);
			    
			    var zone3Cell = new mxCell('SubNetwork', 
			    		new mxGeometry(0, 0, 210, 60), s + 'fillColor=#EDE7F6;');
			    zone3Cell.geometry.relative = true;
			    zone3Cell.geometry.offset = new mxPoint(10, 50);
			    zone3Cell.vertex = true;
			    zone2Cell.insert(zone3Cell);
			    
			    var zone4Cell = new mxCell('Kubernetes cluster', 
			    		new mxGeometry(0, 0, 250, 120), s + 'fillColor=#FCE4EC;');
			    zone4Cell.geometry.relative = true;
			    zone4Cell.geometry.offset = new mxPoint(10, 240);
			    zone4Cell.vertex = true;
		    	bg.insert(zone4Cell);
			    
			    var zone5Cell = new mxCell('pod', 
			    		new mxGeometry(0, 0, 210, 60), s + 'fillColor=#E8F5E9;');
			    zone5Cell.geometry.relative = true;
			    zone5Cell.geometry.offset = new mxPoint(10, 50);
			    zone5Cell.vertex = true;
			    zone4Cell.insert(zone5Cell);
			    
			    var zone6Cell = new mxCell('Account', 
			    		new mxGeometry(0, 0, 250, 60), s + 'fillColor=#E8EAF6;');
			    zone6Cell.geometry.relative = true;
			    zone6Cell.geometry.offset = new mxPoint(10, 370);
			    zone6Cell.vertex = true;
			    bg.insert(zone6Cell);
			    
			    var zone7Cell = new mxCell('Region', 
			    		new mxGeometry(0, 0, 250, 310), s + 'fillColor=#ECEFF1;');
			    zone7Cell.geometry.relative = true;
			    zone7Cell.geometry.offset = new mxPoint(270, 50);
			    zone7Cell.vertex = true;
		    	bg.insert(zone7Cell);
			    
			    var zone8Cell = new mxCell('Zone', 
			    		new mxGeometry(0, 0, 230, 250), s + 'fillColor=#FFF3E0;');
			    zone8Cell.geometry.relative = true;
			    zone8Cell.geometry.offset = new mxPoint(10, 50);
			    zone8Cell.vertex = true;
			    zone7Cell.insert(zone8Cell);
			    
			    var zone9Cell = new mxCell('Firewall', 
			    		new mxGeometry(0, 0, 210, 190), s + 'fillColor=#FBE9E7;');
			    zone9Cell.geometry.relative = true;
			    zone9Cell.geometry.offset = new mxPoint(10, 50);
			    zone9Cell.vertex = true;
			    zone8Cell.insert(zone9Cell);
			    
			    var zone10Cell = new mxCell('Instance Group', 
			    		new mxGeometry(0, 0, 190, 60), s + 'fillColor=#F9FBE7;');
			    zone10Cell.geometry.relative = true;
			    zone10Cell.geometry.offset = new mxPoint(10, 50);
			    zone10Cell.vertex = true;
			    zone9Cell.insert(zone10Cell);
			    
			    var zone11Cell = new mxCell('Replica Pool', 
			    		new mxGeometry(0, 0, 190, 60), s + 'fillColor=#E0F7FA;');
			    zone11Cell.geometry.relative = true;
			    zone11Cell.geometry.offset = new mxPoint(10, 120);
			    zone11Cell.vertex = true;
			    zone9Cell.insert(zone11Cell);
			    
			    var zone12Cell = new mxCell('Optional Component', 
			    		new mxGeometry(0, 0, 250, 60), 
			    		'rounded=1;absoluteArcSize=1;arcSize=2;html=1;strokeColor=none;gradientColor=none;shadow=0;dashed=1;strokeColor=#4284F3;fontSize=12;fontColor=#9E9E9E;align=left;verticalAlign=top;spacing=10;spacingTop=-4;fillColor=none;dashPattern=1 2;strokeWidth=2;');
			    zone12Cell.geometry.relative = true;
			    zone12Cell.geometry.offset = new mxPoint(270, 370);
			    zone12Cell.vertex = true;
			    bg.insert(zone12Cell);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Project Zone / Cloud Service Provider');
			}),
			
		    this.createVertexTemplateEntry('fillColor=#4DA1F5;strokeColor=none;shadow=1;gradientColor=none;fontSize=14;align=left;spacingLeft=50;fontColor=#ffffff;', 
		    		1000, 40, 'Architecture: App Engine and Cloud Endpoints', 'Title bar', null, null, this.getTagsForStencil(gn, '', dt + 'title bar').join(' ')),
		    this.createVertexTemplateEntry('strokeColor=none;shadow=0;gradientColor=none;fontSize=11;align=left;spacing=10;fontColor=#;9E9E9E;verticalAlign=top;spacingTop=100;',
		    		300, 350, 'Use this note to call out\nor clarify parts of a diagram', 'Note', null, null, this.getTagsForStencil(gn, '', dt + 'note').join(' ')),
		    		
			this.addEntry(dt + 'project', function()
		   	{
			    var bg = new mxCell('<b>Google </b>Cloud Platform', new mxGeometry(0, 0, 650, 350), 
			    		'fillColor=#F6F6F6;strokeColor=none;shadow=0;gradientColor=none;fontSize=14;align=left;spacing=10;fontColor=#717171;9E9E9E;verticalAlign=top;spacingTop=-4;fontStyle=0;spacingLeft=40;html=1;');
		    	bg.vertex = true;
		    	
			    var zone1Cell = new mxCell('', 
			    		new mxGeometry(0, 0, 23, 20), 
			    		'shape=mxgraph.gcp2.google_cloud_platform;fillColor=#F6F6F6;strokeColor=none;shadow=0;gradientColor=none;');
			    zone1Cell.geometry.relative = true;
			    zone1Cell.geometry.offset = new mxPoint(20, 10);
			    zone1Cell.vertex = true;
		    	bg.insert(zone1Cell);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Project Zone');
			}),

			this.addEntry(dt + 'markers', function()
		   	{
				s = 'shape=ellipse;perimeter=ellipsePerimeter;strokeColor=#BDBDBD;strokeWidth=2;shadow=0;gradientColor=none;fontColor=#757575;align=center;html=1;fontStyle=1;spacingTop=-1;';
				
			    var icon1 = new mxCell('1', new mxGeometry(0, 0, 20, 20), s);
			    icon1.vertex = true;
			    var icon2 = new mxCell('2', new mxGeometry(40, 0, 20, 20), s);
			    icon2.vertex = true;
			    var icon3 = new mxCell('3', new mxGeometry(80, 0, 20, 20), s);
			    icon3.vertex = true;
			    var icon4 = new mxCell('4', new mxGeometry(120, 0, 20, 20), s);
			    icon4.vertex = true;
			    var icon5 = new mxCell('5', new mxGeometry(160, 0, 20, 20), s);
			    icon5.vertex = true;
			    var icon6 = new mxCell('6', new mxGeometry(200, 0, 20, 20), s);
			    icon6.vertex = true;
			    var icon7 = new mxCell('7', new mxGeometry(240, 0, 20, 20), s);
			    icon7.vertex = true;
			    var label1 = new mxCell('Markers to be used with the legend', new mxGeometry(0, 20, 260, 30), 
			    		'strokeColor=none;fillColor=none;fontColor=#757575;align=left;html=1;fontStyle=0;fontSize=11;');
			    label1.vertex = true;

			   	return sb.createVertexTemplateFromCells([icon1, icon2, icon3, icon4, icon5, icon6, icon7, label1], 260, 50, 'Markers');
			}),

			this.addEntry(dt + 'markers', function()
		   	{
				var s = 'strokeColor=none;fillColor=none;fontColor=#757575;align=left;html=1;fontStyle=0;spacingLeft=5;fontSize=11;verticalAlign=top;whiteSpace=wrap;spacingRight=5;';
				
			    var bg = new mxCell('', new mxGeometry(0, 0, 600, 70), 
	    			'strokeColor=#BDBDBD;strokeWidth=1;shadow=0;gradientColor=none;');
			    bg.vertex = true;
				
			    var label1 = new mxCell('1 Commit code', new mxGeometry(0, 0, 200, 30), s);
			    label1.geometry.relative = true;
			    label1.vertex = true;
			    bg.insert(label1);
			    
			    var label2 = new mxCell('2 Detect code change', new mxGeometry(0, 0, 200, 30), s);
			    label2.geometry.relative = true;
			    label2.geometry.offset = new mxPoint(0, 30);
			    label2.vertex = true;
			    bg.insert(label2);
			    
			    var label3 = new mxCell('3 Build immutable image', new mxGeometry(0, 0, 200, 30), s);
			    label3.geometry.relative = true;
			    label3.geometry.offset = new mxPoint(200, 0);
			    label3.vertex = true;
			    bg.insert(label3);
			    
			    var label4 = new mxCell('4 Launch test instance from image', new mxGeometry(0, 0, 200, 30), s);
			    label4.geometry.relative = true;
			    label4.geometry.offset = new mxPoint(200, 30);
			    label4.vertex = true;
			    bg.insert(label4);
			    
			    var label5 = new mxCell('5 Run tests', new mxGeometry(0, 0, 200, 30), s);
			    label5.geometry.relative = true;
			    label5.geometry.offset = new mxPoint(400, 0);
			    label5.vertex = true;
			    bg.insert(label5);
			    
			    var label6 = new mxCell('6 Perform rolling update of image to autoscaler', new mxGeometry(0, 0, 200, 30), s);
			    label6.geometry.relative = true;
			    label6.geometry.offset = new mxPoint(400, 30);
			    label6.vertex = true;
			    bg.insert(label6);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Markers');
			})
	 	];
		
		this.addPalette('gcp2Zones', 'GCP / Zones', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2GeneralIconsPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;verticalAlign=top;fillColor=#3B8DF1;shape=mxgraph.gcp2.';
		var dt = 'gcp google cloud platform general icons icon ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'biomedical_trio', 
		    		s * 100, s * 68, null, 'Biomedical Trio', null, null, this.getTagsForStencil(gn, '', dt + 'biomedical trio').join(' ')),
		    this.createVertexTemplateEntry(n + 'biomedical_beaker', 
		    		s * 69, s * 100, null, 'Biomedical Beaker', null, null, this.getTagsForStencil(gn, '', dt + 'biomedical beaker').join(' ')),
		    this.createVertexTemplateEntry(n + 'biomedical_test_tube', 
		    		s * 31, s * 100, null, 'Biomedical Test Tube', null, null, this.getTagsForStencil(gn, '', dt + 'biomedical test tube').join(' ')),
		    this.createVertexTemplateEntry(n + 'check_available', 
		    		s * 100, s * 87, null, 'Check Available', null, null, this.getTagsForStencil(gn, '', dt + 'check available').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud_monitoring', 
		    		s * 90, s * 100, null, 'Cloud Monitoring', null, null, this.getTagsForStencil(gn, '', dt + 'cloud monitoring').join(' ')),
		    this.createVertexTemplateEntry(n + 'repository', 
		    		s * 60, s * 100, null, 'Repository', null, null, this.getTagsForStencil(gn, '', dt + 'repository').join(' ')),
		    this.createVertexTemplateEntry(n + 'compute_engine_2', 
		    		s * 54, s * 100, null, 'Compute Engine', null, null, this.getTagsForStencil(gn, '', dt + 'compute engine').join(' ')),
		    this.createVertexTemplateEntry(n + 'capabilities', 
		    		s * 100, s * 76, null, 'Capabilities', null, null, this.getTagsForStencil(gn, '', dt + 'capabilities thumbs up gear').join(' ')),
		    this.createVertexTemplateEntry(n + 'globe_world', 
		    		s * 100, s * 95, null, 'World Network', null, null, this.getTagsForStencil(gn, '', dt + 'globe global world network upload anywhere').join(' ')),
		    this.createVertexTemplateEntry(n + 'process', 
		    		s * 84, s * 100, null, 'Process', null, null, this.getTagsForStencil(gn, '', dt + 'process').join(' ')),
		    this.createVertexTemplateEntry(n + 'arrow_cycle', 
		    		s * 100, s * 95, null, 'Arrow Cycle', null, null, this.getTagsForStencil(gn, '', dt + 'arrow cycle').join(' ')),
		    this.createVertexTemplateEntry(n + 'arrows_system', 
		    		s * 100, s * 95, null, 'Arrows System', null, null, this.getTagsForStencil(gn, '', dt + 'arrows system').join(' ')),
		    this.createVertexTemplateEntry(n + 'half_cloud', 
		    		s * 100, s * 50, null, 'Half Cloud', null, null, this.getTagsForStencil(gn, '', dt + 'half cloud').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud', 
		    		s * 100, s * 69, null, 'Cloud', null, null, this.getTagsForStencil(gn, '', dt + 'cloud').join(' ')),
		    this.createVertexTemplateEntry(n + 'speed', 
		    		s * 100, s * 57, null, 'Speed', null, null, this.getTagsForStencil(gn, '', dt + 'speed').join(' ')),
		    this.createVertexTemplateEntry(n + 'time_clock', 
		    		s * 86, s * 100, null, 'Overtime', null, null, this.getTagsForStencil(gn, '', dt + 'time clock frozen cold overtime').join(' ')),
		    this.createVertexTemplateEntry(n + 'loading', 
		    		s * 100, s * 100, null, 'Loading', null, null, this.getTagsForStencil(gn, '', dt + 'loading').join(' ')),
		    this.createVertexTemplateEntry(n + 'clock', 
		    		s * 100, s * 100, null, 'Clock', null, null, this.getTagsForStencil(gn, '', dt + 'clock').join(' ')),
		    this.createVertexTemplateEntry(n + 'check', 
		    		s * 100, s * 80, null, 'Check', null, null, this.getTagsForStencil(gn, '', dt + 'check').join(' ')),
		    this.createVertexTemplateEntry('sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;verticalAlign=top;fillColor=#F4AF20;shape=mxgraph.gcp2.check', 
		    		s * 100, s * 80, null, 'Check (yellow)', null, null, this.getTagsForStencil(gn, '', dt + 'check').join(' ')),
		    this.createVertexTemplateEntry('sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;verticalAlign=top;fillColor=#2D9C5E;shape=mxgraph.gcp2.check', 
		    		s * 100, s * 80, null, 'Check (green)', null, null, this.getTagsForStencil(gn, '', dt + 'check').join(' ')),
		    this.createVertexTemplateEntry(n + 'lock', 
		    		s * 78, s * 100, null, 'Lock', null, null, this.getTagsForStencil(gn, '', dt + 'lock').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud_security', 
		    		s * 100, s * 70, null, 'Cloud Security', null, null, this.getTagsForStencil(gn, '', dt + 'cloud security').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud_checkmark', 
		    		s * 100, s * 67, null, 'Cloud Checkmark', null, null, this.getTagsForStencil(gn, '', dt + 'cloud checkmark').join(' ')),
		    this.createVertexTemplateEntry(n + 'key', 
		    		s * 100, s * 47, null, 'Key', null, null, this.getTagsForStencil(gn, '', dt + 'key').join(' ')),
		    this.createVertexTemplateEntry(n + 'aspect_ratio', 
		    		s * 100, s * 92, null, 'Aspect Ratio', null, null, this.getTagsForStencil(gn, '', dt + 'aspect ratio').join(' ')),
		    this.createVertexTemplateEntry(n + 'scale', 
		    		s * 100, s * 92, null, 'Check', null, null, this.getTagsForStencil(gn, '', dt + 'check scale aspect ratio').join(' ')),
		    this.createVertexTemplateEntry(n + 'big_query', 
		    		s * 99, s * 100, null, 'Big Query', null, null, this.getTagsForStencil(gn, '', dt + 'big query').join(' ')),
		    this.createVertexTemplateEntry(n + 'search', 
		    		s * 99, s * 100, null, 'Search', null, null, this.getTagsForStencil(gn, '', dt + 'search').join(' ')),
		    this.createVertexTemplateEntry('sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;verticalAlign=top;fillColor=#2D9C5E;shape=mxgraph.gcp2.search', 
		    		s * 99, s * 100, null, 'Search (green)', null, null, this.getTagsForStencil(gn, '', dt + 'search').join(' ')),
		    this.createVertexTemplateEntry(n + 'solution', 
		    		s * 99, s * 100, null, 'Solution', null, null, this.getTagsForStencil(gn, '', dt + 'solution').join(' ')),
		    this.createVertexTemplateEntry(n + 'visibility', 
		    		s * 100, s * 94, null, 'Visibility', null, null, this.getTagsForStencil(gn, '', dt + 'visibility').join(' ')),
		    this.createVertexTemplateEntry(n + 'anomaly_detection', 
		    		s * 78, s * 100, null, 'Anomaly Detection', null, null, this.getTagsForStencil(gn, '', dt + 'anomaly detection').join(' ')),
		    this.createVertexTemplateEntry(n + 'view_list', 
		    		s * 81, s * 100, null, 'View List', null, null, this.getTagsForStencil(gn, '', dt + 'view list').join(' ')),
		    this.createVertexTemplateEntry(n + 'connected', 
		    		s * 100, s * 72, null, 'Admin', null, null, this.getTagsForStencil(gn, '', dt + 'admin system connected').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud_server', 
		    		s * 100, s * 89, null, 'Cloud Server', null, null, this.getTagsForStencil(gn, '', dt + 'cloud server').join(' ')),
		    this.createVertexTemplateEntry(n + 'primary', 
		    		s * 100, s * 15, null, 'Primary', null, null, this.getTagsForStencil(gn, '', dt + 'primary').join(' ')),
		    this.createVertexTemplateEntry(n + 'monitor', 
		    		s * 100, s * 85, null, 'Monitor', null, null, this.getTagsForStencil(gn, '', dt + 'monitor save help').join(' ')),
		    this.createVertexTemplateEntry(n + 'monitor_2', 
		    		s * 100, s * 85, null, 'Monitor', null, null, this.getTagsForStencil(gn, '', dt + 'monitor').join(' ')),
		    this.createVertexTemplateEntry(n + 'website', 
		    		s * 100, s * 97, null, 'Website', null, null, this.getTagsForStencil(gn, '', dt + 'website').join(' ')),
		    this.createVertexTemplateEntry(n + 'safety', 
		    		s * 100, s * 96, null, 'Safety', null, null, this.getTagsForStencil(gn, '', dt + 'safety').join(' ')),
		    this.createVertexTemplateEntry(n + 'gear_load', 
		    		s * 100, s * 92, null, 'Gear Load', null, null, this.getTagsForStencil(gn, '', dt + 'gear load').join(' ')),
		    this.createVertexTemplateEntry(n + 'files', 
		    		s * 100, s * 97, null, 'Files', null, null, this.getTagsForStencil(gn, '', dt + 'files data sharing').join(' ')),
		    this.createVertexTemplateEntry(n + 'play_gear', 
		    		s * 100, s * 100, null, 'Play Gear', null, null, this.getTagsForStencil(gn, '', dt + 'play gear').join(' ')),
		    this.createVertexTemplateEntry(n + 'play_start', 
		    		s * 100, s * 100, null, 'Play Start', null, null, this.getTagsForStencil(gn, '', dt + 'play start').join(' ')),
		    this.createVertexTemplateEntry(n + 'replication_controller', 
		    		s * 100, s * 91, null, 'Replication Controller', null, null, this.getTagsForStencil(gn, '', dt + 'replication controller').join(' ')),
		    this.createVertexTemplateEntry(n + 'replication_controller_2', 
		    		s * 100, s * 91, null, 'Replication Controller', null, null, this.getTagsForStencil(gn, '', dt + 'replication controller').join(' ')),
		    this.createVertexTemplateEntry(n + 'replication_controller_3', 
		    		s * 100, s * 66, null, 'Replication Controller', null, null, this.getTagsForStencil(gn, '', dt + 'replication controller').join(' ')),
		    this.createVertexTemplateEntry(n + 'repository_2', 
		    		s * 94, s * 100, null, 'Repository', null, null, this.getTagsForStencil(gn, '', dt + 'repository upload swap').join(' ')),
		    this.createVertexTemplateEntry(n + 'repository_3', 
		    		s * 100, s * 100, null, 'Repository', null, null, this.getTagsForStencil(gn, '', dt + 'repository').join(' ')),
		    this.createVertexTemplateEntry(n + 'repository_primary', 
		    		s * 100, s * 100, null, 'Repository', null, null, this.getTagsForStencil(gn, '', dt + 'repository primary').join(' ')),
		    this.createVertexTemplateEntry(n + 'database_3', 
		    		s * 70, s * 100, null, 'Database', null, null, this.getTagsForStencil(gn, '', dt + 'database db files').join(' ')),
		    this.createVertexTemplateEntry(n + 'database_uploading', 
		    		s * 100, s * 84, null, 'Database Uploading', null, null, this.getTagsForStencil(gn, '', dt + 'database db uploading').join(' ')),
		    this.createVertexTemplateEntry(n + 'servers_stacked', 
		    		s * 100, s * 100, null, 'Servers Stacked', null, null, this.getTagsForStencil(gn, '', dt + 'servers stacked').join(' ')),
		    this.createVertexTemplateEntry(n + 'segments', 
		    		s * 100, s * 100, null, 'Segments', null, null, this.getTagsForStencil(gn, '', dt + 'segments').join(' ')),
		    this.createVertexTemplateEntry(n + 'segments_2', 
		    		s * 100, s * 92, null, 'Segments', null, null, this.getTagsForStencil(gn, '', dt + 'segments').join(' ')),
		    this.createVertexTemplateEntry(n + 'segments_overlap', 
		    		s * 100, s * 100, null, 'Segments Overlap', null, null, this.getTagsForStencil(gn, '', dt + 'segments overlap').join(' ')),
		    this.createVertexTemplateEntry(n + 'cost_savings', 
		    		s * 66, s * 100, null, 'Cost Savings', null, null, this.getTagsForStencil(gn, '', dt + 'cost savings').join(' ')),
		    this.createVertexTemplateEntry(n + 'enhance_ui', 
		    		s * 76, s * 100, null, 'Enhance UI', null, null, this.getTagsForStencil(gn, '', dt + 'enhance ui').join(' ')),
		    this.createVertexTemplateEntry(n + 'phone_android', 
		    		s * 56, s * 100, null, 'Phone', null, null, this.getTagsForStencil(gn, '', dt + 'phone android').join(' ')),
		    this.createVertexTemplateEntry(n + 'cost_arrows', 
		    		s * 76, s * 100, null, 'Cost Arrows', null, null, this.getTagsForStencil(gn, '', dt + 'cost arrows').join(' ')),
		    this.createVertexTemplateEntry(n + 'increase_cost_arrows', 
		    		s * 100, s * 92, null, 'Increase Cost Arrows', null, null, this.getTagsForStencil(gn, '', dt + 'increase cost arrows').join(' ')),
		    this.createVertexTemplateEntry(n + 'cost', 
		    		s * 85, s * 100, null, 'Cost File', null, null, this.getTagsForStencil(gn, '', dt + 'cost file').join(' ')),
		    this.createVertexTemplateEntry(n + 'database_2', 
		    		s * 78, s * 100, null, 'Database', null, null, this.getTagsForStencil(gn, '', dt + 'database db').join(' ')),
		    this.createVertexTemplateEntry(n + 'database_speed', 
		    		s * 69, s * 100, null, 'Database Speed', null, null, this.getTagsForStencil(gn, '', dt + 'database db speed').join(' ')),
		    this.createVertexTemplateEntry(n + 'data_access', 
		    		s * 93, s * 100, null, 'Data Access', null, null, this.getTagsForStencil(gn, '', dt + 'data access file gear').join(' ')),
		    this.createVertexTemplateEntry(n + 'database_cycle', 
		    		s * 100, s * 98, null, 'Database Cycle', null, null, this.getTagsForStencil(gn, '', dt + 'database db cycle').join(' ')),
		    this.createVertexTemplateEntry(n + 'data_increase', 
		    		s * 78, s * 100, null, 'Data Increase', null, null, this.getTagsForStencil(gn, '', dt + 'data increase').join(' ')),
		    this.createVertexTemplateEntry(n + 'data_storage_cost', 
		    		s * 78, s * 100, null, 'Data Storage Cost', null, null, this.getTagsForStencil(gn, '', dt + 'data storage cost').join(' ')),
		    this.createVertexTemplateEntry(n + 'gear', 
		    		s * 100, s * 100, null, 'Gear', null, null, this.getTagsForStencil(gn, '', dt + 'gear').join(' ')),
		    this.createVertexTemplateEntry(n + 'gear_chain', 
		    		s * 100, s * 100, null, 'Gear Chain', null, null, this.getTagsForStencil(gn, '', dt + 'gear chain').join(' ')),
		    this.createVertexTemplateEntry(n + 'bucket_scale', 
		    		s * 100, s * 81, null, 'Bucket Scale', null, null, this.getTagsForStencil(gn, '', dt + 'bucket scale').join(' ')),
		    this.createVertexTemplateEntry(n + 'a7_power', 
		    		s * 100, s * 100, null, 'A7 Power', null, null, this.getTagsForStencil(gn, '', dt + 'a7 power').join(' ')),
		    this.createVertexTemplateEntry(n + 'gear_arrow', 
		    		s * 100, s * 61, null, 'Gear Arrow', null, null, this.getTagsForStencil(gn, '', dt + 'gear arrow').join(' ')),
		    this.createVertexTemplateEntry(n + 'swap', 
		    		s * 100, s * 51, null, 'Swap', null, null, this.getTagsForStencil(gn, '', dt + 'swap').join(' ')),
		    this.createVertexTemplateEntry(n + 'save', 
		    		s * 100, s * 84, null, 'Save', null, null, this.getTagsForStencil(gn, '', dt + 'save').join(' ')),
		    this.createVertexTemplateEntry(n + 'social_media_time', 
		    		s * 97, s * 100, null, 'Social Media Time', null, null, this.getTagsForStencil(gn, '', dt + 'social media time').join(' ')),
		    this.createVertexTemplateEntry(n + 'tape_record', 
		    		s * 100, s * 71, null, 'Tape Record', null, null, this.getTagsForStencil(gn, '', dt + 'tape record').join(' ')),
		    this.createVertexTemplateEntry(n + 'folders', 
		    		s * 100, s * 85, null, 'Folders', null, null, this.getTagsForStencil(gn, '', dt + 'folders extensible').join(' ')),
		    this.createVertexTemplateEntry(n + 'maps_api', 
		    		s * 61, s * 100, null, 'Maps API', null, null, this.getTagsForStencil(gn, '', dt + 'maps api application programming interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'enhance_ui_2', 
		    		s * 100, s * 91, null, 'Enhance UI', null, null, this.getTagsForStencil(gn, '', dt + 'enhance ui user interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'certified_industry_standard', 
		    		s * 100, s * 78, null, 'Certified Industry Standard', null, null, this.getTagsForStencil(gn, '', dt + 'certified industry standard').join(' ')),
		    this.createVertexTemplateEntry(n + 'calculator', 
		    		s * 100, s * 74, null, 'Calculator', null, null, this.getTagsForStencil(gn, '', dt + 'calculator').join(' ')),
		    this.createVertexTemplateEntry(n + 'network', 
		    		s * 100, s * 100, null, 'Network', null, null, this.getTagsForStencil(gn, '', dt + 'network').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud_computer', 
		    		s * 100, s * 88, null, 'Cloud Computer', null, null, this.getTagsForStencil(gn, '', dt + 'cloud computer').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud_connected_insight', 
		    		s * 100, s * 91, null, 'Cloud Connected Insight', null, null, this.getTagsForStencil(gn, '', dt + 'cloud connected insight').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud_information', 
		    		s * 100, s * 79, null, 'Cloud Information Portable', null, null, this.getTagsForStencil(gn, '', dt + 'cloud information portable').join(' ')),
		    this.createVertexTemplateEntry(n + 'lifecycle', 
		    		s * 100, s * 100, null, 'Lifecycle', null, null, this.getTagsForStencil(gn, '', dt + 'lifecycle time folder loading').join(' ')),
		    this.createVertexTemplateEntry(n + 'thumbs_up', 
		    		s * 100, s * 100, null, 'Thumbs Up', null, null, this.getTagsForStencil(gn, '', dt + 'thumbs up').join(' ')),
		    this.createVertexTemplateEntry(n + 'loading_2', 
		    		s * 93, s * 100, null, 'Loading', null, null, this.getTagsForStencil(gn, '', dt + 'loading').join(' ')),
		    this.createVertexTemplateEntry(n + 'internet_connection', 
		    		s * 100, s * 83, null, 'Internet Connection', null, null, this.getTagsForStencil(gn, '', dt + 'internet connection').join(' ')),
		    this.createVertexTemplateEntry(n + 'check_scale', 
		    		s * 100, s * 75, null, 'Check Scale', null, null, this.getTagsForStencil(gn, '', dt + 'check scale').join(' ')),
		    this.createVertexTemplateEntry(n + 'load_balancing', 
		    		s * 100, s * 26, null, 'Load Balancing', null, null, this.getTagsForStencil(gn, '', dt + 'load balancing').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud_messaging', 
		    		s * 100, s * 64, null, 'Cloud Messaging', null, null, this.getTagsForStencil(gn, '', dt + 'cloud messaging').join(' ')),
		    this.createVertexTemplateEntry(n + 'memory_card', 
		    		s * 93, s * 100, null, 'Memory Card', null, null, this.getTagsForStencil(gn, '', dt + 'memory card').join(' ')),
		    this.createVertexTemplateEntry(n + 'admin_connected', 
		    		s * 100, s * 100, null, 'Admin Connected', null, null, this.getTagsForStencil(gn, '', dt + 'admin connected').join(' ')),
		    this.createVertexTemplateEntry('sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;verticalAlign=top;fillColor=#3B8DF1;shape=ellipse', 
		    		s * 100, s * 100, null, 'Images Service', null, null, this.getTagsForStencil(gn, '', dt + 'images service').join(' ')),
		    this.createVertexTemplateEntry(n + 'task_queues_2', 
		    		s * 100, s * 61, null, 'Task Queues', null, null, this.getTagsForStencil(gn, '', dt + 'task queues').join(' ')),
		    this.createVertexTemplateEntry(n + 'systems_check', 
		    		s * 99, s * 100, null, 'Systems Check', null, null, this.getTagsForStencil(gn, '', dt + 'systems check').join(' ')),
		    this.createVertexTemplateEntry(n + 'google_network', 
		    		s * 100, s * 100, null, 'Google Network', null, null, this.getTagsForStencil(gn, '', dt + 'google network').join(' ')),
		    this.createVertexTemplateEntry(n + 'check_2', 
		    		s * 100, s * 100, null, 'Check', null, null, this.getTagsForStencil(gn, '', dt + 'check').join(' ')),
		    this.createVertexTemplateEntry(n + 'people_security_management', 
		    		s * 100, s * 100, null, 'People Security Management', null, null, this.getTagsForStencil(gn, '', dt + 'people security management').join(' ')),
		    this.createVertexTemplateEntry(n + 'search_api', 
		    		s * 100, s * 100, null, 'Search API', null, null, this.getTagsForStencil(gn, '', dt + 'search api application programming interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'management_security', 
		    		s * 100, s * 100, null, 'Management Security', null, null, this.getTagsForStencil(gn, '', dt + 'management security').join(' ')),
		    this.createVertexTemplateEntry(n + 'loading_3', 
		    		s * 100, s * 100, null, 'Loading', null, null, this.getTagsForStencil(gn, '', dt + 'loading').join(' ')),
		    this.createVertexTemplateEntry(n + 'stacked_ownership', 
		    		s * 100, s * 100, null, 'Stacked Ownership', null, null, this.getTagsForStencil(gn, '', dt + 'stacked ownership').join(' ')),
		    this.createVertexTemplateEntry(n + 'vpn', 
		    		s * 100, s * 50, null, 'VPN', null, null, this.getTagsForStencil(gn, '', dt + 'vpn virtual private network').join(' ')),
		    this.createVertexTemplateEntry(n + 'node', 
		    		s * 80, s * 100, null, 'Node', null, null, this.getTagsForStencil(gn, '', dt + 'node').join(' ')),
		    this.createVertexTemplateEntry(n + 'service', 
		    		s * 70, s * 100, null, 'Service', null, null, this.getTagsForStencil(gn, '', dt + 'service').join(' ')),
		    this.createVertexTemplateEntry('sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;verticalAlign=top;fillColor=#2D9C5E;shape=mxgraph.gcp2.external_data_center', 
		    		s * 77, s * 100, null, 'External Data Center', null, null, this.getTagsForStencil(gn, '', dt + 'external data center').join(' ')),
		    this.createVertexTemplateEntry('sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;verticalAlign=top;fillColor=#2D9C5E;shape=mxgraph.gcp2.external_data_resource', 
		    		s * 79, s * 100, null, 'External Data Resource', null, null, this.getTagsForStencil(gn, '', dt + 'external data resource').join(' ')),
		    this.createVertexTemplateEntry('sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;verticalAlign=top;fillColor=#2D9C5E;shape=mxgraph.gcp2.legacy_cloud', 
		    		s * 100, s * 69, null, 'Legacy Cloud', null, null, this.getTagsForStencil(gn, '', dt + 'legacy cloud').join(' ')),
		    this.createVertexTemplateEntry('sketch=0;html=1;aspect=fixed;strokeColor=none;shadow=0;align=center;verticalAlign=top;fillColor=#2D9C5E;shape=mxgraph.gcp2.legacy_cloud_2', 
		    		s * 100, s * 69, null, 'Legacy Cloud', null, null, this.getTagsForStencil(gn, '', dt + 'legacy cloud').join(' ')),
		    this.createVertexTemplateEntry(n + 'mem_instances', 
		    		s * 100, s * 87, null, 'Mem Instances', null, null, this.getTagsForStencil(gn, '', dt + 'mem instances').join(' '))
	 	];
		
		this.addPalette('gcp2General Icons', 'GCP / General Icons', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2ServiceCardsPalette = function()
	{
		var dt = 'gcp google cloud platform service cards ';
		var fns = [];
		
		this.addGCP2ServiceCard('Gateway', 'gateway', 100, 44, dt + 'gateway', fns);
		this.addGCP2ServiceCard('Memcache', 'memcache', 110, 44, dt + 'memcache', fns);
		this.addGCP2ServiceCard('Logs API', 'logs_api', 100, 44, dt + 'logs api application programming interface', fns);
		this.addGCP2ServiceCard('Cluster', 'cluster', 90, 44, dt + 'cluster', fns);//TODO fix parser or source
		this.addGCP2ServiceCard('NAT', 'nat', 80, 44, dt + 'nat network address translation', fns);
		this.addGCP2ServiceCard('Squid Proxy', 'squid_proxy', 120, 44, dt + 'squid proxy', fns);
		this.addGCP2ServiceCard('Bucket', 'bucket', 100, 44, dt + 'bucket', fns);
		this.addGCP2ServiceCard('Service Discovery', 'service_discovery', 150, 44, dt + 'service discovery', fns);
		this.addGCP2ServiceCard('Task\nQueues', 'task_queues', 90, 44, dt + 'task queues', fns);
		this.addGCP2ServiceCard('Image\nServices', 'image_services', 100, 44, dt + 'image services', fns);
		this.addGCP2ServiceCard('Dedicated\nGame Server', 'dedicated_game_server', 120, 44, dt + 'dedicated game server', fns);
		this.addGCP2ServiceCard('Frontend\nPlatform Services', 'frontend_platform_services', 150, 44, dt + 'frontend platform services', fns);
		this.addGCP2ServiceCard('Google\nEdge POP', 'google_network_edge_cache', 110, 56, dt + 'google edge pop point of presence', fns);
		this.addGCP2ServiceCard('External\nPayment Form', 'external_payment_form', 130, 44, dt + 'external payment form', fns);
		this.addGCP2ServiceCard('Internal Payment\nAuthorization', 'internal_payment_authorization', 150, 44, dt + 'internal payment authorization', fns);
		this.addGCP2ServiceCard('VPN Gateway', 'gateway', 130, 44, dt + 'vpn gateway virtual private network', fns);
		this.addGCP2ServiceCard('Application\nSystem(s)', 'application_system', 110, 44, dt + 'application system systems', fns);
		this.addGCP2ServiceCard('Virtual\nFile System', 'virtual_file_system', 110, 44, dt + 'virtual file system', fns);
		this.addGCP2ServiceCard('CDN\nInterconnect', 'google_network_edge_cache', 120, 44, dt + 'cdn content delivery network interconnect', fns);
		this.addGCP2ServiceCard('Scheduled\nTasks', 'scheduled_tasks', 110, 44, dt + 'scheduled tasks', fns);
		this.addGCP2ServiceCard('HTTPS\nLoad Balancer', 'network_load_balancer', 130, 44, dt + 'https secure load balancer', fns);
		this.addGCP2ServiceCard('Persistent\nDisk Snapshot', 'persistent_disk_snapshot', 130, 44, dt + 'persistent disk snapshot', fns);
		this.addGCP2ServiceCard('Persistent\nDisk', 'persistent_disk_snapshot', 110, 44, dt + 'persistent disk', fns);
		this.addGCP2ServiceCard('Network\nLoad\nBalancer', 'network_load_balancer', 100, 56, dt + 'network load balancer', fns);
		this.addGCP2ServiceCard('Google\n Network W/\nEdge Cache', 'google_network_edge_cache', 120, 56, dt + 'google network witch edge cache', fns);
		this.addGCP2ServiceCard('Push\nNotification\nService', 'push_notification_service', 110, 56, dt + 'push notification service', fns);
		this.addGCP2ServiceCard('Blank One Line', 'blank', 140, 44, dt + 'blank one line', fns);

		fns.push(
			this.addEntry(dt + 'blank one line', function()
		   	{
			    var bg = new mxCell('Blank One Line', new mxGeometry(0, 0, 100, 44), 'dashed=0;strokeColor=#dddddd;shadow=1;strokeWidth=1;labelPosition=center;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontSize=12;');
		    	bg.vertex = true;
		    	
			   	return sb.createVertexTemplateFromCells([bg], 100, 44, 'Blank One Line');
			})
		);

		this.addGCP2ServiceCard('Blank Two\n\& Three Line', 'blank', 120, 44, dt + 'blank two and three line', fns);

		fns.push(
			this.addEntry(dt + 'blank two and three line', function()
		   	{
			    var bg = new mxCell('Blank Two\n\& Three Line', new mxGeometry(0, 0, 90, 44), 'dashed=0;strokeColor=#dddddd;shadow=1;strokeWidth=1;labelPosition=center;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontSize=12;');
		    	bg.vertex = true;
		    	
			   	return sb.createVertexTemplateFromCells([bg], 100, 44, 'Blank One Line');
			})
		);

		this.addPalette('gcp2Service Cards', 'GCP / Service Cards', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2ComputePalette = function()
	{
		var dt = 'gcp google cloud platform compute ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'compute engine', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Compute\nEngine', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNyA3aDZ2Nkg3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05IDBoMnY0SDl6TTUgMGgydjRINXptOCAwaDJ2NGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSAxNmgydjRIOXptLTQgMGgydjRINXptOCAwaDJ2NGgtMnptMy01VjloNHYyem0wIDR2LTJoNHYyem0wLThWNWg0djJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTAgMTFWOWg0djJ6bTAgNHYtMmg0djJ6bTAtOFY1aDR2MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMyAzdjE0aDE0VjN6bTEyIDEySDVWNWgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAgMTBsLTMgM2g2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMyA3bC0zIDMgMyAzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Compute Engine');
			})
		);

		fns.push(
			this.addEntry(dt + 'compute engine', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Compute Engine', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNyA3aDZ2Nkg3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05IDBoMnY0SDl6TTUgMGgydjRINXptOCAwaDJ2NGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSAxNmgydjRIOXptLTQgMGgydjRINXptOCAwaDJ2NGgtMnptMy01VjloNHYyem0wIDR2LTJoNHYyem0wLThWNWg0djJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTAgMTFWOWg0djJ6bTAgNHYtMmg0djJ6bTAtOFY1aDR2MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMyAzdjE0aDE0VjN6bTEyIDEySDVWNWgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAgMTBsLTMgM2g2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMyA3bC0zIDMgMyAzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Compute Engine');
			})
		);

		fns.push(
			this.addEntry(dt + 'compute engine', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 178, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Compute Engine', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNyA3aDZ2Nkg3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05IDBoMnY0SDl6TTUgMGgydjRINXptOCAwaDJ2NGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSAxNmgydjRIOXptLTQgMGgydjRINXptOCAwaDJ2NGgtMnptMy01VjloNHYyem0wIDR2LTJoNHYyem0wLThWNWg0djJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTAgMTFWOWg0djJ6bTAgNHYtMmg0djJ6bTAtOFY1aDR2MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMyAzdjE0aDE0VjN6bTEyIDEySDVWNWgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAgMTBsLTMgM2g2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMyA3bC0zIDMgMyAzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Compute Engine');
			})
		);

		fns.push(
			this.addEntry(dt + 'gpu', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 100, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('GPU', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNyA3aDZ2Nkg3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05IDBoMnY0SDl6TTUgMGgydjRINXptOCAwaDJ2NGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSAxNmgydjRIOXptLTQgMGgydjRINXptOCAwaDJ2NGgtMnptMy01VjloNHYyem0wIDR2LTJoNHYyem0wLThWNWg0djJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTAgMTFWOWg0djJ6bTAgNHYtMmg0djJ6bTAtOFY1aDR2MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMyAzdjE0aDE0VjN6bTEyIDEySDVWNWgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAgMTBsLTMgM2g2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMyA3bC0zIDMgMyAzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'GPU');
			})
		);

		fns.push(
			this.addEntry(dt + 'gpu', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>GPU', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNyA3aDZ2Nkg3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05IDBoMnY0SDl6TTUgMGgydjRINXptOCAwaDJ2NGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSAxNmgydjRIOXptLTQgMGgydjRINXptOCAwaDJ2NGgtMnptMy01VjloNHYyem0wIDR2LTJoNHYyem0wLThWNWg0djJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTAgMTFWOWg0djJ6bTAgNHYtMmg0djJ6bTAtOFY1aDR2MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMyAzdjE0aDE0VjN6bTEyIDEySDVWNWgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAgMTBsLTMgM2g2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMyA3bC0zIDMgMyAzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'GPU');
			})
		);

		fns.push(
			this.addEntry(dt + 'gpu', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 118, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>GPU', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNyA3aDZ2Nkg3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05IDBoMnY0SDl6TTUgMGgydjRINXptOCAwaDJ2NGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSAxNmgydjRIOXptLTQgMGgydjRINXptOCAwaDJ2NGgtMnptMy01VjloNHYyem0wIDR2LTJoNHYyem0wLThWNWg0djJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTAgMTFWOWg0djJ6bTAgNHYtMmg0djJ6bTAtOFY1aDR2MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMyAzdjE0aDE0VjN6bTEyIDEySDVWNWgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAgMTBsLTMgM2g2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMyA3bC0zIDMgMyAzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'GPU');
			})
		);

		fns.push(
			this.addEntry(dt + 'app engine', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('App\nEngine', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2LjAyMDAwMDQ1Nzc2MzY3MiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSI4Ljk0MDY5NjcxNjMwODU5NGUtOCAwIDIwIDE2LjAyMDAwMDQ1Nzc2MzY3MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4zIDcuMjZsLTEuMjIgMS4yMkExLjcxIDEuNzEgMCAwIDEgMTAgMTEuNDlhMS43NCAxLjc0IDAgMCAxLTEuMzMtLjY0bC0xLjIyIDEuMjJhMy40MyAzLjQzIDAgMCAwIDUuOTg0LTEuMzgxQTMuNDMgMy40MyAwIDAgMCAxMi4zIDcuMjZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDMuNTJhNi4yNSA2LjI1IDAgMCAwIDAgMTIuNSA2LjI1IDYuMjUgMCAwIDAgMC0xMi41bTAgMTAuNzRhNC40NSA0LjQ1IDAgMCAxLTMuMTU3LTcuNTk3QTQuNDUgNC40NSAwIDAgMSAxNC40NCA5LjgyIDQuNDQgNC40NCAwIDAgMSAxMCAxNC4yNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xOS42MiA5LjE2bC0yLjU2LS44MWE3LjEgNy4xIDAgMCAxIC4xNyAxLjUzIDcuNjIgNy42MiAwIDAgMS0uMDggMS4wOGgyLjQ3YS40NC40NCAwIDAgMCAuMzgtLjQydi0xYS40NC40NCAwIDAgMC0uMzgtLjQyTTEwIDIuNzhhNy40OCA3LjQ4IDAgMCAxIDEuNS4xNUwxMC41OC4zOGMtLjA3LS4yMi0uMjEtLjM4LS40Mi0uMzhoLS4zOGEuNDUuNDUgMCAwIDAtLjQyLjM4bC0uOCAyLjU0QTcuNjQgNy42NCAwIDAgMSAxMCAyLjc4bS03LjIzIDcuMWE3LjEgNy4xIDAgMCAxIC4xNy0xLjUzbC0yLjU2LjgxYS40NC40NCAwIDAgMC0uMzguNDJ2MWEuNDQuNDQgMCAwIDAgLjM4LjQyaDIuNDdhNy42MiA3LjYyIDAgMCAxLS4wOC0xLjA4Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDcuMjZhMi41IDIuNSAwIDEgMCAwIDUgMi41IDIuNSAwIDEgMCAwLTV6bTAgMy43NWExLjI1IDEuMjUgMCAxIDEgMC0yLjUgMS4yNSAxLjI1IDAgMCAxIDEuMjUgMS4yNUExLjI1IDEuMjUgMCAwIDEgMTAgMTEuMDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'App Engine');
			})
		);

		fns.push(
			this.addEntry(dt + 'app engine', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>App Engine', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2LjAyMDAwMDQ1Nzc2MzY3MiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSI4Ljk0MDY5NjcxNjMwODU5NGUtOCAwIDIwIDE2LjAyMDAwMDQ1Nzc2MzY3MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4zIDcuMjZsLTEuMjIgMS4yMkExLjcxIDEuNzEgMCAwIDEgMTAgMTEuNDlhMS43NCAxLjc0IDAgMCAxLTEuMzMtLjY0bC0xLjIyIDEuMjJhMy40MyAzLjQzIDAgMCAwIDUuOTg0LTEuMzgxQTMuNDMgMy40MyAwIDAgMCAxMi4zIDcuMjZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDMuNTJhNi4yNSA2LjI1IDAgMCAwIDAgMTIuNSA2LjI1IDYuMjUgMCAwIDAgMC0xMi41bTAgMTAuNzRhNC40NSA0LjQ1IDAgMCAxLTMuMTU3LTcuNTk3QTQuNDUgNC40NSAwIDAgMSAxNC40NCA5LjgyIDQuNDQgNC40NCAwIDAgMSAxMCAxNC4yNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xOS42MiA5LjE2bC0yLjU2LS44MWE3LjEgNy4xIDAgMCAxIC4xNyAxLjUzIDcuNjIgNy42MiAwIDAgMS0uMDggMS4wOGgyLjQ3YS40NC40NCAwIDAgMCAuMzgtLjQydi0xYS40NC40NCAwIDAgMC0uMzgtLjQyTTEwIDIuNzhhNy40OCA3LjQ4IDAgMCAxIDEuNS4xNUwxMC41OC4zOGMtLjA3LS4yMi0uMjEtLjM4LS40Mi0uMzhoLS4zOGEuNDUuNDUgMCAwIDAtLjQyLjM4bC0uOCAyLjU0QTcuNjQgNy42NCAwIDAgMSAxMCAyLjc4bS03LjIzIDcuMWE3LjEgNy4xIDAgMCAxIC4xNy0xLjUzbC0yLjU2LjgxYS40NC40NCAwIDAgMC0uMzguNDJ2MWEuNDQuNDQgMCAwIDAgLjM4LjQyaDIuNDdhNy42MiA3LjYyIDAgMCAxLS4wOC0xLjA4Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDcuMjZhMi41IDIuNSAwIDEgMCAwIDUgMi41IDIuNSAwIDEgMCAwLTV6bTAgMy43NWExLjI1IDEuMjUgMCAxIDEgMC0yLjUgMS4yNSAxLjI1IDAgMCAxIDEuMjUgMS4yNUExLjI1IDEuMjUgMCAwIDEgMTAgMTEuMDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'App Engine');
			})
		);

		fns.push(
			this.addEntry(dt + 'app engine', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>App Engine', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2LjAyMDAwMDQ1Nzc2MzY3MiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSI4Ljk0MDY5NjcxNjMwODU5NGUtOCAwIDIwIDE2LjAyMDAwMDQ1Nzc2MzY3MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4zIDcuMjZsLTEuMjIgMS4yMkExLjcxIDEuNzEgMCAwIDEgMTAgMTEuNDlhMS43NCAxLjc0IDAgMCAxLTEuMzMtLjY0bC0xLjIyIDEuMjJhMy40MyAzLjQzIDAgMCAwIDUuOTg0LTEuMzgxQTMuNDMgMy40MyAwIDAgMCAxMi4zIDcuMjZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDMuNTJhNi4yNSA2LjI1IDAgMCAwIDAgMTIuNSA2LjI1IDYuMjUgMCAwIDAgMC0xMi41bTAgMTAuNzRhNC40NSA0LjQ1IDAgMCAxLTMuMTU3LTcuNTk3QTQuNDUgNC40NSAwIDAgMSAxNC40NCA5LjgyIDQuNDQgNC40NCAwIDAgMSAxMCAxNC4yNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xOS42MiA5LjE2bC0yLjU2LS44MWE3LjEgNy4xIDAgMCAxIC4xNyAxLjUzIDcuNjIgNy42MiAwIDAgMS0uMDggMS4wOGgyLjQ3YS40NC40NCAwIDAgMCAuMzgtLjQydi0xYS40NC40NCAwIDAgMC0uMzgtLjQyTTEwIDIuNzhhNy40OCA3LjQ4IDAgMCAxIDEuNS4xNUwxMC41OC4zOGMtLjA3LS4yMi0uMjEtLjM4LS40Mi0uMzhoLS4zOGEuNDUuNDUgMCAwIDAtLjQyLjM4bC0uOCAyLjU0QTcuNjQgNy42NCAwIDAgMSAxMCAyLjc4bS03LjIzIDcuMWE3LjEgNy4xIDAgMCAxIC4xNy0xLjUzbC0yLjU2LjgxYS40NC40NCAwIDAgMC0uMzguNDJ2MWEuNDQuNDQgMCAwIDAgLjM4LjQyaDIuNDdhNy42MiA3LjYyIDAgMCAxLS4wOC0xLjA4Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDcuMjZhMi41IDIuNSAwIDEgMCAwIDUgMi41IDIuNSAwIDEgMCAwLTV6bTAgMy43NWExLjI1IDEuMjUgMCAxIDEgMC0yLjUgMS4yNSAxLjI1IDAgMCAxIDEuMjUgMS4yNUExLjI1IDEuMjUgMCAwIDEgMTAgMTEuMDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'App Engine');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud functions', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nFunctions', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5Ljk4OTk5OTc3MTExODE2NCIgdmlld0JveD0iMCAwIDIwIDE5Ljk4OTk5OTc3MTExODE2NCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zIDMuOTlMMCA2LjQydjcuMTNsMyAyLjQ0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zIDMuOTlsLTMgNCAzLTJ6bS0zIDhsMyA0di0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0wIDE1Ljk5bDQgNCAyLTItNi02em0uMDEtOEw1Ljk5IDJsLTItMkwwIDMuOTl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDE2bDMtMi40MlY2LjQ0TDE3IDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE3IDE2bDMtNC0zIDJ6bTMtOGwtMy00djJ6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxwYXRoIGQ9Ik0yMCA0bC00LTQtMiAyIDYgNnptLS4wMSA4bC01Ljk4IDUuOTkgMiAyTDIwIDE2eiIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI2IiBjeT0iOS45OSIgcj0iMSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMCIgY3k9IjkuOTkiIHI9IjEiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTMuOTkiIGN5PSI5Ljk5IiByPSIxIi8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Functions');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud functions', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Functions', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5Ljk4OTk5OTc3MTExODE2NCIgdmlld0JveD0iMCAwIDIwIDE5Ljk4OTk5OTc3MTExODE2NCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zIDMuOTlMMCA2LjQydjcuMTNsMyAyLjQ0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zIDMuOTlsLTMgNCAzLTJ6bS0zIDhsMyA0di0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0wIDE1Ljk5bDQgNCAyLTItNi02em0uMDEtOEw1Ljk5IDJsLTItMkwwIDMuOTl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDE2bDMtMi40MlY2LjQ0TDE3IDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE3IDE2bDMtNC0zIDJ6bTMtOGwtMy00djJ6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxwYXRoIGQ9Ik0yMCA0bC00LTQtMiAyIDYgNnptLS4wMSA4bC01Ljk4IDUuOTkgMiAyTDIwIDE2eiIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI2IiBjeT0iOS45OSIgcj0iMSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMCIgY3k9IjkuOTkiIHI9IjEiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTMuOTkiIGN5PSI5Ljk5IiByPSIxIi8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Functions');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud functions', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 168, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Functions', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5Ljk4OTk5OTc3MTExODE2NCIgdmlld0JveD0iMCAwIDIwIDE5Ljk4OTk5OTc3MTExODE2NCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zIDMuOTlMMCA2LjQydjcuMTNsMyAyLjQ0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zIDMuOTlsLTMgNCAzLTJ6bS0zIDhsMyA0di0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0wIDE1Ljk5bDQgNCAyLTItNi02em0uMDEtOEw1Ljk5IDJsLTItMkwwIDMuOTl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDE2bDMtMi40MlY2LjQ0TDE3IDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE3IDE2bDMtNC0zIDJ6bTMtOGwtMy00djJ6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxwYXRoIGQ9Ik0yMCA0bC00LTQtMiAyIDYgNnptLS4wMSA4bC01Ljk4IDUuOTkgMiAyTDIwIDE2eiIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI2IiBjeT0iOS45OSIgcj0iMSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMCIgY3k9IjkuOTkiIHI9IjEiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTMuOTkiIGN5PSI5Ljk5IiByPSIxIi8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Functions');
			})
		);

		fns.push(
			this.addEntry(dt + 'kubernetes engine', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Kubernetes\nEngine', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyOS45MjU5OTcyMzE3OTM4IiBoZWlnaHQ9IjM3OC4yODQ5OTAzMTEyNzg4IiB2aWV3Qm94PSIwIDAgODcuMjkyOTk5MjY3NTc4MTIgMTAwLjA4Nzk5NzQzNjUyMzQ0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00My43NTEgMEwwIDI1LjQ2NXYyLjU4OCA0Ni45Mmw0My43NTIgMjUuMTE1IDQzLjU0MS0yNS4xMjFWMjUuNDczem0yLjQzOCAxMS44NTNsMzIuMTAzIDE4Ljc4MlY2OS43N0w0My43MzkgODkuNzA1IDkgNjkuNzYyVjMwLjY0MWwzMi4xOS0xOC43MzZ2MTQuMTU0TDI0LjUwMyAzNi4xNTNsMTkuMTcyIDExLjUwMiAxOC44ODYtMTEuNTU0LTE2LjM3Mi0xMC4wMjR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIyLjAyNSA0MC40OTZsLjE2NiAxOS4xNDMtMTMuMjQ3IDcuMzN2Mi43NDJsMi42MzcgMS41MTQgMTIuNjQ4LTYuOTk5IDE2Ljk2MSAxMC42MDJWNTEuOTkzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02NS4zNDQgNDAuMjZMNDYuMTg5IDUxLjk3OXYyMi44NDdsMTYuODk5LTEwLjU3NiAxMi41MzkgNi45NzQgMi42MDktMS41MDV2LTIuNzY1bC0xMi43ODQtNy4xMTJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Kubernetes Engine');
			})
		);

		fns.push(
			this.addEntry(dt + 'kubernetes engine', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 180, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Kubernetes Engine', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyOS45MjU5OTcyMzE3OTM4IiBoZWlnaHQ9IjM3OC4yODQ5OTAzMTEyNzg4IiB2aWV3Qm94PSIwIDAgODcuMjkyOTk5MjY3NTc4MTIgMTAwLjA4Nzk5NzQzNjUyMzQ0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00My43NTEgMEwwIDI1LjQ2NXYyLjU4OCA0Ni45Mmw0My43NTIgMjUuMTE1IDQzLjU0MS0yNS4xMjFWMjUuNDczem0yLjQzOCAxMS44NTNsMzIuMTAzIDE4Ljc4MlY2OS43N0w0My43MzkgODkuNzA1IDkgNjkuNzYyVjMwLjY0MWwzMi4xOS0xOC43MzZ2MTQuMTU0TDI0LjUwMyAzNi4xNTNsMTkuMTcyIDExLjUwMiAxOC44ODYtMTEuNTU0LTE2LjM3Mi0xMC4wMjR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIyLjAyNSA0MC40OTZsLjE2NiAxOS4xNDMtMTMuMjQ3IDcuMzN2Mi43NDJsMi42MzcgMS41MTQgMTIuNjQ4LTYuOTk5IDE2Ljk2MSAxMC42MDJWNTEuOTkzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02NS4zNDQgNDAuMjZMNDYuMTg5IDUxLjk3OXYyMi44NDdsMTYuODk5LTEwLjU3NiAxMi41MzkgNi45NzQgMi42MDktMS41MDV2LTIuNzY1bC0xMi43ODQtNy4xMTJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Kubernetes Engine');
			})
		);

		fns.push(
			this.addEntry(dt + 'kubernetes engine', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 188, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Kubernetes Engine', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyOS45MjU5OTcyMzE3OTM4IiBoZWlnaHQ9IjM3OC4yODQ5OTAzMTEyNzg4IiB2aWV3Qm94PSIwIDAgODcuMjkyOTk5MjY3NTc4MTIgMTAwLjA4Nzk5NzQzNjUyMzQ0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00My43NTEgMEwwIDI1LjQ2NXYyLjU4OCA0Ni45Mmw0My43NTIgMjUuMTE1IDQzLjU0MS0yNS4xMjFWMjUuNDczem0yLjQzOCAxMS44NTNsMzIuMTAzIDE4Ljc4MlY2OS43N0w0My43MzkgODkuNzA1IDkgNjkuNzYyVjMwLjY0MWwzMi4xOS0xOC43MzZ2MTQuMTU0TDI0LjUwMyAzNi4xNTNsMTkuMTcyIDExLjUwMiAxOC44ODYtMTEuNTU0LTE2LjM3Mi0xMC4wMjR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIyLjAyNSA0MC40OTZsLjE2NiAxOS4xNDMtMTMuMjQ3IDcuMzN2Mi43NDJsMi42MzcgMS41MTQgMTIuNjQ4LTYuOTk5IDE2Ljk2MSAxMC42MDJWNTEuOTkzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02NS4zNDQgNDAuMjZMNDYuMTg5IDUxLjk3OXYyMi44NDdsMTYuODk5LTEwLjU3NiAxMi41MzkgNi45NzQgMi42MDktMS41MDV2LTIuNzY1bC0xMi43ODQtNy4xMTJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Kubernetes Engine');
			})
		);

		fns.push(
			this.addEntry(dt + 'container optimized os operating sysyem', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Container-\nOptimized OS', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwIDBhMTAgMTAgMCAxIDAgMTAgMTBoMEExMCAxMCAwIDAgMCAxMCAwem0wIDE4YTggOCAwIDAgMS00LjE4LTEuMThsMy41OC0yLjA3aDB2LTQuNUw1LjUxIDh2NC41MmwyLjc1IDEuNTktMy40NiAyQTggOCAwIDAgMSA2LjA4IDN2NGgwTDEwIDkuMjggMTMuOSA3IDEwIDQuNzcgNy4yNCA2LjM2VjIuNDdhOCA4IDAgMCAxIDEwLjMxIDQuNyA4LjEgOC4xIDAgMCAxIC41MSAyLjgzdi4wN0wxNC40NiA4aDBsLTMuOSAyLjI2djQuNTFsMy45LTIuMjVWOS4zNGwzLjQ1IDJBOCA4IDAgMCAxIDEwIDE4eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Container-Optimized OS');
			})
		);

		fns.push(
			this.addEntry(dt + 'container optimized os operating system', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Container-\nOptimized OS', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwIDBhMTAgMTAgMCAxIDAgMTAgMTBoMEExMCAxMCAwIDAgMCAxMCAwem0wIDE4YTggOCAwIDAgMS00LjE4LTEuMThsMy41OC0yLjA3aDB2LTQuNUw1LjUxIDh2NC41MmwyLjc1IDEuNTktMy40NiAyQTggOCAwIDAgMSA2LjA4IDN2NGgwTDEwIDkuMjggMTMuOSA3IDEwIDQuNzcgNy4yNCA2LjM2VjIuNDdhOCA4IDAgMCAxIDEwLjMxIDQuNyA4LjEgOC4xIDAgMCAxIC41MSAyLjgzdi4wN0wxNC40NiA4aDBsLTMuOSAyLjI2djQuNTFsMy45LTIuMjVWOS4zNGwzLjQ1IDJBOCA4IDAgMCAxIDEwIDE4eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Container-Optimized OS');
			})
		);

		fns.push(
			this.addEntry(dt + 'container optimized os operating system', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 218, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Container-Optimized OS', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwIDBhMTAgMTAgMCAxIDAgMTAgMTBoMEExMCAxMCAwIDAgMCAxMCAwem0wIDE4YTggOCAwIDAgMS00LjE4LTEuMThsMy41OC0yLjA3aDB2LTQuNUw1LjUxIDh2NC41MmwyLjc1IDEuNTktMy40NiAyQTggOCAwIDAgMSA2LjA4IDN2NGgwTDEwIDkuMjggMTMuOSA3IDEwIDQuNzcgNy4yNCA2LjM2VjIuNDdhOCA4IDAgMCAxIDEwLjMxIDQuNyA4LjEgOC4xIDAgMCAxIC41MSAyLjgzdi4wN0wxNC40NiA4aDBsLTMuOSAyLjI2djQuNTFsMy45LTIuMjVWOS4zNGwzLjQ1IDJBOCA4IDAgMCAxIDEwIDE4eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Container-Optimized OS');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud run', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Run', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM2NS40NjQ5OTY3NzA0MjQ5MyIgaGVpZ2h0PSIzNzkuMjIyOTk0NDYzNTc3OTUiIHZpZXdCb3g9IjAgMCA5Ni42OTU5OTkxNDU1MDc4MSAxMDAuMzM1OTk4NTM1MTU2MjUiPiYjeGE7PHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjkuNzk0IDEwMC4zMzZMNDYuOTIgNTAuMTY4aDQ5Ljc3NnpNMCA5OS42NzFsMTIuOTc2LTQ5LjUwMkgyOS4yMkwxNi44OTcgOTIuMDU0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOS43OTQgMEw0Ni45MiA1MC4xNjhoNDkuNzc2ek0wIC42NjZsMTIuOTc2IDQ5LjUwMkgyOS4yMkwxNi44OTcgOC4yODN6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Run');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud run', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Run', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM2NS40NjQ5OTY3NzA0MjQ5MyIgaGVpZ2h0PSIzNzkuMjIyOTk0NDYzNTc3OTUiIHZpZXdCb3g9IjAgMCA5Ni42OTU5OTkxNDU1MDc4MSAxMDAuMzM1OTk4NTM1MTU2MjUiPiYjeGE7PHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjkuNzk0IDEwMC4zMzZMNDYuOTIgNTAuMTY4aDQ5Ljc3NnpNMCA5OS42NzFsMTIuOTc2LTQ5LjUwMkgyOS4yMkwxNi44OTcgOTIuMDU0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOS43OTQgMEw0Ni45MiA1MC4xNjhoNDkuNzc2ek0wIC42NjZsMTIuOTc2IDQ5LjUwMkgyOS4yMkwxNi44OTcgOC4yODN6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Run');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud run', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Run', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM2NS40NjQ5OTY3NzA0MjQ5MyIgaGVpZ2h0PSIzNzkuMjIyOTk0NDYzNTc3OTUiIHZpZXdCb3g9IjAgMCA5Ni42OTU5OTkxNDU1MDc4MSAxMDAuMzM1OTk4NTM1MTU2MjUiPiYjeGE7PHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjkuNzk0IDEwMC4zMzZMNDYuOTIgNTAuMTY4aDQ5Ljc3NnpNMCA5OS42NzFsMTIuOTc2LTQ5LjUwMkgyOS4yMkwxNi44OTcgOTIuMDU0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOS43OTQgMEw0Ni45MiA1MC4xNjhoNDkuNzc2ek0wIC42NjZsMTIuOTc2IDQ5LjUwMkgyOS4yMkwxNi44OTcgOC4yODN6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Run');
			})
		);

		fns.push(
			this.addEntry(dt + 'gke on prem', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('GKE on-Prem', 
			    		new mxGeometry(0, 0, 29, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQwMi4zNDMyMDA2ODM1OTM3NSIgaGVpZ2h0PSI0MTYuMDAyNTMyOTU4OTg0NCIgdmlld0JveD0iMCAwLjAwMDQ5OTk2Mzc2MDM3NTk3NjYgNDAyLjM0MzIwMDY4MzU5Mzc1IDQxNi4wMDI1MzI5NTg5ODQ0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM2Ni4xNyA5Mi4wMDNjLTE5LjA1IDAtMzYgMTYuODItMzYgMzUuNzYgMCAxMi42MiA4LjQ2IDI1LjI0IDE5LjA1IDMxLjU1djE0Ny4zbC0xMTAuMDUgNjUuMjEgMTYuOTMgMjcuMzUgMTE4LjUxLTY5LjQyYzQuMjQtMi4xIDguNDctOC40MSA4LjQ3LTE0Ljczdi0xNTUuNjdjMTIuNzEtNi4zNSAxOS4wOS0xOC45MyAxOS4wOS0zMS41NSAyLjA4LTE4Ljk0LTE0Ljg1LTM1LjgtMzYtMzUuOHptLTM4LjExLTIzLjFMMjA5LjU1IDEuNTgzYy00LjI0LTIuMTEtMTAuNTktMi4xMS0xNi45MyAwTDU3LjE3IDc5LjQxM0EzNiAzNiAwIDAgMCAzNiA3My4xMDNjLTE5IDAtMzYgMTYuODMtMzYgMzUuNzZzMTYuOTMgMzUuNzcgMzYgMzUuNzcgMzYtMTYuODMgMzYtMzUuNzdsMTI5LjEtNzMuNjIgMTEwIDYzLjExem0tMTQzLjg5IDI3Ny42OHEtOS41MyAwLTE5IDYuMzFsLTExMC02My4xMXYtMTI2LjIyaC0zNHYxMzQuNjNjMCA2LjMyIDQuMjMgMTIuNjMgOC40NiAxNC43M2wxMTguNTQgNjUuMjF2Mi4xMWMwIDE4LjkzIDE2LjkzIDM1Ljc2IDM2IDM1Ljc2czM2LTE2LjgzIDM2LTM1Ljc2LTE3LTMzLjY2LTM2LTMzLjY2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05Ny4zOCAxMzYuMjEzbDEwNS44MiA1OC45MSAxMDMuNy01OC45MS0xMDMuNy02MXptLTYuMzUgNjcuMzJsMTEyLjE3IDYzLjExdi01MC40OWwtMTEyLjE3LTY1LjIxem0wIDYzLjExbDExMi4xNyA2NS4yMXYtNDQuMTdsLTExMi4xNy02NS4yMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAzLjE3IDIxNi4xMjN2NTAuNTZsMTEyLjE2LTY1LjI5di01MC4zOXptOTItMjBhOC4xNiA4LjE2IDAgMSAxIDguMTYtOC4xNiA4LjE5IDguMTkgMCAwIDEtOC4xNiA4LjE2em0tOTIgOTEuNTJ2NDQuMTZsMTEyLjE2LTY1LjEydi00NC4xNnptOTItMjIuODhhOC4xNiA4LjE2IDAgMSAxIDguMTYtOC4xNiA4LjE5IDguMTkgMCAwIDEtOC4xNiA4LjE2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'GKE on-Prem');
			})
		);

		fns.push(
			this.addEntry(dt + 'gke on prem', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>GKE on-Prem', 
			    		new mxGeometry(0, 0, 29, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQwMi4zNDMyMDA2ODM1OTM3NSIgaGVpZ2h0PSI0MTYuMDAyNTMyOTU4OTg0NCIgdmlld0JveD0iMCAwLjAwMDQ5OTk2Mzc2MDM3NTk3NjYgNDAyLjM0MzIwMDY4MzU5Mzc1IDQxNi4wMDI1MzI5NTg5ODQ0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM2Ni4xNyA5Mi4wMDNjLTE5LjA1IDAtMzYgMTYuODItMzYgMzUuNzYgMCAxMi42MiA4LjQ2IDI1LjI0IDE5LjA1IDMxLjU1djE0Ny4zbC0xMTAuMDUgNjUuMjEgMTYuOTMgMjcuMzUgMTE4LjUxLTY5LjQyYzQuMjQtMi4xIDguNDctOC40MSA4LjQ3LTE0Ljczdi0xNTUuNjdjMTIuNzEtNi4zNSAxOS4wOS0xOC45MyAxOS4wOS0zMS41NSAyLjA4LTE4Ljk0LTE0Ljg1LTM1LjgtMzYtMzUuOHptLTM4LjExLTIzLjFMMjA5LjU1IDEuNTgzYy00LjI0LTIuMTEtMTAuNTktMi4xMS0xNi45MyAwTDU3LjE3IDc5LjQxM0EzNiAzNiAwIDAgMCAzNiA3My4xMDNjLTE5IDAtMzYgMTYuODMtMzYgMzUuNzZzMTYuOTMgMzUuNzcgMzYgMzUuNzcgMzYtMTYuODMgMzYtMzUuNzdsMTI5LjEtNzMuNjIgMTEwIDYzLjExem0tMTQzLjg5IDI3Ny42OHEtOS41MyAwLTE5IDYuMzFsLTExMC02My4xMXYtMTI2LjIyaC0zNHYxMzQuNjNjMCA2LjMyIDQuMjMgMTIuNjMgOC40NiAxNC43M2wxMTguNTQgNjUuMjF2Mi4xMWMwIDE4LjkzIDE2LjkzIDM1Ljc2IDM2IDM1Ljc2czM2LTE2LjgzIDM2LTM1Ljc2LTE3LTMzLjY2LTM2LTMzLjY2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05Ny4zOCAxMzYuMjEzbDEwNS44MiA1OC45MSAxMDMuNy01OC45MS0xMDMuNy02MXptLTYuMzUgNjcuMzJsMTEyLjE3IDYzLjExdi01MC40OWwtMTEyLjE3LTY1LjIxem0wIDYzLjExbDExMi4xNyA2NS4yMXYtNDQuMTdsLTExMi4xNy02NS4yMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAzLjE3IDIxNi4xMjN2NTAuNTZsMTEyLjE2LTY1LjI5di01MC4zOXptOTItMjBhOC4xNiA4LjE2IDAgMSAxIDguMTYtOC4xNiA4LjE5IDguMTkgMCAwIDEtOC4xNiA4LjE2em0tOTIgOTEuNTJ2NDQuMTZsMTEyLjE2LTY1LjEydi00NC4xNnptOTItMjIuODhhOC4xNiA4LjE2IDAgMSAxIDguMTYtOC4xNiA4LjE5IDguMTkgMCAwIDEtOC4xNiA4LjE2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'GKE on-Prem');
			})
		);

		fns.push(
			this.addEntry(dt + 'gke on prem', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>GKE On-Prem', 
			    		new mxGeometry(0, 0, 29, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQwMi4zNDMyMDA2ODM1OTM3NSIgaGVpZ2h0PSI0MTYuMDAyNTMyOTU4OTg0NCIgdmlld0JveD0iMCAwLjAwMDQ5OTk2Mzc2MDM3NTk3NjYgNDAyLjM0MzIwMDY4MzU5Mzc1IDQxNi4wMDI1MzI5NTg5ODQ0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM2Ni4xNyA5Mi4wMDNjLTE5LjA1IDAtMzYgMTYuODItMzYgMzUuNzYgMCAxMi42MiA4LjQ2IDI1LjI0IDE5LjA1IDMxLjU1djE0Ny4zbC0xMTAuMDUgNjUuMjEgMTYuOTMgMjcuMzUgMTE4LjUxLTY5LjQyYzQuMjQtMi4xIDguNDctOC40MSA4LjQ3LTE0Ljczdi0xNTUuNjdjMTIuNzEtNi4zNSAxOS4wOS0xOC45MyAxOS4wOS0zMS41NSAyLjA4LTE4Ljk0LTE0Ljg1LTM1LjgtMzYtMzUuOHptLTM4LjExLTIzLjFMMjA5LjU1IDEuNTgzYy00LjI0LTIuMTEtMTAuNTktMi4xMS0xNi45MyAwTDU3LjE3IDc5LjQxM0EzNiAzNiAwIDAgMCAzNiA3My4xMDNjLTE5IDAtMzYgMTYuODMtMzYgMzUuNzZzMTYuOTMgMzUuNzcgMzYgMzUuNzcgMzYtMTYuODMgMzYtMzUuNzdsMTI5LjEtNzMuNjIgMTEwIDYzLjExem0tMTQzLjg5IDI3Ny42OHEtOS41MyAwLTE5IDYuMzFsLTExMC02My4xMXYtMTI2LjIyaC0zNHYxMzQuNjNjMCA2LjMyIDQuMjMgMTIuNjMgOC40NiAxNC43M2wxMTguNTQgNjUuMjF2Mi4xMWMwIDE4LjkzIDE2LjkzIDM1Ljc2IDM2IDM1Ljc2czM2LTE2LjgzIDM2LTM1Ljc2LTE3LTMzLjY2LTM2LTMzLjY2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05Ny4zOCAxMzYuMjEzbDEwNS44MiA1OC45MSAxMDMuNy01OC45MS0xMDMuNy02MXptLTYuMzUgNjcuMzJsMTEyLjE3IDYzLjExdi01MC40OWwtMTEyLjE3LTY1LjIxem0wIDYzLjExbDExMi4xNyA2NS4yMXYtNDQuMTdsLTExMi4xNy02NS4yMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAzLjE3IDIxNi4xMjN2NTAuNTZsMTEyLjE2LTY1LjI5di01MC4zOXptOTItMjBhOC4xNiA4LjE2IDAgMSAxIDguMTYtOC4xNiA4LjE5IDguMTkgMCAwIDEtOC4xNiA4LjE2em0tOTIgOTEuNTJ2NDQuMTZsMTEyLjE2LTY1LjEydi00NC4xNnptOTItMjIuODhhOC4xNiA4LjE2IDAgMSAxIDguMTYtOC4xNiA4LjE5IDguMTkgMCAwIDEtOC4xNiA4LjE2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'GKE on-Prem');
			})
		);

		this.addPalette('gcp2Compute', 'GCP / Compute', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2APIManagementPalette = function()
	{
		var dt = 'gcp google cloud platform api management ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'api analytics application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('API\nAnalytics', 
			    		new mxGeometry(0, 0, 30, 14), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAxMDAwMDIyODg4MTgzNiIgaGVpZ2h0PSI5LjQ5NDcyOTA0MjA1MzIyMyIgdmlld0JveD0iMC4wMDAyMDYzODQ1NjA0NDI1Mjk2MiAwIDIwLjAxMDAwMDIyODg4MTgzNiA5LjQ5NDcyOTA0MjA1MzIyMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xLjQ3NiA4LjQzYTQuMzEgNC4zMSAwIDEgMSA2LjA3LS40IDMuNjggMy42OCAwIDAgMS0uMzkuNCA0LjMyIDQuMzIgMCAwIDEtNS42OCAwem01LjItNS4yYTMuMDcgMy4wNyAwIDEgMC0uNCA0LjMzIDMgMyAwIDAgMCAuNC0uNCAzLjA3IDMuMDcgMCAwIDAgMC0zLjkzem02LjE5IDUuMmE0LjMxIDQuMzEgMCAxIDEgNi4wNy0uNCAzLjc4IDMuNzggMCAwIDEtLjQuNCA0LjMxIDQuMzEgMCAwIDEtNS42NyAwem01LjItNS4yYTMuMDcgMy4wNyAwIDEgMC0uNCA0LjMzIDMgMyAwIDAgMCAuNC0uNCAzLjA4IDMuMDggMCAwIDAgMC0zLjkzeiIvPiYjeGE7CTxnIGNsYXNzPSJzdDEiPiYjeGE7CQk8Y2lyY2xlIGN4PSI0LjMxNiIgY3k9IjUuMTkiIHI9IjEuNjkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTUuNjk2IiBjeT0iNS4xOSIgcj0iMS42OSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTIuMzk2LjU2YS4zMS4zMSAwIDAgMC0uMTgtLjU2aC00LjQyYS4zMS4zMSAwIDAgMC0uMTguNTYgNS43MyA1LjczIDAgMCAxIDIuMTMgMi45Mi4yOC4yOCAwIDAgMCAuMzYuMTYuMjkuMjkgMCAwIDAgLjE3LS4xNyA1LjY3IDUuNjcgMCAwIDEgMi4xMi0yLjkxeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 23);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'API Analytics');
			})
		);

		fns.push(
			this.addEntry(dt + 'api analytics application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>API Analytics', 
			    		new mxGeometry(0, 0, 30, 14), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAxMDAwMDIyODg4MTgzNiIgaGVpZ2h0PSI5LjQ5NDcyOTA0MjA1MzIyMyIgdmlld0JveD0iMC4wMDAyMDYzODQ1NjA0NDI1Mjk2MiAwIDIwLjAxMDAwMDIyODg4MTgzNiA5LjQ5NDcyOTA0MjA1MzIyMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xLjQ3NiA4LjQzYTQuMzEgNC4zMSAwIDEgMSA2LjA3LS40IDMuNjggMy42OCAwIDAgMS0uMzkuNCA0LjMyIDQuMzIgMCAwIDEtNS42OCAwem01LjItNS4yYTMuMDcgMy4wNyAwIDEgMC0uNCA0LjMzIDMgMyAwIDAgMCAuNC0uNCAzLjA3IDMuMDcgMCAwIDAgMC0zLjkzem02LjE5IDUuMmE0LjMxIDQuMzEgMCAxIDEgNi4wNy0uNCAzLjc4IDMuNzggMCAwIDEtLjQuNCA0LjMxIDQuMzEgMCAwIDEtNS42NyAwem01LjItNS4yYTMuMDcgMy4wNyAwIDEgMC0uNCA0LjMzIDMgMyAwIDAgMCAuNC0uNCAzLjA4IDMuMDggMCAwIDAgMC0zLjkzeiIvPiYjeGE7CTxnIGNsYXNzPSJzdDEiPiYjeGE7CQk8Y2lyY2xlIGN4PSI0LjMxNiIgY3k9IjUuMTkiIHI9IjEuNjkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTUuNjk2IiBjeT0iNS4xOSIgcj0iMS42OSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTIuMzk2LjU2YS4zMS4zMSAwIDAgMC0uMTgtLjU2aC00LjQyYS4zMS4zMSAwIDAgMC0uMTguNTYgNS43MyA1LjczIDAgMCAxIDIuMTMgMi45Mi4yOC4yOCAwIDAgMCAuMzYuMTYuMjkuMjkgMCAwIDAgLjE3LS4xNyA1LjY3IDUuNjcgMCAwIDEgMi4xMi0yLjkxeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 23);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'API Analytics');
			})
		);

		fns.push(
			this.addEntry(dt + 'api analytics application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>API Analytics', 
			    		new mxGeometry(0, 0, 30, 14), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAxMDAwMDIyODg4MTgzNiIgaGVpZ2h0PSI5LjQ5NDcyOTA0MjA1MzIyMyIgdmlld0JveD0iMC4wMDAyMDYzODQ1NjA0NDI1Mjk2MiAwIDIwLjAxMDAwMDIyODg4MTgzNiA5LjQ5NDcyOTA0MjA1MzIyMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xLjQ3NiA4LjQzYTQuMzEgNC4zMSAwIDEgMSA2LjA3LS40IDMuNjggMy42OCAwIDAgMS0uMzkuNCA0LjMyIDQuMzIgMCAwIDEtNS42OCAwem01LjItNS4yYTMuMDcgMy4wNyAwIDEgMC0uNCA0LjMzIDMgMyAwIDAgMCAuNC0uNCAzLjA3IDMuMDcgMCAwIDAgMC0zLjkzem02LjE5IDUuMmE0LjMxIDQuMzEgMCAxIDEgNi4wNy0uNCAzLjc4IDMuNzggMCAwIDEtLjQuNCA0LjMxIDQuMzEgMCAwIDEtNS42NyAwem01LjItNS4yYTMuMDcgMy4wNyAwIDEgMC0uNCA0LjMzIDMgMyAwIDAgMCAuNC0uNCAzLjA4IDMuMDggMCAwIDAgMC0zLjkzeiIvPiYjeGE7CTxnIGNsYXNzPSJzdDEiPiYjeGE7CQk8Y2lyY2xlIGN4PSI0LjMxNiIgY3k9IjUuMTkiIHI9IjEuNjkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTUuNjk2IiBjeT0iNS4xOSIgcj0iMS42OSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTIuMzk2LjU2YS4zMS4zMSAwIDAgMC0uMTgtLjU2aC00LjQyYS4zMS4zMSAwIDAgMC0uMTguNTYgNS43MyA1LjczIDAgMCAxIDIuMTMgMi45Mi4yOC4yOCAwIDAgMCAuMzYuMTYuMjkuMjkgMCAwIDAgLjE3LS4xNyA1LjY3IDUuNjcgMCAwIDEgMi4xMi0yLjkxeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 23);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'API Analytics');
			})
		);

		fns.push(
			this.addEntry(dt + 'apigee sense', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Apigee\nSense', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMDMyOTk3MTMxMzQ3NyIgaGVpZ2h0PSIyMC4wMDAxNjQwMzE5ODI0MjIiIHZpZXdCb3g9Ii0wLjAwMDE2NDgyMzAwOTk4MTc3MzggLTAuMDAwMTY0ODgzMTA5MzkxNjY2OTUgMjAuMDAwMzI5OTcxMzEzNDc3IDIwLjAwMDE2NDAzMTk4MjQyMiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNH0mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNn0mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYX0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOS40MiA3bC0uMzUtLjA5TDE4IDYuNjRsLS4wOS0uMTljLS4wNS0uMDktLjA5LS4xOS0uMTQtLjI5bC0uMTQtLjI3LS4xNi0uMjgtLjE2LS4yNi0uMTctLjI2YTIuMzUgMi4zNSAwIDAgMC0uMTktLjI1bC0uMTktLjI1LS4yLS4yNC0uMi0uMjMtLjI2LS4yMi0uMjItLjIyLS4yNC0uMi0uMjMtLjItLjI1LS4xOS0uMjUtLjE5LS4yNi0uMTctLjI2LS4xNi0uMjgtLjE2LS4yNy0uMTQtLjI5LS4xNC0uMTktLjA4LS4yOS0xLjEyTDEzIC41OGEuNzguNzggMCAwIDAtLjc3LS41OEg3Ljc3QS43OC43OCAwIDAgMCA3IC41OGwtLjA5LjM1LS4yNyAxLjEyLS4xOS4wOC0uMjkuMTQtLjI3LjE0LS4yOC4xNi0uMjYuMTYtLjI2LjE3LS4yNS4xOS0uMjUuMTktLjI0LjItLjIzLjItLjIyLjIyLS4yMi4yMi0uMi4yNGEyLjIgMi4yIDAgMCAwLS4yLjIzYy0uMDcuMDgtLjEzLjE3LS4xOS4yNWEyLjM1IDIuMzUgMCAwIDAtLjE5LjI1bC0uMTcuMjYtLjE2LjI2LS4xNi4yOGMwIC4wOS0uMS4xOC0uMTQuMjdsLS4xNC4yOWMtLjA1LjA5LS4wNi4xMy0uMDguMTlsLTEuMTIuMjlMLjU4IDdhLjc4Ljc4IDAgMCAwLS41OC43N3Y0LjQ2YS43OC43OCAwIDAgMCAuNTguNzVsLjM1LjA5IDEuMTIuMjljMCAuMDYuMDYuMTIuMDguMTlzLjA5LjE5LjE0LjI5bC4xNC4yNy4xNi4yOC4xNi4yNi4xNy4yNmEyLjM1IDIuMzUgMCAwIDAgLjE5LjI1bC4xOS4yNWEyLjIgMi4yIDAgMCAwIC4yLjIzbC4yLjI0LjIyLjIyLjIyLjIyLjI0LjIuMjMuMi4yNS4xOS4yNS4xOS4yNi4xNy4yNi4xNi4yOC4xNi4yNy4xNC4yOS4xNC4xOS4wOC4yOSAxLjEyLjA5LjM1YS43OC43OCAwIDAgMCAuNzUuNThoNC40NmEuNzguNzggMCAwIDAgLjc1LS41OGwuMDktLjM1LjI5LTEuMDcuMTktLjA4LjI5LS4xNC4yNy0uMTQuMjgtLjE2LjI2LS4xNi4yNi0uMTcuMjUtLjE5LjI1LS4xOS4yNC0uMi4yMy0uMi4yMi0uMjIuMjItLjIyLjItLjI0YTIuMiAyLjIgMCAwIDAgLjItLjIzYy4wNy0uMDguMTMtLjE3LjE5LS4yNWEyLjM1IDIuMzUgMCAwIDAgLjE5LS4yNWwuMTctLjI2LjE2LS4yNi4xNi0uMjguMTQtLjI3LjE0LS4yOWMuMDUtLjA5LjA2LS4xMy4wOC0uMTlsMS4xMi0uMjkuMzUtLjA5YS43OC43OCAwIDAgMCAuNTgtLjc1VjcuNzdhLjc4Ljc4IDAgMCAwLS41OC0uNzd6TTEwIDE2LjY3QTYuNjYgNi42NiAwIDEgMSAxNi42NyAxMGE2LjUzIDYuNTMgMCAwIDEtLjE0IDEuMzNBNi42NCA2LjY0IDAgMCAxIDEwIDE2LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCA0Ljg4QTUuMTcgNS4xNyAwIDAgMCA4Ljg5IDVsLjI3IDEuMjNhMy44NiAzLjg2IDAgMSAxLTIuOTMgNC42MSA0IDQgMCAwIDEtLjA5LS44NEg0Ljg4QTUuMTIgNS4xMiAwIDEgMCAxMCA0Ljg4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMCA3LjQyYTIuNiAyLjYgMCAwIDAtLjU2LjA2bC4yNyAxLjI0YTEuMzIgMS4zMiAwIDEgMS0xIDEuNTcgMS40MyAxLjQzIDAgMCAxIDAtLjI5SDcuNDJBMi41OCAyLjU4IDAgMSAwIDEwIDcuNDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Apigee Sense');
			})
		);

		fns.push(
			this.addEntry(dt + 'apigee sense', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Apigee Sense', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMDMyOTk3MTMxMzQ3NyIgaGVpZ2h0PSIyMC4wMDAxNjQwMzE5ODI0MjIiIHZpZXdCb3g9Ii0wLjAwMDE2NDgyMzAwOTk4MTc3MzggLTAuMDAwMTY0ODgzMTA5MzkxNjY2OTUgMjAuMDAwMzI5OTcxMzEzNDc3IDIwLjAwMDE2NDAzMTk4MjQyMiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNH0mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNn0mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYX0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOS40MiA3bC0uMzUtLjA5TDE4IDYuNjRsLS4wOS0uMTljLS4wNS0uMDktLjA5LS4xOS0uMTQtLjI5bC0uMTQtLjI3LS4xNi0uMjgtLjE2LS4yNi0uMTctLjI2YTIuMzUgMi4zNSAwIDAgMC0uMTktLjI1bC0uMTktLjI1LS4yLS4yNC0uMi0uMjMtLjI2LS4yMi0uMjItLjIyLS4yNC0uMi0uMjMtLjItLjI1LS4xOS0uMjUtLjE5LS4yNi0uMTctLjI2LS4xNi0uMjgtLjE2LS4yNy0uMTQtLjI5LS4xNC0uMTktLjA4LS4yOS0xLjEyTDEzIC41OGEuNzguNzggMCAwIDAtLjc3LS41OEg3Ljc3QS43OC43OCAwIDAgMCA3IC41OGwtLjA5LjM1LS4yNyAxLjEyLS4xOS4wOC0uMjkuMTQtLjI3LjE0LS4yOC4xNi0uMjYuMTYtLjI2LjE3LS4yNS4xOS0uMjUuMTktLjI0LjItLjIzLjItLjIyLjIyLS4yMi4yMi0uMi4yNGEyLjIgMi4yIDAgMCAwLS4yLjIzYy0uMDcuMDgtLjEzLjE3LS4xOS4yNWEyLjM1IDIuMzUgMCAwIDAtLjE5LjI1bC0uMTcuMjYtLjE2LjI2LS4xNi4yOGMwIC4wOS0uMS4xOC0uMTQuMjdsLS4xNC4yOWMtLjA1LjA5LS4wNi4xMy0uMDguMTlsLTEuMTIuMjlMLjU4IDdhLjc4Ljc4IDAgMCAwLS41OC43N3Y0LjQ2YS43OC43OCAwIDAgMCAuNTguNzVsLjM1LjA5IDEuMTIuMjljMCAuMDYuMDYuMTIuMDguMTlzLjA5LjE5LjE0LjI5bC4xNC4yNy4xNi4yOC4xNi4yNi4xNy4yNmEyLjM1IDIuMzUgMCAwIDAgLjE5LjI1bC4xOS4yNWEyLjIgMi4yIDAgMCAwIC4yLjIzbC4yLjI0LjIyLjIyLjIyLjIyLjI0LjIuMjMuMi4yNS4xOS4yNS4xOS4yNi4xNy4yNi4xNi4yOC4xNi4yNy4xNC4yOS4xNC4xOS4wOC4yOSAxLjEyLjA5LjM1YS43OC43OCAwIDAgMCAuNzUuNThoNC40NmEuNzguNzggMCAwIDAgLjc1LS41OGwuMDktLjM1LjI5LTEuMDcuMTktLjA4LjI5LS4xNC4yNy0uMTQuMjgtLjE2LjI2LS4xNi4yNi0uMTcuMjUtLjE5LjI1LS4xOS4yNC0uMi4yMy0uMi4yMi0uMjIuMjItLjIyLjItLjI0YTIuMiAyLjIgMCAwIDAgLjItLjIzYy4wNy0uMDguMTMtLjE3LjE5LS4yNWEyLjM1IDIuMzUgMCAwIDAgLjE5LS4yNWwuMTctLjI2LjE2LS4yNi4xNi0uMjguMTQtLjI3LjE0LS4yOWMuMDUtLjA5LjA2LS4xMy4wOC0uMTlsMS4xMi0uMjkuMzUtLjA5YS43OC43OCAwIDAgMCAuNTgtLjc1VjcuNzdhLjc4Ljc4IDAgMCAwLS41OC0uNzd6TTEwIDE2LjY3QTYuNjYgNi42NiAwIDEgMSAxNi42NyAxMGE2LjUzIDYuNTMgMCAwIDEtLjE0IDEuMzNBNi42NCA2LjY0IDAgMCAxIDEwIDE2LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCA0Ljg4QTUuMTcgNS4xNyAwIDAgMCA4Ljg5IDVsLjI3IDEuMjNhMy44NiAzLjg2IDAgMSAxLTIuOTMgNC42MSA0IDQgMCAwIDEtLjA5LS44NEg0Ljg4QTUuMTIgNS4xMiAwIDEgMCAxMCA0Ljg4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMCA3LjQyYTIuNiAyLjYgMCAwIDAtLjU2LjA2bC4yNyAxLjI0YTEuMzIgMS4zMiAwIDEgMS0xIDEuNTcgMS40MyAxLjQzIDAgMCAxIDAtLjI5SDcuNDJBMi41OCAyLjU4IDAgMSAwIDEwIDcuNDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Apigee Sense');
			})
		);

		fns.push(
			this.addEntry(dt + 'apigee sense', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Apigee Sense', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMDMyOTk3MTMxMzQ3NyIgaGVpZ2h0PSIyMC4wMDAxNjQwMzE5ODI0MjIiIHZpZXdCb3g9Ii0wLjAwMDE2NDgyMzAwOTk4MTc3MzggLTAuMDAwMTY0ODgzMTA5MzkxNjY2OTUgMjAuMDAwMzI5OTcxMzEzNDc3IDIwLjAwMDE2NDAzMTk4MjQyMiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNH0mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNn0mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYX0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOS40MiA3bC0uMzUtLjA5TDE4IDYuNjRsLS4wOS0uMTljLS4wNS0uMDktLjA5LS4xOS0uMTQtLjI5bC0uMTQtLjI3LS4xNi0uMjgtLjE2LS4yNi0uMTctLjI2YTIuMzUgMi4zNSAwIDAgMC0uMTktLjI1bC0uMTktLjI1LS4yLS4yNC0uMi0uMjMtLjI2LS4yMi0uMjItLjIyLS4yNC0uMi0uMjMtLjItLjI1LS4xOS0uMjUtLjE5LS4yNi0uMTctLjI2LS4xNi0uMjgtLjE2LS4yNy0uMTQtLjI5LS4xNC0uMTktLjA4LS4yOS0xLjEyTDEzIC41OGEuNzguNzggMCAwIDAtLjc3LS41OEg3Ljc3QS43OC43OCAwIDAgMCA3IC41OGwtLjA5LjM1LS4yNyAxLjEyLS4xOS4wOC0uMjkuMTQtLjI3LjE0LS4yOC4xNi0uMjYuMTYtLjI2LjE3LS4yNS4xOS0uMjUuMTktLjI0LjItLjIzLjItLjIyLjIyLS4yMi4yMi0uMi4yNGEyLjIgMi4yIDAgMCAwLS4yLjIzYy0uMDcuMDgtLjEzLjE3LS4xOS4yNWEyLjM1IDIuMzUgMCAwIDAtLjE5LjI1bC0uMTcuMjYtLjE2LjI2LS4xNi4yOGMwIC4wOS0uMS4xOC0uMTQuMjdsLS4xNC4yOWMtLjA1LjA5LS4wNi4xMy0uMDguMTlsLTEuMTIuMjlMLjU4IDdhLjc4Ljc4IDAgMCAwLS41OC43N3Y0LjQ2YS43OC43OCAwIDAgMCAuNTguNzVsLjM1LjA5IDEuMTIuMjljMCAuMDYuMDYuMTIuMDguMTlzLjA5LjE5LjE0LjI5bC4xNC4yNy4xNi4yOC4xNi4yNi4xNy4yNmEyLjM1IDIuMzUgMCAwIDAgLjE5LjI1bC4xOS4yNWEyLjIgMi4yIDAgMCAwIC4yLjIzbC4yLjI0LjIyLjIyLjIyLjIyLjI0LjIuMjMuMi4yNS4xOS4yNS4xOS4yNi4xNy4yNi4xNi4yOC4xNi4yNy4xNC4yOS4xNC4xOS4wOC4yOSAxLjEyLjA5LjM1YS43OC43OCAwIDAgMCAuNzUuNThoNC40NmEuNzguNzggMCAwIDAgLjc1LS41OGwuMDktLjM1LjI5LTEuMDcuMTktLjA4LjI5LS4xNC4yNy0uMTQuMjgtLjE2LjI2LS4xNi4yNi0uMTcuMjUtLjE5LjI1LS4xOS4yNC0uMi4yMy0uMi4yMi0uMjIuMjItLjIyLjItLjI0YTIuMiAyLjIgMCAwIDAgLjItLjIzYy4wNy0uMDguMTMtLjE3LjE5LS4yNWEyLjM1IDIuMzUgMCAwIDAgLjE5LS4yNWwuMTctLjI2LjE2LS4yNi4xNi0uMjguMTQtLjI3LjE0LS4yOWMuMDUtLjA5LjA2LS4xMy4wOC0uMTlsMS4xMi0uMjkuMzUtLjA5YS43OC43OCAwIDAgMCAuNTgtLjc1VjcuNzdhLjc4Ljc4IDAgMCAwLS41OC0uNzd6TTEwIDE2LjY3QTYuNjYgNi42NiAwIDEgMSAxNi42NyAxMGE2LjUzIDYuNTMgMCAwIDEtLjE0IDEuMzNBNi42NCA2LjY0IDAgMCAxIDEwIDE2LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCA0Ljg4QTUuMTcgNS4xNyAwIDAgMCA4Ljg5IDVsLjI3IDEuMjNhMy44NiAzLjg2IDAgMSAxLTIuOTMgNC42MSA0IDQgMCAwIDEtLjA5LS44NEg0Ljg4QTUuMTIgNS4xMiAwIDEgMCAxMCA0Ljg4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMCA3LjQyYTIuNiAyLjYgMCAwIDAtLjU2LjA2bC4yNyAxLjI0YTEuMzIgMS4zMiAwIDEgMS0xIDEuNTcgMS40MyAxLjQzIDAgMCAxIDAtLjI5SDcuNDJBMi41OCAyLjU4IDAgMSAwIDEwIDcuNDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Apigee Sense');
			})
		);

		fns.push(
			this.addEntry(dt + 'api monetization application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('API\nMonetization', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMwMDAwMTE0NDQwOTE4IiBoZWlnaHQ9IjE5LjgyNjUwNTY2MTAxMDc0MiIgdmlld0JveD0iLTguNzkxNTE5NjkwMDIxMjMyZS04IDAgMTguMzAwMDAxMTQ0NDA5MTggMTkuODI2NTA1NjYxMDEwNzQyIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhfSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMuMDEgMTguNDlhMS41MSAxLjUxIDAgMCAxLTMgMGgwdi00LjI4YTEuNTEgMS41MSAwIDEgMSAzIDB6bTUuMTMgMGExLjUxIDEuNTEgMCAwIDEtMyAwaDB2LTQuMjhhMS41MSAxLjUxIDAgMCAxIDMgMHptNS4wNiAwYTEuNTEgMS41MSAwIDAgMS0zIDB2LTQuMjhhMS41MSAxLjUxIDAgMCAxIDMgMHptNS4wOSAwYTEuNTEgMS41MSAwIDAgMS0zIDB2LTQuMjhhMS41MSAxLjUxIDAgMSAxIDMgMHoiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSI2LjU5IiBjeT0iOS45NyIgcj0iMS41MSIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjExLjY5IiBjeT0iOS45NyIgcj0iMS41MSIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjExLjY5IiBjeT0iNS43NCIgcj0iMS41MSIvPiYjeGE7CTxnIGNsYXNzPSJzdDIiPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNi43OCIgY3k9IjkuOTciIHI9IjEuNTEiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuNzgiIGN5PSI1Ljc0IiByPSIxLjUxIi8+JiN4YTsJPC9nPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE2Ljc4IiBjeT0iMS41MSIgcj0iMS41MSIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'API Monetization');
			})
		);

		fns.push(
			this.addEntry(dt + 'api monetization application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>API Monetization', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMwMDAwMTE0NDQwOTE4IiBoZWlnaHQ9IjE5LjgyNjUwNTY2MTAxMDc0MiIgdmlld0JveD0iLTguNzkxNTE5NjkwMDIxMjMyZS04IDAgMTguMzAwMDAxMTQ0NDA5MTggMTkuODI2NTA1NjYxMDEwNzQyIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhfSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMuMDEgMTguNDlhMS41MSAxLjUxIDAgMCAxLTMgMGgwdi00LjI4YTEuNTEgMS41MSAwIDEgMSAzIDB6bTUuMTMgMGExLjUxIDEuNTEgMCAwIDEtMyAwaDB2LTQuMjhhMS41MSAxLjUxIDAgMCAxIDMgMHptNS4wNiAwYTEuNTEgMS41MSAwIDAgMS0zIDB2LTQuMjhhMS41MSAxLjUxIDAgMCAxIDMgMHptNS4wOSAwYTEuNTEgMS41MSAwIDAgMS0zIDB2LTQuMjhhMS41MSAxLjUxIDAgMSAxIDMgMHoiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSI2LjU5IiBjeT0iOS45NyIgcj0iMS41MSIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjExLjY5IiBjeT0iOS45NyIgcj0iMS41MSIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjExLjY5IiBjeT0iNS43NCIgcj0iMS41MSIvPiYjeGE7CTxnIGNsYXNzPSJzdDIiPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNi43OCIgY3k9IjkuOTciIHI9IjEuNTEiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuNzgiIGN5PSI1Ljc0IiByPSIxLjUxIi8+JiN4YTsJPC9nPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE2Ljc4IiBjeT0iMS41MSIgcj0iMS41MSIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'API Monetization');
			})
		);

		fns.push(
			this.addEntry(dt + 'api monetization application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 178, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>API Monetization', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMwMDAwMTE0NDQwOTE4IiBoZWlnaHQ9IjE5LjgyNjUwNTY2MTAxMDc0MiIgdmlld0JveD0iLTguNzkxNTE5NjkwMDIxMjMyZS04IDAgMTguMzAwMDAxMTQ0NDA5MTggMTkuODI2NTA1NjYxMDEwNzQyIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhfSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMuMDEgMTguNDlhMS41MSAxLjUxIDAgMCAxLTMgMGgwdi00LjI4YTEuNTEgMS41MSAwIDEgMSAzIDB6bTUuMTMgMGExLjUxIDEuNTEgMCAwIDEtMyAwaDB2LTQuMjhhMS41MSAxLjUxIDAgMCAxIDMgMHptNS4wNiAwYTEuNTEgMS41MSAwIDAgMS0zIDB2LTQuMjhhMS41MSAxLjUxIDAgMCAxIDMgMHptNS4wOSAwYTEuNTEgMS41MSAwIDAgMS0zIDB2LTQuMjhhMS41MSAxLjUxIDAgMSAxIDMgMHoiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSI2LjU5IiBjeT0iOS45NyIgcj0iMS41MSIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjExLjY5IiBjeT0iOS45NyIgcj0iMS41MSIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjExLjY5IiBjeT0iNS43NCIgcj0iMS41MSIvPiYjeGE7CTxnIGNsYXNzPSJzdDIiPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNi43OCIgY3k9IjkuOTciIHI9IjEuNTEiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuNzgiIGN5PSI1Ljc0IiByPSIxLjUxIi8+JiN4YTsJPC9nPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE2Ljc4IiBjeT0iMS41MSIgcj0iMS41MSIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'API Monetization');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud endpoints', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nEndpoints', 
			    		new mxGeometry(0, 0, 30, 18), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk1MDAwMDc2MjkzOTQ1MyIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDE5Ljk1MDAwMDc2MjkzOTQ1MyAxMiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNH0mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYX0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02IDZsMSAyaDZsMS0yLTEtMkg3eiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjUxIDRIN0w2IDZoOGwtMS0yeiIgZmlsbD0iI2FlY2JmYSIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNi45NyA2bDEuNS0yLjI1TDE2IDBoLTN6IiBmaWxsPSIjNDI4NWY0Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2Ljk3IDZoMEwxMyAxMmgzbDMuOTUtNi0xLjQ4LTIuMjV6IiBmaWxsPSIjYWVjYmZhIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuOTggNmwtMS41IDIuMjVMMy45NSAxMmgzeiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yLjk4IDZoMGwzLjk3LTZoLTNMMCA2bDEuNDggMi4yNXoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 21);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Endpoints');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud endpoints', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Endpoints', 
			    		new mxGeometry(0, 0, 30, 18), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk1MDAwMDc2MjkzOTQ1MyIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDE5Ljk1MDAwMDc2MjkzOTQ1MyAxMiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNH0mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYX0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02IDZsMSAyaDZsMS0yLTEtMkg3eiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjUxIDRIN0w2IDZoOGwtMS0yeiIgZmlsbD0iI2FlY2JmYSIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNi45NyA2bDEuNS0yLjI1TDE2IDBoLTN6IiBmaWxsPSIjNDI4NWY0Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2Ljk3IDZoMEwxMyAxMmgzbDMuOTUtNi0xLjQ4LTIuMjV6IiBmaWxsPSIjYWVjYmZhIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuOTggNmwtMS41IDIuMjVMMy45NSAxMmgzeiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yLjk4IDZoMGwzLjk3LTZoLTNMMCA2bDEuNDggMi4yNXoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 21);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Endpoints');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud endpoints', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 168, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Endpoints', 
			    		new mxGeometry(0, 0, 30, 18), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk1MDAwMDc2MjkzOTQ1MyIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDE5Ljk1MDAwMDc2MjkzOTQ1MyAxMiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNH0mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYX0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02IDZsMSAyaDZsMS0yLTEtMkg3eiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjUxIDRIN0w2IDZoOGwtMS0yeiIgZmlsbD0iI2FlY2JmYSIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNi45NyA2bDEuNS0yLjI1TDE2IDBoLTN6IiBmaWxsPSIjNDI4NWY0Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2Ljk3IDZoMEwxMyAxMmgzbDMuOTUtNi0xLjQ4LTIuMjV6IiBmaWxsPSIjYWVjYmZhIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuOTggNmwtMS41IDIuMjVMMy45NSAxMmgzeiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yLjk4IDZoMGwzLjk3LTZoLTNMMCA2bDEuNDggMi4yNXoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 21);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Endpoints');
			})
		);

		fns.push(
			this.addEntry(dt + 'apigee platform', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Apigee\nPlatform', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjE4MDIzMTA5NDM2MDM1IiBoZWlnaHQ9IjIwLjE4MDIwODIwNjE3Njc1OCIgdmlld0JveD0iLTAuMDAwMTE1MTY1MTIzMTMzOTIwMTMgLTAuMDAwMTAzMzQ0NDkzMjU0NTUzNTMgMjAuMTgwMjMxMDk0MzYwMzUgMjAuMTgwMjA4MjA2MTc2NzU4Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbC1ydWxlOmV2ZW5vZGQ7ZmlsbDojNDI4NWY0fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMuMjkgMTAuMDlsMS4zMi0xLjMyLTEuNzktMS43OWEyLjk0IDIuOTQgMCAwIDEgMi4wOC01IDIuOTIgMi45MiAwIDAgMSAyLjA3Ljg2bDEuOCAxLjc5IDEuMzItMS4zNEw4LjMgMS41YTQuODEgNC44MSAwIDEgMC02LjggNi44em0xMy42IDBsLTEuMzIgMS4zMiAxLjc5IDEuOGEyLjk0IDIuOTQgMCAwIDEtNC4xNiA0LjE1bC0xLjc5LTEuNzktMS4zMiAxLjMyIDEuNzkgMS43OWE0LjgxIDQuODEgMCAxIDAgNi44LTYuOHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNi45OCAxNy4zNmEyLjk0IDIuOTQgMCAxIDEtNC4xNi00LjE2bDEuNzktMS43OSA0LjE2IDQuMTZ6bTYuMjMtMTQuNTRhMi45MyAyLjkzIDAgMCAxIDUgMi4wOCAzIDMgMCAwIDEtLjg2IDIuMDhsLTEuNzkgMS43OS00LjE1LTQuMTZ6bS0zLjEyIDEwLjQ2YTMuMiAzLjIgMCAwIDEtMy4xOS0zLjE5aDBhMy4yMSAzLjIxIDAgMCAxIDMuMTktMy4xOWgwYTMuMjEgMy4yMSAwIDAgMSAzLjE5IDMuMTloMGEzLjIgMy4yIDAgMCAxLTMuMTkgMy4xOXptNi44LTMuMTlsMS43OS0xLjc5QTQuODEgNC44MSAwIDAgMCAxNi41NzQuMTUzIDQuODEgNC44MSAwIDAgMCAxMS44OCAxLjVsLTEuNzkgMS43OS02LjggNi44LTEuNzkgMS43OWE0LjgxIDQuODEgMCAwIDAgMi4xMDYgOC4xNDdBNC44MSA0LjgxIDAgMCAwIDguMyAxOC42OGwxLjc5LTEuNzl6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Apigee Platform');
			})
		);

		fns.push(
			this.addEntry(dt + 'apigee platform', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Apigee Platform', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjE4MDIzMTA5NDM2MDM1IiBoZWlnaHQ9IjIwLjE4MDIwODIwNjE3Njc1OCIgdmlld0JveD0iLTAuMDAwMTE1MTY1MTIzMTMzOTIwMTMgLTAuMDAwMTAzMzQ0NDkzMjU0NTUzNTMgMjAuMTgwMjMxMDk0MzYwMzUgMjAuMTgwMjA4MjA2MTc2NzU4Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbC1ydWxlOmV2ZW5vZGQ7ZmlsbDojNDI4NWY0fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMuMjkgMTAuMDlsMS4zMi0xLjMyLTEuNzktMS43OWEyLjk0IDIuOTQgMCAwIDEgMi4wOC01IDIuOTIgMi45MiAwIDAgMSAyLjA3Ljg2bDEuOCAxLjc5IDEuMzItMS4zNEw4LjMgMS41YTQuODEgNC44MSAwIDEgMC02LjggNi44em0xMy42IDBsLTEuMzIgMS4zMiAxLjc5IDEuOGEyLjk0IDIuOTQgMCAwIDEtNC4xNiA0LjE1bC0xLjc5LTEuNzktMS4zMiAxLjMyIDEuNzkgMS43OWE0LjgxIDQuODEgMCAxIDAgNi44LTYuOHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNi45OCAxNy4zNmEyLjk0IDIuOTQgMCAxIDEtNC4xNi00LjE2bDEuNzktMS43OSA0LjE2IDQuMTZ6bTYuMjMtMTQuNTRhMi45MyAyLjkzIDAgMCAxIDUgMi4wOCAzIDMgMCAwIDEtLjg2IDIuMDhsLTEuNzkgMS43OS00LjE1LTQuMTZ6bS0zLjEyIDEwLjQ2YTMuMiAzLjIgMCAwIDEtMy4xOS0zLjE5aDBhMy4yMSAzLjIxIDAgMCAxIDMuMTktMy4xOWgwYTMuMjEgMy4yMSAwIDAgMSAzLjE5IDMuMTloMGEzLjIgMy4yIDAgMCAxLTMuMTkgMy4xOXptNi44LTMuMTlsMS43OS0xLjc5QTQuODEgNC44MSAwIDAgMCAxNi41NzQuMTUzIDQuODEgNC44MSAwIDAgMCAxMS44OCAxLjVsLTEuNzkgMS43OS02LjggNi44LTEuNzkgMS43OWE0LjgxIDQuODEgMCAwIDAgMi4xMDYgOC4xNDdBNC44MSA0LjgxIDAgMCAwIDguMyAxOC42OGwxLjc5LTEuNzl6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Apigee Platform');
			})
		);

		fns.push(
			this.addEntry(dt + 'apigee platform', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 168, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Apigee Platform', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjE4MDIzMTA5NDM2MDM1IiBoZWlnaHQ9IjIwLjE4MDIwODIwNjE3Njc1OCIgdmlld0JveD0iLTAuMDAwMTE1MTY1MTIzMTMzOTIwMTMgLTAuMDAwMTAzMzQ0NDkzMjU0NTUzNTMgMjAuMTgwMjMxMDk0MzYwMzUgMjAuMTgwMjA4MjA2MTc2NzU4Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbC1ydWxlOmV2ZW5vZGQ7ZmlsbDojNDI4NWY0fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMuMjkgMTAuMDlsMS4zMi0xLjMyLTEuNzktMS43OWEyLjk0IDIuOTQgMCAwIDEgMi4wOC01IDIuOTIgMi45MiAwIDAgMSAyLjA3Ljg2bDEuOCAxLjc5IDEuMzItMS4zNEw4LjMgMS41YTQuODEgNC44MSAwIDEgMC02LjggNi44em0xMy42IDBsLTEuMzIgMS4zMiAxLjc5IDEuOGEyLjk0IDIuOTQgMCAwIDEtNC4xNiA0LjE1bC0xLjc5LTEuNzktMS4zMiAxLjMyIDEuNzkgMS43OWE0LjgxIDQuODEgMCAxIDAgNi44LTYuOHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNi45OCAxNy4zNmEyLjk0IDIuOTQgMCAxIDEtNC4xNi00LjE2bDEuNzktMS43OSA0LjE2IDQuMTZ6bTYuMjMtMTQuNTRhMi45MyAyLjkzIDAgMCAxIDUgMi4wOCAzIDMgMCAwIDEtLjg2IDIuMDhsLTEuNzkgMS43OS00LjE1LTQuMTZ6bS0zLjEyIDEwLjQ2YTMuMiAzLjIgMCAwIDEtMy4xOS0zLjE5aDBhMy4yMSAzLjIxIDAgMCAxIDMuMTktMy4xOWgwYTMuMjEgMy4yMSAwIDAgMSAzLjE5IDMuMTloMGEzLjIgMy4yIDAgMCAxLTMuMTkgMy4xOXptNi44LTMuMTlsMS43OS0xLjc5QTQuODEgNC44MSAwIDAgMCAxNi41NzQuMTUzIDQuODEgNC44MSAwIDAgMCAxMS44OCAxLjVsLTEuNzkgMS43OS02LjggNi44LTEuNzkgMS43OWE0LjgxIDQuODEgMCAwIDAgMi4xMDYgOC4xNDdBNC44MSA0LjgxIDAgMCAwIDguMyAxOC42OGwxLjc5LTEuNzl6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Apigee Platform');
			})
		);

		fns.push(
			this.addEntry(dt + 'developer portal', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Developer\nPortal', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0LjE0MzAxOTY3NjIwODQ5NiIgdmlld0JveD0iMCAwLjAwMDQ4OTk2NjI0NTM2ODEyMzEgMjAgMTQuMTQzMDE5Njc2MjA4NDk2Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMS40NzJhNS41OSA1LjU5IDAgMCAxIDQgMS42bDEtMWE3LjA3IDcuMDcgMCAwIDAtMTAgMGgwbDEgMWE1LjU5IDUuNTkgMCAwIDEgNC0xLjZ6bTAgMTEuMmE1LjU5IDUuNTkgMCAwIDEtNC0xLjZsLTEgMWE3LjA3IDcuMDcgMCAwIDAgMTAgMGgwbC0xLTFhNS41OSA1LjU5IDAgMCAxLTQgMS42eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCAxMC4xNDJhMy4wNiAzLjA2IDAgMCAxLTMtMi4zNEgzLjExdjIuMzhMMCA3LjA3MmwzLjExLTMuMXYyLjM4SDdhMy4wNiAzLjA2IDAgMCAxIDMtMi4zNGgwYTMuMDYgMy4wNiAwIDAgMSAzIDIuMzRoMy45MXYtMi4zOUwyMCA3LjA3MmwtMy4xMSAzLjEydi0yLjM5SDEzYTMuMDYgMy4wNiAwIDAgMS0zIDIuMzR6bTAtNC42OGExLjYxIDEuNjEgMCAxIDAgMS42MSAxLjYxaDBBMS42MSAxLjYxIDAgMCAwIDEwIDUuNDYyeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19.5);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Developer Portal');
			})
		);

		fns.push(
			this.addEntry(dt + 'developer portal', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Developer Portal', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0LjE0MzAxOTY3NjIwODQ5NiIgdmlld0JveD0iMCAwLjAwMDQ4OTk2NjI0NTM2ODEyMzEgMjAgMTQuMTQzMDE5Njc2MjA4NDk2Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMS40NzJhNS41OSA1LjU5IDAgMCAxIDQgMS42bDEtMWE3LjA3IDcuMDcgMCAwIDAtMTAgMGgwbDEgMWE1LjU5IDUuNTkgMCAwIDEgNC0xLjZ6bTAgMTEuMmE1LjU5IDUuNTkgMCAwIDEtNC0xLjZsLTEgMWE3LjA3IDcuMDcgMCAwIDAgMTAgMGgwbC0xLTFhNS41OSA1LjU5IDAgMCAxLTQgMS42eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCAxMC4xNDJhMy4wNiAzLjA2IDAgMCAxLTMtMi4zNEgzLjExdjIuMzhMMCA3LjA3MmwzLjExLTMuMXYyLjM4SDdhMy4wNiAzLjA2IDAgMCAxIDMtMi4zNGgwYTMuMDYgMy4wNiAwIDAgMSAzIDIuMzRoMy45MXYtMi4zOUwyMCA3LjA3MmwtMy4xMSAzLjEydi0yLjM5SDEzYTMuMDYgMy4wNiAwIDAgMS0zIDIuMzR6bTAtNC42OGExLjYxIDEuNjEgMCAxIDAgMS42MSAxLjYxaDBBMS42MSAxLjYxIDAgMCAwIDEwIDUuNDYyeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19.5);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Developer Portal');
			})
		);

		fns.push(
			this.addEntry(dt + 'developer portal', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 178, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Developer Portal', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0LjE0MzAxOTY3NjIwODQ5NiIgdmlld0JveD0iMCAwLjAwMDQ4OTk2NjI0NTM2ODEyMzEgMjAgMTQuMTQzMDE5Njc2MjA4NDk2Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMS40NzJhNS41OSA1LjU5IDAgMCAxIDQgMS42bDEtMWE3LjA3IDcuMDcgMCAwIDAtMTAgMGgwbDEgMWE1LjU5IDUuNTkgMCAwIDEgNC0xLjZ6bTAgMTEuMmE1LjU5IDUuNTkgMCAwIDEtNC0xLjZsLTEgMWE3LjA3IDcuMDcgMCAwIDAgMTAgMGgwbC0xLTFhNS41OSA1LjU5IDAgMCAxLTQgMS42eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCAxMC4xNDJhMy4wNiAzLjA2IDAgMCAxLTMtMi4zNEgzLjExdjIuMzhMMCA3LjA3MmwzLjExLTMuMXYyLjM4SDdhMy4wNiAzLjA2IDAgMCAxIDMtMi4zNGgwYTMuMDYgMy4wNiAwIDAgMSAzIDIuMzRoMy45MXYtMi4zOUwyMCA3LjA3MmwtMy4xMSAzLjEydi0yLjM5SDEzYTMuMDYgMy4wNiAwIDAgMS0zIDIuMzR6bTAtNC42OGExLjYxIDEuNjEgMCAxIDAgMS42MSAxLjYxaDBBMS42MSAxLjYxIDAgMCAwIDEwIDUuNDYyeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19.5);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Developer Portal');
			})
		);

		this.addPalette('gcp2API Management', 'GCP / API Management', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2SecurityPalette = function()
	{
		var dt = 'gcp google cloud platform security ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'cloud iam', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nIAM', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjQyMDAwMDA3NjI5Mzk0NSIgaGVpZ2h0PSIyMC4wNDk5OTkyMzcwNjA1NDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDE2LjQyMDAwMDA3NjI5Mzk0NSAyMC4wNDk5OTkyMzcwNjA1NDciPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LjIxIDBMMCAzLjQydjUuNjNjMCA1LjA2IDMuNSA5LjggOC4yMSAxMSA0LjcxLTEuMTUgOC4yMS01Ljg5IDguMjEtMTAuOTVWMy40MnptMCAzLjc5YTIuNjMgMi42MyAwIDAgMSAxLjAwNSA1LjA2QTIuNjMgMi42MyAwIDAgMSA2LjM1IDQuNTZhMi42MyAyLjYzIDAgMCAxIDEuODYtLjc3em00LjExIDExLjE1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTMgOC42NCA4LjY0IDAgMCAxLTQuMTEtMi45M3YtMi4yNWMwLTEuNjcgMi43NC0yLjUyIDQuMTEtMi41MnM0LjExLjg1IDQuMTEgMi41MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOC4yMSAwdjMuNzlhMi42MyAyLjYzIDAgMSAxIDAgNS4yNnYxLjEyYzEuMzcgMCA0LjExLjg1IDQuMTEgMi41MnYyLjI1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTNWMjBjNC43MS0xLjE1IDguMjEtNS44OSA4LjIxLTEwLjk1VjMuNDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud IAM');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud iam', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud IAM', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjQyMDAwMDA3NjI5Mzk0NSIgaGVpZ2h0PSIyMC4wNDk5OTkyMzcwNjA1NDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDE2LjQyMDAwMDA3NjI5Mzk0NSAyMC4wNDk5OTkyMzcwNjA1NDciPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LjIxIDBMMCAzLjQydjUuNjNjMCA1LjA2IDMuNSA5LjggOC4yMSAxMSA0LjcxLTEuMTUgOC4yMS01Ljg5IDguMjEtMTAuOTVWMy40MnptMCAzLjc5YTIuNjMgMi42MyAwIDAgMSAxLjAwNSA1LjA2QTIuNjMgMi42MyAwIDAgMSA2LjM1IDQuNTZhMi42MyAyLjYzIDAgMCAxIDEuODYtLjc3em00LjExIDExLjE1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTMgOC42NCA4LjY0IDAgMCAxLTQuMTEtMi45M3YtMi4yNWMwLTEuNjcgMi43NC0yLjUyIDQuMTEtMi41MnM0LjExLjg1IDQuMTEgMi41MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOC4yMSAwdjMuNzlhMi42MyAyLjYzIDAgMSAxIDAgNS4yNnYxLjEyYzEuMzcgMCA0LjExLjg1IDQuMTEgMi41MnYyLjI1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTNWMjBjNC43MS0xLjE1IDguMjEtNS44OSA4LjIxLTEwLjk1VjMuNDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud IAM');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud iam', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud IAM', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjQyMDAwMDA3NjI5Mzk0NSIgaGVpZ2h0PSIyMC4wNDk5OTkyMzcwNjA1NDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDE2LjQyMDAwMDA3NjI5Mzk0NSAyMC4wNDk5OTkyMzcwNjA1NDciPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LjIxIDBMMCAzLjQydjUuNjNjMCA1LjA2IDMuNSA5LjggOC4yMSAxMSA0LjcxLTEuMTUgOC4yMS01Ljg5IDguMjEtMTAuOTVWMy40MnptMCAzLjc5YTIuNjMgMi42MyAwIDAgMSAxLjAwNSA1LjA2QTIuNjMgMi42MyAwIDAgMSA2LjM1IDQuNTZhMi42MyAyLjYzIDAgMCAxIDEuODYtLjc3em00LjExIDExLjE1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTMgOC42NCA4LjY0IDAgMCAxLTQuMTEtMi45M3YtMi4yNWMwLTEuNjcgMi43NC0yLjUyIDQuMTEtMi41MnM0LjExLjg1IDQuMTEgMi41MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOC4yMSAwdjMuNzlhMi42MyAyLjYzIDAgMSAxIDAgNS4yNnYxLjEyYzEuMzcgMCA0LjExLjg1IDQuMTEgMi41MnYyLjI1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTNWMjBjNC43MS0xLjE1IDguMjEtNS44OSA4LjIxLTEwLjk1VjMuNDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud IAM');
			})
		);

		fns.push(
			this.addEntry(dt + 'beyondcorp beyond corp', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('BeyondCorp', 
			    		new mxGeometry(0, 0, 28, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjgyMzUxNDkzODM1NDQ5MiIgaGVpZ2h0PSIyMC4wNzA1Mzc1NjcxMzg2NzIiIHZpZXdCb3g9IjAuMDAwMDExMzM3Nzc3MzIzMjA1OTU1IDAuMDAwMDg1NjY1MDQ0MDI1NTE4IDE4LjgyMzUxNDkzODM1NDQ5MiAyMC4wNzA1Mzc1NjcxMzg2NzIiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE2LjkzIDQuOTc2YTEwLjQzIDEwLjQzIDAgMCAxLTEgLjkyIDguMDkgOC4wOSAwIDAgMS0xMC41MSAxMS44MWgxLjc1YTcuNTEgNy41MSAwIDAgMS0uODYtMS4zSDMuNzNhOC43NSA4Ljc1IDAgMCAxLTEtMS4xOWgzLjA2YTEwLjM4IDEwLjM4IDAgMCAxLS4zNy0xLjMxSDIuMDFhOCA4IDAgMCAxLS40Mi0xLjE5aDMuNTdjLS4wNy0uNDItLjExLS44NS0uMTQtMS4zSDEuMzZhNi41MSA2LjUxIDAgMCAxIDAtLjc3di0uNDNoMy42M2ExMS4zNCAxMS4zNCAwIDAgMSAuMDgtMS4zSDEuNWE4LjE2IDguMTYgMCAwIDEgLjM2LTEuMTloMy40YTkuNTIgOS41MiAwIDAgMSAuMzMtMS4zSDIuNTJhOCA4IDAgMCAxIC45LTEuMTloMi42MWE5LjIgOS4yIDAgMCAxIC43MS0xLjMxSDQuOTJhOC4wNiA4LjA2IDAgMCAxIDcuNzQtLjY5IDEwLjcgMTAuNyAwIDAgMCAxLjI5IDMuMTlzMi45My0xLjY3IDMuMzgtMy40NGEyLjQyIDIuNDIgMCAwIDAtNC42OC0xLjIzdi4wN2E5LjQxIDkuNDEgMCAxIDAgNi4xNyA4LjgyIDguNzEgOC43MSAwIDAgMC0xLjg5LTUuNjd6bS0zLjAxLTIuOTJhMS4xNCAxLjE0IDAgMSAxIC44MSAxLjM5aDBhMS4xMyAxLjEzIDAgMCAxLS44MS0xLjM5eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'BeyondCorp');
			})
		);

		fns.push(
			this.addEntry(dt + 'beyondcorp beyond corp', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>BeyondCorp', 
			    		new mxGeometry(0, 0, 28, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjgyMzUxNDkzODM1NDQ5MiIgaGVpZ2h0PSIyMC4wNzA1Mzc1NjcxMzg2NzIiIHZpZXdCb3g9IjAuMDAwMDExMzM3Nzc3MzIzMjA1OTU1IDAuMDAwMDg1NjY1MDQ0MDI1NTE4IDE4LjgyMzUxNDkzODM1NDQ5MiAyMC4wNzA1Mzc1NjcxMzg2NzIiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE2LjkzIDQuOTc2YTEwLjQzIDEwLjQzIDAgMCAxLTEgLjkyIDguMDkgOC4wOSAwIDAgMS0xMC41MSAxMS44MWgxLjc1YTcuNTEgNy41MSAwIDAgMS0uODYtMS4zSDMuNzNhOC43NSA4Ljc1IDAgMCAxLTEtMS4xOWgzLjA2YTEwLjM4IDEwLjM4IDAgMCAxLS4zNy0xLjMxSDIuMDFhOCA4IDAgMCAxLS40Mi0xLjE5aDMuNTdjLS4wNy0uNDItLjExLS44NS0uMTQtMS4zSDEuMzZhNi41MSA2LjUxIDAgMCAxIDAtLjc3di0uNDNoMy42M2ExMS4zNCAxMS4zNCAwIDAgMSAuMDgtMS4zSDEuNWE4LjE2IDguMTYgMCAwIDEgLjM2LTEuMTloMy40YTkuNTIgOS41MiAwIDAgMSAuMzMtMS4zSDIuNTJhOCA4IDAgMCAxIC45LTEuMTloMi42MWE5LjIgOS4yIDAgMCAxIC43MS0xLjMxSDQuOTJhOC4wNiA4LjA2IDAgMCAxIDcuNzQtLjY5IDEwLjcgMTAuNyAwIDAgMCAxLjI5IDMuMTlzMi45My0xLjY3IDMuMzgtMy40NGEyLjQyIDIuNDIgMCAwIDAtNC42OC0xLjIzdi4wN2E5LjQxIDkuNDEgMCAxIDAgNi4xNyA4LjgyIDguNzEgOC43MSAwIDAgMC0xLjg5LTUuNjd6bS0zLjAxLTIuOTJhMS4xNCAxLjE0IDAgMSAxIC44MSAxLjM5aDBhMS4xMyAxLjEzIDAgMCAxLS44MS0xLjM5eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'BeyondCorp');
			})
		);

		fns.push(
			this.addEntry(dt + 'beyondcorp beyond corp', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>BeyondCorp', 
			    		new mxGeometry(0, 0, 28, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjgyMzUxNDkzODM1NDQ5MiIgaGVpZ2h0PSIyMC4wNzA1Mzc1NjcxMzg2NzIiIHZpZXdCb3g9IjAuMDAwMDExMzM3Nzc3MzIzMjA1OTU1IDAuMDAwMDg1NjY1MDQ0MDI1NTE4IDE4LjgyMzUxNDkzODM1NDQ5MiAyMC4wNzA1Mzc1NjcxMzg2NzIiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE2LjkzIDQuOTc2YTEwLjQzIDEwLjQzIDAgMCAxLTEgLjkyIDguMDkgOC4wOSAwIDAgMS0xMC41MSAxMS44MWgxLjc1YTcuNTEgNy41MSAwIDAgMS0uODYtMS4zSDMuNzNhOC43NSA4Ljc1IDAgMCAxLTEtMS4xOWgzLjA2YTEwLjM4IDEwLjM4IDAgMCAxLS4zNy0xLjMxSDIuMDFhOCA4IDAgMCAxLS40Mi0xLjE5aDMuNTdjLS4wNy0uNDItLjExLS44NS0uMTQtMS4zSDEuMzZhNi41MSA2LjUxIDAgMCAxIDAtLjc3di0uNDNoMy42M2ExMS4zNCAxMS4zNCAwIDAgMSAuMDgtMS4zSDEuNWE4LjE2IDguMTYgMCAwIDEgLjM2LTEuMTloMy40YTkuNTIgOS41MiAwIDAgMSAuMzMtMS4zSDIuNTJhOCA4IDAgMCAxIC45LTEuMTloMi42MWE5LjIgOS4yIDAgMCAxIC43MS0xLjMxSDQuOTJhOC4wNiA4LjA2IDAgMCAxIDcuNzQtLjY5IDEwLjcgMTAuNyAwIDAgMCAxLjI5IDMuMTlzMi45My0xLjY3IDMuMzgtMy40NGEyLjQyIDIuNDIgMCAwIDAtNC42OC0xLjIzdi4wN2E5LjQxIDkuNDEgMCAxIDAgNi4xNyA4LjgyIDguNzEgOC43MSAwIDAgMC0xLjg5LTUuNjd6bS0zLjAxLTIuOTJhMS4xNCAxLjE0IDAgMSAxIC44MSAxLjM5aDBhMS4xMyAxLjEzIDAgMCAxLS44MS0xLjM5eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'BeyondCorp');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud resource manager', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Resource\nManager', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjQyMDAwMDA3NjI5Mzk0NSIgaGVpZ2h0PSIyMC4wNDk5OTkyMzcwNjA1NDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDE2LjQyMDAwMDA3NjI5Mzk0NSAyMC4wNDk5OTkyMzcwNjA1NDciPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LjIxIDBMMCAzLjQydjUuNjNjMCA1LjA2IDMuNSA5LjggOC4yMSAxMSA0LjcxLTEuMTUgOC4yMS01Ljg5IDguMjEtMTAuOTVWMy40MnptMCAzLjc5YTIuNjMgMi42MyAwIDAgMSAxLjAwNSA1LjA2QTIuNjMgMi42MyAwIDAgMSA2LjM1IDQuNTZhMi42MyAyLjYzIDAgMCAxIDEuODYtLjc3em00LjExIDExLjE1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTMgOC42NCA4LjY0IDAgMCAxLTQuMTEtMi45M3YtMi4yNWMwLTEuNjcgMi43NC0yLjUyIDQuMTEtMi41MnM0LjExLjg1IDQuMTEgMi41MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOC4yMSAwdjMuNzlhMi42MyAyLjYzIDAgMSAxIDAgNS4yNnYxLjEyYzEuMzcgMCA0LjExLjg1IDQuMTEgMi41MnYyLjI1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTNWMjBjNC43MS0xLjE1IDguMjEtNS44OSA4LjIxLTEwLjk1VjMuNDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Resource Manager');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud resource manager', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 210, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Resource Manager', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjQyMDAwMDA3NjI5Mzk0NSIgaGVpZ2h0PSIyMC4wNDk5OTkyMzcwNjA1NDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDE2LjQyMDAwMDA3NjI5Mzk0NSAyMC4wNDk5OTkyMzcwNjA1NDciPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LjIxIDBMMCAzLjQydjUuNjNjMCA1LjA2IDMuNSA5LjggOC4yMSAxMSA0LjcxLTEuMTUgOC4yMS01Ljg5IDguMjEtMTAuOTVWMy40MnptMCAzLjc5YTIuNjMgMi42MyAwIDAgMSAxLjAwNSA1LjA2QTIuNjMgMi42MyAwIDAgMSA2LjM1IDQuNTZhMi42MyAyLjYzIDAgMCAxIDEuODYtLjc3em00LjExIDExLjE1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTMgOC42NCA4LjY0IDAgMCAxLTQuMTEtMi45M3YtMi4yNWMwLTEuNjcgMi43NC0yLjUyIDQuMTEtMi41MnM0LjExLjg1IDQuMTEgMi41MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOC4yMSAwdjMuNzlhMi42MyAyLjYzIDAgMSAxIDAgNS4yNnYxLjEyYzEuMzcgMCA0LjExLjg1IDQuMTEgMi41MnYyLjI1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTNWMjBjNC43MS0xLjE1IDguMjEtNS44OSA4LjIxLTEwLjk1VjMuNDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Resource Manager');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud resource manager', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 218, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Resource Manager', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjQyMDAwMDA3NjI5Mzk0NSIgaGVpZ2h0PSIyMC4wNDk5OTkyMzcwNjA1NDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDE2LjQyMDAwMDA3NjI5Mzk0NSAyMC4wNDk5OTkyMzcwNjA1NDciPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LjIxIDBMMCAzLjQydjUuNjNjMCA1LjA2IDMuNSA5LjggOC4yMSAxMSA0LjcxLTEuMTUgOC4yMS01Ljg5IDguMjEtMTAuOTVWMy40MnptMCAzLjc5YTIuNjMgMi42MyAwIDAgMSAxLjAwNSA1LjA2QTIuNjMgMi42MyAwIDAgMSA2LjM1IDQuNTZhMi42MyAyLjYzIDAgMCAxIDEuODYtLjc3em00LjExIDExLjE1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTMgOC42NCA4LjY0IDAgMCAxLTQuMTEtMi45M3YtMi4yNWMwLTEuNjcgMi43NC0yLjUyIDQuMTEtMi41MnM0LjExLjg1IDQuMTEgMi41MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOC4yMSAwdjMuNzlhMi42MyAyLjYzIDAgMSAxIDAgNS4yNnYxLjEyYzEuMzcgMCA0LjExLjg1IDQuMTEgMi41MnYyLjI1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTNWMjBjNC43MS0xLjE1IDguMjEtNS44OSA4LjIxLTEwLjk1VjMuNDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Resource Manager');
			})
		);

		fns.push(
			this.addEntry(dt + 'data loss prevention api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Data Loss\nPrevention API', 
			    		new mxGeometry(0, 0, 30, 22), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMTcxNjYxMzc2OTUzIiBoZWlnaHQ9IjE0Ljc5ODEzMTk0Mjc0OTAyMyIgdmlld0JveD0iLTIuOTgwMjMyMjM4NzY5NTMxMmUtOCAtMC4wMDAxMzEyMzc1Mzg4ODA2Njg1OCAyMC4wMDE3MTY2MTM3Njk1MyAxNC43OTgxMzE5NDI3NDkwMjMiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTIuODYuODM4YTUuNDggNS40OCAwIDAgMC03LjA2IDEuMDYgNS4zMSA1LjMxIDAgMCAwLTEuMzQgMy42IDUuNDkgNS40OSAwIDAgMCAyLjQxIDQuNTNsLS4xNy4yOC0uNTYuMTYtMi4wNiAzLjQ4IDEuNDguODUgMi4wNS0zLjQ4LS4xNi0uNjEuMTQtLjI2YTUuNDkgNS40OSAwIDAgMCA1LjI3LTkuNjF6bS0xLjkyIDguM2EzLjc5IDMuNzkgMCAxIDEgMi42Ni00LjY1aDBhMy44IDMuOCAwIDAgMS0yLjY2IDQuNjV6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTS4wNSA0LjE3OGwuMTMtMS4wN2gxLjE4di4zNUguNTJ2LjQ1YS42OC42OCAwIDAgMSAuNzkuMTEuNzguNzggMCAwIDEgLjE3LjUzLjc3Ljc3IDAgMCAxLS4wOS4zNi41My41MyAwIDAgMS0uMjQuMjUuNjUuNjUgMCAwIDEtLjM4LjA5LjczLjczIDAgMCAxLS4zNi0uMDguNjYuNjYgMCAwIDEtLjI2LS4yMS42My42MyAwIDAgMS0uMTUtLjMyaC40MmEuMjcuMjcgMCAwIDAgLjA5LjIuMjUuMjUgMCAwIDAgLjIuMDcuMjMuMjMgMCAwIDAgLjIyLS4xLjQzLjQzIDAgMCAwIC4wNy0uMjkuMzcuMzcgMCAwIDAtLjA5LS4yNy4zMy4zMyAwIDAgMC0uMjUtLjEuNDEuNDEgMCAwIDAtLjI0LjA4aDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMuNDUgNS4yMThIM3YtMS42MWwtLjUxLjE1di0uMzZsLjg4LS4zMWgwek0xIDguMDU4SC41OXYtMS42MWwtLjUuMTV2LS4zNGwuOTEtLjMxaDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMuODYgNy4xODhhMS4xMyAxLjEzIDAgMCAxLS4xOC42Ny43NC43NCAwIDAgMS0xIDBoMGExIDEgMCAwIDEtLjE5LS42NXYtLjM5YTEuMDYgMS4wNiAwIDAgMSAuMTgtLjY3LjczLjczIDAgMCAxIDEgMGgwYTEuMDggMS4wOCAwIDAgMSAuMTkuNjV6bS0uNDItLjQzYS44My44MyAwIDAgMC0uMDctLjM2LjI1LjI1IDAgMCAwLS4yMy0uMTIuMjQuMjQgMCAwIDAtLjIyLjExLjc1Ljc1IDAgMCAwLS4wNy4zNnYuNTFhLjg1Ljg1IDAgMCAwIC4wNy4zOS4yMy4yMyAwIDAgMCAuMjMuMTIuMjMuMjMgMCAwIDAgLjIyLS4xMi43Ny43NyAwIDAgMCAuMDctLjM3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNy4xMyA1LjEzOGgtLjQxdi0xLjYybC0uNTEuMTZ2LS4zNGwuODgtLjMyaDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE4LjYyIDQuMDk4bC4xMy0xLjA3aDEuMTh2LjM3aC0uODRsLS4wOS40M2EuNjUuNjUgMCAwIDEgLjMxLS4wOC42My42MyAwIDAgMSAuNDguMTkuNzQuNzQgMCAwIDEgLjE3LjUyLjgxLjgxIDAgMCAxLS4wOS4zNy42LjYgMCAwIDEtLjI1LjI1Ljc5Ljc5IDAgMCAxLS4zOC4wOS44NS44NSAwIDAgMS0uMzUtLjA4LjYyLjYyIDAgMCAxLS4yNi0uMjIuNTguNTggMCAwIDEtLjEtLjMySDE5YS4zNS4zNSAwIDAgMCAuMS4yMS4yOS4yOSAwIDAgMCAuMi4wNy4yNi4yNiAwIDAgMCAuMjItLjEuNDQuNDQgMCAwIDAgLjA2LS4zMy40MS40MSAwIDAgMC0uMDktLjI4LjM0LjM0IDAgMCAwLS4yNS0uMDkuMzQuMzQgMCAwIDAtLjI0LjA3aDB6bS0xLjA4IDMuMDlhMS4xMyAxLjEzIDAgMCAxLS4xOC42Ny43NC43NCAwIDAgMS0xIDBoMGExIDEgMCAwIDEtLjE5LS42NXYtLjM5YTEuMDYgMS4wNiAwIDAgMSAuMTgtLjY3LjczLjczIDAgMCAxIDEgMGgwYTEuMDggMS4wOCAwIDAgMSAuMTkuNjV6bS0uNDItLjQzYS44My44MyAwIDAgMC0uMDctLjM4LjI1LjI1IDAgMCAwLS4yMy0uMTIuMjQuMjQgMCAwIDAtLjIyLjExLjc1Ljc1IDAgMCAwLS4wNy4zNnYuNTFhLjg1Ljg1IDAgMCAwIC4wNy4zOS4yMy4yMyAwIDAgMCAuMjMuMTIuMjMuMjMgMCAwIDAgLjIyLS4xMi45LjkgMCAwIDAgLjA3LS4zN3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTguNjIgNy4wMThsLjEzLTEuMDdoMS4xOHYuMzVoLS44NGwtLjA1LjQ1YS42NS42NSAwIDAgMSAuMzEtLjA4LjYzLjYzIDAgMCAxIC40OC4xOS43OC43OCAwIDAgMSAuMTcuNTQuNzcuNzcgMCAwIDEtLjA5LjM2LjUxLjUxIDAgMCAxLS4yNS4yNS42OS42OSAwIDAgMS0uMzguMDkuNzIuNzIgMCAwIDEtLjM1LS4wOC41OS41OSAwIDAgMS0uMjYtLjIxLjYzLjYzIDAgMCAxLS4xLS4zMkgxOWEuMzIuMzIgMCAwIDAgLjEuMi4yNS4yNSAwIDAgMCAuMi4wNy4yMy4yMyAwIDAgMCAuMjItLjEuNDMuNDMgMCAwIDAgLjA4LS4yOS4zNy4zNyAwIDAgMC0uMDktLjI3LjMxLjMxIDAgMCAwLS4yNS0uMS4zNS4zNSAwIDAgMC0uMjQuMDhoMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNy43MyA3LjUwOHYtLjk0YS44Ni44NiAwIDAgMSAuMzUtLjYyIDIuNDMgMi40MyAwIDAgMSAuODMtLjQzIDIuODcgMi44NyAwIDAgMSAyLjQyLjI4IDEuMDUgMS4wNSAwIDAgMSAuMjcuMi45LjkgMCAwIDEgLjMuNzV2Ljc2em0yLjA4LTIuNjFhMS4wOCAxLjA4IDAgMSAxIDEuMDgtMS4wN2gwYTEuMDkgMS4wOSAwIDAgMS0xLjA4IDEuMDd6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Data Loss Prevention API');
			})
		);

		fns.push(
			this.addEntry(dt + 'data loss prevention api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 210, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Data Loss Prevention API', 
			    		new mxGeometry(0, 0, 30, 22), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMTcxNjYxMzc2OTUzIiBoZWlnaHQ9IjE0Ljc5ODEzMTk0Mjc0OTAyMyIgdmlld0JveD0iLTIuOTgwMjMyMjM4NzY5NTMxMmUtOCAtMC4wMDAxMzEyMzc1Mzg4ODA2Njg1OCAyMC4wMDE3MTY2MTM3Njk1MyAxNC43OTgxMzE5NDI3NDkwMjMiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTIuODYuODM4YTUuNDggNS40OCAwIDAgMC03LjA2IDEuMDYgNS4zMSA1LjMxIDAgMCAwLTEuMzQgMy42IDUuNDkgNS40OSAwIDAgMCAyLjQxIDQuNTNsLS4xNy4yOC0uNTYuMTYtMi4wNiAzLjQ4IDEuNDguODUgMi4wNS0zLjQ4LS4xNi0uNjEuMTQtLjI2YTUuNDkgNS40OSAwIDAgMCA1LjI3LTkuNjF6bS0xLjkyIDguM2EzLjc5IDMuNzkgMCAxIDEgMi42Ni00LjY1aDBhMy44IDMuOCAwIDAgMS0yLjY2IDQuNjV6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTS4wNSA0LjE3OGwuMTMtMS4wN2gxLjE4di4zNUguNTJ2LjQ1YS42OC42OCAwIDAgMSAuNzkuMTEuNzguNzggMCAwIDEgLjE3LjUzLjc3Ljc3IDAgMCAxLS4wOS4zNi41My41MyAwIDAgMS0uMjQuMjUuNjUuNjUgMCAwIDEtLjM4LjA5LjczLjczIDAgMCAxLS4zNi0uMDguNjYuNjYgMCAwIDEtLjI2LS4yMS42My42MyAwIDAgMS0uMTUtLjMyaC40MmEuMjcuMjcgMCAwIDAgLjA5LjIuMjUuMjUgMCAwIDAgLjIuMDcuMjMuMjMgMCAwIDAgLjIyLS4xLjQzLjQzIDAgMCAwIC4wNy0uMjkuMzcuMzcgMCAwIDAtLjA5LS4yNy4zMy4zMyAwIDAgMC0uMjUtLjEuNDEuNDEgMCAwIDAtLjI0LjA4aDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMuNDUgNS4yMThIM3YtMS42MWwtLjUxLjE1di0uMzZsLjg4LS4zMWgwek0xIDguMDU4SC41OXYtMS42MWwtLjUuMTV2LS4zNGwuOTEtLjMxaDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMuODYgNy4xODhhMS4xMyAxLjEzIDAgMCAxLS4xOC42Ny43NC43NCAwIDAgMS0xIDBoMGExIDEgMCAwIDEtLjE5LS42NXYtLjM5YTEuMDYgMS4wNiAwIDAgMSAuMTgtLjY3LjczLjczIDAgMCAxIDEgMGgwYTEuMDggMS4wOCAwIDAgMSAuMTkuNjV6bS0uNDItLjQzYS44My44MyAwIDAgMC0uMDctLjM2LjI1LjI1IDAgMCAwLS4yMy0uMTIuMjQuMjQgMCAwIDAtLjIyLjExLjc1Ljc1IDAgMCAwLS4wNy4zNnYuNTFhLjg1Ljg1IDAgMCAwIC4wNy4zOS4yMy4yMyAwIDAgMCAuMjMuMTIuMjMuMjMgMCAwIDAgLjIyLS4xMi43Ny43NyAwIDAgMCAuMDctLjM3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNy4xMyA1LjEzOGgtLjQxdi0xLjYybC0uNTEuMTZ2LS4zNGwuODgtLjMyaDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE4LjYyIDQuMDk4bC4xMy0xLjA3aDEuMTh2LjM3aC0uODRsLS4wOS40M2EuNjUuNjUgMCAwIDEgLjMxLS4wOC42My42MyAwIDAgMSAuNDguMTkuNzQuNzQgMCAwIDEgLjE3LjUyLjgxLjgxIDAgMCAxLS4wOS4zNy42LjYgMCAwIDEtLjI1LjI1Ljc5Ljc5IDAgMCAxLS4zOC4wOS44NS44NSAwIDAgMS0uMzUtLjA4LjYyLjYyIDAgMCAxLS4yNi0uMjIuNTguNTggMCAwIDEtLjEtLjMySDE5YS4zNS4zNSAwIDAgMCAuMS4yMS4yOS4yOSAwIDAgMCAuMi4wNy4yNi4yNiAwIDAgMCAuMjItLjEuNDQuNDQgMCAwIDAgLjA2LS4zMy40MS40MSAwIDAgMC0uMDktLjI4LjM0LjM0IDAgMCAwLS4yNS0uMDkuMzQuMzQgMCAwIDAtLjI0LjA3aDB6bS0xLjA4IDMuMDlhMS4xMyAxLjEzIDAgMCAxLS4xOC42Ny43NC43NCAwIDAgMS0xIDBoMGExIDEgMCAwIDEtLjE5LS42NXYtLjM5YTEuMDYgMS4wNiAwIDAgMSAuMTgtLjY3LjczLjczIDAgMCAxIDEgMGgwYTEuMDggMS4wOCAwIDAgMSAuMTkuNjV6bS0uNDItLjQzYS44My44MyAwIDAgMC0uMDctLjM4LjI1LjI1IDAgMCAwLS4yMy0uMTIuMjQuMjQgMCAwIDAtLjIyLjExLjc1Ljc1IDAgMCAwLS4wNy4zNnYuNTFhLjg1Ljg1IDAgMCAwIC4wNy4zOS4yMy4yMyAwIDAgMCAuMjMuMTIuMjMuMjMgMCAwIDAgLjIyLS4xMi45LjkgMCAwIDAgLjA3LS4zN3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTguNjIgNy4wMThsLjEzLTEuMDdoMS4xOHYuMzVoLS44NGwtLjA1LjQ1YS42NS42NSAwIDAgMSAuMzEtLjA4LjYzLjYzIDAgMCAxIC40OC4xOS43OC43OCAwIDAgMSAuMTcuNTQuNzcuNzcgMCAwIDEtLjA5LjM2LjUxLjUxIDAgMCAxLS4yNS4yNS42OS42OSAwIDAgMS0uMzguMDkuNzIuNzIgMCAwIDEtLjM1LS4wOC41OS41OSAwIDAgMS0uMjYtLjIxLjYzLjYzIDAgMCAxLS4xLS4zMkgxOWEuMzIuMzIgMCAwIDAgLjEuMi4yNS4yNSAwIDAgMCAuMi4wNy4yMy4yMyAwIDAgMCAuMjItLjEuNDMuNDMgMCAwIDAgLjA4LS4yOS4zNy4zNyAwIDAgMC0uMDktLjI3LjMxLjMxIDAgMCAwLS4yNS0uMS4zNS4zNSAwIDAgMC0uMjQuMDhoMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNy43MyA3LjUwOHYtLjk0YS44Ni44NiAwIDAgMSAuMzUtLjYyIDIuNDMgMi40MyAwIDAgMSAuODMtLjQzIDIuODcgMi44NyAwIDAgMSAyLjQyLjI4IDEuMDUgMS4wNSAwIDAgMSAuMjcuMi45LjkgMCAwIDEgLjMuNzV2Ljc2em0yLjA4LTIuNjFhMS4wOCAxLjA4IDAgMSAxIDEuMDgtMS4wN2gwYTEuMDkgMS4wOSAwIDAgMS0xLjA4IDEuMDd6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Data Loss Prevention API');
			})
		);

		fns.push(
			this.addEntry(dt + 'data loss prevention api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 218, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Data Loss Prevention API', 
			    		new mxGeometry(0, 0, 30, 22), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMTcxNjYxMzc2OTUzIiBoZWlnaHQ9IjE0Ljc5ODEzMTk0Mjc0OTAyMyIgdmlld0JveD0iLTIuOTgwMjMyMjM4NzY5NTMxMmUtOCAtMC4wMDAxMzEyMzc1Mzg4ODA2Njg1OCAyMC4wMDE3MTY2MTM3Njk1MyAxNC43OTgxMzE5NDI3NDkwMjMiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTIuODYuODM4YTUuNDggNS40OCAwIDAgMC03LjA2IDEuMDYgNS4zMSA1LjMxIDAgMCAwLTEuMzQgMy42IDUuNDkgNS40OSAwIDAgMCAyLjQxIDQuNTNsLS4xNy4yOC0uNTYuMTYtMi4wNiAzLjQ4IDEuNDguODUgMi4wNS0zLjQ4LS4xNi0uNjEuMTQtLjI2YTUuNDkgNS40OSAwIDAgMCA1LjI3LTkuNjF6bS0xLjkyIDguM2EzLjc5IDMuNzkgMCAxIDEgMi42Ni00LjY1aDBhMy44IDMuOCAwIDAgMS0yLjY2IDQuNjV6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTS4wNSA0LjE3OGwuMTMtMS4wN2gxLjE4di4zNUguNTJ2LjQ1YS42OC42OCAwIDAgMSAuNzkuMTEuNzguNzggMCAwIDEgLjE3LjUzLjc3Ljc3IDAgMCAxLS4wOS4zNi41My41MyAwIDAgMS0uMjQuMjUuNjUuNjUgMCAwIDEtLjM4LjA5LjczLjczIDAgMCAxLS4zNi0uMDguNjYuNjYgMCAwIDEtLjI2LS4yMS42My42MyAwIDAgMS0uMTUtLjMyaC40MmEuMjcuMjcgMCAwIDAgLjA5LjIuMjUuMjUgMCAwIDAgLjIuMDcuMjMuMjMgMCAwIDAgLjIyLS4xLjQzLjQzIDAgMCAwIC4wNy0uMjkuMzcuMzcgMCAwIDAtLjA5LS4yNy4zMy4zMyAwIDAgMC0uMjUtLjEuNDEuNDEgMCAwIDAtLjI0LjA4aDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMuNDUgNS4yMThIM3YtMS42MWwtLjUxLjE1di0uMzZsLjg4LS4zMWgwek0xIDguMDU4SC41OXYtMS42MWwtLjUuMTV2LS4zNGwuOTEtLjMxaDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMuODYgNy4xODhhMS4xMyAxLjEzIDAgMCAxLS4xOC42Ny43NC43NCAwIDAgMS0xIDBoMGExIDEgMCAwIDEtLjE5LS42NXYtLjM5YTEuMDYgMS4wNiAwIDAgMSAuMTgtLjY3LjczLjczIDAgMCAxIDEgMGgwYTEuMDggMS4wOCAwIDAgMSAuMTkuNjV6bS0uNDItLjQzYS44My44MyAwIDAgMC0uMDctLjM2LjI1LjI1IDAgMCAwLS4yMy0uMTIuMjQuMjQgMCAwIDAtLjIyLjExLjc1Ljc1IDAgMCAwLS4wNy4zNnYuNTFhLjg1Ljg1IDAgMCAwIC4wNy4zOS4yMy4yMyAwIDAgMCAuMjMuMTIuMjMuMjMgMCAwIDAgLjIyLS4xMi43Ny43NyAwIDAgMCAuMDctLjM3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNy4xMyA1LjEzOGgtLjQxdi0xLjYybC0uNTEuMTZ2LS4zNGwuODgtLjMyaDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE4LjYyIDQuMDk4bC4xMy0xLjA3aDEuMTh2LjM3aC0uODRsLS4wOS40M2EuNjUuNjUgMCAwIDEgLjMxLS4wOC42My42MyAwIDAgMSAuNDguMTkuNzQuNzQgMCAwIDEgLjE3LjUyLjgxLjgxIDAgMCAxLS4wOS4zNy42LjYgMCAwIDEtLjI1LjI1Ljc5Ljc5IDAgMCAxLS4zOC4wOS44NS44NSAwIDAgMS0uMzUtLjA4LjYyLjYyIDAgMCAxLS4yNi0uMjIuNTguNTggMCAwIDEtLjEtLjMySDE5YS4zNS4zNSAwIDAgMCAuMS4yMS4yOS4yOSAwIDAgMCAuMi4wNy4yNi4yNiAwIDAgMCAuMjItLjEuNDQuNDQgMCAwIDAgLjA2LS4zMy40MS40MSAwIDAgMC0uMDktLjI4LjM0LjM0IDAgMCAwLS4yNS0uMDkuMzQuMzQgMCAwIDAtLjI0LjA3aDB6bS0xLjA4IDMuMDlhMS4xMyAxLjEzIDAgMCAxLS4xOC42Ny43NC43NCAwIDAgMS0xIDBoMGExIDEgMCAwIDEtLjE5LS42NXYtLjM5YTEuMDYgMS4wNiAwIDAgMSAuMTgtLjY3LjczLjczIDAgMCAxIDEgMGgwYTEuMDggMS4wOCAwIDAgMSAuMTkuNjV6bS0uNDItLjQzYS44My44MyAwIDAgMC0uMDctLjM4LjI1LjI1IDAgMCAwLS4yMy0uMTIuMjQuMjQgMCAwIDAtLjIyLjExLjc1Ljc1IDAgMCAwLS4wNy4zNnYuNTFhLjg1Ljg1IDAgMCAwIC4wNy4zOS4yMy4yMyAwIDAgMCAuMjMuMTIuMjMuMjMgMCAwIDAgLjIyLS4xMi45LjkgMCAwIDAgLjA3LS4zN3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTguNjIgNy4wMThsLjEzLTEuMDdoMS4xOHYuMzVoLS44NGwtLjA1LjQ1YS42NS42NSAwIDAgMSAuMzEtLjA4LjYzLjYzIDAgMCAxIC40OC4xOS43OC43OCAwIDAgMSAuMTcuNTQuNzcuNzcgMCAwIDEtLjA5LjM2LjUxLjUxIDAgMCAxLS4yNS4yNS42OS42OSAwIDAgMS0uMzguMDkuNzIuNzIgMCAwIDEtLjM1LS4wOC41OS41OSAwIDAgMS0uMjYtLjIxLjYzLjYzIDAgMCAxLS4xLS4zMkgxOWEuMzIuMzIgMCAwIDAgLjEuMi4yNS4yNSAwIDAgMCAuMi4wNy4yMy4yMyAwIDAgMCAuMjItLjEuNDMuNDMgMCAwIDAgLjA4LS4yOS4zNy4zNyAwIDAgMC0uMDktLjI3LjMxLjMxIDAgMCAwLS4yNS0uMS4zNS4zNSAwIDAgMC0uMjQuMDhoMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNy43MyA3LjUwOHYtLjk0YS44Ni44NiAwIDAgMSAuMzUtLjYyIDIuNDMgMi40MyAwIDAgMSAuODMtLjQzIDIuODcgMi44NyAwIDAgMSAyLjQyLjI4IDEuMDUgMS4wNSAwIDAgMSAuMjcuMi45LjkgMCAwIDEgLjMuNzV2Ljc2em0yLjA4LTIuNjFhMS4wOCAxLjA4IDAgMSAxIDEuMDgtMS4wN2gwYTEuMDkgMS4wOSAwIDAgMS0xLjA4IDEuMDd6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Data Loss Prevention API');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud security scanner', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Security\nScanner', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE3LjI3OTk5ODc3OTI5Njg3NSIgdmlld0JveD0iMCAwIDIwIDE3LjI3OTk5ODc3OTI5Njg3NSI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iOS40NCIgY3k9IjguMTQiIHI9IjIuOTciLz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPGNpcmNsZSBjeD0iMi4wMiIgY3k9IjcuNDMiIHI9IjIuMDIiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTIuNTIiIGN5PSIxNS4yNiIgcj0iMi4wMiIvPiYjeGE7CQk8cGF0aCBkPSJNMTcuNTcuODRBMi40MyAyLjQzIDAgMSAwIDIwIDMuMjcgMi40MyAyLjQzIDAgMCAwIDE3LjU3Ljg0em0wIDMuOGExLjM3IDEuMzcgMCAxIDEgMS4zNi0xLjM3aDBhMS4zNyAxLjM3IDAgMCAxLTEuMzYgMS4zN3oiLz4mI3hhOwkJPHBhdGggZD0iTTE2LjIgMy4zMkE4LjI5IDguMjkgMCAwIDAgMTEuMTQgMGwtLjI4IDEuMzRhNi45NSA2Ljk1IDAgMSAxLTguMjIgNS4zOCA2Ljg4IDYuODggMCAwIDEgMS44Ny0zLjQ3bC0xLTFhOC4zMSA4LjMxIDAgMSAwIDEzLjM4IDIuMiAxLjM2IDEuMzYgMCAwIDEtLjY5LTEuMTN6Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Security Scanner');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud security scanner', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 200, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Security Scanner', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE3LjI3OTk5ODc3OTI5Njg3NSIgdmlld0JveD0iMCAwIDIwIDE3LjI3OTk5ODc3OTI5Njg3NSI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iOS40NCIgY3k9IjguMTQiIHI9IjIuOTciLz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPGNpcmNsZSBjeD0iMi4wMiIgY3k9IjcuNDMiIHI9IjIuMDIiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTIuNTIiIGN5PSIxNS4yNiIgcj0iMi4wMiIvPiYjeGE7CQk8cGF0aCBkPSJNMTcuNTcuODRBMi40MyAyLjQzIDAgMSAwIDIwIDMuMjcgMi40MyAyLjQzIDAgMCAwIDE3LjU3Ljg0em0wIDMuOGExLjM3IDEuMzcgMCAxIDEgMS4zNi0xLjM3aDBhMS4zNyAxLjM3IDAgMCAxLTEuMzYgMS4zN3oiLz4mI3hhOwkJPHBhdGggZD0iTTE2LjIgMy4zMkE4LjI5IDguMjkgMCAwIDAgMTEuMTQgMGwtLjI4IDEuMzRhNi45NSA2Ljk1IDAgMSAxLTguMjIgNS4zOCA2Ljg4IDYuODggMCAwIDEgMS44Ny0zLjQ3bC0xLTFhOC4zMSA4LjMxIDAgMSAwIDEzLjM4IDIuMiAxLjM2IDEuMzYgMCAwIDEtLjY5LTEuMTN6Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Security Scanner');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud security scanner', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 208, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Security Scanner', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE3LjI3OTk5ODc3OTI5Njg3NSIgdmlld0JveD0iMCAwIDIwIDE3LjI3OTk5ODc3OTI5Njg3NSI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iOS40NCIgY3k9IjguMTQiIHI9IjIuOTciLz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPGNpcmNsZSBjeD0iMi4wMiIgY3k9IjcuNDMiIHI9IjIuMDIiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTIuNTIiIGN5PSIxNS4yNiIgcj0iMi4wMiIvPiYjeGE7CQk8cGF0aCBkPSJNMTcuNTcuODRBMi40MyAyLjQzIDAgMSAwIDIwIDMuMjcgMi40MyAyLjQzIDAgMCAwIDE3LjU3Ljg0em0wIDMuOGExLjM3IDEuMzcgMCAxIDEgMS4zNi0xLjM3aDBhMS4zNyAxLjM3IDAgMCAxLTEuMzYgMS4zN3oiLz4mI3hhOwkJPHBhdGggZD0iTTE2LjIgMy4zMkE4LjI5IDguMjkgMCAwIDAgMTEuMTQgMGwtLjI4IDEuMzRhNi45NSA2Ljk1IDAgMSAxLTguMjIgNS4zOCA2Ljg4IDYuODggMCAwIDEgMS44Ny0zLjQ3bC0xLTFhOC4zMSA4LjMxIDAgMSAwIDEzLjM4IDIuMiAxLjM2IDEuMzYgMCAwIDEtLjY5LTEuMTN6Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Security Scanner');
			})
		);

		fns.push(
			this.addEntry(dt + 'key management service', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Key Management\nService', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMxMC43NzU2MDY1NDM4NjAyNSIgaGVpZ2h0PSIzNzcuOTUzMDI4ODM1NTI1NDYiIHZpZXdCb3g9Ii0wLjE0MDAwMDAwMDU5NjA0NjQ1IC0wLjQ2NzAwMDAwNzYyOTM5NDUzIDgyLjIyNTk5NzkyNDgwNDY5IDEwMC4wMDAwMDc2MjkzOTQ1MyI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNmZmY7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDAuOTczLS40NjdsNDEuMTEzIDE3LjQ5M3YyOS42NTRjMCAyNy40MTgtMjQuNjA4IDUwLjgzNi00MS4xMTMgNTIuODUzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MC45NzMtLjQ2N0wtLjE0IDE3LjAyNXYyOS42NTRjMCAyNy40MTggMjQuNjA4IDUwLjgzNiA0MS4xMTMgNTIuODUzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00MS4yNTMgMTYuNjA1Yy05LjU4NCAwLTE3LjQ0NSA3Ljg2Mi0xNy40NDUgMTcuNDQ1IDAgOC4wODQgNS41OTQgMTQuOTQyIDEzLjA5NiAxNi44OTF2OS40ODhoLTkuODY5djguNzAxaDkuODY5djUuMzc3aC02LjMxNXY4LjcwMWg2LjMxNXYyLjE5N2g4LjcwMVY1MC45NDFDNTMuMTA2IDQ4Ljk5MiA1OC43IDQyLjEzNCA1OC43IDM0LjA1YzAtOS41ODQtNy44NjMtMTcuNDQ1LTE3LjQ0Ny0xNy40NDV6bTAgOC42OTlBOC42OCA4LjY4IDAgMCAxIDUwIDM0LjA1YTguNjggOC42OCAwIDAgMS04Ljc0OCA4Ljc0NiA4LjY4IDguNjggMCAwIDEtOC43NDYtOC43NDYgOC42OCA4LjY4IDAgMCAxIDguNzQ2LTguNzQ2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Key Management Service');
			})
		);

		fns.push(
			this.addEntry(dt + 'key management service', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 210, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Key Management Service', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMxMC43NzU2MDY1NDM4NjAyNSIgaGVpZ2h0PSIzNzcuOTUzMDI4ODM1NTI1NDYiIHZpZXdCb3g9Ii0wLjE0MDAwMDAwMDU5NjA0NjQ1IC0wLjQ2NzAwMDAwNzYyOTM5NDUzIDgyLjIyNTk5NzkyNDgwNDY5IDEwMC4wMDAwMDc2MjkzOTQ1MyI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNmZmY7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDAuOTczLS40NjdsNDEuMTEzIDE3LjQ5M3YyOS42NTRjMCAyNy40MTgtMjQuNjA4IDUwLjgzNi00MS4xMTMgNTIuODUzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MC45NzMtLjQ2N0wtLjE0IDE3LjAyNXYyOS42NTRjMCAyNy40MTggMjQuNjA4IDUwLjgzNiA0MS4xMTMgNTIuODUzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00MS4yNTMgMTYuNjA1Yy05LjU4NCAwLTE3LjQ0NSA3Ljg2Mi0xNy40NDUgMTcuNDQ1IDAgOC4wODQgNS41OTQgMTQuOTQyIDEzLjA5NiAxNi44OTF2OS40ODhoLTkuODY5djguNzAxaDkuODY5djUuMzc3aC02LjMxNXY4LjcwMWg2LjMxNXYyLjE5N2g4LjcwMVY1MC45NDFDNTMuMTA2IDQ4Ljk5MiA1OC43IDQyLjEzNCA1OC43IDM0LjA1YzAtOS41ODQtNy44NjMtMTcuNDQ1LTE3LjQ0Ny0xNy40NDV6bTAgOC42OTlBOC42OCA4LjY4IDAgMCAxIDUwIDM0LjA1YTguNjggOC42OCAwIDAgMS04Ljc0OCA4Ljc0NiA4LjY4IDguNjggMCAwIDEtOC43NDYtOC43NDYgOC42OCA4LjY4IDAgMCAxIDguNzQ2LTguNzQ2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Key Management Service');
			})
		);

		fns.push(
			this.addEntry(dt + 'key management service', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 218, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Key Management Service', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMxMC43NzU2MDY1NDM4NjAyNSIgaGVpZ2h0PSIzNzcuOTUzMDI4ODM1NTI1NDYiIHZpZXdCb3g9Ii0wLjE0MDAwMDAwMDU5NjA0NjQ1IC0wLjQ2NzAwMDAwNzYyOTM5NDUzIDgyLjIyNTk5NzkyNDgwNDY5IDEwMC4wMDAwMDc2MjkzOTQ1MyI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNmZmY7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDAuOTczLS40NjdsNDEuMTEzIDE3LjQ5M3YyOS42NTRjMCAyNy40MTgtMjQuNjA4IDUwLjgzNi00MS4xMTMgNTIuODUzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MC45NzMtLjQ2N0wtLjE0IDE3LjAyNXYyOS42NTRjMCAyNy40MTggMjQuNjA4IDUwLjgzNiA0MS4xMTMgNTIuODUzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00MS4yNTMgMTYuNjA1Yy05LjU4NCAwLTE3LjQ0NSA3Ljg2Mi0xNy40NDUgMTcuNDQ1IDAgOC4wODQgNS41OTQgMTQuOTQyIDEzLjA5NiAxNi44OTF2OS40ODhoLTkuODY5djguNzAxaDkuODY5djUuMzc3aC02LjMxNXY4LjcwMWg2LjMxNXYyLjE5N2g4LjcwMVY1MC45NDFDNTMuMTA2IDQ4Ljk5MiA1OC43IDQyLjEzNCA1OC43IDM0LjA1YzAtOS41ODQtNy44NjMtMTcuNDQ1LTE3LjQ0Ny0xNy40NDV6bTAgOC42OTlBOC42OCA4LjY4IDAgMCAxIDUwIDM0LjA1YTguNjggOC42OCAwIDAgMS04Ljc0OCA4Ljc0NiA4LjY4IDguNjggMCAwIDEtOC43NDYtOC43NDYgOC42OCA4LjY4IDAgMCAxIDguNzQ2LTguNzQ2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Key Management Service');
			})
		);

		fns.push(
			this.addEntry(dt + 'identity aware proxy', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Identity-Aware\nProxy', 
			    		new mxGeometry(0, 0, 30, 15), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk5IiBoZWlnaHQ9IjEwLjQxIiB2aWV3Qm94PSIwIDAgMTkuOTkgMTAuNDEiPiYjeGE7CTxwYXRoIGQ9Ik05Ljg0LjIxYTUuMSA1LjEgMCAxIDAgNS4xIDUuMWgwYTUuMSA1LjEgMCAwIDAtNS4xLTUuMXptMCA5LjA4YTQgNCAwIDEgMSA0LTRoMGE0IDQgMCAwIDEtNCA0LjAxeiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGQ9Ik0xMS43NiA1LjkyYTIuMDkgMi4wOSAwIDAgMC0uMjgtLjIyIDMuMTEgMy4xMSAwIDAgMC0yLjYxLS4yOCAyLjMxIDIuMzEgMCAwIDAtLjg5LjQ3Ljg2Ljg2IDAgMCAwLS4zNy42NXYxaDQuNDd2LS44MmExIDEgMCAwIDAtLjMyLS44ek05Ljg0IDQuNzRhMS4xNiAxLjE2IDAgMSAwLTEuMTctMS4xNWgwYTEuMTcgMS4xNyAwIDAgMCAxLjE3IDEuMTV6IiBmaWxsPSIjNjY5ZGY2Ii8+JiN4YTsJPHBhdGggZD0iTTE2LjI5IDUuNmgyLjIxbC0uNzcuNzhoMS4wNGwxLjIyLTEuMjMtMS4yMi0xLjIyaC0xLjA0bC43Ny43N2gtMi4yMXoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOwk8cGF0aCBkPSJNMTcuODggMS43M1YwaC0xLjczbC0uNzMuNzRoMS4wOWwtLjk4Ljk3LjY0LjY0Ljk4LS45N3YxLjA5em0tMi40NiA3Ljk1bC43My43M2gxLjczVjguNjhsLS43My0uNzN2MS4wOWwtLjk4LS45Ny0uNjQuNjMuOTguOTh6TTEuMzQgMy44NkExLjM1IDEuMzUgMCAxIDAgMi43IDUuMjFhMS4zNSAxLjM1IDAgMCAwLTEuMzYtMS4zNXptMCAyLjFhLjc2Ljc2IDAgMSAxIC43Ni0uNzVoMGEuNzYuNzYgMCAwIDEtLjc2Ljc1eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Identity-Aware Proxy');
			})
		);

		fns.push(
			this.addEntry(dt + 'identity aware proxy', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 190, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Identity-Aware Proxy', 
			    		new mxGeometry(0, 0, 30, 15), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk5IiBoZWlnaHQ9IjEwLjQxIiB2aWV3Qm94PSIwIDAgMTkuOTkgMTAuNDEiPiYjeGE7CTxwYXRoIGQ9Ik05Ljg0LjIxYTUuMSA1LjEgMCAxIDAgNS4xIDUuMWgwYTUuMSA1LjEgMCAwIDAtNS4xLTUuMXptMCA5LjA4YTQgNCAwIDEgMSA0LTRoMGE0IDQgMCAwIDEtNCA0LjAxeiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGQ9Ik0xMS43NiA1LjkyYTIuMDkgMi4wOSAwIDAgMC0uMjgtLjIyIDMuMTEgMy4xMSAwIDAgMC0yLjYxLS4yOCAyLjMxIDIuMzEgMCAwIDAtLjg5LjQ3Ljg2Ljg2IDAgMCAwLS4zNy42NXYxaDQuNDd2LS44MmExIDEgMCAwIDAtLjMyLS44ek05Ljg0IDQuNzRhMS4xNiAxLjE2IDAgMSAwLTEuMTctMS4xNWgwYTEuMTcgMS4xNyAwIDAgMCAxLjE3IDEuMTV6IiBmaWxsPSIjNjY5ZGY2Ii8+JiN4YTsJPHBhdGggZD0iTTE2LjI5IDUuNmgyLjIxbC0uNzcuNzhoMS4wNGwxLjIyLTEuMjMtMS4yMi0xLjIyaC0xLjA0bC43Ny43N2gtMi4yMXoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOwk8cGF0aCBkPSJNMTcuODggMS43M1YwaC0xLjczbC0uNzMuNzRoMS4wOWwtLjk4Ljk3LjY0LjY0Ljk4LS45N3YxLjA5em0tMi40NiA3Ljk1bC43My43M2gxLjczVjguNjhsLS43My0uNzN2MS4wOWwtLjk4LS45Ny0uNjQuNjMuOTguOTh6TTEuMzQgMy44NkExLjM1IDEuMzUgMCAxIDAgMi43IDUuMjFhMS4zNSAxLjM1IDAgMCAwLTEuMzYtMS4zNXptMCAyLjFhLjc2Ljc2IDAgMSAxIC43Ni0uNzVoMGEuNzYuNzYgMCAwIDEtLjc2Ljc1eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Identity-Aware Proxy');
			})
		);

		fns.push(
			this.addEntry(dt + 'identity aware proxy', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 198, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Identity-Aware Proxy', 
			    		new mxGeometry(0, 0, 30, 15), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk5IiBoZWlnaHQ9IjEwLjQxIiB2aWV3Qm94PSIwIDAgMTkuOTkgMTAuNDEiPiYjeGE7CTxwYXRoIGQ9Ik05Ljg0LjIxYTUuMSA1LjEgMCAxIDAgNS4xIDUuMWgwYTUuMSA1LjEgMCAwIDAtNS4xLTUuMXptMCA5LjA4YTQgNCAwIDEgMSA0LTRoMGE0IDQgMCAwIDEtNCA0LjAxeiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGQ9Ik0xMS43NiA1LjkyYTIuMDkgMi4wOSAwIDAgMC0uMjgtLjIyIDMuMTEgMy4xMSAwIDAgMC0yLjYxLS4yOCAyLjMxIDIuMzEgMCAwIDAtLjg5LjQ3Ljg2Ljg2IDAgMCAwLS4zNy42NXYxaDQuNDd2LS44MmExIDEgMCAwIDAtLjMyLS44ek05Ljg0IDQuNzRhMS4xNiAxLjE2IDAgMSAwLTEuMTctMS4xNWgwYTEuMTcgMS4xNyAwIDAgMCAxLjE3IDEuMTV6IiBmaWxsPSIjNjY5ZGY2Ii8+JiN4YTsJPHBhdGggZD0iTTE2LjI5IDUuNmgyLjIxbC0uNzcuNzhoMS4wNGwxLjIyLTEuMjMtMS4yMi0xLjIyaC0xLjA0bC43Ny43N2gtMi4yMXoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOwk8cGF0aCBkPSJNMTcuODggMS43M1YwaC0xLjczbC0uNzMuNzRoMS4wOWwtLjk4Ljk3LjY0LjY0Ljk4LS45N3YxLjA5em0tMi40NiA3Ljk1bC43My43M2gxLjczVjguNjhsLS43My0uNzN2MS4wOWwtLjk4LS45Ny0uNjQuNjMuOTguOTh6TTEuMzQgMy44NkExLjM1IDEuMzUgMCAxIDAgMi43IDUuMjFhMS4zNSAxLjM1IDAgMCAwLTEuMzYtMS4zNXptMCAyLjFhLjc2Ljc2IDAgMSAxIC43Ni0uNzVoMGEuNzYuNzYgMCAwIDEtLjc2Ljc1eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Identity-Aware Proxy');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud security command center', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Security\nCommand Center', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3LjE4MDAwMDMwNTE3NTc4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTcuMTgwMDAwMzA1MTc1NzggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05LjkgNC44NWE1LjIzIDUuMjMgMCAwIDEgMy43NSAzLjc1aDMuNTNWMy4yNEw5LjkgMHpNMy41MiA4LjYxYTUuMjIgNS4yMiAwIDAgMSAzLjc1LTMuNzVWMEwwIDMuMjR2NS4zN3pNNy4yOCAxNWE1LjIzIDUuMjMgMCAwIDEtMy43NS0zLjc1SC4yMkExMiAxMiAwIDAgMCA3LjI4IDIwem02LjM4LTMuNzVBNS4yMyA1LjIzIDAgMCAxIDkuOTEgMTV2NWExMiAxMiAwIDAgMCA3LjA1LTguNzV6Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iOC41OSIgY3k9IjkuOTIiIHI9IjIuNjMiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Security Command Center');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud security command center', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 250, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Security Command Center', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3LjE4MDAwMDMwNTE3NTc4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTcuMTgwMDAwMzA1MTc1NzggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05LjkgNC44NWE1LjIzIDUuMjMgMCAwIDEgMy43NSAzLjc1aDMuNTNWMy4yNEw5LjkgMHpNMy41MiA4LjYxYTUuMjIgNS4yMiAwIDAgMSAzLjc1LTMuNzVWMEwwIDMuMjR2NS4zN3pNNy4yOCAxNWE1LjIzIDUuMjMgMCAwIDEtMy43NS0zLjc1SC4yMkExMiAxMiAwIDAgMCA3LjI4IDIwem02LjM4LTMuNzVBNS4yMyA1LjIzIDAgMCAxIDkuOTEgMTV2NWExMiAxMiAwIDAgMCA3LjA1LTguNzV6Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iOC41OSIgY3k9IjkuOTIiIHI9IjIuNjMiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Security Command Center');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud security command center', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 258, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Security Command Center', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3LjE4MDAwMDMwNTE3NTc4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTcuMTgwMDAwMzA1MTc1NzggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05LjkgNC44NWE1LjIzIDUuMjMgMCAwIDEgMy43NSAzLjc1aDMuNTNWMy4yNEw5LjkgMHpNMy41MiA4LjYxYTUuMjIgNS4yMiAwIDAgMSAzLjc1LTMuNzVWMEwwIDMuMjR2NS4zN3pNNy4yOCAxNWE1LjIzIDUuMjMgMCAwIDEtMy43NS0zLjc1SC4yMkExMiAxMiAwIDAgMCA3LjI4IDIwem02LjM4LTMuNzVBNS4yMyA1LjIzIDAgMCAxIDkuOTEgMTV2NWExMiAxMiAwIDAgMCA3LjA1LTguNzV6Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iOC41OSIgY3k9IjkuOTIiIHI9IjIuNjMiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Security Command Center');
			})
		);

		fns.push(
			this.addEntry(dt + 'security key enforcement', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Security Key\nEnforcement', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE1LjcyMyIgaGVpZ2h0PSIxOS45ODYiIHZpZXdCb3g9IjAgMCAxNS43MjMgMTkuOTg2Ij4mI3hhOwk8cGF0aCBkPSJNMy42MzQgMTQuNTg2di0zLjc1YzAtLjE1LS4yOS0uMzQtLjQ5LS40M2E1LjQ2IDUuNDYgMCAxIDEgNy40NC02LjgzIDUuNCA1LjQgMCAwIDEtMi43MyA2Ljc5LjgyLjgyIDAgMCAwLS41NC45djguNzJoLTMuNjh2LTEuNzVILjAyNHYtMy42NXptMy42NC05LjExYTEuODIgMS44MiAwIDEgMC0zLjY0LS4wNiAxLjgzIDEuODMgMCAwIDAgMS44IDEuODVoMGExLjg0IDEuODQgMCAwIDAgMS44My0xLjc5eiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGQ9Ik0xNS4zNzQgMy41NzZhNS40NCA1LjQ0IDAgMCAwLTYuMzItMy40NCA1LjQ0IDUuNDQgMCAwIDEgMS4xMyAxMC4yMy44NC44NCAwIDAgMC0uNTUuOXY4LjcyaDIuNDN2LTguNzFhLjgzLjgzIDAgMCAxIC41NS0uOSA1LjQgNS40IDAgMCAwIDIuNzYtNi44eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Security Key Enforcement');
			})
		);

		fns.push(
			this.addEntry(dt + 'security key enforcement', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 210, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Security Key Enforcement', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE1LjcyMyIgaGVpZ2h0PSIxOS45ODYiIHZpZXdCb3g9IjAgMCAxNS43MjMgMTkuOTg2Ij4mI3hhOwk8cGF0aCBkPSJNMy42MzQgMTQuNTg2di0zLjc1YzAtLjE1LS4yOS0uMzQtLjQ5LS40M2E1LjQ2IDUuNDYgMCAxIDEgNy40NC02LjgzIDUuNCA1LjQgMCAwIDEtMi43MyA2Ljc5LjgyLjgyIDAgMCAwLS41NC45djguNzJoLTMuNjh2LTEuNzVILjAyNHYtMy42NXptMy42NC05LjExYTEuODIgMS44MiAwIDEgMC0zLjY0LS4wNiAxLjgzIDEuODMgMCAwIDAgMS44IDEuODVoMGExLjg0IDEuODQgMCAwIDAgMS44My0xLjc5eiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGQ9Ik0xNS4zNzQgMy41NzZhNS40NCA1LjQ0IDAgMCAwLTYuMzItMy40NCA1LjQ0IDUuNDQgMCAwIDEgMS4xMyAxMC4yMy44NC44NCAwIDAgMC0uNTUuOXY4LjcyaDIuNDN2LTguNzFhLjgzLjgzIDAgMCAxIC41NS0uOSA1LjQgNS40IDAgMCAwIDIuNzYtNi44eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Security Key Enforcement');
			})
		);

		fns.push(
			this.addEntry(dt + 'security key enforcement', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 218, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Security Key Enforcement', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE1LjcyMyIgaGVpZ2h0PSIxOS45ODYiIHZpZXdCb3g9IjAgMCAxNS43MjMgMTkuOTg2Ij4mI3hhOwk8cGF0aCBkPSJNMy42MzQgMTQuNTg2di0zLjc1YzAtLjE1LS4yOS0uMzQtLjQ5LS40M2E1LjQ2IDUuNDYgMCAxIDEgNy40NC02LjgzIDUuNCA1LjQgMCAwIDEtMi43MyA2Ljc5LjgyLjgyIDAgMCAwLS41NC45djguNzJoLTMuNjh2LTEuNzVILjAyNHYtMy42NXptMy42NC05LjExYTEuODIgMS44MiAwIDEgMC0zLjY0LS4wNiAxLjgzIDEuODMgMCAwIDAgMS44IDEuODVoMGExLjg0IDEuODQgMCAwIDAgMS44My0xLjc5eiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGQ9Ik0xNS4zNzQgMy41NzZhNS40NCA1LjQ0IDAgMCAwLTYuMzItMy40NCA1LjQ0IDUuNDQgMCAwIDEgMS4xMyAxMC4yMy44NC44NCAwIDAgMC0uNTUuOXY4LjcyaDIuNDN2LTguNzFhLjgzLjgzIDAgMCAxIC41NS0uOSA1LjQgNS40IDAgMCAwIDIuNzYtNi44eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Security Key Enforcement');
			})
		);

		this.addPalette('gcp2Security', 'GCP / Security', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGCP2DataAnalyticsPalette = function()
	{
		var dt = 'gcp google cloud platform data analytics ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'bigquery big query', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('BigQuery', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMTA0NTIyNzA1MDc4IiBoZWlnaHQ9IjIwLjAwMTA0NTIyNzA1MDc4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMC4wMDEwNDUyMjcwNTA3OCAyMC4wMDEwNDUyMjcwNTA3OCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00LjczIDguODN2Mi42M2E0LjkxIDQuOTEgMCAwIDAgMS43MSAxLjc0VjguODN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTcuODkgNi40MXY3LjUzQTcuNjIgNy42MiAwIDAgMCA5IDE0YTggOCAwIDAgMCAxIDBWNi40MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTEuNjQgOS44NnYzLjI5YTUgNSAwIDAgMCAxLjctMS44MlY5Ljg2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS43NCAxNC4zMmwtMS40MiAxLjQyYS40Mi40MiAwIDAgMCAwIC42bDMuNTQgMy41NGEuNDIuNDIgMCAwIDAgLjU5IDBsMS40My0xLjQzYS40Mi40MiAwIDAgMCAwLS41OWwtMy41NC0zLjU0YS40Mi40MiAwIDAgMC0uNiAwIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkgMGE5IDkgMCAxIDAgMCAxOEE5IDkgMCAxIDAgOSAwbTAgMTUuNjlhNi42OCA2LjY4IDAgMCAxIC4wMDctMTMuMzYgNi42OCA2LjY4IDAgMCAxIDQuNzI3IDExLjQwM0E2LjY4IDYuNjggMCAwIDEgOSAxNS42OSIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'BigQuery');
			})
		);

		fns.push(
			this.addEntry(dt + 'bigquery big query', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>BigQuery', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMTA0NTIyNzA1MDc4IiBoZWlnaHQ9IjIwLjAwMTA0NTIyNzA1MDc4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMC4wMDEwNDUyMjcwNTA3OCAyMC4wMDEwNDUyMjcwNTA3OCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00LjczIDguODN2Mi42M2E0LjkxIDQuOTEgMCAwIDAgMS43MSAxLjc0VjguODN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTcuODkgNi40MXY3LjUzQTcuNjIgNy42MiAwIDAgMCA5IDE0YTggOCAwIDAgMCAxIDBWNi40MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTEuNjQgOS44NnYzLjI5YTUgNSAwIDAgMCAxLjctMS44MlY5Ljg2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS43NCAxNC4zMmwtMS40MiAxLjQyYS40Mi40MiAwIDAgMCAwIC42bDMuNTQgMy41NGEuNDIuNDIgMCAwIDAgLjU5IDBsMS40My0xLjQzYS40Mi40MiAwIDAgMCAwLS41OWwtMy41NC0zLjU0YS40Mi40MiAwIDAgMC0uNiAwIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkgMGE5IDkgMCAxIDAgMCAxOEE5IDkgMCAxIDAgOSAwbTAgMTUuNjlhNi42OCA2LjY4IDAgMCAxIC4wMDctMTMuMzYgNi42OCA2LjY4IDAgMCAxIDQuNzI3IDExLjQwM0E2LjY4IDYuNjggMCAwIDEgOSAxNS42OSIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'BigQuery');
			})
		);

		fns.push(
			this.addEntry(dt + 'bigquery big query', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>BigQuery', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMTA0NTIyNzA1MDc4IiBoZWlnaHQ9IjIwLjAwMTA0NTIyNzA1MDc4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMC4wMDEwNDUyMjcwNTA3OCAyMC4wMDEwNDUyMjcwNTA3OCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00LjczIDguODN2Mi42M2E0LjkxIDQuOTEgMCAwIDAgMS43MSAxLjc0VjguODN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTcuODkgNi40MXY3LjUzQTcuNjIgNy42MiAwIDAgMCA5IDE0YTggOCAwIDAgMCAxIDBWNi40MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTEuNjQgOS44NnYzLjI5YTUgNSAwIDAgMCAxLjctMS44MlY5Ljg2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS43NCAxNC4zMmwtMS40MiAxLjQyYS40Mi40MiAwIDAgMCAwIC42bDMuNTQgMy41NGEuNDIuNDIgMCAwIDAgLjU5IDBsMS40My0xLjQzYS40Mi40MiAwIDAgMCAwLS41OWwtMy41NC0zLjU0YS40Mi40MiAwIDAgMC0uNiAwIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkgMGE5IDkgMCAxIDAgMCAxOEE5IDkgMCAxIDAgOSAwbTAgMTUuNjlhNi42OCA2LjY4IDAgMCAxIC4wMDctMTMuMzYgNi42OCA2LjY4IDAgMCAxIDQuNzI3IDExLjQwM0E2LjY4IDYuNjggMCAwIDEgOSAxNS42OSIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'BigQuery');
			})
		);

		fns.push(
			this.addEntry(dt + 'datalab', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Datalab', 
			    		new mxGeometry(0, 0, 20, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjI3MS44OTgxMDE4MDY2NDA2IiBoZWlnaHQ9IjQyMy4wMDQwMjgzMjAzMTI1IiB2aWV3Qm94PSIwLjAwMDQ2MTI3MDM2MzMwMjkwMTQgMCAyNzEuODk4MTAxODA2NjQwNiA0MjMuMDA0MDI4MzIwMzEyNSI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDtmaWxsLXJ1bGU6ZXZlbm9kZH0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOTcuMzc4IDE0NC43NzRhMy4xMSAzLjExIDAgMCAxIDMuMTA1IDIuOTM0bC4wMDUuMTc3djE3LjEwN2EzLjExIDMuMTEgMCAwIDEtMi45MzQgMy4xMDVsLS4xNzcuMDA1aC0xMi40NDF2MzAuNjQ5YzAgMS4yMjcuMjk3IDIuNDM1Ljg2MiAzLjUyMmwuMTYxLjI5MyA4My44OTUgMTQ0LjI2MmExNS4yNiAxNS4yNiAwIDAgMSAuMTgyIDE0LjkzNmwtLjE4Mi4zMjQtMzAuNDMxIDUzLjI4NmExNS4yNiAxNS4yNiAwIDAgMS0xMi44NjEgNy42MjZsLS4zNTUuMDA0SDQ1LjY5MmExNS4yNiAxNS4yNiAwIDAgMS0xMy4wMzUtNy4zMjRsLS4xODEtLjMwNS0zMC40MzEtNTMuMjg2YTE1LjI2IDE1LjI2IDAgMCAxLS4xODItMTQuOTM2bC4xODItLjMyNCA4My42NzQtMTQ0LjI2MmMuNjIxLTEuMDc3IDEuMTYtMi4yODkgMS4yMzQtMy41MjhsLjAwOS0uMjg3di0zMC42NDlINzQuNTJjLTEuNjU4IDAtMy4wMTQtMS4yOTktMy4xMDUtMi45MzRsLS4wMDUtLjE3NnYtMTcuMTA3YTMuMTEgMy4xMSAwIDAgMSAyLjkzNC0zLjEwNWwuMTc2LS4wMDV6bS0zNS43NjkgMjMuMzI3aC01MS4zMnYzNS40MDVjMCAyLjUzMS0uNjI4IDUuMDE4LTEuODI2IDcuMjQybC0uMjE3LjM5TDI4LjAzMyAzNTAuOWE3LjYzIDcuNjMgMCAwIDAtLjEzOSA3LjM3NWwuMTQxLjI1NSAyMC43NDEgMzUuOTIxYTcuNjMgNy42MyAwIDAgMCA2LjMyNyAzLjgxbC4yODEuMDA1aDI1LjU3MmwtMjIuNjA1LTM5LjE1M2MtMS4zMTQtMi4yNzYtMS4zNjEtNS4wNjItLjE0MS03LjM3NWwuMTQxLS4yNTUgMTkuNjc5LTM0LjA4NmgxNDYuNjA2TDIxMi45ODggMjk3LjFoLTU0LjI1OWwtOC44MjEtMTUuMjc4aDU0LjMxMmwtMTYuMzMzLTI4LjQ2aC01NC43OGwtOC44MjEtMTUuMjc4aDU0LjgzM2wtMTUuNDY1LTI2Ljk0NmExNS4yNyAxNS4yNyAwIDAgMS0yLjAzOS03LjE4NWwtLjAwNy0uNDQ2em03Mi44NDQgMTY2LjQwMWwtNTQuMTgxLjAwMSA4LjgyMSAxNS41NTJoNTQuMjg1ek0xMDQuOTIxIDc5Ljc5NWM4LjQyNyAwIDE1LjI1OSA2LjgzMyAxNS4yNTkgMTUuMjYxcy02LjgzMiAxNS4yNTktMTUuMjU5IDE1LjI1OS0xNS4yNTktNi44MzItMTUuMjU5LTE1LjI1OSA2LjgzMi0xNS4yNjEgMTUuMjU5LTE1LjI2MXptNTcuNTc1LTMyLjc0M2MxMi42NDIgMCAyMi44OSAxMC4yNDcgMjIuODkgMjIuODg5cy0xMC4yNDkgMjIuODg5LTIyLjg5IDIyLjg4OS0yMi44ODktMTAuMjQ5LTIyLjg4OS0yMi44ODkgMTAuMjQ3LTIyLjg4OSAyMi44ODktMjIuODg5ek0xMjcuODEgMGM4LjQyNyAwIDE1LjI2MSA2LjgzMyAxNS4yNjEgMTUuMjYxUzEzNi4yMzcgMzAuNTIgMTI3LjgxIDMwLjUycy0xNS4yNTktNi44MzItMTUuMjU5LTE1LjI1OVMxMTkuMzg0IDAgMTI3LjgxIDB6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(20, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Datalab');
			})
		);

		fns.push(
			this.addEntry(dt + 'datalab', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Datalab', 
			    		new mxGeometry(0, 0, 20, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjI3MS44OTgxMDE4MDY2NDA2IiBoZWlnaHQ9IjQyMy4wMDQwMjgzMjAzMTI1IiB2aWV3Qm94PSIwLjAwMDQ2MTI3MDM2MzMwMjkwMTQgMCAyNzEuODk4MTAxODA2NjQwNiA0MjMuMDA0MDI4MzIwMzEyNSI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDtmaWxsLXJ1bGU6ZXZlbm9kZH0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOTcuMzc4IDE0NC43NzRhMy4xMSAzLjExIDAgMCAxIDMuMTA1IDIuOTM0bC4wMDUuMTc3djE3LjEwN2EzLjExIDMuMTEgMCAwIDEtMi45MzQgMy4xMDVsLS4xNzcuMDA1aC0xMi40NDF2MzAuNjQ5YzAgMS4yMjcuMjk3IDIuNDM1Ljg2MiAzLjUyMmwuMTYxLjI5MyA4My44OTUgMTQ0LjI2MmExNS4yNiAxNS4yNiAwIDAgMSAuMTgyIDE0LjkzNmwtLjE4Mi4zMjQtMzAuNDMxIDUzLjI4NmExNS4yNiAxNS4yNiAwIDAgMS0xMi44NjEgNy42MjZsLS4zNTUuMDA0SDQ1LjY5MmExNS4yNiAxNS4yNiAwIDAgMS0xMy4wMzUtNy4zMjRsLS4xODEtLjMwNS0zMC40MzEtNTMuMjg2YTE1LjI2IDE1LjI2IDAgMCAxLS4xODItMTQuOTM2bC4xODItLjMyNCA4My42NzQtMTQ0LjI2MmMuNjIxLTEuMDc3IDEuMTYtMi4yODkgMS4yMzQtMy41MjhsLjAwOS0uMjg3di0zMC42NDlINzQuNTJjLTEuNjU4IDAtMy4wMTQtMS4yOTktMy4xMDUtMi45MzRsLS4wMDUtLjE3NnYtMTcuMTA3YTMuMTEgMy4xMSAwIDAgMSAyLjkzNC0zLjEwNWwuMTc2LS4wMDV6bS0zNS43NjkgMjMuMzI3aC01MS4zMnYzNS40MDVjMCAyLjUzMS0uNjI4IDUuMDE4LTEuODI2IDcuMjQybC0uMjE3LjM5TDI4LjAzMyAzNTAuOWE3LjYzIDcuNjMgMCAwIDAtLjEzOSA3LjM3NWwuMTQxLjI1NSAyMC43NDEgMzUuOTIxYTcuNjMgNy42MyAwIDAgMCA2LjMyNyAzLjgxbC4yODEuMDA1aDI1LjU3MmwtMjIuNjA1LTM5LjE1M2MtMS4zMTQtMi4yNzYtMS4zNjEtNS4wNjItLjE0MS03LjM3NWwuMTQxLS4yNTUgMTkuNjc5LTM0LjA4NmgxNDYuNjA2TDIxMi45ODggMjk3LjFoLTU0LjI1OWwtOC44MjEtMTUuMjc4aDU0LjMxMmwtMTYuMzMzLTI4LjQ2aC01NC43OGwtOC44MjEtMTUuMjc4aDU0LjgzM2wtMTUuNDY1LTI2Ljk0NmExNS4yNyAxNS4yNyAwIDAgMS0yLjAzOS03LjE4NWwtLjAwNy0uNDQ2em03Mi44NDQgMTY2LjQwMWwtNTQuMTgxLjAwMSA4LjgyMSAxNS41NTJoNTQuMjg1ek0xMDQuOTIxIDc5Ljc5NWM4LjQyNyAwIDE1LjI1OSA2LjgzMyAxNS4yNTkgMTUuMjYxcy02LjgzMiAxNS4yNTktMTUuMjU5IDE1LjI1OS0xNS4yNTktNi44MzItMTUuMjU5LTE1LjI1OSA2LjgzMi0xNS4yNjEgMTUuMjU5LTE1LjI2MXptNTcuNTc1LTMyLjc0M2MxMi42NDIgMCAyMi44OSAxMC4yNDcgMjIuODkgMjIuODg5cy0xMC4yNDkgMjIuODg5LTIyLjg5IDIyLjg4OS0yMi44ODktMTAuMjQ5LTIyLjg4OS0yMi44ODkgMTAuMjQ3LTIyLjg4OSAyMi44ODktMjIuODg5ek0xMjcuODEgMGM4LjQyNyAwIDE1LjI2MSA2LjgzMyAxNS4yNjEgMTUuMjYxUzEzNi4yMzcgMzAuNTIgMTI3LjgxIDMwLjUycy0xNS4yNTktNi44MzItMTUuMjU5LTE1LjI1OVMxMTkuMzg0IDAgMTI3LjgxIDB6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(20, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Datalab');
			})
		);

		fns.push(
			this.addEntry(dt + 'datalab', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 118, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Datalab', 
			    		new mxGeometry(0, 0, 20, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjI3MS44OTgxMDE4MDY2NDA2IiBoZWlnaHQ9IjQyMy4wMDQwMjgzMjAzMTI1IiB2aWV3Qm94PSIwLjAwMDQ2MTI3MDM2MzMwMjkwMTQgMCAyNzEuODk4MTAxODA2NjQwNiA0MjMuMDA0MDI4MzIwMzEyNSI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDtmaWxsLXJ1bGU6ZXZlbm9kZH0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOTcuMzc4IDE0NC43NzRhMy4xMSAzLjExIDAgMCAxIDMuMTA1IDIuOTM0bC4wMDUuMTc3djE3LjEwN2EzLjExIDMuMTEgMCAwIDEtMi45MzQgMy4xMDVsLS4xNzcuMDA1aC0xMi40NDF2MzAuNjQ5YzAgMS4yMjcuMjk3IDIuNDM1Ljg2MiAzLjUyMmwuMTYxLjI5MyA4My44OTUgMTQ0LjI2MmExNS4yNiAxNS4yNiAwIDAgMSAuMTgyIDE0LjkzNmwtLjE4Mi4zMjQtMzAuNDMxIDUzLjI4NmExNS4yNiAxNS4yNiAwIDAgMS0xMi44NjEgNy42MjZsLS4zNTUuMDA0SDQ1LjY5MmExNS4yNiAxNS4yNiAwIDAgMS0xMy4wMzUtNy4zMjRsLS4xODEtLjMwNS0zMC40MzEtNTMuMjg2YTE1LjI2IDE1LjI2IDAgMCAxLS4xODItMTQuOTM2bC4xODItLjMyNCA4My42NzQtMTQ0LjI2MmMuNjIxLTEuMDc3IDEuMTYtMi4yODkgMS4yMzQtMy41MjhsLjAwOS0uMjg3di0zMC42NDlINzQuNTJjLTEuNjU4IDAtMy4wMTQtMS4yOTktMy4xMDUtMi45MzRsLS4wMDUtLjE3NnYtMTcuMTA3YTMuMTEgMy4xMSAwIDAgMSAyLjkzNC0zLjEwNWwuMTc2LS4wMDV6bS0zNS43NjkgMjMuMzI3aC01MS4zMnYzNS40MDVjMCAyLjUzMS0uNjI4IDUuMDE4LTEuODI2IDcuMjQybC0uMjE3LjM5TDI4LjAzMyAzNTAuOWE3LjYzIDcuNjMgMCAwIDAtLjEzOSA3LjM3NWwuMTQxLjI1NSAyMC43NDEgMzUuOTIxYTcuNjMgNy42MyAwIDAgMCA2LjMyNyAzLjgxbC4yODEuMDA1aDI1LjU3MmwtMjIuNjA1LTM5LjE1M2MtMS4zMTQtMi4yNzYtMS4zNjEtNS4wNjItLjE0MS03LjM3NWwuMTQxLS4yNTUgMTkuNjc5LTM0LjA4NmgxNDYuNjA2TDIxMi45ODggMjk3LjFoLTU0LjI1OWwtOC44MjEtMTUuMjc4aDU0LjMxMmwtMTYuMzMzLTI4LjQ2aC01NC43OGwtOC44MjEtMTUuMjc4aDU0LjgzM2wtMTUuNDY1LTI2Ljk0NmExNS4yNyAxNS4yNyAwIDAgMS0yLjAzOS03LjE4NWwtLjAwNy0uNDQ2em03Mi44NDQgMTY2LjQwMWwtNTQuMTgxLjAwMSA4LjgyMSAxNS41NTJoNTQuMjg1ek0xMDQuOTIxIDc5Ljc5NWM4LjQyNyAwIDE1LjI1OSA2LjgzMyAxNS4yNTkgMTUuMjYxcy02LjgzMiAxNS4yNTktMTUuMjU5IDE1LjI1OS0xNS4yNTktNi44MzItMTUuMjU5LTE1LjI1OSA2LjgzMi0xNS4yNjEgMTUuMjU5LTE1LjI2MXptNTcuNTc1LTMyLjc0M2MxMi42NDIgMCAyMi44OSAxMC4yNDcgMjIuODkgMjIuODg5cy0xMC4yNDkgMjIuODg5LTIyLjg5IDIyLjg4OS0yMi44ODktMTAuMjQ5LTIyLjg4OS0yMi44ODkgMTAuMjQ3LTIyLjg4OSAyMi44ODktMjIuODg5ek0xMjcuODEgMGM4LjQyNyAwIDE1LjI2MSA2LjgzMyAxNS4yNjEgMTUuMjYxUzEzNi4yMzcgMzAuNTIgMTI3LjgxIDMwLjUycy0xNS4yNTktNi44MzItMTUuMjU5LTE1LjI1OVMxMTkuMzg0IDAgMTI3LjgxIDB6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(20, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Datalab');
			})
		);

		fns.push(
			this.addEntry(dt + 'dataflow', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Dataflow', 
			    		new mxGeometry(0, 0, 22, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjUxOTk5OTUwNDA4OTM1NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjUxOTk5OTUwNDA4OTM1NSAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjM3IDIuMDNsLTEuNzIuOTYgMS41MiAxLjUtLjAyIDEuNzMgMS4wMi4wMS4wMi0xLjczIDQuMjQgMi41Ni0uMDEgMS4wNyAxLjc3LjAzVjYuMTFMOS4wNSAzLjA0bC0uMjctLjk0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNy4zNiAyLjAzbC0xLjQyLjM1LS4yOS42MUwuMzkgNS45Mi4zNiA3Ljk3IDIuMTQgOGwuMDItMS4wNyA0LjMxLTIuNDUtLjAyIDEuNzMuODYuMDEuMDYtNC4xOXoiLz4mI3hhOwkJPGcgY2xhc3M9InN0MSI+JiN4YTsJCQk8cGF0aCBkPSJNNy4zNiAyLjAzTDMuOTUgMCAyLjIxLjk1bDMuNDQgMi4wNCAxLjcyLS45NnptLjcxIDExLjc2bC0xLjcyLS4wMi0uMDIgMS43Mi44MiAyLjQ4IDEuNDItLjEyLjI5LS44NSA1LjI3LTIuOTMuMDMtMi4wOS0xLjc5LS4wMi0uMDIgMS4xLTQuMyAyLjQ1eiIvPiYjeGE7CQkJPHBhdGggZD0iTTcuMTUgMTcuOTdsLTMuNDYgMS45NGgtLjA1bC0xLjY2LS45OSAzLjQ5LTEuOTYgMS42OCAxLjAxeiIvPiYjeGE7CQk8L2c+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMC44OC4wOWgtLjA1TDcuMzcgMi4wM2wxLjY4IDEuMDEgMy40OS0xLjk2ek0xMC42MiAyMGgtLjA1bC0zLjQyLTIuMDNoMCAwIDBsMS43Mi0uOTYgMy40NCAyLjA0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNLjMzIDEzLjg5di0yaDEuNzZsLS4wMSAxLjA0IDQuMjUgMi41Ni4wMi0xLjcyLjg2LjAxLS4wNiA0LjE4LTEuNjgtMXoiLz4mI3hhOwk8L2c+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iMTMuMzgiIGN5PSIxMC4wNCIgcj0iMS4xNCIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjEuMTQiIGN5PSI5Ljg4IiByPSIxLjE0Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iNy4zMiIgY3k9IjcuOTkiIHI9IjEuMTQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSI3LjIzIiBjeT0iMTIiIHI9IjEuMTQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(19, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataflow');
			})
		);

		fns.push(
			this.addEntry(dt + 'dataflow', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Dataflow', 
			    		new mxGeometry(0, 0, 22, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjUxOTk5OTUwNDA4OTM1NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjUxOTk5OTUwNDA4OTM1NSAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjM3IDIuMDNsLTEuNzIuOTYgMS41MiAxLjUtLjAyIDEuNzMgMS4wMi4wMS4wMi0xLjczIDQuMjQgMi41Ni0uMDEgMS4wNyAxLjc3LjAzVjYuMTFMOS4wNSAzLjA0bC0uMjctLjk0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNy4zNiAyLjAzbC0xLjQyLjM1LS4yOS42MUwuMzkgNS45Mi4zNiA3Ljk3IDIuMTQgOGwuMDItMS4wNyA0LjMxLTIuNDUtLjAyIDEuNzMuODYuMDEuMDYtNC4xOXoiLz4mI3hhOwkJPGcgY2xhc3M9InN0MSI+JiN4YTsJCQk8cGF0aCBkPSJNNy4zNiAyLjAzTDMuOTUgMCAyLjIxLjk1bDMuNDQgMi4wNCAxLjcyLS45NnptLjcxIDExLjc2bC0xLjcyLS4wMi0uMDIgMS43Mi44MiAyLjQ4IDEuNDItLjEyLjI5LS44NSA1LjI3LTIuOTMuMDMtMi4wOS0xLjc5LS4wMi0uMDIgMS4xLTQuMyAyLjQ1eiIvPiYjeGE7CQkJPHBhdGggZD0iTTcuMTUgMTcuOTdsLTMuNDYgMS45NGgtLjA1bC0xLjY2LS45OSAzLjQ5LTEuOTYgMS42OCAxLjAxeiIvPiYjeGE7CQk8L2c+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMC44OC4wOWgtLjA1TDcuMzcgMi4wM2wxLjY4IDEuMDEgMy40OS0xLjk2ek0xMC42MiAyMGgtLjA1bC0zLjQyLTIuMDNoMCAwIDBsMS43Mi0uOTYgMy40NCAyLjA0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNLjMzIDEzLjg5di0yaDEuNzZsLS4wMSAxLjA0IDQuMjUgMi41Ni4wMi0xLjcyLjg2LjAxLS4wNiA0LjE4LTEuNjgtMXoiLz4mI3hhOwk8L2c+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iMTMuMzgiIGN5PSIxMC4wNCIgcj0iMS4xNCIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjEuMTQiIGN5PSI5Ljg4IiByPSIxLjE0Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iNy4zMiIgY3k9IjcuOTkiIHI9IjEuMTQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSI3LjIzIiBjeT0iMTIiIHI9IjEuMTQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(19, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataflow');
			})
		);

		fns.push(
			this.addEntry(dt + 'dataflow', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Dataflow', 
			    		new mxGeometry(0, 0, 22, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjUxOTk5OTUwNDA4OTM1NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjUxOTk5OTUwNDA4OTM1NSAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjM3IDIuMDNsLTEuNzIuOTYgMS41MiAxLjUtLjAyIDEuNzMgMS4wMi4wMS4wMi0xLjczIDQuMjQgMi41Ni0uMDEgMS4wNyAxLjc3LjAzVjYuMTFMOS4wNSAzLjA0bC0uMjctLjk0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNy4zNiAyLjAzbC0xLjQyLjM1LS4yOS42MUwuMzkgNS45Mi4zNiA3Ljk3IDIuMTQgOGwuMDItMS4wNyA0LjMxLTIuNDUtLjAyIDEuNzMuODYuMDEuMDYtNC4xOXoiLz4mI3hhOwkJPGcgY2xhc3M9InN0MSI+JiN4YTsJCQk8cGF0aCBkPSJNNy4zNiAyLjAzTDMuOTUgMCAyLjIxLjk1bDMuNDQgMi4wNCAxLjcyLS45NnptLjcxIDExLjc2bC0xLjcyLS4wMi0uMDIgMS43Mi44MiAyLjQ4IDEuNDItLjEyLjI5LS44NSA1LjI3LTIuOTMuMDMtMi4wOS0xLjc5LS4wMi0uMDIgMS4xLTQuMyAyLjQ1eiIvPiYjeGE7CQkJPHBhdGggZD0iTTcuMTUgMTcuOTdsLTMuNDYgMS45NGgtLjA1bC0xLjY2LS45OSAzLjQ5LTEuOTYgMS42OCAxLjAxeiIvPiYjeGE7CQk8L2c+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMC44OC4wOWgtLjA1TDcuMzcgMi4wM2wxLjY4IDEuMDEgMy40OS0xLjk2ek0xMC42MiAyMGgtLjA1bC0zLjQyLTIuMDNoMCAwIDBsMS43Mi0uOTYgMy40NCAyLjA0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNLjMzIDEzLjg5di0yaDEuNzZsLS4wMSAxLjA0IDQuMjUgMi41Ni4wMi0xLjcyLjg2LjAxLS4wNiA0LjE4LTEuNjgtMXoiLz4mI3hhOwk8L2c+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iMTMuMzgiIGN5PSIxMC4wNCIgcj0iMS4xNCIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjEuMTQiIGN5PSI5Ljg4IiByPSIxLjE0Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iNy4zMiIgY3k9IjcuOTkiIHI9IjEuMTQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSI3LjIzIiBjeT0iMTIiIHI9IjEuMTQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(19, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataflow');
			})
		);

		fns.push(
			this.addEntry(dt + 'pub sub', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Pub/Sub', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMxOTk5OTY5NDgyNDIyIiBoZWlnaHQ9IjIwLjAwMDAwMTkwNzM0ODYzMyIgdmlld0JveD0iMCAwIDE4LjMxOTk5OTY5NDgyNDIyIDIwLjAwMDAwMTkwNzM0ODYzMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxkZWZzPiYjeGE7CQk8ZmlsdGVyIGlkPSJBIiB4PSI0LjY0IiB5PSI0LjE5IiB3aWR0aD0iMTQuNzMiIGhlaWdodD0iMTIuNzYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4mI3hhOwkJCTxmZUZsb29kIGZsb29kLWNvbG9yPSIjZmZmIi8+JiN4YTsJCQk8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIvPiYjeGE7CQk8L2ZpbHRlcj4mI3hhOwkJPG1hc2sgaWQ9IkIiIHg9IjQuNjQiIHk9IjQuMTkiIHdpZHRoPSIxNC43MyIgaGVpZ2h0PSIxMi43NiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSI+JiN4YTsJCQk8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyLjIzIiByPSIzLjU4IiBmaWx0ZXI9InVybCgjQSkiLz4mI3hhOwkJPC9tYXNrPiYjeGE7CTwvZGVmcz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjIuMTkiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxOC4yOCIgcj0iMS43MiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBtYXNrPSJ1cmwoI0IpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMi44NCAtMikiPiYjeGE7CQk8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCguNSAtLjg3IC44NyAuNSAtNC41OSAyMC41MykiIGQ9Ik0xNC42OSAxMC4yMmgxLjU5djguMDRoLTEuNTl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIHRyYW5zZm9ybT0icm90YXRlKDMzMCA4LjUyMyAxNC4yNDQpIiBkPSJNNC40OSAxMy40NWg4LjA0djEuNTlINC40OXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTExLjIgNC4xOWgxLjU5djguMDRIMTEuMnoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxMC4yMyIgcj0iMi43OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIyLjE5IiBjeT0iMTQuMjUiIHI9IjIuMTkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSIxNC4yNSIgcj0iMi4xOSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI5LjE2IiBjeT0iMi4xOSIgcj0iMi4xOSIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Pub/Sub');
			})
		);

		fns.push(
			this.addEntry(dt + 'pub sub', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Pub/Sub', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMxOTk5OTY5NDgyNDIyIiBoZWlnaHQ9IjIwLjAwMDAwMTkwNzM0ODYzMyIgdmlld0JveD0iMCAwIDE4LjMxOTk5OTY5NDgyNDIyIDIwLjAwMDAwMTkwNzM0ODYzMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxkZWZzPiYjeGE7CQk8ZmlsdGVyIGlkPSJBIiB4PSI0LjY0IiB5PSI0LjE5IiB3aWR0aD0iMTQuNzMiIGhlaWdodD0iMTIuNzYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4mI3hhOwkJCTxmZUZsb29kIGZsb29kLWNvbG9yPSIjZmZmIi8+JiN4YTsJCQk8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIvPiYjeGE7CQk8L2ZpbHRlcj4mI3hhOwkJPG1hc2sgaWQ9IkIiIHg9IjQuNjQiIHk9IjQuMTkiIHdpZHRoPSIxNC43MyIgaGVpZ2h0PSIxMi43NiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSI+JiN4YTsJCQk8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyLjIzIiByPSIzLjU4IiBmaWx0ZXI9InVybCgjQSkiLz4mI3hhOwkJPC9tYXNrPiYjeGE7CTwvZGVmcz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjIuMTkiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxOC4yOCIgcj0iMS43MiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBtYXNrPSJ1cmwoI0IpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMi44NCAtMikiPiYjeGE7CQk8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCguNSAtLjg3IC44NyAuNSAtNC41OSAyMC41MykiIGQ9Ik0xNC42OSAxMC4yMmgxLjU5djguMDRoLTEuNTl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIHRyYW5zZm9ybT0icm90YXRlKDMzMCA4LjUyMyAxNC4yNDQpIiBkPSJNNC40OSAxMy40NWg4LjA0djEuNTlINC40OXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTExLjIgNC4xOWgxLjU5djguMDRIMTEuMnoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxMC4yMyIgcj0iMi43OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIyLjE5IiBjeT0iMTQuMjUiIHI9IjIuMTkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSIxNC4yNSIgcj0iMi4xOSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI5LjE2IiBjeT0iMi4xOSIgcj0iMi4xOSIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Pub/Sub');
			})
		);

		fns.push(
			this.addEntry(dt + 'pub sub', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Pub/Sub', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMxOTk5OTY5NDgyNDIyIiBoZWlnaHQ9IjIwLjAwMDAwMTkwNzM0ODYzMyIgdmlld0JveD0iMCAwIDE4LjMxOTk5OTY5NDgyNDIyIDIwLjAwMDAwMTkwNzM0ODYzMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxkZWZzPiYjeGE7CQk8ZmlsdGVyIGlkPSJBIiB4PSI0LjY0IiB5PSI0LjE5IiB3aWR0aD0iMTQuNzMiIGhlaWdodD0iMTIuNzYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4mI3hhOwkJCTxmZUZsb29kIGZsb29kLWNvbG9yPSIjZmZmIi8+JiN4YTsJCQk8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIvPiYjeGE7CQk8L2ZpbHRlcj4mI3hhOwkJPG1hc2sgaWQ9IkIiIHg9IjQuNjQiIHk9IjQuMTkiIHdpZHRoPSIxNC43MyIgaGVpZ2h0PSIxMi43NiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSI+JiN4YTsJCQk8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyLjIzIiByPSIzLjU4IiBmaWx0ZXI9InVybCgjQSkiLz4mI3hhOwkJPC9tYXNrPiYjeGE7CTwvZGVmcz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjIuMTkiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxOC4yOCIgcj0iMS43MiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBtYXNrPSJ1cmwoI0IpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMi44NCAtMikiPiYjeGE7CQk8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCguNSAtLjg3IC44NyAuNSAtNC41OSAyMC41MykiIGQ9Ik0xNC42OSAxMC4yMmgxLjU5djguMDRoLTEuNTl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIHRyYW5zZm9ybT0icm90YXRlKDMzMCA4LjUyMyAxNC4yNDQpIiBkPSJNNC40OSAxMy40NWg4LjA0djEuNTlINC40OXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTExLjIgNC4xOWgxLjU5djguMDRIMTEuMnoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxMC4yMyIgcj0iMi43OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIyLjE5IiBjeT0iMTQuMjUiIHI9IjIuMTkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSIxNC4yNSIgcj0iMi4xOSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI5LjE2IiBjeT0iMi4xOSIgcj0iMi4xOSIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Pub/Sub');
			})
		);

		fns.push(
			this.addEntry(dt + 'dataproc', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Dataproc', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjM2MzAxMjMxMzg0Mjc3MyIgaGVpZ2h0PSIxNy45NzU1MjY4MDk2OTIzODMiIHZpZXdCb3g9IjAuMDAwNTYwMDI1NjI2MzI3ODQyNSAwLjYxOTYyOTc0MDcxNTAyNjkgMTkuMzYzMDEyMzEzODQyNzczIDE3Ljk3NTUyNjgwOTY5MjM4MyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDN7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxnIGNsYXNzPSJzdDAgc3QxIj4mI3hhOwkJPHBhdGggZD0iTTQuNjkgMTYuNGwxMC4xOS01Ljg5Ljk3IDEuNjktMTAuMTggNS44OHoiLz4mI3hhOwkJPHBhdGggZD0iTTcuNSA0LjR2MTAuMzVsLTEuODcgMS40MVY0LjR6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0xNy40OSAxMS4ybC0uOTcgMS42OC04Ljk2LTUuMTktLjI2LTIuMzZ6Ii8+JiN4YTsJPC9nPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAgc3QyIiBkPSJNMTIuMzkgOC4yNkw3LjMgNS4zM2wuMjYgMi4zNiAxLjUxLjg2YTQgNCAwIDAgMCAzLjMyLS4yOXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIHN0MSIgZD0iTTYuMTMgNi4yOWgwYTMuNzggMy43OCAwIDAgMSA1LjE2NS01LjE2M0EzLjc4IDMuNzggMCAwIDEgOS40IDguMThhMy44IDMuOCAwIDAgMS0zLjI3LTEuODl6TTExIDMuNDlhMS44NCAxLjg0IDAgMCAwLTEuNTktLjkyQTEuODMgMS44MyAwIDAgMCA3LjU3IDQuNGExLjg0IDEuODQgMCAwIDAgMi43OTQgMS43MDZBMS44NCAxLjg0IDAgMCAwIDExLjI0IDQuNGExLjggMS44IDAgMCAwLS4yNC0uOTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCBzdDIiIGQ9Ik01LjYzIDEwLjk0djUuMjJsMS44Ny0xLjQxdi0xLjYzYTMuMjkgMy4yOSAwIDAgMC0xLjg3LTIuMTh6bTUuNyAzLjg3bDQuNTItMi42MS0yLjIxLTEtMS4yNS44YTQuMjMgNC4yMyAwIDAgMC0xLjA2IDIuODZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCBzdDEiIGQ9Ik0uNTEgMTYuN2gwYTMuNzcgMy43NyAwIDAgMSAxLjM4LTUuMTYgMy43MiAzLjcyIDAgMCAxIDIuODYtLjM4QTMuNzggMy43OCAwIDEgMSAuNTEgMTYuN3ptNC44NS0yLjgxQTEuNzkgMS43OSAwIDAgMCA0LjI1IDEzYTEuODMgMS44MyAwIDAgMC0yLjA2IDIuNjloMGMuMzI5LjU2Ni45MzQuOTE0IDEuNTg5LjkxM2ExLjgzIDEuODMgMCAwIDAgMS41ODUtLjkyYy4zMjYtLjU2OC4zMjQtMS4yNjctLjAwNC0xLjgzM3ptNi45NyAyLjQ3aDBhMy43OSAzLjc5IDAgMCAxIDAtMy43NyAzLjc5IDMuNzkgMCAwIDEgNS4xNi0xLjM5IDMuNzggMy43OCAwIDAgMS0xLjg5IDcuMDQ0IDMuNzggMy43OCAwIDAgMS0zLjI3LTEuODg0em00Ljg2LTIuODFhMiAyIDAgMCAwLS42Ny0uNjcgMS44NSAxLjg1IDAgMCAwLTIuNTEuNjggMS44NiAxLjg2IDAgMCAwIDAgMS44MyAxLjgzIDEuODMgMCAwIDAgMi4wNy44NSAxLjgyIDEuODIgMCAwIDAgMS4xMS0uODUgMS44OCAxLjg4IDAgMCAwIDAtMS44NHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIHN0MyIgZD0iTTcuNDkgMTQuMTVsLTIuOCAyLjI1IDIuODYtMS42NWE0LjA3IDQuMDcgMCAwIDAtLjA2LS42ek04LjE1IDhsLS41OS0zLjZ2My4yOWEzLjQ3IDMuNDcgMCAwIDAgLjU5LjI3em01LjE1IDMuNDdsMy4yMiAxLjQxLTIuODYtMS42NGExLjY5IDEuNjkgMCAwIDAtLjM2LjIzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataproc');
			})
		);

		fns.push(
			this.addEntry(dt + 'dataproc', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Dataproc', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjM2MzAxMjMxMzg0Mjc3MyIgaGVpZ2h0PSIxNy45NzU1MjY4MDk2OTIzODMiIHZpZXdCb3g9IjAuMDAwNTYwMDI1NjI2MzI3ODQyNSAwLjYxOTYyOTc0MDcxNTAyNjkgMTkuMzYzMDEyMzEzODQyNzczIDE3Ljk3NTUyNjgwOTY5MjM4MyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDN7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxnIGNsYXNzPSJzdDAgc3QxIj4mI3hhOwkJPHBhdGggZD0iTTQuNjkgMTYuNGwxMC4xOS01Ljg5Ljk3IDEuNjktMTAuMTggNS44OHoiLz4mI3hhOwkJPHBhdGggZD0iTTcuNSA0LjR2MTAuMzVsLTEuODcgMS40MVY0LjR6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0xNy40OSAxMS4ybC0uOTcgMS42OC04Ljk2LTUuMTktLjI2LTIuMzZ6Ii8+JiN4YTsJPC9nPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAgc3QyIiBkPSJNMTIuMzkgOC4yNkw3LjMgNS4zM2wuMjYgMi4zNiAxLjUxLjg2YTQgNCAwIDAgMCAzLjMyLS4yOXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIHN0MSIgZD0iTTYuMTMgNi4yOWgwYTMuNzggMy43OCAwIDAgMSA1LjE2NS01LjE2M0EzLjc4IDMuNzggMCAwIDEgOS40IDguMThhMy44IDMuOCAwIDAgMS0zLjI3LTEuODl6TTExIDMuNDlhMS44NCAxLjg0IDAgMCAwLTEuNTktLjkyQTEuODMgMS44MyAwIDAgMCA3LjU3IDQuNGExLjg0IDEuODQgMCAwIDAgMi43OTQgMS43MDZBMS44NCAxLjg0IDAgMCAwIDExLjI0IDQuNGExLjggMS44IDAgMCAwLS4yNC0uOTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCBzdDIiIGQ9Ik01LjYzIDEwLjk0djUuMjJsMS44Ny0xLjQxdi0xLjYzYTMuMjkgMy4yOSAwIDAgMC0xLjg3LTIuMTh6bTUuNyAzLjg3bDQuNTItMi42MS0yLjIxLTEtMS4yNS44YTQuMjMgNC4yMyAwIDAgMC0xLjA2IDIuODZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCBzdDEiIGQ9Ik0uNTEgMTYuN2gwYTMuNzcgMy43NyAwIDAgMSAxLjM4LTUuMTYgMy43MiAzLjcyIDAgMCAxIDIuODYtLjM4QTMuNzggMy43OCAwIDEgMSAuNTEgMTYuN3ptNC44NS0yLjgxQTEuNzkgMS43OSAwIDAgMCA0LjI1IDEzYTEuODMgMS44MyAwIDAgMC0yLjA2IDIuNjloMGMuMzI5LjU2Ni45MzQuOTE0IDEuNTg5LjkxM2ExLjgzIDEuODMgMCAwIDAgMS41ODUtLjkyYy4zMjYtLjU2OC4zMjQtMS4yNjctLjAwNC0xLjgzM3ptNi45NyAyLjQ3aDBhMy43OSAzLjc5IDAgMCAxIDAtMy43NyAzLjc5IDMuNzkgMCAwIDEgNS4xNi0xLjM5IDMuNzggMy43OCAwIDAgMS0xLjg5IDcuMDQ0IDMuNzggMy43OCAwIDAgMS0zLjI3LTEuODg0em00Ljg2LTIuODFhMiAyIDAgMCAwLS42Ny0uNjcgMS44NSAxLjg1IDAgMCAwLTIuNTEuNjggMS44NiAxLjg2IDAgMCAwIDAgMS44MyAxLjgzIDEuODMgMCAwIDAgMi4wNy44NSAxLjgyIDEuODIgMCAwIDAgMS4xMS0uODUgMS44OCAxLjg4IDAgMCAwIDAtMS44NHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIHN0MyIgZD0iTTcuNDkgMTQuMTVsLTIuOCAyLjI1IDIuODYtMS42NWE0LjA3IDQuMDcgMCAwIDAtLjA2LS42ek04LjE1IDhsLS41OS0zLjZ2My4yOWEzLjQ3IDMuNDcgMCAwIDAgLjU5LjI3em01LjE1IDMuNDdsMy4yMiAxLjQxLTIuODYtMS42NGExLjY5IDEuNjkgMCAwIDAtLjM2LjIzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataproc');
			})
		);

		fns.push(
			this.addEntry(dt + 'dataproc', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Dataproc', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjM2MzAxMjMxMzg0Mjc3MyIgaGVpZ2h0PSIxNy45NzU1MjY4MDk2OTIzODMiIHZpZXdCb3g9IjAuMDAwNTYwMDI1NjI2MzI3ODQyNSAwLjYxOTYyOTc0MDcxNTAyNjkgMTkuMzYzMDEyMzEzODQyNzczIDE3Ljk3NTUyNjgwOTY5MjM4MyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDN7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxnIGNsYXNzPSJzdDAgc3QxIj4mI3hhOwkJPHBhdGggZD0iTTQuNjkgMTYuNGwxMC4xOS01Ljg5Ljk3IDEuNjktMTAuMTggNS44OHoiLz4mI3hhOwkJPHBhdGggZD0iTTcuNSA0LjR2MTAuMzVsLTEuODcgMS40MVY0LjR6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0xNy40OSAxMS4ybC0uOTcgMS42OC04Ljk2LTUuMTktLjI2LTIuMzZ6Ii8+JiN4YTsJPC9nPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAgc3QyIiBkPSJNMTIuMzkgOC4yNkw3LjMgNS4zM2wuMjYgMi4zNiAxLjUxLjg2YTQgNCAwIDAgMCAzLjMyLS4yOXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIHN0MSIgZD0iTTYuMTMgNi4yOWgwYTMuNzggMy43OCAwIDAgMSA1LjE2NS01LjE2M0EzLjc4IDMuNzggMCAwIDEgOS40IDguMThhMy44IDMuOCAwIDAgMS0zLjI3LTEuODl6TTExIDMuNDlhMS44NCAxLjg0IDAgMCAwLTEuNTktLjkyQTEuODMgMS44MyAwIDAgMCA3LjU3IDQuNGExLjg0IDEuODQgMCAwIDAgMi43OTQgMS43MDZBMS44NCAxLjg0IDAgMCAwIDExLjI0IDQuNGExLjggMS44IDAgMCAwLS4yNC0uOTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCBzdDIiIGQ9Ik01LjYzIDEwLjk0djUuMjJsMS44Ny0xLjQxdi0xLjYzYTMuMjkgMy4yOSAwIDAgMC0xLjg3LTIuMTh6bTUuNyAzLjg3bDQuNTItMi42MS0yLjIxLTEtMS4yNS44YTQuMjMgNC4yMyAwIDAgMC0xLjA2IDIuODZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCBzdDEiIGQ9Ik0uNTEgMTYuN2gwYTMuNzcgMy43NyAwIDAgMSAxLjM4LTUuMTYgMy43MiAzLjcyIDAgMCAxIDIuODYtLjM4QTMuNzggMy43OCAwIDEgMSAuNTEgMTYuN3ptNC44NS0yLjgxQTEuNzkgMS43OSAwIDAgMCA0LjI1IDEzYTEuODMgMS44MyAwIDAgMC0yLjA2IDIuNjloMGMuMzI5LjU2Ni45MzQuOTE0IDEuNTg5LjkxM2ExLjgzIDEuODMgMCAwIDAgMS41ODUtLjkyYy4zMjYtLjU2OC4zMjQtMS4yNjctLjAwNC0xLjgzM3ptNi45NyAyLjQ3aDBhMy43OSAzLjc5IDAgMCAxIDAtMy43NyAzLjc5IDMuNzkgMCAwIDEgNS4xNi0xLjM5IDMuNzggMy43OCAwIDAgMS0xLjg5IDcuMDQ0IDMuNzggMy43OCAwIDAgMS0zLjI3LTEuODg0em00Ljg2LTIuODFhMiAyIDAgMCAwLS42Ny0uNjcgMS44NSAxLjg1IDAgMCAwLTIuNTEuNjggMS44NiAxLjg2IDAgMCAwIDAgMS44MyAxLjgzIDEuODMgMCAwIDAgMi4wNy44NSAxLjgyIDEuODIgMCAwIDAgMS4xMS0uODUgMS44OCAxLjg4IDAgMCAwIDAtMS44NHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIHN0MyIgZD0iTTcuNDkgMTQuMTVsLTIuOCAyLjI1IDIuODYtMS42NWE0LjA3IDQuMDcgMCAwIDAtLjA2LS42ek04LjE1IDhsLS41OS0zLjZ2My4yOWEzLjQ3IDMuNDcgMCAwIDAgLjU5LjI3em01LjE1IDMuNDdsMy4yMiAxLjQxLTIuODYtMS42NGExLjY5IDEuNjkgMCAwIDAtLjM2LjIzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataproc');
			})
		);

		fns.push(
			this.addEntry(dt + 'genomics', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Genomics', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4LjYwMDAwMDM4MTQ2OTcyNyIgdmlld0JveD0iMCAwIDIwIDE4LjYwMDAwMDM4MTQ2OTcyNyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbC1ydWxlOmV2ZW5vZGR9JiN4YTsJLnN0M3tmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGNpcmNsZSBjeD0iMTAiIGN5PSI5LjMiIHI9IjEuNiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xMi42OSA1LjhsLS43NC0uN0g1LjU4djEuNGg2LjM3eiIgY2xhc3M9InN0MSBzdDIiLz4mI3hhOwk8Y2lyY2xlIGN4PSI0LjgiIGN5PSI1LjgiIHI9IjEuMjMiIGNsYXNzPSJzdDMiLz4mI3hhOwk8Y2lyY2xlIGN4PSIxNS4yIiBjeT0iNS44IiByPSIxLjYiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMTQuMzggMTMuNXYtMS40SDguMWwtLjc0LjcuNzQuN3oiIGNsYXNzPSJzdDEgc3QyIi8+JiN4YTsJPGNpcmNsZSBjeD0iNC44IiBjeT0iMTIuOCIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTUuMiIgY3k9IjEyLjgiIHI9IjEuMjMiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMTUuNiAxLjZsLS43NC0uN0gyLjE4djEuNGgxMi42OHoiIGNsYXNzPSJzdDEgc3QyIi8+JiN4YTsJPGNpcmNsZSBjeD0iMS42IiBjeT0iMS42IiByPSIxLjIzIiBjbGFzcz0ic3QzIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTguNCIgY3k9IjEuNiIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPHBhdGggZD0iTTE3Ljg0IDE3Ljd2LTEuNEg1LjE0bC0uNzQuNy43NC43eiIgY2xhc3M9InN0MSBzdDIiLz4mI3hhOwk8Y2lyY2xlIGN4PSIxLjYiIGN5PSIxNyIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTguNCIgY3k9IjE3IiByPSIxLjIzIiBjbGFzcz0ic3QzIi8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Genomics');
			})
		);

		fns.push(
			this.addEntry(dt + 'genomics', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Genomics', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4LjYwMDAwMDM4MTQ2OTcyNyIgdmlld0JveD0iMCAwIDIwIDE4LjYwMDAwMDM4MTQ2OTcyNyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbC1ydWxlOmV2ZW5vZGR9JiN4YTsJLnN0M3tmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGNpcmNsZSBjeD0iMTAiIGN5PSI5LjMiIHI9IjEuNiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xMi42OSA1LjhsLS43NC0uN0g1LjU4djEuNGg2LjM3eiIgY2xhc3M9InN0MSBzdDIiLz4mI3hhOwk8Y2lyY2xlIGN4PSI0LjgiIGN5PSI1LjgiIHI9IjEuMjMiIGNsYXNzPSJzdDMiLz4mI3hhOwk8Y2lyY2xlIGN4PSIxNS4yIiBjeT0iNS44IiByPSIxLjYiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMTQuMzggMTMuNXYtMS40SDguMWwtLjc0LjcuNzQuN3oiIGNsYXNzPSJzdDEgc3QyIi8+JiN4YTsJPGNpcmNsZSBjeD0iNC44IiBjeT0iMTIuOCIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTUuMiIgY3k9IjEyLjgiIHI9IjEuMjMiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMTUuNiAxLjZsLS43NC0uN0gyLjE4djEuNGgxMi42OHoiIGNsYXNzPSJzdDEgc3QyIi8+JiN4YTsJPGNpcmNsZSBjeD0iMS42IiBjeT0iMS42IiByPSIxLjIzIiBjbGFzcz0ic3QzIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTguNCIgY3k9IjEuNiIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPHBhdGggZD0iTTE3Ljg0IDE3Ljd2LTEuNEg1LjE0bC0uNzQuNy43NC43eiIgY2xhc3M9InN0MSBzdDIiLz4mI3hhOwk8Y2lyY2xlIGN4PSIxLjYiIGN5PSIxNyIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTguNCIgY3k9IjE3IiByPSIxLjIzIiBjbGFzcz0ic3QzIi8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Genomics');
			})
		);

		fns.push(
			this.addEntry(dt + 'genomics', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Genomics', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4LjYwMDAwMDM4MTQ2OTcyNyIgdmlld0JveD0iMCAwIDIwIDE4LjYwMDAwMDM4MTQ2OTcyNyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbC1ydWxlOmV2ZW5vZGR9JiN4YTsJLnN0M3tmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGNpcmNsZSBjeD0iMTAiIGN5PSI5LjMiIHI9IjEuNiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xMi42OSA1LjhsLS43NC0uN0g1LjU4djEuNGg2LjM3eiIgY2xhc3M9InN0MSBzdDIiLz4mI3hhOwk8Y2lyY2xlIGN4PSI0LjgiIGN5PSI1LjgiIHI9IjEuMjMiIGNsYXNzPSJzdDMiLz4mI3hhOwk8Y2lyY2xlIGN4PSIxNS4yIiBjeT0iNS44IiByPSIxLjYiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMTQuMzggMTMuNXYtMS40SDguMWwtLjc0LjcuNzQuN3oiIGNsYXNzPSJzdDEgc3QyIi8+JiN4YTsJPGNpcmNsZSBjeD0iNC44IiBjeT0iMTIuOCIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTUuMiIgY3k9IjEyLjgiIHI9IjEuMjMiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMTUuNiAxLjZsLS43NC0uN0gyLjE4djEuNGgxMi42OHoiIGNsYXNzPSJzdDEgc3QyIi8+JiN4YTsJPGNpcmNsZSBjeD0iMS42IiBjeT0iMS42IiByPSIxLjIzIiBjbGFzcz0ic3QzIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTguNCIgY3k9IjEuNiIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPHBhdGggZD0iTTE3Ljg0IDE3Ljd2LTEuNEg1LjE0bC0uNzQuNy43NC43eiIgY2xhc3M9InN0MSBzdDIiLz4mI3hhOwk8Y2lyY2xlIGN4PSIxLjYiIGN5PSIxNyIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTguNCIgY3k9IjE3IiByPSIxLjIzIiBjbGFzcz0ic3QzIi8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Genomics');
			})
		);

		fns.push(
			this.addEntry(dt + 'dataprep', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Dataprep', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjI3OTk5ODc3OTI5Njg3NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMS4yNDYyOTA4MDM4OTEyNzAxZS04IDAgMTguMjc5OTk4Nzc5Mjk2ODc1IDIwIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qye2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTcuNjMgOWEuOTEuOTEgMCAxIDEtLjY0My4yNjdBLjkxLjkxIDAgMCAxIDcuNjMgOXptMC0uOGExLjcxIDEuNzEgMCAxIDAgMS43IDEuNzEgMS43IDEuNyAwIDAgMC0xLjctMS43MXpNMS43MiA5YS45MS45MSAwIDEgMS0uNjQzLjI2N0EuOTEuOTEgMCAwIDEgMS43MiA5em0wLS44YTEuNzEgMS43MSAwIDEgMCAxLjcgMS43MSAxLjcgMS43IDAgMCAwLTEuNy0xLjcxem0zLjA0IDYuMTFhLjkxLjkxIDAgMSAxIDAgMS44Mi45MS45MSAwIDEgMSAwLTEuODJ6bTAtLjc5YTEuNzEgMS43MSAwIDEgMCAxLjIuNSAxLjcgMS43IDAgMCAwLTEuMi0uNXptMC05LjczYS45MS45MSAwIDAgMS0uMDQgMS44MTkuOTEuOTEgMCAwIDEtLjktLjkwOS45Mi45MiAwIDAgMSAuOTQtLjkxem0wLS44YTEuNzEgMS43MSAwIDEgMCAxLjIuNUExLjcgMS43IDAgMCAwIDQuNzYgM3oiLz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPHBhdGggZD0iTTcuODEgMGgxLjY4djIwSDcuODF6Ii8+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMy40IDIuODdIOC44OWEuMzcuMzcgMCAwIDAtLjMuNHYyLjgyYS4zNi4zNiAwIDAgMCAuMy4zOWg0LjUxYS4zNi4zNiAwIDAgMCAuMzEtLjM5VjMuMjhhLjM3LjM3IDAgMCAwLS4zMS0uNDF6bTQuMzIgNS4yOUg5LjRjLS4zMSAwLS41Ni4xOC0uNTYuMzl2Mi44MmMwIC4yMi4yNS40LjU2LjRoOC4zMmMuMzEgMCAuNTYtLjE5LjU2LS40VjguNTVjMC0uMjItLjI1LS4zOS0uNTYtLjM5em0tNS45MSA1LjI4SDguMjhjLS4xMyAwLS4yMy4xOC0uMjMuMzl2Mi44MmMwIC4yMi4xLjM5LjIzLjM5aDMuNTNjLjEzIDAgLjI0LS4xOC4yNC0uMzl2LTIuODJjLS4wMS0uMjItLjExLS4zOS0uMjQtLjM5eiIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataprep');
			})
		);

		fns.push(
			this.addEntry(dt + 'dataprep', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Dataprep', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjI3OTk5ODc3OTI5Njg3NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMS4yNDYyOTA4MDM4OTEyNzAxZS04IDAgMTguMjc5OTk4Nzc5Mjk2ODc1IDIwIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qye2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTcuNjMgOWEuOTEuOTEgMCAxIDEtLjY0My4yNjdBLjkxLjkxIDAgMCAxIDcuNjMgOXptMC0uOGExLjcxIDEuNzEgMCAxIDAgMS43IDEuNzEgMS43IDEuNyAwIDAgMC0xLjctMS43MXpNMS43MiA5YS45MS45MSAwIDEgMS0uNjQzLjI2N0EuOTEuOTEgMCAwIDEgMS43MiA5em0wLS44YTEuNzEgMS43MSAwIDEgMCAxLjcgMS43MSAxLjcgMS43IDAgMCAwLTEuNy0xLjcxem0zLjA0IDYuMTFhLjkxLjkxIDAgMSAxIDAgMS44Mi45MS45MSAwIDEgMSAwLTEuODJ6bTAtLjc5YTEuNzEgMS43MSAwIDEgMCAxLjIuNSAxLjcgMS43IDAgMCAwLTEuMi0uNXptMC05LjczYS45MS45MSAwIDAgMS0uMDQgMS44MTkuOTEuOTEgMCAwIDEtLjktLjkwOS45Mi45MiAwIDAgMSAuOTQtLjkxem0wLS44YTEuNzEgMS43MSAwIDEgMCAxLjIuNUExLjcgMS43IDAgMCAwIDQuNzYgM3oiLz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPHBhdGggZD0iTTcuODEgMGgxLjY4djIwSDcuODF6Ii8+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMy40IDIuODdIOC44OWEuMzcuMzcgMCAwIDAtLjMuNHYyLjgyYS4zNi4zNiAwIDAgMCAuMy4zOWg0LjUxYS4zNi4zNiAwIDAgMCAuMzEtLjM5VjMuMjhhLjM3LjM3IDAgMCAwLS4zMS0uNDF6bTQuMzIgNS4yOUg5LjRjLS4zMSAwLS41Ni4xOC0uNTYuMzl2Mi44MmMwIC4yMi4yNS40LjU2LjRoOC4zMmMuMzEgMCAuNTYtLjE5LjU2LS40VjguNTVjMC0uMjItLjI1LS4zOS0uNTYtLjM5em0tNS45MSA1LjI4SDguMjhjLS4xMyAwLS4yMy4xOC0uMjMuMzl2Mi44MmMwIC4yMi4xLjM5LjIzLjM5aDMuNTNjLjEzIDAgLjI0LS4xOC4yNC0uMzl2LTIuODJjLS4wMS0uMjItLjExLS4zOS0uMjQtLjM5eiIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataprep');
			})
		);

		fns.push(
			this.addEntry(dt + 'dataprep', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Dataprep', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjI3OTk5ODc3OTI5Njg3NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMS4yNDYyOTA4MDM4OTEyNzAxZS04IDAgMTguMjc5OTk4Nzc5Mjk2ODc1IDIwIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qye2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTcuNjMgOWEuOTEuOTEgMCAxIDEtLjY0My4yNjdBLjkxLjkxIDAgMCAxIDcuNjMgOXptMC0uOGExLjcxIDEuNzEgMCAxIDAgMS43IDEuNzEgMS43IDEuNyAwIDAgMC0xLjctMS43MXpNMS43MiA5YS45MS45MSAwIDEgMS0uNjQzLjI2N0EuOTEuOTEgMCAwIDEgMS43MiA5em0wLS44YTEuNzEgMS43MSAwIDEgMCAxLjcgMS43MSAxLjcgMS43IDAgMCAwLTEuNy0xLjcxem0zLjA0IDYuMTFhLjkxLjkxIDAgMSAxIDAgMS44Mi45MS45MSAwIDEgMSAwLTEuODJ6bTAtLjc5YTEuNzEgMS43MSAwIDEgMCAxLjIuNSAxLjcgMS43IDAgMCAwLTEuMi0uNXptMC05LjczYS45MS45MSAwIDAgMS0uMDQgMS44MTkuOTEuOTEgMCAwIDEtLjktLjkwOS45Mi45MiAwIDAgMSAuOTQtLjkxem0wLS44YTEuNzEgMS43MSAwIDEgMCAxLjIuNUExLjcgMS43IDAgMCAwIDQuNzYgM3oiLz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPHBhdGggZD0iTTcuODEgMGgxLjY4djIwSDcuODF6Ii8+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMy40IDIuODdIOC44OWEuMzcuMzcgMCAwIDAtLjMuNHYyLjgyYS4zNi4zNiAwIDAgMCAuMy4zOWg0LjUxYS4zNi4zNiAwIDAgMCAuMzEtLjM5VjMuMjhhLjM3LjM3IDAgMCAwLS4zMS0uNDF6bTQuMzIgNS4yOUg5LjRjLS4zMSAwLS41Ni4xOC0uNTYuMzl2Mi44MmMwIC4yMi4yNS40LjU2LjRoOC4zMmMuMzEgMCAuNTYtLjE5LjU2LS40VjguNTVjMC0uMjItLjI1LS4zOS0uNTYtLjM5em0tNS45MSA1LjI4SDguMjhjLS4xMyAwLS4yMy4xOC0uMjMuMzl2Mi44MmMwIC4yMi4xLjM5LjIzLjM5aDMuNTNjLjEzIDAgLjI0LS4xOC4yNC0uMzl2LTIuODJjLS4wMS0uMjItLjExLS4zOS0uMjQtLjM5eiIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataprep');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud composer', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nComposer', 
			    		new mxGeometry(0, 0, 22, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY0MDAwMDM0MzMyMjc1NCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjY0MDAwMDM0MzMyMjc1NCAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAgMGgxNC42M3YzLjk0aC01LjN2NS4zM0g1LjM1VjMuOTZIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy45NSAxMC42N2g1LjM0VjIwSDUuMzV2LTUuMzVIMFY1LjM3aDMuOTV6TTE0LjY0IDIwSDEwLjdWNS4zNmgzLjk0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDE2LjA2aDMuOTJWMjBIMHoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(19, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Composer');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud composer', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Composer', 
			    		new mxGeometry(0, 0, 22, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY0MDAwMDM0MzMyMjc1NCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjY0MDAwMDM0MzMyMjc1NCAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAgMGgxNC42M3YzLjk0aC01LjN2NS4zM0g1LjM1VjMuOTZIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy45NSAxMC42N2g1LjM0VjIwSDUuMzV2LTUuMzVIMFY1LjM3aDMuOTV6TTE0LjY0IDIwSDEwLjdWNS4zNmgzLjk0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDE2LjA2aDMuOTJWMjBIMHoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(19, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Composer');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud composer', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 168, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Composer', 
			    		new mxGeometry(0, 0, 22, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY0MDAwMDM0MzMyMjc1NCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjY0MDAwMDM0MzMyMjc1NCAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAgMGgxNC42M3YzLjk0aC01LjN2NS4zM0g1LjM1VjMuOTZIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy45NSAxMC42N2g1LjM0VjIwSDUuMzV2LTUuMzVIMFY1LjM3aDMuOTV6TTE0LjY0IDIwSDEwLjdWNS4zNmgzLjk0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDE2LjA2aDMuOTJWMjBIMHoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(19, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Composer');
			})
		);

		fns.push(
			this.addEntry(dt + 'data catalog', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Data Catalog', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ni4yNzQ4ODc3NTcyNjMyIiBoZWlnaHQ9IjMzOS42NzM1NDQyMTc3NjM4MyIgdmlld0JveD0iMC4xMTQwMDAwMDAwNTk2MDQ2NCAtMC4wOTAwMDAwMDM1NzYyNzg2OSA5OS41NTU5OTk3NTU4NTkzOCA4OS44NzE5OTQwMTg1NTQ2OSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03Ny41MjMgNDMuMzk3bDEyLjg0NCA3LjU3MnYxNC43NjdsLTEyLjg0NCA2LjY4ek01MC4zMTItLjA5bDEyLjg0NCA3LjU3MnYxNC43NjdsLTEyLjg0NCA2LjY4ek0yMy4xIDQzLjM5N2wxMi44NDQgNy41NzJ2MTQuNzY3TDIzLjEgNzIuNDE3em02OS40Ny0uNTExbDcuMS0xMS4xNjktMTIuNjY2LTIxLjU5NEg3MC42NDR2OS41aDEwLjkxOWw2Ljk3NyAxMS44OTUtNC4yNTYgNi42OTR6bS03Ni45NzktNC42TDExLjMgMzEuNDg1bDcuMjY0LTExLjg2MWg5Ljk3OWwuMDk5LTkuNUgxMy4yNDFMLjExNCAzMS41NjFsMS41NzYgMi40OTggNS41MTUgOC43Mzl6bTEzLjY2MiAzOS40NDlsNy42MDMgMTIuMDQ3aDI1LjkwMmw3LjczMy0xMi4xNjQtOC4xNDMtNC44OTktNC44MDggNy41NjRINDIuMDk1bC00Ljc0LTcuNTExeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03Ny41MjMgNDMuMzk3bC0xMi44NDQgNy41NzJ2MTQuNzY3bDEyLjg0NCA2LjY4ek01MC4zMTItLjA5TDM3LjQ2OCA3LjQ4MnYxNC43NjdsMTIuODQ0IDYuNjh6TTIzLjEgNDMuMzk3bC0xMi44NDQgNy41NzJ2MTQuNzY3bDEyLjg0NCA2LjY4eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Data Catalog');
			})
		);

		fns.push(
			this.addEntry(dt + 'data catalog', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Data Catalog', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ni4yNzQ4ODc3NTcyNjMyIiBoZWlnaHQ9IjMzOS42NzM1NDQyMTc3NjM4MyIgdmlld0JveD0iMC4xMTQwMDAwMDAwNTk2MDQ2NCAtMC4wOTAwMDAwMDM1NzYyNzg2OSA5OS41NTU5OTk3NTU4NTkzOCA4OS44NzE5OTQwMTg1NTQ2OSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03Ny41MjMgNDMuMzk3bDEyLjg0NCA3LjU3MnYxNC43NjdsLTEyLjg0NCA2LjY4ek01MC4zMTItLjA5bDEyLjg0NCA3LjU3MnYxNC43NjdsLTEyLjg0NCA2LjY4ek0yMy4xIDQzLjM5N2wxMi44NDQgNy41NzJ2MTQuNzY3TDIzLjEgNzIuNDE3em02OS40Ny0uNTExbDcuMS0xMS4xNjktMTIuNjY2LTIxLjU5NEg3MC42NDR2OS41aDEwLjkxOWw2Ljk3NyAxMS44OTUtNC4yNTYgNi42OTR6bS03Ni45NzktNC42TDExLjMgMzEuNDg1bDcuMjY0LTExLjg2MWg5Ljk3OWwuMDk5LTkuNUgxMy4yNDFMLjExNCAzMS41NjFsMS41NzYgMi40OTggNS41MTUgOC43Mzl6bTEzLjY2MiAzOS40NDlsNy42MDMgMTIuMDQ3aDI1LjkwMmw3LjczMy0xMi4xNjQtOC4xNDMtNC44OTktNC44MDggNy41NjRINDIuMDk1bC00Ljc0LTcuNTExeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03Ny41MjMgNDMuMzk3bC0xMi44NDQgNy41NzJ2MTQuNzY3bDEyLjg0NCA2LjY4ek01MC4zMTItLjA5TDM3LjQ2OCA3LjQ4MnYxNC43NjdsMTIuODQ0IDYuNjh6TTIzLjEgNDMuMzk3bC0xMi44NDQgNy41NzJ2MTQuNzY3bDEyLjg0NCA2LjY4eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Data Catalog');
			})
		);

		fns.push(
			this.addEntry(dt + 'data catalog', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Data Catalog', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ni4yNzQ4ODc3NTcyNjMyIiBoZWlnaHQ9IjMzOS42NzM1NDQyMTc3NjM4MyIgdmlld0JveD0iMC4xMTQwMDAwMDAwNTk2MDQ2NCAtMC4wOTAwMDAwMDM1NzYyNzg2OSA5OS41NTU5OTk3NTU4NTkzOCA4OS44NzE5OTQwMTg1NTQ2OSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03Ny41MjMgNDMuMzk3bDEyLjg0NCA3LjU3MnYxNC43NjdsLTEyLjg0NCA2LjY4ek01MC4zMTItLjA5bDEyLjg0NCA3LjU3MnYxNC43NjdsLTEyLjg0NCA2LjY4ek0yMy4xIDQzLjM5N2wxMi44NDQgNy41NzJ2MTQuNzY3TDIzLjEgNzIuNDE3em02OS40Ny0uNTExbDcuMS0xMS4xNjktMTIuNjY2LTIxLjU5NEg3MC42NDR2OS41aDEwLjkxOWw2Ljk3NyAxMS44OTUtNC4yNTYgNi42OTR6bS03Ni45NzktNC42TDExLjMgMzEuNDg1bDcuMjY0LTExLjg2MWg5Ljk3OWwuMDk5LTkuNUgxMy4yNDFMLjExNCAzMS41NjFsMS41NzYgMi40OTggNS41MTUgOC43Mzl6bTEzLjY2MiAzOS40NDlsNy42MDMgMTIuMDQ3aDI1LjkwMmw3LjczMy0xMi4xNjQtOC4xNDMtNC44OTktNC44MDggNy41NjRINDIuMDk1bC00Ljc0LTcuNTExeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03Ny41MjMgNDMuMzk3bC0xMi44NDQgNy41NzJ2MTQuNzY3bDEyLjg0NCA2LjY4ek01MC4zMTItLjA5TDM3LjQ2OCA3LjQ4MnYxNC43NjdsMTIuODQ0IDYuNjh6TTIzLjEgNDMuMzk3bC0xMi44NDQgNy41NzJ2MTQuNzY3bDEyLjg0NCA2LjY4eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Data Catalog');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud data fusion', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nData Fusion', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ny4wNDk2OTgzMjc3ODkyNiIgaGVpZ2h0PSIzNzcuMjkxNTcwNzE1Nzg5NzYiIHZpZXdCb3g9IjAuMTMxMDAwNTE4Nzk4ODI4MTIgLTAuMTIxMDAwMDA2Nzk0OTI5NSA5OS43NjEwMDE1ODY5MTQwNiA5OS44MjQ5OTY5NDgyNDIxOSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qxe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNODAuNTkzIDE5LjE4djIwLjE5OWgxOS4yOTlWOS41M2MwLTIuNTM3LS45NzktNC44NDYtMi41OC02LjU2OHptLTkuOTA4IDYxLjIyNUgxOS40MzFMMy40NSA5Ny4zMzdjMS42OTUgMS40NzQgMy45MDggMi4zNjcgNi4zMzEgMi4zNjdoNzAuNTU1YzIuODczIDAgNS40NTMtMS4yNTYgNy4yMjEtMy4yNDh6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTg3LjU3MyA5Ni40MzdjMS41MDEtMS43MDEgMi40MTMtMy45MzUgMi40MTMtNi4zODJWNjAuMjA0SDcwLjY4NXYyMC4yMDF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE5LjQzMSA4MC40MDVWMjkuMzRoMjAuNTc4VjEwLjA0SDkuNzgxYy01LjMzIDAtOS42NSA0LjMyMS05LjY1IDkuNjV2NzAuMzY1Yy4wMDEgMi45MDYgMS4yODYgNS41MTMgMy4zMiA3LjI4MXptNzcuODgtNzcuNDQzQzk1LjU1IDEuMDY2IDkzLjAzNi0uMTIgOTAuMjQ0LS4xMjFINTkuOTUxVjE5LjE4aDIwLjY0M3oiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Data Fusion');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud data fusion', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Data Fusion', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ny4wNDk2OTgzMjc3ODkyNiIgaGVpZ2h0PSIzNzcuMjkxNTcwNzE1Nzg5NzYiIHZpZXdCb3g9IjAuMTMxMDAwNTE4Nzk4ODI4MTIgLTAuMTIxMDAwMDA2Nzk0OTI5NSA5OS43NjEwMDE1ODY5MTQwNiA5OS44MjQ5OTY5NDgyNDIxOSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qxe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNODAuNTkzIDE5LjE4djIwLjE5OWgxOS4yOTlWOS41M2MwLTIuNTM3LS45NzktNC44NDYtMi41OC02LjU2OHptLTkuOTA4IDYxLjIyNUgxOS40MzFMMy40NSA5Ny4zMzdjMS42OTUgMS40NzQgMy45MDggMi4zNjcgNi4zMzEgMi4zNjdoNzAuNTU1YzIuODczIDAgNS40NTMtMS4yNTYgNy4yMjEtMy4yNDh6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTg3LjU3MyA5Ni40MzdjMS41MDEtMS43MDEgMi40MTMtMy45MzUgMi40MTMtNi4zODJWNjAuMjA0SDcwLjY4NXYyMC4yMDF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE5LjQzMSA4MC40MDVWMjkuMzRoMjAuNTc4VjEwLjA0SDkuNzgxYy01LjMzIDAtOS42NSA0LjMyMS05LjY1IDkuNjV2NzAuMzY1Yy4wMDEgMi45MDYgMS4yODYgNS41MTMgMy4zMiA3LjI4MXptNzcuODgtNzcuNDQzQzk1LjU1IDEuMDY2IDkzLjAzNi0uMTIgOTAuMjQ0LS4xMjFINTkuOTUxVjE5LjE4aDIwLjY0M3oiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Data Fusion');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud data fusion', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 178, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Data Fusion', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ny4wNDk2OTgzMjc3ODkyNiIgaGVpZ2h0PSIzNzcuMjkxNTcwNzE1Nzg5NzYiIHZpZXdCb3g9IjAuMTMxMDAwNTE4Nzk4ODI4MTIgLTAuMTIxMDAwMDA2Nzk0OTI5NSA5OS43NjEwMDE1ODY5MTQwNiA5OS44MjQ5OTY5NDgyNDIxOSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qxe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNODAuNTkzIDE5LjE4djIwLjE5OWgxOS4yOTlWOS41M2MwLTIuNTM3LS45NzktNC44NDYtMi41OC02LjU2OHptLTkuOTA4IDYxLjIyNUgxOS40MzFMMy40NSA5Ny4zMzdjMS42OTUgMS40NzQgMy45MDggMi4zNjcgNi4zMzEgMi4zNjdoNzAuNTU1YzIuODczIDAgNS40NTMtMS4yNTYgNy4yMjEtMy4yNDh6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTg3LjU3MyA5Ni40MzdjMS41MDEtMS43MDEgMi40MTMtMy45MzUgMi40MTMtNi4zODJWNjAuMjA0SDcwLjY4NXYyMC4yMDF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE5LjQzMSA4MC40MDVWMjkuMzRoMjAuNTc4VjEwLjA0SDkuNzgxYy01LjMzIDAtOS42NSA0LjMyMS05LjY1IDkuNjV2NzAuMzY1Yy4wMDEgMi45MDYgMS4yODYgNS41MTMgMy4zMiA3LjI4MXptNzcuODgtNzcuNDQzQzk1LjU1IDEuMDY2IDkzLjAzNi0uMTIgOTAuMjQ0LS4xMjFINTkuOTUxVjE5LjE4aDIwLjY0M3oiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Data Fusion');
			})
		);

		this.addPalette('gcp2Data Analytics', 'GCP / Data Analytics', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2DataTransferPalette = function()
	{
		var dt = 'gcp google cloud platform data transfer ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'transfer appliance', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Transfer\nAppliance', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjkzMzEzNDA3ODk3OTQ5MiIgaGVpZ2h0PSIxMC44NjAwMDA2MTAzNTE1NjIiIHZpZXdCb3g9IjAuMDAwMDI2NTAxNDY0MTYyNzIwMzY3IC0zLjgxMjY2MDA1NDMzNjQ0NzVlLTggMTkuOTMzMTM0MDc4OTc5NDkyIDEwLjg2MDAwMDYxMDM1MTU2MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOS41NjMgMEg3LjE5M2EuMzIuMzIgMCAwIDAtLjMyLjMzdjIuMTZhLjMyLjMyIDAgMCAwIC4zMi4zMmgxMi4zN2EuMzIuMzIgMCAwIDAgLjM3LS4zMlYuMzNhLjMyLjMyIDAgMCAwLS4zMS0uMzN6TTguNDIzIDIuMTRhLjcuNyAwIDEgMSAuNy0uN2gwYS43LjcgMCAwIDEtLjcuN3ptMTEuMTQgMS45SDcuMTkzYS4zMi4zMiAwIDAgMC0uMzIuMzJ2Mi4xNWEuMzIuMzIgMCAwIDAgLjMyLjMyaDEyLjM3YS4zMi4zMiAwIDAgMCAuMzItLjMyVjQuMzZhLjMyLjMyIDAgMCAwLS4zMi0uMzJ6TTguNDIzIDYuMThhLjcuNyAwIDEgMSAuNy0uN2gwYS43LjcgMCAwIDEtLjcuN3ptMTEuMTkgMS44N0g3LjI1M2EuMzIuMzIgMCAwIDAtLjMyLjMydjIuMTZhLjMyLjMyIDAgMCAwIC4zMi4zM2gxMi4zNmEuMzIuMzIgMCAwIDAgLjMyLS4zM1Y4LjM3YS4zMi4zMiAwIDAgMC0uMzItLjMyem0tMTEuMTQgMi4xM2EuNzEuNzEgMCAwIDEtLjctLjcxLjcxLjcxIDAgMCAxIDEuNDEgMCAuNzEuNzEgMCAwIDEtLjcxLjcxeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY3MyAzLjI5aC0yLjEzYS44MTIuODEyIDAgMCAxLS4yMS0xLjYxaDIuMzRhLjgxNS44MTUgMCAxIDEgLjI2IDEuNjF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTQuNjczIDYuMjRILjg1M2EuODIuODIgMCAwIDEtLjIxLTEuNjJoNGEuODIzLjgyMyAwIDAgMSAuMjkgMS42MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNC42NzMgOS4xOGgtMi4xM2EuODEyLjgxMiAwIDAgMS0uMjEtMS42MWgyLjM0YS44MTUuODE1IDAgMCAxIC4yNiAxLjYxeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Transfer Appliance');
			})
		);

		fns.push(
			this.addEntry(dt + 'transfer appliance', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 180, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Transfer Appliance', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjkzMzEzNDA3ODk3OTQ5MiIgaGVpZ2h0PSIxMC44NjAwMDA2MTAzNTE1NjIiIHZpZXdCb3g9IjAuMDAwMDI2NTAxNDY0MTYyNzIwMzY3IC0zLjgxMjY2MDA1NDMzNjQ0NzVlLTggMTkuOTMzMTM0MDc4OTc5NDkyIDEwLjg2MDAwMDYxMDM1MTU2MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOS41NjMgMEg3LjE5M2EuMzIuMzIgMCAwIDAtLjMyLjMzdjIuMTZhLjMyLjMyIDAgMCAwIC4zMi4zMmgxMi4zN2EuMzIuMzIgMCAwIDAgLjM3LS4zMlYuMzNhLjMyLjMyIDAgMCAwLS4zMS0uMzN6TTguNDIzIDIuMTRhLjcuNyAwIDEgMSAuNy0uN2gwYS43LjcgMCAwIDEtLjcuN3ptMTEuMTQgMS45SDcuMTkzYS4zMi4zMiAwIDAgMC0uMzIuMzJ2Mi4xNWEuMzIuMzIgMCAwIDAgLjMyLjMyaDEyLjM3YS4zMi4zMiAwIDAgMCAuMzItLjMyVjQuMzZhLjMyLjMyIDAgMCAwLS4zMi0uMzJ6TTguNDIzIDYuMThhLjcuNyAwIDEgMSAuNy0uN2gwYS43LjcgMCAwIDEtLjcuN3ptMTEuMTkgMS44N0g3LjI1M2EuMzIuMzIgMCAwIDAtLjMyLjMydjIuMTZhLjMyLjMyIDAgMCAwIC4zMi4zM2gxMi4zNmEuMzIuMzIgMCAwIDAgLjMyLS4zM1Y4LjM3YS4zMi4zMiAwIDAgMC0uMzItLjMyem0tMTEuMTQgMi4xM2EuNzEuNzEgMCAwIDEtLjctLjcxLjcxLjcxIDAgMCAxIDEuNDEgMCAuNzEuNzEgMCAwIDEtLjcxLjcxeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY3MyAzLjI5aC0yLjEzYS44MTIuODEyIDAgMCAxLS4yMS0xLjYxaDIuMzRhLjgxNS44MTUgMCAxIDEgLjI2IDEuNjF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTQuNjczIDYuMjRILjg1M2EuODIuODIgMCAwIDEtLjIxLTEuNjJoNGEuODIzLjgyMyAwIDAgMSAuMjkgMS42MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNC42NzMgOS4xOGgtMi4xM2EuODEyLjgxMiAwIDAgMS0uMjEtMS42MWgyLjM0YS44MTUuODE1IDAgMCAxIC4yNiAxLjYxeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Transfer Appliance');
			})
		);

		fns.push(
			this.addEntry(dt + 'transfer appliance', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 188, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Transfer Appliance', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjkzMzEzNDA3ODk3OTQ5MiIgaGVpZ2h0PSIxMC44NjAwMDA2MTAzNTE1NjIiIHZpZXdCb3g9IjAuMDAwMDI2NTAxNDY0MTYyNzIwMzY3IC0zLjgxMjY2MDA1NDMzNjQ0NzVlLTggMTkuOTMzMTM0MDc4OTc5NDkyIDEwLjg2MDAwMDYxMDM1MTU2MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOS41NjMgMEg3LjE5M2EuMzIuMzIgMCAwIDAtLjMyLjMzdjIuMTZhLjMyLjMyIDAgMCAwIC4zMi4zMmgxMi4zN2EuMzIuMzIgMCAwIDAgLjM3LS4zMlYuMzNhLjMyLjMyIDAgMCAwLS4zMS0uMzN6TTguNDIzIDIuMTRhLjcuNyAwIDEgMSAuNy0uN2gwYS43LjcgMCAwIDEtLjcuN3ptMTEuMTQgMS45SDcuMTkzYS4zMi4zMiAwIDAgMC0uMzIuMzJ2Mi4xNWEuMzIuMzIgMCAwIDAgLjMyLjMyaDEyLjM3YS4zMi4zMiAwIDAgMCAuMzItLjMyVjQuMzZhLjMyLjMyIDAgMCAwLS4zMi0uMzJ6TTguNDIzIDYuMThhLjcuNyAwIDEgMSAuNy0uN2gwYS43LjcgMCAwIDEtLjcuN3ptMTEuMTkgMS44N0g3LjI1M2EuMzIuMzIgMCAwIDAtLjMyLjMydjIuMTZhLjMyLjMyIDAgMCAwIC4zMi4zM2gxMi4zNmEuMzIuMzIgMCAwIDAgLjMyLS4zM1Y4LjM3YS4zMi4zMiAwIDAgMC0uMzItLjMyem0tMTEuMTQgMi4xM2EuNzEuNzEgMCAwIDEtLjctLjcxLjcxLjcxIDAgMCAxIDEuNDEgMCAuNzEuNzEgMCAwIDEtLjcxLjcxeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY3MyAzLjI5aC0yLjEzYS44MTIuODEyIDAgMCAxLS4yMS0xLjYxaDIuMzRhLjgxNS44MTUgMCAxIDEgLjI2IDEuNjF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTQuNjczIDYuMjRILjg1M2EuODIuODIgMCAwIDEtLjIxLTEuNjJoNGEuODIzLjgyMyAwIDAgMSAuMjkgMS42MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNC42NzMgOS4xOGgtMi4xM2EuODEyLjgxMiAwIDAgMS0uMjEtMS42MWgyLjM0YS44MTUuODE1IDAgMCAxIC4yNiAxLjYxeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Transfer Appliance');
			})
		);

		this.addPalette('gcp2Data Transfer', 'GCP / Data Transfer', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2CloudAIPalette = function()
	{
		var dt = 'gcp google cloud platform ai artificial intelligence ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'cloud machine learning', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Machine\nLearning', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE3LjUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDIwIDE3LjUiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOC45MSAxMC42M0wyMCA4Ljc1IDE3LjgyIDVoLTMuMDdsLTEuMDYtMS44NkgxMi41VjEuODhoMS45NGwxLjA2IDEuODdoMS41OUwxNC45IDBoLTQuMjd2NWgxLjczbC43MyAxLjI1aC0yLjQ2djIuNWgyLjI2bDEuMDUtMS44N2gyLjgxbC43MiAxLjI1aC0yLjhMMTMuNjIgMTBoLTIuOTl2NC4zOGgzLjRsLS43MiAxLjI1aC0yLjY4djEuODdoNC4yN2wzLjI4LTUuNjJoLTIuMDlsLS43MyAxLjI1SDEyLjV2LTEuMjVoMi4xNGwuNzQtMS4yNXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMS4wOSAxMC42M0wwIDguNzUgMi4xOCA1aDMuMDdsMS4wNi0xLjg2SDcuNVYxLjg4SDUuNTZMNC41IDMuNzVIMi45MUw1LjEgMGg0LjI4djVINy42NGwtLjczIDEuMjVoMi40N3YyLjVINy4xMUw2LjA2IDYuODhIMy4yNWwtLjcyIDEuMjVoMi44TDYuMzggMTBoM3Y0LjM4SDUuOTdsLjcyIDEuMjVoMi42OXYxLjg3SDUuMWwtMy4yOC01LjYyaDIuMDlsLjczIDEuMjVINy41di0xLjI1SDUuMzZsLS43NC0xLjI1eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Machine Learning');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud machine learning', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 210, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Machine Learning', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE3LjUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDIwIDE3LjUiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOC45MSAxMC42M0wyMCA4Ljc1IDE3LjgyIDVoLTMuMDdsLTEuMDYtMS44NkgxMi41VjEuODhoMS45NGwxLjA2IDEuODdoMS41OUwxNC45IDBoLTQuMjd2NWgxLjczbC43MyAxLjI1aC0yLjQ2djIuNWgyLjI2bDEuMDUtMS44N2gyLjgxbC43MiAxLjI1aC0yLjhMMTMuNjIgMTBoLTIuOTl2NC4zOGgzLjRsLS43MiAxLjI1aC0yLjY4djEuODdoNC4yN2wzLjI4LTUuNjJoLTIuMDlsLS43MyAxLjI1SDEyLjV2LTEuMjVoMi4xNGwuNzQtMS4yNXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMS4wOSAxMC42M0wwIDguNzUgMi4xOCA1aDMuMDdsMS4wNi0xLjg2SDcuNVYxLjg4SDUuNTZMNC41IDMuNzVIMi45MUw1LjEgMGg0LjI4djVINy42NGwtLjczIDEuMjVoMi40N3YyLjVINy4xMUw2LjA2IDYuODhIMy4yNWwtLjcyIDEuMjVoMi44TDYuMzggMTBoM3Y0LjM4SDUuOTdsLjcyIDEuMjVoMi42OXYxLjg3SDUuMWwtMy4yOC01LjYyaDIuMDlsLjczIDEuMjVINy41di0xLjI1SDUuMzZsLS43NC0xLjI1eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Machine Learning');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud machine learning', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 218, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Machine Learning', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE3LjUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDIwIDE3LjUiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOC45MSAxMC42M0wyMCA4Ljc1IDE3LjgyIDVoLTMuMDdsLTEuMDYtMS44NkgxMi41VjEuODhoMS45NGwxLjA2IDEuODdoMS41OUwxNC45IDBoLTQuMjd2NWgxLjczbC43MyAxLjI1aC0yLjQ2djIuNWgyLjI2bDEuMDUtMS44N2gyLjgxbC43MiAxLjI1aC0yLjhMMTMuNjIgMTBoLTIuOTl2NC4zOGgzLjRsLS43MiAxLjI1aC0yLjY4djEuODdoNC4yN2wzLjI4LTUuNjJoLTIuMDlsLS43MyAxLjI1SDEyLjV2LTEuMjVoMi4xNGwuNzQtMS4yNXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMS4wOSAxMC42M0wwIDguNzUgMi4xOCA1aDMuMDdsMS4wNi0xLjg2SDcuNVYxLjg4SDUuNTZMNC41IDMuNzVIMi45MUw1LjEgMGg0LjI4djVINy42NGwtLjczIDEuMjVoMi40N3YyLjVINy4xMUw2LjA2IDYuODhIMy4yNWwtLjcyIDEuMjVoMi44TDYuMzggMTBoM3Y0LjM4SDUuOTdsLjcyIDEuMjVoMi42OXYxLjg3SDUuMWwtMy4yOC01LjYyaDIuMDlsLjczIDEuMjVINy41di0xLjI1SDUuMzZsLS43NC0xLjI1eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Machine Learning');
			})
		);

		fns.push(
			this.addEntry(dt + 'natural language api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Natural\nLanguage API', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUgMmgzdjEyaC0zdjJoMyAydi0yVjIgMGgtMi0zeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOCAydjFsMi0xem0yIDEydi0xbC0yIDF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUgMTRIMlYyaDNWMEgyIDB2MiAxMiAyaDIgM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxNHYtMWwyIDF6TTIgMnYxTDAgMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNSA3aDEwdjJINXptMCAzaDEwdjJINXptMC02aDEwdjJINXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Natural Language API');
			})
		);

		fns.push(
			this.addEntry(dt + 'natural language api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 190, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Natural Language API', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUgMmgzdjEyaC0zdjJoMyAydi0yVjIgMGgtMi0zeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOCAydjFsMi0xem0yIDEydi0xbC0yIDF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUgMTRIMlYyaDNWMEgyIDB2MiAxMiAyaDIgM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxNHYtMWwyIDF6TTIgMnYxTDAgMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNSA3aDEwdjJINXptMCAzaDEwdjJINXptMC02aDEwdjJINXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Natural Language API');
			})
		);

		fns.push(
			this.addEntry(dt + 'natural language api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 198, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Natural Language API', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUgMmgzdjEyaC0zdjJoMyAydi0yVjIgMGgtMi0zeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOCAydjFsMi0xem0yIDEydi0xbC0yIDF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUgMTRIMlYyaDNWMEgyIDB2MiAxMiAyaDIgM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxNHYtMWwyIDF6TTIgMnYxTDAgMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNSA3aDEwdjJINXptMCAzaDEwdjJINXptMC02aDEwdjJINXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Natural Language API');
			})
		);

		fns.push(
			this.addEntry(dt + 'vision api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Vision\nAPI', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTEwIDE2TDAgOGg0bDYgNC45OXoiLz4mI3hhOwkJPHBhdGggZD0iTTIwIDhsLTEwIDh2LTMuMDFMMTYgOHoiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0xMCAzLjAxTDQgOEgwbDEwLTh6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0yMCA4TDEwIDB2My4wMUwxNiA4eiIvPiYjeGE7CTwvZz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxMCIgY3k9IjgiIHI9IjIiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Vision API');
			})
		);

		fns.push(
			this.addEntry(dt + 'vision api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Vision API', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTEwIDE2TDAgOGg0bDYgNC45OXoiLz4mI3hhOwkJPHBhdGggZD0iTTIwIDhsLTEwIDh2LTMuMDFMMTYgOHoiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0xMCAzLjAxTDQgOEgwbDEwLTh6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0yMCA4TDEwIDB2My4wMUwxNiA4eiIvPiYjeGE7CTwvZz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxMCIgY3k9IjgiIHI9IjIiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Vision API');
			})
		);

		fns.push(
			this.addEntry(dt + 'vision api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Vision API', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTEwIDE2TDAgOGg0bDYgNC45OXoiLz4mI3hhOwkJPHBhdGggZD0iTTIwIDhsLTEwIDh2LTMuMDFMMTYgOHoiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0xMCAzLjAxTDQgOEgwbDEwLTh6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0yMCA4TDEwIDB2My4wMUwxNiA4eiIvPiYjeGE7CTwvZz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxMCIgY3k9IjgiIHI9IjIiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Vision API');
			})
		);

		fns.push(
			this.addEntry(dt + 'translation api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Translation\nAPI', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjAgMTgiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1LjkxIDcuMmgtMS44MkwxMCAxOGgxLjgybDEtMi43aDQuMzJsMSAyLjdIMjB6bS0yLjM5IDYuM0wxNSA5LjZsMS40OCAzLjl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwLjc5IDExLjc3TDguNDggOS41MWgwYTE1LjYyIDE1LjYyIDAgMCAwIDMuNC01LjkxaDIuNjdWMS44SDguMThWMEg2LjM2djEuOEgwdjEuNzloMTAuMTVhMTQuMDYgMTQuMDYgMCAwIDEtMi44OCA0LjgyIDE0LjU1IDE0LjU1IDAgMCAxLTIuMS0zSDMuMzVhMTYgMTYgMCAwIDAgMi43MSA0LjFMMS40NCAxNGwxLjI5IDEuMyA0LjU0LTQuNSAyLjgzIDIuOHoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Translation API');
			})
		);

		fns.push(
			this.addEntry(dt + 'translation api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Translation API', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjAgMTgiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1LjkxIDcuMmgtMS44MkwxMCAxOGgxLjgybDEtMi43aDQuMzJsMSAyLjdIMjB6bS0yLjM5IDYuM0wxNSA5LjZsMS40OCAzLjl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwLjc5IDExLjc3TDguNDggOS41MWgwYTE1LjYyIDE1LjYyIDAgMCAwIDMuNC01LjkxaDIuNjdWMS44SDguMThWMEg2LjM2djEuOEgwdjEuNzloMTAuMTVhMTQuMDYgMTQuMDYgMCAwIDEtMi44OCA0LjgyIDE0LjU1IDE0LjU1IDAgMCAxLTIuMS0zSDMuMzVhMTYgMTYgMCAwIDAgMi43MSA0LjFMMS40NCAxNGwxLjI5IDEuMyA0LjU0LTQuNSAyLjgzIDIuOHoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Translation API');
			})
		);

		fns.push(
			this.addEntry(dt + 'translation api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 168, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Translation API', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjAgMTgiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1LjkxIDcuMmgtMS44MkwxMCAxOGgxLjgybDEtMi43aDQuMzJsMSAyLjdIMjB6bS0yLjM5IDYuM0wxNSA5LjZsMS40OCAzLjl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwLjc5IDExLjc3TDguNDggOS41MWgwYTE1LjYyIDE1LjYyIDAgMCAwIDMuNC01LjkxaDIuNjdWMS44SDguMThWMEg2LjM2djEuOEgwdjEuNzloMTAuMTVhMTQuMDYgMTQuMDYgMCAwIDEtMi44OCA0LjgyIDE0LjU1IDE0LjU1IDAgMCAxLTIuMS0zSDMuMzVhMTYgMTYgMCAwIDAgMi43MSA0LjFMMS40NCAxNGwxLjI5IDEuMyA0LjU0LTQuNSAyLjgzIDIuOHoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Translation API');
			})
		);

		fns.push(
			this.addEntry(dt + 'speech to text', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Speech-to-text', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04IDBoMnYyMEg4ek00IDZoMnY4SDR6bTggMGgydjhoLTJ6TTAgM2gydjE0SDB6bTE2IDBoMnYxNGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOCAwaDJ2MTBIOHpNNCA2aDJ2NEg0em04IDBoMnY0aC0yek0wIDNoMnY3SDB6bTE2IDBoMnY3aC0yeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Speech-to-text');
			})
		);

		fns.push(
			this.addEntry(dt + 'speech to text', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Speech-to-text', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04IDBoMnYyMEg4ek00IDZoMnY4SDR6bTggMGgydjhoLTJ6TTAgM2gydjE0SDB6bTE2IDBoMnYxNGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOCAwaDJ2MTBIOHpNNCA2aDJ2NEg0em04IDBoMnY0aC0yek0wIDNoMnY3SDB6bTE2IDBoMnY3aC0yeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Speech-to-text');
			})
		);

		fns.push(
			this.addEntry(dt + 'speech to text', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Speech-to-text', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04IDBoMnYyMEg4ek00IDZoMnY4SDR6bTggMGgydjhoLTJ6TTAgM2gydjE0SDB6bTE2IDBoMnYxNGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOCAwaDJ2MTBIOHpNNCA2aDJ2NEg0em04IDBoMnY0aC0yek0wIDNoMnY3SDB6bTE2IDBoMnY3aC0yeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Speech-to-text');
			})
		);

		fns.push(
			this.addEntry(dt + 'jobs api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 100, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Jobs\nAPI', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjkyMTQ0MjAzMTg2MDM1IiBoZWlnaHQ9IjE5Ljc3ODMyMDMxMjUiIHZpZXdCb3g9Ii0wLjAwMDQ0MTU1NzE3NDc4MTMzNzQgMC4yNSAxOS45MjE0NDIwMzE4NjAzNSAxOS43NzgzMjAzMTI1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsLXJ1bGU6ZXZlbm9kZH0mI3hhOwkuc3Qze2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNC40NjEgMTYuMjRhMyAzIDAgMSAxIDAtNiAzIDMgMCAxIDEgMCA2em0zLjYzLS40YTQuNDMgNC40MyAwIDAgMC01LjA0OS02LjcxNEE0LjQzIDQuNDMgMCAwIDAgLjAxMSAxMy4zMmE0LjkxIDQuOTEgMCAwIDAgMCAuNjcgMy40MyAzLjQzIDAgMCAwIC4wOS40NGwuMDYuMjFhNC41OSA0LjU5IDAgMCAwIC4zNC43OSA0LjI0IDQuMjQgMCAwIDAgLjc2IDFsLjE1LjE1LjMzLjI3YTQuMTYgNC4xNiAwIDAgMCAuNzMuNDQgNC40NCA0LjQ0IDAgMCAwIDQuNTQtLjI5bDIuOTMgMi45M2EuMzMuMzMgMCAwIDAgLjQ3IDBsLjY2LS42NWEuMzMuMzMgMCAwIDAgMC0uNDd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkuODExIDE0LjU4YTUuNDEgNS40MSAwIDAgMCAuMi0xLjUxIDUuNTMgNS41MyAwIDAgMC01LjYxLTUuNDIgNS44MiA1LjgyIDAgMCAwLTEuOTIuMzVWMy44M2EuNjIuNjIgMCAwIDEgLjYyLS42MmgxNi4xOWEuNjMuNjMgMCAwIDEgLjYzLjYyVjE0YS42My42MyAwIDAgMS0uNjMuNjN6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMy41OTEgMy4yMVYxLjczaC00LjQ0djEuNDhoLTEuNDlWLjg3YS42My42MyAwIDAgMSAuNjMtLjYyaDYuMTZhLjYyLjYyIDAgMCAxIC42Mi42MnYyLjM0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUuMDcxIDMuMjFoLTEuNDhsMS40OC0uNDd6bS01LjkzIDBoLTEuNDlsMS40OS0uNTR6Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Jobs API');
			})
		);

		fns.push(
			this.addEntry(dt + 'jobs api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Jobs API', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjkyMTQ0MjAzMTg2MDM1IiBoZWlnaHQ9IjE5Ljc3ODMyMDMxMjUiIHZpZXdCb3g9Ii0wLjAwMDQ0MTU1NzE3NDc4MTMzNzQgMC4yNSAxOS45MjE0NDIwMzE4NjAzNSAxOS43NzgzMjAzMTI1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsLXJ1bGU6ZXZlbm9kZH0mI3hhOwkuc3Qze2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNC40NjEgMTYuMjRhMyAzIDAgMSAxIDAtNiAzIDMgMCAxIDEgMCA2em0zLjYzLS40YTQuNDMgNC40MyAwIDAgMC01LjA0OS02LjcxNEE0LjQzIDQuNDMgMCAwIDAgLjAxMSAxMy4zMmE0LjkxIDQuOTEgMCAwIDAgMCAuNjcgMy40MyAzLjQzIDAgMCAwIC4wOS40NGwuMDYuMjFhNC41OSA0LjU5IDAgMCAwIC4zNC43OSA0LjI0IDQuMjQgMCAwIDAgLjc2IDFsLjE1LjE1LjMzLjI3YTQuMTYgNC4xNiAwIDAgMCAuNzMuNDQgNC40NCA0LjQ0IDAgMCAwIDQuNTQtLjI5bDIuOTMgMi45M2EuMzMuMzMgMCAwIDAgLjQ3IDBsLjY2LS42NWEuMzMuMzMgMCAwIDAgMC0uNDd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkuODExIDE0LjU4YTUuNDEgNS40MSAwIDAgMCAuMi0xLjUxIDUuNTMgNS41MyAwIDAgMC01LjYxLTUuNDIgNS44MiA1LjgyIDAgMCAwLTEuOTIuMzVWMy44M2EuNjIuNjIgMCAwIDEgLjYyLS42MmgxNi4xOWEuNjMuNjMgMCAwIDEgLjYzLjYyVjE0YS42My42MyAwIDAgMS0uNjMuNjN6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMy41OTEgMy4yMVYxLjczaC00LjQ0djEuNDhoLTEuNDlWLjg3YS42My42MyAwIDAgMSAuNjMtLjYyaDYuMTZhLjYyLjYyIDAgMCAxIC42Mi42MnYyLjM0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUuMDcxIDMuMjFoLTEuNDhsMS40OC0uNDd6bS01LjkzIDBoLTEuNDlsMS40OS0uNTR6Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Jobs API');
			})
		);

		fns.push(
			this.addEntry(dt + 'jobs api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Jobs API', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjkyMTQ0MjAzMTg2MDM1IiBoZWlnaHQ9IjE5Ljc3ODMyMDMxMjUiIHZpZXdCb3g9Ii0wLjAwMDQ0MTU1NzE3NDc4MTMzNzQgMC4yNSAxOS45MjE0NDIwMzE4NjAzNSAxOS43NzgzMjAzMTI1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsLXJ1bGU6ZXZlbm9kZH0mI3hhOwkuc3Qze2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNC40NjEgMTYuMjRhMyAzIDAgMSAxIDAtNiAzIDMgMCAxIDEgMCA2em0zLjYzLS40YTQuNDMgNC40MyAwIDAgMC01LjA0OS02LjcxNEE0LjQzIDQuNDMgMCAwIDAgLjAxMSAxMy4zMmE0LjkxIDQuOTEgMCAwIDAgMCAuNjcgMy40MyAzLjQzIDAgMCAwIC4wOS40NGwuMDYuMjFhNC41OSA0LjU5IDAgMCAwIC4zNC43OSA0LjI0IDQuMjQgMCAwIDAgLjc2IDFsLjE1LjE1LjMzLjI3YTQuMTYgNC4xNiAwIDAgMCAuNzMuNDQgNC40NCA0LjQ0IDAgMCAwIDQuNTQtLjI5bDIuOTMgMi45M2EuMzMuMzMgMCAwIDAgLjQ3IDBsLjY2LS42NWEuMzMuMzMgMCAwIDAgMC0uNDd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkuODExIDE0LjU4YTUuNDEgNS40MSAwIDAgMCAuMi0xLjUxIDUuNTMgNS41MyAwIDAgMC01LjYxLTUuNDIgNS44MiA1LjgyIDAgMCAwLTEuOTIuMzVWMy44M2EuNjIuNjIgMCAwIDEgLjYyLS42MmgxNi4xOWEuNjMuNjMgMCAwIDEgLjYzLjYyVjE0YS42My42MyAwIDAgMS0uNjMuNjN6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMy41OTEgMy4yMVYxLjczaC00LjQ0djEuNDhoLTEuNDlWLjg3YS42My42MyAwIDAgMSAuNjMtLjYyaDYuMTZhLjYyLjYyIDAgMCAxIC42Mi42MnYyLjM0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUuMDcxIDMuMjFoLTEuNDhsMS40OC0uNDd6bS01LjkzIDBoLTEuNDlsMS40OS0uNTR6Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Jobs API');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud video intelligence api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Video\nIntelligence API', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk4OTk5OTc3MTExODE2NCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE5Ljk4OTk5OTc3MTExODE2NCAxNCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwLjI3IDIuMzNoMi4wNXYxLjMzSDkuNEw3LjA3IDBIMHY0LjMzaDEuOTlMMy4yNSAyaDIuNTdsLjg2IDEuMzNINC4xMUwyLjg1IDUuNjZIMHYyLjU5aDIuODVsMS4yNiAyLjQxaDIuNTdMNS44MiAxMkgzLjI1TDEuOTkgOS42NkgwVjE0aDcuMDdsMi4zMy0zLjY3aDIuOTJ2MS4zM2gtMi4wNUw4LjggMTRoNS41MlY3LjY2SDcuOTFMNy4wOCA5SDUuMjRMNi41IDcgNS4yNCA1aDEuODRsLjggMS4zM2g2LjQ0VjBIOC44eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNS45OSAxMC4xMWw0IDIuOTVWMS4xbC00IDIuOTF6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Video Intelligence API');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud video intelligence api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 230, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Video Intelligence API', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk4OTk5OTc3MTExODE2NCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE5Ljk4OTk5OTc3MTExODE2NCAxNCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwLjI3IDIuMzNoMi4wNXYxLjMzSDkuNEw3LjA3IDBIMHY0LjMzaDEuOTlMMy4yNSAyaDIuNTdsLjg2IDEuMzNINC4xMUwyLjg1IDUuNjZIMHYyLjU5aDIuODVsMS4yNiAyLjQxaDIuNTdMNS44MiAxMkgzLjI1TDEuOTkgOS42NkgwVjE0aDcuMDdsMi4zMy0zLjY3aDIuOTJ2MS4zM2gtMi4wNUw4LjggMTRoNS41MlY3LjY2SDcuOTFMNy4wOCA5SDUuMjRMNi41IDcgNS4yNCA1aDEuODRsLjggMS4zM2g2LjQ0VjBIOC44eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNS45OSAxMC4xMWw0IDIuOTVWMS4xbC00IDIuOTF6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Video Intelligence API');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud video intelligence api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 238, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Video Intelligence API', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk4OTk5OTc3MTExODE2NCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE5Ljk4OTk5OTc3MTExODE2NCAxNCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwLjI3IDIuMzNoMi4wNXYxLjMzSDkuNEw3LjA3IDBIMHY0LjMzaDEuOTlMMy4yNSAyaDIuNTdsLjg2IDEuMzNINC4xMUwyLjg1IDUuNjZIMHYyLjU5aDIuODVsMS4yNiAyLjQxaDIuNTdMNS44MiAxMkgzLjI1TDEuOTkgOS42NkgwVjE0aDcuMDdsMi4zMy0zLjY3aDIuOTJ2MS4zM2gtMi4wNUw4LjggMTRoNS41MlY3LjY2SDcuOTFMNy4wOCA5SDUuMjRMNi41IDcgNS4yNCA1aDEuODRsLjggMS4zM2g2LjQ0VjBIOC44eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNS45OSAxMC4xMWw0IDIuOTVWMS4xbC00IDIuOTF6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Video Intelligence API');
			})
		);

		fns.push(
			this.addEntry(dt + 'advanced solutions lab', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Advanced\nSolutions Lab', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2Ljk3OTk5OTU0MjIzNjMyOCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE2Ljk3OTk5OTU0MjIzNjMyOCAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxnIGNsYXNzPSJzdDAiPiYjeGE7CQk8cGF0aCBkPSJNOC40OSAxMC4yOUwuMjQgNS4zNSA4LjQ5LjU4bDguMjQgNC42N3pNMS43NiA1LjM2bDYuNzIgNCA2LjcyLTQuMTEtNi43MS0zLjc4eiIvPiYjeGE7CQk8cGF0aCBkPSJNOC40OSAxOS40NEwuMjEgMTMuODkgOC40OSA5LjNsOC4xNSA0LjY0em0tNi44LTUuNWw2LjggNC41NiA2LjctNC41LTYuNy0zLjgyeiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPHBhdGggZD0iTS42MTMgNS41MDJsLjY3NS0uMzcxIDcuNDc3IDEzLjYtLjY3NS4zNzF6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxOC44MjZsNy4zMDEtMTMuNTU5LjY3OC4zNjUtNy4zMDEgMTMuNTU5ek0uNzE2IDEzLjY4N0w4LjA5Ni45MDRsLjY2Ny4zODUtNy4zOCAxMi43ODN6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxLjIxNGwuNjY5LS4zODEgNy40MDUgMTIuOTg3LS42NjkuMzgxeiIvPiYjeGE7CQk8cGF0aCBkPSJNOC4xMy45NmguNzdWMTguOWgtLjc3ek0uNTUgNS40M2guNzd2OC42NkguNTV6bTE0Ljk3LS4wOWguNzdWMTRoLS43N3oiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjguNTIiIGN5PSIxLjA3IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjE1LjkxIiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxLjA3IiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iOS45MyIgcj0iMS42OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNS45MSIgY3k9IjEzLjk0IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjEuMDciIGN5PSIxMy45NCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iMTguOTMiIHI9IjEuMDciLz4mI3hhOwkJPHBhdGggZD0iTTguNDkgMTAuMjlMLjI0IDUuMzUgOC40OS41OGw4LjI0IDQuNjd6TTEuNzYgNS4zNmw2LjcyIDQgNi43Mi00LjExLTYuNzEtMy43OHoiLz4mI3hhOwkJPHBhdGggZD0iTTguNDkgMTkuNDRMLjIxIDEzLjg5IDguNDkgOS4zbDguMTUgNC42NHptLTYuOC01LjVsNi44IDQuNTYgNi43LTQuNS02LjctMy44MnoiLz4mI3hhOwkJPHBhdGggZD0iTS42MTMgNS41MDJsLjY3NS0uMzcxIDcuNDc3IDEzLjYtLjY3NS4zNzF6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxOC44MjZsNy4zMDEtMTMuNTU5LjY3OC4zNjUtNy4zMDEgMTMuNTU5ek0uNzE2IDEzLjY4N0w4LjA5Ni45MDRsLjY2Ny4zODUtNy4zOCAxMi43ODN6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxLjIxNGwuNjY5LS4zODEgNy40MDUgMTIuOTg3LS42NjkuMzgxeiIvPiYjeGE7CQk8cGF0aCBkPSJNOC4xMy45NmguNzdWMTguOWgtLjc3ek0uNTUgNS40M2guNzd2OC42NkguNTV6bTE0Ljk3LS4wOWguNzdWMTRoLS43N3oiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxjaXJjbGUgY3g9IjguNTIiIGN5PSIxLjA3IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjE1LjkxIiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxLjA3IiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iOS45MyIgcj0iMS42OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNS45MSIgY3k9IjEzLjk0IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjEuMDciIGN5PSIxMy45NCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iMTguOTMiIHI9IjEuMDciLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Advanced Solutions Lab');
			})
		);

		fns.push(
			this.addEntry(dt + 'advanced solutions lab', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 200, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Advanced Solutions Lab', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2Ljk3OTk5OTU0MjIzNjMyOCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE2Ljk3OTk5OTU0MjIzNjMyOCAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxnIGNsYXNzPSJzdDAiPiYjeGE7CQk8cGF0aCBkPSJNOC40OSAxMC4yOUwuMjQgNS4zNSA4LjQ5LjU4bDguMjQgNC42N3pNMS43NiA1LjM2bDYuNzIgNCA2LjcyLTQuMTEtNi43MS0zLjc4eiIvPiYjeGE7CQk8cGF0aCBkPSJNOC40OSAxOS40NEwuMjEgMTMuODkgOC40OSA5LjNsOC4xNSA0LjY0em0tNi44LTUuNWw2LjggNC41NiA2LjctNC41LTYuNy0zLjgyeiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPHBhdGggZD0iTS42MTMgNS41MDJsLjY3NS0uMzcxIDcuNDc3IDEzLjYtLjY3NS4zNzF6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxOC44MjZsNy4zMDEtMTMuNTU5LjY3OC4zNjUtNy4zMDEgMTMuNTU5ek0uNzE2IDEzLjY4N0w4LjA5Ni45MDRsLjY2Ny4zODUtNy4zOCAxMi43ODN6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxLjIxNGwuNjY5LS4zODEgNy40MDUgMTIuOTg3LS42NjkuMzgxeiIvPiYjeGE7CQk8cGF0aCBkPSJNOC4xMy45NmguNzdWMTguOWgtLjc3ek0uNTUgNS40M2guNzd2OC42NkguNTV6bTE0Ljk3LS4wOWguNzdWMTRoLS43N3oiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjguNTIiIGN5PSIxLjA3IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjE1LjkxIiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxLjA3IiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iOS45MyIgcj0iMS42OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNS45MSIgY3k9IjEzLjk0IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjEuMDciIGN5PSIxMy45NCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iMTguOTMiIHI9IjEuMDciLz4mI3hhOwkJPHBhdGggZD0iTTguNDkgMTAuMjlMLjI0IDUuMzUgOC40OS41OGw4LjI0IDQuNjd6TTEuNzYgNS4zNmw2LjcyIDQgNi43Mi00LjExLTYuNzEtMy43OHoiLz4mI3hhOwkJPHBhdGggZD0iTTguNDkgMTkuNDRMLjIxIDEzLjg5IDguNDkgOS4zbDguMTUgNC42NHptLTYuOC01LjVsNi44IDQuNTYgNi43LTQuNS02LjctMy44MnoiLz4mI3hhOwkJPHBhdGggZD0iTS42MTMgNS41MDJsLjY3NS0uMzcxIDcuNDc3IDEzLjYtLjY3NS4zNzF6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxOC44MjZsNy4zMDEtMTMuNTU5LjY3OC4zNjUtNy4zMDEgMTMuNTU5ek0uNzE2IDEzLjY4N0w4LjA5Ni45MDRsLjY2Ny4zODUtNy4zOCAxMi43ODN6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxLjIxNGwuNjY5LS4zODEgNy40MDUgMTIuOTg3LS42NjkuMzgxeiIvPiYjeGE7CQk8cGF0aCBkPSJNOC4xMy45NmguNzdWMTguOWgtLjc3ek0uNTUgNS40M2guNzd2OC42NkguNTV6bTE0Ljk3LS4wOWguNzdWMTRoLS43N3oiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxjaXJjbGUgY3g9IjguNTIiIGN5PSIxLjA3IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjE1LjkxIiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxLjA3IiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iOS45MyIgcj0iMS42OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNS45MSIgY3k9IjEzLjk0IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjEuMDciIGN5PSIxMy45NCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iMTguOTMiIHI9IjEuMDciLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Advanced Solutions Lab');
			})
		);

		fns.push(
			this.addEntry(dt + 'advanced solutions lab', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 208, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Advanced Solutions Lab', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2Ljk3OTk5OTU0MjIzNjMyOCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE2Ljk3OTk5OTU0MjIzNjMyOCAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxnIGNsYXNzPSJzdDAiPiYjeGE7CQk8cGF0aCBkPSJNOC40OSAxMC4yOUwuMjQgNS4zNSA4LjQ5LjU4bDguMjQgNC42N3pNMS43NiA1LjM2bDYuNzIgNCA2LjcyLTQuMTEtNi43MS0zLjc4eiIvPiYjeGE7CQk8cGF0aCBkPSJNOC40OSAxOS40NEwuMjEgMTMuODkgOC40OSA5LjNsOC4xNSA0LjY0em0tNi44LTUuNWw2LjggNC41NiA2LjctNC41LTYuNy0zLjgyeiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPHBhdGggZD0iTS42MTMgNS41MDJsLjY3NS0uMzcxIDcuNDc3IDEzLjYtLjY3NS4zNzF6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxOC44MjZsNy4zMDEtMTMuNTU5LjY3OC4zNjUtNy4zMDEgMTMuNTU5ek0uNzE2IDEzLjY4N0w4LjA5Ni45MDRsLjY2Ny4zODUtNy4zOCAxMi43ODN6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxLjIxNGwuNjY5LS4zODEgNy40MDUgMTIuOTg3LS42NjkuMzgxeiIvPiYjeGE7CQk8cGF0aCBkPSJNOC4xMy45NmguNzdWMTguOWgtLjc3ek0uNTUgNS40M2guNzd2OC42NkguNTV6bTE0Ljk3LS4wOWguNzdWMTRoLS43N3oiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjguNTIiIGN5PSIxLjA3IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjE1LjkxIiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxLjA3IiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iOS45MyIgcj0iMS42OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNS45MSIgY3k9IjEzLjk0IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjEuMDciIGN5PSIxMy45NCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iMTguOTMiIHI9IjEuMDciLz4mI3hhOwkJPHBhdGggZD0iTTguNDkgMTAuMjlMLjI0IDUuMzUgOC40OS41OGw4LjI0IDQuNjd6TTEuNzYgNS4zNmw2LjcyIDQgNi43Mi00LjExLTYuNzEtMy43OHoiLz4mI3hhOwkJPHBhdGggZD0iTTguNDkgMTkuNDRMLjIxIDEzLjg5IDguNDkgOS4zbDguMTUgNC42NHptLTYuOC01LjVsNi44IDQuNTYgNi43LTQuNS02LjctMy44MnoiLz4mI3hhOwkJPHBhdGggZD0iTS42MTMgNS41MDJsLjY3NS0uMzcxIDcuNDc3IDEzLjYtLjY3NS4zNzF6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxOC44MjZsNy4zMDEtMTMuNTU5LjY3OC4zNjUtNy4zMDEgMTMuNTU5ek0uNzE2IDEzLjY4N0w4LjA5Ni45MDRsLjY2Ny4zODUtNy4zOCAxMi43ODN6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxLjIxNGwuNjY5LS4zODEgNy40MDUgMTIuOTg3LS42NjkuMzgxeiIvPiYjeGE7CQk8cGF0aCBkPSJNOC4xMy45NmguNzdWMTguOWgtLjc3ek0uNTUgNS40M2guNzd2OC42NkguNTV6bTE0Ljk3LS4wOWguNzdWMTRoLS43N3oiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxjaXJjbGUgY3g9IjguNTIiIGN5PSIxLjA3IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjE1LjkxIiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxLjA3IiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iOS45MyIgcj0iMS42OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNS45MSIgY3k9IjEzLjk0IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjEuMDciIGN5PSIxMy45NCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iMTguOTMiIHI9IjEuMDciLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Advanced Solutions Lab');
			})
		);

		this.addPalette('gcp2Cloud AI', 'GCP / Cloud AI', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2InternetOfThingsPalette = function()
	{
		var dt = 'gcp google cloud platform iot internet of things ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'iot core internet of things', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('IoT Core', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjcwNjUzMTUyNDY1ODIwMyIgaGVpZ2h0PSIxOS45ODM4MjE4Njg4OTY0ODQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iLTAuMDAwMjA5NTQ2OTY4MTA4MDQzMDcgMC4wMDAxNzcyNDA4Mjg2MzQyMzk3MyAxOS43MDY1MzE1MjQ2NTgyMDMgMTkuOTgzODIxODY4ODk2NDg0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAuMzQ1IDEwLjM5NnYtNC40M2gwYTEuMTQgMS4xNCAwIDAgMC0uNS0yLjE2NCAxLjE0IDEuMTQgMCAwIDAtLjUgMi4xNjR2NC40MmgtNC4yN3YtMi44MmExLjE0IDEuMTQgMCAwIDAtLjUzLTIuMTUgMS4xNCAxLjE0IDAgMCAwLS41MiAyLjE1djIuODNoLS4yMmEzLjgyIDMuODIgMCAwIDEtMi43MjItNi40ODUgMy44MiAzLjgyIDAgMCAxIDQuMTIyLS44OTUgNS4yMiA1LjIyIDAgMCAxIDkuNDQtLjA1IDQgNCAwIDAgMSAxLjIzLS4yaDBhMy44MyAzLjgzIDAgMSAxIDAgNy42NmgtLjI1di0yLjg2YTEuMTQgMS4xNCAwIDAgMC0uNTMtMi4xNDkgMS4xNCAxLjE0IDAgMCAwLS41MyAyLjE0OXYyLjgzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LjA3NSAxMy4zNTZhMiAyIDAgMCAxIDEuNTQgMiAyLjA3IDIuMDcgMCAwIDEtNC4xMS4zNTQgMi4wNyAyLjA3IDAgMCAxIDEuNTItMi4zNTR2LTIuOTZoMXptLS41MyAzYTEgMSAwIDEgMCAwLTIgMSAxIDAgMSAwIDAgMnptMTEuMDgtM2EyLjA3IDIuMDcgMCAwIDEtLjUzIDQuMDcxIDIuMDcgMi4wNyAwIDAgMS0uNTMtNC4wNzF2LTIuOTVoMS4wNnptLS41MyAzYTEgMSAwIDAgMCAuMzktMS45NCAxIDEgMCAwIDAtMS4yNjggMS4zMDcgMSAxIDAgMCAwIC44NzguNjMzem0tNC43NS0uNDNoMGEyLjA2IDIuMDYgMCAwIDEtLjUgNC4wNTggMi4wNiAyLjA2IDAgMCAxLS41LTQuMDU4di01LjVoMS4wNnptLS41NCAzYTEgMSAwIDAgMCAuNTUtMS44MzIgMSAxIDAgMCAwLTEuNDggMS4yMTIgMSAxIDAgMCAwIC45My42eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'IoT Core');
			})
		);

		fns.push(
			this.addEntry(dt + 'iot core internet of things', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>IoT Core', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjcwNjUzMTUyNDY1ODIwMyIgaGVpZ2h0PSIxOS45ODM4MjE4Njg4OTY0ODQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iLTAuMDAwMjA5NTQ2OTY4MTA4MDQzMDcgMC4wMDAxNzcyNDA4Mjg2MzQyMzk3MyAxOS43MDY1MzE1MjQ2NTgyMDMgMTkuOTgzODIxODY4ODk2NDg0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAuMzQ1IDEwLjM5NnYtNC40M2gwYTEuMTQgMS4xNCAwIDAgMC0uNS0yLjE2NCAxLjE0IDEuMTQgMCAwIDAtLjUgMi4xNjR2NC40MmgtNC4yN3YtMi44MmExLjE0IDEuMTQgMCAwIDAtLjUzLTIuMTUgMS4xNCAxLjE0IDAgMCAwLS41MiAyLjE1djIuODNoLS4yMmEzLjgyIDMuODIgMCAwIDEtMi43MjItNi40ODUgMy44MiAzLjgyIDAgMCAxIDQuMTIyLS44OTUgNS4yMiA1LjIyIDAgMCAxIDkuNDQtLjA1IDQgNCAwIDAgMSAxLjIzLS4yaDBhMy44MyAzLjgzIDAgMSAxIDAgNy42NmgtLjI1di0yLjg2YTEuMTQgMS4xNCAwIDAgMC0uNTMtMi4xNDkgMS4xNCAxLjE0IDAgMCAwLS41MyAyLjE0OXYyLjgzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LjA3NSAxMy4zNTZhMiAyIDAgMCAxIDEuNTQgMiAyLjA3IDIuMDcgMCAwIDEtNC4xMS4zNTQgMi4wNyAyLjA3IDAgMCAxIDEuNTItMi4zNTR2LTIuOTZoMXptLS41MyAzYTEgMSAwIDEgMCAwLTIgMSAxIDAgMSAwIDAgMnptMTEuMDgtM2EyLjA3IDIuMDcgMCAwIDEtLjUzIDQuMDcxIDIuMDcgMi4wNyAwIDAgMS0uNTMtNC4wNzF2LTIuOTVoMS4wNnptLS41MyAzYTEgMSAwIDAgMCAuMzktMS45NCAxIDEgMCAwIDAtMS4yNjggMS4zMDcgMSAxIDAgMCAwIC44NzguNjMzem0tNC43NS0uNDNoMGEyLjA2IDIuMDYgMCAwIDEtLjUgNC4wNTggMi4wNiAyLjA2IDAgMCAxLS41LTQuMDU4di01LjVoMS4wNnptLS41NCAzYTEgMSAwIDAgMCAuNTUtMS44MzIgMSAxIDAgMCAwLTEuNDggMS4yMTIgMSAxIDAgMCAwIC45My42eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'IoT Core');
			})
		);

		fns.push(
			this.addEntry(dt + 'iot core internet of things', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>IoT Core', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjcwNjUzMTUyNDY1ODIwMyIgaGVpZ2h0PSIxOS45ODM4MjE4Njg4OTY0ODQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iLTAuMDAwMjA5NTQ2OTY4MTA4MDQzMDcgMC4wMDAxNzcyNDA4Mjg2MzQyMzk3MyAxOS43MDY1MzE1MjQ2NTgyMDMgMTkuOTgzODIxODY4ODk2NDg0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAuMzQ1IDEwLjM5NnYtNC40M2gwYTEuMTQgMS4xNCAwIDAgMC0uNS0yLjE2NCAxLjE0IDEuMTQgMCAwIDAtLjUgMi4xNjR2NC40MmgtNC4yN3YtMi44MmExLjE0IDEuMTQgMCAwIDAtLjUzLTIuMTUgMS4xNCAxLjE0IDAgMCAwLS41MiAyLjE1djIuODNoLS4yMmEzLjgyIDMuODIgMCAwIDEtMi43MjItNi40ODUgMy44MiAzLjgyIDAgMCAxIDQuMTIyLS44OTUgNS4yMiA1LjIyIDAgMCAxIDkuNDQtLjA1IDQgNCAwIDAgMSAxLjIzLS4yaDBhMy44MyAzLjgzIDAgMSAxIDAgNy42NmgtLjI1di0yLjg2YTEuMTQgMS4xNCAwIDAgMC0uNTMtMi4xNDkgMS4xNCAxLjE0IDAgMCAwLS41MyAyLjE0OXYyLjgzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LjA3NSAxMy4zNTZhMiAyIDAgMCAxIDEuNTQgMiAyLjA3IDIuMDcgMCAwIDEtNC4xMS4zNTQgMi4wNyAyLjA3IDAgMCAxIDEuNTItMi4zNTR2LTIuOTZoMXptLS41MyAzYTEgMSAwIDEgMCAwLTIgMSAxIDAgMSAwIDAgMnptMTEuMDgtM2EyLjA3IDIuMDcgMCAwIDEtLjUzIDQuMDcxIDIuMDcgMi4wNyAwIDAgMS0uNTMtNC4wNzF2LTIuOTVoMS4wNnptLS41MyAzYTEgMSAwIDAgMCAuMzktMS45NCAxIDEgMCAwIDAtMS4yNjggMS4zMDcgMSAxIDAgMCAwIC44NzguNjMzem0tNC43NS0uNDNoMGEyLjA2IDIuMDYgMCAwIDEtLjUgNC4wNTggMi4wNiAyLjA2IDAgMCAxLS41LTQuMDU4di01LjVoMS4wNnptLS41NCAzYTEgMSAwIDAgMCAuNTUtMS44MzIgMSAxIDAgMCAwLTEuNDggMS4yMTIgMSAxIDAgMCAwIC45My42eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'IoT Core');
			})
		);

		this.addPalette('gcp2Internet of Things', 'GCP / Internet of Things', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2DatabasesPalette = function()
	{
		var dt = 'gcp google cloud platform databases ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'cloud sql', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 100, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nSQL', 
			    		new mxGeometry(0, 0, 22, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY1OTk5OTg0NzQxMjExIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTQuNjU5OTk5ODQ3NDEyMTEgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8c3R5bGU+JiN4YTsJCS5Ee2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTcuMzMgMTUuMzV2LTMuMDFMMCA4LjQ0djMuMDF6bTAgNC42NXYtMy4wMUwwIDEzLjA5djMuMDF6IiBjbGFzcz0ic3QyIEQiLz4mI3hhOwk8cGF0aCBkPSJNMTQuNjYgOC40NGwtNy4zMyAzLjl2My4wMWw3LjMzLTMuOXptMCA0LjY1bC03LjMzIDMuOVYyMGw3LjMzLTMuOXoiIGNsYXNzPSJzdDEgRCIvPiYjeGE7CTxwYXRoIGQ9Ik03LjMzIDB2My4wMWw3LjMzIDMuOVYzLjl6IiBjbGFzcz0ic3QwIEQiLz4mI3hhOwk8cGF0aCBkPSJNMCA2LjkxbDcuMzMtMy45VjBMMCAzLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOwk8cGF0aCBkPSJNNy4zMyAxMC43OVY3Ljc3TDAgMy44N3YzLjAyeiIgY2xhc3M9IkQgc3QyIi8+JiN4YTsJPHBhdGggZD0iTTE0LjY2IDMuODdsLTcuMzMgMy45djMuMDJsNy4zMy0zLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(19, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud SQL');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud sql', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud SQL', 
			    		new mxGeometry(0, 0, 22, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY1OTk5OTg0NzQxMjExIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTQuNjU5OTk5ODQ3NDEyMTEgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8c3R5bGU+JiN4YTsJCS5Ee2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTcuMzMgMTUuMzV2LTMuMDFMMCA4LjQ0djMuMDF6bTAgNC42NXYtMy4wMUwwIDEzLjA5djMuMDF6IiBjbGFzcz0ic3QyIEQiLz4mI3hhOwk8cGF0aCBkPSJNMTQuNjYgOC40NGwtNy4zMyAzLjl2My4wMWw3LjMzLTMuOXptMCA0LjY1bC03LjMzIDMuOVYyMGw3LjMzLTMuOXoiIGNsYXNzPSJzdDEgRCIvPiYjeGE7CTxwYXRoIGQ9Ik03LjMzIDB2My4wMWw3LjMzIDMuOVYzLjl6IiBjbGFzcz0ic3QwIEQiLz4mI3hhOwk8cGF0aCBkPSJNMCA2LjkxbDcuMzMtMy45VjBMMCAzLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOwk8cGF0aCBkPSJNNy4zMyAxMC43OVY3Ljc3TDAgMy44N3YzLjAyeiIgY2xhc3M9IkQgc3QyIi8+JiN4YTsJPHBhdGggZD0iTTE0LjY2IDMuODdsLTcuMzMgMy45djMuMDJsNy4zMy0zLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(19, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud SQL');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud sql', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud SQL', 
			    		new mxGeometry(0, 0, 22, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY1OTk5OTg0NzQxMjExIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTQuNjU5OTk5ODQ3NDEyMTEgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8c3R5bGU+JiN4YTsJCS5Ee2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTcuMzMgMTUuMzV2LTMuMDFMMCA4LjQ0djMuMDF6bTAgNC42NXYtMy4wMUwwIDEzLjA5djMuMDF6IiBjbGFzcz0ic3QyIEQiLz4mI3hhOwk8cGF0aCBkPSJNMTQuNjYgOC40NGwtNy4zMyAzLjl2My4wMWw3LjMzLTMuOXptMCA0LjY1bC03LjMzIDMuOVYyMGw3LjMzLTMuOXoiIGNsYXNzPSJzdDEgRCIvPiYjeGE7CTxwYXRoIGQ9Ik03LjMzIDB2My4wMWw3LjMzIDMuOVYzLjl6IiBjbGFzcz0ic3QwIEQiLz4mI3hhOwk8cGF0aCBkPSJNMCA2LjkxbDcuMzMtMy45VjBMMCAzLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOwk8cGF0aCBkPSJNNy4zMyAxMC43OVY3Ljc3TDAgMy44N3YzLjAyeiIgY2xhc3M9IkQgc3QyIi8+JiN4YTsJPHBhdGggZD0iTTE0LjY2IDMuODdsLTcuMzMgMy45djMuMDJsNy4zMy0zLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(19, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud SQL');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud bigtable', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nBigtable', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1Njk3Nzg0NDIzODI4IiBoZWlnaHQ9IjIwLjAwOTI1NjM2MjkxNTA0IiB2aWV3Qm94PSItMC4wMDA0MjE5NjUxMTY0MDIxMzQzIDAuMDAwMDc0Njk5NTIxMDY0NzU4MyAxNy45NTY5Nzc4NDQyMzgyOCAyMC4wMDkyNTYzNjI5MTUwNCI+JiN4YTsJPHN0eWxlPiYjeGE7CQkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJCS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgZmlsbC1ydWxlPSJldmVub2RkIj4mI3hhOwkJPHBhdGggZD0iTTEzLjE5NiA0LjQ0N2wtNC4yMi0yLjUxYTIuODYgMi44NiAwIDAgMS0xLjI1LTEuNzFjMCAwIC4xNi0uMzIuMzgtLjJsNS4yNSAzLjFjLjYzLjM3LjI0IDIgLjI0IDJhLjc3Ljc3IDAgMCAwLS40LS42OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE0LjQ2NiAxMC42ODdhLjM1LjM1IDAgMCAxLS4xNi4zM2wtMSAuNjh2LTcuOTVjMC0uMjcuMTctLjU2LS4wNi0uN2wuOTIuNjhhLjczLjczIDAgMCAxIC4zNS42NXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDExLjU5N2EuMzYuMzYgMCAwIDEtLjItLjA2bC0zLjQ2LTIuMDZ2LjlsMy42NiAyLjE4LjI5LS41N3MtLjIyLS4zOS0uMjktLjM5em0uMiAxLjhhLjM2LjM2IDAgMCAxLS40IDBsLTMuNDYtMi4wNnYuNjZhLjQyLjQyIDAgMCAwIC4xOS4zNWwzLjI4IDJhLjM3LjM3IDAgMCAwIC4zOCAwIDIgMiAwIDAgMCAuMi0uNTJsLS4xOS0uMzl6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik04Ljk3NiAxMC43MjdsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzRsLTMuMjgtMmEuMzcuMzcgMCAwIDAtLjM4IDBsLTMuMjggMmEuNDEuNDEgMCAwIDAtLjE5LjM0di40M3oiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDkuODI3bC0zLjQ3LTIuMDVhLjQxLjQxIDAgMCAwLS4xOS4zNHYuNDNsMy42NiAyLjE4LjI4LS41NnoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPGcgY2xhc3M9InN0MiI+JiN4YTsJCQk8cGF0aCBkPSJNOC45NzYgMTEuNTk3djFsMy42Ni0yLjE4di0uOWwtMy40NiAyLjAyYS42NS42NSAwIDAgMS0uMi4wNnptLjIgMS44YS4zNi4zNiAwIDAgMS0uMi4wNnYuOWEuNS41IDAgMCAwIC4yMS0uMDVsMy4yOC0yYS4zOS4zOSAwIDAgMCAuMTktLjM1di0uNjZ6Ii8+JiN4YTsJCQk8cGF0aCBkPSJNMTIuNDQ2IDcuNzc3bC0zLjQ3IDIuMDV2LjlsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzR6Ii8+JiN4YTsJCTwvZz4mI3hhOwkJPHBhdGggZD0iTTQuNzU2IDE1LjUyN2w0LjE1IDIuNDdhMi43MiAyLjcyIDAgMCAxIDEuMjggMS44LjE4LjE4IDAgMCAxLS4yOC4xOGwtNS40NS0zLjIzYy0uNTMtLjMyLS4wNy0xLjg4LS4wNy0xLjg4YS43Ny43NyAwIDAgMCAuMzcuNjZ6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik0zLjQ4NiAxNS43Mjd2LTYuNTZhLjQxLjQxIDAgMCAxIC4xOS0uMzNsMS0uNTl2Ny45MWMwIC4yNyAwIC42OS4yMS44M2wtMS4wNi0uNjZhLjc1Ljc1IDAgMCAxLS4zNC0uNnoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTM2IDMuNDU3YS43NS43NSAwIDAgMC0uNzQgMGwtNC4yIDIuNTRhMi42MyAyLjYzIDAgMCAxLTIuMDguMjYuMjMuMjMgMCAwIDEgMC0uNGMuMTgtLjA5IDYuMzItMy43NCA2LjMyLTMuNzQuMjMtLjE0Ljc0IDEuMzkuNzQgMS4zOXoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTI2IDIuMDc3bDUuMzIgMy4xNWEuMzcuMzcgMCAwIDEgLjIuMzF2MS4xOGwtNi42Ny0zLjk2YS43NS43NSAwIDAgMC0uNzQgMGwxLjE4LS42OWEuNzEuNzEgMCAwIDEgLjczIDB6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xMC43OTYgMTYuNDg3YS43My43MyAwIDAgMCAuNzQgMGw0LjItMi40OWEyLjYzIDIuNjMgMCAwIDEgMi4xLS4yNS4yMS4yMSAwIDAgMSAwIC4zOGwtNi4zMyAzLjc1Yy0uMjIuMTQtLjc0LTEuNC0uNzQtMS40eiIgY2xhc3M9InN0MCIvPiYjeGE7CQk8cGF0aCBkPSJNNS40ODYgMTQuNzQ3YS41Ni41NiAwIDAgMS0uMTctLjMzdi0xLjE2bDYuNjYgMy45M2EuNjkuNjkgMCAwIDAgLjczIDBsLTEuMTguN2EuNy43IDAgMCAxLS43NCAweiIgY2xhc3M9InN0MSIvPiYjeGE7CQk8cGF0aCBkPSJNMy4yMzYgNy44MDdhLjc2Ljc2IDAgMCAwLS4zNy42NXY1YTIuNzUgMi43NSAwIDAgMS0uODcgMiAuMTguMTggMCAwIDEtLjMtLjEzdi03LjU2YzAtLjI4IDEuNTQgMCAxLjU0IDB6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik02Ljc0NiA0LjUxN2EuMzQuMzQgMCAwIDEgLjM2IDBsMSAuNTktNi4wOCAzLjU2YS43Ny43NyAwIDAgMC0uMzcuNjZ2LTEuMzlhLjcyLjcyIDAgMCAxIC4zOC0uNjR6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xNS4xNDYgMTEuNDM3di01YTIuODEgMi44MSAwIDAgMSAuODQtMmMwIDAgLjMzLS4xMS4zMS4yMXMwIDcuMzcgMCA3LjM3Yy0uMzEuMzctMS42MSAwLTEuNjEgMGEuODEuODEgMCAwIDAgLjQ2LS41OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE1Ljk3NiAxMi42MDdsLTQuNzQgMi44NWEuMzUuMzUgMCAwIDEtLjM3IDBsLTEtLjU3IDYuMTEtMy42N2EuNzcuNzcgMCAwIDAgLjM3LS42NnYxLjQ0Yy0uMDIuMjMtLjM3LjYxLS4zNy42MXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Bigtable');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud bigtable', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Bigtable', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1Njk3Nzg0NDIzODI4IiBoZWlnaHQ9IjIwLjAwOTI1NjM2MjkxNTA0IiB2aWV3Qm94PSItMC4wMDA0MjE5NjUxMTY0MDIxMzQzIDAuMDAwMDc0Njk5NTIxMDY0NzU4MyAxNy45NTY5Nzc4NDQyMzgyOCAyMC4wMDkyNTYzNjI5MTUwNCI+JiN4YTsJPHN0eWxlPiYjeGE7CQkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJCS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgZmlsbC1ydWxlPSJldmVub2RkIj4mI3hhOwkJPHBhdGggZD0iTTEzLjE5NiA0LjQ0N2wtNC4yMi0yLjUxYTIuODYgMi44NiAwIDAgMS0xLjI1LTEuNzFjMCAwIC4xNi0uMzIuMzgtLjJsNS4yNSAzLjFjLjYzLjM3LjI0IDIgLjI0IDJhLjc3Ljc3IDAgMCAwLS40LS42OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE0LjQ2NiAxMC42ODdhLjM1LjM1IDAgMCAxLS4xNi4zM2wtMSAuNjh2LTcuOTVjMC0uMjcuMTctLjU2LS4wNi0uN2wuOTIuNjhhLjczLjczIDAgMCAxIC4zNS42NXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDExLjU5N2EuMzYuMzYgMCAwIDEtLjItLjA2bC0zLjQ2LTIuMDZ2LjlsMy42NiAyLjE4LjI5LS41N3MtLjIyLS4zOS0uMjktLjM5em0uMiAxLjhhLjM2LjM2IDAgMCAxLS40IDBsLTMuNDYtMi4wNnYuNjZhLjQyLjQyIDAgMCAwIC4xOS4zNWwzLjI4IDJhLjM3LjM3IDAgMCAwIC4zOCAwIDIgMiAwIDAgMCAuMi0uNTJsLS4xOS0uMzl6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik04Ljk3NiAxMC43MjdsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzRsLTMuMjgtMmEuMzcuMzcgMCAwIDAtLjM4IDBsLTMuMjggMmEuNDEuNDEgMCAwIDAtLjE5LjM0di40M3oiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDkuODI3bC0zLjQ3LTIuMDVhLjQxLjQxIDAgMCAwLS4xOS4zNHYuNDNsMy42NiAyLjE4LjI4LS41NnoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPGcgY2xhc3M9InN0MiI+JiN4YTsJCQk8cGF0aCBkPSJNOC45NzYgMTEuNTk3djFsMy42Ni0yLjE4di0uOWwtMy40NiAyLjAyYS42NS42NSAwIDAgMS0uMi4wNnptLjIgMS44YS4zNi4zNiAwIDAgMS0uMi4wNnYuOWEuNS41IDAgMCAwIC4yMS0uMDVsMy4yOC0yYS4zOS4zOSAwIDAgMCAuMTktLjM1di0uNjZ6Ii8+JiN4YTsJCQk8cGF0aCBkPSJNMTIuNDQ2IDcuNzc3bC0zLjQ3IDIuMDV2LjlsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzR6Ii8+JiN4YTsJCTwvZz4mI3hhOwkJPHBhdGggZD0iTTQuNzU2IDE1LjUyN2w0LjE1IDIuNDdhMi43MiAyLjcyIDAgMCAxIDEuMjggMS44LjE4LjE4IDAgMCAxLS4yOC4xOGwtNS40NS0zLjIzYy0uNTMtLjMyLS4wNy0xLjg4LS4wNy0xLjg4YS43Ny43NyAwIDAgMCAuMzcuNjZ6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik0zLjQ4NiAxNS43Mjd2LTYuNTZhLjQxLjQxIDAgMCAxIC4xOS0uMzNsMS0uNTl2Ny45MWMwIC4yNyAwIC42OS4yMS44M2wtMS4wNi0uNjZhLjc1Ljc1IDAgMCAxLS4zNC0uNnoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTM2IDMuNDU3YS43NS43NSAwIDAgMC0uNzQgMGwtNC4yIDIuNTRhMi42MyAyLjYzIDAgMCAxLTIuMDguMjYuMjMuMjMgMCAwIDEgMC0uNGMuMTgtLjA5IDYuMzItMy43NCA2LjMyLTMuNzQuMjMtLjE0Ljc0IDEuMzkuNzQgMS4zOXoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTI2IDIuMDc3bDUuMzIgMy4xNWEuMzcuMzcgMCAwIDEgLjIuMzF2MS4xOGwtNi42Ny0zLjk2YS43NS43NSAwIDAgMC0uNzQgMGwxLjE4LS42OWEuNzEuNzEgMCAwIDEgLjczIDB6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xMC43OTYgMTYuNDg3YS43My43MyAwIDAgMCAuNzQgMGw0LjItMi40OWEyLjYzIDIuNjMgMCAwIDEgMi4xLS4yNS4yMS4yMSAwIDAgMSAwIC4zOGwtNi4zMyAzLjc1Yy0uMjIuMTQtLjc0LTEuNC0uNzQtMS40eiIgY2xhc3M9InN0MCIvPiYjeGE7CQk8cGF0aCBkPSJNNS40ODYgMTQuNzQ3YS41Ni41NiAwIDAgMS0uMTctLjMzdi0xLjE2bDYuNjYgMy45M2EuNjkuNjkgMCAwIDAgLjczIDBsLTEuMTguN2EuNy43IDAgMCAxLS43NCAweiIgY2xhc3M9InN0MSIvPiYjeGE7CQk8cGF0aCBkPSJNMy4yMzYgNy44MDdhLjc2Ljc2IDAgMCAwLS4zNy42NXY1YTIuNzUgMi43NSAwIDAgMS0uODcgMiAuMTguMTggMCAwIDEtLjMtLjEzdi03LjU2YzAtLjI4IDEuNTQgMCAxLjU0IDB6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik02Ljc0NiA0LjUxN2EuMzQuMzQgMCAwIDEgLjM2IDBsMSAuNTktNi4wOCAzLjU2YS43Ny43NyAwIDAgMC0uMzcuNjZ2LTEuMzlhLjcyLjcyIDAgMCAxIC4zOC0uNjR6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xNS4xNDYgMTEuNDM3di01YTIuODEgMi44MSAwIDAgMSAuODQtMmMwIDAgLjMzLS4xMS4zMS4yMXMwIDcuMzcgMCA3LjM3Yy0uMzEuMzctMS42MSAwLTEuNjEgMGEuODEuODEgMCAwIDAgLjQ2LS41OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE1Ljk3NiAxMi42MDdsLTQuNzQgMi44NWEuMzUuMzUgMCAwIDEtLjM3IDBsLTEtLjU3IDYuMTEtMy42N2EuNzcuNzcgMCAwIDAgLjM3LS42NnYxLjQ0Yy0uMDIuMjMtLjM3LjYxLS4zNy42MXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Bigtable');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud bigtable', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Bigtable', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1Njk3Nzg0NDIzODI4IiBoZWlnaHQ9IjIwLjAwOTI1NjM2MjkxNTA0IiB2aWV3Qm94PSItMC4wMDA0MjE5NjUxMTY0MDIxMzQzIDAuMDAwMDc0Njk5NTIxMDY0NzU4MyAxNy45NTY5Nzc4NDQyMzgyOCAyMC4wMDkyNTYzNjI5MTUwNCI+JiN4YTsJPHN0eWxlPiYjeGE7CQkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJCS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgZmlsbC1ydWxlPSJldmVub2RkIj4mI3hhOwkJPHBhdGggZD0iTTEzLjE5NiA0LjQ0N2wtNC4yMi0yLjUxYTIuODYgMi44NiAwIDAgMS0xLjI1LTEuNzFjMCAwIC4xNi0uMzIuMzgtLjJsNS4yNSAzLjFjLjYzLjM3LjI0IDIgLjI0IDJhLjc3Ljc3IDAgMCAwLS40LS42OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE0LjQ2NiAxMC42ODdhLjM1LjM1IDAgMCAxLS4xNi4zM2wtMSAuNjh2LTcuOTVjMC0uMjcuMTctLjU2LS4wNi0uN2wuOTIuNjhhLjczLjczIDAgMCAxIC4zNS42NXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDExLjU5N2EuMzYuMzYgMCAwIDEtLjItLjA2bC0zLjQ2LTIuMDZ2LjlsMy42NiAyLjE4LjI5LS41N3MtLjIyLS4zOS0uMjktLjM5em0uMiAxLjhhLjM2LjM2IDAgMCAxLS40IDBsLTMuNDYtMi4wNnYuNjZhLjQyLjQyIDAgMCAwIC4xOS4zNWwzLjI4IDJhLjM3LjM3IDAgMCAwIC4zOCAwIDIgMiAwIDAgMCAuMi0uNTJsLS4xOS0uMzl6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik04Ljk3NiAxMC43MjdsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzRsLTMuMjgtMmEuMzcuMzcgMCAwIDAtLjM4IDBsLTMuMjggMmEuNDEuNDEgMCAwIDAtLjE5LjM0di40M3oiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDkuODI3bC0zLjQ3LTIuMDVhLjQxLjQxIDAgMCAwLS4xOS4zNHYuNDNsMy42NiAyLjE4LjI4LS41NnoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPGcgY2xhc3M9InN0MiI+JiN4YTsJCQk8cGF0aCBkPSJNOC45NzYgMTEuNTk3djFsMy42Ni0yLjE4di0uOWwtMy40NiAyLjAyYS42NS42NSAwIDAgMS0uMi4wNnptLjIgMS44YS4zNi4zNiAwIDAgMS0uMi4wNnYuOWEuNS41IDAgMCAwIC4yMS0uMDVsMy4yOC0yYS4zOS4zOSAwIDAgMCAuMTktLjM1di0uNjZ6Ii8+JiN4YTsJCQk8cGF0aCBkPSJNMTIuNDQ2IDcuNzc3bC0zLjQ3IDIuMDV2LjlsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzR6Ii8+JiN4YTsJCTwvZz4mI3hhOwkJPHBhdGggZD0iTTQuNzU2IDE1LjUyN2w0LjE1IDIuNDdhMi43MiAyLjcyIDAgMCAxIDEuMjggMS44LjE4LjE4IDAgMCAxLS4yOC4xOGwtNS40NS0zLjIzYy0uNTMtLjMyLS4wNy0xLjg4LS4wNy0xLjg4YS43Ny43NyAwIDAgMCAuMzcuNjZ6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik0zLjQ4NiAxNS43Mjd2LTYuNTZhLjQxLjQxIDAgMCAxIC4xOS0uMzNsMS0uNTl2Ny45MWMwIC4yNyAwIC42OS4yMS44M2wtMS4wNi0uNjZhLjc1Ljc1IDAgMCAxLS4zNC0uNnoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTM2IDMuNDU3YS43NS43NSAwIDAgMC0uNzQgMGwtNC4yIDIuNTRhMi42MyAyLjYzIDAgMCAxLTIuMDguMjYuMjMuMjMgMCAwIDEgMC0uNGMuMTgtLjA5IDYuMzItMy43NCA2LjMyLTMuNzQuMjMtLjE0Ljc0IDEuMzkuNzQgMS4zOXoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTI2IDIuMDc3bDUuMzIgMy4xNWEuMzcuMzcgMCAwIDEgLjIuMzF2MS4xOGwtNi42Ny0zLjk2YS43NS43NSAwIDAgMC0uNzQgMGwxLjE4LS42OWEuNzEuNzEgMCAwIDEgLjczIDB6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xMC43OTYgMTYuNDg3YS43My43MyAwIDAgMCAuNzQgMGw0LjItMi40OWEyLjYzIDIuNjMgMCAwIDEgMi4xLS4yNS4yMS4yMSAwIDAgMSAwIC4zOGwtNi4zMyAzLjc1Yy0uMjIuMTQtLjc0LTEuNC0uNzQtMS40eiIgY2xhc3M9InN0MCIvPiYjeGE7CQk8cGF0aCBkPSJNNS40ODYgMTQuNzQ3YS41Ni41NiAwIDAgMS0uMTctLjMzdi0xLjE2bDYuNjYgMy45M2EuNjkuNjkgMCAwIDAgLjczIDBsLTEuMTguN2EuNy43IDAgMCAxLS43NCAweiIgY2xhc3M9InN0MSIvPiYjeGE7CQk8cGF0aCBkPSJNMy4yMzYgNy44MDdhLjc2Ljc2IDAgMCAwLS4zNy42NXY1YTIuNzUgMi43NSAwIDAgMS0uODcgMiAuMTguMTggMCAwIDEtLjMtLjEzdi03LjU2YzAtLjI4IDEuNTQgMCAxLjU0IDB6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik02Ljc0NiA0LjUxN2EuMzQuMzQgMCAwIDEgLjM2IDBsMSAuNTktNi4wOCAzLjU2YS43Ny43NyAwIDAgMC0uMzcuNjZ2LTEuMzlhLjcyLjcyIDAgMCAxIC4zOC0uNjR6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xNS4xNDYgMTEuNDM3di01YTIuODEgMi44MSAwIDAgMSAuODQtMmMwIDAgLjMzLS4xMS4zMS4yMXMwIDcuMzcgMCA3LjM3Yy0uMzEuMzctMS42MSAwLTEuNjEgMGEuODEuODEgMCAwIDAgLjQ2LS41OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE1Ljk3NiAxMi42MDdsLTQuNzQgMi44NWEuMzUuMzUgMCAwIDEtLjM3IDBsLTEtLjU3IDYuMTEtMy42N2EuNzcuNzcgMCAwIDAgLjM3LS42NnYxLjQ0Yy0uMDIuMjMtLjM3LjYxLS4zNy42MXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Bigtable');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud spanner', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nSpanner', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4LjQ1OTk5OTA4NDQ3MjY1NiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSIwIDAgMjAgMTguNDU5OTk5MDg0NDcyNjU2Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CQkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJCS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTguNjYgNS42M3Y0LjM2bC0zLjc3IDIuMTggMS4zNCAyLjMyTDEwIDEyLjMxbDMuNzcgMi4xOCAxLjM0LTIuMzItMy43Ny0yLjE4VjUuNjN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwIDUuNjN2NS4xMmwtNC40NCAyLjU4LjY3IDEuMTZMMTAgMTIuMzFsMy43NyAyLjE4IDEuMzQtMi4zMi0zLjc3LTIuMThWNS42M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNi42MiA0Ljk1TDEwIDYuNzhWMy42N2wtMS4zNS0uNjJWMEw2LjYyIDEuMjJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDYuNzhsMy4zOC0xLjgzVjEuMjJMMTEuMzUgMHYzLjA1TDEwIDMuNjd6bTYuMTQgNy41M2wtLjA4IDEuMzkgMi43IDEuNTMtMi4xOCAxLjItMy4yNC0xLjg3LjExLTMuODMgMy4yNy0yTDIwIDEyLjYxdjIuNDlsLTIuNjktMS41NXptLTEyLjI4IDBsLTEuMTctLjc2TDAgMTUuMXYtMi40OWwzLjIzLTEuODcgMy4yNyAyIC4xMSAzLjgzLTMuMTkgMS44OS0yLjE4LTEuMjMgMi43LTEuNTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE2LjcyIDEwLjc1bC0zLjI3IDIuMDEgMi42OSAxLjU1IDEuMTYtLjc2TDIwIDE1LjFsLS4wNS0yLjQ5ek0zLjg2IDE0LjMxbDIuNjktMS41NS0zLjI3LTIuMDEtMy4yMyAxLjg2TDAgMTUuMWwyLjctMS41NXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Spanner');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud spanner', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Spanner', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4LjQ1OTk5OTA4NDQ3MjY1NiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSIwIDAgMjAgMTguNDU5OTk5MDg0NDcyNjU2Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CQkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJCS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTguNjYgNS42M3Y0LjM2bC0zLjc3IDIuMTggMS4zNCAyLjMyTDEwIDEyLjMxbDMuNzcgMi4xOCAxLjM0LTIuMzItMy43Ny0yLjE4VjUuNjN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwIDUuNjN2NS4xMmwtNC40NCAyLjU4LjY3IDEuMTZMMTAgMTIuMzFsMy43NyAyLjE4IDEuMzQtMi4zMi0zLjc3LTIuMThWNS42M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNi42MiA0Ljk1TDEwIDYuNzhWMy42N2wtMS4zNS0uNjJWMEw2LjYyIDEuMjJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDYuNzhsMy4zOC0xLjgzVjEuMjJMMTEuMzUgMHYzLjA1TDEwIDMuNjd6bTYuMTQgNy41M2wtLjA4IDEuMzkgMi43IDEuNTMtMi4xOCAxLjItMy4yNC0xLjg3LjExLTMuODMgMy4yNy0yTDIwIDEyLjYxdjIuNDlsLTIuNjktMS41NXptLTEyLjI4IDBsLTEuMTctLjc2TDAgMTUuMXYtMi40OWwzLjIzLTEuODcgMy4yNyAyIC4xMSAzLjgzLTMuMTkgMS44OS0yLjE4LTEuMjMgMi43LTEuNTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE2LjcyIDEwLjc1bC0zLjI3IDIuMDEgMi42OSAxLjU1IDEuMTYtLjc2TDIwIDE1LjFsLS4wNS0yLjQ5ek0zLjg2IDE0LjMxbDIuNjktMS41NS0zLjI3LTIuMDEtMy4yMyAxLjg2TDAgMTUuMWwyLjctMS41NXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Spanner');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud spanner', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Spanner', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4LjQ1OTk5OTA4NDQ3MjY1NiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSIwIDAgMjAgMTguNDU5OTk5MDg0NDcyNjU2Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CQkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJCS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTguNjYgNS42M3Y0LjM2bC0zLjc3IDIuMTggMS4zNCAyLjMyTDEwIDEyLjMxbDMuNzcgMi4xOCAxLjM0LTIuMzItMy43Ny0yLjE4VjUuNjN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwIDUuNjN2NS4xMmwtNC40NCAyLjU4LjY3IDEuMTZMMTAgMTIuMzFsMy43NyAyLjE4IDEuMzQtMi4zMi0zLjc3LTIuMThWNS42M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNi42MiA0Ljk1TDEwIDYuNzhWMy42N2wtMS4zNS0uNjJWMEw2LjYyIDEuMjJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDYuNzhsMy4zOC0xLjgzVjEuMjJMMTEuMzUgMHYzLjA1TDEwIDMuNjd6bTYuMTQgNy41M2wtLjA4IDEuMzkgMi43IDEuNTMtMi4xOCAxLjItMy4yNC0xLjg3LjExLTMuODMgMy4yNy0yTDIwIDEyLjYxdjIuNDlsLTIuNjktMS41NXptLTEyLjI4IDBsLTEuMTctLjc2TDAgMTUuMXYtMi40OWwzLjIzLTEuODcgMy4yNyAyIC4xMSAzLjgzLTMuMTkgMS44OS0yLjE4LTEuMjMgMi43LTEuNTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE2LjcyIDEwLjc1bC0zLjI3IDIuMDEgMi42OSAxLjU1IDEuMTYtLjc2TDIwIDE1LjFsLS4wNS0yLjQ5ek0zLjg2IDE0LjMxbDIuNjktMS41NS0zLjI3LTIuMDEtMy4yMyAxLjg2TDAgMTUuMWwyLjctMS41NXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Spanner');
			})
		);

		fns.push(
			this.addEntry(dt + 'memorystore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Memorystore', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxLjk0aDMuMzN2Mi41OEgwem0wIDQuNTFoMy4zM3YyLjU4SDB6bTAgNC41MmgzLjMzdjIuNThIMHptMCA0LjUxaDMuMzN2Mi41OEgwek0xNi42NyAxLjk0SDIwdjIuNThoLTMuMzN6bTAgNC41MUgyMHYyLjU4aC0zLjMzem0wIDQuNTJIMjB2Mi41OGgtMy4zM3ptMCA0LjUxSDIwdjIuNThoLTMuMzN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE2LjY3IDEuOTRsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU4aC0yLjY2em0wIDQuNTJsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU5aC0yLjY2eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMuMzMgMjBoMTMuMzRWMEgzLjMzem02LTlINmw0LjY3LTcuNzRWOUgxNGwtNC42NyA3Ljc0eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0IDkuMDNoLTMuMzNWMGg2djIwSDkuMzN2LTMuMjN6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Memorystore');
			})
		);

		fns.push(
			this.addEntry(dt + 'memorystore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Memorystore', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxLjk0aDMuMzN2Mi41OEgwem0wIDQuNTFoMy4zM3YyLjU4SDB6bTAgNC41MmgzLjMzdjIuNThIMHptMCA0LjUxaDMuMzN2Mi41OEgwek0xNi42NyAxLjk0SDIwdjIuNThoLTMuMzN6bTAgNC41MUgyMHYyLjU4aC0zLjMzem0wIDQuNTJIMjB2Mi41OGgtMy4zM3ptMCA0LjUxSDIwdjIuNThoLTMuMzN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE2LjY3IDEuOTRsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU4aC0yLjY2em0wIDQuNTJsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU5aC0yLjY2eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMuMzMgMjBoMTMuMzRWMEgzLjMzem02LTlINmw0LjY3LTcuNzRWOUgxNGwtNC42NyA3Ljc0eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0IDkuMDNoLTMuMzNWMGg2djIwSDkuMzN2LTMuMjN6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Memorystore');
			})
		);

		fns.push(
			this.addEntry(dt + 'memorystore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Memorystore', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxLjk0aDMuMzN2Mi41OEgwem0wIDQuNTFoMy4zM3YyLjU4SDB6bTAgNC41MmgzLjMzdjIuNThIMHptMCA0LjUxaDMuMzN2Mi41OEgwek0xNi42NyAxLjk0SDIwdjIuNThoLTMuMzN6bTAgNC41MUgyMHYyLjU4aC0zLjMzem0wIDQuNTJIMjB2Mi41OGgtMy4zM3ptMCA0LjUxSDIwdjIuNThoLTMuMzN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE2LjY3IDEuOTRsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU4aC0yLjY2em0wIDQuNTJsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU5aC0yLjY2eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMuMzMgMjBoMTMuMzRWMEgzLjMzem02LTlINmw0LjY3LTcuNzRWOUgxNGwtNC42NyA3Ljc0eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0IDkuMDNoLTMuMzNWMGg2djIwSDkuMzN2LTMuMjN6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Memorystore');
			})
		);

		fns.push(
			this.addEntry(dt + 'firestore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Firestore', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyMy45MDU2MTAzOTg2NzUxNSIgaGVpZ2h0PSIzNzYuNDIyMjk0OTYzNjg0MDciIHZpZXdCb3g9Ii0wLjA5NzAwMDAwMjg2MTAyMjk1IDAuMjg3OTk5OTg3NjAyMjMzOSA4NS42OTk5OTY5NDgyNDIxOSA5OS41OTUwMDEyMjA3MDMxMiI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNLS4wOTcgNzUuODE1VjU1Ljg3NGw0Mi44NS0yMC4xODN2MTkuMDd6bTAtMzUuNDAzVjIwLjQ3MUw0Mi43NTMuMjg4djE5LjA3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04NS42MDMgNzUuODE1VjU1Ljg3NGwtNDIuODUtMjAuMTgzdjE5LjA3em0wLTM1LjQwM1YyMC40NzFMNDIuNzUzLjI4OHYxOS4wN3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDIuNzUzIDgwLjMxNGwxNi4yMTctNy41MjUgMjEuMDg0IDkuNzE3LTM3LjMwMSAxNy4zNzd6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Firestore');
			})
		);

		fns.push(
			this.addEntry(dt + 'firestore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Firestore', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyMy45MDU2MTAzOTg2NzUxNSIgaGVpZ2h0PSIzNzYuNDIyMjk0OTYzNjg0MDciIHZpZXdCb3g9Ii0wLjA5NzAwMDAwMjg2MTAyMjk1IDAuMjg3OTk5OTg3NjAyMjMzOSA4NS42OTk5OTY5NDgyNDIxOSA5OS41OTUwMDEyMjA3MDMxMiI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNLS4wOTcgNzUuODE1VjU1Ljg3NGw0Mi44NS0yMC4xODN2MTkuMDd6bTAtMzUuNDAzVjIwLjQ3MUw0Mi43NTMuMjg4djE5LjA3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04NS42MDMgNzUuODE1VjU1Ljg3NGwtNDIuODUtMjAuMTgzdjE5LjA3em0wLTM1LjQwM1YyMC40NzFMNDIuNzUzLjI4OHYxOS4wN3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDIuNzUzIDgwLjMxNGwxNi4yMTctNy41MjUgMjEuMDg0IDkuNzE3LTM3LjMwMSAxNy4zNzd6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Firestore');
			})
		);

		fns.push(
			this.addEntry(dt + 'firestore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Firestore', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyMy45MDU2MTAzOTg2NzUxNSIgaGVpZ2h0PSIzNzYuNDIyMjk0OTYzNjg0MDciIHZpZXdCb3g9Ii0wLjA5NzAwMDAwMjg2MTAyMjk1IDAuMjg3OTk5OTg3NjAyMjMzOSA4NS42OTk5OTY5NDgyNDIxOSA5OS41OTUwMDEyMjA3MDMxMiI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNLS4wOTcgNzUuODE1VjU1Ljg3NGw0Mi44NS0yMC4xODN2MTkuMDd6bTAtMzUuNDAzVjIwLjQ3MUw0Mi43NTMuMjg4djE5LjA3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04NS42MDMgNzUuODE1VjU1Ljg3NGwtNDIuODUtMjAuMTgzdjE5LjA3em0wLTM1LjQwM1YyMC40NzFMNDIuNzUzLjI4OHYxOS4wN3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDIuNzUzIDgwLjMxNGwxNi4yMTctNy41MjUgMjEuMDg0IDkuNzE3LTM3LjMwMSAxNy4zNzd6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Firestore');
			})
		);

		fns.push(
			this.addEntry(dt + 'datastore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Datastore', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIxIiB2aWV3Qm94PSIwIDAgMzAgMjEiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTAgMGwxLjUgMS41aDZMOSAweiIgY2xhc3M9InN0MiIvPiYjeGE7CTxwYXRoIGQ9Ik05IDlWMEw3LjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTAgOWwxLjUtMS41di02TDAgMHoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNOSA5TDcuNSA3LjVoLTZMMCA5eiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTAuNSAwTDEyIDEuNWg2TDE5LjUgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSA5VjBMMTggMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgOUwxMiA3LjV2LTZMMTAuNSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xOS41IDlMMTggNy41aC02TDEwLjUgOXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8cGF0aCBkPSJNMTIgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMjEgMGwxLjUgMS41aDZMMzAgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMzAgOVYwbC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDlsMS41LTEuNXYtNkwyMSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0zMCA5bC0xLjUtMS41aC02TDIxIDl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIyLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMCAxMmwxLjUgMS41aDZMOSAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMXYtOWwtMS41IDEuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0wIDIxbDEuNS0xLjV2LTZMMCAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMWwtMS41LTEuNWgtNkwwIDIxeiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMTMuNWg2djZoLTZ6IiBjbGFzcz0ic3QzIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgMTJsMS41IDEuNWg2bDEuNS0xLjV6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTE5LjUgMjF2LTlMMTggMTMuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xMC41IDIxbDEuNS0xLjV2LTZMMTAuNSAxMnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSAyMUwxOCAxOS41aC02TDEwLjUgMjF6IiBjbGFzcz0ic3QwIi8+JiN4YTsJPHBhdGggZD0iTTEyIDEzLjVoNnY2aC02em05LTEuNWwxLjUgMS41aDZMMzAgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxdi05bC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDIxbDEuNS0xLjV2LTZMMjEgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxbC0xLjUtMS41aC02TDIxIDIxeiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0yMi41IDEzLjVoNnY2aC02eiIgY2xhc3M9InN0MiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Datastore');
			})
		);

		fns.push(
			this.addEntry(dt + 'datastore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Datastore', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIxIiB2aWV3Qm94PSIwIDAgMzAgMjEiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTAgMGwxLjUgMS41aDZMOSAweiIgY2xhc3M9InN0MiIvPiYjeGE7CTxwYXRoIGQ9Ik05IDlWMEw3LjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTAgOWwxLjUtMS41di02TDAgMHoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNOSA5TDcuNSA3LjVoLTZMMCA5eiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTAuNSAwTDEyIDEuNWg2TDE5LjUgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSA5VjBMMTggMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgOUwxMiA3LjV2LTZMMTAuNSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xOS41IDlMMTggNy41aC02TDEwLjUgOXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8cGF0aCBkPSJNMTIgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMjEgMGwxLjUgMS41aDZMMzAgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMzAgOVYwbC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDlsMS41LTEuNXYtNkwyMSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0zMCA5bC0xLjUtMS41aC02TDIxIDl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIyLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMCAxMmwxLjUgMS41aDZMOSAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMXYtOWwtMS41IDEuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0wIDIxbDEuNS0xLjV2LTZMMCAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMWwtMS41LTEuNWgtNkwwIDIxeiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMTMuNWg2djZoLTZ6IiBjbGFzcz0ic3QzIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgMTJsMS41IDEuNWg2bDEuNS0xLjV6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTE5LjUgMjF2LTlMMTggMTMuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xMC41IDIxbDEuNS0xLjV2LTZMMTAuNSAxMnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSAyMUwxOCAxOS41aC02TDEwLjUgMjF6IiBjbGFzcz0ic3QwIi8+JiN4YTsJPHBhdGggZD0iTTEyIDEzLjVoNnY2aC02em05LTEuNWwxLjUgMS41aDZMMzAgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxdi05bC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDIxbDEuNS0xLjV2LTZMMjEgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxbC0xLjUtMS41aC02TDIxIDIxeiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0yMi41IDEzLjVoNnY2aC02eiIgY2xhc3M9InN0MiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Datastore');
			})
		);

		fns.push(
			this.addEntry(dt + 'datastore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Datastore', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIxIiB2aWV3Qm94PSIwIDAgMzAgMjEiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTAgMGwxLjUgMS41aDZMOSAweiIgY2xhc3M9InN0MiIvPiYjeGE7CTxwYXRoIGQ9Ik05IDlWMEw3LjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTAgOWwxLjUtMS41di02TDAgMHoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNOSA5TDcuNSA3LjVoLTZMMCA5eiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTAuNSAwTDEyIDEuNWg2TDE5LjUgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSA5VjBMMTggMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgOUwxMiA3LjV2LTZMMTAuNSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xOS41IDlMMTggNy41aC02TDEwLjUgOXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8cGF0aCBkPSJNMTIgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMjEgMGwxLjUgMS41aDZMMzAgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMzAgOVYwbC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDlsMS41LTEuNXYtNkwyMSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0zMCA5bC0xLjUtMS41aC02TDIxIDl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIyLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMCAxMmwxLjUgMS41aDZMOSAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMXYtOWwtMS41IDEuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0wIDIxbDEuNS0xLjV2LTZMMCAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMWwtMS41LTEuNWgtNkwwIDIxeiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMTMuNWg2djZoLTZ6IiBjbGFzcz0ic3QzIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgMTJsMS41IDEuNWg2bDEuNS0xLjV6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTE5LjUgMjF2LTlMMTggMTMuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xMC41IDIxbDEuNS0xLjV2LTZMMTAuNSAxMnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSAyMUwxOCAxOS41aC02TDEwLjUgMjF6IiBjbGFzcz0ic3QwIi8+JiN4YTsJPHBhdGggZD0iTTEyIDEzLjVoNnY2aC02em05LTEuNWwxLjUgMS41aDZMMzAgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxdi05bC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDIxbDEuNS0xLjV2LTZMMjEgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxbC0xLjUtMS41aC02TDIxIDIxeiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0yMi41IDEzLjVoNnY2aC02eiIgY2xhc3M9InN0MiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Datastore');
			})
		);

		this.addPalette('gcp2Databases', 'GCP / Databases', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2StoragePalette = function()
	{
		var dt = 'gcp google cloud platform storage ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'cloud storage', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nStorage', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMGgyMHY3SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE4IDBoMnY3aC0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOCA3bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAwaDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAzaDZ2MUg0eiIvPiYjeGE7CQk8cmVjdCB4PSIxMyIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEuNSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCA5aDIwdjdIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTggOWgydjdoLTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE4IDE2bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA5aDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAxMmg2djFINHoiLz4mI3hhOwkJPHJlY3QgeD0iMTMiIHk9IjExIiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiByeD0iMS41Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Storage');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud storage', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Storage', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMGgyMHY3SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE4IDBoMnY3aC0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOCA3bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAwaDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAzaDZ2MUg0eiIvPiYjeGE7CQk8cmVjdCB4PSIxMyIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEuNSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCA5aDIwdjdIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTggOWgydjdoLTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE4IDE2bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA5aDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAxMmg2djFINHoiLz4mI3hhOwkJPHJlY3QgeD0iMTMiIHk9IjExIiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiByeD0iMS41Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Storage');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud storage', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Storage', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMGgyMHY3SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE4IDBoMnY3aC0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOCA3bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAwaDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAzaDZ2MUg0eiIvPiYjeGE7CQk8cmVjdCB4PSIxMyIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEuNSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCA5aDIwdjdIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTggOWgydjdoLTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE4IDE2bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA5aDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAxMmg2djFINHoiLz4mI3hhOwkJPHJlY3QgeD0iMTMiIHk9IjExIiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiByeD0iMS41Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Storage');
			})
		);

		fns.push(
			this.addEntry(dt + 'persistent disk', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Persistent\nDisk', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE1Ljg0MDAwMDE1MjU4Nzg5IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTUuODQwMDAwMTUyNTg3ODkgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCAxNi4yNVYyMGgxNS44NHYtOC4zM2gtMy43NXY0LjU4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS44NCAzLjc1VjBIMHY4LjMzaDMuNzVWMy43NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxMC40MnYzLjc1aDEwVjkuNThoNS44NFY1LjgzaC0xMHY0LjU5eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Persistent Disk');
			})
		);

		fns.push(
			this.addEntry(dt + 'persistent disk', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Persistent Disk', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE1Ljg0MDAwMDE1MjU4Nzg5IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTUuODQwMDAwMTUyNTg3ODkgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCAxNi4yNVYyMGgxNS44NHYtOC4zM2gtMy43NXY0LjU4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS44NCAzLjc1VjBIMHY4LjMzaDMuNzVWMy43NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxMC40MnYzLjc1aDEwVjkuNThoNS44NFY1LjgzaC0xMHY0LjU5eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Persistent Disk');
			})
		);

		fns.push(
			this.addEntry(dt + 'persistent disk', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Persistent Disk', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE1Ljg0MDAwMDE1MjU4Nzg5IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTUuODQwMDAwMTUyNTg3ODkgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCAxNi4yNVYyMGgxNS44NHYtOC4zM2gtMy43NXY0LjU4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS44NCAzLjc1VjBIMHY4LjMzaDMuNzVWMy43NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxMC40MnYzLjc1aDEwVjkuNThoNS44NFY1LjgzaC0xMHY0LjU5eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Persistent Disk');
			})
		);

		fns.push(
			this.addEntry(dt + 'filestore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Filestore', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTIgMTBIOEw2IDhoOHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTYgMkg0bDEtMmgxMHptMyAzSDFsMS0yaDE2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNCA3bC0yIDNIOEw2IDdIMHY5aDIwVjd6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Filestore');
			})
		);

		fns.push(
			this.addEntry(dt + 'filestore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Filestore', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTIgMTBIOEw2IDhoOHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTYgMkg0bDEtMmgxMHptMyAzSDFsMS0yaDE2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNCA3bC0yIDNIOEw2IDdIMHY5aDIwVjd6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Filestore');
			})
		);

		fns.push(
			this.addEntry(dt + 'filestore', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Filestore', 
			    		new mxGeometry(0, 0, 30, 24), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTIgMTBIOEw2IDhoOHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTYgMkg0bDEtMmgxMHptMyAzSDFsMS0yaDE2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNCA3bC0yIDNIOEw2IDdIMHY5aDIwVjd6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 18);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Filestore');
			})
		);

		this.addPalette('gcp2Storage', 'GCP / Storage', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2ManagementToolsPalette = function()
	{
		var dt = 'gcp google cloud platform management tools ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'stackdriver', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Stackdriver', 
			    		new mxGeometry(0, 0, 30, 26), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQxNiIgaGVpZ2h0PSIzNjIuMjAwMDEyMjA3MDMxMjUiIHZpZXdCb3g9IjAgMCA0MTYgMzYyLjIwMDAxMjIwNzAzMTI1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTk2LjAzIDBMMCAxNjcuMTdoMTkwLjY3TDI4Ny45NCAweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yODcuNTkgMzYyLjJsLTk1LjY4LTE2Ny4xN0gwTDk1LjY4IDM2Mi4yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MTYgMTgxLjFMMzIwIDEzLjMxIDIyMy44OCAxODEuMSAzMjAgMzQ4Ljl6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 17);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Stackdriver');
			})
		);

		fns.push(
			this.addEntry(dt + 'stackdriver', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Stackdriver', 
			    		new mxGeometry(0, 0, 30, 26), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQxNiIgaGVpZ2h0PSIzNjIuMjAwMDEyMjA3MDMxMjUiIHZpZXdCb3g9IjAgMCA0MTYgMzYyLjIwMDAxMjIwNzAzMTI1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTk2LjAzIDBMMCAxNjcuMTdoMTkwLjY3TDI4Ny45NCAweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yODcuNTkgMzYyLjJsLTk1LjY4LTE2Ny4xN0gwTDk1LjY4IDM2Mi4yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MTYgMTgxLjFMMzIwIDEzLjMxIDIyMy44OCAxODEuMSAzMjAgMzQ4Ljl6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 17);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Stackdriver');
			})
		);

		fns.push(
			this.addEntry(dt + 'stackdriver', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Stackdriver', 
			    		new mxGeometry(0, 0, 30, 26), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQxNiIgaGVpZ2h0PSIzNjIuMjAwMDEyMjA3MDMxMjUiIHZpZXdCb3g9IjAgMCA0MTYgMzYyLjIwMDAxMjIwNzAzMTI1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTk2LjAzIDBMMCAxNjcuMTdoMTkwLjY3TDI4Ny45NCAweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yODcuNTkgMzYyLjJsLTk1LjY4LTE2Ny4xN0gwTDk1LjY4IDM2Mi4yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MTYgMTgxLjFMMzIwIDEzLjMxIDIyMy44OCAxODEuMSAzMjAgMzQ4Ljl6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 17);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Stackdriver');
			})
		);

		fns.push(
			this.addEntry(dt + 'debugger', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Debugger', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjEyMDAwMDgzOTIzMzQiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxNi4xMjAwMDA4MzkyMzM0IDIwIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEyLjEyIDJ2MmgydjJoMlYyek0wIDZoMi4xMlY0aDJWMmgtNHY0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNi4xMiA2VjJsLTIgMnYyem0tMiAzbC04IDExVjl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTYuMTIgOC4xMmw0IDIuODgtNCA1LjAzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMC4xMiAwdjExaC04eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4xMiAxNmgydi0yaDJ2NGgtNHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMi4xMiAxNnYtMmgtMnY0aDQuMTMtLjEzdi0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yLjEyIDE2di0yaC0ydjR6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Debugger');
			})
		);

		fns.push(
			this.addEntry(dt + 'debugger', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Debugger', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjEyMDAwMDgzOTIzMzQiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxNi4xMjAwMDA4MzkyMzM0IDIwIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEyLjEyIDJ2MmgydjJoMlYyek0wIDZoMi4xMlY0aDJWMmgtNHY0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNi4xMiA2VjJsLTIgMnYyem0tMiAzbC04IDExVjl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTYuMTIgOC4xMmw0IDIuODgtNCA1LjAzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMC4xMiAwdjExaC04eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4xMiAxNmgydi0yaDJ2NGgtNHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMi4xMiAxNnYtMmgtMnY0aDQuMTMtLjEzdi0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yLjEyIDE2di0yaC0ydjR6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Debugger');
			})
		);

		fns.push(
			this.addEntry(dt + 'debugger', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Debugger', 
			    		new mxGeometry(0, 0, 24, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjEyMDAwMDgzOTIzMzQiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxNi4xMjAwMDA4MzkyMzM0IDIwIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEyLjEyIDJ2MmgydjJoMlYyek0wIDZoMi4xMlY0aDJWMmgtNHY0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNi4xMiA2VjJsLTIgMnYyem0tMiAzbC04IDExVjl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTYuMTIgOC4xMmw0IDIuODgtNCA1LjAzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMC4xMiAwdjExaC04eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4xMiAxNmgydi0yaDJ2NGgtNHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMi4xMiAxNnYtMmgtMnY0aDQuMTMtLjEzdi0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yLjEyIDE2di0yaC0ydjR6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(18, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Debugger');
			})
		);

		fns.push(
			this.addEntry(dt + 'monitoring', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Monitoring', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUyOTk5OTczMjk3MTE5MSIgdmlld0JveD0iLTIuOTMyMDk3ODk3ODEyMDE0ZS05IC01LjI1ODAxNTA0MTgzNzk1NmUtMTUgMjAgMTMuNTI5OTk5NzMyOTcxMTkxIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC44MyAxMC41OGgyLjMzdjIuNjRIOC44M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuNDggOC42MWEuNTYuNTYgMCAwIDEtLjQtLjE3TDEyIDQuMjEgOS4yNiA3LjFhLjU3LjU3IDAgMCAxLS43Ni4wNUw2LjQyIDUuNDdsLTIuMiAyLjkyYS41Ni41NiAwIDAgMS0uNDUuMjJIMHYxLjcxYS43NS43NSAwIDAgMCAuNzQuNzVoMTguNTJhLjc1Ljc1IDAgMCAwIC43NC0uNzVWOC42MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy41IDcuNWwyLjM4LTMuMTZhLjU1LjU1IDAgMCAxIC4zNy0uMjIuNjMuNjMgMCAwIDEgLjQyLjEybDIuMTIgMS43MiAyLjgtMi45NGEuNTQuNTQgMCAwIDEgLjQtLjE3aDBhLjU0LjU0IDAgMCAxIC40LjE3bDQuMzMgNC40OEgyMFYuNzRhLjc0Ljc0IDAgMCAwLS43NC0uNzRILjc0QS43NC43NCAwIDAgMCAwIC43NHY2LjgxeiIvPiYjeGE7CTxyZWN0IGNsYXNzPSJzdDAiIHg9IjYuNjciIHk9IjEyLjkyIiB3aWR0aD0iNi42NyIgaGVpZ2h0PSIuNjEiIHJ4PSIuMyIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Monitoring');
			})
		);

		fns.push(
			this.addEntry(dt + 'monitoring', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Monitoring', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUyOTk5OTczMjk3MTE5MSIgdmlld0JveD0iLTIuOTMyMDk3ODk3ODEyMDE0ZS05IC01LjI1ODAxNTA0MTgzNzk1NmUtMTUgMjAgMTMuNTI5OTk5NzMyOTcxMTkxIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC44MyAxMC41OGgyLjMzdjIuNjRIOC44M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuNDggOC42MWEuNTYuNTYgMCAwIDEtLjQtLjE3TDEyIDQuMjEgOS4yNiA3LjFhLjU3LjU3IDAgMCAxLS43Ni4wNUw2LjQyIDUuNDdsLTIuMiAyLjkyYS41Ni41NiAwIDAgMS0uNDUuMjJIMHYxLjcxYS43NS43NSAwIDAgMCAuNzQuNzVoMTguNTJhLjc1Ljc1IDAgMCAwIC43NC0uNzVWOC42MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy41IDcuNWwyLjM4LTMuMTZhLjU1LjU1IDAgMCAxIC4zNy0uMjIuNjMuNjMgMCAwIDEgLjQyLjEybDIuMTIgMS43MiAyLjgtMi45NGEuNTQuNTQgMCAwIDEgLjQtLjE3aDBhLjU0LjU0IDAgMCAxIC40LjE3bDQuMzMgNC40OEgyMFYuNzRhLjc0Ljc0IDAgMCAwLS43NC0uNzRILjc0QS43NC43NCAwIDAgMCAwIC43NHY2LjgxeiIvPiYjeGE7CTxyZWN0IGNsYXNzPSJzdDAiIHg9IjYuNjciIHk9IjEyLjkyIiB3aWR0aD0iNi42NyIgaGVpZ2h0PSIuNjEiIHJ4PSIuMyIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Monitoring');
			})
		);

		fns.push(
			this.addEntry(dt + 'monitoring', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Monitoring', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUyOTk5OTczMjk3MTE5MSIgdmlld0JveD0iLTIuOTMyMDk3ODk3ODEyMDE0ZS05IC01LjI1ODAxNTA0MTgzNzk1NmUtMTUgMjAgMTMuNTI5OTk5NzMyOTcxMTkxIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC44MyAxMC41OGgyLjMzdjIuNjRIOC44M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuNDggOC42MWEuNTYuNTYgMCAwIDEtLjQtLjE3TDEyIDQuMjEgOS4yNiA3LjFhLjU3LjU3IDAgMCAxLS43Ni4wNUw2LjQyIDUuNDdsLTIuMiAyLjkyYS41Ni41NiAwIDAgMS0uNDUuMjJIMHYxLjcxYS43NS43NSAwIDAgMCAuNzQuNzVoMTguNTJhLjc1Ljc1IDAgMCAwIC43NC0uNzVWOC42MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy41IDcuNWwyLjM4LTMuMTZhLjU1LjU1IDAgMCAxIC4zNy0uMjIuNjMuNjMgMCAwIDEgLjQyLjEybDIuMTIgMS43MiAyLjgtMi45NGEuNTQuNTQgMCAwIDEgLjQtLjE3aDBhLjU0LjU0IDAgMCAxIC40LjE3bDQuMzMgNC40OEgyMFYuNzRhLjc0Ljc0IDAgMCAwLS43NC0uNzRILjc0QS43NC43NCAwIDAgMCAwIC43NHY2LjgxeiIvPiYjeGE7CTxyZWN0IGNsYXNzPSJzdDAiIHg9IjYuNjciIHk9IjEyLjkyIiB3aWR0aD0iNi42NyIgaGVpZ2h0PSIuNjEiIHJ4PSIuMyIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Monitoring');
			})
		);

		fns.push(
			this.addEntry(dt + 'deployment manager', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Deployment\nManager', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUyOTk5OTczMjk3MTE5MSIgdmlld0JveD0iLTIuOTMyMDk3ODk3ODEyMDE0ZS05IC01LjI1ODAxNTA0MTgzNzk1NmUtMTUgMjAgMTMuNTI5OTk5NzMyOTcxMTkxIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC44MyAxMC41OGgyLjMzdjIuNjRIOC44M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuNDggOC42MWEuNTYuNTYgMCAwIDEtLjQtLjE3TDEyIDQuMjEgOS4yNiA3LjFhLjU3LjU3IDAgMCAxLS43Ni4wNUw2LjQyIDUuNDdsLTIuMiAyLjkyYS41Ni41NiAwIDAgMS0uNDUuMjJIMHYxLjcxYS43NS43NSAwIDAgMCAuNzQuNzVoMTguNTJhLjc1Ljc1IDAgMCAwIC43NC0uNzVWOC42MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy41IDcuNWwyLjM4LTMuMTZhLjU1LjU1IDAgMCAxIC4zNy0uMjIuNjMuNjMgMCAwIDEgLjQyLjEybDIuMTIgMS43MiAyLjgtMi45NGEuNTQuNTQgMCAwIDEgLjQtLjE3aDBhLjU0LjU0IDAgMCAxIC40LjE3bDQuMzMgNC40OEgyMFYuNzRhLjc0Ljc0IDAgMCAwLS43NC0uNzRILjc0QS43NC43NCAwIDAgMCAwIC43NHY2LjgxeiIvPiYjeGE7CTxyZWN0IGNsYXNzPSJzdDAiIHg9IjYuNjciIHk9IjEyLjkyIiB3aWR0aD0iNi42NyIgaGVpZ2h0PSIuNjEiIHJ4PSIuMyIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Deployment Manager');
			})
		);

		fns.push(
			this.addEntry(dt + 'deployment manager', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 190, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Deployment Manager', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUyOTk5OTczMjk3MTE5MSIgdmlld0JveD0iLTIuOTMyMDk3ODk3ODEyMDE0ZS05IC01LjI1ODAxNTA0MTgzNzk1NmUtMTUgMjAgMTMuNTI5OTk5NzMyOTcxMTkxIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC44MyAxMC41OGgyLjMzdjIuNjRIOC44M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuNDggOC42MWEuNTYuNTYgMCAwIDEtLjQtLjE3TDEyIDQuMjEgOS4yNiA3LjFhLjU3LjU3IDAgMCAxLS43Ni4wNUw2LjQyIDUuNDdsLTIuMiAyLjkyYS41Ni41NiAwIDAgMS0uNDUuMjJIMHYxLjcxYS43NS43NSAwIDAgMCAuNzQuNzVoMTguNTJhLjc1Ljc1IDAgMCAwIC43NC0uNzVWOC42MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy41IDcuNWwyLjM4LTMuMTZhLjU1LjU1IDAgMCAxIC4zNy0uMjIuNjMuNjMgMCAwIDEgLjQyLjEybDIuMTIgMS43MiAyLjgtMi45NGEuNTQuNTQgMCAwIDEgLjQtLjE3aDBhLjU0LjU0IDAgMCAxIC40LjE3bDQuMzMgNC40OEgyMFYuNzRhLjc0Ljc0IDAgMCAwLS43NC0uNzRILjc0QS43NC43NCAwIDAgMCAwIC43NHY2LjgxeiIvPiYjeGE7CTxyZWN0IGNsYXNzPSJzdDAiIHg9IjYuNjciIHk9IjEyLjkyIiB3aWR0aD0iNi42NyIgaGVpZ2h0PSIuNjEiIHJ4PSIuMyIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Deployment Manager');
			})
		);

		fns.push(
			this.addEntry(dt + 'deployment manager', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 198, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Deployment Manager', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUyOTk5OTczMjk3MTE5MSIgdmlld0JveD0iLTIuOTMyMDk3ODk3ODEyMDE0ZS05IC01LjI1ODAxNTA0MTgzNzk1NmUtMTUgMjAgMTMuNTI5OTk5NzMyOTcxMTkxIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC44MyAxMC41OGgyLjMzdjIuNjRIOC44M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuNDggOC42MWEuNTYuNTYgMCAwIDEtLjQtLjE3TDEyIDQuMjEgOS4yNiA3LjFhLjU3LjU3IDAgMCAxLS43Ni4wNUw2LjQyIDUuNDdsLTIuMiAyLjkyYS41Ni41NiAwIDAgMS0uNDUuMjJIMHYxLjcxYS43NS43NSAwIDAgMCAuNzQuNzVoMTguNTJhLjc1Ljc1IDAgMCAwIC43NC0uNzVWOC42MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy41IDcuNWwyLjM4LTMuMTZhLjU1LjU1IDAgMCAxIC4zNy0uMjIuNjMuNjMgMCAwIDEgLjQyLjEybDIuMTIgMS43MiAyLjgtMi45NGEuNTQuNTQgMCAwIDEgLjQtLjE3aDBhLjU0LjU0IDAgMCAxIC40LjE3bDQuMzMgNC40OEgyMFYuNzRhLjc0Ljc0IDAgMCAwLS43NC0uNzRILjc0QS43NC43NCAwIDAgMCAwIC43NHY2LjgxeiIvPiYjeGE7CTxyZWN0IGNsYXNzPSJzdDAiIHg9IjYuNjciIHk9IjEyLjkyIiB3aWR0aD0iNi42NyIgaGVpZ2h0PSIuNjEiIHJ4PSIuMyIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Deployment Manager');
			})
		);

		fns.push(
			this.addEntry(dt + 'logging', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Logging', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5IiB2aWV3Qm94PSIwIDAgMjAgMTkiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTQgOWg0djJINHptLTIgN2g2djJIMnoiLz4mI3hhOwkJPHBhdGggZD0iTTQgNEgydjEyaDJ6Ii8+JiN4YTsJPC9nPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMCAxSDd2NGgxM3ptMCA3SDd2NGgxM3ptMCA3SDd2NGgxM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNiAwSDB2Nmg2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Logging');
			})
		);

		fns.push(
			this.addEntry(dt + 'logging', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Logging', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5IiB2aWV3Qm94PSIwIDAgMjAgMTkiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTQgOWg0djJINHptLTIgN2g2djJIMnoiLz4mI3hhOwkJPHBhdGggZD0iTTQgNEgydjEyaDJ6Ii8+JiN4YTsJPC9nPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMCAxSDd2NGgxM3ptMCA3SDd2NGgxM3ptMCA3SDd2NGgxM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNiAwSDB2Nmg2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Logging');
			})
		);

		fns.push(
			this.addEntry(dt + 'logging', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 128, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Logging', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5IiB2aWV3Qm94PSIwIDAgMjAgMTkiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTQgOWg0djJINHptLTIgN2g2djJIMnoiLz4mI3hhOwkJPHBhdGggZD0iTTQgNEgydjEyaDJ6Ii8+JiN4YTsJPC9nPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMCAxSDd2NGgxM3ptMCA3SDd2NGgxM3ptMCA3SDd2NGgxM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNiAwSDB2Nmg2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Logging');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud console', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nConsole', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Console');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud console', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Console', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Console');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud console', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Console', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Console');
			})
		);

		fns.push(
			this.addEntry(dt + 'error reporting', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Error\nReporting', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0wIDE1bDUgNWg1bC0yLjUtMi44Nkg2LjI1bC0zLjM5LTMuMzl2LTcuNWwzLjM5LTMuMzlINy41TDEwIDBINUwwIDV6TTEzLjc1IDIuODZsMy4zOSAzLjM5djcuNWwtMy4zOSAzLjM5SDEwTDEyLjUgMjBIMTVsNS01VjVsLTUtNWgtMi41TDEwIDIuODZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBMNy41IDcuNSAxMCA1SDcuNUw1IDcuNXY1TDcuNSAxNUgxMGwtMi41LTIuNXptMi41IDBMMTAgMTIuNWwyLjUgMi41IDIuNS0yLjV2LTVMMTIuNSA1IDEwIDcuNXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Error Reporting');
			})
		);

		fns.push(
			this.addEntry(dt + 'error reporting', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Error Reporting', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0wIDE1bDUgNWg1bC0yLjUtMi44Nkg2LjI1bC0zLjM5LTMuMzl2LTcuNWwzLjM5LTMuMzlINy41TDEwIDBINUwwIDV6TTEzLjc1IDIuODZsMy4zOSAzLjM5djcuNWwtMy4zOSAzLjM5SDEwTDEyLjUgMjBIMTVsNS01VjVsLTUtNWgtMi41TDEwIDIuODZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBMNy41IDcuNSAxMCA1SDcuNUw1IDcuNXY1TDcuNSAxNUgxMGwtMi41LTIuNXptMi41IDBMMTAgMTIuNWwyLjUgMi41IDIuNS0yLjV2LTVMMTIuNSA1IDEwIDcuNXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Error Reporting');
			})
		);

		fns.push(
			this.addEntry(dt + 'error reporting', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 168, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Error Reporting', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0wIDE1bDUgNWg1bC0yLjUtMi44Nkg2LjI1bC0zLjM5LTMuMzl2LTcuNWwzLjM5LTMuMzlINy41TDEwIDBINUwwIDV6TTEzLjc1IDIuODZsMy4zOSAzLjM5djcuNWwtMy4zOSAzLjM5SDEwTDEyLjUgMjBIMTVsNS01VjVsLTUtNWgtMi41TDEwIDIuODZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBMNy41IDcuNSAxMCA1SDcuNUw1IDcuNXY1TDcuNSAxNUgxMGwtMi41LTIuNXptMi41IDBMMTAgMTIuNWwyLjUgMi41IDIuNS0yLjV2LTVMMTIuNSA1IDEwIDcuNXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Error Reporting');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud shell', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nShell', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Shell');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud shell', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Shell', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Shell');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud shell', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Shell', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Shell');
			})
		);

		fns.push(
			this.addEntry(dt + 'trace', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Trace', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA4SDEwdjRoMTB6bTAgOEgxMHY0aDEweiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCAxNkg2djRoNHpNMCAwaDZ2NEgwem0wIDhoMTB2NEgweiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Trace');
			})
		);

		fns.push(
			this.addEntry(dt + 'trace', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Trace', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA4SDEwdjRoMTB6bTAgOEgxMHY0aDEweiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCAxNkg2djRoNHpNMCAwaDZ2NEgwem0wIDhoMTB2NEgweiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Trace');
			})
		);

		fns.push(
			this.addEntry(dt + 'trace', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 118, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Trace', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA4SDEwdjRoMTB6bTAgOEgxMHY0aDEweiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCAxNkg2djRoNHpNMCAwaDZ2NEgwem0wIDhoMTB2NEgweiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Trace');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud mobile app', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nMobile App', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Mobile App');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud mobile app', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Mobile App', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Mobile App');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud mobile app', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 178, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Mobile App', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Mobile App');
			})
		);

		fns.push(
			this.addEntry(dt + 'profiler', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Profiler', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMxNC44ODMzMTI4NTM1OTA3IiBoZWlnaHQ9IjM3Ny4zNTIwNjc2NDgzMTU0IiB2aWV3Qm94PSItMC41MDE5OTg5MDEzNjcxODc1IDAuMDEzMDAwMDAwMjY4MjIwOTAxIDgzLjMxMjk5NTkxMDY0NDUzIDk5Ljg0MTAwMzQxNzk2ODc1Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOzwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5LjQ5OSAzOS42NzJ2MjAuMDI5TDIyLjk3MyA3MS42N2EyMC4yNCAyMC4yNCAwIDAgMCAzMC43ODIgMi41NTQgMjAuMjQgMjAuMjQgMCAwIDAgNS45MjgtMTQuMzEyYzAtMTEuMTU3LTkuMDI4LTIwLjIwOS0yMC4xODUtMjAuMjR6bS0xLjMwNC4wMzlsLS4wNDkuMDAzLjA0OS0uMDAzem0tLjk2LjA4OWEyMC4yNCAyMC4yNCAwIDAgMC0xNy41MyAxNS42NzNjMS45MzgtOC4zMDYgOS4xNjMtMTQuNjg0IDE3LjUzLTE1LjY3M3pNMTkuNjEyIDU1Ljg5MmwtLjA3Mi4zNTcuMDcyLS4zNTd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM5LjQ5OSA1OS43MDFMMjIuOTY2IDcxLjY3NmEyMC4xNSAyMC4xNSAwIDAgMS0zLjc3Mi0xMS43N2MwLTExLjE3OSA5LjUzOC0yMC4yNDEgMjAuMzA0LTIwLjI0MXptMzUuNTE1LTQ0LjY2NUw2Mi42MzIgMjcuNDc2Yy02LjU0OC00LjY5OS0xNC41NjQtNy40NzItMjMuMjA4LTcuNDcyLTIxLjk5MSAwLTM5LjkyNiAxNy45MzUtMzkuOTI2IDM5LjkyNnMxNy45MzUgMzkuOTI0IDM5LjkyNiAzOS45MjRTNzkuMzQ4IDgxLjkyIDc5LjM0OCA1OS45MjljMC05LjM5NC0zLjI3NC0xOC4wNDYtOC43MzctMjQuODc4bDEyLjItMTIuMjU0em0tMzUuNTkgMTQuOTY3YTI5Ljg1IDI5Ljg1IDAgMCAxIDI5LjkyNCAyOS45MjYgMjkuODUgMjkuODUgMCAwIDEtMjkuOTI0IDI5LjkyNEEyOS44NSAyOS44NSAwIDAgMSA5LjQ5OCA1OS45MjljMC0xNi41ODYgMTMuMzM5LTI5LjkyNiAyOS45MjYtMjkuOTI2ek02MC4xODUuMDEzTDE5LjU3Mi4wOGwuMDE2IDkuNSA0MC42MTMtLjA2NnoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Profiler');
			})
		);

		fns.push(
			this.addEntry(dt + 'profiler', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Profiler', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMxNC44ODMzMTI4NTM1OTA3IiBoZWlnaHQ9IjM3Ny4zNTIwNjc2NDgzMTU0IiB2aWV3Qm94PSItMC41MDE5OTg5MDEzNjcxODc1IDAuMDEzMDAwMDAwMjY4MjIwOTAxIDgzLjMxMjk5NTkxMDY0NDUzIDk5Ljg0MTAwMzQxNzk2ODc1Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOzwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5LjQ5OSAzOS42NzJ2MjAuMDI5TDIyLjk3MyA3MS42N2EyMC4yNCAyMC4yNCAwIDAgMCAzMC43ODIgMi41NTQgMjAuMjQgMjAuMjQgMCAwIDAgNS45MjgtMTQuMzEyYzAtMTEuMTU3LTkuMDI4LTIwLjIwOS0yMC4xODUtMjAuMjR6bS0xLjMwNC4wMzlsLS4wNDkuMDAzLjA0OS0uMDAzem0tLjk2LjA4OWEyMC4yNCAyMC4yNCAwIDAgMC0xNy41MyAxNS42NzNjMS45MzgtOC4zMDYgOS4xNjMtMTQuNjg0IDE3LjUzLTE1LjY3M3pNMTkuNjEyIDU1Ljg5MmwtLjA3Mi4zNTcuMDcyLS4zNTd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM5LjQ5OSA1OS43MDFMMjIuOTY2IDcxLjY3NmEyMC4xNSAyMC4xNSAwIDAgMS0zLjc3Mi0xMS43N2MwLTExLjE3OSA5LjUzOC0yMC4yNDEgMjAuMzA0LTIwLjI0MXptMzUuNTE1LTQ0LjY2NUw2Mi42MzIgMjcuNDc2Yy02LjU0OC00LjY5OS0xNC41NjQtNy40NzItMjMuMjA4LTcuNDcyLTIxLjk5MSAwLTM5LjkyNiAxNy45MzUtMzkuOTI2IDM5LjkyNnMxNy45MzUgMzkuOTI0IDM5LjkyNiAzOS45MjRTNzkuMzQ4IDgxLjkyIDc5LjM0OCA1OS45MjljMC05LjM5NC0zLjI3NC0xOC4wNDYtOC43MzctMjQuODc4bDEyLjItMTIuMjU0em0tMzUuNTkgMTQuOTY3YTI5Ljg1IDI5Ljg1IDAgMCAxIDI5LjkyNCAyOS45MjYgMjkuODUgMjkuODUgMCAwIDEtMjkuOTI0IDI5LjkyNEEyOS44NSAyOS44NSAwIDAgMSA5LjQ5OCA1OS45MjljMC0xNi41ODYgMTMuMzM5LTI5LjkyNiAyOS45MjYtMjkuOTI2ek02MC4xODUuMDEzTDE5LjU3Mi4wOGwuMDE2IDkuNSA0MC42MTMtLjA2NnoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Profiler');
			})
		);

		fns.push(
			this.addEntry(dt + 'profiler', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 178, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Profiler', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMxNC44ODMzMTI4NTM1OTA3IiBoZWlnaHQ9IjM3Ny4zNTIwNjc2NDgzMTU0IiB2aWV3Qm94PSItMC41MDE5OTg5MDEzNjcxODc1IDAuMDEzMDAwMDAwMjY4MjIwOTAxIDgzLjMxMjk5NTkxMDY0NDUzIDk5Ljg0MTAwMzQxNzk2ODc1Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOzwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5LjQ5OSAzOS42NzJ2MjAuMDI5TDIyLjk3MyA3MS42N2EyMC4yNCAyMC4yNCAwIDAgMCAzMC43ODIgMi41NTQgMjAuMjQgMjAuMjQgMCAwIDAgNS45MjgtMTQuMzEyYzAtMTEuMTU3LTkuMDI4LTIwLjIwOS0yMC4xODUtMjAuMjR6bS0xLjMwNC4wMzlsLS4wNDkuMDAzLjA0OS0uMDAzem0tLjk2LjA4OWEyMC4yNCAyMC4yNCAwIDAgMC0xNy41MyAxNS42NzNjMS45MzgtOC4zMDYgOS4xNjMtMTQuNjg0IDE3LjUzLTE1LjY3M3pNMTkuNjEyIDU1Ljg5MmwtLjA3Mi4zNTcuMDcyLS4zNTd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM5LjQ5OSA1OS43MDFMMjIuOTY2IDcxLjY3NmEyMC4xNSAyMC4xNSAwIDAgMS0zLjc3Mi0xMS43N2MwLTExLjE3OSA5LjUzOC0yMC4yNDEgMjAuMzA0LTIwLjI0MXptMzUuNTE1LTQ0LjY2NUw2Mi42MzIgMjcuNDc2Yy02LjU0OC00LjY5OS0xNC41NjQtNy40NzItMjMuMjA4LTcuNDcyLTIxLjk5MSAwLTM5LjkyNiAxNy45MzUtMzkuOTI2IDM5LjkyNnMxNy45MzUgMzkuOTI0IDM5LjkyNiAzOS45MjRTNzkuMzQ4IDgxLjkyIDc5LjM0OCA1OS45MjljMC05LjM5NC0zLjI3NC0xOC4wNDYtOC43MzctMjQuODc4bDEyLjItMTIuMjU0em0tMzUuNTkgMTQuOTY3YTI5Ljg1IDI5Ljg1IDAgMCAxIDI5LjkyNCAyOS45MjYgMjkuODUgMjkuODUgMCAwIDEtMjkuOTI0IDI5LjkyNEEyOS44NSAyOS44NSAwIDAgMSA5LjQ5OCA1OS45MjljMC0xNi41ODYgMTMuMzM5LTI5LjkyNiAyOS45MjYtMjkuOTI2ek02MC4xODUuMDEzTDE5LjU3Mi4wOGwuMDE2IDkuNSA0MC42MTMtLjA2NnoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Profiler');
			})
		);

		fns.push(
			this.addEntry(dt + 'billing api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Billing\nAPI', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Billing API');
			})
		);

		fns.push(
			this.addEntry(dt + 'billing api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Billing API', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Billing API');
			})
		);

		fns.push(
			this.addEntry(dt + 'billing api application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Billing API', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Billing API');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud api apis application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nAPI', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTQuNDkgMTBMMTAgMTQuNDkgNS41MSAxMCAxMCA1LjUxek0xMCAxMi45MUwxMi45MSAxMCAxMCA3LjA5IDcuMDkgMTB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwIDEwaC0yLjY1bC0zLjAyIDMuMDJoMi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjAgMTBsLTMuMDItMy4wMmgtMi42NUwxNy4zNSAxMHpNMCAxMGgyLjY1bDMuMDItMy4wMkgzLjAyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LjY3IDEzLjAyTDIuNjUgMTBIMGwzLjAyIDMuMDJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEwIDIuNjVWMEw2Ljk4IDMuMDJ2Mi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMDIgNS42N1YzLjAyTDEwIDB2Mi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTAgMjB2LTIuNjVsLTMuMDItMy4wMnYyLjY1eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy4wMiAxNi45OHYtMi42NUwxMCAxNy4zNVYyMHoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud API');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud api apis application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud API', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTQuNDkgMTBMMTAgMTQuNDkgNS41MSAxMCAxMCA1LjUxek0xMCAxMi45MUwxMi45MSAxMCAxMCA3LjA5IDcuMDkgMTB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwIDEwaC0yLjY1bC0zLjAyIDMuMDJoMi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjAgMTBsLTMuMDItMy4wMmgtMi42NUwxNy4zNSAxMHpNMCAxMGgyLjY1bDMuMDItMy4wMkgzLjAyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LjY3IDEzLjAyTDIuNjUgMTBIMGwzLjAyIDMuMDJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEwIDIuNjVWMEw2Ljk4IDMuMDJ2Mi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMDIgNS42N1YzLjAyTDEwIDB2Mi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTAgMjB2LTIuNjVsLTMuMDItMy4wMnYyLjY1eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy4wMiAxNi45OHYtMi42NUwxMCAxNy4zNVYyMHoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud API');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud api apis application programming interface', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud API', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTQuNDkgMTBMMTAgMTQuNDkgNS41MSAxMCAxMCA1LjUxek0xMCAxMi45MUwxMi45MSAxMCAxMCA3LjA5IDcuMDkgMTB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwIDEwaC0yLjY1bC0zLjAyIDMuMDJoMi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjAgMTBsLTMuMDItMy4wMmgtMi42NUwxNy4zNSAxMHpNMCAxMGgyLjY1bDMuMDItMy4wMkgzLjAyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LjY3IDEzLjAyTDIuNjUgMTBIMGwzLjAyIDMuMDJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEwIDIuNjVWMEw2Ljk4IDMuMDJ2Mi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMDIgNS42N1YzLjAyTDEwIDB2Mi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTAgMjB2LTIuNjVsLTMuMDItMy4wMnYyLjY1eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy4wMiAxNi45OHYtMi42NUwxMCAxNy4zNVYyMHoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud API');
			})
		);

		this.addPalette('gcp2Management Tools', 'GCP / Management Tools', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2NetworkingPalette = function()
	{
		var dt = 'gcp google cloud platform networking ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'virtual private cloud', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Virtual\nPrivate Cloud', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTQgMGg2djZoLTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDBoM3Y2aC0zeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCAxNGg2djZoLTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDE0aDN2NmgtM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCAwaDZ2NkgweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zIDBoM3Y2SDN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMTRoNnY2SDB6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0zIDE0aDN2Nkgzek02IDJoOHYySDZ6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik02IDE2aDh2Mkg2ek0xNiA2aDJ2OGgtMnpNMiA2aDJ2OEgyeiIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMiA2aDJ2Mkgyem0xNCAwaDJ2MmgtMnpNNiAyaDJ2Mkg2em0wIDE0aDJ2Mkg2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Virtual Private Cloud');
			})
		);

		fns.push(
			this.addEntry(dt + 'virtual private cloud', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 180, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Virtual Private Cloud', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTQgMGg2djZoLTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDBoM3Y2aC0zeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCAxNGg2djZoLTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDE0aDN2NmgtM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCAwaDZ2NkgweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zIDBoM3Y2SDN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMTRoNnY2SDB6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0zIDE0aDN2Nkgzek02IDJoOHYySDZ6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik02IDE2aDh2Mkg2ek0xNiA2aDJ2OGgtMnpNMiA2aDJ2OEgyeiIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMiA2aDJ2Mkgyem0xNCAwaDJ2MmgtMnpNNiAyaDJ2Mkg2em0wIDE0aDJ2Mkg2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Virtual Private Cloud');
			})
		);

		fns.push(
			this.addEntry(dt + 'virtual private cloud', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 188, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Virtual Private Cloud', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTQgMGg2djZoLTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDBoM3Y2aC0zeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCAxNGg2djZoLTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDE0aDN2NmgtM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCAwaDZ2NkgweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zIDBoM3Y2SDN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMTRoNnY2SDB6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0zIDE0aDN2Nkgzek02IDJoOHYySDZ6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik02IDE2aDh2Mkg2ek0xNiA2aDJ2OGgtMnpNMiA2aDJ2OEgyeiIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMiA2aDJ2Mkgyem0xNCAwaDJ2MmgtMnpNNiAyaDJ2Mkg2em0wIDE0aDJ2Mkg2eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Virtual Private Cloud');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud interconnect', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nInterconnect', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxOCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00IDhIMHYyaDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMgNGgxMHYxMEgzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA4aC00LjY3djJIMjB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE1IDJ2MTRINnYyaDExdi0yVjIgMEg2djJ6TTggNGg1djEwSDh6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Interconnect');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud interconnect', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 180, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Interconnect', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxOCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00IDhIMHYyaDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMgNGgxMHYxMEgzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA4aC00LjY3djJIMjB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE1IDJ2MTRINnYyaDExdi0yVjIgMEg2djJ6TTggNGg1djEwSDh6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Interconnect');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud interconnect', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 188, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Interconnect', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxOCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00IDhIMHYyaDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMgNGgxMHYxMEgzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA4aC00LjY3djJIMjB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE1IDJ2MTRINnYyaDExdi0yVjIgMEg2djJ6TTggNGg1djEwSDh6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Interconnect');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud load balancing', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Load\nBalancing', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYgMTBoMnY0aC0yem0tNyAwaDJ2NEg5em0tNyAwaDJ2NEgyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05IDVoMnY0SDl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIgOWgxNnYySDJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTQgMGgxMnY1SDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDBoNnY1aC02eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCAxNGg2djZoLTZ6TTAgMTRoNnY2SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMgMTRoM3Y2SDN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTcgMTRoNnY2SDd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDE0aDN2NmgtM3ptNyAwaDN2NmgtM3oiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Load Balancing');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud load balancing', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 190, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Load Balancing', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYgMTBoMnY0aC0yem0tNyAwaDJ2NEg5em0tNyAwaDJ2NEgyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05IDVoMnY0SDl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIgOWgxNnYySDJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTQgMGgxMnY1SDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDBoNnY1aC02eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCAxNGg2djZoLTZ6TTAgMTRoNnY2SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMgMTRoM3Y2SDN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTcgMTRoNnY2SDd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDE0aDN2NmgtM3ptNyAwaDN2NmgtM3oiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Load Balancing');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud load balancing', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 198, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Load Balancing', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYgMTBoMnY0aC0yem0tNyAwaDJ2NEg5em0tNyAwaDJ2NEgyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05IDVoMnY0SDl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIgOWgxNnYySDJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTQgMGgxMnY1SDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDBoNnY1aC02eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCAxNGg2djZoLTZ6TTAgMTRoNnY2SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMgMTRoM3Y2SDN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTcgMTRoNnY2SDd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDE0aDN2NmgtM3ptNyAwaDN2NmgtM3oiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Load Balancing');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud dns domain name server', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nDNS', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTkgNmgydjEwSDl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwIDE3SDB2MmgyMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTIgMTZIOHY0aDR6TTAgMGgyMHY2SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDBoMTB2NkgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMiAyaDJ2MkgyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0wIDhoMjB2NkgweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCA4aDEwdjZIMTB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MyIgZD0iTTIgMTBoMnYySDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud DNS');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud dns domain name server', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud DNS', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTkgNmgydjEwSDl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwIDE3SDB2MmgyMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTIgMTZIOHY0aDR6TTAgMGgyMHY2SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDBoMTB2NkgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMiAyaDJ2MkgyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0wIDhoMjB2NkgweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCA4aDEwdjZIMTB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MyIgZD0iTTIgMTBoMnYySDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud DNS');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud dns domain name server', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud DNS', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTkgNmgydjEwSDl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwIDE3SDB2MmgyMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTIgMTZIOHY0aDR6TTAgMGgyMHY2SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDBoMTB2NkgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMiAyaDJ2MkgyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0wIDhoMjB2NkgweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCA4aDEwdjZIMTB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MyIgZD0iTTIgMTBoMnYySDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud DNS');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud cdn', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nCDN', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMTMgNS42M1YzLjIxTDEwIDB2Mi40MXptMy43NSA3LjVMMjAgMTBoLTIuNWwtMy4xMiAzLjEzem0tMTMuNzUgMEwwIDEwaDIuNWwzLjEzIDMuMTN6bTEwIDEuMjV2Mi40MUwxMCAyMHYtMi40MXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02Ljg4IDUuNjNMMTAgMi40MVYwTDYuODggMy4yMXpNMTcuNSAxMEgyMGwtMy4xMi0zLjEyaC0yLjV6bS0xNSAwSDBsMy4xMy0zLjEyaDIuNXptNC4zOCA0LjM4TDEwIDE3LjU5VjIwbC0zLjEyLTMuMjF6bTAtNy41aDYuMjV2Ni4yNUg2Ljg4eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuODggMTMuMTNsNi4yNS02LjI1djYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBsMy4xMy0zLjEydjYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud CDN');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud cdn', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud CDN', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMTMgNS42M1YzLjIxTDEwIDB2Mi40MXptMy43NSA3LjVMMjAgMTBoLTIuNWwtMy4xMiAzLjEzem0tMTMuNzUgMEwwIDEwaDIuNWwzLjEzIDMuMTN6bTEwIDEuMjV2Mi40MUwxMCAyMHYtMi40MXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02Ljg4IDUuNjNMMTAgMi40MVYwTDYuODggMy4yMXpNMTcuNSAxMEgyMGwtMy4xMi0zLjEyaC0yLjV6bS0xNSAwSDBsMy4xMy0zLjEyaDIuNXptNC4zOCA0LjM4TDEwIDE3LjU5VjIwbC0zLjEyLTMuMjF6bTAtNy41aDYuMjV2Ni4yNUg2Ljg4eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuODggMTMuMTNsNi4yNS02LjI1djYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBsMy4xMy0zLjEydjYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud CDN');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud cdn', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud CDN', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMTMgNS42M1YzLjIxTDEwIDB2Mi40MXptMy43NSA3LjVMMjAgMTBoLTIuNWwtMy4xMiAzLjEzem0tMTMuNzUgMEwwIDEwaDIuNWwzLjEzIDMuMTN6bTEwIDEuMjV2Mi40MUwxMCAyMHYtMi40MXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02Ljg4IDUuNjNMMTAgMi40MVYwTDYuODggMy4yMXpNMTcuNSAxMEgyMGwtMy4xMi0zLjEyaC0yLjV6bS0xNSAwSDBsMy4xMy0zLjEyaDIuNXptNC4zOCA0LjM4TDEwIDE3LjU5VjIwbC0zLjEyLTMuMjF6bTAtNy41aDYuMjV2Ni4yNUg2Ljg4eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuODggMTMuMTNsNi4yNS02LjI1djYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBsMy4xMy0zLjEydjYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud CDN');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud network', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nNetwork', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMTMgNS42M1YzLjIxTDEwIDB2Mi40MXptMy43NSA3LjVMMjAgMTBoLTIuNWwtMy4xMiAzLjEzem0tMTMuNzUgMEwwIDEwaDIuNWwzLjEzIDMuMTN6bTEwIDEuMjV2Mi40MUwxMCAyMHYtMi40MXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02Ljg4IDUuNjNMMTAgMi40MVYwTDYuODggMy4yMXpNMTcuNSAxMEgyMGwtMy4xMi0zLjEyaC0yLjV6bS0xNSAwSDBsMy4xMy0zLjEyaDIuNXptNC4zOCA0LjM4TDEwIDE3LjU5VjIwbC0zLjEyLTMuMjF6bTAtNy41aDYuMjV2Ni4yNUg2Ljg4eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuODggMTMuMTNsNi4yNS02LjI1djYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBsMy4xMy0zLjEydjYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Network');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud network', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Network', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMTMgNS42M1YzLjIxTDEwIDB2Mi40MXptMy43NSA3LjVMMjAgMTBoLTIuNWwtMy4xMiAzLjEzem0tMTMuNzUgMEwwIDEwaDIuNWwzLjEzIDMuMTN6bTEwIDEuMjV2Mi40MUwxMCAyMHYtMi40MXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02Ljg4IDUuNjNMMTAgMi40MVYwTDYuODggMy4yMXpNMTcuNSAxMEgyMGwtMy4xMi0zLjEyaC0yLjV6bS0xNSAwSDBsMy4xMy0zLjEyaDIuNXptNC4zOCA0LjM4TDEwIDE3LjU5VjIwbC0zLjEyLTMuMjF6bTAtNy41aDYuMjV2Ni4yNUg2Ljg4eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuODggMTMuMTNsNi4yNS02LjI1djYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBsMy4xMy0zLjEydjYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Network');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud network', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Network', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMTMgNS42M1YzLjIxTDEwIDB2Mi40MXptMy43NSA3LjVMMjAgMTBoLTIuNWwtMy4xMiAzLjEzem0tMTMuNzUgMEwwIDEwaDIuNWwzLjEzIDMuMTN6bTEwIDEuMjV2Mi40MUwxMCAyMHYtMi40MXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02Ljg4IDUuNjNMMTAgMi40MVYwTDYuODggMy4yMXpNMTcuNSAxMEgyMGwtMy4xMi0zLjEyaC0yLjV6bS0xNSAwSDBsMy4xMy0zLjEyaDIuNXptNC4zOCA0LjM4TDEwIDE3LjU5VjIwbC0zLjEyLTMuMjF6bTAtNy41aDYuMjV2Ni4yNUg2Ljg4eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuODggMTMuMTNsNi4yNS02LjI1djYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBsMy4xMy0zLjEydjYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Network');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud external ip address internal protocol', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud External\nIP Addresses', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk5OTk5ODA5MjY1MTM2NyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAtMi44NDIxNzA1NjE4NzU1NzQ1ZS0xNSAxOS45OTk5OTgwOTI2NTEzNjcgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNS40OSAxMC40djYuN2EuNC40IDAgMCAxLS40LjRIMi45YS40LjQgMCAwIDEtLjQtLjRWNC45YS40LjQgMCAwIDEgLjQtLjRoNi43YS40LjQgMCAwIDAgLjQtLjRWMi40YS40LjQgMCAwIDAtLjQtLjRILjRhLjQuNCAwIDAgMC0uNC40djE3LjJhLjQuNCAwIDAgMCAuNC40aDE3LjJhLjQuNCAwIDAgMCAuNC0uNHYtOS4yYS40LjQgMCAwIDAtLjQtLjRoLTEuNzFhLjQuNCAwIDAgMC0uNC40eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMiAuNHY3LjJhLjQuNCAwIDAgMCAuNC40aDcuMmEuNC40IDAgMCAwIC40LS40Vi40YS40LjQgMCAwIDAtLjQtLjRoLTcuMmEuNC40IDAgMCAwLS40LjR6bTUuNiA0LjFoLTEuNzFhLjQuNCAwIDAgMS0uNC0uNFYyLjRhLjQuNCAwIDAgMSAuNC0uNGgxLjcxYS40LjQgMCAwIDEgLjQuNHYxLjdhLjQuNCAwIDAgMS0uNC40eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud External IP Address');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud external ip address internet protocol', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 220, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud External IP Address', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk5OTk5ODA5MjY1MTM2NyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAtMi44NDIxNzA1NjE4NzU1NzQ1ZS0xNSAxOS45OTk5OTgwOTI2NTEzNjcgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNS40OSAxMC40djYuN2EuNC40IDAgMCAxLS40LjRIMi45YS40LjQgMCAwIDEtLjQtLjRWNC45YS40LjQgMCAwIDEgLjQtLjRoNi43YS40LjQgMCAwIDAgLjQtLjRWMi40YS40LjQgMCAwIDAtLjQtLjRILjRhLjQuNCAwIDAgMC0uNC40djE3LjJhLjQuNCAwIDAgMCAuNC40aDE3LjJhLjQuNCAwIDAgMCAuNC0uNHYtOS4yYS40LjQgMCAwIDAtLjQtLjRoLTEuNzFhLjQuNCAwIDAgMC0uNC40eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMiAuNHY3LjJhLjQuNCAwIDAgMCAuNC40aDcuMmEuNC40IDAgMCAwIC40LS40Vi40YS40LjQgMCAwIDAtLjQtLjRoLTcuMmEuNC40IDAgMCAwLS40LjR6bTUuNiA0LjFoLTEuNzFhLjQuNCAwIDAgMS0uNC0uNFYyLjRhLjQuNCAwIDAgMSAuNC0uNGgxLjcxYS40LjQgMCAwIDEgLjQuNHYxLjdhLjQuNCAwIDAgMS0uNC40eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud External IP Address');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud external ip address internet protocol', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 228, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud External IP Address', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk5OTk5ODA5MjY1MTM2NyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAtMi44NDIxNzA1NjE4NzU1NzQ1ZS0xNSAxOS45OTk5OTgwOTI2NTEzNjcgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNS40OSAxMC40djYuN2EuNC40IDAgMCAxLS40LjRIMi45YS40LjQgMCAwIDEtLjQtLjRWNC45YS40LjQgMCAwIDEgLjQtLjRoNi43YS40LjQgMCAwIDAgLjQtLjRWMi40YS40LjQgMCAwIDAtLjQtLjRILjRhLjQuNCAwIDAgMC0uNC40djE3LjJhLjQuNCAwIDAgMCAuNC40aDE3LjJhLjQuNCAwIDAgMCAuNC0uNHYtOS4yYS40LjQgMCAwIDAtLjQtLjRoLTEuNzFhLjQuNCAwIDAgMC0uNC40eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMiAuNHY3LjJhLjQuNCAwIDAgMCAuNC40aDcuMmEuNC40IDAgMCAwIC40LS40Vi40YS40LjQgMCAwIDAtLjQtLjRoLTcuMmEuNC40IDAgMCAwLS40LjR6bTUuNiA0LjFoLTEuNzFhLjQuNCAwIDAgMS0uNC0uNFYyLjRhLjQuNCAwIDAgMSAuNC0uNGgxLjcxYS40LjQgMCAwIDEgLjQuNHYxLjdhLjQuNCAwIDAgMS0uNC40eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud External IP Address');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud routes', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nRoutes', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5LjI5OTk5OTIzNzA2MDU0NyIgdmlld0JveD0iMCAwIDIwIDE5LjI5OTk5OTIzNzA2MDU0NyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDMgNi4xSDBWMi42N2gzLjk0bDguNCAxMC40OWgyLjM0di0yLjcyTDIwIDE0Ljg3bC01LjMyIDQuNDN2LTIuNzFoLTMuODd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LjY4IDYuMTR2Mi43MkwyMCA0LjQzIDE0LjY4IDB2Mi43MWgtMy44N0w4LjMzIDUuODJsMi4xMyAyLjY3IDEuODgtMi4zNXpNMCAxMy4ydjMuNDNoMy45NGwyLjUyLTMuMTUtMi4xMy0yLjY3LTEuOSAyLjM5eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Routes');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud routes', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Routes', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5LjI5OTk5OTIzNzA2MDU0NyIgdmlld0JveD0iMCAwIDIwIDE5LjI5OTk5OTIzNzA2MDU0NyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDMgNi4xSDBWMi42N2gzLjk0bDguNCAxMC40OWgyLjM0di0yLjcyTDIwIDE0Ljg3bC01LjMyIDQuNDN2LTIuNzFoLTMuODd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LjY4IDYuMTR2Mi43MkwyMCA0LjQzIDE0LjY4IDB2Mi43MWgtMy44N0w4LjMzIDUuODJsMi4xMyAyLjY3IDEuODgtMi4zNXpNMCAxMy4ydjMuNDNoMy45NGwyLjUyLTMuMTUtMi4xMy0yLjY3LTEuOSAyLjM5eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Routes');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud routes', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Routes', 
			    		new mxGeometry(0, 0, 30, 28), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5LjI5OTk5OTIzNzA2MDU0NyIgdmlld0JveD0iMCAwIDIwIDE5LjI5OTk5OTIzNzA2MDU0NyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDMgNi4xSDBWMi42N2gzLjk0bDguNCAxMC40OWgyLjM0di0yLjcyTDIwIDE0Ljg3bC01LjMyIDQuNDN2LTIuNzFoLTMuODd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LjY4IDYuMTR2Mi43MkwyMCA0LjQzIDE0LjY4IDB2Mi43MWgtMy44N0w4LjMzIDUuODJsMi4xMyAyLjY3IDEuODgtMi4zNXpNMCAxMy4ydjMuNDNoMy45NGwyLjUyLTMuMTUtMi4xMy0yLjY3LTEuOSAyLjM5eiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Routes');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud firewall rules', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nFirewall Rules', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNDI4NWY0IiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAgMGg4Ljg5djIuMjJIMHptMCAxNy43OGg4Ljg5VjIwSDB6bTAtOC44OWg4Ljg5djIuMjJIMHpNMTEuMTEgMEgyMHYyLjIyaC04Ljg5em0wIDE3Ljc4SDIwVjIwaC04Ljg5em0wLTguODlIMjB2Mi4yMmgtOC44OXpNNS41NSA0LjQ0aDguODl2Mi4yMkg1LjU1em0wIDguODloOC44OXYyLjIySDUuNTV6TTAgNC40NGgzLjMzdjIuMjJIMHptMCA4Ljg5aDMuMzN2Mi4yMkgwem0xNi42Ny04Ljg5SDIwdjIuMjJoLTMuMzN6bTAgOC44OUgyMHYyLjIyaC0zLjMzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Firewall Rules');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud firewall rules', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 180, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Firewall Rules', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNDI4NWY0IiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAgMGg4Ljg5djIuMjJIMHptMCAxNy43OGg4Ljg5VjIwSDB6bTAtOC44OWg4Ljg5djIuMjJIMHpNMTEuMTEgMEgyMHYyLjIyaC04Ljg5em0wIDE3Ljc4SDIwVjIwaC04Ljg5em0wLTguODlIMjB2Mi4yMmgtOC44OXpNNS41NSA0LjQ0aDguODl2Mi4yMkg1LjU1em0wIDguODloOC44OXYyLjIySDUuNTV6TTAgNC40NGgzLjMzdjIuMjJIMHptMCA4Ljg5aDMuMzN2Mi4yMkgwem0xNi42Ny04Ljg5SDIwdjIuMjJoLTMuMzN6bTAgOC44OUgyMHYyLjIyaC0zLjMzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Firewall Rules');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud firewall rules', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 188, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Firewall Rules', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNDI4NWY0IiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAgMGg4Ljg5djIuMjJIMHptMCAxNy43OGg4Ljg5VjIwSDB6bTAtOC44OWg4Ljg5djIuMjJIMHpNMTEuMTEgMEgyMHYyLjIyaC04Ljg5em0wIDE3Ljc4SDIwVjIwaC04Ljg5em0wLTguODlIMjB2Mi4yMmgtOC44OXpNNS41NSA0LjQ0aDguODl2Mi4yMkg1LjU1em0wIDguODloOC44OXYyLjIySDUuNTV6TTAgNC40NGgzLjMzdjIuMjJIMHptMCA4Ljg5aDMuMzN2Mi4yMkgwem0xNi42Ny04Ljg5SDIwdjIuMjJoLTMuMzN6bTAgOC44OUgyMHYyLjIyaC0zLjMzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Firewall Rules');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud vpn virtual private network', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 100, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nVPN', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1MDAwMDc2MjkzOTQ1MyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE3Ljk1MDAwMDc2MjkzOTQ1MyAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0xMS43IDkuMjhoNC4xOHYxLjM4SDExLjd6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0xNC45MiA0LjEyaDEuMzh2MTEuNzFoLTEuMzh6Ii8+JiN4YTsJPC9nPiYjeGE7CTxnIGNsYXNzPSJzdDAiPiYjeGE7CQk8cmVjdCB4PSIxMy4yNyIgeT0iMTUuMzIiIHdpZHRoPSI0LjY4IiBoZWlnaHQ9IjQuNjgiIHJ4PSIuMjgiLz4mI3hhOwkJPHJlY3QgeD0iMTMuMjciIHdpZHRoPSI0LjY4IiBoZWlnaHQ9IjQuNjgiIHJ4PSIuMjgiLz4mI3hhOwk8L2c+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMuOTUgOS4yOGg0LjI4djEuMzhIMy45NXoiLz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHJlY3QgeT0iNy42MyIgd2lkdGg9IjQuNjgiIGhlaWdodD0iNC42OCIgcng9Ii4yOCIvPiYjeGE7CQk8cGF0aCBkPSJNOS45NyAxMi4xN2EyLjIgMi4yIDAgMSAxIDAtNC40IDIuMiAyLjIgMCAwIDEgMi4yIDIuMiAyLjE5IDIuMTkgMCAwIDEtMi4yIDIuMnptMC0zLjU3YTEuMzggMS4zOCAwIDAgMC0xLjA1IDIuMzNBMS4zOCAxLjM4IDAgMCAwIDExLjMgMTBhMS4zNyAxLjM3IDAgMCAwLTEuMzMtMS40eiIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud VPN');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud vpn virtual private network', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud VPN', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1MDAwMDc2MjkzOTQ1MyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE3Ljk1MDAwMDc2MjkzOTQ1MyAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0xMS43IDkuMjhoNC4xOHYxLjM4SDExLjd6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0xNC45MiA0LjEyaDEuMzh2MTEuNzFoLTEuMzh6Ii8+JiN4YTsJPC9nPiYjeGE7CTxnIGNsYXNzPSJzdDAiPiYjeGE7CQk8cmVjdCB4PSIxMy4yNyIgeT0iMTUuMzIiIHdpZHRoPSI0LjY4IiBoZWlnaHQ9IjQuNjgiIHJ4PSIuMjgiLz4mI3hhOwkJPHJlY3QgeD0iMTMuMjciIHdpZHRoPSI0LjY4IiBoZWlnaHQ9IjQuNjgiIHJ4PSIuMjgiLz4mI3hhOwk8L2c+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMuOTUgOS4yOGg0LjI4djEuMzhIMy45NXoiLz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHJlY3QgeT0iNy42MyIgd2lkdGg9IjQuNjgiIGhlaWdodD0iNC42OCIgcng9Ii4yOCIvPiYjeGE7CQk8cGF0aCBkPSJNOS45NyAxMi4xN2EyLjIgMi4yIDAgMSAxIDAtNC40IDIuMiAyLjIgMCAwIDEgMi4yIDIuMiAyLjE5IDIuMTkgMCAwIDEtMi4yIDIuMnptMC0zLjU3YTEuMzggMS4zOCAwIDAgMC0xLjA1IDIuMzNBMS4zOCAxLjM4IDAgMCAwIDExLjMgMTBhMS4zNyAxLjM3IDAgMCAwLTEuMzMtMS40eiIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud VPN');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud vpn virtual private network', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 138, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud VPN', 
			    		new mxGeometry(0, 0, 27, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1MDAwMDc2MjkzOTQ1MyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE3Ljk1MDAwMDc2MjkzOTQ1MyAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0xMS43IDkuMjhoNC4xOHYxLjM4SDExLjd6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0xNC45MiA0LjEyaDEuMzh2MTEuNzFoLTEuMzh6Ii8+JiN4YTsJPC9nPiYjeGE7CTxnIGNsYXNzPSJzdDAiPiYjeGE7CQk8cmVjdCB4PSIxMy4yNyIgeT0iMTUuMzIiIHdpZHRoPSI0LjY4IiBoZWlnaHQ9IjQuNjgiIHJ4PSIuMjgiLz4mI3hhOwkJPHJlY3QgeD0iMTMuMjciIHdpZHRoPSI0LjY4IiBoZWlnaHQ9IjQuNjgiIHJ4PSIuMjgiLz4mI3hhOwk8L2c+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMuOTUgOS4yOGg0LjI4djEuMzhIMy45NXoiLz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHJlY3QgeT0iNy42MyIgd2lkdGg9IjQuNjgiIGhlaWdodD0iNC42OCIgcng9Ii4yOCIvPiYjeGE7CQk8cGF0aCBkPSJNOS45NyAxMi4xN2EyLjIgMi4yIDAgMSAxIDAtNC40IDIuMiAyLjIgMCAwIDEgMi4yIDIuMiAyLjE5IDIuMTkgMCAwIDEtMi4yIDIuMnptMC0zLjU3YTEuMzggMS4zOCAwIDAgMC0xLjA1IDIuMzNBMS4zOCAxLjM4IDAgMCAwIDExLjMgMTBhMS4zNyAxLjM3IDAgMCAwLTEuMzMtMS40eiIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(16, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud VPN');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud router', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nRouter', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE3IDEydjNsLTUtNSA1LTV2M2gzdjR6TTMgOEgwdjRoM3YzbDUtNS01LTV6bTkgN3YtM0g4djNINWw1IDUgNS01em0wLTEwdjNIOFY1SDVsNS01IDUgNXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Router');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud router', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Router', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE3IDEydjNsLTUtNSA1LTV2M2gzdjR6TTMgOEgwdjRoM3YzbDUtNS01LTV6bTkgN3YtM0g4djNINWw1IDUgNS01em0wLTEwdjNIOFY1SDVsNS01IDUgNXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Router');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud router', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Router', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE3IDEydjNsLTUtNSA1LTV2M2gzdjR6TTMgOEgwdjRoM3YzbDUtNS01LTV6bTkgN3YtM0g4djNINWw1IDUgNS01em0wLTEwdjNIOFY1SDVsNS01IDUgNXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Router');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud armor', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nArmor', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjUwMDQzNDg3NTQ4ODI4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSItMC4wMDAzNjMwODkyNjA2NDUyMTA3NCAxLjE5MjA5Mjg5NTUwNzgxMjVlLTcgMTYuNTAwNDM0ODc1NDg4MjggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMC40MiAxMi4wN2wxLjA0IDEuMDUtNS40NSA1LjQ4LTEuMDQtMS4wNXptLS44My00LjE5bDEuMDQgMS4wNS03LjM1IDcuMzktMS4wNC0xLjA1em0tNC4xNi0uODVsMS4wNCAxLjA1LTQuODggNC45LTEuMDQtMS4wNXoiLz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTguMjUgMS42MWw2Ljc4IDN2NC41NWE5LjcxIDkuNzEgMCAwIDEtNi43OCA5LjMyIDkuNyA5LjcgMCAwIDEtNi43OC05LjMxVjQuNjNsNi43OC0zbTAtMS42M0wwIDMuNjh2NS40OUExMS4xNyAxMS4xNyAwIDAgMCA4LjEgMjBoLjE1LjE1YTExLjE3IDExLjE3IDAgMCAwIDguMS0xMC43OFYzLjY4eiIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMC45NCIgY3k9IjEyLjYyIiByPSIxLjQyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjEwLjEiIGN5PSI4LjQ1IiByPSIxLjQyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjUuOTQiIGN5PSI3LjYiIHI9IjEuNDIiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Armor');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud armor', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Armor', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjUwMDQzNDg3NTQ4ODI4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSItMC4wMDAzNjMwODkyNjA2NDUyMTA3NCAxLjE5MjA5Mjg5NTUwNzgxMjVlLTcgMTYuNTAwNDM0ODc1NDg4MjggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMC40MiAxMi4wN2wxLjA0IDEuMDUtNS40NSA1LjQ4LTEuMDQtMS4wNXptLS44My00LjE5bDEuMDQgMS4wNS03LjM1IDcuMzktMS4wNC0xLjA1em0tNC4xNi0uODVsMS4wNCAxLjA1LTQuODggNC45LTEuMDQtMS4wNXoiLz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTguMjUgMS42MWw2Ljc4IDN2NC41NWE5LjcxIDkuNzEgMCAwIDEtNi43OCA5LjMyIDkuNyA5LjcgMCAwIDEtNi43OC05LjMxVjQuNjNsNi43OC0zbTAtMS42M0wwIDMuNjh2NS40OUExMS4xNyAxMS4xNyAwIDAgMCA4LjEgMjBoLjE1LjE1YTExLjE3IDExLjE3IDAgMCAwIDguMS0xMC43OFYzLjY4eiIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMC45NCIgY3k9IjEyLjYyIiByPSIxLjQyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjEwLjEiIGN5PSI4LjQ1IiByPSIxLjQyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjUuOTQiIGN5PSI3LjYiIHI9IjEuNDIiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Armor');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud armor', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Armor', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjUwMDQzNDg3NTQ4ODI4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSItMC4wMDAzNjMwODkyNjA2NDUyMTA3NCAxLjE5MjA5Mjg5NTUwNzgxMjVlLTcgMTYuNTAwNDM0ODc1NDg4MjggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMC40MiAxMi4wN2wxLjA0IDEuMDUtNS40NSA1LjQ4LTEuMDQtMS4wNXptLS44My00LjE5bDEuMDQgMS4wNS03LjM1IDcuMzktMS4wNC0xLjA1em0tNC4xNi0uODVsMS4wNCAxLjA1LTQuODggNC45LTEuMDQtMS4wNXoiLz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTguMjUgMS42MWw2Ljc4IDN2NC41NWE5LjcxIDkuNzEgMCAwIDEtNi43OCA5LjMyIDkuNyA5LjcgMCAwIDEtNi43OC05LjMxVjQuNjNsNi43OC0zbTAtMS42M0wwIDMuNjh2NS40OUExMS4xNyAxMS4xNyAwIDAgMCA4LjEgMjBoLjE1LjE1YTExLjE3IDExLjE3IDAgMCAwIDguMS0xMC43OFYzLjY4eiIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMC45NCIgY3k9IjEyLjYyIiByPSIxLjQyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjEwLjEiIGN5PSI4LjQ1IiByPSIxLjQyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjUuOTQiIGN5PSI3LjYiIHI9IjEuNDIiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Armor');
			})
		);

		fns.push(
			this.addEntry(dt + 'standard network tier', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Standard\nNetwork Tier', 
			    		new mxGeometry(0, 0, 30, 15), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNC4wMDEwMzc1OTc2NTYyNSIgaGVpZ2h0PSIyMTMuOTk4Mzk3ODI3MTQ4NDQiIHZpZXdCb3g9Ii0wLjAwMDAyMDQ4Mjg0MTEzNjk4MTczMyAwIDQyNC4wMDEwMzc1OTc2NTYyNSAyMTMuOTk4Mzk3ODI3MTQ4NDQiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTk5LjQzMSA0Ni44NTRsLjM3NC4yODkgMTA1Ljc1OCA4My4yMDhhNDIuMDggNDIuMDggMCAwIDEgNC43MTUtLjM4OWwuNzg5LS4wMTNjMTcuNDExLS4wMDQgMzMuMDE4IDEwLjc1OCAzOS4yMjMgMjcuMDQ5czEuNzIxIDM0LjcyNS0xMS4yNzEgNDYuMzMzYTQxLjkzIDQxLjkzIDAgMCAxLTQ3LjI1MyA1Ljk1NiA0Mi4wNCA0Mi4wNCAwIDAgMS0yMi40NDQtNDEuNTcxbC4wNTYtLjUxOS0uMDI2LS4wM0w4Ny43IDU4Ljk3NmMtOS40ODEtMTIuNTYyLS41NzUtMjEuNDg2IDExLjczLTEyLjEyM3ptMzA2LjgzOCAxMjcuNzI2YzkuNzkzIDAgMTcuNzMyIDcuOTQ5IDE3LjczMiAxNy43NTVzLTcuOTM5IDE3Ljc1NS0xNy43MzIgMTcuNzU1LTE3LjczMi03Ljk0OS0xNy43MzItMTcuNzU1IDcuOTM5LTE3Ljc1NSAxNy43MzItMTcuNzU1ek02MC4yNDEgNjguNzk3bDIwLjQyMyAyOC4zMmEyMTcuMTYgMjE3LjE2IDAgMCAwLTQ2LjkyIDk3LjM5OSAxNy4wNCAxNy4wNCAwIDAgMS0xMS4yODggMTIuOTYxYy01LjgyMyAxLjk2NC0xMi4yNTEuNjMzLTE2LjgxOS0zLjQ4MmExNy4wNiAxNy4wNiAwIDAgMS01LjIyOS0xNi4zOGM4LjgxNy00NC4zMDUgMjkuNDk5LTg1LjM3NiA1OS44MzMtMTE4LjgxN3ptMzIyLjc2MiA0MS4zMDhjOS43OTMgMCAxNy43MzIgNy45NDkgMTcuNzMyIDE3Ljc1NXMtNy45MzkgMTcuNzU1LTE3LjczMiAxNy43NTUtMTcuNzMyLTcuOTQ5LTE3LjczMi0xNy43NTUgNy45MzktMTcuNzU1IDE3LjczMi0xNy43NTV6bS00MS42MjgtNTUuMDk0YzkuNzkzIDAgMTcuNzMyIDcuOTQ5IDE3LjczMiAxNy43NTVzLTcuOTM5IDE3Ljc1NS0xNy43MzIgMTcuNzU1LTE3LjczMi03Ljk0OS0xNy43MzItMTcuNzU1IDcuOTM5LTE3Ljc1NSAxNy43MzItMTcuNzU1em0tNTcuNzkyLTM4Ljk3OWM5Ljc5MyAwIDE3LjczMiA3Ljk0OSAxNy43MzIgMTcuNzU1cy03LjkzOSAxNy43NTUtMTcuNzMyIDE3Ljc1NS0xNy43MzItNy45NDktMTcuNzMyLTE3Ljc1NSA3LjkzOS0xNy43NTUgMTcuNzMyLTE3Ljc1NXptLTEzMy4wNzQtNC4zMjdjOS43OTMgMCAxNy43MzIgNy45NDkgMTcuNzMyIDE3Ljc1NXMtNy45MzkgMTcuNzU1LTE3LjczMiAxNy43NTUtMTcuNzMyLTcuOTQ5LTE3LjczMi0xNy43NTUgNy45MzktMTcuNzU1IDE3LjczMi0xNy43NTV6TTIxNy4zNTcgMGM5Ljc5MyAwIDE3LjczMiA3Ljk0OSAxNy43MzIgMTcuNzU1UzIyNy4xNSAzNS41MSAyMTcuMzU3IDM1LjUxcy0xNy43MzItNy45NDktMTcuNzMyLTE3Ljc1NVMyMDcuNTY0IDAgMjE3LjM1NyAweiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Standard Network Tier');
			})
		);

		fns.push(
			this.addEntry(dt + 'standard network tier', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 190, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Standard Network Tier', 
			    		new mxGeometry(0, 0, 30, 15), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNC4wMDEwMzc1OTc2NTYyNSIgaGVpZ2h0PSIyMTMuOTk4Mzk3ODI3MTQ4NDQiIHZpZXdCb3g9Ii0wLjAwMDAyMDQ4Mjg0MTEzNjk4MTczMyAwIDQyNC4wMDEwMzc1OTc2NTYyNSAyMTMuOTk4Mzk3ODI3MTQ4NDQiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTk5LjQzMSA0Ni44NTRsLjM3NC4yODkgMTA1Ljc1OCA4My4yMDhhNDIuMDggNDIuMDggMCAwIDEgNC43MTUtLjM4OWwuNzg5LS4wMTNjMTcuNDExLS4wMDQgMzMuMDE4IDEwLjc1OCAzOS4yMjMgMjcuMDQ5czEuNzIxIDM0LjcyNS0xMS4yNzEgNDYuMzMzYTQxLjkzIDQxLjkzIDAgMCAxLTQ3LjI1MyA1Ljk1NiA0Mi4wNCA0Mi4wNCAwIDAgMS0yMi40NDQtNDEuNTcxbC4wNTYtLjUxOS0uMDI2LS4wM0w4Ny43IDU4Ljk3NmMtOS40ODEtMTIuNTYyLS41NzUtMjEuNDg2IDExLjczLTEyLjEyM3ptMzA2LjgzOCAxMjcuNzI2YzkuNzkzIDAgMTcuNzMyIDcuOTQ5IDE3LjczMiAxNy43NTVzLTcuOTM5IDE3Ljc1NS0xNy43MzIgMTcuNzU1LTE3LjczMi03Ljk0OS0xNy43MzItMTcuNzU1IDcuOTM5LTE3Ljc1NSAxNy43MzItMTcuNzU1ek02MC4yNDEgNjguNzk3bDIwLjQyMyAyOC4zMmEyMTcuMTYgMjE3LjE2IDAgMCAwLTQ2LjkyIDk3LjM5OSAxNy4wNCAxNy4wNCAwIDAgMS0xMS4yODggMTIuOTYxYy01LjgyMyAxLjk2NC0xMi4yNTEuNjMzLTE2LjgxOS0zLjQ4MmExNy4wNiAxNy4wNiAwIDAgMS01LjIyOS0xNi4zOGM4LjgxNy00NC4zMDUgMjkuNDk5LTg1LjM3NiA1OS44MzMtMTE4LjgxN3ptMzIyLjc2MiA0MS4zMDhjOS43OTMgMCAxNy43MzIgNy45NDkgMTcuNzMyIDE3Ljc1NXMtNy45MzkgMTcuNzU1LTE3LjczMiAxNy43NTUtMTcuNzMyLTcuOTQ5LTE3LjczMi0xNy43NTUgNy45MzktMTcuNzU1IDE3LjczMi0xNy43NTV6bS00MS42MjgtNTUuMDk0YzkuNzkzIDAgMTcuNzMyIDcuOTQ5IDE3LjczMiAxNy43NTVzLTcuOTM5IDE3Ljc1NS0xNy43MzIgMTcuNzU1LTE3LjczMi03Ljk0OS0xNy43MzItMTcuNzU1IDcuOTM5LTE3Ljc1NSAxNy43MzItMTcuNzU1em0tNTcuNzkyLTM4Ljk3OWM5Ljc5MyAwIDE3LjczMiA3Ljk0OSAxNy43MzIgMTcuNzU1cy03LjkzOSAxNy43NTUtMTcuNzMyIDE3Ljc1NS0xNy43MzItNy45NDktMTcuNzMyLTE3Ljc1NSA3LjkzOS0xNy43NTUgMTcuNzMyLTE3Ljc1NXptLTEzMy4wNzQtNC4zMjdjOS43OTMgMCAxNy43MzIgNy45NDkgMTcuNzMyIDE3Ljc1NXMtNy45MzkgMTcuNzU1LTE3LjczMiAxNy43NTUtMTcuNzMyLTcuOTQ5LTE3LjczMi0xNy43NTUgNy45MzktMTcuNzU1IDE3LjczMi0xNy43NTV6TTIxNy4zNTcgMGM5Ljc5MyAwIDE3LjczMiA3Ljk0OSAxNy43MzIgMTcuNzU1UzIyNy4xNSAzNS41MSAyMTcuMzU3IDM1LjUxcy0xNy43MzItNy45NDktMTcuNzMyLTE3Ljc1NVMyMDcuNTY0IDAgMjE3LjM1NyAweiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Standard Network Tier');
			})
		);

		fns.push(
			this.addEntry(dt + 'standard network tier', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 198, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Standard Network Tier', 
			    		new mxGeometry(0, 0, 30, 15), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNC4wMDEwMzc1OTc2NTYyNSIgaGVpZ2h0PSIyMTMuOTk4Mzk3ODI3MTQ4NDQiIHZpZXdCb3g9Ii0wLjAwMDAyMDQ4Mjg0MTEzNjk4MTczMyAwIDQyNC4wMDEwMzc1OTc2NTYyNSAyMTMuOTk4Mzk3ODI3MTQ4NDQiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTk5LjQzMSA0Ni44NTRsLjM3NC4yODkgMTA1Ljc1OCA4My4yMDhhNDIuMDggNDIuMDggMCAwIDEgNC43MTUtLjM4OWwuNzg5LS4wMTNjMTcuNDExLS4wMDQgMzMuMDE4IDEwLjc1OCAzOS4yMjMgMjcuMDQ5czEuNzIxIDM0LjcyNS0xMS4yNzEgNDYuMzMzYTQxLjkzIDQxLjkzIDAgMCAxLTQ3LjI1MyA1Ljk1NiA0Mi4wNCA0Mi4wNCAwIDAgMS0yMi40NDQtNDEuNTcxbC4wNTYtLjUxOS0uMDI2LS4wM0w4Ny43IDU4Ljk3NmMtOS40ODEtMTIuNTYyLS41NzUtMjEuNDg2IDExLjczLTEyLjEyM3ptMzA2LjgzOCAxMjcuNzI2YzkuNzkzIDAgMTcuNzMyIDcuOTQ5IDE3LjczMiAxNy43NTVzLTcuOTM5IDE3Ljc1NS0xNy43MzIgMTcuNzU1LTE3LjczMi03Ljk0OS0xNy43MzItMTcuNzU1IDcuOTM5LTE3Ljc1NSAxNy43MzItMTcuNzU1ek02MC4yNDEgNjguNzk3bDIwLjQyMyAyOC4zMmEyMTcuMTYgMjE3LjE2IDAgMCAwLTQ2LjkyIDk3LjM5OSAxNy4wNCAxNy4wNCAwIDAgMS0xMS4yODggMTIuOTYxYy01LjgyMyAxLjk2NC0xMi4yNTEuNjMzLTE2LjgxOS0zLjQ4MmExNy4wNiAxNy4wNiAwIDAgMS01LjIyOS0xNi4zOGM4LjgxNy00NC4zMDUgMjkuNDk5LTg1LjM3NiA1OS44MzMtMTE4LjgxN3ptMzIyLjc2MiA0MS4zMDhjOS43OTMgMCAxNy43MzIgNy45NDkgMTcuNzMyIDE3Ljc1NXMtNy45MzkgMTcuNzU1LTE3LjczMiAxNy43NTUtMTcuNzMyLTcuOTQ5LTE3LjczMi0xNy43NTUgNy45MzktMTcuNzU1IDE3LjczMi0xNy43NTV6bS00MS42MjgtNTUuMDk0YzkuNzkzIDAgMTcuNzMyIDcuOTQ5IDE3LjczMiAxNy43NTVzLTcuOTM5IDE3Ljc1NS0xNy43MzIgMTcuNzU1LTE3LjczMi03Ljk0OS0xNy43MzItMTcuNzU1IDcuOTM5LTE3Ljc1NSAxNy43MzItMTcuNzU1em0tNTcuNzkyLTM4Ljk3OWM5Ljc5MyAwIDE3LjczMiA3Ljk0OSAxNy43MzIgMTcuNzU1cy03LjkzOSAxNy43NTUtMTcuNzMyIDE3Ljc1NS0xNy43MzItNy45NDktMTcuNzMyLTE3Ljc1NSA3LjkzOS0xNy43NTUgMTcuNzMyLTE3Ljc1NXptLTEzMy4wNzQtNC4zMjdjOS43OTMgMCAxNy43MzIgNy45NDkgMTcuNzMyIDE3Ljc1NXMtNy45MzkgMTcuNzU1LTE3LjczMiAxNy43NTUtMTcuNzMyLTcuOTQ5LTE3LjczMi0xNy43NTUgNy45MzktMTcuNzU1IDE3LjczMi0xNy43NTV6TTIxNy4zNTcgMGM5Ljc5MyAwIDE3LjczMiA3Ljk0OSAxNy43MzIgMTcuNzU1UzIyNy4xNSAzNS41MSAyMTcuMzU3IDM1LjUxcy0xNy43MzItNy45NDktMTcuNzMyLTE3Ljc1NVMyMDcuNTY0IDAgMjE3LjM1NyAweiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Standard Network Tier');
			})
		);

		fns.push(
			this.addEntry(dt + 'premium network tier', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Premium\nNetwork Tier', 
			    		new mxGeometry(0, 0, 30, 15), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAyODAxODk1MTQxNjAxNiIgaGVpZ2h0PSIxMC4wMTk3MzA1Njc5MzIxMjkiIHZpZXdCb3g9Ii0wLjAwMDAxOTc3MjAwNTU0MzkyNzY2MiAwIDIwLjAyODAxODk1MTQxNjAxNiAxMC4wMTk3MzA1Njc5MzIxMjkiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuMjU4IDIuMjRBOS42MSA5LjYxIDAgMCAwIDEwLjEwOCAwQzUuMjY4IDAgMS4xMzggMy42NS4wMjggOC45YS44MS44MSAwIDEgMCAxLjU4LjM1aDBjLjk1LTQuNTEgNC40Mi03LjY1IDguNS03LjY1YTcuODYgNy44NiAwIDAgMSA0LjQ1IDEuNHptLjQ0IDEuMjlsLTUuODggMi42M2gwYTIgMiAwIDEgMCAxLjEzIDIuNTggMS44MyAxLjgzIDAgMCAwIC4xMi0uNDYuMS4xIDAgMCAwIC4wNSAwbDUtNGMuNTktLjU0LjI3LTEuMDYtLjQyLS43NXoiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSIxOC4wNjgiIGN5PSI1Ljk5IiByPSIuODQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxOS4xODgiIGN5PSI5LjA0IiByPSIuODQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Premium Network Tier');
			})
		);

		fns.push(
			this.addEntry(dt + 'premium network tier', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 190, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Premium Network Tier', 
			    		new mxGeometry(0, 0, 30, 15), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAyODAxODk1MTQxNjAxNiIgaGVpZ2h0PSIxMC4wMTk3MzA1Njc5MzIxMjkiIHZpZXdCb3g9Ii0wLjAwMDAxOTc3MjAwNTU0MzkyNzY2MiAwIDIwLjAyODAxODk1MTQxNjAxNiAxMC4wMTk3MzA1Njc5MzIxMjkiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuMjU4IDIuMjRBOS42MSA5LjYxIDAgMCAwIDEwLjEwOCAwQzUuMjY4IDAgMS4xMzggMy42NS4wMjggOC45YS44MS44MSAwIDEgMCAxLjU4LjM1aDBjLjk1LTQuNTEgNC40Mi03LjY1IDguNS03LjY1YTcuODYgNy44NiAwIDAgMSA0LjQ1IDEuNHptLjQ0IDEuMjlsLTUuODggMi42M2gwYTIgMiAwIDEgMCAxLjEzIDIuNTggMS44MyAxLjgzIDAgMCAwIC4xMi0uNDYuMS4xIDAgMCAwIC4wNSAwbDUtNGMuNTktLjU0LjI3LTEuMDYtLjQyLS43NXoiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSIxOC4wNjgiIGN5PSI1Ljk5IiByPSIuODQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxOS4xODgiIGN5PSI5LjA0IiByPSIuODQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Premium Network Tier');
			})
		);

		fns.push(
			this.addEntry(dt + 'premium network tier', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 198, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Premium Network Tier', 
			    		new mxGeometry(0, 0, 30, 15), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAyODAxODk1MTQxNjAxNiIgaGVpZ2h0PSIxMC4wMTk3MzA1Njc5MzIxMjkiIHZpZXdCb3g9Ii0wLjAwMDAxOTc3MjAwNTU0MzkyNzY2MiAwIDIwLjAyODAxODk1MTQxNjAxNiAxMC4wMTk3MzA1Njc5MzIxMjkiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuMjU4IDIuMjRBOS42MSA5LjYxIDAgMCAwIDEwLjEwOCAwQzUuMjY4IDAgMS4xMzggMy42NS4wMjggOC45YS44MS44MSAwIDEgMCAxLjU4LjM1aDBjLjk1LTQuNTEgNC40Mi03LjY1IDguNS03LjY1YTcuODYgNy44NiAwIDAgMSA0LjQ1IDEuNHptLjQ0IDEuMjlsLTUuODggMi42M2gwYTIgMiAwIDEgMCAxLjEzIDIuNTggMS44MyAxLjgzIDAgMCAwIC4xMi0uNDYuMS4xIDAgMCAwIC4wNSAwbDUtNGMuNTktLjU0LjI3LTEuMDYtLjQyLS43NXoiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSIxOC4wNjgiIGN5PSI1Ljk5IiByPSIuODQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxOS4xODgiIGN5PSI5LjA0IiByPSIuODQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Premium Network Tier');
			})
		);

		fns.push(
			this.addEntry(dt + 'partner interconnect', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Partner\nInterconnect', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUxOTk5OTUwNDA4OTM1NSIgdmlld0JveD0iMCAtMi4wNjA1NzM0NTA4OTU1MTA2ZS0xNSAyMCAxMy41MTk5OTk1MDQwODkzNTUiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOS4xOSAxLjYyaDEuNjJ2MTAuMjdIOS4xOXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA1Ljk1aDIuN3YxLjYySDB6Ii8+JiN4YTsJPHJlY3QgY2xhc3M9InN0MCIgeD0iMi40MyIgeT0iMy41MiIgd2lkdGg9IjQuODYiIGhlaWdodD0iNi40OSIgcng9Ii4yNCIvPiYjeGE7CTxnIGNsYXNzPSJzdDEiPiYjeGE7CQk8cGF0aCBkPSJNOS4xOSAxLjYyaDEuNjJ2MTAuMjdIOS4xOXptOC4xMSA0LjMzSDIwdjEuNjJoLTIuN3oiLz4mI3hhOwkJPHBhdGggZD0iTTQuNTkgMTEuOXYxLjMzYS4yOS4yOSAwIDAgMCAuMjkuMjloMTAuMjRhLjI5LjI5IDAgMCAwIC4yOS0uMjloMFYxMS45ek0xNS4xMiAwSDQuODhhLjI5LjI5IDAgMCAwLS4yOS4yOWgwdjEuMzNoMTAuODJWLjI5YS4yOS4yOSAwIDAgMC0uMjktLjI5eiIvPiYjeGE7CTwvZz4mI3hhOwk8cmVjdCBjbGFzcz0ic3QwIiB4PSIxMi43IiB5PSIzLjUyIiB3aWR0aD0iNC44NiIgaGVpZ2h0PSI2LjQ5IiByeD0iLjI0Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Partner Interconnect');
			})
		);

		fns.push(
			this.addEntry(dt + 'partner interconnect', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 180, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Partner Interconnect', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUxOTk5OTUwNDA4OTM1NSIgdmlld0JveD0iMCAtMi4wNjA1NzM0NTA4OTU1MTA2ZS0xNSAyMCAxMy41MTk5OTk1MDQwODkzNTUiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOS4xOSAxLjYyaDEuNjJ2MTAuMjdIOS4xOXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA1Ljk1aDIuN3YxLjYySDB6Ii8+JiN4YTsJPHJlY3QgY2xhc3M9InN0MCIgeD0iMi40MyIgeT0iMy41MiIgd2lkdGg9IjQuODYiIGhlaWdodD0iNi40OSIgcng9Ii4yNCIvPiYjeGE7CTxnIGNsYXNzPSJzdDEiPiYjeGE7CQk8cGF0aCBkPSJNOS4xOSAxLjYyaDEuNjJ2MTAuMjdIOS4xOXptOC4xMSA0LjMzSDIwdjEuNjJoLTIuN3oiLz4mI3hhOwkJPHBhdGggZD0iTTQuNTkgMTEuOXYxLjMzYS4yOS4yOSAwIDAgMCAuMjkuMjloMTAuMjRhLjI5LjI5IDAgMCAwIC4yOS0uMjloMFYxMS45ek0xNS4xMiAwSDQuODhhLjI5LjI5IDAgMCAwLS4yOS4yOWgwdjEuMzNoMTAuODJWLjI5YS4yOS4yOSAwIDAgMC0uMjktLjI5eiIvPiYjeGE7CTwvZz4mI3hhOwk8cmVjdCBjbGFzcz0ic3QwIiB4PSIxMi43IiB5PSIzLjUyIiB3aWR0aD0iNC44NiIgaGVpZ2h0PSI2LjQ5IiByeD0iLjI0Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Partner Interconnect');
			})
		);

		fns.push(
			this.addEntry(dt + 'partner interconnect', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 188, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Partner Interconnect', 
			    		new mxGeometry(0, 0, 30, 21), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUxOTk5OTUwNDA4OTM1NSIgdmlld0JveD0iMCAtMi4wNjA1NzM0NTA4OTU1MTA2ZS0xNSAyMCAxMy41MTk5OTk1MDQwODkzNTUiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOS4xOSAxLjYyaDEuNjJ2MTAuMjdIOS4xOXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA1Ljk1aDIuN3YxLjYySDB6Ii8+JiN4YTsJPHJlY3QgY2xhc3M9InN0MCIgeD0iMi40MyIgeT0iMy41MiIgd2lkdGg9IjQuODYiIGhlaWdodD0iNi40OSIgcng9Ii4yNCIvPiYjeGE7CTxnIGNsYXNzPSJzdDEiPiYjeGE7CQk8cGF0aCBkPSJNOS4xOSAxLjYyaDEuNjJ2MTAuMjdIOS4xOXptOC4xMSA0LjMzSDIwdjEuNjJoLTIuN3oiLz4mI3hhOwkJPHBhdGggZD0iTTQuNTkgMTEuOXYxLjMzYS4yOS4yOSAwIDAgMCAuMjkuMjloMTAuMjRhLjI5LjI5IDAgMCAwIC4yOS0uMjloMFYxMS45ek0xNS4xMiAwSDQuODhhLjI5LjI5IDAgMCAwLS4yOS4yOWgwdjEuMzNoMTAuODJWLjI5YS4yOS4yOSAwIDAgMC0uMjktLjI5eiIvPiYjeGE7CTwvZz4mI3hhOwk8cmVjdCBjbGFzcz0ic3QwIiB4PSIxMi43IiB5PSIzLjUyIiB3aWR0aD0iNC44NiIgaGVpZ2h0PSI2LjQ5IiByeD0iLjI0Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 19);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Partner Interconnect');
			})
		);

		this.addPalette('gcp2Networking', 'GCP / Networking', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2DeveloperToolsPalette = function()
	{
		var dt = 'gcp google cloud platform dev developer tools ';
		var fns = [];
		
		fns.push(
			this.addEntry(dt + 'cloud sdk software development kit', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nSDK', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud SDK');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud sdk software development kit', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud SDK', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud SDK');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud sdk software development kit', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud SDK', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud SDK');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud build', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 110, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nBuild', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3LjMyOTk5OTkyMzcwNjA1NSIgaGVpZ2h0PSIxOS42MTAwMDA2MTAzNTE1NjIiIHZpZXdCb3g9IjAgMCAxNy4zMjk5OTk5MjM3MDYwNTUgMTkuNjEwMDAwNjEwMzUxNTYyIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyLjE4IDcuOThMMTEgNy4yOWwtMy41MiA2LjEgMS4xOC42OCAzLjUyLTIuMDN6IiBmaWxsPSIjNDI4NWY0Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuMzIgMTIuNzJsMy41My02LjA5LTEuMTktLjY5LTMuNTIgMi4wNHY0LjA2eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zLjc1IDcuOThMMCA1LjgxdjkuMmw3Ljk3IDQuNnYtNC4zM2wtNC4yMi0yLjQ0em05LjEzLTEuMmwzLjc2LTIuMTdMOC42NiAwIC42OCA0LjYxbDMuNzYgMi4xNyA0LjIyLTIuNDR6TTkuMzUgMTkuNjFsNy45OC00LjZ2LTkuMmwtMy43NiAyLjE3djQuODZsLTQuMjIgMi40NHoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Build');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud build', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Build', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3LjMyOTk5OTkyMzcwNjA1NSIgaGVpZ2h0PSIxOS42MTAwMDA2MTAzNTE1NjIiIHZpZXdCb3g9IjAgMCAxNy4zMjk5OTk5MjM3MDYwNTUgMTkuNjEwMDAwNjEwMzUxNTYyIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyLjE4IDcuOThMMTEgNy4yOWwtMy41MiA2LjEgMS4xOC42OCAzLjUyLTIuMDN6IiBmaWxsPSIjNDI4NWY0Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuMzIgMTIuNzJsMy41My02LjA5LTEuMTktLjY5LTMuNTIgMi4wNHY0LjA2eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zLjc1IDcuOThMMCA1LjgxdjkuMmw3Ljk3IDQuNnYtNC4zM2wtNC4yMi0yLjQ0em05LjEzLTEuMmwzLjc2LTIuMTdMOC42NiAwIC42OCA0LjYxbDMuNzYgMi4xNyA0LjIyLTIuNDR6TTkuMzUgMTkuNjFsNy45OC00LjZ2LTkuMmwtMy43NiAyLjE3djQuODZsLTQuMjIgMi40NHoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Build');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud build', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Build', 
			    		new mxGeometry(0, 0, 26, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3LjMyOTk5OTkyMzcwNjA1NSIgaGVpZ2h0PSIxOS42MTAwMDA2MTAzNTE1NjIiIHZpZXdCb3g9IjAgMCAxNy4zMjk5OTk5MjM3MDYwNTUgMTkuNjEwMDAwNjEwMzUxNTYyIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyLjE4IDcuOThMMTEgNy4yOWwtMy41MiA2LjEgMS4xOC42OCAzLjUyLTIuMDN6IiBmaWxsPSIjNDI4NWY0Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuMzIgMTIuNzJsMy41My02LjA5LTEuMTktLjY5LTMuNTIgMi4wNHY0LjA2eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zLjc1IDcuOThMMCA1LjgxdjkuMmw3Ljk3IDQuNnYtNC4zM2wtNC4yMi0yLjQ0em05LjEzLTEuMmwzLjc2LTIuMTdMOC42NiAwIC42OCA0LjYxbDMuNzYgMi4xNyA0LjIyLTIuNDR6TTkuMzUgMTkuNjFsNy45OC00LjZ2LTkuMmwtMy43NiAyLjE3djQuODZsLTQuMjIgMi40NHoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(17, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Build');
			})
		);

		fns.push(
			this.addEntry(dt + 'gradle app engine plugin', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Gradle App\nEnginge Plugin', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Gradle App Enginge Plugin');
			})
		);

		fns.push(
			this.addEntry(dt + 'gradle app engine plugin', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 220, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Gradle App Enginge Plugin', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Gradle App Enginge Plugin');
			})
		);

		fns.push(
			this.addEntry(dt + 'gradle app engine plugin', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 228, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Gradle App Enginge Plugin', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Gradle App Enginge Plugin');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for visual studio', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Tools for\nVisual Studio', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for Visual Studio');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for visual studio', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 230, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Tools for Visual Studio', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for Visual Studio');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for visual studio', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 238, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Tools for Visual Studio', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for Visual Studio');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud source repositories', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Source\nRepositories', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Source Repositories');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud source repositories', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 220, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Source Repositories', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Source Repositories');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud source repositories', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 228, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Source Repositories', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Source Repositories');
			})
		);

		fns.push(
			this.addEntry(dt + 'maven app engine plugin', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Maven App\nEngine Plugin', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Maven App Engine Plugin');
			})
		);

		fns.push(
			this.addEntry(dt + 'maven app engine plugin', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 210, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Maven App Engine Plugin', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Maven App Engine Plugin');
			})
		);

		fns.push(
			this.addEntry(dt + 'maven app engine plugin', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 218, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Maven App Engine Plugin', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Maven App Engine Plugin');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for eclipse', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Tools\nfor Eclipse', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for Eclipse');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for eclipse', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 200, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Tools for Eclipse', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for Eclipse');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for eclipse', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 208, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Tools for Eclipse', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for Eclipse');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for intellij', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Tools\nfor IntelliJ', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for IntelliJ');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for intellij', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 190, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Tools for IntelliJ', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for IntelliJ');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for intellij', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 198, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Tools for IntelliJ', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for IntelliJ');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud test lab', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 120, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud\nTest Lab', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Test Lab');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud test lab', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 160, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Test Lab', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Test Lab');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud test lab', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 168, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Test Lab', 
			    		new mxGeometry(0, 0, 30, 30), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 15);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Test Lab');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for powershell', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Cloud Tools for\nPowerShell', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for PowerShell');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for powershell', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 220, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Tools for PowerShell', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for PowerShell');
			})
		);

		fns.push(
			this.addEntry(dt + 'cloud tools for powershell', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 228, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Tools for PowerShell', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Tools for PowerShell');
			})
		);

		fns.push(
			this.addEntry(dt + 'ide plugins integrated development environment', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('IDE Plugins', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'IDE Plugins');
			})
		);

		fns.push(
			this.addEntry(dt + 'ide plugins integrated development environment', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>IDE Plugins', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'IDE Plugins');
			})
		);

		fns.push(
			this.addEntry(dt + 'ide plugins integrated development environment', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>IDE Plugins', 
			    		new mxGeometry(0, 0, 30, 16), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 22);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'IDE Plugins');
			})
		);

		fns.push(
			this.addEntry(dt + 'artifact registry', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 130, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('Artifact\nRegistry', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIxLjk5OTAwMDU0OTMxNjQwNiIgaGVpZ2h0PSIyMC4zOTM5OTkwOTk3MzE0NDUiIHZpZXdCb3g9IjAgMCAyMS45OTkwMDA1NDkzMTY0MDYgMjAuMzkzOTk5MDk5NzMxNDQ1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUgMHYyLjQ1OEwxLjk5OSA0LjE5N3YxMi4wMUw1IDE3LjkzOHYyLjQ1NmwtNS0yLjg4N1YyLjg4NnptMTIgMGw0Ljk5OSAyLjg4NnYxNC42MjFMMTcgMjAuMzk0di0yLjQ1NmwzLTEuNzMxVjQuMTk3bC0zLTEuNzM5em0tNi4wMTYgNi42NzNsMi45NDctMS42NDYtMi45NDctMS42NDYtMi45NDcgMS42NDZ6bTMuMjY4LTEuMDk2bC0yLjg3MSAxLjY3OHYzLjI4N2wyLjg3MS0xLjY3NnpNNy43NzMgOC44NjZsMi44NzEgMS42NzRWNy4yNTZMNy43NzMgNS41Nzd6bS0uMjEyIDMuODc4bDIuODItMS42NDYtMi44Mi0xLjY0Ni0yLjgyIDEuNjQ2em0zLjEzMi0xLjA5OGwtMi44NzEgMS42Nzh2My4yODdsMi44NzEtMS42NzZ6bS02LjI2NCAzLjI4OUw3LjMgMTYuNjA5di0zLjI4NWwtMi44NzEtMS42Nzl6bTEwLjAyOS0yLjE5MWwyLjgyLTEuNjQ2LTIuODItMS42NDYtMi44MiAxLjY0NnptMy4xMzItMS4wOThsLTIuODcxIDEuNjc4djMuMjg3bDIuODcxLTEuNjc2em0tNi4yNjQgMy4yODlsMi44NzEgMS42NzR2LTMuMjg1bC0yLjg3MS0xLjY3OXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Artifact Registry');
			})
		);

		fns.push(
			this.addEntry(dt + 'artifact registry', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 60), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Artifact Registry', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIxLjk5OTAwMDU0OTMxNjQwNiIgaGVpZ2h0PSIyMC4zOTM5OTkwOTk3MzE0NDUiIHZpZXdCb3g9IjAgMCAyMS45OTkwMDA1NDkzMTY0MDYgMjAuMzkzOTk5MDk5NzMxNDQ1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUgMHYyLjQ1OEwxLjk5OSA0LjE5N3YxMi4wMUw1IDE3LjkzOHYyLjQ1NmwtNS0yLjg4N1YyLjg4NnptMTIgMGw0Ljk5OSAyLjg4NnYxNC42MjFMMTcgMjAuMzk0di0yLjQ1NmwzLTEuNzMxVjQuMTk3bC0zLTEuNzM5em0tNi4wMTYgNi42NzNsMi45NDctMS42NDYtMi45NDctMS42NDYtMi45NDcgMS42NDZ6bTMuMjY4LTEuMDk2bC0yLjg3MSAxLjY3OHYzLjI4N2wyLjg3MS0xLjY3NnpNNy43NzMgOC44NjZsMi44NzEgMS42NzRWNy4yNTZMNy43NzMgNS41Nzd6bS0uMjEyIDMuODc4bDIuODItMS42NDYtMi44Mi0xLjY0Ni0yLjgyIDEuNjQ2em0zLjEzMi0xLjA5OGwtMi44NzEgMS42Nzh2My4yODdsMi44NzEtMS42NzZ6bS02LjI2NCAzLjI4OUw3LjMgMTYuNjA5di0zLjI4NWwtMi44NzEtMS42Nzl6bTEwLjAyOS0yLjE5MWwyLjgyLTEuNjQ2LTIuODItMS42NDYtMi44MiAxLjY0NnptMy4xMzItMS4wOThsLTIuODcxIDEuNjc4djMuMjg3bDIuODcxLTEuNjc2em0tNi4yNjQgMy4yODlsMi44NzEgMS42NzR2LTMuMjg1bC0yLjg3MS0xLjY3OXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Artifact Registry');
			})
		);

		fns.push(
			this.addEntry(dt + 'artifact registry', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 178, 68), 
			    		'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Artifact Registry', 
			    		new mxGeometry(0, 0, 30, 27), 
			    		'editableCssRules=.*;html=1;fontColor=#999999;shape=image;verticalLabelPosition=middle;labelBackgroundColor=#ffffff;verticalAlign=middle;labelPosition=right;align=left;spacingLeft=20;part=1;points=[];imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIxLjk5OTAwMDU0OTMxNjQwNiIgaGVpZ2h0PSIyMC4zOTM5OTkwOTk3MzE0NDUiIHZpZXdCb3g9IjAgMCAyMS45OTkwMDA1NDkzMTY0MDYgMjAuMzkzOTk5MDk5NzMxNDQ1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUgMHYyLjQ1OEwxLjk5OSA0LjE5N3YxMi4wMUw1IDE3LjkzOHYyLjQ1NmwtNS0yLjg4N1YyLjg4NnptMTIgMGw0Ljk5OSAyLjg4NnYxNC42MjFMMTcgMjAuMzk0di0yLjQ1NmwzLTEuNzMxVjQuMTk3bC0zLTEuNzM5em0tNi4wMTYgNi42NzNsMi45NDctMS42NDYtMi45NDctMS42NDYtMi45NDcgMS42NDZ6bTMuMjY4LTEuMDk2bC0yLjg3MSAxLjY3OHYzLjI4N2wyLjg3MS0xLjY3NnpNNy43NzMgOC44NjZsMi44NzEgMS42NzRWNy4yNTZMNy43NzMgNS41Nzd6bS0uMjEyIDMuODc4bDIuODItMS42NDYtMi44Mi0xLjY0Ni0yLjgyIDEuNjQ2em0zLjEzMi0xLjA5OGwtMi44NzEgMS42Nzh2My4yODdsMi44NzEtMS42NzZ6bS02LjI2NCAzLjI4OUw3LjMgMTYuNjA5di0zLjI4NWwtMi44NzEtMS42Nzl6bTEwLjAyOS0yLjE5MWwyLjgyLTEuNjQ2LTIuODItMS42NDYtMi44MiAxLjY0NnptMy4xMzItMS4wOThsLTIuODcxIDEuNjc4djMuMjg3bDIuODcxLTEuNjc2em0tNi4yNjQgMy4yODlsMi44NzEgMS42NzR2LTMuMjg1bC0yLjg3MS0xLjY3OXoiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(15, 16);
			    icon1.vertex = true;	
		    	bg.insert(icon1);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Artifact Registry');
			})
		);

		this.addPalette('gcp2Developer Tools', 'GCP / Developer Tools', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2ExpandedProductCardsPalette = function()
	{
		var fns = [];
		var dt = 'gcp google cloud platform expanded product cards ';
		var sb = this;

		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards compute engine ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 150, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Compute Engine<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNyA3aDZ2Nkg3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05IDBoMnY0SDl6TTUgMGgydjRINXptOCAwaDJ2NGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSAxNmgydjRIOXptLTQgMGgydjRINXptOCAwaDJ2NGgtMnptMy01VjloNHYyem0wIDR2LTJoNHYyem0wLThWNWg0djJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTAgMTFWOWg0djJ6bTAgNHYtMmg0djJ6bTAtOFY1aDR2MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMyAzdjE0aDE0VjN6bTEyIDEySDVWNWgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAgMTBsLTMgM2g2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMyA3bC0zIDMgMyAzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Compute Engine');
			})
		);
		
		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards compute engine ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 158, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Compute Engine<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNyA3aDZ2Nkg3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05IDBoMnY0SDl6TTUgMGgydjRINXptOCAwaDJ2NGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSAxNmgydjRIOXptLTQgMGgydjRINXptOCAwaDJ2NGgtMnptMy01VjloNHYyem0wIDR2LTJoNHYyem0wLThWNWg0djJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTAgMTFWOWg0djJ6bTAgNHYtMmg0djJ6bTAtOFY1aDR2MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMyAzdjE0aDE0VjN6bTEyIDEySDVWNWgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAgMTBsLTMgM2g2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMyA3bC0zIDMgMyAzeiIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Compute Engine');
			})			
		);

		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards bigquery ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>BigQuery<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMTA0NTIyNzA1MDc4IiBoZWlnaHQ9IjIwLjAwMTA0NTIyNzA1MDc4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMC4wMDEwNDUyMjcwNTA3OCAyMC4wMDEwNDUyMjcwNTA3OCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00LjczIDguODN2Mi42M2E0LjkxIDQuOTEgMCAwIDAgMS43MSAxLjc0VjguODN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTcuODkgNi40MXY3LjUzQTcuNjIgNy42MiAwIDAgMCA5IDE0YTggOCAwIDAgMCAxIDBWNi40MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTEuNjQgOS44NnYzLjI5YTUgNSAwIDAgMCAxLjctMS44MlY5Ljg2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS43NCAxNC4zMmwtMS40MiAxLjQyYS40Mi40MiAwIDAgMCAwIC42bDMuNTQgMy41NGEuNDIuNDIgMCAwIDAgLjU5IDBsMS40My0xLjQzYS40Mi40MiAwIDAgMCAwLS41OWwtMy41NC0zLjU0YS40Mi40MiAwIDAgMC0uNiAwIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkgMGE5IDkgMCAxIDAgMCAxOEE5IDkgMCAxIDAgOSAwbTAgMTUuNjlhNi42OCA2LjY4IDAgMCAxIC4wMDctMTMuMzYgNi42OCA2LjY4IDAgMCAxIDQuNzI3IDExLjQwM0E2LjY4IDYuNjggMCAwIDEgOSAxNS42OSIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'BigQuery');
			})
		);
		
		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards bigquery ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>BigQuery<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMTA0NTIyNzA1MDc4IiBoZWlnaHQ9IjIwLjAwMTA0NTIyNzA1MDc4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMC4wMDEwNDUyMjcwNTA3OCAyMC4wMDEwNDUyMjcwNTA3OCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00LjczIDguODN2Mi42M2E0LjkxIDQuOTEgMCAwIDAgMS43MSAxLjc0VjguODN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTcuODkgNi40MXY3LjUzQTcuNjIgNy42MiAwIDAgMCA5IDE0YTggOCAwIDAgMCAxIDBWNi40MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTEuNjQgOS44NnYzLjI5YTUgNSAwIDAgMCAxLjctMS44MlY5Ljg2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS43NCAxNC4zMmwtMS40MiAxLjQyYS40Mi40MiAwIDAgMCAwIC42bDMuNTQgMy41NGEuNDIuNDIgMCAwIDAgLjU5IDBsMS40My0xLjQzYS40Mi40MiAwIDAgMCAwLS41OWwtMy41NC0zLjU0YS40Mi40MiAwIDAgMC0uNiAwIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkgMGE5IDkgMCAxIDAgMCAxOEE5IDkgMCAxIDAgOSAwbTAgMTUuNjlhNi42OCA2LjY4IDAgMCAxIC4wMDctMTMuMzYgNi42OCA2LjY4IDAgMCAxIDQuNzI3IDExLjQwM0E2LjY4IDYuNjggMCAwIDEgOSAxNS42OSIvPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'BigQuery');
			})			
		);

		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards app engine ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>App Engine<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2LjAyMDAwMDQ1Nzc2MzY3MiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSI4Ljk0MDY5NjcxNjMwODU5NGUtOCAwIDIwIDE2LjAyMDAwMDQ1Nzc2MzY3MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4zIDcuMjZsLTEuMjIgMS4yMkExLjcxIDEuNzEgMCAwIDEgMTAgMTEuNDlhMS43NCAxLjc0IDAgMCAxLTEuMzMtLjY0bC0xLjIyIDEuMjJhMy40MyAzLjQzIDAgMCAwIDUuOTg0LTEuMzgxQTMuNDMgMy40MyAwIDAgMCAxMi4zIDcuMjZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDMuNTJhNi4yNSA2LjI1IDAgMCAwIDAgMTIuNSA2LjI1IDYuMjUgMCAwIDAgMC0xMi41bTAgMTAuNzRhNC40NSA0LjQ1IDAgMCAxLTMuMTU3LTcuNTk3QTQuNDUgNC40NSAwIDAgMSAxNC40NCA5LjgyIDQuNDQgNC40NCAwIDAgMSAxMCAxNC4yNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xOS42MiA5LjE2bC0yLjU2LS44MWE3LjEgNy4xIDAgMCAxIC4xNyAxLjUzIDcuNjIgNy42MiAwIDAgMS0uMDggMS4wOGgyLjQ3YS40NC40NCAwIDAgMCAuMzgtLjQydi0xYS40NC40NCAwIDAgMC0uMzgtLjQyTTEwIDIuNzhhNy40OCA3LjQ4IDAgMCAxIDEuNS4xNUwxMC41OC4zOGMtLjA3LS4yMi0uMjEtLjM4LS40Mi0uMzhoLS4zOGEuNDUuNDUgMCAwIDAtLjQyLjM4bC0uOCAyLjU0QTcuNjQgNy42NCAwIDAgMSAxMCAyLjc4bS03LjIzIDcuMWE3LjEgNy4xIDAgMCAxIC4xNy0xLjUzbC0yLjU2LjgxYS40NC40NCAwIDAgMC0uMzguNDJ2MWEuNDQuNDQgMCAwIDAgLjM4LjQyaDIuNDdhNy42MiA3LjYyIDAgMCAxLS4wOC0xLjA4Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDcuMjZhMi41IDIuNSAwIDEgMCAwIDUgMi41IDIuNSAwIDEgMCAwLTV6bTAgMy43NWExLjI1IDEuMjUgMCAxIDEgMC0yLjUgMS4yNSAxLjI1IDAgMCAxIDEuMjUgMS4yNUExLjI1IDEuMjUgMCAwIDEgMTAgMTEuMDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'App Engine');
			})
		);
		
		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards app engine ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>App Engine<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2LjAyMDAwMDQ1Nzc2MzY3MiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSI4Ljk0MDY5NjcxNjMwODU5NGUtOCAwIDIwIDE2LjAyMDAwMDQ1Nzc2MzY3MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4zIDcuMjZsLTEuMjIgMS4yMkExLjcxIDEuNzEgMCAwIDEgMTAgMTEuNDlhMS43NCAxLjc0IDAgMCAxLTEuMzMtLjY0bC0xLjIyIDEuMjJhMy40MyAzLjQzIDAgMCAwIDUuOTg0LTEuMzgxQTMuNDMgMy40MyAwIDAgMCAxMi4zIDcuMjZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDMuNTJhNi4yNSA2LjI1IDAgMCAwIDAgMTIuNSA2LjI1IDYuMjUgMCAwIDAgMC0xMi41bTAgMTAuNzRhNC40NSA0LjQ1IDAgMCAxLTMuMTU3LTcuNTk3QTQuNDUgNC40NSAwIDAgMSAxNC40NCA5LjgyIDQuNDQgNC40NCAwIDAgMSAxMCAxNC4yNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xOS42MiA5LjE2bC0yLjU2LS44MWE3LjEgNy4xIDAgMCAxIC4xNyAxLjUzIDcuNjIgNy42MiAwIDAgMS0uMDggMS4wOGgyLjQ3YS40NC40NCAwIDAgMCAuMzgtLjQydi0xYS40NC40NCAwIDAgMC0uMzgtLjQyTTEwIDIuNzhhNy40OCA3LjQ4IDAgMCAxIDEuNS4xNUwxMC41OC4zOGMtLjA3LS4yMi0uMjEtLjM4LS40Mi0uMzhoLS4zOGEuNDUuNDUgMCAwIDAtLjQyLjM4bC0uOCAyLjU0QTcuNjQgNy42NCAwIDAgMSAxMCAyLjc4bS03LjIzIDcuMWE3LjEgNy4xIDAgMCAxIC4xNy0xLjUzbC0yLjU2LjgxYS40NC40NCAwIDAgMC0uMzguNDJ2MWEuNDQuNDQgMCAwIDAgLjM4LjQyaDIuNDdhNy42MiA3LjYyIDAgMCAxLS4wOC0xLjA4Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDcuMjZhMi41IDIuNSAwIDEgMCAwIDUgMi41IDIuNSAwIDEgMCAwLTV6bTAgMy43NWExLjI1IDEuMjUgMCAxIDEgMC0yLjUgMS4yNSAxLjI1IDAgMCAxIDEuMjUgMS4yNUExLjI1IDEuMjUgMCAwIDEgMTAgMTEuMDJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'App Engine');
			})			
		);

		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards dataflow ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Dataflow<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjUxOTk5OTUwNDA4OTM1NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjUxOTk5OTUwNDA4OTM1NSAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjM3IDIuMDNsLTEuNzIuOTYgMS41MiAxLjUtLjAyIDEuNzMgMS4wMi4wMS4wMi0xLjczIDQuMjQgMi41Ni0uMDEgMS4wNyAxLjc3LjAzVjYuMTFMOS4wNSAzLjA0bC0uMjctLjk0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNy4zNiAyLjAzbC0xLjQyLjM1LS4yOS42MUwuMzkgNS45Mi4zNiA3Ljk3IDIuMTQgOGwuMDItMS4wNyA0LjMxLTIuNDUtLjAyIDEuNzMuODYuMDEuMDYtNC4xOXoiLz4mI3hhOwkJPGcgY2xhc3M9InN0MSI+JiN4YTsJCQk8cGF0aCBkPSJNNy4zNiAyLjAzTDMuOTUgMCAyLjIxLjk1bDMuNDQgMi4wNCAxLjcyLS45NnptLjcxIDExLjc2bC0xLjcyLS4wMi0uMDIgMS43Mi44MiAyLjQ4IDEuNDItLjEyLjI5LS44NSA1LjI3LTIuOTMuMDMtMi4wOS0xLjc5LS4wMi0uMDIgMS4xLTQuMyAyLjQ1eiIvPiYjeGE7CQkJPHBhdGggZD0iTTcuMTUgMTcuOTdsLTMuNDYgMS45NGgtLjA1bC0xLjY2LS45OSAzLjQ5LTEuOTYgMS42OCAxLjAxeiIvPiYjeGE7CQk8L2c+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMC44OC4wOWgtLjA1TDcuMzcgMi4wM2wxLjY4IDEuMDEgMy40OS0xLjk2ek0xMC42MiAyMGgtLjA1bC0zLjQyLTIuMDNoMCAwIDBsMS43Mi0uOTYgMy40NCAyLjA0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNLjMzIDEzLjg5di0yaDEuNzZsLS4wMSAxLjA0IDQuMjUgMi41Ni4wMi0xLjcyLjg2LjAxLS4wNiA0LjE4LTEuNjgtMXoiLz4mI3hhOwk8L2c+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iMTMuMzgiIGN5PSIxMC4wNCIgcj0iMS4xNCIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjEuMTQiIGN5PSI5Ljg4IiByPSIxLjE0Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iNy4zMiIgY3k9IjcuOTkiIHI9IjEuMTQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSI3LjIzIiBjeT0iMTIiIHI9IjEuMTQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataflow');
			})
		);
		
		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards dataflow ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Dataflow<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjUxOTk5OTUwNDA4OTM1NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjUxOTk5OTUwNDA4OTM1NSAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjM3IDIuMDNsLTEuNzIuOTYgMS41MiAxLjUtLjAyIDEuNzMgMS4wMi4wMS4wMi0xLjczIDQuMjQgMi41Ni0uMDEgMS4wNyAxLjc3LjAzVjYuMTFMOS4wNSAzLjA0bC0uMjctLjk0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNy4zNiAyLjAzbC0xLjQyLjM1LS4yOS42MUwuMzkgNS45Mi4zNiA3Ljk3IDIuMTQgOGwuMDItMS4wNyA0LjMxLTIuNDUtLjAyIDEuNzMuODYuMDEuMDYtNC4xOXoiLz4mI3hhOwkJPGcgY2xhc3M9InN0MSI+JiN4YTsJCQk8cGF0aCBkPSJNNy4zNiAyLjAzTDMuOTUgMCAyLjIxLjk1bDMuNDQgMi4wNCAxLjcyLS45NnptLjcxIDExLjc2bC0xLjcyLS4wMi0uMDIgMS43Mi44MiAyLjQ4IDEuNDItLjEyLjI5LS44NSA1LjI3LTIuOTMuMDMtMi4wOS0xLjc5LS4wMi0uMDIgMS4xLTQuMyAyLjQ1eiIvPiYjeGE7CQkJPHBhdGggZD0iTTcuMTUgMTcuOTdsLTMuNDYgMS45NGgtLjA1bC0xLjY2LS45OSAzLjQ5LTEuOTYgMS42OCAxLjAxeiIvPiYjeGE7CQk8L2c+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMC44OC4wOWgtLjA1TDcuMzcgMi4wM2wxLjY4IDEuMDEgMy40OS0xLjk2ek0xMC42MiAyMGgtLjA1bC0zLjQyLTIuMDNoMCAwIDBsMS43Mi0uOTYgMy40NCAyLjA0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNLjMzIDEzLjg5di0yaDEuNzZsLS4wMSAxLjA0IDQuMjUgMi41Ni4wMi0xLjcyLjg2LjAxLS4wNiA0LjE4LTEuNjgtMXoiLz4mI3hhOwk8L2c+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iMTMuMzgiIGN5PSIxMC4wNCIgcj0iMS4xNCIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjEuMTQiIGN5PSI5Ljg4IiByPSIxLjE0Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iNy4zMiIgY3k9IjcuOTkiIHI9IjEuMTQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSI3LjIzIiBjeT0iMTIiIHI9IjEuMTQiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dataflow');
			})			
		);

		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards kubernetes engine ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 170, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Kubernetes Engine<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyOS45MjU5OTcyMzE3OTM4IiBoZWlnaHQ9IjM3OC4yODQ5OTAzMTEyNzg4IiB2aWV3Qm94PSIwIDAgODcuMjkyOTk5MjY3NTc4MTIgMTAwLjA4Nzk5NzQzNjUyMzQ0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00My43NTEgMEwwIDI1LjQ2NXYyLjU4OCA0Ni45Mmw0My43NTIgMjUuMTE1IDQzLjU0MS0yNS4xMjFWMjUuNDczem0yLjQzOCAxMS44NTNsMzIuMTAzIDE4Ljc4MlY2OS43N0w0My43MzkgODkuNzA1IDkgNjkuNzYyVjMwLjY0MWwzMi4xOS0xOC43MzZ2MTQuMTU0TDI0LjUwMyAzNi4xNTNsMTkuMTcyIDExLjUwMiAxOC44ODYtMTEuNTU0LTE2LjM3Mi0xMC4wMjR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIyLjAyNSA0MC40OTZsLjE2NiAxOS4xNDMtMTMuMjQ3IDcuMzN2Mi43NDJsMi42MzcgMS41MTQgMTIuNjQ4LTYuOTk5IDE2Ljk2MSAxMC42MDJWNTEuOTkzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02NS4zNDQgNDAuMjZMNDYuMTg5IDUxLjk3OXYyMi44NDdsMTYuODk5LTEwLjU3NiAxMi41MzkgNi45NzQgMi42MDktMS41MDV2LTIuNzY1bC0xMi43ODQtNy4xMTJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Kubernetes Engine');
			})
		);
		
		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards kubernetes engine ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 178, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Kubernetes Engine<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyOS45MjU5OTcyMzE3OTM4IiBoZWlnaHQ9IjM3OC4yODQ5OTAzMTEyNzg4IiB2aWV3Qm94PSIwIDAgODcuMjkyOTk5MjY3NTc4MTIgMTAwLjA4Nzk5NzQzNjUyMzQ0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00My43NTEgMEwwIDI1LjQ2NXYyLjU4OCA0Ni45Mmw0My43NTIgMjUuMTE1IDQzLjU0MS0yNS4xMjFWMjUuNDczem0yLjQzOCAxMS44NTNsMzIuMTAzIDE4Ljc4MlY2OS43N0w0My43MzkgODkuNzA1IDkgNjkuNzYyVjMwLjY0MWwzMi4xOS0xOC43MzZ2MTQuMTU0TDI0LjUwMyAzNi4xNTNsMTkuMTcyIDExLjUwMiAxOC44ODYtMTEuNTU0LTE2LjM3Mi0xMC4wMjR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIyLjAyNSA0MC40OTZsLjE2NiAxOS4xNDMtMTMuMjQ3IDcuMzN2Mi43NDJsMi42MzcgMS41MTQgMTIuNjQ4LTYuOTk5IDE2Ljk2MSAxMC42MDJWNTEuOTkzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02NS4zNDQgNDAuMjZMNDYuMTg5IDUxLjk3OXYyMi44NDdsMTYuODk5LTEwLjU3NiAxMi41MzkgNi45NzQgMi42MDktMS41MDV2LTIuNzY1bC0xMi43ODQtNy4xMTJ6Ii8+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Kubernetes Engine');
			})			
		);

		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards cloud storage ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Storage<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMGgyMHY3SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE4IDBoMnY3aC0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOCA3bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAwaDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAzaDZ2MUg0eiIvPiYjeGE7CQk8cmVjdCB4PSIxMyIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEuNSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCA5aDIwdjdIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTggOWgydjdoLTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE4IDE2bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA5aDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAxMmg2djFINHoiLz4mI3hhOwkJPHJlY3QgeD0iMTMiIHk9IjExIiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiByeD0iMS41Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Storage');
			})
		);
		
		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards cloud storage ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Storage<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMGgyMHY3SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE4IDBoMnY3aC0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOCA3bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAwaDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAzaDZ2MUg0eiIvPiYjeGE7CQk8cmVjdCB4PSIxMyIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEuNSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCA5aDIwdjdIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTggOWgydjdoLTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE4IDE2bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA5aDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAxMmg2djFINHoiLz4mI3hhOwkJPHJlY3QgeD0iMTMiIHk9IjExIiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiByeD0iMS41Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Storage');
			})			
		);

		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards cloud bigtable ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Bigtable<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1Njk3Nzg0NDIzODI4IiBoZWlnaHQ9IjIwLjAwOTI1NjM2MjkxNTA0IiB2aWV3Qm94PSItMC4wMDA0MjE5NjUxMTY0MDIxMzQzIDAuMDAwMDc0Njk5NTIxMDY0NzU4MyAxNy45NTY5Nzc4NDQyMzgyOCAyMC4wMDkyNTYzNjI5MTUwNCI+JiN4YTsJPHN0eWxlPiYjeGE7CQkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJCS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgZmlsbC1ydWxlPSJldmVub2RkIj4mI3hhOwkJPHBhdGggZD0iTTEzLjE5NiA0LjQ0N2wtNC4yMi0yLjUxYTIuODYgMi44NiAwIDAgMS0xLjI1LTEuNzFjMCAwIC4xNi0uMzIuMzgtLjJsNS4yNSAzLjFjLjYzLjM3LjI0IDIgLjI0IDJhLjc3Ljc3IDAgMCAwLS40LS42OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE0LjQ2NiAxMC42ODdhLjM1LjM1IDAgMCAxLS4xNi4zM2wtMSAuNjh2LTcuOTVjMC0uMjcuMTctLjU2LS4wNi0uN2wuOTIuNjhhLjczLjczIDAgMCAxIC4zNS42NXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDExLjU5N2EuMzYuMzYgMCAwIDEtLjItLjA2bC0zLjQ2LTIuMDZ2LjlsMy42NiAyLjE4LjI5LS41N3MtLjIyLS4zOS0uMjktLjM5em0uMiAxLjhhLjM2LjM2IDAgMCAxLS40IDBsLTMuNDYtMi4wNnYuNjZhLjQyLjQyIDAgMCAwIC4xOS4zNWwzLjI4IDJhLjM3LjM3IDAgMCAwIC4zOCAwIDIgMiAwIDAgMCAuMi0uNTJsLS4xOS0uMzl6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik04Ljk3NiAxMC43MjdsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzRsLTMuMjgtMmEuMzcuMzcgMCAwIDAtLjM4IDBsLTMuMjggMmEuNDEuNDEgMCAwIDAtLjE5LjM0di40M3oiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDkuODI3bC0zLjQ3LTIuMDVhLjQxLjQxIDAgMCAwLS4xOS4zNHYuNDNsMy42NiAyLjE4LjI4LS41NnoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPGcgY2xhc3M9InN0MiI+JiN4YTsJCQk8cGF0aCBkPSJNOC45NzYgMTEuNTk3djFsMy42Ni0yLjE4di0uOWwtMy40NiAyLjAyYS42NS42NSAwIDAgMS0uMi4wNnptLjIgMS44YS4zNi4zNiAwIDAgMS0uMi4wNnYuOWEuNS41IDAgMCAwIC4yMS0uMDVsMy4yOC0yYS4zOS4zOSAwIDAgMCAuMTktLjM1di0uNjZ6Ii8+JiN4YTsJCQk8cGF0aCBkPSJNMTIuNDQ2IDcuNzc3bC0zLjQ3IDIuMDV2LjlsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzR6Ii8+JiN4YTsJCTwvZz4mI3hhOwkJPHBhdGggZD0iTTQuNzU2IDE1LjUyN2w0LjE1IDIuNDdhMi43MiAyLjcyIDAgMCAxIDEuMjggMS44LjE4LjE4IDAgMCAxLS4yOC4xOGwtNS40NS0zLjIzYy0uNTMtLjMyLS4wNy0xLjg4LS4wNy0xLjg4YS43Ny43NyAwIDAgMCAuMzcuNjZ6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik0zLjQ4NiAxNS43Mjd2LTYuNTZhLjQxLjQxIDAgMCAxIC4xOS0uMzNsMS0uNTl2Ny45MWMwIC4yNyAwIC42OS4yMS44M2wtMS4wNi0uNjZhLjc1Ljc1IDAgMCAxLS4zNC0uNnoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTM2IDMuNDU3YS43NS43NSAwIDAgMC0uNzQgMGwtNC4yIDIuNTRhMi42MyAyLjYzIDAgMCAxLTIuMDguMjYuMjMuMjMgMCAwIDEgMC0uNGMuMTgtLjA5IDYuMzItMy43NCA2LjMyLTMuNzQuMjMtLjE0Ljc0IDEuMzkuNzQgMS4zOXoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTI2IDIuMDc3bDUuMzIgMy4xNWEuMzcuMzcgMCAwIDEgLjIuMzF2MS4xOGwtNi42Ny0zLjk2YS43NS43NSAwIDAgMC0uNzQgMGwxLjE4LS42OWEuNzEuNzEgMCAwIDEgLjczIDB6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xMC43OTYgMTYuNDg3YS43My43MyAwIDAgMCAuNzQgMGw0LjItMi40OWEyLjYzIDIuNjMgMCAwIDEgMi4xLS4yNS4yMS4yMSAwIDAgMSAwIC4zOGwtNi4zMyAzLjc1Yy0uMjIuMTQtLjc0LTEuNC0uNzQtMS40eiIgY2xhc3M9InN0MCIvPiYjeGE7CQk8cGF0aCBkPSJNNS40ODYgMTQuNzQ3YS41Ni41NiAwIDAgMS0uMTctLjMzdi0xLjE2bDYuNjYgMy45M2EuNjkuNjkgMCAwIDAgLjczIDBsLTEuMTguN2EuNy43IDAgMCAxLS43NCAweiIgY2xhc3M9InN0MSIvPiYjeGE7CQk8cGF0aCBkPSJNMy4yMzYgNy44MDdhLjc2Ljc2IDAgMCAwLS4zNy42NXY1YTIuNzUgMi43NSAwIDAgMS0uODcgMiAuMTguMTggMCAwIDEtLjMtLjEzdi03LjU2YzAtLjI4IDEuNTQgMCAxLjU0IDB6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik02Ljc0NiA0LjUxN2EuMzQuMzQgMCAwIDEgLjM2IDBsMSAuNTktNi4wOCAzLjU2YS43Ny43NyAwIDAgMC0uMzcuNjZ2LTEuMzlhLjcyLjcyIDAgMCAxIC4zOC0uNjR6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xNS4xNDYgMTEuNDM3di01YTIuODEgMi44MSAwIDAgMSAuODQtMmMwIDAgLjMzLS4xMS4zMS4yMXMwIDcuMzcgMCA3LjM3Yy0uMzEuMzctMS42MSAwLTEuNjEgMGEuODEuODEgMCAwIDAgLjQ2LS41OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE1Ljk3NiAxMi42MDdsLTQuNzQgMi44NWEuMzUuMzUgMCAwIDEtLjM3IDBsLTEtLjU3IDYuMTEtMy42N2EuNzcuNzcgMCAwIDAgLjM3LS42NnYxLjQ0Yy0uMDIuMjMtLjM3LjYxLS4zNy42MXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Bigtable');
			})
		);
		
		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards cloud bigtable ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Bigtable<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1Njk3Nzg0NDIzODI4IiBoZWlnaHQ9IjIwLjAwOTI1NjM2MjkxNTA0IiB2aWV3Qm94PSItMC4wMDA0MjE5NjUxMTY0MDIxMzQzIDAuMDAwMDc0Njk5NTIxMDY0NzU4MyAxNy45NTY5Nzc4NDQyMzgyOCAyMC4wMDkyNTYzNjI5MTUwNCI+JiN4YTsJPHN0eWxlPiYjeGE7CQkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJCS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgZmlsbC1ydWxlPSJldmVub2RkIj4mI3hhOwkJPHBhdGggZD0iTTEzLjE5NiA0LjQ0N2wtNC4yMi0yLjUxYTIuODYgMi44NiAwIDAgMS0xLjI1LTEuNzFjMCAwIC4xNi0uMzIuMzgtLjJsNS4yNSAzLjFjLjYzLjM3LjI0IDIgLjI0IDJhLjc3Ljc3IDAgMCAwLS40LS42OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE0LjQ2NiAxMC42ODdhLjM1LjM1IDAgMCAxLS4xNi4zM2wtMSAuNjh2LTcuOTVjMC0uMjcuMTctLjU2LS4wNi0uN2wuOTIuNjhhLjczLjczIDAgMCAxIC4zNS42NXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDExLjU5N2EuMzYuMzYgMCAwIDEtLjItLjA2bC0zLjQ2LTIuMDZ2LjlsMy42NiAyLjE4LjI5LS41N3MtLjIyLS4zOS0uMjktLjM5em0uMiAxLjhhLjM2LjM2IDAgMCAxLS40IDBsLTMuNDYtMi4wNnYuNjZhLjQyLjQyIDAgMCAwIC4xOS4zNWwzLjI4IDJhLjM3LjM3IDAgMCAwIC4zOCAwIDIgMiAwIDAgMCAuMi0uNTJsLS4xOS0uMzl6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik04Ljk3NiAxMC43MjdsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzRsLTMuMjgtMmEuMzcuMzcgMCAwIDAtLjM4IDBsLTMuMjggMmEuNDEuNDEgMCAwIDAtLjE5LjM0di40M3oiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDkuODI3bC0zLjQ3LTIuMDVhLjQxLjQxIDAgMCAwLS4xOS4zNHYuNDNsMy42NiAyLjE4LjI4LS41NnoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPGcgY2xhc3M9InN0MiI+JiN4YTsJCQk8cGF0aCBkPSJNOC45NzYgMTEuNTk3djFsMy42Ni0yLjE4di0uOWwtMy40NiAyLjAyYS42NS42NSAwIDAgMS0uMi4wNnptLjIgMS44YS4zNi4zNiAwIDAgMS0uMi4wNnYuOWEuNS41IDAgMCAwIC4yMS0uMDVsMy4yOC0yYS4zOS4zOSAwIDAgMCAuMTktLjM1di0uNjZ6Ii8+JiN4YTsJCQk8cGF0aCBkPSJNMTIuNDQ2IDcuNzc3bC0zLjQ3IDIuMDV2LjlsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzR6Ii8+JiN4YTsJCTwvZz4mI3hhOwkJPHBhdGggZD0iTTQuNzU2IDE1LjUyN2w0LjE1IDIuNDdhMi43MiAyLjcyIDAgMCAxIDEuMjggMS44LjE4LjE4IDAgMCAxLS4yOC4xOGwtNS40NS0zLjIzYy0uNTMtLjMyLS4wNy0xLjg4LS4wNy0xLjg4YS43Ny43NyAwIDAgMCAuMzcuNjZ6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik0zLjQ4NiAxNS43Mjd2LTYuNTZhLjQxLjQxIDAgMCAxIC4xOS0uMzNsMS0uNTl2Ny45MWMwIC4yNyAwIC42OS4yMS44M2wtMS4wNi0uNjZhLjc1Ljc1IDAgMCAxLS4zNC0uNnoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTM2IDMuNDU3YS43NS43NSAwIDAgMC0uNzQgMGwtNC4yIDIuNTRhMi42MyAyLjYzIDAgMCAxLTIuMDguMjYuMjMuMjMgMCAwIDEgMC0uNGMuMTgtLjA5IDYuMzItMy43NCA2LjMyLTMuNzQuMjMtLjE0Ljc0IDEuMzkuNzQgMS4zOXoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTI2IDIuMDc3bDUuMzIgMy4xNWEuMzcuMzcgMCAwIDEgLjIuMzF2MS4xOGwtNi42Ny0zLjk2YS43NS43NSAwIDAgMC0uNzQgMGwxLjE4LS42OWEuNzEuNzEgMCAwIDEgLjczIDB6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xMC43OTYgMTYuNDg3YS43My43MyAwIDAgMCAuNzQgMGw0LjItMi40OWEyLjYzIDIuNjMgMCAwIDEgMi4xLS4yNS4yMS4yMSAwIDAgMSAwIC4zOGwtNi4zMyAzLjc1Yy0uMjIuMTQtLjc0LTEuNC0uNzQtMS40eiIgY2xhc3M9InN0MCIvPiYjeGE7CQk8cGF0aCBkPSJNNS40ODYgMTQuNzQ3YS41Ni41NiAwIDAgMS0uMTctLjMzdi0xLjE2bDYuNjYgMy45M2EuNjkuNjkgMCAwIDAgLjczIDBsLTEuMTguN2EuNy43IDAgMCAxLS43NCAweiIgY2xhc3M9InN0MSIvPiYjeGE7CQk8cGF0aCBkPSJNMy4yMzYgNy44MDdhLjc2Ljc2IDAgMCAwLS4zNy42NXY1YTIuNzUgMi43NSAwIDAgMS0uODcgMiAuMTguMTggMCAwIDEtLjMtLjEzdi03LjU2YzAtLjI4IDEuNTQgMCAxLjU0IDB6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik02Ljc0NiA0LjUxN2EuMzQuMzQgMCAwIDEgLjM2IDBsMSAuNTktNi4wOCAzLjU2YS43Ny43NyAwIDAgMC0uMzcuNjZ2LTEuMzlhLjcyLjcyIDAgMCAxIC4zOC0uNjR6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xNS4xNDYgMTEuNDM3di01YTIuODEgMi44MSAwIDAgMSAuODQtMmMwIDAgLjMzLS4xMS4zMS4yMXMwIDcuMzcgMCA3LjM3Yy0uMzEuMzctMS42MSAwLTEuNjEgMGEuODEuODEgMCAwIDAgLjQ2LS41OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE1Ljk3NiAxMi42MDdsLTQuNzQgMi44NWEuMzUuMzUgMCAwIDEtLjM3IDBsLTEtLjU3IDYuMTEtMy42N2EuNzcuNzcgMCAwIDAgLjM3LS42NnYxLjQ0Yy0uMDIuMjMtLjM3LjYxLS4zNy42MXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Bigtable');
			})			
		);

		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards cloud pub sub ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Pub/Sub<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMxOTk5OTY5NDgyNDIyIiBoZWlnaHQ9IjIwLjAwMDAwMTkwNzM0ODYzMyIgdmlld0JveD0iMCAwIDE4LjMxOTk5OTY5NDgyNDIyIDIwLjAwMDAwMTkwNzM0ODYzMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxkZWZzPiYjeGE7CQk8ZmlsdGVyIGlkPSJBIiB4PSI0LjY0IiB5PSI0LjE5IiB3aWR0aD0iMTQuNzMiIGhlaWdodD0iMTIuNzYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4mI3hhOwkJCTxmZUZsb29kIGZsb29kLWNvbG9yPSIjZmZmIi8+JiN4YTsJCQk8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIvPiYjeGE7CQk8L2ZpbHRlcj4mI3hhOwkJPG1hc2sgaWQ9IkIiIHg9IjQuNjQiIHk9IjQuMTkiIHdpZHRoPSIxNC43MyIgaGVpZ2h0PSIxMi43NiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSI+JiN4YTsJCQk8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyLjIzIiByPSIzLjU4IiBmaWx0ZXI9InVybCgjQSkiLz4mI3hhOwkJPC9tYXNrPiYjeGE7CTwvZGVmcz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjIuMTkiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxOC4yOCIgcj0iMS43MiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBtYXNrPSJ1cmwoI0IpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMi44NCAtMikiPiYjeGE7CQk8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCguNSAtLjg3IC44NyAuNSAtNC41OSAyMC41MykiIGQ9Ik0xNC42OSAxMC4yMmgxLjU5djguMDRoLTEuNTl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIHRyYW5zZm9ybT0icm90YXRlKDMzMCA4LjUyMyAxNC4yNDQpIiBkPSJNNC40OSAxMy40NWg4LjA0djEuNTlINC40OXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTExLjIgNC4xOWgxLjU5djguMDRIMTEuMnoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxMC4yMyIgcj0iMi43OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIyLjE5IiBjeT0iMTQuMjUiIHI9IjIuMTkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSIxNC4yNSIgcj0iMi4xOSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI5LjE2IiBjeT0iMi4xOSIgcj0iMi4xOSIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Pub/Sub');
			})
		);
		
		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards cloud pub sub ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud Pub/Sub<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMxOTk5OTY5NDgyNDIyIiBoZWlnaHQ9IjIwLjAwMDAwMTkwNzM0ODYzMyIgdmlld0JveD0iMCAwIDE4LjMxOTk5OTY5NDgyNDIyIDIwLjAwMDAwMTkwNzM0ODYzMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxkZWZzPiYjeGE7CQk8ZmlsdGVyIGlkPSJBIiB4PSI0LjY0IiB5PSI0LjE5IiB3aWR0aD0iMTQuNzMiIGhlaWdodD0iMTIuNzYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4mI3hhOwkJCTxmZUZsb29kIGZsb29kLWNvbG9yPSIjZmZmIi8+JiN4YTsJCQk8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIvPiYjeGE7CQk8L2ZpbHRlcj4mI3hhOwkJPG1hc2sgaWQ9IkIiIHg9IjQuNjQiIHk9IjQuMTkiIHdpZHRoPSIxNC43MyIgaGVpZ2h0PSIxMi43NiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSI+JiN4YTsJCQk8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyLjIzIiByPSIzLjU4IiBmaWx0ZXI9InVybCgjQSkiLz4mI3hhOwkJPC9tYXNrPiYjeGE7CTwvZGVmcz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjIuMTkiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxOC4yOCIgcj0iMS43MiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBtYXNrPSJ1cmwoI0IpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMi44NCAtMikiPiYjeGE7CQk8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCguNSAtLjg3IC44NyAuNSAtNC41OSAyMC41MykiIGQ9Ik0xNC42OSAxMC4yMmgxLjU5djguMDRoLTEuNTl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIHRyYW5zZm9ybT0icm90YXRlKDMzMCA4LjUyMyAxNC4yNDQpIiBkPSJNNC40OSAxMy40NWg4LjA0djEuNTlINC40OXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTExLjIgNC4xOWgxLjU5djguMDRIMTEuMnoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxMC4yMyIgcj0iMi43OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIyLjE5IiBjeT0iMTQuMjUiIHI9IjIuMTkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSIxNC4yNSIgcj0iMi4xOSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI5LjE2IiBjeT0iMi4xOSIgcj0iMi4xOSIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud Pub/Sub');
			})			
		);

		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards cloud sql ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 140, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud SQL<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY1OTk5OTg0NzQxMjExIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTQuNjU5OTk5ODQ3NDEyMTEgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8c3R5bGU+JiN4YTsJCS5Ee2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTcuMzMgMTUuMzV2LTMuMDFMMCA4LjQ0djMuMDF6bTAgNC42NXYtMy4wMUwwIDEzLjA5djMuMDF6IiBjbGFzcz0ic3QyIEQiLz4mI3hhOwk8cGF0aCBkPSJNMTQuNjYgOC40NGwtNy4zMyAzLjl2My4wMWw3LjMzLTMuOXptMCA0LjY1bC03LjMzIDMuOVYyMGw3LjMzLTMuOXoiIGNsYXNzPSJzdDEgRCIvPiYjeGE7CTxwYXRoIGQ9Ik03LjMzIDB2My4wMWw3LjMzIDMuOVYzLjl6IiBjbGFzcz0ic3QwIEQiLz4mI3hhOwk8cGF0aCBkPSJNMCA2LjkxbDcuMzMtMy45VjBMMCAzLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOwk8cGF0aCBkPSJNNy4zMyAxMC43OVY3Ljc3TDAgMy44N3YzLjAyeiIgY2xhc3M9IkQgc3QyIi8+JiN4YTsJPHBhdGggZD0iTTE0LjY2IDMuODdsLTcuMzMgMy45djMuMDJsNy4zMy0zLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud SQL');
			})
		);
		
		fns.push(
			this.addEntry('gcp google cloud platform expanded product cards cloud sql ', function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, 148, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>Cloud SQL<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 42, 42), 'sketch=0;dashed=0;connectable=0;html=1;part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;shape=image;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY1OTk5OTg0NzQxMjExIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTQuNjU5OTk5ODQ3NDEyMTEgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8c3R5bGU+JiN4YTsJCS5Ee2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTcuMzMgMTUuMzV2LTMuMDFMMCA4LjQ0djMuMDF6bTAgNC42NXYtMy4wMUwwIDEzLjA5djMuMDF6IiBjbGFzcz0ic3QyIEQiLz4mI3hhOwk8cGF0aCBkPSJNMTQuNjYgOC40NGwtNy4zMyAzLjl2My4wMWw3LjMzLTMuOXptMCA0LjY1bC03LjMzIDMuOVYyMGw3LjMzLTMuOXoiIGNsYXNzPSJzdDEgRCIvPiYjeGE7CTxwYXRoIGQ9Ik03LjMzIDB2My4wMWw3LjMzIDMuOVYzLjl6IiBjbGFzcz0ic3QwIEQiLz4mI3hhOwk8cGF0aCBkPSJNMCA2LjkxbDcuMzMtMy45VjBMMCAzLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOwk8cGF0aCBkPSJNNy4zMyAxMC43OVY3Ljc3TDAgMy44N3YzLjAyeiIgY2xhc3M9IkQgc3QyIi8+JiN4YTsJPHBhdGggZD0iTTE0LjY2IDMuODdsLTcuMzMgMy45djMuMDJsNy4zMy0zLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOzwvc3ZnPg==;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cloud SQL');
			})			
		);

		this.addGCP2ExpandedMachineCard('App Engine', 'app_engine_icon', 1, 0.84, '10GB PD', '1', 'modifiers_standard_machine', '1', 'modifiers_storage', '1', 'modifiers_autoscaling', 150, dt + 'app engine machine', fns);
		this.addGCP2ExpandedMachineCard('Cloud Dataflow', 'cloud_dataflow_icon', 0.72, 1, '10GB PD', '1', 'modifiers_standard_machine', '1', 'modifiers_storage', '1', 'modifiers_autoscaling', 150, dt + 'app engine machine', fns);
		this.addGCP2ExpandedMachineCard('Kubernetes Engine', 'container_engine_icon', 0.88, 1, '10GB PD', '1', 'modifiers_standard_machine', '1', 'modifiers_storage', '1', 'modifiers_autoscaling', 150, dt + 'app engine machine', fns);
		this.addGCP2ExpandedMachineCard('Cloud Dataproc', 'cloud_dataproc_icon', 1, 0.92, '10GB PD', '1', 'modifiers_standard_machine', '1', 'modifiers_storage', '1', 'modifiers_autoscaling', 150, dt + 'app engine machine', fns);
		this.addGCP2ExpandedMachineCard('Compute Engine', 'compute_engine_icon', 1, 1, '10GB PD', '1', 'modifiers_standard_machine', '1', 'modifiers_storage', '1', 'modifiers_autoscaling', 150, dt + 'app engine machine', fns);
		
		this.addPalette('gcp2Expanded Product Cards', 'GCP / Expanded Product Cards', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2UserDeviceCardsPalette = function()
	{
		var dt = 'gcp google cloud platform user and device cards ';
		var fns = [];

		this.addGCP2UserDeviceCard('Application', 'application', 1, 0.8, 0, dt + 'application', fns);
		this.addGCP2UserDeviceCard('Beacon', 'beacon', 0.73, 1, 0, dt + 'beacon', fns);
		this.addGCP2UserDeviceCard('Circuit-Board', 'circuit_board', 1, 0.9, 15, dt + 'circuit board', fns);
		this.addGCP2UserDeviceCard('Database', 'database', 1, 0.9, 0, dt + 'database db', fns);
		this.addGCP2UserDeviceCard('Desktop', 'desktop', 1, 0.9, 0, dt + 'desktop', fns);
		this.addGCP2UserDeviceCard('Desktop and Mobile', 'desktop_and_mobile', 1, 0.66, 15, dt + 'desktop and mobile', fns);
		this.addGCP2UserDeviceCard('Game', 'game', 1, 0.54, 0, dt + 'game', fns);
		this.addGCP2UserDeviceCard('Gateway', 'gateway_icon', 1, 0.44, 0, dt + 'gateway icon', fns);
		this.addGCP2UserDeviceCard('Laptop', 'laptop', 1, 0.66, 0, dt + 'laptop', fns);
		this.addGCP2UserDeviceCard('Lightbulb', 'lightbulb', 0.7, 1, 0, dt + 'lighbulb', fns);
		this.addGCP2UserDeviceCard('List', 'list', 0.89, 1, 0, dt + 'list', fns);
		this.addGCP2UserDeviceCard('Live', 'live', 0.74, 1, 0, dt + 'live', fns);
		this.addGCP2UserDeviceCard('Local-Compute', 'compute_engine_icon', 1, 0.89, 15, dt + 'local compute', fns);
		this.addGCP2UserDeviceCard('Mobile Devices', 'mobile_devices', 1, 0.73, 15, dt + 'mobile devices', fns);
		this.addGCP2UserDeviceCard('Payment', 'payment', 1, 0.8, 0, dt + 'payment', fns);
		this.addGCP2UserDeviceCard('Phone', 'phone', 0.64, 1, 0, dt + 'phone', fns);
		this.addGCP2UserDeviceCard('Record', 'record', 1, 0.66, 0, dt + 'record', fns);
		this.addGCP2UserDeviceCard('Report', 'report', 1, 1, 0, dt + 'report', fns);
		this.addGCP2UserDeviceCard('Retail', 'retail', 1, 0.89, 0, dt + 'retail', fns);
		this.addGCP2UserDeviceCard('Speaker', 'speaker', 0.7, 1, 0, dt + 'speaker', fns);
		this.addGCP2UserDeviceCard('Storage', 'storage', 1, 0.8, 0, dt + 'storage', fns);
		this.addGCP2UserDeviceCard('Stream', 'stream', 1, 0.82, 0, dt + 'stream', fns);
		this.addGCP2UserDeviceCard('Users', 'users', 1, 0.63, 0, dt + 'users', fns);
		this.addGCP2UserDeviceCard('Webcam', 'webcam', 0.5, 1, 0, dt + 'webcam', fns);
		
		this.addPalette('gcp2User Device Cards', 'GCP / User and Device Cards', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	
	Sidebar.prototype.addGCP2ProductCardsPalette = function()
	{
		var dt = 'gcp google cloud platform product ';
		var fns = [];
		
		this.addGCP2ProductCardSet('Kubernetes', 'kubernetes_logo', 1, 0.97, 130, 130, dt + 'kubernetes', fns);
		this.addGCP2ProductCardSet('TensorFlow', 'tensorflow_logo', 0.94, 1, 130, 130, dt + 'tensorflow', fns);
		this.addGCP2ProductCardSet('Forseti\nSecurity', 'forseti_logo', 0.98, 1, 110, 150, dt + 'forseti', fns);
		this.addGCP2ProductCardSet('Istio', 'istio_logo', 0.67, 1, 80, 90, dt + 'forseti', fns);
		this.addGCP2ProductCardSet('Firebase', 'firebase', 0.72, 1, 100, 100, dt + 'firebase', fns);
		this.addGCP2ProductCardSet('Fastly', 'fastly', 1, 0.39, 100, 100, dt + 'fastly', fns);
		this.addGCP2ProductCardSet('AdMob', 'admob', 1, 1, 110, 110, dt + 'admob', fns);
		this.addGCP2ProductCardSet('Google Play\nGame Services', 'google_play_game_service', 1, 0.69, 150, 220, dt + 'google play game services', fns);
		this.addGCP2ProductCardSet('Campaign\nManager', 'campaign_manager', 1, 1, 120, 170, dt + 'campaign manager', fns);
		this.addGCP2ProductCardSet('Google\nAnalytics', 'google_analytics', 1, 1, 120, 160, dt + 'google analytics', fns);
		this.addGCP2ProductCardSet('Google\nAds', 'google_ads', 1, 1, 100, 130, dt + 'google ads', fns);
		this.addGCP2ProductCardSet('Avere Physical\nAppliance', 'avere', 1, 0.33, 150, 200, dt + 'avere physical appliance', fns);
		this.addGCP2ProductCardSet('Google\nAnalytics 360', 'google_analytics_360', 1, 0.98, 140, 180, dt + 'google analytics 360', fns);
		this.addGCP2ProductCardSet('Google Ad\nManager', 'google_ad_manager', 1, 1, 120, 170, dt + 'google ad manager', fns);

		this.addPalette('gcp2Product Cards', 'GCP / Product Cards', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsAIAndMachineLearningPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon compute ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE3LjUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDIwIDE3LjUiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOC45MSAxMC42M0wyMCA4Ljc1IDE3LjgyIDVoLTMuMDdsLTEuMDYtMS44NkgxMi41VjEuODhoMS45NGwxLjA2IDEuODdoMS41OUwxNC45IDBoLTQuMjd2NWgxLjczbC43MyAxLjI1aC0yLjQ2djIuNWgyLjI2bDEuMDUtMS44N2gyLjgxbC43MiAxLjI1aC0yLjhMMTMuNjIgMTBoLTIuOTl2NC4zOGgzLjRsLS43MiAxLjI1aC0yLjY4djEuODdoNC4yN2wzLjI4LTUuNjJoLTIuMDlsLS43MyAxLjI1SDEyLjV2LTEuMjVoMi4xNGwuNzQtMS4yNXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMS4wOSAxMC42M0wwIDguNzUgMi4xOCA1aDMuMDdsMS4wNi0xLjg2SDcuNVYxLjg4SDUuNTZMNC41IDMuNzVIMi45MUw1LjEgMGg0LjI4djVINy42NGwtLjczIDEuMjVoMi40N3YyLjVINy4xMUw2LjA2IDYuODhIMy4yNWwtLjcyIDEuMjVoMi44TDYuMzggMTBoM3Y0LjM4SDUuOTdsLjcyIDEuMjVoMi42OXYxLjg3SDUuMWwtMy4yOC01LjYyaDIuMDlsLjczIDEuMjVINy41di0xLjI1SDUuMzZsLS43NC0xLjI1eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 38, 'AI Platform', null, null, null, this.getTagsForStencil(gn, '', dt + 'ai platform artificial intelligence').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM2Mi4yMjI0NzgzNzUzNTMxNSIgaGVpZ2h0PSIzNzcuMzU5NDg0NzI1NTkyNSIgdmlld0JveD0iNjcuMzQ3OTk5NTcyNzUzOSAxMDguNjg4MDAzNTQwMDM5MDYgOTUuODM4MDA1MDY1OTE3OTcgOTkuODQzMDAyMzE5MzM1OTQiPiYjeGE7PHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDJ7ZmlsbDojNDI4NWY0O30mI3hhOzwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTk2LjE5OSAxNzMuODAxdjI1Ljk5bDE5LjE4MSA4Ljc0di0yNS45MjZ6bTQuNzcxIDguNjYybDkuNjczIDQuNDA4djEyLjk4NWwtOS42NzMtNC4zNzV6bS00Ljc3MS0zOC45Njl2MjEuNjg2bDE5LjE4MSA4LjczMnYtMjEuNjg0bC00LjczNy0yLjA5NXYxNS4wNmwtOS42NzMtNC4zOTV2LTE1LjE3ek02Ny4zNDggMTMwLjMydjU2LjU1bDE5LjExNCA4Ljc4M3YtNTYuNjU4bC00LjczNC0yLjEyN3Y0OS45MDhsLTkuNTUzLTQuMzgxVjEzMi40OXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOTYuMTE2IDExNy4zMTZsMTkuMjY0LTguNjI4IDQ3LjgwNiAyMS43NjMtMTguNzkgOC42MzJ6bTE5LjI2NCAzNC45MTJsLTE5LjE4MS04Ljc0NiAxOS4xODEtOC43MzkgMTkuMjE1IDguNzU5ek04Ni40NjIgMTM5LjA2bC0xOS4xMTQtOC43NDYgMTkuMTE0LTguNzM5IDE5LjM2MiA4Ljc1OXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTQ0LjM5NiAxNjAuNjEzdi0yMS41M2wxOC43OS04LjYzMnYyMS42NTd6TTExNS4zOCAxODIuNTNsNDcuODA2LTIxLjcxMnYyNS45MDRsLTQ3LjgwNiAyMS42MjZ6bTAtOC42MTh2LTIxLjY4NGwxOS4yMTUtOC43MzJ2MjEuNTQ1eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 40, s * 42, 'AI Hub', null, null, null, this.getTagsForStencil(gn, '', dt + 'ai hub artificial intelligence').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2Ljk3OTk5OTU0MjIzNjMyOCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE2Ljk3OTk5OTU0MjIzNjMyOCAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxnIGNsYXNzPSJzdDAiPiYjeGE7CQk8cGF0aCBkPSJNOC40OSAxMC4yOUwuMjQgNS4zNSA4LjQ5LjU4bDguMjQgNC42N3pNMS43NiA1LjM2bDYuNzIgNCA2LjcyLTQuMTEtNi43MS0zLjc4eiIvPiYjeGE7CQk8cGF0aCBkPSJNOC40OSAxOS40NEwuMjEgMTMuODkgOC40OSA5LjNsOC4xNSA0LjY0em0tNi44LTUuNWw2LjggNC41NiA2LjctNC41LTYuNy0zLjgyeiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPHBhdGggZD0iTS42MTMgNS41MDJsLjY3NS0uMzcxIDcuNDc3IDEzLjYtLjY3NS4zNzF6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxOC44MjZsNy4zMDEtMTMuNTU5LjY3OC4zNjUtNy4zMDEgMTMuNTU5ek0uNzE2IDEzLjY4N0w4LjA5Ni45MDRsLjY2Ny4zODUtNy4zOCAxMi43ODN6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxLjIxNGwuNjY5LS4zODEgNy40MDUgMTIuOTg3LS42NjkuMzgxeiIvPiYjeGE7CQk8cGF0aCBkPSJNOC4xMy45NmguNzdWMTguOWgtLjc3ek0uNTUgNS40M2guNzd2OC42NkguNTV6bTE0Ljk3LS4wOWguNzdWMTRoLS43N3oiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjguNTIiIGN5PSIxLjA3IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjE1LjkxIiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxLjA3IiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iOS45MyIgcj0iMS42OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNS45MSIgY3k9IjEzLjk0IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjEuMDciIGN5PSIxMy45NCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iMTguOTMiIHI9IjEuMDciLz4mI3hhOwkJPHBhdGggZD0iTTguNDkgMTAuMjlMLjI0IDUuMzUgOC40OS41OGw4LjI0IDQuNjd6TTEuNzYgNS4zNmw2LjcyIDQgNi43Mi00LjExLTYuNzEtMy43OHoiLz4mI3hhOwkJPHBhdGggZD0iTTguNDkgMTkuNDRMLjIxIDEzLjg5IDguNDkgOS4zbDguMTUgNC42NHptLTYuOC01LjVsNi44IDQuNTYgNi43LTQuNS02LjctMy44MnoiLz4mI3hhOwkJPHBhdGggZD0iTS42MTMgNS41MDJsLjY3NS0uMzcxIDcuNDc3IDEzLjYtLjY3NS4zNzF6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxOC44MjZsNy4zMDEtMTMuNTU5LjY3OC4zNjUtNy4zMDEgMTMuNTU5ek0uNzE2IDEzLjY4N0w4LjA5Ni45MDRsLjY2Ny4zODUtNy4zOCAxMi43ODN6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik04LjE5NCAxLjIxNGwuNjY5LS4zODEgNy40MDUgMTIuOTg3LS42NjkuMzgxeiIvPiYjeGE7CQk8cGF0aCBkPSJNOC4xMy45NmguNzdWMTguOWgtLjc3ek0uNTUgNS40M2guNzd2OC42NkguNTV6bTE0Ljk3LS4wOWguNzdWMTRoLS43N3oiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxjaXJjbGUgY3g9IjguNTIiIGN5PSIxLjA3IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjE1LjkxIiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxLjA3IiBjeT0iNS4zNCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iOS45MyIgcj0iMS42OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNS45MSIgY3k9IjEzLjk0IiByPSIxLjA3Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjEuMDciIGN5PSIxMy45NCIgcj0iMS4wNyIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI4LjUyIiBjeT0iMTguOTMiIHI9IjEuMDciLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;', 
		    		s * 36, s * 42, 'Advanced\nSolutions Lab', null, null, null, this.getTagsForStencil(gn, '', dt + 'advanced solutions lab').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjAgMTgiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O2ZpbGwtb3BhY2l0eTouOH0mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTtmaWxsLW9wYWNpdHk6LjZ9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOS4xNyA1LjE0bDEuNjYtMi41N0w5LjE1IDBINUwwIDguNThsMi41IDUuMTQgNS04LjU4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNC4xNyA1LjE0bDEuNjYtMi41N0wxNC4xNyAwaC0zLjM0bDEuNjcgMi41Ny0xLjY3IDIuNTd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEwLjgzIDEyLjg2bC0xLjY2IDIuNTdMMTAuODUgMThIMTVsNS04LjU4LTIuNS01LjE0LTUgOC41OHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOS4xNyAxMi44Nkg1LjgzbC0xLjY2IDIuNTdMNS44MyAxOGgzLjM0TDcuNSAxNS40M3oiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 38, 'AutoML', null, null, null, this.getTagsForStencil(gn, '', dt + 'automl').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM4MC41MTE5Nzg1NDYzNTQ0NCIgaGVpZ2h0PSIyNzQuOTI5OTg3NzczNzYyNTUiIHZpZXdCb3g9IjAgMCAxMDAuNjc2OTk0MzIzNzMwNDcgNzIuNzQxOTk2NzY1MTM2NzIiPiYjeGE7PHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zNy41NyA0NC43MjRoMjUuNDc3djUuNDY5SDM3LjU3em0wLTEwLjE0NmgyNS40Nzd2NS40NjlIMzcuNTd6bTAtMTAuMTQ2aDI1LjQ3N3Y1LjQ2OUgzNy41N3ptNTMuNTIgMi4yNzhsOS41ODcgMTMuMTQzLTIzLjc4MiAzMi44ODlIMjkuMDdsLTQuNzQxLTYuNTY4IDQuODExLTYuNTYxaDM4LjEwMXpNOS41ODcgNDYuMDMyTDAgMzIuODg5IDIzLjc4MiAwaDQ3LjgyNWw0Ljc0MSA2LjU2OC00LjgxMSA2LjU2MUgzMy40Mzd6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 34, 'AutoML Natural\nLanguage', null, null, null, this.getTagsForStencil(gn, '', dt + 'automl natural language').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM4MC42MzY0OTE2NzUyNjI0NSIgaGVpZ2h0PSIyNzUuNjgyNTM0NzQ5ODYxMTMiIHZpZXdCb3g9Ii0wLjM2OTAwMDAxNzY0Mjk3NDg1IDAgMTAwLjcxMDAwNjcxMzg2NzE5IDcyLjk0MTAwMTg5MjA4OTg0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qye2ZpbGw6IzY2OWRmNjt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMDAuMzQxIDQwLjA4TDc2LjQ0IDcyLjk0MWwtNDcuNjkyLS4wNy00Ljg0Ni02LjY1OSA0Ljg4MS02LjU4OSAzOC4xMDUuMDcgMjMuNzY1LTMyLjg0NXpNLS4zNjkgMzIuODYxTDIzLjUzMiAwbDQ3LjY5Mi4wNyA0Ljg0NiA2LjY1OS00Ljg4MSA2LjU4OS0zOC4xMDUtLjA3TDkuMzE5IDQ2LjA5M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzYuMjQgNDMuNzUyVjI3LjU3NmwxNy4xMTcgOC4wMTh2MTYuOTc4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik01OC4wMTEgNDEuNjk1di04LjgybC05Ljk1My00LjYzN3YtNy45ODNsMTcuMTE3IDguMTIzdjE3LjAxM3oiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 34, 'AutoML\nTables', null, null, null, this.getTagsForStencil(gn, '', dt + 'automl tables').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM4MC42MzY0OTE2NzUyNjI0NSIgaGVpZ2h0PSIyNzUuNjgyNTM0NzQ5ODYxMTMiIHZpZXdCb3g9Ii0wLjM2OTAwMDAxNzY0Mjk3NDg1IDAgMTAwLjcxMDAwNjcxMzg2NzE5IDcyLjk0MTAwMTg5MjA4OTg0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMDAuMzQxIDQwLjA4TDc2LjQ0IDcyLjk0MWwtNDcuNjkyLS4wNy00Ljg0Ni02LjY1OSA0Ljg4MS02LjU4OSAzOC4xMDUuMDcgMjMuNzY1LTMyLjg0NXpNLS4zNjkgMzIuODYxTDIzLjUzMiAwbDQ3LjY5Mi4wNyA0Ljg0NiA2LjY1OS00Ljg4MSA2LjU4OS0zOC4xMDUtLjA3TDkuMzE5IDQ2LjA5M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzMuOTc0IDI5Ljg3N3YtNC4wNjFoMTIuODk5di00LjYzN2g1LjUyNnY0LjYzN2gxMy4zMTd2NC4wNjF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTYzLjg2OCA1MS43N2MtNC40NTItLjY4Mi05LjQ4MS0yLjk1NS0xMy43MzYtNS45NjEtNC4wNjUgMi41MzItOC41ODIgNC43NDEtMTMuOTQ1IDYuMzQ1bC0zLjEwMy00LjAwOWM0Ljc2NS0xLjA2MSA5LjIzNy0yLjk5NSAxMy4wNzMtNS41NDMtMi41NDQtMi41NDMtNC43MjktNS4zNTQtNi4zNDUtOC40NTRoNi4xMDFjMS4xNDYgMS45ODcgMi41NjMgMy42NTMgNC4wNzkgNS4xNzcgMS43NTgtMS41OSAzLjAyOC0zLjMwOSA0LjA0NC01LjE3N2g2LjIwNWMtMS40MzIgMi44ODktMy4yMTggNS43MDItNi4zMSA4LjMxNWEzNS43NyAzNS43NyAwIDAgMCAxMi43NiA1LjEyNXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 34, 'AutoML\nTranslation', null, null, null, this.getTagsForStencil(gn, '', dt + 'automl translation').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM4MC42MzY0OTE2NzUyNjI0NSIgaGVpZ2h0PSIyNzUuNjgyNTM0NzQ5ODYxMTMiIHZpZXdCb3g9Ii0wLjM2OTAwMDAxNzY0Mjk3NDg1IDAgMTAwLjcxMDAwNjcxMzg2NzE5IDcyLjk0MTAwMTg5MjA4OTg0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qye2ZpbGw6IzY2OWRmNjt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMDAuMzQxIDQwLjA4TDc2LjQ0IDcyLjk0MWwtNDcuNjkyLS4wNy00Ljg0Ni02LjY1OSA0Ljg4MS02LjU4OSAzOC4xMDUuMDcgMjMuNzY1LTMyLjg0NXpNLS4zNjkgMzIuODYxTDIzLjUzMiAwbDQ3LjY5Mi4wNyA0Ljg0NiA2LjY1OS00Ljg4MSA2LjU4OS0zOC4xMDUtLjA3TDkuMzE5IDQ2LjA5M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzIuNjUxIDQ1Ljg4OFYyNi44ODJoOC45MzZsNC41NzMgNS43MzEgNi4wMjcuMDQ5di0zLjAwN0g0OC40NGwtMi4xNjktMi43NzNoMTAuMTU2djguMTcySDQzLjk2NmwtMS44MjQtMi42MDFoLTQuNjU5bDIuODk3IDQuMDA2LTIuODk3IDMuODdoNC42NTlsMS44MjQtMi44MWgxMi40NjF2OC4zNjlINDYuMjcxbDIuMTY5LTIuNzYxaDMuNzQ3di0yLjk0Nkg0Ni4xNmwtNC41NzMgNS43MDd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTY3LjM4NyA0NC42MzNsLTYuNjM4LTQuMDA4di04LjMxOGw2LjYzOC0zLjkwOXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 34, 'AutoML Video\nIntelligence', null, null, null, this.getTagsForStencil(gn, '', dt + 'automl video intelligence').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3OS4yNTY5MTM2MjgxNTg1NCIgaGVpZ2h0PSIyNzEuOTY3NzQwMjY0MjUzMyIgdmlld0JveD0iLTAuMTQ0OTk5OTk1ODI3Njc0ODcgMC4wMTEwMDAwMDA4NzE3MTc5MyAxMDAuMzQ0OTkzNTkxMzA4NiA3MS45NTgwMDAxODMxMDU0NyI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMDAuMiAzOS40ODNMNzYuNDI4IDcxLjk2OUgyOC44NjVsLTQuNzgzLTYuNTgyIDQuNzgzLTYuNDIyaDM4LjAxM0w5MC42MyAyNi40MzJ6TS0uMTQ1IDMyLjQ5OEwyMy42MjcuMDExSDcxLjE5bDQuNzgzIDYuNTgyLTQuNzgzIDYuNDIySDMzLjE3N0w5LjQyNSA0NS41NDl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMzLjAzNCA0My4xMjJsMTAuMDctMTQuMDIzaDI0LjAybC05Ljc4OSAxNC4wMjN6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 34, 'AutoML\nVision', null, null, null, this.getTagsForStencil(gn, '', dt + 'automl vision').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3NS41MDQwMTg5MTYxMTE2IiBoZWlnaHQ9IjM3Ni40MTEwMTA4NDIxNTg5MyIgdmlld0JveD0iMCAwIDk5LjM1MjAwNTAwNDg4MjgxIDk5LjU5MjAwMjg2ODY1MjM0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOzwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTcwLjc2MyA0OS43ODZhMzAuOTkgMzAuOTkgMCAwIDAtNC40OTkuNDQydjI3LjA3OGgxMXYtMjYuOTdsLTIuNjg2LS4zOTFjLTEuMjc5LS4xMzEtMi41NC0uMTg2LTMuODE1LS4xNTl6bS0xNS41ODcgMy43NjZsLTQuNDcxIDEuODcxLS4wMTYuMDA2LS4wMTYuMDA4LTYuNDk4IDIuNTIydjMwLjg4NGgxMXptMzMuMTc2LjEwNHY0NS45MzZoMTFWNTguMTk4Yy00LjEzOC0xLjc5OC03Ljc4My0zLjMyNS0xMS00LjU0MXpNMCA1My43Njh2MjMuNTM5aDExVjU4LjAxMmMtMy40MzYtMS4xMjYtNy4wNTItMi41NTItMTEtNC4yNDR6bTMzLjA4OCA2Ljg2Yy0zLjcwNS40NzItNy4zMjUuNDc4LTExIC4wMDd2MzguOTU3aDExeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0wIDB2NDEuNzM0YzQuMTA1IDEuODE5IDcuNzQgMy4zNSAxMSA0LjU3MlYwem02Ni4yNjQgMHYzOS4xNTRjMy4xNzgtLjQxMiA2LjI4Mi0uNDczIDkuNDM0LS4xNS41MjMuMDUzIDEuMDQ0LjExOSAxLjU2Ni4xOTFWMHpNNDQuMTc2IDExLjUzOHYzNC42OTRsMi4xMzctLjg5NWMzLjE0LTEuMzc5IDYuMDY5LTIuNTM5IDguODYzLTMuNDl2LTMwLjMxek0yMi4wODggMjIuMjg1djI3LjIzYy4wMTEuMDAyLjAyMi4wMDQuMDMzLjAwNiAzLjc3NC42NCA3LjIxNS43MDcgMTAuOTY3LjA4VjIyLjI4NXptNjYuMjY0IDB2MTkuNjQxYzMuMzg4IDEuMTQ0IDcuMDE1IDIuNTk3IDExIDQuMjlWMjIuMjg1eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Cloud\nInference API', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud inference api application programming interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjkyMTQ0MjAzMTg2MDM1IiBoZWlnaHQ9IjE5Ljc3ODMyMDMxMjUiIHZpZXdCb3g9Ii0wLjAwMDQ0MTU1NzE3NDc4MTMzNzQgMC4yNSAxOS45MjE0NDIwMzE4NjAzNSAxOS43NzgzMjAzMTI1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsLXJ1bGU6ZXZlbm9kZH0mI3hhOwkuc3Qze2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNC40NjEgMTYuMjRhMyAzIDAgMSAxIDAtNiAzIDMgMCAxIDEgMCA2em0zLjYzLS40YTQuNDMgNC40MyAwIDAgMC01LjA0OS02LjcxNEE0LjQzIDQuNDMgMCAwIDAgLjAxMSAxMy4zMmE0LjkxIDQuOTEgMCAwIDAgMCAuNjcgMy40MyAzLjQzIDAgMCAwIC4wOS40NGwuMDYuMjFhNC41OSA0LjU5IDAgMCAwIC4zNC43OSA0LjI0IDQuMjQgMCAwIDAgLjc2IDFsLjE1LjE1LjMzLjI3YTQuMTYgNC4xNiAwIDAgMCAuNzMuNDQgNC40NCA0LjQ0IDAgMCAwIDQuNTQtLjI5bDIuOTMgMi45M2EuMzMuMzMgMCAwIDAgLjQ3IDBsLjY2LS42NWEuMzMuMzMgMCAwIDAgMC0uNDd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkuODExIDE0LjU4YTUuNDEgNS40MSAwIDAgMCAuMi0xLjUxIDUuNTMgNS41MyAwIDAgMC01LjYxLTUuNDIgNS44MiA1LjgyIDAgMCAwLTEuOTIuMzVWMy44M2EuNjIuNjIgMCAwIDEgLjYyLS42MmgxNi4xOWEuNjMuNjMgMCAwIDEgLjYzLjYyVjE0YS42My42MyAwIDAgMS0uNjMuNjN6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMy41OTEgMy4yMVYxLjczaC00LjQ0djEuNDhoLTEuNDlWLjg3YS42My42MyAwIDAgMSAuNjMtLjYyaDYuMTZhLjYyLjYyIDAgMCAxIC42Mi42MnYyLjM0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUuMDcxIDMuMjFoLTEuNDhsMS40OC0uNDd6bS01LjkzIDBoLTEuNDlsMS40OS0uNTR6Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Cloud\nJobs API', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud jobs api').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUgMmgzdjEyaC0zdjJoMyAydi0yVjIgMGgtMi0zeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOCAydjFsMi0xem0yIDEydi0xbC0yIDF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUgMTRIMlYyaDNWMEgyIDB2MiAxMiAyaDIgM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxNHYtMWwyIDF6TTIgMnYxTDAgMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNSA3aDEwdjJINXptMCAzaDEwdjJINXptMC02aDEwdjJINXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 34, 'Cloud Natural\nLanguage API', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud natural language api').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMTggMTgiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxnIGNsYXNzPSJzdDAiIGZpbGw9IiM0Mjg1ZjQiPiYjeGE7CQk8cGF0aCBkPSJNMy40OCA2LjYyYS4zNy4zNyAwIDAgMS0uMzU4LS41MzMuMzcuMzcgMCAwIDEgLjMwOC0uMjA3bDIuMy0uMzJhLjM3LjM3IDAgMCAxIC40Mi4zMi4zOC4zOCAwIDAgMS0uMzIuNDNsLTIuMy4zMXoiLz4mI3hhOwkJPHBhdGggZD0iTTYuMjk5IDYuMjkybC4yMzMtLjcxMyA0LjE0NSAxLjM1Mi0uMjMzLjcxM3oiLz4mI3hhOwkJPHBhdGggZD0iTTYuMTggNi4xNmgtLjExYS4zNy4zNyAwIDAgMS0uMjQtLjQ2bC44My0yLjg0YS4zNy4zNyAwIDAgMSAuNDYtLjI0LjM2LjM2IDAgMCAxIC4yNi40NWwtLjg0IDIuODFhLjM4LjM4IDAgMCAxLS4zNi4yOHptNS4xMyAxLjRBLjM2LjM2IDAgMCAxIDExIDdsMS42Ny00LjIzYS4zOC4zOCAwIDAgMSAuNDctLjE4LjM4LjM4IDAgMCAxIC4yMy40NWwtMS42OCA0LjI0YS4zOS4zOSAwIDAgMS0uMzguMjh6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0yLjY2OSAxMy42MDRMNi42IDEwLjQ2NWwuNDY4LjU4Ni0zLjkzMSAzLjEzOXpNMTUuMDUgOC42MWwtLjMuNjgtMy42My0xLjU4LjI5LS42OXptLS4zMSA1LjQ4bC0uNTIuNTQtMy4yMy0zLjA0LjUyLS41NXpNNS43ODggNi4xMTNsLjczNS0uMTQ5LjgwOCAzLjk3OS0uNzM1LjE0OXoiLz4mI3hhOwkJPHBhdGggZD0iTTExLjU2IDcuNTZsLTQuMSAzLjYtLjUtLjU2IDQuMS0zLjZ6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0xMS43NCA3LjNsLS4yNSAzLjk3LS43NC0uMDUuMjQtMy45N3oiLz4mI3hhOwkJPGNpcmNsZSBjeD0iNy4wMSIgY3k9IjEwLjgyIiByPSIxLjM2Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjExLjM3IiBjeT0iNy4zNiIgcj0iMS42MSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMS4zNiIgY3k9IjExLjU0IiByPSIuODQiLz4mI3hhOwkJPGNpcmNsZSBjeD0iNi4wNCIgY3k9IjUuNjciIHI9Ii45OSIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBjbGFzcz0ic3QxIiBmaWxsPSIjNjY5ZGY2Ij4mI3hhOwkJPHBhdGggZD0iTTggNGgyVjBIOHptNCAwaDJWMGgtMnpNNCA0aDJWMEg0em00IDE0aDJ2LTRIOHoiLz4mI3hhOwkJPHBhdGggZD0iTTEyIDE4aDJ2LTRoLTJ6bS04IDBoMnYtNEg0em0tNC04aDRWOEgwem0wLTRoNFY0SDB6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0wIDE0aDR2LTJIMHptMTQtNGg0VjhoLTR6bTAtNGg0VjRoLTR6bTAgOGg0di0yaC00eiIvPiYjeGE7CQk8cGF0aCBkPSJNMTUgMkgzYTEgMSAwIDAgMC0xIDF2MTJhMSAxIDAgMCAwIDEgMWgxMmExIDEgMCAwIDAgMS0xVjNhMSAxIDAgMCAwLTEtMXptLTEgMTEuNDdhLjUzLjUzIDAgMCAxLS41My41M0g0LjUzYS41My41MyAwIDAgMS0uNTMtLjUzVjQuNTNBLjUzLjUzIDAgMCAxIDQuNTMgNGg4Ljk0YS41My41MyAwIDAgMSAuNTMuNTN6Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Cloud\nTPU', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud tpu').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjAgMTgiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1LjkxIDcuMmgtMS44MkwxMCAxOGgxLjgybDEtMi43aDQuMzJsMSAyLjdIMjB6bS0yLjM5IDYuM0wxNSA5LjZsMS40OCAzLjl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwLjc5IDExLjc3TDguNDggOS41MWgwYTE1LjYyIDE1LjYyIDAgMCAwIDMuNC01LjkxaDIuNjdWMS44SDguMThWMEg2LjM2djEuOEgwdjEuNzloMTAuMTVhMTQuMDYgMTQuMDYgMCAwIDEtMi44OCA0LjgyIDE0LjU1IDE0LjU1IDAgMCAxLTIuMS0zSDMuMzVhMTYgMTYgMCAwIDAgMi43MSA0LjFMMS40NCAxNGwxLjI5IDEuMyA0LjU0LTQuNSAyLjgzIDIuOHoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 38, 'Cloud\nTranslation API', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud translation api application programming interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTEwIDE2TDAgOGg0bDYgNC45OXoiLz4mI3hhOwkJPHBhdGggZD0iTTIwIDhsLTEwIDh2LTMuMDFMMTYgOHoiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0xMCAzLjAxTDQgOEgwbDEwLTh6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0yMCA4TDEwIDB2My4wMUwxNiA4eiIvPiYjeGE7CTwvZz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxMCIgY3k9IjgiIHI9IjIiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 34, 'Cloud\nVision API', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud translation api application programming interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ny42MDkwNzg2ODcyMTAwNiIgaGVpZ2h0PSIzMDYuMjk2NTE2MDQzNTQ3NzQiIHZpZXdCb3g9IjAuMDE5MDAwMDAxMjUxNjk3NTQgMC4yMzIwMDAwMDgyMjU0NDA5OCA5OS45MDkwMDQyMTE0MjU3OCA4MS4wNDEwMDAzNjYyMTA5NCI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjUuMTgzLjIzMkw3LjM1MyAzNy4zNjYuMDQ4IDM3LjMzbC0uMDI5IDYgMjkuNDkyLjE0NmMxLjA4NiA2LjE1IDYuNDk5IDEwLjg3NiAxMi45NDQgMTAuODc2IDcuMjE4IDAgMTMuMTQ0LTUuOTI3IDEzLjE0NC0xMy4xNDRzLTUuOTI3LTEzLjE0NS0xMy4xNDQtMTMuMTQ1Yy01LjkyNCAwLTEwLjk3NiAzLjk5My0xMi41OTcgOS40MTVsLTEyLjU0NC0uMDYyTDMwLjg0NSA5LjIzMmgzMC4xMjl2LTlIMjUuMTgzem0xNy4yNzEgMzQuODNhNi4wOSA2LjA5IDAgMCAxIDYuMTQ1IDYuMTQ1IDYuMDkgNi4wOSAwIDAgMS02LjE0NSA2LjE0NGMtMi42MTYgMC00LjgwOS0xLjU3My01LjcwNi0zLjg0bDMuMjE0LjAxNi4wMjktNi0yLjQ3My0uMDEyYzEuMTEyLTEuNDk2IDIuODk2LTIuNDUzIDQuOTM2LTIuNDUzek0xNy44ODIgNDUuNzExbC04LjA4NiAzLjk1MSAxNS40NDEgMzEuNjExaDM1LjczNnYtOUgzMC44NThMMTcuODgyIDQ1LjcxMXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjAuOTc0IDgxLjI3M2gzOC45NTRWNjAuOTIyaC05LjAwM3YxMS4zNTJINjAuOTc0em0wLTcyLjA0MWgyOS45NTF2MTEuNzU1aDkuMDAzVi4yMzJINjAuOTc0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik03NS43OTYgMjAuOTg3djguOTk5aDI0LjEzMnYtOC45OTl6TTYxLjExIDM1LjkyOHY5aDM4LjgxN3YtOXpNNzEuMjc0IDUxLjkxdjkuMDEyaDI4LjY1M1Y1MS45MXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 34, 'Data\nLabeling', null, null, null, this.getTagsForStencil(gn, '', dt + 'data labeling').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjAwMDAwNzYyOTM5NDUzIiBoZWlnaHQ9IjE5LjgzNjQ5NDQ0NTgwMDc4IiB2aWV3Qm94PSItMC4wMDAwMDY3MzA4MDY0ODk5NDA3MzMgMC4wMDAzMTcxNzE4ODUzOTkxNDc4NyAxNi4wMDAwMDc2MjkzOTQ1MyAxOS44MzY0OTQ0NDU4MDA3OCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTggOS45NzFsLTgtNHY2Ljc2YS40OS40OSAwIDAgMCAuMTkuMzlsNC42NCAyLjc1YS4zMi4zMiAwIDAgMSAuMTcuMjl2My41MWEuMTcuMTcgMCAwIDAgLjI2LjE0bDEwLjUxLTYuNjlhLjUuNSAwIDAgMCAuMjMtLjQydi02LjczeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04IDcuOTcxbDgtNEw4LjEyLjAzMWEuMjUuMjUgMCAwIDAtLjI0IDBMMCAzLjk3MXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 34, s * 42, 'Dialog Flow\nEnterprise Edition', null, null, null, this.getTagsForStencil(gn, '', dt + 'dialog flow enterprise edition').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ny42ODQ2NTY1OTk1Nzg4MyIgaGVpZ2h0PSIzMzguNTIwNDc5NDMzNDQ2MiIgdmlld0JveD0iMC4wNjUwMDAwMDUwNjYzOTQ4IDAuNDc5OTk5NTQyMjM2MzI4MSA5OS45MjkwMDA4NTQ0OTIxOSA4OS41NjcwMDEzNDI3NzM0NCI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDN7ZmlsbDojZmZmO30mI3hhOzwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTU5LjU1NCAzNS42MmgzMC45NFY5Ljk4bDkuNS05LjVoLTQ5Ljk0djQ0LjY0em0yOS45ODEgNTQuNDI3VjUzLjYzNWwtOS41IDkuNXYxNy40MTJ6bS01MC4xMjggMFY1My42MzVsLTkuNSA5LjV2MTcuNDEyem0wLTQ0LjU3OVY5LjA1NmwtOS41IDkuNXYxNy40MTJ6IiBmaWxsPSIjYWVjYmZhIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTk5Ljk5NCA0NS4xMlYuNDhsLTkuNSA5LjV2MjUuNjR6bS00OS44IDQ0LjkyN2gzOS4zNDJsLTkuNS05LjVINTkuNjkzem0tNTAuMTI4IDBoMzkuMzQybC05LjUtOS41SDkuNTY1em0wLTQ0LjU3OWgzOS4zNDJsLTkuNS05LjVIOS41NjV6IiBmaWxsPSIjNjY5ZGY2Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTUwLjA1NCA0NS4xMmg0OS45NGwtOS41LTkuNWgtMzAuOTR6bTkuNjM5IDM1LjQyN1Y2My4xMzVoMjAuMzQybDkuNS05LjVINTAuMTkzdjM2LjQxMnptLTUwLjEyOCAwVjYzLjEzNWgyMC4zNDJsOS41LTkuNUguMDY1djM2LjQxMnptMC00NC41NzlWMTguNTU2aDIwLjM0Mmw5LjUtOS41SC4wNjV2MzYuNDEyeiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik04Mi42ODUgMTQuMTk4bC0xMC4yNjcgOS4yMDgtNC43ODUtNC4zNS00LjExMiAzLjY3IDguOTMgNy44ODYgMTQuMTgyLTEyLjcyNnoiIGZpbGw9IiNmZmYiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 38, 'Recommendations\nAI', null, null, null, this.getTagsForStencil(gn, '', dt + 'recommendations ai').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04IDBoMnYyMEg4ek00IDZoMnY4SDR6bTggMGgydjhoLTJ6TTAgM2gydjE0SDB6bTE2IDBoMnYxNGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOCAwaDJ2MTBIOHpNNCA2aDJ2NEg0em04IDBoMnY0aC0yek0wIDNoMnY3SDB6bTE2IDBoMnY3aC0yeiIvPiYjeGE7PC9zdmc+;', 
		    		s * 38, s * 42, 'Speech-to-Text', null, null, null, this.getTagsForStencil(gn, '', dt + 'speech to text').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMDQ2MzQ4NTcxNzc3MyIgaGVpZ2h0PSIxNi42MzE1MTU1MDI5Mjk2ODgiIHZpZXdCb3g9IjAgMC4wMDAyNDE0MDk2NTI1MTcxNzcxNiAyMC4wMDA0NjM0ODU3MTc3NzMgMTYuNjMxNTE1NTAyOTI5Njg4Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qxe2ZpbGw6IzQyODVmNDt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNLjAxIDMuMzA2aDYuNjR2MS42N0guMDF6bS0uMDEgMTBoMCA5LjE3di0xLjY3SDB6bTAtNC4xN2g0LjE4SDEwbC0xLjY3LTEuNjZIMi41MSAweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCA1LjM4NmEuNDIuNDIgMCAwIDEgLjQyLS4zNi40MS40MSAwIDAgMSAuNDEuMzZ2OS4xOGEyLjA5IDIuMDkgMCAwIDAgMi42MSAyIDIuMTYgMi4xNiAwIDAgMCAxLjU2LTIuMTFWMi4wNjZhLjQuNCAwIDAgMSAuMTktLjQuNDEuNDEgMCAwIDEgLjQ1IDAgLjQuNCAwIDAgMSAuMTkuNHY5LjE2YTIuMDcgMi4wNyAwIDAgMCAuODEgMS42NCAyIDIgMCAwIDAgMS44LjM3IDIuMTYgMi4xNiAwIDAgMCAxLjU2LTIuMTJ2LTIuOGgtMS42N3YyLjkyYS40LjQgMCAwIDEtLjE5LjQuNDEuNDEgMCAwIDEtLjQ1IDAgLjQuNCAwIDAgMS0uMTktLjR2LTkuMTdhMi4wOSAyLjA5IDAgMCAwLTIuNjEtMiAyLjE2IDIuMTYgMCAwIDAtMS41NiAyLjEzdjEyLjM3YS40LjQgMCAwIDEtLjE5LjQuNDEuNDEgMCAwIDEtLjQ1IDAgLjQuNCAwIDAgMS0uMTktLjR2LTkuMTdhMi4wNyAyLjA3IDAgMCAwLTQuMTEtLjM2IDIuNCAyLjQgMCAwIDAtLjA1LjQ2djJMMTAgOS4xMzZ6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 36, 'Text-to-Speech', null, null, null, this.getTagsForStencil(gn, '', dt + 'text to speech').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk4OTk5OTc3MTExODE2NCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE5Ljk4OTk5OTc3MTExODE2NCAxNCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwLjI3IDIuMzNoMi4wNXYxLjMzSDkuNEw3LjA3IDBIMHY0LjMzaDEuOTlMMy4yNSAyaDIuNTdsLjg2IDEuMzNINC4xMUwyLjg1IDUuNjZIMHYyLjU5aDIuODVsMS4yNiAyLjQxaDIuNTdMNS44MiAxMkgzLjI1TDEuOTkgOS42NkgwVjE0aDcuMDdsMi4zMy0zLjY3aDIuOTJ2MS4zM2gtMi4wNUw4LjggMTRoNS41MlY3LjY2SDcuOTFMNy4wOCA5SDUuMjRMNi41IDcgNS4yNCA1aDEuODRsLjggMS4zM2g2LjQ0VjBIOC44eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNS45OSAxMC4xMWw0IDIuOTVWMS4xbC00IDIuOTF6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 29, 'Video\nIntelligence API', null, null, null, this.getTagsForStencil(gn, '', dt + 'video intelligence api application programming interface').join(' '))
	 	];
		
		this.addPalette('gcp2Icons AI and Machine Learning', 'GCP Icons / AI and Machine Learning', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsComputePalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon compute ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2LjAyMDAwMDQ1Nzc2MzY3MiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSI4Ljk0MDY5NjcxNjMwODU5NGUtOCAwIDIwIDE2LjAyMDAwMDQ1Nzc2MzY3MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4zIDcuMjZsLTEuMjIgMS4yMkExLjcxIDEuNzEgMCAwIDEgMTAgMTEuNDlhMS43NCAxLjc0IDAgMCAxLTEuMzMtLjY0bC0xLjIyIDEuMjJhMy40MyAzLjQzIDAgMCAwIDUuOTg0LTEuMzgxQTMuNDMgMy40MyAwIDAgMCAxMi4zIDcuMjZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDMuNTJhNi4yNSA2LjI1IDAgMCAwIDAgMTIuNSA2LjI1IDYuMjUgMCAwIDAgMC0xMi41bTAgMTAuNzRhNC40NSA0LjQ1IDAgMCAxLTMuMTU3LTcuNTk3QTQuNDUgNC40NSAwIDAgMSAxNC40NCA5LjgyIDQuNDQgNC40NCAwIDAgMSAxMCAxNC4yNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xOS42MiA5LjE2bC0yLjU2LS44MWE3LjEgNy4xIDAgMCAxIC4xNyAxLjUzIDcuNjIgNy42MiAwIDAgMS0uMDggMS4wOGgyLjQ3YS40NC40NCAwIDAgMCAuMzgtLjQydi0xYS40NC40NCAwIDAgMC0uMzgtLjQyTTEwIDIuNzhhNy40OCA3LjQ4IDAgMCAxIDEuNS4xNUwxMC41OC4zOGMtLjA3LS4yMi0uMjEtLjM4LS40Mi0uMzhoLS4zOGEuNDUuNDUgMCAwIDAtLjQyLjM4bC0uOCAyLjU0QTcuNjQgNy42NCAwIDAgMSAxMCAyLjc4bS03LjIzIDcuMWE3LjEgNy4xIDAgMCAxIC4xNy0xLjUzbC0yLjU2LjgxYS40NC40NCAwIDAgMC0uMzguNDJ2MWEuNDQuNDQgMCAwIDAgLjM4LjQyaDIuNDdhNy42MiA3LjYyIDAgMCAxLS4wOC0xLjA4Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDcuMjZhMi41IDIuNSAwIDEgMCAwIDUgMi41IDIuNSAwIDEgMCAwLTV6bTAgMy43NWExLjI1IDEuMjUgMCAxIDEgMC0yLjUgMS4yNSAxLjI1IDAgMCAxIDEuMjUgMS4yNUExLjI1IDEuMjUgMCAwIDEgMTAgMTEuMDJ6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 34, 'App Engine', null, null, null, this.getTagsForStencil(gn, '', dt + 'app engine').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5Ljk4OTk5OTc3MTExODE2NCIgdmlld0JveD0iMCAwIDIwIDE5Ljk4OTk5OTc3MTExODE2NCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zIDMuOTlMMCA2LjQydjcuMTNsMyAyLjQ0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zIDMuOTlsLTMgNCAzLTJ6bS0zIDhsMyA0di0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0wIDE1Ljk5bDQgNCAyLTItNi02em0uMDEtOEw1Ljk5IDJsLTItMkwwIDMuOTl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDE2bDMtMi40MlY2LjQ0TDE3IDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE3IDE2bDMtNC0zIDJ6bTMtOGwtMy00djJ6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxwYXRoIGQ9Ik0yMCA0bC00LTQtMiAyIDYgNnptLS4wMSA4bC01Ljk4IDUuOTkgMiAyTDIwIDE2eiIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI2IiBjeT0iOS45OSIgcj0iMSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMCIgY3k9IjkuOTkiIHI9IjEiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTMuOTkiIGN5PSI5Ljk5IiByPSIxIi8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 34, 'Cloud\nFunctions', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud functions').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM2NS40NjQ5OTY3NzA0MjQ5MyIgaGVpZ2h0PSIzNzkuMjIyOTk0NDYzNTc3OTUiIHZpZXdCb3g9IjAgMCA5Ni42OTU5OTkxNDU1MDc4MSAxMDAuMzM1OTk4NTM1MTU2MjUiPiYjeGE7PHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiNhZWNiZmE7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjkuNzk0IDEwMC4zMzZMNDYuOTIgNTAuMTY4aDQ5Ljc3NnpNMCA5OS42NzFsMTIuOTc2LTQ5LjUwMkgyOS4yMkwxNi44OTcgOTIuMDU0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOS43OTQgMEw0Ni45MiA1MC4xNjhoNDkuNzc2ek0wIC42NjZsMTIuOTc2IDQ5LjUwMkgyOS4yMkwxNi44OTcgOC4yODN6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 42, 'Cloud\nRun', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud run').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNyA3aDZ2Nkg3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05IDBoMnY0SDl6TTUgMGgydjRINXptOCAwaDJ2NGgtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSAxNmgydjRIOXptLTQgMGgydjRINXptOCAwaDJ2NGgtMnptMy01VjloNHYyem0wIDR2LTJoNHYyem0wLThWNWg0djJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTAgMTFWOWg0djJ6bTAgNHYtMmg0djJ6bTAtOFY1aDR2MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMyAzdjE0aDE0VjN6bTEyIDEySDVWNWgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAgMTBsLTMgM2g2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMyA3bC0zIDMgMyAzeiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Compute\nEngine', null, null, null, this.getTagsForStencil(gn, '', dt + 'compute engine').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwIDBhMTAgMTAgMCAxIDAgMTAgMTBoMEExMCAxMCAwIDAgMCAxMCAwem0wIDE4YTggOCAwIDAgMS00LjE4LTEuMThsMy41OC0yLjA3aDB2LTQuNUw1LjUxIDh2NC41MmwyLjc1IDEuNTktMy40NiAyQTggOCAwIDAgMSA2LjA4IDN2NGgwTDEwIDkuMjggMTMuOSA3IDEwIDQuNzcgNy4yNCA2LjM2VjIuNDdhOCA4IDAgMCAxIDEwLjMxIDQuNyA4LjEgOC4xIDAgMCAxIC41MSAyLjgzdi4wN0wxNC40NiA4aDBsLTMuOSAyLjI2djQuNTFsMy45LTIuMjVWOS4zNGwzLjQ1IDJBOCA4IDAgMCAxIDEwIDE4eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Container-\nOptimized OS', null, null, null, this.getTagsForStencil(gn, '', dt + 'container optimized os operating system').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQwMi4zNDMyMDA2ODM1OTM3NSIgaGVpZ2h0PSI0MTYuMDAyNTMyOTU4OTg0NCIgdmlld0JveD0iMCAwLjAwMDQ5OTk2Mzc2MDM3NTk3NjYgNDAyLjM0MzIwMDY4MzU5Mzc1IDQxNi4wMDI1MzI5NTg5ODQ0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM2Ni4xNyA5Mi4wMDNjLTE5LjA1IDAtMzYgMTYuODItMzYgMzUuNzYgMCAxMi42MiA4LjQ2IDI1LjI0IDE5LjA1IDMxLjU1djE0Ny4zbC0xMTAuMDUgNjUuMjEgMTYuOTMgMjcuMzUgMTE4LjUxLTY5LjQyYzQuMjQtMi4xIDguNDctOC40MSA4LjQ3LTE0Ljczdi0xNTUuNjdjMTIuNzEtNi4zNSAxOS4wOS0xOC45MyAxOS4wOS0zMS41NSAyLjA4LTE4Ljk0LTE0Ljg1LTM1LjgtMzYtMzUuOHptLTM4LjExLTIzLjFMMjA5LjU1IDEuNTgzYy00LjI0LTIuMTEtMTAuNTktMi4xMS0xNi45MyAwTDU3LjE3IDc5LjQxM0EzNiAzNiAwIDAgMCAzNiA3My4xMDNjLTE5IDAtMzYgMTYuODMtMzYgMzUuNzZzMTYuOTMgMzUuNzcgMzYgMzUuNzcgMzYtMTYuODMgMzYtMzUuNzdsMTI5LjEtNzMuNjIgMTEwIDYzLjExem0tMTQzLjg5IDI3Ny42OHEtOS41MyAwLTE5IDYuMzFsLTExMC02My4xMXYtMTI2LjIyaC0zNHYxMzQuNjNjMCA2LjMyIDQuMjMgMTIuNjMgOC40NiAxNC43M2wxMTguNTQgNjUuMjF2Mi4xMWMwIDE4LjkzIDE2LjkzIDM1Ljc2IDM2IDM1Ljc2czM2LTE2LjgzIDM2LTM1Ljc2LTE3LTMzLjY2LTM2LTMzLjY2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05Ny4zOCAxMzYuMjEzbDEwNS44MiA1OC45MSAxMDMuNy01OC45MS0xMDMuNy02MXptLTYuMzUgNjcuMzJsMTEyLjE3IDYzLjExdi01MC40OWwtMTEyLjE3LTY1LjIxem0wIDYzLjExbDExMi4xNyA2NS4yMXYtNDQuMTdsLTExMi4xNy02NS4yMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAzLjE3IDIxNi4xMjN2NTAuNTZsMTEyLjE2LTY1LjI5di01MC4zOXptOTItMjBhOC4xNiA4LjE2IDAgMSAxIDguMTYtOC4xNiA4LjE5IDguMTkgMCAwIDEtOC4xNiA4LjE2em0tOTIgOTEuNTJ2NDQuMTZsMTEyLjE2LTY1LjEydi00NC4xNnptOTItMjIuODhhOC4xNiA4LjE2IDAgMSAxIDguMTYtOC4xNiA4LjE5IDguMTkgMCAwIDEtOC4xNiA4LjE2eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 40, s * 42, 'GKE On-Prem', null, null, null, this.getTagsForStencil(gn, '', dt + 'gke on-prem').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEzLjMzIDB2Mi4zOGgtMi4xNlYwSDguODN2Mi4zOEg2LjY3VjBINC4yOXYyLjM4YTIgMiAwIDAgMC0xLjkxIDEuOTFIMHYyLjM4aDIuMzh2Mi4xNEgwdjIuMzhoMi4zOHYyLjE0SDB2Mi4zOGgyLjM4YTIgMiAwIDAgMCAxLjkxIDEuOTFWMjBoMi4zOHYtMi4zOGgyLjE2VjIwaDIuMzR2LTIuMzhoMi4xNlYyMGgyLjM4di0yLjM4YTIgMiAwIDAgMCAxLjkxLTEuOTFIMjB2LTIuMzhoLTIuMzh2LTIuMTRIMjBWOC44MWgtMi4zOFY2LjY3SDIwVjQuMjloLTIuMzhhMiAyIDAgMCAwLTEuOTEtMS45MVYwem0xLjUzIDE1LjI0SDUuMTRhLjM4LjM4IDAgMCAxLS4zOC0uMzhWNS4xNGEuMzguMzggMCAwIDEgLjM4LS4zOGg5LjcyYS4zOC4zOCAwIDAgMSAuMzguMzh2OS43MmEuMzguMzggMCAwIDEtLjM4LjM4em0tMi4wNy02LjEybC0zLjUgNC44NnYtMy42M0g3LjIybDMuNjEtNC44MXYzLjU4eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'GPU', null, null, null, this.getTagsForStencil(gn, '', dt + 'gpu graphics processing unit').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyOS45MjU5OTcyMzE3OTM4IiBoZWlnaHQ9IjM3OC4yODQ5OTAzMTEyNzg4IiB2aWV3Qm94PSIwIDAgODcuMjkyOTk5MjY3NTc4MTIgMTAwLjA4Nzk5NzQzNjUyMzQ0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6IzQyODVmNDt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00My43NTEgMEwwIDI1LjQ2NXYyLjU4OCA0Ni45Mmw0My43NTIgMjUuMTE1IDQzLjU0MS0yNS4xMjFWMjUuNDczem0yLjQzOCAxMS44NTNsMzIuMTAzIDE4Ljc4MlY2OS43N0w0My43MzkgODkuNzA1IDkgNjkuNzYyVjMwLjY0MWwzMi4xOS0xOC43MzZ2MTQuMTU0TDI0LjUwMyAzNi4xNTNsMTkuMTcyIDExLjUwMiAxOC44ODYtMTEuNTU0LTE2LjM3Mi0xMC4wMjR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIyLjAyNSA0MC40OTZsLjE2NiAxOS4xNDMtMTMuMjQ3IDcuMzN2Mi43NDJsMi42MzcgMS41MTQgMTIuNjQ4LTYuOTk5IDE2Ljk2MSAxMC42MDJWNTEuOTkzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02NS4zNDQgNDAuMjZMNDYuMTg5IDUxLjk3OXYyMi44NDdsMTYuODk5LTEwLjU3NiAxMi41MzkgNi45NzQgMi42MDktMS41MDV2LTIuNzY1bC0xMi43ODQtNy4xMTJ6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 37, s * 42, 'Kubernetes\nEngine', null, null, null, this.getTagsForStencil(gn, '', dt + 'kubernetes engine').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczp2PSJodHRwczovL3ZlY3RhLmlvL25hbm8iIHdpZHRoPSIxOS41MSIgaGVpZ2h0PSIxOS41IiB2aWV3Qm94PSIwIDAgMTkuNTEgMTkuNSI+JiN4YTsJPHBhdGggZD0iTTE3LjI2IDE3LjgxaC0uN3YtMS41aC43YS43Ni43NiAwIDAgMCAuNzUtLjc1di00LjMxYS43Ni43NiAwIDAgMC0uNzUtLjc1aC0zLjYxVjloMy42MWEyLjI1IDIuMjUgMCAwIDEgMi4yNSAyLjI1djQuMzFhMi4yNSAyLjI1IDAgMCAxLTIuMjUgMi4yNXptLTcuOTUgMGgtNC45di0xLjVoNC45eiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGZpbGw9IiM2NjlkZjYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUuODggMTAuNUgyLjI2QTIuMjUgMi4yNSAwIDAgMSAuMDEgOC4yNVYzLjk0YTIuMjUgMi4yNSAwIDAgMSAyLjI1LTIuMjVoMXYxLjVoLTFhLjc1Ljc1IDAgMCAwLS43NS43NXY0LjMxYS43Ni43NiAwIDAgMCAuNzUuNzVoMy42MnoiLz4mI3hhOwk8cGF0aCBmaWxsPSIjNDI4NWY0IiBkPSJNMTUuMDYgMy4xOUg5LjU4di0xLjVoNS40OHoiLz4mI3hhOwk8cGF0aCBmaWxsPSIjYWVjYmZhIiBkPSJNNi4zOSAxLjY5Vi4xOWgtM2ExLjEzIDEuMTMgMCAwIDAtMS4xMyAxLjEydjIuMjVhMS4xMyAxLjEzIDAgMCAwIDEuMTMgMS4xM2gzdi0xLjVIMy43NnYtMS41eiIvPiYjeGE7CTxwYXRoIGZpbGw9IiM2NjlkZjYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjUxIDEuMzF2Mi4yNWExLjEzIDEuMTMgMCAwIDEtMS4xMiAxLjEzaC0zdi0xLjVoMi42MnYtMS41SDYuMzlWLjE5aDNhMS4xMiAxLjEyIDAgMCAxIDEuMTIgMS4xMnoiLz4mI3hhOwk8cGF0aCBmaWxsPSIjYWVjYmZhIiBkPSJNMTcuMDcgNC44OGEyLjQ0IDIuNDQgMCAxIDEgMi40NC0yLjQ0IDIuNDUgMi40NSAwIDAgMS0yLjQ0IDIuNDR6bTAtMy4zOGEuOTQuOTQgMCAxIDAgLjk0Ljk0Ljk0Ljk0IDAgMCAwLS45NC0uOTR6Ii8+JiN4YTsJPHVzZSB4bGluazpocmVmPSIjQiIgZmlsbD0iIzlhYTBhNiIvPiYjeGE7CTxnIGZpbGw9IiNhZWNiZmEiPiYjeGE7CQk8dXNlIHhsaW5rOmhyZWY9IiNCIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xMy4xMiAxNi4zMnYtMS41aC0zQTEuMTMgMS4xMyAwIDAgMCA5IDE1Ljk1djIuMjVhMS4xMiAxLjEyIDAgMCAwIDEuMTIgMS4xMmgzdi0xLjVIMTAuNXYtMS41eiIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBmaWxsPSIjNjY5ZGY2IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNy4yNSAxNS45NXYyLjI1YTEuMTMgMS4xMyAwIDAgMS0xLjEzIDEuMTJoLTN2LTEuNWgyLjY0di0xLjVoLTIuNjR2LTEuNWgzYTEuMTQgMS4xNCAwIDAgMSAxLjEzIDEuMTN6Ii8+JiN4YTsJPHBhdGggZmlsbD0iI2FlY2JmYSIgZD0iTTkuNzYgOVY3LjVoLTNhMS4xMyAxLjEzIDAgMCAwLTEuMTMgMS4xMnYyLjI1QTEuMTMgMS4xMyAwIDAgMCA2Ljc2IDEyaDN2LTEuNUg3LjEzVjl6Ii8+JiN4YTsJPHBhdGggZmlsbD0iIzY2OWRmNiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTMuODggOC42MnYyLjI1QTEuMTMgMS4xMyAwIDAgMSAxMi43NiAxMmgtM3YtMS41aDIuNjJWOUg5Ljc2VjcuNWgzYTEuMTIgMS4xMiAwIDAgMSAxLjEyIDEuMTJ6Ii8+JiN4YTsJPGRlZnM+JiN4YTsJCTxwYXRoIGlkPSJCIiBkPSJNMi40NSAxOS41YTIuNDQgMi40NCAwIDEgMSAyLjQzLTIuNDQgMi40NCAyLjQ0IDAgMCAxLTIuNDMgMi40NHptMC0zLjM4YS45NC45NCAwIDEgMCAuOTMuOTQuOTQuOTQgMCAwIDAtLjkzLS45NHoiLz4mI3hhOwk8L2RlZnM+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 42, 'Workflows', null, null, null, this.getTagsForStencil(gn, '', dt + 'workflows').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Compute', 'GCP Icons / Compute', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsDataAnalyticsPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon compute ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMTA0NTIyNzA1MDc4IiBoZWlnaHQ9IjIwLjAwMTA0NTIyNzA1MDc4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMC4wMDEwNDUyMjcwNTA3OCAyMC4wMDEwNDUyMjcwNTA3OCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00LjczIDguODN2Mi42M2E0LjkxIDQuOTEgMCAwIDAgMS43MSAxLjc0VjguODN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTcuODkgNi40MXY3LjUzQTcuNjIgNy42MiAwIDAgMCA5IDE0YTggOCAwIDAgMCAxIDBWNi40MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTEuNjQgOS44NnYzLjI5YTUgNSAwIDAgMCAxLjctMS44MlY5Ljg2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS43NCAxNC4zMmwtMS40MiAxLjQyYS40Mi40MiAwIDAgMCAwIC42bDMuNTQgMy41NGEuNDIuNDIgMCAwIDAgLjU5IDBsMS40My0xLjQzYS40Mi40MiAwIDAgMCAwLS41OWwtMy41NC0zLjU0YS40Mi40MiAwIDAgMC0uNiAwIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTkgMGE5IDkgMCAxIDAgMCAxOEE5IDkgMCAxIDAgOSAwbTAgMTUuNjlhNi42OCA2LjY4IDAgMCAxIC4wMDctMTMuMzYgNi42OCA2LjY4IDAgMCAxIDQuNzI3IDExLjQwM0E2LjY4IDYuNjggMCAwIDEgOSAxNS42OSIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'BigQuery', null, null, null, this.getTagsForStencil(gn, '', dt + 'bigquery').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY0MDAwMDM0MzMyMjc1NCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjY0MDAwMDM0MzMyMjc1NCAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAgMGgxNC42M3YzLjk0aC01LjN2NS4zM0g1LjM1VjMuOTZIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy45NSAxMC42N2g1LjM0VjIwSDUuMzV2LTUuMzVIMFY1LjM3aDMuOTV6TTE0LjY0IDIwSDEwLjdWNS4zNmgzLjk0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDE2LjA2aDMuOTJWMjBIMHoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 32, s * 42, 'Cloud\nComposer', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud composer').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ny4wNDk2OTgzMjc3ODkyNiIgaGVpZ2h0PSIzNzcuMjkxNTcwNzE1Nzg5NzYiIHZpZXdCb3g9IjAuMTMxMDAwNTE4Nzk4ODI4MTIgLTAuMTIxMDAwMDA2Nzk0OTI5NSA5OS43NjEwMDE1ODY5MTQwNiA5OS44MjQ5OTY5NDgyNDIxOSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qxe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNODAuNTkzIDE5LjE4djIwLjE5OWgxOS4yOTlWOS41M2MwLTIuNTM3LS45NzktNC44NDYtMi41OC02LjU2OHptLTkuOTA4IDYxLjIyNUgxOS40MzFMMy40NSA5Ny4zMzdjMS42OTUgMS40NzQgMy45MDggMi4zNjcgNi4zMzEgMi4zNjdoNzAuNTU1YzIuODczIDAgNS40NTMtMS4yNTYgNy4yMjEtMy4yNDh6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTg3LjU3MyA5Ni40MzdjMS41MDEtMS43MDEgMi40MTMtMy45MzUgMi40MTMtNi4zODJWNjAuMjA0SDcwLjY4NXYyMC4yMDF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE5LjQzMSA4MC40MDVWMjkuMzRoMjAuNTc4VjEwLjA0SDkuNzgxYy01LjMzIDAtOS42NSA0LjMyMS05LjY1IDkuNjV2NzAuMzY1Yy4wMDEgMi45MDYgMS4yODYgNS41MTMgMy4zMiA3LjI4MXptNzcuODgtNzcuNDQzQzk1LjU1IDEuMDY2IDkzLjAzNi0uMTIgOTAuMjQ0LS4xMjFINTkuOTUxVjE5LjE4aDIwLjY0M3oiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud Data\nFusion', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud data fusion').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ni4yNzQ4ODc3NTcyNjMyIiBoZWlnaHQ9IjMzOS42NzM1NDQyMTc3NjM4MyIgdmlld0JveD0iMC4xMTQwMDAwMDAwNTk2MDQ2NCAtMC4wOTAwMDAwMDM1NzYyNzg2OSA5OS41NTU5OTk3NTU4NTkzOCA4OS44NzE5OTQwMTg1NTQ2OSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03Ny41MjMgNDMuMzk3bDEyLjg0NCA3LjU3MnYxNC43NjdsLTEyLjg0NCA2LjY4ek01MC4zMTItLjA5bDEyLjg0NCA3LjU3MnYxNC43NjdsLTEyLjg0NCA2LjY4ek0yMy4xIDQzLjM5N2wxMi44NDQgNy41NzJ2MTQuNzY3TDIzLjEgNzIuNDE3em02OS40Ny0uNTExbDcuMS0xMS4xNjktMTIuNjY2LTIxLjU5NEg3MC42NDR2OS41aDEwLjkxOWw2Ljk3NyAxMS44OTUtNC4yNTYgNi42OTR6bS03Ni45NzktNC42TDExLjMgMzEuNDg1bDcuMjY0LTExLjg2MWg5Ljk3OWwuMDk5LTkuNUgxMy4yNDFMLjExNCAzMS41NjFsMS41NzYgMi40OTggNS41MTUgOC43Mzl6bTEzLjY2MiAzOS40NDlsNy42MDMgMTIuMDQ3aDI1LjkwMmw3LjczMy0xMi4xNjQtOC4xNDMtNC44OTktNC44MDggNy41NjRINDIuMDk1bC00Ljc0LTcuNTExeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03Ny41MjMgNDMuMzk3bC0xMi44NDQgNy41NzJ2MTQuNzY3bDEyLjg0NCA2LjY4ek01MC4zMTItLjA5TDM3LjQ2OCA3LjQ4MnYxNC43NjdsMTIuODQ0IDYuNjh6TTIzLjEgNDMuMzk3bC0xMi44NDQgNy41NzJ2MTQuNzY3bDEyLjg0NCA2LjY4eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Data\nCatalog', null, null, null, this.getTagsForStencil(gn, '', dt + 'data catalog').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjUxOTk5OTUwNDA4OTM1NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE0LjUxOTk5OTUwNDA4OTM1NSAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MCI+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjM3IDIuMDNsLTEuNzIuOTYgMS41MiAxLjUtLjAyIDEuNzMgMS4wMi4wMS4wMi0xLjczIDQuMjQgMi41Ni0uMDEgMS4wNyAxLjc3LjAzVjYuMTFMOS4wNSAzLjA0bC0uMjctLjk0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNy4zNiAyLjAzbC0xLjQyLjM1LS4yOS42MUwuMzkgNS45Mi4zNiA3Ljk3IDIuMTQgOGwuMDItMS4wNyA0LjMxLTIuNDUtLjAyIDEuNzMuODYuMDEuMDYtNC4xOXoiLz4mI3hhOwkJPGcgY2xhc3M9InN0MSI+JiN4YTsJCQk8cGF0aCBkPSJNNy4zNiAyLjAzTDMuOTUgMCAyLjIxLjk1bDMuNDQgMi4wNCAxLjcyLS45NnptLjcxIDExLjc2bC0xLjcyLS4wMi0uMDIgMS43Mi44MiAyLjQ4IDEuNDItLjEyLjI5LS44NSA1LjI3LTIuOTMuMDMtMi4wOS0xLjc5LS4wMi0uMDIgMS4xLTQuMyAyLjQ1eiIvPiYjeGE7CQkJPHBhdGggZD0iTTcuMTUgMTcuOTdsLTMuNDYgMS45NGgtLjA1bC0xLjY2LS45OSAzLjQ5LTEuOTYgMS42OCAxLjAxeiIvPiYjeGE7CQk8L2c+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Ik0xMC44OC4wOWgtLjA1TDcuMzcgMi4wM2wxLjY4IDEuMDEgMy40OS0xLjk2ek0xMC42MiAyMGgtLjA1bC0zLjQyLTIuMDNoMCAwIDBsMS43Mi0uOTYgMy40NCAyLjA0eiIvPiYjeGE7CQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNLjMzIDEzLjg5di0yaDEuNzZsLS4wMSAxLjA0IDQuMjUgMi41Ni4wMi0xLjcyLjg2LjAxLS4wNiA0LjE4LTEuNjgtMXoiLz4mI3hhOwk8L2c+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iMTMuMzgiIGN5PSIxMC4wNCIgcj0iMS4xNCIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjEuMTQiIGN5PSI5Ljg4IiByPSIxLjE0Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QyIiBjeD0iNy4zMiIgY3k9IjcuOTkiIHI9IjEuMTQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSI3LjIzIiBjeT0iMTIiIHI9IjEuMTQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 31, s * 42, 'Dataflow', null, null, null, this.getTagsForStencil(gn, '', dt + 'dataflow').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjI3MS44OTgxMDE4MDY2NDA2IiBoZWlnaHQ9IjQyMy4wMDQwMjgzMjAzMTI1IiB2aWV3Qm94PSIwLjAwMDQ2MTI3MDM2MzMwMjkwMTQgMCAyNzEuODk4MTAxODA2NjQwNiA0MjMuMDA0MDI4MzIwMzEyNSI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDtmaWxsLXJ1bGU6ZXZlbm9kZH0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOTcuMzc4IDE0NC43NzRhMy4xMSAzLjExIDAgMCAxIDMuMTA1IDIuOTM0bC4wMDUuMTc3djE3LjEwN2EzLjExIDMuMTEgMCAwIDEtMi45MzQgMy4xMDVsLS4xNzcuMDA1aC0xMi40NDF2MzAuNjQ5YzAgMS4yMjcuMjk3IDIuNDM1Ljg2MiAzLjUyMmwuMTYxLjI5MyA4My44OTUgMTQ0LjI2MmExNS4yNiAxNS4yNiAwIDAgMSAuMTgyIDE0LjkzNmwtLjE4Mi4zMjQtMzAuNDMxIDUzLjI4NmExNS4yNiAxNS4yNiAwIDAgMS0xMi44NjEgNy42MjZsLS4zNTUuMDA0SDQ1LjY5MmExNS4yNiAxNS4yNiAwIDAgMS0xMy4wMzUtNy4zMjRsLS4xODEtLjMwNS0zMC40MzEtNTMuMjg2YTE1LjI2IDE1LjI2IDAgMCAxLS4xODItMTQuOTM2bC4xODItLjMyNCA4My42NzQtMTQ0LjI2MmMuNjIxLTEuMDc3IDEuMTYtMi4yODkgMS4yMzQtMy41MjhsLjAwOS0uMjg3di0zMC42NDlINzQuNTJjLTEuNjU4IDAtMy4wMTQtMS4yOTktMy4xMDUtMi45MzRsLS4wMDUtLjE3NnYtMTcuMTA3YTMuMTEgMy4xMSAwIDAgMSAyLjkzNC0zLjEwNWwuMTc2LS4wMDV6bS0zNS43NjkgMjMuMzI3aC01MS4zMnYzNS40MDVjMCAyLjUzMS0uNjI4IDUuMDE4LTEuODI2IDcuMjQybC0uMjE3LjM5TDI4LjAzMyAzNTAuOWE3LjYzIDcuNjMgMCAwIDAtLjEzOSA3LjM3NWwuMTQxLjI1NSAyMC43NDEgMzUuOTIxYTcuNjMgNy42MyAwIDAgMCA2LjMyNyAzLjgxbC4yODEuMDA1aDI1LjU3MmwtMjIuNjA1LTM5LjE1M2MtMS4zMTQtMi4yNzYtMS4zNjEtNS4wNjItLjE0MS03LjM3NWwuMTQxLS4yNTUgMTkuNjc5LTM0LjA4NmgxNDYuNjA2TDIxMi45ODggMjk3LjFoLTU0LjI1OWwtOC44MjEtMTUuMjc4aDU0LjMxMmwtMTYuMzMzLTI4LjQ2aC01NC43OGwtOC44MjEtMTUuMjc4aDU0LjgzM2wtMTUuNDY1LTI2Ljk0NmExNS4yNyAxNS4yNyAwIDAgMS0yLjAzOS03LjE4NWwtLjAwNy0uNDQ2em03Mi44NDQgMTY2LjQwMWwtNTQuMTgxLjAwMSA4LjgyMSAxNS41NTJoNTQuMjg1ek0xMDQuOTIxIDc5Ljc5NWM4LjQyNyAwIDE1LjI1OSA2LjgzMyAxNS4yNTkgMTUuMjYxcy02LjgzMiAxNS4yNTktMTUuMjU5IDE1LjI1OS0xNS4yNTktNi44MzItMTUuMjU5LTE1LjI1OSA2LjgzMi0xNS4yNjEgMTUuMjU5LTE1LjI2MXptNTcuNTc1LTMyLjc0M2MxMi42NDIgMCAyMi44OSAxMC4yNDcgMjIuODkgMjIuODg5cy0xMC4yNDkgMjIuODg5LTIyLjg5IDIyLjg4OS0yMi44ODktMTAuMjQ5LTIyLjg4OS0yMi44ODkgMTAuMjQ3LTIyLjg4OSAyMi44ODktMjIuODg5ek0xMjcuODEgMGM4LjQyNyAwIDE1LjI2MSA2LjgzMyAxNS4yNjEgMTUuMjYxUzEzNi4yMzcgMzAuNTIgMTI3LjgxIDMwLjUycy0xNS4yNTktNi44MzItMTUuMjU5LTE1LjI1OVMxMTkuMzg0IDAgMTI3LjgxIDB6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 28, s * 42, 'Datalab', null, null, null, this.getTagsForStencil(gn, '', dt + 'datalab').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjI3OTk5ODc3OTI5Njg3NSIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMS4yNDYyOTA4MDM4OTEyNzAxZS04IDAgMTguMjc5OTk4Nzc5Mjk2ODc1IDIwIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qye2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTcuNjMgOWEuOTEuOTEgMCAxIDEtLjY0My4yNjdBLjkxLjkxIDAgMCAxIDcuNjMgOXptMC0uOGExLjcxIDEuNzEgMCAxIDAgMS43IDEuNzEgMS43IDEuNyAwIDAgMC0xLjctMS43MXpNMS43MiA5YS45MS45MSAwIDEgMS0uNjQzLjI2N0EuOTEuOTEgMCAwIDEgMS43MiA5em0wLS44YTEuNzEgMS43MSAwIDEgMCAxLjcgMS43MSAxLjcgMS43IDAgMCAwLTEuNy0xLjcxem0zLjA0IDYuMTFhLjkxLjkxIDAgMSAxIDAgMS44Mi45MS45MSAwIDEgMSAwLTEuODJ6bTAtLjc5YTEuNzEgMS43MSAwIDEgMCAxLjIuNSAxLjcgMS43IDAgMCAwLTEuMi0uNXptMC05LjczYS45MS45MSAwIDAgMS0uMDQgMS44MTkuOTEuOTEgMCAwIDEtLjktLjkwOS45Mi45MiAwIDAgMSAuOTQtLjkxem0wLS44YTEuNzEgMS43MSAwIDEgMCAxLjIuNUExLjcgMS43IDAgMCAwIDQuNzYgM3oiLz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPHBhdGggZD0iTTcuODEgMGgxLjY4djIwSDcuODF6Ii8+JiN4YTsJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMy40IDIuODdIOC44OWEuMzcuMzcgMCAwIDAtLjMuNHYyLjgyYS4zNi4zNiAwIDAgMCAuMy4zOWg0LjUxYS4zNi4zNiAwIDAgMCAuMzEtLjM5VjMuMjhhLjM3LjM3IDAgMCAwLS4zMS0uNDF6bTQuMzIgNS4yOUg5LjRjLS4zMSAwLS41Ni4xOC0uNTYuMzl2Mi44MmMwIC4yMi4yNS40LjU2LjRoOC4zMmMuMzEgMCAuNTYtLjE5LjU2LS40VjguNTVjMC0uMjItLjI1LS4zOS0uNTYtLjM5em0tNS45MSA1LjI4SDguMjhjLS4xMyAwLS4yMy4xOC0uMjMuMzl2Mi44MmMwIC4yMi4xLjM5LjIzLjM5aDMuNTNjLjEzIDAgLjI0LS4xOC4yNC0uMzl2LTIuODJjLS4wMS0uMjItLjExLS4zOS0uMjQtLjM5eiIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;', 
		    		s * 38, s * 42, 'Dataprep', null, null, null, this.getTagsForStencil(gn, '', dt + 'dataprep').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjM2MzAxMjMxMzg0Mjc3MyIgaGVpZ2h0PSIxNy45NzU1MjY4MDk2OTIzODMiIHZpZXdCb3g9IjAuMDAwNTYwMDI1NjI2MzI3ODQyNSAwLjYxOTYyOTc0MDcxNTAyNjkgMTkuMzYzMDEyMzEzODQyNzczIDE3Ljk3NTUyNjgwOTY5MjM4MyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDN7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxnIGNsYXNzPSJzdDAgc3QxIj4mI3hhOwkJPHBhdGggZD0iTTQuNjkgMTYuNGwxMC4xOS01Ljg5Ljk3IDEuNjktMTAuMTggNS44OHoiLz4mI3hhOwkJPHBhdGggZD0iTTcuNSA0LjR2MTAuMzVsLTEuODcgMS40MVY0LjR6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0xNy40OSAxMS4ybC0uOTcgMS42OC04Ljk2LTUuMTktLjI2LTIuMzZ6Ii8+JiN4YTsJPC9nPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAgc3QyIiBkPSJNMTIuMzkgOC4yNkw3LjMgNS4zM2wuMjYgMi4zNiAxLjUxLjg2YTQgNCAwIDAgMCAzLjMyLS4yOXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIHN0MSIgZD0iTTYuMTMgNi4yOWgwYTMuNzggMy43OCAwIDAgMSA1LjE2NS01LjE2M0EzLjc4IDMuNzggMCAwIDEgOS40IDguMThhMy44IDMuOCAwIDAgMS0zLjI3LTEuODl6TTExIDMuNDlhMS44NCAxLjg0IDAgMCAwLTEuNTktLjkyQTEuODMgMS44MyAwIDAgMCA3LjU3IDQuNGExLjg0IDEuODQgMCAwIDAgMi43OTQgMS43MDZBMS44NCAxLjg0IDAgMCAwIDExLjI0IDQuNGExLjggMS44IDAgMCAwLS4yNC0uOTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCBzdDIiIGQ9Ik01LjYzIDEwLjk0djUuMjJsMS44Ny0xLjQxdi0xLjYzYTMuMjkgMy4yOSAwIDAgMC0xLjg3LTIuMTh6bTUuNyAzLjg3bDQuNTItMi42MS0yLjIxLTEtMS4yNS44YTQuMjMgNC4yMyAwIDAgMC0xLjA2IDIuODZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCBzdDEiIGQ9Ik0uNTEgMTYuN2gwYTMuNzcgMy43NyAwIDAgMSAxLjM4LTUuMTYgMy43MiAzLjcyIDAgMCAxIDIuODYtLjM4QTMuNzggMy43OCAwIDEgMSAuNTEgMTYuN3ptNC44NS0yLjgxQTEuNzkgMS43OSAwIDAgMCA0LjI1IDEzYTEuODMgMS44MyAwIDAgMC0yLjA2IDIuNjloMGMuMzI5LjU2Ni45MzQuOTE0IDEuNTg5LjkxM2ExLjgzIDEuODMgMCAwIDAgMS41ODUtLjkyYy4zMjYtLjU2OC4zMjQtMS4yNjctLjAwNC0xLjgzM3ptNi45NyAyLjQ3aDBhMy43OSAzLjc5IDAgMCAxIDAtMy43NyAzLjc5IDMuNzkgMCAwIDEgNS4xNi0xLjM5IDMuNzggMy43OCAwIDAgMS0xLjg5IDcuMDQ0IDMuNzggMy43OCAwIDAgMS0zLjI3LTEuODg0em00Ljg2LTIuODFhMiAyIDAgMCAwLS42Ny0uNjcgMS44NSAxLjg1IDAgMCAwLTIuNTEuNjggMS44NiAxLjg2IDAgMCAwIDAgMS44MyAxLjgzIDEuODMgMCAwIDAgMi4wNy44NSAxLjgyIDEuODIgMCAwIDAgMS4xMS0uODUgMS44OCAxLjg4IDAgMCAwIDAtMS44NHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIHN0MyIgZD0iTTcuNDkgMTQuMTVsLTIuOCAyLjI1IDIuODYtMS42NWE0LjA3IDQuMDcgMCAwIDAtLjA2LS42ek04LjE1IDhsLS41OS0zLjZ2My4yOWEzLjQ3IDMuNDcgMCAwIDAgLjU5LjI3em01LjE1IDMuNDdsMy4yMiAxLjQxLTIuODYtMS42NGExLjY5IDEuNjkgMCAwIDAtLjM2LjIzeiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 40, 'Dataproc', null, null, null, this.getTagsForStencil(gn, '', dt + 'dataproc').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4LjYwMDAwMDM4MTQ2OTcyNyIgdmlld0JveD0iMCAwIDIwIDE4LjYwMDAwMDM4MTQ2OTcyNyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbC1ydWxlOmV2ZW5vZGR9JiN4YTsJLnN0M3tmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGNpcmNsZSBjeD0iMTAiIGN5PSI5LjMiIHI9IjEuNiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xMi42OSA1LjhsLS43NC0uN0g1LjU4djEuNGg2LjM3eiIgY2xhc3M9InN0MSBzdDIiLz4mI3hhOwk8Y2lyY2xlIGN4PSI0LjgiIGN5PSI1LjgiIHI9IjEuMjMiIGNsYXNzPSJzdDMiLz4mI3hhOwk8Y2lyY2xlIGN4PSIxNS4yIiBjeT0iNS44IiByPSIxLjYiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMTQuMzggMTMuNXYtMS40SDguMWwtLjc0LjcuNzQuN3oiIGNsYXNzPSJzdDEgc3QyIi8+JiN4YTsJPGNpcmNsZSBjeD0iNC44IiBjeT0iMTIuOCIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTUuMiIgY3k9IjEyLjgiIHI9IjEuMjMiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMTUuNiAxLjZsLS43NC0uN0gyLjE4djEuNGgxMi42OHoiIGNsYXNzPSJzdDEgc3QyIi8+JiN4YTsJPGNpcmNsZSBjeD0iMS42IiBjeT0iMS42IiByPSIxLjIzIiBjbGFzcz0ic3QzIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTguNCIgY3k9IjEuNiIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPHBhdGggZD0iTTE3Ljg0IDE3Ljd2LTEuNEg1LjE0bC0uNzQuNy43NC43eiIgY2xhc3M9InN0MSBzdDIiLz4mI3hhOwk8Y2lyY2xlIGN4PSIxLjYiIGN5PSIxNyIgcj0iMS42IiBjbGFzcz0ic3QwIi8+JiN4YTsJPGNpcmNsZSBjeD0iMTguNCIgY3k9IjE3IiByPSIxLjIzIiBjbGFzcz0ic3QzIi8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 40, 'Genomics', null, null, null, this.getTagsForStencil(gn, '', dt + 'genomics').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMxOTk5OTY5NDgyNDIyIiBoZWlnaHQ9IjIwLjAwMDAwMTkwNzM0ODYzMyIgdmlld0JveD0iMCAwIDE4LjMxOTk5OTY5NDgyNDIyIDIwLjAwMDAwMTkwNzM0ODYzMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MXtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxkZWZzPiYjeGE7CQk8ZmlsdGVyIGlkPSJBIiB4PSI0LjY0IiB5PSI0LjE5IiB3aWR0aD0iMTQuNzMiIGhlaWdodD0iMTIuNzYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4mI3hhOwkJCTxmZUZsb29kIGZsb29kLWNvbG9yPSIjZmZmIi8+JiN4YTsJCQk8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIvPiYjeGE7CQk8L2ZpbHRlcj4mI3hhOwkJPG1hc2sgaWQ9IkIiIHg9IjQuNjQiIHk9IjQuMTkiIHdpZHRoPSIxNC43MyIgaGVpZ2h0PSIxMi43NiIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSI+JiN4YTsJCQk8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyLjIzIiByPSIzLjU4IiBmaWx0ZXI9InVybCgjQSkiLz4mI3hhOwkJPC9tYXNrPiYjeGE7CTwvZGVmcz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjIuMTkiIGN5PSI2LjIxIiByPSIxLjcyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxOC4yOCIgcj0iMS43MiIvPiYjeGE7CTwvZz4mI3hhOwk8ZyBtYXNrPSJ1cmwoI0IpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMi44NCAtMikiPiYjeGE7CQk8cGF0aCB0cmFuc2Zvcm09Im1hdHJpeCguNSAtLjg3IC44NyAuNSAtNC41OSAyMC41MykiIGQ9Ik0xNC42OSAxMC4yMmgxLjU5djguMDRoLTEuNTl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIHRyYW5zZm9ybT0icm90YXRlKDMzMCA4LjUyMyAxNC4yNDQpIiBkPSJNNC40OSAxMy40NWg4LjA0djEuNTlINC40OXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTExLjIgNC4xOWgxLjU5djguMDRIMTEuMnoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjkuMTYiIGN5PSIxMC4yMyIgcj0iMi43OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIyLjE5IiBjeT0iMTQuMjUiIHI9IjIuMTkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuMTMiIGN5PSIxNC4yNSIgcj0iMi4xOSIvPiYjeGE7CQk8Y2lyY2xlIGN4PSI5LjE2IiBjeT0iMi4xOSIgcj0iMi4xOSIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;', 
		    		s * 38, s * 42, 'Pub/Sub', null, null, null, this.getTagsForStencil(gn, '', dt + 'pub sub').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Data Analytics', 'GCP Icons / Data Analytics', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsManagementToolsPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon compute ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3My4xMTQ5NzU3NzgxNzE2NCIgaGVpZ2h0PSIzODMuMTM4MDM1MDYzOTUxOCIgdmlld0JveD0iMCAwIDk4LjcxOTk5MzU5MTMwODYgMTAxLjM3MjAwOTI3NzM0Mzc1Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjguMTk1IDBjLTUuMDExIDAtOS4wNzQgNC4wNjItOS4wNzQgOS4wNzMuMDAyLjc3OS4xMDUgMS41NTUuMzA1IDIuMzA4TDQ5LjMwNSAyMS41ODdsLTkuODExLTkuNTk3Yy4yNjItLjg1OS4zOTYtMS43NTEuMzk2LTIuNjQ5IDAtMi40MDctLjk1Ni00LjcxNS0yLjY1OC02LjQxNlMzMy4yMjMuMjY3IDMwLjgxNi4yNjdzLTQuNzE1Ljk1Ni02LjQxNiAyLjY1OC0yLjY1OCA0LjAxLTIuNjU4IDYuNDE2Ljk1NiA0LjcxNSAyLjY1OCA2LjQxNiA0LjAxIDIuNjU4IDYuNDE2IDIuNjU4Yy4yOTktLjAwMi41OTgtLjAxOC44OTUtLjA1bDEwLjU1MyAxMC4zMjMtMTQuNjIxIDE0Ljc0Mi05LjQ1Ni05Ljc4OGMuMTQ0LS42NDUuMjE2LTEuMzAzLjIxNy0xLjk2NCAwLTUuMDExLTQuMDYyLTkuMDc0LTkuMDczLTkuMDc0LTIuNDA3IDAtNC43MTUuOTU2LTYuNDE2IDIuNjU4Uy4yNTcgMjkuMjczLjI1NyAzMS42NzlzLjk1NiA0LjcxNSAyLjY1OCA2LjQxNiA0LjAxIDIuNjU4IDYuNDE2IDIuNjU4Yy41NTktLjAwMiAxLjExNi0uMDU2IDEuNjY2LS4xNjFsMzEuMDM3IDMyLjEyNi0xMC4wODggMTAuNDA1Yy0uMzgxLS4wNDktLjc2NS0uMDczLTEuMTQ5LS4wNzMtMi40MDcgMC00LjcxNS45NTYtNi40MTYgMi42NThzLTIuNjU4IDQuMDEtMi42NTggNi40MTYuOTU2IDQuNzE1IDIuNjU4IDYuNDE2IDQuMDEgMi42NTggNi40MTYgMi42NTggNC43MTUtLjk1NiA2LjQxNi0yLjY1OCAyLjY1OC00LjAxIDIuNjU4LTYuNDE2YzAtLjgzMS0uMTE1LTEuNjU3LS4zNC0yLjQ1N2wyNi4zMjUtMjcuMTUtNy4xOC02Ljk2My05LjY3NyA5Ljk4MS0xNC40MDYtMTQuOTEgMzIuMzAxLTMyLjU3M2MuNDMxLjA2My44NjYuMDk1IDEuMzAyLjA5NiAyLjQwNyAwIDQuNzE1LS45NTYgNi40MTYtMi42NThzMi42NTgtNC4wMSAyLjY1OC02LjQxNkM3Ny4yNjkgNC4wNjIgNzMuMjA2IDAgNjguMTk1IDB6bTIxLjQ1MSAyMi40NDFjLTIuNDA3IDAtNC43MTUuOTU2LTYuNDE2IDIuNjU4cy0yLjY1OCA0LjAxLTIuNjU4IDYuNDE2Yy4wMDIuNTkzLjA2MiAxLjE4My4xNzkgMS43NjRMNzAuNTA0IDQzLjUzNmwtOS42NTYtOS45MzctNy4xNzQgNi45NjlMODAuNDk1IDY4LjE3Yy0uMTEuNTYyLS4xNjYgMS4xMzQtLjE2OCAxLjcwNyAwIDIuNDA3Ljk1NiA0LjcxNSAyLjY1OCA2LjQxNnM0LjAxIDIuNjU4IDYuNDE2IDIuNjU4YzUuMDExIDAgOS4wNzMtNC4wNjMgOS4wNzMtOS4wNzRzLTQuMDYyLTkuMDc0LTkuMDczLTkuMDc0Yy0uNjQ1LjAwMS0xLjI4OC4wNzEtMS45MTguMjA4bC0xMC4wMS0xMC4zMDRMODcuNzgxIDQwLjM5Yy42MTMuMTMgMS4yMzguMTk3IDEuODY1LjE5OCAyLjQwNyAwIDQuNzE1LS45NTYgNi40MTYtMi42NThzMi42NTgtNC4wMSAyLjY1OC02LjQxNi0uOTU2LTQuNzE1LTIuNjU4LTYuNDE2LTQuMDEtMi42NTgtNi40MTYtMi42NTh6bS03My41MzQgMzMuMjJsLTUuMDgxIDUuMjU3Yy0uNjQzLS4xNDItMS4yOTktLjIxNC0xLjk1Ny0uMjE0LTIuNDA3IDAtNC43MTUuOTU2LTYuNDE2IDIuNjU4UzAgNjcuMzcxIDAgNjkuNzc3cy45NTYgNC43MTUgMi42NTggNi40MTYgNC4wMSAyLjY1OCA2LjQxNiAyLjY1OCA0LjcxNS0uOTU2IDYuNDE2LTIuNjU4IDIuNjU4LTQuMDEgMi42NTgtNi40MTZjMC0uNTYxLS4wNTItMS4xMjEtLjE1Ni0xLjY3Mmw1LjMxLTUuNDkyem00NC4yMjMgMjEuNzZsLTYuODkzIDcuMjQ0IDUuNTE1IDUuMjQ5Yy0uMjE0Ljc3Ny0uMzIzIDEuNTc4LS4zMjUgMi4zODQgMCAyLjQwNy45NTYgNC43MTUgMi42NTggNi40MTZzNC4wMSAyLjY1OCA2LjQxNiAyLjY1OCA0LjcxNS0uOTU2IDYuNDE2LTIuNjU4IDIuNjU4LTQuMDEgMi42NTgtNi40MTYtLjk1Ni00LjcxNS0yLjY1OC02LjQxNi00LjAxLTIuNjU4LTYuNDE2LTIuNjU4Yy0uMzk3LjAwMi0uNzk0LjAyOS0xLjE4Ny4wODN6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 42, 'Anthos Service\nMesh', null, null, null, this.getTagsForStencil(gn, '', dt + 'anthos service mesh').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTQuNDkgMTBMMTAgMTQuNDkgNS41MSAxMCAxMCA1LjUxek0xMCAxMi45MUwxMi45MSAxMCAxMCA3LjA5IDcuMDkgMTB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwIDEwaC0yLjY1bC0zLjAyIDMuMDJoMi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjAgMTBsLTMuMDItMy4wMmgtMi42NUwxNy4zNSAxMHpNMCAxMGgyLjY1bDMuMDItMy4wMkgzLjAyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LjY3IDEzLjAyTDIuNjUgMTBIMGwzLjAyIDMuMDJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEwIDIuNjVWMEw2Ljk4IDMuMDJ2Mi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMDIgNS42N1YzLjAyTDEwIDB2Mi42NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTAgMjB2LTIuNjVsLTMuMDItMy4wMnYyLjY1eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMy4wMiAxNi45OHYtMi42NUwxMCAxNy4zNVYyMHoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud\nAPIs', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud apis application programming interfaces').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud\nBilling API', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud billing api application programming interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud\nConsole', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud console').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUyOTk5OTczMjk3MTE5MSIgdmlld0JveD0iLTIuOTMyMDk3ODk3ODEyMDE0ZS05IC01LjI1ODAxNTA0MTgzNzk1NmUtMTUgMjAgMTMuNTI5OTk5NzMyOTcxMTkxIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC44MyAxMC41OGgyLjMzdjIuNjRIOC44M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuNDggOC42MWEuNTYuNTYgMCAwIDEtLjQtLjE3TDEyIDQuMjEgOS4yNiA3LjFhLjU3LjU3IDAgMCAxLS43Ni4wNUw2LjQyIDUuNDdsLTIuMiAyLjkyYS41Ni41NiAwIDAgMS0uNDUuMjJIMHYxLjcxYS43NS43NSAwIDAgMCAuNzQuNzVoMTguNTJhLjc1Ljc1IDAgMCAwIC43NC0uNzVWOC42MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy41IDcuNWwyLjM4LTMuMTZhLjU1LjU1IDAgMCAxIC4zNy0uMjIuNjMuNjMgMCAwIDEgLjQyLjEybDIuMTIgMS43MiAyLjgtMi45NGEuNTQuNTQgMCAwIDEgLjQtLjE3aDBhLjU0LjU0IDAgMCAxIC40LjE3bDQuMzMgNC40OEgyMFYuNzRhLjc0Ljc0IDAgMCAwLS43NC0uNzRILjc0QS43NC43NCAwIDAgMCAwIC43NHY2LjgxeiIvPiYjeGE7CTxyZWN0IGNsYXNzPSJzdDAiIHg9IjYuNjciIHk9IjEyLjkyIiB3aWR0aD0iNi42NyIgaGVpZ2h0PSIuNjEiIHJ4PSIuMyIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 29, 'Cloud Deployment\nManager', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud deployment manager').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5IiB2aWV3Qm94PSIwIDAgMjAgMTkiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTQgOWg0djJINHptLTIgN2g2djJIMnoiLz4mI3hhOwkJPHBhdGggZD0iTTQgNEgydjEyaDJ6Ii8+JiN4YTsJPC9nPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMCAxSDd2NGgxM3ptMCA3SDd2NGgxM3ptMCA3SDd2NGgxM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNiAwSDB2Nmg2eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 40, 'Cloud\nLogging', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud logging').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud\nMobile App', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud mobile app').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUyOTk5OTczMjk3MTE5MSIgdmlld0JveD0iLTIuOTMyMDk3ODk3ODEyMDE0ZS05IC01LjI1ODAxNTA0MTgzNzk1NmUtMTUgMjAgMTMuNTI5OTk5NzMyOTcxMTkxIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOC44MyAxMC41OGgyLjMzdjIuNjRIOC44M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuNDggOC42MWEuNTYuNTYgMCAwIDEtLjQtLjE3TDEyIDQuMjEgOS4yNiA3LjFhLjU3LjU3IDAgMCAxLS43Ni4wNUw2LjQyIDUuNDdsLTIuMiAyLjkyYS41Ni41NiAwIDAgMS0uNDUuMjJIMHYxLjcxYS43NS43NSAwIDAgMCAuNzQuNzVoMTguNTJhLjc1Ljc1IDAgMCAwIC43NC0uNzVWOC42MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMy41IDcuNWwyLjM4LTMuMTZhLjU1LjU1IDAgMCAxIC4zNy0uMjIuNjMuNjMgMCAwIDEgLjQyLjEybDIuMTIgMS43MiAyLjgtMi45NGEuNTQuNTQgMCAwIDEgLjQtLjE3aDBhLjU0LjU0IDAgMCAxIC40LjE3bDQuMzMgNC40OEgyMFYuNzRhLjc0Ljc0IDAgMCAwLS43NC0uNzRILjc0QS43NC43NCAwIDAgMCAwIC43NHY2LjgxeiIvPiYjeGE7CTxyZWN0IGNsYXNzPSJzdDAiIHg9IjYuNjciIHk9IjEyLjkyIiB3aWR0aD0iNi42NyIgaGVpZ2h0PSIuNjEiIHJ4PSIuMyIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 29, 'Cloud\nMonitoring', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud monitoring').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3NS44NTAyODQ2NDQwODg3MyIgaGVpZ2h0PSIzNTMuODA1Nzc3NDY3NzY5NyIgdmlld0JveD0iMC4yNTU5OTk1NjUxMjQ1MTE3IDAuNDI2MDAwMDI4ODQ4NjQ4MDcgOTkuNDQzNjU2OTIxMzg2NzIgOTMuNjExMDAwMDYxMDM1MTYiPiYjeGE7PHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MXtmaWxsOiNmZmY7fSYjeGE7CS5zdDJ7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qze2ZpbGw6IzY2OWRmNjt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04LjU0NCA3MS45MjhjLTQuODE1IDAtOC4yODgtMy44ODktOC4yODgtOC4zMjdWNy45ODNDLjI1NyA0LjY1IDQuMDcyLjQyNiA3LjQ5NS40MjZoODMuOTUyYzQuNzA1IDAgOC4yNTIgMy4zNzkgOC4yNTIgOC4xNzR2NTEuNDk1Yy4wNDcgNy41OTUtMi40NyAxMS44MzQtOS4wMTIgMTEuODM0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOC4wNDYgNTcuMTV2LTkuOTIybDMxLjg4Mi0xMy44OTEtMzEuODgyLTEzLjY5MlY5LjI2MWw0NS44MDYgMTguOTg0djkuNzl6bTI1LjIzNSAzLjY3MXYtMTAuNTVoMjAuMDc1djEwLjU1eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00MC4wMyA4My41MjRWNzEuOTI4aDIwLjI5NXYxMS41OTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MyIgZD0iTTY5Ljg3MyA4My41MjR2MTAuNTEzSDMwLjFWODMuNTI0eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 40, 'Cloud\nShell', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud shell').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjEyMDAwMDgzOTIzMzQiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxNi4xMjAwMDA4MzkyMzM0IDIwIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEyLjEyIDJ2MmgydjJoMlYyek0wIDZoMi4xMlY0aDJWMmgtNHY0eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNi4xMiA2VjJsLTIgMnYyem0tMiAzbC04IDExVjl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTYuMTIgOC4xMmw0IDIuODgtNCA1LjAzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMC4xMiAwdjExaC04eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi4xMiAxNmgydi0yaDJ2NGgtNHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMi4xMiAxNnYtMmgtMnY0aDQuMTMtLjEzdi0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yLjEyIDE2di0yaC0ydjR6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 34, s * 42, 'Debugger', null, null, null, this.getTagsForStencil(gn, '', dt + 'debugger').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0wIDE1bDUgNWg1bC0yLjUtMi44Nkg2LjI1bC0zLjM5LTMuMzl2LTcuNWwzLjM5LTMuMzlINy41TDEwIDBINUwwIDV6TTEzLjc1IDIuODZsMy4zOSAzLjM5djcuNWwtMy4zOSAzLjM5SDEwTDEyLjUgMjBIMTVsNS01VjVsLTUtNWgtMi41TDEwIDIuODZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBMNy41IDcuNSAxMCA1SDcuNUw1IDcuNXY1TDcuNSAxNUgxMGwtMi41LTIuNXptMi41IDBMMTAgMTIuNWwyLjUgMi41IDIuNS0yLjV2LTVMMTIuNSA1IDEwIDcuNXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Error\nReporting', null, null, null, this.getTagsForStencil(gn, '', dt + 'error reporting').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMxNC44ODMzMTI4NTM1OTA3IiBoZWlnaHQ9IjM3Ny4zNTIwNjc2NDgzMTU0IiB2aWV3Qm94PSItMC41MDE5OTg5MDEzNjcxODc1IDAuMDEzMDAwMDAwMjY4MjIwOTAxIDgzLjMxMjk5NTkxMDY0NDUzIDk5Ljg0MTAwMzQxNzk2ODc1Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiNhZWNiZmE7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOzwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5LjQ5OSAzOS42NzJ2MjAuMDI5TDIyLjk3MyA3MS42N2EyMC4yNCAyMC4yNCAwIDAgMCAzMC43ODIgMi41NTQgMjAuMjQgMjAuMjQgMCAwIDAgNS45MjgtMTQuMzEyYzAtMTEuMTU3LTkuMDI4LTIwLjIwOS0yMC4xODUtMjAuMjR6bS0xLjMwNC4wMzlsLS4wNDkuMDAzLjA0OS0uMDAzem0tLjk2LjA4OWEyMC4yNCAyMC4yNCAwIDAgMC0xNy41MyAxNS42NzNjMS45MzgtOC4zMDYgOS4xNjMtMTQuNjg0IDE3LjUzLTE1LjY3M3pNMTkuNjEyIDU1Ljg5MmwtLjA3Mi4zNTcuMDcyLS4zNTd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM5LjQ5OSA1OS43MDFMMjIuOTY2IDcxLjY3NmEyMC4xNSAyMC4xNSAwIDAgMS0zLjc3Mi0xMS43N2MwLTExLjE3OSA5LjUzOC0yMC4yNDEgMjAuMzA0LTIwLjI0MXptMzUuNTE1LTQ0LjY2NUw2Mi42MzIgMjcuNDc2Yy02LjU0OC00LjY5OS0xNC41NjQtNy40NzItMjMuMjA4LTcuNDcyLTIxLjk5MSAwLTM5LjkyNiAxNy45MzUtMzkuOTI2IDM5LjkyNnMxNy45MzUgMzkuOTI0IDM5LjkyNiAzOS45MjRTNzkuMzQ4IDgxLjkyIDc5LjM0OCA1OS45MjljMC05LjM5NC0zLjI3NC0xOC4wNDYtOC43MzctMjQuODc4bDEyLjItMTIuMjU0em0tMzUuNTkgMTQuOTY3YTI5Ljg1IDI5Ljg1IDAgMCAxIDI5LjkyNCAyOS45MjYgMjkuODUgMjkuODUgMCAwIDEtMjkuOTI0IDI5LjkyNEEyOS44NSAyOS44NSAwIDAgMSA5LjQ5OCA1OS45MjljMC0xNi41ODYgMTMuMzM5LTI5LjkyNiAyOS45MjYtMjkuOTI2ek02MC4xODUuMDEzTDE5LjU3Mi4wOGwuMDE2IDkuNSA0MC42MTMtLjA2NnoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 36, s * 42, 'Profiler', null, null, null, this.getTagsForStencil(gn, '', dt + 'profiler').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQxNiIgaGVpZ2h0PSIzNjIuMjAwMDEyMjA3MDMxMjUiIHZpZXdCb3g9IjAgMCA0MTYgMzYyLjIwMDAxMjIwNzAzMTI1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTk2LjAzIDBMMCAxNjcuMTdoMTkwLjY3TDI4Ny45NCAweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yODcuNTkgMzYyLjJsLTk1LjY4LTE2Ny4xN0gwTDk1LjY4IDM2Mi4yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MTYgMTgxLjFMMzIwIDEzLjMxIDIyMy44OCAxODEuMSAzMjAgMzQ4Ljl6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 36, 'Stackdriver', null, null, null, this.getTagsForStencil(gn, '', dt + 'stackdriver').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA4SDEwdjRoMTB6bTAgOEgxMHY0aDEweiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCAxNkg2djRoNHpNMCAwaDZ2NEgwem0wIDhoMTB2NEgweiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Trace', null, null, null, this.getTagsForStencil(gn, '', dt + 'trace').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Management Tools', 'GCP Icons / Management Tools', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsNetworkingPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon networking ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjUwMDQzNDg3NTQ4ODI4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSItMC4wMDAzNjMwODkyNjA2NDUyMTA3NCAxLjE5MjA5Mjg5NTUwNzgxMjVlLTcgMTYuNTAwNDM0ODc1NDg4MjggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMC40MiAxMi4wN2wxLjA0IDEuMDUtNS40NSA1LjQ4LTEuMDQtMS4wNXptLS44My00LjE5bDEuMDQgMS4wNS03LjM1IDcuMzktMS4wNC0xLjA1em0tNC4xNi0uODVsMS4wNCAxLjA1LTQuODggNC45LTEuMDQtMS4wNXoiLz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHBhdGggZD0iTTguMjUgMS42MWw2Ljc4IDN2NC41NWE5LjcxIDkuNzEgMCAwIDEtNi43OCA5LjMyIDkuNyA5LjcgMCAwIDEtNi43OC05LjMxVjQuNjNsNi43OC0zbTAtMS42M0wwIDMuNjh2NS40OUExMS4xNyAxMS4xNyAwIDAgMCA4LjEgMjBoLjE1LjE1YTExLjE3IDExLjE3IDAgMCAwIDguMS0xMC43OFYzLjY4eiIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMC45NCIgY3k9IjEyLjYyIiByPSIxLjQyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjEwLjEiIGN5PSI4LjQ1IiByPSIxLjQyIi8+JiN4YTsJCTxjaXJjbGUgY3g9IjUuOTQiIGN5PSI3LjYiIHI9IjEuNDIiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;', 
		    		s * 36, s * 42, 'Cloud\nArmor', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud armor').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTMuMTMgNS42M1YzLjIxTDEwIDB2Mi40MXptMy43NSA3LjVMMjAgMTBoLTIuNWwtMy4xMiAzLjEzem0tMTMuNzUgMEwwIDEwaDIuNWwzLjEzIDMuMTN6bTEwIDEuMjV2Mi40MUwxMCAyMHYtMi40MXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik02Ljg4IDUuNjNMMTAgMi40MVYwTDYuODggMy4yMXpNMTcuNSAxMEgyMGwtMy4xMi0zLjEyaC0yLjV6bS0xNSAwSDBsMy4xMy0zLjEyaDIuNXptNC4zOCA0LjM4TDEwIDE3LjU5VjIwbC0zLjEyLTMuMjF6bTAtNy41aDYuMjV2Ni4yNUg2Ljg4eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuODggMTMuMTNsNi4yNS02LjI1djYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMTBsMy4xMy0zLjEydjYuMjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud\nCDN', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud cdn content domain network').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTkgNmgydjEwSDl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwIDE3SDB2MmgyMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTIgMTZIOHY0aDR6TTAgMGgyMHY2SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDBoMTB2NkgxMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMiAyaDJ2MkgyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0wIDhoMjB2NkgweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCA4aDEwdjZIMTB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MyIgZD0iTTIgMTBoMnYySDJ6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 42, 'Cloud\nDNS', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud dns domain name server').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk5OTk5ODA5MjY1MTM2NyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAtMi44NDIxNzA1NjE4NzU1NzQ1ZS0xNSAxOS45OTk5OTgwOTI2NTEzNjcgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNS40OSAxMC40djYuN2EuNC40IDAgMCAxLS40LjRIMi45YS40LjQgMCAwIDEtLjQtLjRWNC45YS40LjQgMCAwIDEgLjQtLjRoNi43YS40LjQgMCAwIDAgLjQtLjRWMi40YS40LjQgMCAwIDAtLjQtLjRILjRhLjQuNCAwIDAgMC0uNC40djE3LjJhLjQuNCAwIDAgMCAuNC40aDE3LjJhLjQuNCAwIDAgMCAuNC0uNHYtOS4yYS40LjQgMCAwIDAtLjQtLjRoLTEuNzFhLjQuNCAwIDAgMC0uNC40eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMiAuNHY3LjJhLjQuNCAwIDAgMCAuNC40aDcuMmEuNC40IDAgMCAwIC40LS40Vi40YS40LjQgMCAwIDAtLjQtLjRoLTcuMmEuNC40IDAgMCAwLS40LjR6bTUuNiA0LjFoLTEuNzFhLjQuNCAwIDAgMS0uNC0uNFYyLjRhLjQuNCAwIDAgMSAuNC0uNGgxLjcxYS40LjQgMCAwIDEgLjQuNHYxLjdhLjQuNCAwIDAgMS0uNC40eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Cloud External\nIP Addresses', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud external ip addresses internet protocol').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNDI4NWY0IiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAgMGg4Ljg5djIuMjJIMHptMCAxNy43OGg4Ljg5VjIwSDB6bTAtOC44OWg4Ljg5djIuMjJIMHpNMTEuMTEgMEgyMHYyLjIyaC04Ljg5em0wIDE3Ljc4SDIwVjIwaC04Ljg5em0wLTguODlIMjB2Mi4yMmgtOC44OXpNNS41NSA0LjQ0aDguODl2Mi4yMkg1LjU1em0wIDguODloOC44OXYyLjIySDUuNTV6TTAgNC40NGgzLjMzdjIuMjJIMHptMCA4Ljg5aDMuMzN2Mi4yMkgwem0xNi42Ny04Ljg5SDIwdjIuMjJoLTMuMzN6bTAgOC44OUgyMHYyLjIyaC0zLjMzeiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Cloud Firewall\nRules', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud firewall rules').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxOCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00IDhIMHYyaDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMgNGgxMHYxMEgzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA4aC00LjY3djJIMjB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE1IDJ2MTRINnYyaDExdi0yVjIgMEg2djJ6TTggNGg1djEwSDh6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 38, 'Cloud\nInterconnect', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud interconnect').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYgMTBoMnY0aC0yem0tNyAwaDJ2NEg5em0tNyAwaDJ2NEgyeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05IDVoMnY0SDl6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIgOWgxNnYySDJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTQgMGgxMnY1SDR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDBoNnY1aC02eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCAxNGg2djZoLTZ6TTAgMTRoNnY2SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMgMTRoM3Y2SDN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTcgMTRoNnY2SDd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDE0aDN2NmgtM3ptNyAwaDN2NmgtM3oiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud Load\nBalancing', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud load balancing').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5OS45OTczMDIyMDQ4OTI5NiIgaGVpZ2h0PSI5Ny44ODA4NTM5MDQyOTYzMyIgdmlld0JveD0iLTAuMDQ1Nzc2MzY3MTg3NSAxLjA4Nzc4ODU4MTg0ODE0NDUgOTkuOTk3Mjk5MTk0MzM1OTQgOTcuODgwODQ0MTE2MjEwOTQiIHZlcnNpb249IjEuMSIgaWQ9InN2ZzUiIGlua3NjYXBlOnZlcnNpb249IjEuMSAoYzY4ZTIyYzM4NywgMjAyMS0wNS0yMykiIHNvZGlwb2RpOmRvY25hbWU9ImNsb3VkX25hdC5zdmciPiYjeGE7ICA8c29kaXBvZGk6bmFtZWR2aWV3IGlkPSJuYW1lZHZpZXc3IiBwYWdlY29sb3I9IiNmZmZmZmYiIGJvcmRlcmNvbG9yPSIjNjY2NjY2IiBib3JkZXJvcGFjaXR5PSIxLjAiIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJtbSIgc2hvd2dyaWQ9ImZhbHNlIiBpbmtzY2FwZTp6b29tPSIwLjU3OTMzNzQ0IiBpbmtzY2FwZTpjeD0iLTQyLjI4OTY4OSIgaW5rc2NhcGU6Y3k9IjI1NC42MDExOSIgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIiBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDE3IiBpbmtzY2FwZTp3aW5kb3cteD0iLTgiIGlua3NjYXBlOndpbmRvdy15PSItOCIgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIxIiBmaXQtbWFyZ2luLXRvcD0iMCIgZml0LW1hcmdpbi1sZWZ0PSIwIiBmaXQtbWFyZ2luLXJpZ2h0PSIwIiBmaXQtbWFyZ2luLWJvdHRvbT0iMCIvPiYjeGE7ICA8ZGVmcyBpZD0iZGVmczIiLz4mI3hhOyAgPGcgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiIGlkPSJsYXllcjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI1OC42MTk3NSwxNi42Njc3MTUpIj4mI3hhOyAgICA8cGF0aCBpZD0icGF0aDE3MzYyIiBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6IzQyODVmNDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC45OTk5OTlweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxIiBkPSJNIDE0MS40MTc5Nyw0LjExMTMyODEgMTI0LjQwMjM0LDI0LjM3NSBjIDU3Ljg5NTM3LDQ4LjYxNjQyNiA4My40MTQwNyw5Ni4wNjQ2NyA4My40MTQwNywxNjMuOTQzMzYgMCw3Mi4zMTIyOCAtMzYuMTA3MzEsMTI0LjgyOTc3IC04Mi4wMTk1MywxNjYuMDQ4ODMgbCAxNy42Nzk2OCwxOS42ODc1IGMgNDkuMjAyOTksLTQ0LjE3MzQyIDkwLjc5Njg4LC0xMDQuNDk4MzcgOTAuNzk2ODgsLTE4NS43MzYzMyAwLC03NC44ODE1MiAtMzEuMTU5NDEsLTEzMi4zOTkwMjIgLTkyLjg1NTQ3LC0xODQuMjA3MDMxOSB6IE0gOTYuNTU2NjQxLDc1Ljg4NDc2NiBWIDEwMi4zNDE4IEggMTY2LjQ4MzA1IEMgMTYyLjM5Mjc0LDk0LjU1NDQyIDE1OC40NTE0Myw4Ni44NDE1NDIgMTQ4LjAyMjMzLDc1Ljg4NDc2NiBaIE0gMzE3Ljc3OTMsMjAyLjMwNjY0IHYgMzIuMjkyOTcgbCA1OS45OTAyMywtNDUuNTE3NTggLTU5Ljk5MDIzLC00NS41MTc1OCB2IDMyLjI4NTE2IGggLTY0LjQ3NDYxIHYgMjYuNDU3MDMgeiBNIDUwLjA1ODU5NCwxNzUuODQ5NjEgdiAyNi40NTcwMyBIIDE4Ny4yODEyNSBjIDEuMTU3NDUsLTguMDQ3MzcgMS4yODIzMSwtMTYuNzgzMTUgMCwtMjYuNDU3MDMgeiBtIDQ3LjAzNzEwOSwxMDAuMDQ2ODcgdiAyNi40NTcwNCBoIDUwLjY4MjY3NyBjIDguMDE2NTcsLTguMDE0NjYgMTQuNDYxNjksLTE2LjgxNTA0IDE5LjIyMzU3LC0yNi40NTcwNCB6IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjI2NDU4MzMzLDAsMCwwLjI2NDU4MzMzLC0yNTguNjE5NzUsLTE2LjY2NzcxNSkiIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NzY2NzY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjIi8+JiN4YTsgICAgPHBhdGggaWQ9InBhdGgxNjI3MS03IiBzdHlsZT0iY29sb3I6IzAwMDAwMDtvcGFjaXR5OjE7ZmlsbDojNjY5ZGY2O3N0cm9rZS1saW5lam9pbjpyb3VuZDstaW5rc2NhcGUtc3Ryb2tlOm5vbmU7ZmlsbC1vcGFjaXR5OjEiIGQ9Im0gLTIzNy45NTQwOCw1MS45MDU2ODYgYyAtNC4zNDYzLDEwZS03IC03LjkyMzgyLDMuNTc3NTIxIC03LjkyMzgyLDcuOTIzODI4IDAsNC4zNDYzMDcgMy41Nzc1Miw3LjkyMzgyOCA3LjkyMzgyLDcuOTIzODI4IDQuMzQ2MzEsMCA3LjkyMzgzLC0zLjU3NzUyMSA3LjkyMzgzLC03LjkyMzgyOCAwLC00LjM0NjMwNyAtMy41Nzc1MiwtNy45MjM4MjcgLTcuOTIzODMsLTcuOTIzODI4IHogbSAwLDUgYyAxLjY0NDExLDAgMi45MjM4MywxLjI3OTcxOCAyLjkyMzgzLDIuOTIzODI4IDAsMS42NDQxMSAtMS4yNzk3MiwyLjkyMzgyOCAtMi45MjM4MywyLjkyMzgyOCAtMS42NDQxMSwwIC0yLjkyMzgyLC0xLjI3OTcxOCAtMi45MjM4MiwtMi45MjM4MjggMCwtMS42NDQxMSAxLjI3OTcxLC0yLjkyMzgyOCAyLjkyMzgyLC0yLjkyMzgyOCB6IG0gLTEyLjc4NzYxLC0zMS40ODg1OTMgYyAtNC4zNDYzLDEwZS03IC03LjkyMzgyLDMuNTc3NTIxIC03LjkyMzgyLDcuOTIzODI4IDAsNC4zNDYzMDcgMy41Nzc1Miw3LjkyMzgyOCA3LjkyMzgyLDcuOTIzODI4IDQuMzQ2MzEsMCA3LjkyMzgzLC0zLjU3NzUyMSA3LjkyMzgzLC03LjkyMzgyOCAwLC00LjM0NjMwNyAtMy41Nzc1MiwtNy45MjM4MjcgLTcuOTIzODMsLTcuOTIzODI4IHogbSAwLDUgYyAxLjY0NDExLDAgMi45MjM4MywxLjI3OTcxOCAyLjkyMzgzLDIuOTIzODI4IDAsMS42NDQxMSAtMS4yNzk3MiwyLjkyMzgyOCAtMi45MjM4MywyLjkyMzgyOCAtMS42NDQxMSwwIC0yLjkyMzgyLC0xLjI3OTcxOCAtMi45MjM4MiwtMi45MjM4MjggMCwtMS42NDQxMSAxLjI3OTcxLC0yLjkyMzgyOCAyLjkyMzgyLC0yLjkyMzgyOCB6IG0gMTIuNjE2NTIsLTMxLjQzMTQ5MjkgYyAtNC4zNDYzLDZlLTcgLTcuOTIzODIsMy41Nzc1MjA4IC03LjkyMzgyLDcuOTIzODI4MSAwLDQuMzQ2MzA2OCAzLjU3NzUyLDcuOTIzODI3OCA3LjkyMzgyLDcuOTIzODI3OCA0LjM0NjMxLDAgNy45MjM4MywtMy41Nzc1MjEgNy45MjM4MywtNy45MjM4Mjc4IDAsLTQuMzQ2MzA3MyAtMy41Nzc1MiwtNy45MjM4Mjc1IC03LjkyMzgzLC03LjkyMzgyODEgeiBtIDAsNSBjIDEuNjQ0MTEsMmUtNyAyLjkyMzgzLDEuMjc5NzE4NCAyLjkyMzgzLDIuOTIzODI4MSAwLDEuNjQ0MTA5NiAtMS4yNzk3MiwyLjkyMzgyNzkgLTIuOTIzODMsMi45MjM4Mjc5IC0xLjY0NDExLDAgLTIuOTIzODIsLTEuMjc5NzE4MyAtMi45MjM4MiwtMi45MjM4Mjc5IDAsLTEuNjQ0MTA5NyAxLjI3OTcxLC0yLjkyMzgyNzkgMi45MjM4MiwtMi45MjM4MjgxIHoiLz4mI3hhOyAgPC9nPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Cloud\nNAT', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud nat').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4Ljc1OTk5ODMyMTUzMzIwMyIgdmlld0JveD0iMCAwIDIwIDE4Ljc1OTk5ODMyMTUzMzIwMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMC42MiAxNi40NUw0LjMgMTAuMzFsLTEuMzYuNzcgNi41OSA2LjUyem01LjA3LTcuNjNsMS43OC0uMzgtNi45LTdMOS40OCAyLjZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOS4zOCAyLjUxaDEuMjV2NUg5LjM4em0wIDkuMzdoMS4yNXY1SDkuMzh6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MiI+JiN4YTsJCTxjaXJjbGUgY3g9IjEwIiBjeT0iMS44OCIgcj0iMS44OCIvPiYjeGE7CQk8Y2lyY2xlIGN4PSIxMCIgY3k9IjE2Ljg4IiByPSIxLjg4Ii8+JiN4YTsJPC9nPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOS4zNyAxMC42M0g0LjNMLjY2IDguNzZoMTUuMDd6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOwk8ZyBjbGFzcz0ic3QyIj4mI3hhOwkJPGNpcmNsZSBjeD0iMi41IiBjeT0iOS42OSIgcj0iMi41Ii8+JiN4YTsJCTxjaXJjbGUgY3g9IjE3LjUiIGN5PSI5LjY5IiByPSIyLjUiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 40, 'Cloud\nNetwork', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud network').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE5LjI5OTk5OTIzNzA2MDU0NyIgdmlld0JveD0iMCAwIDIwIDE5LjI5OTk5OTIzNzA2MDU0NyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuNDMgNi4xSDBWMi42N2gzLjk0bDguNCAxMC40OWgyLjM0di0yLjcyTDIwIDE0Ljg3bC01LjMyIDQuNDN2LTIuNzFoLTMuODd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LjY4IDYuMTR2Mi43MkwyMCA0LjQzIDE0LjY4IDB2Mi43MWgtMy44N0w4LjMzIDUuODJsMi4xMyAyLjY3IDEuODgtMi4zNXpNMCAxMy4ydjMuNDNoMy45NGwyLjUyLTMuMTUtMi4xMy0yLjY3LTEuOSAyLjM5eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 40, 'Cloud\nRoutes', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud routes').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE3IDEydjNsLTUtNSA1LTV2M2gzdjR6TTMgOEgwdjRoM3YzbDUtNS01LTV6bTkgN3YtM0g4djNINWw1IDUgNS01em0wLTEwdjNIOFY1SDVsNS01IDUgNXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud\nRouter', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud router').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1MDAwMDc2MjkzOTQ1MyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE3Ljk1MDAwMDc2MjkzOTQ1MyAyMCI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0xMS43IDkuMjhoNC4xOHYxLjM4SDExLjd6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik0xNC45MiA0LjEyaDEuMzh2MTEuNzFoLTEuMzh6Ii8+JiN4YTsJPC9nPiYjeGE7CTxnIGNsYXNzPSJzdDAiPiYjeGE7CQk8cmVjdCB4PSIxMy4yNyIgeT0iMTUuMzIiIHdpZHRoPSI0LjY4IiBoZWlnaHQ9IjQuNjgiIHJ4PSIuMjgiLz4mI3hhOwkJPHJlY3QgeD0iMTMuMjciIHdpZHRoPSI0LjY4IiBoZWlnaHQ9IjQuNjgiIHJ4PSIuMjgiLz4mI3hhOwk8L2c+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMuOTUgOS4yOGg0LjI4djEuMzhIMy45NXoiLz4mI3hhOwk8ZyBjbGFzcz0ic3QwIj4mI3hhOwkJPHJlY3QgeT0iNy42MyIgd2lkdGg9IjQuNjgiIGhlaWdodD0iNC42OCIgcng9Ii4yOCIvPiYjeGE7CQk8cGF0aCBkPSJNOS45NyAxMi4xN2EyLjIgMi4yIDAgMSAxIDAtNC40IDIuMiAyLjIgMCAwIDEgMi4yIDIuMiAyLjE5IDIuMTkgMCAwIDEtMi4yIDIuMnptMC0zLjU3YTEuMzggMS4zOCAwIDAgMC0xLjA1IDIuMzNBMS4zOCAxLjM4IDAgMCAwIDExLjMgMTBhMS4zNyAxLjM3IDAgMCAwLTEuMzMtMS40eiIvPiYjeGE7CTwvZz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud\nVPN', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud vpn virtual private network').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEzLjUxOTk5OTUwNDA4OTM1NSIgdmlld0JveD0iMCAtMi4wNjA1NzM0NTA4OTU1MTA2ZS0xNSAyMCAxMy41MTk5OTk1MDQwODkzNTUiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOS4xOSAxLjYyaDEuNjJ2MTAuMjdIOS4xOXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA1Ljk1aDIuN3YxLjYySDB6Ii8+JiN4YTsJPHJlY3QgY2xhc3M9InN0MCIgeD0iMi40MyIgeT0iMy41MiIgd2lkdGg9IjQuODYiIGhlaWdodD0iNi40OSIgcng9Ii4yNCIvPiYjeGE7CTxnIGNsYXNzPSJzdDEiPiYjeGE7CQk8cGF0aCBkPSJNOS4xOSAxLjYyaDEuNjJ2MTAuMjdIOS4xOXptOC4xMSA0LjMzSDIwdjEuNjJoLTIuN3oiLz4mI3hhOwkJPHBhdGggZD0iTTQuNTkgMTEuOXYxLjMzYS4yOS4yOSAwIDAgMCAuMjkuMjloMTAuMjRhLjI5LjI5IDAgMCAwIC4yOS0uMjloMFYxMS45ek0xNS4xMiAwSDQuODhhLjI5LjI5IDAgMCAwLS4yOS4yOWgwdjEuMzNoMTAuODJWLjI5YS4yOS4yOSAwIDAgMC0uMjktLjI5eiIvPiYjeGE7CTwvZz4mI3hhOwk8cmVjdCBjbGFzcz0ic3QwIiB4PSIxMi43IiB5PSIzLjUyIiB3aWR0aD0iNC44NiIgaGVpZ2h0PSI2LjQ5IiByeD0iLjI0Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 29, 'Partner\nInterconnect', null, null, null, this.getTagsForStencil(gn, '', dt + 'partner interconnect').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAyODAxODk1MTQxNjAxNiIgaGVpZ2h0PSIxMC4wMTk3MzA1Njc5MzIxMjkiIHZpZXdCb3g9Ii0wLjAwMDAxOTc3MjAwNTU0MzkyNzY2MiAwIDIwLjAyODAxODk1MTQxNjAxNiAxMC4wMTk3MzA1Njc5MzIxMjkiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuMjU4IDIuMjRBOS42MSA5LjYxIDAgMCAwIDEwLjEwOCAwQzUuMjY4IDAgMS4xMzggMy42NS4wMjggOC45YS44MS44MSAwIDEgMCAxLjU4LjM1aDBjLjk1LTQuNTEgNC40Mi03LjY1IDguNS03LjY1YTcuODYgNy44NiAwIDAgMSA0LjQ1IDEuNHptLjQ0IDEuMjlsLTUuODggMi42M2gwYTIgMiAwIDEgMCAxLjEzIDIuNTggMS44MyAxLjgzIDAgMCAwIC4xMi0uNDYuMS4xIDAgMCAwIC4wNSAwbDUtNGMuNTktLjU0LjI3LTEuMDYtLjQyLS43NXoiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSIxOC4wNjgiIGN5PSI1Ljk5IiByPSIuODQiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIxOS4xODgiIGN5PSI5LjA0IiByPSIuODQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 21, 'Premium\nNetwork Tier', null, null, null, this.getTagsForStencil(gn, '', dt + 'premium network tier').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNC4wMDEwMzc1OTc2NTYyNSIgaGVpZ2h0PSIyMTMuOTk4Mzk3ODI3MTQ4NDQiIHZpZXdCb3g9Ii0wLjAwMDAyMDQ4Mjg0MTEzNjk4MTczMyAwIDQyNC4wMDEwMzc1OTc2NTYyNSAyMTMuOTk4Mzk3ODI3MTQ4NDQiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTk5LjQzMSA0Ni44NTRsLjM3NC4yODkgMTA1Ljc1OCA4My4yMDhhNDIuMDggNDIuMDggMCAwIDEgNC43MTUtLjM4OWwuNzg5LS4wMTNjMTcuNDExLS4wMDQgMzMuMDE4IDEwLjc1OCAzOS4yMjMgMjcuMDQ5czEuNzIxIDM0LjcyNS0xMS4yNzEgNDYuMzMzYTQxLjkzIDQxLjkzIDAgMCAxLTQ3LjI1MyA1Ljk1NiA0Mi4wNCA0Mi4wNCAwIDAgMS0yMi40NDQtNDEuNTcxbC4wNTYtLjUxOS0uMDI2LS4wM0w4Ny43IDU4Ljk3NmMtOS40ODEtMTIuNTYyLS41NzUtMjEuNDg2IDExLjczLTEyLjEyM3ptMzA2LjgzOCAxMjcuNzI2YzkuNzkzIDAgMTcuNzMyIDcuOTQ5IDE3LjczMiAxNy43NTVzLTcuOTM5IDE3Ljc1NS0xNy43MzIgMTcuNzU1LTE3LjczMi03Ljk0OS0xNy43MzItMTcuNzU1IDcuOTM5LTE3Ljc1NSAxNy43MzItMTcuNzU1ek02MC4yNDEgNjguNzk3bDIwLjQyMyAyOC4zMmEyMTcuMTYgMjE3LjE2IDAgMCAwLTQ2LjkyIDk3LjM5OSAxNy4wNCAxNy4wNCAwIDAgMS0xMS4yODggMTIuOTYxYy01LjgyMyAxLjk2NC0xMi4yNTEuNjMzLTE2LjgxOS0zLjQ4MmExNy4wNiAxNy4wNiAwIDAgMS01LjIyOS0xNi4zOGM4LjgxNy00NC4zMDUgMjkuNDk5LTg1LjM3NiA1OS44MzMtMTE4LjgxN3ptMzIyLjc2MiA0MS4zMDhjOS43OTMgMCAxNy43MzIgNy45NDkgMTcuNzMyIDE3Ljc1NXMtNy45MzkgMTcuNzU1LTE3LjczMiAxNy43NTUtMTcuNzMyLTcuOTQ5LTE3LjczMi0xNy43NTUgNy45MzktMTcuNzU1IDE3LjczMi0xNy43NTV6bS00MS42MjgtNTUuMDk0YzkuNzkzIDAgMTcuNzMyIDcuOTQ5IDE3LjczMiAxNy43NTVzLTcuOTM5IDE3Ljc1NS0xNy43MzIgMTcuNzU1LTE3LjczMi03Ljk0OS0xNy43MzItMTcuNzU1IDcuOTM5LTE3Ljc1NSAxNy43MzItMTcuNzU1em0tNTcuNzkyLTM4Ljk3OWM5Ljc5MyAwIDE3LjczMiA3Ljk0OSAxNy43MzIgMTcuNzU1cy03LjkzOSAxNy43NTUtMTcuNzMyIDE3Ljc1NS0xNy43MzItNy45NDktMTcuNzMyLTE3Ljc1NSA3LjkzOS0xNy43NTUgMTcuNzMyLTE3Ljc1NXptLTEzMy4wNzQtNC4zMjdjOS43OTMgMCAxNy43MzIgNy45NDkgMTcuNzMyIDE3Ljc1NXMtNy45MzkgMTcuNzU1LTE3LjczMiAxNy43NTUtMTcuNzMyLTcuOTQ5LTE3LjczMi0xNy43NTUgNy45MzktMTcuNzU1IDE3LjczMi0xNy43NTV6TTIxNy4zNTcgMGM5Ljc5MyAwIDE3LjczMiA3Ljk0OSAxNy43MzIgMTcuNzU1UzIyNy4xNSAzNS41MSAyMTcuMzU3IDM1LjUxcy0xNy43MzItNy45NDktMTcuNzMyLTE3Ljc1NVMyMDcuNTY0IDAgMjE3LjM1NyAweiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 21, 'Standard\nNetwork Tier', null, null, null, this.getTagsForStencil(gn, '', dt + 'standard network tier').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3OC45OTYwMDM2OTA5NDU4IiBoZWlnaHQ9IjM3My40ODg4MDkyODIxODgyNCIgdmlld0JveD0iMCAwIDEwMC4yNzYwMDA5NzY1NjI1IDk4LjgxOTAwNzg3MzUzNTE2Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNC42MTQgMjQuNzc1TDAgMzQuNzA5bDE0LjYxNCA5LjkzM1YzOS45NWMzLjU0NSAxLjQwMyA3LjcwNCAzLjY1OSAxMS4yMjYgNi44NDggNS4yMjQgNC43MyA5LjIzNSAxMS4yIDkuMjM1IDIwLjk2NXYxMS41MzJoMTBWNjcuNzYyYzAtMTIuNjQ0LTUuNjcxLTIyLjE3NS0xMi41MjMtMjguMzc5LTUuOTI5LTUuMzY4LTEyLjU5Mi04LjQ3LTE3LjkzNy0xMC4wMjR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTU0Ljg4NiAxOC41NTR2NjYuMDIxaC00LjUzNWwxMC4xOSAxNC4yNDQgMTAuMTktMTQuMjQ0aC01Ljg0NlYxOC41NTR6TTM5Ljk2MSAwbC05LjcwNSAxMy45NThoNC44MTl2NjUuMzM2aDEwVjEzLjk1N2g0LjU5MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNTQuODg2IDE4LjU1NHYxMi45YzAgMTMuNDY0IDYuNzE5IDIzLjE0OCAxNC4wNTIgMjkuMTI1IDUuOTI1IDQuODI5IDEyLjE0NiA3LjUxIDE2LjQxNCA4Ljg3NnY0LjcyMmwxNC45MjQtOS41NzEtMTQuOTI0LTkuNTcxdjMuNzI1Yy0zLjA0My0xLjI3OC02Ljc3LTMuMjIxLTEwLjA5OC01LjkzMy01LjY5OC00LjY0NC0xMC4zNjktMTEuMTEtMTAuMzY5LTIxLjM3M3YtMTIuOXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Traffic\nDirector', null, null, null, this.getTagsForStencil(gn, '', dt + 'traffic director').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTQgMGg2djZoLTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDBoM3Y2aC0zeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCAxNGg2djZoLTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3IDE0aDN2NmgtM3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCAwaDZ2NkgweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zIDBoM3Y2SDN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMTRoNnY2SDB6Ii8+JiN4YTsJPGcgY2xhc3M9InN0MSI+JiN4YTsJCTxwYXRoIGQ9Ik0zIDE0aDN2Nkgzek02IDJoOHYySDZ6Ii8+JiN4YTsJCTxwYXRoIGQ9Ik02IDE2aDh2Mkg2ek0xNiA2aDJ2OGgtMnpNMiA2aDJ2OEgyeiIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMiA2aDJ2Mkgyem0xNCAwaDJ2MmgtMnpNNiAyaDJ2Mkg2em0wIDE0aDJ2Mkg2eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Virtual\nPrivate Cloud', null, null, null, this.getTagsForStencil(gn, '', dt + 'virtual private cloud').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Networking', 'GCP Icons / Networking', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsDeveloperToolsPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon developer tools ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3LjMyOTk5OTkyMzcwNjA1NSIgaGVpZ2h0PSIxOS42MTAwMDA2MTAzNTE1NjIiIHZpZXdCb3g9IjAgMCAxNy4zMjk5OTk5MjM3MDYwNTUgMTkuNjEwMDAwNjEwMzUxNTYyIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyLjE4IDcuOThMMTEgNy4yOWwtMy41MiA2LjEgMS4xOC42OCAzLjUyLTIuMDN6IiBmaWxsPSIjNDI4NWY0Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuMzIgMTIuNzJsMy41My02LjA5LTEuMTktLjY5LTMuNTIgMi4wNHY0LjA2eiIgZmlsbD0iIzY2OWRmNiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zLjc1IDcuOThMMCA1LjgxdjkuMmw3Ljk3IDQuNnYtNC4zM2wtNC4yMi0yLjQ0em05LjEzLTEuMmwzLjc2LTIuMTdMOC42NiAwIC42OCA0LjYxbDMuNzYgMi4xNyA0LjIyLTIuNDR6TTkuMzUgMTkuNjFsNy45OC00LjZ2LTkuMmwtMy43NiAyLjE3djQuODZsLTQuMjIgMi40NHoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 36, s * 42, 'Cloud\nBuild', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud build').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM4My41NTc5Nzc2MjM2MzQ3IiBoZWlnaHQ9IjI1Mi40NzIyMzIwMDk5MzQwNiIgdmlld0JveD0iMCAwIDEwMS40ODI5OTQwNzk1ODk4NCA2Ni44MDAwMDMwNTE3NTc4MSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjguMTQgMzUuMTUzbDE1LjgyNCAxNS44MjRMNjguMTQgNjYuOCA1Mi4zMTYgNTAuOTc3em0tMzUuMDk0IDBMNDguODcgNTAuOTc3IDMzLjA0NiA2Ni44IDE3LjIyMiA1MC45Nzd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTg1LjY1OSAxNy42MzNsMTUuODI0IDE1LjgyNC0xNS44MjQgMTUuODI0LTE1LjgyNC0xNS44MjR6bS02OS44MzUgMGwxNS44MjQgMTUuODI0LTE1LjgyNCAxNS44MjRMMCAzMy40NTd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTY4LjE0IDBsMTUuODI0IDE1LjgyNEw2OC4xNCAzMS42NDcgNTIuMzE2IDE1LjgyM3pNMzMuMDQ2IDBMNDguODcgMTUuODIzIDMzLjA0NiAzMS42NDcgMTcuMjIyIDE1LjgyM3oiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 27, 'Cloud\nCode', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud code').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud Code\nfor IntelliJ', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud code for intellij').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM2MC4zMDM3NjY4NjA4MzYzIiBoZWlnaHQ9IjM3OC4wNTExNTgwNzc0MDg4IiB2aWV3Qm94PSItMC4wMDAxNjI0MjExNDM2MTM3NTU3IC0wLjAwMDEwMDAwNTk0OTIwNzExNTkyIDk1LjMzMDI2MTIzMDQ2ODc1IDEwMC4wMjYxMDAxNTg2OTE0Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qye2ZpbGw6IzY2OWRmNjt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03OS45NzEgNzcuNzE1bC03LjM1OSA3LjQ4OCA4LjYzOSA4LjQ5IDcuMzU5LTcuNDg4em0tNjUuMDk2LjA2MWwtOC42NDEgOC40OTIgNy4zNjEgNy40ODggOC42MzktOC40OXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNzkuNTUzLjIyMWE1LjI1IDUuMjUgMCAwIDAtMy42NiA4Ljk4NEw4Ni4zODkgMTkuNThhNS4yNSA1LjI1IDAgMCAwIDguOTQxLTMuNzY1IDUuMjUgNS4yNSAwIDAgMC0xLjU2LTMuNzA0TDgzLjI3NSAxLjczOEE1LjI1IDUuMjUgMCAwIDAgNzkuNTUzLjIyMXpNMTUuOTE2IDBhNS4yNSA1LjI1IDAgMCAwLTMuNzIzIDEuNTE2TDEuNjk5IDExLjg5MWE1LjI1IDUuMjUgMCAwIDAtLjA0MyA3LjQyNCA1LjI1IDUuMjUgMCAwIDAgNy40MjQuMDQzTDE5LjU3NiA4Ljk4MkE1LjI1IDUuMjUgMCAwIDAgMTUuOTE2IDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ4LjEzOCAyNi4yNGMxMy4zNDcgMCAyNS40MzIgMTEuMTM2IDI1LjMxIDI2LjQ4MSAwIDE1LjExLTEyLjI2NyAyNS42NzMtMjUuMTg5IDI1LjY3My0xMS4xNDkgMC0xOC4zMTctNS4xNzEtMjEuOTYtMTAuNzM4bDIxLjgzOS0xNS4wOTd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTgxLjI1IDkzLjY5M2w0LjY2NCA0LjU4NmE1LjI1IDUuMjUgMCAxIDAgNy4zNjEtNy40OWwtNC42NjYtNC41ODR6TTYuMjM0IDg2LjI2OEwxLjU3IDkwLjg1MWE1LjI1IDUuMjUgMCAwIDAtLjA2NSA3LjQyNCA1LjI1IDUuMjUgMCAwIDAgNy40MjQuMDY0bDQuNjY2LTQuNTg0ek00Ny4zNzEgNS41NzhDMjEuMzQ5IDUuNTc4LjE0NiAyNi43NzkuMTQ2IDUyLjgwMXMyMS4yMDMgNDcuMjI1IDQ3LjIyNSA0Ny4yMjUgNDcuMjI1LTIxLjIwMyA0Ny4yMjUtNDcuMjI1UzczLjM5MyA1LjU3OCA0Ny4zNzEgNS41Nzh6bTAgMTBhMzcuMTUgMzcuMTUgMCAwIDEgMzcuMjI1IDM3LjIyM2MwIDIwLjYxNy0xNi42MDcgMzcuMjI1LTM3LjIyNSAzNy4yMjVTMTAuMTQ2IDczLjQxOCAxMC4xNDYgNTIuODAxYTM3LjE1IDM3LjE1IDAgMCAxIDM3LjIyNS0zNy4yMjN6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 40, s * 42, 'Cloud\nScheduler', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud scheduler').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud\nSDK', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud sdk software development kit').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud Source\nRepositories', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud source repositories').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ni4zNDk5ODYzODk2NDkzNiIgaGVpZ2h0PSIzMDcuNjg0MDE3OTkzMzY5MjUiIHZpZXdCb3g9IjAgMCA5OS41NzU5OTYzOTg5MjU3OCA4MS40MDgwMDQ3NjA3NDIxOSI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qxe2ZpbGw6IzQyODVmNDt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDB2NDAuODc1aDEwVjB6bTIyLjM5NCAwdjQwLjg3NWgxMFYwem0yMi4zOTQgMHY0MC44NzVoMTBWMHptMjIuMzk0IDB2NDAuODc1aDEwVjB6bTIyLjM5NCAwdjQwLjg3NWgxMFYweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04OS41NzYgNDAuODc1djQwLjUzM2gxMFY0MC44NzV6bS0yMi4zOTQgMHY0MC41MzNoMTBWNDAuODc1em0tMjIuMzk0IDB2NDAuNTMzaDEwVjQwLjg3NXptLTIyLjM5NCAwdjQwLjUzM2gxMFY0MC44NzV6TTAgNDAuODc1djQwLjUzM2gxMFY0MC44NzV6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 34, 'Cloud\nTasks', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud tasks').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAuMTE2NjExNjcwNjgwMSIgaGVpZ2h0PSIxMDAuMDMyNDk0OTc4MDAwMzciIHZpZXdCb3g9Ii0wLjA2OTI3NDkwMjM0Mzc1IC0wLjA4MDczNDI1MjkyOTY4NzUgMTAwLjExNjYwNzY2NjAxNTYyIDEwMC4wMzI0ODU5NjE5MTQwNiIgdmVyc2lvbj0iMS4xIiBpZD0ic3ZnNSIgaW5rc2NhcGU6dmVyc2lvbj0iMS4xIChjNjhlMjJjMzg3LCAyMDIxLTA1LTIzKSIgc29kaXBvZGk6ZG9jbmFtZT0iY2xvdWRfdGVzdF9sYWIuc3ZnIj4mI3hhOyAgPHNvZGlwb2RpOm5hbWVkdmlldyBpZD0ibmFtZWR2aWV3NyIgcGFnZWNvbG9yPSIjZmZmZmZmIiBib3JkZXJjb2xvcj0iIzY2NjY2NiIgYm9yZGVyb3BhY2l0eT0iMS4wIiBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIiBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIiBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIiBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iIHNob3dncmlkPSJmYWxzZSIgaW5rc2NhcGU6em9vbT0iMS4xNTg2NzQ5IiBpbmtzY2FwZTpjeD0iMzczLjI3MTIyIiBpbmtzY2FwZTpjeT0iMjI0LjgyNTc4IiBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMTciIGlua3NjYXBlOndpbmRvdy14PSItOCIgaW5rc2NhcGU6d2luZG93LXk9Ii04IiBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiIGZpdC1tYXJnaW4tdG9wPSIwIiBmaXQtbWFyZ2luLWxlZnQ9IjAiIGZpdC1tYXJnaW4tcmlnaHQ9IjAiIGZpdC1tYXJnaW4tYm90dG9tPSIwIi8+JiN4YTsgIDxkZWZzIGlkPSJkZWZzMiIvPiYjeGE7ICA8ZyBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIgaWQ9ImxheWVyMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAzLjQ2MjEzLDMwLjIyODM5NykiPiYjeGE7ICAgIDxwYXRoIGlkPSJwYXRoMTc3OTYtMTciIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDojNDI4NWY0O3N0cm9rZS13aWR0aDoxMDtzdHJva2UtbGluZWpvaW46cm91bmQ7ZmlsbC1vcGFjaXR5OjEiIGQ9Im0gLTI0MC44OTA4OCw1Ny4zMjMyMDggYSAxMi40MDAxNTQsMTIuNDAwMTU0IDAgMCAxIC0xMi40MDAxNSwxMi40MDAxNTQgMTIuNDAwMTU0LDEyLjQwMDE1NCAwIDAgMSAtMTIuNDAwMTUsLTEyLjQwMDE1NCAxMi40MDAxNTQsMTIuNDAwMTU0IDAgMCAxIDEyLjQwMDE1LC0xMi40MDAxNTQgMTIuNDAwMTU0LDEyLjQwMDE1NCAwIDAgMSAxMi40MDAxNSwxMi40MDAxNTQgeiBNIC0yNzguNzMxMSwxOS42NjYwNjEgYSAxMi40MDAxNTQsMTIuNDAwMTU0IDAgMCAxIC0xMi40MDAxNiwxMi40MDAxNTUgMTIuNDAwMTU0LDEyLjQwMDE1NCAwIDAgMSAtMTIuNDAwMTUsLTEyLjQwMDE1NSAxMi40MDAxNTQsMTIuNDAwMTU0IDAgMCAxIDEyLjQwMDE1LC0xMi40MDAxNTM3IDEyLjQwMDE1NCwxMi40MDAxNTQgMCAwIDEgMTIuNDAwMTYsMTIuNDAwMTUzNyB6IG0gMzcuODQwMjIsMCBhIDEyLjQwMDE1NCwxMi40MDAxNTQgMCAwIDEgLTEyLjQwMDE1LDEyLjQwMDE1NSAxMi40MDAxNTQsMTIuNDAwMTU0IDAgMCAxIC0xMi40MDAxNSwtMTIuNDAwMTU1IDEyLjQwMDE1NCwxMi40MDAxNTQgMCAwIDEgMTIuNDAwMTUsLTEyLjQwMDE1MzcgMTIuNDAwMTU0LDEyLjQwMDE1NCAwIDAgMSAxMi40MDAxNSwxMi40MDAxNTM3IHogbSAzNy40NzYwOSwtMzcuNTc1MDM5IGEgMTIuNDAwMTU0LDEyLjQwMDE1NCAwIDAgMSAtMTIuNDAwMTUsMTIuNDAwMTU0NiAxMi40MDAxNTQsMTIuNDAwMTU0IDAgMCAxIC0xMi40MDAxNiwtMTIuNDAwMTU0NiAxMi40MDAxNTQsMTIuNDAwMTU0IDAgMCAxIDEyLjQwMDE2LC0xMi40MDAxNTQgMTIuNDAwMTU0LDEyLjQwMDE1NCAwIDAgMSAxMi40MDAxNSwxMi40MDAxNTQgeiBtIC0xMi4zOTk2NiwyNS4zNjIxMDMgYyAtNi43MTU0MywwIC0xMi4yMTI4OSw1LjQ5NzQ2NCAtMTIuMjEyODksMTIuMjEyODkxIDAsNi43MTU0MjYgNS40OTc0NiwxMi4yMTI4OSAxMi4yMTI4OSwxMi4yMTI4OSA2LjcxNTQyLDAgMTIuMjEyODksLTUuNDk3NDY0IDEyLjIxMjg5LC0xMi4yMTI4OSAwLC02LjcxNTQyNyAtNS40OTc0NywtMTIuMjEyODkxIC0xMi4yMTI4OSwtMTIuMjEyODkxIHogbSAwLDUgYyA0LjAxMzIzLDAgNy4yMTI4OSwzLjE5OTY2MiA3LjIxMjg5LDcuMjEyODkxIDAsNC4wMTMyMjggLTMuMTk5NjYsNy4yMTI4OSAtNy4yMTI4OSw3LjIxMjg5IC00LjAxMzIzLDAgLTcuMjEyODksLTMuMTk5NjYyIC03LjIxMjg5LC03LjIxMjg5IDAsLTQuMDEzMjI5IDMuMTk5NjYsLTcuMjEyODkxIDcuMjEyODksLTcuMjEyODkxIHogbSAwLDMyLjY1NjI1IGMgLTYuNzE1NDMsMCAtMTIuMjEyODksNS40OTc0NjQgLTEyLjIxMjg5LDEyLjIxMjg5MSAwLDYuNzE1NDI2IDUuNDk3NDYsMTIuMjE0ODQzIDEyLjIxMjg5LDEyLjIxNDg0MyA2LjcxNTQyLDAgMTIuMjEyODksLTUuNDk5NDE3IDEyLjIxMjg5LC0xMi4yMTQ4NDMgMCwtNi43MTU0MjcgLTUuNDk3NDcsLTEyLjIxMjg5MSAtMTIuMjEyODksLTEyLjIxMjg5MSB6IG0gMCw1IGMgNC4wMTMyMywwIDcuMjEyODksMy4xOTk2NjIgNy4yMTI4OSw3LjIxMjg5MSAwLDQuMDEzMjI4IC0zLjE5OTY2LDcuMjE0ODQzIC03LjIxMjg5LDcuMjE0ODQzIC00LjAxMzIzLDAgLTcuMjEyODksLTMuMjAxNjE1IC03LjIxMjg5LC03LjIxNDg0MyAwLC00LjAxMzIyOSAzLjE5OTY2LC03LjIxMjg5MSA3LjIxMjg5LC03LjIxMjg5MSB6IG0gLTc1LjMxNjQxLC01IGMgLTYuNzE1NDMsMCAtMTIuMjEyODksNS40OTc0NjQgLTEyLjIxMjg5LDEyLjIxMjg5MSAwLDYuNzE1NDI2IDUuNDk3NDYsMTIuMjE0ODQzIDEyLjIxMjg5LDEyLjIxNDg0MyA2LjcxNTQzLDAgMTIuMjEyODksLTUuNDk5NDE3IDEyLjIxMjg5LC0xMi4yMTQ4NDMgMCwtNi43MTU0MjcgLTUuNDk3NDYsLTEyLjIxMjg5MSAtMTIuMjEyODksLTEyLjIxMjg5MSB6IG0gMCw1IGMgNC4wMTMyMywwIDcuMjEyODksMy4xOTk2NjIgNy4yMTI4OSw3LjIxMjg5MSAwLDQuMDEzMjI4IC0zLjE5OTY2LDcuMjE0ODQzIC03LjIxMjg5LDcuMjE0ODQzIC00LjAxMzIzLDAgLTcuMjEyODksLTMuMjAxNjE1IC03LjIxMjg5LC03LjIxNDg0MyAwLC00LjAxMzIyOSAzLjE5OTY2LC03LjIxMjg5MSA3LjIxMjg5LC03LjIxMjg5MSB6IG0gMCwtODAuMjMwNDY5IGMgLTYuNzE1NDMsMCAtMTIuMjEyODksNS40OTc0NjQgLTEyLjIxMjg5LDEyLjIxMjg5MSAwLDYuNzE1NDI2IDUuNDk3NDYsMTIuMjEyODkwNSAxMi4yMTI4OSwxMi4yMTI4OTA1IDYuNzE1NDMsMCAxMi4yMTI4OSwtNS40OTc0NjQ1IDEyLjIxMjg5LC0xMi4yMTI4OTA1IDAsLTYuNzE1NDI3IC01LjQ5NzQ2LC0xMi4yMTI4OTEgLTEyLjIxMjg5LC0xMi4yMTI4OTEgeiBtIDAsNSBjIDQuMDEzMjMsMCA3LjIxMjg5LDMuMTk5NjYyIDcuMjEyODksNy4yMTI4OTEgMCw0LjAxMzIyOSAtMy4xOTk2Niw3LjIxMjg5IC03LjIxMjg5LDcuMjEyODkgLTQuMDEzMjMsMCAtNy4yMTI4OSwtMy4xOTk2NjEgLTcuMjEyODksLTcuMjEyODkgMCwtNC4wMTMyMjkgMy4xOTk2NiwtNy4yMTI4OTEgNy4yMTI4OSwtNy4yMTI4OTEgeiBtIDM3LjgzOTg0LC01IGMgLTYuNzE1NDIsMCAtMTIuMjEyODksNS40OTc0NjQgLTEyLjIxMjg5LDEyLjIxMjg5MSAwLDYuNzE1NDI2IDUuNDk3NDcsMTIuMjEyODkwNSAxMi4yMTI4OSwxMi4yMTI4OTA1IDYuNzE1NDMsMCAxMi4yMTI5LC01LjQ5NzQ2NDUgMTIuMjEyOSwtMTIuMjEyODkwNSAwLC02LjcxNTQyNyAtNS40OTc0NywtMTIuMjEyODkxIC0xMi4yMTI5LC0xMi4yMTI4OTEgeiBtIDAsNSBjIDQuMDEzMjMsMCA3LjIxMjksMy4xOTk2NjIgNy4yMTI5LDcuMjEyODkxIDAsNC4wMTMyMjkgLTMuMTk5NjcsNy4yMTI4OSAtNy4yMTI5LDcuMjEyODkgLTQuMDEzMjIsMCAtNy4yMTI4OSwtMy4xOeditableCssRules=.*;shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;aspect=fixed;imageAspect=0;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3OC4zOTE0MTUzMjk4OTUiIGhlaWdodD0iMzc4LjA3Mzc3NjA3MzI4MTMiIHZpZXdCb3g9Ii0wLjA2OTAwMDI0NDE0MDYyNSAtMC4wODA5OTkzNzQzODk2NDg0NCAxMDAuMTE1OTk3MzE0NDUzMTIgMTAwLjAzMjAwNTMxMDA1ODYiPiYjeGE7PHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02Mi41NzEgODcuNTUxYzAgNi44NDgtNS41NTIgMTIuNC0xMi40IDEyLjRzLTEyLjQtNS41NTItMTIuNC0xMi40IDUuNTUyLTEyLjQgMTIuNC0xMi40IDEyLjQgNS41NTIgMTIuNCAxMi40em0tMzcuODQtMzcuNjU3YTEyLjQgMTIuNCAwIDAgMS0xMi40IDEyLjRjLTYuODQ4IDAtMTIuNC01LjU1Mi0xMi40LTEyLjRzNS41NTItMTIuNCAxMi40LTEyLjRhMTIuNCAxMi40IDAgMCAxIDEyLjQgMTIuNHptMzcuODQgMGMwIDYuODQ4LTUuNTUyIDEyLjQtMTIuNCAxMi40cy0xMi40LTUuNTUyLTEyLjQtMTIuNCA1LjU1Mi0xMi40IDEyLjQtMTIuNCAxMi40IDUuNTUyIDEyLjQgMTIuNHptMzcuNDc2LTM3LjU3NWMwIDYuODQ4LTUuNTUyIDEyLjQtMTIuNCAxMi40YTEyLjQgMTIuNCAwIDAgMS0xMi40LTEyLjQgMTIuNCAxMi40IDAgMCAxIDEyLjQtMTIuNGM2Ljg0OCAwIDEyLjQgNS41NTIgMTIuNCAxMi40em0tMTIuNCAyNS4zNjJjLTYuNzE1IDAtMTIuMjEzIDUuNDk3LTEyLjIxMyAxMi4yMTNzNS40OTcgMTIuMjEzIDEyLjIxMyAxMi4yMTNTOTkuODYgNTYuNjA5IDk5Ljg2IDQ5Ljg5NHMtNS40OTctMTIuMjEzLTEyLjIxMy0xMi4yMTN6bTAgNWM0LjAxMyAwIDcuMjEzIDMuMiA3LjIxMyA3LjIxM3MtMy4yIDcuMjEzLTcuMjEzIDcuMjEzLTcuMjEzLTMuMi03LjIxMy03LjIxMyAzLjItNy4yMTMgNy4yMTMtNy4yMTN6bTAgMzIuNjU2Yy02LjcxNSAwLTEyLjIxMyA1LjQ5Ny0xMi4yMTMgMTIuMjEzczUuNDk3IDEyLjIxNSAxMi4yMTMgMTIuMjE1Uzk5Ljg2IDk0LjI2NiA5OS44NiA4Ny41NXMtNS40OTctMTIuMjEzLTEyLjIxMy0xMi4yMTN6bTAgNWM0LjAxMyAwIDcuMjEzIDMuMiA3LjIxMyA3LjIxM3MtMy4yIDcuMjE1LTcuMjEzIDcuMjE1LTcuMjEzLTMuMjAyLTcuMjEzLTcuMjE1IDMuMi03LjIxMyA3LjIxMy03LjIxM3ptLTc1LjMxNi01QzUuNjE2IDc1LjMzNy4xMTggODAuODM1LjExOCA4Ny41NXM1LjQ5NyAxMi4yMTUgMTIuMjEzIDEyLjIxNSAxMi4yMTMtNS40OTkgMTIuMjEzLTEyLjIxNS01LjQ5Ny0xMi4yMTMtMTIuMjEzLTEyLjIxM3ptMCA1YzQuMDEzIDAgNy4yMTMgMy4yIDcuMjEzIDcuMjEzcy0zLjIgNy4yMTUtNy4yMTMgNy4yMTUtNy4yMTMtMy4yMDItNy4yMTMtNy4yMTUgMy4yLTcuMjEzIDcuMjEzLTcuMjEzem0wLTgwLjIzQzUuNjE2LjEwNy4xMTggNS42MDQuMTE4IDEyLjMyczUuNDk3IDEyLjIxMyAxMi4yMTMgMTIuMjEzIDEyLjIxMy01LjQ5NyAxMi4yMTMtMTIuMjEzUzE5LjA0Ny4xMDcgMTIuMzMxLjEwN3ptMCA1YzQuMDEzIDAgNy4yMTMgMy4yIDcuMjEzIDcuMjEzcy0zLjIgNy4yMTMtNy4yMTMgNy4yMTMtNy4yMTMtMy4yLTcuMjEzLTcuMjEzIDMuMi03LjIxMyA3LjIxMy03LjIxM3ptMzcuODQtNWMtNi43MTUgMC0xMi4yMTMgNS40OTctMTIuMjEzIDEyLjIxM3M1LjQ5NyAxMi4yMTMgMTIuMjEzIDEyLjIxMyAxMi4yMTMtNS40OTcgMTIuMjEzLTEyLjIxM1M1Ni44ODYuMTA3IDUwLjE3MS4xMDd6bTAgNWM0LjAxMyAwIDcuMjEzIDMuMiA3LjIxMyA3LjIxM3MtMy4yIDcuMjEzLTcuMjEzIDcuMjEzLTcuMjEzLTMuMi03LjIxMy03LjIxMyAzLjItNy4yMTMgNy4yMTMtNy4yMTN6Ii8+JiN4YTs8L3N2Zz4=;Tk2NjEgLTcuMjEyODksLTcuMjEyODkgMCwtNC4wMTMyMjkgMy4xOTk2NywtNy4yMTI4OTEgNy4yMTI4OSwtNy4yMTI4OTEgeiIvPiYjeGE7ICA8L2c+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 42, 'Cloud\nTest Lab', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud test lab').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Cloud Tools\nfor Eclipse', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud tools for eclipse').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3Ny4xNTkzMDIxNjAyNjMwNSIgaGVpZ2h0PSIzMzYuMTYyNDk5MDAzMzEwOCIgdmlld0JveD0iLTAuMDU4MDAwMDA1NzgxNjUwNTQgMC4xMTI5OTk5OTgwMzMwNDY3MiA5OS43OTAwMDA5MTU1MjczNCA4OC45NDMwMDA3OTM0NTcwMyI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTMuMjQzIDYyLjA5VjQ3LjA5NGwxMy4yMDEgOC40MTZ2MTUuMDM4em0tMzMuMDIxIDBWNDcuMDk0bDEzLjIwMSA4LjQxNnYxNS4wMzh6bTE2LjUxMS0zMi4yODVWMTQuODFsMTMuMjAxIDguNDE2djE1LjAzOHptNjIuOTk5IDMzLjk2VjI1LjQwM2wtOS41NjItMS44ODR2NDIuMTMxem0tOTkuNzg4IDBWMjUuNDAzbDkuNTYyLTEuODg0djQyLjEzMXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTMuMTg1IDQ3LjA5NGwxMy4yNTgtOC4yODcgMTMuMDE2IDguMjM0LTEzLjAxNiA4LjQ2OXptLTMzLjAyMSAwbDEzLjI1OC04LjI4NyAxMy4wMTYgOC4yMzQtMTMuMDE2IDguNDY5ek0zNi42NzUgMTQuODFsMTMuMjU4LTguMjg3IDEzLjAxNiA4LjIzNC0xMy4wMTYgOC40Njl6bTYzLjA1NiA0OC45NTZ2MTIuMjE3TDc3LjAxIDg5LjA1NVY3Ny43NTJ6bTAtMzguMzYzVjEzLjE4Nkw3Ny4wMS4xMTN2MTEuMzAzek0tLjA1OCA2My43NjZ2MTIuMjE3bDIyLjcyMSAxMy4wNzNWNzcuNzUyem0wLTM4LjM2M1YxMy4xODZMMjIuNjYzLjExM3YxMS4zMDN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTY2LjQ0NCA3MC41NDdWNTUuNTFsMTMuMDE2LTguNDY5djE1LjR6bS0zMy4wMjEgMFY1NS41MWwxMy4wMTYtOC40Njl2MTUuNHptMTYuNTExLTMyLjI4NVYyMy4yMjVsMTMuMDE2LTguNDY5djE1LjR6bTQ5Ljc5OCAyNS41MDNsLTkuNTYyIDUuODh2LTMuOTk2em0wLTM4LjM2M2wtOS41NjItNS44OHYzLjk5NnpNLS4wNTggNjMuNzY2bDkuNTYyIDUuODh2LTMuOTk2em0wLTM4LjM2M2w5LjU2Mi01Ljg4djMuOTk2eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Container\nRegistry', null, null, null, this.getTagsForStencil(gn, '', dt + 'container registry').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Gradle App\nEngine Plugin', null, null, null, this.getTagsForStencil(gn, '', dt + 'gradle app engine plugin').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;', 
		    		s * 42, s * 23, 'IDE Plugins', null, null, null, this.getTagsForStencil(gn, '', dt + 'ide plugins integrated development environment').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQyNCIgaGVpZ2h0PSI0MjQiIHZpZXdCb3g9IjAgMCA0MjQgNDI0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQgMHY0MjRIMFYwek0yMTIgOTcuODQ2Yy0zNy44ODQgMC03MC4xNjQgMjMuOTktODIuNDc4IDU3LjYwOGgwbC0zLjQwMy4wMDFjLTQyLjYzNCAwLTc3LjE5NiAzNC41NjItNzcuMTk2IDc3LjE5NnMzNC41NjIgNzcuMTk2IDc3LjE5NiA3Ny4xOTZoMCAxNzEuNzYzYzQyLjYzNCAwIDc3LjE5Ni0zNC41NjIgNzcuMTk2LTc3LjE5NnMtMzQuNTYyLTc3LjE5Ni03Ny4xOTYtNzcuMTk2aDBsLTMuNDAzLS4wMDFDMjgyLjE2NCAxMjEuODM3IDI0OS44ODQgOTcuODQ2IDIxMiA5Ny44NDZ6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Maven App\nEngine Plugin', null, null, null, this.getTagsForStencil(gn, '', dt + 'maven app engine plugin').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;', 
		    		s * 42, s * 23, 'Tools for\nPowerShell', null, null, null, this.getTagsForStencil(gn, '', dt + 'tools for powershell').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjExLjI1OTk5OTI3NTIwNzUyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCAyMCAxMS4yNTk5OTkyNzUyMDc1MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY4IDEuNDJIMi40MkwwIDUuNjdsMi40MiA0LjI2aDIuMjZMMi4yNyA1LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wIDUuNjdsMS4xMSAxLjk3IDEuNDYtMS40NS0uMy0uNTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEzIDBINy4xMkwzLjgxIDUuNjNsMy4zMSA1LjU5SDEzbDMuMjktNS41OXptLTIuOTMgOC4zNmEyLjY0IDIuNjQgMCAxIDEgMi42Ni0yLjY0IDIuNjUgMi42NSAwIDAgMS0yLjY2IDIuNjR6TTIuNDIgMS40MkwwIDUuNjlsMS4xMSAxLjk3IDEuMTYtMS45NyAyLjQxLTQuMjd6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEzIC4wOGgwbC0xLjcgMy4zM2EyLjY2IDIuNjYgMCAwIDEtMS4yNSA1IDIuNjIgMi42MiAwIDAgMS0xLjE4LS4yN2wtMS43NSAzLjEySDEzbDMuMjktNS42M3ptMi4zMiA5Ljg1aDIuMjdMMjAgNS42N2wtMi40MS00LjI1aC0yLjI3bDIuNDEgNC4yNXoiPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCA1LjY3TDE4Ljg5IDMuN2wtMS40NiAxLjQ2LjMuNTF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3LjU5IDkuOTNMMjAgNS42NWwtMS4xMS0xLjk3LTEuMTYgMS45Ny0yLjQxIDQuMjh6Ii8+JiN4YTs8L3BhdGg+PC9zdmc+;', 
		    		s * 42, s * 23, 'Tools for\nVisual Studio', null, null, null, this.getTagsForStencil(gn, '', dt + 'tools for visual studio').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Developer Tools', 'GCP Icons / Developer Tools', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsAPIManagementPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon api management application programming interface ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAxMDAwMDIyODg4MTgzNiIgaGVpZ2h0PSI5LjQ5NDcyOTA0MjA1MzIyMyIgdmlld0JveD0iMC4wMDAyMDYzODQ1NjA0NDI1Mjk2MiAwIDIwLjAxMDAwMDIyODg4MTgzNiA5LjQ5NDcyOTA0MjA1MzIyMyI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xLjQ3NiA4LjQzYTQuMzEgNC4zMSAwIDEgMSA2LjA3LS40IDMuNjggMy42OCAwIDAgMS0uMzkuNCA0LjMyIDQuMzIgMCAwIDEtNS42OCAwem01LjItNS4yYTMuMDcgMy4wNyAwIDEgMC0uNCA0LjMzIDMgMyAwIDAgMCAuNC0uNCAzLjA3IDMuMDcgMCAwIDAgMC0zLjkzem02LjE5IDUuMmE0LjMxIDQuMzEgMCAxIDEgNi4wNy0uNCAzLjc4IDMuNzggMCAwIDEtLjQuNCA0LjMxIDQuMzEgMCAwIDEtNS42NyAwem01LjItNS4yYTMuMDcgMy4wNyAwIDEgMC0uNCA0LjMzIDMgMyAwIDAgMCAuNC0uNCAzLjA4IDMuMDggMCAwIDAgMC0zLjkzeiIvPiYjeGE7CTxnIGNsYXNzPSJzdDEiPiYjeGE7CQk8Y2lyY2xlIGN4PSI0LjMxNiIgY3k9IjUuMTkiIHI9IjEuNjkiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTUuNjk2IiBjeT0iNS4xOSIgcj0iMS42OSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTIuMzk2LjU2YS4zMS4zMSAwIDAgMC0uMTgtLjU2aC00LjQyYS4zMS4zMSAwIDAgMC0uMTguNTYgNS43MyA1LjczIDAgMCAxIDIuMTMgMi45Mi4yOC4yOCAwIDAgMCAuMzYuMTYuMjkuMjkgMCAwIDAgLjE3LS4xNyA1LjY3IDUuNjcgMCAwIDEgMi4xMi0yLjkxeiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 19, 'API Analytics', null, null, null, this.getTagsForStencil(gn, '', dt + 'api analytics application programming interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE4LjMwMDAwMTE0NDQwOTE4IiBoZWlnaHQ9IjE5LjgyNjUwNTY2MTAxMDc0MiIgdmlld0JveD0iLTguNzkxNTE5NjkwMDIxMjMyZS04IDAgMTguMzAwMDAxMTQ0NDA5MTggMTkuODI2NTA1NjYxMDEwNzQyIj4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0fSYjeGE7CS5zdDF7ZmlsbDojYWVjYmZhfSYjeGE7CS5zdDJ7ZmlsbDojNjY5ZGY2fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMuMDEgMTguNDlhMS41MSAxLjUxIDAgMCAxLTMgMGgwdi00LjI4YTEuNTEgMS41MSAwIDEgMSAzIDB6bTUuMTMgMGExLjUxIDEuNTEgMCAwIDEtMyAwaDB2LTQuMjhhMS41MSAxLjUxIDAgMCAxIDMgMHptNS4wNiAwYTEuNTEgMS41MSAwIDAgMS0zIDB2LTQuMjhhMS41MSAxLjUxIDAgMCAxIDMgMHptNS4wOSAwYTEuNTEgMS41MSAwIDAgMS0zIDB2LTQuMjhhMS41MSAxLjUxIDAgMSAxIDMgMHoiLz4mI3hhOwk8Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSI2LjU5IiBjeT0iOS45NyIgcj0iMS41MSIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjExLjY5IiBjeT0iOS45NyIgcj0iMS41MSIvPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjExLjY5IiBjeT0iNS43NCIgcj0iMS41MSIvPiYjeGE7CTxnIGNsYXNzPSJzdDIiPiYjeGE7CQk8Y2lyY2xlIGN4PSIxNi43OCIgY3k9IjkuOTciIHI9IjEuNTEiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTYuNzgiIGN5PSI1Ljc0IiByPSIxLjUxIi8+JiN4YTsJPC9nPiYjeGE7CTxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE2Ljc4IiBjeT0iMS41MSIgcj0iMS41MSIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'API\nMonetization', null, null, null, this.getTagsForStencil(gn, '', dt + 'api monetization application programming interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjE4MDIzMTA5NDM2MDM1IiBoZWlnaHQ9IjIwLjE4MDIwODIwNjE3Njc1OCIgdmlld0JveD0iLTAuMDAwMTE1MTY1MTIzMTMzOTIwMTMgLTAuMDAwMTAzMzQ0NDkzMjU0NTUzNTMgMjAuMTgwMjMxMDk0MzYwMzUgMjAuMTgwMjA4MjA2MTc2NzU4Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNjY5ZGY2O2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CS5zdDF7ZmlsbC1ydWxlOmV2ZW5vZGQ7ZmlsbDojNDI4NWY0fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMuMjkgMTAuMDlsMS4zMi0xLjMyLTEuNzktMS43OWEyLjk0IDIuOTQgMCAwIDEgMi4wOC01IDIuOTIgMi45MiAwIDAgMSAyLjA3Ljg2bDEuOCAxLjc5IDEuMzItMS4zNEw4LjMgMS41YTQuODEgNC44MSAwIDEgMC02LjggNi44em0xMy42IDBsLTEuMzIgMS4zMiAxLjc5IDEuOGEyLjk0IDIuOTQgMCAwIDEtNC4xNiA0LjE1bC0xLjc5LTEuNzktMS4zMiAxLjMyIDEuNzkgMS43OWE0LjgxIDQuODEgMCAxIDAgNi44LTYuOHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNi45OCAxNy4zNmEyLjk0IDIuOTQgMCAxIDEtNC4xNi00LjE2bDEuNzktMS43OSA0LjE2IDQuMTZ6bTYuMjMtMTQuNTRhMi45MyAyLjkzIDAgMCAxIDUgMi4wOCAzIDMgMCAwIDEtLjg2IDIuMDhsLTEuNzkgMS43OS00LjE1LTQuMTZ6bS0zLjEyIDEwLjQ2YTMuMiAzLjIgMCAwIDEtMy4xOS0zLjE5aDBhMy4yMSAzLjIxIDAgMCAxIDMuMTktMy4xOWgwYTMuMjEgMy4yMSAwIDAgMSAzLjE5IDMuMTloMGEzLjIgMy4yIDAgMCAxLTMuMTkgMy4xOXptNi44LTMuMTlsMS43OS0xLjc5QTQuODEgNC44MSAwIDAgMCAxNi41NzQuMTUzIDQuODEgNC44MSAwIDAgMCAxMS44OCAxLjVsLTEuNzkgMS43OS02LjggNi44LTEuNzkgMS43OWE0LjgxIDQuODEgMCAwIDAgMi4xMDYgOC4xNDdBNC44MSA0LjgxIDAgMCAwIDguMyAxOC42OGwxLjc5LTEuNzl6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 42, 'Apigee API\nPlatform', null, null, null, this.getTagsForStencil(gn, '', dt + 'apigee api platform application programming interface').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwLjAwMDMyOTk3MTMxMzQ3NyIgaGVpZ2h0PSIyMC4wMDAxNjQwMzE5ODI0MjIiIHZpZXdCb3g9Ii0wLjAwMDE2NDgyMzAwOTk4MTc3MzggLTAuMDAwMTY0ODgzMTA5MzkxNjY2OTUgMjAuMDAwMzI5OTcxMzEzNDc3IDIwLjAwMDE2NDAzMTk4MjQyMiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNH0mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNn0mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYX0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOS40MiA3bC0uMzUtLjA5TDE4IDYuNjRsLS4wOS0uMTljLS4wNS0uMDktLjA5LS4xOS0uMTQtLjI5bC0uMTQtLjI3LS4xNi0uMjgtLjE2LS4yNi0uMTctLjI2YTIuMzUgMi4zNSAwIDAgMC0uMTktLjI1bC0uMTktLjI1LS4yLS4yNC0uMi0uMjMtLjI2LS4yMi0uMjItLjIyLS4yNC0uMi0uMjMtLjItLjI1LS4xOS0uMjUtLjE5LS4yNi0uMTctLjI2LS4xNi0uMjgtLjE2LS4yNy0uMTQtLjI5LS4xNC0uMTktLjA4LS4yOS0xLjEyTDEzIC41OGEuNzguNzggMCAwIDAtLjc3LS41OEg3Ljc3QS43OC43OCAwIDAgMCA3IC41OGwtLjA5LjM1LS4yNyAxLjEyLS4xOS4wOC0uMjkuMTQtLjI3LjE0LS4yOC4xNi0uMjYuMTYtLjI2LjE3LS4yNS4xOS0uMjUuMTktLjI0LjItLjIzLjItLjIyLjIyLS4yMi4yMi0uMi4yNGEyLjIgMi4yIDAgMCAwLS4yLjIzYy0uMDcuMDgtLjEzLjE3LS4xOS4yNWEyLjM1IDIuMzUgMCAwIDAtLjE5LjI1bC0uMTcuMjYtLjE2LjI2LS4xNi4yOGMwIC4wOS0uMS4xOC0uMTQuMjdsLS4xNC4yOWMtLjA1LjA5LS4wNi4xMy0uMDguMTlsLTEuMTIuMjlMLjU4IDdhLjc4Ljc4IDAgMCAwLS41OC43N3Y0LjQ2YS43OC43OCAwIDAgMCAuNTguNzVsLjM1LjA5IDEuMTIuMjljMCAuMDYuMDYuMTIuMDguMTlzLjA5LjE5LjE0LjI5bC4xNC4yNy4xNi4yOC4xNi4yNi4xNy4yNmEyLjM1IDIuMzUgMCAwIDAgLjE5LjI1bC4xOS4yNWEyLjIgMi4yIDAgMCAwIC4yLjIzbC4yLjI0LjIyLjIyLjIyLjIyLjI0LjIuMjMuMi4yNS4xOS4yNS4xOS4yNi4xNy4yNi4xNi4yOC4xNi4yNy4xNC4yOS4xNC4xOS4wOC4yOSAxLjEyLjA5LjM1YS43OC43OCAwIDAgMCAuNzUuNThoNC40NmEuNzguNzggMCAwIDAgLjc1LS41OGwuMDktLjM1LjI5LTEuMDcuMTktLjA4LjI5LS4xNC4yNy0uMTQuMjgtLjE2LjI2LS4xNi4yNi0uMTcuMjUtLjE5LjI1LS4xOS4yNC0uMi4yMy0uMi4yMi0uMjIuMjItLjIyLjItLjI0YTIuMiAyLjIgMCAwIDAgLjItLjIzYy4wNy0uMDguMTMtLjE3LjE5LS4yNWEyLjM1IDIuMzUgMCAwIDAgLjE5LS4yNWwuMTctLjI2LjE2LS4yNi4xNi0uMjguMTQtLjI3LjE0LS4yOWMuMDUtLjA5LjA2LS4xMy4wOC0uMTlsMS4xMi0uMjkuMzUtLjA5YS43OC43OCAwIDAgMCAuNTgtLjc1VjcuNzdhLjc4Ljc4IDAgMCAwLS41OC0uNzd6TTEwIDE2LjY3QTYuNjYgNi42NiAwIDEgMSAxNi42NyAxMGE2LjUzIDYuNTMgMCAwIDEtLjE0IDEuMzNBNi42NCA2LjY0IDAgMCAxIDEwIDE2LjY3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCA0Ljg4QTUuMTcgNS4xNyAwIDAgMCA4Ljg5IDVsLjI3IDEuMjNhMy44NiAzLjg2IDAgMSAxLTIuOTMgNC42MSA0IDQgMCAwIDEtLjA5LS44NEg0Ljg4QTUuMTIgNS4xMiAwIDEgMCAxMCA0Ljg4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMCA3LjQyYTIuNiAyLjYgMCAwIDAtLjU2LjA2bC4yNyAxLjI0YTEuMzIgMS4zMiAwIDEgMS0xIDEuNTcgMS40MyAxLjQzIDAgMCAxIDAtLjI5SDcuNDJBMi41OCAyLjU4IDAgMSAwIDEwIDcuNDJ6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 42, 'Apigee\nSense', null, null, null, this.getTagsForStencil(gn, '', dt + 'apigee sense').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5Ljk1MDAwMDc2MjkzOTQ1MyIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDE5Ljk1MDAwMDc2MjkzOTQ1MyAxMiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNH0mI3hhOwkuc3Qxe2ZpbGw6I2FlY2JmYX0mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02IDZsMSAyaDZsMS0yLTEtMkg3eiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03LjUxIDRIN0w2IDZoOGwtMS0yeiIgZmlsbD0iI2FlY2JmYSIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNi45NyA2bDEuNS0yLjI1TDE2IDBoLTN6IiBmaWxsPSIjNDI4NWY0Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2Ljk3IDZoMEwxMyAxMmgzbDMuOTUtNi0xLjQ4LTIuMjV6IiBmaWxsPSIjYWVjYmZhIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTIuOTggNmwtMS41IDIuMjVMMy45NSAxMmgzeiIgZmlsbD0iIzQyODVmNCIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yLjk4IDZoMGwzLjk3LTZoLTNMMCA2bDEuNDggMi4yNXoiIGZpbGw9IiNhZWNiZmEiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 25, 'Cloud\nEndpoints', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud endpoints').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0LjE0MzAxOTY3NjIwODQ5NiIgdmlld0JveD0iMCAwLjAwMDQ4OTk2NjI0NTM2ODEyMzEgMjAgMTQuMTQzMDE5Njc2MjA4NDk2Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAgMS40NzJhNS41OSA1LjU5IDAgMCAxIDQgMS42bDEtMWE3LjA3IDcuMDcgMCAwIDAtMTAgMGgwbDEgMWE1LjU5IDUuNTkgMCAwIDEgNC0xLjZ6bTAgMTEuMmE1LjU5IDUuNTkgMCAwIDEtNC0xLjZsLTEgMWE3LjA3IDcuMDcgMCAwIDAgMTAgMGgwbC0xLTFhNS41OSA1LjU5IDAgMCAxLTQgMS42eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMCAxMC4xNDJhMy4wNiAzLjA2IDAgMCAxLTMtMi4zNEgzLjExdjIuMzhMMCA3LjA3MmwzLjExLTMuMXYyLjM4SDdhMy4wNiAzLjA2IDAgMCAxIDMtMi4zNGgwYTMuMDYgMy4wNiAwIDAgMSAzIDIuMzRoMy45MXYtMi4zOUwyMCA3LjA3MmwtMy4xMSAzLjEydi0yLjM5SDEzYTMuMDYgMy4wNiAwIDAgMS0zIDIuMzR6bTAtNC42OGExLjYxIDEuNjEgMCAxIDAgMS42MSAxLjYxaDBBMS42MSAxLjYxIDAgMCAwIDEwIDUuNDYyeiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 29, 'Developer\nPortal', null, null, null, this.getTagsForStencil(gn, '', dt + 'developer portal').join(' '))
	 	];
		
		this.addPalette('gcp2Icons API Management', 'GCP Icons / API Management', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsInternetOfThingsPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon iot internet of things ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjcwNjUzMTUyNDY1ODIwMyIgaGVpZ2h0PSIxOS45ODM4MjE4Njg4OTY0ODQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iLTAuMDAwMjA5NTQ2OTY4MTA4MDQzMDcgMC4wMDAxNzcyNDA4Mjg2MzQyMzk3MyAxOS43MDY1MzE1MjQ2NTgyMDMgMTkuOTgzODIxODY4ODk2NDg0Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAuMzQ1IDEwLjM5NnYtNC40M2gwYTEuMTQgMS4xNCAwIDAgMC0uNS0yLjE2NCAxLjE0IDEuMTQgMCAwIDAtLjUgMi4xNjR2NC40MmgtNC4yN3YtMi44MmExLjE0IDEuMTQgMCAwIDAtLjUzLTIuMTUgMS4xNCAxLjE0IDAgMCAwLS41MiAyLjE1djIuODNoLS4yMmEzLjgyIDMuODIgMCAwIDEtMi43MjItNi40ODUgMy44MiAzLjgyIDAgMCAxIDQuMTIyLS44OTUgNS4yMiA1LjIyIDAgMCAxIDkuNDQtLjA1IDQgNCAwIDAgMSAxLjIzLS4yaDBhMy44MyAzLjgzIDAgMSAxIDAgNy42NmgtLjI1di0yLjg2YTEuMTQgMS4xNCAwIDAgMC0uNTMtMi4xNDkgMS4xNCAxLjE0IDAgMCAwLS41MyAyLjE0OXYyLjgzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LjA3NSAxMy4zNTZhMiAyIDAgMCAxIDEuNTQgMiAyLjA3IDIuMDcgMCAwIDEtNC4xMS4zNTQgMi4wNyAyLjA3IDAgMCAxIDEuNTItMi4zNTR2LTIuOTZoMXptLS41MyAzYTEgMSAwIDEgMCAwLTIgMSAxIDAgMSAwIDAgMnptMTEuMDgtM2EyLjA3IDIuMDcgMCAwIDEtLjUzIDQuMDcxIDIuMDcgMi4wNyAwIDAgMS0uNTMtNC4wNzF2LTIuOTVoMS4wNnptLS41MyAzYTEgMSAwIDAgMCAuMzktMS45NCAxIDEgMCAwIDAtMS4yNjggMS4zMDcgMSAxIDAgMCAwIC44NzguNjMzem0tNC43NS0uNDNoMGEyLjA2IDIuMDYgMCAwIDEtLjUgNC4wNTggMi4wNiAyLjA2IDAgMCAxLS41LTQuMDU4di01LjVoMS4wNnptLS41NCAzYTEgMSAwIDAgMCAuNTUtMS44MzIgMSAxIDAgMCAwLTEuNDggMS4yMTIgMSAxIDAgMCAwIC45My42eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 42, 'Cloud\nIoT Core', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud iot core internet of things').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Internet of Things', 'GCP Icons / Internet of Things', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsDatabasesPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon databases ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1Njk3Nzg0NDIzODI4IiBoZWlnaHQ9IjIwLjAwOTI1NjM2MjkxNTA0IiB2aWV3Qm94PSItMC4wMDA0MjE5NjUxMTY0MDIxMzQzIDAuMDAwMDc0Njk5NTIxMDY0NzU4MyAxNy45NTY5Nzc4NDQyMzgyOCAyMC4wMDkyNTYzNjI5MTUwNCI+JiN4YTsJPHN0eWxlPiYjeGE7CQkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJCS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgZmlsbC1ydWxlPSJldmVub2RkIj4mI3hhOwkJPHBhdGggZD0iTTEzLjE5NiA0LjQ0N2wtNC4yMi0yLjUxYTIuODYgMi44NiAwIDAgMS0xLjI1LTEuNzFjMCAwIC4xNi0uMzIuMzgtLjJsNS4yNSAzLjFjLjYzLjM3LjI0IDIgLjI0IDJhLjc3Ljc3IDAgMCAwLS40LS42OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE0LjQ2NiAxMC42ODdhLjM1LjM1IDAgMCAxLS4xNi4zM2wtMSAuNjh2LTcuOTVjMC0uMjcuMTctLjU2LS4wNi0uN2wuOTIuNjhhLjczLjczIDAgMCAxIC4zNS42NXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDExLjU5N2EuMzYuMzYgMCAwIDEtLjItLjA2bC0zLjQ2LTIuMDZ2LjlsMy42NiAyLjE4LjI5LS41N3MtLjIyLS4zOS0uMjktLjM5em0uMiAxLjhhLjM2LjM2IDAgMCAxLS40IDBsLTMuNDYtMi4wNnYuNjZhLjQyLjQyIDAgMCAwIC4xOS4zNWwzLjI4IDJhLjM3LjM3IDAgMCAwIC4zOCAwIDIgMiAwIDAgMCAuMi0uNTJsLS4xOS0uMzl6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik04Ljk3NiAxMC43MjdsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzRsLTMuMjgtMmEuMzcuMzcgMCAwIDAtLjM4IDBsLTMuMjggMmEuNDEuNDEgMCAwIDAtLjE5LjM0di40M3oiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDkuODI3bC0zLjQ3LTIuMDVhLjQxLjQxIDAgMCAwLS4xOS4zNHYuNDNsMy42NiAyLjE4LjI4LS41NnoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPGcgY2xhc3M9InN0MiI+JiN4YTsJCQk8cGF0aCBkPSJNOC45NzYgMTEuNTk3djFsMy42Ni0yLjE4di0uOWwtMy40NiAyLjAyYS42NS42NSAwIDAgMS0uMi4wNnptLjIgMS44YS4zNi4zNiAwIDAgMS0uMi4wNnYuOWEuNS41IDAgMCAwIC4yMS0uMDVsMy4yOC0yYS4zOS4zOSAwIDAgMCAuMTktLjM1di0uNjZ6Ii8+JiN4YTsJCQk8cGF0aCBkPSJNMTIuNDQ2IDcuNzc3bC0zLjQ3IDIuMDV2LjlsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzR6Ii8+JiN4YTsJCTwvZz4mI3hhOwkJPHBhdGggZD0iTTQuNzU2IDE1LjUyN2w0LjE1IDIuNDdhMi43MiAyLjcyIDAgMCAxIDEuMjggMS44LjE4LjE4IDAgMCAxLS4yOC4xOGwtNS40NS0zLjIzYy0uNTMtLjMyLS4wNy0xLjg4LS4wNy0xLjg4YS43Ny43NyAwIDAgMCAuMzcuNjZ6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik0zLjQ4NiAxNS43Mjd2LTYuNTZhLjQxLjQxIDAgMCAxIC4xOS0uMzNsMS0uNTl2Ny45MWMwIC4yNyAwIC42OS4yMS44M2wtMS4wNi0uNjZhLjc1Ljc1IDAgMCAxLS4zNC0uNnoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTM2IDMuNDU3YS43NS43NSAwIDAgMC0uNzQgMGwtNC4yIDIuNTRhMi42MyAyLjYzIDAgMCAxLTIuMDguMjYuMjMuMjMgMCAwIDEgMC0uNGMuMTgtLjA5IDYuMzItMy43NCA2LjMyLTMuNzQuMjMtLjE0Ljc0IDEuMzkuNzQgMS4zOXoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTI2IDIuMDc3bDUuMzIgMy4xNWEuMzcuMzcgMCAwIDEgLjIuMzF2MS4xOGwtNi42Ny0zLjk2YS43NS43NSAwIDAgMC0uNzQgMGwxLjE4LS42OWEuNzEuNzEgMCAwIDEgLjczIDB6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xMC43OTYgMTYuNDg3YS43My43MyAwIDAgMCAuNzQgMGw0LjItMi40OWEyLjYzIDIuNjMgMCAwIDEgMi4xLS4yNS4yMS4yMSAwIDAgMSAwIC4zOGwtNi4zMyAzLjc1Yy0uMjIuMTQtLjc0LTEuNC0uNzQtMS40eiIgY2xhc3M9InN0MCIvPiYjeGE7CQk8cGF0aCBkPSJNNS40ODYgMTQuNzQ3YS41Ni41NiAwIDAgMS0uMTctLjMzdi0xLjE2bDYuNjYgMy45M2EuNjkuNjkgMCAwIDAgLjczIDBsLTEuMTguN2EuNy43IDAgMCAxLS43NCAweiIgY2xhc3M9InN0MSIvPiYjeGE7CQk8cGF0aCBkPSJNMy4yMzYgNy44MDdhLjc2Ljc2IDAgMCAwLS4zNy42NXY1YTIuNzUgMi43NSAwIDAgMS0uODcgMiAuMTguMTggMCAwIDEtLjMtLjEzdi03LjU2YzAtLjI4IDEuNTQgMCAxLjU0IDB6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik02Ljc0NiA0LjUxN2EuMzQuMzQgMCAwIDEgLjM2IDBsMSAuNTktNi4wOCAzLjU2YS43Ny43NyAwIDAgMC0uMzcuNjZ2LTEuMzlhLjcyLjcyIDAgMCAxIC4zOC0uNjR6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xNS4xNDYgMTEuNDM3di01YTIuODEgMi44MSAwIDAgMSAuODQtMmMwIDAgLjMzLS4xMS4zMS4yMXMwIDcuMzcgMCA3LjM3Yy0uMzEuMzctMS42MSAwLTEuNjEgMGEuODEuODEgMCAwIDAgLjQ2LS41OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE1Ljk3NiAxMi42MDdsLTQuNzQgMi44NWEuMzUuMzUgMCAwIDEtLjM3IDBsLTEtLjU3IDYuMTEtMy42N2EuNzcuNzcgMCAwIDAgLjM3LS42NnYxLjQ0Yy0uMDIuMjMtLjM3LjYxLS4zNy42MXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;', 
		    		s * 38, s * 42, 'Cloud\nBigtable', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud bigtable').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4LjQ1OTk5OTA4NDQ3MjY1NiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSIwIDAgMjAgMTguNDU5OTk5MDg0NDcyNjU2Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CQkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJCS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTguNjYgNS42M3Y0LjM2bC0zLjc3IDIuMTggMS4zNCAyLjMyTDEwIDEyLjMxbDMuNzcgMi4xOCAxLjM0LTIuMzItMy43Ny0yLjE4VjUuNjN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwIDUuNjN2NS4xMmwtNC40NCAyLjU4LjY3IDEuMTZMMTAgMTIuMzFsMy43NyAyLjE4IDEuMzQtMi4zMi0zLjc3LTIuMThWNS42M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNi42MiA0Ljk1TDEwIDYuNzhWMy42N2wtMS4zNS0uNjJWMEw2LjYyIDEuMjJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDYuNzhsMy4zOC0xLjgzVjEuMjJMMTEuMzUgMHYzLjA1TDEwIDMuNjd6bTYuMTQgNy41M2wtLjA4IDEuMzkgMi43IDEuNTMtMi4xOCAxLjItMy4yNC0xLjg3LjExLTMuODMgMy4yNy0yTDIwIDEyLjYxdjIuNDlsLTIuNjktMS41NXptLTEyLjI4IDBsLTEuMTctLjc2TDAgMTUuMXYtMi40OWwzLjIzLTEuODcgMy4yNyAyIC4xMSAzLjgzLTMuMTkgMS44OS0yLjE4LTEuMjMgMi43LTEuNTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE2LjcyIDEwLjc1bC0zLjI3IDIuMDEgMi42OSAxLjU1IDEuMTYtLjc2TDIwIDE1LjFsLS4wNS0yLjQ5ek0zLjg2IDE0LjMxbDIuNjktMS41NS0zLjI3LTIuMDEtMy4yMyAxLjg2TDAgMTUuMWwyLjctMS41NXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 38, 'Cloud\nSpanner', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud spanner').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY1OTk5OTg0NzQxMjExIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTQuNjU5OTk5ODQ3NDEyMTEgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8c3R5bGU+JiN4YTsJCS5Ee2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTcuMzMgMTUuMzV2LTMuMDFMMCA4LjQ0djMuMDF6bTAgNC42NXYtMy4wMUwwIDEzLjA5djMuMDF6IiBjbGFzcz0ic3QyIEQiLz4mI3hhOwk8cGF0aCBkPSJNMTQuNjYgOC40NGwtNy4zMyAzLjl2My4wMWw3LjMzLTMuOXptMCA0LjY1bC03LjMzIDMuOVYyMGw3LjMzLTMuOXoiIGNsYXNzPSJzdDEgRCIvPiYjeGE7CTxwYXRoIGQ9Ik03LjMzIDB2My4wMWw3LjMzIDMuOVYzLjl6IiBjbGFzcz0ic3QwIEQiLz4mI3hhOwk8cGF0aCBkPSJNMCA2LjkxbDcuMzMtMy45VjBMMCAzLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOwk8cGF0aCBkPSJNNy4zMyAxMC43OVY3Ljc3TDAgMy44N3YzLjAyeiIgY2xhc3M9IkQgc3QyIi8+JiN4YTsJPHBhdGggZD0iTTE0LjY2IDMuODdsLTcuMzMgMy45djMuMDJsNy4zMy0zLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 32, s * 42, 'Cloud\nSQL', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud sql').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIxIiB2aWV3Qm94PSIwIDAgMzAgMjEiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTAgMGwxLjUgMS41aDZMOSAweiIgY2xhc3M9InN0MiIvPiYjeGE7CTxwYXRoIGQ9Ik05IDlWMEw3LjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTAgOWwxLjUtMS41di02TDAgMHoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNOSA5TDcuNSA3LjVoLTZMMCA5eiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTAuNSAwTDEyIDEuNWg2TDE5LjUgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSA5VjBMMTggMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgOUwxMiA3LjV2LTZMMTAuNSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xOS41IDlMMTggNy41aC02TDEwLjUgOXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8cGF0aCBkPSJNMTIgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMjEgMGwxLjUgMS41aDZMMzAgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMzAgOVYwbC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDlsMS41LTEuNXYtNkwyMSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0zMCA5bC0xLjUtMS41aC02TDIxIDl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIyLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMCAxMmwxLjUgMS41aDZMOSAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMXYtOWwtMS41IDEuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0wIDIxbDEuNS0xLjV2LTZMMCAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMWwtMS41LTEuNWgtNkwwIDIxeiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMTMuNWg2djZoLTZ6IiBjbGFzcz0ic3QzIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgMTJsMS41IDEuNWg2bDEuNS0xLjV6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTE5LjUgMjF2LTlMMTggMTMuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xMC41IDIxbDEuNS0xLjV2LTZMMTAuNSAxMnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSAyMUwxOCAxOS41aC02TDEwLjUgMjF6IiBjbGFzcz0ic3QwIi8+JiN4YTsJPHBhdGggZD0iTTEyIDEzLjVoNnY2aC02em05LTEuNWwxLjUgMS41aDZMMzAgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxdi05bC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDIxbDEuNS0xLjV2LTZMMjEgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxbC0xLjUtMS41aC02TDIxIDIxeiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0yMi41IDEzLjVoNnY2aC02eiIgY2xhc3M9InN0MiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 29, 'Datastore', null, null, null, this.getTagsForStencil(gn, '', dt + 'datastore').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyMy45MDU2MTAzOTg2NzUxNSIgaGVpZ2h0PSIzNzYuNDIyMjk0OTYzNjg0MDciIHZpZXdCb3g9Ii0wLjA5NzAwMDAwMjg2MTAyMjk1IDAuMjg3OTk5OTg3NjAyMjMzOSA4NS42OTk5OTY5NDgyNDIxOSA5OS41OTUwMDEyMjA3MDMxMiI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNLS4wOTcgNzUuODE1VjU1Ljg3NGw0Mi44NS0yMC4xODN2MTkuMDd6bTAtMzUuNDAzVjIwLjQ3MUw0Mi43NTMuMjg4djE5LjA3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04NS42MDMgNzUuODE1VjU1Ljg3NGwtNDIuODUtMjAuMTgzdjE5LjA3em0wLTM1LjQwM1YyMC40NzFMNDIuNzUzLjI4OHYxOS4wN3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDIuNzUzIDgwLjMxNGwxNi4yMTctNy41MjUgMjEuMDg0IDkuNzE3LTM3LjMwMSAxNy4zNzd6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 36, s * 42, 'Firestore', null, null, null, this.getTagsForStencil(gn, '', dt + 'firestore').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxLjk0aDMuMzN2Mi41OEgwem0wIDQuNTFoMy4zM3YyLjU4SDB6bTAgNC41MmgzLjMzdjIuNThIMHptMCA0LjUxaDMuMzN2Mi41OEgwek0xNi42NyAxLjk0SDIwdjIuNThoLTMuMzN6bTAgNC41MUgyMHYyLjU4aC0zLjMzem0wIDQuNTJIMjB2Mi41OGgtMy4zM3ptMCA0LjUxSDIwdjIuNThoLTMuMzN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE2LjY3IDEuOTRsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU4aC0yLjY2em0wIDQuNTJsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU5aC0yLjY2eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMuMzMgMjBoMTMuMzRWMEgzLjMzem02LTlINmw0LjY3LTcuNzRWOUgxNGwtNC42NyA3Ljc0eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0IDkuMDNoLTMuMzNWMGg2djIwSDkuMzN2LTMuMjN6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Memorystore', null, null, null, this.getTagsForStencil(gn, '', dt + 'memorystore').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Databases', 'GCP Icons / Databases', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsDatabasesPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon databases ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3Ljk1Njk3Nzg0NDIzODI4IiBoZWlnaHQ9IjIwLjAwOTI1NjM2MjkxNTA0IiB2aWV3Qm94PSItMC4wMDA0MjE5NjUxMTY0MDIxMzQzIDAuMDAwMDc0Njk5NTIxMDY0NzU4MyAxNy45NTY5Nzc4NDQyMzgyOCAyMC4wMDkyNTYzNjI5MTUwNCI+JiN4YTsJPHN0eWxlPiYjeGE7CQkuc3Qwe2ZpbGw6IzY2OWRmNjt9JiN4YTsJCS5zdDF7ZmlsbDojYWVjYmZhO30mI3hhOwkJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGcgZmlsbC1ydWxlPSJldmVub2RkIj4mI3hhOwkJPHBhdGggZD0iTTEzLjE5NiA0LjQ0N2wtNC4yMi0yLjUxYTIuODYgMi44NiAwIDAgMS0xLjI1LTEuNzFjMCAwIC4xNi0uMzIuMzgtLjJsNS4yNSAzLjFjLjYzLjM3LjI0IDIgLjI0IDJhLjc3Ljc3IDAgMCAwLS40LS42OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE0LjQ2NiAxMC42ODdhLjM1LjM1IDAgMCAxLS4xNi4zM2wtMSAuNjh2LTcuOTVjMC0uMjcuMTctLjU2LS4wNi0uN2wuOTIuNjhhLjczLjczIDAgMCAxIC4zNS42NXoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDExLjU5N2EuMzYuMzYgMCAwIDEtLjItLjA2bC0zLjQ2LTIuMDZ2LjlsMy42NiAyLjE4LjI5LS41N3MtLjIyLS4zOS0uMjktLjM5em0uMiAxLjhhLjM2LjM2IDAgMCAxLS40IDBsLTMuNDYtMi4wNnYuNjZhLjQyLjQyIDAgMCAwIC4xOS4zNWwzLjI4IDJhLjM3LjM3IDAgMCAwIC4zOCAwIDIgMiAwIDAgMCAuMi0uNTJsLS4xOS0uMzl6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik04Ljk3NiAxMC43MjdsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzRsLTMuMjgtMmEuMzcuMzcgMCAwIDAtLjM4IDBsLTMuMjggMmEuNDEuNDEgMCAwIDAtLjE5LjM0di40M3oiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTguOTc2IDkuODI3bC0zLjQ3LTIuMDVhLjQxLjQxIDAgMCAwLS4xOS4zNHYuNDNsMy42NiAyLjE4LjI4LS41NnoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPGcgY2xhc3M9InN0MiI+JiN4YTsJCQk8cGF0aCBkPSJNOC45NzYgMTEuNTk3djFsMy42Ni0yLjE4di0uOWwtMy40NiAyLjAyYS42NS42NSAwIDAgMS0uMi4wNnptLjIgMS44YS4zNi4zNiAwIDAgMS0uMi4wNnYuOWEuNS41IDAgMCAwIC4yMS0uMDVsMy4yOC0yYS4zOS4zOSAwIDAgMCAuMTktLjM1di0uNjZ6Ii8+JiN4YTsJCQk8cGF0aCBkPSJNMTIuNDQ2IDcuNzc3bC0zLjQ3IDIuMDV2LjlsMy42Ni0yLjE4di0uNDNhLjM5LjM5IDAgMCAwLS4xOS0uMzR6Ii8+JiN4YTsJCTwvZz4mI3hhOwkJPHBhdGggZD0iTTQuNzU2IDE1LjUyN2w0LjE1IDIuNDdhMi43MiAyLjcyIDAgMCAxIDEuMjggMS44LjE4LjE4IDAgMCAxLS4yOC4xOGwtNS40NS0zLjIzYy0uNTMtLjMyLS4wNy0xLjg4LS4wNy0xLjg4YS43Ny43NyAwIDAgMCAuMzcuNjZ6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik0zLjQ4NiAxNS43Mjd2LTYuNTZhLjQxLjQxIDAgMCAxIC4xOS0uMzNsMS0uNTl2Ny45MWMwIC4yNyAwIC42OS4yMS44M2wtMS4wNi0uNjZhLjc1Ljc1IDAgMCAxLS4zNC0uNnoiIGNsYXNzPSJzdDEiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTM2IDMuNDU3YS43NS43NSAwIDAgMC0uNzQgMGwtNC4yIDIuNTRhMi42MyAyLjYzIDAgMCAxLTIuMDguMjYuMjMuMjMgMCAwIDEgMC0uNGMuMTgtLjA5IDYuMzItMy43NCA2LjMyLTMuNzQuMjMtLjE0Ljc0IDEuMzkuNzQgMS4zOXoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTcuMTI2IDIuMDc3bDUuMzIgMy4xNWEuMzcuMzcgMCAwIDEgLjIuMzF2MS4xOGwtNi42Ny0zLjk2YS43NS43NSAwIDAgMC0uNzQgMGwxLjE4LS42OWEuNzEuNzEgMCAwIDEgLjczIDB6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xMC43OTYgMTYuNDg3YS43My43MyAwIDAgMCAuNzQgMGw0LjItMi40OWEyLjYzIDIuNjMgMCAwIDEgMi4xLS4yNS4yMS4yMSAwIDAgMSAwIC4zOGwtNi4zMyAzLjc1Yy0uMjIuMTQtLjc0LTEuNC0uNzQtMS40eiIgY2xhc3M9InN0MCIvPiYjeGE7CQk8cGF0aCBkPSJNNS40ODYgMTQuNzQ3YS41Ni41NiAwIDAgMS0uMTctLjMzdi0xLjE2bDYuNjYgMy45M2EuNjkuNjkgMCAwIDAgLjczIDBsLTEuMTguN2EuNy43IDAgMCAxLS43NCAweiIgY2xhc3M9InN0MSIvPiYjeGE7CQk8cGF0aCBkPSJNMy4yMzYgNy44MDdhLjc2Ljc2IDAgMCAwLS4zNy42NXY1YTIuNzUgMi43NSAwIDAgMS0uODcgMiAuMTguMTggMCAwIDEtLjMtLjEzdi03LjU2YzAtLjI4IDEuNTQgMCAxLjU0IDB6IiBjbGFzcz0ic3QwIi8+JiN4YTsJCTxwYXRoIGQ9Ik02Ljc0NiA0LjUxN2EuMzQuMzQgMCAwIDEgLjM2IDBsMSAuNTktNi4wOCAzLjU2YS43Ny43NyAwIDAgMC0uMzcuNjZ2LTEuMzlhLjcyLjcyIDAgMCAxIC4zOC0uNjR6IiBjbGFzcz0ic3QxIi8+JiN4YTsJCTxwYXRoIGQ9Ik0xNS4xNDYgMTEuNDM3di01YTIuODEgMi44MSAwIDAgMSAuODQtMmMwIDAgLjMzLS4xMS4zMS4yMXMwIDcuMzcgMCA3LjM3Yy0uMzEuMzctMS42MSAwLTEuNjEgMGEuODEuODEgMCAwIDAgLjQ2LS41OHoiIGNsYXNzPSJzdDAiLz4mI3hhOwkJPHBhdGggZD0iTTE1Ljk3NiAxMi42MDdsLTQuNzQgMi44NWEuMzUuMzUgMCAwIDEtLjM3IDBsLTEtLjU3IDYuMTEtMy42N2EuNzcuNzcgMCAwIDAgLjM3LS42NnYxLjQ0Yy0uMDIuMjMtLjM3LjYxLS4zNy42MXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8L2c+JiN4YTs8L3N2Zz4=;', 
		    		s * 38, s * 42, 'Cloud\nBigtable', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud bigtable').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE4LjQ1OTk5OTA4NDQ3MjY1NiIgZmlsbC1ydWxlPSJldmVub2RkIiB2aWV3Qm94PSIwIDAgMjAgMTguNDU5OTk5MDg0NDcyNjU2Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CQkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJCS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTguNjYgNS42M3Y0LjM2bC0zLjc3IDIuMTggMS4zNCAyLjMyTDEwIDEyLjMxbDMuNzcgMi4xOCAxLjM0LTIuMzItMy43Ny0yLjE4VjUuNjN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwIDUuNjN2NS4xMmwtNC40NCAyLjU4LjY3IDEuMTZMMTAgMTIuMzFsMy43NyAyLjE4IDEuMzQtMi4zMi0zLjc3LTIuMThWNS42M3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNi42MiA0Ljk1TDEwIDYuNzhWMy42N2wtMS4zNS0uNjJWMEw2LjYyIDEuMjJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwIDYuNzhsMy4zOC0xLjgzVjEuMjJMMTEuMzUgMHYzLjA1TDEwIDMuNjd6bTYuMTQgNy41M2wtLjA4IDEuMzkgMi43IDEuNTMtMi4xOCAxLjItMy4yNC0xLjg3LjExLTMuODMgMy4yNy0yTDIwIDEyLjYxdjIuNDlsLTIuNjktMS41NXptLTEyLjI4IDBsLTEuMTctLjc2TDAgMTUuMXYtMi40OWwzLjIzLTEuODcgMy4yNyAyIC4xMSAzLjgzLTMuMTkgMS44OS0yLjE4LTEuMjMgMi43LTEuNTZ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE2LjcyIDEwLjc1bC0zLjI3IDIuMDEgMi42OSAxLjU1IDEuMTYtLjc2TDIwIDE1LjFsLS4wNS0yLjQ5ek0zLjg2IDE0LjMxbDIuNjktMS41NS0zLjI3LTIuMDEtMy4yMyAxLjg2TDAgMTUuMWwyLjctMS41NXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 38, 'Cloud\nSpanner', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud spanner').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE0LjY1OTk5OTg0NzQxMjExIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTQuNjU5OTk5ODQ3NDEyMTEgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8c3R5bGU+JiN4YTsJCS5Ee2ZpbGwtcnVsZTpldmVub2RkfSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTcuMzMgMTUuMzV2LTMuMDFMMCA4LjQ0djMuMDF6bTAgNC42NXYtMy4wMUwwIDEzLjA5djMuMDF6IiBjbGFzcz0ic3QyIEQiLz4mI3hhOwk8cGF0aCBkPSJNMTQuNjYgOC40NGwtNy4zMyAzLjl2My4wMWw3LjMzLTMuOXptMCA0LjY1bC03LjMzIDMuOVYyMGw3LjMzLTMuOXoiIGNsYXNzPSJzdDEgRCIvPiYjeGE7CTxwYXRoIGQ9Ik03LjMzIDB2My4wMWw3LjMzIDMuOVYzLjl6IiBjbGFzcz0ic3QwIEQiLz4mI3hhOwk8cGF0aCBkPSJNMCA2LjkxbDcuMzMtMy45VjBMMCAzLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOwk8cGF0aCBkPSJNNy4zMyAxMC43OVY3Ljc3TDAgMy44N3YzLjAyeiIgY2xhc3M9IkQgc3QyIi8+JiN4YTsJPHBhdGggZD0iTTE0LjY2IDMuODdsLTcuMzMgMy45djMuMDJsNy4zMy0zLjl6IiBjbGFzcz0iRCBzdDEiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 32, s * 42, 'Cloud\nSQL', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud sql').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIxIiB2aWV3Qm94PSIwIDAgMzAgMjEiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggZD0iTTAgMGwxLjUgMS41aDZMOSAweiIgY2xhc3M9InN0MiIvPiYjeGE7CTxwYXRoIGQ9Ik05IDlWMEw3LjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTAgOWwxLjUtMS41di02TDAgMHoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNOSA5TDcuNSA3LjVoLTZMMCA5eiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTAuNSAwTDEyIDEuNWg2TDE5LjUgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSA5VjBMMTggMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgOUwxMiA3LjV2LTZMMTAuNSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0xOS41IDlMMTggNy41aC02TDEwLjUgOXoiIGNsYXNzPSJzdDEiLz4mI3hhOwk8cGF0aCBkPSJNMTIgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMjEgMGwxLjUgMS41aDZMMzAgMHoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNMzAgOVYwbC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDlsMS41LTEuNXYtNkwyMSAweiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0zMCA5bC0xLjUtMS41aC02TDIxIDl6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIyLjUgMS41aDZ2NmgtNnoiIGNsYXNzPSJzdDMiLz4mI3hhOwk8cGF0aCBkPSJNMCAxMmwxLjUgMS41aDZMOSAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMXYtOWwtMS41IDEuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0wIDIxbDEuNS0xLjV2LTZMMCAxMnoiIGNsYXNzPSJzdDAiLz4mI3hhOwk8cGF0aCBkPSJNOSAyMWwtMS41LTEuNWgtNkwwIDIxeiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xLjUgMTMuNWg2djZoLTZ6IiBjbGFzcz0ic3QzIi8+JiN4YTsJPHBhdGggZD0iTTEwLjUgMTJsMS41IDEuNWg2bDEuNS0xLjV6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTE5LjUgMjF2LTlMMTggMTMuNXY2eiIgY2xhc3M9InN0MSIvPiYjeGE7CTxwYXRoIGQ9Ik0xMC41IDIxbDEuNS0xLjV2LTZMMTAuNSAxMnoiIGNsYXNzPSJzdDIiLz4mI3hhOwk8cGF0aCBkPSJNMTkuNSAyMUwxOCAxOS41aC02TDEwLjUgMjF6IiBjbGFzcz0ic3QwIi8+JiN4YTsJPHBhdGggZD0iTTEyIDEzLjVoNnY2aC02em05LTEuNWwxLjUgMS41aDZMMzAgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxdi05bC0xLjUgMS41djZ6IiBjbGFzcz0ic3QxIi8+JiN4YTsJPHBhdGggZD0iTTIxIDIxbDEuNS0xLjV2LTZMMjEgMTJ6IiBjbGFzcz0ic3QyIi8+JiN4YTsJPHBhdGggZD0iTTMwIDIxbC0xLjUtMS41aC02TDIxIDIxeiIgY2xhc3M9InN0MCIvPiYjeGE7CTxwYXRoIGQ9Ik0yMi41IDEzLjVoNnY2aC02eiIgY2xhc3M9InN0MiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 29, 'Datastore', null, null, null, this.getTagsForStencil(gn, '', dt + 'datastore').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMyMy45MDU2MTAzOTg2NzUxNSIgaGVpZ2h0PSIzNzYuNDIyMjk0OTYzNjg0MDciIHZpZXdCb3g9Ii0wLjA5NzAwMDAwMjg2MTAyMjk1IDAuMjg3OTk5OTg3NjAyMjMzOSA4NS42OTk5OTY5NDgyNDIxOSA5OS41OTUwMDEyMjA3MDMxMiI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojYWVjYmZhO30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiM0Mjg1ZjQ7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNLS4wOTcgNzUuODE1VjU1Ljg3NGw0Mi44NS0yMC4xODN2MTkuMDd6bTAtMzUuNDAzVjIwLjQ3MUw0Mi43NTMuMjg4djE5LjA3eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04NS42MDMgNzUuODE1VjU1Ljg3NGwtNDIuODUtMjAuMTgzdjE5LjA3em0wLTM1LjQwM1YyMC40NzFMNDIuNzUzLjI4OHYxOS4wN3oiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDIuNzUzIDgwLjMxNGwxNi4yMTctNy41MjUgMjEuMDg0IDkuNzE3LTM3LjMwMSAxNy4zNzd6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 36, s * 42, 'Firestore', null, null, null, this.getTagsForStencil(gn, '', dt + 'firestore').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxLjk0aDMuMzN2Mi41OEgwem0wIDQuNTFoMy4zM3YyLjU4SDB6bTAgNC41MmgzLjMzdjIuNThIMHptMCA0LjUxaDMuMzN2Mi41OEgwek0xNi42NyAxLjk0SDIwdjIuNThoLTMuMzN6bTAgNC41MUgyMHYyLjU4aC0zLjMzem0wIDQuNTJIMjB2Mi41OGgtMy4zM3ptMCA0LjUxSDIwdjIuNThoLTMuMzN6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE2LjY3IDEuOTRsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU4aC0yLjY2em0wIDQuNTJsMi42NiAyLjU4aC0yLjY2em0wIDQuNTFsMi42NiAyLjU5aC0yLjY2eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMuMzMgMjBoMTMuMzRWMEgzLjMzem02LTlINmw0LjY3LTcuNzRWOUgxNGwtNC42NyA3Ljc0eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0IDkuMDNoLTMuMzNWMGg2djIwSDkuMzN2LTMuMjN6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Memorystore', null, null, null, this.getTagsForStencil(gn, '', dt + 'memorystore').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Databases', 'GCP Icons / Databases', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsStoragePalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon storage ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJLnN0M3tmaWxsOiNmZmY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTAgMGgyMHY3SDB6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE4IDBoMnY3aC0yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOCA3bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAwaDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAzaDZ2MUg0eiIvPiYjeGE7CQk8cmVjdCB4PSIxMyIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMyIgcng9IjEuNSIvPiYjeGE7CTwvZz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMCA5aDIwdjdIMHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTggOWgydjdoLTJ6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE4IDE2bDItN2gtMnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCA5aDJ2N0gweiIvPiYjeGE7CTxnIGNsYXNzPSJzdDMiPiYjeGE7CQk8cGF0aCBkPSJNNCAxMmg2djFINHoiLz4mI3hhOwkJPHJlY3QgeD0iMTMiIHk9IjExIiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiByeD0iMS41Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 34, 'Cloud\nStorage', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud storage').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjAgMTYiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTIgMTBIOEw2IDhoOHoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTYgMkg0bDEtMmgxMHptMyAzSDFsMS0yaDE2eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNCA3bC0yIDNIOEw2IDdIMHY5aDIwVjd6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 34, 'Filestore', null, null, null, this.getTagsForStencil(gn, '', dt + 'filestore').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE1Ljg0MDAwMDE1MjU4Nzg5IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTUuODQwMDAwMTUyNTg3ODkgMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTsJPC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCAxNi4yNVYyMGgxNS44NHYtOC4zM2gtMy43NXY0LjU4eiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNS44NCAzLjc1VjBIMHY4LjMzaDMuNzVWMy43NXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMCAxMC40MnYzLjc1aDEwVjkuNThoNS44NFY1LjgzaC0xMHY0LjU5eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 34, s * 42, 'Persistent\nDisk', null, null, null, this.getTagsForStencil(gn, '', dt + 'persistent disk').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Storage', 'GCP Icons / Storage', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsSecurityPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon security ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjQyMDAwMDA3NjI5Mzk0NSIgaGVpZ2h0PSIyMC4wNDk5OTkyMzcwNjA1NDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDE2LjQyMDAwMDA3NjI5Mzk0NSAyMC4wNDk5OTkyMzcwNjA1NDciPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LjIxIDBMMCAzLjQydjUuNjNjMCA1LjA2IDMuNSA5LjggOC4yMSAxMSA0LjcxLTEuMTUgOC4yMS01Ljg5IDguMjEtMTAuOTVWMy40MnptMCAzLjc5YTIuNjMgMi42MyAwIDAgMSAxLjAwNSA1LjA2QTIuNjMgMi42MyAwIDAgMSA2LjM1IDQuNTZhMi42MyAyLjYzIDAgMCAxIDEuODYtLjc3em00LjExIDExLjE1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTMgOC42NCA4LjY0IDAgMCAxLTQuMTEtMi45M3YtMi4yNWMwLTEuNjcgMi43NC0yLjUyIDQuMTEtMi41MnM0LjExLjg1IDQuMTEgMi41MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOC4yMSAwdjMuNzlhMi42MyAyLjYzIDAgMSAxIDAgNS4yNnYxLjEyYzEuMzcgMCA0LjExLjg1IDQuMTEgMi41MnYyLjI1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTNWMjBjNC43MS0xLjE1IDguMjEtNS44OSA4LjIxLTEwLjk1VjMuNDJ6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 34, s * 42, 'Cloud\nIAM', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud iam').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE2LjQyMDAwMDA3NjI5Mzk0NSIgaGVpZ2h0PSIyMC4wNDk5OTkyMzcwNjA1NDciIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iMCAwIDE2LjQyMDAwMDA3NjI5Mzk0NSAyMC4wNDk5OTkyMzcwNjA1NDciPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LjIxIDBMMCAzLjQydjUuNjNjMCA1LjA2IDMuNSA5LjggOC4yMSAxMSA0LjcxLTEuMTUgOC4yMS01Ljg5IDguMjEtMTAuOTVWMy40MnptMCAzLjc5YTIuNjMgMi42MyAwIDAgMSAxLjAwNSA1LjA2QTIuNjMgMi42MyAwIDAgMSA2LjM1IDQuNTZhMi42MyAyLjYzIDAgMCAxIDEuODYtLjc3em00LjExIDExLjE1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTMgOC42NCA4LjY0IDAgMCAxLTQuMTEtMi45M3YtMi4yNWMwLTEuNjcgMi43NC0yLjUyIDQuMTEtMi41MnM0LjExLjg1IDQuMTEgMi41MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOC4yMSAwdjMuNzlhMi42MyAyLjYzIDAgMSAxIDAgNS4yNnYxLjEyYzEuMzcgMCA0LjExLjg1IDQuMTEgMi41MnYyLjI1YTguNjQgOC42NCAwIDAgMS00LjExIDIuOTNWMjBjNC43MS0xLjE1IDguMjEtNS44OSA4LjIxLTEwLjk1VjMuNDJ6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 34, s * 42, 'Cloud Resource\nManager', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud resource manager').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE3LjI3OTk5ODc3OTI5Njg3NSIgdmlld0JveD0iMCAwIDIwIDE3LjI3OTk5ODc3OTI5Njg3NSI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iOS40NCIgY3k9IjguMTQiIHI9IjIuOTciLz4mI3hhOwk8ZyBjbGFzcz0ic3QxIj4mI3hhOwkJPGNpcmNsZSBjeD0iMi4wMiIgY3k9IjcuNDMiIHI9IjIuMDIiLz4mI3hhOwkJPGNpcmNsZSBjeD0iMTIuNTIiIGN5PSIxNS4yNiIgcj0iMi4wMiIvPiYjeGE7CQk8cGF0aCBkPSJNMTcuNTcuODRBMi40MyAyLjQzIDAgMSAwIDIwIDMuMjcgMi40MyAyLjQzIDAgMCAwIDE3LjU3Ljg0em0wIDMuOGExLjM3IDEuMzcgMCAxIDEgMS4zNi0xLjM3aDBhMS4zNyAxLjM3IDAgMCAxLTEuMzYgMS4zN3oiLz4mI3hhOwkJPHBhdGggZD0iTTE2LjIgMy4zMkE4LjI5IDguMjkgMCAwIDAgMTEuMTQgMGwtLjI4IDEuMzRhNi45NSA2Ljk1IDAgMSAxLTguMjIgNS4zOCA2Ljg4IDYuODggMCAwIDEgMS44Ny0zLjQ3bC0xLTFhOC4zMSA4LjMxIDAgMSAwIDEzLjM4IDIuMiAxLjM2IDEuMzYgMCAwIDEtLjY5LTEuMTN6Ii8+JiN4YTsJPC9nPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 36, 'Cloud Security\nScanner', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud security scanner').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjMxMC43NzU2MDY1NDM4NjAyNSIgaGVpZ2h0PSIzNzcuOTUzMDI4ODM1NTI1NDYiIHZpZXdCb3g9Ii0wLjE0MDAwMDAwMDU5NjA0NjQ1IC0wLjQ2NzAwMDAwNzYyOTM5NDUzIDgyLjIyNTk5NzkyNDgwNDY5IDEwMC4wMDAwMDc2MjkzOTQ1MyI+JiN4YTs8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNmZmY7fSYjeGE7PC9zdHlsZT4mI3hhOwk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDAuOTczLS40NjdsNDEuMTEzIDE3LjQ5M3YyOS42NTRjMCAyNy40MTgtMjQuNjA4IDUwLjgzNi00MS4xMTMgNTIuODUzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MC45NzMtLjQ2N0wtLjE0IDE3LjAyNXYyOS42NTRjMCAyNy40MTggMjQuNjA4IDUwLjgzNiA0MS4xMTMgNTIuODUzeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00MS4yNTMgMTYuNjA1Yy05LjU4NCAwLTE3LjQ0NSA3Ljg2Mi0xNy40NDUgMTcuNDQ1IDAgOC4wODQgNS41OTQgMTQuOTQyIDEzLjA5NiAxNi44OTF2OS40ODhoLTkuODY5djguNzAxaDkuODY5djUuMzc3aC02LjMxNXY4LjcwMWg2LjMxNXYyLjE5N2g4LjcwMVY1MC45NDFDNTMuMTA2IDQ4Ljk5MiA1OC43IDQyLjEzNCA1OC43IDM0LjA1YzAtOS41ODQtNy44NjMtMTcuNDQ1LTE3LjQ0Ny0xNy40NDV6bTAgOC42OTlBOC42OCA4LjY4IDAgMCAxIDUwIDM0LjA1YTguNjggOC42OCAwIDAgMS04Ljc0OCA4Ljc0NiA4LjY4IDguNjggMCAwIDEtOC43NDYtOC43NDYgOC42OCA4LjY4IDAgMCAxIDguNzQ2LTguNzQ2eiIvPiYjeGE7PC9zdmc+;', 
		    		s * 34, s * 42, 'Key Management\nService', null, null, null, this.getTagsForStencil(gn, '', dt + 'key management service').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE3LjE4MDAwMDMwNTE3NTc4IiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTcuMTgwMDAwMzA1MTc1NzggMjAiPiYjeGE7CTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05LjkgNC44NWE1LjIzIDUuMjMgMCAwIDEgMy43NSAzLjc1aDMuNTNWMy4yNEw5LjkgMHpNMy41MiA4LjYxYTUuMjIgNS4yMiAwIDAgMSAzLjc1LTMuNzVWMEwwIDMuMjR2NS4zN3pNNy4yOCAxNWE1LjIzIDUuMjMgMCAwIDEtMy43NS0zLjc1SC4yMkExMiAxMiAwIDAgMCA3LjI4IDIwem02LjM4LTMuNzVBNS4yMyA1LjIzIDAgMCAxIDkuOTEgMTV2NWExMiAxMiAwIDAgMCA3LjA1LTguNzV6Ii8+JiN4YTsJPGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iOC41OSIgY3k9IjkuOTIiIHI9IjIuNjMiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 36, s * 42, 'Security\nCommand Center', null, null, null, this.getTagsForStencil(gn, '', dt + 'security command center').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Security', 'GCP Icons / Security', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsMigrationPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon security ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjE5LjkzMzEzNDA3ODk3OTQ5MiIgaGVpZ2h0PSIxMC44NjAwMDA2MTAzNTE1NjIiIHZpZXdCb3g9IjAuMDAwMDI2NTAxNDY0MTYyNzIwMzY3IC0zLjgxMjY2MDA1NDMzNjQ0NzVlLTggMTkuOTMzMTM0MDc4OTc5NDkyIDEwLjg2MDAwMDYxMDM1MTU2MiI+JiN4YTsJPHN0eWxlIHR5cGU9InRleHQvY3NzIj4mI3hhOwkuc3Qwe2ZpbGw6IzQyODVmNDt9JiN4YTsJLnN0MXtmaWxsOiM2NjlkZjY7fSYjeGE7CS5zdDJ7ZmlsbDojYWVjYmZhO30mI3hhOwk8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOS41NjMgMEg3LjE5M2EuMzIuMzIgMCAwIDAtLjMyLjMzdjIuMTZhLjMyLjMyIDAgMCAwIC4zMi4zMmgxMi4zN2EuMzIuMzIgMCAwIDAgLjM3LS4zMlYuMzNhLjMyLjMyIDAgMCAwLS4zMS0uMzN6TTguNDIzIDIuMTRhLjcuNyAwIDEgMSAuNy0uN2gwYS43LjcgMCAwIDEtLjcuN3ptMTEuMTQgMS45SDcuMTkzYS4zMi4zMiAwIDAgMC0uMzIuMzJ2Mi4xNWEuMzIuMzIgMCAwIDAgLjMyLjMyaDEyLjM3YS4zMi4zMiAwIDAgMCAuMzItLjMyVjQuMzZhLjMyLjMyIDAgMCAwLS4zMi0uMzJ6TTguNDIzIDYuMThhLjcuNyAwIDEgMSAuNy0uN2gwYS43LjcgMCAwIDEtLjcuN3ptMTEuMTkgMS44N0g3LjI1M2EuMzIuMzIgMCAwIDAtLjMyLjMydjIuMTZhLjMyLjMyIDAgMCAwIC4zMi4zM2gxMi4zNmEuMzIuMzIgMCAwIDAgLjMyLS4zM1Y4LjM3YS4zMi4zMiAwIDAgMC0uMzItLjMyem0tMTEuMTQgMi4xM2EuNzEuNzEgMCAwIDEtLjctLjcxLjcxLjcxIDAgMCAxIDEuNDEgMCAuNzEuNzEgMCAwIDEtLjcxLjcxeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00LjY3MyAzLjI5aC0yLjEzYS44MTIuODEyIDAgMCAxLS4yMS0xLjYxaDIuMzRhLjgxNS44MTUgMCAxIDEgLjI2IDEuNjF6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTQuNjczIDYuMjRILjg1M2EuODIuODIgMCAwIDEtLjIxLTEuNjJoNGEuODIzLjgyMyAwIDAgMSAuMjkgMS42MnoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNC42NzMgOS4xOGgtMi4xM2EuODEyLjgxMiAwIDAgMS0uMjEtMS42MWgyLjM0YS44MTUuODE1IDAgMCAxIC4yNiAxLjYxeiIvPiYjeGE7PC9zdmc+;', 
		    		s * 42, s * 23, 'Transfer\nAppliance', null, null, null, this.getTagsForStencil(gn, '', dt + 'transfer appliance').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Migration', 'GCP Icons / Migration', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IconsHybridAndMultiCloudPalette = function()
	{
		var sb = this;
		var s = 1;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-6;fontSize=11;fontStyle=1;fontColor=#999999;shape=image;aspect=fixed;imageAspect=0;';
		var dt = 'gcp google cloud platform icons icon security ';
		var gn = 'mxgraph.gcp2';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjM3OC45OTYwMDM2OTA5NDU4IiBoZWlnaHQ9IjM3My40ODg4MDkyODIxODgyNCIgdmlld0JveD0iMCAwIDEwMC4yNzYwMDA5NzY1NjI1IDk4LjgxOTAwNzg3MzUzNTE2Ij4mI3hhOzxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+JiN4YTsJLnN0MHtmaWxsOiM0Mjg1ZjQ7fSYjeGE7CS5zdDF7ZmlsbDojNjY5ZGY2O30mI3hhOwkuc3Qye2ZpbGw6I2FlY2JmYTt9JiN4YTs8L3N0eWxlPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNC42MTQgMjQuNzc1TDAgMzQuNzA5bDE0LjYxNCA5LjkzM1YzOS45NWMzLjU0NSAxLjQwMyA3LjcwNCAzLjY1OSAxMS4yMjYgNi44NDggNS4yMjQgNC43MyA5LjIzNSAxMS4yIDkuMjM1IDIwLjk2NXYxMS41MzJoMTBWNjcuNzYyYzAtMTIuNjQ0LTUuNjcxLTIyLjE3NS0xMi41MjMtMjguMzc5LTUuOTI5LTUuMzY4LTEyLjU5Mi04LjQ3LTE3LjkzNy0xMC4wMjR6Ii8+JiN4YTsJPHBhdGggY2xhc3M9InN0MSIgZD0iTTU0Ljg4NiAxOC41NTR2NjYuMDIxaC00LjUzNWwxMC4xOSAxNC4yNDQgMTAuMTktMTQuMjQ0aC01Ljg0NlYxOC41NTR6TTM5Ljk2MSAwbC05LjcwNSAxMy45NThoNC44MTl2NjUuMzM2aDEwVjEzLjk1N2g0LjU5MXoiLz4mI3hhOwk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNTQuODg2IDE4LjU1NHYxMi45YzAgMTMuNDY0IDYuNzE5IDIzLjE0OCAxNC4wNTIgMjkuMTI1IDUuOTI1IDQuODI5IDEyLjE0NiA3LjUxIDE2LjQxNCA4Ljg3NnY0LjcyMmwxNC45MjQtOS41NzEtMTQuOTI0LTkuNTcxdjMuNzI1Yy0zLjA0My0xLjI3OC02Ljc3LTMuMjIxLTEwLjA5OC01LjkzMy01LjY5OC00LjY0NC0xMC4zNjktMTEuMTEtMTAuMzY5LTIxLjM3M3YtMTIuOXoiLz4mI3hhOzwvc3ZnPg==;', 
		    		s * 42, s * 42, 'Traffic\nDirector', null, null, null, this.getTagsForStencil(gn, '', dt + 'traffic director').join(' ')),
		    this.createVertexTemplateEntry(n + 'image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnY9Imh0dHBzOi8vdmVjdGEuaW8vbmFubyIgd2lkdGg9IjQxNiIgaGVpZ2h0PSIzNjIuMjAwMDEyMjA3MDMxMjUiIHZpZXdCb3g9IjAgMCA0MTYgMzYyLjIwMDAxMjIwNzAzMTI1Ij4mI3hhOwk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPiYjeGE7CS5zdDB7ZmlsbDojNDI4NWY0O30mI3hhOwkuc3Qxe2ZpbGw6IzY2OWRmNjt9JiN4YTsJLnN0MntmaWxsOiNhZWNiZmE7fSYjeGE7CTwvc3R5bGU+JiN4YTsJPHBhdGggY2xhc3M9InN0MiIgZD0iTTk2LjAzIDBMMCAxNjcuMTdoMTkwLjY3TDI4Ny45NCAweiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yODcuNTkgMzYyLjJsLTk1LjY4LTE2Ny4xN0gwTDk1LjY4IDM2Mi4yeiIvPiYjeGE7CTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MTYgMTgxLjFMMzIwIDEzLjMxIDIyMy44OCAxODEuMSAzMjAgMzQ4Ljl6Ii8+JiN4YTs8L3N2Zz4=;', 
		    		s * 42, s * 36, 'Stackdriver', null, null, null, this.getTagsForStencil(gn, '', dt + 'stackdriver').join(' '))
	 	];
		
		this.addPalette('gcp2Icons Hybrid and Multi Cloud', 'GCP Icons / Hybrid and Multi Cloud', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2CardSet = function(label, icon, w1, w2, dt, fns)
	{
		var sb = this;
		var s = 'sketch=0;dashed=0;connectable=0;html=1;fillColor=#5184F3;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.hexIcon;prIcon=';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w1, 60), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell(label, new mxGeometry(0, 0.5, 44, 39), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#999999;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, -19.5);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})
		);
		
		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w2, 60), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>' + label1, new mxGeometry(0, 0.5, 44, 39), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#999999;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, -19.5);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})			
		);
			
		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w2 + 8, 68), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>' + label1, new mxGeometry(0, 0.5, 44, 39), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#999999;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, -19.5);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})
		);
	};
	
	Sidebar.prototype.addGCP2ProductCardSet = function(label, icon, scaleX, scaleY, w1, w2, dt, fns)
	{
		var sb = this;
		var s = 'sketch=0;dashed=0;connectable=0;html=1;fillColor=#5184F3;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w1, 60), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell(label, new mxGeometry(0, 0, 45 * scaleX, 45 * scaleY), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#999999;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7 + (1 - scaleY) * 22.5);
		    	icon1.vertex = true;

		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})
		);
		
		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w2, 60), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>' + label1, new mxGeometry(0, 0, 45 * scaleX, 45 * scaleY), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#999999;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7 + (1 - scaleY) * 22.5);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})			
		);
			
		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w2 + 8, 68), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>' + label1, new mxGeometry(0, 0, 45 * scaleX, 45 * scaleY), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#999999;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7 + (1 - scaleY) * 22.5);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})
		);
	};
	
	Sidebar.prototype.addGCP2ServiceCard = function(label, icon, w, h, dt, fns)
	{
		var sb = this;
		var s = 'sketch=0;dashed=0;connectable=0;html=1;fillColor=#757575;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w, h), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell(label, new mxGeometry(0, 0.5, 32, 32), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, -16);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], w, h, label1);
			})
		);
	};
	
	Sidebar.prototype.addGCP2ExpandedProductCardSet = function(label, icon, w, dt, fns)
	{
		var sb = this;
		var s = 'sketch=0;dashed=0;connectable=0;html=1;fillColor=#5184F3;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w, 70), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>' + label1 + '<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 44, 39), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})
		);
		
		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w + 8, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>' + label1 + '<hr><font style="font-size: 11px">Attribute Name</font>', 
			    		new mxGeometry(0, 0, 44, 39), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=top;spacingLeft=5;fontColor=#999999;fontSize=12;spacingTop=-8;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, 7);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})			
		);
	};

	Sidebar.prototype.addGCP2ExpandedMachineCard = function(label, mainIcon, aspectX, aspectY, capacityLabel, machineNum1, machineIcon, machineNum2, storageIcon, storageNum, additionalModifierIcon, w, dt, fns)
	{
		var sb = this;
		var s = 'sketch=0;dashed=0;connectable=0;html=1;fillColor=#757575;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w, 95), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
		    	
			    var mainTitleCell = new mxCell('<font color="#000000">' + label1 + '</font><hr>' + capacityLabel, 
			    		new mxGeometry(0, 0, w, 50), 'text;part=1;html=1;align=left;verticalAlign=top;spacingLeft=35;fontColor=#999999;fontSize=11;resizeWidth=1;');
			    mainTitleCell.geometry.relative = true;
			    mainTitleCell.vertex = true;
		    	bg.insert(mainTitleCell);
			    
			    var mainIconCell = new mxCell('', 
			    		new mxGeometry(0, 0, 25 * aspectX, 25 * aspectY), s + mainIcon + ';part=1;');
			    mainIconCell.geometry.relative = true;
			    mainIconCell.geometry.offset = new mxPoint(4 + 12.5 * (1 - aspectX), 6 + 12.5 * (1 - aspectY));
			    mainIconCell.vertex = true;
		    	bg.insert(mainIconCell);
			    
			    var machineCell = new mxCell('', 
			    		new mxGeometry(0, 0, 20, 20), s + machineIcon + ';part=1;');
			    machineCell.geometry.relative = true;
			    machineCell.geometry.offset = new mxPoint(35, 55);
			    machineCell.vertex = true;
		    	bg.insert(machineCell);
			    
			    var machineNum1Cell = new mxCell(machineNum1, 
			    		new mxGeometry(0, 0, 18, 18), 'sketch=0;rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
			    machineNum1Cell.geometry.relative = true;
			    machineNum1Cell.geometry.offset = new mxPoint(24, 69);
			    machineNum1Cell.vertex = true;
		    	bg.insert(machineNum1Cell);
			    
			    var machineNum2Cell = new mxCell(machineNum2, 
			    		new mxGeometry(0, 0, 18, 18), 'sketch=0;rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
			    machineNum2Cell.geometry.relative = true;
			    machineNum2Cell.geometry.offset = new mxPoint(50, 69);
			    machineNum2Cell.vertex = true;
		    	bg.insert(machineNum2Cell);
			    
			    var storageCell = new mxCell('', 
			    		new mxGeometry(0, 0, 20, 18), s + storageIcon + ';part=1;');
			    storageCell.geometry.relative = true;
			    storageCell.geometry.offset = new mxPoint(75, 56);
			    storageCell.vertex = true;
		    	bg.insert(storageCell);
			    
			    var storageNumCell = new mxCell(storageNum, 
			    		new mxGeometry(0, 0, 18, 18), 'sketch=0;rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
			    storageNumCell.geometry.relative = true;
			    storageNumCell.geometry.offset = new mxPoint(88, 69);
			    storageNumCell.vertex = true;
		    	bg.insert(storageNumCell);
			    
			    var additionalModifierCell = new mxCell('', 
			    		new mxGeometry(0, 0, 20, 20), s + additionalModifierIcon + ';part=1;');
			    additionalModifierCell.geometry.relative = true;
			    additionalModifierCell.geometry.offset = new mxPoint(115, 55);
			    additionalModifierCell.vertex = true;
		    	bg.insert(additionalModifierCell);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})
		);
		
		fns.push(
				this.addEntry(dt, function()
			   	{
				    var bg = new mxCell('', new mxGeometry(0, 0, w, 95), 'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
			    	bg.vertex = true;
			    	
				    var mainTitleCell = new mxCell('<font color="#000000">' + label1 + '</font><hr>' + capacityLabel, 
				    		new mxGeometry(0, 0, w, 50), 'text;connectable=0;part=1;html=1;align=left;verticalAlign=top;spacingLeft=35;fontColor=#999999;fontSize=11;resizeWidth=1;');
				    mainTitleCell.geometry.relative = true;
				    mainTitleCell.vertex = true;
			    	bg.insert(mainTitleCell);
				    
				    var mainIconCell = new mxCell('', 
				    		new mxGeometry(0, 0, 25 * aspectX, 25 * aspectY), s + mainIcon + ';part=1;');
				    mainIconCell.geometry.relative = true;
				    mainIconCell.geometry.offset = new mxPoint(4 + 12.5 * (1 - aspectX), 6 + 12.5 * (1 - aspectY));
				    mainIconCell.vertex = true;
			    	bg.insert(mainIconCell);
				    
				    var machineCell = new mxCell('', 
				    		new mxGeometry(0, 0, 20, 20), s + machineIcon + ';part=1;');
				    machineCell.geometry.relative = true;
				    machineCell.geometry.offset = new mxPoint(35, 55);
				    machineCell.vertex = true;
			    	bg.insert(machineCell);
				    
				    var machineNum1Cell = new mxCell(machineNum1, 
				    		new mxGeometry(0, 0, 18, 18), 'sketch=0;connectable=0;rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
				    machineNum1Cell.geometry.relative = true;
				    machineNum1Cell.geometry.offset = new mxPoint(24, 69);
				    machineNum1Cell.vertex = true;
			    	bg.insert(machineNum1Cell);
				    
				    var machineNum2Cell = new mxCell(machineNum2, 
				    		new mxGeometry(0, 0, 18, 18), 'sketch=0;connectable=0;rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
				    machineNum2Cell.geometry.relative = true;
				    machineNum2Cell.geometry.offset = new mxPoint(50, 69);
				    machineNum2Cell.vertex = true;
			    	bg.insert(machineNum2Cell);
				    
				    var storageCell = new mxCell('', 
				    		new mxGeometry(0, 0, 20, 18), s + storageIcon + ';part=1;');
				    storageCell.geometry.relative = true;
				    storageCell.geometry.offset = new mxPoint(75, 56);
				    storageCell.vertex = true;
			    	bg.insert(storageCell);
				    
				    var storageNumCell = new mxCell('123', 
				    		new mxGeometry(0, 0, 25, 18), 'sketch=0;connectable=0;rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
				    storageNumCell.geometry.relative = true;
				    storageNumCell.geometry.offset = new mxPoint(81, 69);
				    storageNumCell.vertex = true;
			    	bg.insert(storageNumCell);
				    
				    var additionalModifierCell = new mxCell('', 
				    		new mxGeometry(0, 0, 20, 20), s + additionalModifierIcon + ';part=1;');
				    additionalModifierCell.geometry.relative = true;
				    additionalModifierCell.geometry.offset = new mxPoint(115, 55);
				    additionalModifierCell.vertex = true;
			    	bg.insert(additionalModifierCell);
			    	
				   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
				})
			);
	};

	Sidebar.prototype.addGCP2UserDeviceCard = function(label, icon, scaleX, scaleY, h1, dt, fns)
	{
		var sb = this;
		var s = 'sketch=0;dashed=0;connectable=0;html=1;fillColor=#757575;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell(label, new mxGeometry(0, 0, 70, 85  + h1), 
			    		'strokeColor=#dddddd;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;labelPosition=center;verticalLabelPosition=middle;align=center;verticalAlign=bottom;spacingLeft=0;fontColor=#999999;fontSize=12;whiteSpace=wrap;spacingBottom=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('', new mxGeometry(0.5, 0, 50 * scaleX, 50 * scaleY), s + icon + ';part=1;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(- scaleX * 25, 10 + (1 - scaleY) * 25);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})
		);
	};
})();
