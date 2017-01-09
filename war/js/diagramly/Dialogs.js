/*
 * $Id: Dialogs.js,v 1.103 2014/02/11 14:08:15 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */
var StorageDialog = function(editorUi, fn)
{
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	div.style.whiteSpace = 'nowrap';
	
	var elt = editorUi.addLanguageMenu(div);
	var bottom = '28px';
	
	if (elt != null)
	{
		elt.style.bottom = bottom;
	}
	
	if (!editorUi.isOffline())
	{
		var help = document.createElement('a');
		help.setAttribute('href', 'https://support.draw.io/display/DO/Selecting+Storage');
		help.setAttribute('title', mxResources.get('help'));
		help.setAttribute('target', '_blank');
		help.style.position = 'absolute';
		help.style.textDecoration = 'none';
		help.style.cursor = 'pointer';
		help.style.fontSize = '12px';
		help.style.bottom = bottom;
		help.style.left = '26px';
		help.style.color = 'gray';
		mxUtils.write(help, mxResources.get('help'));
		
		div.appendChild(help);
	}

	var demo = document.createElement('div');
	demo.style.position = 'absolute';
	demo.style.cursor = 'pointer';
	demo.style.fontSize = '12px';
	demo.style.bottom = bottom;
	demo.style.color = 'gray';
	mxUtils.write(demo, mxResources.get('decideLater'));
	
	if (editorUi.isOfflineApp())
	{
		demo.style.right = '20px';
	}
	else
	{
		mxUtils.setPrefixedStyle(demo.style, 'transform', 'translate(-50%,0)');
		demo.style.left = '50%';
	}
	
	this.init = function()
	{
		if (mxClient.IS_QUIRKS || document.documentMode == 8)
		{
			demo.style.marginLeft = -Math.round(demo.clientWidth / 2) + 'px';
		}
	};
	
	div.appendChild(demo);
	
	mxEvent.addListener(demo, 'click', function()
	{
		editorUi.hideDialog();
		var prev = Editor.useLocalStorage;
		editorUi.createFile(editorUi.defaultFilename, null, null, App.MODE_DEVICE);
		editorUi.setMode(null);
		Editor.useLocalStorage = prev;
	});
	
	var buttons = document.createElement('div');
	
	if (mxClient.IS_QUIRKS)
	{
		buttons.style.whiteSpace = 'nowrap';
		buttons.style.cssFloat = 'left';
	}

	buttons.style.border = '1px solid #d3d3d3';
	buttons.style.borderWidth = '1px 0px 1px 0px';
	buttons.style.padding = '26px 0px 12px 0px';

	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.setAttribute('checked', 'checked');
	cb.defaultChecked = true;
	
	function addLogo(img, title, mode, clientName)
	{
		var button = document.createElement('a');
		button.style.overflow = 'hidden';
		
		var logo = document.createElement('img');
		logo.setAttribute('src', img);
		logo.setAttribute('border', '0');
		logo.setAttribute('align', 'absmiddle');
		logo.style.width = '60px';
		logo.style.height = '60px';
		logo.style.paddingBottom = '6px';
		button.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
		button.className = 'geBaseButton';
		button.style.position = 'relative';
		button.style.margin = '4px';
		button.style.padding = '8px 10px 12px 10px';
		button.style.whiteSpace = 'nowrap';
		
		// Workaround for quirks is a vertical list (limited to max 2 items)
		if (mxClient.IS_QUIRKS)
		{
			button.style.cssFloat = 'left';
			button.style.zoom = '1';
		}

		button.appendChild(logo);
		
		var label = document.createElement('div');
		button.appendChild(label);
		mxUtils.write(label, title);
		
		function initButton()
		{
			mxEvent.addListener(button, 'click', function()
			{
				// Special case: Redirect all drive users to draw.io pro
				if (mode == App.MODE_GOOGLE && !editorUi.isDriveDomain())
				{
					window.location.hostname = DriveClient.prototype.newAppHostname;
				}
				else if (mode == App.MODE_GOOGLE && editorUi.spinner.spin(document.body, mxResources.get('authorizing')))
				{
					// Tries immediate authentication
					editorUi.drive.checkToken(mxUtils.bind(this, function()
					{
						editorUi.spinner.stop();
						editorUi.setMode(mode, cb.checked);
						fn();
					}));
				}
				else
				{
					editorUi.setMode(mode, cb.checked);
					fn();
				}
			});
		};
		
		// Supports lazy loading
		if (clientName != null && editorUi[clientName] == null)
		{
			logo.style.visibility = 'hidden';
			mxUtils.setOpacity(label, 10);
			var size = 12;
			
			var spinner = new Spinner({
				lines: 12, // The number of lines to draw
				length: size, // The length of each line
				width: 5, // The line thickness
				radius: 10, // The radius of the inner circle
				rotate: 0, // The rotation offset
				color: '#000', // #rgb or #rrggbb
				speed: 1.5, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				top: '40%',
				zIndex: 2e9 // The z-index (defaults to 2000000000)
			});
			spinner.spin(button);
			
			// Timeout after 30 secs
			var timeout = window.setTimeout(function()
			{
				if (editorUi[clientName] == null)
				{
					spinner.stop();
					button.style.display = 'none';
				}
			}, 30000);
			
			editorUi.addListener('clientLoaded', mxUtils.bind(this, function()
			{
				if (editorUi[clientName] != null)
				{
					window.clearTimeout(timeout);
					mxUtils.setOpacity(label, 100);
					logo.style.visibility = '';
					spinner.stop();
					initButton();
				}
			}));
		}
		else
		{
			initButton();
		}

		buttons.appendChild(button);
	};

	var hd = document.createElement('p');
	hd.style.fontSize = '16pt';
	hd.style.padding = '0px';
	hd.style.paddingTop = '4px';
	hd.style.paddingBottom = '20px';
	hd.style.margin = '0px';
	hd.style.color = 'gray';
	mxUtils.write(hd, mxResources.get('saveDiagramsTo') + ':');
	div.appendChild(hd);
	
	if (typeof window.DriveClient === 'function')
	{
		addLogo(IMAGE_PATH + '/google-drive-logo.svg', mxResources.get('googleDrive'), App.MODE_GOOGLE, 'drive');
	}

	if (typeof window.DropboxClient === 'function')
	{
		addLogo(IMAGE_PATH + '/dropbox-logo.svg', mxResources.get('dropbox'), App.MODE_DROPBOX, 'dropbox');
	}
	
	if (typeof window.OneDriveClient === 'function')
	{
		addLogo(IMAGE_PATH + '/onedrive-logo.svg', mxResources.get('oneDrive'), App.MODE_ONEDRIVE, 'oneDrive');
	}
	
	if (!mxClient.IS_IOS || urlParams['storage'] == 'device')
	{
		addLogo(IMAGE_PATH + '/osa_drive-harddisk.png', mxResources.get('device'), App.MODE_DEVICE);
	}
	
	if (isLocalStorage && (urlParams['browser'] == '1' || urlParams['offline'] == '1'))
	{
		addLogo(IMAGE_PATH + '/osa_database.png', mxResources.get('browser'), App.MODE_BROWSER);
	}
	
	div.appendChild(buttons);

	var p2 = document.createElement('p');
	p2.style.paddingTop = '10px';
	p2.appendChild(cb);
	
	var span = document.createElement('span');
	span.style.color = 'gray';
	span.style.fontSize = '12px';
	mxUtils.write(span, ' ' + mxResources.get('rememberThisSetting'));
	p2.appendChild(span);
	buttons.appendChild(p2);
	
	mxEvent.addListener(span, 'click', function(evt)
	{
		cb.checked = !cb.checked;
		mxEvent.consume(evt);
	});

	// Checks if Google Drive is missing after a 5 sec delay
	if (mxClient.IS_SVG && isLocalStorage && urlParams['gapi'] != '0' &&
		(document.documentMode == null || document.documentMode >= 10))
	{
		window.setTimeout(function()
		{
			if (editorUi.drive == null)
			{
				// To check for Disconnect plugin in chrome use mxClient.IS_GC and check for URL:
				// chrome-extension://jeoacafpbcihiomhlakheieifhpjdfeo/scripts/vendor/jquery/jquery-2.0.3.min.map
				var p3 = document.createElement('p');
				p3.style.padding = '8px';
				p3.style.fontSize = '9pt';
				p3.style.marginTop = '-14px';
				p3.innerHTML = '<a style="background-color:#dcdcdc;padding:5px;color:black;text-decoration:none;" ' +
					'href="https://plus.google.com/u/0/+DrawIo1/posts/1HTrfsb5wDN" target="_blank">' +
					'<img border="0" src="' + mxGraph.prototype.warningImage.src + '" align="top"> ' +
					mxResources.get('googleDriveMissing') + '</a>';
				div.appendChild(p3);
			}
		}, 5000);
	}
	
	this.container = div;
};

/**
 * Constructs a dialog for creating new files from templates.
 */
var SplashDialog = function(editorUi)
{
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	
	editorUi.addLanguageMenu(div);
	var help = null;
	
	if (!editorUi.isOffline())
	{
		help = document.createElement('a');
		help.setAttribute('href', 'https://support.draw.io/display/DO/Selecting+Storage');
		help.setAttribute('title', mxResources.get('help'));
		help.setAttribute('target', '_blank');
		help.style.position = 'absolute';
		help.style.fontSize = '12px';
		help.style.textDecoration = 'none';
		help.style.cursor = 'pointer';
		help.style.bottom = '22px';
		help.style.left = '26px';
		help.style.color = 'gray';
		mxUtils.write(help, mxResources.get('help'));
		
		div.appendChild(help);
	}

	var hd = document.createElement('p');
	hd.style.fontSize = '16pt';
	hd.style.padding = '0px';
	hd.style.paddingTop = '2px';
	hd.style.margin = '0px';
	hd.style.color = 'gray';
	
	var logo = document.createElement('img');
	logo.setAttribute('border', '0');
	logo.setAttribute('align', 'absmiddle');
	logo.style.width = '40px';
	logo.style.height = '40px';
	logo.style.marginRight = '12px';
	logo.style.paddingBottom = '4px';
	
	var service = '';
	
	if (editorUi.mode == App.MODE_GOOGLE)
	{
		logo.src = IMAGE_PATH + '/google-drive-logo.svg';
		service = mxResources.get('googleDrive');
		
		if (help != null)
		{
			help.setAttribute('href', 'https://support.draw.io/display/DO/Using+draw.io+with+Google+Drive');
		}
	}
	else if (editorUi.mode == App.MODE_DROPBOX)
	{
		logo.src = IMAGE_PATH + '/dropbox-logo.svg';
		service = mxResources.get('dropbox');
		
		if (help != null)
		{
			help.setAttribute('href', 'https://support.draw.io/display/DO/Using+draw.io+with+Dropbox');
		}
	}
	else if (editorUi.mode == App.MODE_ONEDRIVE)
	{
		logo.src = IMAGE_PATH + '/onedrive-logo.svg';
		service = mxResources.get('oneDrive');
		
		if (help != null)
		{
			help.setAttribute('href', 'https://support.draw.io/display/DO/Using+draw.io+with+OneDrive');
		}
	}
	else if (editorUi.mode == App.MODE_BROWSER)
	{
		logo.src = IMAGE_PATH + '/osa_database.png';
		service = mxResources.get('browser');
	}
	else
	{
		logo.src = IMAGE_PATH + '/osa_drive-harddisk.png';
		service = mxResources.get('device');
	}

	hd.appendChild(logo);
	
	mxUtils.write(hd, service);
		
	div.appendChild(hd);

	var buttons = document.createElement('div');
	
	if (mxClient.IS_QUIRKS)
	{
		buttons.style.whiteSpace = 'nowrap';
		buttons.style.cssFloat = 'left';
	}

	buttons.style.border = '1px solid #d3d3d3';
	buttons.style.borderWidth = '1px 0px 1px 0px';
	buttons.style.padding = '18px 0px 24px 0px';
	buttons.style.margin = '4px 0px 0px 0px';
	
	var btn = document.createElement('button');
	btn.className = 'geBigButton';
	btn.style.marginBottom = '8px';
	btn.style.overflow = 'hidden';
	btn.style.width = '340px';
	
	if (mxClient.IS_QUIRKS)
	{
		btn.style.width = '340px';
	}
	
	mxUtils.write(btn, mxResources.get('createNewDiagram'));
	
	mxEvent.addListener(btn, 'click', function()
	{
		editorUi.hideDialog();
		editorUi.actions.get('new').funct();
	});
	
	buttons.appendChild(btn);
	mxUtils.br(buttons);
	
	var btn = document.createElement('button');
	btn.className = 'geBigButton';
	btn.style.marginBottom = '22px';
	btn.style.overflow = 'hidden';
	btn.style.width = '340px';
	
	if (mxClient.IS_QUIRKS)
	{
		btn.style.width = '340px';
	}
	
	mxUtils.write(btn, mxResources.get('openExistingDiagram'));
	
	mxEvent.addListener(btn, 'click', function()
	{
		editorUi.actions.get('open').funct();
	});
	
	buttons.appendChild(btn);

	var storage = 'undefined';
	
	if (editorUi.mode == App.MODE_GOOGLE)
	{
		storage = mxResources.get('googleDrive');
	}
	else if (editorUi.mode == App.MODE_DROPBOX)
	{
		storage = mxResources.get('dropbox');
	}
	else if (editorUi.mode == App.MODE_ONEDRIVE)
	{
		storage = mxResources.get('oneDrive');
	}
	else if (editorUi.mode == App.MODE_DEVICE)
	{
		storage = mxResources.get('device');
	}
	else if (editorUi.mode == App.MODE_BROWSER)
	{
		storage = mxResources.get('browser');
	}
	
	var serviceCount = 0;
	
	if (editorUi.drive != null)
	{
		serviceCount++
	}
	
	if (editorUi.dropbox != null)
	{
		serviceCount++
	}
	
	if (isLocalStorage)
	{
		serviceCount++
	}
	
	if (!mxClient.IS_IOS)
	{
		serviceCount++
	}

	if (serviceCount > 1)
	{
		var link = document.createElement('a');
		link.setAttribute('href', 'javascript:void(0)');
		link.style.display = 'block';
		link.style.marginTop = '6px';
		mxUtils.write(link, mxResources.get('notUsingService', [storage]));
		
		mxEvent.addListener(link, 'click', function()
		{
			editorUi.hideDialog(false);
			editorUi.clearMode();
			editorUi.showSplash(true);
		});
		
		buttons.appendChild(link);

		var driveUser = (editorUi.drive != null) ? editorUi.drive.getUser() : null;
		
		if (editorUi.mode == App.MODE_GOOGLE && driveUser != null)
		{
			btn.style.marginBottom = '24px';
			
			var link = document.createElement('a');
			link.setAttribute('href', 'javascript:void(0)');
			link.style.display = 'block';
			link.style.marginTop = '2px';
			mxUtils.write(link, mxResources.get('changeUser') + ' (' + driveUser.displayName + ')');

			// Makes room after last big buttons
			btn.style.marginBottom = '16px';
			buttons.style.paddingBottom = '18px';
			
			mxEvent.addListener(link, 'click', function()
			{
				editorUi.hideDialog();
				editorUi.drive.clearUserId();
				editorUi.drive.setUser(null);
				gapi.auth.signOut();

				// Restores current dialog after clearing user
				editorUi.setMode(App.MODE_GOOGLE);
				editorUi.hideDialog();
				editorUi.showSplash();
				
				// FIXME: Does not force showing the auth dialog if only one user is logged in
				editorUi.drive.authorize(false, mxUtils.bind(this, mxUtils.bind(this, function()
				{
					editorUi.hideDialog();
					editorUi.showSplash();
				})), mxUtils.bind(this, function(resp)
				{
					editorUi.handleError(resp, null, function()
					{
						editorUi.hideDialog();
						editorUi.showSplash();
					});
				}));
			});

			buttons.appendChild(link);
		}
	}
	
	div.appendChild(buttons);
	
	// Changes Chrome App dialog
	if (mxClient.IS_CHROMEAPP)
	{
		hd.style.paddingTop = '12px';
		hd.innerHTML = '';
		mxUtils.write(hd, mxResources.get('chooseAnOption') + ':');
		buttons.style.border = 'none';
		buttons.style.padding = '16px 0px 0px 0px';
		btn.style.marginBottom = '0px';
	}
	
	this.init = function()
	{
		if (editorUi.mode == App.MODE_ONEDRIVE && editorUi.oneDrive != null)
		{
			var fn = function()
			{
				var oneDriveUser = editorUi.oneDrive.getUser();
				
				if (oneDriveUser != null)
				{
					btn.style.marginBottom = '24px';
					
					var link = document.createElement('a');
					link.setAttribute('href', 'javascript:void(0)');
					link.style.display = 'block';
					link.style.marginTop = '2px';
					mxUtils.write(link, mxResources.get('changeUser') + ' (' + oneDriveUser.displayName + ')');

					// Makes room after last big buttons
					btn.style.marginBottom = '16px';
					buttons.style.paddingBottom = '18px';
					
					mxEvent.addListener(link, 'click', function()
					{
						editorUi.oneDrive.logout();
						link.parentNode.removeChild(link);
						
						// NOTE: Could use userEvent=true here but it seems the logout
						// call is asynchronous and the client isn't fully logged out
						// when called immediately so we show the auth dialog to get
						// a delay (sometimes event that is not enough so should use
						// async callback on logout but that seems to be broken)
						editorUi.oneDrive.execute(fn);
					});
					
					buttons.appendChild(link);
				}
			};
			
			editorUi.oneDrive.execute(fn);
		}
	};
	
	this.container = div;
};

/**
 * 
 */
var ConfirmDialog = function(editorUi, message, okFn, cancelFn, okLabel, cancelLabel)
{
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	
	var p2 = document.createElement('div');
	p2.style.padding = '6px';
	p2.style.overflow = 'auto';
	p2.style.maxHeight = '40px';
	
	if (mxClient.IS_QUIRKS)
	{
		p2.style.height = '60px';
	}
	
	mxUtils.write(p2, message);
	div.appendChild(p2);
	
	var btns = document.createElement('div');
	btns.style.marginTop = '16px';
	btns.style.textAlign = 'center';
	
	var cancelBtn = mxUtils.button(cancelLabel || mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	var okBtn = mxUtils.button(okLabel || mxResources.get('ok'), function()
	{
		editorUi.hideDialog();
		
		if (okFn != null)
		{
			okFn();
		}
	});
	btns.appendChild(okBtn);
	
	okBtn.className = 'geBtn gePrimaryBtn';
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 * 
 */
var ErrorDialog = function(editorUi, title, message, buttonText, fn, retry, buttonText2, fn2, hide)
{
	hide = (hide != null) ? hide : true;
	
	var div = document.createElement('div');
	div.style.textAlign = 'center';

	if (title != null)
	{
		var hd = document.createElement('div');
		hd.style.padding = '0px';
		hd.style.margin = '0px';
		hd.style.fontSize = '18px';
		hd.style.paddingBottom = '16px';
		hd.style.marginBottom = '16px';
		hd.style.borderBottom = '1px solid #c0c0c0';
		hd.style.color = 'gray';
		mxUtils.write(hd, title);
		div.appendChild(hd);
	}

	var p2 = document.createElement('div');
	p2.style.padding = '6px';
	p2.innerHTML = message;
	div.appendChild(p2);
	
	var btns = document.createElement('div');
	btns.style.marginTop = '16px';
	btns.style.textAlign = 'right';
	
	if (retry != null)
	{
		var retryBtn = mxUtils.button(mxResources.get('tryAgain'), function()
		{
			editorUi.hideDialog();
			retry();
		});
		retryBtn.className = 'geBtn';
		btns.appendChild(retryBtn);
		
		btns.style.textAlign = 'center';
	}
	
	var btn = mxUtils.button(buttonText, function()
	{
		if (hide)
		{
			editorUi.hideDialog();
		}
		
		if (fn != null)
		{
			fn();
		}
	});
	btn.className = 'geBtn';
	
	btns.appendChild(btn);
	
	if (buttonText2 != null)
	{
		var mainBtn = mxUtils.button(buttonText2, function()
		{
			if (hide)
			{
				editorUi.hideDialog();
			}
			
			if (fn2 != null)
			{
				fn2();
			}
		});
		mainBtn.className = 'geBtn gePrimaryBtn';
		btns.appendChild(mainBtn);
	}
	
	this.init = function()
	{
		btn.focus();
	};
	
	div.appendChild(btns);

	this.container = div;
};

/**
 * Constructs a new embed dialog
 */
var EmbedHtmlDialog = function(editorUi)
{
	var file = editorUi.getCurrentFile();
	var div = document.createElement('div');

	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	var x0 = Math.floor(bounds.x / scale - graph.view.translate.x);
	var y0 = Math.floor(bounds.y / scale - graph.view.translate.y);

	mxUtils.write(div, mxResources.get('mainEmbedNotice') + ': ');
	mxUtils.br(div);
	
	var textarea = document.createElement('textarea');
	textarea.style.marginTop = '6px';
	textarea.style.width = '550px';
	textarea.style.height = '160px';
	textarea.style.marginBottom = '10px';
	textarea.style.resize = 'none';
	
	div.appendChild(textarea);
	mxUtils.br(div);

	mxUtils.write(div, mxResources.get('embedNotice') + ': ');
	mxUtils.br(div);

	var textarea2 = document.createElement('textarea');
	textarea2.style.marginTop = '6px';
	textarea2.style.width = '550px';
	textarea2.style.height = '20px';
	textarea2.style.resize = 'none';
	textarea2.style.marginBottom = '10px';
	div.appendChild(textarea2);

	mxUtils.br(div);
	mxUtils.write(div, mxResources.get('publicDiagramUrl') + ': ');
	
	var urlInput = document.createElement('input');
	urlInput.setAttribute('type', 'text');
	urlInput.setAttribute('size', '28');
	urlInput.style.width = '340px';
	urlInput.style.marginBottom = '8px';
	div.appendChild(urlInput);
	mxUtils.br(div);
	
	var options = document.createElement('div');
	options.style.paddingTop = '10px';
	options.style.textAlign = 'center';

	var fitCheckBox = document.createElement('input');
	fitCheckBox.setAttribute('type', 'checkbox');
	fitCheckBox.setAttribute('checked', 'checked');
	fitCheckBox.defaultChecked = true;
	options.appendChild(fitCheckBox);
	mxUtils.write(options, mxResources.get('fit'));

	var label = document.createElement('span');
	label.style.marginLeft = '10px';
	mxUtils.write(label, mxResources.get('zoom') + ': ');
	options.appendChild(label);
	
	var zoomInput = document.createElement('input');
	zoomInput.setAttribute('type', 'text');
	zoomInput.setAttribute('size', '4');
	zoomInput.style.width = '40px';
	zoomInput.value = '100%';
	options.appendChild(zoomInput);

	var label = document.createElement('span');
	label.style.marginLeft = '10px';
	mxUtils.write(label, mxResources.get('link') + ': ');
	options.appendChild(label);
	
	var borderColorInput = document.createElement('input');
	borderColorInput.setAttribute('type', 'text');
	borderColorInput.setAttribute('size', '8');
	borderColorInput.style.width = '50px';
	borderColorInput.value = '#0000ff';
	options.appendChild(borderColorInput);
	
	mxUtils.br(options);

	var lightboxCheckBox = document.createElement('input');
	lightboxCheckBox.setAttribute('type', 'checkbox');
	lightboxCheckBox.setAttribute('checked', 'checked');
	lightboxCheckBox.defaultChecked = true;
	lightboxCheckBox.style.marginTop = '14px';
	options.appendChild(lightboxCheckBox);
	mxUtils.write(options, mxResources.get('lightbox'));

	var editCheckBox = document.createElement('input');
	editCheckBox.setAttribute('type', 'checkbox');
	editCheckBox.setAttribute('checked', 'checked');
	editCheckBox.defaultChecked = true;
	editCheckBox.style.marginLeft = '10px';
	options.appendChild(editCheckBox);
	mxUtils.write(options, mxResources.get('edit'));

	var layersCheckBox = document.createElement('input');
	layersCheckBox.setAttribute('type', 'checkbox');
	layersCheckBox.style.marginLeft = '10px';
	
	var model = editorUi.editor.graph.getModel();

	if (editorUi.pages == null || editorUi.pages.length == 0 &&
		(model.getChildCount(model.getRoot()) <= 1))
	{
		layersCheckBox.setAttribute('disabled', 'disabled');
	}
	else
	{
		layersCheckBox.setAttribute('checked', 'checked');
		layersCheckBox.defaultChecked = true;
	}
	
	options.appendChild(layersCheckBox);
	mxUtils.write(options, mxResources.get('layers'));
	
	var zoomCheckBox = document.createElement('input');
	zoomCheckBox.setAttribute('type', 'checkbox');
	zoomCheckBox.style.marginLeft = '10px';
	options.appendChild(zoomCheckBox);
	mxUtils.write(options, mxResources.get('zoom'));
	
	zoomCheckBox.setAttribute('checked', 'checked');
	zoomCheckBox.defaultChecked = true;
	
	var pagesCheckBox = document.createElement('input');
	pagesCheckBox.setAttribute('type', 'checkbox');
	pagesCheckBox.style.marginLeft = '10px';

	if (editorUi.pages != null && editorUi.pages.length > 1)
	{
		pagesCheckBox.setAttribute('checked', 'checked');
		pagesCheckBox.defaultChecked = true;
		options.appendChild(pagesCheckBox);		
	}

	mxUtils.write(options, mxResources.get('allPages'));
	div.appendChild(options);

	function update(force)
	{
		var s = editorUi.getBasenames();
		var data = {};
		
		if (borderColorInput.value != '' && borderColorInput.value != mxConstants.NONE)
		{
			data.highlight = borderColorInput.value;
		}
		
		if (!lightboxCheckBox.checked)
		{
			data.lightbox = false;
		}
		
		data.nav = graph.foldingEnabled;
		var zoom = parseInt(zoomInput.value);
		
		if (!isNaN(zoom) && zoom != 100)
		{
			data.zoom = zoom / 100;
		}
		
		var tb = [];
		
		if (pagesCheckBox.checked)
		{
			tb.push('pages');
			data.resize = true;
			
			if (editorUi.pages != null && editorUi.currentPage != null)
			{
				data.page = mxUtils.indexOf(editorUi.pages, editorUi.currentPage);
			}
		}
		
		if (zoomCheckBox.checked)
		{
			tb.push('zoom');
			data.resize = true;
		}
		
		if (layersCheckBox.checked)
		{
			tb.push('layers');
		}
		
		if (tb.length > 0)
		{
			if (lightboxCheckBox)
			{
				tb.push('lightbox');
			}
			
			data.toolbar = tb.join(' ');
		}

		if (editCheckBox.checked)
		{
			if (urlInput.value != '')
			{
				data.edit = urlInput.value;
			}
			else
			{
				data.edit = '_blank';
			}
		}
		
		if (urlInput.value != '')
		{
			data.url = urlInput.value;
		}
		else
		{
			data.xml = editorUi.getFileData(true, null, null, null, null, !pagesCheckBox.checked);
		}
	
		textarea.value = '<div class="mxgraph" style="' +
			((fitCheckBox.checked) ? 'max-width:100%;' : '') +
			((tb != '') ? 'border:1px solid transparent;' : '') +
			'" data-mxgraph="' + mxUtils.htmlEntities(JSON.stringify(data)) + '"></div>';
	
		var s2 = (s.length > 0) ? (((urlParams['dev'] == '1') ?
			'https://test.draw.io/embed2.js?dev=1&s=' :
			'https://www.draw.io/embed2.js?s=') + s.join(';')) :
			(((urlParams['dev'] == '1') ?
			'https://test.draw.io/js/viewer.min.js' :
			'https://www.draw.io/js/viewer.min.js'));
	
		textarea2.value = '<script type="text/javascript" src="' + s2 + '"></script>';
		textarea.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			textarea.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};
	
	this.init = function()
	{
		update();
	};

	mxEvent.addListener(urlInput, 'change', update);
	mxEvent.addListener(borderColorInput, 'change', update);
	mxEvent.addListener(zoomInput, 'change', update);
	mxEvent.addListener(layersCheckBox, 'change', update);
	mxEvent.addListener(editCheckBox, 'change', update);
	mxEvent.addListener(fitCheckBox, 'change', update);
	mxEvent.addListener(lightboxCheckBox, 'change', update);
	mxEvent.addListener(zoomCheckBox, 'change', update);
	mxEvent.addListener(pagesCheckBox, 'change', update);
	
	var buttons = document.createElement('div');
	buttons.style.paddingTop = '20px';
	buttons.style.textAlign = 'right';
	
	if (!editorUi.isOffline())
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			window.open('https://desk.draw.io/solution/articles/16000042542-how-to-embed-html-');
		});
		
		helpBtn.className = 'geBtn';	
		buttons.appendChild(helpBtn);
	}

	// Loads forever in IE9
	if (!mxClient.IS_CHROMEAPP && !navigator.standalone && mxClient.IS_SVG &&
		(document.documentMode == null || document.documentMode > 9))
	{
		var previewBtn = mxUtils.button(mxResources.get('preview'), function()
		{
			var wnd = window.open();
			var doc = wnd.document;
	
			if (document.compatMode === 'CSS1Compat')
			{
				doc.writeln('<!DOCTYPE html>');
			}
			
			doc.writeln('<html>');
			doc.writeln('<head><title>' + encodeURIComponent(mxResources.get('preview')) +
				'</title><meta charset="utf-8"></head>');
			doc.writeln('<body>');
			doc.writeln(textarea.value);
			
			var direct = mxClient.IS_IE || mxClient.IS_EDGE || document.documentMode != null;
			
			if (direct)
			{
				doc.writeln(textarea2.value);
			}
			
			doc.writeln('</body>');
			doc.writeln('</html>');
			doc.close();
	
			// Adds script tag after closing page and delay to fix timing issues
			if (!direct)
			{
				var info = wnd.document.createElement('div');
				info.marginLeft = '26px';
				info.marginTop = '26px';
				mxUtils.write(info, mxResources.get('updatingDocument'));

				var img = wnd.document.createElement('img');
				img.setAttribute('src', window.location.protocol + '//' + window.location.hostname +
					'/' + IMAGE_PATH + '/spin.gif');
				img.style.marginLeft = '6px';
				info.appendChild(img);
				
				wnd.document.body.insertBefore(info, wnd.document.body.firstChild);
				
				window.setTimeout(function()
				{
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = /<script.*?src="(.*?)"/.exec(textarea2.value)[1];
					doc.body.appendChild(script);
					
					info.parentNode.removeChild(info);
				}, 20);
			}
		});
		
		previewBtn.className = 'geBtn';
		buttons.appendChild(previewBtn);
	}

	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});
	
	var copyBtn = mxUtils.button(mxResources.get('copy'), function()
	{
		textarea.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			textarea.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
		
		document.execCommand('copy');
		editorUi.alert(mxResources.get('copiedToClipboard'));
	});

	buttons.appendChild(closeBtn);

	// Does not work in Safari and shows annoying dialog for IE11-
	if (!mxClient.IS_SF && document.documentMode == null)
	{
		buttons.appendChild(copyBtn);
		copyBtn.className = 'geBtn gePrimaryBtn';
		closeBtn.className = 'geBtn';
	}
	else
	{
		closeBtn.className = 'geBtn gePrimaryBtn';
	}
	
	div.appendChild(buttons);
	
	this.container = div;
};

/**
 * Constructs a new embed dialog
 */
var EmbedSvgDialog = function(editorUi, isImage)
{
	var file = editorUi.getCurrentFile();
	var div = document.createElement('div');

	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	var x0 = Math.floor(bounds.x / scale - graph.view.translate.x);
	var y0 = Math.floor(bounds.y / scale - graph.view.translate.y);

	mxUtils.write(div, mxResources.get('mainEmbedNotice') + ': ');
	mxUtils.br(div);
	
	var textarea = document.createElement('textarea');
	textarea.style.marginTop = '6px';
	textarea.style.width = '550px';
	textarea.style.height = '280px';
	textarea.style.resize = 'none';

	div.appendChild(textarea);
	mxUtils.br(div);

	var options = document.createElement('div');
	options.style.paddingTop = '16px';
	options.style.textAlign = 'center';

	var fitCheckBox = document.createElement('input');
	fitCheckBox.setAttribute('type', 'checkbox');
	fitCheckBox.setAttribute('checked', 'checked');
	fitCheckBox.defaultChecked = true;
	options.appendChild(fitCheckBox);
	mxUtils.write(options, mxResources.get('fit'));

	var shadowCheckBox = document.createElement('input');
	shadowCheckBox.setAttribute('type', 'checkbox');
	shadowCheckBox.style.marginLeft = '10px';
	
	if (graph.shadowVisible)
	{
		shadowCheckBox.setAttribute('checked', 'checked');
		shadowCheckBox.defaultChecked = true;
	}
	
	if (!isImage || editorUi.isExportToCanvas())
	{
		options.appendChild(shadowCheckBox);
		mxUtils.write(options, mxResources.get('shadow'));
	}
	
	var imageCheckBox = document.createElement('input');
	imageCheckBox.setAttribute('type', 'checkbox');
	imageCheckBox.style.marginLeft = '10px';
	
	if (!isImage)
	{
		options.appendChild(imageCheckBox);
		mxUtils.write(options, mxResources.get('image'));
	}
	
	var retinaCheckBox = document.createElement('input');
	retinaCheckBox.setAttribute('type', 'checkbox');
	retinaCheckBox.style.marginLeft = '10px';
	
	if (isImage)
	{
		options.appendChild(retinaCheckBox);
		mxUtils.write(options, mxResources.get('retina'));
	}
	
	var lightboxCheckBox = document.createElement('input');
	lightboxCheckBox.setAttribute('type', 'checkbox');
	lightboxCheckBox.setAttribute('checked', 'checked');
	lightboxCheckBox.defaultChecked = true;
	lightboxCheckBox.style.marginLeft = '10px';
	options.appendChild(lightboxCheckBox);
	mxUtils.write(options, mxResources.get('lightbox'));
	
	var editCheckBox = document.createElement('input');
	editCheckBox.setAttribute('type', 'checkbox');
	editCheckBox.setAttribute('checked', 'checked');
	editCheckBox.defaultChecked = true;
	editCheckBox.style.marginLeft = '10px';
	options.appendChild(editCheckBox);
	mxUtils.write(options, mxResources.get('edit'));

	var layersCheckBox = document.createElement('input');
	layersCheckBox.setAttribute('type', 'checkbox');
	layersCheckBox.style.marginLeft = '10px';
	
	var model = editorUi.editor.graph.getModel();
	
	if (model.getChildCount(model.getRoot()) > 1)
	{
		layersCheckBox.setAttribute('checked', 'checked');
		layersCheckBox.defaultChecked = true;
	}
	else
	{
		layersCheckBox.setAttribute('disabled', 'disabled');
	}

	options.appendChild(layersCheckBox);
	mxUtils.write(options, mxResources.get('layers'));
	
	div.appendChild(options);

	function update(force)
	{
		if (isImage)
		{
			var bounds = editorUi.editor.graph.getGraphBounds();
			
			function doUpdate(dataUri)
			{
	   			var onclick = ' ';
	   			var css = '';
	   			
	   			// Adds double click handling
				if (lightboxCheckBox.checked)
				{
					// KNOWN: Message passing does not seem to work in IE11
					onclick = " onclick=\"(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(" +
						"img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://www.draw.io/?client=1&lightbox=1&chrome=0" +
						((editCheckBox.checked) ? "&edit=_blank" : "") +
						((layersCheckBox.checked) ? '&layers=1' : '') + "');}})(this);\"";
					css += 'cursor:pointer;';
				}
	   			
				if (fitCheckBox.checked)
				{
					css += 'max-width:100%;';
				}
				
				var atts = '';
				
				if (retinaCheckBox.checked)
				{
					atts = ' width="' + Math.round(bounds.width) + '" height="' + Math.round(bounds.height) + '"';
				}

		   		textarea.value = '<img src="' + dataUri + '"' + atts +
		   			((css != '') ? ' style="' + css + '"' : '') +
		   			onclick + '/>';
				textarea.focus();

				if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
				{
					textarea.select();
				}
				else
				{
					document.execCommand('selectAll', false, null);
				}
			};
			
			if (editorUi.isExportToCanvas())
			{
				var scale = 1;
				var ignoreSelection = true;
				textarea.value = mxResources.get('updatingDocument');

				editorUi.exportToCanvas(mxUtils.bind(this, function(canvas)
			   	{
		   			var xml = (lightboxCheckBox.checked) ? editorUi.getFileData(true) : null;
		   			var data = editorUi.createPngDataUri(canvas, xml);
		   			doUpdate(data);
			   	}), null, null, null, mxUtils.bind(this, function(e)
			   	{
					textarea.value = '';
					editorUi.handleError({message: mxResources.get('unknownError')});
			   	}), null, true, (retinaCheckBox.checked) ? 2 : 1, null, shadowCheckBox.checked);
			}
			else
			{
				var data = editorUi.getFileData(true);
				
				if (bounds.width * bounds.height <= MAX_AREA && data.length <= MAX_REQUEST_SIZE)
				{
					textarea.value = mxResources.get('updatingDocument');
					var size = '';
					
					if (retinaCheckBox.checked)
					{
						size = '&w=' + Math.round(2 * bounds.width) +
							'&h=' + Math.round(2 * bounds.height);
					}
					
					var embed = (lightboxCheckBox.checked) ? '1' : '0';
					var req = new mxXmlRequest(EXPORT_URL, 'format=png' +
						'&base64=1&embedXml=' + embed + size + '&xml=' +
						encodeURIComponent(data));
					
					// LATER: Updates on each change, add a delay
					req.send(mxUtils.bind(this, function()
					{
						if (req.getStatus() == 200)
						{
							// Fixes possible "incorrect function" for select() on
							// DOM node which is no longer in document with IE11
							if (document.body.contains(div))
							{
								doUpdate('data:image/png;base64,' + req.getText());
							}
						}
						else
						{
							textarea.value = '';
							editorUi.handleError({message: mxResources.get('unknownError')});
						}
					}));
				}
				else
				{
					textarea.value = '';
					editorUi.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'));
				}
			}
		}
		else
		{
			var svgRoot = editorUi.editor.graph.getSvg();
			
			// Keeps hashtag links on same page
			var links = svgRoot.getElementsByTagName('a');
			
			if (links != null)
			{
				for (var i = 0; i < links.length; i++)
				{
					var href = links[i].getAttribute('href');
					
					if (href != null && href.charAt(0) == '#' &&
						links[i].getAttribute('target') == '_blank')
					{
						links[i].removeAttribute('target');
					}
				}
			}
			
			if (lightboxCheckBox.checked)
			{
				svgRoot.setAttribute('content', editorUi.getFileData(true));
			}
			
			// Adds shadow filter
			if (shadowCheckBox.checked)
			{
				editorUi.editor.addSvgShadow(svgRoot);
			}
			
			// SVG inside image tag
			if (imageCheckBox.checked)
			{
	   			var onclick = ' ';
	   			var css = '';
	   			
	   			// Adds double click handling
				if (lightboxCheckBox.checked)
				{
					// KNOWN: Message passing does not seem to work in IE11
					onclick = "onclick=\"(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(" +
						"img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://www.draw.io/?client=1&lightbox=1&chrome=0" +
						((editCheckBox.checked) ? "&edit=_blank" : "") +
						((layersCheckBox.checked) ? '&layers=1' : '') + "');}})(this);\"";
					css += 'cursor:pointer;';
				}
	   			
				if (fitCheckBox.checked)
				{
					css += 'max-width:100%;';
				}
	   			
	   			// Images inside IMG don't seem to work so embed them all
				editorUi.convertImages(svgRoot, function(svgRoot)
				{
					textarea.value = '<img src="' + editorUi.createSvgDataUri(mxUtils.getXml(svgRoot)) + '"' +
						((css != '') ? ' style="' + css + '"' : '') + onclick + '/>';
				});
			}
			else
			{
				var css = '';
				
				// Adds double click handling
				if (lightboxCheckBox.checked)
				{
					// KNOWN: Message passing does not seem to work in IE11
					var js = "(function(svg){var src=window.event.target||window.event.srcElement;" +
						// Ignores link events
						"while (src!=null&&src.nodeName.toLowerCase()!='a'){src=src.parentNode;}if(src==null)" +
						// Focus existing lightbox
						"{if(svg.wnd!=null&&!svg.wnd.closed){svg.wnd.focus();}else{var r=function(evt){" +
						// Message handling
						"if(evt.data=='ready'&&evt.source==svg.wnd){svg.wnd.postMessage(decodeURIComponent(" +
						"svg.getAttribute('content')),'*');window.removeEventListener('message',r);}};" +
						"window.addEventListener('message',r);" +
						// Opens lightbox window
						"svg.wnd=window.open('https://www.draw.io/?client=1&lightbox=1&chrome=0" +
						((editCheckBox.checked) ? "&edit=_blank" : "") +
						((layersCheckBox.checked) ? '&layers=1' : '') + "');}}})(this);";
					svgRoot.setAttribute('onclick', js);
					css += 'cursor:pointer;';
				}
				
				// Adds responsive size
				if (fitCheckBox.checked)
				{
					var w = parseInt(svgRoot.getAttribute('width'));
					var h = parseInt(svgRoot.getAttribute('height'));
					svgRoot.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
					css += 'max-width:100%;max-height:' + h + 'px;';
					svgRoot.removeAttribute('height');
				}
				
				if (css != '')
				{
					svgRoot.setAttribute('style', css);
				}

				textarea.value = mxUtils.getXml(svgRoot);
			}

			textarea.focus();
			
			if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
			{
				textarea.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
	};
	
	this.init = function()
	{
		update();
	};
	
	mxEvent.addListener(imageCheckBox, 'change', update);
	mxEvent.addListener(retinaCheckBox, 'change', update);
	mxEvent.addListener(shadowCheckBox, 'change', update);
	mxEvent.addListener(fitCheckBox, 'change', update);
	mxEvent.addListener(lightboxCheckBox, 'change', update);
	mxEvent.addListener(editCheckBox, 'change', update);
	mxEvent.addListener(layersCheckBox, 'change', update);
	
	var buttons = document.createElement('div');
	buttons.style.paddingTop = '18px';
	buttons.style.textAlign = 'right';
	
	if (!editorUi.isOffline() && !isImage)
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			window.open('https://desk.draw.io/solution/articles/16000042548-how-to-embed-svg-');
		});
		
		helpBtn.className = 'geBtn';	
		buttons.appendChild(helpBtn);
	}

	// Loads forever in IE9
	if (!mxClient.IS_CHROMEAPP && !navigator.standalone && mxClient.IS_SVG &&
		(document.documentMode == null || document.documentMode > 9))
	{
		var previewBtn = mxUtils.button(mxResources.get('preview'), function()
		{
			var wnd = window.open();
			var doc = wnd.document;
			doc.writeln('<html><head><title>' + encodeURIComponent(mxResources.get('preview')) +
					'</title><meta charset="utf-8"></head>' +
					'<body>' + textarea.value + '</body></html>');
			doc.close();
		});
		
		previewBtn.className = 'geBtn';
		buttons.appendChild(previewBtn);
	}

	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});
	
	var copyBtn = mxUtils.button(mxResources.get('copy'), function()
	{
		textarea.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			textarea.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
		
		document.execCommand('copy');
		editorUi.alert(mxResources.get('copiedToClipboard'));
	});

	buttons.appendChild(closeBtn);

	// Does not work in Safari and shows annoying dialog for IE11-
	if (!mxClient.IS_SF && document.documentMode == null)
	{
		buttons.appendChild(copyBtn);
		copyBtn.className = 'geBtn gePrimaryBtn';
		closeBtn.className = 'geBtn';
	}
	else
	{
		closeBtn.className = 'geBtn gePrimaryBtn';
	}
	
	div.appendChild(buttons);
	
	this.container = div;
};

/**
 * Constructs a dialog for embedding the diagram in Google Sites.
 */
var GoogleSitesDialog = function(editorUi)
{
	var div = document.createElement('div');

	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	var x0 = Math.floor(bounds.x / scale - graph.view.translate.x);
	var y0 = Math.floor(bounds.y / scale - graph.view.translate.y);

	mxUtils.write(div, mxResources.get('googleGadget') + ':');
	mxUtils.br(div);
	
	var gadgetInput = document.createElement('input');
	gadgetInput.setAttribute('type', 'text');
	gadgetInput.style.marginBottom = '8px';
	gadgetInput.style.marginTop = '2px';
	gadgetInput.style.width = '410px';
	div.appendChild(gadgetInput);
	mxUtils.br(div);
	
	this.init = function()
	{
		gadgetInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			gadgetInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};
	
	mxUtils.write(div, mxResources.get('top') + ':');
	var topInput = document.createElement('input');
	topInput.setAttribute('type', 'text');
	topInput.setAttribute('size', '4');
	topInput.style.marginRight = '16px';
	topInput.style.marginLeft = '4px';
	topInput.value = x0;
	div.appendChild(topInput);
	
	mxUtils.write(div, mxResources.get('height') + ':');
	var heightInput = document.createElement('input');
	heightInput.setAttribute('type', 'text');
	heightInput.setAttribute('size', '4');
	heightInput.style.marginLeft = '4px';
	heightInput.value = Math.ceil(bounds.height / scale);
	div.appendChild(heightInput);
	mxUtils.br(div);
	
	var hr = document.createElement('hr');
	hr.setAttribute('size', '1');
	hr.style.marginBottom = '16px';
	hr.style.marginTop = '16px';
	div.appendChild(hr);
	
	mxUtils.write(div, mxResources.get('publicDiagramUrl') + ':');
	mxUtils.br(div);
	
	var urlInput = document.createElement('input');
	urlInput.setAttribute('type', 'text');
	urlInput.setAttribute('size', '28');
	urlInput.style.marginBottom = '8px';
	urlInput.style.marginTop = '2px';
	urlInput.style.width = '410px';
	div.appendChild(urlInput);
	mxUtils.br(div);

	mxUtils.write(div, mxResources.get('borderWidth') + ':');
	var borderInput = document.createElement('input');
	borderInput.setAttribute('type', 'text');
	borderInput.setAttribute('size', '3');
	borderInput.style.marginBottom = '8px';
	borderInput.style.marginLeft = '4px';
	borderInput.value = '0';
	div.appendChild(borderInput);
	mxUtils.br(div);

	var panCheckBox = document.createElement('input');
	panCheckBox.setAttribute('type', 'checkbox');
	panCheckBox.setAttribute('checked', 'checked');
	panCheckBox.defaultChecked = true;
	panCheckBox.style.marginLeft = '16px';
	div.appendChild(panCheckBox);
	mxUtils.write(div, mxResources.get('pan') + ' ');

	var zoomCheckBox = document.createElement('input');
	zoomCheckBox.setAttribute('type', 'checkbox');
	zoomCheckBox.setAttribute('checked', 'checked');
	zoomCheckBox.defaultChecked = true;
	zoomCheckBox.style.marginLeft = '8px';
	div.appendChild(zoomCheckBox);
	mxUtils.write(div, mxResources.get('zoom') + ' ');
	
	var editCheckBox = document.createElement('input');
	editCheckBox.setAttribute('type', 'checkbox');
	editCheckBox.style.marginLeft = '8px';
	editCheckBox.setAttribute('title', window.location.href);
	div.appendChild(editCheckBox);
	mxUtils.write(div, mxResources.get('edit') + ' ');
	
	var editBlankCheckBox = document.createElement('input');
	editBlankCheckBox.setAttribute('type', 'checkbox');
	editBlankCheckBox.style.marginLeft = '8px';
	div.appendChild(editBlankCheckBox);
	mxUtils.write(div, mxResources.get('asNew') + ' ');
	mxUtils.br(div);

	var resizeCheckBox = document.createElement('input');
	resizeCheckBox.setAttribute('type', 'checkbox');
	resizeCheckBox.setAttribute('checked', 'checked');
	resizeCheckBox.defaultChecked = true;
	resizeCheckBox.style.marginLeft = '16px';
	div.appendChild(resizeCheckBox);
	mxUtils.write(div, mxResources.get('resize') + ' ');
	
	var fitCheckBox = document.createElement('input');
	fitCheckBox.setAttribute('type', 'checkbox');
	fitCheckBox.style.marginLeft = '8px';
	div.appendChild(fitCheckBox);
	mxUtils.write(div, mxResources.get('fit') + ' ');
	
	var embedCheckBox = document.createElement('input');
	embedCheckBox.setAttribute('type', 'checkbox');
	embedCheckBox.style.marginLeft = '8px';
	div.appendChild(embedCheckBox);
	mxUtils.write(div, mxResources.get('embed') + ' ');

	var node = null;
	var s = editorUi.getBasenames().join(';');
	var file = editorUi.getCurrentFile();

	function update()
	{
		var title = (file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		
		if (embedCheckBox.checked && urlInput.value != '')
		{
			var encUrl = encodeURIComponent(mxUtils.htmlEntities(urlInput.value));
			var gurl = 'https://www.draw.io/gadget.xml?type=4&diagram=' + encUrl;
			
			if (title != null)
			{
				gurl += '&title=' + encodeURIComponent(title);
			}
			
			if (s.length > 0)
			{
				gurl += '&s=' + s;
			}
			
			if (borderInput.value != '' && borderInput.value != '0')
			{
				gurl += '&border=' + borderInput.value;
			}
		
			if (heightInput.value != '')
			{
				gurl += '&height=' + heightInput.value;
			}
			
			gurl += '&pan=' + ((panCheckBox.checked) ? '1': '0');
			gurl += '&zoom=' + ((zoomCheckBox.checked) ? '1': '0');
			gurl += '&fit=' + ((fitCheckBox.checked) ? '1': '0');
			gurl += '&resize=' + ((resizeCheckBox.checked) ? '1': '0');
			gurl += '&x0=' + Number(topInput.value);
			gurl += '&y0=' + y0;
			
			if (graph.mathEnabled)
			{
				gurl += '&math=1';
			}
			
			if (editBlankCheckBox.checked)
			{
				gurl += '&edit=_blank';
			}
			else if (editCheckBox.checked)
			{
				gurl += '&edit=' + encodeURIComponent(mxUtils.htmlEntities(window.location.href));
			}
			
			gadgetInput.value = gurl;
		}
		else if (file.constructor == DriveFile || file.constructor == DropboxFile)
		{
			var gurl = 'https://www.draw.io/gadget.xml?embed=0&diagram=';
			
			if (urlInput.value != '')
			{
				gurl += encodeURIComponent(mxUtils.htmlEntities(urlInput.value)) + '&type=3';
			}
			else
			{
				gurl += file.getHash().substring(1);
				
				if (file.constructor == DropboxFile)
				{
					gurl += '&type=2';
				}
				else
				{
					gurl += '&type=1';
				}
			}
			
			if (title != null)
			{
				gurl += '&title=' + encodeURIComponent(title);
			}
			
			if (heightInput.value != '')
			{
				var h = parseInt(heightInput.value) + parseInt(topInput.value);
				gurl += '&height=' + h;
			}

			gadgetInput.value = gurl;
		}
		else
		{
			gadgetInput.value = '';
		}
	};
	
	// Tries to generate public image URL (only for Drive files)
	update();
	urlInput.setAttribute('placeholder', mxResources.get('loading') + '...');
	
	editorUi.getPublicUrl(file, function(url)
	{
		urlInput.setAttribute('placeholder', '');
		urlInput.value = (url != null) ? url : '';
		update();
	});
	
	mxEvent.addListener(panCheckBox, 'change', update);
	mxEvent.addListener(zoomCheckBox, 'change', update);
	mxEvent.addListener(resizeCheckBox, 'change', update);
	mxEvent.addListener(fitCheckBox, 'change', update);
	mxEvent.addListener(editCheckBox, 'change', update);
	mxEvent.addListener(editBlankCheckBox, 'change', update);
	mxEvent.addListener(embedCheckBox, 'change', update);
	mxEvent.addListener(heightInput, 'change', update);
	mxEvent.addListener(topInput, 'change', update);
	mxEvent.addListener(borderInput, 'change', update);
	mxEvent.addListener(urlInput, 'change', update);
	
	mxEvent.addListener(gadgetInput, 'click', function()
	{
		gadgetInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			gadgetInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	});
	
	var buttons = document.createElement('div');
	buttons.style.paddingTop = '12px';
	buttons.style.textAlign = 'right';

	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});
	closeBtn.className = 'geBtn gePrimaryBtn';
	buttons.appendChild(closeBtn);
	
	div.appendChild(buttons);
	
	this.container = div;
};

/**
 * Constructs a dialog for embedding the diagram in Google Sites.
 */
var IframeDialog = function(editorUi, image, link)
{
	var div = document.createElement('div');

	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	var x0 = Math.floor(bounds.x / scale - graph.view.translate.x);
	var y0 = Math.floor(bounds.y / scale - graph.view.translate.y);

	mxUtils.write(div, mxResources.get((link) ? 'link' : 'mainEmbedNotice') + ': ');
	mxUtils.br(div);
	
	var iframeInput = document.createElement('input');
	iframeInput.setAttribute('type', 'text');
	iframeInput.style.marginBottom = '8px';
	iframeInput.style.marginTop = '2px';
	iframeInput.style.width = '410px';
	div.appendChild(iframeInput);
	mxUtils.br(div);
	
	this.init = function()
	{
		if (iframeInput.getAttribute('disabled') != 'disabled')
		{
			iframeInput.focus();
			
			if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
			{
				iframeInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
	};

	var widthInput = document.createElement('input');
	widthInput.setAttribute('type', 'text');
	widthInput.style.marginRight = '16px';
	widthInput.style.width = '60px';
	widthInput.style.marginBottom = '8px';
	widthInput.style.marginLeft = '4px';
	widthInput.value = '100%';
	
	if (!image && !link)
	{
		mxUtils.write(div, mxResources.get('width') + ':');
		div.appendChild(widthInput);
	}
	
	var heightInput = document.createElement('input');
	heightInput.setAttribute('type', 'text');
	heightInput.style.width = '60px';
	heightInput.style.marginLeft = '4px';
	heightInput.value = (Math.ceil((bounds.y + bounds.height - graph.view.translate.y) / scale) + 2) + 'px';

	var lightboxCheckBox = document.createElement('input');
	lightboxCheckBox.setAttribute('type', 'checkbox');

	var editCheckBox = document.createElement('input');
	editCheckBox.setAttribute('type', 'checkbox');

	var layersCheckBox = document.createElement('input');
	layersCheckBox.setAttribute('type', 'checkbox');
	
	if (!image)
	{
		if (!link)
		{
			mxUtils.write(div, mxResources.get('height') + ':');
			div.appendChild(heightInput);
			
			mxUtils.br(div);
		}
		
		lightboxCheckBox.setAttribute('checked', 'checked');
		lightboxCheckBox.defaultChecked = true;
		div.appendChild(lightboxCheckBox);
		mxUtils.write(div, mxResources.get('lightbox'));

		layersCheckBox.style.marginLeft = '16px';
		var model = editorUi.editor.graph.getModel();
		
		if (model.getChildCount(model.getRoot()) > 1)
		{
			layersCheckBox.setAttribute('checked', 'checked');
			layersCheckBox.defaultChecked = true;
		}
		else
		{
			layersCheckBox.setAttribute('disabled', 'disabled');
		}
		
		div.appendChild(layersCheckBox);
		mxUtils.write(div, mxResources.get('layers'));

		editCheckBox.style.marginLeft = '16px';
		editCheckBox.setAttribute('checked', 'checked');
		editCheckBox.defaultChecked = true;
		div.appendChild(editCheckBox);
		mxUtils.write(div, mxResources.get('edit'));
		
		mxUtils.br(div);
	}
	
	var hr = document.createElement('hr');
	hr.setAttribute('size', '1');
	hr.style.marginBottom = '16px';
	hr.style.marginTop = '16px';
	div.appendChild(hr);

	mxUtils.write(div, mxResources.get('publicDiagramUrl') + ':');
	mxUtils.br(div);
	
	var urlInput = document.createElement('input');
	urlInput.setAttribute('type', 'text');
	urlInput.setAttribute('size', '28');
	urlInput.style.marginBottom = '8px';
	urlInput.style.marginTop = '2px';
	urlInput.style.width = '410px';
	div.appendChild(urlInput);
	mxUtils.br(div);

	var node = null;

	var previewBtn = mxUtils.button(mxResources.get('preview'), function()
	{
		if (image || link)
		{
			window.open(iframeInput.value);
		}
		else
		{
			var wnd = window.open();
			var doc = wnd.document;
			
			if (document.compatMode === 'CSS1Compat')
			{
				doc.writeln('<!DOCTYPE html>');
			}
			
			doc.writeln('<head><title>' + encodeURIComponent(mxResources.get('preview')) +
					'</title><meta charset="utf-8"></head>');
			doc.writeln('<body>');
			doc.writeln(iframeInput.value);
			doc.writeln('</body>');
			doc.writeln('</html>');
			doc.close();
		}
	});
	
	previewBtn.className = 'geBtn';
	
	var copyBtn = mxUtils.button(mxResources.get('copy'), function()
	{
		iframeInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			iframeInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
		
		document.execCommand('copy');
		editorUi.alert(mxResources.get('copiedToClipboard'));
	});

	var file = editorUi.getCurrentFile();
	
	function update()
	{
		var title = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		
		if (link && file != null && (urlInput.value != '' || file.constructor == DriveFile ||
			file.constructor == DropboxFile || file.constructor == OneDriveFile))
		{
			previewBtn.removeAttribute('disabled');
			copyBtn.removeAttribute('disabled');
			var gurl = 'https://www.draw.io/?chrome=0';
			
			if (lightboxCheckBox.checked)
			{
				gurl += '&lightbox=1';
			}
			
			if (editCheckBox.checked)
			{
				gurl += '&edit=' + encodeURIComponent(mxUtils.htmlEntities('https://www.draw.io/#' + file.getHash()));
			}
			
			if (graph.foldingEnabled)
			{
				gurl += '&nav=1';
			}
			
			if (layersCheckBox.checked)
			{
				gurl += '&layers=1';
			}

			if (urlInput.value != '')
			{
				gurl += '&url=' + encodeURIComponent(mxUtils.htmlEntities(urlInput.value));
			}
			else
			{
				gurl += '#' + file.getHash();
			}
			
			iframeInput.value = gurl;
			iframeInput.removeAttribute('disabled');
		}
		else if (urlInput.value != '')
		{
			previewBtn.removeAttribute('disabled');
			copyBtn.removeAttribute('disabled');
			var encUrl = encodeURIComponent(mxUtils.htmlEntities(urlInput.value));
			
			if (image)
			{
				var gurl = EXPORT_URL + '?format=png&url=' + encUrl;

				iframeInput.value = gurl;
			}
			else
			{
				var gurl = 'https://www.draw.io/?chrome=0';
				
				if (lightboxCheckBox.checked)
				{
					gurl += '&lightbox=1';
				}
				
				if (editCheckBox.checked)
				{
					gurl += '&edit=' + encUrl;
				}
				
				if (graph.foldingEnabled)
				{
					gurl += '&nav=1';
				}
				
				if (layersCheckBox.checked)
				{
					gurl += '&layers=1';
				}
				
				gurl += '&url=' + encUrl;

				iframeInput.value = '<iframe frameborder="0" style="width:' + widthInput.value + ';height:' +
					heightInput.value + '" src="' + gurl + '"></iframe>';
			}

			iframeInput.removeAttribute('disabled');
		}
		else if (!image && !link && file != null && (file.constructor == DriveFile ||
			file.constructor == DropboxFile || file.constructor == OneDriveFile))
		{
			previewBtn.removeAttribute('disabled');
			copyBtn.removeAttribute('disabled');
			var gurl = 'https://www.draw.io/?chrome=0';
			
			if (lightboxCheckBox.checked)
			{
				gurl += '&lightbox=1';
			}
			
			if (editCheckBox.checked)
			{
				gurl += '&edit=' + encodeURIComponent(mxUtils.htmlEntities('https://www.draw.io/#' + file.getHash()));
			}
			
			if (graph.foldingEnabled)
			{
				gurl += '&nav=1';
			}
			
			if (layersCheckBox.checked)
			{
				gurl += '&layers=1';
			}

			gurl += '#' + file.getHash();
			
			iframeInput.value = '<iframe frameborder="0" style="width:' + widthInput.value + ';height:' +
				heightInput.value + '" src="' + gurl + '"></iframe>';
			iframeInput.removeAttribute('disabled');
		}
		else
		{
			previewBtn.setAttribute('disabled', 'disabled');
			copyBtn.setAttribute('disabled', 'disabled');
			iframeInput.value = mxResources.get('invalidPublicUrl');
			iframeInput.setAttribute('disabled', 'disabled');
		}
	};
	
	// Tries to generate public image URL (only for Drive files)
	update();
	urlInput.setAttribute('placeholder', mxResources.get('loading') + '...');
	
	editorUi.getPublicUrl(file, function(url)
	{
		urlInput.setAttribute('placeholder', '');
		urlInput.value = (url != null) ? url : '';
		update();
	});
		
	mxEvent.addListener(widthInput, 'change', update);
	mxEvent.addListener(heightInput, 'change', update);
	mxEvent.addListener(layersCheckBox, 'change', update);
	mxEvent.addListener(lightboxCheckBox, 'change', update);
	mxEvent.addListener(editCheckBox, 'change', update);
	mxEvent.addListener(urlInput, 'change', update);
	
	mxEvent.addListener(iframeInput, 'click', function()
	{
		iframeInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			iframeInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	});
	
	var buttons = document.createElement('div');
	buttons.style.paddingTop = '12px';
	buttons.style.textAlign = 'right';

	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});

	if (image || (!mxClient.IS_QUIRKS && !navigator.standalone &&
		(!window.chrome || !chrome.app || !chrome.app.runtime) &&
		(document.documentMode == null || document.documentMode >= 9)))
	{
		buttons.appendChild(previewBtn);
	}
	
	buttons.appendChild(closeBtn);

	// Does not work in Safari and shows annoying dialog for IE11-
	if (!mxClient.IS_SF && document.documentMode == null)
	{
		buttons.appendChild(copyBtn);
		copyBtn.className = 'geBtn gePrimaryBtn';
		closeBtn.className = 'geBtn';
	}
	else
	{
		closeBtn.className = 'geBtn gePrimaryBtn';
	}
	
	div.appendChild(buttons);
	
	this.container = div;
};

/**
 * Constructs a new parse dialog.
 */
var CreateGraphDialog = function(editorUi, title, type)
{
	var div = document.createElement('div');
	div.style.textAlign = 'right';
	
	this.init = function()
	{
		var container = document.createElement('div');
		container.style.position = 'relative';
		container.style.border = '1px solid gray';
		container.style.width = '100%';
		container.style.height = '360px';
		container.style.overflow = 'hidden';
		container.style.marginBottom = '16px';
		mxEvent.disableContextMenu(container);
		div.appendChild(container);
	
		var graph = new Graph(container);
		
		graph.setCellsCloneable(true);
		graph.setPanning(true);
		graph.setAllowDanglingEdges(false);
		graph.connectionHandler.select = false;
		graph.view.setTranslate(20, 20);
		graph.border = 20;
		graph.panningHandler.useLeftButtonForPanning = true;
		
		var vertexStyle = 'rounded=1;';
		var edgeStyle = 'curved=1;';
		var startStyle = 'ellipse';
		
		// FIXME: Does not work in iPad
		var mxCellRendererInstallCellOverlayListeners = mxCellRenderer.prototype.installCellOverlayListeners;
		graph.cellRenderer.installCellOverlayListeners = function(state, overlay, shape)
		{
			mxCellRenderer.prototype.installCellOverlayListeners.apply(this, arguments);
			
			mxEvent.addListener(shape.node, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', function (evt)
			{
				overlay.fireEvent(new mxEventObject('pointerdown', 'event', evt, 'state', state));
			});
			
			if (!mxClient.IS_POINTER && mxClient.IS_TOUCH)
			{
				mxEvent.addListener(shape.node, 'touchstart', function (evt)
				{
					overlay.fireEvent(new mxEventObject('pointerdown', 'event', evt, 'state', state));
				});
			}
		};

		graph.getAllConnectionConstraints = function()
		{
			return null;
		};

		// Keeps highlight behind overlays
		graph.connectionHandler.marker.highlight.keepOnTop = false;
	
		graph.connectionHandler.createEdgeState = function(me)
		{
			var edge = graph.createEdge(null, null, null, null, null, edgeStyle);
			
			return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
		};
	
		// Gets the default parent for inserting new cells. This
		// is normally the first child of the root (ie. layer 0).
		var parent = graph.getDefaultParent();
		
		var addOverlay = mxUtils.bind(this, function(cell)
		{
			// Creates a new overlay with an image and a tooltip
			var overlay = new mxCellOverlay(this.connectImage, 'Add outgoing');
			overlay.cursor = 'hand';
	
			// Installs a handler for clicks on the overlay							
			overlay.addListener(mxEvent.CLICK, function(sender, evt2)
			{
				// TODO: Add menu for picking next shape
				graph.connectionHandler.reset();
				graph.clearSelection();
				var geo = graph.getCellGeometry(cell);
				
				var v2;
				
				executeLayout(function()
				{
					v2 = graph.insertVertex(parent, null, 'Entry', geo.x, geo.y, 80, 30, vertexStyle);
					addOverlay(v2);
					graph.view.refresh(v2);
					var e1 = graph.insertEdge(parent, null, '', cell, v2, edgeStyle);
				}, function()
				{
					graph.scrollCellToVisible(v2);
				});
			});
			
			// FIXME: Does not work in iPad (inserts loop)
			overlay.addListener('pointerdown', function(sender, eo)
			{
				var evt2 = eo.getProperty('event');
				var state = eo.getProperty('state');
				
				graph.popupMenuHandler.hideMenu();
				graph.stopEditing(false);
				
				var pt = mxUtils.convertPoint(graph.container,
						mxEvent.getClientX(evt2), mxEvent.getClientY(evt2));
				graph.connectionHandler.start(state, pt.x, pt.y);
				graph.isMouseDown = true;
				graph.isMouseTrigger = mxEvent.isMouseEvent(evt2);
				mxEvent.consume(evt2);
			});
			
			// Sets the overlay for the cell in the graph
			graph.addCellOverlay(cell, overlay);
		});
						
		// Adds cells to the model in a single step
		graph.getModel().beginUpdate();
		var v1;
		try
		{
			v1 = graph.insertVertex(parent, null, 'Start', 0, 0, 80, 30, startStyle);
			addOverlay(v1);
		}
		finally
		{
			// Updates the display
			graph.getModel().endUpdate();
		}
	
		var layout;
		
		if (type == 'horizontalTree')
		{
			layout = new mxCompactTreeLayout(graph);
			layout.edgeRouting = false;
			layout.levelDistance = 30;
			edgeStyle = 'edgeStyle=elbowEdgeStyle;elbow=horizontal;';
		}
		else if (type == 'verticalTree')
		{
			layout = new mxCompactTreeLayout(graph, false);
			layout.edgeRouting = false;
			layout.levelDistance = 30;
			edgeStyle = 'edgeStyle=elbowEdgeStyle;elbow=vertical;';
		}
		else if (type == 'verticalFlow')
		{
			layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
		}
		else if (type == 'horizontalFlow')
		{
			layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
		}
		else if (type == 'organic')
		{
			layout = new mxFastOrganicLayout(graph, false);
			layout.forceConstant = 80;
		}
		else if (type == 'circle')
		{
			layout = new mxCircleLayout(graph);
		}
		
		if (layout != null)
		{
			var executeLayout = function(change, post)
			{
				graph.getModel().beginUpdate();
				try
				{
					if (change != null)
					{
						change();
					}
					
					layout.execute(graph.getDefaultParent(), v1);
				}
				catch (e)
				{
					throw e;
				}
				finally
				{
					// New API for animating graph layout results asynchronously
					var morph = new mxMorphing(graph);
					morph.addListener(mxEvent.DONE, mxUtils.bind(this, function()
					{
						graph.getModel().endUpdate();
						
						if (post != null)
						{
							post();
						}
					}));
					
					morph.startAnimation();
				}
			};
			
			var edgeHandleConnect = mxEdgeHandler.prototype.connect;
			mxEdgeHandler.prototype.connect = function(edge, terminal, isSource, isClone, me)
			{
				edgeHandleConnect.apply(this, arguments);
				executeLayout();
			};
			
			graph.resizeCell = function()
			{
				mxGraph.prototype.resizeCell.apply(this, arguments);
		
				executeLayout();
			};
		
			graph.connectionHandler.addListener(mxEvent.CONNECT, function()
			{
				executeLayout();
			});
		}

		var cancelBtn = mxUtils.button(mxResources.get('close'), function()
		{
			editorUi.confirm(mxResources.get('areYouSure'), function()
			{
				graph.destroy();
				container.parentNode.removeChild(container);
		
				editorUi.hideDialog();
			});
		})
		
		cancelBtn.className = 'geBtn';
		
		if (editorUi.editor.cancelFirst)
		{
			div.appendChild(cancelBtn);
		}
		
		var okBtn = mxUtils.button(mxResources.get('insert'), function()
		{
			graph.clearCellOverlays();
			
			// Computes unscaled, untranslated graph bounds
			var pt = editorUi.editor.graph.getFreeInsertPoint();
			var cells = editorUi.editor.graph.importCells(
				graph.getModel().getChildren(graph.getDefaultParent()), pt.x, pt.y);
			var view = editorUi.editor.graph.view;
			var temp = view.getBounds(cells);
			temp.x -= view.translate.x;
			temp.y -= view.translate.y;
			editorUi.editor.graph.scrollRectToVisible(temp);
			editorUi.editor.graph.setSelectionCells(cells);
			
			graph.destroy();
			container.parentNode.removeChild(container);
			editorUi.hideDialog();
		});
		
		div.appendChild(okBtn);
		okBtn.className = 'geBtn gePrimaryBtn';
		
		if (!editorUi.editor.cancelFirst)
		{
			div.appendChild(cancelBtn);
		}
	};

	this.container = div;
};

/**
 * 
 */
CreateGraphDialog.prototype.connectImage = new mxImage((mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjQ3OTk0QjMyRDcyMTFFNThGQThGNDVBMjNBMjFDMzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjQ3OTk0QjQyRDcyMTFFNThGQThGNDVBMjNBMjFDMzkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyRjA0N0I2MjJENzExMUU1OEZBOEY0NUEyM0EyMUMzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNDc5OTRCMjJENzIxMUU1OEZBOEY0NUEyM0EyMUMzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjIf+MgAAATlSURBVHjanFZraFxFFD735u4ru3ls0yZG26ShgmJoKK1J2vhIYzBgRdtIURHyw1hQUH9IxIgI2h8iCEUF/1RRlNQYCsYfCTHVhiTtNolpZCEStqSC22xIsrs1bDfu7t37Gs/cO3Ozxs1DBw73zpk555vzmHNGgJ0NYatFgmNLYUHYUoHASMz5ijmgVLmxgfKCUiBxC4ACJAeSG8nb1dVVOTc3dyoSibwWDofPBIPBJzo7O8vpGtvjpDICGztxkciECpF2LS0tvZtOpwNkk5FKpcYXFxffwL1+JuPgllPj8nk1F6RoaGjoKCqZ5ApljZDZO4SMRA0SuG2QUJIQRV8HxMOM9vf3H0ZZH9Nhg20MMl2QkFwjIyNHWlpahtADnuUMwLcRHX5aNSBjCJYEsSSLUeLEbhGe3ytCmQtA1/XY+Pj46dbW1iDuyCJp9BC5ycBj4hoeHq5ra2sbw0Xn1ZgBZ+dVkA1Lc+6p0Ck2p0QS4Ox9EhwpEylYcmBg4LH29vYQLilIOt0u5FhDfevNZDI/u93uw6PLOrwTUtjxrbPYbhD42WgMrF8JmR894ICmCgnQjVe8Xu8pXEkzMJKbuo5oNPomBbm1ZsD7s2kwFA1JZ6QBUXWT1nmGNc/qoMgavDcrQzxjQGFh4aOYIJ0sFAXcEtui4uLiVjr5KpSBVFYDDZVrWUaKRRWSAYeK0fmKykgDXbVoNaPChRuyqdDv97czL5nXxQbq6empQmsaklkDBiNpSwFVrmr2P6UyicD5piI4f8wHh0oEm8/p4h8pyGiEWvVQd3e3nxtjAzU1NR2jP7NRBWQ8GbdEzzJAmc0V3RR4cI8Dvmwuhc8fKUFA0d6/ltHg5p+Kuaejo6OeY0jcNJ/PV00ZS0nFUoZRvvFS1bZFsKHCCQ2Pl8H0chY+C96B6ZUsrCQ1qKtwQVFRURW/QhIXMAzDPAZ6BgOr8tTa8dDxCmiYGApaJbJMxSzV+brE8pdgWkcpY5dbMF1AR9XH8/xu2ilef48bvn92n82ZwHh+8ssqTEXS9p7dHisiiURikd8PbpExNTU1UVNTA3V3Y7lC16n0gpB/NwpNcZjfa7dScC4Qh0kOQCwnlEgi3F/hMVl9fX0zvKrzSk2lfXjRhj0eT/2rvWG4+Pta3oJY7XfC3hInXAv/ldeFLx8shQ+eqQL0UAAz7ylkpej5eNZRVBWL6BU6ef14OYiY1oqyTtmsavr/5koaRucT1pzx+ZpL1+GV5nLutksUgIcmtwTRiuuVZXnU5XId7A2swJkfFsymRWC91hHg1Viw6x23+7vn9sPJ+j20BE1hCXqSWaNSQ8ScbknRZWxub1PGCw/fBV+c3AeijlUbY5bBjEqr9GuYZP4jP41WudGSC6erTRCqdGZm5i1WvXWeDHnbBCZGc2Nj4wBl/hZOwrmBBfgmlID1HmGJutHaF+tKoevp/XCgstDkjo2NtWKLuc6AVN4mNjY+s1XQxoenOoFuDPHGtnRbJj9ej5GvL0dI7+giuRyMk1giazc+DP6vgUDgOJVlOv7R+PJ12QIeL6SyeDz+Kfp8ZrNWjgDTsVjsQ7qXyTjztXJhm9ePxFLfMTg4eG9tbe1RTP9KFFYQfHliYmIS69kCC7jKYmKwxxD5P88tkVkqbPPcIps9t4T/+HjcuJ/s5BFJgf4WYABCtxGuxIZ90gAAAABJRU5ErkJggg==' :
	IMAGE_PATH + '/handle-connect.png', 26, 26);

/**
 * Constructs a new parse dialog.
 */
var BackgroundImageDialog = function(editorUi, applyFn)
{
	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';

	var h3 = document.createElement('h2');
	mxUtils.write(h3, mxResources.get('backgroundImage'));
	h3.style.marginTop = '0px';
	div.appendChild(h3);
	
	mxUtils.write(div, mxResources.get('image') + ' ' + mxResources.get('url') + ':');
	mxUtils.br(div);
	
	var img = editorUi.editor.graph.backgroundImage;
	
	var urlInput = document.createElement('input');
	urlInput.setAttribute('type', 'text');
	urlInput.style.marginTop = '4px';
	urlInput.style.marginBottom = '4px';
	urlInput.style.width = '350px';
	urlInput.value = (img != null) ? img.src : '';
	
	var resetting = false;
	
	var urlChanged = function()
	{
		if (!resetting && urlInput.value != '' && !editorUi.isOffline())
		{
			editorUi.loadImage(mxUtils.trim(urlInput.value), function(img)
			{
				widthInput.value = img.width;
				heightInput.value = img.height;
			}, function()
			{
				editorUi.showError(mxResources.get('error'), mxResources.get('fileNotFound'), mxResources.get('ok'));
				urlInput.value = '';
				widthInput.value = '';
				heightInput.value = '';
			});
		}
		else
		{
			widthInput.value = '';
			heightInput.value = '';
		}
	};
	
	this.init = function()
	{
		urlInput.focus();
		
		// Installs drag and drop handler for local images and links
		if (Graph.fileSupport)
		{
			urlInput.setAttribute('placeholder', mxResources.get('dragImagesHere'));
			
			// Setup the dnd listeners
			var dlg = div.parentNode;
			var graph = editorUi.editor.graph;
			var dropElt = null;
				
			mxEvent.addListener(dlg, 'dragleave', function(evt)
			{
				if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }
			    
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function(evt)
			{
				// IE 10 does not implement pointer-events so it can't have a drop highlight
				if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
				{
					dropElt = editorUi.highlightElement(dlg);
				}
				
				evt.stopPropagation();
				evt.preventDefault();
			}));
					
			mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt)
			{
			    if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }

			    if (evt.dataTransfer.files.length > 0)
			    {
			    	editorUi.importFiles(evt.dataTransfer.files, 0, 0, editorUi.maxBackgroundSize, function(data, mimeType, x, y, w, h)
			    	{
			    		urlInput.value = data;
			    		urlChanged();
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
			    	}, true, editorUi.maxBackgroundBytes, editorUi.maxBackgroundBytes);
	    		}
			    else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0)
			    {
			    	var uri = evt.dataTransfer.getData('text/uri-list');
			    	
			    	if ((/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(uri))
					{
			    		urlInput.value = decodeURIComponent(uri);
			    		urlChanged();
					}
			    }

			    evt.stopPropagation();
			    evt.preventDefault();
			}), false);
		}
	};

	div.appendChild(urlInput);
	mxUtils.br(div);
	mxUtils.br(div);
	
	mxUtils.write(div, mxResources.get('width') + ':');
	
	var widthInput = document.createElement('input');
	widthInput.setAttribute('type', 'text');
	widthInput.style.width = '60px';
	widthInput.style.marginLeft = '4px';
	widthInput.style.marginRight = '16px';
	widthInput.value = (img != null) ? img.width : '';
	
	div.appendChild(widthInput);
	
	mxUtils.write(div, mxResources.get('height') + ':');
	
	var heightInput = document.createElement('input');
	heightInput.setAttribute('type', 'text');
	heightInput.style.width = '60px';
	heightInput.style.marginLeft = '4px';
	heightInput.style.marginRight = '16px';
	heightInput.value = (img != null) ? img.height : '';
	
	div.appendChild(heightInput);
	
	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		urlInput.value = '';
		widthInput.value = '';
		heightInput.value = '';
		resetting = false;
	});
	mxEvent.addListener(resetBtn, 'mousedown', function()
	{
		// Blocks processing a image URL while clicking reset
		resetting = true;
	});
	mxEvent.addListener(resetBtn, 'touchstart', function()
	{
		// Blocks processing a image URL while clicking reset
		resetting = true;
	});
	resetBtn.className = 'geBtn';
	resetBtn.width = '100';
	div.appendChild(resetBtn);
	mxUtils.br(div);

	mxEvent.addListener(urlInput, 'change', urlChanged);

	ImageDialog.filePicked = function(data)
	{
        if (data.action == google.picker.Action.PICKED)
        {
        	if (data.docs[0].thumbnails != null)
        	{
	        	var thumb = data.docs[0].thumbnails[data.docs[0].thumbnails.length - 1];
	        	
	        	if (thumb != null)
	        	{
	        		urlInput.value = thumb.url;
	        		urlChanged();
	        	}
        	}
        }
        
        urlInput.focus();
	};

	var btns = document.createElement('div');
	btns.style.marginTop = '40px';
	btns.style.textAlign = 'right';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	if (!editorUi.isOffline())
	{
		// Dialogs not allowed inside iframes
		if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined' && window.self === window.top)
		{
			var searchBtn = mxUtils.button(mxResources.get('search'), function()
			{
				// Creates one picker and reuses it to avoid polluting the DOM
				if (editorUi.imageSearchPicker == null)
				{
					var picker = new google.picker.PickerBuilder()
						.setLocale(mxLanguage)
						.addView(google.picker.ViewId.IMAGE_SEARCH)
						.enableFeature(google.picker.Feature.NAV_HIDDEN);
					
					editorUi.imageSearchPicker = picker.setCallback(function(data)
					{
						ImageDialog.filePicked(data);
				    }).build();
				}
				
				editorUi.imageSearchPicker.setVisible(true);
				editorUi.movePickersToTop();
			});
			
			searchBtn.className = 'geBtn';
			btns.appendChild(searchBtn);
	
			if (editorUi.drive != null && urlParams['photos'] == '1')
			{
				var gpBtn = mxUtils.button(mxResources.get('googlePlus'), function()
				{
					if (editorUi.spinner.spin(document.body, mxResources.get('authorizing')))
					{
						editorUi.drive.checkToken(mxUtils.bind(this, function()
						{
							editorUi.spinner.stop();
							
							// Creates one picker and reuses it to avoid polluting the DOM
							if (editorUi.photoPicker == null)
							{
						    	var token = gapi.auth.getToken().access_token;
								var picker = new google.picker.PickerBuilder()
									.setAppId(editorUi.drive.appId)	
									.setLocale(mxLanguage)
									.setOAuthToken(token)
									.addView(google.picker.ViewId.PHOTOS)
									.addView(google.picker.ViewId.PHOTO_ALBUMS)
						            .addView(google.picker.ViewId.PHOTO_UPLOAD);
								
								editorUi.photoPicker = picker.setCallback(function(data)
								{
									ImageDialog.filePicked(data);
							    }).build();
							}
							
							editorUi.photoPicker.setVisible(true);
							editorUi.movePickersToTop();
						}));
					}
				});
				
				gpBtn.className = 'geBtn';
				btns.appendChild(gpBtn);
			}
		}
	}

	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		editorUi.hideDialog();
		applyFn((urlInput.value != '') ? new mxImage(mxUtils.trim(urlInput.value), widthInput.value, heightInput.value) : null);
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(applyBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 * Constructs a new parse dialog.
 */
var ParseDialog = function(editorUi, title)
{
	function parse(text, type)
	{
		var lines = text.split('\n');
		
		if (type == 'plantUmlPng' || type == 'plantUmlSvg')
		{
			var plantUmlServerUrl = (type == 'plantUmlPng') ? 'https://exp.draw.io/plantuml2/png/' :
				'https://exp.draw.io/plantuml2/svg/';
	    	var graph = editorUi.editor.graph;
	    	
	    	// TODO: Change server to return base64 & accept POST request
	    	if (editorUi.spinner.spin(document.body, mxResources.get('inserting')))
	    	{
		    	function encode64(data) {
					r = "";
					for (i=0; i<data.length; i+=3) {
				 		if (i+2==data.length) {
							r +=append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), 0);
						} else if (i+1==data.length) {
							r += append3bytes(data.charCodeAt(i), 0, 0);
						} else {
							r += append3bytes(data.charCodeAt(i), data.charCodeAt(i+1),
								data.charCodeAt(i+2));
						}
					}
					return r;
				}
				
				function append3bytes(b1, b2, b3) {
					c1 = b1 >> 2;
					c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
					c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
					c4 = b3 & 0x3F;
					r = "";
					r += encode6bit(c1 & 0x3F);
					r += encode6bit(c2 & 0x3F);
					r += encode6bit(c3 & 0x3F);
					r += encode6bit(c4 & 0x3F);
					return r;
				}
				
				function encode6bit(b) {
					if (b < 10) {
				 		return String.fromCharCode(48 + b);
					}
					b -= 10;
					if (b < 26) {
				 		return String.fromCharCode(65 + b);
					}
					b -= 26;
					if (b < 26) {
				 		return String.fromCharCode(97 + b);
					}
					b -= 26;
					if (b == 0) {
				 		return '-';
					}
					if (b == 1) {
				 		return '_';
					}
					return '?';
				}
			
				// TODO: Remove unescape, use btoa for compatibility with graph.compress
				function compress(s) 
				{
				  return encode64(graph.bytesToString(pako.deflateRaw(unescape(encodeURIComponent(s)))));
				}
			
				var xhr = new XMLHttpRequest();
				xhr.open('GET', plantUmlServerUrl + compress(text), true);
				xhr.responseType = 'blob';
				
				xhr.onload = function(e) 
				{
				  if (this.status >= 200 && this.status < 300)
				  {
				    var reader = new FileReader();
				    reader.readAsDataURL(this.response); 
				    reader.onload = function(e) 
				    {
				    	var img = new Image();
				    	img.onload = function()
				    	{
				    		editorUi.spinner.stop();
				    		
				    		graph.getModel().beginUpdate();
							try
							{
								var view = graph.view;
								var bds = graph.getGraphBounds();
								
								// Computes unscaled, untranslated graph bounds
								var x = Math.ceil(Math.max(0, bds.x / view.scale - view.translate.x) + 4 * graph.gridSize);
								var y = Math.ceil(Math.max(0, (bds.y + bds.height) / view.scale - view.translate.y) + 4 * graph.gridSize);

					    		cell = graph.insertVertex(null, null, text, graph.snap(x), graph.snap(y),
									img.width, img.height, 'shape=image;noLabel=1;verticalAlign=top;aspect=fixed;imageAspect=0;' +
									'image=' + editorUi.convertDataUri(e.target.result) + ';');
							}
							finally
							{
								graph.getModel().endUpdate();
							}
							
							graph.setSelectionCell(cell);
				           	graph.scrollCellToVisible(graph.getSelectionCell());
				    	};
				    	img.src = e.target.result;
				    };
				    reader.onerror = function(e)
				    {
				    	editorUi.handleError(e);
				    };
				  }
				  else 
				  {
					  editorUi.spinner.stop();
					  editorUi.handleError(e);
				  }
				};
				
				xhr.onerror = function(e)
				{
					editorUi.handleError(e);
				};
				 
				xhr.send();
	    	}
		}
		else if (type == 'list')
		{
			if (lines.length > 0)
			{
				var graph = editorUi.editor.graph;
				
				var listCell = new mxCell(lines[0], new mxGeometry(0, 0, 160, 26 + 4),
				    'swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;');
				listCell.vertex = true;
				
				var size = graph.getPreferredSizeForCell(listCell);
		
	   			if (size != null && listCell.geometry.width < size.width + 10)
	   			{
	   				listCell.geometry.width = size.width + 10;
	   			}
				
				if (lines.length > 1)
				{
					for (var i = 1; i < lines.length; i++)
					{
						if (lines[i] == '--')
						{
							var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
							divider.vertex = true;
							listCell.geometry.height += divider.geometry.height;
							listCell.insert(divider);
						}
						else if (lines[i].length > 0 && lines[i].charAt(0) != ';')
						{
							var field = new mxCell(lines[i], new mxGeometry(0, 0, 60, 26), 'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
							field.vertex = true;
							
							var size = graph.getPreferredSizeForCell(field);
		   			
				   			if (size != null && field.geometry.width < size.width)
				   			{
				   				field.geometry.width = size.width;
				   			}
							
				   			listCell.geometry.width = Math.max(listCell.geometry.width, field.geometry.width);
							listCell.geometry.height += field.geometry.height;
							listCell.insert(field);
						}
					}
				}
				
				var view = graph.view;
				var bds = graph.getGraphBounds();
				
				// Computes unscaled, untranslated graph bounds
				var x = Math.ceil(Math.max(0, bds.x / view.scale - view.translate.x) + 4 * graph.gridSize);
				var y = Math.ceil(Math.max(0, (bds.y + bds.height) / view.scale - view.translate.y) + 4 * graph.gridSize);
	
				graph.setSelectionCells(graph.importCells([listCell], x, y));
				graph.scrollCellToVisible(graph.getSelectionCell());
			}
		}
		else
		{		
			var vertices = new Object();
			var cells = [];
			
			function getOrCreateVertex(id)
			{
				var vertex = vertices[id];
	
				if (vertex == null)
				{
					vertex = new mxCell(id, new mxGeometry(0, 0, 80, 30));
					vertex.vertex = true;
					vertices[id] = vertex;
					cells.push(vertex);
				}
				
				return vertex;
			};
			
			for (var i = 0; i < lines.length; i++)
			{
				if (lines[i].charAt(0) != ';')
				{
					var values = lines[i].split('->');
					
					if (values.length == 2)
					{
						var source = getOrCreateVertex(values[0]);
						var target = getOrCreateVertex(values[1]);
						
						var edge = new mxCell('', new mxGeometry());
						edge.edge = true;
						source.insertEdge(edge, true);
						target.insertEdge(edge, false);
						cells.push(edge);
					}
				}
			}
			
			if (cells.length > 0)
			{
				var container = document.createElement('div');
				container.style.visibility = 'hidden';
				document.body.appendChild(container);
				var graph = new Graph(container);
				
				graph.getModel().beginUpdate();
				try
				{
					cells = graph.importCells(cells);
					
					for (var i = 0; i < cells.length; i++)
					{
						if (graph.getModel().isVertex(cells[i]))
						{
							var size = graph.getPreferredSizeForCell(cells[i]);
							cells[i].geometry.width = Math.max(cells[i].geometry.width, size.width);
							cells[i].geometry.height = Math.max(cells[i].geometry.height, size.height);
						}
					}
	
					var layout = new mxFastOrganicLayout(graph);
					layout.disableEdgeStyle = false;
					layout.forceConstant = 120;
					layout.execute(graph.getDefaultParent());
					
					graph.moveCells(cells, 20, 20);
				}
				finally
				{
					graph.getModel().endUpdate();
				}
				
				graph.clearCellOverlays();
				var view = editorUi.editor.graph.view;
				var bds = editorUi.editor.graph.getGraphBounds();
				
				// Computes unscaled, untranslated graph bounds
				var x = Math.ceil(Math.max(0, bds.x / view.scale - view.translate.x) + graph.gridSize);
				var y = Math.ceil(Math.max(0, (bds.y + bds.height) / view.scale - view.translate.y) + 4 * graph.gridSize);
				editorUi.editor.graph.setSelectionCells(editorUi.editor.graph.importCells(
						graph.getModel().getChildren(graph.getDefaultParent()), x, y));
				editorUi.editor.graph.scrollCellToVisible(editorUi.editor.graph.getSelectionCell());
				
				graph.destroy();
				container.parentNode.removeChild(container);
			}
		}
	};
	
	var div = document.createElement('div');
	div.style.textAlign = 'right';
	
	var textarea = document.createElement('textarea');
	textarea.style.resize = 'none';
	textarea.style.width = '100%';
	textarea.style.height = '354px';
	textarea.style.marginBottom = '16px';
	
	var typeSelect = document.createElement('select');

	var listOption = document.createElement('option');
	listOption.setAttribute('value', 'list');
	listOption.setAttribute('selected', 'selected');
	mxUtils.write(listOption, mxResources.get('list'));
	typeSelect.appendChild(listOption);
	
	var diagramOption = document.createElement('option');
	diagramOption.setAttribute('value', 'diagram');
	mxUtils.write(diagramOption, mxResources.get('diagram'));
	typeSelect.appendChild(diagramOption);
		
	var plantUmlSvgOption = document.createElement('option');
	plantUmlSvgOption.setAttribute('value', 'plantUmlSvg');
	mxUtils.write(plantUmlSvgOption, mxResources.get('plantUml') + ' (' + mxResources.get('formatSvg') + ')');
	
	var plantUmlPngOption = document.createElement('option');
	plantUmlPngOption.setAttribute('value', 'plantUmlPng');
	mxUtils.write(plantUmlPngOption, mxResources.get('plantUml') + ' (' + mxResources.get('formatPng') + ')');
	
	if (Graph.fileSupport && !editorUi.isOffline())
	{
		typeSelect.appendChild(plantUmlSvgOption);
		typeSelect.appendChild(plantUmlPngOption);
	}

	function getDefaultValue()
	{
		return  (typeSelect.value == 'list') ?
			'Person\n-name: String\n-birthDate: Date\n--\n+getName(): String\n+setName(String): void\n+isBirthday(): boolean' :
			((typeSelect.value == 'plantUmlPng') ? '@startuml\nskinparam backgroundcolor transparent\nskinparam shadowing false\nAlice -> Bob: Authentication Request\nBob --> Alice: Authentication Response\n\nAlice -> Bob: Another authentication Request\nAlice <-- Bob: another authentication Response\n@enduml' :
			((typeSelect.value == 'plantUmlSvg') ? '@startuml\nskinparam shadowing false\nAlice -> Bob: Authentication Request\nBob --> Alice: Authentication Response\n\nAlice -> Bob: Another authentication Request\nAlice <-- Bob: another authentication Response\n@enduml' :
			';Example:\na->b\nb->c\nc->a\n'));
	};
	
	var defaultValue = getDefaultValue();
	textarea.value = defaultValue;
	div.appendChild(textarea);
	
	this.init = function()
	{
		textarea.focus();
	};
	
	// Enables dropping files
	if (Graph.fileSupport)
	{
		function handleDrop(evt)
		{
		    evt.stopPropagation();
		    evt.preventDefault();
		    
		    if (evt.dataTransfer.files.length > 0)
		    {
		    	var file = evt.dataTransfer.files[0];
    			
				var reader = new FileReader();
				reader.onload = function(e) { textarea.value = e.target.result; };
				reader.readAsText(file);
    		}
		};
		
		function handleDragOver(evt)
		{
			evt.stopPropagation();
			evt.preventDefault();
		};

		// Setup the dnd listeners.
		textarea.addEventListener('dragover', handleDragOver, false);
		textarea.addEventListener('drop', handleDrop, false);
	}

	div.appendChild(typeSelect);
	
	mxEvent.addListener(typeSelect, 'change', function()
	{
		var newDefaultValue = getDefaultValue();
		
		if (textarea.value.length == 0 || textarea.value == defaultValue)
		{
			defaultValue = newDefaultValue;
			textarea.value = defaultValue;
		}
	});
	
	var cancelBtn = mxUtils.button(mxResources.get('close'), function()
	{
		if (textarea.value == defaultValue)
		{
			editorUi.hideDialog();
		}
		else
		{
			editorUi.confirm(mxResources.get('areYouSure'), function()
			{
				editorUi.hideDialog();
			});
		}
	});
	
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		div.appendChild(cancelBtn);
	}
	
	var okBtn = mxUtils.button(mxResources.get('insert'), function()
	{
		editorUi.hideDialog();
		parse(textarea.value, typeSelect.value);
	});
	div.appendChild(okBtn);
	
	okBtn.className = 'geBtn gePrimaryBtn';
	
	if (!editorUi.editor.cancelFirst)
	{
		div.appendChild(cancelBtn);
	}

	this.container = div;
};

/**
 * Constructs a new dialog for creating files from templates.
 */
var NewDialog = function(editorUi, compact, showName, callback)
{
	showName = (showName != null) ? showName : true;
	var outer = document.createElement('div');
	outer.style.height = '100%';
	
	var header = document.createElement('div');
	header.style.whiteSpace = 'nowrap';
	header.style.height = '46px';
	outer.appendChild(header);
	
	var logo = document.createElement('img');
	logo.setAttribute('border', '0');
	logo.setAttribute('align', 'absmiddle');
	logo.style.width = '40px';
	logo.style.height = '40px';
	logo.style.marginRight = '10px';
	logo.style.paddingBottom = '4px';
	
	if (editorUi.mode == App.MODE_GOOGLE)
	{
		logo.src = IMAGE_PATH + '/google-drive-logo.svg';
	}
	else if (editorUi.mode == App.MODE_DROPBOX)
	{
		logo.src = IMAGE_PATH + '/dropbox-logo.svg';
	}
	else if (editorUi.mode == App.MODE_ONEDRIVE)
	{
		logo.src = IMAGE_PATH + '/onedrive-logo.svg';
	}
	else if (editorUi.mode == App.MODE_BROWSER)
	{
		logo.src = IMAGE_PATH + '/osa_database.png';
	}
	else
	{
		logo.src = IMAGE_PATH + '/osa_drive-harddisk.png';
	}

	if (!compact && showName)
	{
		header.appendChild(logo);
	}
	
	if (showName)
	{
		mxUtils.write(header, ((editorUi.mode == null || editorUi.mode == App.MODE_GOOGLE ||
				editorUi.mode == App.MODE_BROWSER) ? mxResources.get('diagramName') : mxResources.get('filename')) + ':');
	}
	
	var ext = '.xml';
	
	if (editorUi.mode == App.MODE_GOOGLE && editorUi.drive != null)
	{
		ext = editorUi.drive.extension;
	}
	else if (editorUi.mode == App.MODE_DROPBOX && editorUi.dropbox != null)
	{
		ext = editorUi.dropbox.extension;
	}
	else if (editorUi.mode == App.MODE_ONEDRIVE && editorUi.oneDrive != null)
	{
		ext = editorUi.oneDrive.extension;
	}
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', editorUi.defaultFilename + ext);
	nameInput.style.marginRight = '20px';
	nameInput.style.marginLeft = '10px';
	nameInput.style.width = (compact) ? '220px' : '450px';
	
	this.init = function()
	{
		if (showName)
		{
			nameInput.focus();
			
			if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
			{
				nameInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
	};

	if (showName)
	{
		header.appendChild(nameInput);
	}

	var templateLibs = null;
	var templateXml = null;
	var selectedElt = null;
	
	function create()
	{
		if (callback)
		{
			if (!showName)
			{
				editorUi.hideDialog();
			}
			
			callback(templateXml, nameInput.value);
		}
		else
		{
			var title = nameInput.value;
				
			if (title != null && title.length > 0)
			{
				var tempMode = (editorUi.mode == App.MODE_ONEDRIVE || (editorUi.mode == App.MODE_GOOGLE &&
					(editorUi.stateArg == null || editorUi.stateArg.folderId == null))) ?  editorUi.mode : null;
				
				editorUi.pickFolder(tempMode, function(folderId)
				{
					editorUi.createFile(title, templateXml, (templateLibs != null && templateLibs.length > 0) ? templateLibs : null, null, function()
					{
						editorUi.hideDialog();				
					}, null, folderId);
				}, tempMode != App.MODE_GOOGLE);
			}
		}
	};
	
	var createButton = mxUtils.button(mxResources.get('create'), function()
	{
		create();
	});
	
	createButton.className = 'geBtn gePrimaryBtn';

	var div = document.createElement('div');
	div.style.border = '1px solid #d3d3d3';
	div.style.position = 'absolute';
	div.style.left = '160px';
	div.style.right = '34px';
	div.style.top = (showName) ? '72px' : '40px';
	div.style.bottom = '76px';
	div.style.margin = '6px 0 0 -1px';
	div.style.padding = '6px';
	div.style.overflow = 'auto';
	
	var list = document.createElement('div');
	list.style.cssText = 'position:absolute;left:30px;width:128px;top:72px;bottom:76px;margin-top:6px;overflow:auto;border:1px solid #d3d3d3;';
	
	if (!showName)
	{
		list.style.top = '40px';
	}
	
	var w = 140;
	var h = 140;

	function selectElement(elt, xml, libs)
	{
		if (selectedElt != null)
		{
			selectedElt.style.backgroundColor = 'transparent';
			selectedElt.style.border = '1px solid transparent';
		}
		
		templateXml = xml;
		templateLibs = libs;
		selectedElt = elt;
		
		selectedElt.style.backgroundColor = '#e6eff8';
		selectedElt.style.border = '1px solid #ccd9ea';
	};

	function addButton(url, libs, title, tooltip, select)
	{
		var elt = document.createElement('div');
		elt.className = 'geTemplate';
		elt.style.height = w + 'px';
		elt.style.width = h + 'px';
		
		if (tooltip != null && tooltip.length > 0)
		{
			elt.setAttribute('title', tooltip);
		}
		
		if (url != null && url.length > 0)
		{
			var png = url.substring(0, url.length - 4) + '.png';
			
			elt.style.backgroundImage = 'url(' + TEMPLATE_PATH + '/' + url.substring(0, url.length - 4) + '.png)';
			elt.style.backgroundPosition = 'center center';
			elt.style.backgroundRepeat = 'no-repeat';
			
			var createIt = false;
			
			mxEvent.addListener(elt, 'click', function(evt)
			{
				createButton.setAttribute('disabled', 'disabled');
				elt.style.backgroundColor = 'transparent';
				elt.style.border = '1px solid transparent';
				
				mxUtils.get(TEMPLATE_PATH + '/' + url, mxUtils.bind(this, function(req)
				{
					if (req.getStatus() == 200)
					{
						createButton.removeAttribute('disabled');
						selectElement(elt, req.getText(), libs);
						
						if (createIt)
						{
							create();
						}
					}
				}));
			});
			
			mxEvent.addListener(elt, 'dblclick', function(evt)
			{
				// Asynchronous double click handling after loading template
				createIt = true;
			});
		}
		else
		{
			elt.innerHTML = '<table width="100%" height="100%"><tr><td align="center" valign="middle">' +
				mxResources.get(title) + '</td></tr></table>';
			
			if (select)
			{
				selectElement(elt);
			}
			
			mxEvent.addListener(elt, 'click', function(evt)
			{
				selectElement(elt);
			});
			
			mxEvent.addListener(elt, 'dblclick', function(evt)
			{
				create();
			});
		}

		div.appendChild(elt);
	};

	var categories = {};
	var categoryCount = 1;
	
	// Adds local basic templates
	categories['basic'] = [{title: 'blankDiagram', select: true}];
	var templates = categories['basic'];
	
	function initUi()
	{
		var i0 = 0;
		
		// Dynamic loading
		function addTemplates()
		{
			var first = true;
			
			while (i0 < templates.length && (first || mxUtils.mod(i0, 30) != 0))
			{
				var tmp = templates[i0++];
				addButton(tmp.url, tmp.libs, tmp.title, tmp.tooltip, tmp.select);
				first = false;
			}
		};

		mxEvent.addListener(div, 'scroll', function(evt)
		{
			if (div.scrollTop + div.clientHeight >= div.scrollHeight)
			{
				addTemplates();
				mxEvent.consume(evt);
			}
		});
		
		var currentEntry = null;
		
		for (var cat in categories)
		{
			var entry = document.createElement('div');
			var label = mxResources.get(cat);
			var templateList = categories[cat];
			
			if (label == null)
			{
				label = cat.substring(0, 1).toUpperCase() + cat.substring(1);
			}
			
			if (label.length > 18)
			{
				label = label.substring(0, 18) + '&hellip;';
			}
			entry.style.cssText = 'display:block;cursor:pointer;padding:6px;white-space:nowrap;margin-bottom:-1px;overflow:hidden;text-overflow:ellipsis;';
			entry.setAttribute('title', label + ' (' + templateList.length + ')');
			mxUtils.write(entry, entry.getAttribute('title'));

			list.appendChild(entry);
			
			if (currentEntry == null)
			{
				currentEntry = entry;
				currentEntry.style.backgroundColor = '#ebf2f9';
			}
			
			(function(cat2, entry2)
			{
				mxEvent.addListener(entry, 'click', function()
				{
					if (currentEntry != entry2)
					{
						currentEntry.style.backgroundColor = '';
						currentEntry = entry2;
						currentEntry.style.backgroundColor = '#ebf2f9';	
						
						div.scrollTop = 0;
						div.innerHTML = '';
						i0 = 0;
						templates = categories[cat2];
						addTemplates();
					}
				});
			})(cat, entry);
		}
		
		addTemplates();
	}

	if (!compact)
	{
		outer.appendChild(list);
		outer.appendChild(div);
		var indexLoaded = false;
		
		mxUtils.get(TEMPLATE_PATH + '/index.xml', function(req)
		{
			// Workaround for index loaded 3 times in iOS offline mode
			if (!indexLoaded)
			{
				indexLoaded = true;
				var tmpDoc = req.getXml();
				var node = tmpDoc.documentElement.firstChild;
	
				while (node != null)
				{
					if (typeof(node.getAttribute) !== 'undefined')
					{
						var url = node.getAttribute('url');
						
						if (url != null)
						{
							var slash = url.indexOf('/');
							var category = url.substring(0, slash);
							
							var list = categories[category];
							
							if (list == null)
							{
								categoryCount++;
								list = [];
								categories[category] = list;
							}
							
							list.push({url: node.getAttribute('url'), libs: node.getAttribute('libs'),
								title: node.getAttribute('title'), tooltip: node.getAttribute('url')});
						}
					}
					
					node = node.nextSibling;
				}
				
				initUi();
			}
		});
	}
	
	mxEvent.addListener(nameInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			create();
		}
	});
	
	var btns = document.createElement('div');
	btns.style.marginTop = (compact) ? '4px' : '16px';
	btns.style.textAlign = 'right';
	btns.style.position = 'absolute';
	btns.style.left = '40px';
	btns.style.bottom = '30px';
	btns.style.right = '40px';

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog(true);
	});
	
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	if (!compact && !editorUi.isOffline() && showName && callback == null)
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			window.open('https://support.draw.io/display/DO/Creating+and+Opening+Files');
		});
		
		helpBtn.className = 'geBtn';	
		btns.appendChild(helpBtn);
	}

	if (!compact && urlParams['embed'] != '1')
	{
		var fromTmpBtn = mxUtils.button(mxResources.get('fromTemplateUrl'), function()
		{
			var dlg = new FilenameDialog(editorUi, '', mxResources.get('create'), function(fileUrl)
			{
				if (fileUrl != null && fileUrl.length > 0)
				{
					var url = editorUi.getUrl(window.location.pathname + '?mode=' + editorUi.mode +
							'&title=' + encodeURIComponent(nameInput.value) +
							'&create=' + encodeURIComponent(fileUrl));
					
					if (editorUi.getCurrentFile() == null)
					{
						window.location.href = url;
					}
					else
					{
						window.openWindow(url);
					}
				}
			}, mxResources.get('url'));
			editorUi.showDialog(dlg.container, 300, 80, true, true);
			dlg.init();
		});
		fromTmpBtn.className = 'geBtn';
		btns.appendChild(fromTmpBtn);
	}
	
	btns.appendChild(createButton);
	
	if (!editorUi.editor.cancelFirst && callback == null)
	{
		btns.appendChild(cancelBtn);
	}
	
	outer.appendChild(btns);
	
	this.container = outer;
};

/**
 * Constructs a dialog for creating new files from a template URL.
 */
var CreateDialog = function(editorUi, title, createFn, cancelFn, dlgTitle, btnLabel, overrideExtension,
		allowBrowser, allowTab, helpLink, showDeviceButton)
{
	overrideExtension = (overrideExtension != null) ? overrideExtension : true;
	allowBrowser = (allowBrowser != null) ? allowBrowser : true;
	var div = document.createElement('div');
	var showButtons = true;
	
	if (cancelFn == null)
	{
		editorUi.addLanguageMenu(div);
	}

	var h3 = document.createElement('h2');
	mxUtils.write(h3, dlgTitle || mxResources.get('create'));
	h3.style.marginTop = '0px';
	h3.style.marginBottom = '24px';
	div.appendChild(h3);
	
	mxUtils.write(div, mxResources.get('filename') + ':');

	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', title);
	nameInput.style.width = '280px';
	nameInput.style.marginLeft = '10px';
	nameInput.style.marginBottom = '20px';
	
	this.init = function()
	{
		nameInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			nameInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};

	div.appendChild(nameInput);
	mxUtils.br(div);
	
	var buttons = document.createElement('div');
	buttons.style.textAlign = 'center';

	function addLogo(img, title, mode, clientName)
	{
		var button = document.createElement('a');
		button.style.overflow = 'hidden';
		
		var logo = document.createElement('img');
		logo.src = img;
		logo.setAttribute('border', '0');
		logo.setAttribute('align', 'absmiddle');
		logo.style.width = '60px';
		logo.style.height = '60px';
		logo.style.paddingBottom = '6px';
		button.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
		button.className = 'geBaseButton';
		button.style.position = 'relative';
		button.style.margin = '4px';
		button.style.padding = '8px 8px 10px 8px';
		button.style.whiteSpace = 'nowrap';
		
		button.appendChild(logo);
		
		// Workaround for quirks is a vertical list (limited to max 2 items)
		if (mxClient.IS_QUIRKS)
		{
			button.style.cssFloat = 'left';
			button.style.zoom = '1';
		}
		
		button.style.color = 'gray';
		button.style.fontSize = '11px';
		
		var label = document.createElement('div');
		button.appendChild(label);
		mxUtils.write(label, title);
		
		function initButton()
		{
			mxEvent.addListener(button, 'click', function()
			{
				// Updates extension
				change(mode);
				create(mode);
			});
		};
		
		// Supports lazy loading
		if (clientName != null && editorUi[clientName] == null)
		{
			logo.style.visibility = 'hidden';
			mxUtils.setOpacity(label, 10);
			var size = 12;
			
			var spinner = new Spinner({
				lines: 12, // The number of lines to draw
				length: size, // The length of each line
				width: 5, // The line thickness
				radius: 10, // The radius of the inner circle
				rotate: 0, // The rotation offset
				color: '#000', // #rgb or #rrggbb
				speed: 1.5, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				top: '40%',
				zIndex: 2e9 // The z-index (defaults to 2000000000)
			});
			spinner.spin(button);
			
			// Timeout after 30 secs
			var timeout = window.setTimeout(function()
			{
				if (editorUi[clientName] == null)
				{
					spinner.stop();
					button.style.display = 'none';
				}
			}, 30000);
			
			editorUi.addListener('clientLoaded', mxUtils.bind(this, function()
			{
				if (editorUi[clientName] != null)
				{
					window.clearTimeout(timeout);
					mxUtils.setOpacity(label, 100);
					logo.style.visibility = '';
					spinner.stop();
					initButton();
				}
			}));
		}
		else
		{
			initButton();
		}

		buttons.appendChild(button);
	};

	if (!showButtons)
	{
		mxUtils.write(div, mxResources.get('chooseAnOption') + ':');
	}
	else
	{
		buttons.style.marginTop = '6px';
		div.appendChild(buttons);
	}
	
	// Adds all papersize options
	var serviceSelect = document.createElement('select');
	serviceSelect.style.marginLeft = '10px';

	if (!editorUi.isOfflineApp() && !editorUi.isOffline())
	{
		if (typeof window.DriveClient === 'function')
		{
			var googleOption = document.createElement('option');
			googleOption.setAttribute('value', App.MODE_GOOGLE);
			mxUtils.write(googleOption, mxResources.get('googleDrive'));
			serviceSelect.appendChild(googleOption);
			
			addLogo(IMAGE_PATH + '/google-drive-logo.svg', mxResources.get('googleDrive'), App.MODE_GOOGLE, 'drive');
		}
	
		if (typeof window.DropboxClient === 'function')
		{
			var dropboxOption = document.createElement('option');
			dropboxOption.setAttribute('value', App.MODE_DROPBOX);
			mxUtils.write(dropboxOption, mxResources.get('dropbox'));
			serviceSelect.appendChild(dropboxOption);
			
			if (editorUi.mode == App.MODE_DROPBOX)
			{
				dropboxOption.setAttribute('selected', 'selected');
			}
			
			addLogo(IMAGE_PATH + '/dropbox-logo.svg', mxResources.get('dropbox'), App.MODE_DROPBOX, 'dropbox');
		}
	
		if (typeof window.OneDriveClient === 'function')
		{
			var oneDriveOption = document.createElement('option');
			oneDriveOption.setAttribute('value', App.MODE_ONEDRIVE);
			mxUtils.write(oneDriveOption, mxResources.get('oneDrive'));
			serviceSelect.appendChild(oneDriveOption);
			
			if (editorUi.mode == App.MODE_ONEDRIVE)
			{
				oneDriveOption.setAttribute('selected', 'selected');
			}
			
			addLogo(IMAGE_PATH + '/onedrive-logo.svg', mxResources.get('oneDrive'), App.MODE_ONEDRIVE, 'oneDrive');
		}
	}
	
	if (!Editor.useLocalStorage || urlParams['storage'] == 'device' ||
		(editorUi.getCurrentFile() != null && !mxClient.IS_IOS))
	{
		var deviceOption = document.createElement('option');
		deviceOption.setAttribute('value', App.MODE_DEVICE);
		mxUtils.write(deviceOption, mxResources.get('device'));
		serviceSelect.appendChild(deviceOption);
		
		if (editorUi.mode == App.MODE_DEVICE || !allowBrowser)
		{
			deviceOption.setAttribute('selected', 'selected');
		}
		
		if (showDeviceButton)
		{
			mxUtils.br(buttons);
			addLogo(IMAGE_PATH + '/osa_drive-harddisk.png', mxResources.get('device'), App.MODE_DEVICE);
		}
	}
	
	if (allowBrowser && isLocalStorage && urlParams['browser'] != '0')
	{
		var browserOption = document.createElement('option');
		browserOption.setAttribute('value', App.MODE_BROWSER);
		mxUtils.write(browserOption, mxResources.get('browser'));
		serviceSelect.appendChild(browserOption);
		
		if (editorUi.mode == App.MODE_BROWSER)
		{
			browserOption.setAttribute('selected', 'selected');
		}
		
		addLogo(IMAGE_PATH + '/osa_database.png', mxResources.get('browser'), App.MODE_BROWSER);
	}

	function change(newMode)
	{
		if (overrideExtension)
		{
			var fn = nameInput.value;
			var idx = fn.lastIndexOf('.');
			
			if (title.lastIndexOf('.') < 0 && (!showButtons || idx < 0))
			{
				newMode = (newMode != null) ? newMode : serviceSelect.value;
				var ext = '';
				
				if (newMode == App.MODE_GOOGLE)
				{
					ext = editorUi.drive.extension;
				}
				else if (newMode == App.MODE_DROPBOX)
				{
					ext = editorUi.dropbox.extension;
				}
				else if (newMode == App.MODE_ONEDRIVE)
				{
					ext = editorUi.oneDrive.extension;
				}
				else if (newMode == App.MODE_DEVICE)
				{
					ext = '.xml';
				}
				
				if (idx >= 0)
				{
					fn = fn.substring(0, idx);
				}
				
				nameInput.value = fn + ext;
			}
		}
	};

	var btns = document.createElement('div');
	btns.style.marginTop = (showButtons) ? '26px' : '38px';
	btns.style.textAlign = (showButtons) ? 'center' : 'right';
	
	if (!showButtons)
	{
		div.appendChild(serviceSelect);
		mxEvent.addListener(serviceSelect, 'change', change);
		change();
	}
	
	if (helpLink != null)
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			window.open(helpLink);
		});
		
		helpBtn.className = 'geBtn';
		btns.appendChild(helpBtn);
	}
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		if (cancelFn != null)
		{
			cancelFn();
		}
		else
		{
			editorUi.fileLoaded(null);
			editorUi.hideDialog();
			window.close();
			window.location.href = editorUi.getUrl();
		}
	});
	
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	function create(mode)
	{
		var title = nameInput.value;
		
		if (mode == null || (title != null && title.length > 0))
		{
			editorUi.hideDialog();
			createFn(title, mode);
		};
	}
	
	if (cancelFn == null)
	{
		var laterBtn = mxUtils.button(mxResources.get('decideLater'), function()
		{
			create(null);
		});
		
		laterBtn.className = 'geBtn';
		btns.appendChild(laterBtn);
	}

	if (allowTab)
	{
		var openBtn = mxUtils.button(mxResources.get('openInNewWindow'), function()
		{
			create('_blank');
		});
		openBtn.className = 'geBtn';
		btns.appendChild(openBtn);
	}
	
	if (!mxClient.IS_IOS || !showButtons)
	{
		var createBtn = mxUtils.button(btnLabel || mxResources.get('create'), function()
		{
			create((showDeviceButton) ? 'download' : ((showButtons) ? App.MODE_DEVICE : serviceSelect.value));
		});
		createBtn.className = 'geBtn gePrimaryBtn';
		btns.appendChild(createBtn);
	}
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	mxEvent.addListener(nameInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			create((showButtons) ? App.MODE_DEVICE : serviceSelect.value);
		}
		else if (e.keyCode == 27)
		{
			editorUi.fileLoaded(null);
			editorUi.hideDialog();
			window.close();
		}
	});

	div.appendChild(btns);

	this.container = div;
};

/**
 * Constructs a new popup dialog.
 */
var PopupDialog = function(editorUi, url, pre, fallback, hideDialog) 
{
	hideDialog = (hideDialog != null) ? hideDialog : true;
	
	var div = document.createElement('div');
	div.style.textAlign = 'left';
	
	mxUtils.write(div, mxResources.get('fileOpenLocation'));
	mxUtils.br(div);
	mxUtils.br(div);

	var replaceBtn = mxUtils.button(mxResources.get('openInThisWindow'), function()
	{
		if (hideDialog)
		{
			editorUi.hideDialog();
		}
		
		if (fallback != null)
		{
			fallback();
		}
	});
	replaceBtn.className = 'geBtn';
	replaceBtn.style.marginBottom = '8px';
	replaceBtn.style.width = '280px';
	div.appendChild(replaceBtn);
	
	mxUtils.br(div);
	
	var wndBtn = mxUtils.button(mxResources.get('openInNewWindow'), function()
	{
		if (hideDialog)
		{
			editorUi.hideDialog();
		}

		if (pre != null)
		{
			pre();
		}
		
		window.open(url);
	});
	wndBtn.className = 'geBtn gePrimaryBtn';
	wndBtn.style.width = replaceBtn.style.width;
	div.appendChild(wndBtn);
	
	mxUtils.br(div);
	mxUtils.br(div);
	mxUtils.write(div, mxResources.get('allowPopups'));
	
	this.container = div;
};

/**
 * Constructs a new image dialog.
 */
var ImageDialog = function(editorUi, title, initialValue, fn, ignoreExisting, convertDataUri)
{
	convertDataUri = (convertDataUri != null) ? convertDataUri : true;
	
	var graph = editorUi.editor.graph;
	var div = document.createElement('div');
	mxUtils.write(div, title);
	
	var inner = document.createElement('div');
	inner.className = 'geTitle';
	inner.style.backgroundColor = 'transparent';
	inner.style.borderColor = 'transparent';
	inner.style.whiteSpace = 'nowrap';
	inner.style.textOverflow = 'clip';
	inner.style.cursor = 'default';
	
	if (!mxClient.IS_VML)
	{
		inner.style.paddingRight = '20px';
	}
	
	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', initialValue);
	linkInput.setAttribute('type', 'text');
	linkInput.style.marginTop = '6px';
	var realWidth = (Graph.fileSupport) ? 420 : 340;
	linkInput.style.width = realWidth + ((mxClient.IS_QUIRKS) ? 20 : -20) + 'px';
	linkInput.style.backgroundImage = 'url(\'' + Dialog.prototype.clearImage + '\')';
	linkInput.style.backgroundRepeat = 'no-repeat';
	linkInput.style.backgroundPosition = '100% 50%';
	linkInput.style.paddingRight = '14px';
	
	var cross = document.createElement('div');
	cross.setAttribute('title', mxResources.get('reset'));
	cross.style.position = 'relative';
	cross.style.left = '-16px';
	cross.style.width = '12px';
	cross.style.height = '14px';
	cross.style.cursor = 'pointer';

	// Workaround for inline-block not supported in IE
	cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
	cross.style.top = ((mxClient.IS_VML) ? 0 : 3) + 'px';
	
	// Needed to block event transparency in IE
	cross.style.background = 'url(\'' + editorUi.editor.transparentImage + '\')';

	mxEvent.addListener(cross, 'click', function()
	{
		linkInput.value = '';
		linkInput.focus();
	});
	
	inner.appendChild(linkInput);
	inner.appendChild(cross);
	div.appendChild(inner);

	var insertImage = function(newValue, w, h)
	{
		var dataUri = newValue.substring(0, 5) == 'data:';
		
		if ((!editorUi.isOffline() || (dataUri && typeof chrome === 'undefined')) &&
			editorUi.spinner.spin(document.body, mxResources.get('inserting')))
		{
			var maxSize = 520;
			
			editorUi.loadImage(newValue, function(img)
    		{
				editorUi.spinner.stop();
				editorUi.hideDialog();
				var s = (w != null && h != null) ? Math.max(w / img.width, h / img.height) :
					Math.min(1, Math.min(maxSize / img.width, maxSize / img.height));
				
				// Handles special case of data URI which needs to be rewritten
				// to be used in a cell style to remove the semicolon
				if (convertDataUri)
				{
					newValue = editorUi.convertDataUri(newValue);
				}
				
    			fn(newValue, Math.round(Number(img.width) * s), Math.round(Number(img.height) * s));
    		}, function()
    		{
    			editorUi.spinner.stop();
    			fn(null);
				editorUi.showError(mxResources.get('error'), mxResources.get('fileNotFound'), mxResources.get('ok'));
    		});
		}
		else
		{
			newValue = editorUi.convertDataUri(newValue);
			w = (w == null) ? 120 : w;
			h = (h == null) ? 100 : h;
			
			editorUi.hideDialog();				
			fn(newValue, w, h);
		}
	};
	
	var apply = function(newValue)
	{
		if (newValue != null && newValue.length > 0)
		{
			var geo = (ignoreExisting) ? null : graph.getModel().getGeometry(graph.getSelectionCell());

			// Reuses width and height of existing cell
			if (geo != null)
			{
				insertImage(newValue, geo.width, geo.height);
			}
			else
			{
				insertImage(newValue);
			}
		}
		else
		{
			editorUi.hideDialog();
			fn(null);
		}
	};

	this.init = function()
	{
		linkInput.focus();
		
		// Installs drag and drop handler for local images and links
		if (Graph.fileSupport)
		{
			linkInput.setAttribute('placeholder', mxResources.get('dragImagesHere'));
			
			// Setup the dnd listeners
			var dlg = div.parentNode;
			var graph = editorUi.editor.graph;
			var dropElt = null;
				
			mxEvent.addListener(dlg, 'dragleave', function(evt)
			{
				if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }
			    
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function(evt)
			{
				// IE 10 does not implement pointer-events so it can't have a drop highlight
				if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
				{
					dropElt = editorUi.highlightElement(dlg);
				}
				
				evt.stopPropagation();
				evt.preventDefault();
			}));
					
			mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt)
			{
			    if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }

			    if (evt.dataTransfer.files.length > 0)
			    {
			    	editorUi.importFiles(evt.dataTransfer.files, 0, 0, editorUi.maxImageSize, function(data, mimeType, x, y, w, h)
			    	{
			    		apply(data);
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
			    	
			    	if ((/\.(gif|jpg|jpeg|tiff|png|svg)($|\?)/i).test(uri))
					{
			    		apply(decodeURIComponent(uri));
					}
			    }

			    evt.stopPropagation();
			    evt.preventDefault();
			}), false);
		}
	};
	
	var btns = document.createElement('div');
	btns.style.marginTop = (mxClient.IS_QUIRKS) ? '22px' : '14px';
	btns.style.textAlign = 'right';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		// Just in case a spinner is spinning, has no effect otherwise
		editorUi.spinner.stop();
		editorUi.hideDialog();
	});
	
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	ImageDialog.filePicked = function(data)
	{
        if (data.action == google.picker.Action.PICKED)
        {
        	if (data.docs[0].thumbnails != null)
        	{
	        	var thumb = data.docs[0].thumbnails[data.docs[0].thumbnails.length - 1];
	        	
	        	if (thumb != null)
	        	{
	        		linkInput.value = thumb.url;
	        	}
        	}
        }
        
        linkInput.focus();
	};

	if (Graph.fileSupport)
	{
		var fileInput = document.createElement('input');
		fileInput.setAttribute('multiple', 'multiple');
		fileInput.setAttribute('type', 'file');
		
		if (document.documentMode == null)
		{
			mxEvent.addListener(fileInput, 'change', function(evt)
			{
		    	editorUi.importFiles(fileInput.files, 0, 0, editorUi.maxImageSize, function(data, mimeType, x, y, w, h)
		    	{
		    		apply(data);
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
		    	}, true);
			});
			
			var btn = mxUtils.button(mxResources.get('open'), function()
			{
				fileInput.click();
			});
			btn.className = 'geBtn';
			
			btns.appendChild(btn);
		}
	}

	if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined' && window.self === window.top)
	{
		var searchBtn = mxUtils.button(mxResources.get('search'), function()
		{
			// Creates one picker and reuses it to avoid polluting the DOM
			if (editorUi.imageSearchPicker == null)
			{
				var picker = new google.picker.PickerBuilder()
					.setLocale(mxLanguage)
					.addView(google.picker.ViewId.IMAGE_SEARCH)
					.enableFeature(google.picker.Feature.NAV_HIDDEN);
				
				editorUi.imageSearchPicker = picker.setCallback(function(data)
				{
					ImageDialog.filePicked(data);
			    }).build();
			}
			
			editorUi.imageSearchPicker.setVisible(true);
			editorUi.movePickersToTop();
		});
		searchBtn.className = 'geBtn';
		btns.appendChild(searchBtn);

		if (editorUi.drive != null && urlParams['photos'] == '1')
		{
			var gpBtn = mxUtils.button(mxResources.get('googlePlus'), function()
			{
				if (editorUi.spinner.spin(document.body, mxResources.get('authorizing')))
				{
					editorUi.drive.checkToken(mxUtils.bind(this, function()
					{
						editorUi.spinner.stop();
						
						// Creates one picker and reuses it to avoid polluting the DOM
						if (editorUi.photoPicker == null)
						{
					    	var token = gapi.auth.getToken().access_token;
							var picker = new google.picker.PickerBuilder()
								.setAppId(editorUi.drive.appId)	
								.setLocale(mxLanguage)
								.setOAuthToken(token)
								.addView(google.picker.ViewId.PHOTOS)
								.addView(google.picker.ViewId.PHOTO_ALBUMS)
					            .addView(google.picker.ViewId.PHOTO_UPLOAD);
							
							editorUi.photoPicker = picker.setCallback(function(data)
							{
								ImageDialog.filePicked(data);
						    }).build();
						}
						
						editorUi.photoPicker.setVisible(true);
						editorUi.movePickersToTop();
					}));
				}
			});
			gpBtn.className = 'geBtn';
			btns.appendChild(gpBtn);
		}
	}

	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			apply(linkInput.value);
		}
	});
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		apply(linkInput.value);
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(applyBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	// Shows drop icon in dialog background
	if (Graph.fileSupport)
	{
		btns.style.marginTop = '120px';
		div.style.backgroundImage = 'url(\'' + IMAGE_PATH + '/droptarget.png\')';
		div.style.backgroundPosition = 'center 65%';
		div.style.backgroundRepeat = 'no-repeat';
		
		var bg = document.createElement('div');
		bg.style.position = 'absolute';
		bg.style.width = '420px';
		bg.style.top = '58%';
		bg.style.textAlign = 'center';
		bg.style.fontSize = '18px';
		bg.style.color = '#a0c3ff';
		mxUtils.write(bg, mxResources.get('dragImagesHere'));
		div.appendChild(bg);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 * Constructs a new print dialog.
 */
PrintDialog.prototype.create = function(editorUi)
{
	var graph = editorUi.editor.graph;
	var div = document.createElement('div');
	
	var title = document.createElement('h3');
	title.style.marginTop = '0px';
	mxUtils.write(title, mxResources.get('print'));
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
			doc.writeln('<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/2.6-latest/MathJax.js"></script>');
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
			window.open('https://desk.draw.io/solution/articles/16000048947-how-to-print-');
		});
		
		helpBtn.className = 'geBtn';
		buttons.appendChild(helpBtn);
	}
	
	if (!mxClient.IS_CHROMEAPP)
	{
		var previewBtn = mxUtils.button(mxResources.get('preview'), function()
		{
			editorUi.hideDialog();
			preview(false);
		});
		previewBtn.className = 'geBtn';
		buttons.appendChild(previewBtn);
	}
	
	var printBtn = mxUtils.button(mxResources.get((mxClient.IS_CHROMEAPP) ? 'ok' : 'print'), function()
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

/**
 * Overrides link dialog to add Google Picker.
 */
var LinkDialog = function(editorUi, initialValue, btnLabel, fn)
{
	var div = document.createElement('div');
	mxUtils.write(div, mxResources.get('editLink') + ':');
	
	var inner = document.createElement('div');
	inner.className = 'geTitle';
	inner.style.backgroundColor = 'transparent';
	inner.style.borderColor = 'transparent';
	inner.style.whiteSpace = 'nowrap';
	inner.style.textOverflow = 'clip';
	inner.style.cursor = 'default';
	
	if (!mxClient.IS_VML)
	{
		inner.style.paddingRight = '20px';
	}
	
	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', initialValue);
	linkInput.setAttribute('placeholder', mxResources.get('dragUrlsHere'));
	linkInput.setAttribute('type', 'text');
	linkInput.style.marginTop = '6px';
	linkInput.style.width = '400px';
	linkInput.style.backgroundImage = 'url(\'' + Dialog.prototype.clearImage + '\')';
	linkInput.style.backgroundRepeat = 'no-repeat';
	linkInput.style.backgroundPosition = '100% 50%';
	linkInput.style.paddingRight = '14px';
	
	var cross = document.createElement('div');
	cross.setAttribute('title', mxResources.get('reset'));
	cross.style.position = 'relative';
	cross.style.left = '-16px';
	cross.style.width = '12px';
	cross.style.height = '14px';
	cross.style.cursor = 'pointer';

	// Workaround for inline-block not supported in IE
	cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
	cross.style.top = ((mxClient.IS_VML) ? 0 : 3) + 'px';
	
	// Needed to block event transparency in IE
	cross.style.background = 'url(\'' + editorUi.editor.transparentImage + '\')';

	mxEvent.addListener(cross, 'click', function()
	{
		linkInput.value = '';
		linkInput.focus();
	});
	
	inner.appendChild(linkInput);
	inner.appendChild(cross);
	div.appendChild(inner);
	
	var mainBtn = mxUtils.button(btnLabel, function()
	{
		editorUi.hideDialog();
		fn(linkInput.value, LinkDialog.selectedDocs);
	});
	mainBtn.className = 'geBtn gePrimaryBtn';
	
	this.init = function()
	{
		linkInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			linkInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
		
		// Installs drag and drop handler for links
		if (Graph.fileSupport)
		{
			// Setup the dnd listeners
			var dlg = div.parentNode;
			var graph = editorUi.editor.graph;
			var dropElt = null;
				
			mxEvent.addListener(dlg, 'dragleave', function(evt)
			{
				if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }
			    
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function(evt)
			{
				// IE 10 does not implement pointer-events so it can't have a drop highlight
				if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
				{
					dropElt = editorUi.highlightElement(dlg);
				}
				
				evt.stopPropagation();
				evt.preventDefault();
			}));
					
			mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt)
			{
			    if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }

			    if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0)
			    {
			    	linkInput.value = decodeURIComponent(evt.dataTransfer.getData('text/uri-list'));
			    	mainBtn.click();
			    }

			    evt.stopPropagation();
			    evt.preventDefault();
			}), false);
		}
	};
	
	var btns = document.createElement('div');
	btns.style.marginTop = '14px';
	btns.style.textAlign = 'right';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	LinkDialog.selectedDocs = null;
	
	LinkDialog.filePicked = function(data)
	{
		if (data.action == google.picker.Action.PICKED)
        {
			LinkDialog.selectedDocs = data.docs;
        	var href = data.docs[0].url;
        	
    		if (data.docs[0].mimeType == 'application/mxe' || data.docs[0].mimeType == 'application/vnd.jgraph.mxfile')
    		{
				var domain = DriveClient.prototype.oldAppHostname;
				href = 'https://' + domain + '/#G' + data.docs[0].id;
    		}
    		else if (data.docs[0].mimeType == 'application/mxr' || data.docs[0].mimeType == 'application/vnd.jgraph.mxfile.realtime')
    		{
				var domain = DriveClient.prototype.newAppHostname;
				href = 'https://' + domain + '/#G' + data.docs[0].id;
    		}
    		else if (data.docs[0].mimeType == 'application/vnd.google-apps.folder')
    		{
    			// Do not use folderview in data.docs[0].url link to Google Drive instead
    			href = 'https://drive.google.com/#folders/' + data.docs[0].id;
    		}
    		
    		linkInput.value = href;
        }
		else
		{
			LinkDialog.selectedDocs = null;
		}
		
		linkInput.focus();
	};

	if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined' && editorUi.drive != null)
	{
		var gpBtn = mxUtils.button(mxResources.get('googlePlus'), function()
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('authorizing')))
			{
				editorUi.drive.checkToken(mxUtils.bind(this, function()
				{
					editorUi.spinner.stop();
					
					// Creates one picker and reuses it to avoid polluting the DOM
					if (editorUi.linkPicker == null)
					{
				    	var token = gapi.auth.getToken().access_token;
						var view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
			        		.setParent('root')
			        		.setIncludeFolders(true)
			        		.setSelectFolderEnabled(true);
				    	var view2 = new google.picker.DocsView()
							.setIncludeFolders(true)
				            .setSelectFolderEnabled(true);
						var picker = new google.picker.PickerBuilder()
							.setAppId(editorUi.drive.appId)	
							.setLocale(mxLanguage)
							.setOAuthToken(token)
						    .addView(view)
							.addView(view2)
							.addView(google.picker.ViewId.RECENTLY_PICKED)
				            .addView(google.picker.ViewId.IMAGE_SEARCH)
				            .addView(google.picker.ViewId.VIDEO_SEARCH)
				            .addView(google.picker.ViewId.MAPS);
						
						if (urlParams['photos'] == '1')
						{
							picker.addView(google.picker.ViewId.PHOTOS)
				            	.addView(google.picker.ViewId.PHOTO_ALBUMS)
				            	.addView(google.picker.ViewId.PHOTO_UPLOAD)
						}
						
						editorUi.linkPicker = picker.setCallback(function(data)
						{
							LinkDialog.filePicked(data);
					    }).build();
					}
					
					editorUi.linkPicker.setVisible(true);
					editorUi.movePickersToTop();
				}));
			}
		});
		gpBtn.className = 'geBtn';
		btns.appendChild(gpBtn);
	}
	
	if (typeof(Dropbox) != 'undefined' && typeof(Dropbox.choose) != 'undefined')
	{
		var dbBtn = mxUtils.button(mxResources.get('dropbox'), function()
		{
			// Authentication will be carried out on open to make sure the
			// autosave does not show an auth dialog. Showing it here will
			// block the second dialog (the file picker) so it's too early.
			Dropbox.choose(
			{
				linkType : 'direct',
				cancel: function()
				{
					// do nothing
		        },
				success : function(files)
				{
					linkInput.value = files[0].link;
				}
			});
		});
		dbBtn.className = 'geBtn';
		btns.appendChild(dbBtn);
	}
	
	if (typeof(WL) != 'undefined' && typeof(WL.fileDialog) != 'undefined' && editorUi.oneDrive != null)
	{
		var dbBtn = mxUtils.button(mxResources.get('oneDrive'), function()
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('authorizing')))
			{
				editorUi.oneDrive.execute(mxUtils.bind(this, function(token)
				{
					if (token != null)
					{
						editorUi.spinner.stop();
						
					    WL.fileDialog(
				        {
				            mode: 'open',
				            select: 'single'
				        }).then(
				            function (resp)
				            {
				            	if (resp != null && resp.data != null && resp.data.files != null && resp.data.files.length > 0)
				            	{
			            			linkInput.value = resp.data.files[0].link;
				            	}
				            },
				            function (responseFailed) {}
				        );
					}
				}));
			}
		});
		dbBtn.className = 'geBtn';
		btns.appendChild(dbBtn);
	}

	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			editorUi.hideDialog();
			fn(linkInput.value, LinkDialog.selectedDocs);
		}
	});

	btns.appendChild(mainBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 * Constructs a new about dialog
 */
var AboutDialog = function(editorUi)
{
	var div = document.createElement('div');
	div.style.marginTop = '6px';
	div.setAttribute('align', 'center');
	
	var img = document.createElement('img');
	img.style.border = '0px';
	img.setAttribute('width', '176');
	img.setAttribute('width', '151');
	img.style.width = '170px';
	img.style.height = '219px';
	img.setAttribute('src', IMAGE_PATH + '/logo-flat.png');
	div.appendChild(img);
	mxUtils.br(div);
	
	var v = document.createElement('small');
	v.innerHTML = 'v ' + EditorUi.VERSION;
	v.style.color = '#505050';
	div.appendChild(v);
	
	mxUtils.br(div);
	mxUtils.br(div);

	var small = document.createElement('small');
	small.style.color = '#505050';
	small.innerHTML = '&copy; 2005-2016 <a href="https://www.jgraph.com/" style="color:inherit;" target="_blank">JGraph Ltd</a>.<br>All Rights Reserved.';
	div.appendChild(small);
	
	mxEvent.addListener(div, 'click', function(e)
	{
		if (mxEvent.getSource(e).nodeName != 'A')
		{
			editorUi.hideDialog();
		}
	});
	
	this.container = div;
};

/**
 * Constructs a new about dialog
 */
var FeedbackDialog = function(editorUi)
{
	var div = document.createElement('div');
	
	var label = document.createElement('div');
	mxUtils.write(label, mxResources.get('sendYourFeedbackToDrawIo'));
	label.style.fontSize = '18px';
	label.style.marginBottom = '18px';
	
	div.appendChild(label);
	
	label = document.createElement('div');
	mxUtils.write(label, mxResources.get('yourEmailAddress') + ' (' + mxResources.get('required') + ')');
	
	div.appendChild(label);
	
	var email = document.createElement('input');
	email.setAttribute('type', 'text');
	email.style.marginTop = '6px';
	email.style.width = '600px';
	
	var sendButton = mxUtils.button(mxResources.get('sendMessage'), function()
	{
		var diagram = ((cb.checked) ? '\nDiagram:\n' + editorUi.getFileData() : '') +
			'\nBrowser:\n' + navigator.userAgent;
		
		if (diagram.length > FeedbackDialog.maxAttachmentSize)
		{
			editorUi.alert(mxResources.get('drawingTooLarge'));
		}
		else
		{
			editorUi.hideDialog();
			
			if (editorUi.spinner.spin(document.body))
			{
				mxUtils.post('/email', 'email=' + encodeURIComponent(email.value) +
						'&version=' + encodeURIComponent(EditorUi.VERSION) +
						'&url=' + encodeURIComponent(window.location.href) +
						'&body=' + encodeURIComponent('Feedback:\n' + textarea.value + diagram),
					function(req)
					{
						editorUi.spinner.stop();
					
						if (req.getStatus() == 200)
						{
							editorUi.alert(mxResources.get('feedbackSent'));
						}
						else
						{
							editorUi.alert(mxResources.get('errorSendingFeedback'));
						}
					},
					function()
					{
						editorUi.spinner.stop();
						editorUi.alert(mxResources.get('errorSendingFeedback'));
					});
			}
		}
	});
	sendButton.className = 'geBtn gePrimaryBtn';
	
	sendButton.setAttribute('disabled', 'disabled');
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	mxEvent.addListener(email, 'change', function()
	{
		if (email.value.length > 0 && re.test(email.value) > 0)
		{
			sendButton.removeAttribute('disabled');
		}
		else
		{
			sendButton.setAttribute('disabled', 'disabled');
		}
	});
	
	mxEvent.addListener(email, 'keyup', function()
	{
		if (email.value.length > 0 && re.test(email.value))
		{
			sendButton.removeAttribute('disabled');
		}
		else
		{
			sendButton.setAttribute('disabled', 'disabled');
		}
	});
	
	div.appendChild(email);
	
	this.init = function()
	{
		email.focus();
	};
	
	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.setAttribute('checked', 'checked');
	cb.defaultChecked = true;
	
	var p2 = document.createElement('p');
	p2.style.marginTop = '14px';
	p2.appendChild(cb);
	
	var span = document.createElement('span');
	mxUtils.write(span, ' ' + mxResources.get('includeCopyOfMyDiagram'));
	p2.appendChild(span);
	
	mxEvent.addListener(span, 'click', function(evt)
	{
		cb.checked = !cb.checked;
		mxEvent.consume(evt);
	});
	
	div.appendChild(p2);
	
	label = document.createElement('div');
	mxUtils.write(label, mxResources.get('feedback'));
	
	div.appendChild(label);
	
	var textarea = document.createElement('textarea');
	textarea.style.resize = 'none';
	textarea.style.width = '600px';
	textarea.style.height = '140px';
	textarea.style.marginTop = '6px';
	
	textarea.setAttribute('placeholder', mxResources.get('commentsNotes'));
	
	div.appendChild(textarea);

	var buttons = document.createElement('div');
	buttons.style.marginTop = '26px';
	buttons.style.textAlign = 'right';

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		buttons.appendChild(sendButton);
	}
	else
	{
		buttons.appendChild(sendButton);
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	this.container = div;
};

/**
 * Maximum size of attachments in bytes. Default is 1000000.
 */
FeedbackDialog.maxAttachmentSize = 1000000;

/**
 * Constructs a new revision dialog
 */
var RevisionDialog = function(editorUi, revs)
{
	var div = document.createElement('div');
	
	var title = document.createElement('h3');
	title.style.marginTop = '0px';
	mxUtils.write(title, mxResources.get('revisionHistory'));
	div.appendChild(title);
	
	var list = document.createElement('div');
	list.style.position = 'absolute';
	list.style.overflow = 'auto';
	list.style.width = '170px';
	list.style.height = '378px';
	div.appendChild(list);
	
	var container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.border = '1px solid lightGray';
	container.style.left = '199px';
	container.style.width = '470px';
	container.style.height = '376px';
	container.style.overflow = 'hidden';
	
	mxEvent.disableContextMenu(container);
	div.appendChild(container);

	var graph = new Graph(container);
	graph.setEnabled(false);
	graph.setPanning(true);
	graph.panningHandler.ignoreCell = true;
	graph.panningHandler.useLeftButtonForPanning = true;
	graph.minFitScale = null;
	graph.maxFitScale = null;
	graph.centerZoom = true;
	
	// Handles placeholders for pages
	var currentPage = 0;
	var diagrams = null;
	var realPage = 0;
	
	var graphGetGlobalVariable = graph.getGlobalVariable;
	
	graph.getGlobalVariable = function(name)
	{
		if (name == 'page' && diagrams != null && diagrams[realPage] != null)
		{
			return diagrams[realPage].getAttribute('name');
		}
		else if (name == 'pagenumber')
		{
			return realPage + 1;
		}
		
		return graphGetGlobalVariable.apply(this, arguments);
	};
	
	// Disables hyperlinks
	graph.getLinkForCell = function()
	{
		return null;
	};

	if (Editor.MathJaxRender)
	{
		graph.addListener(mxEvent.SIZE, mxUtils.bind(this, function(sender, evt)
		{
			// LATER: Math support is used if current graph has math enabled
			// should use switch from history instead but requires setting the
			// global mxClient.NO_FO switch
			if (editorUi.editor.graph.mathEnabled)
			{
				Editor.MathJaxRender(graph.container);
			}
		}));
	}
	
	var opts = {
	  lines: 11, // The number of lines to draw
	  length: 15, // The length of each line
	  width: 6, // The line thickness
	  radius: 10, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 0, // The rotation offset
	  direction: 1, // 1: clockwise, -1: counterclockwise
	  color: '#000', // #rgb or #rrggbb or array of colors
	  speed: 1.4, // Rounds per second
	  trail: 60, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: '50%', // Top position relative to parent
	  left: '50%' // Left position relative to parent
	};
	
	var spinner = new Spinner(opts);

	var file = editorUi.getCurrentFile();
	var currentRow = null;
	var currentRev = null;
	var currentDoc = null;
	var currentXml = null;
	
	var zoomInBtn = mxUtils.button('', function()
	{
		if (currentDoc != null)
		{
			graph.zoomIn();
		}
	});
	zoomInBtn.className = 'geSprite geSprite-zoomin';
	zoomInBtn.setAttribute('title', mxResources.get('zoomIn'));
	zoomInBtn.style.outline = 'none';
	zoomInBtn.style.border = 'none';
	zoomInBtn.style.margin = '2px';
	zoomInBtn.setAttribute('disabled', 'disabled');
	mxUtils.setOpacity(zoomInBtn, 20);
	
	var zoomOutBtn = mxUtils.button('', function()
	{
		if (currentDoc != null)
		{
			graph.zoomOut();
		}
	});
	zoomOutBtn.className = 'geSprite geSprite-zoomout';
	zoomOutBtn.setAttribute('title', mxResources.get('zoomOut'));
	zoomOutBtn.style.outline = 'none';
	zoomOutBtn.style.border = 'none';
	zoomOutBtn.style.margin = '2px';
	zoomOutBtn.setAttribute('disabled', 'disabled');
	mxUtils.setOpacity(zoomOutBtn, 20);

	var zoomFitBtn = mxUtils.button('', function()
	{
		if (currentDoc != null)
		{
			graph.maxFitScale = 8;
			graph.fit(8);
			graph.center();
		}
	});
	zoomFitBtn.className = 'geSprite geSprite-fit';
	zoomFitBtn.setAttribute('title', mxResources.get('fit'));
	zoomFitBtn.style.outline = 'none';
	zoomFitBtn.style.border = 'none';
	zoomFitBtn.style.margin = '2px';
	zoomFitBtn.setAttribute('disabled', 'disabled');
	mxUtils.setOpacity(zoomFitBtn, 20);
	
	var zoomActualBtn = mxUtils.button('', function()
	{
		if (currentDoc != null)
		{
			graph.zoomActual();
			graph.center();
		}
	});
	zoomActualBtn.className = 'geSprite geSprite-actualsize';
	zoomActualBtn.setAttribute('title', mxResources.get('actualSize'));
	zoomActualBtn.style.outline = 'none';
	zoomActualBtn.style.border = 'none';
	zoomActualBtn.style.margin = '2px';
	zoomActualBtn.setAttribute('disabled', 'disabled');
	mxUtils.setOpacity(zoomActualBtn, 20);
	
	var fileInfo = document.createElement('div');
	fileInfo.style.position = 'absolute';
	fileInfo.style.textAlign = 'right';
	fileInfo.style.color = 'gray';
	fileInfo.style.marginTop = '10px';
	fileInfo.style.backgroundColor = 'transparent';
	fileInfo.style.top = '440px';
	fileInfo.style.right = '32px';
	fileInfo.style.maxWidth = '380px';
	fileInfo.style.cursor = 'default';

	var downloadBtn = mxUtils.button(mxResources.get('download'), function()
	{
		if (currentDoc != null)
		{
    		var file = editorUi.getCurrentFile();
    		var filename = (file != null && file.getTitle() != null) ? file.getTitle() : editorUi.defaultFilename;
    		var data = mxUtils.getXml(currentDoc.documentElement);

	    	if (editorUi.isLocalFileSave())
	    	{
	    		editorUi.saveLocalFile(data, filename, 'text/xml');
	    	}
	    	else
	    	{
	    		var param = (typeof(pako) === 'undefined') ? '&xml=' + encodeURIComponent(data) :
	    			'&data=' + encodeURIComponent(editorUi.editor.graph.compress(data));
	    		new mxXmlRequest(SAVE_URL, 'filename=' + encodeURIComponent(filename) +
	    			'&format=xml' + param).simulate(document, '_blank');
	    	}
		}
	});
	downloadBtn.className = 'geBtn';
	downloadBtn.setAttribute('disabled', 'disabled');

	var restoreBtn = mxUtils.button(mxResources.get('restore'), function()
	{
		if (currentDoc != null && currentXml != null)
		{
			editorUi.confirm(mxResources.get('areYouSure'), function()
			{
				if (editorUi.spinner.spin(document.body, mxResources.get('restoring')))
				{
					file.save(true, function(resp)
					{
						editorUi.spinner.stop();
						editorUi.replaceFileData(currentXml);
						editorUi.hideDialog();
					}, function(resp)
					{
						editorUi.spinner.stop();
						editorUi.editor.setStatus('');
						editorUi.handleError(resp, (resp != null) ? mxResources.get('errorSavingFile') : null);
					});
				}
			});
		}
	});
	restoreBtn.className = 'geBtn';
	restoreBtn.setAttribute('disabled', 'disabled');
	
	var pageSelect = document.createElement('select');
	pageSelect.setAttribute('disabled', 'disabled');
	pageSelect.style.maxWidth = '80px';
	pageSelect.style.position = 'relative';
	pageSelect.style.top = '-2px';
	pageSelect.style.verticalAlign = 'bottom';
	pageSelect.style.marginRight = '6px';
	pageSelect.style.display = 'none';
	
	var pageSelectFunction = null;
	
	mxEvent.addListener(pageSelect, 'change', function(evt)
	{
		if (pageSelectFunction != null)
		{
			pageSelectFunction(evt);
			mxEvent.consume(evt);
		}
	});
	
	var newBtn = mxUtils.button(mxResources.get('openInNewWindow'), function()
	{
		if (currentDoc != null)
		{
			window.openFile = new OpenFile(function()
			{
				window.openFile = null;
			});
			
			window.openFile.setData(mxUtils.getXml(currentDoc.documentElement));
			window.openWindow(editorUi.getUrl());
		}
	});
	newBtn.className = 'geBtn';
	newBtn.setAttribute('disabled', 'disabled');
	
	var showBtn = mxUtils.button(mxResources.get('show'), function()
	{
		if (currentRev != null)
		{
			window.open(currentRev.getUrl());
		}
	});
	showBtn.className = 'geBtn gePrimaryBtn';
	showBtn.setAttribute('disabled', 'disabled');

	var buttons = document.createElement('div');
	buttons.style.position = 'absolute';
	buttons.style.top = '482px';
	buttons.style.width = '640px';
	buttons.style.textAlign = 'right';

	var tb = document.createElement('div');
	tb.className = 'geToolbarContainer';
	tb.style.backgroundColor = 'transparent';
	tb.style.padding = '2px';
	tb.style.border = 'none';
	tb.style.left = '199px';
	tb.style.top = '442px';
	
	var currentElt = null;
	
	if (file == null || (editorUi.drive == null && file.constructor == window.DriveFile) ||
		(editorUi.dropbox == null && file.constructor == window.DropboxFile))
	{
		container.style.display = 'none';
		tb.style.display = 'none';
		mxUtils.write(list, mxResources.get('notAvailable'));
	}
	else
	{
		if (revs != null && revs.length > 0)
		{
			container.style.cursor = 'move';
			
			var table = document.createElement('table');
			table.style.border = '1px solid lightGray';
			table.style.borderCollapse = 'collapse';
			table.style.borderSpacing = '0px';
			table.style.width = '100%';
			var tbody = document.createElement('tbody');
			var today = new Date().toDateString();

			if (editorUi.currentPage != null && editorUi.pages != null)
			{
				currentPage = mxUtils.indexOf(editorUi.pages, editorUi.currentPage);
			}
			
			for (var i = revs.length - 1; i >= 0; i--)
			{
				var elt = (function(item)
				{
					var ts = new Date(item.modifiedDate);
					var row = null;
					var pd = '6px';
					
					// Workaround for negative timestamps in Dropbox
					if (ts.getTime() >= 0)
					{
						row = document.createElement('tr');
						row.style.borderBottom = '1px solid lightGray';
						row.style.fontSize = '12px';
						row.style.cursor = 'pointer';
						
						var date = document.createElement('td');
						date.style.padding = pd;
						date.style.whiteSpace = 'nowrap';
						
						if (item == revs[revs.length - 1])
						{
							mxUtils.write(date, mxResources.get('current'));
						}
						else
						{
							if (ts.toDateString() === today)
							{
								mxUtils.write(date, ts.toLocaleTimeString());
							}
							else
							{
								mxUtils.write(date, ts.toLocaleDateString() + ' ' +
									ts.toLocaleTimeString());
							}
						}
						
						row.appendChild(date);
	
						row.setAttribute('title', ts.toLocaleDateString() + ' ' +
							ts.toLocaleTimeString() + ' ' +
							editorUi.formatFileSize(parseInt(item.fileSize)) +
							((item.lastModifyingUserName != null) ? ' ' +
							item.lastModifyingUserName : ''));

						function updateGraph(xml)
						{
							spinner.stop();
							var doc = mxUtils.parseXml(xml);
							var node = editorUi.editor.extractGraphModel(doc.documentElement, true);
							
							if (node != null)
							{
								pageSelect.style.display = 'none';
								pageSelect.innerHTML = '';
								currentDoc = doc;
								currentXml = xml;
								parseSelectFunction = null;
								diagrams = null;
								realPage = 0;
								
								function parseGraphModel(dataNode)
								{
									var bg = dataNode.getAttribute('background');
									
									if (bg == null || bg == '' || bg == mxConstants.NONE)
									{
										bg = '#ffffff';
									}
									
									container.style.backgroundColor = bg;
									
									var codec = new mxCodec(dataNode.ownerDocument);
									codec.decode(dataNode, graph.getModel());
									graph.maxFitScale = 1;
									graph.fit(8);
									graph.center();
									
									return dataNode;
								}
								
								function parseDiagram(diagramNode)
								{
									if (diagramNode != null)
									{
										diagramNode = parseGraphModel(mxUtils.parseXml(editorUi.editor.graph.decompress(
									        	mxUtils.getTextContent(diagramNode))).documentElement);
									}
									
									return diagramNode;
								}

								if (node.nodeName == 'mxfile')
								{
									// Workaround for "invalid calling object" error in IE
									var tmp = node.getElementsByTagName('diagram');
									diagrams = [];
									
									for (var i = 0; i < tmp.length; i++)
									{
										diagrams.push(tmp[i]);	
									}
									
									realPage = Math.min(currentPage, diagrams.length - 1);
									
									if (diagrams.length > 0)
									{
										parseDiagram(diagrams[realPage]);
									}
									
									if (diagrams.length > 1)
									{
										pageSelect.removeAttribute('disabled');
										pageSelect.style.display = '';
	
										for (var i = 0; i < diagrams.length; i++)
										{
											var pageOption = document.createElement('option');
											mxUtils.write(pageOption, diagrams[i].getAttribute('name') ||
												mxResources.get('pageWithNumber', [i + 1]));
											pageOption.setAttribute('value', i);
											
											if (i == realPage)
											{
												pageOption.setAttribute('selected', 'selected');
											}
		
											pageSelect.appendChild(pageOption);
										}
									}
									
									pageSelectFunction = function()
									{
										currentPage = parseInt(pageSelect.value);
										realPage = currentPage;
										parseDiagram(diagrams[currentPage]);
									}
								}
								else
								{
									parseGraphModel(node);
								}
								
								fileInfo.innerHTML = '';
								mxUtils.write(fileInfo, ts.toLocaleDateString() + ' ' +
										ts.toLocaleTimeString());
								fileInfo.setAttribute('title', row.getAttribute('title'));
								zoomInBtn.removeAttribute('disabled');
								zoomOutBtn.removeAttribute('disabled');
								zoomFitBtn.removeAttribute('disabled');
								zoomActualBtn.removeAttribute('disabled');
								
								if (file == null || !file.isRestricted())
								{
									if (editorUi.editor.graph.isEnabled())
									{
										restoreBtn.removeAttribute('disabled');
									}
									
									downloadBtn.removeAttribute('disabled');
									showBtn.removeAttribute('disabled');
									newBtn.removeAttribute('disabled');
								}
								
								mxUtils.setOpacity(zoomInBtn, 60);
								mxUtils.setOpacity(zoomOutBtn, 60);
								mxUtils.setOpacity(zoomFitBtn, 60);
								mxUtils.setOpacity(zoomActualBtn, 60);
							}
							else
							{
								pageSelect.style.display = 'none';
								pageSelect.innerHTML = '';
								fileInfo.innerHTML = '';
								mxUtils.write(fileInfo, mxResources.get('errorLoadingFile'));
							}
						};
						
						mxEvent.addListener(row, 'click', function(evt)
						{
							if (currentRev != item)
							{
								spinner.stop();
								
								if (currentRow != null)
								{
									currentRow.style.backgroundColor = '';
								}
								
								currentRev = item;
								currentRow = row;
								currentRow.style.backgroundColor = '#ebf2f9';
								currentDoc = null;
								currentXml = null;

								fileInfo.removeAttribute('title');
								fileInfo.innerHTML = mxResources.get('loading') + '...';
								container.style.backgroundColor = '#ffffff';
								graph.getModel().clear();
		
								restoreBtn.setAttribute('disabled', 'disabled');
								downloadBtn.setAttribute('disabled', 'disabled');
								zoomInBtn.setAttribute('disabled', 'disabled');
								zoomOutBtn.setAttribute('disabled', 'disabled');
								zoomActualBtn.setAttribute('disabled', 'disabled');
								zoomFitBtn.setAttribute('disabled', 'disabled');
								newBtn.setAttribute('disabled', 'disabled');
								showBtn.setAttribute('disabled', 'disabled');
								pageSelect.setAttribute('disabled', 'disabled');
								
								mxUtils.setOpacity(zoomInBtn, 20);
								mxUtils.setOpacity(zoomOutBtn, 20);
								mxUtils.setOpacity(zoomFitBtn, 20);
								mxUtils.setOpacity(zoomActualBtn, 20);
								
								spinner.spin(container);
								
								item.getXml(function(xml)
					   			{
									if (currentRev == item)
									{
										updateGraph(xml);
									}
					   			}, function(err)
					   			{
					   				spinner.stop();
									pageSelect.style.display = 'none';
									pageSelect.innerHTML = '';
					   				fileInfo.innerHTML = '';
									mxUtils.write(fileInfo, mxResources.get('errorLoadingFile'));
					   			});

								mxEvent.consume(evt);
							}
						});
						
						mxEvent.addListener(row, 'dblclick', function(evt)
						{
							showBtn.click();
							
							if (window.getSelection)
							{
								window.getSelection().removeAllRanges();
							}
						    else if (document.selection)
						    {
						    	document.selection.empty();
						    }
							
							mxEvent.consume(evt);
						}, false);
						
						tbody.appendChild(row);
					}

					return row;
				})(revs[i]);
				
				// Selects and loads first element in list (ie current version) after
				// graph container was initialized since there is no loading delay
				if (elt != null && i == revs.length - 1)
				{
					currentElt = elt;
				}
			}
			
			table.appendChild(tbody);
			list.appendChild(table);
		}
		else
		{
			container.style.display = 'none';
			tb.style.display = 'none';
			mxUtils.write(list, mxResources.get('noRevisions'));
		}
	}
	
	this.init = function()
	{
		if (currentElt != null)
		{
			currentElt.click();
		}
	};

	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});
	closeBtn.className = 'geBtn';

	tb.appendChild(pageSelect);
	tb.appendChild(zoomInBtn);
	tb.appendChild(zoomOutBtn);
	tb.appendChild(zoomActualBtn);
	tb.appendChild(zoomFitBtn);

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(closeBtn);
		buttons.appendChild(downloadBtn);
		buttons.appendChild(newBtn);
		buttons.appendChild(restoreBtn);
		buttons.appendChild(showBtn);
	}
	else
	{
		buttons.appendChild(downloadBtn);
		buttons.appendChild(newBtn);
		buttons.appendChild(restoreBtn);
		buttons.appendChild(showBtn);
		buttons.appendChild(closeBtn);
	}

	div.appendChild(buttons);
	div.appendChild(tb);
	div.appendChild(fileInfo);

	this.container = div;
};

/**
 * Constructs a new revision dialog
 */
var DraftDialog = function(editorUi, title, xml, editFn, discardFn, editLabel, discardLabel)
{
	var div = document.createElement('div');
	
	var titleDiv = document.createElement('div');
	titleDiv.style.marginTop = '0px';
	mxUtils.write(titleDiv, title);
	div.appendChild(titleDiv);
	
	var container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.border = '1px solid lightGray';
	container.style.marginTop = '10px';
	container.style.width = '640px';
	container.style.height = '386px';
	container.style.overflow = 'hidden';
	
	mxEvent.disableContextMenu(container);
	div.appendChild(container);

	var graph = new Graph(container);
	graph.setEnabled(false);
	graph.setPanning(true);
	graph.panningHandler.ignoreCell = true;
	graph.panningHandler.useLeftButtonForPanning = true;
	graph.minFitScale = null;
	graph.maxFitScale = null;
	graph.centerZoom = true;
	
	// Handles placeholders for pages
	var doc = mxUtils.parseXml(xml);
	var node = editorUi.editor.extractGraphModel(doc.documentElement, true);
	var currentPage = 0;
	var diagrams = null;
	var graphGetGlobalVariable = graph.getGlobalVariable;

	graph.getGlobalVariable = function(name)
	{
		if (name == 'page' && diagrams != null && diagrams[currentPage] != null)
		{
			return diagrams[currentPage].getAttribute('name');
		}
		else if (name == 'pagenumber')
		{
			return currentPage + 1;
		}
		
		return graphGetGlobalVariable.apply(this, arguments);
	};
	
	// Disables hyperlinks
	graph.getLinkForCell = function()
	{
		return null;
	};

	// TODO: Enable per-page math
//	if (Editor.MathJaxRender)
//	{
//		graph.addListener(mxEvent.SIZE, mxUtils.bind(this, function(sender, evt)
//		{
//			// LATER: Math support is used if current graph has math enabled
//			// should use switch from history instead but requires setting the
//			// global mxClient.NO_FO switch
//			if (editorUi.editor.graph.mathEnabled)
//			{
//				Editor.MathJaxRender(graph.container);
//			}
//		}));
//	}

	var zoomInBtn = mxUtils.button('', function()
	{
		graph.zoomIn();
	});
	zoomInBtn.className = 'geSprite geSprite-zoomin';
	zoomInBtn.setAttribute('title', mxResources.get('zoomIn'));
	zoomInBtn.style.outline = 'none';
	zoomInBtn.style.border = 'none';
	zoomInBtn.style.margin = '2px';
	mxUtils.setOpacity(zoomInBtn, 60);
	
	var zoomOutBtn = mxUtils.button('', function()
	{
		graph.zoomOut();
	});
	zoomOutBtn.className = 'geSprite geSprite-zoomout';
	zoomOutBtn.setAttribute('title', mxResources.get('zoomOut'));
	zoomOutBtn.style.outline = 'none';
	zoomOutBtn.style.border = 'none';
	zoomOutBtn.style.margin = '2px';
	mxUtils.setOpacity(zoomOutBtn, 60);

	var zoomFitBtn = mxUtils.button('', function()
	{
		graph.maxFitScale = 8;
		graph.fit(8);
		graph.center();
	});
	zoomFitBtn.className = 'geSprite geSprite-fit';
	zoomFitBtn.setAttribute('title', mxResources.get('fit'));
	zoomFitBtn.style.outline = 'none';
	zoomFitBtn.style.border = 'none';
	zoomFitBtn.style.margin = '2px';
	mxUtils.setOpacity(zoomFitBtn, 60);
	
	var zoomActualBtn = mxUtils.button('', function()
	{
		graph.zoomActual();
		graph.center();
	});
	zoomActualBtn.className = 'geSprite geSprite-actualsize';
	zoomActualBtn.setAttribute('title', mxResources.get('actualSize'));
	zoomActualBtn.style.outline = 'none';
	zoomActualBtn.style.border = 'none';
	zoomActualBtn.style.margin = '2px';
	mxUtils.setOpacity(zoomActualBtn, 60);

	var restoreBtn = mxUtils.button(discardLabel || mxResources.get('discard'), discardFn);
	restoreBtn.className = 'geBtn';
	
	var pageSelect = document.createElement('select');
	pageSelect.style.maxWidth = '80px';
	pageSelect.style.position = 'relative';
	pageSelect.style.top = '-2px';
	pageSelect.style.verticalAlign = 'bottom';
	pageSelect.style.marginRight = '6px';
	pageSelect.style.display = 'none';

	var showBtn = mxUtils.button(editLabel || mxResources.get('edit'), editFn);
	showBtn.className = 'geBtn gePrimaryBtn';

	var buttons = document.createElement('div');
	buttons.style.position = 'absolute';
	buttons.style.top = '470px';
	buttons.style.width = '640px';
	buttons.style.textAlign = 'right';

	var tb = document.createElement('div');
	tb.className = 'geToolbarContainer';
	tb.style.cssText = 'box-shadow:none !important;background-color:transparent;' +
		'padding:2px;border-style:none !important;top:470px;';

	this.init = function()
	{
		function parseGraphModel(dataNode)
		{
			if (dataNode != null)
			{
				var bg = dataNode.getAttribute('background');
				
				if (bg == null || bg == '' || bg == mxConstants.NONE)
				{
					bg = '#ffffff';
				}
				
				container.style.backgroundColor = bg;
				
				var codec = new mxCodec(dataNode.ownerDocument);
				codec.decode(dataNode, graph.getModel());
				graph.maxFitScale = 1;
				graph.fit(8);
				graph.center();
			}
		};
			
		function parseDiagram(diagramNode)
		{
			if (diagramNode != null)
			{
				diagramNode = parseGraphModel(mxUtils.parseXml(editorUi.editor.graph.decompress(
			        	mxUtils.getTextContent(diagramNode))).documentElement);
			}
			
			return diagramNode;
		};

		mxEvent.addListener(pageSelect, 'change', function(evt)
		{
			currentPage = parseInt(pageSelect.value);
			parseDiagram(diagrams[currentPage]);
			mxEvent.consume(evt);
		});
		
		if (node.nodeName == 'mxfile')
		{
			// Workaround for "invalid calling object" error in IE
			var tmp = node.getElementsByTagName('diagram');
			diagrams = [];
			
			for (var i = 0; i < tmp.length; i++)
			{
				diagrams.push(tmp[i]);	
			}
			
			if (diagrams.length > 0)
			{
				parseDiagram(diagrams[currentPage]);
			}
			
			if (diagrams.length > 1)
			{
				pageSelect.style.display = '';
	
				for (var i = 0; i < diagrams.length; i++)
				{
					var pageOption = document.createElement('option');
					mxUtils.write(pageOption, diagrams[i].getAttribute('name') ||
						mxResources.get('pageWithNumber', [i + 1]));
					pageOption.setAttribute('value', i);
					
					if (i == currentPage)
					{
						pageOption.setAttribute('selected', 'selected');
					}
	
					pageSelect.appendChild(pageOption);
				}
			}
		}
		else
		{
			parseGraphModel(node);
		}
	};
	
	tb.appendChild(pageSelect);
	tb.appendChild(zoomInBtn);
	tb.appendChild(zoomOutBtn);
	tb.appendChild(zoomActualBtn);
	tb.appendChild(zoomFitBtn);
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog(true);
	});
	
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		buttons.appendChild(restoreBtn);
		buttons.appendChild(showBtn);
	}
	else
	{
		buttons.appendChild(showBtn);
		buttons.appendChild(restoreBtn);
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	div.appendChild(tb);

	this.container = div;
};

/**
 * 
 */
var FindWindow = function(ui, x, y, w, h)
{
	var action = ui.actions.get('find');
	var graph = ui.editor.graph;
	var lastSearch = null;
	var lastFound = null;

	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.padding = '10px';
	div.style.height = '100%';

	var searchInput = document.createElement('input');
	searchInput.setAttribute('placeholder', mxResources.get('find'));
	searchInput.setAttribute('type', 'text');
	searchInput.style.marginTop = '4px';
	searchInput.style.width = '170px';
	searchInput.style.fontSize = '12px';
	searchInput.style.borderRadius = '4px';
	searchInput.style.padding = '6px';
	div.appendChild(searchInput);

	var tmp = document.createElement('div');
	
	function testMeta(re, cell)
	{
		if (typeof cell.value === 'object' && cell.value.attributes != null)
		{
			var attrs = cell.value.attributes;
			
			for (var i = 0; i < attrs.length; i++)
			{
				if (attrs[i].nodeName != 'label' && re.test(attrs[i].nodeValue.toLowerCase()))
				{
					return true;
				}	
			}
		}
		
		return false;
	};
	
	function search()
	{
		var cells = graph.model.getDescendants(graph.model.getRoot());
		var search = searchInput.value.toLowerCase();
		var re = new RegExp(search);
		var firstMatch = null;
		
		if (lastSearch != search)
		{
			lastSearch = search;
			lastFound = null;
		}

		var active = lastFound == null;
		
		if (graph.isEnabled() && search.length > 0)
		{
			for (var i = 0; i < cells.length; i++)
			{
				var state = graph.view.getState(cells[i]);
				
				if (state != null && state.cell.value != null && (active || firstMatch == null) &&
					(graph.model.isVertex(state.cell) || graph.model.isEdge(state.cell)))
				{
					if (graph.isHtmlLabel(state.cell))
					{
						tmp.innerHTML = graph.getLabel(state.cell);
						label = mxUtils.extractTextWithWhitespace([tmp]);
					}
					else
					{					
						label = graph.getLabel(state.cell);
					}
		
					label = mxUtils.trim(label.replace(/[\x00-\x1F\x7F-\x9F]|\s+/g, ' ')).toLowerCase();
					
					if (re.test(label) || testMeta(re, state.cell))
					{
						if (active)
						{
							firstMatch = state;
						
							break;
						}
						else if (firstMatch == null)
						{
							firstMatch = state;
						}
					}
				}
	
				active = active || state == lastFound;
			}
		}
					
		if (firstMatch != null)
		{
			lastFound = firstMatch;
			graph.setSelectionCell(lastFound.cell);
			graph.scrollCellToVisible(lastFound.cell);
		}
		else
		{
			graph.clearSelection();
		}
		
		return !graph.isEnabled() || search.length == 0 || firstMatch != null;
	};

	mxUtils.br(div);

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		searchInput.value = '';
		searchInput.style.backgroundColor = '';
		lastFound = null;
		lastSearch = null;
		searchInput.focus();
	});
	
	resetBtn.setAttribute('title', mxResources.get('reset'));
	resetBtn.style.marginTop = '8px';
	resetBtn.style.marginRight = '4px';
	resetBtn.style.backgroundColor = '#f5f5f5';
	resetBtn.style.backgroundImage = 'none';
	resetBtn.className = 'geBtn';
	
	div.appendChild(resetBtn);

	var btn = mxUtils.button(mxResources.get('find'), function()
	{
		searchInput.style.backgroundColor = search() ? '' : '#ffcfcf';
	});
	
	btn.setAttribute('title', mxResources.get('find') + ' (Enter)');
	btn.style.marginTop = '8px';
	btn.style.backgroundColor = '#4d90fe';
	btn.style.backgroundImage = 'none';
	btn.className = 'geBtn gePrimaryBtn';
	
	div.appendChild(btn);
	
	mxEvent.addListener(searchInput, 'keyup', function(evt)
	{
		// Ctrl or Cmd keys
		if (evt.keyCode == 91 || evt.keyCode == 17)
		{
			// Workaround for lost focus on show
			mxEvent.consume(evt);
		}
		else if (evt.keyCode == 27)
		{
			action.funct();
		}
		else if (lastSearch != searchInput.value.toLowerCase() || evt.keyCode == 13)
		{
			searchInput.style.backgroundColor = search() ? '' : '#ffcfcf';
		}
	});

	mxEvent.addListener(div, 'keydown', function(evt)
	{
		if (evt.keyCode == 70 && ui.keyHandler.isControlDown(evt) && !mxEvent.isShiftDown(evt))
		{
			action.funct();
			mxEvent.consume(evt);
		}
	});

	this.window = new mxWindow(mxResources.get('find'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(false);
	this.window.setClosable(true);
	
	this.window.addListener('show', mxUtils.bind(this, function()
	{
		if (this.window.isVisible())
		{
			searchInput.focus();
			
			if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
			{
				searchInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
		else
		{
			graph.container.focus();
		}
	}));
};

/**
 * 
 */
var TagsWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;
	var propertyName = 'tags';

	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.padding = '10px';
	div.style.height = '100%';
	
	var searchInput = document.createElement('input');
	searchInput.setAttribute('placeholder', mxResources.get('allTags'));
	searchInput.setAttribute('type', 'text');
	searchInput.style.marginTop = '4px';
	searchInput.style.width = '240px';
	searchInput.style.fontSize = '12px';
	searchInput.style.borderRadius = '4px';
	searchInput.style.padding = '6px';
	div.appendChild(searchInput);
	
	mxEvent.addListener(searchInput, 'dblclick', function()
	{
		var dlg = new FilenameDialog(editorUi, propertyName, mxResources.get('ok'), mxUtils.bind(this, function(name)
		{
			if (name != null && name.length > 0)
			{
				propertyName = name;
			}
		}), mxResources.get('enterPropertyName'));
		editorUi.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	});
	
	searchInput.setAttribute('title', mxResources.get('doubleClickChangeProperty'));

	function searchCells(cells)
	{
		cells = (cells != null) ? cells : graph.model.getDescendants(graph.model.getRoot());
		var tagList = searchInput.value.split(' ');
		var result = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			if (graph.model.isVertex(cells[i]) || graph.model.isEdge(cells[i]))
			{
				var tags = (cells[i].value != null && typeof(cells[i].value) == 'object') ?
					mxUtils.trim(cells[i].value.getAttribute(propertyName) || '') : '';
				var match = true;

				if (tags.length > 0)
				{
					var tmp = tags.toLowerCase().split(' ');
					
					for (var j = 0; j < tagList.length && match; j++)
					{
						var tag = mxUtils.trim(tagList[j]).toLowerCase();
						
						match = match && (tag.length == 0 || mxUtils.indexOf(tmp, tag) >= 0);
					}
				}
				else
				{
					match = mxUtils.trim(searchInput.value).length == 0;
				}
				
				if (match)
				{
					result.push(cells[i]);
				}
			}
		}
		
		return result;
	};

	function setCellsVisible(cells, visible)
	{	
		graph.model.beginUpdate();
		try
		{
			for (var i = 0; i < cells.length; i++)
			{
				graph.model.setVisible(cells[i], visible);
			}
		}
		finally
		{
			graph.model.endUpdate();
		}
	};
	
	mxUtils.br(div);

	var hideBtn = mxUtils.button(mxResources.get('hide'), function()
	{
		setCellsVisible(searchCells(), false);
	});
	
	hideBtn.setAttribute('title', mxResources.get('hide'));
	hideBtn.style.marginTop = '8px';
	hideBtn.style.marginRight = '4px';
	hideBtn.style.backgroundColor = '#f5f5f5';
	hideBtn.style.backgroundImage = 'none';
	hideBtn.className = 'geBtn';
	
	div.appendChild(hideBtn);

	var showBtn = mxUtils.button(mxResources.get('show'), function()
	{
		var cells = searchCells();
		setCellsVisible(cells, true);
		graph.setSelectionCells(cells);
	});
	
	showBtn.setAttribute('title', mxResources.get('show'));
	showBtn.style.marginTop = '8px';
	showBtn.style.marginRight = '4px';
	showBtn.style.backgroundColor = '#f5f5f5';
	showBtn.style.backgroundImage = 'none';
	showBtn.className = 'geBtn';
	
	div.appendChild(showBtn);
	
	var action = editorUi.actions.get('tags');

	var btn = mxUtils.button(mxResources.get('close'), function()
	{
		action.funct();
	});
	
	btn.setAttribute('title', mxResources.get('close') + ' (Enter/Esc)');
	btn.style.marginTop = '8px';
	btn.style.backgroundColor = '#4d90fe';
	btn.style.backgroundImage = 'none';
	btn.className = 'geBtn gePrimaryBtn';
	
	div.appendChild(btn);
		
	mxEvent.addListener(searchInput, 'keyup', function(evt)
	{
		// Ctrl or Cmd keys
		if (evt.keyCode == 13 || evt.keyCode == 27)
		{
			action.funct();
		}
	});

	this.window = new mxWindow(mxResources.get('tags'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(false);
	this.window.setClosable(true);
	
	this.window.addListener('show', mxUtils.bind(this, function()
	{
		if (this.window.isVisible())
		{
			searchInput.focus();
			
			if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
			{
				searchInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
		else
		{
			graph.container.focus();
		}
	}));
};

/**
 * 
 */
var AnimationWindow = function(editorUi, x, y, w, h)
{
	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.height = '100%';
	var tbody = document.createElement('tbody');
	var tr1 = document.createElement('tr');
	var td11 = document.createElement('td');
	td11.style.width = '140px';
	var td12 = document.createElement('td');
	var tr2 = document.createElement('tr');
	tr2.style.height = '40px';
	var td21 = document.createElement('td');
	td21.setAttribute('colspan', '2');
	
	var list = document.createElement('textarea');
	list.style.overflow = 'auto';
	list.style.width = '100%';
	list.style.height = '100%';
	td11.appendChild(list);
	
	var root = editorUi.editor.graph.getModel().getRoot();
	
	if (root.value != null && typeof(root.value) == 'object')
	{
		list.value = root.value.getAttribute('animation');
	}
	
	var container = document.createElement('div');
	container.style.border = '1px solid lightGray';
	container.style.background = '#ffffff';
	container.style.width = '100%';
	container.style.height = '100%';
	container.style.overflow = 'auto';
	
	mxEvent.disableContextMenu(container);
	td12.appendChild(container);
	
	var graph = new Graph(container);
	graph.setEnabled(false);
	graph.setPanning(true);
	graph.foldingEnabled = false;
	graph.panningHandler.ignoreCell = true;
	graph.panningHandler.useLeftButtonForPanning = true;
	graph.minFitScale = null;
	graph.maxFitScale = null;
	graph.centerZoom = true;
	
	// For animation and fading
	function getNodesForCells(cells)
	{
		var nodes = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			var state = graph.view.getState(cells[i]);
			
			if (state != null)
			{
				var shapes = graph.cellRenderer.getShapesForState(state);
				
				for (var j = 0; j < shapes.length; j++)
				{
					if (shapes[j] != null && shapes[j].node != null)
					{
						nodes.push(shapes[j].node);
					}
				}
				
				// Adds folding icon
				if (state.control != null && state.control.node != null)
				{
					nodes.push(state.control.node);
				}
			}
		}
		
		return nodes;
	};
	
	function fadeIn(nodes)
	{
		if (nodes != null)
		{
			for (var i = 0; i < nodes.length; i++)
			{
				mxUtils.setPrefixedStyle(nodes[i].style, 'transition', null);
				nodes[i].style.opacity = '0';
			}
			
			window.setTimeout(function()
			{
				for (var i = 0; i < nodes.length; i++)
				{
					mxUtils.setPrefixedStyle(nodes[i].style, 'transition', 'all 1s ease-in-out');
					nodes[i].style.opacity = '1';
				}
			}, 0);
		}
	};
	
	function fadeOut(nodes)
	{
		if (nodes != null)
		{
			for (var i = 0; i < nodes.length; i++)
			{
				mxUtils.setPrefixedStyle(nodes[i].style, 'transition', null);
				nodes[i].style.opacity = '1';
			}
			
			window.setTimeout(function()
			{
				for (var i = 0; i < nodes.length; i++)
				{
					mxUtils.setPrefixedStyle(nodes[i].style, 'transition', 'all 1s ease-in-out');
					nodes[i].style.opacity = '0';
				}
			}, 0);
		}
	};
	
	function createEdgeAnimation(state)
	{
		var pts = state.absolutePoints.slice();
		var segs = state.segments;
		var total = state.length;
		var n = pts.length;

		return {
			execute: function(step, steps)
			{
				if (state.shape != null)
				{
					var pts2 = [pts[0]];
					var dist = total * step / steps;
					
					for (var i = 1; i < n; i++)
					{
						if (dist <= segs[i - 1])
						{
							pts2.push(new mxPoint(pts[i - 1].x + (pts[i].x - pts[i - 1].x) * dist / segs[i - 1],
								pts[i - 1].y + (pts[i].y - pts[i - 1].y) * dist / segs[i - 1]));
							
							break;
						}
						else
						{
							dist -= segs[i - 1];
							pts2.push(pts[i]);
						}
					}
					
					state.shape.points = pts2;
					state.shape.redraw();
				}
			},
			stop: function()
			{
				if (state.shape != null)
				{
					state.shape.points = pts;
					state.shape.redraw();
				}
			}
		};
	};
	
	function createVertexAnimation(state)
	{
		var bds = new mxRectangle.fromRectangle(state.shape.bounds);
		var ttr = null;
		
		if (state.text != null && state.text.node != null && state.text.node.firstChild != null)
		{
			ttr = state.text.node.firstChild.getAttribute('transform');
		}
		
		return {
			execute: function(step, steps)
			{
				if (state.shape != null)
				{
					var f = step / steps;
					state.shape.bounds = new mxRectangle(bds.x, bds.y, bds.width * f, bds.height);
					state.shape.redraw();
					
					// Text is animated using CSS3 transitions
					if (ttr != null)
					{
						state.text.node.firstChild.setAttribute('transform', ttr + ' scale(' + f + ',1)');
					}
				}
			},
			stop: function()
			{
				if (state.shape != null)
				{
					state.shape.bounds = bds;
					state.shape.redraw();
					
					if (ttr != null)
					{
						state.text.node.firstChild.setAttribute('transform', ttr);
					}
				}
			}
		};
	};

	function animateCells(cells, steps, delay)
	{
		steps = (steps != null) ? steps : 30;
		delay = (delay != null) ? delay : 30;
		
		var animations = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			var state = graph.view.getState(cells[i]);

			if (state != null && state.shape != null && graph.model.isEdge(state.cell) &&
				state.absolutePoints != null && state.absolutePoints.length > 1)
			{
				animations.push(createEdgeAnimation(state));
			}
			else if (state != null && graph.model.isVertex(state.cell) &&
					state.shape != null && state.shape.bounds != null)
			{
				animations.push(createVertexAnimation(state));
				// TODO: include descendants
			}
		}
		
		var step = 0;
		
		function animate()
		{
			if (step == steps)
			{
				window.clearInterval(thread);
				
				for (var i = 0; i < animations.length; i++)
				{
					animations[i].stop();
				}
			}
			else
			{
				for (var i = 0; i < animations.length; i++)
				{
					animations[i].execute(step, steps);
				}
				
				step++;							
			}
		}
		
		var thread = window.setInterval(animate, delay);
		animate();
	};
	
	function mapCell(cell, clone, mapping)
	{
		mapping = (mapping != null) ? mapping : new Object();
		mapping[cell.id] = clone;
		
		var childCount = cell.getChildCount();
		
		for (var i = 0; i < childCount; i++)
		{
			mapCell(cell.getChildAt(i), clone.getChildAt(i), mapping);
		}
		
		return mapping;
	};
	
	var allowedToRun = false;
	var running = false;
	
	function stop()
	{
		allowedToRun = false;
		graph.getModel().clear();
	};
	
	function run()
	{
		if (!running)
		{
			allowedToRun = true;
			running = true;
			
			graph.getModel().clear();
			graph.getModel().setRoot(graph.cloneCells([editorUi.editor.graph.getModel().getRoot()])[0]);
			graph.maxFitScale = 1;
			graph.fit(8);
			graph.center();
	
			graph.getModel().beginUpdate();
			try
			{
				for (var id in graph.getModel().cells)
				{
					var cell = graph.getModel().cells[id];
					
					if (graph.getModel().isVertex(cell) || graph.getModel().isEdge(cell))
					{
						graph.setCellStyles('opacity', '0', [cell]);
						graph.setCellStyles('noLabel', '1', [cell]);
					}
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
			
			var mapping = mapCell(editorUi.editor.graph.getModel().getRoot(), graph.getModel().getRoot());
			var steps = list.value.split('\n');
			var step = 0;
			
			function next()
			{
				if (allowedToRun && step < steps.length)
				{
					var tokens = steps[step].split(' ');
					
					if (tokens.length > 0)
					{
						if (tokens[0] == 'wait' && tokens.length > 1)
						{
							window.setTimeout(function()
							{
								step++;
								next();
							}, parseFloat(tokens[1]));
						}
						else
						{
							if (tokens.length > 1)
							{
								var cell = mapping[tokens[1]];
								
								if (cell != null)
								{
									if (tokens[0] == 'show')
									{
										graph.setCellStyles('opacity', '100', [cell]);
										graph.setCellStyles('noLabel', null, [cell]);
										
										if (tokens.length > 2 && tokens[2] == 'fade')
										{
											fadeIn(getNodesForCells([cell]));
										}
										else
										{
											animateCells([cell]);
										}
									}
									else if (tokens[0] == 'hide')
									{
										fadeOut(getNodesForCells([cell]));
									}
								}
								else
								{
									console.log('cell not found', id, steps[step]);
								}
							}
							
							step++;
							next();
						}
					}
				}
				else
				{
					running = false;
				}
			};
	
			next();
		}
	};
	
	var fadeInBtn = mxUtils.button('Fade In', function()
	{
		var cells = editorUi.editor.graph.getSelectionCells();
		
		if (cells.length > 0)
		{
			for (var i = 0; i < cells.length; i++)
			{
				list.value = list.value + 'show ' + cells[i].id + ' fade\n';
			}
			
			list.value = list.value + 'wait 1000\n';
		}
	});
	td21.appendChild(fadeInBtn);
	
	var animateBtn = mxUtils.button('Wipe In', function()
	{
		var cells = editorUi.editor.graph.getSelectionCells();
		
		if (cells.length > 0)
		{
			for (var i = 0; i < cells.length; i++)
			{
				list.value = list.value + 'show ' + cells[i].id + '\n';
			}
			
			list.value = list.value + 'wait 1000\n';
		}
	});
	td21.appendChild(animateBtn);
	
	var addBtn = mxUtils.button('Fade Out', function()
	{
		var cells = editorUi.editor.graph.getSelectionCells();
		
		if (cells.length > 0)
		{
			for (var i = 0; i < cells.length; i++)
			{
				list.value = list.value + 'hide ' + cells[i].id + '\n';
			}

			list.value = list.value + 'wait 1000\n';
		}
	});
	td21.appendChild(addBtn);
	
	var waitBtn = mxUtils.button('Wait', function()
	{
		list.value = list.value + 'wait 1000\n';
	});
	td21.appendChild(waitBtn);
	
	var runBtn = mxUtils.button('Preview', function()
	{
		run();
	});
	td21.appendChild(runBtn);
	
	var stopBtn = mxUtils.button('Stop', function()
	{
		stop();
	});
	td21.appendChild(stopBtn);
	
	var applyBtn = mxUtils.button('Apply', function()
	{
		editorUi.editor.graph.setAttributeForCell(root, 'animation', list.value);
	});
	td21.appendChild(applyBtn);
	
	var root = editorUi.editor.graph.getModel().getRoot();
	
	tr1.appendChild(td11);
	tr1.appendChild(td12);
	tbody.appendChild(tr1);
	tr2.appendChild(td21);
	tbody.appendChild(tr2);
	table.appendChild(tbody);

	this.window = new mxWindow('Animation', table, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
};

/**
 * Constructs a new auth dialog.
 */
var AuthDialog = function(editorUi, peer, showRememberOption, fn)
{
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	
	var hd = document.createElement('p');
	hd.style.fontSize = '16pt';
	hd.style.padding = '0px';
	hd.style.margin = '0px';
	hd.style.color = 'gray';
	
	mxUtils.write(hd, mxResources.get('authorizationRequired'));
	
	var service = 'Unknown';
	
	var img = document.createElement('img');
	img.setAttribute('border', '0');
	img.setAttribute('align', 'absmiddle');
	img.style.marginRight = '10px';

	if (peer == editorUi.drive)
	{
		service = mxResources.get('googleDrive');
		img.src = IMAGE_PATH + '/google-drive-logo-white.svg';
	}
	else if (peer == editorUi.dropbox)
	{
		service = mxResources.get('dropbox');
		img.src = IMAGE_PATH + '/dropbox-logo-white.svg';
	}
	else if (peer == editorUi.oneDrive)
	{
		service = mxResources.get('oneDrive');
		img.src = IMAGE_PATH + '/onedrive-logo-white.svg';
	}
	
	var p = document.createElement('p');
	mxUtils.write(p, mxResources.get('authorizeThisAppIn', [service]));

	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	
	var button = mxUtils.button(mxResources.get('authorize'), function()
	{
		editorUi.hideDialog(false);
		fn(cb.checked);
	});

	button.insertBefore(img, button.firstChild);
	button.style.marginTop = '6px';
	button.className = 'geBigButton';

	div.appendChild(hd);
	div.appendChild(p);
	div.appendChild(button);
	
	if (showRememberOption)
	{
		var p2 = document.createElement('p');
		p2.style.marginTop = '20px';
		p2.appendChild(cb);
		var span = document.createElement('span');
		mxUtils.write(span, ' ' + mxResources.get('rememberMe'));
		p2.appendChild(span);
		div.appendChild(p2);
		cb.checked = true;
		cb.defaultChecked = true;
		
		mxEvent.addListener(span, 'click', function(evt)
		{
			cb.checked = !cb.checked;
			mxEvent.consume(evt);
		});
	}
	
	this.container = div;
};

var MoreShapesDialog = function(editorUi, expanded, entries) 
{
	entries = (entries != null) ? entries : editorUi.sidebar.entries;
	var div = document.createElement('div');

	if (expanded)
	{
		var hd = document.createElement('div');
		hd.className = 'geDialogTitle';
		mxUtils.write(hd, mxResources.get('shapes'));
		hd.style.position = 'absolute';
		hd.style.top = '0px';
		hd.style.left = '0px';
		hd.style.lineHeight = '40px';
		hd.style.height = '40px';
		hd.style.right = '0px';
		
		if (mxClient.IS_QUIRKS)
		{
			hd.style.width = '718px';
		}
		
		var list = document.createElement('div');
		var preview = document.createElement('div');
		
		list.style.position = 'absolute';
		list.style.top = '40px';
		list.style.left = '0px';
		list.style.width = '202px';
		list.style.bottom = '60px';
		list.style.overflow = 'auto';
		
		if (mxClient.IS_QUIRKS)
		{
			list.style.height = '437px';
			list.style.marginTop = '1px';
		}
		
		preview.style.position = 'absolute';
		preview.style.left = '202px';
		preview.style.right = '0px';
		preview.style.top = '40px';
		preview.style.bottom = '60px';
		preview.style.overflow = 'auto';
		preview.style.borderLeft = '1px solid rgb(211, 211, 211)';
		preview.style.textAlign = 'center';
		
		if (mxClient.IS_QUIRKS)
		{
			preview.style.width = parseInt(hd.style.width) - 202 + 'px';
			preview.style.height = list.style.height;
			preview.style.marginTop = list.style.marginTop;
		}
		
		var currentListItem = null;
		var applyFunctions = [];
		
		var listEntry = document.createElement('div');
		listEntry.style.position = 'relative';
		listEntry.style.left = '0px';
		listEntry.style.right = '0px';
		
		for (var i = 0; i < entries.length; i++)
		{
			(function(section)
			{
				var title = listEntry.cloneNode(false);
				title.style.fontWeight = 'bold';
				title.style.backgroundColor = '#e5e5e5';
				title.style.padding = '6px 0px 6px 20px';
				mxUtils.write(title, section.title);
				list.appendChild(title);
	
				for (var j = 0; j < section.entries.length; j++)
				{
					(function(entry)
					{
						var option = listEntry.cloneNode(false);
						option.style.cursor = 'pointer';
						option.style.padding = '4px 0px 4px 20px';
						
						var checkbox = document.createElement('input');
						checkbox.setAttribute('type', 'checkbox');
						checkbox.checked = editorUi.sidebar.isEntryVisible(entry.id);
						checkbox.defaultChecked = checkbox.checked;
						option.appendChild(checkbox);
						mxUtils.write(option, ' ' + entry.title);
	
						list.appendChild(option);
						
						var itemClicked = function(evt)
						{
							if (evt == null || mxEvent.getSource(evt).nodeName != 'INPUT')
							{
								if (entry.imageCallback != null)
								{
									entry.imageCallback(preview);
								}
								else if (entry.image != null)
								{
									preview.innerHTML = '<img border="0" src="' + entry.image + '"/>';
								}
								else
								{
									preview.innerHTML = '<br>';
									mxUtils.write(preview, mxResources.get('noPreview'));
								}
								
								if (currentListItem != null)
								{
									currentListItem.style.backgroundColor = '';
								}
								
								currentListItem = option;
								currentListItem.style.backgroundColor = '#ebf2f9';
								
								if (evt != null)
								{
									mxEvent.consume(evt);
								}
							}
						};
						
						mxEvent.addListener(option, 'click', itemClicked);
						mxEvent.addListener(option, 'dblclick', function(evt)
						{
							checkbox.checked = !checkbox.checked;
							mxEvent.consume(evt);
						});
						
						applyFunctions.push(function()
						{
							return (checkbox.checked) ? entry.id : null;
						});
						
						// Selects first entry
						if (i == 0 && j == 0)
						{
							itemClicked();
						}
					})(section.entries[j]);
				}
			})(entries[i]);
		}

		div.style.padding = '30px';
		
		div.appendChild(hd);
		div.appendChild(list);
		div.appendChild(preview);
		
		var buttons = document.createElement('div');
		buttons.className = 'geDialogFooter';
		buttons.style.position = 'absolute';
		buttons.style.paddingRight = '16px';
		buttons.style.color = 'gray';
		buttons.style.left = '0px';
		buttons.style.right = '0px';
		buttons.style.bottom = '0px';
		buttons.style.height = '60px';
		buttons.style.lineHeight = '52px';
		
		if (mxClient.IS_QUIRKS)
		{
			buttons.style.width = hd.style.width;
			buttons.style.paddingTop = '12px';
		}

		var cb = document.createElement('input');
		cb.setAttribute('type', 'checkbox');
		
		if (isLocalStorage || mxClient.IS_CHROMEAPP)
		{
			var span = document.createElement('span');
			span.style.paddingRight = '20px';
			span.appendChild(cb);
			mxUtils.write(span, ' ' + mxResources.get('rememberThisSetting'));
			cb.checked = true;
			cb.defaultChecked = true;
			
			mxEvent.addListener(span, 'click', function(evt)
			{
				if (mxEvent.getSource(evt) != cb)
				{
					cb.checked = !cb.checked;
					mxEvent.consume(evt);
				}
			});
			
			if (mxClient.IS_QUIRKS)
			{
				span.style.position = 'relative';
				span.style.top = '-6px';
			}

			buttons.appendChild(span);
		}
		
		var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
		{
			editorUi.hideDialog();
		});
		cancelBtn.className = 'geBtn';
		
		var applyBtn = mxUtils.button(mxResources.get('apply'), function()
		{
	    	editorUi.hideDialog();
	    	var libs = [];
			
			for (var i = 0; i < applyFunctions.length; i++)
			{
				var lib = applyFunctions[i].apply(this, arguments);
				
				if (lib != null)
				{
					libs.push(lib);
				}
			}
			
			editorUi.sidebar.showEntries(libs.join(';'), cb.checked, true);
		});
		applyBtn.className = 'geBtn gePrimaryBtn';
		
		if (editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
			buttons.appendChild(applyBtn);
		}
		else
		{
			buttons.appendChild(applyBtn);
			buttons.appendChild(cancelBtn);
		}
		
		div.appendChild(buttons);
	}
	else
	{
		var libFS = document.createElement('table');
		var tbody = document.createElement('tbody');
		div.style.height = '100%';
		div.style.overflow = 'auto';
		var row = document.createElement('tr');
		libFS.style.width = '100%';
		
		var leftDiv = document.createElement('td');
		var midDiv = document.createElement('td');
		var rightDiv = document.createElement('td');
				
		var addLibCB = mxUtils.bind(this, function(wrapperDiv, title, key) 
		{
			var libCB = document.createElement('input');
			libCB.type = 'checkbox';
			libFS.appendChild(libCB);
			
			libCB.checked = editorUi.sidebar.isEntryVisible(key);
			
			var libSpan = document.createElement('span');
			mxUtils.write(libSpan, title);
			
			var label = document.createElement('div');
			label.style.display = 'block';
			label.appendChild(libCB);
			label.appendChild(libSpan);
			
			mxEvent.addListener(libSpan, 'click', function(evt)
			{
				libCB.checked = !libCB.checked;
				mxEvent.consume(evt);
			});
			
			wrapperDiv.appendChild(label);
			
			return function()
			{
				return (libCB.checked) ? key : null;
			};
		});
		
		row.appendChild(leftDiv);
		row.appendChild(midDiv);
		row.appendChild(rightDiv);
	
		tbody.appendChild(row);
		libFS.appendChild(tbody);
		
		var applyFunctions = [];
		var count = 0;
		
		// Counts total number of entries
		for (var i = 0; i < entries.length; i++)
		{
			for (var j = 0; j < entries[i].entries.length; j++)
			{
				count++;
			}
		}
		
		// Distributes entries on columns
		var cols = [leftDiv, midDiv, rightDiv];
		var counter = 0;
		
		for (var i = 0; i < entries.length; i++)
		{
			(function(section)
			{
				for (var j = 0; j < section.entries.length; j++)
				{
					(function(entry)
					{
						var index = Math.floor(counter / (count / 3));
						applyFunctions.push(addLibCB(cols[index], entry.title, entry.id));
						counter++;
					})(section.entries[j]);
				}
			})(entries[i]);
		}

		div.appendChild(libFS);
		
		var remember = document.createElement('div');
		remember.style.marginTop = '18px';
		remember.style.textAlign = 'center';
		
		var cb = document.createElement('input');
		
		if (isLocalStorage)
		{
			cb.setAttribute('type', 'checkbox');
			cb.checked = true;
			cb.defaultChecked = true;
			remember.appendChild(cb);
			var span = document.createElement('span');
			mxUtils.write(span, ' ' + mxResources.get('rememberThisSetting'));
			remember.appendChild(span);
			
			mxEvent.addListener(span, 'click', function(evt)
			{
				cb.checked = !cb.checked;
				mxEvent.consume(evt);
			});
		}
		
		div.appendChild(remember);
		
		var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
		{
			editorUi.hideDialog();
		});
		cancelBtn.className = 'geBtn';
		
		var applyBtn = mxUtils.button(mxResources.get('apply'), function()
		{
			var libs = ['search'];
			
			for (var i = 0; i < applyFunctions.length; i++)
			{
				var lib = applyFunctions[i].apply(this, arguments);
				
				if (lib != null)
				{
					libs.push(lib);
				}
			}
			
			editorUi.sidebar.showEntries((libs.length > 0) ? libs.join(';') : '', cb.checked);
	    	editorUi.hideDialog();
		});
		applyBtn.className = 'geBtn gePrimaryBtn';
		
		var buttons = document.createElement('div');
		buttons.style.marginTop = '26px';
		buttons.style.textAlign = 'right';
		
		if (editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
			buttons.appendChild(applyBtn);
		}
		else
		{
			buttons.appendChild(applyBtn);
			buttons.appendChild(cancelBtn);
		}
	
		div.appendChild(buttons);
	}

	this.container = div;
};

var PluginsDialog = function(editorUi) 
{
	var div = document.createElement('div');
	var inner = document.createElement('div');
	
	inner.style.height = '120px';
	inner.style.overflow = 'auto';

	var plugins = mxSettings.getPlugins().slice();
	
	function refresh()
	{
		if (plugins.length == 0)
		{
			inner.innerHTML = mxResources.get('noPlugins');
		}
		else
		{
			inner.innerHTML = '';
			
			for (var i = 0; i < plugins.length; i++)
			{
				var span = document.createElement('span');
				span.style.whiteSpace = 'nowrap';

				var img = document.createElement('span');
				img.className = 'geSprite geSprite-delete';
				img.style.position = 'relative';
				img.style.cursor = 'pointer';
				img.style.top = '5px';
				img.style.marginRight = '4px';
				img.style.display = 'inline-block';
				span.appendChild(img);
				
				mxUtils.write(span, plugins[i]);
				inner.appendChild(span);
				
				mxUtils.br(inner);
				
				mxEvent.addListener(img, 'click', (function(index)
				{
					return function()
					{
						editorUi.confirm(window.parent.mxResources.get('delete') + ' "' + plugins[index] + '"?', function()
						{
							plugins.splice(index, 1);
							refresh();
						});
					};
				})(i));
			}
		}
	}
	
	div.appendChild(inner);
	refresh();

	var addBtn = mxUtils.button(mxResources.get('add'), function()
	{
		var tmp = '';
		var param = urlParams['p'];
	
		if (param != null && param.length > 0)
		{
			var tokens = param.split(';');
			
			for (var i = 0; i < tokens.length; i++)
			{
				var url = App.pluginRegistry[tokens[i]];
				
				if (url != null)
				{
					tmp += url + ';';
				}
			}
			
			if (tmp.charAt(tmp.length - 1) == ';')
			{
				tmp = tmp.substring(0, tmp.length - 1);
			}
		}
		
		var dlg = new FilenameDialog(editorUi, tmp, mxResources.get('add'), function(newValue)
		{
			if (newValue != null && newValue.length > 0)
			{
				tokens = newValue.split(';');
				
				for (var i = 0; i < tokens.length; i++)
				{
					if (tokens[i].length > 0 && mxUtils.indexOf(plugins, tokens[i]) < 0)
					{
						plugins.push(tokens[i]);
					}
				}
				
				refresh();
			}
		}, mxResources.get('enterValue') + ' (' + mxResources.get('url') + ')');
		
		editorUi.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	});
	addBtn.className = 'geBtn';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		mxSettings.setPlugins(plugins);
		mxSettings.save();
		editorUi.hideDialog();
		editorUi.alert(mxResources.get('restartForChangeRequired'));
	});
	applyBtn.className = 'geBtn gePrimaryBtn';

	var buttons = document.createElement('div');
	buttons.style.marginTop = '14px';
	buttons.style.textAlign = 'right';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		buttons.appendChild(addBtn);
		buttons.appendChild(applyBtn);
	}
	else
	{
		buttons.appendChild(addBtn);
		buttons.appendChild(applyBtn);
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);

	this.container = div;
};

var EditGeometryDialog = function(editorUi, vertices) 
{
	var graph = editorUi.editor.graph;
	var geo = (vertices.length == 1) ? graph.getCellGeometry(vertices[0]) : null;
	var div = document.createElement('div');
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	var row = document.createElement('tr');
	var left = document.createElement('td');
	var right = document.createElement('td');
	table.style.paddingLeft = '6px';
	
	mxUtils.write(left, mxResources.get('left') + ':');
	
	var xInput = document.createElement('input');
	xInput.setAttribute('type', 'text');
	xInput.style.width = '100px';
	xInput.value = (geo != null) ? geo.x : '';
	
	this.init = function()
	{
		xInput.focus();
		xInput.select();
	};

	right.appendChild(xInput);

	row.appendChild(left);
	row.appendChild(right);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	left = document.createElement('td');
	right = document.createElement('td');
	
	mxUtils.write(left, mxResources.get('top') + ':');
	
	var yInput = document.createElement('input');
	yInput.setAttribute('type', 'text');
	yInput.style.width = '100px';
	yInput.value = (geo != null) ? geo.y : '';

	right.appendChild(yInput);

	row.appendChild(left);
	row.appendChild(right);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	left = document.createElement('td');
	right = document.createElement('td');
	
	mxUtils.write(left, mxResources.get('width') + ':');
	
	var wInput = document.createElement('input');
	wInput.setAttribute('type', 'text');
	wInput.style.width = '100px';
	wInput.value = (geo != null) ? geo.width : '';

	right.appendChild(wInput);

	row.appendChild(left);
	row.appendChild(right);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	left = document.createElement('td');
	right = document.createElement('td');
	
	mxUtils.write(left, mxResources.get('height') + ':');
	
	var hInput = document.createElement('input');
	hInput.setAttribute('type', 'text');
	hInput.style.width = '100px';
	hInput.value = (geo != null) ? geo.height : '';

	right.appendChild(hInput);

	row.appendChild(left);
	row.appendChild(right);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	left = document.createElement('td');
	right = document.createElement('td');
	
	mxUtils.write(left, mxResources.get('rotation') + ':');
	
	var rotInput = document.createElement('input');
	rotInput.setAttribute('type', 'text');
	rotInput.style.width = '100px';
	rotInput.value = (vertices.length == 1) ? mxUtils.getValue(graph.getCellStyle(vertices[0]),
			mxConstants.STYLE_ROTATION, 0) : '';

	right.appendChild(rotInput);

	row.appendChild(left);
	row.appendChild(right);
	
	tbody.appendChild(row);
	
	table.appendChild(tbody);
	div.appendChild(table);
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		editorUi.hideDialog();
		
		graph.getModel().beginUpdate();
		try
		{
			for (var i = 0; i < vertices.length; i++)
			{
				var g = graph.getCellGeometry(vertices[i]);
				
				if (g != null)
				{
					g = g.clone();
				
					if (graph.isCellMovable(vertices[i]))
					{
						if (mxUtils.trim(xInput.value).length > 0)
						{
							g.x = Number(xInput.value);
						}
						
						if (mxUtils.trim(yInput.value).length > 0)
						{
							g.y = Number(yInput.value);
						}
					}
					
					if (graph.isCellResizable(vertices[i]))
					{
						if (mxUtils.trim(wInput.value).length > 0)
						{
							g.width = Number(wInput.value);
						}
						
						if (mxUtils.trim(hInput.value).length > 0)
						{
							g.height = Number(hInput.value);
						}
					}
					
					graph.getModel().setGeometry(vertices[i], g);
				}
				
				if (mxUtils.trim(rotInput.value).length > 0)
				{
					graph.setCellStyles(mxConstants.STYLE_ROTATION, Number(rotInput.value), [vertices[i]]);
				}
			}
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});

	mxEvent.addListener(div, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			applyBtn.click();
		}
	});
	
	var buttons = document.createElement('div');
	buttons.style.marginTop = '20px';
	buttons.style.textAlign = 'right';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		buttons.appendChild(applyBtn);
	}
	else
	{
		buttons.appendChild(applyBtn);
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);

	this.container = div;
};

/**
 * Constructs a new dialog for creating files from templates.
 */
var LibraryDialog = function(editorUi, name, library, initialImages, file, mode)
{
	var images = [];
	var graph = editorUi.editor.graph;
	var outer = document.createElement('div');
	outer.style.height = '100%';
	
	var header = document.createElement('div');
	header.style.whiteSpace = 'nowrap';
	header.style.height = '40px';
	outer.appendChild(header);

	mxUtils.write(header, mxResources.get('filename') + ':');
	
	var nameValue = name;
	
	if (nameValue == null)
	{
		nameValue = editorUi.defaultLibraryName + '.xml';
	}

	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', nameValue);
	nameInput.style.marginRight = '20px';
	nameInput.style.marginLeft = '10px';
	nameInput.style.width = '500px';
	
	if (file != null && !file.isRenamable())
	{
		nameInput.setAttribute('disabled', 'true');
	}
	
	this.init = function()
	{
		if (file == null || file.isRenamable())
		{
			nameInput.focus();
			
			if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
			{
				nameInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
	};

	header.appendChild(nameInput);

	var div = document.createElement('div');
	div.style.borderWidth = '1px 0px 1px 0px';
	div.style.borderColor = '#d3d3d3';
	div.style.borderStyle = 'solid';
	div.style.marginTop = '6px';
	div.style.overflow = 'auto';
	div.style.height = '340px';
	div.style.backgroundPosition = 'center center';
	div.style.backgroundRepeat = 'no-repeat';

	if (images.length == 0 && Graph.fileSupport)
	{
		div.style.backgroundImage = 'url(\'' + IMAGE_PATH + '/droptarget.png\')';
	}

	var bg = document.createElement('div');
	bg.style.position = 'absolute';
	bg.style.width = '640px';
	bg.style.top = '260px';
	bg.style.textAlign = 'center';
	bg.style.fontSize = '22px';
	bg.style.color = '#a0c3ff';
	mxUtils.write(bg, mxResources.get('dragImagesHere'));
	outer.appendChild(bg);
	
	var entries = {};
	var ew = 100;
	var eh = 100;
	
	var dragSourceIndex = null;
	var dropTargetIndex = null;
	
	function getIndexForEvent(evt)
	{
		var dropTarget = document.elementFromPoint(evt.clientX, evt.clientY);
		
		while (dropTarget != null && dropTarget.parentNode != div)
		{
			dropTarget = dropTarget.parentNode;
		}
		
		var result = null;
		
		if (dropTarget != null)
		{
			var tmp = div.firstChild;
			result = 0;
			
			while (tmp != null && tmp != dropTarget)
			{
				tmp = tmp.nextSibling;
				result++;
			}
		}
		
		return result;
	};
	
	var stopEditing = null;
	var stopWrapper = function(evt)
	{
		var source = mxEvent.getSource(evt);
		
		if (source.getAttribute('contentEditable') != 'true' && stopEditing != null)
		{
			stopEditing();
			stopEditing = null;
			
			mxEvent.consume(evt);
		}
	};
	
	mxEvent.addListener(div, 'mousedown', stopWrapper);
	mxEvent.addListener(div, 'pointerdown', stopWrapper);
	mxEvent.addListener(div, 'touchstart', stopWrapper);

	// For converting image URLs
	var converter = new mxUrlConverter();
	var errorShowed = false;
	
	function addButton(data, mimeType, x, y, w, h, img, aspect, title)
	{
		// Ignores duplicates
		try
		{
			if (mimeType == null || mimeType.substring(0, 6) == 'image/')
			{
				if ((data == null && img != null) || entries[data] == null)
				{
					div.style.backgroundImage = '';
					bg.style.display = 'none';
		
					var iw = w;
					var ih = h;
					
					if (w > editorUi.maxImageSize || h > editorUi.maxImageSize)
					{
						var s = Math.min(1, Math.min(editorUi.maxImageSize / Math.max(1, w)),
							editorUi.maxImageSize / Math.max(1, h));
						w *= s;
						h *= s;
					}
					
					if (iw > ih)
					{
						ih = Math.round(ih * ew / iw);
						iw = ew;
					}
					else
					{
						iw = Math.round(iw * eh / ih);
						ih = eh;
					}
					
					var wrapper = document.createElement('div');
					wrapper.setAttribute('draggable', 'true');
					wrapper.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
					wrapper.style.position = 'relative';
					wrapper.style.cursor = 'move';
					mxUtils.setPrefixedStyle(wrapper.style, 'transition', 'transform .1s ease-in-out');
					
					if (data != null)
					{
						var elt = document.createElement('img');
						elt.setAttribute('src', converter.convert(data));
						elt.style.width = iw + 'px';
						elt.style.height = ih + 'px';
						elt.style.margin = '10px';
			
						elt.style.paddingBottom = Math.floor((eh - ih) / 2) + 'px';
						elt.style.paddingLeft = Math.floor((ew - iw) / 2) + 'px';
						
						wrapper.appendChild(elt);
					}
					else if (img != null)
					{
						var cells = editorUi.stringToCells(editorUi.editor.graph.decompress(img.xml));
						
						if (cells.length > 0)
						{
							editorUi.sidebar.createThumb(cells, ew, eh, wrapper, null, true, false);
							
							// Needs inline block on SVG for delete icon to appear on same line
							wrapper.firstChild.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
							wrapper.firstChild.style.cursor = '';
						}
					}
					
					var rem = document.createElement('img');
					rem.setAttribute('src', Editor.closeImage);
					rem.setAttribute('border', '0');
					rem.setAttribute('title', mxResources.get('delete'));
					rem.setAttribute('align', 'top');
					rem.style.paddingTop = '4px';
					rem.style.marginLeft = '-22px';
					rem.style.cursor = 'pointer';
					
					// Blocks dragging of remove icon
					mxEvent.addListener(rem, 'dragstart', function(evt)
					{
						mxEvent.consume(evt);
					});
					
					// Seems to bring remove icon on top of graph
					if (data == null && img != null)
					{
						rem.style.position = 'relative';
					}
					
					(function(wrapperDiv, dataParam, imgParam)
					{
						mxEvent.addListener(rem, 'click', function(evt)
						{
							entries[dataParam] = null;
							
							for (var i = 0; i < images.length; i++)
							{
								if ((images[i].data != null && images[i].data == dataParam) ||
									(images[i].xml != null && images[i].xml == imgParam.xml))
								{
									images.splice(i, 1);
									break;
								}
							}
							
							wrapper.parentNode.removeChild(wrapperDiv);
							
							if (images.length == 0)
							{
								div.style.backgroundImage = 'url(\'' + IMAGE_PATH + '/droptarget.png\')';
								bg.style.display = '';
							}
							
							mxEvent.consume(evt);
						});
						// Workaround for accidental select all
						mxEvent.addListener(rem, 'dblclick', function(evt)
						{
							mxEvent.consume(evt);
						});
					})(wrapper, data, img);
					
					wrapper.appendChild(rem);
					wrapper.style.marginBottom = '30px';
					
					var label = document.createElement('div');
					label.style.position = 'absolute';
					label.style.boxSizing = 'border-box';
					label.style.bottom = '-18px';
					label.style.left = '10px';
					label.style.right = '10px';
					label.style.backgroundColor = '#ffffff';
					label.style.overflow = 'hidden';
					label.style.textAlign = 'center';
					
					var entry = null;
					
					if (data != null)
					{
						entry = {data: data, w: w, h: h, title: title};
						
						if (aspect != null)
						{
							entry.aspect = aspect;
						}
						
						entries[data] = elt;
						images.push(entry);
					}
					else if (img != null)
					{
						img.aspect = 'fixed';
						images.push(img);
						entry = img;
					}
					
					function updateLabel()
					{
						label.innerHTML = '';
						label.style.cursor = 'pointer';
						label.style.whiteSpace = 'nowrap';
						label.style.textOverflow = 'ellipsis';
						mxUtils.write(label, (entry.title != null && entry.title.length > 0) ?
							entry.title : mxResources.get('untitled'));
						
						if (entry.title == null || entry.title.length == 0)
						{
							label.style.color = '#d0d0d0';
						}
						else
						{
							label.style.color = '';
						}
					};
					
					mxEvent.addListener(label, 'keydown', function(evt)
					{
						if (evt.keyCode == 13 && stopEditing != null)
						{
							stopEditing();
							stopEditing = null;
							
							mxEvent.consume(evt);
						}
					});
					
					updateLabel();
					wrapper.appendChild(label);
					
					// Blocks dragging of label
					mxEvent.addListener(label, 'mousedown', function(evt)
					{
						if (label.getAttribute('contentEditable') != 'true')
						{
							mxEvent.consume(evt);
						}
					});
					
					var startEditing = function(evt)
					{
						// Workaround for various issues in IE
						if (!mxClient.IS_IOS && !mxClient.IS_QUIRKS && !mxClient.IS_FF &&
							(document.documentMode == null || document.documentMode > 9))
						{
							if (label.getAttribute('contentEditable') != 'true')
							{
								if (stopEditing != null)
								{
									stopEditing();
									stopEditing = null;
								}
								
								if (entry.title == null || entry.title.length == 0)
								{
									label.innerHTML = '';
								}
								
								label.style.textOverflow = '';
								label.style.whiteSpace = '';
								label.style.cursor = 'text';
								label.style.color = '';
								label.setAttribute('contentEditable', 'true');
								label.focus();
								document.execCommand('selectAll', false, null);
								
								stopEditing = function()
								{
									label.removeAttribute('contentEditable');
									label.style.cursor = 'pointer';
									entry.title = label.innerHTML;
									updateLabel();
								}
						
								mxEvent.consume(evt);
							}
						}
						else
						{
							var dlg = new FilenameDialog(editorUi, entry.title || '', mxResources.get('ok'), function(newTitle)
							{
								if (newTitle != null)
								{
									entry.title = newTitle;
									updateLabel();
								}
							}, mxResources.get('enterValue'));
							editorUi.showDialog(dlg.container, 300, 80, true, true);
							dlg.init();
							
							mxEvent.consume(evt);
						}
					};
					
					mxEvent.addListener(label, 'click', startEditing);
					mxEvent.addListener(wrapper, 'dblclick', startEditing);
					
					div.appendChild(wrapper);
	
					mxEvent.addListener(wrapper, 'dragstart', function(evt)
					{
						if (data == null && img != null)
						{
							rem.style.visibility = 'hidden';
							label.style.visibility = 'hidden';
						}
						
						// Workaround for no DnD on DIV in FF
						if (mxClient.IS_FF && img.xml != null)
						{
							evt.dataTransfer.setData('Text', img.xml);
						}

						dragSourceIndex = getIndexForEvent(evt);
						
						// Workaround for missing drag preview in Google Chrome
						if (mxClient.IS_GC)
						{
							wrapper.style.opacity = '0.9';
						}
						
						window.setTimeout(function()
						{
							mxUtils.setPrefixedStyle(wrapper.style, 'transform', 'scale(0.5,0.5)');
							mxUtils.setOpacity(wrapper, 30);
							rem.style.visibility = '';
							label.style.visibility = '';
						}, 0);
					});
					
					mxEvent.addListener(wrapper, 'dragend', function(evt)
					{
						if (rem.style.visibility == 'hidden')
						{
							rem.style.visibility = '';
							label.style.visibility = '';
						}
						
						dragSourceIndex = null;
						mxUtils.setOpacity(wrapper, 100);
						mxUtils.setPrefixedStyle(wrapper.style, 'transform', null);
					});
				}
				else if (!errorShowed)
				{
					errorShowed = true;
					editorUi.handleError({message: mxResources.get('fileExists')})
				}
			}
			else
			{
				var done = false;
				
				try
				{
					if (data != null && data.substring(0, 10) == '<mxlibrary')
					{
						var doc = mxUtils.parseXml(data);
						var temp = JSON.parse(mxUtils.getTextContent(doc.documentElement));
							
						if (temp != null && temp.length > 0)
						{
							for (var i = 0; i < temp.length; i++)
							{
								if (temp[i].xml != null)
								{
									addButton(null, null, 0, 0, 0, 0, temp[i]);
								}
								else
								{
									addButton(temp[i].data, null, 0, 0, temp[i].w, temp[i].h, null, 'fixed', temp[i].title);
								}
							}
						}
						
						editorUi.spinner.stop();
						done = true;
					}
				}
				catch (e)
				{
					// ignore
				}

				if (!done)
				{
					editorUi.spinner.stop();
					editorUi.handleError({message: mxResources.get('errorLoadingFile')})
				}
			}
		}
		catch (e)
		{
			// ignore
			console.log('e', e);
		}
		
		return null;
	};
	
	if (initialImages != null)
	{
		for (var i = 0; i < initialImages.length; i++)
		{
			var img = initialImages[i];
			addButton(img.data, null, 0, 0, img.w, img.h, img, img.aspect, img.title);
		}
	}
	
	// Setup the dnd listeners
	mxEvent.addListener(div, 'dragleave', function(evt)
	{
		bg.style.cursor = '';
		var source = mxEvent.getSource(evt);
		
		while (source != null)
		{
			if (source == div || source == bg)
			{
				evt.stopPropagation();
				evt.preventDefault();
				break;
			}
			
			source = source.parentNode;
		}
	});
	
	function dragOver(evt)
	{
		evt.dataTransfer.dropEffect = (dragSourceIndex != null) ? 'move' : 'copy';
		evt.stopPropagation();
		evt.preventDefault();
	};
	
	function dropHandler(evt)
	{
		evt.stopPropagation();
	    evt.preventDefault();
    	errorShowed = false;
	    
	    dropTargetIndex = getIndexForEvent(evt);
		
	    if (dragSourceIndex != null)
		{
			if (dropTargetIndex != null && dropTargetIndex < div.children.length)
			{
				images.splice((dropTargetIndex > dragSourceIndex) ? dropTargetIndex - 1 : dropTargetIndex,
						0, images.splice(dragSourceIndex, 1)[0]);
				div.insertBefore(div.children[dragSourceIndex], div.children[dropTargetIndex]);
			}
			else
			{
				images.push(images.splice(dragSourceIndex, 1)[0]);
				div.appendChild(div.children[dragSourceIndex]);
			}
		}
	    else if (evt.dataTransfer.files.length > 0)
	    {
	    	editorUi.importFiles(evt.dataTransfer.files, 0, 0, editorUi.maxImageSize, function(data, mimeType, x, y, w, h, img)
	    	{
	    		addButton(data, mimeType, x, y, w, h, img, 'fixed', (mxEvent.isAltDown(evt)) ?
		    		null : img.substring(0, img.lastIndexOf('.')).replace(/_/g, ' '));
	    	});
		}
	    else if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0)
	    {
	    	var uri = decodeURIComponent(evt.dataTransfer.getData('text/uri-list'));
	    	
			if (/(\.jpg)($|\?)/i.test(uri) || /(\.png)($|\?)/i.test(uri) ||
				/(\.gif)($|\?)/i.test(uri) || /(\.svg)($|\?)/i.test(uri))
			{
				editorUi.loadImage(uri, function(img)
				{
					addButton(uri, null, 0, 0, img.width, img.height);
				});
			}
	    }
	    
	    evt.stopPropagation();
	    evt.preventDefault();
	};
	
	mxEvent.addListener(div, 'dragover', dragOver);
	mxEvent.addListener(div, 'drop', dropHandler);
	mxEvent.addListener(bg, 'dragover', dragOver);
	mxEvent.addListener(bg, 'drop', dropHandler);

	outer.appendChild(div);

	var btns = document.createElement('div');
	btns.style.textAlign = 'right';
	btns.style.marginTop = '20px';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog(true);
	});
	cancelBtn.setAttribute('id', 'btnCancel');
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	// Does not show download button, allow filename editing in Chrome Apps
	if (!window.chrome || !chrome.app || !chrome.app.runtime)
	{
		var btn = mxUtils.button(mxResources.get('export'), function()
		{
	    	var data = editorUi.createLibraryDataFromImages(images);
	    	var filename = nameInput.value;
	    	
			if (!/(\.xml)$/i.test(filename))
			{
				filename += '.xml';
			}
	    	
	    	if (editorUi.isLocalFileSave())
	    	{
	    		editorUi.saveLocalFile(data, filename, 'text/xml');
	    	}
	    	else
	    	{
	    		new mxXmlRequest(SAVE_URL, 'filename=' + encodeURIComponent(filename) +
	    			'&format=xml&xml=' + encodeURIComponent(data)).simulate(document, '_blank');
	    	}
		});
		btn.setAttribute('id', 'btnDownload');
		btn.className = 'geBtn';
		btns.appendChild(btn);
	}
	else
	{
		nameInput.setAttribute('disabled', 'disabled');
	}
	
	var fileInput = document.createElement('input');
	fileInput.setAttribute('multiple', 'multiple');
	fileInput.setAttribute('type', 'file');
	
	if (document.documentMode == null)
	{
		mxEvent.addListener(fileInput, 'change', function(evt)
		{
	    	errorShowed = false;
				
	    	editorUi.importFiles(fileInput.files, 0, 0, editorUi.maxImageSize, function(data, mimeType, x, y, w, h, img)
	    	{
	    		addButton(data, mimeType, x, y, w, h, img, 'fixed');
	    		
	    		// Resets input to force change event for same file
	    		fileInput.value = '';
	    	});
		});
		
		var btn = mxUtils.button(mxResources.get('import'), function()
		{
			if (stopEditing != null)
			{
				stopEditing();
				stopEditing = null;
			}
			
			fileInput.click();
		});
		btn.setAttribute('id', 'btnAddImage');
		btn.className = 'geBtn';
		
		btns.appendChild(btn);
	}

	var btn = mxUtils.button(mxResources.get('addImageUrl'), function()
	{
		if (stopEditing != null)
		{
			stopEditing();
			stopEditing = null;
		}
		
		editorUi.showImageDialog(mxResources.get('addImageUrl'), '', function(url, w, h)
		{
	    	errorShowed = false;
			
			if (url != null)
			{
				// Image dialog returns modified data URLs which
				// must be converted back to real data URL
				if (url.substring(0, 11) == 'data:image/')
				{
					var comma = url.indexOf(',');
					
					if (comma > 0)
					{
						url = url.substring(0, comma) + ';base64,' + url.substring(comma + 1);
					}
				}
				
				addButton(url, null, 0, 0, w, h);
			}
		});
	});
	btn.setAttribute('id', 'btnAddImageUrl');
	btn.className = 'geBtn';
	btns.appendChild(btn);
	
	// Indirection for overriding
	this.saveBtnClickHandler = function(name, images, file, mode) 
	{
		editorUi.saveLibrary(name, images, file, mode);
	};
	var btn = mxUtils.button(mxResources.get('save'),mxUtils.bind(this, function()
	{
		if (stopEditing != null)
		{
			stopEditing();
			stopEditing = null;
		}
		
		this.saveBtnClickHandler(nameInput.value, images, file, mode);
	}));
	btn.setAttribute('id', 'btnSave');
	btn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(btn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	outer.appendChild(btns);
	
	this.container = outer;
};

/**
 * Constructs a new textarea dialog.
 */
var EditShapeDialog = function(editorUi, cell, title, w, h)
{
	w = (w != null) ? w : 300;
	h = (h != null) ? h : 120;
	var row, td;

	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.style.cellPadding = '4px';
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.setAttribute('colspan', '2');
	td.style.fontSize = '10pt';
	mxUtils.write(td, title);
	
	row.appendChild(td);
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	
	var nameInput = document.createElement('textarea');
	nameInput.style.outline = 'none';
	nameInput.style.resize = 'none';
	nameInput.style.width = (w - 200) + 'px';
	nameInput.style.height = h + 'px';
	
	this.textarea = nameInput;

	this.init = function()
	{
		nameInput.focus();
		nameInput.scrollTop = 0;
	};

	td.appendChild(nameInput);
	row.appendChild(td);
	
	td = document.createElement('td');
	
	var container = document.createElement('div');
	container.style.position = 'relative';
	container.style.border = '1px solid gray';
	container.style.top = '6px';
	container.style.width = '200px';
	container.style.height = (h + 4) + 'px';
	container.style.overflow = 'hidden';
	container.style.marginBottom = '16px';
	mxEvent.disableContextMenu(container);
	td.appendChild(container);

	var graph = new Graph(container);
	graph.setEnabled(false);
	
	var clone = editorUi.editor.graph.cloneCells([cell])[0];
	graph.addCells([clone]);
	
	var state = graph.view.getState(clone);
	var stencil = '';
	
	if (state.shape != null && state.shape.stencil != null)
	{
		stencil = mxUtils.getPrettyXml(state.shape.stencil.desc);
	}
	
	mxUtils.write(nameInput, stencil || '');

	var b = graph.getGraphBounds();
	var ns = Math.min((200 - 40) / b.width, (h - 40) / b.height);
	graph.view.scaleAndTranslate(ns, 20 / ns - b.x, 20 / ns - b.y);
	
	row.appendChild(td);
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	td.setAttribute('colspan', '2');
	td.style.paddingTop = '2px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	if (!editorUi.isOffline())
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			window.open('https://support.draw.io/display/DO/Editing+Shapes');
		});
		
		helpBtn.className = 'geBtn';
		td.appendChild(helpBtn);
	}
	
	var updateShape = function(targetGraph, targetCell, hide)
	{
		var newValue = nameInput.value;
		
		// Checks if XML has changed (getPrettyXml "normalizes" DOM)
		var doc = mxUtils.parseXml(newValue);
		newValue = mxUtils.getPrettyXml(doc.documentElement);
		
		// Checks for validation errors
		// LATER: Validate against XSD
		var errors = doc.documentElement.getElementsByTagName('parsererror');
		
		if (errors != null && errors.length > 0)
		{
			editorUi.showError(mxResources.get('error'), mxResources.get('containsValidationErrors'), mxResources.get('ok'));
		}
		else
		{
			if (hide)
			{
				editorUi.hideDialog();
			}
			
			var isNew = !targetGraph.model.contains(targetCell);
			
			if (!hide || isNew || newValue != stencil)
			{
				// Transform XML value to be used in cell style
				newValue = editorUi.editor.graph.compress(newValue);
				
				targetGraph.getModel().beginUpdate();
				try
				{
					// Inserts cell if required
					if (isNew)
					{
						var pt = editorUi.editor.graph.getInsertPoint();
						targetCell.geometry.x = pt.x;
						targetCell.geometry.y = pt.y;
						targetGraph.addCell(targetCell)
					}
					
					targetGraph.setCellStyles(mxConstants.STYLE_SHAPE, 'stencil(' + newValue + ')', [targetCell]);
				}
				catch (e)
				{
					throw e;
				}
				finally
				{
					// Updates the display
					targetGraph.getModel().endUpdate();
				}
				
				// Updates selection after stencil was created for rendering
				if (isNew)
				{
					targetGraph.setSelectionCell(targetCell);
				}
			}
		}
	};
	
	var previewBtn = mxUtils.button(mxResources.get('preview'), function()
	{
		updateShape(graph, clone, false);
	});
	
	previewBtn.className = 'geBtn';	
	td.appendChild(previewBtn);
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		updateShape(editorUi.editor.graph, cell, true);
	});
	
	applyBtn.className = 'geBtn gePrimaryBtn';	
	td.appendChild(applyBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

var CustomDialog = function(editorUi, content, okFn, cancelFn, okButtonText, helpLink)
{
	var div = document.createElement('div');
	div.appendChild(content);
	
	var btns = document.createElement('div');
	btns.style.marginTop = '16px';
	btns.style.textAlign = 'center';

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	if (!editorUi.isOffline() && helpLink != null)
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			window.open(helpLink);
		});
		
		helpBtn.className = 'geBtn';	
		btns.appendChild(helpBtn);
	}
	
	var okBtn = mxUtils.button(okButtonText || mxResources.get('ok'), function()
	{
		editorUi.hideDialog();
		
		if (okFn != null)
		{
			okFn();
		}
	});
	btns.appendChild(okBtn);
	
	okBtn.className = 'geBtn gePrimaryBtn';
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};
