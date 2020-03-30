/**
 * $Id: GoogleSitesServlet.java,v 1.4 2014/01/27 21:51:26 gaudenz Exp $
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
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class OpenServlet
 */
public class GoogleGadgetServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public GoogleGadgetServlet()
	{

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		String diagram = request.getParameter("diagram");
		String type = request.getParameter("type");
		String title = request.getParameter("title");
		String edit = request.getParameter("edit");
		String embed = request.getParameter("embed");
		String b = request.getParameter("border");
		String zoom = request.getParameter("zoom");
		String pan = request.getParameter("pan");
		String fit = request.getParameter("fit");
		String resize = request.getParameter("resize");
		String height = request.getParameter("height");
		String math = request.getParameter("math");
		String x0 = request.getParameter("x0");
		String y0 = request.getParameter("y0");
		String s = request.getParameter("s");
		boolean showEmbed = (embed != null) ? embed.equals("1") : true;
		
		if (diagram == null)
		{
			diagram = "";
		}
		
		if (type == null)
		{
			type = "1";
		}

		if (title == null)
		{
			title = "Draw.io diagram";
		}
		
		if (height == null)
		{
			height = "400";
		}
		
		if (edit == null)
		{
			edit = "";
		}
		
		if (s == null)
		{
			s = "";
		}
		
		if (x0 == null)
		{
			x0 = "0";
		}
		
		if (y0 == null)
		{
			y0 = "0";
		}

		if (b == null)
		{
			b = "0";
		}

		if (zoom == null)
		{
			zoom = "1";
		}

		if (resize == null)
		{
			resize = "0";
		}

		if (pan == null)
		{
			pan = "1";
		}
		
		if (fit == null)
		{
			fit = "1";
		}

		if (math == null)
		{
			math = "0";
		}
		
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/xml");
		response.setStatus(HttpServletResponse.SC_OK);
		
		// Could use makeRequest with lower refreshInterval for getting data from
		// URLs and possibly, using OAUTH, for getting Drive file contents without
		// requiring to handle auth in the draw.io app again (pass XML in via
		// postMessage for example with a message to request the XML for solving
		// the timing issue when loading cross-domain iframe contents).
		OutputStream out = response.getOutputStream();
		out.write(("<Module>\n"+
				"<ModulePrefs title=\"" + title + "\" height=\"" + height + "\"\n"+
				" screenshot=\"https://www.draw.io/images/gadget-screenshot.png\"\n"+
				" thumbnail=\"https://www.draw.io/images/gadget-thumb.png\"/>\n"+
				"<UserPref name=\"diagram\" display_name=\"Diagram ID or URL\" datatype=\"string\"\n"+
				" default_value=\"" + diagram + "\" required=\"true\">\n"+
				"</UserPref>\n"+
				"<UserPref name=\"type\" display_name=\"Location\" datatype=\"enum\"\n"+
				" default_value=\"" + type + "\">\n"+
				" <EnumValue value=\"1\" display_value=\"Google Drive\"/>\n"+
				" <EnumValue value=\"2\" display_value=\"Dropbox\"/>\n"+
				" <EnumValue value=\"3\" display_value=\"Public\"/>\n"+
				((showEmbed) ? " <EnumValue value=\"4\" display_value=\"Public (Embed)\"/>\n" : "")+
				"</UserPref>\n"+
				((showEmbed) ?
				"<UserPref name=\"x0\" display_name=\"Left (Embed)\" datatype=\"string\" default_value=\"" + x0 + "\"></UserPref>\n"+
				"<UserPref name=\"y0\" display_name=\"Top (Embed)\" datatype=\"string\" default_value=\"" + y0 + "\"></UserPref>\n"+
				"<UserPref name=\"border\" display_name=\"Border (Embed)\" datatype=\"string\" default_value=\"" + b + "\"></UserPref>\n"+
				"<UserPref name=\"zoom\" display_name=\"Zoom enabled (Embed)\" datatype=\"bool\" default_value=\"" + ((zoom.equals("1")) ? "true" : "false") + "\"></UserPref>\n"+
				"<UserPref name=\"pan\" display_name=\"Panning enabled (Embed)\" datatype=\"bool\" default_value=\"" + ((pan.equals("1")) ? "true" : "false") + "\"></UserPref>\n"+
				"<UserPref name=\"fit\" display_name=\"Fit diagram to gadget (Embed)\" datatype=\"bool\" default_value=\"" + ((fit.equals("1")) ? "true" : "false") + "\"></UserPref>\n"+
				"<UserPref name=\"resize\" display_name=\"Resize container (Embed)\" datatype=\"bool\" default_value=\"" + ((resize.equals("1")) ? "true" : "false") + "\"></UserPref>\n"+
				"<UserPref name=\"math\" display_name=\"Mathematical typesetting (Embed)\" datatype=\"bool\" default_value=\"" + ((math.equals("1")) ? "true" : "false") + "\"></UserPref>\n"+
				"<UserPref name=\"edit\" display_name=\"Edit URL (Embed)\" datatype=\"string\" default_value=\"" + edit + "\"></UserPref>\n"+
				"<UserPref name=\"stencils\" display_name=\"Stencils (Embed)\" datatype=\"string\" default_value=\"" + s + "\"></UserPref>\n"
				: "")+
				"<Content type=\"html\">\n"+
				"<![CDATA[\n"+
				" <script type=\"text/javascript\">\n"+
				" var prefs = new _IG_Prefs();\n"+
				" var type = prefs.getString(\'type\');\n"+
				" var diagram = prefs.getString(\'diagram\');\n"+
				" \n"+
				" if (diagram != null && diagram.length > 0)\n"+
				" {\n"+
				" if (type <= 3)\n"+
				" {\n"+
				" var file = (type == 3) ? \'&gapi=0&db=0&url=\' + encodeURIComponent(diagram) :\n"+
				" (((type == 2) ? \'&gapi=0\' : \'&db=0\') +\n"+
				" \'#\' + ((type == 2) ? \'D\' : \'G\') + diagram);\n"+
				"\n"+
				" var iframe = document.createElement(\'iframe\');\n"+
				" iframe.setAttribute(\'frameborder\', \'0\');\n"+
				" iframe.style.width = \'100%\';\n"+
				" iframe.style.height = \'100%\';\n"+
				" iframe.setAttribute(\'src\', \'https://www.draw.io/?chrome=0\' + file);\n"+
				" document.body.appendChild(iframe);\n"+
				" }\n"+
				" else\n"+
				" {\n"+
				" var x0 = prefs.getString(\'x0\');\n"+
				" var y0 = prefs.getString(\'y0\');\n"+
				" var b = prefs.getString(\'border\');\n"+
				" var zoom = (prefs.getBool(\'zoom\') == true) ? \'1\' : \'0\';\n"+
				" var pan = (prefs.getBool(\'pan\') == true) ? \'1\' : \'0\';\n"+
				" var fit = (prefs.getBool(\'fit\') == true) ? \'1\' : \'0\';\n"+
				" var resize = (prefs.getBool(\'resize\') == true) ? \'1\' : \'0\';\n"+
				" var math = (prefs.getBool(\'math\') == true) ? \'1\' : \'0\';\n"+
				" var edit = prefs.getString(\'edit\');\n"+
				" var s = prefs.getString(\'stencils\');\n"+
				"\n"+
				" var div = document.createElement(\'div\');\n"+
				" div.className = \'mxgraph\';\n"+
				" div.style.position = \'relative\';\n"+
				" div.style.overflow = \'hidden\';\n"+
				" div.style.width = \'100%\';\n"+
				" div.style.height = \'100%\';\n"+
				" \n"+
				" var inner = document.createElement(\'div\');\n"+
				" inner.style.width = \'1px\';\n"+
				" inner.style.height = \'1px\';\n"+
				" inner.style.overflow = \'hidden\';\n"+
				" \n"+
				" var model = \'<mxGraphModel style=\"default-style2\" x0=\"\' + x0 +\n"+
				" \'\" y0=\"\' + y0 + \'\" pan=\"\' + pan + \'\" zoom=\"\' + zoom +\n"+
				" ((edit.length > 0) ? \'\" edit=\"\' + edit : \'\') +\n"+
				" \'\" resize=\"\' + resize + \'\" fit=\"\' + fit + \'\" border=\"\' + b +\n"+
				" \'\" math=\"\' + math + \'\" links=\"1\" url=\"\' + diagram + \'\"/>\';\n"+
				" \n"+
				" inner.innerHTML = encodeURIComponent(model);\n"+
				" \n"+
				" var src = \'https://www.draw.io/embed.js\';\n"+
				" \n"+
				" if (s.length > 0)\n"+
				" {\n"+
				" src += \'?s=\' + s;\n"+
				" }\n"+
				" \n"+
				" div.appendChild(inner);\n"+
				" document.body.appendChild(div);\n"+
				" \n"+
				" document.write(\'<script src=\"\' + src + \'\"></scr\' + \'ipt>\');\n"+
				" }\n"+
				" }\n"+
				"\t</script>\n"+
				"]]>\n"+
				"</Content>\n"+
				"</Module>\n"+
				"").getBytes());
		out.flush();
		out.close();
	}

}
