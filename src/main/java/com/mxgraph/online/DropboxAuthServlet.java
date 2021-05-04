/**
 * Copyright (c) 2006-2019, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;

@SuppressWarnings("serial")
public class DropboxAuthServlet extends AbsAuthServlet
{
	public static String CLIENT_SECRET_FILE_PATH = "/WEB-INF/dropbox_client_secret";
	public static String CLIENT_ID_FILE_PATH = "/WEB-INF/dropbox_client_id";
	
	private static Config CONFIG = null;
	
	protected Config getConfig()
	{
		if (CONFIG == null)
		{
			String clientSerets, clientIds;
			
			try
			{
				clientSerets = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(CLIENT_SECRET_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Client secrets path invalid");
			}

			try
			{
				clientIds = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(CLIENT_ID_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				throw new RuntimeException("Client IDs path invalid");
			}
			
			CONFIG = new Config(clientIds, clientSerets);
			CONFIG.AUTH_SERVICE_URL = "https://api.dropboxapi.com/oauth2/token";
			CONFIG.REDIRECT_PATH = "/dropbox";
		}
		
		return CONFIG;
	}
	
	public DropboxAuthServlet()
	{
		super();
		cookiePath = "/dropbox";
		withRedirectUrlInRefresh = false;
	}
	
	protected String processAuthResponse(String authRes, boolean jsonResponse)
	{
		StringBuffer res = new StringBuffer();
		
		if (!jsonResponse)
		{
			res.append("<!DOCTYPE html><html><head><script type=\"text/javascript\">");
			res.append("(function() { var authInfo = ");  //The following is a json containing access_token
		}
		
		res.append(authRes);
		
		if (!jsonResponse)
		{
			res.append(";");
			res.append("if (window.opener != null && window.opener.onDropboxCallback != null)"); 
			res.append("{");
			res.append("	window.opener.onDropboxCallback(authInfo, window);");
			res.append("} else {");
			res.append("	onDropboxCallback(authInfo);");
			res.append("}");
			res.append("})();</script>");
			res.append("</head><body></body></html>");
		}

		return res.toString();
	}
}
