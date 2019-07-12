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

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
abstract public class AbsAuthServlet extends HttpServlet
{

	static public class Config 
	{
		public String DEV_CLIENT_SECRET = null, CLIENT_SECRET = null, DEV_CLIENT_ID = null, CLIENT_ID = null,
				DEV_REDIRECT_URI = null, REDIRECT_URI = null, AUTH_SERVICE_URL = null;
	}
	
	protected Config getConfig()
	{
		return null;
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
		Config CONFIG = getConfig();
		String secret, client, redirectUri;
		
		if ("127.0.0.1".equals(request.getServerName()))
		{
			secret = CONFIG.DEV_CLIENT_SECRET;
			client = CONFIG.DEV_CLIENT_ID;
			redirectUri = CONFIG.DEV_REDIRECT_URI;
		}
		else
		{
			secret = CONFIG.CLIENT_SECRET;
			client = CONFIG.CLIENT_ID;
			redirectUri = CONFIG.REDIRECT_URI;
		}

		if (code == null && refreshToken == null)
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
				con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
	
				boolean jsonResponse = false;
				StringBuilder urlParameters = new StringBuilder();
				
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
				e.printStackTrace();

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
						}
						in.close();
					}
					catch (Exception e2) 
					{
						// Ignore
					}
				}
				
				if (e.getMessage().contains("401"))
				{
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				}
				else
				{
					response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				}
			}
			catch (Exception e) 
			{
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
		}
	}

}
