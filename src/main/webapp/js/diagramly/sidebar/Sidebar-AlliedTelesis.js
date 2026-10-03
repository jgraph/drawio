/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	Sidebar.prototype.addAlliedTelesisPalette = function()
	{
		var d = 60;
		var dt = 'allied telesis';
		var sb = this;
		var s = 'image;aspect=fixed;html=1;align=center;shadow=0;dashed=0;image=img/lib/allied_telesis/';

		// Adds Allied Telesis shapes
		this.setCurrentSearchEntryLibrary('allied_telesis', 'allied_telesisBuildings');
		this.addAlliedTelesisBuildingsPalette(d, dt, sb, s);
		this.setCurrentSearchEntryLibrary('allied_telesis', 'allied_telesisComputer and Terminals');
		this.addAlliedTelesisComputerTerminalsPalette(d, dt, sb, s);
		this.setCurrentSearchEntryLibrary('allied_telesis', 'allied_telesisMedia Converters');
		this.addAlliedTelesisMediaConvertersPalette(d, dt, sb, s);
		this.setCurrentSearchEntryLibrary('allied_telesis', 'allied_telesisSecurity');
		this.addAlliedTelesisSecurityPalette(d, dt, sb, s);
		this.setCurrentSearchEntryLibrary('allied_telesis', 'allied_telesisStorage');
		this.addAlliedTelesisStoragePalette(d, dt, sb, s);
		this.setCurrentSearchEntryLibrary('allied_telesis', 'allied_telesisSwitch');
		this.addAlliedTelesisSwitchPalette(d, dt, sb, s);
		this.setCurrentSearchEntryLibrary('allied_telesis', 'allied_telesisWireless');
		this.addAlliedTelesisWirelessPalette(d, dt, sb, s);
		this.setCurrentSearchEntryLibrary();
	};

	Sidebar.prototype.addAlliedTelesisBuildingsPalette = function(d, dt, sb, s)
	{
		s += 'buildings/';
		var gn = 'buildings';
		
		var fns = [
			 this.createVertexTemplateEntry(s + 'Apartments.svg;points=[[0.464,0,0],[0.515,0.998,0],[0,0.47,0],[1,0.516,0],[0.999,0.165,0],[0.999,0.867,0],[0.015,0.837,0],[0.001,0.125,0]];',
					 d * 0.9, d * 1.75, '', 'Apartments', false, null, this.getTagsForStencil(gn, 'apartments', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Building_Cluster.svg;points=[[0.292,0,0],[0.374,0.997,0],[0,0.596,0],[1,0.499,0],[0.992,0.836,0],[0.023,0.773,0],[0.08,0.121,0]];',
					 d * 2.02, d * 1.85, '', 'Building Cluster', false, null, this.getTagsForStencil(gn, 'building cluster', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Large_Building.svg;points=[[0.484,0,0],[0.614,1,0],[0,0.401,0],[1,0.594,0],[0.855,0.218,0],[0.997,0.802,0],[0.028,0.655,0],[0.008,0.195,0]];',
					 d * 1.25, d * 1.25, '', 'Large Building', false, null, this.getTagsForStencil(gn, 'large building', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Long_Building.svg;points=[[0.249,0,0],[0.748,1,0],[0,0.5,0],[1,0.5,0],[0.997,0.872,0],[0.003,0.125,0]];',
					 d * 2.09, d * 2.16, '', 'Long Building', false, null, this.getTagsForStencil(gn, 'long building', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Medium_Business_Building.svg;points=[[0.465,0,0],[0.514,0.998,0],[0,0.454,0],[1,0.522,0],[0.993,0.243,0],[0.996,0.8,0],[0.033,0.775,0],[0,0.188,0]];',
					 d * 0.91, d * 1.17, '', 'Medium Business Building', false, null, this.getTagsForStencil(gn, 'medium business building', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'School_Building.svg;points=[[0.5,0.011,0],[0.687,1,0],[0,0.474,0],[1,0.733,0],[0.997,0.837,0],[0.013,0.6,0],[0,0.37,0]];',
					 d * 2.75, d * 2.78, '', 'School Building', false, null, this.getTagsForStencil(gn, 'school building', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Secure_Building.svg;points=[[0.502,0,0],[0.5,0.923,0],[0,0.538,0],[0.996,0.5,0],[0.85,0.22,0],[0.155,0.912,0],[0.25,0.194,0]];',
					 d * 2.72, d * 1.86, '', 'Secure Building', false, null, this.getTagsForStencil(gn, 'secure building', dt).join(' '))
		];
			   	
   		this.addPalette('allied_telesisBuildings', 'Allied Telesis / Buildings', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addAlliedTelesisComputerTerminalsPalette = function(d, dt, sb, s)
	{
		s += 'computer_and_terminals/';
		var gn = 'computer terminals';
		
		var fns = [
			 this.createVertexTemplateEntry(s + 'IP_TV.svg;points=[[0.5,0.083,0],[0.5,0.762,0],[0,0.578,0],[1,0.5,0],[0.997,0.373,0],[0.997,0.97,0],[0.013,0.72,0],[0.28,0.035,0]];',
					 d * 0.82, d * 0.84, '', 'IP TV', false, null, this.getTagsForStencil(gn, 'ip tv internet protocol television', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Keypad.svg;points=[[0.5,0.12,0],[0.5,0.875,0],[0,0.5,0],[1,0.5,0],[0.999,0.28,0],[0.999,0.965,0],[0.005,0.712,0],[0.005,0.03,0]];',
					 d * 0.44, d * 0.8, '', 'Keypad', false, null, this.getTagsForStencil(gn, 'keypad', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Laptop.svg;points=[[0.496,0.009,0],[0.439,1,0],[0.306,0.5,0],[0.94,0.5,0],[0.992,0.27,0],[0.873,0.752,0],[0,0.74,0]];',
					 d * 0.7, d * 0.71, '', 'Laptop', false, null, this.getTagsForStencil(gn, 'laptop', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Personal_Computer.svg;points=[[0.5,0.102,0],[0.5,0.932,0],[0.172,0.5,0],[0.997,0.576,0],[0.993,0.323,0],[0.993,0.832,0],[0,0.782,0],[0.173,0.033,0]];',
					 d * 0.76, d * 1.03, '', 'Personal Computer', false, null, this.getTagsForStencil(gn, 'personal computer', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Personal_Computer_Wireless.svg;points=[[0.5,0.181,0],[0.5,0.943,0],[0.124,0.499,0],[1,0.785,0],[0.712,0.308,0],[0.997,0.902,0],[0,0.745,0],[0.125,0.03,0]];',
					 d * 1.05, d * 1.07, '', 'Personal Computer Wireless', false, null, this.getTagsForStencil(gn, 'personal computer wireless', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Personal_Computer_with_Server.svg;points=[[0.463,0,0],[0.5,0.922,0],[0,0.444,0],[1,0.578,0],[0.995,0.32,0],[1,0.83,0],[0.005,0.627,0],[0.005,0.26,0]];',
					 d * 1.04, d * 1.04, '', 'Personal Computer with Server', false, null, this.getTagsForStencil(gn, 'Personal Computer Server', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'POS_keypad.svg;points=[[0.542,0,0],[0.46,1,0],[0,0.566,0],[1,0.488,0],[0.992,0.347,0],[0.992,0.626,0],[0.008,0.653,0],[0.34,0.139,0]];',
					 d * 0.62, d * 0.46, '', 'POS Keypad', false, null, this.getTagsForStencil(gn, 'pos keypad', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'POS_Printer.svg;points=[[0.666,0,0],[0.459,0.994,0],[0.064,0.497,0],[1,0.555,0],[0.847,0.127,0],[0.99,0.675,0],[0.01,0.698,0]];',
					 d * 0.62, d * 0.54, '', 'POS Printer', false, null, this.getTagsForStencil(gn, 'pos printer', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Server_Desktop.svg;points=[[0.5,0.062,0],[0.5,0.932,0],[0,0.555,0],[1,0.44,0],[1,0.16,0],[0.996,0.725,0],[0.004,0.84,0],[0.004,0.27,0]];',
					 d * 0.71, d * 0.90, '', 'Server Desktop', false, null, this.getTagsForStencil(gn, 'server desktop', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Smartphone.svg;points=[[0.5,0.05,0],[0.5,0.953,0],[0,0.419,0],[1,0.585,0],[0.977,0.21,0],[0.999,0.932,0],[0.023,0.787,0],[0.012,0.07,0]];',
					 d * 0.33, d * 0.72, '', 'Smartphone', false, null, this.getTagsForStencil(gn, 'smartphone', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Tablet.svg;points=[[0.5,0.07,0],[0.5,0.93,0],[0,0.394,0],[1,0.606,0],[0.967,0.23,0],[0.994,0.952,0],[0.027,0.757,0],[0.006,0.063,0]];',
					 d * 0.45, d * 0.95, '', 'Tablet', false, null, this.getTagsForStencil(gn, 'tablet', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Tablet_Alternative.svg;points=[[0.5,0.065,0],[0.91,0.995,0],[0.251,0.497,0],[1,0.5,0],[0.996,0.28,0],[0.996,0.965,0],[0.256,0.712,0],[0.004,0.218,0]];',
					 d * 0.58, d * 0.8, '', 'Tablet Alternative', false, null, this.getTagsForStencil(gn, 'tablet alternative', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Vdeo_Conference_Terminal.svg;points=[[0.562,0,0],[0.894,0.995,0],[0,0.5,0],[1,0.5,0],[0.713,0.06,0],[0.999,0.957,0],[0.004,0.627,0],[0.004,0.045,0]];',
					 d * 0.53, d * 0.75, '', 'Vdeo Conference Terminal', false, null, this.getTagsForStencil(gn, 'vdeo conference terminal', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'VOIP_IP_phone.svg;points=[[0.5,0.034,0],[0.5,0.935,0],[0.257,0.5,0],[0.743,0.5,0],[0.672,0.015,0],[0.992,0.895,0],[0.004,0.737,0],[0.274,0.048,0]];',
					 d * 0.5, d * 0.76, '', 'VOIP IP Phone', false, null, this.getTagsForStencil(gn, 'voip ip phone voice over internet protocol', dt).join(' '))
		];
			   	
   		this.addPalette('allied_telesisComputer and Terminals', 'Allied Telesis / Computer and Terminals', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addAlliedTelesisMediaConvertersPalette = function(d, dt, sb, s)
	{
		s += 'media_converters/';
		var gn = 'media converters';
		
		var fns = [
			 this.createVertexTemplateEntry(s + 'Industrial_Media_Converter.svg;points=[[0.5,0.043,0],[0.5,0.927,0],[0,0.568,0],[1,0.429,0],[0.999,0.068,0],[0.999,0.79,0],[0.005,0.93,0],[0.001,0.21,0]];',
					 d * 0.5, d * 0.95, '', 'Industrial Media Converter', false, null, this.getTagsForStencil(gn, 'industrial media converter', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Industrial_Media_Converter_POE.svg;points=[[0.5,0.043,0],[0.5,0.927,0],[0,0.568,0],[1,0.429,0],[0.999,0.068,0],[0.999,0.79,0],[0.005,0.93,0],[0.001,0.21,0]];',
					 d * 0.5, d * 0.95, '', 'Industrial Media Converter POE', false, null, this.getTagsForStencil(gn, 'industrial media converter poe', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Media_Converter_Modular.svg;points=[[0.386,0,0],[0.613,0.997,0],[0,0.393,0],[1,0.602,0],[0.995,0.468,0],[0.995,0.74,0],[0.003,0.525,0],[0.003,0.26,0]];',
					 d * 1.18, d * 0.91, '', 'Media Converter Modular', false, null, this.getTagsForStencil(gn, 'media converter modular', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Media_Converter_Standalone.svg;points=[[0.468,0,0],[0.527,1,0],[0,0.465,0],[0.998,0.543,0],[0.987,0.384,0],[0.99,0.705,0],[0.005,0.622,0],[0.008,0.304,0]];',
					 d * 0.76, d * 0.62, '', 'Media Converter Standalone', false, null, this.getTagsForStencil(gn, 'media converter standalone', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Media_Converter_Standalone_POE.svg;points=[[0.468,0,0],[0.527,1,0],[0,0.465,0],[0.998,0.544,0],[0.987,0.384,0],[0.99,0.705,0],[0.005,0.622,0],[0.008,0.304,0]];',
					 d * 0.76, d * 0.62, '', 'Media Converter Standalone POE', false, null, this.getTagsForStencil(gn, 'media converter standalone poe', dt).join(' '))
		];
			   	
   		this.addPalette('allied_telesisMedia Converters', 'Allied Telesis / Media Converters', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addAlliedTelesisSecurityPalette = function(d, dt, sb, s)
	{
		s += 'security/';
		var gn = 'security';
		
		var fns = [
			 this.createVertexTemplateEntry(s + 'DVS_Surveillance_Monitor.svg;points=[[0.105,0,0],[0.5,0.945,0],[0,0.5,0],[1,0.5,0],[0.999,0.373,0],[0.999,0.965,0],[0.093,0.772,0],[0.001,0.038,0]];',
					 d * 0.7, d * 1, '', 'DVS Surveillance Monitor', false, null, this.getTagsForStencil(gn, 'dvs surveillance monitor', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'EtherGRID.svg;points=[[0.352,0,0],[0.649,1,0],[0.046,0.5,0],[0.961,0.5,0],[0.997,0.748,0],[0.003,0.252,0]];',
					 d * 1.49, d * 1.08, '', 'EtherGRID', false, null, this.getTagsForStencil(gn, 'ethergrid', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'POE_DVS_Camera.svg;points=[[0.757,0,0],[0.5,0.892,0],[0.085,0.5,0],[0.998,0.438,0],[0.957,0.137,0],[0.94,0.59,0],[0.068,0.907,0],[0.128,0.42,0]];',
					 d * 0.85, d * 0.67, '', 'POE DVS Camera', false, null, this.getTagsForStencil(gn, 'poe dvs camera', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'POS.svg;points=[[0.5,0.031,0],[0.495,0.998,0],[0.154,0.499,0],[0.903,0.499,0],[0.901,0.353,0],[1,0.777,0],[0.003,0.722,0],[0.401,0.018,0]];',
					 d * 1.13, d * 1.2, '', 'POS', false, null, this.getTagsForStencil(gn, 'pos', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Router_UTM.svg;points=[[0.422,0,0],[0.575,1,0],[0,0.41,0],[0.998,0.597,0],[0.972,0.462,0],[0.987,0.697,0],[0.018,0.538,0],[0.008,0.31,0]];',
					 d * 0.93, d * 0.66, '', 'Router UTM', false, null, this.getTagsForStencil(gn, 'router utm', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Router_VPN.svg;points=[[0.422,0,0],[0.574,1,0],[0,0.41,0],[0.998,0.597,0],[0.977,0.469,0],[0.982,0.704,0],[0.023,0.542,0],[0.01,0.307,0]];',
					 d * 0.93, d * 0.66, '', 'Router VPN', false, null, this.getTagsForStencil(gn, 'router vpn', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Surveillance_Camera_Ceiling.svg;points=[[0.507,0,0],[0.489,0.995,0],[0,0.5,0],[0.995,0.5,0],[0.977,0.147,0],[0.825,0.863,0],[0.178,0.876,0],[0.028,0.137,0]];',
					 d * 0.62, d * 0.59, '', 'Surveillance Camera Ceiling', false, null, this.getTagsForStencil(gn, 'surveillance camera ceiling', dt).join(' '))
		];
			   	
   		this.addPalette('allied_telesisSecurity', 'Allied Telesis / Security', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addAlliedTelesisStoragePalette = function(d, dt, sb, s)
	{
		s += 'storage/';
		var gn = 'storage';
		
		var fns = [
			 this.createVertexTemplateEntry(s + 'Datacenter_Server_Half_Rack_ToR.svg;points=[[0.401,0,0],[0.584,0.998,0],[0,0.436,0],[0.997,0.564,0],[0.977,0.255,0],[0.993,0.837,0],[0.039,0.762,0],[0.013,0.16,0]];',
					 d * 1.47, d * 1.91, '', 'Datacenter Server Half Rack ToR', false, null, this.getTagsForStencil(gn, 'datacenter server half rack tor', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Datacenter_Server_Rack.svg;points=[[0.391,0,0],[0.584,1,0],[0,0.454,0],[1,0.531,0],[0.999,0.178,0],[0.994,0.895,0],[0.011,0.825,0],[0.001,0.103,0]];',
					 d * 1.47, d * 2.98, '', 'Datacenter Server Rack', false, null, this.getTagsForStencil(gn, 'datacenter server rack', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Datacenter_Server_Rack_EoR.svg;points=[[0.394,0,0],[0.583,1,0],[0,0.455,0],[1,0.534,0],[0.999,0.173,0],[0.999,0.895,0],[0.011,0.825,0],[0.001,0.103,0]];',
					 d * 1.43, d * 2.89, '', 'Datacenter Server Rack EoR', false, null, this.getTagsForStencil(gn, 'datacenter server rack eor', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Datacenter_Server_Rack_Storage_Unit_Small.svg;points=[[0.5,0.098,0],[0.5,0.902,0],[0,0.383,0],[0.999,0.499,0],[0.992,0.789,0],[0.005,0.559,0],[0.003,0.211,0]];',
					 d * 1.29, d * 1.12, '', 'Datacenter Server Rack Storage Unit Small', false, null, this.getTagsForStencil(gn, 'datacenter server rack storage unit small', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Datacenter_Server_Rack_ToR.svg;points=[[0.391,0,0],[0.584,1,0],[0,0.454,0],[1,0.531,0],[0.999,0.178,0],[0.994,0.895,0],[0.011,0.825,0],[0.001,0.103,0]];',
					 d * 1.47, d * 2.98, '', 'Datacenter Server Rack ToR', false, null, this.getTagsForStencil(gn, 'datacenter server rack tor', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Datacenter_Server_Storage_Unit_Large.svg;points=[[0.5,0.083,0],[0.5,0.915,0],[0,0.401,0],[1,0.596,0],[0.997,0.37,0],[1,0.817,0],[0,0.622,0],[0,0.18,0]];',
					 d * 1.28, d * 1.32, '', 'Datacenter Server Storage Unit Large', false, null, this.getTagsForStencil(gn, 'datacenter server storage unit large', dt).join(' '))
		];
			   	
   		this.addPalette('allied_telesisStorage', 'Allied Telesis / Storage', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addAlliedTelesisSwitchPalette = function(d, dt, sb, s)
	{
		s += 'switch/';
		var gn = 'switch';
		
		var fns = [
			 this.createVertexTemplateEntry(s + 'Industrial_Ethernet_IE200.svg;points=[[0.561,0,0],[0.432,1,0],[0,0.512,0],[0.993,0.486,0],[0.985,0.18,0],[0.989,0.787,0],[0.011,0.822,0],[0.004,0.213,0]];',
					 d * 0.67, d * 0.94, '', 'Industrial Ethernet IE200', false, null, this.getTagsForStencil(gn, 'industrial ethernet ie200', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Industrial_Ethernet_IE200_POE.svg;points=[[0.563,0,0],[0.432,1,0],[0,0.512,0],[0.993,0.486,0],[0.985,0.18,0],[0.989,0.787,0],[0.011,0.822,0],[0.004,0.213,0]];',
					 d * 0.67, d * 0.94, '', 'Industrial Ethernet IE200 POE', false, null, this.getTagsForStencil(gn, 'industrial ethernet ie200 poe', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Industrial_Ethernet_IE300.svg;points=[[0.415,0,0],[0.583,0.998,0],[0,0.446,0],[0.997,0.55,0],[0.997,0.298,0],[0.997,0.802,0],[0,0.697,0],[0,0.195,0]];',
					 d * 1.16, d * 1.29, '', 'Industrial_Ethernet_IE300', false, null, this.getTagsForStencil(gn, 'industrial ethernet ie300', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Modular_Switch_SBx8106.svg;points=[[0.444,0,0],[0.559,0.997,0],[0,0.442,0],[1,0.557,0],[1,0.381,0],[1,0.732,0],[0.005,0.619,0],[0.005,0.265,0]];',
					 d * 1.43, d * 1.23, '', 'Modular Switch SBx8106', false, null, this.getTagsForStencil(gn, 'modular switch sbx8106', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Modular_Switch_SBx8112.svg;points=[[0.463,0,0],[0.54,1,0],[0,0.46,0],[1,0.535,0],[1,0.3,0],[1,0.77,0],[0,0.685,0],[0,0.235,0]];',
					 d * 1.49, d * 1.53, '', 'Modular Switch SBx8112', false, null, this.getTagsForStencil(gn, 'modular switch sbx8112', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Modular_Switch_SXx908GEN2.svg;points=[[0.386,0,0],[0.615,1,0],[0,0.405,0],[1,0.595,0],[0.997,0.424,0],[0.997,0.766,0],[0.005,0.576,0],[0.005,0.234,0]];',
					 d * 1.3, d * 1.11, '', 'Modular Switch SXx908GEN2', false, null, this.getTagsForStencil(gn, 'modular switch sxx908gen2', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_24_port_L2.svg;points=[[0.352,0,0],[0.5,0.876,0],[0.077,0.5,0],[0.93,0.5,0],[0.992,0.555,0],[0.99,0.733,0],[0.005,0.441,0],[0.005,0.263,0]];',
					 d * 1.24, d * 0.85, '', 'Switch 24 port L2', false, null, this.getTagsForStencil(gn, 'switch 24 port l2', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_24_port_L2_POE.svg;points=[[0.352,0,0],[0.5,0.876,0],[0.077,0.5,0],[0.93,0.5,0],[0.992,0.555,0],[0.99,0.733,0],[0.005,0.441,0],[0.005,0.263,0]];',
					 d * 1.24, d * 0.85, '', 'Switch 24 port L2 POE', false, null, this.getTagsForStencil(gn, 'switch 24 port l2 poe', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_24_port_L3.svg;points=[[0.352,0,0],[0.5,0.876,0],[0.077,0.5,0],[0.93,0.5,0],[0.992,0.555,0],[0.99,0.733,0],[0.005,0.441,0],[0.005,0.263,0]];',
					 d * 1.24, d * 0.85, '', 'Switch 24 port L3', false, null, this.getTagsForStencil(gn, 'switch 24 port l3', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_24_port_L3_Alternative.svg;points=[[0.386,0,0],[0.615,1,0],[0,0.38,0],[1,0.62,0],[0.997,0.536,0],[0.997,0.704,0],[0.005,0.464,0],[0.008,0.292,0]];',
					 d * 1.3, d * 0.88, '', 'Switch 24 port L3 Alternative', false, null, this.getTagsForStencil(gn, 'switch 24 port l3 alternative', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_24_port_L3_POE.svg;points=[[0.352,0,0],[0.5,0.876,0],[0.077,0.5,0],[0.93,0.5,0],[0.992,0.555,0],[0.99,0.733,0],[0.005,0.441,0],[0.005,0.263,0]];',
					 d * 1.24, d * 0.85, '', 'Switch 24 port L3 POE', false, null, this.getTagsForStencil(gn, 'switch 24 port l3 poe', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_48_port_L2.svg;points=[[0.386,0,0],[0.615,1,0],[0,0.38,0],[1,0.62,0],[0.997,0.536,0],[0.997,0.704,0],[0.005,0.464,0],[0.008,0.292,0]];',
					 d * 1.3, d * 0.88, '', 'Switch 48 port L2', false, null, this.getTagsForStencil(gn, 'switch 48 port l2', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_48_port_L2_POE.svg;points=[[0.386,0,0],[0.615,1,0],[0,0.38,0],[1,0.62,0],[0.997,0.536,0],[0.997,0.704,0],[0.005,0.464,0],[0.008,0.292,0]];',
					 d * 1.3, d * 0.88, '', 'Switch 48 port L2 POE', false, null, this.getTagsForStencil(gn, 'switch 48 port l2 poe', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_48_port_L3.svg;points=[[0.386,0,0],[0.615,1,0],[0,0.38,0],[1,0.62,0],[0.997,0.536,0],[0.997,0.704,0],[0.005,0.464,0],[0.008,0.292,0]];',
					 d * 1.3, d * 0.88, '', 'Switch 48 port L3', false, null, this.getTagsForStencil(gn, 'switch 48 port l3', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_48_port_L3_POE.svg;points=[[0.386,0,0],[0.615,1,0],[0,0.38,0],[1,0.62,0],[0.997,0.536,0],[0.997,0.704,0],[0.005,0.464,0],[0.008,0.292,0]];',
					 d * 1.3, d * 0.88, '', 'Switch 48 port L3 POE', false, null, this.getTagsForStencil(gn, 'switch 48 port l3 poe', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Switch_52_port_L3.svg;points=[[0.386,0,0],[0.615,1,0],[0,0.38,0],[1,0.62,0],[0.997,0.536,0],[0.997,0.704,0],[0.005,0.464,0],[0.008,0.292,0]];',
					 d * 1.3, d * 0.88, '', 'Switch 52 port L3', false, null, this.getTagsForStencil(gn, 'switch 52 port l3', dt).join(' '))
		];
			   	
   		this.addPalette('allied_telesisSwitch', 'Allied Telesis / Switch', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addAlliedTelesisWirelessPalette = function(d, dt, sb, s)
	{
		s += 'wireless/';
		var gn = 'wireless';
		
		var fns = [
			 this.createVertexTemplateEntry(s + 'Access_Point_Indoor.svg;points=[[0.5,0.105,0],[0.5,0.905,0],[0,0.5,0],[1,0.5,0],[0.973,0.305,0],[0.985,0.935,0],[0.034,0.7,0],[0.019,0.065,0]];',
					 d * 0.61, d * 0.91, '', 'Access Point Indoor', false, null, this.getTagsForStencil(gn, 'access point indoor', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Access_Point_Outdoor.svg;points=[[0.5,0.362,0],[0.5,0.673,0],[0,0.465,0],[1,0.565,0],[0.816,0.075,0],[0.777,0.985,0],[0.155,0.925,0],[0.223,0.003,0]];',
					 d * 0.43, d * 1.66, '', 'Access Point Outdoor', false, null, this.getTagsForStencil(gn, 'access point outdoor', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'Laptop_Wireless.svg;points=[[0.5,0.068,0],[0.801,1,0],[0.146,0.5,0],[0.935,0.5,0],[0.715,0.231,0],[0.992,0.887,0],[0.008,0.674,0],[0.358,0.01,0]];',
					 d * 0.96, d * 0.79, '', 'Laptop Wireless', false, null, this.getTagsForStencil(gn, 'laptop wireless', dt).join(' '))
		];
			   	
   		this.addPalette('allied_telesisWireless', 'Allied Telesis / Wireless', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
})();
