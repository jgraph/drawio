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

function mxRuler(editorUi, unit, isVertical, isSecondery) 
{
	var RULER_THIKNESS = 30;
    var ruler = this;
    this.unit = unit;
    var style = window.uiTheme == 'dark'? {
    	bkgClr: '#2a2a2a',
    	strokeClr: '#BBBBBB',
    	fontClr: '#BBBBBB',
    	guideClr: '#0088cf'
    } : {
    	bkgClr: 'whiteSmoke',
    	strokeClr: '#BBBBBB',
    	fontClr: '#BBBBBB',
    	guideClr: '#0000BB'
    };
    //create the container
    var container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.background = style.bkgClr;
	document.body.appendChild(container);
	mxEvent.disableContextMenu(container);
    	
	function resizeRulerContainer()
	{
	    container.style.top = editorUi.origContTop + 'px';
	    container.style.left = editorUi.origContLeft + 'px';
	    container.style.width = (isVertical? RULER_THIKNESS : editorUi.origContWidth) + 'px';
	    container.style.height = (isVertical? editorUi.origContHeight : RULER_THIKNESS) + 'px';
	};
    
	this.editorUiRefresh = editorUi.refresh;
	
	editorUi.refresh = function(minor)
	{
		//If it is called with true, then only our added code is executed
		if (minor != true) 
		{
			ruler.editorUiRefresh.apply(editorUi, arguments);
		}
		
		var cont = editorUi.diagramContainer;
		
		if (!isSecondery)
		{
			editorUi.origContTop = cont.offsetTop;
			editorUi.origContLeft = cont.offsetLeft;
			editorUi.origContWidth = cont.offsetWidth;
			editorUi.origContHeight = cont.offsetHeight;
		}
		
		resizeRulerContainer();
		
		if (isVertical)
		{
			cont.style.left = (cont.offsetLeft + RULER_THIKNESS) + 'px';
		}
		else
		{
			cont.style.top = (cont.offsetTop + RULER_THIKNESS) + 'px';
		}
	};

	editorUi.refresh(true);
	resizeRulerContainer();
    	
    var canvas = document.createElement("canvas");
    //initial sizing which is corrected by the graph size event
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.style.overflow = 'hidden';
    canvas.style.position = "relative";
    container.appendChild(canvas);
    //Disable alpha to improve performance as we don't need it?
    var ctx = canvas.getContext('2d');
    this.ui = editorUi;
    var graph = editorUi.editor.graph;
    this.graph = graph;
    this.container = container;
    this.canvas = canvas;

    var drawLine = function (x1, y1, x2, y2, text) 
    {
        //remove all fractions
        x1 = Math.round(x1); y1 = Math.round(y1); x2 = Math.round(x2); y2 = Math.round(y2);
        //adding the 0.5 is necessary to prevent anti-aliasing from making lines thicker!
        ctx.beginPath();
        ctx.moveTo(x1 + 0.5, y1 + 0.5);
        ctx.lineTo(x2 + 0.5, y2 + 0.5);
        ctx.stroke();
        
        if (text) 
        {
            if (isVertical) 
            {
                var x = x1;
                var y = y1 - 3;
                var metric = ctx.measureText(text);

                ctx.save();

                // We want to find the center of the text (or whatever point you want) and rotate about it
                var tx = x + (metric.width / 2) + 8;
                var ty = y + 5;

                // Translate to near the center to rotate about the center
                ctx.translate(tx, ty);
                // Then rotate...
                ctx.rotate(-Math.PI / 2);
                // Then translate back to draw in the right place!
                ctx.translate(-tx, -ty);
                ctx.fillText(text, x, y);
                ctx.restore();
            }
            else
            {
                ctx.fillText(text, isVertical? x1 : x1 + 3, isVertical? y1 - 3 : y1 + 9);
            }
        }
    };
    
    var drawRuler = function() 
    {
    	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	
        ctx.beginPath();
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = style.strokeClr;
        ctx.setLineDash([]);
        ctx.font = "9px Arial";
        ctx.fillStyle = style.fontClr;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(RULER_THIKNESS, RULER_THIKNESS);
        ctx.stroke();
        
        var scale = graph.view.scale;
        var bgPages = graph.view.getBackgroundPageBounds();
        var t = graph.view.translate;
        var bounds = graph.view.getGraphBounds();
        
        var rStart = (isVertical? bgPages.y -  graph.container.scrollTop : bgPages.x - graph.container.scrollLeft);

        //handle negative pages
        if (isVertical) 
        {
            var y = ((bounds.y) / scale - t.y);
            
            if (y <= -1) 
            {
                rStart += Math.ceil(Math.abs(y) / graph.pageFormat.height) * graph.pageFormat.height * scale;
            }
        }
        else
        {
            var x = ((bounds.x) / scale - t.x);
            
            if (x <= -1)
            {
                rStart += Math.ceil(Math.abs(x) / graph.pageFormat.width) * graph.pageFormat.width * scale;
            }
        }
        
        rStart += isVertical? (graph.container.offsetTop - ruler.container.offsetTop) : (graph.container.offsetLeft - ruler.container.offsetLeft);

        var tickStep, tickSize, len;

        switch(ruler.unit) 
        {
            case mxConstants.POINTS:
                len = 10;
                tickStep = 10;
                tickSize = [25,5,5,5,5,10,5,5,5,5];
                break;
            case mxConstants.MILLIMETERS:
                len = 10;
                tickStep = mxConstants.PIXELS_PER_MM;
                tickSize = [25,5,5,5,5,10,5,5,5,5];
                break;
            case mxConstants.INCHES:
            	if (scale <=0.5 || scale >=4)
                    len = 8;
                else
                    len = 16;
                
                tickStep = mxConstants.PIXELS_PER_INCH / len;
                tickSize = [25,5,8,5,12,5,8,5,15,5,8,5,12,5,8,5];
                break;
        }
        
        var step = tickStep;
        
        if (ruler.unit != mxConstants.INCHES || (scale > 2 || scale < 0.25))
        {
            step = scale >= 1 ? tickStep / scale : Math.floor(10 / scale / 10) * 10;
        }
        
        var lastTick = null;
            
        for (var i = RULER_THIKNESS + rStart % (step * scale); i <= (isVertical? canvas.height : canvas.width); i += step * scale) 
        {
            var current = Math.round((i - rStart) / scale / step);
            
            if (current == lastTick)
        	{
            	continue;
        	}
            
            lastTick = current;
            var text = null;
            
            if (current % len == 0) 
            {
                text = ruler.formatText(current * step) + "";
            }
            
            if (isVertical) 
            {
                drawLine(RULER_THIKNESS - tickSize[Math.abs(current) % len], i, RULER_THIKNESS, i, text);
            }
            else
            {
                drawLine(i, RULER_THIKNESS - tickSize[Math.abs(current) % len], i, RULER_THIKNESS, text);
            }
        }
    };
    
	var sizeListener = function() 
	{
	    var div = graph.container;
	    
	    if (isVertical)
    	{
	    	var newH = div.offsetHeight + RULER_THIKNESS;
	    	
	    	if (canvas.height != newH)
    		{
	    		canvas.height = newH;
	    		container.style.height = newH + 'px';
	    		drawRuler();
    		}
    	}
	    else 
    	{
	    	var newW = div.offsetWidth + RULER_THIKNESS;
	    	
	    	if (canvas.width != newW)
    		{
	    		canvas.width = newW;
	    		container.style.width = newW + 'px';
	    		drawRuler();
    		}
    	}
    };

    this.drawRuler = drawRuler;

	var efficientSizeListener = debounce(sizeListener, 10);
	this.sizeListener = efficientSizeListener;
	
	var efficientScrollListener = debounce(function()
	{
		var newScroll = isVertical? graph.container.scrollTop : graph.container.scrollLeft;
		
		if (ruler.lastScroll != newScroll)
		{
			ruler.lastScroll = newScroll;
			drawRuler();
		}
	}, 10);

	this.scrollListener = efficientScrollListener;
	this.unitListener = function(sender, evt)
    {
    	ruler.setUnit(evt.getProperty('unit'));
    };
	
    graph.addListener(mxEvent.SIZE, efficientSizeListener);
    graph.container.addEventListener("scroll", efficientScrollListener);
    graph.view.addListener("unitChanged", this.unitListener);

    function debounce(func, wait, immediate) 
    {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    this.setStyle = function(newStyle)
    {
    	style = newStyle;
    	container.style.background = style.bkgClr;
    	drawRuler();
    }
    
    //Showing guides on cell move
    this.origGuideMove = mxGuide.prototype.move;
	
	mxGuide.prototype.move = function (bounds, delta, gridEnabled, clone)
	{
		if (ruler.guidePart != null)
		{
			ctx.putImageData(ruler.guidePart.imgData1, ruler.guidePart.x1, ruler.guidePart.y1);	
			ctx.putImageData(ruler.guidePart.imgData2, ruler.guidePart.x2, ruler.guidePart.y2);	
			ctx.putImageData(ruler.guidePart.imgData3, ruler.guidePart.x3, ruler.guidePart.y3);	
		}
		
		var ret = ruler.origGuideMove.apply(this, arguments);

		var x1, y1, imgData1, x2, y2, imgData2, x3, y3, imgData3;
		ctx.lineWidth = 0.5;
        ctx.strokeStyle = style.guideClr;
        ctx.setLineDash([2]);

        if (isVertical)
		{
			y1 = bounds.y + ret.y + RULER_THIKNESS - this.graph.container.scrollTop;
			x1 = 0;
			y2 = y1 + bounds.height / 2;
			x2 = RULER_THIKNESS / 2;
			y3 = y1 + bounds.height;
			x3 = 0;
			imgData1 = ctx.getImageData(x1, y1, RULER_THIKNESS, 5);
			drawLine(x1, y1, RULER_THIKNESS, y1);
			imgData2 = ctx.getImageData(x2, y2, RULER_THIKNESS, 5);
			drawLine(x2, y2, RULER_THIKNESS, y2);
			imgData3 = ctx.getImageData(x3, y3, RULER_THIKNESS, 5);
			drawLine(x3, y3, RULER_THIKNESS, y3);
		}
		else
		{
			y1 = 0;
			x1 = bounds.x + ret.x + RULER_THIKNESS - this.graph.container.scrollLeft;
			y2 = RULER_THIKNESS / 2;
			x2 = x1 + bounds.width / 2;
			y3 = 0;
			x3 = x1 + bounds.width;
			imgData1 = ctx.getImageData(x1 , y1, 5, RULER_THIKNESS);
			drawLine(x1, y1, x1, RULER_THIKNESS);
			imgData2 = ctx.getImageData(x2 , y2, 5, RULER_THIKNESS);
			drawLine(x2, y2, x2, RULER_THIKNESS);
			imgData3 = ctx.getImageData(x3 , y3, 5, RULER_THIKNESS);
			drawLine(x3, y3, x3, RULER_THIKNESS);
		}
		
		if (ruler.guidePart == null || ruler.guidePart.x1 != x1 || ruler.guidePart.y1 != y1)
		{
			ruler.guidePart = { 
				imgData1: imgData1,
				x1: x1,
				y1: y1,
				imgData2: imgData2,
				x2: x2,
				y2: y2,
				imgData3: imgData3,
				x3: x3,
				y3: y3
			}	
		}
		
		return ret;
	}
	
	this.origGuideDestroy = mxGuide.prototype.destroy;
	
	mxGuide.prototype.destroy = function()
	{
		var ret = ruler.origGuideDestroy.apply(this, arguments);
		
		if (ruler.guidePart != null)
		{
			ctx.putImageData(ruler.guidePart.imgData1, ruler.guidePart.x1, ruler.guidePart.y1);	
			ctx.putImageData(ruler.guidePart.imgData2, ruler.guidePart.x2, ruler.guidePart.y2);	
			ctx.putImageData(ruler.guidePart.imgData3, ruler.guidePart.x3, ruler.guidePart.y3);
			ruler.guidePart = null;
		}
		
		return ret;
	};
};

mxRuler.prototype.unit = mxConstants.POINTS;

mxRuler.prototype.setUnit = function(unit) 
{
    this.unit = unit;
    this.drawRuler();
};

mxRuler.prototype.formatText = function(pixels) 
{
    switch(this.unit) 
    {
        case mxConstants.POINTS:
            return Math.round(pixels);
        case mxConstants.MILLIMETERS:
            return (pixels / mxConstants.PIXELS_PER_MM).toFixed(1);
        case mxConstants.INCHES:
            return (pixels / mxConstants.PIXELS_PER_INCH).toFixed(2);
    }
};

mxRuler.prototype.destroy = function() 
{
	this.ui.refresh = this.editorUiRefresh;
	mxGuide.prototype.move = this.origGuideMove;
	mxGuide.prototype.destroy = this.origGuideDestroy;
    this.graph.removeListener(this.sizeListener);
    this.graph.container.removeEventListener("scroll", this.scrollListener);
    this.graph.view.removeListener("unitChanged", this.unitListener);
    
    if (this.container != null)
    {
    	this.container.parentNode.removeChild(this.container);
    }
    
	this.ui.diagramContainer.style.left = this.ui.origContLeft + 'px';
	this.ui.diagramContainer.style.top = this.ui.origContTop + 'px';
};

function mxDualRuler(editorUi, unit)
{
	this.editorUiRefresh = editorUi.refresh;
	this.ui = editorUi;
	this.origGuideMove = mxGuide.prototype.move;
	this.origGuideDestroy = mxGuide.prototype.destroy;
	
	this.vRuler = new mxRuler(editorUi, unit, true);
	this.hRuler = new mxRuler(editorUi, unit, false, true);
	
	this.vRuler.drawRuler();
	this.hRuler.drawRuler();
};

mxDualRuler.prototype.setUnit = function(unit) 
{
	this.vRuler.setUnit(unit);
	this.hRuler.setUnit(unit);
};

mxDualRuler.prototype.setStyle = function(newStyle)
{
	this.vRuler.setStyle(newStyle);
	this.hRuler.setStyle(newStyle);
}

mxDualRuler.prototype.destroy = function() 
{
	this.vRuler.destroy();
	this.hRuler.destroy();
	this.ui.refresh = this.editorUiRefresh;
	mxGuide.prototype.move = this.origGuideMove;
	mxGuide.prototype.destroy = this.origGuideDestroy;
};