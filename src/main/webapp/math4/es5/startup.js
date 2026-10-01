/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 *
 * draw.io's MathJax is a single file, drawio-mathjax.min.js next to this one
 * (built in etc/mathjax). This file takes the place of MathJax's startup.js
 * for copies of draw.io's scripts that still load it, e.g. an old
 * embed.min.js saved on another site: it loads the bundle and asks it to use
 * window.MathJax, which that code configures and uses, instead of its own
 * global, window.DrawioMathJax.
 */
(function()
{
	var current = document.currentScript;
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('data-mathjax-global', 'MathJax');
	script.setAttribute('src', (current != null && current.src) ?
		current.src.replace(/startup\.js([?#].*)?$/, 'drawio-mathjax.min.js') :
		'https://app.diagrams.net/math4/es5/drawio-mathjax.min.js');
	(document.head || document.documentElement).appendChild(script);
})();
