/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 */
package com.mxgraph.io.gliffy.importer;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.google.gson.GsonBuilder;
import com.mxgraph.io.mxCodec;
import com.mxgraph.io.gliffy.model.Constraint;
import com.mxgraph.io.gliffy.model.Constraint.ConstraintData;
import com.mxgraph.io.gliffy.model.Constraints;
import com.mxgraph.io.gliffy.model.Diagram;
import com.mxgraph.io.gliffy.model.EmbeddedResources.Resource;
import com.mxgraph.io.gliffy.model.GliffyLayer;
import com.mxgraph.io.gliffy.model.GliffyObject;
import com.mxgraph.io.gliffy.model.GliffyText;
import com.mxgraph.io.gliffy.model.Graphic;
import com.mxgraph.io.gliffy.model.Graphic.GliffyImage;
import com.mxgraph.io.gliffy.model.Graphic.GliffyLine;
import com.mxgraph.io.gliffy.model.Graphic.GliffyMindmap;
import com.mxgraph.io.gliffy.model.Graphic.GliffyShape;
import com.mxgraph.io.gliffy.model.Graphic.GliffySvg;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.online.Utils;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxDomUtils;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxUtils;
import com.mxgraph.util.mxXmlUtils;
import com.mxgraph.view.mxGraphHeadless;

/**
 * Performs a conversion of a Gliffy diagram into a Draw.io diagram
 * <p>
 * Example :
 * <p>
 * <code><i>
 * GliffyDiagramConverter converter = new GliffyDiagramConverter(gliffyJsonString);<br>
 * String drawioXml = converter.getGraphXml();</i>
 * </code>
 * 
 * 
 */
public class GliffyDiagramConverter
{
	Logger logger = Logger.getLogger("GliffyDiagramConverter");

	private String diagramString;

	private Diagram gliffyDiagram;

	private mxGraphHeadless drawioDiagram;

	private Map<Integer, GliffyObject> vertices;

	private Map<String, GliffyLayer> layers;

	private Pattern rotationPattern = Pattern.compile("rotation=(\\-?\\w+)");

	/**
	 * Constructs a new converter and starts a conversion.
	 * 
	 * @param gliffyDiagramString JSON string of a gliffy diagram
	 */
	public GliffyDiagramConverter(String gliffyDiagramString)
	{
		vertices = new LinkedHashMap<Integer, GliffyObject>();
		layers = new LinkedHashMap<String, GliffyLayer>();
		this.diagramString = gliffyDiagramString;
		drawioDiagram = new mxGraphHeadless();
		//Disable parent (groups) auto extend feature as it miss with the coordinates of vsdx format
		drawioDiagram.setExtendParents(false);
		drawioDiagram.setExtendParentsOnAdd(false);
		drawioDiagram.setConstrainChildren(false);

		start();
	}

	private void start()
	{
		// creates a diagram object from the JSON string
		this.gliffyDiagram = new GsonBuilder().registerTypeAdapterFactory(new PostDeserializer()).create().fromJson(diagramString,
				Diagram.class);

		collectLayersAndConvert(layers, gliffyDiagram.stage.getLayers());

		collectVerticesAndConvert(vertices, gliffyDiagram.stage.getObjects(), null);

		//sort objects by the order specified in the Gliffy diagram
		sortObjectsByOrder(gliffyDiagram.stage.getObjects());

		drawioDiagram.getModel().beginUpdate();

		try
		{
			importLayers();

			for (GliffyObject obj : gliffyDiagram.stage.getObjects())
			{
				importObject(obj, obj.parent);
			}
		}
		finally
		{
			drawioDiagram.getModel().endUpdate();
		}

	}

	/**
	 * Imports the layers into the draw.io diagram after sorting them by their order. 
	 */
	private void importLayers()
	{
		Object root = drawioDiagram.getModel().getRoot();

		List<GliffyLayer> layers = gliffyDiagram.stage.getLayers();

		if (layers != null)
		{
			sortLayersByOrder(layers);

			for (GliffyLayer layer : layers)
			{
				drawioDiagram.addCell(layer.mxObject, root);
			}
		}
	}

	/**
	 * Imports the objects into the draw.io diagram. Recursively adds the children 
	 */
	private void importObject(GliffyObject obj, GliffyObject gliffyParent)
	{
		mxCell parent = gliffyParent != null ? gliffyParent.mxObject : null;

		//add a layer as a parent only if the object is not a child object
		if (parent == null && obj.layerId != null)
		{
			GliffyLayer layer = layers.get(obj.layerId);

			if (layer != null)
			{
				parent = layer.mxObject;
			}
		}

		drawioDiagram.addCell(obj.mxObject, parent);

		if (obj.hasChildren())
		{
			// sort the children except for swimlanes
			// their order value is "auto"
			if (obj.isSwimlane())
			{
				// rotated swimlane child order is inverse
				if (obj.rotation != 0)
				{
					Collections.reverse(obj.children);
				}
			}
			else
			{
				sortObjectsByOrder(obj.children);
			}

			for (GliffyObject child : obj.children)
			{
				importObject(child, obj);
			}
		}

		if (obj.isLine())
		{
			// gets the terminal cells for the edge
			mxCell startTerminal = getTerminalCell(obj, true);
			mxCell endTerminal = getTerminalCell(obj, false);

			obj.getMxObject().setTerminal(startTerminal, true);
			obj.getMxObject().setTerminal(endTerminal, false);
			
			setWaypoints(obj, startTerminal, endTerminal);
		}
	}

	private void sortObjectsByOrder(Collection<GliffyObject> values)
	{
		Comparator<GliffyObject> c = new Comparator<GliffyObject>()
		{
			public int compare(GliffyObject o1, GliffyObject o2)
			{
				Float o1o;
				Float o2o;
				try
				{
					//we treat the "null" order as higher than "non-null"
					if (o1.order == null && o2.order == null)
					{
						return 0;
					}
					else if (o1.order == null && o2.order != null)
					{
						return 1;
					}
					else if (o1.order != null && o2.order == null)
					{
						return -1;
					}

					o1o = Float.parseFloat(o1.order);
					o2o = Float.parseFloat(o2.order);

					return o1o.compareTo(o2o);
				}
				catch (NumberFormatException e)
				{
					return o1.order.compareTo(o2.order);
				}

			}
		};

		Collections.sort((List<GliffyObject>) values, c);
	}

	private void sortLayersByOrder(List<GliffyLayer> values)
	{
		Comparator<GliffyLayer> c = new Comparator<GliffyLayer>()
		{
			public int compare(GliffyLayer o1, GliffyLayer o2)
			{
				return o1.order - o2.order;
			}
		};

		Collections.sort(values, c);
	}

	private mxCell getTerminalCell(GliffyObject gliffyEdge, boolean start)
	{
		Constraints cons = gliffyEdge.getConstraints();

		if (cons == null)
		{
			return null;
		}

		Constraint con = start ? cons.getStartConstraint() : cons.getEndConstraint();

		if (con == null)
		{
			return null;
		}

		ConstraintData cst = start ? con.getStartPositionConstraint() : con.getEndPositionConstraint();
		int nodeId = cst.getNodeId();
		GliffyObject gliffyEdgeTerminal = vertices.get(nodeId);

		//edge could be terminated with another edge, so import it as a dangling edge
		if (gliffyEdgeTerminal == null)
		{
			return null;
		}

		mxCell mxEdgeTerminal = gliffyEdgeTerminal.getMxObject();

		return mxEdgeTerminal;
	}

	/**
	 * Sets the waypoints
	 * 
	 * @param object Gliffy line
	 * @param startTerminal starting point
	 * @param endTerminal ending point
	 */
	private String getStyle(mxCell cell, String key, String defaultValue)
	{
		String style = cell.getStyle();

		if (style != null && style.length() > 0)
		{
			String[] pairs = style.split(";");

			for (int i = 0; i < pairs.length; i++)
			{
				String tmp = pairs[i];
				int c = tmp.indexOf('=');

				if (c >= 0 && tmp.substring(0, c).equalsIgnoreCase(key))
				{
					return tmp.substring(c + 1);
				}
			}
		}

		return defaultValue;
	};

	private boolean addConstraint(GliffyObject object, mxCell terminal, boolean source, boolean orthogonal)
	{
		Constraints cons = object.getConstraints();
		Constraint con = (cons != null) ? ((source) ? cons.getStartConstraint() : cons.getEndConstraint()) : null;
		ConstraintData data = (con != null) ? ((source) ? con.getStartPositionConstraint() : con.getEndPositionConstraint()) : null;

		if (data != null)
		{
			String direction = getStyle(terminal, mxConstants.STYLE_DIRECTION, "east");
			mxPoint temp = new mxPoint(data.getPx(), data.getPy());
			int rotation = 0;

			if (direction.equalsIgnoreCase("south"))
			{
				rotation = 270;
			}
			else if (direction.equalsIgnoreCase("west"))
			{
				rotation = 180;
			}
			else if (direction.equalsIgnoreCase("north"))
			{
				rotation = 90;
			}

			if (rotation != 0)
			{
				double rad = Math.toRadians(rotation);

				temp = mxUtils.getRotatedPoint(temp, Math.cos(rad), Math.sin(rad), new mxPoint(0.5, 0.5));
			}

			if (!orthogonal || (temp.getX() == 0.5 && temp.getY() == 0.5))
			{
				mxCell cell = object.getMxObject();
				cell.setStyle(cell.getStyle() + ((source) ? "exitX=" : "entryX=") + temp.getX() + ";" + ((source) ? "exitY=" : "entryY=")
						+ temp.getY() + ";" + ((source) ? "exitPerimeter=0" : "entryPerimeter=0") + ";");
			}

			return true;
		}

		return orthogonal;
	};

	/**
	 * Sets the waypoints
	 * 
	 * @param object Gliffy line
	 * @param startTerminal starting point
	 * @param endTerminal ending point
	 */
	private void setWaypoints(GliffyObject object, mxCell startTerminal, mxCell endTerminal)
	{
		mxCell cell = object.getMxObject();
		mxGeometry geo = drawioDiagram.getModel().getGeometry(cell);
		geo.setRelative(true);

		List<float[]> points = object.getGraphic().getLine().controlPath;

		if (points.size() < 2)
		{
			return;
		}

		List<mxPoint> mxPoints = new ArrayList<mxPoint>();

		mxPoint pivot = new mxPoint(object.x + object.width / 2, object.y + object.height / 2);

		for (float[] point : points)
		{
			mxPoint waypoint = new mxPoint(point[0] + object.x, point[1] + object.y);

			if (object.rotation != 0)
			{
				double rads = Math.toRadians(object.rotation);
				double cos = Math.cos(rads);
				double sin = Math.sin(rads);
				waypoint = mxUtils.getRotatedPoint(waypoint, cos, sin, pivot);
			}

			mxPoints.add(waypoint);
		}

		// Analyze waypoints
		boolean orthogonal = true;

		mxPoint p0 = mxPoints.get(0);
		mxPoint pe = mxPoints.get(mxPoints.size() - 1);

		Iterator<mxPoint> it = mxPoints.iterator();
		mxPoint last = it.next();

		while (it.hasNext())
		{
			mxPoint current = it.next();

			orthogonal = orthogonal && (last.getX() == current.getX() || last.getY() == current.getY());

			last = current;
		}

		if (startTerminal == null)
		{
			geo.setTerminalPoint(p0, true);
			mxPoints.remove(p0);// remove first so it doesn't become a waypoint
		}
		else
		{
			// Do not add constraint for orthogonal edges
			if (addConstraint(object, startTerminal, true, orthogonal))
			{
				//Removing the point resulted in incorrect edges
				//TODO confirm nothing is affected from this change
				//mxPoints.remove(p0);
			}
		}

		if (endTerminal == null)
		{
			geo.setTerminalPoint(pe, false);
			mxPoints.remove(pe);// remove last so it doesn't become a waypoint
		}
		else
		{
			// Do not add constraint for orthogonal edges
			if (addConstraint(object, endTerminal, false, orthogonal))
			{
				//Removing the point resulted in incorrect edges
				//TODO confirm nothing is affected from this change
				//mxPoints.remove(pe);
			}
		}

		if (orthogonal)
		{
			cell.setStyle(cell.getStyle() + "edgeStyle=orthogonalEdgeStyle;");
			List<mxPoint> result = new ArrayList<mxPoint>();

			// Removes duplicate waypoints
			if (mxPoints.size() > 0)
			{
				it = mxPoints.iterator();
				last = it.next();

				result.add(last);

				while (it.hasNext())
				{
					mxPoint current = it.next();

					if (last.getX() != current.getX() || last.getY() != current.getY())
					{
						result.add(current);
					}

					last = current;
				}
			}
			else if ((startTerminal == null && endTerminal != null) || (endTerminal == null && startTerminal != null))
			{
				// Adds control points to fix floating connection point
				mxPoint center = new mxPoint(p0.getX() + (pe.getX() - p0.getX()) / 2, p0.getY() + (pe.getY() - p0.getY()) / 2);
				result.add(center);
				result.add(center);
			}

			mxPoints = result;
		}

		if (!mxPoints.isEmpty())
		{
			geo.setPoints(mxPoints);
		}

		drawioDiagram.getModel().setGeometry(cell, geo);
	}

	/**
	 * Creates a map of all layers so they can be easily accessed when looking
	 * up cells layers
	 */
	private void collectLayersAndConvert(Map<String, GliffyLayer> layersMap, Collection<GliffyLayer> layers)
	{
		if (layers == null)
		{
			return;
		}

		// Removes empty default layer
		if (layers.size() > 0)
		{
			mxIGraphModel model = drawioDiagram.getModel();

			if (model.getChildCount(model.getRoot()) > 0)
			{
				model.remove(model.getChildAt(model.getRoot(), 0));
			}
		}

		for (GliffyLayer layer : layers)
		{
			mxCell layerCell = new mxCell();

			layerCell.setVisible(layer.visible);

			if (layer.locked)
			{
				layerCell.setStyle("locked=1;");
			}

			//			layer.active //How can we set the active layer in draw.io?
			//			layer.nodeIndex //??

			layerCell.setValue(layer.name);

			layer.mxObject = layerCell;

			layersMap.put(layer.guid, layer);
		}
	}

	/**
	 * Creates a map of all vertices so they can be easily accessed when looking
	 * up terminal cells for edges
	 */
	private void collectVerticesAndConvert(Map<Integer, GliffyObject> vertices, Collection<GliffyObject> objects, GliffyObject parent)
	{
		for (GliffyObject object : objects)
		{
			object.parent = parent;

			convertGliffyObject(object, parent);

			if (!object.isLine())
			{
				vertices.put(object.id, object);
			}

			// don't collect for swimlanes and mindmaps, their children are treated differently
			if (object.isGroup() || object.isSelection() || (object.isLine() && object.hasChildren()))
			{
				collectVerticesAndConvert(vertices, object.children, object);
			}
		}
	}

	/**
	 * Converts the mxGraph to xml string
	 * 
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public String getGraphXml()
	{
		mxCodec codec = new mxCodec();
		Element node = (Element) codec.encode(drawioDiagram.getModel());
		node.setAttribute("style", "default-style2");
		node.setAttribute("background", gliffyDiagram.stage.getBackgroundColor());
		node.setAttribute("grid", gliffyDiagram.stage.isGridOn() ? "1" : "0");
		node.setAttribute("guides", gliffyDiagram.stage.isDrawingGuidesOn() ? "1" : "0");
		String xml = mxXmlUtils.getXml(node);
		return xml;
	}

	/**
	 * Performs the object conversion
	 * 
	 * 
	 */
	private mxCell convertGliffyObject(GliffyObject gliffyObject, GliffyObject parent)
	{
		mxCell cell = new mxCell();

		if (gliffyObject.isUnrecognizedGraphicType())
		{
			logger.warning("Unrecognized graphic type for object with ID : " + gliffyObject.id);
			return cell;
		}

		StringBuilder style = new StringBuilder();

		mxGeometry geometry = new mxGeometry(gliffyObject.x, gliffyObject.y, gliffyObject.width, gliffyObject.height);
		gliffyObject.adjustGeo(geometry);
		cell.setGeometry(geometry);

		GliffyObject textObject = null;
		String link = null;

		Graphic graphic = gliffyObject.getGraphic();
		String translatedStyle = StencilTranslator.translate(gliffyObject.uid,
				graphic != null && graphic.getShape() != null ? graphic.getShape().tid : null);

		if (gliffyObject.isGroup())
		{
			if (graphic == null || translatedStyle == null)
				style.append("group;");

			cell.setVertex(true);
		}
		else
		{
			textObject = gliffyObject.getTextObject();
		}

		if (graphic != null)
		{
			link = gliffyObject.getLink();

			if (gliffyObject.isShape())
			{
				GliffyShape shape = graphic.Shape;

				cell.setVertex(true);

				if (translatedStyle != null)
				{
					style.append("shape=").append(translatedStyle).append(";");
				}

				if (style.lastIndexOf("shadow=") == -1)
				{
					style.append("shadow=" + (shape.dropShadow ? 1 : 0)).append(";");
				}

				if (style.lastIndexOf("strokeWidth") == -1)
				{
					style.append("strokeWidth=" + shape.strokeWidth).append(";");

					if (shape.strokeWidth == 0)
					{
						style.append("strokeColor=none;");
					}
				}

				if (style.lastIndexOf("fillColor") == -1)
				{
					if (shape.isNoFill())
					{
						style.append("fillColor=none;");

					}
					else
					{
						style.append("fillColor=" + shape.fillColor).append(";");
					}

					if (shape.fillColor.equals("none"))
					{
						style.append("pointerEvents=0;");
					}

				}
				if (style.lastIndexOf("strokeColor") == -1 && !shape.isNoFill())
				{
					String strokeClr = gliffyObject.isUseFillColor4StrokeColor() ? shape.fillColor : shape.strokeColor;
					style.append("strokeColor=" + strokeClr).append(";");
				}

				if (style.lastIndexOf("gradient") == -1 && shape.gradient && !gliffyObject.isGradientIgnored())
				{
					style.append("gradientColor=" + gliffyObject.getGradientColor() + ";gradientDirection=north;");
				}

				// opacity value is wrong for venn circles, so ignore it and use the one in the mapping
				if (!gliffyObject.isVennCircle() && style.lastIndexOf("opacity") == -1)
				{
					style.append("opacity=" + shape.opacity * 100).append(";");
				}

				style.append(DashStyleMapping.get(shape.dashStyle, 1));

				if (gliffyObject.isSubRoutine())
				{
					//Gliffy's subroutine maps to drawio process, whose inner boundary, unlike subroutine's, is relative to it's width so here we set it to 10px
					style.append("size=" + 10 / gliffyObject.width).append(";");
				}
				
				String fragmentText;
				if((fragmentText = gliffyObject.getUmlSequenceCombinedFragmentText()) != null) 
				{
					cell.setValue(fragmentText);
					gliffyObject.children.remove(0);
				}
			}
			else if (gliffyObject.isLine())
			{
				GliffyLine line = graphic.Line;

				cell.setEdge(true);
				style.append("shape=filledEdge;");
				style.append("strokeWidth=" + line.strokeWidth).append(";");
				style.append("strokeColor=" + line.strokeColor).append(";");
				style.append("fillColor=" + line.fillColor).append(";");
				style.append(ArrowMapping.get(line.startArrow).toString(true)).append(";");
				style.append(ArrowMapping.get(line.endArrow).toString(false)).append(";");
				style.append("rounded=" + (line.cornerRadius != null ? "1" : "0")).append(";");
				style.append(DashStyleMapping.get(line.dashStyle, line.strokeWidth));
				style.append(LineMapping.get(line.interpolationType));

				geometry.setX(0);
				geometry.setY(0);
			}
			else if (gliffyObject.isText())
			{
				textObject = gliffyObject;
				cell.setVertex(true);
				style.append("text;html=1;nl2Br=0;");
				cell.setValue(gliffyObject.getText());

				//if text is a child of a cell, use relative geometry and set X and Y to 0
				if (gliffyObject.parent != null && !gliffyObject.parent.isGroup())
				{
					mxGeometry parentGeometry = gliffyObject.parent.mxObject.getGeometry();

					//if text is a child of a line, special positioning is in place
					if (gliffyObject.parent.isLine())
					{
						/* Gliffy's text offset is a float in the range of [0,1]
						 * draw.io's text offset is a float in the range of [-1,-1] (while still keeping the text within the line)
						 * The equation that translates Gliffy offset to draw.io offset is : G*2 - 1 = D 
						 */
						mxGeometry mxGeo = new mxGeometry(graphic.Text.lineTValue != null ? graphic.Text.lineTValue * 2 - 1 : 0, 0, 0, 0);

						float lblY = 0, lblX = 0;

						if (graphic.Text.linePerpValue != null)
						{
							List<float[]> controlPath = gliffyObject.parent.graphic.Line.controlPath;

							if (controlPath != null && controlPath.size() >= 2)
							{
								int i1 = 0, i2 = controlPath.size() - 1;
								boolean noCardinal = false;

								if ("begin".equals(graphic.Text.cardinalityType))
								{
									i2 = 1;
								}
								else if ("end".equals(graphic.Text.cardinalityType))
								{
									i1 = controlPath.size() - 2;
								}
								else
								{
									noCardinal = true;
								}

								if (noCardinal || (controlPath.get(i1)[1] == controlPath.get(i2)[1]))
								{
									lblY = graphic.Text.linePerpValue;

									if (controlPath.get(i1)[0] - controlPath.get(i2)[0] > 0)
									{
										lblY = -lblY;
									}
								}
								else
								{
									lblX = graphic.Text.linePerpValue;

									if (controlPath.get(i1)[1] - controlPath.get(i2)[1] < 0)
									{
										lblX = -lblX;
									}
								}
							}
						}

						mxGeo.setOffset(new mxPoint(lblX, lblY));
						cell.setGeometry(mxGeo);

						style.append("labelBackgroundColor=" + gliffyDiagram.stage.getBackgroundColor()).append(";");
						//should we force horizontal align for text on lines?
						//Most probably yes, as extracting alignment from html messes with some cases [set halign to null later]
						//style.append("align=center;");

						//This is a workaround for edges as its label offset is incorrect when alignment is set. It should be handled in a better way
						//HTML text-align is not mapped to halign for edges
						//TODO Enhance edge's label positioning
						gliffyObject.graphic.getText().setHalign(null);
					}
					else
					{
						cell.setGeometry(new mxGeometry(0, 0, parentGeometry.getWidth(), parentGeometry.getHeight()));
					}

					cell.getGeometry().setRelative(true);
				}
			}
			else if (gliffyObject.isImage())
			{
				GliffyImage image = graphic.getImage();
				cell.setVertex(true);
				style.append("shape=" + StencilTranslator.translate(gliffyObject.uid, null)).append(";");
				style.append("image=" + image.getUrl()).append(";");
			}
			else if (gliffyObject.isSvg())
			{
				GliffySvg svg = graphic.Svg;
				cell.setVertex(true);
				style.append("shape=image;imageAspect=0;");
				Resource res = gliffyDiagram.embeddedResources.get(svg.embeddedResourceId);
				SVGImporterUtils svgUtils = new SVGImporterUtils();
				res.data = svgUtils.setViewBox(res.data);
				style.append("image=data:image/svg+xml,").append(res.getBase64EncodedData()).append(";");
			}
		}
		// swimlanes have children without uid so their children are converted here ad hoc
		else if (gliffyObject.isSwimlane())
		{
			cell.setVertex(true);
			style.append(StencilTranslator.translate(gliffyObject.uid, null)).append(";");

			if (gliffyObject.rotation == 0) //270 case is handled in rotation below
			{
				style.append("childLayout=stackLayout;resizeParent=1;resizeParentMax=0;");
			}

			GliffyObject header = gliffyObject.children.get(0);// first child is the header of the swimlane

			GliffyShape shape = header.graphic.getShape();
			style.append("strokeWidth=" + shape.strokeWidth).append(";");
			style.append("shadow=" + (shape.dropShadow ? 1 : 0)).append(";");
			style.append("fillColor=" + shape.fillColor).append(";");
			style.append("strokeColor=" + shape.strokeColor).append(";");
			style.append("startSize=" + header.height).append(";");
			style.append("whiteSpace=wrap;");

			for (int i = 1; i < gliffyObject.children.size(); i++) // rest of the children are lanes
			{
				GliffyObject gLane = gliffyObject.children.get(i);
				gLane.parent = gliffyObject;

				GliffyShape gs = gLane.graphic.getShape();
				StringBuilder laneStyle = new StringBuilder();
				laneStyle.append("swimlane;collapsible=0;swimlaneLine=0;");
				laneStyle.append("strokeWidth=" + gs.strokeWidth).append(";");
				laneStyle.append("shadow=" + (gs.dropShadow ? 1 : 0)).append(";");
				laneStyle.append("fillColor=" + gs.fillColor).append(";");
				laneStyle.append("strokeColor=" + gs.strokeColor).append(";");
				laneStyle.append("whiteSpace=wrap;html=1;fontStyle=0;");

				mxGeometry childGeometry = new mxGeometry(gLane.x, gLane.y, gLane.width, gLane.height);

				if (gliffyObject.rotation != 0)
				{

					if (gliffyObject.rotation == 270) //Special handling for this common case
					{
						laneStyle.append("horizontal=0;");
						double width = childGeometry.getWidth();
						childGeometry.setWidth(childGeometry.getHeight());
						childGeometry.setHeight(width);
						double x = childGeometry.getX();
						childGeometry.setX(childGeometry.getY());
						childGeometry.setY(gliffyObject.width - width - x);
					}
					else
					{
						laneStyle.append("rotation=" + gliffyObject.rotation).append(";");
						Utils.rotatedGeometry(childGeometry, gliffyObject.rotation, gliffyObject.width / 2, gliffyObject.height / 2);
					}
				}

				mxCell mxLane = new mxCell();
				mxLane.setVertex(true);
				cell.insert(mxLane);

				GliffyObject laneTxt = gLane.children.get(0);
				mxLane.setValue(laneTxt.getText());
				laneStyle.append(laneTxt.graphic.getText().getStyle(0, 0));
				//for debugging, add gliffy id to the output in the style 
				laneStyle.append("gliffyId=" + gLane.id + ";");
				mxLane.setStyle(laneStyle.toString());

				mxLane.setGeometry(childGeometry);
				gLane.mxObject = mxLane;
			}
		}
		else if (gliffyObject.isMindmap() && gliffyObject.children != null && !gliffyObject.children.isEmpty())
		{
			GliffyObject rectangle = gliffyObject.children.get(0);

			GliffyMindmap mindmap = rectangle.graphic.Mindmap;

			style.append("shape=" + StencilTranslator.translate(gliffyObject.uid, null)).append(";");
			style.append("shadow=" + (mindmap.dropShadow ? 1 : 0)).append(";");
			style.append("strokeWidth=" + mindmap.strokeWidth).append(";");
			style.append("fillColor=" + mindmap.fillColor).append(";");
			style.append("strokeColor=" + mindmap.strokeColor).append(";");
			style.append(DashStyleMapping.get(mindmap.dashStyle, 1));

			if (mindmap.gradient)
			{
				style.append("gradientColor=#FFFFFF;gradientDirection=north;");
			}

			cell.setVertex(true);
		}

		if (!gliffyObject.isLine())
		{
			//if there's a rotation by default, add to it
			if (style.lastIndexOf("rotation") != -1)
			{
				Matcher m = rotationPattern.matcher(style);

				if (m.find())
				{
					String rot = m.group(1);
					float initialRotation = Float.parseFloat(rot);
					Float rotation = initialRotation + gliffyObject.rotation;
					String tmp = m.replaceFirst("rotation=" + rotation.toString());
					style.setLength(0);
					style.append(tmp);
				}
			}
			else if (gliffyObject.rotation != 0)
			{
				//handling the special common case
				if (style.indexOf("swimlane;collapsible=0;") > -1 && gliffyObject.rotation == 270)
				{
					double w = geometry.getWidth();
					double h = geometry.getHeight();
					geometry.setX(geometry.getX() + (w - h) / 2);
					geometry.setY(geometry.getY() + +(h - w) / 2);
					geometry.setWidth(h);
					geometry.setHeight(w);

					style.append("childLayout=stackLayout;resizeParent=1;resizeParentMax=0;horizontal=0;horizontalStack=0;");
				}
				else
				{
					if (gliffyObject.isGroup())
					{
						for (GliffyObject childObject : gliffyObject.children)
						{
							rotateGroupedObject(gliffyObject, childObject);
						}

					}
					style.append("rotation=" + gliffyObject.rotation + ";");
				}
			}
		}

		if (textObject != null)
		{
			style.append("html=1;nl2Br=0;");

			if (!gliffyObject.isLine())
			{
				GliffyText txt = textObject.graphic.getText();

				if (gliffyObject.isSwimlane())
				{
					txt.setForceTopPaddingShift(true);
					txt.setValign("middle");
				}

				cell.setValue(textObject.getText());
				gliffyObject.adjustTextPos(textObject);
				// If gliffyObject is Frame then always stick text on top left corner.
				if (gliffyObject.containsTextBracket())
				{
					fixFrameTextBorder(gliffyObject, style);
					style.append(txt.getStyle(0, 0).replaceAll("verticalAlign=middle", "verticalAlign=top"));
				}
				else
				{
					style.append(textObject == gliffyObject ? txt.getStyle(0, 0) : txt.getStyle(textObject.x, textObject.y));
				}
			}
		}

		if (link != null)
		{
			Document doc = mxDomUtils.createDocument();
			Element uo = doc.createElement("UserObject");
			uo.setAttribute("link", link);
			drawioDiagram.getModel().setValue(cell, uo);

			if (textObject != null)
			{
				uo.setAttribute("label", textObject.getText());
			}
		}

		//for debugging, add gliffy id to the output in the style 
		style.append("gliffyId=" + gliffyObject.id + ";");

		cell.setStyle(style.toString());
		gliffyObject.mxObject = cell;

		return cell;
	}

	/**
	 * Rotate objects inside Group
	 * 
	 * @param group
	 * @param childObject
	 */
	private void rotateGroupedObject(GliffyObject group, GliffyObject childObject)
	{
		mxPoint pivot = new mxPoint(group.width / 2 - childObject.width / 2, group.height / 2 - childObject.height / 2);
		mxPoint temp = new mxPoint(childObject.x, childObject.y);
		if (group.rotation != 0)
		{
			double rads = Math.toRadians(group.rotation);
			double cos = Math.cos(rads);
			double sin = Math.sin(rads);
			temp = mxUtils.getRotatedPoint(temp, cos, sin, pivot);
			childObject.x = (float) temp.getX();
			childObject.y = (float) temp.getY();
			childObject.rotation += group.rotation;
		}
	}
	
	/**
	 * Update borders of Text bracket in Frame objects.
	 * 
	 * @param gliffyObject the GliffyObject
	 * @param style the StringBuilder with our style
	 */
	private void fixFrameTextBorder(GliffyObject gliffyObject, StringBuilder style)
	{
		String wrongValue = "labelX=32"; // hard-coded 32 from gliffyTranslation.properties needs to be replaced
		String correctValue = "labelX=" + gliffyObject.getTextObject().width * 1.1f; // 10% more to bracket width, looks nicer on UI
		int start = style.indexOf(wrongValue);
		int end = start + wrongValue.length();
		style.replace(start, end, correctValue);
	}
}
