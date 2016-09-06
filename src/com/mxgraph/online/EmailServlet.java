/**
 * $Id: ErrorServlet.java,v 1.6 2014/02/21 12:01:30 gaudenz Exp $
 * Copyright (c) 2014, JGraph Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.PrintStream;
import java.util.Properties;
import java.util.logging.Logger;

import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class OpenServlet
 */
public class EmailServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static final Logger log = Logger.getLogger(HttpServlet.class
			.getName());

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public EmailServlet()
	{
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException
	{
		request.setCharacterEncoding("UTF-8");

		try
		{
			String data = request.getParameter("data");
			String body = request.getParameter("body");

			if (data != null || body != null)
			{
				if ((data != null && data.length() > 140) || body != null)
				{
					Properties props = new Properties();
					Session session = Session.getDefaultInstance(props, null);
					Message msg = new MimeMessage(session);

					String email = request.getParameter("email");
					String version = request.getParameter("version");
					String url = request.getParameter("url");

					if (email != null)
					{
						msg.setReplyTo(new InternetAddress[] { new InternetAddress(
								email) });
					}

					msg.setFrom(new InternetAddress("davidjgraph@gmail.com",
							"Draw.io"));
					msg.addRecipient(Message.RecipientType.TO,
							((body != null) ? new InternetAddress(
									"feedback@jgraph.com", "Draw.io feedback")
									: new InternetAddress("zlib@jgraph.com",
											"Draw.io error report")));
					msg.setSubject("Draw.io "
							+ ((body != null) ? "Feedback" : "Error Report"));

					BodyPart messageBodyPart = new MimeBodyPart();
					messageBodyPart.setText(((body != null) ? body : data)
							+ "\n\n----"
							+ ((url != null) ? "\nURL: " + url : "")
							+ ((email != null) ? "\nEmail: " + email : "")
							+ "\nRemote Address: " + request.getRemoteAddr()
							+ ((version != null) ? "\nVersion: " + version : ""));

					Multipart multipart = new MimeMultipart();
					multipart.addBodyPart(messageBodyPart);

					msg.setContent(multipart);
					Transport.send(msg);
				}
				else
				{
					log.severe("CRITICAL : " + data);
				}

				response.setStatus(HttpServletResponse.SC_OK);
			}
			else
			{
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			}
		}
		catch (Exception e)
		{
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			e.printStackTrace(new PrintStream(response.getOutputStream()));
		}
	}
}
