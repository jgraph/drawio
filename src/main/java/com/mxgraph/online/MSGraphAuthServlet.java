/**
 * Copyright (c) 2006-2019, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;

@SuppressWarnings("serial")
public class MSGraphAuthServlet extends AbsAuthServlet
{
	public static String CLIENT_SECRET_FILE_PATH = "/WEB-INF/msgraph_client_secret";
	public static String CLIENT_ID_FILE_PATH = "/WEB-INF/msgraph_client_id";
	
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
				throw new RuntimeException("Client secrets path invalid.");
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
				throw new RuntimeException("Client IDs path invalid.");
			}
			
			CONFIG = new Config(clientIds, clientSerets);
			CONFIG.REDIRECT_PATH = "/microsoft";
			CONFIG.AUTH_SERVICE_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
			
			//TODO This code is temporary until new method is propagated
			try
			{
				CONFIG.OLD_REDIRECT_URL = Utils
						.readInputStream(getServletContext()
								.getResourceAsStream("/WEB-INF/msgraph_old_client_redirect_uri"))
						.replaceAll("\n", "");
				CONFIG.OLD_CLIENT_ID = clientIds;
			}
			catch (IOException e)
			{
				throw new RuntimeException("OLD CONFIGs path is invalid");
			}
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
			res.append("	var authInfoStr = JSON.stringify(authInfo);");
			res.append("	localStorage.setItem('tmpODAuth', authInfoStr);");
			res.append("	Office.onReady(function () { Office.context.ui.messageParent(authInfoStr);});");
			res.append("}");
			res.append("</script></head><body><div>Automatic login interrupted. Please close and select OneDrive again.</div></body></html>");
		}

		return res.toString();
	}
}
