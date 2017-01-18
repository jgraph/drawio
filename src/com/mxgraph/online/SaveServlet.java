package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;
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
	public static String ALLOW_COMPRESSION = "allowCompression";

	/**
	 * 
	 */
	private static final Logger log = Logger.getLogger(SaveServlet.class
			.getName());

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

	public static void handlePost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		if (request.getContentLength() < Constants.MAX_REQUEST_SIZE)
		{
			long t0 = System.currentTimeMillis();
			String mime = request.getParameter("mime");
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
					xml = Utils.inflate(mxBase64.decode(URLDecoder.decode(enc,
							Utils.CHARSET_FOR_URL_ENCODING).getBytes()));
				}
				else
				{
					xml = request.getParameter("xml");
				}

				// Decoding is optional (no plain text values allowed here so %3C means encoded)
				if (xml != null && xml.startsWith("%3C"))
				{
					xml = URLDecoder
							.decode(xml, Utils.CHARSET_FOR_URL_ENCODING);
				}

				String binary = request.getParameter("binary");
				
				if (binary != null && binary.equals("1") && xml != null && mime != null)
				{
					response.setStatus(HttpServletResponse.SC_OK);
					
					if (filename != null)
					{
						response.setContentType("application/x-unknown");
						response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"; filename*=UTF-8''" + filename);
					}
					else if (mime != null)
					{
						response.setContentType(mime);
					}

					response.getOutputStream().write(mxBase64.decodeFast(URLDecoder
							.decode(xml, Utils.CHARSET_FOR_URL_ENCODING)));
				}
				else if (mime != null && xml != null)
				{
					if (xml != null)
					{
						data = xml.getBytes(Utils.CHARSET_FOR_URL_ENCODING);
					}
					
					String format = request.getParameter("format");

					if (format == null)
					{
						format = "xml";
					}

					if (mime == null)
					{
						if (format.equals("xml"))
						{
							mime = "application/xml";
						}
						else if (format.equals("svg"))
						{
							mime = "image/svg+xml";
						}
						else
						{
							mime = "text/plain";
						}
					}

					if (filename != null
							&& filename.length() > 0
							&& !(format.equals("xml")
									&& filename.toLowerCase().endsWith(".html") && filename
									.toLowerCase().endsWith(".svg"))
							&& !filename.toLowerCase().endsWith("." + format))
					{
						filename += "." + format;
					}

					response.setStatus(HttpServletResponse.SC_OK);
					
					if (filename != null)
					{
						response.setContentType(mime);
						response.setHeader("Content-Disposition",
								"attachment; filename=\"" + filename
										+ "\"; filename*=UTF-8''" + filename);
					}
					else if (mime.equals("image/svg+xml"))
					{
						response.setContentType("image/svg+xml");
					}
					else
					{
						// Required to avoid download of file
						response.setContentType("text/plain");
					}

					OutputStream out = response.getOutputStream();
					out.write(data);
					out.close();
				}
				else
				{
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				}
			}
			catch (IllegalArgumentException e)
			{
				log.warning("Error parsing xml contents : " + xml
						+ System.getProperty("line.separator")
						+ "Original stack trace : " + e.getMessage());
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
		else
		{
			response.setStatus(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
		}
	}

}
