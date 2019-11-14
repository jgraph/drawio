/**
 * Copyright (c) 2006-2019, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;

@SuppressWarnings("serial")
public class MSGraphAuthServlet extends AbsAuthServlet
{
	public static String DEV_CLIENT_SECRET_FILE_PATH = "/WEB-INF/msgraph_dev_client_secret";
	public static String CLIENT_SECRET_FILE_PATH = "/WEB-INF/msgraph_client_secret";
	public static String DEV_CLIENT_ID_FILE_PATH = "/WEB-INF/msgraph_dev_client_id";
	public static String CLIENT_ID_FILE_PATH = "/WEB-INF/msgraph_client_id";
	public static String CLIENT_REDIRECT_URI_FILE_PATH = "/WEB-INF/msgraph_client_redirect_uri";
	
	private static Config CONFIG = null;
	
	protected Config getConfig()
	{
		if (CONFIG == null)
		{
			CONFIG = new Config();
			
			try
			{
				CONFIG.DEV_CLIENT_SECRET = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(DEV_CLIENT_SECRET_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Dev client secret path invalid.");
			}
			
			try
			{
				CONFIG.CLIENT_SECRET = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(CLIENT_SECRET_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Client secret path invalid.");
			}
			
			try
			{
				CONFIG.DEV_CLIENT_ID = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(DEV_CLIENT_ID_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Dev client ID invalid.");
			}

			try
			{
				CONFIG.CLIENT_ID = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(CLIENT_ID_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Client ID invalid.");
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
				throw new RuntimeException("Redirect Uri is invalid");
			}
			
			CONFIG.DEV_REDIRECT_URI = "https://test.draw.io/microsoft";
			CONFIG.AUTH_SERVICE_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
		}
		
		return CONFIG;
	}	

	protected String processAuthResponse(String authRes, boolean jsonResponse)
	{
		StringBuffer res = new StringBuffer();
		
		//Call the opener callback function directly with the given json
		if (!jsonResponse)
		{
			res.append("<!DOCTYPE html><html><head><script src=\"https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js\" type=\"text/javascript\"></script><script>");
			res.append("var authInfo = ");  //The following is a json containing access_token and redresh_token
		}
		
		res.append(authRes);

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

		return res.toString();
	}
}
