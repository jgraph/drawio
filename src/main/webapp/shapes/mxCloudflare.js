/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 */

//**********************************************************************************************************************************************************
// Card
//**********************************************************************************************************************************************************
/**
 * A rectangle that paints an icon stencil in the color of iconColor. Used
 * for the product cards and the groups with icons of the Cloudflare shapes.
 * cfIcon is the name of any stencil, names without a dot are in
 * mxgraph.cloudflare. iconPosition is top, left, topLeft, center or none.
 */
function mxShapeCloudflareCard(bounds, fill, stroke, strokewidth)
{
	mxRectangleShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

mxUtils.extend(mxShapeCloudflareCard, mxRectangleShape);

mxShapeCloudflareCard.prototype.cst = {
	CARD: 'mxgraph.cloudflare.card'
};

mxShapeCloudflareCard.prototype.customProperties = [
	{name: 'iconColor', dispName: 'Icon Color', type: 'color', defVal: '#F6821F', primary: true},
	{name: 'iconPosition', dispName: 'Icon Position', type: 'enum', defVal: 'top',
		enumList: [{val: 'top', dispName: 'Top'}, {val: 'left', dispName: 'Left'},
			{val: 'topLeft', dispName: 'Top Left'}, {val: 'center', dispName: 'Center'},
			{val: 'none', dispName: 'None'}]},
	{name: 'iconSize', dispName: 'Icon Size', type: 'float', min: 0, defVal: 40},
	{name: 'iconSpacing', dispName: 'Icon Spacing', type: 'float', min: 0, defVal: 14}
];

/**
 * The icon is painted in the foreground, so the shape is never an HTML div.
 */
mxShapeCloudflareCard.prototype.isHtmlAllowed = function()
{
	return false;
};

/**
 * Full names of the icons that mxStencilRegistry.getStencil did not find,
 * shared by all cards. The icon is looked up on every paint, and if loading
 * its package throws (offline, the desktop app), the registry caches nothing
 * and would request the file again on every repaint and zoom. A missing icon
 * costs one lookup instead. The keys always contain a dot, so they never
 * match a property of Object.prototype.
 */
mxShapeCloudflareCard.prototype.missingIcons = {};

/**
 * Returns the stencil for the given icon name. A stencil registered after a
 * failed lookup is still used.
 */
mxShapeCloudflareCard.prototype.getIconStencil = function(name)
{
	if (name == null || name.length == 0)
	{
		return null;
	}

	name = (name.indexOf('.') < 0) ? 'mxgraph.cloudflare.' + name : name;
	var stencil = mxStencilRegistry.stencils[name];

	if (stencil == null && this.missingIcons[name] == null)
	{
		stencil = mxStencilRegistry.getStencil(name);

		if (stencil == null)
		{
			this.missingIcons[name] = true;
		}
	}

	return stencil;
};

/**
 * Returns the bounds of the icon as [x, y, size] or null.
 */
mxShapeCloudflareCard.prototype.getIconBounds = function(x, y, w, h)
{
	var position = mxUtils.getValue(this.style, 'iconPosition', 'top');
	var size = Math.max(0, Math.min(w, h, parseFloat(mxUtils.getValue(this.style, 'iconSize', 40))));
	var spacing = Math.max(0, parseFloat(mxUtils.getValue(this.style, 'iconSpacing', 14)));

	if (position == 'none' || !(size > 0) || !isFinite(spacing))
	{
		return null;
	}
	else if (position == 'left')
	{
		return [x + Math.min(spacing, w - size), y + (h - size) / 2, size];
	}
	else if (position == 'topLeft')
	{
		return [x + Math.min(spacing, w - size), y + Math.min(spacing, h - size), size];
	}
	else if (position == 'center')
	{
		return [x + (w - size) / 2, y + (h - size) / 2, size];
	}
	else
	{
		return [x + (w - size) / 2, y + Math.min(spacing, h - size), size];
	}
};

/**
 * Paints the icon above the background.
 */
mxShapeCloudflareCard.prototype.paintForeground = function(c, x, y, w, h)
{
	mxRectangleShape.prototype.paintForeground.apply(this, arguments);

	if (this.outline || this.style == null)
	{
		return;
	}

	var stencil = this.getIconStencil(mxUtils.getValue(this.style, 'cfIcon', null));
	var bounds = (stencil != null) ? this.getIconBounds(x, y, w, h) : null;

	if (bounds != null)
	{
		var color = mxUtils.getValue(this.style, 'iconColor', '#F6821F');
		var fill = this.fill;

		// The strokes of the icon stencils use the fill color of the shape
		this.fill = color;
		c.setShadow(false);
		c.setDashed(false);
		c.setFillColor(color);
		c.setStrokeColor(color);

		try
		{
			stencil.drawShape(c, this, bounds[0], bounds[1], bounds[2], bounds[2]);
		}
		finally
		{
			this.fill = fill;
		}
	}
};

mxCellRenderer.registerShape(mxShapeCloudflareCard.prototype.cst.CARD, mxShapeCloudflareCard);
