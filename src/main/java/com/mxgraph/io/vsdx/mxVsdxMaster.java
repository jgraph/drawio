/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mxgraph.io.vsdx;

import java.util.HashMap;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.mxgraph.io.mxVsdxCodec;

/**
 * This class is a wrapper for a Master element.<br/>
 * Contains a map with the shapes contained in the Master element
 * and allows access these by ID.
 */
public class mxVsdxMaster
{
	protected Element master;
	
	/**
	 * Unique ID of the element within its parent element
	 */
	protected String Id = null;
	
	protected Shape masterShape = null;
	
	/*
	 * Map that contains the shapes in Master element wrapped for instances of mxDelegateShape.
	 * The key is the shape's ID.
	 */
	protected HashMap<String, Shape> childShapes = new HashMap<String, Shape>();

	/**
	 * Create a new instance of mxMasterElement and retrieves all the shapes contained
	 * in the Master element.
	 * @param m Master Element to be wrapped.
	 */
	public mxVsdxMaster(Element m, mxVsdxModel model)
	{
		this.master = m;
		this.Id = m.getAttribute(mxVsdxConstants.ID);
		processMasterShapes(model);
	}

	/**
	 * Retrieves and wraps all the shapes contained in the 'shape' param.<br/>
	 * This method is recursive, it retrieves the subshapes of the shapes too.
	 * @param shape Shape from which the subshapes are retrieved.
	 * @return Map with the shapes wrapped in instances of mxMasterShape.
	 */
	protected void processMasterShapes(mxVsdxModel model)
	{
		Node child = this.master.getFirstChild();
		
		while (child != null)
		{
			if (child instanceof Element && ((Element)child).getNodeName().equals("Rel"))
			{
				Element relElem = model.getRelationship(((Element) child).getAttribute("r:id"), mxVsdxCodec.vsdxPlaceholder + "/masters/" + "_rels/masters.xml.rels");
				String target = relElem.getAttribute("Target");
				String type = relElem.getAttribute("Type");
				Document masterDoc = null;
				
				if (type != null && type.endsWith("master"))
				{
					masterDoc = model.getXmlDoc(mxVsdxCodec.vsdxPlaceholder + "/masters/" + target);
				}

				if (masterDoc != null)
				{
					Node masterChild = masterDoc.getFirstChild();
					
					while (masterChild != null)
					{
						if (masterChild instanceof Element && ((Element)masterChild).getNodeName().equals("MasterContents"))
						{
							processMasterShape((Element)masterChild, model);
							break;
						}
						
						masterChild = masterChild.getNextSibling();
					}
				}
			}
			
			child = child.getNextSibling();
		}
	}

	/**
	 * Retrieves and wraps all the shapes contained in the 'shape' param.<br/>
	 * This method is recursive, it retrieves the subshapes of the shapes too.
	 * @param shape Shape from which the subshapes are retrieved.
	 * @return Map with the shapes wrapped in instances of mxMasterShape.
	 */
	protected void processMasterShape(Element shapeElem, mxVsdxModel model)
	{
		Node shapeChild = shapeElem.getFirstChild();
		
		while (shapeChild != null)
		{
			if (shapeChild instanceof Element && ((Element)shapeChild).getNodeName().equals("Shapes"))
			{
				Node shapesChild = shapeChild.getFirstChild();

				while (shapesChild != null)
				{
					if (shapesChild instanceof Element && ((Element)shapesChild).getNodeName().equals("Shape"))
					{
						Element shape = (Element)shapesChild;
						String shapeId = shape.getAttribute("ID");
						Shape masterShape = new Shape(shape, model);
						this.masterShape = (this.masterShape == null) ? masterShape : this.masterShape;
						childShapes.put(shapeId, masterShape);
						processMasterShape(shape, model);
					}
					
					shapesChild = shapesChild.getNextSibling();
				}
				
				break;
			}
			
			shapeChild = shapeChild.getNextSibling();
		}
	}

	/**
	 * Returns the first shape in the Master
	 * @return First shape in the Master wrapped in a instance of mxMasterShape
	 */
	public Shape getMasterShape()
	{
		return this.masterShape;
	}

	/**
	 * Returns the shape in the master element with ID = 'id'.
	 * @param id Shape's ID
	 * @return The shape in the master element with ID = 'id' wrapped in a instance of mxMasterShape
	 */
	public Shape getSubShape(String id)
	{
		return childShapes.get(id);
	}

	/**
	 * Returns the NameU attribute.
	 * @return Value of the NameU attribute.
	 */
	public String getNameU()
	{
		return master.getAttribute("NameU");
	}

	/**
	 * Returns the NameU attribute.
	 * @return Value of the NameU attribute.
	 */
	public String getName()
	{
		return master.getAttribute("Name");
	}

	/**
	 * Returns the UniqueID attribute.
	 * @return Value of the UniqueID attribute.
	 */
	public String getUniqueID()
	{
		String uniqueID = "";
		
		if (master.hasAttribute("UniqueID"))
		{
			uniqueID = master.getAttribute("UniqueID");
		}
		
		return uniqueID;
	}

	public String getId()
	{
		return this.Id;
	}
	
	public Element getMasterElement()
	{
		return master;
	}
}
