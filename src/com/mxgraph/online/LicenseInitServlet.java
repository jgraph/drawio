/**
 * $Id: LicenseInitServlet.java,v 1.4 2013/12/13 13:18:11 david Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.GregorianCalendar;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

@SuppressWarnings("serial")
public class LicenseInitServlet extends HttpServlet
{

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public LicenseInitServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			initDatastore();
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("text/html");

			OutputStream out = response.getOutputStream();
			out.write("License Datastore initialized".getBytes());
			out.flush();
			out.close();
		}
		catch (Exception e)
		{
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void initDatastore()
	{
		Calendar c = new GregorianCalendar();
		c.add(Calendar.DATE, -1);

		Entity entity = new Entity(LicenseServlet.ENTITY_SC, "example.com");
		entity.setProperty("type", "test");
		entity.setProperty("json", "{\"expiry\": \""
				+ LicenseServlet.isoDateFormat.format(c.getTime()) + "\"}");

		DatastoreServiceFactory.getDatastoreService().put(entity);
	}

}
