(function()
{
	Sidebar.prototype.addGCP2Palette = function()
	{
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
	};
	
	Sidebar.prototype.addGCP2ComputePalette = function()
	{
		var dt = 'gcp google cloud platform compute';
		var fns = [];
		
		this.addGCP2CardSet('Compute\nEngine', 'compute_engine', 120, 160, dt + 'compute engine', fns);
		this.addGCP2CardSet('GPU', 'gpu', 100, 110, dt + 'gpu graphics processing unit', fns);
		this.addGCP2CardSet('App\nEngine', 'app_engine', 110, 130, dt + 'app engine application', fns);
		this.addGCP2CardSet('Cloud\nFunctions', 'cloud_functions', 130, 160, dt + 'functions', fns);
		this.addGCP2CardSet('Kubernetes\nEngine', 'container_engine', 130, 180, dt + 'kubernetes engine', fns);
		this.addGCP2CardSet('Container-\nOptimized OS', 'container_optimized_os', 150, 200, dt + 'container optimized os operating system', fns);

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
		var dt = 'gcp google cloud platform api ecosystems';
		var fns = [];
		
		this.addGCP2CardSet('API\nAnalytics', 'api_analytics', 120, 150, dt + 'api analytics application programming interface', fns);
		this.addGCP2CardSet('Apigee\nSense', 'apigee_sense', 110, 150, dt + 'apigee sense', fns);
		this.addGCP2CardSet('API\nMonetization', 'api_monetization', 140, 170, dt + 'api monetization application programming interface', fns);
		this.addGCP2CardSet('Cloud\nEndpoints', 'cloud_endpoints', 130, 160, dt + 'cloud endpoints', fns);
		this.addGCP2CardSet('Apigee API\nPlatform', 'apigee_api_platform', 130, 180, dt + 'apigee api platform application programming interface', fns);
		this.addGCP2CardSet('Developer\nPortal', 'developer_portal', 130, 160, dt + 'developer portal', fns);

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
		var dt = 'gcp google cloud platform identity security';
		var fns = [];
		
		this.addGCP2CardSet('Cloud\nIAM', 'cloud_iam', 100, 130, dt + 'cloud iam', fns);
		this.addGCP2CardSet('BeyondCorp', 'beyondcorp', 140, 140, dt + 'beyondcorp', fns);
		this.addGCP2CardSet('Cloud Resource\nManager', 'cloud_iam', 160, 210, dt + 'cloud resource manager', fns);
		this.addGCP2CardSet('Data Loss\nPrevention API', 'data_loss_prevention_api', 150, 210, dt + 'data loss prevention api application programming interface', fns);
		this.addGCP2CardSet('Cloud Security\nScanner', 'cloud_security_scanner', 150, 200, dt + 'cloud security scanner', fns);
		this.addGCP2CardSet('Key Management\nService', 'key_management_service', 170, 210, dt + 'key management service', fns);
		this.addGCP2CardSet('Identity-Aware\nProxy', 'identity_aware_proxy', 150, 190, dt + 'identity aware proxy', fns);
		this.addGCP2CardSet('Security Key\nEnforcement', 'security_key_enforcement', 150, 210, dt + 'security key enforcement', fns);
		
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
		var dt = 'gcp google cloud platform big data';
		var fns = [];
		
		this.addGCP2CardSet('BigQuery', 'bigquery', 120, 130, dt + 'bigquery', fns);
		this.addGCP2CardSet('Cloud\nDatalab', 'cloud_datalab', 110, 150, dt + 'datalab', fns);
		this.addGCP2CardSet('Cloud\nDataflow', 'cloud_dataflow', 120, 150, dt + 'dataflow', fns);
		this.addGCP2CardSet('Cloud\nPub/Sub', 'cloud_pubsub', 120, 150, dt + 'pub sub', fns);
		this.addGCP2CardSet('Cloud\nDataproc', 'cloud_dataproc', 120, 160, dt + 'dataproc', fns);
		this.addGCP2CardSet('Genomics', 'genomics', 130, 130, dt + 'genomics', fns);
		this.addGCP2CardSet('Cloud\nDataprep', 'cloud_dataprep', 120, 160, dt + 'dataprep', fns);
		this.addGCP2CardSet('Data\nStudio', 'data_studio', 110, 140, dt + 'data studio', fns);

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
		var dt = 'gcp google cloud platform data transfer';
		var fns = [];
		
		this.addGCP2CardSet('Transfer\nAppliance', 'transfer_appliance', 120, 170, dt + 'transfer appliance', fns);

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
		var dt = 'gcp google cloud platform ai artificial intelligence';
		var fns = [];
		
		this.addGCP2CardSet('Cloud Machine\nLearning', 'cloud_machine_learning', 150, 200, dt + 'cloud machine learning', fns);
		this.addGCP2CardSet('Natural\nLanguage API', 'cloud_natural_language_api', 150, 190, dt + 'natural language api application programming interface', fns);
		this.addGCP2CardSet('Vision\nAPI', 'cloud_vision_api', 110, 130, dt + 'vision api application programming interface', fns);
		this.addGCP2CardSet('Translation\nAPI', 'cloud_translation_api', 130, 150, dt + 'translation api application programming interface', fns);
		this.addGCP2CardSet('Speech\nAPI', 'cloud_speech_api', 110, 140, dt + 'speech api application programming interface', fns);
		this.addGCP2CardSet('Jobs\nAPI', 'cloud_jobs_api', 100, 120, dt + 'jobs api application programming interface', fns);
		this.addGCP2CardSet('Cloud Video\nIntelligence API', 'cloud_video_intelligence_api', 160, 230, dt + 'cloud video intelligence api application programming interface', fns);
		this.addGCP2CardSet('Advanced\nSolutions Lab', 'advanced_solutions_lab', 150, 200, dt + 'advanced solutions lab', fns);

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
		var dt = 'gcp google cloud platform iot internet of things';
		var fns = [];
		
		this.addGCP2CardSet('Cloud\nIoT Core', 'cloud_iot_core', 120, 160, dt + 'core', fns);

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
		var dt = 'gcp google cloud platform storage databases';
		var fns = [];
		
		this.addGCP2CardSet('Cloud\nStorage', 'cloud_storage', 110, 150, dt, fns);
		this.addGCP2CardSet('Cloud\nSQL', 'cloud_sql', 100, 130, dt + 'sql', fns);
		this.addGCP2CardSet('Cloud\nBigtable', 'cloud_bigtable', 120, 150, dt + 'bigtable', fns);
		this.addGCP2CardSet('Cloud\nSpanner', 'cloud_spanner', 120, 150, dt + 'spanner', fns);
		this.addGCP2CardSet('Cloud\nDatastore', 'cloud_datastore', 120, 160, dt + 'datastore', fns);
		this.addGCP2CardSet('Persistent\nDisk', 'persistent_disk', 130, 150, dt + 'persistent disk', fns);
		this.addGCP2CardSet('Cloud\nMemorystore', 'cloud_memorystore', 140, 180, dt + 'memorystore', fns);
		this.addGCP2CardSet('Cloud\nFilestore', 'cloud_filestore', 120, 150, dt + 'filestore', fns);

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
		var dt = 'gcp google cloud platform management tools';
		var fns = [];
		
		this.addGCP2CardSet('Stackdriver', 'stackdriver', 130, 130, dt + 'stackdriver', fns);
		this.addGCP2CardSet('Debugger', 'debugger', 130, 130, dt + 'debugger', fns);
		this.addGCP2CardSet('Monitoring', 'cloud_deployment_manager', 130, 130, dt + 'monitoring', fns);
		this.addGCP2CardSet('Deployment\nManager', 'cloud_deployment_manager', 140, 190, dt + 'deployment manager', fns);
		this.addGCP2CardSet('Logging', 'logging', 120, 120, dt + 'logging', fns);
		this.addGCP2CardSet('Cloud\nConsole', 'placeholder', 120, 150, dt + 'console', fns);
		this.addGCP2CardSet('Error\nReporting', 'error_reporting', 120, 150, dt + 'error reporting', fns);
		this.addGCP2CardSet('Cloud\nShell', 'placeholder', 110, 140, dt + 'shell', fns);
		this.addGCP2CardSet('Trace', 'trace', 100, 110, dt + 'trace', fns);
		this.addGCP2CardSet('Cloud\nMobile App', 'placeholder', 130, 170, dt + 'mobile app', fns);
		this.addGCP2CardSet('Profiler', 'profiler', 110, 110, dt + 'profiler', fns);
		this.addGCP2CardSet('Billing\nAPI', 'placeholder', 100, 130, dt + 'billing api application programming interface', fns);
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
		var dt = 'gcp google cloud platform networking';
		var fns = [];
		
		this.addGCP2CardSet('Virtual\nPrivate Cloud', 'virtual_private_cloud', 140, 180, dt + 'virtual private', fns);
		this.addGCP2CardSet('Dedicated\nInterconnect', 'dedicated_interconnect', 140, 200, dt + 'dedicated interconnect', fns);
		this.addGCP2CardSet('Cloud Load\nBalancing', 'cloud_load_balancing', 130, 190, dt + 'load balancing', fns);
		this.addGCP2CardSet('Cloud \nDNS', 'cloud_dns', 110, 130, dt + 'dns domain name server', fns);
		this.addGCP2CardSet('Cloud \nCDN', 'cloud_cdn', 100, 130, dt + 'cdn content delivery network', fns);
		this.addGCP2CardSet('Cloud\nNetwork', 'cloud_network', 120, 150, dt + 'network', fns);
		this.addGCP2CardSet('Cloud External\nIP Addresses', 'cloud_external_ip_addresses', 150, 230, dt + 'external ip addresses internet protocol', fns);
		this.addGCP2CardSet('Cloud\nRoutes', 'cloud_routes', 110, 150, dt + 'routes', fns);
		this.addGCP2CardSet('Cloud\nFirewall Rules', 'cloud_firewall_rules', 150, 180, dt + 'firewall rules', fns);
		this.addGCP2CardSet('Cloud\nVPN', 'cloud_vpn', 100, 130, dt + 'vpn virtual private network', fns);
		this.addGCP2CardSet('Cloud\nRouter', 'cloud_router', 110, 140, dt + 'router', fns);
		this.addGCP2CardSet('Cloud\nArmor', 'cloud_armor', 110, 140, dt + 'armor', fns);
		this.addGCP2CardSet('Standard\nNetwork Tier', 'standard_network_tier', 140, 190, dt + 'standard network tier', fns);
		this.addGCP2CardSet('Premium\nNetwork Tier', 'premium_network_tier', 140, 190, dt + 'premium network tier', fns);
		this.addGCP2CardSet('Partner\nInterconnect', 'partner_interconnect', 140, 180, dt + 'partner interconnect', fns);

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
		var dt = 'gcp google cloud platform dev developer tools';
		var fns = [];
		
		this.addGCP2CardSet('Cloud\nSDK', 'placeholder', 100, 130, dt + 'sdk software development kit', fns);
		this.addGCP2CardSet('Cloud\nBuild', 'container_builder', 100, 130, dt + 'build', fns);
		this.addGCP2CardSet('Deployment\nManager', 'cloud_deployment_manager', 140, 190, dt + 'deployment manager', fns);
		this.addGCP2CardSet('Cloud Tools for\nVisual Studio', 'cloud_tools_for_powershell', 150, 230, dt + 'tools for visual studio', fns);
		this.addGCP2CardSet('Cloud Source\nRepositories', 'placeholder', 140, 210, dt + 'cloud source repositories', fns);
		this.addGCP2CardSet('Maven App\nEngine Plugin', 'placeholder', 150, 210, dt + 'maven app engine plugin', fns);
		this.addGCP2CardSet('Cloud Tools\nfor Eclipse', 'placeholder', 150, 210, dt + 'tools for eclipse', fns);
		this.addGCP2CardSet('Cloud Tools\nfor IntelliJ', 'placeholder', 140, 190, dt + 'tools for intellij', fns);
		this.addGCP2CardSet('Cloud\nTest Lab', 'placeholder', 120, 150, dt + 'test lab', fns);
		this.addGCP2CardSet('Cloud Tools for\nPowerShell', 'cloud_tools_for_powershell', 150, 220, dt + 'tools for powershell', fns);
		this.addGCP2CardSet('IDE Plugins', 'cloud_tools_for_powershell', 140, 140, dt + 'ide plugins integrated development environment', fns);
		this.addGCP2CardSet('Container\nRegistry', 'container_registry', 120, 170, dt + 'container registry', fns);
		this.addGCP2CardSet('Gradle App\nEnginge Plugin', 'placeholder', 150, 220, dt + 'gradle app engine plugin application', fns);

		this.addPalette('gcp2Developer Tools', 'GCP / Developer Tools', false, mxUtils.bind(this, function(content)
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
		var s = 'dashed=0;html=1;fillColor=#5184F3;strokeColor=none;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp2.';
		var gn = 'mxgraph.gcp2';
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');
		

		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w1, 60), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell(label, new mxGeometry(0, 0.5, 50, 44), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#999999;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, -22);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})
		);
		
		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg = new mxCell('', new mxGeometry(0, 0, w2, 60), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;');
		    	bg.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>' + label1, new mxGeometry(0, 0.5, 50, 44), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#999999;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, -22);
		    	icon1.vertex = true;
		    	bg.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label1);
			})			
		);
			
		fns.push(
			this.addEntry(dt, function()
		   	{
			    var bg1 = new mxCell('', new mxGeometry(8, 5, w2, 60), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;');
		    	bg1.vertex = true;
			    var bg2 = new mxCell('', new mxGeometry(0, 0, w2, 60), 'strokeColor=#dddddd;fillColor=#ffffff;shadow=1;strokeWidth=1;');
		    	bg2.vertex = true;
			    var icon1 = new mxCell('<font color="#000000">Name</font><br>' + label1, new mxGeometry(0, 0.5, 50, 44), s + icon + ';part=1;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=5;fontColor=#999999;fontSize=12;');
			    icon1.geometry.relative = true;
			    icon1.geometry.offset = new mxPoint(5, -22);
		    	icon1.vertex = true;
		    	bg2.insert(icon1);
		    	
			   	return sb.createVertexTemplateFromCells([bg1, bg2], bg1.geometry.width + 8, bg1.geometry.height + 5, label1);
			})
		);
		
	};
	
	
	

})();
