package com.mxgraph.io.vsdx;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.mxgraph.io.mxVsdxCodec;
import com.mxgraph.util.mxPoint;

public class mxVsdxPage {

	/**
	 * Unique ID of the element within its parent element
	 */
	protected Integer Id = null;
	
	/**
	 * Name of the page taken from the "name" attribute of the page element
	 */
	protected String pageName = null;
	
	protected boolean isBackground = false;
	
	protected Integer backPageId = null;
	
	protected mxVsdxPage backPage = null;
	
	protected Element pageElement = null;
	
	protected Element pageSheet = null;
	
	protected mxVsdxModel model = null;
	
	protected Map<Integer, VsdxShape> shapes = new LinkedHashMap<Integer, VsdxShape>();

	protected Map<Integer, mxVsdxConnect> connects = new LinkedHashMap<Integer, mxVsdxConnect>();

	// cell in the PageSheet
	protected Map<String, Element> cellElements = new HashMap<String, Element>();

	public mxVsdxPage(Element pageElem, mxVsdxModel model) {
		this.model = model;
		this.pageElement = pageElem;

		String backGround = pageElem.getAttribute(mxVsdxConstants.BACKGROUND);
		this.isBackground = (backGround != null && backGround.equals(mxVsdxConstants.TRUE)) ? true : false;
		String back = pageElem.getAttribute(mxVsdxConstants.BACK_PAGE);
		
		if (!isBackground && back != null && back.length() > 0)
		{
			this.backPageId = Integer.valueOf(back);
		}

		this.Id = Integer.valueOf(pageElem.getAttribute(mxVsdxConstants.ID));
		this.pageName = pageElem.getAttribute(mxVsdxConstants.NAME);
		
		parseNodes(pageElem, model, "pages");
		
		Node child = pageElem.getFirstChild();
		
		while (child != null)
		{
			if (child instanceof Element && ((Element)child).getTagName().equals("PageSheet"))
			{
				Node childNode = child.getFirstChild();
				
				while (childNode != null)
				{
					if (childNode instanceof Element && ((Element)childNode).getTagName().equals("Cell"))
					{
						Element childElem = (Element) childNode;
						String n = childElem.getAttribute("N");
						cellElements.put(n, childElem);
					}
					
					childNode = childNode.getNextSibling();
				}
				
				break;
			}
			
			child = child.getNextSibling();
		}
	}

	/**
	 * Parses the child nodes of the given element
	 * @param pageElem the parent whose children to parse
	 * @param model the model of the vsdx file
	 * @param pageName page information is split across pages.xml and pageX.xml where X is any number. We have to know which we're currently parsing to use the correct relationships file.
	 */
	protected void parseNodes(Node pageElem, mxVsdxModel model, String pageName)
	{
		Node pageChild = pageElem.getFirstChild();
		
		while (pageChild != null)
		{
			if (pageChild instanceof Element)
			{
				Element pageChildElem = (Element) pageChild;
				String childName = pageChildElem.getNodeName();
				
				if (childName.equals("Rel"))
				{
					resolveRel(pageChildElem, model, pageName);
				}
				else if (childName.equals("Shapes"))
				{
					this.shapes = parseShapes(pageChildElem, null, false);
				}
				else if (childName.equals("Connects"))
				{
					NodeList connectList = pageChildElem.getElementsByTagName(mxVsdxConstants.CONNECT);
					Node connectNode = (connectList != null && connectList.getLength() > 0) ? connectList.item(0) : null;
					//mxVdxConnect currentConnect = null;
		
					while (connectNode != null)
					{
						if (connectNode instanceof Element)
						{
							Element connectElem = (Element) connectNode;
							mxVsdxConnect connect = new mxVsdxConnect(connectElem);
							Integer fromSheet = connect.getFromSheet();
							mxVsdxConnect previousConnect = (fromSheet != null && fromSheet > -1) ? connects.get(fromSheet) : null;
							
							if (previousConnect != null)
							{
								previousConnect.addConnect(connectElem);
							}
							else
							{
								connects.put(connect.getFromSheet(), connect);
							}
						}
						
						connectNode = connectNode.getNextSibling();	
					}
				}
				else if (childName.equals("PageSheet"))
				{
					this.pageSheet = pageChildElem;
				}
			}
			
			pageChild = pageChild.getNextSibling();
		}
	}

	/**
	 * 
	 * @param relNode
	 * @param model
	 * @param pageName
	 */
	protected void resolveRel(Element relNode, mxVsdxModel model, String pageName)
	{
		Element relElem = model.getRelationship(relNode.getAttribute("r:id"), mxVsdxCodec.vsdxPlaceholder + "/pages/" + "_rels/" + pageName + ".xml.rels");
		
		String target = relElem.getAttribute("Target");
		String type = relElem.getAttribute("Type");
		
		if (String.valueOf(type).endsWith("page"))
		{
			Document pageDoc = null;
			
			if (type != null && type.endsWith("page"))
			{
				pageDoc = model.getXmlDoc(mxVsdxCodec.vsdxPlaceholder + "/pages/" + target);
			}
			
			if (pageDoc != null)
			{
				Node child = pageDoc.getFirstChild();
				
				while (child != null)
				{
					if (child instanceof Element && ((Element)child).getTagName().equals("PageContents"))
					{
						int index = target.indexOf('.');
						
						if (index != -1)
						{
							parseNodes(child, model, target.substring(0, index));
						}

						break;
					}
					
					child = child.getNextSibling();
				}
			}
		}
	}
	
	public Map<Integer, VsdxShape> parseShapes(Element shapesElement, mxVsdxMaster master, boolean recurse)
	{
		Map<Integer, VsdxShape> shapes = new LinkedHashMap<Integer, VsdxShape>();
		NodeList shapeList = shapesElement.getElementsByTagName(mxVsdxConstants.SHAPE);

		Node shapeNode = (shapeList != null && shapeList.getLength() > 0) ? shapeList.item(0) : null;

		while (shapeNode != null)
		{
			if (shapeNode instanceof Element)
			{
				Element shapeElem = (Element) shapeNode;
				mxVsdxMaster masterTmp = master;

				// Work out node type
				if (masterTmp == null)
				{
					//If the shape has the Master attribute the master shape is the first
					//shape of the master element.
					String masterId = shapeElem.getAttribute(mxVsdxConstants.MASTER);
					
					if (masterId != null && !masterId.equals(""))
					{
						masterTmp = model.getMaster(masterId);
					}
					else
					{
						masterId = shapeElem.getAttribute(mxVsdxConstants.MASTER_SHAPE);
	
						if (masterId != null && !masterId.equals(""))
						{
							masterTmp = model.getMaster(masterId);
						}					
					}
				}
				
				boolean isEdge = isEdge(shapeElem);
				//String type = mxVdxShape.getType(shapeElem);
				
				// If the master of the shape has an xform1D, it's an edge
				if (!isEdge && masterTmp != null)
				{
					isEdge = isEdge(masterTmp.getMasterElement());
				}
				
				VsdxShape shape = this.createCell(shapeElem, !isEdge, masterTmp);
				
				shapes.put(shape.getId(), shape);
			}

			shapeNode = shapeNode.getNextSibling();
		}
		
		return shapes;
	}

	protected VsdxShape createCell(Element shapeElem, boolean vertex, mxVsdxMaster masterTmp)
	{
		return new VsdxShape(this, shapeElem, vertex, this.model.getMasterShapes(), masterTmp, this.model);
	}

	protected boolean isEdge(Element shape)
	{
		if (shape != null)
		{
			NodeList children = shape.getChildNodes();
			
			if (children != null)
			{
				Node childNode = children.item(0);
				
				while (childNode != null)
				{
					if (childNode instanceof Element)
					{
						Element childElem = (Element) childNode;

						if (childElem.getNodeName().equals("Cell"))
						{
							String n = childElem.getAttribute("N");
							
							if (n.equals("BeginX") || n.equals("BeginY") || n.equals("EndY") || n.equals("EndX"))
							{
								return true;
							}
						}
					}
					
					childNode = childNode.getNextSibling();
				}
			}
		}

		return false;
	}

	/**
	 * Returns the width and height of a Page expressed as an mxPoint.
	 * @return mxPoint that represents the dimensions of the shape
	 */
	public mxPoint getPageDimensions()
	{
		double pageH = 0;
		double pageW = 0;

		Element height = cellElements.get("PageHeight");
		Element width = cellElements.get("PageWidth");
		
		if (height != null)
		{
			pageH = Double.valueOf(height.getAttribute("V")) * mxVsdxUtils.conversionFactor;
			pageH = Math.round(pageH * 100.0) / 100.0;
		}
		
		if (width != null)
		{
			pageW = Double.valueOf(width.getAttribute("V")) * mxVsdxUtils.conversionFactor;
			pageW = Math.round(pageW * 100.0) / 100.0;
		}

		return new mxPoint(pageW, pageH);
	}
	
	/**
	 * Returns the ID of the page
	 * @return the ID of the page
	 */
	public Integer getId()
	{
		return this.Id;
	}
	public String getPageName()
	{
		return this.pageName;
	}
	
	public Map<Integer, VsdxShape> getShapes()
	{
		return this.shapes;
	}
	
	public Map<Integer, mxVsdxConnect> getConnects()
	{
		return this.connects;
	}
	
	public boolean isBackground()
	{
		return this.isBackground;
	}
	
	/**
	 * Returns the background page ID, if any
	 * @return the ID of any background page or null for no background page
	 */
	public Integer getBackPageId()
	{
		return this.backPageId;
	}
	
	public void setBackPage(mxVsdxPage page)
	{
		this.backPage = page;
	}
	
	public mxVsdxPage getBackPage()
	{
		return this.backPage;
	}
}
