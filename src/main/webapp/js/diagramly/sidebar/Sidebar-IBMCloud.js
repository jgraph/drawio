/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	Sidebar.prototype.addIBMCloudPalette = function()
	{
		var d = 48;
		var d2 = 24;
		var dt = 'ibm cloud ';

		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudGroups');
		this.addIBMCloudGroupsPalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudActors');
		this.addIBMCloudActorsPalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudAI');
		this.addIBMCloudAIPalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudCompute');
		this.addIBMCloudComputePalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudContainers');
		this.addIBMCloudContainersPalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudData');
		this.addIBMCloudDataPalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudDevOps');
		this.addIBMCloudDevOpsPalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudNetwork');
		this.addIBMCloudNetworkPalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudObservability');
		this.addIBMCloudObservabilityPalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudSecurity');
		this.addIBMCloudSecurityPalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudStorage');
		this.addIBMCloudStoragePalette(d, d2, dt);
		this.setCurrentSearchEntryLibrary('ibm_cloud', 'ibm_cloudConnectors');
		this.addIBMCloudConnectorsPalette(d, d2, dt);
};

		Sidebar.prototype.addIBMCloudGroupsPalette = function(d, d2, dt)
		{
			dt += 'groups ';
			var fns = [];

			this.addIBMCloudPrescribedLocation('IBM Cloud', 'ibm-cloud', dt, fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('VPC', 'ibm-cloud--vpc', dt + 'vpc virtual private ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Subnet', 'ibm-cloud--subnets', dt + 'subnet ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Enterprise Network', 'network--enterprise', dt + 'enterprise network ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Public Network', 'network--public', dt + 'public network ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Cloud Services', 'cloud-services', dt + 'services ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Internet Services', 'ibm-cloud--internet-services', dt + 'internet services ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Overlay Network', 'network--overlay', dt + 'network overlay ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Power Workspace', 'ibm--power-vs', dt + 'power workspace ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Z System', 'z--systems', dt + 'system ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Internet', 'wikis', dt + 'internet ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('VLAN', 'vlan', dt + 'vlan virtual lan local area network ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Classic VLAN', 'vlan--ibm', dt + 'classic vlan virtual lan local area network ', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('Classic Infrastructure', 'infrastructure--classic', dt + 'classic infrastructure', fns, d, d2, '#1192E8', 'none', '#1192E8', 'none', 'none', '#1192E8', false, 1);
			this.addIBMCloudPrescribedLocation('OpenShift', 'logo--openshift', dt + 'openshift', fns, d, d2, '#198038', 'none', '#198038', 'none', 'none', '#198038', false, 1);
			this.addIBMCloudPrescribedLocation('Kubernetes Service', 'ibm-cloud--kubernetes-service', dt + 'kubernetes service', fns, d, d2, '#198038', 'none', '#198038', 'none', 'none', '#198038', false, 1);
			this.addIBMCloudPrescribedLocation('Z Containers', 'ibm-z-os--containers', dt + 'containers', fns, d, d2, '#198038', 'none', '#198038', 'none', 'none', '#198038', false, 1);
			this.addIBMCloudPrescribedLocation('watsonx', 'watsonx', dt + 'watsonx', fns, d, d2, '#A56EFF', 'none', '#A56EFF', 'none', 'none', '#A56EFF', false, 1);
			this.addIBMCloudPrescribedLocation('watsonx Code Assistant', 'ibm-watsonx--code-assistant', dt + 'watsonx code assistant', fns, d, d2, '#A56EFF', 'none', '#A56EFF', 'none', 'none', '#A56EFF', false, 1);
			this.addIBMCloudPrescribedLocation('watsonx Z Code Assistant', 'ibm-watsonx--code-assistant-for-z', dt + 'watsonx code assistant for z', fns, d, d2, '#A56EFF', 'none', '#A56EFF', 'none', 'none', '#A56EFF', false, 1);
			this.addIBMCloudPrescribedLocation('Authorization Boundary', 'flag', dt + 'authorization boundary', fns, d, d2, '#FA4D56', 'none', '#FA4D56', 'none', 'none', '#FA4D56', false, 2);
			this.addIBMCloudPrescribedLocation('Point of Presence', 'point-of-presence', dt + 'point of presence', fns, d, d2, '#878D96', 'none', '#878D96', 'none', 'none', '#878D96', false, 1);
			this.addIBMCloudPrescribedLocation('Region', 'location', dt + 'region', fns, d, d2, '#878D96', 'none', '#878D96', 'none', 'none', '#878D96', false, 1);
			this.addIBMCloudPrescribedLocation('Generic Group', '', dt + 'generic group', fns, d, d2, '#878D96', 'none', '#878D96', 'none', 'none', '#878D96', true, 1);
			this.addIBMCloudZone('Access Group', 'group--access', dt + 'access group', fns, d, d2, '#FA4D56', 'none', '#FA4D56', 'none', 'none', '#FA4D56', false, 2);
			this.addIBMCloudZone('Account Group', 'group--account', dt + 'account group', fns, d, d2, '#FA4D56', 'none', '#FA4D56', 'none', 'none', '#FA4D56', false, 2);
			this.addIBMCloudZone('Resource Group', 'group--resource', dt + 'resource group', fns, d, d2, '#FA4D56', 'none', '#FA4D56', 'none', 'none', '#FA4D56', false, 2);
			this.addIBMCloudZone('Security Group', 'group--security', dt + 'security group', fns, d, d2, '#FA4D56', 'none', '#FA4D56', 'none', 'none', '#FA4D56', false, 2);
			this.addIBMCloudZone('Instance Group', 'autoscaling', dt + 'instance group', fns, d, d2, '#198038', 'none', '#198038', 'none', 'none', '#198038', false, 2);
			this.addIBMCloudZone('Placement Group', 'group-objects', dt + 'placement group', fns, d, d2, '#198038', 'none', '#198038', 'none', 'none', '#198038', false, 2);
			this.addIBMCloudZone('Availability Zone', 'data--center', dt + 'availability zone', fns, d, d2, '#878D96', 'none', '#878D96', 'none', 'none', '#878D96', false, 2);
			this.addIBMCloudZone('Generic Zone', '', dt + 'generic zone', fns, d, d2, '#878D96', 'none', '#878D96', 'none', 'none', '#878D96', true, 2);
			this.addIBMCloudPrescribedNodeExpanded('Expanded Virtual Server', 'ibm-cloud--virtual-server-vpc', dt + 'expanded virtual server', fns, d, d2, '#198038', 'none', '#ffffff', 'none', 'none', '#198038');
			this.addIBMCloudPrescribedNodeExpanded('Expanded Power Virtual Server', 'ibm--power-vs', dt + 'expanded power virtual server', fns, d, d2, '#198038', 'none', '#ffffff', 'none', 'none', '#198038');
			this.addIBMCloudPrescribedNodeExpanded('Expanded Classic Virtual\nServer', 'ibm-cloud--virtual-server-classic', dt + 'expanded classic virtual server', fns, d, d2, '#198038', 'none', '#ffffff', 'none', 'none', '#198038');
			this.addIBMCloudPrescribedNodeExpanded('Expanded Bare Metal\nServer', 'ibm-cloud--bare-metal-servers-vpc', dt + 'expanded bare metal server', fns, d, d2, '#198038', 'none', '#ffffff', 'none', 'none', '#198038');
			this.addIBMCloudPrescribedNodeExpanded('Expanded Classic Bare\nMetal Server', 'ibm-cloud--bare-metal-server', dt + 'expanded classic bare metal server', fns, d, d2, '#198038', 'none', '#ffffff', 'none', 'none', '#198038');
			this.addIBMCloudPrescribedNodeExpanded('Expanded Application', 'application', dt + 'expanded application', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none', 'none', '#A56EFF');
			this.addIBMCloudPrescribedNodeExpanded('Expanded Microservice', 'microservices--1', dt + 'expanded microservice', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none', 'none', '#A56EFF');

			this.addPalette('ibm_cloudGroups', 'IBM / Groups', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudActorsPalette = function(d, d2, dt)
		{
			dt += 'actors ';
			var fns = [];

			this.addIBMCloudActor('User', 'user', dt + 'user', fns, d, d2, '#000000', 'none', '#ffffff', 'none');
			this.addIBMCloudActor('Users', 'group', dt + 'users', fns, d, d2, '#000000', 'none', '#ffffff', 'none');
			this.addIBMCloudActor('Enterprise', 'enterprise', dt + 'enterprise', fns, d, d2, '#000000', 'none', '#ffffff', 'none');
			this.addIBMCloudActor('Application', 'application', dt + 'application', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudActor('Web Application', 'application--web', dt + 'web application', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudActor('Microservice', 'microservices--1', dt + 'microservice', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');

			this.addPalette('ibm_cloudActors', 'IBM / Actors', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudAIPalette = function(d, d2, dt)
		{
			dt += 'ai ';
			var fns = [];
					   
			this.addIBMCloudPrescribedNode('watsonx', 'watsonx', dt + 'watsonx', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('watsonx.ai', 'watsonx-ai', dt + 'watsonx ai artificial intelligence', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('watsonx.data', 'watsonx-data', dt + 'watsonx data', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('watsonx.governance', 'watsonx-governance', dt + 'watsonx governance', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('watsonx Orchestrate', 'ibm-watsonx--orchestrate', dt + 'watsonx orchestrate', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('watsonx Assistant', 'ibm-watsonx--assistant', dt + 'watsonx assistant', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('watsonx Code Assistant', 'ibm-watsonx--code-assistant', dt + 'watsonx code assistant', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('watsonx Z Code Assistant', 'ibm-watsonx--code-assistant-for-z', dt + 'watsonx code assistant for z', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('watsonx Z Refactor Code Assistant', 'ibm-watsonx--code-assistant-for-z--refactor', dt + 'watsonx code assistant for z refactor', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Watson Discovery', 'ibm-watson--discovery', dt + 'watson discovery', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Watson Machine Learning', 'ibm-watson--machine-learning', dt + 'watson machine learning', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Watson Studio', 'ibm-watson--studio', dt + 'watson studio', fns, d, d2, '#A56EFF', 'none', '#ffffff', 'none');

			this.addPalette('ibm_cloudAI', 'IBM / AI', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudComputePalette = function(d, d2, dt)
		{
			dt += 'compute ';
			var fns = [];

			this.addIBMCloudPrescribedNode('Virtual Server', 'ibm-cloud--virtual-server-vpc', dt + 'virtual server', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Power Virtual Server', 'ibm--power-vs', dt + 'power virtual server', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Classic Virtual Server', 'ibm-cloud--virtual-server-classic', dt + 'classic virtual server', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Bare Metal Server', 'ibm-cloud--bare-metal-servers-vpc', dt + 'bare metal server', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Classic Bare Metal Server', 'ibm-cloud--bare-metal-server', dt + 'classic bare metal server', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Dedicated Host', 'ibm-cloud--dedicated-host', dt + 'dedicated host', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Image Service', 'image-service', dt + 'image service', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Satellite', 'cloud-satellite', dt + 'cloud satellite', fns, d, d2, '#198038', 'none', '#ffffff', 'none');

			this.addPalette('ibm_cloudCompute', 'IBM / Compute', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudContainersPalette = function(d, d2, dt)
		{
			dt += 'containers ';
			var fns = [];

			this.addIBMCloudPrescribedNode('OpenShift', 'logo--openshift', dt + 'openshift open shift', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Kubernetes Service', 'ibm-cloud--kubernetes-service', dt + 'kubernetes service', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Z Containers', 'ibm-z-os--containers', dt + 'z containers', fns, d, d2, '#198038', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Container Registry', 'cloud-registry', dt + 'container registry', fns, d, d2, '#198038', 'none', '#ffffff', 'none');

			this.addPalette('ibm_cloudContainers', 'IBM / Containers', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudDataPalette = function(d, d2, dt)
		{
			dt += 'data ';
			var fns = [];

			this.addIBMCloudPrescribedNode('Db2', 'ibm--db2', dt + 'db2', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Db2 Warehouse', 'ibm--db2-warehouse', dt + 'db2 warehouse', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Cloudant', 'ibm--cloudant', dt + 'cloudant', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('DataStax', 'database--datastax', dt + 'datastax', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Elasticsearch', 'database--elastic', dt + 'elasticsearch', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('EnterpriseDB', 'database--enterprisedb', dt + 'enterprisedb', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('etcd', 'database--etcd', dt + 'etcd', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('MongoDB', 'database--mongodb', dt + 'mongodb', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('MySQL', 'database--mysql', dt + 'mysql my sql', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('PostgreSQL', 'database--postgresql', dt + 'postgresql postgre sql', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Rabbit', 'database--rabbit', dt + 'rabbit', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Redis', 'database--redis', dt + 'redis', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Database', 'data--base', dt + 'database', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Event Streams', 'ibm-cloud--event-streams', dt + 'event streams', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Data Pak', 'ibm-cloud-pak--data', dt + 'data pak', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');

			this.addPalette('ibm_cloudData', 'IBM / Data', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudDevOpsPalette = function(d, d2, dt)
		{
			dt += 'devops ';
			var fns = [];

			this.addIBMCloudPrescribedNode('Continuous Delivery', 'ibm-cloud--continuous-delivery', dt + 'continuous delivery', fns, d, d2, '#EE5396', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Continuous Integration', 'continuous-integration', dt + 'continuous integration', fns, d, d2, '#EE5396', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Source Code Repository', 'repo--source-code', dt + 'source code repository', fns, d, d2, '#EE5396', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Toolchain', 'ibm--toolchain', dt + 'toolchain', fns, d, d2, '#EE5396', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('MQ', 'ibm--mq', dt + 'mq', fns, d, d2, '#EE5396', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Ansible', 'logo--ansible-community', dt + 'ansible', fns, d, d2, '#EE5396', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('GitLab', 'logo--gitlab', dt + 'gitlab', fns, d, d2, '#EE5396', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Integration Pak', 'ibm-cloud-pak--integration', dt + 'integration pak', fns, d, d2, '#EE5396', 'none', '#ffffff', 'none');

			this.addPalette('ibm_cloudDevOps', 'IBM / DevOps', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudNetworkPalette = function(d, d2, dt)
		{
			dt += 'network ';
			var fns = [];

			this.addIBMCloudPrescribedNode('Load Balancer', 'load-balancer--vpc', dt + 'load balancer', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Application Load Balancer', 'load-balancer--application', dt + 'application load balancer', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Network Load Balancer', 'load-balancer--network', dt + 'network load balancer', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Global Load Balancer', 'load-balancer--global', dt + 'network load balancer', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Classic Load Balancer', 'load-balancer--classic', dt + 'network load balancer', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Floating IP', 'floating-ip', dt + 'floating ip', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Network Interface', 'network-interface', dt + 'network interface', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Endpoint Gateway', 'ibm-cloud--vpc-endpoints', dt + 'endpoint gateway', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Public Gateway', 'gateway--public', dt + 'public gateway', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Transit Gateway', 'ibm-cloud--transit-gateway', dt + 'transit gateway', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Direct Link Connect', 'ibm-cloud--direct-link-2--connect', dt + 'direct link connect', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Direct Link Dedicated', 'ibm-cloud--direct-link-2--dedicated', dt + 'direct link dedicated', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('DNS Services', 'dns-services', dt + 'dns services', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Internet Services', 'ibm-cloud--internet-services', dt + 'internet services', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Internet', 'wikis', dt + 'internet', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Bridge', 'arrows--horizontal', dt + 'internet', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Router', 'router', dt + 'router', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('VLAN', 'vlan', dt + 'vlan virtual lan local area network', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Classic VLAN', 'vlan--ibm', dt + 'classic vlan virtual lan local area network', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Proxy Server', 'server--proxy', dt + 'proxy server', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('L2 Switch', 'switch-layer-2', dt + 'l2 layer two switch', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('L3 Switch', 'switch-layer-3', dt + 'l3 layer three switch', fns, d, d2, '#1192E8', 'none', '#ffffff', 'none');
					   
			this.addPalette('ibm_cloudNetwork', 'IBM / Network', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudObservabilityPalette = function(d, d2, dt)
		{
			dt += 'observability ';
			var fns = [];
			
			this.addIBMCloudPrescribedNode('Cloud Logs', 'ibm-cloud--logging', dt + 'logs', fns, d, d2, '#009D9A', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Flow Logs', 'flow-logs-vpc', dt + 'flow logs', fns, d, d2, '#009D9A', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Monitoring', 'cloud--monitoring', dt + 'monitoring', fns, d, d2, '#009D9A', 'none', '#ffffff', 'none');

			this.addPalette('ibm_cloudObservability', 'IBM / Observability', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudSecurityPalette = function(d, d2, dt)
		{
			dt += 'security ';
			var fns = [];
			
			this.addIBMCloudPrescribedNode('App ID', 'ibm-cloud--app-id', dt + 'app id', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Key Protect', 'ibm-cloud--key-protect', dt + 'key protect', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Secrets Manager', 'ibm-cloud--secrets-manager', dt + 'secrets manager', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Security Compliance Center', 'ibm-cloud--security-compliance-center', dt + 'security compliance center', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('SSH Key', 'password', dt + 'ssh key', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('VPN Gateway', 'ibm--vpn-for-vpc', dt + 'vpn gateway virtual private network', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('VPN Connection', 'vpn--connection', dt + 'vpn connection virtual private network', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Bastion Host', 'bastion-host', dt + 'bastion host', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('ACL Rules', 'subnet-acl-rules', dt + 'acl rules', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Security Pak', 'ibm-cloud-pak--security', dt + 'security pak', fns, d, d2, '#FA4D56', 'none', '#ffffff', 'none');

			this.addPalette('ibm_cloudSecurity', 'IBM / Security', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudStoragePalette = function(d, d2, dt)
		{
			dt += 'storage ';
			var fns = [];

			this.addIBMCloudPrescribedNode('Block Storage', 'block-storage', dt + 'block storage', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');
			this.addIBMCloudPrescribedNode('Object Storage', 'object-storage', dt + 'object storage', fns, d, d2, '#0F62FE', 'none', '#ffffff', 'none');

			this.addPalette('ibm_cloudStorage', 'IBM / Storage', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};
		
		Sidebar.prototype.addIBMCloudConnectorsPalette = function(d, d2, dt)
		{
			var s = 'html=1;labelBackgroundColor=#ffffff;jettySize=auto;orthogonalLoop=1;fontSize=14;rounded=0;jumpStyle=gap;edgeStyle=orthogonalEdgeStyle;';
			dt += 'connectors ';
			
			var fns = [
				this.createEdgeTemplateEntry(s + 'startArrow=none;endArrow=none;strokeWidth=2;endFill=0;', 
					d, d, '', 'Connector', null, dt + 'connector'),
				this.createEdgeTemplateEntry(s + 'startArrow=none;endArrow=block;strokeWidth=2;endFill=1;', 
					d, d, '', 'Connector (Arrow)', null, dt + 'connector arrow'),
				this.createEdgeTemplateEntry(s + 'startArrow=block;endArrow=block;strokeWidth=2;startFill=1;endFill=1;', 
					d, d, '', 'Connector (Arrow, Arrow)', null, dt + 'connector arrow'),
				this.createEdgeTemplateEntry(s + 'startArrow=oval;endArrow=oval;strokeWidth=2;startFill=1;endFill=1;sourcePerimeterSpacing=3;targetPerimeterSpacing=3;', 
					d, d, '', 'Connector (Circle, Circle)', null, dt + 'connector circle'),
				this.createEdgeTemplateEntry(s + 'startArrow=oval;endArrow=block;strokeWidth=2;startFill=1;endFill=1;sourcePerimeterSpacing=3;targetPerimeterSpacing=3;', 
					d, d, '', 'Connector (Circle, Arrow)', null, dt + 'connector circle arrow'),
				this.createEdgeTemplateEntry(s + 'startArrow=oval;endArrow=oval;strokeWidth=2;startFill=1;endFill=1;sourcePerimeterSpacing=3;targetPerimeterSpacing=3;strokeColor=#198038;', 
					d, d, '', 'Private Connector (Circle, Circle)', null, dt + 'connector circle'),
				this.createEdgeTemplateEntry(s + 'startArrow=oval;endArrow=block;strokeWidth=2;startFill=1;endFill=1;strokeColor=#198038;', 
					d, d, '', 'Private Connector (Circle, Arrow)', null, dt + 'connector circle arrow'),
				this.createEdgeTemplateEntry(s + 'startArrow=oval;endArrow=oval;strokeWidth=2;startFill=1;endFill=1;sourcePerimeterSpacing=3;targetPerimeterSpacing=3;strokeColor=#0F62F3;', 
					d, d, '', 'Public Connector (Circle, Circle)', null, dt + 'connector circle'),
				this.createEdgeTemplateEntry(s + 'startArrow=oval;endArrow=block;strokeWidth=2;startFill=1;endFill=1;strokeColor=#0F62F3;', 
					d, d, '', 'Public Connector (Circle, Arrow)', null, dt + 'connector circle arrow'),
				this.createEdgeTemplateEntry(s + 'startArrow=none;endArrow=none;strokeWidth=2;dashed=1;', 
					d, d, '', 'Logical Connector', null, dt + ' logical connector'),
				this.createEdgeTemplateEntry(s + 'startArrow=none;endArrow=block;endFill=1;strokeWidth=2;dashed=1;', 
					d, d, '', 'Logical Connector (Arrow)', null, dt + ' logical connector arrow'),
				this.createEdgeTemplateEntry(s + 'startArrow=block;endArrow=block;startFill=1;endFill=1;strokeWidth=2;dashed=1;', 
					d, d, '', 'Logical Connector (Arrow, Arrow)', null, dt + ' logical connector arrow'),
				this.createEdgeTemplateEntry(s + 'startArrow=oval;endArrow=oval;startFill=1;endFill=1;strokeWidth=2;dashed=1;sourcePerimeterSpacing=3;targetPerimeterSpacing=3;', 
					d, d, '', 'Logical Connector (Circle, Circle)', null, dt + ' logical connector circle'),
				this.createEdgeTemplateEntry(s + 'startArrow=oval;endArrow=block;startFill=1;endFill=1;strokeWidth=2;dashed=1;sourcePerimeterSpacing=3;targetPerimeterSpacing=3;', 
					d, d, '', 'Logical Connector (Circle, Arrow)', null, dt + ' logical connector circle arrow'),
				this.createEdgeTemplateEntry(s + 'shape=link;startArrow=none;endArrow=none;strokeWidth=2;', 
					d, d, '', 'Physical Connector', null, dt + 'physical connector'),
				this.createEdgeTemplateEntry(s + 'shape=flexArrow;startArrow=none;endArrow=none;fillColor=#FFCCCC;strokeColor=none;', 
					d, d, '', 'Tunnel Connector', null, dt + 'tunnel connector'),
				this.createEdgeTemplateEntry(s + 'startArrow=none;endArrow=open;strokeWidth=1;', 
					d, d, '', 'Association', null, dt + 'association'),
				this.createEdgeTemplateEntry(s + 'startArrow=none;endArrow=block;endFill=0;strokeWidth=1;', 
					d, d, '', 'Extends', null, dt + 'extends'),
				this.createEdgeTemplateEntry(s + 'startArrow=diamond;startFill=1;endArrow=open;strokeWidth=1;', 
					d, d, '', 'Composition', null, dt + 'composition'),
				this.createEdgeTemplateEntry(s + 'startArrow=diamond;startFill=0;endArrow=open;strokeWidth=1;', 
					d, d, '', 'Aggregation', null, dt + 'aggregation'),
				this.createEdgeTemplateEntry(s + 'startArrow=none;endArrow=open;dashed=1;strokeWidth=1;', 
					d, d, '', 'Dependency', null, dt + 'dependency'),
				this.createEdgeTemplateEntry(s + 'startArrow=none;endArrow=block;endFill=0;dashed=1;strokeWidth=1;', 
					d, d, '', 'Implementation', null, dt + 'implementation')
			];

		   	this.addPalette('ibm_cloudConnectors', 'IBM / Connectors', false, mxUtils.bind(this, function(content)
			{
				for (var i = 0; i < fns.length; i++)
				{
					content.appendChild(fns[i](content));
				}
			}));
		};

	Sidebar.prototype.addIBMCloudActor = function(label, icon, dt, fns, d, d2, bgFillColor, bgStrokeColor, iconFillColor, iconStrokeColor)
	{
		var sb = this;
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
			{
				var bg = new mxCell(label1, new mxGeometry(0, 0, d, d),
						'shape=ellipse;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0],[0.146,0.146,0],[0.854,0.146,0],[0.854,0.854,0],[0.146,0.854,0]];fillColor=' + bgFillColor + ';aspect=fixed;resizable=0;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;strokeColor=' + bgStrokeColor + ';fontSize=14;');
				bg.vertex = true;
				
				var icon1 = new mxCell('', 
						new mxGeometry(0, 0, d2, d2), 
						'fillColor=' + iconFillColor + ';strokeColor=' + iconStrokeColor + ';dashed=0;outlineConnect=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;part=1;movable=0;resizable=0;rotatable=0;shape=mxgraph.ibm_cloud.' + icon);
				icon1.geometry.relative = true;
				icon1.geometry.offset = new mxPoint((d - d2) * 0.5, (d - d2) * 0.5);
				icon1.vertex = true;
				bg.insert(icon1);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label, false);
			})
		);
	};

	Sidebar.prototype.addIBMCloudPrescribedNode = function(label, icon, dt, fns, d, d2, bgFillColor, bgStrokeColor, iconFillColor, iconStrokeColor)
	{
		var sb = this;
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
			{
				var bg = new mxCell(label1, new mxGeometry(0, 0, d, d), 
						'shape=rect;fillColor=' + bgFillColor + ';aspect=fixed;resizable=0;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;strokeColor=' + bgStrokeColor + ';fontSize=14;');
				bg.vertex = true;
				
				var icon1 = new mxCell('', 
						new mxGeometry(0, 0, d2, d2), 
						'fillColor=' + iconFillColor + ';strokeColor=' + iconStrokeColor + ';dashed=0;outlineConnect=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;part=1;movable=0;resizable=0;rotatable=0;shape=mxgraph.ibm_cloud.' + icon);
				icon1.geometry.relative = true;
				icon1.geometry.offset = new mxPoint((d - d2) * 0.5, (d - d2) * 0.5);
				icon1.vertex = true;
				bg.insert(icon1);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label, false);
			})
		);
	};

	Sidebar.prototype.addIBMCloudPrescribedNodeExpanded = function(label, icon, dt, fns, d, d2, bgFillColor, bgStrokeColor, iconFillColor, iconStrokeColor, containerFillColor, containerStrokeColor)
	{
		var sb = this;
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt, function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 220, 140), 
						'container=1;collapsible=0;expand=0;recursiveResize=0;html=1;whiteSpace=wrap;strokeColor=' + containerStrokeColor + ';fillColor=' + containerFillColor + ';');
				bg.vertex = true;

				var iconBg = new mxCell(label, new mxGeometry(0, 0, d, d), 
						'shape=rect;fillColor=' + bgFillColor + ';aspect=fixed;resizable=0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;strokeColor=' + bgStrokeColor + ';part=1;spacingLeft=5;fontSize=14;');
				iconBg.vertex = true;
				iconBg.geometry.relative = true;
				bg.insert(iconBg);
				
				var icon1 = new mxCell('', 
						new mxGeometry(0, 0, d2, d2), 
						'fillColor=' + iconFillColor + ';shape=mxgraph.ibm_cloud.' + icon + ';strokeColor=' + iconStrokeColor + ';dashed=0;outlineConnect=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;part=1;movable=0;resizable=0;rotatable=0;');
				icon1.geometry.relative = true;
				icon1.geometry.offset = new mxPoint((d - d2) * 0.5, (d - d2) * 0.5);
				icon1.vertex = true;
				iconBg.insert(icon1);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label);
			})
		);
	};

	Sidebar.prototype.addIBMCloudPrescribedLocation = function(label, icon, dt, fns, d, d2, bgFillColor, bgStrokeColor, iconFillColor, iconStrokeColor, containerFillColor, containerStrokeColor, isGeneric, sw)
	{
		var sb = this;
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt + 'prescribed location', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 220, 140), 
						'container=1;collapsible=0;expand=0;recursiveResize=0;html=1;whiteSpace=wrap;strokeColor=' + containerStrokeColor + ';fillColor=' + containerFillColor + ';strokeWidth=' + sw);
				bg.vertex = true;

				if (!isGeneric)
				{
					var iconBg = new mxCell(label, new mxGeometry(0, 0, d, d), 
						'shape=rect;fillColor=none;aspect=fixed;resizable=0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;strokeColor=none;part=1;spacingLeft=5;fontSize=14;');
					iconBg.vertex = true;
					iconBg.geometry.relative = true;
					bg.insert(iconBg);
				}

				var iconSidebar = new mxCell(isGeneric ? label : '', new mxGeometry(0, 0, 4, d), 
						'shape=rect;fillColor=' + bgFillColor + ';aspect=fixed;resizable=0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;strokeColor=' + bgStrokeColor + ';part=1;spacingLeft=5;fontSize=14;');
				iconSidebar.vertex = true;
				iconSidebar.geometry.relative = true;
				bg.insert(iconSidebar);

				if (!isGeneric)
				{
					var icon1 = new mxCell('', 
						new mxGeometry(0, 0, d2, d2), 
						'fillColor=' + iconFillColor + ';shape=mxgraph.ibm_cloud.' + icon + ';strokeColor=' + iconStrokeColor + ';dashed=0;outlineConnect=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;part=1;movable=0;resizable=0;rotatable=0;');
					icon1.geometry.relative = true;
					icon1.geometry.offset = new mxPoint((d - d2) * 0.5, (d - d2) * 0.5);
					icon1.vertex = true;
					iconBg.insert(icon1);
				}

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label);
			})
		);
	};

	Sidebar.prototype.addIBMCloudZone = function(label, icon, dt, fns, d, d2, bgFillColor, bgStrokeColor, iconFillColor, iconStrokeColor, containerFillColor, containerStrokeColor, isGeneric, sw)
	{
		var sb = this;
		var label1 = label.replace('\n', ' ');
		var label1 = label1.replace('- ', '-');

		fns.push(
			this.addEntry(dt + 'zone', function()
			{
					var bg = new mxCell('', new mxGeometry(0, 0, 220, 140), 
						'container=1;collapsible=0;expand=0;recursiveResize=0;html=1;whiteSpace=wrap;strokeColor=' + containerStrokeColor + ';fillColor=' + containerFillColor + ';dashed=1;dashPattern=1 3;strokeWidth=' + sw);
					bg.vertex = true;

				if (isGeneric)
				{
					var iconBg = new mxCell(label, new mxGeometry(0, 0, d, d), 
						'shape=rect;fillColor=none;aspect=fixed;resizable=0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;strokeColor=none;part=1;spacingLeft=-42;fontSize=14;');
					iconBg.vertex = true;
					iconBg.geometry.relative = true;
					bg.insert(iconBg);
				}
				else
				{
					var iconBg = new mxCell(label, new mxGeometry(0, 0, d, d), 
						'shape=rect;fillColor=none;aspect=fixed;resizable=0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;strokeColor=none;part=1;spacingLeft=5;fontSize=14;');
					iconBg.vertex = true;
					iconBg.geometry.relative = true;
					bg.insert(iconBg);
	
					var icon1 = new mxCell('', 
						new mxGeometry(0, 0, d2, d2), 
						'fillColor=' + iconFillColor + ';shape=mxgraph.ibm_cloud.' + icon + ';strokeColor=' + iconStrokeColor + ';dashed=0;outlineConnect=0;html=1;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;part=1;movable=0;resizable=0;rotatable=0;');
					icon1.geometry.relative = true;
					icon1.geometry.offset = new mxPoint((d - d2) * 0.5, (d - d2) * 0.5);
					icon1.vertex = true;
					iconBg.insert(icon1);
				}
				
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, label);
			})
		);
	};

})();
