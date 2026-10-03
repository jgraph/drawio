/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	// Adds Azure shapes
	Sidebar.prototype.addAzure2Palette = function()
	{
		var gn = 'mxgraph.azure2';
		var r = 400;
		var sb = this;
		var s = 'image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/';
		
		this.setCurrentSearchEntryLibrary('azure2', 'azure2AI Machine Learning');
		this.addAzure2AIMachineLearningPalette(gn, r, sb, s + 'ai_machine_learning/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Analytics');
		this.addAzure2AnalyticsPalette(gn, r, sb, s + 'analytics/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2App Services');
		this.addAzure2AppServicesPalette(gn, r, sb, s + 'app_services/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Azure Ecosystem');
		this.addAzure2EcosystemPalette(gn, r, sb, s + 'azure_ecosystem/');
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
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Hybrid and Multicloud');
		this.addAzure2HybridAndMulticloudPalette(gn, r, sb, s + 'hybrid_multicloud/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Identity');
		this.addAzure2IdentityPalette(gn, r, sb, s + 'identity/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Integration');
		this.addAzure2IntegrationPalette(gn, r, sb, s + 'integration/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Intune');
		this.addAzure2IntunePalette(gn, r, sb, s + 'intune/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2IoT');
		this.addAzure2IOTPalette(gn, r, sb, s + 'iot/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Management Governance');
		this.addAzure2ManagementGovernancePalette(gn, r, sb, s + 'management_governance/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Menu');
		this.addAzure2MenuPalette(gn, r, sb, s + 'menu/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Migrate');
		this.addAzure2MigratePalette(gn, r, sb, s + 'migrate/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Mixed Reality');
		this.addAzure2MixedRealityPalette(gn, r, sb, s + 'mixed_reality/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Mobile');
		this.addAzure2MobilePalette(gn, r, sb, s + 'mobile/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Monitor');
		this.addAzure2MonitorPalette(gn, r, sb, s + 'monitor/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Networking');
		this.addAzure2NetworkingPalette(gn, r, sb, s + 'networking/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Other');
		this.addAzure2OtherPalette(gn, r, sb, s + 'other/');
		this.setCurrentSearchEntryLibrary('azure2', 'azure2Power Platform');
		this.addAzure2PowerPlatformPalette(gn, r, sb, s + 'power_platform/');
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
			this.createVertexTemplateEntry(s + 'AI_Foundry.svg;points=[[0.559,0,0],[0.5,0.985,0],[0.167,0.5,0],[1,0.421,0],[0.994,0.29,0],[0.968,0.612,0],[0.008,0.987,0],[0.376,0.04,0]];',
					r * 0.1594, r * 0.17, '', 'AI Foundry', null, null, this.getTagsForStencil(gn, 'ai foundry microsoft foundry ai studio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'AI_Foundry_IQ.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.499,0],[1,0.5,0],[0.915,0.118,0],[0.882,0.915,0],[0.088,0.877,0],[0.125,0.085,0]];',
					r * 0.17, r * 0.17, '', 'AI Foundry IQ', null, null, this.getTagsForStencil(gn, 'ai foundry iq knowledge retrieval', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'AI_Studio.svg;points=[[0.594,0,0],[0.5,0.985,0],[0.18,0.5,0],[0.995,0.43,0],[0.734,0.023,0],[0.957,0.635,0],[0.011,0.992,0],[0.357,0.068,0]];',
				r * 0.16, r * 0.17, '', 'AI Studio', null, null, this.getTagsForStencil(gn, 'ai studio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Anomaly_Detector.svg;points=[[0.407,0.03,0],[0.5,0.869,0],[0,0.421,0],[0.921,0.5,0],[0.802,0.175,0],[0.995,0.945,0],[0.245,0.765,0],[0.253,0.153,0]];',
					r * 0.17, r * 0.17, '', 'Anomaly Detector', null, null, this.getTagsForStencil(gn, 'anomaly detector', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Applied_AI.svg;points=[[0.89,0,0],[0.391,1,0],[0.095,0.5,0],[0.905,0.5,0],[0.982,0,0],[0.69,0.856,0],[0.058,0.862,0],[0.153,0.432,0]];',
					r * 0.17, r * 0.13, '', 'Applied AI', null, null, this.getTagsForStencil(gn, 'applied', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Machine_Learning.svg;points=[[0.5,0,0],[0.5,0.805,0],[0,0.665,0],[1,0.665,0],[0.667,0,0],[0.832,1,0],[0.165,0.997,0],[0.333,0.003,0]];',
					r * 0.17, r * 0.1477, '', 'Azure Machine Learning', null, null, this.getTagsForStencil(gn, 'machine learning ml', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Batch_AI.svg;points=[[0.5,0,0],[0.502,1,0],[0.071,0.5,0],[0.929,0.5,0],[0.893,0.133,0],[0.666,0.935,0],[0.337,0.937,0],[0.096,0.14,0]];',
					r * 0.12, r * 0.17, '', 'Batch AI', null, null, this.getTagsForStencil(gn, 'batch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Bonsai.svg;points=[[0.434,0,0],[0.494,1,0],[0,0.412,0],[0.925,0.5,0],[0.782,0.134,0],[0.74,0.989,0],[0.24,0.984,0],[0.218,0.044,0]];',
					r * 0.17, r * 0.165, '', 'Bonsai', null, null, this.getTagsForStencil(gn, 'bonsai', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Bot_Services.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Bot Services', null, null, this.getTagsForStencil(gn, 'bot services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Computer_Vision.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.987,0.005,0],[0.992,0.99,0],[0.013,0.995,0],[0.013,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Computer Vision', null, null, this.getTagsForStencil(gn, 'computer vision', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/Search_Services.svg;points=[[0.512,0,0],[0.524,1,0],[0.02,0.5,0],[0.95,0.5,0],[0.69,0.077,0],[0.897,0.948,0],[0.108,0.92,0],[0.34,0.073,0]];',
					r * 0.17, r * 0.1228, '', 'Cognitive Search', null, null, this.getTagsForStencil(gn, 'cognitive search', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cognitive_Services.svg;points=[[0.514,0,0],[0.52,1,0],[0.02,0.5,0],[0.953,0.5,0],[0.682,0.068,0],[0.895,0.95,0],[0.11,0.925,0],[0.33,0.082,0]];',
					r * 0.17, r * 0.12, '', 'Cognitive Services', null, null, this.getTagsForStencil(gn, 'cognitive services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Content_Moderators.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.987,0.006,0],[0.75,1,0],[0.25,1,0],[0.013,0.006,0]];',
					r * 0.17, r * 0.157, '', 'Content Moderators', null, null, this.getTagsForStencil(gn, 'content moderators', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Custom_Vision.svg;points=[[0.491,0,0],[0.5,0.983,0],[0,0.492,0],[0.985,0.5,0],[0.837,0.14,0],[0.957,0.9,0],[0.128,0.825,0],[0.143,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Custom Vision', null, null, this.getTagsForStencil(gn, 'custom vision', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Experimentation_Studio.svg;points=[[0.401,0,0],[0.5,1,0],[0.226,0.5,0],[0.824,0.5,0],[0.855,0.314,0],[0.985,0.921,0],[0.02,1,0],[0.189,0.214,0]];',
					r * 0.17, r * 0.14, '', 'Experimentation Studio', null, null, this.getTagsForStencil(gn, 'experimentation studio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Face_APIs.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.987,0.005,0],[0.992,0.99,0],[0.013,0.995,0],[0.013,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Face APIs', null, null, this.getTagsForStencil(gn, 'face apis api application programming interface', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Form_Recognizers.svg;points=[[0.5,0.003,0],[0.5,0.98,0],[0,0.49,0],[1,0.749,0],[0.854,0.323,0],[0.932,0.917,0],[0.006,0.967,0],[0.006,0.013,0]];',
					r * 0.158, r * 0.17, '', 'Form Recognizers', null, null, this.getTagsForStencil(gn, 'form recognizers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Foundry_Agent_Service.svg;points=[[0.552,0,0],[0.552,1,0],[0,0.5,0],[0.998,0.5,0],[0.975,0.21,0],[0.972,0.792,0],[0.025,0.737,0],[0.031,0.258,0]];',
					r * 0.1527, r * 0.17, '', 'Foundry Agent Service', null, null, this.getTagsForStencil(gn, 'foundry agent service agents', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Foundry_Application.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.499,0],[1,0.501,0],[0.905,0.073,0],[0.922,0.91,0],[0.073,0.905,0],[0.088,0.08,0]];',
					r * 0.1699, r * 0.17, '', 'Foundry Application', null, null, this.getTagsForStencil(gn, 'foundry application', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Foundry_Control_Plane.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.497,0],[1,0.499,0],[0.846,0.154,0],[0.846,0.846,0],[0.154,0.846,0],[0.154,0.154,0]];',
					r * 0.17, r * 0.1698, '', 'Foundry Control Plane', null, null, this.getTagsForStencil(gn, 'foundry control plane', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Foundry_Labs.svg;points=[[0.464,0,0],[0.391,1,0],[0.064,0.5,0],[0.988,0.5,0],[0.978,0.31,0],[0.935,0.762,0],[0.033,0.78,0],[0.062,0.17,0]];',
					r * 0.1587, r * 0.17, '', 'Foundry Labs', null, null, this.getTagsForStencil(gn, 'foundry labs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Foundry_Local.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.78,0.058,0],[1,0.992,0],[0.003,0.615,0],[0.005,0.008,0]];',
					r * 0.166, r * 0.17, '', 'Foundry Local', null, null, this.getTagsForStencil(gn, 'foundry local', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Foundry_Models.svg;points=[[0.5,0.043,0],[0.5,0.779,0],[0.105,0.5,0],[1,0.5,0],[0.972,0.418,0],[0.867,0.745,0],[0.138,0.972,0],[0.121,0.033,0]];',
					r * 0.1696, r * 0.17, '', 'Foundry Models', null, null, this.getTagsForStencil(gn, 'foundry models', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Foundry_Project.svg;points=[[0.5,0.083,0],[0.5,1,0],[0,0.5,0],[1,0.555,0],[0.992,0.114,0],[0.99,0.996,0],[0.01,0.996,0],[0.01,0.004,0]];',
					r * 0.17, r * 0.139, '', 'Foundry Project', null, null, this.getTagsForStencil(gn, 'foundry project', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'FRD_QA.svg;points=[[0.5,0,0],[0.5,0.851,0],[0,0.424,0],[0.724,0.5,0],[0.692,0.035,0],[0.994,0.985,0],[0.028,0.812,0],[0.028,0.038,0]];',
					r * 0.1545, r * 0.17, '', 'FRD QA', null, null, this.getTagsForStencil(gn, 'frd qa', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Genomics.svg;points=[[0.5,0.061,0],[0.5,0.935,0],[0.036,0.5,0],[0.96,0.5,0],[0.985,0.025,0],[0.98,0.977,0],[0.02,0.98,0],[0.02,0.023,0]];',
					r * 0.09, r * 0.17, '', 'Genomics', null, null, this.getTagsForStencil(gn, 'genomics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Immersive_Readers.svg;points=[[0.5,0.036,0],[0.785,0.973,0],[0,0.485,0],[0.93,0.5,0],[0.825,0.028,0],[0.952,0.895,0],[0.005,0.825,0],[0.103,0.028,0]];',
					r * 0.17, r * 0.17, '', 'Immersive Readers', null, null, this.getTagsForStencil(gn, 'immersive readers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Language_Services.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.99,0,0],[0.997,0.992,0],[0.005,0.995,0],[0.01,0,0]];',
					r * 0.17, r * 0.17, '', 'Language', null, null, this.getTagsForStencil(gn, 'language services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cognitive_Services_Decisions.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.995,0.005,0],[0.997,0.992,0],[0.005,0.995,0],[0.008,0.003,0]];',
					r * 0.17, r * 0.17, '', 'Cognitive Services Decisions', null, null, this.getTagsForStencil(gn, 'cognitive services decisions', dt).join(' ')),

			this.createVertexTemplateEntry(s + 'Content_Safety.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.995,0.005,0],[0.997,0.992,0],[0.005,0.995,0],[0.008,0.003,0]];',
				r * 0.17, r * 0.17, '', 'Content Safety', null, null, this.getTagsForStencil(gn, 'content safety', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Language_Understanding.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
				r * 0.17, r * 0.17, '', 'Language Understanding', null, null, this.getTagsForStencil(gn, 'language understanding', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Machine_Learning.svg;points=[[0.5,0,0],[0.5,1,0],[0.005,0.761,0],[0.995,0.761,0],[0.633,0,0],[0.928,1,0],[0.072,1,0],[0.367,0,0]];',
					r * 0.16, r * 0.17, '', 'Machine Learning', null, null, this.getTagsForStencil(gn, '', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Machine_Learning_Studio_Classic_Web_Services.svg;points=[[0.5,0.025,0],[0.5,1,0],[0.209,0.5,0],[0.973,0.5,0],[0.9,0.113,0],[0.625,0.992,0],[0.005,0.99,0],[0.39,0.088,0]];',
					r * 0.17, r * 0.17, '', 'Machine Learning Studio - Classic Web Services', null, null, this.getTagsForStencil(gn, 'studio classic web services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Machine_Learning_Studio_Web_Service_Plans.svg;points=[[0.549,0.003,0],[0.5,0.998,0],[0.096,0.5,0],[1,0.48,0],[0.842,0.108,0],[0.62,0.987,0],[0.008,0.992,0],[0.253,0.11,0]];',
					r * 0.17, r * 0.17, '', 'Machine Learning Studio - Web Service Plans', null, null, this.getTagsForStencil(gn, 'studio web service plans', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Machine_Learning_Studio_Workspaces.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0.204,0.5,0],[1,0.5,0],[0.995,0.013,0],[0.615,0.99,0],[0.005,0.985,0],[0.303,0.013,0]];',
					r * 0.17, r * 0.17, '', 'Machine Learning Studio - Workspaces', null, null, this.getTagsForStencil(gn, 'studio workspaces', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/compute/Metrics_Advisor.svg;points=[[0.449,0,0],[0.5,0.755,0],[0,0.5,0],[0.985,0.5,0],[0.897,0.015,0],[0.996,0.882,0],[0.004,0.74,0],[0.004,0.013,0]];',
					r * 0.137, r * 0.17, '', 'Metrics Advisor', null, null, this.getTagsForStencil(gn, 'metrics advisor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Object_Understanding.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.987,0.005,0],[0.992,0.99,0],[0.013,0.995,0],[0.013,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Object Understanding', null, null, this.getTagsForStencil(gn, 'object understanding', dt).join(' ')),

			this.createVertexTemplateEntry(s + 'Azure_OpenAI.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.957,0.043,0],[0.962,0.952,0],[0.043,0.957,0],[0.05,0.035,0]];',
				r * 0.17, r * 0.17, '', 'OpenAI', null, null, this.getTagsForStencil(gn, 'openai open ai', dt).join(' ')),
	
			this.createVertexTemplateEntry(s + 'Personalizers.svg;points=[[0.395,0,0],[0.575,1,0],[0,0.486,0],[0.911,0.5,0],[0.655,0.114,0],[0.982,0.926,0],[0.14,0.861,0],[0.05,0.074,0]];',
					r * 0.17, r * 0.138, '', 'Personalizers', null, null, this.getTagsForStencil(gn, 'personalizers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Planetary_Computer_Pro.svg;points=[[0.5,0.059,0],[0.5,0.965,0],[0.076,0.5,0],[0.951,0.5,0],[0.967,0.018,0],[0.842,0.81,0],[0.015,0.967,0],[0.235,0.168,0]];',
					r * 0.17, r * 0.1699, '', 'Planetary Computer Pro', null, null, this.getTagsForStencil(gn, 'planetary computer pro geospatial', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'QnA_Makers.svg;points=[[0.5,0,0],[0.596,1,0],[0.018,0.5,0],[0.99,0.5,0],[0.63,0.008,0],[0.98,0.897,0],[0.365,0.895,0],[0.025,0.005,0]];',
					r * 0.17, r * 0.17, '', 'QnA Makers', null, null, this.getTagsForStencil(gn, 'qna makers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Serverless_Search.svg;points=[[0.516,0,0],[0.623,1,0],[0,0.455,0],[1,0.501,0],[0.712,0.073,0],[0.695,0.932,0],[0.088,0.655,0],[0.093,0.255,0]];',
				r * 0.17, r * 0.17, '', 'Serverless Search', null, null, this.getTagsForStencil(gn, 'serverless search', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Speech_Services.svg;points=[[0.5,0,0],[0.606,1,0],[0.005,0.5,0],[1,0.5,0],[0.62,0.008,0],[0.995,0.892,0],[0.378,0.895,0],[0.015,0.005,0]];',
				r * 0.17, r * 0.17, '', 'Speech Services', null, null, this.getTagsForStencil(gn, 'speech services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Translator_Text.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.995,0.013,0],[0.997,0.985,0],[0.013,0.995,0],[0.013,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Translator Text', null, null, this.getTagsForStencil(gn, 'translator text', dt).join(' '))
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
			this.createVertexTemplateEntry(s + 'Analysis_Services.svg;points=[[0.204,0,0],[0.281,1,0],[0,0.205,0],[1,0.441,0],[0.995,0.24,0],[0.995,0.642,0],[0.085,0.993,0],[0.005,0.004,0]];',
					r * 0.1575, r * 0.12, '', 'Analysis Services', null, null, this.getTagsForStencil(gn, 'analysis services', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/databases/Azure_Data_Explorer_Clusters.svg;points=[[0.522,0,0],[0.5,0.851,0],[0.141,0.5,0],[1,0.477,0],[0.995,0.013,0],[0.997,0.937,0],[0.013,0.957,0],[0.06,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Data Explorer Clusters', null, null, this.getTagsForStencil(gn, 'data explorer clusters', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/databases/Data_Factory.svg;points=[[0.25,0,0],[0.5,1,0],[0,0.529,0],[1,0.5,0],[0.995,0.348,0],[0.997,0.985,0],[0.013,0.995,0],[0.013,0.058,0]];',
					r * 0.17, r * 0.17, '', 'Data Factories', null, null, this.getTagsForStencil(gn, 'data factories', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Lake_Analytics.svg;points=[[0.5,0.062,0],[0.5,0.94,0],[0.06,0.5,0],[0.938,0.5,0],[0.865,0.118,0],[0.88,0.87,0],[0.123,0.877,0],[0.125,0.123,0]];',
					r * 0.17, r * 0.17, '', 'Data Lake Analytics', null, null, this.getTagsForStencil(gn, 'data lake analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Lake_Store_Gen1.svg;points=[[0.5,0.083,0],[0.5,1,0],[0.003,0.498,0],[0.998,0.554,0],[0.99,0.114,0],[0.987,0.996,0],[0.013,0.996,0],[0.013,0.004,0]];',
					r * 0.16, r * 0.13, '', 'Data Lake Store Gen1', null, null, this.getTagsForStencil(gn, 'data lake store gen1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Databricks.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.501,0],[0.886,0.5,0],[1,0.263,0],[1,0.742,0],[0,0.742,0],[0,0.26,0]];',
					r * 0.157, r * 0.17, '', 'Databricks', null, null, this.getTagsForStencil(gn, 'azure databricks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Endpoint_Analytics.svg;points=[[0.465,0.003,0],[0.5,0.665,0],[0,0.5,0],[1,0.576,0],[0.922,0.013,0],[0.832,0.985,0],[0.005,0.655,0],[0.015,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Endpoint Analytics', null, null, this.getTagsForStencil(gn, 'endpoint analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Hub_Clusters.svg;points=[[0.5,0.006,0],[0.5,0.997,0],[0.001,0.5,0],[0.999,0.5,0],[0.744,0.251,0],[0.992,0.996,0],[0.254,0.792,0],[0.013,0,0]];',
					r * 0.16, r * 0.13, '', 'Event Hub Clusters', null, null, this.getTagsForStencil(gn, 'event hub clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Hubs.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.985,0.994,0],[0.015,0.994,0],[0.015,0.006,0]];',
					r * 0.1675, r * 0.15, '', 'Event Hubs', null, null, this.getTagsForStencil(gn, 'event hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'HD_Insight_Clusters.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.393,0],[1,0.397,0],[0.847,0.117,0],[0.897,0.786,0],[0.1,0.786,0],[0.158,0.115,0]];',
					r * 0.1575, r * 0.155, '', 'HD Insight Clusters', null, null, this.getTagsForStencil(gn, 'hd insight clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Log_Analytics_Workspaces.svg;points=[[0.5,0.03,0],[0.5,1,0],[0,0.5,0],[0.97,0.5,0],[0.88,0.083,0],[0.005,0.985,0]];',
					r * 0.16, r * 0.16, '', 'Log Analytics Workspaces', null, null, this.getTagsForStencil(gn, 'log analytics workspaces', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Power_BI_Embedded.svg;points=[[0.777,0,0],[0.5,1,0],[0.038,0.5,0],[1,0.5,0],[0.993,0.018,0],[0.993,0.982,0],[0.007,0.982,0]];',
					r * 0.1275, r * 0.17, '', 'Power BI Embedded', null, null, this.getTagsForStencil(gn, 'power bi embedded', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Power_Platform.svg;points=[[0.61,0,0],[0.086,0.5,0],[1,0.164,0],[0.966,0.063,0],[0.814,0.552,0],[0.147,0.987,0],[0.343,0.013,0]];',
					r * 0.1623, r * 0.17, '', 'Power Platform', null, null, this.getTagsForStencil(gn, 'power platform', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/networking/Private_Link_Hub.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0,0.499,0],[1,0.5,0],[1,0.25,0],[1,0.75,0],[0,0.747,0],[0,0.25,0]];',
					r * 0.147, r * 0.17, '', 'Private Link Services', null, null, this.getTagsForStencil(gn, 'private link services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Stream_Analytics_Jobs.svg;points=[[0.576,0,0],[0.581,1,0],[0.069,0.5,0],[1,0.488,0],[0.852,0.085,0],[0.857,0.891,0],[0.03,0.651,0],[0.29,0.1,0]];',
					r * 0.17, r * 0.145, '', 'Stream Analytics Jobs', null, null, this.getTagsForStencil(gn, 'Stream_Analytics_Jobs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Synapse_Analytics.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.497,0],[1,0.5,0],[1,0.248,0],[1,0.752,0],[0,0.747,0],[0,0.248,0]];',
					r * 0.15, r * 0.1725, '', 'Synapse Analytics', null, null, this.getTagsForStencil(gn, 'synapse analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Workbooks.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.962,0.015,0],[0.975,0.975,0],[0.025,0.975,0],[0.038,0.015,0]];',
					r * 0.17, r * 0.17, '', 'Workbooks', null, null, this.getTagsForStencil(gn, 'workbooks', dt).join(' '))
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
			this.createVertexTemplateEntry(s + 'API_Management_Services.svg;points=[[0.512,0,0],[0.477,1,0],[0,0.496,0],[1,0.541,0],[0.717,0.084,0],[0.92,0.729,0],[0.09,0.712,0],[0.085,0.285,0]];',
					r * 0.1625, r * 0.15, '', 'API Management Services', null, null, this.getTagsForStencil(gn, 'api application programming interface management services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Service_Certificates.svg;points=[[0.5,0,0],[0.5,0.774,0],[0,0.387,0],[1,0.388,0],[0.987,0.006,0],[0.985,0.77,0],[0.093,0.997,0],[0.013,0.006,0]];',
					r * 0.175, r * 0.16, '', 'App Service Certificates', null, null, this.getTagsForStencil(gn, 'app service certificates', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Service_Domains.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'App Service Domains', null, null, this.getTagsForStencil(gn, 'app service domains', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Service_Environments.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.98,0.018,0],[0.985,0.977,0],[0.015,0.977,0],[0.02,0.018,0]];',
					r * 0.16, r * 0.16, '', 'App Service Environments', null, null, this.getTagsForStencil(gn, 'app service environments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Service_Plans.svg;points=[[0.5,0,0],[0.43,1,0],[0.005,0.5,0],[0.787,0.5,0],[0.582,0.008,0],[0.942,0.947,0],[0.013,0.99,0],[0.02,0.003,0]];',
					r * 0.16, r * 0.16, '', 'App Service Plans', null, null, this.getTagsForStencil(gn, 'app service plans', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Services.svg;points=[[0.497,0,0],[0.504,1,0],[0,0.499,0],[1,0.5,0],[0.865,0.153,0],[0.875,0.835,0],[0.125,0.835,0],[0.133,0.155,0]];',
					r * 0.16, r * 0.16, '', 'App Services', null, null, this.getTagsForStencil(gn, 'app services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CDN_Profiles.svg;points=[[0.611,0.004,0],[0.62,0.996,0],[0,0.638,0],[0.963,0.5,0],[0.735,0.06,0],[0.907,0.957,0],[0.105,0.914,0],[0.108,0.358,0]];',
					r * 0.17, r * 0.10, '', 'CDN Profiles', null, null, this.getTagsForStencil(gn, 'cdn profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Notification_Hubs.svg;points=[[0.5,0,0],[0.675,1,0],[0,0.424,0],[1,0.424,0],[0.992,0.012,0],[0.992,0.835,0],[0.015,0.844,0],[0.008,0.012,0]];',
					r * 0.1675, r * 0.14, '', 'Notification Hubs', null, null, this.getTagsForStencil(gn, 'notification hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Search_Services.svg;points=[[0.512,0,0],[0.524,1,0],[0.02,0.5,0],[0.95,0.5,0],[0.69,0.077,0],[0.897,0.948,0],[0.108,0.92,0],[0.34,0.073,0]];',
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

	Sidebar.prototype.addAzure2EcosystemPalette = function(gn, r, sb, s)
	{
		var dt = 'azure ecosystem ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Applens.svg;points=[[0.501,0,0],[0.502,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.867,0.842,0],[0.128,0.837,0],[0.185,0.11,0]];',
					r * 0.17, r * 0.17, '', 'Applens', null, null, this.getTagsForStencil(gn, 'applens', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Collaborative_Service.svg;points=[[0.507,0,0],[0.657,1,0],[0,0.457,0],[0.938,0.5,0],[0.842,0.123,0],[0.925,0.824,0],[0.11,0.824,0],[0.06,0.329,0]];',
					r * 0.17, r * 0.167, '', 'Collaborative Service', null, null, this.getTagsForStencil(gn, 'collaborative service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Hybrid_Center.svg;points=[[0.514,0,0],[0.5,1,0],[0.018,0.5,0],[0.95,0.5,0],[0.682,0.068,0],[0.902,0.939,0],[0.118,0.939,0],[0.345,0.068,0]];',
					r * 0.17, r * 0.12, '', 'Hybrid Center', null, null, this.getTagsForStencil(gn, 'hybrid center', dt).join(' '))
		];
			
		this.addPalette('azure2Azure Ecosystem', 'Azure / Ecosystem', false, mxUtils.bind(this, function(content)
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
			this.createVertexTemplateEntry(s + 'Capacity.svg;points=[[0.5,0,0],[0.5,0.995,0],[0,0.497,0],[0.799,0.5,0],[0.625,0.013,0],[0.986,0.93,0],[0.008,0.985,0],[0.008,0.01,0]];',
					r * 0.1575, r * 0.17, '', 'Capacity', null, null, this.getTagsForStencil(gn, 'capacity', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Infrastructure_Backup.svg;points=[[0.5,0.003,0],[0.5,0.988,0],[0,0.496,0],[1,0.57,0],[0.781,0.115,0],[0.991,0.95,0],[0.003,0.972,0],[0.003,0.018,0]];',
					r * 0.15, r * 0.1725, '', 'Infrastructure Backup', null, null, this.getTagsForStencil(gn, 'infrastructure backup', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Multi_Tenancy.svg;points=[[0.349,0,0],[0.754,1,0],[0.066,0.5,0],[0.914,0.5,0],[0.797,0.165,0],[1,0.895,0],[0.023,0.788,0],[0.22,0.05,0]];',
					r * 0.17, r * 0.1625, '', 'Multi Tenancy', null, null, this.getTagsForStencil(gn, 'multi tenancy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Offers.svg;points=[[0.5,0.079,0],[0.398,1,0],[0.001,0.588,0],[0.905,0.5,0],[0.922,0.078,0],[0.705,0.705,0],[0.192,0.808,0],[0.29,0.29,0]];',
					r * 0.1625, r * 0.16, '', 'Offers', null, null, this.getTagsForStencil(gn, 'offers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Plans.svg;points=[[0.5,0.003,0],[0.5,0.998,0],[0,0.5,0],[1,0.5,0],[0.984,0.32,0],[0.993,0.985,0],[0.007,0.985,0],[0.01,0.013,0]];',
					r * 0.13, r * 0.16, '', 'Plans', null, null, this.getTagsForStencil(gn, 'plans', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Stack.svg;points=[[0.5,0,0],[0.539,1,0],[0.108,0.5,0],[1,0.497,0],[0.992,0.01,0],[0.997,0.977,0],[0.047,0.78,0],[0.402,0.018,0]];',
					r * 0.155, r * 0.16, '', 'Stack', null, null, this.getTagsForStencil(gn, 'azure stack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Updates.svg;points=[[0.535,0,0],[0.723,1,0],[0,0.555,0],[1,0.641,0],[0.75,0.005,0],[0.817,0.997,0],[0.043,0.657,0],[0.32,0.005,0]];',
					r * 0.17, r * 0.1675, '', 'Updates', null, null, this.getTagsForStencil(gn, 'updates', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'User_Subscriptions.svg;points=[[0.436,0,0],[0.5,0.985,0],[0.204,0.5,0],[0.998,0.599,0],[0.602,0.065,0],[0.827,0.997,0],[0.028,0.966,0],[0.265,0.07,0]];',
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
			this.createVertexTemplateEntry(s + 'AVS.svg;points=[[0.511,0,0],[0.502,1,0],[0,0.559,0],[1,0.611,0],[0.695,0.072,0],[0.835,0.993,0],[0.175,0.996,0],[0.32,0.085,0]];',
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
			this.createVertexTemplateEntry(s + 'ABS_Member.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[1,0.25,0],[1,0.75,0],[0,0.75,0],[0,0.25,0]];',
					r * 0.14, r * 0.1625, '', 'ABS Member', null, null, this.getTagsForStencil(gn, 'abs member', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Blockchain_Applications.svg;points=[[0.5,0,0],[0.495,1,0],[0,0.416,0],[1,0.416,0],[0.999,0.208,0],[0.761,0.992,0],[0.222,0.987,0],[0.001,0.208,0]];',
					r * 0.121, r * 0.17, '', 'Blockchain Applications', null, null, this.getTagsForStencil(gn, 'blockchain applications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Blockchain_Service.svg;points=[[0.511,0.005,0],[0.5,0.896,0],[0,0.739,0],[1,0.739,0],[0.727,0.13,0],[1,0.867,0],[0,0.867,0],[0.293,0.13,0]];',
					r * 0.17, r * 0.17, '', 'Blockchain Service', null, null, this.getTagsForStencil(gn, 'blockchain service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Consortium.svg;points=[[0.494,0,0],[0.511,1,0],[0.003,0.506,0],[0.998,0.496,0],[0.997,0.388,0],[0.997,0.605,0],[0.003,0.612,0],[0.005,0.398,0]];',
					r * 0.17, r * 0.17, '', 'Consortium', null, null, this.getTagsForStencil(gn, 'consortium', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Outbound_Connection.svg;points=[[0.501,0,0],[0.5,0.876,0],[0.08,0.5,0],[1,0.834,0],[0.812,0.2,0],[0.85,1,0],[0.07,0.831,0],[0.19,0.2,0]];',
					r * 0.1775, r * 0.16, '', 'Outbound Connection', null, null, this.getTagsForStencil(gn, 'outbound connection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Token_Service.svg;points=[[0.388,0,0],[0.5,0.905,0],[0,0.395,0],[0.779,0.5,0],[0.778,0.198,0],[0.982,0.942,0],[0,0.592,0],[0,0.198,0]];',
					r * 0.1475, r * 0.17, '', 'Token Service', null, null, this.getTagsForStencil(gn, 'token service', dt).join(' '))
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
			this.createVertexTemplateEntry(s + 'App_Services.svg;points=[[0.497,0,0],[0.504,1,0],[0,0.499,0],[1,0.5,0],[0.865,0.153,0],[0.875,0.835,0],[0.125,0.835,0],[0.133,0.155,0]];',
					r * 0.16, r * 0.16, '', 'App Services', null, null, this.getTagsForStencil(gn, 'app services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Application_Group.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.837,0.128,0],[0.87,0.84,0],[0.133,0.842,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Application Group', null, null, this.getTagsForStencil(gn, 'application group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Automanaged_VM.svg;points=[[0.5,0,0],[0.5,1,0],[0.005,0.5,0],[0.995,0.5,0],[0.982,0.006,0],[0.747,1,0],[0.253,1,0],[0.018,0.006,0]];',
					r * 0.17, r * 0.155, '', 'Automanaged VM', null, null, this.getTagsForStencil(gn, 'automanaged vm virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Availability_Sets.svg;points=[[0.5,0,0],[0.5,0.999,0],[0,0.5,0],[1,0.5,0],[1,0,0],[1,1,0],[0,1,0],[0,0,0]];',
					r * 0.17, r * 0.17, '', 'Availability Sets', null, null, this.getTagsForStencil(gn, 'availability sets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Linux.svg;points=[[0.538,0,0],[0.435,1,0],[0.174,0.5,0],[1,0.791,0],[0.864,0.075,0],[0.915,0.977,0],[0,1,0],[0.338,0.088,0]];',
					r * 0.1661, r * 0.17, '', 'Azure Linux', null, null, this.getTagsForStencil(gn, 'linux', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Batch_Accounts.svg;points=[[0.5,0,0],[0.5,0.928,0],[0.001,0.5,0],[0.905,0.5,0],[0.725,0.006,0],[0.987,0.997,0],[0.015,0.006,0]];',
					r * 0.17, r * 0.16, '', 'Batch Accounts', null, null, this.getTagsForStencil(gn, 'batch accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cloud_Services_Classic.svg;points=[[0.512,0,0],[0.521,1,0],[0.02,0.5,0],[0.95,0.5,0],[0.697,0.084,0],[0.905,0.941,0],[0.108,0.923,0],[0.34,0.073,0]];',
					r * 0.18, r * 0.13, '', 'Cloud Services (Classic)', null, null, this.getTagsForStencil(gn, 'cloud services classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Compute_Galleries.svg;points=[[0.5,0.104,0],[0.5,0.911,0],[0.094,0.5,0],[0.894,0.5,0],[0.877,0.118,0],[0.88,0.895,0],[0.105,0.89,0],[0.115,0.113,0]];',
					r * 0.17, r * 0.17, '', 'Compute Galleries', null, null, this.getTagsForStencil(gn, 'compute galleries', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Container_Instances.svg;points=[[0.516,0,0],[0.501,1,0],[0,0.417,0],[1,0.458,0],[0.742,0.095,0],[0.795,0.895,0],[0.229,0.945,0],[0.059,0.268,0]];',
					r * 0.16, r * 0.17, '', 'Container Instances', null, null, this.getTagsForStencil(gn, 'container instances', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Container_Services_Deprecated.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.494,0],[1,0.493,0],[0.822,0.066,0],[0.817,0.929,0],[0.158,0.957,0],[0.163,0.034,0]];',
					r * 0.17, r * 0.15, '', 'Container Services (deprecated)', null, null, this.getTagsForStencil(gn, 'container services deprecated', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Disk_Encryption_Sets.svg;points=[[0.5,0,0],[0.5,0.999,0],[0,0.5,0],[1,0.5,0],[1,0,0],[1,1,0],[0,1,0],[0,0,0]];',
					r * 0.17, r * 0.17, '', 'Disk Encryption Sets', null, null, this.getTagsForStencil(gn, 'disk encryption sets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Disks.svg;points=[[0.499,0.003,0],[0.494,0.997,0],[0.219,0.5,0],[0.779,0.5,0],[0.955,0.125,0],[0.95,0.88,0],[0.035,0.865,0],[0.045,0.123,0]];',
					r * 0.1425, r * 0.14, '', 'Disks', null, null, this.getTagsForStencil(gn, 'disks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Disks_Snapshots.svg;points=[[0.5,0.003,0],[0.5,0.998,0],[0,0.5,0],[1,0.5,0],[0.994,0.015,0],[0.994,0.982,0],[0.006,0.985,0],[0.006,0.015,0]];',
					r * 0.17, r * 0.1775, '', 'Disks Snapshots', null, null, this.getTagsForStencil(gn, 'disks snapshots', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Function_Apps.svg;points=[[0.5,0.003,0],[0.5,0.754,0],[0.005,0.499,0],[0.995,0.499,0],[0.752,0,0],[0.742,0.798,0],[0.278,1,0],[0.253,0.202,0]];',
					r * 0.17, r * 0.15, '', 'Function Apps', null, null, this.getTagsForStencil(gn, 'function apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Host_Groups.svg;points=[[0.436,0,0],[0.542,1,0],[0,0.5,0],[1,0.5,0],[0.994,0.095,0],[0.994,0.675,0],[0.009,0.612,0],[0.009,0.015,0]];',
					r * 0.155, r * 0.17, '', 'Host Groups', null, null, this.getTagsForStencil(gn, 'host groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Host_Pools.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Host Pools', null, null, this.getTagsForStencil(gn, 'host pools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Hosts.svg;points=[[0.5,0,0],[0.501,1,0],[0,0.5,0],[0.997,0.5,0],[0.997,0.018,0],[0.991,0.665,0],[0.006,0.665,0],[0.003,0.018,0]];',
					r * 0.143, r * 0.17, '', 'Hosts', null, null, this.getTagsForStencil(gn, 'hosts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Image_Definitions.svg;points=[[0.391,0,0],[0.391,1,0],[0.005,0.5,0],[0.995,0.706,0],[0.765,0.003,0],[0.765,0.997,0],[0.013,0.992,0],[0.013,0.008,0]];',
					r * 0.165, r * 0.16, '', 'Image Definitions', null, null, this.getTagsForStencil(gn, 'image definitions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Image_Templates.svg;points=[[0.5,0,0],[0.427,1,0],[0,0.428,0],[0.856,0.5,0],[0.997,0.043,0],[0.782,0.923,0],[0.213,1,0],[0.005,0.114,0]];',
					r * 0.17, r * 0.15, '', 'Image Templates', null, null, this.getTagsForStencil(gn, 'image templates', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Image_Versions.svg;points=[[0.5,0,0],[0.446,1,0],[0.003,0.45,0],[0.998,0.734,0],[0.685,0.008,0],[0.777,0.997,0],[0.115,0.997,0],[0.013,0.006,0]];',
					r * 0.1675, r * 0.16, '', 'Image Versions', null, null, this.getTagsForStencil(gn, 'image versions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Images.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.75,1,0],[0.25,1,0],[0.015,0.006,0]];',
					r * 0.1725, r * 0.16, '', 'Images', null, null, this.getTagsForStencil(gn, 'images', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Kubernetes_Services.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.494,0],[1,0.493,0],[0.822,0.066,0],[0.817,0.929,0],[0.158,0.957,0],[0.163,0.034,0]];',
					r * 0.17, r * 0.15, '', 'Kubernetes Services', null, null, this.getTagsForStencil(gn, 'kubernetes services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Maintenance_Configuration.svg;points=[[0.398,0,0],[0.5,0.943,0],[0.005,0.418,0],[0.974,0.5,0],[0.987,0.365,0],[0.368,0.981,0],[0.12,0.12,0]];',
					r * 0.17, r * 0.16, '', 'Maintenance Configuration', null, null, this.getTagsForStencil(gn, 'maintenance configuration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_Service_Fabric.svg;points=[[0.492,0,0],[0.695,1,0],[0.003,0.414,0],[0.998,0.414,0],[0.947,0.299,0],[0.83,0.948,0],[0.178,0.966,0],[0.053,0.299,0]];',
					r * 0.17, r * 0.165, '', 'Managed Service Fabric', null, null, this.getTagsForStencil(gn, 'managed service fabric', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Mesh_Applications.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.501,0],[1,0.5,0],[0.768,0.232,0],[0.768,0.768,0],[0.232,0.768,0],[0.232,0.232,0]];',
					r * 0.17, r * 0.17, '', 'Mesh Applications', null, null, this.getTagsForStencil(gn, 'mesh applications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Metrics_Advisor.svg;points=[[0.449,0,0],[0.5,0.755,0],[0,0.5,0],[0.985,0.5,0],[0.897,0.015,0],[0.996,0.882,0],[0.004,0.74,0],[0.004,0.013,0]];',
					r * 0.137, r * 0.17, '', 'Metrics Advisor', null, null, this.getTagsForStencil(gn, 'metrics advisor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'OS_Images_Classic.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.75,1,0],[0.25,1,0],[0.015,0.006,0]];',
					r * 0.1725, r * 0.16, '', 'OS Images (Classic)', null, null, this.getTagsForStencil(gn, 'os images classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Restore_Points.svg;points=[[0.434,0,0],[0.5,0.916,0],[0,0.476,0],[1,0.464,0],[0.85,0.123,0],[0.875,0.783,0],[0.233,1,0],[0.145,0.128,0]];',
					r * 0.17, r * 0.167, '', 'Restore Points', null, null, this.getTagsForStencil(gn, 'restore points', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Restore_Points_Collections.svg;points=[[0.5,0.015,0],[0.5,0.915,0],[0,0.474,0],[1,0.465,0],[0.865,0.116,0],[0.862,0.817,0],[0.195,0.997,0],[0.14,0.11,0]];',
					r * 0.17, r * 0.14, '', 'Restore Points Collections', null, null, this.getTagsForStencil(gn, 'restore points collections', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Scheduled_Actions.svg;points=[[0.5,0.06,0],[0.5,0.771,0],[0,0.481,0],[1,0.739,0],[0.682,0.118,0],[0.875,1,0],[0.003,0.837,0],[0.01,0.118,0]];',
					r * 0.17, r * 0.17, '', 'Scheduled Actions', null, null, this.getTagsForStencil(gn, 'scheduled actions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Fabric_Clusters.svg;points=[[0.5,0,0],[0.5,0.885,0],[0,0.411,0],[1,0.411,0],[0.95,0.296,0],[0.815,0.96,0],[0.183,0.966,0],[0.05,0.296,0]];',
					r * 0.1675, r * 0.16, '', 'Service Fabric Clusters', null, null, this.getTagsForStencil(gn, 'service fabric clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Shared_Image_Galleries.svg;points=[[0.595,0,0],[0.5,1,0],[0.12,0.5,0],[0.892,0.5,0],[0.89,0.013,0],[0.997,0.985,0],[0.013,0.995,0],[0.128,0.165,0]];',
					r * 0.16, r * 0.16, '', 'Shared Image Galleries', null, null, this.getTagsForStencil(gn, 'shared image galleries', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Spring_Cloud.svg;points=[[0.5,0.126,0],[0.5,0.794,0],[0.188,0.5,0],[0.845,0.5,0],[0.997,0.005,0],[0.997,0.995,0],[0.003,0.995,0],[0.003,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Spring Cloud', null, null, this.getTagsForStencil(gn, 'azure spring cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Stage_Maps.svg;points=[[0.743,0,0],[0.5,1,0],[0.091,0.5,0],[0.855,0.04,0],[1,1,0],[0,1,0],[0.143,0.375,0]];',
					r * 0.17, r * 0.17, '', 'Stage Maps', null, null, this.getTagsForStencil(gn, 'stage maps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Machine.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.75,1,0],[0.25,1,0],[0.015,0.006,0]];',
					r * 0.1725, r * 0.16, '', 'Virtual Machine', null, null, this.getTagsForStencil(gn, 'virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Machines_Classic.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.75,1,0],[0.25,1,0],[0.015,0.006,0]];',
					r * 0.1725, r * 0.16, '', 'Virtual Machines (Classic)', null, null, this.getTagsForStencil(gn, 'virtual machines classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'VM_Images_Classic.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.75,1,0],[0.25,1,0],[0.015,0.006,0]];',
					r * 0.1725, r * 0.16, '', 'VM Images (Classic)', null, null, this.getTagsForStencil(gn, 'vm images classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'VM_Scale_Sets.svg;points=[[0.5,0,0],[0.705,1,0],[0,0.198,0],[1,0.5,0],[0.817,0.228,0],[0.852,1,0],[0.409,0.836,0],[0.003,0.005,0]];',
					r * 0.17, r * 0.17, '', 'VM Scale Sets', null, null, this.getTagsForStencil(gn, 'vm scale sets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Workspaces2.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Workspaces', null, null, this.getTagsForStencil(gn, 'workspaces', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Workspaces.svg;points=[[0.5,0,0],[0.5,0.821,0],[0,0.41,0],[1,0.41,0],[0.992,0.009,0],[0.935,0.982,0],[0.008,0.811,0],[0.01,0.006,0]];',
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
			this.createVertexTemplateEntry(s + 'AKS_Network_Policy.svg;points=[[0.409,0,0],[0.409,1,0],[0.003,0.5,0],[1,0.517,0],[0.975,0.182,0],[0.967,0.859,0],[0.155,0.843,0],[0.015,0.155,0]];',
					r * 0.17, r * 0.1543, '', 'AKS Network Policy', null, null, this.getTagsForStencil(gn, 'aks kubernetes network policy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Services.svg;points=[[0.497,0,0],[0.504,1,0],[0,0.499,0],[1,0.5,0],[0.865,0.153,0],[0.875,0.835,0],[0.125,0.835,0],[0.133,0.155,0]];',
					r * 0.16, r * 0.16, '', 'App Services', null, null, this.getTagsForStencil(gn, 'app services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Batch_Accounts.svg;points=[[0.5,0,0],[0.5,0.928,0],[0.001,0.5,0],[0.905,0.5,0],[0.725,0.006,0],[0.987,0.997,0],[0.015,0.006,0]];',
					r * 0.17, r * 0.16, '', 'Batch Accounts', null, null, this.getTagsForStencil(gn, 'batch accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Container_Instances.svg;points=[[0.516,0.005,0],[0.503,0.995,0],[0,0.42,0],[1,0.458,0],[0.738,0.095,0],[0.797,0.887,0],[0.227,0.937,0],[0.062,0.265,0]];',
					r * 0.16, r * 0.1725, '', 'Container Instances', null, null, this.getTagsForStencil(gn, 'container instances', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Container_Registries.svg;points=[[0.499,0,0],[0.56,1,0],[0,0.481,0],[0.935,0.5,0],[0.687,0.076,0],[1,0.902,0],[0.095,0.699,0],[0.088,0.271,0]];',
					r * 0.17, r * 0.1525, '', 'Container Registries', null, null, this.getTagsForStencil(gn, 'container registries', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Container_Storage.svg;points=[[0.501,0,0],[0.501,1,0],[0,0.499,0],[1,0.499,0],[0.902,0.235,0],[0.912,0.75,0],[0.1,0.762,0],[0.11,0.228,0]];',
					r * 0.17, r * 0.17, '', 'Container Storage', null, null, this.getTagsForStencil(gn, 'container storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Kubernetes_Hub.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.937,0.04,0],[0.957,0.94,0],[0.04,0.937,0],[0.06,0.043,0]];',
					r * 0.1699, r * 0.17, '', 'Kubernetes Hub', null, null, this.getTagsForStencil(gn, 'kubernetes hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Kubernetes_Services.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.494,0],[1,0.493,0],[0.822,0.066,0],[0.817,0.929,0],[0.158,0.957,0],[0.163,0.034,0]];',
					r * 0.17, r * 0.15, '', 'Kubernetes Services', null, null, this.getTagsForStencil(gn, 'kubernetes services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Fabric_Clusters.svg;points=[[0.5,0,0],[0.5,0.885,0],[0,0.411,0],[1,0.411,0],[0.95,0.296,0],[0.815,0.96,0],[0.183,0.966,0],[0.05,0.296,0]];',
					r * 0.1675, r * 0.16, '', 'Service Fabric Clusters', null, null, this.getTagsForStencil(gn, 'service fabric clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Red_Hat_OpenShift.svg;points=[[0.52,0.04,0],[0.522,0.96,0],[0.062,0.5,0],[0.981,0.5,0],[0.965,0.21,0],[0.862,0.81,0],[0.07,0.795,0],[0.215,0.155,0]];',
					r * 0.17, r * 0.17, '', 'Red Hat OpenShift', null, null, this.getTagsForStencil(gn, 'azure red hat openshift', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Groups.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.501,0],[1,0.5,0],[0.997,0.111,0],[0.995,0.889,0],[0,0.886,0],[0.003,0.111,0]];',
					r * 0.17, r * 0.1605, '', 'Service Groups', null, null, this.getTagsForStencil(gn, 'service groups', dt).join(' '))
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
			this.createVertexTemplateEntry(s + 'Elixir.svg;points=[[0.682,0.003,0],[0.488,0.998,0],[0.041,0.5,0],[0.928,0.5,0],[0.989,0.103,0],[0.892,0.85,0],[0.091,0.852,0],[0.341,0.323,0]];',
					r * 0.1225, r * 0.17, '', 'Elixir', null, null, this.getTagsForStencil(gn, 'elixir', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Elixir_Purple.svg;points=[[0.682,0.003,0],[0.488,0.998,0],[0.041,0.5,0],[0.928,0.5,0],[0.989,0.103,0],[0.892,0.85,0],[0.091,0.852,0],[0.341,0.323,0]];',
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
			this.createVertexTemplateEntry(s + 'Azure_DocumentDB.svg;points=[[0.5,0,0],[0.497,1,0],[0,0.499,0],[1,0.5,0],[0.983,0.098,0],[0.98,0.905,0],[0.024,0.907,0],[0.017,0.098,0]];',
					r * 0.1282, r * 0.17, '', 'Azure DocumentDB', null, null, this.getTagsForStencil(gn, 'documentdb document db', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Managed_Redis.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.872,0.115,0],[0.885,0.872,0],[0.113,0.87,0],[0.128,0.115,0]];',
					r * 0.17, r * 0.17, '', 'Azure Managed Redis', null, null, this.getTagsForStencil(gn, 'redis cache', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cache_Redis.svg;points=[[0.5,0,0],[0.502,1,0],[0,0.5,0],[1,0.5,0],[0.982,0.056,0],[0.715,0.947,0],[0.275,0.938,0],[0.02,0.053,0]];',
					r * 0.16, r * 0.13, '', 'Cache Redis', null, null, this.getTagsForStencil(gn, 'cache redis', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Cosmos_DB.svg;points=[[0.144,0.003,0],[0.889,0.998,0],[0.09,0.5,0],[0.879,0.5,0],[0.967,0.175,0],[1,0.892,0],[0.023,0.78,0],[0.008,0.133,0]];',
					r * 0.16, r * 0.16, '', 'Cosmos DB', null, null, this.getTagsForStencil(gn, 'cosmos', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Data_Explorer_Clusters.svg;points=[[0.522,0,0],[0.5,0.851,0],[0.141,0.5,0],[1,0.477,0],[0.995,0.013,0],[0.997,0.937,0],[0.013,0.957,0],[0.06,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Data Explorer Clusters', null, null, this.getTagsForStencil(gn, 'data explorer clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Factory.svg;points=[[0.25,0,0],[0.5,1,0],[0,0.529,0],[1,0.5,0],[0.995,0.348,0],[0.997,0.985,0],[0.013,0.995,0],[0.013,0.058,0]];',
					r * 0.17, r * 0.17, '', 'Data Factory', null, null, this.getTagsForStencil(gn, 'data factory', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Database_MariaDB_Server.svg;points=[[0.5,0.003,0],[0.502,0.998,0],[0,0.499,0],[1,0.499,0],[0.976,0.093,0],[0.983,0.9,0],[0.017,0.9,0],[0.014,0.103,0]];',
					r * 0.12, r * 0.16, '', 'Database MariaDB Server', null, null, this.getTagsForStencil(gn, 'mariadb server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Database_Migration_Services.svg;points=[[0.515,0,0],[0.507,1,0],[0,0.415,0],[1,0.453,0],[0.738,0.09,0],[0.762,0.94,0],[0.243,0.94,0],[0.062,0.26,0]];',
					r * 0.16, r * 0.1725, '', 'Database Migration Services', null, null, this.getTagsForStencil(gn, 'migration services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Database_MySQL_Server.svg;points=[[0.5,0.003,0],[0.502,0.998,0],[0,0.499,0],[1,0.499,0],[0.976,0.093,0],[0.983,0.9,0],[0.017,0.9,0],[0.014,0.103,0]];',
					r * 0.12, r * 0.16, '', 'Database MySQL Server', null, null, this.getTagsForStencil(gn, 'mysql my sql server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Database_PostgreSQL_Server.svg;points=[[0.5,0.003,0],[0.502,0.998,0],[0,0.499,0],[1,0.499,0],[0.976,0.093,0],[0.983,0.9,0],[0.017,0.9,0],[0.014,0.103,0]];',
					r * 0.12, r * 0.16, '', 'Database PostgreSQL Server', null, null, this.getTagsForStencil(gn, 'postgresql sql server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Database_PostgreSQL_Server_Group.svg;points=[[0.436,0,0],[0.5,1,0],[0.006,0.501,0],[0.994,0.796,0],[0.844,0.093,0],[0.934,0.922,0],[0.02,0.9,0],[0.032,0.088,0]];',
					r * 0.15, r * 0.17, '', 'Database PostgreSQL Server Group', null, null, this.getTagsForStencil(gn, 'postgresql sql server group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Elastic_Job_Agents.svg;points=[[0.499,0.003,0],[0.499,0.998,0],[0,0.751,0],[0.879,0.5,0],[0.922,0.1,0],[0.995,0.865,0],[0.003,0.865,0],[0.153,0.083,0]];',
					r * 0.16, r * 0.16, '', 'Elastic Job Agents', null, null, this.getTagsForStencil(gn, 'elastic job agents', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Instance_Pools.svg;points=[[0.524,0,0],[0.579,1,0],[0,0.617,0],[1,0.803,0],[0.8,0.005,0],[0.93,0.954,0],[0.015,0.992,0],[0.248,0.005,0]];',
					r * 0.1625, r * 0.16, '', 'Instance Pools', null, null, this.getTagsForStencil(gn, 'instance pools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_Database.svg;points=[[0.5,0.011,0],[0.5,1,0],[0.001,0.5,0],[1,0.842,0],[0.675,0.078,0],[0.95,0.96,0],[0.033,0.909,0],[0.028,0.08,0]];',
					r * 0.17, r * 0.16, '', 'Managed Database', null, null, this.getTagsForStencil(gn, 'managed', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Oracle_Database.svg;points=[[0.5,0.12,0],[0.5,0.995,0],[0,0.282,0],[1,0.5,0],[0.977,0.313,0],[0.995,0.945,0],[0.325,0.947,0],[0.065,0.153,0]];',
				r * 0.17, r * 0.17, '', 'Oracle Database', null, null, this.getTagsForStencil(gn, 'oracle database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Purview_Accounts.svg;points=[[0.5,0,0],[0.507,1,0],[0.005,0.5,0],[0.995,0.5,0],[0.797,0.171,0],[0.765,0.866,0],[0.253,0.886,0],[0.255,0.114,0]];',
				r * 0.17, r * 0.105, '', 'Purview Accounts', null, null, this.getTagsForStencil(gn, 'azure purview accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_SQL.svg;points=[[0.512,0,0],[0.516,1,0],[0.02,0.5,0],[0.95,0.5,0],[0.687,0.073,0],[0.892,0.947,0],[0.115,0.93,0],[0.343,0.07,0]];',
					r * 0.16, r * 0.115, '', 'SQL', null, null, this.getTagsForStencil(gn, 'sql', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Data_Warehouses.svg;points=[[0.402,0,0],[0.5,0.935,0],[0.072,0.5,0],[0.997,0.5,0],[0.802,0.228,0],[0.989,0.945,0],[0.074,0.712,0],[0,0.228,0]];',
					r * 0.16, r * 0.1625, '', 'SQL Data Warehouses', null, null, this.getTagsForStencil(gn, 'sql data warehouses', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Database.svg;points=[[0.5,0.003,0],[0.502,0.998,0],[0,0.499,0],[1,0.499,0],[0.976,0.093,0],[0.983,0.9,0],[0.017,0.9,0],[0.014,0.103,0]];',
					r * 0.12, r * 0.16, '', 'SQL Database', null, null, this.getTagsForStencil(gn, 'sql', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Database_Fleet_Manager.svg;points=[[0.498,0,0],[0.497,1,0],[0,0.556,0],[1,0.556,0],[0.746,0.093,0],[0.993,0.755,0],[0.007,0.755,0],[0.254,0.093,0]];',
					r * 0.1388, r * 0.17, '', 'SQL Database Fleet Manager', null, null, this.getTagsForStencil(gn, 'sql database fleet manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_SQL_Edge.svg;points=[[0.73,0,0],[0.468,1,0],[0.1,0.5,0],[0.985,0.5,0],[0.957,0.148,0],[0.947,0.68,0],[0.035,0.91,0],[0.183,0.343,0]];',
					r * 0.17, r * 0.17, '', 'SQL Edge', null, null, this.getTagsForStencil(gn, 'sql edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Elastic_Pools.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.758,0.242,0],[0.758,0.758,0],[0.242,0.758,0],[0.242,0.242,0]];',
					r * 0.17, r * 0.17, '', 'SQL Elastic Pools', null, null, this.getTagsForStencil(gn, 'sql elastic pools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Managed_Instance.svg;points=[[0.5,0,0],[0.579,1,0],[0,0.497,0],[1,0.803,0],[0.937,0.946,0],[0.015,0.992,0],[0.013,0.005,0]];',
					r * 0.1625, r * 0.16, '', 'SQL Managed Instance', null, null, this.getTagsForStencil(gn, 'sql managed instance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Server.svg;points=[[0.5,0.01,0],[0.5,0.978,0],[0,0.494,0],[1,0.811,0],[0.717,0.085,0],[0.957,0.925,0],[0.03,0.905,0],[0.025,0.085,0]];',
					r * 0.17, r * 0.17, '', 'SQL Server', null, null, this.getTagsForStencil(gn, 'sql server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Server_Registries.svg;points=[[0.5,0.019,0],[0.5,0.981,0],[0,0.5,0],[1,0.5,0],[0.84,0.009,0],[0.655,0.915,0],[0.035,0.923,0],[0.018,0.094,0]];',
					r * 0.17, r * 0.155, '', 'SQL Server Registries', null, null, this.getTagsForStencil(gn, 'sql server registries', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_SQL_Server_Stretch_Databases.svg;points=[[0.402,0,0],[0.5,0.935,0],[0.072,0.5,0],[0.997,0.5,0],[0.802,0.228,0],[0.989,0.945,0],[0.074,0.712,0],[0,0.228,0]];',
					r * 0.16, r * 0.1625, '', 'SQL Server Stretch Databases', null, null, this.getTagsForStencil(gn, 'sql server stretch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_SQL_VM.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0,0.5,0],[1,0.5,0],[0.987,0.011,0],[0.75,0.994,0],[0.25,0.994,0],[0.013,0.011,0]];',
					r * 0.16, r * 0.15, '', 'SQL VM', null, null, this.getTagsForStencil(gn, 'sql vm virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SSIS_Lift_And_Shift_IR.svg;points=[[0.416,0,0],[0.419,1,0],[0.003,0.499,0],[0.997,0.769,0],[0.813,0.095,0],[0.923,0.932,0],[0.02,0.905,0],[0.014,0.1,0]];',
					r * 0.155, r * 0.17, '', 'SSIS Lift and Shift IR', null, null, this.getTagsForStencil(gn, 'ssis lift and shift ir', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Synapse_Analytics.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.497,0],[1,0.5,0],[1,0.248,0],[1,0.752,0],[0,0.747,0],[0,0.248,0]];',
					r * 0.15, r * 0.1725, '', 'Synapse Analytics', null, null, this.getTagsForStencil(gn, 'synapse analytics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Clusters.svg;points=[[0.5,0.003,0],[0.5,0.91,0],[0,0.5,0],[0.9,0.5,0],[0.892,0.008,0],[0.942,0.871,0],[0.083,0.994,0],[0.01,0.008,0]];',
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
			this.createVertexTemplateEntry(s + 'API_Connections.svg;points=[[0.5,0.007,0],[0.5,0.993,0],[0.015,0.5,0],[0.985,0.5,0],[0.897,0.341,0],[0.91,0.936,0],[0.093,0.647,0],[0.09,0.064,0]];',
					r * 0.17, r * 0.1133, '', 'API Connections', null, null, this.getTagsForStencil(gn, 'api connections application programming interface', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/API_Management_Services.svg;points=[[0.512,0,0],[0.477,1,0],[0,0.496,0],[1,0.541,0],[0.717,0.084,0],[0.92,0.729,0],[0.09,0.712,0],[0.085,0.285,0]];',
					r * 0.1625, r * 0.15, '', 'API Management Services', null, null, this.getTagsForStencil(gn, 'api application programming interface management services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Application_Insights.svg;points=[[0.5,0,0],[0.5,1,0],[0.061,0.5,0],[0.939,0.5,0],[0.91,0.145,0],[0.67,0.945,0],[0.327,0.942,0],[0.09,0.145,0]];',
					r * 0.11, r * 0.1575, '', 'Application Insights', null, null, this.getTagsForStencil(gn, 'application insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_App_Testing.svg;points=[[0.5,0.113,0],[0.5,1,0],[0,0.444,0],[1,0.57,0],[0.744,0.193,0],[0.985,0.99,0],[0.121,0.695,0],[0.116,0.178,0]];',
					r * 0.1697, r * 0.17, '', 'Azure App Testing', null, null, this.getTagsForStencil(gn, 'app testing load playwright', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Change_Analysis.svg;points=[[0.616,0,0],[0.5,0.808,0],[0,0.899,0],[1,0.573,0],[0.79,0.063,0],[0.69,0.944,0],[0.04,0.982,0],[0.438,0.068,0]];',
					r * 0.17, r * 0.1692, '', 'Change Analysis', null, null, this.getTagsForStencil(gn, 'change analysis', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CloudTest.svg;points=[[0.519,0,0],[0.431,1,0],[0,0.386,0],[1,0.421,0],[0.737,0.083,0],[0.846,0.987,0],[0.015,0.99,0],[0.061,0.245,0]];',
					r * 0.147, r * 0.17, '', 'CloudTest', null, null, this.getTagsForStencil(gn, 'cloudtest cloud test', dt).join(' ')),

			this.createVertexTemplateEntry(s + 'Code_Optimization.svg;points=[[0.389,0,0],[0.5,0.779,0],[0,0.389,0],[0.945,0.5,0],[0.76,0.013,0],[0.86,0.985,0],[0.013,0.76,0],[0.018,0.013,0]];',
				r * 0.17, r * 0.17, '', 'Code Optimization', null, null, this.getTagsForStencil(gn, 'code optimization', dt).join(' ')),
	
			this.createVertexTemplateEntry(s + 'Azure_DevOps.svg;points=[[0.43,0,0],[0.5,0.91,0],[0,0.51,0],[1,0.492,0],[1,0.188,0],[1,0.797,0],[0,0.655,0],[0.1,0.238,0]];',
				r * 0.16, r * 0.16, '', 'DevOps', null, null, this.getTagsForStencil(gn, 'devops', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DevOps_Starter.svg;points=[[0.514,0,0],[0.5,0.971,0],[0,0.459,0],[1,0.517,0],[0.712,0.078,0],[0.837,0.917,0],[0.09,0.68,0],[0.07,0.283,0]];',
					r * 0.17, r * 0.1594, '', 'DevOps Starter', null, null, this.getTagsForStencil(gn, 'devops starter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DevTest_Labs.svg;points=[[0.514,0.003,0],[0.559,0.997,0],[0,0.461,0],[1,0.505,0],[0.702,0.067,0],[0.852,0.994,0],[0.265,0.994,0],[0.085,0.266,0]];',
					r * 0.165, r * 0.16, '', 'DevTest Labs', null, null, this.getTagsForStencil(gn, 'devtest labs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Lab_Accounts.svg;points=[[0.406,0,0],[0.765,1,0],[0.145,0.5,0],[1,0.507,0],[0.595,0.01,0],[0.866,0.912,0],[0.008,0.747,0],[0.214,0.013,0]];',
					r * 0.1629, r * 0.17, '', 'Lab Accounts', null, null, this.getTagsForStencil(gn, 'lab accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Lab_Services.svg;points=[[0.514,0.003,0],[0.559,0.997,0],[0,0.461,0],[1,0.505,0],[0.702,0.067,0],[0.852,0.994,0],[0.265,0.994,0],[0.085,0.266,0]];',
					r * 0.165, r * 0.16, '', 'Lab Services', null, null, this.getTagsForStencil(gn, 'lab services', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/other/Load_Testing.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.497,0],[1,0.501,0],[1,0.25,0],[1,0.752,0],[0,0.747,0],[0,0.248,0]];',
					r * 0.148, r * 0.17, '', 'Load Testing', null, null, this.getTagsForStencil(gn, 'load testing', dt).join(' '))
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
			this.createVertexTemplateEntry(s + 'All_Resources.svg;points=[[0.501,0,0],[0.501,1,0],[0,0.5,0],[1,0.5,0],[0.99,0.013,0],[0.992,0.985,0],[0.013,0.99,0],[0.018,0.005,0]];',
					r * 0.16, r * 0.16, '', 'All Resources', null, null, this.getTagsForStencil(gn, 'all resources', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Backlog.svg;points=[[0.5,0.105,0],[0.5,0.899,0],[0,0.506,0],[1,0.501,0],[0.98,0.117,0],[0.982,0.883,0],[0.115,0.988,0],[0.028,0.119,0]];',
					r * 0.17, r * 0.15, '', 'Backlog', null, null, this.getTagsForStencil(gn, 'backlog', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Biz_Talk.svg;points=[[0.514,0,0],[0.506,1,0],[0.003,0.477,0],[0.998,0.52,0],[0.705,0.07,0],[0.925,0.692,0],[0.1,0.692,0],[0.088,0.275,0]];',
					r * 0.1725, r * 0.16, '', 'Biz Talk', null, null, this.getTagsForStencil(gn, 'biz talk', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Blob_Block.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.498,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'Blob Block', null, null, this.getTagsForStencil(gn, 'blob block', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Blob_Page.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.498,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'Blob Page', null, null, this.getTagsForStencil(gn, 'blob page', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Branch.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.758,0.242,0],[0.758,0.758,0],[0.242,0.758,0],[0.242,0.242,0]];',
					r * 0.18, r * 0.18, '', 'Branch', null, null, this.getTagsForStencil(gn, 'branch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Browser.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.498,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'Browser', null, null, this.getTagsForStencil(gn, 'browser', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Bug.svg;points=[[0.5,0.119,0],[0.495,1,0],[0,0.665,0],[1,0.666,0],[0.696,0.005,0],[0.994,0.957,0],[0.006,0.957,0],[0.298,0.01,0]];',
					r * 0.1475, r * 0.16, '', 'Bug', null, null, this.getTagsForStencil(gn, 'bug', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Builds.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.856,0],[1,0.856,0],[0.995,0.987,0],[0.013,0.995,0]];',
					r * 0.16, r * 0.16, '', 'Builds', null, null, this.getTagsForStencil(gn, 'builds', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cache.svg;points=[[0.5,0.01,0],[0.5,0.94,0],[0.003,0.477,0],[0.998,0.5,0],[0.702,0.09,0],[0.985,0.942,0],[0.013,0.855,0],[0.023,0.085,0]];',
					r * 0.16, r * 0.16, '', 'Cache', null, null, this.getTagsForStencil(gn, 'cache', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Code.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.01,0],[0.985,0.99,0],[0.015,0.99,0],[0.015,0.01,0]];',
					r * 0.16, r * 0.13, '', 'Code', null, null, this.getTagsForStencil(gn, 'code', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Commit.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.829,0],[1,0.829,0],[0.985,0.997,0],[0.015,0.997,0]];',
					r * 0.18, r * 0.17, '', 'Commit', null, null, this.getTagsForStencil(gn, 'commit', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Controls.svg;points=[[0.5,0,0],[0.5,1,0],[0.04,0.5,0],[0.957,0.5,0],[0.947,0.01,0],[0.95,0.987,0],[0.05,0.99,0],[0.05,0.01,0]];',
					r * 0.14, r * 0.1725, '', 'Controls', null, null, this.getTagsForStencil(gn, 'controls', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Controls_Horizontal.svg;points=[[0.5,0.043,0],[0.5,0.96,0],[0,0.502,0],[1,0.502,0],[0.987,0.05,0],[0.982,0.956,0],[0.018,0.956,0],[0.013,0.05,0]];',
					r * 0.1725, r * 0.14, '', 'Controls Horizontal', null, null, this.getTagsForStencil(gn, 'controls horizontal', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Alerts.svg;points=[[0.5,0,0],[0.675,1,0],[0,0.424,0],[1,0.424,0],[0.992,0.012,0],[0.985,0.841,0],[0.015,0.841,0],[0.01,0.009,0]];',
					r * 0.1675, r * 0.14, '', 'Cost Alerts', null, null, this.getTagsForStencil(gn, 'cost alerts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Analysis.svg;points=[[0.5,0.116,0],[0.5,0.864,0],[0,0.31,0],[0.796,0.5,0],[0.991,0.985,0],[0.018,0.79,0],[0.059,0.17,0]];',
					r * 0.15, r * 0.175, '', 'Cost Analysis', null, null, this.getTagsForStencil(gn, 'cost analysis', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Budgets.svg;points=[[0.475,0,0],[0.534,1,0],[0,0.471,0],[1,0.535,0],[0.878,0.22,0],[0.868,0.86,0],[0.059,0.782,0],[0.143,0.148,0]];',
					r * 0.1675, r * 0.17, '', 'Cost Budgets', null, null, this.getTagsForStencil(gn, 'cost budgets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Management.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.501,0],[1,0.5,0],[0.77,0.031,0],[0.77,0.969,0],[0.23,0.969,0],[0.23,0.031,0]];',
					r * 0.1675, r * 0.15, '', 'Cost Management', null, null, this.getTagsForStencil(gn, 'cost management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Management_and_Billing.svg;points=[[0.472,0,0],[0.468,1,0],[0,0.53,0],[1,0.532,0],[0.825,0.145,0],[0.822,0.847,0],[0.118,0.842,0],[0.143,0.19,0]];',
					r * 0.17, r * 0.17, '', 'Cost Management and Billing', null, null, this.getTagsForStencil(gn, 'cost management and billing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Counter.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.01,0],[0.985,0.99,0],[0.015,0.99,0],[0.015,0.01,0]];',
					r * 0.16, r * 0.13, '', 'Counter', null, null, this.getTagsForStencil(gn, 'counter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cubes.svg;points=[[0.495,0,0],[0.5,1,0],[0,0.58,0],[1,0.58,0],[0.741,0.14,0],[1,0.86,0],[0,0.86,0],[0.252,0.14,0]];',
					r * 0.1675, r * 0.17, '', 'Cubes', null, null, this.getTagsForStencil(gn, 'cubes', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Dashboard.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.502,0],[1,0.5,0],[0.985,0.004,0],[0.992,0.989,0],[0.015,0.996,0],[0.015,0.004,0]];',
					r * 0.17, r * 0.12, '', 'Dashboard', null, null, this.getTagsForStencil(gn, 'dashboard', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Dashboard2.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.004,0],[0.992,0.989,0],[0.015,0.996,0],[0.015,0.004,0]];',
					r * 0.17, r * 0.12, '', 'Dashboard', null, null, this.getTagsForStencil(gn, 'dashboard', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Dev_Console.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.498,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'Dev Console', null, null, this.getTagsForStencil(gn, 'dev console', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Download.svg;points=[[0.5,0.003,0],[0.501,0.998,0],[0,0.41,0],[1,0.41,0],[0.994,0.083,0],[0.78,0.997,0],[0.223,0.997,0],[0.006,0.083,0]];',
					r * 0.16, r * 0.1675, '', 'Download', null, null, this.getTagsForStencil(gn, 'download', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Error.svg;points=[[0.514,0,0],[0.726,1,0],[0,0.467,0],[1,0.508,0],[0.717,0.079,0],[0.822,0.966,0],[0.088,0.668,0],[0.09,0.264,0]];',
					r * 0.1775, r * 0.17, '', 'Error', null, null, this.getTagsForStencil(gn, 'error', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Extensions.svg;points=[[0.75,0,0],[0.459,1,0],[0,0.551,0],[1,0.256,0],[0.987,0.008,0],[0.902,0.995,0],[0.01,0.992,0],[0.013,0.11,0]];',
					r * 0.1625, r * 0.16, '', 'Extensions', null, null, this.getTagsForStencil(gn, 'extensions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'File.svg;points=[[0.5,0.003,0],[0.5,0.998,0],[0,0.5,0],[1,0.5,0],[0.984,0.32,0],[0.993,0.985,0],[0.007,0.985,0],[0.007,0.015,0]];',
					r * 0.14, r * 0.1725, '', 'File', null, null, this.getTagsForStencil(gn, 'file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Files.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.765,0.093,0],[0.997,0.987,0],[0.274,0.985,0],[0.003,0.008,0]];',
					r * 0.16, r * 0.175, '', 'Files', null, null, this.getTagsForStencil(gn, 'files', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Folder_Blank.svg;points=[[0.5,0.083,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.554,0],[0.99,0.114,0],[0.987,0.996,0],[0.013,0.996,0],[0.013,0.004,0]];',
					r * 0.1725, r * 0.14, '', 'Folder Blank', null, null, this.getTagsForStencil(gn, 'folder blank', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Folder_Website.svg;points=[[0.5,0.088,0],[0.5,0.997,0],[0,0.502,0],[1,0.555,0],[0.995,0.119,0],[0.99,0.993,0],[0.01,0.993,0],[0.01,0.007,0]];',
					r * 0.17, r * 0.14, '', 'Folder Website', null, null, this.getTagsForStencil(gn, 'folder website', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Free_Services.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.992,0.011,0],[0.75,1,0],[0.25,1,0],[0.008,0.011,0]];',
					r * 0.17, r * 0.1575, '', 'Free Services', null, null, this.getTagsForStencil(gn, 'free services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'FTP.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.15, r * 0.12, '', 'FTP', null, null, this.getTagsForStencil(gn, 'ftp file transfer protocol', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Gear.svg;points=[[0.497,0.003,0],[0.502,0.998,0],[0,0.505,0],[1,0.5,0],[0.817,0.113,0],[0.895,0.81,0],[0.105,0.817,0],[0.185,0.11,0]];',
					r * 0.16, r * 0.16, '', 'Gear', null, null, this.getTagsForStencil(gn, 'gear', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Globe.svg;points=[[0.422,0,0],[0.5,1,0],[0.038,0.5,0],[0.973,0.5,0],[0.873,0.048,0],[0.734,0.987,0],[0.266,0.987,0],[0.092,0.133,0]];',
					r * 0.14, r * 0.165, '', 'Globe', null, null, this.getTagsForStencil(gn, 'globe', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Globe_Error.svg;points=[[0.422,0,0],[0.5,1,0],[0.038,0.5,0],[0.973,0.5,0],[0.873,0.048,0],[0.734,0.987,0],[0.266,0.987,0],[0.092,0.133,0]];',
					r * 0.14, r * 0.165, '', 'Globe Error', null, null, this.getTagsForStencil(gn, 'globe error', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Globe_Success.svg;points=[[0.422,0,0],[0.5,1,0],[0.038,0.5,0],[0.973,0.5,0],[0.873,0.048,0],[0.734,0.987,0],[0.266,0.987,0],[0.092,0.133,0]];',
					r * 0.14, r * 0.165, '', 'Globe Success', null, null, this.getTagsForStencil(gn, 'globe success', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Globe_Warning.svg;points=[[0.422,0,0],[0.5,1,0],[0.038,0.5,0],[0.973,0.5,0],[0.873,0.048,0],[0.734,0.987,0],[0.266,0.987,0],[0.092,0.133,0]];',
					r * 0.14, r * 0.165, '', 'Globe Warning', null, null, this.getTagsForStencil(gn, 'globe warning', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Guide.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Guide', null, null, this.getTagsForStencil(gn, 'guide', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Heart.svg;points=[[0.5,0.172,0],[0.5,1,0],[0.037,0.5,0],[0.96,0.5,0],[0.897,0.054,0],[0.752,0.784,0],[0.26,0.8,0],[0.1,0.056,0]];',
					r * 0.16, r * 0.15, '', 'Heart', null, null, this.getTagsForStencil(gn, 'heart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Help_and_Support.svg;points=[[0.492,0,0],[0.5,1,0],[0.307,0.5,0],[0.912,0.5,0],[0.84,0.135,0],[0.975,0.98,0],[0.019,0.975,0],[0.185,0.118,0]];',
					r * 0.14, r * 0.1725, '', 'Help and Support', null, null, this.getTagsForStencil(gn, 'help support', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Image.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.502,0],[0.985,0.008,0],[0.985,0.992,0],[0.015,0.992,0],[0.015,0.008,0]];',
					r * 0.16, r * 0.11, '', 'Image', null, null, this.getTagsForStencil(gn, 'image', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Information.svg;points=[[0.497,0,0],[0.504,1,0],[0,0.499,0],[1,0.5,0],[0.85,0.14,0],[0.875,0.835,0],[0.125,0.835,0],[0.148,0.143,0]];',
					r * 0.16, r * 0.16, '', 'Information', null, null, this.getTagsForStencil(gn, 'information', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Input_Output.svg;points=[[0.495,0.003,0],[0.495,0.997,0],[0,0.491,0],[1,0.49,0],[0.962,0.009,0],[0.962,0.991,0],[0.028,0.991,0],[0.028,0.009,0]];',
					r * 0.16, r * 0.1375, '', 'Input Output', null, null, this.getTagsForStencil(gn, 'input output', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Journey_Hub.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.494,0],[1,0.494,0],[0.997,0.005,0],[0.994,0.987,0],[0.006,0.987,0],[0.003,0.005,0]];',
					r * 0.15, r * 0.1575, '', 'Journey Hub', null, null, this.getTagsForStencil(gn, 'journey hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Launch_Portal.svg;points=[[0.811,0,0],[0.419,1,0],[0,0.594,0],[1,0.192,0],[0.995,0,0],[0.822,0.997,0],[0.01,0.995,0],[0.01,0.191,0]];',
					r * 0.17, r * 0.1675, '', 'Launch Portal', null, null, this.getTagsForStencil(gn, 'launch portal', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Learn.svg;points=[[0.533,0,0],[0.5,0.819,0],[0,0.44,0],[1,0.388,0],[0.989,0.015,0],[0.989,0.757,0],[0.117,0.997,0],[0.001,0.078,0]];',
					r * 0.12, r * 0.175, '', 'Learn', null, null, this.getTagsForStencil(gn, 'learn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Load_Test.svg;points=[[0.5,0,0],[0.5,1,0],[0.29,0.5,0],[0.71,0.5,0],[0.725,0.006,0],[0.977,0.997,0],[0.023,0.997,0],[0.275,0.006,0]];',
					r * 0.17, r * 0.165, '', 'Load Test', null, null, this.getTagsForStencil(gn, 'load test', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Location.svg;points=[[0.504,0.003,0],[0.5,0.998,0],[0,0.715,0],[1,0.715,0],[0.822,0.108,0],[0.937,0.855,0],[0.067,0.86,0],[0.178,0.113,0]];',
					r * 0.10, r * 0.1775, '', 'Location', null, null, this.getTagsForStencil(gn, 'location', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Log_Streaming.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[1,0.093,0],[0.994,0.922,0],[0.006,0.922,0],[0,0.093,0]];',
					r * 0.14, r * 0.1675, '', 'Log Streaming', null, null, this.getTagsForStencil(gn, 'log streaming', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Management_Groups.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.499,0],[1,0.5,0],[1,0.111,0],[1,0.889,0],[0,0.884,0],[0,0.114,0]];',
					r * 0.165, r * 0.16, '', 'Management Groups', null, null, this.getTagsForStencil(gn, 'management groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Management_Portal.svg;points=[[0.5,0,0],[0.501,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.982,0.996,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.15, r * 0.12, '', 'Management Portal', null, null, this.getTagsForStencil(gn, 'management portal', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Marketplace.svg;points=[[0.5,0.014,0],[0.5,0.978,0],[0.016,0.5,0],[0.981,0.5,0],[0.968,0.245,0],[0.997,0.897,0],[0.003,0.942,0],[0.029,0.245,0]];',
					r * 0.14, r * 0.16, '', 'Marketplace', null, null, this.getTagsForStencil(gn, 'marketplace', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/other/Marketplace_Management.svg;points=[[0.582,0.005,0],[0.5,0.973,0],[0.014,0.501,0],[0.986,0.501,0],[0.976,0.255,0],[1,0.895,0],[0,0.94,0],[0.024,0.255,0]];',
					r * 0.145, r * 0.17, '', 'Marketplace Management', null, null, this.getTagsForStencil(gn, 'marketplace management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Media.svg;points=[[0.499,0,0],[0.496,1,0],[0,0.499,0],[1,0.502,0],[0.87,0.163,0],[0.837,0.87,0],[0.163,0.87,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Media', null, null, this.getTagsForStencil(gn, 'media', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Media_File.svg;points=[[0.5,0.003,0],[0.5,0.998,0],[0,0.5,0],[1,0.5,0],[0.984,0.32,0],[0.993,0.985,0],[0.007,0.985,0],[0.007,0.015,0]];',
					r * 0.13, r * 0.16, '', 'Media File', null, null, this.getTagsForStencil(gn, 'media file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Mobile.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.999,0.015,0],[0.995,0.99,0],[0.005,0.99,0],[0.005,0.01,0]];',
					r * 0.1, r * 0.1675, '', 'Mobile', null, null, this.getTagsForStencil(gn, 'mobile', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Mobile_Engagement.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.999,0.015,0],[0.995,0.99,0],[0.005,0.99,0],[0.005,0.01,0]];',
					r * 0.1, r * 0.1675, '', 'Mobile Engagement', null, null, this.getTagsForStencil(gn, 'mobile engagement', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Module.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.995,0.013,0],[0.997,0.985,0],[0.013,0.995,0],[0.013,0.005,0]];',
					r * 0.16, r * 0.16, '', 'Module', null, null, this.getTagsForStencil(gn, 'module', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Power.svg;points=[[0.5,0,0],[0.5,0.745,0],[0,0.545,0],[0.912,0.5,0],[0.992,0.005,0],[0.996,0.452,0],[0.039,1,0]];',
					r * 0.11, r * 0.17, '', 'Power', null, null, this.getTagsForStencil(gn, 'power', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Power_Up.svg;points=[[0.5,0.106,0],[0.5,0.894,0],[0.106,0.5,0],[0.894,0.5,0],[0.947,0.048,0],[0.952,0.947,0],[0.048,0.947,0],[0.055,0.045,0]];',
					r * 0.17, r * 0.17, '', 'Power Up', null, null, this.getTagsForStencil(gn, 'power up', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Powershell.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.498,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'Powershell', null, null, this.getTagsForStencil(gn, 'powershell', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Preview.svg;points=[[0.5,0.003,0],[0.5,0.75,0],[0,0.505,0],[1,0.506,0],[0.996,0.02,0],[0.999,0.987,0],[0.001,0.985,0],[0.004,0.02,0]];',
					r * 0.11, r * 0.16, '', 'Preview', null, null, this.getTagsForStencil(gn, 'preview', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Preview_Features.svg;points=[[0.404,0,0],[0.5,1,0],[0,0.5,0],[1,0.596,0],[0.995,0.21,0],[0.997,0.985,0],[0.013,0.995,0],[0.013,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Preview Features', null, null, this.getTagsForStencil(gn, 'preview features', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Process_Explorer.svg;points=[[0.5,0,0],[0.501,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.777,1,0],[0.225,1,0],[0.015,0.006,0]];',
					r * 0.175, r * 0.17, '', 'Process Explorer', null, null, this.getTagsForStencil(gn, 'process explorer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Production_Ready_Database.svg;points=[[0.497,0,0],[0.497,1,0],[0,0.501,0],[1,0.496,0],[0.983,0.1,0],[0.98,0.902,0],[0.017,0.9,0],[0.017,0.1,0]];',
					r * 0.12, r * 0.16, '', 'Production Ready Database', null, null, this.getTagsForStencil(gn, 'production ready database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Quickstart_Center.svg;points=[[0.5,0.252,0],[0.5,0.979,0],[0.026,0.5,0],[0.745,0.5,0],[0.992,0,0],[0.602,0.905,0],[0,0.992,0],[0.09,0.415,0]];',
					r * 0.17, r * 0.17, '', 'Quickstart Center', null, null, this.getTagsForStencil(gn, 'quickstart center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Recent.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Recent', null, null, this.getTagsForStencil(gn, 'recent', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Region_Management.svg;points=[[0.428,0,0],[0.427,1,0],[0,0.383,0],[0.983,0.5,0],[0.859,0.045,0],[0.644,0.992,0],[0.21,0.992,0],[0.095,0.138,0]];',
					r * 0.1485, r * 0.17, '', 'Region Management', null, null, this.getTagsForStencil(gn, 'region management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Reservations.svg;points=[[0.501,0,0],[0.499,1,0],[0,0.5,0],[1,0.5,0],[0.837,0.128,0],[0.865,0.845,0],[0.135,0.845,0],[0.163,0.128,0]];',
					r * 0.17, r * 0.17, '', 'Reservations', null, null, this.getTagsForStencil(gn, 'reservations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Explorer.svg;points=[[0.5,0.085,0],[0.5,0.997,0],[0,0.5,0],[1,0.555,0],[0.99,0.116,0],[0.992,0.99,0],[0.008,0.99,0],[0.008,0.01,0]];',
					r * 0.17, r * 0.14, '', 'Resource Explorer', null, null, this.getTagsForStencil(gn, 'resource exporer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Group_List.svg;points=[[0.59,0,0],[0.5,0.83,0],[0.171,0.5,0],[1,0.415,0],[0.982,0.003,0],[0.982,0.827,0],[0.02,0.997,0],[0.198,0.003,0]];',
					r * 0.17, r * 0.1675, '', 'Resource Group List', null, null, this.getTagsForStencil(gn, 'resource group list', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Groups.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.995,0.109,0],[0.997,0.888,0],[0.003,0.888,0],[0.003,0.112,0]];',
					r * 0.17, r * 0.16, '', 'Resource Groups', null, null, this.getTagsForStencil(gn, 'resource groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Linked.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.758,0.242,0],[0.758,0.758,0],[0.242,0.758,0],[0.242,0.242,0]];',
					r * 0.18, r * 0.18, '', 'Resource Linked', null, null, this.getTagsForStencil(gn, 'resource linked', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Scale.svg;points=[[0.459,0,0],[0.526,1,0],[0,0.476,0],[1,0.541,0],[0.995,0,0],[0.985,1,0],[0,1,0],[0,0.018,0]];',
					r * 0.15, r * 0.15, '', 'Scale', null, null, this.getTagsForStencil(gn, 'scale', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Scheduler.svg;points=[[0.54,0,0],[0.5,0.916,0],[0.003,0.479,0],[0.998,0.459,0],[0.865,0.133,0],[0.89,0.757,0],[0.248,0.995,0],[0.15,0.133,0]];',
					r * 0.17, r * 0.17, '', 'Scheduler', null, null, this.getTagsForStencil(gn, 'scheduler', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Search.svg;points=[[0.596,0,0],[0.5,0.776,0],[0.212,0.5,0],[0.997,0.393,0],[0.901,0.135,0],[0.903,0.647,0],[0.021,0.977,0],[0.313,0.115,0]];',
					r * 0.16, r * 0.1625, '', 'Search', null, null, this.getTagsForStencil(gn, 'search', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Search_Grid.svg;points=[[0.59,0,0],[0.5,0.83,0],[0.171,0.5,0],[1,0.415,0],[0.982,0.003,0],[0.982,0.827,0],[0.02,0.997,0],[0.198,0.003,0]];',
					r * 0.17, r * 0.1675, '', 'Search Grid', null, null, this.getTagsForStencil(gn, 'search grid', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Server_Farm.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.471,0],[0.998,0.775,0],[0.605,0.008,0],[0.92,0.992,0],[0.01,0.932,0],[0.013,0.008,0]];',
					r * 0.16, r * 0.16, '', 'Server Farm', null, null, this.getTagsForStencil(gn, 'server farm', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Bus.svg;points=[[0.514,0,0],[0.494,1,0],[0,0.522,0],[1,0.57,0],[0.712,0.085,0],[0.932,0.752,0],[0.308,0.997,0],[0.098,0.289,0]];',
					r * 0.175, r * 0.15, '', 'Service Bus', null, null, this.getTagsForStencil(gn, 'service bus', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Health.svg;points=[[0.5,0.172,0],[0.5,1,0],[0.037,0.5,0],[0.963,0.5,0],[0.9,0.056,0],[0.747,0.79,0],[0.24,0.779,0],[0.09,0.064,0]];',
					r * 0.17, r * 0.16, '', 'Service Health', null, null, this.getTagsForStencil(gn, 'service health', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SSD.svg;points=[[0.5,0,0],[0.5,1,0],[0.028,0.5,0],[0.973,0.5,0],[0.905,0.02,0],[0.967,0.986,0],[0.033,0.986,0],[0.095,0.02,0]];',
					r * 0.165, r * 0.15, '', 'SSD', null, null, this.getTagsForStencil(gn, 'ssd solid state drive', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Azure_Files.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.01,0],[0.985,0.99,0],[0.015,0.99,0],[0.015,0.01,0]];',
					r * 0.16, r * 0.13, '', 'Storage Azure Files', null, null, this.getTagsForStencil(gn, 'storage files', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Container.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.01,0],[0.985,0.99,0],[0.015,0.99,0],[0.015,0.01,0]];',
					r * 0.16, r * 0.13, '', 'Storage Container', null, null, this.getTagsForStencil(gn, 'storage container', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Queue.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.01,0],[0.985,0.99,0],[0.015,0.99,0],[0.015,0.01,0]];',
					r * 0.16, r * 0.13, '', 'Storage Queue', null, null, this.getTagsForStencil(gn, 'storage queue', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Subscriptions.svg;points=[[0.498,0.003,0],[0.502,0.998,0],[0.22,0.5,0],[0.78,0.5,0],[0.979,0.258,0],[0.657,0.91,0],[0.343,0.91,0],[0.025,0.253,0]];',
					r * 0.11, r * 0.1775, '', 'Subscriptions', null, null, this.getTagsForStencil(gn, 'subscriptions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Table.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.01,0],[0.985,0.99,0],[0.015,0.99,0],[0.015,0.01,0]];',
					r * 0.16, r * 0.13, '', 'Table', null, null, this.getTagsForStencil(gn, 'table', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Tag.svg;points=[[0.5,0.074,0],[0.399,1,0],[0.001,0.587,0],[0.907,0.5,0],[0.923,0.077,0],[0.705,0.705,0],[0.193,0.807,0],[0.29,0.29,0]];',
					r * 0.17, r * 0.167, '', 'Tag', null, null, this.getTagsForStencil(gn, 'tag', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Tags.svg;points=[[0.5,0.013,0],[0.463,1,0],[0.012,0.5,0],[0.984,0.5,0],[0.886,0.12,0],[0.114,0.692,0]];',
					r * 0.15, r * 0.1625, '', 'Tags', null, null, this.getTagsForStencil(gn, 'tags', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Templates.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.997,0.5,0],[0.981,0.32,0],[0.99,0.987,0],[0.01,0.987,0],[0.01,0.013,0]];',
					r * 0.14, r * 0.17, '', 'Templates', null, null, this.getTagsForStencil(gn, 'templates', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'TFS_VC_Repository.svg;points=[[0.27,0,0],[0.279,1,0],[0,0.271,0],[1,0.388,0],[0.957,0.295,0],[0.77,0.855,0],[0.195,0.967,0],[0.098,0.06,0]];',
					r * 0.17, r * 0.17, '', 'TFS VC Repository', null, null, this.getTagsForStencil(gn, 'tfs vc repository', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Toolbox.svg;points=[[0.502,0,0],[0.5,1,0],[0,0.6,0],[1,0.6,0],[0.992,0.212,0],[0.987,0.994,0],[0.013,0.994,0],[0.008,0.212,0]];',
					r * 0.16, r * 0.14, '', 'Toolbox', null, null, this.getTagsForStencil(gn, 'toolbox', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Troubleshoot.svg;points=[[0.228,0.007,0],[0.155,0.998,0],[0.351,0.5,0],[0.644,0.5,0],[0.984,0.003,0],[0.966,0.962,0],[0.004,0.841,0],[0.012,0.196,0]];',
					r * 0.165, r * 0.17, '', 'Troubleshoot', null, null, this.getTagsForStencil(gn, 'troubleshoot', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Versions.svg;points=[[0.429,0.003,0],[0.571,0.997,0],[0,0.5,0],[1,0.5,0],[0.842,0.006,0],[0.987,0.994,0],[0.158,0.994,0],[0.01,0.008,0]];',
					r * 0.155, r * 0.15, '', 'Versions', null, null, this.getTagsForStencil(gn, 'versions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_Slots.svg;points=[[0.5,0.12,0],[0.501,1,0],[0.003,0.833,0],[0.997,0.83,0],[0.834,0.178,0],[0.991,0.99,0],[0.009,0.99,0],[0.235,0.24,0]];',
					r * 0.145, r * 0.16, '', 'Web Slots', null, null, this.getTagsForStencil(gn, 'web slots', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_Test.svg;points=[[0.416,0,0],[0.5,1,0],[0,0.42,0],[0.864,0.5,0],[0.717,0.123,0],[0.997,0.99,0],[0.123,0.717,0],[0.113,0.133,0]];',
					r * 0.18, r * 0.18, '', 'Web Test', null, null, this.getTagsForStencil(gn, 'web test', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Website_Power.svg;points=[[0.5,0.106,0],[0.5,0.894,0],[0.106,0.5,0],[0.894,0.5,0],[0.947,0.048,0],[0.952,0.947,0],[0.048,0.947,0],[0.058,0.043,0]];',
					r * 0.17, r * 0.17, '', 'Website Power', null, null, this.getTagsForStencil(gn, 'website power', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Website_Staging.svg;points=[[0.512,0,0],[0.5,1,0],[0.003,0.405,0],[0.997,0.441,0],[0.74,0.093,0],[0.97,0.755,0],[0.077,0.995,0],[0.063,0.258,0]];',
					r * 0.16, r * 0.175, '', 'Website Staging', null, null, this.getTagsForStencil(gn, 'website staging', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Workbooks.svg;points=[[0.576,0,0],[0.492,1,0],[0,0.547,0],[1,0.476,0],[0.989,0.018,0],[0.991,0.925,0],[0.101,0.995,0],[0.16,0.023,0]];',
					r * 0.15, r * 0.1625, '', 'Workbooks', null, null, this.getTagsForStencil(gn, 'workbooks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Workflow.svg;points=[[0.499,0,0],[0.501,1,0],[0.095,0.5,0],[0.905,0.5,0],[0.663,0.015,0],[0.997,0.877,0],[0.006,0.88,0],[0.335,0.013,0]];',
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

	Sidebar.prototype.addAzure2HybridAndMulticloudPalette = function(gn, r, sb, s)
	{
		var dt = 'azure hybrid and multicloud ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'AI_at_Edge.svg;points=[[0.5,0.028,0],[0.5,0.902,0],[0,0.454,0],[1,0.563,0],[0.922,0.375,0],[0.907,0.761,0],[0.013,0.849,0],[0.038,0.018,0]];',
					r * 0.17, r * 0.169, '', 'AI at Edge', null, null, this.getTagsForStencil(gn, 'ai edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Local.svg;points=[[0.5,0,0],[0.485,1,0],[0,0.777,0],[1,0.768,0],[0.89,0.003,0],[0.957,0.894,0],[0.03,0.891,0],[0.11,0.003,0]];',
					r * 0.17, r * 0.1683, '', 'Azure Local', null, null, this.getTagsForStencil(gn, 'azure local stack hci', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Operator_5G_Core.svg;points=[[0.429,0,0],[0.504,1,0],[0,0.566,0],[0.89,0.5,0],[0.57,0.064,0],[0.952,0.85,0],[0.093,0.835,0],[0.283,0.064,0]];',
					r * 0.17, r * 0.1133, '', 'Azure Operator 5G Core', null, null, this.getTagsForStencil(gn, 'operator 5g core', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Operator_Insights.svg;points=[[0.5,0.081,0],[0.5,1,0],[0,0.246,0],[1,0.75,0],[0.662,0.008,0],[0.945,0.91,0],[0.128,0.982,0],[0.093,0.003,0]];',
				r * 0.17, r * 0.17, '', 'Azure Operator Insights', null, null, this.getTagsForStencil(gn, 'operator insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Operator_Nexus.svg;points=[[0.5,0,0],[0.554,1,0],[0,0.799,0],[1,0.5,0],[0.995,0.013,0],[0.995,0.987,0],[0.06,0.952,0]];',
				r * 0.17, r * 0.17, '', 'Azure Operator Nexus', null, null, this.getTagsForStencil(gn, 'operator nexus', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Operator_Service_Manager.svg;points=[[0.5,0.081,0],[0.5,1,0],[0,0.246,0],[1,0.75,0],[0.662,0.008,0],[0.945,0.91,0],[0.128,0.982,0],[0.085,0.008,0]];',
				r * 0.17, r * 0.17, '', 'Azure Operator Service Manager', null, null, this.getTagsForStencil(gn, 'operator service manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Programmable_Connectivity.svg;points=[[0.5,0.085,0],[0.5,1,0],[0.087,0.5,0],[0.989,0.5,0],[0.997,0.992,0],[0.383,0.995,0],[0.098,0.07,0]];',
				r * 0.17, r * 0.17, '', 'Azure Programmable Connectivity', null, null, this.getTagsForStencil(gn, 'operator programmable connectivity', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Edge_Storage_Accelerator.svg;points=[[0.465,0,0],[0.5,0.988,0],[0,0.415,0],[1,0.5,0],[0.99,0.363,0],[0.995,0.94,0],[0.363,0.947,0],[0.09,0.22,0]];',
					r * 0.17, r * 0.17, '', 'Edge Storage Accelerator', null, null, this.getTagsForStencil(gn, 'edge storage accelerator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Workload_Orchestration.svg;points=[[0.5,0,0],[0.499,1,0],[0.028,0.5,0],[0.973,0.5,0],[0.83,0.165,0],[0.827,0.866,0],[0.175,0.869,0],[0.178,0.157,0]];',
					r * 0.17, r * 0.1652, '', 'Workload Orchestration', null, null, this.getTagsForStencil(gn, 'workload orchestration toolchain orchestrator', dt).join(' ')),
			];
			
		this.addPalette('azure2Hybrid and Multicloud', 'Azure / Hybrid and Multicloud', false, mxUtils.bind(this, function(content)
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
			this.createVertexTemplateEntry(s + 'AAD_Licenses.svg;points=[[0.443,0,0],[0.5,0.944,0],[0.172,0.5,0],[1,0.599,0],[0.631,0.08,0],[0.922,0.992,0],[0.016,0.912,0],[0.263,0.073,0]];',
					r * 0.165, r * 0.17, '', 'AAD Licenses', null, null, this.getTagsForStencil(gn, 'aad licenses', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Active_Directory.svg;points=[[0.5,0.007,0],[0.496,0.997,0],[0.111,0.5,0],[0.889,0.5,0],[0.748,0.322,0],[0.997,0.647,0],[0.003,0.647,0],[0.248,0.322,0]];',
					r * 0.175, r * 0.16, '', 'Active Directory', null, null, this.getTagsForStencil(gn, 'active directory', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Active_Directory_Connect_Health.svg;points=[[0.5,0.005,0],[0.5,0.973,0],[0.104,0.5,0],[0.915,0.5,0],[0.872,0.897,0],[0,0.63,0],[0.247,0.315,0]];',
					r * 0.1725, r * 0.16, '', 'Active Directory Connect Health', null, null, this.getTagsForStencil(gn, 'active directory connect health', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Active_Directory_Connect_Health2.svg;points=[[0.5,0,0],[0.5,0.997,0],[0,0.615,0],[0.953,0.5,0],[0.877,0.887,0],[0.033,0.688,0]];',
					r * 0.17, r * 0.1511, '', 'Active Directory Connect Health', null, null, this.getTagsForStencil(gn, 'active directory connect health', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_AD_B2C.svg;points=[[0.5,0.005,0],[0.5,1,0],[0.104,0.5,0],[0.892,0.5,0],[0.747,0.314,0],[0.982,0.913,0],[0.008,0.636,0],[0.249,0.314,0]];',
					r * 0.1725, r * 0.16, '', 'AD B2C', null, null, this.getTagsForStencil(gn, 'ad b2c', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_AD_Domain_Services.svg;points=[[0.5,0.007,0],[0.496,0.997,0],[0.111,0.5,0],[0.889,0.5,0],[1,0.882,0],[0.003,0.647,0],[0.248,0.322,0]];',
					r * 0.175, r * 0.16, '', 'AD Domain Services', null, null, this.getTagsForStencil(gn, 'ad domain services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_AD_Identity_Protection.svg;points=[[0.5,0.005,0],[0.496,1,0],[0.111,0.5,0],[0.889,0.5,0],[0.748,0.322,0],[1,0.646,0],[0.005,0.649,0],[0.248,0.321,0]];',
					r * 0.17, r * 0.155, '', 'AD Identity Protection', null, null, this.getTagsForStencil(gn, 'ad identity protection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_AD_Privilege_Identity_Management.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'AD Privilege Identity Management', null, null, this.getTagsForStencil(gn, 'ad privilege identity management', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/intune/Azure_AD_Roles_and_Administrators.svg;points=[[0.439,0,0],[0.5,0.963,0],[0.186,0.5,0],[1,0.75,0],[0.605,0.063,0],[1,0.877,0],[0.025,0.942,0],[0.25,0.085,0]];',
					r * 0.17, r * 0.17, '', 'AD Roles and Administrators', null, null, this.getTagsForStencil(gn, 'ad roles administrators', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Administrative_Units.svg;points=[[0.5,0,0],[0.5,0.999,0],[0,0.5,0],[1,0.5,0],[1,0,0],[1,1,0],[0,1,0],[0,0,0]];',
					r * 0.17, r * 0.17, '', 'Administrative Units', null, null, this.getTagsForStencil(gn, 'administrative units', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/other/API_Proxy.svg;points=[[0.5,0.223,0],[0.5,0.777,0],[0,0.5,0],[1,0.5,0],[0.75,0.362,0],[0.75,0.64,0],[0.25,0.64,0],[0.25,0.362,0]];',
					r * 0.17, r * 0.17, '', 'API Proxy', null, null, this.getTagsForStencil(gn, 'api application programming interface proxy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Registrations.svg;points=[[0.429,0,0],[0.769,0.998,0],[0,0.425,0],[1,0.733,0],[0.855,0.018,0],[1,0.867,0],[0.005,0.835,0],[0.005,0.015,0]];',
					r * 0.1575, r * 0.16, '', 'App Registrations', null, null, this.getTagsForStencil(gn, 'app registrations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_AD_B2C2.svg;points=[[0.5,0,0],[0.5,1,0],[0.064,0.5,0],[1,0.614,0],[0.99,0.91,0],[0.028,0.682,0]];',
				r * 0.17, r * 0.1511, '', 'Azure AD B2C', null, null, this.getTagsForStencil(gn, 'ad b2c', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Custom_Azure_AD_Roles.svg;points=[[0.439,0,0],[0.5,0.963,0],[0.186,0.5,0],[1,0.751,0],[0.605,0.063,0],[1,0.877,0],[0.025,0.942,0],[0.25,0.085,0]];',
					r * 0.17, r * 0.17, '', 'Custom Azure AD Roles', null, null, this.getTagsForStencil(gn, 'custom azure ad roles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Enterprise_Applications.svg;points=[[0.427,0,0],[0.752,1,0],[0,0.429,0],[1,0.754,0],[0.842,0.005,0],[0.942,0.915,0],[0.013,0.85,0],[0.018,0.003,0]];',
					r * 0.16, r * 0.16, '', 'Enterprise Applications', null, null, this.getTagsForStencil(gn, 'enterprise applications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Connect.svg;points=[[0.5,0,0],[0.5,0.939,0],[0.039,0.5,0],[0.958,0.5,0],[0.922,0.928,0],[0.028,0.645,0]];',
				r * 0.17, r * 0.1606, '', 'Entra Connect', null, null, this.getTagsForStencil(gn, 'entra connect', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Domain_Services.svg;points=[[0.5,0.054,0],[0.5,0.946,0],[0.064,0.5,0],[1,0.605,0],[0.97,0.842,0],[0.015,0.655,0]];',
				r * 0.17, r * 0.17, '', 'Entra Domain Services', null, null, this.getTagsForStencil(gn, 'entra domain services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Global_Secure_Access.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.497,0],[1,0.502,0],[0.837,0.128,0],[0.87,0.84,0],[0.128,0.837,0],[0.148,0.143,0]];',
				r * 0.17, r * 0.17, '', 'Entra Global Secure Access', null, null, this.getTagsForStencil(gn, 'entra global secure access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_ID_Protection.svg;points=[[0.5,0,0],[0.5,0.975,0],[0.064,0.5,0],[0.935,0.5,0],[0.885,0.935,0],[0.038,0.668,0]];',
				r * 0.17, r * 0.1511, '', 'Entra ID Protection', null, null, this.getTagsForStencil(gn, 'entra id protection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Internet_Access.svg;points=[[0.421,0,0],[0.5,0.895,0],[0,0.419,0],[1,0.876,0],[0.707,0.11,0],[0.965,0.962,0],[0.105,0.702,0],[0.128,0.115,0]];',
				r * 0.17, r * 0.17, '', 'Entra Internet Access', null, null, this.getTagsForStencil(gn, 'entra internet access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Managed_Identities.svg;points=[[0.5,0,0],[0.5,0.995,0],[0.064,0.5,0],[0.998,0.614,0],[0.765,1,0],[0.03,0.682,0]];',
				r * 0.17, r * 0.1511, '', 'Entra Managed Identities', null, null, this.getTagsForStencil(gn, 'entra managed identities', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Private_Access.svg;points=[[0.417,0,0],[0.789,1,0],[0,0.415,0],[1,0.816,0],[0.697,0.105,0],[0.982,0.97,0],[0.105,0.697,0],[0.123,0.118,0]];',
				r * 0.17, r * 0.17, '', 'Entra Private Access', null, null, this.getTagsForStencil(gn, 'entra private access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Privileged_Identity_Management.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
				r * 0.17, r * 0.17, '', 'Entra Privileged Identity Management', null, null, this.getTagsForStencil(gn, 'entra privileged identity management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Verified_ID.svg;points=[[0.499,0,0],[0.5,0.773,0],[0.007,0.385,0],[0.99,0.5,0],[0.977,0.006,0],[0.925,0.997,0],[0.023,0.766,0],[0.018,0.009,0]];',
				r * 0.17, r * 0.1511, '', 'Entra Verified ID', null, null, this.getTagsForStencil(gn, 'entra verified id', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'External_ID.svg;points=[[0.5,0.001,0],[0.5,1,0],[0.004,0.5,0],[0.956,0.5,0],[0.977,0.957,0],[0.018,0.582,0]];',
					r * 0.17, r * 0.1698, '', 'External ID', null, null, this.getTagsForStencil(gn, 'entra external id customer identity ciam b2c', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'External_Identities.svg;points=[[0.5,0,0],[0.51,1,0],[0,0.502,0],[1,0.507,0],[0.991,0.245,0],[0.994,0.76,0],[0.006,0.76,0],[0.009,0.243,0]];',
				r * 0.1562, r * 0.17, '', 'External Identities', null, null, this.getTagsForStencil(gn, 'external identities', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Groups.svg;points=[[0.375,0.003,0],[0.5,0.994,0],[0.186,0.5,0],[0.874,0.5,0],[0.845,0.207,0],[0.982,0.823,0],[0.025,0.978,0],[0.243,0.058,0]];',
					r * 0.17, r * 0.14, '', 'Groups', null, null, this.getTagsForStencil(gn, 'groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Identity_Governance.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.499,0],[0.998,0.499,0],[0.912,0.068,0],[0.905,0.925,0],[0.065,0.912,0],[0.09,0.08,0]];',
					r * 0.16, r * 0.16, '', 'Identity Governance', null, null, this.getTagsForStencil(gn, 'identity governance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Information_Protection.svg;points=[[0.492,0,0],[0.498,1,0],[0.007,0.5,0],[0.993,0.5,0],[0.79,0.115,0],[0.99,0.985,0],[0.014,0.99,0],[0.193,0.115,0]];',
					r * 0.128, r * 0.17, '', 'Information Protection', null, null, this.getTagsForStencil(gn, 'information protection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_Identities.svg;points=[[0.5,0.01,0],[0.5,0.941,0],[0.089,0.5,0],[1,0.608,0],[0.748,0.307,0],[0.762,0.994,0],[0.003,0.613,0],[0.247,0.307,0]];',
					r * 0.17, r * 0.165, '', 'Managed Identities', null, null, this.getTagsForStencil(gn, 'managed identities', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Multi_Factor_Authentication.svg;points=[[0.463,0,0],[0.5,0.897,0],[0,0.5,0],[1,0.5,0],[0.92,0.01,0],[1,0.99,0],[0.003,0.645,0],[0.01,0.008,0]];',
				r * 0.17, r * 0.17, '', 'Multi-Factor Authentication', null, null, this.getTagsForStencil(gn, 'multi factor authentication', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'PIM.svg;points=[[0.5,0.092,0],[0.819,1,0],[0,0.482,0],[1,0.839,0],[0.722,0.105,0],[0.963,0.94,0],[0.003,0.862,0],[0.006,0.1,0]];',
				r * 0.15, r * 0.17, '', 'PIM', null, null, this.getTagsForStencil(gn, 'pim privileged identity management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Security.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.997,0.5,0],[0.997,0.13,0],[0.841,0.772,0],[0.153,0.767,0],[0.009,0.123,0]];',
					r * 0.1418, r * 0.17, '', 'Security', null, null, this.getTagsForStencil(gn, 'security', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Tenant_Properties.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.541,0],[1,0.48,0],[0.88,0.118,0],[0.885,0.843,0],[0.008,0.999,0],[0.058,0.004,0]];',
					r * 0.17, r * 0.12, '', 'Tenant Properties', null, null, this.getTagsForStencil(gn, 'tenant properties', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'User_Settings.svg;points=[[0.384,0,0],[0.381,1,0],[0.189,0.5,0],[1,0.467,0],[0.872,0.144,0],[0.735,0.985,0],[0.025,0.985,0],[0.243,0.06,0]];',
					r * 0.17, r * 0.1423, '', 'User Settings', null, null, this.getTagsForStencil(gn, 'user settings', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Users.svg;points=[[0.5,0,0],[0.499,1,0],[0.247,0.5,0],[0.739,0.5,0],[0.718,0.093,0],[0.972,0.977,0],[0.022,0.972,0],[0.293,0.083,0]];',
					r * 0.16, r * 0.175, '', 'Users', null, null, this.getTagsForStencil(gn, 'users', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Verifiable_Credentials.svg;points=[[0.5,0,0],[0.5,0.974,0],[0.005,0.486,0],[0.995,0.785,0],[0.685,0.005,0],[0.937,0.92,0],[0.01,0.957,0],[0.018,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Verifiable Credentials', null, null, this.getTagsForStencil(gn, 'verifiable credentials', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Verification_As_A_Service.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.7,0.005,0],[0.702,0.992,0],[0.013,0.995,0],[0.013,0.005,0]];',
				r * 0.17, r * 0.17, '', 'Verification As A Service', null, null, this.getTagsForStencil(gn, 'verification as service', dt).join(' '))
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
			this.createVertexTemplateEntry(s + 'AI_Gateway.svg;points=[[0.499,0,0],[0.496,1,0],[0,0.5,0],[1,0.5,0],[0.785,0.215,0],[0.785,0.785,0],[0.212,0.788,0],[0.212,0.212,0]];',
					r * 0.17, r * 0.1698, '', 'AI Gateway', null, null, this.getTagsForStencil(gn, 'ai gateway api management', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/devops/API_Connections.svg;points=[[0.5,0.007,0],[0.5,0.993,0],[0.015,0.5,0],[0.985,0.5,0],[0.897,0.341,0],[0.91,0.936,0],[0.093,0.647,0],[0.09,0.064,0]];',
					r * 0.17, r * 0.1133, '', 'API Connections', null, null, this.getTagsForStencil(gn, 'api connections application programming interface', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_API_for_FHIR.svg;points=[[0.5,0.174,0],[0.5,0.995,0],[0.035,0.5,0],[0.963,0.5,0],[0.902,0.06,0],[0.757,0.776,0],[0.245,0.781,0],[0.085,0.071,0]];',
					r * 0.17, r * 0.163, '', 'API for FHIR', null, null, this.getTagsForStencil(gn, 'api application programming interface for fhir', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'API_Management_Services.svg;points=[[0.512,0,0],[0.477,1,0],[0,0.496,0],[1,0.541,0],[0.717,0.084,0],[0.92,0.729,0],[0.09,0.712,0],[0.085,0.285,0]];',
					r * 0.1625, r * 0.15, '', 'API Management Services', null, null, this.getTagsForStencil(gn, 'api application programming interface management services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Configuration.svg;points=[[0.515,0,0],[0.303,1,0],[0.005,0.414,0],[0.995,0.453,0],[0.731,0.085,0],[0.933,0.832,0],[0.181,0.947,0],[0.072,0.255,0]];',
					r * 0.16, r * 0.17, '', 'App Configuration', null, null, this.getTagsForStencil(gn, 'app configuration application', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Data_Catalog.svg;points=[[0.398,0,0],[0.5,0.975,0],[0,0.431,0],[1,0.5,0],[0.737,0.01,0],[0.994,0.937,0],[0.003,0.792,0],[0.056,0.018,0]];',
					r * 0.15, r * 0.1675, '', 'Data Catalog', null, null, this.getTagsForStencil(gn, 'data catalog', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/databases/Data_Factory.svg;points=[[0.25,0,0],[0.5,1,0],[0,0.529,0],[1,0.5,0],[0.995,0.348,0],[0.997,0.985,0],[0.013,0.995,0],[0.013,0.058,0]];',
					r * 0.17, r * 0.17, '', 'Data Factories', null, null, this.getTagsForStencil(gn, 'data factories', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/storage/Azure_Stack_Edge.svg;points=[[0.514,0,0],[0.5,1,0],[0.018,0.5,0],[0.95,0.5,0],[0.682,0.068,0],[0.902,0.939,0],[0.118,0.939,0],[0.345,0.068,0]];',
					r * 0.17, r * 0.12, '', 'Databox Gateway', null, null, this.getTagsForStencil(gn, 'databox gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Grid_Domains.svg;points=[[0.501,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.985,0.994,0],[0.015,0.994,0],[0.013,0.009,0]];',
					r * 0.1675, r * 0.15, '', 'Event Grid Domains', null, null, this.getTagsForStencil(gn, 'event grid domains', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Grid_Subscriptions.svg;points=[[0.501,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.985,0.994,0],[0.015,0.994,0],[0.013,0.009,0]];',
					r * 0.1675, r * 0.15, '', 'Event Grid Subscriptions', null, null, this.getTagsForStencil(gn, 'event grid subscriptions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Grid_Topics.svg;points=[[0.5,0,0],[0.497,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.982,0.994,0],[0.015,0.994,0],[0.013,0.009,0]];',
					r * 0.1675, r * 0.15, '', 'Event Grid Topics', null, null, this.getTagsForStencil(gn, 'event grid topics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Integration_Accounts.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.995,0.013,0],[0.995,0.987,0],[0.013,0.995,0],[0.013,0.005,0]];',
					r * 0.16, r * 0.16, '', 'Integration Accounts', null, null, this.getTagsForStencil(gn, 'integration accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Integration_Environments.svg;points=[[0.5,0,0],[0.501,1,0],[0,0.5,0],[1,0.5,0],[0.92,0.185,0],[0.923,0.81,0],[0.082,0.817,0],[0.08,0.185,0]];',
					r * 0.1606, r * 0.17, '', 'Integration Environments', null, null, this.getTagsForStencil(gn, 'integration environments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Integration_Service_Environments.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Integration Service Environments', null, null, this.getTagsForStencil(gn, 'integration service environments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Logic_Apps.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.932,0.03,0],[0.927,0.974,0],[0.068,0.97,0],[0.068,0.03,0]];',
					r * 0.1675, r * 0.13, '', 'Logic Apps', null, null, this.getTagsForStencil(gn, 'logic apps', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/internet_of_things/Logic_Apps.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.812,0],[1,0.812,0],[0.677,0.008,0],[0.995,0.985,0],[0.01,0.992,0],[0.325,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Logic Apps', null, null, this.getTagsForStencil(gn, 'logic apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Logic_Apps_Custom_Connector.svg;points=[[0.236,0,0],[0.231,1,0],[0.201,0.5,0],[1,0.764,0],[0.392,0.008,0],[0.997,0.915,0],[0.025,0.812,0],[0.085,0.003,0]];',
					r * 0.17, r * 0.17, '', 'Logic Apps Custom Connector', null, null, this.getTagsForStencil(gn, 'logic apps custom connector', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Logic_Apps_Template.svg;points=[[0.5,0,0],[0.431,1,0],[0,0.568,0],[1,0.5,0],[0.94,0,0],[0.85,0.975,0],[0.015,0.977,0],[0.028,0.148,0]];',
					r * 0.17, r * 0.17, '', 'Logic Apps Template', null, null, this.getTagsForStencil(gn, 'logic apps template', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Partner_Namespace.svg;points=[[0.5,0,0],[0.497,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.982,0.994,0],[0.015,0.994,0],[0.015,0.006,0]];',
					r * 0.17, r * 0.152, '', 'Partner Namespace', null, null, this.getTagsForStencil(gn, 'partner namespace', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Partner_Registration.svg;points=[[0.426,0,0],[0.5,1,0],[0,0.461,0],[1,0.5,0],[0.837,0.006,0],[0.987,0.997,0],[0.013,0.914,0],[0.015,0.006,0]];',
					r * 0.17, r * 0.158, '', 'Partner Registration', null, null, this.getTagsForStencil(gn, 'partner registration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Partner_Topic.svg;points=[[0.5,0.003,0],[0.499,0.997,0],[0,0.5,0],[1,0.5,0],[0.992,0.014,0],[0.985,0.991,0],[0.013,0.991,0],[0.01,0.012,0]];',
					r * 0.17, r * 0.1525, '', 'Partner Topic', null, null, this.getTagsForStencil(gn, 'partner topic', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/analytics/Power_Platform.svg;points=[[0.61,0,0],[0.086,0.5,0],[1,0.164,0],[0.966,0.063,0],[0.814,0.552,0],[0.147,0.987,0],[0.343,0.013,0]];',
					r * 0.1623, r * 0.17, '', 'Power Platform', null, null, this.getTagsForStencil(gn, 'power platform', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_PubSub.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.499,0],[1,0.501,0],[0.975,0.013,0],[0.987,0.975,0],[0.013,0.975,0],[0.028,0.01,0]];',
					r * 0.17, r * 0.1699, '', 'PubSub', null, null, this.getTagsForStencil(gn, 'pubsub web pubsub publish subscribe websocket', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Relays.svg;points=[[0.499,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.987,0.009,0],[0.987,0.991,0],[0.015,0.994,0],[0.015,0.006,0]];',
					r * 0.1675, r * 0.15, '', 'Relays', null, null, this.getTagsForStencil(gn, 'relays', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SendGrid_Accounts.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.995,0.01,0],[0.992,0.66,0],[0.005,0.985,0],[0.339,0.013,0]];',
					r * 0.167, r * 0.17, '', 'SendGrid Accounts', null, null, this.getTagsForStencil(gn, 'sendgrid send grid accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Bus.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.98,0.003,0],[0.98,0.997,0],[0.02,0.997,0],[0.02,0.003,0]];',
					r * 0.17, r * 0.15, '', 'Service Bus', null, null, this.getTagsForStencil(gn, 'service bus', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Software_as_a_Service.svg;points=[[0.516,0,0],[0.502,1,0],[0,0.539,0],[1,0.591,0],[0.695,0.07,0],[0.915,0.797,0],[0.095,0.779,0],[0.09,0.306,0]];',
					r * 0.16, r * 0.1325, '', 'Software as a Service', null, null, this.getTagsForStencil(gn, 'software service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SQL_Data_Warehouses.svg;points=[[0.402,0,0],[0.5,0.935,0],[0.072,0.5,0],[0.997,0.5,0],[0.802,0.228,0],[0.989,0.945,0],[0.074,0.712,0],[0,0.228,0]];',
					r * 0.16, r * 0.1625, '', 'SQL Data Warehouses', null, null, this.getTagsForStencil(gn, 'sql data warehouses', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/storage/Data_Box_Edge.svg;points=[[0.546,0,0],[0.5,0.923,0],[0.058,0.5,0],[0.975,0.5,0],[0.715,0.074,0],[0.915,0.867,0],[0.09,0.951,0],[0.38,0.07,0]];',
					r * 0.17, r * 0.1218, '', 'Stack Edge', null, null, this.getTagsForStencil(gn, 'stack edge', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/storage/StorSimple_Device_Managers.svg;points=[[0.514,0,0],[0.631,1,0],[0,0.486,0],[1,0.531,0],[0.702,0.069,0],[0.74,1,0],[0.1,0.707,0],[0.09,0.276,0]];',
					r * 0.175, r * 0.16, '', 'StorSimple Device Managers', null, null, this.getTagsForStencil(gn, 'storsimple device managers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'System_Topic.svg;points=[[0.5,0,0],[0.499,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.982,0.006,0],[0.977,0.997,0],[0.02,0.997,0],[0.018,0.006,0]];',
					r * 0.17, r * 0.15, '', 'System Topic', null, null, this.getTagsForStencil(gn, 'system topic', dt).join(' '))
		];
			
		this.addPalette('azure2Integration', 'Azure / Integration', false, mxUtils.bind(this, function(content)
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
			this.createVertexTemplateEntry(s + 'Azure_AD_Roles_and_Administrators.svg;points=[[0.439,0,0],[0.5,0.963,0],[0.186,0.5,0],[1,0.75,0],[0.605,0.063,0],[1,0.877,0],[0.025,0.942,0],[0.25,0.085,0]];',
					r * 0.16, r * 0.16, '', 'AD Roles and Administrators', null, null, this.getTagsForStencil(gn, 'ad roles administrators', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Client_Apps.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.99,0.013,0],[0.995,0.982,0],[0.013,0.99,0],[0.018,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Client Apps', null, null, this.getTagsForStencil(gn, 'client apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Compliance.svg;points=[[0.5,0,0],[0.507,1,0],[0.003,0.499,0],[0.997,0.779,0],[0.654,0.013,0],[0.997,0.992,0],[0.009,0.99,0],[0.006,0.013,0]];',
					r * 0.155, r * 0.17, '', 'Device Compliance', null, null, this.getTagsForStencil(gn, 'device compliance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Configuration.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.734,0],[0.649,0.008,0],[0.945,0.91,0],[0.006,0.99,0],[0.003,0.013,0]];',
					r * 0.155, r * 0.17, '', 'Device Configuration', null, null, this.getTagsForStencil(gn, 'device configuration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Enrollment.svg;points=[[0.463,0,0],[0.5,0.927,0],[0,0.5,0],[1,0.597,0],[0.92,0.012,0],[0.995,0.997,0],[0.015,0.74,0],[0.01,0.009,0]];',
					r * 0.17, r * 0.151, '', 'Device Enrollment', null, null, this.getTagsForStencil(gn, 'device enrollment', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Security_Apple.svg;points=[[0.5,0.055,0],[0.5,0.998,0],[0.023,0.5,0],[1,0.5,0],[0.698,0.11,0],[1,0.985,0],[0.32,0.987,0],[0,0.113,0]];',
					r * 0.17, r * 0.1725, '', 'Device Security Apple', null, null, this.getTagsForStencil(gn, 'device security apple', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Security_Google.svg;points=[[0.5,0.055,0],[0.5,0.998,0],[0.023,0.5,0],[1,0.5,0],[0.698,0.11,0],[1,0.985,0],[0.32,0.987,0],[0,0.113,0]];',
					r * 0.17, r * 0.1725, '', 'Device Security Google', null, null, this.getTagsForStencil(gn, 'device security google', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Security_Windows.svg;points=[[0.5,0.05,0],[0.5,1,0],[0.025,0.5,0],[0.998,0.5,0],[0.692,0.103,0],[0.992,0.995,0],[0.32,0.99,0],[0.01,0.103,0]];',
					r * 0.17, r * 0.17, '', 'Device Security Windows', null, null, this.getTagsForStencil(gn, 'device security windows', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Devices.svg;points=[[0.463,0,0],[0.785,1,0],[0,0.5,0],[1,0.596,0],[0.912,0.006,0],[0.99,1,0],[0.018,0.742,0],[0.018,0.003,0]];',
					r * 0.17, r * 0.15, '', 'Devices', null, null, this.getTagsForStencil(gn, 'devices', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'eBooks.svg;points=[[0.5,0.072,0],[0.5,0.997,0],[0,0.561,0],[1,0.561,0],[0.887,0.006,0],[0.99,0.983,0],[0.013,0.985,0],[0.11,0.006,0]];',
					r * 0.17, r * 0.15, '', 'eBooks', null, null, this.getTagsForStencil(gn, 'ebooks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Engage_Center_Connect.svg;points=[[0.364,0.003,0],[0.5,1,0],[0.184,0.5,0],[0.968,0.5,0],[0.902,0.076,0],[0.955,0.827,0],[0.023,0.984,0],[0.238,0.057,0]];',
					r * 0.17, r * 0.1351, '', 'Engage Center Connect', null, null, this.getTagsForStencil(gn, 'engage center connect services hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Exchange_Access.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0,0.5,0],[1,0.5,0],[0.993,0.13,0],[0.854,0.757,0],[0.152,0.765,0],[0.007,0.13,0]];',
					r * 0.14, r * 0.17, '', 'Exchange Access', null, null, this.getTagsForStencil(gn, 'exchange access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Intune.svg;points=[[0.445,0,0],[0.5,0.901,0],[0,0.5,0],[1,0.5,0],[0.875,0.003,0],[0.992,0.997,0],[0.22,0.901,0],[0.01,0.006,0]];',
					r * 0.17, r * 0.155, '', 'Intune', null, null, this.getTagsForStencil(gn, 'intune', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Intune_For_Education.svg;points=[[0.445,0,0],[0.5,0.901,0],[0,0.5,0],[1,0.5,0],[0.875,0.003,0],[0.992,0.997,0],[0.22,0.901,0],[0.01,0.006,0]];',
					r * 0.17, r * 0.155, '', 'Intune for Education', null, null, this.getTagsForStencil(gn, 'intune for education', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Mindaro.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.593,0],[1,0.58,0],[0.734,0.135,0],[1,0.865,0],[0,0.865,0],[0.264,0.135,0]];',
					r * 0.168, r * 0.17, '', 'Mindaro', null, null, this.getTagsForStencil(gn, 'mindaro', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Security_Baselines.svg;points=[[0.5,0.05,0],[0.5,1,0],[0.025,0.5,0],[0.998,0.5,0],[0.692,0.103,0],[0.992,0.995,0],[0.32,0.99,0],[0.01,0.103,0]];',
					r * 0.17, r * 0.17, '', 'Security Baselines', null, null, this.getTagsForStencil(gn, 'security baselines', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Software_Updates.svg;points=[[0.5,0.003,0],[0.715,0.997,0],[0,0.408,0],[1,0.408,0],[0.992,0.015,0],[0.865,0.937,0],[0.015,0.807,0],[0.008,0.015,0]];',
					r * 0.17, r * 0.15, '', 'Software Updates', null, null, this.getTagsForStencil(gn, 'software updates', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Tenant_Status.svg;points=[[0.447,0,0],[0.5,0.927,0],[0.17,0.499,0],[1,0.741,0],[0.641,0.085,0],[0.922,0.887,0],[0.016,0.9,0],[0.258,0.08,0]];',
					r * 0.16, r * 0.17, '', 'Tenant Status', null, null, this.getTagsForStencil(gn, 'tenant status', dt).join(' '))
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
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/databases/Azure_Cosmos_DB.svg;points=[[0.144,0.003,0],[0.889,0.998,0],[0.09,0.5,0],[0.879,0.5,0],[0.967,0.175,0],[1,0.892,0],[0.023,0.78,0],[0.008,0.133,0]];',
					r * 0.17, r * 0.17, '', 'Cosmos DB', null, null, this.getTagsForStencil(gn, 'cosmos', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/storage/Azure_Stack_Edge.svg;points=[[0.514,0,0],[0.5,1,0],[0.018,0.5,0],[0.95,0.5,0],[0.682,0.068,0],[0.902,0.939,0],[0.118,0.939,0],[0.345,0.068,0]];',
					r * 0.17, r * 0.12, '', 'Databox Gateway', null, null, this.getTagsForStencil(gn, 'databox gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Provisioning_Services.svg;points=[[0.499,0,0],[0.501,1,0],[0,0.484,0],[1,0.486,0],[0.92,0.15,0],[0.878,0.805,0],[0.142,0.825,0],[0.088,0.158,0]];',
					r * 0.16, r * 0.165, '', 'Device Provisioning Services', null, null, this.getTagsForStencil(gn, 'device provisioning services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Digital_Twins.svg;points=[[0.44,0,0],[0.5,0.945,0],[0.005,0.479,0],[0.99,0.5,0],[0.825,0.2,0],[0.967,0.842,0],[0.053,0.755,0],[0.048,0.208,0]];',
					r * 0.17, r * 0.17, '', 'Digital Twins', null, null, this.getTagsForStencil(gn, 'digital twins', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/integration/Event_Grid_Domains.svg;points=[[0.501,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.985,0.994,0],[0.015,0.994,0],[0.013,0.009,0]];',
					r * 0.1675, r * 0.15, '', 'Event Grid Subscriptions', null, null, this.getTagsForStencil(gn, 'event grid subscriptions', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/analytics/Event_Hub_Clusters.svg;points=[[0.5,0.006,0],[0.5,0.997,0],[0.001,0.5,0],[0.999,0.5,0],[0.744,0.251,0],[0.992,0.996,0],[0.254,0.792,0],[0.013,0,0]];',
					r * 0.17, r * 0.1381, '', 'Event Hub Clusters', null, null, this.getTagsForStencil(gn, 'event hub clusters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Event_Hubs.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.985,0.006,0],[0.985,0.994,0],[0.015,0.994,0],[0.015,0.006,0]];',
					r * 0.1675, r * 0.15, '', 'Event Hubs', null, null, this.getTagsForStencil(gn, 'event hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Function_Apps.svg;points=[[0.5,0.003,0],[0.5,0.754,0],[0.005,0.499,0],[0.995,0.499,0],[0.752,0,0],[0.742,0.798,0],[0.278,1,0],[0.253,0.202,0]];',
					r * 0.17, r * 0.15, '', 'Function Apps', null, null, this.getTagsForStencil(gn, 'function apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Hybrid_Connectivity_Hub.svg;points=[[0.5,0,0],[0.471,1,0],[0,0.5,0],[1,0.858,0],[0.97,0.947,0],[0.013,0.965,0],[0.023,0.023,0]];',
					r * 0.17, r * 0.17, '', 'Hybrid Connectivity Hub', null, null, this.getTagsForStencil(gn, 'hybrid connectivity hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Industrial_IoT.svg;points=[[0.5,0,0],[0.501,1,0],[0.04,0.5,0],[0.96,0.5,0],[0.983,0.218,0],[0.951,0.727,0],[0.049,0.727,0],[0.019,0.21,0]];',
					r * 0.157, r * 0.17, '', 'Industrial IoT', null, null, this.getTagsForStencil(gn, 'industrial', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IoT_Central_Applications.svg;points=[[0.5,0,0],[0.5,1,0],[0.157,0.5,0],[1,0.5,0],[1,0.248,0],[1,0.752,0],[0,0.747,0],[0,0.248,0]];',
					r * 0.15, r * 0.1725, '', 'IoT Central Applications', null, null, this.getTagsForStencil(gn, 'central applications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IoT_Edge.svg;points=[[0.514,0.005,0],[0.499,0.995,0],[0,0.453,0],[1,0.494,0],[0.717,0.08,0],[0.95,0.632,0],[0.4,0.98,0],[0.093,0.255,0]];',
					r * 0.17, r * 0.17, '', 'IoT Edge', null, null, this.getTagsForStencil(gn, 'edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IoT_Hub.svg;points=[[0.5,0.1,0],[0.154,1,0],[0.083,0.5,0],[0.755,0.5,0],[0.985,0.01,0],[0.9,0.877,0],[0.005,0.98,0],[0.36,0.075,0]];',
					r * 0.16, r * 0.16, '', 'IoT Hub', null, null, this.getTagsForStencil(gn, 'hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_IoT_Operations.svg;points=[[0.5,0.095,0],[0.586,1,0],[0.007,0.5,0],[0.921,0.5,0],[0.96,0.27,0],[0.957,0.799,0],[0.218,0.804,0],[0.03,0.167,0]];',
					r * 0.17, r * 0.1606, '', 'IoT Operations', null, null, this.getTagsForStencil(gn, 'operations', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/internet_of_things/Logic_Apps.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.812,0],[1,0.812,0],[0.677,0.008,0],[0.995,0.985,0],[0.01,0.992,0],[0.325,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Logic Apps', null, null, this.getTagsForStencil(gn, 'logic apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Logic_Apps.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.932,0.03,0],[0.927,0.974,0],[0.068,0.97,0],[0.068,0.03,0]];',
					r * 0.1675, r * 0.13, '', 'Logic Apps', null, null, this.getTagsForStencil(gn, 'logic apps', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/ai_machine_learning/Machine_Learning_Studio_Classic_Web_Services.svg;points=[[0.5,0.025,0],[0.5,1,0],[0.209,0.5,0],[0.973,0.5,0],[0.9,0.113,0],[0.625,0.992,0],[0.005,0.99,0],[0.39,0.088,0]];',
					r * 0.17, r * 0.17, '', 'Machine Learning Studio - Classic Web Services', null, null, this.getTagsForStencil(gn, 'studio classic web services', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/ai_machine_learning/Machine_Learning_Studio_Web_Service_Plans.svg;points=[[0.549,0.003,0],[0.5,0.998,0],[0.096,0.5,0],[1,0.48,0],[0.842,0.108,0],[0.62,0.987,0],[0.008,0.992,0],[0.253,0.11,0]];',
					r * 0.17, r * 0.17, '', 'Machine Learning Studio - Web Service Plans', null, null, this.getTagsForStencil(gn, 'studio web service plans', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/ai_machine_learning/Machine_Learning_Studio_Workspaces.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0.204,0.5,0],[1,0.5,0],[0.995,0.013,0],[0.615,0.99,0],[0.005,0.985,0],[0.303,0.013,0]];',
					r * 0.17, r * 0.17, '', 'Machine Learning Studio - Workspaces', null, null, this.getTagsForStencil(gn, 'studio workspaces', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Maps_Accounts.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Maps Accounts', null, null, this.getTagsForStencil(gn, 'maps accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Notification_Hubs.svg;points=[[0.5,0,0],[0.675,1,0],[0,0.424,0],[1,0.424,0],[0.992,0.012,0],[0.992,0.835,0],[0.015,0.844,0],[0.008,0.012,0]];',
					r * 0.1675, r * 0.14, '', 'Notification Hubs', null, null, this.getTagsForStencil(gn, 'notification hubs', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/azure_stack/Azure_Stack.svg;points=[[0.5,0,0],[0.539,1,0],[0.108,0.5,0],[1,0.497,0],[0.992,0.01,0],[0.997,0.977,0],[0.047,0.78,0],[0.402,0.018,0]];',
					r * 0.1647, r * 0.17, '', 'Stack', null, null, this.getTagsForStencil(gn, 'stack', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/iot/Azure_Stack_HCI_Sizer.svg;points=[[0.5,0.102,0],[0.5,1,0],[0,0.414,0],[1,0.907,0],[0.435,0.035,0],[1,0.995,0],[0.005,0.82,0],[0.013,0.003,0]];',
					r * 0.17, r * 0.17, '', 'Stack HCI Sizer', null, null, this.getTagsForStencil(gn, 'stack hci sizer', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/iot/Stack_HCI_Premium.svg;points=[[0.545,0.06,0],[0.5,0.874,0],[0,0.593,0],[1,0.465,0],[0.992,0.068,0],[0.995,0.86,0],[0.058,0.932,0],[0.103,0.065,0]];',
					r * 0.17, r * 0.17, '', 'Stack HCI Premium', null, null, this.getTagsForStencil(gn, 'stack hci premium', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Stream_Analytics_Jobs.svg;points=[[0.576,0,0],[0.581,1,0],[0.069,0.5,0],[1,0.488,0],[0.852,0.085,0],[0.857,0.891,0],[0.03,0.651,0],[0.29,0.1,0]];',
					r * 0.17, r * 0.145, '', 'Stream Analytics Jobs', null, null, this.getTagsForStencil(gn, 'stream analytics jobs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Time_Series_Data_Sets.svg;points=[[0.5,0,0],[0.507,1,0],[0,0.5,0],[1,0.5,0],[0.98,0.095,0],[0.98,0.905,0],[0.014,0.897,0],[0.02,0.095,0]];',
					r * 0.128, r * 0.17, '', 'Time Series Data Sets', null, null, this.getTagsForStencil(gn, 'time series data sets', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/internet_of_things/Time_Series_Insights_Access_Policies.svg;points=[[0.5,0.003,0],[0.506,0.998,0],[0.222,0.5,0],[0.783,0.5,0],[0.971,0.25,0],[0.655,0.907,0],[0.345,0.907,0],[0.029,0.25,0]];',
					r * 0.105, r * 0.17, '', 'Time Series Insights Access Policies', null, null, this.getTagsForStencil(gn, 'time series insights access policies', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Time_Series_Insights_Environments.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.504,0],[0.997,0.504,0],[0.87,0.155,0],[0.868,0.847,0],[0.13,0.845,0],[0.127,0.158,0]];',
					r * 0.1675, r * 0.17, '', 'Time Series Insights Environments', null, null, this.getTagsForStencil(gn, 'time series insights environments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Time_Series_Insights_Event_Sources.svg;points=[[0.5,0.003,0],[0.497,0.998,0],[0,0.5,0],[0.924,0.5,0],[0.995,0.013,0],[0.992,0.985,0],[0.008,0.99,0],[0.005,0.013,0]];',
					r * 0.1675, r * 0.17, '', 'Time Series Insights Event Sources', null, null, this.getTagsForStencil(gn, 'time series insights event sources', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Windows10_Core_Services.svg;points=[[0.484,0.005,0],[0.509,0.995,0],[0,0.505,0],[1,0.512,0],[0.837,0.02,0],[0.877,0.832,0],[0.113,0.817,0],[0.173,0.118,0]];',
					r * 0.17, r * 0.17, '', 'Windows10 Core Services', null, null, this.getTagsForStencil(gn, 'windows10 core services', dt).join(' '))
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
			this.createVertexTemplateEntry(s + 'Activity_Log.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.988,0.083,0],[0.991,0.922,0],[0.009,0.922,0],[0.012,0.083,0]];',
					r * 0.14, r * 0.1675, '', 'Activity Log', null, null, this.getTagsForStencil(gn, 'activity log', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Advisor.svg;points=[[0.514,0.003,0],[0.5,0.929,0],[0,0.474,0],[1,0.517,0],[0.705,0.073,0],[0.71,0.992,0],[0.095,0.683,0],[0.1,0.261,0]];',
					r * 0.165, r * 0.16, '', 'Advisor', null, null, this.getTagsForStencil(gn, 'advisor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Alerts.svg;points=[[0.5,0,0],[0.674,1,0],[0,0.424,0],[1,0.424,0],[0.99,0.009,0],[0.985,0.841,0],[0.015,0.844,0],[0.01,0.009,0]];',
					r * 0.1675, r * 0.14, '', 'Alerts', null, null, this.getTagsForStencil(gn, 'alerts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Application_Insights.svg;points=[[0.5,0,0],[0.5,1,0],[0.061,0.5,0],[0.939,0.5,0],[0.91,0.145,0],[0.67,0.945,0],[0.327,0.942,0],[0.09,0.145,0]];',
					r * 0.11, r * 0.1575, '', 'Application Insights', null, null, this.getTagsForStencil(gn, 'application insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Arc.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.997,0.15,0],[1,0.847,0],[0,0.847,0],[0,0.153,0]];',
					r * 0.1725, r * 0.13, '', 'Arc', null, null, this.getTagsForStencil(gn, 'arc', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Arc_Machines.svg;points=[[0.5,0,0],[0.487,1,0],[0,0.791,0],[1,0.784,0],[0.75,0.01,0],[0.976,0.885,0],[0.019,0.887,0],[0.25,0.01,0]];',
					r * 0.1619, r * 0.17, '', 'Arc Machines', null, null, this.getTagsForStencil(gn, 'arc machines', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Automation_Accounts.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.877,0.168,0],[0.812,0.887,0],[0.268,0.982,0],[0.173,0.118,0]];',
					r * 0.17, r * 0.17, '', 'Automation Accounts', null, null, this.getTagsForStencil(gn, 'automation accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Blueprints.svg;points=[[0.5,0.091,0],[0.5,0.77,0],[0,0.5,0],[1,0.536,0],[0.952,0.125,0],[0.952,0.979,0],[0.05,0.738,0],[0.025,0.036,0]];',
					r * 0.1625, r * 0.16, '', 'Blueprints', null, null, this.getTagsForStencil(gn, 'blueprints', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Compliance.svg;points=[[0.5,0.003,0],[0.5,0.998,0],[0,0.5,0],[1,0.5,0],[0.996,0.333,0],[0.993,0.985,0],[0.007,0.985,0],[0.007,0.015,0]];',
					r * 0.13, r * 0.16, '', 'Compliance', null, null, this.getTagsForStencil(gn, 'compliance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Management_and_Billing.svg;points=[[0.472,0,0],[0.468,1,0],[0,0.53,0],[1,0.532,0],[0.825,0.145,0],[0.822,0.847,0],[0.118,0.842,0],[0.143,0.19,0]];',
					r * 0.17, r * 0.17, '', 'Cost Management and Billing', null, null, this.getTagsForStencil(gn, 'cost management billing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Customer_Lockbox_for_MS_Azure.svg;points=[[0.434,0,0],[0.5,0.972,0],[0.194,0.5,0],[0.998,0.877,0],[0.605,0.069,0],[0.982,0.997,0],[0.033,0.956,0],[0.263,0.069,0]];',
					r * 0.17, r * 0.166, '', 'Customer Lockbox for MS Azure', null, null, this.getTagsForStencil(gn, 'customer lockbox for ms azure', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Diagnostics_Settings.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[1,0.093,0],[0.994,0.92,0],[0.006,0.92,0],[0,0.093,0]];',
					r * 0.14, r * 0.1675, '', 'Diagnostics Settings', null, null, this.getTagsForStencil(gn, 'diagnostics settings', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Education.svg;points=[[0.489,0,0],[0.507,1,0],[0.201,0.5,0],[0.846,0.5,0],[0.985,0.3,0],[0.772,0.919,0],[0.235,0.912,0],[0.01,0.307,0]];',
					r * 0.1675, r * 0.13, '', 'Education', null, null, this.getTagsForStencil(gn, 'education', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/other/Intune_Trends.svg;points=[[0.391,0.168,0],[0.5,1,0],[0.011,0.5,0],[1,0.497,0],[1,0.005,0],[1,0.99,0],[0.003,0.995,0]];',
					r * 0.142, r * 0.17, '', 'Intune Trends', null, null, this.getTagsForStencil(gn, 'intune trends', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Landing_Zone.svg;points=[[0.516,0,0],[0.5,1,0],[0,0.454,0],[1,0.5,0],[0.738,0.1,0],[0.836,1,0],[0.169,1,0],[0.058,0.29,0]];',
					r * 0.1693, r * 0.17, '', 'Landing Zone', null, null, this.getTagsForStencil(gn, 'landing zone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Lighthouse.svg;points=[[0.496,0,0],[0.5,1,0],[0.21,0.5,0],[0.796,0.5,0],[0.775,0.14,0],[0.997,0.985,0],[0.003,0.985,0],[0.219,0.138,0]];',
					r * 0.1475, r * 0.17, '', 'Lighthouse', null, null, this.getTagsForStencil(gn, 'lighthouse', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Log_Analytics_Workspaces.svg;points=[[0.5,0.03,0],[0.5,1,0],[0,0.5,0],[0.97,0.5,0],[0.88,0.083,0],[0.005,0.985,0]];',
					r * 0.16, r * 0.16, '', 'Log Analytics Workspaces', null, null, this.getTagsForStencil(gn, 'log analytics workspaces', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'MachinesAzureArc.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.992,0.015,0],[0.992,0.985,0],[0.008,0.985,0],[0.008,0.015,0]];',
					r * 0.11, r * 0.17, '', 'MachinesAzureArc', null, null, this.getTagsForStencil(gn, 'machines arc', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_Applications_Center.svg;points=[[0.5,0.003,0],[0.5,0.893,0],[0,0.818,0],[0.917,0.5,0],[0.955,0.136,0],[0.837,0.713,0],[0.045,0.943,0],[0.178,0.214,0]];',
					r * 0.17, r * 0.135, '', 'Managed Applications Center', null, null, this.getTagsForStencil(gn, 'managed applications center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_Desktop.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.987,0.008,0],[0.75,0.997,0],[0.25,0.997,0],[0.013,0.008,0]];',
					r * 0.17, r * 0.158, '', 'Managed Desktop', null, null, this.getTagsForStencil(gn, 'managed desktop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Metrics.svg;points=[[0.5,1,0],[0.003,0.571,0],[0.979,0.5,0],[0.975,0.035,0],[0.975,0.992,0],[0.025,0.99,0],[0.266,0.223,0]];',
					r * 0.15, r * 0.1625, '', 'Metrics', null, null, this.getTagsForStencil(gn, 'metrics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Monitor.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.87,0.163,0],[0.837,0.87,0],[0.163,0.87,0],[0.153,0.14,0]];',
					r * 0.16, r * 0.16, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'My_Customers.svg;points=[[0.375,0,0],[0.5,0.997,0],[0.189,0.5,0],[0.871,0.5,0],[0.835,0.197,0],[0.985,0.821,0],[0.03,0.984,0],[0.243,0.056,0]];',
					r * 0.1725, r * 0.14, '', 'My Customers', null, null, this.getTagsForStencil(gn, 'my customers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Operation_Log_Classic.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.988,0.083,0],[0.991,0.922,0],[0.009,0.922,0],[0.012,0.083,0]];',
					r * 0.14, r * 0.1675, '', 'Operation Log (Classic)', null, null, this.getTagsForStencil(gn, 'operation log classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Policy.svg;points=[[0.459,0.003,0],[0.465,0.998,0],[0,0.499,0],[1,0.499,0],[0.986,0.208,0],[0.984,0.79,0],[0,0.75,0],[0,0.248,0]];',
					r * 0.15, r * 0.16, '', 'Policy', null, null, this.getTagsForStencil(gn, 'policy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Recovery_Services_Vaults.svg;points=[[0.5,0.043,0],[0.405,1,0],[0,0.763,0],[1,0.432,0],[0.775,0.058,0],[0.72,0.954,0],[0.078,0.945,0],[0.305,0.225,0]];',
					r * 0.1725, r * 0.15, '', 'Recovery Services Vaults', null, null, this.getTagsForStencil(gn, 'recovery services vaults', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Graph_Explorer.svg;points=[[0.838,0,0],[0.499,0.901,0],[0,0.185,0],[0.998,0.166,0],[0.952,0.048,0],[0.802,0.952,0],[0.045,0.084,0]];',
					r * 0.1675, r * 0.16, '', 'Resource Graph Explorer', null, null, this.getTagsForStencil(gn, 'resource graph explorer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resources_Provider.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.971,0.233,0],[0.977,0.762,0],[0.023,0.762,0],[0.023,0.238,0]];',
					r * 0.1511, r * 0.17, '', 'Resources Provider', null, null, this.getTagsForStencil(gn, 'resources provider', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Scheduler_Job_Collections.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.499,0],[0.997,0.112,0],[0.995,0.888,0],[0.005,0.888,0],[0.005,0.112,0]];',
					r * 0.17, r * 0.16, '', 'Scheduler Job Collections', null, null, this.getTagsForStencil(gn, 'scheduler job collections', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Catalog_MAD.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0,0.5,0],[1,0.5,0],[0.987,0.085,0],[0.99,0.922,0],[0.01,0.922,0],[0.013,0.085,0]];',
					r * 0.14, r * 0.17, '', 'Service Catalog MAD', null, null, this.getTagsForStencil(gn, 'service catalog mad', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Group_Relationships.svg;points=[[0.753,0,0],[0.254,1,0],[0,0.75,0],[1,0.25,0],[0.98,0.113,0],[0.801,0.81,0],[0.02,0.887,0],[0.023,0.61,0]];',
					r * 0.1537, r * 0.17, '', 'Service Group Relationships', null, null, this.getTagsForStencil(gn, 'service group relationships', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Providers.svg;points=[[0.418,0.003,0],[0.5,0.895,0],[0.134,0.5,0],[1,0.779,0],[0.6,0.085,0],[0.994,0.992,0],[0.011,0.862,0],[0.235,0.085,0]];',
					r * 0.165, r * 0.17, '', 'Service Providers', null, null, this.getTagsForStencil(gn, 'service providers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'solutions.svg;points=[[0.5,0.03,0],[0.416,1,0],[0,0.5,0],[0.968,0.5,0],[0.89,0.093,0],[0.552,0.985,0],[0.013,0.99,0]];',
					r * 0.16, r * 0.16, '', 'Solutions', null, null, this.getTagsForStencil(gn, 'solutions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Universal_Print.svg;points=[[0.512,0,0],[0.5,1,0],[0,0.525,0],[1,0.5,0],[0.877,0.191,0],[1,0.9,0],[0.095,0.759,0],[0.098,0.291,0]];',
					r * 0.17, r * 0.145, '', 'Universal Print', null, null, this.getTagsForStencil(gn, 'universal print', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'User_Privacy.svg;points=[[0.445,0,0],[0.5,0.915,0],[0.161,0.5,0],[1,0.69,0],[0.638,0.083,0],[0.915,0.905,0],[0.014,0.885,0],[0.256,0.08,0]];',
					r * 0.16, r * 0.17, '', 'User Privacy', null, null, this.getTagsForStencil(gn, 'user privacy', dt).join(' '))
		];
			
		this.addPalette('azure2Management Governance', 'Azure / Management and Governance', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2MenuPalette = function(gn, r, sb, s)
	{
		var dt = 'azure menu ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Keys.svg;points=[[0.525,0,0],[0.431,1,0],[0,0.422,0],[1,0.461,0],[0.744,0.1,0],[0.957,0.777,0],[0.343,0.992,0],[0.059,0.27,0]];',
					r * 0.16, r * 0.17, '', 'Keys', null, null, this.getTagsForStencil(gn, 'keys', dt).join(' '))
		];
			
		this.addPalette('azure2Menu', 'Azure / Menu', false, mxUtils.bind(this, function(content)
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
			this.createVertexTemplateEntry(s + 'Cost_Management_and_Billing.svg;points=[[0.474,0,0],[0.47,1,0],[0,0.53,0],[1,0.531,0],[0.82,0.14,0],[0.825,0.845,0],[0.133,0.86,0],[0.15,0.183,0]];',
					r * 0.17, r * 0.17, '', 'Cost Management and Billing', null, null, this.getTagsForStencil(gn, 'cost management billing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Box.svg;points=[[0.514,0,0],[0.526,1,0],[0,0.465,0],[1,0.508,0],[0.717,0.079,0],[0.922,0.684,0],[0.098,0.681,0],[0.095,0.251,0]];',
					r * 0.1775, r * 0.17, '', 'Data Box', null, null, this.getTagsForStencil(gn, 'data box', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Box_Edge.svg;points=[[0.546,0,0],[0.5,0.923,0],[0.058,0.5,0],[0.975,0.5,0],[0.715,0.074,0],[0.915,0.867,0],[0.09,0.951,0],[0.38,0.07,0]];',
					r * 0.1675, r * 0.12, '', 'Data Box Edge', null, null, this.getTagsForStencil(gn, 'data box edge', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/databases/Azure_Database_Migration_Services.svg;points=[[0.515,0,0],[0.507,1,0],[0,0.415,0],[1,0.453,0],[0.738,0.09,0],[0.762,0.94,0],[0.243,0.94,0],[0.062,0.26,0]];',
					r * 0.16, r * 0.1725, '', 'Database Migration Services', null, null, this.getTagsForStencil(gn, 'migration services', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/storage/Azure_Stack_Edge.svg;points=[[0.514,0,0],[0.5,1,0],[0.018,0.5,0],[0.95,0.5,0],[0.682,0.068,0],[0.902,0.939,0],[0.118,0.939,0],[0.345,0.068,0]];',
					r * 0.17, r * 0.12, '', 'Databox Gateway', null, null, this.getTagsForStencil(gn, 'databox gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Migrate.svg;points=[[0.608,0,0],[0.432,1,0],[0.025,0.5,0],[0.973,0.5,0],[0.735,0.054,0],[0.917,0.885,0],[0.108,0.946,0],[0.303,0.095,0]];',
					r * 0.18, r * 0.11, '', 'Migrate', null, null, this.getTagsForStencil(gn, 'migrate', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Recovery_Services_Vaults.svg;points=[[0.5,0.043,0],[0.405,1,0],[0,0.763,0],[1,0.432,0],[0.775,0.058,0],[0.72,0.954,0],[0.078,0.945,0],[0.305,0.225,0]];',
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
			this.createVertexTemplateEntry(s + 'Remote_Rendering.svg;points=[[0.514,0,0],[0.506,1,0],[0.02,0.5,0],[0.95,0.5,0],[0.682,0.068,0],[0.902,0.939,0],[0.12,0.936,0],[0.345,0.068,0]];',
					r * 0.17, r * 0.12, '', 'Remote Rendering', null, null, this.getTagsForStencil(gn, 'remote rendering', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Spatial_Anchor_Accounts.svg;points=[[0.453,0.247,0],[0.453,1,0],[0.185,0.5,0],[0.891,0.5,0],[0.946,0.063,0],[0.911,0.71,0],[0.018,0.672,0],[0.021,0.553,0]];',
					r * 0.167, r * 0.17, '', 'Spatial Anchor Accounts', null, null, this.getTagsForStencil(gn, 'spatial anchor accounts', dt).join(' '))
		];
			
		this.addPalette('azure2Mixed Reality', 'Azure / Mixed Reality', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2MobilePalette = function(gn, r, sb, s)
	{
		var dt = 'azure mobile ';
		
		var fns =
		[
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/App_Services.svg;points=[[0.497,0,0],[0.504,1,0],[0,0.499,0],[1,0.5,0],[0.865,0.153,0],[0.875,0.835,0],[0.125,0.835,0],[0.133,0.155,0]];',
					r * 0.16, r * 0.16, '', 'App Services', null, null, this.getTagsForStencil(gn, 'app services', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/Notification_Hubs.svg;points=[[0.5,0,0],[0.675,1,0],[0,0.424,0],[1,0.424,0],[0.992,0.012,0],[0.992,0.835,0],[0.015,0.844,0],[0.008,0.012,0]];',
					r * 0.1675, r * 0.14, '', 'Notification Hubs', null, null, this.getTagsForStencil(gn, 'notification hubs', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/analytics/Power_Platform.svg;points=[[0.61,0,0],[0.086,0.5,0],[1,0.164,0],[0.966,0.063,0],[0.814,0.552,0],[0.147,0.987,0],[0.343,0.013,0]];',
					r * 0.1623, r * 0.17, '', 'Power Platform', null, null, this.getTagsForStencil(gn, 'power platform', dt).join(' '))
		];
			
		this.addPalette('azure2Mobile', 'Azure / Mobile', false, mxUtils.bind(this, function(content)
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
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/management_governance/Activity_Log.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.988,0.083,0],[0.991,0.922,0],[0.009,0.922,0],[0.012,0.083,0]];',
					r * 0.14, r * 0.1675, '', 'Activity Log', null, null, this.getTagsForStencil(gn, 'activity log', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/devops/Application_Insights.svg;points=[[0.5,0,0],[0.5,1,0],[0.061,0.5,0],[0.939,0.5,0],[0.91,0.145,0],[0.67,0.945,0],[0.327,0.942,0],[0.09,0.145,0]];',
					r * 0.11, r * 0.1575, '', 'Application Insights', null, null, this.getTagsForStencil(gn, 'application insights', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/devops/Change_Analysis.svg;points=[[0.616,0,0],[0.5,0.808,0],[0,0.899,0],[1,0.573,0],[0.79,0.063,0],[0.69,0.944,0],[0.04,0.982,0],[0.438,0.068,0]];',
					r * 0.17, r * 0.1692, '', 'Change Analysis', null, null, this.getTagsForStencil(gn, 'change analysis', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/management_governance/Diagnostics_Settings.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[1,0.093,0],[0.994,0.92,0],[0.006,0.92,0],[0,0.093,0]];',
					r * 0.14, r * 0.1675, '', 'Diagnostics Settings', null, null, this.getTagsForStencil(gn, 'diagnostics settings', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/analytics/Log_Analytics_Workspaces.svg;points=[[0.5,0.03,0],[0.5,1,0],[0,0.5,0],[0.97,0.5,0],[0.88,0.083,0],[0.005,0.985,0]];',
					r * 0.16, r * 0.16, '', 'Log Analytics Workspaces', null, null, this.getTagsForStencil(gn, 'log analytics workspaces', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/management_governance/Metrics.svg;points=[[0.5,1,0],[0.003,0.571,0],[0.979,0.5,0],[0.975,0.035,0],[0.975,0.992,0],[0.025,0.99,0],[0.266,0.223,0]];',
					r * 0.16, r * 0.17, '', 'Metrics Advisor', null, null, this.getTagsForStencil(gn, 'metrics advisor', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/management_governance/Monitor.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.87,0.163,0],[0.837,0.87,0],[0.163,0.87,0],[0.153,0.14,0]];',
					r * 0.16, r * 0.16, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/networking/Network_Watcher.svg;points=[[0.5,0.025,0],[0.5,0.796,0],[0.136,0.5,0],[0.97,0.5,0],[0.89,0.1,0],[0.897,0.615,0],[0.01,0.985,0],[0.395,0.088,0]];',
					r * 0.17, r * 0.17, '', 'Network Watcher', null, null, this.getTagsForStencil(gn, 'network watcher', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SAP_Azure_Monitor.svg;points=[[0.519,0.003,0],[0.5,0.997,0],[0,0.562,0],[1,0.614,0],[0.695,0.075,0],[0.972,0.981,0],[0.098,0.815,0],[0.333,0.075,0]];',
					r * 0.175, r * 0.14, '', 'SAP Azure Monitor', null, null, this.getTagsForStencil(gn, 'sap monitor', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/general/Scale.svg;points=[[0.459,0,0],[0.526,1,0],[0,0.476,0],[1,0.541,0],[0.995,0,0],[0.985,1,0],[0,1,0],[0,0.018,0]];',
					r * 0.17, r * 0.17, '', 'Scale', null, null, this.getTagsForStencil(gn, 'scale', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/analytics/Azure_Workbooks.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.962,0.015,0],[0.975,0.975,0],[0.025,0.975,0],[0.038,0.015,0]];',
					r * 0.17, r * 0.17, '', 'Workbooks', null, null, this.getTagsForStencil(gn, 'workbooks', dt).join(' '))
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
			this.createVertexTemplateEntry(s + 'Azure_Access_Point.svg;points=[[0.5,0.048,0],[0.521,1,0],[0.098,0.5,0],[1,0.503,0],[0.792,0.194,0],[0.852,0.819,0],[0.155,0.811,0],[0.073,0.176,0]];',
					r * 0.17, r * 0.1667, '', 'Access Point', null, null, this.getTagsForStencil(gn, 'access point', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Application_Gateway_Containers.svg;points=[[0.5,0,0],[0.501,1,0],[0,0.466,0],[1,0.466,0],[0.755,0.008,0],[0.88,0.875,0],[0.12,0.873,0],[0.248,0.006,0]];',
					r * 0.17, r * 0.1606, '', 'Application Gateway Containers', null, null, this.getTagsForStencil(gn, 'application gateway containers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Application_Gateways.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.758,0.242,0],[0.758,0.758,0],[0.242,0.758,0],[0.242,0.242,0]];',
					r * 0.16, r * 0.16, '', 'Application Gateways', null, null, this.getTagsForStencil(gn, 'application gateways', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ATM_Multistack.svg;points=[[0.752,0,0],[0.246,1,0],[0,0.772,0],[1,0.229,0],[0.995,0.003,0],[0.485,1,0],[0,0.992,0],[0.51,0.003,0]];',
					r * 0.17, r * 0.17, '', 'ATM Multistack', null, null, this.getTagsForStencil(gn, 'atm multistack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Bastions.svg;points=[[0.916,0.003,0],[0.5,1,0],[0.181,0.5,0],[0.828,0.5,0],[0.991,0.058,0],[0.997,0.67,0],[0.006,0.947,0],[0.009,0.333,0]];',
					r * 0.145, r * 0.17, '', 'Bastions', null, null, this.getTagsForStencil(gn, 'bastions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CDN_Profiles.svg;points=[[0.611,0.004,0],[0.62,0.996,0],[0,0.638,0],[0.963,0.5,0],[0.735,0.06,0],[0.907,0.957,0],[0.105,0.914,0],[0.108,0.358,0]];',
					r * 0.17, r * 0.1, '', 'CDN Profiles', null, null, this.getTagsForStencil(gn, 'cdn profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Communications_Gateway.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.501,0],[1,0.501,0],[0.733,0.267,0],[0.733,0.733,0],[0.265,0.735,0],[0.265,0.265,0]];',
					r * 0.17, r * 0.17, '', 'Communications Gateway', null, null, this.getTagsForStencil(gn, 'communications gateway', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/other/Connected_Cache.svg;points=[[0.5,0.061,0],[0.5,0.964,0],[0,0.395,0],[1,0.5,0],[0.995,0.933,0],[0.07,0.571,0],[0.07,0.219,0]];',
					r * 0.17, r * 0.14, '', 'Connected Cache', null, null, this.getTagsForStencil(gn, 'connected cache', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Connections.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Connections', null, null, this.getTagsForStencil(gn, 'connections', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DDoS_Custom_Policy.svg;points=[[0.5,0.124,0],[0.5,0.927,0],[0,0.461,0],[1,0.11,0],[0.907,0.003,0],[0.572,0.873,0],[0.133,0.87,0],[0.1,0.218,0]];',
					r * 0.17, r * 0.1641, '', 'DDoS Custom Policy', null, null, this.getTagsForStencil(gn, 'ddos custom policy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DDoS_Protection_Plans.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.997,0.5,0],[0.99,0.125,0],[0.86,0.752,0],[0.149,0.762,0],[0.01,0.125,0]];',
					r * 0.14, r * 0.17, '', 'DDoS Protection Plans', null, null, this.getTagsForStencil(gn, 'ddos protection plans', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DNS_Multistack.svg;points=[[0.752,0,0],[0.247,1,0],[0,0.772,0],[1,0.229,0],[0.995,0.003,0],[0.485,1,0],[0,0.992,0],[0.51,0.003,0]];',
					r * 0.17, r * 0.17, '', 'DNS Multistack', null, null, this.getTagsForStencil(gn, 'dns multistack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DNS_Private_Resolver.svg;points=[[0.5,0.031,0],[0.5,0.963,0],[0,0.499,0],[1,0.496,0],[0.912,0.029,0],[0.85,0.903,0],[0.093,0.971,0],[0.153,0.088,0]];',
					r * 0.17, r * 0.15, '', 'DNS Private Resolver', null, null, this.getTagsForStencil(gn, 'dns private resolver', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DNS_Security_Policy.svg;points=[[0.5,0.02,0],[0.777,1,0],[0.022,0.5,0],[1,0.636,0],[0.655,0.123,0],[0.905,0.905,0],[0.113,0.645,0],[0.125,0.093,0]];',
					r * 0.17, r * 0.17, '', 'DNS Security Policy', null, null, this.getTagsForStencil(gn, 'dns security policy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'DNS_Zones.svg;points=[[0.497,0,0],[0.504,1,0],[0,0.499,0],[1,0.5,0],[0.85,0.14,0],[0.875,0.835,0],[0.125,0.835,0],[0.148,0.143,0]];',
					r * 0.16, r * 0.16, '', 'DNS Zones', null, null, this.getTagsForStencil(gn, 'dns domain name server zones', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Edge_Actions.svg;points=[[0.5,0,0],[0.5,0.944,0],[0.037,0.5,0],[0.945,0.5,0],[0.59,0.004,0],[0.915,0.996,0],[0.083,0.993,0]];',
					r * 0.17, r * 0.1357, '', 'Edge Actions', null, null, this.getTagsForStencil(gn, 'edge actions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ExpressRoute_Circuits.svg;points=[[0.504,0,0],[0.5,0.908,0],[0.003,0.855,0],[0.998,0.855,0],[0.597,0.039,0],[0.95,0.97,0],[0.05,0.97,0],[0.41,0.039,0]];',
					r * 0.175, r * 0.16, '', 'ExpressRoute Circuits', null, null, this.getTagsForStencil(gn, 'expressroute circuits', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Firewall_Manager.svg;points=[[0.417,0,0],[0.749,1,0],[0,0.5,0],[1,0.515,0],[0.82,0.006,0],[0.845,0.924,0],[0.013,0.006,0]];',
					r * 0.175, r * 0.15, '', 'Firewall Manager', null, null, this.getTagsForStencil(gn, 'firewall manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Firewall_Policy.svg;points=[[0.454,0,0],[0.5,0.99,0],[0,0.5,0],[1,0.5,0],[0.895,0.007,0],[0.995,0.996,0],[0.013,0.682,0],[0.018,0.004,0]];',
					r * 0.17, r * 0.1233, '', 'Firewall Policy', null, null, this.getTagsForStencil(gn, 'firewall policy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Firewalls.svg;points=[[0.514,0,0],[0.5,1,0],[0,0.528,0],[1,0.575,0],[0.705,0.077,0],[0.787,0.994,0],[0.213,0.994,0],[0.093,0.296,0]];',
					r * 0.1775, r * 0.15, '', 'Firewalls', null, null, this.getTagsForStencil(gn, 'firewalls', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Front_Doors.svg;points=[[0.514,0,0],[0.504,1,0],[0,0.507,0],[1,0.554,0],[0.707,0.077,0],[0.932,0.733,0],[0.09,0.728,0],[0.085,0.292,0]];',
					r * 0.17, r * 0.15, '', 'Front Doors', null, null, this.getTagsForStencil(gn, 'front doors', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IP_Address_Manager.svg;points=[[0.435,0.003,0],[0.792,0.997,0],[0,0.397,0],[1,0.758,0],[0.857,0.009,0],[0.922,0.943,0],[0.013,0.786,0],[0.008,0.012,0]];',
					r * 0.17, r * 0.1511, '', 'IP Address Manager', null, null, this.getTagsForStencil(gn, 'ip address manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IP_Groups.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.992,0.996,0],[0.01,0.58,0],[0.008,0.004,0]];',
					r * 0.1675, r * 0.13, '', 'IP Groups', null, null, this.getTagsForStencil(gn, 'ip internet protocol groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Load_Balancer_Hub.svg;points=[[0.531,0,0],[0.5,0.891,0],[0,0.48,0],[1,0.417,0],[0.99,0.018,0],[0.996,0.81,0],[0.123,1,0],[0.01,0.08,0]];',
					r * 0.135, r * 0.17, '', 'Load Balancer Hub', null, null, this.getTagsForStencil(gn, 'load balancer hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Load_Balancer_Hub2.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.773,0.227,0],[0.773,0.773,0],[0.227,0.773,0],[0.227,0.227,0]];',
					r * 0.17, r * 0.17, '', 'Load Balancer Hub', null, null, this.getTagsForStencil(gn, 'load balancer hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Load_Balancers.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.758,0.242,0],[0.758,0.758,0],[0.242,0.758,0],[0.242,0.242,0]];',
					r * 0.18, r * 0.18, '', 'Load Balancers', null, null, this.getTagsForStencil(gn, 'load balancers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Local_Network_Gateways.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.758,0.242,0],[0.758,0.758,0],[0.242,0.758,0],[0.242,0.242,0]];',
					r * 0.17, r * 0.17, '', 'Local Network Gateways', null, null, this.getTagsForStencil(gn, 'local network gateways', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'NAT.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.758,0.242,0],[0.758,0.758,0],[0.242,0.758,0],[0.242,0.242,0]];',
					r * 0.17, r * 0.17, '', 'NAT', null, null, this.getTagsForStencil(gn, 'nat', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Network_Foundation_Hub.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.937,0.04,0],[0.96,0.937,0],[0.04,0.937,0],[0.06,0.043,0]];',
					r * 0.17, r * 0.17, '', 'Network Foundation Hub', null, null, this.getTagsForStencil(gn, 'network foundation hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Network_Interfaces.svg;points=[[0.501,0,0],[0.501,1,0],[0,0.5,0],[1,0.516,0],[0.992,0.097,0],[0.99,0.934,0],[0.113,0.994,0],[0.113,0.006,0]];',
					r * 0.17, r * 0.15, '', 'Network Interfaces', null, null, this.getTagsForStencil(gn, 'network interfaces', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Network_Security_Groups.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.997,0.5,0],[0.99,0.125,0],[0.86,0.752,0],[0.149,0.762,0],[0.01,0.125,0]];',
					r * 0.14, r * 0.17, '', 'Network Security Groups', null, null, this.getTagsForStencil(gn, 'network security groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Network_Security_Hub.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.991,0.153,0],[0.867,0.81,0],[0.122,0.8,0],[0.006,0.155,0]];',
					r * 0.157, r * 0.17, '', 'Network Security Hub', null, null, this.getTagsForStencil(gn, 'network security hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Network_Watcher.svg;points=[[0.5,0.025,0],[0.5,0.796,0],[0.136,0.5,0],[0.97,0.5,0],[0.89,0.1,0],[0.897,0.615,0],[0.01,0.985,0],[0.395,0.088,0]];',
					r * 0.16, r * 0.16, '', 'Network Watcher', null, null, this.getTagsForStencil(gn, 'network watcher', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'On_Premises_Data_Gateways.svg;points=[[0.514,0,0],[0.527,1,0],[0,0.466,0],[1,0.509,0],[0.71,0.073,0],[0.915,0.69,0],[0.088,0.671,0],[0.085,0.261,0]];',
					r * 0.17, r * 0.163, '', 'On Premises Data Gateways', null, null, this.getTagsForStencil(gn, 'on premises data gateways', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Endpoint.svg;points=[[0.5,0,0],[0.5,0.818,0],[0,0.695,0],[1,0.695,0],[0.735,0.997,0],[0.265,0.997,0]];',
					r * 0.18, r * 0.165, '', 'Private Endpoint', null, null, this.getTagsForStencil(gn, 'private endpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Link.svg;points=[[0.5,0,0],[0.5,0.898,0],[0.005,0.677,0],[0.995,0.696,0],[0.732,0.997,0],[0.268,0.978,0]];',
					r * 0.18, r * 0.165, '', 'Private Link', null, null, this.getTagsForStencil(gn, 'private link', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Link_Hub.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0,0.499,0],[1,0.5,0],[1,0.25,0],[1,0.75,0],[0,0.747,0],[0,0.25,0]];',
					r * 0.147, r * 0.17, '', 'Private Link Hub', null, null, this.getTagsForStencil(gn, 'private link hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Link_Service.svg;points=[[0.5,0.223,0],[0.5,0.833,0],[0,0.481,0],[1,0.515,0],[0.737,0.035,0],[0.735,0.995,0],[0.268,0.965,0],[0.26,0.005,0]];',
					r * 0.1725, r * 0.1, '', 'Private Link Service', null, null, this.getTagsForStencil(gn, 'private link service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Proximity_Placement_Groups.svg;points=[[0.5,0,0],[0.5,1,0],[0.007,0.503,0],[0.989,0.5,0],[0.99,0.111,0],[0.99,0.889,0],[0.013,0.891,0],[0.01,0.111,0]];',
					r * 0.18, r * 0.17, '', 'Proximity Placement Groups', null, null, this.getTagsForStencil(gn, 'proximity placement groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Public_IP_Addresses.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'Public IP Addresses', null, null, this.getTagsForStencil(gn, 'public ip addresses', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Public_IP_Addresses_Classic.svg;points=[[0.499,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.99,0.013,0],[0.99,0.987,0],[0.01,0.987,0],[0.013,0.01,0]];',
					r * 0.16, r * 0.13, '', 'Public IP Addresses (Classic)', null, null, this.getTagsForStencil(gn, 'public ip internet protocol addresses classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Public_IP_Prefixes.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.99,1,0],[0.003,0.007,0]];',
					r * 0.18, r * 0.14, '', 'Public IP Prefixes', null, null, this.getTagsForStencil(gn, 'public ip internet protocol prefixes', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Reserved_IP_Addresses_Classic.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[0.997,0.007,0],[0.997,0.993,0],[0.003,0.993,0],[0.003,0.007,0]];',
					r * 0.17, r * 0.1375, '', 'Reserved IP Addresses (Classic)', null, null, this.getTagsForStencil(gn, 'reserved ip internet protocol addresses classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Management_Private_Link.svg;points=[[0.5,0.002,0],[0.499,0.997,0],[0,0.722,0],[1,0.722,0],[0.807,0.93,0],[0.193,0.93,0]];',
					r * 0.17, r * 0.165, '', 'Resource Management Private Link', null, null, this.getTagsForStencil(gn, 'resource management private link', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Route_Filters.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.508,0],[0.842,0.097,0],[0.84,0.923,0],[0.015,0.995,0],[0.015,0.005,0]];',
					r * 0.1775, r * 0.11, '', 'Route Filters', null, null, this.getTagsForStencil(gn, 'route filters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Route_Tables.svg;points=[[0.593,0.07,0],[0.594,0.997,0],[0,0.36,0],[0.725,0.5,0],[0.74,0.124,0],[0.972,0.984,0],[0.21,0.982,0],[0.233,0.003,0]];',
					r * 0.16, r * 0.155, '', 'Route Tables', null, null, this.getTagsForStencil(gn, 'route tables', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Service_Endpoint_Policies.svg;points=[[0.54,0,0],[0.5,1,0],[0.092,0.5,0],[0.779,0.5,0],[0.979,0.048,0],[0.744,0.955,0],[0.024,0.957,0],[0.124,0.048,0]];',
					r * 0.155, r * 0.16, '', 'Service Endpoint Policies', null, null, this.getTagsForStencil(gn, 'service endpoint policies', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Spot_VM.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.003,0],[0.75,1,0],[0.25,1,0],[0.015,0.003,0]];',
					r * 0.17, r * 0.157, '', 'Spot VM', null, null, this.getTagsForStencil(gn, 'spot vm virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Spot_VMSS.svg;points=[[0.389,0,0],[0.61,1,0],[0,0.5,0],[1,0.516,0],[0.989,0.246,0],[0.802,1,0],[0.234,0.786,0],[0.013,0.003,0]];',
					r * 0.17, r * 0.16, '', 'Spot VMSS', null, null, this.getTagsForStencil(gn, 'spot vmss virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Subnet.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.498,0],[1,0.498,0],[0.717,0.001,0],[0.712,0.999,0],[0.288,0.999,0],[0.283,0.001,0]];',
					r * 0.17, r * 0.1018, '', 'Subnet', null, null, this.getTagsForStencil(gn, 'subnet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Traffic_Manager_Profiles.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.855,0.145,0],[0.855,0.855,0],[0.145,0.855,0],[0.145,0.145,0]];',
					r * 0.17, r * 0.17, '', 'Traffic Manager Profiles', null, null, this.getTagsForStencil(gn, 'traffic manager profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Network_Gateways.svg;points=[[0.492,0,0],[0.498,1,0],[0.007,0.5,0],[0.993,0.5,0],[0.79,0.115,0],[0.99,0.985,0],[0.014,0.99,0],[0.193,0.115,0]];',
					r * 0.13, r * 0.1725, '', 'Virtual Network Gateways', null, null, this.getTagsForStencil(gn, 'virtual network gateways', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Networks.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.498,0],[1,0.498,0],[0.722,0.005,0],[0.712,0.999,0],[0.288,0.999,0],[0.283,0.001,0]];',
					r * 0.1675, r * 0.1, '', 'Virtual Networks', null, null, this.getTagsForStencil(gn, 'virtual networks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Networks_Classic.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.498,0],[1,0.498,0],[0.722,0.005,0],[0.712,0.999,0],[0.288,0.999,0],[0.283,0.001,0]];',
					r * 0.1675, r * 0.1, '', 'Virtual Networks (Classic)', null, null, this.getTagsForStencil(gn, 'virtual networks classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Router.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Virtual Router', null, null, this.getTagsForStencil(gn, 'virtual router', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_WAN_Hub.svg;points=[[0.5,0.259,0],[0.5,0.753,0],[0.005,0.501,0],[0.995,0.503,0],[0.79,0.011,0],[0.787,0.987,0],[0.228,0.989,0],[0.208,0.021,0]];',
					r * 0.1625, r * 0.16, '', 'Virtual WAN Hub', null, null, this.getTagsForStencil(gn, 'virtual wan wide area network hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_WANs.svg;points=[[0.514,0,0],[0.502,1,0],[0,0.454,0],[1,0.496,0],[0.71,0.071,0],[0.69,0.926,0],[0.325,0.934,0],[0.093,0.257,0]];',
					r * 0.1625, r * 0.16, '', 'Virtual WANs', null, null, this.getTagsForStencil(gn, 'virtual wans wan wide area network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'VNet_Appliance.svg;points=[[0.544,0,0],[0.544,1,0],[0,0.541,0],[1,0.541,0],[0.995,0,0],[1,0.995,0],[0,0.995,0],[0.003,0.003,0]];',
					r * 0.1699, r * 0.17, '', 'VNet Appliance', null, null, this.getTagsForStencil(gn, 'vnet appliance virtual network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'VPN_Client_Windows.svg;points=[[0.499,0,0],[0.499,1,0],[0.009,0.5,0],[0.991,0.5,0],[1,0.125,0],[0.842,0.775,0],[0.158,0.777,0],[0,0.125,0]];',
					r * 0.1481, r * 0.17, '', 'VPN Client Windows', null, null, this.getTagsForStencil(gn, 'vpn client windows', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_Application_Firewall_Policies_WAF.svg;points=[[0.477,0.003,0],[0.5,0.998,0],[0,0.486,0],[0.965,0.5,0],[0.802,0.123,0],[0.992,0.99,0],[0.268,0.99,0],[0.15,0.133,0]];',
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
			this.createVertexTemplateEntry(s + 'Azure_A.svg;points=[[0.5,0,0],[0.5,0.91,0],[0.139,0.5,0],[0.861,0.5,0],[0.695,0.008,0],[0.977,0.994,0],[0.013,0.986,0],[0.308,0.006,0]];',
					r * 0.17, r * 0.1603, '', 'A', null, null, this.getTagsForStencil(gn, '', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/identity/AAD_Licenses.svg;points=[[0.443,0,0],[0.5,0.944,0],[0.172,0.5,0],[1,0.599,0],[0.631,0.08,0],[0.922,0.992,0],[0.016,0.912,0],[0.263,0.073,0]];',
					r * 0.1634, r * 0.17, '', 'AAD Licenses', null, null, this.getTagsForStencil(gn, 'aad licenses', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ACS_Solutions_Builder.svg;points=[[0.432,0.003,0],[0.5,0.997,0],[0,0.459,0],[1,0.765,0],[0.855,0.01,0],[0.992,0.921,0],[0.01,0.908,0],[0.01,0.01,0]];',
					r * 0.17, r * 0.13, '', 'ACS Solutions Builder', null, null, this.getTagsForStencil(gn, 'acs solutions builder', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'AKS_Automatic.svg;points=[[0.5,0.094,0],[0.5,0.981,0],[0,0.465,0],[1,0.644,0],[0.855,0.34,0],[0.855,0.95,0],[0.328,0.972,0],[0.103,0,0]];',
					r * 0.17, r * 0.17, '', 'AKS Automatic', null, null, this.getTagsForStencil(gn, 'aks automatic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'AKS_Istio.svg;points=[[0.5,0.305,0],[0.5,0.695,0],[0.307,0.5,0],[0.698,0.5,0],[1,0,0],[1,1,0],[0,1,0],[0,0,0]];',
					r * 0.17, r * 0.17, '', 'AKS Istio', null, null, this.getTagsForStencil(gn, 'aks istio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'API_Proxy.svg;points=[[0.5,0.223,0],[0.5,0.777,0],[0,0.5,0],[1,0.5,0],[0.75,0.362,0],[0.75,0.64,0],[0.25,0.64,0],[0.25,0.362,0]];',
					r * 0.17, r * 0.095, '', 'API Proxy', null, null, this.getTagsForStencil(gn, 'api application programming interface proxy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Compliance_Automation.svg;points=[[0.514,0,0],[0.525,1,0],[0.018,0.5,0],[0.953,0.5,0],[0.685,0.069,0],[0.91,0.938,0],[0.105,0.92,0],[0.343,0.069,0]];',
					r * 0.17, r * 0.1237, '', 'App Compliance Automation', null, null, this.getTagsForStencil(gn, 'app compliance automation', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/identity/App_Registrations.svg;points=[[0.429,0,0],[0.769,0.998,0],[0,0.425,0],[1,0.733,0],[0.855,0.018,0],[1,0.867,0],[0.005,0.835,0],[0.005,0.015,0]];',
					r * 0.1673, r * 0.17, '', 'App Registrations', null, null, this.getTagsForStencil(gn, 'app registrations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Space_Component.svg;points=[[0.5,0,0],[0.5,1,0],[0.009,0.5,0],[0.991,0.5,0],[0.982,0.325,0],[0.982,0.99,0],[0.018,0.99,0],[0.015,0.013,0]];',
					r * 0.1417, r * 0.17, '', 'App Space Compoment', null, null, this.getTagsForStencil(gn, 'app space component', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Aquila.svg;points=[[0.512,0,0],[0.75,1,0],[0,0.454,0],[1,0.5,0],[0.705,0.067,0],[0.91,0.944,0],[0.095,0.656,0],[0.09,0.257,0]];',
					r * 0.17, r * 0.167, '', 'Aquila', null, null, this.getTagsForStencil(gn, 'aquila', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Arc_Data_Services.svg;points=[[0.5,0,0],[0.496,1,0],[0,0.791,0],[1,0.781,0],[0.814,0.08,0],[0.987,0.872,0],[0.024,0.892,0],[0.183,0.083,0]];',
					r * 0.1627, r * 0.17, '', 'Arc Data Services', null, null, this.getTagsForStencil(gn, 'arc data services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Arc_Kubernetes.svg;points=[[0.5,0.253,0],[0.486,1,0],[0,0.782,0],[1,0.782,0],[0.782,0.048,0],[0.975,0.877,0],[0.023,0.885,0],[0.218,0.023,0]];',
					r * 0.17, r * 0.17, '', 'Arc Kubernetes', null, null, this.getTagsForStencil(gn, 'arc kubernetes', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Arc_PostgreSQL.svg;points=[[0.473,0,0],[0.497,1,0],[0,0.791,0],[1,0.782,0],[0.788,0.083,0],[0.984,0.875,0],[0.013,0.88,0],[0.157,0.08,0]];',
					r * 0.1627, r * 0.17, '', 'Arc PostgreSQL', null, null, this.getTagsForStencil(gn, 'arc postgresql', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Arc_SQL_Managed_Instance.svg;points=[[0.5,0,0],[0.495,1,0],[0.099,0.5,0],[1,0.781,0],[0.984,0.875,0],[0.024,0.892,0],[0.105,0.01,0]];',
					r * 0.1624, r * 0.17, '', 'Arc SQL Managed Instance', null, null, this.getTagsForStencil(gn, 'arc sql managed instance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Arc_SQL_Server.svg;points=[[0.5,0,0],[0.495,1,0],[0.079,0.5,0],[0.921,0.5,0],[0.918,0.013,0],[0.984,0.875,0],[0.019,0.887,0],[0.084,0.008,0]];',
					r * 0.162, r * 0.17, '', 'Arc SQL Server', null, null, this.getTagsForStencil(gn, 'arc sql server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'AVS_VM.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.987,0.006,0],[0.75,1,0],[0.25,1,0],[0.013,0.006,0]];',
					r * 0.17, r * 0.157, '', 'AVS VM', null, null, this.getTagsForStencil(gn, 'avs vm virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Enclaves.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.501,0],[1,0.501,0],[0.853,0.223,0],[0.856,0.775,0],[0.144,0.775,0],[0.147,0.223,0]];',
					r * 0.1536, r * 0.17, '', 'Azure Enclaves', null, null, this.getTagsForStencil(gn, 'enclaves virtual enclaves', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'AzureAttestation.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.997,0.5,0],[0.99,0.125,0],[0.848,0.765,0],[0.149,0.762,0],[0.01,0.125,0]];',
					r * 0.14, r * 0.17, '', 'AzureAttestation', null, null, this.getTagsForStencil(gn, 'azureattestation attestation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azurite.svg;points=[[0.441,0,0],[0.5,0.956,0],[0,0.5,0],[0.985,0.5,0],[0.87,0.003,0],[0.98,0.989,0],[0.015,0.706,0],[0.01,0.006,0]];',
					r * 0.17, r * 0.165, '', 'Azurite', null, null, this.getTagsForStencil(gn, 'azurite', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Backup_Center.svg;points=[[0.5,0.047,0],[0.5,0.934,0],[0,0.712,0],[1,0.4,0],[0.775,0.05,0],[0.72,0.89,0],[0.073,0.885,0],[0.313,0.211,0]];',
					r * 0.17, r * 0.155, '', 'Backup Center', null, null, this.getTagsForStencil(gn, 'backup center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Backup_Vault.svg;points=[[0.5,0.065,0],[0.5,1,0],[0,0.777,0],[1,0.413,0],[0.78,0.047,0],[0.657,0.959,0],[0.07,0.95,0],[0.353,0.203,0]];',
					r * 0.17, r * 0.1449, '', 'Backup Vault', null, null, this.getTagsForStencil(gn, 'backup vault', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Bare_Metal_Infrastructure.svg;points=[[0.5,0,0],[0.526,1,0],[0.02,0.5,0],[0.98,0.5,0],[0.987,0.006,0],[0.935,0.944,0],[0.065,0.944,0],[0.013,0.006,0]];',
					r * 0.17, r * 0.16, '', 'Bare Metal Infrastructure', null, null, this.getTagsForStencil(gn, 'bare metal infrastructure', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Breeze.svg;points=[[0.499,0,0],[0.492,1,0],[0,0.49,0],[1,0.501,0],[0.842,0.133,0],[0.87,0.837,0],[0.148,0.857,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Breeze', null, null, this.getTagsForStencil(gn, 'breeze', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Business_Process_Tracking.svg;points=[[0.5,0,0],[0.5,1,0],[0.014,0.448,0],[0.986,0.448,0],[0.975,0.008,0],[0.982,0.882,0],[0.018,0.882,0],[0.025,0.008,0]];',
					r * 0.1228, r * 0.17, '', 'Business Process Tracking', null, null, this.getTagsForStencil(gn, 'business process tracking', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Center_for_SAP.svg;points=[[0.5,0.009,0],[0.5,1,0],[0,0.499,0],[1,0.499,0],[0.842,0.133,0],[0.842,0.865,0],[0.163,0.87,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Center for SAP', null, null, this.getTagsForStencil(gn, 'center for sap', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Central_Service_Instance_for_SAP.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[0.789,0.5,0],[0.987,0.01,0],[0.018,0.995,0],[0.018,0.005,0]];',
					r * 0.17, r * 0.089, '', 'Central Service Instance for SAP', null, null, this.getTagsForStencil(gn, 'central service instance for sap', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Ceres.svg;points=[[0.635,0,0],[0.444,1,0],[0.057,0.5,0],[0.931,0.5,0],[0.916,0.113,0],[0.882,0.987,0],[0.012,0.992,0],[0.161,0.143,0]];',
					r * 0.148, r * 0.17, '', 'Ceres', null, null, this.getTagsForStencil(gn, 'ceres', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Chaos_Studio.svg;points=[[0.482,0,0],[0.516,1,0],[0,0.481,0],[1,0.519,0],[0.765,0.013,0],[0.932,0.925,0],[0.013,0.765,0],[0.09,0.055,0]];',
					r * 0.17, r * 0.17, '', 'Chaos Studio', null, null, this.getTagsForStencil(gn, 'chaos studio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cloud_Services_(extended_support).svg;points=[[0.459,0,0],[0.784,1,0],[0,0.481,0],[1,0.746,0],[0.622,0.062,0],[0.925,0.941,0],[0.088,0.698,0],[0.083,0.267,0]];',
					r * 0.17, r * 0.145, '', 'Cloud Services (extended support)', null, null, this.getTagsForStencil(gn, 'cloud services extended support', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Cloud_Shell.svg;points=[[0.435,0,0],[0.5,0.996,0],[0,0.606,0],[1,0.818,0],[0.862,0.001,0],[0.95,0.96,0],[0.008,0.996,0],[0.008,0.001,0]];',
					r * 0.17, r * 0.118, '', 'Cloud Shell', null, null, this.getTagsForStencil(gn, 'cloud shell', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Communication_Services.svg;points=[[0.431,0.007,0],[0.774,0.993,0],[0,0.42,0],[0.955,0.5,0],[0.845,0.018,0],[0.902,0.942,0],[0.018,0.823,0],[0.018,0.018,0]];',
					r * 0.17, r * 0.125, '', 'Communication Services', null, null, this.getTagsForStencil(gn, 'communication services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Compliance_Center.svg;points=[[0.441,0,0],[0.751,1,0],[0,0.443,0],[1,0.75,0],[0.792,0.005,0],[0.945,0.91,0],[0.123,0.75,0],[0.09,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Compliance Center', null, null, this.getTagsForStencil(gn, 'compliance center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Compute_Fleet.svg;points=[[0.5,0,0],[0.5,0.922,0],[0.071,0.5,0],[1,0.415,0],[0.995,0.203,0],[0.925,0.917,0],[0.075,0.792,0],[0.025,0.273,0]];',
					r * 0.17, r * 0.17, '', 'Compute Fleet', null, null, this.getTagsForStencil(gn, 'compute fleet', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/compute/Azure_Compute_Galleries.svg;points=[[0.5,0.104,0],[0.5,0.911,0],[0.094,0.5,0],[0.894,0.5,0],[0.877,0.118,0],[0.88,0.895,0],[0.105,0.89,0],[0.115,0.113,0]];',
					r * 0.17, r * 0.17, '', 'Compute Galleries', null, null, this.getTagsForStencil(gn, 'compute galleries', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Confidential_Ledger.svg;points=[[0.5,0,0],[0.5,0.776,0],[0,0.749,0],[1,0.749,0],[0.712,0.123,0],[1,0.875,0],[0,0.875,0],[0.288,0.123,0]];',
					r * 0.17, r * 0.17, '', 'Confidential_Ledger', null, null, this.getTagsForStencil(gn, 'confidential ledger', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Consumption_Commitment.svg;points=[[0.427,0,0],[0.801,1,0],[0,0.419,0],[0.844,0.5,0],[0.747,0.143,0],[0.99,0.98,0],[0.099,0.695,0],[0.084,0.078,0]];',
					r * 0.1685, r * 0.17, '', 'Consumption Commitment', null, null, this.getTagsForStencil(gn, 'consumption commitment macc', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Container_App_Environments.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.98,0.018,0],[0.985,0.977,0],[0.015,0.977,0],[0.02,0.018,0]];',
					r * 0.17, r * 0.17, '', 'Container App Environments', null, null, this.getTagsForStencil(gn, 'container app environments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Connected_Cache.svg;points=[[0.5,0.061,0],[0.5,0.964,0],[0,0.395,0],[1,0.5,0],[0.995,0.933,0],[0.07,0.571,0],[0.07,0.219,0]];',
					r * 0.17, r * 0.14, '', 'Connected Cache', null, null, this.getTagsForStencil(gn, 'connected cache', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Connected_Vehicle_Platform.svg;points=[[0.393,0.003,0],[0.5,0.935,0],[0,0.469,0],[0.766,0.5,0],[0.535,0.066,0],[0.98,0.921,0],[0.18,0.921,0],[0.253,0.063,0]];',
					r * 0.17, r * 0.13, '', 'Connected Vehicle Platform', null, null, this.getTagsForStencil(gn, 'connected vehicle platform', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Cost_Export.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.637,0.004,0],[0.637,0.996,0],[0.005,0.996,0],[0.005,0.004,0]];',
					r * 0.17, r * 0.1318, '', 'Cost Export', null, null, this.getTagsForStencil(gn, 'cost export', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Custom_IP_Prefix.svg;points=[[0.39,0,0],[0.5,0.889,0],[0,0.5,0],[0.854,0.5,0],[0.77,0.005,0],[0.947,0.915,0],[0.005,0.617,0],[0.008,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Custom IP Prefix', null, null, this.getTagsForStencil(gn, 'custom ip internet protocol prefix', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Dashboard_Hub.svg;points=[[0.598,0,0],[0.404,1,0],[0,0.5,0],[1,0.5,0],[0.99,0.004,0],[0.8,0.993,0],[0.008,0.993,0],[0.205,0.004,0]];',
					r * 0.17, r * 0.13, '', 'Dashboard Hub', null, null, this.getTagsForStencil(gn, 'dashboard hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Collection_Rules.svg;points=[[0.583,0,0],[0.583,1,0],[0.01,0.5,0],[1,0.501,0],[0.995,0.013,0],[0.995,0.987,0],[0.171,0.987,0],[0.003,0.118,0]];',
					r * 0.1665, r * 0.17, '', 'Data Collection Rules', null, null, this.getTagsForStencil(gn, 'data collection rules', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Data_Sharing.svg;points=[[0.41,0,0],[0.5,0.944,0],[0,0.471,0],[1,0.764,0],[0.807,0.004,0],[0.84,0.996,0],[0.01,0.935,0],[0.013,0.004,0]];',
					r * 0.17, r * 0.119, '', 'Data Sharing', null, null, this.getTagsForStencil(gn, 'data sharing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Data_Transfer.svg;points=[[0.455,0,0],[0.259,1,0],[0,0.553,0],[1,0.56,0],[0.795,0.216,0],[0.952,0.69,0],[0.118,0.914,0],[0.16,0.21,0]];',
					r * 0.17, r * 0.144, '', 'Data Transfer', null, null, this.getTagsForStencil(gn, 'data transfer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Database_Instance_for_SAP.svg;points=[[0.5,0.018,0],[0.477,1,0],[0,0.458,0],[1,0.633,0],[0.63,0.073,0],[0.667,0.994,0],[0.023,0.836,0],[0.028,0.073,0]];',
					r * 0.17, r * 0.163, '', 'Database Instance for SAP', null, null, this.getTagsForStencil(gn, 'database instance for sap', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Dedicated_HSM.svg;points=[[0.49,0,0],[0.5,1,0],[0.003,0.795,0],[0.998,0.795,0],[0.625,0.052,0],[0.985,0.994,0],[0.015,0.994,0],[0.355,0.052,0]];',
					r * 0.17, r * 0.155, '', 'Dedicated HSM', null, null, this.getTagsForStencil(gn, 'dedicated hsm', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_CM_Local_Manager.svg;points=[[0.492,0,0],[0.51,1,0],[0,0.509,0],[1,0.615,0],[0.99,0.218,0],[1,0.902,0],[0.163,0.87,0],[0.175,0.118,0]];',
					r * 0.17, r * 0.17, '', 'Defender CM Local Manager', null, null, this.getTagsForStencil(gn, 'defender cm local manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_DCS_Controller.svg;points=[[0.511,0,0],[0.505,1,0],[0.752,0.221,0],[0.987,0.902,0],[0.013,0.902,0],[0.273,0.221,0]];',
					r * 0.17, r * 0.156, '', 'Defender DCS Controller', null, null, this.getTagsForStencil(gn, 'defender dcs controller', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Distributer_Control_System.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.763,0.237,0],[0.763,0.763,0],[0.237,0.763,0],[0.237,0.237,0]];',
					r * 0.17, r * 0.17, '', 'Defender Distributer Control System', null, null, this.getTagsForStencil(gn, 'defender distributer control system', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Engineering_Station.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.99,0.006,0],[0.75,1,0],[0.25,1,0],[0.01,0.006,0]];',
					r * 0.17, r * 0.1571, '', 'Defender Engineering Station', null, null, this.getTagsForStencil(gn, 'defender engineering station', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_External_Management.svg;points=[[0.766,0,0],[0.332,1,0],[0,0.618,0],[0.924,0.5,0],[1,0.01,0],[0.923,0.605,0],[0.165,1,0],[0.003,0.41,0]];',
					r * 0.1654, r * 0.17, '', 'Defender External Management', null, null, this.getTagsForStencil(gn, 'defender external management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Freezer_Monitor.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.971,0.043,0],[0.971,0.957,0],[0.026,0.955,0],[0.026,0.045,0]];',
					r * 0.119, r * 0.17, '', 'Defender Freezer Monitor', null, null, this.getTagsForStencil(gn, 'defender freezer monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Historian.svg;points=[[0.434,0,0],[0.5,0.949,0],[0,0.472,0],[0.89,0.5,0],[0.852,0.074,0],[0.895,0.946,0],[0.02,0.878,0],[0.013,0.076,0]];',
					r * 0.17, r * 0.1677, '', 'Defender Historian', null, null, this.getTagsForStencil(gn, 'defender historian', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_HMI.svg;points=[[0.496,0,0],[0.5,1,0],[0,0.477,0],[1,0.506,0],[0.907,0.029,0],[0.902,0.977,0],[0.098,0.977,0],[0.09,0.026,0]];',
					r * 0.17, r * 0.1322, '', 'Defender HMI', null, null, this.getTagsForStencil(gn, 'defender hmi', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Industrial_Packaging_System.svg;points=[[0.463,0,0],[0.5,1,0],[0,0.836,0],[1,0.838,0],[0.777,0,0],[0.955,0.96,0],[0.043,0.957,0],[0.148,0,0]];',
					r * 0.17, r * 0.17, '', 'Defender Industrial Packaging System', null, null, this.getTagsForStencil(gn, 'defender industrial packaging system', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Industrial_Printer.svg;points=[[0.499,0,0],[0.491,1,0],[0,0.497,0],[1,0.499,0],[0.975,0.068,0],[1,0.882,0],[0,0.882,0],[0.023,0.07,0]];',
					r * 0.17, r * 0.17, '', 'Defender Industrial Printer', null, null, this.getTagsForStencil(gn, 'defender industrial printer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Industrial_Scale_System.svg;points=[[0.5,0.03,0],[0.5,0.922,0],[0.214,0.5,0],[1,0.845,0],[0.605,0.09,0],[0.97,0.975,0],[0.12,0.98,0],[0.025,0.09,0]];',
					r * 0.17, r * 0.17, '', 'Defender Industrial Scale System', null, null, this.getTagsForStencil(gn, 'defender industrial scale system', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Industrial_Robot.svg;points=[[0.55,0,0],[0.577,1,0],[0.032,0.5,0],[0.976,0.255,0],[0.993,0.99,0],[0.157,0.987,0],[0.027,0.355,0]];',
					r * 0.1277, r * 0.17, '', 'Defender Industrial Robot', null, null, this.getTagsForStencil(gn, 'defender industrial robot', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Marquee.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[1,0.001,0],[1,0.999,0],[0,0.999,0],[0,0.001,0]];',
					r * 0.17, r * 0.102, '', 'Defender Marquee', null, null, this.getTagsForStencil(gn, 'defender marquee', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Meter.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.962,0.025,0],[0.975,0.962,0],[0.025,0.962,0],[0.038,0.025,0]];',
					r * 0.17, r * 0.17, '', 'Defender Meter', null, null, this.getTagsForStencil(gn, 'defender meter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_PLC.svg;points=[[0.5,0,0],[0.501,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.01,0],[0.99,0.985,0],[0.01,0.985,0],[0.013,0.013,0]];',
					r * 0.17, r * 0.17, '', 'Defender PLC', null, null, this.getTagsForStencil(gn, 'defender plc programmable logic controller', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Pneumatic_Device.svg;points=[[0.5,0.042,0],[0.5,0.947,0],[0,0.828,0],[1,0.841,0],[0.965,0.978,0],[0.035,0.978,0],[0.198,0.074,0]];',
					r * 0.17, r * 0.1395, '', 'Defender Pneumatic Device', null, null, this.getTagsForStencil(gn, 'defender pneumatic device', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Programable_Board.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.685,0.005,0],[0.685,0.995,0],[0.315,0.995,0],[0.315,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Defender Programable Board', null, null, this.getTagsForStencil(gn, 'defender programable board', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Relay.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.503,0],[1,0.5,0],[0.867,0.126,0],[0.867,0.874,0],[0.165,0.874,0],[0.165,0.126,0]];',
					r * 0.17, r * 0.068, '', 'Defender Relay', null, null, this.getTagsForStencil(gn, 'defender relay', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Robot_Controller.svg;points=[[0.5,0.03,0],[0.5,0.975,0],[0,0.516,0],[0.928,0.5,0],[0.591,0.058,0],[0.92,0.89,0],[0.139,0.962,0],[0.113,0.045,0]];',
					r * 0.1654, r * 0.17, '', 'Defender Robot Controller', null, null, this.getTagsForStencil(gn, 'defender robot controller', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_RTU.svg;points=[[0.562,0,0],[0.438,1,0],[0,0.607,0],[1,0.393,0],[0.97,0.014,0],[0.845,0.986,0],[0.02,0.977,0],[0.155,0.014,0]];',
					r * 0.17, r * 0.1511, '', 'Defender RTU', null, null, this.getTagsForStencil(gn, 'defender rtu', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Sensor.svg;points=[[0.419,0,0],[0.581,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.982,0.281,0],[0.987,0.787,0],[0.015,0.716,0],[0.008,0.217,0]];',
					r * 0.17, r * 0.1257, '', 'Defender Sensor', null, null, this.getTagsForStencil(gn, 'defender sensor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Slot.svg;points=[[0.514,0,0],[0.514,1,0],[0,0.5,0],[1,0.481,0],[0.99,0.003,0],[0.997,0.99,0],[0.013,0.982,0],[0.018,0.013,0]];',
					r * 0.17, r * 0.17, '', 'Defender Slot', null, null, this.getTagsForStencil(gn, 'defender slot', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Defender_Web_Guiding_System.svg;points=[[0.501,0,0],[0.501,1,0],[0,0.593,0],[1,0.596,0],[0.72,0.022,0],[0.95,0.935,0],[0.058,0.949,0],[0.28,0.022,0]];',
					r * 0.17, r * 0.0594, '', 'Defender Web Guiding System', null, null, this.getTagsForStencil(gn, 'defender web guiding system', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Deployment_Environments.svg;points=[[0.512,0,0],[0.5,1,0],[0.036,0.5,0],[0.969,0.5,0],[0.697,0.068,0],[0.985,0.997,0],[0.015,0.997,0],[0.11,0.25,0]];',
					r * 0.17, r * 0.1632, '', 'Deployment Environments', null, null, this.getTagsForStencil(gn, 'deployment environments', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Detonation.svg;points=[[0.601,0.003,0],[0.5,0.766,0],[0.216,0.5,0],[1,0.39,0],[0.897,0.128,0],[0.897,0.652,0],[0.011,0.967,0],[0.307,0.125,0]];',
					r * 0.155, r * 0.16, '', 'Detonation', null, null, this.getTagsForStencil(gn, 'detonation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Device_Update_IoT_Hub.svg;points=[[0.5,0.044,0],[0.5,0.954,0],[0.003,0.5,0],[0.997,0.502,0],[0.713,0.01,0],[0.971,0.645,0],[0.281,0.992,0],[0.029,0.358,0]];',
					r * 0.15, r * 0.17, '', 'Device Update IoT Hub', null, null, this.getTagsForStencil(gn, 'device updateiot hub internet of things', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Dev_Tunnels.svg;points=[[0.5,0,0],[0.5,1,0],[0.061,0.5,0],[0.939,0.5,0],[0.812,0.128,0],[1,1,0],[0,1,0],[0.213,0.105,0]];',
					r * 0.17, r * 0.17, '', 'Dev Tunnels', null, null, this.getTagsForStencil(gn, 'dev tunnels', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Disconnected_Operations.svg;points=[[0.5,0.054,0],[0.5,0.848,0],[0,0.528,0],[1,0.558,0],[0.957,0,0],[0.907,0.776,0],[0.043,0.997,0],[0.255,0.129,0]];',
					r * 0.17, r * 0.158, '', 'Disconnected Operations', null, null, this.getTagsForStencil(gn, 'disconnected operations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Disk_Pool.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.5,0],[1,0.114,0],[1,0.886,0],[0,0.886,0],[0,0.114,0]];',
					r * 0.17, r * 0.165, '', 'Disk Pool', null, null, this.getTagsForStencil(gn, 'disk pool', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Edge_Hardware_Center.svg;points=[[0.5,0,0],[0.751,1,0],[0,0.414,0],[0.887,0.5,0],[0.665,0.003,0],[1,0.857,0],[0.005,0.82,0],[0.013,0.003,0]];',
					r * 0.17, r * 0.17, '', 'Edge Hardware Center', null, null, this.getTagsForStencil(gn, 'edge hardware center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Edge_Management.svg;points=[[0.514,0,0],[0.499,1,0],[0,0.441,0],[1,0.479,0],[0.719,0.075,0],[0.878,0.987,0],[0.122,0.992,0],[0.062,0.278,0]];',
					r * 0.165, r * 0.17, '', 'Edge Management', null, null, this.getTagsForStencil(gn, 'edge management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Elastic_SAN.svg;points=[[0.5,0.013,0],[0.576,1,0],[0,0.412,0],[1,0.806,0],[0.625,0.058,0],[0.947,0.937,0],[0.008,0.772,0],[0.008,0.058,0]];',
					r * 0.17, r * 0.17, '', 'Elastic SAN', null, null, this.getTagsForStencil(gn, 'elastic san', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/identity/Active_Directory_Connect_Health2.svg;points=[[0.5,0,0],[0.5,0.997,0],[0,0.615,0],[0.953,0.5,0],[0.877,0.887,0],[0.033,0.688,0]];',
					r * 0.17, r * 0.1511, '', 'Entra Connect Health', null, null, this.getTagsForStencil(gn, 'entra connect health', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Connect_Sync.svg;points=[[0.515,0,0],[0.444,1,0],[0,0.443,0],[1,0.5,0],[0.72,0.078,0],[0.945,0.91,0],[0.1,0.995,0],[0.093,0.25,0]];',
					r * 0.17, r * 0.17, '', 'Entra Connect Sync', null, null, this.getTagsForStencil(gn, 'entra connect sync', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Entra_Identity.svg;points=[[0.5,0,0],[0.5,1,0],[0.064,0.5,0],[0.936,0.5,0],[0.98,0.679,0],[0.02,0.679,0]];',
					r * 0.17, r * 0.1511, '', 'Entra Identity', null, null, this.getTagsForStencil(gn, 'entra identity', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Exchange_On_Premises_Access.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.991,0.013,0],[0.991,0.987,0],[0.009,0.987,0],[0.009,0.013,0]];',
					r * 0.1, r * 0.17, '', 'Exchange On Premises Access', null, null, this.getTagsForStencil(gn, 'exchange on premises access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Express_Route_Traffic_Collector.svg;points=[[0.5,0,0],[0.5,0.968,0],[0,0.482,0],[0.924,0.5,0],[0.918,0.32,0],[0.953,0.93,0],[0.009,0.957,0],[0.003,0.015,0]];',
					r * 0.1454, r * 0.17, '', 'Express Route Traffic Collector', null, null, this.getTagsForStencil(gn, 'express route traffic collector', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ExpressRoute_Direct.svg;points=[[0.341,0,0],[0.5,0.935,0],[0.003,0.598,0],[0.973,0.5,0],[0.885,0.366,0],[0.895,0.909,0],[0.033,0.677,0],[0.198,0.3,0]];',
					r * 0.17, r * 0.15, '', 'ExpressRoute Direct', null, null, this.getTagsForStencil(gn, 'expressroute express route direct', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'FHIR_Service.svg;points=[[0.502,0,0],[0.5,1,0],[0,0.6,0],[1,0.6,0],[0.992,0.212,0],[0.987,0.994,0],[0.013,0.994,0],[0.008,0.212,0]];',
					r * 0.17, r * 0.1486, '', 'FHIR Service', null, null, this.getTagsForStencil(gn, 'fhir service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Fiji.svg;points=[[0.498,0,0],[0.503,1,0],[0,0.5,0],[1,0.499,0],[1,0.225,0],[0.996,0.777,0],[0.004,0.78,0],[0,0.225,0]];',
					r * 0.135, r * 0.17, '', 'Fiji', null, null, this.getTagsForStencil(gn, 'fiji', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Grafana.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.982,0.007,0],[0.985,0.99,0],[0.015,0.99,0],[0.018,0.007,0]];',
					r * 0.17, r * 0.132, '', 'Grafana', null, null, this.getTagsForStencil(gn, 'grafana', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'HDI_AKS_Cluster.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.499,0],[1,0.5,0],[0.98,0.238,0],[0.974,0.767,0],[0.023,0.765,0],[0.02,0.238,0]];',
					r * 0.1511, r * 0.17, '', 'HDI AKS Cluster', null, null, this.getTagsForStencil(gn, 'hdi aks cluster', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_HPC_Workbench.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.993,0.125,0],[0.859,0.755,0],[0.138,0.752,0],[0.004,0.13,0]];',
					r * 0.139, r * 0.17, '', 'HPC Workbench', null, null, this.getTagsForStencil(gn, 'hpc workbench', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IcM_Troubleshooting.svg;points=[[0.443,0,0],[0.501,1,0],[0.135,0.5,0],[0.91,0.749,0],[0.712,0.123,0],[0.842,0.922,0],[0.365,0.99,0],[0.208,0.085,0]];',
					r * 0.17, r * 0.17, '', 'IcM Troubleshooting', null, null, this.getTagsForStencil(gn, 'icm troubleshooting', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Image_Definition.svg;points=[[0.5,0.003,0],[0.5,0.997,0],[0,0.5,0],[1,0.499,0],[0.87,0.176,0],[0.86,0.832,0],[0.01,0.992,0],[0.013,0.006,0]];',
					r * 0.17, r * 0.16, '', 'Image Definition', null, null, this.getTagsForStencil(gn, 'image definition', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Image_Version.svg;points=[[0.5,0,0],[0.5,0.882,0],[0,0.44,0],[0.938,0.5,0],[0.807,0.143,0],[0.94,0.922,0],[0.005,0.872,0],[0.013,0.003,0]];',
					r * 0.17, r * 0.17, '', 'Image Version', null, null, this.getTagsForStencil(gn, 'image version', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Instance_Pools.svg;points=[[0.524,0,0],[0.579,1,0],[0,0.617,0],[1,0.803,0],[0.8,0.005,0],[0.93,0.954,0],[0.015,0.992,0],[0.248,0.005,0]];',
					r * 0.1625, r * 0.16, '', 'Instance Pools', null, null, this.getTagsForStencil(gn, 'instance pools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Internet_Analyzer_Profiles.svg;points=[[0.497,0,0],[0.5,1,0],[0.003,0.456,0],[0.964,0.5,0],[0.692,0.078,0],[0.99,0.997,0],[0.093,0.659,0],[0.08,0.266,0]];',
					r * 0.17, r * 0.16, '', 'Internet Analyzer Profiles', null, null, this.getTagsForStencil(gn, 'internet analyzer profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Intune_Trends.svg;points=[[0.391,0.168,0],[0.5,1,0],[0.011,0.5,0],[1,0.497,0],[1,0.005,0],[1,0.99,0],[0.003,0.995,0]];',
					r * 0.142, r * 0.17, '', 'Intune Trends', null, null, this.getTagsForStencil(gn, 'intune trends', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Kubernetes_Fleet_Manager.svg;points=[[0.5,0,0],[0.5,1,0],[0.041,0.5,0],[0.956,0.5,0],[0.947,0.138,0],[1,1,0],[0,1,0],[0.048,0.14,0]];',
					r * 0.17, r * 0.17, '', 'Kubernetes Fleet Manager', null, null, this.getTagsForStencil(gn, 'kubernetes fleet manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Load_Testing.svg;points=[[0.4,0,0],[0.73,1,0],[0.169,0.5,0],[0.9,0.5,0],[0.582,0.006,0],[0.915,0.927,0],[0.018,0.81,0],[0.218,0.006,0]];',
					r * 0.17, r * 0.163, '', 'Load Testing', null, null, this.getTagsForStencil(gn, 'load testing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Load_Testing.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.497,0],[1,0.501,0],[1,0.25,0],[1,0.752,0],[0,0.747,0],[0,0.248,0]];',
					r * 0.148, r * 0.17, '', 'Load Testing', null, null, this.getTagsForStencil(gn, 'load testing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Local_Network_Gateways.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.758,0.242,0],[0.758,0.758,0],[0.242,0.758,0],[0.242,0.242,0]];',
					r * 0.17, r * 0.17, '', 'Local Network Gateways', null, null, this.getTagsForStencil(gn, 'local network gateways', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Log_Analytics_Query_Pack.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.98,0.023,0],[0.98,0.692,0],[0.013,0.967,0],[0.023,0.305,0]];',
					r * 0.17, r * 0.17, '', 'Log Analytics Query Pack', null, null, this.getTagsForStencil(gn, 'log analytics query pack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_DevOps_Pools.svg;points=[[0.5,0.018,0],[0.5,0.983,0],[0,0.499,0],[1,0.5,0],[0.995,0.123,0],[1,0.872,0],[0,0.872,0],[0,0.125,0]];',
					r * 0.17, r * 0.17, '', 'Managed DevOps Pools', null, null, this.getTagsForStencil(gn, 'managed devops pools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_File_Shares.svg;points=[[0.5,0.214,0],[0.5,0.791,0],[0,0.635,0],[0.981,0.5,0],[0.922,0.013,0],[0.987,0.967,0],[0.035,0.712,0],[0.283,0.28,0]];',
					r * 0.17, r * 0.17, '', 'Managed File Shares', null, null, this.getTagsForStencil(gn, 'managed file shares', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Managed_Instance_Apache_Cassandra.svg;points=[[0.198,0,0],[0.746,1,0],[0.104,0.5,0],[0.897,0.5,0],[0.895,0.298,0],[0.95,0.9,0],[0.025,0.755,0],[0.018,0.045,0]];',
					r * 0.17, r * 0.17, '', 'Managed Instance Apache Cassandra', null, null, this.getTagsForStencil(gn, 'managed instance apache cassandra', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Marketplace_Management.svg;points=[[0.582,0.005,0],[0.5,0.973,0],[0.014,0.501,0],[0.986,0.501,0],[0.976,0.255,0],[1,0.895,0],[0,0.94,0],[0.024,0.255,0]];',
					r * 0.145, r * 0.17, '', 'Marketplace Management', null, null, this.getTagsForStencil(gn, 'marketplace management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'MedTech_Service.svg;points=[[0.494,0,0],[0.5,0.896,0],[0,0.478,0],[1,0.613,0],[0.967,0.351,0],[0.895,1,0],[0.09,0.691,0],[0.085,0.272,0]];',
					r * 0.17, r * 0.1518, '', 'MedTech Service', null, null, this.getTagsForStencil(gn, 'medtech service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Microsoft_Discovery.svg;points=[[0.499,0,0],[0.5,1,0],[0.113,0.5,0],[0.887,0.5,0],[0.96,0.165,0],[0.935,0.806,0],[0.04,0.84,0],[0.055,0.201,0]];',
					r * 0.17, r * 0.1649, '', 'Microsoft Discovery', null, null, this.getTagsForStencil(gn, 'microsoft discovery science', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Mission_Landing_Zone.svg;points=[[0.514,0,0],[0.505,1,0],[0.001,0.5,0],[1,0.5,0],[0.717,0.08,0],[0.982,0.901,0],[0.025,0.909,0],[0.093,0.266,0]];',
					r * 0.17, r * 0.16, '', 'Mission Landing Zone', null, null, this.getTagsForStencil(gn, 'mission landing zone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Modular_Data_Center.svg;points=[[0.5,0.001,0],[0.52,0.998,0],[0.1,0.5,0],[1,0.468,0],[0.99,0.01,0],[0.997,0.915,0],[0.17,0.985,0]];',
					r * 0.17, r * 0.17, '', 'Modular Data Center', null, null, this.getTagsForStencil(gn, 'modular data center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Monitor_Dashboard.svg;points=[[0.453,0,0],[0.5,1,0],[0,0.407,0],[0.906,0.5,0],[0.885,0.006,0],[0.975,0.978,0],[0.018,0.809,0],[0.013,0.011,0]];',
					r * 0.17, r * 0.158, '', 'Monitor Dashboard', null, null, this.getTagsForStencil(gn, 'monitor dashboard', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Monitor_Health_Models.svg;points=[[0.5,0.064,0],[0.5,0.944,0],[0.075,0.5,0],[0.824,0.5,0],[0.825,0.06,0],[0.987,0.97,0],[0.09,0.045,0]];',
					r * 0.17, r * 0.17, '', 'Monitor Health Models', null, null, this.getTagsForStencil(gn, 'monitor health models', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Monitor_Pipeline.svg;points=[[0.422,0.01,0],[0.5,0.914,0],[0,0.517,0],[1,0.431,0],[0.972,0.333,0],[0.76,0.986,0],[0.085,0.754,0],[0.275,0.073,0]];',
					r * 0.17, r * 0.1228, '', 'Monitor Pipeline', null, null, this.getTagsForStencil(gn, 'monitor pipeline', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'MS_Dev_Box.svg;points=[[0.404,0,0],[0.496,0.994,0],[0.07,0.5,0],[0.993,0.57,0],[0.985,0.335,0],[0.815,0.992,0],[0.06,0.208,0]];',
					r * 0.17, r * 0.17, '', 'MS Dev Box', null, null, this.getTagsForStencil(gn, 'ms dev box', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Network_Function_Manager.svg;points=[[0.497,0,0],[0.499,1,0],[0,0.541,0],[1,0.542,0],[0.881,0.245,0],[0.912,0.927,0],[0.06,0.922,0],[0.119,0.245,0]];',
					r * 0.15, r * 0.17, '', 'Network Function Manager', null, null, this.getTagsForStencil(gn, 'network function manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Network_Function_Manager_Functions.svg;points=[[0.5,0.03,0],[0.5,1,0],[0,0.397,0],[0.71,0.5,0],[0.602,0.099,0],[0.995,0.994,0],[0.37,0.997,0],[0.115,0.105,0]];',
					r * 0.17, r * 0.155, '', 'Network Function Manager Functions', null, null, this.getTagsForStencil(gn, 'network function manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Network_Manager.svg;points=[[0.5,0.005,0],[0.5,0.929,0],[0.928,0.5,0],[0.827,0.223,0],[0.93,0.885,0],[0.006,0.218,0]];',
					r * 0.16, r * 0.17, '', 'Network Manager', null, null, this.getTagsForStencil(gn, 'network manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Network_Security_Perimeters.svg;points=[[0.583,0,0],[0.677,1,0],[0,0.419,0],[0.915,0.5,0],[0.765,0.123,0],[1,0.987,0],[0.123,0.765,0],[0.24,0.118,0]];',
					r * 0.17, r * 0.17, '', 'Network Security Perimeters', null, null, this.getTagsForStencil(gn, 'network security perimeters', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Open_Supply_Chain_Platform.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Open Supply Chain Platform', null, null, this.getTagsForStencil(gn, 'open supply chain platform', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Orbital.svg;points=[[0.505,0,0],[0.5,0.983,0],[0.015,0.5,0],[1,0.491,0],[0.865,0.153,0],[0.877,0.817,0],[0.065,0.927,0],[0.185,0.118,0]];',
					r * 0.17, r * 0.17, '', 'Orbital', null, null, this.getTagsForStencil(gn, 'orbital', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'OSConfig.svg;points=[[0.395,0,0],[0.395,1,0],[0,0.5,0],[1,0.395,0],[0.775,0.006,0],[0.775,0.994,0],[0.015,0.994,0],[0.015,0.006,0]];',
					r * 0.17, r * 0.1417, '', 'OSConfig', null, null, this.getTagsForStencil(gn, 'osconfig', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Peering_Service.svg;points=[[0.393,0,0],[0.613,1,0],[0,0.388,0],[0.98,0.5,0],[0.695,0.135,0],[0.896,0.882,0],[0.323,0.872,0],[0.107,0.12,0]];',
					r * 0.17, r * 0.1725, '', 'Peering Service', null, null, this.getTagsForStencil(gn, 'peering service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Peerings.svg;points=[[0.5,0.038,0],[0.5,0.918,0],[0.025,0.5,0],[1,0.447,0],[0.78,0.068,0],[0.945,0.598,0],[0.108,0.917,0],[0.1,0.373,0]];',
					r * 0.17, r * 0.1448, '', 'Peerings', null, null, this.getTagsForStencil(gn, 'peerings', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Endpoints.svg;points=[[0.5,0,0],[0.5,0.785,0],[0,0.684,0],[1,0.684,0],[0.72,0.994,0],[0.28,0.994,0]];',
					r * 0.17, r * 0.1617, '', 'Private Endpoints', null, null, this.getTagsForStencil(gn, 'private endpoints', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Mobile_Network.svg;points=[[0.514,0,0],[0.44,1,0],[0.02,0.5,0],[0.953,0.5,0],[0.69,0.075,0],[0.91,0.932,0],[0.123,0.939,0],[0.338,0.075,0]];',
					r * 0.17, r * 0.12, '', 'Private Mobile Network', null, null, this.getTagsForStencil(gn, 'private mobile network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Prometheus.svg;points=[[0.5,0,0],[0.499,1,0],[0,0.496,0],[1,0.504,0],[0.85,0.14,0],[0.862,0.847,0],[0.128,0.837,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Prometheus', null, null, this.getTagsForStencil(gn, 'prometheus monitoring metrics', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Quotas.svg;points=[[0.514,0,0],[0.502,1,0],[0.02,0.5,0],[0.95,0.5,0],[0.692,0.079,0],[0.902,0.939,0],[0.113,0.929,0],[0.345,0.068,0]];',
					r * 0.17, r * 0.12, '', 'Quotas', null, null, this.getTagsForStencil(gn, 'quotas', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Reserved_Capacity.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0,0.5,0],[1,0.501,0],[0.997,0.253,0],[0.997,0.747,0],[0.006,0.752,0],[0.003,0.253,0]];',
					r * 0.145, r * 0.17, '', 'Reserved Capacity', null, null, this.getTagsForStencil(gn, 'reserved capacity', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Reserved_Capacity_Groups.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0,0.5,0],[1,0.501,0],[0.997,0.253,0],[0.997,0.747,0],[0.006,0.752,0],[0.003,0.253,0]];',
					r * 0.145, r * 0.17, '', 'Reserved Capacity Groups', null, null, this.getTagsForStencil(gn, 'reserved capacity groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resiliency.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.997,0.5,0],[0.994,0.165,0],[0.859,0.797,0],[0.138,0.795,0],[0.006,0.165,0]];',
					r * 0.1453, r * 0.17, '', 'Resiliency', null, null, this.getTagsForStencil(gn, 'resiliency resilience', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Guard.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.994,0.125,0],[0.849,0.765,0],[0.148,0.762,0],[0.006,0.125,0]];',
					r * 0.1416, r * 0.17, '', 'Resource Guard', null, null, this.getTagsForStencil(gn, 'resource guard', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Resource_Mover.svg;points=[[0.535,0,0],[0.544,1,0],[0,0.568,0],[1,0.444,0],[1,0.22,0],[1,0.667,0],[0.083,0.737,0],[0.07,0.223,0]];',
					r * 0.14, r * 0.17, '', 'Resource Mover', null, null, this.getTagsForStencil(gn, 'resource mover', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'RTOS.svg;points=[[0.5,0.062,0],[0.5,0.94,0],[0.06,0.5,0],[0.939,0.5,0],[0.97,0.275,0],[0.895,0.87,0],[0.14,0.877,0],[0.14,0.123,0]];',
					r * 0.17, r * 0.17, '', 'RTOS', null, null, this.getTagsForStencil(gn, 'rtos', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Savings_Plan.svg;points=[[0.466,0,0],[0.5,0.932,0],[0,0.458,0],[0.932,0.5,0],[0.802,0.14,0],[0.945,0.91,0],[0.115,0.772,0],[0.11,0.085,0]];',
					r * 0.17, r * 0.17, '', 'Savings Plan', null, null, this.getTagsForStencil(gn, 'savings plan', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SCVMM_Management_Servers.svg;points=[[0.417,0,0],[0.486,1,0],[0.08,0.5,0],[1,0.768,0],[0.752,0.008,0],[0.967,0.887,0],[0.035,0.897,0],[0.09,0.003,0]];',
					r * 0.17, r * 0.1693, '', 'SCVMM Management Servers', null, null, this.getTagsForStencil(gn, 'scvmm management servers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Sonic_Dash.svg;points=[[0.508,0.003,0],[0.503,0.998,0],[0.161,0.5,0],[0.871,0.5,0],[0.871,0.21,0],[0.994,0.745,0],[0,0.74,0],[0.132,0.2,0]];',
					r * 0.155, r * 0.17, '', 'Sonic Dash', null, null, this.getTagsForStencil(gn, 'sonic dash', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Sphere.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.519,0],[0.997,0.519,0],[0.868,0.193,0],[0.953,0.867,0],[0.047,0.867,0],[0.132,0.193,0]];',
					r * 0.165, r * 0.17, '', 'Sphere', null, null, this.getTagsForStencil(gn, 'sphere', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SSH_Keys.svg;points=[[0.514,0,0],[0.5,1,0],[0,0.507,0],[1,0.552,0],[0.707,0.077,0],[0.917,0.745,0],[0.09,0.728,0],[0.085,0.292,0]];',
					r * 0.17, r * 0.15, '', 'SSH Keys', null, null, this.getTagsForStencil(gn, 'ssh keys', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Actions.svg;points=[[0.405,0,0],[0.62,1,0],[0,0.434,0],[1,0.618,0],[0.8,0.07,0],[0.912,0.825,0],[0.01,0.797,0],[0.013,0.07,0]];',
					r * 0.17, r * 0.17, '', 'Storage Actions', null, null, this.getTagsForStencil(gn, 'storage actions', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Storage_Mover.svg;points=[[0.5,0.121,0],[0.5,0.771,0],[0.061,0.5,0],[0.949,0.5,0],[0.69,0.176,0],[0.967,0.961,0],[0.03,0.984,0],[0.06,0.018,0]];',
					r * 0.17, r * 0.1672, '', 'Storage Mover', null, null, this.getTagsForStencil(gn, 'storage mover', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Tasks.svg;points=[[0.44,0,0],[0.5,0.95,0],[0,0.472,0],[1,0.75,0],[0.867,0.075,0],[0.942,0.912,0],[0.01,0.87,0],[0.01,0.078,0]];',
					r * 0.17, r * 0.17, '', 'Storage Tasks', null, null, this.getTagsForStencil(gn, 'storage tasks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Support_Center_Blue.svg;points=[[0.499,0.003,0],[0.5,0.772,0],[0,0.526,0],[1,0.527,0],[0.957,0.233,0],[0.997,0.762,0],[0.006,0.765,0],[0.04,0.233,0]];',
					r * 0.15, r * 0.17, '', 'Support Center Blue', null, null, this.getTagsForStencil(gn, 'support center blue', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Sustainability.svg;points=[[0.5,0,0],[0.512,1,0],[0,0.474,0],[0.884,0.5,0],[0.712,0.088,0],[0.872,0.857,0],[0.055,0.625,0],[0.298,0.075,0]];',
					r * 0.17, r * 0.17, '', 'Support Sustainability', null, null, this.getTagsForStencil(gn, 'sustainability', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Targets_Management.svg;points=[[0.501,0,0],[0.501,1,0],[0.013,0.501,0],[0.988,0.501,0],[0.718,0.282,0],[0.718,0.718,0],[0.282,0.718,0],[0.284,0.284,0]];',
					r * 0.17, r * 0.17, '', 'Targets Management', null, null, this.getTagsForStencil(gn, 'targets management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Template_Specs.svg;points=[[0.5,0.079,0],[0.5,0.921,0],[0.089,0.5,0],[0.911,0.5,0],[0.988,0.028,0],[0.988,0.972,0],[0.012,0.972,0],[0.012,0.028,0]];',
					r * 0.1425, r * 0.17, '', 'Template Specs', null, null, this.getTagsForStencil(gn, 'template specs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Test_Base.svg;points=[[0.514,0,0],[0.506,1,0],[0.02,0.5,0],[0.95,0.5,0],[0.682,0.068,0],[0.902,0.939,0],[0.12,0.936,0],[0.345,0.068,0]];',
					r * 0.17, r * 0.12, '', 'Test Base', null, null, this.getTagsForStencil(gn, 'test base', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Universal_Print.svg;points=[[0.512,0.003,0],[0.5,0.997,0],[0,0.525,0],[1,0.5,0],[0.877,0.193,0],[1,0.898,0],[0.095,0.758,0],[0.098,0.292,0]];',
					r * 0.175, r * 0.15, '', 'Universal Print', null, null, this.getTagsForStencil(gn, 'universal print', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Update_Center.svg;points=[[0.497,0.003,0],[0.502,0.998,0],[0,0.505,0],[1,0.5,0],[0.825,0.12,0],[0.847,0.865,0],[0.153,0.865,0],[0.175,0.12,0]];',
					r * 0.17, r * 0.17, '', 'Update Center', null, null, this.getTagsForStencil(gn, 'update center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Video_Analyzers.svg;points=[[0.512,0,0],[0.524,1,0],[0.02,0.5,0],[0.953,0.5,0],[0.692,0.078,0],[0.907,0.943,0],[0.108,0.926,0],[0.335,0.078,0]];',
					r * 0.17, r * 0.1211, '', 'Video Analyzers', null, null, this.getTagsForStencil(gn, 'update center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Video_Indexer.svg;points=[[0.5,0.229,0],[0.5,0.771,0],[0,0.5,0],[1,0.5,0],[0.003,0.987,0],[0.003,0.013,0]];',
					r * 0.15, r * 0.17, '', 'Video Indexer', null, null, this.getTagsForStencil(gn, 'video indexer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Enclaves.svg;points=[[0.5,0.007,0],[0.5,0.993,0],[0,0.501,0],[1,0.501,0],[0.856,0.23,0],[0.839,0.787,0],[0.161,0.787,0],[0.144,0.23,0]];',
					r * 0.1511, r * 0.17, '', 'Virtual Enclaves', null, null, this.getTagsForStencil(gn, 'virtual enclaves', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Virtual_Instance_for_SAP.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.987,0.006,0],[0.75,1,0],[0.25,1,0],[0.013,0.006,0]];',
					r * 0.17, r * 0.1571, '', 'Virtual Instance for SAP', null, null, this.getTagsForStencil(gn, 'virtual instance for sap', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'VM_Application_Definition.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.987,0.006,0],[0.75,1,0],[0.25,1,0],[0.013,0.006,0]];',
					r * 0.17, r * 0.157, '', 'VM Application Definition', null, null, this.getTagsForStencil(gn, 'vm virtual machine application definition', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'VM_Application_Version.svg;points=[[0.485,0,0],[0.5,0.892,0],[0,0.5,0],[0.97,0.5,0],[0.957,0.005,0],[0.942,0.917,0],[0.248,0.892,0],[0.01,0.008,0]];',
					r * 0.17, r * 0.17, '', 'VM Application Version', null, null, this.getTagsForStencil(gn, 'vm virtual machine application version', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/azure_vmware_solution/AVS.svg;points=[[0.511,0,0],[0.502,1,0],[0,0.559,0],[1,0.611,0],[0.695,0.072,0],[0.835,0.993,0],[0.175,0.996,0],[0.32,0.085,0]];',
					r * 0.17, r * 0.1355, '', 'VMWare Solution', null, null, this.getTagsForStencil(gn, 'vm virtual machine vmware solution', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'WAC.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.432,0],[1,0.83,0],[0.611,0.01,0],[1,1,0],[0.006,0.852,0],[0.006,0.013,0]];',
					r * 0.155, r * 0.17, '', 'WAC', null, null, this.getTagsForStencil(gn, 'wac windows admin center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'WAC_Installer.svg;points=[[0.5,0,0],[0.575,1,0],[0.09,0.5,0],[1,0.826,0],[0.64,0.005,0],[1,1,0],[0.048,0.947,0],[0.093,0.015,0]];',
					r * 0.17, r * 0.17, '', 'WAC Installer', null, null, this.getTagsForStencil(gn, 'wac windows admin center installer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_App_Database.svg;points=[[0.5,0.115,0],[0.5,0.9,0],[0.115,0.5,0],[1,0.5,0],[0.77,0.205,0],[0.977,0.957,0],[0.205,0.77,0],[0.07,0.09,0]];',
					r * 0.17, r * 0.17, '', 'Web App Database', null, null, this.getTagsForStencil(gn, 'web app database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_Jobs.svg;points=[[0.425,0,0],[0.218,1,0],[0.003,0.411,0],[0.997,0.586,0],[0.744,0.13,0],[0.964,0.775,0],[0.057,0.93,0],[0.098,0.145,0]];',
					r * 0.165, r * 0.17, '', 'Web Jobs', null, null, this.getTagsForStencil(gn, 'web jobs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Windows_Notification_Services.svg;points=[[0.5,0,0],[0.431,1,0],[0,0.499,0],[0.965,0.5,0],[0.99,0.01,0],[0.645,1,0],[0.218,1,0],[0.005,0.22,0]];',
					r * 0.17, r * 0.17, '', 'Windows Notification Services', null, null, this.getTagsForStencil(gn, 'windows notification services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Windows_Virtual_Desktop.svg;points=[[0.499,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.842,0.133,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Windows Virtual Desktop', null, null, this.getTagsForStencil(gn, 'windows virtual desktop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Worker_Container_App.svg;points=[[0.5,0,0],[0.5,0.97,0],[0,0.482,0],[1,0.478,0],[0.855,0.024,0],[0.825,0.835,0],[0.19,0.974,0],[0.19,0.116,0]];',
					r * 0.17, r * 0.165, '', 'Worker Container App', null, null, this.getTagsForStencil(gn, 'worker container app', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Workspace_Gateway.svg;points=[[0.469,0,0],[0.549,1,0],[0.007,0.479,0],[0.993,0.47,0],[0.635,0.067,0],[0.837,0.9,0],[0.095,0.693,0],[0.095,0.265,0]];',
				r * 0.17, r * 0.1417, '', 'Workspace Gateway', null, null, this.getTagsForStencil(gn, 'workspace gateway', dt).join(' '))
			];
			
		this.addPalette('azure2Other', 'Azure / Other', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addAzure2PowerPlatformPalette = function(gn, r, sb, s)
	{
		var dt = 'azure power platform ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'AIBuilder.svg;points=[[0.5,0.044,0],[0.5,0.956,0],[0,0.526,0],[1,0.526,0],[0.9,0.183,0],[0.82,0.86,0],[0.18,0.86,0],[0.105,0.178,0]];',
					r * 0.17, r * 0.17, '', 'AI Builder', null, null, this.getTagsForStencil(gn, 'ai artificial intelligence builder', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CopilotStudio.svg;points=[[0.5,0.025,0],[0.5,0.975,0],[0.003,0.5,0],[0.998,0.5,0],[0.98,0.158,0],[0.725,0.937,0],[0.023,0.844,0],[0.275,0.063,0]];',
				r * 0.17, r * 0.1558, '', 'Copilot Studio', null, null, this.getTagsForStencil(gn, 'copilot studio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Dataverse.svg;points=[[0.424,0,0],[0.583,1,0],[0,0.591,0],[1,0.407,0],[0.907,0.056,0],[0.837,0.876,0],[0.085,0.938,0],[0.165,0.121,0]];',
				r * 0.17, r * 0.131, '', 'Dataverse', null, null, this.getTagsForStencil(gn, 'dataverse', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'PowerApps.svg;points=[[0.5,0.049,0],[0.5,0.951,0],[0.003,0.5,0],[0.998,0.5,0],[0.59,0.008,0],[0.592,0.989,0],[0.393,0.992,0],[0.39,0.011,0]];',
				r * 0.17, r * 0.1629, '', 'PowerApps', null, null, this.getTagsForStencil(gn, 'powerapps power apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'PowerAutomate.svg;points=[[0.5,0,0],[0.5,1,0],[0.302,0.5,0],[1,0.5,0],[0.662,0.007,0],[0.662,0.993,0],[0.015,0.99,0],[0.015,0.01,0]];',
				r * 0.17, r * 0.1346, '', 'PowerAutomate', null, null, this.getTagsForStencil(gn, 'powerautomate power automate', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'PowerBI.svg;points=[[0.778,0,0],[0.5,1,0],[0.036,0.5,0],[1,0.5,0],[0.993,0.018,0],[0.99,0.985,0],[0.007,0.982,0]];',
				r * 0.1275, r * 0.17, '', 'PowerBI', null, null, this.getTagsForStencil(gn, 'powerbi power bi', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'PowerFx.svg;points=[[0.522,0,0],[0.5,1,0],[0.089,0.5,0],[0.911,0.5,0],[0.805,0.008,0],[0.985,0.989,0],[0.015,0.989,0],[0.108,0.066,0]];',
				r * 0.17, r * 0.1623, '', 'PowerFx', null, null, this.getTagsForStencil(gn, 'powerfx power fx effects', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'PowerPages.svg;points=[[0.5,0,0],[0.5,1,0],[0.114,0.5,0],[0.889,0.5,0],[0.865,0.263,0],[0.99,0.645,0],[0.143,0.745,0],[0.023,0.343,0]];',
				r * 0.17, r * 0.17, '', 'PowerPages', null, null, this.getTagsForStencil(gn, 'powerpages power pages', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'PowerPlatform.svg;points=[[0.608,0.005,0],[0.087,0.5,0],[1,0.169,0],[0.965,0.068,0],[0.817,0.547,0],[0.143,0.977,0],[0.344,0.018,0]];',
				r * 0.1608, r * 0.17, '', 'PowerPlatform', null, null, this.getTagsForStencil(gn, 'powerplatform power platform', dt).join(' '))
		];
			
		this.addPalette('azure2Power Platform', 'Azure / Power Platform', false, mxUtils.bind(this, function(content)
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
			this.createVertexTemplateEntry(s + 'Azure_Cloud_Shell.svg;points=[[0.435,0.004,0],[0.5,0.993,0],[0,0.498,0],[1,0.814,0],[0.862,0.004,0],[0.952,0.953,0],[0.008,0.992,0],[0.008,0.004,0]];',
					r * 0.17, r * 0.12, '', 'Cloud Shell', null, null, this.getTagsForStencil(gn, 'cloud shell', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IoT_Edge.svg;points=[[0.514,0,0],[0.499,1,0],[0.003,0.451,0],[0.998,0.492,0],[0.707,0.069,0],[0.917,0.665,0],[0.408,0.992,0],[0.09,0.257,0]];',
					r * 0.17, r * 0.1675, '', 'IoT Edge', null, null, this.getTagsForStencil(gn, 'iot internet of things edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Private_Link_Hub.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.497,0],[1,0.501,0],[1,0.25,0],[1,0.752,0],[0,0.747,0],[0,0.248,0]];',
					r * 0.15, r * 0.1725, '', 'Private Link Hub', null, null, this.getTagsForStencil(gn, 'private link hub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'RTOS.svg;points=[[0.5,0.062,0],[0.5,0.94,0],[0.06,0.5,0],[0.939,0.5,0],[0.97,0.275,0],[0.895,0.87,0],[0.14,0.877,0],[0.14,0.123,0]];',
					r * 0.17, r * 0.17, '', 'RTOS', null, null, this.getTagsForStencil(gn, 'rtos', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Sphere.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.519,0],[0.997,0.519,0],[0.868,0.193,0],[0.953,0.867,0],[0.047,0.867,0],[0.132,0.193,0]];',
					r * 0.165, r * 0.17, '', 'Sphere', null, null, this.getTagsForStencil(gn, 'sphere', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Static_Apps.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.175, r * 0.14, '', 'Static Apps', null, null, this.getTagsForStencil(gn, 'static apps', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Time_Series_Data_Sets.svg;points=[[0.5,0.003,0],[0.502,0.998,0],[0,0.499,0],[1,0.499,0],[0.976,0.093,0],[0.983,0.9,0],[0.017,0.9,0],[0.014,0.103,0]];',
					r * 0.12, r * 0.16, '', 'Time Series Data Sets', null, null, this.getTagsForStencil(gn, 'time series data sets', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Web_Environment.svg;points=[[0.425,0,0],[0.218,1,0],[0.003,0.411,0],[0.997,0.586,0],[0.744,0.13,0],[0.964,0.775,0],[0.057,0.93,0],[0.098,0.145,0]];',
					r * 0.16, r * 0.165, '', 'Web Environment', null, null, this.getTagsForStencil(gn, 'web environment', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Workbooks.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.962,0.015,0],[0.975,0.975,0],[0.025,0.975,0],[0.038,0.015,0]];',
					r * 0.18, r * 0.18, '', 'Workbooks', null, null, this.getTagsForStencil(gn, 'workbooks', dt).join(' '))

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
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/identity/Managed_Identities.svg;points=[[0.5,0.01,0],[0.5,0.941,0],[0.089,0.5,0],[1,0.608,0],[0.748,0.307,0],[0.762,0.994,0],[0.003,0.613,0],[0.247,0.307,0]];',
					r * 0.17, r * 0.165, '', 'AD Authentication Methods', null, null, this.getTagsForStencil(gn, 'ad authentication methods', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/identity/Azure_AD_Identity_Protection.svg;points=[[0.5,0.005,0],[0.496,1,0],[0.111,0.5,0],[0.889,0.5,0],[0.748,0.322,0],[1,0.646,0],[0.005,0.649,0],[0.248,0.321,0]];',
					r * 0.17, r * 0.17, '', 'AD Identity Protection', null, null, this.getTagsForStencil(gn, 'ad identity protection', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/identity/PIM.svg;points=[[0.5,0.092,0],[0.819,1,0],[0,0.482,0],[1,0.839,0],[0.722,0.105,0],[0.963,0.94,0],[0.003,0.862,0],[0.006,0.1,0]];',
					r * 0.15, r * 0.17, '', 'AD Privileged Identity Management', null, null, this.getTagsForStencil(gn, 'ad privileged identity management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_AD_Risky_Signins.svg;points=[[0.445,0,0],[0.5,0.973,0],[0,0.494,0],[0.95,0.5,0],[0.807,0.148,0],[0.992,0.987,0],[0.091,0.852,0],[0.083,0.153,0]];',
					r * 0.1694, r * 0.17, '', 'AD Risky Signins', null, null, this.getTagsForStencil(gn, 'ad risky signins', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_AD_Risky_Users.svg;points=[[0.37,0,0],[0.5,0.968,0],[0,0.5,0],[0.74,0.5,0],[0.53,0.073,0],[0.995,0.977,0],[0,1,0],[0.235,0.048,0]];',
					r * 0.17, r * 0.17, '', 'AD Risky Users', null, null, this.getTagsForStencil(gn, 'ad risky users', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Application_Security_Groups.svg;points=[[0.5,0,0],[0.503,1,0],[0,0.5,0],[1,0.5,0],[0.99,0.125,0],[0.845,0.77,0],[0.146,0.76,0],[0.007,0.125,0]];',
					r * 0.14, r * 0.17, '', 'Application Security Groups', null, null, this.getTagsForStencil(gn, 'application security groups', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Conditional_Access.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0,0.5,0],[1,0.5,0],[0.993,0.13,0],[0.854,0.757,0],[0.152,0.765,0],[0.007,0.13,0]];',
					r * 0.14, r * 0.17, '', 'Conditional Access', null, null, this.getTagsForStencil(gn, 'conditional access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Defender.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.997,0.5,0],[0.99,0.125,0],[0.848,0.765,0],[0.162,0.775,0],[0.01,0.125,0]];',
					r * 0.14, r * 0.17, '', 'Defender', null, null, this.getTagsForStencil(gn, 'defender', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Detonation.svg;points=[[0.601,0.003,0],[0.5,0.766,0],[0.216,0.5,0],[1,0.39,0],[0.897,0.128,0],[0.897,0.652,0],[0.011,0.967,0],[0.307,0.125,0]];',
					r * 0.165, r * 0.17, '', 'Detonation', null, null, this.getTagsForStencil(gn, 'detonation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ExtendedSecurityUpdates.svg;points=[[0.439,0,0],[0.5,0.95,0],[0.008,0.5,0],[0.899,0.5,0],[0.868,0.125,0],[0.926,0.895,0],[0.178,0.787,0],[0.009,0.123,0]];',
					r * 0.16, r * 0.175, '', 'Extended Security Updates', null, null, this.getTagsForStencil(gn, 'extended security updates', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Identity_Secure_Score.svg;points=[[0.5,0,0],[0.5,1,0],[0.285,0.5,0],[0.715,0.5,0],[0.98,0.14,0],[0.794,0.995,0],[0.209,0.997,0],[0.022,0.138,0]];',
					r * 0.1548, r * 0.17, '', 'Identity Secure Score', null, null, this.getTagsForStencil(gn, 'identity secure score', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/identity/Azure_Information_Protection.svg;points=[[0.492,0,0],[0.498,1,0],[0.007,0.5,0],[0.993,0.5,0],[0.79,0.115,0],[0.99,0.985,0],[0.014,0.99,0],[0.193,0.115,0]];',
					r * 0.128, r * 0.17, '', 'Information Protection', null, null, this.getTagsForStencil(gn, 'information protection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Key_Vaults.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.855,0.145,0],[0.865,0.845,0],[0.135,0.845,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Key Vaults', null, null, this.getTagsForStencil(gn, 'key vaults', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Keys.svg;points=[[0.516,0,0],[0.431,1,0],[0,0.421,0],[1,0.459,0],[0.736,0.09,0],[0.965,0.767,0],[0.341,0.99,0],[0.064,0.265,0]];',
					r * 0.18, r * 0.19, '', 'Keys', null, null, this.getTagsForStencil(gn, 'keys', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'MS_Defender_EASM.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.993,0.125,0],[0.849,0.765,0],[0.16,0.775,0],[0.007,0.125,0]];',
					r * 0.1386, r * 0.17, '', 'MS Defender EASM', null, null, this.getTagsForStencil(gn, 'ms defender easm', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Multifactor_Authentication.svg;points=[[0.502,0,0],[0.5,1,0],[0,0.453,0],[1,0.455,0],[0.773,0.103,0],[0.825,0.842,0],[0.184,0.85,0],[0.237,0.098,0]];',
					r * 0.1385, r * 0.17, '', 'Multifactor Authentication', null, null, this.getTagsForStencil(gn, 'multifactor authentication', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Security_Center.svg;points=[[0.5,0.005,0],[0.5,0.995,0],[0,0.5,0],[1,0.5,0],[0.993,0.13,0],[0.854,0.757,0],[0.143,0.755,0],[0.007,0.13,0]];',
					r * 0.14, r * 0.17, '', 'Security Center', null, null, this.getTagsForStencil(gn, 'security center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Sentinel.svg;points=[[0.5,0,0],[0.503,1,0],[0,0.5,0],[1,0.5,0],[0.99,0.125,0],[0.845,0.77,0],[0.146,0.76,0],[0.007,0.125,0]];',
					r * 0.14, r * 0.17, '', 'Sentinel', null, null, this.getTagsForStencil(gn, 'sentinel', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/identity/User_Settings.svg;points=[[0.384,0,0],[0.381,1,0],[0.189,0.5,0],[1,0.467,0],[0.872,0.144,0],[0.735,0.985,0],[0.025,0.985,0],[0.243,0.06,0]];',
					r * 0.17, r * 0.1423, '', 'User Settings', null, null, this.getTagsForStencil(gn, 'user settings', dt).join(' '))
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
			this.createVertexTemplateEntry(s + 'Data_Box.svg;points=[[0.514,0,0],[0.526,1,0],[0,0.465,0],[1,0.508,0],[0.717,0.079,0],[0.922,0.684,0],[0.098,0.681,0],[0.095,0.251,0]];',
					r * 0.1775, r * 0.17, '', 'Data Box', null, null, this.getTagsForStencil(gn, 'data box', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Box_Edge.svg;points=[[0.546,0,0],[0.5,0.923,0],[0.058,0.5,0],[0.975,0.5,0],[0.715,0.074,0],[0.915,0.867,0],[0.09,0.951,0],[0.38,0.07,0]];',
					r * 0.1675, r * 0.12, '', 'Data Box Edge', null, null, this.getTagsForStencil(gn, 'data box edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Lake_Storage_Gen1.svg;points=[[0.5,0.083,0],[0.5,1,0],[0.003,0.498,0],[0.998,0.554,0],[0.99,0.114,0],[0.987,0.996,0],[0.013,0.996,0],[0.013,0.004,0]];',
					r * 0.16, r * 0.13, '', 'Data Lake Storage Gen1', null, null, this.getTagsForStencil(gn, 'data lake storage gen1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Share_Invitations.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.987,0.008,0],[0.987,0.992,0],[0.013,0.992,0],[0.013,0.008,0]];',
					r * 0.17, r * 0.112, '', 'Data Share Invitations', null, null, this.getTagsForStencil(gn, 'data share invitations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Shares.svg;points=[[0.5,0.026,0],[0.5,0.974,0],[0,0.499,0],[0.791,0.5,0],[0.97,0.108,0],[0.955,0.953,0],[0.025,0.915,0],[0.025,0.085,0]];',
					r * 0.16, r * 0.1375, '', 'Data Shares', null, null, this.getTagsForStencil(gn, 'data shares', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Data_Virtualization.svg;points=[[0.17,0,0],[0.83,1,0],[0,0.17,0],[1,0.83,0],[0.802,0.19,0],[0.962,0.94,0],[0.19,0.802,0],[0.06,0.038,0]];',
					r * 0.17, r * 0.17, '', 'Data Virtualization', null, null, this.getTagsForStencil(gn, 'data virtualization', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Fileshare.svg;points=[[0.5,0.214,0],[0.5,0.791,0],[0,0.635,0],[0.981,0.5,0],[0.925,0.015,0],[0.985,0.97,0],[0.035,0.712,0],[0.283,0.28,0]];',
					r * 0.17, r * 0.17, '', 'Fileshare', null, null, this.getTagsForStencil(gn, 'fileshare', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_HCP_Cache.svg;points=[[0.512,0.005,0],[0.5,0.995,0],[0,0.496,0],[1,0.54,0],[0.712,0.084,0],[0.92,0.989,0],[0.09,0.711,0],[0.093,0.281,0]];',
					r * 0.17, r * 0.1575, '', 'HCP Cache', null, null, this.getTagsForStencil(gn, 'hcp cache', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Import_Export_Jobs.svg;points=[[0.517,0,0],[0.517,1,0],[0,0.427,0],[1,0.466,0],[0.738,0.09,0],[0.952,0.595,0],[0.068,0.592,0],[0.061,0.27,0]];',
					r * 0.16, r * 0.1675, '', 'Import Export Jobs', null, null, this.getTagsForStencil(gn, 'import export jobs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_NetApp_Files.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'NetApp Files', null, null, this.getTagsForStencil(gn, 'netapp files', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Recovery_Services_Vaults.svg;points=[[0.5,0.043,0],[0.405,1,0],[0,0.763,0],[1,0.432,0],[0.775,0.058,0],[0.72,0.954,0],[0.078,0.945,0],[0.305,0.225,0]];',
					r * 0.1725, r * 0.15, '', 'Recovery Services Vaults', null, null, this.getTagsForStencil(gn, 'recovery services vaults', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Stack_Edge.svg;points=[[0.514,0,0],[0.5,1,0],[0.018,0.5,0],[0.95,0.5,0],[0.682,0.068,0],[0.902,0.939,0],[0.118,0.939,0],[0.345,0.068,0]];',
					r * 0.17, r * 0.12, '', 'Stack Edge', null, null, this.getTagsForStencil(gn, 'stack edge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Accounts.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'Storage Accounts', null, null, this.getTagsForStencil(gn, 'storage accounts', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Accounts_Classic.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.1625, r * 0.13, '', 'Storage Accounts (Classic)', null, null, this.getTagsForStencil(gn, 'storage accounts classic', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Explorer.svg;points=[[0.157,0,0],[0.499,1,0],[0,0.496,0],[1,0.5,0],[0.994,0.375,0],[0.994,0.99,0],[0.003,0.987,0],[0.003,0.005,0]];',
					r * 0.146, r * 0.17, '', 'Storage Explorer', null, null, this.getTagsForStencil(gn, 'storage explorer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Hubs.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.937,0.04,0],[0.957,0.94,0],[0.04,0.937,0],[0.06,0.043,0]];',
					r * 0.17, r * 0.17, '', 'Storage Hubs', null, null, this.getTagsForStencil(gn, 'storage hubs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Storage_Sync_Services.svg;points=[[0.514,0,0],[0.532,1,0],[0,0.535,0],[1,0.584,0],[0.702,0.076,0],[0.912,0.792,0],[0.1,0.777,0],[0.093,0.301,0]];',
					r * 0.18, r * 0.15, '', 'Storage Sync Services', null, null, this.getTagsForStencil(gn, 'storage sync services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'StorSimple_Data_Managers.svg;points=[[0.492,0,0],[0.505,1,0],[0,0.499,0],[1,0.504,0],[0.976,0.095,0],[0.98,0.905,0],[0.014,0.897,0],[0.014,0.1,0]];',
					r * 0.12, r * 0.16, '', 'StorSimple Data Managers', null, null, this.getTagsForStencil(gn, 'storsimple data managers', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'StorSimple_Device_Managers.svg;points=[[0.514,0,0],[0.631,1,0],[0,0.486,0],[1,0.531,0],[0.702,0.069,0],[0.74,1,0],[0.1,0.707,0],[0.09,0.276,0]];',
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
			this.createVertexTemplateEntry(s + 'Agentic_Web_Apps.svg;points=[[0.5,0.04,0],[0.5,0.965,0],[0.009,0.5,0],[1,0.595,0],[0.885,0.289,0],[0.88,0.902,0],[0.018,0.792,0],[0.125,0.09,0]];',
					r * 0.17, r * 0.1475, '', 'Agentic Web Apps', null, null, this.getTagsForStencil(gn, 'agentic web apps ai', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'API_Center.svg;points=[[0.5,0.265,0],[0.136,1,0],[0,0.861,0],[1,0.416,0],[0.967,0.333,0],[0.712,0.872,0],[0.048,0.967,0],[0.135,0.015,0]];',
				r * 0.17, r * 0.17, '', 'API Center', null, null, this.getTagsForStencil(gn, 'api center', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/devops/API_Connections.svg;points=[[0.5,0.007,0],[0.5,0.993,0],[0.015,0.5,0],[0.985,0.5,0],[0.897,0.341,0],[0.91,0.936,0],[0.093,0.647,0],[0.09,0.064,0]];',
				r * 0.17, r * 0.1133, '', 'API Connections', null, null, this.getTagsForStencil(gn, 'api connections application programming interface', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/API_Management_Services.svg;points=[[0.512,0,0],[0.477,1,0],[0,0.496,0],[1,0.541,0],[0.717,0.084,0],[0.92,0.729,0],[0.09,0.712,0],[0.085,0.285,0]];',
					r * 0.17, r * 0.1575, '', 'API Management Services', null, null, this.getTagsForStencil(gn, 'api application programming interface management services', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/App_Service_Certificates.svg;points=[[0.5,0,0],[0.5,0.774,0],[0,0.387,0],[1,0.388,0],[0.987,0.006,0],[0.985,0.77,0],[0.093,0.997,0],[0.013,0.006,0]];',
					r * 0.17, r * 0.155, '', 'App Service Certificates', null, null, this.getTagsForStencil(gn, 'app service certificates', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/App_Service_Domains.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.17, r * 0.1375, '', 'App Service Domains', null, null, this.getTagsForStencil(gn, 'app service domains', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/App_Service_Environments.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.98,0.018,0],[0.985,0.977,0],[0.015,0.977,0],[0.02,0.018,0]];',
					r * 0.17, r * 0.17, '', 'App Service Environments', null, null, this.getTagsForStencil(gn, 'app service environments', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/App_Service_Plans.svg;points=[[0.5,0,0],[0.43,1,0],[0.005,0.5,0],[0.787,0.5,0],[0.582,0.008,0],[0.942,0.947,0],[0.013,0.99,0],[0.02,0.003,0]];',
					r * 0.17, r * 0.17, '', 'App Service Plans', null, null, this.getTagsForStencil(gn, 'app service plans', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/App_Services.svg;points=[[0.497,0,0],[0.504,1,0],[0,0.499,0],[1,0.5,0],[0.865,0.153,0],[0.875,0.835,0],[0.125,0.835,0],[0.133,0.155,0]];',
					r * 0.17, r * 0.17, '', 'App Services', null, null, this.getTagsForStencil(gn, 'app services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'App_Space.svg;points=[[0.5,0.081,0],[0.5,0.919,0],[0,0.477,0],[0.999,0.5,0],[0.99,0.005,0],[0.992,0.985,0],[0.113,0.765,0],[0.063,0.118,0]];',
					r * 0.17, r * 0.17, '', 'App Space', null, null, this.getTagsForStencil(gn, 'app space', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/app_services/Search_Services.svg;points=[[0.512,0,0],[0.524,1,0],[0.02,0.5,0],[0.95,0.5,0],[0.69,0.077,0],[0.897,0.948,0],[0.108,0.92,0],[0.34,0.073,0]];',
					r * 0.17, r * 0.1228, '', 'Cognitive Search', null, null, this.getTagsForStencil(gn, 'cognitive search', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/ai_machine_learning/Cognitive_Services.svg;points=[[0.514,0,0],[0.52,1,0],[0.02,0.5,0],[0.953,0.5,0],[0.682,0.068,0],[0.895,0.95,0],[0.11,0.925,0],[0.33,0.082,0]];',
					r * 0.17, r * 0.12, '', 'Cognitive Services', null, null, this.getTagsForStencil(gn, 'cognitive services', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/networking/Front_Doors.svg;points=[[0.514,0,0],[0.504,1,0],[0,0.507,0],[1,0.554,0],[0.707,0.077,0],[0.932,0.733,0],[0.09,0.728,0],[0.085,0.292,0]];',
					r * 0.17, r * 0.15, '', 'Front Door and CDN Profiles', null, null, this.getTagsForStencil(gn, 'front door and cdn profiles', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Azure_Media_Service.svg;points=[[0.499,0,0],[0.496,1,0],[0,0.497,0],[1,0.502,0],[0.87,0.163,0],[0.837,0.87,0],[0.163,0.87,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'Media Service', null, null, this.getTagsForStencil(gn, 'media service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Notification_Hub_Namespaces.svg;points=[[0.5,0,0],[0.675,1,0],[0,0.424,0],[1,0.424,0],[0.992,0.012,0],[0.992,0.835,0],[0.015,0.844,0],[0.008,0.012,0]];',
					r * 0.1675, r * 0.14, '', 'Notification Hub Namespaces', null, null, this.getTagsForStencil(gn, 'notification hub namespaces', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/analytics/Power_Platform.svg;points=[[0.61,0,0],[0.086,0.5,0],[1,0.164,0],[0.966,0.063,0],[0.814,0.552,0],[0.147,0.987,0],[0.343,0.013,0]];',
					r * 0.1623, r * 0.17, '', 'Power Platform', null, null, this.getTagsForStencil(gn, 'power platform', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SignalR.svg;points=[[0.497,0,0],[0.5,0.998,0],[0,0.502,0],[1,0.496,0],[0.87,0.163,0],[0.867,0.837,0],[0.133,0.837,0],[0.148,0.143,0]];',
					r * 0.17, r * 0.17, '', 'SignalR', null, null, this.getTagsForStencil(gn, 'signalr', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/compute/Azure_Spring_Cloud.svg;points=[[0.5,0.126,0],[0.5,0.794,0],[0.188,0.5,0],[0.845,0.5,0],[0.997,0.005,0],[0.997,0.995,0],[0.003,0.995,0],[0.003,0.005,0]];',
					r * 0.17, r * 0.17, '', 'Spring Apps', null, null, this.getTagsForStencil(gn, 'spring apps', dt).join(' ')),
			this.createVertexTemplateEntry('image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/azure2/preview/Static_Apps.svg;points=[[0.5,0,0],[0.5,1,0],[0.003,0.5,0],[0.998,0.5,0],[0.985,0.007,0],[0.985,0.993,0],[0.015,0.993,0],[0.015,0.007,0]];',
					r * 0.17, r * 0.135, '', 'Static Apps', null, null, this.getTagsForStencil(gn, 'static apps', dt).join(' '))
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
