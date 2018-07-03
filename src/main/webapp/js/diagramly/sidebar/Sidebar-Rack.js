(function()
{
	// Adds Rack shapes
	Sidebar.prototype.addRackGeneralPalette = function()
	{
		var s = 'strokeColor=#666666;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;outlineConnect=0;shadow=0;dashed=0;';
		var sr = 'strokeColor=#666666;html=1;labelPosition=right;align=left;spacingLeft=15;shadow=0;dashed=0;fillColor=#ffffff;outlineConnect=0;';
		
		//default tags
		var dt = 'rack equipment ';
		
		this.addPaletteFunctions('rackGeneral', 'Rack / General', false,
		[
			this.createVertexTemplateEntry(s + 'shape=mxgraph.rackGeneral.container;container=1;collapsible=0;childLayout=rack;marginLeft=9;marginRight=9;marginTop=21;marginBottom=22;textColor=#666666;numDisp=off;', 180, 228.6, '', 'Rack Cabinet', null, null, dt + 'cabinet'),
			this.createVertexTemplateEntry(s + 'shape=mxgraph.rackGeneral.container;container=1;collapsible=0;childLayout=rack;marginLeft=33;marginRight=9;marginTop=21;marginBottom=22;textColor=#666666;numDisp=ascend;', 210, 228.6, '', 'Numbered Rack Cabinet', null, null, dt + 'cabinet numbered'),
			this.createVertexTemplateEntry(sr + 'text;', 160, 15, '', 'Spacing', null, null, dt + 'spacing'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rackGeneral.plate;fillColor=#e8e8e8;', 160, 15, '', 'Cover Plate', null, null, dt + 'cover plate'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.general.1u_rack_server;', 160, 15, '', 'Server', null, null, dt + 'server'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rackGeneral.horCableDuct;', 160, 15, '', 'Horizontal Cable Duct', null, null, dt + 'horizontal cable duct'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rackGeneral.horRoutingBank;', 160, 20, '', 'Horizontal Routing Bank', null, null, dt + 'horizontal routing bank'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rackGeneral.neatPatch;', 160, 30, '', 'Neat-Patch', null, null, dt + 'neat patch'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rackGeneral.shelf;container=1;collapsible=0', 160, 15, '', 'Shelf', null, null, dt + 'shelf'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rackGeneral.channelBase;', 200, 30, '', 'Channel Base', null, null, dt + 'channel base'),
			this.createVertexTemplateEntry('shape=mxgraph.rackGeneral.cabinetLeg;html=1;shadow=0;dashed=0;fillColor=#444444;strokeColor=#444444;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;', 50, 50, '', 'Cabinet Leg', null, null, dt + 'cabinet leg support'),

			//stencils
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.general.cat5e_enhanced_patch_panel_48_ports;', 160, 30, '', 'CAT5e Enhanced Patch Panel 48 ports', null, null, dt + 'cat5e enhanced patch panel port'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.general.cat5e_rack_mount_patch_panel_24_ports;', 160, 15, '', 'CAT5e Rack Mount Patch Panel 24 ports', null, null, dt + 'cat5e mount patch panel port'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.general.cat5e_rack_mount_patch_panel_96_ports;', 160, 60, '', 'CAT5e Rack Mount Patch Panel 96 ports', null, null, dt + 'cat5e mount patch panel port'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.general.hub;', 160, 30, '', 'Hub', null, null, dt + 'hub'),
			this.createVertexTemplateEntry(s + 'shape=mxgraph.rack.general.server_1;', 73, 150, '', 'Server 1', null, null, dt + 'server'),
			this.createVertexTemplateEntry(s + 'shape=mxgraph.rack.general.server_2;', 73, 150, '', 'Server 2', null, null, dt + 'server'),
			this.createVertexTemplateEntry(s + 'shape=mxgraph.rack.general.server_3;', 73, 150, '', 'Server 3', null, null, dt + 'server'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.general.switches_1;', 160, 30, '', 'Switches 1', null, null, dt + 'server'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.general.switches_2;', 160, 30, '', 'Switches 2', null, null, dt + 'server')
		]);
	};
	
	Sidebar.prototype.addRackF5Palette = function()
	{
		var sr = 'strokeColor=#666666;html=1;labelPosition=right;align=left;spacingLeft=15;shadow=0;dashed=0;fillColor=#ffffff;outlineConnect=0;';
		
		//default tags
		var dt = 'rack equipment ';

		this.addPaletteFunctions('rackF5', 'Rack / F5', false,
		[
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.arx_500;', 168, 20, '', 'ARX 500', null, null, dt + 'arx'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.arx_1000;', 168, 40, '', 'ARX 1000', null, null, dt + 'arx'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.arx_1500;', 168, 20, '', 'ARX 1500', null, null, dt + 'arx'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.arx_2000;', 168, 40, '', 'ARX 2000', null, null, dt + 'arx'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.arx_2500;', 168, 20, '', 'ARX 2500', null, null, dt + 'arx'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.arx_4000;', 168, 60, '', 'ARX 4000', null, null, dt + 'arx'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.arx_5000;', 168, 20, '', 'ARX 5000', null, null, dt + 'arx'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.arx_6000;', 168, 240, '', 'ARX 6000', null, null, dt + 'arx'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_1600;', 168, 20, '', 'BIG-IP 1600', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_2x00;', 168, 20, '', 'BIG-IP 2x00', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_3600;', 168, 20, '', 'BIG-IP 3600', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_3900;', 168, 20, '', 'BIG-IP 3900', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_4x00;', 168, 20, '', 'BIG-IP 4x00', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_5x00;', 168, 20, '', 'BIG-IP 5x00', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_6900;', 168, 40, '', 'BIG-IP 6900', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_89x0;', 168, 40, '', 'BIG-IP 89x0', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_7x00;', 168, 40, '', 'BIG-IP 7x00', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_10x00;', 168, 40, '', 'BIG-IP 10x00', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.big_ip_110x0;', 168, 60, '', 'BIG-IP 110x0', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.em_4000;', 168, 20, '', 'EM 4000', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.firepass_1200;', 168, 20, '', 'FirePass 1200', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.firepass_4100;', 168, 40, '', 'FirePass 4100', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.viprion_2400;', 168, 60, '', 'VIPRION 2400', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.viprion_4400;', 168, 120, '', 'VIPRION 4400', null, null, dt + 'big ip'),
			this.createVertexTemplateEntry(sr + 'shape=mxgraph.rack.f5.viprion_4800;', 168, 320, '', 'VIPRION 4800', null, null, dt + 'big ip')
		]);
	};
	
})();
