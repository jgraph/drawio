/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxStylesheet
 *
 * Defines the appearance of the cells in a graph. See <putCellStyle> for an
 * example of creating a new cell style. It is recommended to use objects, not
 * arrays for holding cell styles. Existing styles can be cloned using
 * <mxUtils.clone> and turned into a string for debugging using
 * <mxUtils.toString>.
 *
 * Default Styles:
 *
 * The stylesheet contains two built-in styles, which are used if no style is
 * defined for a cell:
 *
 *   defaultVertex - Default style for vertices
 *   defaultEdge - Default style for edges
 *
 * Example:
 *
 * (code)
 * var vertexStyle = stylesheet.getDefaultVertexStyle();
 * vertexStyle[mxConstants.STYLE_ROUNDED] = true;
 * var edgeStyle = stylesheet.getDefaultEdgeStyle();
 * edgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
 * (end)
 *
 * Modifies the built-in default styles.
 *
 * To avoid the default style for a cell, add a leading semicolon
 * to the style definition, eg.
 *
 * (code)
 * ;shadow=1
 * (end)
 *
 * Removing keys:
 *
 * For removing a key in a cell style of the form [stylename;|key=value;] the
 * special value none can be used, eg. highlight;fillColor=none
 *
 * See also the helper methods in mxUtils to modify strings of this format,
 * namely <mxUtils.setStyle>, <mxUtils.indexOfStylename>,
 * <mxUtils.addStylename>, <mxUtils.removeStylename>,
 * <mxUtils.removeAllStylenames> and <mxUtils.setStyleFlag>.
 *
 * Constructor: mxStylesheet
 *
 * Constructs a new stylesheet and assigns default styles.
 */
function mxStylesheet()
{
	this.styles = new Object();

	this.putDefaultVertexStyle(this.createDefaultVertexStyle());
	this.putDefaultEdgeStyle(this.createDefaultEdgeStyle());
};

/**
 * Function: styles
 *
 * Maps from names to cell styles. Each cell style is a map of key,
 * value pairs.
 */
mxStylesheet.prototype.styles;

/**
 * Function: createDefaultVertexStyle
 *
 * Creates and returns the default vertex style.
 */
mxStylesheet.prototype.createDefaultVertexStyle = function()
{
	var style = new Object();

	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
	style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
	style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
	style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	style[mxConstants.STYLE_FILLCOLOR] = '#C3D9FF';
	style[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
	style[mxConstants.STYLE_FONTCOLOR] = '#774400';

	return style;
};

/**
 * Function: createDefaultEdgeStyle
 *
 * Creates and returns the default edge style.
 */
mxStylesheet.prototype.createDefaultEdgeStyle = function()
{
	var style = new Object();

	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
	style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
	style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
	style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	style[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
	style[mxConstants.STYLE_FONTCOLOR] = '#446299';

	return style;
};

/**
 * Function: putDefaultVertexStyle
 *
 * Sets the default style for vertices using defaultVertex as the
 * stylename.
 *
 * Parameters:
 * style - Key, value pairs that define the style.
 */
mxStylesheet.prototype.putDefaultVertexStyle = function(style)
{
	this.putCellStyle('defaultVertex', style);
};

/**
 * Function: putDefaultEdgeStyle
 *
 * Sets the default style for edges using defaultEdge as the stylename.
 */
mxStylesheet.prototype.putDefaultEdgeStyle = function(style)
{
	this.putCellStyle('defaultEdge', style);
};

/**
 * Function: getDefaultVertexStyle
 *
 * Returns the default style for vertices.
 */
mxStylesheet.prototype.getDefaultVertexStyle = function()
{
	return this.styles['defaultVertex'];
};

/**
 * Function: getDefaultEdgeStyle
 *
 * Sets the default style for edges.
 */
mxStylesheet.prototype.getDefaultEdgeStyle = function()
{
	return this.styles['defaultEdge'];
};

/**
 * Function: putCellStyle
 *
 * Stores the given map of key, value pairs under the given name in
 * <styles>.
 *
 * Example:
 *
 * The following example adds a new style called 'rounded' into an
 * existing stylesheet:
 *
 * (code)
 * var style = new Object();
 * style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
 * style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
 * style[mxConstants.STYLE_ROUNDED] = true;
 * graph.getStylesheet().putCellStyle('rounded', style);
 * (end)
 *
 * In the above example, the new style is an object. The possible keys of
 * the object are all the constants in <mxConstants> that start with STYLE
 * and the values are either JavaScript objects, such as
 * <mxPerimeter.RightAngleRectanglePerimeter> (which is in fact a function)
 * or expressions, such as true. Note that not all keys will be
 * interpreted by all shapes (eg. the line shape ignores the fill color).
 * The final call to this method associates the style with a name in the
 * stylesheet. The style is used in a cell with the following code:
 *
 * (code)
 * model.setStyle(cell, 'rounded');
 * (end)
 *
 * Parameters:
 *
 * name - Name for the style to be stored.
 * style - Key, value pairs that define the style.
 */
mxStylesheet.prototype.putCellStyle = function(name, style)
{
	this.styles[name] = style;
};

/**
 * Function: getCellStyle
 *
 * Returns the cell style for the specified stylename or the given
 * defaultStyle if no style can be found for the given stylename.
 *
 * Parameters:
 *
 * name - String of the form [(stylename|key=value);] that represents the style.
 * defaultStyle - Default style to be returned if no style can be found.
 * resolve - Specifies if the value "none" should be removed. Default is true.
 */
mxStylesheet.prototype.getCellStyle = function(name, defaultStyle, resolve)
{
	resolve = (resolve != null) ? resolve : true;
	var style = defaultStyle;

	if (name != null && name.length > 0)
	{
		var pairs = name.split(';');

		if (style != null && name.charAt(0) != ';')
		{
			style = mxUtils.clone(style);
		}
		else
		{
			style = new Object();
		}

		// Parses each key, value pair into the existing style
	 	for (var i = 0; i < pairs.length; i++)
	 	{
	 		var tmp = pairs[i];
	 		var pos = tmp.indexOf('=');

	 		if (pos >= 0)
	 		{
		 		var key = tmp.substring(0, pos);
		 		var value = tmp.substring(pos + 1);

		 		if (value == mxConstants.NONE && resolve)
		 		{
	 				delete style[key];
		 		}
		 		else if (mxUtils.isNumeric(value))
		 		{
		 			style[key] = parseFloat(value);
		 		}
		 		else
		 		{
			 		style[key] = value;
		 		}
			}
	 		else
	 		{
	 			// Merges the entries from a named style
				var tmpStyle = this.styles[tmp];

				if (tmpStyle != null)
				{
					for (var key in tmpStyle)
					{
						style[key] = tmpStyle[key];
					}
				}
	 		}
		}
	}

	return style;
};
