/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
package com.mxgraph.online;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class GitlabAuthServlet extends GitlabAuth implements ServletComm
{
    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException
    {
        super.doGetAbst(request, response);
    }
}
