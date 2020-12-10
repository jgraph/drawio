/*

   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 */
package com.mxgraph.util.svg;

/**
 * This interface must be implemented and then registred as the
 * handler of a <code>PointsParser</code> instance in order to be
 * notified of parsing events.
 *
 * @author <a href="mailto:stephane@hillion.org">Stephane Hillion</a>
 */
public interface PointsHandler
{

	/**
	 * Invoked when the points attribute starts.
	 * @exception ParseException if an error occured while processing the
	 *                           points
	 */
	void startPoints() throws ParseException;

	/**
	 * Invoked when a point has been parsed.
	 * @param x the x coordinate of the point
	 * @param y the y coordinate of the point
	 * @exception ParseException if an error occured while processing the
	 *                           points
	 */
	void point(float x, float y) throws ParseException;

	/**
	 * Invoked when the points attribute ends.
	 * @exception ParseException if an error occured while processing the
	 *                           points
	 */
	void endPoints() throws ParseException;
}
