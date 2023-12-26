/**
 * $Id: mxKubernetes.js,v 1.5 2019/14/11 12:32:06 mate Exp $
 * Copyright (c) 2006-2020, JGraph Ltd
 */
//**********************************************************************************************************************************************************
// Kubernetes icon
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeKubernetesIcon(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeKubernetesIcon, mxShape);

mxShapeKubernetesIcon.prototype.cst = {
		ICON : 'mxgraph.kubernetes.icon'
};

mxShapeKubernetesIcon.prototype.customProperties = [
	{name: 'prIcon', dispName: 'Type', defVal: 'api', type: 'enum', 
			enumList: [{val: 'c_c_m', dispName: 'C-C-M'},
					   {val: 'c_m', dispName: 'C-M'},
					   {val: 'c_role', dispName: 'C-Role'},
					   {val: 'cm', dispName: 'CM'},
					   {val: 'crb', dispName: 'CRB'},
					   {val: 'crd', dispName: 'CRD'},
					   {val: 'cronjob', dispName: 'Cronjob'},
					   {val: 'deploy', dispName: 'Deploy'},
					   {val: 'ds', dispName: 'DS'},
					   {val: 'ep', dispName: 'EP'},
					   {val: 'etcd', dispName: 'ETCD'},
					   {val: 'group', dispName: 'Group'},
					   {val: 'hpa', dispName: 'HPA'},
					   {val: 'ing', dispName: 'ING'},
					   {val: 'job', dispName: 'Job'},
					   {val: 'k_proxy', dispName: 'K-Proxy'},
					   {val: 'kubelet', dispName: 'Kubelet'},
					   {val: 'limits', dispName: 'Limits'},
					   {val: 'master', dispName: 'Master'},
					   {val: 'netpol', dispName: 'Netpol'},
					   {val: 'node', dispName: 'Node'},
					   {val: 'ns', dispName: 'NS'},
					   {val: 'pod', dispName: 'Pod'},
					   {val: 'psp', dispName: 'PSP'},
					   {val: 'pv', dispName: 'PV'},
					   {val: 'pvc', dispName: 'PVC'},
					   {val: 'quota', dispName: 'Quota'},
					   {val: 'rb', dispName: 'RB'},
					   {val: 'role', dispName: 'Role'},
					   {val: 'rs', dispName: 'RS'},
					   {val: 'sa', dispName: 'SA'},
					   {val: 'sc', dispName: 'SC'},
					   {val: 'sched', dispName: 'Sched'},
					   {val: 'secret', dispName: 'Secret'},
					   {val: 'sts', dispName: 'STS'},
					   {val: 'svc', dispName: 'SVC'},
					   {val: 'user', dispName: 'User'},
				       {val: 'vol', dispName: 'Vol'}]}
];


/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeKubernetesIcon.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var prIcon = mxUtils.getValue(this.state.style, 'prIcon', '');
	
	var fillColor = mxUtils.getValue(this.state.style, 'fillColor', '#ffffff');
	var strokeColor = mxUtils.getValue(this.state.style, 'strokeColor', '#ffffff');

	c.translate(x, y);
	
	var frame = mxStencilRegistry.getStencil('mxgraph.kubernetes.frame');
	
	c.setFillColor(strokeColor);
	frame.drawShape(c, this, 0, 0, w, h);

	c.setFillColor(fillColor);
	frame.drawShape(c, this, w * 0.03, h * 0.03, w * 0.94, h * 0.94);
	
	var prStencil = mxStencilRegistry.getStencil('mxgraph.kubernetes.' + prIcon);
	
	if (prStencil != null)
	{
		c.setFillColor(strokeColor);
		prStencil.drawShape(c, this, w * 0.2, h * 0.2, w * 0.6, h * 0.6);
	}
};

mxCellRenderer.registerShape(mxShapeKubernetesIcon.prototype.cst.ICON, mxShapeKubernetesIcon);

mxShapeKubernetesIcon.prototype.getConstraints = function(style, w, h)
{
	var constr = [];
	var r = Math.min(h * 0.5, w * 0.5);
	
	constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));

	return (constr);
}

/**
 * $Id: mxKubernetes.js,v 1.5 2019/14/11 12:32:06 mate Exp $
 * Copyright (c) 2006-2020, JGraph Ltd
 */
//**********************************************************************************************************************************************************
// Kubernetes icon 2
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeKubernetesIcon2(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeKubernetesIcon2, mxShape);

mxShapeKubernetesIcon2.prototype.cst = {
		ICON2 : 'mxgraph.kubernetes.icon2'
};

mxShapeKubernetesIcon2.prototype.customProperties = [
	{name: 'kubernetesLabel', dispName: 'Label', type: 'boolean', defVal:0},
	{name: 'prIcon', dispName: 'Type', defVal: 'api', type: 'enum', 
			enumList: [{val: 'api', dispName: 'API'},
					   {val: 'c_c_m', dispName: 'C-C-M'},
					   {val: 'cm', dispName: 'CM'},
					   {val: 'c_m', dispName: 'C-M'},
					   {val: 'c_role', dispName: 'C-Role'},
					   {val: 'control_plane', dispName: 'Control Plane'},
					   {val: 'crb', dispName: 'CRB'},
					   {val: 'crd', dispName: 'CRD'},
					   {val: 'cronjob', dispName: 'Cronjob'},
					   {val: 'deploy', dispName: 'Deploy'},
					   {val: 'ds', dispName: 'DS'},
					   {val: 'ep', dispName: 'EP'},
					   {val: 'etcd', dispName: 'ETCD'},
					   {val: 'group', dispName: 'Group'},
					   {val: 'hpa', dispName: 'HPA'},
					   {val: 'ing', dispName: 'ING'},
					   {val: 'job', dispName: 'Job'},
					   {val: 'k_proxy', dispName: 'K-Proxy'},
					   {val: 'kubelet', dispName: 'Kubelet'},
					   {val: 'limits', dispName: 'Limits'},
					   {val: 'netpol', dispName: 'Netpol'},
					   {val: 'node', dispName: 'Node'},
					   {val: 'ns', dispName: 'NS'},
					   {val: 'pod', dispName: 'Pod'},
					   {val: 'psp', dispName: 'PSP'},
					   {val: 'pv', dispName: 'PV'},
					   {val: 'pvc', dispName: 'PVC'},
					   {val: 'quota', dispName: 'Quota'},
					   {val: 'rb', dispName: 'RB'},
					   {val: 'role', dispName: 'Role'},
					]}
];


/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeKubernetesIcon2.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var prIcon = mxUtils.getValue(this.state.style, 'prIcon', '');
	
	var fillColor = mxUtils.getValue(this.state.style, 'fillColor', '#ffffff');
	var strokeColor = mxUtils.getValue(this.state.style, 'strokeColor', '#ffffff');
	var hasLabel = mxUtils.getValue(this.state.style, 'kubernetesLabel', 0);

	c.translate(x, y);
	
	var frame = mxStencilRegistry.getStencil('mxgraph.kubernetes.frame');
	
	c.setFillColor(strokeColor);
	frame.drawShape(c, this, 0, 0, w, h);

	c.setFillColor(fillColor);
	frame.drawShape(c, this, w * 0.03, h * 0.03, w * 0.94, h * 0.94);
	
	var prStencil = mxStencilRegistry.getStencil('mxgraph.kubernetes2.' + prIcon);
	c.setFillColor(strokeColor);
	c.setFontColor(strokeColor);
	c.setFontSize(Math.min(w, h) * 0.2);
	
	var w2 = Math.min(h, w);
	var h2 = w2;
	
	if (hasLabel == 1)
	{
		w2 = w2 * 0.8;
		h2 = w2 * 0.9;
	}
	
	if (prIcon == 'api')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'api', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'c_c_m')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'c-c-m', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'cm')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.25, w2 * 0.6, h2 * 0.5);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'cm', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'c_m')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'c-m', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'c_role')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.25, h * 0.2, w2 * 0.5, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'c-role', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'control_plane')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.setFontSize(Math.min(w, h) * 0.12);
			c.text(w * 0.5, h * 0.78, 0, 0, 'control\nplane', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'crb')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.25, h * 0.3, w2 * 0.5, h2 * 0.3);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'crb', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'crd')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.25, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'crd', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'cronjob')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'cronjob', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'deploy')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.27, h * 0.25, w2 * 0.6, h2 * 0.55);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'deploy', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'ds')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'ds', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'ep')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'ep', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'etcd')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'etcd', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'group')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'group', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'hpa')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.4, h * 0.1, w2 * 0.8, h2 * 0.8);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'hpa', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'ing')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'ing', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'job')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'job', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'k_proxy')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'k-proxy', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'kubelet')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'kubelet', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'limits')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'limits', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'netpol')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'netpol', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'node')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'node', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'ns')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'ns', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'pod')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'pod', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'psp')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'psp', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'pv')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'pv', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'pvc')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'pvc', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'quota')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'quota', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'rb')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'rb', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'role')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'role', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'rs')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'rs', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'sa')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'sa', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'sc')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'sc', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'sched')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'sched', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'secret')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'secret', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'sts')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'sts', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'svc')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'svc', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'user')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'user', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prIcon == 'vol')
	{
		prStencil.drawShape(c, this, w * 0.5 - w2 * 0.3, h * 0.2, w2 * 0.6, h2 * 0.6);

		if (hasLabel == 1)
		{
			c.text(w * 0.5, h * 0.75, 0, 0, 'vol', mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
		}
	}
	else if (prStencil != null)
	{
		prStencil.drawShape(c, this, w * 0.2, h * 0.2, w * 0.6, h * 0.6);
	}
};

mxCellRenderer.registerShape(mxShapeKubernetesIcon2.prototype.cst.ICON2, mxShapeKubernetesIcon2);

mxShapeKubernetesIcon2.prototype.getConstraints = function(style, w, h)
{
	var constr = [];
	var r = Math.min(h * 0.5, w * 0.5);
	
	constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));

	return (constr);
}

