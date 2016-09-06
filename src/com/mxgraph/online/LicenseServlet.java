/**
 * $Id: LicenseServlet.java,v 1.4 2013/12/13 13:18:11 david Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.KeyFactory;

/**
 * Possible values for json property:
 * 
 * {"expiry": "YYYY-MM-DD"} (eg. {"expiry": "2016-03-31"}) or {"expiry": "never"}
 * 
 * A date within 90 days will show a message that the license will expire.
 * A date in the past (or same day) will show a message that the license has expired.
 * A date in the future or an empty JSON object (eg. {}) will remove the footer.
 * An empty string for json is the same as no entry (ie. footer will not be removed).
 * 
 * Possible keys:
 * 
 * Any domain name (eg. example.com).
 */
@SuppressWarnings("serial")
public class LicenseServlet extends HttpServlet
{
	/**
	 * 
	 */
	public static String ENTITY_SC = "DrawioLicense";

	/**
	 * 
	 */
	public static SimpleDateFormat isoDateFormat = new SimpleDateFormat(
			"yyyy-MM-dd");

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public LicenseServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		String domain = request.getParameter("domain");

		if (domain != null)
		{
			try
			{
				response.setCharacterEncoding("UTF-8");
				response.setContentType("application/json");

				OutputStream out = response.getOutputStream();
				out.write(getLicense(domain).getBytes());
				out.flush();
				out.close();

				response.setStatus(HttpServletResponse.SC_OK);
			}
			catch (EntityNotFoundException e)
			{
				response.setStatus(HttpServletResponse.SC_NO_CONTENT);
			}
			catch (Exception e)
			{
				response.setStatus(
						HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				e.printStackTrace();
			}
		}
		else
		{
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected String getLicense(String domain) throws EntityNotFoundException
	{
		// Returns test licences
		if (domain.equals("valid-example.test"))
		{
			Calendar c = new GregorianCalendar();
			c.add(Calendar.DATE, 120);

			return "{\"expiry\": \"" + isoDateFormat.format(c.getTime())
					+ "\"}";
		}
		else if (domain.equals("expire-example.test"))
		{
			Calendar c = new GregorianCalendar();
			c.add(Calendar.DATE, 30);

			return "{\"expiry\": \"" + isoDateFormat.format(c.getTime())
					+ "\"}";
		}
		else if (domain.equals("expired-example.test"))
		{
			Calendar c = new GregorianCalendar();
			c.add(Calendar.DATE, -10);

			return "{\"expiry\": \"" + isoDateFormat.format(c.getTime())
					+ "\"}";
		}

		// Uses the datastore to retrieve the data for the domain
		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();

		// LATER: Check email first then domain
		return datastore.get(KeyFactory.createKey(ENTITY_SC, domain))
				.getProperty("json").toString();
	}

}
