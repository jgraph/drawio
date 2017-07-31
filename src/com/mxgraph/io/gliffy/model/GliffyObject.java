package com.mxgraph.io.gliffy.model;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.mxgraph.io.gliffy.importer.PostDeserializer.PostDeserializable;
import com.mxgraph.model.mxCell;

/**
 * Class representing Gliffy diagram object
 * 
 */
public class GliffyObject implements PostDeserializable
{
	private static Set<String> GRAPHICLESS_SHAPES = new HashSet<String>();

	private static Set<String> GROUP_SHAPES = new HashSet<String>();

	private static Set<String> MINDMAP_SHAPES = new HashSet<>();

	public float x;

	public float y;

	public int id;

	public float width;

	public float height;

	public float rotation;

	public String uid;

	public String tid;

	public String order;

	public boolean lockshape;

	public Graphic graphic;

	public List<GliffyObject> children;

	public Constraints constraints;

	public List<LinkMap> linkMap;

	public mxCell mxObject;// the mxCell this gliffy object got converted into

	public GliffyObject parent = null;

	static
	{
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.package");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.class");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.simple_class");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.object_timeline");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.lifeline");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.use_case");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.actor");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.use_case");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.self_message");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.message");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.activation");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.dependency");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.dependency");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.composition");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.aggregation");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v1.default.association");

		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.class.package");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.class.simple_class");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.class.class");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.class.class2");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.class.interface");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.class.enumeration");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.sequence.lifeline");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.sequence.boundary_lifeline");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.sequence.control_lifeline");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.sequence.entity_lifeline");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.deployment.package");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.component.package");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.uml.uml_v2.use_case.package");

		GRAPHICLESS_SHAPES.add("com.gliffy.shape.erd.erd_v1.default.entity_with_attributes");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.erd.erd_v1.default.entity_with_multiple_attributes");

		GRAPHICLESS_SHAPES.add("com.gliffy.shape.bpmn.bpmn_v1.data_artifacts.annotation");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.erd.erd_v1.default.entity_with_multiple_attributes");

		GRAPHICLESS_SHAPES.add("com.gliffy.shape.ui.ui_v3.navigation.navbar");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.ui.ui_v3.forms_controls.combo_box");

		GRAPHICLESS_SHAPES.add("com.gliffy.shape.ui.ui_v3.containers_content.tooltip_top");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.ui.ui_v3.containers_content.popover_bottom");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.ui.ui_v3.forms_controls.selector");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.ui.ui_v3.icon_symbols.annotate_left");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.ui.ui_v3.icon_symbols.annotate_right");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.ui.ui_v3.icon_symbols.annotate_top");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.ui.ui_v3.containers_content.popover_top");

		GRAPHICLESS_SHAPES.add("com.gliffy.shape.sitemap.sitemap_v2.page");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.sitemap.sitemap_v2.home");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.sitemap.sitemap_v2.gliffy");
		GRAPHICLESS_SHAPES.add("com.gliffy.shape.sitemap.sitemap_v2.form");

		/*GRAPHICLESS_SHAPES.add("com.gliffy.shape.sitemap.sitemap_v2.page");
		*/

		GROUP_SHAPES.add("com.gliffy.shape.basic.basic_v1.default.group");

		MINDMAP_SHAPES.add("com.gliffy.shape.mindmap.mindmap_v1.default.main_topic");
		MINDMAP_SHAPES.add("com.gliffy.shape.mindmap.mindmap_v1.default.subtopic");
		MINDMAP_SHAPES.add("com.gliffy.shape.mindmap.mindmap_v1.default.child_node");

	}

	public GliffyObject()
	{
	}

	public Graphic getGraphic()
	{
		if (graphic != null)
			return graphic;
		else if (isUml() || GRAPHICLESS_SHAPES.contains(uid))
			return getFirstChildGraphic();
		else
			return null;
	}

	public mxCell getMxObject()
	{
		return mxObject;
	}

	/**
	 * Returns the object that represents the caption for this object
	 * 
	 * @return
	 */
	public GliffyObject getTextObject()
	{

		if (isText())
		{
			return this;
		}
		if (children == null)
		{
			return null;
		}

		for (GliffyObject child : children)
		{
			if (child.getGraphic() != null && child.getGraphic().getType().equals(Graphic.Type.TEXT))
			{
				return child;
			}
			else
			{
				GliffyObject txtObj = child.getTextObject();
				
				if (txtObj != null)
					return txtObj;
			}
		}

		return null;
	}

	public String getText()
	{
		return graphic.getText().getHtml();
	}

	public String getLink()
	{
		if (linkMap != null && !linkMap.isEmpty())
			return linkMap.get(0).url;

		return null;
	}

	/**
	 * Some shapes like UML package, class and interface do not have a graphic object but instead rely on graphic of their children.
	 * In that case, graphic is the same for all children
	 * @return graphic of the first child or null of there are no children
	 */
	public Graphic getFirstChildGraphic()
	{
		return children.size() > 0 ? children.get(0).graphic : null;
	}

	public boolean isGroup()
	{
		return uid != null && GROUP_SHAPES.contains(uid);
	}

	public boolean isMindmap()
	{
		return uid != null && MINDMAP_SHAPES.contains(uid);
	}

	public boolean isLine()
	{
		return graphic != null && graphic.getType().equals(Graphic.Type.LINE);
	}

	private boolean isUml()
	{
		return uid != null && (uid.startsWith("com.gliffy.shape.uml.uml"));
	}

	public boolean isShape()
	{
		if (graphic != null)
		{
			return graphic.getType().equals(Graphic.Type.SHAPE) || graphic.getType().equals(Graphic.Type.MINDMAP);
		}
		else
		{
			//some UML shapes do not have a graphic,instead their graphic type is determined by their first child
			Graphic g = getFirstChildGraphic();
			return g != null && g.getType().equals(Graphic.Type.SHAPE);
		}
	}

	public boolean isSvg()
	{
		return graphic != null && graphic.type.equals(Graphic.Type.SVG);
	}

	public boolean isSwimlane()
	{
		return uid != null && uid.contains("com.gliffy.shape.swimlanes");
	}

	public boolean isText()
	{
		return graphic != null && graphic.getType().equals(Graphic.Type.TEXT);
	}

	public boolean isImage()
	{
		return graphic != null && graphic.getType().equals(Graphic.Type.IMAGE);
	}

	public boolean isVennCircle()
	{
		return uid != null && uid.startsWith("com.gliffy.shape.venn");
	}

	public String getGradientColor()
	{
		String gradientColor = "#FFFFFF";

		// Gradient colors are lighter version of the fill color except for radial
		// venn shapes, where white is used with a radial gradient (we use linear)
		if (graphic != null && graphic.Shape != null && uid != null && !uid.startsWith("com.gliffy.shape.radial"))
		{
			String hex = graphic.Shape.fillColor;

			if (hex != null && hex.length() == 7 && hex.charAt(0) == '#')
			{
				long clr = Long.parseLong(hex.substring(1), 16);

				long r = Math.min(0xFF0000, ((clr & 0xFF0000) + 0xAA0000)) & 0xFF0000;
				long g = Math.min(0x00FF00, ((clr & 0x00FF00) + 0x00AA00)) & 0x00FF00;
				long b = Math.min(0x0000FF, ((clr & 0x0000FF) + 0x0000AA)) & 0x0000FF;

				gradientColor = String.format("#%06X", 0xFFFFFF & (r + g + b));
			}
		}

		return gradientColor;
	}

	/**
	 * LATER: Add more cases where gradient is ignored.
	 */
	public boolean isGradientIgnored()
	{
		return uid != null && (uid.startsWith("com.gliffy.shape.venn.outline") || uid.startsWith("com.gliffy.shape.venn.flat"));
	}

	/**
	 * Returns a boolean indicating if this object is a subroutine 
	 * @return true if subroutine, false otherwise
	 */
	public boolean isSubRoutine()
	{
		return uid.equals("com.gliffy.shape.flowchart.flowchart_v1.default.subroutine");
	}

	public boolean isUnrecognizedGraphicType()
	{
		return graphic != null && graphic.type == null;
	}

	public Constraints getConstraints()
	{
		return constraints;
	}

	public boolean hasChildren()
	{
		return children != null && children.size() > 0;
	}

	@Override
	public String toString()
	{
		return uid != null ? uid : tid;
	}

	@Override
	public void postDeserialize()
	{
		if (isGroup())
			normalizeChildrenCoordinates();
	}

	/**
	 * Some Gliffy diagrams have groups whose children have negative coordinates.
	 * This is a problem in draw.io as they get set to 0.
	 * This method expands the groups left and up and adjusts children's coordinates so that they are never less than zero.
	 */
	private void normalizeChildrenCoordinates()
	{
		//sorts the list to find the leftmost child and it's X
		Comparator<GliffyObject> cx = new Comparator<GliffyObject>()
		{
			@Override
			public int compare(GliffyObject o1, GliffyObject o2)
			{
				return (int) (o1.x - o2.x);
			}
		};

		Collections.sort(children, cx);
		float xMin = children.get(0).x;

		if (xMin < 0)
		{
			width += -xMin; //increase width
			x += xMin;

			for (GliffyObject child : children) //increase x 
				child.x += -xMin;
		}

		//sorts the list to find the uppermost child and it's Y
		Comparator<GliffyObject> cy = new Comparator<GliffyObject>()
		{
			@Override
			public int compare(GliffyObject o1, GliffyObject o2)
			{
				return (int) (o1.y - o2.y);
			}
		};

		Collections.sort(children, cy);
		float yMin = children.get(0).y;

		if (yMin < 0)
		{
			height += -yMin; //increase height
			y += yMin;

			for (GliffyObject child : children) //increase y 
				child.y += -yMin;
		}
	}
}
