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

import java.awt.Shape;

/**
 * This interface represents objects which creates Shape objects.
 *
 * @author <a href="mailto:stephane@hillion.org">Stephane Hillion</a>
 */
public interface ShapeProducer
{
	/**
	 * Returns the Shape object initialized during the last parsing.
	 * @return the shape or null if this handler has not been used to
	 *         parse a path.
	 */
	Shape getShape();

	/**
	 * Sets the winding rule used to construct the path.
	 */
	void setWindingRule(int i);

	/**
	 * Returns the current winding rule.
	 */
	int getWindingRule();
}
