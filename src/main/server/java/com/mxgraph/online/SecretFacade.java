/**
 * Copyright (c) 2020-2026, JGraph Holdings Ltd
 * Copyright (c) 2020-2026, draw.io AG
 */
package com.mxgraph.online;

import javax.servlet.ServletContext;

/**
 * Public build version of src/main/server/java/com/mxgraph/online/SecretFacade.java,
 * which uses Secret Manager and is excluded from the public repository. Reads
 * secrets from WEB-INF/<key>, where the Docker image writes them.
 */
public class SecretFacade
{
	private SecretFacade() { }

	public static String getSecret(String key, ServletContext servletContext)
	{
		try
		{
			return Utils.readInputStream(servletContext
					.getResourceAsStream("/WEB-INF/" + key))
					.replaceAll("\n", "");
		}
		catch (Exception e)
		{
			throw new RuntimeException("Reading secret " + key + " failed.");
		}
	}
}
