/**
 * Copyright (c) 2007, Gaudenz Alder
 */

package com.mxgraph.reader;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.canvas.mxICanvas;
import com.mxgraph.canvas.mxImageCanvas;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;

/**
 * A converter that renders display XML data onto a graphics canvas. This
 * reader can only be used to generate images for encoded graph views.
 */
public class mxGraphViewImageReader extends mxGraphViewReader
{

	/**
	 * Specifies the background color. Default is null.
	 */
	protected Color background;

	/**
	 * Specifies if the image should be anti-aliased. Default is true.
	 */
	protected boolean antiAlias;

	/**
	 * Specifies the border which is added to the size of the graph. Default is
	 * 0.
	 */
	protected int border;

	/**
	 * Specifies the border which is added to the size of the graph. Default is
	 * true.
	 */
	protected boolean cropping;

	/**
	 * Defines the clip to be drawn. Default is null.
	 */
	protected mxRectangle clip;

	/**
	 * Constructs a new reader with a transparent background.
	 */
	public mxGraphViewImageReader()
	{
		this(null);
	}

	/**
	 * Constructs a new reader with the given background color.
	 */
	public mxGraphViewImageReader(Color background)
	{
		this(background, 0);
	}

	/**
	 * Constructs a new reader with a transparent background.
	 */
	public mxGraphViewImageReader(Color background, int border)
	{
		this(background, border, true);
	}

	/**
	 * Constructs a new reader with a transparent background.
	 */
	public mxGraphViewImageReader(Color background, int border,
			boolean antiAlias)
	{
		this(background, border, antiAlias, true);
	}

	/**
	 * Constructs a new reader with a transparent background.
	 */
	public mxGraphViewImageReader(Color background, int border,
			boolean antiAlias, boolean cropping)
	{
		setBackground(background);
		setBorder(border);
		setAntiAlias(antiAlias);
		setCropping(cropping);
	}

	/**
	 * 
	 */
	public Color getBackground()
	{
		return background;
	}

	/**
	 * 
	 */
	public void setBackground(Color background)
	{
		this.background = background;
	}

	/**
	 * 
	 */
	public int getBorder()
	{
		return border;
	}

	/**
	 * 
	 */
	public void setBorder(int border)
	{
		this.border = border;
	}

	/**
	 * 
	 */
	public boolean isAntiAlias()
	{
		return antiAlias;
	}

	/**
	 * 
	 */
	public void setAntiAlias(boolean antiAlias)
	{
		this.antiAlias = antiAlias;
	}

	/**
	 * Specifies the optional clipping rectangle.
	 */
	public boolean isCropping()
	{
		return cropping;
	}

	/**
	 * 
	 */
	public void setCropping(boolean value)
	{
		this.cropping = value;
	}

	/**
	 * 
	 */
	public mxRectangle getClip()
	{
		return clip;
	}

	/**
	 * 
	 */
	public void setClip(mxRectangle value)
	{
		this.clip = value;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.mxgraph.reader.mxGraphViewReader#createCanvas(java.util.Hashtable)
	 */
	public mxICanvas createCanvas(Map<String, Object> attrs)
	{
		int width = 0;
		int height = 0;
		int dx = 0;
		int dy = 0;

		mxRectangle tmp = getClip();

		if (tmp != null)
		{
			dx -= (int) tmp.getX();
			dy -= (int) tmp.getY();
			width = (int) tmp.getWidth();
			height = (int) tmp.getHeight();
		}
		else
		{
			int x = (int) Math.round(mxUtils.getDouble(attrs, "x"));
			int y = (int) Math.round(mxUtils.getDouble(attrs, "y"));
			width = (int) (Math.round(mxUtils.getDouble(attrs, "width")))
					+ border + 3;
			height = (int) (Math.round(mxUtils.getDouble(attrs, "height")))
					+ border + 3;

			if (isCropping())
			{
				dx = -x + 3;
				dy = -y + 3;
			}
			else
			{
				width += x;
				height += y;
			}
		}

		mxImageCanvas canvas = new mxImageCanvas(createGraphicsCanvas(), width,
				height, getBackground(), isAntiAlias());
		canvas.setTranslate(dx, dy);

		return canvas;
	}

	/**
	 * Hook that creates the graphics canvas.
	 */
	protected mxGraphics2DCanvas createGraphicsCanvas()
	{
		return new mxGraphics2DCanvas();
	}

	/**
	 * Creates the image for the given display XML file. (Note: The XML file is
	 * an encoded mxGraphView, not mxGraphModel.)
	 * 
	 * @param filename
	 *            Filename of the display XML file.
	 * @return Returns an image representing the display XML file.
	 */
	public static BufferedImage convert(String filename,
			mxGraphViewImageReader viewReader)
			throws ParserConfigurationException, SAXException, IOException
	{
		return convert(new InputSource(new FileInputStream(filename)),
				viewReader);
	}

	/**
	 * Creates the image for the given display XML input source. (Note: The XML
	 * is an encoded mxGraphView, not mxGraphModel.)
	 * 
	 * @param inputSource
	 *            Input source that contains the display XML.
	 * @return Returns an image representing the display XML input source.
	 */
	public static BufferedImage convert(InputSource inputSource,
			mxGraphViewImageReader viewReader)
			throws ParserConfigurationException, SAXException, IOException
	{
		BufferedImage result = null;
		
		XMLReader reader = SAXParserFactory.newInstance().newSAXParser().getXMLReader();
		reader.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
		reader.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
		reader.setFeature("http://xml.org/sax/features/external-general-entities", false);
		reader.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
		
		reader.setContentHandler(viewReader);
		reader.parse(inputSource);

		if (viewReader.getCanvas() instanceof mxImageCanvas)
		{
			result = ((mxImageCanvas) viewReader.getCanvas()).destroy();
		}

		return result;
	}

}
