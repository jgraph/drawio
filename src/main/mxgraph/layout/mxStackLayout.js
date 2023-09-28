/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxStackLayout
 * 
 * Extends <mxGraphLayout> to create a horizontal or vertical stack of the
 * child vertices. The children do not need to be connected for this layout
 * to work.
 * 
 * Example:
 * 
 * (code)
 * var layout = new mxStackLayout(graph, true);
 * layout.execute(graph.getDefaultParent());
 * (end)
 * 
 * Constructor: mxStackLayout
 * 
 * Constructs a new stack layout layout for the specified graph,
 * spacing, orientation and offset.
 */
function mxStackLayout(graph, horizontal, spacing, x0, y0, border)
{
	mxGraphLayout.call(this, graph);
	this.horizontal = (horizontal != null) ? horizontal : true;
	this.spacing = (spacing != null) ? spacing : 0;
	this.x0 = (x0 != null) ? x0 : 0;
	this.y0 = (y0 != null) ? y0 : 0;
	this.border = (border != null) ? border : 0;
};

/**
 * Extends mxGraphLayout.
 */
mxStackLayout.prototype = new mxGraphLayout();
mxStackLayout.prototype.constructor = mxStackLayout;

/**
 * Variable: horizontal
 *
 * Specifies the orientation of the layout. Default is true.
 */
mxStackLayout.prototype.horizontal = null;

/**
 * Variable: spacing
 *
 * Specifies the spacing between the cells. Default is 0.
 */
mxStackLayout.prototype.spacing = null;

/**
 * Variable: x0
 *
 * Specifies the horizontal origin of the layout. Default is 0.
 */
mxStackLayout.prototype.x0 = null;

/**
 * Variable: y0
 *
 * Specifies the vertical origin of the layout. Default is 0.
 */
mxStackLayout.prototype.y0 = null;

/**
 * Variable: border
 *
 * Border to be added if fill is true. Default is 0.
 */
mxStackLayout.prototype.border = 0;

/**
 * Variable: marginTop
 * 
 * Top margin for the child area. Default is 0.
 */
mxStackLayout.prototype.marginTop = 0;

/**
 * Variable: marginLeft
 * 
 * Top margin for the child area. Default is 0.
 */
mxStackLayout.prototype.marginLeft = 0;

/**
 * Variable: marginRight
 * 
 * Top margin for the child area. Default is 0.
 */
mxStackLayout.prototype.marginRight = 0;

/**
 * Variable: marginBottom
 * 
 * Top margin for the child area. Default is 0.
 */
mxStackLayout.prototype.marginBottom = 0;

/**
 * Variable: keepFirstLocation
 * 
 * Boolean indicating if the location of the first cell should be
 * kept, that is, it will not be moved to x0 or y0. Default is false.
 */
mxStackLayout.prototype.keepFirstLocation = false;

/**
 * Variable: fill
 * 
 * Boolean indicating if dimension should be changed to fill out the parent
 * cell. Default is false.
 */
mxStackLayout.prototype.fill = false;
	
/**
 * Variable: resizeParent
 * 
 * If the parent should be resized to match the width/height of the
 * stack. Default is false.
 */
mxStackLayout.prototype.resizeParent = false;

/**
 * Variable: resizeParentMax
 * 
 * Use maximum of existing value and new value for resize of parent.
 * Default is false.
 */
mxStackLayout.prototype.resizeParentMax = false;

/**
 * Variable: resizeLast
 * 
 * If the last element should be resized to fill out the parent. Default is
 * false. If <resizeParent> is true then this is ignored.
 */
mxStackLayout.prototype.resizeLast = false;

/**
 * Variable: wrap
 * 
 * Value at which a new column or row should be created. Default is null.
 */
mxStackLayout.prototype.wrap = null;

/**
 * Variable: borderCollapse
 * 
 * If the strokeWidth should be ignored. Default is true.
 */
mxStackLayout.prototype.borderCollapse = true;

/**
 * Variable: allowGaps
 * 
 * If gaps should be allowed in the stack. Default is false.
 */
mxStackLayout.prototype.allowGaps = false;

/**
 * Variable: gridSize
 * 
 * Grid size for alignment of position and size. Default is 0.
 */
mxStackLayout.prototype.gridSize = 0;

/**
 * Function: isHorizontal
 * 
 * Returns <horizontal>.
 */
mxStackLayout.prototype.isHorizontal = function()
{
	return this.horizontal;
};

/**
 * Function: moveCell
 * 
 * Implements <mxGraphLayout.moveCell>.
 */
mxStackLayout.prototype.moveCell = function(cell, x, y)
{
	var model = this.graph.getModel();
	var parent = model.getParent(cell);
	var horizontal = this.isHorizontal();
	
	if (cell != null && parent != null)
	{
		var i = 0;
		var last = 0;
		var childCount = model.getChildCount(parent);
		var value = (horizontal) ? x : y;
		var pstate = this.graph.getView().getState(parent);

		if (pstate != null)
		{
			value -= (horizontal) ? pstate.x : pstate.y;
		}
		
		value /= this.graph.view.scale;
		
		for (i = 0; i < childCount; i++)
		{
			var child = model.getChildAt(parent, i);
			
			if (child != cell)
			{
				var bounds = model.getGeometry(child);
				
				if (bounds != null)
				{
					var tmp = (horizontal) ?
						bounds.x + bounds.width / 2 :
						bounds.y + bounds.height / 2;
					
					if (last <= value && tmp > value)
					{
						break;
					}
					
					last = tmp;
				}
			}
		}

		// Changes child order in parent
		var idx = parent.getIndex(cell);
		idx = Math.max(0, i - ((i > idx) ? 1 : 0));

		model.add(parent, cell, idx);
	}
};

/**
 * Function: getParentSize
 * 
 * Returns the size for the parent container or the size of the graph
 * container if the parent is a layer or the root of the model.
 */
mxStackLayout.prototype.getParentSize = function(parent)
{
	var model = this.graph.getModel();			
	var pgeo = model.getGeometry(parent);
	
	// Handles special case where the parent is either a layer with no
	// geometry or the current root of the view in which case the size
	// of the graph's container will be used.
	if (this.graph.container != null && ((pgeo == null &&
		model.isLayer(parent)) || parent == this.graph.getView().currentRoot))
	{
		var width = this.graph.container.offsetWidth - 1;
		var height = this.graph.container.offsetHeight - 1;
		pgeo = new mxRectangle(0, 0, width, height);
	}
	
	return pgeo;
};

/**
 * Function: getLayoutCells
 * 
 * Returns the cells to be layouted.
 */
mxStackLayout.prototype.getLayoutCells = function(parent)
{
	var model = this.graph.getModel();
	var childCount = model.getChildCount(parent);
	var cells = [];
	
	for (var i = 0; i < childCount; i++)
	{
		var child = model.getChildAt(parent, i);
		
		if (!this.isVertexIgnored(child) && this.isVertexMovable(child))
		{
			cells.push(child);
		}
	}
	
	if (this.allowGaps)
	{
		cells.sort(mxUtils.bind(this, function(c1, c2)
		{
			var geo1 = this.graph.getCellGeometry(c1);
			var geo2 = this.graph.getCellGeometry(c2);
			
			return (this.horizontal) ?
				((geo1.x == geo2.x) ? 0 : ((geo1.x > geo2.x > 0) ? 1 : -1)) :
				((geo1.y == geo2.y) ? 0 : ((geo1.y > geo2.y > 0) ? 1 : -1));
		}));
	}
	
	return cells;
};

/**
 * Function: snap
 * 
 * Snaps the given value to the grid size.
 */
mxStackLayout.prototype.snap = function(value)
{
	if (this.gridSize != null && this.gridSize > 0)
	{
		value = Math.max(value, this.gridSize);
		
		if (value / this.gridSize > 1)
		{
			var mod = value % this.gridSize;
			value += mod > this.gridSize / 2 ? (this.gridSize - mod) : -mod;
		}
	}
	
	return value;
};

/**
 * Function: execute
 * 
 * Implements <mxGraphLayout.execute>.
 * 
 * Only children where <isVertexIgnored> returns false are taken into
 * account.
 */
mxStackLayout.prototype.execute = function(parent)
{
	if (parent != null)
	{
		var pgeo = this.getParentSize(parent);
		var horizontal = this.isHorizontal();
		var model = this.graph.getModel();	
		var fillValue = null;
		
		if (pgeo != null)
		{
			fillValue = (horizontal) ? pgeo.height - this.marginTop - this.marginBottom :
				pgeo.width - this.marginLeft - this.marginRight;
		}
		
		fillValue -= 2 * this.border;
		var x0 = this.x0 + this.border + this.marginLeft;
		var y0 = this.y0 + this.border + this.marginTop;
		
		// Handles swimlane start size
		if (this.graph.isSwimlane(parent))
		{
			// Uses computed style to get latest 
			var style = this.graph.getCellStyle(parent);
			var start = mxUtils.getNumber(style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE);
			var horz = mxUtils.getValue(style, mxConstants.STYLE_HORIZONTAL, true) == 1;

			if (pgeo != null)
			{
				if (horz)
				{
					start = Math.min(start, pgeo.height);
				}
				else
				{
					start = Math.min(start, pgeo.width);
				}
			}
			
			if (horizontal == horz)
			{
				fillValue -= start;
			}

			if (horz)
			{
				y0 += start;
			}
			else
			{
				x0 += start;
			}
		}

		model.beginUpdate();
		try
		{
			var tmp = 0;
			var last = null;
			var lastValue = 0;
			var lastChild = null;
			var cells = this.getLayoutCells(parent);
			
			for (var i = 0; i < cells.length; i++)
			{
				var child = cells[i];
				var geo = model.getGeometry(child);
				
				if (geo != null)
				{
					geo = geo.clone();
					
					if (this.wrap != null && last != null)
					{
						if ((horizontal && last.x + last.width +
							geo.width + 2 * this.spacing > this.wrap) ||
							(!horizontal && last.y + last.height +
							geo.height + 2 * this.spacing > this.wrap))
						{
							last = null;
							
							if (horizontal)
							{
								y0 += tmp + this.spacing;
							}
							else
							{
								x0 += tmp + this.spacing;
							}
							
							tmp = 0;
						}	
					}
					
					tmp = Math.max(tmp, (horizontal) ? geo.height : geo.width);
					var sw = 0;
					
					if (!this.borderCollapse)
					{
						var childStyle = this.graph.getCellStyle(child);
						sw = mxUtils.getNumber(childStyle, mxConstants.STYLE_STROKEWIDTH, 1);
					}
					
					if (last != null)
					{
						var temp = lastValue + this.spacing + Math.floor(sw / 2);
						
						if (horizontal)
						{
							geo.x = this.snap(((this.allowGaps) ? Math.max(temp, geo.x) :
								temp) - this.marginLeft) + this.marginLeft;
						}
						else
						{
							geo.y = this.snap(((this.allowGaps) ? Math.max(temp, geo.y) :
								temp) - this.marginTop) + this.marginTop;
						}
					}
					else if (!this.keepFirstLocation)
					{
						if (horizontal)
						{
							geo.x = (this.allowGaps && geo.x > x0) ? Math.max(this.snap(geo.x -
								this.marginLeft) + this.marginLeft, x0) : x0;
						}
						else
						{
							geo.y = (this.allowGaps && geo.y > y0) ? Math.max(this.snap(geo.y -
								this.marginTop) + this.marginTop, y0) : y0;
						}
					}
					
					if (horizontal)
					{
						geo.y = y0;
					}
					else
					{
						geo.x = x0;
					}
					
					if (this.fill && fillValue != null)
					{
						if (horizontal)
						{
							geo.height = fillValue;
						}
						else
						{
							geo.width = fillValue;									
						}
					}
					
					if (horizontal)
					{
						geo.width = this.snap(geo.width);
					}
					else
					{
						geo.height = this.snap(geo.height);
					}
					
					this.setChildGeometry(child, geo);
					lastChild = child;
					last = geo;
					
					if (horizontal)
					{
						lastValue = last.x + last.width + Math.floor(sw / 2);
					}
					else
					{
						lastValue = last.y + last.height + Math.floor(sw / 2);
					}
				}
			}

			if (this.resizeParent && pgeo != null && last != null && !this.graph.isCellCollapsed(parent))
			{
				this.updateParentGeometry(parent, pgeo, last);
			}
			else if (this.resizeLast && pgeo != null && last != null && lastChild != null)
			{
				if (horizontal)
				{
					last.width = pgeo.width - last.x - this.spacing - this.marginRight - this.marginLeft;
				}
				else
				{
					last.height = pgeo.height - last.y - this.spacing - this.marginBottom;
				}
				
				this.setChildGeometry(lastChild, last);
			}
		}
		finally
		{
			model.endUpdate();
		}
	}
};

/**
 * Function: setChildGeometry
 * 
 * Sets the specific geometry to the given child cell.
 * 
 * Parameters:
 * 
 * child - The given child of <mxCell>.
 * geo - The specific geometry of <mxGeometry>.
 */
mxStackLayout.prototype.setChildGeometry = function(child, geo)
{
	var geo2 = this.graph.getCellGeometry(child);
	
	if (geo2 == null || geo.x != geo2.x || geo.y != geo2.y ||
		geo.width != geo2.width || geo.height != geo2.height)
	{
		this.graph.getModel().setGeometry(child, geo);
	}
};

/**
 * Function: updateParentGeometry
 * 
 * Updates the geometry of the given parent cell.
 * 
 * Parameters:
 * 
 * parent - The given parent of <mxCell>.
 * pgeo - The new <mxGeometry> for parent.
 * last - The last <mxGeometry>.
 */
mxStackLayout.prototype.updateParentGeometry = function(parent, pgeo, last)
{
	var horizontal = this.isHorizontal();
	var model = this.graph.getModel();	

	var pgeo2 = pgeo.clone();
	
	if (horizontal)
	{
		var tmp = last.x + last.width + this.marginRight + this.border;
		
		if (this.resizeParentMax)
		{
			pgeo2.width = Math.max(pgeo2.width, tmp);
		}
		else
		{
			pgeo2.width = tmp;
		}
	}
	else
	{
		var tmp = last.y + last.height + this.marginBottom + this.border;
		
		if (this.resizeParentMax)
		{
			pgeo2.height = Math.max(pgeo2.height, tmp);
		}
		else
		{
			pgeo2.height = tmp;
		}
	}
	
	if (pgeo.x != pgeo2.x || pgeo.y != pgeo2.y ||
		pgeo.width != pgeo2.width || pgeo.height != pgeo2.height)
	{
		model.setGeometry(parent, pgeo2);
	}
};
