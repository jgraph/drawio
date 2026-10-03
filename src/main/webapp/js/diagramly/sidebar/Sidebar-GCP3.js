/**
 * Copyright (c) 2020-2026, JGraph Holdings Ltd
 * Copyright (c) 2020-2026, draw.io AG
 */
(function()
{
	Sidebar.prototype.addGCP3Palette = function()
	{
		this.setCurrentSearchEntryLibrary('gcp3', 'gcp3Categories');
		this.addGCP3CategoriesPalette();
		this.setCurrentSearchEntryLibrary('gcp3', 'gcp3Core Products');
		this.addGCP3CoreProductsPalette();
		this.setCurrentSearchEntryLibrary();
	};
	
	Sidebar.prototype.addGCP3CategoriesPalette = function()
	{
		var sb = this;
		var s = 0.5;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;fontSize=11;fontStyle=0;fontColor=#000000;aspect=fixed;pointerEvents=1;shape=mxgraph.gcp3.';
		var dt = 'gcp google cloud platform categories ';
		var gn = 'mxgraph.gcp3';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'agents;fillColor=#9aa0a6',
		    		s * 100.0, s * 99.23, 'AI Applications\n& Agents', null, null, null, this.getTagsForStencil(gn, '', dt + 'agents').join(' ')),
		    this.createVertexTemplateEntry(n + 'aimachinelearning;fillColor=#9aa0a6',
		    		s * 100.0, s * 99.68, 'AI & Machine\nLearning', null, null, null, this.getTagsForStencil(gn, '', dt + 'ai artificial intelligence machine learning').join(' ')),
		    this.createVertexTemplateEntry(n + 'businessintelligence;fillColor=#9aa0a6',
		    		s * 100.0, s * 99.17, 'Business\nIntelligence', null, null, null, this.getTagsForStencil(gn, '', dt + 'business intelligence').join(' ')),
		    this.createVertexTemplateEntry(n + 'collaboration;fillColor=#9aa0a6',
		    		s * 100.0, s * 68.95, 'Collaboration', null, null, null, this.getTagsForStencil(gn, '', dt + 'collaboration').join(' ')),
		    this.createVertexTemplateEntry(n + 'compute;fillColor=#9aa0a6',
		    		s * 72.82, s * 100.0, 'Compute', null, null, null, this.getTagsForStencil(gn, '', dt + 'compute').join(' ')),
		    this.createVertexTemplateEntry(n + 'containers;fillColor=#9aa0a6',
		    		s * 86.13, s * 100.0, 'Containers', null, null, null, this.getTagsForStencil(gn, '', dt + 'containers').join(' ')),
		    this.createVertexTemplateEntry(n + 'dataanalytics;fillColor=#9aa0a6',
		    		s * 100.0, s * 98.89, 'Data\nAnalytics', null, null, null, this.getTagsForStencil(gn, '', dt + 'data analytics').join(' ')),
		    this.createVertexTemplateEntry(n + 'databases;fillColor=#9aa0a6',
		    		s * 72.65, s * 100.0, 'Databases', null, null, null, this.getTagsForStencil(gn, '', dt + 'databases').join(' ')),
		    this.createVertexTemplateEntry(n + 'developer_tools;fillColor=#9aa0a6',
		    		s * 100.0, s * 99.62, 'Developer\nTools', null, null, null, this.getTagsForStencil(gn, '', dt + 'developer tools').join(' ')),
		    this.createVertexTemplateEntry(n + 'devops;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'DevOps', null, null, null, this.getTagsForStencil(gn, '', dt + 'devops').join(' ')),
		    this.createVertexTemplateEntry(n + 'hybridmulticloud;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'Hybrid &\nMulticloud', null, null, null, this.getTagsForStencil(gn, '', dt + 'hybrid and multicloud').join(' ')),
		    this.createVertexTemplateEntry(n + 'integrationservices;fillColor=#9aa0a6',
		    		s * 72.43, s * 100.0, 'Integration\nServices', null, null, null, this.getTagsForStencil(gn, '', dt + 'integration services').join(' ')),
		    this.createVertexTemplateEntry(n + 'managementtools;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'Management\nTools', null, null, null, this.getTagsForStencil(gn, '', dt + 'management tools').join(' ')),
		    this.createVertexTemplateEntry(n + 'mapsgeospatial;fillColor=#9aa0a6',
		    		s * 100.0, s * 99.78, 'Maps &\nGeospatial', null, null, null, this.getTagsForStencil(gn, '', dt + 'maps and geospatial').join(' ')),
		    this.createVertexTemplateEntry(n + 'marketplace;fillColor=#9aa0a6',
		    		s * 100.0, s * 99.85, 'Google Cloud\nMarketplace', null, null, null, this.getTagsForStencil(gn, '', dt + 'marketplace').join(' ')),
		    this.createVertexTemplateEntry(n + 'mediaservices;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'Media\nServices', null, null, null, this.getTagsForStencil(gn, '', dt + 'media services').join(' ')),
		    this.createVertexTemplateEntry(n + 'migration;fillColor=#9aa0a6',
		    		s * 100.0, s * 99.58, 'Migration', null, null, null, this.getTagsForStencil(gn, '', dt + 'migration').join(' ')),
		    this.createVertexTemplateEntry(n + 'mixedreality;fillColor=#9aa0a6',
		    		s * 100.0, s * 72.79, 'Mixed\nReality', null, null, null, this.getTagsForStencil(gn, '', dt + 'mixed reality').join(' ')),
		    this.createVertexTemplateEntry(n + 'networking;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'Networking', null, null, null, this.getTagsForStencil(gn, '', dt + 'networking').join(' ')),
		    this.createVertexTemplateEntry(n + 'observability;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'Observability', null, null, null, this.getTagsForStencil(gn, '', dt + 'observability').join(' ')),
		    this.createVertexTemplateEntry(n + 'operations;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'Operations', null, null, null, this.getTagsForStencil(gn, '', dt + 'operations').join(' ')),
		    this.createVertexTemplateEntry(n + 'securityidentity;fillColor=#9aa0a6',
		    		s * 89.75, s * 100.0, 'Security\nIdentity', null, null, null, this.getTagsForStencil(gn, '', dt + 'security identity').join(' ')),
		    this.createVertexTemplateEntry(n + 'serverlesscomputing;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'Serverless\nComputing', null, null, null, this.getTagsForStencil(gn, '', dt + 'serverless computing').join(' ')),
		    this.createVertexTemplateEntry(n + 'storage;fillColor=#9aa0a6',
		    		s * 72.65, s * 100.0, 'Storage', null, null, null, this.getTagsForStencil(gn, '', dt + 'storage').join(' ')),
		    this.createVertexTemplateEntry(n + 'webmobile;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'Web and\nMobile', null, null, null, this.getTagsForStencil(gn, '', dt + 'web and mobile').join(' ')),
		    this.createVertexTemplateEntry(n + 'web3;fillColor=#9aa0a6',
		    		s * 100.0, s * 100.0, 'Web3', null, null, null, this.getTagsForStencil(gn, '', dt + 'web web3').join(' '))
	 	];
		
		this.addPalette('gcp3Categories', 'GCP Categories', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGCP3CoreProductsPalette = function()
	{
		var sb = this;
		var s = 0.5;
		var n = 'sketch=0;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;fontSize=11;fontStyle=0;fontColor=#000000;aspect=fixed;pointerEvents=1;shape=mxgraph.gcp3.';
		var dt = 'gcp google cloud platform categories ';
		var gn = 'mxgraph.gcp3';
		var fns = [];
		
		var fns = [
		    this.createVertexTemplateEntry(n + 'aihypercomputer;fillColor=#4285f4',
		    		s * 100.0, s * 100.0, 'AI\nHypercomputer', null, null, null, this.getTagsForStencil(gn, '', dt + 'ai artificial intelligence hypercomputer hyper computer').join(' ')),
		    this.createVertexTemplateEntry(n + 'alloydb;fillColor=#4285f4',
		    		s * 99.83, s * 100.0, 'AlloyDB', null, null, null, this.getTagsForStencil(gn, '', dt + 'alloydb alloy db database').join(' ')),
		    this.createVertexTemplateEntry(n + 'anthos;fillColor=#4285f4',
		    		s * 100.0, s * 98.99, 'Anthos', null, null, null, this.getTagsForStencil(gn, '', dt + 'anthos').join(' ')),
		    this.createVertexTemplateEntry(n + 'apigee;fillColor=#4285f4',
		    		s * 100.0, s * 97.48, 'Apigee', null, null, null, this.getTagsForStencil(gn, '', dt + 'apigee').join(' ')),
		    this.createVertexTemplateEntry(n + 'bigquery;fillColor=#4285f4',
		    		s * 100.0, s * 99.68, 'BigQuery', null, null, null, this.getTagsForStencil(gn, '', dt + 'bigquery big query').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloudrun;fillColor=#4285f4',
		    		s * 100.0, s * 99.49, 'Cloud Run', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloudrun cloud run').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloudspanner;fillColor=#4285f4',
		    		s * 100.0, s * 91.43, 'Spanner', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloudspanner cloud spanner').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloudsql;fillColor=#4285f4',
		    		s * 100.0, s * 99.12, 'Cloud SQL', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloudsql cloud sql').join(' ')),
		    this.createVertexTemplateEntry(n + 'cloud_storage;fillColor=#4285f4',
		    		s * 99.83, s * 100.0, 'Cloud Storage', null, null, null, this.getTagsForStencil(gn, '', dt + 'cloud storage').join(' ')),
		    this.createVertexTemplateEntry(n + 'computeengine;fillColor=#4285f4',
		    		s * 100.0, s * 100.0, 'Compute\nEngine', null, null, null, this.getTagsForStencil(gn, '', dt + 'compute engine').join(' ')),
		    this.createVertexTemplateEntry(n + 'distributedcloud;fillColor=#4285f4',
		    		s * 100.0, s * 100.0, 'Google\nDistributed Cloud', null, null, null, this.getTagsForStencil(gn, '', dt + 'distributed cloud').join(' ')),
		    this.createVertexTemplateEntry(n + 'gke;fillColor=#4285f4',
		    		s * 90.73, s * 100.0, 'GKE', null, null, null, this.getTagsForStencil(gn, '', dt + 'gke google kubernetes engine').join(' ')),
		    this.createVertexTemplateEntry(n + 'hyperdisk;fillColor=#4285f4',
		    		s * 100.0, s * 86.6, 'Hyperdisk', null, null, null, this.getTagsForStencil(gn, '', dt + 'hyperdisk hyper disk').join(' ')),
		    this.createVertexTemplateEntry(n + 'looker;fillColor=#4285f4',
		    		s * 73.24, s * 100.0, 'Looker', null, null, null, this.getTagsForStencil(gn, '', dt + 'looker').join(' ')),
		    this.createVertexTemplateEntry(n + 'mandiant;fillColor=#4285f4',
		    		s * 92.21, s * 100.0, 'Mandiant', null, null, null, this.getTagsForStencil(gn, '', dt + 'mandiant').join(' ')),
		    this.createVertexTemplateEntry(n + 'securitycommandcenter;fillColor=#4285f4',
		    		s * 92.20, s * 100.0, 'Security Command\nCenter', null, null, null, this.getTagsForStencil(gn, '', dt + 'security command center').join(' ')),
		    this.createVertexTemplateEntry(n + 'secops;fillColor=#4285f4',
		    		s * 92.02, s * 100.0, 'Google Security\nOperations', null, null, null, this.getTagsForStencil(gn, '', dt + 'secops security operations').join(' ')),
		    this.createVertexTemplateEntry(n + 'threatintelligence;fillColor=#4285f4',
		    		s * 100.0, s * 100.0, 'Google Threat\nIntelligence', null, null, null, this.getTagsForStencil(gn, '', dt + 'threat intelligence').join(' ')),
		    this.createVertexTemplateEntry(n + 'vertexai;fillColor=#4285f4',
		    		s * 100.0, s * 98.9, 'Vertex AI', null, null, null, this.getTagsForStencil(gn, '', dt + 'vertexai vertex ai artificial intelligence').join(' '))
	 	];
		
		this.addPalette('gcp3Core Products', 'GCP Core Products', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

})();
