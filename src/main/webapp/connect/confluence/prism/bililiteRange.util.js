// Text range utilities
// documentation: http://bililite.com/blog/2013/02/08/bililiterange-plugins/
// depends on bililiteRange.js (http://bililite.com/blog/2011/01/17/cross-browser-text-ranges-and-selections/)
// Version: 1.3
// Copyright (c) 2013 Daniel Wachsstock
// MIT license:
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

if (bililiteRange) (function(){

bililiteRange.bounds.EOL = function(){
	// set the range to the end of this line
	// if we start at the end of a line, find will go to the next line! Check for that case first
	this.bounds('startbounds');
	if (this.findprimitive (/$/mg, this.bounds())) return this.bounds();
	return this.find(/$/m, true).bounds(); // don't wrap
};
bililiteRange.bounds.BOL = function(){
	// set the range to the beginning of this line
	// if we start at the beginning of a line, findBack will go to the previous line! Check for that case first
	this.bounds('startbounds');
	if (this.findprimitive (/^/mg, this.bounds())) return this.bounds();
	return this.findBack(/^/m, true).bounds(); // don't wrap
};
bililiteRange.bounds.line = function(){
	this.bounds('BOL');
	var start = this.bounds()[0];
	this.bounds('EOL');
	return [start, this.bounds()[1]];
};
bililiteRange.bounds.startbounds = function(){
	return [this.bounds()[0], this.bounds()[0]];
};
bililiteRange.bounds.endbounds = function(){
	return [this.bounds()[1], this.bounds()[1]];
};

// add autoindent option
var oldtext = bililiteRange.fn.text;
bililiteRange.fn.text = function (text, select, autoindent){
	if (!arguments.length) return oldtext.call (this);
	if (autoindent) text = indent(text, this.indentation());
	return oldtext.call (this, text, select);
}

bililiteRange.extend({
	
	find: function(re, nowrap, backwards){
		// little hack: can put the "nowrap" as a flag on the RegExp itself, analagous to ignoreCase and multiline; overrides the parameter
		if (re.nowrap !== undefined) nowrap = re.nowrap;
		re = globalize(re);
		var bounds = this.bounds();
		if (!backwards){
			var findprimitive = 'findprimitive';
			var initialbounds = [bounds[0], Number.MAX_VALUE];
			var fallbackbounds = [bounds[0]+1, Number.MAX_VALUE];
		}else{
			findprimitive = 'findprimitiveback';
			initialbounds = [0, bounds[0]];
			fallbackbounds = [0, bounds[0]-1];
		}
		var match = this[findprimitive](re, initialbounds);
		if (matchIs(match, bounds)){ // if the match is exactly the current string, it doesn't count
			match = this[findprimitive](re, fallbackbounds);
		}
		if (!match && !nowrap) match = this[findprimitive](re, [0, Number.MAX_VALUE]);
		if (matchIs(match, bounds)) match = false; // again, even with wrapping, don't find the identical segment
		this.match = match; // remember this for the caller
		if (match) this.bounds([match.index, match.index+match[0].length]); // select the found string
		return this;
	},

	findBack: function (re, nowrap) { return this.find(re,nowrap,true) },

	indentation: function(){
		// returns the whitespace at the start of this line
		return /^\s*/.exec(this.clone().bounds('line').text())[0];
	},
	
	indent: function (tabs){
		// tabs is the string to insert before each line of the range
		var oldtext = this.text(), newtext = indent(oldtext, tabs), b = this.bounds();
		this.text(newtext);
		// Need to indent the line containing the start of the range (indent only adds the tabs after newlines)
		this.clone().bounds('BOL').text(tabs);
		// Adjust bounds
		return this.bounds([b[0]+tabs.length, b[1]+tabs.length+newtext.length-oldtext.length]);
	},
	
	unindent: function (n, tabSize){
		// remove n tabs or sets of tabSize spaces from the beginning of each line
		tabSize = tabSize || this.data().tabSize || 8; // 8 is the browser default
		// remove internal tabs
		var oldtext = this.text(), newtext = unindent(oldtext, n, tabSize, false), b = this.bounds();
		var diffInternal = newtext.length-oldtext.length;
		this.text(newtext).bounds([b[0], b[1]+diffInternal]);
		// remove initial tabs
		var line = this.clone().bounds('line');
		oldtext = line.text();
		newtext = unindent(oldtext, n, tabSize, true);
		line.text(newtext);
		var diffStart = newtext.length-oldtext.length;
		return this.bounds([Math.max(line.bounds()[0], b[0]+diffStart), b[1]+diffInternal+diffStart]);
	},
			
	line:function(n){
		// set the bounds to the nth line or
		// return the line number of the start of the bounds. Note that it is 1-indexed, the way ex writes it!
		if (arguments.length){
			n =  parseInt(n);
			if (isNaN(n)) return this;
			// if n is too large,set the bounds to the end; if too small, to the beginning
			if (n > this.all().split('\n').length) return this.bounds('end');
			if (n < 1) return this.bounds([0,0]);
			// move to the given line number, at same character number as the initial bounds.
			var start = this.bounds();
			this.bounds('BOL');
			var c = start[0] - this.bounds()[0]; // character number
			// so find n-1 newlines to get to the correct line, then c characters over (if we don't have that many, go to the end of the line)
			var re = new RegExp('(.*\\n){'+(n-1)+'}(.{'+c+'}|.*$)', 'm');
			return this.bounds('all').find(re).bounds('endbounds');
		}else{
			// just count newlines before this.bounds
			// If we are on the boundary between lines (i.e. after the newline), this counts the next line
			return this.all().slice(0, this.bounds()[0]).split('\n').length;
		}
	},
	
	live: function(on){
		var self = this;
		if (arguments.length == 0 || on){
			this._oldtext = self.all(); // resync the text if it should be necessary
			if (this._inputHandler) return this; // don't double-bind
			this._inputHandler = function(ev){
				// first find the change.
				var start, oldend, newend;
				var newtext = self.all();
				if (newtext == self._oldtext) return; // no change
				if (!ev.bounds){
					// "real" input events don't tell us the bounds (and until they really support DOM 3 events, not even the text.
					// we have to start from scratch.
					var change = diff (self._oldtext, newtext);
					ev.bounds = change.bounds; // save it for future events
					ev.data = change.data;
				}
				start = ev.bounds[0];
				oldend = ev.bounds[1];
				newend = ev.bounds[0]+ev.data.length;
				self._oldtext = newtext;
				// adjust bounds; this tries to emulate the algorithm that Microsoft Word uses for bookmarks
				if (self._bounds[0] <= start){
					// no change
				}else if (self._bounds[0] > oldend){
					self._bounds[0] += newend - oldend;
				}else{
					self._bounds[0] = newend;
				}
				if (self._bounds[1] < start){
					// no change
				}else if (self._bounds[1] >= oldend){
					self._bounds[1] += newend - oldend;
				}else{
					self._bounds[1] = start;
				}
			};
			self.listen('input', self._inputHandler);
		}else{
			self.dontlisten('input', self._inputHandler);
			delete self._inputHandler;
		}
	return this;
	},
	
	findprimitive: function(re, bounds){
		// search for re within the bounds given. Return the result of the RegExp.exec call  or false if not found.
		// re needs to be global for this to work!
		var text = this.all();
		re.lastIndex = bounds[0];
		var match = re.exec(text);
		if (!match || match.index+match[0].length > bounds[1]) return false;
		return match;
	},
	
	findprimitiveback: function (re, bounds){
		// no way to search backwards; have to search forward until we fail
		var match = false;
		do {
			var lastmatch = match;
			match = this.findprimitive(re, bounds);
			bounds[0] = match.index+1;
		}while (match);
		return lastmatch;
	}
});

// utilities
function globalize (re){
	// make a RegExp global, to allow multiple searches
	return new RegExp(re.source, 'g'+(re.ignoreCase ? 'i' : '') + (re.multiline ? 'm' : ''));
}
function matchIs(match, bounds){
	// check if the match that we just found is the same as the existing bounds, since we shouldn't count that
	// this way, "Find Next" won't keep coming back to the same string.
	// I think this is the way that Word does it
	return match && match.index == bounds[0] && match[0].length == bounds[1]-bounds[0];
}

function diff (oldtext, newtext){
	// Try to find the changed text , assuming it was a continuous change
	// This is wrong for drag and drop, which only fires one input event for both removal and insertion
	var oldlen = oldtext.length;
	var	newlen = newtext.length;
	for (var i = 0; i < newlen && i < oldlen; ++i){
		if (newtext.charAt(i) != oldtext.charAt(i)) break;
	}
	var start = i;
	for (i = 0; i < newlen && i < oldlen; ++i){
		var newpos = newlen-i-1, oldpos = oldlen-i-1;
		if (newpos < start || oldpos < start) break;
		if (newtext.charAt(newpos) != oldtext.charAt(oldpos)) break;
	}
	var oldend = oldlen-i;
	var newend = newlen-i;
	return {bounds: [start, oldend], data: newtext.slice(start, newend)}
};
bililiteRange.diff = diff; // expose

function indent(text, tabs){
	return text.replace(/\n/g, '\n'+tabs);
}
function unindent(str, count, tabwidth, start){
	// count can be an integer >= 0 or Infinity.
	// (We delete up to 'count' tabs at the beginning of each line.)
	// If invalid, defaults to 1.
	//
	// tabwidth can be an integer >= 1.
	// (The number of spaces to consider a single tab.)
	// If invalid, defaults to 4.
	//
	// Either can also be a string or number that rounds to that.
	//
	// start=true: unindent only the first line of the string.
	// start=false: unindent any line in the string except the first.
	tabwidth = Math.round(tabwidth);
	count = Math.round(count);
	if (!isFinite(tabwidth) || tabwidth < 1) tabwidth = 4;
	if (isNaN(count) || count < 0) count = 1;
	if (!isFinite(count)) count = '';
	var re = new RegExp((start ? '(^)' : '(\\n)') + '(?:\t| {'+tabwidth+'}){1,'+count+'}', 'g');
	return str.replace(re, '$1');
}

})();