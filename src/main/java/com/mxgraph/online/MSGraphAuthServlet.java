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
public class MSGraphAuthServlet extends HttpServlet
{

	/**
	 * 
	 */
	public static final String DEV_CLIENT_SECRET_FILE_PATH = "/WEB-INF/msgraph_dev_client_secret";

	/**
	 * 
	 */
	private static String DEV_CLIENT_SECRET = null;

	/**
	 * 
	 */
	public static final String CLIENT_SECRET_FILE_PATH = "/WEB-INF/msgraph_client_secret";

	/**
	 * 
	 */
	private static String CLIENT_SECRET = null;

	/**
	 * 
	 */
	public static final String DEV_CLIENT_ID_FILE_PATH = "/WEB-INF/msgraph_dev_client_id";

	/**
	 * 
	 */
	private static String DEV_CLIENT_ID = null;

	/**
	 * 
	 */
	public static final String CLIENT_ID_FILE_PATH = "/WEB-INF/msgraph_client_id";

	/**
	 * 
	 */
	private static String CLIENT_ID = null;

	/**
	 * 
	 */
	public static final String DEV_REDIRECT_URI = "https://test.draw.io/microsoft";

	/**
	 * 
	 */
	public static final String REDIRECT_URI = "https://www.draw.io/microsoft";

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public MSGraphAuthServlet()
	{
		super();
	}

	/**
	 * Loads the key.
	 */
	protected void updateKeys()
	{
		if (DEV_CLIENT_SECRET == null)
		{
			try
			{
				DEV_CLIENT_SECRET = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(DEV_CLIENT_SECRET_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Dev client secret path invalid.");
			}
		}

		if (CLIENT_SECRET == null)
		{
			try
			{
				CLIENT_SECRET = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(CLIENT_SECRET_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Client secret path invalid.");
			}
		}

		if (DEV_CLIENT_ID == null)
		{
			try
			{
				DEV_CLIENT_ID = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(DEV_CLIENT_ID_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Dev client ID invalid.");
			}
		}
		
		if (CLIENT_ID == null)
		{
			try
			{
				CLIENT_ID = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(CLIENT_ID_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Client ID invalid.");
			}
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		String code = request.getParameter("code");
		String refreshToken = request.getParameter("refresh_token");
		updateKeys();
		String secret, client, redirectUri;
		
		if ("127.0.0.1".equals(request.getServerName()))
		{
			secret = DEV_CLIENT_SECRET;
			client = DEV_CLIENT_ID;
			redirectUri = DEV_REDIRECT_URI;
		}
		else
		{
			secret = CLIENT_SECRET;
			client = CLIENT_ID;
			redirectUri = REDIRECT_URI;
		}
		

		if (code == null && refreshToken == null)
		{
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
		else
		{
			try
			{
				String url = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
				URL obj = new URL(url);
				HttpURLConnection con = (HttpURLConnection) obj.openConnection();
	
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
				StringBuffer res = new StringBuffer();
	
				//Call the opener callback function directly with the given json
				if (!jsonResponse)
				{
					res.append("<!DOCTYPE html><html><head><script src=\"https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js\" type=\"text/javascript\"></script><script>");
					res.append("var authInfo = ");  //The following is a json containing access_token and redresh_token
				}
				
				
				while ((inputLine = in.readLine()) != null)
				{
					res.append(inputLine);
				}
				in.close();
	
				if (!jsonResponse)
				{
					res.append(";");					
					res.append("if (window.opener != null && window.opener.onOneDriveCallback != null)"); 
					res.append("{");
					res.append("	window.opener.onOneDriveCallback(authInfo, window);");
					res.append("} else {");
					res.append("	Office.initialize = function () { Office.context.ui.messageParent(JSON.stringify(authInfo));}");
					res.append("}");
					res.append("</script></head><body></body></html>");
				}
	
				response.setStatus(con.getResponseCode());
				
				OutputStream out = response.getOutputStream();
	
				PrintWriter writer = new PrintWriter(out);
	
				// Writes JavaScript code
				writer.println(res.toString());
	
				writer.flush();
				writer.close();
			}
			catch(IOException e)
			{
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
