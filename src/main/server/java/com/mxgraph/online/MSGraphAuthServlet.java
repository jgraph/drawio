/**
 * Copyright (c) 2006-2019, JGraph Holdings Ltd
 */
package com.mxgraph.online;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class MSGraphAuthServlet extends MSGraphAuth implements ServletComm
{
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	public void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		super.doGetAbst(request, response);
	}
}
