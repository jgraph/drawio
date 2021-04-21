/**
 * Copyright (c) 2006-2020, JGraph Ltd
 * Copyright (c) 2006-2020, draw.io AG
 */

var StorageDialog = function(editorUi, fn, rowLimit)
{
	rowLimit = (rowLimit != null) ? rowLimit : 2;
	
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	div.style.whiteSpace = 'nowrap';
	div.style.paddingTop = '0px';
	div.style.paddingBottom = '20px';
	
	var buttons = document.createElement('div');
	buttons.style.border = '1px solid #d3d3d3';
	buttons.style.borderWidth = '1px 0px 1px 0px';
	buttons.style.padding = '10px 0px 20px 0px';
	
	var count = 0;
	var container = document.createElement('div');
	container.style.paddingTop = '2px';
	buttons.appendChild(container);
	
	var p3 = document.createElement('p');
	
	function addLogo(img, title, mode, clientName, labels, clientFn)
	{
		if (++count > rowLimit)
		{
			mxUtils.br(container);
			count = 0;
		}
		
		var button = document.createElement('a');
		button.style.overflow = 'hidden';
		button.style.display = 'inline-block';
		button.className = 'geBaseButton';
		button.style.boxSizing = 'border-box';
		button.style.fontSize = '11px';
		button.style.position = 'relative';
		button.style.margin = '4px';
		button.style.marginTop = '8px';
		button.style.marginBottom = '0px';
		button.style.padding = '8px 10px 8px 10px';
		button.style.width = '88px';
		button.style.height = '100px';
		button.style.whiteSpace = 'nowrap';
		button.setAttribute('title', title);
		
		var label = document.createElement('div');
		label.style.textOverflow = 'ellipsis';
		label.style.overflow = 'hidden';
		label.style.position = 'absolute';
		label.style.bottom = '8px';
		label.style.left = '0px';
		label.style.right = '0px';
		mxUtils.write(label, title);
		button.appendChild(label);
		
		if (img != null)
		{
			var logo = document.createElement('img');
			logo.setAttribute('src', img);
			logo.setAttribute('border', '0');
			logo.setAttribute('align', 'absmiddle');
			logo.style.width = '60px';
			logo.style.height = '60px';
			logo.style.paddingBottom = '6px';

			button.appendChild(logo);
		}
		else
		{
			label.style.paddingTop = '5px';
			label.style.whiteSpace = 'normal';
			
			// Handles special case
			if (mxClient.IS_IOS)
			{
				button.style.padding = '0px 10px 20px 10px';
				button.style.top = '6px';
			}
			else if (mxClient.IS_FF)
			{
				label.style.paddingTop = '0px';
				label.style.marginTop = '-2px';
			}
		}
		
		if (labels != null)
		{
			for (var i = 0; i < labels.length; i++)
			{
				mxUtils.br(label);
				mxUtils.write(label, labels[i]);
			}
		}
		
		function initButton()
		{
			mxEvent.addListener(button, 'click', (clientFn != null) ? clientFn : function()
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
						editorUi.setMode(mode, true);
						fn();
					}));
				}
				else if (mode == App.MODE_ONEDRIVE && editorUi.spinner.spin(document.body, mxResources.get('authorizing')))
				{
					// Tries immediate authentication
					editorUi.oneDrive.checkToken(mxUtils.bind(this, function()
					{
						editorUi.spinner.stop();
						editorUi.setMode(mode, true);
						fn();
					}));
				}
				else
				{
					editorUi.setMode(mode, true);
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
				color: Editor.isDarkMode() ? '#c0c0c0' : '#000', // #rgb or #rrggbb
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
			
			editorUi.addListener('clientLoaded', mxUtils.bind(this, function(sender, evt)
			{
				if (editorUi[clientName] != null && evt.getProperty('client') == editorUi[clientName])
				{
					window.clearTimeout(timeout);
					mxUtils.setOpacity(label, 100);
					logo.style.visibility = '';
					spinner.stop();
					initButton();
					
					if (clientName == 'drive' && p3.parentNode != null)
					{
						p3.parentNode.removeChild(p3);
					}
				}
			}));
		}
		else
		{
			initButton();
		}

		container.appendChild(button);
	};

	var hd = document.createElement('p');
	hd.style.cssText = 'font-size:22px;padding:4px 0 16px 0;margin:0;color:gray;';
	mxUtils.write(hd, mxResources.get('saveDiagramsTo') + ':');
	div.appendChild(hd);
	
	var addButtons = function()
	{
		count = 0;
		
		if (typeof window.DriveClient === 'function')
		{
			addLogo(IMAGE_PATH + '/google-drive-logo.svg', mxResources.get('googleDrive'), App.MODE_GOOGLE, 'drive');
		}
	
		if (typeof window.OneDriveClient === 'function')
		{
			addLogo(IMAGE_PATH + '/onedrive-logo.svg', mxResources.get('oneDrive'), App.MODE_ONEDRIVE, 'oneDrive');
		}
	
		addLogo(IMAGE_PATH + '/osa_drive-harddisk.png', mxResources.get('device'), App.MODE_DEVICE);
		
		if (isLocalStorage && (urlParams['browser'] == '1' || urlParams['offline'] == '1'))
		{
			addLogo(IMAGE_PATH + '/osa_database.png', mxResources.get('browser'), App.MODE_BROWSER);
		}
		
		if (typeof window.DropboxClient === 'function')
		{
			addLogo(IMAGE_PATH + '/dropbox-logo.svg', mxResources.get('dropbox'), App.MODE_DROPBOX, 'dropbox');
		}

		if (editorUi.gitHub != null)
		{
			addLogo(IMAGE_PATH + '/github-logo.svg', mxResources.get('github'), App.MODE_GITHUB, 'gitHub');
		}
		
		if (editorUi.gitLab != null)
		{
			addLogo(IMAGE_PATH + '/gitlab-logo.svg', mxResources.get('gitlab'), App.MODE_GITLAB, 'gitLab');
		}
	};
	
	div.appendChild(buttons);
	addButtons();

	var later = document.createElement('span');
	later.style.cssText = 'position:absolute;cursor:pointer;bottom:27px;color:gray;userSelect:none;text-align:center;left:50%;';
	mxUtils.setPrefixedStyle(later.style, 'transform', 'translate(-50%,0)');
	mxUtils.write(later, mxResources.get('decideLater'));

	mxEvent.addListener(later, 'click', function()
	{
		editorUi.hideDialog();
		var prev = Editor.useLocalStorage;
		editorUi.createFile(editorUi.defaultFilename,
			null, null, null, null, null, null, true);
		Editor.useLocalStorage = prev;
	});

	div.appendChild(later);

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
				p3.style.padding = '7px';
				p3.style.fontSize = '9pt';
				p3.style.marginTop = '-14px';
				p3.innerHTML = '<a style="background-color:#dcdcdc;padding:6px;color:black;text-decoration:none;" ' +
					'href="https://desk.draw.io/a/solutions/articles/16000074659" target="_blank">' +
					'<img border="0" src="' + mxGraph.prototype.warningImage.src + '" align="absmiddle" ' +
					'style="margin-top:-4px"> ' + mxResources.get('googleDriveMissingClickHere') + '</a>';
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
	
	if (mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
	{
		var elt = editorUi.addLanguageMenu(div, true);
		
		if (elt != null)
		{
			elt.style.bottom = '19px';
		}
	}
	
	var serviceCount = editorUi.getServiceCount();
	var logo = document.createElement('img');
	logo.setAttribute('border', '0');
	logo.setAttribute('align', 'absmiddle');
	logo.style.width = '32px';
	logo.style.height = '32px';
	logo.style.marginRight = '8px';
	logo.style.marginTop = '-4px';
	
	var buttons = document.createElement('div');
	buttons.style.margin = '8px 0px 0px 0px';
	buttons.style.padding = '18px 0px 24px 0px';
	
	var service = '';
	
	if (editorUi.mode == App.MODE_GOOGLE)
	{
		logo.src = IMAGE_PATH + '/google-drive-logo.svg';
		service = mxResources.get('googleDrive');
	}
	else if (editorUi.mode == App.MODE_DROPBOX)
	{
		logo.src = IMAGE_PATH + '/dropbox-logo.svg';
		service = mxResources.get('dropbox');
	}
	else if (editorUi.mode == App.MODE_ONEDRIVE)
	{
		logo.src = IMAGE_PATH + '/onedrive-logo.svg';
		service = mxResources.get('oneDrive');
	}
	else if (editorUi.mode == App.MODE_GITHUB)
	{
		logo.src = IMAGE_PATH + '/github-logo.svg';
		service = mxResources.get('github');
	}
	else if (editorUi.mode == App.MODE_GITLAB)
	{
		logo.src = IMAGE_PATH + '/gitlab-logo.svg';
		service = mxResources.get('gitlab');
	}
	else if (editorUi.mode == App.MODE_BROWSER)
	{
		logo.src = IMAGE_PATH + '/osa_database.png';
		service = mxResources.get('browser');
	}
	else if (editorUi.mode == App.MODE_TRELLO)
	{
		logo.src = IMAGE_PATH + '/trello-logo.svg';
		service = mxResources.get('trello');
	}
	else
	{
		logo.src = IMAGE_PATH + '/osa_drive-harddisk.png';
		buttons.style.paddingBottom = '10px';
		buttons.style.paddingTop = '30px';
		service = mxResources.get('device');
	}

	var btn = document.createElement('button');
	btn.className = 'geBigButton';
	btn.style.marginBottom = '8px';
	btn.style.fontSize = '18px';
	btn.style.padding = '10px';
	btn.style.width = '340px';
	
	if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp)
	{
		buttons.style.border = '1px solid #d3d3d3';
		buttons.style.borderWidth = '1px 0px 1px 0px';
	
		var table = document.createElement('table');
		var tbody = document.createElement('tbody');
		var row = document.createElement('tr');
		var left = document.createElement('td');
		var right = document.createElement('td');
		table.setAttribute('align', 'center');
		left.appendChild(logo);
		
		var title = document.createElement('div');
		title.style.fontSize = '22px';
		title.style.paddingBottom = '6px';
		title.style.color = 'gray';
		mxUtils.write(title, service);
		
		right.style.textAlign = 'left';
		right.appendChild(title);
		
		row.appendChild(left);
		row.appendChild(right);
		tbody.appendChild(row);
		table.appendChild(tbody);
		div.appendChild(table);
	
		var change = document.createElement('span');
		change.style.cssText = 'position:absolute;cursor:pointer;bottom:27px;color:gray;userSelect:none;text-align:center;left:50%;';
		mxUtils.setPrefixedStyle(change.style, 'transform', 'translate(-50%,0)');
		mxUtils.write(change, mxResources.get('changeStorage'));
		
		mxEvent.addListener(change, 'click', function()
		{
			editorUi.hideDialog(false);
			editorUi.setMode(null);
			editorUi.clearMode();
			editorUi.showSplash(true);
		});
		
		div.appendChild(change);
	}
	else
	{
		buttons.style.padding = '42px 0px 56px 0px';
		btn.style.marginBottom = '12px';
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
	btn.style.fontSize = '18px';
	btn.style.padding = '10px';
	btn.style.width = '340px';
	
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
	else if (editorUi.mode == App.MODE_GITHUB)
	{
		storage = mxResources.get('github');
	}
	else if (editorUi.mode == App.MODE_GITLAB)
	{
		storage = mxResources.get('gitlab');
	}
	else if (editorUi.mode == App.MODE_TRELLO)
	{
		storage = mxResources.get('trello');
	}
	else if (editorUi.mode == App.MODE_DEVICE)
	{
		storage = mxResources.get('device');
	}
	else if (editorUi.mode == App.MODE_BROWSER)
	{
		storage = mxResources.get('browser');
	}
	
	if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp)
	{
		function addLogout(logout)
		{
			btn.style.marginBottom = '24px';
			
			var link = document.createElement('a');
			link.style.display = 'inline-block';
			link.style.color = 'gray';
			link.style.cursor = 'pointer';
			link.style.marginTop = '6px';
			mxUtils.write(link, mxResources.get('signOut'));

			// Makes room after last big buttons
			btn.style.marginBottom = '16px';
			buttons.style.paddingBottom = '18px';
			
			mxEvent.addListener(link, 'click', function()
			{
				editorUi.confirm(mxResources.get('areYouSure'), function()
				{
					logout();
				});
			});
			
			buttons.appendChild(link);
		};
				
		if (editorUi.mode == App.MODE_GOOGLE && editorUi.drive != null)
		{
			var driveUsers =editorUi.drive.getUsersList();
		
			if (driveUsers.length > 0)
			{
				var title = document.createElement('span');
				title.style.marginTop = '6px';
				mxUtils.write(title, mxResources.get('changeUser') + ':');
	
				// Makes room after last big buttons
				btn.style.marginBottom = '16px';
				buttons.style.paddingBottom = '18px';
				buttons.appendChild(title);
				
				var usersSelect = document.createElement('select');
				usersSelect.style.marginLeft = '4px';
				usersSelect.style.width = '140px';
				
				for (var i = 0; i < driveUsers.length; i++)
				{
					var option = document.createElement('option');
					mxUtils.write(option, driveUsers[i].displayName);
					option.value = i;
					usersSelect.appendChild(option);
					//More info (email) about the user in a disabled option
					option = document.createElement('option');
					option.innerHTML = '&nbsp;&nbsp;&nbsp;';
					mxUtils.write(option, '<' + driveUsers[i].email + '>');
					option.setAttribute('disabled', 'disabled');
					usersSelect.appendChild(option);
				}
				
				//Add account option
				var option = document.createElement('option');
				mxUtils.write(option, mxResources.get('addAccount'));
				option.value = driveUsers.length;
				usersSelect.appendChild(option);
				
				mxEvent.addListener(usersSelect, 'change', function()
				{
					var userIndex = usersSelect.value;
					var existingAccount = driveUsers.length != userIndex;
					
					if (existingAccount)
					{
						editorUi.drive.setUser(driveUsers[userIndex]);
					}
					
					editorUi.drive.authorize(existingAccount, function()
					{
						editorUi.setMode(App.MODE_GOOGLE);
						editorUi.hideDialog();
						editorUi.showSplash();
					}, function(resp)
					{
						editorUi.handleError(resp, null, function()
						{
							editorUi.hideDialog();
							editorUi.showSplash();
						});
					}, true);
				});
				
				buttons.appendChild(usersSelect);
			}
			else
			{
				addLogout(function()
				{
					editorUi.drive.logout();
				});
			}
		}
		else if (editorUi.mode == App.MODE_ONEDRIVE && editorUi.oneDrive != null && !editorUi.oneDrive.noLogout)
		{
			addLogout(function()
			{
				editorUi.oneDrive.logout();
			});
		}
		else if (editorUi.mode == App.MODE_GITHUB && editorUi.gitHub != null)
		{
			addLogout(function()
			{
				editorUi.gitHub.logout();
				editorUi.openLink('https://www.github.com/logout');
			});
		}
		else if (editorUi.mode == App.MODE_GITLAB && editorUi.gitLab != null)
		{
			addLogout(function()
			{
				editorUi.gitLab.logout();
				editorUi.openLink(DRAWIO_GITLAB_URL + '/users/sign_out');
			});
		}
		else if (editorUi.mode == App.MODE_TRELLO && editorUi.trello != null)
		{
			if (editorUi.trello.isAuthorized())
			{
				addLogout(function()
				{
					editorUi.trello.logout();
				});
			}
		}
		else if (editorUi.mode == App.MODE_DROPBOX && editorUi.dropbox != null)
		{
			// NOTE: Dropbox has a logout option in the picker
			addLogout(function()
			{
				editorUi.dropbox.logout();
				editorUi.openLink('https://www.dropbox.com/logout');
			});
		}
	}

	div.appendChild(buttons);
	this.container = div;
};

/**
 * Constructs a new embed dialog
 */
var EmbedDialog = function(editorUi, result, timeout, ignoreSize, previewFn, title, tweet)
{
	tweet = (tweet != null) ? tweet : 'Check out the diagram I made using @drawio';
	var div = document.createElement('div');
	var maxSize = 500000;
	var maxFbSize = 51200;
	var maxTwitterSize = 7168;

	// Checks if result is a link
	var validUrl = /^https?:\/\//.test(result) || /^mailto:\/\//.test(result);

	if (title != null)
	{
		mxUtils.write(div, title);
	}
	else
	{
		mxUtils.write(div, mxResources.get((result.length < maxSize) ?
			((validUrl) ? 'link' : 'mainEmbedNotice') : 'preview') + ':');
	}
	mxUtils.br(div);
	
	var size = document.createElement('div');
	size.style.position = 'absolute';
	size.style.top = '30px';
	size.style.right = '30px';
	size.style.color = 'gray';
	mxUtils.write(size, editorUi.formatFileSize(result.length));

	div.appendChild(size);
	
	// Using DIV for faster rendering
	var text = document.createElement('textarea');
	text.setAttribute('autocomplete', 'off');
	text.setAttribute('autocorrect', 'off');
	text.setAttribute('autocapitalize', 'off');
	text.setAttribute('spellcheck', 'false');
	text.style.fontFamily = 'monospace';
	text.style.wordBreak = 'break-all';
	text.style.marginTop = '10px';
	text.style.resize = 'none';
	text.style.height = '150px';
	text.style.width = '440px';
	text.style.border = '1px solid gray';
	text.value = mxResources.get('updatingDocument');
	div.appendChild(text);
	mxUtils.br(div);

	this.init = function()
	{
		window.setTimeout(function()
		{
			if (result.length < maxSize)
			{
				text.value = result;
				text.focus();
					
				if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
				{
					text.select();
				}
				else
				{
					document.execCommand('selectAll', false, null);
				}
			}
			else
			{
				text.setAttribute('readonly', 'true');
				text.value = mxResources.get('tooLargeUseDownload');
			}
		}, 0);
	};
	
	var buttons = document.createElement('div');
	buttons.style.position = 'absolute';
	buttons.style.bottom = '36px';
	buttons.style.right = '32px';
	
	var previewBtn = null;
	
	// Loads forever in IE9
	if (EmbedDialog.showPreviewOption && (!mxClient.IS_CHROMEAPP || validUrl) && !navigator.standalone && (validUrl ||
		(mxClient.IS_SVG && (document.documentMode == null || document.documentMode > 9))))
	{
		previewBtn = mxUtils.button(mxResources.get((result.length < maxSize) ? 'preview' : 'openInNewWindow'), function()
		{
			var value = (result.length < maxSize) ? text.value : result;
			
			if (previewFn != null)
			{
				previewFn(value);
			}
			else
			{
				if (validUrl)
				{
					try
					{
						var win = editorUi.openLink(value);
						
						if (win != null && (timeout == null || timeout > 0))
						{
							window.setTimeout(mxUtils.bind(this, function()
							{
								try
								{
									if (win != null && win.location.href != null &&
										win.location.href.substring(0, 8) != value.substring(0, 8))
									{
										win.close();
										editorUi.handleError({message: mxResources.get('drawingTooLarge')});
									}
								}
								catch (e)
								{
									// ignore
								}
							}), timeout || 500);
						}
					}
					catch (e)
					{
						editorUi.handleError({message: e.message || mxResources.get('drawingTooLarge')});
					}
				}
				else
				{
					var wnd = window.open();
					var doc = (wnd != null) ? wnd.document : null;
					
					if (doc != null)
					{
						doc.writeln('<html><head><title>' + encodeURIComponent(mxResources.get('preview')) +
							'</title><meta charset="utf-8"></head>' +
							'<body>' + result + '</body></html>');
						doc.close();
					}
					else
					{
						editorUi.handleError({message: mxResources.get('errorUpdatingPreview')});
					}
				}
			}
		});
		
		previewBtn.className = 'geBtn';
		buttons.appendChild(previewBtn);
	}
	
	if (!validUrl || result.length > 7500)
	{
		var downloadBtn = mxUtils.button(mxResources.get('download'), function()
		{
			editorUi.hideDialog();
			editorUi.saveData('embed.txt', 'txt', result, 'text/plain');
		});
		
		downloadBtn.className = 'geBtn';
		buttons.appendChild(downloadBtn);
	}

	// Twitter-intent does not allow more characters, must be pasted manually
	if (validUrl && (!editorUi.isOffline() || mxClient.IS_CHROMEAPP))
	{
		if (result.length < maxFbSize)
		{
			var fbBtn = mxUtils.button('', function()
			{
				try
				{
					var url = 'https://www.facebook.com/sharer.php?p[url]=' +
						encodeURIComponent(text.value);
					editorUi.openLink(url);
				}
				catch (e)
				{
					editorUi.handleError({message: e.message || mxResources.get('drawingTooLarge')});
				}
			});
			
			var img = document.createElement('img');
			img.setAttribute('src', Editor.facebookImage);
			img.setAttribute('width', '18');
			img.setAttribute('height', '18');
			img.setAttribute('border', '0');
				
			fbBtn.appendChild(img);
			fbBtn.setAttribute('title', mxResources.get('facebook') + ' (' +
					editorUi.formatFileSize(maxFbSize) + ' max)');
			fbBtn.style.verticalAlign = 'bottom';
			fbBtn.style.paddingTop = '4px';
			fbBtn.style.minWidth = '46px'
			fbBtn.className = 'geBtn';
			buttons.appendChild(fbBtn);
		}
		
		if (result.length < maxTwitterSize)
		{
			var tweetBtn = mxUtils.button('', function()
			{
				try
				{
					var url = 'https://twitter.com/intent/tweet?text=' + 
						encodeURIComponent(tweet) + '&url=' +
						encodeURIComponent(text.value);
					editorUi.openLink(url);
				}
				catch (e)
				{
					editorUi.handleError({message: e.message || mxResources.get('drawingTooLarge')});
				}
			});
			
			var img = document.createElement('img');
			img.setAttribute('src', Editor.tweetImage);
			img.setAttribute('width', '18');
			img.setAttribute('height', '18');
			img.setAttribute('border', '0');
			img.style.marginBottom = '5px'
	
			tweetBtn.appendChild(img);
			tweetBtn.setAttribute('title', mxResources.get('twitter') + ' (' +
					editorUi.formatFileSize(maxTwitterSize) + ' max)');
			tweetBtn.style.verticalAlign = 'bottom';
			tweetBtn.style.paddingTop = '4px';
			tweetBtn.style.minWidth = '46px'
			tweetBtn.className = 'geBtn';
			buttons.appendChild(tweetBtn);
		}
	}
	
	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});

	buttons.appendChild(closeBtn);

	var copyBtn = mxUtils.button(mxResources.get('copy'), function()
	{
		text.focus();
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
		{
			text.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
		
		document.execCommand('copy');
		editorUi.alert(mxResources.get('copiedToClipboard'));
	});

	if (result.length < maxSize)
	{
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
	}
	else
	{
		buttons.appendChild(previewBtn);
		closeBtn.className = 'geBtn';
		previewBtn.className = 'geBtn gePrimaryBtn';
	}
	
	div.appendChild(buttons);
	this.container = div;
};

/**
 * Add embed dialog option.
 */
EmbedDialog.showPreviewOption = true;

/**
 * Constructs a dialog for embedding the diagram in Google Sites.
 */
var GoogleSitesDialog = function(editorUi, publicUrl)
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
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
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
	urlInput.value = publicUrl || '';
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
		var title = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		
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
	update();
	
	mxEvent.addListener(gadgetInput, 'click', function()
	{
		gadgetInput.focus();
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
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
		else if (type == 'radialTree')
		{
			layout = new mxRadialTreeLayout(graph, false);
			layout.edgeRouting = false;
			layout.levelDistance = 80;
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
				if (container.parentNode != null)
				{
					graph.destroy();
					container.parentNode.removeChild(container);
				}
		
				editorUi.hideDialog();
			});
		})
		
		cancelBtn.className = 'geBtn';
		
		if (editorUi.editor.cancelFirst)
		{
			div.appendChild(cancelBtn);
		}
		
		var okBtn = mxUtils.button(mxResources.get('insert'), function(evt)
		{
			graph.clearCellOverlays();
			
			var cells = graph.getModel().getChildren(graph.getDefaultParent());
			var pt = (mxEvent.isAltDown(evt)) ?
				editorUi.editor.graph.getFreeInsertPoint() :
				editorUi.editor.graph.getCenterInsertPoint(
				graph.getBoundingBoxFromGeometry(cells, true));
			cells = editorUi.editor.graph.importCells(cells, pt.x, pt.y);
			var view = editorUi.editor.graph.view;
			var temp = view.getBounds(cells);
			temp.x -= view.translate.x;
			temp.y -= view.translate.y;
			editorUi.editor.graph.scrollRectToVisible(temp);
			editorUi.editor.graph.setSelectionCells(cells);
			
			if (container.parentNode != null)
			{
				graph.destroy();
				container.parentNode.removeChild(container);
			}
			
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
var BackgroundImageDialog = function(editorUi, applyFn, img)
{
	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';

	var h3 = document.createElement('h2');
	mxUtils.write(h3, mxResources.get('backgroundImage'));
	h3.style.marginTop = '0px';
	div.appendChild(h3);
	
	mxUtils.write(div, mxResources.get('image') + ' ' + mxResources.get('url') + ':');
	mxUtils.br(div);
	
	var urlInput = document.createElement('input');
	urlInput.setAttribute('type', 'text');
	urlInput.style.marginTop = '4px';
	urlInput.style.marginBottom = '4px';
	urlInput.style.width = '350px';
	urlInput.value = (img != null) ? img.src : '';
	
	var resetting = false;
	var ignoreEvt = false;
	
	var urlChanged = function(evt, done)
	{
		// Skips blur event if called from apply button
		if (evt == null || !ignoreEvt)
		{
			urlInput.value = mxUtils.trim(urlInput.value);
				
			if (!resetting && urlInput.value != '' && !editorUi.isOffline())
			{
				editorUi.loadImage(urlInput.value, function(img)
				{
					widthInput.value = img.width;
					heightInput.value = img.height;
					
					if (done != null)
					{
						done(urlInput.value);
					}
				}, function()
				{
					editorUi.showError(mxResources.get('error'), mxResources.get('fileNotFound'), mxResources.get('ok'));
					widthInput.value = '';
					heightInput.value = '';
					
					if (done != null)
					{
						done(null);
					}
				});
			}
			else
			{
				widthInput.value = '';
				heightInput.value = '';
				
				if (done != null)
				{
					done('');
				}
			}
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
			    	}, true, editorUi.maxBackgroundBytes, editorUi.maxBackgroundBytes, true);
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
	mxEvent.addGestureListeners(resetBtn, function()
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
		resetting = true;
		editorUi.hideDialog();
	});
	
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		editorUi.hideDialog();
		
		urlChanged(null, function(url)
		{
			applyFn((url != '' && url != null) ? new mxImage(urlInput.value,
				widthInput.value, heightInput.value) : null, url == null);
		});
	});
	
	mxEvent.addGestureListeners(applyBtn, function()
	{
		ignoreEvt = true;
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
var ParseDialog = function(editorUi, title, defaultType)
{
	var plantUmlExample = '@startuml\nskinparam shadowing false\nAlice -> Bob: Authentication Request\nBob --> Alice: Authentication Response\n\nAlice -> Bob: Another authentication Request\nAlice <-- Bob: Another authentication Response\n@enduml';
	var insertPoint = editorUi.editor.graph.getFreeInsertPoint();

	function parse(text, type, evt)
	{
		var lines = text.split('\n');
		
		if (type == 'plantUmlPng' || type == 'plantUmlSvg' || type == 'plantUmlTxt')
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('inserting')))
			{
				var graph = editorUi.editor.graph;
				var format = (type == 'plantUmlTxt') ? 'txt' :
					((type == 'plantUmlPng') ? 'png' : 'svg');
				
				function insertPlantUmlImage(text, format, data, w, h)
				{
					insertPoint = (mxEvent.isAltDown(evt)) ? insertPoint : graph.getCenterInsertPoint(new mxRectangle(0, 0, w, h));
					var cell = null;
					
					graph.getModel().beginUpdate();
					try
					{
						cell = (format == 'txt') ?
							editorUi.insertAsPreText(data, insertPoint.x, insertPoint.y) :
							graph.insertVertex(null, null, null, insertPoint.x, insertPoint.y,
								w, h, 'shape=image;noLabel=1;verticalAlign=top;aspect=fixed;imageAspect=0;' +
								'image=' + editorUi.convertDataUri(data) + ';')
						graph.setAttributeForCell(cell, 'plantUmlData',
							JSON.stringify({data: text, format: format},
							null, 2));
					}
					finally
					{
						graph.getModel().endUpdate();
					}
					
					if (cell != null)
					{
						graph.setSelectionCell(cell);
						graph.scrollCellToVisible(cell);
					}
				};
				
				// Hardcoded response for default settings
				if (text == plantUmlExample && format == 'svg')
				{
					window.setTimeout(function()
					{
						editorUi.spinner.stop();
						insertPlantUmlImage(text, format, 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb250ZW50U2NyaXB0VHlwZT0iYXBwbGljYXRpb24vZWNtYXNjcmlwdCIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIGhlaWdodD0iMjEycHgiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHN0eWxlPSJ3aWR0aDoyOTVweDtoZWlnaHQ6MjEycHg7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyOTUgMjEyIiB3aWR0aD0iMjk1cHgiIHpvb21BbmRQYW49Im1hZ25pZnkiPjxkZWZzLz48Zz48bGluZSBzdHlsZT0ic3Ryb2tlOiAjQTgwMDM2OyBzdHJva2Utd2lkdGg6IDEuMDsgc3Ryb2tlLWRhc2hhcnJheTogNS4wLDUuMDsiIHgxPSIzMSIgeDI9IjMxIiB5MT0iMzQuNDg4MyIgeTI9IjE3MS43MzA1Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogI0E4MDAzNjsgc3Ryb2tlLXdpZHRoOiAxLjA7IHN0cm9rZS1kYXNoYXJyYXk6IDUuMCw1LjA7IiB4MT0iMjY0LjUiIHgyPSIyNjQuNSIgeTE9IjM0LjQ4ODMiIHkyPSIxNzEuNzMwNSIvPjxyZWN0IGZpbGw9IiNGRUZFQ0UiIGhlaWdodD0iMzAuNDg4MyIgc3R5bGU9InN0cm9rZTogI0E4MDAzNjsgc3Ryb2tlLXdpZHRoOiAxLjU7IiB3aWR0aD0iNDciIHg9IjgiIHk9IjMiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIzMyIgeD0iMTUiIHk9IjIzLjUzNTIiPkFsaWNlPC90ZXh0PjxyZWN0IGZpbGw9IiNGRUZFQ0UiIGhlaWdodD0iMzAuNDg4MyIgc3R5bGU9InN0cm9rZTogI0E4MDAzNjsgc3Ryb2tlLXdpZHRoOiAxLjU7IiB3aWR0aD0iNDciIHg9IjgiIHk9IjE3MC43MzA1Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGxlbmd0aEFkanVzdD0ic3BhY2luZ0FuZEdseXBocyIgdGV4dExlbmd0aD0iMzMiIHg9IjE1IiB5PSIxOTEuMjY1NiI+QWxpY2U8L3RleHQ+PHJlY3QgZmlsbD0iI0ZFRkVDRSIgaGVpZ2h0PSIzMC40ODgzIiBzdHlsZT0ic3Ryb2tlOiAjQTgwMDM2OyBzdHJva2Utd2lkdGg6IDEuNTsiIHdpZHRoPSI0MCIgeD0iMjQ0LjUiIHk9IjMiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIyNiIgeD0iMjUxLjUiIHk9IjIzLjUzNTIiPkJvYjwvdGV4dD48cmVjdCBmaWxsPSIjRkVGRUNFIiBoZWlnaHQ9IjMwLjQ4ODMiIHN0eWxlPSJzdHJva2U6ICNBODAwMzY7IHN0cm9rZS13aWR0aDogMS41OyIgd2lkdGg9IjQwIiB4PSIyNDQuNSIgeT0iMTcwLjczMDUiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIyNiIgeD0iMjUxLjUiIHk9IjE5MS4yNjU2Ij5Cb2I8L3RleHQ+PHBvbHlnb24gZmlsbD0iI0E4MDAzNiIgcG9pbnRzPSIyNTIuNSw2MS43OTg4LDI2Mi41LDY1Ljc5ODgsMjUyLjUsNjkuNzk4OCwyNTYuNSw2NS43OTg4IiBzdHlsZT0ic3Ryb2tlOiAjQTgwMDM2OyBzdHJva2Utd2lkdGg6IDEuMDsiLz48bGluZSBzdHlsZT0ic3Ryb2tlOiAjQTgwMDM2OyBzdHJva2Utd2lkdGg6IDEuMDsiIHgxPSIzMS41IiB4Mj0iMjU4LjUiIHkxPSI2NS43OTg4IiB5Mj0iNjUuNzk4OCIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBsZW5ndGhBZGp1c3Q9InNwYWNpbmdBbmRHbHlwaHMiIHRleHRMZW5ndGg9IjE0NyIgeD0iMzguNSIgeT0iNjEuMDU2NiI+QXV0aGVudGljYXRpb24gUmVxdWVzdDwvdGV4dD48cG9seWdvbiBmaWxsPSIjQTgwMDM2IiBwb2ludHM9IjQyLjUsOTEuMTA5NCwzMi41LDk1LjEwOTQsNDIuNSw5OS4xMDk0LDM4LjUsOTUuMTA5NCIgc3R5bGU9InN0cm9rZTogI0E4MDAzNjsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogI0E4MDAzNjsgc3Ryb2tlLXdpZHRoOiAxLjA7IHN0cm9rZS1kYXNoYXJyYXk6IDIuMCwyLjA7IiB4MT0iMzYuNSIgeDI9IjI2My41IiB5MT0iOTUuMTA5NCIgeTI9Ijk1LjEwOTQiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIxNTciIHg9IjQ4LjUiIHk9IjkwLjM2NzIiPkF1dGhlbnRpY2F0aW9uIFJlc3BvbnNlPC90ZXh0Pjxwb2x5Z29uIGZpbGw9IiNBODAwMzYiIHBvaW50cz0iMjUyLjUsMTIwLjQxOTksMjYyLjUsMTI0LjQxOTksMjUyLjUsMTI4LjQxOTksMjU2LjUsMTI0LjQxOTkiIHN0eWxlPSJzdHJva2U6ICNBODAwMzY7IHN0cm9rZS13aWR0aDogMS4wOyIvPjxsaW5lIHN0eWxlPSJzdHJva2U6ICNBODAwMzY7IHN0cm9rZS13aWR0aDogMS4wOyIgeDE9IjMxLjUiIHgyPSIyNTguNSIgeTE9IjEyNC40MTk5IiB5Mj0iMTI0LjQxOTkiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIxOTkiIHg9IjM4LjUiIHk9IjExOS42Nzc3Ij5Bbm90aGVyIGF1dGhlbnRpY2F0aW9uIFJlcXVlc3Q8L3RleHQ+PHBvbHlnb24gZmlsbD0iI0E4MDAzNiIgcG9pbnRzPSI0Mi41LDE0OS43MzA1LDMyLjUsMTUzLjczMDUsNDIuNSwxNTcuNzMwNSwzOC41LDE1My43MzA1IiBzdHlsZT0ic3Ryb2tlOiAjQTgwMDM2OyBzdHJva2Utd2lkdGg6IDEuMDsiLz48bGluZSBzdHlsZT0ic3Ryb2tlOiAjQTgwMDM2OyBzdHJva2Utd2lkdGg6IDEuMDsgc3Ryb2tlLWRhc2hhcnJheTogMi4wLDIuMDsiIHgxPSIzNi41IiB4Mj0iMjYzLjUiIHkxPSIxNTMuNzMwNSIgeTI9IjE1My43MzA1Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGxlbmd0aEFkanVzdD0ic3BhY2luZ0FuZEdseXBocyIgdGV4dExlbmd0aD0iMjA5IiB4PSI0OC41IiB5PSIxNDguOTg4MyI+QW5vdGhlciBhdXRoZW50aWNhdGlvbiBSZXNwb25zZTwvdGV4dD48IS0tTUQ1PVs3ZjNlNGQwYzkwMWVmZGJjNTdlYjQ0MjQ5YTNiODE5N10KQHN0YXJ0dW1sDQpza2lucGFyYW0gc2hhZG93aW5nIGZhbHNlDQpBbGljZSAtPiBCb2I6IEF1dGhlbnRpY2F0aW9uIFJlcXVlc3QNCkJvYiAtIC0+IEFsaWNlOiBBdXRoZW50aWNhdGlvbiBSZXNwb25zZQ0KDQpBbGljZSAtPiBCb2I6IEFub3RoZXIgYXV0aGVudGljYXRpb24gUmVxdWVzdA0KQWxpY2UgPC0gLSBCb2I6IEFub3RoZXIgYXV0aGVudGljYXRpb24gUmVzcG9uc2UNCkBlbmR1bWwNCgpQbGFudFVNTCB2ZXJzaW9uIDEuMjAyMC4wMihTdW4gTWFyIDAxIDA0OjIyOjA3IENTVCAyMDIwKQooTUlUIHNvdXJjZSBkaXN0cmlidXRpb24pCkphdmEgUnVudGltZTogT3BlbkpESyBSdW50aW1lIEVudmlyb25tZW50CkpWTTogT3BlbkpESyA2NC1CaXQgU2VydmVyIFZNCkphdmEgVmVyc2lvbjogMTIrMzMKT3BlcmF0aW5nIFN5c3RlbTogTWFjIE9TIFgKRGVmYXVsdCBFbmNvZGluZzogVVRGLTgKTGFuZ3VhZ2U6IGVuCkNvdW50cnk6IFVTCi0tPjwvZz48L3N2Zz4=',
							295, 212);
					}, 200);
					
				}
				else
				{
					editorUi.generatePlantUmlImage(text, format, function(data, w, h)
					{
						editorUi.spinner.stop();
						insertPlantUmlImage(text, format, data, w, h);
						
					}, function(e)
					{
						editorUi.handleError(e);
					});
				}
			}
		}
		else if (type == 'mermaid')
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('inserting')))
			{
				var graph = editorUi.editor.graph;
				
				editorUi.generateMermaidImage(text, format, function(data, w, h)
				{
					insertPoint = (mxEvent.isAltDown(evt)) ? insertPoint : graph.getCenterInsertPoint(new mxRectangle(0, 0, w, h));
					editorUi.spinner.stop();
					var cell = null;
					
					graph.getModel().beginUpdate();
					try
					{
						cell = graph.insertVertex(null, null, null, insertPoint.x, insertPoint.y,
								w, h, 'shape=image;noLabel=1;verticalAlign=top;imageAspect=1;' +
								'image=' + data + ';')
						graph.setAttributeForCell(cell, 'mermaidData',
							JSON.stringify({data: text, config:
							EditorUi.defaultMermaidConfig}, null, 2));
					}
					finally
					{
						graph.getModel().endUpdate();
					}
					
					if (cell != null)
					{
						graph.setSelectionCell(cell);
						graph.scrollCellToVisible(cell);
					}
				}, function(e)
				{
					editorUi.handleError(e);
				});
			}
		}
		else if (type == 'table')
		{
			var tableCell = null;
			var rows = null;
			var cells = [];
			var dx = 0;

			for (var i = 0; i < lines.length; i++)
			{
				var tmp = mxUtils.trim(lines[i]);
				
				if (tmp.substring(0, 12).toLowerCase() == 'create table')
				{
					var name = mxUtils.trim(tmp.substring(12));
					
					if (name.charAt(name.length - 1) == '(')
					{
						name = mxUtils.trim(name.substring(0, name.length - 1));
					}
					
					tableCell = new mxCell(name, new mxGeometry(dx, 0, 160, 40),
						'shape=table;startSize=30;container=1;collapsible=1;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;');
					tableCell.vertex = true;
					cells.push(tableCell);
					
					var size = editorUi.editor.graph.getPreferredSizeForCell(rowCell);
		   			
		   			if (size != null)
		   			{
		   				tableCell.geometry.width = size.width + 10;
		   			}
				}
				else if (tableCell != null && tmp.charAt(0) == ')')
				{
					dx += tableCell.geometry.width + 40;
					tableCell = null;
				}
				else if (tmp != '(' && tableCell != null)
				{
					var name = tmp.substring(0, (tmp.charAt(tmp.length - 1) == ',') ? tmp.length - 1 : tmp.length);
					
					if (name.substring(0, 11).toLowerCase() != 'primary key')
					{
						var pk = name.toLowerCase().indexOf('primary key');
						name = name.replace(/primary key/i, '');
						
						var rowCell = new mxCell('', new mxGeometry(0, 0, 160, 30),
							'shape=partialRectangle;collapsible=0;dropTarget=0;pointerEvents=0;fillColor=none;' +
							'points=[[0,0.5],[1,0.5]];portConstraint=eastwest;top=0;left=0;right=0;bottom=' +
							((pk > 0) ? '1' : '0') + ';');
						rowCell.vertex = true;
						
						var left = new mxCell((pk > 0) ? 'PK' : '', new mxGeometry(0, 0, 30, 30),
							'shape=partialRectangle;overflow=hidden;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;' + ((pk > 0) ? 'fontStyle=1;' : ''));
						left.vertex = true;
						rowCell.insert(left);
						
						var right = new mxCell(name, new mxGeometry(30, 0, 130, 30),
							'shape=partialRectangle;overflow=hidden;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;align=left;spacingLeft=6;' + ((pk > 0) ? 'fontStyle=5;' : ''));
						right.vertex = true;
						rowCell.insert(right);
						
			   			var size = editorUi.editor.graph.getPreferredSizeForCell(right);
			   			
			   			if (size != null && tableCell.geometry.width < size.width + 30)
			   			{
			   				tableCell.geometry.width = Math.min(320, Math.max(tableCell.geometry.width, size.width + 30));
			   			}
			   			
			   			tableCell.insert(rowCell);
			   			tableCell.geometry.height += 30;
					}
				}
			}
			
			if (cells.length > 0)
			{
				var graph = editorUi.editor.graph;
				insertPoint = (mxEvent.isAltDown(evt)) ? insertPoint :
					graph.getCenterInsertPoint(graph.getBoundingBoxFromGeometry(cells, true));
				graph.setSelectionCells(graph.importCells(cells, insertPoint.x, insertPoint.y));
				graph.scrollCellToVisible(graph.getSelectionCell());
			}
		}
		else if (type == 'list')
		{
			if (lines.length > 0)
			{
				var graph = editorUi.editor.graph;
				var listCell = null;
				var cells = [];
				var x0 = 0;

				for (var i = 0; i < lines.length; i++)
				{
					if (lines[i].charAt(0) != ';')
					{
						if (lines[i].length == 0)
						{
							listCell = null;
						}
						else
						{
							if (listCell == null)
							{
								listCell = new mxCell(lines[i], new mxGeometry(x0, 0, 160, 26 + 4),
									'swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;');
								listCell.vertex = true;
								cells.push(listCell);

								var size = graph.getPreferredSizeForCell(listCell);
						
					   			if (size != null && listCell.geometry.width < size.width + 10)
					   			{
					   				listCell.geometry.width = size.width + 10;
					   			}
					   			
					   			x0 += listCell.geometry.width + 40;
							}
							else if (lines[i] == '--')
							{
								var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
								divider.vertex = true;
								listCell.geometry.height += divider.geometry.height;
								listCell.insert(divider);
							}
							else if (lines[i].length > 0)
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
				}
				
				if (cells.length > 0)
				{
					insertPoint = (mxEvent.isAltDown(evt)) ? insertPoint :
						graph.getCenterInsertPoint(graph.getBoundingBoxFromGeometry(cells, true));
					
					graph.getModel().beginUpdate();
					try
					{
						cells = graph.importCells(cells, insertPoint.x, insertPoint.y);
						var inserted = [];
						
						for (var i = 0; i < cells.length; i++)
						{
							inserted.push(cells[i]);
							inserted = inserted.concat(cells[i].children);
						}
						
						graph.fireEvent(new mxEventObject('cellsInserted', 'cells', inserted));
					}
					finally
					{
						graph.getModel().endUpdate();
					}
					
					graph.setSelectionCells(cells);
					graph.scrollCellToVisible(graph.getSelectionCell());
				}
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
					vertex = new mxCell(id, new mxGeometry(0, 0, 80, 30), 'whiteSpace=wrap;html=1;');
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
					
					if (values.length >= 2)
					{
						var source = getOrCreateVertex(values[0]);
						var target = getOrCreateVertex(values[values.length - 1]);
						
						var edge = new mxCell((values.length > 2) ? values[1] : '', new mxGeometry());
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
				
				// Temporary graph for running the layout
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
					
					var edgeLayout = new mxParallelEdgeLayout(graph);
					edgeLayout.spacing = 20;
					edgeLayout.execute(graph.getDefaultParent());
				}
				finally
				{
					graph.getModel().endUpdate();
				}
				
				graph.clearCellOverlays();
				
				// Copy to actual graph
				var inserted = [];
				
				editorUi.editor.graph.getModel().beginUpdate();
				try
				{
					cells = graph.getModel().getChildren(graph.getDefaultParent());
					insertPoint = (mxEvent.isAltDown(evt)) ? insertPoint :
						editorUi.editor.graph.getCenterInsertPoint(graph.getBoundingBoxFromGeometry(cells, true));
					inserted = editorUi.editor.graph.importCells(cells, insertPoint.x, insertPoint.y)
					editorUi.editor.graph.fireEvent(new mxEventObject('cellsInserted', 'cells', inserted));
				}
				finally
				{
					editorUi.editor.graph.getModel().endUpdate();
				}

				editorUi.editor.graph.setSelectionCells(inserted);
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
	
	if (defaultType == 'formatSql' || defaultType == 'mermaid')
	{
		typeSelect.style.display = 'none';
	}

	var listOption = document.createElement('option');
	listOption.setAttribute('value', 'list');
	mxUtils.write(listOption, mxResources.get('list'));
	
	if (defaultType != 'plantUml')
	{
		typeSelect.appendChild(listOption);
	}

	if (defaultType == null || defaultType == 'fromText')
	{
		listOption.setAttribute('selected', 'selected');
	}
	
	var tableOption = document.createElement('option');
	tableOption.setAttribute('value', 'table');
	mxUtils.write(tableOption, mxResources.get('formatSql'));
	
	if (defaultType == 'formatSql')
	{
		typeSelect.appendChild(tableOption);
		tableOption.setAttribute('selected', 'selected');
	}
	
	var mermaidOption = document.createElement('option');
	mermaidOption.setAttribute('value', 'mermaid');
	mxUtils.write(mermaidOption, mxResources.get('formatSql'));
	
	if (defaultType == 'mermaid')
	{
		typeSelect.appendChild(mermaidOption);
		mermaidOption.setAttribute('selected', 'selected');
	}
	
	var diagramOption = document.createElement('option');
	diagramOption.setAttribute('value', 'diagram');
	mxUtils.write(diagramOption, mxResources.get('diagram'));
	
	if (defaultType != 'plantUml')
	{
		typeSelect.appendChild(diagramOption);
	}

	var plantUmlSvgOption = document.createElement('option');
	plantUmlSvgOption.setAttribute('value', 'plantUmlSvg');
	mxUtils.write(plantUmlSvgOption, mxResources.get('plantUml') + ' (' + mxResources.get('formatSvg') + ')');
	
	if (defaultType == 'plantUml')
	{
		plantUmlSvgOption.setAttribute('selected', 'selected');
	}
	
	var plantUmlPngOption = document.createElement('option');
	plantUmlPngOption.setAttribute('value', 'plantUmlPng');
	mxUtils.write(plantUmlPngOption, mxResources.get('plantUml') + ' (' + mxResources.get('formatPng') + ')');
	
	var plantUmlTxtOption = document.createElement('option');
	plantUmlTxtOption.setAttribute('value', 'plantUmlTxt');
	mxUtils.write(plantUmlTxtOption, mxResources.get('plantUml') + ' (' + mxResources.get('text') + ')');
	
	// Disabled for invalid hosts via CORS headers
	if (EditorUi.enablePlantUml && Graph.fileSupport &&
		!editorUi.isOffline() && defaultType == 'plantUml')
	{
		typeSelect.appendChild(plantUmlSvgOption);
		typeSelect.appendChild(plantUmlPngOption);
		typeSelect.appendChild(plantUmlTxtOption);
	}

	function getDefaultValue()
	{
		if (typeSelect.value == 'list')
		{
			return 'Person\n-name: String\n-birthDate: Date\n--\n+getName(): String\n+setName(String): void\n+isBirthday(): boolean\n\n' +
				'Address\n-street: String\n-city: String\n-state: String';
		}
		else if (typeSelect.value == 'mermaid')
		{
			return 'graph TD;\n  A-->B;\n  A-->C;\n  B-->D;\n  C-->D;';
		}
		else if (typeSelect.value == 'table')
		{
			return 'CREATE TABLE Suppliers\n(\nsupplier_id int NOT NULL PRIMARY KEY,\n' +
				'supplier_name char(50) NOT NULL,\ncontact_name char(50),\n);\n' +
				'CREATE TABLE Customers\n(\ncustomer_id int NOT NULL PRIMARY KEY,\n' +
				'customer_name char(50) NOT NULL,\naddress char(50),\n' +
				'city char(50),\nstate char(25),\nzip_code char(10)\n);\n';
		}
		else if (typeSelect.value == 'plantUmlPng')
		{
			return '@startuml\nskinparam backgroundcolor transparent\nskinparam shadowing false\nAlice -> Bob: Authentication Request\nBob --> Alice: Authentication Response\n\nAlice -> Bob: Another authentication Request\nAlice <-- Bob: Another authentication Response\n@enduml';
		}
		else if (typeSelect.value == 'plantUmlSvg' || typeSelect.value == 'plantUmlTxt')
		{
			return plantUmlExample;
		}
		else
		{
			return ';Example:\na->b\nb->edge label->c\nc->a\n';
		}
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
	
	if (!editorUi.isOffline() && (defaultType == 'mermaid' || defaultType == 'plantUml'))
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			editorUi.openLink((defaultType == 'mermaid') ?
				'https://mermaid-js.github.io/mermaid/#/' :
				'https://plantuml.com/');
		});
		
		helpBtn.className = 'geBtn';	
		div.appendChild(helpBtn);
	}
	
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
	
	var okBtn = mxUtils.button(mxResources.get('insert'), function(evt)
	{
		editorUi.hideDialog();
		parse(textarea.value, typeSelect.value, evt);
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
var NewDialog = function(editorUi, compact, showName, callback, createOnly, cancelCallback,
		leftHighlight, rightHighlight, rightHighlightBorder, itemPadding, templateFile,
		recentDocsCallback, searchDocsCallback, openExtDocCallback, showImport, createButtonLabel, customTempCallback)
{
	showName = (showName != null) ? showName : true;
	createOnly = (createOnly != null) ? createOnly : false;
	leftHighlight = (leftHighlight != null) ? leftHighlight : '#ebf2f9';
	rightHighlight = (rightHighlight != null) ? rightHighlight : (Editor.isDarkMode() ? '#a2a2a2' : '#e6eff8');
	rightHighlightBorder = (rightHighlightBorder != null) ? rightHighlightBorder : (Editor.isDarkMode() ? '1px dashed #00a8ff' : '1px solid #ccd9ea');
	templateFile = (templateFile != null) ? templateFile : EditorUi.templateFile;
	
	var outer = document.createElement('div');
	outer.style.height = '100%';
	
	var header = document.createElement('div');
	header.style.whiteSpace = 'nowrap';
	header.style.height = '46px';
	
	if (showName)
	{
		outer.appendChild(header);
	}
	
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
	else if (editorUi.mode == App.MODE_GITHUB)
	{
		logo.src = IMAGE_PATH + '/github-logo.svg';
	}
	else if (editorUi.mode == App.MODE_GITLAB)
	{
		logo.src = IMAGE_PATH + '/gitlab-logo.svg';
	}
	else if (editorUi.mode == App.MODE_TRELLO)
	{
		logo.src = IMAGE_PATH + '/trello-logo.svg';
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
	
	var ext = '.drawio';
	
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
	else if (editorUi.mode == App.MODE_GITHUB && editorUi.gitHub != null)
	{
		ext = editorUi.gitHub.extension;
	}
	else if (editorUi.mode == App.MODE_GITLAB && editorUi.gitLab != null)
	{
		ext = editorUi.gitLab.extension;
	}
	else if (editorUi.mode == App.MODE_TRELLO && editorUi.trello != null)
	{
		ext = editorUi.trello.extension;
	}
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', editorUi.defaultFilename + ext);
	nameInput.style.marginLeft = '10px';
	nameInput.style.width = (compact) ? '144px' : '244px';
	
	this.init = function()
	{
		if (showName)
		{
			nameInput.focus();
			
			if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
			{
				nameInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
	};
	
	// Adds filetype dropdown
	if (showName)
	{
		header.appendChild(nameInput);

		if (editorUi.editor.diagramFileTypes != null)
		{
			var typeSelect = FilenameDialog.createFileTypes(editorUi, nameInput, editorUi.editor.diagramFileTypes);
			typeSelect.style.marginLeft = '6px';
			typeSelect.style.width = (compact) ? '80px' : '180px';
			header.appendChild(typeSelect);
		}
		
		if (editorUi.editor.fileExtensions != null)
		{
			var hint = FilenameDialog.createTypeHint(editorUi,
				nameInput, editorUi.editor.fileExtensions);
			hint.style.marginTop = '12px';
			
			header.appendChild(hint);
		}
	}

	var hasTabs = false;
	var i0 = 0;
	
	// Dynamic loading
	function addTemplates()
	{
		var first = true;
		
		//TODO support paging of external templates
		if (templates != null)
		{
			while (i0 < templates.length && (first || mxUtils.mod(i0, 30) != 0))
			{
				var tmp = templates[i0++];
				var btn = addButton(tmp.url, tmp.libs, tmp.title, tmp.tooltip? tmp.tooltip : tmp.title,
					tmp.select, tmp.imgUrl, tmp.info, tmp.onClick, tmp.preview, tmp.noImg, tmp.clibs);
				
				if (first)
				{
					btn.click();
				}
				
				first = false;
			}
		}		
	};
	
	var spinner = new Spinner({
		lines: 12, // The number of lines to draw
		length: 10, // The length of each line
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
	
	var createButton = mxUtils.button(createButtonLabel || mxResources.get('create'), function()
	{
		createButton.setAttribute('disabled', 'disabled');
		create();
		createButton.removeAttribute('disabled');
	});
	
	createButton.className = 'geBtn gePrimaryBtn';

	if (recentDocsCallback || searchDocsCallback)
	{
		var tabsEl = [];
		var oldTemplates = null, origCategories = null, origCustomCatCount = null;
		
		var setActiveTab = function(index)
		{
			createButton.setAttribute('disabled', 'disabled');
			
			for (var i = 0; i < tabsEl.length; i++)
			{
				if (i == index)
					tabsEl[i].className = 'geBtn gePrimaryBtn';
				else
					tabsEl[i].className = 'geBtn';
			}
		}
		
		hasTabs = true;
		var tabs = document.createElement('div');
		tabs.style.whiteSpace = 'nowrap';
		tabs.style.height = '30px';
		outer.appendChild(tabs);
		
		var templatesTab = mxUtils.button(mxResources.get('Templates', null, 'Templates'), function()
		{
			list.style.display = '';
			div.style.left = '160px';
			setActiveTab(0);

			div.scrollTop = 0;
			div.innerHTML = '';
			i0 = 0;
			
			if (oldTemplates != templates)
			{
				templates = oldTemplates;
				categories = origCategories;
				customCatCount = origCustomCatCount;
				list.innerHTML = '';
				initUi();	
				oldTemplates = null;
			}
		});
		
		tabsEl.push(templatesTab);
		tabs.appendChild(templatesTab);
		
		var getExtTemplates = function(isSearch)
		{
			list.style.display = 'none';
			div.style.left = '30px';				
			
			setActiveTab(isSearch? -1 : 1); //deselect all of them if isSearch 
			
			if (oldTemplates == null) 
			{
				oldTemplates = templates;
			}
			
			div.scrollTop = 0;
			div.innerHTML = '';
			spinner.spin(div);

			var callback2 = function(docList, errorMsg, searchImportCats) 
			{
				i0 = 0;
				spinner.stop();
				templates = docList;
				searchImportCats = searchImportCats || {};
				var importListsCount = 0;
				
				for (var cat in searchImportCats)
				{
					importListsCount += searchImportCats[cat].length;
				}
				
				if (errorMsg)
				{
					div.innerHTML = errorMsg;
				}
				else if (docList.length == 0 && importListsCount == 0)
				{
					div.innerHTML = mxUtils.htmlEntities(mxResources.get('noDiagrams', null, 'No Diagrams Found'));
				}
				else
				{
					div.innerHTML = '';
					
					if (importListsCount > 0)
					{
						list.style.display = '';
						div.style.left = '160px';
						list.innerHTML = '';

						customCatCount = 0;
						categories = {'draw.io': docList};
						
						for (var cat in searchImportCats)
						{	
							categories[cat] = searchImportCats[cat];
						}
						
						initUi();
					}
					else
					{
						addTemplates();
					}
				}
			}
			
			if (isSearch)
			{
				searchDocsCallback(searchInput.value, callback2);
			}
			else
			{
				recentDocsCallback(callback2);
			}
		}
		
		if (recentDocsCallback)
		{
			var recentTab = mxUtils.button(mxResources.get('Recent', null, 'Recent'), function()
			{
				getExtTemplates();
			});

			tabs.appendChild(recentTab);
			tabsEl.push(recentTab);
		}
		
		if (searchDocsCallback)
		{
			var searchTab = document.createElement('span');
			searchTab.style.marginLeft = '10px';
			searchTab.innerHTML = mxUtils.htmlEntities(mxResources.get('search') + ':');
			tabs.appendChild(searchTab);

			var searchInput = document.createElement('input');
			searchInput.style.marginRight = '10px';
			searchInput.style.marginLeft = '10px';
			searchInput.style.width = '220px';

			mxEvent.addListener(searchInput, 'keypress', function(e)
			{
				if (e.keyCode == 13)
				{
					getExtTemplates(true);
				}
			});

			tabs.appendChild(searchInput);

			var searchBtn = mxUtils.button(mxResources.get('search'), function()
			{
				getExtTemplates(true);
			});
					
			searchBtn.className = 'geBtn';

			tabs.appendChild(searchBtn);
		}
		
		setActiveTab(0);
	}
	
	var templateLibs = null;
	var templateClibs = null;
	var templateXml = null;
	var selectedElt = null;
	var templateExtUrl = null;
	var templateRealUrl = null;
	var templateInfoObj = null;
	
	function create()
	{
		if (templateExtUrl)
		{
			if (!showName)
			{
				editorUi.hideDialog();
			}
			
			openExtDocCallback(templateExtUrl, templateInfoObj, nameInput.value);
		}
		else if (callback)
		{
			if (!showName)
			{
				editorUi.hideDialog();
			}
			
			callback(templateXml, nameInput.value, templateRealUrl, templateLibs);
		}
		else
		{
			var title = nameInput.value;
				
			if (title != null && title.length > 0)
			{
				editorUi.pickFolder(editorUi.mode, function(folderId)
				{
					editorUi.createFile(title, templateXml, (templateLibs != null &&
						templateLibs.length > 0) ? templateLibs : null, null, function()
					{
						editorUi.hideDialog();
					}, null, folderId, null, (templateClibs != null &&
						templateClibs.length > 0) ? templateClibs : null);
				}, editorUi.mode != App.MODE_GOOGLE ||
					editorUi.stateArg == null ||
					editorUi.stateArg.folderId == null);
			}
		}
	};
	
	var div = document.createElement('div');
	div.style.border = '1px solid #d3d3d3';
	div.style.position = 'absolute';
	div.style.left = '160px';
	div.style.right = '34px';
	var divTop = (showName) ? 72 : 40;
	divTop += hasTabs? 30 : 0;
	div.style.top = divTop + 'px';
	div.style.bottom = '68px';
	div.style.margin = '6px 0 0 -1px';
	div.style.padding = '6px';
	div.style.overflow = 'auto';
	
	var list = document.createElement('div');
	list.style.cssText = 'position:absolute;left:30px;width:128px;top:' + divTop + 'px;bottom:68px;margin-top:6px;overflow:auto;border:1px solid #d3d3d3;';
	
	var w = 140;
	var h = 140;

	function selectElement(elt, xml, libs, extUrl, infoObj, clibs, realUrl)
	{
		if (selectedElt != null)
		{
			selectedElt.style.backgroundColor = 'transparent';
			selectedElt.style.border = '1px solid transparent';
		}
		
		createButton.removeAttribute('disabled');
		
		templateXml = xml;
		templateLibs = libs;
		templateClibs = clibs;
		selectedElt = elt;
		templateExtUrl = extUrl;
		templateRealUrl = realUrl;
		templateInfoObj = infoObj;
		
		selectedElt.style.backgroundColor = rightHighlight;
		selectedElt.style.border = rightHighlightBorder;
	};

	function addButton(url, libs, title, tooltip, select, imgUrl, infoObj, onClick, preview, noImg, clibs)
	{
		var elt = document.createElement('div');
		elt.className = 'geTemplate';
		elt.style.height = w + 'px';
		elt.style.width = h + 'px';
	
		if (Editor.isDarkMode())
		{
			elt.style.filter = 'invert(100%)';
		}
		
		if (title != null)
		{
			elt.setAttribute('title', mxResources.get(title, null, title));
		}
		else if (tooltip != null && tooltip.length > 0)
		{
			elt.setAttribute('title', tooltip);
		}
		
		if (imgUrl != null)
		{
			elt.style.display = 'inline-flex';
			elt.style.justifyContent = 'center';
			elt.style.alignItems = 'center';
			var img = document.createElement('img');
			img.setAttribute('src', imgUrl);
			img.setAttribute('alt', tooltip);
			img.style.maxWidth = w + 'px';
			img.style.maxHeight = h + 'px';
			
			var fallbackImgUrl = imgUrl.replace('.drawio.xml', '').replace('.drawio', '').replace('.xml', '');
			elt.appendChild(img);
			
			img.onerror = function()
			{
				if (this.src != fallbackImgUrl)
				{
					this.src = fallbackImgUrl;
				}
				else
				{
					this.src = Editor.errorImage;
					this.onerror = null;
				}
			}
			
			mxEvent.addListener(elt, 'click', function(evt)
			{
				selectElement(elt, null, null, url, infoObj, clibs);
			});
			
			mxEvent.addListener(elt, 'dblclick', function(evt)
			{
				create();
			});
		}
		else if (!noImg && url != null && url.length > 0)
		{
			var png = preview || (TEMPLATE_PATH + '/' + url.substring(0, url.length - 4) + '.png');
			
			elt.style.backgroundImage = 'url(' + png + ')';
			elt.style.backgroundPosition = 'center center';
			elt.style.backgroundRepeat = 'no-repeat';
			
			if (title != null)
			{
				elt.innerHTML = '<table width="100%" height="100%" style="line-height:1.3em;' + (Editor.isDarkMode() ? '' : 'background:rgba(255,255,255,0.85);') +
					'border:inherit;"><tr><td align="center" valign="middle"><span style="display:inline-block;padding:4px 8px 4px 8px;user-select:none;' +
					'border-radius:3px;background:rgba(255,255,255,0.85);overflow:hidden;text-overflow:ellipsis;max-width:' + (w - 34) + 'px;">' +
					mxUtils.htmlEntities(mxResources.get(title, null, title)) + '</span></td></tr></table>';
			}
			
			var createIt = false;
			
			mxEvent.addListener(elt, 'click', function(evt)
			{
				createButton.setAttribute('disabled', 'disabled');
				elt.style.backgroundColor = 'transparent';
				elt.style.border = '1px solid transparent';
				var realUrl = url;
				
				if (/^https?:\/\//.test(realUrl) && !editorUi.editor.isCorsEnabledForUrl(realUrl))
				{
					realUrl = PROXY_URL + '?url=' + encodeURIComponent(realUrl);
				}
				else
				{
					realUrl = TEMPLATE_PATH + '/' + realUrl;
				}
				
				spinner.spin(div);
				
				mxUtils.get(realUrl, mxUtils.bind(this, function(req)
				{
					spinner.stop();
					
					if (req.getStatus() >= 200 && req.getStatus() <= 299)
					{
						selectElement(elt, req.getText(), libs, null, null, clibs, realUrl);
						
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
			elt.innerHTML = '<table width="100%" height="100%" style="line-height:1.3em;"><tr>' +
				'<td align="center" valign="middle"><span style="display:inline-block;padding:4px 8px 4px 8px;user-select:none;' +
				'border-radius:3px;background:#ffffff;overflow:hidden;text-overflow:ellipsis;max-width:' + (w - 34) + 'px;">' +
				mxUtils.htmlEntities(mxResources.get(title, null, title)) + '</span></td></tr></table>';
			
			if (select)
			{
				selectElement(elt);
			}
			
			if (onClick != null)
			{
				mxEvent.addListener(elt, 'click', onClick);
			}
			else
			{
				mxEvent.addListener(elt, 'click', function(evt)
				{
					selectElement(elt, null, null, url, infoObj);
				});
				
				mxEvent.addListener(elt, 'dblclick', function(evt)
				{
					create();
				});
			}
		}

		div.appendChild(elt);
		return elt;
	};

	var categories = {}, customCats = {};
	var customCatCount = 0, firstInitUi = true;
	
	// Adds local basic templates
	categories['basic'] = [{title: 'blankDiagram', select: true}];
	var templates = categories['basic'];
	
	function initUi()
	{
		if (firstInitUi)
		{
			firstInitUi = false;
			
			mxEvent.addListener(div, 'scroll', function(evt)
			{
				if (div.scrollTop + div.clientHeight >= div.scrollHeight)
				{
					addTemplates();
					mxEvent.consume(evt);
				}
			});
		}
		
		var currentEntry = null;
		
		if (customCatCount > 0)
		{
			var titleCss = 'font-weight: bold;background: #f9f9f9;padding: 5px 0 5px 0;text-align: center;';
			var title = document.createElement('div');
			title.style.cssText = titleCss;
			mxUtils.write(title, mxResources.get('custom'));
			list.appendChild(title);
			
			for (var cat in customCats)
			{
				var entry = document.createElement('div');
				var label = cat;
				var templateList = customCats[cat];
				
				if (label.length > 18)
				{
					label = label.substring(0, 18) + '&hellip;';
				}
				
				entry.style.cssText = 'display:block;cursor:pointer;padding:6px;white-space:nowrap;margin-bottom:-1px;overflow:hidden;text-overflow:ellipsis;user-select:none;';
				entry.setAttribute('title', label + ' (' + templateList.length + ')');
				mxUtils.write(entry, entry.getAttribute('title'));
				
				if (itemPadding != null)
				{
					entry.style.padding = itemPadding;
				}

				list.appendChild(entry);
				
				(function(cat2, entry2)
				{
					mxEvent.addListener(entry, 'click', function()
					{
						if (currentEntry != entry2)
						{
							currentEntry.style.backgroundColor = '';
							currentEntry = entry2;
							currentEntry.style.backgroundColor = leftHighlight;
							
							div.scrollTop = 0;
							div.innerHTML = '';
							i0 = 0;
							
							templates = customCats[cat2];
							oldTemplates = null;
							addTemplates();
						}
					});
				})(cat, entry);
			}
			
			title = document.createElement('div');
			title.style.cssText = titleCss;
			mxUtils.write(title, 'draw.io');
			list.appendChild(title);
		}
		
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
			
			entry.style.cssText = 'display:block;cursor:pointer;padding:6px;white-space:nowrap;margin-bottom:-1px;overflow:hidden;text-overflow:ellipsis;user-select:none;';
			entry.setAttribute('title', label + ' (' + templateList.length + ')');
			mxUtils.write(entry, entry.getAttribute('title'));
			
			if (itemPadding != null)
			{
				entry.style.padding = itemPadding;
			}

			list.appendChild(entry);
			
			if (currentEntry == null && templateList.length > 0)
			{
				currentEntry = entry;
				currentEntry.style.backgroundColor = leftHighlight;
				templates = templateList;
			}
			
			(function(cat2, entry2)
			{
				mxEvent.addListener(entry, 'click', function()
				{
					if (currentEntry != entry2)
					{
						currentEntry.style.backgroundColor = '';
						currentEntry = entry2;
						currentEntry.style.backgroundColor = leftHighlight;
						
						div.scrollTop = 0;
						div.innerHTML = '';
						i0 = 0;
						
						templates = categories[cat2];
						oldTemplates = null;
						addTemplates();
					}
				});
			})(cat, entry);
		}
		
		addTemplates();
	};

	if (!compact)
	{
		outer.appendChild(list);
		outer.appendChild(div);
		var indexLoaded = false;
		var realUrl = templateFile;
		
		if (/^https?:\/\//.test(realUrl) && !editorUi.editor.isCorsEnabledForUrl(realUrl))
		{
			realUrl = PROXY_URL + '?url=' + encodeURIComponent(realUrl);
		}
		
		function loadDrawioTemplates()
		{
			mxUtils.get(realUrl, function(req)
			{
				// Workaround for index loaded 3 times in iOS offline mode
				if (!indexLoaded)
				{
					indexLoaded = true;
					var tmpDoc = req.getXml();
					var node = tmpDoc.documentElement.firstChild;
					var clibs = {};
		
					while (node != null)
					{
						if (typeof(node.getAttribute) !== 'undefined')
						{
							if (node.nodeName == 'clibs')
							{
								var name = node.getAttribute('name');
								var adds = node.getElementsByTagName('add');
								var temp = [];
								
								for (var i = 0; i < adds.length; i++)
								{
									temp.push(encodeURIComponent(mxUtils.getTextContent(adds[i])));
								}
								
								if (name != null && temp.length > 0)
								{
									clibs[name] = temp.join(';');
								}
							}
							else
							{
								var url = node.getAttribute('url');
								
								if (url != null)
								{
									var category = node.getAttribute('section');
									
									if (category == null)
									{
										var slash = url.indexOf('/');
										category = url.substring(0, slash);
									}
									
									var list = categories[category];
									
									if (list == null)
									{
										list = [];
										categories[category] = list;
									}
									
									var tempLibs = node.getAttribute('clibs');
									
									if (clibs[tempLibs] != null)
									{
										tempLibs = clibs[tempLibs];
									}
									
									list.push({url: node.getAttribute('url'), libs: node.getAttribute('libs'),
										title: node.getAttribute('title'), tooltip: node.getAttribute('url'),
										preview: node.getAttribute('preview'), clibs: tempLibs});
								}
							}
						}
						
						node = node.nextSibling;
					}
					
					spinner.stop();
					initUi();
				}
			});
		};
		
		spinner.spin(div);
		
		if (customTempCallback != null)
		{
			customTempCallback(function(cats, count)
			{
				customCats = cats;
				customCatCount = count;
				//Custom templates doesn't change after being loaded, so cache them here. Also, only count is overridden
				origCustomCatCount = count;

				loadDrawioTemplates();
			}, 
			loadDrawioTemplates); //In case of an error, just load draw.io templates only
		}
		else
		{
			loadDrawioTemplates();
		}
		
		//draw.io templates doesn't change after being loaded, so cache them here
		origCategories = categories;
	}
	
	mxEvent.addListener(nameInput, 'keypress', function(e)
	{
		if (editorUi.dialog.container.firstChild == outer &&
			e.keyCode == 13)
		{
			create();
		}
	});
	
	var btns = document.createElement('div');
	btns.style.marginTop = (compact) ? '4px' : '16px';
	btns.style.textAlign = 'right';
	btns.style.position = 'absolute';
	btns.style.left = '40px';
	btns.style.bottom = '24px';
	btns.style.right = '40px';
	
	if (!compact && !editorUi.isOffline() && showName && callback == null && !createOnly)
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			editorUi.openLink('https://support.draw.io/display/DO/Creating+and+Opening+Files');
		});
		
		helpBtn.className = 'geBtn';	
		btns.appendChild(helpBtn);
	}

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		if (cancelCallback != null)
		{
			cancelCallback();
		}
		
		editorUi.hideDialog(true);
	});
	
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst && (!createOnly || cancelCallback != null))
	{
		btns.appendChild(cancelBtn);
	}

	if (!compact && urlParams['embed'] != '1' && !createOnly)
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
	
	if (Graph.fileSupport && showImport)
	{
		var importBtn = mxUtils.button(mxResources.get('import'), function()
		{
			if (editorUi.newDlgFileInputElt == null) 
			{
				var fileInput = document.createElement('input');
				fileInput.setAttribute('multiple', 'multiple');
				fileInput.setAttribute('type', 'file');
				
				mxEvent.addListener(fileInput, 'change', function(evt)
				{
					editorUi.openFiles(fileInput.files, true);
					fileInput.value = '';
				});
				
				fileInput.style.display = 'none';
				document.body.appendChild(fileInput);
				editorUi.newDlgFileInputElt = fileInput;
			}
			
			editorUi.newDlgFileInputElt.click();
		});
				
		importBtn.className = 'geBtn';
		btns.appendChild(importBtn);
	}
	
	btns.appendChild(createButton);
	
	if (!editorUi.editor.cancelFirst && callback == null && (!createOnly || cancelCallback != null))
	{
		btns.appendChild(cancelBtn);
	}
	
	outer.appendChild(btns);
	
	this.container = outer;
};

/**
 * Constructs a dialog for creating new files from a template URL.
 * Also used for dialog choosing where to save or export resources
 */
var CreateDialog = function(editorUi, title, createFn, cancelFn, dlgTitle, btnLabel, overrideExtension, allowBrowser,
	allowTab, helpLink, showDeviceButton, rowLimit, data, mimeType, base64Encoded, hints, hideDialog)
{
	overrideExtension = (overrideExtension != null) ? overrideExtension : true;
	allowBrowser = (allowBrowser != null) ? allowBrowser : true;
	rowLimit = (rowLimit != null) ? rowLimit : 4;
	hideDialog = (hideDialog != null) ? hideDialog : true;

	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';
	
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
	nameInput.style.width = '200px';
	nameInput.style.marginLeft = '10px';
	nameInput.style.marginBottom = '20px';
	nameInput.style.maxWidth = '70%';
	
	this.init = function()
	{
		nameInput.focus();
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
		{
			nameInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};

	div.appendChild(nameInput);

	if (hints != null)
	{
		if (editorUi.editor.diagramFileTypes != null)
		{
			var typeSelect = FilenameDialog.createFileTypes(editorUi, nameInput, editorUi.editor.diagramFileTypes);
			typeSelect.style.marginLeft = '6px';
			typeSelect.style.width = '80px';
			div.appendChild(typeSelect);
		}
		
		div.appendChild(FilenameDialog.createTypeHint(editorUi, nameInput, hints));
	}
	
	var copyBtn = null;
	
	// Disables SVG preview if SVG is not supported in browser
	if (data != null && mimeType != null && (mimeType.substring(0, 6) == 'image/' &&
		(mimeType.substring(0, 9) != 'image/svg' || mxClient.IS_SVG)))
	{
		nameInput.style.width = '160px';
		var preview = document.createElement('img');
		var temp = (base64Encoded) ? data : btoa(unescape(encodeURIComponent(data)));
		preview.setAttribute('src', 'data:' + mimeType + ';base64,' + temp);
		preview.style.position = 'absolute';
		preview.style.top = '70px';
		preview.style.right = '100px';
		preview.style.maxWidth = '120px';
		preview.style.maxHeight = '80px';
		mxUtils.setPrefixedStyle(preview.style, 'transform',
			'translate(50%,-50%)');
		div.appendChild(preview);
		
		if (!mxClient.IS_FF && navigator.clipboard != null && mimeType == 'image/png')
		{
			copyBtn = mxUtils.button(mxResources.get('copy'), function(evt)
			{
				var blob = editorUi.base64ToBlob(temp, 'image/png');
				var html = '<img src="' + 'data:' + mimeType + ';base64,' + temp + '">';
				var cbi = new ClipboardItem({'image/png': blob,
					'text/html': new Blob([html], {type: 'text/html'})});
				navigator.clipboard.write([cbi]).then(mxUtils.bind(this, function()
				{
					editorUi.alert(mxResources.get('copiedToClipboard'));
				}))['catch'](mxUtils.bind(this, function(e)
				{
					editorUi.handleError(e);
				}));
			});
			
			copyBtn.style.marginTop = '6px';
			copyBtn.className = 'geBtn';
		}
		
		if (allowTab && Editor.popupsAllowed)
		{
			preview.style.cursor = 'pointer';
			
			mxEvent.addGestureListeners(preview, null, null, function(evt)
			{
				if (!mxEvent.isPopupTrigger(evt))
				{
					create('_blank');
				}
			});
		}
	}
	
	mxUtils.br(div);
	
	var buttons = document.createElement('div');
	buttons.style.textAlign = 'center';
	var count = 0;

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
		button.style.display = 'inline-block';
		button.className = 'geBaseButton';
		button.style.position = 'relative';
		button.style.margin = '4px';
		button.style.padding = '8px 8px 10px 8px';
		button.style.whiteSpace = 'nowrap';
		
		button.appendChild(logo);
		
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
		
		if (++count == rowLimit)
		{
			mxUtils.br(buttons);
			count = 0;
		}
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

		if (editorUi.gitHub != null)
		{
			var gitHubOption = document.createElement('option');
			gitHubOption.setAttribute('value', App.MODE_GITHUB);
			mxUtils.write(gitHubOption, mxResources.get('github'));
			serviceSelect.appendChild(gitHubOption);
			
			addLogo(IMAGE_PATH + '/github-logo.svg', mxResources.get('github'), App.MODE_GITHUB, 'gitHub');
		}
		
		if (editorUi.gitLab != null)
		{
			var gitLabOption = document.createElement('option');
			gitLabOption.setAttribute('value', App.MODE_GITLAB);
			mxUtils.write(gitLabOption, mxResources.get('gitlab'));
			serviceSelect.appendChild(gitLabOption);

			addLogo(IMAGE_PATH + '/gitlab-logo.svg', mxResources.get('gitlab'), App.MODE_GITLAB, 'gitLab');
		}

		if (typeof window.TrelloClient === 'function')
		{
			var trelloOption = document.createElement('option');
			trelloOption.setAttribute('value', App.MODE_TRELLO);
			mxUtils.write(trelloOption, mxResources.get('trello'));
			serviceSelect.appendChild(trelloOption);
			
			addLogo(IMAGE_PATH + '/trello-logo.svg', mxResources.get('trello'), App.MODE_TRELLO, 'trello');
		}
	}
	
	if (!Editor.useLocalStorage || urlParams['storage'] == 'device' ||
		(editorUi.getCurrentFile() != null/* && !mxClient.IS_IOS*/))
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
				else if (newMode == App.MODE_GITHUB)
				{
					ext = editorUi.gitHub.extension;
				}
				else if (newMode == App.MODE_GITLAB)
				{
					ext = editorUi.gitLab.extension;
				}
				else if (newMode == App.MODE_TRELLO)
				{
					ext = editorUi.trello.extension;
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
					ext = '.drawio';
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
	btns.style.textAlign = 'center';
	
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
			editorUi.openLink(helpLink);
		});
		
		helpBtn.className = 'geBtn';
		btns.appendChild(helpBtn);
	}
	
	var cancelBtn = mxUtils.button(mxResources.get((cancelFn != null) ? 'close' : 'cancel'), function()
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
	
	if (editorUi.editor.cancelFirst && cancelFn == null)
	{
		btns.appendChild(cancelBtn);
	}

	function create(mode)
	{
		var title = nameInput.value;
		
		if (mode == null || (title != null && title.length > 0))
		{
			if (hideDialog)
			{
				editorUi.hideDialog();
			}
			
			createFn(title, mode, nameInput);
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

	if (allowTab && Editor.popupsAllowed)
	{
		var openBtn = mxUtils.button(mxResources.get('openInNewWindow'), function()
		{
			create('_blank');
		});
		
		openBtn.className = 'geBtn';
		btns.appendChild(openBtn);
	}

	if (CreateDialog.showDownloadButton)
	{
		var downloadButton = mxUtils.button(mxResources.get('download'), function()
		{
			create('download');
		});
		
		downloadButton.className = 'geBtn';
		btns.appendChild(downloadButton);
		
		if (copyBtn != null)
		{
			downloadButton.style.marginTop = '6px';
			btns.style.marginTop = '6px';
		}
	}
		
	if (copyBtn != null)
	{
		mxUtils.br(btns);
		btns.appendChild(copyBtn);
	}
	
	if (/*!mxClient.IS_IOS || */!showButtons)
	{
		var createBtn = mxUtils.button(btnLabel || mxResources.get('create'), function()
		{
			create((showDeviceButton) ? 'download' : ((showButtons) ? App.MODE_DEVICE : serviceSelect.value));
		});
		
		createBtn.className = 'geBtn gePrimaryBtn';
		btns.appendChild(createBtn);
	}
	
	if (!editorUi.editor.cancelFirst || cancelFn != null)
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
 * 
 */
CreateDialog.showDownloadButton = true;

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
		
		editorUi.openLink(url, null, true);
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
	inner.style.paddingRight = '20px';
	
	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', initialValue);
	linkInput.setAttribute('type', 'text');
	linkInput.setAttribute('spellcheck', 'false');
	linkInput.setAttribute('autocorrect', 'off');
	linkInput.setAttribute('autocomplete', 'off');
	linkInput.setAttribute('autocapitalize', 'off');
	linkInput.style.marginTop = '6px';
	var realWidth = (Graph.fileSupport) ? 460 : 340;
	linkInput.style.width = realWidth - 20 + 'px';
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
	cross.style.display = 'inline-block';
	cross.style.top = '3px';
	
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

	var insertImage = function(newValue, w, h, resize)
	{
		var dataUri = newValue.substring(0, 5) == 'data:';
		
		if (!editorUi.isOffline() || (dataUri && typeof chrome === 'undefined'))
		{
			if (newValue.length > 0 && editorUi.spinner.spin(document.body, mxResources.get('inserting')))
			{
				var maxSize = 520;
				
				editorUi.loadImage(newValue, function(img)
				{
					editorUi.spinner.stop();
					editorUi.hideDialog();
					var s = (resize === false) ? 1 :
						(w != null && h != null) ? Math.max(w / img.width, h / img.height) :
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
				editorUi.hideDialog();
				fn(newValue);
			}
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
	
	var apply = function(newValue, resize)
	{
		if (newValue != null)
		{
			var geo = (ignoreExisting) ? null : graph.getModel().getGeometry(graph.getSelectionCell());

			// Reuses width and height of existing cell
			if (geo != null)
			{
				insertImage(newValue, geo.width, geo.height, resize);
			}
			else
			{
				insertImage(newValue, null, null, resize);
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
			    	editorUi.importFiles(evt.dataTransfer.files, 0, 0, editorUi.maxImageSize, function(data, mimeType, x, y, w, h, fileName, resize)
			    	{
			    		apply(data, resize);
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
			    	}, !mxEvent.isControlDown(evt), null, null, true);
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
	btns.style.marginTop = '14px';
	btns.style.textAlign = 'center';
	
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
		if (editorUi.imgDlgFileInputElt == null)
		{
			var fileInput = document.createElement('input');
			fileInput.setAttribute('multiple', 'multiple');
			fileInput.setAttribute('type', 'file');
			
			mxEvent.addListener(fileInput, 'change', function(evt)
			{
				if (fileInput.files != null)
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
					
		    		// Resets input to force change event for same file (type reset required for IE)
					fileInput.type = '';
					fileInput.type = 'file';
					fileInput.value = '';
				}
			});
			
			fileInput.style.display = 'none';
			document.body.appendChild(fileInput);
			editorUi.imgDlgFileInputElt = fileInput;
		}
		
		var btn = mxUtils.button(mxResources.get('open'), function()
		{
			editorUi.imgDlgFileInputElt.click();
		});

		btn.className = 'geBtn';
		btns.appendChild(btn);
	}

	// Image cropping (experimental)
	if (!!document.createElement('canvas').getContext && linkInput.value.substring(0, 11) == 'data:image/' &&
		linkInput.value.substring(0, 14) != 'data:image/svg')
	{
		var cropBtn = mxUtils.button(mxResources.get('crop'), function()
		{
	    	var dlg = new CropImageDialog(editorUi, linkInput.value, function(image)
	    	{
	    		linkInput.value = image;
	    	});
	    	
	    	editorUi.showDialog(dlg.container, 300, 380, true, true);
			dlg.init();
		});
		
		cropBtn.className = 'geBtn';
		btns.appendChild(cropBtn);
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
 * Overrides link dialog to add Google Picker.
 */
var LinkDialog = function(editorUi, initialValue, btnLabel, fn, showPages, showNewWindowOption, linkTarget)
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
	inner.style.paddingRight = '20px';

	var linkInput = document.createElement('input');
	linkInput.setAttribute('placeholder', mxResources.get('dragUrlsHere'));
	linkInput.setAttribute('type', 'text');
	linkInput.style.marginTop = '6px';
	linkInput.style.width = '100%';
	linkInput.style.boxSizing = 'border-box';
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
	cross.style.display = 'inline-block';
	cross.style.top = '3px';
	
	// Needed to block event transparency in IE
	cross.style.background = 'url(\'' + editorUi.editor.transparentImage + '\')';

	mxEvent.addListener(cross, 'click', function()
	{
		linkInput.value = '';
		linkInput.focus();
	});

	var urlRadio = document.createElement('input');
	urlRadio.style.cssText = 'margin-right:8px;margin-bottom:8px;';
	urlRadio.setAttribute('value', 'url');
	urlRadio.setAttribute('type', 'radio');
	urlRadio.setAttribute('name', 'current-linkdialog');

	var pageRadio = document.createElement('input');
	pageRadio.style.cssText = 'margin-right:8px;margin-bottom:8px;';
	pageRadio.setAttribute('value', 'url');
	pageRadio.setAttribute('type', 'radio');
	pageRadio.setAttribute('name', 'current-linkdialog');

	var pageSelect = document.createElement('select');
	pageSelect.style.width = '100%';

	var newWindowCheckbox = document.createElement('input');
	newWindowCheckbox.setAttribute('type', 'checkbox');

	newWindowCheckbox.style.margin = '0 6p 0 6px';

	if (linkTarget != null)
	{
		newWindowCheckbox.setAttribute('checked', 'checked');
		newWindowCheckbox.defaultChecked = true;
	}
	
	linkTarget = (linkTarget != null) ? linkTarget : '_blank';
	newWindowCheckbox.setAttribute('title', linkTarget);
	
	if (showNewWindowOption)
	{
		linkInput.style.width = '340px';
	}
	
	if (showPages && editorUi.pages != null)
	{
		if (initialValue != null && initialValue.substring(0, 13) == 'data:page/id,')
		{
			pageRadio.setAttribute('checked', 'checked');
			pageRadio.defaultChecked = true;
		}
		else
		{
			linkInput.setAttribute('value', initialValue);
			urlRadio.setAttribute('checked', 'checked');
			urlRadio.defaultChecked = true;
		}
		
		inner.appendChild(urlRadio);
		inner.appendChild(linkInput);
		inner.appendChild(cross);
		
		if (showNewWindowOption)
		{
			inner.appendChild(newWindowCheckbox);
			mxUtils.write(inner, mxResources.get('openInNewWindow'));
		}
		
		mxUtils.br(inner);
		inner.appendChild(pageRadio);
		
		var pageFound = false;
		
		for (var i = 0; i < editorUi.pages.length; i++)
		{
			var pageOption = document.createElement('option');
			mxUtils.write(pageOption, editorUi.pages[i].getName() ||
				mxResources.get('pageWithNumber', [i + 1]));
			pageOption.setAttribute('value', 'data:page/id,' +
				editorUi.pages[i].getId());
			
			if (initialValue == pageOption.getAttribute('value'))
			{
				pageOption.setAttribute('selected', 'selected');
				pageFound = true;
			}

			pageSelect.appendChild(pageOption);
		}

		if (!pageFound && pageRadio.checked)
		{
			var notFoundOption = document.createElement('option');
			mxUtils.write(notFoundOption, mxResources.get('pageNotFound'));
			notFoundOption.setAttribute('disabled', 'disabled');
			notFoundOption.setAttribute('selected', 'selected');
			notFoundOption.setAttribute('value', 'pageNotFound');
			pageSelect.appendChild(notFoundOption);
			
			mxEvent.addListener(pageSelect, 'change', function()
			{
				if (notFoundOption.parentNode != null && !notFoundOption.selected)
				{
					notFoundOption.parentNode.removeChild(notFoundOption);
				}
			});
		}
		
		inner.appendChild(pageSelect);
	}
	else
	{
		linkInput.setAttribute('value', initialValue);
		inner.appendChild(linkInput);
		inner.appendChild(cross);
	}

	div.appendChild(inner);
	
	var mainBtn = mxUtils.button(btnLabel, function()
	{
		editorUi.hideDialog();
		var value = (pageRadio.checked) ? ((pageSelect.value !== 'pageNotFound') ?
			pageSelect.value : initialValue) : linkInput.value;
		fn(value, LinkDialog.selectedDocs, (newWindowCheckbox.checked) ? linkTarget : null);
	});
	mainBtn.style.verticalAlign = 'middle';
	mainBtn.className = 'geBtn gePrimaryBtn';
	
	this.init = function()
	{
		if (pageRadio.checked)
		{
			pageSelect.focus();
		}
		else
		{
			linkInput.focus();
			
			if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
			{
				linkInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
		
		mxEvent.addListener(pageSelect, 'focus', function()
		{
			urlRadio.removeAttribute('checked');
			pageRadio.setAttribute('checked', 'checked');
			pageRadio.checked = true;
		});
		
		mxEvent.addListener(linkInput, 'focus', function()
		{
			pageRadio.removeAttribute('checked');
			urlRadio.setAttribute('checked', 'checked');
			urlRadio.checked = true;
		});

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
			    	urlRadio.setAttribute('checked', 'checked');
			    	urlRadio.checked = true;
			    	mainBtn.click();
			    }

			    evt.stopPropagation();
			    evt.preventDefault();
			}), false);
		}
	};
	
	var btns = document.createElement('div');
	btns.style.marginTop = '20px';
	btns.style.textAlign = 'center';
	
	var helpBtn = mxUtils.button(mxResources.get('help'), function()
	{
		editorUi.openLink('https://www.diagrams.net/doc/faq/custom-links');
	});

	helpBtn.style.verticalAlign = 'middle';
	helpBtn.className = 'geBtn';
	btns.appendChild(helpBtn);

	if (editorUi.isOffline() && !mxClient.IS_CHROMEAPP)
	{
		helpBtn.style.display = 'none';
	}
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.style.verticalAlign = 'middle';
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
        	
    		if (data.docs[0].mimeType == 'application/mxe' || (data.docs[0].mimeType != null &&
    			data.docs[0].mimeType.substring(0, 23) == 'application/vnd.jgraph.'))
    		{
				href = 'https://www.draw.io/#G' + data.docs[0].id;
    		}
    		else if (data.docs[0].mimeType == 'application/vnd.google-apps.folder')
    		{
    			// Do not use folderview in data.docs[0].url link to Google Drive instead
    			href = 'https://drive.google.com/#folders/' + data.docs[0].id;
    		}
    		
    		linkInput.value = href;
    		linkInput.focus();
        }
		else
		{
			LinkDialog.selectedDocs = null;
		}
		
		linkInput.focus();
	};
	
	function addButton(src, tooltip, fn)
	{
		var btn = mxUtils.button('', fn);
		btn.className = 'geBtn';
		btn.setAttribute('title', tooltip);
		var img = document.createElement('img');
		img.style.height = '26px';
		img.style.width = '26px';
		img.setAttribute('src', src);
		btn.style.minWidth = '42px';
		btn.style.verticalAlign = 'middle';
		btn.appendChild(img);
		btns.appendChild(btn);
	};

	if (typeof(google) != 'undefined' && typeof(google.picker) != 'undefined' && editorUi.drive != null)
	{
		addButton(IMAGE_PATH + '/google-drive-logo.svg', mxResources.get('googlePlus'), function()
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('authorizing')))
			{
				editorUi.drive.checkToken(mxUtils.bind(this, function()
				{
					editorUi.spinner.stop();
					
					// Creates one picker and reuses it to avoid polluting the DOM
					if (editorUi.linkPicker == null)
					{
						var picker = editorUi.drive.createLinkPicker();

						editorUi.linkPicker = picker.setCallback(function(data)
						{
							LinkDialog.filePicked(data);
					    }).build();
					}
					
					editorUi.linkPicker.setVisible(true);
				}));
			}
		});
	}
	
	if (typeof(Dropbox) != 'undefined' && typeof(Dropbox.choose) != 'undefined')
	{
		addButton(IMAGE_PATH + '/dropbox-logo.svg', mxResources.get('dropbox'), function()
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
					linkInput.focus();
				}
			});
		});
	}
	
	if (editorUi.oneDrive != null)
	{
		addButton(IMAGE_PATH + '/onedrive-logo.svg', mxResources.get('oneDrive'), function()
		{
			editorUi.oneDrive.pickFile(function(id, files)
			{
				linkInput.value = files.value[0].webUrl;
				linkInput.focus();
			});
		});
	}
	
	if (editorUi.gitHub != null)
	{
		addButton(IMAGE_PATH + '/github-logo.svg', mxResources.get('github'), function()
		{
			editorUi.gitHub.pickFile(function(path)
			{
				if (path != null)
				{
					var tokens = path.split('/');
					var org = tokens[0];
					var repo = tokens[1];
					var ref = tokens[2];
					var path = tokens.slice(3, tokens.length).join('/');
					
					linkInput.value = 'https://github.com/' + org + '/' +
						repo + '/blob/' + ref + '/' + path;
					linkInput.focus();
				}
			});
		});
	}
	
	if (editorUi.gitLab != null)
	{
		addButton(IMAGE_PATH + '/gitlab-logo.svg', mxResources.get('gitlab'), function()
		{
			editorUi.gitLab.pickFile(function(path)
			{
				if (path != null)
				{
					var tokens = path.split('/');
					var org = tokens[0];
					var repo = tokens[1];
					var ref = tokens[2];
					var path = tokens.slice(3, tokens.length).join('/');

					linkInput.value = DRAWIO_GITLAB_URL + '/' + org + '/' +
						repo + '/blob/' + ref + '/' + path;
					linkInput.focus();
				}
			});
		});
	}
	//TODO should Trello support this?
	
	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			editorUi.hideDialog();
			var value = (pageRadio.checked) ? pageSelect.value : linkInput.value;
			fn(value, LinkDialog.selectedDocs);
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
var FeedbackDialog = function(editorUi, subject, emailOptional, diagramData)
{
	var div = document.createElement('div');
	
	var label = document.createElement('div');
	mxUtils.write(label, mxResources.get('sendYourFeedback'));
	label.style.fontSize = '18px';
	label.style.marginBottom = '18px';
	
	div.appendChild(label);
	
	label = document.createElement('div');
	mxUtils.write(label, mxResources.get('yourEmailAddress') +
		((emailOptional) ? '' : ' (' + mxResources.get('required') + ')'));
	
	div.appendChild(label);
	
	var email = document.createElement('input');
	email.setAttribute('type', 'text');
	email.style.marginTop = '6px';
	email.style.width = '600px';
	
	var sendButton = mxUtils.button(mxResources.get('sendMessage'), function()
	{
		var diagram = textarea.value +
			((cb.checked) ? '\nDiagram:\n' + ((diagramData != null) ?
			diagramData : mxUtils.getXml(editorUi.getXmlFileData())) : '') +
			'\nuserAgent:\n' + navigator.userAgent +
			'\nappVersion:\n' + navigator.appVersion +
			'\nappName:\n' + navigator.appName +
			'\nplatform:\n' + navigator.platform;
		
		if (diagram.length > FeedbackDialog.maxAttachmentSize)
		{
			editorUi.alert(mxResources.get('drawingTooLarge'));
		}
		else
		{
			editorUi.hideDialog();
			
			if (editorUi.spinner.spin(document.body))
			{
				var postUrl = (FeedbackDialog.feedbackUrl != null) ? FeedbackDialog.feedbackUrl : '/email';
				mxUtils.post(postUrl, 'email=' + encodeURIComponent(email.value) +
						'&version=' + encodeURIComponent(EditorUi.VERSION) +
						'&url=' + encodeURIComponent(window.location.href) +
						'&body=' + encodeURIComponent(((subject != null) ?
							subject : 'Feedback') + ':\n' + diagram),
					function(req)
					{
						editorUi.spinner.stop();
					
						if (req.getStatus() >= 200 && req.getStatus() <= 299)
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
	
	if (!emailOptional)
	{
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
	}
		
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
	
	textarea.setAttribute('placeholder', mxResources.get('comments'));
	
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
var RevisionDialog = function(editorUi, revs, restoreFn)
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

	// Contains possible error messages
	var errorNode = document.createElement('div');
	errorNode.style.cssText = 'position:absolute;left:0;right:0;top:0;bottom:20px;text-align:center;transform:translate(0,50%);pointer-events:none;';
	container.appendChild(errorNode);
	
	mxEvent.disableContextMenu(container);
	div.appendChild(container);

	var graph = new Graph(container);
	graph.setTooltips(false);
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
		else if (name == 'pagecount')
		{
			return (diagrams != null) ? diagrams.length : 1;
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
	  color: Editor.isDarkMode() ? '#c0c0c0' : '#000', // #rgb or #rrggbb
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
	var fileNode = editorUi.getXmlFileData(true, false, true);
	var tmp = fileNode.getElementsByTagName('diagram');
	var currentDiagrams = {};
	
	for (var i = 0; i < tmp.length; i++)
	{
		currentDiagrams[tmp[i].getAttribute('id')] = tmp[i];
	}

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

	// Gesture listener added below to handle pressed state
	var compareBtn = mxUtils.button('', function() { });
	compareBtn.className = 'geSprite geSprite-middle';
	compareBtn.setAttribute('title', mxResources.get('compare'));
	compareBtn.style.outline = 'none';
	compareBtn.style.border = 'none';
	compareBtn.style.margin = '2px';
	mxUtils.setOpacity(compareBtn, 60);
	
	var cmpContainer = container.cloneNode(false);
	cmpContainer.style.pointerEvent = 'none';
	container.parentNode.appendChild(cmpContainer);

	var cmpGraph = new Graph(cmpContainer);
	cmpGraph.setTooltips(false);
	cmpGraph.setEnabled(false);
	cmpGraph.setPanning(true);
	cmpGraph.panningHandler.ignoreCell = true;
	cmpGraph.panningHandler.useLeftButtonForPanning = true;
	cmpGraph.minFitScale = null;
	cmpGraph.maxFitScale = null;
	cmpGraph.centerZoom = true;

	mxEvent.addGestureListeners(compareBtn, function(e)
	{
		// Gets current state of page with given ID
		var curr = currentDiagrams[diagrams[currentPage].getAttribute('id')];
		mxUtils.setOpacity(compareBtn, 20);
		errorNode.innerHTML = '';

		if (curr == null)
		{
			mxUtils.write(errorNode, mxResources.get('pageNotFound'));
		}
		else
		{
			fileInfo.style.display = 'none';
			container.style.display = 'none';
			cmpContainer.style.display = '';
			cmpContainer.style.backgroundColor = container.style.backgroundColor;

			var tempNode = Editor.parseDiagramNode(curr);
			var codec = new mxCodec(tempNode.ownerDocument);
			codec.decode(tempNode, cmpGraph.getModel());
			cmpGraph.view.scaleAndTranslate(graph.view.scale,
				graph.view.translate.x, graph.view.translate.y);
		}
	}, null, function()
	{
		mxUtils.setOpacity(compareBtn, 60);
		errorNode.innerHTML = '';

		if (container.style.display == 'none')
		{
			fileInfo.style.display = '';
			container.style.display = '';
			cmpContainer.style.display = 'none';
		}
	});

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
    		var data = mxUtils.getXml(currentDoc.documentElement);
			var filename = editorUi.getBaseFilename() + '.drawio';
    		
	    	if (editorUi.isLocalFileSave())
	    	{
	    		editorUi.saveLocalFile(data, filename, 'text/xml');
	    	}
	    	else
	    	{
	    		var param = (typeof(pako) === 'undefined') ? '&xml=' + encodeURIComponent(data) :
	    			'&data=' + encodeURIComponent(Graph.compress(data));
	    		new mxXmlRequest(SAVE_URL, 'filename=' + encodeURIComponent(filename) +
	    			'&format=xml' + param).simulate(document, '_blank');
	    	}
		}
	});
	downloadBtn.className = 'geBtn';
	downloadBtn.setAttribute('disabled', 'disabled');

	var restoreBtn = mxUtils.button(mxResources.get('restore'), function(e)
	{
		if (currentDoc != null && currentXml != null)
		{
			if (mxEvent.isShiftDown(e))
			{
				if (currentDoc != null)
				{
					var pages = editorUi.getPagesForNode(currentDoc.documentElement);
					var patch = editorUi.diffPages(editorUi.pages, pages);
	
					var dlg = new TextareaDialog(editorUi, mxResources.get('compare'),
						JSON.stringify(patch, null, 2), function(newValue)
					{
						if (newValue.length > 0)
						{
							try
							{
								// TODO: Make add/remove pages undoable
								editorUi.confirm(mxResources.get('areYouSure'), function()
								{
									file.patch([JSON.parse(newValue)], null, true);

									// Hides compare dialog
									editorUi.hideDialog();

									// Hides revision history dialog
									editorUi.hideDialog();
								});
							}
							catch (e)
							{
								editorUi.handleError(e);
							}
						}
					}, null, null, null, null, null, true, null, mxResources.get('merge'));
					
					dlg.textarea.style.width = '600px';
					dlg.textarea.style.height = '380px';
					editorUi.showDialog(dlg.container, 620, 460, true, true);
					dlg.init();
				}
			}
			else
			{
				editorUi.confirm(mxResources.get('areYouSure'), function()
				{
					if (restoreFn != null)
					{
						restoreFn(currentXml);
					}
					else
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
					}
				});
			}
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
	
	var newBtn = mxUtils.button(mxResources.get('edit'), function()
	{
		if (currentDoc != null)
		{
			window.openFile = new OpenFile(function()
			{
				window.openFile = null;
			});
			
			window.openFile.setData(mxUtils.getXml(currentDoc.documentElement));
			editorUi.openLink(editorUi.getUrl(), null, true);
		}
	});
	newBtn.className = 'geBtn';
	newBtn.setAttribute('disabled', 'disabled');
	
	if (restoreFn != null)
	{
		newBtn.style.display = 'none';
	}
	
	var showBtn = mxUtils.button(mxResources.get('show'), function()
	{
		if (currentRev != null)
		{
			editorUi.openLink(currentRev.getUrl(pageSelect.selectedIndex));
		}
	});
	showBtn.className = 'geBtn gePrimaryBtn';
	showBtn.setAttribute('disabled', 'disabled');
	
	if (restoreFn != null)
	{
		showBtn.style.display = 'none';
		restoreBtn.className = 'geBtn gePrimaryBtn';
	}

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
						ts.toLocaleTimeString() + 
						((item.fileSize != null)? ' ' + editorUi.formatFileSize(parseInt(item.fileSize)) : '') +
						((item.lastModifyingUserName != null) ? ' ' + item.lastModifyingUserName : ''));

					function updateGraph(xml)
					{
						spinner.stop();
						errorNode.innerHTML = '';
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
									bg = graph.defaultPageBackgroundColor;
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
									diagramNode = parseGraphModel(Editor.parseDiagramNode(diagramNode));
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
									try
									{
										var temp = parseInt(pageSelect.value);
										currentPage = temp;
										realPage = currentPage;
										parseDiagram(diagrams[temp]);
									}
									catch (e)
									{
										pageSelect.value = currentPage;
										editorUi.handleError(e);
									}
								};
							}
							else
							{
								parseGraphModel(node);
							}
							
							var shortUser = item.lastModifyingUserName;
							
							if (shortUser != null && shortUser.length > 20)
							{
								shortUser = shortUser.substring(0, 20) + '...';
							}
							
							fileInfo.innerHTML = '';
							mxUtils.write(fileInfo, ((shortUser != null) ?
								(shortUser + ' ') : '') + ts.toLocaleDateString() +
								' ' + ts.toLocaleTimeString());
							
							fileInfo.setAttribute('title', row.getAttribute('title'));
							zoomInBtn.removeAttribute('disabled');
							zoomOutBtn.removeAttribute('disabled');
							zoomFitBtn.removeAttribute('disabled');
							zoomActualBtn.removeAttribute('disabled');
							compareBtn.removeAttribute('disabled');
							
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
							mxUtils.setOpacity(compareBtn, 60);
						}
						else
						{
							pageSelect.style.display = 'none';
							pageSelect.innerHTML = '';
							fileInfo.innerHTML = '';
							mxUtils.write(fileInfo, mxResources.get('errorLoadingFile'));
							mxUtils.write(errorNode, mxResources.get('errorLoadingFile'));
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
							currentRow.style.backgroundColor = Editor.isDarkMode() ? '#000000' : '#ebf2f9';
							currentDoc = null;
							currentXml = null;

							fileInfo.removeAttribute('title');
							fileInfo.innerHTML = mxUtils.htmlEntities(mxResources.get('loading') + '...');
							container.style.backgroundColor = graph.defaultPageBackgroundColor;
							errorNode.innerHTML = '';
							graph.getModel().clear();
	
							restoreBtn.setAttribute('disabled', 'disabled');
							downloadBtn.setAttribute('disabled', 'disabled');
							zoomInBtn.setAttribute('disabled', 'disabled');
							zoomOutBtn.setAttribute('disabled', 'disabled');
							zoomActualBtn.setAttribute('disabled', 'disabled');
							zoomFitBtn.setAttribute('disabled', 'disabled');
							compareBtn.setAttribute('disabled', 'disabled');

							newBtn.setAttribute('disabled', 'disabled');
							showBtn.setAttribute('disabled', 'disabled');
							pageSelect.setAttribute('disabled', 'disabled');
							
							mxUtils.setOpacity(zoomInBtn, 20);
							mxUtils.setOpacity(zoomOutBtn, 20);
							mxUtils.setOpacity(zoomFitBtn, 20);
							mxUtils.setOpacity(zoomActualBtn, 20);
							mxUtils.setOpacity(compareBtn, 20);

							spinner.spin(container);
							
							item.getXml(function(xml)
				   			{
								if (currentRev == item)
								{
									try
									{
										updateGraph(xml);
									}
									catch (e)
									{
										fileInfo.innerHTML = mxUtils.htmlEntities(
											mxResources.get('error') + ': ' + e.message);
									}
								}
				   			}, function(err)
				   			{
				   				spinner.stop();
								pageSelect.style.display = 'none';
								pageSelect.innerHTML = '';
				   				fileInfo.innerHTML = '';
								mxUtils.write(fileInfo, mxResources.get('errorLoadingFile'));
								mxUtils.write(errorNode, mxResources.get('errorLoadingFile'));
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
	else if (file == null || (editorUi.drive == null && file.constructor == window.DriveFile) ||
		(editorUi.dropbox == null && file.constructor == window.DropboxFile))
	{
		container.style.display = 'none';
		tb.style.display = 'none';
		mxUtils.write(list, mxResources.get('notAvailable'));
	}
	else
	{
		container.style.display = 'none';
		tb.style.display = 'none';
		mxUtils.write(list, mxResources.get('noRevisions'));
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
	tb.appendChild(compareBtn);

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
var DraftDialog = function(editorUi, title, xml, editFn, discardFn, editLabel, discardLabel, ignoreFn, drafts)
{
	var div = document.createElement('div');
	
	var titleDiv = document.createElement('div');
	titleDiv.style.marginTop = '0px';
	titleDiv.style.whiteSpace = 'nowrap';
	titleDiv.style.overflow = 'auto';
	titleDiv.style.lineHeight = 'normal';
	mxUtils.write(titleDiv, title);
	div.appendChild(titleDiv);
	
	var select = document.createElement('select');
	
	var draftSelected = mxUtils.bind(this, function()
	{
		doc = mxUtils.parseXml(drafts[select.value].data);
		node = editorUi.editor.extractGraphModel(doc.documentElement, true);
		currentPage = 0;
			
		this.init();
	});
	
	if (drafts != null)
	{
		select.style.marginLeft = '4px';
		
		for (var i = 0; i < drafts.length; i++)
		{
			var opt = document.createElement('option');
			opt.setAttribute('value', i);
			var ts0 = new Date(drafts[i].created);
			var ts1 = new Date(drafts[i].modified);
			
			mxUtils.write(opt, ts0.toLocaleDateString() + ' ' +
				ts0.toLocaleTimeString() + ' - ' +
				((ts0.toDateString() != ts1.toDateString() || true) ?
				ts1.toLocaleDateString() : ' ') +
				' ' + ts1.toLocaleTimeString());
			
			select.appendChild(opt);
		}
		
		titleDiv.appendChild(select);
		
		mxEvent.addListener(select, 'change', draftSelected);
	}
	
	if (xml == null)
	{
		xml = drafts[0].data;
	}
	
	var container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.border = '1px solid lightGray';
	container.style.marginTop = '10px';
	container.style.left = '40px';
	container.style.right = '40px';
	container.style.top = '46px';
	container.style.bottom = '74px';
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
		else if (name == 'pagecount')
		{
			return (diagrams != null) ? diagrams.length : 1;
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

	var restoreBtn = mxUtils.button(discardLabel || mxResources.get('discard'), function()
	{
		discardFn.apply(this, [select.value, mxUtils.bind(this, function()
		{
			if (select.parentNode != null)
			{
				select.options[select.selectedIndex].parentNode.removeChild(select.options[select.selectedIndex]);
				
				if (select.options.length > 0)
				{
					select.value = select.options[0].value;
					draftSelected();
				}
				else
				{
					editorUi.hideDialog(true);
				}
			}
		})]);
	});
	restoreBtn.className = 'geBtn';
	
	var pageSelect = document.createElement('select');
	pageSelect.style.maxWidth = '80px';
	pageSelect.style.position = 'relative';
	pageSelect.style.top = '-2px';
	pageSelect.style.verticalAlign = 'bottom';
	pageSelect.style.marginRight = '6px';
	pageSelect.style.display = 'none';

	var showBtn = mxUtils.button(editLabel || mxResources.get('edit'), function()
	{
		editFn.apply(this, [select.value])
	});
	showBtn.className = 'geBtn gePrimaryBtn';

	var buttons = document.createElement('div');
	buttons.style.position = 'absolute';
	buttons.style.bottom = '30px';
	buttons.style.right = '40px';
	buttons.style.textAlign = 'right';

	var tb = document.createElement('div');
	tb.className = 'geToolbarContainer';
	tb.style.cssText = 'box-shadow:none !important;background-color:transparent;' +
		'padding:2px;border-style:none !important;bottom:30px;';

	this.init = function()
	{
		function parseGraphModel(dataNode)
		{
			if (dataNode != null)
			{
				var bg = dataNode.getAttribute('background');
				
				if (bg == null || bg == '' || bg == mxConstants.NONE)
				{
					bg = Editor.isDarkMode() ? 'transparent' : '#ffffff';
				}
				
				container.style.backgroundColor = bg;
				
				var codec = new mxCodec(dataNode.ownerDocument);
				codec.decode(dataNode, graph.getModel());
				graph.maxFitScale = 1;
				graph.fit(8);
				graph.center();
			}
			
			return dataNode;
		};
			
		function parseDiagram(diagramNode)
		{
			if (diagramNode != null)
			{
				diagramNode = parseGraphModel(Editor.parseDiagramNode(diagramNode));
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

			pageSelect.innerHTML = '';
			
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
			else
			{
				pageSelect.style.display = 'none';
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
	
	var ignoreBtn = (ignoreFn != null) ? mxUtils.button(mxResources.get('ignore'), ignoreFn) : null;
	
	if (ignoreBtn != null)
	{
		ignoreBtn.className = 'geBtn';
	}

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		
		if (ignoreBtn != null)
		{
			buttons.appendChild(ignoreBtn);
		}
		
		buttons.appendChild(restoreBtn);
		buttons.appendChild(showBtn);
	}
	else
	{
		buttons.appendChild(showBtn);
		buttons.appendChild(restoreBtn);
		
		if (ignoreBtn != null)
		{
			buttons.appendChild(ignoreBtn);
		}
		
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	div.appendChild(tb);

	this.container = div;
};

/**
 * 
 */
var FindWindow = function(ui, x, y, w, h, withReplace)
{
	var action = ui.actions.get('findReplace');
	
	var graph = ui.editor.graph;
	var lastSearch = null;
	var lastFound = null;
	var lastSearchSuccessful = false;
	var allChecked = false;
	var lblMatch = null;
	var lblMatchPos = 0;
	var marker = 1;
	
	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.padding = '10px';
	div.style.height = '100%';
	
	var txtWidth = withReplace? '260px' : '200px';
	var searchInput = document.createElement('input');
	searchInput.setAttribute('placeholder', mxResources.get('find'));
	searchInput.setAttribute('type', 'text');
	searchInput.style.marginTop = '4px';
	searchInput.style.marginBottom = '6px';
	searchInput.style.width = txtWidth;
	searchInput.style.fontSize = '12px';
	searchInput.style.borderRadius = '4px';
	searchInput.style.padding = '6px';
	div.appendChild(searchInput);
	mxUtils.br(div);
	
	var replaceInput;
	
	if (withReplace)
	{
		replaceInput = document.createElement('input');
		replaceInput.setAttribute('placeholder', mxResources.get('replaceWith'));
		replaceInput.setAttribute('type', 'text');
		replaceInput.style.marginTop = '4px';
		replaceInput.style.marginBottom = '6px';
		replaceInput.style.width = txtWidth;
		replaceInput.style.fontSize = '12px';
		replaceInput.style.borderRadius = '4px';
		replaceInput.style.padding = '6px';
		div.appendChild(replaceInput);
		mxUtils.br(div);
		
		mxEvent.addListener(replaceInput, 'input', updateReplBtns);
	}
	
	var regexInput = document.createElement('input');
	regexInput.setAttribute('id', 'geFindWinRegExChck');
	regexInput.setAttribute('type', 'checkbox');
	regexInput.style.marginRight = '4px';
	div.appendChild(regexInput);
	
	var regexLabel = document.createElement('label');
	regexLabel.setAttribute('for', 'geFindWinRegExChck');
	div.appendChild(regexLabel);
	mxUtils.write(regexLabel, mxResources.get('regularExpression'));
	div.appendChild(regexLabel);
	
    var help = ui.menus.createHelpLink('https://www.diagrams.net/doc/faq/find-shapes');
    help.style.position = 'relative';
    help.style.marginLeft = '6px';
    help.style.top = '-1px';
    div.appendChild(help);
    
	mxUtils.br(div);

    var allPagesInput = document.createElement('input');
    allPagesInput.setAttribute('id', 'geFindWinAllPagesChck');
    allPagesInput.setAttribute('type', 'checkbox');
    allPagesInput.style.marginRight = '4px';
	div.appendChild(allPagesInput);
	
	var allPagesLabel = document.createElement('label');
	allPagesLabel.setAttribute('for', 'geFindWinAllPagesChck');
	div.appendChild(allPagesLabel);
	mxUtils.write(allPagesLabel, mxResources.get('allPages'));
	div.appendChild(allPagesLabel);
    
	var tmp = document.createElement('div');
	
	function testMeta(re, cell, search, checkIndex)
	{
		if (typeof cell.value === 'object' && cell.value.attributes != null)
		{
			var attrs = cell.value.attributes;
			
			for (var i = 0; i < attrs.length; i++)
			{
				if (attrs[i].nodeName != 'label')
				{
					var value = mxUtils.trim(attrs[i].nodeValue.replace(/[\x00-\x1F\x7F-\x9F]|\s+/g, ' ')).toLowerCase();
					
					if ((re == null && ((checkIndex && value.indexOf(search) >= 0) ||
						(!checkIndex && value.substring(0, search.length) === search))) ||
						(re != null && re.test(value)))
					{
						return true;
					}
				}
			}
		}
		
		return false;
	};
	
	function updateReplBtns()
	{
		if (lastSearchSuccessful && replaceInput.value)
		{
			replaceFindBtn.removeAttribute('disabled');
			replaceBtn.removeAttribute('disabled');
		}
		else
		{
			replaceFindBtn.setAttribute('disabled', 'disabled');
			replaceBtn.setAttribute('disabled', 'disabled');
		}
		
		if (replaceInput.value && searchInput.value)
		{
			replaceAllBtn.removeAttribute('disabled');
		}
		else
		{
			replaceAllBtn.setAttribute('disabled', 'disabled');
		}
	}
				
	function search(internalCall, trySameCell, stayOnPage)
	{
		replAllNotif.innerHTML = '';
		var cells = graph.model.getDescendants(graph.model.getRoot());
		var searchStr = searchInput.value.toLowerCase();
		var re = (regexInput.checked) ? new RegExp(searchStr) : null;
		var firstMatch = null;
		lblMatch = null;
		
		if (lastSearch != searchStr)
		{
			lastSearch = searchStr;
			lastFound = null;
			allChecked = false;
		}

		var active = lastFound == null;
		
		if (searchStr.length > 0)
		{
			if (allChecked)
			{
				allChecked = false;
				
				//Find current page index
				var currentPageIndex;
				
				for (var i = 0; i < ui.pages.length; i++)
				{
					if (ui.currentPage == ui.pages[i])
					{
						currentPageIndex = i;
						break;
					}
				}
				
				var nextPageIndex = (currentPageIndex + 1) % ui.pages.length, nextPage;
				lastFound = null;
				
				do
				{
					allChecked = false;
					nextPage = ui.pages[nextPageIndex];
					graph = ui.createTemporaryGraph(graph.getStylesheet());
					ui.updatePageRoot(nextPage);
					graph.model.setRoot(nextPage.root);
					nextPageIndex = (nextPageIndex + 1) % ui.pages.length;
				}
				while(!search(true, trySameCell, stayOnPage) && nextPageIndex != currentPageIndex);
				
				if (lastFound)
				{
					lastFound = null;
					
					if (!stayOnPage)
					{
						ui.selectPage(nextPage);
					}
					else
					{
						ui.editor.graph.model.execute(new SelectPage(ui, nextPage));
					}
				}
				
				allChecked = false;
				graph = ui.editor.graph;
				
				return search(true, trySameCell, stayOnPage);
			}
			
			var i;
			
			for (i = 0; i < cells.length; i++)
			{
				var state = graph.view.getState(cells[i]);
				
				//Try the same cell with replace to find other occurances
				if (trySameCell && re != null)
				{
					active = active || state == lastFound;
				}
							
				if (state != null && state.cell.value != null && (active || firstMatch == null) &&
					(graph.model.isVertex(state.cell) || graph.model.isEdge(state.cell)))
				{
					if (state.style != null && state.style['html'] == '1')
					{
						tmp.innerHTML = graph.sanitizeHtml(graph.getLabel(state.cell));
						label = mxUtils.extractTextWithWhitespace([tmp]);
					}
					else
					{
						label = graph.getLabel(state.cell);
					}
		
					label = mxUtils.trim(label.replace(/[\x00-\x1F\x7F-\x9F]|\s+/g, ' ')).toLowerCase();
					var lblPosShift = 0;
					
					if (trySameCell && withReplace && re != null && state == lastFound)
					{
						label = label.substr(lblMatchPos);
						lblPosShift = lblMatchPos;
					}
					
					var checkMeta = replaceInput.value == '';
					var checkIndex = checkMeta;
					
					if ((re == null && ((checkIndex && label.indexOf(searchStr) >= 0) ||
						(!checkIndex && label.substring(0, searchStr.length) === searchStr) ||
						(checkMeta && testMeta(re, state.cell, searchStr, checkIndex)))) ||
						(re != null && (re.test(label) || (checkMeta &&
						testMeta(re, state.cell, searchStr, checkIndex)))))
					{
						if (withReplace)
						{
							if (re != null)
							{
								var result = label.match(re);
								lblMatch = result[0].toLowerCase();
								lblMatchPos = lblPosShift + result.index + lblMatch.length;
							}
							else
							{
								lblMatch = searchStr;
								lblMatchPos = lblMatch.length;
							} 	
						}
						
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
			if (i == cells.length && allPagesInput.checked)
			{
				lastFound = null;
				allChecked = true;
				return search(true, trySameCell, stayOnPage);
			}
			
			lastFound = firstMatch;
			graph.scrollCellToVisible(lastFound.cell);
			
			if (graph.isEnabled())
			{
				if (!stayOnPage &&
					(graph.getSelectionCell() != lastFound.cell ||
					graph.getSelectionCount() != 1))
				{
					graph.setSelectionCell(lastFound.cell);
				}
			}
			else
			{
				graph.highlightCell(lastFound.cell);
			}
		}
		//Check other pages
		else if (!internalCall && allPagesInput.checked)
		{
			allChecked = true;
			return search(true, trySameCell, stayOnPage);
		}
		else if (graph.isEnabled() && !stayOnPage)
		{
			graph.clearSelection();
		}
		
		lastSearchSuccessful = firstMatch != null;
		
		if (withReplace && !internalCall)
		{
			updateReplBtns();
		}
		
		return searchStr.length == 0 || firstMatch != null;
	};

	mxUtils.br(div);
	
	var btnsCont = document.createElement('div');
	btnsCont.style.left = '0px';
	btnsCont.style.right = '0px';
	btnsCont.style.marginTop = '6px';
	btnsCont.style.padding = '0 6px 0 6px';
	btnsCont.style.textAlign = 'center';
	div.appendChild(btnsCont);

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		replAllNotif.innerHTML = '';
		searchInput.value = '';
		searchInput.style.backgroundColor = '';
		
		if (withReplace)
		{
			replaceInput.value = '';
			updateReplBtns();
		}
		
		lastFound = null;
		lastSearch = null;
		allChecked = false;
		searchInput.focus();
	});
	
	resetBtn.setAttribute('title', mxResources.get('reset'));
	resetBtn.style.float = 'none';
	resetBtn.style.width = '120px';
	resetBtn.style.marginTop = '6px';
	resetBtn.style.marginLeft = '8px';
	resetBtn.style.overflow = 'hidden';
	resetBtn.style.textOverflow = 'ellipsis';
	resetBtn.className = 'geBtn';
	
	if (!withReplace)
	{
		btnsCont.appendChild(resetBtn);		
	}

	var btn = mxUtils.button(mxResources.get('find'), function()
	{
		try
		{
			searchInput.style.backgroundColor = search() ? '' :
				(Editor.isDarkMode() ? '#ff0000' : '#ffcfcf');
		}
		catch (e)
		{
			ui.handleError(e);	
		}
	});
	
	// TODO: Reset state after selection change
	btn.setAttribute('title', mxResources.get('find') + ' (Enter)');
	btn.style.float = 'none';
	btn.style.width = '120px';
	btn.style.marginTop = '6px';
	btn.style.marginLeft = '8px';
	btn.style.overflow = 'hidden';
	btn.style.textOverflow = 'ellipsis';
	btn.className = 'geBtn gePrimaryBtn';
	
	btnsCont.appendChild(btn);

	var replAllNotif = document.createElement('div');
	replAllNotif.style.marginTop = '10px';
	
	if (!withReplace)
	{
		resetBtn.style.width = '90px';	
		btn.style.width = '90px';
	}
	else
	{
		function replaceInLabel(str, substr, newSubstr, startIndex, style)
		{
			if (style == null || style['html'] != '1')
			{
				var replStart = str.toLowerCase().indexOf(substr, startIndex);
				return replStart < 0? str : str.substr(0, replStart) + newSubstr + str.substr(replStart + substr.length);
			}
			
			var origStr = str;
			substr = mxUtils.htmlEntities(substr);
			var tagPos = [], p = -1;
			
			while((p = str.indexOf('<', p + 1)) > -1)
			{
				tagPos.push(p);
			}
			
			var tags = str.match(/<[^>]*>/g);
			str = str.replace(/<[^>]*>/g, '');
			var lStr = str.toLowerCase();
			var replStart = lStr.indexOf(substr, startIndex);
			
			if (replStart < 0)
			{
				return origStr;	
			}
			
			var replEnd = replStart + substr.length;
			var newSubstr = mxUtils.htmlEntities(newSubstr);
			
			//Tags within the replaced text is added before it
			var newStr = str.substr(0, replStart) + newSubstr + str.substr(replEnd);
			var tagDiff = 0;
			
			for (var i = 0; i < tagPos.length; i++)
			{
				if (tagPos[i] - tagDiff < replStart)
				{
					newStr = newStr.substr(0, tagPos[i]) + tags[i] + newStr.substr(tagPos[i]);
				}
				else if (tagPos[i] - tagDiff < replEnd)
				{
					var inPos = replStart + tagDiff;
					newStr = newStr.substr(0, inPos) + tags[i] + newStr.substr(inPos);
				}
				else
				{
					var inPos = tagPos[i] + (newSubstr.length - substr.length);
					newStr = newStr.substr(0, inPos) + tags[i] + newStr.substr(inPos);
				}
				
				tagDiff += tags[i].length;
			}
			
			return newStr;
		};
		
		var replaceFindBtn = mxUtils.button(mxResources.get('replFind'), function()
		{
			try
			{
				if (lblMatch != null && lastFound != null && replaceInput.value)
				{
					var cell = lastFound.cell, lbl = graph.getLabel(cell);
					
					graph.model.setValue(cell, replaceInLabel(lbl, lblMatch, replaceInput.value, lblMatchPos - lblMatch.length, graph.getCurrentCellStyle(cell)));
					searchInput.style.backgroundColor = search(false, true) ? '' :
						(Editor.isDarkMode() ? '#ff0000' : '#ffcfcf');
				}
			}
			catch (e)
			{
				ui.handleError(e);
			}
		});
		
		replaceFindBtn.setAttribute('title', mxResources.get('replFind'));
		replaceFindBtn.style.float = 'none';
		replaceFindBtn.style.width = '120px';
		replaceFindBtn.style.marginTop = '6px';
		replaceFindBtn.style.marginLeft = '8px';
		replaceFindBtn.style.overflow = 'hidden';
		replaceFindBtn.style.textOverflow = 'ellipsis';
		replaceFindBtn.className = 'geBtn gePrimaryBtn';
		replaceFindBtn.setAttribute('disabled', 'disabled');
		
		btnsCont.appendChild(replaceFindBtn);
		mxUtils.br(btnsCont);
		
		var replaceBtn = mxUtils.button(mxResources.get('replace'), function()
		{
			try
			{
				if (lblMatch != null && lastFound != null && replaceInput.value)
				{
					var cell = lastFound.cell, lbl = graph.getLabel(cell);
					
					graph.model.setValue(cell, replaceInLabel(lbl, lblMatch, replaceInput.value, lblMatchPos - lblMatch.length, graph.getCurrentCellStyle(cell)));
					replaceFindBtn.setAttribute('disabled', 'disabled');
					replaceBtn.setAttribute('disabled', 'disabled');
				}
			}
			catch (e)
			{
				ui.handleError(e);	
			}
		});
		
		replaceBtn.setAttribute('title', mxResources.get('replace'));
		replaceBtn.style.float = 'none';
		replaceBtn.style.width = '120px';
		replaceBtn.style.marginTop = '6px';
		replaceBtn.style.marginLeft = '8px';
		replaceBtn.style.overflow = 'hidden';
		replaceBtn.style.textOverflow = 'ellipsis';
		replaceBtn.className = 'geBtn gePrimaryBtn';
		replaceBtn.setAttribute('disabled', 'disabled');
		
		btnsCont.appendChild(replaceBtn);
		
		var replaceAllBtn = mxUtils.button(mxResources.get('replaceAll'), function()
		{
			replAllNotif.innerHTML = '';
			
			if (replaceInput.value)
			{
				var currentPage = ui.currentPage;
				var cells = ui.editor.graph.getSelectionCells();
				ui.editor.graph.rendering = false;
				
				graph.getModel().beginUpdate();
				try
				{
					var safeguard = 0;
					var seen = {};
					
					while (search(false, true, true) && safeguard < 100)
					{
						var cell = lastFound.cell, lbl = graph.getLabel(cell);
						var oldSeen = seen[cell.id];
						
						if (oldSeen && oldSeen.replAllMrk == marker && oldSeen.replAllPos >= lblMatchPos)
						{
							break;
						}
						
						seen[cell.id] = {replAllMrk: marker, replAllPos: lblMatchPos};
						
						graph.model.setValue(cell, replaceInLabel(lbl, lblMatch, replaceInput.value, lblMatchPos - lblMatch.length, graph.getCurrentCellStyle(cell)));
						safeguard++;
					}
					
					if (currentPage != ui.currentPage)
					{
						ui.editor.graph.model.execute(new SelectPage(ui, currentPage));
					}
					
					mxUtils.write(replAllNotif, mxResources.get('matchesRepl', [safeguard]));
				}
				catch (e)
				{
					ui.handleError(e);
				}
				finally
				{
					graph.getModel().endUpdate();
					ui.editor.graph.setSelectionCells(cells);
					ui.editor.graph.rendering = true;
				}
				
				marker++;
			}
		});
		
		replaceAllBtn.setAttribute('title', mxResources.get('replaceAll'));
		replaceAllBtn.style.float = 'none';
		replaceAllBtn.style.width = '120px';
		replaceAllBtn.style.marginTop = '6px';
		replaceAllBtn.style.marginLeft = '8px';
		replaceAllBtn.style.overflow = 'hidden';
		replaceAllBtn.style.textOverflow = 'ellipsis';
		replaceAllBtn.className = 'geBtn gePrimaryBtn';
		replaceAllBtn.setAttribute('disabled', 'disabled');
		
		btnsCont.appendChild(replaceAllBtn);
		mxUtils.br(btnsCont);
		btnsCont.appendChild(resetBtn);		

		var closeBtn = mxUtils.button(mxResources.get('close'), mxUtils.bind(this, function()
		{
			this.window.setVisible(false);
		}));
		
		closeBtn.setAttribute('title', mxResources.get('close'));
		closeBtn.style.float = 'none';
		closeBtn.style.width = '120px';
		closeBtn.style.marginTop = '6px';
		closeBtn.style.marginLeft = '8px';
		closeBtn.style.overflow = 'hidden';
		closeBtn.style.textOverflow = 'ellipsis';
		closeBtn.className = 'geBtn';
		
		btnsCont.appendChild(closeBtn);
		mxUtils.br(btnsCont);
		btnsCont.appendChild(replAllNotif);
	}
	
	mxEvent.addListener(searchInput, 'keyup', function(evt)
	{
		// Ctrl or Cmd keys
		if (evt.keyCode == 91 || evt.keyCode == 93 || evt.keyCode == 17)
		{
			// Workaround for lost focus on show
			mxEvent.consume(evt);
		}
		else if (evt.keyCode == 27)
		{
			// Escape closes window
			action.funct();
		}
		else if (lastSearch != searchInput.value.toLowerCase() || evt.keyCode == 13)
		{
			try
			{
				searchInput.style.backgroundColor = search() ? '' :
					(Editor.isDarkMode() ? '#ff0000' : '#ffcfcf');
			}
			catch (e)
			{
				searchInput.style.backgroundColor = Editor.isDarkMode() ? '#ff0000' : '#ffcfcf';
			}
		}
	});

	// Ctrl+F closes window
	mxEvent.addListener(div, 'keydown', function(evt)
	{
		if (evt.keyCode == 70 && ui.keyHandler.isControlDown(evt) && !mxEvent.isShiftDown(evt))
		{
			action.funct();
			mxEvent.consume(evt);
		}
	});

	this.window = new mxWindow(mxResources.get('find') + ((withReplace) ?
		'/' + mxResources.get('replace') : ''),
		div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(false);
	this.window.setClosable(true);
	
	this.window.addListener('show', mxUtils.bind(this, function()
	{
		this.window.fit();
		
		if (this.window.isVisible())
		{
			searchInput.focus();
			
			if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
			{
				searchInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
			
			if (ui.pages != null && ui.pages.length > 1)
			{
				allPagesInput.removeAttribute('disabled');
			}
			else
			{
				allPagesInput.checked = false;
				allPagesInput.setAttribute('disabled', 'disabled');
			}
		}
		else
		{
			graph.container.focus();
		}
	}));
	
	this.window.setLocation = function(x, y)
	{
		var iw = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
		var ih = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
		
		x = Math.max(0, Math.min(x, iw - this.table.clientWidth));
		y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48));

		if (this.getX() != x || this.getY() != y)
		{
			mxWindow.prototype.setLocation.apply(this, arguments);
		}
	};
	
	var resizeListener = mxUtils.bind(this, function()
	{
		var x = this.window.getX();
		var y = this.window.getY();
		
		this.window.setLocation(x, y);
	});
	
	mxEvent.addListener(window, 'resize', resizeListener);

	this.destroy = function()
	{
		mxEvent.removeListener(window, 'resize', resizeListener);
		this.window.destroy();
	}
};

/**
 * 
 */
var FreehandWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;
	var propertyName = 'tags';

	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.height = '100%';
	
	var startBtn = mxUtils.button(mxResources.get('startDrawing'), function()
	{
		if (graph.freehand.isDrawing())
		{
			graph.freehand.stopDrawing();
		}
		
		graph.freehand.startDrawing();
	});
	
	startBtn.setAttribute('title', mxResources.get('startDrawing'));
	startBtn.style.marginTop = '8px';
	startBtn.style.marginRight = '4px';
	startBtn.style.width = '160px';
	startBtn.style.overflow = 'hidden';
	startBtn.style.textOverflow = 'ellipsis';
	startBtn.style.textAlign = 'center';
	startBtn.className = 'geBtn gePrimaryBtn';
	
	div.appendChild(startBtn);
	
	var stopBtn = startBtn.cloneNode(false);
	mxUtils.write(stopBtn, mxResources.get('stopDrawing'));
	stopBtn.setAttribute('title', mxResources.get('stopDrawing'));
	stopBtn.style.marginTop = '4px';
	
	mxEvent.addListener(stopBtn, 'click', function()
	{
		graph.freehand.stopDrawing();
	});
	
	div.appendChild(stopBtn);
	
	this.window = new mxWindow(mxResources.get('freehand'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(false);
	this.window.setClosable(true);
	
	graph.addListener('freehandStateChanged', mxUtils.bind(this, function()
	{
		stopBtn.className = 'geBtn' + (graph.freehand.isDrawing() ? ' gePrimaryBtn' : '');
	}));
	
	this.window.addListener('show', mxUtils.bind(this, function()
	{
		this.window.fit();
	}));
	
	this.window.addListener('hide', mxUtils.bind(this, function()
	{
		if (graph.freehand.isDrawing())
		{
			graph.freehand.stopDrawing();
		}
	}));
	
	this.window.setLocation = function(x, y)
	{
		var iw = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
		var ih = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
		
		x = Math.max(0, Math.min(x, iw - this.table.clientWidth));
		y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48));

		if (this.getX() != x || this.getY() != y)
		{
			mxWindow.prototype.setLocation.apply(this, arguments);
		}
	};
	
	var resizeListener = mxUtils.bind(this, function()
	{
		var x = this.window.getX();
		var y = this.window.getY();
		
		this.window.setLocation(x, y);
	});
	
	mxEvent.addListener(window, 'resize', resizeListener);

	this.destroy = function()
	{
		mxEvent.removeListener(window, 'resize', resizeListener);
		this.window.destroy();
	}
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
	searchInput.style.width = '260px';
	searchInput.style.fontSize = '12px';
	searchInput.style.borderRadius = '4px';
	searchInput.style.padding = '6px';
	div.appendChild(searchInput);
	
	if (!editorUi.isOffline() || mxClient.IS_CHROMEAPP)
	{
		searchInput.style.width = '240px';
		var elt = editorUi.menus.createHelpLink('https://www.diagrams.net/doc/faq/tags-plugin');
		elt.firstChild.style.marginBottom = '6px';
		elt.style.marginLeft = '6px';
		div.appendChild(elt);
	}
	
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
		return graph.getCellsForTags(searchInput.value.split(' '), cells, propertyName, true);
	};

	function setCellsVisible(cells, visible)
	{
		graph.setCellsVisible(cells, visible);
	};
	
	mxUtils.br(div);

	var hideBtn = mxUtils.button(mxResources.get('hide'), function()
	{
		setCellsVisible(searchCells(), false);
	});
	
	hideBtn.setAttribute('title', mxResources.get('hide'));
	hideBtn.style.marginTop = '8px';
	hideBtn.style.marginRight = '4px';
	hideBtn.className = 'geBtn';
	
	div.appendChild(hideBtn);

	var showBtn = mxUtils.button(mxResources.get('show'), function()
	{
		var cells = searchCells();
		setCellsVisible(cells, true);
		
		if (graph.isEnabled())
		{
			// Ignores layers for selection
			var temp = [];
			
			for (var i = 0; i < cells.length; i++)
			{
				if (graph.model.isVertex(cells[i]) || graph.model.isEdge(cells[i]))
				{
					temp.push(cells[i]);
				}
			}
			
			graph.setSelectionCells(temp);
		}
		else
		{
			for (var i = 0; i < cells.length; i++)
			{
				graph.highlightCell(cells[i]);
			}
		}
	});
	
	showBtn.setAttribute('title', mxResources.get('show'));
	showBtn.style.marginTop = '8px';
	showBtn.style.marginRight = '4px';
	showBtn.className = 'geBtn';
	
	div.appendChild(showBtn);
	
	var action = editorUi.actions.get('tags');

	var btn = mxUtils.button(mxResources.get('close'), function()
	{
		action.funct();
	});
	
	btn.setAttribute('title', mxResources.get('close') + ' (Enter/Esc)');
	btn.style.marginTop = '8px';
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
		this.window.fit();
		
		if (this.window.isVisible())
		{
			searchInput.focus();
			
			if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
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
	
	this.window.setLocation = function(x, y)
	{
		var iw = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
		var ih = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
		
		x = Math.max(0, Math.min(x, iw - this.table.clientWidth));
		y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48));

		if (this.getX() != x || this.getY() != y)
		{
			mxWindow.prototype.setLocation.apply(this, arguments);
		}
	};
	
	var resizeListener = mxUtils.bind(this, function()
	{
		var x = this.window.getX();
		var y = this.window.getY();
		
		this.window.setLocation(x, y);
	});
	
	mxEvent.addListener(window, 'resize', resizeListener);

	this.destroy = function()
	{
		mxEvent.removeListener(window, 'resize', resizeListener);
		this.window.destroy();
	}
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
	else if (peer == editorUi.gitHub)
	{
		service = mxResources.get('github');
		img.src = IMAGE_PATH + '/github-logo-white.svg';
	}
	else if (peer == editorUi.gitLab)
	{
		service = mxResources.get('gitlab');
		img.src = IMAGE_PATH + '/gitlab-logo.svg';
		img.style.width = '32px';
	}
	else if (peer == editorUi.trello)
	{
		service = mxResources.get('trello');
		img.src = IMAGE_PATH + '/trello-logo-white.svg';
	}
	
	var p = document.createElement('p');
	mxUtils.write(p, mxResources.get('authorizeThisAppIn', [service]));

	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	
	var button = mxUtils.button(mxResources.get('authorize'), function()
	{
		fn(cb.checked);
	});

	button.insertBefore(img, button.firstChild);
	button.style.marginTop = '6px';
	button.className = 'geBigButton';
	button.style.fontSize = '18px';
	button.style.padding = '14px';

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
	var newEntries = [];
	
	// Adds custom sections first
	if (editorUi.sidebar.customEntries != null)
	{
		for (var i = 0; i < editorUi.sidebar.customEntries.length; i++)
		{
			var section = editorUi.sidebar.customEntries[i];
			var tmp = {title: editorUi.getResource(section.title), entries: []};
			
			for (var j = 0; j < section.entries.length; j++)
			{
				var entry = section.entries[j];
				tmp.entries.push({id: entry.id, title:
					editorUi.getResource(entry.title),
					desc: editorUi.getResource(entry.desc),
					image: entry.preview});
			}
			
			newEntries.push(tmp);
		}
	}
	
	// Adds built-in sections and filter entries
	for (var i = 0; i < entries.length; i++)
	{
		if (editorUi.sidebar.enabledLibraries == null)
		{
			newEntries.push(entries[i]);
		}
		else
		{
			var tmp = {title: entries[i].title, entries: []};
			
			for (var j = 0; j < entries[i].entries.length; j++)
			{
				if (mxUtils.indexOf(editorUi.sidebar.enabledLibraries,
					entries[i].entries[j].id) >= 0)
				{
					tmp.entries.push(entries[i].entries[j]);
				}
			}
			
			if (tmp.entries.length > 0)
			{
				newEntries.push(tmp);
			}
		}
	}
	
	entries = newEntries;
	
	if (expanded)
	{
		var addEntries = mxUtils.bind(this, function(e)
		{
			for (var i = 0; i < e.length; i++)
			{
				(function(section)
				{
					var title = listEntry.cloneNode(false);
					title.style.fontWeight = 'bold';
					title.style.backgroundColor = Editor.isDarkMode() ? '#505759' : '#e5e5e5';
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
							option.style.whiteSpace = 'nowrap';
							option.style.overflow = 'hidden';
							option.style.textOverflow = 'ellipsis';
							option.setAttribute('title', entry.title + ' (' + entry.id + ')');
							
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
									preview.style.textAlign = 'center';
									preview.style.padding = '0px';
									preview.style.color = '';
									preview.innerHTML = '';
									
									if (entry.desc != null)
									{
										var pre = document.createElement('pre');
										pre.style.boxSizing = 'border-box';
										pre.style.fontFamily = 'inherit';
										pre.style.margin = '20px';
										pre.style.right = '0px';
										pre.style.textAlign = 'left';
										mxUtils.write(pre, entry.desc);
										preview.appendChild(pre);
									}
									
									if (entry.imageCallback != null)
									{
										entry.imageCallback(preview);
									}
									else if (entry.image != null)
									{
										preview.innerHTML += '<img border="0" src="' + entry.image + '"/>';
									}
									else if (entry.desc == null)
									{
										preview.style.padding = '20px';
										preview.style.color = 'rgb(179, 179, 179)';
										mxUtils.write(preview, mxResources.get('noPreview'));
									}
									
									if (currentListItem != null)
									{
										currentListItem.style.backgroundColor = '';
									}
									
									currentListItem = option;
									currentListItem.style.backgroundColor = Editor.isDarkMode() ? '#000000' : '#ebf2f9';
									
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
				})(e[i]);
			}
		});
		
		var hd = document.createElement('div');
		hd.className = 'geDialogTitle';
		mxUtils.write(hd, mxResources.get('shapes'));
		hd.style.position = 'absolute';
		hd.style.top = '0px';
		hd.style.left = '0px';
		hd.style.lineHeight = '40px';
		hd.style.height = '40px';
		hd.style.right = '0px';
		
		var list = document.createElement('div');
		var preview = document.createElement('div');
		
		list.style.position = 'absolute';
		list.style.top = '40px';
		list.style.left = '0px';
		list.style.width = '202px';
		list.style.bottom = '60px';
		list.style.overflow = 'auto';
		
		preview.style.position = 'absolute';
		preview.style.left = '202px';
		preview.style.right = '0px';
		preview.style.top = '40px';
		preview.style.bottom = '60px';
		preview.style.overflow = 'auto';
		preview.style.borderLeft = '1px solid rgb(211, 211, 211)';
		preview.style.textAlign = 'center';
		
		var currentListItem = null;
		var applyFunctions = [];
		
		var listEntry = document.createElement('div');
		listEntry.style.position = 'relative';
		listEntry.style.left = '0px';
		listEntry.style.right = '0px';
		
		addEntries(entries);
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

var PluginsDialog = function(editorUi, addFn, delFn) 
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
			inner.innerHTML = mxUtils.htmlEntities(mxResources.get('noPlugins'));
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
						editorUi.confirm(mxResources.get('delete') + ' "' + plugins[index] + '"?', function()
						{
							if (delFn != null) 
							{
								delFn(plugins[index]);
							}
							
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

	var addBtn = mxUtils.button(mxResources.get('add') + '...', addFn != null? function()
	{
		addFn(function(newPlugin)
		{
			if (newPlugin && mxUtils.indexOf(plugins, newPlugin) < 0)
			{
				plugins.push(newPlugin);
			}
			
			refresh();
		});
	}
	: function()
	{
		var div = document.createElement('div');
		
		var title = document.createElement('span');
		title.style.marginTop = '6px';
		mxUtils.write(title, mxResources.get('builtinPlugins') + ': ');
		div.appendChild(title);
		
		var pluginsSelect = document.createElement('select');
		pluginsSelect.style.width = '150px';
		
		for (var i = 0; i < App.publicPlugin.length; i++)
		{
			var option = document.createElement('option');
			mxUtils.write(option, App.publicPlugin[i]);
			option.value = App.publicPlugin[i];
			pluginsSelect.appendChild(option);
		}
		
		div.appendChild(pluginsSelect);
		mxUtils.br(div);
		mxUtils.br(div);
		
		var customBtn = mxUtils.button(mxResources.get('custom') + '...', function()
		{
			var dlg = new FilenameDialog(editorUi, '', mxResources.get('add'), function(newValue)
			{
				editorUi.hideDialog();
				
				if (newValue != null && newValue.length > 0)
				{
					var tokens = newValue.split(';');
					
					for (var i = 0; i < tokens.length; i++)
					{
						var token = tokens[i];
						var url = App.pluginRegistry[token];
						
						if (url != null)
						{
							token = url;
						}
						
						if (token.length > 0 && mxUtils.indexOf(plugins, token) < 0)
						{
							plugins.push(token);
						}
					}
					
					refresh();
				}
			}, mxResources.get('enterValue') + ' (' + mxResources.get('url') + ')');
			
			editorUi.showDialog(dlg.container, 300, 80, true, true);
			dlg.init();
		});
		
		customBtn.className = 'geBtn';
					
		var dlg = new CustomDialog(editorUi, div, mxUtils.bind(this, function()
		{
			var token = App.pluginRegistry[pluginsSelect.value];
			
			if (mxUtils.indexOf(plugins, token) < 0)
			{
				plugins.push(token);
				refresh();
			}
		}), null, null, null, customBtn);
		editorUi.showDialog(dlg.container, 300, 80, true, true);
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

	var helpBtn = mxUtils.button(mxResources.get('help'), function()
	{
		editorUi.openLink('https://www.diagrams.net/doc/faq/plugins');
	});

	helpBtn.className = 'geBtn';
	
	if (editorUi.isOffline() && !mxClient.IS_CHROMEAPP)
	{
		helpBtn.style.display = 'none';
	}
	
	buttons.appendChild(helpBtn);
	
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

var CropImageDialog = function(editorUi, image, fn) 
{
	var div = document.createElement('div');
	
	var croppieDiv = document.createElement('div');
	croppieDiv.style.width = '300px';
	croppieDiv.style.height = '300px';
	div.appendChild(croppieDiv);
	var croppie = null;
	
	function createCroppie(isCircle)
	{
		if (croppie != null)
		{
			croppie.destroy();
		}
		
		if (isCircle)
		{
			croppie = new Croppie(croppieDiv, {
				viewport: { width: 150, height: 150, type: 'circle' },
				enableExif: true,
			    showZoomer: false,
			    enableResize: false,
			    enableOrientation: true
			});
			
			croppie.bind({
			    url: image
			});
		}
		else
		{
			croppie = new Croppie(croppieDiv, {
				viewport: { width: 150, height: 150, type: 'square' },
				enableExif: true,
			    showZoomer: false,
			    enableResize: true,
			    enableOrientation: true
			});
			
			croppie.bind({
			    url: image
			});
		}	
	};
	
	this.init = function()
	{
		createCroppie();
	};

	var circleInput = document.createElement('input');
	circleInput.setAttribute('type', 'checkbox');
	circleInput.setAttribute('id', 'croppieCircle');
	circleInput.style.margin = '5px';
	div.appendChild(circleInput);
	
	var circleLbl = document.createElement('label');
	circleLbl.setAttribute('for', 'croppieCircle');
	mxUtils.write(circleLbl, mxResources.get('circle'));
	div.appendChild(circleLbl);
	
	var wrap, btnLeft, btnRight, iLeft, iRight;

    wrap = document.createElement('div');
    btnLeft = document.createElement('button');
    btnRight = document.createElement('button');

    wrap.appendChild(btnLeft);
    wrap.appendChild(btnRight);

    iLeft = document.createElement('i');
    iRight = document.createElement('i');
    btnLeft.appendChild(iLeft);
    btnRight.appendChild(iRight);

    wrap.className = 'cr-rotate-controls';
    wrap.style.float = 'right';
    wrap.style.position = 'inherit';
    btnLeft.className = 'cr-rotate-l';
    btnRight.className = 'cr-rotate-r';
    
    div.appendChild(wrap);

    btnLeft.addEventListener('click', function () 
    {
    	croppie.rotate(-90);
    });
    
    btnRight.addEventListener('click', function () 
    {
    	croppie.rotate(90);
    });
	
	mxEvent.addListener(circleInput, 'change', function()
	{
		createCroppie(this.checked);
	});
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		croppie.result({type: 'base64', size: 'original'}).then(function(base64Img) {
			fn(base64Img);
			editorUi.hideDialog();
		});
	});
	
	applyBtn.className = 'geBtn gePrimaryBtn';
	
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
	
	mxUtils.write(left, mxResources.get('relative') + ':');
	
	var relInput = document.createElement('input');
	relInput.setAttribute('type', 'checkbox');
	
	if (geo != null && geo.relative)
	{
		relInput.setAttribute('checked', 'checked');
		relInput.defaultChecked = true;
	}
	
	this.init = function()
	{
		relInput.focus();
	};

	right.appendChild(relInput);

	row.appendChild(left);
	row.appendChild(right);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	left = document.createElement('td');
	right = document.createElement('td');
	
	mxUtils.write(left, mxResources.get('left') + ':');
	
	var xInput = document.createElement('input');
	xInput.setAttribute('type', 'text');
	xInput.style.width = '100px';
	xInput.value = (geo != null) ? geo.x : '';

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
	
	mxUtils.write(left, mxResources.get('dx') + ':');
	
	var dxInput = document.createElement('input');
	dxInput.setAttribute('type', 'text');
	dxInput.style.width = '100px';
	dxInput.value = (geo != null && geo.offset != null) ? geo.offset.x : '';

	right.appendChild(dxInput);

	row.appendChild(left);
	row.appendChild(right);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	left = document.createElement('td');
	right = document.createElement('td');
	
	mxUtils.write(left, mxResources.get('dy') + ':');
	
	var dyInput = document.createElement('input');
	dyInput.setAttribute('type', 'text');
	dyInput.style.width = '100px';
	dyInput.value = (geo != null && geo.offset != null) ? geo.offset.y : '';

	right.appendChild(dyInput);

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
	
	cancelBtn.className = 'geBtn';
	
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
						g.relative = relInput.checked;
						
						if (mxUtils.trim(xInput.value).length > 0)
						{
							g.x = Number(xInput.value);
						}
						
						if (mxUtils.trim(yInput.value).length > 0)
						{
							g.y = Number(yInput.value);
						}
						
						if (mxUtils.trim(dxInput.value).length > 0)
						{
							if (g.offset == null)
							{
								g.offset = new mxPoint();
							}
							
							g.offset.x = Number(dxInput.value);
						}
						
						if (mxUtils.trim(dyInput.value).length > 0)
						{
							if (g.offset == null)
							{
								g.offset = new mxPoint();
							}
							
							g.offset.y = Number(dyInput.value);
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
	
	applyBtn.className = 'geBtn gePrimaryBtn';
	
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
			
			if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
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
			editorUi.spinner.stop();
			
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
					wrapper.style.display = 'inline-block';
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
						var cells = editorUi.stringToCells(Graph.decompress(img.xml));
						
						if (cells.length > 0)
						{
							editorUi.sidebar.createThumb(cells, ew, eh, wrapper, null, true, false);
							
							// Needs inline block on SVG for delete icon to appear on same line
							wrapper.firstChild.style.display = 'inline-block';
							wrapper.firstChild.style.cursor = '';
						}
					}
					
					var rem = document.createElement('img');
					rem.setAttribute('src', Editor.closeImage);
					rem.setAttribute('border', '0');
					rem.setAttribute('title', mxResources.get('delete'));
					rem.setAttribute('align', 'top');
					rem.style.paddingTop = '4px';
					rem.style.position = 'absolute';
					rem.style.marginLeft = '-12px';
					rem.style.zIndex = '1';
					rem.style.cursor = 'pointer';
					
					// Blocks dragging of remove icon
					mxEvent.addListener(rem, 'dragstart', function(evt)
					{
						mxEvent.consume(evt);
					});
					
					(function(wrapperDiv, dataParam, imgParam)
					{
						mxEvent.addListener(rem, 'click', function(evt)
						{
							entries[dataParam] = null;
							
							for (var i = 0; i < images.length; i++)
							{
								if ((images[i].data != null && images[i].data == dataParam) ||
									(images[i].xml != null && imgParam != null &&
									images[i].xml == imgParam.xml))
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
					label.style.backgroundColor = Editor.isDarkMode() ? '#2a2a2a' : '#ffffff';
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
						if (!mxClient.IS_IOS && !mxClient.IS_FF &&
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
								mxUtils.setPrefixedStyle(label.style, 'user-select', 'text');
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
					var doc = mxUtils.parseXml(data);
					
					if (doc.documentElement.nodeName == 'mxlibrary')
					{
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
						
						done = true;
					}
					else if (doc.documentElement.nodeName == 'mxfile')
					{
						var pages = doc.documentElement.getElementsByTagName('diagram');
						
						for (var i = 0; i < pages.length; i++)
						{
							var temp = mxUtils.getTextContent(pages[i]);
							var cells = editorUi.stringToCells(Graph.decompress(temp));
							var size = editorUi.editor.graph.getBoundingBoxFromGeometry(cells);
							addButton(null, null, 0, 0, 0, 0, {xml: temp, w: size.width, h: size.height});
						}
						
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
	
	var createImportHandler = function(evt)
	{
		return function(data, mimeType, x, y, w, h, img, doneFn, file)
		{
			if (file != null && (/(\.v(dx|sdx?))($|\?)/i.test(file.name) || /(\.vs(x|sx?))($|\?)/i.test(file.name)))
			{
				editorUi.importVisio(file, mxUtils.bind(this, function(xml)
				{
		    		addButton(xml, mimeType, x, y, w, h, img, 'fixed', (mxEvent.isAltDown(evt)) ?
		    			null : img.substring(0, img.lastIndexOf('.')).replace(/_/g, ' '));
				}));
			}
			else if (file != null && !editorUi.isOffline() && new XMLHttpRequest().upload && editorUi.isRemoteFileFormat(data, file.name))
			{
				editorUi.parseFile(file, mxUtils.bind(this, function(xhr)
				{
					if (xhr.readyState == 4)
					{
						editorUi.spinner.stop();
	    				
	    				if (xhr.status >= 200 && xhr.status <= 299)
						{
							var xml = xhr.responseText;
							addButton(xml, mimeType, x, y, w, h, img, 'fixed', (mxEvent.isAltDown(evt)) ?
				    			null : img.substring(0, img.lastIndexOf('.')).replace(/_/g, ' '));
							div.scrollTop = div.scrollHeight;
						}
					}
				}));
			}
			else
			{
				addButton(data, mimeType, x, y, w, h, img, 'fixed', (mxEvent.isAltDown(evt)) ?
					null : img.substring(0, img.lastIndexOf('.')).replace(/_/g, ' '));
				div.scrollTop = div.scrollHeight;
			}
		};
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
			editorUi.importFiles(evt.dataTransfer.files, 0, 0, editorUi.maxImageSize, createImportHandler(evt));
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
					div.scrollTop = div.scrollHeight;
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

	if (editorUi.getServiceName() == 'draw.io' && file != null &&
		// Limits button to ibraries which are known to have public URLs
		(file.constructor == DriveLibrary || file.constructor == GitHubLibrary))
	{
		var btn = mxUtils.button(mxResources.get('link'), function()
		{
			if (editorUi.spinner.spin(document.body, mxResources.get('loading')))
			{
		    	file.getPublicUrl(function(url)
				{
					editorUi.spinner.stop();
					
					if (url != null)
					{
						var search = editorUi.getSearch(['create', 'title', 'mode', 'url', 'drive', 'splash', 'state', 'clibs', 'ui']);
						search += ((search.length == 0) ? '?' : '&') + 'splash=0&clibs=U' + encodeURIComponent(url);
						var dlg = new EmbedDialog(editorUi, window.location.protocol + '//' +
							window.location.host + '/' + search, null, null, null, null,
							'Check out the library I made using @drawio');
						editorUi.showDialog(dlg.container, 440, 240, true);
						dlg.init();
					}
					else if (file.constructor == DriveLibrary)
					{
					    editorUi.showError(mxResources.get('error'), mxResources.get('diagramIsNotPublic'),
							mxResources.get('share'), mxUtils.bind(this, function()
							{
								editorUi.drive.showPermissions(file.getId());
							}), null, mxResources.get('ok'), mxUtils.bind(this, function()
							{
								// Hides dialog
							})
						);
					}
					else
					{
						editorUi.handleError({message: mxResources.get('diagramIsNotPublic')});
					}
				});
			}
		});

		btn.className = 'geBtn';
		btns.appendChild(btn);
	}
	
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
    		editorUi.saveLocalFile(data, filename, 'text/xml', null, null, true, null, 'xml');
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
	
	if (Graph.fileSupport)
	{
		if (editorUi.libDlgFileInputElt == null) 
		{
			var fileInput = document.createElement('input');
			fileInput.setAttribute('multiple', 'multiple');
			fileInput.setAttribute('type', 'file');
	
			mxEvent.addListener(fileInput, 'change', function(evt)
			{
		    	errorShowed = false;

		    	editorUi.importFiles(fileInput.files, 0, 0, editorUi.maxImageSize, function(data, mimeType, x, y, w, h, img, doneFn, file)
		    	{
					if (fileInput.files != null)
					{
			    		createImportHandler(evt)(data, mimeType, x, y, w, h, img, doneFn, file);
		
			    		// Resets input to force change event for same file (type reset required for IE)
			    		fileInput.type = '';
			    		fileInput.type = 'file';
			    		fileInput.value = '';
					}
		    	});
	
				div.scrollTop = div.scrollHeight;
			});
			
			fileInput.style.display = 'none';
			document.body.appendChild(fileInput);
			editorUi.libDlgFileInputElt = fileInput;
		}
		
		var btn = mxUtils.button(mxResources.get('import'), function()
		{
			if (stopEditing != null)
			{
				stopEditing();
				stopEditing = null;
			}
			
			editorUi.libDlgFileInputElt.click();
		});
		btn.setAttribute('id', 'btnAddImage');
		btn.className = 'geBtn';
		
		btns.appendChild(btn);
	}

	var btn = mxUtils.button(mxResources.get('addImages'), function()
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
				div.scrollTop = div.scrollHeight;
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

	var clone = editorUi.editor.graph.cloneCell(cell);
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
	
	if (!editorUi.isOffline())
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			editorUi.openLink('https://www.diagrams.net/doc/faq/shape-complex-create-edit');
		});
		
		helpBtn.className = 'geBtn';
		td.appendChild(helpBtn);
	}
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
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
				newValue = Graph.compress(newValue);
				
				targetGraph.getModel().beginUpdate();
				try
				{
					// Inserts cell if required
					if (isNew)
					{
						var pt = editorUi.editor.graph.getFreeInsertPoint();
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
					targetGraph.scrollCellToVisible(targetCell);
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

var CustomDialog = function(editorUi, content, okFn, cancelFn, okButtonText, helpLink, buttonsContent, hideCancel, cancelButtonText, hideAfterOKFn)
{
	var div = document.createElement('div');
	div.appendChild(content);
	
	var btns = document.createElement('div');
	btns.style.marginTop = '16px';
	btns.style.textAlign = 'center';
	
	if (buttonsContent != null)
	{
		btns.appendChild(buttonsContent);
	}
	
	if (!editorUi.isOffline() && helpLink != null)
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			editorUi.openLink(helpLink);
		});
		
		helpBtn.className = 'geBtn';
		btns.appendChild(helpBtn);
	}
	
	var cancelBtn = mxUtils.button(cancelButtonText || mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	
	cancelBtn.className = 'geBtn';
	
	if (hideCancel)
	{
		cancelBtn.style.display = 'none';
	}
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	var okBtn = mxUtils.button(okButtonText || mxResources.get('ok'), mxUtils.bind(this, function()
	{
		if (!hideAfterOKFn)
		{
			editorUi.hideDialog(null, null, this.container);
		}
		
		if (okFn != null)
		{
			var okRet = okFn();
			
			if (typeof okRet === 'string')
			{
				editorUi.showError(mxResources.get('error'), okRet);
				return;	
			}
		}
		
		if (hideAfterOKFn)
		{
			editorUi.hideDialog(null, null, this.container);
		}
	}));
	btns.appendChild(okBtn);
	
	okBtn.className = 'geBtn gePrimaryBtn';
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.cancelBtn = cancelBtn;
	this.okButton = okBtn;
	this.container = div;
};

var TemplatesDialog = function()
{
	var dialogSkeleton = 
	'<div class="geTempDlgHeader">' + 
		'<img src="/images/draw.io-logo.svg" class="geTempDlgHeaderLogo">' +
		'<input type="search" class="geTempDlgSearchBox" placeholder="'+ mxResources.get('search', null, 'Search') +'">' +
	'</div>' +
	'<div class="geTemplatesList">' +
		'<div class="geTempDlgNewDiagramlbl">'+ mxResources.get('newDiagram', null, 'New Diagram') + '</div>' +
		'<div class="geTempDlgHLine"></div>' +
		'<div class="geTemplatesLbl">'+ mxResources.get('templates', null, 'Templates') + '</div>' +
	'</div>' +
	'<div class="geTempDlgContent">' +
		'<div class="geTempDlgNewDiagramCat">' +
			'<div class="geTempDlgNewDiagramCatLbl">'+ mxResources.get('newDiagram', null, 'New Diagram') +'</div>' +
			'<div class="geTempDlgNewDiagramCatList">' +
			'</div>' + 
			'<div class="geTempDlgNewDiagramCatFooter">' + 
				'<div class="geTempDlgShowAllBtn">'+ mxResources.get('showAll', null, '+ Show all') +'</div>' +
			'</div>' +
		'</div>' + 
		'<div class="geTempDlgDiagramsList">' +
			'<div class="geTempDlgDiagramsListHeader">' +
				'<div class="geTempDlgDiagramsListTitle"></div>' +
				'<div class="geTempDlgDiagramsListBtns">' +
					'<div class="geTempDlgRadioBtn geTempDlgRadioBtnLarge" data-id="myDiagramsBtn">' +
						'<img src="/images/my-diagrams.svg" class="geTempDlgMyDiagramsBtnImg"> <span>'+ mxResources.get('myDiagrams', null, 'My diagrams') + '</span>' +
					'</div><div class="geTempDlgRadioBtn geTempDlgRadioBtnLarge geTempDlgRadioBtnActive" data-id="allDiagramsBtn">' +
						'<img src="/images/all-diagrams-sel.svg" class="geTempDlgAllDiagramsBtnImg"> <span>'+ mxResources.get('allDiagrams', null, 'All diagrams') + '</span>' +
					'</div><div class="geTempDlgSpacer"> </div><div class="geTempDlgRadioBtn geTempDlgRadioBtnSmall geTempDlgRadioBtnActive" data-id="tilesBtn">' +
						'<img src="/images/tiles-sel.svg" class="geTempDlgTilesBtnImg">' +
					'</div><div class="geTempDlgRadioBtn geTempDlgRadioBtnSmall" data-id="listBtn">' +
						'<img src="/images/list.svg" class="geTempDlgListBtnImg">' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="geTempDlgDiagramsTiles">' +
			'</div>'+
		'</div>' +
	'</div>' +
	'<br style="clear:both;"/>' +
	'<div class="geTempDlgFooter">' +
		'<span class="geTempDlgLinkToDiagram geTempDlgLinkToDiagramHint">&#x1F6C8; ' + mxResources.get('linkToDiagramHint', null, 'Add a link to this diagram. The diagram can only be edited from the page that owns it.') + '</span>' +
		'<button class="geTempDlgLinkToDiagram geTempDlgLinkToDiagramBtn">'+ mxResources.get('linkToDiagram', null, 'Link to Diagram') + '</button>' +
		'<div class="geTempDlgCreateBtn">'+ mxResources.get('create', null, 'Create') + '</div>' +
		'<div class="geTempDlgCancelBtn">'+ mxResources.get('cancel', null, 'Cancel') + '</div>' +
	'</div>';
	
	var div = document.createElement('div');
	div.innerHTML = dialogSkeleton;
	div.className = "geTemplateDlg";
	//override default dialog size based on screen size if needed
	var ww = window.innerWidth;
	var wh = window.innerHeight;
	var dw = 987, dh = 712;
	
	if (ww * 0.9 < dw)
	{
		dw = Math.max(ww * 0.9, 600);
		div.style.width = dw + "px";
	}

	if (wh * 0.9 < dh)
	{
		dh = Math.max(wh * 0.9, 300);
		div.style.height = dh + "px";
	}

	this.width = dw;
	this.height = dh;
	this.container = div;
};

TemplatesDialog.prototype.init = function(editorUi, callback, cancelCallback,
		templateFile, newDiagramCatsFile, username, recentDocsCallback, searchDocsCallback,
		openExtDocCallback, linkToDiagramCallback)
{
	templateFile = (templateFile != null) ? templateFile : (TEMPLATE_PATH + '/index.xml');
	newDiagramCatsFile = (newDiagramCatsFile != null) ? newDiagramCatsFile : NEW_DIAGRAM_CATS_PATH + '/index.xml';

	var dlgDiv = this.container;
	var callInitiated = false;
	var cancelPendingCall = false;
	var currentEntry = null;
	var currentItem = null;
	var currentItemInfo = null;
	var showingAll = false;
	var isGetAll = true;
	var showAsList = false;
	var curDiagList = [];
	var lastSearchStr;
	var categorySelected = true;
	var showAllBtn = dlgDiv.querySelector(".geTempDlgShowAllBtn");
	var diagramsTiles = dlgDiv.querySelector('.geTempDlgDiagramsTiles');
	var diagramsListTitle = dlgDiv.querySelector('.geTempDlgDiagramsListTitle');
	var diagramsListBtns = dlgDiv.querySelector('.geTempDlgDiagramsListBtns');
	var tempDlgContent = dlgDiv.querySelector('.geTempDlgContent');
	var diagramsList = dlgDiv.querySelector('.geTempDlgDiagramsList');
	var newDiagramCat = dlgDiv.querySelector('.geTempDlgNewDiagramCat');
	var newDiagramCatList = dlgDiv.querySelector(".geTempDlgNewDiagramCatList");
	var createBtn = dlgDiv.querySelector('.geTempDlgCreateBtn');
	var spinner = new Spinner({
		lines: 12, // The number of lines to draw
		length: 10, // The length of each line
		width: 5, // The line thickness
		radius: 10, // The radius of the inner circle
		rotate: 0, // The rotation offset
		color: '#000', // #rgb or #rrggbb
		speed: 1.5, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		top: '50px',
		zIndex: 2e9 // The z-index (defaults to 2000000000)
	});
	
	function deselectTempCat()
	{
		if (currentEntry != null)
		{
			currentEntry.style.fontWeight = 'normal';
			currentEntry.style.textDecoration = 'none';
			currentEntry = null;
		}
	};
	
	mxEvent.addListener(dlgDiv.querySelector('.geTempDlgNewDiagramlbl'), 'click', function()
	{
		deselectTempCat();
		newDiagramCat.style.display = '';
		diagramsList.style.minHeight = 'calc(100% - 280px)';
		getRecentDocs(isGetAll);
	});
	
	function radioClick(btn, btnImgId, btnImgFile, otherBtnId, otherBtnImgId, otherBtnImgFile, isLarge)
	{
		if (btn.className.indexOf('geTempDlgRadioBtnActive') > -1)
		{
			return false;
		}
		else
		{
			btn.className += ' geTempDlgRadioBtnActive';
			dlgDiv.querySelector('.geTempDlgRadioBtn[data-id='+ otherBtnId +']').className = "geTempDlgRadioBtn " + 
											(isLarge? "geTempDlgRadioBtnLarge" : "geTempDlgRadioBtnSmall");
			dlgDiv.querySelector('.'+ btnImgId).src = "/images/"+ btnImgFile +"-sel.svg";
			dlgDiv.querySelector('.'+ otherBtnImgId).src = "/images/"+ otherBtnImgFile +".svg";
			return true;
		}
	};
	
	mxEvent.addListener(dlgDiv.querySelector('.geTempDlgRadioBtn[data-id=allDiagramsBtn]'), 'click', function()
	{
		if (radioClick(this, 'geTempDlgAllDiagramsBtnImg', 'all-diagrams', 'myDiagramsBtn', 'geTempDlgMyDiagramsBtnImg', 'my-diagrams', true))
		{
			isGetAll = true;
			lastSearchStr == null? getRecentDocs(isGetAll) : doSearch(lastSearchStr);
		}
	});

	mxEvent.addListener(dlgDiv.querySelector('.geTempDlgRadioBtn[data-id=myDiagramsBtn]'), 'click', function()
	{
		if (radioClick(this, 'geTempDlgMyDiagramsBtnImg', 'my-diagrams', 'allDiagramsBtn', 'geTempDlgAllDiagramsBtnImg', 'all-diagrams', true))
		{
			isGetAll = false;
			lastSearchStr == null? getRecentDocs(isGetAll) : doSearch(lastSearchStr);
		}
	});
	
	mxEvent.addListener(dlgDiv.querySelector('.geTempDlgRadioBtn[data-id=listBtn]'), 'click', function()
	{
		if (radioClick(this, 'geTempDlgListBtnImg', 'list', 'tilesBtn', 'geTempDlgTilesBtnImg', 'tiles', false))
		{
			showAsList = true;
			fillDiagramsList(curDiagList, false, showAsList);
		}
	});
	
	mxEvent.addListener(dlgDiv.querySelector('.geTempDlgRadioBtn[data-id=tilesBtn]'), 'click', function()
	{
		if (radioClick(this, 'geTempDlgTilesBtnImg', 'tiles', 'listBtn', 'geTempDlgListBtnImg', 'list', false))
		{
			showAsList = false;
			fillDiagramsList(curDiagList, false, showAsList);
		}
	});
	
	function createPreview(diagram)
	{
		var imgUrl = diagram.prevImgUrl || diagram.imgUrl || (TEMPLATE_PATH + '/' + diagram.url.substring(0, diagram.url.length - 4) + '.png');
		var mask = document.createElement('div');
		mask.className = "geTempDlgDialogMask";
		dlgDiv.appendChild(mask);
		var prevBox = document.createElement('div');
		prevBox.className = "geTempDlgDiagramPreviewBox";
		var img = document.createElement('img');
		img.src = imgUrl;
		prevBox.appendChild(img);
		var closeBtn = document.createElement('img');
		closeBtn.src = "/images/close.png";
		closeBtn.className = "geTempDlgPreviewCloseBtn";
		closeBtn.setAttribute('title', mxResources.get("close"));
		prevBox.appendChild(closeBtn);
		var scrollTop = tempDlgContent.scrollTop;
		
		function closeBox(evt)
		{
			tempDlgContent.removeChild(prevBox);
			dlgDiv.removeChild(mask);
			tempDlgContent.scrollTop = scrollTop;
		};

		mxEvent.addListener(closeBtn, 'click', closeBox);
		mxEvent.addListener(mask, 'click', closeBox);
		tempDlgContent.appendChild(prevBox);
		tempDlgContent.scrollTop = 0;
		//for centering the image
		prevBox.style.lineHeight = prevBox.clientHeight + "px";
	};
	
	function swapActiveItem(newItem, activeCls, itemInfo)
	{
		if (currentItem != null)
		{
			var classes = currentItem.className.split(" ");

			for (var i = 0; i < classes.length; i++)
			{
				if (classes[i].indexOf("Active") > -1)
				{
					classes.splice(i, 1);
					break;
				}
			}
			
			currentItem.className = classes.join(" ");
		}
		
		if (newItem != null)
		{
			currentItem = newItem;
			currentItem.className += " " + activeCls;
			currentItemInfo = itemInfo;
			categorySelected = itemInfo.isCategory;
			//activate create button
			createBtn.className = "geTempDlgCreateBtn";
		}
		else 
		{
			currentItem = null;
			currentItemInfo = null;
			//disable create button
			createBtn.className = "geTempDlgCreateBtn geTempDlgCreateBtnDisabled";
		}
	};
	
	function handleDialogOK(linkToDiagram)
	{
		if (currentItemInfo != null)
		{
			var itemInfo = currentItemInfo;
			//disable create button
			currentItemInfo = null;
			createBtn.className = "geTempDlgCreateBtn geTempDlgCreateBtnDisabled geTempDlgCreateBtnBusy";
			
			if (itemInfo.isExternal)
			{
				if (linkToDiagram == true)
				{
					linkToDiagramCallback(itemInfo.url, itemInfo, "nameInput.value");
				}
				else 
				{
					openExtDocCallback(itemInfo.url, itemInfo, "nameInput.value");
				}
				
				editorUi.hideDialog(true);
			}
			else
			{
				mxUtils.get(TEMPLATE_PATH + '/' + itemInfo.url, mxUtils.bind(this, function(req)
				{
					if (req.getStatus() >= 200 && req.getStatus() <= 299)
					{
						callback(req.getText(), "nameInput.value");
						editorUi.hideDialog(true);
					}
					else
					{
						//TODO Handle errors	
					}
				}));
			}
		}
	};
	
	function showLinkToDiagram(isShown)
	{
		var linkDisplay = isShown? '' : 'none';
		var elems = dlgDiv.querySelectorAll(".geTempDlgLinkToDiagram");
		
		for(var i = 0; i < elems.length; i++)
		{
			elems[i].style.display = linkDisplay;
		}
	};
	
	function fillDiagramsList(diagrams, isTemplate, asList)
	{
		function setSubmitBtnLbl() 
		{
			if (isTemplate)
			{
				createBtn.innerHTML = mxUtils.htmlEntities(mxResources.get('create'));
			}
			else
			{
				createBtn.innerHTML = mxUtils.htmlEntities(mxResources.get('copy'));
			}
			
			showLinkToDiagram (!isTemplate);
		};
		
		diagramsTiles.innerHTML = '';
		swapActiveItem();
		curDiagList = diagrams;
		var grid = null;
		
		if (asList)
		{
			grid = document.createElement('table');
			grid.className = 'geTempDlgDiagramsListGrid';
			//create header row
			var hrow = document.createElement('tr');
			var th = document.createElement('th');
			th.style.width = "50%";
			th.innerHTML = mxUtils.htmlEntities(mxResources.get('diagram', null, 'Diagram'));
			hrow.appendChild(th);
			th = document.createElement('th');
			th.style.width = "25%";
			th.innerHTML = mxUtils.htmlEntities(mxResources.get('changedBy', null, 'Changed By'));
			hrow.appendChild(th);
			th = document.createElement('th');
			th.style.width = "25%";
			th.innerHTML = mxUtils.htmlEntities(mxResources.get('lastModifiedOn', null, 'Last modified on'));
			hrow.appendChild(th);
			grid.appendChild(hrow);
			diagramsTiles.appendChild(grid);
		}
		
		//TODO support paging
		for (var i = 0; i < diagrams.length; i++)
		{
			diagrams[i].isExternal = !isTemplate;
			var url = diagrams[i].url;
			var title = mxUtils.htmlEntities(diagrams[i].title);
			var tooltip = diagrams[i].tooltip || diagrams[i].title;
			var imgUrl = diagrams[i].imgUrl;
			var changedBy = mxUtils.htmlEntities(diagrams[i].changedBy || "");
			var lastModifiedOn = mxUtils.htmlEntities(diagrams[i].lastModifiedOn || "");
			
			if (!imgUrl)
			{
				imgUrl = TEMPLATE_PATH + '/' + url.substring(0, url.length - 4) + '.png';
			}
			
			var titleLimit = asList? 50 : 15;
					
			if (title != null && title.length > titleLimit)
			{
				title = title.substring(0, titleLimit) + '&hellip;';
			}
			
			if (asList)
			{
				var row = document.createElement('tr');
				var td = document.createElement('td');
				var prevImg = document.createElement('img');
				prevImg.src = "/images/icon-search.svg";
				prevImg.className = "geTempDlgDiagramListPreviewBtn";
				prevImg.setAttribute('title', mxResources.get("preview"));
				td.appendChild(prevImg);
				var titleSpan = document.createElement('span');
				titleSpan.className = "geTempDlgDiagramTitle";
				titleSpan.innerHTML = title;
				td.appendChild(titleSpan);
				row.appendChild(td);
				td = document.createElement('td');
				td.innerHTML = changedBy;
				row.appendChild(td);
				td = document.createElement('td');
				td.innerHTML = lastModifiedOn;
				row.appendChild(td);
				grid.appendChild(row);
				
				if (currentItem == null)
				{
					setSubmitBtnLbl();
					swapActiveItem(row, "geTempDlgDiagramsListGridActive", diagrams[i]);
				}
				
				(function(diagram2, row2)
				{
					mxEvent.addListener(row, 'click', function()
					{
						if (currentItem != row2)
						{
							setSubmitBtnLbl();
							swapActiveItem(row2, "geTempDlgDiagramsListGridActive", diagram2);
						}
					});
					
					mxEvent.addListener(row, 'dblclick', handleDialogOK);
					
					mxEvent.addListener(prevImg, 'click', function()
					{
						createPreview(diagram2);
					});
				})(diagrams[i], row);
			}
			else
			{
				var tile = document.createElement('div');
				tile.className = "geTempDlgDiagramTile";
				tile.setAttribute('title', tooltip);
				
				if (currentItem == null)
				{
					setSubmitBtnLbl();
					swapActiveItem(tile, "geTempDlgDiagramTileActive", diagrams[i]);
				}
				
				var imgDiv = document.createElement('div');
				imgDiv.className = "geTempDlgDiagramTileImg geTempDlgDiagramTileImgLoading";
				var img = document.createElement('img');
				img.style.display = "none";
				
				(function(img2, imgDiv2)
				{
					img.onload = function() 
					{
						imgDiv2.className = "geTempDlgDiagramTileImg";
						img2.style.display = "";	
					}
					
					img.onerror = function()
					{
						imgDiv2.className = "geTempDlgDiagramTileImg geTempDlgDiagramTileImgError";
					}
				})(img, imgDiv);
				
				img.src = imgUrl;
				imgDiv.appendChild(img);
				tile.appendChild(imgDiv);
	
				var lblDiv = document.createElement('div');
				lblDiv.className = "geTempDlgDiagramTileLbl";
				lblDiv.innerHTML = title != null? title : "";
				tile.appendChild(lblDiv);
				
				var prevImg = document.createElement('img');
				prevImg.src = "/images/icon-search.svg";
				prevImg.className = "geTempDlgDiagramPreviewBtn";
				prevImg.setAttribute('title', mxResources.get("preview"));
				tile.appendChild(prevImg);
				
				(function(diagram2, tile2)
				{
					mxEvent.addListener(tile, 'click', function()
					{
						if (currentItem != tile2)
						{
							setSubmitBtnLbl();
							swapActiveItem(tile2, "geTempDlgDiagramTileActive", diagram2);
						}
					});
					
					mxEvent.addListener(tile, 'dblclick', handleDialogOK);
					
					mxEvent.addListener(prevImg, 'click', function()
					{
						createPreview(diagram2);
					});
				})(diagrams[i], tile);
				
				diagramsTiles.appendChild(tile);
			}
		}
	};
	
	function fillNewDiagramCats(newDiagramCats, showAll) 
	{
		newDiagramCatList.innerHTML = "";
		swapActiveItem();
		var catCount = !showAll && newDiagramCats.length > 5 ? 5 : newDiagramCats.length;
		
		for (var i = 0; i < catCount; i++)
		{
			var cat = newDiagramCats[i];
			cat.isCategory = true;
			var entry = document.createElement('div');
			var label = mxResources.get(cat.title);
			
			if (label == null)
			{
				label = cat.title.substring(0, 1).toUpperCase() + cat.title.substring(1);
			}
			
			entry.className = 'geTempDlgNewDiagramCatItem';
			entry.setAttribute('title', label);
			
			label = mxUtils.htmlEntities(label);
			
			if (label.length > 15)
			{
				label = label.substring(0, 15) + '&hellip;';
			}

			if (currentItem == null)
			{
				createBtn.innerHTML = mxUtils.htmlEntities(mxResources.get('create'));
				showLinkToDiagram();
				swapActiveItem(entry, "geTempDlgNewDiagramCatItemActive", cat);
			}
			
			var imgDiv = document.createElement('div');
			imgDiv.className = "geTempDlgNewDiagramCatItemImg";
			var img = document.createElement('img');
			img.src = NEW_DIAGRAM_CATS_PATH + '/' + cat.img;
			imgDiv.appendChild(img);
			entry.appendChild(imgDiv);

			var lblDiv = document.createElement('div');
			lblDiv.className = "geTempDlgNewDiagramCatItemLbl";
			lblDiv.innerHTML = label;
			entry.appendChild(lblDiv);
			
			newDiagramCatList.appendChild(entry);

			(function(cat2, entry2)
			{
				mxEvent.addListener(entry, 'click', function()
				{
					if (currentItem != entry2)
					{
						createBtn.innerHTML = mxUtils.htmlEntities(mxResources.get('create'));
						showLinkToDiagram();
						swapActiveItem(entry2, "geTempDlgNewDiagramCatItemActive", cat2);
					}
				});
				
				mxEvent.addListener(entry, 'dblclick', handleDialogOK);
			})(cat, entry);
		}
		
		showAllBtn.style.display = newDiagramCats.length < 5 ? "none" : "";
	};
	
	mxEvent.addListener(showAllBtn, 'click', function()
	{
		if (showingAll)
		{
			newDiagramCat.style.height = "280px";
			newDiagramCatList.style.height = "190px";
			showAllBtn.innerHTML = mxUtils.htmlEntities(mxResources.get('showAll', null, '+ Show all'));
			fillNewDiagramCats(newDiagramCats);
		}
		else 
		{
			newDiagramCat.style.height = "440px";
			newDiagramCatList.style.height = "355px";
			showAllBtn.innerHTML = mxUtils.htmlEntities(mxResources.get('showLess', null, '- Show less'));
			fillNewDiagramCats(newDiagramCats, true);
		}

		showingAll = !showingAll;
	});
	
	function fillTemplatesList(categories)
	{
		var list = dlgDiv.querySelector(".geTemplatesList");
		
		for (var cat in categories)
		{
			var entry = document.createElement('div');
			var label = mxResources.get(cat);
			var templateList = categories[cat];
			
			if (label == null)
			{
				label = cat.substring(0, 1).toUpperCase() + cat.substring(1);
			}
			
			entry.className = 'geTemplateCatLink';
			entry.setAttribute('title', label + ' (' + templateList.length + ')');
			
			label = mxUtils.htmlEntities(label);
			
			if (label.length > 15)
			{
				label = label.substring(0, 15) + '&hellip;';
			}
					
			entry.innerHTML = label + ' (' + templateList.length + ')';
			
			list.appendChild(entry);

			(function(cat2, label2, entry2)
			{
				mxEvent.addListener(entry, 'click', function()
				{
					if (currentEntry != entry2)
					{
						if (currentEntry != null)
						{
							currentEntry.style.fontWeight = 'normal';
							currentEntry.style.textDecoration = 'none';
						}
						else
						{
							newDiagramCat.style.display = 'none';
							diagramsList.style.minHeight = '100%';
						}
						
						currentEntry = entry2;
						currentEntry.style.fontWeight = 'bold';
						currentEntry.style.textDecoration = 'underline';
						
						tempDlgContent.scrollTop = 0;
						
						if (callInitiated)
						{
							cancelPendingCall = true;
						}

						diagramsListTitle.innerHTML = label2;
						diagramsListBtns.style.display = 'none';
						fillDiagramsList(categories[cat2], true);
					}
				});
			})(cat, label, entry);
		}
	};
	
	var indexLoaded = false, indexLoaded2 = false;
	var categories = {};
	var newDiagramCats = [];
	var categoryCount = 1;
	
	mxUtils.get(templateFile, function(req)
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
							clibs: node.getAttribute('clibs'), title: node.getAttribute('title'),
							tooltip: node.getAttribute('url'), imgUrl: node.getAttribute('imgUrl')});
					}
				}
				
				node = node.nextSibling;
			}
			
			fillTemplatesList(categories);
		}
	});
	
	mxUtils.get(newDiagramCatsFile, function(req)
	{
		// Workaround for index loaded 3 times in iOS offline mode
		if (!indexLoaded2)
		{
			indexLoaded2 = true;
			var tmpDoc = req.getXml();
			var node = tmpDoc.documentElement.firstChild;

			while (node != null)
			{
				if (typeof(node.getAttribute) !== 'undefined')
				{
					var title = node.getAttribute('title');
					
					if (title != null)
					{
						newDiagramCats.push({img: node.getAttribute('img'), libs: node.getAttribute('libs'),
							clibs: node.getAttribute('clibs'), title: node.getAttribute('title')});
					}
				}
				
				node = node.nextSibling;
			}
			
			fillNewDiagramCats(newDiagramCats);
		}
	});
	
	var extDiagramsCallback = function(list, errorMsg)
	{
		diagramsListBtns.style.display = '';
		spinner.stop();

		callInitiated = false;
		
		if (cancelPendingCall)
		{
			cancelPendingCall = false;
			return;
		}
		
		if (errorMsg)
		{
			diagramsTiles.innerHTML = errorMsg;
		}
		else if (list.length == 0)
		{
			diagramsTiles.innerHTML = mxUtils.htmlEntities(mxResources.get('noDiagrams', null, 'No Diagrams Found'));
		}
		else
		{
			fillDiagramsList(list, false, showAsList);
		}
	};
	
	function getRecentDocs(getAll)
	{
		if (recentDocsCallback)
		{
			tempDlgContent.scrollTop = 0;
			diagramsTiles.innerHTML = '';
			spinner.spin(diagramsTiles);
			cancelPendingCall = false;
			callInitiated = true;
			diagramsListTitle.innerHTML = mxUtils.htmlEntities(mxResources.get('recentDiag', null, 'Recent Diagrams'));
			lastSearchStr = null;
			recentDocsCallback(extDiagramsCallback, getAll? null : username);
		}
	};
	
	getRecentDocs(isGetAll);

	var delayTimer = null;
	
	function doSearch(searchStr)
	{
		deselectTempCat();
		tempDlgContent.scrollTop = 0;
		diagramsTiles.innerHTML = '';
		spinner.spin(diagramsTiles);
		cancelPendingCall = false;
		callInitiated = true;
		delayTimer = null;
		diagramsListTitle.innerHTML = mxUtils.htmlEntities(mxResources.get('searchResults', null, 'Search Results')) + 
								' "' + mxUtils.htmlEntities(searchStr) + '"';
		searchDocsCallback(searchStr, extDiagramsCallback, isGetAll? null : username);
		lastSearchStr = searchStr;
	};
	
	//TODO use request id to allow only last request to show results
	if (searchDocsCallback)
	{
		//Use keyup to detect delete and backspace
		mxEvent.addListener(dlgDiv.querySelector(".geTempDlgSearchBox"), 'keyup', function(evt)
		{
			var searchInout = this;
			
			if (delayTimer != null)
			{
				clearTimeout(delayTimer);
			}
			
			if (evt.keyCode == 13)
			{
				doSearch(searchInout.value);
			}
			else
			{
				delayTimer = setTimeout(function()
				{
					doSearch(searchInout.value);	
				}, 500);
			}
		});
	}
	
	mxEvent.addListener(createBtn, 'click', handleDialogOK);
	
	mxEvent.addListener(dlgDiv.querySelector(".geTempDlgLinkToDiagramBtn"), 'click', function(evt)
	{
		handleDialogOK(true);
	});

	mxEvent.addListener(dlgDiv.querySelector('.geTempDlgCancelBtn'), 'click', function()
	{
		if (cancelCallback != null)
		{
			cancelCallback();
		}
		
		editorUi.hideDialog(true);
	});
};


/**
 * Constructs a new popup opener button dialog.
 */
var BtnDialog = function(editorUi, peer, btnLbl, fn)
{
	var div = document.createElement('div');
	div.style.textAlign = 'center';
	
	var hd = document.createElement('p');
	hd.style.fontSize = '16pt';
	hd.style.padding = '0px';
	hd.style.margin = '0px';
	hd.style.color = 'gray';
	
	mxUtils.write(hd, mxResources.get('done'));
	
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
	else if (peer == editorUi.gitHub)
	{
		service = mxResources.get('github');
		img.src = IMAGE_PATH + '/github-logo-white.svg';
	}
	else if (peer == editorUi.gitLab)
	{
		service = mxResources.get('gitlab');
		img.src = IMAGE_PATH + '/gitlab-logo.svg';
	}
	else if (peer == editorUi.trello)
	{
		service = mxResources.get('trello');
		img.src = IMAGE_PATH + '/trello-logo-white.svg';
	}
	
	var p = document.createElement('p');
	mxUtils.write(p, mxResources.get('authorizedIn', [service], 'You are now authorized in {1}'));

	var button = mxUtils.button(btnLbl, fn);

	button.insertBefore(img, button.firstChild);
	button.style.marginTop = '6px';
	button.className = 'geBigButton';
	button.style.fontSize = '18px';
	button.style.padding = '14px';

	div.appendChild(hd);
	div.appendChild(p);
	div.appendChild(button);
	
	this.container = div;
};

/**
 * Constructs a new font dialog.
 */
var FontDialog = function(editorUi, curFontname, curUrl, curType, fn)
{
	var row, td, label;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.style.marginTop = '8px';

	//System fonts section
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.whiteSpace = 'nowrap';
	td.style.fontSize = '10pt';
	td.style.fontWeight = 'bold';
	
	var sysFontRadio = document.createElement('input');
	sysFontRadio.style.cssText = 'margin-right:8px;margin-bottom:8px;';
	sysFontRadio.setAttribute('value', 'sysfonts');
	sysFontRadio.setAttribute('type', 'radio');
	sysFontRadio.setAttribute('name', 'current-fontdialog');
	sysFontRadio.setAttribute('id', 'fontdialog-sysfonts');
	td.appendChild(sysFontRadio);
	
	label = document.createElement('label');
	label.setAttribute('for', 'fontdialog-sysfonts');
	mxUtils.write(label, (mxResources.get('sysFonts', null, 'System Fonts')));
	td.appendChild(label);
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.whiteSpace = 'nowrap';
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	td.style.paddingLeft = '15px';
	mxUtils.write(td, (mxResources.get('fontname', null, 'Font Name')) + ':');

	row.appendChild(td);
	
	var sysFontInput = document.createElement('input');
	
	if (curType == 's')
	{
		sysFontInput.setAttribute('value', curFontname);
	}
	
	sysFontInput.style.marginLeft = '4px';
	sysFontInput.style.width = '250px';
	sysFontInput.className = 'dlg_fontName_s';
	
	td = document.createElement('td');
	td.appendChild(sysFontInput);
	row.appendChild(td);
	
	tbody.appendChild(row);

	//Google fonts section
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.whiteSpace = 'nowrap';
	td.style.fontSize = '10pt';
	td.style.fontWeight = 'bold';
	
	var googleFontRadio = document.createElement('input');
	googleFontRadio.style.cssText = 'margin-right:8px;margin-bottom:8px;';
	googleFontRadio.setAttribute('value', 'googlefonts');
	googleFontRadio.setAttribute('type', 'radio');
	googleFontRadio.setAttribute('name', 'current-fontdialog');
	googleFontRadio.setAttribute('id', 'fontdialog-googlefonts');
	td.appendChild(googleFontRadio);
	
	label = document.createElement('label');
	label.setAttribute('for', 'fontdialog-googlefonts');
	mxUtils.write(label, (mxResources.get('googleFonts', null, 'Google Fonts')));
	td.appendChild(label);
	
	// Link to Google Fonts
	if (!mxClient.IS_CHROMEAPP && (!editorUi.isOffline() || EditorUi.isElectronApp))
	{
		var link = editorUi.menus.createHelpLink('https://fonts.google.com/');
		link.getElementsByTagName('img')[0].setAttribute('valign', 'middle');
		td.appendChild(link);
	}
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.whiteSpace = 'nowrap';
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	td.style.paddingLeft = '15px';
	mxUtils.write(td, (mxResources.get('fontname', null, 'Font Name')) + ':');

	row.appendChild(td);
	
	var googleFontInput = document.createElement('input');

	if (curType == 'g')
	{
		googleFontInput.setAttribute('value', curFontname);
	}
	
	googleFontInput.style.marginLeft = '4px';
	googleFontInput.style.width = '250px';
	googleFontInput.className = 'dlg_fontName_g';
	
	td = document.createElement('td');
	td.appendChild(googleFontInput);
	row.appendChild(td);
	tbody.appendChild(row);
	
	//Generic remote fonts section
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.whiteSpace = 'nowrap';
	td.style.fontSize = '10pt';
	td.style.fontWeight = 'bold';
	
	var webFontRadio = document.createElement('input');
	webFontRadio.style.cssText = 'margin-right:8px;margin-bottom:8px;';
	webFontRadio.setAttribute('value', 'webfonts');
	webFontRadio.setAttribute('type', 'radio');
	webFontRadio.setAttribute('name', 'current-fontdialog');
	webFontRadio.setAttribute('id', 'fontdialog-webfonts');
	td.appendChild(webFontRadio);
	
	label = document.createElement('label');
	label.setAttribute('for', 'fontdialog-webfonts');
	mxUtils.write(label, (mxResources.get('webfonts', null, 'Web Fonts')));
	td.appendChild(label);
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.whiteSpace = 'nowrap';
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	td.style.paddingLeft = '15px';
	mxUtils.write(td, (mxResources.get('fontname', null, 'Font Name')) + ':');

	row.appendChild(td);
	
	var webFontInput = document.createElement('input');

	if (curType == 'w')
	{
		webFontInput.setAttribute('value', curFontname);
	}
	
	webFontInput.style.marginLeft = '4px';
	webFontInput.style.width = '250px';
	webFontInput.className = 'dlg_fontName_w';
	
	td = document.createElement('td');
	td.appendChild(webFontInput);
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.whiteSpace = 'nowrap';
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	td.style.paddingLeft = '15px';
	mxUtils.write(td, (mxResources.get('fontUrl', null, 'Font URL')) + ':');

	row.appendChild(td);
	
	var webFontUrlInput = document.createElement('input');
	webFontUrlInput.setAttribute('value', curUrl || '');
	webFontUrlInput.style.marginLeft = '4px';
	webFontUrlInput.style.width = '250px';
	webFontUrlInput.className = 'dlg_fontUrl';
	
	td = document.createElement('td');
	td.appendChild(webFontUrlInput);
	row.appendChild(td);
	tbody.appendChild(row);
	
	this.init = function()
	{
		var input = sysFontInput;
		
		if (curType == 'g')
		{
			input = googleFontInput;
		}
		else if (curType == 'w')
		{
			input = webFontInput;
		}
		
		input.focus();
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
		{
			input.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};

	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');
	
	if (!editorUi.isOffline())
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			editorUi.openLink('https://www.diagrams.net/blog/external-fonts');
		});
		
		helpBtn.className = 'geBtn';	
		td.appendChild(helpBtn);
	}
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		fn();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	function validateFn(fontName, fontUrl, type)
	{
		var urlPattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		
		if (fontName == null || fontName.length == 0)
		{
			table.querySelector('.dlg_fontName_' + type).style.border = '1px solid red';
			return false;
		}
		
		if (type == 'w' && !urlPattern.test(fontUrl))
		{
			table.querySelector('.dlg_fontUrl').style.border = '1px solid red';
			return false;
		}
		
		return true;
	};
	
	var okBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		var fontName, fontUrl, type;
		
		if (sysFontRadio.checked)
		{
			fontName = sysFontInput.value;
			type = 's';
		}
		else if (googleFontRadio.checked)
		{
			fontName = googleFontInput.value;
			fontUrl = Editor.GOOGLE_FONTS + encodeURIComponent(fontName).replace(/%20/g, '+');
			type = 'g';
		}
		else if (webFontRadio.checked)
		{
			fontName = webFontInput.value;
			fontUrl = webFontUrlInput.value;
			type = 'w';
		}
		
		if (validateFn(fontName, fontUrl, type))
		{
			fn(fontName, fontUrl, type);
			editorUi.hideDialog();
		}
	});
	okBtn.className = 'geBtn gePrimaryBtn';

	function enterSubmit(e)
	{
		this.style.border = '';
		
		if (e.keyCode == 13)
		{
			okBtn.click();
		}
	};
	
	mxEvent.addListener(sysFontInput, 'keypress', enterSubmit);
	mxEvent.addListener(googleFontInput, 'keypress', enterSubmit);
	mxEvent.addListener(webFontInput, 'keypress', enterSubmit);
	mxEvent.addListener(webFontUrlInput, 'keypress', enterSubmit);
	
	mxEvent.addListener(sysFontInput, 'focus', function()
	{
		sysFontRadio.setAttribute('checked', 'checked');
		sysFontRadio.checked = true;
	});
	
	mxEvent.addListener(googleFontInput, 'focus', function()
	{
		googleFontRadio.setAttribute('checked', 'checked');
		googleFontRadio.checked = true;
	});

	mxEvent.addListener(webFontInput, 'focus', function()
	{
		webFontRadio.setAttribute('checked', 'checked');
		webFontRadio.checked = true;
	});

	mxEvent.addListener(webFontUrlInput, 'focus', function()
	{
		webFontRadio.setAttribute('checked', 'checked');
		webFontRadio.checked = true;
	});

	td.appendChild(okBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	
	this.container = table;
};

/* Aspect Dialog
 * @module drawio/aspect-dialog
 */
function AspectDialog(editorUi, pageId, layerIds, okFn, cancelFn)
{
	this.aspect = {pageId : pageId || (editorUi.pages? editorUi.pages[0].getId() : null), layerIds : layerIds || []};
	var div = document.createElement('div');
	
	var title = document.createElement('h5');
	title.style.margin = '0 0 10px';
	mxUtils.write(title, mxResources.get('pages'));
	div.appendChild(title);

	var pagesContainer = document.createElement('div');
	pagesContainer.className = 'geAspectDlgList';
	div.appendChild(pagesContainer);

	title = document.createElement('h5');
	title.style.margin = '0 0 10px';
	mxUtils.write(title, mxResources.get('layers'));
	div.appendChild(title);

	var layersContainer = document.createElement('div');
	layersContainer.className = 'geAspectDlgList';
	div.appendChild(layersContainer);
	
	this.pagesContainer = pagesContainer;
	this.layersContainer = layersContainer;
	this.ui = editorUi;
	
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

	var okBtn = mxUtils.button(mxResources.get('ok'), mxUtils.bind(this, function()
	{
		editorUi.hideDialog();
		okFn({pageId: this.selectedPage, layerIds: Object.keys(this.selectedLayers)});
	}));

	btns.appendChild(okBtn);
	okBtn.className = 'geBtn gePrimaryBtn';
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	okBtn.setAttribute('disabled', 'disabled');
	this.okBtn = okBtn;
	div.appendChild(btns);
	this.container = div;
};

//Drawing the graph with dialog not visible doesn't get dimensions right. It has to be visible!
AspectDialog.prototype.init = function()
{
	var xml = this.ui.getFileData(true); //Force pages to update their nodes
	
	if (this.ui.pages)
	{
		for (var i = 0; i < this.ui.pages.length; i++)
		{
			var page = this.ui.updatePageRoot(this.ui.pages[i]);
	
			this.createPageItem(page.getId(), page.getName(), page.node);
		}
	}
	else
	{
		this.createPageItem('1', 'Page-1', mxUtils.parseXml(xml).documentElement);
	}
};

AspectDialog.prototype.createViewer = function(container, pageNode, layerId)
{
	mxEvent.disableContextMenu(container);
	container.style.userSelect = 'none';

	var graph = new Graph(container);
	graph.setTooltips(false);
	graph.setEnabled(false);
	graph.setPanning(false);
	graph.minFitScale = null;
	graph.maxFitScale = null;
	graph.centerZoom = true;
	
	var node = pageNode.nodeName == 'mxGraphModel'? pageNode : Editor.parseDiagramNode(pageNode); //Handles compressed and non-compressed page node
	
	if (node != null)
	{
		var bg = node.getAttribute('background');
		
		if (bg == null || bg == '' || bg == mxConstants.NONE)
		{
			bg = '#ffffff';
		}
		
		container.style.backgroundColor = bg;
		
		var codec = new mxCodec(node.ownerDocument);
		var model = graph.getModel();
		codec.decode(node, model);
		
		var childCount = model.getChildCount(model.root);
		
		var showAll = layerId == null;
		
		// handle layers visibility
		for (var i = 0; i < childCount; i++)
		{
			var child = model.getChildAt(model.root, i);
			model.setVisible(child, showAll || layerId == child.id);
		}

		graph.maxFitScale = 1;
		graph.fit(0);
		graph.center();
	}
	
	return graph;
};

AspectDialog.prototype.createPageItem = function(pageId, pageName, pageNode)
{
	var $listItem = document.createElement('div');
	$listItem.className = 'geAspectDlgListItem';
	$listItem.setAttribute('data-page-id', pageId)
	$listItem.innerHTML = '<div style="max-width: 100%; max-height: 100%;"></div><div class="geAspectDlgListItemText">' + mxUtils.htmlEntities(pageName) + '</div>';
	
	this.pagesContainer.appendChild($listItem);
	
	var graph = this.createViewer($listItem.childNodes[0], pageNode);
	
	var onClick = mxUtils.bind(this, function()
	{
		if (this.selectedItem != null)
		{
			this.selectedItem.className = 'geAspectDlgListItem';
		}
		
		this.selectedItem = $listItem;
		this.selectedPage = pageId;
		$listItem.className += ' geAspectDlgListItemSelected';
		this.layersContainer.innerHTML = '';
		this.selectedLayers = {};
		this.okBtn.setAttribute('disabled', 'disabled');
		
		var graphModel = graph.model;
		var layers = graphModel.getChildCells(graphModel.getRoot());
		
		for (var i = 0; i < layers.length; i++) 
		{
			this.createLayerItem(layers[i], pageId, graph, pageNode);
		}
	});
	
	mxEvent.addListener($listItem, 'click', onClick);
	
	if(this.aspect.pageId == pageId) 
	{
		onClick();
	}
};

AspectDialog.prototype.createLayerItem = function(layer, pageId, graph, pageNode)
{
	var layerName = graph.convertValueToString(layer) || (mxResources.get('background') || 'Background');
	var $listItem = document.createElement('div');
	$listItem.setAttribute('data-layer-id', layer.id);
	$listItem.className = 'geAspectDlgListItem';
	$listItem.innerHTML = '<div style="max-width: 100%; max-height: 100%;"></div><div class="geAspectDlgListItemText">' + mxUtils.htmlEntities(layerName) + '</div>';
	this.layersContainer.appendChild($listItem);
	
	this.createViewer($listItem.childNodes[0], pageNode, layer.id);

	var onClick = mxUtils.bind(this, function()
	{
		if ($listItem.className.indexOf('geAspectDlgListItemSelected') >= 0) //Selected
		{
			$listItem.className = 'geAspectDlgListItem';
			delete this.selectedLayers[layer.id];
			
			if (Object.keys(this.selectedLayers).length == 0)
			{
				this.okBtn.setAttribute('disabled', 'disabled');
			}
		}
		else
		{
			$listItem.className += ' geAspectDlgListItemSelected';
			this.selectedLayers[layer.id] = true;
			this.okBtn.removeAttribute('disabled');
		}
	});
	
	mxEvent.addListener($listItem, 'click', onClick);
	
	if(this.aspect.layerIds.indexOf(layer.id) != -1) 
	{
		onClick();
	}
};

/**
 * Constructs a new page setup dialog.
 */
var FilePropertiesDialog = function(editorUi)
{	
	var row, td;
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.style.width = '100%';
	table.style.marginTop = '8px';
	
	var file = editorUi.getCurrentFile();
	var filename = (file != null && file.getTitle() != null) ?
		file.getTitle() : this.editorUi.defaultFilename;
	var isPng = /(\.png)$/i.test(filename);
	var apply = null;

	if (isPng)
	{
		var scale = 1;
		var border = 0;
		var node = editorUi.fileNode;
	
		if (node != null)
		{
			if (node.hasAttribute('scale'))
			{
				scale = parseFloat(node.getAttribute('scale'));
			}
			
			if (node.hasAttribute('border'))
			{
				border = parseInt(node.getAttribute('border'));
			}
		}
		
		row = document.createElement('tr');
		td = document.createElement('td');
		td.style.whiteSpace = 'nowrap';
		td.style.fontSize = '10pt';
		td.style.width = '120px';
		mxUtils.write(td, mxResources.get('zoom') + ':');
		
		row.appendChild(td);
	
		var zoomInput = document.createElement('input');
		zoomInput.setAttribute('value', (scale * 100) + '%');
		zoomInput.style.marginLeft = '4px';
		zoomInput.style.width ='180px';
		
		td = document.createElement('td');
		td.style.whiteSpace = 'nowrap';
		td.appendChild(zoomInput);
		row.appendChild(td);
		tbody.appendChild(row);
		
		row = document.createElement('tr');
		td = document.createElement('td');
		td.style.whiteSpace = 'nowrap';
		td.style.fontSize = '10pt';
		td.style.width = '120px';
		mxUtils.write(td, mxResources.get('borderWidth') + ':');
		
		row.appendChild(td);
	
		var borderInput = document.createElement('input');
		borderInput.setAttribute('value', border);
		borderInput.style.marginLeft = '4px';
		borderInput.style.width ='180px';
		
		td = document.createElement('td');
		td.style.whiteSpace = 'nowrap';
		td.appendChild(borderInput);
		row.appendChild(td);
		tbody.appendChild(row);
		
		this.init = function()
		{
			zoomInput.focus();
			
			if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
			{
				zoomInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		};
		
		apply = function()
		{
			if (editorUi.fileNode != null)
			{
				editorUi.fileNode.setAttribute('scale', Math.max(0, parseInt(zoomInput.value) / 100));
				editorUi.fileNode.setAttribute('border', Math.max(0, parseInt(borderInput.value)));
				
				if (file != null)
				{
					file.fileChanged();
				}
			}
			
			editorUi.hideDialog();
		};
	}
	else
	{
		var compressed = (file != null) ? file.isCompressed() : Editor.compressXml;

		row = document.createElement('tr');
		td = document.createElement('td');
		td.style.whiteSpace = 'nowrap';
		td.style.fontSize = '10pt';
		td.style.width = '120px';
		mxUtils.write(td, mxResources.get('compressed') + ':');
		
		row.appendChild(td);
	
		var compressedInput = document.createElement('input');
		compressedInput.setAttribute('type', 'checkbox');
		
		if (compressed)
		{
			compressedInput.setAttribute('checked', 'checked');
			compressedInput.defaultChecked = true;
		}

		td = document.createElement('td');
		td.style.whiteSpace = 'nowrap';
		td.appendChild(compressedInput);
		row.appendChild(td);
		tbody.appendChild(row);
		
		this.init = function()
		{
			compressedInput.focus();
		};
		
		apply = function()
		{
			if (editorUi.fileNode != null)
			{
				editorUi.fileNode.setAttribute('compressed', (compressedInput.checked) ? 'true' : 'false');
				
				if (file != null)
				{
					file.fileChanged();
				}
			}
			
			editorUi.hideDialog();
		};
	}
	
	var genericBtn = mxUtils.button(mxResources.get('apply'), apply);
	genericBtn.className = 'geBtn gePrimaryBtn';
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
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

	td.appendChild(genericBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	
	this.container = table;
};
