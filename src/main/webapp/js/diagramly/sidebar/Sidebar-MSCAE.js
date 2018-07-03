(function()
{
	// Adds MSCAE shapes
	Sidebar.prototype.addMSCAEPalette = function()
	{
		this.addMSCAEGeneralPalette();
		this.addMSCAECloudPalette();
		this.addMSCAEEnterprisePalette();
		this.addMSCAEGeneralSymbolsPalette();
		this.addMSCAEIntunePalette();
		this.addMSCAEOMSPalette();
		this.addMSCAEOpsManagerPalette();
		this.addMSCAEOtherPalette();
		this.addMSCAESystemCenterPalette();
		this.addMSCAEVMPalette();
		this.addMSCAEDeprecatedPalette();
		this.addMSCAECloudColorPalette();
		this.addMSCAEDeprecatedColorPalette();
	};

	Sidebar.prototype.addMSCAECloudPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;fillColor=#0079D6;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.cloud.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.cloud';
		var dt = 'ms microsoft cloud enterprise ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'active_directory_b2b;fillColor=#0079D6;',
					50, 50, '', 'Active Directory B2B', null, null, this.getTagsForStencil(gn, 'active directory b2b', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'active_directory_b2c;fillColor=#0079D6;',
					50, 50, '', 'Active Directory B2C', null, null, this.getTagsForStencil(gn, 'active directory b2c', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'active_directory_domain_services;fillColor=#0079D6;',
					50, 50, '', 'Active Directory Domain Services', null, null, this.getTagsForStencil(gn, 'active directory domain services', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'active_directory_health_monitoring;fillColor=#0079D6;',
					50, 49, '', 'Active Directory Health Monitoring', null, null, this.getTagsForStencil(gn, 'active directory health monitoring', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'access_control;',
					50, 50, '', 'Access Control', null, null, this.getTagsForStencil(gn, 'access control', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'advisor;fillColor=#0079D6;',
					50, 50, '', 'Advisor', null, null, this.getTagsForStencil(gn, 'advisor', dt).join(' ')),
			this.createVertexTemplateEntry('shape=rect;fillColor=none;strokeColor=#0000FF;dashed=1;fontSize=14;align=center;html=1;verticalAlign=top;fontColor=#0078D7;whiteSpace=wrap;',
					100, 100, 'Affinity group', 'Affinity Group', null, null, this.getTagsForStencil(gn, 'affinity group', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'analysis_service;fillColor=#0079D6;',
					50, 40, '', 'Analysis Service', null, null, this.getTagsForStencil(gn, 'analysis service', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'api_app;fillColor=#0079D6;',
					45, 50, '', 'API App', null, null, this.getTagsForStencil(gn, 'api app', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'api_management;fillColor=#0079D6;',
					50, 45, '', 'API Management', null, null, this.getTagsForStencil(gn, 'api management', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_gateway;fillColor=#0079D6;',
					50, 50, '', 'Application Gateway', null, null, this.getTagsForStencil(gn, 'application gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'app_service;fillColor=#0079D6;',
					50, 50, '', 'App Service', null, null, this.getTagsForStencil(gn, 'app application service', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_insights;fillColor=#0079D6;',
					32, 50, '', 'Application Insights', null, null, this.getTagsForStencil(gn, 'application insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'autoscale;',
					50, 30, '', 'Autoscaling', null, null, this.getTagsForStencil(gn, 'autoscaling autoscale', dt).join(' ')),
			this.createVertexTemplateEntry('shape=rect;fillColor=none;strokeColor=#0000FF;dashed=1;fontSize=14;align=center;html=1;verticalAlign=top;fontColor=#0078D7;whiteSpace=wrap;',
					100, 100, 'Availability set', 'Availability Set', null, null, this.getTagsForStencil(gn, 'availability set', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'virtual_machines_availability_set;fillColor=#0079D6;',
					50, 50, '', 'Availability Set', null, null, this.getTagsForStencil(gn, 'virtual machines availability set', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure;fillColor=#0079D6;',
					50, 32, '', 'Azure', null, null, this.getTagsForStencil(gn, 'azure', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_automatic_load_balancer;fillColor=#0079D6;',
					50, 33, '', 'Azure Automatic Load Balancer', null, null, this.getTagsForStencil(gn, 'automatic load balancer', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'active_directory;fillColor=#0079D6;',
					47, 50, '', 'Azure Active Directory', null, null, this.getTagsForStencil(gn, 'azure active directory', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_alert;',
					50, 42, '', 'Azure Alert', null, null, this.getTagsForStencil(gn, 'azure alert', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'automation;',
					50, 45, '', 'Azure Automation', null, null, this.getTagsForStencil(gn, 'azure automation', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_batch;fillColor=#0079D6;',
					50, 43, '', 'Azure Batch', null, null, this.getTagsForStencil(gn, 'batch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_cache;',
					45, 50, '', 'Azure Cache including Redis', null, null, this.getTagsForStencil(gn, 'azure cache including redis', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_files_service;fillColor=#0079D6;',
					50, 43, '', 'Azure Files Service', null, null, this.getTagsForStencil(gn, 'files service', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_load_balancer_feature;fillColor=#0079D6;',
					50, 50, '', 'Azure Load Balancer (feature)', null, null, this.getTagsForStencil(gn, 'load balancer feature', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_logo;fillColor=#0079D6;',
					50, 50, '', 'Azure Logo', null, null, this.getTagsForStencil(gn, 'azure logo', dt).join(' ')),
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
			this.createVertexTemplateEntry(s2 + 'azure_storage;fillColor=#0079D6;',
					50, 43, '', 'Azure Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_subscription;',
					50, 35, '', 'Azure Subscription', null, null, this.getTagsForStencil(gn, 'azure subscription', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hyper_v_recovery_manager;',
					50, 45, '', 'Backup', null, null, this.getTagsForStencil(gn, 'backup', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'backup_service;',
					50, 45, '', 'Backup Agent', null, null, this.getTagsForStencil(gn, 'backup agent', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'batch;fillColor=#0079D6;',
					49, 46, '', 'Batch', null, null, this.getTagsForStencil(gn, 'batch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bitbucket_code_source;',
					42, 50, '', 'Bitbucket Code Source', null, null, this.getTagsForStencil(gn, 'bitbucket code source', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'biztalk_services;',
					50, 50, '', 'Biztalk Services', null, null, this.getTagsForStencil(gn, 'biztalk services', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'blockchain;fillColor=#0079D6;',
					50, 38, '', 'Blockchain', null, null, this.getTagsForStencil(gn, 'blockchain', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'bot_services;fillColor=#0079D6;',
					48, 48, '', 'Bot Services', null, null, this.getTagsForStencil(gn, 'bot services', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'building_block;fillColor=#0079D6;',
					50, 44, '', 'Building Block', null, null, this.getTagsForStencil(gn, 'building block', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'c_series;fillColor=#0079D6;',
					49, 50, '', 'C-Series', null, null, this.getTagsForStencil(gn, 'c series', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'central;fillColor=#0079D6;',
					44, 50, '', 'Central', null, null, this.getTagsForStencil(gn, 'central', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cloud_office_365;fillColor=#DF3C01;',
					50, 30, '', 'Cloud Office 365', null, null, this.getTagsForStencil(gn, 'cloud office 365', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud_service;',
					50, 40, '', 'Cloud Service', null, null, this.getTagsForStencil(gn, 'cloud service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'codeplex_code_source;',
					50, 37, '', 'CodePlex', null, null, this.getTagsForStencil(gn, 'codeplex', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cognitive_services;fillColor=#0079D6;',
					50, 30, '', 'Cognitive Services', null, null, this.getTagsForStencil(gn, 'cognitive services', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'container_registry;fillColor=#0079D6;',
					50, 43, '', 'Container Registry', null, null, this.getTagsForStencil(gn, 'container registry', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'container_service;fillColor=#0079D6;',
					50, 36, '', 'Container Service', null, null, this.getTagsForStencil(gn, 'container service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'content_delivery_network;',
					50, 32, '', 'Content Delivery Network', null, null, this.getTagsForStencil(gn, 'content delivery network', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cortona_management_suite;fillColor=#0079D6;',
					50, 50, '', 'Cortona Analytics', null, null, this.getTagsForStencil(gn, 'cortona management suite', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cosmos_db;fillColor=#0079D6;',
					50, 50, '', 'Cosmos DB', null, null, this.getTagsForStencil(gn, 'cosmos db database', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'customer_insights;fillColor=#0079D6;',
					48, 50, '', 'Customer Insights', null, null, this.getTagsForStencil(gn, 'customer insights', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_bricks;fillColor=#0079D6;',
					49, 50, '', 'Data Bricks', null, null, this.getTagsForStencil(gn, 'data bricks', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_catalog;fillColor=#0079D6;',
					32, 37, '', 'Data Catalog', null, null, this.getTagsForStencil(gn, 'data catalog', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_factory;fillColor=#0079D6;',
					50, 50, '', 'Data Factory', null, null, this.getTagsForStencil(gn, 'data factory', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_lake;fillColor=#0079D6;',
					30, 50, '', 'Data Lake', null, null, this.getTagsForStencil(gn, 'data lake', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_lake_analytics;fillColor=#0079D6;',
					50, 50, '', 'Data Lake Analytics', null, null, this.getTagsForStencil(gn, 'data lake analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_lake_store;fillColor=#0079D6;',
					50, 39, '', 'Data Lake Store', null, null, this.getTagsForStencil(gn, 'data lake store', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_warehouse;fillColor=#0079D6;',
					72, 70, '', 'Data Warehouse', null, null, this.getTagsForStencil(gn, 'data warehouse', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'devtest_labs;fillColor=#0079D6;',
					50, 49, '', 'DevTest Labs', null, null, this.getTagsForStencil(gn, 'devtest labs', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure_dns;fillColor=#0079D6;',
					50, 50, '', 'DNS', null, null, this.getTagsForStencil(gn, 'dns', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'docdb_account;fillColor=#0079D6;',
					47, 50, '', 'DocDB Account', null, null, this.getTagsForStencil(gn, 'docdb account doc database db document', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'docdb_collections;fillColor=#0079D6;',
					44, 50, '', 'DocDB Collections', null, null, this.getTagsForStencil(gn, 'docdb collections doc db database document', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'document;fillColor=#0079D6;',
					43, 50, '', 'Document', null, null, this.getTagsForStencil(gn, 'document', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'documentdb;fillColor=#0079D6;',
					38, 50, '', 'DocumentDB', null, null, this.getTagsForStencil(gn, 'documentdb document db database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'code_file;fillColor=#0079D6;',
					48, 50, '', 'DocumentDB Document', null, null, this.getTagsForStencil(gn, 'documentdb document db database', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'dps;fillColor=#0079D6;',
					48, 50, '', 'DPS', null, null, this.getTagsForStencil(gn, 'dps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'dropbox_code_source;',
					50, 47, '', 'Dropbox Code Source', null, null, this.getTagsForStencil(gn, 'dropbox code source', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'event_grid;fillColor=#0079D6;',
					50, 50, '', 'Event Grid', null, null, this.getTagsForStencil(gn, 'event grid', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'event_hubs;fillColor=#0079D6;',
					49, 50, '', 'Event Hubs', null, null, this.getTagsForStencil(gn, 'event_hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'express_route;',
					50, 30, '', 'Express Route', null, null, this.getTagsForStencil(gn, 'express route', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'functions;fillColor=#0079D6;',
					50, 46, '', 'Functions', null, null, this.getTagsForStencil(gn, 'functions', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'gateway;fillColor=#0079D6;',
					44, 50, '', 'Gateway', null, null, this.getTagsForStencil(gn, 'gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'git_repository;',
					50, 50, '', 'Git Repository', null, null, this.getTagsForStencil(gn, 'git repository', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'github_code;',
					50, 50, '', 'GitHub', null, null, this.getTagsForStencil(gn, 'github code', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'hdinsight;fillColor=#0079D6;',
					50, 36, '', 'HDInsight', null, null, this.getTagsForStencil(gn, 'hdisight hd insight', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'hockeyapp;fillColor=#0079D6;',
					50, 29, '', 'HockeyApp', null, null, this.getTagsForStencil(gn, 'hockeyapp', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'hybrid_connection_manager;fillColor=#0079D6;',
					50, 35, '', 'Hybrid Connection Manager', null, null, this.getTagsForStencil(gn, 'hybrid connection manager', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'hybrid_connections;fillColor=#0079D6;',
					47, 50, '', 'Hybrid Connections', null, null, this.getTagsForStencil(gn, 'hybrid connections', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'iot_edge;fillColor=#0079D6;',
					50, 50, '', 'IoT Edge', null, null, this.getTagsForStencil(gn, 'iot edge internet of things', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'iot;fillColor=#0079D6;',
					50, 50, '', 'IoT', null, null, this.getTagsForStencil(gn, 'iot internet of things', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'key_vault;fillColor=#0079D6;',
					49, 50, '', 'Key Vault', null, null, this.getTagsForStencil(gn, 'key vault', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'logic_app;fillColor=#0079D6;',
					50, 50, '', 'Logic App', null, null, this.getTagsForStencil(gn, 'logic app application', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'logic_apps;fillColor=#0079D6;',
					50, 39, '', 'Logic Apps', null, null, this.getTagsForStencil(gn, 'logic apps applications', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'machine_learning2;fillColor=#0079D6;',
					47, 50, '', 'Machine Learning', null, null, this.getTagsForStencil(gn, 'machine learning', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'machine_learning_service_plans;fillColor=#0079D6;',
					47, 50, '', 'Machine Learning - Service Plans', null, null, this.getTagsForStencil(gn, 'machine learning service plans', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'machine_learning_web_services;fillColor=#0079D6;',
					50, 50, '', 'Machine Learning - Web Services', null, null, this.getTagsForStencil(gn, 'machine learning web services', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'machine_learning_work_spaces;fillColor=#0079D6;',
					50, 50, '', 'Machine Learning - Work Spaces', null, null, this.getTagsForStencil(gn, 'machine learning work spaces', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'managed_applications;fillColor=#0079D6;',
					44, 50, '', 'Managed Applications', null, null, this.getTagsForStencil(gn, 'managed applications', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'managed_discs;fillColor=#0079D6;',
					46, 50, '', 'Managed Discs', null, null, this.getTagsForStencil(gn, 'managed discs', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'management_portal;fillColor=#0079D6;',
					50, 42, '', 'Management Portal', null, null, this.getTagsForStencil(gn, 'management portal', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'media_service;',
					45, 50, '', 'Media Services', null, null, this.getTagsForStencil(gn, 'media services', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'microsoft_account;fillColor=#0079D6;',
					50, 50, '', 'MS Account', null, null, this.getTagsForStencil(gn, 'microsoft account', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'microsoft_azure;fillColor=#000000;',
					50, 32, '', 'MS Azure', null, null, this.getTagsForStencil(gn, 'microsoft', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'mobile_app;fillColor=#0079D6;',
					30, 50, '', 'Mobile App', null, null, this.getTagsForStencil(gn, 'mobile app application', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'mobile_engagement;fillColor=#0079D6;',
					30, 50, '', 'Mobile Engagement', null, null, this.getTagsForStencil(gn, 'mobile engagement', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'monitor;fillColor=#0079D6;',
					50, 50, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'multi_factor_authentication;',
					25, 50, '', 'Multi-Factor Authentication', null, null, this.getTagsForStencil(gn, 'multi factor authentication', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mysql_database;',
					37, 50, '', 'MySQL Database', null, null, this.getTagsForStencil(gn, 'mysql database', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'network_watcher;fillColor=#0079D6;',
					50, 50, '', 'Network Watcher', null, null, this.getTagsForStencil(gn, 'network watcher', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'notification_hub;',
					50, 50, '', 'Notification Hub', null, null, this.getTagsForStencil(gn, 'notification hub', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'nsg;fillColor=#0079D6;',
					36, 50, '', 'NSG', null, null, this.getTagsForStencil(gn, 'nsg', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'office_365;fillColor=#DF3C01;',
					42, 50, '', 'Office 365', null, null, this.getTagsForStencil(gn, 'office 365', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'office_365_subscription;fillColor=#DF3C01;',
					50, 34, '', 'Office 365 Subscription', null, null, this.getTagsForStencil(gn, 'office 365 subscription', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'oms_log_analytics;fillColor=#0079D6;',
					50, 50, '', 'OMS Log Analytics', null, null, this.getTagsForStencil(gn, 'oms log analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'operational_insights;fillColor=#0079D6;',
					50, 50, '', 'Operational Insights', null, null, this.getTagsForStencil(gn, 'operational insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'operating_system_image;',
					50, 50, '', 'OS Image', null, null, this.getTagsForStencil(gn, 'os operating system image', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'power_bi_embedded;fillColor=#000000;',
					47, 50, '', 'Power BI Embedded', null, null, this.getTagsForStencil(gn, 'power bi embedded', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'recovery_vault;fillColor=#0079D6;',
					50, 50, '', 'Recovery Vault', null, null, this.getTagsForStencil(gn, 'recovery vault', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'remoteapp;fillColor=#0079D6;',
					50, 50, '', 'RemoteApp', null, null, this.getTagsForStencil(gn, 'remoteapp remote app', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'resource_group;fillColor=#0079D6;',
					50, 41, '', 'Resource Group', null, null, this.getTagsForStencil(gn, 'resource group', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'route_filters;fillColor=#0079D6;',
					50, 42, '', 'Route Filters', null, null, this.getTagsForStencil(gn, 'route filters', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'runbooks;fillColor=#0079D6;',
					46, 50, '', 'Runbooks', null, null, this.getTagsForStencil(gn, 'runbooks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'scheduler;',
					40, 50, '', 'Scheduler', null, null, this.getTagsForStencil(gn, 'scheduler', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'security_center;fillColor=#0079D6;',
					37, 50, '', 'Security Center', null, null, this.getTagsForStencil(gn, 'security center', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'service_bus2;fillColor=#0079D6;',
					50, 50, '', 'Service Bus', null, null, this.getTagsForStencil(gn, 'service bus', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'service_bus_relay2;fillColor=#0079D6;',
					50, 50, '', 'Service Bus Relay', null, null, this.getTagsForStencil(gn, 'service bus relay', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_topics_and_subscriptions;',
					45, 50, '', 'Service Bus Topic', null, null, this.getTagsForStencil(gn, 'service bus topic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'service_endpoint;fillColor=#0079D6;',
					50, 9, '', 'Service Endpoint', null, null, this.getTagsForStencil(gn, 'service endpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'service_endpoint2;fillColor=#0079D6;',
					32, 12, '', 'Service Endpoint', null, null, this.getTagsForStencil(gn, 'service endpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'service_fabric;fillColor=#0079D6;',
					50, 50, '', 'Service Fabric', null, null, this.getTagsForStencil(gn, 'service fabric', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'site_recovery;fillColor=#0079D6;',
					37, 31, '', 'Site Recovery', null, null, this.getTagsForStencil(gn, 'site recovery', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'snapshot;fillColor=#0079D6;',
					65, 55, '', 'Snapshot', null, null, this.getTagsForStencil(gn, 'snapshot', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_datasync;',
					37, 50, '', 'SQL DataSync', null, null, this.getTagsForStencil(gn, 'sql datasync', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_database;',
					37, 50, '', 'SQL Database', null, null, this.getTagsForStencil(gn, 'sql database', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sql_database_premium;fillColor=#0079D6;',
					28, 38, '', 'SQL Database Premium', null, null, this.getTagsForStencil(gn, 'sql database premium', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sql_datawarehouse;fillColor=#0079D6;',
					50, 49, '', 'SQL DataWarehouse', null, null, this.getTagsForStencil(gn, 'sql datawarehouse', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sql_elastic_database_pools;fillColor=#0079D6;',
					50, 50, '', 'SQL Elastic Database Pools', null, null, this.getTagsForStencil(gn, 'sql elastic database pools', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sql_stretch_database;fillColor=#0079D6;',
					50, 37, '', 'SQL Stretch Database', null, null, this.getTagsForStencil(gn, 'sql stretch database', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'stack;fillColor=#0079D6;',
					50, 50, '', 'Stack', null, null, this.getTagsForStencil(gn, 'stack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'startup_task;',
					47, 50, '', 'Startup Task', null, null, this.getTagsForStencil(gn, 'startup task', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'storage;fillColor=#0079D6;',
					50, 43, '', 'Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'storage_cs;fillColor=#0079D6;',
					50, 45, '', 'Storage cs', null, null, this.getTagsForStencil(gn, 'storage cs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage_blob;',
					50, 45, '', 'Storage Blob', null, null, this.getTagsForStencil(gn, 'storage blob', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'storage_files;fillColor=#0079D6;',
					50, 43, '', 'Storage Files', null, null, this.getTagsForStencil(gn, 'storage files', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage_queue;',
					50, 45, '', 'Storage Queue', null, null, this.getTagsForStencil(gn, 'storage queue', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'storage_sync_services;fillColor=#0079D6;',
					50, 50, '', 'Storage Sync Services', null, null, this.getTagsForStencil(gn, 'storage sync services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage_table;',
					50, 45, '', 'Storage Table', null, null, this.getTagsForStencil(gn, 'storage table', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storsimple;',
					50, 45, '', 'StorSimple', null, null, this.getTagsForStencil(gn, 'storsimple', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'stream_analytics;fillColor=#0079D6;',
					50, 39, '', 'Stream Analytics', null, null, this.getTagsForStencil(gn, 'stream analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'tags;fillColor=#0079D6;',
					50, 50, '', 'Tags', null, null, this.getTagsForStencil(gn, 'tags', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'time_series_insights;fillColor=#0079D6;',
					50, 50, '', 'Time Series Insights', null, null, this.getTagsForStencil(gn, 'time series insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'traffic_manager;',
					50, 50, '', 'Traffic Manager', null, null, this.getTagsForStencil(gn, 'traffic manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'unidentified_code_object;',
					50, 41, '', 'Unidentified Feature Object', null, null, this.getTagsForStencil(gn, 'unidentified feature object', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'vhd;fillColor=#0079D6;',
					40, 50, '', 'VHD', null, null, this.getTagsForStencil(gn, 'vhd', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vhd_data_disk;',
					37, 50, '', 'VHD Data Disk', null, null, this.getTagsForStencil(gn, 'vhd data disk', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_machine;',
					50, 40, '', 'Virtual Machine', null, null, this.getTagsForStencil(gn, 'virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'virtual_machine_container;fillColor=#0079D6;',
					50, 44, '', 'Virtual Machine Container', null, null, this.getTagsForStencil(gn, 'virtual machine container', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_machine_feature;',
					50, 45, '', 'Virtual Machine Feature', null, null, this.getTagsForStencil(gn, 'virtual machine feature', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_network;',
					50, 27, '', 'Virtual Network', null, null, this.getTagsForStencil(gn, 'virtual network', dt).join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=1;strokeColor=#0079D6;fillColor=none;fontSize=14;fontColor=#0078D7;align=center;html=1;dashPattern=1 4;',
					150, 100, '', 'Virtual Network Box', null, null, this.getTagsForStencil(gn, 'virtual network box', dt).join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=1;strokeColor=#0079D6;fillColor=none;fontSize=14;fontColor=#0078D7;align=center;html=1;dashPattern=1 4;',
					150, 100, '', 'Smart Virtual Network Box', null, null, this.getTagsForStencil(gn, 'virtual network box', dt).join(' ')),
						
		   	this.addEntry(dt + 'smart virtual network box', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 150, 100), 'shape=rect;dashed=1;strokeColor=#0079D6;fillColor=none;fontSize=14;fontColor=#0078D7;align=center;html=1;dashPattern=1 4;');
			   	bg.vertex = true;
			   	var part1 = new mxCell('Virtual Network', new mxGeometry(1, 1, 30, 18), 'shadow=0;dashed=0;html=1;strokeColor=none;fillColor=#0079D6;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.azure.virtual_network;fontSize=12;fontColor=#0078D7;align=right;');
			   	part1.geometry.relative = true;
			   	part1.geometry.offset = new mxPoint(-20, -8);
			   	part1.vertex = true;
			   	bg.insert(part1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width + 10, bg.geometry.height + 10, 'Smart Virtual Network Box');
			}),				

			this.createVertexTemplateEntry(s + 'visual_studio_online;',
					50, 37, '', 'Visual Studio Team Services', null, null, this.getTagsForStencil(gn, 'visual studio online', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'vm_scale_set;fillColor=#0079D6;',
					50, 50, '', 'VM Scale Set', null, null, this.getTagsForStencil(gn, 'vm virtual machine scale set', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'vpn_gateway;fillColor=#0079D6;',
					32, 50, '', 'VPN Gateway', null, null, this.getTagsForStencil(gn, 'vpn gateway virtual private network', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'vpn_gateway2;fillColor=#0079D6;',
					45, 50, '', 'VPN Gateway', null, null, this.getTagsForStencil(gn, 'vpn gateway virtual private network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'azure_website;',
					50, 50, '', 'WebApp', null, null, this.getTagsForStencil(gn, 'web app application', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'webhooks;fillColor=#0079D6;',
					50, 46, '', 'Webhooks', null, null, this.getTagsForStencil(gn, 'webhooks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_role;',
					50, 40, '', 'Web Role', null, null, this.getTagsForStencil(gn, 'web role', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_roles;',
					50, 41, '', 'Web Roles', null, null, this.getTagsForStencil(gn, 'web roles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'webjobs;fillColor=#0079D6;',
					50, 49, '', 'WebJobs', null, null, this.getTagsForStencil(gn, 'webjobs web jobs', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'work_account;fillColor=#0079D6;',
					50, 50, '', 'Work Account', null, null, this.getTagsForStencil(gn, 'work account', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'worker_pools;fillColor=#0079D6;',
					50, 50, '', 'Worker Pools', null, null, this.getTagsForStencil(gn, 'worker pools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worker_role;',
					50, 40, '', 'Worker Role', null, null, this.getTagsForStencil(gn, 'worker role', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worker_roles;',
					50, 41, '', 'Worker Roles', null, null, this.getTagsForStencil(gn, 'worker roles', dt).join(' '))
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
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.deprecated.';
		var s3 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.deprecated';
		var dt = 'ms microsoft cloud enterprise deprecated ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'access_control;fillColor=#0078D7;',
					50, 50, '', 'Access Control', null, null, this.getTagsForStencil(gn, 'access control', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application;fillColor=#00188D;',
					50, 33, '', 'Application', null, null, this.getTagsForStencil(gn, 'application', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_gateway;fillColor=#0078D7;',
					50, 50, '', 'Application Gateway', null, null, this.getTagsForStencil(gn, 'application gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'azure;fillColor=#00BCF2;',
					50, 31, '', 'Azure', null, null, this.getTagsForStencil(gn, 'azure', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'batch;fillColor=#00188D;',
					42, 41, '', 'Batch', null, null, this.getTagsForStencil(gn, 'batch', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'bot;fillColor=#00188D;',
					31, 31, '', 'Bot', null, null, this.getTagsForStencil(gn, 'bot', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'file;fillColor=#00BCF2;',
					47, 50, '', 'Cloud Service Definition File', null, null, this.getTagsForStencil(gn, 'cloud service definition file csdef', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'file;fillColor=#00188D;',
					47, 50, '', 'Cloud Service Definition File', null, null, this.getTagsForStencil(gn, 'cloud service definition file csdef', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'cloud.service_package;fillColor=#00BCF2;',
					44, 50, '', 'Cloud Service Package', null, null, this.getTagsForStencil(gn, 'cloud service package cspkg', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'cloud.service_package;fillColor=#00188D;',
					44, 50, '', 'Cloud Service Package', null, null, this.getTagsForStencil(gn, 'cloud service package cspkg', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'cloud.service_package;fillColor=#0078D7;',
					44, 50, '', 'Cloud Service Package', null, null, this.getTagsForStencil(gn, 'cloud service package cspkg', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'compute;fillColor=#00188D;',
					33, 24, '', 'Compute', null, null, this.getTagsForStencil(gn, 'compute', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'content_delivery_network;fillColor=#0078D7;',
					50, 32, '', 'Content Delivery Network', null, null, this.getTagsForStencil(gn, 'content delivery network', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_lake;fillColor=#0078D7;',
					39, 50, '', 'Data Lake', null, null, this.getTagsForStencil(gn, 'data lake', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_lake_analytics;fillColor=#0078D7;',
					50, 50, '', 'Data Lake Analytics', null, null, this.getTagsForStencil(gn, 'data lake analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_lake_store;fillColor=#0078D7;',
					50, 50, '', 'Data Lake Store', null, null, this.getTagsForStencil(gn, 'data lake store', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_services;fillColor=#00188D;',
					27, 35, '', 'Data Services', null, null, this.getTagsForStencil(gn, 'data services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'file_2;fillColor=#7F7F7F;',
					47, 50, '', 'File', null, null, this.getTagsForStencil(gn, 'file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hdinsight;fillColor=#00BEF2;',
					50, 50, '', 'HDInsight', null, null, this.getTagsForStencil(gn, 'hdinsight hd insight', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'cloud.machine_learning;fillColor=#0078D7;',
					47, 50, '', 'Machine Learning', null, null, this.getTagsForStencil(gn, 'machine learning', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'certificate;fillColor=#00BEF2;',
					50, 40, '', 'Management Certificate', null, null, this.getTagsForStencil(gn, 'management certificate', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'notification_topic;fillColor=#0078D7;',
					50, 50, '', 'Notification Topic', null, null, this.getTagsForStencil(gn, 'notification topic', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'cloud.operational_insights;fillColor=#0078D7;',
					50, 50, '', 'Operational Insights', null, null, this.getTagsForStencil(gn, 'operational insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'operating_system_image;fillColor=#0079D6;',
					50, 50, '', 'OS Image', null, null, this.getTagsForStencil(gn, 'os operating system image', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'poster_arrow;fillColor=#00BCF2;',
					20, 50, '', 'Poster Arrow', null, null, this.getTagsForStencil(gn, 'poster arrow', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus;fillColor=#0078D7;',
					45, 50, '', 'Service Bus', null, null, this.getTagsForStencil(gn, 'service bus', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_queues;fillColor=#0078D7;',
					42, 50, '', 'Service Bus Queues', null, null, this.getTagsForStencil(gn, 'service bus queues', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_relay;fillColor=#0078D7;',
					40, 50, '', 'Service Bus Relay', null, null, this.getTagsForStencil(gn, 'service bus relay', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_bus_topics_and_subscriptions;fillColor=#0078D7;',
					45, 50, '', 'Service Bus Topic', null, null, this.getTagsForStencil(gn, 'service bus topic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'certificate;fillColor=#00BEF2;',
					50, 40, '', 'Service Certificate', null, null, this.getTagsForStencil(gn, 'service certificate', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sql_data_warehouse;fillColor=#0078D7;',
					44, 50, '', 'SQL Data Warehouse', null, null, this.getTagsForStencil(gn, 'sql data warehouse', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sql_server_stretch_db;fillColor=#0078D7;',
					50, 49, '', 'SQL Server Stretch DB', null, null, this.getTagsForStencil(gn, 'sql server stretch db database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sql_reporting;fillColor=#0078D7;',
					40, 50, '', 'SQL Reporting', null, null, this.getTagsForStencil(gn, 'sql reporting', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vhd;fillColor=#0078D7;',
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
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.enterprise.';
		var s3 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.enterprise';
		var dt = 'ms microsoft cloud enterprise ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'ad_fs;fillColor=#00188D;',
					40, 50, '', 'AD FS', null, null, this.getTagsForStencil(gn, 'ad fs', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'android_phone;fillColor=#7D7D7D;',
					30, 50, '', 'Android Phone', null, null, this.getTagsForStencil(gn, 'android phone mobile', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'app_generic;fillColor=#00188D;',
					50, 39, '', 'App (generic)', null, null, this.getTagsForStencil(gn, 'app generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application;fillColor=#00188D;',
					50, 34, '', 'Application', null, null, this.getTagsForStencil(gn, 'application app', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_blank;fillColor=#00188D;',
					50, 43, '', 'Application (blank)', null, null, this.getTagsForStencil(gn, 'application app blank', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_server;fillColor=#00188D;',
					43, 50, '', 'Application Server', null, null, this.getTagsForStencil(gn, 'application app server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_server2;fillColor=#00188D;',
					43, 50, '', 'Application Server', null, null, this.getTagsForStencil(gn, 'application app server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'backup_local;fillColor=#00188D;',
					49, 50, '', 'Backup (local)', null, null, this.getTagsForStencil(gn, 'backup local', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'backup_online;fillColor=#00188D;',
					50, 40, '', 'Backup (online)', null, null, this.getTagsForStencil(gn, 'backup online', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'calendar;fillColor=#00188D;',
					50, 41, '', 'Calendar', null, null, this.getTagsForStencil(gn, 'calendar', dt).join(' ')),
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
					37, 50, '', 'Database (generic)', null, null, this.getTagsForStencil(gn, 'db database generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'database_server;fillColor=#00188D;',
					38, 50, '', 'Database (server)', null, null, this.getTagsForStencil(gn, 'db database server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'database_synchronization;fillColor=#00188D;',
					39, 50, '', 'Database Synchronization', null, null, this.getTagsForStencil(gn, 'database synchronization sync db', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'device;fillColor=#00188D;',
					50, 26, '', 'Device', null, null, this.getTagsForStencil(gn, 'Device', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'direct_access_feature;fillColor=#00188D;',
					50, 44, '', 'Direct Access (feature)', null, null, this.getTagsForStencil(gn, 'direct access feature', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'document;fillColor=#7D7D7D;',
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
			this.createVertexTemplateEntry(s2 + 'folder;fillColor=#7D7D7D;',
					50, 43, '', 'Folder', null, null, this.getTagsForStencil(gn, 'folder', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'gateway;fillColor=#00188D;',
					50, 50, '', 'Gateway', null, null, this.getTagsForStencil(gn, 'gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'code_file;fillColor=#00188D;',
					47, 50, '', 'Generic Code', null, null, this.getTagsForStencil(gn, 'generic code', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'code_file;fillColor=#00188D;',
					49, 50, '', 'Generic Code File', null, null, this.getTagsForStencil(gn, 'code file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'health_monitoring;fillColor=#7D7D7D;',
					50, 42, '', 'Health Monitoring', null, null, this.getTagsForStencil(gn, 'health monitoring', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'healthy;fillColor=#7D7D7D;',
					50, 45, '', 'Healthy', null, null, this.getTagsForStencil(gn, 'healthy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'healthy;fillColor=#0078D7;',
					50, 45, '', 'Healthy', null, null, this.getTagsForStencil(gn, 'healthy', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'import_generic;fillColor=#00188D;',
					40, 50, '', 'Import (generic)', null, null, this.getTagsForStencil(gn, 'import generic', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'internet;fillColor=#7D7D7D;',
					50, 31, '', 'Internet', null, null, this.getTagsForStencil(gn, 'internet', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'internet_hollow;fillColor=#7D7D7D;',
					50, 31, '', 'Internet (hollow)', null, null, this.getTagsForStencil(gn, 'internet hollow', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'iphone;fillColor=#7D7D7D;',
					31, 50, '', 'iPhone', null, null, this.getTagsForStencil(gn, 'iphone', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'key_permissions;fillColor=#7D7D7D;',
					26, 50, '', 'Key, Permissions', null, null, this.getTagsForStencil(gn, 'key permissions', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'keyboard;fillColor=#7D7D7D;',
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
			this.createVertexTemplateEntry(s2 + 'mouse;fillColor=#7D7D7D;',
					30, 50, '', 'Mouse', null, null, this.getTagsForStencil(gn, 'mouse', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'network_card;fillColor=#00188D;',
					50, 35, '', 'Network Card', null, null, this.getTagsForStencil(gn, 'network card', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'not_allowed;fillColor=#00188D;',
					50, 50, '', 'Not Allowed', null, null, this.getTagsForStencil(gn, 'not allowed', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'not_allowed;fillColor=#EA1C24;',
					50, 50, '', 'Not Allowed', null, null, this.getTagsForStencil(gn, 'not allowed', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'pack;fillColor=#00188D;',
					50, 45, '', 'Pack', null, null, this.getTagsForStencil(gn, 'pack', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'performance;fillColor=#7D7D7D;',
					50, 50, '', 'Performance', null, null, this.getTagsForStencil(gn, 'performance', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'performance_monitor;fillColor=#00188D;',
					50, 36, '', 'Performance Monitor', null, null, this.getTagsForStencil(gn, 'performance monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mobile;fillColor=#7D7D7D;',
					35, 50, '', 'Phone', null, null, this.getTagsForStencil(gn, 'mobile phone', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'plug_and_play;fillColor=#7D7D7D;',
					40, 50, '', 'Plug and Play', null, null, this.getTagsForStencil(gn, 'plug play', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'powershell_file;fillColor=#00188D;',
					47, 50, '', 'PowerShell Script File', null, null, this.getTagsForStencil(gn, 'powershell script file', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'protocol_stack;fillColor=#00188D;',
					50, 34, '', 'Protocol Stack', null, null, this.getTagsForStencil(gn, 'protocol stack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'queue_generic;fillColor=#00188D;',
					50, 15, '', 'Queue (general)', null, null, this.getTagsForStencil(gn, 'queue general generic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rdp_remoting_file;fillColor=#0078D7;',
					48, 50, '', 'RPD Remoting File', null, null, this.getTagsForStencil(gn, 'rpd remoting file', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'rms_connector;fillColor=#00188D;',
					38, 50, '', 'RMS Connector', null, null, this.getTagsForStencil(gn, 'rms connector', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'router;fillColor=#00188D;',
					50, 39, '', 'Router', null, null, this.getTagsForStencil(gn, 'router', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'script_file;fillColor=#00188D;',
					47, 50, '', 'Script File', null, null, this.getTagsForStencil(gn, 'script file', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'secondary_site;fillColor=#00188D;',
					42, 50, '', 'Secondary Site', null, null, this.getTagsForStencil(gn, 'secondary site', dt).join(' ')),
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
			this.createVertexTemplateEntry(s2 + 'stored_procedures;fillColor=#0078D7;',
					47, 50, '', 'Stored Procedures', null, null, this.getTagsForStencil(gn, 'stored procedures', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'table;fillColor=#00188D;',
					50, 50, '', 'Table', null, null, this.getTagsForStencil(gn, 'table', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tablet;fillColor=#7D7D7D;',
					50, 37, '', 'Tablet', null, null, this.getTagsForStencil(gn, 'tablet', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'tool;fillColor=#7D7D7D;',
					50, 45, '', 'Tool', null, null, this.getTagsForStencil(gn, 'tool', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'triggers;fillColor=#0078D7;',
					47, 50, '', 'Triggers', null, null, this.getTagsForStencil(gn, 'triggers', dt).join(' ')),
			this.createVertexTemplateEntry('shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.mscae.general.tunnel;fillColor=#00188D;',
					50, 9, '', 'Tunnel', null, null, this.getTagsForStencil(gn, 'tunnel', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'udf_function;fillColor=#0078D7;',
					47, 50, '', 'UDF Function', null, null, this.getTagsForStencil(gn, 'udf function', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'unhealthy;fillColor=#00188D;',
					50, 41, '', 'Unhealthy', null, null, this.getTagsForStencil(gn, 'unhealthy', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'usb;fillColor=#00188D;',
					50, 23, '', 'USB', null, null, this.getTagsForStencil(gn, 'usb', dt).join(' ')),
			this.createVertexTemplateEntry('shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.azure.user;fillColor=#00188D;',
					47, 50, '', 'User', null, null, this.getTagsForStencil(gn, 'user', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'user_permissions;fillColor=#0078D7;',
					47, 50, '', 'User Permissions', null, null, this.getTagsForStencil(gn, 'user permissions', dt).join(' ')),//zzz
			this.createVertexTemplateEntry('shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.mscae.general.video;fillColor=#00188D;',
					49, 50, '', 'Video', null, null, this.getTagsForStencil(gn, 'video', dt).join(' ')),
			this.createVertexTemplateEntry('shadow=0;dashed=0;html=1;strokeColor=none;shape=mxgraph.azure.virtual_machine_feature;fillColor=#00188D;',
					50, 45, '', 'Virtual Machine Feature', null, null, this.getTagsForStencil(gn, 'virtual machine feature', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'web;fillColor=#00188D;',
					50, 50, '', 'Web', null, null, this.getTagsForStencil(gn, 'web', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'web_server;fillColor=#00188D;',
					38, 50, '', 'Web Server', null, null, this.getTagsForStencil(gn, 'web server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'website_generic;fillColor=#7D7D7D;',
					50, 44, '', 'Website (generic)', null, null, this.getTagsForStencil(gn, 'website generic', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'other.windows;fillColor=#00188D;',
					48, 50, '', 'Windows', null, null, this.getTagsForStencil(gn, 'windows', dt).join(' ')),
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
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.general.';
		var s3 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';
		var s4 = 'shadow=0;dashed=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.general.';

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
	
	Sidebar.prototype.addMSCAEGeneralSymbolsPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.general_symbols.';
		var s3 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';
		var s4 = 'shadow=0;dashed=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.general_symbols.';
		var s5 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.general_symbols';
		var dt = 'ms microsoft cloud enterprise general symbols ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'attachments;fillColor=#7D7D7D;',
					29, 50, '', 'Attachments', null, null, this.getTagsForStencil(gn, 'attachments', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.audio;fillColor=#7D7D7D;',
					50, 50, '', 'Audio', null, null, this.getTagsForStencil(gn, 'audio', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.bug;fillColor=#7D7D7D;',
					50, 50, '', 'Bug', null, null, this.getTagsForStencil(gn, 'bug', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.cable_settop_tv_box;fillColor=#7D7D7D;',
					50, 24, '', 'Cable Settop Box', null, null, this.getTagsForStencil(gn, 'cable settop box', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.calendar;fillColor=#7D7D7D;',
					50, 40, '', 'Calendar', null, null, this.getTagsForStencil(gn, 'calendar', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.chart;fillColor=#7D7D7D;',
					50, 48, '', 'Chart', null, null, this.getTagsForStencil(gn, 'chart', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.checkmark;fillColor=#92D050;',
					41, 50, '', 'Checkmark', null, null, this.getTagsForStencil(gn, 'checkmark', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'clock_time;fillColor=#0078D7;',
					50, 50, '', 'Clock / Time', null, null, this.getTagsForStencil(gn, 'clock time', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.continuous_cycle;fillColor=#7D7D7D;',
					48, 50, '', 'Continuous Cycle', null, null, this.getTagsForStencil(gn, 'continuous cycle', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'general.crossout;fillColor=#FF0000;',
					40, 50, '', 'Crossout (failure)', null, null, this.getTagsForStencil(gn, 'crossout failure', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.cut_and_paste;fillColor=#7D7D7D;',
					50, 34, '', 'Cut and Paste', null, null, this.getTagsForStencil(gn, 'cut and paste', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'ellipses;fillColor=#0078D7;',
					50, 7, '', 'Ellipses', null, null, this.getTagsForStencil(gn, 'ellipses', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'favorite;fillColor=#FDE57B;',
					14, 20, '', 'Favorite', null, null, this.getTagsForStencil(gn, 'favorite', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'enterprise.folder;fillColor=#7D7D7D;',
					50, 43, '', 'Folder', null, null, this.getTagsForStencil(gn, 'folder', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.game_controller;fillColor=#7D7D7D;',
					50, 35, '', 'Game Controller', null, null, this.getTagsForStencil(gn, 'game controller', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'gears;fillColor=#7D7D7D;',
					50, 42, '', 'Gears', null, null, this.getTagsForStencil(gn, 'gears', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.graph;fillColor=#7D7D7D;',
					50, 50, '', 'Graph', null, null, this.getTagsForStencil(gn, 'graph', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.like;fillColor=#7D7D7D;',
					50, 47, '', 'Like', null, null, this.getTagsForStencil(gn, 'like', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'enterprise.not_allowed;fillColor=#DD5900;',
					50, 50, '', 'Not Allowed', null, null, this.getTagsForStencil(gn, 'not allowed', dt).join(' ')),
			this.createVertexTemplateEntry('shadow=0;dashed=0;html=1;shape=ellipse;perimeter=ellipsePerimeter;dashPattern=1 4;strokeColor=none;fillColor=#92D050;fontSize=12;fontColor=#FFFFFF;align=center;spacing=0;fontStyle=1;',
					25, 25, '12', 'Numbered Label', null, null, this.getTagsForStencil(gn, 'numbered label', dt).join(' ')),
			this.createVertexTemplateEntry('shadow=0;dashed=0;html=1;shape=ellipse;perimeter=ellipsePerimeter;dashPattern=1 4;strokeColor=none;fillColor=#E90D8B;fontSize=12;fontColor=#FFFFFF;align=center;spacing=0;fontStyle=1;',
					25, 25, '1', 'Number Magenta', null, null, this.getTagsForStencil(gn, 'numbered label', dt).join(' ')),
			this.createVertexTemplateEntry('shadow=0;dashed=0;html=1;shape=ellipse;perimeter=ellipsePerimeter;dashPattern=1 4;strokeColor=none;fillColor=#FF8C00;fontSize=12;fontColor=#FFFFFF;align=center;spacing=0;fontStyle=1;',
					25, 25, '1', 'Number Orange', null, null, this.getTagsForStencil(gn, 'numbered orange', dt).join(' ')),
			this.createVertexTemplateEntry('shadow=0;dashed=0;html=1;shape=ellipse;perimeter=ellipsePerimeter;dashPattern=1 4;strokeColor=none;fillColor=#C00000;fontSize=12;fontColor=#FFFFFF;align=center;spacing=0;fontStyle=1;',
					25, 25, '1', 'Number Label', null, null, this.getTagsForStencil(gn, 'numbered label', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'num_label_rotate;fillColor=#92D050;fontSize=12;fontColor=#FFFFFF;align=center;spacing=0;fontStyle=1;',
					25, 25, '12', 'Numbered Label Rotate Pointer', null, null, this.getTagsForStencil(gn, 'num label rotate', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'premium_star;fillColor=#FDE57B;',
					12, 11, '', 'Premium Star', null, null, this.getTagsForStencil(gn, 'premium star', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider_bar_horz;fillColor=#7D7D7D;',
					81, 30, '', 'Slider Bar (horizontal)', null, null, this.getTagsForStencil(gn, 'slider bar horizontal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider_bar_vert;fillColor=#7D7D7D;',
					35, 80, '', 'Slider Bar (vertical)', null, null, this.getTagsForStencil(gn, 'slider bar vertical', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.task_list;fillColor=#7D7D7D;',
					41, 50, '', 'Task List', null, null, this.getTagsForStencil(gn, 'task list', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.tasks;fillColor=#7D7D7D;',
					38, 50, '', 'Tasks', null, null, this.getTagsForStencil(gn, 'tasks', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.tunnel;fillColor=#7D7D7D;',
					50, 9, '', 'Tunnel', null, null, this.getTagsForStencil(gn, 'tunnel', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'user;fillColor=#7D7D7D;',
					47, 50, '', 'User', null, null, this.getTagsForStencil(gn, 'user', dt).join(' ')),
			this.createVertexTemplateEntry(s5 + 'general.video;fillColor=#7D7D7D;',
					49, 50, '', 'Video', null, null, this.getTagsForStencil(gn, 'video', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'waiting;fillColor=#7D7D7D;',
					46, 50, '', 'Waiting', null, null, this.getTagsForStencil(gn, 'waiting', dt).join(' '))
		];
			
		this.addPalette('mscaeGeneral Symbols', 'CAE / General Symbols', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMSCAEIntunePalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.intune.';
		var s3 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.intune';
		var dt = 'ms microsoft cloud enterprise intune';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'account_portal;fillColor=#505050;',
					43, 50, '', 'Account Portal', null, null, this.getTagsForStencil(gn, 'account portal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'administration;fillColor=#505050;',
					30, 50, '', 'Administration', null, null, this.getTagsForStencil(gn, 'administration', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'alerts;fillColor=#505050;',
					50, 50, '', 'Alerts', null, null, this.getTagsForStencil(gn, 'alerts', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'apps;fillColor=#505050;',
					50, 50, '', 'Apps', null, null, this.getTagsForStencil(gn, 'apps', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'certificate;fillColor=#505050;',
					50, 49, '', 'Certificate (Compliance)', null, null, this.getTagsForStencil(gn, 'certificate compliance', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'client_software;fillColor=#505050;',
					50, 45, '', 'Client Software Deployment Wizard', null, null, this.getTagsForStencil(gn, 'client software deployment wizard', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'company_portal;fillColor=#505050;',
					50, 38, '', 'Company Portal', null, null, this.getTagsForStencil(gn, 'company portal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'computer_inventory;fillColor=#505050;',
					50, 45, '', 'Computer Inventory', null, null, this.getTagsForStencil(gn, 'computer inventory', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'conditional_access_exchange;fillColor=#505050;',
					49, 50, '', 'Conditional Access (Exchange)', null, null, this.getTagsForStencil(gn, 'conditional access exchange', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'conditional_access_sharepoint;fillColor=#505050;',
					44, 50, '', 'Conditional Access (Sharepoint)', null, null, this.getTagsForStencil(gn, 'conditional access sharepoint', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'connector;fillColor=#505050;',
					50, 17, '', 'Connector', null, null, this.getTagsForStencil(gn, 'connector', dt).join(' ')),
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
			this.createVertexTemplateEntry(s3 + 'enterprise.internet;fillColor=#ffffff;strokeColor=#7f7f7f;',
					50, 31, '', 'Expandable Cloud', null, null, this.getTagsForStencil(gn, 'expandable cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'groups;fillColor=#505050;',
					50, 48, '', 'Groups', null, null, this.getTagsForStencil(gn, 'groups', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'hybrid;fillColor=#505050;',
					50, 39, '', 'Hybrid', null, null, this.getTagsForStencil(gn, 'hybrid', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_certificate_profiles;fillColor=#505050;',
					40, 50, '', 'Intune Certificate Profiles', null, null, this.getTagsForStencil(gn, 'certificate profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_connector;fillColor=#505050;',
					82, 59, '', 'Intune Connector', null, null, this.getTagsForStencil(gn, 'intune connector', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_email_profiles;fillColor=#505050;',
					50, 50, '', 'Intune Email Profiles', null, null, this.getTagsForStencil(gn, 'email profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_managed_app;fillColor=#505050;',
					50, 38, '', 'Intune Managed App', null, null, this.getTagsForStencil(gn, 'managed app application', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_mobile_application_management;fillColor=#505050;',
					49, 50, '', 'Intune Mobile Application Management', null, null, this.getTagsForStencil(gn, 'mobile app aplication management', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_vpn_profiles;fillColor=#505050;',
					42, 50, '', 'Intune VPN Profiles', null, null, this.getTagsForStencil(gn, 'vpn virtual private network profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'intune_wifi_profiles;fillColor=#505050;',
					43, 50, '', 'Intune WiFi Profiles', null, null, this.getTagsForStencil(gn, 'wifi profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'inventory_license;fillColor=#505050;',
					50, 48, '', 'Inventory License', null, null, this.getTagsForStencil(gn, 'inventory license', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'inventory_software;fillColor=#505050;',
					50, 49, '', 'Inventory Software', null, null, this.getTagsForStencil(gn, 'inventory software', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'license_group;fillColor=#505050;',
					50, 49, '', 'License Group', null, null, this.getTagsForStencil(gn, 'license group', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'license_installation;fillColor=#505050;',
					50, 43, '', 'License Installation', null, null, this.getTagsForStencil(gn, 'license installation', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'microsoft_intune;fillColor=#505050;',
					50, 40, '', 'MS Intune', null, null, this.getTagsForStencil(gn, 'microsoft', dt).join(' ')),
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
					50, 50, '', 'Subscription Portal', null, null, this.getTagsForStencil(gn, 'subscription portal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'terms_and_conditions;fillColor=#505050;',
					37, 50, '', 'Terms and Conditions', null, null, this.getTagsForStencil(gn, 'terms and conditions', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'update;fillColor=#505050;',
					48, 50, '', 'Update', null, null, this.getTagsForStencil(gn, 'update', dt).join(' ')),
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
	
	Sidebar.prototype.addMSCAEOMSPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.oms.';
		var s3 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.oms';
		var dt = 'ms microsoft cloud enterprise oms';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'alerts;fillColor=#505050;',
					41, 50, '', 'Alerts', null, null, this.getTagsForStencil(gn, 'alerts', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'app_with_changes;fillColor=#505050;',
					50, 32, '', 'App With Changes', null, null, this.getTagsForStencil(gn, 'app with changes', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'assessments;fillColor=#505050;',
					47, 50, '', 'Assessments', null, null, this.getTagsForStencil(gn, 'assessments', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'capacity;fillColor=#505050;',
					41, 50, '', 'Capacity', null, null, this.getTagsForStencil(gn, 'capacity', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'config_assessment;fillColor=#505050;',
					50, 45, '', 'Config Assessment', null, null, this.getTagsForStencil(gn, 'config assessment', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'dashboard;fillColor=#505050;',
					50, 41, '', 'Dashboard', null, null, this.getTagsForStencil(gn, 'dashboard', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'dependency_monitor;fillColor=#505050;',
					50, 49, '', 'Dependency Monitor', null, null, this.getTagsForStencil(gn, 'dependency monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'diagnostics;fillColor=#505050;',
					50, 34, '', 'Diagnostics', null, null, this.getTagsForStencil(gn, 'diagnostics', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'jobs;fillColor=#505050;',
					50, 50, '', 'Jobs', null, null, this.getTagsForStencil(gn, 'jobs', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'log_management;fillColor=#505050;',
					41, 50, '', 'Log Management', null, null, this.getTagsForStencil(gn, 'log management', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'log_search;fillColor=#505050;',
					50, 50, '', 'Log Search', null, null, this.getTagsForStencil(gn, 'log search', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'malware_assessment;fillColor=#505050;',
					49, 50, '', 'Malware Assessment', null, null, this.getTagsForStencil(gn, 'malware assessment', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'overview;fillColor=#505050;',
					50, 41, '', 'Overview', null, null, this.getTagsForStencil(gn, 'overview', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'cloud.runbooks;fillColor=#505050;',
					46, 50, '', 'Runbooks', null, null, this.getTagsForStencil(gn, 'runbooks', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'security;fillColor=#505050;',
					50, 50, '', 'Security', null, null, this.getTagsForStencil(gn, 'security', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'server_width_changes;fillColor=#505050;',
					47, 50, '', 'Server Width Changes', null, null, this.getTagsForStencil(gn, 'server width changes', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'services;fillColor=#505050;',
					49, 50, '', 'Services', null, null, this.getTagsForStencil(gn, 'services', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'solutions;fillColor=#505050;',
					50, 49, '', 'Solutions', null, null, this.getTagsForStencil(gn, 'solutions', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'system_update;fillColor=#505050;',
					50, 50, '', 'System Update', null, null, this.getTagsForStencil(gn, 'system update', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'track_changes;fillColor=#505050;',
					42, 50, '', 'Track Changes', null, null, this.getTagsForStencil(gn, 'track changes', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'wire_data;fillColor=#505050;',
					50, 50, '', 'Wire Data', null, null, this.getTagsForStencil(gn, 'wire data', dt).join(' '))
		];
			
		this.addPalette('mscaeOMS', 'CAE / OMS', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMSCAEOpsManagerPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.opsmanager.';
		var s3 = 'shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.opsmanager';
		var dt = 'ms microsoft cloud enterprise opsmanager ops manager operations';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'advanced_group_policy_management;fillColor=#0078D7;',
					48, 50, '', 'Advanced Group Policy Management', null, null, this.getTagsForStencil(gn, 'advanced group policy management', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'applications;fillColor=#0078D7;',
					49, 50, '', 'Applications', null, null, this.getTagsForStencil(gn, 'applications', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_virtualization;fillColor=#0078D7;',
					50, 50, '', 'Application Virtualization', null, null, this.getTagsForStencil(gn, 'application virtualization', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'app_controller;fillColor=#0078D7;',
					50, 43, '', 'App Controller', null, null, this.getTagsForStencil(gn, 'app controller', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'configuration_manager;fillColor=#0078D7;',
					46, 50, '', 'Configuration Manager', null, null, this.getTagsForStencil(gn, 'configuration manager', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'data_protection_manager;fillColor=#0078D7;',
					44, 50, '', 'Data Protection Manager', null, null, this.getTagsForStencil(gn, 'data protection manager', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'middleware;fillColor=#0078D7;',
					50, 34, '', 'Middleware', null, null, this.getTagsForStencil(gn, 'middleware', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'ms_bitlocker_administration_and_management;fillColor=#0078D7;',
					46, 50, '', 'MS Bitlocker Administration and management', null, null, this.getTagsForStencil(gn, 'bitlocker administration and management', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'ms_diagnostics_and_recovery_toolset;fillColor=#0078D7;',
					50, 48, '', 'MS Diagnostics and Recovery Toolset', null, null, this.getTagsForStencil(gn, 'diagnostics and recovery toolset', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'ms_enterprise_desktop_virtualization;fillColor=#0078D7;',
					50, 50, '', 'MS Enterprise Desktop Virtualization', null, null, this.getTagsForStencil(gn, 'enterprise desktop virtualization', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'ms_user_experience_virtualization;fillColor=#0078D7;',
					50, 48, '', 'MS User Experience Virtualization', null, null, this.getTagsForStencil(gn, 'user experience virtualization', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'operations_manager;fillColor=#0078D7;',
					48, 50, '', 'Operations Manager', null, null, this.getTagsForStencil(gn, 'operations manager', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'orchestrator;fillColor=#0078D7;',
					50, 34, '', 'Orchestrator', null, null, this.getTagsForStencil(gn, 'orchestrator', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'pack;fillColor=#0078D7;',
					44, 50, '', 'Pack', null, null, this.getTagsForStencil(gn, 'pack', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'enterprise.plug_and_play;fillColor=#0078D7;',
					40, 50, '', 'Plug and Play', null, null, this.getTagsForStencil(gn, 'plug and play', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'runtime;fillColor=#0078D7;',
					50, 35, '', 'Runtime', null, null, this.getTagsForStencil(gn, 'runtime', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'service_manager;fillColor=#0078D7;',
					50, 36, '', 'Service Manager', null, null, this.getTagsForStencil(gn, 'service manager', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'general_symbols.slider_bar_vert;fillColor=#0078D7;',
					22, 50, '', 'Slider Bar (vertical)', null, null, this.getTagsForStencil(gn, 'slider bar vertical hor', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'general_symbols.slider_bar_horz;fillColor=#0078D7;',
					50, 21, '', 'Slider Bar (horizontal)', null, null, this.getTagsForStencil(gn, 'slider bar horizontal hor', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'ssd;fillColor=#0078D7;',
					50, 41, '', 'SSD', null, null, this.getTagsForStencil(gn, 'ssd solid state drive', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'virtual_machine_manager;fillColor=#0078D7;',
					50, 38, '', 'Virtual Machine Manager', null, null, this.getTagsForStencil(gn, 'virtual machine manager', dt).join(' '))
		];
			
		this.addPalette('mscaeOpsManager', 'CAE / OpsManager', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addMSCAEOtherPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;strokeColor=none;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.other.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.other';
		var dt = 'ms microsoft cloud enterprise other';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'access;fillColor=#BA2024;',
					50, 50, '', 'Access', null, null, this.getTagsForStencil(gn, 'access', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'bi_product_icon;fillColor=#000000;',
					47, 50, '', 'BI Product Icon', null, null, this.getTagsForStencil(gn, 'bi product icon', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cortana;fillColor=#2CACE2;',
					50, 50, '', 'Cortana', null, null, this.getTagsForStencil(gn, 'cortana', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'excel;fillColor=#008540;',
					50, 50, '', 'Excel', null, null, this.getTagsForStencil(gn, 'excel', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'exchange;fillColor=#2471BA;',
					50, 48, '', 'Exchange', null, null, this.getTagsForStencil(gn, 'exchange', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'lync;fillColor=#2471BA;',
					50, 48, '', 'Lync', null, null, this.getTagsForStencil(gn, 'lync', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'microsoft;',
					50, 50, '', 'Microsoft', null, null, this.getTagsForStencil(gn, 'microsoft', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'outlook;fillColor=#2471BA;',
					50, 50, '', 'Outlook', null, null, this.getTagsForStencil(gn, 'outlook', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'powerappsicon;fillColor=#992065;',
					50, 50, '', 'PowerAppsIcon', null, null, this.getTagsForStencil(gn, 'powerappsicon power apps applications icon', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'powerpoint;fillColor=#DE5D24;',
					50, 50, '', 'PowerPoint', null, null, this.getTagsForStencil(gn, 'powerpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sharepoint;fillColor=#2471BA;',
					50, 49, '', 'Sharepoint', null, null, this.getTagsForStencil(gn, 'sharepoint', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'skype;fillColor=#00AEF2;',
					50, 50, '', 'Skype', null, null, this.getTagsForStencil(gn, 'skype', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'windows;fillColor=#00188D;',
					48, 50, '', 'Windows', null, null, this.getTagsForStencil(gn, 'windows', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'word;fillColor=#2C3481;',
					50, 50, '', 'Word', null, null, this.getTagsForStencil(gn, 'word', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'xbox;fillColor=#91D250;',
					50, 48, '', 'Xbox', null, null, this.getTagsForStencil(gn, 'xbox', dt).join(' ')),
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
		var s = 'shadow=0;dashed=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;strokeColor=none;shape=mxgraph.mscae.system_center.';
		var s3 = 'shadow=0;dashed=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.system_center';
		var dt = 'ms microsoft cloud enterprise system center';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'admin_console;fillColor=#515151;strokeColor=none;',
					50, 36, '', 'Admin Console', null, null, this.getTagsForStencil(gn, 'admin console', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'enterprise.database_server;fillColor=#515151;strokeColor=none;',
					38, 50, '', 'Central Administration Site', null, null, this.getTagsForStencil(gn, 'central administration site', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'central_administration_site_sql;fillColor=#515151;strokeColor=none;',
					38, 50, '', 'Central Administration Site SQL', null, null, this.getTagsForStencil(gn, 'central administration site sql', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cloud_distribution_point;fillColor=#515151;strokeColor=none;',
					46, 50, '', 'Cloud Distribution Point', null, null, this.getTagsForStencil(gn, 'cloud distribution point', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'distribution_point;fillColor=#515151;strokeColor=none;',
					44, 50, '', 'Distribution Point', null, null, this.getTagsForStencil(gn, 'distribution point', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'management_point;fillColor=#515151;strokeColor=none;',
					48, 50, '', 'Management Point', null, null, this.getTagsForStencil(gn, 'management point', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'primary_site;fillColor=#515151;strokeColor=none;',
					38, 50, '', 'Primary Site', null, null, this.getTagsForStencil(gn, 'primary site', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'roles;fillColor=#515151;strokeColor=none;',
					42, 50, '', 'Roles', null, null, this.getTagsForStencil(gn, 'roles', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'secondary_site;fillColor=#515151;strokeColor=none;',
					41, 50, '', 'Secondary Site', null, null, this.getTagsForStencil(gn, 'secondary site', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'software_update_point;fillColor=#515151;strokeColor=none;',
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
	
	Sidebar.prototype.addMSCAEVMPalette = function()
	{
		var s = 'shadow=0;dashed=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.azure.';
		var s2 = 'shadow=0;dashed=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;strokeColor=none;shape=mxgraph.mscae.vm.';
		var s3 = 'shadow=0;dashed=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.mscae.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.mscae.vm';
		var dt = 'ms microsoft cloud enterprise vm virtual machine ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'active_directory;fillColor=#00188F;strokeColor=none;',
					50, 41, '', 'Active Directory', null, null, this.getTagsForStencil(gn, 'active directory', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'active_directory_multi;fillColor=#00188F;strokeColor=none;',
					58, 50, '', 'Active Directory (multi)', null, null, this.getTagsForStencil(gn, 'active directory multi', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_server;fillColor=#00188F;strokeColor=none;',
					50, 41, '', 'Application Server', null, null, this.getTagsForStencil(gn, 'application server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'application_server_multi;fillColor=#00188F;strokeColor=none;',
					58, 50, '', 'Application Server (multi)', null, null, this.getTagsForStencil(gn, 'application server multi', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'database_server;fillColor=#00188F;strokeColor=none;',
					50, 41, '', 'Database Server', null, null, this.getTagsForStencil(gn, 'database server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'database_server_multi;fillColor=#00188F;strokeColor=none;',
					58, 50, '', 'Database Server (multi)', null, null, this.getTagsForStencil(gn, 'database server multi', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'directory_server;fillColor=#00188F;strokeColor=none;',
					50, 41, '', 'Directory Server', null, null, this.getTagsForStencil(gn, 'directory server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'directory_server_multi;fillColor=#00188F;strokeColor=none;',
					58, 50, '', 'Directory Server (multi)', null, null, this.getTagsForStencil(gn, 'directory server multi', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'domain_server;fillColor=#00188F;strokeColor=none;',
					50, 41, '', 'Domain Server', null, null, this.getTagsForStencil(gn, 'domain server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'domain_server_multi;fillColor=#00188F;strokeColor=none;',
					58, 50, '', 'Domain Server (multi)', null, null, this.getTagsForStencil(gn, 'domain server multi', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'file_server2;fillColor=#00188F;strokeColor=none;',
					50, 41, '', 'File Server', null, null, this.getTagsForStencil(gn, 'file server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'file_server;fillColor=#00188F;strokeColor=none;',
					50, 41, '', 'File Server', null, null, this.getTagsForStencil(gn, 'file server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'file_server_multi;fillColor=#00188F;strokeColor=none;',
					58, 50, '', 'File Server (multi)', null, null, this.getTagsForStencil(gn, 'file server multi', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'web_server;fillColor=#00188F;strokeColor=none;',
					50, 41, '', 'Web Server', null, null, this.getTagsForStencil(gn, 'web server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'web_server_multi;fillColor=#00188F;strokeColor=none;',
					58, 50, '', 'Web Server (multi)', null, null, this.getTagsForStencil(gn, 'web server multi', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'windows_server;fillColor=#00188F;strokeColor=none;',
					50, 41, '', 'Windows Server', null, null, this.getTagsForStencil(gn, 'windows server', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'windows_server_multi;fillColor=#00188F;strokeColor=none;',
					58, 50, '', 'Windows Server (multi)', null, null, this.getTagsForStencil(gn, 'windows server multi', dt).join(' '))
		];
			
		this.addPalette('mscaeVirtual Machine', 'CAE / Virtual Machine', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addMSCAECloudColorPalette = function()
	{
		var d = 50;
		var dt = 'ms microsoft cloud enterprise color ';
		var sb = this;
		var s = 'aspect=fixed;html=1;perimeter=none;align=center;shadow=0;dashed=0;image;fontSize=12;image=img/lib/mscae/';
		var gn = 'mxgraph.mscae';

		var fns =
		[
			 this.createVertexTemplateEntry(s + 'Active_Directory.svg;',
					 d, d, '', 'Active Directory', false, null, this.getTagsForStencil(gn, 'active directory', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'ActiveDirectory.svg;',
					 d, d, '', 'Active Directory', false, null, this.getTagsForStencil(gn, 'active directory', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Active_Directory_Health_Monitoring.svg;',
					 d, d, '', 'Active Directory - Health Monitoring', false, null, this.getTagsForStencil(gn, 'active directory health monitoring', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'ActiveDirectoryDomain.svg;',
					 d, d, '', 'Active Directory - Domain', false, null, this.getTagsForStencil(gn, 'active directory domain', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'API_Management.svg;',
					 d, d * 0.83, '', 'API Management', false, null, this.getTagsForStencil(gn, 'api management application programming interface', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'App_Service.svg;',
					 d, d, '', 'App Service', false, null, this.getTagsForStencil(gn, 'app service', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'App_Service_API_Apps.svg;',
					 d, d, '', 'App Service - API Apps', false, null, this.getTagsForStencil(gn, 'app service api apps application programmming interface', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'App_Service_Mobile_App.svg;',
					 d, d, '', 'App Service - Mobile App', false, null, this.getTagsForStencil(gn, 'app service mobile application', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'App_Service_Worker_Pools.svg;',
					 d, d, '', 'App Service - Worker Pools', false, null, this.getTagsForStencil(gn, 'app service worker pools application', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Application_Gateway.svg;',
					 d, d, '', 'Application Gateway', false, null, this.getTagsForStencil(gn, 'application app gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Application_Insights.svg;',
					 d, d, '', 'Application Insights', false, null, this.getTagsForStencil(gn, 'application app insights', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Automation.svg;',
					 d, d, '', 'Automation', false, null, this.getTagsForStencil(gn, 'automation', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Backup.svg;',
					 d, d, '', 'Backup', false, null, this.getTagsForStencil(gn, 'backup', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'BizTalk_Services.svg;',
					 d, d, '', 'BizTalk Services', false, null, this.getTagsForStencil(gn, 'biztalk services', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'BizTalk_Services_Hybrid_Connections.svg;',
					 d, d, '', 'BizTalk Services - Hybrid Connections', false, null, this.getTagsForStencil(gn, 'biztalk services hybrid connections', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Blockchain.svg;',
					 d, d, '', 'Blockchain', false, null, this.getTagsForStencil(gn, 'blockchain', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Building_Blocks.svg;',
					 d, d, '', 'Building Blocks', false, null, this.getTagsForStencil(gn, 'building blocks', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cache_including_Redis.svg;',
					 d, d, '', 'Cache (including Redis)', false, null, this.getTagsForStencil(gn, 'Cache including Redis', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cache_Redis_Product.svg;',
					 d, d, '', 'Cache (Redis Product)', false, null, this.getTagsForStencil(gn, 'cache redis product', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cloud_Service.svg;',
					 d, d, '', 'Cloud Service', false, null, this.getTagsForStencil(gn, 'cloud service', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cognitive_Services_Computer_Vision.svg;',
					 d, d, '', 'Cognitive Services - Computer Vision', false, null, this.getTagsForStencil(gn, 'cognitive services computer vision', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cognitive_Services_emotion.svg;',
					 d, d, '', 'Cognitive Services - Emotion', false, null, this.getTagsForStencil(gn, 'cognitive services emotion', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cognitive_Services_face.svg;',
					 d, d, '', 'Cognitive Services - Face', false, null, this.getTagsForStencil(gn, 'cognitive services face', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cognitive_Services_luis.svg;',
					 d, d, '', 'Cognitive Services - Luis', false, null, this.getTagsForStencil(gn, 'cognitive services luis', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cognitive_Services_recommendations.svg;',
					 d, d, '', 'Cognitive Services - Recommendations', false, null, this.getTagsForStencil(gn, 'cognitive services recommendations', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cognitive_Services_Speech.svg;',
					 d, d, '', 'Cognitive Services - Speech', false, null, this.getTagsForStencil(gn, 'cognitive services speech', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cognitive_Services_textanalytics.svg;',
					 d, d, '', 'Cognitive Services - Textanalytics', false, null, this.getTagsForStencil(gn, 'cognitive services textanalytics', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Cognitive_Services_web_language_model.svg;',
					 d, d, '', 'Cognitive Services - Web Language Model', false, null, this.getTagsForStencil(gn, 'cognitive services web language model', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Container_Service.svg;',
					 d, d, '', 'Container Service', false, null, this.getTagsForStencil(gn, 'container_Service', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Content_Delivery_Network.svg;',
					 d, d, '', 'Content Delivery Network', false, null, this.getTagsForStencil(gn, 'content delivery network', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'CosmosDB.svg;',
					 d, d, '', 'CosmosDB', false, null, this.getTagsForStencil(gn, 'cosmosdb cosmos db database', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'CustomerInsights.svg;',
					 d, d, '', 'CustomerInsights', false, null, this.getTagsForStencil(gn, 'customerinsights customer insights', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Data_Catalog.svg;',
					 d, d, '', 'Data Catalog', false, null, this.getTagsForStencil(gn, 'data catalog', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Data_Factory.svg;',
					 d, d, '', 'Data Factory', false, null, this.getTagsForStencil(gn, 'data factory', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Data_Lake_Analytics.svg;',
					 d, d, '', 'Data Lake - Analytics', false, null, this.getTagsForStencil(gn, 'data lake analytics', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Data_Lake_Store.svg;',
					 d, d, '', 'Data Lake - Store', false, null, this.getTagsForStencil(gn, 'data lake store', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Data_Warehouse.svg;',
					 d, d, '', 'Data Warehouse', false, null, this.getTagsForStencil(gn, 'data warehouse', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Database_General.svg;',
					 d, d, '', 'Database (general)', false, null, this.getTagsForStencil(gn, 'database general', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Databricks.svg;',
					 d, d, '', 'Databricks', false, null, this.getTagsForStencil(gn, 'databricks', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'DataServices_category_rollup.svg;',
					 d, d, '', 'DataServices - Category Rollup', false, null, this.getTagsForStencil(gn, 'dataservices category rollup', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'DevTest_Labs.svg;',
					 d, d, '', 'DevTest Labs', false, null, this.getTagsForStencil(gn, 'devtest labs', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Discs.svg;',
					 d, d, '', 'Discs', false, null, this.getTagsForStencil(gn, 'discs', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'DNS.svg;',
					 d, d, '', 'DNS', false, null, this.getTagsForStencil(gn, 'dns domain name server', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'DocumentDB.svg;',
					 d, d, '', 'DocumentDB', false, null, this.getTagsForStencil(gn, 'documentdb document db database', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Elastic_Database_Pools.svg;',
					 d, d, '', 'Elastic Database Pools', false, null, this.getTagsForStencil(gn, 'elastic database pools', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Event_Grid.svg;',
					 d, d, '', 'Event Grid', false, null, this.getTagsForStencil(gn, 'event grid', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Event_Hubs.svg;',
					 d, d, '', 'Event Hubs', false, null, this.getTagsForStencil(gn, 'event hubs', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Express_Route.svg;',
					 d, d, '', 'Express Route', false, null, this.getTagsForStencil(gn, 'express route', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Functions.svg;',
					 d, d, '', 'Functions', false, null, this.getTagsForStencil(gn, 'functions', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Gateway.svg;',
					 d, d, '', 'Gateway', false, null, this.getTagsForStencil(gn, 'gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'HDInsight.svg;',
					 d, d, '', 'HDInsight', false, null, this.getTagsForStencil(gn, 'hdinsight', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'IOT_edge.svg;',
					 d, d, '', 'IOT - Edge', false, null, this.getTagsForStencil(gn, 'IOT edge internet of things', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'KeyVault.svg;',
					 d, d, '', 'KeyVault', false, null, this.getTagsForStencil(gn, 'KeyVault', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Load_Balancer_feature.svg;',
					 d, d, '', 'Load Balancer (feature)', false, null, this.getTagsForStencil(gn, 'load balancer feature', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Logic_Apps.svg;',
					 d, d, '', 'Logic Apps', false, null, this.getTagsForStencil(gn, 'logic apps', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Machine_Learning.svg;',
					 d, d, '', 'Machine Learning', false, null, this.getTagsForStencil(gn, 'machine learning', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'MachineLearningServicePlans.svg;',
					 d, d, '', 'Machine Learning - Service Plans', false, null, this.getTagsForStencil(gn, 'machine learning service plans', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'MachineLearningWebServices.svg;',
					 d, d, '', 'Machine Learning - Web Services', false, null, this.getTagsForStencil(gn, 'machine learning web services', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'MachineLearningWorkspaces.svg;',
					 d, d, '', 'Machine Learning - Workspaces', false, null, this.getTagsForStencil(gn, 'machine learning workspaces', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'ManagedApplications.svg;',
					 d, d, '', 'Managed Applications', false, null, this.getTagsForStencil(gn, 'managed applications', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Management_Portal.svg;',
					 d, d, '', 'management portal', false, null, this.getTagsForStencil(gn, 'management portal', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'MD_snapshot.svg;',
					 d, d, '', 'MD Snapshot', false, null, this.getTagsForStencil(gn, 'md snapshot', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Media_Services.svg;',
					 d, d, '', 'Media Services', false, null, this.getTagsForStencil(gn, 'media services', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Mobile_Engagement.svg;',
					 d, d, '', 'Mobile Engagement', false, null, this.getTagsForStencil(gn, 'mobile engagement', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Multi_Factor_Authentication.svg;',
					 d, d, '', 'Multi-Factor Authentication', false, null, this.getTagsForStencil(gn, 'multi factor authentication', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'MySQL_ClearDB_database.svg;',
					 d, d, '', 'MySQL ClearDB Database', false, null, this.getTagsForStencil(gn, 'mysql cleardb database', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Network_watcher.svg;',
					 d, d, '', 'Network Watcher', false, null, this.getTagsForStencil(gn, 'network watcher', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Notification_Hubs.svg;',
					 d, d, '', 'Notification Hubs', false, null, this.getTagsForStencil(gn, 'notification hubs', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'NSG.svg;',
					 d, d, '', 'NSG', false, null, this.getTagsForStencil(gn, 'nsg', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Operations_Management_Suite.svg;',
					 d, d, '', 'Operations Management Suite', false, null, this.getTagsForStencil(gn, 'operations management suite', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'RemoteApp.svg;',
					 d, d, '', 'RemoteApp', false, null, this.getTagsForStencil(gn, 'remoteapp', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'ResourceGroup.svg;',
					 d, d, '', 'Resource Group', false, null, this.getTagsForStencil(gn, 'resource group', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Route_Filter.svg;',
					 d, d, '', 'Route Filter', false, null, this.getTagsForStencil(gn, 'route filter', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Runbooks.svg;',
					 d, d, '', 'Runbooks', false, null, this.getTagsForStencil(gn, 'runbooks', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'SDK.svg;',
					 d, d, '', 'SDK', false, null, this.getTagsForStencil(gn, 'sdk software development kit', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Search.svg;',
					 d, d, '', 'Search', false, null, this.getTagsForStencil(gn, 'search', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Security_Center.svg;',
					 d, d, '', 'Security Center', false, null, this.getTagsForStencil(gn, 'security center', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Service_Bus.svg;',
					 d, d, '', 'Service Bus', false, null, this.getTagsForStencil(gn, 'service bus', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Service_Bus_Queues.svg;',
					 d, d, '', 'Service Bus - Queues', false, null, this.getTagsForStencil(gn, 'service bus queues', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Service_Bus_Relay.svg;',
					 d, d, '', 'Service Bus - Relay', false, null, this.getTagsForStencil(gn, 'service bus relay', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Service_Bus_Topics.svg;',
					 d, d, '', 'Service Bus - Topics', false, null, this.getTagsForStencil(gn, 'service bus topics', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Service_Fabric.svg;',
					 d, d, '', 'Service Fabric', false, null, this.getTagsForStencil(gn, 'service fabric', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'ServiceHealth.svg;',
					 d, d, '', 'Service Health', false, null, this.getTagsForStencil(gn, 'service health', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Site_Recovery.svg;',
					 d, d, '', 'Site Recovery', false, null, this.getTagsForStencil(gn, 'site recovery', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'SQL_Database_generic.svg;',
					 d, d, '', 'SQL Database (generic)', false, null, this.getTagsForStencil(gn, 'sql database generic', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'SQL_DataWarehouse.svg;',
					 d, d, '', 'SQL Data Warehouse', false, null, this.getTagsForStencil(gn, 'sql data warehouse', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'SQL_Stretch_Database.svg;',
					 d, d, '', 'SQL Stretch Database', false, null, this.getTagsForStencil(gn, 'sql stretch database', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Storage_sync_service.svg;',
					 d, d, '', 'Storage Sync Service', false, null, this.getTagsForStencil(gn, 'storage sync service', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Store_Marketplace.svg;',
					 d, d, '', 'Store Marketplace', false, null, this.getTagsForStencil(gn, 'store marketplace', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'StorSimple.svg;',
					 d, d, '', 'StorSimple', false, null, this.getTagsForStencil(gn, 'storsimple', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Stream_Analytics.svg;',
					 d, d, '', 'Stream Analytics', false, null, this.getTagsForStencil(gn, 'stream analytics', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Tags.svg;',
					 d, d, '', 'Tags', false, null, this.getTagsForStencil(gn, 'tags', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'TimeSeriesInsights.svg;',
					 d, d, '', 'TimeSeriesInsights', false, null, this.getTagsForStencil(gn, 'timeseriesinsights time series insights', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Traffic_Manager.svg;',
					 d, d, '', 'Traffic Manager', false, null, this.getTagsForStencil(gn, 'traffic manager', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Unidentified_Feature_Object.svg;',
					 d, d, '', 'Unidentified Feature Object', false, null, this.getTagsForStencil(gn, 'unidentified feature object', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Virtual_Datacenter.svg;',
					 d, d, '', 'Virtual Datacenter', false, null, this.getTagsForStencil(gn, 'virtual datacenter', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Virtual_Machine.svg;',
					 d, d, '', 'Virtual Machine', false, null, this.getTagsForStencil(gn, 'virtual machine', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Virtual_Machine_2.svg;',
					 d, d, '', 'Virtual Machine', false, null, this.getTagsForStencil(gn, 'virtual machine', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'VM_Scale_Set.svg;',
					 d, d, '', 'Virtual Machine -  Scale Set', false, null, this.getTagsForStencil(gn, 'vm scale set virtual machine', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Virtual_Machines_Availability_Set.svg;',
					 d, d, '', 'Virtual Machines - Availability Set', false, null, this.getTagsForStencil(gn, 'virtual machines availability set', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Virtual_Machines_Linux.svg;',
					 d, d, '', 'Virtual Machines - Linux', false, null, this.getTagsForStencil(gn, 'virtual machines linux', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Virtual_Network.svg;',
					 d, d, '', 'Virtual Network', false, null, this.getTagsForStencil(gn, 'virtual network', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Visual_Studio_Team_Services_CodePlex_source.svg;',
					 d, d, '', 'Visual Studio Team Services - CodePlex Source', false, null, this.getTagsForStencil(gn, 'visual studio team services codePlex source', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'VPN_Gateway.svg;',
					 d, d, '', 'VPN Gateway', false, null, this.getTagsForStencil(gn, 'vpn gateway virtual private network', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'WebApp_WebJobs.svg;',
					 d, d, '', 'WebApp - WebJobs', false, null, this.getTagsForStencil(gn, 'webapp webjobs', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Webhooks.svg;',
					 d, d, '', 'Webhooks', false, null, this.getTagsForStencil(gn, 'webhooks', dt).join(' '))
		];
			
		this.addPalette('mscaeCloud Color', 'CAE / Cloud (color)', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));

	}
	
	Sidebar.prototype.addMSCAEDeprecatedColorPalette = function()
	{
		var d = 50;
		var dt = 'ms microsoft deprecated enterprise color ';
		var sb = this;
		var s = 'aspect=fixed;html=1;align=center;shadow=0;dashed=0;image;fontSize=12;image=img/lib/mscae/dep/';
		var gn = 'mxgraph.mscae';

		var fns =
		[
			 this.createVertexTemplateEntry(s + 'App_Service_Logic_App.svg;',
					 d, d, '', 'App Service - Logic App', false, null, this.getTagsForStencil(gn, 'app service logic app', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Application_Gateway.svg;',
					 d, d, '', 'Application Gateway', false, null, this.getTagsForStencil(gn, 'application gateway', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Content_Delivery_Network.svg;',
					 d, d, '', 'Content Delivery Network', false, null, this.getTagsForStencil(gn, 'content delivery network', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Data_Lake.svg;',
					 d, d, '', 'Data Lake', false, null, this.getTagsForStencil(gn, 'data lake', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Data_Lake_Analytics.svg;',
					 d, d, '', 'Data Lake Analytics', false, null, this.getTagsForStencil(gn, 'data lake analytics', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Data_Lake_Store.svg;',
					 d, d, '', 'Data Lake Store', false, null, this.getTagsForStencil(gn, 'data lake store', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'DataWarehouse.svg;',
					 d, d, '', 'DataWarehouse', false, null, this.getTagsForStencil(gn, 'datawarehouse', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'SQL_Server_Stretch_DB.svg;',
					 d, d, '', 'SQL Server Stretch DB', false, null, this.getTagsForStencil(gn, 'sql server stretch db database', dt).join(' '))
		];
			
		this.addPalette('mscaeDeprecated Color', 'CAE / Deprecated (color)', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));

	}
})();
