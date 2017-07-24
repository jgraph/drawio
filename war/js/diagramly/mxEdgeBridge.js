/**
 * Copyright (c) 2017, CTI LOGIC
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 * 
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY 
 * AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

//TODO integrate this code in mxConnector
mxConnector.prototype.checkLineIntersection = function (line1StartX, line1StartY, line1EndX, line1EndY,
                              line2StartX, line2StartY, line2EndX, line2EndY)
{
  // if the lines intersect, the result contains the the
  // intersection point if both line segment 1 and line segment 2 contain the point
  // null otherwise
  var denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
  
  if (denominator == 0) 
  {
    return null;
  }
  else
  {
    var a = line1StartY - line2StartY;
    var b = line1StartX - line2StartX;
    var numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    var numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    var x = line1StartX + (a * (line1EndX - line1StartX));
    var y = line1StartY + (a * (line1EndY - line1StartY));

    if (a > 0 && a < 1 &&  b > 0 && b < 1) // on both lines?
      return new mxPoint(x, y);
    else
      return null;
  }
}

//TODO Add curves support for curve edges
//TODO Make the Bridge a curve (e.g. half a circle)
mxConnector.prototype.mxConnectorPaintLine_orig = mxConnector.prototype.paintLine;
mxConnector.prototype.paintLine = function(canvas, pts, rounded)
{
    var ptsCln = pts;
    //TODO most probably this is not needed!
    if (this.state == null || !this.state.cell.isEdge()) 
    {
	   return null;
    }

    var state = this.state;
    var graph = state.view.graph;
	//TODO the shift should be a configuration
    var shift = 10; //graph.edgeBridgeSize;
    
    //TODO add mxGraph bridges switch 
    if (/*graph.enableEdgeBridge &&*/ !graph.isMouseDown)
    {
      //during DnD we can save the extra calculations
      var model = graph.getModel();
      var noRedraw = state.redrawEdge;
      ptsCln = [];
      
      if (state.oldIntersectIds) 
      {
        var ids = state.oldIntersectIds;
        
        for (var i = 0; i < ids.length; i++)
        {
            var c = model.getCell(ids[i]);
            
            if (c != null) 
            {
              var eState = graph.view.getState(c);
              
              if (eState != null && eState.style != null) 
              {
                eState.redrawEdge = true;
                eState.shape.redraw();
              }
            }
        }
        delete state.oldIntersectIds;
      }
      //for each pair find the intersection
      for (var i = 0; i < pts.length - 1; i++)
	  {
          var l2p1 = pts[i];
          var l2p2 = pts[i+1];
          ptsCln.push(l2p1);
          var intersectPt = [];
          
          for (var id in model.cells)
          {
        	  var edge = model.cells[id];
        	  
        	  if (edge.isEdge() && edge != state.cell)
        	  {
        		  var eState = graph.view.getState(edge);
        		  
        		  if (eState != null && eState.absolutePoints != null) 
        		  {
                    var eScale = eState.view.scale;
                    
                    for (var j = 0; j < eState.absolutePoints.length - 1; j++)
              	  	{
                        var l1p1 = eState.absolutePoints[j];
                        var l1p2 = eState.absolutePoints[j+1];
                        //the absolute points of current edge is scaled before calling this function, so we have to scale others to get correct intersections
                        var result = this.checkLineIntersection(l1p1.x / eScale, l1p1.y / eScale, l1p2.x / eScale, l1p2.y / eScale
                          , l2p1.x, l2p1.y, l2p2.x, l2p2.y);
                        
                        if (result != null) 
                        {
                          var getEdgeOrder = function (edge1, edge2)
                      	  {
                            var p1 = edge1.getParent();
                            var p2 = edge2.getParent();
                            
                            if (p1 == p2) 
                            {
                              return p1.getIndex(edge1) - p1.getIndex(edge2); //+ve edge1 on top, -ve edge2 on top
                            } 
                            else 
                            {
                              return 0; //not the same parent, so we cannot determine
                            }
                          };
                          
                          if (getEdgeOrder(state.cell, eState.cell) > 0) 
                          {
                            //instead of reordering, get the order and the top edge has the bridge
                            var dx = result.x - l2p2.x;
                            var dy = result.y - l2p2.y;
                            var dist = Math.sqrt(dx * dx + dy * dy);
                            dx /= dist;
                            dy /= dist;
                            
                            var getOnLinePointAtDist = function(x1, x2, y1, y2)
                            {
                              var dx = x1 - x2;
                              var dy = y1 - y2;
                              var d = Math.sqrt(dy * dy + dx * dx);
                              var t = shift / d;
                              return new mxPoint((1 - t) * x1 + t * x2, (1 - t) * y1 + t * y2);
                            }
                            
                            intersectPt.push(getOnLinePointAtDist(result.x, l2p1.x, result.y, l2p1.y));
                            intersectPt.push(new mxPoint(result.x + shift * dy, result.y - shift * dx));
                            intersectPt.push(getOnLinePointAtDist(result.x, l2p2.x, result.y, l2p2.y));

                            //add others id here since here is the actual bridge!
                            var otherId = state.cell.id;
                            
                            if (eState.oldIntersectIds != null) 
                            {
                              eState.oldIntersectIds.push(otherId);
                            }
                            
                            eState.oldIntersectIds= [otherId];
                          }
                          else if (!noRedraw) 
                          {
                            eState.redrawEdge = true;
                            eState.shape.redraw();
                          }
                        }
                    }
                  }
        	  }
              
          }
          //sort points and then add them
          intersectPt.sort(function(p1, p2) {
              var dx1 = p1.x - l2p1.x;
              var dy1 = p1.y - l2p1.y;
              var d1 = dx1 * dx1 + dy1 * dy1;

              var dx2 = p2.x - l2p1.x;
              var dy2 = p2.y - l2p1.y;
              var d2 = dx2 * dx2 + dy2 * dy2;

              return d1 - d2;
          });
          ptsCln.push.apply(ptsCln, intersectPt);
          ptsCln.push(l2p2);
      }
      
      if (noRedraw) 
      {
    	  state.redrawEdge = false;
      }

    }
  
    this.mxConnectorPaintLine_orig.call(this, canvas, ptsCln, rounded);
};
