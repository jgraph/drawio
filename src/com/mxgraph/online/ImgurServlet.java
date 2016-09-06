/**
 * $Id: IconFinderServlet.java,v 1.6 2013/08/22 09:43:18 gaudenz Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class OpenServlet
 */
public class ImgurServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final Logger log = Logger
			.getLogger(ImgurServlet.class.getName());

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Path component under war/ to locate imgur client id file.
	 */
	public static final String IMGUR_CLIENT_ID_FILE_PATH = "/WEB-INF/imgur_client_id";

	/**
	 * API key for iconfinder.
	 */
	public static String IMGUR_CLIENT_ID = null;

	/**
	 * Path component under war/ to locate mashape key file.
	 */
	public static final String MASHAPE_KEY_FILE_PATH = "/WEB-INF/mashape_key";

	/**
	 * API key for iconfinder.
	 */
	public static String MASHAPE_KEY = null;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ImgurServlet()
	{
		super();
	}

	/**
	 * Loads the key.
	 */
	protected void updateKeys()
	{
		if (IMGUR_CLIENT_ID == null)
		{
			try
			{
				IMGUR_CLIENT_ID = Utils
						.readInputStream(
								getServletContext().getResourceAsStream(
										getImgurClientIdFilePath()))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException(
						"Imgur Client ID file path invalid.");
			}
		}

		if (MASHAPE_KEY == null)
		{
			try
			{
				MASHAPE_KEY = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(getMashapeKeyFilePath()))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Mashape key file path invalid.");
			}
		}
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException
	{
		// Redirected for delete requests
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException
	{
		updateKeys();

		// For some strange reason, calling getParameter kills the incoming request body
		String query = request.getQueryString();

		try
		{
			String id = null;
			String method = "POST";

			if (query != null)
			{
				if (query.startsWith("delete="))
				{
					id = query.substring(7);
					method = "DELETE";
				}
				else
				{
					id = query;
				}
			}

			URL url = new URL((id != null)
					? "https://imgur-apiv3.p.mashape.com/3/image/" + id
					: "https://imgur-apiv3.p.mashape.com/3/upload.json");

			HttpURLConnection connection = (HttpURLConnection) url
					.openConnection();
			connection.setRequestProperty("Content-Type", "application/json");
			connection.setRequestProperty("X-Mashape-Key", MASHAPE_KEY);
			connection.setRequestProperty("Authorization",
					"Client-ID " + IMGUR_CLIENT_ID);

			// Posts the HTTP body data
			connection.setDoOutput(true);
			connection.setRequestMethod(method);

			// Copies incoming to outgoing request
			OutputStream out = connection.getOutputStream();
			Utils.copy(request.getInputStream(), out);
			out.flush();
			out.close();

			// Copies incoming to outgoing response
			response.setStatus(connection.getResponseCode());
			String data = Utils.readInputStream(connection.getInputStream());

			if (query == null || method.equals("DELETE"))
			{
				if (query == null)
				{
					query = "upload";
				}

				log.info("imgur: " + request.getRemoteAddr() + " "
						+ request.getHeader("Referer") + " " + query + " "
						+ data);
			}

			out = response.getOutputStream();
			out.write(data.getBytes());
			out.flush();
			out.close();
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
	}

	protected String getImgurClientIdFilePath()
	{
		return IMGUR_CLIENT_ID_FILE_PATH;
	}

	protected String getMashapeKeyFilePath()
	{
		return MASHAPE_KEY_FILE_PATH;
	}

}
