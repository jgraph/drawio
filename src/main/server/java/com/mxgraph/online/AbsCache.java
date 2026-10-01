/**
 * Copyright (c) 2011-2023, JGraph Holdings Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.Serializable;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.cache.Cache;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;

import com.pusher.rest.Pusher;

abstract public class AbsCache extends HttpServlet implements AbsComm
{
	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	protected static final String PUSHER_CONFIG_FILE_PATH = "pusher_properties";

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
	 * Maximum number of patches returned for one catchup.
	 */
	protected static final int maxChainLength = 100;

	/**
	 * Maximum total size of the patches returned for one catchup, below the
	 * 6 MB response limit of AWS Lambda.
	 */
	protected static final int maxPatchesSize = 5000000;

	/**
	 * Replaces a token after it was used. Not a string so that it never
	 * matches a token parameter.
	 */
	protected static final Boolean USED_TOKEN = Boolean.FALSE;

	/**
	 * Path component under war/ to locate iconfinder_key file.
	 */
	protected static Pusher pusher = null;

	/**
	 * Global cache is used for patches, last versions and tokens. They are
	 * separated via their key formats as follows:
	 * 
	 * Patches use ID:VERSION and map to a CacheEntry which contains the next
	 * version, patch data and secret.
	 * 
	 * Last versions use ID@VERSION and map to a String which contains the
	 * known last version of the file. This is used to verify the secret.
	 * 
	 * Tokens use ID#SECRET and map to a String which contains the token.
	 * The token is used to authorize the patch in a subsequent request.
	 */
	protected static Cache cache = null;

	static
	{
		try
		{
			cache = CacheFacade.createCache("AbsCache", expirationDelta);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * Creates the key for the cache entry.
	 */
	protected static String createCacheEntryKey(String id, String version)
	{
		return id + ":" + version;
	}

	/**
	 * Creates the key for the cache entry.
	 */
	protected static String createLastVersionKey(String id, String version)
	{
		return id + "@" + version;
	}

	/**
	 * Creates the key for the cache entry.
	 */
	protected static String createTokenKey(String id, String secret)
	{
		return id + "#" + secret;
	}

	/**
	 * 
	 */
	protected Pusher getPusher() throws IOException
	{
		//log.log(severityLevel, "CLIENT-LOG:" + message);

		if (pusher == null)
		{
			String input = SecretFacade.getSecret(PUSHER_CONFIG_FILE_PATH, getServletContext());
			// load a properties file
			Properties prop = new Properties();
			prop.load(new StringReader(input));

			pusher = new Pusher(prop.getProperty("app_id"),
					prop.getProperty("key"), prop.getProperty("secret"));
			pusher.setCluster(prop.getProperty("cluster"));
			pusher.setEncrypted(true);
		}

		return pusher;
	}

	/**
	 * 
	 */
	protected void doGetAbst(Object request, Object response) throws IOException
	{
		String respBody = "";

		try
		{
			String qs = getQueryString(request);
			String ref = getHeader("referer", request);
			// Set ref to something to avoid extra null branch for sc_forbidden
			ref = ref == null ? "" : ref;
			boolean stats = qs != null && qs.equals("stats");
			boolean alive = qs != null && qs.equals("alive");

			String domain = ref.toLowerCase().matches(
					"^https?://([a-z0-9,-]+[.])*draw[.]io/.*") ? ".draw.io/"
							: null;
			domain = (domain == null) ? (ref.toLowerCase()
					.matches("^https?://([a-z0-9,-]+[.])*diagrams[.]net/.*")
							? ".diagrams.net/"
							: null)
					: domain;

			if (stats || alive || domain != null)
			{
				if (stats)
				{
					setHeader("Content-Type", "text/plain", response);
					respBody = CacheFacade.getStatistics();
					setStatus(HttpServletResponse.SC_OK, response);
				}
				else
				{
					setHeader("Access-Control-Allow-Origin",
							ref.toLowerCase().substring(0,
									ref.indexOf(domain) + domain.length() - 1), response);

					if (alive)
					{
						respBody = "<ok/>\n";
						setStatus(HttpServletResponse.SC_OK, response);
					}
					else
					{
						// Disables wire-compression
						setHeader("Content-Type", "application/octet-stream", response);
						String id = getParameter("id", request);
						String from = getParameter("from", request);
						String to = getParameter("to", request);
						String secret = getParameter("secret", request);

						if (id != null)
						{
							try
							{
								if (secret != null
										&& (from == null || to == null))
								{
									respBody = createToken(id, secret);
								}
								else if (from != null && to != null)
								{
									respBody = getPatches(id, from, to, secret);
								}

								setStatus(HttpServletResponse.SC_OK, response);
							}
							catch (UnauthorizedException e)
							{
								setStatus(HttpServletResponse.SC_UNAUTHORIZED, response);
							}
							catch (IncompleteChainException e)
							{
								setStatus(HttpServletResponse.SC_GONE, response);
							}
						}
						else
						{
							setStatus(HttpServletResponse.SC_BAD_REQUEST, response);
						}
					}
				}
			}
			else
			{
				setStatus(HttpServletResponse.SC_FORBIDDEN, response);
			}
		}
		catch (Exception e)
		{
			// Exception messages can contain request data and cache keys
			respBody = "";
			setStatus(HttpServletResponse.SC_BAD_REQUEST, response);

			if (debugOutput)
			{
				e.printStackTrace();
			}
		}

		setBody(respBody, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected String createToken(String id, String secret)
			throws UnauthorizedException
	{
		String key = createTokenKey(id, secret);
		String token = Utils.generateToken(32);

		if (CacheFacade.putIfAbsent(cache, key, token))
		{
			debug("createToken key=" + key + " token=" + token);

			return token;
		}
		else
		{
			throw new UnauthorizedException();
		}
	}

	/**
	 * Removes the given patch if the secret does not match.
	 */
	protected void checkPatch(String id, String current, String secret)
	{
		Object lastVersion = cache.remove(createLastVersionKey(id, current));

		if (lastVersion != null)
		{
			String key = createCacheEntryKey(id, lastVersion.toString());
			CacheEntry entry = (CacheEntry) cache.get(key);

			if (entry != null)
			{
				if (entry.getSecret() == null || !entry.getSecret().equals(secret))
				{
					cache.remove(key);
					debug("patch removed id=" + id + " from=" + lastVersion
							+ " to=" + current);
					
					// Marks the chain as incomplete
					cache.put(key, new CacheEntry(null, null, null));
				}
				else
				{
					debug("patch checked id=" + id + " from=" + lastVersion
							+ " to=" + current);
				}
			}
		}
		else
		{
			debug("check patch no last version for id=" + id + " current=" + current);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected String getPatches(String id, String from, String to, String secret)
		throws UnauthorizedException, IncompleteChainException
	{
		List<String> values = new ArrayList<String>();
		HashSet<String> seen = new HashSet<String>();
		String current = from;
		String data = "[]";
		int size = 0;

		while (!seen.contains(current))
		{
			CacheEntry entry = (CacheEntry) cache.get(createCacheEntryKey(id, current));

			if (entry != null)
			{
				// Chains over the limits are incomplete for the client, which
				// then reloads the file
				if (entry.getData() == null || entry.getNext() == null
						|| entry.getSecret() == null || values.size() >= maxChainLength
						|| size + entry.getData().length() > maxPatchesSize)
				{
					debug("getPatches incomplete chain id=" + id + " from=" + from + " to=" + to);

					throw new IncompleteChainException();
				}
				else
				{
					seen.add(current);
					current = entry.getNext();
					values.add("\"" + entry.getData() + "\"");
					size += entry.getData().length();

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
			}
			else
			{
				values.clear();
				break;
			}
		}

		data = "[" + String.join(",", values) + "]";

		debug("getPatches id=" + id + " from=" + from + " to=" + to + " data="
				+ data);

		return data;
	}

	/**
	 * 
	 */
	protected void doPostAbst(Object request, Object response) throws IOException
	{
		try
		{
			String ref = getHeader("referer", request);
			// Set ref to something to avoid extra null branch for sc_forbidden
			ref = ref == null ? "" : ref;

			String domain = ref.toLowerCase().matches(
					"^https?://([a-z0-9,-]+[.])*draw[.]io/.*") ? ".draw.io/"
							: null;
			domain = (domain == null) ? (ref.toLowerCase()
					.matches("^https?://([a-z0-9,-]+[.])*diagrams[.]net/.*")
							? ".diagrams.net/"
							: null)
					: domain;

			if (domain != null)
			{
				String id = getPostParameter("id", request);

				if (id != null)
				{
					setHeader("Access-Control-Allow-Origin",
							ref.toLowerCase().substring(0,
									ref.indexOf(domain) + domain.length() - 1), response);

					addPatch(id, getPostParameter("data", request),
							getPostParameter("secret", request),
							getPostParameter("token", request),
							getPostParameter("from", request),
							getPostParameter("to", request),
							getPostParameter("last-secret", request));
					sendMessage(id, getPostParameter("msg", request),
							getPostParameter("sid", request));

					setStatus(HttpServletResponse.SC_OK, response);
					setBody("<ok/>\n", response);
				}
				else
				{
					setStatus(HttpServletResponse.SC_BAD_REQUEST, response);
				}
			}
			else
			{
				setStatus(HttpServletResponse.SC_FORBIDDEN, response);
			}
		}
		catch (UnauthorizedException e)
		{
			setStatus(HttpServletResponse.SC_UNAUTHORIZED, response);
		}
		catch (Exception e)
		{
			setStatus(HttpServletResponse.SC_BAD_REQUEST, response);

			if (debugOutput)
			{
				e.printStackTrace();
			}
		}
	}

	/**
	 * Adds the given patch and returns true if collaborators should be notified.
	 */
	protected void addPatch(String id, String data, String secret, String token,
			String from, String to, String lastSecret)
			throws UnauthorizedException
	{
		String tokenKey = createTokenKey(id, secret);

		if (secret != null && cache.remove(tokenKey, token))
		{
			if (from != null && to != null && data != null
					&& data.length() < maxCacheSize)
			{
				// Checks if the last patch has a valid secret
				checkPatch(id, from, lastSecret);
				cache.put(createCacheEntryKey(id, from),
					new CacheEntry(to, data, secret));

				// Maps from current to last for keeping chain valid
				if (secret != null)
				{
					cache.put(createLastVersionKey(id, to), from);
				}

				debug("addPatch id=" + id + " from=" + from + " to=" + to
						+ " secret=" + secret + " token=" + token + " data="
						+ data);
			}

			// Blocks new tokens for this secret until the patch has expired.
			// The secret is readable by anyone who can read the file, so a
			// new token would allow them to replace the patch.
			cache.put(tokenKey, USED_TOKEN);
		}
		else if (data != null)
		{
			throw new UnauthorizedException();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void sendMessage(String id, String msg, String sid)
			throws IOException
	{
		if (msg != null)
		{
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
			System.out.println("[CacheServlet] " + new Date().toString() + ": " + msg);
		}
	}

	/**
	 * Cache entry definition.
	 */
	public static class CacheEntry implements Serializable
	{
		/**
		 * Holds the next version.
		 */
		private String next;

		/**
		 * Holds the data.
		 */
		private String data;

		/**
		 * Holds the optional secret.
		 */
		private String secret;

		/**
		 * Returns the next version.
		 */
		public String getNext()
		{
			return next;
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
		public CacheEntry(String next, String data, String secret)
		{
			this.next = next;
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

	/**
	 * Cache entry definition.
	 */
	public static class IncompleteChainException extends Exception
	{
	}

}
