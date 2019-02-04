/**
 * $Id: ProxyServlet.java,v 1.4 2013/12/13 13:18:11 david Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheFactory;
import javax.cache.CacheManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.api.memcache.Stats;
import com.google.appengine.api.memcache.stdimpl.GCacheFactory;
import com.pusher.rest.Pusher;

/**
 * Servlet implementation ProxyServlet
 */
@SuppressWarnings("serial")
public class CacheServlet extends HttpServlet
{
	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	protected static final String PUSHER_CONFIG_FILE_PATH = "/WEB-INF/pusher.properties";

	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	protected static final DateFormat dateFormat = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss.SSS");

	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	protected static final boolean debugOutput = false;

	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	protected static final int expirationDelta = 300;

	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	protected static final int maxCacheSize = 1000000;

	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	protected static Pusher pusher = null;

	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	protected static Cache cache;

	static
	{
		try
		{
			CacheFactory cacheFactory = CacheManager.getInstance()
					.getCacheFactory();
			Map<Object, Object> properties = new HashMap<>();
			properties.put(MemcacheService.SetPolicy.ADD_ONLY_IF_NOT_PRESENT,
					true);
			properties.put(GCacheFactory.EXPIRATION_DELTA, expirationDelta);
			cache = cacheFactory.createCache(properties);
		}
		catch (CacheException e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CacheServlet()
	{
		super();
	};

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected Pusher getPusher() throws IOException
	{
		//log.log(severityLevel, "CLIENT-LOG:" + message);

		if (pusher == null)
		{
			InputStream input = null;

			try
			{
				input = getServletContext()
						.getResourceAsStream(PUSHER_CONFIG_FILE_PATH);

				// load a properties file
				Properties prop = new Properties();
				prop.load(input);

				pusher = new Pusher(prop.getProperty("app_id"),
						prop.getProperty("key"), prop.getProperty("secret"));
				pusher.setCluster(prop.getProperty("cluster"));
				pusher.setEncrypted(true);
			}
			finally
			{
				if (input != null)
				{
					input.close();
				}
			}
		}

		return pusher;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			String qs = request.getQueryString();
			String ref = request.getHeader("referer");
			boolean stats = qs != null && qs.equals("stats");
			boolean alive = qs != null && qs.equals("alive");

			if (stats || alive || (ref != null && ref.toLowerCase()
					.matches("https?://([a-z0-9,-]+[.])*draw[.]io/.*")))
			{
				PrintWriter writer = response.getWriter();
				response.setCharacterEncoding("UTF-8");

				if (stats)
				{
					response.setContentType("text/plain");

					Stats s = MemcacheServiceFactory.getMemcacheService()
							.getStatistics();
					writer.println("timestamp: " + new Date().toString());
					writer.println("hit count: " + s.getHitCount());
					writer.println("miss count: " + s.getMissCount());
					writer.println("item count: " + s.getItemCount());
					writer.println(
							"total item bytes: " + s.getTotalItemBytes());
					writer.println("bytes returned for hits: "
							+ s.getBytesReturnedForHits());
					writer.println("max time without access: "
							+ s.getMaxTimeWithoutAccess());

					response.setStatus(HttpServletResponse.SC_OK);
				}
				else
				{
					response.addHeader("Access-Control-Allow-Origin",
							ref.toLowerCase().substring(0,
									ref.indexOf(".draw.io/") + 8));

					if (alive)
					{
						response.setStatus(HttpServletResponse.SC_OK);
					}
					else
					{
						// Disables wire-compression
						response.setContentType("application/octet-stream");
						String id = request.getParameter("id");
	
						if (id != null)
						{
							try
							{
								writer.print(getPatches(id, request));
								response.setStatus(HttpServletResponse.SC_OK);
							}
							catch (UnauthorizedException e)
							{
								response.setStatus(
										HttpServletResponse.SC_UNAUTHORIZED);
							}
						}
						else
						{
							response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
						}
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
		catch (Exception e)
		{
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected String getPatches(String id, HttpServletRequest request)
			throws UnauthorizedException
	{
		String from = request.getParameter("from");
		String to = request.getParameter("to");
		String secret = request.getParameter("secret");
		String data = "[]";

		if (from != null && to != null)
		{
			List<String> values = new ArrayList<String>();
			HashSet<String> seen = new HashSet<String>();
			String current = from;

			while (!seen.contains(current))
			{
				CacheEntry entry = (CacheEntry) cache.get(id + ":" + current);

				if (entry != null)
				{
					seen.add(current);
					current = entry.getEtag();
					values.add("\"" + entry.getData() + "\"");

					if (current.equals(to))
					{
						// Compares secret
						if (entry.getSecret() != null
								&& !entry.getSecret().equals(secret))
						{
							throw new UnauthorizedException();
						}
						else
						{
							break;
						}
					}
				}
				else
				{
					values.clear();
					break;
				}
			}

			data = "[" + String.join(",", values) + "]";
		}

		debug("getPatches id=" + id + " from=" + from + " to=" + to + " data="
				+ data);

		return data;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			String ref = request.getHeader("referer");

			if (ref != null && ref.toLowerCase()
					.matches("https?://([a-z0-9,-]+[.])*draw[.]io/.*"))
			{
				String id = request.getParameter("id");

				if (id != null)
				{
					response.addHeader("Access-Control-Allow-Origin",
							ref.toLowerCase().substring(0,
									ref.indexOf(".draw.io/") + 8));

					sendMessage(id, request);
					addPatch(id, request);

					PrintWriter writer = response.getWriter();
					writer.println("<ok/>");
					writer.flush();
					writer.close();

					response.setStatus(HttpServletResponse.SC_OK);
				}
				else
				{
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				}
			}
			else
			{
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			}
		}
		catch (Exception e)
		{
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void addPatch(String id, HttpServletRequest request)
	{
		String data = request.getParameter("data");
		String secret = request.getParameter("secret");
		String from = request.getParameter("from");
		String to = request.getParameter("to");

		if (from != null && to != null && data != null
				&& data.length() < maxCacheSize)
		{
			cache.put(id + ":" + from, new CacheEntry(to, data, secret));
			debug("addPatch id=" + id + " from=" + from + " to=" + to + " data="
					+ data);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void sendMessage(String id, HttpServletRequest request)
			throws IOException
	{
		String msg = request.getParameter("msg");

		if (msg != null)
		{
			String sid = request.getParameter("sid");
			getPusher().trigger(id, "changed", msg, sid);
			debug("sendMessage id=" + id + " msg=" + msg);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void debug(String msg)
	{
		if (debugOutput)
		{
			System.out.println(msg);
		}
	}

	/**
	 * Cache entry definition.
	 */
	public static class CacheEntry implements Serializable
	{
		/**
		 * Holds the etag.
		 */
		private String etag;

		/**
		 * Holds the data.
		 */
		private String data;

		/**
		 * Holds the optional secret.
		 */
		private String secret;

		/**
		 * Returns the etag.
		 */
		public String getEtag()
		{
			return etag;
		}

		/**
		 * Returns the data.
		 */
		public String getData()
		{
			return data;
		}

		/**
		 * Returns the data.
		 */
		public String getSecret()
		{
			return secret;
		}

		/**
		 * Constructs a new cache entry.
		 */
		public CacheEntry(String etag, String data, String secret)
		{
			this.etag = etag;
			this.data = data;
			this.secret = secret;
		}

	}

	/**
	 * Cache entry definition.
	 */
	public static class UnauthorizedException extends Exception
	{
	}

}
