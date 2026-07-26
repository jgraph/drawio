/**
 * Copyright (c) 2006-2022, JGraph Holdings Ltd
 */
package com.mxgraph.online;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface ServletComm extends AbsComm 
{
    default String getCookieValue(String name, Object request_p)
	{
		HttpServletRequest request = (HttpServletRequest) request_p;
		String val = null;
		
		Cookie[] cookies = request.getCookies();
		
		if (cookies != null)
		{
			for (Cookie cookie : cookies)
			{
				if (name.equals(cookie.getName()))
				{
					val = cookie.getValue();
					break;
				}
			}
		}
		
		return val;
	}
	
	default void addCookie(String name, String val, int age, String cookiePath, Object response_p)
	{
		HttpServletResponse response = (HttpServletResponse) response_p;
		response.addHeader("Set-Cookie", name + "=" + val + "; Max-Age=" + age + ";path=" + cookiePath + (AbsAuth.USE_HTTP ? "" : "; Secure; SameSite=none") + "; HttpOnly");
	}
	
	default void deleteCookie(String name, String cookiePath, Object response_p)
	{
		HttpServletResponse response = (HttpServletResponse) response_p;
		response.addHeader("Set-Cookie", name + "= ;path=" + cookiePath + "; expires=Thu, 01 Jan 1970 00:00:00 UTC" + (AbsAuth.USE_HTTP ? "" : "; Secure; SameSite=none") + "; HttpOnly");
	}
	
	default String getParameter(String name, Object request)
	{
		return ((HttpServletRequest) request).getParameter(name);
	}

	default String getPostParameter(String name, Object request)
	{
		return ((HttpServletRequest) request).getParameter(name);
	}

	default String getHeader(String name, Object request)
	{
		return ((HttpServletRequest) request).getHeader(name);
	}

	default String getQueryString(Object request)
	{
		return ((HttpServletRequest) request).getQueryString();
	}

	default String getServerName(Object request)
	{
		return ((HttpServletRequest) request).getServerName();
	}

	default String getRemoteAddr(Object request)
	{
		return ((HttpServletRequest) request).getRemoteAddr();
	}

	default void setBody(String body, Object response) throws IOException
	{
		OutputStream out = ((HttpServletResponse) response).getOutputStream();
		out.write(body.getBytes());
		out.flush();
		out.close();
	}
	
	default void setStatus(int status, Object response)
	{
		((HttpServletResponse) response).setStatus(status);
	}

	default void setHeader(String name, String value, Object response)
	{
		((HttpServletResponse) response).setHeader(name, value);
	}

	default void sendRedirect(String url, Object response) throws IOException
	{
		((HttpServletResponse) response).sendRedirect(url);
	}
}
