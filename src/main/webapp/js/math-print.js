/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function() {
	// The bundle's own global, see Editor.initMath
	window.DrawioMathJax =
	{
		options:
		{
			skipHtmlTags: {'[+]': ['text']},
			ignoreHtmlClass: 'geDisableMathJax'
		},
		loader:
		{
			load: ['output/svg', 'input/tex', 'input/asciimath',
				'ui/safe', '[tex]/html'],
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
				DrawioMathJax.startup.defaultReady();

				DrawioMathJax.startup.promise.then(function()
				{
					// Makes math selectable in the printed PDF, see Editor.js
					if (window.opener != null && window.opener.Editor != null &&
						window.opener.Editor.addMathTextLayer != null)
					{
						window.opener.Editor.addMathTextLayer(document.body, DrawioMathJax);
					}

					if (window.IMMEDIATE_PRINT)
					{
						// Waits for the stylesheets, images and fonts of this
						// window as in the non-math path (PrintDialog.printPreview)
						try
						{
							if (window.opener != null && window.opener.PrintDialog != null &&
								window.opener.PrintDialog.waitForResources != null)
							{
								window.opener.PrintDialog.waitForResources(window, function()
								{
									window.print();
								}, window.opener.PrintDialog.printTimeout);
							}
							else
							{
								window.print();
							}
						}
						catch (e)
						{
							window.print();
						}
					}
				});
			}
		}
	};

	// Same single file as in Editor.initMath
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', window.opener.DRAW_MATH_URL + '/drawio-mathjax.min.js');
	
	var t = document.getElementsByTagName('script')[0];
			  	
  	if (t != null)
  	{
  		t.parentNode.appendChild(s);
  	}
})();
