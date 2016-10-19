/**
 * $Id: EmbedServlet.java,v 1.18 2014/01/31 22:27:07 gaudenz Exp $
 * Copyright (c) 2011-2012, JGraph Ltd
 * 
 * TODO
 * 
 * We could split the static part and the stencils into two separate requests
 * in order for multiple graphs in the pages to not load the static part
 * multiple times. This is only relevant if the embed arguments are different,
 * in which case there is a problem with parsin the graph model too soon, ie.
 * before certain stencils become available.
 * 
 * Easier solution is for the user to move the embed script to after the last
 * graph in the page and merge the stencil arguments.
 * 
 * Note: The static part is roundly 105K, the stencils are much smaller in size.
 * This means if the embed function is widely used, it will make sense to factor
 * out the static part because only stencils will change between pages.
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.utils.SystemProperty;

/**
 * Servlet implementation class OpenServlet
 */
public class EmbedServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	protected static String reader = null;

	/**
	 * 
	 */
	protected static String embed = null;
	
	/**
	 * 
	 */
	protected static String embedDev = null;
	
	/**
	 * 
	 */
	protected static String stylesheet = null;

	/**
	 * 
	 */
	protected static String lastModified = null;

	/**
	 * 
	 */
	protected HashMap<String, String> stencils = new HashMap<String, String>();

	/**
	 * 
	 */
	protected HashMap<String, String[]> libraries = new HashMap<String, String[]>();

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public EmbedServlet()
	{
		if (lastModified == null)
		{
			// Uses deployment date as lastModified header
			String applicationVersion = SystemProperty.applicationVersion.get();
			Date uploadDate = new Date(Long.parseLong(applicationVersion
					.substring(applicationVersion.lastIndexOf(".") + 1))
					/ (2 << 27) * 1000);

			DateFormat httpDateFormat = new SimpleDateFormat(
					"EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
			lastModified = httpDateFormat.format(uploadDate);
		}

		initLibraries(libraries);
	}

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public static void initLibraries(HashMap<String, String[]> libraries)
	{
		libraries.put("bpmn", new String[] { "/shapes/bpmn/mxBpmnShape2.js",
				"/stencils/bpmn.xml" });
		libraries.put("er", new String[] { "/shapes/er/mxER.js" });
		libraries.put("ios", new String[] { "/shapes/mockup/mxMockupiOS.js" });
		libraries.put("ios7", new String[] { "/stencils/ios7.xml" });
		libraries.put("android", new String[] { "/shapes/mxAndroid.js",
				"/stencils/android/android.xml" });
		libraries.put("lean_mapping", new String[] { "/shapes/mxLeanMap.js",
				"/stencils/lean_mapping.xml" });
		// Required for anchor shape which follows non-standard naming scheme (see Sidebar.js)
		libraries.put("mockup",
				new String[] { "/shapes/mockup/mxMockupButtons.js" });
		libraries.put("mockup/buttons",
				new String[] { "/shapes/mockup/mxMockupButtons.js" });
		libraries.put("mockup/containers",
				new String[] { "/shapes/mockup/mxMockupContainers.js" });
		libraries.put("mockup/forms",
				new String[] { "/shapes/mockup/mxMockupForms.js" });
		libraries.put("mockup/graphics", new String[] {
				"/shapes/mockup/mxMockupGraphics.js",
				"/stencils/mockup/misc.xml" });
		libraries.put("mockup/markup",
				new String[] { "/shapes/mockup/mxMockupMarkup.js" });
		libraries
				.put("mockup/misc", new String[] {
						"/shapes/mockup/mxMockupMisc.js",
						"/stencils/mockup/misc.xml" });
		libraries.put("mockup/navigation", new String[] {
				"/shapes/mockup/mxMockupNavigation.js",
				"/stencils/mockup/misc.xml" });
		libraries.put("mockup/text",
				new String[] { "/shapes/mockup/mxMockupText.js" });
		libraries.put("pid2inst",
				new String[] { "/shapes/pid2/mxPidInstruments.js" });
		libraries.put("pid2misc", new String[] { "/shapes/pid2/mxPidMisc.js",
				"/stencils/pid/misc.xml" });
		libraries.put("pid2valves",
				new String[] { "/shapes/pid2/mxPidValves.js" });
		libraries.put("floorplan", new String[] { "/shapes/mxFloorplan.js",
				"/stencils/floorplan.xml" });
		libraries.put("archimate", new String[] { "/shapes/mxArchiMate.js" });
		libraries.put("azure", new String[] { "/stencils/azure.xml" });
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			String qs = request.getQueryString();

			if (qs != null && qs.equals("stats"))
			{
				writeStats(response);
			}
			else
			{
				if (reader == null)
				{
					reader = readFile("/js/reader.min.js");
				}

				if (embed == null)
				{
					embed = readFile("/js/embed.min.js");
				}
				
				if (embedDev == null)
				{
					embedDev = readFile("/js/embed.dev.js");
				}

				if (stylesheet == null)
				{
					stylesheet = readXmlFile("/styles/default.xml", true);
				}

				// Checks or sets last modified date of delivered content.
				// Date comparison not needed. Only return 304 if
				// delivered by this servlet instance.
				String modSince = request.getHeader("If-Modified-Since");

				if (modSince != null && modSince.equals(lastModified))
				{
					response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
				}
				else
				{
					writeEmbedResponse(request, response);
				}
			}
		}
		catch (Exception e)
		{
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	public void writeEmbedResponse(HttpServletRequest request,
			HttpServletResponse response) throws IOException
	{
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/javascript; charset=UTF-8");
		response.setHeader("Last-Modified", lastModified);

		OutputStream out = response.getOutputStream();

		// FIXME: Accept-encoding header is missing
		String encoding = request.getHeader("Accept-Encoding");

		// Supports GZIP content encoding
		if (encoding != null && encoding.indexOf("gzip") >= 0)
		{
			response.setHeader("Content-Encoding", "gzip");
			out = new GZIPOutputStream(out);
		}

		// Creates XML for stencils
		PrintWriter writer = new PrintWriter(out);

		// Writes JavaScript and adds function call with
		// stylesheet and stencils as arguments 
		writer.println(createEmbedJavaScript(request.getParameter("s"), request.getParameter("dev")));
		response.setStatus(HttpServletResponse.SC_OK);

		writer.flush();
		writer.close();
	}

	public String createEmbedJavaScript(String sparam, String dev) throws IOException
	{
		StringBuffer result = new StringBuffer("[");
		StringBuffer js = new StringBuffer("");

		// Processes each stencil only once
		HashSet<String> done = new HashSet<String>();
		
		// Processes each lib only once
		HashSet<String> libsLoaded = new HashSet<String>();

		if (sparam != null)
		{
			String[] names = sparam.split(";");

			for (int i = 0; i < names.length; i++)
			{
				if (names[i].indexOf("..") < 0 && !done.contains(names[i]))
				{
					if (names[i].equals("*"))
					{
						js.append(readXmlFile("/js/shapes.min.js", false));
						result.append("'" + readXmlFile("/stencils.xml", true)
								+ "'");
					}
					else
					{
						// Checks if any JS files are associated with the library
						// name and injects the JS into the page
						String[] libs = libraries.get(names[i]);

						if (libs != null)
						{
							for (int j = 0; j < libs.length; j++)
							{
								if (!libsLoaded.contains(libs[j]))
								{
									String tmp = stencils.get(libs[j]);
									libsLoaded.add(libs[j]);
									
									if (tmp == null)
									{
										try
										{
											tmp = readXmlFile(libs[j], !libs[j]
													.toLowerCase().endsWith(".js"));
	
											// Cache for later use
											if (tmp != null)
											{
												stencils.put(libs[j], tmp);
											}
										}
										catch (NullPointerException e)
										{
											// This seems possible according to access log so ignore stencil
										}
									}
	
									if (tmp != null)
									{
										// TODO: Add JS to Javascript code inline. This had to be done to quickly
										// add JS-based dynamic loading to the existing embed setup where everything
										// dynamic is passed via function call, so an indirection via eval must be
										// used even though the JS could be parsed directly by adding it to JS.
										if (libs[j].toLowerCase().endsWith(".js"))
										{
											js.append(tmp);
										}
										else
										{
											if (result.length() > 1)
											{
												result.append(",");
											}
											
											result.append("'" + tmp + "'");
										}
									}
								}
							}
						}
						else
						{
							String tmp = stencils.get(names[i]);

							if (tmp == null)
							{
								try
								{
									tmp = readXmlFile("/stencils/" + names[i]
											+ ".xml", true);

									// Cache for later use
									if (tmp != null)
									{
										stencils.put(names[i], tmp);
									}
								}
								catch (NullPointerException e)
								{
									// This seems possible according to access log so ignore stencil
								}
							}

							if (tmp != null)
							{
								if (result.length() > 1)
								{
									result.append(",");
								}
								
								result.append("'" + tmp + "'");
							}
						}
					}

					done.add(names[i]);
				}
			}
		}

		result.append("]");
		
		String tmp = (dev != null && dev.equals("1")) ? embedDev : embed;

		// JS must be executed after core but before embed function
		return reader + "\n" + js + tmp + "})('" + stylesheet + "',"
				+ result.toString() + ");";
	}

	public void writeStats(HttpServletResponse response) throws IOException
	{
		PrintWriter writer = new PrintWriter(response.getOutputStream());
		writer.println("<html>");
		writer.println("<body>");
		writer.println("Deployed: " + lastModified);
		writer.println("</body>");
		writer.println("</html>");
		writer.flush();
	}

	public String readXmlFile(String filename, boolean xmlContent)
			throws IOException
	{
		String result = readFile(filename);

		if (xmlContent)
		{
			result = result.replaceAll("'", "\\\\'").replaceAll("\t", "")
					.replaceAll("\n", "");
		}

		return result;
	}

	public String readFile(String filename) throws IOException
	{
		InputStream is = getServletContext().getResourceAsStream(filename);

		return Utils.readInputStream(is);
	}

}
