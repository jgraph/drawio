/**
 * Copyright (c) 2011-2012, JGraph Ltd
 *
 * Simple embed servlet that serves the basic viewer script.
 * For advanced embedding with dynamic stencils, use EmbedServlet2.
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.utils.SystemProperty;

/**
 * Servlet implementation class EmbedServlet
 *
 * This is a simplified embed servlet that serves the basic GraphViewer script.
 * For dynamic stencil loading and advanced features, use /embed2.js instead.
 */
public class EmbedServlet extends HttpServlet
{
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	/**
	 *
	 */
	protected static String lastModified = null;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public EmbedServlet()
	{
		if (lastModified == null)
		{
			// Uses deployment date as lastModified header
			try
			{
				String applicationVersion = SystemProperty.applicationVersion.get();

				if (applicationVersion != null)
				{
					Date uploadDate = new Date(Long
							.parseLong(applicationVersion
									.substring(applicationVersion.lastIndexOf(".") + 1))
							/ (2 << 27) * 1000);

					DateFormat httpDateFormat = new SimpleDateFormat(
							"EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
					lastModified = httpDateFormat.format(uploadDate);
				}
			}
			catch (Exception e)
			{
				// Use current date as fallback
				DateFormat httpDateFormat = new SimpleDateFormat(
						"EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
				lastModified = httpDateFormat.format(new Date());
			}
		}
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			// Checks or sets last modified date of delivered content.
			String modSince = request.getHeader("If-Modified-Since");

			if (modSince != null && modSince.equals(lastModified))
			{
				response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
			}
			else
			{
				writeEmbedResponse(request, response);
			}
		}
		catch (Exception e)
		{
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			throw e;
		}
	}

	/**
	 * Writes the embed JavaScript response
	 */
	public void writeEmbedResponse(HttpServletRequest request,
			HttpServletResponse response) throws IOException
	{
		response.setStatus(HttpServletResponse.SC_OK);
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/javascript; charset=UTF-8");

		if (lastModified != null)
		{
			response.setHeader("Last-Modified", lastModified);
		}

		PrintWriter writer = new PrintWriter(response.getOutputStream());

		String dev = request.getParameter("dev");
		String proto = "https://";
		String host = ((dev != null && dev.equals("1")) ? "test" : "www") + ".draw.io";

		// Creates a simple loader script that includes the viewer
		writer.println("(function() {");
		writer.println("  var t = document.getElementsByTagName('script');");
		writer.println("  if (t != null && t.length > 0) {");
		writer.println("    var script = document.createElement('script');");
		writer.println("    script.type = 'text/javascript';");
		writer.println("    script.src = '" + proto + host + "/js/viewer-static.min.js';");
		writer.println("    script.onload = function() {");
		writer.println("      if (typeof GraphViewer !== 'undefined') {");
		writer.println("        GraphViewer.processElements();");
		writer.println("      }");
		writer.println("    };");
		writer.println("    t[0].parentNode.appendChild(script);");
		writer.println("  }");
		writer.println("})();");

		writer.flush();
		writer.close();
	}
}
