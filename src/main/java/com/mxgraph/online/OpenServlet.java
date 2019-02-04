/**
 * $Id: OpenServlet.java,v 1.12 2013/10/16 12:31:25 david Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.apache.commons.lang3.StringEscapeUtils;

import com.mxgraph.io.mxCodec;
import com.mxgraph.io.mxGraphMlCodec;
import com.mxgraph.io.gliffy.importer.GliffyDiagramConverter;
import com.mxgraph.util.mxXmlUtils;
import com.mxgraph.view.mxGraph;
import com.mxgraph.view.mxGraphHeadless;

/**
 * Servlet implementation class OpenServlet
 */
public class OpenServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(OpenServlet.class
			.getName());

	/**
	 * 
	 */
	public static String CHARSET_FOR_STRING_URL_ENCODING = "UTF-8";

	/**
	 * Global switch to enabled Gliffy support.
	 */
	public static boolean ENABLE_GLIFFY_SUPPORT = true;

	/**
	 * Global switch to enabled GraphML support.
	 */
	public static boolean ENABLE_GRAPHML_SUPPORT = true;

	/**
	 * 
	 */
	public static final int PNG_CHUNK_ZTXT = 2052348020;

	/**
	 * 
	 */
	public static final int PNG_CHUNK_IEND = 1229278788;

	/**
	 * 
	 */
	protected static String gliffyRegex = "(?s).*\"contentType\":\\s*\"application/gliffy\\+json\".*";

	/**
	 * 
	 */
	protected static String graphMlRegex = "(?s).*<graphml xmlns=\".*";

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public OpenServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		PrintWriter writer = response.getWriter();

		try
		{
			if (request.getContentLength() < Constants.MAX_REQUEST_SIZE)
			{
				String filename = "";
				String format = null;
				String upfile = null;

				ServletFileUpload upload = new ServletFileUpload();
				FileItemIterator iterator = upload.getItemIterator(request);

				while (iterator.hasNext())
				{
					FileItemStream item = iterator.next();
					String name = item.getFieldName();
					InputStream stream = item.openStream();

					if (item.isFormField() && name.equals("format"))
					{
						format = Streams.asString(stream);
					}
					else if (name.equals("upfile"))
					{
						filename = item.getName();
						upfile = Streams.asString(stream,
								Utils.CHARSET_FOR_URL_ENCODING);
					}
				}

				if (format == null)
				{
					format = request.getParameter("format");
				}

				if (format == null)
				{
					format = "html";
				}

				String xml = null;

				if (filename.toLowerCase().endsWith(".png"))
				{
					xml = extractXmlFromPng(
							upfile.getBytes(Utils.CHARSET_FOR_URL_ENCODING));
				}
				else if (upfile != null)
				{
					if (ENABLE_GRAPHML_SUPPORT && upfile.matches(graphMlRegex))
					{
						// Creates a graph that contains a model but does not validate
						// since that is not needed for the model and not allowed on GAE
						mxGraph graph = new mxGraphHeadless();
	
						mxGraphMlCodec.decode(mxXmlUtils.parseXml(upfile), graph);
						xml = mxXmlUtils
								.getXml(new mxCodec().encode(graph.getModel()));
					}
					else if (ENABLE_GLIFFY_SUPPORT && upfile.matches(gliffyRegex))
					{
						GliffyDiagramConverter converter = new GliffyDiagramConverter(
								upfile);
						xml = converter.getGraphXml();
					}
				}

				// Fallback to old data parameter
				if (xml == null)
				{
					xml = (upfile == null) ? request.getParameter("data")
							: upfile;
				}
				
				String ref = request.getHeader("referer");
				
				if (ref != null && ref.toLowerCase()
						.matches("https?://([a-z0-9,-]+[.])*quipelements[.]com/.*"))
				{
					String dom = ref.toLowerCase().substring(0, ref.indexOf(".quipelements.com/") + 17);
					response.addHeader("Access-Control-Allow-Origin", dom);
					response.addHeader("Access-Control-Allow-Methods", "GET");
				}
				
				if (!format.equals("xml"))
				{
					if (xml == null || xml.length() == 0)
					{
						writeScript(writer,
								"window.parent.showOpenAlert({message:window.parent.mxResources.get('invalidOrMissingFile')});");
					}
					else
					{
						// Workaround for replacement char and null byte in IE9 request
						xml = xml.replaceAll("[\\uFFFD\\u0000]*", "");
						writeScript(writer,
								"try{window.parent.setCurrentXml(decodeURIComponent('"
										+ encodeString(xml)
										+ "'), decodeURIComponent('"
										+ encodeString(filename)
										+ "'));}catch(e){window.parent.showOpenAlert({message:window.parent.mxResources.get('notAUtf8File')});}");
					}
				}
				else
				{
					writer.println(xml);
				}
			}
			else
			{
				response.setStatus(
						HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
				writeScript(writer,
						"window.parent.showOpenAlert(window.parent.mxResources.get('drawingTooLarge'));");
			}
		}
		catch (OutOfMemoryError e)
		{
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			writeScript(writer,
					"window.parent.showOpenAlert('Out of memory');");
		}
		catch (Exception e)
		{
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log.log(Level.SEVERE, errors.toString());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			writeScript(writer,
					"window.parent.showOpenAlert(window.parent.mxResources.get('invalidOrMissingFile'));");
		}

		writer.flush();
		writer.close();
	}

	/**
	 * URI encodes the given string for JavaScript.
	 */
	protected String encodeString(String s)
	{
		return StringEscapeUtils.escapeEcmaScript(
				Utils.encodeURIComponent(s, CHARSET_FOR_STRING_URL_ENCODING));
	};

	/**
	 * Writes the given string as a script in a HTML page to the given print writer.
	 */
	protected void writeScript(PrintWriter writer, String js)
	{
		writer.println("<html>");
		writer.println("<body>");
		writer.println("<script type=\"text/javascript\">");
		writer.println(js);
		writer.println("</script>");
		writer.println("</body>");
		writer.println("</html>");
	}

	// NOTE: Key length must not be longer than 79 bytes (not checked)
	protected String extractXmlFromPng(byte[] data)
	{
		Map<String, String> textChunks = decodeCompressedText(
				new ByteArrayInputStream(data));

		return (textChunks != null) ? textChunks.get("mxGraphModel") : null;
	}

	/**
	 * Decodes the zTXt chunk of the given PNG image stream.
	 */
	public static Map<String, String> decodeCompressedText(InputStream stream)
	{
		Map<String, String> result = new Hashtable<String, String>();

		if (!stream.markSupported())
		{
			stream = new BufferedInputStream(stream);
		}
		DataInputStream distream = new DataInputStream(stream);

		try
		{
			long magic = distream.readLong();

			if (magic != 0x89504e470d0a1a0aL)
			{
				throw new RuntimeException("PNGImageDecoder0");
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new RuntimeException("PNGImageDecoder1");
		}

		try
		{
			while (distream.available() > 0)
			{
				int length = distream.readInt();
				int type = distream.readInt();
				byte[] data = new byte[length];
				distream.readFully(data);
				distream.readInt(); // Move past the crc

				if (type == PNG_CHUNK_IEND)
				{
					return null;
				}
				else if (type == PNG_CHUNK_ZTXT)
				{
					int currentIndex = 0;
					while ((data[currentIndex++]) != 0)
					{
					}

					String key = new String(data, 0, currentIndex - 1);

					try
					{
						byte[] bytes = Arrays.copyOfRange(data,
								currentIndex + 1, data.length);
						String value = URLDecoder.decode(Utils.inflate(bytes),
								Utils.CHARSET_FOR_URL_ENCODING);
						result.put(key, value);
					}
					catch (Exception e)
					{
						e.printStackTrace();
					}

					// No need to parse the rest of the PNG
					return result;
				}
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return null;
	}
}
