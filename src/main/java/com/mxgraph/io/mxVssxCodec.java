package com.mxgraph.io;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import org.w3c.dom.Element;
import org.xml.sax.SAXException;

import com.mxgraph.io.vsdx.ShapePageId;
import com.mxgraph.io.vsdx.VsdxShape;
import com.mxgraph.io.vsdx.mxVsdxConstants;
import com.mxgraph.io.vsdx.mxVsdxMaster;
import com.mxgraph.io.vsdx.mxVsdxPage;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.util.mxPoint;
import com.mxgraph.view.mxGraph;

public class mxVssxCodec extends mxVsdxCodec 
{
	public mxVssxCodec()
	{
		RESPONSE_END = "";
		RESPONSE_DIAGRAM_START = "";
		RESPONSE_DIAGRAM_END = "";
		RESPONSE_HEADER = "";
	}
	
	public String decodeVssx(byte[] data, String charset)
			throws IOException, ParserConfigurationException, SAXException,
			TransformerException
	{
		StringBuilder library = new StringBuilder("<mxlibrary>[");
		
		//process shapes in pages
		String shapesInPages = decodeVsdx(data, charset);
		
		library.append(shapesInPages);
		
		//process shapes in master
		Map<String, mxVsdxMaster> masterShapes = vsdxModel.getMasterShapes();
		
		//using the first page as a dummy one
		mxVsdxPage page = vsdxModel.getPages().values().iterator().next();
		
		if (masterShapes != null)
		{
			StringBuilder shapes = new StringBuilder();
			String comma = shapesInPages.isEmpty()? "" : ",";
			for (mxVsdxMaster master : masterShapes.values())
			{
				mxGraph shapeGraph = createMxGraph();
				
				Element shapeElem = master.getMasterShape().getShape();
				VsdxShape shape = new VsdxShape(page, shapeElem, !page.isEdge(shapeElem), masterShapes, null, vsdxModel);
				mxCell cell = null;
				
				if (shape.isVertex())
				{
					edgeShapeMap.clear();
					parentsMap.clear();
					cell = addShape(shapeGraph, shape, shapeGraph.getDefaultParent(),
							0, 1169); //1169 is A4 page height
					
					for ( Entry<ShapePageId, VsdxShape> edgeEntry : edgeShapeMap.entrySet()) 
					{
						Object parent = parentsMap.get(edgeEntry.getKey());
						addUnconnectedEdge(shapeGraph, parent, edgeEntry.getValue(), 1169); //1169 is A4 page height
					}
				}
				else
				{
					cell = (mxCell) addUnconnectedEdge(shapeGraph, null, shape, 1169); //1169 is A4 page height
				}
				
				if (cell != null)
				{
					shapes.append(comma);
					shapes.append("{\"xml\":\"");
					mxGeometry geo = normalizeGeo(cell);
					
					sanitiseGraph(shapeGraph);
					
					if (shapeGraph.getModel().getChildCount(shapeGraph.getDefaultParent()) == 0) continue;
				
					String shapeXML = super.processPage(shapeGraph, null);
					shapes.append(shapeXML);
					shapes.append("\",\"w\":");
					shapes.append(geo.getWidth());
					shapes.append(",\"h\":");
					shapes.append(geo.getHeight());
					shapes.append(",\"title\":\"");
					
					String shapeName = master.getName();
					if (shapeName != null) shapeName = mxVsdxUtils.htmlEntities(shapeName);
					
					shapes.append(shapeName);
					
					shapes.append("\"}");
					comma = ",";
				}
			}
			library.append(shapes);
		}
		library.append("]</mxlibrary>");
		
		//TODO UTF-8 support is missing
		//
//		System.out.println(library);
		
		return library.toString();
	}

	protected mxGeometry normalizeGeo(mxCell cell) {
		mxGeometry geo = cell.getGeometry();
		geo.setX(0);
		geo.setY(0);
		
		mxPoint srcP = geo.getSourcePoint();

		if (cell.isEdge() && srcP != null)
		{
			transPoint(geo.getTargetPoint(), srcP);
			transPoint(geo.getOffset(), srcP);
			List<mxPoint> points = geo.getPoints();
			
			if (points != null) 
			{
				for (mxPoint p : points) 
				{
					transPoint(p, srcP);
				}
			}
			transPoint(srcP, srcP);
		}
		return geo;
	}

	protected void transPoint(mxPoint p, mxPoint srcP) 
	{
		if (p != null)
		{
			p.setX(p.getX() - srcP.getX());
			p.setY(p.getY() - srcP.getY());
		}
	}

	@Override
	protected String processPage(mxGraph graph, mxVsdxPage page) throws IOException {
		mxGraphModel model = (mxGraphModel)graph.getModel();
		
		StringBuilder shapes = new StringBuilder(); 
		String comma = "";
		for (Object c : model.getCells().values()) 
		{
			//add top level shapes only to the library
			if (graph.getDefaultParent() == model.getParent(c))
			{
				shapes.append(comma);
				shapes.append("{\"xml\":\"");
				mxGraph shapeGraph = createMxGraph();
				shapeGraph.addCell(c);
				sanitiseGraph(shapeGraph);
				
				if (shapeGraph.getModel().getChildCount(shapeGraph.getDefaultParent()) == 0) continue;
				
				mxGeometry geo = normalizeGeo((mxCell) c);
				String shapeXML = super.processPage(shapeGraph, null);
				shapes.append(shapeXML);
				shapes.append("\",\"w\":");
				shapes.append(geo.getWidth());
				shapes.append(",\"h\":");
				shapes.append(geo.getHeight());
				shapes.append(",\"title\":\"");
				String style = model.getStyle(c);
				
				String name = "";
				if (style != null)
				{
					int p = style.indexOf(mxVsdxConstants.VSDX_ID);
					if (p >= 0)
					{
						p += mxVsdxConstants.VSDX_ID.length() + 1;
						int id = Integer.parseInt(style.substring(p, style.indexOf(";", p)));
						VsdxShape vsdxShape = vertexShapeMap.get(new ShapePageId(page.getId(), id));
						if (vsdxShape != null)
							name = vsdxShape.getName();
					}
				}
				shapes.append(name);
				shapes.append("\"}");
				comma = ",";
			}
		}
		
		if (shapes.length() > 0) 
			RESPONSE_DIAGRAM_START = ",";
		else
			RESPONSE_DIAGRAM_START = "";
		
		return shapes.toString();
	}
}
