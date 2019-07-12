/**
 * Copyright (c) 2006-2019, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;

@SuppressWarnings("serial")
public class GoogleAuthServlet extends AbsAuthServlet
{
	public static String CLIENT_SECRET_FILE_PATH = "/WEB-INF/google_client_secret";
	public static String CLIENT_ID_FILE_PATH = "/WEB-INF/google_client_id";
	private static Config CONFIG = null;
	
	protected Config getConfig()
	{
		if (CONFIG == null)
		{
			CONFIG = new Config();
			
			try
			{
				CONFIG.CLIENT_SECRET = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(CLIENT_SECRET_FILE_PATH))
						.replaceAll("\n", "");
				CONFIG.DEV_CLIENT_SECRET = CONFIG.CLIENT_SECRET;
			}
			catch (IOException e)
			{
				throw new RuntimeException("Client secret path invalid");
			}

			try
			{
				CONFIG.CLIENT_ID = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(CLIENT_ID_FILE_PATH))
						.replaceAll("\n", "");
				CONFIG.DEV_CLIENT_ID = CONFIG.CLIENT_ID;
			}
			catch (IOException e)
			{
				throw new RuntimeException("Client ID path invalid");
			}
			
			CONFIG.AUTH_SERVICE_URL = "https://www.googleapis.com/oauth2/v4/token";
			CONFIG.DEV_REDIRECT_URI = "https://test.draw.io/google";
			CONFIG.REDIRECT_URI = "https://www.draw.io/google";
		}
		
		return CONFIG;
	}
	
	protected String processAuthResponse(String authRes, boolean jsonResponse)
	{
		StringBuffer res = new StringBuffer();
		
		//Call the opener callback function directly with the given json
		if (!jsonResponse)
		{
			res.append("<!DOCTYPE html><html><head>");
			res.append("<script src=\"/connect/office365/js/drive.js\" type=\"text/javascript\"></script>");
			res.append("<script type=\"text/javascript\">");
			res.append("var authInfo = ");  //The following is a json containing access_token and redresh_token
		}
		
		res.append(authRes);
		
		if (!jsonResponse)
		{
			res.append(";");
			res.append("onGDriveCallback(authInfo);");
			res.append("</script>");
			res.append("</head><body></body></html>");
		}
		
		return res.toString();
	}
}
