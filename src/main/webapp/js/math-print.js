/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function() {
	window.MathJax =
	{
		options:
		{
			skipHtmlTags: {'[+]': ['text']},
			ignoreHtmlClass: 'geDisableMathJax'
		},
		loader:
		{
			load: [(window.opener.urlParams['math-output'] == 'html') ?
				'output/chtml' : 'output/svg', 'input/tex',
				'input/asciimath', 'ui/safe', '[tex]/html'],
			paths: {
				'fonts': window.opener.DRAW_MATH_URL + '/fonts',
				'mathjax-tex': window.opener.DRAW_MATH_URL + '/fonts/mathjax-tex-font',
				'mathjax-mhchem-extension': window.opener.DRAW_MATH_URL + '/fonts/mathjax-mhchem-font-extension',
				'mathjax-bbm-extension': window.opener.DRAW_MATH_URL + '/fonts/mathjax-bbm-font-extension',
				'mathjax-bboldx-extension': window.opener.DRAW_MATH_URL + '/fonts/mathjax-bboldx-font-extension',
				'mathjax-dsfont-extension': window.opener.DRAW_MATH_URL + '/fonts/mathjax-dsfont-font-extension',
			}
		},
		output: {
			font: 'mathjax-tex',
		},
		startup:
		{
			ready: function()
			{
				MathJax.startup.defaultReady();

				// Hardens ui/safe in this window's MathJax, see Editor.js
				if (window.opener != null && window.opener.Editor != null &&
					window.opener.Editor.patchMathJaxSafeFilters != null)
				{
					window.opener.Editor.patchMathJaxSafeFilters(MathJax);
				}

				MathJax.startup.promise.then(function()
				{
					if (window.IMMEDIATE_PRINT)
					{
						window.print();
					}
				});
			}
		}
	};

	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', window.opener.DRAW_MATH_URL + '/startup.js');
	
	var t = document.getElementsByTagName('script')[0];
			  	
  	if (t != null)
  	{
  		t.parentNode.appendChild(s);
  	}
})();
