(function() {
	
	var font = (window.opener.urlParams['math-font'] != null) ?
		decodeURIComponent(window.opener.urlParams['math-font']) : 'TeX';

	window.MathJax = {
		showMathMenu: false,
		messageStyle: 'none',
		AuthorInit: function () {
			MathJax.Hub.Config({
				jax: ['input/TeX', 'input/MathML', 'input/AsciiMath'].concat(
				[(window.opener.urlParams['math-output'] == 'html') ?
					'output/HTML-CSS' : 'output/SVG']),
				extensions: ['tex2jax.js', 'mml2jax.js', 'asciimath2jax.js'],
				TeX: {
					extensions:['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
				},
				'HTML-CSS': {
					availableFonts: [font],
					imageFont: null
				},
				SVG: {
					font: font,
					useFontCache: false
				},
				tex2jax: {
					ignoreClass: 'geDisableMathJax'
				},
				asciimath2jax: {
					ignoreClass: 'geDisableMathJax'
				}
			});
		}
	};
	
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', window.opener.DRAW_MATH_URL + '/MathJax.js');
	
	// Waits for the Math to be rendered and then calls window.print
	if (window.IMMEDIATE_PRINT)
    {
		var r = false;
		
		s.onload = s.onreadystatechange = function()
		{
			if (!r && (!this.readyState || this.readyState == 'complete'))
			{
	      		MathJax.Hub.Queue(function ()
	      		{
	      			window.print();
	      		});
			}
		};
    }
	
	var t = document.getElementsByTagName('script')[0];
			  	
  	if (t != null)
  	{
  		t.parentNode.insertBefore(s, t);
  	}
})();