/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	Sidebar.prototype.addNetwork2Palette = function()
	{
		var w = 50;
		var h = 50;
		var s = 'shape=mxgraph.networks2.icon;aspect=fixed;fillColor=#EDEDED;strokeColor=#000000;gradientColor=#5B6163;network2IconShadow=1;network2bgFillColor=none;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;network2Icon=mxgraph.networks2.';
		var sn = 'fillColorStyles=neutralFill;neutralFill=#9DA6A8;';
		var gn = 'mxgraph.networks2';
		var dt = 'computer network ';
		var iw,ih; // used in calculations in the following calls
		var fns = [];

		this.setCurrentSearchEntryLibrary('network2');

		fns.push(this.createVertexTemplateEntry(s + 'antenna;network2IconYOffset=0.0004;network2IconW=' + (iw = 0.508) + ';network2IconH=' + (ih = 0.9997) + ';', w * iw, h * ih, '', 'Antenna', null, null, this.getTagsForStencil(gn, 'antenna', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'application;network2IconXOffset=0.0048;network2IconYOffset=-0.0000;network2IconW=' + (iw = 0.5927) + ';network2IconH=' + (ih = 1.02) + ';', w * iw, h * ih, '', 'Application', null, null, this.getTagsForStencil(gn, 'application', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'big_data;network2IconXOffset=-0.0002;network2IconYOffset=0.0015;network2IconW=' + (iw = 1) + ';network2IconH= ' + (ih = 0.996) + ';', w * iw, h * ih, '', 'Big Data', null, null, this.getTagsForStencil(gn, 'big data', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'biohazard;network2IconXOffset=-0.0048;network2IconYOffset=-0.001;network2IconW=' + (iw = 1.0124) + ';network2IconH=' + (ih = 0.93) + ';', w * iw, h * ih, '', 'Biohazard', null, null, this.getTagsForStencil(gn, 'biohazard', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'biometric_reader;network2IconXOffset=0.00008;network2IconYOffset=0.00161;network2IconW=' + (iw = 0.8407) + ';network2IconH=' + (ih = 0.9971) + ';', w * iw, h * ih, '', 'Biometric Reader', null, null, this.getTagsForStencil(gn, 'biometric_reader', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'cctv;network2IconXOffset=-0.0002;network2IconYOffset=-0.0355;network2IconW=' + (iw = 1.0004) + ';network2IconH=' + (ih = 0.7279) + ';', w * iw, h * ih, '', 'CCTV', null, null, this.getTagsForStencil(gn, 'cctv', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'cloud;network2IconYOffset=-0.08;network2IconW=' + (iw = 1.0004) + ';network2IconH=' + (ih = 0.7222) + ';', w * iw, h * ih, '', 'Cloud', null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'community;network2IconXOffset=-0.0036;network2IconYOffset=0.00087;network2IconW=' + (iw = 0.876) + ';network2IconH=' + (ih = 1.0029) + ';', w * iw, h * ih, '', 'Community', null, null, this.getTagsForStencil(gn, 'community', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'copier;network2IconXOffset=0.04746;network2IconYOffset=-0.00027;network2IconW=' + (iw = 0.8861) + ';network2IconH=' + (ih = 0.9979) + ';', w * iw, h * ih, '', 'Copier', null, null, this.getTagsForStencil(gn, 'copier', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'data_management;network2IconW=' + (iw = 0.8252) + ';network2IconH=' + (ih = 0.9989) + ';', w * iw, h * ih, '', 'Data Management', null, null, this.getTagsForStencil(gn, 'data management', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'data_storage;network2IconW=' + (iw = 0.8252) + ';network2IconH=' + (ih = 0.9989) + ';', w * iw, h * ih, '', 'Data Storage', null, null, this.getTagsForStencil(gn, 'data storage', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'desktop_pc;network2IconXOffset=-0.0034;network2IconYOffset=0.00035;network2IconW=' + (iw = 0.453) + ';network2IconH=' + (ih = 0.9995) + ';', w * iw, h * ih, '', 'Desktop PC', null, null, this.getTagsForStencil(gn, 'desktop pc personal computer', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'encryption;network2IconXOffset=0.0006;network2IconYOffset=0.0881;network2IconW=' + (iw = 1.0001) + ';network2IconH=' + (ih = 0.7019) + ';', w * iw, h * ih, '', 'Encryption', null, null, this.getTagsForStencil(gn, 'encryption', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'external_storage;network2IconYOffset=-0.0267;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.7987) + ';', w * iw, h * ih, '', 'External Storage', null, null, this.getTagsForStencil(gn, 'external storage', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'firewall;network2IconXOffset=0.0001;network2IconYOffset=0.0001;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.608) + ';', w * iw, h * ih, '', 'Firewall', null, null, this.getTagsForStencil(gn, 'firewall', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'gamepad;network2IconXOffset=0.00005;network2IconYOffset=0.00163;network2IconW=' + (iw = 1.0021) + ';network2IconH=' + (ih = 0.7358) + ';', w * iw, h * ih, '', 'Gamepad', null, null, this.getTagsForStencil(gn, 'gamepad', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'global_server;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 1) + ';', w * iw, h * ih, '', 'Global Server', null, null, this.getTagsForStencil(gn, 'global server', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'globe;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 1) + ';perimeter=ellipsePerimeter;', w * iw, h * ih, '', 'Globe', null, null, this.getTagsForStencil(gn, 'globe', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'hub;network2IconXOffset=0.0001;network2IconYOffset=0.0129;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.2938) + ';', w * iw, h * ih, '', 'Hub', null, null, this.getTagsForStencil(gn, 'hub', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'internet;network2IconXOffset=0.0012;network2IconYOffset=0.0035;network2IconW=' + (iw = 0.9677) + ';network2IconH=' + (ih = 0.7722) + ';', w * iw, h * ih, '', 'Internet', null, null, this.getTagsForStencil(gn, 'internet', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'internet_security;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 1) + ';perimeter=ellipsePerimeter;', w * iw, h * ih, '', 'Internet Security', null, null, this.getTagsForStencil(gn, 'internet security', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'lan;network2IconYOffset=0.0558;network2IconW=' + (iw = 1.0834) + ';network2IconH=' + (ih = 0.7564) + ';', w * iw, h * ih, '', 'LAN', null, null, this.getTagsForStencil(gn, 'lan local area network', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'laptop;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.5734) + ';', w * iw, h * ih, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'laptop', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'load_balancer;network2IconW=' + (iw = 0.86) + ';network2IconH=' + (ih = 0.76) + ';', w * iw, h * ih, '', 'Load Balancer', null, null, this.getTagsForStencil(gn, 'load balancer', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'lock;network2IconW=' + (iw = 0.8) + ';network2IconH=' + (ih = 0.9999) + ';', w * iw, h * ih, '', 'Lock', null, null, this.getTagsForStencil(gn, 'lock', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'mail_server;network2IconYOffset=-0.02556;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.7875) + ';', w * iw, h * ih, '', 'Mail Server', null, null, this.getTagsForStencil(gn, 'mail server', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'mainframe;network2IconW=' + (iw = 0.4721) + ';network2IconH=' + (ih = 1) + ';', w * iw, h * ih, '', 'Mainframe', null, null, this.getTagsForStencil(gn, 'mainframe', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'mobile_network;network2IconXOffset=0.0049;network2IconW=' + (iw = 0.5297) + ';network2IconH=' + (ih = 1.02) + ';', w * iw, h * ih, '', 'Mobile Network', null, null, this.getTagsForStencil(gn, 'mobile network', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'mobile_phone;network2IconXOffset=0.0049;network2IconW=' + (iw = 0.5297) + ';network2IconH=' + (ih = 1.02) + ';', w * iw, h * ih, '', 'Mobile Phone', null, null, this.getTagsForStencil(gn, 'mobile phone cell', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'modem;network2IconYOffset=0.0131;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.2938) + ';', w * iw, h * ih, '', 'Modem', null, null, this.getTagsForStencil(gn, 'modem', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'monitor;network2IconYOffset=-0.009;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.742) + ';', w * iw, h * ih, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'nas_filer;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.62) + ';', w * iw, h * ih, '', 'NAS Filer', null, null, this.getTagsForStencil(gn, 'nas filer', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'network;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.8601) + ';', w * iw, h * ih, '', 'Network', null, null, this.getTagsForStencil(gn, 'network', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'network_security;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.86) + ';', w * iw, h * ih, '', 'Network Security', null, null, this.getTagsForStencil(gn, 'network security', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'patch_panel;network2IconXOffset=0.0001;network2IconYOffset=-0.0211;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.3359) + ';', w * iw, h * ih, '', 'Patch Panel', null, null, this.getTagsForStencil(gn, 'patch panel', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'pc;network2IconYOffset=-0.0593;network2IconW=' + (iw = 0.9999) + ';network2IconH=' + (ih = 0.7096) + ';', w * iw, h * ih, '', 'PC', null, null, this.getTagsForStencil(gn, 'pc personal computer', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'phone;network2IconXOffset=0.0009;network2IconYOffset=-0.0064;network2IconW=' + (iw = 0.9947) + ';network2IconH=' + (ih = 0.7947) + ';', w * iw, h * ih, '', 'Phone', null, null, this.getTagsForStencil(gn, 'phone', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'printer;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 1.04) + ';', w * iw, h * ih, '', 'Printer', null, null, this.getTagsForStencil(gn, 'printer', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'projector_canvas;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 1.04) + ';', w * iw, h * ih, '', 'Projector Canvas', null, null, this.getTagsForStencil(gn, 'projector canvas', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'rack_cabinet;network2IconW=' + (iw = 0.4721) + ';network2IconH=' + (ih = 1) + ';', w * iw, h * ih, '', 'Rack Cabinet', null, null, this.getTagsForStencil(gn, 'rack cabinet', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'router;network2IconXOffset=0.0001;network2IconYOffset=-0.1142;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.5485) + ';', w * iw, h * ih, '', 'Router', null, null, this.getTagsForStencil(gn, 'router', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'satellite_dish;network2IconXOffset=-0.0067;network2IconYOffset=0.0022;network2IconW=' + (iw = 1.0065) + ';network2IconH=' + (ih = 0.9957) + ';', w * iw, h * ih, '', 'Satellite Dish', null, null, this.getTagsForStencil(gn, 'satellite dish', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'satellite;network2IconXOffset=0.0149;network2IconYOffset=-0.00046;network2IconW=' + (iw = 1.1553) + ';network2IconH=' + (ih = 0.9741) + ';', w * iw, h * ih, '', 'Satellite', null, null, this.getTagsForStencil(gn, 'satellite', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'scanner;network2IconXOffset=0.00024;network2IconYOffset=-0.08;network2IconW=' + (iw = 1.0001) + ';network2IconH=' + (ih = 0.5965) + ';', w * iw, h * ih, '', 'Scanner', null, null, this.getTagsForStencil(gn, 'scanner', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'server;network2IconW=' + (iw = 1.0001) + ';network2IconH=' + (ih = 0.5812) + ';', w * iw, h * ih, '', 'Server', null, null, this.getTagsForStencil(gn, 'server', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'social_media;network2IconYOffset=0.0153;network2IconW=' + (iw = 1.02) + ';network2IconH=' + (ih = 0.932) + ';', w * iw, h * ih, '', 'Social Media', null, null, this.getTagsForStencil(gn, 'social media', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'tablet;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.6566) + ';', w * iw, h * ih, '', 'Tablet', null, null, this.getTagsForStencil(gn, 'tablet', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'terminal;network2IconW=' + (iw = 0.8554) + ';network2IconH=' + (ih = 1) + ';', w * iw, h * ih, '', 'Terminal', null, null, this.getTagsForStencil(gn, 'terminal', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'threat;network2IconYOffset=-0.0472;network2IconW=' + (iw = 1.0625) + ';network2IconH=' + (ih = 0.9583) + ';', w * iw, h * ih, '', 'Threat', null, null, this.getTagsForStencil(gn, 'threat', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'ups;network2IconXOffset=-0.0006;network2IconYOffset=0.0003;network2IconW=' + (iw = 0.62) + ';network2IconH=' + (ih = 1.0006) + ';', w * iw, h * ih, '', 'UPS', null, null, this.getTagsForStencil(gn, 'ups uninterruptible power supply', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'user_female;network2IconXOffset=-0.0011;network2IconYOffset=-0.003;network2IconW=' + (iw = 0.8096) + ';network2IconH=' + (ih = 0.994) + ';', w * iw, h * ih, '', 'User, Female', null, null, this.getTagsForStencil(gn, 'user female', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'user_male;network2IconW=' + (iw = 0.8918) + ';network2IconH=' + (ih = 1.0003) + ';', w * iw, h * ih, '', 'User, Male', null, null, this.getTagsForStencil(gn, 'user male', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'users;network2IconXOffset=0.0019;network2IconYOffset=-0.0004;network2IconW=' + (iw = 1.0353) + ';network2IconH=' + (ih = 0.6623) + ';', w * iw, h * ih, '', 'Users', null, null, this.getTagsForStencil(gn, 'users', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'video_projector;network2IconYOffset=0.013;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.294) + ';', w * iw, h * ih, '', 'Video Projector', null, null, this.getTagsForStencil(gn, 'video projector', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'vr;network2IconYOffset=-0.015;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.45) + ';', w * iw, h * ih, '', 'VR', null, null, this.getTagsForStencil(gn, 'vr virtual reality', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(s + 'web_hosting;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.9125) + ';', w * iw, h * ih, '', 'Web Hosting', null, null, this.getTagsForStencil(gn, 'web hosting', dt).join(' ')));
		fns.push(this.createVertexTemplateEntry(sn + s + 'wireless_hub;network2IconYOffset=-0.1142;network2IconW=' + (iw = 1) + ';network2IconH=' + (ih = 0.5485) + ';', w * iw, h * ih, '', 'Wireless Hub', null, null, this.getTagsForStencil(gn, 'wireless hub', dt).join(' ')));
	
		this.addPaletteFunctions('network2', 'Network 2025', false, fns);

		this.setCurrentSearchEntryLibrary();
	};
})();
