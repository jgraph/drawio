/**
 * $Id: ProxyServlet.java,v 1.4 2013/12/13 13:18:11 david Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.BufferedInputStream;
import java.io.IOException;
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

		// build the UML source from the compressed request parameter
		String ua = request.getHeader("User-Agent");
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
			dom = ref.toLowerCase().substring(0,
					ref.indexOf(".quipelements.com/") + 17);
		}
		// Enables Confluence/Jira proxy via referer or hardcoded user-agent (for old versions)
		// UA refers to old FF on macOS so low risk and fixes requests from existing servers
		else if ((ref != null && ref.equals("draw.io Proxy Confluence Server"))
				|| (ua != null && ua.equals(
						"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:50.0) Gecko/20100101 Firefox/50.0")))
		{
			dom = "";
		}

		if (dom != null && urlParam != null && (urlParam.startsWith("http://")
				|| urlParam.startsWith("https://")))
		{
			request.setCharacterEncoding("UTF-8");
			response.setCharacterEncoding("UTF-8");

			OutputStream out = response.getOutputStream();

			try
			{
				URL url = new URL(urlParam);
				URLConnection connection = url.openConnection();
				response.setHeader("Cache-Control", "private, max-age=86400");

				if (dom != null && dom.length() > 0)
				{
					response.addHeader("Access-Control-Allow-Origin", dom);
				}

				connection.setRequestProperty("User-Agent", "draw.io");

				// Status code pass-through and follow redirects
				if (connection instanceof HttpURLConnection)
				{
					((HttpURLConnection) connection)
							.setInstanceFollowRedirects(true);

					// Workaround for 451 response from Iconfinder CDN
					int status = ((HttpURLConnection) connection)
							.getResponseCode();
					int counter = 0;

					// Follows a maximum of 2 redirects 
					while (counter++ < 2
							&& (status == HttpURLConnection.HTTP_MOVED_PERM
									|| status == HttpURLConnection.HTTP_MOVED_TEMP))
					{
						url = new URL(connection.getHeaderField("Location"));
						connection = url.openConnection();
						((HttpURLConnection) connection)
								.setInstanceFollowRedirects(true);

						// Workaround for 451 response from Iconfinder CDN
						connection.setRequestProperty("User-Agent", "draw.io");
						status = ((HttpURLConnection) connection)
								.getResponseCode();
					}

					response.setStatus(status);
				}

				String base64 = request.getParameter("base64");

				if (connection != null)
				{
					response.setContentType("application/octet-stream");

					if (base64 != null && base64.equals("1"))
					{
						int BUFFER_SIZE = 3 * 1024;

						try (BufferedInputStream in = new BufferedInputStream(
								connection.getInputStream(), BUFFER_SIZE);)
						{
							StringBuilder result = new StringBuilder();
							byte[] chunk = new byte[BUFFER_SIZE];
							int len = 0;
							while ((len = in.read(chunk)) == BUFFER_SIZE)
							{
								result.append(
										mxBase64.encodeToString(chunk, false));
							}

							if (len > 0)
							{
								chunk = Arrays.copyOf(chunk, len);
								result.append(
										mxBase64.encodeToString(chunk, false));
							}

							out.write(result.toString().getBytes());
						}
					}
					else
					{
						Utils.copy(connection.getInputStream(), out);
					}
				}

				out.flush();
				out.close();
			}
			catch (Exception e)
			{
				response.setStatus(
						HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				e.printStackTrace();
			}
		}
		else
		{
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

}
