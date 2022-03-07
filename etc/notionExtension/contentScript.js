(function()
{
	// Specifies if images should be changed for dark mode
	var convertImages = true;
	var backgroundColor = '#191919';
	var convertAttrib = 'data-drawio-src';
	var editor = 'https://embed.diagrams.net/?embedInline=1&libraries=1&configure=1';
	//editor = 'https://test.draw.io/?dev=1&embedInline=1&libraries=1&configure=1';
	var notionScrollers = document.getElementsByClassName('notion-scroller vertical');
	var notionFrames = document.getElementsByClassName('notion-frame');
	var dark = document.body.className.includes('dark');
	var initialized = false;
	var activeImage = null;
	var editBlockId = null;

	var iframe = document.createElement('iframe');
	iframe.style.position = 'absolute';
	iframe.style.border = '0';
	iframe.style.top = '0px';
	iframe.style.left = '0px';
	iframe.style.width = '100%';
	iframe.style.height = '100%';
	iframe.style.zIndex = '4';

	function logEvent(data)
	{
		try
		{
			var img = new Image();
			img.src = 'https://log.draw.io/images/1x1.png?' +
				'data=' + encodeURIComponent(
				JSON.stringify(data));
		}
		catch (e)
		{
			console.error(e);
		}
	};

	function invertImage(img, done)
	{
		var req = new XMLHttpRequest();

		req.addEventListener('load', function()
		{
			if (req.status >= 200 && req.status <= 299 && this.responseXML != null)
			{
				img.src = createSvgDataUri(invertSvg(this.responseXML));
			}

			done();
		});

		req.open('GET', img.src);
		req.send();
	};

	function installInverter(img)
	{
		var busy = false;
		img.setAttribute(convertAttrib, img.src);

		if (dark)
		{
			busy = true;

			invertImage(img, function()
			{
				busy = false;
			});
		}

		var mutationObserver = new MutationObserver(function(evt)
		{
			if (!isSvgDataUri(img.src) && img.src != '' && !busy)
			{
				if (dark)
				{
					busy = true;
					img.setAttribute(convertAttrib, img.src);

					invertImage(img, function()
					{
						busy = false;
					});
				}
			}
		});

		mutationObserver.observe(img, {attributes: true});
	};

	function darkModeChanged()
	{
		if (activeImage != null)
		{
			iframe.contentWindow.postMessage(JSON.stringify(
				{action: 'exit'}), '*');
		}

		var imgs = document.getElementsByTagName('img');

		for (var i = 0; i < imgs.length; i++)
		{
			var src = imgs[i].getAttribute(convertAttrib);

			if (src != null)
			{
				if (!isSvgDataUri(imgs[i].src))
				{
					src = imgs[i].src;
					imgs[i].src = '';
					imgs[i].src = src;
				}
				else
				{
					imgs[i].src = src;
				}
			}
		}
	};

	function editImage(img, isNew, onChange)
	{
		iframe.doResize = function(msg)
		{
			setFullscreen(msg.fullscreen);
			img.style.width = msg.rect.width + 'px';
			img.style.height = (msg.rect.height - 22) + 'px';
		};

		var prev = img.parentNode.style.cursor;
		img.parentNode.style.cursor = 'wait';
		iframe.style.cursor = 'wait';

		iframe.doInit = function(errorCode)
		{
			if (errorCode != null)
			{
				img.parentNode.style.cursor = prev;
				onChange({});
				alert('Error ' + errorCode + ': Cannot load editor');
			}
			else
			{
				setControlsVisible(img, false);
				crossfade(img, iframe);
				iframe.style.cursor = '';
				img.parentNode.style.cursor = prev;
			}
		};
		
		iframe.doUpdate = onChange;
		startEditor(img, isNew);
	};

	function startEditor(img, isNew)
	{
		var req = new XMLHttpRequest();

		req.addEventListener('load', function()
		{
			if (req.status >= 200 && req.status <= 299)
			{
				try
				{
					var rect = img.parentNode.getBoundingClientRect();
					var r = iframe.parentNode.getBoundingClientRect();

					if (rect.y < r.y + 66 || rect.y > iframe.parentNode.scrollTop + r.height)
					{
						img.scrollIntoView();
						iframe.parentNode.scrollTop -= 60
						rect = img.parentNode.getBoundingClientRect();
					}

					var border = 8;
					rect.x -= border + 3 + r.x;
					rect.y -= border + 3 - iframe.parentNode.scrollTop + r.y;
					rect.width += 2 * border + 2;
					rect.height = (isNew) ? Math.max(rect.height, 500) : rect.height + 2 * border + 2;

					iframe.contentWindow.postMessage(JSON.stringify(
						{action: 'load', xml: this.responseText, border: border,
						background: '#ffffff', rect: rect, dark: dark,
						viewport: getViewport()}), '*');
					updateFrame();

					logEvent({category: 'NOTION',
						action: (isNew) ? 'create' : 'edit',
						label: getBlockId(img)});
				}
				catch (e)
				{
					iframe.doInit(e.message);
				}
			}
			else
			{
				iframe.doInit(req.status);
			}
		});

		req.open('GET', img.src);
		req.send();
	};

	function installEditor(img, filename, url)
	{
		img.parentNode.addEventListener('click', function()
		{
			if (!initialized)
			{
				var prev = img.parentNode.style.cursor;
				img.parentNode.style.cursor = 'not-allowed';

				window.setTimeout(function()
				{
					img.parentNode.style.cursor = prev;
				}, 300);
			}
			else
			{
				prepareEditor(img, filename, url);
			}
		});
	};

	function editBlock(id)
	{
		editBlockId = id;
	};

	function mergeChanges(url)
	{
		var req = new XMLHttpRequest();

		req.addEventListener('load', function()
		{
			if (req.status >= 200 && req.status <= 299)
			{
				iframe.contentWindow.postMessage(JSON.stringify({action: 'merge',
					xml: this.responseText}), '*');
			}
		});

		req.open('GET', url);
		req.send();
	};

	var lastSnapshot = null;

	function prepareEditor(img, filename, url, isNew)
	{
		if (!iframe.busy)
		{
			var elt = document.activeElement;
			iframe.busy = true;
			activeImage = img;

			var width = img.style.width;
			var height = img.style.height;
			var boxSizing = img.style.boxSizing;

			// Listens for remote changes
			var mutationObserver = new MutationObserver(function(evt)
			{
				if (!isSvgDataUri(img.src) && url != img.src &&
					activeImage == img)
				{
					url = img.src;
					mergeChanges(url);
				}
			});
		
			mutationObserver.observe(img, {attributes: true});

			editImage(img, isNew, function(msg, override)
			{
				if (msg.data != null && msg.exit != null &&
					!msg.exit && !override)
				{
					lastSnapshot = msg;
				}
				else
				{
					var rect = iframe.getBoundingClientRect();
					mutationObserver.disconnect();
					setFullscreen(false);
					img.style.width = width;
					img.style.height = height;
					img.style.boxSizing = boxSizing;
					imageChanged(img, filename, msg.data);

					crossfade(iframe, img, function()
					{
						setControlsVisible(img, true);
						iframe.busy = false;
						lastSnapshot = null;
						activeImage = null;

						if (msg != null && msg.point != null)
						{
							var temp = document.elementFromPoint(rect.x + msg.point.x, rect.y + msg.point.y);

							if (temp != null && temp.click != null)
							{
								elt = temp;
								elt.click();
							}
						}

						elt.focus();
					});
				}
			});
		}
	};

	function imageChanged(img, filename, data)
	{
		if (data != null)
		{
			var svg = getSvg(data);

			replaceDiagram({blockId: getBlockId(img), filename: filename, data: svg}, function(msg)
			{
				if (msg.error != null)
				{
					alert('Error ' + msg.errStatus + ': Cannot update diagram');
				}
			});

			if (dark && convertImages)
			{
				data = createSvgDataUri(invertSvg(new DOMParser().
					parseFromString(svg, 'text/xml')));
			}

			// Restores state and shows preview
			img.setAttribute('src', data);
		}

		iframe.style.width = '100%';
		iframe.style.height = '100%';
		iframe.doUpdate = null;
		iframe.doResize = null;
	};

	window.addEventListener('message', function(evt)
	{
		if (evt, evt.source === iframe.contentWindow)
		{
			var msg = JSON.parse(evt.data);

			if (msg.event == 'init')
			{
				initialized = true;
			}
			else if (msg.event == 'configure')
			{
				iframe.contentWindow.postMessage(JSON.stringify({action: 'configure',
					config: {
						darkColor: backgroundColor,
						settingsName: 'notion'
					}
				}), '*');
			}
			else if (msg.event == 'load' && iframe.doInit != null)
			{
				iframe.doInit();
			}
			else if ((msg.event == 'export' || msg.event == 'exit') &&
				iframe.doUpdate != null)
			{
				iframe.doUpdate(msg);
			}
			else if (msg.event == 'resize' && iframe.doResize != null)
			{
				iframe.doResize(msg);
			}
		}
	});

	var checked = [];

	function updateChecked()
	{
		var temp = [];

		// Forgets old images
		for (var i = 0; i < checked.length; i++)
		{
			if (document.body.contains(checked[i]))
			{
				temp.push(checked[i]);
			}
		}

		return temp;
	};

	function checkDiagram(img)
	{
		var filename = getFilename(img.src);
		var result = false;

		if (filename.endsWith('.drawio.svg'))
		{
			installEditor(img, filename, img.src);

			if (convertImages)
			{
				installInverter(img);
			}

			if (editBlockId != null && getBlockId(img) == editBlockId)
			{
				editBlockId = null;
				prepareEditor(img, filename, img.src, true);
			}

			result = true;
		}

		return result;
	};

	function checkImage(img)
	{
		if (checked.indexOf(img) < 0)
		{
			checked.push(img);

			if (!checkDiagram(img))
			{
				var mutationObserver = new MutationObserver(function()
				{
					if (checkDiagram(img))
					{
						mutationObserver.disconnect();
					}
				});
		
				mutationObserver.observe(img, {attributes: true});
			}
		};
	};

	function scrollHandler()
	{
		if (iframe.style.visibility != 'hidden')
		{
			iframe.contentWindow.postMessage(JSON.stringify(
				{action: 'viewport', viewport: getViewport()}), '*');
		}
	};

	// Creates a snapshot in case ppl click off the diagram so that it
	// is removed from the DOM (eg, if they click on the background or
	// if they click in the navigation).
	iframe.addEventListener('mouseleave', function()
	{
		if (activeImage != null && iframe.contentWindow != null)
		{
			iframe.contentWindow.postMessage(JSON.stringify(
				{action: 'snapshot'}), '*');
		}
	}, true);

	function checkFrame()
	{
		// Checks if pending snapshot exists
		if (iframe.doUpdate != null && lastSnapshot != null &&
			!document.body.contains(iframe))
		{
			iframe.doUpdate(lastSnapshot, true);
		}

		// Checks if parent node was removed and reinserts editor
		// Adding to body would avoid this but doesn't allow
		// the iframe to be scrolled with the page content.
		// LATER: Can we use cloneNode to avoid this?
		if (notionScrollers.length > 0 &&
			!notionScrollers[notionScrollers.length - 1].contains(iframe))
		{
			if (iframe.parentNode != null)
			{
				iframe.parentNode.removeEventListener('scroll', scrollHandler);
			}

			initialized = false;
			iframe.busy = false;
			iframe.style.visibility = 'hidden';
			notionScrollers[notionScrollers.length - 1].appendChild(iframe);
			iframe.setAttribute('src', editor);
			iframe.parentNode.addEventListener('scroll', scrollHandler);
		}
	};

	function checkImages()
	{
		// Removes old images
		// LATER: Move to other listener with fewer invocations
		checked = updateChecked();
		var imgs = document.getElementsByTagName('img');

		for (var i = 0; i < imgs.length; i++)
		{
			checkImage(imgs[i]);
		}
	};

	function getViewport()
	{
		var viewport = iframe.parentNode.getBoundingClientRect();
		viewport.x = iframe.parentNode.scrollLeft;
		viewport.y = iframe.parentNode.scrollTop;

		return viewport;
	};

	function pageChanged()
	{
		checkFrame();
		checkImages();
	};
	
	function installDarkModeListener()
	{
		new MutationObserver(pageChanged).observe(
			document.body, {childList: true,
				subtree: true});

		new MutationObserver(function()
		{
			var newDark = document.body.className.includes('dark');

			if (newDark != dark)
			{
				dark = newDark;
				darkModeChanged();
			}
		}).observe(document.body, {attributes: true});
	}

	installDarkModeListener();

	window.addEventListener('resize', function()
	{
		if (iframe.style.visibility != 'hidden')
		{
			iframe.contentWindow.postMessage(JSON.stringify(
				{action: 'viewport', viewport: getViewport()}), '*');

			updateFrame();
		}
	});

	var fullscreen = false;
	var prevOverflow = null;

	function updateFrame()
	{
		if (fullscreen)
		{
			var r = notionFrames[0].getBoundingClientRect();
			prevOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			iframe.style.position = 'fixed';
			iframe.style.top = r.y + 'px';
			iframe.style.left = r.x + 'px';
			iframe.style.width = r.width + 'px';
			iframe.style.height = r.height + 'px';
		}
		else
		{
			document.body.style.overflow = prevOverflow;
			iframe.style.position = 'absolute';
			iframe.style.left = '0px';
			iframe.style.top = '0px';
			iframe.style.width = iframe.parentNode.clientWidth + 'px';
			iframe.style.height = iframe.parentNode.scrollHeight + 'px';
		}
	};

	function setFullscreen(value)
	{
		if (fullscreen != value)
		{
			fullscreen = value;
			updateFrame();
		}
	};

	function setControlsVisible(img, visible)
	{
		try
		{
			// Hides halo
			img.parentNode.parentNode.parentNode.parentNode.parentNode.
				nextSibling.style.visibility = 'hidden';
			iframe.parentNode.nextSibling.style.visibility =
				(visible) ? '' : 'hidden';
		}
		catch (e)
		{
			// ignore
		}
	};

	function invertSvg(doc)
	{
		var defs = doc.getElementsByTagName('defs');
		var style = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
		style.appendChild(doc.createTextNode(
			'[stroke="rgb(0, 0, 0)"] {stroke: #f0f0f0}\n' +
			'[stroke="rgb(255, 255, 255)"] {stroke: ' + backgroundColor + '}\n' +
			'[fill="rgb(0, 0, 0)"] {fill: #f0f0f0}\n' +
			'[fill="rgb(255, 255, 255)"] {fill: ' + backgroundColor + '}\n' +
			'g[fill="rgb(0, 0, 0)"] text {fill: #f0f0f0}\n' +
			'div[data-drawio-colors*="color: rgb(0, 0, 0)"] div ' +
			'{color: #f0f0f0 !important;}\n' +
			'div[data-drawio-colors*="background-color: rgb(255, 255, 255)"] div ' +
			'{background-color: ' + backgroundColor + ' !important;}' +
			'div[data-drawio-colors*="border-color: rgb(0, 0, 0)"] div ' +
			'{border-color: #f0f0f0 !important;}' +
			'div[data-drawio-colors*="background-color: rgb(255, 255, 255)"] ' +
			'{background-color: ' + backgroundColor + ' !important;}' +
			'div[data-drawio-colors*="border-color: rgb(0, 0, 0)"] ' +
			'{border-color: #f0f0f0 !important;}' +
			// Invert old rgba output
			'[stroke="rgba(0, 0, 0, 1)"] {stroke: #f0f0f0}\n' +
			'[stroke="rgba(255, 255, 255, 1)"] {stroke: ' + backgroundColor + '}\n' +
			'[fill="rgba(0, 0, 0, 1)"] {fill: #f0f0f0}\n' +
			'[fill="rgba(255, 255, 255, 1)"] {fill: ' + backgroundColor + '}\n' +
			'g[fill="rgba(0, 0, 0, 1)"] text {fill: #f0f0f0}\n' +
			'div[data-drawio-colors*="color: rgba(0, 0, 0, 1)"] div ' +
			'{color: #f0f0f0 !important;}\n' +
			'div[data-drawio-colors*="background-color: rgba(255, 255, 255, 1)"] div ' +
			'{background-color: ' + backgroundColor + ' !important;}' +
			'div[data-drawio-colors*="border-color: rgba(0, 0, 0, 1)"] div ' +
			'{border-color: #f0f0f0  !important;}' +
			'div[data-drawio-colors*="background-color: rgba(255, 255, 255, 1)"] ' +
			'{background-color: ' + backgroundColor + ' !important;}' +
			'div[data-drawio-colors*="border-color: rgba(0, 0, 0, 1)"] ' +
			'{border-color: #f0f0f0 !important;}'));
		defs[0].appendChild(style);

		if (doc.documentElement.style.backgroundColor == 'rgb(255, 255, 255)')
		{
			doc.documentElement.style.backgroundColor = backgroundColor;
			var g = doc.getElementsByTagName('g');

			if (g != null && g.length > 0 && g[0].getAttribute('filter') == 'url(#dropShadow)')
			{
				g[0].removeAttribute('filter');
			}
		}

		return doc;
	};

	function isSvgDataUri(url)
	{
		return url.startsWith('data:image/svg+xml;base64,');
	};

	function createSvgDataUri(doc)
	{
		return 'data:image/svg+xml;base64,' +
			btoa(unescape(encodeURIComponent(
				new XMLSerializer().serializeToString(
					doc.documentElement))));
	};

	function getSvg(data)
	{
		return  '<?xml version="1.0" encoding="UTF-8"?>\n' +
			'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
			decodeURIComponent(escape(atob(data.substring(data.indexOf(',') + 1))));
	};

	function getFilename(url)
	{
		var tokens = url.split('?')[0].split('/');
		var filename = tokens[tokens.length - 1];

		if (filename.startsWith('https%3A%2F%2F'))
		{
			filename = getFilename(decodeURIComponent(filename));
		}

		return filename;
	};

	function getBlockId(node)
	{
		var blockId = null;
		
		while (blockId == null && node != null && node != document.body)
		{
			blockId = node.getAttribute('data-block-id');
			node = node.parentNode;
		}

		return blockId;
	};

	function crossfade(source, target, done)
	{
		target.style.visibility = '';

		window.setTimeout(function()
		{
			source.style.visibility = 'hidden';

			if (done != null)
			{
				done();
			}	
		}, 50);
	};

	function extractId(url, isBlock)
	{
		if (isBlock)
		{
			url = url.split('#').pop();
		}
		
		let id = url.split('/').pop().split('&p=').pop().split('?p=').pop().split('?').shift().split('-').pop().split('&').shift();
		
		//Return the id in the form 12345678-1234-5678-1234-567812345678 
		return id.substring(0,8) + '-' + id.substring(8, 12) + '-' + id.substring(12, 16) +
				 '-' + id.substring(16, 20) + '-' + id.substring(20);
	};
	
	function uuidv4()
	{
	  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	  );
	}
	
	function callNotionAPI(api, data, onsuccess, onerror, origMsg, absUrl, method, directData, mimeType, respAsTxt)
	{
		fetch(absUrl || ('https://www.notion.so/api/v3/' + api),
			{ method: method || 'post', 
			  body: directData? data : JSON.stringify(data), 
			  headers: {'Content-Type': mimeType || 'application/json'}})
			.then(async res => 
			{
				try
				{
					if (res.ok)
					{
						onsuccess(respAsTxt? await res.text() : await res.json());
					}
					else
					{
						origMsg = origMsg || {};
						origMsg.error = true;
						origMsg.errStatus = res.status;
						onerror(origMsg);
						
						try
						{
							console.log(await res.json());
						}
						catch(e){}
					}
				}
				catch(e)
				{
					console.log(e);
					origMsg.error = true;
					onerror(origMsg);
				}
			})
			.catch((err) => 
			{
				console.log(err);
				origMsg.error = true;
				onerror(origMsg);
			});
	};

	function replaceDiagram(msg, sendResponse)
	{
		callNotionAPI('loadUserContent', {},
		function(data)
		{
			let userId = Object.keys(data.recordMap.notion_user)[0];
			let blockId = msg.blockId;
			
			//Upload the file
			callNotionAPI('getUploadFileUrl', {bucket: 'secure', name: msg.filename, contentType: 'image/svg+xml'},
			function(urls)
			{
				let ts = Date.now();
				let url = urls.url;
				const S3_URL_PREFIX = 'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/';
				let fileId = url.substring(S3_URL_PREFIX.length).split('/')[0];
				
				callNotionAPI(null, msg.data, function()
				{
					//Update Image block with file info
					callNotionAPI('saveTransactions', {
						'requestId': uuidv4(),
						'transactions': [{
							'id': uuidv4(),
							'operations': [
								{'id': blockId, 'path': ['format', 'display_source'], 
									'args': url, 
									'command': 'set', 'table': 'block'
								}, 
								{
									'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts}, 
									'command': 'update', 'id': blockId, 'path': [], 'table': 'block'
								},
								{'id': blockId, 'path': ['properties', 'source'], 
									'args': [[url]], 
									'command': 'set', 'table': 'block'
								}, 
								{
									'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts}, 
									'command': 'update', 'id': blockId, 'path': [], 'table': 'block'
								},
								{'id': blockId, 'path': ['file_ids', 0], 
									'args': fileId, 
									'command': 'set', 'table': 'block'
								}, 
								{
									'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts},
									'command': 'update', 'id': blockId, 'path': [], 'table': 'block'
								}				
							]
						}]
					},
					function()
					{
						msg.newUrl = url;
						sendResponse(msg);
					}, sendResponse, msg);
				}, sendResponse, msg, urls.signedPutUrl, 'put', true, 'image/svg+xml', true);
			}, sendResponse, msg);
		}, sendResponse, msg);
	};
	
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) 
	{
		switch (msg.msg)
		{
		case 'insertDiagram':
			// Stops active editing
			if (activeImage != null)
			{
				iframe.contentWindow.postMessage(JSON.stringify(
					{action: 'exit'}), '*');
			}

			//Get user ID
			callNotionAPI('loadUserContent', {},
			function(data)
			{
				let userId = Object.keys(data.recordMap.notion_user)[0];
				let blockId = uuidv4();
				let pageId = msg.pageId || extractId(window.location.href);
				let ts = Date.now();
				
				//Add Image block
				callNotionAPI('saveTransactions', {
					'requestId': uuidv4(),
					'transactions': [{
						'id': uuidv4(), 			
						'operations': [
							{'id': blockId, 'path': [], 
								'args': {'id': blockId, 'version': 1, 'alive': true, 'created_by_id': userId, 'created_by_table': 'notion_user',
									'created_time': ts, 'parent_id': pageId, 'parent_table': 'block', 'type': 'image', 'child_list_key': null}, 
								'command': 'set', 'table': 'block'
							},
							{	
								'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts}, 
								'command': 'update', 'id': blockId, 'path': [], 'table': 'block'
							},
							{'id': pageId, 'path': ['content'], 
								'args': {'id': blockId}, 
								'command': 'listAfter', 'table': 'block'
							},
							{
								'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts}, 
								'command': 'update', 'id': pageId, 'path': [], 'table': 'block'
							},
							{
								'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts}, 
								'command': 'update', 'id': pageId, 'path': [], 'table': 'block'
							},
							{
								'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts}, 
								'command': 'update', 'id': blockId, 'path': [], 'table': 'block'
							}
						]
					}]
				},
				function()
				{
					//Now, upload the file
					callNotionAPI('getUploadFileUrl', {bucket: 'secure', name: msg.filename, contentType: 'image/svg+xml'},
					function(urls)
					{
						ts = Date.now();
						let url = urls.url;
						const S3_URL_PREFIX = 'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/';
						let fileId = url.substring(S3_URL_PREFIX.length).split('/')[0];
						
						callNotionAPI(null, msg.data, function()
						{
							//Update Image block with file info
							callNotionAPI('saveTransactions', {
								'requestId': uuidv4(),
								'transactions': [{
									'id': uuidv4(),
									'operations': [
										{'id': blockId, 'path': ['format', 'display_source'], 
											'args': url, 
											'command': 'set', 'table': 'block'
										}, 
										{
											'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts}, 
											'command': 'update', 'id': blockId, 'path': [], 'table': 'block'
										},
										{'id': blockId, 'path': ['properties', 'source'], 
											'args': [[url]], 
											'command': 'set', 'table': 'block'
										}, 
										{
											'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts}, 
											'command': 'update', 'id': blockId, 'path': [], 'table': 'block'
										},
										{'id': blockId, 'path': ['file_ids', 0], 
											'args': fileId, 
											'command': 'set', 'table': 'block'
										}, 
										{
											'args': {'last_edited_by_id': userId, 'last_edited_by_table': 'notion_user', 'last_edited_time': ts},
											'command': 'update', 'id': blockId, 'path': [], 'table': 'block'
										}				
									]
								}]
							},
							function()
							{
								msg.newBlock = {id: blockId, url: url};
								editBlock(blockId);
								sendResponse(msg);
							}, sendResponse, msg);
						}, sendResponse, msg, urls.signedPutUrl, 'put', true, 'image/svg+xml', true);
					}, sendResponse, msg);
				}, sendResponse, msg);
			}, sendResponse, msg);
		break;
		}
		
		return true;
	});
})();
