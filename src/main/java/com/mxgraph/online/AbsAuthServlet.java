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
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
abstract public class AbsAuthServlet extends HttpServlet
{
	private static final boolean DEBUG = false;
	private static final String SEPARATOR = "/:::/";
	public static final int X_WWW_FORM_URLENCODED = 1;
	public static final int JSON = 2;
	private static final String STATE_COOKIE = "auth-state";
	private static final int COOKIE_AGE = 600;
	
	public static final SecureRandom random = new SecureRandom();
	public static BigInteger prime1 = null, prime2 = null;
	public static long lastPrimeChange = 0;
	
	protected int postType = X_WWW_FORM_URLENCODED; 
	
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
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		//Prime secrets changes every 10 minutes
		if (new Date().getTime() - lastPrimeChange > COOKIE_AGE * 1000)
		{
			synchronized (AbsAuthServlet.class)
			{
				//Recheck after acquiring the lock
				if (new Date().getTime() - lastPrimeChange > COOKIE_AGE * 1000)
				{
					prime2 = prime1;
					prime1 = BigInteger.probablePrime(256, random);
					lastPrimeChange = new Date().getTime();
				}
			}
		}
		
		String stateOnly = request.getParameter("getState");
		
		if ("1".equals(stateOnly))
		{
			String state = new BigInteger(256, random).multiply(prime1).toString(32);
			response.setStatus(HttpServletResponse.SC_OK);
			//Chrome blocks this cookie when draw.io is running in an iframe. The cookie is added to parent frame. TODO FIXME
			response.setHeader("Set-Cookie", STATE_COOKIE + "=" + state + "; Max-Age=" + COOKIE_AGE + "; Secure; HttpOnly; SameSite=none"); //10 min to finish auth
			response.setHeader("Content-Type", "text/plain");
			OutputStream out = response.getOutputStream();
			out.write(state.getBytes());
			out.flush();
			out.close();
			return;
		}
		
		String code = request.getParameter("code");
		String refreshToken = request.getParameter("refresh_token");
		String error = request.getParameter("error");
		HashMap<String, String> stateVars = new HashMap<>();
		String secret = null, client = null, redirectUri = null, domain = null, stateToken = null, cookieToken = null, version = null;
		
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
				
				Cookie[] cookies = request.getCookies();
				
				for (Cookie cookie : cookies)
				{
					if (STATE_COOKIE.equals(cookie.getName()))
					{
						//Ensure cookie value is divisible with prime1 or prime2
						String val = cookie.getValue();
						BigInteger iVal = new BigInteger(val, 32);
						
						if (iVal.mod(prime1).equals(BigInteger.ZERO))
						{
							cookieToken = val;
						}
						else if (prime2 != null && iVal.mod(prime2).equals(BigInteger.ZERO))
						{
							cookieToken = val;
						}
						break;
					}
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
			
			if (error != null)
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
			//TODO after code is propagated, remove the version check
			else if ("2".equals(version) && (stateToken == null || !stateToken.equals(cookieToken)))
			{
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			}
			else
			{
				HttpURLConnection con = null;
				
				try
				{
					String url = CONFIG.AUTH_SERVICE_URL;
					URL obj = new URL(url);
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
	
					response.setStatus(con.getResponseCode());
					
					OutputStream out = response.getOutputStream();
		
					PrintWriter writer = new PrintWriter(out);
	
					// Writes JavaScript code
					writer.println(processAuthResponse(authRes.toString(), jsonResponse));
		
					writer.flush();
					writer.close();
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
						response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					}
					else
					{
						response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
						e.printStackTrace();
						System.err.println(details);
					}
					
					if (DEBUG)
					{
						OutputStream out = response.getOutputStream();
						
						PrintWriter writer = new PrintWriter(out);
		
						e.printStackTrace(writer);
						writer.println(details.toString());
			
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

}
