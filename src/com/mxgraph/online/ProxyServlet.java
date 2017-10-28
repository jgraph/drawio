/**
 * $Id: ProxyServlet.java,v 1.4 2013/12/13 13:18:11 david Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.Arrays;

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
				
				response.setHeader("Pragma", "no-cache"); // HTTP 1.0
				response.setHeader("Cache-control", "private, no-cache, no-store");
				response.setHeader("Expires", "0");
				
				// build the UML source from the compressed request parameter
				String ref = request.getHeader("referer");
				String dom = null;

				if (ref != null && ref.toLowerCase()
						.matches("https?://([a-z0-9,-]+[.])*draw[.]io/.*"))
				{
					dom = ref.toLowerCase().substring(0, ref.indexOf(".draw.io/") + 8);
				}
				else if (ref != null && ref.toLowerCase()
						.matches("https?://([a-z0-9,-]+[.])*quipelements[.]com/.*"))
				{
					dom = ref.toLowerCase().substring(0, ref.indexOf(".quipelements.com/") + 17);
				}

				if (dom != null)
				{
					response.addHeader("Access-Control-Allow-Origin", dom);
				}
				
				// Status code pass-through
				if (connection instanceof HttpURLConnection)
				{
					response.setStatus(((HttpURLConnection) connection).getResponseCode());
				}
				
				String base64 = request.getParameter("base64");
				
				if (connection != null)
				{
					if (base64 != null && base64.equals("1"))
					{
						int BUFFER_SIZE = 3 * 1024;
						
						try (BufferedInputStream in = new BufferedInputStream(connection.getInputStream(), BUFFER_SIZE); )
						{
						    StringBuilder result = new StringBuilder();
						    byte[] chunk = new byte[BUFFER_SIZE];
						    int len = 0;
						    while ( (len = in.read(chunk)) == BUFFER_SIZE )
						    {
						         result.append(mxBase64.encodeToString(chunk, false));
						    }
						    
						    if ( len > 0 )
						    {
						         chunk = Arrays.copyOf(chunk,len);
						         result.append(mxBase64.encodeToString(chunk, false));
						    }

							out.write(result.toString().getBytes());
						}
					}
					else
					{
						response.setContentType(connection.getContentType());
						Utils.copy(connection.getInputStream(), out);
					}
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
