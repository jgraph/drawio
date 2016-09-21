/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.online;

import java.io.IOException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class OpenServlet
 */
public class IconSearchServlet extends HttpServlet
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

	private static final Logger log = Logger.getLogger(IconSearchServlet.class
			.getName());

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public IconSearchServlet()
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
		
		if (API_KEY.equals("Replace_with_your_own_iconfinder_key"))
		{
			throw new RuntimeException("Iconfinder API key template used, replace it with your own.");
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
			String query = request.getParameter("q");
			URL url = new URL("https://www.iconfinder.com/xml/search/?q="
					+ Utils.encodeURIComponent(query,
							Utils.CHARSET_FOR_URL_ENCODING) + "&p="
					+ request.getParameter("p") + "&c="
					+ request.getParameter("c") + "&l="
					+ request.getParameter("l")
					+ "&price=nonpremium&min=4&max=130&api_key=" + API_KEY);

			log.log(Level.CONFIG, "iconsearch=" + query);

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
