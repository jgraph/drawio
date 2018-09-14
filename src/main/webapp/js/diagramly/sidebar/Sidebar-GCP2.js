(function()
{
	Sidebar.prototype.addGCP2Palette = function()
	{
		this.addGCP2PathsPalette();
		this.addGCP2ZonesPalette();
		this.addGCP2ServiceCardsPalette();
		this.addGCP2UserDeviceCardsPalette();
		this.addGCP2ComputePalette();
		this.addGCP2APIPlatformEcosystemsPalette();
		this.addGCP2IdentitySecurityPalette();
		this.addGCP2BigDataPalette();
		this.addGCP2DataTransferPalette();
		this.addGCP2CloudAIPalette();
		this.addGCP2InternetOfThingsPalette();
		this.addGCP2StorageDatabasesPalette();
		this.addGCP2ManagementToolsPalette();
		this.addGCP2NetworkingPalette();
		this.addGCP2DeveloperToolsPalette();
		this.addGCP2ExpandedProductCardsPalette();
		this.addGCP2ProductCardsPalette();
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
			this.createEdgeTemplateEntry(s + 'strokeColor=#EA4335;dashed=0;', 100, 0, '', 'Failure Status', null, dt + 'failure status'),
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
		var s = 'rounded=1;absoluteArcSize=1;arcSize=2;html=1;strokeColor=none;gradientColor=none;shadow=0;dashed=0;fontSize=12;fontColor=#9E9E9E;align=left;verticalAlign=top;spacing=10;spacingTop=-4;';
		var dt = 'gcp google cloud platform zone ';
		var gn = 'mxgraph.gcp2.zones';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(s + 'fillColor=#ffffff;', 
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
		    this.createVertexTemplateEntry('fillColor=#ffffff;strokeColor=none;shadow=0;gradientColor=none;fontSize=11;align=left;spacing=10;fontColor=#;9E9E9E;verticalAlign=top;spacingTop=100;',
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
				s = 'shape=ellipse;fillColor=#ffffff;strokeColor=#BDBDBD;strokeWidth=2;shadow=0;gradientColor=none;fontColor=#757575;align=center;html=1;fontStyle=1;spacingTop=-1;';
				
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
	    			'fillColor=#ffffff;strokeColor=#BDBDBD;strokeWidth=1;shadow=0;gradientColor=none;');
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
			}),

	 	];
		
		this.addPalette('gcp2Zones', 'GCP / Zones', false, mxUtils.bind(this, function(content)
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
			    var bg = new mxCell('Blank One Line', new mxGeometry(0, 0, 100, 44), 'dashed=0;strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;labelPosition=center;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#000000;fontSize=12;');
		    	bg.vertex = true;
		    	
			   	return sb.createVertexTemplateFromCells([bg], 100, 44, 'Blank One Line');
			})
		);

		this.addGCP2ServiceCard('Blank Two\n\& Three Line', 'blank', 120, 44, dt + 'blank two and three line', fns);

		fns.push(
			this.addEntry(dt + 'blank two and three line', function()
		   	{
			    var bg = new mxCell('Blank Two\n\& Three Line', new mxGeometry(0, 0, 90, 44), 'dashed=0;strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;labelPosition=center;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#000000;fontSize=12;');
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
		
		this.addGCP2CardSet('Compute\nEngine', 'compute_engine', 110, 160, dt + 'compute engine', fns);
		this.addGCP2CardSet('GPU', 'gpu', 90, 100, dt + 'gpu graphics processing unit', fns);
		this.addGCP2CardSet('App\nEngine', 'app_engine', 100, 130, dt + 'app engine application', fns);
		this.addGCP2CardSet('Cloud\nFunctions', 'cloud_functions', 120, 150, dt + 'functions', fns);
		this.addGCP2CardSet('Kubernetes\nEngine', 'container_engine', 130, 170, dt + 'kubernetes engine', fns);
		this.addGCP2CardSet('Container-\nOptimized OS', 'container_optimized_os', 140, 200, dt + 'container optimized os operating system', fns);

		this.addPalette('gcp2Compute', 'GCP / Compute', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2APIPlatformEcosystemsPalette = function()
	{
		var dt = 'gcp google cloud platform api ecosystems ';
		var fns = [];
		
		this.addGCP2CardSet('API\nAnalytics', 'api_analytics', 110, 140, dt + 'api analytics application programming interface', fns);
		this.addGCP2CardSet('Apigee\nSense', 'apigee_sense', 100, 140, dt + 'apigee sense', fns);
		this.addGCP2CardSet('API\nMonetization', 'api_monetization', 130, 160, dt + 'api monetization application programming interface', fns);
		this.addGCP2CardSet('Cloud\nEndpoints', 'cloud_endpoints', 120, 150, dt + 'cloud endpoints', fns);
		this.addGCP2CardSet('Apigee API\nPlatform', 'apigee_api_platform', 130, 170, dt + 'apigee api platform application programming interface', fns);
		this.addGCP2CardSet('Developer\nPortal', 'developer_portal', 120, 160, dt + 'developer portal', fns);

		this.addPalette('gcp2API Platform and Ecosystems', 'GCP / API Platform and Ecosystems', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2IdentitySecurityPalette = function()
	{
		var dt = 'gcp google cloud platform identity security ';
		var fns = [];
		
		this.addGCP2CardSet('Cloud\nIAM', 'cloud_iam', 100, 120, dt + 'cloud iam', fns);
		this.addGCP2CardSet('BeyondCorp', 'beyondcorp', 130, 130, dt + 'beyondcorp', fns);
		this.addGCP2CardSet('Cloud Resource\nManager', 'cloud_iam', 150, 200, dt + 'cloud resource manager', fns);
		this.addGCP2CardSet('Data Loss\nPrevention API', 'data_loss_prevention_api', 140, 200, dt + 'data loss prevention api application programming interface', fns);
		this.addGCP2CardSet('Cloud Security\nScanner', 'cloud_security_scanner', 140, 190, dt + 'cloud security scanner', fns);
		this.addGCP2CardSet('Key Management\nService', 'key_management_service', 160, 200, dt + 'key management service', fns);
		this.addGCP2CardSet('Identity-Aware\nProxy', 'identity_aware_proxy', 140, 180, dt + 'identity aware proxy', fns);
		this.addGCP2CardSet('Security Key\nEnforcement', 'security_key_enforcement', 130, 200, dt + 'security key enforcement', fns);
		
		this.addPalette('gcp2Identity and Security', 'GCP / Identity and Security', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGCP2BigDataPalette = function()
	{
		var dt = 'gcp google cloud platform big data ';
		var fns = [];
		
		this.addGCP2CardSet('BigQuery', 'bigquery', 120, 120, dt + 'bigquery', fns);
		this.addGCP2CardSet('Cloud\nDatalab', 'cloud_datalab', 110, 140, dt + 'datalab', fns);
		this.addGCP2CardSet('Cloud\nDataflow', 'cloud_dataflow', 110, 150, dt + 'dataflow', fns);
		this.addGCP2CardSet('Cloud\nPub/Sub', 'cloud_pubsub', 110, 150, dt + 'pub sub', fns);
		this.addGCP2CardSet('Cloud\nDataproc', 'cloud_dataproc', 110, 150, dt + 'dataproc', fns);
		this.addGCP2CardSet('Genomics', 'genomics', 120, 120, dt + 'genomics', fns);
		this.addGCP2CardSet('Cloud\nDataprep', 'cloud_dataprep', 110, 150, dt + 'dataprep', fns);
		this.addGCP2CardSet('Data\nStudio', 'data_studio', 100, 130, dt + 'data studio', fns);

		this.addPalette('gcp2Big Data', 'GCP / Big Data', false, mxUtils.bind(this, function(content)
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
		
		this.addGCP2CardSet('Transfer\nAppliance', 'transfer_appliance', 120, 170, dt + 'appliance', fns);

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
		
		this.addGCP2CardSet('Cloud Machine\nLearning', 'cloud_machine_learning', 150, 200, dt + 'cloud machine learning', fns);
		this.addGCP2CardSet('Natural\nLanguage API', 'cloud_natural_language_api', 140, 180, dt + 'natural language api application programming interface', fns);
		this.addGCP2CardSet('Vision\nAPI', 'cloud_vision_api', 100, 120, dt + 'vision api application programming interface', fns);
		this.addGCP2CardSet('Translation\nAPI', 'cloud_translation_api', 120, 150, dt + 'translation api application programming interface', fns);
		this.addGCP2CardSet('Speech\nAPI', 'cloud_speech_api', 110, 130, dt + 'speech api application programming interface', fns);
		this.addGCP2CardSet('Jobs\nAPI', 'cloud_jobs_api', 90, 110, dt + 'jobs api application programming interface', fns);
		this.addGCP2CardSet('Cloud Video\nIntelligence API', 'cloud_video_intelligence_api', 150, 220, dt + 'cloud video intelligence api application programming interface', fns);
		this.addGCP2CardSet('Advanced\nSolutions Lab', 'advanced_solutions_lab', 140, 200, dt + 'advanced solutions lab', fns);

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
		
		this.addGCP2CardSet('Cloud\nIoT Core', 'cloud_iot_core', 110, 150, dt + 'core', fns);

		this.addPalette('gcp2Internet of Things', 'GCP / Internet of Things', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGCP2StorageDatabasesPalette = function()
	{
		var dt = 'gcp google cloud platform storage databases ';
		var fns = [];
		
		this.addGCP2CardSet('Cloud\nStorage', 'cloud_storage', 110, 140, dt, fns);
		this.addGCP2CardSet('Cloud\nSQL', 'cloud_sql', 100, 120, dt + 'sql', fns);
		this.addGCP2CardSet('Cloud\nBigtable', 'cloud_bigtable', 110, 140, dt + 'bigtable', fns);
		this.addGCP2CardSet('Cloud\nSpanner', 'cloud_spanner', 110, 150, dt + 'spanner', fns);
		this.addGCP2CardSet('Cloud\nDatastore', 'cloud_datastore', 120, 150, dt + 'datastore', fns);
		this.addGCP2CardSet('Persistent\nDisk', 'persistent_disk', 120, 150, dt + 'persistent disk', fns);
		this.addGCP2CardSet('Cloud\nMemorystore', 'cloud_memorystore', 140, 170, dt + 'memorystore', fns);
		this.addGCP2CardSet('Cloud\nFilestore', 'cloud_filestore', 110, 150, dt + 'filestore', fns);

		this.addPalette('gcp2Storage and Databases', 'GCP / Storage and Databases', false, mxUtils.bind(this, function(content)
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
		
		this.addGCP2CardSet('Stackdriver', 'stackdriver', 130, 130, dt + 'stackdriver', fns);
		this.addGCP2CardSet('Debugger', 'debugger', 120, 120, dt + 'debugger', fns);
		this.addGCP2CardSet('Monitoring', 'cloud_deployment_manager', 120, 120, dt + 'monitoring', fns);
		this.addGCP2CardSet('Deployment\nManager', 'cloud_deployment_manager', 130, 180, dt + 'deployment manager', fns);
		this.addGCP2CardSet('Logging', 'logging', 110, 110, dt + 'logging', fns);
		this.addGCP2CardSet('Cloud\nConsole', 'placeholder', 110, 140, dt + 'console', fns);
		this.addGCP2CardSet('Error\nReporting', 'error_reporting', 120, 150, dt + 'error reporting', fns);
		this.addGCP2CardSet('Cloud\nShell', 'placeholder', 100, 130, dt + 'shell', fns);
		this.addGCP2CardSet('Trace', 'trace', 100, 100, dt + 'trace', fns);
		this.addGCP2CardSet('Cloud\nMobile App', 'placeholder', 130, 160, dt + 'mobile app', fns);
		this.addGCP2CardSet('Profiler', 'profiler', 110, 110, dt + 'profiler', fns);
		this.addGCP2CardSet('Billing\nAPI', 'placeholder', 100, 120, dt + 'billing api application programming interface', fns);
		this.addGCP2CardSet('Cloud\nAPIs', 'cloud_apis', 100, 130, dt + 'api application programming interface', fns);

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
		
		this.addGCP2CardSet('Virtual\nPrivate Cloud', 'virtual_private_cloud', 140, 180, dt + 'virtual private', fns);
		this.addGCP2CardSet('Dedicated\nInterconnect', 'dedicated_interconnect', 130, 190, dt + 'dedicated interconnect', fns);
		this.addGCP2CardSet('Cloud Load\nBalancing', 'cloud_load_balancing', 130, 180, dt + 'load balancing', fns);
		this.addGCP2CardSet('Cloud \nDNS', 'cloud_dns', 100, 130, dt + 'dns domain name server', fns);
		this.addGCP2CardSet('Cloud \nCDN', 'cloud_cdn', 100, 130, dt + 'cdn content delivery network', fns);
		this.addGCP2CardSet('Cloud\nNetwork', 'cloud_network', 110, 140, dt + 'network', fns);
		this.addGCP2CardSet('Cloud External\nIP Addresses', 'cloud_external_ip_addresses', 150, 220, dt + 'external ip addresses internet protocol', fns);
		this.addGCP2CardSet('Cloud\nRoutes', 'cloud_routes', 100, 140, dt + 'routes', fns);
		this.addGCP2CardSet('Cloud\nFirewall Rules', 'cloud_firewall_rules', 140, 170, dt + 'firewall rules', fns);
		this.addGCP2CardSet('Cloud\nVPN', 'cloud_vpn', 100, 120, dt + 'vpn virtual private network', fns);
		this.addGCP2CardSet('Cloud\nRouter', 'cloud_router', 100, 140, dt + 'router', fns);
		this.addGCP2CardSet('Cloud\nArmor', 'cloud_armor', 100, 130, dt + 'armor', fns);
		this.addGCP2CardSet('Standard\nNetwork Tier', 'standard_network_tier', 130, 180, dt + 'standard network tier', fns);
		this.addGCP2CardSet('Premium\nNetwork Tier', 'premium_network_tier', 130, 180, dt + 'premium network tier', fns);
		this.addGCP2CardSet('Partner\nInterconnect', 'partner_interconnect', 130, 180, dt + 'partner interconnect', fns);

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
		
		this.addGCP2CardSet('Cloud\nSDK', 'placeholder', 100, 120, dt + 'sdk software development kit', fns);
		this.addGCP2CardSet('Cloud\nBuild', 'container_builder', 100, 130, dt + 'build', fns);
		this.addGCP2CardSet('Deployment\nManager', 'cloud_deployment_manager', 130, 180, dt + 'deployment manager', fns);
		this.addGCP2CardSet('Cloud Tools for\nVisual Studio', 'cloud_tools_for_powershell', 150, 220, dt + 'tools for visual studio', fns);
		this.addGCP2CardSet('Cloud Source\nRepositories', 'placeholder', 140, 210, dt + 'cloud source repositories', fns);
		this.addGCP2CardSet('Maven App\nEngine Plugin', 'placeholder', 140, 200, dt + 'maven app engine plugin', fns);
		this.addGCP2CardSet('Cloud Tools\nfor Eclipse', 'placeholder', 130, 190, dt + 'tools for eclipse', fns);
		this.addGCP2CardSet('Cloud Tools\nfor IntelliJ', 'placeholder', 130, 180, dt + 'tools for intellij', fns);
		this.addGCP2CardSet('Cloud\nTest Lab', 'placeholder', 110, 150, dt + 'test lab', fns);
		this.addGCP2CardSet('Cloud Tools for\nPowerShell', 'cloud_tools_for_powershell', 150, 210, dt + 'tools for powershell', fns);
		this.addGCP2CardSet('IDE Plugins', 'cloud_tools_for_powershell', 130, 130, dt + 'ide plugins integrated development environment', fns);
		this.addGCP2CardSet('Container\nRegistry', 'container_registry', 120, 160, dt + 'container registry', fns);
		this.addGCP2CardSet('Gradle App\nEnginge Plugin', 'placeholder', 150, 210, dt + 'gradle app engine plugin application', fns);

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
		var dt = 'gcp google cloud platform expanded product cards ';
		var fns = [];
		
		this.addGCP2ExpandedProductCardSet('Compute Engine', 'compute_engine', 150, dt + 'compute engine', fns);
		this.addGCP2ExpandedProductCardSet('BigQuery', 'bigquery', 140, dt + 'bigquery', fns);
		this.addGCP2ExpandedProductCardSet('App Engine', 'app_engine', 140, dt + 'app application engine', fns);
		this.addGCP2ExpandedProductCardSet('Cloud Dataflow', 'cloud_dataflow', 150, dt + 'cloud dataflow', fns);
		this.addGCP2ExpandedProductCardSet('Kubernetes Engine', 'container_engine', 170, dt + 'kubernetes engine', fns);
		this.addGCP2ExpandedProductCardSet('Cloud Storage', 'cloud_storage', 140, dt + 'cloud storage', fns);
		this.addGCP2ExpandedProductCardSet('Cloud Bigtable', 'cloud_bigtable', 140, dt + 'cloud bigtable', fns);
		this.addGCP2ExpandedProductCardSet('Cloud Pub/Sub', 'cloud_pubsub', 150, dt + 'cloud pub sub', fns);
		this.addGCP2ExpandedProductCardSet('Cloud SQL', 'cloud_sql', 140, dt + 'cloud sql', fns);

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
	
	
	
	Sidebar.prototype.addGCP2CardSet = function(label, icon, w1, w2, dt, fns)
	{
		var sb = this;
		var s = 'dashed=0;connectable=0;html=1;fillColor=#5184F3;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w1, 60), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
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
			    var bg = new mxCell('', new mxGeometry(0, 0, w2, 60), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
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
			    var bg = new mxCell('', new mxGeometry(0, 0, w2 + 8, 68), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;');
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
		var s = 'dashed=0;connectable=0;html=1;fillColor=#5184F3;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w1, 60), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
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
			    var bg = new mxCell('', new mxGeometry(0, 0, w2, 60), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
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
			    var bg = new mxCell('', new mxGeometry(0, 0, w2 + 8, 68), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;');
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
		var s = 'dashed=0;connectable=0;html=1;fillColor=#757575;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w, h), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
		    	bg.vertex = true;
			    var icon1 = new mxCell(label, new mxGeometry(0, 0.5, 32, 32), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#000000;fontSize=12;');
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
		var s = 'dashed=0;connectable=0;html=1;fillColor=#5184F3;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w, 70), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
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
			    var bg = new mxCell('', new mxGeometry(0, 0, w + 8, 78), 'shape=mxgraph.gcp2.doubleRect;strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;');
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
		var s = 'dashed=0;connectable=0;html=1;fillColor=#757575;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w, 95), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
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
			    		new mxGeometry(0, 0, 18, 18), 'rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
			    machineNum1Cell.geometry.relative = true;
			    machineNum1Cell.geometry.offset = new mxPoint(24, 69);
			    machineNum1Cell.vertex = true;
		    	bg.insert(machineNum1Cell);
			    
			    var machineNum2Cell = new mxCell(machineNum2, 
			    		new mxGeometry(0, 0, 18, 18), 'rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
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
			    		new mxGeometry(0, 0, 18, 18), 'rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
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
				    var bg = new mxCell('', new mxGeometry(0, 0, w, 95), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;');
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
				    		new mxGeometry(0, 0, 18, 18), 'connectable=0;rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
				    machineNum1Cell.geometry.relative = true;
				    machineNum1Cell.geometry.offset = new mxPoint(24, 69);
				    machineNum1Cell.vertex = true;
			    	bg.insert(machineNum1Cell);
				    
				    var machineNum2Cell = new mxCell(machineNum2, 
				    		new mxGeometry(0, 0, 18, 18), 'connectable=0;rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
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
				    		new mxGeometry(0, 0, 25, 18), 'connectable=0;rounded=1;arcSize=50;part=1;fillColor=#3B8CF0;strokeColor=none;html=1;fontColor=#ffffff;spacingTop=-2;');
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
		var s = 'dashed=0;connectable=0;html=1;fillColor=#757575;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell(label, new mxGeometry(0, 0, 70, 85  + h1), 
			    		'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;rounded=1;absoluteArcSize=1;arcSize=2;labelPosition=center;verticalLabelPosition=middle;align=center;verticalAlign=bottom;spacingLeft=0;fontColor=#999999;fontSize=12;whiteSpace=wrap;spacingBottom=2;');
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
