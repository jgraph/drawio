(function()
{
	// Adds mockup shapes
	Sidebar.prototype.addMockupPalette = function()
	{
		this.addMockupButtonsPalette();
		this.addMockupContainersPalette();
		this.addMockupFormsPalette();
		this.addMockupGraphicsPalette();
		this.addMockupMarkupPalette();
		this.addMockupMiscPalette();
		this.addMockupNavigationPalette();
		this.addMockupTextPalette();
	};
	
	Sidebar.prototype.addMockupButtonsPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 = mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
		var gn = 'mxgraph.mockup.buttons';
		var dt = 'mockup button ';
		
		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'buttons.button;' + skcl6 + 'fontColor=#ffffff;mainText=;buttonStyle=round;fontSize=17;fontStyle=1;fillColor=#008cff;whiteSpace=wrap;',
										150, 50, 'Button Text', 'Button', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),

			this.addEntry(dt + 'formatted multibutton multi', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 150, 50), s2 + 'buttons.multiButton;fillColor=#008cff;strokeColor=#666666;mainText=;subText=;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Main Text', new mxGeometry(0, 8, 150, 20), s2 + 'anchor;fontSize=16;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Sub Text', new mxGeometry(0, 30, 150, 10), s2 + 'anchor;fontSize=12;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	bg.insert(button2);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Formatted Button');
			}),
			this.addDataEntry(dt + 'horizontal bar', 500, 50, 'Horizontal Button Bar',
				'7VZLT8MwDP41PTKlyTY4r8C4ICFx4By1bhstbao02zp+PW6S7t0xIRhDolKl2I4f+fzJScCioplqXuXPKgEZsIeARVop41ZFE4GUASUiCdh9QCnBP6CPPdbQWknFNZTmHAfqHBZczsFpnKI2K+kVtdFqBm8iMTkqwoBN6pwnaokCQSHhdQ6JF7gUWYnrGNODRkVuCrnxqtqQRZO1xx0UKp7Nq4HWEGOpE/0q3ltz2MZJhZSRkkrbElhqvzaGrWXLMrYfWvw5QBtoerGwKg/EFFQBRq9wy9KfDa0j4vAiOYgsN53S6Xjt5GztukEWFx7c40CzA6Anc2NUibpfh9wirkrTdeDWy8dwtvt8peFep0pVwskmaagxxVMHbXhu3+infQvpqL9vGiQ3YgE78Y8106d4UQIzU9Lsxe5cVJrWYA66v67sLEIM+wnB/glx1YQ4GAjfQohRPyGGFydEi5lPvz+a/yAvdh0uxJKbn5kb436ahJemiYT0ayxZX+inWIL7CLmLj1z8nj/XPj163gYobh54jgHb778P'),
			this.addDataEntry(dt + 'vertical bar', 120, 200, 'Vertical Button Bar',
				'7VZdT8MgFP01PLpQ2KbPq7onExMffMb2tiWjpaFsa/313lL2vS7LonMmNmnCPXA/OPcEIDzM66kRZfaiY1CEPxEeGq1tN8rrEJQijMqY8EfCGMWfsOee2cDN0lIYKOw5DqxzWAg1hw7pgMo2ygOVNXoG7zK2GQIB4ZMqE7FeokHRiEWVQewNoWRa4DjC9GAQyGyuNl5lGzKv03a7g1xHs3k5MAYiLHVi3uRnOx20cRKpVKiVNq4EnrivjeFq2ZoZuw9n/D7AWKh7uXCQJ2IKOgdrGlyy9HtrV3i+aAYyzbwbox4UVQeka98NtTjw7B5nmh8wPZlbqwvEfp1zR7ku7KoF994+RrRb5ysN9lpV6AJOdslAhSm293VW39hlfRt5zIASVi5gJ/6xXvoUr1piZkab3TArD50kFdiD3q8LO0sOw3458H853LIcgv3T4Fv0MOrXw/DaevjQmDn3+fdP5r+ni2bH4UoqufuRU2Pcr5Lg2iqxurxIIuvL/JREcB2lD9GRS9+L58aPjp5XAZqbt13X/+2n3xc='),

			this.createVertexTemplateEntry(s2 + 'buttons.onOffButton;fillColor=#ffffff;gradientColor=none;' + skcl9 + 'buttonState=on;fillColor2=#008cff;fontColor=#ffffff;fontSize=17;mainText=;spacingRight=40;fontStyle=1;',
					150, 50, 'ON', 'On-off button', null, null, this.getTagsForStencil(gn, 'onOffButton', dt + 'on off').join(' '))
		];
			
		this.addPalette('mockupButtons', 'Mockup Buttons', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMockupContainersPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
		
		var gn = 'mxgraph.mockup.containers';
		var dt = 'mockup container ';

		var fns =
		[
			this.createVertexTemplateEntry(s + 'containers.videoPlayer;' + skcl6 + 'strokeColor2=#008cff;strokeColor3=#c4c4c4;textColor=#666666;' + flclf + 'fillColor2=#008cff;barHeight=30;barPos=20;',
										300, 200, '', 'Video Player', null, null, this.getTagsForStencil(gn, 'videoPlayer', dt).join(' ')),
			this.addDataEntry(dt + 'accordion', 100, 220, 'Accordion',
				'1VZdb4IwFP01fZwprbo96zaflizZw54buEBjoaStCvv1u0BFnLKYbS5IQtJ77kdvzz00EL7MypURRfqiI1CEPxG+NFq7dpWVS1CKMCojwh8JYxRfwp4HvEHjpYUwkLtLElibsBVqAy3SAtZVygPWGb2Gdxm5FIGA8IVNRaR3aFA0ImFTiLwhlExyXIe4PRgEUpepQ1ZRl8zKpD7uJNPhelNMQp07IXMwdmIMhNj1wrzJD/AVY6nUUittmmZ43Dx1taarnmfePOjxJwLjoBxkpYE8JSvQGThTYcjOn7KOoC1zNAWZpD5tTycVtgWSLvdAMi48z+c55yecr4zeFAgFYyMf3d4M7r19jvImzjcdfBlarnM4mZcHDVis3j/dRcNjPxzevMUMKOHkFo7q/2ag08GBju5rutZA+8kjn6rf4lVL3JnR6rjMPkPHsQV3ooKusYuEMRsUBr8tYXTX7nfCwDhKH8Lz13PnuUl1zNgV1DEfVMf0ttQxxmujOkr4J5nc/cUtgubh/68N7/8efgI='),

			this.addEntry(dt + 'browser window', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 550, 380), s2 + 'containers.browserWindow;rSize=0;fillColor=#ffffff;strokeColor=#666666;mainText=,;recursiveResize=0;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Page 1', new mxGeometry(60, 12, 110, 26), s2 + 'containers.anchor;fontSize=17;fontColor=#666666;align=left;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('https://www.draw.io', new mxGeometry(130, 60, 250, 26), s2 + 'containers.anchor;rSize=0;fontSize=17;fontColor=#666666;align=left;');
			   	button2.vertex = true;
			   	bg.insert(button2);

		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Browser Window');
			}),

		   	this.createVertexTemplateEntry(s + 'containers.userMale;' + skcl6 + 'strokeColor2=#008cff;' + flclf,
										100, 100, '', 'User, Male', null, null, this.getTagsForStencil(gn, 'userMale', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'containers.userFemale;' + skcl6 + 'strokeColor2=#008cff;' + flclf,
										100, 100, '', 'User, Female', null, null, this.getTagsForStencil(gn, 'userFemale', dt).join(' ')),
					
			this.addEntry(dt + 'group', function()
			{
				var area1 = new mxCell('', new mxGeometry(0, 0, 150, 200), 'shape=mxgraph.mockup.containers.marginRect;rectMarginTop=10;strokeColor=#666666;fillColor=#ffffff;strokeWidth=1;dashed=0;rounded=1;arcSize=5;recursiveResize=0;');
				area1.vertex = true;
				var button1 = new mxCell('Group', new mxGeometry(5, 0, 90, 30), 'shape=rect;strokeColor=none;fillColor=#008cff;strokeWidth=1;dashed=0;rounded=1;arcSize=20;fontColor=#ffffff;fontSize=17;spacing=2;spacingTop=-2;align=left;autosize=1;spacingLeft=4;resizeWidth=0;resizeHeight=0;perimeter=none;');
				button1.vertex = true;
				area1.insert(button1);
				
				return sb.createVertexTemplateFromCells([area1], 150, 200, 'Group');
			}),
			
			this.createVertexTemplateEntry(s2 + 'containers.window;align=left;verticalAlign=top;spacingLeft=8;strokeColor2=#008cff;strokeColor3=#c4c4c4;fontColor=#666666;' + flclf + 'mainText=;fontSize=17;labelBackgroundColor=none;',
										550, 380, 'Window Title', 'Window', null, null, this.getTagsForStencil(gn, 'window', dt).join(' ')),
			this.addDataEntry(dt + 'horizontal tab bar', 400, 200, 'Horizontal Tab Bar',
				'5ZbbboMwDIafhtsqJD3sut3hqtK0Tdp1CgaiBoxC2rV7+hmSHraCVnXr1mlIiPh3nDj5DCQQk3x1Z2SZTTEGHYibQEwMonWtfDUBrQPOVByI64BzRnfAbzu8YeNlpTRQ2GMCuAtYSr0ApzihsmvthcoanMOzim1GQhiIcZXJGF/IYGTEssog9obUKi2oHdH0YEjIbK53UWU9ZL5K6+X2cozmi7IXYWGlKsBUvVyaVBUPEFlO/Q09p43yhCXFiVp0yUxQo2myE8PmIk+itN7Tk+YinSaLFaWz8RVYUBZjv24wFlade9dIfuPuAHOwZk1dXvxekLfP3P6yDFSa+TC+EWXlhHQbu0NBDU+jnYw4IPMkZySEvwjI1ExqNI/qFfyICbm9GY683cbnZ8nxT8kN28ANnGZAS6uW8G74Nph+hntUNDFnm3w+4MckqcAewN/mdVQ99Dvq4Tdf2BPqYUv3oB4Yu4oaz4d62OqXD340OAP4QQd48bfA/8sPQf8cX4LhJf2zLZbjhbVY7FXD4KTXu4OygYpG3V9Kjks505uyo0MTWG+H31cVrT/20deqYv2+uL5SFGTuDomu+/4Z8g0='),
			this.addDataEntry(dt + 'vertical tab bar', 400, 200, 'Vertical Tab Bar',
				'3ZZRb4IwEMc/Da+mFMU96zb3MJNlW7LnCgc0FmraqrhPvwOqosLm3IxuJITe/3q9a380reMN03yk2CwZyxCE49053lBJaapWmg9BCIcSHjrerUMpwdeh9y1et/SSGVOQmWMCaBWwYGIOlVIJ2qyEFbRRcgpvPDQJCq7jDXTCQrlEg6ARMp1AaA0meJxhO8D0oFBITCq2UbNiyDSPi+l2UhlM57NOIDPDeAZKd1KmYp49Q2Ao9lf4HZfKI0TFZPx+MUpZzVAKqcryPL980BNxIWp6VD6oY7aQYz1rXyYzLGNgJw7KQN66eKVkV24EMgWjVthlaRcDvV1SLTBJgMeJDaNrkelKiDexWxbYsDia0XgHaF7ZBAX3goRUAaVg88LfwY4Yoduabt/aTXy+T+4oRPRLRH4ToV6lKRDM8AXsDN9EzWZ4khwTU7KyAXucZRRpMAeUN3UdBb7bAv6SW/ME8BuMB+AJuQlKzx74jX794LvnAN9rAe/9LfD/esf3zwHev6ZTWOBpO5gbI7Ma9t5J+1iBxvCHNYUifyoXbCLWfxLeeMDU7F/i3//kSD6Vf777a/2EP5rbG17VvX4B/AA='),
			this.addDataEntry(dt + 'dialog box', 250, 140, 'Dialog Box',
				'7ZZNj5swEIZ/jY+LwA7Z7bFL2j20VStlpZ5dGMBag5FxEtJf3wE7CeGjok0rraoSRbLHnvF4ntcGwqKiedK8yj+pBCRh7wiLtFLGtoomAikJ9UVC2IZQ6uOf0Pczo0E36ldcQ2mWOFDrsOdyB9ayVQWgJYGU76QhdE0oC3zCHhPBpcp6BgON8ax/bY7S+ddGqxf4KhKToyHAeXXOE3XATheF1zkkrsOlyEpsx5gtaDTkppAXr6oNWTRZWx2vUPHLrvJiVRouStC1pzXEuMlHvRXfwUW0q0dKKt2lw9bdgyMpOs7ZXYDgHvt70EbEXL51uRlVofWQCwPbisftvAMm1HoKKXsR0+5pc8BposyeW8cNo2hxRcbI0MyC6kyO0hMgBaOPOOXgKtnCCi1MPweR5Se3lTPy2hqys++FOzYc+mkZsJEMNo62/ywMon1dlIfM5tjOq+GUk4TUXJB97HqbhwHcUpXQZgA1rtnf8yKu9Pe4MmfTILkRe7iKfwvr1Yj1mK6jgo6iqmGqkr7/EHdq76rCv8kzm3HherwXVYxNV+za4eiuNy+0/X49J8pJf7Wcbv0vSmBa58XvaHi1/F0wOH0qTWswIx7nbSxCFI4QRbyM8e3weo/hz67YkXjiVftbcK06Ad1yzpqTTgbkgpFs3kzJJvwzslkNZMPYX5DNeiSbzx/+S+YGydz/a5LB7uXb0k7vf3r+AA=='),
			this.addDataEntry(dt + 'dialog box', 250, 160, 'Dialog Box',
				'zZZRb5swEMc/jR+LwC5pX9dk68NWtVIq7dmDA6wajGwnIf30O8AECFClyx5KFMn3x3c+3+9sQdg6rx41L7MnFYMk7Dtha62UbUd5tQYpCfVFTNiGUOrjn9AfC2+D5q1fcg2FvcSBtg57LnfQKluVAyoxJHwnLaErQlngE/aQgzE8hYFiobJeG8DYo3QBjNXqDX6L2GYoBDjPZDxWBzRqp5ibDGJncCnSAscRpgsahczmsvcq65B5ldbl8XIVve1KL1KF5aIAbTytIcJdPuiteAcXsV19raTSTTps1Tz4JkHHJd0FCO7Q3oO2IuLym8vNqhLVQyYsbEse1fMOmFDtKaQcREyap84Bp4kifa0dN4yi4qqMkaFaJNVIDtMjIAarjzjl4CpZ0wpbmn4GIs06t5UTuWmF9OTbg8eBYz/fB2zSB08dbv9VWGT7tTCfQ1uCu9wOXU4SEtsz+9VYm/sP6GowuPBw4xfRpf9GlzlNg+RW7GEU/xritxPiU8QODTqK0sBcOX3/Puqrwv/IE6BB9QpVwBj6RRVj8xUbOxzdLeeFrT2s50w56WfL6dZ/UQLTOi1+Q8PR8jfB2RlUSWLATnictnERonCC6PnnFz6HH12yk8aJbuvfTON85qK95uBVZ41zHAUYtFEw20fh/+mj7u7u+oix6/sIzf4Dop0+/L74Cw==')
		];
	
		this.addPalette('mockupContainers', 'Mockup Containers', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));
	};
	
	Sidebar.prototype.addMockupFormsPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
		
		var gn = 'mxgraph.mockup.forms';
		var dt = 'mockup form ';

		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'forms.rrect;rSize=0;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;', 15, 15, 
					'Option 1', 'Checkbox', null, null, this.getTagsForStencil(gn, 'checkbox', dt).join(' ')),
			this.addDataEntry(dt + 'checkbox checkboxes', 150, 120, 'Checkboxes',
				'7VZNb8IwDP01uValKV9XYOOyadN22DmkbhuRNlUSoOzXL00yvtZOSGgMabOEFD/32Yn9GorwtKjnklT5o0iAI3yH8FQKod2qqKfAOYpCliA8Q1EUmh+K7juiPRsNKyKh1OcQIkdYE74ChzhA6S33gNJSLOGNJTo3QA/hicpJIjbGCY2TEJVD4h3CWVaaNTXlQRog1wXfs6omZVFnzXGDQtDlqgpSIQsVSAnUbHgiX9k7+GSu8FRwIe1O8NiaiaSM8wM8tdawga6kYmt4AbXP448IUkPd2SYL+R7NQRSg5dY8svHHbp7ou1aGObAs/6T5/oZEOSDbcfddNwvf+PYh4C9DeKo0E6XBerczjpOmg7Vvx2QSJ8yUPohRawdb45A2hVRFKCuzB+vN4qacKLWv3ht6/yDRwJrBOVkAfxaK2Y7hmXTDOW/qUfvUPWHkCFvnDYO+84800SKJ/uWKiLsVcUMv6F9XBL6mJPrdksC/IwmaA10uRH2iCtncvWTBO1RCrLWpJLbWrpLdcC9VSRiOqP2vuJpKBtdUyaBbJfH/xXErF8f4ByVh3P3no40dfV1+AA=='),
			
			this.createVertexTemplateEntry('shape=ellipse;fillColor=#eeeeee;strokeColor=#999999;gradientColor=#cccccc;html=1;align=left;spacingLeft=4;fontSize=17;fontColor=#666666;labelPosition=right;shadow=0;', 15, 15, 
					'Setting 1', 'Radiobutton', null, null, this.getTagsForStencil(gn, 'radiobutton radio button', dt).join(' ')),
			this.addDataEntry(dt + 'radiobutton radio button group', 150, 120, 'Radiobutton Group',
				'7ZbJboMwEIafhmtEcMhyTdrm0kpVc+jZhQlYMRjZztan72A7C4Eg1LQ5ZSQkzwwztv/PLB6ZZbu5pEX6JmLgHnn2yEwKoe0o282Acy/wWeyRJy8IfLy84OVKtm+yfkEl5LpLQWALNpSvwUZsQOk9dwGlpVjBJ4t1ioG+R6YqpbHYouOjE1OVQuwcylmS4zjC6UFiINUZP1UVZctsl5Tb7WUiWq2L3lLITPWkhAgXPJUL9g2umZ14JriQZiVkYgwzS8b5WXxprKyGaC0V28AHqFMft0WQGnZXZTIhp9EcRAZa7vGWrdt2eUdopfRTYEl6KHP6+lTZQHKsPamOAyd8MwRSg7AArVmeYLBf5+F0xB6sUHAh2oU0YKxVTKQRM9ThLBcZq+I7oOWwLEGpgka4wlfjPQ3KmUWu3UL6I+ef9RwawzinX8DfhWKaibKhtGp2wxQ0Y3IFY1uwt96oF1q/ArGBYXg7wkELwoZH6oGwG0JyT4ZhC0NyG0NqrInhwFgzw6Pef8jQ98eReVfejeHwngyHHb5nNXAXsI5IqrBykUOVRSepwlapSPW413Sa1GWa3K7SqOWkDx5vq9+e9Mk/nnR0T3+FJlf5afwB'),
			
			this.createVertexTemplateEntry(s + 'forms.colorPicker;chosenColor=#aaddff;fillColor=#ffffff;', 40, 40, '', 'Color Picker', null, null, this.getTagsForStencil(gn, 'colorPicker', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'forms.comboBox;' + skcl9 + mxConstants.STYLE_FILLCOLOR + '=#ddeeff;align=left;fillColor2=#aaddff;mainText=;fontColor=#666666;fontSize=17;spacingLeft=3;',
										150, 30, 'Option 1', 'Combo Box', null, null, this.getTagsForStencil(gn, 'comboBox', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'forms.spinner;' + skcl9 + 'spinLayout=right;spinStyle=normal;adjStyle=triangle;fillColor=#aaddff;fontSize=17;fontColor=#666666;mainText=;html=1;overflow=fill;',
										150, 60, 
										'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;">' +
										'<tr>' +
										'<td style="width:85%">100</td>' +
										'<td style="width:15%"></td>' +
										'</tr>' +
										'</table>', 
										'Spinner', null, null, this.getTagsForStencil(gn, 'spinner', dt).join(' ')),
			this.addDataEntry(dt + 'menu bar', 498, 30, 'Menu Bar',
				'7ZY/b4MwEMU/jdcI7PxdQ5N0qTq0UmYUDmzFcMg4Demn7wVbTSIakSWoA5aQ/N5xNn6/ATMR5fXGxKV8wwQ0EysmIoNo3SyvI9Ca8UAlTLwwzgN6GF/fqYZNNShjA4V9pIG7hq9YH8A5zqjsSXujsgb3sFWJlWSETCwrGSd4JBGQSOJKQuJFrFVW0HxH24MhQ9pcX7rK85J5nZ2PO8pxtz+UoxRNXo2MgR198NJ8qG/wi7mNI9Romi8Ri2ZQJVVaX/lpM8j3hwFjob4bSGP5NDaAOVhzoleO/oBUHS/mrk2CyqRvEy7IIK6czn5bL/HSxCf8d9qilfZaUcz/JvEUC+tlOPP6KudpMx4mU2ABj0LhnVDm4jlMxi0mq0TZgcldJvUtjx4QTVqI3kursKgGSl2UQtq1L0zTFqZPRD1A6oREP5zeIM1akLaqOIc/UOqgJATvjdK8RekVdDkw6mI0DifPYkTyci1vaje39h8='),
		
			this.createVertexTemplateEntry(s + 'forms.horSlider;' + skcl9 + flclf + 'sliderStyle=basic;sliderPos=20;handleStyle=circle;fillColor2=#ddeeff;',
										150, 30, '', 'Horizontal Slider', null, null, this.getTagsForStencil(gn, 'horSlider', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s + 'forms.horSlider;' + skcl9 + flclf + 'sliderStyle=basic;sliderPos=20;handleStyle=circle;fillColor2=#ddeeff;direction=north;',
										30, 150, '', 'Vertical Slider', null, null, this.getTagsForStencil(gn, 'horSlider', dt + 'vertical').join(' ')),
			this.addDataEntry(dt + 'list box', 150, 200, 'List Box',
				'7ZZdS8MwFIZ/TW9HlmzO3W7qEBQEBa9De9oG06YkUTd/vadJ3FprZX7MOVigkPMmJx/vEw6N2LxYLjSv8muVgIzYecTmWinre8VyDlJGlIgkYmcRpQS/iF70jA7dKKm4htJuk0B9whOXj+AVLxi7kkEwVqsHuBeJzVEYRmxmcp6oZwwIBgk3OSQh4FJkJfZj3B40Crkt5Carqpcslll93UGh4ofHapAqXZiB1hDjgWf6VrxAWMxvPFdSaXcSNnUNR1IhZUNPXUM9XAa0hWWvIU4KbixAFWD1Cqc8hwvWM8beNJKDyPKQRkkQufFCts7d+IudYPHHdrOO3XfCotGH4LkqbUMn5DR2ntd6WGA4+YSNBoOzmlfaihb9Hi0WNA2SW/EErfV/QnDUIXhpoUBluB+IvIzz2usuhzavE9caO0lIa/im4rEosysXnY3/HBT9KqiwxY0SuDMlqzbvtwyVpgZsB+z6YFuxHvex3lORPLL2WHbB+qSPNfs/xfnXsL+r0UkC4Gp0u/qXqoRDfSOTXbyRSd8bGR3rwR5ZT3+BNYabn24/vflP/go='),
	
			this.createVertexTemplateEntry(s2 + 'forms.pwField;' + skcl9 + 'mainText=;align=left;fillColor=#ffffff;fontColor=#666666;fontSize=17;spacingLeft=3;', 150, 30, '********', 'Password Field', null, null, this.getTagsForStencil(gn, 'pwField', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'forms.splitter;fillColor=#ffffff;' + skcl9, 350, 10, '', 'Horizontal Splitter', null, null, this.getTagsForStencil(gn, 'splitter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'forms.splitter;fillColor=#ffffff;' + skcl9 + mxConstants.STYLE_DIRECTION + '=' + mxConstants.DIRECTION_NORTH + ';', 10, 350, '', 'Vertical Splitter', null, null, this.getTagsForStencil(gn, 'splitter', dt).join(' ')),

			this.addEntry(dt + 'wedge bar', function()
			{
			   	var button1 = new mxCell('Tab 1', new mxGeometry(10, 0, 70, 30), s2 + 'forms.uRect;fontSize=17;fontColor=#666666;align=left;spacingLeft=5;strokeColor=#666666;fillColor=#ffffff;');
			   	button1.vertex = true;
			   	var button2 = new mxCell('Tab 2', new mxGeometry(85, 0, 70, 30), s2 + 'forms.uRect;fontSize=17;fontColor=#ffffff;align=left;spacingLeft=5;strokeColor=#008cff;fillColor=#008cff;');
			   	button2.vertex = true;
			   	var button3 = new mxCell('Tab 3', new mxGeometry(160, 0, 70, 30), s2 + 'forms.uRect;fontSize=17;fontColor=#666666;align=left;spacingLeft=5;strokeColor=#666666;fillColor=#ffffff;');
			   	button3.vertex = true;
				
		   		return sb.createVertexTemplateFromCells([button1, button2, button3], 230, 30, 'Wedge Bar');
			}),
			
			this.createVertexTemplateEntry(s + 'menus_and_buttons.font_style_selector_1;', 136, 31, '', 'Formatting Toolbar 1', null, null, this.getTagsForStencil('mxgraph.mockup.menus_and_buttons', 'font_style_selector_1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'menus_and_buttons.font_style_selector_2;', 235, 31, '', 'Formatting Toolbar 2', null, null, this.getTagsForStencil('mxgraph.mockup.menus_and_buttons', 'font_style_selector_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'menus_and_buttons.font_style_selector_3;', 176, 38, '', 'Formatting Toolbar 3', null, null, this.getTagsForStencil('mxgraph.mockup.menus_and_buttons', 'font_style_selector_3', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'forms.searchBox;' + skcl9 + 'mainText=;fillColor=#ffffff;strokeColor2=#008cff;fontColor=#666666;fontSize=17;align=left;spacingLeft=3;',
										150, 30, 'Search', 'Search Box', null, null, this.getTagsForStencil(gn, 'searchBox', dt).join(' ')),
			this.addDataEntry(dt + 'sign in', 200, 300, 'Sign In',
				'7Vhtb9owEP41+TIJ5DgkLR8HG6jShpBQtc8uubysTowct8B+/RzHQILDFmm4TScsRYrPOft8z3N3sR1vmu3mnGyS7ywE6nhfHW/KGRPVW7abAqUORmnoeF8cjJF8HDy7MOqqUbQhHHLRRQFXCq+EvkAlqQSF2FMtKARnz/AjDUUiBa7jTYqEhGwrO0h2QlIkEOoOoWmcy/e1XB64FCQioyetTTlltovL7Q4ztn5+2QwjxrNiyDmspcETvkp/gZ6sWnjKKOPKEm+smhyJUkpr8kg1KdebAS5gd9EhSqS9MQeWgeB7+clWb7B0CqqchhJI40SreQchKSpBfNQ9+Ve+aBe3u9sz3L0qHYbRQ/4+fif5OindOIlYLrTvXaz7NRcHqtVWohApvKCQSg0jN2Sd5vE3Na6M64QK/isqbhsqmt6IAyUifYXG/G1I6SWWLJUrY3QwSE+zb3YPE7AoKkAYQB/t7IT9qEOoaahomkNbAIQhgCJ6kxu4CbiJybUQuG9BwLWCgGcDAd9A4LGQ0YLRgmRS8PkWgv0JwZENAgQGAX6yJA8ZfIii140OTfB9q/nAb6ODb4MOgQ063Bl0WJKi2DIe3pJBr5LB2LeA/r2B/ifdbtmg59nAdW0QYmwQYvUwX5Q/54t+MMI3GJEz9aN4RobjeejsnBQET0+VvJZcgkNfb+5fGbFvKNT40fbz6F0nXeAmPQZHKl6VHwcS1ggyYzxmpSGnwjHrd+Eo04fiwB8TBTojxejqieMiTdrTiJWyMnCtHPRc1+CJyYkenvQuQ/J2577B2Aoi5jXXArZSUJ3/+hyv3Qo7+j/j884KGVou4ao6/7i81fkPVeevUeZl93TdXn1ev43/DQ=='),
			this.addDataEntry(dt + 'calendar date', 160, 175, 'Calendar',
				'7Zxdc6IwFIZ/DbdOPkDktu62V529cGd6zUoUp2CcSLe6v37Dh7bm0K2dLjk2kRlnIBCF9wnkvMmRgE/L3Z1KN/m9zEQR8O8Bnyopq3at3E1FUQSMrLKAfwsYI/oTsNs39tJmL9mkSqyrcyqwtsLvtHgSbUlbsK32RVewrZR8FA+rrMp1AQ34zTZPM/msN4jeyNJtLrJuIy1Wy7Ven+ufF0oX5FVZvNTa1F9Z7pb15Y5KOX982owWUpXbkVJirk/4Rs1Wf+qDorpC88NTWUjVnAlPmkXvWayK4lX5oll0eXcxQlVi96YgTVGnxp2QpajUXh/y3F1gfcS4FY3kYrXMD9XiqC1Mt23B8lj3RV+90kncLzcHcv+YV/KXlooRRmiII366nue1ljcLua769D5LV9ava1eBd5Lu281Ju/VadNIjetd6P6V52NPEx0V1vCzsph7+u6mfIiFkMm+ael3efQE9HDfrroT+H2STd4ixaBhgUR+w5RXYu8Aoi5GQjQGye+nus4yePsv6dB7oWRYDnX8+uaszR9N5AnR+EO7qHKHpnMD2nLurc4ym8+GJ9UroW+Wu0Ame0BQIPUvdFZridYUUWteZw30hxesMKXStFEdoMxInH4nEB4wAQ4swoJ29kCEbNBgcDwa0qtxzGBEeDGhCkcbTLgZGjAcDOtXIcxgJHgxoZ8eewzADV5s0oOmNfaeB14Uz6IwnvtM4hTG2CAO658RzGBwPBjTYh5bhLY0Ij0aPCffdhcd4NKALP4xHeUsjwaMBbTj13YebAa5NHNCIY2W2XA4OxH4cWnHquxc3bo6JRRrQi1PfzbiZG2aRBvTi1HczHqHR4NCLU9/NeIxHA5px6rsbT/BoQDfOfHfjZoxrEwe049dJcbx+nPfMivvux42bgxKLOKAh935inCPigIbc+9nYGBEHNOTez8cmiDigI79OyGJ2HtCTX6dkEXuPELpy72dlzdvDYjZuCG05990ImneHTRzQl3PfjWCEiMOxXHXjn+5ZJsT5/3T/WARsk5JjSewDUjIDY5uUHMtuH5ASiJdtYnIs731ITJiBgmMZ8UNiMihZTAcO4WDAlx6aGZCSeS/ZpORYCv2AlMxY3CKlCA4cfOlxHIuxuE1KjuXcW4zFbVKCwwxfOxnfZjBuk5Nrafo2o3GbnHpGIC7ZNS0WRC+Q0/HVh6enyiC544vIBggqhpuN0JsvL8Ns9p28K/Mv'),
			this.addDataEntry(dt + 'calendar date', 400, 300, 'Email',
				'7VhLU9swEP41vmacOLyOJQEu9FLa6VnI61igF3qQ0F/fXcmGdJzMtAOmh8QzcbyrfX6fV05cVAu1uXHMtl9NDbKoropq4YwJ+UptFiBlMStFXVTLYjYr8VPMrvesTtNqaZkDHf7GYZYdnpmMkDXXzqis9OFFdkofnHmEn6IOLSqmRXXpW1abNQolCjXzLdSdwKRYabzmWAI4VLRByTcvSyHVZkUtT5Thj9FOGuOUnzDNW+O2IjixagN5WcaFXn3L4nKGqsbosDCSzLG+6jQdqO/aARdgsxeSpOrwuAGjILgXNFl37eHqSUatbKHLSV7nWcd8llevnm/44kUH8W64qwHcD6bVxbx8yHjw/4W9c8AJ6kZIuYVrkw7UuzvxC7ok+7Dvk0totli7TdKyIk3qZMv1Ih3vpG3zJ2VbLFZj0Tgf0HgX7x8IwYMcnJce7gEDYxFwMiDgxgEE7PU4Pu8bn/1cjjZNpwMyv5uDHqSz4VY2FvZnA+wbhzgeH0gfPlE7SB1tos4HrC4WBz1R0/Lznk0XA/CPE/QhE7SLxNFGaFoOaLw89CGaf95zaTo9TtFIU7SDxfGmaPh+4dY4UGRifaTvOnWNxIpAyTBFMcO4JTfaI/QQIq2yWljhBU+/8EuQorPyyDDFIKWIXhkSAyibYgrNRS3qqCl0pJNk95ifrEOfmyTFVppRGimeIpvg1Q9aBy1USk4mIgvPqGQqZ3+KwuOXNkhgJCPYgOMisCCMppRSMsVNnzcbYxt9NSmdsMmRTiz1rbAL0yOA5QSqZ5lTsRioXuFiqrsHT1A2B9ZBC7oGl7BMymcjo8WCIJWecCvBexI53tJvFCRQIp6auBKMzDSVn281VERHZVxtONgAMTOWcDWcM+DJg0crahayd0LAOiNqulEzW5mJVBiP0rKMIQVpGiSX5Bo8uGynjMwFswy9SBD7Vx6jmhzkpkDbgeBMfulCBGNRu25FgDsMQ5nXWPQH7fpnw6fuvNy1X/T/yv9hwyjodWP/rjOt/fEq9Dc=')
		];			
		
		this.addPalette('mockupForms', 'Mockup Forms', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addMockupGraphicsPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.graphics';
		var dt = 'mockup graphics ';

		var fns =
		[
			this.createVertexTemplateEntry(s + 'graphics.barChart;' + flclf +  skclN + 'strokeColor2=none;strokeColor3=#666666;fillColor2=#008cff;fillColor3=#dddddd;',
					400, 200, '', 'Bar Chart', null, null, this.getTagsForStencil(gn, 'barChart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'graphics.columnChart;' + flclf +  skclN + 'strokeColor2=none;strokeColor3=#666666;fillColor2=#008cff;fillColor3=#dddddd;',
					400, 200, '', 'Column Chart', null, null, this.getTagsForStencil(gn, 'columnChart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'graphics.lineChart;' + flclf +  skclN + 'strokeColor2=#666666;strokeColor3=#008cff;strokeColor4=#dddddd;',
					400, 200, '', 'Line Chart', null, null, this.getTagsForStencil(gn, 'lineChart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'graphics.pieChart;' +  mxConstants.STYLE_STROKECOLOR + '=#008cff;parts=10,20,35;partColors=#e0e0e0,#d0d0d0,#c0c0c0,#b0b0b0,#a0a0a0;strokeWidth=2;',
					200, 200, '', 'Pie Chart', null, null, this.getTagsForStencil(gn, 'pieChart', dt).join(' ')),
			
			this.createVertexTemplateEntry(s + 'graphics.simpleIcon;strokeColor=#999999;fillColor=#ffffff;', 
					50, 50, '', 'Icon Placeholder', null, null, this.getTagsForStencil(gn, 'simpleIcon', dt + 'icon placeholder').join(' ')),
			this.addDataEntry(dt + 'icon grid placeholder', 200, 200, 'Icon Grid',
				'7ZdRa8MgEMc/ja8licu6Pm7pVgYb7G3PNrFRqjWobdNvv4vadYUVRpv5ZCDg/e9OzvuRCyJcyX6hScfeVUMFws8IV1op61eyr6gQqMh4g/AcFUUGLypeLnhz5806ounG/iWh8Ak7IrbUK14w9iCCsKPa8pqIN7Kk4kMZbrnagGuprFUS4SfDSKP2oGRgNMQw2gSDCN4OoTVUQzUIzEo44jyH5XHbxxBjVTfsZbVa00/eWBbiYPduqET27dCliVT1ettNnMFrMzFcdoK+1kNNIb1SQmlXPJ65BzwrLsQPfeUe0MP5oRjaX+yhk0IDF1RJavUBQvahTPCWvs0Zo7xl9lwjxtvtd+YJCCwCk9/54MTnej4hYVr6jAi47hKum3HlRxAReJWJ1/W8DtE/r/uEa7RpGJ/eNNEbbzjGx/eQ8N08K2P+22aJ19jDMia+PEv8Rh+X/wgQzNO13fnObvVf'),
	
			this.createVertexTemplateEntry(s + 'graphics.bubbleChart;' + flclf +  skclN + 'strokeColor2=none;strokeColor3=#666666;fillColor2=#008cff;fillColor3=#dddddd;',
										400, 200, '', 'Bubble Chart', null, null, this.getTagsForStencil(gn, 'bubbleChart', dt + 'bubble chart').join(' ')),
			this.addDataEntry(dt + 'gauge', 100, 100, 'Gauge',
				'zZXdT8IwEMD/mr6S0jqVRxnKiya8GJ/LemwN3bp0BcZ/760tXwKRGEGbLblv7n49MsLTsh1bURdvRoIm/Jnw1BrjglS2KWhNGFWS8BFhjOJL2MsZb997aS0sVO6SBBYSlkIvIFiCoXFrHQ1LsE5lQr+KKeiJaZRTpkLX1DhnSsKHTSGkWaGFoiJFU4CMitAq70Iz7AYsGgpX4oijPoqbsk8xxpm6q+WsmcOHkq6IcVi97jop27yj1CtNNl/UPa+orOnlYpGjfzhTWqdGG+u75jN/thX3PAN/0OMzcSA0s6SLxG5CYBMip1MpsQZLUZYSYCMPBlnma/sKnkvISLuHDysAqfd/ktLHkBBp4+jQnr0xb4rXNQZTgrNrDFlFKF0EDbdKC1B54b4YRWiG5dvc3QKgEHfg9D7wo31IJ+8kwcYTkoyOduPkdf1gGb67ZFFlRQdzODOV2wN778+lYNlpsDEBJ/QZ66hGmnvYkxPU2S9AvzuCTv+e9KaIhpm7Mnh6AP4huRn45Aj89k/0H9DbMO012fNbsUd191XzvoOP3ic='),
			
			this.createVertexTemplateEntry(s + 'graphics.plotChart;' + flclf +  mxConstants.STYLE_STROKECOLOR + '=none;strokeColor2=#aaaaaa;strokeColor3=#666666;fillColor2=#99aaff,#0022ff,#008cff;',
										400, 200, '', 'Plot Chart', null, null, this.getTagsForStencil(gn, 'plotChart', dt + 'plot chart').join(' ')),
			this.addDataEntry(dt + 'gantt chart', 600, 300, 'Gantt Chart',
				'7Zxdc6IwGIV/DbcOJBH1snVrr3rlzvSakSiMKA7Qre6v3wDxi/d1daYkGSFOO4XQIJynOckhqQ6dbvbvWbCLPtKQJw59c+g0S9Oi3trspzxJHOLGoUN/OYS44tshsxtHveqouwsyvi0eqUDqCn+C5IvXJXVBXhwSWZAXWbrmn3FYRKLAc+hrHgVh+i12XLETBnnEQ7kTJPFqK7YX4u15JgqiYpOca+3KU272q/J2B5t0sf7aDaqdeJEPsowvxDW/ZvP4L5fnq997miZpVl0MnVQvcUReN88Kvr9571WRvPF3nm54kR3Er3zLexFHfbfWx414vIpkNXosDPK6YHWqe5ZSbEg1cWUpoix9EnGX6ba4KPer16Oik7uiE0Rz1oLkDEj+O8jXPdZ8f633BQKmCMEQIJgXQVZYBj5k4FFFEHwA4W25TC0FUWECMQwVURgBCmU7nIkvT/4krscsk5PYlz2Eh0AhLUAZQygjCwVCYUPEr7CW0gaUCYDyYQmcmsXhZieO9R9t8Dg2vsuBlAVCRuaAeADIpwVyimkGgMDcbFsIodQcEBi3ZxYI9c0BgWF8boHQiTkgSDS3QBgxBwTGdDvsPQcPA0BgYredOmFjc0BgWrfDXjL0zAGBSd22EDI0l9SP57DD3isg5pI6gUm9xzyk/tgDXmwC6jRJ8iMCMJr3mMCNh4kIEV8ZEGwmvO9Ams+utAKB0dwCaT4q0QoERnMLpJnMtQKB0dwCaQZBrUBgNLdAmrlDKxAYzT1jRILtIioF1j2GVZUhkJRdrWNzOypxY5nabcXR0NDGWk0Yo/G1Ou7YoS/l0M19MfesVgeL+6MhdPVaKzBghGZu1Gm1vclduVWtvaEwLpvrWnUYObIQU5WRU5h8pZF3VGLcyBHFlRk5jLbWyO+wUGfkMNb2zcgRuZUZOcys5v7dRIeRjzUaOTIzXBt5RyXGjRxRXJmRIwu1rZH/n4U6I4eBtG9GjsitysiPTepS7W5qLbX1XH1OzmC4lE7eUY1xJ8ckV2XlDEmY1srvwFDm5Qxm0r55Oaa3MjN/qrnWbbrlJYs4SS5YBEEYLpct+VBjeScbPvan77XB4qmmWfWz8CELrE9oBcVTTbBqQNGYWx0jzQL7pIpWWDzV3Kp6FpQ1uwsIY9QOC7F7/qiX6tjVJ8H8Aw=='),
		
			this.createVertexTemplateEntry(s + 'misc.map;', 250, 250, '', 'Map', null, null, this.getTagsForStencil(gn, 'map', dt).join(' '))
		];
		
		this.addPalette('mockupGraphics', 'Mockup Graphics', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addMockupMarkupPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.markup';
		var dt = '';
		
		this.addPaletteFunctions('mockupMarkup', 'Mockup Markup', false,
		[
			this.createVertexTemplateEntry(s + 'markup.curlyBrace;' + skcl9, 
					100, 20, '', 'Horizontal Curly Brace', null, null, this.getTagsForStencil(gn, 'curlyBrace', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_LABEL_POSITION + '=right;' + mxConstants.STYLE_ALIGN + '=left;strokeWidth=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.mockup.markup.curlyBrace;html=1;shadow=0;dashed=0;' + skcl9 + mxConstants.STYLE_DIRECTION + '=' + mxConstants.DIRECTION_NORTH + ';', 
					20, 100, '', 'Vertical Curly Brace', null, null, this.getTagsForStencil(gn, 'curlyBrace', dt + 'vertical').join(' ')),
			this.createVertexTemplateEntry(s + 'markup.line;' + skcl9, 
					100, 20, '', 'Horizontal Line', null, null, this.getTagsForStencil(gn, 'line', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s + 'markup.line;' + skcl9 + mxConstants.STYLE_DIRECTION + '=' + mxConstants.DIRECTION_NORTH + ';', 
					20, 100, '', 'Vertical Line', null, null, this.getTagsForStencil(gn, 'line', dt + 'vertical').join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_SHAPE + '=mxgraph.mockup.markup.scratchOut;shadow=0;dashed=0;html=1;' + skcl9 + 'strokeWidth=4;',
					200, 100, '', 'Scratch Out', null, null, this.getTagsForStencil(gn, 'scratchOut', dt + 'scratch out').join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_SHAPE + '=mxgraph.mockup.markup.redX;fillColor=#ff0000;html=1;shadow=0;' + skclN, 
					200, 100, '', 'Red X', null, null, this.getTagsForStencil(gn, 'redX', dt + 'red').join(' '))
		]);
	};
	
	Sidebar.prototype.addMockupMiscPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.misc';
		var dt = 'mockup ';
		var miscCommon = skcl9 + mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;fillColor=#ffffff;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=2;html=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.mockup.';

		var fns =
		[
			this.createVertexTemplateEntry(s + 'misc.help_icon;', 
					32, 32, '', 'Help Icon', null, null, this.getTagsForStencil(gn, 'help_icon', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.playbackControls;fillColor=#ffffff;' + skcl9 + 'fillColor2=#99ddff;strokeColor2=none;fillColor3=#ffffff;strokeColor3=none;',
					250, 30, '', 'Playback Controls', null, null, this.getTagsForStencil(gn, 'playbackControls', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.progressBar;fillColor=#cccccc;' + skclN + 'fillColor2=#99ddff;barPos=80;', 200, 20, '', 'Progress Bar', null, null, this.getTagsForStencil(gn, 'progress bar', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.shoppingCart;' + skcl9, 
					50, 50, '', 'Shopping Cart', null, null, this.getTagsForStencil(gn, 'shopping cart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.rating;' + skcl9 + mxConstants.STYLE_FILLCOLOR + '=#ffff00;emptyFillColor=#ffffff;grade=4;ratingScale=5;ratingStyle=star;',
					225, 30, '', 'Rating', null, null, this.getTagsForStencil(gn, 'rating', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.mail2;fillColor=#ffffff;' + skcl9, 100, 60, '', 'Mail', null, null, this.getTagsForStencil(gn, 'mail', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.volumeSlider;barPos=80;fillColor=#cccccc;' + skcl9 + 'fillColor2=#ddeeff;', 
					250, 30, '', 'Volume Slider', null, null, this.getTagsForStencil(gn, 'volume slider', dt).join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.editIcon;', 
					50, 50, '', 'Edit Icon', null, null, this.getTagsForStencil(gn, 'editIcon', dt + 'edit icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.printIcon;', 
					50, 50, '', 'Print Icon', null, null, this.getTagsForStencil(gn, 'printIcon', dt + 'print icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.shareIcon;', 
					50, 50, '', 'Share Icon', null, null, this.getTagsForStencil(gn, 'shareIcon', dt + 'share icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.trashcanIcon;', 
					50, 50, '', 'Trashcan Icon', null, null, this.getTagsForStencil(gn, 'trashcanIcon', dt + 'trashcan icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.copyrightIcon;', 
					25, 25, '', 'Copyright', null, null, this.getTagsForStencil(gn, 'copyrightIcon', dt + 'copyright icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.registeredIcon;', 
					25, 25, '', 'Registered', null, null, this.getTagsForStencil(gn, 'registeredIcon', dt + 'registered icon').join(' ')),
			this.createVertexTemplateEntry(miscCommon + 'misc.volumeIcon;', 
					25, 25, '', 'Volume', null, null, this.getTagsForStencil(gn, 'volumeIcon', dt + 'volume icon').join(' ')),
			this.createVertexTemplateEntry(s2 + 'misc.ruler2;dx=100;rulerOrient=down;unitSize=10;fillColor=#ffffff;fontColor=#999999;spacingLeft=96;align=left;verticalAlign=middle;spacingBottom=10;spacingTop=0;spacingRight=0;spacing=0;' + skcl9, 
					350, 30, '1', 'Horizontal Ruler', null, null, this.getTagsForStencil(gn, 'ruler', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s2 + 'misc.ruler2;dx=100;rulerOrient=up;unitSize=10;fillColor=#ffffff;fontColor=#999999;spacingLeft=96;align=left;verticalAlign=middle;spacingBottom=0;spacingTop=10;spacingRight=0;spacing=0;' + skcl9, 
					350, 30, '1', 'Horizontal Ruler', null, null, this.getTagsForStencil(gn, 'ruler', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s2 + 'misc.ruler2;dx=100;rulerOrient=down;unitSize=10;fillColor=#ffffff;fontColor=#999999;spacingLeft=96;align=left;verticalAlign=middle;spacingBottom=10;spacingTop=0;spacingRight=0;rotation=-90;spacing=0;' + skcl9, 
					350, 30, '1', 'Vertical Ruler', null, null, this.getTagsForStencil(gn, 'ruler', dt + 'horizontal').join(' ')),
			this.createVertexTemplateEntry(s2 + 'misc.ruler2;dx=100;rulerOrient=up;unitSize=10;fillColor=#ffffff;fontColor=#999999;spacingLeft=96;align=left;verticalAlign=middle;spacingBottom=0;spacingTop=10;spacingRight=0;rotation=-90;spacing=0;' + skcl9, 
					350, 30, '1', 'Vertical Ruler', null, null, this.getTagsForStencil(gn, 'ruler', dt + 'horizontal').join(' ')),
			this.addDataEntry(dt + 'revision table', 400, 75, 'Revision Table',
				'7Zddb4IwFIZ/DbemFD/mpUN0XGwuYrbskkCFxtaSUifu16+03dCAziyyZAkkJD3n9ND2fcIbsByXFnMeZukjixGxHM9yXM6Y0CNauIgQCwIcW87UghDI24KzM1VbVUEWcrQV1zRA3fAekh3SGZ3IxYGYRC4426BXHItUJmzLuc/TMGZ7GQAZxGGeotgEIcHJVo4juTziMpEKSqqurHwkLZLyuD3Kos0u61GcRz3OUST3e88D/IHMs/S6LiOMq404Q3XJitkz4gIVZ8+tUubQc8QoEvwgp+zNOWS1D7Q2IEU4SU3baKBzYa7j5Lu1UlEOjJDNojo1UZfeix/4iyeZffCD1WL59g9kXrOtMBPtkYmP5o3VdS0O+Dsc8AY4+k04Ov2V/odTmY9wDFqiMajRmE5WXodD4ShOtT9Px24Lz7COxwvcpf+8UvbVUaooQfAjJtiWp41qmCYdnGNH+3o//sDR7mosbLnSrPwMmEFg9zswF7ytgVNr3jauexvKS3khoCzGayxV71hdcLgGWLdyOBlWfz2qdvJT9Ak='),
			this.addDataEntry(dt + 'status bar', 500, 30, 'Status Bar',
				'7VfRTsIwFP2aPUq6liF7FZUXfcLE57pdtsZuXdoi4Nd713UCDnRETNC4hKT33N2195zTdQRsUqymmlf5vUpBBuwmYBOtlG1GxWoCUgaUiDRg1wGlBH8BvT2QDV2WVFxDafsU0KbghcsFNEgDGLuWHjBWq2d4FKnNEQgDdmVynqolBgSDlJscUh9wKbISxwlODxqB3BZyU1XVjyxWWd3uoFDJ86IaFMIkA60hwfVe6Zl4Bf+sZt6Jkkq7hbDYXZiZCym38Lm7EPe9gLawOsiHgzwZU1AFWL3GW5a+P8xGpOGM5CCy3Jcxj3HTxNl76YZdHHiC95PNOmTPLLcLgxiu2J4F81GH+VKVUJOuSuvvCSMf9xAnTQGcOO0CJczr+UzFE1Fmdy5ys/ZSj+5XzxdETcF6J9pSNoyjrrL0BMoOO8o+OEHJeWynXy0qJV/Kum/DnkLW6JCs7F/W78rKQvKVrOEP7dbReRx6vEzymvpTsDmMdzdJS913aLrsQZNvDwtFZeCDpbwbOwc5IePE+UyDEa/8SbZH/hZxvTgZfcrJBd112EXruC2P0R96c4z/oMVGp7dY3N9iUhxppl4tj49yUPcdtc8/4fH+wXDzze9yO38J3gA='),

			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#ccccff;fillColor3=#0000ff;strokeColor=#000066;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#ffff00;fillColor3=#888800;strokeColor=#999900;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' ')),
			this.createVertexTemplateEntry(s3 + 'misc.pin;fillColor2=#ffa500;fillColor3=#885000;strokeColor=#997000;',
										10, 25, '', 'Pin', null, null, this.getTagsForStencil(gn, 'pin', dt).join(' '))
		];
		
		this.addPalette('mockupMisc', 'Mockup Misc', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addMockupNavigationPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.navigation';
		var dt = 'mockup navigation ';
		var miscCommon = skcl9 + mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;fillColor=#ffffff;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=2;html=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.mockup.';

		var fns =
		[
			this.addDataEntry(dt + 'breadcrumb', 300, 30, 'Breadcrumb',
				'7VaxboMwEP0ar8jYlGQObbK0U4fOFhhsxWBknIT063uAC40CUoeAGGIJyXfnO87v+VlGNMrrg2Gl+NAJV4i+IRoZrW03y+uIK4UIlgmir4gQDB8i+4mo30ZxyQwv7H8SSJdwZurEO887u3IDLleqslflIpU1+si/ZGIFOHxEd5Vgib6AgcFIWCV44gymZFbAPIY+oBzdCZurIatsSuZ11uzby3V8PJVewc4yY1bqwmNFLHSTlerCfsrvZrW/cXakVRODjmjYjt91rtPmF25X3FheTyLTuhwsB65zbs0VllzcBiEaduBhwWUmXBZ1PlZ1dtZnDjDDxCE9jjq9Qx2RMLN946sBnQT3oLN2PBj0+hbwPxyQmTgIJk8+WRkJi518l7C9J2EuIbw8hTDOgR8sp4RwUgl0ZSwsrQR/5D6aSwqbpxTGSejP/QJS2E5KIVgZC2NSwHgbp+lMLIxcSA+SApjDg7eN3byHfwA='),

			this.createVertexTemplateEntry(s2 + 'navigation.stepBar;strokeColor=#c4c4c4;textColor=#666666;textColor2=#008cff;mainText=,,+,;textSize=17;fillColor=#666666;overflow=fill;fontSize=17;fontColor=#666666;', 300, 50, 
				'<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" style="font-size:1em;">' +
				'<tr height="0%"><td width="25%">Layer 1</td><td width="25%">Layer 2</td><td width="25%" style="color:#008cff;">Layer 3</td><td width="25%">Layer 4</td></tr><tr height="100%"><td/></tr></table>', 
				'Step Bar', null, null, this.getTagsForStencil(gn, 'stepBar', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.coverFlow;strokeColor=#999999;fillColor=#ffffff;',
				400, 200, '', 'Cover Flow', null, null, this.getTagsForStencil(gn, 'coverFlow', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.scrollBar;fillColor=#ffffff;' + skcl9 + 'barPos=20;fillColor2=#99ddff;strokeColor2=none;',
				200, 20, '', 'Horizontal Scroll Bar', null, null, this.getTagsForStencil(gn, 'scrollBar', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.scrollBar;fillColor=#ffffff;' + skcl9 + 'barPos=20;fillColor2=#99ddff;strokeColor2=none;direction=north;',
				20, 200, '', 'Vertical Scroll Bar', null, null, this.getTagsForStencil(gn, 'scrollBar', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'navigation.pagination;linkText=;fontSize=17;fontColor=#0000ff;fontStyle=4;',
				350, 30, '<< Prev 1 2 3 4 5 6 7 8 9 10 Next >>', 'Pagination', null, null, this.getTagsForStencil(gn, 'pagination', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.pageControl;fillColor=#999999;strokeColor=#ddeeff;',
				100, 30, '', 'Page Control', null, null, this.getTagsForStencil(gn, 'pageControl', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'navigation.mapNavigator;fillColor=#ffffff;fillColor2=#99ddff;strokeColor2=none;strokeColor3=#ffffff;' + skcl9,
				60, 100, '', 'Map Navigator', null, null, this.getTagsForStencil(gn, 'mapNavigator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.loading_circle_1;', 90, 90, '', 'Wheel Throbber 1', null, null, this.getTagsForStencil(gn, 'loading_circle_1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'misc.loading_circle_2;', 90, 90, '', 'Wheel Throbber 2', null, null, this.getTagsForStencil(gn, 'loading_circle_2', dt).join(' '))
		];	
			
		this.addPalette('mockupNavigation', 'Mockup Navigation', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addMockupTextPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s2 =mxConstants.STYLE_STROKEWIDTH + '=1;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;strokeWidth=1;' + mxConstants.STYLE_SHAPE + "=mxgraph.mockup.";

		// Space savers
		var skcl6 = mxConstants.STYLE_STROKECOLOR + '=#666666;';
		var skcl9 = mxConstants.STYLE_STROKECOLOR + '=#999999;';
		var flclf = mxConstants.STYLE_FILLCOLOR + '=#ffffff;';
		var skclN = mxConstants.STYLE_STROKECOLOR + '=none;';
		var sb = this;
	
		var gn = 'mxgraph.mockup.text';
		var dt = 'mockup text ';
		var miscCommon = skcl9 + mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;fillColor=#ffffff;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=2;html=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.mockup.';
		var loremText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?';

		var fns =
		[
			this.createVertexTemplateEntry('shape=rectangle;strokeColor=none;fillColor=none;linkText=;fontSize=17;fontColor=#0000ff;fontStyle=4;html=1;align=center;', 
					150, 30, 'Link', 'Link', null, null, this.getTagsForStencil(gn, 'link', dt).join(' ')),
			this.addDataEntry(dt + 'horizontal button bar', 500, 25, 'Horizontal Button Bar',
				'7ZZdb4MgFIZ/DbcGoR+71m292tUudk30VExRDNLV7tfvFKi6raZLujVbUhITzns8R3ifGCA8rbqVEY180jkowh8IT43W1s+qLgWlCKNlTvg9YYziQ9jjRDZ2WdoIA7X9TgHzBa9CbcErXmjtXgWhtUZv4KXMrUQhJjxppcj1DgOKQS5aCXkIhCqLGucZfh4MCtJWaqhqDi2rrjhsN6p0ttk2kYXORsZAhutNzHP5BqHXulQq1Uobtwy+duPQx61nlFm4gZmwFzDYc9IPJwUzVqArsGaPr+zC/jA7p94zKqEsZChjc6+J1sdFXzq4i5Ng8Gmz+Rezk621ukbtD9muaxvCeBnikdkUh8MwxlPrGi4nw06TORYcCYxI9dpPk5pNk+I3UmdI4Q90PVLzaVKzG6kzpPjyiv/UYppU/F9I9YfQp8OJ0rvsxOEUGF5C6hfIYDhcMFzuw/3jHQ=='),
			
			this.createVertexTemplateEntry(s2 + 'text.callout;linkText=;textSize=17;textColor=#666666;callDir=NW;callStyle=line;fontSize=17;fontColor=#666666;align=left;verticalAlign=top;' + skcl6,
					200, 100, 'Callout', 'Callout', null, null, this.getTagsForStencil(gn, 'callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.callout;linkText=;textSize=17;textColor=#666666;callDir=NE;callStyle=line;fontSize=17;fontColor=#666666;align=right;verticalAlign=top;' + skcl6,
					200, 100, 'Callout', 'Callout', null, null, this.getTagsForStencil(gn, 'callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.callout;linkText=;textSize=17;textColor=#666666;callDir=SW;callStyle=line;fontSize=17;fontColor=#666666;align=left;verticalAlign=bottom;' + skcl6,
					200, 100, 'Callout', 'Callout', null, null, this.getTagsForStencil(gn, 'callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.callout;linkText=;textSize=17;textColor=#666666;callDir=SE;callStyle=line;fontSize=17;fontColor=#666666;align=right;verticalAlign=bottom;' + skcl6,
					200, 100, 'Callout', 'Callout', null, null, this.getTagsForStencil(gn, 'callout', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.stickyNote;fontColor=#666666;mainText=;fontSize=17;whiteSpace=wrap;',
					200, 200, 'Note Line 1\nNote Line 2\nNote Line 3', 'Sticky Note', null, null, this.getTagsForStencil(gn, 'stickyNote', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.bulletedList;textColor=#666666;mainText=,,,,;textSize=17;bulletStyle=none;' + skclN + mxConstants.STYLE_FILLCOLOR + '=none;align=left;verticalAlign=top;fontSize=17;fontColor=#666666;',
					150, 135, '-Line 1\n-Line 2\n-Line 3\n-Line 4', 'Bulleted List', null, null, this.getTagsForStencil(gn, 'bulletedList', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.textBox;fillColor=#ffffff;fontColor=#666666;align=left;fontSize=17;spacingLeft=4;spacingTop=-3;' + skcl6 + 'mainText=',
					150, 30, 'Line 1', 'Text Box', null, null, this.getTagsForStencil(gn, 'textBox', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.captcha;fillColor=#ffffff;fontColor=#666666;fontSize=25;' + skcl6 + 'mainText=',
					150, 50, 'fG2yQ23', 'Captcha', null, null, this.getTagsForStencil(gn, 'captcha', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'text.alphanumeric;linkText=;html=1;fontStyle=4;fontSize=17;fontColor=#0000ff;',
					450, 50, '0-9 A B C D E F G H I J K L M N O P Q R S T U V X Y Z', 'Alphanumeric', null, null, this.getTagsForStencil(gn, 'alphanumeric', dt).join(' ')),
			this.createVertexTemplateEntry('text;spacingTop=-5;fillColor=#ffffff;whiteSpace=wrap;html=1;align=left;fontSize=12;fontFamily=Helvetica;fillColor=none;strokeColor=none;', 
					250, 470, loremText, 'Paragraph of Text', null, null, this.getTagsForStencil(gn, 'peragraph of text', dt).join(' ')),
			
			this.addEntry(dt + 'table', function()
			{
			    var classCell = new mxCell('<table cellpadding="4" cellspacing="0" border="1" style="font-size:1em;width:100%;height:100%;"><tr><th>Header 1</th><th>Header 2</th></tr>' +
			    		'<tr><td>row 1, cell 1</td><td>row 1, cell 2</td></tr><tr><td>row 2, cell 1</td>' + 
			    		'<td>row 2, cell 2</td></tr></table> ', new mxGeometry(0, 0, 180, 80),
						'verticalAlign=top;align=left;overflow=fill;fillColor=#ffffff;fontSize=12;fontFamily=Helvetica;html=1');
		    	classCell.vertex = true;
				
		   		return sb.createVertexTemplateFromCells([classCell], classCell.geometry.width, classCell.geometry.height, 'Table');
			})
		];
		   	
	    this.addPalette('mockupText', 'Mockup Text', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
