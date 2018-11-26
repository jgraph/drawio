/**
 * $Id: ProxyServlet.java,v 1.4 2013/12/13 13:18:11 david Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheFactory;
import javax.cache.CacheManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.memcache.stdimpl.GCacheFactory;
import com.pusher.rest.Pusher;

/**
 * Servlet implementation ProxyServlet
 */
@SuppressWarnings("serial")
public class CacheServlet extends HttpServlet
{
	protected static int expirationDelta = 300;

	protected static Cache cache;

	protected static Pusher pusher = new Pusher("528601",
			"fd30ee6d04a388192212", "b6f57ca802122304055f");

	protected static DateFormat dateFormat = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss.SSS");

	static
	{
		try
		{
			CacheFactory cacheFactory = CacheManager.getInstance()
					.getCacheFactory();
			Map<Object, Object> properties = new HashMap<>();
			properties.put(GCacheFactory.EXPIRATION_DELTA, expirationDelta);
			cache = cacheFactory.createCache(properties);
		}
		catch (CacheException e)
		{
			e.printStackTrace();
		}

		pusher.setCluster("eu");
		pusher.setEncrypted(true);
	}

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CacheServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		String qs = request.getQueryString();
		String ref = request.getHeader("referer");
		boolean stats = qs != null && qs.equals("stats");

		if (stats || (ref != null && ref.toLowerCase()
				.matches("https?://([a-z0-9,-]+[.])*draw[.]io/.*")))
		{
			PrintWriter writer = response.getWriter();
			response.setCharacterEncoding("UTF-8");

			if (stats)
			{
				response.setContentType("text/plain");
				writer.println("timestamp: " + new Date().toString());
				writer.println("cache size: " + cache.size());
				response.setStatus(HttpServletResponse.SC_OK);
			}
			else
			{
				// Disables wire-compression
				response.setContentType("application/octet-stream");
				String temp = request.getParameter("keys");
				String id = request.getParameter("id");

				if (id != null && temp != null)
				{
					String[] keys = temp.split(";");
					List<String> values = new ArrayList<String>(keys.length);

					for (String key : keys)
					{
						String fullKey = id + ":" + key;

						if (cache.containsKey(fullKey))
						{
							values.add(cache.get(fullKey).toString());
						}
						else
						{
							values.clear();
							break;
						}
					}

					writer.print("[" + String.join(",", values) + "]");
					System.out.println("keys: " + temp + " bytes: "
							+ (String.join("", values).length()
									- values.size() * 2));
					response.setStatus(HttpServletResponse.SC_OK);
				}
				else
				{
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				}
			}

			writer.flush();
			writer.close();
		}
		else
		{
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		String ref = request.getHeader("referer");

		if (ref != null && ref.toLowerCase()
				.matches("https?://([a-z0-9,-]+[.])*draw[.]io/.*"))
		{
			String key = request.getParameter("key");
			String value = request.getParameter("value");

			if (key != null)
			{
				int index = key.indexOf(":");

				// Puts diff in cache
				if (value != null && value.length() < 1000000 &&
					!cache.containsKey(key))
				{
					cache.put(key, value);
				}

				// Send notification to clients
				String msg = request.getParameter("msg");
				String id = (index > 0) ? key.substring(0, index) : key;

				pusher.trigger(id, "changed", (msg != null) ? msg : "");
				System.out.println("key: " + key + " bytes: "
						+ ((value != null) ? value.length() : 0) + " msg: "
						+ msg);
				System.out.println(dateFormat.format(new Date()) + ":DEBUG:"
						+ ((value != null) ? value : "null"));
			}

			response.setStatus(HttpServletResponse.SC_OK);
		}
		else
		{
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
		}
	}

}
