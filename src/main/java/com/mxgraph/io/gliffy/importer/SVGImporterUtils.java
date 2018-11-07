package com.mxgraph.io.gliffy.importer;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Class is used to stripe large unused white areas on SVG files and return only important parts.
 * For example, if you have centered square of 50x50 size on 200x200 canvas this class will remove 
 * unused portions of the canvas and return larger square from the center.
 *
 */
public class SVGImporterUtils
{

	private static final Pattern SVG_PATTERN = Pattern.compile("viewBox=\"(.*?)\"");

	private final static Logger LOGGER = Logger.getLogger(SVGImporterUtils.class.getName());

	public SVGImporterUtils()
	{
	}

	/**
	 * This is main method that will return new viewBox value. Then we use this value to update existing SVG string in Gliffy object.
	 * 
	 * @param svgString original SVG string from Gliffy Object.
	 * @return recalculated viewBox parameters as a String
	 */
	public String setViewBox(String svgString)
	{
		try
		{
			Matcher m = SVG_PATTERN.matcher(svgString);
			while (m.find())
			{
				String oldViewBox = m.group();
				String newViewBox = getNewViewBox(svgString);
				if (newViewBox != null)
				{
					return svgString.replace(oldViewBox, newViewBox);
				}
			}
		}
		catch (Throwable exc)
		{
			//perfectly fine to blow-up, just ignore - original string will be returned if something goes wrong
			LOGGER.log(Level.WARNING, "Cannot set viewBox for: " + svgString + " with error " + exc);
		}

		return svgString;
	}

	private String getNewViewBox(String svgString) throws Exception
	{
		String result = null;
		Object svg = createSVGDocument(svgString);
		buildDocument(svg);
		result = getViewBoxString(svg);
		return result;
	}

	private Object createSVGDocument(String svgString) throws Exception
	{
		InputStream stream = new ByteArrayInputStream(svgString.getBytes(StandardCharsets.UTF_8));
		Class<?> myClass = Class.forName("org.apache.batik.dom.svg.SAXSVGDocumentFactory");
		Method myMethod = myClass.getDeclaredMethod("createSVGDocument", String.class, InputStream.class);
		String param = null;
		Object newInstance = myClass.getConstructor(String.class).newInstance(param);
		Object o = myMethod.invoke(newInstance, "http://www.w3.org/2000/svg", stream);
		return o;
	}

	private void buildDocument(Object svg) throws Exception
	{
		Class<?> bridgeContextClass = Class.forName("org.apache.batik.bridge.BridgeContext");
		Class<?> userAgentAdapterClass = Class.forName("org.apache.batik.bridge.UserAgentAdapter");
		Class<?> userAgentClass = Class.forName("org.apache.batik.bridge.UserAgent");
		Class<?> gvtBuilderClass = Class.forName("org.apache.batik.bridge.GVTBuilder");
		Class<?> documentClass = Class.forName("org.w3c.dom.Document");

		Method myBuildMethod = gvtBuilderClass.getDeclaredMethod("build", bridgeContextClass, documentClass);
		Object newBuilderInstance = gvtBuilderClass.getConstructor().newInstance();
		Object newUserAgentAdapterInstance = userAgentAdapterClass.getConstructor().newInstance();
		Object newBridgeContextClass = bridgeContextClass.getConstructor(userAgentClass).newInstance(newUserAgentAdapterInstance);
		myBuildMethod.invoke(newBuilderInstance, newBridgeContextClass, svg);

	}

	private String getViewBoxString(Object svg) throws Exception
	{
		Class<?> svgDocumentClass = Class.forName("org.apache.batik.dom.svg.SVGOMDocument");
		Class<?> svgSVGElement = Class.forName("org.apache.batik.dom.svg.SVGOMSVGElement");
		Class<?> svgRect = Class.forName("org.w3c.dom.svg.SVGRect");

		Method getRootElement = svgDocumentClass.getDeclaredMethod("getRootElement");
		Method getBBox = svgSVGElement.getDeclaredMethod("getBBox");
		Method getX = svgRect.getDeclaredMethod("getX");
		Method getY = svgRect.getDeclaredMethod("getY");
		Method getHeight = svgRect.getDeclaredMethod("getHeight");
		Method getWidth = svgRect.getDeclaredMethod("getWidth");

		Object root = getRootElement.invoke(svg);
		Object bbox = getBBox.invoke(root);
		Object x = getX.invoke(bbox);
		Object y = getY.invoke(bbox);
		Object height = getHeight.invoke(bbox);
		Object width = getWidth.invoke(bbox);

		String result = String.format("viewBox=\"%s %s %s %s\"", getIntValue(x.toString()), getIntValue(y.toString()),
				getIntValue(width.toString()), getIntValue(height.toString()));
		return result;

	}

	private String getIntValue(String value)
	{
		int dot = value.indexOf(".");
		if (dot > 0)
		{
			return value.substring(0, dot);
		}
		return value;
	}

}
