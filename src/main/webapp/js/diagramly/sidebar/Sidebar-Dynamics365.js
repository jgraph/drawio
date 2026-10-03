/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	// Adds Dynamics365 shapes
	Sidebar.prototype.addDynamics365Palette = function()
	{
		var gn = 'dynamics365';
		var r = 400;
		var sb = this;
		var s = 'image;aspect=fixed;html=1;align=center;fontSize=12;image=img/lib/dynamics365/';
		
		this.setCurrentSearchEntryLibrary('dynamics365', 'dynamics365App');
		this.addDynamics365AppPalette(gn, r, sb, s);
		this.setCurrentSearchEntryLibrary('dynamics365', 'dynamics365Mixed Reality');
		this.addDynamics365MixedRealityPalette(gn, r, sb, s);
		this.setCurrentSearchEntryLibrary('dynamics365', 'dynamics365Product Family');
		this.addDynamics365ProductFamilyPalette(gn, r, sb, s);
		this.setCurrentSearchEntryLibrary('dynamics365', 'dynamics365Sub App');
		this.addDynamics365SubAppPalette(gn, r, sb, s);
		this.setCurrentSearchEntryLibrary();
	};

	Sidebar.prototype.addDynamics365AppPalette = function(gn, r, sb, s)
	{
		var dt = 'app ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'BusinessCentral.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.501,0],[0.812,0.193,0],[0.835,0.785,0],[0.19,0.812,0],[0.19,0.188,0]];',
				r * 0.17, r * 0.17, '', 'Business Central', null, null, this.getTagsForStencil(gn, 'business central', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Commerce.svg;points=[[0.5,0.071,0],[0.487,1,0],[0.076,0.5,0],[1,0.5,0],[0.98,0.078,0],[0.8,0.994,0],[0.178,0.994,0],[0.015,0.009,0]];',
				r * 0.17, r * 0.1488, '', 'Commerce', null, null, this.getTagsForStencil(gn, 'commerce', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ConnectedStore.svg;points=[[0.714,0,0],[0.714,1,0],[0.005,0.5,0],[0.859,0.5,0],[0.865,0.013,0],[0.87,0.98,0],[0.14,0.74,0],[0.14,0.258,0]];',
				r * 0.17, r * 0.17, '', 'Connected Store', null, null, this.getTagsForStencil(gn, 'connected store', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CoreHR.svg;points=[[0.5,0,0],[0.499,1,0],[0,0.5,0],[1,0.501,0],[0.987,0.013,0],[0.987,0.987,0],[0.01,0.985,0],[0.013,0.013,0]];',
				r * 0.17, r * 0.17, '', 'Core HR', null, null, this.getTagsForStencil(gn, 'core hr human resources', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CustomerInsights.svg;points=[[0.5,0,0],[0.5,0.976,0],[0.025,0.5,0],[0.975,0.5,0],[0.765,0.113,0],[0.912,0.875,0],[0.083,0.87,0],[0.258,0.09,0]];',
				r * 0.17, r * 0.17, '', 'Customer Insights', null, null, this.getTagsForStencil(gn, 'customer insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CustomerService.svg;points=[[0.5,0.225,0],[0.5,1,0],[0.105,0.5,0],[0.895,0.5,0],[0.985,0.009,0],[0.015,0.009,0]];',
				r * 0.17, r * 0.1488, '', 'Customer Service', null, null, this.getTagsForStencil(gn, 'customer service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CustomerServiceInsights.svg;points=[[0.709,0,0],[0.292,1,0],[0,0.511,0],[1,0.551,0],[0.975,0.225,0],[0.992,0.86,0],[0.005,0.755,0],[0.013,0.26,0]];',
				r * 0.17, r * 0.17, '', 'Customer Service Insights', null, null, this.getTagsForStencil(gn, 'customer service insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'CustomerVoice.svg;points=[[0.515,0.043,0],[0.481,0.958,0],[0,0.481,0],[1,0.519,0],[0.865,0.183,0],[0.85,0.87,0],[0.13,0.812,0],[0.178,0.103,0]];',
				r * 0.17, r * 0.17, '', 'Customer Voice', null, null, this.getTagsForStencil(gn, 'customer voice', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'FieldService.svg;points=[[0.492,0,0],[0.5,0.997,0],[0,0.465,0],[1,0.467,0],[0.755,0.008,0],[0.795,0.858,0],[0.2,0.856,0],[0.228,0.011,0]];',
				r * 0.17, r * 0.1594, '', 'Field Service', null, null, this.getTagsForStencil(gn, 'field service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Finance.svg;points=[[0.691,0,0],[0.5,1,0],[0.001,0.5,0],[1,0.592,0],[0.98,0.19,0],[0.98,0.995,0],[0.02,0.995,0]];',
				r * 0.17, r * 0.168, '', 'Finance', null, null, this.getTagsForStencil(gn, 'finance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Finance_Operations.svg;points=[[0.389,0,0],[0.391,1,0],[0.198,0.5,0],[1,0.5,0],[0.007,0.705,0],[0.013,0.288,0]];',
				r * 0.1381, r * 0.17, '', 'Finance Operations', null, null, this.getTagsForStencil(gn, 'finance operations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'FraudProtection.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.455,0],[1,0.455,0],[0.994,0.188,0],[0.957,0.785,0],[0.06,0.802,0],[0.006,0.188,0]];',
				r * 0.1503, r * 0.17, '', 'Fraud Protection', null, null, this.getTagsForStencil(gn, 'fraud protection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'IntelligentOrderManagement.svg;points=[[0.5,0.013,0],[0.5,0.985,0],[0.013,0.5,0],[0.985,0.5,0],[0.947,0.043,0],[0.94,0.582,0],[0.043,0.947,0],[0.088,0.39,0]];',
				r * 0.17, r * 0.17, '', 'Intelligent Order Management', null, null, this.getTagsForStencil(gn, 'intelligent order management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Marketing.svg;points=[[0.5,0,0],[0.5,0.995,0],[0.007,0.5,0],[0.998,0.5,0],[0.985,0.013,0],[0.99,0.982,0],[0.21,0.707,0],[0.013,0.013,0]];',
				r * 0.17, r * 0.17, '', 'Marketing', null, null, this.getTagsForStencil(gn, 'marketing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Product_Insights.svg;points=[[0.497,0.142,0],[0.5,0.994,0],[0.161,0.497,0],[0.995,0.5,0],[0.807,0.012,0],[0.83,0.871,0],[0.02,0.991,0],[0.318,0.223,0]];',
				r * 0.17, r * 0.1488, '', 'Product Insights', null, null, this.getTagsForStencil(gn, 'product insights', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ProjectServiceAutomation.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.982,0.258,0],[0.982,0.742,0],[0.018,0.992,0],[0.018,0.008,0]];',
				r * 0.17, r * 0.1587, '', 'Project Service Automation', null, null, this.getTagsForStencil(gn, 'project service automation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Sales.svg;points=[[0.5,0,0],[0.436,1,0],[0,0.56,0],[1,0.505,0],[0.87,0.163,0],[0.76,0.86,0],[0.11,0.855,0],[0.145,0.235,0]];',
				r * 0.17, r * 0.17, '', 'Sales', null, null, this.getTagsForStencil(gn, 'sales', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SupplyChainManagement.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.927,0.258,0],[0.945,0.96,0],[0.06,0.731,0],[0.055,0.04,0]];',
				r * 0.17, r * 0.1488, '', 'Supply Chain Management', null, null, this.getTagsForStencil(gn, 'supply chain management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SustainabilityCalculator.svg;points=[[0.5,0,0],[0.5,0.956,0],[0.044,0.5,0],[1,0.5,0],[0.985,0.01,0],[0.895,0.85,0],[0.005,0.98,0],[0.15,0.105,0]];',
				r * 0.17, r * 0.17, '', 'Sustainability Calculator', null, null, this.getTagsForStencil(gn, 'sustainability calculator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'TalentAttract.svg;points=[[0.5,0.007,0],[0.5,0.993,0],[0.153,0.5,0],[1,0.502,0],[0.867,0.188,0],[0.867,0.812,0],[0.01,0.985,0],[0.013,0.013,0]];',
				r * 0.1381, r * 0.17, '', 'Talent Attract', null, null, this.getTagsForStencil(gn, 'talent attract', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'TalentOnboard.svg;points=[[0.5,0,0],[0.5,1,0],[0,0.5,0],[1,0.5,0],[0.985,0.01,0],[0.862,0.847,0],[0.01,0.985,0],[0.148,0.143,0]];',
				r * 0.17, r * 0.17, '', 'Talent Onboard', null, null, this.getTagsForStencil(gn, 'talent onboard', dt).join(' '))
		];
			
		this.addPalette('dynamics365App', 'Dynamics365 / App', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addDynamics365MixedRealityPalette = function(gn, r, sb, s)
	{
		var dt = 'mixed reality ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'ImportTool.svg;points=[[0.5,0,0],[0.499,0.998,0],[0.011,0.5,0],[1,0.499,0],[0.997,0.25,0],[0.988,0.757,0],[0.26,0.882,0],[0.003,0.25,0]];',
				r * 0.1503, r * 0.17, '', 'Import Tool', null, null, this.getTagsForStencil(gn, 'import tool', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'Layout.svg;points=[[0.5,0,0],[0.478,1,0],[0,0.505,0],[1,0.499,0],[0.994,0.255,0],[0.986,0.75,0],[0.006,0.752,0],[0.006,0.255,0]];',
				r * 0.1519, r * 0.17, '', 'Layout', null, null, this.getTagsForStencil(gn, 'layout', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'MRPortal.svg;points=[[0.5,0,0],[0.499,1,0],[0.062,0.5,0],[0.938,0.5,0],[0.972,0.074,0],[0.732,0.904,0],[0.265,0.902,0],[0.03,0.071,0]];',
				r * 0.17, r * 0.1558, '', 'MR Portal', null, null, this.getTagsForStencil(gn, 'mr portal', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ProductVisualize.svg;points=[[0.5,0.005,0],[0.5,1,0],[0,0.594,0],[1,0.594,0],[0.802,0.175,0],[0.995,0.71,0],[0.008,0.712,0],[0.205,0.168,0]];',
				r * 0.17, r * 0.17, '', 'Product Visualize', null, null, this.getTagsForStencil(gn, 'product visualize', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'RemoteAssist.svg;points=[[0.5,0,0],[0.5,0.998,0],[0,0.502,0],[1,0.502,0],[0.997,0.25,0],[0.994,0.757,0],[0.006,0.757,0],[0.003,0.25,0]];',
				r * 0.1503, r * 0.17, '', 'Remote Assist', null, null, this.getTagsForStencil(gn, 'remote assist', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'VoiceAssistant.svg;points=[[0.5,0,0],[0.476,1,0],[0,0.505,0],[1,0.419,0],[0.991,0.245,0],[0.988,0.595,0],[0.006,0.76,0],[0.009,0.245,0]];',
				r * 0.1519, r * 0.17, '', 'Voice Assistant', null, null, this.getTagsForStencil(gn, 'voice assistant', dt).join(' '))
		];
			
		this.addPalette('dynamics365Mixed Reality', 'Dynamics365 / Mixed Reality', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addDynamics365ProductFamilyPalette = function(gn, r, sb, s)
	{
		var dt = 'product family ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'Dynamics365.svg;points=[[0.5,0.114,0],[0.5,0.951,0],[0,0.209,0],[1,0.53,0],[0.972,0.255,0],[0.976,0.802,0],[0.265,0.977,0],[0.007,0.018,0]];',
				r * 0.1253, r * 0.17, '', 'Dynamics 365', null, null, this.getTagsForStencil(gn, 'dynamics 365', dt).join(' '))
		];
			
		this.addPalette('dynamics365Product Family', 'Dynamics365 / Product Family', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};

	Sidebar.prototype.addDynamics365SubAppPalette = function(gn, r, sb, s)
	{
		var dt = 'sub app ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s + 'ProjectTimesheet.svg;points=[[0.5,0,0],[0.5,0.971,0],[0,0.392,0],[1,0.392,0],[0.982,0.006,0],[0.987,0.772,0],[0.013,0.772,0],[0.018,0.006,0]];',
				r * 0.17, r * 0.1629, '', 'Project Timesheet', null, null, this.getTagsForStencil(gn, 'project timesheet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ReturnToSchool.svg;points=[[0.529,0,0],[0.414,0.997,0],[0.01,0.5,0],[0.998,0.589,0],[0.885,0.113,0],[0.977,0.91,0],[0.075,0.844,0],[0.175,0.11,0]];',
				r * 0.17, r * 0.1665, '', 'Return To School', null, null, this.getTagsForStencil(gn, 'return to school', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ReturnToWork.svg;points=[[0.394,0,0],[0.414,0.997,0],[0,0.595,0],[0.998,0.608,0],[0.712,0.009,0],[0.985,0.899,0],[0.078,0.836,0],[0.078,0.006,0]];',
				r * 0.17, r * 0.1558, '', 'Return To Work', null, null, this.getTagsForStencil(gn, 'return to work', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'SCMWarehousing.svg;points=[[0.5,0,0],[0.499,1,0],[0.003,0.481,0],[0.998,0.481,0],[0.865,0.013,0],[0.667,0.985,0],[0.333,0.985,0],[0.14,0.008,0]];',
				r * 0.17, r * 0.17, '', 'SCM Warehousing', null, null, this.getTagsForStencil(gn, 'scm warehousing', dt).join(' '))
		];
			
		this.addPalette('dynamics365Sub App', 'Dynamics365 / Sub App', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
})();
