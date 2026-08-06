/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 */

// ArchiMate 4 uses the same graphical notation as ArchiMate 3.x, so the
// shapes below reuse the mxArchiMate3 rendering classes. This file requires
// mxArchiMate3.js to be loaded first (see mxStencilRegistry.libraries
// entry for 'archimate4' in diagramly/Editor.js).

//**********************************************************************************************************************************************************
//Element (boxed notation with optional domain letter)
//**********************************************************************************************************************************************************
/**
* Extends mxArchiMate3Application. Adds the optional domain letter cue
* (M, S, C, B, A, T or I in the top-left corner) defined in section 3.8
* of the ArchiMate 4 Specification.
*/
function mxArchiMate4Element(bounds, fill, stroke, strokewidth)
{
	mxArchiMate3Application.call(this, bounds, fill, stroke, strokewidth);
};

/**
* Extends mxArchiMate3Application.
*/
mxUtils.extend(mxArchiMate4Element, mxArchiMate3Application);

mxArchiMate4Element.prototype.cst = {
		ELEMENT : 'mxgraph.archimate4.element',
		ARCHI_DOMAIN : 'archiDomain',
		ARCHI_BADGE : 'archiBadge'
};

mxArchiMate4Element.prototype.domainLetters = {
		'motivation' : 'M',
		'strategy' : 'S',
		'common' : 'C',
		'business' : 'B',
		'application' : 'A',
		'technology' : 'T',
		'implementation' : 'I'
};

// Restricts the type enums to the ArchiMate 4 element catalog (removed in
// v4 and therefore absent here: interaction, contract, representation,
// constraint, gap and the comm path)
mxArchiMate4Element.prototype.customProperties = [
	{name: 'archiType', dispName: 'Type', type: 'enum',
		enumList: [{val: 'square', dispName: 'Square'},
				   {val: 'rounded', dispName: 'Rounded'},
				   {val: 'oct', dispName: 'Octagonal'}]
	},
	{name: 'appType', dispName: 'Element Type', type: 'enum',
		enumList: [{val: 'generic', dispName: 'Generic'},
				   {val: 'role', dispName: 'Role / Stakeholder'},
				   {val: 'collab', dispName: 'Collaboration'},
				   {val: 'path', dispName: 'Path'},
				   {val: 'serv', dispName: 'Service'},
				   {val: 'proc', dispName: 'Process'},
				   {val: 'func', dispName: 'Function'},
				   {val: 'event', dispName: 'Event'},
				   {val: 'grouping', dispName: 'Grouping'},
				   {val: 'location', dispName: 'Location'},
				   {val: 'driver', dispName: 'Driver'},
				   {val: 'assess', dispName: 'Assessment'},
				   {val: 'goal', dispName: 'Goal'},
				   {val: 'outcome', dispName: 'Outcome'},
				   {val: 'principle', dispName: 'Principle'},
				   {val: 'requirement', dispName: 'Requirement'},
				   {val: 'meaning', dispName: 'Meaning'},
				   {val: 'amValue', dispName: 'Value'},
				   {val: 'resource', dispName: 'Resource'},
				   {val: 'capability', dispName: 'Capability'},
				   {val: 'valueStream', dispName: 'Value Stream'},
				   {val: 'course', dispName: 'Course of Action'},
				   {val: 'actor', dispName: 'Business Actor'},
				   {val: 'interface', dispName: 'Interface'},
				   {val: 'interface2', dispName: 'Interface (Alternative)'},
				   {val: 'passive', dispName: 'Object (Passive)'},
				   {val: 'product', dispName: 'Product'},
				   {val: 'comp', dispName: 'Component'},
				   {val: 'node', dispName: 'Node'},
				   {val: 'device', dispName: 'Device'},
				   {val: 'sysSw', dispName: 'System Software'},
				   {val: 'netw', dispName: 'Communication Network'},
				   {val: 'distribution', dispName: 'Distribution Network'},
				   {val: 'equipment', dispName: 'Equipment'},
				   {val: 'facility', dispName: 'Facility'},
				   {val: 'artifact', dispName: 'Artifact'},
				   {val: 'material', dispName: 'Material'},
				   {val: 'workPackage', dispName: 'Work Package'},
				   {val: 'deliverable', dispName: 'Deliverable'},
				   {val: 'plateau', dispName: 'Plateau'}]
	},
	{name: 'archiDomain', dispName: 'Domain', type: 'enum',
		enumList: [{val: 'motivation', dispName: 'Motivation'},
				   {val: 'strategy', dispName: 'Strategy'},
				   {val: 'common', dispName: 'Common'},
				   {val: 'business', dispName: 'Business'},
				   {val: 'application', dispName: 'Application'},
				   {val: 'technology', dispName: 'Technology'},
				   {val: 'implementation', dispName: 'Implementation and Migration'}]
	},
	{name: 'archiBadge', dispName: 'Domain Letter', type: 'bool', defVal: false}
];

/**
* Function: paintVertexShape
*
* Paints the vertex shape.
*/
mxArchiMate4Element.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	this.background(c, 0, 0, w, h);
	c.setShadow(false);

	if (mxUtils.getValue(this.style, mxArchiMate4Element.prototype.cst.ARCHI_BADGE, '0') == '1')
	{
		this.paintBadge(c, w, h);
	}

	c.translate(w - 20, 5);
	this.foreground(c, w - 20, 5, 15, 15);
};

mxArchiMate4Element.prototype.paintBadge = function(c, w, h)
{
	var domain = mxUtils.getValue(this.style, mxArchiMate4Element.prototype.cst.ARCHI_DOMAIN, '');
	var letter = mxArchiMate4Element.prototype.domainLetters[domain];

	if (letter != null)
	{
		c.setFontSize(12);
		c.setFontColor(this.stroke);
		c.text(12.5, 12.5, 0, 0, letter, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
	}
};

/**
* Function: foreground
*
* Paints the corner icon. Overridden for the device icon, which the v3
* dispatcher paints square: it is drawn 3:2 (letterboxed in the 15x15
* icon box) to match the notation in section 10.3.2 of the ArchiMate 4
* Specification and the standalone mxgraph.archimate4.device shape.
*/
mxArchiMate4Element.prototype.foreground = function(c, x, y, w, h)
{
	var type = mxUtils.getValue(this.style, mxArchiMate3Application.prototype.cst.TYPE, '');

	if (type === mxArchiMate3Application.prototype.cst.DEVICE)
	{
		c.setDashed(false);
		c.translate(0, 2.5);
		h = h - 5;

		mxArchiMate4Device.prototype.background(c, x, y, w, h);
	}
	else
	{
		mxArchiMate3Application.prototype.foreground.call(this, c, x, y, w, h);
	}
};

mxCellRenderer.registerShape(mxArchiMate4Element.prototype.cst.ELEMENT, mxArchiMate4Element);

//**********************************************************************************************************************************************************
//Device
//**********************************************************************************************************************************************************
/**
* Extends mxArchiMate3Device. Redraws the icon with the proportions of the
* ArchiMate 4 Specification (section 10.3.2): the body is inset so the
* pedestal flares out beyond it, and the corner radius no longer distorts
* on non-square bounds.
*/
function mxArchiMate4Device(bounds, fill, stroke, strokewidth)
{
	mxArchiMate3Device.call(this, bounds, fill, stroke, strokewidth);
};

/**
* Extends mxArchiMate3Device.
*/
mxUtils.extend(mxArchiMate4Device, mxArchiMate3Device);

mxArchiMate4Device.prototype.background = function(c, x, y, w, h)
{
	var r = Math.min(w, h) * 0.15;

	c.roundrect(w * 0.06, 0, w * 0.88, h * 0.85, r, r);
	c.fillAndStroke();

	c.begin();
	c.moveTo(w * 0.18, h * 0.85);
	c.lineTo(0, h);
	c.lineTo(w, h);
	c.lineTo(w * 0.82, h * 0.85);
	c.close();
	c.fillAndStroke();
};

//**********************************************************************************************************************************************************
//Icon notations (same rendering as ArchiMate 3)
//**********************************************************************************************************************************************************

// Common Domain
mxCellRenderer.registerShape('mxgraph.archimate4.role', mxArchiMate3Role);
mxCellRenderer.registerShape('mxgraph.archimate4.collaboration', mxArchiMate3Collaboration);
mxCellRenderer.registerShape('mxgraph.archimate4.path', mxArchiMate3Path);
mxCellRenderer.registerShape('mxgraph.archimate4.service', mxArchiMate3Service);
mxCellRenderer.registerShape('mxgraph.archimate4.process', mxArchiMate3Process);
mxCellRenderer.registerShape('mxgraph.archimate4.function', mxArchiMate3Function);
mxCellRenderer.registerShape('mxgraph.archimate4.event', mxArchiMate3Event);
mxCellRenderer.registerShape('mxgraph.archimate4.grouping', mxArchiMate3Grouping);
mxCellRenderer.registerShape('mxgraph.archimate4.locationIcon', mxArchiMate3LocationIcon);

// Motivation Domain
mxCellRenderer.registerShape('mxgraph.archimate4.driver', mxArchiMate3Driver);
mxCellRenderer.registerShape('mxgraph.archimate4.assess', mxArchiMate3Assessment);
mxCellRenderer.registerShape('mxgraph.archimate4.goal', mxArchiMate3Goal);
mxCellRenderer.registerShape('mxgraph.archimate4.outcome', mxArchiMate3Outcome);
mxCellRenderer.registerShape('mxgraph.archimate4.principle', mxArchiMate3Principle);
mxCellRenderer.registerShape('mxgraph.archimate4.requirement', mxArchiMate3Requirement);

// Strategy Domain
mxCellRenderer.registerShape('mxgraph.archimate4.resource', mxArchiMate3Resource);
mxCellRenderer.registerShape('mxgraph.archimate4.capability', mxArchiMate3Capability);
mxCellRenderer.registerShape('mxgraph.archimate4.valueStream', mxArchiMate3ValueStream);
mxCellRenderer.registerShape('mxgraph.archimate4.course', mxArchiMate3Course);

// Business Domain
mxCellRenderer.registerShape('mxgraph.archimate4.actor', mxArchiMate3Actor);
mxCellRenderer.registerShape('mxgraph.archimate4.interface', mxArchiMate3Interface);
mxCellRenderer.registerShape('mxgraph.archimate4.businessObject', mxArchiMate3BusinessObject);
mxCellRenderer.registerShape('mxgraph.archimate4.product', mxArchiMate3Product);

// Application Domain
mxCellRenderer.registerShape('mxgraph.archimate4.component', mxArchiMate3Component);

// Technology Domain
mxCellRenderer.registerShape('mxgraph.archimate4.node', mxArchiMate3Node);
mxCellRenderer.registerShape('mxgraph.archimate4.device', mxArchiMate4Device);
mxCellRenderer.registerShape('mxgraph.archimate4.sysSw', mxArchiMate3SysSw);
mxCellRenderer.registerShape('mxgraph.archimate4.network', mxArchiMate3Network);
mxCellRenderer.registerShape('mxgraph.archimate4.equipment', mxArchiMate3Equipment);
mxCellRenderer.registerShape('mxgraph.archimate4.facility', mxArchiMate3Facility);
mxCellRenderer.registerShape('mxgraph.archimate4.distribution', mxArchiMate3Distribution);
mxCellRenderer.registerShape('mxgraph.archimate4.material', mxArchiMate3Material);

// Implementation and Migration Domain
mxCellRenderer.registerShape('mxgraph.archimate4.workPackage', mxArchiMate3WorkPackage);
mxCellRenderer.registerShape('mxgraph.archimate4.deliverable', mxArchiMate3Deliverable);
mxCellRenderer.registerShape('mxgraph.archimate4.plateau', mxArchiMate3Plateau);
