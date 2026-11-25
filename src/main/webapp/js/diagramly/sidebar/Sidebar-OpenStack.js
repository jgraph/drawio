/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	Sidebar.prototype.addOpenStackPalette = function()
	{
		var w = 50.0;
		var h = 50.0;
		var s = 'aspect=fixed;sketch=0;pointerEvents=1;shadow=0;dashed=0;html=1;strokeColor=none;labelPosition=center;verticalLabelPosition=bottom;outlineConnect=0;verticalAlign=top;align=center;perimeter=ellipsePerimeter;shape=mxgraph.openstack.';
		var gn = 'mxgraph.openstack';
		var dt = 'openstack open stack ';

		this.setCurrentSearchEntryLibrary('openstack', 'openstackBlue');
		this.addOpenStackGenericPalette(w, h, s, gn, dt, '3F51B5', 'Blue');
		this.setCurrentSearchEntryLibrary('openstack', 'openstackGrey');
		this.addOpenStackGenericPalette(w, h, s, gn, dt, '808080', 'Grey');
		this.setCurrentSearchEntryLibrary('openstack', 'openstackGreen');
		this.addOpenStackGenericPalette(w, h, s, gn, dt, '008000', 'Green');
		this.setCurrentSearchEntryLibrary('openstack', 'openstackRed');
		this.addOpenStackGenericPalette(w, h, s, gn, dt, 'C82128', 'Red');
		this.setCurrentSearchEntryLibrary();
	};
	
	Sidebar.prototype.addOpenStackGenericPalette = function(w, h, s, gn, dt, fillColor, fillString)
	{
		s = 'fillColor=#' + fillColor + ';' + s;
		dt = dt + fillString.toLowerCase() + ' ';

		var fns =
		[
			this.createVertexTemplateEntry(s + 'cinder_volume;',
				w, h, '', 'Cinder Volume', null, null, this.getTagsForStencil(gn, 'cinder volume', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cinder_volumeattachment;',
				w, h, '', 'Cinder VolumeAttachment', null, null, this.getTagsForStencil(gn, 'cinder volumeattachment volume attachment', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'designate_recordset;',
				w, h, '', 'Designate RecordSet', null, null, this.getTagsForStencil(gn, 'designate recordset record set', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'designate_zone;',
				w, h, '', 'Designate Zone', null, null, this.getTagsForStencil(gn, 'designate zone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'heat_autoscalinggroup;',
				w, h, '', 'Heat AutoScalingGroup', null, null, this.getTagsForStencil(gn, 'heat autoscalinggroup auto scaling group autoscaling', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'heat_resourcegroup;',
				w, h, '', 'Heat ResourceGroup', null, null, this.getTagsForStencil(gn, 'heat resourcegroup resource group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'heat_scalingpolicy;',
				w, h, '', 'Heat ScalingPolicy', null, null, this.getTagsForStencil(gn, 'heat scalingpolicy scaling policy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'neutron_floatingip;',
				w, h, '', 'Neutron FloatingIP', null, null, this.getTagsForStencil(gn, 'neutron floatingip floating ip', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'neutron_floatingipassociation;',
				w, h, '', 'Neutron FloatingIPAssociation', null, null, this.getTagsForStencil(gn, 'neutron floatingipassociation floatingip floating ip association', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'neutron_net;',
				w, h, '', 'Neutron Net', null, null, this.getTagsForStencil(gn, 'neutron net', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'neutron_port;',
				w, h, '', 'Neutron Port', null, null, this.getTagsForStencil(gn, 'neutron port', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'neutron_router;',
				w, h, '', 'Neutron Router', null, null, this.getTagsForStencil(gn, 'neutron router', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'neutron_routerinterface;',
				w, h, '', 'Neutron RouterInterface', null, null, this.getTagsForStencil(gn, 'neutron routerinterface router interface', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'neutron_securitygroup;',
				w, h, '', 'Neutron SecurityGroup', null, null, this.getTagsForStencil(gn, 'neutron securitygroup security group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'neutron_subnet;',
				w, h, '', 'Neutron Subnet', null, null, this.getTagsForStencil(gn, 'neutron subnet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nova_keypair;',
				w, h, '', 'Nova Keypair', null, null, this.getTagsForStencil(gn, 'nova keypair', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nova_server;',
				w, h, '', 'Nova Server', null, null, this.getTagsForStencil(gn, 'nova server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'swift_container;',
				w, h, '', 'Swift Container', null, null, this.getTagsForStencil(gn, 'swift container', dt).join(' '))
		];
			
		this.addPalette('openstack' + fillString, 'OpenStack / ' + fillString, false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
})();
