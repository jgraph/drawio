/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	Sidebar.prototype.addCitrix2Palette = function()
	{
		var s = 'sketch=0;verticalLabelPosition=bottom;sketch=0;aspect=fixed;html=1;verticalAlign=top;strokeColor=none;fillColor=#000000;align=center;outlineConnect=0;pointerEvents=1;shape=mxgraph.citrix2.';
		var gn = 'mxgraph.citrix2';
		var sb = this;

		var sc = 0.5;
		var w = sc * 100;
		var h = sc * 100;

		this.setCurrentSearchEntryLibrary('citrix2', 'citrix2Locations');
		this.addCitrix2LocationsPalette(s, w, h, gn, sb);
		this.setCurrentSearchEntryLibrary('citrix2', 'citrix2Users and Devices');
		this.addCitrix2UsersAndDevicesPalette(s, w, h, gn, sb);
		this.setCurrentSearchEntryLibrary('citrix2', 'citrix2Cloud Services');
		this.addCitrix2CloudServicesPalette(s, w, h, gn, sb);
		this.setCurrentSearchEntryLibrary('citrix2', 'citrix2Components');
		this.addCitrix2ComponentsPalette(s, w, h, gn, sb);
		this.setCurrentSearchEntryLibrary('citrix2', 'citrix2Resources');
		this.addCitrix2ResourcesPalette(s, w, h, gn, sb);
		this.setCurrentSearchEntryLibrary('citrix2', 'citrix2NetScaler');
		this.addCitrix2NetScalerPalette(s, w, h, gn, sb);
		this.setCurrentSearchEntryLibrary('citrix2', 'citrix2Networking');
		this.addCitrix2NetworkingPalette(s, w, h, gn, sb);
		this.setCurrentSearchEntryLibrary('citrix2', 'citrix2Authentication');
		this.addCitrix2AuthenticationPalette(s, w, h, gn, sb);
		this.setCurrentSearchEntryLibrary();
	};
	
	Sidebar.prototype.addCitrix2LocationsPalette = function(s, w, h, gn, sb)
	{
		var dt = 'citrix locations ';
		
		this.addPaletteFunctions('citrix2Locations', 'Citrix / Locations', false,
		[
			this.createVertexTemplateEntry(s + 'office;', w, h * 0.9846, '', 'Office', null, null, this.getTagsForStencil(gn, 'office', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'home;', w, h * 0.8588, '', 'Home', null, null, this.getTagsForStencil(gn, 'home', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'data_center;', w * 0.9848, h, '', 'Data Center', null, null, this.getTagsForStencil(gn, 'data center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'factory;', w, h * 0.9883, '', 'Factory', null, null, this.getTagsForStencil(gn, 'factory', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hospital;', w, h * 0.884, '', 'Hospital', null, null, this.getTagsForStencil(gn, 'hospital', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'finance_government;', w, h * 0.9147, '', 'Finance / Government', null, null, this.getTagsForStencil(gn, 'finance government', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'airport;', w * 0.9615, h, '', 'Airport', null, null, this.getTagsForStencil(gn, 'airport', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud;', w, h * 0.5692, '', 'Cloud', null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hybrid_cloud;', w, h * 0.5618, '', 'Hybrid Cloud', null, null, this.getTagsForStencil(gn, 'hybrid cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'private_cloud;', w, h * 0.5773, '', 'Private Cloud', null, null, this.getTagsForStencil(gn, 'private cloud', dt).join(' '))
		]);
	};

	Sidebar.prototype.addCitrix2UsersAndDevicesPalette = function(s, w, h, gn, sb)
	{
		var dt = 'citrix users devices ';
		
		this.addPaletteFunctions('citrix2Users and Devices', 'Citrix / Users and Devices', false,
		[
			this.createVertexTemplateEntry(s + 'user;', w * 0.9768, h, '', 'User', null, null, this.getTagsForStencil(gn, 'user', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'users;', w, h * 0.5287, '', 'Users', null, null, this.getTagsForStencil(gn, 'users', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'external_users;', w * 0.969, h, '', 'External Users', null, null, this.getTagsForStencil(gn, 'external users', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'internal_users;', w, h * 0.9619, '', 'Internal Users', null, null, this.getTagsForStencil(gn, 'internal users', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'admins;', w, h, '', 'Admins', null, null, this.getTagsForStencil(gn, 'admins', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'desktop;', w, h * 0.7732, '', 'Desktop', null, null, this.getTagsForStencil(gn, 'desktop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'managed_desktop;', w, h * 0.7732, '', 'Managed Desktop', null, null, this.getTagsForStencil(gn, 'managed desktop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'laptop;', w, h * 0.7714, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'laptop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mobile;', w * 0.5051, h, '', 'Mobile Phone', null, null, this.getTagsForStencil(gn, 'mobile', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tablet;', w * 0.7385, h, '', 'Tablet', null, null, this.getTagsForStencil(gn, 'tablet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'devices;', w * 2.266, h, '', 'Devices', null, null, this.getTagsForStencil(gn, 'devices', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'thin_client;', w * 0.7313, h, '', 'Thin Client', null, null, this.getTagsForStencil(gn, 'thin client', dt).join(' '))
		]);
	};

	Sidebar.prototype.addCitrix2CloudServicesPalette = function(s, w, h, gn, sb)
	{
		var dt = 'citrix cloud services ';
		
		this.addPaletteFunctions('citrix2Cloud Services', 'Citrix / Cloud Services', false,
		[
			this.createVertexTemplateEntry(s + 'daas;', w, h * 0.7547, '', 'DaaS', null, null, this.getTagsForStencil(gn, 'daas', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud_storefront;', w, h * 0.7976, '', 'Cloud Storefront', null, null, this.getTagsForStencil(gn, 'cloud storefront', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'endpoint_management;', w, h * 0.7659, '', 'Endpoint Management', null, null, this.getTagsForStencil(gn, 'endpoint management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'secure_private_access;', w, h * 0.7205, '', 'Secure Private Access', null, null, this.getTagsForStencil(gn, 'secure private access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_gateway_service;', w, h * 0.7171, '', 'Citrix Gateway Service', null, null, this.getTagsForStencil(gn, 'gateway service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_console;', w, h * 0.7187, '', 'NetScaler Console', null, null, this.getTagsForStencil(gn, 'netscaler console', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_itm;', w, h * 0.807, '', 'NetScaler ITM', null, null, this.getTagsForStencil(gn, 'netscaler itm', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_analytics;', w, h * 0.691, '', 'Citrix Analytics', null, null, this.getTagsForStencil(gn, 'analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'workspace_environment_management;', w, h * 0.7748, '', 'Workspace Environment Management', null, null, this.getTagsForStencil(gn, 'workspace environment management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'itsm_adapter_for_servicenow;', w, h * 0.8055, '', 'ITSM Adapter for ServiceNow', null, null, this.getTagsForStencil(gn, 'itsm adapter for servicenow', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'remote_browser_isolation;', w, h * 0.719, '', 'Remote Browser Isolation', null, null, this.getTagsForStencil(gn, 'remote browser isolation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_cloud_api;', w, h * 0.7492, '', 'Citrix Cloud API', null, null, this.getTagsForStencil(gn, 'cloud api application programming interface', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud_connector;', w, h * 0.7787, '', 'Cloud Connector', null, null, this.getTagsForStencil(gn, 'cloud connector', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'global_app_configuration_service;', w, h * 0.7541, '', 'Global App Configuration Service', null, null, this.getTagsForStencil(gn, 'global app configuration service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'daas_monitor;', w, h * 0.7844, '', 'DaaS Monitor', null, null, this.getTagsForStencil(gn, 'daas monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'device_posture_service;', w, h * 0.8403, '', 'Device Posture Service', null, null, this.getTagsForStencil(gn, 'device posture service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_federated_authentication_service;', w, h * 0.7055, '', 'Citrix Federated Authentication Service', null, null, this.getTagsForStencil(gn, 'federated authentication service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'session_recording_service;', w, h * 0.6953, '', 'Session Recording Service', null, null, this.getTagsForStencil(gn, 'session recording service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vda_upgrade_service;', w, h * 0.7879, '', 'VDA Upgrade Service', null, null, this.getTagsForStencil(gn, 'vda upgrade service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_cloud;', w, h * 0.7234, '', 'Citrix Cloud', null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_cloud_studio;', w, h * 0.6916, '', 'Citrix Cloud Studio', null, null, this.getTagsForStencil(gn, 'cloud studio', dt).join(' '))
		]);
	};

	Sidebar.prototype.addCitrix2ComponentsPalette = function(s, w, h, gn, sb)
	{
		var dt = 'citrix components ';
		
		this.addPaletteFunctions('citrix2Components', 'Citrix / Components', false,
		[
			this.createVertexTemplateEntry(s + 'netscaler_gateway;', w, h * 0.8943, '', 'NetScaler Gateway', null, null, this.getTagsForStencil(gn, 'netscaler gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storefront;', w, h * 0.8627, '', 'StoreFront', null, null, this.getTagsForStencil(gn, 'storefront', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'workspace_environment_management2;', w * 0.9595, h, '', 'Workspace Environment Management', null, null, this.getTagsForStencil(gn, 'workspace environment management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'delivery_controller;perimeter=ellipsePerimeter;', w, h, '', 'Delivery Controller', null, null, this.getTagsForStencil(gn, 'delivery controller', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'director;', w, h * 0.8611, '', 'Director', null, null, this.getTagsForStencil(gn, 'director', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'studio_web_studio;', w, h * 0.8597, '', 'Studio / Web Studio', null, null, this.getTagsForStencil(gn, 'studio web studio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vda;', w, h * 0.8237, '', 'VDA', null, null, this.getTagsForStencil(gn, 'vda', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'beacon;', w * 0.7008, h, '', 'Beacon', null, null, this.getTagsForStencil(gn, 'beacon', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'zones;', w, h * 0.8894, '', 'Zones', null, null, this.getTagsForStencil(gn, 'zones', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_app_layering;', w, h * 0.9167, '', 'Citrix App Layering', null, null, this.getTagsForStencil(gn, 'app layering', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'machine_catalog;', w, h * 0.8884, '', 'Machine Catalog', null, null, this.getTagsForStencil(gn, 'machine catalog', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'delivery_group;', w, h, '', 'Delivery Group', null, null, this.getTagsForStencil(gn, 'delivery group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'app_group;', w, h * 0.9865, '', 'App Group', null, null, this.getTagsForStencil(gn, 'app group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_provisioning_server;', w, h * 0.6447, '', 'Citrix Provisioning Server', null, null, this.getTagsForStencil(gn, 'provisioning server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_app;', w, h, '', 'Citrix App', null, null, this.getTagsForStencil(gn, 'app', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'site_database;', w * 0.9079, h, '', 'Site Database', null, null, this.getTagsForStencil(gn, 'site database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'site_database;', w * 0.9079, h, '', 'Monitoring Database', null, null, this.getTagsForStencil(gn, 'monitoring database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'site_database;', w * 0.9079, h, '', 'Logging Database', null, null, this.getTagsForStencil(gn, 'logging database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_license_server;', w, h * 0.7167, '', 'Citrix License Server', null, null, this.getTagsForStencil(gn, 'license server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_session_recording_server;', w, h * 0.6638, '', 'Citrix Session Recording Server', null, null, this.getTagsForStencil(gn, 'session recording server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_federated_authentication_service2;', w, h * 0.6019, '', 'Citrix Federated Authentication Service', null, null, this.getTagsForStencil(gn, 'federated authentication service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'secure_private_access2;', w, h * 0.6964, '', 'Secure Private Access', null, null, this.getTagsForStencil(gn, 'secure private access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xenserver_console;', w, h * 0.861, '', 'XenServer Console', null, null, this.getTagsForStencil(gn, 'xenserver console', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hypervisor_xenserver;', w, h * 0.6199, '', 'Hypervisor: XenServer', null, null, this.getTagsForStencil(gn, 'hypervisor xenserver', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'app_protection;', w * 0.9522, h, '', 'App Protection', null, null, this.getTagsForStencil(gn, 'app protection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_policies;', w, h * 0.9915, '', 'Citrix Policies', null, null, this.getTagsForStencil(gn, 'policies', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'image_portability_service;', w * 0.9993, h, '', 'Image Portability Service', null, null, this.getTagsForStencil(gn, 'image portability service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_terraform_provider;', w * 0.9146, h, '', 'Citrix Terraform Provider', null, null, this.getTagsForStencil(gn, 'terraform provider', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_uber_agent;', w, h * 0.5284, '', 'Citrix Uber Agent', null, null, this.getTagsForStencil(gn, 'uber agent', dt).join(' '))
		]);
	};

	Sidebar.prototype.addCitrix2ResourcesPalette = function(s, w, h, gn, sb)
	{
		var dt = 'citrix resources ';
		
		this.addPaletteFunctions('citrix2Resources', 'Citrix / Resources', false,
		[
			this.createVertexTemplateEntry(s + 'linux_app;', w, h * 0.9869, '', 'Linux App', null, null, this.getTagsForStencil(gn, 'linux app', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'windows_app;', w, h * 0.9869, '', 'Windows App', null, null, this.getTagsForStencil(gn, 'windows app', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'linux_apps;', w * 0.8543, h, '', 'Linux Apps', null, null, this.getTagsForStencil(gn, 'linux apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'windows_apps;', w, h * 0.8457, '', 'Windows Apps', null, null, this.getTagsForStencil(gn, 'windows apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_saas_apps;', w, h * 0.769, '', 'Web / SaaS Apps', null, null, this.getTagsForStencil(gn, 'web saas apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_desktop;', w * 0.7846, h * 1, '', 'Virtual Desktop', null, null, this.getTagsForStencil(gn, 'virtual desktop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'professional_graphics_desktop;', w, h * 0.9994, '', 'Professional Graphics Desktop', null, null, this.getTagsForStencil(gn, 'professional graphics desktop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_remote_pc;', w * 0.8491, h, '', 'Citrix Remote PC', null, null, this.getTagsForStencil(gn, 'remote pc', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_provisioning_target_device;', w * 0.8363, h, '', 'Citrix Provisioning Target Device', null, null, this.getTagsForStencil(gn, 'provisioning target device', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'single_and_multi_session_windows_and_linux_desktops;', w * 0.977, h, '', 'Single and Multi-Session Windows and Linux Desktops', null, null, this.getTagsForStencil(gn, 'single and multi session windows and linux desktops', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'windows_and_linux_virtualized_apps;', w, h * 0.7904, '', 'Windows and Linux Virtualized Apps', null, null, this.getTagsForStencil(gn, 'windows and linux virtualized apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'windows_server_apps_and_desktops;', w, h * 0.6025, '', 'Windows Server Apps and Desktops', null, null, this.getTagsForStencil(gn, 'windows server apps and desktops', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_vda_for_macos;', w * 0.7246, h, '', 'Citrix VDA for MacOS', null, null, this.getTagsForStencil(gn, 'vda for macos', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'windows_image;', w * 0.7407, h, '', 'Windows Image', null, null, this.getTagsForStencil(gn, 'windows image', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'linux_image;', w * 0.7407, h, '', 'Linux Image', null, null, this.getTagsForStencil(gn, 'linux image', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_enterprise_browser;', w, h * 0.8591, '', 'Citrix Enterprise Browser', null, null, this.getTagsForStencil(gn, 'enterprise browser', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hdx;', w * 1, h * 0.5119, '', 'HDX', null, null, this.getTagsForStencil(gn, 'hdx', dt).join(' '))
		]);
	};

	Sidebar.prototype.addCitrix2NetScalerPalette = function(s, w, h, gn, sb)
	{
		var dt = 'citrix netscaler ';
		
		this.addPaletteFunctions('citrix2NetScaler', 'Citrix / NetScaler', false,
		[
			this.createVertexTemplateEntry(s + 'netscaler_blx;', w, h * 0.8853, '', 'NetScaler BLX', null, null, this.getTagsForStencil(gn, 'netscaler blx', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_cpx;', w * 0.8974, h, '', 'NetScaler CPX', null, null, this.getTagsForStencil(gn, 'netscaler cpx', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_mpx;', w, h * 0.8245, '', 'NetScaler MPX', null, null, this.getTagsForStencil(gn, 'netscaler mpx', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_sdx;', w, h * 0.8245, '', 'NetScaler SDX', null, null, this.getTagsForStencil(gn, 'netscaler sdx', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_vpx;', w * 0.8974, h, '', 'NetScaler VPX', null, null, this.getTagsForStencil(gn, 'netscaler vpx', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_gateway2;', w, h * 0.8443, '', 'NetScaler Gateway', null, null, this.getTagsForStencil(gn, 'netscaler gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'waf;', w, h * 0.4941, '', 'WAF', null, null, this.getTagsForStencil(gn, 'waf', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'api_protection;', w, h * 0.9177, '', 'API Protection', null, null, this.getTagsForStencil(gn, 'api protection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ddos_protection;', w, h * 0.9177, '', 'DDoS Protection', null, null, this.getTagsForStencil(gn, 'ddos protection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bot_mitigation;', w, h * 0.9177, '', 'Bot Mitigation', null, null, this.getTagsForStencil(gn, 'bot mitigation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'load_balancing;', w * 1.92, h * 0.4026, '', 'Load Balancing', null, null, this.getTagsForStencil(gn, 'load balancing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ssl_tls_offloading;', w * 0.9294, h, '', 'SSL / TLS Offloading', null, null, this.getTagsForStencil(gn, 'ssl tls offloading', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'gslb;', w * 2.08, h * 1, '', 'GSLB', null, null, this.getTagsForStencil(gn, 'gslb', dt).join(' '))
		]);
	};

	Sidebar.prototype.addCitrix2NetworkingPalette = function(s, w, h, gn, sb)
	{
		var dt = 'citrix networking ';
		
		this.addPaletteFunctions('citrix2Networking', 'Citrix / Networking', false,
		[
			this.createVertexTemplateEntry(s + 'tunnel;', w, h * 0.215, '', 'Tunnel', null, null, this.getTagsForStencil(gn, 'tunnel', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bridge;', w, h * 0.5464, '', 'Bridge', null, null, this.getTagsForStencil(gn, 'bridge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'switch;', w, h * 0.5464, '', 'Switch', null, null, this.getTagsForStencil(gn, 'switch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'network;', w * 0.9638, h, '', 'Network', null, null, this.getTagsForStencil(gn, 'network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'router;perimeter=ellipsePerimeter;', w, h, '', 'Router', null, null, this.getTagsForStencil(gn, 'router', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sd_wan;', w, h * 0.9992, '', 'SD-WAN', null, null, this.getTagsForStencil(gn, 'sd wan wide area network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'firewall;', w, h * 0.9983, '', 'Firewall', null, null, this.getTagsForStencil(gn, 'firewall', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wifi_router;', w * 0.998, h, '', 'Wifi Router', null, null, this.getTagsForStencil(gn, 'wifi router', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'dns;perimeter=ellipsePerimeter;', w, h, '', 'DNS', null, null, this.getTagsForStencil(gn, 'dns domain name server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'internet;perimeter=ellipsePerimeter;', w, h, '', 'Internet', null, null, this.getTagsForStencil(gn, 'internet', dt).join(' '))
		]);
	};

	Sidebar.prototype.addCitrix2AuthenticationPalette = function(s, w, h, gn, sb)
	{
		var dt = 'citrix authentication ';
		
		this.addPaletteFunctions('citrix2Authentication', 'Citrix / Authentication', false,
		[
			this.createVertexTemplateEntry(s + 'authentication_adaptive;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: Adaptive', null, null, this.getTagsForStencil(gn, 'authentication adaptive', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_cert;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: Cert', null, null, this.getTagsForStencil(gn, 'authentication cert', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_totp;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: TOTP', null, null, this.getTagsForStencil(gn, 'authentication totp', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_selection;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: Selection', null, null, this.getTagsForStencil(gn, 'authentication selection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_saml;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: SAML', null, null, this.getTagsForStencil(gn, 'authentication saml', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_radius;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: RADIUS', null, null, this.getTagsForStencil(gn, 'authentication radius', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_epa;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: EPA', null, null, this.getTagsForStencil(gn, 'authentication epa', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_failure;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: Failure', null, null, this.getTagsForStencil(gn, 'authentication failure', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_fido2;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: FIDO2', null, null, this.getTagsForStencil(gn, 'authentication fido2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_mfa;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: MFA', null, null, this.getTagsForStencil(gn, 'authentication mfa', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_oidc;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: OIDC', null, null, this.getTagsForStencil(gn, 'authentication oidc', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_push;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: Push', null, null, this.getTagsForStencil(gn, 'authentication push', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_okta;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: Okta', null, null, this.getTagsForStencil(gn, 'authentication okta', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_google;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: Google', null, null, this.getTagsForStencil(gn, 'authentication google', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'authentication_ms_entra_id;perimeter=ellipsePerimeter;', w, h, '', 'Authentication: MS Entra ID', null, null, this.getTagsForStencil(gn, 'authentication ms entra id', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ldap;perimeter=ellipsePerimeter;', w, h, '', 'LDAP', null, null, this.getTagsForStencil(gn, 'ldap', dt).join(' '))
		]);
	};
})();
