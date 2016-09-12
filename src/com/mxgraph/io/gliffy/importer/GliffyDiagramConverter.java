package com.mxgraph.io.gliffy.importer;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.google.gson.GsonBuilder;
import com.mxgraph.io.mxCodec;
import com.mxgraph.io.gliffy.model.Constraint;
import com.mxgraph.io.gliffy.model.Constraint.ConstraintData;
import com.mxgraph.io.gliffy.model.Constraints;
import com.mxgraph.io.gliffy.model.Diagram;
import com.mxgraph.io.gliffy.model.EmbeddedResources.Resource;
import com.mxgraph.io.gliffy.model.Graphic;
import com.mxgraph.io.gliffy.model.Graphic.GliffyImage;
import com.mxgraph.io.gliffy.model.Graphic.GliffyLine;
import com.mxgraph.io.gliffy.model.Graphic.GliffyMindmap;
import com.mxgraph.io.gliffy.model.Graphic.GliffyShape;
import com.mxgraph.io.gliffy.model.Graphic.GliffySvg;
import com.mxgraph.io.gliffy.model.Object;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxICell;
import com.mxgraph.util.mxDomUtils;
import com.mxgraph.util.mxPoint;
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
public class GliffyDiagramConverter {
	Logger logger = Logger.getLogger("GliffyDiagramConverter");

	private String diagramString;

	private Diagram gliffyDiagram;

	private mxGraphHeadless drawioDiagram;

	private Map<Integer, Object> vertices;

	/**
	 * Constructs a new converter and starts a conversion.
	 * 
	 * @param gliffyDiagramString
	 *            JSON string of a gliffy diagram
	 */
	public GliffyDiagramConverter(String gliffyDiagramString) {
		vertices = new LinkedHashMap<Integer, Object>();

		this.diagramString = gliffyDiagramString;

		drawioDiagram = new mxGraphHeadless();

		start();
	}

	private void start() {
		// creates a diagram object from the JSON string
		this.gliffyDiagram = new GsonBuilder().create().fromJson(diagramString, Diagram.class);

		collectVerticesAndConvert(vertices, gliffyDiagram.stage.getObjects(), null);

		drawioDiagram.getModel().beginUpdate();

		try {
			// sort objects by the order specified in the Gliffy diagram
			sortObjectsByOrder(gliffyDiagram.stage.getObjects());

			for (Object obj : gliffyDiagram.stage.getObjects()) {
				importObject(obj, null);
			}

		} finally {
			drawioDiagram.getModel().endUpdate();
		}

	}

	@SuppressWarnings("unused")
	private void correctLineEndings() {
		java.lang.Object[] edges = drawioDiagram.getAllEdges(new java.lang.Object[] { drawioDiagram.getDefaultParent() });
		for (int i = 0; i < edges.length; i++) {
			mxCell edge = (mxCell) edges[i];

			mxICell source = edge.getTerminal(true);
			mxICell target = edge.getTerminal(false);
			mxPoint srcP = edge.getGeometry().getSourcePoint();
			mxPoint trgtP = edge.getGeometry().getTargetPoint();

			if (target != null) {
				if (trgtP != null)
					System.out.println(target.getGeometry().contains(trgtP.getX(), trgtP.getY()));
				if (srcP != null)
					System.out.println(source.getGeometry().contains(srcP.getX(), srcP.getY()));

			}
		}
	}

	/**
	 * Imports the objects into the draw.io diagram. Recursively adds the
	 * children of groups and swimlanes
	 * 
	 */
	private void importObject(Object obj, mxCell parent) {
		
		if (obj.isGroup() || obj.isMindmap() || obj.isShape() || obj.isText() || obj.isImage() || obj.isSwimlane() || obj.isSvg()) {
			drawioDiagram.addCell(obj.mxObject, parent);

			if (obj.isGroup() || obj.isSwimlane()) {
				if (!obj.isSwimlane())// sort the children except for swimlanes, // their order value is "auto"
					sortObjectsByOrder(obj.children);

				for (Object go : obj.children) {
					importObject(go, go.parent.mxObject);
				}
			}
		} else if(obj.isLine()) {
			// gets the terminal cells for the edge
			mxCell startTerminal = getTerminalCell(obj, true);
			mxCell endTerminal = getTerminalCell(obj, false);

			drawioDiagram.addCell(obj.getMxObject(), parent, null, startTerminal, endTerminal);

			applyControlPoints(obj, startTerminal, endTerminal);
		}
		else 
		{
			logger.warning("Unrecognized object, uid : " + obj.uid);
		}
	}

	private void sortObjectsByOrder(Collection<Object> values) {
		Collections.sort((List<Object>) values, new Comparator<Object>() {
			public int compare(Object o1, Object o2) {
				Integer o1o;
				Integer o2o;
				try {
					o1o = Integer.parseInt(o1.order);
					o2o = Integer.parseInt(o2.order);
					return o1o.compareTo(o2o);
				} catch (NumberFormatException e) {
					return o1.order.compareTo(o2.order);
				}

			}
		});
	}

	private mxCell getTerminalCell(Object gliffyEdge, boolean start) {
		Constraints cons = gliffyEdge.getConstraints();

		if (cons == null) {
			return null;
		}
		Constraint con = start ? cons.getStartConstraint() : cons.getEndConstraint();

		if (con == null) {
			return null;
		}

		ConstraintData cst = start ? con.getStartPositionConstraint() : con.getEndPositionConstraint();
		int nodeId = cst.getNodeId();
		Object gliffyEdgeTerminal = vertices.get(nodeId);
		mxCell mxEdgeTerminal = gliffyEdgeTerminal.getMxObject();
		
		return mxEdgeTerminal;
	}

	/**
	 * 
	 */
	private void applyControlPoints(Object object, mxCell startTerminal, mxCell endTerminal) {
		mxCell cell = object.getMxObject();
		mxGeometry geo = drawioDiagram.getModel().getGeometry(cell);
		geo.setRelative(true);

		List<float[]> points = object.getGraphic().getLine().controlPath;
		List<mxPoint> mxPoints = new ArrayList<mxPoint>();

		for (float[] point : points) {
			mxPoints.add(new mxPoint((int) point[0] + (int) object.x, (int) point[1] + (int) object.y));
		}

		if (startTerminal == null) {
			mxPoint first = mxPoints.get(0);
			geo.setTerminalPoint(first, true);
			mxPoints.remove(first);// remove first so it doesn't become a waypoint
		}

		if (endTerminal == null) {
			mxPoint last = mxPoints.get(mxPoints.size() - 1);
			geo.setTerminalPoint(last, false);
			mxPoints.remove(last);// remove last so it doesn't become a waypoint
		}

		if (!mxPoints.isEmpty())
			geo.setPoints(mxPoints);

		drawioDiagram.getModel().setGeometry(cell, geo);
	}

	/**
	 * Creates a map of all vertices so they can be easily accessed when looking
	 * up terminal cells for edges
	 */
	private void collectVerticesAndConvert(Map<Integer, Object> vertices, Collection<Object> objects, Object parent) {
		for (Object object : objects) {
			object.mxObject = convertGliffyObject(object, null);
			object.parent = parent;

			if (object.isGroup())// only do this recursively for groups, swimlanes have children w/o uid
			{
				vertices.put(object.id, object);
				collectVerticesAndConvert(vertices, object.children, object);
			} else if (object.isShape() || object.isText() || object.isImage() || object.isSwimlane() || object.isSvg() || object.isMindmap()) {
				vertices.put(object.id, object);
			} 
		}
	}

	/**
	 * Converts the mxGraph to xml string
	 * 
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public String getGraphXml() {
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
	private mxCell convertGliffyObject(Object gliffyObject, mxCell parent) {
		mxCell cell = new mxCell();
		cell.setParent(parent);
		StringBuilder style = new StringBuilder();

		mxGeometry geometry = new mxGeometry((int) gliffyObject.x, (int) gliffyObject.y, (int) gliffyObject.width, (int) gliffyObject.height);
		cell.setGeometry(geometry);

		Graphic graphic = null;
		if (gliffyObject.isGroup()) {
			style.append("group;");
			cell.setVertex(true);
		} else {
			// groups don't have graphic
			graphic = gliffyObject.getGraphic();
		}

		String text = null;
		Object textObject = null;
		
		String link = null;

		if (graphic != null) {
			textObject = gliffyObject.getTextObject();
			link = gliffyObject.getLink();

			if (gliffyObject.isShape()) {
				GliffyShape shape = graphic.Shape;
				
				cell.setVertex(true);
				style.append("shape=" + StencilTranslator.translate(gliffyObject.uid)).append(";");
				style.append("shadow=" + (shape.dropShadow ? 1 : 0)).append(";");
				style.append("strokeWidth=" + shape.strokeWidth).append(";");
				style.append("fillColor=" + shape.fillColor).append(";");
				style.append("strokeColor=" + shape.strokeColor).append(";");

				if (shape.gradient)
					style.append("gradientColor=#FFFFFF;gradientDirection=north;");

				// opacity value is wrong for venn circles, so ignore it and use the one in the mapping
				if (!gliffyObject.isVennsCircle())
					style.append("opacity=" + shape.opacity * 100).append(";");

				style.append(DashStyleMapping.get(shape.dashStyle));
				style.append("whiteSpace=wrap;");
				text = gliffyObject.getTextRecursively();

			} else if (gliffyObject.isLine()) {
				GliffyLine line = graphic.getLine();
				cell.setEdge(true);
				style.append("strokeWidth=" + line.strokeWidth).append(";");
				style.append("strokeColor=" + line.strokeColor).append(";");
				style.append(ArrowMapping.get(line.startArrow).toString(true)).append(";");
				style.append(ArrowMapping.get(line.endArrow).toString(false)).append(";");
				style.append(DashStyleMapping.get(line.dashStyle));
				style.append(LineMapping.get(line.interpolationType));

				geometry.setX(0);
				geometry.setY(0);

				text = gliffyObject.getText();
			} else if (gliffyObject.isText()) {
				textObject = gliffyObject;
				cell.setVertex(true);
				style.append("text;whiteSpace=wrap;");
				text = gliffyObject.getText();
			} else if (gliffyObject.isImage()) {
				GliffyImage image = graphic.getImage();
				cell.setVertex(true);
				style.append("shape=" + StencilTranslator.translate(gliffyObject.uid)).append(";");
				style.append("image=" + image.getUrl()).append(";");

				text = gliffyObject.getText();
			}
			else if (gliffyObject.isSvg()) {
				GliffySvg svg = graphic.Svg;
				cell.setVertex(true);
				style.append("shape=image;aspect=fixed;");
				Resource res = gliffyDiagram.embeddedResources.get(svg.embeddedResourceId);

				style.append("image=data:image/svg+xml,").append(res.getBase64EncodedData()).append(";");
			} 
		} 
		// swimlanes have children w/o uid so their children are converted here ad hoc
		else if (gliffyObject.isSwimlane()) {
			cell.setVertex(true);
			style.append(StencilTranslator.translate(gliffyObject.uid)).append(";");

			boolean vertical = true;
			gliffyObject.rotation = 0;
			if (gliffyObject.uid.startsWith(Object.H_SWIMLANE)) {
				vertical = false;
				cell.getGeometry().setWidth(gliffyObject.height);
				cell.getGeometry().setHeight(gliffyObject.width);
				style.append("horizontal=0;");
			}

			Object header = gliffyObject.children.get(0);// first child is the header of the swimlane
			gliffyObject.children.remove(header);

			GliffyShape shape = header.graphic.getShape();
			style.append("strokeWidth=" + shape.strokeWidth).append(";");
			style.append("shadow=" + (shape.dropShadow ? 1 : 0)).append(";");
			style.append("fillColor=" + shape.fillColor).append(";");
			style.append("strokeColor=" + shape.strokeColor).append(";");
			style.append("whiteSpace=wrap;");

			text = header.getText();

			for (int i = 0; i < gliffyObject.children.size(); i++) // rest of the children are lanes
			{
				Object gLane = gliffyObject.children.get(i);
				gLane.parent = gliffyObject;

				GliffyShape gs = gLane.graphic.getShape();
				StringBuilder laneStyle = new StringBuilder();
				laneStyle.append("swimlane;swimlaneLine=0;" + (vertical ? "" : "horizontal=0;"));
				laneStyle.append("strokeWidth=" + gs.strokeWidth).append(";");
				laneStyle.append("shadow=" + (gs.dropShadow ? 1 : 0)).append(";");
				laneStyle.append("fillColor=" + gs.fillColor).append(";");
				laneStyle.append("strokeColor=" + gs.strokeColor).append(";");
				laneStyle.append("whiteSpace=wrap;html=1;");

				mxCell mxLane = new mxCell();
				mxLane.setVertex(true);
				cell.insert(mxLane);
				mxLane.setValue(gLane.getText());
				mxLane.setStyle(laneStyle.toString());
				mxGeometry childGeometry = new mxGeometry(gLane.x, gLane.y, vertical ? gLane.width : gLane.height, vertical ? gLane.height : gLane.width);
				mxLane.setGeometry(childGeometry);
				gLane.mxObject = mxLane;
			}
		} else if (gliffyObject.isMindmap()) {
			Object child = gliffyObject.children.get(0);
			GliffyMindmap mindmap = child.graphic.Mindmap;
			
			style.append("shape=" + StencilTranslator.translate(gliffyObject.uid)).append(";");
			style.append("shadow=" + (mindmap.dropShadow ? 1 : 0)).append(";");
			style.append("strokeWidth=" + mindmap.strokeWidth).append(";");
			style.append("fillColor=" + mindmap.fillColor).append(";");
			style.append("strokeColor=" + mindmap.strokeColor).append(";");
			style.append(DashStyleMapping.get(mindmap.dashStyle));

			if (mindmap.gradient)
				style.append("gradientColor=#FFFFFF;gradientDirection=north;");

			cell.setVertex(true);
			
			text = child.getTextRecursively();
		}

		if (gliffyObject.rotation != 0) {
			style.append("rotation=" + gliffyObject.rotation + ";");
		}

		if (!gliffyObject.isLine() && textObject != null) {
			style.append(textObject.graphic.getText().getStyle());
		}

		if (text != null && !text.equals("")) {
			style.append("html=1;nl2Br=0;");// nl2Br=0 stops newline from becoming <br>
		}
		
		if(link != null) 
		{
			Document doc = mxDomUtils.createDocument();
			Element uo = doc.createElement("UserObject");
			uo.setAttribute("link", link);
			drawioDiagram.getModel().setValue(cell, uo);
			
			if(text != null && !text.equals(""))
				uo.setAttribute("label", text);
		}
		else if(text != null && !text.equals("")) 
		{
			cell.setValue(text);
		}

		cell.setStyle(style.toString());
		gliffyObject.mxObject = cell;

		return cell;
	}

}
