package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mxgraph.util.mxBase64;

/**
 * Servlet implementation class SaveServlet
 */
public class SaveServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	private static final Logger log = Logger
			.getLogger(SaveServlet.class.getName());

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaveServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		handlePost(request, response);
	}

	/**
	 * Validates the given filename.
	 */
	protected static String validateFilename(String filename)
	{
		// Only limited characters allowed
		try
		{
			filename = URLDecoder.decode(filename, "UTF-8");
		}
		catch (UnsupportedEncodingException e)
		{
			// ignore unsupported encoding
		}
		
		filename = filename.replaceAll("[\\/:;*?\"<>|]", "");
		
		if (filename.length() == 0)
		{
			filename = "export.txt";
		}
		else if (!filename.toLowerCase().endsWith(".svg") &&
			!filename.toLowerCase().endsWith(".html") &&
			!filename.toLowerCase().endsWith(".xml") &&
			!filename.toLowerCase().endsWith(".png") &&
			!filename.toLowerCase().endsWith(".jpg") &&
			!filename.toLowerCase().endsWith(".pdf") &&
			!filename.toLowerCase().endsWith(".vsdx") &&
			!filename.toLowerCase().endsWith(".txt"))
		{
			filename = filename + ".txt";
		}
		
		filename = Utils.encodeURIComponent(filename, "UTF-8");
		
		return filename;
	}

	public static void handlePost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		if (request.getContentLength() < Constants.MAX_REQUEST_SIZE)
		{
			long t0 = System.currentTimeMillis();
			String filename = request.getParameter("filename");
			byte[] data = null;

			// Data in data param is base64 encoded and deflated
			String enc = request.getParameter("data");
			String xml = null;

			try
			{
				if (enc != null && enc.length() > 0)
				{
					// NOTE: Simulate is used on client-side so the value is double-encoded
					xml = Utils.inflate(mxBase64.decode(URLDecoder
							.decode(enc, Utils.CHARSET_FOR_URL_ENCODING)
							.getBytes()));
				}
				else
				{
					xml = request.getParameter("xml");
				}

				// Decoding is optional (no plain text values allowed here so %3C means encoded)
				if (xml != null && xml.startsWith("%3C"))
				{
					xml = URLDecoder.decode(xml, Utils.CHARSET_FOR_URL_ENCODING);
				}

				String binary = request.getParameter("binary");

				if (binary != null && binary.equals("1") && xml != null && filename != null)
				{
					response.setStatus(HttpServletResponse.SC_OK);
					response.setContentType("application/octet-stream");
					filename = validateFilename(filename);
					response.setHeader("Content-Disposition",
						"attachment; filename=\"" + filename +
						"\"; filename*=UTF-8''" + filename);
					response.getOutputStream().write(
						mxBase64.decodeFast(URLDecoder.decode(xml,
						Utils.CHARSET_FOR_URL_ENCODING)));
				}
				else if (xml != null)
				{
					data = xml.getBytes(Utils.CHARSET_FOR_URL_ENCODING);
					String format = request.getParameter("format");
					response.setStatus(HttpServletResponse.SC_OK);

					if (filename != null)
					{
						if (format == null)
						{
							format = "xml";
						}
	
						if (filename.length() > 0  &&
							!filename.toLowerCase().endsWith(".svg") &&
							!filename.toLowerCase().endsWith(".html") &&
							!filename.toLowerCase().endsWith(".png") &&
							!filename.toLowerCase().endsWith("." + format))
						{
							filename += "." + format;
						}

						filename = validateFilename(filename);
					}
					else
					{
						filename = validateFilename((format != null) ?
							"export." + format.toLowerCase() :
							"export.txt");
					}

					response.setContentType("application/octet-stream");
					response.setHeader("Content-Disposition",
						"attachment; filename=\"" + filename +
						"\"; filename*=UTF-8''" + filename);

					OutputStream out = response.getOutputStream();
					out.write(data);
					out.close();
				}
				else
				{
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				}

				long mem = Runtime.getRuntime().totalMemory()
						- Runtime.getRuntime().freeMemory();

				log.fine("save: ip=" + request.getRemoteAddr() + " ref=\""
						+ request.getHeader("Referer") + "\" in="
						+ request.getContentLength() + " enc="
						+ ((enc != null) ? enc.length() : "[none]") + " xml="
						+ ((xml != null) ? xml.length() : "[none]") + " dt="
						+ request.getContentLength() + " mem=" + mem + " dt="
						+ (System.currentTimeMillis() - t0));
			}
			catch (OutOfMemoryError e)
			{
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
			catch (IllegalArgumentException e)
			{
				log.warning("Error parsing xml contents : " + xml
						+ System.getProperty("line.separator")
						+ "Original stack trace : " + e.getMessage());
			}
		}
		else
		{
			response.setStatus(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
		}
	}

}
