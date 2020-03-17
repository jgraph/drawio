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
		public String REDIRECT_PATH = null, AUTH_SERVICE_URL = null;
		//TODO These variables are temporary until new method is propagated
		public String OLD_REDIRECT_URL = null, OLD_CLIENT_ID = null;

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
		String code = request.getParameter("code");
		String refreshToken = request.getParameter("refresh_token");
		String error = request.getParameter("error");
		HashMap<String, String> stateVars = new HashMap<>();
		String secret = null, client = null, redirectUri = null, domain = null, appIndex = null; //TODO appIndex variable is temporary until new method is propagated
		
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
				appIndex = stateVars.get("appIndex"); //TODO appIndex variable is temporary until new method is propagated
			}
			catch(Exception e)
			{
				//Ignore, incorrect arguments
				e.printStackTrace();
			}

			Config CONFIG = getConfig();
			redirectUri = CONFIG.getRedirectUrl(domain != null? domain : request.getServerName());
			
			//TODO This code block is temporary until new method is propagated
			if (appIndex != null || client == null)
			{
				int configIndex = 0;
				
				try
				{
					configIndex = Integer.parseInt(appIndex);
				}
				catch(Exception e) {} // Ignore

				
				String[] clients = CONFIG.OLD_CLIENT_ID.split(SEPARATOR);
				String[] redirectUris = CONFIG.OLD_REDIRECT_URL.split(SEPARATOR);

				if (configIndex < 0 || configIndex >= clients.length)
				{
					configIndex = 0;
				}
				
				client = clients[configIndex];
				redirectUri = redirectUris[configIndex];
			}

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
