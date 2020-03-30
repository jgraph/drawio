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

var mxRuler = function(graph, container, isVertical) 
{
    var ruler = this;
    var canvas = document.createElement("canvas");
    //initial sizing which is corrected by the graph size event
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.style.overflow = 'hidden';
    canvas.style.position = "relative";
    container.appendChild(canvas);
    //Disable alpha to improve performance as we don't need it
    var ctx = canvas.getContext("2d"/*, {alpha: false}*/);
    this.graph = graph;
    this.container = container;
    this.canvas = canvas;

    var drawLine = function (x1, y1, x2, y2, text) 
    {
        //remove all fractions
        x1 = Math.round(x1); y1 = Math.round(y1); x2 = Math.round(x2); y2 = Math.round(y2);
        //adding the 0.5 is necessary to prevent anti-aliasing from making lines thicker!
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

    var drawRuler = function(forceErase) 
    {
        //The area is automatically cleared when the canvas size is changed
    	if (forceErase) ctx.clearRect(0, 0, canvas.width, canvas.height);
    	
        ctx.beginPath();
        ctx.lineWidth = 0.1;
        ctx.strokeStyle = "#BBBBBB";
        ctx.font = "9px Arial";
        ctx.fillStyle = '#BBBBBB';

        var scale = graph.view.scale;
        var bgPages = graph.view.getBackgroundPageBounds();
        var t = graph.view.translate;
        var bounds = graph.view.getGraphBounds();

        var rStart = (isVertical? bgPages.y : bgPages.x);
        
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
            case ruler.PIXELS:
                len = 10;
                tickStep = 10;
                tickSize = [25,5,5,5,5,10,5,5,5,5];
                break;
            case ruler.CENTIMETER:
                len = 10;
                tickStep = ruler.pPerCM/len;
                tickSize = [25,5,5,5,5,10,5,5,5,5];
                break;
            case ruler.INCHES:
            	if (scale <=0.5 || scale >=4)
                    len = 8;
                else
                    len = 16;
                
                tickStep = ruler.pPerInch/len;
                tickSize = [25,5,8,5,12,5,8,5,15,5,8,5,12,5,8,5];
                break;
        }
        
        var step = tickStep;
        
        if (ruler.unit != ruler.INCHES || (scale > 2 || scale < 0.25))
            step = scale>= 1 ? (tickStep / Math.floor(scale)) : Math.floor(10 / scale / 10) * 10;
            
        for (var i = rStart % (step * scale); i <= (isVertical? canvas.height : canvas.width); i += step * scale) 
        {
            var current = Math.round((i - rStart) / scale / step);
            var text = null;
            
            if (current % len == 0) 
            {
                text = ruler.formatText(Math.round(current * step)) + "";
            }
            
            if (isVertical) 
            {
                drawLine(30 - tickSize[Math.abs(current) % len], i, 30, i, text);
            }
            else
            {
                drawLine(i, 30 - tickSize[Math.abs(current) % len], i, 30, text);
            }
        }
    };
    
	var sizeListener = function() 
	{
	    var div = graph.container;
	    var newW = isVertical? container.offsetWidth : div.scrollWidth;
	    var newH = isVertical? div.scrollHeight : container.offsetHeight;
	    
	    if (newW != canvas.width || newH != canvas.height) 
	    {
            canvas.width = newW;
            canvas.height = newH;
            drawRuler();
        }
    };

    this.drawRuler = drawRuler;

	var efficientSizeListener = debounce(sizeListener, 10);
	this.sizeListener = efficientSizeListener;

    //Size event is called upon scaling so we may not need it
    //graph.view.addListener(mxEvent.SCALE, efficientSizeListener);
    graph.addListener(mxEvent.SIZE, efficientSizeListener);
    graph.container.addEventListener("scroll", function() {
        if (isVertical) 
        {
            canvas.style.top = -graph.container.scrollTop + "px";
        }
        else 
        {
            canvas.style.left = -graph.container.scrollLeft + "px";
        }
    });

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

    function createHint()
    {
        var hint = document.createElement('div');
        hint.className = 'geHint';
        hint.style.whiteSpace = 'nowrap';
        hint.style.position = 'absolute';

        return hint;
    };

    graph.graphHandler.updateHint = function(me)
    {
        if (this.shape != null)
        {
            if (this.hint == null)
            {
                this.hint = createHint();
                this.graph.container.appendChild(this.hint);
            }

            var t = this.graph.view.translate;
            var s = this.graph.view.scale;
            var x = this.roundLength((this.bounds.x + this.currentDx) / s - t.x);
            var y = this.roundLength((this.bounds.y + this.currentDy) / s - t.y);

            this.hint.innerHTML = ruler.formatText(x) + ', ' + ruler.formatText(y); //Math.round(current * step)

            this.hint.style.left = (this.shape.bounds.x + Math.round((this.shape.bounds.width - this.hint.clientWidth) / 2)) + 'px';
            this.hint.style.top = (this.shape.bounds.y + this.shape.bounds.height + 12) + 'px';
        }
    };

    mxVertexHandler.prototype.updateHint = function(me)
    {
        if (this.index != mxEvent.LABEL_HANDLE)
        {
            if (this.hint == null)
            {
                this.hint = createHint();
                this.state.view.graph.container.appendChild(this.hint);
            }

            if (this.index == mxEvent.ROTATION_HANDLE)
            {
                this.hint.innerHTML = this.currentAlpha + '&deg;';
            }
            else
            {
                var s = this.state.view.scale;
                this.hint.innerHTML = ruler.formatText(this.roundLength(this.bounds.width / s)) + ' x ' + ruler.formatText(this.roundLength(this.bounds.height / s));
            }

            var rot = (this.currentAlpha != null) ? this.currentAlpha : this.state.style[mxConstants.STYLE_ROTATION] || '0';
            var bb = mxUtils.getBoundingBox(this.bounds, rot);

            if (bb == null)
            {
                bb = this.bounds;
            }

            this.hint.style.left = bb.x + Math.round((bb.width - this.hint.clientWidth) / 2) + 'px';
            this.hint.style.top = (bb.y + bb.height + 12) + 'px';
        }
    };

    mxEdgeHandler.prototype.updateHint = function(me, point)
    {
        if (this.hint == null)
        {
            this.hint = createHint();
            this.state.view.graph.container.appendChild(this.hint);
        }

        var t = this.graph.view.translate;
        var s = this.graph.view.scale;
        var x = this.roundLength(point.x / s - t.x);
        var y = this.roundLength(point.y / s - t.y);

        this.hint.innerHTML = ruler.formatText(x) + ', ' + ruler.formatText(y);
        this.hint.style.visibility = 'visible';

        if (this.isSource || this.isTarget)
        {
            if (this.constraintHandler.currentConstraint != null &&
                this.constraintHandler.currentFocus != null)
            {
                var pt = this.constraintHandler.currentConstraint.point;
                this.hint.innerHTML = '[' + Math.round(pt.x * 100) + '%, '+ Math.round(pt.y * 100) + '%]';
            }
            else if (this.marker.hasValidState())
            {
                this.hint.style.visibility = 'hidden';
            }
        }

        this.hint.style.left = Math.round(me.getGraphX() - this.hint.clientWidth / 2) + 'px';
        this.hint.style.top = (Math.max(me.getGraphY(), point.y) + this.state.view.graph.gridSize) + 'px';

        if (this.hideEdgeHintThread != null)
        {
            window.clearTimeout(this.hideEdgeHintThread);
        }

        this.hideEdgeHintThread = window.setTimeout(mxUtils.bind(this, function()
        {
            if (this.hint != null)
            {
                this.hint.style.visibility = 'hidden';
            }
        }), 500);
    };
};

mxRuler.prototype.PIXELS = 1;
mxRuler.prototype.CENTIMETER = 2;
mxRuler.prototype.INCHES = 3;

mxRuler.prototype.pPerCM = 39.37;
mxRuler.prototype.pPerInch = 100;

mxRuler.prototype.unit = mxRuler.prototype.PIXELS;

mxRuler.prototype.setUnit = function(unit) {
    this.unit = unit;
};

mxRuler.prototype.formatText = function(pixels) {
    switch(this.unit) {
        case this.PIXELS:
            return pixels;
        case this.CENTIMETER:
            return (pixels / this.pPerCM).toFixed(2);
        case this.INCHES:
            return (pixels / this.pPerInch).toFixed(2);
    }
};

//TODO fix this (put correct listeners)
mxRuler.prototype.destroy = function() {
    this.graph.view.removeListener(this.drawRuler);
    this.graph.removeListener(this.sizeListener);
    this.graph.container.removeEventListener("scroll", this.drawRuler);
    this.graph.view.removeListener(mxEvent.SCALE, this.drawRuler);
    if (this.container != null && this.canvas != null) this.container.removeChild(this.canvas);
};