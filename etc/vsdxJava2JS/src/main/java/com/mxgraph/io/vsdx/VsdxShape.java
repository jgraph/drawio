/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import java.util.zip.Deflater;

import javax.xml.parsers.DocumentBuilder;

//import org.apache.commons.codec.binary.Base64;
//import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.mxgraph.io.mxGraph;
import com.mxgraph.io.mxVsdxCodec;
import com.mxgraph.io.vsdx.theme.Color;
import com.mxgraph.io.vsdx.theme.QuickStyleVals;
import com.mxgraph.online.Utils;
import com.mxgraph.util.mxConstants;

/**
 * This class is a wrapper for one Shape Element.<br/>
 * This class is responsible for retrieve all the properties of the shape and add it
 * to the graph. If a property is not found in the shape element but it is an instance
 * of a Master, the property is taken from the masterShape element. If the property
 * is not found neither in the masterShape , and it has a reference to a stylesheet
 * the property is taken from there.
 */
public class VsdxShape extends Shape
{
	private static final String ARROW_NO_FILL_MARKER = "0";

	/**
	 * Number of d.p. to round non-integers to
	 */
	static public int maxDp = 2;

	// For debugging to switch off shape matching by name
	static public boolean USE_SHAPE_MATCH = true;

	/**
	 * Whether or not to assume HTML labels
	 */
	public boolean htmlLabels = true;

	/**
	 * Master Shape referenced by the shape.
	 */
	protected Shape masterShape;

	/**
	 * Master element referenced by the shape.
	 */
	protected mxVsdxMaster master;

	/**
	 * If the shape is a sub shape, this is a reference to its root shape, otherwise null
	 */
	protected VsdxShape rootShape = this;

	public double parentHeight;

	/**
	 * The prefix of the shape name
	 */
	protected String shapeName = null;

	/**
	 * Shape index
	 */
	protected int shapeIndex = 0;

	/**
	 * Whether this cell is a vertex
	 */
	protected boolean vertex = true;

	protected Map<Integer, VsdxShape> childShapes = new HashMap<Integer, VsdxShape>();

	public static final Set<String> OFFSET_ARRAY = new HashSet<String>(
			Arrays.asList(new String[] { "Organizational unit", "Domain 3D" }));

	public static final String stencilTemplate = "<shape h=\"htemplate\" w=\"wtemplate\" aspect=\"variable\" strokewidth=\"inherit\"><connections></connections><background></background><foreground></foreground></shape>";

	public static final float[] arrowSizes = { 2, 3, 5, 7, 9, 22, 45 };

	public static final Map<Integer, String> arrowTypes;

	static
	{
//		try
//		{
//			mxResources.add("com/mxgraph/io/vdx/resources/edgeNameU");
//			mxResources.add("com/mxgraph/io/vdx/resources/nameU");
//		}
//		catch (Exception e)
//		{
//			// todo
//		}

		arrowTypes = new HashMap<Integer, String>();
		arrowTypes.put(0, mxConstants.NONE);
		arrowTypes.put(1, mxConstants.ARROW_OPEN);
		arrowTypes.put(2, "blockThin");
		arrowTypes.put(3, mxConstants.ARROW_OPEN);
		arrowTypes.put(4, mxConstants.ARROW_BLOCK);
		arrowTypes.put(5, mxConstants.ARROW_CLASSIC);
		arrowTypes.put(10, mxConstants.ARROW_OVAL);
		arrowTypes.put(13, mxConstants.ARROW_BLOCK);

		arrowTypes.put(14, ARROW_NO_FILL_MARKER + mxConstants.ARROW_BLOCK);
		arrowTypes.put(17, ARROW_NO_FILL_MARKER + mxConstants.ARROW_CLASSIC);
		arrowTypes.put(20, ARROW_NO_FILL_MARKER + mxConstants.ARROW_OVAL);
		arrowTypes.put(22, ARROW_NO_FILL_MARKER + "diamond");

		arrowTypes.put(23, "dash");
		arrowTypes.put(24, "ERone");
		arrowTypes.put(25, "ERmandOne");
		arrowTypes.put(27, "ERmany");
		arrowTypes.put(28, "ERoneToMany");
		arrowTypes.put(29, "ERzeroToMany");
		arrowTypes.put(30, "ERzeroToOne");

		//approximations
		arrowTypes.put(6, mxConstants.ARROW_BLOCK);
		arrowTypes.put(7, mxConstants.ARROW_OPEN);
		arrowTypes.put(8, mxConstants.ARROW_CLASSIC);

		arrowTypes.put(9, "openAsync");
		arrowTypes.put(11, "diamond");

		arrowTypes.put(12, mxConstants.ARROW_OPEN);

		arrowTypes.put(15, ARROW_NO_FILL_MARKER + mxConstants.ARROW_BLOCK);
		arrowTypes.put(16, ARROW_NO_FILL_MARKER + mxConstants.ARROW_BLOCK);
		arrowTypes.put(18, ARROW_NO_FILL_MARKER + mxConstants.ARROW_BLOCK);
		arrowTypes.put(19, ARROW_NO_FILL_MARKER + mxConstants.ARROW_CLASSIC);
		arrowTypes.put(21, ARROW_NO_FILL_MARKER + "diamond");
		arrowTypes.put(26, "ERmandOne");

		arrowTypes.put(31, ARROW_NO_FILL_MARKER + mxConstants.ARROW_OVAL);
		arrowTypes.put(32, ARROW_NO_FILL_MARKER + mxConstants.ARROW_OVAL);
		arrowTypes.put(33, ARROW_NO_FILL_MARKER + mxConstants.ARROW_OVAL);
		arrowTypes.put(34, ARROW_NO_FILL_MARKER + mxConstants.ARROW_OVAL);

		arrowTypes.put(35, mxConstants.ARROW_OVAL);
		arrowTypes.put(36, mxConstants.ARROW_OVAL);
		arrowTypes.put(37, mxConstants.ARROW_OVAL);
		arrowTypes.put(38, mxConstants.ARROW_OVAL);

		arrowTypes.put(39, mxConstants.ARROW_BLOCK);
		arrowTypes.put(40, ARROW_NO_FILL_MARKER + mxConstants.ARROW_BLOCK);

		arrowTypes.put(41, ARROW_NO_FILL_MARKER + mxConstants.ARROW_OVAL);
		arrowTypes.put(42, mxConstants.ARROW_OVAL);

		arrowTypes.put(43, mxConstants.ARROW_OPEN);
		arrowTypes.put(44, mxConstants.ARROW_OPEN);
		arrowTypes.put(45, mxConstants.ARROW_OPEN);
	}

	private final static Logger LOGGER = Logger
			.getLogger(VsdxShape.class.getName());

	/**
	 * Create a new instance of mxVdxShape.
	 * This method get the references to the master element, master shape
	 * and stylesheet.
	 * @param shape
	 */
	public VsdxShape(mxVsdxPage page, Element shape, boolean vertex,
			Map<String, mxVsdxMaster> masters, mxVsdxMaster master,
			mxVsdxModel model)
	{
		super(shape, model);

		String masterId = this.getMasterId();
		String masterShapeLocal = this.getShapeMasterId();

		if (masterId != null)
		{
			this.master = masters.get(masterId);
		}
		else
		{
			this.master = master;
		}

		if (this.master != null)
		{
			// Check if the master ID corresponds to the one passed in. If it doesn't, or doesn't
			// exist on this shape, this shape is within a group that has that master

			if (masterId == null && masterShapeLocal != null)
			{
				this.masterShape = this.master.getSubShape(masterShapeLocal);
			}
			else
			{
				this.masterShape = this.master.getMasterShape();
			}
		}

		String name = getNameU();
		int index = name.lastIndexOf(".");

		if (index != -1)
		{
			name = name.substring(0, index);
		}

		this.shapeName = name;

		// Get sub-shapes
		NodeList shapesList = shape
				.getElementsByTagName(mxVsdxConstants.SHAPES);

		if (shapesList != null && shapesList.getLength() > 0)
		{
			Element shapesElement = (Element) shapesList.item(0);
			this.childShapes = page.parseShapes(shapesElement, this.master,
					false);
		}

		double rotation = this.calcRotation();
		this.rotation = rotation * 100 / 100;
		this.rotation = this.rotation % 360.0;

		int themeIndex = page.getCellIntValue("ThemeIndex", -100);

		//sometimes theme information are at the shape level!
		if (themeIndex == -100)
		{
			themeIndex = Integer.parseInt(
					this.getValue(this.getCellElement("ThemeIndex"), "0"));
		}

		mxVsdxTheme theme = model.getThemes().get(themeIndex);
		int variant = page.getCellIntValue("VariationColorIndex", 0);

		setThemeAndVariant(theme, variant);

		for (Map.Entry<Integer, VsdxShape> entry : childShapes.entrySet())
		{
			VsdxShape childShape = entry.getValue();
			childShape.setRootShape(this);

			if (childShape.theme == null)
			{
				childShape.setThemeAndVariant(theme, variant);
			}
		}

		quickStyleVals = new QuickStyleVals(
				Integer.parseInt(this.getValue(
						this.getCellElement("QuickStyleEffectsMatrix"), "0")),
				Integer.parseInt(this.getValue(
						this.getCellElement("QuickStyleFillColor"), "1")),
				Integer.parseInt(this.getValue(
						this.getCellElement("QuickStyleFillMatrix"), "0")),
				Integer.parseInt(this.getValue(
						this.getCellElement("QuickStyleFontColor"), "1")),
				Integer.parseInt(this.getValue(
						this.getCellElement("QuickStyleFontMatrix"), "0")),
				Integer.parseInt(this.getValue(
						this.getCellElement("QuickStyleLineColor"), "1")),
				Integer.parseInt(this.getValue(
						this.getCellElement("QuickStyleLineMatrix"), "0")),
				Integer.parseInt(this.getValue(
						this.getCellElement("QuickStyleShadowColor"), "1")),
				Integer.parseInt(this
						.getValue(this.getCellElement("QuickStyleType"), "0")),
				Integer.parseInt(this.getValue(
						this.getCellElement("QuickStyleVariation"), "0")));

		//process shape geometry
		if (masterShape != null)
		{
			masterShape.processGeomList(null);
			processGeomList(masterShape.getGeomList());

			//recalculate width and height using master data
			if (this.width == 0)
				this.width = getScreenNumericalValue(
						getCellElement(mxVsdxConstants.WIDTH), 0);

			if (this.height == 0)
				this.height = getScreenNumericalValue(
						getCellElement(mxVsdxConstants.HEIGHT), 0);
		}
		else
		{
			processGeomList(null);
		}
		//several shapes have beginX/Y and also has a fill color, thus it is better to render it as a vertex
		//vsdx can have an edge as a group!
		this.vertex = vertex || (childShapes != null && !childShapes.isEmpty())
				|| (geomList != null && !geomList.isNoFill());
	}

	/**
	 * Locates the first entry for the specified attribute string in the shape hierarchy.
	 * The order is to look locally, then delegate the request to the master shape
	 * if it doesn't exist locally
	 * @param key The key of the shape to find
	 * @return the Element that first resolves to that shape key or null or none is found
	 */
	public Element getShapeNode(String key)
	{
		Element elem = this.cellElements.get(key);

		if (elem == null && this.masterShape != null)
		{
			return this.masterShape.getCellElement(key);
		}

		return elem;
	}

	/**
	 * Returns the value of the Text element.<br/>
	 * If the shape has no text, it is obtained from the master shape.
	 * @return Text label of the shape.
	 */
	public String getTextLabel()
	{
		String hideText = this
				.getValue(this.getCellElement(mxVsdxConstants.HIDE_TEXT), "0");

		if ("1".equals(hideText))
		{
			return null;
		}

		NodeList txtChildren = getTextChildren();

		if (txtChildren == null && masterShape != null)
		{
			txtChildren = masterShape.getTextChildren();
		}

		if (this.htmlLabels)
		{
			if (txtChildren != null)
			{
				// Collect text into same formatting paragraphs. If there's one paragraph, use the new system, otherwise
				// leave it to the old one.
				//				if (this.paragraphs == null)
				//				{
				//					initLabels(txtChildren);
				//				}
				//				
				//				if (this.paragraphs.size() == 0)
				//				{
				//					// valid way to have an empty label override a master value "<text />"
				//					return "";
				//				}
				//				else if (this.paragraphs.size() == 1)
				//				{
				//					return createHybridLabel(this.paragraphs.keySet().iterator().next());
				//				}
				//				else
				//				{
				//Sometimes one paragraph also contains mix of styles which are not supported by hybrid labels, so, use the old style for all html labels
				this.styleMap.put(mxConstants.STYLE_VERTICAL_ALIGN,
						getAlignVertical());
				this.styleMap.put(mxConstants.STYLE_ALIGN,
						getHorizontalAlign("0", false));

				return getHtmlTextContent(txtChildren);
				//				}
			}
		}
		else
		{
			String text = this.getText();

			if (text == null && masterShape != null)
			{
				return masterShape.getText();
			}
			else
			{
				return text;
			}
		}

		return null;
	}

	private String getIndex(Element elem)
	{
		String ix = elem.getAttribute("IX");
		return ix.isEmpty()? "0" : ix;
	}
	
	/**
	 * Initialises the text labels
	 * @param children the text Elements
	 */
	protected void initLabels(NodeList children)
	{
		// Lazy init
		paragraphs = new LinkedHashMap<String, Paragraph>();
		String ch = null;
		String pg = null;
		String fld = null;

		for (int index = 0; index < children.getLength(); index++)
		{
			String value = null;
			Node node = children.item(index);
			String nodeName = node.getNodeName();

			switch (nodeName)
			{
				case "cp":
				{
					Element elem = (Element) node;
					ch = getIndex(elem);
				}
					break;
				case "tp":
				{
					// TODO
					Element elem = (Element) node;
					getIndex(elem);
				}
					break;
				case "pp":
				{
					Element elem = (Element) node;
					pg = getIndex(elem);
				}
					break;
				case "fld":
				{
					Element elem = (Element) node;
					fld = getIndex(elem);
					break;
				}
				case "#text":
				{
					value = node.getTextContent();//StringUtils.chomp(node.getTextContent());

					// Assumes text is always last
					// null key is allowed
					Paragraph para = paragraphs.get(pg);

					if (para == null)
					{
						para = new Paragraph(value, ch, pg, fld);
						paragraphs.put(pg, para);
					}
					else
					{
						para.addText(value, ch, fld);
					}
				}
			}
		}
	}

	/**
	 * 
	 * @param index
	 * @return
	 */
	protected String createHybridLabel(String index)
	{
		Paragraph para = this.paragraphs.get(index);

		// Paragraph
		this.styleMap.put(mxConstants.STYLE_ALIGN,
				getHorizontalAlign(index, false));
		this.styleMap.put(mxConstants.STYLE_SPACING_LEFT, getIndentLeft(index));
		this.styleMap.put(mxConstants.STYLE_SPACING_RIGHT,
				getIndentRight(index));
		this.styleMap.put(mxConstants.STYLE_SPACING_TOP, getSpBefore(index));
		this.styleMap.put(mxConstants.STYLE_SPACING_BOTTOM, getSpAfter(index));
		//this.styleMap.put("text-indent", getIndentFirst(index));
		this.styleMap.put(mxConstants.STYLE_VERTICAL_ALIGN, getAlignVertical());

		this.styleMap.put("fontColor", getTextColor(index));
		this.styleMap.put("fontSize", this.getTextSize(index));
		this.styleMap.put("fontFamily", getTextFont(index));

		// Character
		int fontStyle = isBold(index) ? mxConstants.FONT_BOLD : 0;
		fontStyle |= isItalic(index) ? mxConstants.FONT_ITALIC : 0;
		fontStyle |= isUnderline(index) ? mxConstants.FONT_UNDERLINE : 0;
		this.styleMap.put("fontStyle", String.valueOf(fontStyle));

		//Commented out as the method getTextOpacity returns value between 0 and 1 instead of 0 - 100
		//		this.styleMap.put(mxConstants.STYLE_TEXT_OPACITY, getTextOpacity(index));

		int numValues = para.numValues();
		String result = null;

		for (int i = 0; i < numValues; i++)
		{
			String value = para.getValue(i);

			if (value.isEmpty() && this.fields != null)
			{
				String fieldIx = para.getField(i);

				if (fieldIx != null)
				{
					value = this.fields.get(fieldIx);

					if (value == null && masterShape != null
							&& masterShape.fields != null)
					{
						value = masterShape.fields.get(fieldIx);
					}
				}
			}

			if (value != null)
			{
				result = result == null ? value : result + value;
			}
		}

		return result;
	}

	/**
	 * Returns the text contained in the shape formated with tags html.<br/>
	 * @return Text content in html.
	 */
	public String getHtmlTextContent(NodeList txtChildren)
	{
		String ret = "";
		boolean first = true;

		if (txtChildren != null && txtChildren.getLength() > 0)
		{
			for (int index = 0; index < txtChildren.getLength(); index++)
			{
				Node node = txtChildren.item(index);

				if (node.getNodeName().equals("cp"))
				{
					Element elem = (Element) node;
					cp = getIndex(elem);
				}
				else if (node.getNodeName().equals("tp"))
				{
					Element elem = (Element) node;
					tp = getIndex(elem);
				}
				else if (node.getNodeName().equals("pp"))
				{
					Element elem = (Element) node;
					pp = getIndex(elem);

					if (first)
					{
						first = false;
					}
					else
					{
						ret += "</p>";
					}

					String para = "<p>";
					ret += getTextParagraphFormated(para);
				}
				else if (node.getNodeName().equals("fld"))
				{
					Element elem = (Element) node;
					fld = getIndex(elem);

					String text = null;

					if (this.fields != null)
					{
						text = this.fields.get(fld);
					}

					if (text == null && masterShape != null
							&& masterShape.fields != null)
					{
						text = masterShape.fields.get(fld);
					}

					if (text != null)
						ret += processLblTxt(text);
				}
				else if (node.getNodeName().equals("#text"))
				{
					String text = node.getTextContent();

					// There's a case in master shapes where the text element has the raw value "N".
					// The source tool doesn't render this. Example is ALM_Information_flow.vdx, the two label
					// edges in the center
					//					if (!masterShapeOnly || !text.equals("N"))
					//					{
					ret += processLblTxt(text);
					//					}
				}
			}
		}

		String end = first ? "" : "</p>";
		ret += end;
		mxVsdxUtils.surroundByTags(ret, "div");

		return ret;
	}

	private String processLblTxt(String text)
	{
		// It's HTML text, so escape it.
		text = mxVsdxUtils.htmlEntities(text);

		text = textToList(text, pp);

		text = text.replaceAll("\n", "<br/>").replaceAll(UNICODE_LINE_SEP,
				"<br/>");

		return getTextCharFormated(text);
	}

	/**
	 * Checks if a nameU is for big connectors.
	 * @param nameU NameU attribute.
	 * @return Returns <code>true</code> if a nameU is for big connectors.
	 */
	public boolean isConnectorBigNameU(String nameU)
	{
		return nameU.startsWith("60 degree single")
				|| nameU.startsWith("45 degree single")
				|| nameU.startsWith("45 degree double")
				|| nameU.startsWith("60 degree double")
				|| nameU.startsWith("45 degree  tail")
				|| nameU.startsWith("60 degree  tail")
				|| nameU.startsWith("45 degree tail")
				|| nameU.startsWith("60 degree tail")
				|| nameU.startsWith("Flexi-arrow 2")
				|| nameU.startsWith("Flexi-arrow 1")
				|| nameU.startsWith("Flexi-arrow 3")
				|| nameU.startsWith("Double flexi-arrow")
				|| nameU.startsWith("Fancy arrow");
	}

	/**
	 * Checks if the shape represents a vertex.
	 * @return Returns <code>true</code> if the shape represents a vertex.
	 */
	public boolean isVertex()
	{
		return vertex;
	}

	/**
	 * Returns the coordinates of the top left corner of the Shape.
	 * When a coordinate is not found, it is taken from masterShape.
	 * @param parentHeight Height of the parent cell of the shape.
	 * @param rotation whether to allow for cell rotation
	 * @return mxPoint that represents the coordinates
	 */
	public mxPoint getOriginPoint(double parentHeight, boolean rotation)
	{
		double px = this.getPinX();
		double py = this.getPinY();
		double lpy = this.getLocPinY();
		double lpx = this.getLocPinX();

		double w = getScreenNumericalValue(
				this.getShapeNode(mxVsdxConstants.WIDTH), 0);
		double h = getScreenNumericalValue(
				this.getShapeNode(mxVsdxConstants.HEIGHT), 0);

		double x = px - lpx;
		double y = parentHeight - ((py) + (h - lpy));

		// If the location pins are not in the center of the vertex we
		// need to translate the origin
		if (rotation && (lpy != h / 2 || lpx != w / 2))
		{
			if (this.rotation != 0)
			{
				double vecX = w / 2 - lpx;
				double vecY = lpy - h / 2;

				double cos = Math.cos(Math.toRadians(360 - this.rotation));
				double sin = Math.sin(Math.toRadians(360 - this.rotation));

				return new mxPoint(x + vecX - (vecX * cos - vecY * sin),
						(vecX * sin + vecY * cos) + y - vecY);
			}
		}

		return new mxPoint(x, y);
	}

	/**
	 * Returns the width and height of the Shape expressed like an mxPoint.<br/>
	 * x = width<br/>
	 * y = height<br/>
	 * When a dimension is not found, it is taken from masterShape.
	 * @return mxPoint that represents the dimensions of the shape.
	 */
	public mxPoint getDimensions()
	{
		double w = getScreenNumericalValue(
				this.getShapeNode(mxVsdxConstants.WIDTH), 0);
		double h = getScreenNumericalValue(
				this.getShapeNode(mxVsdxConstants.HEIGHT), 0);

		//some shapes has zero height/width while the other dimension is non-zero. Setting it to 1 fixed it.
		return new mxPoint(w == 0 && h > 0 ? 1 : w, h == 0 && w > 0 ? 1 : h);
	}

	/**
	 * Returns the value of the pinX element.
	 * @return The shape pinX element
	 */
	public double getPinX()
	{
		return getScreenNumericalValue(this.getShapeNode(mxVsdxConstants.PIN_X),
				0);
	}

	/**
	 * Returns the value of the pinY element in pixels.
	 * @return Numerical value of the pinY element.
	 */
	public double getPinY()
	{
		return getScreenNumericalValue(this.getShapeNode(mxVsdxConstants.PIN_Y),
				0);
	}

	/**
	 * Returns the value of the locPinX element in pixels.
	 * @return Numerical value of the pinY element.
	 */
	public double getLocPinX()
	{
		return getScreenNumericalValue(
				this.getShapeNode(mxVsdxConstants.LOC_PIN_X), 0);
	}

	/**
	 * Returns the value of the locPinY element in pixels.
	 * @return Numerical value of the locPinY element.
	 */
	public double getLocPinY()
	{
		return getScreenNumericalValue(
				this.getShapeNode(mxVsdxConstants.LOC_PIN_Y), 0);

	}

	/**
	 * Returns the opacity of the Shape.<br/>
	 * @return Double in the range of (transparent = 0)..(100 = opaque)
	 */
	private double getOpacity(String key)
	{
		double opacity = 100;

		if (this.isGroup())
		{
			opacity = 0;
		}

		opacity = getValueAsDouble(this.getCellElement(key), 0);

		opacity = 100 - opacity * 100;
		opacity = Math.max(opacity, 0);
		opacity = Math.min(opacity, 100);

		return opacity;
	}

	/**
	 * Returns the background color for apply in the gradient.<br/>
	 * If no gradient must be applicated, returns an empty string.
	 * @return hexadecimal representation of the color.
	 */
	private String getGradient()
	{
		String fillGradientEnabled = this.getValue(this.getCellElement(mxVsdxConstants.FILL_GRADIENT_ENABLED), "0");
		
		if ("1".equals(fillGradientEnabled))
		{
			Section fillGradient = sections.get("FillGradient");
			
			if (fillGradient != null)
			{
				//find the last row. We approximate gradients with first and last color
				ArrayList<Element> rows = mxVsdxUtils.getDirectChildNamedElements(fillGradient.elem, "Row");
				
				String color = this.getColor(fillGradient.getIndexedCell(rows.get(rows.size() - 1).getAttribute("IX"), "GradientStopColor"));
				
				if (color != null && !color.isEmpty()) return color;
			}
		}

		String gradient = "";
		String fillPattern = this.getValue(
				this.getCellElement(mxVsdxConstants.FILL_PATTERN), "0");

		//		if (fillPattern.equals("25") || fillPattern.equals("27") || fillPattern.equals("28") || fillPattern.equals("30"))
		//approximate all gradients of vsdx with mxGraph one
		if (Integer.parseInt(fillPattern) >= 25)
		{
			gradient = this
					.getColor(this.getCellElement(mxVsdxConstants.FILL_BKGND));
		}
		else
		{
			mxVsdxTheme theme = getTheme();

			if (theme != null)
			{
				Color gradColor = theme
						.getFillGraientColor(getQuickStyleVals());
				if (gradColor != null)
					gradient = gradColor.toHexStr();
			}
		}

		return gradient;
	}

	/**
	 * Returns the direction of the gradient.<br/>
	 * If no gradient has to be applied, returns an empty string.
	 * @return Direction.(east, west, north or south)
	 */
	private String getGradientDirection()
	{
		String direction = "";
		String fillPattern = this.getValue(
				this.getCellElement(mxVsdxConstants.FILL_PATTERN), "0");

		if (fillPattern.equals("25"))
		{
			direction = mxConstants.DIRECTION_EAST;
		}
		else if (fillPattern.equals("27"))
		{
			direction = mxConstants.DIRECTION_WEST;
		}
		else if (fillPattern.equals("28"))
		{
			direction = mxConstants.DIRECTION_SOUTH;
		}
		else if (fillPattern.equals("30"))
		{
			direction = mxConstants.DIRECTION_NORTH;
		}

		return direction;
	}

	/**
	 * Returns the rotation of the shape.<br/>
	 * @return Rotation of the shape in degrees.
	 */
	public double calcRotation()
	{
		double rotation = Double.valueOf(
				this.getValue(this.getCellElement(mxVsdxConstants.ANGLE), "0"));

		rotation = Math.toDegrees(rotation);
		rotation = rotation % 360;
		rotation = rotation * 100 / 100;

		return 360 - rotation;
	}

	/**
	 * Used to pass in a parents rotation to the child
	 * @param parentRotation the rotation of the parent
	 */
	public void propagateRotation(double parentRotation)
	{
		this.rotation += parentRotation;
		this.rotation %= 360;
		this.rotation = this.rotation * 100 / 100;
	}

	/**
	 * Returns the top spacing of the label in pixels.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Top spacing in double precision.
	 */
	public double getTopSpacing()
	{
		double topMargin = this.getTextTopMargin();
		topMargin = (topMargin / 2 - 2.8) * 100 / 100;
		return topMargin;
	}

	/**
	 * Returns the bottom spacing of the label in pixels.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Bottom spacing in double precision.
	 */
	public double getBottomSpacing()
	{
		double bottomMargin = this.getTextBottomMargin();
		bottomMargin = (bottomMargin / 2 - 2.8) * 100 / 100;
		return bottomMargin;
	}

	/**
	 * Returns the left spacing of the label in pixels.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Left spacing in double precision.
	 */
	public double getLeftSpacing()
	{
		double leftMargin = this.getTextLeftMargin();
		leftMargin = (leftMargin / 2 - 2.8) * 100 / 100;
		return leftMargin;
	}

	/**
	 * Returns the right spacing of the label in pixels.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Right spacing in double precision.
	 */
	public double getRightSpacing()
	{
		double rightMargin = this.getTextRightMargin();
		rightMargin = (rightMargin / 2 - 2.8) * 100 / 100;
		return rightMargin;
	}

	/**
	 * Checks if the label must be rotated.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Returns <code>true<code/> if the label should remain horizontal.
	 */
	public boolean getLabelRotation()
	{
		boolean hor = true;
		//Defines rotation.
		double rotation = this.calcRotation();
		double angle = Double.valueOf(this
				.getValue(this.getCellElement(mxVsdxConstants.TXT_ANGLE), "0"));

		angle = Math.toDegrees(angle);
		angle = angle - rotation;

		if (!(Math.abs(angle) < 45 || Math.abs(angle) > 270))
		{
			hor = false;
		}

		return hor;
	}

	/**
	 * Analyzes the shape and returns a string with the style.
	 * @return style read from the shape.
	 */
	public Map<String, String> getStyleFromShape()
	{
		styleMap.put(mxVsdxConstants.VSDX_ID, this.getId().toString());

		// Rotation.		
		//		String labelRotation = getLabelRotation() ? "1" : "0";
		this.rotation = Math.round(this.rotation);

		//It gives wrong results, may be it is needed in other scenarios
		//		if (!labelRotation.equals("1") && this.rotation != 90 && this.rotation != 270)
		//		{
		//			styleMap.put(mxConstants.STYLE_HORIZONTAL, labelRotation);
		//		}

		if (this.rotation != 0)
		{
			styleMap.put(mxConstants.STYLE_ROTATION,
					Double.toString(this.rotation));
		}

		// Fill color
		String fillcolor = getFillColor();

		if (!fillcolor.equals(""))
		{
			styleMap.put(mxConstants.STYLE_FILLCOLOR, fillcolor);
		}
		else
		{
			styleMap.put(mxConstants.STYLE_FILLCOLOR, "none");
		}

		Integer id = this.getId();

		this.styleDebug("ID = " + id + " , Fill Color = " + fillcolor);

		//Defines gradient
		String gradient = getGradient();

		if (!gradient.equals(""))
		{
			styleMap.put(mxConstants.STYLE_GRADIENTCOLOR, gradient);
			String gradientDirection = getGradientDirection();

			if (!gradientDirection.equals("")
					&& !gradientDirection.equals(mxConstants.DIRECTION_SOUTH))
			{
				styleMap.put(mxConstants.STYLE_GRADIENT_DIRECTION,
						gradientDirection);
			}
		}
		else
		{
			styleMap.put(mxConstants.STYLE_GRADIENTCOLOR, "none");
		}

		double opacity = this.getOpacity(mxVsdxConstants.FILL_FOREGND_TRANS);

		if (opacity < 100)
		{
			styleMap.put(mxConstants.STYLE_FILL_OPACITY,
					Double.toString(opacity));
		}

		opacity = this.getOpacity(mxVsdxConstants.LINE_COLOR_TRANS);

		if (opacity < 100)
		{
			styleMap.put(mxConstants.STYLE_STROKE_OPACITY,
					Double.toString(opacity));
		}

		Map<String, String> form = getForm();

		if (form.containsKey(mxConstants.STYLE_SHAPE)
				&& (form.get(mxConstants.STYLE_SHAPE).startsWith("image;")))
		{
			styleMap.put(mxConstants.STYLE_WHITE_SPACE, "wrap");
		}

		styleMap.putAll(form);

		//Defines line Pattern
		if (isDashed())
		{
			styleMap.put(mxConstants.STYLE_DASHED, "1");

			String dashPattern = getDashPattern();

			if (dashPattern != null)
			{
				styleMap.put(mxConstants.STYLE_DASH_PATTERN, dashPattern);
			}
		}

		String color = getStrokeColor();
		double tr = this.getStrokeTransparency();

		this.styleDebug("ID = " + id + " , Color = " + color
				+ " , stroke transparency = " + tr);

		if (!color.equals("") && tr != 1)
		{
			styleMap.put(mxConstants.STYLE_STROKECOLOR, color);
		}
		else
		{
			//styleMap.put(mxConstants.STYLE_STROKECOLOR, "none");
		}

		//Defines the line width
		int lWeight = (int) Math.round(getLineWidth());

		if (lWeight != 1)
		{
			styleMap.put(mxConstants.STYLE_STROKEWIDTH,
					Integer.toString(lWeight));
		}

		/** SHADOW **/
		if (isShadow())
		{
			styleMap.put(mxConstants.STYLE_SHADOW, mxVsdxConstants.TRUE);
		}

		//Defines label top spacing
		int topMargin = (int) Math.round(getTopSpacing());

		if (topMargin != 0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_TOP,
					Integer.toString(topMargin));
		}

		//Defines label bottom spacing
		int bottomMargin = (int) Math.round(getBottomSpacing());

		if (bottomMargin != 0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_BOTTOM,
					Integer.toString(bottomMargin));
		}

		//Defines label left spacing
		int leftMargin = (int) Math.round(getLeftSpacing());

		if (leftMargin != 0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_LEFT,
					Integer.toString(leftMargin));
		}

		//Defines label right spacing
		int rightMargin = (int) Math.round(getRightSpacing());

		if (rightMargin != 0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_RIGHT,
					Integer.toString(rightMargin));
		}

		String direction = getDirection(form);

		if (direction != mxConstants.DIRECTION_EAST)
		{
			styleMap.put(mxConstants.STYLE_DIRECTION, direction);
		}

		String flibX = getValue(this.getCellElement(mxVsdxConstants.FLIP_X),
				"0");
		String flibY = getValue(this.getCellElement(mxVsdxConstants.FLIP_Y),
				"0");

		if ("1".equals(flibX))
		{
			styleMap.put(mxConstants.STYLE_FLIPH, "1");
		}

		if ("1".equals(flibY))
		{
			styleMap.put(mxConstants.STYLE_FLIPV, "1");
		}

		resolveCommonStyles();

		return this.styleMap;
	}

	private String getDashPattern()
	{
		ArrayList<Double> pattern = null;

		String linePattern = this.getValue(
				this.getCellElement(mxVsdxConstants.LINE_PATTERN), "0");

		if (linePattern.equals("Themed"))
		{
			mxVsdxTheme theme = getTheme();

			if (theme != null)
			{
				pattern = isVertex()
						? theme.getLineDashPattern(getQuickStyleVals())
						: theme.getConnLineDashPattern(getQuickStyleVals());
			}
		}
		else
		{
			pattern = getLineDashPattern(Integer.parseInt(linePattern));
		}

		if (pattern != null && !pattern.isEmpty())
		{
			StringBuilder str = new StringBuilder();

			for (Double len : pattern)
			{
				str.append(String.format("%.2f ", len));
			}
			return str.toString().trim();
		}
		return null;
	}

	/**
	 * Checks if the lines of the shape are dashed.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Returns <code>true</code> if the lines of the shape are dashed.
	 */
	public boolean isDashed()
	{
		String linePattern = this.getValue(
				this.getCellElement(mxVsdxConstants.LINE_PATTERN), "0");

		if (linePattern.equals("Themed"))
		{
			mxVsdxTheme theme = getTheme();

			if (theme != null)
			{
				return isVertex() ? theme.isLineDashed(getQuickStyleVals())
						: theme.isConnLineDashed(getQuickStyleVals());
			}
		}
		else if (!(linePattern.equals("0") || linePattern.equals("1")))
		{
			return true;
		}

		return false;
	}

	/**
	 * Returns the line width.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Line width in pixels.
	 */
	public double getLineWidth()
	{
		String lineWeight = getValue(
				this.getCellElement(mxVsdxConstants.LINE_WEIGHT), "1");

		double lWeight = 1;
		try
		{
			if (lineWeight.equals("Themed"))
			{
				mxVsdxTheme theme = getTheme();

				if (theme != null)
				{
					lWeight = (isVertex()
							? theme.getLineWidth(getQuickStyleVals())
							: theme.getConnLineWidth(getQuickStyleVals()))
							/ 10000.0;
				}
			}
			else
			{
				lWeight = Double.parseDouble(lineWeight);
				lWeight = getScreenNumericalValue(lWeight);
			}
		}
		catch (Exception e)
		{
			// ignore
		}

		//Value is fixed for weight < 1
		if (lWeight < 1)
		{
			lWeight *= 2;
		}

		return lWeight;
	}

	/**
	 * Returns the start arrow size.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * Determines the value in pixels of each arrow size category in .vdx.
	 * @return Size in pixels.
	 */
	public float getStartArrowSize()
	{
		String baSize = getValue(
				this.getCellElement(mxVsdxConstants.BEGIN_ARROW_SIZE), "4");

		try
		{
			int size = 4;

			if (baSize.equals("Themed"))
			{
				mxVsdxTheme theme = getTheme();

				if (theme != null)
				{
					size = isVertex() ? theme.getStartSize(getQuickStyleVals())
							: theme.getConnStartSize(getQuickStyleVals());
				}
			}
			else
			{
				size = Integer.valueOf(baSize);
			}

			return VsdxShape.arrowSizes[size];
		}
		catch (Exception e)
		{
			// ignore
		}

		return 4;
	}

	/**
	 * Returns the end arrow size.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * Determines the value in pixels of each arrow size category in .vdx.
	 * @return Size in pixels.
	 */
	public float getFinalArrowSize()
	{
		String eaSize = getValue(
				this.getCellElement(mxVsdxConstants.END_ARROW_SIZE), "4");

		try
		{
			int size = 4;

			if (eaSize.equals("Themed"))
			{
				mxVsdxTheme theme = getTheme();

				if (theme != null)
				{
					size = isVertex() ? theme.getEndSize(getQuickStyleVals())
							: theme.getConnEndSize(getQuickStyleVals());
				}
			}
			else
			{
				size = Integer.valueOf(eaSize);
			}

			return VsdxShape.arrowSizes[size];
		}
		catch (Exception e)
		{
			// ignore
		}

		return 4;
	}

	/**
	 * Returns whether the cell is Rounded.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Returns <code>true</code> if the cell is Rounded.
	 */
	public boolean isRounded()
	{
		String val = getValue(this.getCellElement(mxVsdxConstants.ROUNDING),
				"0");

		if ("Themed".equals(val))
		{
			//TODO add theme support 
			val = "0";
		}
		return Double.valueOf(val) > 0;
	}

	/**
	 * Return if the line has shadow.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Returns <code>mxVdxConstants.TRUE</code> if the line has shadow.
	 */
	public boolean isShadow()
	{
		// https://msdn.microsoft.com/en-us/library/office/jj230454.aspx TODO
		// double shdwShow = this.getNumericalValue(this.getStyleNode(mxVdxConstants.SHDW_PATTERN), 0);

		String shdw = this.getValue(
				this.getCellElement(mxVsdxConstants.SHDW_PATTERN), "0");

		if (shdw.equals("Themed"))
		{
			// TODO get value from theme
		}
		else if (!shdw.equals("0"))
		{
			return true;
		}

		return false;
	}

	/**
	 * Returns the style of the edge. (Orthogonal or straight)
	 * @return Edge Style.
	 */
	public Map<String, String> getEdgeStyle(Map<String, String> edgeShape)
	{
		Map<String, String> result = new HashMap<String, String>();
		String edgeName = edgeShape.get(mxConstants.STYLE_SHAPE);

		if (edgeName.equals("mxgraph.lean_mapping.electronic_info_flow_edge"))
		{
			result.put(mxConstants.STYLE_EDGE, mxConstants.NONE);
			return result;
		}
		else
		{
			result.put(mxConstants.STYLE_EDGE, mxConstants.EDGESTYLE_ELBOW);
			return result;
		}
		//		else
		//		{
		//			result.put(mxConstants.STYLE_EDGE, mxConstants.NONE);
		//			return result;
		//		}
	}

	/**
	 * Returns the master's Id of the Shape.
	 * @return Master's ID of the shape, null if has not a master.
	 */
	public String getMasterId()
	{
		if (shape.hasAttribute(mxVsdxConstants.MASTER))
		{
			return shape.getAttribute(mxVsdxConstants.MASTER);
		}
		else
		{
			return null;
		}
	}

	/**
	 * Returns the masterShape's Id of the shape.
	 * @return Master Shape's ID of the shape, null if has not a master shape.
	 */
	public String getShapeMasterId()
	{
		if (shape.hasAttribute(mxVsdxConstants.MASTER_SHAPE))
		{
			return shape.getAttribute(mxVsdxConstants.MASTER_SHAPE);
		}
		else
		{
			return null;
		}
	}

	/**
	 * Checks if a shape contains other shapes inside.
	 * @return Returns <code>true</code> if a shape contains other shapes inside.
	 */
	public boolean isGroup()
	{
		return shape.getAttribute("Type").equals("Group");
	}

	/**
	 * Checks if a shape contains other shapes inside.
	 * @return Returns <code>true</code> if a shape contains other shapes inside.
	 */
	public static String getType(Element shape)
	{
		return shape.getAttribute("Type");
	}

	public mxVsdxMaster getMaster()
	{
		return master;
	}

	/**
	 * Returns the NameU attribute.
	 * @return Value of the NameU attribute.
	 */
	public String getNameU()
	{
		String result = shape.getAttribute(mxVsdxConstants.NAME_U);

		if ((result == null || result.equals("")) && masterShape != null)
		{
			result = masterShape.getNameU();
		}

		return result;
	}

	/**
	 * Returns the Name attribute.
	 * @return Value of the Name attribute (Human readable name).
	 */
	public String getName()
	{
		String result = shape.getAttribute(mxVsdxConstants.NAME);

		if ((result == null || result.equals("")) && masterShape != null)
		{
			result = masterShape.getName();
		}

		return result;
	}

	/**
	 * Returns the master name of the shape
	 * @return Master name of the shape
	 */
	public String getMasterName()
	{
		return shapeName;

	}

	public void setLabelOffset(mxCell vertex, String style)
	{
		String nameU = "";
		String masterNameU = "";

		if (shape.hasAttribute(mxVsdxConstants.NAME_U))
		{
			nameU = shape.getAttribute(mxVsdxConstants.NAME_U);
		}

		if (this.getMaster() != null
				&& this.getMaster().getMasterElement() != null)
		{
			if (this.getMaster().getMasterElement()
					.hasAttribute(mxVsdxConstants.NAME_U))
			{
				masterNameU = this.getMaster().getMasterElement()
						.getAttribute(mxVsdxConstants.NAME_U);
			}
		}

		//check for shape name/type, because of different (shape specific) treatment of each
		if (nameU.startsWith("Organizational unit")
				|| masterNameU.startsWith("Organizational unit"))
		{
			Element control = (Element) shape
					.getElementsByTagName(mxVsdxConstants.CONTROL).item(0);

			Element xEl = null;
			String xS = "0.0";
			Element yEl = null;
			String yS = "-0.4";

			if (control != null)
			{
				xEl = (Element) control.getElementsByTagName(mxVsdxConstants.X)
						.item(0);

				if (xEl.hasAttribute("F"))
				{
					xS = xEl.getAttribute("F");
				}
				else
				{
					xS = xEl.getTextContent();
				}

				yEl = (Element) control.getElementsByTagName(mxVsdxConstants.Y)
						.item(0);

				if (yEl.hasAttribute("F"))
				{
					yS = yEl.getAttribute("F");
				}
				else
				{
					yS = yEl.getTextContent();
				}
			}

			mxGeometry geometry = vertex.getGeometry();

			//clean the formula strings and hope it will work with a specific algorithm
			xS = xS.replace("Width/2+", "");
			xS = xS.replace("DL", "");
			yS = yS.replace("Height*", "");

			if (xS.equals("Inh"))
			{
				xS = "0.0";
			}

			if (yS.equals("Inh"))
			{
				yS = "-0.4";
			}

			if (yS.contains("txtHeight"))
			{
				yS = "-0.4";
			}

			String[] styleArray = style.split(";");
			String tabHeight = "";

			for (int i = 0; i < styleArray.length; i++)
			{
				String currStyle = styleArray[i];
				currStyle = currStyle.trim();

				if (currStyle.startsWith("tabHeight="))
				{
					tabHeight = currStyle.replace("tabHeight=", "");
				}
			}

			if (tabHeight.equals(""))
			{
				tabHeight = "20";
			}

			Double tH = Double.valueOf(tabHeight);

			Double x = Double.parseDouble(xS);
			Double y = Double.parseDouble(yS);
			Double h = geometry.getHeight();
			Double xFinal = geometry.getWidth() * 0.1 + x * 100;
			Double yFinal = h - h * y - tH / 2;
			mxPoint offset = new mxPoint(xFinal, yFinal);
			vertex.getGeometry().setOffset(offset);
		}
		else if (nameU.startsWith("Domain 3D")
				|| masterNameU.startsWith("Domain 3D"))
		{
			Element control = (Element) shape
					.getElementsByTagName(mxVsdxConstants.CONTROL).item(0);

			Element xEl = null;
			String xS = "0.0";
			Element yEl = null;
			String yS = "-0.4";

			if (control != null)
			{
				xEl = (Element) control.getElementsByTagName(mxVsdxConstants.X)
						.item(0);
				xS = xEl.getAttribute("F");
				yEl = (Element) control.getElementsByTagName(mxVsdxConstants.Y)
						.item(0);
				yS = yEl.getAttribute("F");
			}

			mxGeometry geometry = vertex.getGeometry();

			//clean the formula strings and hope it will work with a specific algorithm
			xS = xS.replace("Width/2+", "");
			xS = xS.replace("DL", "");
			yS = yS.replace("Height*", "");

			if (xS.equals("Inh") || xS.equals(""))
			{
				xS = "0.0";
			}

			if (yS.equals("Inh") || yS.equals(""))
			{
				yS = "-0.4";
			}

			if (yS.contains("txtHeight"))
			{
				yS = "-0.4";
			}

			Double x = Double.parseDouble(xS);
			Double y = Double.parseDouble(yS);
			Double h = geometry.getHeight();
			Double xFinal = geometry.getWidth() * 0.1 + x * 100;
			Double yFinal = h - h * y;
			mxPoint offset = new mxPoint(xFinal, yFinal);
			vertex.getGeometry().setOffset(offset);
		}
	}

	/**
	 * Returns the constant that represents the Shape.
	 * @return String that represent the form.
	 */
	public Map<String, String> getForm()
	{
		Map<String, String> result = new HashMap<String, String>();

		this.styleDebug("Looking to match shape = " + shapeName);

		if (shapeName != null && !shapeName.equals("")
				&& VsdxShape.USE_SHAPE_MATCH)
		{
			String trans = null;// mxResources.get(shapeName);

			if (trans != null && !trans.equals(""))
			{
				this.styleDebug("Translation = " + trans);
				result.put(mxConstants.STYLE_SHAPE, trans);
				return result;
			}
		}

		if (this.isVertex())
		{
			try
			{
				String type = VsdxShape.getType(this.getShape());
				// String foreignType = "";
				this.styleDebug("shape type = " + type);

				//The master may contain the foreign object data
				if (this.imageData != null
						|| (mxVsdxConstants.FOREIGN.equals(type)
								&& masterShape != null
								&& masterShape.imageData != null))
				{
					Map<String, String> imageData = this.imageData != null
							? this.imageData : masterShape.imageData;

					result.put("shape", "image");
					result.put("aspect", "fixed");
					String iType = imageData.get("iType");
					String iData = imageData.get("iData");

					result.put("image", "data:image/" + iType + "," + iData);
					return result;
				}

				//Shape inherit master geometry and can change some of it or override it completely. So, no need to parse the master instead of the shape itself
				String parsedGeom = this.parseGeom();

				if (parsedGeom.equals(""))
				{
					this.styleDebug("No geom found");
					return result;
				}

				String stencil = Utils.encodeURIComponent(parsedGeom, "UTF-8");

				byte[] bytes = stencil.getBytes("UTF-8");
				Deflater deflater = new Deflater(Deflater.BEST_COMPRESSION,
						true);
				deflater.setInput(bytes);
				ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

				deflater.finish();

				byte[] buffer = new byte[1024];

				while (!deflater.finished())
				{
					int count = deflater.deflate(buffer);
					outputStream.write(buffer, 0, count);
				}

				try
				{
					outputStream.close();
				}
				catch (IOException e)
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				byte[] output = outputStream.toByteArray();
				deflater.end();

				byte[] encoded = output;//Base64.encodeBase64(output);
				String enc = new String(encoded, "UTF-8");

				result.put(mxConstants.STYLE_SHAPE, "stencil(" + enc + ")");
			}
			catch (UnsupportedEncodingException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		else
		{
			return getEdgeStyle();
		}

		return result;
	}

	/**
	 * Checks if a shape may to be imported like an Off page reference.
	 * @return Returns <code>true</code> if a shape may to be imported like an Off page reference.
	 */
	public boolean isOff_page_reference()
	{
		String name = getNameU();

		if (name.equals("Off-page reference")
				|| name.equals("Lined/Shaded process"))
		{
			return true;
		}

		return false;
	}

	/**
	 * Checks if a shape may to be imported like an External process.
	 * @return Returns <code>true</code> if a shape may to be imported like an External process.
	 */
	public boolean isExternal_process()
	{
		return (shapeName.equals("External process"));
	}

	/**
	 * Returns the direction of the shape.
	 * @param form Form of the shape.
	 * @return Direction(south, north, east and south)
	 */
	public String getDirection(Map<String, String> form)
	{
		String offsetS = null;//(String) mxResources.get("mxOffset" + shapeName);

		if (offsetS == null || offsetS.equals("0") || offsetS.equals(""))
		{
			return mxConstants.DIRECTION_EAST;
		}
		else if (offsetS.equals("1"))
		{
			return mxConstants.DIRECTION_SOUTH;
		}
		else if (offsetS.equals("2"))
		{
			return mxConstants.DIRECTION_WEST;
		}
		else if (offsetS.equals("3"))
		{
			return mxConstants.DIRECTION_NORTH;
		}

		return mxConstants.DIRECTION_EAST;
	}

	/**
	 * Checks if a shape may to be imported like a Sub-process.
	 * This method is approximated.
	 * @return Returns <code>true</code> if a shape may to be imported like a
	 * Sub-process.
	 */
	public boolean isSubproces()
	{
		return shapeName.equals("Subproces");
	}

	/**
	 * @return style map containing the proper shape and style (if needed) of a Visio "dynamic connector" edge
	 */
	public Map<String, String> getEdgeStyle()
	{
		Map<String, String> result = new HashMap<String, String>();

		result.put("edgeStyle", "none");
		return result;

		//result.put("edgeStyle", "orthogonalEdgeStyle");
		//return result;

		//result.put("curved", "1");
		//return result;

		//return null;
	}

	public Map<Integer, VsdxShape> getChildShapes()
	{
		return childShapes;
	}

	public void setChildShapes(Map<Integer, VsdxShape> childShapes)
	{
		this.childShapes = childShapes;
	}

	public boolean isDisplacedLabel()
	{
		String txtPinXF = this.getAttribute(mxVsdxConstants.TXT_PIN_X, "F", "");
		String txtPinYF = this.getAttribute(mxVsdxConstants.TXT_PIN_Y, "F", "");
		String txtWidthF = this.getAttribute(mxVsdxConstants.TXT_WIDTH, "F",
				"");
		String txtHeightF = this.getAttribute(mxVsdxConstants.TXT_HEIGHT, "F",
				"");

		if (masterShape != null)
		{
			if (txtPinXF == "" || txtPinXF.toLowerCase().equals("inh"))
			{
				txtPinXF = masterShape.getAttribute(mxVsdxConstants.TXT_PIN_X,
						"F", "");
			}

			if (txtPinYF == "" || txtPinYF.toLowerCase().equals("inh"))
			{
				txtPinYF = masterShape.getAttribute(mxVsdxConstants.TXT_PIN_Y,
						"F", "");
			}

			if (txtWidthF == "" || txtWidthF.toLowerCase().equals("inh"))
			{
				txtWidthF = masterShape.getAttribute(mxVsdxConstants.TXT_WIDTH,
						"F", "");
			}

			if (txtHeightF == "" || txtHeightF.toLowerCase().equals("inh"))
			{
				txtHeightF = masterShape
						.getAttribute(mxVsdxConstants.TXT_HEIGHT, "F", "");
			}
		}

		if (txtPinXF.toLowerCase().equals("width*0.5")
				&& txtPinYF.toLowerCase().equals("height*0.5")
				&& txtWidthF.toLowerCase().equals("width*1")
				&& txtHeightF.toLowerCase().equals("height*1"))
		{
			return false;
		}
		else if (txtPinXF.toLowerCase().startsWith("width*")
				&& txtPinYF.toLowerCase().startsWith("height*")
				&& txtWidthF.toLowerCase().startsWith("width*")
				&& txtHeightF.toLowerCase().startsWith("height*"))
		//		else if (txtPinXF.toLowerCase().startsWith("width*") &&
		//				txtPinYF.toLowerCase().startsWith("height*"))
		{
			return true;
		}
		else if (txtPinXF.toLowerCase().startsWith("controls.row_")
				|| txtPinYF.toLowerCase().startsWith("controls.row_"))
		{
			return true;
		}

		return false;
	}

	public boolean isRotatedLabel()
	{
		String txtAngleValue = this.getAttribute(mxVsdxConstants.TXT_ANGLE, "V",
				"");

		if (masterShape != null)
		{
			if (txtAngleValue.equals(""))
			{
				txtAngleValue = masterShape
						.getAttribute(mxVsdxConstants.TXT_ANGLE, "V", "");
			}

		}

		if (!txtAngleValue.equals("0") && !txtAngleValue.equals("0.0")
				&& !txtAngleValue.equals(""))
		{
			return true;
		}

		return false;
	}

	public void setRootShape(VsdxShape shape)
	{
		this.rootShape = shape;
	}

	public VsdxShape getRootShape()
	{
		return this.rootShape;
	}

	// Edge specific methods 

	/**
	 * Returns the coordinates of the begin point of an Edge Shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return mxPoint that represents the coordinates.
	 */
	public mxPoint getStartXY(double parentHeight)
	{
		double startX = Math.round(getScreenNumericalValue(
				this.getCellElement(mxVsdxConstants.BEGIN_X), 0) * 100) / 100;
		double startY = Math.round((parentHeight - getScreenNumericalValue(
				this.getCellElement(mxVsdxConstants.BEGIN_Y), 0)) * 100) / 100;

		return new mxPoint(startX, startY);
	}

	/**
	 * Returns the coordinates of the end point of an Edge Shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return mxPoint that represents the coordinates.
	 */
	public mxPoint getEndXY(double parentHeight)
	{
		double endX = Math.round(getScreenNumericalValue(
				this.getCellElement(mxVsdxConstants.END_X), 0) * 100) / 100;
		double endY = Math.round((parentHeight - getScreenNumericalValue(
				this.getCellElement(mxVsdxConstants.END_Y), 0)) * 100) / 100;

		return new mxPoint(endX, endY);
	}

	/**
	 * Returns the list of routing points of a edge shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return List of mxPoint that represents the routing points.
	 */
	public List<mxPoint> getRoutingPoints(double parentHeight,
			mxPoint startPoint,
			double rotation/*, boolean flipX, boolean flipY*/)
	{
		if (geomList != null)
		{
			return geomList.getRoutingPoints(parentHeight, startPoint,
					rotation);
		}
		return null;
	}

	/**
	 * Returns the list of control points of a edge shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return List of mxPoint that represents the control points.
	 */
	public List<mxPoint> getControlPoints(double parentHeight)
	{
		mxPoint startXY = getStartXY(parentHeight);
		mxPoint endXY = getEndXY(parentHeight);
		ArrayList<mxPoint> pointList = new ArrayList<mxPoint>();

		if (shape != null)
		{
			NodeList geomList = shape
					.getElementsByTagName(mxVsdxConstants.GEOM);

			if (geomList.getLength() > 0)
			{
				Element firstGeom = (Element) geomList.item(0);
				Element firstNURBS = (Element) firstGeom
						.getElementsByTagName(mxVsdxConstants.NURBS_TO).item(0);
				Element firstE = (Element) firstNURBS.getElementsByTagName("E")
						.item(0);

				if (firstE != null)
				{
					String f = firstE.getAttribute("F");
					f = f.replaceAll("NURBS\\(", "");
					f = f.replaceAll("\\)", "");
					f = f.replaceAll(",", " ");
					f = f.replaceAll("\\s\\s", " ");
					String[] pointsS = f.split(" ");
					double[] pointsRaw = new double[pointsS.length];

					for (int i = 0; i < pointsS.length; i++)
					{
						pointsRaw[i] = Double.parseDouble(pointsS[i]);
					}

					for (int i = 2; i + 4 < pointsS.length; i = i + 4)
					{
						mxPoint currPoint = new mxPoint();
						double rawX = pointsRaw[i + 2];
						double rawY = pointsRaw[i + 3];
						double width = Math.abs(endXY.getX() - startXY.getX());
						double widthFixed = Math.min(100, width);
						double heightFixed = 100;
						double finalX = 0;

						finalX = startXY.getX() + widthFixed * rawX;
						currPoint.setX(Math.round(finalX * 100) / 100);
						currPoint.setY(Math.round((startXY.getY() - heightFixed * rawY) * 100) / 100);
						pointList.add(currPoint);
					}

					return pointList;
				}
				else
				{
					return null;
				}
			}
		}

		return null;
	}

	/**
	 * Analyzes a edge shape and returns a string with the style.
	 * @return style read from the edge shape.
	 */
	public Map<String, String> getStyleFromEdgeShape(double parentHeight)
	{
		styleMap.put(mxVsdxConstants.VSDX_ID, this.getId().toString());

		// Rotation.
		//		double rotation = this.getRotation();
		//		rotation = Math.round(rotation);
		//		
		//		String rotationString = getLabelRotation() ? "1" : "0";
		//
		//		if (!rotationString.equals("1") && rotation != 90 && rotation != 270)
		//		{
		//			styleMap.put(mxConstants.STYLE_HORIZONTAL, rotationString);
		//		}
		//
		//		if (rotation != 0 && rotation != 360)
		//		{
		//			rotation = rotation * 100/100;
		//
		//			styleMap.put(mxConstants.STYLE_ROTATION, Double.toString(rotation));
		//		}

		//Defines Edge Shape
		Map<String, String> edgeShape = getForm();

		if (edgeShape != null && !edgeShape.equals(""))
		{
			styleMap.putAll(edgeShape);
		}

		//Defines Pattern
		if (isDashed())
		{
			styleMap.put(mxConstants.STYLE_DASHED, "1");

			String dashPattern = getDashPattern();

			if (dashPattern != null)
			{
				styleMap.put(mxConstants.STYLE_DASH_PATTERN, dashPattern);
			}
		}

		//Defines Begin Arrow
		String startArrow = getEdgeMarker(true);

		if (startArrow != null)
		{
			if (startArrow.startsWith(ARROW_NO_FILL_MARKER))
			{
				startArrow = startArrow
						.substring(ARROW_NO_FILL_MARKER.length());
				styleMap.put(mxConstants.STYLE_STARTFILL, "0");
			}
			styleMap.put(mxConstants.STYLE_STARTARROW, startArrow);
		}

		//Defines End Arrow
		String endArrow = getEdgeMarker(false);

		if (endArrow != null)
		{
			if (endArrow.startsWith(ARROW_NO_FILL_MARKER))
			{
				endArrow = endArrow.substring(ARROW_NO_FILL_MARKER.length());
				styleMap.put(mxConstants.STYLE_ENDFILL, "0");
			}
			styleMap.put(mxConstants.STYLE_ENDARROW, endArrow);
		}

		//Defines the start arrow size.
		int saSize = (int) Math.round(getStartArrowSize());

		if (saSize != 6)
		{
			styleMap.put(mxConstants.STYLE_STARTSIZE, Integer.toString(saSize));
		}

		//Defines the end arrow size.
		int faSize = (int) Math.round(getFinalArrowSize());

		if (faSize != 6)
		{
			styleMap.put(mxConstants.STYLE_ENDSIZE, Integer.toString(faSize));
		}

		//Defines the line width
		int lWeight = (int) Math.round(getLineWidth());

		if (lWeight != 1.0)
		{
			styleMap.put(mxConstants.STYLE_STROKEWIDTH,
					Integer.toString(lWeight));
		}

		// Color
		String color = getStrokeColor();

		if (!color.equals(""))
		{
			styleMap.put(mxConstants.STYLE_STROKECOLOR, color);
		}

		// Shadow
		if (isShadow())
		{
			styleMap.put(mxConstants.STYLE_SHADOW, mxVsdxConstants.TRUE);
		}

		if (isConnectorBigNameU(getNameU()))
		{
			styleMap.put(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_ARROW);
			String fillcolor = getFillColor();

			if (!fillcolor.equals(""))
			{
				styleMap.put(mxConstants.STYLE_FILLCOLOR, fillcolor);
			}
		}

		//Defines label top spacing
		int topMargin = (int) Math.round(getTopSpacing());
		styleMap.put(mxConstants.STYLE_SPACING_TOP, Integer.toString(topMargin));

		//Defines label bottom spacing
		int bottomMargin = (int) Math.round(getBottomSpacing());
		styleMap.put(mxConstants.STYLE_SPACING_BOTTOM,
				Integer.toString(bottomMargin));

		//Defines label left spacing
		int leftMargin = (int) Math.round(getLeftSpacing());
		styleMap.put(mxConstants.STYLE_SPACING_LEFT,
				Integer.toString(leftMargin));

		//Defines label right spacing
		int rightMargin = (int) Math.round(getRightSpacing());
		styleMap.put(mxConstants.STYLE_SPACING_RIGHT,
				Integer.toString(rightMargin));

		//Defines label vertical align
		String verticalAlign = getAlignVertical();
		styleMap.put(mxConstants.STYLE_VERTICAL_ALIGN, verticalAlign);

		//Defines Label Rotation
		//		styleMap.put(mxConstants.STYLE_HORIZONTAL, getLabelRotation());

		styleMap.put("html", "1");

		resolveCommonStyles();
		//		System.out.println(this.getId());
		//		System.out.println(Arrays.toString(styleMap.entrySet().toArray()));

		return this.styleMap;
	}

	/**
	 * Analyzes a edge shape and returns a string with the style.
	 * @return style read from the edge shape.
	 */
	public Map<String, String> resolveCommonStyles()
	{
		/** LABEL BACKGROUND COLOR **/
		String lbkgnd = this.getTextBkgndColor(
				this.getCellElement(mxVsdxConstants.TEXT_BKGND));

		if (!lbkgnd.equals(""))
		{
			this.styleMap.put(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, lbkgnd);
		}

		/** ROUNDING **/
		this.styleMap.put(mxConstants.STYLE_ROUNDED,
				isRounded() ? mxVsdxConstants.TRUE : mxVsdxConstants.FALSE);

		return styleMap;
	}

	/**
	 * Returns the arrow of the line.
	 * @return Type of arrow.
	 */
	public String getEdgeMarker(boolean start)
	{
		String marker = this.getValue(this.getCellElement(start
				? mxVsdxConstants.BEGIN_ARROW : mxVsdxConstants.END_ARROW),
				"0");

		int val = 0;
		try
		{
			if (marker.equals("Themed"))
			{
				mxVsdxTheme theme = getTheme();

				if (theme != null)
				{
					val = isVertex()
							? theme.getEdgeMarker(start, getQuickStyleVals())
							: theme.getConnEdgeMarker(start,
									getQuickStyleVals());

				}
			}
			else
			{
				val = Integer.parseInt(marker);
			}
		}
		catch (Exception e)
		{
			// ignore
		}

		String type = VsdxShape.arrowTypes.get(val);

		if (val > 0 && type == null)
		{
			//if arrow  head type is not supported, use the open arrow instead
			type = VsdxShape.arrowTypes.get(1);
		}

		return type;
	}

	/**
	 * Locates the first entry for the specified style string in the style hierarchy.
	 * The order is to look locally, then delegate the request to the relevant parent style
	 * if it doesn't exist locally
	 * @param key The key of the style to find
	 * @return the Element that first resolves to that style key or null or none is found
	 */
	protected Element getCellElement(String key)
	{
		Element elem = super.getCellElement(key);

		if (elem == null && this.masterShape != null)
		{
			return this.masterShape.getCellElement(key);
		}

		return elem;
	}

	protected Element getCellElement(String cellKey, String index,
			String sectKey)
	{
		Element elem = super.getCellElement(cellKey, index, sectKey);

		if (elem == null && this.masterShape != null)
		{
			return this.masterShape.getCellElement(cellKey, index, sectKey);
		}

		return elem;
	}

	/**
	 * Creates a sub shape for <b>shape</b> that contains the label. Used internally, when the label is positioned by an anchor.
	 * @param graph
	 * @param shape the shape we want to create the label for
	 * @param parent
	 * @param parentHeight
	 * @return label sub-shape
	 */
	public mxCell createLabelSubShape(/*mxGraph graph,*/ mxCell parent)
	{
		double txtWV = getScreenNumericalValue(
				getShapeNode(mxVsdxConstants.TXT_WIDTH), getWidth());
		double txtHV = getScreenNumericalValue(
				getShapeNode(mxVsdxConstants.TXT_HEIGHT), getHeight());
		double txtLocPinXV = getScreenNumericalValue(
				getShapeNode(mxVsdxConstants.TXT_LOC_PIN_X), txtWV / 2.0);
		double txtLocPinYV = getScreenNumericalValue(
				getShapeNode(mxVsdxConstants.TXT_LOC_PIN_Y), txtHV / 2.0);
		double txtPinXV = getScreenNumericalValue(
				getShapeNode(mxVsdxConstants.TXT_PIN_X), txtLocPinXV);
		double txtPinYV = getScreenNumericalValue(
				getShapeNode(mxVsdxConstants.TXT_PIN_Y), txtLocPinYV);
		double txtAngleV = getValueAsDouble(
				getShapeNode(mxVsdxConstants.TXT_ANGLE), 0);

		String textLabel = getTextLabel();

		if (textLabel != null && !textLabel.isEmpty())
		{
			Map<String, String> styleMap = new HashMap<String, String>(
					getStyleMap());
			styleMap.put(mxConstants.STYLE_FILLCOLOR, mxConstants.NONE);
			styleMap.put(mxConstants.STYLE_STROKECOLOR, mxConstants.NONE);
			styleMap.put(mxConstants.STYLE_GRADIENTCOLOR, mxConstants.NONE);

			//We don't need to override these attributes in order to properly align the text
			if (!styleMap.containsKey("align"))
				styleMap.put("align", "center");
			if (!styleMap.containsKey("verticalAlign"))
				styleMap.put("verticalAlign", "middle");
			if (!styleMap.containsKey("whiteSpace"))
				styleMap.put("whiteSpace", "wrap");

			// Doesn't make sense to set a shape, it's not rendered and doesn't affect the text perimeter
			styleMap.remove("shape");
			//image should be set for the parent shape only
			styleMap.remove("image");
			//styleMap.put("html", "1");

			double rotation = getRotation();

			if (txtAngleV != 0)
			{
				double labRot = 360 - Math.toDegrees(txtAngleV);

				labRot = Math.round(((labRot + rotation) % 360.0) * 100.0)
						/ 100.0;

				if (labRot != 0.0)
				{
					styleMap.put("rotation", Double.toString(labRot));
				}
			}

			String style = "text;" + mxVsdxUtils.getStyleString(styleMap, "=");

			double y = parent.getGeometry().getHeight()
					- (txtPinYV + txtHV - txtLocPinYV);
			double x = txtPinXV - txtLocPinXV;

			if (rotation > 0)
			{
				mxGeometry tmpGeo = new mxGeometry(x, y, txtWV, txtHV);
				mxGeometry pgeo = parent.getGeometry();
				double hw = pgeo.getWidth() / 2, hh = pgeo.getHeight() / 2;
				Utils.rotatedGeometry(tmpGeo, rotation, hw, hh);
				x = tmpGeo.getX();
				y = tmpGeo.getY();
			}

			mxCell v1 = null;
//			(mxCell) graph.insertVertex(parent, null, textLabel,
//				Math.round(x * 100) / 100, Math.round(y * 100) / 100,
//				Math.round(txtWV * 100) / 100, Math.round(txtHV * 100) / 100,
//				style + ";html=1;");

			return v1;
		}

		return null;
	}

	public mxPoint getLblEdgeOffset(List<mxPoint> points)
	{
		if (points != null && points.size() > 1)
		{
			//find mxGraph label offset
			//mxCellState state = new mxCellState();
			//state.setAbsolutePoints(points);
			//view.updateEdgeBounds(state);
			mxPoint mxOffset = new mxPoint();//.getPoint(state);
			mxPoint p0 = points.get(0);
			mxPoint pe = points.get(points.size() - 1);

			//Calculate the text offset
			double txtWV = getScreenNumericalValue(
					getShapeNode(mxVsdxConstants.TXT_WIDTH), getWidth());
			double txtHV = getScreenNumericalValue(
					getShapeNode(mxVsdxConstants.TXT_HEIGHT), getHeight());
			double txtLocPinXV = getScreenNumericalValue(
					getShapeNode(mxVsdxConstants.TXT_LOC_PIN_X), 0);
			double txtLocPinYV = getScreenNumericalValue(
					getShapeNode(mxVsdxConstants.TXT_LOC_PIN_Y), 0);
			double txtPinXV = getScreenNumericalValue(
					getShapeNode(mxVsdxConstants.TXT_PIN_X), 0);
			double txtPinYV = getScreenNumericalValue(
					getShapeNode(mxVsdxConstants.TXT_PIN_Y), 0);

			double y = (getHeight() - (p0.getY() - pe.getY())) / 2 + p0.getY()
					- mxOffset.getY() - (txtPinYV - txtLocPinYV + txtHV / 2);
			double x = txtPinXV - txtLocPinXV + txtWV / 2
					+ (p0.getX() - mxOffset.getX());

			//FIXME one file has txtPinX/Y values extremely high which cause draw.io to hang
			//			<Cell N='TxtPinX' V='-1.651384506429589E199' F='SETATREF(Controls.TextPosition)'/>
			//			<Cell N='TxtPinY' V='1.183491078740126E185' F='SETATREF(Controls.TextPosition.Y)'/>
			if (Math.abs(x) > 10e10)
				return null;

			return new mxPoint(Math.round(x * 100) / 100, Math.round(y * 100) / 100);
		}
		else
		{
			return null;
		}
	}

	public int getShapeIndex()
	{
		return shapeIndex;
	}

	public void setShapeIndex(int shapeIndex)
	{
		this.shapeIndex = shapeIndex;
	}

	public mxCell createLabelSubShape(mxGraph graph, mxCell group) {
		// TODO Auto-generated method stub
		return null;
	}

	public mxPoint getLblEdgeOffset(Object view, List<mxPoint> points) {
		// TODO Auto-generated method stub
		return null;
	}

}