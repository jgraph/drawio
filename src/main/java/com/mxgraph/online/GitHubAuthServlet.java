/**
 * Copyright (c) 2006-2019, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;

@SuppressWarnings("serial")
public class GitHubAuthServlet extends AbsAuthServlet
{
	public static String CLIENT_SECRET_FILE_PATH = "/WEB-INF/github_client_secret";
	public static String CLIENT_ID_FILE_PATH = "/WEB-INF/github_client_id";
	public static String AUTH_SERVICE_URL_FILE_PATH = "/WEB-INF/github_auth_url";
	
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

			try
			{
				CONFIG.AUTH_SERVICE_URL = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream(AUTH_SERVICE_URL_FILE_PATH))
						.replaceAll("\n", "");
			}
			catch (IOException e)
			{
				CONFIG.AUTH_SERVICE_URL = "https://github.com/login/oauth/access_token";
			}
			
			CONFIG.REDIRECT_PATH = "/github2";
		}
		
		return CONFIG;
	}
	
	public GitHubAuthServlet()
	{
		super();
		cookiePath = "/github2";
		withRedirectUrl = false;
		withAcceptJsonHeader = true;
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
			res.append("if (window.opener != null && window.opener.onGitHubCallback != null)"); 
			res.append("{");
			res.append("	window.opener.onGitHubCallback(authInfo, window);");
			res.append("} else {");
			res.append("	onGitHubCallback(authInfo);");
			res.append("}");
			res.append("})();</script>");
			res.append("</head><body></body></html>");
		}

		return res.toString();
	}
}
