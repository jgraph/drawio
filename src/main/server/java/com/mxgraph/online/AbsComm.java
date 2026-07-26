/**
 * Copyright (c) 2006-2022, JGraph Holdings Ltd
 */
package com.mxgraph.online;

import java.io.IOException;

public interface AbsComm
{
    String getCookieValue(String name, Object request_p);
	
	void addCookie(String name, String val, int age, String cookiePath, Object response_p);
	
    void deleteCookie(String name, String cookiePath, Object response_p);

	String getParameter(String name, Object request);

	String getPostParameter(String name, Object request);

	String getQueryString(Object request);

	String getHeader(String name, Object request);

	String getServerName(Object request);

	String getRemoteAddr(Object request);

	void setBody(String body, Object response) throws IOException;
	
	void setStatus(int status, Object response);

	void setHeader(String name, String value, Object response);

	void sendRedirect(String url, Object response) throws IOException;
}
