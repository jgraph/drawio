package com.mxgraph.reader;

import java.util.Hashtable;
import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.mxgraph.canvas.mxICanvas2D;

/**
 *
	public static void main(String[] args)
	{
		try
		{
			String filename = Test.class.getResource(
					"/com/mxgraph/online/exported.xml").getPath();
			String xml = mxUtils.readFile(filename);
			System.out.println("xml=" + xml);

			Document doc = mxUtils.parseXml(xml);
			Element root = doc.getDocumentElement();
			int width = Integer.parseInt(root.getAttribute("width"));
			int height = Integer.parseInt(root.getAttribute("height"));

			System.out.println("width=" + width + " height=" + height);

			BufferedImage img = mxUtils.createBufferedImage(width, height,
					Color.WHITE);
			Graphics2D g2 = img.createGraphics();
			mxUtils.setAntiAlias(g2, true, true);
			mxDomOutputParser reader = new mxDomOutputParser(
					new mxGraphicsExportCanvas(g2));
			reader.read((Element) root.getFirstChild().getNextSibling());

			ImageIO.write(img, "PNG", new File(
					"C:\\Users\\Gaudenz\\Desktop\\test.png"));
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	// -------------
	
	Document doc = mxUtils.parseXml(xml);
	Element root = doc.getDocumentElement();
	mxDomOutputParser reader = new mxDomOutputParser(canvas);
	reader.read(root.getFirstChild());
 */
public class mxDomOutputParser
{
	/**
	 * 
	 */
	protected mxICanvas2D canvas;

	/**
	 * 
	 */
	protected transient Map<String, IElementHandler> handlers = new Hashtable<String, IElementHandler>();

	/**
	 * 
	 */
	public mxDomOutputParser(mxICanvas2D canvas)
	{
		this.canvas = canvas;
		initHandlers();
	}

	/**
	 * 
	 */
	public void read(Node node)
	{
		while (node != null)
		{
			if (node instanceof Element)
			{
				Element elt = (Element) node;
				IElementHandler handler = handlers.get(elt.getNodeName());

				if (handler != null)
				{
					handler.parseElement(elt);
				}
			}

			node = node.getNextSibling();
		}
	}

	/**
	 * 
	 */
	protected void initHandlers()
	{
		handlers.put("save", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.save();
			}
		});

		handlers.put("restore", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.restore();
			}
		});

		handlers.put("scale", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.scale(Double.parseDouble(elt.getAttribute("scale")));
			}
		});

		handlers.put("translate", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.translate(Double.parseDouble(elt.getAttribute("dx")),
						Double.parseDouble(elt.getAttribute("dy")));
			}
		});

		handlers.put("rotate", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.rotate(Double.parseDouble(elt.getAttribute("theta")),
						elt.getAttribute("flipH").equals("1"), elt
								.getAttribute("flipV").equals("1"), Double
								.parseDouble(elt.getAttribute("cx")), Double
								.parseDouble(elt.getAttribute("cy")));
			}
		});

		handlers.put("strokewidth", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setStrokeWidth(Double.parseDouble(elt
						.getAttribute("width")));
			}
		});

		handlers.put("strokecolor", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setStrokeColor(elt.getAttribute("color"));
			}
		});

		handlers.put("dashed", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				String temp = elt.getAttribute("fixDash");
				boolean fixDash = temp != null && temp.equals("1");
				
				canvas.setDashed(elt.getAttribute("dashed").equals("1"), fixDash);
			}
		});

		handlers.put("dashpattern", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setDashPattern(elt.getAttribute("pattern"));
			}
		});

		handlers.put("linecap", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setLineCap(elt.getAttribute("cap"));
			}
		});

		handlers.put("linejoin", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setLineJoin(elt.getAttribute("join"));
			}
		});

		handlers.put("miterlimit", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setMiterLimit(Double.parseDouble(elt
						.getAttribute("limit")));
			}
		});

		handlers.put("fontsize", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setFontSize(Double.parseDouble(elt.getAttribute("size")));
			}
		});

		handlers.put("fontcolor", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setFontColor(elt.getAttribute("color"));
			}
		});

		handlers.put("fontbackgroundcolor", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setFontBackgroundColor(elt.getAttribute("color"));
			}
		});

		handlers.put("fontbordercolor", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setFontBorderColor(elt.getAttribute("color"));
			}
		});

		handlers.put("fontfamily", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setFontFamily(elt.getAttribute("family"));
			}
		});

		handlers.put("fontstyle", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setFontStyle(Integer.parseInt(elt.getAttribute("style")));
			}
		});

		handlers.put("alpha", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setAlpha(Double.parseDouble(elt.getAttribute("alpha")));
			}
		});

		handlers.put("fillalpha", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setFillAlpha(Double.parseDouble(elt.getAttribute("alpha")));
			}
		});
		
		handlers.put("strokealpha", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setStrokeAlpha(Double.parseDouble(elt.getAttribute("alpha")));
			}
		});

		handlers.put("fillcolor", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setFillColor(elt.getAttribute("color"));
			}
		});
		
		handlers.put("shadowcolor", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setShadowColor(elt.getAttribute("color"));
			}
		});
		
		handlers.put("shadowalpha", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setShadowAlpha(Double.parseDouble(elt.getAttribute("alpha")));
			}
		});
		
		handlers.put("shadowoffset", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setShadowOffset(Double.parseDouble(elt.getAttribute("dx")),
						Double.parseDouble(elt.getAttribute("dy")));
			}
		});

		handlers.put("shadow", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setShadow(elt.getAttribute("enabled").equals("1"));
			}
		});
		
		handlers.put("gradient", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.setGradient(elt.getAttribute("c1"),
						elt.getAttribute("c2"),
						Double.parseDouble(elt.getAttribute("x")),
						Double.parseDouble(elt.getAttribute("y")),
						Double.parseDouble(elt.getAttribute("w")),
						Double.parseDouble(elt.getAttribute("h")),
						elt.getAttribute("direction"),
						Double.parseDouble(getValue(elt, "alpha1", "1")),
						Double.parseDouble(getValue(elt, "alpha2", "1")));
			}
		});

		handlers.put("rect", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.rect(Double.parseDouble(elt.getAttribute("x")),
						Double.parseDouble(elt.getAttribute("y")),
						Double.parseDouble(elt.getAttribute("w")),
						Double.parseDouble(elt.getAttribute("h")));
			}
		});

		handlers.put("roundrect", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.roundrect(Double.parseDouble(elt.getAttribute("x")),
						Double.parseDouble(elt.getAttribute("y")),
						Double.parseDouble(elt.getAttribute("w")),
						Double.parseDouble(elt.getAttribute("h")),
						Double.parseDouble(elt.getAttribute("dx")),
						Double.parseDouble(elt.getAttribute("dy")));
			}
		});

		handlers.put("ellipse", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.ellipse(Double.parseDouble(elt.getAttribute("x")),
						Double.parseDouble(elt.getAttribute("y")),
						Double.parseDouble(elt.getAttribute("w")),
						Double.parseDouble(elt.getAttribute("h")));
			}
		});

		handlers.put("image", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.image(Double.parseDouble(elt.getAttribute("x")), Double
						.parseDouble(elt.getAttribute("y")), Double
						.parseDouble(elt.getAttribute("w")), Double
						.parseDouble(elt.getAttribute("h")), elt
						.getAttribute("src"), elt.getAttribute("aspect")
						.equals("1"), elt.getAttribute("flipH").equals("1"),
						elt.getAttribute("flipV").equals("1"));
			}
		});

		handlers.put("text", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.text(Double.parseDouble(elt.getAttribute("x")),
						Double.parseDouble(elt.getAttribute("y")),
						Double.parseDouble(elt.getAttribute("w")),
						Double.parseDouble(elt.getAttribute("h")),
						elt.getAttribute("str"),
						elt.getAttribute("align"),
						elt.getAttribute("valign"),
						getValue(elt, "wrap", "").equals("1"),
						elt.getAttribute("format"),
						elt.getAttribute("overflow"),
						getValue(elt, "clip", "").equals("1"),
						Double.parseDouble(getValue(elt, "rotation", "0")),
						elt.getAttribute("dir"));
			}
		});

		handlers.put("begin", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.begin();
			}
		});

		handlers.put("move", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.moveTo(Double.parseDouble(elt.getAttribute("x")),
						Double.parseDouble(elt.getAttribute("y")));
			}
		});

		handlers.put("line", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.lineTo(Double.parseDouble(elt.getAttribute("x")),
						Double.parseDouble(elt.getAttribute("y")));
			}
		});

		handlers.put("quad", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.quadTo(Double.parseDouble(elt.getAttribute("x1")),
						Double.parseDouble(elt.getAttribute("y1")),
						Double.parseDouble(elt.getAttribute("x2")),
						Double.parseDouble(elt.getAttribute("y2")));
			}
		});

		handlers.put("curve", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.curveTo(Double.parseDouble(elt.getAttribute("x1")),
						Double.parseDouble(elt.getAttribute("y1")),
						Double.parseDouble(elt.getAttribute("x2")),
						Double.parseDouble(elt.getAttribute("y2")),
						Double.parseDouble(elt.getAttribute("x3")),
						Double.parseDouble(elt.getAttribute("y3")));
			}
		});

		handlers.put("close", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.close();
			}
		});

		handlers.put("stroke", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.stroke();
			}
		});

		handlers.put("fill", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.fill();
			}
		});

		handlers.put("fillstroke", new IElementHandler()
		{
			public void parseElement(Element elt)
			{
				canvas.fillAndStroke();
			}
		});
	}

	/**
	 * Returns the given attribute value or an empty string.
	 */
	protected String getValue(Element elt, String name, String defaultValue)
	{
		String value = elt.getAttribute(name);

		if (value == null)
		{
			value = defaultValue;
		}

		return value;
	};

	/**
	 * 
	 */
	protected interface IElementHandler
	{
		void parseElement(Element elt);
	}

}
