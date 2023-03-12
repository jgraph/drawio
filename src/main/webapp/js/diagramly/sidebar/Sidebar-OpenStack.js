(function () {
	Sidebar.prototype.addOpenStackPalette = function () {
		var d = 50;
		var dt = 'openstack';
		var sb = this;
		var s = 'aspect=fixed;perimeter=ellipsePerimeter;html=1;align=center;shadow=0;dashed=0;spacingTop=3;image;image=img/lib/openstack/';
		var gn = 'openstack cloud resources';
		this.setCurrentSearchEntryLibrary('openstack');

		var fns = [
			this.createVertexTemplateEntry(s + 'os__ceilometer__alarm.svg;',
				d, d, '', 'Alarm', false, null, this.getTagsForStencil(gn, 'alarm ceilometer openstack monitoring telemetry', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__cinder__volume.svg;',
				d, d, '', 'Volume', false, null, this.getTagsForStencil(gn, 'volume cinder openstack storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__cinder__volumeattachment.svg;',
				d, d, '', 'Volume Attachment', false, null, this.getTagsForStencil(gn, 'volume attachment cinder openstack storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__designate__recordset.svg;',
				d, d, '', 'DNS RecordSet', false, null, this.getTagsForStencil(gn, 'dns designate openstack record', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__designate__zone.svg;',
				d, d, '', 'DNS Zone', false, null, this.getTagsForStencil(gn, 'dns designate openstack zone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__firewall__as__service.svg;',
				d, d, '', 'Firewall', false, null, this.getTagsForStencil(gn, 'firewall fwaas openstack boundary', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__glance__image.svg;',
				d, d, '', 'Image', false, null, this.getTagsForStencil(gn, 'image glance openstack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__heat__autoscalinggroup.svg;',
				d, d, '', 'Autoscaling Group', false, null, this.getTagsForStencil(gn, 'autoscaling heat openstack orchestration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__heat__resourcegroup.svg;',
				d, d, '', 'Resource Group', false, null, this.getTagsForStencil(gn, 'resource group heat openstack orchestration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__heat__scalingpolicy.svg;',
				d, d, '', 'Scaling Policy', false, null, this.getTagsForStencil(gn, 'scaling policy heat openstack orchestration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__heat__server.svg;',
				d, d, '', 'Server', false, null, this.getTagsForStencil(gn, 'server heat openstack orchestration compute instance vm', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__heat__stack.svg;',
				d, d, '', 'Stack', false, null, this.getTagsForStencil(gn, 'stack heat openstack orchestration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__heat__unknown.svg;',
				d, d, '', 'Unknown', false, null, this.getTagsForStencil(gn, 'unknown heat openstack orchestration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__heat__waitcondition.svg;',
				d, d, '', 'Wait Condition', false, null, this.getTagsForStencil(gn, 'wait condition heat openstack orchestration', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__neutron__floatingip.svg;',
				d, d, '', 'Floating IP', false, null, this.getTagsForStencil(gn, 'float floating ip address neutron openstack sdn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__neutron__floatingipassociation.svg;',
				d, d, '', 'Floating IP Association', false, null, this.getTagsForStencil(gn, 'float floating ip association address neutron openstack sdn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__neutron__network.svg;',
				d, d, '', 'Network', false, null, this.getTagsForStencil(gn, 'network neutron openstack sdn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__neutron__subnet.svg;',
				d, d, '', 'Subnet', false, null, this.getTagsForStencil(gn, 'subnet neutron openstack sdn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__neutron__port.svg;',
				d, d, '', 'Port', false, null, this.getTagsForStencil(gn, 'port interface neutron openstack sdn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__neutron__router.svg;',
				d, d, '', 'Router', false, null, this.getTagsForStencil(gn, 'router neutron openstack sdn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__neutron__routerinterface.svg;',
				d, d, '', 'Router Interface', false, null, this.getTagsForStencil(gn, 'router interface neutron openstack sdn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__neutron__securitygroup.svg;',
				d, d, '', 'Security Group', false, null, this.getTagsForStencil(gn, 'security group neutron openstack sdn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__neutron__vpnservice.svg;',
				d, d, '', 'VPN', false, null, this.getTagsForStencil(gn, 'vpn neutron openstack sdn', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__nova__configdrive.svg;',
				d, d, '', 'Config Drive', false, null, this.getTagsForStencil(gn, 'config drive nova openstack compute', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__nova__flavor.svg;',
				d, d, '', 'Flavor', false, null, this.getTagsForStencil(gn, 'flavor nova openstack compute instance cpu ram hdd', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__nova__keypair.svg;',
				d, d, '', 'Keypair', false, null, this.getTagsForStencil(gn, 'keypair key nova openstack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__nova__server.svg;',
				d, d, '', 'Server', false, null, this.getTagsForStencil(gn, 'server nova openstack compute instance vm', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__octavia_loadbalancer.svg;',
				d, d, '', 'Load Balancer', false, null, this.getTagsForStencil(gn, 'loadbalance octavia neutron openstack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__senlin__policy.svg;',
				d, d, '', 'Policy', false, null, this.getTagsForStencil(gn, 'policy senlin openstack service access management', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__swift__container.svg;',
				d, d, '', 'Container', false, null, this.getTagsForStencil(gn, 'container swift openstack storage object file', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__trove__database.svg;',
				d, d, '', 'Database', false, null, this.getTagsForStencil(gn, 'database trove openstack sql db', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__logo__vertical.svg;',
				d, d, '', 'OpenStack Vertical', false, null, this.getTagsForStencil(gn, 'openstack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__logo__horizontal.svg;',
				d, d, '', 'OpenStack Horizontal', false, null, this.getTagsForStencil(gn, 'openstack', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'os__logo__icon.svg;',
				d, d, '', 'OpenSTack Icon', false, null, this.getTagsForStencil(gn, 'openstack', dt).join(' '))
		];

		this.addPalette('openstack', 'OpenStack', false, mxUtils.bind(this, function (content) {
			for (var i = 0; i < fns.length; i++) {
				content.appendChild(fns[i](content));
			}
		}));

		this.setCurrentSearchEntryLibrary();
	};
})();