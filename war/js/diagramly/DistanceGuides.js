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

    var guide = this;
    var newState = new mxCellState();
    var tt = this.getGuideTolerance();
    var scale = this.graph.getView().scale;
    var isShift = this.isShiftDown;

    newState.x = bounds.x + this.graph.snap(delta.x / scale) * scale;
    newState.y = bounds.y + this.graph.snap(delta.y / scale) * scale;
    newState.width = bounds.width;
    newState.height = bounds.height;

    var verticalCells = [];
    var horizontalCells = [];
    var yShift = point.y;
    var xShift = point.x;
    
    if (this.states != null && bounds != null && delta != null) 
    {
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
		            horizontalCells.push(state)
		          }
			  }
		  }
	  }
      
      var eqCy = 0;
      var eqCx = 0;
      var dy = 0.0;
      var dx = 0.0;
      var shift = 5 * scale;
      var vPoints = [];
      
      if (verticalCells.length > 1) 
      {
        if (!isShift) 
        {
          verticalCells.push(newState)
        }
        
        verticalCells.sort(function(s1, s2)
		{
          return s1.y - s2.y;
        });
        
        var firstX = 0;
        
        for (var i = 0; i < verticalCells.length - 1; i++)
  	  	{
            var s1 = verticalCells[i];
            var s2 = verticalCells[i + 1];
            
            if (firstX == 0) firstX = s1.x + s1.width;
            
            vPoints.push(new mxPoint(firstX, s1.y + s1.height + shift));
            vPoints.push(new mxPoint(firstX, s2.y - shift));
            
            if (dy == 0.0) 
            {
              dy = s1.y + s1.height - s2.y;
              eqCy = 1;
            }
            else if (Math.abs(dy - (s1.y + s1.height - s2.y)) < tt) 
            {
              eqCy += 1;
            }
        }
      }
      
      var hPoints = [];
      
      if (horizontalCells.length > 1) 
      {
        if (!isShift) 
        {
          horizontalCells.push(newState)
        }
        
        horizontalCells.sort(function(s1, s2)
		{
          return s1.x - s2.x;
        });

        var firstY = 0;
        
        for (var i = 0; i < horizontalCells.length - 1; i++)
  	  	{
            var s1 = horizontalCells[i];
            var s2 = horizontalCells[i + 1];
            
            if (firstY == 0) firstY = s1.y + s1.height;

            hPoints.push(new mxPoint(s1.x + s1.width + shift, firstY));
            hPoints.push(new mxPoint(s2.x - shift, firstY));
            
            if (dx == 0.0) 
            {
              dx = s1.x + s1.width - s2.x;
              eqCx = 1;
            }
            else if (Math.abs(dx - (s1.x + s1.width - s2.x)) < tt) 
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

      var adjustXShift = function () 
      {
        var startState = horizontalCells.shift();
        var startDx = newState.x - startState.x;
        var endState = horizontalCells.pop();
        var endDx = newState.x - endState.x;
        
        if (Math.sign(startDx) == Math.sign(endDx)) 
        {
          if (Math.sign(startDx) < 0) 
          {
            var newX = startState.x - Math.abs(dx) - bounds.width;
            xShift = newX - bounds.x;
          }
          else 
          {
            var newX = endState.x + endState.width + Math.abs(dx);
            xShift = newX - bounds.x;
          }
        }
      }
      
      var adjustYShift = function()
      {
        var startState = verticalCells.shift();
        var startDy = newState.y - startState.y;
        var endState = verticalCells.pop();
        var endDy = newState.y - endState.y;
        
        if (Math.sign(startDy) == Math.sign(endDy)) 
        {
          if (startDy.signum < 0) 
          {
            var newY = startState.y - Math.abs(dy) - bounds.height;
            yShift = newY - bounds.y;
          }
          else 
          {
            var newY = endState.y + endState.height + Math.abs(dy);
            yShift = newY - bounds.y;
          }
        }
      };
      
      if (eqCx > 1 && eqCx == horizontalCells.length - 1) 
      {
        var guidesArr = [];
        var curArr = guide.guidesArrHor;
        
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
        
        if (isShift) 
        {
          adjustXShift();
        }
      }
      else if (isShift && horizontalCells.length == 2) 
      {
        adjustXShift();
      }
      else if (isShift && horizontalCells.length > 0) 
      { //center align
        var minX = Number.MAX_VALUE;
        var closestCell = horizontalCells[0];
        
        for (var i = 0; i < horizontalCells.length; i++) 
        {
        	var cell = horizontalCells[i];
            var dx = Math.abs(cell.x - newState.x);
            
            if (dx < minX) 
            {
              minX = dx;
              closestCell = cell;
            }
        }
        
        var cy = closestCell.getCenterY();
        var newY = cy - bounds.height/2;
        yShift = newY - bounds.y;
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
        
        if (isShift) 
        {
          adjustYShift();
        }
      } 
      else if (isShift && verticalCells.length == 2) 
      {
        adjustYShift();
      }
      else if (isShift && verticalCells.length > 0) 
      { //center align
        var minY = Number.MAX_VALUE;
        var closestCell = verticalCells[0];
        
        for (var i = 0; i < verticalCells.length; i++) 
        {
        	var cell = verticalCells[i];
            var dy = Math.abs(cell.y - newState.y);
            
            if (dy < minY) 
            {
                minY = dy;
                closestCell = cell;
            }
        }
        
        var cx = closestCell.getCenterX();
        var newX = cx - bounds.width/2;
        xShift = newX - bounds.x;
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

mxGuide.prototype.isEnabledForEvent_orig =  mxGuide.prototype.isEnabledForEvent;
mxGuide.prototype.isEnabledForEvent = function (evt)
{
    this.isShiftDown = mxEvent.isShiftDown(evt);
    return mxGuide.prototype.isEnabledForEvent_orig.call(this, evt);
};