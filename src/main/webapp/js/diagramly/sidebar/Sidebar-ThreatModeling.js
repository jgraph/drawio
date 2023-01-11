(function()
{
	Sidebar.prototype.addThreatModelingPalette = function()
	{
		var w = 100;
		var h = 100;
		var gn = '';
		var dt = 'threat modeling ';
		this.setCurrentSearchEntryLibrary('threatModeling');
		
		this.addPaletteFunctions('threatModeling', 'Threat Modeling', false,
		[
			this.createVertexTemplateEntry('rounded=0;whiteSpace=wrap;html=1;', w * 1.2, h * 0.6, '', 'External Entity', null, null, this.getTagsForStencil(gn, 'external entity', dt).join(' ')),
			this.createVertexTemplateEntry('ellipse;whiteSpace=wrap;html=1;aspect=fixed;', w * 0.8, h * 0.8, '', 'Process', null, null, this.getTagsForStencil(gn, 'process', dt).join(' ')),
			this.createVertexTemplateEntry('ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;aspect=fixed;', w * 0.8, h * 0.8, '', 'Multi-Process', null, null, this.getTagsForStencil(gn, 'multi process', dt).join(' ')),
			this.createVertexTemplateEntry('shape=partialRectangle;whiteSpace=wrap;html=1;left=0;right=0;fillColor=none;', w * 1.2, h * 0.8, '', 'Data Store', null, null, this.getTagsForStencil(gn, 'data store', dt).join(' ')),
		 	this.createEdgeTemplateEntry('endArrow=classic;html=1;fontColor=#FF3333;', w * 0.5, h * 0.5, '', 'Data Flow', null, dt + 'data flow'),
		 	this.createEdgeTemplateEntry('endArrow=classic;startArrow=classic;html=1;fontColor=#FF3333;', w * 0.5, h * 0.5, '', 'Bidirectional Data Flow', null, dt + 'bidirectional data flow'),
			this.createVertexTemplateEntry('html=1;fontColor=#FF3333;fontStyle=1;align=left;verticalAlign=top;spacing=0;labelBorderColor=none;fillColor=none;dashed=1;strokeWidth=2;strokeColor=#FF3333;spacingLeft=4;spacingTop=-3;', w * 2.9, h * 1.4, 'Trust Boundary', 'Trust Boundary', null, null, this.getTagsForStencil(gn, 'trust boundary', dt).join(' ')),
			this.createVertexTemplateEntry('shape=requiredInterface;html=1;verticalLabelPosition=bottom;dashed=1;strokeColor=#FF3333;strokeWidth=2;fillColor=none;fontColor=#FF3333;align=left;', w * 0.2, h * 3.3, '', 'Trust Boundary', null, null, this.getTagsForStencil(gn, 'trust boundary', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;', w * 0.8, h * 0.2, 'Label', 'Label', null, null, this.getTagsForStencil(gn, 'label', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#d6b656;fillColor=#fff2cc;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;', w * 0.4, h * 0.2, 'A01', 'Asset Label', null, null, this.getTagsForStencil(gn, 'asset label', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#82b366;fillColor=#d5e8d4;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;', w * 0.3, h * 0.2, 'C01', 'Security Control Label', null, null, this.getTagsForStencil(gn, 'security control label', dt).join(' ')),
			this.createVertexTemplateEntry('text;html=1;strokeColor=#b85450;fillColor=#f8cecc;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;', w * 0.4, h * 0.2, 'TA01', 'Threat Actor Label', null, null, this.getTagsForStencil(gn, 'threat actor label', dt).join(' ')),

			this.addDataEntry('asset table', 360, 90, 'Asset Table', '5VfbjtowEP2avFa5LGn7WMKyrdS+LP0BE0+wVceO7GED+/W1YweyhAVWiyp1iYLkOZ7x5ZyZEYmyot48aNKwX4qCiLL7KCu0UuhH9aYAIaI05jTKZlGaxvYXpfNXZpNuNm6IBomXBKQ+4ImINXjkmzGAxsMGtyLAhpHGDZEsHTQ1SDQu+LPDstgCpZJIuARtgaSzhSCN4Z37rPNgXNCfZKvW2C/UW9OKC1EooXS3W1ZVVVqW3TZa/YHBDM2X+SR3EXa/RTif288ekKq2N1peCyJh/nLZefeE4AEed4/FAxugETavMtpBgc4HUDWg3lqXllNk3iPLPesxA75iIexrwIjx9moXutfHDoJEx+XKRnKdFurRMTJlSvNnJ48ISgzFiwd0fQdCD6Cpottd1FALLhlo7rRD1QQPARWG4VIhqjoYOrAQH80LqlXzm+gV9C7DZNhv0yguseNuMrWvZbOIP02iib10Ye1kb9vXuWsrsbSHtlnpVgZisAWDfe746yf5e9MhPZ4O26BYUP1cdmRXyI67UXb8mI3yg2EtQpW0jCMsGlK6qdb2IF/GEspQ5SdlV5aXSnQlxzilIA+Uk0pCLxvo+yfw6iUn+H5Z05eQn52txSR9I9thtUfHglzZs7x9OSLsjSVBWz1rSc1Iw91JL5J1MpJ1BqbUvEGu5G3quzkQYyBQendVvS9a7rp65zfX5Iep9N91+PwfdvjP479rcfLBW0B+Ay3+y/mSvwlRP1Jft+b+O867Dz/z/gI='),
			this.addDataEntry('threat actor table', 360, 90, 'Threat Actor Table', '5Vdtb9owEP41+TrlpWHsYxOgm7R9Kf0DLjmwNceOnKOB/vqdYwcyQoGqaNJKFCTfq+3nuTuRIMnLzYNhFf+lC5BBMg2S3GiNblVucpAyiENRBMkkiOOQfkE8e8MatdawYgYUXhIQu4AXJtfgNE/cAEPS3S9Qm9rZa9xKb685q+wS2bNVZTUyg3PxanVJSIqFVsiEAkOKqJWlZFUtWvdJ68GFLH6yrV5jl6iTsqWQMtdSm3a3ZDbOp3nebmP0b+hZsnF6l9psS9pv7s9n96MDFrrphEaUkimYHaRtHx/c04ftQ3oPCxiEzZvQtiqP6wPoEtBsyaURBXLnkYwc/CEHseI+7JvXsdrJq13onihaeK6O85YMeDtN1KNFJOPaiFdLj/RM9MkLe3B9B1YcqDJdbHdRfS6E4mCE5Q515T0kLNEvnzWiLr1gPArh0boojK6emFlB59Ivhv02lRYKW+zSjF5CMw+/pEFKl85JjvYyvdbdEMWKDk1VaTMDq7GBGrvacdePRh8th/h4OWw9Y571c9WRXKE67gbV8WMyqA+OpfRd0nCBMK/YwpoaGkaujRUsfJefpF0TLkvZthwXRQHqgDmlFXS0gZm+gGMvOoH33z19CfjJ2V6M4nei7bM9WhTUis7y/nRM0o0VQ+qetSrqAYe7k15EazqgdQL1wogKhVa3ye/mgIweQfHdVfm+KN11+R7d3JDvl9J/N+FH/3DCfx3+b7sPo08+A0Y3MOPH53v+Jkj9TIOdxP0XnXPvf/D9AQ=='),
			this.addDataEntry('security control table', 360, 90, 'Security Control Table', '5VfbjtowEP2avFZJDCl9JSzbSu3L0h8weMBWHTtyhg3s13ecGMgSFlgtqtQlSiTPeMaXc86MlIjlxebR8VL+sgJ0xB4iljtrsR0Vmxy0jtJYiYhNojSN6YvS6RuzSTMbl9yBwWsS0jbhmes1tJ4ZLNZO4Za8uTXorK7amAq3OsRUkpd+iHzuXeMKucOZevE+FpNjQZlcGXDkSBpba15WqgmfNBFSafGTb+0adwvtrPFSaZ1bbV2zGxNDGIlBs42zf6AzM0rnLMt8Bu03C+fz+1W1KjQ3MH290rR5QnzHHzcP+QMa4BA2byLauAKcj2ALQOfRqpVA2UawrEU9lqBWMqR9Cz5etfZqn3rghwaBotN0sR5d57l5sjXdSlqnXjwjOoDf5SvuwPUduDhyja3Y7rO68CsjgXRCfrRliNCwxDCcW0RbBMMFFOKTUhDOlr+5W8EupMv/YZvSKoMNdsMxvYRmHn8ZRkO6dE52crDp9eGOKDZ0aBKiXxl4hTVUuJNLe/0k+6gc0tNy2AbGAuuX1MFuoI5BTx0/Jj19SCx0qJJaKoRZyRd+qqYe1FaugUUo7LO0W8Jlqb3AJlIJAeaIOWMN7GgD9/AMLXvJGbxfl/E14LOLtZik70Q7rPbkUTArOsv7l+Oabmw4UvWsjah6HO5PehWtwx6tE6gWTpWorLlPfjdHZHQISgc35fuq5W7Ld3Z3Tb4rpf+uw2f/sMN/7Ukjj5NP3gKyO2jxo8slfxekfqa+TubhP64N7/7m/QU='),
			
			this.createVertexTemplateEntry('shape=note;strokeWidth=2;fontSize=14;size=20;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontColor=#666600;', w * 1.1, h * 0.8, 'Note', 'Note', null, null, this.getTagsForStencil(gn, 'note', dt).join(' ')),
			this.createVertexTemplateEntry('shape=or;whiteSpace=wrap;html=1;direction=north;fillColor=#dae8fc;strokeColor=#6c8ebf;', w * 1.2, h * 0.8, 'AND', 'AND Gate', null, null, this.getTagsForStencil(gn, 'and gate', dt).join(' ')),
			this.createVertexTemplateEntry('shape=xor;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;direction=north;', w * 1.2, h * 0.8, 'OR', 'OR Gate', null, null, this.getTagsForStencil(gn, 'or gate', dt).join(' ')),
			this.createVertexTemplateEntry('rounded=0;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;', w * 1.2, h * 0.8, 'Leaf', 'Leaf Node', null, null, this.getTagsForStencil(gn, 'leaf node', dt).join(' ')),
		]);
		
		this.setCurrentSearchEntryLibrary();
	};
})();
