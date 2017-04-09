(function()
{
	// Adds MSCAE shapes
	Sidebar.prototype.addMSCAEPalette = function()
	{
		this.addMSCAEGeneralPalette();
		this.addMSCAECloudPalette();
		this.addMSCAEEnterprisePalette();
		this.addMSCAEIntunePalette();
		this.addMSCAEOtherPalette();
		this.addMSCAESystemCenterPalette();
		this.addMSCAEDeprecatedPalette();
	};
	
	Sidebar.prototype.addMSCAECloudPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;fillColor=#0079D6;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.mscae.cloud.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.cloud';
		var dt = 'ms microsoft cloud enterprise ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'access_control;',
					50, 50, '', 'Access Control', null, null, this.getTagsForStencil(gn, 'access control', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'api_app;fillColor=#0079D6;',
					45, 50, '', 'API App', null, null, this.getTagsForStencil(gn, 'api app', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'api_management;fillColor=#0079D6;',
					50, 45, '', 'API Management', null, null, this.getTagsForStencil(gn, 'api management', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'app_service;fillColor=#0079D6;',
					50, 50, '', 'App Service', null, null, this.getTagsForStencil(gn, 'app application service', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_insights;fillColor=#0079D6;',
					32, 50, '', 'Application Insights', null, null, this.getTagsForStencil(gn, 'application insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'autoscale;',
					50, 30, '', 'Autoscaling', null, null, this.getTagsForStencil(gn, 'autoscaling autoscale', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_automatic_load_balancer;fillColor=#0079D6;',
					50, 33, '', 'Azure Automatic Load Balancer', null, null, this.getTagsForStencil(gn, 'automatic load balancer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_active_directory;',
					47, 50, '', 'Azure Active Directory', null, null, this.getTagsForStencil(gn, 'azure active directory', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_alert;',
					50, 42, '', 'Azure Alert', null, null, this.getTagsForStencil(gn, 'azure alert', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'automation;',
					50, 45, '', 'Azure Automation', null, null, this.getTagsForStencil(gn, 'azure automation', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_batch;fillColor=#0079D6;',
					47, 40, '', 'Azure Batch', null, null, this.getTagsForStencil(gn, 'batch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_cache;',
					45, 50, '', 'Azure Cache including Redis', null, null, this.getTagsForStencil(gn, 'azure cache including redis', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'certificate;',
					50, 40, '', 'Azure Certificate', null, null, this.getTagsForStencil(gn, 'azure certificate', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_dns;fillColor=#0079D6;',
					50, 50, '', 'Azure DNS', null, null, this.getTagsForStencil(gn, 'dns', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_files_service;fillColor=#0079D6;',
					50, 43, '', 'Azure Files Service', null, null, this.getTagsForStencil(gn, 'files service', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_load_balancer_feature;fillColor=#0079D6;',
					50, 50, '', 'Azure Load Balancer (feature)', null, null, this.getTagsForStencil(gn, 'load balancer feature', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_marketplace;',
					40, 50, '', 'Azure Marketplace', null, null, this.getTagsForStencil(gn, 'azure marketplace', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_rights_management_rms;fillColor=#0079D6;',
					40, 50, '', 'Azure Rights Management (RMS)', null, null, this.getTagsForStencil(gn, 'rights management rms', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_sdk;',
					50, 47, '', 'Azure SDK', null, null, this.getTagsForStencil(gn, 'azure sdk software development kit', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_search;fillColor=#0079D6;',
					50, 35, '', 'Azure Search', null, null, this.getTagsForStencil(gn, 'search', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_database_sql_azure;',
					47, 50, '', 'Azure SQL Database', null, null, this.getTagsForStencil(gn, 'azure sql database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_subscription;',
					50, 35, '', 'Azure Subscription', null, null, this.getTagsForStencil(gn, 'azure subscription', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_storage;fillColor=#0079D6;',
					50, 43, '', 'Azure Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'backup_service;',
					50, 45, '', 'Backup Service', null, null, this.getTagsForStencil(gn, 'backup service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bitbucket_code_source;',
					42, 50, '', 'Bitbucket Code Source', null, null, this.getTagsForStencil(gn, 'bitbucket code source', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'biztalk_services;',
					50, 50, '', 'Biztalk Services', null, null, this.getTagsForStencil(gn, 'biztalk services', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cloud_office_365;fillColor=#DF3C01;',
					50, 30, '', 'Cloud Office 365', null, null, this.getTagsForStencil(gn, 'cloud office 365', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud_service;',
					50, 40, '', 'Cloud Service', null, null, this.getTagsForStencil(gn, 'cloud service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'codeplex_code_source;',
					50, 37, '', 'CodePlex', null, null, this.getTagsForStencil(gn, 'codeplex', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'content_delivery_network;',
					50, 32, '', 'Content Delivery Network', null, null, this.getTagsForStencil(gn, 'content delivery network', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_factory;fillColor=#0079D6;',
					47, 47, '', 'Data Factory', null, null, this.getTagsForStencil(gn, 'data factory', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'documentdb;fillColor=#0079D6;',
					38, 50, '', 'DocumentDB', null, null, this.getTagsForStencil(gn, 'documentdb document db database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'dropbox_code_source;',
					50, 47, '', 'Dropbox Code Source', null, null, this.getTagsForStencil(gn, 'dropbox code source', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'event_hubs;fillColor=#0079D6;',
					46, 47, '', 'Event Hubs', null, null, this.getTagsForStencil(gn, 'event_hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'express_route;',
					50, 30, '', 'Express Route', null, null, this.getTagsForStencil(gn, 'express route', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'git_repository;',
					50, 50, '', 'Git Repository', null, null, this.getTagsForStencil(gn, 'git repository', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'github_code;',
					50, 50, '', 'GitHub', null, null, this.getTagsForStencil(gn, 'github code', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'hdinsight;fillColor=#0079D6;',
					50, 36, '', 'HDInsight', null, null, this.getTagsForStencil(gn, 'hdisight hd insight', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'health_monitoring;',
					50, 42, '', 'Health Monitoring', null, null, this.getTagsForStencil(gn, 'health monitoring', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'healthy;',
					50, 45, '', 'Healthy', null, null, this.getTagsForStencil(gn, 'healthy', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'hybrid_connection_manager;fillColor=#0079D6;',
					50, 35, '', 'Hybrid Connection Manager', null, null, this.getTagsForStencil(gn, 'hybrid connection manager', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'hybrid_connections;fillColor=#0079D6;',
					47, 50, '', 'Hybrid Connections', null, null, this.getTagsForStencil(gn, 'hybrid connections', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'iot;fillColor=#0079D6;',
					47, 47, '', 'IoT', null, null, this.getTagsForStencil(gn, 'iot internet of things', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'key_vault;fillColor=#0079D6;',
					49, 50, '', 'Key Vault', null, null, this.getTagsForStencil(gn, 'key vault', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'logic_app;fillColor=#0079D6;',
					50, 50, '', 'Logic App', null, null, this.getTagsForStencil(gn, 'logic app application', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'machine_learning;fillColor=#0079D6;',
					47, 50, '', 'Machine Learning', null, null, this.getTagsForStencil(gn, 'machine_learning', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'media_service;',
					45, 50, '', 'Media Services', null, null, this.getTagsForStencil(gn, 'media services', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'microsoft_account;fillColor=#0079D6;',
					50, 50, '', 'Microsoft Account', null, null, this.getTagsForStencil(gn, 'microsoft account', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'microsoft_azure;fillColor=#000000;',
					50, 32, '', 'Microsoft Azure', null, null, this.getTagsForStencil(gn, 'microsoft', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'mobile_app;fillColor=#0079D6;',
					30, 50, '', 'Mobile App', null, null, this.getTagsForStencil(gn, 'mobile app application', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'mobile_engagement;fillColor=#0079D6;',
					30, 50, '', 'Mobile Engagement', null, null, this.getTagsForStencil(gn, 'mobile engagement', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'multi_factor_authentication;',
					25, 50, '', 'Multi-Factor Authentication', null, null, this.getTagsForStencil(gn, 'multi factor authentication', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mysql_database;',
					37, 50, '', 'MySQL Database', null, null, this.getTagsForStencil(gn, 'mysql database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'notification_hub;',
					50, 50, '', 'Notification Hub', null, null, this.getTagsForStencil(gn, 'notification hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'notification_topic;',
					50, 50, '', 'Notification Topic', null, null, this.getTagsForStencil(gn, 'notification topic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'office_365;fillColor=#DF3C01;',
					41, 49, '', 'Office 365', null, null, this.getTagsForStencil(gn, 'office 365', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'office_365_subscription;fillColor=#DF3C01;',
					50, 34, '', 'Office 365 Subscription', null, null, this.getTagsForStencil(gn, 'office 365 subscription', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'operational_insights;fillColor=#0079D6;',
					50, 50, '', 'Operational Insights', null, null, this.getTagsForStencil(gn, 'operational insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'operating_system_image;',
					50, 50, '', 'OS Image', null, null, this.getTagsForStencil(gn, 'os operating system image', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rdp_remoting_file;',
					47, 50, '', 'RDP Remoting File', null, null, this.getTagsForStencil(gn, 'rdp remoting file', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'remoteapp;fillColor=#0079D6;',
					50, 50, '', 'RemoteApp', null, null, this.getTagsForStencil(gn, 'remoteapp remote app', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'resource_group;fillColor=#0079D6;',
					50, 41, '', 'Resource Group', null, null, this.getTagsForStencil(gn, 'resource group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'scheduler;',
					40, 50, '', 'Scheduler', null, null, this.getTagsForStencil(gn, 'scheduler', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus;',
					45, 50, '', 'Service Bus', null, null, this.getTagsForStencil(gn, 'service bus', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_queues;',
					42, 50, '', 'Service Bus Queue', null, null, this.getTagsForStencil(gn, 'service bus queue', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_relay;',
					40, 50, '', 'Service Bus Relay', null, null, this.getTagsForStencil(gn, 'service bus relay', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_topics_and_subscriptions;',
					45, 50, '', 'Service Bus Topic', null, null, this.getTagsForStencil(gn, 'service bus topic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'service_endpoint;fillColor=#0079D6;',
					50, 9, '', 'Service Endpoint', null, null, this.getTagsForStencil(gn, 'service endpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'service_fabric;fillColor=#00BEF2;',
					50, 50, '', 'Service Fabric', null, null, this.getTagsForStencil(gn, 'service fabric', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'service_package;fillColor=#0079D6;',
					44, 50, '', 'Service Package', null, null, this.getTagsForStencil(gn, 'service package', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hyper_v_recovery_manager;',
					50, 45, '', 'Site Recovery', null, null, this.getTagsForStencil(gn, 'site recovery', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_datasync;',
					37, 50, '', 'SQL DataSync', null, null, this.getTagsForStencil(gn, 'sql datasync', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_database;',
					37, 50, '', 'SQL Database', null, null, this.getTagsForStencil(gn, 'sql database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'startup_task;',
					47, 50, '', 'Startup Task', null, null, this.getTagsForStencil(gn, 'startup task', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage_blob;',
					50, 45, '', 'Storage Blob', null, null, this.getTagsForStencil(gn, 'storage blob', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage_queue;',
					50, 45, '', 'Storage Queue', null, null, this.getTagsForStencil(gn, 'storage queue', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage_table;',
					50, 45, '', 'Storage Table', null, null, this.getTagsForStencil(gn, 'storage table', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storsimple;',
					50, 45, '', 'StorSimple', null, null, this.getTagsForStencil(gn, 'storsimple', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'stream_analytics;fillColor=#0079D6;',
					48, 37, '', 'Stream Analytics', null, null, this.getTagsForStencil(gn, 'stream analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'traffic_manager;',
					50, 50, '', 'Traffic Manager', null, null, this.getTagsForStencil(gn, 'traffic manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'unidentified_code_object;',
					50, 42, '', 'Unidentified Feature Object', null, null, this.getTagsForStencil(gn, 'unidentified feature object', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vhd;',
					40, 50, '', 'VHD', null, null, this.getTagsForStencil(gn, 'vhd', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vhd_data_disk;',
					37, 50, '', 'VHD Data Disk', null, null, this.getTagsForStencil(gn, 'vhd data disk', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_machine;',
					50, 40, '', 'Virtual Machine', null, null, this.getTagsForStencil(gn, 'virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'virtual_machine_container;fillColor=#0079D6;',
					49, 43, '', 'Virtual Machine Container', null, null, this.getTagsForStencil(gn, 'virtual machine container', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_network;',
					50, 27, '', 'Virtual Network', null, null, this.getTagsForStencil(gn, 'virtual network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'visual_studio_online;',
					50, 37, '', 'Visual Studio Online', null, null, this.getTagsForStencil(gn, 'visual studio online', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_machine_feature;',
					50, 45, '', 'Virtual Machine', null, null, this.getTagsForStencil(gn, 'virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'vpn_gateway;fillColor=#0079D6;',
					32, 50, '', 'VPN Gateway', null, null, this.getTagsForStencil(gn, 'vpn gateway virtual private network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_website;',
					50, 50, '', 'Web App', null, null, this.getTagsForStencil(gn, 'web app application', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_role;',
					50, 40, '', 'Web Role', null, null, this.getTagsForStencil(gn, 'web role', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_roles;',
					55, 45, '', 'Web Roles', null, null, this.getTagsForStencil(gn, 'web roles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'webjobs;fillColor=#0079D6;',
					51, 50, '', 'WebJobs', null, null, this.getTagsForStencil(gn, 'webjobs web jobs', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'work_account;fillColor=#0079D6;',
					50, 50, '', 'Work Account', null, null, this.getTagsForStencil(gn, 'work_account', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worker_role;',
					50, 40, '', 'Worker Role', null, null, this.getTagsForStencil(gn, 'worker role', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worker_roles;',
					55, 45, '', 'Worker Roles', null, null, this.getTagsForStencil(gn, 'worker roles', dt).join(' '))
		];
			
		this.addPalette('mscaeCloud', 'CAE / Cloud', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addMSCAEDeprecatedPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.mscae.deprecated.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.deprecated';
		var dt = 'ms microsoft cloud enterprise deprecated ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'application;fillColor=#00188D;',
					50, 33, '', 'Application', null, null, this.getTagsForStencil(gn, 'application', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hdinsight;fillColor=#00BEF2;',
					50, 50, '', 'HDInsight', null, null, this.getTagsForStencil(gn, 'hdinsight hd insight', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'operating_system_image;fillColor=#0079D6;',
					50, 50, '', 'OS Image', null, null, this.getTagsForStencil(gn, 'os operating system image', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_reporting;fillColor=#0079D6;',
					40, 50, '', 'SQL Reporting', null, null, this.getTagsForStencil(gn, 'sql reporting', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vhd;fillColor=#0079D6;',
					40, 50, '', 'VHD', null, null, this.getTagsForStencil(gn, 'vhd virtual hard drive', dt).join(' '))
		];
			
		this.addPalette('mscaeDeprecated', 'CAE / (Deprecated)', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMSCAEEnterprisePalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.mscae.enterprise.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.enterprise';
		var dt = 'ms microsoft cloud enterprise ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'ad_fs;fillColor=#00188D;',
					40, 50, '', 'AD FS', null, null, this.getTagsForStencil(gn, 'ad fs', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'android_phone;fillColor=#00188D;',
					30, 50, '', 'Android Phone', null, null, this.getTagsForStencil(gn, 'android phone mobile', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'app_generic;fillColor=#00188D;',
					50, 39, '', 'App (generic)', null, null, this.getTagsForStencil(gn, 'app generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_blank;fillColor=#00188D;',
					46, 40, '', 'Application (blank)', null, null, this.getTagsForStencil(gn, 'application app blank', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_server;fillColor=#00188D;',
					38, 44, '', 'Application Server', null, null, this.getTagsForStencil(gn, 'application app server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'backup_local;fillColor=#00188D;',
					49, 50, '', 'Backup (local)', null, null, this.getTagsForStencil(gn, 'backup local', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'backup_online;fillColor=#00188D;',
					51, 41, '', 'Backup (online)', null, null, this.getTagsForStencil(gn, 'backup online', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'certificate;fillColor=#7D7D7D;',
					50, 40, '', 'Certificate', null, null, this.getTagsForStencil(gn, 'certificate', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'client_application;fillColor=#00188D;',
					50, 32, '', 'Client Application', null, null, this.getTagsForStencil(gn, 'client application app', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud;fillColor=#7D7D7D;',
					50, 32, '', 'Cloud', null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cluster_server;fillColor=#00188D;',
					40, 50, '', 'Cluster Server', null, null, this.getTagsForStencil(gn, 'cluster server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'code_file;fillColor=#7D7D7D;',
					47, 50, '', 'Code File', null, null, this.getTagsForStencil(gn, 'code file', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'connectors;fillColor=#00188D;',
					50, 34, '', 'Connectors', null, null, this.getTagsForStencil(gn, 'connectors', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'd;fillColor=#00188D;',
					40, 50, '', 'D', null, null, this.getTagsForStencil(gn, 'delta diff difference server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'database_generic;fillColor=#00188D;',
					38, 51, '', 'Database (generic)', null, null, this.getTagsForStencil(gn, 'db database generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'database_server;fillColor=#00188D;',
					38, 50, '', 'Database (server)', null, null, this.getTagsForStencil(gn, 'db database server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'database_synchronization;fillColor=#00188D;',
					39, 50, '', 'Database Synchronization', null, null, this.getTagsForStencil(gn, 'database synchronization sync db', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'device;fillColor=#00188D;',
					50, 26, '', 'Device', null, null, this.getTagsForStencil(gn, 'Device', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'direct_access_feature;fillColor=#00188D;',
					50, 44, '', 'Direct Access (feature)', null, null, this.getTagsForStencil(gn, 'direct access feature', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'document;fillColor=#00188D;',
					40, 50, '', 'Document', null, null, this.getTagsForStencil(gn, 'document doc', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'domain_controller;fillColor=#00188D;',
					36, 50, '', 'Domain Controller', null, null, this.getTagsForStencil(gn, 'domain controller', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'enterprise;fillColor=#00188D;',
					30, 50, '', 'Enterprise Building', null, null, this.getTagsForStencil(gn, 'enterprise building', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'file;fillColor=#7D7D7D;',
					47, 50, '', 'File general', null, null, this.getTagsForStencil(gn, 'file general', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'filter;fillColor=#00188D;',
					50, 45, '', 'Filter', null, null, this.getTagsForStencil(gn, 'filter', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'firewall;fillColor=#00188D;',
					50, 44, '', 'Firewall', null, null, this.getTagsForStencil(gn, 'firewall', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'folder;fillColor=#00188D;',
					50, 43, '', 'Folder', null, null, this.getTagsForStencil(gn, 'folder', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'gateway;fillColor=#00188D;',
					50, 50, '', 'Gateway', null, null, this.getTagsForStencil(gn, 'gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'code_file;fillColor=#00188D;',
					47, 50, '', 'Generic Code', null, null, this.getTagsForStencil(gn, 'generic code', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'health_monitoring;fillColor=#7D7D7D;',
					50, 42, '', 'Health Monitoring', null, null, this.getTagsForStencil(gn, 'health monitoring', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'healthy;fillColor=#7D7D7D;',
					50, 45, '', 'Healthy', null, null, this.getTagsForStencil(gn, 'healthy', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'import_generic;fillColor=#00188D;',
					40, 50, '', 'Import (generic)', null, null, this.getTagsForStencil(gn, 'import generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'internet;fillColor=#00188D;',
					50, 31, '', 'Internet', null, null, this.getTagsForStencil(gn, 'internet', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'internet_hollow;fillColor=#00188D;',
					50, 31, '', 'Internet (hollow)', null, null, this.getTagsForStencil(gn, 'internet hollow', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'key_permissions;fillColor=#00188D;',
					26, 50, '', 'Key, Permissions', null, null, this.getTagsForStencil(gn, 'key permissions', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'keyboard;fillColor=#00188D;',
					50, 30, '', 'Keyboard', null, null, this.getTagsForStencil(gn, 'keyboard', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'laptop;fillColor=#7D7D7D;',
					50, 30, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'laptop computer pc', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'load_balancer_generic;fillColor=#00188D;',
					37, 50, '', 'Load Balancer (generic)', null, null, this.getTagsForStencil(gn, 'load balancer generic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'load_balancer_generic;fillColor=#ffffff;',
					37, 50, '', 'Load Balancer (white)', null, null, this.getTagsForStencil(gn, 'load balancer generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'load_testing;fillColor=#00188D;',
					48, 50, '', 'Load Testing', null, null, this.getTagsForStencil(gn, 'load testing', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'lock;fillColor=#00188D;',
					39, 50, '', 'Lock, Protected', null, null, this.getTagsForStencil(gn, 'lock protected', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'lock_unlocked;fillColor=#00188D;',
					37, 50, '', 'Lock (unlocked)', null, null, this.getTagsForStencil(gn, 'lock unlocked accessible', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'maintenance;fillColor=#00188D;',
					34, 50, '', 'Maintenance', null, null, this.getTagsForStencil(gn, 'maintenance', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'management_console;fillColor=#00188D;',
					50, 34, '', 'Management Console', null, null, this.getTagsForStencil(gn, 'management console', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'message;fillColor=#7D7D7D;',
					50, 37, '', 'Message', null, null, this.getTagsForStencil(gn, 'message', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'computer;fillColor=#7D7D7D;',
					50, 45, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'monitor_running_apps;fillColor=#00188D;',
					50, 39, '', 'Monitor Running Apps', null, null, this.getTagsForStencil(gn, 'monitor running app application', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'mouse;fillColor=#00188D;',
					30, 50, '', 'Mouse', null, null, this.getTagsForStencil(gn, 'mouse', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'network_card;fillColor=#00188D;',
					50, 35, '', 'Network Card', null, null, this.getTagsForStencil(gn, 'network card', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'performance;fillColor=#00188D;',
					50, 50, '', 'Performance', null, null, this.getTagsForStencil(gn, 'performance', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'performance_monitor;fillColor=#00188D;',
					50, 36, '', 'Performance Monitor', null, null, this.getTagsForStencil(gn, 'performance monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mobile;fillColor=#7D7D7D;',
					35, 50, '', 'Phone', null, null, this.getTagsForStencil(gn, 'mobile phone', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'plug_and_play;fillColor=#00188D;',
					40, 50, '', 'Plug and Play', null, null, this.getTagsForStencil(gn, 'plug play', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'powershell_file;fillColor=#00188D;',
					47, 50, '', 'PowerShell Script File', null, null, this.getTagsForStencil(gn, 'powershell script file', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'protocol_stack;fillColor=#00188D;',
					50, 34, '', 'Protocol Stack', null, null, this.getTagsForStencil(gn, 'protocol stack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'queue_generic;fillColor=#00188D;',
					50, 15, '', 'Queue (general)', null, null, this.getTagsForStencil(gn, 'queue general generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'rms_connector;fillColor=#00188D;',
					30, 40, '', 'RMS Connector', null, null, this.getTagsForStencil(gn, 'rms connector', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'router;fillColor=#00188D;',
					49, 38, '', 'Router', null, null, this.getTagsForStencil(gn, 'router', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'script_file;fillColor=#00188D;',
					47, 50, '', 'Script File', null, null, this.getTagsForStencil(gn, 'script file', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'secure_virtual_machine;fillColor=#00188D;',
					50, 38, '', 'Secure Virtual Machine', null, null, this.getTagsForStencil(gn, 'secure virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'server;fillColor=#00188D;',
					50, 15, '', 'Server (blade)', null, null, this.getTagsForStencil(gn, 'server blade', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'server_generic;fillColor=#00188D;',
					24, 50, '', 'Server (generic)', null, null, this.getTagsForStencil(gn, 'server generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'server_directory;fillColor=#00188D;',
					36, 50, '', 'Server Directory', null, null, this.getTagsForStencil(gn, 'server directory', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'server_farm;fillColor=#00188D;',
					50, 32, '', 'Server Farm', null, null, this.getTagsForStencil(gn, 'server farm', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'server_rack;fillColor=#00188D;',
					50, 50, '', 'Server Rack', null, null, this.getTagsForStencil(gn, 'server rack', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'settings;fillColor=#00188D;',
					50, 50, '', 'Settings', null, null, this.getTagsForStencil(gn, 'settings', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'shared_folder;fillColor=#00188D;',
					43, 50, '', 'Shared Folder', null, null, this.getTagsForStencil(gn, 'shared folder', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'smartcard;fillColor=#00188D;',
					50, 32, '', 'SmartCard', null, null, this.getTagsForStencil(gn, 'smartcard', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'storage;fillColor=#00188D;',
					50, 41, '', 'Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'table;fillColor=#00188D;',
					50, 50, '', 'Table', null, null, this.getTagsForStencil(gn, 'table', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tablet;fillColor=#00188D;',
					50, 37, '', 'Tablet', null, null, this.getTagsForStencil(gn, 'tablet', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'tool;fillColor=#00188D;',
					52, 47, '', 'Tool', null, null, this.getTagsForStencil(gn, 'tool', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'unhealthy;fillColor=#00188D;',
					52, 43, '', 'Unhealthy', null, null, this.getTagsForStencil(gn, 'unhealthy', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'usb;fillColor=#00188D;',
					50, 23, '', 'USB', null, null, this.getTagsForStencil(gn, 'usb', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'web;fillColor=#00188D;',
					50, 50, '', 'Web', null, null, this.getTagsForStencil(gn, 'web', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'web_server;fillColor=#00188D;',
					38, 50, '', 'Web Server', null, null, this.getTagsForStencil(gn, 'web server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'website_generic;fillColor=#00188D;',
					47, 41, '', 'Website (generic)', null, null, this.getTagsForStencil(gn, 'website generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'windows_server;fillColor=#00188D;',
					39, 50, '', 'Windows Server', null, null, this.getTagsForStencil(gn, 'windows server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'wireless_connection;fillColor=#00188D;',
					42, 50, '', 'Wireless Connection', null, null, this.getTagsForStencil(gn, 'wireless connection', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'workstation_client;fillColor=#00188D;',
					50, 50, '', 'Workstation Client', null, null, this.getTagsForStencil(gn, 'workstation client', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'xml_web_service;fillColor=#00188D;',
					50, 50, '', 'XML Web Service', null, null, this.getTagsForStencil(gn, 'xml web service', dt).join(' '))
		];
			
		this.addPalette('mscaeEnterprise', 'CAE / Enterprise', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMSCAEGeneralPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.mscae.general.';
		var s3 = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.mscae.';
		var s4 = 'shadow=0;dashed=0;html=1;shape=mxgraph.mscae.general.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.general';
		var dt = 'ms microsoft cloud enterprise general ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'audio;fillColor=#7D7D7D;',
					50, 50, '', 'Audio', null, null, this.getTagsForStencil(gn, 'audio', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'bug;fillColor=#7D7D7D;',
					50, 50, '', 'Bug', null, null, this.getTagsForStencil(gn, 'bug', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'enterprise;fillColor=#7D7D7D;',
					30, 50, '', 'Building', null, null, this.getTagsForStencil(gn, 'building enterprise', dt).join(' ')),
			this.createVertexTemplateEntry(s4 + 'cable_settop_tv_box;strokeColor=#000000;fillColor=#7D7D7D;',
					50, 24, '', 'Cable Settop TV Box', null, null, this.getTagsForStencil(gn, 'cable settop tv television box', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'calendar;fillColor=#7D7D7D;',
					50, 40, '', 'Calendar', null, null, this.getTagsForStencil(gn, 'calendar', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'chart;fillColor=#7D7D7D;',
					50, 48, '', 'Chart', null, null, this.getTagsForStencil(gn, 'chart', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'checkmark;fillColor=#91D250;',
					41, 50, '', 'Checkmark (success)', null, null, this.getTagsForStencil(gn, 'checkmark success', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'continuous_cycle;fillColor=#7D7D7D;',
					48, 50, '', 'Continuous Cycle (circle)', null, null, this.getTagsForStencil(gn, 'continuous cycle circle', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'crossout;fillColor=#FF0000;',
					40, 50, '', 'Crossout (failure)', null, null, this.getTagsForStencil(gn, 'crossout failure', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cut_and_paste;fillColor=#7D7D7D;',
					50, 34, '', 'Cut and Paste', null, null, this.getTagsForStencil(gn, 'cut and paste', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'enterprise.filter;fillColor=#7D7D7D;',
					50, 45, '', 'Filter', null, null, this.getTagsForStencil(gn, 'filter', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'enterprise.folder;fillColor=#7D7D7D;',
					50, 43, '', 'Folder', null, null, this.getTagsForStencil(gn, 'folder', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'game_controller;fillColor=#7D7D7D;',
					50, 35, '', 'Game Controller', null, null, this.getTagsForStencil(gn, 'game controller gamepad', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'gears;fillColor=#7D7D7D;',
					50, 42, '', 'Gears', null, null, this.getTagsForStencil(gn, 'gears', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'graph;fillColor=#7D7D7D;',
					50, 50, '', 'Graph', null, null, this.getTagsForStencil(gn, 'graph', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'like;fillColor=#7D7D7D;',
					50, 47, '', 'Like', null, null, this.getTagsForStencil(gn, 'like', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'not_allowed;fillColor=#DE5900;',
					50, 50, '', 'Not Allowed', null, null, this.getTagsForStencil(gn, 'not allowed', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'pointer;fillColor=#91D250;',
					50, 50, '', 'Pointer (circle)', null, null, this.getTagsForStencil(gn, 'pointer circle', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider_bar_horizontal;fillColor=#7D7D7D;',
					50, 21, '', 'Slider Bar (horizontal)', null, null, this.getTagsForStencil(gn, 'slider bar horizontal hor', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider_bar_vertical;fillColor=#7D7D7D;',
					22, 50, '', 'Slider Bar (vertical)', null, null, this.getTagsForStencil(gn, 'slider bar vertical hor', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'task_list;fillColor=#7D7D7D;',
					38, 47, '', 'Task List (backlog)', null, null, this.getTagsForStencil(gn, 'task list backlog', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'tasks;fillColor=#7D7D7D;',
					38, 50, '', 'Tasks', null, null, this.getTagsForStencil(gn, 'tasks', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'tunnel;fillColor=#7D7D7D;',
					50, 9, '', 'Tunnel', null, null, this.getTagsForStencil(gn, 'tunnel', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'enterprise.usb;fillColor=#7D7D7D;',
					50, 23, '', 'USB', null, null, this.getTagsForStencil(gn, 'usb', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'user;fillColor=#7D7D7D;',
					47, 50, '', 'User', null, null, this.getTagsForStencil(gn, 'user', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'video;fillColor=#7D7D7D;',
					49, 50, '', 'Video', null, null, this.getTagsForStencil(gn, 'video', dt).join(' '))
		];
			
		this.addPalette('mscaeGeneral', 'CAE / General', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMSCAEIntunePalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.mscae.intune.';
		var s3 = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.intune';
		var dt = 'ms microsoft cloud enterprise intune';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'account_portal;fillColor=#505050;',
					40, 46, '', 'Account Portal', null, null, this.getTagsForStencil(gn, 'account portal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'administration;fillColor=#505050;',
					30, 50, '', 'Administration', null, null, this.getTagsForStencil(gn, 'administration', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'alerts;fillColor=#505050;',
					50, 50, '', 'Alerts', null, null, this.getTagsForStencil(gn, 'alerts', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'apps;fillColor=#505050;',
					50, 50, '', 'Apps', null, null, this.getTagsForStencil(gn, 'apps', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'certificate;fillColor=#505050;',
					50, 49, '', 'Certificate (Compliance)', null, null, this.getTagsForStencil(gn, 'certificate compliance', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'client_software;fillColor=#505050;',
					52, 47, '', 'Client Software Deployment Wizard', null, null, this.getTagsForStencil(gn, 'client software deployment wizard', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'company_portal;fillColor=#505050;',
					47, 36, '', 'Company Portal', null, null, this.getTagsForStencil(gn, 'company portal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'computer_inventory;fillColor=#505050;',
					50, 45, '', 'Computer Inventory', null, null, this.getTagsForStencil(gn, 'computer inventory', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'conditional_access_exchange;fillColor=#505050;',
					49, 50, '', 'Conditional Access (Exchange)', null, null, this.getTagsForStencil(gn, 'conditional access exchange', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'conditional_access_sharepoint;fillColor=#505050;',
					43, 49, '', 'Conditional Access (Sharepoint)', null, null, this.getTagsForStencil(gn, 'conditional access sharepoint', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'connector;fillColor=#505050;',
					46, 16, '', 'Connector', null, null, this.getTagsForStencil(gn, 'connector', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'dashboard;fillColor=#505050;',
					50, 40, '', 'Dashboard', null, null, this.getTagsForStencil(gn, 'dashboard', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_migration_wizard;fillColor=#505050;',
					50, 48, '', 'Data Migration Wizard', null, null, this.getTagsForStencil(gn, 'data migration wizard', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'detected_software;fillColor=#505050;',
					50, 50, '', 'Detected Software', null, null, this.getTagsForStencil(gn, 'detected software', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'device_group;fillColor=#505050;',
					50, 50, '', 'Device Group', null, null, this.getTagsForStencil(gn, 'device group', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'device_health;fillColor=#505050;',
					50, 31, '', 'Device Health', null, null, this.getTagsForStencil(gn, 'device_health', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'device_history;fillColor=#505050;',
					45, 50, '', 'Device History', null, null, this.getTagsForStencil(gn, 'device history', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'device_os;fillColor=#505050;',
					49, 50, '', 'Device OS', null, null, this.getTagsForStencil(gn, 'device os operating system', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'end_protection;fillColor=#505050;',
					48, 50, '', 'End Protection', null, null, this.getTagsForStencil(gn, 'end protection', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'exchange_connector;fillColor=#505050;',
					50, 49, '', 'Exchange Connector', null, null, this.getTagsForStencil(gn, 'exchange connector', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'groups;fillColor=#505050;',
					50, 48, '', 'Groups', null, null, this.getTagsForStencil(gn, 'groups', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'hybrid;fillColor=#505050;',
					50, 39, '', 'Hybrid', null, null, this.getTagsForStencil(gn, 'hybrid', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_certificate_profiles;fillColor=#505050;',
					40, 50, '', 'Intune Certificate Profiles', null, null, this.getTagsForStencil(gn, 'certificate profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_email_profiles;fillColor=#505050;',
					50, 50, '', 'Intune Email Profiles', null, null, this.getTagsForStencil(gn, 'email profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_managed_app;fillColor=#505050;',
					50, 38, '', 'Intune Managed App', null, null, this.getTagsForStencil(gn, 'managed app application', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_mobile_application_management;fillColor=#505050;',
					49, 50, '', 'Intune Mobile Application Management', null, null, this.getTagsForStencil(gn, 'mobile app aplication management', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_vpn_profiles;fillColor=#505050;',
					42, 50, '', 'Intune VPN Profiles', null, null, this.getTagsForStencil(gn, 'vpn virtual private network profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_wifi_profiles;fillColor=#505050;',
					44, 51, '', 'Intune WiFi Profiles', null, null, this.getTagsForStencil(gn, 'wifi profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'inventory_license;fillColor=#505050;',
					50, 48, '', 'Inventory License', null, null, this.getTagsForStencil(gn, 'inventory license', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'inventory_software;fillColor=#505050;',
					50, 49, '', 'Inventory Software', null, null, this.getTagsForStencil(gn, 'inventory software', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'license_group;fillColor=#505050;',
					50, 49, '', 'License Group', null, null, this.getTagsForStencil(gn, 'license group', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'license_installation;fillColor=#505050;',
					50, 43, '', 'License Installation', null, null, this.getTagsForStencil(gn, 'license installation', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'microsoft_intune;fillColor=#505050;',
					48, 38, '', 'Microsoft Intune', null, null, this.getTagsForStencil(gn, 'microsoft', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'mobile_inventory;fillColor=#505050;',
					44, 50, '', 'Mobile Inventory', null, null, this.getTagsForStencil(gn, 'mobile inventory', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'noncompliant_apps;fillColor=#505050;',
					46, 50, '', 'Noncompliant Apps', null, null, this.getTagsForStencil(gn, 'noncompliant apps applications', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'policy;fillColor=#505050;',
					50, 50, '', 'Policy', null, null, this.getTagsForStencil(gn, 'policy', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'protection;fillColor=#505050;',
					48, 50, '', 'Protection', null, null, this.getTagsForStencil(gn, 'protection', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'reports;fillColor=#505050;',
					46, 50, '', 'Reports', null, null, this.getTagsForStencil(gn, 'reports', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'enterprise.settings;fillColor=#505050;',
					50, 50, '', 'Settings', null, null, this.getTagsForStencil(gn, 'settings', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'subscription_portal;fillColor=#505050;',
					45, 45, '', 'Subscription Portal', null, null, this.getTagsForStencil(gn, 'subscription portal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'terms_and_conditions;fillColor=#505050;',
					37, 50, '', 'Terms and Conditions', null, null, this.getTagsForStencil(gn, 'terms and conditions', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'update;fillColor=#505050;',
					50, 52, '', 'Update', null, null, this.getTagsForStencil(gn, 'update', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'user_group;fillColor=#505050;',
					50, 37, '', 'User Group', null, null, this.getTagsForStencil(gn, 'user group', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'user_management;fillColor=#505050;',
					50, 46, '', 'User Management', null, null, this.getTagsForStencil(gn, 'user management', dt).join(' '))
		];
			
		this.addPalette('mscaeIntune', 'CAE / Intune', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMSCAEOtherPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;strokeColor=none;html=1;shape=mxgraph.mscae.other.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.other';
		var dt = 'ms microsoft cloud enterprise other';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'access;fillColor=#BA2024;',
					50, 50, '', 'Access', null, null, this.getTagsForStencil(gn, 'access', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'excel;fillColor=#008540;',
					50, 50, '', 'Excel', null, null, this.getTagsForStencil(gn, 'excel', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'exchange;fillColor=#2471BA;',
					52, 50, '', 'Exchange', null, null, this.getTagsForStencil(gn, 'exchange', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'lync;fillColor=#2471BA;',
					52, 50, '', 'Lync', null, null, this.getTagsForStencil(gn, 'lync', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'microsoft;',
					50, 50, '', 'Microsoft', null, null, this.getTagsForStencil(gn, 'microsoft', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'outlook;fillColor=#2471BA;',
					50, 50, '', 'Outlook', null, null, this.getTagsForStencil(gn, 'outlook', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'powerpoint;fillColor=#DE5D24;',
					50, 50, '', 'PowerPoint', null, null, this.getTagsForStencil(gn, 'powerpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sharepoint;fillColor=#2471BA;',
					51, 50, '', 'Sharepoint', null, null, this.getTagsForStencil(gn, 'sharepoint', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'skype;fillColor=#00AEF2;',
					45, 45, '', 'Skype', null, null, this.getTagsForStencil(gn, 'skype', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'windows;fillColor=#00188D;',
					48, 50, '', 'Windows', null, null, this.getTagsForStencil(gn, 'windows', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'word;fillColor=#2C3481;',
					50, 50, '', 'Word', null, null, this.getTagsForStencil(gn, 'word', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'xbox;fillColor=#91D250;',
					54, 52, '', 'Xbox', null, null, this.getTagsForStencil(gn, 'xbox', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'xbox_one;',
					50, 16, '', 'Xbox One', null, null, this.getTagsForStencil(gn, 'xbox one', dt).join(' '))
		];
			
		this.addPalette('mscaeOther', 'CAE / Other', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMSCAESystemCenterPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.mscae.system_center.';
		var s3 = 'shadow=0;dashed=0;html=1;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.system_center';
		var dt = 'ms microsoft cloud enterprise system center';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'admin_console;fillColor=#7D7D7D;strokeColor=none;',
					50, 36, '', 'Admin Console', null, null, this.getTagsForStencil(gn, 'admin console', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'enterprise.database_server;fillColor=#7D7D7D;strokeColor=none;',
					38, 50, '', 'Central Administration Site', null, null, this.getTagsForStencil(gn, 'central administration site', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'central_administration_site_sql;fillColor=#7D7D7D;strokeColor=none;',
					38, 50, '', 'Central Administration Site SQL', null, null, this.getTagsForStencil(gn, 'central administration site sql', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cloud_distribution_point;fillColor=#7D7D7D;strokeColor=none;',
					46, 50, '', 'Cloud Distribution Point', null, null, this.getTagsForStencil(gn, 'cloud distribution point', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'distribution_point;fillColor=#7D7D7D;strokeColor=none;',
					44, 50, '', 'Distribution Point', null, null, this.getTagsForStencil(gn, 'distribution point', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'management_point;fillColor=#7D7D7D;strokeColor=none;',
					48, 50, '', 'Management Point', null, null, this.getTagsForStencil(gn, 'management point', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'primary_site;fillColor=#7D7D7D;strokeColor=none;',
					38, 50, '', 'Primary Site', null, null, this.getTagsForStencil(gn, 'primary site', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'roles;fillColor=#7D7D7D;strokeColor=none;',
					42, 50, '', 'Roles', null, null, this.getTagsForStencil(gn, 'roles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'secondary_site;fillColor=#7D7D7D;strokeColor=none;',
					41, 50, '', 'Secondary Site', null, null, this.getTagsForStencil(gn, 'secondary site', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'software_update_point;fillColor=#7D7D7D;strokeColor=none;',
					50, 43, '', 'Software Update Point', null, null, this.getTagsForStencil(gn, 'software update point', dt).join(' '))
		];
			
		this.addPalette('mscaeSystem Center', 'CAE / System Center', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	
})();
