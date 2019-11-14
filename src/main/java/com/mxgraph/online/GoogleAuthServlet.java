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
	public static String CLIENT_REDIRECT_URI_FILE_PATH = "/WEB-INF/google_client_redirect_uri";
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
			
			try
			{
				CONFIG.REDIRECT_URI = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(CLIENT_REDIRECT_URI_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Client ID path invalid");
			}
			
			CONFIG.AUTH_SERVICE_URL = "https://www.googleapis.com/oauth2/v4/token";
			CONFIG.DEV_REDIRECT_URI = "https://test.draw.io/google";
		}
		
		return CONFIG;
	}
	
	protected String processAuthResponse(String authRes, boolean jsonResponse)
	{
		StringBuffer res = new StringBuffer();
		
		//In Office Add-in, we don't have access to opened window to attach a function to it, 
		//	also with the redirect (since we had to open google auth in the same window) we lost Office Messaging.
		//	This is due to using Google own file picker instead of creating our own picker 
		//	(as we did with OneDrive since its picker only support popup windows which is not supported in Office)
		//	This is why we load drive.js which define onGDriveCallback and redirects automatically to the page including the picker
		//	For other scenarios, we use another function name (onGoogleDriveCallback)
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
			res.append("if (window.opener != null && window.opener.onGoogleDriveCallback != null)"); 
			res.append("{");
			res.append("	window.opener.onGoogleDriveCallback(authInfo, window);");
			res.append("} else {");
			res.append("	onGDriveCallback(authInfo);");
			res.append("}");
			res.append("</script>");
			res.append("</head><body></body></html>");
		}
		
		return res.toString();
	}
}
