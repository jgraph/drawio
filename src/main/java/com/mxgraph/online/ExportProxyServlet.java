package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation ExportProxyServlet
 */
@SuppressWarnings("serial")
public class ExportProxyServlet extends HttpServlet
{
	private final String EXPORT_URL = "http://localhost:8000/";
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			String exportUrl = System.getenv("EXPORT_URL");
			
			if (exportUrl == null)
			{
				exportUrl = EXPORT_URL;
			}
			
			URL url = new URL(exportUrl);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			
			con.setRequestMethod("POST");
			
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
	        
			// Send post request
			con.setDoOutput(true);
			
			OutputStream params = con.getOutputStream();
			Utils.copy(request.getInputStream(), params);
			params.flush();
			params.close();
			
			//Copy response code
			response.setStatus(con.getResponseCode());
			
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
			Utils.copy(con.getInputStream(), out);
			out.flush();
			out.close();
		}
		catch (Exception e)
		{
			response.setStatus(
					HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			e.printStackTrace();
		}
	}
}
