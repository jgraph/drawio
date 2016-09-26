package com.mxgraph.online;

import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Simple client-side logging servlet
 */
public class LogServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2360583959079622105L;
	
	private static final Logger log = Logger.getLogger(LogServlet.class
			.getName());
	
	static byte[] singleByteGif = { 0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x1, 0x0, 0x1, 0x0, (byte) 0x80, 0x0, 0x0, (byte)  0xff, (byte)  0xff,  (byte) 0xff, 0x0, 0x0, 0x0, 0x2c, 0x0, 0x0, 0x0, 0x0, 0x1, 0x0, 0x1, 0x0, 0x0, 0x2, 0x2, 0x44, 0x1, 0x0, 0x3b };

	public void doGet(HttpServletRequest request, HttpServletResponse response)
	{
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
	{
		try
		{
			String message = request.getParameter("msg");
			String severity = request.getParameter("severity");
			String version = request.getParameter("v");
			String stack = request.getParameter("stack");
			
			if (version != null)
			{
				message += "\nVERSION=" + version;
			}
			
			if (stack != null)
			{
				message += "\n" + stack;
			}

			if (message != null)
			{
				Level severityLevel = Level.CONFIG;
				
				if (severity != null)
				{
					severityLevel = Level.parse(severity);
				}
				
				if (severityLevel.intValue() >= 900)
				{
					// Tidy up warnings and severes
					message = message == null ? message : URLDecoder.decode(message, "UTF-8");
				}

				log.log(severityLevel, "CLIENT-LOG:" + message);
			}

			response.setContentType("image/gif");
			OutputStream out = response.getOutputStream();
			out.write(singleByteGif);
			out.flush();
			out.close();
			
			response.setStatus(HttpServletResponse.SC_OK);
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
	}
}
