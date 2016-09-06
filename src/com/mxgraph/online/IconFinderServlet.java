/**
 * $Id: IconFinderServlet.java,v 1.6 2013/08/22 09:43:18 gaudenz Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.net.URL;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class OpenServlet
 */
public class IconFinderServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	public static final String API_KEY_FILE_PATH = "/WEB-INF/iconfinder_key";

	/**
	 * API key for iconfinder.
	 */
	public static String API_KEY = null;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public IconFinderServlet()
	{
		super();
	}

	/**
	 * Loads the key.
	 */
	protected void updateKey()
	{
		if (API_KEY == null)
		{
			try
			{
				API_KEY = Utils.readInputStream(
						getServletContext().getResourceAsStream(
								getAPIKeyFilePath())).replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("API key file path invalid.");
			}
		}
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
	{
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
	{
		updateKey();

		try
		{
			URL url = new URL("https://www.iconfinder.com/xml/search/?q="
					+ Utils.encodeURIComponent(request.getParameter("q"),
							Utils.CHARSET_FOR_URL_ENCODING) + "&p="
					+ request.getParameter("p") + "&c="
					+ request.getParameter("c") + "&l="
					+ request.getParameter("l")
					+ "&price=nonpremium&min=4&max=130&api_key=" + API_KEY);

			response.addHeader("Access-Control-Allow-Origin", "*");
			response.addHeader("Access-Control-Allow-Methods",
					"POST, GET, OPTIONS, PUT, DELETE, HEAD");

			Utils.copy(url.openStream(), response.getOutputStream());
			response.getOutputStream().flush();
			response.getOutputStream().close();
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
	}

	protected String getAPIKeyFilePath()
	{
		return API_KEY_FILE_PATH;
	}
}
