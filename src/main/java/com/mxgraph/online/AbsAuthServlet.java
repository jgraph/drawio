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
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

import javax.servlet.ServletException;
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
	
	protected int postType = X_WWW_FORM_URLENCODED; 
	
	static public class Config 
	{
		public String DEV_CLIENT_SECRET = null, CLIENT_SECRET = null, DEV_CLIENT_ID = null, CLIENT_ID = null,
				DEV_REDIRECT_URI = null, REDIRECT_URI = null, AUTH_SERVICE_URL = null;
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
		String code = request.getParameter("code");
		String refreshToken = request.getParameter("refresh_token");
		String error = request.getParameter("error");
		HashMap<String, String> stateVars = new HashMap<>();
		int configIndex = 0;
		
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
			
				String appIndex = stateVars.get("appIndex");
						
				if (appIndex != null)
				{
					configIndex = Integer.parseInt(appIndex);
				}
			}
			catch(Exception e)
			{
				//Ignore, incorrect arguments
				e.printStackTrace();
			}

			Config CONFIG = getConfig();
			String secret, client, redirectUri;
			String[] secrets, clients;

			if ("127.0.0.1".equals(request.getServerName()) || 
					"devhost.jgraph.com".equals(request.getServerName()) ||
					"localhost".equals(request.getServerName()))
			{
				secrets = CONFIG.DEV_CLIENT_SECRET.split(SEPARATOR);
				clients = CONFIG.DEV_CLIENT_ID.split(SEPARATOR);
				redirectUri = CONFIG.DEV_REDIRECT_URI;
			}
			else
			{
				secrets = CONFIG.CLIENT_SECRET.split(SEPARATOR);
				clients = CONFIG.CLIENT_ID.split(SEPARATOR);
				redirectUri = CONFIG.REDIRECT_URI;
			}
	
			secret = secrets.length > configIndex ? secrets[configIndex] : secrets[0];
			client = clients.length > configIndex ? clients[configIndex] : clients[0];
	
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
			else if (code == null && refreshToken == null)
			{
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
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
