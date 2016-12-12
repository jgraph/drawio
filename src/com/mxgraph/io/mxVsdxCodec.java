/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.StringUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.ShapePageId;
import com.mxgraph.io.vsdx.VsdxShape;
import com.mxgraph.io.vsdx.mxPathDebug;
import com.mxgraph.io.vsdx.mxVsdxConnect;
import com.mxgraph.io.vsdx.mxVsdxConstants;
import com.mxgraph.io.vsdx.mxVsdxMaster;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.io.vsdx.mxVsdxModel;
import com.mxgraph.io.vsdx.mxVsdxPage;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGeometry;
import com.mxgraph.online.Utils;
import com.mxgraph.online.mxBase64;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxXmlUtils;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxConnectionConstraint;
import com.mxgraph.view.mxGraph;
import com.mxgraph.view.mxGraphHeadless;

/**
 * Parses a .vsdx XML diagram file and imports it in the given graph.<br/>
 */
public class mxVsdxCodec
{
	/**
	 * Stores the vertexes imported.
	 */
	protected HashMap<ShapePageId, mxCell> vertexMap = new HashMap<ShapePageId, mxCell>();

	/**
	 * Stores the shapes that represent Edges.
	 */
	protected HashMap<ShapePageId, VsdxShape> edgeShapeMap = new HashMap<ShapePageId, VsdxShape>();

	/**
	 * Stores the shapes that represent Vertexes.
	 */
	protected HashMap<ShapePageId, VsdxShape> vertexShapeMap = new HashMap<ShapePageId, VsdxShape>();

	/**
	 * Stores the parents of the shapes imported.
	 */
	protected HashMap<ShapePageId, Object> parentsMap = new HashMap<ShapePageId, Object>();

	/**
	 * Set to true if you want to display spline debug data
	 */
	protected boolean debugPaths = false;
	
	/**
	 * Do not remove, ask David
	 */
	public static String vsdxPlaceholder = new String(Base64.decodeBase64("dmlzaW8="));
	
	public mxVsdxCodec()
	{
	}

	/**
	 * Calculate the absolute coordinates of a cell's point.
	 * @param cellParent Cell that contains the point.
	 * @param graph Graph where the parsed graph is included.
	 * @param point Point to which coordinates are calculated.
	 * @return The point in absolute coordinates.
	 */
	private static mxPoint calculateAbsolutePoint(Object cellParent,
			mxGraph graph, mxPoint point)
	{
		if (cellParent != null)
		{
			mxCellState state = graph.getView().getState(cellParent);

			if (state != null)
			{
				point.setX(point.getX() + state.getX());
				point.setY(point.getY() + state.getY());
			}
		}

		return point;
	}

	/**
	 * Parses the input VSDX format and uses the information to populate 
	 * the specified graph.
	 * @param docs All XML documents contained in the VSDX source file
	 * @throws IOException 
	 * @throws ParserConfigurationException 
	 * @throws SAXException 
	 * @throws TransformerException 
	 */
	public String decodeVsdx(byte[] data, String charset)
			throws IOException, ParserConfigurationException, SAXException,
			TransformerException
	{
		ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(data));
		ZipEntry ze = null;
		Map<String, Document> docData = new HashMap<String, Document>();
		Map<String, String> mediaData = new HashMap<String, String>();

		while ((ze = zis.getNextEntry()) != null)
		{
			String filename = ze.getName();

			if (!ze.isDirectory())
			{
				ByteArrayOutputStream out = new ByteArrayOutputStream();
				Utils.copy(zis, out);
				out.close();

				if (filename.toLowerCase().endsWith(".xml") | filename
							.toLowerCase().endsWith(".xml.rels"))
				{
					Document doc = mxXmlUtils.parseXml(out.toString(charset));
					// Hack to be able to find the filename from an element in the XML
					doc.setDocumentURI(filename);
					docData.put(filename, doc);
				}
				else if (filename.toLowerCase().startsWith(mxVsdxCodec.vsdxPlaceholder + "/media"))
				{
					mediaData.put(filename, StringUtils.newStringUtf8(Base64.encodeBase64(out.toByteArray(), false)));
				}
			}
		}

		zis.close();

		String path = mxVsdxCodec.vsdxPlaceholder + "/document.xml";
		Document rootDoc = docData.get(path);
		Node rootChild = rootDoc.getFirstChild();

		while (rootChild != null && !(rootChild instanceof Element))
		{
			rootChild.getNextSibling();
		}

		if (rootChild != null && rootChild instanceof Element)
		{
			importNodes(rootDoc, (Element) rootChild, path, docData);
		}
		else
		{
			// TODO log error
			return null;
		}

		mxVsdxModel vsdxModel = new mxVsdxModel(rootDoc, docData, mediaData);

		//Imports each page of the document.
		Map<Integer, mxVsdxPage> pages = vsdxModel.getPages();

		StringBuilder xmlBuilder = new StringBuilder("<?xml version=\"1.0\" encoding=\"UTF-8\"?><mxfile>");

		for (Map.Entry<Integer, mxVsdxPage> entry : pages.entrySet())
		{
			mxVsdxPage page = entry.getValue();
			
			if (!page.isBackground())
			{
				mxGraph graph = new mxGraphHeadless();
				graph.setConstrainChildren(false);
				graph.setHtmlLabels(true);
	
				graph.getModel().beginUpdate();
				importPage(page, graph, graph.getDefaultParent());
				
				mxVsdxPage backPage = page.getBackPage();
				
				if (backPage != null)
				{
					graph.getModel().setValue(graph.getDefaultParent(), page.getPageName());
					Object backCell = new mxCell(backPage.getPageName());
					graph.addCell(backCell, graph.getModel().getRoot(), 0, null, null);
					importPage(backPage, graph, graph.getDefaultParent());
				}
				
				graph.getModel().endUpdate();

				mxCodec codec = new mxCodec();
				Node node = codec.encode(graph.getModel());
				((Element) node).setAttribute("style", "default-style2");
				xmlBuilder.append("<diagram name=\"" + StringEscapeUtils.escapeHtml4(page.getPageName()) + "\">");
				String modelString = mxXmlUtils.getXml(node);
				String modelAscii = Utils.encodeURIComponent(modelString, Utils.CHARSET_FOR_URL_ENCODING);
				byte[] modelBytes= Utils.deflate(modelAscii);
				String output = mxBase64.encodeToString(modelBytes, false);
				
				xmlBuilder.append(output);
				xmlBuilder.append("</diagram>");
			}
		}

		xmlBuilder.append("</mxfile>");
		
		return xmlBuilder.toString();
	}

	/**
	 * 
	 * @param rootDoc
	 * @param currentNode
	 * @param path
	 * @param docData
	 */
	private void importNodes(Document rootDoc, Element currentNode,
			String path, Map<String, Document> docData)
	{
		int lastSlash = path.lastIndexOf("/");

		String dir = path;
		String fileName = path;

		if (lastSlash != -1)
		{
			dir = path.substring(0, lastSlash);
			fileName = path.substring(lastSlash + 1, path.length());
		}
		else
		{
			// Can't handle this case
			return;
		}

		String relsPath = dir + "/_rels/" + fileName + ".rels";
		Document relsDoc = docData.get(relsPath);

		if (relsDoc == null)
		{
			// Valid to not have a rels for an XML file
			return;
		}

		NodeList rels = relsDoc.getElementsByTagName("Relationship");
		Map<String, String> relMap = new HashMap<String, String>();

		for (int i = 0; i < rels.getLength(); i++)
		{
			Element currElem = (Element) rels.item(i);
			String id = currElem.getAttribute("Id");
			String target = currElem.getAttribute("Target");
			relMap.put(id, target);
		}

		NodeList relList = currentNode.getElementsByTagName("Rel");

		for (int i = 0; i < relList.getLength(); i++)
		{
			Element rel = (Element) relList.item(i);
			String pathSuffix = relMap.get(rel.getAttribute("r:id"));
			String target = dir + "/" + pathSuffix;

			if (target != null)
			{
				Document childDoc = docData.get(target);

				if (childDoc != null)
				{
					Node parent = rel.getParentNode();
					Node rootChild = childDoc.getFirstChild();

					while (rootChild != null && !(rootChild instanceof Element))
					{
						rootChild.getNextSibling();
					}

					if (rootChild != null && rootChild instanceof Element)
					{
						Node importNode = rootChild.getFirstChild();

						while (importNode != null)
						{
							if (importNode instanceof Element)
							{
								Node newNode = parent.appendChild(rootDoc
										.importNode(importNode, true));
								String pathTmp = target;
								importNodes(rootDoc, (Element) newNode,
										pathTmp, docData);
							}

							importNode = importNode.getNextSibling();
						}
					}
				}
			}
		}
	}

	/**
	 * Imports a page of the document with the actual pageHeight.<br/>
	 * In .vdx, the Y-coordinate grows upward from the bottom of the page.<br/>
	 * The page height is used for calculating the correct position in mxGraph using
	 * this formula: mxGraph_Y_Coord = PageHeight - VSDX_Y_Coord.
	 * @param page Actual page Element to be imported
	 * @param graph Graph where the parsed graph is included.
	 * @param parent The parent of the elements to be imported.
	 */
	protected double importPage(mxVsdxPage page, mxGraph graph, Object parent)
	{
		Map<Integer, VsdxShape> shapes = page.getShapes();
		Iterator<Map.Entry<Integer, VsdxShape>> entries = shapes.entrySet()
				.iterator();

		double pageHeight = page.getPageDimensions().getY();
		Integer pageId = page.getId();

		while (entries.hasNext())
		{
			Map.Entry<Integer, VsdxShape> entry = entries.next();

			if (this.debugPaths)
			{
				mxPathDebug debug = new mxPathDebug(true, graph,
						entry.getValue(), pageHeight);
				entry.getValue().debug = debug;
			}

			addShape(graph, entry.getValue(), parent,
					pageId, pageHeight);
		}

		Map<Integer, mxVsdxConnect> connects = page.getConnects();
		Iterator<Map.Entry<Integer, mxVsdxConnect>> entries2 = connects
				.entrySet().iterator();

		while (entries2.hasNext())
		{
			Map.Entry<Integer, mxVsdxConnect> entry = entries2.next();
			ShapePageId edgeId = addConnectedEdge(graph, entry.getValue(), pageId, pageHeight);
			
			if (edgeId != null)
			{
				edgeShapeMap.remove(edgeId); // ensure not processed twice
			}
		}

		//Process unconnected edges.
		Iterator<VsdxShape> it = edgeShapeMap.values().iterator();

		while (it.hasNext())
		{
			VsdxShape edgeShape = it.next();
			addUnconnectedEdge(graph, parentsMap.get(new ShapePageId(pageId, edgeShape.getId())), edgeShape, pageHeight);
		}

		return pageHeight;
	}

	/**
	 * Adds a vertex to the graph if 'shape' is a vertex or add the shape to edgeShapeMap if it is an edge.
	 * This method doesn't import sub-shapes of 'shape'.
	 * @param graph Graph where the parsed graph is included.
	 * @param shp Shape to be imported.
	 * @param parentHeight Height of the parent cell.
	 * @return the new vertex added. null if 'shape' is not a vertex.
	 */
	private mxCell addShape(mxGraph graph, VsdxShape shape, Object parent, Integer pageId, double parentHeight)
	{
		shape.parentHeight = parentHeight;

		String type = VsdxShape.getType(shape.getShape());

		//If is a Shape or a Group add the vertex to the graph.
		if (type != null
				&& (type.equals(mxVsdxConstants.TYPE_SHAPE)
						|| type.equals(mxVsdxConstants.TYPE_GROUP) || type
							.equals(mxVsdxConstants.FOREIGN)))
		{
			int id = shape.getId();

			if (shape.isVertex())
			{
				mxCell v1 = null;

				if (shape.isGroup())
				{
					v1 = addGroup(graph, shape, parent, pageId, parentHeight, 0);
				}
				else
				{
					v1 = addVertex(graph, shape, parent, pageId, parentHeight, 0);
				}

				vertexShapeMap.put(new ShapePageId(pageId, id), shape);
				return v1;
			}
			else
			{
				edgeShapeMap.put(new ShapePageId(pageId, id), shape);
				parentsMap.put(new ShapePageId(pageId, id), parent);
			}
		}

		return null;
	}

	/**
	 * Adds a group to the graph.
	 * The sub-shapes of a complex shape are processed like part of the shape.
	 * @param graph Graph where the parsed graph is included.
	 * @param parent Parent cell of the shape.
	 * @param parentHeight Height of the parent cell of the shape.
	 * @return Cell added to the graph.
	 */
	public mxCell addGroup(mxGraph graph, VsdxShape shape, Object parent, Integer pageId, double parentHeight, double parentRotation)
	{
		//Set title
		//		String t = "";
		//		Element shapeElem = shape.getShape();
		//		Element text = (Element) shapeElem.getElementsByTagName("Text").item(0);
		//
		//		if (text != null)
		//		{
		//			t = (text.getTextContent());
		//		}
		String textLabel = "";
		
		if (!shape.isDisplacedLabel() && !shape.isRotatedLabel())
		{
			textLabel = shape.getTextLabel();
		}

		
		//Define dimensions
		mxPoint d = shape.getDimensions();
		mxVsdxMaster master = shape.getMaster();
		Shape masterShape = master == null ? null : master.getMasterShape();
		boolean masterHasGeom = masterShape == null ? false : masterShape.hasGeom();
		boolean hasGeom = shape.hasGeom() || masterHasGeom;

		//Define origin
		mxPoint o = shape.getOriginPoint(parentHeight, true);

		//Define style
		Map<String, String> styleMap = shape.getStyleFromShape(parentRotation);
		
		if (!hasGeom)
		{
			styleMap.put(mxConstants.STYLE_FILLCOLOR, "none");
			styleMap.put(mxConstants.STYLE_STROKECOLOR, "none");
			styleMap.put(mxConstants.STYLE_GRADIENTCOLOR, "none");
		}

		styleMap.put("html", "1");
		styleMap.put(mxConstants.STYLE_WHITE_SPACE, "wrap");
		//TODO need to check if "shape=" should be added before the shape name (for "image", it should be skipped for example)
		String style = mxVsdxUtils.getStyleString(styleMap, "=");

		mxCell group = null;


		if (shape.isDisplacedLabel() || shape.isRotatedLabel())
		{
			group = (mxCell) graph.insertVertex(parent, null, null,
					o.getX(), o.getY(), d.getX(), d.getY(), style);
		}
		else
		{
			group = (mxCell) graph.insertVertex(parent, null, textLabel,
					o.getX(), o.getY(), d.getX(), d.getY(), style);
		}

		// Add children
		Map<Integer, VsdxShape> children = shape.getChildShapes();
		Iterator<Map.Entry<Integer, VsdxShape>> entries = children.entrySet()
				.iterator();
		
		while (entries.hasNext())
		{
			Map.Entry<Integer, VsdxShape> entry = entries.next();
			VsdxShape subShape = entry.getValue();
			Integer Id = subShape.getId();

			if (subShape.isVertex())
			{
				if (this.debugPaths)
				{
					mxPathDebug debug = new mxPathDebug(true, graph, subShape,
							parentHeight);
					subShape.debug = debug;
				}

				String type = VsdxShape.getType(subShape.getShape());

				//If is a Shape or a Group add the vertex to the graph.
				if (type != null
						&& (type.equals(mxVsdxConstants.TYPE_SHAPE)
								|| type.equals(mxVsdxConstants.TYPE_GROUP) || type
									.equals(mxVsdxConstants.FOREIGN)))
				{
					if (subShape.isVertex())
					{
						if (subShape.isGroup())
						{
							addGroup(graph, subShape, group, pageId, d.getY(), shape.getRotation());
						}
						else
						{
							addVertex(graph, subShape, group, pageId, d.getY(), shape.getRotation());

						}
					}
				}

				if (master == null)
				{
					// If the group doesn't have a master, sub vertices are instances of document masters
					vertexShapeMap.put(new ShapePageId(pageId, Id),
							subShape);
				}
			}
			else
			{
				if (master == null)
				{
					// If the group doesn't have a master, sub edges are instances of document masters
					edgeShapeMap.put(new ShapePageId(pageId, Id),
							subShape);
					parentsMap.put(new ShapePageId(pageId, Id), group);
				}
			}
		}
		
		if (shape.isDisplacedLabel() || shape.isRotatedLabel())
		{
			createLabelSubShape(graph, shape, group);
		}

		return group;
	}

	/**
	 * Adds a simple shape to the graph
	 * @param graph Graph where the parsed graph is included.
	 * @param parent Parent cell of the shape.
	 * @param parentHeight Height of the parent cell of the shape.
	 * @return Cell added to the graph.
	 */
	public mxCell addVertex(mxGraph graph, VsdxShape shape, Object parent, Integer pageId, double parentHeight, double parentRotation)
	{
		//Defines Text Label.
		String textLabel = "";

		if (!shape.isRotatedLabel())
		{
			textLabel = shape.getTextLabel();
		}

		mxPoint coordinates = shape.getOriginPoint(parentHeight, true);
		mxPoint dimensions = shape.getDimensions();

		//Defines style
		Map<String, String> styleMap = shape.getStyleFromShape(parentRotation);

		if (textLabel.startsWith("<p>") || textLabel.startsWith("<p ")
				|| textLabel.startsWith("<font"))
		{
			styleMap.put("html", "1");
		}

		boolean geomExists = styleMap.containsKey(mxConstants.STYLE_SHAPE)
				|| styleMap.containsKey("stencil");

		if (!styleMap.containsKey(mxConstants.STYLE_FILLCOLOR) || !geomExists)
		{
			styleMap.put(mxConstants.STYLE_FILLCOLOR, "none");
		}

		if (!geomExists)
		{
			styleMap.put(mxConstants.STYLE_STROKECOLOR, "none");
		}

		if (!styleMap.containsKey(mxConstants.STYLE_GRADIENTCOLOR)
				|| !geomExists)
		{
			styleMap.put(mxConstants.STYLE_GRADIENTCOLOR, "none");
		}

		styleMap.put(mxConstants.STYLE_WHITE_SPACE, "wrap");

		double y = coordinates.getY();

		if (geomExists || !textLabel.isEmpty() || shape.isDisplacedLabel() || shape.isRotatedLabel())
		{
			String style = mxVsdxUtils.getStyleString(styleMap, "=");

			mxCell v1 = null;

			if (shape.isDisplacedLabel() || shape.isRotatedLabel())
			{
				v1 = (mxCell) graph.insertVertex(parent, null, null,
						coordinates.getX(), y, dimensions.getX(),
						dimensions.getY(), style);
			}
			else
			{
				v1 = (mxCell) graph.insertVertex(parent, null, textLabel,
						coordinates.getX(), y, dimensions.getX(),
						dimensions.getY(), style);
			}

			vertexMap.put(new ShapePageId(pageId, shape.getId()), v1);
			shape.setLabelOffset(v1, style);

			if (shape.isDisplacedLabel() || shape.isRotatedLabel())
			{
				createLabelSubShape(graph, shape, v1);
			}

			return v1;
		}

		return null;
	}

	/**
	 * Adds a connected edge to the graph.
	 * These edged are the referenced in one Connect element at least.
	 * @param graph graph Graph where the parsed graph is included.
	 * @param connect Connect Element that references an edge shape and the source vertex.
	 */
	protected ShapePageId addConnectedEdge(mxGraph graph, mxVsdxConnect connect, Integer pageId, double pageHeight)
	{
		Integer fromSheet = connect.getFromSheet();
		ShapePageId edgeId = new ShapePageId(pageId, fromSheet);
		VsdxShape edgeShape = edgeShapeMap.get(edgeId);

		if (edgeShape == null)
		{
			return null;
		}

		Object parent = parentsMap.get(new ShapePageId(pageId,
				edgeShape.getId()));
		double parentHeight = pageHeight;

		if (parent != null)
		{
			mxGeometry parentGeo = graph.getModel().getGeometry(parent);

			if (parentGeo != null)
			{
				parentHeight = parentGeo.getHeight();
			}
		}

		//Get beginXY and endXY coordinates.
		mxPoint beginXY = edgeShape.getStartXY(parentHeight);
		beginXY = calculateAbsolutePoint(parent, graph, beginXY);

		mxPoint fromConstraint = null;
		Integer sourceSheet = connect.getSourceToSheet();

		VsdxShape fromShape = sourceSheet != null ? vertexShapeMap
				.get(new ShapePageId(pageId, sourceSheet)) : null;

		mxCell source = sourceSheet != null ? vertexMap
				.get(new ShapePageId(pageId, sourceSheet)) : null;

		if (fromShape == null || source == null)
		{
			// Source is dangling
			source = (mxCell) graph.insertVertex(parent, null, null,
					beginXY.getX(), beginXY.getY(), 0, 0);
			fromConstraint = new mxPoint(0, 0);
		}
		else
		{
			mxPoint dimensionFrom = fromShape.getDimensions();

			//Get From shape origin and begin/end of edge in absolutes values.
			double height = pageHeight;

			if ((source.getParent() != null)
					&& (source.getParent().getGeometry() != null))
			{
				height = source.getParent().getGeometry().getHeight();
			}

			mxPoint originFrom = fromShape.getOriginPoint(height, false);
			Integer sourceToPart = connect.getSourceToPart();

			if (sourceToPart != mxVsdxConstants.CONNECT_TO_PART_WHOLE_SHAPE)
			{
				mxPoint absOriginFrom = calculateAbsolutePoint(source.getParent(), graph, originFrom);
				fromConstraint = new mxPoint(
						(beginXY.getX() - absOriginFrom.getX())
								/ dimensionFrom.getX(),
						(beginXY.getY() - absOriginFrom.getY())
								/ dimensionFrom.getY());
			}
		}

		mxPoint endXY = edgeShape.getEndXY(parentHeight);
		endXY = calculateAbsolutePoint(parent, graph, endXY);
		
		mxPoint toConstraint = null;
		Integer toSheet = connect.getTargetToSheet();

		VsdxShape toShape = toSheet != null ? vertexShapeMap
				.get(new ShapePageId(pageId, toSheet)) : null;

		mxCell target = toSheet != null ? vertexMap.get(new ShapePageId(
				pageId, toSheet)) : null;

		if (toShape == null || target == null)
		{
			// Target is dangling
			target = (mxCell) graph.insertVertex(parent, null, null,
					endXY.getX(), endXY.getY(), 0, 0);
			toConstraint = new mxPoint(0, 0);
		}
		else
		{
			target = vertexMap.get(new ShapePageId(pageId, toSheet));

			mxPoint dimentionTo = toShape.getDimensions();

			//Get To shape origin.
			double height = pageHeight;

			if ((target.getParent() != null)
					&& (target.getParent().getGeometry() != null))
			{
				height = target.getParent().getGeometry().getHeight();
			}

			mxPoint originTo = toShape.getOriginPoint(height, false);
			Integer targetToPart = connect.getTargetToPart();

			if (targetToPart != mxVsdxConstants.CONNECT_TO_PART_WHOLE_SHAPE)
			{
				mxPoint absOriginTo = calculateAbsolutePoint( target.getParent(), graph, originTo);
				toConstraint = new mxPoint(
						(endXY.getX() - absOriginTo.getX())
								/ dimentionTo.getX(),
						(endXY.getY() - absOriginTo.getY())
								/ dimentionTo.getY());
			}
		}

		//Defines the style of the edge.
		Map<String, String> styleMap = edgeShape
				.getStyleFromEdgeShape(parentHeight);
		//Insert new edge and set constraints.
		Object edge = graph.insertEdge(parent, null, edgeShape.getTextLabel(), source,
				target, mxVsdxUtils.getStyleString(styleMap, "="));

		mxGeometry edgeGeometry = graph.getModel().getGeometry(edge);
		edgeGeometry.setPoints(edgeShape.getRoutingPoints(parentHeight, beginXY));

		if (fromConstraint != null)
		{
			graph.setConnectionConstraint(edge, source, true,
					new mxConnectionConstraint(fromConstraint, false));
		}
		if (toConstraint != null)
		{
			graph.setConnectionConstraint(edge, target, false,
					new mxConnectionConstraint(toConstraint, false));
		}

		//Gets and sets routing points of the edge.
		if (styleMap.containsKey("curved")
				&& styleMap.get("curved").equals("1"))
		{
			edgeGeometry = graph.getModel().getGeometry(edge);
			List<mxPoint> pointList = edgeShape
					.getControlPoints(parentHeight);
			edgeGeometry.setPoints(pointList);
		}
		
		return edgeId;
	}

		/**
		 * Adds a new edge not connected to any vertex to the graph.
		 * @param graph Graph where the parsed graph is included.
		 * @param parent Parent cell of the edge to be imported.
		 * @param edgeShape Shape Element that represents an edge.
		 * @return The new edge added.
		 */
		protected Object addUnconnectedEdge(mxGraph graph, Object parent, VsdxShape edgeShape, double pageHeight)
		{
			double parentHeight = pageHeight;

			if (parent != null)
			{
				mxGeometry parentGeometry = graph.getModel().getGeometry(parent);

				if (parentGeometry != null)
				{
					parentHeight = parentGeometry.getHeight();
				}
			}
	
			mxPoint beginXY = edgeShape.getStartXY(parentHeight);
			mxPoint endXY = edgeShape.getEndXY(parentHeight);

			//Define style of the edge
			Map<String, String> styleMap = edgeShape.getStyleFromEdgeShape(parentHeight);
	
			//TODO add style numeric entries rounding option
			
			//Insert new edge and set constraints.
			Object edge = graph.insertEdge(parent, null, edgeShape.getTextLabel(), null, null, mxVsdxUtils.getStyleString(styleMap, "="));
			mxGeometry edgeGeometry = graph.getModel().getGeometry(edge);
			edgeGeometry.setPoints(edgeShape.getRoutingPoints(parentHeight, beginXY));
			
			edgeGeometry.setTerminalPoint(beginXY, true);
			edgeGeometry.setTerminalPoint(endXY, false);

			//Gets and sets routing points of the edge.
			if (styleMap.containsKey("curved")
					&& styleMap.get("curved").equals("1"))
			{
				edgeGeometry = graph.getModel().getGeometry(edge);
				List<mxPoint> pointList = edgeShape
						.getControlPoints(parentHeight);
				edgeGeometry.setPoints(pointList);
			}
			
			return edge;
		}

	/**
	 * Creates a sub shape for <b>shape</b> that contains the label. Used internally, when the label is positioned by an anchor.
	 * @param graph
	 * @param shape the shape we want to create the label for
	 * @param parent
	 * @param parentHeight
	 * @return label sub-shape
	 */
	private mxCell createLabelSubShape(mxGraph graph, VsdxShape shape, mxCell parent)
	{
		String txtPinXV = shape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
				mxVsdxConstants.TXT_PIN_X, "V", "");
		String txtPinYV = shape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
				mxVsdxConstants.TXT_PIN_Y, "V", "");
		String txtWV = shape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
				mxVsdxConstants.TXT_WIDTH, "V", "");
		String txtHV = shape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
				mxVsdxConstants.TXT_HEIGHT, "V", "");
		String txtLocPinXV = shape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
				mxVsdxConstants.TXT_LOC_PIN_X, "V", "");
		String txtLocPinYV = shape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
				mxVsdxConstants.TXT_LOC_PIN_Y, "V", "");
		String txtAngleV = shape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
				mxVsdxConstants.TXT_ANGLE, "V", "");

		Shape masterShape = shape.getMaster() != null ? shape
				.getMaster().getMasterShape() : null;

		if (masterShape != null)
		{
			if (txtPinXV.equals(""))
			{
				txtPinXV = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
						mxVsdxConstants.TXT_PIN_X, "V", "");
			}

			if (txtPinYV.equals(""))
			{
				txtPinYV = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
						mxVsdxConstants.TXT_PIN_Y, "V", "");
			}

			if (txtWV.equals(""))
			{
				txtWV = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
						mxVsdxConstants.TXT_WIDTH, "V", "");
			}

			if (txtHV.equals(""))
			{
				txtHV = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM,
						mxVsdxConstants.TXT_HEIGHT, "V", "");
			}

			if (txtLocPinXV.equals(""))
			{
				txtLocPinXV = masterShape.getAttribute(
						mxVsdxConstants.TEXT_X_FORM,
						mxVsdxConstants.TXT_LOC_PIN_X, "V", "");
			}

			if (txtLocPinYV.equals(""))
			{
				txtLocPinYV = masterShape.getAttribute(
						mxVsdxConstants.TEXT_X_FORM,
						mxVsdxConstants.TXT_LOC_PIN_Y, "V", "");
			}

			if (txtAngleV.equals(""))
			{
				txtAngleV = masterShape.getAttribute(
						mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_ANGLE,
						"V", "");
			}
		}

		if (!txtPinXV.equals("") && !txtPinYV.equals("") && !txtWV.equals("")
				&& !txtHV.equals("") && !txtLocPinXV.equals("")
				&& !txtLocPinYV.equals(""))
		{
			String textLabel = shape.getTextLabel();

			if (!textLabel.equals(""))
			{
				Map<String, String> styleMap = new HashMap<String, String>();
				styleMap.put(mxConstants.STYLE_FILLCOLOR, mxConstants.NONE);
				styleMap.put(mxConstants.STYLE_STROKECOLOR, mxConstants.NONE);
				styleMap.put("align", "center");
				styleMap.put("verticalAlign", "middle");
				styleMap.put("whiteSpace", "wrap");

				if (!txtAngleV.equals(""))
				{
					String oldRotS = styleMap.get("rotation");
					double oldRot = 0;

					if (oldRotS != null)
					{
						oldRot = Double.parseDouble(oldRotS);
					}

					double labRot = Double.parseDouble(txtAngleV) * 180
							/ Math.PI;

					labRot = Math.round((labRot + oldRot) * 100.0) / 100.0;

					if (labRot != 0.0)
					{
						styleMap.put("rotation", Double.toString(labRot));
					}
				}

				String style = "text;"
						+ mxVsdxUtils.getStyleString(styleMap, "=");

				double y = parent.getGeometry().getHeight() - ((Double.parseDouble(txtPinYV)) + (Double.parseDouble(txtHV) - Double.parseDouble(txtLocPinYV))) * mxVsdxUtils.conversionFactor;
				double x = (Double.parseDouble(txtPinXV) - Double.parseDouble(txtLocPinXV)) * mxVsdxUtils.conversionFactor;

				double txtW = Double.parseDouble(txtWV)
						* mxVsdxUtils.conversionFactor;
				double txtH = Double.parseDouble(txtHV)
						* mxVsdxUtils.conversionFactor;

				mxCell v1 = (mxCell) graph.insertVertex(
						parent, null, textLabel, x, y, txtW, txtH, style + ";html=1;");

				return v1;
			}
		}

		return null;
	}
}
