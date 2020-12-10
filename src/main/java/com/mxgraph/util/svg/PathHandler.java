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
 * handler of a <code>PathParser</code> instance in order to be
 * notified of parsing events.
 *
 * @author <a href="mailto:stephane@hillion.org">Stephane Hillion</a>
 */
public interface PathHandler
{
	/**
	 * Invoked when the path starts.
	 * @exception ParseException if an error occured while processing the path
	 */
	void startPath() throws ParseException;

	/**
	 * Invoked when the path ends.
	 * @exception ParseException if an error occured while processing the path
	 */
	void endPath() throws ParseException;

	/**
	 * Invoked when a relative moveto command has been parsed.
	 * <p>Command : <b>m</b>
	 * @param x the relative x coordinate for the end point
	 * @param y the relative y coordinate for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void movetoRel(float x, float y) throws ParseException;

	/**
	 * Invoked when an absolute moveto command has been parsed.
	 * <p>Command : <b>M</b>
	 * @param x the absolute x coordinate for the end point
	 * @param y the absolute y coordinate for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void movetoAbs(float x, float y) throws ParseException;

	/**
	 * Invoked when a closepath has been parsed.
	 * <p>Command : <b>z</b> | <b>Z</b>
	 * @exception ParseException if an error occured while processing the path
	 */
	void closePath() throws ParseException;

	/**
	 * Invoked when a relative line command has been parsed.
	 * <p>Command : <b>l</b>
	 * @param x the relative x coordinates for the end point
	 * @param y the relative y coordinates for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void linetoRel(float x, float y) throws ParseException;

	/**
	 * Invoked when an absolute line command has been parsed.
	 * <p>Command : <b>L</b>
	 * @param x the absolute x coordinate for the end point
	 * @param y the absolute y coordinate for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void linetoAbs(float x, float y) throws ParseException;

	/**
	 * Invoked when an horizontal relative line command has been parsed.
	 * <p>Command : <b>h</b>
	 * @param x the relative X coordinate of the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void linetoHorizontalRel(float x) throws ParseException;

	/**
	 * Invoked when an horizontal absolute line command has been parsed.
	 * <p>Command : <b>H</b>
	 * @param x the absolute X coordinate of the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void linetoHorizontalAbs(float x) throws ParseException;

	/**
	 * Invoked when a vertical relative line command has been parsed.
	 * <p>Command : <b>v</b>
	 * @param y the relative Y coordinate of the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void linetoVerticalRel(float y) throws ParseException;

	/**
	 * Invoked when a vertical absolute line command has been parsed.
	 * <p>Command : <b>V</b>
	 * @param y the absolute Y coordinate of the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void linetoVerticalAbs(float y) throws ParseException;

	/**
	 * Invoked when a relative cubic bezier curve command has been parsed.
	 * <p>Command : <b>c</b>
	 * @param x1 the relative x coordinate for the first control point
	 * @param y1 the relative y coordinate for the first control point
	 * @param x2 the relative x coordinate for the second control point
	 * @param y2 the relative y coordinate for the second control point
	 * @param x the relative x coordinate for the end point
	 * @param y the relative y coordinate for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void curvetoCubicRel(float x1, float y1, float x2, float y2, float x,
			float y) throws ParseException;

	/**
	 * Invoked when an absolute cubic bezier curve command has been parsed.
	 * <p>Command : <b>C</b>
	 * @param x1 the absolute x coordinate for the first control point
	 * @param y1 the absolute y coordinate for the first control point
	 * @param x2 the absolute x coordinate for the second control point
	 * @param y2 the absolute y coordinate for the second control point
	 * @param x the absolute x coordinate for the end point
	 * @param y the absolute y coordinate for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void curvetoCubicAbs(float x1, float y1, float x2, float y2, float x,
			float y) throws ParseException;

	/**
	 * Invoked when a relative smooth cubic bezier curve command has
	 * been parsed. The first control point is assumed to be the
	 * reflection of the second control point on the previous command
	 * relative to the current point.
	 * <p>Command : <b>s</b>
	 * @param x2 the relative x coordinate for the second control point
	 * @param y2 the relative y coordinate for the second control point
	 * @param x the relative x coordinate for the end point
	 * @param y the relative y coordinate for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void curvetoCubicSmoothRel(float x2, float y2, float x, float y)
			throws ParseException;

	/**
	 * Invoked when an absolute smooth cubic bezier curve command has
	 * been parsed. The first control point is assumed to be the
	 * reflection of the second control point on the previous command
	 * relative to the current point.
	 * <p>Command : <b>S</b>
	 * @param x2 the absolute x coordinate for the second control point
	 * @param y2 the absolute y coordinate for the second control point
	 * @param x the absolute x coordinate for the end point
	 * @param y the absolute y coordinate for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void curvetoCubicSmoothAbs(float x2, float y2, float x, float y)
			throws ParseException;

	/**
	 * Invoked when a relative quadratic bezier curve command has been parsed.
	 * <p>Command : <b>q</b>
	 * @param x1 the relative x coordinate for the control point
	 * @param y1 the relative y coordinate for the control point
	 * @param x the relative x coordinate for the end point
	 * @param y the relative x coordinate for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void curvetoQuadraticRel(float x1, float y1, float x, float y)
			throws ParseException;

	/**
	 * Invoked when an absolute quadratic bezier curve command has been parsed.
	 * <p>Command : <b>Q</b>
	 * @param x1 the absolute x coordinate for the control point
	 * @param y1 the absolute y coordinate for the control point
	 * @param x the absolute x coordinate for the end point
	 * @param y the absolute x coordinate for the end point
	 * @exception ParseException if an error occured while processing the path
	 */
	void curvetoQuadraticAbs(float x1, float y1, float x, float y)
			throws ParseException;

	/**
	 * Invoked when a relative smooth quadratic bezier curve command
	 * has been parsed. The control point is assumed to be the
	 * reflection of the control point on the previous command
	 * relative to the current point.
	 * <p>Command : <b>t</b>
	 * @param x the relative x coordinate for the end point 
	 * @param y the relative y coordinate for the end point 
	 * @exception ParseException if an error occured while processing the path
	 */
	void curvetoQuadraticSmoothRel(float x, float y) throws ParseException;

	/**
	 * Invoked when an absolute smooth quadratic bezier curve command
	 * has been parsed. The control point is assumed to be the
	 * reflection of the control point on the previous command
	 * relative to the current point.
	 * <p>Command : <b>T</b>
	 * @param x the absolute x coordinate for the end point 
	 * @param y the absolute y coordinate for the end point 
	 * @exception ParseException if an error occured while processing the path
	 */
	void curvetoQuadraticSmoothAbs(float x, float y) throws ParseException;

	/**
	 * Invoked when a relative elliptical arc command has been parsed. 
	 * <p>Command : <b>a</b>
	 * @param rx the X axis radius for the ellipse
	 * @param ry the Y axis radius for the ellipse 
	 * @param xAxisRotation the rotation angle in degrees for the ellipse's
	 *                      X-axis relative to the X-axis
	 * @param largeArcFlag the value of the large-arc-flag 
	 * @param sweepFlag the value of the sweep-flag 
	 * @param x the relative x coordinate for the end point 
	 * @param y the relative y coordinate for the end point 
	 * @exception ParseException if an error occured while processing the path
	 */
	void arcRel(float rx, float ry, float xAxisRotation, boolean largeArcFlag,
			boolean sweepFlag, float x, float y) throws ParseException;

	/**
	 * Invoked when an absolute elliptical arc command has been parsed.
	 * <p>Command : <b>A</b>
	 * @param rx the X axis radius for the ellipse
	 * @param ry the Y axis radius for the ellipse 
	 * @param xAxisRotation the rotation angle in degrees for the ellipse's
	 *                      X-axis relative to the X-axis
	 * @param largeArcFlag the value of the large-arc-flag 
	 * @param sweepFlag the value of the sweep-flag 
	 * @param x the absolute x coordinate for the end point 
	 * @param y the absolute y coordinate for the end point 
	 * @exception ParseException if an error occured while processing the path
	 */
	void arcAbs(float rx, float ry, float xAxisRotation, boolean largeArcFlag,
			boolean sweepFlag, float x, float y) throws ParseException;
}
