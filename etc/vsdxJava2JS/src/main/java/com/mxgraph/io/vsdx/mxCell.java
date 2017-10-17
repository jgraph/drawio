/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import java.io.Serializable;
import java.util.List;

import org.w3c.dom.Element;
import org.w3c.dom.Node;

/**
 * Cells are the elements of the graph model. They represent the state
 * of the groups, vertices and edges in a graph.
 *
 * <h4>Edge Labels</h4>
 * 
 * Using the x- and y-coordinates of a cell's geometry it is
 * possible to position the label on edges on a specific location
 * on the actual edge shape as it appears on the screen. The
 * x-coordinate of an edge's geometry is used to describe the
 * distance from the center of the edge from -1 to 1 with 0
 * being the center of the edge and the default value. The
 * y-coordinate of an edge's geometry is used to describe
 * the absolute, orthogonal distance in pixels from that
 * point. In addition, the mxGeometry.offset is used
 * as a absolute offset vector from the resulting point.
 * 
 * The width and height of an edge geometry are ignored.
 * 
 * To add more than one edge label, add a child vertex with
 * a relative geometry. The x- and y-coordinates of that
 * geometry will have the same semantiv as the above for
 * edge labels.
 */
public class mxCell implements Cloneable, Serializable
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 910211337632342672L;

	/**
	 * Holds the Id. Default is null.
	 */
	protected String id;

	/**
	 * Holds the user object. Default is null.
	 */
	protected Object value;

	/**
	 * Holds the geometry. Default is null.
	 */
	protected mxGeometry geometry;

	/**
	 * Holds the style as a string of the form
	 * stylename[;key=value]. Default is null.
	 */
	protected String style;

	/**
	 * Specifies whether the cell is a vertex or edge and whether it is
	 * connectable, visible and collapsed. Default values are false, false,
	 * true, true and false respectively.
	 */
	protected boolean vertex = false, edge = false, connectable = true,
			visible = true, collapsed = false;


	/**
	 * Holds the child cells and connected edges.
	 */
	protected List<Object> children, edges;

	/**
	 * Constructs a new cell with an empty user object.
	 */
	public mxCell()
	{
		this(null);
	}

	/**
	 * Constructs a new cell for the given user object.
	 * 
	 * @param value
	 *   Object that represents the value of the cell.
	 */
	public mxCell(Object value)
	{
		this(value, null, null);
	}

	/**
	 * Constructs a new cell for the given parameters.
	 * 
	 * @param value Object that represents the value of the cell.
	 * @param geometry Specifies the geometry of the cell.
	 * @param style Specifies the style as a formatted string.
	 */
	public mxCell(Object value, mxGeometry geometry, String style)
	{
		setValue(value);
		setGeometry(geometry);
		setStyle(style);
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#getId()
	 */
	public String getId()
	{
		return id;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#setId(String)
	 */
	public void setId(String id)
	{
		this.id = id;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#getValue()
	 */
	public Object getValue()
	{
		return value;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#setValue(Object)
	 */
	public void setValue(Object value)
	{
		this.value = value;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#getGeometry()
	 */
	public mxGeometry getGeometry()
	{
		return geometry;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#setGeometry(com.mxgraph.model.mxGeometry)
	 */
	public void setGeometry(mxGeometry geometry)
	{
		this.geometry = geometry;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#getStyle()
	 */
	public String getStyle()
	{
		return style;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#setStyle(String)
	 */
	public void setStyle(String style)
	{
		this.style = style;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#isVertex()
	 */
	public boolean isVertex()
	{
		return vertex;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#setVertex(boolean)
	 */
	public void setVertex(boolean vertex)
	{
		this.vertex = vertex;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#isEdge()
	 */
	public boolean isEdge()
	{
		return edge;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#setEdge(boolean)
	 */
	public void setEdge(boolean edge)
	{
		this.edge = edge;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#isConnectable()
	 */
	public boolean isConnectable()
	{
		return connectable;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#setConnectable(boolean)
	 */
	public void setConnectable(boolean connectable)
	{
		this.connectable = connectable;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#isVisible()
	 */
	public boolean isVisible()
	{
		return visible;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#setVisible(boolean)
	 */
	public void setVisible(boolean visible)
	{
		this.visible = visible;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#isCollapsed()
	 */
	public boolean isCollapsed()
	{
		return collapsed;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#setCollapsed(boolean)
	 */
	public void setCollapsed(boolean collapsed)
	{
		this.collapsed = collapsed;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#getChildCount()
	 */
	public int getChildCount()
	{
		return (children != null) ? children.size() : 0;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxICell#getEdgeCount()
	 */
	public int getEdgeCount()
	{
		return (edges != null) ? edges.size() : 0;
	}

	/**
	 * Returns the specified attribute from the user object if it is an XML
	 * node.
	 * 
	 * @param name Name of the attribute whose value should be returned.
	 * @return Returns the value of the given attribute or null.
	 */
	public String getAttribute(String name)
	{
		return getAttribute(name, null);
	}

	/**
	 * Returns the specified attribute from the user object if it is an XML
	 * node.
	 * 
	 * @param name Name of the attribute whose value should be returned.
	 * @param defaultValue Default value to use if the attribute has no value.
	 * @return Returns the value of the given attribute or defaultValue.
	 */
	public String getAttribute(String name, String defaultValue)
	{
		Object userObject = getValue();
		String val = null;

		if (userObject instanceof Element)
		{
			Element element = (Element) userObject;
			val = element.getAttribute(name);
		}

		if (val == null)
		{
			val = defaultValue;
		}

		return val;
	}

	/**
	 * Sets the specified attribute on the user object if it is an XML node.
	 * 
	 * @param name Name of the attribute whose value should be set.
	 * @param value New value of the attribute.
	 */
	public void setAttribute(String name, String value)
	{
		Object userObject = getValue();

		if (userObject instanceof Element)
		{
			Element element = (Element) userObject;
			element.setAttribute(name, value);
		}
	}

	/**
	 * Returns a clone of the user object. This implementation clones any XML
	 * nodes or otherwise returns the same user object instance.
	 */
	protected Object cloneValue()
	{
		Object value = getValue();

		if (value instanceof Node)
		{
			value = ((Node) value).cloneNode(true);
		}

		return value;
	}

	public mxCell getChildAt(int i) {
		// TODO Auto-generated method stub
		return null;
	}

}
