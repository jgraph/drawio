/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
package com.mxgraph.io;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.imageio.ImageIO;
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

import com.google.appengine.api.images.Image;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesService.OutputEncoding;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.Transform;
import com.google.appengine.api.utils.SystemProperty;
import com.mxgraph.io.vsdx.ShapePageId;
import com.mxgraph.io.vsdx.VsdxShape;
import com.mxgraph.io.vsdx.mxPathDebug;
import com.mxgraph.io.vsdx.mxVsdxConnect;
import com.mxgraph.io.vsdx.mxVsdxConstants;
import com.mxgraph.io.vsdx.mxVsdxGeometry;
import com.mxgraph.io.vsdx.mxVsdxGeometryList;
import com.mxgraph.io.vsdx.mxVsdxMaster;
import com.mxgraph.io.vsdx.mxVsdxModel;
import com.mxgraph.io.vsdx.mxVsdxPage;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.model.mxICell;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.online.Utils;
import com.mxgraph.online.mxBase64;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxXmlUtils;
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
			mxGeometry geo = graph.getModel().getGeometry(cellParent);

			if (geo != null) 
			{
				point.setX(point.getX() + geo.getX());
				point.setY(point.getY() + geo.getY());				
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
					String base64Str;
					//Some BMP images are huge and doesn't show up in the browser, so, it is better to compress it as PNG 
					if (filename.toLowerCase().endsWith(".bmp")) 
					{
						try 
						{
							String environ = SystemProperty.environment.get();

							if (environ.equals("Production") || environ.equals("Development"))
							{
								ImagesService imagesService = ImagesServiceFactory.getImagesService();
								
								Image image = ImagesServiceFactory.makeImage(out.toByteArray());

								//dummy transform
								Transform transform = ImagesServiceFactory.makeCrop(0.0, 0.0, 1.0, 1.0);

								//Use PNG format as it is lossless similar to BMP but compressed
								Image newImage = imagesService.applyTransform(transform, image, OutputEncoding.PNG);

								base64Str = StringUtils.newStringUtf8(Base64.encodeBase64(newImage.getImageData(), false));
							}
							else
							{
								//Use ImageIO as it is normally available in other servlet containers (e.g.; Tomcat)
								ByteArrayInputStream bis = new ByteArrayInputStream(out.toByteArray());
								ByteArrayOutputStream bos = new ByteArrayOutputStream();
								
								BufferedImage image = ImageIO.read(bis);
								ImageIO.write(image, "PNG", bos);
								
								base64Str = StringUtils.newStringUtf8(Base64.encodeBase64(bos.toByteArray(), false));
							}
						}
						catch (Exception e) 
						{
							//conversion failed, nothing we can do!
							base64Str = StringUtils.newStringUtf8(Base64.encodeBase64(out.toByteArray(), false));
						}
					}
					else
					{
						base64Str = StringUtils.newStringUtf8(Base64.encodeBase64(out.toByteArray(), false));
					}

					mediaData.put(filename, base64Str);
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
				//Disable parent (groups) auto extend feature as it miss with the coordinates of vsdx format
				graph.setExtendParents(false);
				graph.setExtendParentsOnAdd(false);
				
				graph.setConstrainChildren(false);
				graph.setHtmlLabels(true);
				//Prevent change of edge parent as it misses with the routing points
				((mxGraphModel)graph.getModel()).setMaintainEdgeParent(false);
				
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
				
				//scale page 
				double scale = page.getPageScale() / page.getDrawingScale();
				
				if (scale != 1)
				{
					mxGraphModel model = (mxGraphModel)graph.getModel();
	
					for (Object c : model.getCells().values()) 
					{
						mxGeometry geo = model.getGeometry(c);
						
						if (geo != null) 
						{
							scaleRect(geo, scale);
							scaleRect(geo.getAlternateBounds(), scale);
							
							if (model.isEdge(c)) 
							{
								//scale edge waypoints, offset, ...
								scalePoint(geo.getSourcePoint(), scale);
								scalePoint(geo.getTargetPoint(), scale);
								scalePoint(geo.getOffset(), scale);
								List<mxPoint> points = geo.getPoints();
								
								if (points != null) 
								{
									for (mxPoint p : points) 
									{
										scalePoint(p, scale);
									}
								}
							}
						}
					}
				}
				
				graph.getModel().endUpdate();

				mxCodec codec = new mxCodec();
				Node node = codec.encode(graph.getModel());
				((Element) node).setAttribute("style", "default-style2");
				String pageName = StringEscapeUtils.escapeXml11(page.getPageName());
				xmlBuilder.append("<diagram name=\"" + pageName + "\">");
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
	 * Scale a point in place
	 * 
	 * @param p point to scale in place 
	 * @param scale scale
	 * @return scaled point
	 */
	private mxPoint scalePoint(mxPoint p, double scale) 
	{
		if (p != null)
		{
			p.setX(p.getX() * scale);
			p.setY(p.getY() * scale);
		}

		return p;
	}
	
	/**
	 * Scale a rectangle in place
	 * 
	 * @param rect rectangle to scale in place
	 * @param scale scale
	 * @return scaled rectangle
	 */
	private mxRectangle scaleRect(mxRectangle rect, double scale) 
	{
		if (rect != null) 
		{
			rect.setX(rect.getX() * scale);
			rect.setY(rect.getY() * scale);
			rect.setHeight(rect.getHeight() * scale);
			rect.setWidth(rect.getWidth() * scale);
		}

		return rect;
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
		Iterator<Entry<ShapePageId, VsdxShape>> it = edgeShapeMap.entrySet().iterator();
		
		while (it.hasNext())
		{
			Entry<ShapePageId, VsdxShape> edgeShapeEntry = it.next();
			
			//Only this page unconnected edges
			if (edgeShapeEntry.getKey().getPageNumber() == pageId)
			{
				addUnconnectedEdge(graph, parentsMap.get(edgeShapeEntry.getKey()), edgeShapeEntry.getValue(), pageHeight);
			}
		}

		sanitiseGraph(graph);

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
					v1 = addGroup(graph, shape, parent, pageId, parentHeight);
				}
				else
				{
					v1 = addVertex(graph, shape, parent, pageId, parentHeight);
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
	public mxCell addGroup(mxGraph graph, VsdxShape shape, Object parent, Integer pageId, double parentHeight)
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
		//Define style
		Map<String, String> styleMap = shape.getStyleFromShape();
		
		//Shape inherit its master geometry, so we don't need to check its master
		mxVsdxGeometryList geomList = shape.getGeomList();
		
		if (geomList.isNoFill())
		{
			styleMap.put(mxConstants.STYLE_FILLCOLOR, "none");
			styleMap.put(mxConstants.STYLE_GRADIENTCOLOR, "none");
		}
		
		if (geomList.isNoLine())
		{
			styleMap.put(mxConstants.STYLE_STROKECOLOR, "none");
		}

		styleMap.put("html", "1");
		styleMap.put(mxConstants.STYLE_WHITE_SPACE, "wrap");
		//TODO need to check if "shape=" should be added before the shape name (for "image", it should be skipped for example)
		String style = mxVsdxUtils.getStyleString(styleMap, "=");

		mxCell group = null;
		Map<Integer, VsdxShape> children = shape.getChildShapes();
		boolean hasChildren = children != null && children.size() > 0;
		boolean subLabel = shape.isDisplacedLabel() || shape.isRotatedLabel() || hasChildren;
		mxPoint o = shape.getOriginPoint(parentHeight, true);

		if (subLabel)
		{
			group = (mxCell) graph.insertVertex(parent, null, null,
					o.getX(), o.getY(), d.getX(), d.getY(), style);
		}
		else
		{
			group = (mxCell) graph.insertVertex(parent, null, textLabel,
					o.getX(), o.getY(), d.getX(), d.getY(), style);
		}

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
						subShape.propagateRotation(shape.getRotation());

						if (subShape.isGroup())
						{
							addGroup(graph, subShape, group, pageId, d.getY());
						}
						else
						{
							addVertex(graph, subShape, group, pageId, d.getY());
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
				else
				{
					addUnconnectedEdge(graph, group, subShape, parentHeight);
				}
			}
		}
		
		if (subLabel)
		{
			shape.createLabelSubShape(graph, group);
		}

		//rotate sub vertices coordinates based on parent rotation. It should be done here after the group size if determined
		double rotation = shape.getRotation();
		if (rotation != 0)
		{
			mxGeometry pgeo = group.getGeometry();
			double hw = pgeo.getWidth() / 2, hh = pgeo.getHeight() / 2;
			for (int i = 0; i < group.getChildCount(); i++)
			{
				mxICell child = group.getChildAt(i);
				rotatedPoint(child.getGeometry(), rotation, hw, hh);				
			}
		}
		return group;
	}

	public static void rotatedPoint(mxGeometry geo, double rotation,
			double cx, double cy)
	{
		rotation = Math.toRadians(rotation);
		double cos = Math.cos(rotation), sin = Math.sin(rotation);

		double x = geo.getCenterX() - cx;
		double y = geo.getCenterY() - cy;

		double x1 = x * cos - y * sin;
		double y1 = y * cos + x * sin;

		geo.setX(Math.round(x1 + cx - geo.getWidth() / 2));
		geo.setY(Math.round(y1 + cy - geo.getHeight() / 2));
	}

	/**
	 * Adds a simple shape to the graph
	 * @param graph Graph where the parsed graph is included.
	 * @param parent Parent cell of the shape.
	 * @param parentHeight Height of the parent cell of the shape.
	 * @return Cell added to the graph.
	 */
	public mxCell addVertex(mxGraph graph, VsdxShape shape, Object parent, Integer pageId, double parentHeight)
	{
		//Defines Text Label.
		String textLabel = "";

		if (!shape.isRotatedLabel())
		{
			textLabel = shape.getTextLabel();
		}

		mxPoint dimensions = shape.getDimensions();

		Map<String, String> styleMap = shape.getStyleFromShape();

		//if (textLabel != null && (textLabel.startsWith("<p>") || textLabel.startsWith("<p ")
		//		|| textLabel.startsWith("<font")))
		//{
			styleMap.put("html", "1");
		//}

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

		mxPoint coordinates = shape.getOriginPoint(parentHeight, true);

		if (geomExists || textLabel != null)
		{
			String style = mxVsdxUtils.getStyleString(styleMap, "=");

			mxCell v1 = null;
			boolean hasSubLabel = shape.isDisplacedLabel() || shape.isRotatedLabel();// || shape.getRotation() != 0;

			if (hasSubLabel)
			{
				v1 = (mxCell) graph.insertVertex(parent, null, null,
						coordinates.getX(), coordinates.getY(), dimensions.getX(),
						dimensions.getY(), style);
			}
			else
			{
				v1 = (mxCell) graph.insertVertex(parent, null, textLabel,
						coordinates.getX(), coordinates.getY(), dimensions.getX(),
						dimensions.getY(), style);
			}

			vertexMap.put(new ShapePageId(pageId, shape.getId()), v1);
			shape.setLabelOffset(v1, style);

			if (hasSubLabel)
			{
				shape.createLabelSubShape(graph, v1);
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
		mxPoint origBeginXY = new mxPoint(beginXY);
		
		beginXY = calculateAbsolutePoint(parent, graph, beginXY);

		mxPoint fromConstraint = null;
		Integer sourceSheet = connect.getSourceToSheet();

		mxCell source = sourceSheet != null ? vertexMap
				.get(new ShapePageId(pageId, sourceSheet)) : null;

		if (source == null)
		{
			// Source is dangling
			source = (mxCell) graph.insertVertex(parent, null, null,
					beginXY.getX(), beginXY.getY(), 0, 0);
			fromConstraint = new mxPoint(0, 0);
		}
		//Else: Routing points will contain the exit/entry points, so no need to set the to/from constraint 

		mxPoint endXY = edgeShape.getEndXY(parentHeight);
		endXY = calculateAbsolutePoint(parent, graph, endXY);
		
		mxPoint toConstraint = null;
		Integer toSheet = connect.getTargetToSheet();

		mxCell target = toSheet != null ? vertexMap.get(new ShapePageId(
				pageId, toSheet)) : null;

		if (target == null)
		{
			// Target is dangling
			target = (mxCell) graph.insertVertex(parent, null, null,
					endXY.getX(), endXY.getY(), 0, 0);
			toConstraint = new mxPoint(0, 0);
		}
		//Else: Routing points will contain the exit/entry points, so no need to set the to/from constraint 

		//Defines the style of the edge.
		Map<String, String> styleMap = edgeShape
				.getStyleFromEdgeShape(parentHeight);
		//Insert new edge and set constraints.
		Object edge;
		List<mxPoint> points = edgeShape.getRoutingPoints(parentHeight, origBeginXY, edgeShape.getRotation());
		double rotation = edgeShape.getRotation();
		if (rotation != 0)
		{
			edge = graph.insertEdge(parent, null, null, source,
					target, mxVsdxUtils.getStyleString(styleMap, "="));
			
			mxCell label = edgeShape.createLabelSubShape(graph, (mxCell) edge);
			if (label != null)
			{
				label.setStyle(label.getStyle() + ";rotation=" + (rotation > 60 && rotation < 240 ? (rotation + 180) % 360 : rotation));
				
				mxGeometry geo = label.getGeometry();
				geo.setX(0);
				geo.setY(0);
				geo.setRelative(true);
				geo.setOffset(new mxPoint(-geo.getWidth() / 2, -geo.getHeight() / 2));
			}
		}
		else
		{
			edge = graph.insertEdge(parent, null, edgeShape.getTextLabel(), source,
					target, mxVsdxUtils.getStyleString(styleMap, "="));
			
			mxPoint lblOffset = edgeShape.getLblEdgeOffset(beginXY, endXY, points);
			((mxCell)edge).getGeometry().setOffset(lblOffset);
		}
		
		mxGeometry edgeGeometry = graph.getModel().getGeometry(edge);
		edgeGeometry.setPoints(points);

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
	 * Find the top parent in a group
	 * 
	 * @param cell
	 * @return the top most parent (which has the defaultParent as its parent)
	 */
	private mxCell findTopParent(mxCell cell, mxCell defaultParent)
	{
		mxCell parent = (mxCell) cell.getParent();
		
		while (parent.getParent() != null && parent.getParent() != defaultParent)
		{
			parent = (mxCell) parent.getParent();
		}

		return parent;
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
		mxPoint origBeginXY = new mxPoint(beginXY);
		mxPoint endXY = edgeShape.getEndXY(parentHeight);

		//Define style of the edge
		Map<String, String> styleMap = edgeShape.getStyleFromEdgeShape(parentHeight);

		//TODO add style numeric entries rounding option
		
		//Insert new edge and set constraints.
		Object edge;
		List<mxPoint> points = edgeShape.getRoutingPoints(parentHeight, origBeginXY, edgeShape.getRotation());
		double rotation = edgeShape.getRotation();
		if (rotation != 0)
		{
			edge = graph.insertEdge(parent, null, null, null, null, mxVsdxUtils.getStyleString(styleMap, "="));
			
			mxCell label = edgeShape.createLabelSubShape(graph, (mxCell) edge);
			if (label != null)
			{
				label.setStyle(label.getStyle() + ";rotation=" + (rotation > 60 && rotation < 240 ? (rotation + 180) % 360 : rotation));
				
				mxGeometry geo = label.getGeometry();
				geo.setX(0);
				geo.setY(0);
				geo.setRelative(true);
				geo.setOffset(new mxPoint(-geo.getWidth() / 2, -geo.getHeight() / 2));
			}
		}
		else
		{
			edge = graph.insertEdge(parent, null, edgeShape.getTextLabel(), null, null, mxVsdxUtils.getStyleString(styleMap, "="));
			
			mxPoint lblOffset = edgeShape.getLblEdgeOffset(beginXY, endXY, points);
			((mxCell)edge).getGeometry().setOffset(lblOffset);
		}
		mxGeometry edgeGeometry = graph.getModel().getGeometry(edge);
		edgeGeometry.setPoints(points);
		
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
	 * Post processes groups to remove leaf vertices that render nothing
	 * @param group
	 */
	private void sanitiseGraph(mxGraph graph)
	{
		Object root = graph.getModel().getRoot();
		sanitiseCell(graph, root);
	}
	
	private boolean sanitiseCell(mxGraph graph, Object cell)
	{
		mxIGraphModel model = graph.getModel();
		int childCount = model.getChildCount(cell);
		ArrayList<Object> removeList = new ArrayList<Object>();

		for (int i = 0; i < childCount; i++)
		{
			Object child = model.getChildAt(cell, i);
			boolean remove = sanitiseCell(graph, child);
			
			// Can't remove during loop or indexing is messed up
			if (remove)
			{
				removeList.add(child);
			}
		}
		
		for (Object removeChild : removeList)
		{
			model.remove(removeChild);
		}
		
		if (childCount > 0)
		{
			// children may have been removed above
			childCount = model.getChildCount(cell);
		}
		
		String value = String.valueOf(model.getValue(cell));
		String style = model.getStyle(cell);

		if (childCount == 0 && model.isVertex(cell))
		{
			if ((model.getValue(cell) == null || value.isEmpty()) &&
					(style != null) &&
					(style.contains(mxConstants.STYLE_FILLCOLOR + "=none")) &&
					(style.contains(mxConstants.STYLE_STROKECOLOR + "=none")) &&
					(!style.contains("image=")))
			{
				// Leaf vertex, nothing rendered, no label, remove it

				return true;
			}
		}
		
		return false;
	}
}
