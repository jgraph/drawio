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

//TODO integrate this code in mxGuide
mxGuide.prototype.move_orig = mxGuide.prototype.move;
mxGuide.prototype.move = function (bounds, delta, gridEnabled)
{
    var point = mxGuide.prototype.move_orig.call(this, bounds, delta, gridEnabled);
    var yShift = point.y;
    var xShift = point.x;

    if (this.states != null && bounds != null && delta != null) 
    {
      var guide = this;
	  var newState = new mxCellState();
	  var scale = this.graph.getView().scale;
	  var tolerance = 5;
	
	  newState.x = bounds.x + xShift;
	  newState.y = bounds.y + yShift;
	  newState.width = bounds.width;
	  newState.height = bounds.height;
	  var verticalCells = [];
	  var horizontalCells = [];
      var selCells = this.graph.getSelectionCells();
      
      //although states are defined as cellState, it has some mxRectangles!
      var states = [];
      
      for (var i = 0; i < this.states.length; i++)
	  {
    	  var state = this.states[i];
    	  var found = false;
    	  
    	  if (state instanceof mxCellState)
		  {
    		  for (var j = 0; j < selCells.length; j++)
    		  {
        		  if (selCells[j] == state.cell)
    			  {
        			  found = true;
        			  break;
    			  }
    		  }		  
		  
	    	  if (!found)
			  {
	    		  if ((newState.x >= state.x && newState.x <= (state.x + state.width))
	    	              || (state.x >= newState.x && state.x <= (newState.x + newState.width))) 
	    		  {
		            verticalCells.push(state);
		          }
	    		  else if ((newState.y >= state.y && newState.y <= (state.y + state.height))
			            || (state.y >= newState.y && state.y <= (newState.y + newState.height))) 
	    		  {
		            horizontalCells.push(state);
		          }
			  }
		  }
	  }
      
      var eqCy = 0;
      var eqCx = 0;
      var dy = 0.0;
      var fixedDy = 0.0;
      var dx = 0.0;
      var fixedDx = 0.0;
      var shift = 5 * scale;
      
      if (verticalCells.length > 1) 
      {
        verticalCells.push(newState);
        
        verticalCells.sort(function(s1, s2)
		{
          return s1.y - s2.y;
        });
        
        for (var i = 0; i < verticalCells.length - 1; i++)
  	  	{
            var s1 = verticalCells[i];
            var s2 = verticalCells[i + 1];
            var isMovingOne = newState == s1 || newState == s2;
            
            var curDy = s2.y - s1.y - s1.height;
            
            if (!isMovingOne)
        	{
            	fixedDy = curDy;
        	}
            
            if (eqCy == 0) 
            {
              dy = curDy;
              eqCy = 1;
            }
            else if (Math.abs(dy - curDy) <= (isMovingOne? tolerance : 0)) 
            {
              eqCy += 1;
            }
        }
      }
      
      if (horizontalCells.length > 1) 
      {
        horizontalCells.push(newState)
        
        horizontalCells.sort(function(s1, s2)
		{
          return s1.x - s2.x;
        });

        for (var i = 0; i < horizontalCells.length - 1; i++)
  	  	{
            var s1 = horizontalCells[i];
            var s2 = horizontalCells[i + 1];
            var isMovingOne = newState == s1 || newState == s2;
            
            var curDx = s2.x - s1.x - s1.width;
            
            if (!isMovingOne)
        	{
            	fixedDx = curDx;
        	}
            
            if (eqCx == 0) 
            {
              dx = curDx;
              eqCx = 1;
            }
            else if (Math.abs(dx - curDx) <= (isMovingOne? tolerance : 0)) 
            {
              eqCx += 1;
            }
        }
      }
      
      var createEqGuide = function(p1, p2, curGuide, isVer)
      {
        var points = [];
        var dx = 0.0;
        var dy = 0.0;
        
        if (isVer) 
        {
          dx = shift;
          dy = 0;
        }
        else 
        {
          dx = 0;
          dy = shift;
        }
        
        points.push(new mxPoint(p1.x - dx, p1.y - dy));
        points.push(new mxPoint(p1.x + dx, p1.y + dy));
        points.push(p1);
        points.push(p2);
        points.push(new mxPoint(p2.x - dx, p2.y - dy));
        points.push(new mxPoint(p2.x + dx, p2.y + dy));

        if (curGuide != null) 
        {
          curGuide.points = points;
          return curGuide;
        }
        else
        {
          var guideEq = new mxPolyline(points, mxConstants.GUIDE_COLOR, mxConstants.GUIDE_STROKEWIDTH);
          guideEq.dialect = mxConstants.DIALECT_SVG;
          guideEq.pointerEvents = false;
          guideEq.init(guide.graph.getView().getOverlayPane());
          return guideEq;
        }
      };

      if (eqCx > 1 && eqCx == horizontalCells.length - 1) 
      {
        var guidesArr = [];
        var curArr = guide.guidesArrHor;
        var hPoints = [];
        var newX = 0;
        
        //If the newState (moving cell) is the first one, use the next one for x coordinate such that the guide doesn't move with the cell
        var firstI = horizontalCells[0] == newState? 1 : 0;
        var firstY = horizontalCells[firstI].y + horizontalCells[firstI].height;

        if (fixedDx > 0)
		{
            for (var i = 0; i < horizontalCells.length - 1; i++)
      	  	{
                var s1 = horizontalCells[i];
                var s2 = horizontalCells[i + 1];
                
        		if (newState == s1)
    			{
        			newX = s2.x - s1.width - fixedDx;
        			hPoints.push(new mxPoint(newX + s1.width + shift, firstY));
                    hPoints.push(new mxPoint(s2.x - shift, firstY));
    			}
        		else if (newState == s2)
    			{
        			hPoints.push(new mxPoint(s1.x + s1.width + shift, firstY));
        			newX = s1.x + s1.width + fixedDx;
        			hPoints.push(new mxPoint(newX - shift, firstY));
    			}
        		else
    			{
        			hPoints.push(new mxPoint(s1.x + s1.width + shift, firstY));
                    hPoints.push(new mxPoint(s2.x - shift, firstY));
    			}
            }
		}
        else //this is the case when there are 3 cells and the middle one is moving
    	{
        	var s1 = horizontalCells[0];
            var s3 = horizontalCells[2];
			newX = s1.x + s1.width + (s3.x - s1.x - s1.width - newState.width) / 2;
			hPoints.push(new mxPoint(s1.x + s1.width + shift, firstY));
            hPoints.push(new mxPoint(newX - shift, firstY));
			hPoints.push(new mxPoint(newX + newState.width + shift, firstY));
            hPoints.push(new mxPoint(s3.x - shift, firstY));
    	}
        
        for (var i = 0; i < hPoints.length; i += 2) 
        {
          var p1 = hPoints[i];
          var p2 = hPoints[i+1];
          var guideEq = createEqGuide(p1, p2, curArr != null ? curArr[i/2] : null);
          guideEq.node.style.visibility = "visible";
          guideEq.redraw();
          guidesArr.push(guideEq);
        }
        guide.guidesArrHor = guidesArr;
        
        xShift = newX - bounds.x;
      }
      else if (guide.guidesArrHor != null) 
      {
    	  for (var i = 0; i < guide.guidesArrHor.length; i++) 
          {
    		  guide.guidesArrHor[i].node.style.visibility = "hidden";
          }
      }
      
      if (eqCy > 1 && eqCy == verticalCells.length - 1) 
      {
        var guidesArr = [];
        var curArr = guide.guidesArrVer;
        var vPoints = [];
        var newY = 0;
        
        //If the newState (moving cell) is the first one, use the next one for x coordinate such that the guide doesn't move with the cell
        var firstI = verticalCells[0] == newState? 1 : 0;
        var firstX = verticalCells[firstI].x + verticalCells[firstI].width;

        if (fixedDy > 0)
		{
	        for (var i = 0; i < verticalCells.length - 1; i++)
	  	  	{
	        	var s1 = verticalCells[i];
	            var s2 = verticalCells[i + 1];
	            
        		if (newState == s1)
    			{
        			newY = s2.y - s1.height - fixedDy;
        			vPoints.push(new mxPoint(firstX, newY + s1.height + shift));
					vPoints.push(new mxPoint(firstX, s2.y - shift));
    			}
        		else if (newState == s2)
    			{
					vPoints.push(new mxPoint(firstX, s1.y + s1.height + shift));
        			newY = s1.y + s1.height + fixedDy;
        			vPoints.push(new mxPoint(firstX, newY - shift));
    			}
        		else
    			{
					vPoints.push(new mxPoint(firstX, s1.y + s1.height + shift));
					vPoints.push(new mxPoint(firstX, s2.y - shift));
    			}
    		}
		}
    	else //this is the case when there are 3 cells and the middle one is moving
		{
        	var s1 = verticalCells[0];
            var s3 = verticalCells[2];
			newY = s1.y + s1.height + (s3.y - s1.y - s1.height - newState.height) / 2;
			vPoints.push(new mxPoint(firstX, s1.y + s1.height + shift));
			vPoints.push(new mxPoint(firstX, newY - shift));
			vPoints.push(new mxPoint(firstX, newY + newState.height + shift));
			vPoints.push(new mxPoint(firstX, s3.y - shift));
		}

        for (i = 0; i < vPoints.length; i += 2)
        {
          var p1 = vPoints[i];
          var p2 = vPoints[i+1];
          var guideEq = createEqGuide(p1, p2, curArr != null ? curArr[i/2] : null, true);
          guideEq.node.style.visibility = "visible";
          guideEq.redraw();
          guidesArr.push(guideEq);
        }
        
        guide.guidesArrVer = guidesArr;
        
        yShift = newY - bounds.y;
      } 
      else if (guide.guidesArrVer != null)
      {
    	  for (var i = 0; i < guide.guidesArrVer.length; i++) 
          {
    		  guide.guidesArrVer[i].node.style.visibility = "hidden";
          }
      }
    }
    return new mxPoint(xShift, yShift);
};

mxGuide.prototype.setVisible_orig = mxGuide.prototype.setVisible;
mxGuide.prototype.setVisible = function (visible)
{
	var guide = this;
	mxGuide.prototype.setVisible_orig.call(guide, visible);
    
    var guidesArrVer = guide.guidesArrVer;
    var guidesArrHor = guide.guidesArrHor;
    
    if (guidesArrVer != null) 
    {
      for (var i = 0; i < guidesArrVer.length; i++)
	  {
    	  guidesArrVer[i].node.style.visibility = visible? "visible" : "hidden";
	  }
    }
    
    if (guidesArrHor != null) 
    {
      for (var i = 0; i < guidesArrHor.length; i++)
  	  {
    	  guidesArrHor[i].node.style.visibility = visible? "visible" : "hidden";
  	  }
    }
};

mxGuide.prototype.destroy_orig = mxGuide.prototype.destroy;
mxGuide.prototype.destroy = function()
{
	mxGuide.prototype.destroy_orig.call(this);
    var guidesArrVer = this.guidesArrVer;
    var guidesArrHor = this.guidesArrHor;
    
    if (guidesArrVer != null)
    {
    	for (var i = 0; i < guidesArrVer.length; i++)
    	{
    		guidesArrVer[i].destroy();
    	}
    	this.guidesArrVer = null;
    }
    
    if (guidesArrHor != null)
    {
    	for (var i = 0; i < guidesArrHor.length; i++)
    	{
    		guidesArrHor[i].destroy();
    	}
    	this.guidesArrHor = null;
    }
};
