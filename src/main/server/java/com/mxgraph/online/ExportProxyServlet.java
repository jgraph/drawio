/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mxgraph.online.Utils.SizeLimitExceededException;

/**
 * Servlet implementation ExportProxyServlet
 */
@SuppressWarnings("serial")
public class ExportProxyServlet extends HttpServlet
{
	// EXPORT_URL is the only remaining backend service. PlantUML is parsed
	// locally by the native converter (js/plantuml/drawio-plantuml.min.js)
	// and EMF images are converted locally by js/diagramly/emf/emf-svg.js,
	// so PLANTUML_URL and EMF_CONVERT_URL were removed. Out-of-range service
	// ids still clamp to 0 below, so legacy /service/1/* and /service/2/*
	// callers now reach EXPORT_URL instead of failing.
	private final String[] supportedServices = {"EXPORT_URL"};

	/**
	 * Ceiling on the size of a proxied export response. Deliberately well
	 * above any plausible real export (a large diagram rendered to PDF or to
	 * PNG at high scale) - it exists only so a compromised or misbehaving
	 * backend cannot stream unbounded data through the proxy, not to police
	 * legitimate exports. Utils.MAX_SIZE (20 MB) is too low for that here:
	 * tripping the limit mid-stream truncates the user's download.
	 */
	private static final int MAX_EXPORT_SIZE = 100 * 1024 * 1024; // 100 MB

	private void doRequest(String method, HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		ScheduledFuture<?> deadline = null;

		try
		{
			int serviceId = 0;
			String proxyPath = "";
			String queryString = "";
			
			try 
			{
				if (request.getQueryString() != null)
				{
					queryString = "?" + request.getQueryString(); 	
				}
				
				if (request.getPathInfo() != null) // /{serviceId}/*
				{
					String[] pathParts = request.getPathInfo().split("/");
	
					if (pathParts.length > 1)
					{
						serviceId = Integer.parseInt(pathParts[1]);
					}
					
					if (pathParts.length > 2)
					{
						proxyPath = String.join("/", Arrays.copyOfRange(pathParts, 2, pathParts.length));
					}
					
					if (serviceId < 0 || serviceId >= supportedServices.length)
					{
						serviceId = 0;
					}
				}
			}
			catch (Exception e) 
			{
				// Ignore and use 0
				serviceId = 0;
			}
			
			String exportUrl = System.getenv(supportedServices[serviceId]);
			
			if (exportUrl == null || exportUrl.isEmpty() || 
				(!exportUrl.startsWith("http://") && !exportUrl.startsWith("https://")))
			{
				throw new Exception(supportedServices[serviceId] + " not set or invalid");
			}
			else if (!exportUrl.endsWith("/")) // There are other non-trivial cases, admins should configure these URLs carefully
			{
				exportUrl += "/";
			}
			
			// Defence in depth: a spec-compliant servlet container already
			// canonicalises the request path, but reject any residual or
			// encoded traversal in the forwarded path, and confirm the
			// resolved URL still points under the configured base URL, so it
			// cannot escape to other endpoints on the backend.
			if (containsTraversal(proxyPath))
			{
				throw new Exception("Invalid proxy path");
			}

			if (!new URL(exportUrl + proxyPath).toURI().normalize().toString()
					.startsWith(exportUrl))
			{
				throw new Exception("Proxy path escapes the configured base URL");
			}

			URL url = new URL(exportUrl + proxyPath + queryString);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();

			// Without these the JDK waits forever, so a slow or overloaded
			// export backend pins this thread until the OS-level TCP timeout
			// fires. Enough concurrent /export requests then exhaust the
			// container's thread pool and take the whole instance down, not
			// just exports (CWE-400).
			Utils.setTimeouts(con);

			// setTimeouts only bounds a single read, so it resets on every
			// byte. This bounds the exchange as a whole.
			deadline = Utils.setDeadline(con, Utils.HTTP_TOTAL_BUDGET);

			con.setRequestMethod(method);
			
			//Copy request headers to export server
			Enumeration<String> headerNames = request.getHeaderNames();
			 
	        while (headerNames.hasMoreElements()) 
	        {
	            String headerName = headerNames.nextElement();
	            Enumeration<String> headers = request.getHeaders(headerName);
	            
	            while (headers.hasMoreElements()) 
	            {
	                String headerValue = headers.nextElement();
	                con.addRequestProperty(headerName, headerValue);
	            }
	        }
	        
	        if ("POST".equals(method))
	        {
				// Send post request
				con.setDoOutput(true);
				
				OutputStream params = con.getOutputStream();
				Utils.copyRestricted(request.getInputStream(), params);
				params.flush();
				params.close();
	        }
	        
	        int responseCode = con.getResponseCode();
			//Copy response code
			response.setStatus(responseCode);
			
			//Copy response headers
			Map<String, List<String>> map = con.getHeaderFields();
			
			for (Map.Entry<String, List<String>> entry : map.entrySet()) 
			{
				String key = entry.getKey();
				
				if (key != null)
				{
					for (String val : entry.getValue())
					{	
						
						response.addHeader(entry.getKey(), val);
					}
				}
			}
			
			//Copy response
			OutputStream out = response.getOutputStream();
			
			//Error
			if (responseCode >= 400)
			{
				// getErrorStream returns null when the backend sent no body
				InputStream err = con.getErrorStream();

				if (err != null)
				{
					Utils.copyRestricted(err, out);
				}
			}
			else //Success
			{
				// Bounded so a misbehaving backend cannot stream unlimited
				// data through the proxy. The request body is already bounded
				// above, at the smaller Utils.MAX_SIZE.
				Utils.copyRestricted(con.getInputStream(), out, MAX_EXPORT_SIZE);
			}
			
			out.flush();
			out.close();
		}
		catch (SizeLimitExceededException e)
		{
			response.setStatus(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);

			throw e;
		}
		catch (Exception e)
		{
			response.setStatus(
					HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			e.printStackTrace();
		}
		finally
		{
			Utils.clearDeadline(deadline);
		}
	}

	
	/**
	 * Returns true if the forwarded proxy path contains a path-traversal
	 * sequence - a literal "." or ".." segment, an encoded dot/slash
	 * ("%2e", "%2f", "%5c") that a downstream server might decode into one,
	 * or a backslash. Used as defence in depth on top of the servlet
	 * container's own path canonicalisation.
	 */
	private boolean containsTraversal(String proxyPath)
	{
		if (proxyPath == null || proxyPath.isEmpty())
		{
			return false;
		}

		String lower = proxyPath.toLowerCase();

		if (lower.contains("%2e") || lower.contains("%2f")
				|| lower.contains("%5c") || proxyPath.contains("\\"))
		{
			return true;
		}

		for (String segment : proxyPath.split("/"))
		{
			if (segment.equals("..") || segment.equals("."))
			{
				return true;
			}
		}

		return false;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException
	{
		doRequest("GET", request, response);
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException
	{
		doRequest("POST", request, response);
	}
}
