/**
 * Copyright (c) 2006-2019, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.cache.Cache;
import javax.cache.CacheException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.memcache.MemcacheServiceException;
import com.google.appengine.api.utils.SystemProperty;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@SuppressWarnings("serial")
abstract public class AbsAuthServlet extends HttpServlet
{
	private static final Logger log = Logger.getLogger(AbsAuthServlet.class.getName());
	private static final boolean DEBUG = false;
	protected static final String SEPARATOR = "/:::/";
	public static final int X_WWW_FORM_URLENCODED = 1;
	public static final int JSON = 2;
	private static final String STATE_COOKIE = "auth-state";
	private static final String TOKEN_COOKIE = "auth-token";
	protected static final int STATE_COOKIE_AGE = 600; //10 min
	protected static final int TOKEN_COOKIE_AGE = 31536000; //One year
	
	
	public static final SecureRandom random = new SecureRandom();
	protected static Cache tokenCache;
	
	static
	{
		try
		{
			tokenCache = CacheFacade.createCache();
		}
		catch (CacheException e)
		{
			e.printStackTrace();
		}
	}
	
	protected int postType = X_WWW_FORM_URLENCODED; 
	protected String cookiePath = "/";
	
	static public class Config 
	{
		public String REDIRECT_PATH = null, AUTH_SERVICE_URL = null;

		protected HashMap<String, String> clientSecretMap = new HashMap<>();
		
		public Config(String clientIds, String clientSecrets)
		{
			try
			{
				String[] cIds = clientIds.split(SEPARATOR);
				String[] cSecrets = clientSecrets.split(SEPARATOR);
				
				for (int i = 0; i < cIds.length; i++)
				{
					clientSecretMap.put(cIds[i], cSecrets[i]);
				}
			}
			catch (Exception e) 
			{
				throw new RuntimeException("Invalid config. " + e.getMessage());
			}
		}
		
		public String getClientSecret(String cId)
		{
			return clientSecretMap.get(cId);
		}
		
		public String getRedirectUrl(String domain)
		{
			return "https://" + domain + REDIRECT_PATH;
		}
	}
	
	protected Config getConfig()
	{
		return null;
	}

	protected String processAuthError(String errorCode)
	{
		//Usually sending null is enough as it is used as a value for auth info
		//If more processing is needed, override this method
		return processAuthResponse("null", false);
	}
	
	protected String processAuthResponse(String authRes, boolean jsonResponse)
	{
		return "";
	}
	
	@SuppressWarnings("unchecked")
	protected static void putCacheValue(String key, String val)
	{
		int trials = 0;
		boolean done = false;
		
		do
		{
			//Exponential? back-off
			if (trials > 0)
			{
				try 
				{
					Thread.sleep(200 * trials);
				}
				catch (InterruptedException e) { }
			}
			
			trials++;
			
			try
			{
				tokenCache.put(key, val);
				done = true;
			}
			catch(MemcacheServiceException e)
			{
				//delay in re-trial is above
				done = false;
			}
		}
		while(!done && trials < 3);
	}
	
	protected String getCookieValue(String name, HttpServletRequest request)
	{
		String val = null;
		
		Cookie[] cookies = request.getCookies();
		
		if (cookies != null)
		{
			for (Cookie cookie : cookies)
			{
				if (name.equals(cookie.getName()))
				{
					val = cookie.getValue();
					break;
				}
			}
		}
		
		return val;
	}
	
	protected void addCookie(String name, String val, int age, HttpServletResponse response)
	{
		response.addHeader("Set-Cookie", name + "=" + val + "; Max-Age=" + age + ";path=" + cookiePath + "; Secure; HttpOnly; SameSite=none");
	}
	
	protected void deleteCookie(String name, HttpServletResponse response)
	{
		response.addHeader("Set-Cookie", name + "= ;path=" + cookiePath + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; HttpOnly; SameSite=none");
	}
	
	//To support multiple tokens in one cookie
	protected String getTokenFromCookieVal(String tokenCookieVal, HttpServletRequest request)
	{
		return tokenCookieVal;
	}
	
	protected void logout(String tokenCookieName, String tokenCookieVal, HttpServletRequest request, HttpServletResponse response)
	{
		deleteCookie(tokenCookieName, response);
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		String stateOnly = request.getParameter("getState");
		
		if ("1".equals(stateOnly))
		{
			String state = new BigInteger(256, random).toString(32);
			String key = new BigInteger(256, random).toString(32);
			putCacheValue(key, state);
			log.log(Level.INFO, "AUTH-SERVLET: [" + request.getRemoteAddr() + "] Added state (" + key + " -> " + state + ")");
			response.setStatus(HttpServletResponse.SC_OK);
			//Chrome blocks this cookie when draw.io is running in an iframe. The cookie is added to parent frame. TODO FIXME
			addCookie(STATE_COOKIE, key, STATE_COOKIE_AGE, response); //10 min to finish auth
			response.setHeader("Content-Type", "text/plain");
			OutputStream out = response.getOutputStream();
			out.write(state.getBytes());
			out.flush();
			out.close();
			return;
		}
		
		String code = request.getParameter("code");
		String error = request.getParameter("error");
		HashMap<String, String> stateVars = new HashMap<>();
		String secret = null, client = null, redirectUri = null, domain = null, stateToken = null, cookieToken = null, version = null, successRedirect = null;
		
		try
		{
			String state = request.getParameter("state");
			
			try 
			{
				if (state != null)
				{
					String[] parts = state.split("&");
					
					for (String part : parts)
					{
						String[] keyVal = part.split("=");
						stateVars.put(keyVal[0], keyVal[1]);
					}
				}
			
				domain = stateVars.get("domain");
				client = stateVars.get("cId");
				stateToken = stateVars.get("token");
				version = stateVars.get("ver");
				successRedirect = stateVars.get("redirect");

				//Redirect to a page on the same domain only (relative path) TODO Is this enough?
				if (successRedirect != null && successRedirect.toLowerCase().startsWith("http"))
				{
					successRedirect = null;
				}
				
				//Get the cached state based on the cookie key 
				String cacheKey = getCookieValue(STATE_COOKIE, request);
				
				if (cacheKey != null)
				{
					cookieToken = (String) tokenCache.get(cacheKey);
					log.log(Level.INFO, "AUTH-SERVLET: [" + request.getRemoteAddr() + "] Found cookie state (" + cacheKey + " -> " + cookieToken + ")");
					//Delete cookie & cache after being used since it is a single use
					tokenCache.remove(cacheKey);
					deleteCookie(STATE_COOKIE, response);
				}
			}
			catch(Exception e)
			{
				//Ignore, incorrect arguments
				e.printStackTrace();
			}

			Config CONFIG = getConfig();
			redirectUri = CONFIG.getRedirectUrl(domain != null? domain : request.getServerName());
			
			secret = CONFIG.getClientSecret(client);
			
			String tokenCookie = TOKEN_COOKIE + client; //Such that we support multiple client ids
			
			//TODO This code should be removed when new code is propagated
			String refreshToken = request.getParameter("refresh_token"), tokenCookieVal = null;
			
			if (refreshToken == null)
			{
				tokenCookieVal = getCookieValue(tokenCookie, request);
				refreshToken = getTokenFromCookieVal(tokenCookieVal, request);
			}
			
			//Logout (delete refresh token)
			String logoutParam = request.getParameter("doLogout");
			
			if ("1".equals(logoutParam))
			{
				logout(tokenCookie, tokenCookieVal, request, response);
			}
			else if (error != null)
			{
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				
				OutputStream out = response.getOutputStream();
	
				PrintWriter writer = new PrintWriter(out);

				// Writes JavaScript code
				writer.println(processAuthError(error));
	
				writer.flush();
				writer.close();
			}
			else if ((code == null && refreshToken == null) || client == null || redirectUri == null || secret == null)
			{
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			}
			//Non GAE runtimes are excluded from state check. TODO Change GAE stub to return null from CacheFactory
			else if (!"Non".equals(SystemProperty.environment.get()) && (stateToken == null || !stateToken.equals(cookieToken)))
			{
				log.log(Level.WARNING, "AUTH-SERVLET: [" + request.getRemoteAddr() + "] STATE MISMATCH (state: " + stateToken + " != cookie: " + cookieToken + ")");
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			}
			else
			{
				Response authResp = contactOAuthServer(CONFIG.AUTH_SERVICE_URL, code, refreshToken, secret, client, redirectUri, successRedirect != null, 1);
				
				response.setStatus(authResp.status);
				
				if (authResp.refreshToken != null)
				{
					addCookie(tokenCookie, getRefreshTokenCookie(authResp.refreshToken, tokenCookieVal, authResp.accessToken), TOKEN_COOKIE_AGE, response);
				}
				
				if (authResp.content != null)
				{
					if (successRedirect != null)
					{
						response.sendRedirect(successRedirect + "#" + Utils.encodeURIComponent(authResp.content, "UTF-8"));
					}
					else
					{
						OutputStream out = response.getOutputStream();
						PrintWriter writer = new PrintWriter(out);
						writer.println(authResp.content);
						writer.flush();
						writer.close();
					}
				}
			}
		}
		catch (Exception e) 
		{
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	protected String getRefreshTokenCookie(String refreshToken, String tokenCookieVal, String accessToken) 
	{
		return refreshToken;
	}

	protected  int getExpiresIn(JsonObject json)
	{
		return json.get("expires_in").getAsInt();
	}
	
	protected  String getAccessToken(JsonObject json)
	{
		return json.get("access_token").getAsString();
	}
	
	protected  String getRefreshToken(JsonObject json)
	{
		try
		{
			return json.get("refresh_token").getAsString();
		}
		catch(Exception e)
		{
			return null;
		}
	}
	
	class Response
	{
		public int status = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		public String content = null;
		public String refreshToken = null;
		public String accessToken = null;
	}
	
	private Response contactOAuthServer(String authSrvUrl, String code, String refreshToken, String secret,
			String client, String redirectUri,boolean directResp, int retryCount)
	{
		HttpURLConnection con = null;
		Response response = new Response();
		
		try
		{
			URL obj = new URL(authSrvUrl);
			con = (HttpURLConnection) obj.openConnection();

			con.setRequestMethod("POST");
			
			boolean jsonResponse = false;
			StringBuilder urlParameters = new StringBuilder();

			if (postType == X_WWW_FORM_URLENCODED)
			{
				con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

				urlParameters.append("client_id=");
				urlParameters.append(client);
				urlParameters.append("&redirect_uri=");
				urlParameters.append(redirectUri);
				urlParameters.append("&client_secret=");
				urlParameters.append(secret);
			
				if (code != null)
				{
					urlParameters.append("&code=");
					urlParameters.append(code);
					urlParameters.append("&grant_type=authorization_code");
				}
				else
				{
					urlParameters.append("&refresh_token=");
					urlParameters.append(refreshToken);
					urlParameters.append("&grant_type=refresh_token");
					jsonResponse = true;
				}
			}
			else if (postType == JSON)
			{
				con.setRequestProperty("Content-Type", "application/json");
				
				urlParameters.append("{");
				urlParameters.append("\"client_id\": \"");
				urlParameters.append(client);
				urlParameters.append("\", \"redirect_uri\": \"");
				urlParameters.append(redirectUri);
				urlParameters.append("\", \"client_secret\": \"");
				urlParameters.append(secret);
			
				if (code != null)
				{
					urlParameters.append("\", \"code\": \"");
					urlParameters.append(code);
					urlParameters.append("\", \"grant_type\": \"authorization_code\"}");
				}
				else
				{
					urlParameters.append("\", \"refresh_token\": \"");
					urlParameters.append(refreshToken);
					urlParameters.append("\", \"grant_type\": \"refresh_token\"}");
					jsonResponse = true;
				}
			}
			
			// Send post request
			con.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(urlParameters.toString());
			wr.flush();
			wr.close();

			BufferedReader in = new BufferedReader(
					new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer authRes = new StringBuffer();

			while ((inputLine = in.readLine()) != null)
			{
				authRes.append(inputLine);
			}
			in.close();

			response.status = con.getResponseCode();
			
			Gson gson = new Gson();
		    
			JsonObject json = gson.fromJson(authRes.toString(), JsonElement.class).getAsJsonObject();
			String accessToken = getAccessToken(json);
			int expiresIn = getExpiresIn(json);
			response.refreshToken = getRefreshToken(json);
			response.accessToken = accessToken;
			
			JsonObject respObj = new JsonObject();
			respObj.addProperty("access_token", accessToken);
			respObj.addProperty("expires_in", expiresIn);
			
			if (directResp)
			{
				response.content = respObj.toString();
			}
			else
			{
				// Writes JavaScript code
				response.content = processAuthResponse(respObj.toString(), jsonResponse);
			}
		}
		catch(IOException e)
		{
			StringBuilder details = new StringBuilder("");
			
			if (con != null)
			{
				try 
				{
					BufferedReader in = new BufferedReader(
							new InputStreamReader(con.getErrorStream()));
					
					String inputLine;

					while ((inputLine = in.readLine()) != null)
					{
						System.err.println(inputLine);
						details.append(inputLine);
						details.append("\n");
					}
					in.close();
				}
				catch (Exception e2) 
				{
					// Ignore
				}
			}
			
			if (e.getMessage() != null && e.getMessage().contains("401"))
			{
				response.status = HttpServletResponse.SC_UNAUTHORIZED;
			}
			else if (retryCount > 0 && e.getMessage() != null && e.getMessage().contains("Connection timed out"))
		    {
				return contactOAuthServer(authSrvUrl, code, refreshToken, secret,
						client, redirectUri, directResp, --retryCount);
		    }
			else
			{
				response.status = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
				e.printStackTrace();
				System.err.println(details);
			}
			
			if (DEBUG)
			{
				StringWriter sw = new StringWriter();
				PrintWriter pw = new PrintWriter(sw);
				e.printStackTrace(pw);
				pw.println(details.toString());
				pw.flush();
				response.content = sw.toString();
			}
		}
		
		return response;
	}

}
