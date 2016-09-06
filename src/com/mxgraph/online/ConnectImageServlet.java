package com.mxgraph.online;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 
 * Implements returning a 301 for the connect image placeholder to point
 * at the relative PNG attachment of the diagram
 * 
 *
 */
public class ConnectImageServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 3143318789617797083L;

	public void doGet(HttpServletRequest request, HttpServletResponse response)
	{
		String redirect = "https://www.draw.io/images/logo-flat.png";
		String diagramName = request.getParameter("diagramName");
		String baseUrl = request.getParameter("baseUrl");
		String pageId = request.getParameter("pageId");
		String revision = request.getParameter("revision");

		if (pageId != null && baseUrl != null && diagramName != null)
		{
			try
			{
				redirect = baseUrl + "/download/attachments/" + pageId + "/"
						+ URLEncoder.encode(diagramName, "UTF-8")
								.replaceAll("\\+", "%20")
						+ ".png?api=v2" + (revision != null ? "&version=" + revision : "");
			}
			catch (UnsupportedEncodingException e)
			{
				// Ignore
			}
		}

		response.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
		response.setHeader("Location", redirect);

		try
		{
			response.getOutputStream().flush();
			response.getOutputStream().close();
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
	}

}
