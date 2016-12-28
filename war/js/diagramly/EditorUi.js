/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
(function()
{
	/**
	 * Version
	 */
	EditorUi.VERSION = '@DRAWIO-VERSION@';
	
	/**
	 * Overrides compact UI setting.
	 */
	EditorUi.compactUi = uiTheme != 'atlas';

	/**
	 * Overrides compact UI setting.
	 */
	EditorUi.isElectronApp = window && window.process && window.process.type; // https://github.com/electron/electron/issues/2288
		
	/**
	 * 
	 */
	EditorUi.plusImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/plus.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDdCMTdENjVCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDdCMTdENjZCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowN0IxN0Q2M0I4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowN0IxN0Q2NEI4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtjrjmgAAAAtSURBVHjaYvz//z8DMigvLwcLdHZ2MiKLMzEQCaivkLGsrOw/dU0cAr4GCDAARQsQbTFrv10AAAAASUVORK5CYII=';
	
	/**
	 * 
	 */
	EditorUi.spinImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/spin.gif' : 'data:image/gif;base64,R0lGODlhDAAMAPUxAEVriVp7lmCAmmGBm2OCnGmHn3OPpneSqYKbr4OcsIScsI2kto6kt46lt5KnuZmtvpquvpuvv56ywaCzwqK1xKu7yay9yq+/zLHAzbfF0bjG0bzJ1LzK1MDN18jT28nT3M3X3tHa4dTc49Xd5Njf5dng5t3k6d/l6uDm6uru8e7x8/Dz9fT29/b4+Pj5+fj5+vr6+v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkKADEAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAADAAMAAAGR8CYcEgsOgYAIax4CCQuQldrCBEsiK8VS2hoFGOrlJDA+cZQwkLnqyoJFZKviSS0ICrE0ec0jDAwIiUeGyBFGhMPFBkhZo1BACH5BAkKAC4ALAAAAAAMAAwAhVB0kFR3k1V4k2CAmmWEnW6Lo3KOpXeSqH2XrIOcsISdsImhtIqhtJCmuJGnuZuwv52wwJ+ywZ+ywqm6yLHBzbLCzrXEz7fF0LnH0rrI0r7L1b/M1sXR2cfT28rV3czW3s/Z4Nfe5Nvi6ODm6uLn6+Ln7OLo7OXq7efs7+zw8u/y9PDy9PX3+Pr7+////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZDQJdwSCxGDAIAoVFkFBwYSyIwGE4OkCJxIdG6WkJEx8sSKj7elfBB0a5SQg1EQ0SVVMPKhDM6iUIkRR4ZFxsgJl6JQQAh+QQJCgAxACwAAAAADAAMAIVGa4lcfZdjgpxkg51nhp5ui6N3kqh5lKqFnbGHn7KIoLOQp7iRp7mSqLmTqbqarr6br7+fssGitcOitcSuvsuuv8uwwMyzw861xNC5x9K6x9K/zNbDztjE0NnG0drJ1NzQ2eDS2+LT2+LV3ePZ4Oba4ebb4ufc4+jm6+7t8PLt8PPt8fPx8/Xx9PX09vf19/j3+Pn///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQ8CYcEgsUhQFggFSjCQmnE1jcBhqGBXiIuAQSi7FGEIgfIzCFoCXFCZiPO0hKBMiwl7ET6eUYqlWLkUnISImKC1xbUEAIfkECQoAMgAsAAAAAAwADACFTnKPT3KPVHaTYoKcb4yjcY6leZSpf5mtgZuvh5+yiqG0i6K1jqW3kae5nrHBnrLBn7LCoLPCobTDqbrIqrvIs8LOtMPPtcPPtcTPuMbRucfSvcrUvsvVwMzWxdHaydTcytXdzNbezdff0drh2ODl2+Ln3eTp4Obq4ujs5Ont5uvu6O3w6u7w6u7x7/L09vj5+vr7+vv7////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkdAmXBILHIcicOCUqxELKKPxKAYgiYd4oMAEWo8RVmjIMScwhmBcJMKXwLCECmMGAhPI1QRwBiaSixCMDFhLSorLi8wYYxCQQAh+QQJCgAxACwAAAAADAAMAIVZepVggJphgZtnhp5vjKN2kah3kqmBmq+KobSLorWNpLaRp7mWq7ybr7+gs8KitcSktsWnuManucexwM2ywc63xtG6yNO9ytS+ytW/zNbDz9jH0tvL1d3N197S2+LU3OPU3ePV3eTX3+Xa4efb4ufd5Onl6u7r7vHs7/Lt8PLw8/Xy9Pby9fb09ff2+Pn3+Pn6+vr///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGSMCYcEgseiwSR+RS7GA4JFGF8RiWNiEiJTERgkjFGAQh/KTCGoJwpApnBkITKrwoCFWnFlEhaAxXLC9CBwAGRS4wQgELYY1CQQAh+QQJCgAzACwAAAAADAAMAIVMcI5SdZFhgZtti6JwjaR4k6mAma6Cm6+KobSLorWLo7WNo7aPpredsMCescGitMOitcSmuMaqu8ixwc2zws63xdC4xtG5x9K9ytXAzdfCztjF0NnF0drK1d3M1t7P2N/P2eDT2+LX3+Xe5Onh5+vi5+vj6Ozk6e3n7O/o7O/q7vHs7/Lt8PPu8fPx8/X3+Pn6+vv7+/v8/Pz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRcCZcEgsmkIbTOZTLIlGqZNnchm2SCgiJ6IRqljFmQUiXIVnoITQde4chC9Y+LEQxmTFRkFSNFAqDAMIRQoCAAEEDmeLQQAh+QQJCgAwACwAAAAADAAMAIVXeZRefplff5lhgZtph59yjqV2kaeAmq6FnbGFnrGLorWNpLaQp7mRqLmYrb2essGgs8Klt8apusitvcquv8u2xNC7yNO8ydS8ytTAzdfBzdfM1t7N197Q2eDU3OPX3+XZ4ObZ4ebc4+jf5erg5erg5uvp7fDu8fPv8vTz9fb09vf19/j3+Pn4+fn5+vr6+/v///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRUCYcEgspkwjEKhUVJ1QsBNp0xm2VixiSOMRvlxFGAcTJook5eEHIhQcwpWIkAFQECkNy9AQWFwyEAkPRQ4FAwQIE2llQQAh+QQJCgAvACwAAAAADAAMAIVNcY5SdZFigptph6BvjKN0kKd8lquAmq+EnbGGn7KHn7ONpLaOpbearr+csMCdscCescGhtMOnuMauvsuzws60w862xdC9ytW/y9a/zNbCztjG0drH0tvK1N3M1t7N19/U3ePb4uff5urj6Ozk6e3l6u7m6u7o7PDq7vDt8PPv8vTw8vTw8/X19vf6+vv///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQ8CXcEgsvlytVUplJLJIpSEDUESFTELBwSgCCQEV42kjDFiMo4uQsDB2MkLHoEHUTD7DRAHC8VAiZ0QSCgYIDxhNiUEAOw==';
	
	/**
	 * Contains the default XML for an empty diagram.
	 */
	EditorUi.prototype.emptyDiagramXml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>';

	/**
	 * 
	 */
	EditorUi.prototype.emptyLibraryXml = '<mxlibrary>[]</mxlibrary>';
	
	/**
	 * Sets the delay for autosave in milliseconds. Default is 2000.
	 */
	EditorUi.prototype.mode = null;

	/**
	 * Allows for two buttons in the sidebar footer.
	 */
	EditorUi.prototype.sidebarFooterHeight = (uiTheme == 'atlas') ? 36 : 36;

	/**
	 * Specifies the default custom shape style.
	 */
	EditorUi.prototype.defaultCustomShapeStyle = 'shape=stencil(tZRtTsQgEEBPw1+DJR7AoN6DbWftpAgE0Ortd/jYRGq72R+YNE2YgTePloEJGWblgA18ZuKFDcMj5/Sm8boZq+BgjCX4pTyqk6ZlKROitwusOMXKQDODx5iy4pXxZ5qTHiFHawxB0JrQZH7lCabQ0Fr+XWC1/E8zcsT/gAi+Subo2/3Mh6d/oJb5nU1b5tW7r2knautaa3T+U32o7f7vZwpJkaNDLORJjcu7t59m2jXxqX9un+tt022acsfmoKaQZ+vhhswZtS6Ne/ThQGt0IV0N3Yyv6P3CeT9/tHO0XFI5cAE=);whiteSpace=wrap;html=1;';

	/**
	 * Defines the maximum size for images.
	 */
	EditorUi.prototype.maxBackgroundSize = 1600;

	/**
	 * Defines the maximum size for images.
	 */
	EditorUi.prototype.maxImageSize = 520;

	/**
	 * Images above 100K should be resampled.
	 */
	EditorUi.prototype.resampleThreshold = 100000;

	/**
	 * Maximum allowed size for images is 1 MB.
	 */
	EditorUi.prototype.maxImageBytes = 1000000;

	/**
	 * Maximum size for background images is 2.5 MB.
	 */
	EditorUi.prototype.maxBackgroundBytes = 2500000;

	/**
	 * Holds the current file.
	 */
	EditorUi.prototype.currentFile = null;

	/**
	 * Capability check for canvas export
	 */
	(function()
	{
		EditorUi.prototype.useCanvasForExport = false;
		
		try
		{
			var canvas = document.createElement('canvas');
			var img = new Image();
			
			// LATER: Capability check should not be async
			img.onload = function()
			{
				try
				{
			   		var ctx = canvas.getContext('2d');
			   		ctx.drawImage(img, 0, 0);

					// LATER: Fix security error caused by foreignObjects in Safari for toDataUri (tainted canvas)
					var result = canvas.toDataURL('image/png');
					EditorUi.prototype.useCanvasForExport = result != null && result.length > 6;
				}
				catch (e)
				{
					// ignore
				}
			};

			// Checks if SVG with foreignObject can be exported
			var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1px" height="1px" version="1.1"><foreignObject pointer-events="all" width="1" height="1"><div xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject></svg>';
			img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
		}
		catch (e)
		{
			// ignore
		}
	})();

	/**
	 * Abstraction for local storage access.
	 */
	EditorUi.prototype.getLocalData = function(key, fn)
	{
		fn(localStorage.getItem(key));
	};
	
	/**
	 * Abstraction for local storage access.
	 */
	EditorUi.prototype.setLocalData = function(key, data, fn)
	{
		localStorage.setItem(key, data);
		fn();
	};
	
	/**
	 * Abstraction for local storage access.
	 */
	EditorUi.prototype.removeLocalData = function(key, fn)
	{
		localStorage.removeItem(key)
		fn();
	};

	EditorUi.prototype.setMathEnabled = function(value)
	{
		this.editor.graph.mathEnabled = value;
		this.editor.updateGraphComponents();
		this.editor.graph.refresh();
		
		this.fireEvent(new mxEventObject('mathEnabledChanged'));
	};

	EditorUi.prototype.isMathEnabled = function(value)
	{
		return this.editor.graph.mathEnabled;
	};
	
	// Helper method to move picket to top
	EditorUi.prototype.movePickersToTop = function()
	{
		var divs = document.getElementsByTagName('div');
		
		for (var i = 0; i < divs.length; i++)
		{
			if (divs[i].className == 'picker modal-dialog picker-dialog')
			{
				divs[i].style.zIndex = mxPopupMenu.prototype.zIndex + 1;
			}
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.isOfflineApp = function()
	{
		return (urlParams['offline'] == '1');
	};

	/**
	 * Returns true if this offline app is offline.
	 */
	EditorUi.prototype.isOffline = function()
	{
		// In FF navigator.onLine is always true
		return (mxClient.IS_FF && this.isOfflineApp()) || !navigator.onLine || urlParams['stealth'] == '1';
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createSpinner = function(x, y, size)
	{
		size = (size != null) ? size : 24;

		var spinner = new Spinner({
			lines: 12, // The number of lines to draw
			length: size, // The length of each line
			width: Math.round(size / 3), // The line thickness
			radius: Math.round(size / 2), // The radius of the inner circle
			rotate: 0, // The rotation offset
			color: '#000', // #rgb or #rrggbb
			speed: 1.5, // Rounds per second
			trail: 60, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: false, // Whether to use hardware acceleration
			zIndex: 2e9 // The z-index (defaults to 2000000000)
		});

		// Extends spin method to include an optional label
		var oldSpin = spinner.spin;
		
		spinner.spin = function(container, label)
		{
			var result = false;
			
			if (!this.active)
			{
				oldSpin.call(this, container);
				this.active = true;
				
				if (label != null)
				{
					var status = document.createElement('div');
					status.style.position = 'absolute';
					status.style.whiteSpace = 'nowrap';
					status.style.background = '#4B4243';
					status.style.color = 'white';
					status.style.fontFamily = 'Helvetica, Arial';
					status.style.fontSize = '9pt';
					status.style.padding = '6px';
					status.style.paddingLeft = '10px';
					status.style.paddingRight = '10px';
					status.style.zIndex = 2e9;
					status.style.left = Math.max(0, x) + 'px';
					status.style.top = Math.max(0, y + 70) + 'px';
					
					mxUtils.setPrefixedStyle(status.style, 'borderRadius', '6px');
					mxUtils.setPrefixedStyle(status.style, 'boxShadow', '2px 2px 3px 0px #ddd');
					mxUtils.setPrefixedStyle(status.style, 'transform', 'translate(-50%,-50%)');
					
					status.innerHTML = label + '...';
					container.appendChild(status);
					spinner.status = status;
					
					// Centers the label in older IE versions
					if (mxClient.IS_VML && (document.documentMode == null || document.documentMode <= 8))
					{
						status.style.left = Math.round(Math.max(0, x - status.offsetWidth / 2)) + 'px';
						status.style.top = Math.round(Math.max(0, y + 70 - status.offsetHeight / 2)) + 'px';
					}
				}
				
				// Pause returns a function to resume the spinner
				this.pause = mxUtils.bind(this, function()
				{
					var fn = function() { };
					
					if (this.active)
					{
						fn = mxUtils.bind(this, function()
						{
							this.spin(container, label);
						});
					}
					
					this.stop();
					
					return fn;
				});
				
				result = true;
			}
				
			return result;
		};
		
		// Extends stop method to remove the optional label
		var oldStop = spinner.stop;
		
		spinner.stop = function()
		{
			oldStop.call(this);
			this.active = false;
			
			if (spinner.status != null)
			{
				spinner.status.parentNode.removeChild(spinner.status);
				spinner.status = null;
			}
		};
		
		return spinner;
	};

	/**
	 * Static method for pasing PNG files.
	 */
	EditorUi.parsePng = function(f, fn, error)
	{
		var pos = 0;
		
		function fread(d, count)
		{
			var start = pos;
			pos += count;
			
			return d.substring(start, pos);
		};
		
		// Reads unsigned long 32 bit big endian
		function _freadint(d)
		{
			var bytes = fread(d, 4);
			
			return bytes.charCodeAt(3) + (bytes.charCodeAt(2) << 8) +
				(bytes.charCodeAt(1) << 16) + (bytes.charCodeAt(0) << 24);
		};
		
		// Checks signature
		if (fread(f,8) != String.fromCharCode(137) + 'PNG' + String.fromCharCode(13, 10, 26, 10))
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		// Reads header chunk
		fread(f,4);
		
		if (fread(f,4) != 'IHDR')
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		fread(f, 17);
		
		do
		{
			var n = _freadint(f);
			var type = fread(f,4);
			
			if (fn != null)
			{
				if (fn(pos - 8, type, n))
				{
					break;
				}
			}
			
			value = fread(f,n);
			fread(f,4);
			
			if (type == 'IEND')
			{
				break;
			}
		}
		while (n);
	};

	/**
	 * Returns true if the given string contains a compatible graph model.
	 */
	EditorUi.prototype.isCompatibleString = function(data)
	{
		try
		{
			var doc = mxUtils.parseXml(data);
			var node = this.editor.extractGraphModel(doc.documentElement);
			
			return node != null && node.getElementsByTagName('parsererror').length == 0;
		}
		catch (e)
		{
			// ignore
		}
		
		return false;
	};

	/**
	 * Extracts the mxfile from the given HTML data from a data transfer event.
	 */
	var editorUiExtractGraphModelFromHtml = EditorUi.prototype.extractGraphModelFromHtml;
	EditorUi.prototype.extractGraphModelFromHtml = function(data)
	{
		var result = editorUiExtractGraphModelFromHtml.apply(this, arguments);
		
		if (result == null)
		{
			try
			{
		    	var idx = data.indexOf('&lt;mxfile ');
		    	
		    	if (idx >= 0)
		    	{
		    		var idx2 = data.lastIndexOf('&lt;/mxfile&gt;');
		    		
		    		if (idx2 > idx)
		    		{
		    			result = data.substring(idx, idx2 + 15).replace(/&gt;/g, '>').
		    				replace(/&lt;/g, '<').replace(/\\&quot;/g, '"').replace(/\n/g, '');
		    		}
		    	}
		    	else
		    	{
		    		// Gets compressed data from mxgraph element in HTML document
					var doc = mxUtils.parseXml(data);
					var node = this.editor.extractGraphModel(doc.documentElement);
					result = (node != null) ? mxUtils.getXml(node) : '';
		    	}
			}
			catch (e)
			{
				// ignore
			}
		}
		
		return result;
	};
		
	/**
	 * Workaround for malformed xhtml meta element bug 07.08.16. The trailing slash was missing causing
	 * reopen to fail trying to parse. Used in replaceFileData, setFileData and importFile.
	 */
	EditorUi.prototype.validateFileData = function(data)
	{
		if (data != null && data.length > 0)
		{
			var index = data.indexOf('<meta charset="utf-8">');
			
			if (index >= 0)
			{
				var replaceString = '<meta charset="utf-8"/>';
				var replaceStrLen = replaceString.length;
				data = data.slice(0, index) + replaceString + data.slice(index + replaceStrLen - 1, data.length);
			}
		}
		
		return data;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.replaceFileData = function(data)
	{
		data = this.validateFileData(data);
		var node = (data != null && data.length > 0) ? mxUtils.parseXml(data).documentElement : null;

		// Some nodes must be extracted here to find the mxfile node
		// LATER: Remove duplicate call to extractGraphModel in overridden setGraphXml
		var tmp = (node != null) ? this.editor.extractGraphModel(node, true) : null;
		
		if (tmp != null)
		{
			node = tmp;
		}

		if (node != null)
		{
			var graph = this.editor.graph;
			
			graph.model.beginUpdate();
			try
			{
				var oldPages = (this.pages != null) ? this.pages.slice() : null;
				var nodes = node.getElementsByTagName('diagram');

				if (urlParams['pages'] != '0' || nodes.length > 1 ||
					(nodes.length == 1 && nodes[0].hasAttribute('name')))
				{
					this.fileNode = node;
					this.pages = (this.pages != null) ? this.pages : [];
					
					// Wraps page nodes
					for (var i = nodes.length - 1; i >= 0; i--)
					{
						var page = this.updatePageRoot(new DiagramPage(nodes[i]));
						
						// Checks for invalid page names
						if (page.getName() == null)
						{
							page.setName(mxResources.get('pageWithNumber', [i + 1]));
						}

						graph.model.execute(new ChangePage(this, page, (i == 0) ? page : null, 0));
					}
				}
				else
				{
					// Creates tabbed file structure if enforced by URL
					if (urlParams['pages'] != '0' && this.fileNode == null)
					{
						this.fileNode = node.ownerDocument.createElement('mxfile');
						this.currentPage = new DiagramPage(node.ownerDocument.createElement('diagram'));
						this.currentPage.setName(mxResources.get('pageWithNumber', [1]));
						graph.model.execute(new ChangePage(this, this.currentPage, this.currentPage, 0));
					}
					
					// Avoids scroll offset when switching page
					this.editor.setGraphXml(node);
					
					// Avoids duplicate parsing of the XML stored in the node
					if (this.currentPage != null)
					{
						this.currentPage.root = this.editor.graph.model.root;
					}
				}
				
				if (oldPages != null)
				{
					for (var i = 0; i < oldPages.length; i++)
					{
						graph.model.execute(new ChangePage(this, oldPages[i], null));
					}
				}
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createFileData = function(node, graph, file, url, forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection)
	{
		graph = (graph != null) ? graph : this.editor.graph;
		forceXml = (forceXml != null) ? forceXml : false;
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		
		var editLink = null;
		var redirect = null;
		
		if (file == null || file.getMode() == App.MODE_DEVICE || file.getMode() == App.MODE_BROWSER)
		{
			editLink = '_blank';
		}
		else
		{
			editLink = url;
			redirect = editLink;
		}
			
		if (node == null)
		{
			return '';
		}
		else
		{
			var fileNode = node;
	
			// Ignores case for possible HTML or XML nodes
			if (fileNode.nodeName.toLowerCase() != 'mxfile')
			{
				// Removes control chars in input for correct roundtrip check
				var text = graph.zapGremlins(mxUtils.getXml(node));
				var data = graph.compress(text);
				
				// Fallback to plain XML for invalid compression
				// TODO: Remove this fallback with active pages
				if (graph.decompress(data) != text)
				{
					return text;
				}
				else
				{
					var diagramNode = node.ownerDocument.createElement('diagram');
					mxUtils.setTextContent(diagramNode, data);
					
					fileNode = node.ownerDocument.createElement('mxfile');
					fileNode.appendChild(diagramNode);
				}
			}
	
			fileNode.setAttribute('userAgent', navigator.userAgent);
			fileNode.setAttribute('version', EditorUi.VERSION);
			fileNode.setAttribute('editor', 'www.draw.io');
	
			var md = (file != null) ? file.getMode() : this.mode;
			
			if (md != null)
			{
				fileNode.setAttribute('type', md);
			}
					
			var xml = mxUtils.getXml(fileNode);
			
			// Writes the file as an embedded HTML file
			if (!forceSvg && !forceXml && (forceHtml || (file != null && /(\.html)$/i.test(file.getTitle()))))
			{
				xml = this.getHtml2(mxUtils.getXml(fileNode), graph, (file != null) ? file.getTitle() : null, editLink, redirect);
			}
			// Maps the XML data to the content attribute in the SVG node 
			else if (forceSvg || (!forceXml && file != null && /(\.svg)$/i.test(file.getTitle())))
			{
				if (file != null && (file.getMode() == App.MODE_DEVICE || file.getMode() == App.MODE_BROWSER))
				{
					url = null;
				}
				
				xml = this.getEmbeddedSvg(xml, graph, url, null, embeddedCallback, ignoreSelection, redirect);
			}
			
			return xml;
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getXmlFileData = function(ignoreSelection, currentPage)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		currentPage = (currentPage != null) ? currentPage : false;
		
		var node = this.editor.getGraphXml(ignoreSelection);
			
		if (ignoreSelection && this.fileNode != null && this.currentPage != null)
		{
			var data = this.editor.graph.compress(this.editor.graph.zapGremlins(mxUtils.getXml(node)));
			mxUtils.setTextContent(this.currentPage.node, data);
			node = this.fileNode.cloneNode(false);
			
			if (currentPage)
			{
				node.appendChild(this.currentPage.node);
			}
			else
			{
				// Restores order of pages
				for (var i = 0; i < this.pages.length; i++)
				{
					var mapping = this.pages[i].mapping;
					
					// Updates XML of all pages for realtime
					if (this.currentPage != this.pages[i] && mapping != null && mapping.needsUpdate)
					{
						var enc = new mxCodec(mxUtils.createXmlDocument());
						var temp = enc.encode(mapping.graphModel);
					
						// Uses the graph state from the realtime model
						mapping.writeRealtimeToNode(temp);					
		
						var data = this.editor.graph.compress(this.editor.graph.zapGremlins(mxUtils.getXml(temp)));
						mxUtils.setTextContent(this.pages[i].node, data);
						
						// Marks the page as up-to-date
						mapping.needsUpdate = false;
					}
					
					node.appendChild(this.pages[i].node);
				}
			}
		}
		
		return node;
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getFileData = function(forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection, currentPage, node)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		currentPage = (currentPage != null) ? currentPage : false;
		
		node = (node != null) ? node : this.getXmlFileData(ignoreSelection, currentPage);
		var graph = this.editor.graph;
		var file = this.getCurrentFile();
		
		// Exports SVG for first page while other page is visible by creating a graph
		// LATER: Add caching for the graph or SVG while not on first page
		if (this.pages != null && this.currentPage != this.pages[0] && (forceSvg ||
			(!forceXml && file != null && /(\.svg)$/i.test(file.getTitle()))))
		{
			graph = this.createTemporaryGraph(graph.getStylesheet());
			var graphGetGlobalVariable = graph.getGlobalVariable;
			var page = this.pages[0];
	
			graph.getGlobalVariable = function(name)
			{
				if (name == 'page')
				{
					return page.getName();
				}
				else if (name == 'pagenumber')
				{
					return 1;
				}
				
				return graphGetGlobalVariable.apply(this, arguments);
			};
	
			document.body.appendChild(graph.container);
			graph.model.setRoot(page.root);
		}
		
		var result = this.createFileData(node, graph, file, window.location.href,
			forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection);
		
		// Removes temporary graph from DOM
		if (graph != this.editor.graph)
		{
			graph.container.parentNode.removeChild(graph.container);
		}
		
		return result;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.getHtml = function(node, graph, title, editLink, redirect, ignoreSelection)
	{
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		var bg = null;
		var js = 'https://www.draw.io/js/embed-static.min.js';
	
		// LATER: Merge common code with EmbedDialog
		if (graph != null)
		{
			var bounds = (ignoreSelection) ? graph.getGraphBounds() : graph.getBoundingBox(graph.getSelectionCells());
			var scale = graph.view.scale;
			var x0 = Math.floor(bounds.x / scale - graph.view.translate.x);
			var y0 = Math.floor(bounds.y / scale - graph.view.translate.y);
			bg = graph.background;
	
			// Embed script only used if no redirect
			if (redirect == null)
			{
				var s = this.getBasenames().join(';');
	
				if (s.length > 0)
				{
					js = 'https://www.draw.io/embed.js?s=' + s;
				}
			}
			
			// Adds embed attributes
			node.setAttribute('x0', x0);
			node.setAttribute('y0', y0);
		}
		
		if (node != null)
		{
			node.setAttribute('pan', '1');
			node.setAttribute('zoom', '1');
			node.setAttribute('resize', '0');
			node.setAttribute('fit', '0');
			node.setAttribute('border', '20');
			
			// Hidden attributes
			node.setAttribute('links', '1');
			
			if (editLink != null)
			{
				node.setAttribute('edit', editLink);
			}
		}
		
		// Makes XHTML compatible
		if (redirect != null)
		{
			redirect = redirect.replace(/&/g, '&amp;');
		}
	
		// Removes control chars in input for correct roundtrip check
		var text = (node != null) ? this.editor.graph.zapGremlins(mxUtils.getXml(node)) : '';
		
		// Double compression for mxfile not fixed since it may cause imcompatibilites with
		// embed clients that rely on this format. HTML files and export use getHtml2.
		var data = this.editor.graph.compress(text);
		
		// Fallback to URI encoded XML for invalid compression
		if (this.editor.graph.decompress(data) != text)
		{
			data = encodeURIComponent(text);
		}
		
		var style = 'position:relative;overflow:auto;width:100%;';
	
		return ((redirect == null) ? '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' : '') +
			'<!DOCTYPE html>\n<html' + ((redirect != null) ? ' xmlns="http://www.w3.org/1999/xhtml">' : '>') +
			'\n<head>\n' + ((redirect == null) ? ((title != null) ? '<title>' + mxUtils.htmlEntities(title) +
				'</title>\n' : '') : '<title>Draw.io Diagram</title>\n') +
			((redirect != null) ? '<meta http-equiv="refresh" content="0;URL=\'' + redirect + '\'"/>\n' : '') +
			'</head>\n<body' +
			(((redirect == null && bg != null && bg != mxConstants.NONE) ? ' style="background-color:' + bg + ';">' : '>')) +
			'\n<div class="mxgraph" style="' + style + '">\n' +
			'<div style="width:1px;height:1px;overflow:hidden;">' + data + '</div>\n</div>\n' +
			((redirect == null) ? '<script type="text/javascript" src="' + js + '"></script>' :
			'<a style="position:absolute;top:50%;left:50%;margin-top:-128px;margin-left:-64px;" ' +
			'href="' + redirect + '" target="_blank"><img border="0" ' +
			'src="https://www.draw.io/images/drawlogo128.png"/></a>') +
			'\n</body>\n</html>\n';
	};
	
	/**
	 * Same as above but using the new embed code.
	 */
	EditorUi.prototype.getHtml2 = function(xml, graph, title, editLink, redirect)
	{
		var bg = null;
		var js = 'https://www.draw.io/js/viewer.min.js';
		var s = '';
	
		// LATER: Merge common code with EmbedDialog
		if (graph != null)
		{
			// Embed script only used if no redirect
			if (redirect == null)
			{
				var s = this.getBasenames().join(';');
				
				if (s.length > 0)
				{
					js = 'https://www.draw.io/embed2.js?s=' + s;
				}
			}
		}
	
		// Makes XHTML compatible
		if (redirect != null)
		{
			redirect = redirect.replace(/&/g, '&amp;');
		}
		
		var data = {highlight: '#0000ff', nav: this.editor.graph.foldingEnabled, resize: true,
			xml: this.editor.graph.zapGremlins(xml), toolbar: 'pages zoom layers lightbox'};
		
		if (this.pages != null && this.currentPage != null)
		{
			data.page = mxUtils.indexOf(this.pages, this.currentPage);
		}
	
		var style = 'max-width:100%;border:1px solid transparent;';
	
		return ((redirect == null) ? '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' : '') +
			'<!DOCTYPE html>\n<html' + ((redirect != null) ? ' xmlns="http://www.w3.org/1999/xhtml">' : '>') +
			'\n<head>\n' + ((redirect == null) ? ((title != null) ? '<title>' + mxUtils.htmlEntities(title) +
				'</title>\n' : '') : '<title>Draw.io Diagram</title>\n') +
			((redirect != null) ? '<meta http-equiv="refresh" content="0;URL=\'' + redirect + '\'"/>\n' : '') +
			'<meta charset="utf-8"/>\n</head>\n<body>' +
			'\n<div class="mxgraph" style="' + style + '" data-mxgraph="' + mxUtils.htmlEntities(JSON.stringify(data)) + '"></div>\n' +
			((redirect == null) ? '<script type="text/javascript" src="' + js + '"></script>' :
			'<a style="position:absolute;top:50%;left:50%;margin-top:-128px;margin-left:-64px;" ' +
			'href="' + redirect + '" target="_blank"><img border="0" ' +
			'src="https://www.draw.io/images/drawlogo128.png"/></a>') +
			'\n</body>\n</html>\n';
	};

	/**
	 * 
	 */
	EditorUi.prototype.setFileData = function(data)
	{
		data = this.validateFileData(data);
		this.currentPage = null;
		this.fileNode = null;
		this.pages = null;

		var node = (data != null && data.length > 0) ? mxUtils.parseXml(data).documentElement : null;

		// Some nodes must be extracted here to find the mxfile node
		// LATER: Remove duplicate call to extractGraphModel in overridden setGraphXml
		var tmp = (node != null) ? this.editor.extractGraphModel(node, true) : null;
		
		if (tmp != null)
		{
			node = tmp;
		}

		if (node != null && node.nodeName == 'mxfile')
		{
			var nodes = node.getElementsByTagName('diagram');

			if (urlParams['pages'] != '0' || nodes.length > 1 ||
				(nodes.length == 1 && nodes[0].hasAttribute('name')))
			{
				this.fileNode = node;
				this.pages = [];
				
				// Wraps page nodes
				for (var i = 0; i < nodes.length; i++)
				{
					var page = new DiagramPage(nodes[i]);
					
					// Checks for invalid page names
					if (page.getName() == null)
					{
						page.setName(mxResources.get('pageWithNumber', [i + 1]));
					}
					
					this.pages.push(page);
				}
				
				this.currentPage = this.pages[Math.max(0, Math.min(this.pages.length - 1, urlParams['page'] || 0))];
				node = this.currentPage.node;
			}
		}
		
		// Creates tabbed file structure if enforced by URL
		if (urlParams['pages'] != '0' && this.fileNode == null)
		{
			this.fileNode = node.ownerDocument.createElement('mxfile');
			this.currentPage = new DiagramPage(node.ownerDocument.createElement('diagram'));
			this.currentPage.setName(mxResources.get('pageWithNumber', [1]));
	 	 	this.pages = [this.currentPage];
		}
		
		// Avoids scroll offset when switching page
		this.editor.setGraphXml(node);
		
		// Avoids duplicate parsing of the XML stored in the node
		if (this.currentPage != null)
		{
			this.currentPage.root = this.editor.graph.model.root;
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.downloadFile = function(format, nonCompressed, addShadow, ignoreSelection, currentPage)
	{
		try
		{
			var file = this.getCurrentFile();
			ignoreSelection = (ignoreSelection != null) ? ignoreSelection : this.editor.graph.isSelectionEmpty();
			// LATER: Double URI encoding for needed for newlines in simulate (truncates body otherwise).
			var basename = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
			
			if (/(\.xml)$/i.test(basename) || /(\.html)$/i.test(basename) || /(\.svg)$/i.test(basename))
			{
				basename = basename.substring(0, basename.lastIndexOf('.'));
			}
			
			var filename = basename + '.' + format;
			
			if (format == 'xml')
			{
		    	var data = '<?xml version="1.0" encoding="UTF-8"?>\n' +
		    		((nonCompressed) ? mxUtils.getXml(this.editor.getGraphXml(ignoreSelection)) :
		    			this.getFileData(true, null, null, null, ignoreSelection, currentPage));
		    	
		    	this.saveData(filename, format, data, 'text/xml');
			}
		    else if (format == 'html')
		    {
		    	var data = this.getHtml2(this.getFileData(true), this.editor.graph, basename);
		    	this.saveData(filename, format, data, 'text/html');
		    }
		    else if ((format == 'svg' || format == 'xmlsvg') && this.spinner.spin(document.body, mxResources.get('export')))
		    {
		    	var svg = null;
		    	
		    	var saveSvg = mxUtils.bind(this, function(data)
		    	{
		    		if (data.length <= MAX_REQUEST_SIZE)
		    		{
		    	    	this.saveData(filename, 'svg', data, 'image/svg+xml');
		    		}
		    		else
		    		{
		    			this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'), mxUtils.bind(this, function()
		    			{
		    				mxUtils.popup(svg);
		    			}));
		    		}
		    	});
		    	
		    	if (format == 'svg')
		    	{
		        	var bg = this.editor.graph.background;
		        	
		        	if (bg == mxConstants.NONE)
		        	{
		        		bg = null;
		        	}
		
		        	// Sets or disables alternate text for foreignObjects. Disabling is needed
		        	// because PhantomJS seems to ignore switch statements and paint all text.
		        	var svgRoot = this.editor.graph.getSvg(bg, null, null, false, null, ignoreSelection);
					
					if (addShadow)
					{
						this.editor.addSvgShadow(svgRoot);
					}
					
					// Embeds the images in the SVG output (async)
					this.convertImages(svgRoot, mxUtils.bind(this, mxUtils.bind(this, function(svgRoot2)
					{
						this.spinner.stop();
						
						saveSvg('<?xml version="1.0" encoding="UTF-8"?>\n' +
							'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
							mxUtils.getXml(svgRoot2));
					})));
		    	}
		    	else
		    	{
		    		filename = basename + '.svg';
		    		svg = this.getFileData(false, true, null, mxUtils.bind(this, function(svg)
		    		{
		    			this.spinner.stop();
		        		saveSvg(svg);    			
		    		}), ignoreSelection);
		    	}
		    }
			else
			{
				var bounds = this.editor.graph.getGraphBounds();
				
				// Exports only current page for PDF since it does not contain file data, but for
				// the other formats with XML included we need to send the complete data and use
				// the from/to URL parameters to specify the page to be exported.
				var data = this.getFileData(true, null, null, null, ignoreSelection, format != 'xmlpng');
				var range = '';
				
				if (bounds.width * bounds.height <= MAX_AREA && data.length <= MAX_REQUEST_SIZE)
				{
					var embed = '0';
			       	
			       	if (format == 'xmlpng')
			       	{
			       		embed = '1';
			       		format = 'png';
			       		filename = basename + '.' + format;
			       		
			       		// Finds the current page number
			       		if (this.pages != null && this.currentPage != null)
			       		{
			       			for (var i = 0; i < this.pages.length; i++)
			       			{
			       				if (this.pages[i] == this.currentPage)
			       				{
			       					range = '&from=' + i;
			       					break;
			       				}
			       			}
			       		}
			       	}
			       	
					this.saveRequest(data, filename, format, function(newTitle, base64)
					{
						return new mxXmlRequest(EXPORT_URL, 'format=' + format + range +
							'&base64=' + base64 + '&embedXml=' + embed + '&xml=' +
							encodeURIComponent(data) + ((newTitle != null) ?
							'&filename=' + encodeURIComponent(newTitle) : ''));
					});
				}
				else
				{
					this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'));
				}
			}
		}
		catch (e)
		{
			this.handleError(e);
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.setMode = function(mode, remember)
	{
		this.mode = mode;
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.fileLoaded = function(file)
	{
		this.hideDialog();
		var oldFile = this.getCurrentFile();
		this.setCurrentFile(null);
	
		if (oldFile != null)
		{
			oldFile.removeListener(this.descriptorChangedListener);
			oldFile.close();
		}
		
		this.editor.graph.model.clear();
		this.editor.undoManager.clear();
	
		var noFile = mxUtils.bind(this, function()
		{
			this.diagramContainer.style.visibility = 'hidden';
			this.formatContainer.style.visibility = 'hidden';
			this.hsplit.style.display = 'none';
			this.sidebarContainer.style.display = 'none';
			this.sidebarFooterContainer.style.display = 'none';
			this.editor.graph.setEnabled(false);
			
			// Keeps initial title if no file existed before
			if (oldFile != null)
			{
				this.updateDocumentTitle();
			}
			
			// File might have been loaded halfway
			this.editor.graph.model.clear();
			this.editor.undoManager.clear();
					
			// Avoids empty hash with no value
			if (window.location.hash != null && window.location.hash.length > 0)
			{
				window.location.hash = '';
			}
			
			if (this.fname != null)
			{
				this.fnameWrapper.style.display = 'none';
				this.fname.innerHTML = '';
				this.fname.setAttribute('title', mxResources.get('rename'));
			}
	
			this.updateUi();
			this.showSplash();
		});
	
		if (file != null)
		{
			try
			{
				// Order is significant, current file needed for correct
				// file format for initial save after starting realtime
				this.setCurrentFile(file);
				file.addListener('descriptorChanged', this.descriptorChangedListener);
				file.addListener('contentChanged', this.descriptorChangedListener);
				this.setMode(file.getMode());
				this.descriptorChanged();
				file.open();
	
				this.diagramContainer.style.visibility = '';
				this.formatContainer.style.visibility = '';
				this.hsplit.style.display = '';
				this.sidebarContainer.style.display = '';
				this.sidebarFooterContainer.style.display = '';
				this.editor.undoManager.clear();
				this.updateUi();
				
				// Realtime files have a valid status message
				if (file.realtime == null)
				{
					if (!file.isEditable())
					{
						this.editor.setStatus(mxResources.get('readOnly'));
					}
					else
					{
						this.editor.setStatus('');
					}
				}
	
				if (!this.editor.chromeless)
				{
					this.editor.graph.selectUnlockedLayer();
					this.showLayersDialog();
					this.restoreLibraries();
					
					// Workaround for no initial focus in FF
					if (window.self !== window.top)
					{
						window.focus();
					}
				}
				else if (this.editor.graph.lightbox)
				{
					this.lightboxFit();
				}
	
				if (this.chromelessResize)
				{
					this.chromelessResize();
				}
				
				this.editor.fireEvent(new mxEventObject('fileLoaded'));
				
	//			if (this.enableLogging)
	//			{
	//	        	try
	//	        	{
	//		        	if (!this.isOffline())
	//		        	{
	//	        			var img = new Image();
	//						var logDomain = window.DRAWIO_LOG_URL != null ? window.DRAWIO_LOG_URL : '';
	//	        			img.src = logDomain + '/log?msg=storageMode:' + encodeURIComponent(file.getMode()) +
	//        				'&v=' + encodeURIComponent(EditorUi.VERSION);
	//		        	}
	//	        	}
	//	        	catch (e)
	//	        	{
	//	        		// ignore
	//	        	}
	//			}
				
				if (this.mode == file.getMode() && file.getMode() != App.MODE_DEVICE)
				{
					try
					{
						this.addRecent({id: file.getHash(), title: file.getTitle(), mode: file.getMode()});
					}
					catch (e)
					{
						// ignore
					}
				}
			}
			catch (e)
			{
				// Makes sure the file does not save the invalid UI model and overwrites anything important
				if (window.console != null)
				{
					console.log('error in fileLoaded:', file, e);
				}
				
				// Asynchronous handling of errors
				this.handleError(e, mxResources.get('errorLoadingFile'), mxUtils.bind(this, function()
				{
					// Removes URL parameter and reloads the page
					if (urlParams['url'] != null && this.spinner.spin(document.body, mxResources.get('reconnecting')))
					{
						window.location.search = this.getSearch(['url']);
					}
					else if (oldFile != null)
					{
						this.fileLoaded(oldFile);
					}
					else
					{
						noFile();
					}
				}));
			}
		}
		else
		{
			noFile();
		}
	};
	
	/**
	 * Shows or hides the scratchpad library.
	 */
	EditorUi.prototype.toggleScratchpad = function()
	{
		if (isLocalStorage || mxClient.IS_CHROMEAPP)
		{
			if (this.scratchpad == null)
			{
				this.getLocalData('.scratchpad', mxUtils.bind(this, function(xml)
				{
					if (xml == null)
					{
						xml = this.emptyLibraryXml;
					}
					
					this.loadLibrary(new StorageLibrary(this, xml, '.scratchpad'));
					
				}));
			}
			else
			{
				this.closeLibrary(this.scratchpad);
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createLibraryDataFromImages = function(images)
	{
		var doc = mxUtils.createXmlDocument();
		var library = doc.createElement('mxlibrary');
		mxUtils.setTextContent(library, JSON.stringify(images));
		doc.appendChild(library);
		
		return mxUtils.getXml(doc);
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.closeLibrary = function(file)
	{
		if (file != null)
		{
			this.removeLibrarySidebar(file.getHash());
			
			if (file.constructor != LocalLibrary)
			{
				mxSettings.removeCustomLibrary(file.getHash());
			}
			
			if (file.title == '.scratchpad')
			{
				this.scratchpad = null;
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.removeLibrarySidebar = function(id)
	{
		var elts = this.sidebar.palettes[id];
		
		if (elts != null)
		{
			for (var i = 0; i < elts.length; i++)
			{
				elts[i].parentNode.removeChild(elts[i]);
			}
			
			delete this.sidebar.palettes[id];
		}
	};
	
	/**
	 * Changes the position of the library in the sidebar 
	 */
	EditorUi.prototype.repositionLibrary = function(nextChild) 
	{
	    var c = this.sidebar.container;
		nextChild = (nextChild != null) ? nextChild : c.firstChild.nextSibling.nextSibling;
		
		var content = c.lastChild;
		var title = content.previousSibling;
		
	    c.insertBefore(content, nextChild);
	    c.insertBefore(title, content);
	}
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.loadLibrary = function(file)
	{
		var doc = mxUtils.parseXml(file.getData());
		
		if (doc.documentElement.nodeName == 'mxlibrary')
		{
			var images = JSON.parse(mxUtils.getTextContent(doc.documentElement));
			this.libraryLoaded(file, images, doc.documentElement.getAttribute('title'));
		}
		else
		{
			throw {message: mxResources.get('notALibraryFile')};
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getLibraryStorageHint = function(file)
	{
		return '';
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.libraryLoaded = function(file, images, optionalTitle)
	{
		if (file.constructor != LocalLibrary)
		{
			mxSettings.addCustomLibrary(file.getHash());
		}
	
		if (file.title == '.scratchpad')
		{
			this.scratchpad = file;
		}
		
		var elts = this.sidebar.palettes[file.getHash()];
		var nextSibling = (elts != null) ? elts[elts.length - 1].nextSibling : null;
	
		// Removes existing sidebar entry for this library
		this.removeLibrarySidebar(file.getHash());
		var dropTarget = null;
		
		var addImages = mxUtils.bind(this, function(imgs, content)
		{
			if (imgs.length == 0 && file.isEditable())
			{
				if (dropTarget == null)
				{
					dropTarget = document.createElement('div');
					mxUtils.setPrefixedStyle(dropTarget.style, 'borderRadius', '6px');
					dropTarget.style.border = '3px dotted lightGray';
					dropTarget.style.textAlign = 'center';
					dropTarget.style.padding = '8px';
					dropTarget.style.color = '#B3B3B3';
					mxUtils.write(dropTarget, mxResources.get('dragElementsHere'));
				}
				
				content.appendChild(dropTarget);
			}
			else
			{
				for (var i = 0; i < imgs.length; i++)
				{
					var img = imgs[i];
					var data = img.data;
		
					if (data != null)
					{
						data = this.convertDataUri(data);
						var s = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;';
						
						if (img.aspect == 'fixed')
						{
							s += 'aspect=fixed;'
						}
						
						content.appendChild(this.sidebar.createVertexTemplate(s + 'image=' +
							data, img.w, img.h, '', img.title || '', false, false, false));
					}
					else if (img.xml != null)
					{
						var cells = this.stringToCells(this.editor.graph.decompress(img.xml));
						
						if (cells.length > 0)
						{
							content.appendChild(this.sidebar.createVertexTemplateFromCells(
								cells, img.w, img.h, img.title || '', true, false, false));
						}
					}
				}
			}
		});
		
		// Adds new sidebar entry for this library
		var tmp = (optionalTitle != null && optionalTitle.length > 0) ? optionalTitle : file.getTitle();
		var contentDiv = this.sidebar.addPalette(file.getHash(), tmp, true, mxUtils.bind(this, function(content)
		{
			addImages(images, content);
	    }));
	
		this.repositionLibrary(nextSibling);
		
		// Adds tooltip for backend
		var title = contentDiv.parentNode.previousSibling;
	    var tip = title.getAttribute('title');
	    
	    if (tip != null && tip.length > 0 && file.title != '.scratchpad')
	    {
	    	title.setAttribute('title', this.getLibraryStorageHint(file) + '\n' + tip);
	    }
	    
	    var buttons = document.createElement('div');
	    buttons.style.position = 'absolute';
	    buttons.style.right = '0px';
	    buttons.style.top = '5px';
	    buttons.style.backgroundColor = 'inherit';
	    title.style.position = 'relative';
	    
	    var btnWidth = 18;
		var btn = document.createElement('img');
		btn.setAttribute('src', Dialog.prototype.closeImage);
		btn.setAttribute('title', mxResources.get('close'));
		btn.setAttribute('align', 'top');
		btn.setAttribute('border', '0');
		btn.className = 'geButton';
		btn.style.marginRight = '1px';
		btn.style.marginTop = '-1px';
		buttons.appendChild(btn);
		
		var saveBtn = null;
		
		mxEvent.addListener(btn, 'click', mxUtils.bind(this, function(evt)
		{
			// Workaround for close after any button click in IE8/quirks
			if (!mxEvent.isConsumed(evt))
			{
				var fn = mxUtils.bind(this, function()
				{
					this.closeLibrary(file);
				});
				
				if (saveBtn != null)
				{
					this.confirm(mxResources.get('allChangesLost'), fn);
				}
				else
				{
					fn();
				}
		
				mxEvent.consume(evt);
			}
		}));
		
		// Shows tooltip if mouse over background
		mxEvent.addListener(contentDiv, 'mousemove', mxUtils.bind(this, function(evt)
		{
			if (mxEvent.getSource(evt) == contentDiv)
			{
				contentDiv.setAttribute('title', mxResources.get('libraryTooltip'));
			}
			else
			{
				contentDiv.removeAttribute('title');
			}
		}));
		
		if (file.isEditable())
		{
			var graph = this.editor.graph;
			
			var editLibrary = mxUtils.bind(this, function(evt)
			{
				this.showLibraryDialog(file.getTitle(), contentDiv, images, file, file.getMode());
				mxEvent.consume(evt);
			});
			
			var saveLibrary = mxUtils.bind(this, function(evt)
			{
				if (file.constructor != LocalLibrary || file.isAutosave())
				{
					if (spinBtn != null && spinBtn.parentNode != null)
					{
						spinBtn.parentNode.removeChild(spinBtn);
					}
					
					spinBtn = btn.cloneNode(false);
					spinBtn.setAttribute('src', EditorUi.spinImage);
					spinBtn.setAttribute('title', mxResources.get('saving'));
					spinBtn.style.cursor = 'default';
					spinBtn.style.marginRight = '2px';
					spinBtn.style.marginTop = '-2px';
					buttons.insertBefore(spinBtn, buttons.firstChild);
					title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
					
					this.saveLibrary(file.getTitle(), images, file, file.getMode(), true, true, function()
					{
						if (spinBtn != null && spinBtn.parentNode != null)
						{
							spinBtn.parentNode.removeChild(spinBtn);
							title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
						}
					});
				}
				else if (saveBtn == null)
				{
					saveBtn = btn.cloneNode(false);
					saveBtn.setAttribute('src', IMAGE_PATH + '/download.png');
					saveBtn.setAttribute('title', mxResources.get('save'));
					buttons.insertBefore(saveBtn, buttons.firstChild);
					
					mxEvent.addListener(saveBtn, 'click', mxUtils.bind(this, function(evt)
					{
						this.saveLibrary(file.getTitle(), images, file, file.getMode(), true, true);
						saveBtn.parentNode.removeChild(saveBtn);
						saveBtn = null;
						title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
						
						mxEvent.consume(evt);
					}));
					
					title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
				}
			});
			
			var addCells = mxUtils.bind(this, function(cells, bounds, evt, title)
			{
				cells = graph.cloneCells(graph.model.getTopmostCells(cells));
	
				// Translates cells to origin
				for (var i = 0; i < cells.length; i++)
				{
					var geo = graph.getCellGeometry(cells[i]);
					
					if (geo != null)
					{
						geo.translate(-bounds.x, -bounds.y);
					}
				}
	
				contentDiv.appendChild(this.sidebar.createVertexTemplateFromCells(
					cells, bounds.width, bounds.height, title || '', true, false, false));
	
				var xml = this.editor.graph.compress(mxUtils.getXml(this.editor.graph.encodeCells(cells)));
				var entry = {xml: xml, w: bounds.width, h: bounds.height};
				
				if (title != null)
				{
					entry.title = title;
				}
				
				images.push(entry);
				saveLibrary(evt);
				
				if (dropTarget != null && dropTarget.parentNode != null && images.length > 0)
				{
					dropTarget.parentNode.removeChild(dropTarget);
					dropTarget = null;
				}
			});
		
			var addSelection = mxUtils.bind(this, function(evt)
			{
				if (!graph.isSelectionEmpty())
				{
					var cells = graph.getSelectionCells();
					var bounds = graph.view.getBounds(cells);
					
					var s = graph.view.scale;
					
					bounds.x /= s;
					bounds.y /= s;
					bounds.width /= s;
					bounds.height /= s;
					
					bounds.x -= graph.view.translate.x;
					bounds.y -= graph.view.translate.y;
					
					addCells(cells, bounds);
				}
				else if (graph.getRubberband().isActive())
				{
					graph.getRubberband().execute(evt);
					graph.getRubberband().reset();
				}
				else
				{
					this.showError(mxResources.get('error'), mxResources.get('nothingIsSelected'), mxResources.get('ok'));
				}
				
				mxEvent.consume(evt);
			});
			
			// Defines inactive border state
			contentDiv.style.border = '3px solid transparent';
			
			// Adds drop handler from graph
			mxEvent.addGestureListeners(contentDiv, function(){}, mxUtils.bind(this, function(evt)
			{
				if (graph.isMouseDown && graph.panningManager != null && graph.graphHandler.shape != null)
				{
					graph.graphHandler.shape.node.style.visibility = 'hidden';
					
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted rgb(254, 137, 12)';
					}
					else
					{
						contentDiv.style.border = '3px dotted rgb(254, 137, 12)';
					}
					
					contentDiv.style.cursor = 'copy';
					graph.panningManager.stop();
					graph.autoScroll = false;
					
					if (graph.graphHandler.guide != null)
					{
						graph.graphHandler.guide.setVisible(false);
					}
					
					if (graph.graphHandler.hint != null)
					{
						graph.graphHandler.hint.style.visibility = 'hidden';	
					}
					
					mxEvent.consume(evt);
				}
			}), mxUtils.bind(this, function(evt)
			{
				if (graph.isMouseDown && graph.panningManager != null && graph.graphHandler != null)
				{
					contentDiv.style.border = '3px solid transparent';
					
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted lightGray';
					}
					
					contentDiv.style.cursor = 'default';
					this.sidebar.showTooltips = true;
					graph.panningManager.stop();
					graph.graphHandler.reset();
					graph.isMouseDown = false;
					graph.autoScroll = true;
					addSelection(evt);
					mxEvent.consume(evt);
				}
			}));
			
			// Handles mouse leaving the library and restoring move
			mxEvent.addListener(contentDiv, 'mouseleave', mxUtils.bind(this, function(evt)
			{
				if (graph.isMouseDown && graph.graphHandler.shape != null)
				{
					graph.graphHandler.shape.node.style.visibility = 'visible';
					contentDiv.style.border = '3px solid transparent';
					contentDiv.style.cursor = '';
					graph.autoScroll = true;
					
					if (graph.graphHandler.guide != null)
					{
						graph.graphHandler.guide.setVisible(true);
					}
					
					if (graph.graphHandler.hint != null)
					{
						graph.graphHandler.hint.style.visibility = 'visible';	
					}
					
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted lightGray';
					}
				}
			}));
			
			// Adds drop handler from filesystem
			if (Graph.fileSupport)
			{
				mxEvent.addListener(contentDiv, 'dragover', mxUtils.bind(this, function(evt)
				{
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted rgb(254, 137, 12)';
					}
					else
					{
						contentDiv.style.border = '3px dotted rgb(254, 137, 12)';
					}
					
					evt.dataTransfer.dropEffect = 'copy';
					contentDiv.style.cursor = 'copy';
					this.sidebar.hideTooltip();
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(contentDiv, 'drop', mxUtils.bind(this, function(evt)
				{
					contentDiv.style.border = '3px solid transparent';
					contentDiv.style.cursor = '';
					
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted lightGray';
					}
					
				    if (evt.dataTransfer.files.length > 0)
				    {	
				    	this.importFiles(evt.dataTransfer.files, 0, 0, this.maxImageSize, mxUtils.bind(this, function(data, mimeType, x, y, w, h, img)
				    	{
							if (data != null && mimeType.substring(0, 6) == 'image/')
							{
								var style = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;image=' +
									this.convertDataUri(data);
								var cells = [new mxCell('', new mxGeometry(0, 0, w, h), style)];
								cells[0].vertex = true;
	
								addCells(cells, new mxRectangle(0, 0, w, h), evt, (mxEvent.isAltDown(evt)) ? null : img.substring(0, img.lastIndexOf('.')).replace(/_/g, ' '));
							}
							else
							{
								var done = false;
								
								if (data != null && mimeType == 'text/xml')
								{
									var doc = mxUtils.parseXml(data);
									
									if (doc.documentElement.nodeName == 'mxlibrary')
									{
										try
										{
											var temp = JSON.parse(mxUtils.getTextContent(doc.documentElement));
											addImages(temp, contentDiv);
											images = images.concat(temp);
											saveLibrary(evt);
											this.spinner.stop();
											done = true;
										}
										catch (e)
										{
											// ignore
										}
									}
									else if (doc.documentElement.nodeName == 'mxfile')
									{
										try
										{
											var temp = mxUtils.getTextContent(doc.documentElement.getElementsByTagName('diagram')[0]);
											var cells = this.stringToCells(this.editor.graph.decompress(temp));
											addCells(cells, new mxRectangle(0, 0, w, h), evt);
											done = true;
										}
										catch (e)
										{
											// ignore
										}
									}
								}
								
								if (!done)
								{
									this.spinner.stop();
									this.handleError({message: mxResources.get('errorLoadingFile')})
								}
							}
							
							if (dropTarget != null && dropTarget.parentNode != null && images.length > 0)
							{
								dropTarget.parentNode.removeChild(dropTarget);
								dropTarget = null;
							}
				    	}));
					}
				    
				    evt.stopPropagation();
				    evt.preventDefault();
				}));
	
				mxEvent.addListener(contentDiv, 'dragleave', function(evt)
				{
					if (dropTarget != null)
					{
						dropTarget.style.border = '3px dotted lightGray';
					}
					else
					{
						contentDiv.style.border = '3px solid transparent';
						contentDiv.style.cursor = '';
					}
	
					evt.stopPropagation();
					evt.preventDefault();
				});
			}
	
			btn = btn.cloneNode(false);
			btn.setAttribute('src', IMAGE_PATH + '/edit.gif');
			btn.setAttribute('title', mxResources.get('edit'));
			buttons.insertBefore(btn, buttons.firstChild);
			
			mxEvent.addListener(btn, 'click', editLibrary);
			mxEvent.addListener(contentDiv, 'dblclick', function(evt)
			{
				if (mxEvent.getSource(evt) == contentDiv)
				{
					editLibrary(evt);
				}
			});
			
			btn = btn.cloneNode(false);
			btn.setAttribute('src', EditorUi.plusImage);
			btn.setAttribute('title', mxResources.get('add'));
			buttons.insertBefore(btn, buttons.firstChild);
			
			if (!this.isOffline() && file.title == '.scratchpad')
			{
				var link = document.createElement('span');
				link.setAttribute('title', mxResources.get('help'));
				link.style.cssText = 'color:gray;text-decoration:none;';
				link.className = 'geButton';
				mxUtils.write(link, '?');
				
				mxEvent.addGestureListeners(link, mxUtils.bind(this, function(evt)
				{
					window.open('https://support.draw.io/questions/10420280');
					mxEvent.consume(evt);
				}));
				
				buttons.insertBefore(link, buttons.firstChild);
			}
			
			var spinBtn = null;
	
			mxEvent.addListener(btn, 'click', addSelection);
		}
		
		title.appendChild(buttons);
		title.style.paddingRight = (buttons.childNodes.length * btnWidth) + 'px';
	};

	/**
	 * EditorUi Overrides
	 */
    if (urlParams['offline'] == '1')
    {
		EditorUi.prototype.footerHeight = 4;
    }
    else
    {
    	if (uiTheme == 'atlas')
    	{
    		if (typeof Toolbar !== 'undefined')
    		{
    			Toolbar.prototype.unselectedBackground = (mxClient.IS_QUIRKS) ? 'none' : 'linear-gradient(rgb(255, 255, 255) 0px, rgb(242, 242, 242) 100%)';
    			Toolbar.prototype.selectedBackground = 'rgb(242, 242, 242)';
    		}
    		
    		Editor.prototype.initialTopSpacing = 3;
    		EditorUi.prototype.menubarHeight = 41;
    		EditorUi.prototype.toolbarHeight = 38;
    		EditorUi.prototype.hsplitPosition = 188;
    		Sidebar.prototype.thumbWidth = 46;
    		Sidebar.prototype.thumbHeight = 46;
    		Sidebar.prototype.thumbPadding = (document.documentMode >= 5) ? 0 : 1;
    		Sidebar.prototype.thumbBorder = 2;
    	}
    	else
    	{
    		if (urlParams['savesidebar'] == '1')
    		{
        		Sidebar.prototype.thumbWidth = 64;
        		Sidebar.prototype.thumbHeight = 64;
    		}
    	}

		EditorUi.prototype.footerHeight = (screen.height <= 740) ? 5 : 46;
		
		// Fetches footer from page
		EditorUi.prototype.createFooter = function()
		{
			var footer = document.getElementById('geFooter');
			
			if (footer != null)
			{
				footer.style.visibility = 'visible';
				
				// Adds button to hide the footer
				var img = document.createElement('img');
				img.setAttribute('border', '0');
				img.setAttribute('src', Dialog.prototype.closeImage);
				img.setAttribute('title', mxResources.get('hide'));
				footer.appendChild(img)

				if (mxClient.IS_QUIRKS)
				{
					img.style.position = 'relative';
					img.style.styleFloat = 'right';
					img.style.top = '-30px';
					img.style.left = '164px';
					img.style.cursor = 'pointer';
				}
				
				mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
				{
					this.hideFooter();
				}));
			}

			return footer;
		};
    }
    
    /**
     * Hides the footer.
     */
    EditorUi.prototype.hideFooter = function()
    {
    	var footer = document.getElementById('geFooter');
    	
    	if (footer != null)
    	{
    		this.footerHeight = 0;
    		footer.style.display = 'none';
    		this.refresh();
    	}
    };

	/**
	 * Overrides image dialog to add image search and Google+.
	 */
    EditorUi.prototype.showImageDialog = function(title, value, fn, ignoreExisting, convertDataUri)
	{
		// KNOWN: IE+FF don't return keyboard focus after image dialog (calling focus doesn't help)
    	var dlg = new ImageDialog(this, title, value, fn, ignoreExisting, convertDataUri);
		this.showDialog(dlg.container, (Graph.fileSupport) ? 420 : 340, (Graph.fileSupport) ? 200 : 90, true, true);
		dlg.init();
	};

	/**
	 * Hides the current menu.
	 */
	EditorUi.prototype.showBackgroundImageDialog = function(apply)
	{
		apply = (apply != null) ? apply : mxUtils.bind(this, function(image)
		{
			this.setBackgroundImage(image);
		});
		var dlg = new BackgroundImageDialog(this, mxUtils.bind(this, function(image)
		{
			apply(image);
		}));
		this.showDialog(dlg.container, 360, 200, true, true);
		dlg.init();
	};

	/**
	 * Hides the current menu.
	 */
	EditorUi.prototype.showLibraryDialog = function(name, sidebar, images, file, mode)
	{
		var dlg = new LibraryDialog(this, name, sidebar, images, file, mode);
		
		this.showDialog(dlg.container, 620, 440, true, true, mxUtils.bind(this, function(cancel)
		{
			if (cancel && this.getCurrentFile() == null && urlParams['embed'] != '1')
			{
				this.showSplash();
			}
		}));
		
		dlg.init();
	};

	/**
	 * Hook for sidebar footer container.
	 */
	EditorUi.prototype.createSidebarFooterContainer = function()
	{
		var div =  this.createDiv('geSidebarContainer');
		div.style.position = 'absolute';
		div.style.overflow = 'hidden';
		div.style.borderWidth = '3px';

		var elt2 = document.createElement('a');
		elt2.setAttribute('href', 'javascript:void(0);');
		elt2.className = 'geTitle';
		elt2.style.height = '100%';
		elt2.style.paddingTop = '9px';

		mxUtils.write(elt2, mxResources.get('moreShapes') + '...');

		mxEvent.addListener(elt2, 'click', mxUtils.bind(this, function(evt)
		{
			this.actions.get('shapes').funct();
			mxEvent.consume(evt);
		}));
		
		div.appendChild(elt2);
		
		return div;
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.handleError = function(resp, title, fn)
	{
		var resume = (this.spinner != null && this.spinner.pause != null) ? this.spinner.pause() : function() {};
		var e = (resp != null && resp.error != null) ? resp.error : resp;
	
		if (e != null || title != null)
		{
			var msg = mxResources.get('unknownError');
			var btn = mxResources.get('ok');
			var retry = null;
			title = (title != null) ? title : mxResources.get('error');
			
			if (e != null)
			{
				if (typeof(gapi) != 'undefined' && typeof(gapi.drive) != 'undefined' && typeof(gapi.drive.realtime) != 'undefined' &&
					e.type == gapi.drive.realtime.ErrorType.FORBIDDEN)
				{
					msg = mxResources.get('forbidden');
				}
				else if (e.code == 404 || e.status == 404 || (typeof(gapi) != 'undefined' && typeof(gapi.drive) != 'undefined' &&
						typeof(gapi.drive.realtime) != 'undefined' && e.type == gapi.drive.realtime.ErrorType.NOT_FOUND))
				{
					msg = mxResources.get('fileNotFoundOrDenied');
					var id = window.location.hash;
					
					if (id != null && id.substring(0, 2) == '#G')
					{
						id = id.substring(2);
						msg += ' <a href="https://drive.google.com/open?id=' + id + '" target="_blank">' +
							mxResources.get('tryOpeningViaThisPage') + '</a>';
					}
				}
				else if (e.code == App.ERROR_TIMEOUT)
				{
					msg = mxResources.get('timeout');
					
					if (e.retry != null)
					{
						btn = mxResources.get('cancel');
						retry = function()
						{
							resume();
							e.retry();
						};
					}
				}
				else if (e.code == App.ERROR_BUSY)
				{
					msg = mxResources.get('busy');
				}
				else if (e.message != null)
				{
					msg = e.message;
				}
				else if (e.response != null && e.response.error != null)
				{
					msg = e.response.error;
				}
			}
	
			this.showError(title, msg, btn, fn, retry);
		}
		else if (fn != null)
		{
			fn();
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.showError = function(title, msg, btn, fn, retry, btn2, fn2)
	{
		var dlg = new ErrorDialog(this, title, msg, btn, fn, retry, btn2, fn2);
		this.showDialog(dlg.container, 340, 150, true, false);
		dlg.init();
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.alert = function(msg, fn)
	{
		var dlg = new ErrorDialog(this, null, msg, mxResources.get('ok'), fn);
		this.showDialog(dlg.container, 340, 100, true, false);
		dlg.init();
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.confirm = function(msg, okFn, cancelFn, okLabel, cancelLabel)
	{
		var resume = (this.spinner != null && this.spinner.pause != null) ? this.spinner.pause() : function() {};
		
		this.showDialog(new ConfirmDialog(this, msg, function()
		{
			resume();
			
			if (okFn != null)
			{
				okFn();
			}
		}, function()
		{
			resume();
			
			if (cancelFn != null)
			{
				cancelFn();
			}
		}, okLabel, cancelLabel).container, 340, 90, true, false);	
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.setCurrentFile = function(file)
	{
		this.currentFile = file;
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getCurrentFile = function()
	{
		return this.currentFile;
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.isDiagramEmpty = function()
	{
		var model = this.editor.graph.getModel();
		
		return model.getChildCount(model.root) == 1 && model.getChildCount(model.getChildAt(model.root, 0)) == 0;
	};
	
	/**
	 * Handling for canvas export.
	 */

	/**
	 * 
	 */
	EditorUi.prototype.isExportToCanvas = function()
	{
		// LATER: Fix security error caused by foreignObjects in Safari for toDataUri (tainted canvas)
		return mxClient.IS_CHROMEAPP || (!this.editor.graph.mathEnabled && this.useCanvasForExport);
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.createSvgDataUri = function(svg)
	{
		return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
	};

	/**
	 * 
	 */
	EditorUi.prototype.createPngDataUri = function(canvas, xml)
	{
   	    var data = canvas.toDataURL('image/png');
   	    
   	    // Checks if output is invalid or empty
   	    if (data.length <= 6 || data == canvas.cloneNode(false).toDataURL('image/png'))
   	    {
   	    	throw {message: 'Invalid image'};
   	    }
   	    
   	    if (xml != null)
   	    {
   	   		data = this.writeGraphModelToPng(data, 'zTXt', 'mxGraphModel', atob(this.editor.graph.compress(xml)));
   	    }
   	    
   	    return data;
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.saveCanvas = function(canvas, xml)
	{
   		var file = this.getCurrentFile();
   	    var filename = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
   	    var dot = filename.lastIndexOf('.');
   	    
   	    if (dot > 0)
   	    {
   	    	filename = filename.substring(0, dot);
   	    }
   	    
   	    filename += '.png';
   	    var data = this.createPngDataUri(canvas, xml);
   	    
   	    this.saveLocalFile(data.substring(data.lastIndexOf(',') + 1), filename, 'image/png', true);
	};
	
	/**
	 * Returns true if files should be saved using <saveLocalFile>.
	 */
	EditorUi.prototype.isLocalFileSave = function()
	{
		return (urlParams['save'] != 'remote' && (mxClient.IS_IE ||
			(typeof window.Blob !== 'undefined' && typeof window.URL !== 'undefined')) &&
			document.documentMode != 9 && document.documentMode != 8 &&
			document.documentMode != 7 && !mxClient.IS_QUIRKS) ||
			this.isOfflineApp() || mxClient.IS_IOS;
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.doSaveLocalFile = function(data, filename, mimeType, base64Encoded)
	{
		// Newer versions of IE
		if (window.MSBlobBuilder && navigator.msSaveOrOpenBlob)
		{
			var builder = new MSBlobBuilder();
			builder.append(data);
			var blob = builder.getBlob(mimeType);
			navigator.msSaveOrOpenBlob(blob, filename);
		}
		// Older versions of IE (binary not supported)
		else if (mxClient.IS_IE)
		{
			var win = window.open('about:blank', '_blank');
			
			if (win == null)
			{
				mxUtils.popup(data, true);
			}
			else
			{
				win.document.write(data);
				win.document.close();
				win.document.execCommand('SaveAs', true, filename);
				win.close();
			}
		}
		else if (mxClient.IS_IOS)
		{
			// Poor man's saveAs in iOS via context menu of selected output
	    	var dlg = new TextareaDialog(this, filename + ':', data, null, null, mxResources.get('close'));
	    	dlg.textarea.style.width = '600px';
	    	dlg.textarea.style.height = '380px';
			this.showDialog(dlg.container, 620, 460, true, true);
			dlg.init();
			document.execCommand('selectall', false, null);
		}
		else if (!this.isOffline() && mxClient.IS_SF)
		{
			var param = (typeof(pako) === 'undefined') ? '&xml=' + encodeURIComponent(data) :
				'&data=' + encodeURIComponent(this.editor.graph.compress(data));
			
			new mxXmlRequest(SAVE_URL, 'mime=' + mimeType + '&filename=' +
				encodeURIComponent(filename) +
				param).simulate(document, '_blank');
		}
		else
		{
			var a = document.createElement('a');
			a.href = URL.createObjectURL((base64Encoded) ?
				this.base64ToBlob(data, mimeType) :
				new Blob([data], {type: mimeType}));
			a.download = filename;
			document.body.appendChild(a);
			
			// Workaround for link opens in same window in Safari
			if (mxClient.IS_SF)
			{
				a.setAttribute('target', '_blank');
			}
			
			try
			{
				a.click();
				
				window.setTimeout(function()
				{
					URL.revokeObjectURL(a.href);
				}, 0);
				a.parentNode.removeChild(a);
			}
			catch (e)
			{
				// ignore
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.base64ToBlob = function(base64Data, contentType)
	{
	    contentType = contentType || '';
	    var sliceSize = 1024;
	    var byteCharacters = atob(base64Data);
	    var bytesLength = byteCharacters.length;
	    var slicesCount = Math.ceil(bytesLength / sliceSize);
	    var byteArrays = new Array(slicesCount);
	
	    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex)
	    {
	        var begin = sliceIndex * sliceSize;
	        var end = Math.min(begin + sliceSize, bytesLength);
	
	        var bytes = new Array(end - begin);
	        
	        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset)
	        {
	            bytes[i] = byteCharacters[offset].charCodeAt(0);
	        }
	        
	        byteArrays[sliceIndex] = new Uint8Array(bytes);
	    }
	
	    return new Blob(byteArrays, {type: contentType});
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.saveLocalFile = function(data, filename, mimeType, base64Encoded)
	{
		var allowTab = !mxClient.IS_IOS || !navigator.standalone;
		var backends = !this.isOfflineApp() && !this.isOffline() &&
			(typeof window.DriveClient === 'function' ||
			typeof window.DropboxClient === 'function' ||
			typeof window.OneDriveClient === 'function');
		
		var dlg = new CreateDialog(this, filename, mxUtils.bind(this, function(newTitle, mode)
		{
			try
			{
				// Opens a new window
				if (mode == '_blank')
				{
					// Workaround for "Access denied" after URL.createObjectURL
					// and blank window for window.open with data URI in MS Edge
					// and empty window for IE 11 and 10
					if (mxClient.IS_EDGE || document.documentMode == 11 || document.documentMode == 10)
					{
			    		var param = (typeof(pako) === 'undefined') ? '&xml=' + encodeURIComponent(data) :
			    			'&data=' + encodeURIComponent(this.editor.graph.compress(data));
			    		
			    		new mxXmlRequest(SAVE_URL, 'mime=' + mimeType + param).simulate(document, '_blank');
					}
					else
					{
						// Cannot use URL.createObjectURL since it kills gradients in FF
						window.open('data:' + mimeType + ((base64Encoded) ? ';base64,' +
							data : ';charset=utf8,' + encodeURIComponent(data)));
					}
				}
				else if (mode == App.MODE_DEVICE)
				{
					this.doSaveLocalFile(data, newTitle, mimeType, base64Encoded);
				} 
				else if (newTitle != null && newTitle.length > 0)
				{
					this.pickFolder(mode, mxUtils.bind(this, function(folderId)
					{
						this.exportFile(data, newTitle, mimeType, base64Encoded, mode, folderId);
					}));
				}
			}
			catch (e)
			{
				this.handleError(e);
			}
		}), mxUtils.bind(this, function()
		{
			this.hideDialog();
		}), mxResources.get('saveAs'), mxResources.get('download'), false, false, allowTab);
		this.showDialog(dlg.container, 380, (backends) ? 280 : 160, true, true);
		dlg.init();
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.saveData = function(filename, format, data, mime)
	{
		if (this.isLocalFileSave())
		{
			this.saveLocalFile(data, filename, mime);
		}
		else
		{
			this.saveRequest(data, filename, format, mxUtils.bind(this, function(newTitle, base64)
			{
	    		var param = (typeof(pako) === 'undefined') ? '&xml=' + encodeURIComponent(data) :
	    			'&data=' + encodeURIComponent(this.editor.graph.compress(data));
	    		
	    		return new mxXmlRequest(SAVE_URL, 'format=' + format + ((newTitle != null) ?
					'&filename=' + encodeURIComponent(newTitle) : '') + param);
			}));
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.saveRequest = function(data, filename, format, fn)
	{
		var allowTab = !mxClient.IS_IOS || !navigator.standalone;
		
		var dlg = new CreateDialog(this, filename, mxUtils.bind(this, function(newTitle, mode)
		{
			if (mode == '_blank' || newTitle != null && newTitle.length > 0)
			{
				var base64 = (mode == App.MODE_DEVICE || mode == null || mode == '_blank') ? '0' : '1';
				var xhr = fn((mode == '_blank') ? null : newTitle, base64);
				
				if (mode == App.MODE_DEVICE || mode == '_blank')
				{
					xhr.simulate(document, '_blank');
				}
				else
				{
					this.pickFolder(mode, mxUtils.bind(this, function(folderId)
					{
						if (this.spinner.spin(document.body, mxResources.get('saving')))
						{
							// LATER: Catch possible mixed content error
							// see http://stackoverflow.com/questions/30646417/catching-mixed-content-error
							xhr.send(mxUtils.bind(this, function()
							{
								this.spinner.stop();
								
								if (xhr.getStatus() < 200 || xhr.getStatus() > 299)
								{
									this.handleError({message: mxResources.get('errorSavingFile')});
								}
								else
								{
									try
									{
										var mimeType = (format == 'pdf') ? 'application/pdf' : 'image/' + format;
										this.exportFile(xhr.getText(), newTitle, mimeType, true, mode, folderId);
									}
									catch (e)
									{
										this.handleError(e);
									}
								}
							}), function(resp)
							{
								this.spinner.stop();
								this.handleError(resp);
							});
						}
					}));
				}
			}
		}), mxUtils.bind(this, function()
		{
			this.hideDialog();
		}), mxResources.get('saveAs'), mxResources.get('download'), false, false, allowTab);
		this.showDialog(dlg.container, 380, 270, true, true);
		dlg.init();
	};
		
	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.exportFile = function(data, filename, mimeType, base64Encoded, mode, folderId)
	{
		// do nothing
	};
	
	/**
	 * Hook for subclassers.
	 */
	EditorUi.prototype.pickFolder = function(mode, fn, enabled)
	{
		fn(null);
	};

	/**
	 *
	 */
	EditorUi.prototype.exportSvg = function(scale, transparentBackground, ignoreSelection, addShadow, editable, embedImages)
	{
		var selectionEmpty = this.editor.graph.isSelectionEmpty();
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : selectionEmpty;
		var bg = (transparentBackground) ? null : this.editor.graph.background;
		
		if (bg == mxConstants.NONE)
		{
			bg = null;
		}
		
		// Handles special case where background is null but transparent is false
		if (bg == null && transparentBackground == false)
		{
			bg = '#ffffff';
		}
		
		// Sets or disables alternate text for foreignObjects. Disabling is needed
		// because PhantomJS seems to ignore switch statements and paint all text.
		var svgRoot = this.editor.graph.getSvg(bg, scale, null, null, null, ignoreSelection);
		
		if (addShadow)
		{
			this.editor.addSvgShadow(svgRoot);
		}
	
		var file = this.getCurrentFile();
		var filename = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		
		var dot = filename.lastIndexOf('.');
		
		if (dot > 0)
		{
			filename = filename.substring(0, dot);
		}
		
		filename += '.svg';
		
		if (this.spinner.spin(document.body, mxResources.get('export')))
		{
			var doSave = mxUtils.bind(this, function(svgRoot)
			{
				this.spinner.stop();
				
				if (editable)
				{
					svgRoot.setAttribute('content', this.getFileData(true, null, null, null, ignoreSelection));
				}
				
				var svg = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
					mxUtils.getXml(svgRoot);
				
	    		if (this.isLocalFileSave() || svg.length <= MAX_REQUEST_SIZE)
	    		{
	    	    	this.saveData(filename, 'svg', svg, 'image/svg+xml');
	    		}
	    		else
	    		{
	    			this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'), mxUtils.bind(this, function()
	    			{
	    				mxUtils.popup(svg);
	    			}));
	    		}
			});
			
			this.convertMath(this.editor.graph, svgRoot, false, mxUtils.bind(this, function()
			{
				if (embedImages)
				{
					this.convertImages(svgRoot, doSave);
				}
				else
				{
					doSave(svgRoot);
				}
			}));
		}
	};

	/**
	 * 
	 */
	EditorUi.prototype.showRemoteExportDialog = function(btnLabel, helpLink, callback)
	{
		var graph = this.editor.graph;
		var content = document.createElement('div');
		content.style.padding = '6px';
		
		var cb2 = document.createElement('input');
		cb2.style.marginRight = '8px';
		cb2.setAttribute('type', 'checkbox');
		
		if (graph.isSelectionEmpty())
		{
			cb2.setAttribute('disabled', 'disabled');
		}
		
		content.appendChild(cb2);
		mxUtils.write(content, mxResources.get('selectionOnly'));
		mxUtils.br(content);
		
		var cb = document.createElement('input');
		cb.setAttribute('type', 'checkbox');
		cb.setAttribute('checked', 'checked');
		cb.defaultChecked = true;
		cb.style.marginRight = '8px';
		cb.style.marginTop = '16px';
		
		content.appendChild(cb);
		mxUtils.write(content, mxResources.get('includeCopyOfMyDiagram'));
		
		var dlg = new CustomDialog(this, content, mxUtils.bind(this, function()
		{
			callback(!cb2.checked, cb.checked);
		}), null, btnLabel, helpLink);
		this.showDialog(dlg.container, 300, 120, true, true);
	}
	
	/**
	 * 
	 */
	EditorUi.prototype.showExportDialog = function(embedOption, btnLabel, helpLink, callback)
	{
		var graph = this.editor.graph;
		var content = document.createElement('div');
		content.style.paddingTop = '20px';
		content.style.paddingRight = '8px';
		
		var cb = document.createElement('input');
		cb.style.marginRight = '8px';
		cb.setAttribute('type', 'checkbox');
		
		if (graph.background == mxConstants.NONE || graph.background == null)
		{
			cb.setAttribute('checked', 'checked');
			cb.defaultChecked = true;
		}
		
		content.appendChild(cb);
		mxUtils.write(content, mxResources.get('transparentBackground'));
		mxUtils.br(content);
		
		var cb2 = document.createElement('input');
		cb2.style.marginTop = '16px';
		cb2.style.marginRight = '8px';
		cb2.setAttribute('type', 'checkbox');
		
		if (graph.isSelectionEmpty())
		{
			cb2.setAttribute('disabled', 'disabled');
		}
		
		content.appendChild(cb2);
		mxUtils.write(content, mxResources.get('selectionOnly'));
		mxUtils.br(content);
		
		var cb3 = document.createElement('input');
		cb3.style.marginTop = '16px';
		cb3.style.marginRight = '8px';
		cb3.setAttribute('type', 'checkbox');
		
		content.appendChild(cb3);
		mxUtils.write(content, mxResources.get('shadow'));
		mxUtils.br(content);
		
		if (graph.shadowVisible)
		{
			cb3.setAttribute('checked', 'checked');
			cb3.defaultChecked = true;
		}
		
		var cb5 = document.createElement('input');
		cb5.style.marginTop = '16px';
		cb5.style.marginRight = '8px';
		cb5.setAttribute('type', 'checkbox');
		
		if (this.isOffline() || !this.canvasSupported)
		{
			cb5.setAttribute('disabled', 'disabled');
		}
		
		if (embedOption)
		{
			content.appendChild(cb5);
			mxUtils.write(content, mxResources.get('embedImages'));
			mxUtils.br(content);
		}
		
		var cb4 = document.createElement('input');
		cb4.style.marginTop = '16px';
		cb4.style.marginRight = '8px';
		cb4.setAttribute('type', 'checkbox');
		cb4.style.marginBottom = '8px';
		cb4.setAttribute('checked', 'checked');
		cb4.defaultChecked = true;
		
		content.appendChild(cb4);
		mxUtils.write(content, mxResources.get('includeCopyOfMyDiagram'));
		
		var dlg = new FilenameDialog(this, 100, btnLabel, mxUtils.bind(this, function(newValue)
		{
		   	callback(newValue, cb.checked, !cb2.checked, cb3.checked, cb4.checked, cb5.checked);
		}), mxResources.get('zoom') + ' (%)', null, content, (!this.isOffline()) ? helpLink : null);
		
		this.showDialog(dlg.container, 320, (embedOption) ? 266 : 240, true, true);
		dlg.init();
	}
		
	/**
	 * 
	 */
	EditorUi.prototype.uploadToGithub = function(file, base64Data, editable)
	{
		var resume = this.spinner.pause();
		
		var content = document.createElement('div');
		content.style.paddingTop = '20px';
		content.style.paddingRight = '8px';
		
		var table = document.createElement('table');
		var tbody = document.createElement('tbody');
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		
		var uname = document.createElement('input');
		uname.setAttribute('type', 'text');
		mxUtils.write(td, 'Username:');
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(uname);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		var pword = document.createElement('input');
		pword.setAttribute('type', 'password');
		mxUtils.write(td, 'Password:');
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(pword);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		var org = document.createElement('input');
		org.setAttribute('type', 'text');
		mxUtils.write(td, 'Organisation:');
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(org);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		var repo = document.createElement('input');
		repo.setAttribute('type', 'text');
		mxUtils.write(td, 'Repository:');

		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(repo);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);

		var path = document.createElement('input');
		path.setAttribute('type', 'text');
		mxUtils.write(td, 'Path:');
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(path);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		var file = this.getCurrentFile();
		var filename = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		var dot = filename.lastIndexOf('.');
		
		if (dot > 0)
		{
			filename = filename.substring(0, dot);
		}
		
		path.value = filename + '.png';

		var ref = document.createElement('input');
		ref.setAttribute('type', 'text');
		mxUtils.write(td, 'Branch/Tag:');
		ref.value = 'master';
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(ref);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);

		var msg = document.createElement('input');
		msg.setAttribute('type', 'text');
		mxUtils.write(td, 'Message:');
		msg.value = 'Updated ' + filename + '.png';
		
		tr = tr.cloneNode(false);
		tr.appendChild(td);
		td = td.cloneNode(false);
		td.appendChild(msg);
		tr.appendChild(td);
		tbody.appendChild(tr);
		td = td.cloneNode(false);
		
		table.appendChild(tbody);
		content.appendChild(table);
		
		var dlg = new FilenameDialog(this, null, mxResources.get('publish'), mxUtils.bind(this, function()
		{
			var url = 'https://api.github.com/repos/' + org.value + '/' + repo.value +
				'/contents/' + path.value + '?ref=' + encodeURIComponent(ref.value);
			resume();
			
			mxUtils.get(url, mxUtils.bind(this, function(req)
			{
				if (req.getStatus() == 200 || req.getStatus() == 404)
				{
					var obj = JSON.parse(req.getText());
					var entity =
					{
						path: path.value,
						message: msg.value,
						content: base64Data
					};			
					
					if (obj.sha != null)
					{
						entity.sha = obj.sha;
					}
					
					// Native PUT request
					var req2 = new XMLHttpRequest();
					req2.onreadystatechange = mxUtils.bind(this, function()
					{
						if (req2.readyState == 4)
						{
							if (req2.status >= 200 && req2.status < 300)
							{
								this.spinner.stop();
								this.hideDialog();
								
								url = 'https://github.com/' + org.value + '/' + repo.value + '/blob/' + ref.value + '/' + path.value;
								var dlg = new ErrorDialog(this, mxResources.get('published'),
									mxResources.get('publishedAt', ['<a href="' + url + '" target="_blank">' + url + '</a>']),
									mxResources.get('close'), mxUtils.bind(this, function()
									{
										this.hideDialog();
									}), null,
									mxResources.get('openInNewWindow'), mxUtils.bind(this, function()
									{
										window.open(url);
									}), false);
								this.showDialog(dlg.container, 340, 170, true, false);
								dlg.init();
							}
							else
							{
								resume = this.spinner.pause();
								this.handleError(JSON.parse(req2.responseText));
							}
						}
					});
					
					req2.open('PUT', url, true);
					req2.setRequestHeader('Authorization', 'Basic ' +
						btoa(uname.value + ':' + pword.value));
					req2.send(JSON.stringify(entity));
				}
				else
				{
					this.hideDialog();
					this.spinner.stop();
					this.handleError(JSON.parse(req.getText()));
				}
			}), mxUtils.bind(this, function(req)
			{
				this.hideDialog();
				this.spinner.stop();
				this.handleError({message: mxResources.get('unknownError')});
			}));
		}), null, null, content, null, false);
		
		this.showDialog(dlg.container, 260, 260, true, false);
		dlg.init();
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.uploadToImgur = function(file, base64Data, editable, socialHandler)
	{
		var resume = this.spinner.pause();
		
		// Shows a warning dialog before uploading
		var dlg = new ErrorDialog(this, mxResources.get('warning'),
			'<img style="max-width:300px;max-height:80px;margin-bottom:20px;padding:6px;border:1px solid gray;" ' +
			'src="data:image/png;base64,' + base64Data + '"/><br>' +
			mxResources.get('publishConfirmation'),
			mxResources.get('cancel'), mxUtils.bind(this, function()
			{
				// Do nothing
			}), null,
			mxResources.get('publish'), mxUtils.bind(this, function()
			{
				resume();
				
				var title = (file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		   	    var dot = title.lastIndexOf('.');
		   	    var filename = title;
		   	    
		   	    if (dot > 0)
		   	    {
		   	    	title = filename.substring(0, dot);
		   	    	filename = title;
		   	    }
		   	    
		   	    filename += '.png';
				
				// Indirection via servlet for billing and hiding secrets
				var req = new mxXmlRequest('/imgur', JSON.stringify({type: 'base64', image: base64Data,
					name: filename, title: title, description: 'Made with https://www.draw.io'}), 'POST');
				
				var extractAndHandleError = mxUtils.bind(this, function(req)
				{
					var e = {message: mxResources.get('unknownError')};
					
					try
					{
						var res = JSON.parse(req.getText());
						e = {message: res.message || res.data.error};
					}
					catch (err)
					{
						// ignore
					}
					
					this.handleError(e);
				});
				
				// First request to upload image to Imgur
				req.send(mxUtils.bind(this, function(req)
				{
					if (req.getStatus() == 200)
					{
						try
						{
							var res = JSON.parse(req.getText());
					    	var viewUrl = 'https://www.draw.io/i/' + res.data.id;
					    	
					    	// Logs publishing of diagrams
					    	try
					    	{
								var img = new Image();
								
								// Timestamp is added to bypass client-side cache
								var logDomain = window.DRAWIO_LOG_URL != null ? window.DRAWIO_LOG_URL : '';
								img.src = logDomain + '/log?severity=CONFIG&msg=imgur-published:' + res.data.id + '&v=' +
									encodeURIComponent(EditorUi.VERSION) + '&ts=' + new Date().getTime();
					    	}
					    	catch (e)
					    	{
					    		// ignore
					    	}
							
							var showResult = mxUtils.bind(this, function()
							{
								this.spinner.stop();
								var url = 'https://imgur.com/' + res.data.id;
								var deleteUrl = 'https://www.draw.io/imgur?delete=' + res.data.deletehash;
								
								var dlg = new ErrorDialog(this, mxResources.get('published'),
									((editable) ? mxResources.get('viewUrl', ['<a href="' + viewUrl +
										'" target="_blank">' + viewUrl + '</a>']) + '<br>' : '') +
									mxResources.get('publishedAt', ['<a href="' + url + '" target="_blank">' + url + '</a>']) +
									'<br>' + mxResources.get('deleteUrl', [deleteUrl]),
									mxResources.get('close'), mxUtils.bind(this, function()
									{
										this.hideDialog();
									}), null, mxResources.get('share'), function()
									{
										socialHandler(res.data.id, editable);
									}, false);
								this.showDialog(dlg.container, 340, 180, true, false);
								dlg.init();
							});
							
							if (!editable)
							{
								showResult();
							}
							else
							{
								// Second request to update the description with the edit link
								// Replacing the .png is workaround for Imgur to handle it as an image
								// Avoiding URL parameter avoids call to getParameter in the servlet
								var url2 = '/imgur?' + res.data.deletehash;
								var req2 = new mxXmlRequest(url2, JSON.stringify({title: title,
									description: mxResources.get('viewUrl', [viewUrl])}), 'POST');
				
								req2.send(mxUtils.bind(this, function()
								{
									if (req2.getStatus() == 200)
									{
										showResult();
									}
									else
									{
										extractAndHandleError(req2);
									}
								}), mxUtils.bind(this, function()
								{
									extractAndHandleError(req2);
								}));
							}
						}
						catch (e)
						{
							this.handleError(e);
						}
					}
					else
					{
						extractAndHandleError(req);
					}
				}), mxUtils.bind(this, function(req)
				{
					extractAndHandleError(req);
				}));
			}));
		this.showDialog(dlg.container, 320, 250, true, false);
		dlg.init();
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.publishImage = function(handler, socialHandler)
	{
	   	var file = this.getCurrentFile();
	   	
	   	if (file != null)
	   	{
			if (this.isExportToCanvas())
			{
				this.showExportDialog(false, mxResources.get('publish'), 'https://support.draw.io/pages/viewpage.action?pageId=12222625', mxUtils.bind(this, function(scale, transparentBackground, ignoreSelection, addShadow, editable)
				{
					var val = parseInt(scale);
					
					if (!isNaN(val) && val > 0)
					{
						var scale = val / 100;
						var selectionEmpty = this.editor.graph.isSelectionEmpty();
						ignoreSelection = (ignoreSelection != null) ? ignoreSelection : selectionEmpty;
		
					   	if (this.spinner.spin(document.body, mxResources.get('publishing')))
						{
							try
							{
							   	this.exportToCanvas(mxUtils.bind(this, function(canvas)
							   	{
							   		try
							   		{
							   			var xml = (editable) ? this.getFileData(true, null, null, null, ignoreSelection) : null;
							   			var data = this.createPngDataUri(canvas, xml);
							   	   	    handler(file, data.substring(data.lastIndexOf(',') + 1), editable, socialHandler);
							   		}
							   		catch (e)
							   		{
							   			this.handleError(e);
							   		}
							   	}), null, null, null, mxUtils.bind(this, function(e)
							   	{
							   		this.handleError(e);
							   	}), null, ignoreSelection, scale || 1, transparentBackground, addShadow);
							}
							catch (e)
							{
								this.handleError(e);
							}
						}
					}
				}));
			}
			else
			{
				this.showRemoteExportDialog(mxResources.get('publish'), 'https://support.draw.io/pages/viewpage.action?pageId=12222625', mxUtils.bind(this, function(ignoreSelection, editable)
				{
					if (this.spinner.spin(document.body, mxResources.get('publishing')))
					{
						var bounds = this.editor.graph.getGraphBounds();
						var data = this.getFileData(true, null, null, null, ignoreSelection);
						
						if (bounds.width * bounds.height <= MAX_AREA && data.length <= MAX_REQUEST_SIZE)
						{
							var embed = (editable) ? '1' : '0';
					       	
							try
							{
								var req = new mxXmlRequest(EXPORT_URL, 'format=png' +
									'&base64=1&embedXml=' + embed + '&xml=' +
									encodeURIComponent(data));
								
								req.send(mxUtils.bind(this, function()
								{
									if (req.getStatus() == 200)
									{
										handler(file, req.getText(), editable, socialHandler);
									}
									else
									{
										this.handleError(req);
									}
								}));
							}
							catch (e)
							{
								this.handleError(e);
							}
						}
						else
						{
							this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'));
						}
					}
				}));
			}
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.timeSince = function(date)
	{
	    var seconds = Math.floor((new Date() - date) / 1000);
		
	    var interval = Math.floor(seconds / 31536000);

	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('years');
	    }
	    
	    interval = Math.floor(seconds / 2592000);
	    
	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('months');
	    }
	    
	    interval = Math.floor(seconds / 86400);
	    
	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('days');
	    }
	    
	    interval = Math.floor(seconds / 3600);
	    
	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('hours');
	    }
	    
	    interval = Math.floor(seconds / 60);
	    
	    if (interval > 1)
	    {
	        return interval + ' ' + mxResources.get('minutes');
	    }
	    
	    if (interval == 1)
	    {
	        return interval + ' ' + mxResources.get('minute');
	    }
	    
	    return null;
	};

	/**
	 * Converts math in the given SVG
	 */
	EditorUi.prototype.convertMath = function(graph, svgRoot, fixPosition, callback)
	{
		// FIXME: Only horizontal dash in output so better no conversion at all
		if (false && graph.mathEnabled && typeof(MathJax) !== 'undefined' && typeof(MathJax.Hub) !== 'undefined')
		{
			// Workaround for lost gradients in Chrome after remove from DOM
			var elts = svgRoot.getElementsByTagName('*');
			
			for (var i = 0; i < elts.length; i++)
			{
				if (elts[i].getAttribute('id') != null)
				{
					elts[i].setAttribute('id', 'mxTemporaryPrefix-' + elts[i].getAttribute('id'));
				}
			}

			// Temporarily attaches to DOM for rendering
			svgRoot.style.visibility = 'hidden';
			document.body.appendChild(svgRoot);
			Editor.MathJaxRender(svgRoot);
			
			MathJax.Hub.Queue(mxUtils.bind(this, function ()
			{
				// Removes from DOM
				svgRoot.parentNode.removeChild(svgRoot);
				svgRoot.style.visibility = '';
				
				// Restores original IDs
				for (var i = 0; i < elts.length; i++)
				{
					if (elts[i].getAttribute('id') != null)
					{
						elts[i].setAttribute('id', elts[i].getAttribute('id').substring('mxTemporaryPrefix-'.length));
					}
				}
				
				// Keeping scale but moving translate only works for image export which
				// is fine since we do not want the SVG export to contain a workaround.
				// See https://github.com/mathjax/MathJax/issues/279
				if (fixPosition && navigator.userAgent.indexOf('AppleWebKit/') >= 0)
				{
					var fo = svgRoot.getElementsByTagName('foreignObject');
					
					for (var i = 0; i < fo.length; i++)
					{
						var tr = fo[i].parentNode.parentNode.getAttribute('transform');
						var translate  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(tr);
					
						fo[i].setAttribute('x', Math.round(translate[1]));
						fo[i].setAttribute('y', Math.round(translate[2]));
						
						// Must use translate for crisp rendering
						fo[i].parentNode.parentNode.setAttribute('transform', 'translate(0.5,0.5)' + tr.substring(tr.indexOf(')') + 1));
					}
				}
				
				callback();
			}));
		}
		else
		{
			callback();
		}
	};
	
	/**
	 * Returns the SVG of the diagram with embedded XML. If a callback function is
	 * used, the images are converted to data URIs.
	 */
	EditorUi.prototype.getEmbeddedSvg = function(xml, graph, url, noHeader, callback, ignoreSelection, redirect)
	{
		var bg = null;
		
		if (graph != null)
		{
			bg = graph.background;
			
			if (bg == mxConstants.NONE)
			{
				bg = null;
			}
		}

		// Sets or disables alternate text for foreignObjects. Disabling is needed
		// because PhantomJS seems to ignore switch statements and paint all text.
		var svgRoot = graph.getSvg(bg, null, null, null, null, ignoreSelection);

		if (xml != null)
		{
			svgRoot.setAttribute('content', encodeURIComponent(xml));
		}
		
		if (url != null)
		{
			svgRoot.setAttribute('resource', url);
		}

		// LATER: Click on SVG content to start editing
//		if (redirect != null)
//		{
//			// TODO: Ignore anchor tag source for click event
//			svgRoot.setAttribute('style', 'cursor:pointer;');
//			svgRoot.setAttribute('onclick', 'window.location.href=\'' + redirect + '\';'); 
//		}

		if (callback != null)
		{
			this.convertImages(svgRoot, mxUtils.bind(this, function(svgRoot)
			{
				callback(((!noHeader) ? '<?xml version="1.0" encoding="UTF-8"?>\n' +
					'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' : '') +
					mxUtils.getXml(svgRoot));
			}));
		}
		else
		{
			return ((!noHeader) ? '<?xml version="1.0" encoding="UTF-8"?>\n' +
				'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' : '') +
				mxUtils.getXml(svgRoot);
		}
	};
	
	/**
	 *
	 */
	EditorUi.prototype.exportImage = function(scale, transparentBackground, ignoreSelection, addShadow, editable)
	{
		if (this.spinner.spin(document.body, mxResources.get('exporting')))
		{
			var selectionEmpty = this.editor.graph.isSelectionEmpty();
			ignoreSelection = (ignoreSelection != null) ? ignoreSelection : selectionEmpty;
			
			try
			{
			   	this.exportToCanvas(mxUtils.bind(this, function(canvas)
			   	{
			   		this.spinner.stop();
			   		
			   		try
			   		{
			   			this.saveCanvas(canvas, (editable) ? this.getFileData(true, null, null, null, ignoreSelection) : null);
			   		}
			   		catch (e)
			   		{
			   			// Fallback to server-side image export
			   			if (e.message == 'Invalid image')
			   			{
			   				this.downloadFile('png');
			   			}
			   			else
			   			{
				   			this.handleError(e);
			   			}
			   		}
			   	}), null, null, null, mxUtils.bind(this, function(e)
			   	{
			   		this.spinner.stop();
			   		this.handleError(e);
			   	}), null, ignoreSelection, scale || 1, transparentBackground, addShadow);
			}
			catch (e)
			{
				this.spinner.stop();
				this.handleError(e);
			}
		}
	};

	/**
	 *
	 */
	EditorUi.prototype.exportToCanvas = function(callback, width, imageCache, background, error, limitHeight,
		ignoreSelection, scale, transparentBackground, addShadow, converter, graph)
	{
		limitHeight = (limitHeight != null) ? limitHeight : true;
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
		graph = (graph != null) ? graph : this.editor.graph;
		
		var bg = (transparentBackground) ? null : graph.background;
		
		if (bg == mxConstants.NONE)
		{
			bg = null;
		}
		
		if (bg == null)
		{
			bg = background;
		}
		
		// Handles special case where background is null but transparent is false
		if (bg == null && transparentBackground == false)
		{
			bg = '#ffffff';
		}
		
		this.convertImages(graph.getSvg(bg, null, null, null, null, ignoreSelection), mxUtils.bind(this, function(svgRoot)
		{
			var img = new Image();
			
			img.onload = mxUtils.bind(this, function()
			{
				var canvas = document.createElement('canvas');
				var w = parseInt(svgRoot.getAttribute('width'));
				var h = parseInt(svgRoot.getAttribute('height'));
				scale = (scale != null) ? scale : 1;
				
				if (width != null)
				{
					scale = (!limitHeight) ? width / w : Math.min(1, Math.min((width * 3) / (h * 4), width / w));
				}
				
		   		canvas.setAttribute('width', Math.ceil(scale * w));
		   		canvas.setAttribute('height', Math.ceil(scale * h));
		   		var ctx = canvas.getContext('2d');
		   		ctx.scale(scale, scale);
				ctx.drawImage(img, 0, 0);
				callback(canvas);
			});
			
			img.onerror = function(e)
			{
				//console.log('img', e, img.src);
				
				if (error != null)
				{
					error(e);
				}
			};

			try
			{
				if (addShadow)
				{
					this.editor.addSvgShadow(svgRoot);
				}
				
				this.convertMath(graph, svgRoot, true, mxUtils.bind(this, function()
				{
					img.src = this.createSvgDataUri(mxUtils.getXml(svgRoot));
				}));
			}
			catch (e)
			{
				//console.log('src', e, img.src);
				
				if (error != null)
				{
					error(e);
				}
			}
		}), imageCache, converter);
	};

	/**
	 * Converts all images in the SVG output to data URIs for immediate rendering
	 */
	EditorUi.prototype.createImageUrlConverter = function()
	{
		var converter = new mxUrlConverter();
		converter.updateBaseUrl();

		// Extends convert to avoid CORS using an image proxy server
		// LATER: Use img.crossOrigin="anonymous" to avoid proxy
		var convert = converter.convert;
		
		converter.convert = function(src)
		{
			if (src != null)
			{
				if ((src.substring(0, 7) == 'http://' || src.substring(0, 8) == 'https://') &&
					src.substring(0, converter.baseUrl.length) != converter.baseUrl)
				{
					src = PROXY_URL + '?url=' + encodeURIComponent(src);
				}
				else if (src.substring(0, 19) != 'chrome-extension://')
				{
					src = convert.apply(this, arguments);
				}
			}
			
			return src;
		};
		
		return converter;
	};
	
	/**
	 * Converts all images in the SVG output to data URIs for immediate rendering
	 */
	EditorUi.prototype.convertImages = function(svgRoot, callback, imageCache, converter)
	{
		// Converts images to data URLs for immediate painting
		if (converter == null)
		{
			converter = this.createImageUrlConverter();
		}
		
		// Barrier for asynchronous image loading
		var counter = 0;
		
		function inc()
		{
			counter++;
		};
		
		function dec()
		{
			counter--;
			
			if (counter == 0)
			{
				callback(svgRoot);
			}
		};

		var cache = imageCache || new Object();
		
		var convertImages = mxUtils.bind(this, function(tagName, srcAttr)
		{
			var images = svgRoot.getElementsByTagName(tagName);
			
			for (var i = 0; i < images.length; i++)
			{
				(mxUtils.bind(this, function(img)
				{
					var src = converter.convert(img.getAttribute(srcAttr));
					
					// Data URIs are pass-through
					if (src != null && src.substring(0, 5) != 'data:')
					{
						var tmp = cache[src];
						
						if (tmp == null)
						{
							inc();
							
							this.convertImageToDataUri(src, function(uri)
							{
								if (uri != null)
								{
									cache[src] = uri;
									img.setAttribute(srcAttr, uri);
								}
								
								dec();
							});
						}
						else
						{
							img.setAttribute(srcAttr, tmp);
						}
					}
				}))(images[i]);
			}
		});
		
		// Converts all known image tags in output
		// LATER: Add support for images in CSS
		convertImages('image', 'xlink:href');
		convertImages('img', 'src');
		
		// All from cache or no images
		if (counter == 0)
		{
			callback(svgRoot);
		}
	};
	
	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.convertImageToDataUri = function(url, callback)
	{
		if (/(\.svg)$/i.test(url))
		{
			mxUtils.get(url, mxUtils.bind(this, function(req)
			{
				callback(this.createSvgDataUri(req.getText()));
			}),
			function()
			{
				callback();
			});
		}
		else
		{
		    var img = new Image();
		    
		    img.onload = function()
		    {
		        var canvas = document.createElement('canvas');
		        var ctx = canvas.getContext('2d');
		        canvas.height = img.height;
		        canvas.width = img.width;
		        ctx.drawImage(img, 0, 0);
		        callback(canvas.toDataURL());
		    };
		    
		    img.onerror = function()
		    {
		    	callback();
		    };
		    
		    img.src = url;
		}
	};
	
	/**
	 * Handling drag and drop and import.
	 */

	/**
	 * Imports the given XML into the existing diagram.
	 */
	EditorUi.prototype.importXml = function(xml, dx, dy, crop, noErrorHandling)
	{
		dx = (dx != null) ? dx : 0;
		dy = (dy != null) ? dy : 0;
		var cells = []
		
		try
		{
			var graph = this.editor.graph;
	
			if (xml != null && xml.length > 0)
			{
				var doc = mxUtils.parseXml(xml);
				
				// Checks for mxfile with multiple pages
				var node = this.editor.extractGraphModel(doc.documentElement, this.pages != null);
				
				if (node != null && node.nodeName == 'mxfile' && this.pages != null)
				{
					var diagrams = node.getElementsByTagName('diagram');

					if (diagrams.length == 1)
					{
						node = mxUtils.parseXml(graph.decompress(mxUtils.getTextContent(diagrams[0]))).documentElement;
					}
					else if (diagrams.length > 1)
					{
						// Adds pages
						graph.model.beginUpdate();
						try
						{
							for (var i = 0; i < diagrams.length; i++)
							{
								var page = this.updatePageRoot(new DiagramPage(diagrams[i]));
								var index = this.pages.length;
								
								// Checks for invalid page names
								if (page.getName() == null)
								{
									page.setName(mxResources.get('pageWithNumber', [index + 1]));
								}
								
								graph.model.execute(new ChangePage(this, page, page, index));
							}
						}
						finally
						{
							graph.model.endUpdate();
						}
					}
				}
				
				if (node != null && node.nodeName === 'mxGraphModel')
				{
					var model = new mxGraphModel();
					var codec = new mxCodec(node.ownerDocument);
					codec.decode(node, model);
					
					var childCount = model.getChildCount(model.getRoot());
					var targetChildCount = graph.model.getChildCount(graph.model.getRoot());
					
					// Merges into active layer if one layer is pasted
					graph.model.beginUpdate();
					try
					{
						// Mapping for multiple calls to cloneCells with the same set of cells
						var mapping = new Object();
						
						for (var i = 0; i < childCount; i++)
						{
							var parent = model.getChildAt(model.getRoot(), i);
							
							// Adds cells to existing layer if not locked
							if (childCount == 1 && !graph.isCellLocked(graph.getDefaultParent()))
							{
								var children = model.getChildren(parent);
								cells = cells.concat(graph.importCells(children, dx, dy, graph.getDefaultParent(), null, mapping));
							}
							else
							{
								// Delta is non cascading, needs separate move for layers
								parent = graph.importCells([parent], 0, 0, graph.model.getRoot(), null, mapping)[0];
								var children = graph.model.getChildren(parent);
								graph.moveCells(children, dx, dy);
								cells = cells.concat(children);
							}
						}
						
						if (crop)
						{
							if (graph.isGridEnabled())
							{
								dx = graph.snap(dx);
								dy = graph.snap(dy);
							}
							
							var bounds = graph.getBoundingBoxFromGeometry(cells, true);
							
							if (bounds != null)
							{
								graph.moveCells(cells, dx - bounds.x, dy - bounds.y);
							}
						}
					}
					finally
					{
						graph.model.endUpdate();
					}
				}
			}
		}
		catch (e)
		{
			if (!noErrorHandling)
			{
				this.handleError(e, mxResources.get('invalidOrMissingFile'));
			}
			
			throw e;
		}
		
		return cells;
	};

	/**
	 * Automatic loading for lucidchart import.
	 */
	EditorUi.prototype.insertLucidChart = function(g, dx, dy, crop)
	{
		var delayed = mxUtils.bind(this, function()
		{
			// Checks for signature method
			if (this.pasteLucidChart)
			{
				try
				{
					this.pasteLucidChart(g, dx, dy, crop);
				}
				catch (e)
				{
					// ignore
				}
			}
		});
		
		if (!this.pasteLucidChart && !this.loadingExtensions && !this.isOffline())
		{
			this.loadingExtensions = true;
			
			if (urlParams['dev'] == '1')
			{
				mxscript('/js/diagramly/Extensions.js', delayed);
			}
			else
			{
				mxscript('/js/extensions.min.js', delayed);
			}
		}
		else
		{
			// Must be async for cell selection
			window.setTimeout(delayed, 0);
		}
	};
	
	/**
	 * Imports the given XML into the existing diagram.
	 * TODO: Make this function asynchronous
	 */
	EditorUi.prototype.insertTextAt = function(text, dx, dy, html, asImage, crop)
	{
		crop = (crop != null) ? crop : true;
		
		// Handles special case for Gliffy data which requires async server-side for parsing
		if (text != null)
		{
			if (Graph.fileSupport && !this.isOffline() && new XMLHttpRequest().upload && this.isRemoteFileFormat(text))
			{
				// Fixes possible parsing problems with ASCII 160 (non-breaking space)
				this.parseFile(new Blob([text.replace(/\s+/g,' ')], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
				{
					if (xhr.readyState == 4 && xhr.status == 200)
					{
						this.editor.graph.setSelectionCells(this.insertTextAt(xhr.responseText, dx, dy, true));
					}
				}));
				
				// Returns empty cells array as it is aysynchronous
				return [];
			}
			// Handles special case of data URI which requires async loading for finding size
			else if (text.substring(0, 5) == 'data:' || (!this.isOffline() && (asImage || (/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(text))))
			{
				var graph = this.editor.graph;
				
				// Checks for embedded XML in PNG
				if (text.substring(0, 22) == 'data:image/png;base64,')
				{
					var xml = this.extractGraphModelFromPng(text);
					var result = this.importXml(xml, dx, dy, crop, true); 
					
					if (result.length > 0)
					{
						return result;
					}
				}
				
				// Tries to extract embedded XML from SVG data URI
				if (text.substring(0, 19) == 'data:image/svg+xml;')
				{
					try
					{
						var xml = null;
						
						if (text.substring(0, 26) == 'data:image/svg+xml;base64,')
						{
							xml = text.substring(text.indexOf(',') + 1);
							xml = (window.atob && !mxClient.IS_SF) ? atob(xml) : Base64.decode(xml, true);
						}
						else
						{
							xml = decodeURIComponent(text.substring(text.indexOf(',') + 1));
						}
						
						var result = this.importXml(xml, dx, dy, crop, true); 
	
						if (result.length > 0)
						{
							return result;
						}
					}
					catch (e)
					{
						// Ignore
					}
				}
				
				this.loadImage(text, mxUtils.bind(this, function(img)
				{
					if (text.substring(0, 5) == 'data:')
					{
						this.resizeImage(img, text, mxUtils.bind(this, function(data2, w2, h2)
	    				{
							graph.setSelectionCell(graph.insertVertex(null, null, '', graph.snap(dx), graph.snap(dy),
									w2, h2, 'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
									'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + this.convertDataUri(data2) + ';'));
	    				}), true, this.maxImageSize);
					}
					else
					{
						var s = Math.min(1, Math.min(this.maxImageSize / img.width, this.maxImageSize / img.height));
						var w = Math.round(img.width * s);
						var h = Math.round(img.height * s);
						
						graph.setSelectionCell(graph.insertVertex(null, null, '', graph.snap(dx), graph.snap(dy),
								w, h, 'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
								'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + text + ';'));
					}
				}), mxUtils.bind(this, function()
				{
					var cell = null;
					
					// Inserts invalid data URIs as text
			    	graph.getModel().beginUpdate();
			    	try
			    	{
						cell = graph.insertVertex(graph.getDefaultParent(), null, text,
								graph.snap(dx), graph.snap(dy), 1, 1, 'text;' + ((html) ? 'html=1;' : ''));
						graph.updateCellSize(cell);
						graph.fireEvent(new mxEventObject('textInserted', 'cells', [cell]));
			    	}
			    	finally
			    	{
			    		graph.getModel().endUpdate();
			    	}
	
					graph.setSelectionCell(cell);
				}));
				
				return [];
			}
			else
			{
				text = this.editor.graph.zapGremlins(mxUtils.trim(text));
			
				if (this.isCompatibleString(text))
				{
					return this.importXml(text, dx, dy, crop);
				}
				else if (text.length > 0)
				{
					if (text.substring(0, 26) == '{"state":"{\\"Properties\\":')
					{
						this.insertLucidChart(JSON.parse(JSON.parse(text).state)['Pages']['0_0'], dx, dy, crop);
					}
					else
					{
						var graph = this.editor.graph;
						var cell = null;
						
				    	graph.getModel().beginUpdate();
				    	try
				    	{
				    		// Fires cellsInserted to apply the current style to the inserted text.
				    		// This requires the value to be empty when the event is fired.
							cell = graph.insertVertex(graph.getDefaultParent(), null, '',
									graph.snap(dx), graph.snap(dy), 1, 1, 'text;' + ((html) ? 'html=1;' : ''));
							graph.fireEvent(new mxEventObject('textInserted', 'cells', [cell]));
							
							// Apply value and updates the cell size to fit the text block
							cell.value = text;
							graph.updateCellSize(cell);
							
							// See http://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript
							var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
							
							if (regexp.test(cell.value))
							{
								graph.setLinkForCell(cell, cell.value);
							}
							
							// Adds spacing
							cell.geometry.width += graph.gridSize;
							cell.geometry.height += graph.gridSize;
				    	}
				    	finally
				    	{
				    		graph.getModel().endUpdate();
				    	}
						
						return [cell];
					}
				}
			}
		}
		
		return [];
	};

	/**
	 * Formats the given file size.
	 */
	EditorUi.prototype.formatFileSize = function(size)
	{
	    var units = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
		var i = -1;
	    do
	    {
	    	size = size / 1024;
	        i++;
	    } while (size > 1024);

	    return Math.max(size, 0.1).toFixed(1) + units[i];
	};

	/**
	 * Imports the given XML into the existing diagram.
	 */
	EditorUi.prototype.convertDataUri = function(uri)
	{
		// Handles special case of data URI which needs to be rewritten
		// to be used in a cell style to remove the semicolon
		if (uri.substring(0, 5) == 'data:')
		{
			var semi = uri.indexOf(';');
			
			if (semi > 0)
			{
				uri = uri.substring(0, semi) + uri.substring(uri.indexOf(',', semi + 1));
			}
		}
		
		return uri;
	};
	
	/**
	 * Returns true for Gliffy or GraphML data or .vsdx filenames.
	 */
	EditorUi.prototype.isRemoteFileFormat = function(data, filename)
	{
		return /(\.*<graphml xmlns=\".*)/.test(data) ||
			/(\"contentType\":\s*\"application\/gliffy\+json\")/.test(data) ||
			(filename != null && /(\.vsdx)($|\?)/i.test(filename));
	};
	
	/**
	 * Imports the given XML into the existing diagram.
	 */
	EditorUi.prototype.importFile = function(data, mimeType, dx, dy, w, h, filename, done, file, crop, ignoreEmbeddedXml)
	{
		crop = (crop != null) ? crop : true;
		var async = false;
		var cells = null;
		
		if (mimeType.substring(0, 5) == 'image')
		{
			var containsModel = false;

			if (mimeType.substring(0, 9) == 'image/png')
			{
				var xml = (ignoreEmbeddedXml) ? null : this.extractGraphModelFromPng(data);
				
				if (xml != null && xml.length > 0)
				{
					cells = this.importXml(xml, dx, dy, crop);
					containsModel = true;
				}
			}
			
			if (!containsModel)
			{
				var graph = this.editor.graph;
				
				// Strips encoding bit (eg. ;base64,) for cell style
				var semi = data.indexOf(';');
	
				if (semi > 0)
				{
					data = data.substring(0, semi) + data.substring(data.indexOf(',', semi + 1));
				}
				
				if (crop && graph.isGridEnabled())
				{
					dx = graph.snap(dx);
					dy = graph.snap(dy);
				}

				cells = [graph.insertVertex(null, null, '', dx, dy, w, h,
					'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
					'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + data + ';')];
			}
		}
		else if (!this.isOffline() && new XMLHttpRequest().upload && this.isRemoteFileFormat(data, filename))
		{
			//  LATER: done and async are a hack before making this asynchronous
			async = true;

			// Returns empty cells array as it is aysynchronous
			this.parseFile((file != null) ? file : new Blob([data], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
			{
				if (xhr.readyState == 4)
				{
					var importedCells = null;
					
					if (xhr.status == 200)
					{
						importedCells = this.importXml(xhr.responseText, dx, dy, crop);
					}
					
					if (done != null)
					{
						done(importedCells);
					}
				}
			}), filename);
		}
		else
		{
			cells = this.insertTextAt(this.validateFileData(data), dx, dy, true, null, crop);
		}
		
		if (!async && done != null)
		{
			done(cells);
		}
		
		return cells;
	};
	
	/**
	 * Base64 encodes the given string. This method seems to be more
	 * robust for encoding PNG from binary AJAX responses.
	 */
	EditorUi.prototype.base64Encode = function(str)
	{
	    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	    var out = "", i = 0, len = str.length, c1, c2, c3;
	    
	    while (i < len)
	    {
	        c1 = str.charCodeAt(i++) & 0xff;
	        
	        if (i == len)
	        {
	            out += CHARS.charAt(c1 >> 2);
	            out += CHARS.charAt((c1 & 0x3) << 4);
	            out += "==";
	            break;
	        }
	        
	        c2 = str.charCodeAt(i++);
	        
	        if (i == len)
	        {
	            out += CHARS.charAt(c1 >> 2);
	            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	            out += CHARS.charAt((c2 & 0xF) << 2);
	            out += "=";
	            break;
	        }
	        
	        c3 = str.charCodeAt(i++);
	        out += CHARS.charAt(c1 >> 2);
	        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	        out += CHARS.charAt(c3 & 0x3F);
	    }
	    
	    return out;
	};

	/**
	 * 
	 */
	EditorUi.prototype.importFiles = function(files, x, y, maxSize, fn, resultFn, filterFn, barrierFn, resizeImages, maxBytes, resampleThreshold, ignoreEmbeddedXml)
	{
		var crop = x != null && y != null;
		
		x = (x != null) ? x : 0;
		y = (y != null) ? y : 0;
		maxSize = (maxSize != null) ? maxSize : this.maxImageSize;
		maxBytes = (maxBytes != null) ? maxBytes : this.maxImageBytes;
		resizeImages = (resizeImages != null) ? resizeImages : true;
		
		var graph = this.editor.graph;
		var gs = graph.gridSize;

		fn = (fn != null) ? fn : mxUtils.bind(this, function(data, mimeType, x, y, w, h, filename, done, file)
		{
			if (data != null && data.substring(0, 10) == '<mxlibrary')
			{
				this.spinner.stop();
				this.loadLibrary(new LocalLibrary(this, data, filename));
    			
    			return null;
			}
			else
			{
				return this.importFile(data, mimeType, x, y, w, h, filename, done, file, crop, ignoreEmbeddedXml);
			}
		});
		
		resultFn = (resultFn != null) ? resultFn : mxUtils.bind(this, function(cells)
		{
			graph.setSelectionCells(cells);
		});

		if (this.spinner.spin(document.body, mxResources.get('loading')))
		{
			var count = files.length;
			var remain = count;
			var queue = [];
			
			// Barrier waits for all files to be loaded asynchronously
			var barrier = mxUtils.bind(this, function(index, fnc)
			{
				queue[index] = fnc;
				
				if (--remain == 0)
				{
					this.spinner.stop();
					
					if (barrierFn != null)
					{
						barrierFn(queue);
					}
					else
					{
						var cells = [];
						
						graph.getModel().beginUpdate();
						try
						{
					    	for (var j = 0; j < queue.length; j++)
					    	{
					    		var tmp = queue[j]();
					    		
					    		if (tmp != null)
					    		{
					    			cells = cells.concat(tmp);
					    		}
					    	}
						}
						finally
						{
							graph.getModel().endUpdate();
						}
					}
					
					resultFn(cells);
				}
			});
			
			for (var i = 0; i < count; i++)
			{
				(mxUtils.bind(this, function(index)
				{
					var file = files[index];
					var reader = new FileReader();
					
					reader.onload = mxUtils.bind(this, function(e)
					{
						if (filterFn == null || filterFn(file))
						{
				    		if (file.type.substring(0, 6) == 'image/')
				    		{
				    			if (file.type.substring(0, 9) == 'image/svg')
				    			{
				    				// Checks if SVG contains content attribute
			    					var data = e.target.result;
			    					var comma = data.indexOf(',');
			    					var svgText = atob(data.substring(comma + 1));
			    					var root = mxUtils.parseXml(svgText);
		    						var svgs = root.getElementsByTagName('svg');
		    						
		    						if (svgs.length > 0)
			    					{
		    							var svgRoot = svgs[0];
				    					var cont = (ignoreEmbeddedXml) ? null : svgRoot.getAttribute('content');

				    					if (cont != null && cont.charAt(0) != '<' && cont.charAt(0) != '%')
				    					{
				    						cont = unescape((window.atob) ? atob(cont) : Base64.decode(cont, true));
				    					}
				    					
				    					if (cont != null && cont.charAt(0) == '%')
				    					{
				    						cont = decodeURIComponent(cont);
				    					}

				    					if (cont != null && (cont.substring(0, 8) === '<mxfile ' ||
				    						cont.substring(0, 14) === '<mxGraphModel '))
				    					{
				    						barrier(index, mxUtils.bind(this, function()
						    				{
						    					return fn(cont, 'text/xml', x + index * gs, y + index * gs, 0, 0, file.name);	
						    				}));
				    					}
				    					else
				    					{
						    				// SVG needs special handling to add viewbox if missing and
						    				// find initial size from SVG attributes (only for IE11)
						    				barrier(index, mxUtils.bind(this, function()
						    				{
					    						try
					    						{
							    					var prefix = data.substring(0, comma + 1);
							    					
							    					// Parses SVG and find width and height
							    					if (root != null)
							    					{
							    						var svgs = root.getElementsByTagName('svg');
							    						
							    						if (svgs.length > 0)
								    					{
							    							var svgRoot = svgs[0];
								    						var w = parseFloat(svgRoot.getAttribute('width'));
								    						var h = parseFloat(svgRoot.getAttribute('height'));
								    						
								    						// Check if viewBox attribute already exists
								    						var vb = svgRoot.getAttribute('viewBox');
								    						
								    						if (vb == null || vb.length == 0)
								    						{
								    							svgRoot.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
								    						}
								    						// Uses width and height from viewbox for
								    						// missing width and height attributes
								    						else if (isNaN(w) || isNaN(h))
								    						{
								    							var tokens = vb.split(' ');
								    							
								    							if (tokens.length > 3)
								    							{
								    								w = parseFloat(tokens[2]);
								    								h = parseFloat(tokens[3]);
								    							}
								    						}
	
								    						data = this.createSvgDataUri(mxUtils.getXml(svgs[0]));
								    						
								    						var s = Math.min(1, Math.min(maxSize / Math.max(1, w)), maxSize / Math.max(1, h));
										    				
										    				return fn(data, file.type, x + index * gs, y + index * gs,
										    					Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s)), file.name);
								    					}
							    					}
					    						}
					    						catch (e)
					    						{
					    							// ignores any SVG parsing errors
					    						}
						    					
						    					return null;
						    				}));
				    					}
			    					}
				    			}
				    			else
				    			{
				    				// Checks if PNG+XML is available to bypass code below
				    				var containsModel = false;
				    				
				    				if (file.type == 'image/png')
				    				{
				    					var xml = (ignoreEmbeddedXml) ? null : this.extractGraphModelFromPng(e.target.result);
				    					
				    					if (xml != null && xml.length > 0)
				    					{
				    						var img = new Image();
				    						img.src = e.target.result;
				    						
						    				barrier(index, mxUtils.bind(this, function()
						    				{
						    					return fn(xml, 'text/xml', x + index * gs, y + index * gs,
						    						img.width, img.height, file.name);	
						    				}));
				    						
				    						containsModel = true;
				    					}
				    				}
				    				
					    			// Additional asynchronous step for finding image size
				    				if (!containsModel)
				    				{
				    					// Cannot load local files in Chrome App
				    					if (window.chrome != null && chrome.app != null && chrome.app.runtime != null)
				    					{
				    						this.spinner.stop();
				    						this.showError(mxResources.get('error'), mxResources.get('dragAndDropNotSupported'),
				    							mxResources.get('cancel'), mxUtils.bind(this, function()
			    								{
			    									// Hides the dialog
			    								}), null, mxResources.get('ok'), mxUtils.bind(this, function()
			    								{
				    								// Redirects to import function
			    									this.actions.get('import').funct();
			    								})
			    							);
				    					}
				    					else
				    					{
							    			this.loadImage(e.target.result, mxUtils.bind(this, function(img)
							    			{
							    				this.resizeImage(img, e.target.result, mxUtils.bind(this, function(data2, w2, h2)
							    				{
								    				barrier(index, mxUtils.bind(this, function()
										    		{
								    					// Refuses to insert images above a certain size as they kill the app
								    					if (data2 != null && data2.length < maxBytes)
								    					{
									    					var s = (!resizeImages || !this.isResampleImage(e.target.result)) ? 1 : Math.min(1, Math.min(maxSize / w2, maxSize / h2));
										    				
									    					return fn(data2, file.type, x + index * gs, y + index * gs, Math.round(w2 * s), Math.round(h2 * s), file.name);
								    					}
								    					else
								    					{
								    						this.handleError({message: mxResources.get('imageTooBig')});
								    						
								    						return null;
								    					}
										    		}));
							    				}), resizeImages, maxSize, resampleThreshold);
							    			}));
				    					}
				    				}
				    			}
				    		}
				    		else
				    		{
								fn(e.target.result, file.type, x + index * gs, y + index * gs, 240, 160, file.name, function(cells)
								{
									barrier(index, function()
		    	    				{
		    		    				return cells;
		    	    				});
								});
				    		}
						}
					});
					
					// Handles special case of binary file where the reader should not be used
					if (/(\.vsdx)($|\?)/i.test(file.name))
					{
						fn(null, file.type, x + index * gs, y + index * gs, 240, 160, file.name, function(cells)
						{
							barrier(index, function()
    	    				{
    		    				return cells;
    	    				});
						}, file);
					}
					else if (file.type.substring(0, 5) == 'image')
					{
						reader.readAsDataURL(file);
					}
					else
					{
						reader.readAsText(file);
					}
				}))(i);
			}
		}
	};

	/**
	 * Parses the file using XHR2 via the server. File can be a blob or file object.
	 * Filename is an optional parameter for blobs (that do not have a filename).
	 */
	EditorUi.prototype.parseFile = function(file, fn, filename)
	{
		filename = (filename != null) ? filename : file.name;
		
		var formData = new FormData();
		formData.append('format', 'xml');
		formData.append('upfile', file, filename);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', OPEN_URL);
		
		xhr.onreadystatechange = function()
		{
			fn(xhr);
		};
		
		xhr.send(formData);
	};
	
	/**
	 * 
	 */
	EditorUi.prototype.isResampleImage = function(data, thresh)
	{
		thresh = (thresh != null) ? thresh : this.resampleThreshold;

		return data.length > thresh;
	};
	
	/**
	 * Resizes the given image if <maxImageBytes> is not null.
	 */
	EditorUi.prototype.resizeImage = function(img, data, fn, enabled, maxSize, thresh)
	{
		maxSize = (maxSize != null) ? maxSize : this.maxImageSize;
		var w = Math.max(1, img.width);
		var h = Math.max(1, img.height);
		
		if (enabled && this.isResampleImage(data, thresh))
		{
			try
			{
				var factor = Math.max(w / maxSize, h / maxSize);
				
				if (factor > 1)
				{
					var w2 = Math.round(w / factor);
					var h2 = Math.round(h / factor);
					
					var canvas = document.createElement('canvas');
				    canvas.width = w2;
				    canvas.height = h2;
	
				    var ctx = canvas.getContext('2d');
				    ctx.drawImage(img, 0, 0, w2, h2);
				    
				    var tmp = canvas.toDataURL();

				    // Uses new image if smaller
				    if (tmp.length < data.length)
				    {			    
				    	// Checks if the image is empty by comparing
				    	// with an empty image of the same size
				    	var canvas2 = document.createElement('canvas');
						canvas2.width = w2;
					    canvas2.height = h2;
					    var tmp2 = canvas2.toDataURL();
					    
					    if (tmp !== tmp2)
					    {	
					    	data = tmp;
					    	w = w2;
					    	h = h2;
					    }
				    }
				}
			}
			catch (e)
			{
				// ignores image scaling errors
			}
		}

		fn(data, w, h);
	};

	/**
	 * Initializes CRC table.
	 */
	EditorUi.prototype.crcTable = [];
	
	for (var n = 0; n < 256; n++)
	{
		var c = n;
		
		for (var k = 0; k < 8; k++)
		{
			if ((c & 1) == 1)
			{
				c = 0xedb88320 ^ (c >>> 1);
			}
			else
			{
				c >>>= 1;
			}

			EditorUi.prototype.crcTable[n] = c;
		}
	}
	
	EditorUi.prototype.updateCRC = function(crc, data, off, len)
	{
		var c = crc;
	
		for (var n = 0; n < len; n++)
		{
			c = EditorUi.prototype.crcTable[(c ^ data[off + n]) & 0xff] ^ (c >>> 8);
		}
	
		return c;
	};

	/**
	 * Adds the given text to the compressed or non-compressed text chunk.
	 */
	EditorUi.prototype.writeGraphModelToPng = function(data, type, key, value, error)
	{
		var base64 = data.substring(data.indexOf(',') + 1);
		var f = (window.atob) ? atob(base64) : Base64.decode(base64, true);
		var pos = 0;
		
		function fread(d, count)
		{
			var start = pos;
			pos += count;
			
			return d.substring(start, pos);
		};
		
		// Reads unsigned long 32 bit big endian
		function _freadint(d)
		{
			var bytes = fread(d, 4);
			
			return bytes.charCodeAt(3) + (bytes.charCodeAt(2) << 8) +
				(bytes.charCodeAt(1) << 16) + (bytes.charCodeAt(0) << 24);
		};
		
		function writeInt(num)
		{
			return String.fromCharCode((num >> 24) & 0x000000ff, (num >> 16) & 0x000000ff,
				(num >> 8) & 0x000000ff, num & 0x000000ff);
		};
		
		// Checks signature
		if (fread(f,8) != String.fromCharCode(137) + 'PNG' + String.fromCharCode(13, 10, 26, 10))
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		// Reads header chunk
		fread(f,4);
		
		if (fread(f,4) != 'IHDR')
		{
			if (error != null)
			{
				error();
			}
			
			return;
		}
		
		fread(f, 17);
		var result = f.substring(0, pos);
		
		do
		{
			var n = _freadint(f);
			var chunk = fread(f,4);
			
			if (chunk == 'IDAT')
			{
				result = f.substring(0, pos - 8);
				
				var crc = 0xffffffff;
				crc = this.updateCRC(crc, type, 0, 4);
				crc = this.updateCRC(crc, value, 0, value.length);
				
				result += writeInt(key.length + value.length + 1 + ((type == 'zTXt') ? 1 : 0)) +
					type + key + String.fromCharCode(0) +
					((type == 'zTXt') ? String.fromCharCode(0) : '') + 
					value + writeInt(crc ^ 0xffffffff);

				result += f.substring(pos - 8, f.length);
				
				break;
			}
			
			result += f.substring(pos - 8, pos - 4 + n);
			value = fread(f,n);
			fread(f,4);
		}
		while (n);
		
		return 'data:image/png;base64,' + ((window.btoa) ? btoa(result) : Base64.encode(result, true));
	}
	
	/**
	 * Extracts the XML from the compressed or non-compressed text chunk.
	 */
	EditorUi.prototype.extractGraphModelFromPng = function(data)
	{
		var result = null;
		
		try
		{
			var base64 = data.substring(data.indexOf(',') + 1);

			// Workaround for invalid character error in Safari
			var binary = (window.atob && !mxClient.IS_SF) ? atob(base64) : Base64.decode(base64, true);
			
			EditorUi.parsePng(binary, mxUtils.bind(this, function(pos, type, length)
			{
				var value = binary.substring(pos + 8, pos + 8 + length);
				
				if (type == 'zTXt')
				{
					var idx = value.indexOf(String.fromCharCode(0));
					
					if (value.substring(0, idx) == 'mxGraphModel')
					{
						// Workaround for Java URL Encoder using + for spaces, which isn't compatible with JS
						var xmlData = this.editor.graph.bytesToString(pako.inflateRaw(
							value.substring(idx + 2))).replace(/\+/g,' ');
						
						if (xmlData != null && xmlData.length > 0)
						{
							result = xmlData;
						}
					}
				}
				// Uncompressed section is normally not used
				else if (type == 'tEXt')
				{
					var vals = value.split(String.fromCharCode(0));
					
					if (vals.length > 1 && vals[0] == 'mxGraphModel')
					{
						result = vals[1];
					}
				}
				
				if (result != null || type == 'IDAT')
				{
					// Stops processing the file as our text chunks
					// are always placed before the data section
					return true;
				}
			}));
		}
		catch (e)
		{
			// ignores decoding errors
		}
		
		if (result != null && result.charAt(0) == '%')
		{
			result = decodeURIComponent(result);
		}
		
		// Workaround for double encoded content
		if (result != null && result.charAt(0) == '%')
		{
			result = decodeURIComponent(result);
		}
		
		return result;
	};

	/**
	 * Loads the image from the given URI.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.loadImage = function(uri, onload, onerror)
	{
		var img = new Image();
		
		img.onload = function()
		{
			onload(img);
		}
		
		if (onerror != null)
		{
			img.onerror = onerror;
		}
		
		img.src = uri;
	};

	// Initializes the user interface
	var editorUiInit = EditorUi.prototype.init;
	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);
		var graph = this.editor.graph;
		var ui = this;
		
		if (mxClient.IS_SVG)
		{
			// LATER: Add shadow for labels in graph.container (eg. math, NO_FO), scaling
			this.editor.addSvgShadow(graph.view.canvas.ownerSVGElement, null, true);
		}
				
		/**
		 * Overrides export dialog for using ui functions for save.
		 */
		if (typeof ExportDialog !== 'undefined' && this.isLocalFileSave())
		{
			var ui = this;
			
			ExportDialog.saveLocalFile = function(data, filename, format)
			{
				var mime = 'text/xml';
				
				if (format === 'svg')
				{
					mime = 'image/svg+xml';
				}
				
	    		ui.saveLocalFile(data, filename, mime);
	    	};
	
	    	ExportDialog.saveRequest = function(data, filename, format, fn)
	    	{
	    		ui.saveRequest(data, filename, format, fn);
	    	};
		}

		/**
		 * Specifies the default filename.
		 */
		this.defaultFilename = mxResources.get('untitledDiagram');
		
		/**
		 * Adds placeholder for %page% and %pagenumber%
		 */
		var graphGetGlobalVariable = graph.getGlobalVariable;
		
		graph.getGlobalVariable = function(name)
		{
			if (name == 'page' && ui.currentPage != null)
			{
				return ui.currentPage.getName();
			}
			else if (name == 'pagenumber')
			{
				if (ui.currentPage != null && ui.pages != null)
				{
					return mxUtils.indexOf(ui.pages, ui.currentPage) + 1;
				}
				else
				{
					return 1;
				}
			}
			
			return graphGetGlobalVariable.apply(this, arguments);
		};

		/**
		 * Overrides editor filename.
		 */
		this.editor.getOrCreateFilename = function()
		{
			var filename = ui.defaultFilename;
			var file = ui.getCurrentFile();
			
			if (file != null)
			{
				filename = (file.getTitle() != null) ? file.getTitle() : filename;
			}
			
			return filename;
		};

		// Disables print action for standalone apps on iOS
		// because there is no way to close the new window
		// LATER: Use iframe for print, disable preview
		var printAction = this.actions.get('print');
		printAction.setEnabled(!mxClient.IS_IOS || !navigator.standalone);
		printAction.visible = printAction.isEnabled();
		
		// Scales pages/graph to fit available size
		if (!this.editor.chromeless)
		{
			// Defines additional hotkeys
			this.keyHandler.bindAction(70, true, 'find'); // Ctrl+F
		    this.keyHandler.bindAction(67, true, 'copyStyle', true); // Ctrl+Shift+C
		    this.keyHandler.bindAction(86, true, 'pasteStyle', true); // Ctrl+Shift+V
		    this.keyHandler.bindAction(77, true, 'editGeometry', true); // Ctrl+Shift+M
		    this.keyHandler.bindAction(88, true, 'insertText', true); // Ctrl+Shift+X
		    this.keyHandler.bindAction(75, true, 'insertRectangle'); // Ctrl+K
		    this.keyHandler.bindAction(75, true, 'insertEllipse', true); // Ctrl+Shift+K
			
			// Handles copy paste of images from clipboard
			if (!mxClient.IS_IE)
			{
				graph.container.addEventListener('paste', mxUtils.bind(this, function(evt)
				{
					var graph = this.editor.graph;
					
					if (!mxEvent.isConsumed(evt))
					{
						try
						{
							var data = (evt.clipboardData || evt.originalEvent.clipboardData);
							var containsText = false;
							
							// Workaround for asynchronous paste event processing in textInput
							// is to ignore this event if it contains text/html/rtf (see below).
							// NOTE: Image is not pasted into textInput so can't listen there.
							for (var i = 0; i < data.types.length; i++)
							{	
								if (data.types[i].substring(0, 5) === 'text/')
								{
									containsText = true;
									break;
								}
							}
							
							if (!containsText)
							{
								var items = data.items;
								
								for (index in items)
								{
									var item = items[index];
									
									if (item.kind === 'file')
									{
										if (graph.isEditing())
										{
									    	this.importFiles([item.getAsFile()], 0, 0, this.maxImageSize, function(data, mimeType, x, y, w, h)
									    	{
									    		// Inserts image into current text box
									    		graph.insertImage(data, w, h);
									    	}, function()
									    	{
									    		// No post processing
									    	}, function(file)
									    	{
									    		// Handles only images
									    		return file.type.substring(0, 6) == 'image/';
									    	}, function(queue)
									    	{
									    		// Invokes elements of queue in order
									    		for (var i = 0; i < queue.length; i++)
									    		{
									    			queue[i]();
									    		}
									    	});
										}
										else
										{
											var pt = this.editor.graph.getInsertPoint();
											this.importFiles([item.getAsFile()], pt.x, pt.y, this.maxImageSize);
											mxEvent.consume(evt);
										}
										
										break;
									}
								}
							}
						}
						catch (e)
						{
							// ignore
						}
					}
				}), false);
			}

			// Focused but invisible textarea during control or meta key events
			var textInput = document.createElement('div');
			textInput.style.position = 'absolute';
			textInput.style.whiteSpace = 'nowrap';
			textInput.style.overflow = 'hidden';
			textInput.style.display = 'block';
			textInput.contentEditable = true;
			mxUtils.setOpacity(textInput, 0);
			textInput.style.width = '1px';
			textInput.style.height = '1px';
			textInput.innerHTML = '&nbsp;';

			var restoreFocus = false;
			
			// Disables built-in cut, copy and paste shortcuts
			this.keyHandler.bindControlKey(88, null);
			this.keyHandler.bindControlKey(67, null);
			this.keyHandler.bindControlKey(86, null);

			// Shows a textare when control/cmd is pressed to handle native clipboard actions
			mxEvent.addListener(document, 'keydown', mxUtils.bind(this, function(evt)
			{
				// No dialog visible
				var source = mxEvent.getSource(evt);
				
				if (graph.container != null && graph.isEnabled() && !graph.isMouseDown && !graph.isEditing() &&
					this.dialog == null && source.nodeName != 'INPUT' && source.nodeName != 'TEXTAREA')
				{
					if (evt.keyCode == 224 /* FF */ || (!mxClient.IS_MAC && evt.keyCode == 17 /* Control */) ||
						(mxClient.IS_MAC && evt.keyCode == 91 /* Meta */))
					{
						// Cannot use parentNode for check in IE
						if (!restoreFocus)
						{
							// Avoid autoscroll but allow handling of all pass-through ctrl shortcuts
							textInput.style.left = (graph.container.scrollLeft + 10) + 'px';
							textInput.style.top = (graph.container.scrollTop + 10) + 'px';
							
							graph.container.appendChild(textInput);
							restoreFocus = true;
							
							// Workaround for selected document content in quirks mode
							if (mxClient.IS_QUIRKS)
							{
								window.setTimeout(function()
								{
									textInput.focus();
									document.execCommand('selectAll', false, null);
								}, 0);
							}
							else
							{
								textInput.focus();
								document.execCommand('selectAll', false, null);
							}
						}
					}
				}
			}));

			// Clears input and restores focus and selection
			function clearInput()
			{
				window.setTimeout(function()
				{
					textInput.innerHTML = '&nbsp;';
					textInput.focus();
					document.execCommand('selectAll', false, null);
				}, 0);
			};
			
			mxEvent.addListener(document, 'keyup', mxUtils.bind(this, function(evt)
			{
				// Workaround for asynchronous event read invalid in IE quirks mode
				var keyCode = evt.keyCode;
				
				// Asynchronous workaround for scroll to origin after paste if the
				// Ctrl-key is not pressed for long enough in FF on Windows
				window.setTimeout(mxUtils.bind(this, function()
				{
					if (restoreFocus && (keyCode == 224 /* FF */ || keyCode == 17 /* Control */ ||
						keyCode == 91 /* Meta */))
					{
						restoreFocus = false;
						
						if (!graph.isEditing() && this.dialog == null && graph.container != null)
						{
							graph.container.focus();
						}
						
						textInput.parentNode.removeChild(textInput);
					}
				}), 0);
			}));

			mxEvent.addListener(textInput, 'copy', mxUtils.bind(this, function(evt)
			{
				if (graph.isEnabled())
				{
					mxClipboard.copy(graph);
					this.copyCells(textInput);
					clearInput();
				}
			}));
			
			mxEvent.addListener(textInput, 'cut', mxUtils.bind(this, function(evt)
			{
				if (graph.isEnabled())
				{
					this.copyCells(textInput, true);
					clearInput();
				}
			}));
			
			mxEvent.addListener(textInput, 'paste', mxUtils.bind(this, function(evt)
			{
				if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
				{
					textInput.innerHTML = '&nbsp;';
					textInput.focus();
					
					window.setTimeout(mxUtils.bind(this, function()
					{
						this.pasteCells(evt, textInput);
						textInput.innerHTML = '&nbsp;';
					}), 0);
				}
			}), true);
			
			// Needed for IE11
			var isSelectionAllowed2 = this.isSelectionAllowed;
			this.isSelectionAllowed = function(evt)
			{
				if (mxEvent.getSource(evt) == textInput)
				{
					return true;
				}

				return isSelectionAllowed2.apply(this, arguments);
			};
		};

		var y = Math.max(document.body.clientHeight || 0, document.documentElement.clientHeight || 0) / 2;
		var x = document.body.clientWidth / 2 - 2;
	
		// Holds the x-coordinate of the point
		this.spinner = this.createSpinner(x, y, 24);
		
		// Installs drag and drop handler for rich text editor
		if (Graph.fileSupport)
		{
			this.editor.graph.addListener(mxEvent.EDITING_STARTED, mxUtils.bind(this, function(evt)
			{
				// Setup the dnd listeners
				var graph = this.editor.graph;
				var textElt = graph.cellEditor.text2;
				var dropElt = null;
				
				if (textElt != null)
				{
					mxEvent.addListener(textElt, 'dragleave', function(evt)
					{
						if (dropElt != null)
					    {
					    	dropElt.parentNode.removeChild(dropElt);
					    	dropElt = null;
					    }
					    
						evt.stopPropagation();
						evt.preventDefault();
					});
					
					mxEvent.addListener(textElt, 'dragover', mxUtils.bind(this, function(evt)
					{
						// IE 10 does not implement pointer-events so it can't have a drop highlight
						if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
						{
							dropElt = this.highlightElement(textElt);
						}
						
						evt.stopPropagation();
						evt.preventDefault();
					}));
					
					mxEvent.addListener(textElt, 'drop', mxUtils.bind(this, function(evt)
					{
					    if (dropElt != null)
					    {
					    	dropElt.parentNode.removeChild(dropElt);
					    	dropElt = null;
					    }

					    if (evt.dataTransfer.files.length > 0)
					    {
					    	this.importFiles(evt.dataTransfer.files, 0, 0, this.maxImageSize, function(data, mimeType, x, y, w, h)
					    	{
					    		// Inserts image into current text box
					    		graph.insertImage(data, w, h);
					    	}, function()
					    	{
					    		// No post processing
					    	}, function(file)
					    	{
					    		// Handles only images
					    		return file.type.substring(0, 6) == 'image/';
					    	}, function(queue)
					    	{
					    		// Invokes elements of queue in order
					    		for (var i = 0; i < queue.length; i++)
					    		{
					    			queue[i]();
					    		}
					    	}, !mxEvent.isControlDown(evt));
			    		}
					    else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0)
					    {
					    	var uri = evt.dataTransfer.getData('text/uri-list');
					    	
					    	if ((/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(uri))
							{
				    			this.loadImage(decodeURIComponent(uri), mxUtils.bind(this, function(img)
				    			{
				    				var w = Math.max(1, img.width);
			    					var h = Math.max(1, img.height);
			    					var maxSize = this.maxImageSize;

				    				var s = Math.min(1, Math.min(maxSize / Math.max(1, w)), maxSize / Math.max(1, h));
				    				graph.insertImage(decodeURIComponent(uri), w * s, h * s);
				    			}));
							}
							else
							{
								document.execCommand('insertHTML', false, evt.dataTransfer.getData('text/plain'));
							}
					    }
					    else
					    {
					    	if (mxUtils.indexOf(evt.dataTransfer.types, 'text/html') >= 0)
						    {
					    		document.execCommand('insertHTML', false, evt.dataTransfer.getData('text/html'));
						    }
						    else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/plain') >= 0)
						    {
						    	document.execCommand('insertHTML', false, evt.dataTransfer.getData('text/plain'));
						    }
					    }
	
					    evt.stopPropagation();
					    evt.preventDefault();
					}));
				}
			}));
		}
		
		// Adds an element to edit the style in the footer in test mode
		if (urlParams['test'] == '1')
		{
			var footer = document.getElementById('geFooter');

			if (footer != null)
			{
				this.styleInput = document.createElement('input');
				this.styleInput.setAttribute('type', 'text');
				this.styleInput.style.position = 'absolute';
				this.styleInput.style.top = '14px';
				this.styleInput.style.left = '2px';
				// Workaround for ignore right CSS property in FF
				this.styleInput.style.width = '98%';
				this.styleInput.style.visibility = 'hidden';
				this.styleInput.style.opacity = '0.9';

				mxEvent.addListener(this.styleInput, 'change', mxUtils.bind(this, function()
				{
					this.editor.graph.getModel().setStyle(this.editor.graph.getSelectionCell(), this.styleInput.value);
				}));

				footer.appendChild(this.styleInput);

				this.editor.graph.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt)
				{
					if (this.editor.graph.getSelectionCount() > 0)
					{
						var cell = this.editor.graph.getSelectionCell();
						var style = this.editor.graph.getModel().getStyle(cell);

						this.styleInput.value = style || '';
						this.styleInput.style.visibility = 'visible';
					} else
					{
						this.styleInput.style.visibility = 'hidden';
					}
				}));
			}

			var isSelectionAllowed = this.isSelectionAllowed;
			this.isSelectionAllowed = function(evt)
			{
				if (mxEvent.getSource(evt) == this.styleInput)
				{
					return true;
				}

				return isSelectionAllowed.apply(this, arguments);
			};
		}

		// Removes info text in page
		var info = document.getElementById('geInfo');

		if (info != null)
		{
			info.parentNode.removeChild(info);
		}

		// Installs drag and drop handler for files
		// Enables dropping files
		if (Graph.fileSupport)
		{
			// Setup the dnd listeners
			var dropElt = null;

			mxEvent.addListener(graph.container, 'dragleave', function(evt)
			{
				if (graph.isEnabled())
				{
					if (dropElt != null)
				    {
				    	dropElt.parentNode.removeChild(dropElt);
				    	dropElt = null;
				    }
				    
					evt.stopPropagation();
					evt.preventDefault();
				}
			});
			
			mxEvent.addListener(graph.container, 'dragover', mxUtils.bind(this, function(evt)
			{
				// IE 10 does not implement pointer-events so it can't have a drop highlight
				if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
				{
					dropElt = this.highlightElement(graph.container);
				}
				
				if (this.sidebar != null)
				{
					this.sidebar.hideTooltip();
				}

				evt.stopPropagation();
				evt.preventDefault();
			}));
			
			mxEvent.addListener(graph.container, 'drop', mxUtils.bind(this, function(evt)
			{
			    if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }
			    
				if (graph.isEnabled())
				{
				    var pt = mxUtils.convertPoint(graph.container, mxEvent.getClientX(evt), mxEvent.getClientY(evt));
					var tr = graph.view.translate;
					var scale = graph.view.scale;
					var x = pt.x / scale - tr.x;
					var y = pt.y / scale - tr.y;
					
					if (mxEvent.isAltDown(evt))
					{
						x = 0;
						y = 0;
					}
					
				    if (evt.dataTransfer.files.length > 0)
				    {
						this.importFiles(evt.dataTransfer.files, x, y, this.maxImageSize, null, null, null, null,
							!mxEvent.isControlDown(evt), null, null, mxEvent.isShiftDown(evt));
		    		}
				    else
				    {
				    	var uri = (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0) ?
				    		evt.dataTransfer.getData('text/uri-list') : null;
				    	var data = this.extractGraphModelFromEvent(evt);
				    	
				    	if (data != null)
				    	{
				    		graph.setSelectionCells(this.importXml(data, x, y, true));
				    	}
				    	else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/html') >= 0)
					    {
				    		var html = evt.dataTransfer.getData('text/html');
				    		var div = document.createElement('div');
				    		div.innerHTML = html;
				    		
				    		// The default is based on the extension
				    		var asImage = null;
				    		
				    		// Extracts single image
				    		var imgs = div.getElementsByTagName('img');

				    		if (imgs != null && imgs.length == 1)
				    		{
				    			html = imgs[0].getAttribute('src');
				    			
				    			// Handles special case where the src attribute has no valid extension
				    			// in which case the text would be inserted as text with a link
				    			if (!(/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(html))
				    			{
				    				asImage = true;
				    			}
				    		}
				    		else
				    		{
				    			// Extracts single link
				    			var a = div.getElementsByTagName('a');

				    			if (a != null && a.length == 1)
				    			{
				    				html = a[0].getAttribute('href');
				    			}
				    		}
				    		
					    	graph.setSelectionCells(this.insertTextAt(html, x, y, true, asImage));
					    }
				    	else if (uri != null && (/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(uri))
						{
			    			this.loadImage(decodeURIComponent(uri), mxUtils.bind(this, function(img)
			    			{
			    				var w = Math.max(1, img.width);
		    					var h = Math.max(1, img.height);
		    					var maxSize = this.maxImageSize;

			    				var s = Math.min(1, Math.min(maxSize / Math.max(1, w)), maxSize / Math.max(1, h));

			    				graph.setSelectionCell(graph.insertVertex(null, null, '', x, y, w * s, h * s,
			    					'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
			    					'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + uri + ';'));
			    			}), mxUtils.bind(this, function(img)
			    			{
			    				graph.setSelectionCells(this.insertTextAt(uri, x, y, true));
			    			}));
						}
					    else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/plain') >= 0)
					    {
					    	graph.setSelectionCells(this.insertTextAt(evt.dataTransfer.getData('text/plain'), x, y, true));
					    }
					}
				}

			    evt.stopPropagation();
			    evt.preventDefault();
			}), false);
		}

		this.initPages();
		
		// Embedded mode
		if (urlParams['embed'] == '1')
		{
			this.initializeEmbedMode();
		}
	};

	/**
	 * Creates the format panel and adds overrides.
	 */
	EditorUi.prototype.copyCells = function(elt, removeCells)
	{
		var graph = this.editor.graph;
		
		if (!graph.isSelectionEmpty())
		{
			var cells = mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells()));
			
			// LATER: Add span with XML in data attribute
			// var span = document.createElement('span');
			// span.setAttribute('data-jgraph-type', 'application/vnd.jgraph.xml');
			// span.setAttribute('data-jgraph-content', mxUtils.getXml(graph.encodeCells(clones)));
			
			// Fixes cross-platform clipboard UTF8 issues by encoding as URI
			var xml = mxUtils.getXml(this.editor.graph.encodeCells(cells));
			mxUtils.setTextContent(elt, encodeURIComponent(xml));
			
			if (removeCells)
			{
				graph.removeCells(cells, false);
				graph.lastPasteXml = null;
			}
			else
			{
				graph.lastPasteXml = xml;
				graph.pasteCounter = 0;
			}

			elt.focus();
			document.execCommand('selectAll', false, null);
		}
		else
		{
			// Disables copy on focused element
			elt.innerHTML = '';
		}
	};
	
	/**
	 * Creates the format panel and adds overrides.
	 */
	EditorUi.prototype.pasteCells = function(evt, elt)
	{
		if (!mxEvent.isConsumed(evt))
		{
			var spans = elt.getElementsByTagName('span');
		
			if (spans != null && spans.length > 0 && spans[0].getAttribute('data-lucid-type') ===
				'application/vnd.lucid.chart.objects')
			{
				var content = spans[0].getAttribute('data-lucid-content');
				
				if (content != null && content.length > 0)
				{
					this.insertLucidChart(JSON.parse(content));
					mxEvent.consume(evt);
				}
			}
			else
			{
				var graph = this.editor.graph;
				var xml = mxUtils.trim((mxClient.IS_QUIRKS || document.documentMode == 8) ?
					mxUtils.getTextContent(elt) : elt.textContent);
				var compat = false;
	
				// Workaround for junk after XML in VM
				try
				{
					var idx = xml.lastIndexOf('%3E');
					
					if (idx >= 0 && idx < xml.length - 3)
					{
						xml = xml.substring(0, idx + 3);
					}
				}
				catch (e)
				{
					// ignore
				}
				
				// Checks for embedded XML content
				try
				{
					var spans = elt.getElementsByTagName('span');
					var tmp = (spans != null && spans.length > 0) ? 
						mxUtils.trim(decodeURIComponent(spans[0].textContent)) :
						decodeURIComponent(xml);
							
					if (this.isCompatibleString(tmp))
					{
						compat = true;
						xml = tmp;
					}
				}
				catch (e)
				{
					// ignore
				}
				
				if (graph.lastPasteXml == xml)
				{
					graph.pasteCounter++;
				}
				else
				{
					graph.lastPasteXml = xml;
					graph.pasteCounter = 0;
				}
				
				var dx = graph.pasteCounter * graph.gridSize;
				
				if (xml != null && xml.length > 0)
				{
					if (compat || this.isCompatibleString(xml))
					{
						graph.setSelectionCells(this.importXml(xml, dx, dx));
					}
					else
					{
						var pt = graph.getInsertPoint();
						
						if (graph.isMouseInsertPoint())
						{
							dx = 0;
							
							// No offset for insert at mouse position
							if (graph.lastPasteXml == xml && graph.pasteCounter > 0)
							{
								graph.pasteCounter--;
							}
						}
						
						graph.setSelectionCells(this.insertTextAt(xml, pt.x + dx, pt.y + dx, true));
					}
					
					if (!graph.isSelectionEmpty())
					{
						graph.scrollCellToVisible(graph.getSelectionCell());
					
						if (this.hoverIcons != null)
						{
							this.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
						}
						
						try
						{
							mxEvent.consume(evt);
						}
						catch (e)
						{
							// ignore event no longer exists in async handler in IE8-
						}
					}
				}
			}
		}
	};

	/**
	 * Adds a file drop handler for opening local files.
	 */
	EditorUi.prototype.addFileDropHandler = function(elts)
	{
		// Installs drag and drop handler for files
		if (Graph.fileSupport)
		{
			var dropElt = null;
			
			for (var i = 0; i < elts.length; i++)
			{
				// Setup the dnd listeners
				mxEvent.addListener(elts[i], 'dragleave', function(evt)
				{
					if (dropElt != null)
				    {
				    	dropElt.parentNode.removeChild(dropElt);
				    	dropElt = null;
				    }
					
					evt.stopPropagation();
					evt.preventDefault();
				});
		
				mxEvent.addListener(elts[i], 'dragover', mxUtils.bind(this, function(evt)
				{
					// IE 10 does not implement pointer-events so it can't have a drop highlight
					if (dropElt == null && (!mxClient.IS_IE || (document.documentMode > 10 && document.documentMode < 12)))
					{
						dropElt = this.highlightElement();
					}
					
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(elts[i], 'drop', mxUtils.bind(this, function(evt)
				{
					if (dropElt != null)
				    {
				    	dropElt.parentNode.removeChild(dropElt);
				    	dropElt = null;
				    }
					
					if (evt.dataTransfer.files.length > 0)
					{
						this.hideDialog();
						
						// Never open files in embed mode
						if (urlParams['embed'] == '1')
						{
							this.importFiles(evt.dataTransfer.files, 0, 0, this.maxImageSize, null, null,
								null, null, !mxEvent.isControlDown(evt) && !mxEvent.isShiftDown(evt));
						}
						else
						{
							this.openFiles(evt.dataTransfer.files);
						}
					}
					else
					{
						// Handles open special files via text drag and drop
						var data = this.extractGraphModelFromEvent(evt);
						
						// Tries additional and async parsing of text content such as HTML, Gliffy data
						if (data == null)
						{
							var provider = (evt.dataTransfer != null) ? evt.dataTransfer : evt.clipboardData;
						
							if (provider != null)
							{
								if (document.documentMode == 10 || document.documentMode == 11)
								{
									data = provider.getData('Text');
								}
								else
								{
							    	var data = null;
							    	
							    	if (mxUtils.indexOf(provider.types, 'text/uri-list') >= 0)
							    	{
							    		var data = evt.dataTransfer.getData('text/uri-list');
							    	}
							    	else
							    	{
							    		data = (mxUtils.indexOf(provider.types, 'text/html') >= 0) ? provider.getData('text/html') : null;
							    	}
									
									if (data != null && data.length > 0)
									{
										var div = document.createElement('div');
							    		div.innerHTML = data;
	
							    		// Extracts single image
							    		var imgs = div.getElementsByTagName('img');
							    		
							    		if (imgs.length > 0)
							    		{
							    			data = imgs[0].getAttribute('src');
							    		}
									}
									else if (mxUtils.indexOf(provider.types, 'text/plain') >= 0)
									{
										data = provider.getData('text/plain');
									}
								}
								
								if (data != null)
								{
									// Checks for embedded XML in PNG
									if (data.substring(0, 22) == 'data:image/png;base64,')
									{
										var xml = this.extractGraphModelFromPng(data);
										
										if (xml != null && xml.length > 0)
										{
											this.openLocalFile(xml);
										}
									}
									if (!this.isOffline() && this.isRemoteFileFormat(data))
									{
							    		new mxXmlRequest(OPEN_URL, 'format=xml&data=' + encodeURIComponent(data)).send(mxUtils.bind(this, function(req)
										{
							    			if (req.getStatus() == 200)
							    			{
							    				this.openLocalFile(req.getText());
							    			}
										}));
									}
									else if (/^https?:\/\//.test(data))
									{
										var url = this.getUrl(window.location.pathname + '?url=' + encodeURIComponent(data));
										
										if (this.getCurrentFile() == null)
										{
											window.location.href = url;
										}
										else
										{
											window.openWindow(url);
										}
									}
								}
							}
						}
						else
						{
							this.openLocalFile(data);
						}
					}
					
					evt.stopPropagation();
					evt.preventDefault();
				}));
			}
		}
	};
	
	/**
	 * Highlights the given element
	 */
	EditorUi.prototype.highlightElement = function(elt)
	{
		var x = 0;
		var y = 0;
		var w = 0;
		var h = 0;
		
		if (elt == null)
		{
			var b = document.body;
			var d = document.documentElement;
		
			w = (b.clientWidth || d.clientWidth) - 3;
			h = Math.max(b.clientHeight || 0, d.clientHeight) - 3;
		}
		else
		{
			x = elt.offsetTop;
			y = elt.offsetLeft;
			w = elt.clientWidth;
			h = elt.clientHeight;
		}
		
		var hl = document.createElement('div');
		hl.style.zIndex = mxPopupMenu.prototype.zIndex + 2;
		hl.style.border = '3px dotted rgb(254, 137, 12)';
		hl.style.pointerEvents = 'none';
		hl.style.position = 'absolute';
		hl.style.top = x + 'px';
		hl.style.left = y + 'px';
		hl.style.width = Math.max(0, w - 3) + 'px';
		hl.style.height = Math.max(0, h - 3) + 'px';
		
		if (elt != null && elt.parentNode == this.editor.graph.container)
		{
			this.editor.graph.container.appendChild(hl);
		}
		else
		{
			document.body.appendChild(hl);
		}
		
		return hl;
	};
	
	/**
	 * Highlights the given element
	 */
	EditorUi.prototype.stringToCells = function(xml)
	{
		var doc = mxUtils.parseXml(xml);
		var node = this.editor.extractGraphModel(doc.documentElement);
		var cells = [];
		
		if (node != null)
		{
			var codec = new mxCodec(node.ownerDocument);
			var model = new mxGraphModel();
			codec.decode(node, model);
			
			var parent = model.getChildAt(model.getRoot(), 0);
			
			for (var j = 0; j < model.getChildCount(parent); j++)
			{
				cells.push(model.getChildAt(parent, j));
			}
		}
		
		return cells;
	};
	
	/**
	 * Opens the given files in the editor.
	 */
	EditorUi.prototype.openFiles = function(files)
	{
		if (this.spinner.spin(document.body, mxResources.get('loading')))
		{
			for (var i = 0; i < files.length; i++)
			{
				(mxUtils.bind(this, function(file)
				{
					var reader = new FileReader();
				
					reader.onload = mxUtils.bind(this, function(e)
					{
						var data = e.target.result;
						var name = file.name;
						
						if (name != null && name.length > 0)
						{
							if (/(\.png)$/i.test(name))
							{
								name = name.substring(0, name.length - 4) + '.xml';
							}
		
							if (Graph.fileSupport && !this.isOffline() && new XMLHttpRequest().upload &&
								this.isRemoteFileFormat(data, name))
							{
								var dot = name.lastIndexOf('.');
								
								if (dot >= 0)
								{
									name = name.substring(0, name.lastIndexOf('.')) + '.xml';
								}
								else
								{
									name = name + '.xml';
								}
								
								this.parseFile(file, mxUtils.bind(this, function(xhr)
								{
									if (xhr.readyState == 4)
									{
										this.spinner.stop();
										
										if (xhr.status == 200)
										{
											this.openLocalFile(xhr.responseText, name);
										}
										else
										{
											this.handleError({message: mxResources.get((xhr.status == 413) ?
				            						'drawingTooLarge' : 'invalidOrMissingFile')},
				            						mxResources.get('errorLoadingFile'));
										}
									}
								}));
							}
							else if (e.target.result.substring(0, 10) == '<mxlibrary')
			    			{
								this.spinner.stop();
								
			    				try
				    			{
				    				this.loadLibrary(new LocalLibrary(this, e.target.result, file.name));
				    			}
				    			catch (e)
				    			{
				    				this.handleError(e, mxResources.get('errorLoadingFile'));
				    			}
			    			}
							else
							{
								if (file.type.substring(0, 9) == 'image/png')
								{
									data = this.extractGraphModelFromPng(data);
								}
								
								this.spinner.stop();
								this.openLocalFile(data, name);
							}
						}
					});
					
					reader.onerror = mxUtils.bind(this, function(e)
					{
						this.spinner.stop();
						this.handleError(e);
						window.openFile = null;
					});
					
					if (file.type.substring(0, 5) === 'image' && file.type.substring(0, 9) !== 'image/svg')
					{
						reader.readAsDataURL(file);
					}
					else
					{
						reader.readAsText(file);
					}
				}))(files[i]);
			}
		}
	};

	/**
	 * Shows the layers dialog if the graph has more than one layer.
	 */
	EditorUi.prototype.openLocalFile = function(data, name)
	{
		var fn = mxUtils.bind(this, function()
		{
			window.openFile = null;
			
			if (name == null && this.getCurrentFile() != null && this.isDiagramEmpty())
			{
				var doc = mxUtils.parseXml(data);
				
				if (doc != null)
				{
					this.editor.setGraphXml(doc.documentElement);
					this.editor.graph.selectAll();
				}
			}
			else
			{
				this.fileLoaded(new LocalFile(this, data, name || this.defaultFilename));
			}
		});
		
		if (data != null && data.length > 0)
		{
			if (this.getCurrentFile() != null && !this.isDiagramEmpty())
			{
				window.openFile = new OpenFile(function()
				{
					window.openFile = null;
				});
				
				window.openFile.setData(data, name);
				window.openWindow(this.getUrl(), null, fn);
			}
			else
			{
				fn();
			}
		}
	};
	
	/**
	 * Returns a list of all shapes used in the current file.
	 */
	EditorUi.prototype.getBasenames = function()
	{
		var basenames = {};

		if (this.pages != null)
		{
			for (var i = 0; i < this.pages.length; i++)
			{
				this.updatePageRoot(this.pages[i]);
				this.addBasenamesForCell(this.pages[i].root, basenames);
			}
		}
		else
		{
			this.addBasenamesForCell(this.editor.graph.model.getRoot(), basenames);
		}
		
		var result = [];
		
		for (var key in basenames)
		{
			result.push(key);
		}
		
		return result;
	};
		
	/**
	 * Returns a list of all shapes used in the current file.
	 */
	EditorUi.prototype.addBasenamesForCell = function(cell, basenames)
	{
		function addName(name)
		{
			if (name != null)
			{
				// LATER: Check if this case exists
				var dot = name.lastIndexOf('.');
				
				if (dot > 0)
				{
					name = name.substring(dot + 1, name.length);
				}
				
				if (basenames[name] == null)
				{
					basenames[name] = true;
				}
			}
		};
		
		var graph = this.editor.graph;
		var style = graph.getCellStyle(cell);
		var shape = style[mxConstants.STYLE_SHAPE];
		addName(mxStencilRegistry.getBasenameForStencil(shape));
		
		// Adds package names for markers in edges
		if (graph.model.isEdge(cell))
		{
			addName(mxMarker.getPackageForType(style[mxConstants.STYLE_STARTARROW]));
			addName(mxMarker.getPackageForType(style[mxConstants.STYLE_ENDARROW]));
		}

		var childCount = graph.model.getChildCount(cell);
		
		for (var i = 0; i < childCount; i++)
		{
			this.addBasenamesForCell(graph.model.getChildAt(cell, i), basenames);
		}
	};
	
	/**
	 * Shows the layers dialog if the graph has more than one layer.
	 */
	EditorUi.prototype.initializeEmbedMode = function()
	{
		this.diagramContainer.style.visibility = 'hidden';
		this.formatContainer.style.visibility = 'hidden';
		this.editor.graph.setEnabled(false);
		var parent = window.opener || window.parent;

		if (parent != window)
		{
			if (urlParams['spin'] != '1' || this.spinner.spin(document.body, mxResources.get('loading')))
			{
				this.installMessageHandler(mxUtils.bind(this, function(xml, evt, modified)
				{
					this.spinner.stop();
					this.addEmbedButtons();
					this.diagramContainer.style.visibility = '';
					this.formatContainer.style.visibility = '';
					this.editor.graph.setEnabled(true);
					
					if (xml != null && xml.length > 0)
					{
						this.setFileData(xml);
						this.showLayersDialog();
					}
					else
					{
						this.editor.graph.model.clear();
						this.editor.fireEvent(new mxEventObject('resetGraphView'));
					}
	
					this.editor.undoManager.clear();
					this.editor.modified = (modified != null) ? modified : false;
					this.updateUi();
					
					// Workaround for no initial focus in FF
					// (does not work in Conf Cloud with FF)
					if (window.self !== window.top)
					{
						window.focus();
					}
					
					if (this.format != null)
					{
						this.format.refresh();
					}
				}));
			}
		}
	};
	
	/**
	 * Shows the layers dialog if the graph has more than one layer.
	 */
	EditorUi.prototype.showLayersDialog = function()
	{
		if (this.editor.graph.getModel().getChildCount(this.editor.graph.getModel().getRoot()) > 1)
		{
			if (this.actions.layersWindow == null)
			{
				this.actions.get('layers').funct();
			}
			else
			{
				this.actions.layersWindow.window.setVisible(true);
			}
		}
	};
	
	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.createLoadMessage = function(eventName)
	{
		var graph = this.editor.graph;
		
		return {event: eventName, pageVisible: graph.pageVisible, translate: graph.view.translate,
			scale: graph.view.scale, page: graph.view.getBackgroundPageBounds(), bounds: graph.getGraphBounds()};
	};
	
	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.installMessageHandler = function(fn)
	{
		var changeListener = null;
		var ignoreChange = false;
		var autosave = false;
		var lastData = null;
		
		var updateStatus = mxUtils.bind(this, function(sender, eventObject)
		{
			if (!this.editor.modified || urlParams['modified'] == '0')
			{
				this.editor.setStatus('');
			}
			else if (urlParams['modified'] != null)
			{
				this.editor.setStatus(mxResources.get(urlParams['modified']));
			}
		});
		
		this.editor.graph.model.addListener(mxEvent.CHANGE, updateStatus);
		
		// Receives XML message from opener and puts it into the graph
		mxEvent.addListener(window, 'message', mxUtils.bind(this, function(evt)
		{
			var data = evt.data;
			
			function extractDiagramXml(data)
			{
				if (data != null && typeof data.charAt === 'function' && data.charAt(0) != '<')
				{
					try
					{	
						if (data.substring(0, 26) == 'data:image/svg+xml;base64,')
						{
							data = atob(data.substring(26));
						}
						else if (data.substring(0, 24) == 'data:image/svg+xml;utf8,')
						{
							data = data.substring(24);
						}
						
						if (data != null)
						{
							if (data.charAt(0) == '%')
							{
								data = decodeURIComponent(data);
							}
							else if (data.charAt(0) != '<')
							{
								data = this.editor.graph.decompress(data);
							}
						}
					}
					catch (e)
					{
						// ignore compression errors and use empty data
					}
				}
				
				return data;
			};
			
			if (urlParams['proto'] == 'json')
			{
				try
				{
					data = JSON.parse(data);
				}
				catch (e)
				{
					data = null;
				}
				
				if (data == null)
				{
					// Ignore
					return;
				}
				else if (data.action == 'dialog')
				{
					this.showError((data.titleKey != null) ? mxResources.get(data.titleKey) : data.title,
						(data.messageKey != null) ? mxResources.get(data.messageKey) : data.message,
						(data.buttonKey != null) ? mxResources.get(data.buttonKey) : data.button);
					
					if (data.modified != null)
					{
						this.editor.modified = data.modified;
					}
					
					return;
				}
				else if (data.action == 'prompt')
				{
					var dlg = new FilenameDialog(this, data.defaultValue || '',
						(data.okKey != null) ? mxResources.get(data.okKey) : null, function(value)
					{
						if (value != null)
						{
							parent.postMessage(JSON.stringify({event: 'prompt', value: value, message: data}), '*');
						}
					}, (data.titleKey != null) ? mxResources.get(data.titleKey) : data.title);
					this.showDialog(dlg.container, 300, 80, true, false);
					dlg.init();
					
					return;
				}
				else if (data.action == 'draft')
				{
					var tmp = null;
					
					if (data.xml.substring(0, 22) == 'data:image/png;base64,')
					{
						tmp = this.extractGraphModelFromPng(data.xml);
					}
					else
					{
						tmp = extractDiagramXml(data.xml);
					}
					
					var dlg = new DraftDialog(this, mxResources.get('draftFound', [data.name || this.defaultFilename]),
						tmp, mxUtils.bind(this, function()
					{
						this.hideDialog();
						parent.postMessage(JSON.stringify({event: 'draft', result: 'edit', message: data}), '*');
					}), mxUtils.bind(this, function()
					{
						this.hideDialog();
						parent.postMessage(JSON.stringify({event: 'draft', result: 'discard', message: data}), '*');
					}), (data.editKey) ? mxResources.get(data.editKey) : null,
						(data.discardKey) ? mxResources.get(data.discardKey) : null);
					this.showDialog(dlg.container, 640, 480, true, false, mxUtils.bind(this, function(cancel)
					{
						if (cancel)
						{
							this.actions.get('exit').funct();
						}
					}));
					
					try
					{
						dlg.init();
					}
					catch (e)
					{
						parent.postMessage(JSON.stringify({event: 'draft', error: e.toString(), message: data}), '*');
					}
					
					return;
				}
				else if (data.action == 'template')
				{
					var dlg = new NewDialog(this, false, data.callback != null, mxUtils.bind(this, function(xml, name)
					{
						xml = xml || this.emptyDiagramXml;
						
						// LATER: Add autosave option in template message
						if (data.callback != null)
						{
							parent.postMessage(JSON.stringify({event: 'template', xml: xml,
								blank: xml == this.emptyDiagramXml, name: name}), '*');
						}
						else
						{
							fn(xml, evt, xml != this.emptyDiagramXml);
							
							// Workaround for status updated before modified applied
							if (!this.editor.modified)
							{
								this.editor.setStatus('');
							}
						}
					}));

					this.showDialog(dlg.container, 620, 440, true, false, mxUtils.bind(this, function(cancel)
					{
						if (cancel)
						{
							this.actions.get('exit').funct();
						}
					}));
					dlg.init();
					
					return;
				}
				else if (data.action == 'status')
				{
					if (data.messageKey != null)
					{
						this.editor.setStatus(mxResources.get(data.messageKey));
					}
					else if (data.message != null)
					{
						this.editor.setStatus(data.message);
					}
					
					if (data.modified != null)
					{
						this.editor.modified = data.modified;
					}
					
					return;
				}
				else if (data.action == 'spinner')
				{
					var msg = (data.messageKey != null) ? mxResources.get(data.messageKey) : data.message;
					
					if (data.show != null && !data.show)
					{
						this.spinner.stop();
					}
					else
					{
						this.spinner.spin(document.body, msg)
					}

					return;
				}
				else if (data.action == 'export')
				{
					if (data.format == 'png' || data.format == 'xmlpng')
					{
						if ((data.spin == null && data.spinKey == null) || this.spinner.spin(document.body,
							(data.spinKey != null) ? mxResources.get(data.spinKey) : data.spin))
						{
							var xml = (data.xml != null) ? data.xml : this.getFileData(true);
							this.editor.graph.setEnabled(false);
							
							var postDataBack = mxUtils.bind(this, function(bin)
							{
								var msg = this.createLoadMessage('export');
								msg.format = data.format;
								msg.xml = encodeURIComponent(xml);
								msg.data = 'data:image/png;base64,' + bin;
								parent.postMessage(JSON.stringify(msg), '*');
								this.editor.graph.setEnabled(true);
							});
							
							if (this.isExportToCanvas())
							{
								var graph = this.editor.graph;
								
								// Exports PNG for first page while other page is visible by creating a graph
								// LATER: Add caching for the graph or SVG while not on first page
								if (this.pages != null && this.currentPage != this.pages[0])
								{
									graph = this.createTemporaryGraph(graph.getStylesheet());
									var graphGetGlobalVariable = graph.getGlobalVariable;
									var page = this.pages[0];
							
									graph.getGlobalVariable = function(name)
									{
										if (name == 'page')
										{
											return page.getName();
										}
										else if (name == 'pagenumber')
										{
											return 1;
										}
										
										return graphGetGlobalVariable.apply(this, arguments);
									};
							
									document.body.appendChild(graph.container);
									graph.model.setRoot(page.root);
								}
						
								this.exportToCanvas(mxUtils.bind(this, function(canvas)
							   	{
							   	    var uri = canvas.toDataURL('image/png');
							   	    
							   	    if (data.format == 'xmlpng')
							   	    {
							   	    	uri = this.writeGraphModelToPng(uri, 'zTXt', 'mxGraphModel',
							   	    		atob(this.editor.graph.compress(xml)));	
							   	    }
							   	    	
									// Removes temporary graph from DOM
					   	   	    	if (graph != this.editor.graph)
									{
										graph.container.parentNode.removeChild(graph.container);
									}
					   	   	    	
							   	    postDataBack(uri.substring(uri.lastIndexOf(',') + 1));
							   	}), null, null, null, null, null, null, null, null, null, null, graph);
							}
							else
							{
								// Data from server is base64 encoded to avoid binary XHR
								// Double encoding for XML arg is needed for UTF8 encoding
						       	var req = new mxXmlRequest(EXPORT_URL, 'format=png&embedXml=' +
						       		((data.format == 'xmlpng') ? '1' : '0') + '&base64=1&xml=' +
						       		encodeURIComponent(encodeURIComponent(xml)));
						       	
								req.send(mxUtils.bind(this, function(req)
								{
									this.editor.graph.setEnabled(true);
									this.spinner.stop();
									
									if (req.getStatus() == 200)
									{
										postDataBack(req.getText());
									}
								}), mxUtils.bind(this, function()
								{
									this.spinner.stop();
								}));
							}
						}
					}
					else
					{
						// SVG is generated from graph so parse optional XML
						if (data.xml != null && data.xml.length > 0)
						{
							this.setFileData(data.xml);
						}
						
						var msg = this.createLoadMessage('export');
						
						// Forces new HTML format if pages exists
						if (data.format == 'html2' || (data.format == 'html' && (urlParams['pages'] != '0' ||
							(this.pages != null && this.pages.length > 1))))
						{
							var node = this.getXmlFileData();
							msg.xml = mxUtils.getXml(node);
							msg.data = this.getFileData(null, null, true, null, null, null, node);
							msg.format = data.format;
						}
						else if (data.format == 'html')
						{
							var xml = this.editor.getGraphXml();
							msg.data = this.getHtml(xml, this.editor.graph);
							msg.xml = mxUtils.getXml(xml);
							msg.format = data.format;
						}
						else
						{
							// Creates a preview with no alt text for unsupported browsers
				        	mxSvgCanvas2D.prototype.foAltText = null;
				        	
				        	var bg = this.editor.graph.background;
				        	
				        	if (bg == mxConstants.NONE)
				        	{
				        		bg = null;
				        	}
				        	
							msg.xml = this.getFileData(true);
							msg.format = 'svg';
				        	
				        	if (data.embedImages || data.embedImages == null)
				        	{
								if ((data.spin == null && data.spinKey == null) || this.spinner.spin(document.body,
									(data.spinKey != null) ? mxResources.get(data.spinKey) : data.spin))
								{
									this.editor.graph.setEnabled(false);
									
					        		if (data.format == 'xmlsvg')
					        		{
						        		this.getEmbeddedSvg(msg.xml, this.editor.graph, null, true, mxUtils.bind(this, function(svg)
					        			{
											this.editor.graph.setEnabled(true);
											this.spinner.stop();
											
											msg.data = this.createSvgDataUri(svg);
											parent.postMessage(JSON.stringify(msg), '*');
					        			}));
					        		}
					        		else
					        		{
					        			this.convertImages(this.editor.graph.getSvg(bg), mxUtils.bind(this, function(svgRoot)
					        			{
											this.editor.graph.setEnabled(true);
											this.spinner.stop();
											
											msg.data = this.createSvgDataUri(mxUtils.getXml(svgRoot));
											parent.postMessage(JSON.stringify(msg), '*');
					        			}));
					        		}
								}
				        		
				        		return;
				        	}
				        	else
				        	{
				        		var svg = (data.format == 'xmlsvg') ? this.getEmbeddedSvg(this.getFileData(true),
				        			this.editor.graph, null, true) : mxUtils.getXml(this.editor.graph.getSvg(bg));
								msg.data = this.createSvgDataUri(svg);
				        	}
						}

						parent.postMessage(JSON.stringify(msg), '*');
					}
					
					return;
				}
				else if (data.action == 'load')
				{
					autosave = data.autosave == 1;
					this.hideDialog();
					
					if (data.modified != null && urlParams['modified'] == null)
					{
						urlParams['modified'] = data.modified;
					}
					
					if (data.saveAndExit != null && urlParams['saveAndExit'] == null)
					{
						urlParams['saveAndExit'] = data.saveAndExit;
					}
					
					if (data.title != null && this.buttonContainer != null)
					{
						var tmp = document.createElement('span');
						mxUtils.write(tmp, data.title);
						
						if (uiTheme == 'atlas')
						{
							this.buttonContainer.style.paddingRight = '12px';
							this.buttonContainer.style.paddingTop = '12px';
						}
						else
						{
							this.buttonContainer.style.paddingRight = '38px';
							this.buttonContainer.style.paddingTop = '6px';
						}
						
						this.buttonContainer.appendChild(tmp);
					}
					
					if (data.xmlpng != null)
					{
						data = this.extractGraphModelFromPng(data.xmlpng);
					}
					else if (data.xml != null && data.xml.substring(0, 22) == 'data:image/png;base64,')
					{
						data = this.extractGraphModelFromPng(data.xml);
					}
					else
					{
						data = data.xml;
					}
				}
				else
				{
					// Unknown message must stop execution
					parent.postMessage(JSON.stringify({error: 'unknownMessage', data: JSON.stringify(data)}), '*');
					
					return;
				}
			}
			
			data = extractDiagramXml(data);
			
			ignoreChange = true;
			try
			{
				fn(data, evt);
			}
			catch (e)
			{
				this.handleError(e);
			}
			ignoreChange = false;
			
			if (urlParams['modified'] != null)
			{
				this.editor.setStatus('');
			}
			
			var getData = mxUtils.bind(this, function()
			{
				return (urlParams['pages'] != '0' || (this.pages != null && this.pages.length > 1)) ?
					this.getFileData(true): mxUtils.getXml(this.editor.getGraphXml());
			});;
			
			lastData = getData();

			if (autosave && changeListener == null)
			{
				changeListener = mxUtils.bind(this, function(sender, eventObject)
				{
					var data = getData();

					if (data != lastData && !ignoreChange)
					{
						var msg = this.createLoadMessage('autosave');
						msg.xml = data;
						data = JSON.stringify(msg);
						
						var parent = window.opener || window.parent;
						parent.postMessage(data, '*');
					}
					
					lastData = data;
				});
				
				this.editor.graph.model.addListener(mxEvent.CHANGE, changeListener);

				// Some options trigger autosave
				this.editor.graph.addListener('gridSizeChanged', changeListener);
				this.editor.graph.addListener('shadowVisibleChanged', changeListener);
				this.addListener('pageFormatChanged', changeListener);
				this.addListener('pageScaleChanged', changeListener);
				this.addListener('backgroundColorChanged', changeListener);
				this.addListener('backgroundImageChanged', changeListener);
				this.addListener('foldingEnabledChanged', changeListener);
				this.addListener('mathEnabledChanged', changeListener);
				this.addListener('gridEnabledChanged', changeListener);
				this.addListener('guidesEnabledChanged', changeListener);
				this.addListener('pageViewChanged', changeListener);
			}
			
			// Sends the bounds of the graph to the host after parsing
			if (urlParams['returnbounds'] == '1' || urlParams['proto'] == 'json')
			{
				parent.postMessage(JSON.stringify(this.createLoadMessage('load')), '*');
			}
		}));
		
		// Requests data from the sender. This is a workaround for not allowing
		// the opener to listen for the onload event if not in the same origin.
		var parent = window.opener || window.parent;
		var msg = (urlParams['proto'] == 'json') ? JSON.stringify({event: 'init'}) : (urlParams['ready'] || 'ready');
		parent.postMessage(msg, '*');
	};
	
	/**
	 * Adds the buttons for embedded mode.
	 */
	EditorUi.prototype.addEmbedButtons = function()
	{
		if (this.menubar != null)
		{
			var div = document.createElement('div');
			div.style.display = 'inline-block';
			div.style.position = 'absolute';
			div.style.paddingTop = (uiTheme == 'atlas') ? '2px' : '3px';
			div.style.paddingLeft = '8px';
			div.style.paddingBottom = '2px';

			var button = document.createElement('button');
			mxUtils.write(button, mxResources.get('save'));
			button.setAttribute('title', mxResources.get('save') + ' (Ctrl+S)');
			button.className = 'geBigButton';
			button.style.fontSize = '12px';
			button.style.padding = '4px 6px 4px 6px';
			button.style.borderRadius = '3px';
			
			mxEvent.addListener(button, 'click', mxUtils.bind(this, function()
			{
				this.actions.get('save').funct();
			}));
			
			div.appendChild(button);
			
			if (urlParams['saveAndExit'] == '1')
			{
				button = document.createElement('a');
				mxUtils.write(button, mxResources.get('saveAndExit'));
				button.setAttribute('title', mxResources.get('saveAndExit'));
				button.style.fontSize = '12px';
				button.style.marginLeft = '6px';
				button.style.padding = '4px';
				button.style.cursor = 'pointer';
				
				mxEvent.addListener(button, 'click', mxUtils.bind(this, function()
				{
					this.actions.get('saveAndExit').funct();
				}));
				
				div.appendChild(button);
			}

			button = document.createElement('a');
			mxUtils.write(button, mxResources.get('exit'));
			button.setAttribute('title', mxResources.get('exit'));
			button.style.fontSize = '12px';
			button.style.marginLeft = '6px';
			button.style.marginRight = '20px';
			button.style.padding = '4px';
			button.style.cursor = 'pointer';
			
			mxEvent.addListener(button, 'click', mxUtils.bind(this, function()
			{
				this.actions.get('exit').funct();
			}));
			
			div.appendChild(button);
			
			this.toolbar.container.appendChild(div);
			this.toolbar.staticElements.push(div);
			div.style.right = (uiTheme != 'atlas') ? '52px' : '42px';
			
			// Moves status bar to toolbar with Atlas theme in embed mode
			if (uiTheme == 'atlas')
			{
				this.statusContainer.style.color = '#707070';
				this.statusContainer.style.paddingLeft = '26px';
				this.toolbar.staticElements.push(this.statusContainer);
				this.toolbar.container.appendChild(this.statusContainer);
			}
		}
	};

	/**
	 * Translates this point by the given vector.
	 * 
	 * @param {number} dx X-coordinate of the translation.
	 * @param {number} dy Y-coordinate of the translation.
	 */
	EditorUi.prototype.getSearch = function(exclude)
	{
		var result = '';
		
		if (urlParams['offline'] != '1' && urlParams['demo'] != '1' && exclude != null && window.location.search.length > 0)
		{
			var amp = '?';
			
			for (var key in urlParams)
			{
				if (mxUtils.indexOf(exclude, key) < 0 && urlParams[key] != null)
				{
					result += amp + key + '=' + urlParams[key];
					amp = '&';
				}
			}
		}
		else
		{
			result = window.location.search;
		}
		
		return result;
	};

	/**
	 * Returns the URL for a copy of this editor with no state.
	 */
	EditorUi.prototype.getUrl = function(pathname)
	{
		var href = (pathname != null) ? pathname : window.location.pathname;
		var parms = (href.indexOf('?') > 0) ? 1 : 0;

		if (urlParams['offline'] == '1')
		{
			href += window.location.search;
		}
		else
		{
			var ignored = ['tmp', 'libs', 'clibs', 'state', 'fileId', 'code', 'share', 'notitle',
			               'url', 'embed', 'client', 'create', 'title', 'splash'];
			
			// Removes template URL parameter for new blank diagram
			for (var key in urlParams)
			{
				if (mxUtils.indexOf(ignored, key) < 0)
				{
					if (parms == 0)
					{
						href += '?';
					}
					else
					{
						href += '&';
					}
					
					if (urlParams[key] != null)
					{
						href += key + '=' + urlParams[key];
						parms++;
					}
				}
			}
		}

		return href;
	};

	/**
	 * Overrides createOutline
	 */
	var editorUiCreateOutline = EditorUi.prototype.createOutline;

	EditorUi.prototype.createOutline = function(wnd)
	{
		var outline = editorUiCreateOutline.apply(this, arguments);
		var graph = this.editor.graph;

		var outlineGetSourceGraphBounds = outline.getSourceGraphBounds;
		outline.getSourceGraphBounds = function()
		{
			if (mxUtils.hasScrollbars(graph.container) && graph.pageVisible && this.source.minimumGraphSize != null)
			{
				var pb = this.source.getPagePadding();
				var s = this.source.view.scale;
				
				var result = new mxRectangle(0, 0, Math.ceil(this.source.minimumGraphSize.width - 2 * pb.x / s),
						Math.ceil(this.source.minimumGraphSize.height - 2 * pb.y / s));
				
				return result;
			}
			
			return outlineGetSourceGraphBounds.apply(this, arguments);
		};
		
		var outlineGetSourceContainerSize = outline.getSourceContainerSize;
		outline.getSourceContainerSize = function()
		{
			if (mxUtils.hasScrollbars(graph.container) && this.source.minimumGraphSize != null)
			{
				var pad = this.source.getPagePadding();
				var s = this.source.view.scale;
				
				return new mxRectangle(0, 0, Math.ceil(this.source.minimumGraphSize.width * s - 2 * pad.x),
						Math.ceil(this.source.minimumGraphSize.height * s - 2 * pad.y));
			}

			return outlineGetSourceContainerSize.apply(this, arguments);
		};

		outline.getOutlineOffset = function(scale)
		{
			if (mxUtils.hasScrollbars(graph.container) && this.source.minimumGraphSize != null)
			{
				var pb = this.source.getPagePadding();

				var dx = Math.max(0, (outline.outline.container.clientWidth / scale - (this.source.minimumGraphSize.width - 2 * pb.x)) / 2);
				var dy = Math.max(0, (outline.outline.container.clientHeight / scale - (this.source.minimumGraphSize.height - 2 * pb.y)) / 2);

				// Why is vertical offset negative relative to dy
				return new mxPoint(Math.round(dx - pb.x), Math.round(dy - pb.y - 5 / scale));
			}
			
			return new mxPoint(8 / scale, 8 / scale);
		};
		
		var outlineInit = outline.init;
		outline.init = function()
		{
			outlineInit.apply(this, arguments);
			
			// Problem: Need to override a function in the view but the view is created
			// with the graph so a refresh of the page is needed to see this change.
			outline.outline.view.getBackgroundPageBounds = function()
			{
				var layout = graph.getPageLayout();
				var page = graph.getPageSize();
				
				return new mxRectangle(this.scale * (this.translate.x + layout.x * page.width),
						this.scale * (this.translate.y + layout.y * page.height),
						this.scale * layout.width * page.width,
						this.scale * layout.height * page.height);
			};
			
			outline.outline.view.validateBackgroundPage();
		};
		
		this.editor.addListener('pageSelected', function(sender, evt)
		{
			var change = evt.getProperty('change');
			
			var graph = outline.source;
			var g = outline.outline;
			
			g.pageScale = graph.pageScale;
			g.pageFormat = graph.pageFormat;
			g.background = graph.background;
			g.pageVisible = graph.pageVisible;
			g.background = graph.background;
			
			var current = mxUtils.getCurrentStyle(graph.container);
			g.container.style.backgroundColor = current.backgroundColor;
			
			if (graph.view.backgroundPageShape != null && g.view.backgroundPageShape != null)
			{
				g.view.backgroundPageShape.fill = graph.view.backgroundPageShape.fill;
			}

			outline.outline.view.clear(change.previousPage.root, true);
			outline.outline.view.validate();
		});

		return outline;
	};
	
	/**
	 * Updates action and menu states depending on the file.
	 */
	EditorUi.prototype.updateUi = function()
	{
		this.updateButtonContainer();
		this.updateActionStates();
		
		// Action states that only need update for new files
		var file = this.getCurrentFile();
		var active = file != null || urlParams['embed'] == '1';
		this.menus.get('viewPanels').setEnabled(active);
		this.menus.get('viewZoom').setEnabled(active);
		
		var restricted = urlParams['embed'] != '1' && (file == null || file.isRestricted());
		this.actions.get('makeCopy').setEnabled(!restricted);
		this.actions.get('print').setEnabled(!restricted);
		this.menus.get('exportAs').setEnabled(!restricted);
		this.menus.get('embed').setEnabled(!restricted);
		
		// Disables actions in the toolbar
		var editable = (urlParams['embed'] == '1') || (file != null && file.isEditable());
		this.actions.get('image').setEnabled(active);
		this.actions.get('zoomIn').setEnabled(active);
		this.actions.get('zoomOut').setEnabled(active);
		this.actions.get('resetView').setEnabled(active);
	
		// Disables menus
		this.menus.get('edit').setEnabled(active);
		this.menus.get('view').setEnabled(active);
		this.menus.get('importFrom').setEnabled(editable);
		this.menus.get('arrange').setEnabled(editable);
		
		// Disables connection drop downs in toolbar
		if (this.toolbar != null)
		{
			if (this.toolbar.edgeShapeMenu != null)
			{
				this.toolbar.edgeShapeMenu.setEnabled(editable);
			}
			
			if (this.toolbar.edgeStyleMenu != null)
			{
				this.toolbar.edgeStyleMenu.setEnabled(editable);
			}
		}
		
		if (this.isOfflineApp())
		{
			// In FF, IE and Safari (desktop) the cache status never changes
			if ((mxClient.IS_GC || (mxClient.IS_IOS && mxClient.IS_SF)) && applicationCache != null)
			{
				var appCache = applicationCache;
		
				if (this.offlineStatus == null)
				{
					this.offlineStatus = document.createElement('div');
					this.offlineStatus.className = 'geItem';
					this.offlineStatus.style.position = 'absolute';
					this.offlineStatus.style.fontSize = '8pt';
					this.offlineStatus.style.top = '2px';
					this.offlineStatus.style.right = '12px';
					this.offlineStatus.style.color = '#666';
					this.offlineStatus.style.margin = '4px';
					this.offlineStatus.style.padding = '2px';
					this.offlineStatus.style.verticalAlign = 'middle';
					this.offlineStatus.innerHTML = '';
					
					this.menubarContainer.appendChild(this.offlineStatus);
		
					// Events are not working, use polling instead (10 secs interval)
					var thread = window.setTimeout(mxUtils.bind(this, function()
					{
						if (appCache.status == appCache.IDLE)
						{
							this.offlineStatus.innerHTML = '[' + '<img title="Cached" border="0" src="' + IMAGE_PATH + '/checkmark.gif"/>]';
							window.clearTimeout(thread);
						}
					}), 5000);
				}
			}
		}
		else
		{
			this.updateUserElement();
		}
	};
	
	/**
	 * Hook for subclassers
	 */
	EditorUi.prototype.updateButtonContainer = function()
	{
		// do nothing
	};
		
	/**
	 * Hook for subclassers
	 */
	EditorUi.prototype.updateUserElement = function()
	{
		// do nothing
	};
	
	/**
	 * Updates action states depending on the selection.
	 */
	var editorUiUpdateActionStates = EditorUi.prototype.updateActionStates;
	EditorUi.prototype.updateActionStates = function()
	{
		editorUiUpdateActionStates.apply(this, arguments);

		var graph = this.editor.graph;
		var file = this.getCurrentFile();
		var active = (file != null && file.isEditable()) || urlParams['embed'] == '1';
		this.actions.get('pageSetup').setEnabled(active);
		this.actions.get('autosave').setEnabled(file != null && file.isEditable() && file.isAutosaveOptional());
		this.actions.get('guides').setEnabled(active);
		this.actions.get('shadowVisible').setEnabled(active);
		this.actions.get('connectionArrows').setEnabled(active);
		this.actions.get('connectionPoints').setEnabled(active);
		this.actions.get('copyStyle').setEnabled(active && !graph.isSelectionEmpty());
		this.actions.get('pasteStyle').setEnabled(active && !graph.isSelectionEmpty());
		this.actions.get('editGeometry').setEnabled(graph.getModel().isVertex(graph.getSelectionCell()));
		this.actions.get('createShape').setEnabled(active);
		this.actions.get('createRevision').setEnabled(active);
		this.actions.get('moveToFolder').setEnabled(file != null);
		this.actions.get('makeCopy').setEnabled(file != null && !file.isRestricted());
		this.actions.get('editDiagram').setEnabled(urlParams['embed'] == '1' ||
				(file != null && !file.isRestricted()));
		this.actions.get('imgur').setEnabled(file != null && !file.isRestricted());
		this.actions.get('twitter').setEnabled(file != null && !file.isRestricted());
		this.actions.get('facebook').setEnabled(file != null && !file.isRestricted());
		this.actions.get('github').setEnabled(file != null && !file.isRestricted());
		this.actions.get('publishLink').setEnabled(file != null && !file.isRestricted());
		this.menus.get('publish').setEnabled(file != null && !file.isRestricted());
		
		var state = graph.view.getState(graph.getSelectionCell());
		this.actions.get('editShape').setEnabled(active && state != null && state.shape != null && state.shape.stencil != null);
	};
})();
