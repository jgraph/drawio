(function()
{
	Sidebar.prototype.addNetworkPalette = function()
	{
		var w = 50;
		var h = 50;
		var sb = this;
		var s0 = 'fontColor=#0066CC;verticalAlign=top;verticalLabelPosition=bottom;labelPosition=center;align=center;';
		var s = 'html=1;fillColor=#CCCCCC;strokeColor=#6881B3;gradientColor=none;gradientDirection=north;strokeWidth=2;shape=mxgraph.networks.';
		var s1 = 'fontColor=#0066CC;';
		var gn = 'mxgraph.networks';
		var dt = 'computer network ';
		
		this.addPaletteFunctions('network', 'Network', false,
		[
			this.addEntry(dt + 'ring bus', function()
			{
			   	var cell = new mxCell('', new mxGeometry(25, 25, 50, 50), 'html=1;fillColor=#CCCCCC;strokeColor=#6881B3;shape=ellipse;perimeter=ellipsePerimeter;gradientColor=none;gradientDirection=north;fontColor=#ffffff;strokeWidth=2;');
			   	cell.vertex = true;
			   	var cells = [cell];
			   	
			   	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'strokeColor=#6881B3;edgeStyle=none;rounded=0;endArrow=none;dashed=0;html=1;strokeWidth=2;');
			   	edge.geometry.relative = true;
		    	edge.edge = true;
		    	
		    	function insertEdge(x, y)
		    	{
		    		var e = sb.cloneCell(edge);
				   	e.geometry.setTerminalPoint(new mxPoint(x, y), true);
		    		cell.insertEdge(e, false);
		    		cells.push(e);
		    	};
			   	
		    	insertEdge(50, 0);
		    	insertEdge(85.5, 14.5);
		    	insertEdge(100, 50);
		    	insertEdge(85.5, 85.5);
		    	insertEdge(50, 100);
		    	insertEdge(14.5, 85.5);
		    	insertEdge(0, 50);
		    	insertEdge(14.5, 14.5);

			   	return sb.createVertexTemplateFromCells(cells, cell.geometry.width * 2, cell.geometry.height * 2, 'Ring Bus');
			}),
			this.addEntry(this.getTagsForStencil(gn, 'bus backbone', dt).join(' '), function()
			{
			   	var cell = new mxCell('', new mxGeometry(0, 60, 260, 20), s + 'bus;gradientColor=none;gradientDirection=north;fontColor=#ffffff;perimeter=backbonePerimeter;backboneSize=20;');
			   	cell.vertex = true;
			   	
				var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'strokeColor=#6881B3;edgeStyle=none;rounded=0;endArrow=none;html=1;strokeWidth=2;');
				edge.geometry.setTerminalPoint(new mxPoint(40, 0), true);
				edge.geometry.relative = true;
				edge.edge = true;

			   	var cells = [cell];
		    	
			   	for (var i = 0; i < 4; i++)
			   	{
			    	var e = sb.cloneCell(edge);
			    	e.geometry.setTerminalPoint(new mxPoint(40 + i * 60, 0), true);
			    	cell.insertEdge(e, false);
			    	cells.push(e);
			   	}
			   	
			   	for (var i = 0; i < 4; i++)
			   	{
			    	var e = sb.cloneCell(edge);
			    	e.geometry.setTerminalPoint(new mxPoint(40 + i * 60, 140), true);
			    	cell.insertEdge(e, false);
			    	cells.push(e);
			   	}
		    	
			   	return sb.createVertexTemplateFromCells(cells,  cell.geometry.width, cell.geometry.height + 120, 'Bus');
			}),
			this.createVertexTemplateEntry(s + 'bus;gradientColor=none;gradientDirection=north;fontColor=#ffffff;perimeter=backbonePerimeter;backboneSize=20;', 200, 20, '', 'Bus', null, null, this.getTagsForStencil(gn, 'bus backbone', dt).join(' ')),
		    this.createEdgeTemplateEntry(s + 'comm_link_edge;html=1;', 100, 100, '', 'Comm Link', null, this.getTagsForStencil(gn, 'comm_link_edge', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'biometric_reader;', 60, 100, '', 'Biometric Reader', null, null, this.getTagsForStencil(gn, 'biometric_reader', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'business_center;', 90, 100, '', 'Business Center', null, null, this.getTagsForStencil(gn, 'business_center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud;fontColor=#ffffff;', 90, 50, '', 'Cloud', null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'community;', 95, 100, '', 'Community', null, null, this.getTagsForStencil(gn, 'community', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'comm_link;', 30, 100, '', 'Comm Link (Icon)', null, null, this.getTagsForStencil(gn, 'comm_link', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'copier;', 100, 100, '', 'Copier', null, null, this.getTagsForStencil(gn, 'copier', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'pc;', 100, 70, '', 'PC', null, null, this.getTagsForStencil(gn, 'pc', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'desktop_pc;', 30, 60, '', 'Desktop PC', null, null, this.getTagsForStencil(gn, 'desktop_pc', dt + '').join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'external_storage;', 90, 100, '', 'External Storage', null, null, this.getTagsForStencil(gn, 'external_storage', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'firewall;', 100, 100, '', 'Firewall', null, null, this.getTagsForStencil(gn, 'firewall', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'gamepad;', 100, 70, '', 'Gamepad', null, null, this.getTagsForStencil(gn, 'gamepad', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'hub;', 100, 30, '', 'Hub', null, null, this.getTagsForStencil(gn, 'hub', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'laptop;', 100, 55, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'laptop', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'load_balancer;', 100, 30, '', 'Load Balancer', null, null, this.getTagsForStencil(gn, 'load_balancer', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'mail_server;', 105, 105, '', 'Mail Server', null, null, this.getTagsForStencil(gn, 'mail_server', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'mainframe;', 80, 100, '', 'Mainframe', null, null, this.getTagsForStencil(gn, 'mainframe', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'mobile;', 50, 100, '', 'Mobile', null, null, this.getTagsForStencil(gn, 'mobile', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'modem;', 100, 30, '', 'Modem', null, null, this.getTagsForStencil(gn, 'modem', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'monitor;', 80, 65, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'nas_filer;', 100, 35, '', 'NAS Filer', null, null, this.getTagsForStencil(gn, 'NAS Filer', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'patch_panel;', 100, 35, '', 'Patch Panel', null, null, this.getTagsForStencil(gn, 'patch_panel', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'pc;', 100, 70, '', 'PC', null, null, this.getTagsForStencil(gn, 'pc', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'phone_1;', 100, 70, '', 'Phone', null, null, this.getTagsForStencil(gn, 'phone_1', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'phone_2;', 100, 90, '', 'Phone', null, null, this.getTagsForStencil(gn, 'phone_2', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'printer;', 100, 100, '', 'Printer', null, null, this.getTagsForStencil(gn, 'printer', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'proxy_server;', 105, 105, '', 'Proxy Server', null, null, this.getTagsForStencil(gn, 'proxy_server', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'rack;', 50, 100, '', 'Rack', null, null, this.getTagsForStencil(gn, 'rack', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'radio_tower;', 55, 100, '', 'Radio Tower', null, null, this.getTagsForStencil(gn, 'radio_tower', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'router;', 100, 30, '', 'Router', null, null, this.getTagsForStencil(gn, 'router', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'satellite;', 100, 100, '', 'Satellite', null, null, this.getTagsForStencil(gn, 'satellite', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'satellite_dish;', 90, 100, '', 'Satellite Dish', null, null, this.getTagsForStencil(gn, 'satellite_dish', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'scanner;', 100, 75, '', 'Scanner', null, null, this.getTagsForStencil(gn, 'scanner', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'secured;', 80, 100, '', 'Secured', null, null, this.getTagsForStencil(gn, 'secured', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'security_camera;', 100, 75, '', 'Security Camera', null, null, this.getTagsForStencil(gn, 'security_camera', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'server;', 90, 100, '', 'Server', null, null, this.getTagsForStencil(gn, 'server', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'server_storage;', 105, 105, '', 'Server Storage', null, null, this.getTagsForStencil(gn, 'server_storage', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'storage;', 100, 100, '', 'Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'supercomputer;', 100, 100, '', 'Supercomputer', null, null, this.getTagsForStencil(gn, 'supercomputer', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'switch;', 100, 30, '', 'Switch', null, null, this.getTagsForStencil(gn, 'switch', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'tablet;', 100, 70, '', 'Tablet', null, null, this.getTagsForStencil(gn, 'tablet', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'tape_storage;', 105, 105, '', 'Tape Storage', null, null, this.getTagsForStencil(gn, 'tape_storage', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'terminal;', 80, 65, '', 'Terminal', null, null, this.getTagsForStencil(gn, 'terminal', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'unsecure;', 80, 100, '', 'Unsecure', null, null, this.getTagsForStencil(gn, 'unsecure', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'ups_enterprise;', 100, 100, '', 'UPS Enterprise', null, null, this.getTagsForStencil(gn, 'ups_enterprise', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'ups_small;', 70, 100, '', 'UPS Small', null, null, this.getTagsForStencil(gn, 'ups_small', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'usb_stick;', 45, 100, '', 'USB Stick', null, null, this.getTagsForStencil(gn, 'usb_stick', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'users;', 90, 100, '', 'Users', null, null, this.getTagsForStencil(gn, 'users', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'user_female;', 40, 100, '', 'User Female', null, null, this.getTagsForStencil(gn, 'user_female', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'user_male;', 40, 100, '', 'User Male', null, null, this.getTagsForStencil(gn, 'user_male', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'video_projector;', 100, 35, '', 'Video Projector', null, null, this.getTagsForStencil(gn, 'video_projector', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'video_projector_screen;', 80, 100, '', 'Video Projector Screen', null, null, this.getTagsForStencil(gn, 'video_projector_screen', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'virtual_pc;', 115, 85, '', 'Virtual PC', null, null, this.getTagsForStencil(gn, 'virtual_pc', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'virtual_server;', 110, 120, '', 'Virtual Server', null, null, this.getTagsForStencil(gn, 'virtual_server', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'virus;', 100, 90, '', 'Virus', null, null, this.getTagsForStencil(gn, 'virus', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'web_server;', 105, 105, '', 'Web Server', null, null, this.getTagsForStencil(gn, 'web_server', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'wireless_hub;', 100, 85, '', 'Wireless Hub', null, null, this.getTagsForStencil(gn, 'wireless_hub', dt).join(' ')),
			this.createVertexTemplateEntry(s0 + s + 'wireless_modem;', 100, 85, '', 'Wireless Modem', null, null, this.getTagsForStencil(gn, 'wireless_modem', dt).join(' '))
		]);
	};
	
})();
