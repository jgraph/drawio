package com.mxgraph.online;

import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 
 * Returns XHTML in Confluence Storage Format indicating to display the PNG
 * attachment of the diagram
 *
 */
public class ConnectRenderServlet extends HttpServlet
{
	private static final long serialVersionUID = 161100757439732089L;

	public void doGet(HttpServletRequest request, HttpServletResponse response)
	{
		String pageId = request.getParameter("pageId");
		String diagramName = request.getParameter("diagramName");
		String filenameIntact = request.getParameter("filenameIntact");

		try
		{
			diagramName = URLEncoder.encode(diagramName, "UTF-8");
		}
		catch (UnsupportedEncodingException e1)
		{
			e1.printStackTrace();
		}

		String fileSuffix = filenameIntact != null ? "" : ".png";
		String staticMacro = "<ac:image><ri:url ri:value=\"/download/attachments/" + pageId + "/" + diagramName + fileSuffix + "?api=v2\"/></ac:image>";

		try
		{
			byte[] data = staticMacro.getBytes("UTF-8");
			OutputStream out = response.getOutputStream();
			out.write(data);
			out.flush();
			out.close();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}
