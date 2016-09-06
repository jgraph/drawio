/**
 * $Id: ProxyServlet.java,v 1.4 2013/12/13 13:18:11 david Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation ProxyServlet
 */
@SuppressWarnings("serial")
public class ProxyServlet extends HttpServlet
{

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ProxyServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		String urlParam = request.getParameter("url");

		if (urlParam != null)
		{
			request.setCharacterEncoding("UTF-8");
			response.setCharacterEncoding("UTF-8");

			OutputStream out = response.getOutputStream();

			try
			{
				URL url = new URL(urlParam);
				URLConnection connection = url.openConnection();
				
				// Status code pass-through
				if (connection instanceof HttpURLConnection)
				{
					response.setStatus(((HttpURLConnection) connection).getResponseCode());
				}
				
				if (connection != null)
				{
					response.setContentType(connection.getContentType());
					Utils.copy(connection.getInputStream(), out);
				}

				out.flush();
				out.close();
			}
			catch (Exception e)
			{
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				e.printStackTrace();
			}
		}
		else
		{
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

}
