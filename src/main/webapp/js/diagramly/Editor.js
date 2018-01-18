/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
(function()
{
	/**
	 * Specifies the app name. Default is document.title.
	 */
	Editor.prototype.appName = 'draw.io';

	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.closeImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/delete.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAApVBMVEUAAAD////k5OT///8AAAB1dXXMzMz9/f39/f37+/v5+fn+/v7///9iYmJaWlqFhYWnp6ejo6OHh4f////////////////7+/v5+fnx8fH///8AAAD///8bGxv7+/v5+fkoKCghISFDQ0MYGBjh4eHY2Njb29tQUFBvb29HR0c/Pz82NjYrKyu/v78SEhLu7u7s7OzV1dVVVVU7OzsVFRXAv78QEBBzqehMAAAAG3RSTlMAA/7p/vz5xZlrTiPL/v78+/v7+OXd2TYQDs8L70ZbAAABKUlEQVQoz3VS13LCMBBUXHChd8iukDslQChJ/v/TchaG4cXS+OSb1c7trU7V60OpdRz2ZtNZL4zXNlcN8BEtSG6+NxIXkeRPoBuQ1cjvZ31/VJFB10ISli6diYfH8iYO3WUNCcNlB0gTrXOtkxTo0O1aKKiBBMhhv2MNBQKoiA5wxlZo0JDzD3AYKbWacyj3fs01wxey0pyEP+R8pWKWXoqtIZ0DDg5pbki9krEKOa6LVDQsdoXEsi46Zqh69KFz7B1u7Hb2yDV8firXDKBlZ4UFiswKGRhXTS93/ECK7yxnJ3+S3y/ThpO+cfSD017nqa18aasabU0/t7d+tk0/1oMEJ1NaD67iwdF68OabFSLn+eHb0+vjy+uk8br9fdrftH0O2menfd7+AQfYM/lNjoDHAAAAAElFTkSuQmCC';

	/**
	 * 
	 */
	Editor.plusImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/plus.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDdCMTdENjVCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDdCMTdENjZCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowN0IxN0Q2M0I4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowN0IxN0Q2NEI4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtjrjmgAAAAtSURBVHjaYvz//z8DMigvLwcLdHZ2MiKLMzEQCaivkLGsrOw/dU0cAr4GCDAARQsQbTFrv10AAAAASUVORK5CYII=';
	
	/**
	 * 
	 */
	Editor.spinImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/spin.gif' : 'data:image/gif;base64,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';

	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.tweetImage = IMAGE_PATH + '/tweet.png';

	/**
	 * Used in the GraphViewer lightbox.
	 */
	Editor.facebookImage = IMAGE_PATH + '/facebook.png';

	/**
	 * Blank 1x1 pixel transparent PNG image.
	 */
	Editor.blankImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

	/**
	 * Blank 1x1 pixel transparent PNG image.
	 */
	Editor.hiResImage = (mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA+CAMAAACLMWy1AAAAh1BMVEUAAABMTExERERBQUFBQUFFRUVAQEBCQkJAQEA6OjpDQ0NKSkpBQUFBQUFERERERERBQUFCQkJCQkJCQkJJSUlBQUFCQkJDQ0NDQ0NCQkJDQ0NBQUFBQUFCQkJBQUFCQkJCQkJDQ0NCQkJHR0dBQUFCQkJCQkJAQEBCQkJDQ0NAQEBERERCQkIk1hS2AAAAKnRSTlMAAjj96BL7PgQFRwfu3TYazKuVjRXl1V1DPCn1uLGjnWNVIgy9hU40eGqPkM38AAACG0lEQVRYw+2X63KbMBCFzwZblgGDceN74muatpLe//m6MHV3gHGFAv2RjM94MAbxzdnVsQbBDKwH8AH8MDAyafzjqYeyOG04XE7RS8nIRDXg6BlT+rA0nmtAPh+NQRDxIASIMG44rAMrGunBgHwy3uUldxggIStGKp2f+DQc2O4h4eQsX3O2IFB/oEbsjOKbStnjAEA+zJ0ylZTbgvoDn8xNyn6Dbj5Kd4GsNpABa6duQPfSdEj88TgMAhKuCWjAkgmFXPLnsD0pWd3OFGdrMugQII/eOMPEiGOzqPMIeWrcSoMCg71W1pXBPvCP+gS/OdXqQ3uW23+93XGWLl/OaBb805bNcBPoEIcVJsnHzcxpZH86u5KZ9gDby5dQCcnKqdbke4ItI4Tzd7IW9hZQt4EO6GG9b9sYuuK9Wwn8TIr2xKbF2+3Nhr+qxChJ/AI6pIfCu4z4Zowp4ZUNihz79vewzctnHDwTvQO/hCdFBzrUGDOPn2Y/F8YKT4oOATLvlhOznzmBSdFBJWtc58y7r+UVFOCQczy3wpN6pegDqHtsCPTGvH9JuTO0Dyg8icldYPk+RB6g8Aofj4m2EKBvtTmUPD9xDd1pPcSReV2U5iD/ik2yrngtvvqBfPzOvKiDTKTsCdoHZJ7pLLffgTwlJ5vJdtJV2/jiAYaLvLGhMAEDO5QcDg2M/jOw/8Zn+K3ZwJvHT7ZffgC/NvA3zcybTeIfE4EAAAAASUVORK5CYII=' : IMAGE_PATH + '/img-hi-res.png';

	/**
	 * Blank 1x1 pixel transparent PNG image.
	 */
	Editor.loResImage = (mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA+CAMAAACLMWy1AAAAS1BMVEVAQEAAAAA1NTVBQUFDQ0NDQ0NFRUVERERBQUFBQUFBQUFAQEBBQUFBQUFCQkJCQkJCQkJBQUFCQkJDQ0NDQ0NCQkJCQkJCQkJGRkb5/XqTAAAAGXRSTlP+AAWODlASCsesX+Lc2LyWe3pwa1tCPjohjSJfoAAAAI1JREFUWMPt1MkKhTAMRuG0anvneXr/J71nUypKcdqI/N8yhLMKMZE1CahnClDQzMPB44ED3EgeCubgDWnWQMHpwTtKwTe+UHD4sJ94wbUEHHFGhILlYDeSnsQeabeCgsPBgB0MOZZ9oGA5GJFiJSfUULAfjLjARrhCwX7wh2YCDwVbwZkUBKqFFJRN+wOcwSgR2sREcgAAAABJRU5ErkJggg==' : IMAGE_PATH + '/img-lo-res.png';

	/**
	 * Only needed in browsers with SVG support for export via lightbox toolbar. 
	 */
	Editor.cameraLargeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAA/BJREFUWAnFl0uIjWEYx885buPSuGwmSYwtwsY1ikKSNYNclmQnadgrZSPlsnBLSlaGBdNYKY0Vdi4L4zYzIqxGxmXG//d+7//0+uY7nWMiT/2/53mf+3v7vnNKpf9M5UbrDw8Pj4m+wzmeT1FBUS6Xf+YNox6reMONukijMXUTM3NmI75PyXcJPwRWg5kS7xysDLNmfEUxpx2rceNE50IlYjyRklcLf0prY+x4BTqfmx3ZUHQaO9ISGngYq38V/1EH+ECPa+QaK1u1kVBQirDMChiS3CTeIkwWvghtwhKBpZ8g1CO2B99FynVU/KowSRgQ3mlrBsVZ1awmQlS0SGbfXglfBPbdRGMm5O8RXg2P835pDCvzWjghTHETcLpZLHwS8kTCtBEK1SN83Egam8YxyVZqc+Do5qkwS+gT9grNwkUBG6cbsG/gs3BTuC/0ChCxq4QtwgzBMdwUZBPyN4Ftfi4sYPZHktbOSRlIuutRP5jYj0ueZp88xyYcS/zZoiLyQT1IA/cTj7eSlwnrhI+JnkQbCwo2Sx/2M7VJt17wdhVtgxvrpoFnAuSAbJQ97biZAlKxBfD9wgOhV+BgIR/AZtJ4kwD5PGSj7OmmekjWEy0oAQHAS3+KpBpzXqYK3UItopHpSRMno2N+cm7gDYnfRCcr3QBqriMHLJDkeyhFfiG5aVbK+8rhtP9M6QcIEJHX5Fp9NMAyQlYiu+OOJNlODCIXyka/P23bncTdiC7OydC1+v1Bsb+5r84DK8S3Rdmf5cRUFW3bXtWUSt1Rdk6G4SyJV2o1YId+vNUxr+x5yCJiapFtcxQzLjrxboGcMxvFJwEOKnLwjIbkx/sdSmeSaUY++SwTAxV+4DJT7RVwkbk46gNCsifIItuy0e9PF33Cb4homhN5YRyzL5q5V2VNkv98kqgoGTo3YF9CnMM5Y5rItFfvBSi9JulVXOgI+VwIntkt+SaZ6weQfcovJf7zpTfl86P/wAF7Fz18NeKwmvAWCaX0Z/uMHQr42ZxvR/Rxcw5xM+9J/CJq8w2gduDhmDgso/QrBH47dEXQ1IqczyHpIOfIRtnTtV7SwO1oKXKkU3fbToFGSDHtMWcaH1WBuVYnDbRFi99iqSMySdzxXckrazUh23KBVYGIcfNBkTxca0e4ATJ0KukGYVBgr/MnlhPOtQq/ksUfCbzh+EFCjtnCUoHfjhA/OsiTv2HcEvJMELp0VakZDliTmriTdPivxU4VmEhtPrGV+KJhO7ZKt0doFZh1fgZSBWIW2AGEHwg3BUWOnKtH+suqdw07tYMfglCrWPD5mw9qVYuniaXkT0OtWaSuo5LJTY1RBf+roF9X5+y/5qU+DAAAAABJRU5ErkJggg==';
	
	/**
	 * Default value for custom libraries in mxSettings.
	 */
	Editor.defaultCustomLibraries = [];

	/**
	 * Default value for the CSV import dialog.
	 */
	Editor.defaultCsvValue = '##\n' +
		'## Example CSV import. Use ## for comments and # for configuration. Paste CSV below.\n' +
		'## The following names are reserved and should not be used (or ignored):\n' +
		'## id, tooltip, placeholder(s), link and label (see below)\n' +
		'##\n' +
		'#\n' +
		'## Node label with placeholders and HTML.\n' +
		'## Default is \'%name_of_first_column%\'.\n' +
		'#\n' +
		'# label: %name%<br><i style="color:gray;">%position%</i><br><a href="mailto:%email%">Email</a>\n' +
		'#\n' +
		'## Node style (placeholders are replaced once).\n' +
		'## Default is the current style for nodes.\n' +
		'#\n' +
		'# style: label;image=%image%;whiteSpace=wrap;html=1;rounded=1;fillColor=%fill%;strokeColor=%stroke%;\n' +
		'#\n' +
		'## Uses the given column name as the identity for cells (updates existing cells).\n' +
		'## Default is no identity (empty value or -).\n' +
		'#\n' +
		'# identity: -\n' +
		'#\n' +
		'## Connections between rows ("from": source colum, "to": target column).\n' +
		'## Label, style and invert are optional. Defaults are \'\', current style and false.\n' +
		'## The target column may contain a comma-separated list of values.\n' +
		'## Multiple connect entries are allowed.\n' +
		'#\n' +
		'# connect: {"from": "manager", "to": "name", "invert": true, "label": "manages", \\\n' +
		'#          "style": "curved=1;endArrow=blockThin;endFill=1;fontSize=11;"}\n' +
		'# connect: {"from": "refs", "to": "id", "style": "curved=1;fontSize=11;"}\n' +
		'#\n' +
		'## Node width. Possible value are px or auto. Default is auto.\n' +
		'#\n' +
		'# width: auto\n' +
		'#\n' +
		'## Node height. Possible value are px or auto. Default is auto.\n' +
		'#\n' +
		'# height: auto\n' +
		'#\n' +
		'## Padding for autosize. Default is 0.\n' +
		'#\n' +
		'# padding: -12\n' +
		'#\n' +
		'## Comma-separated list of ignored columns for metadata. (These can be\n' +
		'## used for connections and styles but will not be added as metadata.)\n' +
		'#\n' +
		'# ignore: id,image,fill,stroke\n' +
		'#\n' +
		'## Column to be renamed to link attribute (used as link).\n' +
		'#\n' +
		'# link: url\n' +
		'#\n' +
		'## Spacing between nodes. Default is 40.\n' +
		'#\n' +
		'# nodespacing: 40\n' +
		'#\n' +
		'## Spacing between parallel edges. Default is 40.\n' +
		'#\n' +
		'# edgespacing: 40\n' +
		'#\n' +
		'## Name of layout. Possible values are auto, none, verticaltree, horizontaltree,\n' +
		'## verticalflow, horizontalflow, organic, circle. Default is auto.\n' +
		'#\n' +
		'# layout: auto\n' +
		'#\n' +
		'## ---- CSV below this line. First line are column names. ----\n' +
		'name,position,id,location,manager,email,fill,stroke,refs,url,image\n' +
		'Evan Miller,CFO,emi,Office 1,,me@example.com,#dae8fc,#6c8ebf,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-9-2-128.png\n' +
		'Edward Morrison,Brand Manager,emo,Office 2,Evan Miller,me@example.com,#d5e8d4,#82b366,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-10-3-128.png\n' +
		'Ron Donovan,System Admin,rdo,Office 3,Evan Miller,me@example.com,#d5e8d4,#82b366,"emo,tva",https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-2-128.png\n' +
		'Tessa Valet,HR Director,tva,Office 4,Evan Miller,me@example.com,#d5e8d4,#82b366,,https://www.draw.io,https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-3-128.png\n';
	
	/**
	 * Global configuration of the Editor
	 * see https://desk.draw.io/solution/articles/16000058316
	 * 
	 * For defaultVertexStyle, defaultEdgeStyle and defaultLibraries, this must be called before
	 * mxSettings.load via global config variable window.mxLoadSettings = false.
	 */
	Editor.configure = function(config)
	{
		if (config != null)
		{
			Editor.configVersion = config.version;
			Menus.prototype.defaultFonts = config.defaultFonts || Menus.prototype.defaultFonts;
			ColorDialog.prototype.presetColors = config.presetColors || ColorDialog.prototype.presetColors;
			ColorDialog.prototype.defaultColors = config.defaultColors || ColorDialog.prototype.defaultColors;
			StyleFormatPanel.prototype.defaultColorSchemes = config.defaultColorSchemes || StyleFormatPanel.prototype.defaultColorSchemes;
			Graph.prototype.defaultEdgeLength = config.defaultEdgeLength || Graph.prototype.defaultEdgeLength;
			
			// Custom CSS injected directly into the page
			if (config.css != null)
			{
				var s = document.createElement('style');
				s.setAttribute('type', 'text/css');
				s.appendChild(document.createTextNode(config.css));
				
				var t = document.getElementsByTagName('script')[0];
			  	t.parentNode.insertBefore(s, t);
			}
			
			// Overrides default libraries
			if (config.defaultLibraries != null)
			{
				Sidebar.prototype.defaultEntries = config.defaultLibraries;
			}
			
			// Overrides default custom libraries
			if (config.defaultCustomLibraries != null)
			{
				Editor.defaultCustomLibraries = config.defaultCustomLibraries;
			}
			
			// Overrides default vertex style
			if (config.defaultVertexStyle != null)
			{
				Graph.prototype.defaultVertexStyle = config.defaultVertexStyle;
			}

			// Overrides default edge style
			if (config.defaultEdgeStyle != null)
			{
				Graph.prototype.defaultEdgeStyle = config.defaultEdgeStyle;
			}
			
			if (config.emptyDiagramXml)
			{
				EditorUi.prototype.emptyDiagramXml = config.emptyDiagramXml;
			}
			
			if (config.thumbWidth)
			{
				Sidebar.prototype.thumbWidth = config.thumbWidth;
			}
			
			if (config.thumbHeight)
			{
				Sidebar.prototype.thumbHeight = config.thumbHeight;
			}
			
			if (config.emptyLibraryXml)
			{
				EditorUi.prototype.emptyLibraryXml = config.emptyLibraryXml;
			}
			
			if (config.sidebarWidth)
			{
				EditorUi.prototype.hsplitPosition = config.sidebarWidth;
			}
			
			if (config.fontCss)
			{
				var s = document.createElement('style');
				s.setAttribute('type', 'text/css');
				s.appendChild(document.createTextNode(config.fontCss));
				
				var t = document.getElementsByTagName('script')[0];
			  	t.parentNode.insertBefore(s, t);
			  	
			  	Editor.prototype.fontCss = config.fontCss;
			}
			
			if (config.plugins != null)
			{
				// Required for callback
				App.initPluginCallback();
				
				for (var i = 0; i < config.plugins.length; i++)
				{
					mxscript(config.plugins[i]);
				}
			}
		}
	};

	/**
	 * Executes the first step for connecting to Google Drive.
	 */
	Editor.prototype.editButtonLink = (urlParams['edit'] != null) ? decodeURIComponent(urlParams['edit']) : null;

	/**
	 * Adds support for old stylesheets and compressed files
	 */
	var editorSetGraphXml = Editor.prototype.setGraphXml;
	Editor.prototype.setGraphXml = function(node)
	{
		node = (node != null && node.nodeName != 'mxlibrary') ? this.extractGraphModel(node) : null;

		if (node != null)
		{
			// Checks input for parser errors
			var errs = node.getElementsByTagName('parsererror');
			
			if (errs != null && errs.length > 0)
			{
				var elt = errs[0];
				var divs = elt.getElementsByTagName('div');
				
				if (divs != null && divs.length > 0)
				{
					elt = divs[0];
				}
				
				throw {message: mxUtils.getTextContent(elt)};
			}
			else if (node.nodeName == 'mxGraphModel')
			{
				var style = node.getAttribute('style') || 'default-style2';
				
				// Decodes the style if required
				if (urlParams['embed'] != '1' && (style == null || style == ''))
				{
					var node2 = (this.graph.themes != null) ?
						this.graph.themes['default-old'] :
						mxUtils.load(STYLE_PATH + '/default-old.xml').getDocumentElement();
				    
				    if (node2 != null)
				    {
				    	var dec2 = new mxCodec(node2.ownerDocument);
				    	dec2.decode(node2, this.graph.getStylesheet());
				    }
				}
				else if (style != this.graph.currentStyle)
				{
				    var node2 = (this.graph.themes != null) ?
						this.graph.themes[style] :
						mxUtils.load(STYLE_PATH + '/' + style + '.xml').getDocumentElement()
				    
				    if (node2 != null)
				    {
				    	var dec2 = new mxCodec(node2.ownerDocument);
				    	dec2.decode(node2, this.graph.getStylesheet());
				    }
				}
	
				this.graph.currentStyle = style;
				this.graph.mathEnabled = (urlParams['math'] == '1' || node.getAttribute('math') == '1');
				
				var bgImg = node.getAttribute('backgroundImage');
				
				if (bgImg != null)
				{
					bgImg = JSON.parse(bgImg);
					this.graph.setBackgroundImage(new mxImage(bgImg.src, bgImg.width, bgImg.height));
				}
				else
				{
					this.graph.setBackgroundImage(null);
				}
				
				mxClient.NO_FO = (this.graph.mathEnabled) ? true : this.originalNoForeignObject;
				this.graph.setShadowVisible(node.getAttribute('shadow') == '1', false);
			}
	
			// Calls updateGraphComponents
			editorSetGraphXml.apply(this, arguments);
		}
		else
		{
			throw { 
			    message: mxResources.get('notADiagramFile') || 'Invalid data',
			    toString: function() { return this.message; }
			};
		}
	};

	/**
	 * Adds persistent style to file
	 */
	var editorGetGraphXml = Editor.prototype.getGraphXml;	
	Editor.prototype.getGraphXml = function(ignoreSelection)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		var node = editorGetGraphXml.apply(this, arguments);
		
		// Adds the current style
		if (this.graph.currentStyle != null && this.graph.currentStyle != 'default-style2')
		{
			node.setAttribute('style', this.graph.currentStyle);
		}
		
		// Adds the background image
		if (this.graph.backgroundImage != null)
		{
			node.setAttribute('backgroundImage', JSON.stringify(this.graph.backgroundImage));
		}
		
		node.setAttribute('math', (this.graph.mathEnabled) ? '1' : '0');
		node.setAttribute('shadow', (this.graph.shadowVisible) ? '1' : '0');
		
		return node;
	};
	
	/**
	 * Helper function to extract the graph model XML node.
	 */
	Editor.prototype.isDataSvg = function(svg)
	{
		try
		{
			var svgRoot = mxUtils.parseXml(svg).documentElement;
			var tmp = svgRoot.getAttribute('content');
			
			if (tmp != null)
			{
				if (tmp != null && tmp.charAt(0) != '<' && tmp.charAt(0) != '%')
				{
					tmp = unescape((window.atob) ? atob(tmp) : Base64.decode(cont, tmp));
				}
				
				if (tmp != null && tmp.charAt(0) == '%')
				{
					tmp = decodeURIComponent(tmp);
				}
				
				if (tmp != null && tmp.length > 0)
				{
					var node = mxUtils.parseXml(tmp).documentElement;
					
					
					return node.nodeName == 'mxfile' || node.nodeName == 'mxGraphModel';
				}
			}
		}
		catch (e)
		{
			// ignore
		}
		
		return false;
	};
	
	/**
	 * Helper function to extract the graph model XML node.
	 */
	Editor.prototype.extractGraphModel = function(node, allowMxFile)
	{
		if (node != null && typeof(pako) !== 'undefined')
		{
			var tmp = node.ownerDocument.getElementsByTagName('div');
			var divs = [];
			
			if (tmp != null && tmp.length > 0)
			{
				for (var i = 0; i < tmp.length; i++)
				{
					if (tmp[i].getAttribute('class') == 'mxgraph')
					{
						divs.push(tmp[i]);
						break;
					}	
				}
			}
			
			if (divs.length > 0)
			{
				var data = divs[0].getAttribute('data-mxgraph');

				if (data != null)
				{
					var config = JSON.parse(data);

					if (config != null && config.xml != null)
					{
						var doc2 = mxUtils.parseXml(config.xml);
						node = doc2.documentElement;
					}
				}
				else
				{
					var divs2 = divs[0].getElementsByTagName('div');
					
					if (divs2.length > 0)
					{
						var data = mxUtils.getTextContent(divs2[0]);
		        		data = this.graph.decompress(data);
		        		
		        		if (data.length > 0)
		        		{
		        			var doc2 = mxUtils.parseXml(data);
		        			node = doc2.documentElement;
		        		}
					}
				}
			}
		}
		
		if (node != null && node.nodeName == 'svg')
		{
			var tmp = node.getAttribute('content');
			
			if (tmp != null && tmp.charAt(0) != '<' && tmp.charAt(0) != '%')
			{
				tmp = unescape((window.atob) ? atob(tmp) : Base64.decode(cont, tmp));
			}
			
			if (tmp != null && tmp.charAt(0) == '%')
			{
				tmp = decodeURIComponent(tmp);
			}
			
			if (tmp != null && tmp.length > 0)
			{
				node = mxUtils.parseXml(tmp).documentElement;
			}
			else
			{
				throw {message: mxResources.get('notADiagramFile')};
			}
		}
		
		if (node != null && !allowMxFile)
		{
			var diagramNode = null;
			
			if (node.nodeName == 'diagram')
			{
				diagramNode = node;
			}
			else if (node.nodeName == 'mxfile')
			{
				var diagrams = node.getElementsByTagName('diagram');

				if (diagrams.length > 0)
				{
					diagramNode = diagrams[Math.max(0, Math.min(diagrams.length - 1, urlParams['page'] || 0))];
				}
			}
			
			if (diagramNode != null)
			{
				var tmp = this.graph.decompress(mxUtils.getTextContent(diagramNode));
				
				if (tmp != null && tmp.length > 0)
				{
					node = mxUtils.parseXml(tmp).documentElement;
				}
			}
		}
		
		if (node != null && node.nodeName != 'mxGraphModel' && (!allowMxFile || node.nodeName != 'mxfile'))
		{
			node = null;
		}
		
		return node;
	};
	
	/**
	 * Overrides reset graph.
	 */
	var editorResetGraph = Editor.prototype.resetGraph;	
	Editor.prototype.resetGraph = function()
	{
		this.graph.mathEnabled = (urlParams['math'] == '1');
		this.graph.view.x0 = null;
		this.graph.view.y0 = null;
		mxClient.NO_FO = (this.graph.mathEnabled) ? true : this.originalNoForeignObject;
		editorResetGraph.apply(this, arguments);
	};

	/**
	 * Math support.
	 */
	Editor.prototype.originalNoForeignObject = mxClient.NO_FO;

	var editorUpdateGraphComponents = Editor.prototype.updateGraphComponents;
	Editor.prototype.updateGraphComponents = function()
	{
		editorUpdateGraphComponents.apply(this, arguments);
		mxClient.NO_FO = (this.graph.mathEnabled && Editor.MathJaxRender != null) ? true : this.originalNoForeignObject;
	};
		
	/**
	 * Initializes math typesetting and loads respective code.
	 */
	Editor.initMath = function(src, config)
	{
		src = (src != null) ? src : 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_HTMLorMML';
		Editor.mathJaxQueue = [];
		
		Editor.doMathJaxRender = function(container)
		{
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, container]);
		};

		// Disables global typesetting and messages on startup, adds queue for
		// asynchronous rendering while MathJax is loading
		window.MathJax =
		{
			skipStartupTypeset: true,
			showMathMenu: false,
			messageStyle: 'none',
			AuthorInit: function ()
			{
				// Specification recommends using SVG over HTML-CSS if browser is known
				// Check if too inconsistent with image export and print output
				MathJax.Hub.Config(config || {
					jax: ['input/TeX', 'input/MathML', 'input/AsciiMath', 'output/HTML-CSS'],
					extensions: ['tex2jax.js', 'mml2jax.js', 'asciimath2jax.js'],
					TeX: {
					  extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
					},
					// Ignores math in in-place editor
					tex2jax: {
						ignoreClass: 'mxCellEditor'
				  	},
				  	asciimath2jax: {
						ignoreClass: 'mxCellEditor'
				  	}
				});
				MathJax.Hub.Register.StartupHook('Begin', function()
				{
					for (var i = 0; i < Editor.mathJaxQueue.length; i++)
					{
						Editor.doMathJaxRender(Editor.mathJaxQueue[i]);
					}
				});
		    }
		};

		// Adds global enqueue method for async rendering
		Editor.MathJaxRender = function(container)
		{
			// Initial rendering when MathJax finished loading
			if (typeof(MathJax) !== 'undefined' && typeof(MathJax.Hub) !== 'undefined')
			{
				Editor.doMathJaxRender(container);
			}
			else
			{
				Editor.mathJaxQueue.push(container);
			}
		};

		// Adds global clear queue method
		Editor.MathJaxClear = function()
		{
			Editor.mathJaxQueue = [];
		};
		
		// Updates typeset after changes
		var editorInit = Editor.prototype.init;
		
		Editor.prototype.init = function()
		{
			editorInit.apply(this, arguments);
			
			this.graph.addListener(mxEvent.SIZE, mxUtils.bind(this, function(sender, evt)
			{
				if (this.graph.mathEnabled)
				{
					Editor.MathJaxRender(this.graph.container);
				}
			}));
		};
		
		var tags = document.getElementsByTagName('script');
		
		if (tags != null && tags.length > 0)
		{
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = src;
			tags[0].parentNode.appendChild(script);
		}
	};

	/**
	 * Return array of string values, or NULL if CSV string not well formed.
	 */
	Editor.prototype.csvToArray = function(text)
	{
	    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
	    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	    // Return NULL if input string is not well formed CSV string.
	    if (!re_valid.test(text)) return null;
	    var a = [];                     // Initialize array to receive values.
	    text.replace(re_value, // "Walk" the string using replace with callback.
	        function(m0, m1, m2, m3) {
	            // Remove backslash from \' in single quoted values.
	            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
	            // Remove backslash from \" in double quoted values.
	            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
	            else if (m3 !== undefined) a.push(m3);
	            return ''; // Return empty string.
	        });
	    // Handle special case of empty last value.
	    if (/,\s*$/.test(text)) a.push('');
	    return a;
	};

	/**
	 * Adds persistence for recent colors
	 */
	if (window.ColorDialog)
	{
		var colorDialogAddRecentColor = ColorDialog.addRecentColor;
		
		ColorDialog.addRecentColor = function(color, max)
		{
			colorDialogAddRecentColor.apply(this, arguments);
			
			mxSettings.setRecentColors(ColorDialog.recentColors);
			mxSettings.save();
		};
		
		var colorDialogResetRecentColors = ColorDialog.resetRecentColors;
		
		ColorDialog.resetRecentColors = function()
		{
			colorDialogResetRecentColors.apply(this, arguments);
			
			mxSettings.setRecentColors(ColorDialog.recentColors);
			mxSettings.save();
		};
	}

	// Overridden to add edit shape option
	if (window.StyleFormatPanel != null)
	{
		var formatInit = Format.prototype.init;
		
		Format.prototype.init = function()
		{
			formatInit.apply(this, arguments);

			this.editorUi.editor.addListener('fileLoaded', this.update);
		};

		var formatRefresh = Format.prototype.refresh;
		
		Format.prototype.refresh = function()
		{
			if (this.editorUi.getCurrentFile() != null || urlParams['embed'] == '1' ||
				this.editorUi.editor.chromeless)
			{
				formatRefresh.apply(this, arguments);
			}
			else
			{
				this.clear();
			}
		};
		
		/**
		 * Add global shadow option.
		 */
		var diagramFormatPanelAddView = DiagramFormatPanel.prototype.addView;
		
		DiagramFormatPanel.prototype.addView = function(div)
		{
			var div = diagramFormatPanelAddView.apply(this, arguments);
			
			if (mxClient.IS_SVG)
			{
				var ui = this.editorUi;
				var editor = ui.editor;
				var graph = editor.graph;
				
				div.appendChild(this.createOption(mxResources.get('shadow'), function()
				{
					return graph.shadowVisible;
				}, function(checked)
				{
					graph.model.execute(new ChangeShadow(ui, checked));
				},
				{
					install: function(apply)
					{
						this.listener = function()
						{
							apply(graph.shadowVisible);
						};
						
						ui.addListener('shadowVisibleChanged', this.listener);
					},
					destroy: function()
					{
						ui.removeListener(this.listener);
					}
				}));
			}
			
			return div;
		};
		
		/**
		 * Adds autosave and math typesetting options.
		 */
		var diagramFormatPanelAddOptions = DiagramFormatPanel.prototype.addOptions;
		DiagramFormatPanel.prototype.addOptions = function(div)
		{
			div = diagramFormatPanelAddOptions.apply(this, arguments);
			
			var ui = this.editorUi;
			var editor = ui.editor;
			var graph = editor.graph;
			
			if (graph.isEnabled())
			{
				var file = ui.getCurrentFile();
	
				if (file != null && file.isAutosaveOptional())
				{
					var opt = this.createOption(mxResources.get('autosave'), function()
					{
						return ui.editor.autosave;
					}, function(checked)
					{
						ui.editor.setAutosave(checked);
					},
					{
						install: function(apply)
						{
							this.listener = function()
							{
								apply(ui.editor.autosave);
							};
							
							ui.editor.addListener('autosaveChanged', this.listener);
						},
						destroy: function()
						{
							ui.editor.removeListener(this.listener);
						}
					});
					
					div.appendChild(opt);
				}
			}

			return div;
		};
		
		/**
		 * Configures global color schemes.
		 */
		StyleFormatPanel.prototype.defaultColorSchemes = [[null, {fill: '#f5f5f5', stroke: '#666666'},
			{fill: '#dae8fc', stroke: '#6c8ebf'}, {fill: '#d5e8d4', stroke: '#82b366'},
			{fill: '#ffe6cc', stroke: '#d79b00'}, {fill: '#fff2cc', stroke: '#d6b656'},
			{fill: '#f8cecc', stroke: '#b85450'}, {fill: '#e1d5e7', stroke: '#9673a6'}],
		    [null,
			{fill: '#f5f5f5', stroke: '#666666', gradient: '#b3b3b3'},
			{fill: '#dae8fc', stroke: '#6c8ebf', gradient: '#7ea6e0'},
			{fill: '#d5e8d4', stroke: '#82b366', gradient: '#97d077'},
			{fill: '#ffcd28', stroke: '#d79b00', gradient: '#ffa500'},
			{fill: '#fff2cc', stroke: '#d6b656', gradient: '#ffd966'},
			{fill: '#f8cecc', stroke: '#b85450', gradient: '#ea6b66'},
			{fill: '#e6d0de', stroke: '#996185', gradient: '#d5739d'}],
			[null, {fill: '#eeeeee', stroke: '#36393d'},
			{fill: '#f9f7ed', stroke: '#36393d'}, {fill: '#ffcc99', stroke: '#36393d'},
			{fill: '#cce5ff', stroke: '#36393d'}, {fill: '#ffff88', stroke: '#36393d'},
			{fill: '#cdeb8b', stroke: '#36393d'}, {fill: '#ffcccc', stroke: '#36393d'}]];

		/**
		 * Adds predefiend styles.
		 */
		var styleFormatPanelInit = StyleFormatPanel.prototype.init;
		
		StyleFormatPanel.prototype.init = function()
		{
			// TODO: Update sstate in Format
			var sstate = this.format.createSelectionState();

			if (sstate.style.shape != 'image')
			{
				this.container.appendChild(this.addStyles(this.createPanel()));
			}
			
			styleFormatPanelInit.apply(this, arguments);
		};

		/**
		 * Overridden to add copy and paste style.
		 */
		var styleFormatPanelAddStyleOps = StyleFormatPanel.prototype.addStyleOps;
		
		StyleFormatPanel.prototype.addStyleOps = function(div)
		{
			var btn = mxUtils.button(mxResources.get('copyStyle'), mxUtils.bind(this, function(evt)
			{
				this.editorUi.actions.get('copyStyle').funct();
			}));
			
			btn.setAttribute('title', mxResources.get('copyStyle') + ' (' + this.editorUi.actions.get('copyStyle').shortcut + ')');
			btn.style.marginBottom = '2px';
			btn.style.width = '100px';
			btn.style.marginRight = '2px';
			
			div.appendChild(btn);
			
			var btn = mxUtils.button(mxResources.get('pasteStyle'), mxUtils.bind(this, function(evt)
			{
				this.editorUi.actions.get('pasteStyle').funct();
			}));
			
			btn.setAttribute('title', mxResources.get('pasteStyle') + ' (' + this.editorUi.actions.get('pasteStyle').shortcut + ')');
			btn.style.marginBottom = '2px';
			btn.style.width = '100px';
			
			div.appendChild(btn);
			mxUtils.br(div);
			
			return styleFormatPanelAddStyleOps.apply(this, arguments);
		};

		/**
		 * Creates the buttons for the predefined styles.
		 */
		StyleFormatPanel.prototype.addStyles = function(div)
		{
			var graph = this.editorUi.editor.graph;
			var picker = document.createElement('div');
			picker.style.whiteSpace = 'nowrap';
			picker.style.paddingLeft = '24px';
			picker.style.paddingRight = '20px';
			div.style.paddingLeft = '16px';
			div.style.paddingBottom = '6px';
			div.style.position = 'relative';
			div.appendChild(picker);

			var stylenames = ['plain-gray', 'plain-blue', 'plain-green', 'plain-turquoise',
				'plain-orange', 'plain-yellow', 'plain-red', 'plain-pink', 'plain-purple', 'gray',
				'blue', 'green', 'turquoise', 'orange', 'yellow', 'red', 'pink', 'purple'];

			function updateScheme(colorsets)
			{
				function addButton(colorset)
				{
					var btn = mxUtils.button('', function(evt)
					{
						graph.getModel().beginUpdate();
						try
						{
							var cells = graph.getSelectionCells();
							
							for (var i = 0; i < cells.length; i++)
							{
								var style = graph.getModel().getStyle(cells[i]);
				
								for (var j = 0; j < stylenames.length; j++)
								{
									style = mxUtils.removeStylename(style, stylenames[j]);
								}
								
								if (colorset != null)
								{
									style = mxUtils.setStyle(style, mxConstants.STYLE_FILLCOLOR, colorset['fill']);
									style = mxUtils.setStyle(style, mxConstants.STYLE_STROKECOLOR, colorset['stroke']);
									style = mxUtils.setStyle(style, mxConstants.STYLE_GRADIENTCOLOR, colorset['gradient']);
								}
								else
								{
									style = mxUtils.setStyle(style, mxConstants.STYLE_FILLCOLOR, '#ffffff');
									style = mxUtils.setStyle(style, mxConstants.STYLE_STROKECOLOR, '#000000');
									style = mxUtils.setStyle(style, mxConstants.STYLE_GRADIENTCOLOR, null);
								}
								
								graph.getModel().setStyle(cells[i], style);
							}
						}
						finally
						{
							graph.getModel().endUpdate();
						}
					})
	
					btn.className = 'geStyleButton';
					btn.style.width = '36px';
					btn.style.height = '30px';
					btn.style.margin = '0px 6px 6px 0px';
					
					if (colorset != null)
					{
						if (colorset['gradient'] != null)
						{
							if (mxClient.IS_IE && (mxClient.IS_QUIRKS || document.documentMode < 10))
							{
						    	btn.style.filter = 'progid:DXImageTransform.Microsoft.Gradient('+
				                	'StartColorStr=\'' + colorset['fill'] +
				                	'\', EndColorStr=\'' + colorset['gradient'] + '\', GradientType=0)';
							}
							else
							{
								btn.style.backgroundImage = 'linear-gradient(' + colorset['fill'] + ' 0px,' +
									colorset['gradient'] + ' 100%)';
							}
						}
						else
						{					
							btn.style.backgroundColor = colorset['fill'];
						}
						
						btn.style.border = '1px solid ' + colorset['stroke'];
					}
					else
					{
						btn.style.backgroundColor = '#ffffff';
						btn.style.border = '1px solid #000000';
					}
					
					picker.appendChild(btn);
				};
				
				picker.innerHTML = '';
				
				for (var i = 0; i < colorsets.length; i++)
				{
					if (i > 0 && mxUtils.mod(i, 4) == 0)
					{
						mxUtils.br(picker);
					}
					
					addButton(colorsets[i]);
				}
			};

			if (this.editorUi.currentScheme == null)
			{
				this.editorUi.currentScheme = 0;
			}

			var left = document.createElement('div');
			left.style.cssText = 'position:absolute;left:10px;top:8px;bottom:8px;width:20px;margin:4px;opacity:0.5;' +
				'background-repeat:no-repeat;background-position:center center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQBAMAAADQT4M0AAAAIVBMVEUAAAB2dnZ4eHh3d3d1dXVxcXF2dnZ2dnZ2dnZxcXF2dnYmb3w1AAAACnRSTlMAfCTkhhvb7cQSPH2JPgAAADRJREFUCNdjwACMAmBKaiGYs2oJmLPKAZ3DabU8AMRTXpUKopislqFyVzCAuUZgikkBZjoAcMYLnp53P/UAAAAASUVORK5CYII=);';
			
			mxEvent.addListener(left, 'click', mxUtils.bind(this, function()
			{
				this.editorUi.currentScheme = mxUtils.mod(this.editorUi.currentScheme - 1, this.defaultColorSchemes.length);
				updateScheme(this.defaultColorSchemes[this.editorUi.currentScheme]);
			}));
			
			var right = document.createElement('div');
			right.style.cssText = 'position:absolute;left:202px;top:8px;bottom:8px;width:20px;margin:4px;opacity:0.5;' +
				'background-repeat:no-repeat;background-position:center center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQBAMAAADQT4M0AAAAIVBMVEUAAAB2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnYBuwCcAAAACnRSTlMAfCTkhhvb7cQSPH2JPgAAADZJREFUCNdjQAOMAmBKaiGY8loF5rKswsZlrVo8AUiFrTICcbIWK8A5DF1gDoMymMPApIAwHwCS0Qx/U7qCBQAAAABJRU5ErkJggg==);';

			if (this.defaultColorSchemes.length > 1)
			{
				div.appendChild(left);
				div.appendChild(right);
			}
			
			mxEvent.addListener(right, 'click', mxUtils.bind(this, function()
			{
				this.editorUi.currentScheme = mxUtils.mod(this.editorUi.currentScheme + 1, this.defaultColorSchemes.length);
				updateScheme(this.defaultColorSchemes[this.editorUi.currentScheme]);
			}));
			
			// Hover state
			function addHoverState(elt)
			{
				mxEvent.addListener(elt, 'mouseenter', function()
				{
					elt.style.opacity = '1';
				});
				mxEvent.addListener(elt, 'mouseleave', function()
				{
					elt.style.opacity = '0.5';
				});
			};
			
			addHoverState(left);
			addHoverState(right);
			
			updateScheme(this.defaultColorSchemes[this.editorUi.currentScheme]);
			
			return div;
		};
		
		StyleFormatPanel.prototype.addEditOps = function(div)
		{
			var ss = this.format.getSelectionState();
			var btn = null;
			
			if (this.editorUi.editor.graph.getSelectionCount() == 1)
			{
				btn = mxUtils.button(mxResources.get('editStyle'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('editStyle').funct();
				}));
				
				btn.setAttribute('title', mxResources.get('editStyle') + ' (' + this.editorUi.actions.get('editStyle').shortcut + ')');
				btn.style.width = '202px';
				btn.style.marginBottom = '2px';
				
				div.appendChild(btn);
			}
			
			var graph = this.editorUi.editor.graph;
			var state = graph.view.getState(graph.getSelectionCell());
			
			if (graph.getSelectionCount() == 1 && state != null && state.shape != null && state.shape.stencil != null)
			{
				var btn2 = mxUtils.button(mxResources.get('editShape'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('editShape').funct();
				}));
				
				btn2.setAttribute('title', mxResources.get('editShape'));
				btn2.style.marginBottom = '2px';
				
				if (btn == null)
				{
					btn2.style.width = '202px';
				}
				else
				{
					btn.style.width = '100px';
					btn2.style.width = '100px';
					btn2.style.marginLeft = '2px';
				}
				
				div.appendChild(btn2);
			}
			else if (ss.image)
			{
				var btn2 = mxUtils.button(mxResources.get('editImage'), mxUtils.bind(this, function(evt)
				{
					this.editorUi.actions.get('image').funct();
				}));
				
				btn2.setAttribute('title', mxResources.get('editImage'));
				btn2.style.marginBottom = '2px';
				
				if (btn == null)
				{
					btn2.style.width = '202px';
				}
				else
				{
					btn.style.width = '100px';
					btn2.style.width = '100px';
					btn2.style.marginLeft = '2px';
				}
				
				div.appendChild(btn2);
			}
			
			return div;
		};
	}

	/**
	 * Changes the default stylename so that it matches the old named style
	 * if one was specified in the XML.
	 */
	Graph.prototype.defaultThemeName = 'default-style2';
	
	/**
	 * Contains the last XML that was pasted.
	 */
	Graph.prototype.lastPasteXml = null;
	
	/**
	 * Contains the number of times the last XML was pasted.
	 */
	Graph.prototype.pasteCounter = 0;
	
	/**
	 * Graph Overrides
	 */
	Graph.prototype.defaultScrollbars = urlParams['sb'] != '0';

	/**
	 * Specifies if the page should be visible for new files. Default is true.
	 */
	Graph.prototype.defaultPageVisible = urlParams['pv'] != '0';

	/**
	 * Specifies if the page should be visible for new files. Default is true.
	 */
	Graph.prototype.shadowId = 'dropShadow';
	
	/**
	 * Properties for the SVG shadow effect.
	 */
	Graph.prototype.svgShadowColor = '#3D4574';

	/**
	 * Properties for the SVG shadow effect.
	 */
	Graph.prototype.svgShadowOpacity = '0.4';

	/**
	 * Properties for the SVG shadow effect.
	 */
	Graph.prototype.svgShadowBlur = '1.7';
	
	/**
	 * Properties for the SVG shadow effect.
	 */
	Graph.prototype.svgShadowSize = '3';
		
	/**
	 * Enables move of bends/segments without selecting.
	 */
	Graph.prototype.edgeMode = urlParams['edge'] != 'move';
		
	/**
	 * Adds rack child layout style.
	 */
	var graphInit = Graph.prototype.init;
	Graph.prototype.init = function()
	{
		graphInit.apply(this, arguments);

		// Override insert location for current mouse point
		var mouseEvent = null;
		
		function setMouseEvent(evt)
		{
			mouseEvent = evt;
			
			// Workaround for member not found in IE8-
			if (mxClient.IS_QUIRKS || document.documentMode == 7 || document.documentMode == 8)
			{
				mouseEvent = mxUtils.clone(evt);
			}
		};
		
		mxEvent.addListener(this.container, 'mouseenter', setMouseEvent);
		mxEvent.addListener(this.container, 'mousemove', setMouseEvent);
		
		mxEvent.addListener(this.container, 'mouseleave', function(evt)
		{
			mouseEvent = null;
		});
				
		// Extends getInsertPoint to use the current mouse location
		this.isMouseInsertPoint = function()
		{
			return mouseEvent != null;
		};
		
		var getInsertPoint = this.getInsertPoint;
		
		this.getInsertPoint = function()
		{
			if (mouseEvent != null)
			{
				return this.getPointForEvent(mouseEvent);
			}
			
			return getInsertPoint.apply(this, arguments);
		};
		
		var layoutManagerGetLayout = this.layoutManager.getLayout;
		
		this.layoutManager.getLayout = function(cell)
		{
			var state = this.graph.view.getState(cell);
			var style = (state != null) ? state.style : this.graph.getCellStyle(cell);
			
			// mxRackContainer may be undefined as it is dynamically loaded at render time
			if (typeof(mxRackContainer) != 'undefined' && style['childLayout'] == 'rack')
			{
				var rackLayout = new mxStackLayout(this.graph, false);
				
				rackLayout.setChildGeometry = function(child, geo)
				{
					var unitSize = 20;
					geo.height = Math.max(geo.height, unitSize);
					
					if (geo.height / unitSize > 1)
					{
						var mod = geo.height % unitSize;
						geo.height += mod > unitSize / 2 ? (unitSize - mod) : -mod;
					}
			
					this.graph.getModel().setGeometry(child, geo);
				};
			
				rackLayout.fill = true;
				rackLayout.unitSize = mxRackContainer.unitSize | 20;
				rackLayout.marginLeft = style['marginLeft'] || 0;
				rackLayout.marginRight = style['marginRight'] || 0;
				rackLayout.marginTop = style['marginTop'] || 0;
				rackLayout.marginBottom = style['marginBottom'] || 0;
				rackLayout.resizeParent = false;
				
				return rackLayout;
			}
			
			return layoutManagerGetLayout.apply(this, arguments);
		}
	};

	/**
	 * Sets default style (used in editor.get/setGraphXml below)
	 */
	var graphLoadStylesheet = Graph.prototype.loadStylesheet;
	Graph.prototype.loadStylesheet = function()
	{
		graphLoadStylesheet.apply(this, arguments);
		this.currentStyle = 'default-style2';
	};

	/**
	 * Adds support for page links.
	 */
	Graph.prototype.isPageLink = function(href)
	{
		return href != null && href.substring(0, 10) == 'data:page/';
	};
	
	/**
	 * Highlights the given cell.
	 */
	Graph.prototype.highlightCell = function(cell, color, duration)
	{
		color = (color != null) ? color : mxConstants.DEFAULT_VALID_COLOR;
		duration = (duration != null) ? duration : 1000;
		var state = this.view.getState(cell);
		
		if (state != null)
		{
			var sw = Math.max(5, mxUtils.getValue(state.style, mxConstants.STYLE_STROKEWIDTH, 1) + 4);
			var hl = new mxCellHighlight(this, color, sw, false);
			hl.highlight(state);
			
			// Fades out the highlight after a duration
			window.setTimeout(function()
			{
				if (hl.shape != null)
				{
				 	mxUtils.setPrefixedStyle(hl.shape.node.style, 'transition', 'all 1200ms ease-in-out');
					hl.shape.node.style.opacity = 0;
				}
				
				// Destroys the highlight after the fade
				window.setTimeout(function()
				{
					hl.destroy();
				}, 1200);
			}, duration);
		}
	};

	/**
	 * Adds a shadow filter to the given svg root.
	 */
	Graph.prototype.addSvgShadow = function(svgRoot, group, createOnly)
	{
		createOnly = (createOnly != null) ? createOnly : false;
		
		var svgDoc = svgRoot.ownerDocument;
		
		var filter = (svgDoc.createElementNS != null) ?
			svgDoc.createElementNS(mxConstants.NS_SVG, 'filter') : svgDoc.createElement('filter');
		filter.setAttribute('id', this.shadowId);

		var blur = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feGaussianBlur') : svgDoc.createElement('feGaussianBlur');
		blur.setAttribute('in', 'SourceAlpha');
		blur.setAttribute('stdDeviation', this.svgShadowBlur);
		blur.setAttribute('result', 'blur');
		filter.appendChild(blur);
		
		var offset = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feOffset') : svgDoc.createElement('feOffset');
		offset.setAttribute('in', 'blur');
		offset.setAttribute('dx', this.svgShadowSize);
		offset.setAttribute('dy', this.svgShadowSize);
		offset.setAttribute('result', 'offsetBlur');
		filter.appendChild(offset);
		
		var flood = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feFlood') : svgDoc.createElement('feFlood');
		flood.setAttribute('flood-color', this.svgShadowColor);
		flood.setAttribute('flood-opacity', this.svgShadowOpacity);
		flood.setAttribute('result', 'offsetColor');
		filter.appendChild(flood);
		
		var composite = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feComposite') : svgDoc.createElement('feComposite');
		composite.setAttribute('in', 'offsetColor');
		composite.setAttribute('in2', 'offsetBlur');
		composite.setAttribute('operator', 'in');
		composite.setAttribute('result', 'offsetBlur');
		filter.appendChild(composite);

		var feBlend = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'feBlend') : svgDoc.createElement('feBlend');
		feBlend.setAttribute('in', 'SourceGraphic');
		feBlend.setAttribute('in2', 'offsetBlur');
		filter.appendChild(feBlend);
		
		// Creates defs element if not available
		var defs = svgRoot.getElementsByTagName('defs');
		var defsElt = null;
		
		if (defs.length == 0)
		{
			defsElt = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'defs') : svgDoc.createElement('defs');
			
			if (svgRoot.firstChild != null)
			{
				svgRoot.insertBefore(defsElt, svgRoot.firstChild);
			}
			else
			{
				svgRoot.appendChild(defsElt);
			}
		}
		else
		{
			defsElt = defs[0];
		}
		
		defsElt.appendChild(filter);
		
		if (!createOnly)
		{
			(group || svgRoot.getElementsByTagName('g')[0]).setAttribute('filter', 'url(#' + this.shadowId + ')');
			
			if (!isNaN(parseInt(svgRoot.getAttribute('width'))))
			{
				svgRoot.setAttribute('width', parseInt(svgRoot.getAttribute('width')) + 6);
				svgRoot.setAttribute('height', parseInt(svgRoot.getAttribute('height')) + 6);
			}
		}
		
		return filter;
	};
	
	/**
	 * Loads the stylesheet for this graph.
	 */
	Graph.prototype.setShadowVisible = function(value, fireEvent)
	{
		if (mxClient.IS_SVG)
		{
			fireEvent = (fireEvent != null) ? fireEvent : true;
			this.shadowVisible = value;
			
			if (this.shadowVisible)
			{
				this.view.getDrawPane().setAttribute('filter', 'url(#' + this.shadowId + ')');
			}
			else
			{
				this.view.getDrawPane().removeAttribute('filter');
			}
			
			if (fireEvent)
			{
				this.fireEvent(new mxEventObject('shadowVisibleChanged'));
			}
		}
	};
	
	/**
	 * Selects first unlocked layer if one exists
	 */
	Graph.prototype.selectUnlockedLayer = function()
	{
		if (this.defaultParent == null)
		{
			var childCount = this.model.getChildCount(this.model.root);
			var cell = null;
			var index = 0;
			
			do
			{
				cell = this.model.getChildAt(this.model.root, index);
			} while (index++ < childCount && mxUtils.getValue(this.getCellStyle(cell), 'locked', '0') == '1')
			
			if (cell != null)
			{
				this.setDefaultParent(cell);
			}
		}
	};

	/**
	 * Specifies special libraries that are loaded via dynamic JS. Add cases
	 * where the filename cannot be worked out from the package name. The
	 * standard scheme for this mapping is stencils/packagename.xml. If there
	 * are multiple XML files, any JS files or any anomalies in the filename or
	 * directory that contains the file, then an entry must be added here and
	 * in EmbedServlet2 for the loading of the shapes to work.
	 */
	// Required to avoid 404 for mockup.xml since naming of mxgraph.mockup.anchor does not contain
	// buttons even though it is defined in the mxMockupButtons.js file. This could only be fixed
	// with aliases for existing shapes or aliases for basenames, but this is essentially the same.
	mxStencilRegistry.libraries['mockup'] = [SHAPES_PATH + '/mockup/mxMockupButtons.js'];
	
	mxStencilRegistry.libraries['arrows2'] = [SHAPES_PATH + '/mxArrows.js'];
	mxStencilRegistry.libraries['atlassian'] = [STENCIL_PATH + '/atlassian.xml'];
	mxStencilRegistry.libraries['bpmn'] = [SHAPES_PATH + '/bpmn/mxBpmnShape2.js', STENCIL_PATH + '/bpmn.xml'];
	mxStencilRegistry.libraries['er'] = [SHAPES_PATH + '/er/mxER.js'];
	mxStencilRegistry.libraries['ios'] = [SHAPES_PATH + '/mockup/mxMockupiOS.js'];
	mxStencilRegistry.libraries['rackGeneral'] = [SHAPES_PATH + '/rack/mxRack.js', STENCIL_PATH + '/rack/general.xml'];
	mxStencilRegistry.libraries['rackF5'] = [STENCIL_PATH + '/rack/f5.xml'];
	mxStencilRegistry.libraries['lean_mapping'] = [SHAPES_PATH + '/mxLeanMap.js', STENCIL_PATH + '/lean_mapping.xml'];
	mxStencilRegistry.libraries['basic'] = [SHAPES_PATH + '/mxBasic.js', STENCIL_PATH + '/basic.xml'];
	mxStencilRegistry.libraries['ios7icons'] = [STENCIL_PATH + '/ios7/icons.xml'];
	mxStencilRegistry.libraries['ios7ui'] = [SHAPES_PATH + '/ios7/mxIOS7Ui.js', STENCIL_PATH + '/ios7/misc.xml'];
	mxStencilRegistry.libraries['android'] = [SHAPES_PATH + '/mxAndroid.js', STENCIL_PATH + '/android/android.xml'];
	mxStencilRegistry.libraries['electrical/transmission'] = [SHAPES_PATH + '/mxElectrical.js', STENCIL_PATH + '/electrical/transmission.xml'];
	mxStencilRegistry.libraries['mockup/buttons'] = [SHAPES_PATH + '/mockup/mxMockupButtons.js'];
	mxStencilRegistry.libraries['mockup/containers'] = [SHAPES_PATH + '/mockup/mxMockupContainers.js'];
	mxStencilRegistry.libraries['mockup/forms'] = [SHAPES_PATH + '/mockup/mxMockupForms.js'];
	mxStencilRegistry.libraries['mockup/graphics'] = [SHAPES_PATH + '/mockup/mxMockupGraphics.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/markup'] = [SHAPES_PATH + '/mockup/mxMockupMarkup.js'];
	mxStencilRegistry.libraries['mockup/misc'] = [SHAPES_PATH + '/mockup/mxMockupMisc.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/navigation'] = [SHAPES_PATH + '/mockup/mxMockupNavigation.js', STENCIL_PATH + '/mockup/misc.xml'];
	mxStencilRegistry.libraries['mockup/text'] = [SHAPES_PATH + '/mockup/mxMockupText.js'];
	mxStencilRegistry.libraries['floorplan'] = [SHAPES_PATH + '/mxFloorplan.js', STENCIL_PATH + '/floorplan.xml'];
	mxStencilRegistry.libraries['bootstrap'] = [SHAPES_PATH + '/mxBootstrap.js', STENCIL_PATH + '/bootstrap.xml'];
	mxStencilRegistry.libraries['gmdl'] = [SHAPES_PATH + '/mxGmdl.js', STENCIL_PATH + '/gmdl.xml'];
	mxStencilRegistry.libraries['cabinets'] = [SHAPES_PATH + '/mxCabinets.js', STENCIL_PATH + '/cabinets.xml'];
	mxStencilRegistry.libraries['archimate'] = [SHAPES_PATH + '/mxArchiMate.js'];
	mxStencilRegistry.libraries['archimate3'] = [SHAPES_PATH + '/mxArchiMate3.js'];
	mxStencilRegistry.libraries['sysml'] = [SHAPES_PATH + '/mxSysML.js'];
	mxStencilRegistry.libraries['eip'] = [SHAPES_PATH + '/mxEip.js', STENCIL_PATH + '/eip.xml'];
	mxStencilRegistry.libraries['networks'] = [SHAPES_PATH + '/mxNetworks.js', STENCIL_PATH + '/networks.xml'];
	mxStencilRegistry.libraries['aws3d'] = [SHAPES_PATH + '/mxAWS3D.js', STENCIL_PATH + '/aws3d.xml'];
	mxStencilRegistry.libraries['pid2inst'] = [SHAPES_PATH + '/pid2/mxPidInstruments.js'];
	mxStencilRegistry.libraries['pid2misc'] = [SHAPES_PATH + '/pid2/mxPidMisc.js', STENCIL_PATH + '/pid/misc.xml'];
	mxStencilRegistry.libraries['pid2valves'] = [SHAPES_PATH + '/pid2/mxPidValves.js'];
	mxStencilRegistry.libraries['pidFlowSensors'] = [STENCIL_PATH + '/pid/flow_sensors.xml'];

	// Triggers dynamic loading for markers
	mxMarker.getPackageForType = function(type)
	{
		var name = null;
		
		if (type != null && type.length > 0)
		{
			if (type.substring(0, 2) == 'ER')
			{
				name = 'mxgraph.er';
			}
			else if (type.substring(0, 5) == 'sysML')
			{
				name = 'mxgraph.sysml';
			}
		}
		
		return name;
	};
	
	var mxMarkerCreateMarker = mxMarker.createMarker;
	
	mxMarker.createMarker = function(canvas, shape, type, pe, unitX, unitY, size, source, sw, filled)
	{
		if (type != null)
		{
			var f = mxMarker.markers[type];
			
			if (f == null)
			{
				var name = this.getPackageForType(type);
				
				if (name != null)
				{
					mxStencilRegistry.getStencil(name);
				}
			}
		}
		
		return mxMarkerCreateMarker.apply(this, arguments);
	};

	/**
	 * Constructs a new print dialog.
	 */
	PrintDialog.prototype.create = function(editorUi, titleText)
	{
		var graph = editorUi.editor.graph;
		var div = document.createElement('div');
		
		var title = document.createElement('h3');
		title.style.width = '100%';
		title.style.textAlign = 'center';
		title.style.marginTop = '0px';
		mxUtils.write(title, titleText || mxResources.get('print'));
		div.appendChild(title);
		
		var pageCount = 1;
		var currentPage = 1;

		// Pages
		var pagesSection = document.createElement('div');
		pagesSection.style.cssText = 'border-bottom:1px solid lightGray;padding-bottom:12px;margin-bottom:12px;';
		
		var allPagesRadio = document.createElement('input');
		allPagesRadio.style.cssText = 'margin-right:8px;margin-bottom:8px;';
		allPagesRadio.setAttribute('value', 'all');
		allPagesRadio.setAttribute('type', 'radio');
		allPagesRadio.setAttribute('name', 'pages-printdialog');
		
		pagesSection.appendChild(allPagesRadio);

		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('printAllPages'));
		pagesSection.appendChild(span);

		mxUtils.br(pagesSection);

		// Pages ... to ...
		var pagesRadio = allPagesRadio.cloneNode(true);
		allPagesRadio.setAttribute('checked', 'checked');
		pagesRadio.setAttribute('value', 'range');
		pagesSection.appendChild(pagesRadio);
		
		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('pages') + ':');
		pagesSection.appendChild(span);
		
		var pagesFromInput = document.createElement('input');
		pagesFromInput.style.cssText = 'margin:0 8px 0 8px;'
		pagesFromInput.setAttribute('value', '1');
		pagesFromInput.setAttribute('type', 'number');
		pagesFromInput.setAttribute('min', '1');
		pagesFromInput.style.width = '50px';
		pagesSection.appendChild(pagesFromInput);
		
		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('to'));
		pagesSection.appendChild(span);
		
		var pagesToInput = pagesFromInput.cloneNode(true);
		pagesSection.appendChild(pagesToInput);

		mxEvent.addListener(pagesFromInput, 'focus', function()
		{
			pagesRadio.checked = true;
		});
		
		mxEvent.addListener(pagesToInput, 'focus', function()
		{
			pagesRadio.checked = true;
		});
		
		function validatePageRange()
		{
			pagesToInput.value = Math.max(1, Math.min(pageCount, Math.max(parseInt(pagesToInput.value), parseInt(pagesFromInput.value))));
			pagesFromInput.value = Math.max(1, Math.min(pageCount, Math.min(parseInt(pagesToInput.value), parseInt(pagesFromInput.value))));
		};
		
		mxEvent.addListener(pagesFromInput, 'change', validatePageRange);
		mxEvent.addListener(pagesToInput, 'change', validatePageRange);
		
		if (editorUi.pages != null)
		{
			pageCount = editorUi.pages.length;

			if (editorUi.currentPage != null)
			{
				for (var i = 0; i < editorUi.pages.length; i++)
				{
					if (editorUi.currentPage == editorUi.pages[i])
					{
						currentPage = i + 1;
						pagesFromInput.value = currentPage;
						pagesToInput.value = currentPage;
						break;
					}
				}
			}
		}
		
		pagesFromInput.setAttribute('max', pageCount);
		pagesToInput.setAttribute('max', pageCount);		
		
		if (pageCount > 1)
		{
			div.appendChild(pagesSection);
		}
		
		// Adjust to ...
		var adjustSection = document.createElement('div');
		adjustSection.style.marginBottom = '10px';
		
		var adjustRadio = document.createElement('input');
		adjustRadio.style.marginRight = '8px';
		
		adjustRadio.setAttribute('value', 'adjust');
		adjustRadio.setAttribute('type', 'radio');
		adjustRadio.setAttribute('name', 'printZoom');
		adjustSection.appendChild(adjustRadio);

		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('adjustTo'));
		adjustSection.appendChild(span);
		
		var zoomInput = document.createElement('input');
		zoomInput.style.cssText = 'margin:0 8px 0 8px;';
		zoomInput.setAttribute('value', '100 %');
		zoomInput.style.width = '50px';
		adjustSection.appendChild(zoomInput);
		
		mxEvent.addListener(zoomInput, 'focus', function()
		{
			adjustRadio.checked = true;
		});
		
		div.appendChild(adjustSection);

		// Fit to ...
		var fitSection = pagesSection.cloneNode(false);

		var fitRadio = adjustRadio.cloneNode(true);
		fitRadio.setAttribute('value', 'fit');
		adjustRadio.setAttribute('checked', 'checked');
		
		var spanFitRadio = document.createElement('div');
		spanFitRadio.style.cssText = 'display:inline-block;height:100%;vertical-align:top;padding-top:2px;';
		spanFitRadio.appendChild(fitRadio);
		fitSection.appendChild(spanFitRadio);
		
		var table = document.createElement('table');
		table.style.display = 'inline-block';
		var tbody = document.createElement('tbody');
		
		var row1 = document.createElement('tr');
		var row2 = row1.cloneNode(true);
		
		var td1 = document.createElement('td');
		var td2 = td1.cloneNode(true);
		var td3 = td1.cloneNode(true);
		
		var td4 = td1.cloneNode(true);
		var td5 = td1.cloneNode(true);
		var td6 = td1.cloneNode(true);
		
		td1.style.textAlign = 'right';
		td4.style.textAlign = 'right';

		mxUtils.write(td1, mxResources.get('fitTo'));
		
		var sheetsAcrossInput = document.createElement('input');
		sheetsAcrossInput.style.cssText = 'margin:0 8px 0 8px;';
		sheetsAcrossInput.setAttribute('value', '1');
		sheetsAcrossInput.setAttribute('min', '1');
		sheetsAcrossInput.setAttribute('type', 'number');
		sheetsAcrossInput.style.width = '40px';
		td2.appendChild(sheetsAcrossInput);
		
		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('fitToSheetsAcross'));
		td3.appendChild(span);

		mxUtils.write(td4, mxResources.get('fitToBy'));
		
		var sheetsDownInput = sheetsAcrossInput.cloneNode(true);
		td5.appendChild(sheetsDownInput);
		
		mxEvent.addListener(sheetsAcrossInput, 'focus', function()
		{
			fitRadio.checked = true;
		});

		mxEvent.addListener(sheetsDownInput, 'focus', function()
		{
			fitRadio.checked = true;
		});

		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('fitToSheetsDown'));
		td6.appendChild(span);
		
		row1.appendChild(td1);
		row1.appendChild(td2);
		row1.appendChild(td3);
		
		row2.appendChild(td4);
		row2.appendChild(td5);
		row2.appendChild(td6);
		
		tbody.appendChild(row1);
		tbody.appendChild(row2);
		table.appendChild(tbody);
		fitSection.appendChild(table);
		
		div.appendChild(fitSection);
		
		// Page scale ...
		var pageScaleSection = document.createElement('div');

		var span = document.createElement('div');
		span.style.fontWeight = 'bold';
		span.style.marginBottom = '12px';
		mxUtils.write(span, mxResources.get('paperSize'));
		pageScaleSection.appendChild(span);
		
		var span = document.createElement('div');
		span.style.marginBottom = '12px';

		var accessor = PageSetupDialog.addPageFormatPanel(span, 'printdialog',
			editorUi.editor.graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT);
		pageScaleSection.appendChild(span);
		
		var span = document.createElement('span');
		mxUtils.write(span, mxResources.get('pageScale'));
		pageScaleSection.appendChild(span);
		
		var pageScaleInput = document.createElement('input');
		pageScaleInput.style.cssText = 'margin:0 8px 0 8px;';
		pageScaleInput.setAttribute('value', '100 %');
		pageScaleInput.style.width = '60px';
		pageScaleSection.appendChild(pageScaleInput);
		
		div.appendChild(pageScaleSection);
		
		// Buttons
		var buttons = document.createElement('div');
		buttons.style.cssText = 'text-align:right;margin:62px 0 0 0;';
		
		// Overall scale for print-out to account for print borders in dialogs etc
		function preview(print)
		{
			var printScale = parseInt(pageScaleInput.value) / 100;
			
			if (isNaN(printScale))
			{
				printScale = 1;
				pageScaleInput.value = '100 %';
			}
			
			// Workaround to match available paper size in actual print output
			printScale *= 0.75;
			
			function printGraph(thisGraph, pv, forcePageBreaks)
			{
				// Negative coordinates are cropped or shifted if page visible
				var gb = thisGraph.getGraphBounds();
				var border = 0;
				var x0 = 0;
				var y0 = 0;
		
				var pf = accessor.get();
				var scale = 1 / thisGraph.pageScale;
				var autoOrigin = fitRadio.checked;
		
				if (autoOrigin)
				{
					var h = parseInt(sheetsAcrossInput.value);
					var v = parseInt(sheetsDownInput.value);
					
					scale = Math.min((pf.height * v) / (gb.height / thisGraph.view.scale),
						(pf.width * h) / (gb.width / thisGraph.view.scale));
				}
				else
				{
					scale = parseInt(zoomInput.value) / (100 * thisGraph.pageScale);
					
					if (isNaN(scale))
					{
						printScale = 1 / thisGraph.pageScale;
						zoomInput.value = '100 %';
					}
				}
		
				// Applies print scale
				pf = mxRectangle.fromRectangle(pf);
				pf.width = Math.ceil(pf.width * printScale);
				pf.height = Math.ceil(pf.height * printScale);
				scale *= printScale;
				
				// Starts at first visible page
				if (!autoOrigin && thisGraph.pageVisible)
				{
					var layout = thisGraph.getPageLayout();
					x0 -= layout.x * pf.width;
					y0 -= layout.y * pf.height;
				}
				else
				{
					autoOrigin = true;
				}

				if (pv == null)
				{
					pv = PrintDialog.createPrintPreview(thisGraph, scale, pf, border, x0, y0, autoOrigin);
					pv.pageSelector = false;
					pv.mathEnabled = false;
					
					var file = editorUi.getCurrentFile();
					
					if (file != null)
					{
						pv.title = file.getTitle();
					}
					
					var writeHead = pv.writeHead;
					
					// Overridden to add custom fonts
					pv.writeHead = function(doc)
					{
						writeHead.apply(this, arguments);
						
						if (editorUi.editor.fontCss != null)
						{
							doc.writeln('<style type="text/css">');
							doc.writeln(editorUi.editor.fontCss);
							doc.writeln('</style>');
						}
					};
					
					if (typeof(MathJax) !== 'undefined')
					{
						// Adds class to ignore if math is disabled
						var printPreviewRenderPage = pv.renderPage;
						
						pv.renderPage = function(w, h, dx, dy, content, pageNumber)
						{
							var result = printPreviewRenderPage.apply(this, arguments);
							
							if (this.graph.mathEnabled)
							{
								this.mathEnabled = true;
							}
							else
							{
								result.className = 'geDisableMathJax';
							}
							
							return result;
						};
					}
					
					pv.open(null, null, forcePageBreaks, true);
				}
				else
				{				
					var bg = thisGraph.background;
					
					if (bg == null || bg == '' || bg == mxConstants.NONE)
					{
						bg = '#ffffff';
					}
					
					pv.backgroundColor = bg;
					pv.autoOrigin = autoOrigin;
					pv.appendGraph(thisGraph, scale, x0, y0, forcePageBreaks, true);
				}
				
				return pv;
			};
			
			var pagesFrom = pagesFromInput.value;
			var pagesTo = pagesToInput.value;
			var ignorePages = !allPagesRadio.checked;
			var pv = null;
						
			if (ignorePages)
			{
				ignorePages = pagesFrom == currentPage && pagesTo == currentPage;
			}
			
			if (!ignorePages && editorUi.pages != null && editorUi.pages.length)
			{
				var i0 = 0;
				var imax = editorUi.pages.length - 1;
				
				if (!allPagesRadio.checked)
				{
					i0 = parseInt(pagesFrom) - 1;
					imax = parseInt(pagesTo) - 1;
				}
				
				for (var i = i0; i <= imax; i++)
				{
					var page = editorUi.pages[i];
					var tempGraph = (page == editorUi.currentPage) ? graph : null;
					
					if (tempGraph == null)
					{
						tempGraph = editorUi.createTemporaryGraph(graph.getStylesheet());

						// Restores graph settings that are relevant for printing
						var pageVisible = true;
						var mathEnabled = false;
						var bg = null;
						var bgImage = null;
						
						if (page.viewState == null && page.mapping == null)
						{
							// Workaround to extract view state from XML node
							// This changes the state of the page and parses
							// the XML for the graph model even if not needed.
							if (page.root == null)
							{
								editorUi.updatePageRoot(page);
							}
						}
						
						if (page.viewState != null)
						{
							pageVisible = page.viewState.pageVisible;
							mathEnabled = page.viewState.mathEnabled;
							bg = page.viewState.background;
							bgImage = page.viewState.backgroundImage;
						}
						else if (page.mapping != null && page.mapping.diagramMap != null)
						{
							// Default pageVisible in realtime is true
							mathEnabled = page.mapping.diagramMap.get('mathEnabled') != '0';
							bg = page.mapping.diagramMap.get('background');
							
							var temp = page.mapping.diagramMap.get('backgroundImage');
							bgImage = (temp != null && temp.length > 0) ? JSON.parse(temp) : null;
						}
					
						tempGraph.background = bg;
						tempGraph.backgroundImage = (bgImage != null) ? new mxImage(bgImage.src, bgImage.width, bgImage.height) : null;
						tempGraph.pageVisible = pageVisible;
						tempGraph.mathEnabled = mathEnabled;
						
						// Redirects placeholders to current page
						var graphGetGlobalVariable = tempGraph.getGlobalVariable;
		
						tempGraph.getGlobalVariable = function(name)
						{
							if (name == 'page')
							{
								return page.getName();
							}
							else if (name == 'pagenumber')
							{
								return i + 1;
							}
							
							return graphGetGlobalVariable.apply(this, arguments);
						};
						
						document.body.appendChild(tempGraph.container);
						editorUi.updatePageRoot(page);
						tempGraph.model.setRoot(page.root);
					}

					pv = printGraph(tempGraph, pv, i != imax);

					if (tempGraph != graph)
					{
						tempGraph.container.parentNode.removeChild(tempGraph.container);
					}
				}
			}
			else
			{
				pv = printGraph(graph);
			}
			
			if (pv.mathEnabled)
			{
				var doc = pv.wnd.document;
		
				doc.writeln('<script type="text/x-mathjax-config">');
				doc.writeln('MathJax.Hub.Config({');
				doc.writeln('messageStyle: "none",');
				doc.writeln('jax: ["input/TeX", "input/MathML", "input/AsciiMath", "output/HTML-CSS"],');
				doc.writeln('extensions: ["tex2jax.js", "mml2jax.js", "asciimath2jax.js"],');
				doc.writeln('TeX: {');
				doc.writeln('extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]');
				doc.writeln('},');
							// Ignores math in in-place editor
				doc.writeln('tex2jax: {');
				doc.writeln('	ignoreClass: "geDisableMathJax"');
			  	doc.writeln('},');
			  	doc.writeln('asciimath2jax: {');
				doc.writeln('	ignoreClass: "geDisableMathJax"');
			  	doc.writeln('}');
				doc.writeln('});');
				
				// Adds asynchronous printing when MathJax finished rendering
				if (print)
				{
					doc.writeln('MathJax.Hub.Queue(function () {');
					doc.writeln('window.print();');
					doc.writeln('});');
				}
				
				doc.writeln('</script>');
				doc.writeln('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"></script>');
			}
			
			pv.closeDocument();
			
			if (!pv.mathEnabled && print)
			{
				PrintDialog.printPreview(pv);
			}
		};
		
		var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
		{
			editorUi.hideDialog();
		});
		cancelBtn.className = 'geBtn';
		
		if (editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
		}
		
		if (!editorUi.isOffline())
		{
			var helpBtn = mxUtils.button(mxResources.get('help'), function()
			{
				window.open('https://desk.draw.io/support/solutions/articles/16000048947');
			});
			
			helpBtn.className = 'geBtn';
			buttons.appendChild(helpBtn);
		}
		
		if (PrintDialog.previewEnabled)
		{
			var previewBtn = mxUtils.button(mxResources.get('preview'), function()
			{
				editorUi.hideDialog();
				preview(false);
			});
			previewBtn.className = 'geBtn';
			buttons.appendChild(previewBtn);
		}
		
		var printBtn = mxUtils.button(mxResources.get((!PrintDialog.previewEnabled) ? 'ok' : 'print'), function()
		{
			editorUi.hideDialog();
			preview(true);
		});
		printBtn.className = 'geBtn gePrimaryBtn';
		buttons.appendChild(printBtn);
		
		if (!editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
		}

		div.appendChild(buttons);

		this.container = div;
	};
})();

/**
 * Change types
 */
function ChangeShadow(ui, visible)
{
	this.ui = ui;
	this.visible = visible;
	this.previous = this.visible;
}

/**
 * Implementation of the undoable page rename.
 */
ChangeShadow.prototype.execute = function()
{
	this.visible = this.previous;
	this.previous = this.ui.editor.graph.shadowVisible;
	this.ui.editor.graph.setShadowVisible(this.visible);
};

//Registers codec for ChangePageSetup
(function()
{
	var codec = new mxObjectCodec(new ChangeShadow(),  ['ui', 'previous']);

	/**
	 * Function: afterDecode
	 *
	 * Restores the state by assigning the previous value.
	 */
	codec.afterDecode = function(dec, node, obj)
	{
		obj.previous = obj.visible;

		return obj;
	};

	mxCodecRegistry.register(codec);
})();
