(function()
{
	// Adds Azure shapes
	Sidebar.prototype.addAzure2Palette = function()
	{
		var gn = 'mxgraph.azure2';
		var r = 400;
		var sb = this;
		var s = 'aspect=fixed;html=1;points=[];align=center;image;fontSize=12;image=img/lib/azure2/';
		
		this.setCurrentSearchEntryLibrary('azure2', 'azure2AI Machine Learning');
		this.addAzure2AIMachineLearningPalette(gn, r, sb, s + 'ai_machine_learning/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Analytics');
		this.addAzure2AnalyticsPalette(gn, r, sb, s + 'analytics/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2App Services');
		this.addAzure2AppServicesPalette(gn, r, sb, s + 'app_services/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Azure Stack');
		this.addAzure2AzureStackPalette(gn, r, sb, s + 'azure_stack/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Azure VMware Solution');
		this.addAzure2AzureVMwareSolutionPalette(gn, r, sb, s + 'azure_vmware_solution/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Blockchain');
		this.addAzure2BlockchainPalette(gn, r, sb, s + 'blockchain/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Compute');
		this.addAzure2ComputePalette(gn, r, sb, s + 'compute/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Containers');
		this.addAzure2ContainersPalette(gn, r, sb, s + 'containers/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2CXP');
		this.addAzure2CXPPalette(gn, r, sb, s + 'cxp/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Databases');
		this.addAzure2DatabasesPalette(gn, r, sb, s + 'databases/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2DevOps');
		this.addAzure2DevOpsPalette(gn, r, sb, s + 'devops/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2General');
		this.addAzure2GeneralPalette(gn, r, sb, s + 'general/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Identity');
		this.addAzure2IdentityPalette(gn, r, sb, s + 'identity/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Integration');
		this.addAzure2IntegrationPalette(gn, r, sb, s + 'integration/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Internet of Things');
		this.addAzure2InternetOfThingsPalette(gn, r, sb, s + 'internet_of_things/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Intune');
		this.addAzure2IntunePalette(gn, r, sb, s + 'intune/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2IoT');
		this.addAzure2IOTPalette(gn, r, sb, s + 'iot/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Management Governance');
		this.addAzure2ManagementGovernancePalette(gn, r, sb, s + 'management_governance/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Migrate');
		this.addAzure2MigratePalette(gn, r, sb, s + 'migrate/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Mixed Reality');
		this.addAzure2MixedRealityPalette(gn, r, sb, s + 'mixed_reality/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Monitor');
		this.addAzure2MonitorPalette(gn, r, sb, s + 'monitor/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Networking');
		this.addAzure2NetworkingPalette(gn, r, sb, s + 'networking/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Other');
		this.addAzure2OtherPalette(gn, r, sb, s + 'other/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Preview');
		this.addAzure2PreviewPalette(gn, r, sb, s + 'preview/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Security');
		this.addAzure2SecurityPalette(gn, r, sb, s + 'security/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Storage');
		this.addAzure2StoragePalette(gn, r, sb, s + 'storage/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Web');
		this.addAzure2WebPalette(gn, r, sb, s + 'web/');
		this.setCurrentSearchEntryLibrary();
	};

	Sidebar.prototype.addAzure2AIMachineLearningPalette = function(gn, r, sb, s)
	{
		var dt = 'azure ai machine learning artificial intelligence ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Bot_Services.svg;',
					r * 0.17, r * 0.17, '', 'Bot Services', null, null, this.getTagsForStencil(gn, 'bot services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cognitive_Services.svg;',
					r * 0.17, r * 0.12, '', 'Cognitive Services', null, null, this.getTagsForStencil(gn, 'cognitive services', dt).join(' '))
		];
			
		this.addPalette('azure2AI Machine Learning', 'Azure / AI and Machine Learning', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2AnalyticsPalette = function(gn, r, sb, s)
	{
		var dt = 'azure analytics ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Analysis_Services.svg;',
					r * 0.1575, r * 0.12, '', 'Analysis Services', null, null, this.getTagsForStencil(gn, 'analysis services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Synapse_Analytics.svg;',
					r * 0.15, r * 0.1725, '', 'Azure Synapse Analytics', null, null, this.getTagsForStencil(gn, 'synapse analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Lake_Store_Gen1.svg;',
					r * 0.16, r * 0.13, '', 'Data Lake Store Gen1', null, null, this.getTagsForStencil(gn, 'data lake store gen1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Hub_Clusters.svg;',
					r * 0.16, r * 0.13, '', 'Event Hub Clusters', null, null, this.getTagsForStencil(gn, 'event hub clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Hubs.svg;',
					r * 0.1675, r * 0.15, '', 'Event Hubs', null, null, this.getTagsForStencil(gn, 'event hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'HD_Insight_Clusters.svg;',
					r * 0.1575, r * 0.155, '', 'HD Insight Clusters', null, null, this.getTagsForStencil(gn, 'hd insight clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Log_Analytics_Workspaces.svg;',
					r * 0.16, r * 0.16, '', 'Log Analytics Workspaces', null, null, this.getTagsForStencil(gn, 'log analytics workspaces', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Stream_Analytics_Jobs.svg;',
					r * 0.17, r * 0.145, '', 'Stream Analytics Jobs', null, null, this.getTagsForStencil(gn, 'Stream_Analytics_Jobs', dt).join(' '))
		];
			
		this.addPalette('azure2Analytics', 'Azure / Analytics', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2AppServicesPalette = function(gn, r, sb, s)
	{
		var dt = 'azure app services ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'API_Management_Services.svg;',
					r * 0.1625, r * 0.15, '', 'API Management Services', null, null, this.getTagsForStencil(gn, 'api application programming interface management services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Service_Certificates.svg;',
					r * 0.175, r * 0.16, '', 'App Service Certificates', null, null, this.getTagsForStencil(gn, 'app service certificates', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Service_Domains.svg;',
					r * 0.1625, r * 0.13, '', 'App Service Domains', null, null, this.getTagsForStencil(gn, 'app service domains', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Service_Environments.svg;',
					r * 0.16, r * 0.16, '', 'App Service Environments', null, null, this.getTagsForStencil(gn, 'app service environments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Service_Plans.svg;',
					r * 0.16, r * 0.16, '', 'App Service Plans', null, null, this.getTagsForStencil(gn, 'app service plans', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Services.svg;',
					r * 0.16, r * 0.16, '', 'App Services', null, null, this.getTagsForStencil(gn, 'app services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CDN_Profiles.svg;',
					r * 0.17, r * 0.10, '', 'CDN Profiles', null, null, this.getTagsForStencil(gn, 'cdn profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Notification_Hubs.svg;',
					r * 0.1675, r * 0.14, '', 'Notification Hubs', null, null, this.getTagsForStencil(gn, 'notification hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Search_Services.svg;',
					r * 0.18, r * 0.13, '', 'Search Services', null, null, this.getTagsForStencil(gn, 'search services', dt).join(' '))
		];
			
		this.addPalette('azure2App Services', 'Azure / App Services', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2AzureStackPalette = function(gn, r, sb, s)
	{
		var dt = 'azure stack ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Azure_Stack.svg;',
					r * 0.155, r * 0.16, '', 'Azure Stack', null, null, this.getTagsForStencil(gn, 'azure stack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Capacity.svg;',
					r * 0.1575, r * 0.17, '', 'Capacity', null, null, this.getTagsForStencil(gn, 'capacity', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Infrastructure_Backup.svg;',
					r * 0.15, r * 0.1725, '', 'Infrastructure Backup', null, null, this.getTagsForStencil(gn, 'infrastructure backup', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Multi_Tenancy.svg;',
					r * 0.17, r * 0.1625, '', 'Multi Tenancy', null, null, this.getTagsForStencil(gn, 'multi tenancy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Offers.svg;',
					r * 0.1625, r * 0.16, '', 'Offers', null, null, this.getTagsForStencil(gn, 'offers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Plans.svg;',
					r * 0.13, r * 0.16, '', 'Plans', null, null, this.getTagsForStencil(gn, 'plans', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Updates.svg;',
					r * 0.17, r * 0.1675, '', 'Updates', null, null, this.getTagsForStencil(gn, 'updates', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'User_Subscriptions.svg;',
					r * 0.17, r * 0.165, '', 'User Subscriptions', null, null, this.getTagsForStencil(gn, 'user subscriptions', dt).join(' '))
		];
			
		this.addPalette('azure2Azure Stack', 'Azure / Azure Stack', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2AzureVMwareSolutionPalette = function(gn, r, sb, s)
	{
		var dt = 'azure vmware solution ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'AVS.svg;',
					r * 0.175, r * 0.14, '', 'AVS', null, null, this.getTagsForStencil(gn, 'avs', dt).join(' '))
		];
			
		this.addPalette('azure2Azure VMware Solution', 'Azure / VMware Solution', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2BlockchainPalette = function(gn, r, sb, s)
	{
		var dt = 'azure blockchain ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'ABS_Member.svg;',
					r * 0.14, r * 0.1625, '', 'ABS Member', null, null, this.getTagsForStencil(gn, 'abs member', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Blockchain_Service.svg;',
					r * 0.17, r * 0.17, '', 'Azure Blockchain Service', null, null, this.getTagsForStencil(gn, 'blockchain service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Token_Service.svg;',
					r * 0.1475, r * 0.17, '', 'Azure Token Service', null, null, this.getTagsForStencil(gn, 'token service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Consortium.svg;',
					r * 0.17, r * 0.17, '', 'Consortium', null, null, this.getTagsForStencil(gn, 'consortium', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Outbound_Connection.svg;',
					r * 0.1775, r * 0.16, '', 'Outbound Connection', null, null, this.getTagsForStencil(gn, 'outbound connection', dt).join(' '))
		];
			
		this.addPalette('azure2Blockchain', 'Azure / Blockchain', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2ComputePalette = function(gn, r, sb, s)
	{
		var dt = 'azure compute ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'App_Services.svg;',
					r * 0.16, r * 0.16, '', 'App Services', null, null, this.getTagsForStencil(gn, 'app services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Availability_Sets.svg;',
					r * 0.17, r * 0.17, '', 'Availability Sets', null, null, this.getTagsForStencil(gn, 'availability sets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Batch_Accounts.svg;',
					r * 0.17, r * 0.16, '', 'Batch Accounts', null, null, this.getTagsForStencil(gn, 'batch accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cloud_Services_Classic.svg;',
					r * 0.18, r * 0.13, '', 'Cloud Services (Classic)', null, null, this.getTagsForStencil(gn, 'cloud services classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Container_Instances.svg;',
					r * 0.16, r * 0.17, '', 'Container Instances', null, null, this.getTagsForStencil(gn, 'container instances', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Container_Services_Deprecated.svg;',
					r * 0.17, r * 0.15, '', 'Container Services Deprecated', null, null, this.getTagsForStencil(gn, 'container services deprecated', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Disk_Encryption_Sets.svg;',
					r * 0.17, r * 0.17, '', 'Disk Encryption Sets', null, null, this.getTagsForStencil(gn, 'disk encryption sets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Disks.svg;',
					r * 0.1425, r * 0.14, '', 'Disks', null, null, this.getTagsForStencil(gn, 'disks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Disks_Classic.svg;',
					r * 0.1425, r * 0.14, '', 'Disks (Classic)', null, null, this.getTagsForStencil(gn, 'disks classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Disks_Snapshots.svg;',
					r * 0.17, r * 0.1775, '', 'Disks Snapshots', null, null, this.getTagsForStencil(gn, 'disks snapshots', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Function_Apps.svg;',
					r * 0.17, r * 0.15, '', 'Function Apps', null, null, this.getTagsForStencil(gn, 'function apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Image_Definitions.svg;',
					r * 0.165, r * 0.16, '', 'Image Definitions', null, null, this.getTagsForStencil(gn, 'image definitions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Image_Versions.svg;',
					r * 0.1675, r * 0.16, '', 'Image Versions', null, null, this.getTagsForStencil(gn, 'image versions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Images.svg;',
					r * 0.1725, r * 0.16, '', 'Images', null, null, this.getTagsForStencil(gn, 'images', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Kubernetes_Services.svg;',
					r * 0.17, r * 0.15, '', 'Kubernetes Services', null, null, this.getTagsForStencil(gn, 'kubernetes services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Mesh_Applications.svg;',
					r * 0.17, r * 0.17, '', 'Mesh Applications', null, null, this.getTagsForStencil(gn, 'mesh applications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'OS_Images_Classic.svg;',
					r * 0.1725, r * 0.16, '', 'OS Images (Classic)', null, null, this.getTagsForStencil(gn, 'os images classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Fabric_Clusters.svg;',
					r * 0.1675, r * 0.16, '', 'Service Fabric Clusters', null, null, this.getTagsForStencil(gn, 'service fabric clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Shared_Image_Galleries.svg;',
					r * 0.16, r * 0.16, '', 'Shared Image Galleries', null, null, this.getTagsForStencil(gn, 'shared image galleries', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Machine.svg;',
					r * 0.1725, r * 0.16, '', 'Virtual Machine', null, null, this.getTagsForStencil(gn, 'virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Machines_Classic.svg;',
					r * 0.1725, r * 0.16, '', 'Virtual Machines (Classic)', null, null, this.getTagsForStencil(gn, 'virtual machines classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'VM_Images_Classic.svg;',
					r * 0.1725, r * 0.16, '', 'VM Images (Classic)', null, null, this.getTagsForStencil(gn, 'vm images classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'VM_Scale_Sets.svg;',
					r * 0.17, r * 0.17, '', 'VM Scale Sets', null, null, this.getTagsForStencil(gn, 'vm scale sets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Workspaces.svg;',
					r * 0.1625, r * 0.14, '', 'Workspaces', null, null, this.getTagsForStencil(gn, 'workspaces', dt).join(' '))
		];
			
		this.addPalette('azure2Compute', 'Azure / Compute', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2ContainersPalette = function(gn, r, sb, s)
	{
		var dt = 'azure containers ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'App_Services.svg;',
					r * 0.16, r * 0.16, '', 'App Services', null, null, this.getTagsForStencil(gn, 'app services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Batch_Accounts.svg;',
					r * 0.17, r * 0.16, '', 'Batch Accounts', null, null, this.getTagsForStencil(gn, 'batch accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Container_Instances.svg;',
					r * 0.16, r * 0.1725, '', 'Container Instances', null, null, this.getTagsForStencil(gn, 'container instances', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Container_Registries.svg;',
					r * 0.17, r * 0.1525, '', 'Container Registries', null, null, this.getTagsForStencil(gn, 'container registries', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Kubernetes_Services.svg;',
					r * 0.17, r * 0.15, '', 'Kubernetes Services', null, null, this.getTagsForStencil(gn, 'kubernetes services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Fabric_Clusters.svg;',
					r * 0.1675, r * 0.16, '', 'Service Fabric Clusters', null, null, this.getTagsForStencil(gn, 'service fabric clusters', dt).join(' '))
		];
			
		this.addPalette('azure2Containers', 'Azure / Containers', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2CXPPalette = function(gn, r, sb, s)
	{
		var dt = 'azure cxp ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Elixir.svg;',
					r * 0.1225, r * 0.17, '', 'Elixir', null, null, this.getTagsForStencil(gn, 'elixir', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Elixir_Purple.svg;',
					r * 0.1225, r * 0.17, '', 'Elixir Purple', null, null, this.getTagsForStencil(gn, 'elixir purple', dt).join(' '))
		];
			
		this.addPalette('azure2CXP', 'Azure / CXP', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2DatabasesPalette = function(gn, r, sb, s)
	{
		var dt = 'azure database db ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Azure_Cosmos_DB.svg;',
					r * 0.16, r * 0.16, '', 'Azure Cosmos DB', null, null, this.getTagsForStencil(gn, 'cosmos', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Data_Explorer_Clusters.svg;',
					r * 0.17, r * 0.17, '', 'Azure Data Explorer Clusters', null, null, this.getTagsForStencil(gn, 'data explorer clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Database_MariaDB_Server.svg;',
					r * 0.12, r * 0.16, '', 'Azure Database MariaDB Server', null, null, this.getTagsForStencil(gn, 'mariadb server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Database_Migration_Services.svg;',
					r * 0.16, r * 0.1725, '', 'Azure Database Migration Services', null, null, this.getTagsForStencil(gn, 'migration services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Database_MySQL_Server.svg;',
					r * 0.12, r * 0.16, '', 'Azure Database MySQL Server', null, null, this.getTagsForStencil(gn, 'mysql my sql server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Database_PostgreSQL_Server.svg;',
					r * 0.12, r * 0.16, '', 'Azure Database PostgreSQL Server', null, null, this.getTagsForStencil(gn, 'postgresql sql server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_SQL_Server_Stretch_Databases.svg;',
					r * 0.16, r * 0.1625, '', 'Azure SQL Server Stretch Databases', null, null, this.getTagsForStencil(gn, 'sql server stretch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_SQL_VM.svg;',
					r * 0.16, r * 0.15, '', 'Azure SQL VM', null, null, this.getTagsForStencil(gn, 'sql vm virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Synapse_Analytics.svg;',
					r * 0.15, r * 0.1725, '', 'Azure Synapse Analytics', null, null, this.getTagsForStencil(gn, 'synapse analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cache_Redis.svg;',
					r * 0.16, r * 0.13, '', 'Cache Redis', null, null, this.getTagsForStencil(gn, 'cache redis', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Factory.svg;',
					r * 0.17, r * 0.17, '', 'Data Factory', null, null, this.getTagsForStencil(gn, 'data factory', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Elastic_Job_Agents.svg;',
					r * 0.16, r * 0.16, '', 'Elastic Job Agents', null, null, this.getTagsForStencil(gn, 'elastic job agents', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Instance_Pools.svg;',
					r * 0.1625, r * 0.16, '', 'Instance Pools', null, null, this.getTagsForStencil(gn, 'instance pools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_Database.svg;',
					r * 0.17, r * 0.16, '', 'Managed Database', null, null, this.getTagsForStencil(gn, 'managed', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Data_Warehouses.svg;',
					r * 0.16, r * 0.1625, '', 'SQL Data Warehouses', null, null, this.getTagsForStencil(gn, 'sql data warehouses', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Database.svg;',
					r * 0.12, r * 0.16, '', 'SQL Database', null, null, this.getTagsForStencil(gn, 'sql', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Elastic_Pools.svg;',
					r * 0.17, r * 0.17, '', 'SQL Elastic Pools', null, null, this.getTagsForStencil(gn, 'sql elastic pools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Managed_Instance.svg;',
					r * 0.1625, r * 0.16, '', 'SQL Managed Instance', null, null, this.getTagsForStencil(gn, 'sql managed instance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Server.svg;',
					r * 0.17, r * 0.17, '', 'SQL Server', null, null, this.getTagsForStencil(gn, 'sql server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Clusters.svg;',
					r * 0.165, r * 0.16, '', 'Virtual Clusters', null, null, this.getTagsForStencil(gn, 'virtual clusters', dt).join(' '))
		];
			
		this.addPalette('azure2Databases', 'Azure / Databases', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2DevOpsPalette = function(gn, r, sb, s)
	{
		var dt = 'azure devops ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Application_Insights.svg;',
					r * 0.11, r * 0.1575, '', 'Application Insights', null, null, this.getTagsForStencil(gn, 'application insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_DevOps.svg;',
					r * 0.16, r * 0.16, '', 'Azure DevOps', null, null, this.getTagsForStencil(gn, 'devops', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DevTest_Labs.svg;',
					r * 0.165, r * 0.16, '', 'DevTest Labs', null, null, this.getTagsForStencil(gn, 'devtest labs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Lab_Services.svg;',
					r * 0.165, r * 0.16, '', 'Lab Services', null, null, this.getTagsForStencil(gn, 'lab services', dt).join(' '))
		];
			
		this.addPalette('azure2DevOps', 'Azure / DevOps', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2GeneralPalette = function(gn, r, sb, s)
	{
		var dt = 'azure general ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'All_Resources.svg;',
					r * 0.16, r * 0.16, '', 'All Resources', null, null, this.getTagsForStencil(gn, 'all resources', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Backlog.svg;',
					r * 0.17, r * 0.15, '', 'Backlog', null, null, this.getTagsForStencil(gn, 'backlog', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Biz_Talk.svg;',
					r * 0.1725, r * 0.16, '', 'Biz Talk', null, null, this.getTagsForStencil(gn, 'biz talk', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Blob_Block.svg;',
					r * 0.1625, r * 0.13, '', 'Blob Block', null, null, this.getTagsForStencil(gn, 'blob block', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Blob_Page.svg;',
					r * 0.1625, r * 0.13, '', 'Blob Page', null, null, this.getTagsForStencil(gn, 'blob page', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Branch.svg;',
					r * 0.18, r * 0.18, '', 'Branch', null, null, this.getTagsForStencil(gn, 'branch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Browser.svg;',
					r * 0.1625, r * 0.13, '', 'Browser', null, null, this.getTagsForStencil(gn, 'browser', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Bug.svg;',
					r * 0.1475, r * 0.16, '', 'Bug', null, null, this.getTagsForStencil(gn, 'bug', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Builds.svg;',
					r * 0.16, r * 0.16, '', 'Builds', null, null, this.getTagsForStencil(gn, 'builds', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cache.svg;',
					r * 0.16, r * 0.16, '', 'Cache', null, null, this.getTagsForStencil(gn, 'cache', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Code.svg;',
					r * 0.16, r * 0.13, '', 'Code', null, null, this.getTagsForStencil(gn, 'code', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Commit.svg;',
					r * 0.18, r * 0.17, '', 'Commit', null, null, this.getTagsForStencil(gn, 'commit', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Controls.svg;',
					r * 0.14, r * 0.1725, '', 'Controls', null, null, this.getTagsForStencil(gn, 'controls', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Controls_Horizontal.svg;',
					r * 0.1725, r * 0.14, '', 'Controls Horizontal', null, null, this.getTagsForStencil(gn, 'controls horizontal', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Alerts.svg;',
					r * 0.1675, r * 0.14, '', 'Cost Alerts', null, null, this.getTagsForStencil(gn, 'cost alerts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Analysis.svg;',
					r * 0.15, r * 0.175, '', 'Cost Analysis', null, null, this.getTagsForStencil(gn, 'cost analysis', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Budgets.svg;',
					r * 0.1675, r * 0.17, '', 'Cost Budgets', null, null, this.getTagsForStencil(gn, 'cost budgets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Management.svg;',
					r * 0.1675, r * 0.15, '', 'Cost Management', null, null, this.getTagsForStencil(gn, 'cost management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Counter.svg;',
					r * 0.16, r * 0.13, '', 'Counter', null, null, this.getTagsForStencil(gn, 'counter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cubes.svg;',
					r * 0.1675, r * 0.17, '', 'Cubes', null, null, this.getTagsForStencil(gn, 'cubes', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Dashboard.svg;',
					r * 0.17, r * 0.12, '', 'Dashboard', null, null, this.getTagsForStencil(gn, 'dashboard', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Dev_Console.svg;',
					r * 0.1625, r * 0.13, '', 'Dev Console', null, null, this.getTagsForStencil(gn, 'dev console', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Download.svg;',
					r * 0.16, r * 0.1675, '', 'Download', null, null, this.getTagsForStencil(gn, 'download', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Error.svg;',
					r * 0.1775, r * 0.17, '', 'Error', null, null, this.getTagsForStencil(gn, 'error', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Extensions.svg;',
					r * 0.1625, r * 0.16, '', 'Extensions', null, null, this.getTagsForStencil(gn, 'extensions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'File.svg;',
					r * 0.14, r * 0.1725, '', 'File', null, null, this.getTagsForStencil(gn, 'file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Files.svg;',
					r * 0.16, r * 0.175, '', 'Files', null, null, this.getTagsForStencil(gn, 'files', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Folder_Blank.svg;',
					r * 0.1725, r * 0.14, '', 'Folder Blank', null, null, this.getTagsForStencil(gn, 'folder blank', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Folder_Website.svg;',
					r * 0.17, r * 0.14, '', 'Folder Website', null, null, this.getTagsForStencil(gn, 'folder website', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'FTP.svg;',
					r * 0.15, r * 0.12, '', 'FTP', null, null, this.getTagsForStencil(gn, 'ftp file transfer protocol', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Gear.svg;',
					r * 0.16, r * 0.16, '', 'Gear', null, null, this.getTagsForStencil(gn, 'gear', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Globe.svg;',
					r * 0.14, r * 0.165, '', 'Globe', null, null, this.getTagsForStencil(gn, 'globe', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Globe_Error.svg;',
					r * 0.14, r * 0.165, '', 'Globe Error', null, null, this.getTagsForStencil(gn, 'globe error', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Globe_Success.svg;',
					r * 0.14, r * 0.165, '', 'Globe Success', null, null, this.getTagsForStencil(gn, 'globe success', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Globe_Warning.svg;',
					r * 0.14, r * 0.165, '', 'Globe Warning', null, null, this.getTagsForStencil(gn, 'globe warning', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Guide.svg;',
					r * 0.17, r * 0.17, '', 'Guide', null, null, this.getTagsForStencil(gn, 'guide', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Heart.svg;',
					r * 0.16, r * 0.15, '', 'Heart', null, null, this.getTagsForStencil(gn, 'heart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Help_and_Support.svg;',
					r * 0.14, r * 0.1725, '', 'Help and Support', null, null, this.getTagsForStencil(gn, 'help support', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Image.svg;',
					r * 0.16, r * 0.11, '', 'Image', null, null, this.getTagsForStencil(gn, 'image', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Information.svg;',
					r * 0.16, r * 0.16, '', 'Information', null, null, this.getTagsForStencil(gn, 'information', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Input_Output.svg;',
					r * 0.16, r * 0.1375, '', 'Input Output', null, null, this.getTagsForStencil(gn, 'input output', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Journey_Hub.svg;',
					r * 0.15, r * 0.1575, '', 'Journey Hub', null, null, this.getTagsForStencil(gn, 'journey hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Launch_Portal.svg;',
					r * 0.17, r * 0.1675, '', 'Launch Portal', null, null, this.getTagsForStencil(gn, 'launch portal', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Learn.svg;',
					r * 0.12, r * 0.175, '', 'Learn', null, null, this.getTagsForStencil(gn, 'learn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Load_Test.svg;',
					r * 0.17, r * 0.165, '', 'Load Test', null, null, this.getTagsForStencil(gn, 'load test', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Location.svg;',
					r * 0.10, r * 0.1775, '', 'Location', null, null, this.getTagsForStencil(gn, 'location', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Log_Streaming.svg;',
					r * 0.14, r * 0.1675, '', 'Log Streaming', null, null, this.getTagsForStencil(gn, 'log streaming', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Management_Groups.svg;',
					r * 0.165, r * 0.16, '', 'Management Groups', null, null, this.getTagsForStencil(gn, 'management groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Management_Portal.svg;',
					r * 0.15, r * 0.12, '', 'Management Portal', null, null, this.getTagsForStencil(gn, 'management portal', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Marketplace.svg;',
					r * 0.14, r * 0.16, '', 'Marketplace', null, null, this.getTagsForStencil(gn, 'marketplace', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Media.svg;',
					r * 0.17, r * 0.17, '', 'Media', null, null, this.getTagsForStencil(gn, 'media', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Media_File.svg;',
					r * 0.13, r * 0.16, '', 'Media File', null, null, this.getTagsForStencil(gn, 'media file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Mobile.svg;',
					r * 0.1, r * 0.1675, '', 'Mobile', null, null, this.getTagsForStencil(gn, 'mobile', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Mobile_Engagement.svg;',
					r * 0.1, r * 0.1675, '', 'Mobile Engagement', null, null, this.getTagsForStencil(gn, 'mobile engagement', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Module.svg;',
					r * 0.16, r * 0.16, '', 'Module', null, null, this.getTagsForStencil(gn, 'module', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Power.svg;',
					r * 0.11, r * 0.17, '', 'Power', null, null, this.getTagsForStencil(gn, 'power', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Power_Up.svg;',
					r * 0.17, r * 0.17, '', 'Power Up', null, null, this.getTagsForStencil(gn, 'power up', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Powershell.svg;',
					r * 0.1625, r * 0.13, '', 'Powershell', null, null, this.getTagsForStencil(gn, 'powershell', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Preview.svg;',
					r * 0.11, r * 0.16, '', 'Preview', null, null, this.getTagsForStencil(gn, 'preview', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Process_Explorer.svg;',
					r * 0.175, r * 0.17, '', 'Process Explorer', null, null, this.getTagsForStencil(gn, 'process explorer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Production_Ready_Database.svg;',
					r * 0.12, r * 0.16, '', 'Production Ready Database', null, null, this.getTagsForStencil(gn, 'production ready database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Quickstart_Center.svg;',
					r * 0.17, r * 0.17, '', 'Quickstart Center', null, null, this.getTagsForStencil(gn, 'quickstart center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Recent.svg;',
					r * 0.17, r * 0.17, '', 'Recent', null, null, this.getTagsForStencil(gn, 'recent', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Reservations.svg;',
					r * 0.17, r * 0.17, '', 'Reservations', null, null, this.getTagsForStencil(gn, 'reservations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Group_List.svg;',
					r * 0.17, r * 0.1675, '', 'Resource Group List', null, null, this.getTagsForStencil(gn, 'resource group list', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Groups.svg;',
					r * 0.17, r * 0.16, '', 'Resource Groups', null, null, this.getTagsForStencil(gn, 'resource groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Linked.svg;',
					r * 0.18, r * 0.18, '', 'Resource Linked', null, null, this.getTagsForStencil(gn, 'resource linked', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Scale.svg;',
					r * 0.15, r * 0.15, '', 'Scale', null, null, this.getTagsForStencil(gn, 'scale', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Scheduler.svg;',
					r * 0.17, r * 0.17, '', 'Scheduler', null, null, this.getTagsForStencil(gn, 'scheduler', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Search.svg;',
					r * 0.16, r * 0.1625, '', 'Search', null, null, this.getTagsForStencil(gn, 'search', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Search_Grid.svg;',
					r * 0.17, r * 0.1675, '', 'Search Grid', null, null, this.getTagsForStencil(gn, 'search grid', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Server_Farm.svg;',
					r * 0.16, r * 0.16, '', 'Server Farm', null, null, this.getTagsForStencil(gn, 'server farm', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Bus.svg;',
					r * 0.175, r * 0.15, '', 'Service Bus', null, null, this.getTagsForStencil(gn, 'service bus', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Health.svg;',
					r * 0.17, r * 0.16, '', 'Service Health', null, null, this.getTagsForStencil(gn, 'service health', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SSD.svg;',
					r * 0.165, r * 0.15, '', 'SSD', null, null, this.getTagsForStencil(gn, 'ssd solid state drive', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Azure_Files.svg;',
					r * 0.16, r * 0.13, '', 'Storage Azure Files', null, null, this.getTagsForStencil(gn, 'storage files', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Container.svg;',
					r * 0.16, r * 0.13, '', 'Storage Container', null, null, this.getTagsForStencil(gn, 'storage container', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Queue.svg;',
					r * 0.16, r * 0.13, '', 'Storage Queue', null, null, this.getTagsForStencil(gn, 'storage queue', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Subscriptions.svg;',
					r * 0.11, r * 0.1775, '', 'Subscriptions', null, null, this.getTagsForStencil(gn, 'subscriptions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Table.svg;',
					r * 0.16, r * 0.13, '', 'Table', null, null, this.getTagsForStencil(gn, 'table', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Tags.svg;',
					r * 0.15, r * 0.1625, '', 'Tags', null, null, this.getTagsForStencil(gn, 'tags', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'TFS_VC_Repository.svg;',
					r * 0.17, r * 0.17, '', 'TFS VC Repository', null, null, this.getTagsForStencil(gn, 'tfs vc repository', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Toolbox.svg;',
					r * 0.16, r * 0.14, '', 'Toolbox', null, null, this.getTagsForStencil(gn, 'toolbox', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Versions.svg;',
					r * 0.155, r * 0.15, '', 'Versions', null, null, this.getTagsForStencil(gn, 'versions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_Slots.svg;',
					r * 0.145, r * 0.16, '', 'Web Slots', null, null, this.getTagsForStencil(gn, 'web slots', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_Test.svg;',
					r * 0.18, r * 0.18, '', 'Web Test', null, null, this.getTagsForStencil(gn, 'web test', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Website_Power.svg;',
					r * 0.17, r * 0.17, '', 'Website Power', null, null, this.getTagsForStencil(gn, 'website power', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Website_Staging.svg;',
					r * 0.16, r * 0.175, '', 'Website Staging', null, null, this.getTagsForStencil(gn, 'website staging', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Workbooks.svg;',
					r * 0.15, r * 0.1625, '', 'Workbooks', null, null, this.getTagsForStencil(gn, 'workbooks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Workflow.svg;',
					r * 0.17, r * 0.175, '', 'Workflow', null, null, this.getTagsForStencil(gn, 'workflow', dt).join(' '))
		];
			
		this.addPalette('azure2General', 'Azure / General', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2IdentityPalette = function(gn, r, sb, s)
	{
		var dt = 'azure identity ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Active_Directory_Connect_Health.svg;',
					r * 0.1725, r * 0.16, '', 'Active Directory Connect Health', null, null, this.getTagsForStencil(gn, 'active directory connect health', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Registrations.svg;',
					r * 0.1575, r * 0.16, '', 'App Registrations', null, null, this.getTagsForStencil(gn, 'app registrations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Active_Directory.svg;',
					r * 0.175, r * 0.16, '', 'Azure Active Directory', null, null, this.getTagsForStencil(gn, 'active directory', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_AD_B2C.svg;',
					r * 0.1725, r * 0.16, '', 'Azure AD B2C', null, null, this.getTagsForStencil(gn, 'ad b2c', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_AD_Domain_Services.svg;',
					r * 0.175, r * 0.16, '', 'Azure AD Domain Services', null, null, this.getTagsForStencil(gn, 'ad domain services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Enterprise_Applications.svg;',
					r * 0.16, r * 0.16, '', 'Enterprise Applications', null, null, this.getTagsForStencil(gn, 'enterprise applications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Groups.svg;',
					r * 0.17, r * 0.14, '', 'Groups', null, null, this.getTagsForStencil(gn, 'groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Identity_Governance.svg;',
					r * 0.16, r * 0.16, '', 'Identity Governance', null, null, this.getTagsForStencil(gn, 'identity governance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Users.svg;',
					r * 0.16, r * 0.175, '', 'Users', null, null, this.getTagsForStencil(gn, 'users', dt).join(' '))
		];
			
		this.addPalette('azure2Identity', 'Azure / Identity', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2IntegrationPalette = function(gn, r, sb, s)
	{
		var dt = 'azure integration ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'API_Management_Services.svg;',
					r * 0.1625, r * 0.15, '', 'API Management Services', null, null, this.getTagsForStencil(gn, 'api application programming interface management services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Data_Catalog.svg;',
					r * 0.15, r * 0.1675, '', 'Azure Data Catalog', null, null, this.getTagsForStencil(gn, 'data catalog', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Grid_Domains.svg;',
					r * 0.1675, r * 0.15, '', 'Event Grid Domains', null, null, this.getTagsForStencil(gn, 'event grid domains', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Grid_Subscriptions.svg;',
					r * 0.1675, r * 0.15, '', 'Event Grid Subscriptions', null, null, this.getTagsForStencil(gn, 'event grid subscriptions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Grid_Topics.svg;',
					r * 0.1675, r * 0.15, '', 'Event Grid Topics', null, null, this.getTagsForStencil(gn, 'event grid topics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Integration_Accounts.svg;',
					r * 0.16, r * 0.16, '', 'Integration Accounts', null, null, this.getTagsForStencil(gn, 'integration accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Logic_Apps.svg;',
					r * 0.1675, r * 0.13, '', 'Logic Apps', null, null, this.getTagsForStencil(gn, 'logic apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Relays.svg;',
					r * 0.1675, r * 0.15, '', 'Relays', null, null, this.getTagsForStencil(gn, 'relays', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Software_as_a_Service.svg;',
					r * 0.16, r * 0.1325, '', 'Software as a Service', null, null, this.getTagsForStencil(gn, 'software service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Data_Warehouses.svg;',
					r * 0.16, r * 0.1625, '', 'SQL Data Warehouses', null, null, this.getTagsForStencil(gn, 'sql data warehouses', dt).join(' '))
		];
			
		this.addPalette('azure2Integration', 'Azure / Integration', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2InternetOfThingsPalette = function(gn, r, sb, s)
	{
		var dt = 'azure iot internet of things ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Digital_Twins.svg;',
					r * 0.17, r * 0.1725, '', 'Digital Twins', null, null, this.getTagsForStencil(gn, 'digital twins', dt).join(' '))
		];
			
		this.addPalette('azure2Internet of Things', 'Azure / Internet of Things', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2IntunePalette = function(gn, r, sb, s)
	{
		var dt = 'azure intune ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Azure_AD_Roles_and_Administrators.svg;',
					r * 0.16, r * 0.16, '', 'Azure AD Roles and Administrators', null, null, this.getTagsForStencil(gn, 'ad roles administrators', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Security_Apple.svg;',
					r * 0.17, r * 0.1725, '', 'Device Security Apple', null, null, this.getTagsForStencil(gn, 'device security apple', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Security_Google.svg;',
					r * 0.17, r * 0.1725, '', 'Device Security Google', null, null, this.getTagsForStencil(gn, 'device security google', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Security_Windows.svg;',
					r * 0.17, r * 0.1725, '', 'Device Security Windows', null, null, this.getTagsForStencil(gn, 'device security windows', dt).join(' '))
		];
			
		this.addPalette('azure2Intune', 'Azure / Intune', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2IOTPalette = function(gn, r, sb, s)
	{
		var dt = 'azure iot internet of things ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Azure_Maps_Accounts.svg;',
					r * 0.17, r * 0.17, '', 'Azure Maps Accounts', null, null, this.getTagsForStencil(gn, 'maps accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Provisioning_Services.svg;',
					r * 0.16, r * 0.165, '', 'Device Provisioning Services', null, null, this.getTagsForStencil(gn, 'device provisioning services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Hubs.svg;',
					r * 0.1675, r * 0.15, '', 'Event Hubs', null, null, this.getTagsForStencil(gn, 'event hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Function_Apps.svg;',
					r * 0.17, r * 0.15, '', 'Function Apps', null, null, this.getTagsForStencil(gn, 'function apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IoT_Central_Applications.svg;',
					r * 0.15, r * 0.1725, '', 'IoT Central Applications', null, null, this.getTagsForStencil(gn, 'central applications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IoT_Hub.svg;',
					r * 0.16, r * 0.16, '', 'IoT Hub', null, null, this.getTagsForStencil(gn, 'roles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Logic_Apps.svg;',
					r * 0.1675, r * 0.13, '', 'Logic Apps', null, null, this.getTagsForStencil(gn, 'logic apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Notification_Hubs.svg;',
					r * 0.1675, r * 0.14, '', 'Notification Hubs', null, null, this.getTagsForStencil(gn, 'notification hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Stream_Analytics_Jobs.svg;',
					r * 0.17, r * 0.145, '', 'Stream Analytics Jobs', null, null, this.getTagsForStencil(gn, 'stream analytics jobs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Time_Series_Insights_Environments.svg;',
					r * 0.1675, r * 0.17, '', 'Time Series Insights Environments', null, null, this.getTagsForStencil(gn, 'time series insights environments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Time_Series_Insights_Event_Sources.svg;',
					r * 0.1675, r * 0.17, '', 'Time Series Insights Event Sources', null, null, this.getTagsForStencil(gn, 'time series insights event sources', dt).join(' '))
		];
			
		this.addPalette('azure2IoT', 'Azure / IoT', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2ManagementGovernancePalette = function(gn, r, sb, s)
	{
		var dt = 'azure management governance ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Activity_Log.svg;',
					r * 0.14, r * 0.1675, '', 'Activity Log', null, null, this.getTagsForStencil(gn, 'activity log', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Advisor.svg;',
					r * 0.165, r * 0.16, '', 'Advisor', null, null, this.getTagsForStencil(gn, 'advisor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Alerts.svg;',
					r * 0.1675, r * 0.14, '', 'Alerts', null, null, this.getTagsForStencil(gn, 'alerts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Application_Insights.svg;',
					r * 0.11, r * 0.1575, '', 'Application Insights', null, null, this.getTagsForStencil(gn, 'application insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Automation_Accounts.svg;',
					r * 0.17, r * 0.17, '', 'Automation Accounts', null, null, this.getTagsForStencil(gn, 'automation accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Arc.svg;',
					r * 0.1725, r * 0.13, '', 'Azure Arc', null, null, this.getTagsForStencil(gn, 'arc', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Lighthouse.svg;',
					r * 0.1475, r * 0.17, '', 'Azure Lighthouse', null, null, this.getTagsForStencil(gn, 'lighthouse', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Blueprints.svg;',
					r * 0.1625, r * 0.16, '', 'Blueprints', null, null, this.getTagsForStencil(gn, 'blueprints', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Compliance.svg;',
					r * 0.13, r * 0.16, '', 'Compliance', null, null, this.getTagsForStencil(gn, 'compliance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Diagnostics_Settings.svg;',
					r * 0.14, r * 0.1675, '', 'Diagnostics Settings', null, null, this.getTagsForStencil(gn, 'diagnostics settings', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Education.svg;',
					r * 0.1675, r * 0.13, '', 'Education', null, null, this.getTagsForStencil(gn, 'education', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Log_Analytics_Workspaces.svg;',
					r * 0.16, r * 0.16, '', 'Log Analytics Workspaces', null, null, this.getTagsForStencil(gn, 'log analytics workspaces', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'MachinesAzureArc.svg;',
					r * 0.11, r * 0.17, '', 'MachinesAzureArc', null, null, this.getTagsForStencil(gn, 'machines arc', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_Applications_Center.svg;',
					r * 0.17, r * 0.135, '', 'Managed Applications Center', null, null, this.getTagsForStencil(gn, 'managed applications center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Metrics.svg;',
					r * 0.15, r * 0.1625, '', 'Metrics', null, null, this.getTagsForStencil(gn, 'metrics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Monitor.svg;',
					r * 0.16, r * 0.16, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'My_Customers.svg;',
					r * 0.1725, r * 0.14, '', 'My Customers', null, null, this.getTagsForStencil(gn, 'my customers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Operation_Log_Classic.svg;',
					r * 0.14, r * 0.1675, '', 'Operation Log (Classic)', null, null, this.getTagsForStencil(gn, 'operation log classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Policy.svg;',
					r * 0.15, r * 0.16, '', 'Policy', null, null, this.getTagsForStencil(gn, 'policy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Recovery_Services_Vaults.svg;',
					r * 0.1725, r * 0.15, '', 'Recovery Services Vaults', null, null, this.getTagsForStencil(gn, 'recovery services vaults', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Graph_Explorer.svg;',
					r * 0.1675, r * 0.16, '', 'Resource Graph Explorer', null, null, this.getTagsForStencil(gn, 'resource graph explorer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Providers.svg;',
					r * 0.165, r * 0.17, '', 'Service Providers', null, null, this.getTagsForStencil(gn, 'service providers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'solutions.svg;',
					r * 0.16, r * 0.16, '', 'Solutions', null, null, this.getTagsForStencil(gn, 'solutions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'User_Privacy.svg;',
					r * 0.16, r * 0.17, '', 'User Privacy', null, null, this.getTagsForStencil(gn, 'user privacy', dt).join(' '))
		];
			
		this.addPalette('azure2Management Governance', 'Azure / Management Governance', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2MigratePalette = function(gn, r, sb, s)
	{
		var dt = 'azure migrate ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Azure_Migrate.svg;',
					r * 0.18, r * 0.11, '', 'Azure Migrate', null, null, this.getTagsForStencil(gn, 'migrate', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Box.svg;',
					r * 0.1775, r * 0.17, '', 'Data Box', null, null, this.getTagsForStencil(gn, 'data box', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Box_Edge.svg;',
					r * 0.1675, r * 0.12, '', 'Data Box Edge', null, null, this.getTagsForStencil(gn, 'data box edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Recovery_Services_Vaults.svg;',
					r * 0.1725, r * 0.15, '', 'Recovery Services Vaults', null, null, this.getTagsForStencil(gn, 'recovery services vaults', dt).join(' '))
		];
			
		this.addPalette('azure2Migrate', 'Azure / Migrate', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2MixedRealityPalette = function(gn, r, sb, s)
	{
		var dt = 'azure mixed reality ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Remote_Rendering.svg;',
					r * 0.17, r * 0.12, '', 'Remote Rendering', null, null, this.getTagsForStencil(gn, 'remote rendering', dt).join(' '))
		];
			
		this.addPalette('azure2Mixed Reality', 'Azure / Mixed Reality', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2MonitorPalette = function(gn, r, sb, s)
	{
		var dt = 'azure monitor ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'SAP_Azure_Monitor.svg;',
					r * 0.175, r * 0.14, '', 'SAP Azure Monitor', null, null, this.getTagsForStencil(gn, 'sap monitor', dt).join(' '))
		];
			
		this.addPalette('azure2Monitor', 'Azure / Monitor', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2NetworkingPalette = function(gn, r, sb, s)
	{
		var dt = 'azure network networking ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Application_Gateways.svg;',
					r * 0.16, r * 0.16, '', 'Application Gateways', null, null, this.getTagsForStencil(gn, 'application gateways', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Firewall_Manager.svg;',
					r * 0.175, r * 0.15, '', 'Azure Firewall Manager', null, null, this.getTagsForStencil(gn, 'firewall manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CDN_Profiles.svg;',
					r * 0.17, r * 0.1, '', 'CDN Profiles', null, null, this.getTagsForStencil(gn, 'cdn profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Connections.svg;',
					r * 0.17, r * 0.17, '', 'Connections', null, null, this.getTagsForStencil(gn, 'connections', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DDoS_Protection_Plans.svg;',
					r * 0.14, r * 0.17, '', 'DDoS Protection Plans', null, null, this.getTagsForStencil(gn, 'ddos protection plans', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DNS_Zones.svg;',
					r * 0.16, r * 0.16, '', 'DNS Zones', null, null, this.getTagsForStencil(gn, 'dns domain name server zones', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ExpressRoute_Circuits.svg;',
					r * 0.175, r * 0.16, '', 'ExpressRoute Circuits', null, null, this.getTagsForStencil(gn, 'expressroute circuits', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Firewalls.svg;',
					r * 0.1775, r * 0.15, '', 'Firewalls', null, null, this.getTagsForStencil(gn, 'firewalls', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Front_Doors.svg;',
					r * 0.17, r * 0.15, '', 'Front Doors', null, null, this.getTagsForStencil(gn, 'front doors', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IP_Groups.svg;',
					r * 0.1675, r * 0.13, '', 'IP Groups', null, null, this.getTagsForStencil(gn, 'ip internet protocol groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Load_Balancers.svg;',
					r * 0.18, r * 0.18, '', 'Load Balancers', null, null, this.getTagsForStencil(gn, 'load balancers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'NAT.svg;',
					r * 0.17, r * 0.17, '', 'NAT', null, null, this.getTagsForStencil(gn, 'nat', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Network_Interfaces.svg;',
					r * 0.17, r * 0.15, '', 'Network Interfaces', null, null, this.getTagsForStencil(gn, 'network interfaces', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Network_Security_Groups.svg;',
					r * 0.14, r * 0.17, '', 'Network Security Groups', null, null, this.getTagsForStencil(gn, 'network security groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Network_Watcher.svg;',
					r * 0.16, r * 0.16, '', 'Network Watcher', null, null, this.getTagsForStencil(gn, 'network watcher', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Endpoint.svg;',
					r * 0.18, r * 0.165, '', 'Private Endpoint', null, null, this.getTagsForStencil(gn, 'private endpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Link.svg;',
					r * 0.18, r * 0.165, '', 'Private Link', null, null, this.getTagsForStencil(gn, 'private link', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Link_Service.svg;',
					r * 0.1725, r * 0.1, '', 'Private Link Service', null, null, this.getTagsForStencil(gn, 'private link service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Proximity_Placement_Groups.svg;',
					r * 0.18, r * 0.17, '', 'Proximity Placement Groups', null, null, this.getTagsForStencil(gn, 'proximity placement groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Public_IP_Addresses.svg;',
					r * 0.1625, r * 0.13, '', 'Public IP Addresses', null, null, this.getTagsForStencil(gn, 'public ip addresses', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Public_IP_Addresses_Classic.svg;',
					r * 0.16, r * 0.13, '', 'Public IP Addresses (Classic)', null, null, this.getTagsForStencil(gn, 'public ip internet protocol addresses classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Public_IP_Prefixes.svg;',
					r * 0.18, r * 0.14, '', 'Public IP Prefixes', null, null, this.getTagsForStencil(gn, 'public ip internet protocol prefixes', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Reserved_IP_Addresses_Classic.svg;',
					r * 0.17, r * 0.1375, '', 'Reserved IP Addresses (Classic)', null, null, this.getTagsForStencil(gn, 'reserved ip internet protocol addresses classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Route_Filters.svg;',
					r * 0.1775, r * 0.11, '', 'Route Filters', null, null, this.getTagsForStencil(gn, 'route filters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Route_Tables.svg;',
					r * 0.16, r * 0.155, '', 'Route Tables', null, null, this.getTagsForStencil(gn, 'route tables', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Endpoint_Policies.svg;',
					r * 0.155, r * 0.16, '', 'Service Endpoint Policies', null, null, this.getTagsForStencil(gn, 'service endpoint policies', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Traffic_Manager_Profiles.svg;',
					r * 0.17, r * 0.17, '', 'Traffic Manager Profiles', null, null, this.getTagsForStencil(gn, 'traffic manager profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Network_Gateways.svg;',
					r * 0.13, r * 0.1725, '', 'Virtual Network Gateways', null, null, this.getTagsForStencil(gn, 'virtual network gateways', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Networks.svg;',
					r * 0.1675, r * 0.1, '', 'Virtual Networks', null, null, this.getTagsForStencil(gn, 'virtual networks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Networks_Classic.svg;',
					r * 0.1675, r * 0.1, '', 'Virtual Networks (Classic)', null, null, this.getTagsForStencil(gn, 'virtual networks classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_WANs.svg;',
					r * 0.1625, r * 0.16, '', 'Virtual WANs', null, null, this.getTagsForStencil(gn, 'virtual wans wan wide area network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_Application_Firewall_Policies_WAF.svg;',
					r * 0.17, r * 0.17, '', 'Web Application Firewall Policies (WAF)', null, null, this.getTagsForStencil(gn, 'web application firewall policies waf', dt).join(' '))
		];
			
		this.addPalette('azure2Networking', 'Azure / Networking', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2OtherPalette = function(gn, r, sb, s)
	{
		var dt = 'azure other ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Detonation.svg;',
					r * 0.155, r * 0.16, '', 'Detonation', null, null, this.getTagsForStencil(gn, 'detonation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Instance_Pools.svg;',
					r * 0.1625, r * 0.16, '', 'Instance Pools', null, null, this.getTagsForStencil(gn, 'instance pools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Internet_Analyzer_Profiles.svg;',
					r * 0.17, r * 0.16, '', 'Internet Analyzer Profiles', null, null, this.getTagsForStencil(gn, 'internet analyzer profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Peering_Service.svg;',
					r * 0.17, r * 0.1725, '', 'Peering Service', null, null, this.getTagsForStencil(gn, 'peering service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Universal_Print.svg;',
					r * 0.175, r * 0.15, '', 'Universal Print', null, null, this.getTagsForStencil(gn, 'universal print', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Windows_Virtual_Desktop.svg;',
					r * 0.17, r * 0.17, '', 'Windows Virtual Desktop', null, null, this.getTagsForStencil(gn, 'windows virtual desktop', dt).join(' '))
		];
			
		this.addPalette('azure2Other', 'Azure / Other', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2PreviewPalette = function(gn, r, sb, s)
	{
		var dt = 'azure preview ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Azure_Cloud_Shell.svg;',
					r * 0.17, r * 0.12, '', 'Azure Cloud Shell', null, null, this.getTagsForStencil(gn, 'cloud shell', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Sphere.svg;',
					r * 0.165, r * 0.17, '', 'Azure Sphere', null, null, this.getTagsForStencil(gn, 'sphere', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Workbooks.svg;',
					r * 0.18, r * 0.18, '', 'Azure Workbooks', null, null, this.getTagsForStencil(gn, 'workbooks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IoT_Edge.svg;',
					r * 0.17, r * 0.1675, '', 'IoT Edge', null, null, this.getTagsForStencil(gn, 'iot internet of things edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Link_Hub.svg;',
					r * 0.15, r * 0.1725, '', 'Private Link Hub', null, null, this.getTagsForStencil(gn, 'private link hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'RTOS.svg;',
					r * 0.17, r * 0.17, '', 'RTOS', null, null, this.getTagsForStencil(gn, 'rtos', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Static_Apps.svg;',
					r * 0.175, r * 0.14, '', 'Static Apps', null, null, this.getTagsForStencil(gn, 'static apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Time_Series_Data_Sets.svg;',
					r * 0.12, r * 0.16, '', 'Time Series Data Sets', null, null, this.getTagsForStencil(gn, 'time series data sets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_Environment.svg;',
					r * 0.16, r * 0.165, '', 'Web Environment', null, null, this.getTagsForStencil(gn, 'web environment', dt).join(' '))
		];
			
		this.addPalette('azure2Preview', 'Azure / Preview', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2SecurityPalette = function(gn, r, sb, s)
	{
		var dt = 'azure security ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Application_Security_Groups.svg;',
					r * 0.14, r * 0.17, '', 'Application Security Groups', null, null, this.getTagsForStencil(gn, 'application security groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Sentinel.svg;',
					r * 0.14, r * 0.17, '', 'Azure Sentinel', null, null, this.getTagsForStencil(gn, 'sentinel', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Conditional_Access.svg;',
					r * 0.14, r * 0.17, '', 'Conditional Access', null, null, this.getTagsForStencil(gn, 'conditional access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ExtendedSecurityUpdates.svg;',
					r * 0.16, r * 0.175, '', 'Extended Security Updates', null, null, this.getTagsForStencil(gn, 'extended security updates', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Key_Vaults.svg;',
					r * 0.17, r * 0.17, '', 'Key Vaults', null, null, this.getTagsForStencil(gn, 'key vaults', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Keys.svg;',
					r * 0.18, r * 0.19, '', 'Keys', null, null, this.getTagsForStencil(gn, 'keys', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Security_Center.svg;',
					r * 0.14, r * 0.17, '', 'Security Center', null, null, this.getTagsForStencil(gn, 'security center', dt).join(' '))
		];
			
		this.addPalette('azure2Security', 'Azure / Security', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2StoragePalette = function(gn, r, sb, s)
	{
		var dt = 'azure storage ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Azure_HCP_Cache.svg;',
					r * 0.17, r * 0.1575, '', 'Azure HCP Cache', null, null, this.getTagsForStencil(gn, 'hcp cache', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_NetApp_Files.svg;',
					r * 0.1625, r * 0.13, '', 'Azure NetApp Files', null, null, this.getTagsForStencil(gn, 'netapp files', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Stack_Edge.svg;',
					r * 0.17, r * 0.12, '', 'Azure Stack Edge', null, null, this.getTagsForStencil(gn, 'stack edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Box.svg;',
					r * 0.1775, r * 0.17, '', 'Data Box', null, null, this.getTagsForStencil(gn, 'data box', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Box_Edge.svg;',
					r * 0.1675, r * 0.12, '', 'Data Box Edge', null, null, this.getTagsForStencil(gn, 'data box edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Lake_Storage_Gen1.svg;',
					r * 0.16, r * 0.13, '', 'Data Lake Storage Gen1', null, null, this.getTagsForStencil(gn, 'data lake storage gen1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Share_Invitations.svg;',
					r * 0.16, r * 0.1075, '', 'Data Share Invitations', null, null, this.getTagsForStencil(gn, 'data share invitations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Shares.svg;',
					r * 0.16, r * 0.1375, '', 'Data Shares', null, null, this.getTagsForStencil(gn, 'data shares', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Import_Export_Jobs.svg;',
					r * 0.16, r * 0.1675, '', 'Import Export Jobs', null, null, this.getTagsForStencil(gn, 'import export jobs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Recovery_Services_Vaults.svg;',
					r * 0.1725, r * 0.15, '', 'Recovery Services Vaults', null, null, this.getTagsForStencil(gn, 'recovery services vaults', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Accounts.svg;',
					r * 0.1625, r * 0.13, '', 'Storage Accounts', null, null, this.getTagsForStencil(gn, 'storage accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Accounts_Classic.svg;',
					r * 0.1625, r * 0.13, '', 'Storage Accounts (Classic)', null, null, this.getTagsForStencil(gn, 'storage accounts classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Sync_Services.svg;',
					r * 0.18, r * 0.15, '', 'Storage Sync Services', null, null, this.getTagsForStencil(gn, 'storage sync services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'StorSimple_Data_Managers.svg;',
					r * 0.12, r * 0.16, '', 'StorSimple Data Managers', null, null, this.getTagsForStencil(gn, 'storsimple data managers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'StorSimple_Device_Managers.svg;',
					r * 0.175, r * 0.16, '', 'StorSimple Device Managers', null, null, this.getTagsForStencil(gn, 'storsimple device managers', dt).join(' '))
		];
			
		this.addPalette('azure2Storage', 'Azure / Storage', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2WebPalette = function(gn, r, sb, s)
	{
		var dt = 'azure web ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Azure_Media_Service.svg;',
					r * 0.17, r * 0.17, '', 'Azure Media Service', null, null, this.getTagsForStencil(gn, 'media service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Notification_Hub_Namespaces.svg;',
					r * 0.1675, r * 0.14, '', 'Notification Hub Namespaces', null, null, this.getTagsForStencil(gn, 'notification hub namespaces', dt).join(' '))
		];
			
		this.addPalette('azure2Web', 'Azure / Web', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

})();
