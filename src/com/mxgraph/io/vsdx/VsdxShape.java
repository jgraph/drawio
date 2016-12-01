/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import com.mxgraph.model.mxCell;
import com.mxgraph.model.mxGeometry;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxResources;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.logging.Logger;
import java.util.zip.Deflater;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.codec.binary.Base64;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

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
	protected Shape masterShape = null;

	/**
	 * Master element referenced by the shape.
	 */
	protected mxVsdxMaster master = null;

	/**
	 * If the shape is a sub shape, this is a reference to its root shape, otherwise null
	 */
	protected VsdxShape rootShape = this;

	public double parentHeight;
	
	/**
	 * Stylesheet with the fill style referenced by the shape.
	 */
	protected mxStyleSheet fillStyle = null;

	/**
	 * Stylesheet with the line style referenced by the shape.
	 */
	protected mxStyleSheet lineStyle = null;

	/**
	 * Stylesheet with the text style referenced by the shape.
	 */
	protected mxStyleSheet textStyle = null;
	
	/**
	 * The prefix of the shape name
	 */
	protected String shapeName = null;
	
	/**
	 * Whether this cell is a vertex
	 */
	protected boolean vertex = true;
	
	protected Map<Integer, VsdxShape> childShapes = new HashMap<Integer, VsdxShape>();
	
	protected static DocumentBuilder docBuilder = null;
	
	public static final Set<String> OFFSET_ARRAY = new HashSet<String>(Arrays.asList(
			new String[] {"Organizational unit",
			"Domain 3D"}
	));	

	public static final String stencilTemplate = "<shape h=\"htemplate\" w=\"wtemplate\" aspect=\"variable\" strokewidth=\"inherit\"><connections></connections><background></background><foreground></foreground></shape>";
	
	public static final float[] arrowSizes = {2, 3, 5, 7, 9, 22, 45};
	
	public static final Map<String, String> arrowTypes;
	
	static
	{
		try
		{
			mxResources.add("com/mxgraph/io/vdx/resources/edgeNameU");
			mxResources.add("com/mxgraph/io/vdx/resources/nameU");
			
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			docBuilder = docFactory.newDocumentBuilder();
		}
		catch (Exception e)
		{
			// todo
		}
		
		arrowTypes = new HashMap<String, String>();
		arrowTypes.put("0", null);
		arrowTypes.put("1", mxConstants.ARROW_OPEN);
		arrowTypes.put("4", mxConstants.ARROW_BLOCK);
		arrowTypes.put("5", mxConstants.ARROW_CLASSIC);
		arrowTypes.put("10", mxConstants.ARROW_OVAL);
		arrowTypes.put("13", mxConstants.ARROW_BLOCK);
	}

	private final static Logger LOGGER = Logger.getLogger(VsdxShape.class.getName());

	/**
	 * Create a new instance of mxVdxShape.
	 * This method get the references to the master element, master shape
	 * and stylesheet.
	 * @param shape
	 */
	public VsdxShape(mxVsdxPage page, Element shape, boolean vertex, Map<String, mxVsdxMaster> masters, mxVsdxMaster master, mxVsdxModel model)
	{
		super(shape, model);
		this.master = master;
		
		if (master != null)
		{
			// Check if the master ID corresponds to the one passed in. If it doesn't, or doesn't
			// exist on this shape, this shape is within a group that has that master
			String masterId = this.getMasterId();
			String masterShapeLocal = this.getShapeMasterId();
			
			if (masterId == null && masterShapeLocal != null)
			{
				this.masterShape = master.getSubShape(masterShapeLocal);
			}
			else
			{
				this.masterShape = master.getMasterShape();
			}
		}

		if (this.debug != null && this.masterShape != null)
		{
			this.masterShape.debug = this.debug;
		}
		
		this.lineStyle = model.getStylesheet(shape.getAttribute(mxVsdxConstants.LINE_STYLE));
		this.textStyle = model.getStylesheet(shape.getAttribute(mxVsdxConstants.TEXT_STYLE));
		
		String name = getNameU();
		int index = name.lastIndexOf(".");
		
		if (index != -1)
		{
			name = name.substring(0, index);
		}
		
		this.shapeName = name;
		
		// Get sub-shapes
		NodeList shapesList = shape.getElementsByTagName(mxVsdxConstants.SHAPES);
		
		if (shapesList != null && shapesList.getLength() > 0)
		{
			Element shapesElement = (Element) shapesList.item(0);
			this.childShapes = page.parseShapes(shapesElement, master, false);
		}
		
		for (Map.Entry<Integer, VsdxShape> entry : childShapes.entrySet())
		{
		    entry.getValue().setRootShape(this);
		}
		
		this.vertex = vertex;
	}
	
	/**
	 * Locates the first entry for the specified attribute string in the shape hierarchy.
	 * The order is to look locally, then delegate the request to the master shape
	 * if it doesn't exist locally
	 * @param key The key of the shape to find
	 * @return the Element that first resolves to that shape key or null or none is found
	 */
	protected Element getShapeNode(String key)
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
		String masterId = this.getMasterId();
		Shape masterShape = null;

		if (master != null)
		{
			if (masterId != null)
			{
				masterShape = master.getMasterShape();
			}
			else 
			{
				masterShape = master.getSubShape(this.getShapeMasterId());
			}
		}

		if (this.htmlLabels)
		{
			mxVsdxTextParser vtp = new mxVsdxTextParser(this, masterShape, textStyle, pm);
			//Get text with tags html
			return vtp.getHtmlTextContent();
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
		double h = 0, w = 0;

		if (this.hasHeight())
		{
			h = this.getHeight();
		}
		else if (masterShape != null && masterShape.hasHeight())
		{
			h = masterShape.getHeight();
		}
		
		if (this.hasWidth())
		{
			w = this.getWidth();
		}
		else if (masterShape != null && masterShape.hasWidth())
		{
			w = masterShape.getWidth();
		}

		double x = px - lpx;
		double y = parentHeight - ((py) + (h - lpy));

		// If the location pins are not in the center of the vertex we
		// need to translate the origin
		if (rotation && (lpy != h/2 || lpx != w/2))
		{
			double angle = Double.valueOf(this.getText(this.getCellElement(mxVsdxConstants.ANGLE), "0"));
			
			if (angle != 0)
			{
				double vecX = w/2 - lpx;
				double vecY = lpy - h/2;
				
			    double cos = Math.cos(angle);
			    double sin = Math.sin(angle);
				
				return new mxPoint(x + vecX - (vecX * cos - vecY * sin), (vecX * sin + vecY * cos) + y -vecY);
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
		double w = 0;
		double h = 0;

		//Defines Width
		if (this.hasWidth())
		{
			w = this.getWidth();
		}
		else if (masterShape != null && masterShape.hasWidth())
		{
			w = masterShape.getWidth();
		}

		//Defines Height
		if (this.hasHeight())
		{
			h = this.getHeight();
		}
		else if (masterShape != null && masterShape.hasHeight())
		{
			h = masterShape.getHeight();
		}

		return new mxPoint(w, h);
	}

	/**
	 * Returns the value of the pinX element.
	 * @return The shape pinX element
	 */
	public double getPinX()
	{
		return getScreenNumericalValue(this.getShapeNode(mxVsdxConstants.PIN_X), 0);
	}

	/**
	 * Returns the value of the pinY element in pixels.
	 * @return Numerical value of the pinY element.
	 */
	public double getPinY()
	{
		return getScreenNumericalValue(this.getShapeNode(mxVsdxConstants.PIN_Y), 0);
	}

	/**
	 * Returns the value of the locPinX element in pixels.
	 * @return Numerical value of the pinY element.
	 */
	public double getLocPinX()
	{
		return getScreenNumericalValue(this.getShapeNode(mxVsdxConstants.LOC_PIN_X), 0);
	}

	/**
	 * Returns the value of the locPinY element in pixels.
	 * @return Numerical value of the locPinY element.
	 */
	public double getLocPinY()
	{
		return getScreenNumericalValue(this.getShapeNode(mxVsdxConstants.LOC_PIN_Y), 0);

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

		opacity = getNumericalValue(this.getCellElement(key), 0);

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
		String gradient = "";
		String fillPattern = this.getText(this.getCellElement(mxVsdxConstants.FILL_PATTERN), "0");

		if (fillPattern.equals("25") || fillPattern.equals("27") || fillPattern.equals("28") || fillPattern.equals("30"))
		{
			gradient = this.getColor(this.getCellElement(mxVsdxConstants.FILL_BKGND));
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
		String fillPattern = this.getText(this.getCellElement(mxVsdxConstants.FILL_PATTERN), "0");

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
	public double getRotation()
	{
		double rotation = Double.valueOf(this.getText(this.getCellElement(mxVsdxConstants.ANGLE), "0"));

		rotation = Math.toDegrees(rotation);
		rotation = rotation % 360;
		rotation = rotation * 100/100;

		return 360 - rotation;
	}

	/**
	 * Returns the top spacing of the label in pixels.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Top spacing in double precision.
	 */
	public double getTopSpacing()
	{
		double topMargin = this.getTextTopMargin();
		topMargin = (topMargin / 2 - 2.8) * 100/100;
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
		bottomMargin = (bottomMargin / 2 - 2.8) * 100/100;
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
		leftMargin = (leftMargin / 2 - 2.8) * 100/100;
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
		rightMargin = (rightMargin / 2 - 2.8) * 100/100;
		return rightMargin;
	}

	/**
	 * Returns the vertical align of the label.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Vertical align (bottom, middle and top)
	 */
	public String getAlignVertical()
	{
		String vertical = mxConstants.ALIGN_MIDDLE;

		int align = Integer.parseInt(getText(this.getCellElement(mxVsdxConstants.VERTICAL_ALIGN), "1"));

		if (align == 0)
		{
			vertical = mxConstants.ALIGN_TOP;
		}
		else if (align == 2)
		{
			vertical = mxConstants.ALIGN_BOTTOM;
		}

		return vertical;
	}


	/**
	 * Checks if the label must be rotated.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Returns <code>true<code/> if the label must remains horizontal.
	 */
	public boolean getLabelRotation()
	{
		boolean hor = true;
		//Defines rotation.
		double rotation = this.getRotation();
		double angle = Double.valueOf(this.getText(this.getCellElement(mxVsdxConstants.TXT_ANGLE), "0"));
		
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
		Map<String, String> styleMap = new HashMap<String, String>();

		//Set the style of the labels.

		//Defines rotation.
		double rotation = this.getRotation();
		rotation = Math.round(rotation);
		
		//Defines Label Rotation
		String rotationString = getLabelRotation() ? "1" : "0";

		if (!rotationString.equals("1") && rotation != 90 && rotation != 270)
		{
			styleMap.put(mxConstants.STYLE_HORIZONTAL, rotationString);
		}

		if (rotation != 0 && rotation != 360)
		{
			rotation = rotation * 100/100;

			styleMap.put(mxConstants.STYLE_ROTATION, Double.toString(rotation));
		}

		styleMap.put("vsdxID", this.getId().toString());
		
		/** FILLCOLOR **/
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

			if (!gradientDirection.equals("") && !gradientDirection.equals(mxConstants.DIRECTION_SOUTH))
			{
				styleMap.put(mxConstants.STYLE_GRADIENT_DIRECTION, gradientDirection);
			}
		}
		else
		{
			styleMap.put(mxConstants.STYLE_GRADIENTCOLOR, "none");
		}

		double opacity = this.getOpacity(mxVsdxConstants.FILL_FOREGND_TRANS);

		if (opacity < 100)
		{
			styleMap.put(mxConstants.STYLE_FILL_OPACITY, Double.toString(opacity));
		}

		opacity = this.getOpacity(mxVsdxConstants.LINE_COLOR_TRANS);

		if (opacity < 100)
		{
			styleMap.put(mxConstants.STYLE_STROKE_OPACITY, Double.toString(opacity));
		}
		
		Map<String, String> form = getForm();

		if (form.containsKey(mxConstants.STYLE_SHAPE) && 
				(form.get(mxConstants.STYLE_SHAPE).startsWith("image;")))
		{
			styleMap.put(mxConstants.STYLE_WHITE_SPACE, "wrap");
		}

		styleMap.putAll(form);

		//Defines if line is rounding
		if(form.containsKey(mxConstants.STYLE_ROUNDED) && !form.get(mxConstants.STYLE_ROUNDED).equals("0"))
		{
			boolean isRounded = isRounded();

			if (isRounded)
			{
				styleMap.put(mxConstants.STYLE_ROUNDED, mxVsdxConstants.TRUE);
			}
		}

		//Defines line Pattern
		if (isDashed())
		{
			styleMap.put(mxConstants.STYLE_DASHED, "1");
		}
		
		String color = getStrokeColor();
		double tr = this.getStrokeTransparency();
		
		this.styleDebug("ID = " + id + " , Color = " + color + " , stroke transparency = " + tr);

		if (!color.equals("") && tr != 1)
		{
			styleMap.put(mxConstants.STYLE_STROKECOLOR, color);
		}
		else
		{
			//styleMap.put(mxConstants.STYLE_STROKECOLOR, "none");
		}

		//Defines the line width
		double lWeight = getLineWidth() * 100/100;

		if (lWeight != 1)
		{
			styleMap.put(mxConstants.STYLE_STROKEWIDTH, Double.toString(lWeight));
		}

		/** SHADOW **/
		if (isShadow())
		{
			styleMap.put(mxConstants.STYLE_SHADOW, mxVsdxConstants.TRUE);
		}

		//Defines label top spacing
		double topMargin = getTopSpacing() * 100/100;

		if (topMargin != 0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_TOP, Double.toString(topMargin));
		}

		//Defines label bottom spacing
		double bottomMargin = getBottomSpacing() * 100/100;

		if (bottomMargin != 0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_BOTTOM, Double.toString(bottomMargin));
		}

		//Defines label left spacing
		double leftMargin = getLeftSpacing() * 100/100;

		if (leftMargin != 0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_LEFT, Double.toString(leftMargin));
		}

		//Defines label right spacing
		double rightMargin = getRightSpacing() * 100/100;

		if(rightMargin !=0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_RIGHT, Double.toString(rightMargin));
		}

		//Defines label vertical align
		String verticalAlign = getAlignVertical();

		if(verticalAlign != mxConstants.ALIGN_MIDDLE)
		{
			styleMap.put(mxConstants.STYLE_VERTICAL_ALIGN, verticalAlign);
		}

		String direction = getDirection(form);

		if (direction != mxConstants.DIRECTION_EAST)
		{
			styleMap.put(mxConstants.STYLE_DIRECTION, direction);
		}
		
		Element xForm = (Element) shape.getElementsByTagName(mxVsdxConstants.X_FORM).item(0);
		
		if (xForm != null)
		{
			Node flipX = xForm.getElementsByTagName(mxVsdxConstants.FLIP_X).item(0); 
			Node flipY = xForm.getElementsByTagName(mxVsdxConstants.FLIP_Y).item(0); 
			
			if (flipX != null && flipX.getTextContent().equals("1"))
			{
				styleMap.put(mxConstants.STYLE_FLIPH, "1");
			}
			
			if (flipY != null && flipY.getTextContent().equals("1"))
			{
				styleMap.put(mxConstants.STYLE_FLIPV, "1");
			}
		}
/*		
		Optional code for moving the style inside the html label to the shape's style
		pro:
			- label can be manipulated with the UI buttons
		con:
			- only a single style is allowed in a label
*/
		
		if (this.htmlLabels)
		{
			String label = getTextLabel();
			
			if (label != null)
			{		
				if (label.startsWith("<table>") || label.startsWith("<table "))
				{
					styleMap.put("overflow", "fill");
				}
				
				String masterId = this.getMasterId();
				Shape masterShape = null;
	
				if (this.master != null)
				{
					if (masterId != null)
					{
						masterShape = this.master.getMasterShape();
					}
					else 
					{
						masterShape = this.master.getSubShape(this.getShapeMasterId());
					}
				}
	
				mxVsdxTextParser vtp = new mxVsdxTextParser(this, masterShape, textStyle, pm);
				vtp.getHtmlTextContent();
				
				if (!vtp.getHorAlign(vtp.pp).equals("center"))
				{
					styleMap.put(mxConstants.STYLE_ALIGN, vtp.getHorAlign(vtp.pp));
				}
				
				styleMap.put(mxConstants.STYLE_VERTICAL_ALIGN, vtp.getVerAlign());
				
				if (!vtp.getIndLeft(vtp.pp).equals("0.0"))
				{
					styleMap.put(mxConstants.STYLE_SPACING_LEFT, vtp.getIndLeft(vtp.pp));
				}
				
				if (!vtp.getIndRight(vtp.pp).equals("0.0"))
				{
					styleMap.put(mxConstants.STYLE_SPACING_RIGHT, vtp.getIndRight(vtp.pp));
				}
				
				if (!vtp.getSpcBefore(vtp.pp).equals("0.0"))
				{
					styleMap.put(mxConstants.STYLE_SPACING_TOP, vtp.getSpcBefore(vtp.pp));
				}
				
				if (!vtp.getSpcAfter(vtp.pp).equals("0.0"))
				{
					styleMap.put(mxConstants.STYLE_SPACING_BOTTOM, vtp.getSpcAfter(vtp.pp));
				}
			}
		}

		return resolveCommonStyles(styleMap);
	}

	/**
	 * Checks if the lines of the shape are dashed.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Returns <code>true</code> if the lines of the shape are dashed.
	 */
	public boolean isDashed()
	{
		String linePattern = this.getText(this.getCellElement(mxVsdxConstants.LINE_PATTERN), "0");

		if (linePattern.equals("Themed"))
		{
			// TODO find the theme
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
		double lWeight = 1;

		if (this.hasLineWeight())
		{
			lWeight = this.getLineWeight();
		}
		else if ((masterShape != null) && masterShape.hasLineWeight())
		{
			lWeight = masterShape.getLineWeight();
		}
		else if ((lineStyle != null) && lineStyle.hasLineWeight())
		{
			lWeight = lineStyle.getLineWeight();
		}

		//Value is fixed for weight < 1
		if (lWeight < 1)
		{
			lWeight *= 2;
		}

		lWeight = lWeight * 100/100;
		
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
		String baSize = getText(this.getCellElement(mxVsdxConstants.BEGIN_ARROW_SIZE), "4");
		
		try
		{
			return VsdxShape.arrowSizes[Integer.valueOf(baSize).intValue()];
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
		String eaSize = getText(this.getCellElement(mxVsdxConstants.END_ARROW_SIZE), "4");

		try
		{
			return VsdxShape.arrowSizes[Integer.valueOf(eaSize).intValue()];
		}
		catch (Exception e)
		{
			// ignore
		}
		
		return 4;
	}

	/**
	 * Returns if the line is Rounded.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return Returns <code>mxVdxConstants.TRUE</code> if the line is Rounded.
	 */
	public boolean isRounded()
	{
		String val = getText(this.getCellElement(mxVsdxConstants.ROUNDING), "0");
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

		String shdw = this.getText(this.getCellElement(mxVsdxConstants.SHDW_PATTERN), "0");
		
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


		if (this.getMaster() != null && this.getMaster().getMasterElement() != null)
		{
			if (this.getMaster().getMasterElement().hasAttribute(mxVsdxConstants.NAME_U))
			{
				masterNameU = this.getMaster().getMasterElement().getAttribute(mxVsdxConstants.NAME_U);
			}
		}

		//check for shape name/type, because of different (shape specific) treatment of each
		if (nameU.startsWith("Organizational unit") 
				|| masterNameU.startsWith("Organizational unit"))
		{
			Element control = (Element) shape.getElementsByTagName(mxVsdxConstants.CONTROL).item(0);

			Element xEl = null;
			String xS = "0.0";
			Element yEl = null;
			String yS = "-0.4";

			if (control != null)
			{
				xEl = (Element) control.getElementsByTagName(mxVsdxConstants.X).item(0);
				
				if (xEl.hasAttribute("F"))
				{
					xS = xEl.getAttribute("F");
				}
				else
				{
					xS = xEl.getTextContent();
				}
				
				yEl = (Element) control.getElementsByTagName(mxVsdxConstants.Y).item(0);
				
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

				if(currStyle.startsWith("tabHeight="))
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
			Element control = (Element) shape.getElementsByTagName(mxVsdxConstants.CONTROL).item(0);

			Element xEl = null;
			String xS = "0.0";
			Element yEl = null;
			String yS = "-0.4";

			if (control != null)
			{
				xEl = (Element) control.getElementsByTagName(mxVsdxConstants.X).item(0);
				xS = xEl.getAttribute("F");
				yEl = (Element) control.getElementsByTagName(mxVsdxConstants.Y).item(0);
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

		if (shapeName != null && !shapeName.equals("") && VsdxShape.USE_SHAPE_MATCH)
		{
			String trans = mxResources.get(shapeName);
			
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
				String foreignType = "";
				this.styleDebug("shape type = " + type);

				if (this.imageData != null)
				{
					result.put("shape", "image");
					result.put("aspect", "fixed");
					String iType = this.imageData.get("iType");
					String iData = this.imageData.get("iData");
					result.put("image", "data:image/" + iType + "," + iData);
					return result;
				}
						
				String parsedGeom = "";

				if (this.masterShape != null)
				{
					this.masterShape.debug = this.debug;
					parsedGeom = this.masterShape.parseGeom();
				}
				else
				{
					this.styleDebug("No master shape found when looking for geom");
				}
				
				if (parsedGeom.equals(""))
				{
					parsedGeom = this.parseGeom();
					this.styleDebug("No master shape geom found");
				}
				
				if (parsedGeom.equals(""))
				{
					this.styleDebug("No geom found");
					return result;
				}
	
				String stencil = URLEncoder.encode(parsedGeom, "UTF-8")
				        .replaceAll("\\+", "%20")
				        .replaceAll("\\%21", "!")
				        .replaceAll("\\%27", "'")
				        .replaceAll("\\%28", "(")
				        .replaceAll("\\%29", ")")
				        .replaceAll("\\%7E", "~");
				
				byte[] bytes = stencil.getBytes("UTF-8");
				Deflater deflater = new Deflater(Deflater.BEST_COMPRESSION, true);
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
		
				byte[] encoded = Base64.encodeBase64(output);
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

		if (name.equals("Off-page reference") || name.equals("Lined/Shaded process"))
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
		String offsetS = (String) mxResources.get("mxOffset" + shapeName);
		
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
		//result.put("rounded", isEdgeRounded());
		//return result;

		//result.put("curved", "1");
		//return result;

		//return null;
	}
	
	/**
	 * @return 1 if Visio edge is rounded, 0 if square
	 */
	private String isEdgeRounded()
	{
		if (shape != null)
		{
			NodeList lineList = shape.getElementsByTagName(mxVsdxConstants.LINE);
			Element firstLine = (Element) lineList.item(0);
			
			if (firstLine != null)
			{
				Element firstRounding = (Element) firstLine.getElementsByTagName(mxVsdxConstants.ROUNDING).item(0);
				String rounding = firstRounding.getTextContent();
				
				if (rounding != null && !rounding.equals("") && !rounding.equals("0") && !rounding.equals("0.0"))
				{
					return "1";
				}
			}
		}
		
		return "0";
	}

	public Map<Integer, VsdxShape> getChildShapes()
	{
		return childShapes;
	}

	public void setChildShapes(Map<Integer, VsdxShape> childShapes)
	{
		this.childShapes = childShapes;
	}
	
	/**
	 * @return true if shape has a control element that specifies label position
	 */
	public boolean hasLabelControl()
	{
		String txtPinXF = this.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_PIN_X, "F", "");
		String txtPinYF = this.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_PIN_X, "F", "");

		Shape masterShape = master != null ? master.getMasterShape() : null;

		if (masterShape != null)
		{
			if (txtPinXF == "" || txtPinXF.toLowerCase().equals("inh"))
			{
				txtPinXF = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_PIN_X, "F", "");
			}

			if (txtPinYF == "" || txtPinYF.toLowerCase().equals("inh"))
			{
				txtPinYF = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_PIN_Y, "F", "");
			}
		}


		if ((txtPinXF != "" && txtPinYF != "") && 
				(txtPinXF.contains("GUARD(Controls.Row_") || txtPinYF.contains("GUARD(Controls.Row_")))
		{
			return true;
		}

		return false;
	}

	/**
	 * @return true if shape has a control element that specifies label position (checks for the variant that uses entries in the <b>Scratch</b> cell)
	 */
	public boolean hasScratchControl()
	{
		String xConF = this.getAttribute(mxVsdxConstants.CONTROL, mxVsdxConstants.X_CON, "F", "");
		String yConF = this.getAttribute(mxVsdxConstants.CONTROL, mxVsdxConstants.Y_CON, "F", "");

		Shape masterShape = master != null ? master.getMasterShape() : null;

		if (masterShape != null)
		{
			if (xConF == "" || xConF.toLowerCase().equals("inh"))
			{
				xConF = masterShape.getAttribute(mxVsdxConstants.CONTROL, mxVsdxConstants.X_CON, "F", "");
			}

			if (yConF == "" || yConF.toLowerCase().equals("inh"))
			{
				yConF = masterShape.getAttribute(mxVsdxConstants.CONTROL, mxVsdxConstants.Y_CON, "F", "");
			}
		}

		if (xConF.contains("4-2*Scratch.A") || yConF.contains("4-2*Scratch.B"))
		{
			if (this.getText() != null || this.masterShape.getText() != null)
			{
				return true;
			}
		}

		return false;
	}
	
	public boolean isDisplacedLabel()
	{
		String txtPinXF = this.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_PIN_X, "F", "");
		String txtPinYF = this.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_PIN_Y, "F", "");
		String txtWidthF = this.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_WIDTH, "F", "");
		String txtHeightF = this.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_HEIGHT, "F", "");

		Shape masterShape = master != null ? master.getMasterShape() : null;

		if (masterShape != null)
		{
			if (txtPinXF == "" || txtPinXF.toLowerCase().equals("inh"))
			{
				txtPinXF = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_PIN_X, "F", "");
			}

			if (txtPinYF == "" || txtPinYF.toLowerCase().equals("inh"))
			{
				txtPinYF = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_PIN_Y, "F", "");
			}

			if (txtWidthF == "" || txtWidthF.toLowerCase().equals("inh"))
			{
				txtWidthF = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_WIDTH, "F", "");
			}

			if (txtHeightF == "" || txtHeightF.toLowerCase().equals("inh"))
			{
				txtHeightF = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_HEIGHT, "F", "");
			}
		}

		if (txtPinXF.toLowerCase().equals("width*0.5") &&
				txtPinYF.toLowerCase().equals("height*0.5") &&
				txtWidthF.toLowerCase().equals("width*1") &&
				txtHeightF.toLowerCase().equals("height*1"))
		{
			return false;
		}
		else if (txtPinXF.toLowerCase().startsWith("width*") &&
				txtPinYF.toLowerCase().startsWith("height*") &&
				txtWidthF.toLowerCase().startsWith("width*") &&
				txtHeightF.toLowerCase().startsWith("height*"))
//		else if (txtPinXF.toLowerCase().startsWith("width*") &&
//				txtPinYF.toLowerCase().startsWith("height*"))
		{
			return true;
		}
		else if (txtPinXF.toLowerCase().startsWith("controls.row_") ||
				txtPinYF.toLowerCase().startsWith("controls.row_"))
		{
			return true;
		}

		return false;
	}
	
	public boolean isRotatedLabel()
	{
		String txtAngleValue = this.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_ANGLE, "V", "");

		Shape masterShape = master != null ? master.getMasterShape() : null;

		if (masterShape != null)
		{
			if (txtAngleValue.equals(""))
			{
				txtAngleValue = masterShape.getAttribute(mxVsdxConstants.TEXT_X_FORM, mxVsdxConstants.TXT_ANGLE, "V", "");
			}

		}

		if (!txtAngleValue.equals("0") && !txtAngleValue.equals("0.0") && !txtAngleValue.equals(""))
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
		double startX = getScreenNumericalValue(this.getCellElement(mxVsdxConstants.BEGIN_X), 0);
		double startY = parentHeight - getScreenNumericalValue(this.getCellElement(mxVsdxConstants.BEGIN_Y), 0);

		return new mxPoint(startX, startY);
	}

	/**
	 * Returns the coordinates of the end point of an Edge Shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return mxPoint that represents the coordinates.
	 */
	public mxPoint getEndXY(double parentHeight)
	{
		double endX = getScreenNumericalValue(this.getCellElement(mxVsdxConstants.END_X), 0);
		double endY = parentHeight- getScreenNumericalValue(this.getCellElement(mxVsdxConstants.END_Y), 0);

		return new mxPoint(endX, endY);
	}
	
	/**
	 * Returns the list of routing points of a edge shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return List of mxPoint that represents the routing points.
	 */
	public List<mxPoint> getRoutingPoints(double parentHeight, mxPoint startPoint)
	{
		List<mxPoint> points = new ArrayList<mxPoint>();
		
		if (!(this.hasGeom()))
		{
			return points;
		}
		
		int controlPointCount = 0;
		int currentPointCount = 0;
		double lastX = startPoint.getX();
		double lastY = startPoint.getY();
		
		for (int i = 0; i < 2; i++)
		{
			for (int j = 0; j < geom.size(); j++)
			{
				Node child = geom.get(j).getFirstChild();
				
				while (child != null)
				{
					if (child instanceof Element)
					{
						Element childElem = (Element) child;
						String childName = childElem.getNodeName();
						String del = childElem.getAttribute("Del");
						
						if (childName.equals("Cell"))
						{
							childName = childElem.getAttribute("N");
						}
						else if (childName.equals("Row"))
						{
							childName = childElem.getAttribute("T");
						}
						
						if (!del.equals("1"))
						{
							switch (childName)
							{
								case "LineTo":
									if (i == 0)
									{
										controlPointCount++;
									}
									else if (currentPointCount < controlPointCount - 1)
									{
										Map <String, String> children = getChildValues(childElem, null);
										String xValue = children.get("X");
										String yValue = children.get("Y");
										double x = 0, y = 0;
											
										if (xValue != null)
										{
											x = Double.parseDouble(xValue) * mxVsdxUtils.conversionFactor;
											lastX = x;
											x += startPoint.getX();
										}
										else
										{
											x = lastX;
										}
										
										if (yValue != null)
										{
											y = (Double.parseDouble(yValue) * mxVsdxUtils.conversionFactor) * -1;
											lastY = y;
											y += startPoint.getY();
										}
										else
										{
											y = lastY;
										}
										
										x = Math.round(x * 100.0) / 100.0;
										y = Math.round(y * 100.0) / 100.0;
			
										points.add(new mxPoint(x, y));
										currentPointCount++;
									}
									break;
								default:
									break;
									
							}
						}
					}
	
					child = child.getNextSibling();
				}
			}
		}

		return points;
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
			NodeList geomList = shape.getElementsByTagName(mxVsdxConstants.GEOM);

			if (geomList.getLength() > 0)
			{
				Element firstGeom = (Element) geomList.item(0);
				Element firstNURBS = (Element) firstGeom.getElementsByTagName(mxVsdxConstants.NURBS_TO).item(0);
				Element firstE = (Element) firstNURBS.getElementsByTagName("E").item(0);
				
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
						currPoint.setX(finalX);
						currPoint.setY(startXY.getY() - heightFixed * rawY);
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
		Map<String, String> styleMap = new Hashtable<String, String>();
		styleMap.put("vsdxID", this.getId().toString());

		//Defines Edge Shape
		Map<String, String> edgeShape = getForm();

		if (edgeShape != null && !edgeShape.equals(""))
		{
			styleMap.putAll(edgeShape);
		}

		//Defines Pattern
		String dashed = isDashed() ? "1" : "0";

		if (dashed.equals("1"))
		{
			styleMap.put(mxConstants.STYLE_DASHED, dashed);
		}

		//Defines Begin Arrow
		String startArrow = getEdgeMarker(true);

		if(startArrow != null)
		{
			styleMap.put(mxConstants.STYLE_STARTARROW, startArrow);
		}

		//Defines End Arrow
		String endArrow = getEdgeMarker(false);

		if(endArrow != null)
		{
			styleMap.put(mxConstants.STYLE_ENDARROW, endArrow);
		}

		//Defines the start arrow size.
		float saSize = getStartArrowSize() * 100/100;

		if (saSize != 6)
		{
			styleMap.put(mxConstants.STYLE_STARTSIZE, Float.toString(saSize));
		}

		//Defines the end arrow size.
		float faSize = getFinalArrowSize() * 100/100;

		if (faSize != 6)
		{
			styleMap.put(mxConstants.STYLE_ENDSIZE, Float.toString(faSize));
		}

		//Defines the line width
		double lWeight = getLineWidth() * 100/100;

		if (lWeight != 1.0)
		{
			styleMap.put(mxConstants.STYLE_STROKEWIDTH, Double.toString(lWeight));
		}

		//Defines color
		String color = getStrokeColor();

		if (!color.equals(""))
		{
			styleMap.put(mxConstants.STYLE_STROKECOLOR, color);
		}

		/** SHADOW **/
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
		double topMargin = getTopSpacing() * 100/100;
		styleMap.put(mxConstants.STYLE_SPACING_TOP, Double.toString(topMargin));

		//Defines label bottom spacing
		double bottomMargin = getBottomSpacing() * 100/100;
		styleMap.put(mxConstants.STYLE_SPACING_BOTTOM, Double.toString(bottomMargin));

		//Defines label left spacing
		double leftMargin = getLeftSpacing() * 100/100;
		styleMap.put(mxConstants.STYLE_SPACING_LEFT, Double.toString(leftMargin));

		//Defines label right spacing
		double rightMargin = getRightSpacing() * 100/100;
		styleMap.put(mxConstants.STYLE_SPACING_RIGHT, Double.toString(rightMargin));

		//Defines label vertical align
		String verticalAlign = getAlignVertical();
		styleMap.put(mxConstants.STYLE_VERTICAL_ALIGN, verticalAlign);

		//Defines Label Rotation
		//		styleMap.put(mxConstants.STYLE_HORIZONTAL, getLabelRotation());

		//Adds html encoding - may need further elaboration
		styleMap.put("html", "1");

		return resolveCommonStyles(styleMap);
	}
	
	/**
	 * Analyzes a edge shape and returns a string with the style.
	 * @return style read from the edge shape.
	 */
	public Map<String, String> resolveCommonStyles(Map<String, String> styleMap)
	{
		/** LABEL BACKGROUND COLOR **/
		String lbkgnd = this.getTextBkgndColor(this.getCellElement(mxVsdxConstants.TEXT_BKGND));

		if (!lbkgnd.equals(""))
		{
			styleMap.put(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, lbkgnd);
		}
		
		return styleMap;
	}

	/**
	 * Returns the arrow of the line.
	 * @return Type of arrow.
	 */
	public String getEdgeMarker(boolean start)
	{
		String marker = this.getText(this.getCellElement(start ? mxVsdxConstants.BEGIN_ARROW : mxVsdxConstants.END_ARROW), "0");
		return VsdxShape.arrowTypes.get(marker);
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
	
	protected Element getCellElement(String cellKey, Integer index, String sectKey)
	{
		Element elem = super.getCellElement(cellKey, index, sectKey);
		
		if (elem == null && this.masterShape != null)
		{
			return this.masterShape.getCellElement(cellKey, index, sectKey);
		}
		
		return elem;
	}
}