/**
 * Copyright (c) 2006-2018, JGraph Ltd
 */
/**
 * Class: mxTableLayout
 * 
 * Extends <mxGraphLayout> to create a table of the
 * child vertices. The children do not need to be connected for this layout
 * to work.
 * 
 * Example:
 * 
 * (code)
 * var layout = new mxTableLayout(graph, 2, 2); //2x2 table layout
 * layout.execute(graph.getDefaultParent());
 * (end)
 * 
 * Constructor: mxTableLayout
 * 
 * Constructs a new table layout for the specified graph
 */
function mxTableLayout(graph, rows, columns, border)
{
	mxGraphLayout.call(this, graph);
	this.rows = (rows != null && rows > 0) ? rows : 2;
	this.columns = (columns != null && columns > 0) ? columns : 2;
	this.border = (border != null) ? border : 0;
};

/**
 * Extends mxStackLayout.
 */
mxTableLayout.prototype = new mxStackLayout();
mxTableLayout.prototype.constructor = mxTableLayout;

/**
 * Variable: rows
 *
 * Specifies the number of rows of the layout. Default is 2.
 */
mxTableLayout.prototype.rows = 2;

/**
 * Variable: columns
 *
 * Specifies the number of columns of the layout. Default is 2.
 */
mxTableLayout.prototype.columns = 2;

/**
 * Variable: border
 *
 * Border between cells and around the table. Default is 0.
 */
mxTableLayout.prototype.border = 0;

/**
 * Variable: marginTop
 * 
 * Top margin for the child area. Default is 0.
 */
mxTableLayout.prototype.marginTop = 0;

/**
 * Variable: marginLeft
 * 
 * Top margin for the child area. Default is 0.
 */
mxTableLayout.prototype.marginLeft = 0;

/**
 * Variable: marginRight
 * 
 * Top margin for the child area. Default is 0.
 */
mxTableLayout.prototype.marginRight = 0;

/**
 * Variable: marginBottom
 * 
 * Top margin for the child area. Default is 0.
 */
mxTableLayout.prototype.marginBottom = 0;

/**
 * Variable: equalColumns
 * 
 * Boolean indicating if columns are distributed equally. Default is true
 */
mxTableLayout.prototype.equalColumns = true;

/**
 * Variable: colWidths
 * 
 * Required only if resizeParent is true and autoAddCol is true. It should be one value if equalColumns is true. Default is 100
 */
mxTableLayout.prototype.colWidths = "100";

/**
 * Variable: equalRows
 * 
 * Boolean indicating if rows are distributed equally. Default is true
 */
mxTableLayout.prototype.equalRows = true;

/**
 * Variable: rowHeights
 * 
 * Required only if resizeParent is true and autoAddRow is true. It should be one value if equalRows is true. Default is 50
 */
mxTableLayout.prototype.rowHeights = "50";

/**
 * Variable: colPercentages
 * 
 * The percentages of each column from the parent width. This value is ignored if equalColumns is true. Default is null.
 */
mxTableLayout.prototype.colPercentages = null;
	
/**
 * Variable: rowPercentages
 * 
 * The percentages of each row from the parent width. This value is ignored if equalRows is true. Default is null.
 */
mxTableLayout.prototype.rowPercentages = null;

/**
 * Variable: resizeParent
 * 
 * If the parent should be resized when adding new rows/columns. Default is false.
 */
mxTableLayout.prototype.resizeParent = false;

/**
 * Variable: autoAddRow
 * 
 * Weather a new row should be created. Default is true.
 */
mxTableLayout.prototype.autoAddRow = true;

/**
 * Variable: autoAddCol
 * 
 * Weather a new column should be created. This value is ignored if autoAddRow is true. Default is false.
 */
mxTableLayout.prototype.autoAddCol = false;

/**
 * Variable: fill
 * 
 * Boolean indicating if dimension should be changed to fill out the parent
 * cell. Default is true.
 */
mxTableLayout.prototype.fill = true;

/**
 * Function: moveCell
 * 
 * Implements <mxGraphLayout.moveCell>.
 */
mxTableLayout.prototype.moveCell = function(cell, x, y)
{
	var model = this.graph.getModel();
	var parent = model.getParent(cell);
	var pstate = this.graph.getView().getState(parent);

	if (pstate != null)
	{
		x -= pstate.x;
		y -= pstate.y;
	}
	
	if (cell != null && parent != null)
	{
		var i = 0;
		var childCount = model.getChildCount(parent);

		for (i = 0; i < childCount; i++)
		{
			var child = model.getChildAt(parent, i);
			
			if (child != cell)
			{
				var bounds = model.getGeometry(child);
				
				if (bounds != null)
				{
					if (x >= bounds.x && x <= bounds.x + bounds.width
							&& y >= bounds.y && y <= bounds.y + bounds.height)
					{
						break;
					}
				}
			}
		}

		model.add(parent, cell, i);
	}
};

/**
 * Function: execute
 * 
 * Implements <mxGraphLayout.execute>.
 * 
 * Only children where <isVertexIgnored> returns false are taken into
 * account.
 */
mxTableLayout.prototype.execute = function(parent)
{
	if (parent != null)
	{
		var pgeo = this.getParentSize(parent);
		var model = this.graph.getModel();	
		var fillWidth = null, fillHeight = null;
		var x = this.marginLeft + this.border;
		var y = this.marginTop + this.border;

		if (pgeo == null)
		{
			return; //We cannot do anything without knowing the parent geometry
		}

		fillHeight = pgeo.height - this.marginTop - this.marginBottom - 2 * this.border;
		fillWidth = pgeo.width - this.marginLeft - this.marginRight - 2 * this.border;

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
			
			if (horz)
			{
				fillHeight -= start;
				y += start;
			}
			else
			{
				fillWidth -= start;
				x += start;
			}
		}

		var childCount = model.getChildCount(parent);
		var rows = this.rows;
		var cols = this.columns;
		var cellCount = rows * cols;
		
		//if auto-add without parent-resize, then each cell size in the table depends on how many columns/rows
		if (!this.resizeParent && (this.autoAddCol || this.autoAddRow) && childCount > cellCount)
		{
			var actualChildCount = 0;
			//get actual child count (movable and not ignored)
			for (var i = 0; i < childCount; i++)
			{
				var child = model.getChildAt(parent, i);
				
				if (!this.isVertexIgnored(child) && this.isVertexMovable(child))
				{
					actualChildCount++;
				}
			}
			
			if (actualChildCount > cellCount)
			{
				if (this.autoAddRow)
				{
					rows = Math.ceil(actualChildCount / cols);
				}
				else
				{
					cols = Math.ceil(actualChildCount / rows);
				}
			}
		}
		
		var cellWidth = [], cellHeight = [];
		fillWidth -= this.border * (cols - 1);
		fillHeight -= this.border * (rows - 1);

		//Calc each cell width/height in the table
		if (this.resizeParent && this.autoAddCol && !this.autoAddRow)
		{
			cellWidth = this.colWidths && this.colWidths.split? this.colWidths.split(',') : [(this.colWidths || 100)];
			
			if (this.equalColumns)
			{
				var w = parseFloat(cellWidth[0]);
				
				for (var i = 0; i < cols; i++)
				{
					cellWidth[i] = w;
				}
			}
			else
			{
				for(var i = 0; i < cellWidth.length; i++) 
				{
					cellWidth[i] = parseFloat(cellWidth[i]);
				}
			}
		}
		else
		{
			if (this.equalColumns || this.colPercentages == null)
			{
				var w = fillWidth / cols;
				
				for (var i = 0; i < cols; i++)
				{
					cellWidth.push(w);
				}
			}
			else
			{
				//TODO handle incorrect configurations
				var ratios = this.colPercentages.split(',');
	
				for (var i = 0; i < cols; i++)
				{
					cellWidth.push(fillWidth * parseInt(ratios[i]) / 100);
				}
			}
		}

		if (this.resizeParent && (this.autoAddRow || !this.autoAddCol))
		{
			cellHeight = this.rowHeights && this.rowHeights.split? this.rowHeights.split(',') : [(this.rowHeights || 50)];
			
			if (this.equalRows)
			{
				var h = parseFloat(cellHeight[0]);
				
				for (var i = 0; i < rows; i++)
				{
					cellHeight[i] = h;
				}
			}
			else
			{
				for(var i = 0; i < cellHeight.length; i++) 
				{
					cellHeight[i] = parseFloat(cellHeight[i]);
				}
			}
		}
		else
		{
			if (this.equalRows || this.rowPercentages == null)
			{
				var h = fillHeight / rows;
				
				for (var i = 0; i < rows; i++)
				{
					cellHeight.push(h);
				}
			}
			else
			{
				//TODO handle incorrect configurations
				var ratios = this.rowPercentages.split(',');
	
				for (var i = 0; i < rows; i++)
				{
					cellHeight.push(fillHeight * parseInt(ratios[i]) / 100);
				}
			}
		}
		
		model.beginUpdate();
		try
		{
			var rowIndex = 0, colIndex = 0;
			var tableWidth = 0, tableHeight = 0; 
			//save the initial value of x
			var x0 = x, y0 = y;

			//children are filled row by row
			for (var i = 0; i < childCount; i++)
			{
				var child = model.getChildAt(parent, i);
				
				if (!this.isVertexIgnored(child) && this.isVertexMovable(child))
				{
					var geo = model.getGeometry(child);
					
					if (geo != null)
					{
						geo = geo.clone();
						
						geo.x = x;
						geo.y = y;
						
						if (this.fill)
						{
							geo.height = cellHeight[rowIndex];
							geo.width = cellWidth[colIndex];									
						}
						
						this.setChildGeometry(child, geo);
						
						if (this.autoAddRow || !this.autoAddCol)
						{
							if (colIndex + 1 == cols)
							{
								tableWidth = x + cellWidth[colIndex];
								x = x0;
								y += cellHeight[rowIndex] + this.border;
								colIndex = 0;
								rowIndex = (rowIndex + 1) % rows;
							}
							else
							{
								x += cellWidth[colIndex] + this.border;
								colIndex++;
							}
						}
						else
						{
							if (rowIndex + 1 == rows)
							{
								tableHeight = y + cellHeight[rowIndex];
								y = y0;
								x += cellWidth[colIndex] + this.border;
								rowIndex = 0;
								colIndex = (colIndex + 1) % cols;
							}
							else
							{
								y += cellHeight[rowIndex] + this.border;
								rowIndex++;
							}
						}
					}
				}
			}

			if (this.resizeParent && !this.graph.isCellCollapsed(parent))
			{
				var pgeo2 = pgeo.clone();

				pgeo2.width = (tableWidth? tableWidth + this.border : (rowIndex > 0? x + cellWidth[colIndex] + this.border : x)) + this.marginRight;
				pgeo2.height = (tableHeight? tableHeight + this.border: (colIndex > 0? y + cellHeight[rowIndex] + this.border : y)) + this.marginBottom;

				if (pgeo.x != pgeo2.x || pgeo.y != pgeo2.y ||
					pgeo.width != pgeo2.width || pgeo.height != pgeo2.height)
				{
					model.setGeometry(parent, pgeo2);
				}
			}
		}
		finally
		{
			model.endUpdate();
		}
	}
};