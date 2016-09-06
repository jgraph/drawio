package com.mxgraph.io.gliffy.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.mxgraph.model.mxCell;

/**
 * Class representing Gliffy diagram object
 * 
 */
public class Object
{
	public static String SWIMLANE = "com.gliffy.shape.swimlanes.swimlanes_v1.default";

	public static String V_SWIMLANE = "com.gliffy.shape.swimlanes.swimlanes_v1.default.vertical";

	public static String H_SWIMLANE = "com.gliffy.shape.swimlanes.swimlanes_v1.default.horizontal";

	public static String H_SINGLE_SWIMLANE = "com.gliffy.shape.swimlanes.swimlanes_v1.default.horizontal_single_lane_pool";

	public static String V_SINGLE_SWIMLANE = "com.gliffy.shape.swimlanes.swimlanes_v1.default.vertical_single_lane_pool";

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

	public List<Object> children;

	public Constraints constraints;
	
	public List<LinkMap> linkMap;

	public mxCell mxObject;// the mxCell this gliffy object got converted into

	public Object parent = null;

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

	public Object()
	{
	}

	public Graphic getGraphic()
	{
		if(graphic != null)
			return graphic;
		else if(isUml() || GRAPHICLESS_SHAPES.contains(uid))
			return getFirstChildGraphic();
		else return null;
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
	public Object getTextObject()
	{

		if (isText())
		{
			return this;
		}
		if (children == null)
		{
			return null;
		}

		for (Object child : children)
		{
			if (child.getGraphic() != null && child.getGraphic().getType().equals(Graphic.Type.TEXT))
			{
				return child;
			}
			else
			{
				return child.getTextObject();
			}
		}

		return null;
	}

	public String getTextRecursively()
	{
		StringBuilder sb = new StringBuilder();

		List<Object> textObjs = new ArrayList<Object>();
		getTextObjects(this, textObjs);

		Iterator<Object> it = textObjs.iterator();

		while (it.hasNext())
		{
			Object to = it.next();
			sb.append(to.graphic.getText().getHtml());
			if (it.hasNext())
				sb.append("<hr>");
		}

		return sb.toString();
	}

	public String getText()
	{
		if (isText())
			return graphic.getText().getHtml();

		Object to = getTextObject();

		return to != null ? to.graphic.getText().getHtml() : null;

	}

	private void getTextObjects(Object obj, List<Object> objects)
	{
		if (obj.isText())
			objects.add(obj);
		else if (obj.children != null)
		{
			for (Object ob : obj.children)
			{
				getTextObjects(ob, objects);
			}
		}
	}
	
	public String getLink() 
	{
		if(linkMap != null && !linkMap.isEmpty()) 
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
			return  g != null && g.getType().equals(Graphic.Type.SHAPE);
		}

	}

	public boolean isSvg()
	{
		return graphic != null && graphic.type.equals(Graphic.Type.SVG);
	}

	public boolean isSwimlane()
	{
		return uid != null && uid.contains(SWIMLANE);
	}

	public boolean isText()
	{
		return graphic != null && graphic.getType().equals(Graphic.Type.TEXT);
	}

	public boolean isImage()
	{
		return graphic != null && graphic.getType().equals(Graphic.Type.IMAGE);
	}

	public boolean isVennsCircle()
	{
		return uid != null && uid.contains("com.gliffy.shape.venn");
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
}
